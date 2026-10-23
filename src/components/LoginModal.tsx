import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useApi } from '../context/ApiContext';
import { ApiError, errorMessage } from '../api/client';
import { validateRegistration, type RegistrationErrors } from '../api/authValidation';

type Mode = 'login' | 'register' | 'token';
interface Props { aberto: boolean; onFechar: () => void; initialMode?: Mode }
export default function LoginModal({ aberto, onFechar, initialMode = 'login' }: Props) {
  return aberto ? <AccountForm onFechar={onFechar} initialMode={initialMode} /> : null;
}
function AccountForm({ onFechar, initialMode }: Omit<Props, 'aberto'>) {
  const { service, login, connect } = useApi();
  const [mode, setMode] = useState<Mode>(initialMode === 'register' ? 'register' : 'login');
  const [nome, setNome] = useState(''); const [email, setEmail] = useState('');
  const [senha, setSenha] = useState(''); const [confirmarSenha, setConfirmarSenha] = useState(''); const [token, setToken] = useState('');
  const [errors, setErrors] = useState<RegistrationErrors>({}); const [error, setError] = useState(''); const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false); const [blockedUntil, setBlockedUntil] = useState(0); const inFlight = useRef(false);
  const [clock, setClock] = useState(Date.now);
  const wait = Math.max(0, Math.ceil((blockedUntil - clock) / 1000));
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && !inFlight.current) onFechar(); };
    window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape);
  }, [onFechar]);
  useEffect(() => {
    if (!blockedUntil) return;
    const interval = setInterval(() => { const now = Date.now(); setClock(now); if (now >= blockedUntil) clearInterval(interval); }, 1000); return () => clearInterval(interval);
  }, [blockedUntil]);
  function changeMode(next: Mode) { if (inFlight.current) return; setMode(next); setSenha(''); setConfirmarSenha(''); setToken(''); setErrors({}); setError(''); setSuccess(''); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (inFlight.current || wait) return;
    setError(''); setSuccess(''); setErrors({});
    if (mode === 'register') {
      const validation = validateRegistration({ nome, email, senha, confirmarSenha });
      if (Object.keys(validation).length) { setErrors(validation); return; }
    } else if (mode === 'login' && (!email.trim() || !senha || senha.length > 72 || new TextEncoder().encode(senha).byteLength > 72)) {
      setError('Confira seu email e sua senha. Se a senha for muito longa, use menos caracteres.'); return;
    }
    inFlight.current = true; setBusy(true);
    try {
      if (mode === 'register') {
        const profile = await service.register({ nome, email, senha });
        if (!Number.isSafeInteger(profile.id) || profile.id <= 0 || typeof profile.email !== 'string') throw new ApiError('Não conseguimos confirmar o cadastro. Tente entrar com seu email antes de criar a conta novamente.');
        setEmail(profile.email); setNome(''); setMode('login');
        setSuccess('Conta criada com sucesso! Entre com seu email e senha para continuar.');
      } else if (mode === 'login') { await login(email, senha); onFechar(); }
      else { await connect(token); onFechar(); }
    } catch (failure) {
      setError(errorMessage(failure));
      if (failure instanceof ApiError && failure.status === 429) { const now = Date.now(); setClock(now); setBlockedUntil(now + (failure.retryAfter ?? 900) * 1000); }
    } finally { setSenha(''); setConfirmarSenha(''); setToken(''); inFlight.current = false; setBusy(false); }
  }
  return (
    <div className="fixed inset-0 z-9998 flex items-start sm:items-center justify-center p-3 sm:p-6 pt-24 sm:pt-6 bg-black/50" onClick={() => { if (!inFlight.current) onFechar(); }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Entrar no RockySoulUp"
        className="bg-(--t-surface)/95 rounded-2xl shadow-2xl w-[90vw] max-w-95 p-6 relative border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={() => { if (!inFlight.current) onFechar(); }} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600" aria-label="Fechar">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 mx-auto mb-3 bg-brand/10 rounded-full flex items-center justify-center">
            <img src="/icons/comunidade.svg" alt="" className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{mode === 'register' ? 'Crie sua conta' : 'Bem-vindo'}</h2>
          <p className="text-sm text-slate-500 mt-1">{mode === 'register' ? 'Use uma senha de 12 a 72 caracteres' : 'Entre com seu email e senha'}</p>
        </div>

        {success && <p role="status" className="text-sm text-slate-500 mt-1">{success}</p>}
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate aria-busy={busy}>
          {mode === 'register' && <div><label htmlFor="account-name" className="block text-sm font-medium text-slate-700 mb-1">Nome *</label><input id="account-name" aria-label="Nome" autoComplete="name" maxLength={100} value={nome} onChange={e => setNome(e.target.value)} disabled={busy} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors bg-(--t-surface) border-slate-300" />{errors.nome && <p role="alert" className="text-red-500 text-xs mt-1 flex items-center gap-1">{errors.nome}</p>}</div>}
          <div><label htmlFor="account-email" className="block text-sm font-medium text-slate-700 mb-1">Email *</label><input id="account-email" aria-label="Email" type="email" autoComplete="username" maxLength={150} value={email} onChange={e => setEmail(e.target.value)} disabled={busy} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors bg-(--t-surface) border-slate-300" />{errors.email && <p role="alert" className="text-red-500 text-xs mt-1 flex items-center gap-1">{errors.email}</p>}</div>
          <div><label htmlFor="account-password" className="block text-sm font-medium text-slate-700 mb-1">Senha *</label><input id="account-password" aria-label="Senha" type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} maxLength={72} value={senha} onChange={e => setSenha(e.target.value)} disabled={busy} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors bg-(--t-surface) border-slate-300" />{errors.senha && <p role="alert" className="text-red-500 text-xs mt-1 flex items-center gap-1">{errors.senha}</p>}</div>
          {mode === 'register' && <div><label htmlFor="account-confirm" className="block text-sm font-medium text-slate-700 mb-1">Confirmar senha *</label><input id="account-confirm" aria-label="Confirmar senha" type="password" autoComplete="new-password" maxLength={72} value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} disabled={busy} className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors bg-(--t-surface) border-slate-300" />{errors.confirmarSenha && <p role="alert" className="text-red-500 text-xs mt-1 flex items-center gap-1">{errors.confirmarSenha}</p>}</div>}
          {error && <p role="alert" className="text-red-500 text-xs mt-1 flex items-center gap-1">{error}</p>}
          {wait > 0 && <p role="status" className="text-sm text-slate-500 mt-1">Aguarde {wait}s para tentar novamente.</p>}
          <button type="submit" disabled={busy || wait > 0} className="w-full py-3 bg-brand text-(--t-onaccent) font-semibold rounded-xl hover:bg-brand-hover transition-colors">{busy ? 'Aguarde…' : mode === 'register' ? 'Cadastrar' : 'Entrar'}</button>
          <button type="button" disabled={busy} className="text-sm text-slate-500 mt-1" onClick={() => changeMode(mode === 'register' ? 'login' : 'register')}>{mode === 'register' ? 'Já tenho conta — Entrar' : 'Criar conta'}</button>
        </form>
      </div>
    </div>
  );
}
