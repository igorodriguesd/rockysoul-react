/**
 * Utilitários de formatação de dados
 */

/**
 * Formata número de pontos com separador de milhar
 * @example formatarPontos(1000) → "1.000"
 */
export function formatarPontos(pontos: number): string {
  return pontos.toLocaleString('pt-BR');
}

/**
 * Formata valor monetário em reais
 * @example formatarMoeda(150.50) → "R$ 150,50"
 */
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Formata data em formato brasileiro
 * @example formatarData(new Date()) → "01/09/2026"
 */
export function formatarData(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return dataObj.toLocaleDateString('pt-BR');
}

/**
 * Formata data e hora em formato brasileiro
 * @example formatarDataHora(new Date()) → "01/09/2026 14:30"
 */
export function formatarDataHora(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return dataObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formata apenas a hora
 * @example formatarHora(new Date()) → "14:30"
 */
export function formatarHora(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return dataObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formata data relativa (há X dias, horas, etc)
 * @example formatarDataRelativa(new Date(Date.now() - 3600000)) → "há 1 hora"
 */
export function formatarDataRelativa(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  const agora = new Date();
  const diferenca = agora.getTime() - dataObj.getTime();

  const segundos = Math.floor(diferenca / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (segundos < 60) return 'agora mesmo';
  if (minutos < 60) return `há ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  if (horas < 24) return `há ${horas} hora${horas > 1 ? 's' : ''}`;
  if (dias < 30) return `há ${dias} dia${dias > 1 ? 's' : ''}`;

  return formatarData(dataObj);
}

/**
 * Trunca texto com reticências
 * @example truncarTexto("Texto muito longo", 10) → "Texto mui..."
 */
export function truncarTexto(texto: string, comprimento: number): string {
  if (texto.length <= comprimento) return texto;
  return texto.substring(0, comprimento) + '...';
}

/**
 * Formata nome próprio (capitaliza primeira letra de cada palavra)
 * @example formatarNomeProprio("joão silva") → "João Silva"
 */
export function formatarNomeProprio(texto: string): string {
  return texto
    .toLowerCase()
    .split(' ')
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
}

/**
 * Formata percentual
 * @example formatarPercentual(75.5) → "75,5%"
 */
export function formatarPercentual(valor: number, casasDecimais = 1): string {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  }) + '%';
}

/**
 * Calcula nível com base em pontos
 * @example calcularNivel(250) → "Broto"
 */
export function calcularNivel(pontos: number): string {
  if (pontos < 100) return 'Semente';
  if (pontos < 300) return 'Broto';
  if (pontos < 1000) return 'Árvore';
  return 'Expert';
}

/**
 * Calcula progresso para próximo nível (0-100)
 * @example calcularProgresso(150) → 50
 */
export function calcularProgresso(pontos: number): number {
  const niveis = [
    { min: 0, max: 100 },
    { min: 100, max: 300 },
    { min: 300, max: 1000 },
    { min: 1000, max: Infinity },
  ];

  const nivelAtual = niveis.find((n) => pontos >= n.min && pontos < n.max);
  if (!nivelAtual || nivelAtual.max === Infinity) return 100;

  const progresso =
    ((pontos - nivelAtual.min) / (nivelAtual.max - nivelAtual.min)) * 100;
  return Math.min(Math.round(progresso), 100);
}
