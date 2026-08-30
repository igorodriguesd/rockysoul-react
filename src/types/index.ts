export interface Missao {
  id: string;
  nome: string;
  pontos: number;
  icone: string;
}

export interface Selo {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  minPontos: number;
}

export interface Nivel {
  nome: string;
  min: number;
  max: number;
}

export interface Recompensa {
  id: string;
  nome: string;
  descricao: string;
  pontos: number;
  categoria: 'Energia' | 'Transporte' | 'Natureza' | 'Cupons';
  icone: string;
  badge?: 'Novo' | 'Top 1';
}

export interface HistoricoEntrada {
  nome: string;
  pontos: number;
  data: string;
}

export interface Resgate {
  nome: string;
  pontos: number;
  data: string;
}

export interface UsuarioSimulado {
  nome: string;
  pontos: number;
}

export interface ChatMessage {
  texto: string;
  remetente: 'user' | 'bot';
}

export interface UserData {
  nome: string;
  email: string;
  pontos: number;
  missoesCompletas: number;
  pontosHoje: number;
  dataHoje: string;
  ultimoDia: string;
  streak: number;
  ultimoDesafio: string;
  historico: HistoricoEntrada[];
  selosDesbloqueados: string[];
  resgates: Resgate[];
}
