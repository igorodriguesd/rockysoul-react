import { useState, type FormEvent } from 'react';
import { useApi } from '../context/ApiContext';
import { ApiGate } from '../components/ApiUi';
import { errorMessage } from '../api/client';
import { showToast } from '../components/Toast';
export function Perfil() { return <main className="max-w-2xl mx-auto px-5 py-8"><ApiGate acesso="ao seu perfil"><ProfileForm /></ApiGate></main>; }
function ProfileForm() {
  const { user, service, disconnect, refreshProfile } = useApi();
  const [nome, setNome] = useState(user?.nome ?? ''); const [email, setEmail] = useState(user?.email ?? '');
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function save(event: FormEvent) {
    event.preventDefault(); if (!user) return; setBusy(true); setError('');
    try { await service.updateProfile(user, nome.trim(), email.trim()); disconnect(); showToast('Perfil atualizado. As sessões foram revogadas; entre novamente.'); }
    catch (failure) { setError(errorMessage(failure)); } finally { setBusy(false); }
  }
  return <form onSubmit={save} className="card-primary rounded-2xl p-4 sm:p-5 text-white space-y-5"><h1 className="text-2xl font-bold">Meu perfil</h1><p className="text-white/65">Saldo: {user?.pontos} · Resgatados: {user?.resgatados}</p><label className="block">Nome<input className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-white placeholder-white/40 bg-white/8 border border-white/15 focus:border-[#22c55e] mt-2" required maxLength={100} value={nome} onChange={event => setNome(event.target.value)} /></label><label className="block">Email<input className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-white placeholder-white/40 bg-white/8 border border-white/15 focus:border-[#22c55e] mt-2" type="email" required maxLength={150} value={email} onChange={event => setEmail(event.target.value)} /></label><p className="text-sm text-white/50">Salvar nome/email encerra as sessões da conta. Alteração de senha e login externo serão tratados separadamente.</p>{error && <p className="text-red-300" role="alert">{error}</p>}<div className="flex gap-3"><button className="rounded-xl px-4 py-2.5 bg-[#22c55e] text-white text-sm font-semibold hover:bg-[#16a34a] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={busy}>Salvar perfil</button><button type="button" className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={busy} onClick={() => { void refreshProfile().then(() => showToast('Perfil recarregado; reabra a tela para preencher os valores atuais.')).catch(failure => setError(errorMessage(failure))); }}>Reconsultar dados</button></div></form>;
}
