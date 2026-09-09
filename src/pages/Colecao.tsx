import { useEffect } from 'react';
import { SETS_CARTAS } from '../data/cartas';
import SetColecao from '../components/SetColecao';
import { useColecao } from '../context/CollectionContext';

export function Colecao() {
  useEffect(() => { document.title = 'RockySoulUp - Coleção'; }, []);

  const { colecao, getProgressoTotal, getProximoObjetivo } = useColecao();
  const { obtidas, total } = getProgressoTotal();
  const proximo = getProximoObjetivo();
  const percentual = total > 0 ? (obtidas / total) * 100 : 0;

  const setsCompletos = SETS_CARTAS.filter(s => (colecao.sets[s.id]?.level ?? 0) === 3).length;
  const setsAtivos = SETS_CARTAS.filter(s => (colecao.sets[s.id]?.level ?? 0) >= 1).length;
  const quaseCompletos = SETS_CARTAS.filter(s => (colecao.sets[s.id]?.cartas.length ?? 0) === 3).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <header className="mb-6 text-center sm:text-left">
        <h1 className="text-white text-3xl font-bold mb-1">Minha Coleção</h1>
        <p className="text-white/60 text-sm">
          {obtidas}/{total} cartas · {Math.round(percentual)}% completa
        </p>
      </header>

      <div className="relative h-3 rounded-full overflow-hidden mb-5" style={{ background: 'rgba(82,232,138,0.12)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percentual}%`,
            background: 'linear-gradient(90deg, #20d968, #4ade80)',
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-side rounded-2xl py-3.5 text-center">
          <p className="text-white text-xl font-bold">{setsAtivos}</p>
          <p className="text-white/50 text-xs mt-0.5">sets ativos</p>
        </div>
        <div className="glass-side rounded-2xl py-3.5 text-center">
          <p className="text-white text-xl font-bold">{quaseCompletos}</p>
          <p className="text-white/50 text-xs mt-0.5">quase completos</p>
        </div>
        <div className="glass-side rounded-2xl py-3.5 text-center">
          <p className="text-[#20d968] text-xl font-bold">{setsCompletos}</p>
          <p className="text-white/50 text-xs mt-0.5">sets completos</p>
        </div>
      </div>

      {proximo && (
        <div className="rounded-2xl p-4 mb-6 flex items-center gap-3" style={{ background: 'rgba(32,217,104,0.1)', border: '1px solid rgba(32,217,104,0.35)' }}>
          <span className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>
            <img src="/icons/alvo.svg" alt="" className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <p className="text-white/60 text-xs">Próximo objetivo</p>
            <p className="text-white text-sm font-semibold">
              Completar {proximo.set.nome} · faltam {proximo.faltam} carta{proximo.faltam > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {SETS_CARTAS.map(set => (
          <SetColecao key={set.id} set={set} />
        ))}
      </div>
    </div>
  );
}