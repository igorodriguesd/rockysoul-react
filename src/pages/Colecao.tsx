import { useEffect, useState } from 'react';
<<<<<<< HEAD
import { FRAGMENTOS_POR_DUPLICADA, CUSTO_FABRICACAO, PESO_RARIDADE, getValorCarta } from '../data/cartas';
import SetColecao from '../components/SetColecao';
import { useColecao } from '../context/CollectionContext';
import { ApiGate, ListState, PageControls } from '../components/ApiUi';
import { useApi } from '../context/ApiContext';
import { useApiPage } from '../hooks/useApiPage';
import type { CartaApi, UsuarioCartaApi, FragmentoApi } from '../api/types';
=======
import { useNavigate } from 'react-router-dom';
import { CARTAS, SETS_CARTAS, FRAGMENTOS_POR_DUPLICADA, CUSTO_FABRICACAO, PESO_RARIDADE, getValorCarta, missoesPorRaridade } from '../data/cartas';
import SetColecao from '../components/SetColecao';
import { useColecao } from '../context/CollectionContext';
import { MISSOES, nomeNivelPorPontos, grupoDaCarta } from '../data/constants';
import { TermoAjuda } from '../components/TermoAjuda';
import IconeMissao from '../components/IconeMissao';
import PainelValorColecao from '../components/PainelValorColecao';
>>>>>>> origin/main
import type { Carta } from '../types';

type ModoColecao = 'cartas' | 'fabrica';

const GRAD_COLECAO = 'linear-gradient(135deg, #6d4fc2, #a78bfa)';
const BORDA_COLECAO = 'rgba(109,79,194,0.4)';

