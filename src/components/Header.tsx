import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import LoginModal from './LoginModal';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/recompensas', label: 'Recompensas' },
  { to: '/solucao', label: 'Solução' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/faq', label: 'FAQ' },
  { to: '/integrantes', label: 'Equipe' },
  { to: '/contato', label: 'Contato' },
];

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [usuarioAberto, setUsuarioAberto] = useState(false);
  const [loginAberto, setLoginAberto] = useState(false);
  const { data, getNivel, resetar } = useData();
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLDivElement>(null);

  const usuarioLogado = Boolean(data.nome.trim());

  const nivel = getNivel();

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

  function handleEntrar() {
    setLoginAberto(true);
  }

  function handleLoginFechar() {
    setLoginAberto(false);
    setUsuarioAberto(true);
  }

  function handleSair() {
    resetar();
    setUsuarioAberto(false);
    navigate('/');
  }

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-100 w-[calc(100%-2rem)] max-w-275 px-5 sm:px-6 lg:px-8 py-4 flex items-center justify-between rounded-3xl bg-[#0c3a22]/30 backdrop-blur-xl border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.18)] box-border">
        {/* Logo sozinho na esquerda */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <img src="/imagens/logo.png" alt="RockySoulUp" className="h-7 w-auto opacity-90" />
          <span
            className="font-brand font-bold text-white tracking-tight drop-shadow-md"
            style={{ fontSize: 22 }}
          >
            RockySoulUp
          </span>
        </NavLink>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-4">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setUsuarioAberto(false)}
                className={({ isActive }) =>
                  `px-1 py-1.5 text-sm font-semibold transition-all drop-shadow-md ${isActive
                    ? 'text-[#4ade80] border-b-2 border-[#4ade80]'
                    : 'text-white hover:text-[#4ade80]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 relative" ref={avatarRef}>
            {usuarioLogado ? (
              <button
                onClick={() => setUsuarioAberto(o => !o)}
                className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm pl-1 pr-3 py-1 transition-colors border border-white/15 cursor-pointer"
                aria-haspopup="true"
                aria-expanded={usuarioAberto}
                aria-label="Menu do usuário"
              >
                <span className="w-8 h-8 rounded-full bg-linear-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {data.nome[0].toUpperCase()}
                </span>
                <span className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-white text-xs font-semibold max-w-22.5 truncate">{data.nome.split(' ')[0]}</span>
                  <span className="text-[#4ade80] text-[10px] font-medium">{data.pontos} pts</span>
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${usuarioAberto ? 'rotate-180' : ''}`}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleEntrar}
                className="flex items-center gap-2 rounded-full bg-[#22c55e] hover:bg-[#16a34a] px-4 py-2 text-white text-sm font-semibold transition-colors shadow-md cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                </svg>
                Entrar
              </button>
            )}

            {usuarioAberto && (
              <div className="absolute right-0 top-full mt-3 w-64 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/40 p-3 z-120">
                <div className="flex items-center gap-3 px-2 py-2 border-b border-gray-100 mb-2">
                  <span className="w-11 h-11 rounded-full bg-linear-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0">
                    {data.nome[0].toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{data.nome}</p>
                    <p className="text-xs text-gray-400 truncate">{data.email || 'email não informado'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 px-1 py-2 border-b border-gray-100 mb-2">
                  <div className="bg-[#22c55e]/8 rounded-xl px-2.5 py-2 text-center">
                    <p className="text-base font-bold text-[#16a34a] leading-none">{data.pontos}</p>
                    <p className="text-[10px] text-gray-400 mt-1">pontos</p>
                  </div>
                  <div className="bg-[#22c55e]/8 rounded-xl px-2.5 py-2 text-center">
                    <p className="text-base font-bold text-[#16a34a] leading-none">{nivel}</p>
                    <p className="text-[10px] text-gray-400 mt-1">nível</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => { setUsuarioAberto(false); navigate('/dashboard'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
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
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-white/20 transition-colors drop-shadow-md"
              aria-label="Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuAberto ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {menuAberto && (
        <div className="fixed top-20 right-6 z-100 md:hidden w-48 bg-white/90 backdrop-blur-xl shadow-lg rounded-2xl p-3">
          <nav className="flex flex-col gap-1">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => { setMenuAberto(false); setUsuarioAberto(false); }}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? 'text-[#22c55e] bg-[#22c55e]/10'
                    : 'text-gray-800 hover:bg-gray-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {menuAberto && (
        <div className="fixed inset-0 z-99 md:hidden" onClick={() => setMenuAberto(false)} />
      )}

      <LoginModal aberto={loginAberto} onFechar={handleLoginFechar} />
    </>
  );
}