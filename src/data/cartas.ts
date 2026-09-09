import type { Carta, RaridadeCarta, SetCarta, Quimica } from '../types';

export const CHANCE_DROP_POR_RARIDADE: Record<RaridadeCarta, number> = {
  comum: 75,
  incomum: 55,
  rara: 35,
  epica: 20,
  lendaria: 10,
};

export const CHANCE_FOIL = 8;

export const VALOR_POR_RARIDADE: Record<RaridadeCarta, number> = {
  comum: 8,
  incomum: 15,
  rara: 30,
  epica: 60,
  lendaria: 120,
};

export const FRAGMENTOS_POR_DUPLICADA: Record<RaridadeCarta, number> = {
  comum: 3,
  incomum: 5,
  rara: 10,
  epica: 20,
  lendaria: 40,
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
  return VALOR_POR_RARIDADE[carta.raridade] * (foil ? 3 : 1);
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
    cor: '#20d968',
  },
  {
    id: 'agua',
    nome: 'Guardiões da Água',
    icone: '/icons/agua.svg',
    tema: 'Preservação hídrica',
    descricao: 'Economia de água, banho rápido, garrafa reutilizável e captação de chuva.',
    cor: '#38bdf8',
  },
  {
    id: 'cidade-verde',
    nome: 'Cidade Verde',
    icone: '/icons/transporte.svg',
    tema: 'Sustentabilidade urbana',
    descricao: 'Bicicleta, transporte público, mobilidade elétrica e ciclovias.',
    cor: '#4ade80',
  },
  {
    id: 'energia-limpa',
    nome: 'Energia Limpa',
    icone: '/icons/energia.svg',
    tema: 'Fontes renováveis',
    descricao: 'Economia de energia, solar, eólica e iluminação eficiente.',
    cor: '#f5c451',
  },
  {
    id: 'cultivo',
    nome: 'Cultivo',
    icone: '/icons/muda.svg',
    tema: 'Agricultura sustentável',
    descricao: 'Plantio, compostagem, horta doméstica e agrofloresta.',
    cor: '#8be28b',
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
    educativa: 'A reciclagem reduz o volume de lixo em aterros e economiza matéria-prima e energia.',
    icone: '/icons/reciclagem.svg',
  },
  {
    id: 'card-reutilizacao',
    nome: 'Reutilização',
    setId: 'recursos',
    raridade: 'incomum',
    descricao: 'Dar nova vida a objetos e compartilhar dicas.',
    educativa: 'Reutilizar prolonga a vida útil dos produtos e reduz a necessidade de fabricar novos.',
    icone: '/icons/folha.svg',
  },
  {
    id: 'card-sacola',
    nome: 'Sacola Reutilizável',
    setId: 'recursos',
    raridade: 'rara',
    descricao: 'Usar sacolas ecológicas no lugar das descartáveis.',
    educativa: 'Uma sacola reutilizável pode substituir centenas de sacolas plásticas ao longo da vida.',
    icone: '/icons/folha.svg',
  },
  {
    id: 'card-consumo',
    nome: 'Redução de Desperdício',
    setId: 'recursos',
    raridade: 'epica',
    descricao: 'Consumo consciente com menos desperdício.',
    educativa: 'Cerca de 1/3 de toda a comida produzida no mundo é desperdiçada. Comprar só o necessário evita esse impacto.',
    icone: '/icons/carrinho.svg',
  },

  // SET GUARDIÕES DA ÁGUA (4 cartas)
  {
    id: 'card-agua',
    nome: 'Economia de Água',
    setId: 'agua',
    raridade: 'comum',
    descricao: 'Reduzir o consumo diário de água.',
    educativa: 'Fechar a torneira ao escovar os dentes economiza até 12 litros de água por minuto.',
    icone: '/icons/agua.svg',
  },
  {
    id: 'card-banho',
    nome: 'Banho Rápido',
    setId: 'agua',
    raridade: 'incomum',
    descricao: 'Tomar banhos curtos e conscientes.',
    educativa: 'Um banho de 5 minutos pode economizar até 40 litros de água por dia.',
    icone: '/icons/banho.svg',
  },
  {
    id: 'card-garrafa',
    nome: 'Garrafa Reutilizável',
    setId: 'agua',
    raridade: 'rara',
    descricao: 'Adotar garrafa própria no lugar de descartáveis.',
    educativa: 'Garrafas reutilizáveis evitam toneladas de plástico e mantêm a hidratação sustentável.',
    icone: '/icons/agua.svg',
  },
  {
    id: 'card-captacao',
    nome: 'Captação de Chuva',
    setId: 'agua',
    raridade: 'epica',
    descricao: 'Aproveitar a água da chuva.',
    educativa: 'Sistemas simples de captação podem abastecer até 50% do consumo de água da casa.',
    icone: '/icons/agua.svg',
  },

  // SET CIDADE VERDE (4 cartas)
  {
    id: 'card-bicicleta',
    nome: 'Bicicleta',
    setId: 'cidade-verde',
    raridade: 'comum',
    descricao: 'Pedalar no lugar de usar o carro.',
    educativa: 'Cada km pedalado evita cerca de 150g de CO2 se comparado ao carro.',
    icone: '/icons/bicicleta.svg',
  },
  {
    id: 'card-transporte',
    nome: 'Transporte Público',
    setId: 'cidade-verde',
    raridade: 'incomum',
    descricao: 'Priorizar ônibus e metrô.',
    educativa: 'Transporte coletivo emite até 5x menos CO2 por passageiro do que o carro individual.',
    icone: '/icons/transporte.svg',
  },
  {
    id: 'card-mobilidade',
    nome: 'Mobilidade Elétrica',
    setId: 'cidade-verde',
    raridade: 'rara',
    descricao: 'Optar por veículos e patinetes elétricos.',
    educativa: 'Veículos elétricos não emitem poluentes locais e são mais eficientes energeticamente.',
    icone: '/icons/bateria.svg',
  },
  {
    id: 'card-ciclovia',
    nome: 'Ciclovia',
    setId: 'cidade-verde',
    raridade: 'epica',
    descricao: 'Apoiar e usar infraestrutura cicloviária.',
    educativa: 'Cidades com boas ciclovias têm menos congestionamento, ruas mais seguras e ar mais limpo.',
    icone: '/icons/transporte.svg',
  },

  // SET ENERGIA LIMPA (4 cartas)
  {
    id: 'card-energia',
    nome: 'Economia de Energia',
    setId: 'energia-limpa',
    raridade: 'comum',
    descricao: 'Reduzir o consumo de eletricidade em casa.',
    educativa: 'Desligar aparelhos da tomada pode reduzir a conta de energia em até 10%.',
    icone: '/icons/energia.svg',
  },
  {
    id: 'card-solar',
    nome: 'Energia Solar',
    setId: 'energia-limpa',
    raridade: 'rara',
    descricao: 'Gerar energia a partir do sol.',
    educativa: 'Uma placa solar residencial pode zerar a conta de luz e evitar centenas de kg de CO2 por ano.',
    icone: '/icons/energia.svg',
  },
  {
    id: 'card-eolica',
    nome: 'Energia Eólica',
    setId: 'energia-limpa',
    raridade: 'epica',
    descricao: 'Aproveitar a força dos ventos.',
    educativa: 'A energia eólica já é uma das fontes mais baratas e limpas do mundo.',
    icone: '/icons/energia.svg',
  },
  {
    id: 'card-led',
    nome: 'Iluminação Eficiente',
    setId: 'energia-limpa',
    raridade: 'incomum',
    descricao: 'Trocar lâmpadas por modelos eficientes.',
    educativa: 'Lâmpadas de LED consomem até 80% menos energia e duram muito mais.',
    icone: '/icons/bateria.svg',
  },

  // SET CULTIVO (4 cartas)
  {
    id: 'card-plantio',
    nome: 'Plantio',
    setId: 'cultivo',
    raridade: 'comum',
    descricao: 'Plantar árvores e espécies nativas.',
    educativa: 'Uma árvore jovem absorve cerca de 22kg de CO2 por ano.',
    icone: '/icons/arvore.svg',
  },
  {
    id: 'card-compostagem',
    nome: 'Compostagem',
    setId: 'cultivo',
    raridade: 'incomum',
    descricao: 'Transformar resíduos orgânicos em adubo.',
    educativa: 'A compostagem devolve nutrientes ao solo e reduz em até 50% o lixo orgânico doméstico.',
    icone: '/icons/muda.svg',
  },
  {
    id: 'card-horta',
    nome: 'Horta Doméstica',
    setId: 'cultivo',
    raridade: 'rara',
    descricao: 'Cultivar alimentos em casa.',
    educativa: 'Hortas caseiras produzem alimento limpo e reduzem a distância entre produção e consumo.',
    icone: '/icons/muda.svg',
  },
  {
    id: 'card-agrofloresta',
    nome: 'Agrofloresta',
    setId: 'cultivo',
    raridade: 'lendaria',
    descricao: 'Sistema integrado de cultivo com a floresta.',
    educativa: 'Agroflorestas combinam produção de alimentos com conservação da biodiversidade e do solo.',
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

export function calcularQuimica(totalCartas: number): Quimica {
  switch (totalCartas) {
    case 2:
      return { level: 1, bonusPontos: 0, descricao: 'Nível 1 · Química ativa' };
    case 3:
      return { level: 2, bonusPontos: 30, descricao: 'Nível 2 · +30 pontos de bônus' };
    case 4:
      return { level: 3, bonusPontos: 150, descricao: 'Nível 3 · Set completo · +150 pontos' };
    default:
      return { level: 0, bonusPontos: 0, descricao: 'Sem química ativa' };
  }
}