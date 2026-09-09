import { useColecao } from '../context/CollectionContext';
import { useChemistry } from '../hooks/useChemistry';
import type { SetCarta } from '../types';
import CardItem from './CardItem';
import SetProgress from './SetProgress';

interface Props {
  set: SetCarta;
}

export default function SetColecao({ set }: Props) {
  const { colecao, getCartasDoSet } = useColecao();
  const { quimica } = useChemistry(set.id);
  const cartas = getCartasDoSet(set.id);
  const obtidas = colecao.sets[set.id]?.cartas ?? [];

  return (
    <section className="glass-strong rounded-2xl p-4 sm:p-5">
      <header className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${set.cor}22`, border: `1px solid ${set.cor}55` }}
        >
          <img src={set.icone} alt="" className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base leading-tight">{set.nome}</h3>
          <p className="text-white/50 text-xs">{set.tema}</p>
        </div>
      </header>

      <SetProgress set={set} />

      <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mt-4">
        {cartas.map(carta => {
          const desbloqueada = obtidas.includes(carta.id);
          return (
            <CardItem
              key={carta.id}
              carta={carta}
              bloqueada={!desbloqueada}
              ativa={desbloqueada && quimica.level > 0}
            />
          );
        })}
      </div>
    </section>
  );
}