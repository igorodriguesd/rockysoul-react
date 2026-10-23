import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      // Valor inicial = estado "zerado" (ex.: após Sair): remove a chave em vez de gravar o padrão.
      if (storedValue === initialValue) {
        window.localStorage.removeItem(key);
        return;
      }
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage [${key}]:`, error);
    }
  }, [key, storedValue, initialValue]);

  return [storedValue, setStoredValue];
}
