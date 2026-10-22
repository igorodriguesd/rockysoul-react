export type Raridade = 'COMUM' | 'INCOMUM' | 'RARA' | 'EPICA' | 'LENDARIA';
export interface Usuario { id: number; nome: string; email: string; pontos: number; resgatados: number; versao: number }
export interface Cadastro { nome: string; email: string; senha: string }
export interface Login { email: string; senha: string }
export interface Sessao { accessToken: string; tokenType: string; expiresIn: number }
export interface Acao { id: number; nome: string; pontos: number; versao: number }
export interface CartaApi { id: number; nome: string; descricao: string | null; conjunto: string; raridade: Raridade; versao: number }
export interface SeloApi { id: number; nome: string; descricao: string | null; pontosMin: number; versao: number }
export interface RecompensaApi { id: number; titulo: string; descricao: string | null; custo: number; estoque: number; categoria: string | null; destaque: string | null; versao: number }
export interface HistoricoApi { id: number; usuarioId: number; descricao: string; pontos: number; dataAcao: string; versao: number }
export interface UsuarioCartaApi { usuarioId: number; cartaId: number; quantidade: number; versao: number }
export interface FragmentoApi { usuarioId: number; raridade: Raridade; quantidade: number; versao: number }
export type EstadoVerificacao = 'ENVIADA' | 'EM_ANALISE' | 'PENDENTE_REVISAO' | 'APROVADA' | 'REJEITADA';
export interface Verificacao { id: string; usuarioId: number; acaoId: number; estado: EstadoVerificacao; versao: number; possivelReuso: boolean; evidenciaDisponivel: boolean; parecer: string | null; modelo: string; regras: string; tentativas: number; pontosCreditados: number }
export interface Desafio { id: string; acaoId: number; codigo: string; expiraEm: string }
export interface Submissao { acaoId: number; desafioId: string; descricao: string; imagemBase64: string }
export interface Consumo { habilitado: boolean; suspenso: boolean; consumoOuReservaDiaMicrosUSD: number; limiteDiaMicrosUSD: number; consumoOuReservaMesMicrosUSD: number; limiteMesMicrosUSD: number; reservasIncertas: number }
export type Recurso = 'acao' | 'carta' | 'selo' | 'recompensa' | 'historico' | 'usuario' | 'usuario-carta' | 'usuario-fragmento';
export type Registro = Record<string, string | number | null>;
