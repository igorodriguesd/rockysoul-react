import type { Carta, RaridadeCarta, SetCarta, Quimica } from '../types';

export const CHANCE_DROP_POR_RARIDADE: Record<RaridadeCarta, number> = {
  comum: 75,
  incomum: 55,
  rara: 35,
  epica: 20,
  lendaria: 10,
};

export const CHANCE_FOIL = 8;

/** Créditos creditados no saldo ao obter a carta (a brilhante vale 3x). */
export const VALOR_POR_RARIDADE: Record<RaridadeCarta, number> = {
  comum: 8,
  incomum: 15,
  rara: 30,
  epica: 60,
  lendaria: 120,
};

/** Multiplicador do valor na versão brilhante (foil). */
export const MULTIPLICADOR_FOIL = 3;

/** Bônus de química creditados ao alcançar cada nível do set. */
export const BONUS_QUIMICA_N2 = 30;
export const BONUS_QUIMICA_N3 = 150;
/** Química total de um set completo (nível 2 + nível 3). */
export const BONUS_QUIMICA_SET = BONUS_QUIMICA_N2 + BONUS_QUIMICA_N3;

export const FRAGMENTOS_POR_DUPLICADA: Record<RaridadeCarta, number> = {
  comum: 3,
  incomum: 5,
  rara: 10,
  epica: 20,
  lendaria: 40,
};

// Créditos para girar a roleta de novo depois de perder (cara rara = giro caro)
export const CUSTO_REGIRAR_POR_RARIDADE: Record<RaridadeCarta, number> = {
  comum: 5,
  incomum: 8,
  rara: 12,
  epica: 20,
  lendaria: 30,
};

export const CUSTO_FABRICACAO: Record<RaridadeCarta, number> = {
  comum: 10,
  incomum: 16,
  rara: 32,
  epica: 70,
  lendaria: 140,
};

export const PESO_RARIDADE: Record<RaridadeCarta, number> = {
  comum: 1,
  incomum: 2,
  rara: 3,
  epica: 4,
  lendaria: 5,
};

export function getValorCarta(carta: Carta, foil = false): number {
  return VALOR_POR_RARIDADE[carta.raridade] * (foil ? MULTIPLICADOR_FOIL : 1);
}

/** Soma do valor das 4 cartas de um set (sem a química). */
export function getValorSet(setId: string): number {
  return CARTAS
    .filter(c => c.setId === setId)
    .reduce((acc, c) => acc + VALOR_POR_RARIDADE[c.raridade], 0);
}

/** Quanto rende o set completo: valor das 4 cartas + química (nível 2 + nível 3). */
export function getValorSetCompleto(setId: string): number {
  return getValorSet(setId) + BONUS_QUIMICA_SET;
}

/** Quanto rende a coleção inteira (todas as cartas + química de todos os sets). */
export function getValorColecaoCompleta(): number {
  const cartas = CARTAS.reduce((acc, c) => acc + VALOR_POR_RARIDADE[c.raridade], 0);
  return cartas + BONUS_QUIMICA_SET * SETS_CARTAS.length;
}

export const LABEL_RARIDADE: Record<RaridadeCarta, string> = {
  comum: 'Comum',
  incomum: 'Incomum',
  rara: 'Rara',
  epica: 'Épica',
  lendaria: 'Lendária',
};

export const SETS_CARTAS: SetCarta[] = [
  {
    id: 'recursos',
    nome: 'Recursos',
    icone: '/icons/reciclagem.svg',
    tema: 'Consumo consciente',
    descricao: 'Reciclagem, reutilização, sacola ecológica e redução de desperdício.',
    cor: 'var(--color-brand)',
    pontosMin: 0,
  },
  {
    id: 'agua',
    nome: 'Guardiões da Água',
    icone: '/icons/agua.svg',
    tema: 'Preservação hídrica',
    descricao: 'Economia de água, banho rápido, garrafa reutilizável e captação de chuva.',
    cor: 'var(--color-brand-3)',
    pontosMin: 500,
  },
  {
    id: 'cidade-verde',
    nome: 'Cidade Verde',
    icone: '/icons/transporte.svg',
    tema: 'Sustentabilidade urbana',
    descricao: 'Bicicleta, transporte público, mobilidade elétrica e ciclovias.',
    cor: 'var(--color-brand-2)',
    pontosMin: 0,
  },
  {
    id: 'energia-limpa',
    nome: 'Energia Limpa',
    icone: '/icons/energia.svg',
    tema: 'Fontes renováveis',
    descricao: 'Economia de energia, solar, eólica e iluminação eficiente.',
    cor: '#f5c451',
    pontosMin: 1200,
  },
  {
    id: 'cultivo',
    nome: 'Cultivo',
    icone: '/icons/arvore.svg',
    tema: 'Agricultura sustentável',
    descricao: 'Plantio, compostagem, horta doméstica e agrofloresta.',
    cor: 'var(--color-violet)',
    pontosMin: 2000,
  },
];

