import { useEffect, useState } from 'react';
import { PERGUNTAS_FAQ } from '../data/constants';

export default function Faq() {
  useEffect(() => { document.title = 'FAQ - RockySoulUp'; }, []);
  const [aberto, setAberto] = useState<number | null>(null);

  return (
    <div className="max-w-[700px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center text-white mb-2 drop-shadow">Perguntas Frequentes</h1>
      <p className="text-center text-white/70 mb-10">Tire suas dúvidas sobre o RockySoulUp</p>

      <div className="flex flex-col gap-3">
        {PERGUNTAS_FAQ.map((item, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-white/40">
            <button
              onClick={() => setAberto(aberto === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
              <span className="font-semibold text-gray-800 text-sm pr-4">{item.pergunta}</span>
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"
                className={`shrink-0 transition-transform duration-300 ${aberto === i ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${aberto === i ? 'max-h-60' : 'max-h-0'}`}>
              <p className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">
                {item.resposta}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
