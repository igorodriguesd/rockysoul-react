import { useState, type ReactNode } from 'react';
import { useApi } from '../context/ApiContext';
import LoginModal from './LoginModal';
export function ApiGate({ children, acesso = 'a esta área' }: { children: ReactNode; acesso?: string }) {
  const { user } = useApi(); const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  if (user) return <>{children}</>;
  return <section className="card-primary rounded-2xl p-4 sm:p-5 text-white max-w-xl mx-auto text-center space-y-4"><h1 className="text-2xl font-bold">Entre na sua conta</h1><p className="text-white/65">Para ter acesso {acesso}, faça seu login. Se ainda não tem uma conta, cadastre-se para começar.</p><div className="flex flex-wrap justify-center gap-3"><button className="rounded-xl px-4 py-2.5 bg-[#22c55e] text-white text-sm font-semibold hover:bg-[#16a34a] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" onClick={() => { setMode('login'); setOpen(true); }}>Entrar</button><button className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" onClick={() => { setMode('register'); setOpen(true); }}>Criar conta</button></div><LoginModal aberto={open} onFechar={() => setOpen(false)} initialMode={mode} /></section>;
}
export function PageControls({ page, setPage, count, loading }: { page: number; setPage: (page: number) => void; count: number; loading?: boolean }) {
  return <nav aria-label="Paginação" className="flex items-center gap-3 mt-5 text-sm"><button className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={page === 0 || loading} onClick={() => setPage(page - 1)}>Anterior</button><span>Página {page + 1}</span><button className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" disabled={count < 20 || page >= 10000 || loading} onClick={() => setPage(page + 1)}>Próxima</button></nav>;
}
export function ListState({ loading, error, count }: { loading: boolean; error: string | null; count: number }) {
  const { refresh } = useApi();
  if (loading) return <p role="status" className="text-white/60 py-5">Carregando dados da API…</p>;
  if (error) return <div role="alert" className="my-4 text-red-300"><p>{error}</p><button className="rounded-xl px-3 py-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mt-2" onClick={refresh}>Tentar carregar novamente</button></div>;
  return count ? null : <p className="text-white/55 py-5">Nenhum registro nesta página.</p>;
}
