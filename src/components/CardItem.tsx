import type { Carta } from '../types';
import { CHANCE_DROP_POR_RARIDADE, getValorCarta, SETS_CARTAS } from '../data/cartas';
import { getCardBackground, getCardLabel, getIniciaisSet, TIER } from '../data/cartasStyle';

interface Props {
  carta: Carta;
  bloqueada: boolean;
  ativa: boolean;
  foil?: boolean;
}

export default function CardItem({ carta, bloqueada, ativa, foil = false }: Props) {
  const set = SETS_CARTAS.find(s => s.id === carta.setId);
  const tier = TIER[carta.raridade];

  const corBorda = bloqueada ? 'rgba(255,255,255,0.16)' : foil ? '#ffe9a8' : tier.border;
  const glow = bloqueada
    ? 'none'
    : ativa
      ? `0 0 16px rgba(32,217,104,0.6), 0 0 40px ${tier.glow}`
      : `0 0 12px ${tier.glow}`;

  return (
    <div
      className={`fut-card fut-hover ${foil ? 'fut-foil' : ''} relative rounded-xl border p-1.5 pt-2 flex flex-col items-center w-full aspect-[2/3]`}
      style={{
        ['--fut-glow' as string]: glow === 'none' ? undefined : !ativa ? tier.glow : 'rgba(32,217,104,0.6)',
        borderColor: corBorda,
        boxShadow: glow,
        background: bloqueada
          ? 'linear-gradient(180deg, #13402a 0%, #0c2b1c 55%, #081d13 100%)'
          : getCardBackground(carta.raridade, foil),
      }}
      title={`${carta.nome}${foil ? ' · brilhante' : ''}`}
    >
      <div className="relative z-10 flex items-center justify-between w-full gap-1">
        <span className="fut-chip rounded-md px-1 py-0.5 text-[7px] leading-none font-bold tracking-wide text-white/95">
          {bloqueada ? carta.raridade.toUpperCase() : foil ? `✨ ${getCardLabel(carta)}` : getCardLabel(carta)}
        </span>
        <span
          className="fut-chip rounded-md px-1 py-0.5 text-[7px] leading-none font-bold tracking-wide"
          style={{ color: bloqueada ? 'rgba(255,255,255,0.5)' : tier.texto }}
        >
          {bloqueada ? `${CHANCE_DROP_POR_RARIDADE[carta.raridade]}%` : set ? getIniciaisSet(set.id) : ''}
        </span>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center w-full py-1">
        <span
          className="flex items-center justify-center w-10 h-10 rounded-lg"
          style={{
            background: foil ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.12)',
            boxShadow: bloqueada ? 'none' : `0 0 12px ${tier.glow}`,
            border: `1px solid ${bloqueada ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.35)'}`,
          }}
        >
          <img
            src={carta.icone}
            alt=""
            className={`w-7 h-7 ${bloqueada ? 'grayscale opacity-35' : ''} ${
              foil ? 'drop-shadow-[0_0_7px_rgba(250,204,21,0.95)]' : 'drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]'
            }`}
          />
        </span>
      </div>

      <div className="relative z-10 fut-plate rounded-lg w-full px-1 py-1 text-center">
        <p
          className="text-[10px] font-semibold leading-tight text-white line-clamp-1"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
        >
          {carta.nome}
        </p>
        {!bloqueada && (
          <p className="mt-0.5 text-[7px] leading-tight text-white/60 line-clamp-2">{carta.descricao}</p>
        )}
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span
            className="rounded px-1 py-0.5 text-[7px] leading-none font-bold"
            style={{ background: 'rgba(255,255,255,0.1)', color: bloqueada ? 'rgba(255,255,255,0.4)' : tier.texto }}
          >
            chance {CHANCE_DROP_POR_RARIDADE[carta.raridade]}%
          </span>
          {!bloqueada && (
            <span
              className="rounded px-1 py-0.5 text-[7px] leading-none font-bold"
              style={{ background: 'rgba(32,217,104,0.22)', color: foil ? '#fde68a' : '#7dffb0' }}
            >
              +{getValorCarta(carta, foil)} créd.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}