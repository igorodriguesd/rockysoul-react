import { useColecao } from '../context/CollectionContext';

const CARTAS_POR_SET = 4;

export function useChemistry(setId: string) {
  const { colecao, getQuimica } = useColecao();

  const quimica = getQuimica(setId);
  const setUsuario = colecao.sets[setId];
  const totalCartas = setUsuario?.cartas.length ?? 0;
  const obtidas = setUsuario?.cartas ?? [];
  const percentual = (totalCartas / CARTAS_POR_SET) * 100;
  const faltam = CARTAS_POR_SET - totalCartas;

  const mensagem = quimica.level === 0
    ? `Faltam ${faltam} carta(s) para ativar a química`
    : quimica.level === 3
      ? 'Set completo · Química Nível 3'
      : quimica.level === 2
        ? 'Química Nível 2 · +30 pontos de bônus'
        : 'Química Nível 1 ativa';

  return {
    quimica,
    totalCartas,
    obtidas,
    faltam,
    percentual,
    mensagem,
    setCompleto: quimica.level === 3,
  };
}