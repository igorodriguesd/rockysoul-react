import type { Missao, Selo, Nivel, Recompensa, Parceiro, Amigo, TrilhaEtapa } from '../types';
import { CARD_TO_MISSION } from './cartas';

// Créditos escalam por esforço/comprovação e impacto:
// fácil (declaração/hábito) < leve (foto) < médio (timer/esforço) < alto (GPS/investimento) < máximo (alto impacto)
export const MISSOES: Missao[] = [
  {
    id: 'reciclagem',
    nome: 'Reciclagem',
    pontos: 20,
    icone: '/icons/reciclagem.svg',
    comprovacao: 'foto',
    descricao: 'Separe papel, plástico, metal e vidro do que você descartou e leve ao ecoponto parceiro ou à coleta seletiva.',
    comoValidar: 'Envie uma foto dos materiais recicláveis já separados. Se entregou em um ecoponto, marque a entrega para ganhar o bônus de créditos.',
    comprovantes: [
      'Foto dos materiais recicláveis separados',
      'Nota fiscal ou recibo de entrega no ecoponto (Ferro-Velho do João, Adega do Zé, Recicla Vale)',
      'Comprovante de peso ou valor do material vendido',
    ],
    admiteEcoponto: true,
  },
  {
    id: 'transporte',
    nome: 'Transporte Sustentável',
    pontos: 30,
    icone: '/icons/transporte.svg',
    comprovacao: 'foto-gps',
    descricao: 'Use ônibus, metrô, trem ou van compartilhada no lugar do carro para o trajeto do dia.',
    comoValidar: 'Fotografe o bilhete ou a tela do aplicativo de transporte e capture a localização do trajeto.',
    comprovantes: [
      'Foto do bilhete ou do app de transporte',
      'Recibo da passagem ou da recarga',
      'Print do QR Code com a data do bilhete',
    ],
  },
  {
    id: 'energia',
    nome: 'Economia de Energia',
    pontos: 15,
    icone: '/icons/energia.svg',
    comprovacao: 'foto',
    descricao: 'Desligue aparelhos da tomada, use o ar-condicionado em 23 °C e apague as luzes dos cômodos sem uso.',
    comoValidar: 'Fotografe o medidor de energia ou o aparelho desligado da tomada.',
    comprovantes: [
      'Foto do medidor de energia',
      'Foto do aparelho ou da tomada desligada',
      'Conta de luz antes e depois da ação',
    ],
  },
  {
    id: 'agua',
    nome: 'Economia de Água',
    pontos: 15,
    icone: '/icons/agua.svg',
    comprovacao: 'foto',
    descricao: 'Feche a torneira enquanto escova os dentes, tome banho rápido e conserte vazamentos da casa.',
    comoValidar: 'Fotografe o medidor de água ou a torneira fechada.',
    comprovantes: [
      'Foto do medidor de água',
      'Foto da torneira fechada ou do vazimento reparado',
      'Conta de água antes e depois da ação',
    ],
  },
  {
    id: 'bicicleta',
    nome: 'Pedalar',
    pontos: 30,
    icone: '/icons/bicicleta.svg',
    comprovacao: 'foto-gps',
    descricao: 'Pedale até o trabalho, à faculdade ou ao mercado em vez de ir de carro.',
    comoValidar: 'Fotografe a bicicleta em uso e registre a localização do percurso.',
    comprovantes: [
      'Foto da bicicleta em uso',
      'Print do app de pedal (Strava, Uber Bike, entre outros)',
      'Recibo de diária ou aluguel da bicicleta',
    ],
  },
  {
    id: 'plantio',
    nome: 'Plantar Mudas',
    pontos: 50,
    icone: '/icons/arvore.svg',
    comprovacao: 'foto-gps',
    descricao: 'Plante uma muda nativa no quintal, em área verde da cidade ou em um viveiro parceiro.',
    comoValidar: 'Fotografe a muda plantada e registre a localização do local do plantio.',
    comprovantes: [
      'Foto da muda plantada no local',
      'Nota fiscal ou recibo da floricultura / casa de plantas',
      'Comprovante de adoção ou doação da árvore',
    ],
  },
  {
    id: 'banho',
    nome: 'Banho Rápido',
    pontos: 15,
    icone: '/icons/banho.svg',
    comprovacao: 'timer',
    descricao: 'Limite o banho a 5 minutos e feche a torneira enquanto se ensaboa.',
    comoValidar: 'O cronômetro do app conta os 5 minutos: conclua o desafio dentro do tempo e confirme para validar.',
    comprovantes: [
      'Cronômetro do app concluído dentro do tempo',
      'Print do cronômetro ao chegar a 00:00',
    ],
    tempoTimer: 300,
  },
  {
    id: 'compostagem',
    nome: 'Compostagem',
    pontos: 20,
    icone: '/icons/compostagem.svg',
    comprovacao: 'foto',
    descricao: 'Separe restos de comida, cascas e folhas e leve à composteira caseira ou a um ecoponto de orgânico.',
    comoValidar: 'Fotografe a composteira com o material orgânico. Se entregou em um ecoponto, marque para ganhar o bônus.',
    comprovantes: [
      'Foto da composteira com o material orgânico',
      'Nota fiscal de entrega de orgânico no Recicla Vale',
      'Recibo do serviço de coleta de orgânico',
    ],
    admiteEcoponto: true,
  },
  {
    id: 'consumo',
    nome: 'Consumo Consciente',
    pontos: 15,
    icone: '/icons/carrinho.svg',
    comprovacao: 'foto',
    descricao: 'Compre produtos duráveis e com menos embalagem, e consuma primeiro o que já existe em casa.',
    comoValidar: 'Fotografe o produto ou a nota fiscal da compra consciente.',
    comprovantes: [
      'Nota fiscal do mercado',
      'Foto do produto ou da embalagem reduzida',
      'Recibo de compra no Mercado Consciente',
    ],
  },
  {
    id: 'garrafa',
    nome: 'Garrafa Reutilizável',
    pontos: 5,
    icone: '/icons/garrafa.svg',
    comprovacao: 'declaracao',
    descricao: 'Leve uma garrafa reutilizável para água ou bebida em vez de usar descartável.',
    comoValidar: 'Confirme na caixa abaixo que você usou a garrafa hoje. Valida uma vez por dia.',
    comprovantes: [
      'Declaração de uso na caixa abaixo',
      'Foto da garrafa ou do copo reutilizável',
      'Nota fiscal do mercado com a recarga',
    ],
  },
  {
    id: 'educar',
    nome: 'Compartilhar Dicas',
    pontos: 5,
    icone: '/icons/comunidade.svg',
    comprovacao: 'declaracao',
    descricao: 'Compartilhe uma dica de sustentabilidade com amigos, na escola ou nas redes sociais.',
    comoValidar: 'Confirme na caixa abaixo que você compartilhou a dica hoje. Valida uma vez por dia.',
    comprovantes: [
      'Declaração de compartilhamento na caixa abaixo',
      'Print da publicação ou do story',
      'Print da conversa em que a dica foi enviada',
    ],
  },
  {
    id: 'sacola',
    nome: 'Sacola Reutilizável',
    pontos: 3,
    icone: '/icons/sacola.svg',
    comprovacao: 'declaracao',
    descricao: 'Use sacola reutilizável na feira, no mercado e em qualquer compra do dia.',
    comoValidar: 'Confirme na caixa abaixo que você usou a sacola hoje. Valida uma vez por dia.',
    comprovantes: [
      'Declaração de uso na caixa abaixo',
      'Foto da sacola reutilizável na compra',
      'Nota fiscal do mercado',
    ],
  },
  {
    id: 'captacao',
    nome: 'Captação de Água da Chuva',
    pontos: 25,
    icone: '/icons/agua.svg',
    comprovacao: 'foto',
    descricao: 'Use a água da chuva para regar o jardim e limpar a casa, com calha ou cisterna.',
    comoValidar: 'Fotografe o sistema de captação com a água acumulada.',
    comprovantes: [
      'Foto da calha, cisterna ou caixa d’água com a água acumulada',
      'Nota fiscal da casa de materiais de construção',
      'Recibo da instalação da calha ou do reservatório',
    ],
  },
  {
    id: 'mobilidade',
    nome: 'Mobilidade Elétrica',
    pontos: 30,
    icone: '/icons/bateria.svg',
    comprovacao: 'foto-gps',
    descricao: 'Troque o carro a gasolina por veículo elétrico, patinete elétrico ou bicicleta elétrica.',
    comoValidar: 'Fotografe o veículo elétrico e registre a localização do percurso ou da recarga.',
    comprovantes: [
      'Foto do veículo elétrico',
      'Recibo ou comprovante da recarga',
      'Nota fiscal do patinete, da bicicleta elétrica ou do carregador',
    ],
  },
  {
    id: 'ciclovia',
    nome: 'Indicar Defeito em Ciclovia',
    pontos: 20,
    icone: '/icons/bicicleta.svg',
    comprovacao: 'foto-gps',
    descricao: 'Encontre um problema na ciclovia da sua rua (trancheira, buraco, sinalização) e reporte à prefeitura.',
    comoValidar: 'Fotografe o defeito e registre a localização exata do problema na via.',
    comprovantes: [
      'Foto do defeito na ciclovia',
      'Print do protocolo da solicitação aberta na prefeitura',
      'Print do e-mail ou da mensagem enviada à cidade',
    ],
  },
  {
    id: 'solar',
    nome: 'Energia Solar',
    pontos: 40,
    icone: '/icons/solar.svg',
    comprovacao: 'foto',
    descricao: 'Instale painéis solares ou use geração solar para parte da energia da sua casa.',
    comoValidar: 'Fotografe a instalação solar ou a fatura de energia com a parcela solar.',
    comprovantes: [
      'Foto da instalação solar',
      'Nota fiscal do kit solar ou do instalador',
      'Conta de luz com a parcela solar',
    ],
  },
  {
    id: 'eolica',
    nome: 'Energia Eólica',
    pontos: 20,
    icone: '/icons/vento.svg',
    comprovacao: 'foto',
    descricao: 'Contrate energia renovável de fonte eólica ou instale um pequeno gerador eólico.',
    comoValidar: 'Fotografe a fatura de energia com a bandeira renovável ou o gerador em funcionamento.',
    comprovantes: [
      'Foto do gerador ou da turbina',
      'Conta de luz com a bandeira renovável',
      'Contrato de energia renovável',
    ],
  },
  {
    id: 'led',
    nome: 'Iluminação Eficiente',
    pontos: 10,
    icone: '/icons/lampada.svg',
    comprovacao: 'foto',
    descricao: 'Troque as lâmpadas incandescentes por lâmpadas LED de alta eficiência energética.',
    comoValidar: 'Fotografe a nova lâmpada LED já instalada no lugar da antiga.',
    comprovantes: [
      'Foto da lâmpada LED instalada',
      'Nota fiscal da casa de materiais de construção',
      'Recibo da loja de material elétrico',
    ],
  },
  {
    id: 'horta',
    nome: 'Horta Doméstica',
    pontos: 35,
    icone: '/icons/vaso.svg',
    comprovacao: 'foto',
    descricao: 'Monte uma horta em vasos ou canteiro e cultive verduras, temperos ou legumes.',
    comoValidar: 'Fotografe a horta com as plantas em crescimento.',
    comprovantes: [
      'Foto da horta com as plantas em crescimento',
      'Nota fiscal da floricultura / casa de plantas (mudas, substrato)',
      'Recibo de sementes e insumos',
    ],
  },
  {
    id: 'agrofloresta',
    nome: 'Financiar Reflorestamento',
    pontos: 70,
    icone: '/icons/arvore.svg',
    comprovacao: 'foto',
    descricao: 'Financie ou plante uma área de reflorestamento com espécies nativas da região.',
    comoValidar: 'Fotografe o comprovante da contribuição ou o local do plantio com as mudas nativas.',
    comprovantes: [
      'Comprovante da contribuição (doação, assinatura ou pagamento)',
      'Nota fiscal ou recibo do viveiro / projeto de reflorestamento',
      'Foto do local com as mudas nativas',
    ],
  },
];

