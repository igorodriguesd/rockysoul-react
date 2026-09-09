import type { Carta, RaridadeCarta } from '../types';
import { LABEL_RARIDADE } from './cartas';

export const SETS_INICIAIS: Record<string, string> = {
  recursos: 'RE',
  agua: 'AG',
  'cidade-verde': 'CV',
  'energia-limpa': 'EL',
  cultivo: 'CT',
};

export function getIniciaisSet(setId: string): string {
  return SETS_INICIAIS[setId] ?? setId.slice(0, 2).toUpperCase();
}

const FUNDO_POR_RARIDADE: Record<RaridadeCarta, string> = {
  comum: 'linear-gradient(135deg, #8fdc9a 0%, #3ba05f 48%, #14532d 100%)',
  incomum: 'linear-gradient(135deg, #e2ebf5 0%, #9fb1c8 48%, #48576d 100%)',
  rara: 'linear-gradient(135deg, #ffdf79 0%, #e8a81e 48%, #7c5606 100%)',
  epica: 'linear-gradient(115deg, #ff4d9e 0%, #b74eff 46%, #2f7bff 100%)',
  lendaria: 'linear-gradient(150deg, #24365f 0%, #101a38 55%, #0a0f22 100%)',
};

const GLOW_POR_RARIDADE: Record<RaridadeCarta, string> = {
  comum: 'radial-gradient(circle at 18% 12%, rgba(255,255,255,0.32), transparent 46%), radial-gradient(circle at 85% 88%, rgba(20,83,45,0.55), transparent 48%)',
  incomum: 'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.42), transparent 46%), radial-gradient(circle at 82% 88%, rgba(72,87,109,0.5), transparent 48%)',
  rara: 'radial-gradient(circle at 22% 14%, rgba(255,255,255,0.5), transparent 46%), radial-gradient(circle at 82% 86%, rgba(124,86,6,0.55), transparent 46%), radial-gradient(circle at 60% 30%, rgba(255,224,140,0.35), transparent 40%)',
  epica: 'radial-gradient(circle at 22% 14%, rgba(255,140,200,0.5), transparent 46%), radial-gradient(circle at 84% 86%, rgba(80,140,255,0.55), transparent 46%), radial-gradient(circle at 60% 35%, rgba(255,255,255,0.18), transparent 42%)',
  lendaria: 'radial-gradient(circle at 82% 12%, rgba(255,205,110,0.4), transparent 46%), radial-gradient(circle at 20% 90%, rgba(60,90,180,0.35), transparent 48%), radial-gradient(circle at 50% 40%, rgba(255,255,255,0.1), transparent 50%)',
};

export interface FutTier {
  border: string;
  glow: string;
  texto: string;
}

export const TIER: Record<RaridadeCarta, FutTier> = {
  comum: { border: '#8be2a0', glow: 'rgba(123,222,160,0.5)', texto: '#d7ffe4' },
  incomum: { border: '#e6edf6', glow: 'rgba(210,224,240,0.55)', texto: '#f2f7ff' },
  rara: { border: '#ffe18a', glow: 'rgba(255,209,102,0.55)', texto: '#fff2bf' },
  epica: { border: '#ff9bcb', glow: 'rgba(255,120,200,0.6)', texto: '#ffe1f1' },
  lendaria: { border: '#ffd977', glow: 'rgba(255,205,110,0.55)', texto: '#ffeab0' },
};

const TONALIDADE_FOIL = 'linear-gradient(115deg, rgba(255,232,150,0.55) 0%, transparent 42%, rgba(255,255,255,0.35) 55%, transparent 78%)';

export function getCardBackground(raridade: RaridadeCarta, foil = false): string {
  const fundo = `${FUNDO_POR_RARIDADE[raridade]}, ${GLOW_POR_RARIDADE[raridade]}`;
  return foil ? `${fundo}, ${TONALIDADE_FOIL}` : fundo;
}

export function getCardLabel(carta: Carta): string {
  return LABEL_RARIDADE[carta.raridade];
}