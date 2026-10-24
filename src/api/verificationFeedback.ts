import type { Verificacao } from './types';

export function verificationMessage(result: Verificacao): string {
  const message = result.estado === 'APROVADA'
    ? `Ação aprovada! +${result.pontosCreditados} pontos confirmados.`
    : result.estado === 'REJEITADA'
      ? 'Ação rejeitada. A foto não demonstra a atividade escolhida. Nenhum ponto foi creditado.'
      : ['HTTP_FAILURE', 'TIMEOUT_OR_NETWORK', 'INVALID_RESPONSE', 'INVALID_USAGE', 'LEASE_EXPIRED', 'DISPATCH_BLOCKED'].includes(result.parecer ?? '')
        ? 'Não foi possível concluir a análise automática. Sua foto aguarda revisão, sem pontos por enquanto.'
        : result.parecer === 'DESAFIO_NAO_CONFIRMADO'
          ? 'Não foi possível confirmar o código do desafio na foto. Sua ação aguarda revisão, sem pontos por enquanto.'
          : 'Sua foto precisa de revisão. Você recebe os pontos se a ação for aprovada.';
  return result.feedback ? `${message} Avaliação da foto: ${result.feedback}` : message;
}
