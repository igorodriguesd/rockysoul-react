import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ApiError, createApiClient, errorMessage, tokenIdentity } from '../api/client';
import { services } from '../api/services';
import type { SessaoAtual, Usuario } from '../api/types';
import { showToast } from '../components/Toast';

type ApiState = { api: ReturnType<typeof createApiClient>; service: ReturnType<typeof services>; user: Usuario | null; isAdmin: boolean; revision: number; connecting: boolean; sessionError: string | null; retrySession: () => Promise<void>;
  connect: (token: string) => Promise<void>; login: (email: string, senha: string) => Promise<void>; disconnect: () => void; logout: () => Promise<void>; refresh: () => void; refreshProfile: () => Promise<void>; spendCredits: (pontos: number) => boolean };
const Context = createContext<ApiState | null>(null);
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rockysoulup-api.onrender.com';
const TOKEN_KEY = 'rocky_auth_token';
function savedToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
const LOCAL_SPENT_KEY = 'rocky_local_spent_';
function loadLocalSpent(userId: number): number {
  try { const raw = localStorage.getItem(`${LOCAL_SPENT_KEY}${userId}`); const value = raw ? Number(raw) : 0; return Number.isFinite(value) && value > 0 ? value : 0; } catch { return 0; }
}
function persistLocalSpent(userId: number, value: number) {
  try { localStorage.setItem(`${LOCAL_SPENT_KEY}${userId}`, String(value)); } catch { /* storage indisponível */ }
}
export function ApiProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [localSpent, setLocalSpent] = useState(0);
  const [isAdmin, setAdmin] = useState(false);
  const [revision, setRevision] = useState(0);
  const [connecting, setConnecting] = useState(() => !!savedToken());
  const [sessionError, setSessionError] = useState<string | null>(null);
  const epoch = useRef(0);
  const api = useMemo(() => createApiClient(BASE_URL), []);
  const service = useMemo(() => services(api), [api]);
  const disconnect = useCallback(() => {
    epoch.current++; api.setToken(null); setUser(null); setLocalSpent(0); setAdmin(false); setConnecting(false); setSessionError(null); setRevision(n => n + 1);
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage indisponível */ }
  }, [api]);
  const refresh = useCallback(() => setRevision(n => n + 1), []);
  const connect = useCallback(async (value: string, initial?: SessaoAtual, restoring = false) => {
    const token = value.trim(); const attempt = ++epoch.current;
    setUser(null); setLocalSpent(0); setAdmin(false); setConnecting(true); setSessionError(null);
    if (!restoring) { try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage indisponível */ } }
    let identity: ReturnType<typeof tokenIdentity>;
    try { identity = tokenIdentity(token); }
    catch (error) { if (attempt === epoch.current) disconnect(); throw error; }
    api.setToken(token);
    try {
      const session = initial ?? await service.session();
      if (attempt !== epoch.current) return;
      const profile = session.usuario;
      if (!profile || profile.id !== identity.id || typeof profile.nome !== 'string' || !Number.isSafeInteger(profile.versao) || typeof session.administrador !== 'boolean') throw new Error('Não foi possível carregar sua conta. Tente entrar novamente.');
      // UI capability only; the backend authorizes every operation independently.
      api.setToken(token); setUser(profile); setLocalSpent(loadLocalSpent(profile.id)); setAdmin(session.administrador); refresh();
      try { localStorage.setItem(TOKEN_KEY, token); } catch { /* storage indisponível */ }
    } catch (error) {
      if (attempt === epoch.current) {
        const temporary = error instanceof ApiError && (error.status === 0 || error.status === 429 || error.status >= 500);
        if (restoring && temporary) {
          // Keep the saved credential for a retry; never authorize UI data from storage alone.
          api.setToken(null); setSessionError('Não foi possível carregar sua conta agora. Sua sessão foi preservada. Tente novamente.');
        } else disconnect();
      }
      throw error;
    } finally { if (attempt === epoch.current) setConnecting(false); }
  }, [api, service, disconnect, refresh]);
  const retrySession = useCallback(async () => {
    const token = savedToken();
    if (token) await connect(token, undefined, true);
    else disconnect();
  }, [connect, disconnect]);
  useEffect(() => {
    api.setUnauthorizedHandler(disconnect);
    void retrySession().catch(() => { /* The gate shows recoverable failures; invalid sessions are cleared. */ });
    return () => {
      // Invalidate pending work on unmount/StrictMode cleanup without erasing the saved token.
      epoch.current++; api.setUnauthorizedHandler(() => {}); api.setToken(null);
    };
  }, [api, disconnect, retrySession]);
  const login = async (email: string, senha: string) => {
    const attempt = epoch.current;
    const session = await service.login({ email, senha });
    if (attempt !== epoch.current) return;
    if (typeof session.accessToken !== 'string' || session.tokenType !== 'Bearer' || !Number.isFinite(session.expiresIn) || session.expiresIn <= 0) throw new ApiError('Não foi possível entrar agora. Tente novamente em instantes.');
    await connect(session.accessToken, session.usuario && typeof session.administrador === 'boolean' ? { usuario: session.usuario, administrador: session.administrador } : undefined);
  };
  const logout = async () => { try { await service.logout(); } catch (error) { showToast(errorMessage(error)); } finally { disconnect(); } };
  const refreshProfile = async () => {
    if (!user) return;
    const current = epoch.current;
    const profile = await service.profile(user.id);
    if (current === epoch.current) setUser(profile);
  };
  const spendCredits = useCallback((pontos: number) => {
    if (!user || !Number.isFinite(pontos) || pontos <= 0) return false;
    const disponivel = Math.max(0, user.pontos - localSpent);
    if (pontos > disponivel) return false;
    const next = localSpent + pontos;
    setLocalSpent(next);
    persistLocalSpent(user.id, next);
    return true;
  }, [user, localSpent]);
  const visibleUser = useMemo(() => user ? { ...user, pontos: Math.max(0, user.pontos - localSpent) } : null, [user, localSpent]);
  return <Context.Provider value={{ api, service, user: visibleUser, isAdmin, revision, connecting, sessionError, retrySession, connect, login, disconnect, logout, refresh, refreshProfile, spendCredits }}>{children}</Context.Provider>;
}
export function useApi() { const value = useContext(Context); if (!value) throw new Error('ApiProvider ausente.'); return value; }