export const CARTAS: Carta[] = [
  // SET RECURSOS (4 cartas)
  {
    id: 'card-reciclagem',
    nome: 'Reciclagem',
    setId: 'recursos',
    raridade: 'comum',
    descricao: 'Separar corretamente seus resíduos.',
    icone: '/icons/reciclagem.svg',
  },
  {
    id: 'card-reutilizacao',
    nome: 'Reutilização',
    setId: 'recursos',
    raridade: 'incomum',
    descricao: 'Dar nova vida a objetos e compartilhar dicas.',
    icone: '/icons/reutilizar.svg',
  },
  {
    id: 'card-sacola',
    nome: 'Sacola Reutilizável',
    setId: 'recursos',
    raridade: 'rara',
    descricao: 'Usar sacolas ecológicas no lugar das descartáveis.',
    icone: '/icons/sacola.svg',
  },
  {
    id: 'card-consumo',
    nome: 'Redução de Desperdício',
    setId: 'recursos',
    raridade: 'epica',
    descricao: 'Consumo consciente com menos desperdício.',
    icone: '/icons/carrinho.svg',
  },

  // SET GUARDIÕES DA ÁGUA (4 cartas)
  {
    id: 'card-agua',
    nome: 'Economia de Água',
    setId: 'agua',
    raridade: 'comum',
    descricao: 'Reduzir o consumo diário de água.',
    icone: '/icons/agua.svg',
  },
  {
    id: 'card-banho',
    nome: 'Banho Rápido',
    setId: 'agua',
    raridade: 'incomum',
    descricao: 'Tomar banhos curtos e conscientes.',
    icone: '/icons/banho.svg',
  },
  {
    id: 'card-garrafa',
    nome: 'Garrafa Reutilizável',
    setId: 'agua',
    raridade: 'rara',
    descricao: 'Adotar garrafa própria no lugar de descartáveis.',
    icone: '/icons/garrafa.svg',
  },
  {
    id: 'card-captacao',
    nome: 'Captação de Chuva',
    setId: 'agua',
    raridade: 'epica',
    descricao: 'Aproveitar a água da chuva.',
    icone: '/icons/agua.svg',
  },

  // SET CIDADE VERDE (4 cartas)
  {
    id: 'card-bicicleta',
    nome: 'Bicicleta',
    setId: 'cidade-verde',
    raridade: 'comum',
    descricao: 'Pedalar no lugar de usar o carro.',
    icone: '/icons/bicicleta.svg',
  },
  {
    id: 'card-transporte',
    nome: 'Transporte Público',
    setId: 'cidade-verde',
    raridade: 'incomum',
    descricao: 'Priorizar ônibus e metrô.',
    icone: '/icons/transporte.svg',
  },
  {
    id: 'card-mobilidade',
    nome: 'Mobilidade Elétrica',
    setId: 'cidade-verde',
    raridade: 'rara',
    descricao: 'Optar por veículos e patinetes elétricos.',
    icone: '/icons/bateria.svg',
  },
  {
    id: 'card-ciclovia',
    nome: 'Ciclovia',
    setId: 'cidade-verde',
    raridade: 'epica',
    descricao: 'Apoiar e usar infraestrutura cicloviária.',
    icone: '/icons/bicicleta.svg',
  },

  // SET ENERGIA LIMPA (4 cartas)
  {
    id: 'card-energia',
    nome: 'Economia de Energia',
    setId: 'energia-limpa',
    raridade: 'comum',
    descricao: 'Reduzir o consumo de eletricidade em casa.',
    icone: '/icons/energia.svg',
  },
  {
    id: 'card-solar',
    nome: 'Energia Solar',
    setId: 'energia-limpa',
    raridade: 'rara',
    descricao: 'Gerar energia a partir do sol.',
    icone: '/icons/solar.svg',
  },
  {
    id: 'card-eolica',
    nome: 'Energia Eólica',
    setId: 'energia-limpa',
    raridade: 'epica',
    descricao: 'Aproveitar a força dos ventos.',
    icone: '/icons/vento.svg',
  },
  {
    id: 'card-led',
    nome: 'Iluminação Eficiente',
    setId: 'energia-limpa',
    raridade: 'incomum',
    descricao: 'Trocar lâmpadas por modelos eficientes.',
    icone: '/icons/lampada.svg',
  },

  // SET CULTIVO (4 cartas)
  {
    id: 'card-plantio',
    nome: 'Plantio',
    setId: 'cultivo',
    raridade: 'comum',
    descricao: 'Plantar árvores e espécies nativas.',
    icone: '/icons/arvore.svg',
  },
  {
    id: 'card-compostagem',
    nome: 'Compostagem',
    setId: 'cultivo',
    raridade: 'incomum',
    descricao: 'Transformar resíduos orgânicos em adubo.',
    icone: '/icons/compostagem.svg',
  },
  {
    id: 'card-horta',
    nome: 'Horta Doméstica',
    setId: 'cultivo',
    raridade: 'rara',
    descricao: 'Cultivar alimentos em casa.',
    icone: '/icons/vaso.svg',
  },
  {
    id: 'card-agrofloresta',
    nome: 'Agrofloresta',
    setId: 'cultivo',
    raridade: 'lendaria',
    descricao: 'Sistema integrado de cultivo com a floresta.',
    icone: '/icons/arvore.svg',
  },
];