// Padrão visual por tema: mesma cor para ícone, "+x pontos" e status.
// Os grupos reúnem os `temas` dos parceiros sponsors, então cor = tema.
// `texto` é a variante escura da mesma cor, legível sobre fundo claro.
export const GRUPOS_MISSAO: { id: string; label: string; cor: string; texto: string; ids: string[] }[] = [
  { id: 'energia', label: 'Energia e Consumo', cor: '#f5c451', texto: '#a16207', ids: ['energia', 'solar', 'eolica', 'led', 'consumo', 'sacola', 'educar'] },
  { id: 'agua', label: 'Água e Mobilidade', cor: '#38bdf8', texto: '#0369a1', ids: ['agua', 'captacao', 'banho', 'garrafa', 'transporte', 'bicicleta', 'mobilidade', 'ciclovia'] },
  { id: 'natureza', label: 'Natureza', cor: '#22c55e', texto: '#15803d', ids: ['plantio', 'horta', 'agrofloresta', 'reciclagem', 'compostagem'] },
];

export function grupoDaMissao(missaoId: string) {
  return GRUPOS_MISSAO.find(g => g.ids.includes(missaoId)) ?? GRUPOS_MISSAO[0];
}

// Cartas herdam a cor do grupo da missão que as origina.
export function grupoDaCarta(cartaId: string) {
  const missaoId = CARD_TO_MISSION[cartaId];
  return missaoId ? grupoDaMissao(missaoId) : undefined;
}


