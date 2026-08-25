import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { UserData, HistoricoEntrada, Resgate } from '../types';
import { SELOS, NIVEIS } from '../data/constants';

const STORAGE_KEY = 'rocky_user_data';

const defaultData: UserData = {
  nome: '',
  email: '',
  pontos: 0,
  missoesCompletas: 0,
  pontosHoje: 0,
  dataHoje: new Date().toDateString(),
  historico: [],
  selosDesbloqueados: [],
  resgates: [],
};

interface DataContextType {
  data: UserData;
  setNome: (nome: string) => void;
  setEmail: (email: string) => void;
  adicionarPontos: (pontos: number, nomeMissao: string) => void;
  subtrairPontos: (pontos: number) => void;
  addResgate: (resgate: Resgate) => void;
  getNivel: () => string;
  getSelosDesbloqueados: () => string[];
  resetar: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useLocalStorage<UserData>(STORAGE_KEY, defaultData);

  const setNome = useCallback((nome: string) => {
    setData(prev => ({ ...prev, nome }));
  }, [setData]);

  const setEmail = useCallback((email: string) => {
    setData(prev => ({ ...prev, email }));
  }, [setData]);

  const adicionarPontos = useCallback((pontos: number, nomeMissao: string) => {
    setData(prev => {
      const hoje = new Date().toDateString();
      const dataAtualizada = prev.dataHoje === hoje ? prev : { ...prev, dataHoje: hoje, pontosHoje: 0 };

      const entrada: HistoricoEntrada = {
        nome: nomeMissao,
        pontos,
        data: new Date().toLocaleString('pt-BR'),
      };

      const novosPontos = dataAtualizada.pontos + pontos;
      const novasMissoes = dataAtualizada.missoesCompletas + 1;
      const novosPontosHoje = dataAtualizada.pontosHoje + pontos;
      const novoHistorico = [entrada, ...dataAtualizada.historico].slice(0, 50);

      const novosSelos = SELOS
        .filter(s => novosPontos >= s.minPontos && !dataAtualizada.selosDesbloqueados.includes(s.id))
        .map(s => s.id);

      return {
        ...dataAtualizada,
        pontos: novosPontos,
        missoesCompletas: novasMissoes,
        pontosHoje: novosPontosHoje,
        historico: novoHistorico,
        selosDesbloqueados: [...dataAtualizada.selosDesbloqueados, ...novosSelos],
      };
    });
  }, [setData]);

  const subtrairPontos = useCallback((pontos: number) => {
    setData(prev => ({ ...prev, pontos: Math.max(0, prev.pontos - pontos) }));
  }, [setData]);

  const addResgate = useCallback((resgate: Resgate) => {
    setData(prev => ({
      ...prev,
      resgates: [resgate, ...prev.resgates].slice(0, 20),
    }));
  }, [setData]);

  const getNivel = useCallback(() => {
    const pts = data.pontos;
    for (const nivel of NIVEIS) {
      if (pts >= nivel.min && pts <= nivel.max) return nivel.nome;
    }
    return NIVEIS[NIVEIS.length - 1].nome;
  }, [data.pontos]);

  const getSelosDesbloqueados = useCallback(() => {
    return SELOS
      .filter(s => data.pontos >= s.minPontos)
      .map(s => s.id);
  }, [data.pontos]);

  const resetar = useCallback(() => {
    setData(defaultData);
  }, [setData]);

  return (
    <DataContext.Provider value={{
      data, setNome, setEmail, adicionarPontos, subtrairPontos,
      addResgate, getNivel, getSelosDesbloqueados, resetar,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData deve ser usado dentro de um DataProvider');
  return context;
}
