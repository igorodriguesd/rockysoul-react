import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ApiError, createApiClient, errorMessage, tokenIdentity } from '../api/client';
import { services } from '../api/services';
import type { Usuario } from '../api/types';
import { showToast } from '../components/Toast';

type ApiState = { api: ReturnType<typeof createApiClient>; service: ReturnType<typeof services>; user: Usuario | null; isAdmin: boolean; revision: number; connecting: boolean;
  connect: (token: string) => Promise<void>; login: (email: string, senha: string) => Promise<void>; disconnect: () => void; logout: () => Promise<void>; refresh: () => void; refreshProfile: () => Promise<void> };
const Context = createContext<ApiState | null>(null);
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rockysoulup-api.onrender.com';
const TOKEN_KEY = 'rocky_auth_token';
export function ApiProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAdmin, setAdmin] = useState(false);
  const [revision, setRevision] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const epoch = useRef(0);
  const api = useMemo(() => createApiClient(BASE_URL), []);
  const service = useMemo(() => services(api), [api]);
  const disconnect = useCallback(() => {
    epoch.current++; api.setToken(null); setUser(null); setAdmin(false); setRevision(n => n + 1);
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage indisponível */ }
  }, [api]);
  useEffect(() => { api.setUnauthorizedHandler(disconnect); return () => { api.setUnauthorizedHandler(() => {}); api.setToken(null); }; }, [disconnect, api]);
  // Restaura a sessão ao recarregar a página
  useEffect(() => {
    let token: string | null = null;
    try { token = localStorage.getItem(TOKEN_KEY); } catch { token = null; }
    if (token) {
      connect(token).catch(() => { /* sessão inválida ou expirada — segue deslogado */ });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const refresh = useCallback(() => setRevision(n => n + 1), []);
  const connect = async (value: string) => {
    disconnect(); const token = value.trim(); const identity = tokenIdentity(token); const attempt = epoch.current;
    setConnecting(true); api.setToken(token);
    try {
      const profile = await service.profile(identity.id);
      if (attempt !== epoch.current) return;
      if (profile.id !== identity.id || typeof profile.nome !== 'string' || !Number.isSafeInteger(profile.versao)) throw new Error('Não foi possível carregar sua conta. Tente entrar novamente.');
      let admin = false;
      try { await service.usage(); admin = true; } catch (error) {
        if (error instanceof Error && 'status' in error && error.status === 401) throw error;
        // Permission is always enforced by the backend; a failed capability check grants nothing.
      }
      if (attempt !== epoch.current) return;
      setUser(profile); setAdmin(admin); refresh();
      try { localStorage.setItem(TOKEN_KEY, token); } catch { /* storage indisponível */ }
      // Não desloga automaticamente por inatividade — o backend retorna 401 quando o token expirar
    } catch (error) { if (attempt === epoch.current) disconnect(); throw error; }
    finally { setConnecting(false); }
  };
  const login = async (email: string, senha: string) => {
    const session = await service.login({ email, senha });
    if (typeof session.accessToken !== 'string' || session.tokenType !== 'Bearer' || !Number.isFinite(session.expiresIn) || session.expiresIn <= 0) throw new ApiError('Não foi possível entrar agora. Tente novamente em instantes.');
    await connect(session.accessToken);
  };
  const logout = async () => { try { await service.logout(); } catch (error) { showToast(errorMessage(error)); } finally { disconnect(); } };
  const refreshProfile = async () => {
    if (!user) return;
    const current = epoch.current;
    const profile = await service.profile(user.id);
    if (current === epoch.current) setUser(profile);
  };
  return <Context.Provider value={{ api, service, user, isAdmin, revision, connecting, connect, login, disconnect, logout, refresh, refreshProfile }}>{children}</Context.Provider>;
}
export function useApi() { const value = useContext(Context); if (!value) throw new Error('ApiProvider ausente.'); return value; }
