<<<<<<< HEAD
=======
import { useChemistry } from '../hooks/useChemistry';
import { BONUS_QUIMICA_N3 } from '../data/cartas';
>>>>>>> origin/main
import type { SetCarta } from '../types';

interface Props {
  set: SetCarta;
  total?: number;
  obtidas?: number;
}

const MARCOS = [
  { alvo: 2, nivel: 1 },
  { alvo: 3, nivel: 2 },
  { alvo: 4, nivel: 3 },
];

<<<<<<< HEAD
export default function SetProgress({ set, total = 0, obtidas = 0 }: Props) {
  const totalCartas = obtidas; const totalMaximo = Math.max(total, 1);
  const percentual = Math.min(100, obtidas / totalMaximo * 100); const levelAtual = 0;
  const mensagem = `${obtidas}/${total} cartas nesta página`; const setCompleto = false;
=======
export default function SetProgress({ set }: Props) {
  const { quimica, totalCartas = 0, percentual = 0, mensagem = '', setCompleto = false } = useChemistry(set.id);
>>>>>>> origin/main

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-slate-600 font-medium">{totalCartas}/4 cartas</span>
        {quimica.level > 0 ? (
          <span className="font-bold" style={{ color: set.cor }}>
            Química Nível {quimica.level}
          </span>
        ) : (
          <span className="text-slate-500">Sem química</span>
        )}
      </div>

<<<<<<< HEAD
      <div 
        role="progressbar"
        aria-valuenow={percentual}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso da coleção ${set.nome}`}
        className="relative h-2.5 rounded-full" 
        style={{ background: 'rgba(82,232,138,0.12)' }}
      >
        <div className="w-full h-full rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${percentual}%`,
              background: `linear-gradient(90deg, ${set.cor || '#20d968'}, #20d968)`,
            }}
          />
        </div>

        {MARCOS.filter(m => m.alvo <= totalMaximo).map(m => (
=======
      <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--t-collection-bg)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percentual}%`,
            background: `linear-gradient(90deg, ${set.cor}, var(--t-collection))`,
          }}
        />
        {MARCOS.map(m => (
>>>>>>> origin/main
          <span
            key={m.alvo}
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all z-10"
            style={{
              left: `calc(${(m.alvo / 4) * 100}% - 3px)`,
              background: quimica.level >= m.nivel ? set.cor : 'rgba(148,163,184,0.5)',
              boxShadow: quimica.level >= m.nivel ? `0 0 6px ${set.cor}` : 'none',
            }}
          />
        ))}
      </div>

      <p className="text-[11px] mt-1.5 text-slate-600">
        {mensagem}
        {setCompleto && ` · +${BONUS_QUIMICA_N3} créditos`}
      </p>
    </div>
  );
}
