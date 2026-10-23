import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { grupoDaMissao } from '../data/constants';
import IconeMissao from './IconeMissao';
import type { Missao } from '../types';
import type { Desafio, Submissao, Verificacao } from '../api/types';
import { ApiError, errorMessage } from '../api/client';
import { imageBase64 } from '../api/evidence';
import { useApi } from '../context/ApiContext';

interface Props { aberto: boolean; onFechar: () => void; missao: Missao; onVerificado?: (missaoId: string) => void }
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
      const issued = await service.challenge(Number(missao.acaoId ?? missao.id));
      if (!mounted.current) { stopCamera(); return; }
      if (!issued.id || issued.acaoId !== Number(missao.acaoId ?? missao.id) || !/^[A-Z2-9]{6}$/.test(issued.codigo) || !Number.isFinite(Date.parse(issued.expiraEm)) || Date.parse(issued.expiraEm) <= Date.now()) throw new Error('Desafio inválido ou expirado. Tente iniciar novamente.');
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
        current = { key: crypto.randomUUID(), body: { acaoId: Number(missao.acaoId ?? missao.id), desafioId: challenge.id, descricao: description.trim(), imagemBase64: await imageBase64(file) } };
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
  const grupo = grupoDaMissao(missao.id);
  const decision = result?.estado === 'APROVADA' ? `Ação aprovada! +${result.pontosCreditados} pontos confirmados.` : result?.estado === 'REJEITADA' ? 'A foto não foi aceita para esta ação. Nenhum ponto foi creditado.' : 'A evidência precisa de revisão. Nenhum ponto foi creditado automaticamente.';
  return createPortal(<div className="fixed inset-0 z-9998 flex items-start sm:items-center justify-center px-3 sm:px-6 pt-28 sm:pt-28 pb-3 sm:pb-6 bg-black/60" onClick={() => { if (!busy && !preparing) onFechar(); }}>
    <div role="dialog" aria-modal="true" aria-label={result ? 'Resultado da ação' : missao.nome} className="[background:var(--t-glass-strong)] border border-(--t-glass-strong-border) shadow-(--t-glass-strong-shadow) rounded-2xl shadow-2xl w-[90vw] max-w-[620px] p-4 sm:p-5 relative max-h-[calc(100vh-9.5rem)] supports-[height:100dvh]:max-h-[calc(100dvh-9.5rem)] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <button onClick={onFechar} disabled={busy || preparing} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors z-10" aria-label="Fechar"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
      {result ? <div className="text-center"><div className="mx-auto w-fit px-6 py-3 rounded-2xl" style={{ background: 'linear-gradient(160deg, var(--t-mist), rgba(56,189,248,0.25))', border: '1px solid var(--t-brand-border)' }}><h2 className="text-lg font-bold text-slate-900">{result.estado === 'APROVADA' ? 'Ação aprovada' : result.estado === 'REJEITADA' ? 'Ação rejeitada' : 'Ação enviada para revisão'}</h2><p role="status" className="text-sm text-slate-700 mt-0.5">{decision}</p></div><p className="text-gold-deep text-2xl font-bold mt-4">+{result.pontosCreditados} créditos</p><p className="text-slate-500 text-[11px] mt-0.5">Protocolo: {result.id}</p><button onClick={onFechar} className="w-full py-2.5 mt-4 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all">Concluir</button></div> : <form onSubmit={submit}>
        <div className="flex items-center gap-3 mb-4"><IconeMissao src={missao.icone} cor={grupo.texto} className="w-8 h-8" /><div><h2 className="text-base sm:text-lg font-bold text-slate-900">{missao.nome}</h2><p className="text-[11px] font-semibold" style={{ color: grupo.texto }}>{grupo.label} · +{missao.pontos} créditos</p></div><div className="flex-1" /><span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap" style={{ background: `${grupo.cor}2e`, color: grupo.texto }}>Foto</span></div>
        <div className="rounded-xl px-3.5 py-3 mb-4" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}><p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: grupo.texto }}>Como fazer</p><p className="text-sm text-slate-700 leading-snug mb-2.5">{missao.descricao}</p><p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: grupo.texto }}>Como validar</p><p className="text-sm text-slate-700 leading-snug">{missao.comoValidar}</p></div>
        <div className="space-y-3">
          {challenge && <div className="rounded-xl px-3.5 py-3 mb-4" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}><p className="text-sm font-medium text-slate-700 mb-2">Escreva em papel e fotografe junto da ação:</p><p aria-label="Código do desafio" className="text-gold-deep text-2xl font-bold mt-4">{challenge.codigo}</p><p role="status" className="text-slate-500 text-[11px] mt-0.5">{expired ? 'Desafio expirado. Inicie uma nova captura.' : `Válido por ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`}</p></div>}
          {camera && <video ref={video} onLoadedData={() => setCameraReady(true)} autoPlay muted playsInline aria-label="Prévia da câmera" className="w-full max-h-[210px] object-cover rounded-xl" />}
          {file && preview ? <div className="relative"><img src={preview} alt="Foto capturada para a ação" className="w-full max-h-[210px] object-cover rounded-xl" /><button type="button" disabled={busy || preparing || ambiguous} onClick={() => { void startCamera(); }} className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70" aria-label="Refazer captura">✕</button></div> : <button type="button" disabled={busy || preparing || ambiguous || (camera && !cameraReady)} onClick={() => { if (camera && !expired) void capture(); else void startCamera(); }} className={`w-full border-2 border-dashed rounded-xl py-8 transition-colors flex flex-col items-center gap-2 ${error ? 'border-red-400/60 text-red-500 hover:border-red-500 hover:text-red-500' : 'border-slate-300 text-slate-500 hover:border-brand hover:text-brand'}`}><img src="/icons/camera.svg" alt="" className="w-7 h-7 opacity-40" /><span className="text-sm">{preparing ? 'Preparando…' : camera && !expired ? 'Capturar foto' : 'Iniciar câmera e desafio'}</span></button>}
          <label className="block text-sm font-medium text-slate-700 mb-2">Descrição<textarea required minLength={1} maxLength={1000} value={description} disabled={busy || ambiguous} onChange={event => setDescription(event.target.value)} className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-slate-900 placeholder-slate-400 focus:border-brand focus:ring-1 focus:ring-brand" style={{ background: 'var(--t-surface)', border: '1px solid var(--t-slate-300)' }} /></label>
          {ambiguous && <p role="status" className="text-sm text-slate-700 leading-snug">O envio pode ter sido processado. Consulte suas verificações. A repetição usa a mesma imagem, desafio e chave.</p>}
          <button disabled={busy || preparing || !description.trim() || (!operation && (!file || expired))} className="w-full py-2.75 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed">{busy ? 'Verificando…' : ambiguous ? 'Consultar envio' : 'Confirmar Ação'}</button>
        </div>
      </form>}
      {error && <p role="alert" className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div></div>, document.body);
}
