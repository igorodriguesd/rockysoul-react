import { useEffect, useState } from 'react';
import { CARTAS, SETS_CARTAS, FRAGMENTOS_POR_DUPLICADA, CUSTO_FABRICACAO, PESO_RARIDADE, getValorCarta } from '../data/cartas';
import SetColecao from '../components/SetColecao';
import { useColecao } from '../context/CollectionContext';
import type { Carta } from '../types';

export function Colecao() {
  useEffect(() => { document.title = 'RockySoulUp - Coleção'; }, []);

  const { colecao, getProgressoTotal, getValorTotal, fabricarCarta } = useColecao();
  const [fabricada, setFabricada] = useState<Carta | null>(null);
  const [fabricaAberta, setFabricaAberta] = useState(false);
  const [mostrarDica, setMostrarDica] = useState(false);

  const { obtidas, total } = getProgressoTotal();
  const percentual = total > 0 ? (obtidas / total) * 100 : 0;
  const valorTotal = getValorTotal();
  const foils = colecao.cartasFoil ?? [];
  const fragmentos = colecao.fragmentos ?? { comum: 0, incomum: 0, rara: 0, epica: 0, lendaria: 0 };

  const faltando = CARTAS
    .filter(c => !colecao.cartasObtidas.includes(c.id))
    .sort((a, b) => PESO_RARIDADE[a.raridade] - PESO_RARIDADE[b.raridade]);

  const nFabricaveis = faltando.filter(c => (fragmentos[c.raridade] ?? 0) >= CUSTO_FABRICACAO[c.raridade]).length;

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-6">
      <header className="mb-6 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-white text-3xl font-bold mb-1">Minha Coleção</h1>
          <p className="text-[#20d968] text-sm font-semibold mt-1">
            Valor da coleção: {valorTotal} créditos{foils.length > 0 && ` · ${foils.length} brilhante${foils.length > 1 ? 's' : ''} ✨`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFabricaAberta(true)}
          className="group relative flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:scale-[1.03] active:scale-95 cursor-pointer overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #a66cff 55%, #7c3aed)',
            boxShadow: '0 6px 22px rgba(139,92,246,0.45), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          <img src="/icons/craft.svg" alt="" className="w-5 h-5 drop-shadow" />
          <span>Cartas repetidas</span>
          {nFabricaveis > 0 && (
            <span
              className="min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[11px] font-extrabold bg-white text-[#6b21a8]"
              title={`Você pode montar ${nFabricaveis} carta${nFabricaveis > 1 ? 's' : ''} agora`}
            >
              {nFabricaveis}
            </span>
          )}
        </button>
      </header>

      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="text-white/60 font-medium">Progresso da coleção</span>
        <span className="text-white/80 font-semibold">{obtidas}/{total} cartas · {Math.round(percentual)}%</span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden mb-5" style={{ background: 'rgba(82,232,138,0.12)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percentual}%`,
            background: 'linear-gradient(90deg, #20d968, #4ade80)',
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {SETS_CARTAS.map(set => (
          <SetColecao key={set.id} set={set} />
        ))}
      </div>

      {fabricaAberta && (
      <div
        className="fixed inset-0 z-[110] flex items-start sm:items-center justify-center p-3 sm:p-6 pt-24 sm:pt-6 bg-black/70"
        onClick={() => setFabricaAberta(false)}
      >
        <div
          className="relative w-full max-w-5xl rounded-2xl p-4 sm:p-5 max-h-[calc(100vh-8rem)] sm:max-h-[85vh] overflow-y-auto overscroll-contain"
          style={{
            background: 'linear-gradient(180deg, rgba(18,32,54,0.98), rgba(9,17,30,0.98))',
            border: '1px solid rgba(166,108,255,0.4)',
            boxShadow: '0 24px 70px rgba(0,0,0,0.65)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setFabricaAberta(false)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            title="Fechar"
          >
            ✕
          </button>

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

          {mostrarDica && (
            <div className="mb-3 rounded-xl p-3 text-xs leading-relaxed text-white/75 bg-white/5 border border-[#a66cff]/30">
              <p>
                <strong className="text-white">Fragmento</strong> é o «dinheiro de montar» da coleção: carta repetida vira
                fragmentos da raridade dela, e juntando a quantidade certa você monta a que falta — sem sorte.
                No chip fica seu total; no botão da carta, quanto falta (ex.: <strong className="text-white">3/10</strong> = tem 3, precisa de 10).
                Cada repetida rende: comum <strong className="text-[#a66cff]">+3</strong>, incomum <strong className="text-[#a66cff]">+5</strong>, rara <strong className="text-[#a66cff]">+10</strong>, épica <strong className="text-[#a66cff]">+20</strong>, lendária <strong className="text-[#a66cff]">+40</strong>.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-2">
            {(Object.keys(FRAGMENTOS_POR_DUPLICADA) as Array<keyof typeof FRAGMENTOS_POR_DUPLICADA>).map(r =>
              <div key={r} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs bg-white/5">
                <span className="w-2 h-2 rounded-full" style={{ background: r === 'comum' ? '#9ca3af' : r === 'incomum' ? '#38bdf8' : r === 'rara' ? '#a66cff' : r === 'epica' ? '#f5c451' : '#f59e0b' }} />
                <span className="text-white/70">{r}</span>
                <span className="text-[#a66cff] font-bold">{fragmentos[r]}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setMostrarDica(v => !v)}
              className="shrink-0 ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-[#a66cff] border border-[#a66cff]/40 bg-[#a66cff]/10 hover:bg-[#a66cff]/20 active:scale-95 transition-all cursor-pointer"
              title={mostrarDica ? 'Ocultar explicação' : 'O que é fragmento?'}
            >
              <span className="text-sm font-black leading-none">?</span>
              {mostrarDica ? 'Fechar dica' : 'O que é?'}
            </button>
          </div>

          {faltando.length === 0 ? (
            <p className="text-[#20d968] text-sm font-semibold text-center py-2">Coleção completa! Parabéns 🎉</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-2.5">
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
        </div>
      </div>
      )}
    </div>
  );
}