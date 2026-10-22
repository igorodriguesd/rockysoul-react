import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import type { Missao } from '../types';
import type { Desafio, Submissao, Verificacao } from '../api/types';
import { ApiError, errorMessage } from '../api/client';
import { imageBase64 } from '../api/evidence';
import { useApi } from '../context/ApiContext';

interface Props { aberto: boolean; onFechar: () => void; missao: Missao; onVerificado?: (missaoId: string) => void }
const button = 'rounded-xl px-4 py-2.5 bg-[#22c55e] text-white text-sm font-semibold hover:bg-[#16a34a] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const secondary = 'rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
export default function VerificarModal(props: Props) { return props.aberto ? <CaptureForm key={props.missao.id} {...props} /> : null; }
function CaptureForm({ onFechar, missao, onVerificado }: Props) {
  const { service, refresh, refreshProfile, user } = useApi();
  const [description, setDescription] = useState(''); const [file, setFile] = useState<File | null>(null);
  const [challenge, setChallenge] = useState<Desafio | null>(null); const [camera, setCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [preparing, setPreparing] = useState(false);
  const [result, setResult] = useState<Verificacao | null>(null); const [ambiguous, setAmbiguous] = useState(false);
  const [operation, setOperation] = useState<{ key: string; body: Submissao } | null>(null);
  const [now, setNow] = useState(Date.now); const [preview, setPreview] = useState('');
  const stream = useRef<MediaStream | null>(null); const video = useRef<HTMLVideoElement | null>(null);
  const previewUrl = useRef('');
  const inFlight = useRef(false); const opening = useRef(false); const mounted = useRef(true);
  const expiry = challenge ? new Date(challenge.expiraEm).getTime() : 0;
  const expired = !!challenge && now >= expiry;
  const seconds = Math.max(0, Math.ceil((expiry - now) / 1000));
  function stopCamera() { stream.current?.getTracks().forEach(track => track.stop()); stream.current = null; }
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; stopCamera(); if (previewUrl.current) URL.revokeObjectURL(previewUrl.current); }; }, []);
  useEffect(() => { if (!challenge) return; const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, [challenge]);
  useEffect(() => { if (expired) stopCamera(); }, [expired]);
  useEffect(() => { if (camera && video.current && stream.current) { video.current.srcObject = stream.current; void video.current.play().catch(() => setError('Não foi possível iniciar a câmera.')); } }, [camera]);
  async function startCamera() {
    if (opening.current || inFlight.current || ambiguous) return;
    opening.current = true; setPreparing(true); setError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('A câmera precisa de HTTPS ou localhost e de um navegador compatível.');
      stopCamera(); setCameraReady(false); setCamera(false); const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false });
      if (!mounted.current) { media.getTracks().forEach(track => track.stop()); return; }
      stream.current = media;
      const issued = await service.challenge(Number(missao.id));
      if (!mounted.current) { stopCamera(); return; }
      if (!issued.id || issued.acaoId !== Number(missao.id) || !/^[A-Z2-9]{6}$/.test(issued.codigo) || !Number.isFinite(Date.parse(issued.expiraEm)) || Date.parse(issued.expiraEm) <= Date.now()) throw new Error('Desafio inválido ou expirado. Tente iniciar novamente.');
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current); previewUrl.current = '';
      setFile(null); setPreview(''); setOperation(null); setChallenge(issued); setNow(Date.now()); setCamera(true);
    } catch (failure) {
      stopCamera(); setCamera(false);
      if (!mounted.current) return;
      const denied = failure instanceof DOMException && ['NotAllowedError', 'SecurityError'].includes(failure.name);
      setError(denied ? 'Permita o acesso à câmera nas configurações do navegador para registrar a ação.' : failure instanceof ApiError ? errorMessage(failure) : failure instanceof Error ? failure.message : 'Câmera indisponível.');
    } finally { opening.current = false; if (mounted.current) setPreparing(false); }
  }
  async function capture() {
    const source = video.current;
    if (!source || !challenge || expired || source.readyState < 2 || source.videoWidth < 32 || source.videoHeight < 32 || !stream.current?.getVideoTracks().some(track => track.readyState === 'live')) { setError('Aguarde a câmera e confira se o desafio ainda está válido.'); return; }
    setError(''); setPreparing(true);
    try {
      const scale = Math.min(1, 1280 / Math.max(source.videoWidth, source.videoHeight));
      const canvas = document.createElement('canvas'); canvas.width = Math.round(source.videoWidth * scale); canvas.height = Math.round(source.videoHeight * scale);
      const context = canvas.getContext('2d'); if (!context) throw new Error('Não foi possível capturar a foto.');
      // Capture only camera pixels. The challenge is never stamped onto the evidence.
      context.drawImage(source, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Falha ao gerar a foto.')), 'image/jpeg', .8));
      if (blob.size > 524288) throw new Error('A foto excedeu 512 KiB. Tente novamente com melhor iluminação e enquadramento.');
      if (!mounted.current) return;
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current); previewUrl.current = URL.createObjectURL(blob); setPreview(previewUrl.current);
      setFile(new File([blob], 'captura.jpg', { type: 'image/jpeg' })); stopCamera(); setCamera(false);
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Falha na captura.'); }
    finally { if (mounted.current) setPreparing(false); }
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); if (inFlight.current || !user) return;
    inFlight.current = true; setError(''); setBusy(true);
    try {
      let current = operation;
      if (!current) {
        if (!file || !challenge) throw new Error('Capture a foto com o desafio antes de enviar.');
        if (Date.now() >= Date.parse(challenge.expiraEm)) throw new Error('O desafio expirou. Inicie uma nova captura.');
        current = { key: crypto.randomUUID(), body: { acaoId: Number(missao.id), desafioId: challenge.id, descricao: description.trim(), imagemBase64: await imageBase64(file) } };
        setOperation(current);
      }
      const response = await service.submit(current.body, current.key);
      setResult(response); setAmbiguous(false); stopCamera(); refresh(); onVerificado?.(missao.id);
      await refreshProfile().catch(() => setError('A decisão foi registrada. Atualize seu perfil para consultar o saldo.'));
    } catch (failure) {
      const uncertain = failure instanceof ApiError && (failure.status === 0 || failure.status >= 500 || failure.status === 401);
      setAmbiguous(uncertain); setError(failure instanceof ApiError ? errorMessage(failure) : failure instanceof Error ? failure.message : 'Não foi possível enviar.');
      if (!uncertain) setOperation(null);
    } finally { inFlight.current = false; if (mounted.current) setBusy(false); }
  }
  const decision = result?.estado === 'APROVADA' ? `Ação aprovada! +${result.pontosCreditados} pontos confirmados.` : result?.estado === 'REJEITADA' ? 'A foto não foi aceita para esta ação. Nenhum ponto foi creditado.' : 'A evidência precisa de revisão. Nenhum ponto foi creditado automaticamente.';
  return createPortal(<div className="fixed inset-0 z-9998 flex items-start sm:items-center justify-center p-3 sm:p-6 pt-24 sm:pt-6 bg-black/60"><section role="dialog" aria-modal="true" aria-labelledby="verification-title" className="glass-strong rounded-2xl shadow-2xl w-[90vw] max-w-[620px] p-4 sm:p-5 relative max-h-[calc(100dvh-7rem)] sm:max-h-[90vh] overflow-y-auto">
    <div className="flex justify-between gap-4"><h2 id="verification-title" className="text-xl font-bold">{missao.nome}</h2><button aria-label="Fechar" disabled={busy || preparing} onClick={onFechar}>✕</button></div>
    {result ? <div className="space-y-4 mt-5"><p role="status" className={result.estado === 'APROVADA' ? 'text-green-300' : 'text-amber-200'}>{decision}</p><p className="text-white/65 text-sm">Estado: {result.estado.replaceAll('_', ' ')} · Parecer: {result.parecer?.replaceAll('_', ' ') ?? 'Aguardando'}</p><p className="break-all text-xs text-white/50">Protocolo: {result.id}</p><button className={button} onClick={onFechar}>Acompanhar no dashboard</button></div> : <form onSubmit={submit} className="space-y-4 mt-5">
      <p className="text-white/65 text-sm">Esta ação vale {missao.pontos} pontos. A aprovação automática exige foto compatível, desafio confirmado e limites respeitados. Casos incertos seguem para revisão.</p>
      <label className="block">Descrição<textarea className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-white placeholder-white/40 bg-white/8 border border-white/15 focus:border-[#22c55e] mt-2" required minLength={1} maxLength={1000} value={description} disabled={busy || ambiguous} onChange={event => setDescription(event.target.value)} /></label>
      {challenge && <div className="rounded-xl border border-green-400/25 bg-green-400/5 p-4"><p className="text-sm text-white/80">Escreva este código em um papel e fotografe-o junto da ação, na mesma cena:</p><p className="text-3xl tracking-widest font-bold text-green-300 my-2" aria-label="Código do desafio">{challenge.codigo}</p><p className="text-xs text-white/60">Use letras grandes e mantenha a ação visível. Não escreva o código na descrição nem acrescente texto digital na foto.</p><p role="status" className="text-sm text-amber-200 mt-2">{expired ? 'Desafio expirado. Inicie uma nova captura.' : `Desafio válido por ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`}</p></div>}
      {camera && <video ref={video} onLoadedData={() => setCameraReady(true)} autoPlay muted playsInline aria-label="Prévia da câmera" className="w-full max-h-80 rounded-xl bg-black object-contain" />}
      {file && preview && <img src={preview} alt="Foto capturada para a ação" className="w-full max-h-80 rounded-xl object-contain" />}
      <div className="flex flex-wrap gap-3"><button type="button" className={secondary} disabled={busy || preparing || ambiguous} onClick={() => { void startCamera(); }}>{preparing ? 'Preparando…' : file || expired ? 'Refazer captura' : camera ? 'Reiniciar câmera' : 'Iniciar câmera e desafio'}</button>{camera && <button type="button" className={button} disabled={busy || preparing || expired || !cameraReady} onClick={() => { void capture(); }}>Capturar foto</button>}</div>
      <p className="text-xs text-white/50">Captura pela câmera, sem escolher arquivos da galeria. A foto será enviada ao Gemini. Não inclua rostos, documentos ou dados pessoais.</p>
      {ambiguous && <p className="text-amber-200 text-sm">O envio pode ter sido processado. Consulte suas verificações; repetir usa a mesma foto, desafio e chave, sem criar outra operação.</p>}
      <button disabled={busy || preparing || !description.trim() || (!operation && (!file || expired))} className={`${button} w-full`}>{busy ? 'Verificando evidência…' : ambiguous ? 'Consultar envio repetindo a mesma operação' : 'Enviar para verificação'}</button>
    </form>}
    {error && <p role="alert" className="text-red-300 text-sm mt-4">{error}</p>}
  </section></div>, document.body);
}
