import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import { useApiPage } from '../hooks/useApiPage';
import { errorMessage } from '../api/client';
import type { Roleta } from '../api/types';
import { cardView } from '../api/viewModels';
import RoletaDrop from './RoletaDrop';

export function RoletasDisponiveis() {
  const { refresh } = useApi();
  const [page, setPage] = useState(0);
  const { rows, error, loading } = useApiPage<Roleta>('roletas', page);
  const [selected, setSelected] = useState<string | null>(null);
  return <>
    <div className="bg-card-tertiary border border-card-secondary-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-1"><p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Roletas de cartas</p><button className="text-brand text-xs font-bold" onClick={refresh}>Atualizar roletas</button></div>
      {loading ? <p role="status" className="text-slate-500 text-xs mb-3">Consultando seus giros…</p> : error ? <p role="alert" className="text-xs text-red-500 mt-1.5">{error}</p> : rows.length === 0 ? <p className="text-slate-500 text-xs mb-3">Cada ação aprovada libera um giro gratuito. Ações em revisão aguardam aprovação.</p> : rows.map(row => <div key={row.verificacaoId} className="flex items-start gap-2.5 py-2.5 border-b border-slate-200 last:border-0"><div className="flex-1 min-w-0"><p className="text-slate-800 text-sm font-medium leading-snug">{row.carta.nome}</p><p className="text-slate-500 text-[11px] mt-0.5">{row.chance}% de chance · giro gratuito</p></div><button onClick={() => setSelected(row.verificacaoId)} className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer" style={{ background: 'var(--t-grad-brand)', color: 'var(--t-onaccent)' }}>Girar roleta</button></div>)}
      {(page > 0 || rows.length === 20) && <div className="flex items-center justify-between mb-1"><button disabled={page === 0} onClick={() => setPage(n => n - 1)}>Anterior</button><span>Página {page + 1}</span><button disabled={rows.length < 20} onClick={() => setPage(n => n + 1)}>Próxima</button></div>}
    </div>
    {selected && <RoletaAcao id={selected} onFechar={() => { setSelected(null); refresh(); }} />}
  </>;
}

export default function RoletaAcao({ id, onFechar }: { id: string; onFechar: () => void }) {
  const { service, refresh } = useApi();
  const [row, setRow] = useState<Roleta | null>(null);
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
    try { const result = await service.spin(id); if (alive.current) { setRow(result); setAnimating(true); } refresh(); }
    catch (failure) { if (alive.current) setError(`${errorMessage(failure)} Tente novamente para conferir seu giro. Você não perderá outro giro por isso.`); }
    finally { inFlight.current = false; if (alive.current) setBusy(false); }
  }
  const card = row ? cardView(row.carta) : null;
  return createPortal(<div className="mobile-modal-backdrop fixed inset-0 z-9998 flex items-start sm:items-center justify-center px-3 sm:px-6 pt-28 sm:pt-28 pb-3 sm:pb-6 bg-black/60" onClick={() => { if (!busy && !animating) onFechar(); }}>
    <div role="dialog" aria-modal="true" aria-label="Roleta de cartas" className="[background:var(--t-glass-strong)] border border-(--t-glass-strong-border) shadow-(--t-glass-strong-shadow) rounded-2xl shadow-2xl w-[90vw] max-w-[620px] p-4 sm:p-5 relative max-h-[calc(100vh-9.5rem)] supports-[height:100dvh]:max-h-[calc(100dvh-9.5rem)] overflow-y-auto" onClick={event => event.stopPropagation()}>
      <button onClick={onFechar} disabled={busy || animating} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors z-10" aria-label="Fechar roleta">✕</button>
      <div className="text-center"><h2 className="text-lg font-bold text-slate-900">Roleta de cartas</h2>
        {!row && !error && <p role="status">Consultando seu giro…</p>}
        {row && card && <><p className="text-sm text-slate-700 mt-0.5">{card.nome} · {row.chance}% de chance</p>
          {animating ? <RoletaDrop carta={card} chance={row.chance} caiu={row.ganhou} onTerminar={() => setAnimating(false)} /> : row.girada ? <div role="status" className="rounded-xl px-3.5 py-3 mb-4" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
            {row.ganhou && <img src={card.icone} alt={card.nome} className="w-12 h-12 mx-auto mb-2" />}
            <p className="text-lg font-bold text-brand">{row.duplicada ? `Carta repetida: +${row.fragmentos} fragmentos` : row.ganhou ? `Você ganhou ${card.nome}!` : 'A carta não saiu neste giro.'}</p>
            <p className="text-sm text-slate-700 mt-0.5">{row.duplicada ? `Fragmentos de raridade ${card.raridade} adicionados à sua coleção.` : row.ganhou ? 'A carta foi salva na sua coleção.' : 'Registre outra ação e aguarde sua aprovação para ganhar um novo giro.'}</p><Link to="/colecao" onClick={onFechar} className="text-brand text-xs font-bold">Ver coleção</Link>
          </div> : <p className="text-sm text-slate-700 mt-0.5">Um giro gratuito por ação aprovada. Cartas repetidas viram fragmentos. Nenhum ponto será descontado.</p>}
          {!row.girada && <button disabled={busy} onClick={() => { void spin(); }} className="w-full py-2.5 mt-4 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all">{busy ? 'Girando…' : 'Girar roleta'}</button>}
        </>}
        {error && <p role="alert" className="text-xs text-red-500 mt-1.5">{error}</p>}
        <button onClick={onFechar} disabled={busy || animating} className="w-full py-2.5 mt-4 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all">Concluir</button>
      </div>
    </div></div>, document.body);
}
