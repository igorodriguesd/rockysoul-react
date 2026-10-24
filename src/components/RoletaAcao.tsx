import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import { useApiPage } from '../hooks/useApiPage';
import { errorMessage } from '../api/client';
import type { Roleta } from '../api/types';
import { cardView } from '../api/viewModels';
import { CARD_TO_MISSION, CUSTO_REGIRAR_POR_RARIDADE } from '../data/cartas';
import { useData } from '../context/DataContext';
import { useColecao } from '../context/CollectionContext';
import { lerGirosPerdidos, removerGiroPerdido, salvarGiroPerdido } from '../local/roletaLocal';
import type { Carta, Missao } from '../types';
import RoletaDrop from './RoletaDrop';
import CardItem from './CardItem';

function custoRegirar(carta: Carta, missoes: Missao[]): number {
  const missaoId = CARD_TO_MISSION[carta.id];
  const missao = missaoId ? missoes.find(m => m.id === missaoId) : undefined;
  if (missao?.pontos && missao.pontos > 0) return missao.pontos;
  return CUSTO_REGIRAR_POR_RARIDADE[carta.raridade] ?? 5;
}

export function RoletasDisponiveis() {
  const { refresh, user } = useApi();
  const { missoes } = useData();
  const [page, setPage] = useState(0);
  const { rows, error, loading } = useApiPage<Roleta>('roletas', page);
  const [selected, setSelected] = useState<string | null>(null);
  const perdidas = useMemo(() => user ? lerGirosPerdidos(user.id) : [], [user?.id, rows]);
  const locais: Roleta[] = useMemo(() => perdidas.map(g => {
    const carta = cardView(g.carta);
    const custo = custoRegirar(carta, missoes);
    return { verificacaoId: g.verificacaoId, carta: g.carta, chance: g.chance, girada: true, ganhou: false, duplicada: false, fragmentos: 0, custo } as Roleta & { custo: number };
  }), [perdidas, missoes]);
  const backendIds = new Set(rows.map(r => r.verificacaoId));
  const locaisUnicos = locais.filter(l => !backendIds.has(l.verificacaoId));
  const merged = [...rows, ...locaisUnicos];
  return <>
    <div className="bg-card-tertiary border border-card-secondary-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-1"><p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Roletas de cartas</p><button className="text-brand text-xs font-bold" onClick={refresh}>Atualizar roletas</button></div>
      {loading ? <p role="status" className="text-slate-500 text-xs mb-3">Consultando seus giros…</p> : error ? <p role="alert" className="text-xs text-red-500 mt-1.5">{error}</p> : merged.length === 0 ? <p className="text-slate-500 text-xs mb-3">Cada ação aprovada libera um giro gratuito. Ações em revisão aguardam aprovação.</p> : merged.map(row => {
        const carta = cardView(row.carta);
        const custo = row.girada && !row.ganhou ? custoRegirar(carta, missoes) : (row as Roleta & {custo?:number}).custo;
        return <div key={row.verificacaoId} className="flex items-start gap-2.5 py-2.5 border-b border-slate-200 last:border-0"><div className="flex-1 min-w-0"><p className="text-slate-800 text-sm font-medium leading-snug">{carta.nome}</p><p className="text-slate-500 text-[11px] mt-0.5">{row.chance}% de chance · {row.girada && !row.ganhou ? `Pode tentar novamente por ${custo ?? '?'} créditos` : 'giro livre ou pago'}</p></div><button onClick={() => setSelected(row.verificacaoId)} className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer" style={{ background: 'var(--t-grad-brand)', color: 'var(--t-onaccent)' }}>{row.girada && !row.ganhou ? 'Tentar novamente' : 'Girar roleta'}</button></div>;
      })}
      {(page > 0 || rows.length === 20) && <div className="flex items-center justify-between mb-1"><button disabled={page === 0} onClick={() => setPage(n => n - 1)}>Anterior</button><span>Página {page + 1}</span><button disabled={rows.length < 20} onClick={() => setPage(n => n + 1)}>Próxima</button></div>}
    </div>
    {selected && <RoletaAcao id={selected} onFechar={() => { setSelected(null); refresh(); }} />}
  </>;
}

