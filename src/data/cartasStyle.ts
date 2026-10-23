import type { Carta, RaridadeCarta } from '../types';
import { LABEL_RARIDADE } from './cartas';

const SETS_INICIAIS: Record<string, string> = {
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

interface FutTier {
  border: string;
  glow: string;
  texto: string;
}

// Borda identifica a raridade antes de qualquer texto:
// cinza (Comum) · azul (Incomum) · roxo (Rara) · gradiente (Épica) · holográfica (Lendária)
export const TIER: Record<RaridadeCarta, FutTier> = {
  comum: { border: '#9ca3af', glow: 'rgba(156,163,175,0.4)', texto: '#e5e7eb' },
  incomum: { border: '#38bdf8', glow: 'rgba(56,189,248,0.5)', texto: '#bae6fd' },
  rara: { border: '#a855f7', glow: 'rgba(168,85,247,0.5)', texto: '#e9d5ff' },
  epica: { border: '#ff4d9e', glow: 'rgba(255,77,158,0.55)', texto: '#ffe0f0' },
  lendaria: { border: '#fbbf24', glow: 'rgba(251,191,36,0.6)', texto: '#ffeab0' },
};

const GRADIENTE_BORDA: Record<RaridadeCarta, string | null> = {
  comum: null,
  incomum: null,
  rara: null,
  epica: 'linear-gradient(120deg, #ff4d9e 0%, #b74eff 45%, #2f7bff 100%)',
  lendaria: 'conic-gradient(from 220deg, #ff6b6b 0%, #ffd93d 20%, #6bcb77 38%, #4d96ff 60%, #b388ff 80%, #ff6b6b 100%)',
};

function getCardBackgroundLayers(raridade: RaridadeCarta, foil = false): string[] {
  const camadas = [FUNDO_POR_RARIDADE[raridade], GLOW_POR_RARIDADE[raridade]];
  if (foil) camadas.push(TONALIDADE_FOIL);
  return camadas;
}

function getCardBackground(raridade: RaridadeCarta, foil = false): string {
  return getCardBackgroundLayers(raridade, foil).join(', ');
}

// Fundo + borda em gradiente/holográfica numa única propriedade `background`,
// usando clipping: conteúdo em padding-box, gradiente visível na faixa da borda.
export function getCardBackgroundComBorda(raridade: RaridadeCarta, foil: boolean): string {
  const grad = GRADIENTE_BORDA[raridade];
  if (!grad) return getCardBackground(raridade, foil);
  const camadas = getCardBackgroundLayers(raridade, foil).map(c => `${c} padding-box`);
  return [...camadas, `${grad} border-box`].join(', ');
}

const TONALIDADE_FOIL = 'linear-gradient(115deg, rgba(255,232,150,0.55) 0%, transparent 42%, rgba(255,255,255,0.35) 55%, transparent 78%)';

export function getCardLabel(carta: Carta): string {
  return LABEL_RARIDADE[carta.raridade];
}

export function usaBordaGradiente(raridade: RaridadeCarta): boolean {
  return GRADIENTE_BORDA[raridade] !== null;
}