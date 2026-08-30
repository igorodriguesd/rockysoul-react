import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../context/DataContext';

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

interface LoginForm {
  nome: string;
  email: string;
}

export default function LoginModal({ aberto, onFechar }: Props) {
  const { setNome, setEmail } = useData();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  useEffect(() => {
    if (!aberto) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  function onSubmit(data: LoginForm) {
    setNome(data.nome.trim());
    if (data.email.trim()) setEmail(data.email.trim().toLowerCase());
    onFechar();
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onFechar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Entrar no RockySoulUp"
        className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-[90vw] max-w-[380px] p-6 relative border border-white/40"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onFechar} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" aria-label="Fechar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 mx-auto mb-3 bg-[#22c55e]/10 rounded-full flex items-center justify-center">
            <img src="/icons/comunidade.svg" alt="" className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Bem-vindo</h2>
          <p className="text-sm text-gray-500 mt-1">Digite seus dados para começar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="login-nome" className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <input
              id="login-nome"
              type="text"
              autoFocus
              {...register('nome', { required: 'Informe seu nome' })}
              placeholder="Seu nome"
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 ${
                errors.nome ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="login-email"
              type="email"
              {...register('email', {
                pattern: { value: /^\S+@\S+\.\S+$/i, message: 'Email inválido' },
              })}
              placeholder="seu@email.com"
              className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 ${
                errors.email ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
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