export const CO2_POR_MISSAO: Record<string, number> = {
  reciclagem: 2.5,
  transporte: 3.0,
  energia: 1.5,
  agua: 0.8,
  bicicleta: 4.0,
  plantio: 8.0,
  banho: 0.5,
  compostagem: 2.0,
  consumo: 1.2,
  garrafa: 0.6,
  educar: 0.4,
  sacola: 0.5,
  captacao: 1.0,
  mobilidade: 2.5,
  ciclovia: 2.0,
  solar: 3.5,
  eolica: 3.5,
  led: 0.8,
  horta: 3.0,
  agrofloresta: 6.0,
};

export const SELOS: Selo[] = [
  { id: 'broto', nome: 'Broto', descricao: 'Primeiros passos sustentáveis', icone: '/icons/folha.svg', minPontos: 0 },
  { id: 'semente', nome: 'Semente', descricao: 'Crescendo a cada ação', icone: '/icons/semente.svg', minPontos: 500 },
  { id: 'arvore', nome: 'Árvore', descricao: 'Impacto real no planeta', icone: '/icons/arvore.svg', minPontos: 1200 },
  { id: 'floresta', nome: 'Floresta', descricao: 'Guardiã do meio ambiente', icone: '/icons/floresta.svg', minPontos: 2000 },
];

