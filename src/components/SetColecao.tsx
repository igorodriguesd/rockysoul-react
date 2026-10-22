import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useColecao } from '../context/CollectionContext';
import { useChemistry } from '../hooks/useChemistry';
import { useData } from '../context/DataContext';
import { nomeNivelPorPontos } from '../data/constants';
import type { SetCarta, Carta } from '../types';
import CardItem from './CardItem';
import SetProgress from './SetProgress';
import CartaFabricarModal from './CartaFabricarModal';

interface Props {
  set: SetCarta;
}

export default function SetColecao({ set }: Props) {
  const { colecao, getCartasDoSet } = useColecao();
  const { data } = useData();
  const { quimica } = useChemistry(set.id);
  const cartas = getCartasDoSet(set.id);
  const obtidas = cartas.filter(c => colecao.cartasObtidas.includes(c.id)).map(c => c.id);
  const bloqueado = (data.pontosAcumulados ?? data.pontos) < set.pontosMin;
  const [cartaAlvo, setCartaAlvo] = useState<Carta | null>(null);

  return (
    <section className="shadow-(--t-glass-strong-shadow) rounded-2xl p-4 sm:p-5" style={bloqueado ? { opacity: 0.85, background: 'linear-gradient(168deg, #241b3d 0%, #12233a 100%)', border: '1px solid rgba(109,79,194,0.35)' } : { background: 'linear-gradient(168deg, #241b3d 0%, #12233a 100%)', border: '1px solid rgba(109,79,194,0.35)' }}>
      <header className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${set.cor}22`, border: `1px solid ${set.cor}55`, filter: bloqueado ? 'grayscale(0.6)' : undefined }}
        >
          <img src={set.icone} alt="" className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-slate-900 font-semibold text-base leading-tight">{set.nome}</h3>
          <p className="text-slate-500 text-xs flex items-center gap-1.5 flex-wrap">
            {set.tema}
            {bloqueado && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-gold/15 text-gold text-[10px] font-semibold">
                Libera no nível {nomeNivelPorPontos(set.pontosMin)} · {set.pontosMin} créditos
              </span>
            )}
          </p>
        </div>
      </header>

      <SetProgress set={set} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
        {cartas.map(carta => {
          const desbloqueada = obtidas.includes(carta.id);
          return (
            <CardItem
              key={carta.id}
              carta={carta}
              bloqueada={!desbloqueada}
              ativa={desbloqueada && quimica.level > 0}
              foil={colecao.cartasFoil?.includes(carta.id) ?? false}
              onClick={!desbloqueada ? () => setCartaAlvo(carta) : undefined}
            />
          );
        })}
      </div>

      <p className="mt-3 text-[11px] leading-snug text-slate-500">
        {bloqueado
          ? 'Carta desconhecida: cumpra missões deste set para descobrir.'
          : 'Qualquer carta que falta pode ser desbloqueada com fragmentos — clique na carta e use seus fragmentos.'}
      </p>

      {createPortal(
        <CartaFabricarModal carta={cartaAlvo} onFechar={() => setCartaAlvo(null)} />,
        document.body,
      )}
    </section>
  );
}
