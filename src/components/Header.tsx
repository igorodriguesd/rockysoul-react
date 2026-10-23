import { useState, useEffect, useRef, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useColecao } from '../context/CollectionContext';
<<<<<<< HEAD
import { CREDITOS_POR_REAL } from '../data/constants';
import { PESO_RARIDADE } from '../data/cartas';
import { useApi } from '../context/ApiContext';
=======
import { limparDadosLocais } from '../utils/limparDados';
import { EVENTO_ABRIR_LOGIN } from '../utils/loginGate';
>>>>>>> origin/main
import LoginModal from './LoginModal';

const NIVEL_ICONE_HEADER: Record<string, string> = {
  Semente: '/icons/semente.svg',
  Broto: '/icons/folha.svg',
  'Árvore': '/icons/arvore.svg',
  Floresta: '/icons/floresta.svg',
};

<<<<<<< HEAD
function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function progressoParaNivel(pontos: number): number {
  if (pontos >= 1000) return 100;
  if (pontos >= 300) return 30 + ((pontos - 300) / 700) * 70;
  if (pontos >= 100) return 10 + ((pontos - 100) / 200) * 20;
  return (pontos / 100) * 10;
}

const baseLinks = [
=======
const links = [
>>>>>>> origin/main
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/colecao', label: 'Coleção' },
  { to: '/recompensas', label: 'Recompensas' },
  { to: '/parceiros', label: 'Parceiros' },
];

const linksSecundarios = [
  { to: '/solucao', label: 'Solução' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/faq', label: 'FAQ' },
  { to: '/integrantes', label: 'Equipe' },
  { to: '/contato', label: 'Contato' },
];

const TEMPO_OCULTAR_HEADER = 2500;

export default function Header() {
  const [usuarioAberto, setUsuarioAberto] = useState(false);
  const [maisAberto, setMaisAberto] = useState(false);
  const [notifAberto, setNotifAberto] = useState(false);
  const [loginAberto, setLoginAberto] = useState(false);
  const [oculto, setOculto] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const { data, getNivel, resetar } = useData();
<<<<<<< HEAD
  const { colecao, getValorTotal, catalogo: CARTAS } = useColecao();
  const { user, isAdmin } = useApi();
  const links = [...baseLinks, ...(user ? [{ to: '/perfil', label: 'Perfil' }] : []), ...(isAdmin ? [{ to: '/administracao', label: 'Administração' }] : [])];
=======
  const { colecao, resetarColecao } = useColecao();
>>>>>>> origin/main
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLDivElement>(null);
  const maisRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const timerIdle = useRef<ReturnType<typeof setTimeout> | null>(null);

  const usuarioLogado = Boolean(user);

  const nivel = getNivel();

  const notificacoes = useMemo(() => {
    const lista: { icone: string; titulo: string; texto: string; rota: string }[] = [];
    const nCartas = colecao.cartasObtidas.length;
    if (nCartas === 0 && usuarioLogado) {
      lista.push({ icone: '/icons/coringa.svg', titulo: 'Colecione cartas', texto: 'Registre ações no Dashboard para ganhar suas primeiras cartas.', rota: '/dashboard' });
    }
    if (nCartas > 0) {
      lista.push({ icone: '/icons/coringa.svg', titulo: `${nCartas} carta${nCartas > 1 ? 's' : ''} na coleção`, texto: 'Veja seu álbum e ative as químicas dos sets.', rota: '/colecao' });
    }
    if (data.streak > 0) {
      lista.push({ icone: '/icons/folha.svg', titulo: `Sequência de ${data.streak} dia${data.streak > 1 ? 's' : ''}`, texto: 'Manter a rotina te aproxima dos marcos de recompensa.', rota: '/dashboard' });
    }
    lista.push({ icone: '/icons/alvo.svg', titulo: 'Desafio do Dia', texto: 'Uma missão extra com bônus esperando por você hoje.', rota: '/dashboard' });
    return lista;
  }, [colecao.cartasObtidas.length, data.streak, usuarioLogado]);

  useEffect(() => {
    if (!usuarioAberto) return;
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setUsuarioAberto(false);
      }
    }
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [usuarioAberto]);

  useEffect(() => {
    if (!maisAberto) return;
    function handleClick(e: MouseEvent) {
      if (maisRef.current && !maisRef.current.contains(e.target as Node)) {
        setMaisAberto(false);
      }
    }
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [maisAberto]);

  useEffect(() => {
    if (!notifAberto) return;
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifAberto(false);
      }
    }
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [notifAberto]);

  useEffect(() => {
    function abrir() {
      setMenuAberto(false);
      setUsuarioAberto(false);
      setLoginAberto(true);
    }
    window.addEventListener(EVENTO_ABRIR_LOGIN, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_LOGIN, abrir);
  }, []);

  useEffect(() => {
    if (!window.matchMedia?.('(hover: hover)')?.matches) return;

    function mostrar() {
      setOculto(false);
      if (timerIdle.current) {
        clearTimeout(timerIdle.current);
        timerIdle.current = null;
      }
    }

    function agendarOcultar() {
      if (timerIdle.current) clearTimeout(timerIdle.current);
      timerIdle.current = setTimeout(() => setOculto(true), TEMPO_OCULTAR_HEADER);
    }

    function onMove() {
      mostrar();
      agendarOcultar();
    }

    function onAtivo() {
      mostrar();
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onAtivo);
    window.addEventListener('keydown', onAtivo);
    onMove();

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onAtivo);
      window.removeEventListener('keydown', onAtivo);
      if (timerIdle.current) clearTimeout(timerIdle.current);
    };
  }, []);

  useEffect(() => {
    if (!menuAberto) return;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflowAnterior; };
  }, [menuAberto]);

  function handleEntrar() {
    setLoginAberto(true);
  }

  function handleLoginFechar() {
    setLoginAberto(false);
    setUsuarioAberto(false);
  }

  function handleSair() {
    // Sair zera tudo: saldo, histórico, cartas, fragmentos e selos não ficam no navegador.
    resetar();
    resetarColecao();
    limparDadosLocais();
    setUsuarioAberto(false);
    navigate('/');
  }

  return (
    <>
      <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-100 ${oculto ? '-translate-y-[calc(100%+2rem)] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 pointer-events-auto'} transition-all duration-300 ease-out w-[calc(100%-2rem)] max-w-275 px-5 sm:px-6 py-4 flex items-center justify-between rounded-3xl bg-(--t-header) backdrop-blur-xl border border-(--t-header-border) shadow-(--t-header-shadow) box-border`}>
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <img src="/imagens/logo.png" alt="RockySoulUp" className="h-7 w-auto opacity-90" />
          <span
            className="font-brand font-bold text-slate-900 tracking-tight text-sm sm:text-base md:text-lg"
          >
            RockySoulUp
          </span>
        </NavLink>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuAberto(o => !o)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18" />
              <path d="M3 6h18" />
              <path d="M3 18h18" />
            </svg>
          </button>
          <nav className="hidden lg:flex items-center gap-3">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => { setUsuarioAberto(false); setMaisAberto(false); setNotifAberto(false); }}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm font-semibold rounded-xl transition-all border ${isActive ? 'text-brand bg-card-tertiary border-brand/35' : 'border-transparent text-slate-500 hover:text-slate-900'}`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="relative" ref={maisRef}>
              <button
                onClick={() => { setMaisAberto(o => !o); setUsuarioAberto(false); setNotifAberto(false); }}
                className={`flex items-center gap-1 px-1 py-1.5 text-sm font-semibold transition-all cursor-pointer ${maisAberto ? 'text-brand' : 'text-slate-500 hover:text-slate-900'}`}
                aria-haspopup="true"
                aria-expanded={maisAberto}
              >
                Mais
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${maisAberto ? 'rotate-180' : ''}`}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {maisAberto && (
                <div className="absolute right-0 top-full mt-3 w-48 rounded-2xl bg-(--t-surface) shadow-2xl border border-(--t-header-border) p-2 z-120">
                  {linksSecundarios.map(link => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => { setMaisAberto(false); setUsuarioAberto(false); setNotifAberto(false); }}
className={({ isActive }) =>
                  `block px-3 py-2 rounded-xl text-sm font-medium transition-all border ${isActive
                    ? 'text-brand bg-card-tertiary border-brand/35'
                    : 'border-transparent text-slate-700 hover:bg-surface-hover hover:text-slate-900'
                  }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifAberto(o => !o); setUsuarioAberto(false); setMaisAberto(false); }}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-300 text-slate-500 hover:bg-surface-hover hover:text-slate-900 transition-colors cursor-pointer"
                title="Notificações"
                aria-label="Notificações"
                aria-haspopup="true"
                aria-expanded={notifAberto}
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-(--t-header)" title="Novidades" />
              </button>

              {notifAberto && (
                <div className="absolute right-0 top-full mt-3 w-80 rounded-2xl bg-(--t-surface) shadow-2xl border border-(--t-header-border) p-3 z-120">
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-2 px-1">Notificações</p>
                  <div className="flex flex-col gap-1.5">
                    {notificacoes.length === 0 && (
                      <p className="text-slate-400 text-xs text-center py-4">Nenhuma novidade por enquanto.</p>
                    )}
                    {notificacoes.map((n, i) => (
                      <button
                        key={i}
                        onClick={() => { setNotifAberto(false); navigate(n.rota); }}
                        className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-hover cursor-pointer"
                      >
                        <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--t-mist)' }}><img src={n.icone} alt="" className="w-4 h-4" /></span>
                        <span className="min-w-0">
                          <span className="block text-slate-800 text-xs font-semibold">{n.titulo}</span>
                          <span className="block text-slate-500 text-[11px] leading-snug mt-0.5">{n.texto}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 relative" ref={avatarRef}>
              {usuarioLogado ? (
                <button
                  onClick={() => { setUsuarioAberto(o => !o); setNotifAberto(false); }}
                  className="flex items-center gap-2 rounded-full bg-brand-soft hover:bg-brand-soft-2 pl-1 pr-3 py-1 transition-colors border border-brand/15 cursor-pointer"
                  aria-haspopup="true"
                  aria-expanded={usuarioAberto}
                  aria-label="Menu do usuário"
                >
                  <span className="w-8 h-8 rounded-full bg-linear-to-br from-brand to-brand-2 flex items-center justify-center text-(--t-onaccent) text-xs font-bold shadow-md">
                    {data.nome?.trim()?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <span className="hidden xl:flex flex-col items-start leading-tight">
                    <span className="text-slate-800 text-xs font-semibold max-w-90px truncate">{data.nome?.trim()?.split(' ')?.[0] || 'Usuário'}</span>
                    <span className="text-gold-deep text-[10px] font-medium">{data.pontos} créditos</span>
                  </span>
                  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${usuarioAberto ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleEntrar}
                  className="flex items-center gap-2 rounded-full bg-brand hover:bg-brand-hover px-4 py-2 text-(--t-onaccent) text-sm font-semibold transition-colors shadow-md cursor-pointer"
                >
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                  </svg>
                  Entrar
                </button>
              )}

              {usuarioAberto && (
                <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl bg-(--t-surface) shadow-2xl border border-(--t-header-border) p-2 z-120">
                  <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'var(--t-mist)' }}>
                    <span className="w-10 h-10 rounded-full bg-linear-to-br from-brand to-brand-2 flex items-center justify-center text-(--t-onaccent) text-base font-bold shadow-md shrink-0">
                      {data.nome?.trim()?.[0]?.toUpperCase() || 'U'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-800 font-bold text-sm truncate">{data.nome || 'Usuário'}</p>
                      <span className="inline-flex items-center gap-1.5">
                        <img src={NIVEL_ICONE_HEADER[nivel] || '/icons/semente.svg'} className="w-3.5 h-3.5" alt="" />
                        <span className="text-brand text-xs font-semibold">{nivel}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    {[
                      { label: 'Créditos', value: data.pontos.toLocaleString('pt-BR') },
                      { label: 'Cartas', value: String(colecao.cartasObtidas.length) },
                      { label: 'Ações', value: String(data.missoesCompletas) },
                    ].map(s => (
                      <div key={s.label} className="rounded-xl py-2 text-center border border-(--t-header-border)">
                        <p className="text-slate-800 font-bold text-sm leading-none">{s.value}</p>
                        <p className="text-slate-500 text-[10px] mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1 mt-2 pt-2" style={{ borderTop: '1px solid var(--t-header-border)' }}>
                    <button onClick={handleSair} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <path d="M16 17l5-5-5-5" />
                        <path d="M21 12H9" />
                      </svg>
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {menuAberto && (
        <div
          className="fixed inset-0 z-[200] flex flex-col overscroll-contain bg-(--t-header) backdrop-blur-xl border-b border-(--t-header-border) shadow-xl"
          onClick={() => setMenuAberto(false)}
        >
          <div className="shrink-0 px-6 py-5 flex items-center justify-between border-b border-(--t-header-border)">
            <span className="font-bold text-slate-900 text-lg">Menu</span>
            <button
              onClick={() => setMenuAberto(false)}
              className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
              aria-label="Fechar menu"
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="shrink-0 px-6 py-4 border-b border-(--t-header-border)">
            {usuarioLogado ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'var(--t-mist)' }}>
                  <span className="w-10 h-10 rounded-full bg-linear-to-br from-brand to-brand-2 flex items-center justify-center text-(--t-onaccent) text-base font-bold shadow-md shrink-0">
                    {data.nome?.trim()?.[0]?.toUpperCase() || 'U'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-slate-800 font-bold text-sm truncate">{data.nome || 'Usuário'}</p>
                    <span className="text-brand text-xs font-semibold">{nivel}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mt-2">
                  {[
                    { label: 'Créditos', value: data.pontos.toLocaleString('pt-BR') },
                    { label: 'Cartas', value: String(colecao.cartasObtidas.length) },
                    { label: 'Ações', value: String(data.missoesCompletas) },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl py-2 text-center border border-(--t-header-border)">
                      <p className="text-slate-800 font-bold text-sm leading-none">{s.value}</p>
                      <p className="text-slate-500 text-[10px] mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { handleSair(); setMenuAberto(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="M16 17l5-5-5-5" />
                    <path d="M21 12H9" />
                  </svg>
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setLoginAberto(true); setMenuAberto(false); }}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-brand hover:bg-brand-hover px-4 py-2 text-(--t-onaccent) text-sm font-semibold transition-colors shadow-md cursor-pointer"
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                </svg>
                Entrar
              </button>
            )}
<<<<<<< HEAD

            {usuarioAberto && (
              <div className="absolute right-0 top-full mt-3 w-72 rounded-2xl bg-[#0f1c2e] shadow-2xl border border-white/10 p-3 z-120">
                <div className="rounded-2xl p-4 bg-[#0c3a22] relative overflow-hidden">
                  <div
                    className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10"
                    style={{ background: 'radial-gradient(circle, #4ade80, transparent)', transform: 'translate(30%,-30%)' }}
                  />
                  <div className="flex items-center gap-3">
                    <div className="relative w-22 h-22 shrink-0">
                      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90 absolute inset-0">
                        <circle cx="44" cy="44" r={arcR} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                        <circle
                          cx="44" cy="44" r={arcR} fill="none" stroke="url(#headerArc)" strokeWidth="5" strokeLinecap="round"
                          strokeDasharray={arcCirc} strokeDashoffset={arcCirc - (progresso / 100) * arcCirc}
                          style={{ transition: 'stroke-dashoffset 0.7s ease' }}
                        />
                        <defs>
                          <linearGradient id="headerArc" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4ade80" />
                            <stop offset="100%" stopColor="#22c55e" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-[#0f3c22]"
                          style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)' }}>
                          {data.nome?.trim()?.[0]?.toUpperCase() || 'U'}
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-base truncate">{data.nome || 'Usuário'}</p>
                      <p className="text-white/40 text-xs truncate">{data.email || 'email não informado'}</p>
                      <span className="inline-flex items-center gap-1.5 mt-1.5">
                        <img src={NIVEL_ICONE_HEADER[nivel] || '/icons/semente.svg'} className="w-3.5 h-3.5" alt="" />
                        <span className="text-green-300/90 text-sm font-medium">{nivel}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {[
                      { label: 'Total', value: data.pontos, suffix: 'créditos', cor: '#fff' },
                      { label: 'Hoje', value: data.pontosHoje, suffix: 'créditos', cor: '#fff' },
                      { label: 'Missões', value: data.missoesCompletas, suffix: '', cor: '#fff' },
                      { label: 'Streak', value: data.streak, suffix: 'd', cor: '#ffc928' },
                    ].map(s => (
                      <div key={s.label} className="rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <p className="font-bold text-base" style={{ color: s.cor }}>
                          {s.value}<span className="text-[10px] opacity-60 ml-0.5">{s.suffix}</span>
                        </p>
                        <p className="text-white/50 text-[10px]">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 w-full rounded-xl p-3 cursor-pointer transition-all hover:brightness-105"
                    onClick={() => { setUsuarioAberto(false); navigate('/colecao'); }}
                    style={{ background: 'rgba(166,108,255,0.1)', border: '1px solid rgba(166,108,255,0.35)' }}
                    aria-label="Ver vitrine da coleção"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white/45 text-[10px] uppercase tracking-widest">Minha vitrine</p>
                      <p className="text-[#a66cff] text-[11px] font-bold">{valorTotal} créditos</p>
                    </div>
                    {vitrine.length === 0 ? (
                      <p className="text-white/40 text-xs text-center py-1.5">Conquiste cartas para exibir aqui</p>
                    ) : (
                      <div className="grid grid-cols-4 gap-1.5">
                        {vitrine.map(c => {
                          const ehFoil = foils.has(c.id);
                          const cor = ehFoil ? '#fde68a' : c.raridade === 'comum' ? '#9ca3af' : c.raridade === 'incomum' ? '#38bdf8' : c.raridade === 'rara' ? '#a66cff' : c.raridade === 'epica' ? '#f5c451' : '#f59e0b';
                          return (
                            <div
                              key={c.id}
                              className="relative rounded-lg py-1.5 flex flex-col items-center"
                              style={{ background: ehFoil ? 'rgba(250,204,21,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${cor}66`, boxShadow: ehFoil ? '0 0 10px rgba(250,204,21,0.4)' : 'none' }}
                              title={`${c.nome}${ehFoil ? ' ✨' : ''}`}
                            >
                              {ehFoil && <span className="absolute top-0 right-1 text-[9px]">✨</span>}
                              <img src={c.icone} alt="" className="w-5 h-5" />
                              <span className="text-white/70 text-[8px] font-semibold mt-1 truncate w-full text-center px-0.5 leading-tight">{c.nome}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => { setUsuarioAberto(false); navigate('/recompensas'); }}
                    className="w-full mt-3 rounded-xl p-3 flex items-center justify-between transition-all hover:brightness-105 cursor-pointer"
                    style={{ background: 'linear-gradient(90deg, rgba(74,222,128,0.16), rgba(34,197,94,0.1))', border: '1px solid rgba(74,222,128,0.35)' }}
                    aria-label="Ver recompensas"
                  >
                    <div className="text-left">
                      <p className="text-white/45 text-[10px] uppercase tracking-widest">Seus créditos</p>
                      <p className="text-white font-bold" style={{ fontSize: 18 }}>
                        {data.pontos.toLocaleString('pt-BR')} <span className="text-[10px] font-medium opacity-60">créditos</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#4ade80] font-bold" style={{ fontSize: 18 }}>{formatarReais(valorEmReais)} R$*</p>
                      <p className="text-white/35 text-[9px]">{CREDITOS_POR_REAL} créditos = R$1,00 · referência</p>
                    </div>
                  </button>

                </div>

                <div className="space-y-1 mt-2">
                  <button
                    onClick={() => { setUsuarioAberto(false); navigate('/dashboard'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                    Ver Dashboard
                  </button>
                  <button
                    onClick={handleSair}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <path d="M16 17l5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                    Sair
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-white/20 transition-colors drop-shadow-md"
              aria-label="Menu" aria-expanded={menuAberto}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuAberto ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>
                )}
              </svg>
            </button>
=======
>>>>>>> origin/main
          </div>
          <nav className="flex-1 min-h-0 px-6 py-4 overflow-y-auto overscroll-contain touch-pan-y">
            <ul className="space-y-1">
              {links.map(link => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuAberto(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-sm font-medium transition-all border ${isActive
                        ? 'text-brand bg-card-tertiary border-brand/35'
                        : 'border-transparent text-slate-600 hover:bg-surface-hover hover:text-slate-900'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              {linksSecundarios.map(link => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuAberto(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-sm font-medium transition-all border ${isActive
                        ? 'text-brand bg-card-tertiary border-brand/35'
                        : 'border-transparent text-slate-600 hover:bg-surface-hover hover:text-slate-900'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
      <LoginModal aberto={loginAberto} onFechar={handleLoginFechar} />
    </>
  );
}