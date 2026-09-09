import type { Carta } from '../types';
import { SETS_CARTAS, getValorCarta } from '../data/cartas';

const CORES_RARIDADE: Record<Carta['raridade'], string> = {
  comum: '#9ca3af',
  incomum: '#38bdf8',
  rara: '#a66cff',
  epica: '#f5c451',
  lendaria: '#f59e0b',
};

interface Props {
  carta: Carta;
  foil?: boolean;
  onFechar: () => void;
}

export default function CardModal({ carta, foil = false, onFechar }: Props) {
  const set = SETS_CARTAS.find(s => s.id === carta.setId) ?? SETS_CARTAS[0];
  const cor = foil ? '#fde68a' : CORES_RARIDADE[carta.raridade];

  return (
    <div
      className="fixed inset-0 z-9998 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onFechar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={carta.nome}
        className="glass-strong rounded-2xl max-w-sm w-full p-5 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onFechar}
          className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div
          className="rounded-xl p-5 text-center mb-4 border"
          style={{ borderColor: cor, boxShadow: `0 0 30px ${cor}55`, background: 'rgba(11,74,44,0.5)' }}
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: cor }}>
            {foil ? '✨ Brilhante · ' : ''}{carta.raridade}
          </span>
          <div className="flex justify-center my-3">
            <img
              src={carta.icone}
              alt=""
              className={`w-16 h-16 rounded-2xl ${foil ? 'drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]' : ''}`}
              style={{ background: 'rgba(255,255,255,0.1)' }}
            />
          </div>
          <h2 className="text-white text-2xl font-bold">{carta.nome}</h2>
          <p className="text-white/60 text-xs mt-1">{set.nome} · {set.tema}</p>
          <p className="text-xs font-semibold mt-2" style={{ color: foil ? '#fde68a' : '#4ade80' }}>
            Valor de coleção: <span className="font-bold">{getValorCarta(carta, foil)}</span> créditos{foil ? ' (×3 brilhante)' : ''}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-white/50 text-xs mb-1">Descrição</p>
            <p className="text-white text-sm leading-relaxed">{carta.descricao}</p>
          </div>

          <div className="rounded-xl p-3" style={{ background: 'rgba(32,217,104,0.08)', border: '1px solid rgba(32,217,104,0.2)' }}>
            <p className="text-[#20d968] text-xs font-semibold mb-1">Saiba mais</p>
            <p className="text-white/80 text-sm leading-relaxed">{carta.educativa}</p>
          </div>
        </div>

        <button
          onClick={onFechar}
          className="w-full mt-5 rounded-xl py-2.5 text-white font-semibold transition-colors hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)' }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}