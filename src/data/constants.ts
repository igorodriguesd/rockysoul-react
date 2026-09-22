import type { Missao, Selo, Nivel, Recompensa, UsuarioSimulado, Parceiro, Amigo } from '../types';

// Créditos escalam por esforço/comprovação e impacto:
// fácil (declaração/hábito) < leve (foto) < médio (timer/esforço) < alto (GPS/investimento) < máximo (alto impacto)
export const MISSOES: Missao[] = [
  { id: 'reciclagem', nome: 'Reciclagem', pontos: 20, icone: '/icons/reciclagem.svg', comprovacao: 'foto', admiteEcoponto: true },
  { id: 'transporte', nome: 'Transporte Sustentável', pontos: 30, icone: '/icons/transporte.svg', comprovacao: 'foto-gps' },
  { id: 'energia', nome: 'Economia de Energia', pontos: 15, icone: '/icons/energia.svg', comprovacao: 'foto' },
  { id: 'agua', nome: 'Economia de Água', pontos: 15, icone: '/icons/agua.svg', comprovacao: 'foto' },
  { id: 'bicicleta', nome: 'Bicicleta', pontos: 30, icone: '/icons/bicicleta.svg', comprovacao: 'foto-gps' },
  { id: 'plantio', nome: 'Plantio', pontos: 50, icone: '/icons/arvore.svg', comprovacao: 'foto-gps' },
  { id: 'banho', nome: 'Banho Rápido', pontos: 15, icone: '/icons/banho.svg', comprovacao: 'timer', tempoTimer: 300 },
  { id: 'compostagem', nome: 'Compostagem', pontos: 20, icone: '/icons/compostagem.svg', comprovacao: 'foto', admiteEcoponto: true },
  { id: 'consumo', nome: 'Consumo Consciente', pontos: 15, icone: '/icons/carrinho.svg', comprovacao: 'foto' },
  { id: 'garrafa', nome: 'Garrafa Reutilizável', pontos: 5, icone: '/icons/garrafa.svg', comprovacao: 'declaracao' },
  { id: 'educar', nome: 'Compartilhar Dicas', pontos: 5, icone: '/icons/comunidade.svg', comprovacao: 'declaracao' },
  { id: 'sacola', nome: 'Sacola Reutilizável', pontos: 3, icone: '/icons/sacola.svg', comprovacao: 'declaracao' },
  { id: 'captacao', nome: 'Captação de Água da Chuva', pontos: 25, icone: '/icons/agua.svg', comprovacao: 'foto' },
  { id: 'mobilidade', nome: 'Mobilidade Elétrica', pontos: 30, icone: '/icons/bateria.svg', comprovacao: 'foto' },
  { id: 'ciclovia', nome: 'Usar Ciclovia', pontos: 20, icone: '/icons/bicicleta.svg', comprovacao: 'foto-gps' },
  { id: 'solar', nome: 'Energia Solar', pontos: 40, icone: '/icons/solar.svg', comprovacao: 'foto' },
  { id: 'eolica', nome: 'Energia Eólica', pontos: 20, icone: '/icons/vento.svg', comprovacao: 'declaracao' },
  { id: 'led', nome: 'Iluminação Eficiente', pontos: 10, icone: '/icons/lampada.svg', comprovacao: 'foto' },
  { id: 'horta', nome: 'Horta Doméstica', pontos: 35, icone: '/icons/vaso.svg', comprovacao: 'foto' },
  { id: 'agrofloresta', nome: 'Apoiar Agrofloresta', pontos: 70, icone: '/icons/arvore.svg', comprovacao: 'foto' },
];

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
  { id: 'semente', nome: 'Semente', descricao: 'Primeiros passos sustentáveis', icone: '/icons/semente.svg', minPontos: 0 },
  { id: 'broto', nome: 'Broto', descricao: 'Crescendo a cada ação', icone: '/icons/folha.svg', minPontos: 150 },
  { id: 'arvore', nome: 'Árvore', descricao: 'Impacto real no planeta', icone: '/icons/arvore.svg', minPontos: 450 },
  { id: 'floresta', nome: 'Floresta', descricao: 'Guardiã do meio ambiente', icone: '/icons/floresta.svg', minPontos: 1000 },
];

