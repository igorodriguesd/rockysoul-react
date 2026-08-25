import { useState } from 'react';
import { useData } from '../context/DataContext';

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

export default function LoginModal({ aberto, onFechar }: Props) {
  const { data, setNome, setEmail } = useData();
  const [nomeInput, setNomeInput] = useState(data.nome || '');
  const [emailInput, setEmailInput] = useState(data.email || '');

  if (!aberto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeInput.trim() || !emailInput.trim()) return;
    setNome(nomeInput.trim());
    setEmail(emailInput.trim());
    onFechar();
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50" onClick={onFechar}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[400px] p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onFechar} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <img src="/imagens/logo.png" alt="Logo" className="w-12 h-12 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-800">Comece Agora</h2>
          <p className="text-sm text-gray-500 mt-1">Crie sua conta e comecar a ganhar pontos</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="login-nome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#1a9e1a] focus-within:ring-1 focus-within:ring-[#1a9e1a]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="login-nome"
                type="text"
                placeholder="Seu nome"
                value={nomeInput}
                onChange={e => setNomeInput(e.target.value)}
                className="flex-1 outline-none text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#1a9e1a] focus-within:ring-1 focus-within:ring-[#1a9e1a]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                id="login-email"
                type="email"
                placeholder="seu@email.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="flex-1 outline-none text-sm"
                required
              />
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Ao continuar, voce concorda com os termos de uso do RockySoulUp.
          </p>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#1a9e1a] to-[#0f6e2e] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Comecar Agora
          </button>
        </form>
      </div>
    </div>
  );
}
