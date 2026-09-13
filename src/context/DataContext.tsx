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
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toDateString();
}

function getDesafioDoDia(): Missao {
  if (!MISSOES || MISSOES.length === 0) {
    return { id: 'default', titulo: 'Desafio Diário', descricao: 'Complete suas tarefas diárias', pontos: 10 } as unknown as Missao;
  }
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const inicioAno = new Date(hoje.getFullYear(), 0, 1);
  const diaDoAno = Math.floor((hoje.getTime() - inicioAno.getTime()) / 86400000);
  const index = Math.abs(diaDoAno) % MISSOES.length;
  return MISSOES[index] ?? MISSOES[0];
}

interface DataContextType {
  data: UserData;
  setNome: (nome: string) => void;
  setEmail: (email: string) => void;
  adicionarPontos: (pontos: number, nomeMissao: string) => void;
  adicionarBonus: (pontos: number, motivo: string, semToast?: boolean) => void;
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

  const aplicarPontos = useCallback((pontos: number, nome: string, contaMissao: boolean) => {
    setData(prev => {
      const hoje = hojeStr();
      const ehNovoDia = prev.dataHoje !== hoje;
      const streak = ehNovoDia
        ? (prev.ultimoDia === ontemStr() ? prev.streak + 1 : 1)
        : prev.streak;
      const ultimoDia = ehNovoDia ? hoje : (prev.ultimoDia || hoje);

      const dataAtualizada = ehNovoDia
        ? { ...prev, dataHoje: hoje, pontosHoje: 0, ultimoDia, streak }
        : prev;

      const entrada: HistoricoEntrada = {
        nome,
        pontos,
        data: new Date().toISOString(),
      };

      const prevHistorico = dataAtualizada.historico ?? [];
      const prevSelos = dataAtualizada.selosDesbloqueados ?? [];

      const novosPontos = dataAtualizada.pontos + pontos;
      const novosPontosHoje = dataAtualizada.pontosHoje + pontos;
      const novoHistorico = [entrada, ...prevHistorico].slice(0, 50);

      const novosSelos = (SELOS || [])
        .filter(s => novosPontos >= s.minPontos && !prevSelos.includes(s.id))
        .map(s => s.id);

      return {
        ...dataAtualizada,
        pontos: novosPontos,
        missoesCompletas: contaMissao ? dataAtualizada.missoesCompletas + 1 : dataAtualizada.missoesCompletas,
        pontosHoje: novosPontosHoje,
        historico: novoHistorico,
        selosDesbloqueados: [...prevSelos, ...novosSelos],
      };
    });
  }, [setData]);

  const adicionarPontos = useCallback((pontos: number, nomeMissao: string) => {
    aplicarPontos(pontos, nomeMissao, true);
  }, [aplicarPontos]);

  const adicionarBonus = useCallback((pontos: number, motivo: string, semToast = false) => {
    aplicarPontos(pontos, motivo, false);
    if (!semToast) showToast(`+${pontos} créditos - ${motivo}`);
  }, [aplicarPontos]);

  const subtrairPontos = useCallback((pontos: number) => {
    setData(prev => ({ ...prev, pontos: Math.max(0, prev.pontos - pontos) }));
  }, [setData]);

  const addResgate = useCallback((resgate: Resgate) => {
    setData(prev => {
      const resgatesAntigos = prev.resgates ?? [];
      return {
        ...prev,
        resgates: [resgate, ...resgatesAntigos].slice(0, 20),
      };
    });
  }, [setData]);

  const getNivel = useCallback(() => {
    const pts = data.pontos;
    if (!NIVEIS || NIVEIS.length === 0) return 'Iniciante';
    for (const nivel of NIVEIS) {
      if (pts >= nivel.min && pts <= nivel.max) return nivel.nome;
    }
    return NIVEIS[NIVEIS.length - 1]?.nome ?? 'Iniciante';
  }, [data.pontos]);

  const getSelosDesbloqueados = useCallback(() => {
    if (!SELOS) return [];
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
      const hoje = hojeStr();
      if (prev.ultimoDesafio === hoje) return prev;

      const ehNovoDia = prev.dataHoje !== hoje;
      const streak = ehNovoDia
        ? (prev.ultimoDia === ontemStr() ? prev.streak + 1 : 1)
        : prev.streak;
      const ultimoDia = ehNovoDia ? hoje : (prev.ultimoDia || hoje);
      const pontosHojeBase = ehNovoDia ? 0 : prev.pontosHoje;

      const prevHistorico = prev.historico ?? [];
      const prevSelos = prev.selosDesbloqueados ?? [];

      const entrada: HistoricoEntrada = {
        nome: `Bônus do Desafio do Dia (+${BONUS_DESAFIO})`,
        pontos: BONUS_DESAFIO,
        data: new Date().toISOString(),
      };

      const novosPontos = prev.pontos + BONUS_DESAFIO;
      const novosSelos = (SELOS || [])
        .filter(s => novosPontos >= s.minPontos && !prevSelos.includes(s.id))
        .map(s => s.id);

      return {
        ...prev,
        pontos: novosPontos,
        pontosHoje: pontosHojeBase + BONUS_DESAFIO,
        dataHoje: hoje,
        ultimoDia,
        streak,
        ultimoDesafio: hoje,
        historico: [entrada, ...prevHistorico].slice(0, 50),
        selosDesbloqueados: [...prevSelos, ...novosSelos],
      };
    });
    showToast(`+${BONUS_DESAFIO} créditos - Bônus do Desafio do Dia`);
  }, [setData]);

  return (
    <DataContext.Provider value={{
      data, setNome, setEmail, adicionarPontos, adicionarBonus, subtrairPontos,
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