import type { Missao, Selo, Nivel, Recompensa, UsuarioSimulado } from '../types';

export const MISSOES: Missao[] = [
  { id: 'reciclagem', nome: 'Reciclagem', pontos: 30, icone: '/icons/reciclagem.svg' },
  { id: 'transporte', nome: 'Transporte Sustentável', pontos: 50, icone: '/icons/transporte.svg' },
  { id: 'energia', nome: 'Economia de Energia', pontos: 20, icone: '/icons/energia.svg' },
  { id: 'agua', nome: 'Economia de Água', pontos: 20, icone: '/icons/agua.svg' },
  { id: 'bicicleta', nome: 'Bicicleta', pontos: 40, icone: '/icons/bicicleta.svg' },
  { id: 'plantio', nome: 'Plantio', pontos: 100, icone: '/icons/arvore.svg' },
  { id: 'banho', nome: 'Banho Rápido', pontos: 20, icone: '/icons/banho.svg' },
];

export const SELOS: Selo[] = [
  { id: 'semente', nome: 'Semente', descricao: 'Primeiros passos sustentáveis', icone: '/icons/semente.svg', minPontos: 100 },
  { id: 'broto', nome: 'Broto', descricao: 'Crescendo em sustentabilidade', icone: '/icons/broto.svg', minPontos: 300 },
  { id: 'arvore', nome: 'Árvore', descricao: 'Impacto real no planeta', icone: '/icons/arvore.svg', minPontos: 600 },
  { id: 'expert', nome: 'Expert', descricao: 'Lenda da sustentabilidade', icone: '/icons/trofeu.svg', minPontos: 1000 },
];

export const NIVEIS: Nivel[] = [
  { nome: 'Semente', min: 0, max: 99 },
  { nome: 'Broto', min: 100, max: 299 },
  { nome: 'Árvore', min: 300, max: 999 },
  { nome: 'Expert', min: 1000, max: Infinity },
];

export const RECOMPENSAS: Recompensa[] = [
  { id: 'r1', nome: 'Desconto Energia', descricao: '10% de desconto na conta de energia', pontos: 200, categoria: 'Energia', icone: '/icons/bateria.svg', badge: 'Novo' },
  { id: 'r2', nome: 'Passe de Transporte', descricao: 'Um passe livre de transporte público', pontos: 350, categoria: 'Transporte', icone: '/icons/transporte.svg' },
  { id: 'r3', nome: 'Muda de Árvore', descricao: 'Receba uma muda para plantar', pontos: 500, categoria: 'Natureza', icone: '/icons/muda.svg', badge: 'Top 1' },
  { id: 'r4', nome: 'Cupom Reciclagem', descricao: 'Cupom de R$15 em lojas parceiras', pontos: 150, categoria: 'Cupons', icone: '/icons/carrinho.svg' },
  { id: 'r5', nome: 'Kit Sustentável', descricao: 'Kit com canudo reutilizável e sacola ecológica', pontos: 250, categoria: 'Natureza', icone: '/icons/folha.svg' },
  { id: 'r6', nome: 'Desconto Água', descricao: '5% de desconto na conta de água', pontos: 180, categoria: 'Energia', icone: '/icons/agua.svg' },
  { id: 'r7', nome: 'Cupom Bicicleta', descricao: 'Cupom de R$20 em bicicletarias', pontos: 400, categoria: 'Transporte', icone: '/icons/bicicleta.svg' },
  { id: 'r8', nome: 'Adoção de Árvore', descricao: 'Adote uma árvore real por 3 meses', pontos: 800, categoria: 'Natureza', icone: '/icons/arvore.svg', badge: 'Top 1' },
];

export const USUARIOS_BASE: UsuarioSimulado[] = [
  { nome: 'Ana Silva', pontos: 520 },
  { nome: 'Carlos Souza', pontos: 380 },
  { nome: 'Maria Oliveira', pontos: 610 },
  { nome: 'Pedro Santos', pontos: 290 },
];

