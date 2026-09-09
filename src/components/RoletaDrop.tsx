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
  const [girando, setGirando] = useState(true);
  const [rotacao, setRotacao] = useState(0);
  const [slotVencedor] = useState<number>(() =>
    caiu
      ? Math.floor(Math.random() * winSlots)
      : winSlots + Math.floor(Math.random() * (SLOTS - winSlots))
  );

  useEffect(() => {
    const t1 = setTimeout(() => setRotacao(VOLTAS * 360), 80);
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
      <svg
        className="w-full h-48"
        viewBox="0 0 100 100"
        style={{
          transform: `rotate(${rotacao}deg)`,
          transition: `transform ${DURACAO}ms cubic-bezier(0.12, 0.75, 0.15, 1)`,
          transformOrigin: 'center',
          filter: 'drop-shadow(0 0 24px rgba(0,255,136,0.15))',
        }}
      >
        {Array.from({ length: SLOTS }, (_, k) => {
          const idx = (slotVencedor + k) % SLOTS;
          const ganhou = idx < winSlots;
          const centro = 270 + k * degPorSlot;
          return (
            <path
              key={k}
              d={pathArco(centro - degPorSlot / 2, centro + degPorSlot / 2)}
              fill={ganhou ? CORES_RARIDADE[carta.raridade] : '#1b2b45'}
              stroke="#0f1c2e"
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
        style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.9))' }}
        aria-hidden="true"
      >
        <polygon points="0,0 18,0 9,16" fill="#00ff88" />
      </svg>

      <div
        className="absolute left-1/2 top-24 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex flex-col items-center justify-center"
        style={{ background: '#0f1c2e', border: '2px solid rgba(0,255,136,0.45)', boxShadow: '0 0 24px rgba(0,255,136,0.25)' }}
      >
        <span className="text-[#00ff88] text-lg font-bold leading-none">{chance}%</span>
        <span className="text-white/50 text-[8px] mt-1">de chance</span>
      </div>

      {girando && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-wide">
          Girando...
        </span>
      )}
    </div>
  );
}