export const NIVEIS: Nivel[] = [
  { nome: 'Broto', min: 0, max: 499 },
  { nome: 'Semente', min: 500, max: 1199 },
  { nome: 'Árvore', min: 1200, max: 1999 },
  { nome: 'Floresta', min: 2000, max: Infinity },
];

export const TRILHA_EVOLUCAO: TrilhaEtapa[] = [
  { nome: 'Broto', icone: '/icons/folha.svg', emoji: '🌱', minXP: 0, bonusCreditos: 50, recompensa: '+50 créditos de boas-vindas', desbloqueio: 'Seus primeiros sets de cartas', explicacao: 'Todo impacto começa pequeno — a primeira ação já te coloca aqui.' },
  { nome: 'Semente', icone: '/icons/semente.svg', emoji: '🌿', minXP: 500, bonusCreditos: 100, recompensa: '+100 créditos', desbloqueio: 'Cartas novas e o set Guardiões da Água', explicacao: '500 créditos acumulados: sua rotina já faz a ilha respirar melhor.' },
  { nome: 'Árvore', icone: '/icons/arvore.svg', emoji: '🌳', minXP: 1200, bonusCreditos: 200, recompensa: '+200 créditos', desbloqueio: 'Cartas raras e o set Energia Limpa', explicacao: '1.200 créditos: o impacto real começa a proteger o planeta.' },
  { nome: 'Floresta', icone: '/icons/floresta.svg', emoji: '🌎', minXP: 2000, bonusCreditos: 400, recompensa: '+400 créditos e selo exclusivo', desbloqueio: 'Todas as cartas, o set Cultivo e o selo Floresta', explicacao: '2.000 créditos: você é uma verdadeira guardiã do planeta.' },
];

/** Bônus de boas-vindas: creditado na primeira ação do usuário. */
export const BONUS_BOAS_VINDAS = TRILHA_EVOLUCAO[0].bonusCreditos;

