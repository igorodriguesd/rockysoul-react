import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { UserData, HistoricoEntrada, Resgate, Missao } from '../types';
import { SELOS, NIVEIS, MISSOES } from '../data/constants';
import { showToast } from '../components/Toast';

const STORAGE_KEY = 'rocky_user_data';

const BONUS_DESAFIO = 30;

const defaultData: UserData = {
  nome: '',
  email: '',
  pontos: 0,
  missoesCompletas: 0,
  pontosHoje: 0,
  dataHoje: '',
  ultimoDia: '',
  streak: 0,
  ultimoDesafio: '',
  historico: [],
  selosDesbloqueados: [],
  resgates: [],
};

function hojeStr(): string {
  return new Date().toDateString();
}

function ontemStr(): string {
  return new Date(Date.now() - 86400000).toDateString();
}

function getDesafioDoDia(): Missao {
  const hoje = new Date();
  const inicioAno = new Date(hoje.getFullYear(), 0, 0);
  const diaDoAno = Math.floor((hoje.getTime() - inicioAno.getTime()) / 86400000);
  return MISSOES[diaDoAno % MISSOES.length];
}

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
  desafioDoDia: Missao;
  desafioBonusDisponivel: boolean;
  resgatarBonusDesafio: () => void;
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
      const hoje = hojeStr();
      const ehNovoDia = prev.dataHoje !== hoje;
      const streak = ehNovoDia
        ? (prev.ultimoDia === ontemStr() ? prev.streak + 1 : 1)
        : prev.streak;
      const ultimoDia = ehNovoDia ? hoje : prev.ultimoDia;

      const dataAtualizada = ehNovoDia
        ? { ...prev, dataHoje: hoje, pontosHoje: 0, ultimoDia, streak }
        : prev;

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

  const desafioDoDia = getDesafioDoDia();
  const desafioBonusDisponivel = data.ultimoDesafio !== hojeStr();

  const resgatarBonusDesafio = useCallback(() => {
    setData(prev => {
      if (prev.ultimoDesafio === hojeStr()) return prev;

      const entrada: HistoricoEntrada = {
        nome: `Bônus do Desafio do Dia (+${BONUS_DESAFIO})`,
        pontos: BONUS_DESAFIO,
        data: new Date().toLocaleString('pt-BR'),
      };

      const novosPontos = prev.pontos + BONUS_DESAFIO;
      const novosSelos = SELOS
        .filter(s => novosPontos >= s.minPontos && !prev.selosDesbloqueados.includes(s.id))
        .map(s => s.id);

      return {
        ...prev,
        pontos: novosPontos,
        pontosHoje: prev.pontosHoje + BONUS_DESAFIO,
        ultimoDesafio: hojeStr(),
        historico: [entrada, ...prev.historico].slice(0, 50),
        selosDesbloqueados: [...prev.selosDesbloqueados, ...novosSelos],
      };
    });
    showToast(`+${BONUS_DESAFIO} pontos - Bônus do Desafio do Dia`);
  }, [setData]);

  return (
    <DataContext.Provider value={{
      data, setNome, setEmail, adicionarPontos, subtrairPontos,
      addResgate, getNivel, getSelosDesbloqueados, resetar,
      desafioDoDia, desafioBonusDisponivel, resgatarBonusDesafio,
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