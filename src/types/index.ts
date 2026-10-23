export type Comprovacao = 'foto' | 'foto-gps' | 'timer' | 'declaracao';

export interface Missao {
  id: string;
  nome: string;
  pontos: number;
  icone: string;
  comprovacao: Comprovacao;
  /** O que o usuário precisa fazer para concluir a missão. */
  descricao: string;
  /** Como a ação é validada — o que enviar como comprovante. */
  comoValidar: string;
  /** Comprovantes aceitos na foto: item, nota fiscal, recibo, protocolo... */
  comprovantes: string[];
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

export interface TrilhaEtapa {
  nome: string;
  icone: string;
  minXP: number;
  recompensa: string;
  bonusCreditos: number;
  desbloqueio: string;
  explicacao: string;
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
  /** Valor da cortesia em reais (R$). Os créditos = valor × CREDITOS_POR_REAL. */
  valorCortesiaReal?: number;
}

export interface ParceiroImpacto {
  entregas: number;
  resgates: number;
  creditos: number;
  acoes?: number;
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
  bonusBoasVindasRecebido?: boolean;
}

export type RaridadeCarta = 'comum' | 'incomum' | 'rara' | 'epica' | 'lendaria';

export interface Carta {
  id: string;
  nome: string;
  setId: string;
  raridade: RaridadeCarta;
  descricao: string;
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
  /** Créditos já creditados no saldo por causa das cartas (evita contagem dupla). */
  valorCreditado?: number;
}

export interface NovaCartaInfo {
  carta: Carta;
  set: SetCarta;
  quimicaAntes: Quimica;
  quimicaNova: Quimica;
  bonusGanho: number;
  /** Créditos creditados no saldo pelo valor da carta. */
  valorCarta?: number;
}

export type ResultadoDrop =
  | { caiu: true; novaCarta: NovaCartaInfo; foil?: boolean }
  | { caiu: true; foil: true; carta: Carta }
  | { caiu: true; duplicada: true; carta: Carta; fragmentosGanhos: number }
  | { caiu: false; carta: Carta; chance: number };