/** Índice da etapa da trilha que corresponde a um total de créditos acumulados. */
export function indiceEtapaPorPontos(pontos: number): number {
  let idx = 0;
  TRILHA_EVOLUCAO.forEach((etapa, i) => {
    if (pontos >= etapa.minXP) idx = i;
  });
  return idx;
}

export function nomeNivelPorPontos(pontos: number): string {
  for (const nivel of NIVEIS) {
    if (pontos >= nivel.min && pontos <= nivel.max) return nivel.nome;
  }
  return NIVEIS[NIVEIS.length - 1].nome;
}

export const CREDITOS_POR_REAL = 100;

export const PARCEIROS: Parceiro[] = [
  { id: 'p-adega', nome: 'Adega do Zé', tipos: ['ecoponto'], cor: '#eab308', localizacao: 'Centro', descricao: 'Recebe vidro, garrafas e retornáveis.', impactoBase: { creditos: 12800, cortesias: 186 }, valorCortesiaReal: 6 },
  { id: 'p-ferro', nome: 'Ferro-Velho do João', tipos: ['ecoponto'], cor: '#94a3b8', localizacao: 'Zona Norte', descricao: 'Recebe metais, eletrônicos e sucata.', impactoBase: { creditos: 19600, cortesias: 142 }, valorCortesiaReal: 5 },
  { id: 'p-reciclava', nome: 'Recicla Vale', tipos: ['patrocinador', 'ecoponto'], cor: '#22c55e', localizacao: 'Zona Sul', descricao: 'Recebe papel, plástico e orgânico compostável.', temas: ['reciclagem', 'compostagem'], impactoBase: { creditos: 34400, cortesias: 268 }, valorCortesiaReal: 7 },
  { id: 'p-cafe', nome: 'Café do Vale', tipos: ['voucher'], cor: '#b45309', localizacao: 'Centro', descricao: 'Cortesia de café para quem faz a diferença.', impactoBase: { creditos: 33000, cortesias: 415 }, valorCortesiaReal: 8 },
  { id: 'p-doce', nome: 'Doce da Dona Neide', tipos: ['voucher'], cor: '#db2777', localizacao: 'Zona Leste', descricao: 'Doce artesanal que premia o impacto.', impactoBase: { creditos: 27200, cortesias: 268 }, valorCortesiaReal: 6 },
  { id: 'p-cicloverde', nome: 'CicloVerde Bikes', tipos: ['patrocinador', 'ecoponto'], cor: '#38bdf8', localizacao: 'Zona Oeste', descricao: 'Patrocina mobilidade e recebe baterias de e-bike e eletrônicos.', temas: ['bicicleta', 'transporte', 'mobilidade', 'ciclovia'], impactoBase: { creditos: 9200, cortesias: 96 }, valorCortesiaReal: 9 },
  { id: 'p-renova', nome: 'Renova Energia', tipos: ['patrocinador'], cor: '#f5c451', localizacao: 'Nacional', descricao: 'Patrocina as missões de eficiência energética.', temas: ['energia', 'solar', 'eolica', 'led'], impactoBase: { creditos: 15400, cortesias: 204 }, valorCortesiaReal: 10 },
  { id: 'p-aguaviva', nome: 'Água Viva', tipos: ['patrocinador'], cor: '#38bdf8', localizacao: 'Nacional', descricao: 'Patrocina as missões de economia de água.', temas: ['agua', 'banho', 'captacao', 'garrafa'], impactoBase: { creditos: 12850, cortesias: 177 }, valorCortesiaReal: 10 },
  { id: 'p-verdecult', nome: 'Verde Cultivo', tipos: ['patrocinador'], cor: '#22c55e', localizacao: 'Rural', descricao: 'Patrocina plantio e agroflorestas.', temas: ['plantio', 'horta', 'agrofloresta'], impactoBase: { creditos: 9600, cortesias: 88 }, valorCortesiaReal: 12 },
  { id: 'p-consciente', nome: 'Mercado Consciente', tipos: ['patrocinador'], cor: '#f5c451', localizacao: 'Zona Leste', descricao: 'Patrocina consumo consciente e hábitos do dia a dia.', temas: ['consumo', 'educar', 'sacola'], impactoBase: { creditos: 8300, cortesias: 132 }, valorCortesiaReal: 8 },
];

type CamposCortesia = {
  id: string;
  nome: string;
  descricao: string;
  categoria: Recompensa['categoria'];
  icone: string;
  badge?: Recompensa['badge'];
};

