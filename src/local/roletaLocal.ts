import type { CartaApi } from '../api/types';

/**
 * Giros perdidos ficam guardados no navegador para que o jogador possa tentar
 * de novo (pagando créditos localmente) mesmo depois de fechar o modal.
 * A API de produção não expõe giros perdidos na lista de roletas.
 */
export interface GiroPerdidoLocal {
  verificacaoId: string;
  carta: CartaApi;
  chance: number;
  custo: number;
}

const KEY = 'rocky_roletas_perdidas_';

export function lerGirosPerdidos(usuarioId: number): GiroPerdidoLocal[] {
  try {
    const raw = localStorage.getItem(`${KEY}${usuarioId}`);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is GiroPerdidoLocal =>
      !!item && typeof item === 'object' &&
      typeof (item as GiroPerdidoLocal).verificacaoId === 'string' &&
      typeof (item as GiroPerdidoLocal).chance === 'number' &&
      !!(item as GiroPerdidoLocal).carta,
    );
  } catch {
    return [];
  }
}

export function salvarGiroPerdido(usuarioId: number, giro: GiroPerdidoLocal): void {
  const atuais = lerGirosPerdidos(usuarioId).filter(item => item.verificacaoId !== giro.verificacaoId);
  try { localStorage.setItem(`${KEY}${usuarioId}`, JSON.stringify([...atuais, giro])); } catch { /* storage indisponível */ }
}

export function removerGiroPerdido(usuarioId: number, verificacaoId: string): void {
  const atuais = lerGirosPerdidos(usuarioId).filter(item => item.verificacaoId !== verificacaoId);
  try { localStorage.setItem(`${KEY}${usuarioId}`, JSON.stringify(atuais)); } catch { /* storage indisponível */ }
}
