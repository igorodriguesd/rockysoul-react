export class ApiError extends Error {
  readonly status: number;
  readonly retryAfter: number | null;
  constructor(message: string, status = 0, retryAfter: number | null = null) {
    super(message); this.name = 'ApiError'; this.status = status; this.retryAfter = retryAfter;
  }
}

type Options = { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown; key?: string; signal?: AbortSignal; image?: boolean; publicAuth?: boolean };
export function createApiClient(baseUrl: string, fetcher: typeof fetch = globalThis.fetch, onUnauthorized: () => void = () => {}) {
  const base = new URL(baseUrl);
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw new Error('URL pública da API inválida.');
  const origin = base.href.replace(/\/$/, '');
  let token: string | null = null;
  let unauthorized = onUnauthorized;
  return {
    setToken(value: string | null) { token = value; },
    setUnauthorizedHandler(callback: () => void) { unauthorized = callback; },
    async request<T>(path: string, options: Options = {}): Promise<T> {
      if (!path.startsWith('/') || path.startsWith('//') || path.includes('..') || path.includes('#') || path.includes('\\')) throw new ApiError('Rota inválida.');
      const publicAuth = options.publicAuth === true;
      if (publicAuth && (options.method !== 'POST' || !['/auth/cadastro', '/auth/login'].includes(path))) throw new ApiError('Rota pública não permitida.');
      const requestToken = publicAuth ? null : token;
      if (!publicAuth && !requestToken) throw new ApiError('Entre na sua conta para continuar.', 401);
      const controller = new AbortController();
      const abort = () => controller.abort();
      options.signal?.addEventListener('abort', abort, { once: true });
      if (options.signal?.aborted) controller.abort();
      const timeout = setTimeout(abort, 65000);
      try {
        const headers: Record<string, string> = { Accept: options.image ? 'image/jpeg' : 'application/json' };
        if (requestToken) headers.Authorization = `Bearer ${requestToken}`;
        if (options.body !== undefined) headers['Content-Type'] = 'application/json';
        if (options.key) headers['Idempotency-Key'] = options.key;
        const response = await fetcher(origin + path, { method: options.method ?? 'GET', headers, credentials: 'omit', redirect: 'error', cache: 'no-store', signal: controller.signal,
          body: options.body === undefined ? undefined : JSON.stringify(options.body) });
        if (response.status === 401 && !publicAuth && token === requestToken) { token = null; unauthorized(); }
        if (!response.ok) {
          const messages: Record<number, string> = {
            400: 'Confira os campos e os limites do formulário.', 401: publicAuth ? 'Email ou senha inválidos, ou conta inativa.' : 'Sessão expirada ou inválida. Entre novamente.',
            403: 'Sua conta não tem permissão para esta operação.', 404: 'Registro indisponível ou sem acesso.',
            409: path === '/auth/cadastro' ? 'Não foi possível cadastrar esse email. Se já possui uma conta, use Entrar.' : 'O registro mudou ou há conflito de dados. Recarregue e revise antes de salvar.', 413: 'A imagem ou o formulário excede o limite.',
            415: 'Formato de envio não aceito.', 429: publicAuth ? 'Limite de tentativas de cadastro/login atingido. Aguarde antes de tentar novamente.' : 'Limite de tentativas, pendências ou orçamento atingido.', 503: publicAuth ? 'Cadastro/login temporariamente indisponível. Confira a API e o banco.' : 'API ou análise indisponível. A IA pode estar desabilitada ou suspensa.' };
          const retry = Number(response.headers.get('Retry-After'));
          throw new ApiError(messages[response.status] ?? 'Não foi possível concluir a operação.', response.status, Number.isFinite(retry) && retry > 0 ? retry : null);
        }
        if (response.status === 204) return undefined as T;
        const type = response.headers.get('content-type') ?? '';
        if (options.image ? !type.startsWith('image/jpeg') : !type.includes('application/json')) throw new ApiError('A API retornou um formato inesperado.');
        const reader = response.body?.getReader();
        if (!reader) throw new ApiError('Resposta vazia da API.');
        const chunks: Uint8Array<ArrayBuffer>[] = []; let length = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          length += value.byteLength;
          if (length > 2_000_000) { await reader.cancel(); throw new ApiError('Resposta acima do limite de leitura.'); }
          chunks.push(new Uint8Array(value));
        }
        const blob = new Blob(chunks, { type });
        if (options.image) return blob as T;
        try { return JSON.parse(await blob.text()) as T; }
        catch { throw new ApiError('Resposta JSON inválida.'); }
      } catch (error) {
        if (error instanceof ApiError) throw error;
        if (options.signal?.aborted) throw new DOMException('Operação cancelada.', 'AbortError');
        throw new ApiError('Sem resposta da API em localhost:8080. Confira o servidor e o CORS. Se houve envio, consulte o estado antes de repetir.');
      } finally { clearTimeout(timeout); options.signal?.removeEventListener('abort', abort); }
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
export function tokenIdentity(token: string): { id: number; expires: number } {
  try {
    const parts = token.split('.'); if (parts.length !== 3) throw new Error();
    const decoded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const claims = JSON.parse(atob(decoded.padEnd(Math.ceil(decoded.length / 4) * 4, '=')));
    const id = Number(claims.sub); const expires = Number(claims.exp) * 1000;
    if (!Number.isSafeInteger(id) || id <= 0 || !Number.isFinite(expires) || expires <= Date.now()) throw new Error();
    return { id, expires }; // Decoding supplies a lookup ID only; the backend validates signature and ownership.
  } catch { throw new ApiError('Informe um JWT atual emitido pela API RockySoulup.'); }
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message + (error.retryAfter ? ` Consulte novamente em ${error.retryAfter}s; cotas diárias podem continuar bloqueadas.` : '');
  return 'Não foi possível concluir a solicitação.';
}