function recompensaCortesia(parceiroId: string, campos: CamposCortesia): Recompensa {
  const valorReal = PARCEIROS.find(p => p.id === parceiroId)?.valorCortesiaReal ?? 0;
  return {
    ...campos,
    pontos: Math.round(valorReal * CREDITOS_POR_REAL),
    valorReal,
    parceiroId,
  };
}

export const RECOMPENSAS: Recompensa[] = [
  { id: 'r1', nome: 'Desconto Energia', descricao: '10% de desconto na conta de energia', pontos: 2000, valorReal: 20, categoria: 'Energia', icone: '/icons/lampada.svg', badge: 'Novo', parceiroId: 'p-renova' },
  { id: 'r2', nome: 'Passe de Transporte', descricao: 'Um passe livre de transporte público', pontos: 540, valorReal: 5.4, categoria: 'Transporte', icone: '/icons/transporte.svg' },
  { id: 'r3', nome: 'Muda de Árvore', descricao: 'Receba uma muda para plantar', pontos: 2000, valorReal: 20, categoria: 'Natureza', icone: '/icons/arvore.svg', badge: 'Top 1', parceiroId: 'p-verdecult' },
  { id: 'r4', nome: 'Cupom Reciclagem', descricao: 'Cupom de desconto em lojas parceiras', pontos: 1000, valorReal: 10, categoria: 'Cupons', icone: '/icons/carrinho.svg', parceiroId: 'p-reciclava' },
  { id: 'r5', nome: 'Kit Sustentável', descricao: 'Kit com canudo reutilizável e sacola ecológica', pontos: 2000, valorReal: 20, categoria: 'Natureza', icone: '/icons/sacola.svg', parceiroId: 'p-consciente' },
  { id: 'r6', nome: 'Desconto Água', descricao: '5% de desconto na conta de água', pontos: 800, valorReal: 8, categoria: 'Natureza', icone: '/icons/agua.svg', parceiroId: 'p-aguaviva' },
  { id: 'r7', nome: 'Cupom Bicicleta', descricao: 'Cupom de desconto em bicicletarias', pontos: 2000, valorReal: 20, categoria: 'Transporte', icone: '/icons/bicicleta.svg', parceiroId: 'p-cicloverde' },
  { id: 'r8', nome: 'Adoção de Árvore', descricao: 'Adote uma árvore real por 3 meses', pontos: 2500, valorReal: 25, categoria: 'Natureza', icone: '/icons/arvore.svg', badge: 'Top 1' },
  recompensaCortesia('p-cafe', { id: 'r9', nome: 'Café Cortesia', descricao: 'Um café grátis no Café do Vale', categoria: 'Parceiros', icone: '/icons/cafe.svg', badge: 'Cortesia' }),
  recompensaCortesia('p-doce', { id: 'r10', nome: 'Doce Artesanal', descricao: 'Doce da Dona Neide para alegrar o dia', categoria: 'Parceiros', icone: '/icons/doce.svg', badge: 'Cortesia' }),
  recompensaCortesia('p-adega', { id: 'r11', nome: 'Cupom Adega do Zé', descricao: '10% off em garrafas retornáveis e vidros', categoria: 'Parceiros', icone: '/icons/garrafa.svg', badge: 'Cortesia' }),
  recompensaCortesia('p-ferro', { id: 'r12', nome: 'Descarte de Eletrônicos', descricao: 'Descarte grátis de sucata eletrônica no Ferro-Velho do João', categoria: 'Parceiros', icone: '/icons/bateria.svg', badge: 'Cortesia' }),
];

export function getParceiro(id: string): Parceiro | undefined {
  return PARCEIROS.find(p => p.id === id);
}

export const AMIGOS_SIMULADOS: Amigo[] = [
  { nome: 'Ana Silva', codigo: 'ANA-SILVA-01', pontos: 620, streak: 6 },
  { nome: 'Carlos Souza', codigo: 'CARLOS-02', pontos: 210, streak: 3 },
  { nome: 'Maria Oliveira', codigo: 'MARIAO-03', pontos: 1320, streak: 11 },
  { nome: 'Pedro Santos', codigo: 'PEDROS-04', pontos: 75, streak: 1 },
  { nome: 'Julia Costa', codigo: 'JULIAC-05', pontos: 405, streak: 5 },
  { nome: 'Lucas Almeida', codigo: 'LUCASA-06', pontos: 1560, streak: 14 },
];