export const NIVEIS: Nivel[] = [
  { nome: 'Semente', min: 0, max: 149 },
  { nome: 'Broto', min: 150, max: 449 },
  { nome: 'Árvore', min: 450, max: 999 },
  { nome: 'Floresta', min: 1000, max: Infinity },
];

export function nomeNivelPorPontos(pontos: number): string {
  for (const nivel of NIVEIS) {
    if (pontos >= nivel.min && pontos <= nivel.max) return nivel.nome;
  }
  return NIVEIS[NIVEIS.length - 1].nome;
}

export const CREDITOS_POR_REAL = 100;

export const PARCEIROS: Parceiro[] = [
  { id: 'p-adega', nome: 'Adega do Zé', tipos: ['ecoponto'], cor: '#eab308', localizacao: 'Centro', descricao: 'Recebe vidro, garrafas e retornáveis.', impactoBase: { kg: 1420, vouchers: 0 }, valorCortesia: 6 },
  { id: 'p-ferro', nome: 'Ferro-Velho do João', tipos: ['ecoponto'], cor: '#94a3b8', localizacao: 'Zona Norte', descricao: 'Recebe metais, eletrônicos e sucata.', impactoBase: { kg: 2310, vouchers: 0 } },
  { id: 'p-reciclava', nome: 'Recicla Vale', tipos: ['patrocinador', 'ecoponto'], cor: '#22c55e', localizacao: 'Zona Sul', descricao: 'Recebe papel, plástico e orgânico compostável.', temas: ['reciclagem', 'compostagem'], impactoBase: { kg: 3860, vouchers: 0 } },
  { id: 'p-cafe', nome: 'Café do Vale', tipos: ['voucher'], cor: '#b45309', localizacao: 'Centro', descricao: 'Cortesia de café para quem faz a diferença.', impactoBase: { kg: 0, vouchers: 415 }, valorCortesia: 8 },
  { id: 'p-doce', nome: 'Doce da Dona Neide', tipos: ['voucher'], cor: '#db2777', localizacao: 'Zona Leste', descricao: 'Doce artesanal que premia o impacto.', impactoBase: { kg: 0, vouchers: 268 }, valorCortesia: 6 },
  { id: 'p-cicloverde', nome: 'CicloVerde Bikes', tipos: ['patrocinador', 'ecoponto'], cor: '#38bdf8', localizacao: 'Zona Oeste', descricao: 'Patrocina mobilidade e recebe baterias de e-bike e eletrônicos.', temas: ['bicicleta', 'transporte', 'mobilidade', 'ciclovia'], impactoBase: { kg: 640, vouchers: 0 } },
  { id: 'p-renova', nome: 'Renova Energia', tipos: ['patrocinador'], cor: '#f5c451', localizacao: 'Nacional', descricao: 'Patrocina as missões de eficiência energética.', temas: ['energia', 'solar', 'eolica', 'led'] },
  { id: 'p-aguaviva', nome: 'Água Viva', tipos: ['patrocinador'], cor: '#60a5fa', localizacao: 'Nacional', descricao: 'Patrocina as missões de economia de água.', temas: ['agua', 'banho', 'captacao', 'garrafa'] },
  { id: 'p-verdecult', nome: 'Verde Cultivo', tipos: ['patrocinador'], cor: '#22c55e', localizacao: 'Rural', descricao: 'Patrocina plantio e agroflorestas.', temas: ['plantio', 'horta', 'agrofloresta'] },
  { id: 'p-consciente', nome: 'Mercado Consciente', tipos: ['patrocinador'], cor: '#a78bfa', localizacao: 'Zona Leste', descricao: 'Patrocina consumo consciente e hábitos do dia a dia.', temas: ['consumo', 'educar', 'sacola'] },
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
  const valorReal = PARCEIROS.find(p => p.id === parceiroId)?.valorCortesia ?? 0;
  return {
    ...campos,
    pontos: Math.round(valorReal * CREDITOS_POR_REAL),
    valorReal,
    parceiroId,
  };
}

