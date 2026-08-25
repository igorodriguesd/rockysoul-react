import type { Missao, Selo, Nivel, Recompensa, UsuarioSimulado } from '../types';

export const MISSOES: Missao[] = [
  { id: 'reciclagem', nome: 'Reciclagem', pontos: 30, icone: '/icons/reciclagem.svg' },
  { id: 'transporte', nome: 'Transporte Sustentavel', pontos: 50, icone: '/icons/transporte.svg' },
  { id: 'energia', nome: 'Economia de Energia', pontos: 20, icone: '/icons/energia.svg' },
  { id: 'agua', nome: 'Economia de Agua', pontos: 20, icone: '/icons/agua.svg' },
  { id: 'bicicleta', nome: 'Bicicleta', pontos: 40, icone: '/icons/bicicleta.svg' },
  { id: 'plantio', nome: 'Plantio', pontos: 100, icone: '/icons/arvore.svg' },
  { id: 'banho', nome: 'Banho Rapido', pontos: 20, icone: '/icons/banho.svg' },
];

export const SELOS: Selo[] = [
  { id: 'semente', nome: 'Semente', descricao: 'Primeiros passos sustentaveis', icone: '/icons/semente.svg', minPontos: 100 },
  { id: 'broto', nome: 'Broto', descricao: 'Crescendo em sustentabilidade', icone: '/icons/broto.svg', minPontos: 300 },
  { id: 'arvore', nome: 'Arvore', descricao: 'Impacto real no planeta', icone: '/icons/arvore.svg', minPontos: 600 },
  { id: 'expert', nome: 'Expert', descricao: 'Lenda da sustentabilidade', icone: '/icons/trofeu.svg', minPontos: 1000 },
];

export const NIVEIS: Nivel[] = [
  { nome: 'Semente', min: 0, max: 99 },
  { nome: 'Broto', min: 100, max: 299 },
  { nome: 'Arvore', min: 300, max: 999 },
  { nome: 'Expert', min: 1000, max: Infinity },
];

export const RECOMPENSAS: Recompensa[] = [
  { id: 'r1', nome: 'Desconto Energia', descricao: '10% de desconto na conta de energia', pontos: 200, categoria: 'Energia', icone: '/icons/bateria.svg', badge: 'Novo' },
  { id: 'r2', nome: 'Passe de Transporte', descricao: 'Um passe livre de transporte publico', pontos: 350, categoria: 'Transporte', icone: '/icons/transporte.svg' },
  { id: 'r3', nome: 'Muda de Arvore', descricao: 'Receba uma muda para plantar', pontos: 500, categoria: 'Natureza', icone: '/icons/muda.svg', badge: 'Top 1' },
  { id: 'r4', nome: 'Cupom Reciclagem', descricao: 'Cupom de R$15 em lojas parceiras', pontos: 150, categoria: 'Cupons', icone: '/icons/carrinho.svg' },
  { id: 'r5', nome: 'Kit Sustentavel', descricao: 'Kit com canudo reutilizavel e sacola ecologica', pontos: 250, categoria: 'Natureza', icone: '/icons/folha.svg' },
  { id: 'r6', nome: 'Desconto Agua', descricao: '5% de desconto na conta de agua', pontos: 180, categoria: 'Energia', icone: '/icons/agua.svg' },
  { id: 'r7', nome: 'Cupom Bicicleta', descricao: 'Cupom de R$20 em bicicletarias', pontos: 400, categoria: 'Transporte', icone: '/icons/bicicleta.svg' },
  { id: 'r8', nome: 'Adocao de Arvore', descricao: 'Adote uma arvore real por 3 meses', pontos: 800, categoria: 'Natureza', icone: '/icons/arvore.svg', badge: 'Top 1' },
];

export const USUARIOS_BASE: UsuarioSimulado[] = [
  { nome: 'Ana Silva', pontos: 0, historico: [35, 50, 20, 45, 30, 55, 40] },
  { nome: 'Carlos Souza', pontos: 0, historico: [20, 40, 55, 30, 25, 50, 35] },
  { nome: 'Maria Oliveira', pontos: 0, historico: [60, 30, 45, 50, 40, 25, 55] },
  { nome: 'Pedro Santos', pontos: 0, historico: [25, 35, 30, 40, 55, 45, 20] },
];

