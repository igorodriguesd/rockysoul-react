import { useColecao } from '../context/CollectionContext';
import { CARTAS, BONUS_QUIMICA_N2 } from '../data/cartas';

const CARTAS_POR_SET = 4;

export function useChemistry(setId: string) {
  const { colecao, getQuimica, getTotalCartasDoSet } = useColecao();

  const quimica = getQuimica(setId);
  const totalCartas = getTotalCartasDoSet(setId);
  const obtidas = CARTAS
    .filter(c => c.setId === setId && colecao.cartasObtidas.includes(c.id))
    .map(c => c.id);
  const percentual = (totalCartas / CARTAS_POR_SET) * 100;
  const faltam = CARTAS_POR_SET - totalCartas;

  const mensagem = quimica.level === 0
    ? `Faltam ${faltam} carta(s) para ativar a química`
    : quimica.level === 1
      ? `Química Nível 1 ativa · falta 1 carta para o bônus de +${BONUS_QUIMICA_N2}`
      : quimica.level === 2
        ? `Química Nível 2 · +${BONUS_QUIMICA_N2} créditos na 3ª carta`
        : 'Set completo · Química Nível 3';

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