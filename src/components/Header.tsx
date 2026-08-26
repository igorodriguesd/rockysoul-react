import { useState } from 'react';
import { NavLink } from 'react-router-dom';
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

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-[1200px]">
        <div className="bg-white/70 backdrop-blur-xl shadow-lg rounded-2xl px-5 py-3 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <img src="/imagens/logo.png" alt="RockySoulUp" className="w-7 h-7" />
            <span className="font-bold text-[#22c55e] text-sm hidden sm:block">RockySoulUp</span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-[#22c55e] bg-[#22c55e]/10'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {data.nome && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {data.nome[0].toUpperCase()}
              </div>
            )}

            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100/50 transition-colors"
              aria-label="Menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuAberto ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuAberto && (
          <div className="md:hidden mt-2 bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl p-3 mx-0">
            <nav className="flex flex-col gap-1">
              {links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuAberto(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'text-[#22c55e] bg-[#22c55e]/10'
                        : 'text-gray-600 hover:bg-gray-100/50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {menuAberto && (
        <div className="fixed inset-0 z-[99] md:hidden" onClick={() => setMenuAberto(false)} />
      )}
    </>
  );
}