export const RECOMPENSAS: Recompensa[] = [
  { id: 'r1', nome: 'Desconto Energia', descricao: '10% de desconto na conta de energia', pontos: 2000, valorReal: 20, categoria: 'Energia', icone: '/icons/lampada.svg', badge: 'Novo' },
  { id: 'r2', nome: 'Passe de Transporte', descricao: 'Um passe livre de transporte público', pontos: 540, valorReal: 5.4, categoria: 'Transporte', icone: '/icons/transporte.svg' },
  { id: 'r3', nome: 'Muda de Árvore', descricao: 'Receba uma muda para plantar', pontos: 2000, valorReal: 20, categoria: 'Natureza', icone: '/icons/arvore.svg', badge: 'Top 1' },
  { id: 'r4', nome: 'Cupom Reciclagem', descricao: 'Cupom de desconto em lojas parceiras', pontos: 1000, valorReal: 10, categoria: 'Cupons', icone: '/icons/carrinho.svg' },
  { id: 'r5', nome: 'Kit Sustentável', descricao: 'Kit com canudo reutilizável e sacola ecológica', pontos: 2000, valorReal: 20, categoria: 'Natureza', icone: '/icons/sacola.svg' },
  { id: 'r6', nome: 'Desconto Água', descricao: '5% de desconto na conta de água', pontos: 800, valorReal: 8, categoria: 'Energia', icone: '/icons/agua.svg' },
  { id: 'r7', nome: 'Cupom Bicicleta', descricao: 'Cupom de desconto em bicicletarias', pontos: 2000, valorReal: 20, categoria: 'Transporte', icone: '/icons/bicicleta.svg' },
  { id: 'r8', nome: 'Adoção de Árvore', descricao: 'Adote uma árvore real por 3 meses', pontos: 2500, valorReal: 25, categoria: 'Natureza', icone: '/icons/arvore.svg', badge: 'Top 1' },
  recompensaCortesia('p-cafe', { id: 'r9', nome: 'Café Cortesia', descricao: 'Um café grátis na Cafeteria do Vale', categoria: 'Parceiros', icone: '/icons/cafe.svg', badge: 'Cortesia' }),
  recompensaCortesia('p-doce', { id: 'r10', nome: 'Doce Artesanal', descricao: 'Doce da Dona Neide para alegrar o dia', categoria: 'Parceiros', icone: '/icons/doce.svg', badge: 'Cortesia' }),
  recompensaCortesia('p-adega', { id: 'r11', nome: 'Cupom Adega do Zé', descricao: '10% off em garrafas retornáveis e vidros', categoria: 'Parceiros', icone: '/icons/garrafa.svg', badge: 'Cortesia' }),
];

export function getParceiro(id: string): Parceiro | undefined {
  return PARCEIROS.find(p => p.id === id);
}

export const USUARIOS_BASE: UsuarioSimulado[] = [
  { nome: 'Maria Oliveira', pontos: 1320 },
  { nome: 'Ana Silva', pontos: 620 },
  { nome: 'Carlos Souza', pontos: 210 },
  { nome: 'Pedro Santos', pontos: 75 },
];

