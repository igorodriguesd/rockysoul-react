import { useEffect, useRef, useState } from 'react';
import { useApi } from '../context/ApiContext';
import { useApiPage } from '../hooks/useApiPage';
import type { Verificacao } from '../api/types';
import { errorMessage } from '../api/client';
import { ListState, PageControls } from './ApiUi';
import { showToast } from './Toast';

export function Verificacoes({ admin = false }: { admin?: boolean }) {
  const { service, refresh, refreshProfile, user } = useApi(); const [page, setPage] = useState(0);
  const list = useApiPage<Verificacao>('verificacoes', page);
  const [selected, setSelected] = useState<Verificacao | null>(null); const [image, setImage] = useState<string | null>(null);
  const [reason, setReason] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const [emails, setEmails] = useState<Record<number, string>>({});
  const fetchedRef = useRef<Set<number>>(new Set());
  // Busca email do usuario quando nao vem na verificacao
  useEffect(() => {
    if (!admin || !list.rows.length) return;
    const ids = [...new Set(list.rows.map(r => r.usuarioId).filter(id => !fetchedRef.current.has(id)))];
    if (ids.length === 0) return;
    ids.forEach(id => fetchedRef.current.add(id));
    let active = true;
    Promise.all(ids.map(id => service.profile(id).then(p => ({ id, email: p.email })).catch(() => ({ id, email: '' }))))
      .then(results => { if (active) setEmails(prev => { const next = { ...prev }; results.forEach(r => { if (r.email) next[r.id] = r.email; }); return next; }); });
    return () => { active = false; };
  }, [list.rows, admin, service]);
  useEffect(() => {
    setImage(null); if (!selected?.evidenciaDisponivel) return;
    const controller = new AbortController(); let url: string | null = null; let active = true;
    service.evidence(selected.id, controller.signal).then(blob => { if (active) { url = URL.createObjectURL(blob); setImage(url); } }).catch(failure => { if (active && !controller.signal.aborted) setError(errorMessage(failure)); });
    return () => { active = false; controller.abort(); if (url) URL.revokeObjectURL(url); };
  }, [selected?.id, selected?.evidenciaDisponivel, service, user?.id]);
  async function act(kind: 'approve' | 'reject' | 'reprocess' | 'delete') {
    if (!selected || busy) return;
    if (kind === 'reprocess' && !window.confirm('Reprocessar pode gerar nova cobrança, inclusive se uma tentativa anterior ficou incerta. Continuar?')) return;
    if (kind === 'delete' && !window.confirm('Excluir a evidência e descrição? Isso pode impedir uma aprovação futura.')) return;
    setBusy(true); setError('');
    try {
      const fresh = await service.verification(selected.id);
      if (fresh.versao !== selected.versao) { setSelected(fresh); throw new Error('Esta ação foi atualizada. Confira as informações antes de decidir.'); }
      if (kind === 'delete') { await service.deleteEvidence(fresh.id); setSelected(null); }
      else if (kind === 'reprocess') setSelected(await service.reprocess(fresh));
      else setSelected(await service.review(fresh, kind === 'approve', reason.trim()));
      refresh(); await refreshProfile(); showToast('Pronto! A alteração foi concluída.');
    } catch (failure) { setError(failure instanceof Error && !(('status') in failure) ? failure.message : errorMessage(failure)); }
    finally { setBusy(false); }
  }
  return <section className="card-primary rounded-2xl p-4 sm:p-5 text-white space-y-4"><div className="flex justify-between items-center"><h2 className="text-xl font-bold">{admin ? 'Revisão de verificações' : 'Verificações'}</h2><button className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" onClick={() => { refresh(); void refreshProfile().catch(failure => showToast(errorMessage(failure))); }}>Atualizar</button></div>
    <ListState {...list} count={list.rows.length} />
    {list.rows.map(row => <button key={row.id} className="w-full text-left rounded-xl bg-white/5 p-4 hover:bg-white/10" onClick={() => { setSelected(row); setReason(''); setError(''); }}><span className="text-green-300">{row.estado === 'PENDENTE_REVISAO' ? 'Aguardando revisão' : row.estado === 'APROVADA' ? 'Aprovada' : row.estado === 'REJEITADA' ? 'Não aprovada' : 'Em análise'}</span><p className="text-sm mt-1">Ação #{row.acaoId}{admin || row.estado === 'APROVADA' ? ` · ${row.pontosCreditados} pontos creditados` : ''}</p><p className="text-xs text-white/45 break-all">{row.id}{admin ? ` · Usuário #${row.usuarioId}${(row.usuarioEmail || emails[row.usuarioId]) ? ` (${row.usuarioEmail || emails[row.usuarioId]})` : ''}` : ''}</p></button>)}
    <PageControls page={page} setPage={setPage} count={list.rows.length} loading={list.loading} />
    {selected && user && <div className="fixed inset-0 z-[9980] bg-black/75 p-4 flex items-center justify-center"><section role="dialog" aria-modal="true" aria-labelledby="review-title" className="card-primary rounded-2xl p-4 sm:p-5 text-white max-w-xl w-full max-h-[90vh] overflow-auto space-y-4"><div className="flex justify-between"><h3 id="review-title" className="font-bold">{selected.estado === 'PENDENTE_REVISAO' ? 'Aguardando revisão' : selected.estado === 'APROVADA' ? 'Aprovada' : selected.estado === 'REJEITADA' ? 'Não aprovada' : 'Em análise'}</h3><button disabled={busy} aria-label="Fechar detalhe" onClick={() => setSelected(null)}>✕</button></div><p className="text-sm text-white/70">Parecer: {selected.estado === 'APROVADA' ? 'Ação aprovada' : selected.estado === 'REJEITADA' ? 'Ação não aprovada' : 'Aguardando avaliação'} · Tentativas: {selected.tentativas}</p><p className="text-xs text-white/45">{admin && selected.notaCompatibilidade != null ? `Compatibilidade com a ação: ${selected.notaCompatibilidade}/100. Essa nota não comprova a autenticidade da foto.` : 'Acompanhe o resultado da análise por aqui.'}</p>{admin && selected.feedback && <p className="text-sm text-white/70">Avaliação da imagem: {selected.feedback}</p>}{admin && selected.parecer && <p className="text-sm text-white/65">Motivo da decisão: {({ FAIXA_REVISAO: 'Nota entre 50 e 80: precisa de revisão.', DESAFIO_NAO_CONFIRMADO: 'Código do desafio não confirmado.', CAPTURA_REPETIDA: 'Possível reutilização da foto.', SINAL_MANIPULACAO: 'Há indícios visuais de manipulação.', EVIDENCIA_INSUFICIENTE: 'A foto não permite avaliar a ação.', INCONCLUSIVO: 'A análise não chegou a uma conclusão.', DADOS_DIVERGENTES: 'A nota e o parecer divergem.', NOTA_INDISPONIVEL: 'Não foi possível obter uma nota.', LIMITE_AUTO: 'Um limite de aprovação automática foi atingido.', TIMEOUT_OR_NETWORK: 'A análise demorou demais ou houve falha de conexão.', HTTP_FAILURE: 'Não foi possível concluir a análise.' } as Record<string, string>)[selected.parecer] ?? 'Confira a imagem e a avaliação antes de decidir.'}</p>}{admin && selected.possivelReuso && <p className="text-amber-200">Possível reutilização da imagem. Este sinal não comprova fraude.</p>}
      {image ? <img src={image} alt="Foto enviada para verificação" className="max-h-80 w-full object-contain rounded-xl" /> : <p className="text-white/50">{selected.evidenciaDisponivel ? 'Carregando foto…' : 'A foto não está mais disponível.'}</p>}
      {admin && selected.estado === 'PENDENTE_REVISAO' && <><p className="text-sm text-white/65">Confira a evidência e obtenha confirmação independente antes de decidir. A IA não comprova autoria nem a ocorrência real da ação.</p><label className="block">Justificativa<textarea className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-white placeholder-white/40 bg-white/8 border border-white/15 focus:border-[#22c55e] mt-2" maxLength={500} value={reason} onChange={event => setReason(event.target.value)} disabled={busy} /></label><div className="flex flex-wrap gap-2"><button className="rounded-xl px-4 py-2.5 bg-[#22c55e] text-white text-sm font-semibold hover:bg-[#16a34a] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={busy || !reason.trim()} onClick={() => { void act('approve'); }}>Aprovar</button><button className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={busy || !reason.trim()} onClick={() => { void act('reject'); }}>Rejeitar</button><button className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={busy || selected.tentativas >= 2 || !selected.evidenciaDisponivel} onClick={() => { void act('reprocess'); }}>Reprocessar com nova cobrança</button></div></>}
      {selected.evidenciaDisponivel && <button className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={busy || selected.estado === 'EM_ANALISE'} onClick={() => { void act('delete'); }}>Excluir evidência</button>}
      {error && <p role="alert" className="text-red-300">{error}</p>}
    </section></div>}
  </section>;
}
