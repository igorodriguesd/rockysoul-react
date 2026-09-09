import type { NovaCartaInfo } from '../types';
import { useColecao } from '../context/CollectionContext';

interface Props {
  novaCarta: NovaCartaInfo;
  foil?: boolean;
}

export default function NovaCarta({ novaCarta, foil = false }: Props) {
  const { carta, set, quimicaNova, bonusGanho } = novaCarta;
  const { getProgressoTotal } = useColecao();
  const { obtidas, total } = getProgressoTotal();

  return (
    <div className="text-center">
      <p className="text-[#20d968] text-xl font-bold tracking-wide">NOVA CARTA!</p>
      {foil && <p className="text-[#fde68a] text-sm font-bold tracking-wide mt-0.5">✨ VERSÃO BRILHANTE ✨</p>}

      <div
        className="mx-auto mt-3 rounded-2xl p-4 max-w-[180px]"
        style={{
          border: foil ? '1px solid rgba(250,204,21,0.7)' : '1px solid rgba(32,217,104,0.5)',
          boxShadow: foil ? '0 0 30px rgba(250,204,21,0.5)' : '0 0 30px rgba(32,217,104,0.35)',
          background: foil
            ? 'linear-gradient(160deg, rgba(120,85,20,0.75), rgba(70,45,15,0.85))'
            : 'linear-gradient(160deg, rgba(11,74,44,0.9), rgba(18,89,54,0.8))',
        }}
      >
        <img src={carta.icone} alt="" className={`w-12 h-12 mx-auto ${foil ? 'drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]' : ''}`} />
        <p className="text-white font-bold text-sm mt-2">{carta.nome}</p>
        <p className="text-white/60 text-xs">{set.nome} · {carta.raridade}</p>
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