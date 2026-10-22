import { createContext, useContext, type ReactNode } from 'react';
import type { Missao, UserData } from '../types';
import type { Acao, HistoricoApi, SeloApi } from '../api/types';
import { useApi } from './ApiContext';
import { useApiPage } from '../hooks/useApiPage';
import { showToast } from '../components/Toast';
import { NIVEIS } from '../data/constants';

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, logout } = useApi();
  const { rows: historico } = useApiPage<HistoricoApi>('historico');
  const { rows: selos } = useApiPage<SeloApi>('selo');
  const { rows: acoes } = useApiPage<Acao>('acao');
  const ownHistory = historico.filter(row => row.usuarioId === user?.id);
  const today = new Date().toLocaleDateString('en-CA');
  const data: UserData = {
    nome: user?.nome ?? '', email: user?.email ?? '', pontos: user?.pontos ?? 0,
    missoesCompletas: ownHistory.length,
    pontosHoje: ownHistory.filter(row => row.dataAcao.slice(0, 10) === today).reduce((sum, row) => sum + row.pontos, 0),
    dataHoje: today, ultimoDia: '', streak: 0, ultimoDesafio: '',
    historico: ownHistory.map(row => ({ nome: row.descricao, pontos: row.pontos, data: row.dataAcao })),
    selosDesbloqueados: [], resgates: [],
  };
  const first = acoes[0];
  const desafioDoDia: Missao = { id: first ? String(first.id) : '', nome: first?.nome ?? 'Conecte-se para consultar ações', pontos: first?.pontos ?? 0, icone: '/icons/folha.svg', comprovacao: 'foto' };
  const unsupported = () => showToast('Esta operação ainda não está disponível na API. Nenhum saldo foi alterado.');
  const value = { data, desafioDoDia, desafioBonusDisponivel: false,
    getNivel: () => NIVEIS.find(level => data.pontos >= level.min && data.pontos <= level.max)?.nome ?? 'Semente',
    getSelosDesbloqueados: () => selos.filter(selo => data.pontos >= selo.pontosMin).map(selo => String(selo.id)),
    resetar: () => { void logout(); }, setNome: unsupported, setEmail: unsupported,
    adicionarPontos: unsupported, adicionarBonus: unsupported, subtrairPontos: unsupported, addResgate: unsupported, resgatarBonusDesafio: unsupported };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
type DataValue = { data: UserData; desafioDoDia: Missao; desafioBonusDisponivel: boolean; getNivel: () => string; getSelosDesbloqueados: () => string[]; resetar: () => void;
  setNome: (nome: string) => void; setEmail: (email: string) => void; adicionarPontos: (pontos: number, nome: string) => void; adicionarBonus: (pontos: number, motivo: string, semToast?: boolean) => void;
  subtrairPontos: (pontos: number) => void; addResgate: (value: unknown) => void; resgatarBonusDesafio: () => void };
const DataContext = createContext<DataValue | null>(null);
export function useData() { const value = useContext(DataContext); if (!value) throw new Error('DataProvider ausente.'); return value; }