export function gerarCodigoAmigo(nome: string): string {
  const limpo = nome.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!limpo) return 'RS-VOCE-00';
  const base = limpo.length > 8 ? limpo.slice(0, 8) : limpo;
  return `RS-${base}`;
}

export function buscarAmigoPorCodigo(codigo: string): Amigo | undefined {
  const alvo = codigo.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!alvo) return undefined;
  return AMIGOS_SIMULADOS.find(a => a.codigo.toUpperCase().replace(/[^A-Z0-9]/g, '') === alvo);
}

export const CURIOSIDADES: string[] = [
  'Reciclar uma latinha de alumínio economiza energia suficiente para ligar uma TV por 3 horas!',
  'Tomar banho de 5 minutos pode economizar até 40 litros de água por dia.',
  'Usar bicicleta em vez de carro evita a emissão de 150g de CO2 por km percorrido.',
  'Uma árvore jovem absorve cerca de 22kg de CO2 por ano.',
  'Desligar aparelhos da tomada quando não estão em uso pode reduzir a conta de energia em até 10%.',
  'Reciclar uma bateria de carro ou bicicleta elétrica reaproveita até 95% do lítio e dos metais — e elas têm pontos de coleta próprios, como os ecopontos parceiros.',
];

export const PERGUNTAS_FAQ: { pergunta: string; resposta: string }[] = [
  { pergunta: 'Como ganhar créditos?', resposta: 'Toda ação sustentável registrada (reciclar, usar transporte público, economizar água e energia, pedalar, plantar mudas) rende créditos — a moeda do app, gasta em recompensas e Pix. Cada ação tem um valor diferente!' },
  { pergunta: 'O que é o avatar inteligente?', resposta: 'O avatar inteligente é um assistente virtual que ajuda você a acompanhar seu progresso, sugere ações sustentáveis e responde dúvidas sobre sustentabilidade e gamificação.' },
  { pergunta: 'Como funciona o ranking?', resposta: 'Na sua comunidade, você adiciona amigos por código e cada um aparece com créditos, nível e sequência de dias — comparando quem faz mais diferença. Fora isso, um ranking de empresas parceiras mostra quem mais movimenta créditos e concede cortesias; suas entregas e resgates fazem essas empresas subirem de posição.' },
  { pergunta: 'Preciso fazer a verificação por foto?', resposta: 'Depende da missão. Ao tocar na missão você vê o que precisa fazer e como validar: algumas pedem foto, outras foto + GPS, algumas usam cronômetro e as mais simples pedem apenas uma declaração. A foto pode ser do item, da nota fiscal ou do recibo do estabelecimento (mercado, casa de materiais de construção, floricultura, ferro-velho, ecoponto) — a tela da missão lista os comprovantes aceitos. Nas missões marcadas com GPS a localização é obrigatória; nas demais ela é opcional e ajuda a fortalecer a validação.' },
  { pergunta: 'Como funciona o sistema de níveis?', resposta: 'Seu nível evolui conforme os créditos acumulados (eles nunca diminuem): Broto (0-499), Semente (500-1199), Árvore (1200-1999) e Floresta (2000+). Cada nível desbloqueia novos sets de cartas e selos e paga um bônus em créditos: +50 de boas-vindas na primeira ação, +100 na Semente, +200 na Árvore e +400 na Floresta.' },
  { pergunta: 'Como converter créditos em dinheiro?', resposta: 'Créditos são a moeda da plataforma. No conversor da página de Recompensas, você informa a quantidade de créditos (mínimo de 500) e sua chave Pix para receber o valor: a cada 100 créditos, você recebe R$1,00.' },
  { pergunta: 'Posso resgatar recompensas várias vezes?', resposta: 'Sim, desde que tenha créditos suficientes. Cada recompensa tem um custo em créditos. Ao resgatar, os créditos são descontados do seu saldo e o resgate fica registrado no seu histórico.' },
  { pergunta: 'Qual a diferença entre créditos e XP?', resposta: 'Só existe uma unidade no app: o crédito. Você ganha créditos a cada ação e gasta em recompensas ou em giros extras na roleta, ou converte em dinheiro via Pix (100 créditos = R$1,00). Para evoluir de nível, olhe o total de créditos que você já ganhou — ele só acumula e nunca diminui, mesmo que você gaste. Gastar créditos não reduz seu nível.' },
  { pergunta: 'O que são cartas, sets e "química"?', resposta: 'Cada ação registrada pode soltar uma carta colecionável. As cartas estão organizadas em 5 sets: Recursos e Cidade Verde (liberados desde o início), Guardiões da Água (nível Semente · 500 créditos), Energia Limpa (Árvore · 1.200) e Cultivo (Floresta · 2.000). Quando você reúne 4 cartas de um set, ativa a "química": +30 créditos na 3ª carta e +150 na 4ª. Tudo isso acontece na página Coleção.' },
  { pergunta: 'O que é uma carta "brilhante" (foil)?', resposta: 'A foil é a versão especial e mais valiosa da carta: vale 3× os créditos da normal. Ao ganhar uma carta nova, ela tem 8% de chance de já vir brilhante; se você já tem a carta, a repetida tem 8% de chance de evoluir para brilhante em vez de virar fragmentos.' },
  { pergunta: 'O que são "fragmentos" e a "Fábrica de Cartas"?', resposta: 'Fragmentos são a moeda de montar cartas: cada carta repetida vira fragmentos da raridade dela (comum +3, incomum +5, rara +10, épica +20, lendária +40). Na aba "Fábrica" da Coleção você usa fragmentos para montar exatamente a carta que ainda não tem — sem depender de sorte. Eles não servem só para fechar o set: qualquer carta de qualquer set já liberado pode ser fabricada, e você também pode clicar direto na carta que falta na aba "Minhas cartas".' },
  { pergunta: 'O que significam "streak", "combo" e "roleta"?', resposta: '"Streak" (sequência) é quantos dias seguidos você registrou ações — manter a sequência diária é uma forma de ganhar mais. "Combo" é quando você encadeia ações no Mini-jogo de separação de resíduos para multiplicar a pontuação. Já a "roleta" aparece ao validar uma missão: o giro da carta é grátis e você pode pagar um giro extra (5 créditos para carta comum até 30 para lendária) para tentar de novo.' },
  { pergunta: 'Como a economia de créditos é financiada?', resposta: 'A plataforma é gratuita para quem pratica e se sustenta por parcerias: ecopontos credenciados (como a Adega do Zé e o Ferro-Velho do João) pagam por cada entrega comprovada, patrocinadores bancam o Desafio do Dia (como a CicloVerde Bikes), e parceiros oferecem cortesias na loja de recompensas. As conversões em Pix são liquidadas por essa verba de parcerias — assim o financiamento cresce junto com o impacto real de cada usuário.' },
];

