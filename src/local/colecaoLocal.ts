import type { RaridadeCarta } from '../types';

export interface ColecaoLocal {
  cartas: string[];
  fragmentos: Partial<Record<RaridadeCarta, number>>;
}

const KEY = 'rocky_colecao_local_';

export function lerColecaoLocal(usuarioId: number): ColecaoLocal {
  try {
    const raw = localStorage.getItem(`${KEY}${usuarioId}`);
    if (!raw) return { cartas: [], fragmentos: {} };
    const parsed = JSON.parse(raw) as Partial<ColecaoLocal>;
    return {
      cartas: Array.isArray(parsed.cartas) ? parsed.cartas.filter((id): id is string => typeof id === 'string') : [],
      fragmentos: parsed.fragmentos && typeof parsed.fragmentos === 'object' ? parsed.fragmentos : {},
    };
  } catch {
    return { cartas: [], fragmentos: {} };
  }
}

export function salvarColecaoLocal(usuarioId: number, colecao: ColecaoLocal): void {
  try { localStorage.setItem(`${KEY}${usuarioId}`, JSON.stringify(colecao)); } catch { /* storage indisponível */ }
}
