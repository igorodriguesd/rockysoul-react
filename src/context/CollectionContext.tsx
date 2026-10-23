import { cardView } from '../api/viewModels';
import { createContext, useContext, type ReactNode } from 'react';
import type { Carta, ColecaoData, NovaCartaInfo, Quimica, RaridadeCarta, ResultadoDrop, SetCarta } from '../types';
import type { CartaApi, FragmentoApi, UsuarioCartaApi } from '../api/types';
import { useApi } from './ApiContext';
import { useApiPage } from '../hooks/useApiPage';
import { SETS_CARTAS } from '../data/cartas';
import { showToast } from '../components/Toast';
interface CollectionValue {
  colecao: ColecaoData;
  catalogo: Carta[];
  conjuntos: SetCarta[];
  adquirirCarta: (id: string, foil?: boolean, semToast?: boolean) => NovaCartaInfo | null;
  adquirirPorMissao: (id: string, semToast?: boolean) => ResultadoDrop | null;
  adicionarFragmentos: (raridade: RaridadeCarta, quantidade: number) => void;
  fabricarCarta: (id: string) => NovaCartaInfo | null;
  getChanceDrop: (carta: Carta) => number;
  getCartasDoSet: (id: string) => Carta[];
  getQuimica: (id: string) => Quimica;
  getProgressoTotal: () => { obtidas: number; total: number };
  getValorTotal: () => number;
  getProximoObjetivo: () => { set: SetCarta; faltam: number } | null;
  resetarColecao: () => void;
  getTotalCartasDoSet: (id: string) => number;
  setDesbloqueado: (id: string) => boolean;
}
const Context = createContext<CollectionValue | null>(null);
export function CollectionProvider({ children }: { children: ReactNode }) {
  const { user } = useApi();
  const { rows: cards } = useApiPage<CartaApi>('carta');
  const { rows: owned } = useApiPage<UsuarioCartaApi>('usuario-carta');
  const { rows: fragments } = useApiPage<FragmentoApi>('usuario-fragmento');
  const fragmentos = { comum: 0, incomum: 0, rara: 0, epica: 0, lendaria: 0 };
  for (const row of fragments) if (row.usuarioId === user?.id) fragmentos[row.raridade.toLowerCase() as RaridadeCarta] = row.quantidade;
  const catalogo: Carta[] = cards.map(cardView);
  const conjuntos: SetCarta[] = [...new Set(cards.map(card => card.conjunto))].map(id => {
    const style = SETS_CARTAS.find(set => set.id.toLocaleLowerCase() === id.toLocaleLowerCase() || set.nome.toLocaleLowerCase() === id.toLocaleLowerCase());
    return { id: style?.id ?? id, nome: style?.nome ?? id, tema: style?.tema ?? 'Sua coleção sustentável', descricao: style?.descricao ?? '', icone: style?.icone ?? '/icons/folha.svg', cor: style?.cor ?? '#20d968', pontosMin: style?.pontosMin ?? 0 };
  });
  const colecao: ColecaoData = { cartasObtidas: owned.filter(row => row.usuarioId === user?.id && row.quantidade > 0).map(row => { const card = cards.find(item => item.id === row.cartaId); return card ? cardView(card).id : `api-${row.cartaId}`; }), cartasFoil: [], fragmentos, sets: {} };
  for (const set of conjuntos) colecao.sets[set.id] = { cartas: catalogo.filter(card => card.setId === set.id && colecao.cartasObtidas.includes(card.id)).map(card => card.id), level: 0 };
  const unsupported = () => { showToast('Use a roleta liberada pela aprovação da ação para ganhar cartas e fragmentos. A fabricação ainda não está disponível.'); return null; };
  return <Context.Provider value={{ colecao, catalogo, conjuntos, adquirirCarta: unsupported, adquirirPorMissao: unsupported, fabricarCarta: unsupported, adicionarFragmentos: unsupported,
    resetarColecao: () => {}, getTotalCartasDoSet: id => colecao.sets[id]?.cartas.length ?? 0,
    setDesbloqueado: id => !!user && (user.pontos + user.resgatados) >= (conjuntos.find(set => set.id === id)?.pontosMin ?? 0),
    getChanceDrop: () => 0, getQuimica: () => ({ level: 0, bonusPontos: 0, descricao: 'Bônus de coleção não implementado no backend.' }),
    getCartasDoSet: id => catalogo.filter(card => card.setId === id),
    getProgressoTotal: () => ({ obtidas: colecao.cartasObtidas.length, total: cards.length }), getValorTotal: () => 0, getProximoObjetivo: () => { const set = conjuntos.find(item => colecao.sets[item.id].cartas.length < catalogo.filter(card => card.setId === item.id).length); return set ? { set, faltam: catalogo.filter(card => card.setId === set.id).length - colecao.sets[set.id].cartas.length } : null; } }}>{children}</Context.Provider>;
}
export function useColecao() { const value = useContext(Context); if (!value) throw new Error('CollectionProvider ausente.'); return value; }
