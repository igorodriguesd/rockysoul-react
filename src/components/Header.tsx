import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useColecao } from '../context/CollectionContext';
import { CREDITOS_POR_REAL } from '../data/constants';
import { CARTAS, PESO_RARIDADE } from '../data/cartas';
import LoginModal from './LoginModal';

const NIVEL_ICONE_HEADER: Record<string, string> = {
  Semente: '/icons/semente.svg',
  Broto: '/icons/broto.svg',
  'Árvore': '/icons/arvore.svg',
  Expert: '/icons/trofeu.svg',
};

function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function progressoParaNivel(pontos: number): number {
  if (pontos >= 1000) return 100;
  if (pontos >= 300) return 30 + ((pontos - 300) / 700) * 70;
  if (pontos >= 100) return 10 + ((pontos - 100) / 200) * 20;
  return (pontos / 100) * 10;
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/colecao', label: 'Coleção' },
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
  const { colecao, getValorTotal } = useColecao();
  const navigate = useNavigate();
  const avatarRef = useRef<HTMLDivElement>(null);

  const usuarioLogado = Boolean(data.nome.trim());

  const nivel = getNivel();
  const progresso = progressoParaNivel(data.pontos);
  const valorEmReais = data.pontos / CREDITOS_POR_REAL;
  const arcR = 40;
  const arcCirc = 2 * Math.PI * arcR;

  const foils = new Set(colecao.cartasFoil ?? []);
  const vitrine = CARTAS
    .filter(c => colecao.cartasObtidas.includes(c.id))
    .sort((a, b) => {
      const fa = foils.has(a.id) ? 1 : 0;
      const fb = foils.has(b.id) ? 1 : 0;
      if (fa !== fb) return fb - fa;
      return PESO_RARIDADE[b.raridade] - PESO_RARIDADE[a.raridade];
    })
    .slice(0, 4);
  const valorTotal = getValorTotal();

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
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-100 w-[calc(100%-2rem)] max-w-275 px-5 sm:px-6 py-4 flex items-center justify-between rounded-3xl bg-[#0c3a22]/85 border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.18)] box-border">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <img src="/imagens/logo.png" alt="RockySoulUp" className="h-7 w-auto opacity-90" />
          <span
            className="font-brand font-bold text-white tracking-tight drop-shadow-md"
            style={{ fontSize: 20 }}
          >
            RockySoulUp
          </span>
        </NavLink>

        <div className="flex items-center gap-5">
          <nav className="hidden lg:flex items-center gap-3">
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
                  {data.nome?.trim()?.[0]?.toUpperCase() || 'U'}
                </span>
                <span className="hidden xl:flex flex-col items-start leading-tight">
                  <span className="text-white text-xs font-semibold max-w-90px truncate">{data.nome?.trim()?.split(' ')?.[0] || 'Usuário'}</span>
                  <span className="text-[#4ade80] text-[10px] font-medium">{data.pontos} créditos</span>
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
              <div className="absolute right-0 top-full mt-3 w-72 rounded-2xl bg-[#0f1c2e]/95 shadow-2xl border border-white/10 p-3 z-120">
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
                    aria-label="Ver conversão de créditos"
                  >
                    <div className="text-left">
                      <p className="text-white/45 text-[10px] uppercase tracking-widest">Seus créditos</p>
                      <p className="text-white font-bold" style={{ fontSize: 18 }}>
                        {data.pontos.toLocaleString('pt-BR')} <span className="text-[10px] font-medium opacity-60">créditos</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#4ade80] font-bold" style={{ fontSize: 18 }}>R$ {formatarReais(valorEmReais)}</p>
                      <p className="text-white/35 text-[9px]">{CREDITOS_POR_REAL} créditos = R$1,00 · converter</p>
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
        <div className="fixed top-20 right-6 z-100 lg:hidden w-48 bg-[#0f1c2e]/95 shadow-lg rounded-2xl p-3 border border-white/10">
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
                    : 'text-white/80 hover:bg-white/5'
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
        <div className="fixed inset-0 z-99 lg:hidden" onClick={() => setMenuAberto(false)} />
      )}

      <LoginModal aberto={loginAberto} onFechar={handleLoginFechar} />
    </>
  );
}