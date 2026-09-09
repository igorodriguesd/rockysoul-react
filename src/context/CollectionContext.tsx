import { createContext, useContext, useCallback, type ReactNode } from 'react';
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
} from '../data/cartas';
import { showToast } from '../components/Toast';

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
};

interface CollectionContextType {
  colecao: ColecaoData;
  adquirirCarta: (cardId: string, foil?: boolean, semToast?: boolean) => NovaCartaInfo | null;
  adquirirPorMissao: (missaoId: string, semToast?: boolean) => ResultadoDrop | null;
  adicionarFragmentos: (raridade: RaridadeCarta, quantidade: number) => void;
  fabricarCarta: (cardId: string) => NovaCartaInfo | null;
  getChanceDrop: (carta: Carta) => number;
  getCartasDoSet: (setId: string) => Carta[];
  getQuimica: (setId: string) => Quimica;
  getProgressoTotal: () => { obtidas: number; total: number };
  getValorTotal: () => number;
  getProximoObjetivo: () => { set: SetCarta; faltam: number } | null;
}

const CollectionContext = createContext<CollectionContextType | null>(null);

function setUsuario(setId: string, colecao: ColecaoData) {
  return colecao.sets[setId] ?? { cartas: [], level: 0 };
}

function getSetDeCarta(setId: string): SetCarta {
  return SETS_CARTAS.find(s => s.id === setId) ?? SETS_CARTAS[0];
}

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [colecao, setColecao] = useLocalStorage<ColecaoData>(STORAGE_KEY, defaultColecao);
  const { adicionarBonus } = useData();

  const adquirirCarta = useCallback((cardId: string, foil = false, semToast = false): NovaCartaInfo | null => {
    const carta = CARTAS.find(c => c.id === cardId);
    if (!carta) return null;
    if (colecao.cartasObtidas.includes(cardId)) return null;

    const setAtual = setUsuario(carta.setId, colecao);
    const totalNovo = setAtual.cartas.length + 1;
    const quimicaNova = calcularQuimica(totalNovo);
    const quimicaAntes = calcularQuimica(setAtual.cartas.length);

    setColecao(prev => {
      const setAntes = setUsuario(carta.setId, prev);
      return {
        ...prev,
        cartasObtidas: [...prev.cartasObtidas, cardId],
        cartasFoil: foil ? [...prev.cartasFoil, cardId] : prev.cartasFoil,
        fragmentos: { ...fragmentosZero, ...prev.fragmentos },
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

    if (bonusGanho > 0) {
      adicionarBonus(bonusGanho, `Bônus de Química - ${getSetDeCarta(carta.setId).nome} Nível ${quimicaNova.level}`, semToast);
    }

    return { carta, set: getSetDeCarta(carta.setId), quimicaAntes, quimicaNova, bonusGanho };
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
      setColecao(prev => ({
        ...prev,
        cartasFoil: [...(prev.cartasFoil ?? []), cardId],
        fragmentos: { ...fragmentosZero, ...prev.fragmentos },
      }));
      if (!semToast) {
        showToast(`CARTA BRILHANTE! ${carta.nome} evoluiu para a versão premium`);
      }
      return { caiu: true, foil: true, carta };
    }

    const fragmentosGanhos = FRAGMENTOS_POR_DUPLICADA[carta.raridade];
    adicionarFragmentos(carta.raridade, fragmentosGanhos);
    return { caiu: true, duplicada: true, carta, fragmentosGanhos };
  }, [colecao, adquirirCarta, setColecao, adicionarFragmentos]);

  const fabricarCarta = useCallback((cardId: string): NovaCartaInfo | null => {
    const carta = CARTAS.find(c => c.id === cardId);
    if (!carta) return null;
    if (colecao.cartasObtidas.includes(cardId)) return null;

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
  }, [colecao, adquirirCarta, setColecao]);

  const getChanceDrop = useCallback((carta: Carta): number => {
    return CHANCE_DROP_POR_RARIDADE[carta.raridade];
  }, []);

  const getCartasDoSet = useCallback((setId: string): Carta[] => {
    return CARTAS
      .filter(c => c.setId === setId)
      .sort((a, b) => PESO_RARIDADE[a.raridade] - PESO_RARIDADE[b.raridade]);
  }, []);

  const getQuimica = useCallback((setId: string): Quimica => {
    return calcularQuimica(setUsuario(setId, colecao).cartas.length);
  }, [colecao]);

  const getProgressoTotal = useCallback(() => {
    const obtidas = colecao.cartasObtidas.filter(id => CARTAS.some(c => c.id === id)).length;
    return { obtidas, total: CARTAS.length };
  }, [colecao]);

const getValorTotal = useCallback(() => {
    const foils = new Set(colecao.cartasFoil ?? []);
    return CARTAS.reduce((acc, carta) => {
      if (!colecao.cartasObtidas.includes(carta.id)) return acc;
      return acc + getValorCarta(carta, foils.has(carta.id));
    }, 0);
  }, [colecao]);

  const getProximoObjetivo = useCallback(() => {
    const ordenados = SETS_CARTAS
      .map(set => {
        const obtidas = setUsuario(set.id, colecao).cartas.length;
        return { set, obtidas, faltam: 4 - obtidas };
      })
      .filter(s => s.faltam > 0)
      .sort((a, b) => a.faltam - b.faltam);

    if (ordenados.length === 0) return null;
    return { set: ordenados[0].set, faltam: ordenados[0].faltam };
  }, [colecao]);

  return (
    <CollectionContext.Provider value={{
      colecao,
      adquirirCarta,
      adquirirPorMissao,
      adicionarFragmentos,
      fabricarCarta,
      getChanceDrop,
      getCartasDoSet,
      getQuimica,
      getProgressoTotal,
      getValorTotal,
      getProximoObjetivo,
    }}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useColecao() {
  const context = useContext(CollectionContext);
  if (!context) throw new Error('useColecao deve ser usado dentro de um CollectionProvider');
  return context;
}