import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { RECOMPENSAS } from '../data/constants';
import ResgatarModal from '../components/ResgatarModal';
import type { Recompensa } from '../types';

const CATEGORIAS = ['Todas', 'Energia', 'Transporte', 'Natureza', 'Cupons'] as const;

export default function Recompensas() {
  useEffect(() => { document.title = 'Recompensas - RockySoulUp'; }, []);

  const { data } = useData();
  const [filtro, setFiltro] = useState<string>('Todas');
  const [recompensaSelecionada, setRecompensaSelecionada] = useState<Recompensa | null>(null);

  const filtradas = filtro === 'Todas'
    ? RECOMPENSAS
    : RECOMPENSAS.filter(r => r.categoria === filtro);

  return (
    <>
      <div className="max-w-275 mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow">Recompensas</h1>
          <p className="text-white/70">Use seus pontos para resgatar recompensas reais</p>
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/40">
            <img src="/icons/trofeu.svg" alt="" className="w-4 h-4" />
            <span className="text-sm font-semibold text-gray-800">{data.pontos} pontos disponíveis</span>
          </div>
        </div>

        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filtro === cat
                  ? 'bg-[#22c55e] text-white shadow-sm'
                  : 'bg-white/60 text-gray-600 hover:bg-white/80 border border-white/40'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {filtradas.map(r => {
            const podeResgatar = data.pontos >= r.pontos;
            const jaResgatou = data.resgates.some(rg => rg.nome === r.nome);
            return (
              <div
                key={r.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/40 p-5 flex flex-col hover:shadow-md hover:scale-[1.01] transition-all"
              >
                <div className="h-6 mb-3 flex items-start">
                  {r.badge && (
                    <span className="self-start px-2 py-0.5 bg-[#22c55e]/10 text-[#16a34a] text-[10px] font-semibold rounded-full">
                      {r.badge}
                    </span>
                  )}
                </div>
                <Link to={`/recompensas/${r.id}`} className="flex items-start gap-3 mb-3 group">
                  <img src={r.icone} alt="" className="w-9 h-9 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm group-hover:text-[#22c55e] transition-colors">{r.nome}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{r.descricao}</p>
                  </div>
                </Link>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[#22c55e]">{r.pontos} pontos</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{r.categoria}</span>
                  </div>
                  <button
                    onClick={() => setRecompensaSelecionada(r)}
                    disabled={!podeResgatar}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${podeResgatar
                        ? 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {jaResgatou ? 'Resgatado' : podeResgatar ? 'Resgatar' : 'Pontos insuficientes'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {data.resgates.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4 drop-shadow">Histórico de Resgates</h2>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/40 divide-y divide-gray-100">
              {data.resgates.map((rg, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{rg.nome}</p>
                    <p className="text-[10px] text-gray-400">{rg.data}</p>
                  </div>
                  <span className="text-sm font-semibold text-red-500 shrink-0">-{rg.pontos} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recompensaSelecionada && (
          <ResgatarModal
            aberto={true}
            onFechar={() => setRecompensaSelecionada(null)}
            recompensa={recompensaSelecionada}
          />
        )}
      </div>
    </>
  );
}
