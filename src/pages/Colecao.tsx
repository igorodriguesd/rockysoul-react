import { useEffect, useState } from 'react';
import { CARTAS, SETS_CARTAS, FRAGMENTOS_POR_DUPLICADA, CUSTO_FABRICACAO, PESO_RARIDADE, getValorCarta } from '../data/cartas';
import SetColecao from '../components/SetColecao';
import { useColecao } from '../context/CollectionContext';
import type { Carta } from '../types';

export function Colecao() {
  useEffect(() => { document.title = 'RockySoulUp - Coleção'; }, []);

  const { colecao, getProgressoTotal, getValorTotal, fabricarCarta } = useColecao();
  const [fabricada, setFabricada] = useState<Carta | null>(null);

  const { obtidas, total } = getProgressoTotal();
  const percentual = total > 0 ? (obtidas / total) * 100 : 0;
  const valorTotal = getValorTotal();
  const foils = colecao.cartasFoil ?? [];
  const fragmentos = colecao.fragmentos ?? { comum: 0, incomum: 0, rara: 0, epica: 0, lendaria: 0 };

  const setsCompletos = SETS_CARTAS.filter(s => (colecao.sets[s.id]?.level ?? 0) === 3).length;
  const setsAtivos = SETS_CARTAS.filter(s => (colecao.sets[s.id]?.level ?? 0) >= 1).length;
  const quaseCompletos = SETS_CARTAS.filter(s => (colecao.sets[s.id]?.cartas.length ?? 0) === 3).length;

  const faltando = CARTAS
    .filter(c => !colecao.cartasObtidas.includes(c.id))
    .sort((a, b) => PESO_RARIDADE[a.raridade] - PESO_RARIDADE[b.raridade]);

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-6">
      <header className="mb-6 text-center sm:text-left">
        <h1 className="text-white text-3xl font-bold mb-1">Minha Coleção</h1>
        <p className="text-white/60 text-sm">
          {obtidas}/{total} cartas · {Math.round(percentual)}% completa
        </p>
        <p className="text-[#20d968] text-sm font-semibold mt-1">
          Valor da coleção: {valorTotal} créditos{foils.length > 0 && ` · ${foils.length} brilhante${foils.length > 1 ? 's' : ''} ✨`}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {SETS_CARTAS.map(set => (
          <SetColecao key={set.id} set={set} />
        ))}
      </div>

      <section className="rounded-2xl p-4 sm:p-5" style={{ background: 'rgba(15,28,46,0.6)', border: '1px solid rgba(166,108,255,0.25)' }}>
        <header className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(166,108,255,0.15)', border: '1px solid rgba(166,108,255,0.4)' }}
          >
            <img src="/icons/craft.svg" alt="" className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-base leading-tight">Fábrica de Cartas</h3>
            <p className="text-white/50 text-xs">Cartas repetidas viram fragmentos. Monte as que faltam.</p>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(FRAGMENTOS_POR_DUPLICADA) as Array<keyof typeof FRAGMENTOS_POR_DUPLICADA>).map(r =>
            <div key={r} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs bg-white/5" title={`Custo para fabricar: ${CUSTO_FABRICACAO[r]} fragmentos`}>
              <span className="w-2 h-2 rounded-full" style={{ background: r === 'comum' ? '#9ca3af' : r === 'incomum' ? '#38bdf8' : r === 'rara' ? '#a66cff' : r === 'epica' ? '#f5c451' : '#f59e0b' }} />
              <span className="text-white/70">{r}</span>
              <span className="text-[#a66cff] font-bold">{fragmentos[r]}</span>
            </div>
          )}
        </div>

        {faltando.length === 0 ? (
          <p className="text-[#20d968] text-sm font-semibold text-center py-2">Coleção completa! Parabéns 🎉</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {faltando.map(carta => {
              const custo = CUSTO_FABRICACAO[carta.raridade];
              const tem = (fragmentos[carta.raridade] ?? 0) >= custo;
              return (
                <div
                  key={carta.id}
                  className="rounded-xl p-2.5 flex flex-col items-center text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <img src={carta.icone} alt="" className="w-8 h-8 opacity-75" />
                  <p className="text-white text-[11px] font-semibold mt-1.5 leading-tight">{carta.nome}</p>
                  <p className="text-white/40 text-[9px] uppercase tracking-widest mb-2">{carta.raridade}</p>
                  <button
                    type="button"
                    onClick={() => {
                      const nova = fabricarCarta(carta.id);
                      if (nova) {
                        setFabricada(carta);
                        setTimeout(() => setFabricada(null), 2200);
                      }
                    }}
                    disabled={!tem}
                    className="w-full text-[11px] font-bold rounded-lg py-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={tem
                      ? { background: 'linear-gradient(135deg, #a66cff, #8b5cf6)', color: '#fff' }
                      : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}
                  >
                    {tem ? `Fabricar (${custo})` : `${fragmentos[carta.raridade]}/${custo}`}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {fabricada && (
          <div className="mt-4 rounded-xl p-3 text-center" style={{ background: 'rgba(32,217,104,0.12)', border: '1px solid rgba(32,217,104,0.4)' }}>
            <p className="text-white text-sm">
              Carta fabricada: <strong className="text-[#20d968]">{fabricada.nome}</strong> · {' '}
              <span className="text-[#4ade80] font-semibold">+{getValorCarta(fabricada)} créditos</span> na coleção!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}