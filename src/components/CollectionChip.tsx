import { Link } from 'react-router-dom';
import { useColecao } from '../context/CollectionContext';

export default function CollectionChip() {
  const { getProgressoTotal, getProximoObjetivo } = useColecao();
  const { obtidas, total } = getProgressoTotal();
  const proximo = getProximoObjetivo();

  return (
    <Link to="/colecao" className="block transition-opacity hover:opacity-90">
      <div className="glass-side rounded-2xl px-6 py-5">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-white/50 text-xs uppercase tracking-widest font-medium">Coleção</p>
          <span className="text-[#20d968] font-bold text-sm">{obtidas}/{total}</span>
        </div>
        {proximo && (
          <p className="text-white/85 text-sm font-medium leading-snug">
            Próximo set: {proximo.set.nome}
            <span className="text-white/50"> · faltam {proximo.faltam}</span>
          </p>
        )}
      </div>
    </Link>
  );
}