import { useEffect } from 'react';
import MiniJogoSeparacao from '../components/MiniJogoSeparacao';

export function JogoSeparacao() {
  useEffect(() => {
    document.title = 'Separe o Lixo - RockySoulUp';
  }, []);

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-4 lg:py-6 flex flex-col gap-4">
      <div className="bg-card-primary border border-card-primary-border shadow-card-primary rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(var(--color-brand), transparent)' }} />
        <div className="flex items-center gap-2 mb-2">
          <img src="/icons/reciclagem.svg" alt="" className="w-5 h-5" />
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Minijogo educativo</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif-display">Separe o Lixo</h1>
        <p className="text-sm text-slate-600 mt-1 max-w-[560px]">
          Arraste cada item para a lixeira correta e aprenda na prática onde descartar recicláveis,
          orgânicos, vidro e metal. São 3 fases com dificuldade crescente, 3 vidas e combo de acertos.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
          <div className="rounded-xl p-3" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest">Fases</p>
            <p className="text-brand font-bold" style={{ fontSize: 20 }}>3</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest">Vidas</p>
            <p className="text-brand font-bold" style={{ fontSize: 20 }}>3</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'var(--t-impact-bg)', border: '1px solid rgba(56,189,248,0.35)' }}>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest">Modo</p>
            <p className="text-impact font-bold" style={{ fontSize: 20 }}>Treino</p>
          </div>
        </div>
      </div>

      <MiniJogoSeparacao />
    </div>
  );
}