export const ENTREGA_ESTIMADA_KG = 2;

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
  { pergunta: 'Como ganhar pontos no RockySoulUp?', resposta: 'Você ganha pontos realizando ações sustentáveis como reciclar, usar transporte público, economizar água e energia, andar de bicicleta e plantar árvores. Cada ação tem um valor de pontos diferente!' },
  { pergunta: 'O que é o avatar inteligente?', resposta: 'O avatar inteligente é um assistente virtual que ajuda você a acompanhar seu progresso, sugere ações sustentáveis e responde dúvidas sobre sustentabilidade e gamificação.' },
  { pergunta: 'Como funciona o ranking?', resposta: 'Na sua comunidade, você adiciona amigos por código e cada um aparece com pontos, nível e sequência de dias — comparando quem faz mais diferença. Fora isso, um ranking de empresas parceiras mostra quem mais recupera resíduos e concede cortesias; suas entregas e resgates fazem essas empresas subirem de posição.' },
  { pergunta: 'Preciso fazer a verificação por foto?', resposta: 'Sim! Para garantir a autenticidade das ações, solicitamos que você envie uma foto como comprovante. A verificação por GPS é opcional, mas ajuda a validar ainda mais sua ação.' },
  { pergunta: 'Como funciona o sistema de níveis?', resposta: 'Você evolui seguindo a natureza conforme acumula pontos: Semente (0-149), Broto (150-449), Árvore (450-999) e Floresta (1000+). Cada nível desbloqueia novos sets de cartas, selos e recompensas!' },
  { pergunta: 'Como converter créditos em dinheiro?', resposta: 'Seus pontos funcionam como créditos da plataforma. No conversor da página de Recompensas, você informa a quantidade de créditos (mínimo de 500) e sua chave Pix para receber o valor: a cada 100 créditos, você recebe R$1,00.' },
  { pergunta: 'Posso resgatar recompensas várias vezes?', resposta: 'Sim, desde que tenha pontos suficientes. Cada recompensa tem um custo em pontos. Ao resgatar, os pontos são descontados do seu saldo e o resgate fica registrado no seu histórico.' },
  { pergunta: 'O que são os "créditos"?', resposta: 'Crédito é o nome dos seus pontos na plataforma. Toda ação sustentável registrada paga uma quantidade de créditos, e você os gasta em recompensas ou converte em dinheiro via Pix (100 créditos = R$1,00). No menu do seu perfil você vê seu saldo total e o de hoje.' },
  { pergunta: 'O que são cartas, sets e "química"?', resposta: 'Cada ação registrada pode soltar uma carta colecionável dos influenciadores da plataforma. As cartas estão organizadas em 4 sets (Soluções, Siga a Ciência, Energia e Tecnologia). Quando você completa o conjunto de um mesmo influenciador no set, ativa a "química" entre elas, que aumenta o valor da coleção. Tudo isso acontece na página Coleção.' },
  { pergunta: 'O que é uma carta "brilhante" (foil)?', resposta: 'Uma carta foil (representada por ✨) é a versão especial e mais valiosa de uma carta comum. Ela aparece ao obter uma repetida — você ganha a normal e a brilhante vem junto — e vale mais créditos na sua coleção.' },
  { pergunta: 'O que são "fragmentos" e a "Fábrica de Cartas"?', resposta: 'Fragmentos são a moeda de montar cartas: cada carta repetida vira fragmentos da raridade dela (comum, incomum, rara, épica ou lendária). Na "Fábrica de Cartas" (botão "Cartas repetidas" na Coleção) você usa fragmentos para montar exatamente a carta que ainda não tem — sem depender de sorte. Carta repetida vira +3 a +40 fragmentos conforme a raridade.' },
  { pergunta: 'O que significam "streak", "combo" e "roleta"?', resposta: '"Streak" (sequência) é quantos dias seguidos você registrou ações — manter a sequência diária é uma forma de ganhar mais. "Combo" é quando você encadeia ações no Mini-jogo de separação de resíduos para multiplicar pontos. Já a "roleta" fica na página Recompensas: com 100 créditos você gira e pode multiplicar o que gastou ou ganhar cartas.' },
  { pergunta: 'Como a economia de créditos é financiada?', resposta: 'A plataforma é gratuita para quem pratica e se sustenta por parcerias: ecopontos credenciados (como a Adega do Zé e o Ferro-Velho do João) pagam por cada entrega comprovada, patrocinadores bancam o Desafio do Dia (como a CicloVerde Bikes), e parceiros oferecem cortesias na loja de recompensas. As conversões em Pix são liquidadas por essa verba de parcerias — assim o financiamento cresce junto com o impacto real de cada usuário.' },
];

export const INTEGRANTES = [
  { nome: 'Igor Rodrigues de Santana', rm: 'RM570651', foto: '/imagens/igor.jpg', github: 'https://github.com/igorodriguesd', linkedin: 'https://linkedin.com/in/igor-rodrigues-135aa72b2' },
  { nome: 'Diego Gomes Goncalves de Lima', rm: 'RM570335', foto: '/imagens/diego.jpg', github: 'https://github.com/dgxls', linkedin: 'https://www.linkedin.com/in/diego-gomes-65339b408/' },
  { nome: 'Miguel Silva', rm: 'RM572019', foto: '/imagens/miguel.jpg', github: 'https://github.com/miguelsilva71', linkedin: 'https://www.linkedin.com/in/miguel-silva-0a20073a9/' },
  { nome: 'Rafael Santos Mendonça Costa', rm: 'RM572368', foto: '/imagens/rafael.jpg', github: 'https://github.com/rafaelSantos56', linkedin: 'https://www.linkedin.com/in/rafael-santos-b09bba237/' },
];

export const MIN_CREDITOS_CONVERSAO = 500;

export const BONUS_ECOPONTO = 8;
