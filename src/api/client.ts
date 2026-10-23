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
  if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) throw new Error('Não foi possível conectar. Tente novamente mais tarde.');
  const origin = base.href.replace(/\/$/, '');
  let token: string | null = null;
  let unauthorized = onUnauthorized;
  return {
    setToken(value: string | null) { token = value; },
    setUnauthorizedHandler(callback: () => void) { unauthorized = callback; },
    async request<T>(path: string, options: Options = {}): Promise<T> {
      if (!path.startsWith('/') || path.startsWith('//') || path.includes('..') || path.includes('#') || path.includes('\\')) throw new ApiError('Não foi possível abrir esta opção.');
      const publicAuth = options.publicAuth === true;
      if (publicAuth && (options.method !== 'POST' || !['/auth/cadastro', '/auth/login'].includes(path))) throw new ApiError('Entre na sua conta para continuar.');
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
            400: 'Confira as informações preenchidas e tente novamente.', 401: publicAuth ? 'Não foi possível entrar. Confira seu email e sua senha.' : 'Faça login novamente para continuar.',
            403: 'Sua conta não tem acesso a esta opção.', 404: 'Não encontramos o que você procura.',
            409: path === '/auth/cadastro' ? 'Não foi possível cadastrar esse email. Se já possui uma conta, use Entrar.' : 'Não foi possível concluir. Atualize a página e confira as informações antes de tentar novamente.', 413: 'O arquivo ou texto é muito grande. Envie uma foto menor ou reduza o texto.',
            415: 'Não conseguimos usar esse arquivo. Tente outra foto.', 429: publicAuth ? 'Você tentou muitas vezes. Aguarde um pouco antes de tentar novamente.' : 'Não é possível fazer novas solicitações agora. Aguarde e tente mais tarde.', 503: publicAuth ? 'Não foi possível acessar sua conta agora. Tente novamente em instantes.' : 'Esta opção está temporariamente indisponível. Tente novamente mais tarde.' };
          const retry = Number(response.headers.get('Retry-After'));
          throw new ApiError(messages[response.status] ?? 'Não foi possível concluir a operação.', response.status, Number.isFinite(retry) && retry > 0 ? retry : null);
        }
        if (response.status === 204) return undefined as T;
        const type = response.headers.get('content-type') ?? '';
        if (options.image ? !type.startsWith('image/jpeg') : !type.includes('application/json')) throw new ApiError('Não foi possível carregar as informações. Tente novamente em instantes.');
        const reader = response.body?.getReader();
        if (!reader) throw new ApiError('Não foi possível carregar as informações. Tente novamente em instantes.');
        const chunks: Uint8Array<ArrayBuffer>[] = []; let length = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          length += value.byteLength;
          if (length > 2_000_000) { await reader.cancel(); throw new ApiError('Não foi possível carregar as informações. Tente novamente em instantes.'); }
          chunks.push(new Uint8Array(value));
        }
        const blob = new Blob(chunks, { type });
        if (options.image) return blob as T;
        try { return JSON.parse(await blob.text()) as T; }
        catch { throw new ApiError('Não foi possível carregar as informações. Tente novamente em instantes.'); }
      } catch (error) {
        if (error instanceof ApiError) throw error;
        if (options.signal?.aborted) throw new DOMException('Operação cancelada.', 'AbortError');
        throw new ApiError('Não conseguimos conectar. Confira sua internet e tente novamente em instantes. Se enviou uma ação, confira suas atividades antes de repetir.');
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
  } catch { throw new ApiError('Faça login novamente para continuar.'); }
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message + (error.retryAfter ? ` Aguarde pelo menos ${error.retryAfter} segundos antes de tentar novamente.` : '');
  return 'Não foi possível concluir a solicitação.';
}
