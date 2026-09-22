import { Link } from 'react-router-dom';
import { useColecao } from '../context/CollectionContext';

export default function CollectionChip() {
  const { getProgressoTotal, getProximoObjetivo } = useColecao();
  const { obtidas, total } = getProgressoTotal();
  const proximo = getProximoObjetivo();

  return (
    <Link to="/colecao" className="block transition-opacity hover:opacity-90">
      <div className="bg-[var(--t-glass-side)] border border-[var(--t-glass-side-border)] shadow-[var(--t-glass-side-shadow)] rounded-2xl px-6 py-5">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-slate-500 text-xs uppercase tracking-widest font-medium">Coleção</p>
          <span className="text-brand font-bold text-sm">{obtidas}/{total}</span>
        </div>
        {proximo && (
          <p className="text-slate-800 text-sm font-medium leading-snug">
            Próximo set: {proximo.set.nome}
            <span className="text-slate-500"> · faltam {proximo.faltam}</span>
          </p>
        )}
      </div>
    </Link>
  );
}