import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useChat } from '../context/ChatContext';
import LoginModal from '../components/LoginModal';
import { USUARIOS_BASE } from '../data/constants';

const NIVEL_ICONES: Record<string, string> = {
  Semente: '/icons/semente.svg',
  Broto: '/icons/broto.svg',
  'Árvore': '/icons/arvore.svg',
  Expert: '/icons/trofeu.svg',
};

const DICAS_CURTAS = [
  'Reduza o plástico hoje',
  'Prefira transporte público',
  'Desligue aparelhos da tomada',
  'Ecoete: use garrafa reutilizável',
];

function dicaDoDia() {
  return DICAS_CURTAS[new Date().getDate() % DICAS_CURTAS.length];
}

export default function Home() {
  useEffect(() => { document.title = 'RockySoulUp - Home'; }, []);

  const { data, getNivel, desafioDoDia } = useData();
  const { abrirChat } = useChat();
  const navigate = useNavigate();
  const [loginAberto, setLoginAberto] = useState(false);

  function handleComecar() {
    if (data.nome) {
      navigate('/dashboard');
    } else {
      setLoginAberto(true);
    }
  }

  const nivel = getNivel();
  const ranking = [...(data.pontos > 0 ? [{ nome: data.nome, pontos: data.pontos }] : []), ...USUARIOS_BASE]
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 2);

  return (
    <>
      <section className="relative min-h-screen w-full overflow-hidden pt-4 pb-6">
        {/* Full-page gradient + decor */}
        <div className="home-bg pointer-events-none fixed inset-0">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          <div
            className="absolute rounded-full opacity-20"
            style={{
              width: 620,
              height: 620,
              top: -120,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'radial-gradient(circle, #4ade80 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <div
            className="absolute rounded-full opacity-15"
            style={{
              width: 400,
              height: 400,
              bottom: '12%',
              right: '6%',
              background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <div
            className="absolute rounded-full opacity-10"
            style={{
              width: 300,
              height: 300,
              top: '38%',
              left: '4%',
              background: 'radial-gradient(circle, #86efac 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
        </div>

        {/* ───── THREE-COLUMN LAYOUT ───── */}
        <div className="relative z-10 pt-2 w-full max-w-[1900px] mx-auto flex items-center justify-between gap-0 px-6">

          {/* LEFT SIDEBAR — hidden on mobile */}
          <aside className="hidden xl:flex flex-col items-end gap-7 w-72.5 shrink-0 self-stretch justify-center">
            <div className="animate-float-slow">
              <div className="glass-side rounded-2xl px-6 py-5 flex items-center gap-3.5 opacity-85">
                <div className="w-12 h-12 rounded-full flex items-center justify-center animate-pulse-glow" style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>
                  <img src="/icons/semente.svg" alt="" className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-widest">Conquista</p>
                  <p className="text-white text-lg font-semibold leading-tight">Semente </p>
                  <p className="text-green-300/70 text-xs">Desbloqueada!</p>
                </div>
              </div>
            </div>

            <div className="animate-float-card" style={{ animationDelay: '1.5s' }}>
              <div className="glass-side rounded-xl px-6 py-5 opacity-75" style={{ transform: 'rotate(-2deg)' }}>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Seus pontos</p>
                <p className="text-white font-serif-display leading-none" style={{ fontSize: 38 }}>
                  {data.pontos} <span className="text-green-300 text-lg font-normal">pts</span>
                </p>
              </div>
            </div>

            <div className="animate-float-slow" style={{ animationDelay: '3s' }}>
              <div className="glass-side rounded-full px-6 py-4 flex items-center gap-3 opacity-70">
                <span className="text-2xl">🍃</span>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest">Dica do dia</p>
                  <p className="text-white/85 text-base font-medium">{dicaDoDia()}</p>
                </div>
              </div>
            </div>
          </aside>

          {/* ───── HERO CARD ───── */}
          <div
            className="glass-hero rounded-3xl flex flex-col lg:flex-row items-center gap-10 lg:gap-0 relative overflow-hidden flex-1 min-w-0 max-w-260"
            style={{ padding: '56px 80px', minHeight: 500 }}
          >
            <div
              className="pointer-events-none absolute top-0 left-0 right-0 h-px opacity-60"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
            />

            {/* LEFT: Copy */}
            <div className="flex-1 flex flex-col items-start gap-7 z-10">
              <div className="flex items-center gap-2 glass rounded-full px-5 py-2.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 text-sm font-semibold tracking-wide uppercase">Plataforma IA Sustentável</span>
              </div>

              <h1
                className="text-white leading-[1.05]"
                style={{ fontSize: 'clamp(38px, 4.4vw, 58px)', letterSpacing: '-0.01em', maxWidth: 500 }}
              >
                Transforme ações sustentáveis em{" "}
                <em className="not-italic" style={{ color: '#4ade80' }}>impacto real</em>
              </h1>

              <p className="text-white/70 leading-relaxed" style={{ fontSize: 20, maxWidth: 480 }}>
                Gamifique sua jornada ecológica. Ganhe selos, suba no ranking e deixe o planeta melhor — com IA como guia.
              </p>

              <div className="flex items-center gap-3 flex-wrap mt-3">
                <button
                  onClick={handleComecar}
                  className="rounded-full font-semibold text-[#0f3c22] transition-all hover:brightness-110 active:scale-95 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                    padding: '18px 40px',
                    fontSize: 17,
                    boxShadow: '0 10px 40px rgba(74,222,128,0.35)',
                  }}
                >
                  Começar Agora
                </button>
                <Link
                  to="/sobre"
                  className="rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition-all active:scale-95"
                  style={{ padding: '18px 40px', fontSize: 17 }}
                >
                  Saiba Mais
                </Link>
              </div>

              <button
                onClick={abrirChat}
                className="text-white/40 text-lg flex items-center gap-2 hover:text-white/70 transition-colors mt-2 cursor-pointer"
              >
                <ChatIcon />
                Converse com seu assistente
              </button>
            </div>

            {/* RIGHT: Floating island */}
            <div className="shrink-0 flex items-center justify-center relative" style={{ width: 400, height: 470 }}>
              <div className="floating-island absolute inset-0">
                <img
                  src="/imagens/Ilha.png"
                  alt="Ilha Flutuante com Cachoeira"
                  className="w-full h-full object-contain scale-[1.75]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR — hidden on mobile */}
          <aside className="hidden xl:flex flex-col items-start gap-7 w-72.5 shrink-0 self-stretch justify-center">
            <div className="animate-float-slow" style={{ animationDelay: '2s' }}>
              <div className="glass-side rounded-2xl px-6 py-5 flex items-center gap-3.5 opacity-85">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #86efac, #4ade80)' }}>
                  <img src={NIVEL_ICONES[nivel] ?? '/icons/semente.svg'} alt="" className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-widest">Nível</p>
                  <p className="text-white text-lg font-semibold leading-tight">{nivel}</p>
                  <p className="text-green-300/70 text-xs">+2 esta semana</p>
                </div>
              </div>
            </div>

            <div className="animate-float-card" style={{ animationDelay: '0.8s' }}>
              <div className="glass-side rounded-xl px-6 py-5 opacity-75" style={{ transform: 'rotate(2deg)' }}>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2.5">Ranking</p>
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center text-[#0f3c22]"
                    style={{ background: '#4ade80' }}
                  >
                    1
                  </span>
                  <div>
                    <p className="text-white text-lg font-semibold leading-none">{ranking[0]?.nome.split(' ')[0] ?? '—'}</p>
                    <p className="text-green-300/70 text-xs mt-1">{ranking[0]?.pontos ?? 0} pts</p>
                  </div>
                </div>
                {ranking[1] && (
                  <div className="flex items-center gap-3 mt-2.5 opacity-60">
                    <span className="text-sm font-bold text-white/60 w-7 text-center">2</span>
                    <div>
                      <p className="text-white/75 text-base leading-none">{ranking[1].nome.split(' ')[0]} · {ranking[1].pontos} pts</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="animate-float-slow" style={{ animationDelay: '4s' }}>
              <div className="glass-side rounded-full px-6 py-4 flex items-center gap-3 opacity-70">
                <img src={desafioDoDia.icone} alt="" className="w-6 h-6" />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest">Desafio do dia</p>
                  <p className="text-white/85 text-base font-medium">{desafioDoDia.nome} +{desafioDoDia.pontos} pts</p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ───── SIGNATURE + STATS ───── */}
        <div className="relative z-10 mt-16 flex flex-col items-center w-full pb-8">
          <div className="flex items-center gap-3 mb-3 opacity-80">
            <LeafSmall />
            <p className="text-white/80 italic tracking-[0.15em] text-base font-serif-display">
              Sustentabilidade não é sacrifício. É evolução.
            </p>
            <LeafSmall flip />
          </div>

          <div className="flex items-center gap-6 lg:gap-10 flex-wrap justify-center mt-4">
            {[
              { value: '12k+', label: 'Usuários ativos' },
              { value: '340t', label: 'CO₂ evitado' },
              { value: '98%', label: 'Engajamento' },
            ].map((s) => (
              <div key={s.label} className="text-center hover:opacity-90 transition-opacity px-2">
                <p className="font-serif-display text-white mb-1" style={{ fontSize: 36 }}>
                  {s.value}
                </p>
                <p className="text-white/60 text-sm tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LoginModal aberto={loginAberto} onFechar={() => setLoginAberto(false)} />
    </>
  );
}

/* ─── Small UI icons ─── */

function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 2h10a1 1 0 011 1v6a1 1 0 01-1 1H5l-3 2V3a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LeafSmall({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path d="M3 13C3 13 3 5 11 3C11 3 13 9 7 12L3 13Z" fill="#22c55e" fillOpacity="0.8" />
      <path d="M3 13L8 8" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}