import type { NovaCartaInfo } from '../types';
import { useColecao } from '../context/CollectionContext';

interface Props {
  novaCarta: NovaCartaInfo;
}

export default function NovaCarta({ novaCarta }: Props) {
  const { carta, set, quimicaNova, bonusGanho } = novaCarta;
  const { getProgressoTotal } = useColecao();
  const { obtidas, total } = getProgressoTotal();

  return (
    <div className="text-center">
      <p className="text-[#20d968] text-xl font-bold tracking-wide">NOVA CARTA!</p>

      <div
        className="mx-auto mt-3 rounded-2xl p-4 max-w-[180px]"
        style={{
          border: '1px solid rgba(32,217,104,0.5)',
          boxShadow: '0 0 30px rgba(32,217,104,0.35)',
          background: 'linear-gradient(160deg, rgba(11,74,44,0.9), rgba(18,89,54,0.8))',
        }}
      >
        <img src={carta.icone} alt="" className="w-12 h-12 mx-auto" />
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