export function Colecao() {
  useEffect(() => { document.title = 'RockySoulUp - Coleção'; }, []);

<<<<<<< HEAD
  const { colecao, getProgressoTotal, getValorTotal, fabricarCarta, catalogo: CARTAS, conjuntos: SETS_CARTAS } = useColecao();
  const { user } = useApi();
  const [page, setPage] = useState(0); const [ownedPage, setOwnedPage] = useState(0); const [fragmentPage, setFragmentPage] = useState(0);
  const catalog = useApiPage<CartaApi>('carta', page); const owned = useApiPage<UsuarioCartaApi>('usuario-carta', ownedPage); const fragments = useApiPage<FragmentoApi>('usuario-fragmento', fragmentPage);
=======
  const navigate = useNavigate();
  const { colecao, getProgressoTotal, getValorTotal, fabricarCarta, setDesbloqueado } = useColecao();
  const [modo, setModo] = useState<ModoColecao>('cartas');
>>>>>>> origin/main
  const [fabricada, setFabricada] = useState<Carta | null>(null);

  const { obtidas, total } = getProgressoTotal();
  const percentual = total > 0 ? (obtidas / total) * 100 : 0;
  const valorTotal = getValorTotal();
  const foils = colecao.cartasFoil ?? [];
  const fragmentos = colecao.fragmentos ?? { comum: 0, incomum: 0, rara: 0, epica: 0, lendaria: 0 };

  const faltando = CARTAS
    .filter(c => !colecao.cartasObtidas.includes(c.id))
    .sort((a, b) => PESO_RARIDADE[a.raridade] - PESO_RARIDADE[b.raridade]);

  const listaFabrica = [...CARTAS]
    .filter(c => setDesbloqueado(c.setId))
    .sort((a, b) => PESO_RARIDADE[a.raridade] - PESO_RARIDADE[b.raridade]);

  const totalFabrica = listaFabrica.length;
  const obtidasFabrica = listaFabrica.filter(c => colecao.cartasObtidas.includes(c.id)).length;
  const faltandoFabrica = totalFabrica - obtidasFabrica;

  const setsBloqueados = SETS_CARTAS
    .filter(s => !setDesbloqueado(s.id))
    .sort((a, b) => a.pontosMin - b.pontosMin);
  const proximoSet = setsBloqueados[0] ?? null;
  const cartasBloqueadas = setsBloqueados.reduce((acc, s) => acc + CARTAS.filter(c => c.setId === s.id).length, 0);

  const nFabricaveis = faltando.filter(c => setDesbloqueado(c.setId) && (fragmentos[c.raridade] ?? 0) >= CUSTO_FABRICACAO[c.raridade]).length;

  const listaFabricaObtidas = listaFabrica.filter(c => colecao.cartasObtidas.includes(c.id));
  const listaFabricaFaltando = listaFabrica.filter(c => !colecao.cartasObtidas.includes(c.id));
  const listaFabricaPronto = listaFabricaFaltando.filter(c => (fragmentos[c.raridade] ?? 0) >= CUSTO_FABRICACAO[c.raridade]);
  const listaFabricaFalta = listaFabricaFaltando
    .filter(c => (fragmentos[c.raridade] ?? 0) < CUSTO_FABRICACAO[c.raridade])
    .sort((a, b) => {
      const pa = (fragmentos[a.raridade] ?? 0) / CUSTO_FABRICACAO[a.raridade];
      const pb = (fragmentos[b.raridade] ?? 0) / CUSTO_FABRICACAO[b.raridade];
      return pb - pa;
    });

  function renderCartaFabrica(carta: Carta, fabricavel: boolean) {
    const custo = CUSTO_FABRICACAO[carta.raridade];
    const obtida = colecao.cartasObtidas.includes(carta.id);
    const foil = colecao.cartasFoil?.includes(carta.id) ?? false;
    const progresso = Math.min(100, ((fragmentos[carta.raridade] ?? 0) / custo) * 100);
    const porRepetida = FRAGMENTOS_POR_DUPLICADA[carta.raridade];
    const faltam = custo - (fragmentos[carta.raridade] ?? 0);
    const repetidas = Math.ceil(faltam / porRepetida);
    const origem = missoesPorRaridade(carta.raridade)
      .map(id => MISSOES.find(m => m.id === id))
      .filter((m): m is (typeof MISSOES)[number] => !!m);
    return (
      <div
        key={carta.id}
        className="bg-(--t-card-primary) border border-(--t-card-primary-border) shadow-(--t-card-primary-shadow) rounded-xl p-2.5 flex flex-col items-center text-center relative"
      >
        <div
          className="bg-(--t-mist) w-11 h-11 rounded-xl flex items-center justify-center mb-1.5"
          style={{ border: `1px solid ${{ comum: '#9ca3af', incomum: '#38bdf8', rara: '#a855f7', epica: '#ff4d9e', lendaria: '#fbbf24' }[carta.raridade]}44` }}
        >
          <IconeMissao src={carta.icone} cor={grupoDaCarta(carta.id)?.cor ?? '#94a3b8'} className="w-6 h-6" />
        </div>
        {obtida && (
          <span
            className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black"
            style={{ background: 'var(--t-accent)', color: 'var(--t-onaccent)' }}
            title="Já está na sua coleção"
          >
            ✓
          </span>
        )}
        <p className="text-slate-900 text-[11px] font-semibold mt-1 leading-tight">{carta.nome}</p>
        <p className="text-slate-600 text-[9px] uppercase tracking-widest mb-2">
          {carta.raridade}{foil ? ' · brilhante' : ''}
        </p>
        {obtida ? (
          <>
            <div
              className="w-full text-[11px] font-bold rounded-lg py-1.5 text-center"
              style={{ background: 'var(--t-accent-soft)', color: 'var(--color-brand)' }}
            >
              Já obtida
            </div>
            <p className="text-[9px] text-slate-500 mt-1 leading-tight text-center">
              se cair de novo → <strong className="text-[#38bdf8]">+{FRAGMENTOS_POR_DUPLICADA[carta.raridade]}</strong> frag. de {carta.raridade}
            </p>
          </>
        ) : fabricavel ? (
          <>
            <button
              type="button"
              onClick={() => {
                const nova = fabricarCarta(carta.id);
                if (nova) {
                  setFabricada(carta);
                  setTimeout(() => setFabricada(null), 2200);
                }
              }}
              className="w-full text-[11px] font-bold rounded-lg py-1.5 transition-all active:scale-95 cursor-pointer"
              style={{ background: 'var(--t-grad-brand)', color: 'var(--t-onaccent)' }}
            >
              Montar ({custo})
            </button>
            <p className="text-[9px] text-slate-500 mt-1 leading-tight text-center">
              usa <strong className="text-slate-600">{custo}</strong> frag. de {carta.raridade} · vale <strong className="text-gold">{getValorCarta(carta)}</strong> créd.
            </p>
          </>
        ) : (
          <>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--t-slate-200)' }}>
              <div className="h-full rounded-full" style={{ width: `${progresso}%`, background: 'var(--t-grad-brand)' }} />
            </div>
            <p className="text-[9px] text-slate-500 mt-1.5 leading-tight text-center">
              faltam <strong className="text-slate-700">{faltam}</strong> frag. de {carta.raridade} · vale <strong className="text-gold">{getValorCarta(carta)}</strong> créd.
            </p>
            <p className="text-[9px] text-slate-500 mt-1 leading-tight text-center">
              ≈ <strong className="text-slate-700">{repetidas}</strong> repetida{repetidas === 1 ? '' : 's'} de {carta.raridade}
            </p>
            {origem.length > 0 && (
              <p className="text-[9px] text-slate-500 mt-1 leading-tight text-center">
                repita: {origem.slice(0, 2).map(m => m.nome).join(' · ')}
                {origem.length > 2 ? ' …' : ''}
              </p>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-6">
      <header className="mb-4 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-white text-3xl font-bold mb-1">Minha Coleção</h1>
<<<<<<< HEAD
          <p className="text-[#20d968] text-sm font-semibold mt-1">
            Cartas na coleção: {obtidas} · Valor em créditos: {valorTotal}{foils.length > 0 && ` · ${foils.length} brilhante${foils.length > 1 ? 's' : ''} ✨`}
=======
          <p className="text-slate-400 text-sm font-medium mt-1 max-w-2xl">
            Cada carta conquistada vira <strong className="text-gold">créditos no seu saldo</strong> — quanto mais rara a
            carta, maior o valor. Completar um set ainda rende um bônus de química.
            <TermoAjuda
              termo="Por que carta rara vale mais?"
              dica="O valor da carta é creditado no seu saldo assim que você a obtém: Comum 8, Incomum 15, Rara 30, Épica 60 e Lendária 120 créditos. A versão brilhante vale 3x. E cada set completo paga +180 créditos de química (30 na 3ª carta, 150 na 4ª)."
            />
>>>>>>> origin/main
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

<<<<<<< HEAD
      {!user && <ApiGate><span /></ApiGate>}
      <ListState {...catalog} count={catalog.rows.length} />
=======
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
          Fragmentos
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
              <h3 className="text-slate-900 font-semibold text-base leading-tight">Monte cartas com fragmentos</h3>
              <p className="text-slate-500 text-xs">
                Cada carta repetida vira fragmentos da raridade dela. Use os fragmentos para montar cartas que você
                ainda não tem dos sets liberados — não é preciso ter a repetida daquela carta específica.
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-slate-900 text-sm font-bold leading-tight">{obtidasFabrica}/{totalFabrica} cartas</p>
              <p className="text-[11px] text-slate-500 leading-tight">
                {faltandoFabrica === 0 ? 'tudo liberado!' : `${faltandoFabrica} para montar`}
              </p>
            </div>
          </header>

          {proximoSet && (
            <p className="mb-3 text-[11px] text-slate-500 leading-snug">
              {cartasBloqueadas} cartas de {setsBloqueados.length}{' '}
              {setsBloqueados.length === 1 ? 'set ainda bloqueado' : 'sets ainda bloqueados'} — o próximo é{' '}
              <strong className="text-gold">{proximoSet.nome}</strong>, que libera no nível{' '}
              <strong className="text-gold">{nomeNivelPorPontos(proximoSet.pontosMin)}</strong> ({proximoSet.pontosMin}{' '}
              créditos). As cartas de sets bloqueados não podem ser montadas.
            </p>
          )}

          <div className="mb-3 rounded-xl p-3 text-[11px] leading-snug text-slate-600 bg-(--t-surface-2) border border-violet/30">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">Como trocar repetida por carta</p>
            <ol className="flex flex-col gap-1.5">
              <li className="flex gap-2">
                <span className="shrink-0 w-4 h-4 rounded-full bg-brand text-(--t-onaccent) text-[9px] font-black flex items-center justify-center mt-px">1</span>
                <span>
                  <strong className="text-slate-900">Cumpra uma missão</strong> e ganhe a carta dela. Se você
                  <strong className="text-slate-900"> já tem</strong> essa carta, ela vira
                  <strong className="text-[#38bdf8]"> fragmentos</strong> da raridade dela (não vira créditos).
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 w-4 h-4 rounded-full bg-brand text-(--t-onaccent) text-[9px] font-black flex items-center justify-center mt-px">2</span>
                <span>
                  <strong className="text-slate-900">Repita a mesma missão</strong> até juntar os fragmentos. Os chips
                  abaixo mostram seu total e quanto cada repetida rende.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0 w-4 h-4 rounded-full bg-brand text-(--t-onaccent) text-[9px] font-black flex items-center justify-center mt-px">3</span>
                <span>
                  Volte aqui e clique em <strong className="text-slate-900">Montar</strong> na carta que falta: ela entra
                  na sua coleção <strong className="text-slate-900">e</strong> o valor dela vai para o saldo.
                </span>
              </li>
            </ol>
            <p className="mt-2 pt-2 border-t border-(--t-card-primary-border) text-slate-500">
              Os fragmentos <strong className="text-slate-700">não servem só para fechar o set</strong>: qualquer carta de
              qualquer set já liberado pode ser montada. Você também pode clicar na carta que falta, na aba
              <strong className="text-slate-700"> Minhas cartas</strong>, e usar os fragmentos dali.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-2 items-center">
            {(Object.keys(FRAGMENTOS_POR_DUPLICADA) as Array<keyof typeof FRAGMENTOS_POR_DUPLICADA>).map(r =>
              <div key={r} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs bg-surface-2">
                <span className="w-2 h-2 rounded-full" style={{ background: r === 'comum' ? '#9ca3af' : r === 'incomum' ? '#38bdf8' : r === 'rara' ? '#a855f7' : r === 'epica' ? '#ff4d9e' : '#fbbf24' }} />
                <span className="text-slate-700">{r}</span>
                <span className="text-gold font-bold">{fragmentos[r]}</span>
                <span className="text-slate-500 text-[10px]">({FRAGMENTOS_POR_DUPLICADA[r]}/repetida)</span>
              </div>
            )}
          </div>

          {faltandoFabrica === 0 && totalFabrica > 0 && (
            <p className="text-brand text-sm font-semibold text-center py-2 mb-3">Você fabricou todas as cartas liberadas!</p>
          )}

          {listaFabricaPronto.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                Pode montar agora · {listaFabricaPronto.length}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                {listaFabricaPronto.map(carta => renderCartaFabrica(carta, true))}
              </div>
            </div>
          )}

          {listaFabricaFalta.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                Falta fragmentos · {listaFabricaFalta.length}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                {listaFabricaFalta.map(carta => renderCartaFabrica(carta, false))}
              </div>
            </div>
          )}

          {listaFabricaObtidas.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                Já obtidas · cada repetida vira fragmento
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                {listaFabricaObtidas.map(carta => renderCartaFabrica(carta, true))}
              </div>
            </div>
          )}

          {fabricada && (
            <div className="mt-4 rounded-xl p-3 text-center" style={{ background: 'rgba(109,79,194,0.15)', border: `1px solid ${BORDA_COLECAO}` }}>
              <p className="text-slate-800 text-sm">
                Carta montada: <strong className="text-brand">{fabricada.nome}</strong> ·{' '}
                <span className="text-brand-2 font-semibold">+{getValorCarta(fabricada)} créditos no seu saldo</span>
              </p>
            </div>
          )}
      </div>
      ) : (
>>>>>>> origin/main
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {[...new Set(catalog.rows.map(card => card.conjunto))].map(id => SETS_CARTAS.find(set => set.id === id) ?? { id, nome: id, tema: 'Sua coleção sustentável', descricao: '', cor: '#20d968', icone: '/icons/folha.svg' }).map(set => (
          <SetColecao key={set.id} set={set} cartasVisiveis={catalog.rows.filter(card => card.conjunto === set.id).map(card => ({ id: String(card.id), nome: card.nome, setId: card.conjunto, raridade: card.raridade.toLowerCase() as Carta['raridade'], descricao: card.descricao ?? '', educativa: '', icone: CARTAS.find(item => item.id === String(card.id))?.icone ?? '/icons/folha.svg' }))} cartasObtidas={owned.rows.filter(row => row.usuarioId === user?.id && row.quantidade > 0).map(row => String(row.cartaId))} />
        ))}
      </div>
<<<<<<< HEAD

      <PageControls page={page} setPage={setPage} count={catalog.rows.length} loading={catalog.loading} />
      {user && <section className="glass-strong rounded-2xl p-4 sm:p-5 mt-5"><h2 className="font-semibold">Cartas atribuídas</h2><ListState {...owned} count={owned.rows.length} />{owned.rows.map(row => <p key={row.cartaId} className="text-white/60 text-sm py-2">{CARTAS.find(card => card.id === String(row.cartaId))?.nome ?? `Carta #${row.cartaId}`} · {row.quantidade} unidade(s)</p>)}<PageControls page={ownedPage} setPage={setOwnedPage} count={owned.rows.length} loading={owned.loading} /><h2 className="font-semibold mt-5">Fragmentos</h2><ListState {...fragments} count={fragments.rows.length} /><div className="flex flex-wrap gap-2 mt-3">{fragments.rows.map(row => <p key={row.raridade} className="rounded-lg px-3 py-2 text-xs bg-white/5 text-[#a66cff]">{row.raridade} · {row.quantidade}</p>)}</div><PageControls page={fragmentPage} setPage={setFragmentPage} count={fragments.rows.length} loading={fragments.loading} /></section>}
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
              <p className="text-white/50 text-xs">Consulte seus fragmentos. Fabricação ainda indisponível.</p>
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
                      disabled title="Fabricação ainda indisponível"
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
=======
>>>>>>> origin/main
      )}
    </div>
  );
}