export const INTEGRANTES = [
  { nome: 'Igor Rodrigues de Santana', rm: 'RM570651', foto: '/imagens/igor.jpg', github: 'https://github.com/igorodriguesd', linkedin: 'https://linkedin.com/in/igor-rodrigues-135aa72b2' },
  { nome: 'Diego Gomes Goncalves de Lima', rm: 'RM570335', foto: '/imagens/diego.jpg', github: 'https://github.com/dgxls', linkedin: 'https://www.linkedin.com/in/diego-gomes-65339b408/' },
  { nome: 'Miguel Silva', rm: 'RM572019', foto: '/imagens/miguel.jpg', github: 'https://github.com/miguelsilva71', linkedin: 'https://www.linkedin.com/in/miguel-silva-0a20073a9/' },
  { nome: 'Rafael Santos Mendonça Costa', rm: 'RM572368', foto: '/imagens/rafael.jpg', github: 'https://github.com/rafaelSantos56', linkedin: 'https://www.linkedin.com/in/rafael-santos-b09bba237/' },
  { nome: 'Pedro Henrique Salvatore', rm: 'RM572999', foto: '/imagens/pedro.jpg', github: 'https://github.com/Pedro-H-Salvatore', linkedin: 'https://www.linkedin.com/in/pedro-salvatore-a4a2763b7' },
];

export const MIN_CREDITOS_CONVERSAO = 500;

export const BONUS_ECOPONTO = 8;

// Cada ação validada soma impacto ao parceiro que patrocina a missão.
export const BONUS_ACAO_PARCEIRO = 1;
