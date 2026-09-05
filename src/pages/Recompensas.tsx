import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { RECOMPENSAS } from '../data/constants';
import ResgatarModal from '../components/ResgatarModal';
import type { Recompensa } from '../types';

const CATEGORIAS = ['Todas', 'Energia', 'Transporte', 'Natureza', 'Cupons'] as const;

export function Recompensas() {
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
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full border border-[#4ade80]/25" style={{ background: 'rgba(74,222,128,0.08)' }}>
            <img src="/icons/trofeu.svg" alt="" className="w-4 h-4" />
            <span className="text-sm font-semibold text-white/85">{data.pontos} pontos disponíveis</span>
          </div>
        </div>

        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${filtro === cat
                  ? 'bg-[#22c55e] text-white shadow-sm'
                  : 'text-white/55 hover:text-white/85 border border-white/12'
                }`}
              style={filtro === cat ? undefined : { background: 'rgba(255,255,255,0.06)' }}
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
                className="card-secondary rounded-2xl p-5 flex flex-col hover:scale-[1.01] transition-all"
              >
                <div className="h-6 mb-3 flex items-start">
                  {r.badge && (
                    <span className="self-start px-2 py-0.5 bg-[#22c55e]/15 text-[#4ade80] text-[10px] font-semibold rounded-full">
                      {r.badge}
                    </span>
                  )}
                </div>
                <Link to={`/recompensas/${r.id}`} className="flex items-start gap-3 mb-3 group">
                  <img src={r.icone} alt="" className="w-9 h-9 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm group-hover:text-[#4ade80] transition-colors">{r.nome}</h3>
                    <p className="text-xs text-white/45 mt-0.5">{r.descricao}</p>
                  </div>
                </Link>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[#4ade80]">{r.pontos} pontos</span>
                    <span className="text-[10px] text-white/45 bg-white/10 px-2 py-0.5 rounded-full">{r.categoria}</span>
                  </div>
                  <button
                    onClick={() => setRecompensaSelecionada(r)}
                    disabled={!podeResgatar}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${podeResgatar
                        ? 'bg-[#22c55e] text-white hover:bg-[#16a34a] cursor-pointer'
                        : 'bg-white/8 text-white/35 cursor-not-allowed'
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
            <div className="card-tertiary rounded-2xl divide-y divide-white/8">
              {data.resgates.map((rg, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/85 truncate">{rg.nome}</p>
                    <p className="text-[10px] text-white/40">{rg.data}</p>
                  </div>
                  <span className="text-sm font-semibold text-red-400 shrink-0">-{rg.pontos} pts</span>
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