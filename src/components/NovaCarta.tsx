import type { NovaCartaInfo } from '../types';
import { useColecao } from '../context/CollectionContext';
import { getCardBackground, getCardLabel, getIniciaisSet, TIER } from '../data/cartasStyle';
import { LABEL_RARIDADE } from '../data/cartas';

interface Props {
  novaCarta: NovaCartaInfo;
  foil?: boolean;
}

export default function NovaCarta({ novaCarta, foil = false }: Props) {
  const { carta, set, quimicaNova, bonusGanho } = novaCarta;
  const { getProgressoTotal } = useColecao();
  const { obtidas, total } = getProgressoTotal();
  const tier = TIER[carta.raridade];

  return (
    <div className="text-center">
      <p className="text-[#20d968] text-xl font-bold tracking-wide">NOVA CARTA!</p>
      {foil && <p className="text-[#fde68a] text-sm font-bold tracking-wide mt-0.5">✨ VERSÃO BRILHANTE ✨</p>}

      <div
        className={`fut-card ${foil ? 'fut-foil' : ''} ${!foil && carta.raridade === 'lendaria' ? 'fut-legend' : ''} relative rounded-xl border mx-auto mt-3 max-w-[170px] p-2 flex flex-col items-center text-center`}
        style={{
          borderColor: foil ? '#ffe9a8' : tier.border,
          boxShadow: `0 0 26px ${foil ? 'rgba(250,204,21,0.5)' : tier.glow}`,
          background: getCardBackground(carta.raridade, foil),
        }}
      >
        <div className="relative z-10 flex items-center justify-between w-full">
          <span className="fut-chip rounded-md px-1 py-0.5 text-[8px] font-bold tracking-wide text-white/95">
            {foil ? `✨ ${getCardLabel(carta)}` : getCardLabel(carta)}
          </span>
          <span className="fut-chip rounded-md px-1 py-0.5 text-[8px] font-bold tracking-wide text-white/95">
            {getIniciaisSet(set.id)}
          </span>
        </div>
        <span
          className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl my-2"
          style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.4)' }}
        >
          <img
            src={carta.icone}
            alt=""
            className={`w-8 h-8 ${foil ? 'drop-shadow-[0_0_8px_rgba(250,204,21,0.95)]' : ''}`}
          />
        </span>
        <div className="relative z-10 fut-plate rounded-lg w-full px-1.5 py-1">
          <p className="text-white font-bold text-sm leading-tight">{carta.nome}</p>
          <p className="text-white/75 text-[10px] mt-0.5">{set.nome} · {LABEL_RARIDADE[carta.raridade]}</p>
        </div>
      </div>

      <p className="text-white/70 text-sm mt-3">
        Coleção {obtidas}/{total} · {quimicaNova.level > 0 ? `Química Nível ${quimicaNova.level}` : 'Química não ativada'}
      </p>

      {bonusGanho > 0 && (
        <p className="text-[#f5c451] text-sm font-semibold mt-1">+{bonusGanho} créditos de bônus</p>
      )}
    </div>
  );
}