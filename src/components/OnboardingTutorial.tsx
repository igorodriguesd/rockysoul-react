import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'rocky_onboarding_ja_visto';

interface Passo {
  icone: string;
  titulo: string;
  texto: string;
  acao: string;
  rota?: string;
}

const PASSOS: Passo[] = [
  {
    icone: '/icons/comunidade.svg',
    titulo: 'Registre ações',
    texto: 'Você ganha créditos registrando ações sustentáveis do dia a dia: reciclar, economizar água e energia, andar de bike, separar resíduos, plantar e muito mais — que você troca por recompensas ou dinheiro via Pix.',
    acao: 'Ver as missões',
    rota: '/dashboard',
  },
  {
    icone: '/icons/trofeu.svg',
    titulo: 'Colecione cartas',
    texto: 'Cada ação pode soltar uma carta colecionável dos influenciadores. Monte os 4 sets e ative a "química" entre cartas para aumentar o valor da sua coleção.',
    acao: 'Ver minha coleção',
    rota: '/colecao',
  },
  {
    icone: '/icons/folha.svg',
    titulo: 'Evolua e dispute com amigos',
    texto: 'Créditos sobem seu nível: Semente → Broto → Árvore → Floresta. Adicione amigos pela comunidade, compare pontos e sequência, e veja seu impacto nas empresas parceiras.',
    acao: 'Ver Dashboard',
    rota: '/dashboard',
  },
  {
    icone: '/icons/coringa.svg',
    titulo: 'Troque por recompensas',
    texto: 'Gaste créditos em prêmios, gire a roleta ou converta em dinheiro via Pix. Cartas repetidas viram fragmentos para montar as que faltam.',
    acao: 'Começar!',
    rota: '/recompensas',
  },
];

export default function OnboardingTutorial() {
  const [aberto, setAberto] = useState(false);
  const [passo, setPasso] = useState(0);
  const navigate = useNavigate();

  const marcarVisto = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* armazenamento indisponível */ }
  }, []);

  useEffect(() => {
    let jaVisto = true;
    try { jaVisto = localStorage.getItem(STORAGE_KEY) === '1'; } catch { /* armazenamento indisponível */ }
    if (!jaVisto) {
      const t = setTimeout(() => setAberto(true), 1000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [aberto]);

  function fechar(final = false) {
    if (final || passo >= PASSOS.length - 1) marcarVisto();
    setAberto(false);
  }

  function seguir() {
    fechar(true);
    const destino = PASSOS[passo].rota;
    if (destino) navigate(destino);
  }

  const atual = PASSOS[passo];

  return aberto ? (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-titulo"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => fechar(true)} />

      <div
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-7"
        style={{
          background: 'var(--t-surface)',
          border: '1px solid var(--t-brand-border)',
          boxShadow: '0 24px 80px var(--t-glow)',
        }}
      >
        <button
          type="button"
          onClick={() => fechar(true)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:bg-surface-2 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Fechar explicação"
          title="Fechar"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div
            className="w-13 h-13 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--t-grad-brand)', boxShadow: '0 6px 18px var(--t-glow)' }}
          >
            <img src={atual.icone} alt="" className="w-7 h-7" />
          </div>
          <div>
            <p className="text-brand text-[11px] font-bold uppercase tracking-widest">Como funciona</p>
            <h2 id="tutorial-titulo" className="text-slate-900 font-bold" style={{ fontSize: 20 }}>
              {passo + 1}. {atual.titulo}
            </h2>
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-4 min-h-19">{atual.texto}</p>

        <div className="flex items-center gap-1.5 mb-6" role="tablist" aria-label="Progresso do passo a passo">
          {PASSOS.map((_, i) => (
            <span
              key={i}
              aria-current={i === passo ? 'step' : undefined}
              className={`h-1.5 rounded-full transition-all ${i === passo ? 'w-6 bg-brand' : 'w-1.5 bg-slate-300'}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fechar(true)}
            className="px-4 py-2.5 rounded-full text-sm font-semibold text-slate-500 hover:bg-surface-2 transition-colors cursor-pointer"
          >
            Pular
          </button>

          <div className="flex-1" />

          {passo > 0 && (
            <button
              type="button"
              onClick={() => setPasso(p => p - 1)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-surface-2 transition-colors cursor-pointer"
              aria-label="Passo anterior"
              title="Voltar"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={seguir}
            className="rounded-full px-6 py-2.5 text-sm font-bold text-(--t-onaccent) transition-all hover:brightness-105 active:scale-95 cursor-pointer flex items-center gap-2"
            style={{ background: 'var(--t-grad-brand)', boxShadow: '0 6px 18px var(--t-glow)' }}
          >
            {atual.acao}
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  ) : null;
}