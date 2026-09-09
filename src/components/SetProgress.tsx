import { useChemistry } from '../hooks/useChemistry';
import type { SetCarta } from '../types';

interface Props {
  set: SetCarta;
}

const MARCOS = [
  { alvo: 2, nivel: 1 },
  { alvo: 3, nivel: 2 },
  { alvo: 4, nivel: 3 },
];

export default function SetProgress({ set }: Props) {
  const { quimica, totalCartas, percentual, mensagem, setCompleto } = useChemistry(set.id);

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-white/60 font-medium">{totalCartas}/4 cartas</span>
        {quimica.level > 0 ? (
          <span className="font-bold" style={{ color: set.cor }}>
            Química Nível {quimica.level}
          </span>
        ) : (
          <span className="text-white/40">Sem química</span>
        )}
      </div>

      <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(82,232,138,0.12)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percentual}%`,
            background: `linear-gradient(90deg, ${set.cor}, #20d968)`,
          }}
        />
        {MARCOS.map(m => (
          <span
            key={m.alvo}
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
            style={{
              left: `calc(${(m.alvo / 4) * 100}% - 3px)`,
              background: quimica.level >= m.nivel ? set.cor : 'rgba(255,255,255,0.3)',
              boxShadow: quimica.level >= m.nivel ? `0 0 6px ${set.cor}` : 'none',
            }}
          />
        ))}
      </div>

      <p className="text-[11px] mt-1.5 text-white/50">
        {mensagem}
        {setCompleto && ' · +150 pts'}
      </p>
    </div>
  );
}