export const CURIOSIDADES: string[] = [
  'Reciclar uma latinha de alumínio economiza energia suficiente para ligar uma TV por 3 horas!',
  'Tomar banho de 5 minutos pode economizar até 40 litros de água por dia.',
  'Usar bicicleta em vez de carro evita a emissão de 150g de CO2 por km percorrido.',
  'Uma árvore jovem absorve cerca de 22kg de CO2 por ano.',
  'Desligar aparelhos da tomada quando não estão em uso pode reduzir a conta de energia em até 10%.',
];

export const PERGUNTAS_FAQ: { pergunta: string; resposta: string }[] = [
  { pergunta: 'Como ganhar pontos no RockySoulUp?', resposta: 'Você ganha pontos realizando ações sustentáveis como reciclar, usar transporte público, economizar água e energia, andar de bicicleta e plantar árvores. Cada ação tem um valor de pontos diferente!' },
  { pergunta: 'O que é o avatar inteligente?', resposta: 'O avatar inteligente é um assistente virtual que ajuda você a acompanhar seu progresso, sugere ações sustentáveis e responde dúvidas sobre sustentabilidade e gamificação.' },
  { pergunta: 'Como funciona o ranking?', resposta: 'O ranking mostra sua posição em relação aos outros usuários da plataforma. Quanto mais ações sustentáveis você realizar, mais pontos acumula e maior será sua posição no ranking semanal.' },
  { pergunta: 'Preciso fazer a verificação por foto?', resposta: 'Sim! Para garantir a autenticidade das ações, solicitamos que você envie uma foto como comprovante. A verificação por GPS é opcional, mas ajuda a validar ainda mais sua ação.' },
  { pergunta: 'Como funciona o sistema de níveis?', resposta: 'Você evolui de Semente até Expert conforme acumula pontos: Semente (0-99), Broto (100-299), Árvore (300-999) e Expert (1000+). Cada nível desbloqueia novos selos e recompensas!' },
  { pergunta: 'Posso resgatar recompensas várias vezes?', resposta: 'Sim, desde que tenha pontos suficientes. Cada recompensa tem um custo em pontos. Ao resgatar, os pontos são descontados do seu saldo e o resgate fica registrado no seu histórico.' },
];

export const INTEGRANTES = [
  { nome: 'Igor Rodrigues de Santana', rm: 'RM570651', foto: '/imagens/igor.jpg', github: 'https://github.com/igorodriguesd', linkedin: 'https://linkedin.com/in/igor-rodrigues-135aa72b2' },
  { nome: 'Diego Gomes Goncalves de Lima', rm: 'RM570335', foto: '/imagens/diego.jpg', github: 'https://github.com/diegogomeslima', linkedin: 'https://linkedin.com/in/diego-gomes-76156a205' },
  { nome: 'Miguel Silva', rm: 'RM572019', foto: '/imagens/miguel.jpg', github: 'https://github.com/miguelsilv', linkedin: 'https://linkedin.com/in/miguel-silva-72364a200' },
  { nome: 'Rafael Santos Mendonça Costa', rm: 'RM572368', foto: '/imagens/rafael.jpg', github: 'https://github.com/rafaelsantosmc', linkedin: 'https://linkedin.com/in/rafael-santos-mendonca-costa-086007247' },
];

export const RECOMPENSAS_CHAT: { icone: string; nome: string; pontos: number }[] = [
  { icone: '/icons/bateria.svg', nome: 'Desconto Energia', pontos: 200 },
  { icone: '/icons/transporte.svg', nome: 'Passe de Transporte', pontos: 350 },
  { icone: '/icons/muda.svg', nome: 'Muda de Árvore', pontos: 500 },
  { icone: '/icons/carrinho.svg', nome: 'Cupom Reciclagem', pontos: 150 },
  { icone: '/icons/folha.svg', nome: 'Kit Sustentável', pontos: 250 },
  { icone: '/icons/agua.svg', nome: 'Desconto Água', pontos: 180 },
  { icone: '/icons/bicicleta.svg', nome: 'Cupom Bicicleta', pontos: 400 },
  { icone: '/icons/arvore.svg', nome: 'Adoção de Árvore', pontos: 800 },
];
