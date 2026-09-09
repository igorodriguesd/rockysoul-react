import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useData } from './DataContext';
import type { Carta, ColecaoData, NovaCartaInfo, Quimica, ResultadoDrop, SetCarta } from '../types';
import { CARTAS, SETS_CARTAS, MISSION_TO_CARD, calcularQuimica, CHANCE_DROP_POR_RARIDADE } from '../data/cartas';
import { showToast } from '../components/Toast';

const STORAGE_KEY = 'rocky_colecao';

const defaultColecao: ColecaoData = {
  cartasObtidas: [],
  sets: {},
};

interface CollectionContextType {
  colecao: ColecaoData;
  adquirirCarta: (cardId: string) => NovaCartaInfo | null;
  adquirirPorMissao: (missaoId: string) => ResultadoDrop | null;
  getChanceDrop: (carta: Carta) => number;
  getCartasDoSet: (setId: string) => Carta[];
  getQuimica: (setId: string) => Quimica;
  getProgressoTotal: () => { obtidas: number; total: number };
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

  const adquirirCarta = useCallback((cardId: string): NovaCartaInfo | null => {
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

    showToast(`Nova carta obtida: ${carta.nome} (${getSetDeCarta(carta.setId).nome})`);

    if (bonusGanho > 0) {
      adicionarBonus(bonusGanho, `Bônus de Química - ${getSetDeCarta(carta.setId).nome} Nível ${quimicaNova.level}`);
    }

    return { carta, set: getSetDeCarta(carta.setId), quimicaAntes, quimicaNova, bonusGanho };
  }, [colecao, setColecao, adicionarBonus]);

  const adquirirPorMissao = useCallback((missaoId: string): ResultadoDrop | null => {
    const cardId = MISSION_TO_CARD[missaoId];
    if (!cardId) return null;
    const carta = CARTAS.find(c => c.id === cardId);
    if (!carta) return null;
    if (colecao.cartasObtidas.includes(cardId)) return null;

    const chance = CHANCE_DROP_POR_RARIDADE[carta.raridade];
    if (Math.random() * 100 >= chance) {
      return { caiu: false, carta, chance };
    }

    const novaCarta = adquirirCarta(cardId);
    if (!novaCarta) return { caiu: false, carta, chance };
    return { caiu: true, novaCarta };
  }, [colecao, adquirirCarta]);

  const getChanceDrop = useCallback((carta: Carta): number => {
    return CHANCE_DROP_POR_RARIDADE[carta.raridade];
  }, []);

  const getCartasDoSet = useCallback((setId: string): Carta[] => {
    return CARTAS.filter(c => c.setId === setId);
  }, []);

  const getQuimica = useCallback((setId: string): Quimica => {
    return calcularQuimica(setUsuario(setId, colecao).cartas.length);
  }, [colecao]);

  const getProgressoTotal = useCallback(() => {
    const obtidas = colecao.cartasObtidas.filter(id => CARTAS.some(c => c.id === id)).length;
    return { obtidas, total: CARTAS.length };
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
      getChanceDrop,
      getCartasDoSet,
      getQuimica,
      getProgressoTotal,
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