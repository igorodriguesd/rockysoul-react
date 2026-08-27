import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/recompensas', label: 'Recompensas' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/faq', label: 'FAQ' },
  { to: '/integrantes', label: 'Equipe' },
  { to: '/contato', label: 'Contato' },
];

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { data } = useData();
  const location = useLocation();

  const linksParaMostrar = location.pathname === '/' 
    ? links.filter(link => ['/', '/dashboard', '/recompensas', '/sobre'].includes(link.to))
    : links;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-[100] px-8 py-5 flex items-center justify-between">
        
        {/* Logo sozinho na esquerda */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <img src="/imagens/logo.png" alt="RockySoulUp" className="w-7 h-7" />
          <span className="font-bold text-[#22c55e] text-lg hidden sm:block drop-shadow-md">
            RockySoulUp
          </span>
        </NavLink>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-4">
            {linksParaMostrar.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-1 py-1.5 text-sm font-semibold transition-all drop-shadow-md ${
                    isActive
                      ? 'text-[#4ade80] border-b-2 border-[#4ade80]'
                      : 'text-white hover:text-[#4ade80]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {data.nome && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white text-xs font-bold shadow-md">
                {data.nome[0].toUpperCase()}
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
        <div className="fixed top-20 right-6 z-[100] md:hidden w-48 bg-white/90 backdrop-blur-xl shadow-lg rounded-2xl p-3">
          <nav className="flex flex-col gap-1">
            {linksParaMostrar.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuAberto(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
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
        <div className="fixed inset-0 z-[99] md:hidden" onClick={() => setMenuAberto(false)} />
      )}
    </>
  );
}