import { useState, useEffect, useCallback } from 'react';

interface ToastItem {
  id: number;
  mensagem: string;
}

let toastId = 0;
let listeners: ((msg: string) => void)[] = [];

export function showToast(mensagem: string) {
  listeners.forEach(fn => fn(mensagem));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((mensagem: string) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, mensagem }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  }, []);

  useEffect(() => {
    listeners.push(addToast);
    return () => {
      listeners = listeners.filter(fn => fn !== addToast);
    };
  }, [addToast]);

  return (
    <div 
      className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-xs w-full px-4 sm:px-0"
      role="status"
      aria-live="polite"
    >
      {toasts.map(t => (
        <div
          key={t.id}
          className="pointer-events-auto bg-white/90 backdrop-blur-md text-gray-800 px-5 py-3 rounded-xl shadow-lg text-sm font-medium border border-[#22c55e]/30 flex items-center gap-2 transition-all duration-300 ease-in-out"
        >
          <img src="/icons/check.svg" alt="" className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t.mensagem}</span>
        </div>
      ))}
    </div>
  );
}