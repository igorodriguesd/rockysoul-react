import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useChat } from '../context/ChatContext';
import LoginModal from '../components/LoginModal';
import Footer from '../components/Footer';
import IlhaRockySoul from '../components/IlhaRockySoul';

export function Home() {
  useEffect(() => { document.title = 'RockySoulUp - Home'; }, []);

  const { data } = useData();
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

  return (
    <>
      <section className="relative min-h-dvh w-full overflow-hidden pt-24 pb-4 flex flex-col">
        <div className="[background:var(--t-bg-app)] pointer-events-none fixed inset-0" />

        <div className="relative z-10 pt-2 w-full max-w-[1900px] mx-auto flex items-center justify-center px-6 flex-1 min-h-0">

          {/* HERO CENTRAL */}
          <div
            className="[background:var(--t-glass-hero)] border border-[var(--t-glass-hero-border)] shadow-glass-hero rounded-3xl flex flex-col lg:flex-row items-center gap-8 lg:gap-0 relative overflow-hidden flex-1 min-w-0 max-w-[1200px]"
            style={{ padding: 'clamp(38px, 5vw, 56px) clamp(20px, 5vw, 56px)', minHeight: 420 }}
          >
            <div
              className="pointer-events-none absolute top-0 left-0 right-0 h-px opacity-60"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
            />

            <div className="flex-1 lg:flex-none lg:w-[min(50%,560px)] flex flex-col items-start gap-5 z-10">
              <div className="flex items-center gap-2 [background:var(--t-glass)] border border-[var(--t-glass-border)] backdrop-blur rounded-full px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-white text-xs font-semibold tracking-wide uppercase">Plataforma IA Sustentável</span>
              </div>

              <h1
                className="text-white leading-[1.05]"
                style={{ fontSize: 'clamp(28px, 4.2vw, 60px)', letterSpacing: '-0.01em', maxWidth: 560 }}
              >
                Faça o bem.<br />
                Veja seu <em className="not-italic" style={{ color: '#00e676', textShadow: '0 0 12px rgba(0,230,118,0.6)' }}>impacto</em> crescer.
              </h1>

              <p className="text-white/70 leading-relaxed" style={{ fontSize: 18, maxWidth: 480 }}>
                Transforme hábitos sustentáveis em créditos, recompensas e conquistas.
              </p>

              <div className="flex items-center gap-3 flex-wrap mt-2">
                <button
                  onClick={handleComecar}
                  className="rounded-full font-semibold text-(--t-hero-text) transition-all hover:brightness-105 active:scale-95 cursor-pointer"
                  style={{
                    background: 'var(--t-hero-btn)',
                    padding: '17px 40px',
                    fontSize: 17,
                    boxShadow: 'var(--t-hero-shadow)',
                  }}
                >
                  Começar agora →
                </button>
                <Link
                  to="/sobre"
                  className="rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition-all active:scale-95"
                  style={{ padding: '17px 40px', fontSize: 17 }}
                >
                  Saiba Mais
                </Link>
              </div>

              <button
                onClick={abrirChat}
                className="text-white/40 text-base flex items-center gap-2 hover:text-white/70 transition-colors mt-1 cursor-pointer"
              >
                <ChatIcon />
                Converse com seu assistente
              </button>
            </div>

            <div className="shrink-0 w-full max-w-[380px] sm:w-[460px] lg:w-auto lg:flex-1 min-w-0 lg:self-stretch -ml-2 sm:-ml-6 lg:ml-12">
              <IlhaRockySoul />
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-7 shrink-0 flex flex-col items-center w-full pb-2">
          <div className="flex items-center justify-center gap-3 mb-3 opacity-80 px-6">
            <LeafSmall />
            <p className="text-slate-600 italic tracking-[0.15em] text-base font-serif-display text-center">
              Sustentabilidade não é sacrifício. É evolução.
            </p>
            <LeafSmall flip />
          </div>
        </div>

        <Footer />
      </section>

      <LoginModal aberto={loginAberto} onFechar={() => setLoginAberto(false)} />
    </>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LeafSmall({ flip = false }: { flip?: boolean }) {
  return (
    <svg aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 16 16"
      fill="none"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <path d="M3 13C3 13 3 5 11 3C11 3 13 9 7 12L3 13Z" fill="var(--color-brand)" fillOpacity="0.8" />
      <path d="M3 13L8 8" stroke="var(--color-brand-2)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}