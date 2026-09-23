import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useChat } from '../context/ChatContext';
import LoginModal from '../components/LoginModal';
import Footer from '../components/Footer';

const PASSOS_LATERAIS = [
  { numero: '1', icone: '/icons/camera.svg', titulo: 'Registre ações', texto: 'Escolha uma missão sustentável e registre com foto para ganhar créditos.', rota: '/dashboard', acento: '#22c55e' },
  { numero: '2', icone: '/icons/carrinho.svg', titulo: 'Troque por prêmios', texto: 'Gaste créditos em recompensas, gire a roleta ou converta em dinheiro via Pix.', rota: '/recompensas', acento: '#a78bfa' },
  { numero: '3', icone: '/icons/trofeu.svg', titulo: 'Colecione cartas', texto: 'Cada ação pode soltar uma carta. Monte os 4 sets e ative a química.', rota: '/colecao', acento: '#facc15' },
  { numero: '4', icone: '/icons/arvore.svg', titulo: 'Evolua e dispute', texto: 'Créditos sobem seu nível (Semente a Floresta) e sua posição no ranking.', rota: '/dashboard', acento: '#38bdf8' },
];

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
      <section className="relative min-h-dvh xl:h-dvh w-full overflow-hidden pt-24 pb-4 flex flex-col">
        <div className="[background:var(--t-bg-app)] pointer-events-none fixed inset-0" />

        <div className="relative z-10 pt-2 w-full max-w-[1900px] mx-auto flex items-center justify-center gap-x-5 px-6 flex-1 min-h-0">

          <aside className="hidden xl:flex flex-col items-start gap-5 w-72.5 shrink-0 self-stretch justify-center">
            {PASSOS_LATERAIS.slice(0, 2).map((passo, i) => (
              <div key={passo.numero} className="w-full shrink-0" style={{ animation: `float ${5 + i * 0.3}s ease-in-out ${i * 0.6}s infinite` }}>
                <PassoCard passo={passo} navigate={navigate} />
              </div>
            ))}
          </aside>

          <div
            className="[background:var(--t-glass-hero)] border border-[var(--t-glass-hero-border)] shadow-glass-hero rounded-3xl flex flex-col lg:flex-row items-center gap-8 lg:gap-0 relative overflow-hidden flex-1 min-w-0 max-w-[1040px]"
            style={{ padding: 'clamp(30px, 4vw, 44px) clamp(18px, 4vw, 44px)', minHeight: 330 }}
          >
            <div
              className="pointer-events-none absolute top-0 left-0 right-0 h-px opacity-60"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
            />

            <div className="flex-1 flex flex-col items-start gap-5 z-10">
              <div className="flex items-center gap-2 [background:var(--t-glass)] border border-[var(--t-glass-border)] backdrop-blur rounded-full px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-white text-xs font-semibold tracking-wide uppercase">Plataforma IA Sustentável</span>
              </div>

              <h1
                className="text-white leading-[1.05]"
                style={{ fontSize: 'clamp(34px, 3.8vw, 52px)', letterSpacing: '-0.01em', maxWidth: 500 }}
              >
                Transforme ações sustentáveis em{" "}
                <em className="not-italic" style={{ color: '#FACC15' }}>impacto real</em>
              </h1>

<p className="text-white/70 leading-relaxed" style={{ fontSize: 18, maxWidth: 480 }}>
  Sua rotina sustentável vale créditos: registre ações com foto, acumule pontos e troque por
  recompensas ou dinheiro via Pix — com cartas, níveis e ranking para deixar tudo mais divertido.
