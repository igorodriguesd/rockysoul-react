<<<<<<< HEAD
import { createContext, useContext, type ReactNode } from 'react';
import type { Carta, ColecaoData, NovaCartaInfo, Quimica, RaridadeCarta, ResultadoDrop, SetCarta } from '../types';
import type { CartaApi, FragmentoApi, UsuarioCartaApi } from '../api/types';
import { useApi } from './ApiContext';
import { useApiPage } from '../hooks/useApiPage';
import { CARTAS as ARTWORK, SETS_CARTAS } from '../data/cartas';
import { showToast } from '../components/Toast';
interface CollectionValue {
=======
import { createContext, useContext, useCallback, useEffect, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useData } from './DataContext';
import type { Carta, ColecaoData, NovaCartaInfo, Quimica, RaridadeCarta, ResultadoDrop, SetCarta } from '../types';
import {
  CARTAS,
  SETS_CARTAS,
  MISSION_TO_CARD,
  calcularQuimica,
  CHANCE_DROP_POR_RARIDADE,
  CHANCE_FOIL,
  FRAGMENTOS_POR_DUPLICADA,
  CUSTO_FABRICACAO,
  PESO_RARIDADE,
  getValorCarta,
  MULTIPLICADOR_FOIL,
} from '../data/cartas';
import { showToast } from '../components/Toast';
import { nomeNivelPorPontos } from '../data/constants';

const STORAGE_KEY = 'rocky_colecao';

const fragmentosZero = {
  comum: 0,
  incomum: 0,
  rara: 0,
  epica: 0,
  lendaria: 0,
};

const defaultColecao: ColecaoData = {
  cartasObtidas: [],
  cartasFoil: [],
  fragmentos: fragmentosZero,
  sets: {},
  valorCreditado: 0,
};

/** Valor total em créditos da carteira de cartas (com a versão brilhante). */
function calcularValorCarteira(colecao: ColecaoData): number {
  const foils = new Set(colecao.cartasFoil ?? []);
  return CARTAS.reduce((acc, carta) => {
    if (!colecao.cartasObtidas.includes(carta.id)) return acc;
    return acc + getValorCarta(carta, foils.has(carta.id));
  }, 0);
}

interface CollectionContextType {
>>>>>>> origin/main
  colecao: ColecaoData;
  catalogo: Carta[];
  conjuntos: SetCarta[];
  adquirirCarta: (id: string, foil?: boolean, semToast?: boolean) => NovaCartaInfo | null;
  adquirirPorMissao: (id: string, semToast?: boolean) => ResultadoDrop | null;
  adicionarFragmentos: (raridade: RaridadeCarta, quantidade: number) => void;
<<<<<<< HEAD
  fabricarCarta: (id: string) => NovaCartaInfo | null;
  getChanceDrop: (carta: Carta) => number;
  getCartasDoSet: (id: string) => Carta[];
  getQuimica: (id: string) => Quimica;
=======
  fabricarCarta: (cardId: string) => NovaCartaInfo | null;
  setDesbloqueado: (setId: string) => boolean;
  getChanceDrop: (carta: Carta) => number;
  getCartasDoSet: (setId: string) => Carta[];
  getQuimica: (setId: string) => Quimica;
  getTotalCartasDoSet: (setId: string) => number;
>>>>>>> origin/main
  getProgressoTotal: () => { obtidas: number; total: number };
  getValorTotal: () => number;
  getProximoObjetivo: () => { set: SetCarta; faltam: number } | null;
  resetarColecao: () => void;
}
const Context = createContext<CollectionValue | null>(null);
export function CollectionProvider({ children }: { children: ReactNode }) {
<<<<<<< HEAD
  const { user } = useApi();
  const { rows: cards } = useApiPage<CartaApi>('carta');
  const { rows: owned } = useApiPage<UsuarioCartaApi>('usuario-carta');
  const { rows: fragments } = useApiPage<FragmentoApi>('usuario-fragmento');
  const fragmentos = { comum: 0, incomum: 0, rara: 0, epica: 0, lendaria: 0 };
  for (const row of fragments) if (row.usuarioId === user?.id) fragmentos[row.raridade.toLowerCase() as RaridadeCarta] = row.quantidade;
  const catalogo: Carta[] = cards.map(card => {
    const artwork = ARTWORK.find(item => item.nome.toLocaleLowerCase() === card.nome.toLocaleLowerCase());
    return { id: String(card.id), nome: card.nome, setId: card.conjunto, raridade: card.raridade.toLowerCase() as RaridadeCarta, descricao: card.descricao ?? '', educativa: '', icone: artwork?.icone ?? '/icons/folha.svg' };
  });
  const conjuntos: SetCarta[] = [...new Set(cards.map(card => card.conjunto))].map(id => {
    const style = SETS_CARTAS.find(set => set.id.toLocaleLowerCase() === id.toLocaleLowerCase() || set.nome.toLocaleLowerCase() === id.toLocaleLowerCase());
    return { id, nome: style?.nome ?? id, tema: style?.tema ?? 'Sua coleção sustentável', descricao: style?.descricao ?? '', icone: style?.icone ?? '/icons/folha.svg', cor: style?.cor ?? '#20d968' };
  });
  const colecao: ColecaoData = { cartasObtidas: owned.filter(row => row.usuarioId === user?.id && row.quantidade > 0).map(row => String(row.cartaId)), cartasFoil: [], fragmentos, sets: {} };
  for (const set of conjuntos) colecao.sets[set.id] = { cartas: catalogo.filter(card => card.setId === set.id && colecao.cartasObtidas.includes(card.id)).map(card => card.id), level: 0 };
  const unsupported = () => { showToast('A API ainda não oferece fabricação, sorteio ou crédito de fragmentos.'); return null; };
  return <Context.Provider value={{ colecao, catalogo, conjuntos, adquirirCarta: unsupported, adquirirPorMissao: unsupported, fabricarCarta: unsupported, adicionarFragmentos: unsupported,
    getChanceDrop: () => 0, getQuimica: () => ({ level: 0, bonusPontos: 0, descricao: 'Bônus de coleção não implementado no backend.' }),
    getCartasDoSet: id => catalogo.filter(card => card.setId === id),
    getProgressoTotal: () => ({ obtidas: colecao.cartasObtidas.length, total: cards.length }), getValorTotal: () => 0, getProximoObjetivo: () => { const set = conjuntos.find(item => colecao.sets[item.id].cartas.length < catalogo.filter(card => card.setId === item.id).length); return set ? { set, faltam: catalogo.filter(card => card.setId === set.id).length - colecao.sets[set.id].cartas.length } : null; } }}>{children}</Context.Provider>;
=======
  const [colecao, setColecao] = useLocalStorage<ColecaoData>(STORAGE_KEY, defaultColecao);
  const { data, adicionarBonus } = useData();

  // Regulariza o saldo: cartas obtidas antes do valor virar crédito são creditadas uma única vez.
  useEffect(() => {
    const esperado = calcularValorCarteira(colecao);
    const creditado = colecao.valorCreditado ?? 0;
    if (esperado > creditado) {
      const diff = esperado - creditado;
      setColecao(prev => ({ ...prev, valorCreditado: esperado }));
      adicionarBonus(diff, 'Valor da sua coleção de cartas');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const adquirirCarta = useCallback((cardId: string, foil = false, semToast = false): NovaCartaInfo | null => {
    const carta = CARTAS.find(c => c.id === cardId);
    if (!carta) return null;
    if (colecao.cartasObtidas.includes(cardId)) return null;

    const setAtual = setUsuario(carta.setId, colecao);
    const totalNovo = setAtual.cartas.length + 1;
    const quimicaNova = calcularQuimica(totalNovo);
    const quimicaAntes = calcularQuimica(setAtual.cartas.length);

    const valorCarta = getValorCarta(carta, foil);

    setColecao(prev => {
      const setAntes = setUsuario(carta.setId, prev);
      return {
        ...prev,
        cartasObtidas: [...prev.cartasObtidas, cardId],
        cartasFoil: foil ? [...prev.cartasFoil, cardId] : prev.cartasFoil,
        fragmentos: { ...fragmentosZero, ...prev.fragmentos },
        valorCreditado: (prev.valorCreditado ?? 0) + valorCarta,
        sets: {
          ...prev.sets,
          [carta.setId]: {
            cartas: [...setAntes.cartas, cardId],
            level: quimicaNova.level,
          },
        },
      };
    });

    const bonusGanho = quimicaNova.level > quimicaAntes.level ? quimicaNova.bonusPontos : 0;

    if (!semToast) {
      showToast(`${foil ? 'Carta BRILHANTE obtida: ' : 'Nova carta obtida: '}${carta.nome} (${getSetDeCarta(carta.setId).nome})`);
    }

    if (valorCarta > 0) {
      adicionarBonus(valorCarta, `Valor da carta: ${carta.nome}${foil ? ' (brilhante)' : ''}`, semToast);
    }

    if (bonusGanho > 0) {
      adicionarBonus(bonusGanho, `Bônus de Química - ${getSetDeCarta(carta.setId).nome} Nível ${quimicaNova.level}`, semToast);
    }

    return { carta, set: getSetDeCarta(carta.setId), quimicaAntes, quimicaNova, bonusGanho, valorCarta };
  }, [colecao, setColecao, adicionarBonus]);

  const adicionarFragmentos = useCallback((raridade: RaridadeCarta, quantidade: number) => {
    setColecao(prev => ({
      ...prev,
      fragmentos: { ...fragmentosZero, ...prev.fragmentos, [raridade]: (prev.fragmentos?.[raridade] ?? 0) + quantidade },
    }));
  }, [setColecao]);

  const adquirirPorMissao = useCallback((missaoId: string, semToast = false): ResultadoDrop | null => {
    const cardId = MISSION_TO_CARD[missaoId];
    if (!cardId) return null;
    const carta = CARTAS.find(c => c.id === cardId);
    if (!carta) return null;

    const chance = CHANCE_DROP_POR_RARIDADE[carta.raridade];
    const jaTem = colecao.cartasObtidas.includes(cardId);
    const jaEhFoil = colecao.cartasFoil?.includes(cardId) ?? false;

    if (Math.random() * 100 >= chance) {
      return { caiu: false, carta, chance };
    }

    if (!jaTem) {
      const ehFoil = Math.random() * 100 < CHANCE_FOIL;
      const novaCarta = adquirirCarta(cardId, ehFoil, semToast);
      if (!novaCarta) return { caiu: false, carta, chance };
      return { caiu: true, novaCarta, foil: ehFoil };
    }

    if (!jaEhFoil && Math.random() * 100 < CHANCE_FOIL) {
      const valorExtra = getValorCarta(carta) * (MULTIPLICADOR_FOIL - 1);
      setColecao(prev => ({
        ...prev,
        cartasFoil: [...(prev.cartasFoil ?? []), cardId],
        fragmentos: { ...fragmentosZero, ...prev.fragmentos },
        valorCreditado: (prev.valorCreditado ?? 0) + valorExtra,
      }));
      if (valorExtra > 0) {
        adicionarBonus(valorExtra, `Carta brilhante: ${carta.nome} (valor ×${MULTIPLICADOR_FOIL})`, semToast);
      }
      if (!semToast) {
        showToast(`CARTA BRILHANTE! ${carta.nome} evoluiu para a versão premium`);
      }
      return { caiu: true, foil: true, carta };
    }

    const fragmentosGanhos = FRAGMENTOS_POR_DUPLICADA[carta.raridade];
    adicionarFragmentos(carta.raridade, fragmentosGanhos);
    showToast(`+${fragmentosGanhos} fragmentos de ${carta.raridade} (carta repetida)`);
    return { caiu: true, duplicada: true, carta, fragmentosGanhos };
  }, [colecao, adquirirCarta, setColecao, adicionarFragmentos, adicionarBonus]);

  const fabricarCarta = useCallback((cardId: string): NovaCartaInfo | null => {
    const carta = CARTAS.find(c => c.id === cardId);
    if (!carta) return null;
    if (colecao.cartasObtidas.includes(cardId)) return null;

    const set = getSetDeCarta(carta.setId);
    if ((data.pontosAcumulados ?? data.pontos) < set.pontosMin) {
      showToast(`Set "${set.nome}" desbloqueia no nível ${nomeNivelPorPontos(set.pontosMin)} (${set.pontosMin} créditos)`);
      return null;
    }

    const custo = CUSTO_FABRICACAO[carta.raridade];
    const tem = (colecao.fragmentos?.[carta.raridade] ?? 0) >= custo;
    if (!tem) return null;

    setColecao(prev => ({
      ...prev,
      fragmentos: {
        ...fragmentosZero,
        ...prev.fragmentos,
        [carta.raridade]: (prev.fragmentos?.[carta.raridade] ?? 0) - custo,
      },
    }));

    return adquirirCarta(cardId, false);
  }, [colecao, adquirirCarta, setColecao, data.pontosAcumulados, data.pontos]);

  const setDesbloqueado = useCallback((setId: string): boolean => {
    return (data.pontosAcumulados ?? data.pontos) >= getSetDeCarta(setId).pontosMin;
  }, [data.pontosAcumulados, data.pontos]);

  const getChanceDrop = useCallback((carta: Carta): number => {
    return CHANCE_DROP_POR_RARIDADE[carta.raridade];
  }, []);

  const getCartasDoSet = useCallback((setId: string): Carta[] => {
    return CARTAS
      .filter(c => c.setId === setId)
      .sort((a, b) => PESO_RARIDADE[a.raridade] - PESO_RARIDADE[b.raridade]);
  }, []);

  // Quantas cartas do set o usuário tem — derivado de cartasObtidas (fonte da verdade),
  // para não depender do cache `sets` e não dessincronizar.
  const getTotalCartasDoSet = useCallback((setId: string): number => {
    return CARTAS.filter(c => c.setId === setId && colecao.cartasObtidas.includes(c.id)).length;
  }, [colecao.cartasObtidas]);

  const getQuimica = useCallback((setId: string): Quimica => {
    return calcularQuimica(getTotalCartasDoSet(setId));
  }, [getTotalCartasDoSet]);

  const getProgressoTotal = useCallback(() => {
    const obtidas = colecao.cartasObtidas.filter(id => CARTAS.some(c => c.id === id)).length;
    return { obtidas, total: CARTAS.length };
  }, [colecao]);

const getValorTotal = useCallback(() => {
  return calcularValorCarteira(colecao);
}, [colecao]);

  const getProximoObjetivo = useCallback(() => {
    const ordenados = SETS_CARTAS
      .map(set => {
        const obtidas = getTotalCartasDoSet(set.id);
        return { set, obtidas, faltam: 4 - obtidas };
      })
      .filter(s => s.faltam > 0 && (data.pontosAcumulados ?? data.pontos) >= s.set.pontosMin)
      .sort((a, b) => a.faltam - b.faltam);

    if (ordenados.length === 0) return null;
    return { set: ordenados[0].set, faltam: ordenados[0].faltam };
  }, [getTotalCartasDoSet, data.pontosAcumulados, data.pontos]);

  const resetarColecao = useCallback(() => {
    setColecao(defaultColecao);
  }, [setColecao]);

  return (
    <CollectionContext.Provider value={{
      colecao,
      adquirirCarta,
      adquirirPorMissao,
      adicionarFragmentos,
      fabricarCarta,
      setDesbloqueado,
      getChanceDrop,
      getCartasDoSet,
      getQuimica,
      getTotalCartasDoSet,
      getProgressoTotal,
      getValorTotal,
      getProximoObjetivo,
      resetarColecao,
    }}>
      {children}
    </CollectionContext.Provider>
  );
>>>>>>> origin/main
}
export function useColecao() { const value = useContext(Context); if (!value) throw new Error('CollectionProvider ausente.'); return value; }