export const PASSADO: number[] = [30, 50, 20, 45, 35, 55];

export const CURIOSIDADES: string[] = [
  'Reciclar uma latinha de alumínio economiza energia suficiente para ligar uma TV por 3 horas!',
  'Tomar banho de 5 minutos pode economizar ate 40 litros de agua por dia.',
  'Usar bicicleta em vez de carro evita a emissao de 150g de CO2 por km percorrido.',
  'Uma arvore jovem absorve cerca de 22kg de CO2 por ano.',
  'Desligar aparelhos da tomada quando nao estao em uso pode reduzir a conta de energia em ate 10%.',
];

export const PERGUNTAS_FAQ: { pergunta: string; resposta: string }[] = [
  { pergunta: 'Como ganhar pontos no RockySoulUp?', resposta: 'Voce ganha pontos realizando acoes sustentaveis como reciclar, usar transporte publico, economizar agua e energia, andar de bicicleta e plantar arvores. Cada acao tem um valor de pontos diferente!' },
  { pergunta: 'O que e o avatar inteligente?', resposta: 'O avatar inteligente e um assistente virtual que ajuda voce a acompanhar seu progresso, sugere acoes sustentaveis e responde duvidas sobre sustentabilidade e gamificacao.' },
  { pergunta: 'Como funciona o ranking?', resposta: 'O ranking mostra sua posicao em relacao aos outros usuarios da plataforma. Quanto mais acoes sustentaveis voce realizar, mais pontos acumula e maior sera sua posicao no ranking semanal.' },
  { pergunta: 'Preciso fazer a verificacao por foto?', resposta: 'Sim! Para garantir a autenticidade das acoes, solicitamos que voce envie uma foto como comprovante. A verificacao por GPS e opcional, mas ajuda a validar ainda mais sua acao.' },
  { pergunta: 'Como funciona o sistema de niveis?', resposta: 'Voce evolui de Semente ate Expert conforme acumula pontos: Semente (0-99), Broto (100-299), Arvore (300-999) e Expert (1000+). Cada nivel desbloqueia novos selos e recompensas!' },
  { pergunta: 'Posso resgatar recompensas varias vezes?', resposta: 'Sim, desde que tenha pontos suficientes. Cada recompensa tem um custo em pontos. Ao resgatar, os pontos sao descontados do seu saldo e o resgate fica registrado no seu historico.' },
];

export const INTEGRANTES = [
  { nome: 'Igor Rodrigues de Santana', rm: 'RM570651', foto: '/imagens/igor.jpg', github: 'https://github.com/igorodriguesd', linkedin: 'https://linkedin.com/in/igor-rodrigues-135aa72b2' },
  { nome: 'Diego Gomes Goncalves de Lima', rm: 'RM570335', foto: '/imagens/diego.jpg', github: 'https://github.com/diegogomeslima', linkedin: 'https://linkedin.com/in/diego-gomes-76156a205' },
  { nome: 'Miguel Silva', rm: 'RM572019', foto: '/imagens/miguel.jpg', github: 'https://github.com/miguelsilv', linkedin: 'https://linkedin.com/in/miguel-silva-72364a200' },
  { nome: 'Rafael Santos Mendonca Costa', rm: 'RM572368', foto: '/imagens/rafael.jpg', github: 'https://github.com/rafaelsantosmc', linkedin: 'https://linkedin.com/in/rafael-santos-mendonca-costa-086007247' },
];

export const RECOMPENSAS_CHAT: { emoji: string; nome: string; pontos: number }[] = [
  { emoji: '🔋', nome: 'Desconto Energia', pontos: 200 },
  { emoji: '🚌', nome: 'Passe de Transporte', pontos: 350 },
  { emoji: '🌱', nome: 'Muda de Arvore', pontos: 500 },
  { emoji: '🛒', nome: 'Cupom Reciclagem', pontos: 150 },
  { emoji: '🌿', nome: 'Kit Sustentavel', pontos: 250 },
  { emoji: '💧', nome: 'Desconto Agua', pontos: 180 },
  { emoji: '🚲', nome: 'Cupom Bicicleta', pontos: 400 },
  { emoji: '🌳', nome: 'Adocao de Arvore', pontos: 800 },
];
