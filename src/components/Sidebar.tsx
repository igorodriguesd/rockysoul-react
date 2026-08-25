import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/verificar', label: 'Verificar' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/faq', label: 'FAQ' },
  { to: '/integrantes', label: 'Integrantes' },
  { to: '/contato', label: 'Contato' },
];

export default function Sidebar() {
  const [aberta, setAberta] = useState(false);

  return (
    <>
      <button
        onClick={() => setAberta(!aberta)}
        className="fixed top-4 left-4 z-50 md:hidden w-10 h-10 bg-[#1a9e1a] rounded-lg flex items-center justify-center text-white"
        aria-label="Menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {aberta ? <path d="M18 6L6 18M6 6l12 12" /> : <><path d="M3 12h18" /><path d="M3 6h18" /><path d="M3 18h18" /></>}
        </svg>
      </button>

      {aberta && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setAberta(false)} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-[240px] bg-white shadow-md z-50 flex flex-col py-6 px-4
        transition-transform duration-300
        md:translate-x-0
        ${aberta ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center gap-3 mb-8 px-2">
          <img src="/imagens/logo.png" alt="Logo" className="w-9 h-9" />
          <span className="font-bold text-[#1a9e1a] text-lg">RockySoulUp</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setAberta(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#f0faf0] text-[#1a9e1a] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-2 text-xs text-gray-400">
          FIAP 2026 · 1TDSPG
        </div>
      </aside>
    </>
  );
}
