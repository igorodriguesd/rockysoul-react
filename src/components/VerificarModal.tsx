<<<<<<< HEAD
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import type { Missao } from '../types';
import type { Desafio, Submissao, Verificacao } from '../api/types';
import { ApiError, errorMessage } from '../api/client';
import { imageBase64 } from '../api/evidence';
import { useApi } from '../context/ApiContext';
=======
import { useState, useRef, useEffect, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { useColecao } from '../context/CollectionContext';
import { showToast } from './Toast';
import NovaCarta from './NovaCarta';
import RoletaDrop from './RoletaDrop';
import IconeMissao from './IconeMissao';
import type { Missao, ResultadoDrop } from '../types';
import { MISSION_TO_CARD, CARTAS, LABEL_RARIDADE, CHANCE_DROP_POR_RARIDADE, CUSTO_REGIRAR_POR_RARIDADE, getValorCarta } from '../data/cartas';
import { PARCEIROS, BONUS_ECOPONTO, BONUS_ACAO_PARCEIRO, grupoDaMissao, grupoDaCarta } from '../data/constants';
>>>>>>> origin/main

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
<<<<<<< HEAD
=======

const ROTULO_COMPROVACAO: Record<string, string> = {
  foto: 'Foto',
  'foto-gps': 'Foto + GPS',
  timer: 'Timer',
  declaracao: 'Declaração',
};

export default function VerificarModal({ aberto, onFechar, missao, onVerificado }: Props) {
  const { data, adicionarPontos, adicionarBonus, subtrairPontos, registrarImpactoParceiro } = useData();
  const { adquirirPorMissao } = useColecao();
  const [foto, setFoto] = useState<string | null>(null);
  const [localizacao, setLocalizacao] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'capturando' | 'ok' | 'erro'>('idle');
  const [sucesso, setSucesso] = useState(false);
  const [pontosGanhos, setPontosGanhos] = useState(0);
  const [fotoErro, setFotoErro] = useState(false);
  const [gpsErro, setGpsErro] = useState(false);
  const [drop, setDrop] = useState<ResultadoDrop | null>(null);
  const [roletaPronta, setRoletaPronta] = useState(false);
  const [declaracaoConfirmada, setDeclaracaoConfirmada] = useState(false);
  const [ecopontoId, setEcopontoId] = useState('');
  const [parceiroEntrega, setParceiroEntrega] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);
  const girandoRef = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const confirmarButtonRef = useRef<HTMLButtonElement>(null);

  const tempoTotal = missao.tempoTimer ?? 300;
  const [segundos, setSegundos] = useState(tempoTotal);
  const [timerAtivo, setTimerAtivo] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fechar = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setFoto(null);
    setLocalizacao('');
    setGpsStatus('idle');
    setSucesso(false);
    setPontosGanhos(0);
    setFotoErro(false);
    setDrop(null);
    setRoletaPronta(false);
    setDeclaracaoConfirmada(false);
    setEcopontoId('');
    setParceiroEntrega(null);
    setTentativa(0);
    girandoRef.current = false;
    setSegundos(tempoTotal);
    setTimerAtivo(false);
    onFechar();
  }, [onFechar, tempoTotal]);

  useEffect(() => {
    if (!aberto) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') fechar();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [aberto, fechar]);

  useEffect(() => {
    if (!aberto) return;
    const t = setTimeout(() => confirmarButtonRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [aberto, sucesso]);

  useEffect(() => {
    if (!timerAtivo) return;
    intervalRef.current = setInterval(() => {
      setSegundos(s => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTimerAtivo(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [timerAtivo]);

  if (!aberto) return null;

  const cartaDaMissao = MISSION_TO_CARD[missao.id]
    ? CARTAS.find(c => c.id === MISSION_TO_CARD[missao.id]) ?? null
    : null;

  const grupo = grupoDaMissao(missao.id);

  const ecopontos = PARCEIROS.filter(p => p.tipos.includes('ecoponto'));

  const patrocinadorMissao = PARCEIROS.find(p => p.temas?.includes(missao.id)) ?? null;

  function registrarAcaoParceiro() {
    if (!patrocinadorMissao) return;
    registrarImpactoParceiro(patrocinadorMissao.id, 'acao', BONUS_ACAO_PARCEIRO);
  }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFoto(ev.target?.result as string);
    setFotoErro(false);
    setGpsErro(false);
    };
    reader.readAsDataURL(file);
  }

  function obterGPS() {
    if (!navigator.geolocation) {
      showToast('GPS indisponível neste dispositivo');
      return;
    }
    setGpsStatus('capturando');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalizacao(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setGpsStatus('ok');
        setGpsErro(false);
      },
      () => {
        setGpsStatus('erro');
        showToast('Não foi possível capturar a localização — digite as coordenadas');
      }
    );
  }

  function confirmar() {
    const parceiroSelecionado = ecopontos.find(p => p.id === ecopontoId);
    const bonusEcoponto = parceiroSelecionado ? BONUS_ECOPONTO : 0;
    setParceiroEntrega(parceiroSelecionado?.nome ?? null);

    if (missao.comprovacao === 'declaracao') {
      if (declaracaoFeitaHoje(missao.id)) {
        showToast('Você já declarou esse hábito hoje');
        return;
      }
      if (!declaracaoConfirmada) {
        showToast('Confirme a declaração para registrar a ação');
        return;
      }
      try {
        localStorage.setItem(declaracaoKey(missao.id), hojeStr());
      } catch {
      }
      adicionarPontos(missao.pontos, missao.nome);
      if (parceiroSelecionado) {
        adicionarBonus(BONUS_ECOPONTO, `Entrega no ecoponto ${parceiroSelecionado.nome}`);
        registrarImpactoParceiro(parceiroSelecionado.id, 'entrega', BONUS_ECOPONTO);
      }
      registrarAcaoParceiro();
      setPontosGanhos(missao.pontos + bonusEcoponto);
      setSucesso(true);
      onVerificado?.(missao.id);
      setRoletaPronta(false);
      setDrop(adquirirPorMissao(missao.id, true));
      return;
    }

    if (missao.comprovacao === 'timer') {
      if (segundos !== 0) {
        showToast('Complete o timer para confirmar a ação');
        return;
      }
      adicionarPontos(missao.pontos, missao.nome);
      if (parceiroSelecionado) {
        adicionarBonus(BONUS_ECOPONTO, `Entrega no ecoponto ${parceiroSelecionado.nome}`);
        registrarImpactoParceiro(parceiroSelecionado.id, 'entrega', BONUS_ECOPONTO);
      }
      registrarAcaoParceiro();
      setPontosGanhos(missao.pontos + bonusEcoponto);
      setSucesso(true);
      onVerificado?.(missao.id);
      setRoletaPronta(false);
      setDrop(adquirirPorMissao(missao.id, true));
      return;
    }

    if (!foto) {
      setFotoErro(true);
      showToast('Envie uma foto para confirmar a ação');
      return;
    }
    if (missao.comprovacao === 'foto-gps' && !temLocalizacao) {
      setGpsErro(true);
      showToast('Capture a localização para validar esta ação');
      return;
    }
    adicionarPontos(missao.pontos, missao.nome);
    if (parceiroSelecionado) {
      adicionarBonus(BONUS_ECOPONTO, `Entrega no ecoponto ${parceiroSelecionado.nome}`);
      registrarImpactoParceiro(parceiroSelecionado.id, 'entrega', BONUS_ECOPONTO);
    }
    registrarAcaoParceiro();
    setPontosGanhos(missao.pontos + bonusEcoponto);
    setSucesso(true);
    onVerificado?.(missao.id);
    setRoletaPronta(false);
    setDrop(adquirirPorMissao(missao.id, true));
  }

  const exigeFoto = missao.comprovacao === 'foto' || missao.comprovacao === 'foto-gps';
  const temLocalizacao = localizacao.trim().length > 0 && localizacao.trim() !== 'Permissão negada';
  const chanceDrop = cartaDaMissao ? CHANCE_DROP_POR_RARIDADE[cartaDaMissao.raridade] : 0;
  const custoRegirar = cartaDaMissao ? CUSTO_REGIRAR_POR_RARIDADE[cartaDaMissao.raridade] : 0;

  function girarNovamente() {
    if (girandoRef.current) return;
    if (custoRegirar <= 0 || data.pontos < custoRegirar) {
      showToast('Créditos insuficientes para girar de novo');
      return;
    }
    girandoRef.current = true;
    subtrairPontos(custoRegirar);
    showToast(`-${custoRegirar} créditos · Giro extra na roleta`);
    setTentativa(t => t + 1);
    setDrop(adquirirPorMissao(missao.id, true));
    setRoletaPronta(false);
  }

  function terminarGiro() {
    girandoRef.current = false;
    setRoletaPronta(true);
  }

  return (
    <div className="fixed inset-0 z-9998 flex items-start sm:items-center justify-center px-3 sm:px-6 pt-28 sm:pt-28 pb-3 sm:pb-6 bg-black/60" onClick={fechar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={sucesso ? 'Resultado da ação' : missao.nome}
        className="[background:var(--t-glass-strong)] border border-(--t-glass-strong-border) shadow-(--t-glass-strong-shadow) rounded-2xl shadow-2xl w-[90vw] max-w-[620px] p-4 sm:p-5 relative max-h-[calc(100vh-9.5rem)] supports-[height:100dvh]:max-h-[calc(100dvh-9.5rem)] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={fechar} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors z-10" aria-label="Fechar">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        {sucesso ? (
          <div className="text-center">
            <div
              className="mx-auto w-fit px-6 py-3 rounded-2xl"
              style={{ background: 'linear-gradient(160deg, var(--t-mist), rgba(56,189,248,0.25))', border: '1px solid var(--t-brand-border)' }}
            >
              <h2 className="text-lg font-bold text-slate-900">Ação Verificada</h2>
              <p className="text-sm text-slate-700 mt-0.5">
                <strong className="text-brand">{missao.nome}</strong> registrada com sucesso.
              </p>
            </div>

            {cartaDaMissao ? (
              <>
                <RoletaDrop
                  key={tentativa}
                  carta={cartaDaMissao}
                  chance={chanceDrop}
                  caiu={drop !== null && drop.caiu}
                  onTerminar={terminarGiro}
                />

                {roletaPronta &&
                  (drop === null ? (
                    <div className="mt-4 mx-auto max-w-[300px] rounded-2xl p-4" style={{ background: 'var(--t-surface-2)', border: '1px solid rgba(59,130,246,0.4)' }}>
                      <div className="flex items-center justify-center gap-2.5 mb-1.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
                          <IconeMissao src={cartaDaMissao.icone} cor={grupoDaCarta(cartaDaMissao.id)?.cor ?? '#94a3b8'} className="w-6 h-6" />
                        </div>
                        <p className="text-slate-900 font-bold text-sm">{cartaDaMissao.nome}</p>
                      </div>
                      <p className="text-slate-600 text-xs leading-snug">
                        <strong className="text-brand">{cartaDaMissao.nome}</strong> já está na sua coleção!
                        Continue realizando ações para tentar conquistar outras cartas.
                      </p>
                    </div>
                  ) : drop.caiu && 'novaCarta' in drop ? (
                    <div className="mt-2">
                      <p className="text-brand font-semibold text-sm tracking-wide mb-1">VOCÊ GANHOU A CARTA!</p>
                      <NovaCarta novaCarta={drop.novaCarta} foil={drop.foil} />
                    </div>
                  ) : drop.caiu && 'foil' in drop ? (
                    <div className="mt-4 mx-auto max-w-[300px] rounded-2xl p-4" style={{ background: 'color-mix(in srgb, #FACC15 10%, var(--t-surface-2))', border: '1px solid rgba(250,204,21,0.7)' }}>
                      <div className="flex items-center justify-center gap-2.5 mb-1.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(250,204,21,0.15)' }}>
                          <IconeMissao src={drop.carta.icone} cor={grupoDaCarta(drop.carta.id)?.cor ?? '#94a3b8'} className="w-6 h-6 drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]" />
                        </div>
                        <p className="text-slate-900 font-bold text-sm">{drop.carta.nome} {drop.foil ? '(brilhante)' : ''}</p>
                      </div>
                      <p className="text-slate-700 text-xs leading-snug">
                        <strong className="text-gold-deep">CARTA BRILHANTE!</strong> {drop.carta.nome} evoluiu para a versão
                        premium (valor ×3) e ficou destacada na sua vitrine.
                        <span className="block mt-0.5">
                          <strong className="text-gold">+{getValorCarta(drop.carta) * 2} créditos</strong> no seu saldo
                          (o valor da carta dobrou de {getValorCarta(drop.carta)} para {getValorCarta(drop.carta) * 3}).
                        </span>
                      </p>
                    </div>
                  ) : drop.caiu && 'duplicada' in drop ? (
                    <div className="mt-4 mx-auto max-w-[300px] rounded-2xl p-4" style={{ background: 'var(--t-surface-2)', border: '1px solid rgba(166,108,255,0.5)' }}>
                      <div className="flex items-center justify-center gap-2.5 mb-1.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(166,108,255,0.15)' }}>
                          <IconeMissao src={drop.carta.icone} cor={grupoDaCarta(drop.carta.id)?.cor ?? '#94a3b8'} className="w-6 h-6" />
                        </div>
                        <p className="text-slate-900 font-bold text-sm">Carta repetida</p>
                      </div>
                      <p className="text-slate-600 text-xs leading-snug">
                        Você já tem <strong className="text-slate-700">{drop.carta.nome}</strong>. Ela virou{' '}
                        <strong className="text-[#a66cff]">+{drop.fragmentosGanhos} fragmentos</strong> de {drop.carta.raridade.toLowerCase()}.
                        Junte fragmentos para montar uma carta que falta — clique na carta na aba <strong className="text-slate-700">Minhas cartas</strong> ou use a aba <strong className="text-slate-700">Fragmentos</strong> na Coleção.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 mx-auto max-w-[300px] rounded-2xl p-4" style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-brand-border)' }}>
                      <div className="flex items-center justify-center gap-2.5 mb-1.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--t-mist)' }}>
                          <IconeMissao src={drop.carta.icone} cor={grupoDaCarta(drop.carta.id)?.cor ?? '#94a3b8'} className="w-6 h-6 grayscale opacity-60" />
                        </div>
                        <p className="text-slate-900 font-bold text-sm">{drop.carta.nome}</p>
                      </div>
                      <p className="text-slate-600 text-xs leading-snug">
                        Não foi dessa vez! A carta <strong className="text-slate-700">{drop.carta.nome}</strong> escapou.
                        Nesta ação você tinha <strong className="text-brand">{drop.chance}%</strong> de chance.
                      </p>
                      <div className="mt-3 rounded-xl px-3 py-2.5" style={{ background: 'var(--t-mist)', border: '1px dashed var(--t-brand-border)' }}>
                        <p className="text-xs text-slate-700 leading-snug">
                          Quer arriscar de novo? Gire a roleta por <strong className="text-brand">{custoRegirar} créditos</strong>{' '}
                          e tente a sorte com a mesma chance.
                        </p>
                        <button
                          type="button"
                          onClick={girarNovamente}
                          disabled={data.pontos < custoRegirar}
                          className={`w-full mt-2.5 py-2 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all ${data.pontos < custoRegirar ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                        >
                          Girar de novo · {custoRegirar} créditos
                        </button>
                        {data.pontos < custoRegirar && (
                          <p className="text-[11px] text-red-500 mt-1.5">
                            Você precisa de {custoRegirar - data.pontos} créditos a mais para girar.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </>
            ) : (
              <img src="/icons/sucesso.svg" alt="Sucesso" className="w-12 h-12 mx-auto mt-2" />
            )}

            <p className="text-gold-deep text-2xl font-bold mt-4">+{pontosGanhos} créditos</p>
            <p className="text-slate-500 text-[11px] mt-0.5">créditos da ação · cartas ganhas creditam o valor delas à parte</p>
            {(patrocinadorMissao || parceiroEntrega) && (
              <div
                className="mt-3 mx-auto max-w-[380px] rounded-xl px-3 py-2.5 text-left"
                style={{ background: 'var(--t-mist)', border: '1px dashed var(--t-brand-border)' }}
              >
                <p className="text-[11px] text-slate-600 leading-snug">
                  <strong className="text-slate-900">Impacto nos parceiros</strong>
                </p>
                {parceiroEntrega && (
                  <p className="text-[11px] text-slate-600 leading-snug mt-1">
                    Entrega em <strong style={{ color: 'var(--color-brand)' }}>{parceiroEntrega}</strong> ·{' '}
                    <strong className="text-gold">+{BONUS_ECOPONTO} créditos</strong>
                  </p>
                )}
                {patrocinadorMissao && (
                  <p className="text-[11px] text-slate-600 leading-snug mt-1">
                    Sua ação entrou no impacto de{' '}
                    <strong style={{ color: 'var(--color-brand)' }}>{patrocinadorMissao.nome}</strong> ·{' '}
                    <strong className="text-gold">+{BONUS_ACAO_PARCEIRO} crédito de impacto</strong>
                  </p>
                )}
              </div>
            )}
            <button
              onClick={fechar}
              className="w-full py-2.5 mt-4 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all"
            >
              Concluir
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <IconeMissao src={missao.icone} cor={grupo.texto} className="w-8 h-8" />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">{missao.nome}</h2>
                <p className="text-[11px] font-semibold" style={{ color: grupo.texto }}>
                  {grupo.label} · +{missao.pontos} créditos
                </p>
              </div>
              <div className="flex-1" />
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap"
                style={{ background: `${grupo.cor}2e`, color: grupo.texto }}
              >
                {ROTULO_COMPROVACAO[missao.comprovacao]}
              </span>
            </div>

            <div className="rounded-xl px-3.5 py-3 mb-4" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: grupo.texto }}>
                Como fazer
              </p>
              <p className="text-sm text-slate-700 leading-snug mb-2.5">{missao.descricao}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: grupo.texto }}>
                Como validar
              </p>
              <p className="text-sm text-slate-700 leading-snug">{missao.comoValidar}</p>
              {missao.comprovantes.length > 0 && (
                <>
                  <p className="text-[10px] font-bold uppercase tracking-wide mt-2.5 mb-1" style={{ color: grupo.texto }}>
                    Comprovantes aceitos
                  </p>
                  <ul className="space-y-1">
                    {missao.comprovantes.map(c => (
                      <li key={c} className="flex items-start gap-1.5 text-[12px] text-slate-600 leading-snug">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: grupo.cor }} />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {cartaDaMissao && (
              <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 mb-4" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
                <IconeMissao src={cartaDaMissao.icone} cor={grupoDaCarta(cartaDaMissao.id)?.cor ?? '#94a3b8'} className="w-5 h-5 shrink-0" />
                <p className="text-[11px] text-slate-700 leading-snug">
                  Ao concluir: carta <b className="text-slate-900">{cartaDaMissao.nome}</b> · {LABEL_RARIDADE[cartaDaMissao.raridade]} ·{' '}
                  <b className="text-brand">{chanceDrop}%</b> de chance de ganhar carta
                  <span className="block mt-0.5 text-slate-600">
                    Se cair, ela vale <b className="text-gold">{getValorCarta(cartaDaMissao)} créditos</b> no seu saldo
                    (×3 se vier brilhante).
                  </span>
                </p>
              </div>
            )}

            <div className="space-y-3">
              {exigeFoto && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Envie uma foto do comprovante (item, nota fiscal ou recibo) *</p>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} className="hidden" aria-label="Enviar foto" />
                  {foto ? (
                    <div className="relative">
                      <img src={foto} alt="Preview" className="w-full max-h-[210px] object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => { setFoto(null); setFotoErro(true); fileRef.current!.value = ''; }}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                        aria-label="Remover foto"
                      >
                        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-xl py-8 transition-colors flex flex-col items-center gap-2 ${fotoErro
                        ? 'border-red-400/60 text-red-500 hover:border-red-500 hover:text-red-500'
                        : 'border-slate-300 text-slate-500 hover:border-brand hover:text-brand'
                        }`}
                    >
                      <img src="/icons/camera.svg" alt="" className="w-7 h-7 opacity-40" />
                      <span className="text-sm">Clique para enviar foto</span>
                    </button>
                  )}
                  {fotoErro && !foto && (
                    <p className="text-xs text-red-500 mt-1.5">A foto é obrigatória para confirmar a ação.</p>
                  )}
                </div>
              )}

              {missao.comprovacao === 'timer' && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Conclua no tempo (máx. {formatarTempo(tempoTotal)})</p>
                  <div className="rounded-xl p-5 text-center" style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-slate-200)' }}>
                    <p className={`font-bold font-serif-display tracking-tight ${segundos === 0 ? 'text-brand' : 'text-slate-900'}`} style={{ fontSize: 44 }}>
                      {formatarTempo(segundos)}
                    </p>
                    <div className="w-full h-2 rounded-full overflow-hidden mt-3" style={{ background: 'var(--t-slate-200)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${((tempoTotal - segundos) / tempoTotal) * 100}%`,
                          background: segundos === 0 ? 'var(--t-grad-brand)' : 'var(--t-grad-brand)',
                        }}
                      />
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                      {!timerAtivo && segundos !== 0 ? (
                        <button
                          type="button"
                          onClick={() => setTimerAtivo(true)}
                          className="px-6 py-2.5 bg-brand text-(--t-onaccent) font-semibold rounded-xl hover:bg-brand-hover transition-all"
                        >
                          Iniciar timer
                        </button>
                      ) : timerAtivo ? (
                        <button
                          type="button"
                          onClick={() => setTimerAtivo(false)}
                          className="px-6 py-2.5 text-slate-600 font-semibold rounded-xl transition-colors hover:bg-slate-300"
                          style={{ background: 'var(--t-slate-200)' }}
                        >
                          Pausar
                        </button>
                      ) : (
                        <span className="px-6 py-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                          <img src="/icons/check.svg" alt="" className="w-4 h-4" /> Tempo concluído!
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-3">
                      Ao finalizar, confirme abaixo para ganhar os créditos.
                    </p>
                  </div>
                </div>
              )}

              {missao.comprovacao === 'declaracao' && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Confiável e simples</p>
                  <div className="rounded-xl p-5 text-center" style={{ background: 'var(--t-surface-2)', border: '1px dashed var(--t-slate-300)' }}>
                    <p className="text-sm text-slate-600">
                      {declaracaoFeitaHoje(missao.id)
                        ? 'Você já declarou esse hábito hoje. Volte amanhã!'
                        : 'Declare que você praticou o hábito hoje para ganhar os créditos.'}
                    </p>
                  </div>
                  {!declaracaoFeitaHoje(missao.id) && (
                    <label className="flex items-start gap-2.5 mt-3 px-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={declaracaoConfirmada}
                        onChange={e => setDeclaracaoConfirmada(e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-brand"
                      />
                      <span className="text-sm text-slate-600">
                        Confirmo que pratico este hábito e declaro minha ação de forma verdadeira.
                      </span>
                    </label>
                  )}
                </div>
              )}

              {(missao.comprovacao === 'foto' || missao.comprovacao === 'foto-gps') && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">
                    Localização {missao.comprovacao === 'foto-gps' ? '(obrigatória)' : '(opcional)'}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={localizacao}
                      onChange={e => { setLocalizacao(e.target.value); setGpsErro(false); }}
                      placeholder="Latitude, Longitude"
                      className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none text-slate-900 placeholder-slate-400 focus:border-brand focus:ring-1 focus:ring-brand"
                      style={{ background: 'var(--t-surface)', border: '1px solid var(--t-slate-300)' }}
                    />
                    <button
                      type="button"
                      onClick={obterGPS}
                      disabled={gpsStatus === 'capturando'}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-medium transition-colors text-sm whitespace-nowrap disabled:opacity-50"
                      style={{ background: 'var(--t-mist)', color: 'var(--color-brand)' }}
                    >
                      <img src="/icons/localizacao.svg" alt="" className="w-4 h-4" />
                      {gpsStatus === 'capturando' ? 'Capturando...' : gpsStatus === 'ok' ? 'Capturado' : 'GPS'}
                    </button>
                  </div>
                  {gpsErro && !temLocalizacao && (
                    <p className="text-xs text-red-500 mt-1.5">A localização é obrigatória para validar esta ação.</p>
                  )}
                </div>
              )}

              {missao.admiteEcoponto && ecopontos.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-700">Entregou em um ecoponto parceiro?</p>
                    <span className="text-[11px] font-bold text-brand">+{BONUS_ECOPONTO} créditos</span>
                  </div>
                  <select
                    value={ecopontoId}
                    onChange={e => setEcopontoId(e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-slate-900 focus:border-brand focus:ring-1 focus:ring-brand"
                    style={{ background: 'var(--t-surface)', border: '1px solid var(--t-slate-300)' }}
                  >
                    <option value="">Não entreguei (sem bônus)</option>
                    {ecopontos.map(p => (
                      <option key={p.id} value={p.id} style={{ color: '#0f172a' }}>
                        {p.nome} · {p.localizacao}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Marque aqui se você levou materiais recicláveis a um parceiro — a foto já comprova a entrega.
                  </p>
                </div>
              )}

              <button
                ref={confirmarButtonRef}
                onClick={confirmar}
                disabled={(missao.comprovacao === 'timer' && segundos !== 0) || (missao.comprovacao === 'declaracao' && !declaracaoConfirmada)}
                className="w-full py-2.75 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {missao.comprovacao === 'timer' && segundos !== 0
                  ? 'Confirme após concluir o tempo'
                  : missao.comprovacao === 'declaracao'
                    ? 'Confirmar Declaração'
                    : 'Confirmar Ação'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
>>>>>>> origin/main
