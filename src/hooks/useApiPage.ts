import { useEffect, useState } from 'react';
import { useApi } from '../context/ApiContext';
import { errorMessage } from '../api/client';
import type { Recurso } from '../api/types';

export function useApiPage<T>(resource: Recurso | 'verificacoes', page = 0, enabled = true) {
  const { service, user, revision } = useApi();
  const userId = user?.id;
  const key = `${user?.id ?? 'none'}:${revision}:${resource}:${page}:${enabled}`;
  const [state, setState] = useState<{ key: string; rows: T[]; loading: boolean; error: string | null }>({ key: '', rows: [], loading: false, error: null });
  useEffect(() => {
    const controller = new AbortController(); let active = true;
    if (!userId || !enabled) return;
    service.list<T>(resource, page, controller.signal).then(rows => {
      if (!Array.isArray(rows)) throw new Error('Lista inválida.');
      if (active) setState({ key, rows, loading: false, error: null });
    }).catch(error => { if (active && !controller.signal.aborted) setState({ key, rows: [], loading: false, error: errorMessage(error) }); });
    return () => { active = false; controller.abort(); };
  }, [service, userId, revision, resource, page, enabled, key]);
  if (!user || !enabled) return { rows: [], loading: false, error: null };
  if (state.key !== key) return { rows: [], loading: true, error: null };
  return { rows: state.rows, loading: state.loading, error: state.error };
}
