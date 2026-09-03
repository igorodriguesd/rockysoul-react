import { useState, useRef, useEffect, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { showToast } from './Toast';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  missao: { id: string; nome: string; pontos: number; icone: string };
  onVerificado?: (missaoId: string) => void;
}

const CONFETTI_COLORS = ['#22c55e', '#4ade80', '#eab308', '#38bdf8', '#f97316', '#a78bfa'];

export default function VerificarModal({ aberto, onFechar, missao, onVerificado }: Props) {
  const { adicionarPontos } = useData();
  const [foto, setFoto] = useState<string | null>(null);
  const [localizacao, setLocalizacao] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'capturando' | 'ok' | 'erro'>('idle');
  const [sucesso, setSucesso] = useState(false);
  const [pontosGanhos, setPontosGanhos] = useState(0);
  const [fotoErro, setFotoErro] = useState(false);
  const [confetti, setConfetti] = useState<{ x: number; delay: number; color: string; rotate: number }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const confirmarButtonRef = useRef<HTMLButtonElement>(null);

  const fechar = useCallback(() => {
    setFoto(null);
    setLocalizacao('');
    setGpsStatus('idle');
    setSucesso(false);
    setPontosGanhos(0);
    setFotoErro(false);
    setConfetti([]);
    onFechar();
  }, [onFechar]);

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

  if (!aberto) return null;

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
    if (!foto) {
      setFotoErro(true);
      showToast('Envie uma foto para confirmar a ação');
      return;
    }
    adicionarPontos(missao.pontos, missao.nome);
    setPontosGanhos(missao.pontos);
    setSucesso(true);
    setConfetti(Array.from({ length: 24 }, (_, i) => ({
      x: (i / 24) * 100,
      delay: Math.random() * 0.4,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      rotate: Math.random() * 360,
    })));
    showToast(`+${missao.pontos} pontos - ${missao.nome}`);
    onVerificado?.(missao.id);
  }

  return (
    <div className="fixed inset-0 z-9998 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={fechar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={sucesso ? 'Ação verificada' : missao.nome}
        className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-[90vw] max-w-440px p-6 relative border border-white/40 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={fechar} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10" aria-label="Fechar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        {sucesso ? (
          <div className="text-center py-4 overflow-hidden">
            <div className="relative">
              {confetti.map((c, i) => (
                <span
                  key={i}
                  className="confetti-piece"
                  style={{
                    left: `${c.x}%`,
                    background: c.color,
                    animationDelay: `${c.delay}s`,
                    transform: `rotate(${c.rotate}deg)`,
                  }}
                  aria-hidden="true"
                />
              ))}
              <img src="/icons/sucesso.svg" alt="Sucesso" className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Ação Verificada</h2>
            <p className="text-sm text-gray-500 mb-3">
              <strong>{missao.nome}</strong> registrada com sucesso.
            </p>
            <p className="text-3xl font-bold text-[#22c55e] mb-6">+{pontosGanhos} pontos</p>
            <button onClick={fechar} className="w-full py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors">
              Concluir
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <img src={missao.icone} alt="" className="w-8 h-8" />
              <div>
                <h2 className="text-lg font-bold text-gray-800">{missao.nome}</h2>
                <p className="text-xs text-[#22c55e] font-semibold">+{missao.pontos} pontos</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Envie uma foto como comprovante *</p>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} className="hidden" aria-label="Enviar foto" />
                {foto ? (
                  <div className="relative">
                    <img src={foto} alt="Preview" className="w-full max-h-200px object-cover rounded-xl" />
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
                    className={`w-full border-2 border-dashed rounded-xl py-8 transition-colors flex flex-col items-center gap-2 ${
                      fotoErro
                        ? 'border-red-300 text-red-400 hover:border-red-400 hover:text-red-500'
                        : 'border-gray-300 text-gray-400 hover:border-[#22c55e] hover:text-[#22c55e]'
                    }`}
                  >
                    <img src="/icons/camera.svg" alt="" className="w-7 h-7 opacity-50" />
                    <span className="text-sm">Clique para enviar foto</span>
                  </button>
                )}
                {fotoErro && !foto && (
                  <p className="text-xs text-red-500 mt-1.5">A foto é obrigatória para confirmar a ação.</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Localização (opcional)</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={localizacao}
                    onChange={e => setLocalizacao(e.target.value)}
                    placeholder="Latitude, Longitude"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] bg-white/60"
                  />
                  <button
                    type="button"
                    onClick={obterGPS}
                    disabled={gpsStatus === 'capturando'}
                    className="flex items-center gap-1.5 px-3 py-2.5 bg-[#22c55e]/10 text-[#22c55e] font-medium rounded-xl hover:bg-[#22c55e]/20 transition-colors text-sm whitespace-nowrap disabled:opacity-50"
                  >
                    <img src="/icons/localizacao.svg" alt="" className="w-4 h-4" />
                    {gpsStatus === 'capturando' ? 'Capturando...' : gpsStatus === 'ok' ? 'Capturado' : 'GPS'}
                  </button>
                </div>
              </div>

              <button
                ref={confirmarButtonRef}
                onClick={confirmar}
                className="w-full py-3 bg-[#22c55e] text-white font-bold rounded-xl hover:bg-[#16a34a] transition-colors"
              >
                Confirmar Ação
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}