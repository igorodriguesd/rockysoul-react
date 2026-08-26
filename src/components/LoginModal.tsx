import { useState } from 'react';
import { useData } from '../context/DataContext';

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

export default function LoginModal({ aberto, onFechar }: Props) {
  const { setNome } = useData();
  const [nomeInput, setNomeInput] = useState('');

  if (!aberto) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nomeInput.trim()) return;
    setNome(nomeInput.trim());
    onFechar();
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onFechar}>
      <div
        className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-[90vw] max-w-[380px] p-6 relative border border-white/40"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onFechar} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 mx-auto mb-3 bg-[#22c55e]/10 rounded-full flex items-center justify-center">
            <img src="/icons/comunidade.svg" alt="" className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Bem-vindo</h2>
          <p className="text-sm text-gray-500 mt-1">Digite seu nome para comecar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={nomeInput}
            onChange={e => setNomeInput(e.target.value)}
            placeholder="Seu nome"
            autoFocus
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60"
          />
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
