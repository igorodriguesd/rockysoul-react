import { useEffect, useState } from 'react';
import type { Carta } from '../types';

const SLOTS = 36;
const VOLTAS = 5;
const DURACAO = 4200;

const CORES_RARIDADE: Record<Carta['raridade'], string> = {
  comum: '#9ca3af',
  incomum: '#38bdf8',
  rara: '#a66cff',
  epica: '#f5c451',
  lendaria: '#fbbf24',
};

interface Props {
  carta: Carta;
  chance: number;
  caiu: boolean;
  onTerminar?: () => void;
}

function pathArco(degInicio: number, degFim: number): string {
  const cx = 50;
  const cy = 50;
  const r = 48;
  const rad = (d: number) => (d * Math.PI) / 180;
  const sx = cx + r * Math.cos(rad(degInicio));
  const sy = cy + r * Math.sin(rad(degInicio));
  const ex = cx + r * Math.cos(rad(degFim));
  const ey = cy + r * Math.sin(rad(degFim));
  const grande = degFim - degInicio > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${sx} ${sy} A ${r} ${r} 0 ${grande} 1 ${ex} ${ey} Z`;
}

export default function RoletaDrop({ carta, chance, caiu, onTerminar }: Props) {
  const degPorSlot = 360 / SLOTS;
  const winSlots = Math.max(1, Math.min(SLOTS - 1, Math.round((chance / 100) * SLOTS)));

  // Slot que vai parar sob o ponteiro: zona vencedora (colorida) se caiu, senão zona cinza.
  const [girando, setGirando] = useState(true);
  const [rotacao, setRotacao] = useState<number>(() => Math.random() * 360);
  const [slotFinal] = useState<number>(() =>
    caiu
      ? Math.floor(Math.random() * winSlots)
      : winSlots + Math.floor(Math.random() * (SLOTS - winSlots))
  );

  // Rotação final: alinha o centro do slotFinal com o ponteiro (norte).
  useEffect(() => {
    const rotacaoFinal = VOLTAS * 360 - slotFinal * degPorSlot;
    const t1 = setTimeout(() => setRotacao(rotacaoFinal), 80);
    const t2 = setTimeout(() => {
      setGirando(false);
      onTerminar?.();
    }, DURACAO + 100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-48 h-52 mx-auto mt-2 select-none" aria-label="Roleta de carta">
      <svg aria-hidden="true"
        className="w-full h-48"
        viewBox="0 0 100 100"
        style={{
          transform: `rotate(${rotacao}deg)`,
          transition: `transform ${DURACAO}ms cubic-bezier(0.12, 0.75, 0.15, 1)`,
          transformOrigin: 'center',
          filter: 'drop-shadow(0 0 24px var(--t-glow))',
        }}
      >
        {Array.from({ length: SLOTS }, (_, k) => {
          const ganhou = k < winSlots;
          const centro = 270 + k * degPorSlot;
          return (
            <path
              key={k}
              d={pathArco(centro - degPorSlot / 2, centro + degPorSlot / 2)}
              fill={ganhou ? CORES_RARIDADE[carta.raridade] : '#ffffff'}
              stroke="var(--t-wheel-stroke)"
              strokeWidth="0.6"
            />
          );
        })}
      </svg>

      <svg
        width="18"
        height="16"
        viewBox="0 0 18 16"
        className="absolute left-1/2 top-0 -translate-x-1/2 z-10"
        style={{ filter: 'drop-shadow(0 0 6px var(--t-glow))' }}
        aria-hidden="true"
      >
        <polygon points="0,0 18,0 9,16" fill="var(--t-wheel-point)" />
      </svg>

      <div
        className="absolute left-1/2 top-24 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex flex-col items-center justify-center"
        style={{ background: 'var(--t-surface)', border: '2px solid var(--t-glow)', boxShadow: '0 0 24px var(--t-glow)' }}
      >
        <span className="text-brand text-lg font-bold leading-none">{chance}%</span>
        <span className="text-slate-500 text-[8px] mt-1">de chance</span>
      </div>

      {girando && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-wide">
          Girando...
        </span>
      )}
    </div>
  );
}