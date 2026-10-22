import { useEffect, useState, type FormEvent } from 'react';
import { useApi } from '../context/ApiContext';
import { useApiPage } from '../hooks/useApiPage';
import { adminResources, type Field } from '../api/adminFields';
import type { Consumo, Registro, Recurso } from '../api/types';
import { ApiGate, ListState, PageControls } from '../components/ApiUi';
import { Verificacoes } from '../components/Verificacoes';
import { errorMessage } from '../api/client';
import { showToast } from '../components/Toast';

export function Administracao() { return <div className="max-w-6xl mx-auto px-5 py-8"><ApiGate><AdminData /></ApiGate></div>; }
function AdminData() {
  const { isAdmin } = useApi();
  if (!isAdmin) return <section className="card-primary rounded-2xl p-4 sm:p-5 text-white"><h1 className="text-2xl font-bold">Área administrativa</h1><p className="mt-3 text-white/65">O acesso administrativo não foi confirmado para esta sessão. Use uma conta ADMIN; se a API estava indisponível ao conectar, reconecte quando ela estiver pronta.</p></section>;
  return <div className="space-y-6"><h1 className="text-white text-3xl font-bold">Administração</h1><Usage /><Verificacoes admin /><Crud /></div>;
}
function Usage() {
  const { service, revision, refresh } = useApi(); const [usage, setUsage] = useState<Consumo | null>(null); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { let active = true; service.usage().then(value => { if (active) { setUsage(value); setError(''); } }).catch(failure => { if (active) setError(errorMessage(failure)); }); return () => { active = false; }; }, [service, revision]);
  async function suspend() {
    if (!usage || !window.confirm(usage.suspenso ? 'Retomar novas análises, respeitando os limites?' : 'Suspender novas análises? Chamadas já enviadas podem ser cobradas.')) return;
    setBusy(true); setError('');
    try { await service.suspend(!usage.suspenso); refresh(); } catch (failure) { setError(errorMessage(failure)); } finally { setBusy(false); }
  }
  const money = (value: number) => (value / 1_000_000).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  return <section className="card-primary rounded-2xl p-4 sm:p-5 text-white space-y-3"><h2 className="text-xl font-bold">Consumo e suspensão da IA</h2>{usage && <><p>Integração {usage.habilitado ? 'habilitada' : 'desabilitada'} · {usage.suspenso ? 'Suspensa' : 'Sem suspensão administrativa'}</p><p>Dia: {money(usage.consumoOuReservaDiaMicrosUSD)} / {money(usage.limiteDiaMicrosUSD)}</p><p>Mês: {money(usage.consumoOuReservaMesMicrosUSD)} / {money(usage.limiteMesMicrosUSD)}</p><p className="text-white/60 text-sm">Reservas incertas: {usage.reservasIncertas}. Os valores incluem estimativas/reservas e não substituem a fatura dos provedores.</p><button className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={busy} onClick={() => { void suspend(); }}>{usage.suspenso ? 'Retomar análises' : 'Suspender análises'}</button></>}{error && <p role="alert" className="text-red-300">{error}</p>}<button className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ml-2" disabled={busy} onClick={refresh}>Reconsultar consumo</button></section>;
}
function Crud() {
  const { service, refresh, refreshProfile, user, disconnect } = useApi();
  const [resource, setResource] = useState<Recurso>('acao'); const [page, setPage] = useState(0);
  const list = useApiPage<Registro>(resource, page);
  const [editor, setEditor] = useState<{ original?: Registro; values: Record<string, string>; balance?: boolean } | null>(null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const fields: Field[] = editor?.balance ? [{ key: 'pontos', label: 'Saldo absoluto de pontos', type: 'number', required: true, min: 0 }, { key: 'resgatados', label: 'Total resgatado absoluto', type: 'number', required: true, min: 0 }] : adminResources[resource].fields;
  async function edit(row: Registro, balance = false) {
    setBusy(true); setError('');
    try {
      const fresh = await service.get<Registro>(resource, row);
      setEditor({ original: fresh, balance, values: Object.fromEntries(Object.entries(fresh).map(([key, value]) => [key, value == null ? '' : String(value)])) });
    } catch (failure) { setError(errorMessage(failure)); } finally { setBusy(false); }
  }
  async function save(event: FormEvent) {
    event.preventDefault(); if (!editor) return; setBusy(true); setError('');
    try {
      const body: Registro = {};
      for (const field of fields) {
        const raw = (editor.values[field.key] ?? '').trim();
        if (!raw && field.required) throw new Error(`Preencha ${field.label}.`);
        if (field.type === 'number' && raw) {
          const number = Number(raw);
          if (!Number.isSafeInteger(number) || number < (field.min ?? 0) || number > (field.max ?? 2_147_483_647)) throw new Error(`${field.label}: valor fora do intervalo.`);
          body[field.key] = number;
        } else body[field.key] = raw || null;
      }
      body.versao = editor.original?.versao ?? 0;
      if (editor.balance && editor.original) await service.balance(editor.original, body);
      else await service.save(resource, body, editor.original);
      const ownProfile = resource === 'usuario' && !editor.balance && editor.original?.id === user?.id;
      setEditor(null); refresh();
      if (ownProfile) { disconnect(); showToast('Perfil atualizado. Entre novamente.'); }
      else { await refreshProfile(); showToast('Registro salvo pela API.'); }
    } catch (failure) { setError(failure instanceof Error && !('status' in failure) ? failure.message : errorMessage(failure)); }
    finally { setBusy(false); }
  }
  async function remove(row: Registro) {
    if (!window.confirm(resource === 'usuario' ? 'Desativar esta conta? Todas as sessões serão revogadas.' : 'Excluir este registro? Referências existentes podem impedir a operação.')) return;
    setBusy(true); setError('');
    try { await service.delete(resource, row); if (resource === 'usuario' && row.id === user?.id) disconnect(); else { refresh(); await refreshProfile(); } showToast('Operação confirmada pela API.'); }
    catch (failure) { setError(errorMessage(failure)); } finally { setBusy(false); }
  }
  return <section className="card-primary rounded-2xl p-4 sm:p-5 text-white space-y-4"><h2 className="text-xl font-bold">Catálogos e registros</h2><label className="block max-w-sm">Área<select className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-white placeholder-white/40 bg-white/8 border border-white/15 focus:border-[#22c55e] mt-2" value={resource} disabled={busy || !!editor} onChange={event => { setResource(event.target.value as Recurso); setPage(0); setError(''); }}>{(Object.keys(adminResources) as Recurso[]).map(key => <option key={key} value={key}>{adminResources[key].label}</option>)}</select></label>
    <p className="text-sm text-white/55">Histórico não credita pontos. Quantidades e ajustes de saldo definem valores absolutos; não são operações de resgate ou premiação.</p>
    {resource !== 'usuario' && <button className="rounded-xl px-4 py-2.5 bg-[#22c55e] text-white text-sm font-semibold hover:bg-[#16a34a] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={busy || !!editor} onClick={() => { setError(''); setEditor({ values: {} }); }}>Novo registro</button>}
    <ListState {...list} count={list.rows.length} />
    <div className="divide-y divide-white/10">{list.rows.map((row, index) => <article key={`${resource}-${row.id ?? row.usuarioId}-${row.cartaId ?? row.raridade ?? index}`} className="py-4 flex flex-wrap justify-between items-center gap-4"><div><h3 className="font-bold">{row.nome ?? row.titulo ?? row.descricao ?? `Usuário #${row.usuarioId}`}</h3><p className="text-xs text-white/55">{row.id ? `ID ${row.id} · ` : ''}{row.email ?? (row.cartaId ? `Carta ${row.cartaId} · Quantidade ${row.quantidade}` : row.raridade ? `${row.raridade} · Quantidade ${row.quantidade}` : '')} · Versão {row.versao}</p></div><div className="flex flex-wrap gap-2"><button className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={busy || !!editor} onClick={() => { void edit(row); }}>Consultar / editar</button>{resource === 'usuario' && <button className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={busy || !!editor} onClick={() => { void edit(row, true); }}>Ajustar saldo</button>}<button className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={busy || !!editor} onClick={() => { void remove(row); }}>{resource === 'usuario' ? 'Desativar' : 'Excluir'}</button></div></article>)}</div>
    <PageControls page={page} setPage={setPage} count={list.rows.length} loading={list.loading || busy || !!editor} />
    {editor && <form onSubmit={save} className="rounded-xl border border-green-400/25 p-4 space-y-4"><h3 className="font-bold">{editor.balance ? 'Ajuste administrativo de saldo' : editor.original ? 'Editar registro' : 'Novo registro'}</h3>{fields.map(field => { const immutable = !!editor.original && !editor.balance && (field.key === 'usuarioId' || field.key === 'cartaId' || (resource === 'usuario-fragmento' && field.key === 'raridade')); const props = { className: 'w-full rounded-xl px-3 py-2.5 text-sm outline-none text-white placeholder-white/40 bg-white/8 border border-white/15 focus:border-[#22c55e] mt-2', value: editor.values[field.key] ?? '', required: field.required, disabled: busy || immutable, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setEditor({ ...editor, values: { ...editor.values, [field.key]: event.target.value } }) }; return <label key={field.key} className="block">{field.label}{field.options ? <select {...props}><option value="">Selecione</option>{field.options.map(option => <option key={option}>{option}</option>)}</select> : field.type === 'textarea' ? <textarea {...props} maxLength={field.maxLength} /> : <input {...props} type={field.type ?? 'text'} min={field.min} max={field.max} maxLength={field.maxLength} step={field.type === 'datetime-local' ? 1 : field.type === 'number' ? 1 : undefined} />}</label>; })}<div className="flex gap-2"><button className="rounded-xl px-4 py-2.5 bg-[#22c55e] text-white text-sm font-semibold hover:bg-[#16a34a] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={busy}>Salvar</button><button type="button" className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={busy} onClick={() => setEditor(null)}>Cancelar</button></div></form>}
    {error && <p role="alert" className="text-red-300">{error}</p>}
  </section>;
}
