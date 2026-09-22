export type Comprovacao = 'foto' | 'foto-gps' | 'timer' | 'declaracao';

export interface Missao {
  id: string;
  nome: string;
  pontos: number;
  icone: string;
  comprovacao: Comprovacao;
  tempoTimer?: number;
  admiteEcoponto?: boolean;
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
  valorReal: number;
  categoria: 'Energia' | 'Transporte' | 'Natureza' | 'Cupons' | 'Parceiros';
  icone: string;
  badge?: 'Novo' | 'Top 1' | 'Cortesia';
  parceiroId?: string;
}

export type TipoParceiro = 'ecoponto' | 'voucher' | 'patrocinador';

export interface Parceiro {
  id: string;
  nome: string;
  tipos: TipoParceiro[];
  cor: string;
  localizacao: string;
  descricao: string;
  temas?: string[];
  impactoBase?: { creditos: number; cortesias: number };
  valorCortesia?: number;
}

export interface ParceiroImpacto {
  entregas: number;
  resgates: number;
  creditos: number;
}

export interface Amigo {
  nome: string;
  codigo: string;
  pontos: number;
  streak: number;
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
  pontosAcumulados: number;
  missoesCompletas: number;
  pontosHoje: number;
  dataHoje: string;
  ultimoDia: string;
  streak: number;
  ultimoDesafio: string;
  historico: HistoricoEntrada[];
  selosDesbloqueados: string[];
  resgates: Resgate[];
  impactoParceiros: Record<string, ParceiroImpacto>;
  amigos: string[];
}

export type RaridadeCarta = 'comum' | 'incomum' | 'rara' | 'epica' | 'lendaria';

export interface Carta {
  id: string;
  nome: string;
  setId: string;
  raridade: RaridadeCarta;
  descricao: string;
  educativa: string;
  icone: string;
}

export interface SetCarta {
  id: string;
  nome: string;
  icone: string;
  tema: string;
  descricao: string;
  cor: string;
  pontosMin: number;
}

export type NivelQuimica = 0 | 1 | 2 | 3;

export interface Quimica {
  level: NivelQuimica;
  bonusPontos: number;
  descricao: string;
}

export interface SetColecaoUsuario {
  cartas: string[];
  level: NivelQuimica;
}

export interface ColecaoData {
  cartasObtidas: string[];
  cartasFoil: string[];
  fragmentos: Record<RaridadeCarta, number>;
  sets: Record<string, SetColecaoUsuario>;
}

export interface NovaCartaInfo {
  carta: Carta;
  set: SetCarta;
  quimicaAntes: Quimica;
  quimicaNova: Quimica;
  bonusGanho: number;
}

export type ResultadoDrop =
  | { caiu: true; novaCarta: NovaCartaInfo; foil?: boolean }
  | { caiu: true; foil: true; carta: Carta }
  | { caiu: true; duplicada: true; carta: Carta; fragmentosGanhos: number }
  | { caiu: false; carta: Carta; chance: number };
