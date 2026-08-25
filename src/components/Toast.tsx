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
    return () => { listeners = listeners.filter(fn => fn !== addToast); };
  }, [addToast]);

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
      {toasts.map(t => (
        <div
          key={t.id}
          className="bg-[#1a9e1a] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-[slideIn_0.3s_ease] max-w-xs"
        >
          ✅ {t.mensagem}
        </div>
      ))}
    </div>
  );
}