export default function RoletaAcao({ id, onFechar }: { id: string; onFechar: () => void }) {
  const { service, refresh, user, spendCredits } = useApi();
  const { missoes } = useData();
  const { registrarCartaLocal } = useColecao();
  const [row, setRow] = useState<Roleta | null>(null);
  const [simulado, setSimulado] = useState<Roleta | null>(null);
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const [animating, setAnimating] = useState(false);
  const inFlight = useRef(false); const alive = useRef(true);
  useEffect(() => { alive.current = true; const controller = new AbortController();
    service.roulette(id, controller.signal).then(value => { if (alive.current) setRow(value); }).catch(failure => { if (!controller.signal.aborted) setError(errorMessage(failure)); });
    return () => { alive.current = false; controller.abort(); };
  }, [id, service]);
  async function spin() {
    if (inFlight.current || row?.girada) return;
    inFlight.current = true; setBusy(true); setError('');
    try { const result = await service.spin(id); if (alive.current) { setRow(result); setSimulado(null); const carta = cardView(result.carta); if (result.girada && !result.ganhou && user) salvarGiroPerdido(user.id, { verificacaoId: result.verificacaoId, carta: result.carta, chance: result.chance, custo: custoRegirar(carta, missoes) }); if (result.girada && result.ganhou && user) removerGiroPerdido(user.id, result.verificacaoId); setAnimating(true); } refresh(); }
    catch (failure) { if (alive.current) setError(`${errorMessage(failure)} Tente novamente para conferir seu giro. Você não perderá outro giro por isso.`); }
    finally { inFlight.current = false; if (alive.current) setBusy(false); }
  }
  function girarNovamente() {
    if (inFlight.current) return;
    const base = simulado ?? row;
    if (!base || base.ganhou) return;
    const carta = cardView(base.carta);
    const custo = custoRegirar(carta, missoes);
    if (!spendCredits(custo)) { setError(`Créditos insuficientes. Você precisa de ${custo} créditos para tentar novamente.`); return; }
    inFlight.current = true; setBusy(true); setError('');
    try {
      const ganhou = Math.random() * 100 < base.chance;
      const resultado: Roleta = { ...base, girada: true, ganhou, duplicada: false, fragmentos: 0 };
      if (ganhou) {
        const reg = registrarCartaLocal(carta);
        resultado.duplicada = reg.duplicada; resultado.fragmentos = reg.fragmentos;
      }
      setSimulado(resultado);
      setAnimating(true);
      if (user) {
        if (ganhou) removerGiroPerdido(user.id, base.verificacaoId);
        else salvarGiroPerdido(user.id, { verificacaoId: base.verificacaoId, carta: base.carta, chance: base.chance, custo });
      }
      refresh();
    } finally { inFlight.current = false; setBusy(false); }
  }
  const atual = simulado ?? row;
  const card = atual ? cardView(atual.carta) : null;
  const custo = card ? custoRegirar(card, missoes) : 0;
  const insuficiente = typeof user?.pontos === 'number' && user.pontos < custo;
  return createPortal(<div className="fixed inset-0 z-9998 flex items-start sm:items-center justify-center px-3 sm:px-6 pt-28 sm:pt-28 pb-3 sm:pb-6 bg-black/60" onClick={() => { if (!busy && !animating) onFechar(); }}>
    <div role="dialog" aria-modal="true" aria-label="Roleta de cartas" className="[background:var(--t-glass-strong)] border border-(--t-glass-strong-border) shadow-(--t-glass-strong-shadow) rounded-2xl shadow-2xl w-[90vw] max-w-[620px] p-4 sm:p-5 relative max-h-[calc(100vh-9.5rem)] supports-[height:100dvh]:max-h-[calc(100dvh-9.5rem)] overflow-y-auto" onClick={event => event.stopPropagation()}>
      <button onClick={onFechar} disabled={busy || animating} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors z-10" aria-label="Fechar roleta">✕</button>
      <div className="text-center"><h2 className="text-lg font-bold text-slate-900">Roleta de cartas</h2>
        {!atual && !error && <p role="status">Consultando seu giro…</p>}
        {atual && card && <><p className="text-sm text-slate-700 mt-0.5">{card.nome} · {atual.chance}% de chance</p>
          {animating ? <RoletaDrop carta={card} chance={atual.chance} caiu={atual.ganhou} onTerminar={() => setAnimating(false)} /> : atual.girada ? <div role="status" className="rounded-xl px-3.5 py-3 mb-4" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
            {(atual.ganhou || atual.duplicada) && (
              <div className="w-36 sm:w-40 mx-auto mb-3 pop-in">
                <CardItem carta={card} bloqueada={false} ativa={true} semHover />
              </div>
            )}
            <p className="text-lg font-bold text-brand">{atual.duplicada ? `Carta repetida (demonstração): +${atual.fragmentos} fragmentos` : atual.ganhou ? `Você ganhou ${card.nome}!` : 'A carta não saiu neste giro.'}</p>
            <p className="text-sm text-slate-700 mt-0.5">{atual.duplicada ? 'Demonstrativo local: os fragmentos não são sincronizados com a coleção oficial.' : atual.ganhou ? 'Exibido em demonstração local. A coleção oficial não foi alterada.' : simulado ? 'Você perdeu de novo. Pode tentar novamente pagando créditos apenas neste site.' : 'Você pode tentar novamente pagando o valor da ação em créditos apenas neste site.'}</p>
            {(atual.ganhou || atual.duplicada) ? <Link to="/colecao" onClick={onFechar} className="text-brand text-xs font-bold">Ver coleção</Link> : null}
          </div> : <p className="text-sm text-slate-700 mt-0.5">Um giro gratuito por ação aprovada. Caso perca, você pode tentar novamente pagando o valor da ação em créditos apenas neste site.</p>}
          {!atual.girada && <button disabled={busy} onClick={() => { void spin(); }} className="w-full py-2.5 mt-4 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all">{busy ? 'Girando…' : 'Girar roleta (gratuito)'}</button>}
          {atual.girada && !atual.ganhou && <button disabled={busy || insuficiente} onClick={() => { girarNovamente(); }} className="w-full py-2.5 mt-3 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all disabled:opacity-50">{busy ? 'Girando…' : `Tentar novamente por ${custo} créditos (apenas neste site)`}</button>}
          {atual.girada && !atual.ganhou && insuficiente && <p className="text-xs text-red-500 mt-1.5">Créditos insuficientes para tentar novamente.</p>}
        </>}
        {error && <p role="alert" className="text-xs text-red-500 mt-1.5">{error}</p>}
        <button onClick={onFechar} disabled={busy || animating} className="w-full py-2.5 mt-4 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all">Concluir</button>
      </div>
    </div></div>, document.body);
  } 
