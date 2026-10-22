import { useRef, useState, type FormEvent } from 'react';
import type { Missao } from '../types';
import type { Submissao, Verificacao } from '../api/types';
import { ApiError, errorMessage } from '../api/client';
import { imageBase64 } from '../api/evidence';
import { useApi } from '../context/ApiContext';

interface Props { aberto: boolean; onFechar: () => void; missao: Missao; onVerificado?: (missaoId: string) => void }
export default function VerificarModal({ aberto, onFechar, missao, onVerificado }: Props) {
  const { service, refresh, user } = useApi();
  const [description, setDescription] = useState(''); const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [result, setResult] = useState<Verificacao | null>(null);
  const [ambiguous, setAmbiguous] = useState(false);
  const [operation, setOperation] = useState<{ key: string; body: Submissao } | null>(null);
  const inFlight = useRef(false);
  if (!aberto) return null;
  async function submit(event: FormEvent) {
    event.preventDefault(); if (inFlight.current || !user) return; inFlight.current = true; setError(''); setBusy(true);
    try {
      let current = operation;
      if (!current) {
        if (!file) throw new Error('Selecione uma foto da ação.');
        const acaoId = Number(missao.id);
        if (!Number.isSafeInteger(acaoId) || acaoId <= 0) throw new Error('Selecione uma ação existente na API.');
        current = { key: crypto.randomUUID(), body: { acaoId, descricao: description.trim(), imagemBase64: await imageBase64(file) } };
        setOperation(current);
      }
      const response = await service.submit(current.body, current.key);
      setResult(response); setAmbiguous(false); refresh(); onVerificado?.(missao.id);
    } catch (failure) {
      const uncertain = failure instanceof ApiError && (failure.status === 0 || failure.status >= 500 || failure.status === 401);
      setAmbiguous(uncertain);
      setError(failure instanceof ApiError ? errorMessage(failure) : failure instanceof Error ? failure.message : 'Imagem inválida.');
      if (!uncertain) setOperation(null);
    } finally { inFlight.current = false; setBusy(false); }
  }
  return <div className="fixed inset-0 z-9998 flex items-start sm:items-center justify-center p-3 sm:p-6 pt-24 sm:pt-6 bg-black/60"><section role="dialog" aria-modal="true" aria-labelledby="verification-title" className="glass-strong rounded-2xl shadow-2xl w-[90vw] max-w-[620px] p-4 sm:p-5 relative max-h-[90vh] overflow-y-auto">
    <div className="flex justify-between gap-4"><h2 id="verification-title" className="text-xl font-bold">{missao.nome}</h2><button aria-label="Fechar" disabled={busy} onClick={onFechar}>✕</button></div>
    {result ? <div className="space-y-4 mt-5"><p className="text-green-300">Envio registrado. Estado: {result.estado.replaceAll('_', ' ')}</p><p className="text-white/65">O parecer da IA não concede pontos. A ação será revisada e o saldo será atualizado somente após aprovação.</p><p className="break-all text-xs text-white/50">Protocolo: {result.id}</p><button className="rounded-xl px-4 py-2.5 bg-[#22c55e] text-white text-sm font-semibold hover:bg-[#16a34a] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" onClick={onFechar}>Acompanhar no dashboard</button></div> : <form onSubmit={submit} className="space-y-4 mt-5">
      <p className="text-white/65 text-sm">Esta ação vale {missao.pontos} pontos após aprovação. Envie uma foto real e descreva o que fez.</p>
      <label className="block">Descrição<textarea className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-white placeholder-white/40 bg-white/8 border border-white/15 focus:border-[#22c55e] mt-2" required minLength={1} maxLength={1000} value={description} disabled={busy || ambiguous} onChange={event => setDescription(event.target.value)} /></label>
      <label className="block">Foto da ação<input className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-white placeholder-white/40 bg-white/8 border border-white/15 focus:border-[#22c55e] mt-2" type="file" accept="image/jpeg,image/png" disabled={busy || ambiguous} required={!operation} onChange={event => { setFile(event.target.files?.[0] ?? null); setOperation(null); }} /></label>
      <p className="text-xs text-white/50">JPEG/PNG, até 512 KiB e 32–2048 pixels por lado. A foto será enviada ao Gemini. Não envie rostos, documentos ou dados pessoais nesta demonstração.</p>
      {error && <p role="alert" className="text-red-300 text-sm">{error}</p>}
      {ambiguous && <p className="text-amber-200 text-sm">O envio pode ter sido processado. A repetição usa a mesma chave e imagem. Consulte também suas verificações antes de iniciar outra submissão.</p>}
      <button disabled={busy || !description.trim() || (!file && !operation)} className="rounded-xl px-4 py-2.5 bg-[#22c55e] text-white text-sm font-semibold hover:bg-[#16a34a] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed w-full">{busy ? 'Enviando para análise…' : ambiguous ? 'Consultar envio repetindo a mesma operação' : 'Enviar evidência'}</button>
    </form>}
  </section></div>;
}
