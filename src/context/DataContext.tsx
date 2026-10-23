import { createContext, useContext, type ReactNode } from 'react';
import type { Missao, UserData } from '../types';
import type { Acao, HistoricoApi, SeloApi, Verificacao } from '../api/types';
import { useApi } from './ApiContext';
import { useApiPage } from '../hooks/useApiPage';
import { showToast } from '../components/Toast';
import { NIVEIS } from '../data/constants';
import { actionView } from '../api/viewModels';

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, logout } = useApi();
  const { rows: historico } = useApiPage<HistoricoApi>('historico');
  const { rows: verificacoes } = useApiPage<Verificacao>('verificacoes');
  const { rows: selos } = useApiPage<SeloApi>('selo');
  const actions = useApiPage<Acao>('acao');
  const acoes = actions.rows;
  const missoes = acoes.map(actionView);
  const ownHistory = historico.filter(row => row.usuarioId === user?.id);
  const today = new Date().toLocaleDateString('en-CA');
  const data: UserData = {
    nome: user?.nome ?? '', email: user?.email ?? '', pontos: user?.pontos ?? 0,
    pontosAcumulados: (user?.pontos ?? 0) + (user?.resgatados ?? 0), impactoParceiros: {}, amigos: [],
    missoesCompletas: ownHistory.length,
    pontosHoje: ownHistory.filter(row => row.dataAcao.slice(0, 10) === today).reduce((sum, row) => sum + row.pontos, 0),
    dataHoje: today, ultimoDia: '', streak: 0, ultimoDesafio: '',
    historico: ownHistory.map(row => ({ nome: row.descricao, pontos: row.pontos, data: row.dataAcao })),
    selosDesbloqueados: [], resgates: [],
  };
  const first = acoes[0];
  const desafioDoDia: Missao = first ? actionView(first) : { id: '', nome: 'Entre para consultar ações', pontos: 0, icone: '/icons/folha.svg', comprovacao: 'foto', descricao: '', comoValidar: '', comprovantes: [] };
  const unsupported = () => showToast('Esta operação ainda não está disponível na API. Nenhum saldo foi alterado.');
  const value = { data, verificacoes, missoes, actionsLoading: actions.loading, actionsError: actions.error, desafioDoDia, desafioBonusDisponivel: false,
    getNivel: () => NIVEIS.find(level => data.pontosAcumulados >= level.min && data.pontosAcumulados <= level.max)?.nome ?? 'Semente',
    getSelosDesbloqueados: () => selos.filter(selo => data.pontos >= selo.pontosMin).map(selo => String(selo.id)),
    registrarImpactoParceiro: unsupported, amigos: [] as string[], codigoAmigo: '', addAmigo: () => { unsupported(); return false; },
    resetar: () => { void logout(); }, setNome: unsupported, setEmail: unsupported,
    adicionarPontos: unsupported, adicionarBonus: unsupported, subtrairPontos: unsupported, addResgate: unsupported, resgatarBonusDesafio: unsupported };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
type DataValue = { data: UserData; verificacoes: Verificacao[]; missoes: Missao[]; actionsLoading: boolean; actionsError: string | null; amigos: string[]; codigoAmigo: string; addAmigo: (codigo: string) => boolean; registrarImpactoParceiro: (id: string, tipo: string, pontos: number) => void; desafioDoDia: Missao; desafioBonusDisponivel: boolean; getNivel: () => string; getSelosDesbloqueados: () => string[]; resetar: () => void;
  setNome: (nome: string) => void; setEmail: (email: string) => void; adicionarPontos: (pontos: number, nome: string) => void; adicionarBonus: (pontos: number, motivo: string, semToast?: boolean) => void;
  subtrairPontos: (pontos: number) => void; addResgate: (value: unknown) => void; resgatarBonusDesafio: () => void };
const DataContext = createContext<DataValue | null>(null);
export function useData() { const value = useContext(DataContext); if (!value) throw new Error('DataProvider ausente.'); return value; }
