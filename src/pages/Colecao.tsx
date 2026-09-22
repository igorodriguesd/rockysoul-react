import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CARTAS, SETS_CARTAS, FRAGMENTOS_POR_DUPLICADA, CUSTO_FABRICACAO, PESO_RARIDADE, getValorCarta } from '../data/cartas';
import SetColecao from '../components/SetColecao';
import { useColecao } from '../context/CollectionContext';
import { useData } from '../context/DataContext';
import { nomeNivelPorPontos } from '../data/constants';
import { TermoAjuda } from '../components/TermoAjuda';
import type { Carta } from '../types';

export function Colecao() {
  useEffect(() => { document.title = 'RockySoulUp - Coleção'; }, []);

  const navigate = useNavigate();
  const { colecao, getProgressoTotal, getValorTotal, fabricarCarta, setDesbloqueado } = useColecao();
  const { data } = useData();
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

  const nFabricaveis = faltando.filter(c => setDesbloqueado(c.setId) && (fragmentos[c.raridade] ?? 0) >= CUSTO_FABRICACAO[c.raridade]).length;

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-6">
      <header className="mb-6 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-white text-3xl font-bold mb-1">Minha Coleção</h1>
          <p className="text-gold text-sm font-semibold mt-1">
            Valor da coleção: {valorTotal} créditos{foils.length > 0 && ` · ${foils.length} brilhante${foils.length > 1 ? 's' : ''} ✨`}
            <TermoAjuda
              termo="O que vale mais?"
              dica="Cada carta obtida soma créditos à sua coleção. Cartas 'brilhantes' (✨, foil) valem mais que as comuns, e completar cartas de um mesmo influenciador ativa a química, que multiplica o valor do conjunto."
            />
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFabricaAberta(true)}
          className="group relative flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-bold text-(--t-onaccent) transition-all hover:scale-[1.03] active:scale-95 cursor-pointer overflow-hidden"
          style={{
            background: 'var(--t-grad-menu)',
            boxShadow: '0 6px 22px var(--t-glow), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          <img src="/icons/coringa.svg" alt="" className="w-5 h-5 drop-shadow" />
          <span>Cartas repetidas</span>
          {nFabricaveis > 0 && (
            <span
              className="min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-[11px] font-extrabold bg-(--t-onaccent) text-brand"
              title={`Você pode montar ${nFabricaveis} carta${nFabricaveis > 1 ? 's' : ''} agora`}
            >
              {nFabricaveis}
            </span>
          )}
        </button>
      </header>

      {obtidas === 0 && (
        <div
          className="mb-4 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--t-grad-brand)' }}
          >
            <img src="/icons/coringa.svg" alt="" className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 font-semibold text-sm">Suas cartas vão aparecer aqui.</p>
            <p className="text-slate-500 text-xs mt-0.5">
              Registre uma ação sustentável no Dashboard para ganhar suas primeiras cartas — cada missão pode soltar uma das 28 disponíveis.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="shrink-0 rounded-full px-5 py-2.5 text-sm font-bold text-(--t-onaccent) transition-all hover:scale-[1.03] active:scale-95 cursor-pointer"
            style={{ background: 'var(--t-grad-brand)', boxShadow: '0 6px 18px var(--t-glow)' }}
          >
            Ganhar cartas
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="text-slate-600 font-medium">Progresso da coleção</span>
        <span className="text-slate-800 font-semibold">{obtidas}/{total} cartas · {Math.round(percentual)}%</span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden mb-5" style={{ background: 'var(--t-mist)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percentual}%`,
            background: 'var(--t-grad-brand)',
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
            background: 'var(--t-grad-factory)',
            border: '1px solid rgba(99,102,241,0.3)',
            boxShadow: '0 24px 70px var(--t-glow)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setFabricaAberta(false)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 bg-surface-2 hover:bg-brand-soft transition-colors cursor-pointer"
            title="Fechar"
          >
            ✕
          </button>

          <header className="flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}
            >
              <img src="/icons/coringa.svg" alt="" className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 font-semibold text-base leading-tight">Fábrica de Cartas</h3>
              <p className="text-slate-500 text-xs">Cartas repetidas viram fragmentos. Monte as que faltam — cada set desbloqueia conforme seu nível.</p>
            </div>
          </header>

          {mostrarDica && (
            <div className="mb-3 rounded-xl p-3 text-xs leading-relaxed text-slate-700 bg-surface-2 border border-violet/30">
              <p>
                <strong className="text-slate-900">Fragmento</strong> é o «dinheiro de montar» da coleção: carta repetida vira
                fragmentos da raridade dela, e juntando a quantidade certa você monta a que falta — sem sorte.
                No chip fica seu total; no botão da carta, quanto falta (ex.: <strong className="text-slate-900">3/10</strong> = tem 3, precisa de 10).
                Cada repetida rende: comum <strong className="text-[#a66cff]">+3</strong>, incomum <strong className="text-[#a66cff]">+5</strong>, rara <strong className="text-[#a66cff]">+10</strong>, épica <strong className="text-[#a66cff]">+20</strong>, lendária <strong className="text-[#a66cff]">+40</strong>.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-2">
            {(Object.keys(FRAGMENTOS_POR_DUPLICADA) as Array<keyof typeof FRAGMENTOS_POR_DUPLICADA>).map(r =>
              <div key={r} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs bg-surface-2">
                <span className="w-2 h-2 rounded-full" style={{ background: r === 'comum' ? '#9ca3af' : r === 'incomum' ? '#38bdf8' : r === 'rara' ? '#a66cff' : r === 'epica' ? '#f5c451' : '#f59e0b' }} />
                <span className="text-slate-700">{r}</span>
                <span className="text-[#a66cff] font-bold">{fragmentos[r]}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setMostrarDica(v => !v)}
              className="shrink-0 ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-brand border border-brand/40 bg-brand/10 hover:bg-brand/20 active:scale-95 transition-all cursor-pointer"
              title={mostrarDica ? 'Ocultar explicação' : 'O que é fragmento?'}
            >
              <span className="text-sm font-black leading-none">?</span>
              {mostrarDica ? 'Fechar dica' : 'O que é?'}
            </button>
          </div>

          {faltando.length === 0 ? (
            <p className="text-brand text-sm font-semibold text-center py-2">Coleção completa! Parabéns 🎉</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-2.5">
              {faltando.map(carta => {
                const custo = CUSTO_FABRICACAO[carta.raridade];
                const tem = (fragmentos[carta.raridade] ?? 0) >= custo;
                const setCarta = SETS_CARTAS.find(s => s.id === carta.setId);
                const nivelBloqueio = setCarta && (data.pontosAcumulados ?? data.pontos) < setCarta.pontosMin ? nomeNivelPorPontos(setCarta.pontosMin) : null;
                return (
                  <div
                    key={carta.id}
                    className="bg-(--t-card-primary) border border-(--t-card-primary-border) shadow-(--t-card-primary-shadow) rounded-xl p-2.5 flex flex-col items-center text-center"
                    style={{ opacity: nivelBloqueio ? 0.55 : 1 }}
                  >
                    <div
                      className="bg-(--t-mist) w-11 h-11 rounded-xl flex items-center justify-center mb-1.5"
                      style={{ border: `1px solid ${{ comum: '#9ca3af', incomum: '#38bdf8', rara: '#a66cff', epica: '#f5c451', lendaria: '#f59e0b' }[carta.raridade]}44` }}
                    >
                      <img src={carta.icone} alt="" className="w-6 h-6" />
                    </div>
                    <p className="text-slate-900 text-[11px] font-semibold mt-1 leading-tight">{carta.nome}</p>
                    <p className="text-slate-600 text-[9px] uppercase tracking-widest mb-2">{carta.raridade}</p>
                    {nivelBloqueio && (
                      <p className="text-[9px] font-semibold text-amber-600 mb-1.5">Nível {nivelBloqueio}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const nova = fabricarCarta(carta.id);
                        if (nova) {
                          setFabricada(carta);
                          setTimeout(() => setFabricada(null), 2200);
                        }
                      }}
                      disabled={!tem || !!nivelBloqueio}
                      className="w-full text-[11px] font-bold rounded-lg py-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={tem && !nivelBloqueio
                        ? { background: 'var(--t-grad-brand)', color: 'var(--t-onaccent)' }
                        : { background: 'var(--t-mist)', color: 'var(--color-brand)' }}
                    >
                      {nivelBloqueio ? `${nomeNivelPorPontos(setCarta!.pontosMin)}` : tem ? `Fabricar (${custo})` : `${fragmentos[carta.raridade]}/${custo}`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {fabricada && (
            <div className="mt-4 rounded-xl p-3 text-center" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
              <p className="text-slate-800 text-sm">
                Carta fabricada: <strong className="text-brand">{fabricada.nome}</strong> · {' '}
                <span className="text-brand-2 font-semibold">+{getValorCarta(fabricada)} créditos</span> na coleção!
              </p>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}