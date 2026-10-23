import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useChat } from '../context/ChatContext';
import LoginModal from '../components/LoginModal';
<<<<<<< HEAD
import CollectionChip from '../components/CollectionChip';
=======
import Footer from '../components/Footer';
import IlhaRockySoul from '../components/IlhaRockySoul';
>>>>>>> origin/main

const PASSOS_LATERAIS = [
  { numero: '1', icone: '/icons/camera.svg', titulo: 'Registre', texto: 'Uma missão sustentável com foto.', rota: '/dashboard', acento: '#22c55e' },
  { numero: '2', icone: '/icons/carrinho.svg', titulo: 'Ganhe', texto: 'Créditos para gastar ou converter.', rota: '/recompensas', acento: '#a78bfa' },
  { numero: '3', icone: '/icons/trofeu.svg', titulo: 'Colecione', texto: 'Cartas por set, foil e química.', rota: '/colecao', acento: '#facc15' },
  { numero: '4', icone: '/icons/arvore.svg', titulo: 'Evolua', texto: 'Seu nível vai de Broto a Floresta.', rota: '/dashboard', acento: '#38bdf8' },
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

<<<<<<< HEAD
  const nivel = getNivel();
  const ranking = [...(data.nome ? [{ nome: data.nome, pontos: data.pontos }] : [])]
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 2);

=======
>>>>>>> origin/main
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

<<<<<<< HEAD
              <p className="text-white/70 leading-relaxed" style={{ fontSize: 20, maxWidth: 480 }}>
                Registre suas ações ecológicas, acompanhe a revisão das evidências e consulte seus pontos e sua coleção
                e deixe o planeta melhor — com IA como guia.
=======
              <p className="text-white/70 leading-relaxed" style={{ fontSize: 18, maxWidth: 480 }}>
                Transforme hábitos sustentáveis em créditos, recompensas e conquistas.
>>>>>>> origin/main
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
<<<<<<< HEAD

          {/* ASIDE DIREITA - CARDS LATERAIS */}
          <aside className="hidden xl:flex flex-col items-start gap-7 w-72.5 shrink-0 self-stretch justify-center">
            {/* Card Nível - Borda Verde Menta */}
            <div>
              <div
                className="glass-side rounded-2xl px-6 py-5 flex items-center gap-3.5 opacity-85 transition-transform duration-300 hover:-translate-y-2"
                style={{
                  border: '1px solid rgba(134, 239, 172, 0.4)',
                  boxShadow: '0 4px 20px rgba(134, 239, 172, 0.15)',
                }}
              >
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

            {/* Card Ranking - Borda Dourada */}
            <div>
              <div
                className="glass-side rounded-xl px-6 py-5 opacity-75 rotate-2 transition-transform duration-300 hover:-translate-y-2"
                style={{
                  border: '1px solid rgba(245, 196, 81, 0.45)',
                  boxShadow: '0 4px 20px rgba(245, 196, 81, 0.15)',
                }}
              >
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2.5">Meu saldo</p>
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center text-[#0f3c22]"
                    style={{ background: '#4ade80' }}
                  >
                    •
                  </span>
                  <div>
                    <p className="text-white text-lg font-semibold leading-none">{ranking[0]?.nome.split(' ')[0] ?? '—'}</p>
                    <p className="text-green-300/70 text-xs mt-1">{ranking[0]?.pontos ?? 0} pts</p>
                  </div>
                </div>
                {ranking[1] && (
                  <div className="flex items-center gap-3 mt-2.5 opacity-60">
                    <span className="text-sm font-bold text-[#ffffff99] w-7 text-center">2</span>
                    <div>
                      <p className="text-white/75 text-base leading-none">{ranking[1].nome.split(' ')[0]} · {ranking[1].pontos} pts</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Desafio do Dia - Borda Laranja/Âmbar */}
            <div>
              <div
                className="glass-side rounded-full px-6 py-4 flex items-center gap-3 opacity-70 transition-transform duration-300 hover:-translate-y-2"
                style={{
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  boxShadow: '0 4px 20px rgba(245, 158, 11, 0.15)',
                }}
              >
                <img src={desafioDoDia.icone} alt="" className="w-6 h-6" />
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest">Ação do catálogo</p>
                  <p className="text-white/85 text-base font-medium">{desafioDoDia.nome} · {desafioDoDia.pontos} pts após aprovação</p>
                </div>
              </div>
            </div>
          </aside>
=======
>>>>>>> origin/main
        </div>

        <div className="relative z-10 max-w-[1100px] mx-auto px-6 mt-6 w-full shrink-0">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LeafSmall />
            <p className="text-white/80 tracking-[0.12em] text-sm font-semibold uppercase text-center">Como funciona</p>
            <LeafSmall flip />
          </div>
          <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {PASSOS_LATERAIS.map((passo) => (
              <button
                key={passo.numero}
                type="button"
                onClick={() => navigate(passo.rota)}
                className="bg-(--t-glass-side) border border-[var(--t-glass-side-border)] shadow-glass-side rounded-2xl px-3.5 py-3 text-left flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer relative overflow-hidden"
                role="link"
                aria-label={`Como funciona, passo ${passo.numero}: ${passo.titulo}. Abrir.`}
              >
                <div
                  className="pointer-events-none absolute top-0 left-0 right-0 h-px opacity-70"
                  style={{ background: `linear-gradient(90deg, transparent, ${passo.acento}, transparent)` }}
                />
                <span
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                  style={{ background: `${passo.acento}22`, border: `1px solid ${passo.acento}55` }}
                >
                  <img src={passo.icone} alt="" className="w-5 h-5" />
                </span>
                <span className="block flex-1 min-w-0 leading-tight">
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-[11px] font-extrabold" style={{ color: passo.acento }}>0{passo.numero}</span>
                    <span className="text-slate-900 font-extrabold text-sm truncate">{passo.titulo}</span>
                  </span>
                  <span className="block text-slate-500 text-[11px] leading-snug mt-0.5">{passo.texto}</span>
                </span>
                <svg aria-hidden="true" className="shrink-0 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            ))}
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
<<<<<<< HEAD

          <div className="flex items-center gap-6 lg:gap-10 flex-wrap justify-center mt-4">
            {[
              { value: 'Ações', label: 'Evidências com revisão' },
              { value: 'Pontos', label: 'Crédito após aprovação' },
              { value: 'Coleção', label: 'Dados confirmados pela API' },
            ].map((s) => (
              <div key={s.label} className="text-center hover:opacity-90 transition-opacity px-2">
                <p className="font-serif-display text-white mb-1" style={{ fontSize: 36 }}>
                  {s.value}
                </p>
                <p className="text-white/60 text-sm tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
=======
>>>>>>> origin/main
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
