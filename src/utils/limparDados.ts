/**
 * Limpa todos os dados do usuário no navegador.
 * Usado no "Sair": depois de desconectar, nada fica salvo — pontos, cartas,
 * fragmentos, histórico, selos, resgates e declarações voltam do zero.
 */
export function limparDadosLocais(): void {
  try {
    const chaves: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const chave = window.localStorage.key(i);
      if (chave && chave.startsWith('rocky_')) chaves.push(chave);
    }
    chaves.forEach(chave => window.localStorage.removeItem(chave));
  } catch {
    // armazenamento indisponível — segue o logout normalmente
  }
}
