import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { validateName, validateEmail, normalizeName, normalizeEmail } from '../utils/validation';

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

export default function LoginModal({ aberto, onFechar }: Props) {
  const { setNome, setEmail } = useData();
  const [nome, setNomeInput] = useState('');
  const [email, setEmailInput] = useState('');
  const [erros, setErros] = useState<{ nome?: string; email?: string }>({});

  useEffect(() => {
    if (!aberto) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  function handleClose() {
    setNomeInput('');
    setEmailInput('');
    setErros({});
    onFechar();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nomeErro = validateName(nome);
    const emailErro = validateEmail(email, false);

    if (nomeErro || emailErro) {
      setErros({ nome: nomeErro ?? undefined, email: emailErro ?? undefined });
      return;
    }

    setNome(normalizeName(nome));
    if (email.trim()) setEmail(normalizeEmail(email));
    handleClose();
  }

  return (
    <div className="fixed inset-0 z-9998 flex items-start sm:items-center justify-center p-3 sm:p-6 pt-24 sm:pt-6 bg-black/50" onClick={onFechar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Entrar no RockySoulUp"
        className="bg-(--t-surface)/95 rounded-2xl shadow-2xl w-[90vw] max-w-95 p-6 relative border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600" aria-label="Fechar">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 mx-auto mb-3 bg-brand/10 rounded-full flex items-center justify-center">
            <img src="/icons/comunidade.svg" alt="" className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Bem-vindo</h2>
          <p className="text-sm text-slate-500 mt-1">Digite seus dados para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="login-nome" className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
            <input
              id="login-nome"
              type="text"
              autoFocus
              value={nome}
              onChange={e => setNomeInput(e.target.value)}
              placeholder="Seu nome (mínimo 3 caracteres)"
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors bg-(--t-surface) ${erros.nome ? 'border-red-400' : 'border-slate-300'
                }`}
            />
            {erros.nome && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 2 21h20L12 3Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>{erros.nome}</p>}
          </div>
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1">Email (opcional)</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmailInput(e.target.value)}
              placeholder="seu@email.com"
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors bg-(--t-surface) ${erros.email ? 'border-red-400' : 'border-slate-300'
                }`}
            />
            {erros.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 2 21h20L12 3Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>{erros.email}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-brand text-(--t-onaccent) font-semibold rounded-xl hover:bg-brand-hover transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}