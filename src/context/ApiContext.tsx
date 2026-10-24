import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ApiError, createApiClient, errorMessage, tokenIdentity } from '../api/client';
import { services } from '../api/services';
import type { SessaoAtual, Usuario } from '../api/types';
import { showToast } from '../components/Toast';

type ApiState = { api: ReturnType<typeof createApiClient>; service: ReturnType<typeof services>; user: Usuario | null; isAdmin: boolean; revision: number; connecting: boolean;
  connect: (token: string) => Promise<void>; login: (email: string, senha: string) => Promise<void>; disconnect: () => void; logout: () => Promise<void>; refresh: () => void; refreshProfile: () => Promise<void> };
const Context = createContext<ApiState | null>(null);
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rockysoulup-api.onrender.com';
export function ApiProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAdmin, setAdmin] = useState(false);
  const [revision, setRevision] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const epoch = useRef(0); const expiry = useRef<ReturnType<typeof setTimeout> | null>(null);
  const api = useMemo(() => createApiClient(BASE_URL), []);
  const service = useMemo(() => services(api), [api]);
  const disconnect = useCallback(() => {
    epoch.current++; api.setToken(null); setUser(null); setAdmin(false); setRevision(n => n + 1);
    if (expiry.current) clearTimeout(expiry.current);
  }, [api]);
  useEffect(() => { api.setUnauthorizedHandler(disconnect); return () => { api.setUnauthorizedHandler(() => {}); if (expiry.current) clearTimeout(expiry.current); api.setToken(null); }; }, [disconnect, api]);
  const refresh = useCallback(() => setRevision(n => n + 1), []);
  const connect = async (value: string, initial?: SessaoAtual) => {
    disconnect(); const token = value.trim(); const identity = tokenIdentity(token); const attempt = epoch.current;
    setConnecting(true); api.setToken(token);
    try {
      const session = initial ?? await service.session();
      const profile = session.usuario;
      if (attempt !== epoch.current) return;
      if (!profile || profile.id !== identity.id || typeof profile.nome !== 'string' || !Number.isSafeInteger(profile.versao) || typeof session.administrador !== 'boolean') throw new Error('Não foi possível carregar sua conta. Tente entrar novamente.');
      // Capabilities control the UI only; every operation is authorized again by the backend.
      const admin = session.administrador;
      if (attempt !== epoch.current) return;
      setUser(profile); setAdmin(admin); refresh();
      expiry.current = setTimeout(() => { disconnect(); showToast('Sessão expirada. Entre novamente.'); }, Math.min(identity.expires - Date.now(), 2_147_000_000));
    } catch (error) { if (attempt === epoch.current) disconnect(); throw error; }
    finally { setConnecting(false); }
  };
  const login = async (email: string, senha: string) => {
    const session = await service.login({ email, senha });
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
  return <Context.Provider value={{ api, service, user, isAdmin, revision, connecting, connect, login, disconnect, logout, refresh, refreshProfile }}>{children}</Context.Provider>;
}
export function useApi() { const value = useContext(Context); if (!value) throw new Error('ApiProvider ausente.'); return value; }
