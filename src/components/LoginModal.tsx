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
  const [mode, setMode] = useState<Mode>(initialMode ?? 'login');
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
      setError('Informe email e senha válidos. A senha aceita até 72 caracteres e 72 bytes UTF-8.'); return;
    }
    inFlight.current = true; setBusy(true);
    try {
      if (mode === 'register') {
        const profile = await service.register({ nome, email, senha });
        if (!Number.isSafeInteger(profile.id) || profile.id <= 0 || typeof profile.email !== 'string') throw new ApiError('Resposta de cadastro inválida. Consulte a conta antes de tentar cadastrar novamente.');
        setEmail(profile.email); setNome(''); setMode('login');
        setSuccess('Conta criada com sucesso! Entre com seu email e senha para continuar.');
      } else if (mode === 'login') { await login(email, senha); onFechar(); }
      else { await connect(token); onFechar(); }
    } catch (failure) {
      setError(errorMessage(failure));
      if (failure instanceof ApiError && failure.status === 429) { const now = Date.now(); setClock(now); setBlockedUntil(now + (failure.retryAfter ?? 900) * 1000); }
    } finally { setSenha(''); setConfirmarSenha(''); setToken(''); inFlight.current = false; setBusy(false); }
  }
  return <div className="fixed inset-0 z-9998 flex items-start sm:items-center justify-center p-3 sm:p-6 pt-24 sm:pt-6 bg-black/50">
    <section className="account-modal bg-white/95 rounded-2xl shadow-2xl w-[90vw] max-w-95 p-6 relative border border-white/40 max-h-[90vh] overflow-auto text-gray-700" role="dialog" aria-modal="true" aria-labelledby="account-title" aria-busy={busy}>
      <div className="w-14 h-14 mx-auto mb-3 bg-[#22c55e]/10 rounded-full flex items-center justify-center"><img src="/icons/comunidade.svg" alt="" className="w-7 h-7" /></div><div className="text-center"><h2 id="account-title" className="text-xl font-bold text-gray-800">{mode === 'register' ? 'Crie sua conta' : mode === 'token' ? 'Conectar por token' : 'Bem-vindo de volta'}</h2><button disabled={busy} onClick={onFechar} aria-label="Fechar" className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">✕</button></div>
      <p className="text-sm text-gray-500 mt-3">{mode === 'register' ? 'Comece sua jornada sustentável. Seus pontos serão registrados com segurança na sua conta.' : mode === 'token' ? 'Opção avançada para testar uma sessão já emitida pela API.' : 'Entre para acompanhar suas ações, pontos e coleção.'}</p>
      <div className="flex gap-2 mt-5" aria-label="Acesso à conta"><button type="button" className={mode === 'login' ? 'rounded-xl px-4 py-2 bg-[#22c55e] text-white font-semibold' : 'rounded-xl px-4 py-2 bg-gray-100 text-gray-600 font-semibold'} disabled={busy} aria-pressed={mode === 'login'} onClick={() => changeMode('login')}>Entrar</button><button type="button" className={mode === 'register' ? 'rounded-xl px-4 py-2 bg-[#22c55e] text-white font-semibold' : 'rounded-xl px-4 py-2 bg-gray-100 text-gray-600 font-semibold'} disabled={busy} aria-pressed={mode === 'register'} onClick={() => changeMode('register')}>Criar conta</button></div>
      {success && <p role="status" className="rounded-xl bg-green-400/10 border border-green-400/25 p-3 text-green-700 mt-4">{success}</p>}
      <form onSubmit={submit} className="space-y-4 mt-5" noValidate={mode === 'register'}>
        {mode === 'register' && <label className="block text-sm" htmlFor="account-name">Nome<input id="account-name" aria-label="Nome" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 mt-1" required autoComplete="name" maxLength={100} value={nome} disabled={busy} onChange={event => setNome(event.target.value)} aria-invalid={!!errors.nome} aria-describedby={errors.nome ? 'name-error' : undefined} />{errors.nome && <span id="name-error" className="block text-red-500 text-xs mt-1">{errors.nome}</span>}</label>}
        {mode !== 'token' && <><label className="block text-sm" htmlFor="account-email">Email<input id="account-email" aria-label="Email" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 mt-1" type="email" required autoComplete="username" maxLength={150} value={email} disabled={busy} onChange={event => setEmail(event.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email && <span id="email-error" className="block text-red-500 text-xs mt-1">{errors.email}</span>}</label>
          <label className="block text-sm" htmlFor="account-password">Senha<input id="account-password" aria-label="Senha" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 mt-1" type="password" required autoComplete={mode === 'register' ? 'new-password' : 'current-password'} maxLength={72} value={senha} disabled={busy} onChange={event => setSenha(event.target.value)} aria-invalid={!!errors.senha} aria-describedby={errors.senha ? 'password-error' : mode === 'register' ? 'password-hint' : undefined} />{errors.senha && <span id="password-error" className="block text-red-500 text-xs mt-1">{errors.senha}</span>}</label>
        </>}
        {mode === 'register' && <><p id="password-hint" className="text-xs text-gray-500">Use de 12 a 72 caracteres, até 72 bytes UTF-8. Acentos e emojis ocupam mais bytes.</p><label className="block text-sm" htmlFor="account-confirm">Confirmar senha<input id="account-confirm" aria-label="Confirmar senha" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 mt-1" type="password" required autoComplete="new-password" maxLength={72} value={confirmarSenha} disabled={busy} onChange={event => setConfirmarSenha(event.target.value)} aria-invalid={!!errors.confirmarSenha} aria-describedby={errors.confirmarSenha ? 'confirm-error' : undefined} />{errors.confirmarSenha && <span id="confirm-error" className="block text-red-500 text-xs mt-1">{errors.confirmarSenha}</span>}</label></>}
        {mode === 'token' && <label className="block text-sm">Token de acesso<input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 mt-1" type="password" required autoComplete="off" value={token} maxLength={8000} disabled={busy} onChange={event => setToken(event.target.value)} /></label>}
        {error && <p role="alert" className="text-red-500 text-sm">{error}</p>}
        {wait > 0 && <p role="status" className="text-amber-700 text-sm">Aguarde {wait}s antes de tentar novamente.</p>}
        <button className="w-full py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors disabled:opacity-40" disabled={busy || wait > 0}>{busy ? 'Aguarde…' : mode === 'register' ? 'Cadastrar' : mode === 'token' ? 'Conectar' : 'Entrar na conta'}</button>
      </form>
      {mode !== 'token' && <button type="button" className="mt-5 text-xs text-gray-500 underline" disabled={busy} onClick={() => changeMode('token')}>Acesso avançado por token</button>}
    </section>
  </div>;
}