</p>

              <div className="flex items-center gap-3 flex-wrap mt-2">
                <button
                  onClick={handleComecar}
                  className="rounded-full font-semibold text-(--t-hero-text) transition-all hover:brightness-105 active:scale-95 cursor-pointer"
                  style={{
                    background: 'var(--t-hero-btn)',
                    padding: '15px 34px',
                    fontSize: 16,
                    boxShadow: 'var(--t-hero-shadow)',
                  }}
                >
                  Começar Agora
                </button>
                <Link
                  to="/sobre"
                  className="rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition-all active:scale-95"
                  style={{ padding: '15px 34px', fontSize: 16 }}
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

            <div className="shrink-0 flex items-center justify-center relative max-w-full w-[260px] h-[310px] sm:w-[320px] sm:h-[370px] lg:w-[360px] lg:h-[410px]">
              <div className="animate-float drop-shadow-[0_30px_30px_var(--t-island-shadow)] absolute inset-0">
                <img
                  src="/imagens/Ilha.png"
                  alt="Ilha Flutuante com Cachoeira"
                  className="w-full h-full object-contain scale-[1.75]"
                />
              </div>
            </div>
          </div>

          <aside className="hidden xl:flex flex-col items-start gap-5 w-72.5 shrink-0 self-stretch justify-center">
            {PASSOS_LATERAIS.slice(2).map((passo, i) => (
              <div key={passo.numero} className="w-full shrink-0" style={{ animation: `float ${5 + (i + 2) * 0.3}s ease-in-out ${(i + 2) * 0.6}s infinite` }}>
                <PassoCard passo={passo} navigate={navigate} />
              </div>
            ))}
          </aside>
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 xl:hidden">
          {PASSOS_LATERAIS.map((passo, i) => (
            <div key={passo.numero} className="w-full shrink-0" style={{ animation: `float ${5 + i * 0.3}s ease-in-out ${i * 0.6}s infinite` }}>
              <PassoCard passo={passo} navigate={navigate} />
            </div>
          ))}
        </div>

        <div className="relative z-10 mt-5 xl:mt-3 shrink-0 flex flex-col items-center w-full pb-2">
          <div className="flex items-center gap-3 mb-3 opacity-80">
            <LeafSmall />
            <p className="text-slate-600 italic tracking-[0.15em] text-base font-serif-display">
              Sustentabilidade não é sacrifício. É evolução.
            </p>
            <LeafSmall flip />
          </div>

          <div className="flex items-center gap-6 lg:gap-10 flex-wrap justify-center mt-4">
            {[
              { value: '95%', label: 'de energia economizada reciclando alumínio' },
              { value: '22kg', label: 'de CO₂ capturados por uma árvore ao ano' },
              { value: '8Mt', label: 'de plástico novos chegam aos oceanos por ano' },
            ].map((s) => (
              <div key={s.label} className="text-center hover:opacity-90 transition-opacity px-2 max-w-45">
                <p className="font-serif-display text-slate-900 mb-1" style={{ fontSize: 36 }}>
                  {s.value}
                </p>
                <p className="text-slate-500 text-xs tracking-wide leading-snug">{s.label}</p>
              </div>
            ))}
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

interface PassoCardProps {
  passo: (typeof PASSOS_LATERAIS)[number];
  navigate: (to: string) => void;
}

function PassoCard({ passo, navigate }: PassoCardProps) {
  return (
    <button
      type="button"
      onClick={() => navigate(passo.rota)}
      className="bg-(--t-glass-side) border border-[var(--t-glass-side-border)] shadow-glass-side rounded-[22px] p-5 text-left flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 group cursor-pointer w-full relative overflow-hidden"
      aria-label={`Como funciona, passo ${passo.numero}: ${passo.titulo}. Abrir.`}
      title={`${passo.titulo} — abrir`}
    >
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${passo.acento}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-12 -right-12 w-32 h-32 rounded-full opacity-10 transition-opacity duration-300 group-hover:opacity-25"
        style={{ background: `radial-gradient(circle, ${passo.acento}, transparent 70%)` }}
      />

      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
            style={{boxShadow: '0 6px 18px var(--t-glow)' }}
          >
            <img src={passo.icone} alt="" className="w-6 h-6" />
          </div>
          <span
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-(--t-onaccent) border border-white/40"
            style={{ background: passo.acento, boxShadow: `0 2px 8px ${passo.acento}66` }}
          >
            {passo.numero}
          </span>
        </div>
        <p className="text-slate-900 font-bold text-sm leading-tight">{passo.titulo}</p>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed">{passo.texto}</p>
      <span className="mt-auto text-brand text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all pt-1">
        Abrir
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </span>
    </button>
  );
}