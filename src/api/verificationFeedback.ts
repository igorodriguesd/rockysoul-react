import type { Verificacao } from './types';

export function verificationMessage(result: Verificacao): string {
  if (result.estado === 'APROVADA') return `Ação aprovada! +${result.pontosCreditados} pontos confirmados.`;
  if (result.estado === 'REJEITADA') return 'Ação rejeitada. A imagem não corresponde à atividade escolhida. Envie uma nova foto.';
  return 'Sua ação foi enviada para revisão. Aguarde a avaliação.';
}
