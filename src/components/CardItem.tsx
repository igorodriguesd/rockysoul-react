import { useState } from 'react';
import type { Carta } from '../types';
import { CHANCE_DROP_POR_RARIDADE, getValorCarta } from '../data/cartas';
import CardModal from './CardModal';

const CORES_RARIDADE: Record<Carta['raridade'], string> = {
  comum: '#9ca3af',
  incomum: '#38bdf8',
  rara: '#a66cff',
  epica: '#f5c451',
  lendaria: '#f59e0b',
};

interface Props {
  carta: Carta;
  bloqueada: boolean;
  ativa: boolean;
  foil?: boolean;
}

export default function CardItem({ carta, bloqueada, ativa, foil = false }: Props) {
  const [modalAberto, setModalAberto] = useState(false);

  const corBorda = bloqueada ? 'rgba(255,255,255,0.15)' : foil ? '#fde68a' : CORES_RARIDADE[carta.raridade];
  const glow = bloqueada
    ? 'none'
    : foil
      ? '0 0 22px rgba(250,204,21,0.75)'
      : ativa
        ? '0 0 18px rgba(32,217,104,0.65)'
        : '0 0 10px rgba(32,217,104,0.25)';

  return (
    <>
      <button
        type="button"
        onClick={() => !bloqueada && setModalAberto(true)}
        disabled={bloqueada}
        className={`relative rounded-xl border p-2.5 flex flex-col items-center justify-between transition-all duration-300 w-full aspect-[3/4] ${
          bloqueada ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 hover:brightness-110'
        }`}
        style={{
          borderColor: corBorda,
          boxShadow: glow,
          background: bloqueada
            ? 'linear-gradient(160deg, rgba(11,74,44,0.5), rgba(18,89,54,0.35))'
            : foil
              ? 'linear-gradient(160deg, rgba(120,85,20,0.65), rgba(70,45,15,0.8))'
              : 'linear-gradient(160deg, rgba(11,74,44,0.9), rgba(18,89,54,0.7))',
        }}
        aria-label={bloqueada ? `Carta bloqueada: ${carta.nome}` : carta.nome}
      >
        {foil && (
          <span className="absolute top-1 left-1 text-[11px]" title="Carta brilhante">✨</span>
        )}
        <span
          className="text-[8px] uppercase tracking-widest font-semibold"
          style={{ color: bloqueada ? 'rgba(255,255,255,0.45)' : foil ? '#fde68a' : CORES_RARIDADE[carta.raridade] }}
        >
          {bloqueada ? `${carta.raridade} · ${CHANCE_DROP_POR_RARIDADE[carta.raridade]}%` : carta.raridade}
        </span>
        <span className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <img
            src={carta.icone}
            alt=""
            className={`w-6 h-6 ${bloqueada ? 'grayscale opacity-35' : ''} ${foil ? 'drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]' : ''}`}
          />
        </span>
        <span
          className="text-[10px] font-semibold text-center leading-tight text-white"
          style={bloqueada ? { textShadow: '0 1px 4px rgba(0,0,0,0.55)' } : undefined}
        >
          {carta.nome}
        </span>
        {!bloqueada && (
          <span className="text-[8px] font-bold" style={{ color: foil ? '#fde68a' : '#4ade80' }}>
            {getValorCarta(carta, foil)} créd.
          </span>
        )}
      </button>
      {modalAberto && <CardModal carta={carta} foil={foil} onFechar={() => setModalAberto(false)} />}
    </>
  );
}