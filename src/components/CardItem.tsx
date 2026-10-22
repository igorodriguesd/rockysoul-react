import type { Carta } from '../types';
import { CHANCE_DROP_POR_RARIDADE, getValorCarta, SETS_CARTAS } from '../data/cartas';
import { getCardLabel, getIniciaisSet, getCardBackgroundComBorda, TIER, usaBordaGradiente } from '../data/cartasStyle';
import { grupoDaCarta } from '../data/constants';
import IconeMissao from './IconeMissao';

interface Props {
  carta: Carta;
  bloqueada: boolean;
  ativa: boolean;
  foil?: boolean;
  semHover?: boolean;
  onClick?: () => void;
}

export default function CardItem({ carta, bloqueada, ativa, foil = false, semHover = false, onClick }: Props) {
  const set = SETS_CARTAS.find(s => s.id === carta.setId);
  const tier = TIER[carta.raridade];
  const comGradiente = usaBordaGradiente(carta.raridade);

  const corBorda = bloqueada ? 'rgba(255,255,255,0.16)' : comGradiente ? 'transparent' : foil ? '#ffe9a8' : tier.border;
  const larguraBorda = bloqueada ? 1 : comGradiente ? 2 : carta.raridade === 'rara' ? 2 : 1;
  const glow = bloqueada
    ? 'none'
    : ativa
      ? `0 0 16px var(--t-collection-border), 0 0 40px ${tier.glow}`
      : `0 0 12px ${tier.glow}`;
  const habilitarHover = !bloqueada && !semHover;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-1.5 pt-2 flex flex-col items-center w-full aspect-[4/5] sm:aspect-[2/3] ${
        onClick ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8]' : ''
      } ${
        habilitarHover
          ? 'transition-[transform_0.4s_cubic-bezier(0.22,1,0.36,1),box-shadow_0.4s_ease,filter_0.3s_ease] hover:z-[60] hover:[transform:perspective(800px)_translateY(-58px)_rotateZ(-7deg)_rotateX(14deg)_scale(1.16)] hover:[filter:brightness(1.12)_saturate(1.12)] hover:[box-shadow:0_34px_70px_rgba(0,0,0,0.4),0_0_34px_var(--fut-glow,var(--t-glow-card))]'
          : ''
      } ${
        foil
          ? 'after:absolute after:content-[""] after:top-[-60%] after:left-[-80%] after:w-[55%] after:h-[260%] after:rotate-[18deg] after:z-[2] after:pointer-events-none after:bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.5),transparent)] after:animate-fut-shine'
          : ''
      } ${
        !bloqueada && carta.raridade === 'lendaria'
          ? 'animate-holo-shine'
          : ''
      }`}
      style={{
        ['--fut-glow' as string]: glow === 'none' ? undefined : !ativa ? tier.glow : 'var(--t-glow)',
        borderColor: corBorda,
        borderWidth: larguraBorda,
        boxShadow: glow,
        background: bloqueada
          ? 'linear-gradient(180deg, #1b2a3d 0%, #0f1c2e 55%, #0b1725 100%)'
          : getCardBackgroundComBorda(carta.raridade, foil),
      }}
      title={bloqueada
        ? `${set ? set.nome : ''} · Carta desconhecida — realize ações deste set para descobri-la (chance ${CHANCE_DROP_POR_RARIDADE[carta.raridade]}%).${onClick ? ' Clique para fabricar com fragmentos.' : ''}`
        : `${carta.nome}${foil ? ' · brilhante' : ''}`}
      onClick={onClick}
      onKeyDown={e => {
        if (!onClick) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="relative z-10 flex items-center justify-between w-full gap-1">
        <span className="bg-[rgba(0,0,0,0.35)] border border-white/30 backdrop-blur-[2px] rounded-md px-1.5 py-1 text-[9px] leading-none font-bold tracking-wide text-white/95">
          {`${foil ? 'F·' : ''}${getCardLabel(carta).toUpperCase()}`}
        </span>
        <span
          className="bg-[rgba(0,0,0,0.35)] border border-white/30 backdrop-blur-[2px] rounded-md px-1.5 py-1 text-[9px] leading-none font-bold tracking-wide"
          style={{ color: bloqueada ? 'rgba(255,255,255,0.5)' : tier.texto }}
        >
          {bloqueada ? `${CHANCE_DROP_POR_RARIDADE[carta.raridade]}%` : set ? getIniciaisSet(set.id) : ''}
        </span>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center w-full py-1">
        {bloqueada ? (
          <div className="flex flex-col items-center gap-1.5">
            <span
              className="w-11 h-11 rounded-lg flex items-center justify-center text-xl font-extrabold"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px dashed rgba(255,255,255,0.28)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              ?
            </span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-white/50">Desconhecida</span>
          </div>
        ) : (
          <span
            className="flex items-center justify-center w-12 h-12 rounded-lg"
            style={{
              background: foil ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.12)',
              boxShadow: bloqueada ? 'none' : `0 0 12px ${tier.glow}`,
              border: `1px solid ${bloqueada ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.35)'}`,
            }}
          >
            <IconeMissao
              src={carta.icone}
              cor={grupoDaCarta(carta.id)?.cor ?? '#94a3b8'}
              className={`w-9 h-9 ${bloqueada ? 'grayscale opacity-35' : ''} ${
                foil ? 'drop-shadow-[0_0_7px_rgba(250,204,21,0.95)]' : 'drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]'
              }`}
            />
          </span>
        )}
      </div>

      <div className="relative z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.28),rgba(0,0,0,0.42))] backdrop-blur-[2px] rounded-lg w-full px-1 py-1 text-center">
        <p
          className="text-xs font-semibold leading-tight text-white line-clamp-2 sm:line-clamp-1"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
        >
          {carta.nome}
        </p>
        {!bloqueada && (
          <p className="mt-0.5 text-[10px] leading-tight text-white/60 line-clamp-2">{carta.descricao}</p>
        )}
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span
            className="rounded px-1.5 py-1 text-[9px] leading-none font-bold"
            style={{ background: 'rgba(255,255,255,0.1)', color: bloqueada ? 'rgba(255,255,255,0.4)' : tier.texto }}
          >
            chance {CHANCE_DROP_POR_RARIDADE[carta.raridade]}%
          </span>
          {!bloqueada && (
            <span
              className="rounded px-1.5 py-1 text-[9px] leading-none font-bold"
              style={{ background: 'rgba(250,204,21,0.2)', color: foil ? '#fde68a' : '#FACC15' }}
            >
              +{getValorCarta(carta, foil)} créd.
            </span>
          )}
        </div>
        {bloqueada && onClick && (
          <p className="mt-1 text-[9px] leading-tight text-white/55 text-center">
            Clique para <span className="text-[#38bdf8] font-bold">usar fragmentos</span>
          </p>
        )}
      </div>
    </div>
  );
}