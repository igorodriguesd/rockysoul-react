import { useCallback } from 'react';
import { useData } from '../context/DataContext';
import { showToast } from '../components/Toast';
import { abrirLogin } from '../utils/loginGate';

export function useLoginGate() {
  const { data } = useData();

  return useCallback(() => {
    if (data.nome?.trim()) return true;
    showToast('Entre com sua conta para registrar ações');
    abrirLogin();
    return false;
  }, [data.nome]);
}
