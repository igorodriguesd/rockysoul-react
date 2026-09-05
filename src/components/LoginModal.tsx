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
    <div className="fixed inset-0 z-9998 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onFechar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Entrar no RockySoulUp"
        className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-[90vw] max-w-95 p-6 relative border border-white/40"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" aria-label="Fechar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 mx-auto mb-3 bg-[#22c55e]/10 rounded-full flex items-center justify-center">
            <img src="/icons/comunidade.svg" alt="" className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Bem-vindo</h2>
          <p className="text-sm text-gray-500 mt-1">Digite seus dados para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="login-nome" className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input
              id="login-nome"
              type="text"
              autoFocus
              value={nome}
              onChange={e => setNomeInput(e.target.value)}
              placeholder="Seu nome (mínimo 3 caracteres)"
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 ${erros.nome ? 'border-red-400' : 'border-gray-200'
                }`}
            />
            {erros.nome && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 2 21h20L12 3Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>{erros.nome}</p>}
          </div>
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email (opcional)</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={e => setEmailInput(e.target.value)}
              placeholder="seu@email.com"
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 ${erros.email ? 'border-red-400' : 'border-gray-200'
                }`}
            />
            {erros.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 2 21h20L12 3Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>{erros.email}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}