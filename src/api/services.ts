import type { ApiClient } from './client';
import type { Roleta, Cadastro, Login, Sessao, Desafio, Consumo, Registro, Recurso, Submissao, Usuario, Verificacao } from './types';

export function resourcePath(resource: Recurso, value: Registro): string {
  const encode = (key: string) => encodeURIComponent(String(value[key]));
  if (resource === 'usuario-carta') return `/usuario-carta/${encode('usuarioId')}/${encode('cartaId')}`;
  if (resource === 'usuario-fragmento') return `/usuario-fragmento/${encode('usuarioId')}/${encode('raridade')}`;
  return `/${resource}/${encode('id')}`;
}
export function services(api: ApiClient) {
  return {
    register: ({ nome, email, senha }: Cadastro) => api.request<Usuario>('/auth/cadastro', { method: 'POST', publicAuth: true, body: { nome: nome.trim(), email: email.trim().toLowerCase(), senha } }),
    login: ({ email, senha }: Login) => api.request<Sessao>('/auth/login', { method: 'POST', publicAuth: true, body: { email: email.trim().toLowerCase(), senha } }),
    profile: (id: number, signal?: AbortSignal) => api.request<Usuario>(`/usuario/${id}`, { signal }),
    updateProfile: (user: Usuario, nome: string, email: string) => api.request<Usuario>(`/usuario/${user.id}`, { method: 'PUT', body: { nome, email, versao: user.versao } }),
    logout: () => api.request<void>('/auth/logout', { method: 'POST' }),
    list: <T,>(resource: Recurso | 'verificacoes' | 'roletas', page = 0, signal?: AbortSignal, size = 20) => api.request<T[]>(`/${resource}?page=${page}&size=${size}`, { signal }),
    get: <T,>(resource: Recurso, row: Registro) => api.request<T>(resourcePath(resource, row)),
    save: (resource: Recurso, body: Registro, original?: Registro) => api.request<Registro>(original ? resourcePath(resource, original) : `/${resource}`, { method: original ? 'PUT' : 'POST', body }),
    delete: (resource: Recurso, row: Registro) => api.request<void>(`${resourcePath(resource, row)}?versao=${row.versao}`, { method: 'DELETE' }),
    balance: (row: Registro, body: Registro) => api.request<Registro>(`/usuario/${row.id}/saldo`, { method: 'PUT', body }),
    challenge: (acaoId: number) => api.request<Desafio>('/verificacoes/desafio', { method: 'POST', body: { acaoId } }),
    submit: (body: Submissao, key: string) => api.request<Verificacao>('/verificacoes', { method: 'POST', body, key }),
    roulette: (id: string, signal?: AbortSignal) => api.request<Roleta>(`/verificacoes/${encodeURIComponent(id)}/roleta`, { signal }),
    spin: (id: string) => api.request<Roleta>(`/verificacoes/${encodeURIComponent(id)}/roleta`, { method: 'POST' }),
    verification: (id: string) => api.request<Verificacao>(`/verificacoes/${encodeURIComponent(id)}`),
    evidence: (id: string, signal?: AbortSignal) => api.request<Blob>(`/verificacoes/${encodeURIComponent(id)}/evidencia`, { image: true, signal }),
    deleteEvidence: (id: string) => api.request<void>(`/verificacoes/${encodeURIComponent(id)}/evidencia`, { method: 'DELETE' }),
    review: (row: Verificacao, aprovar: boolean, justificativa: string) => api.request<Verificacao>(`/admin/verificacoes/${encodeURIComponent(row.id)}/revisao`, { method: 'POST', body: { aprovar, justificativa, versao: row.versao } }),
    reprocess: (row: Verificacao) => api.request<Verificacao>(`/admin/verificacoes/${encodeURIComponent(row.id)}/reprocessar`, { method: 'POST', body: { confirmarPossivelCobranca: true, versao: row.versao } }),
    usage: () => api.request<Consumo>('/admin/ia/consumo'),
    suspend: (suspenso: boolean) => api.request<void>('/admin/ia/suspensao', { method: 'POST', body: { suspenso } }),
  };
}