export const MISSION_TO_CARD: Record<string, string> = {
  reciclagem: 'card-reciclagem',
  educar: 'card-reutilizacao',
  sacola: 'card-sacola',
  consumo: 'card-consumo',
  agua: 'card-agua',
  banho: 'card-banho',
  garrafa: 'card-garrafa',
  captacao: 'card-captacao',
  bicicleta: 'card-bicicleta',
  transporte: 'card-transporte',
  mobilidade: 'card-mobilidade',
  ciclovia: 'card-ciclovia',
  energia: 'card-energia',
  solar: 'card-solar',
  eolica: 'card-eolica',
  led: 'card-led',
  plantio: 'card-plantio',
  compostagem: 'card-compostagem',
  horta: 'card-horta',
  agrofloresta: 'card-agrofloresta',
};

// Caminho inverso: carta -> missão, para herdar a cor do grupo da missão.
export const CARD_TO_MISSION: Record<string, string> = Object.fromEntries(
  Object.entries(MISSION_TO_CARD).map(([missaoId, cartaId]) => [cartaId, missaoId]),
);

/**
 * Missões cujas cartas têm a raridade informada.
 * Repetir uma delas é a forma de conseguir fragmentos dessa raridade:
 * a carta repetida vira fragmentos.
 */
export function missoesPorRaridade(raridade: RaridadeCarta): string[] {
  return Object.entries(MISSION_TO_CARD)
    .filter(([, cardId]) => CARTAS.find(c => c.id === cardId)?.raridade === raridade)
    .map(([missaoId]) => missaoId);
}

export function calcularQuimica(totalCartas: number): Quimica {
  switch (totalCartas) {
    case 2:
      return { level: 1, bonusPontos: 0, descricao: 'Nível 1 · Química ativa' };
    case 3:
      return { level: 2, bonusPontos: BONUS_QUIMICA_N2, descricao: `Nível 2 · +${BONUS_QUIMICA_N2} créditos` };
    case 4:
      return { level: 3, bonusPontos: BONUS_QUIMICA_N3, descricao: `Nível 3 · Set completo · +${BONUS_QUIMICA_N3} créditos` };
    default:
      return { level: 0, bonusPontos: 0, descricao: 'Sem química ativa' };
  }
}