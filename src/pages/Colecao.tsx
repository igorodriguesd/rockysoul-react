import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CARTAS, SETS_CARTAS, FRAGMENTOS_POR_DUPLICADA, CUSTO_FABRICACAO, PESO_RARIDADE, getValorCarta } from '../data/cartas';
import SetColecao from '../components/SetColecao';
import { useColecao } from '../context/CollectionContext';
import { useData } from '../context/DataContext';
import { nomeNivelPorPontos, grupoDaCarta } from '../data/constants';
import { TermoAjuda } from '../components/TermoAjuda';
import IconeMissao from '../components/IconeMissao';
import PainelValorColecao from '../components/PainelValorColecao';
import type { Carta } from '../types';

type ModoColecao = 'cartas' | 'fabrica';

const GRAD_COLECAO = 'linear-gradient(135deg, #6d4fc2, #a78bfa)';
const BORDA_COLECAO = 'rgba(109,79,194,0.4)';

export function Colecao() {
  useEffect(() => { document.title = 'RockySoulUp - Coleção'; }, []);

  const navigate = useNavigate();
  const { colecao, getProgressoTotal, getValorTotal, fabricarCarta, setDesbloqueado } = useColecao();
  const { data } = useData();
  const [modo, setModo] = useState<ModoColecao>('cartas');
  const [mostrarDica, setMostrarDica] = useState(false);
  const [fabricada, setFabricada] = useState<Carta | null>(null);

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
      <header className="mb-4 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-white text-3xl font-bold mb-1">Minha Coleção</h1>
          <p className="text-slate-400 text-sm font-medium mt-1 max-w-2xl">
            Cada carta conquistada vira <strong className="text-gold">créditos no seu saldo</strong> — quanto mais rara a
            carta, maior o valor. Completar um set ainda rende um bônus de química.
            <TermoAjuda
              termo="Por que carta rara vale mais?"
              dica="O valor da carta é creditado no seu saldo assim que você a obtém: Comum 8, Incomum 15, Rara 30, Épica 60 e Lendária 120 créditos. A versão brilhante vale 3x. E cada set completo paga +180 créditos de química (30 na 3ª carta, 150 na 4ª)."
            />
          </p>
        </div>
      </header>

      <PainelValorColecao valorTotal={valorTotal} obtidas={obtidas} total={total} foils={foils.length} />

      {obtidas === 0 && (
        <div
          className="mb-4 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
style={{ background: 'var(--t-collection-bg)', border: `1px solid ${BORDA_COLECAO}` }}
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
              Registre uma ação sustentável no Dashboard para ganhar suas primeiras cartas — cada missão pode soltar uma das 16 disponíveis.
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
      <div className="relative h-3 rounded-full overflow-hidden mb-5" style={{ background: 'var(--t-collection-bg)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percentual}%`,
            background: GRAD_COLECAO,
          }}
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setModo('cartas')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${modo === 'cartas' ? 'text-(--t-onaccent)' : 'text-slate-600 bg-surface-2 hover:bg-surface-hover'}`}
          style={modo === 'cartas' ? { background: GRAD_COLECAO } : undefined}
        >
          Minhas cartas
        </button>
        <button
          onClick={() => setModo('fabrica')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${modo === 'fabrica' ? 'text-(--t-onaccent)' : 'text-slate-600 bg-surface-2 hover:bg-surface-hover'}`}
          style={modo === 'fabrica' ? { background: GRAD_COLECAO } : undefined}
        >
          Fábrica
          {nFabricaveis > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full text-[10px] font-extrabold bg-gold text-slate-900">
              {nFabricaveis}
            </span>
          )}
        </button>
      </div>

      {modo === 'fabrica' ? (
      <div
        className="rounded-2xl p-4 sm:p-5"
        style={{
          background: 'var(--t-grad-factory)',
          border: `1px solid ${BORDA_COLECAO}`,
        }}
      >
          <header className="flex items-center gap-3 mb-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(109,79,194,0.15)', border: `1px solid ${BORDA_COLECAO}` }}
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
                Cada repetida rende: comum <strong className="text-[#38bdf8]">+3</strong>, incomum <strong className="text-[#38bdf8]">+5</strong>, rara <strong className="text-[#38bdf8]">+10</strong>, épica <strong className="text-[#38bdf8]">+20</strong>, lendária <strong className="text-[#38bdf8]">+40</strong>.
                Cartas repetidas <strong className="text-slate-900">não</strong> dão créditos; fabricar a que falta dá — o valor
                da carta entra no seu saldo.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-2">
            {(Object.keys(FRAGMENTOS_POR_DUPLICADA) as Array<keyof typeof FRAGMENTOS_POR_DUPLICADA>).map(r =>
              <div key={r} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs bg-surface-2">
                <span className="w-2 h-2 rounded-full" style={{ background: r === 'comum' ? '#9ca3af' : r === 'incomum' ? '#38bdf8' : r === 'rara' ? '#a855f7' : r === 'epica' ? '#ff4d9e' : '#fbbf24' }} />
                <span className="text-slate-700">{r}</span>
                <span className="text-gold font-bold">{fragmentos[r]}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setMostrarDica(v => !v)}
              className="shrink-0 ml-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-violet border border-violet/40 bg-violet/10 hover:bg-violet/20 active:scale-95 transition-all cursor-pointer"
              title={mostrarDica ? 'Ocultar explicação' : 'O que é fragmento?'}
            >
              <span className="text-sm font-black leading-none">?</span>
              {mostrarDica ? 'Fechar dica' : 'O que é?'}
            </button>
          </div>

          {faltando.length === 0 ? (
            <p className="text-brand text-sm font-semibold text-center py-2">Coleção completa! Parabéns</p>
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
                      style={{ border: `1px solid ${{ comum: '#9ca3af', incomum: '#38bdf8', rara: '#a855f7', epica: '#ff4d9e', lendaria: '#fbbf24' }[carta.raridade]}44` }}
                    >
                      <IconeMissao src={carta.icone} cor={grupoDaCarta(carta.id)?.cor ?? '#94a3b8'} className="w-6 h-6" />
                    </div>
                    <p className="text-slate-900 text-[11px] font-semibold mt-1 leading-tight">{carta.nome}</p>
                    <p className="text-slate-600 text-[9px] uppercase tracking-widest mb-2">{carta.raridade}</p>
                    {nivelBloqueio && (
                      <p className="text-[9px] font-semibold text-gold mb-1.5">Nível {nivelBloqueio}</p>
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
            <div className="mt-4 rounded-xl p-3 text-center" style={{ background: 'rgba(109,79,194,0.15)', border: `1px solid ${BORDA_COLECAO}` }}>
              <p className="text-slate-800 text-sm">
                Carta fabricada: <strong className="text-brand">{fabricada.nome}</strong> ·{' '}
                <span className="text-brand-2 font-semibold">+{getValorCarta(fabricada)} créditos no seu saldo</span>
              </p>
            </div>
          )}
      </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {SETS_CARTAS.map(set => (
          <SetColecao key={set.id} set={set} />
        ))}
      </div>
      )}
    </div>
  );
}