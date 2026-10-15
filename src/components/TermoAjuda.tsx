import { useState } from 'react';

interface TermoAjudaProps {
  termo: string;
  dica: string;
}

export function TermoAjuda({ termo, dica }: TermoAjudaProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <span
      className="relative inline-flex align-middle"
      onMouseEnter={() => setAberto(true)}
      onMouseLeave={() => setAberto(false)}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setAberto(v => !v); }}
        className="ml-1.5 w-4 h-4 rounded-full bg-brand/15 text-brand text-[10px] font-black flex items-center justify-center leading-none cursor-help"
        aria-label={`Explicar: ${termo}`}
        aria-expanded={aberto}
        title={dica}
      >
        ?
      </button>
      {aberto && (
        <span
          role="tooltip"
          className="absolute left-0 top-full mt-2 z-50 w-60 rounded-xl px-3.5 py-2.5 text-xs leading-relaxed text-slate-600 shadow-xl border border-(--t-header-border)"
          style={{ background: 'var(--t-surface)' }}
        >
          <strong className="block text-slate-900 mb-0.5">{termo}</strong>
          {dica}
        </span>
      )}
    </span>
  );
}