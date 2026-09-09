import { useState, useRef, useEffect, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { useColecao } from '../context/CollectionContext';
import { showToast } from './Toast';
import NovaCarta from './NovaCarta';
import RoletaDrop from './RoletaDrop';
import type { Missao, ResultadoDrop } from '../types';
import { MISSION_TO_CARD, CARTAS, LABEL_RARIDADE, CHANCE_DROP_POR_RARIDADE } from '../data/cartas';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  missao: Missao;
  onVerificado?: (missaoId: string) => void;
}

function formatarTempo(seg: number): string {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${String(m).padStart(1, '0')}:${String(s).padStart(2, '0')}`;
}

function declaracaoKey(missaoId: string): string {
  return `rocky_declarada_${missaoId}`;
}

function hojeStr(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function declaracaoFeitaHoje(missaoId: string): boolean {
  try {
    return localStorage.getItem(declaracaoKey(missaoId)) === hojeStr();
  } catch {
    return false;
  }
}

const DESCRICAO_COMPROVACAO: Record<string, string> = {
  foto: 'Tire uma foto da sua ação para comprovar.',
  'foto-gps': 'Tire uma foto da sua ação. A localização ajuda a validar (opcional).',
  timer: 'Conclua o desafio no tempo. O timer registra sua ação.',
  declaracao: 'Declare que você praticou o hábito hoje (uma vez por dia).',
};

export default function VerificarModal({ aberto, onFechar, missao, onVerificado }: Props) {
  const { adicionarPontos } = useData();
  const { adquirirPorMissao } = useColecao();
  const [foto, setFoto] = useState<string | null>(null);
  const [localizacao, setLocalizacao] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'capturando' | 'ok' | 'erro'>('idle');
  const [sucesso, setSucesso] = useState(false);
  const [pontosGanhos, setPontosGanhos] = useState(0);
  const [fotoErro, setFotoErro] = useState(false);
  const [drop, setDrop] = useState<ResultadoDrop | null>(null);
  const [roletaPronta, setRoletaPronta] = useState(false);
  const [declaracaoConfirmada, setDeclaracaoConfirmada] = useState(false);
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

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFoto(ev.target?.result as string);
      setFotoErro(false);
    };
    reader.readAsDataURL(file);
  }

  function obterGPS() {
    if (!navigator.geolocation) return;
    setGpsStatus('capturando');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalizacao(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setGpsStatus('ok');
      },
      () => {
        setLocalizacao('Permissão negada');
        setGpsStatus('erro');
      }
    );
  }

  function confirmar() {
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
      setPontosGanhos(missao.pontos);
      setSucesso(true);
      showToast(`+${missao.pontos} créditos - ${missao.nome}`);
      onVerificado?.(missao.id);
      setRoletaPronta(false);
      setDrop(adquirirPorMissao(missao.id));
      return;
    }

    if (missao.comprovacao === 'timer') {
      if (segundos !== 0) {
        showToast('Complete o timer para confirmar a ação');
        return;
      }
      adicionarPontos(missao.pontos, missao.nome);
      setPontosGanhos(missao.pontos);
      setSucesso(true);
      showToast(`+${missao.pontos} créditos - ${missao.nome}`);
      onVerificado?.(missao.id);
      setRoletaPronta(false);
      setDrop(adquirirPorMissao(missao.id));
      return;
    }

    if (!foto) {
      setFotoErro(true);
      showToast('Envie uma foto para confirmar a ação');
      return;
    }
    adicionarPontos(missao.pontos, missao.nome);
    setPontosGanhos(missao.pontos);
    setSucesso(true);
    showToast(`+${missao.pontos} créditos - ${missao.nome}`);
    onVerificado?.(missao.id);
    setRoletaPronta(false);
    setDrop(adquirirPorMissao(missao.id));
  }

  const exigeFoto = missao.comprovacao === 'foto' || missao.comprovacao === 'foto-gps';
  const chanceDrop = cartaDaMissao ? CHANCE_DROP_POR_RARIDADE[cartaDaMissao.raridade] : 0;

  return (
    <div className="fixed inset-0 z-9998 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={fechar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={sucesso ? 'Resultado da ação' : missao.nome}
        className="glass-strong rounded-2xl shadow-2xl w-[90vw] max-w-[620px] p-4 sm:p-5 relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={fechar} className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors z-10" aria-label="Fechar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        {sucesso ? (
          <div className="text-center">
            <div
              className="mx-auto w-fit px-6 py-3 rounded-2xl"
              style={{ background: 'linear-gradient(160deg, rgba(32,217,104,0.15), rgba(11,74,44,0.28))', border: '1px solid rgba(32,217,104,0.4)' }}
            >
              <h2 className="text-lg font-bold text-white">Ação Verificada</h2>
              <p className="text-sm text-white/60 mt-0.5">
                <strong className="text-[#20d968]">{missao.nome}</strong> registrada com sucesso.
              </p>
            </div>

            {cartaDaMissao ? (
              <>
                <RoletaDrop
                  carta={cartaDaMissao}
                  chance={chanceDrop}
                  caiu={drop !== null && drop.caiu}
                  onTerminar={() => setRoletaPronta(true)}
                />

                {roletaPronta &&
                  (drop === null ? (
                    <div className="mt-4 mx-auto max-w-[300px] rounded-2xl p-4" style={{ background: 'rgba(15,28,46,0.9)', border: '1px solid rgba(74,222,128,0.35)' }}>
                      <div className="flex items-center justify-center gap-2.5 mb-1.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.12)' }}>
                          <img src={cartaDaMissao.icone} className="w-6 h-6" alt="" />
                        </div>
                        <p className="text-white font-bold text-sm">{cartaDaMissao.nome}</p>
                      </div>
                      <p className="text-white/60 text-xs leading-snug">
                        <strong className="text-[#20d968]">{cartaDaMissao.nome}</strong> já está na sua coleção!
                        Continue realizando ações para tentar conquistar outras cartas.
                      </p>
                    </div>
                  ) : drop.caiu && 'novaCarta' in drop ? (
                    <div className="mt-2">
                      <p className="text-[#20d968] font-semibold text-sm tracking-wide mb-1">VOCÊ GANHOU A CARTA!</p>
                      <NovaCarta novaCarta={drop.novaCarta} foil={drop.foil} />
                    </div>
                  ) : drop.caiu && 'foil' in drop ? (
                    <div className="mt-4 mx-auto max-w-[300px] rounded-2xl p-4" style={{ background: 'rgba(120,85,20,0.25)', border: '1px solid rgba(250,204,21,0.6)' }}>
                      <div className="flex items-center justify-center gap-2.5 mb-1.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(250,204,21,0.15)' }}>
                          <img src={drop.carta.icone} className="w-6 h-6 drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]" alt="" />
                        </div>
                        <p className="text-white font-bold text-sm">{drop.carta.nome} ✨</p>
                      </div>
                      <p className="text-white/70 text-xs leading-snug">
                        <strong className="text-[#fde68a]">CARTA BRILHANTE!</strong> {drop.carta.nome} evoluiu para a versão
                        premium (valor ×3) e ficou destacada na sua vitrine.
                      </p>
                    </div>
                  ) : drop.caiu && 'duplicada' in drop ? (
                    <div className="mt-4 mx-auto max-w-[300px] rounded-2xl p-4" style={{ background: 'rgba(15,28,46,0.9)', border: '1px solid rgba(166,108,255,0.45)' }}>
                      <div className="flex items-center justify-center gap-2.5 mb-1.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(166,108,255,0.12)' }}>
                          <img src={drop.carta.icone} className="w-6 h-6" alt="" />
                        </div>
                        <p className="text-white font-bold text-sm">Carta repetida</p>
                      </div>
                      <p className="text-white/60 text-xs leading-snug">
                        Você já tem <strong className="text-white/80">{drop.carta.nome}</strong>. Ela virou{' '}
                        <strong className="text-[#a66cff]">+{drop.fragmentosGanhos} fragmentos</strong> de {drop.carta.raridade.toLowerCase()}.
                        Use-os na Fábrica de Cartas na sua Coleção.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 mx-auto max-w-[300px] rounded-2xl p-4" style={{ background: 'rgba(15,28,46,0.9)', border: '1px solid rgba(0,255,136,0.22)' }}>
                      <div className="flex items-center justify-center gap-2.5 mb-1.5">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          <img src={drop.carta.icone} className="w-6 h-6 grayscale opacity-60" alt="" />
                        </div>
                        <p className="text-white font-bold text-sm">{drop.carta.nome}</p>
                      </div>
                      <p className="text-white/60 text-xs leading-snug">
                        Não foi dessa vez! A carta <strong className="text-white/80">{drop.carta.nome}</strong> escapou.
                        Nesta ação você tinha <strong className="text-[#20d968]">{drop.chance}%</strong> de chance.
                        Realize a ação novamente para tentar conquistá-la.
                      </p>
                    </div>
                  ))}
              </>
            ) : (
              <img src="/icons/sucesso.svg" alt="Sucesso" className="w-12 h-12 mx-auto mt-2" />
            )}

            <p className="text-[#20d968] text-2xl font-bold mt-4">+{pontosGanhos} créditos</p>
            <button
              onClick={fechar}
              className="w-full py-2.5 mt-4 bg-[#20d968] text-[#070d19] font-bold rounded-xl hover:brightness-110 transition-all"
            >
              Concluir
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <img src={missao.icone} alt="" className="w-8 h-8" />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">{missao.nome}</h2>
                <p className="text-[11px] text-[#20d968] font-semibold">+{missao.pontos} créditos</p>
              </div>
              <div className="flex-1" />
              <span className="text-[10px] text-white/40 text-right max-w-[140px] leading-tight">
                {DESCRICAO_COMPROVACAO[missao.comprovacao]}
              </span>
            </div>

            {cartaDaMissao && (
              <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 mb-4" style={{ background: 'rgba(0,255,136,0.07)', border: '1px solid rgba(0,255,136,0.22)' }}>
                <img src={cartaDaMissao.icone} className="w-5 h-5 shrink-0" alt="" />
                <p className="text-[11px] text-white/70 leading-snug">
                  Ao concluir: carta <b className="text-white">{cartaDaMissao.nome}</b> · {LABEL_RARIDADE[cartaDaMissao.raridade]} ·{' '}
                  <b className="text-[#20d968]">{chanceDrop}%</b> de chance de ganhar carta
                </p>
              </div>
            )}

            <div className="space-y-3">
              {exigeFoto && (
                <div>
                  <p className="text-sm font-medium text-white/80 mb-2">Envie uma foto como comprovante *</p>
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
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-xl py-8 transition-colors flex flex-col items-center gap-2 ${fotoErro
                        ? 'border-red-400/60 text-red-300 hover:border-red-400 hover:text-red-400'
                        : 'border-white/20 text-white/50 hover:border-[#20d968] hover:text-[#20d968]'
                        }`}
                    >
                      <img src="/icons/camera.svg" alt="" className="w-7 h-7 opacity-40" />
                      <span className="text-sm">Clique para enviar foto</span>
                    </button>
                  )}
                  {fotoErro && !foto && (
                    <p className="text-xs text-red-400 mt-1.5">A foto é obrigatória para confirmar a ação.</p>
                  )}
                </div>
              )}

              {missao.comprovacao === 'timer' && (
                <div>
                  <p className="text-sm font-medium text-white/80 mb-2">Conclua no tempo (máx. {formatarTempo(tempoTotal)})</p>
                  <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <p className={`font-bold font-serif-display tracking-tight ${segundos === 0 ? 'text-[#20d968]' : 'text-white'}`} style={{ fontSize: 44 }}>
                      {formatarTempo(segundos)}
                    </p>
                    <div className="w-full h-2 rounded-full overflow-hidden mt-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${((tempoTotal - segundos) / tempoTotal) * 100}%`,
                          background: segundos === 0 ? 'linear-gradient(90deg,#20d968,#4ade80)' : 'linear-gradient(90deg,#20d968,#86efac)',
                        }}
                      />
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                      {!timerAtivo && segundos !== 0 ? (
                        <button
                          type="button"
                          onClick={() => setTimerAtivo(true)}
                          className="px-6 py-2.5 bg-[#20d968] text-[#070d19] font-semibold rounded-xl hover:brightness-110 transition-all"
                        >
                          Iniciar timer
                        </button>
                      ) : timerAtivo ? (
                        <button
                          type="button"
                          onClick={() => setTimerAtivo(false)}
                          className="px-6 py-2.5 text-white/80 font-semibold rounded-xl transition-colors hover:bg-white/10"
                          style={{ background: 'rgba(255,255,255,0.1)' }}
                        >
                          Pausar
                        </button>
                      ) : (
                        <span className="px-6 py-2.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#20d968]">
                          <img src="/icons/check.svg" alt="" className="w-4 h-4" /> Tempo concluído!
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/40 mt-3">
                      Ao finalizar, confirme abaixo para ganhar os créditos.
                    </p>
                  </div>
                </div>
              )}

              {missao.comprovacao === 'declaracao' && (
                <div>
                  <p className="text-sm font-medium text-white/80 mb-2">Confiável e simples</p>
                  <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.22)' }}>
                    <p className="text-sm text-white/70">
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
                        className="mt-0.5 w-4 h-4 accent-[#20d968]"
                      />
                      <span className="text-sm text-white/70">
                        Confirmo que pratico este hábito e declaro minha ação de forma verdadeira.
                      </span>
                    </label>
                  )}
                </div>
              )}

              {(missao.comprovacao === 'foto' || missao.comprovacao === 'foto-gps') && (
                <div>
                  <p className="text-sm font-medium text-white/80 mb-2">
                    Localização {missao.comprovacao === 'foto-gps' ? '(recomendada para validar)' : '(opcional)'}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={localizacao}
                      onChange={e => setLocalizacao(e.target.value)}
                      placeholder="Latitude, Longitude"
                      className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none text-white placeholder-white/40"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                    />
                    <button
                      type="button"
                      onClick={obterGPS}
                      disabled={gpsStatus === 'capturando'}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-medium transition-colors text-sm whitespace-nowrap disabled:opacity-50"
                      style={{ background: 'rgba(32,217,104,0.15)', color: '#20d968' }}
                    >
                      <img src="/icons/localizacao.svg" alt="" className="w-4 h-4" />
                      {gpsStatus === 'capturando' ? 'Capturando...' : gpsStatus === 'ok' ? 'Capturado' : 'GPS'}
                    </button>
                  </div>
                </div>
              )}

              <button
                ref={confirmarButtonRef}
                onClick={confirmar}
                disabled={(missao.comprovacao === 'timer' && segundos !== 0) || (missao.comprovacao === 'declaracao' && !declaracaoConfirmada)}
                className="w-full py-2.75 bg-[#20d968] text-[#070d19] font-bold rounded-xl hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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