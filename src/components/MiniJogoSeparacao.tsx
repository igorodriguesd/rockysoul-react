import { useEffect, useRef, useState } from 'react';

type Categoria = 'reciclavel' | 'organico' | 'vidro' | 'metal';

interface ItemLixo {
  id: string;
  nome: string;
  categoria: Categoria;
  cor: string;
}

interface Feedback {
  tipo: 'certo' | 'erro';
  item?: ItemLixo;
}

const LIXEIRAS: { categoria: Categoria; nome: string; cor: string; dica: string }[] = [
  { categoria: 'reciclavel', nome: 'Reciclável', cor: '#4ade80', dica: 'Papel, plástico e embalagens limpas.' },
  { categoria: 'organico', nome: 'Orgânico', cor: '#ffc928', dica: 'Restos de comida e cascas viram adubo.' },
  { categoria: 'vidro', nome: 'Vidro', cor: '#60a5fa', dica: 'Vidro é 100% reciclável, sem perder qualidade.' },
  { categoria: 'metal', nome: 'Metal', cor: '#cbd5e1', dica: 'Alumínio e metais valem ouro na reciclagem.' },
];

const ITENS: ItemLixo[] = [
  { id: 'pet', nome: 'Garrafa PET', categoria: 'reciclavel', cor: '#4ade80' },
  { id: 'copo-plastico', nome: 'Copo plástico', categoria: 'reciclavel', cor: '#34d399' },
  { id: 'papelao', nome: 'Caixa de papelão', categoria: 'reciclavel', cor: '#86efac' },
  { id: 'jornal', nome: 'Jornal', categoria: 'reciclavel', cor: '#a3e635' },
  { id: 'sacola', nome: 'Sacola plástica', categoria: 'reciclavel', cor: '#6ee7b7' },
  { id: 'casca-banana', nome: 'Casca de banana', categoria: 'organico', cor: '#fbbf24' },
  { id: 'sobras', nome: 'Sobras de comida', categoria: 'organico', cor: '#f59e0b' },
  { id: 'borra-cafe', nome: 'Borra de café', categoria: 'organico', cor: '#d97706' },
  { id: 'casca-ovo', nome: 'Casca de ovo', categoria: 'organico', cor: '#fde68a' },
  { id: 'garrafa-vidro', nome: 'Garrafa de vidro', categoria: 'vidro', cor: '#38bdf8' },
  { id: 'pote-vidro', nome: 'Pote de vidro', categoria: 'vidro', cor: '#60a5fa' },
  { id: 'copo-vidro', nome: 'Copo de vidro', categoria: 'vidro', cor: '#7dd3fc' },
  { id: 'lata', nome: 'Lata de alumínio', categoria: 'metal', cor: '#cbd5e1' },
  { id: 'pregos', nome: 'Pregos e parafusos', categoria: 'metal', cor: '#94a3b8' },
  { id: 'talher', nome: 'Talheres de metal', categoria: 'metal', cor: '#e2e8f0' },
  { id: 'tampa', nome: 'Tampa metálica', categoria: 'metal', cor: '#a8a29e' },
];

const FASES = [
  { itens: 5, tempo: 30 },
  { itens: 7, tempo: 25 },
  { itens: 9, tempo: 20 },
];

const RECORDE_KEY = 'rocky_minijogo_recorde';

// -- Icones SVG (sem emojis) ------------------------------------------------

const ICONE_CATEGORIA: Record<Categoria, string[]> = {
  reciclavel: ['M7 3.5h6l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1.5-1.5Z', 'M13.5 3.5v4h4'],
  organico: ['M5 19C5 11 11 5 19.5 4.5 19 13 13 19 5 19Z', 'M5 19l7.5-7.5'],
  vidro: ['M10 3h4v2.5L12 7v11l2.5 3h-5L12 18V7l-2-1.5V3Z'],
  metal: ['M13 2 5 14h5l-1 8 8-12h-5l1-8Z'],
};

const ICONE_ITEM: Record<string, string[]> = {
  pet: ['M11 3h2v2.2l1.2 1.3v9l1.6 3a2 2 0 0 1-1.8 2.5h-4a2 2 0 0 1-1.8-2.5l1.6-3v-9L11 5.2V3Z', 'M9.5 12h5'],
  'copo-plastico': ['M8 4h8l-.5 3h-7L8 4Z', 'M8 7l1 13h6l1-13', 'M9.5 11h5'],
  'papelao': ['M4 7l8-3 8 3-8 3-8-3Z', 'M4 7v10l8 3 8-3V7', 'M12 10v10'],
  'jornal': ['M6 3h12v18H6V3Z', 'M9 6.5h6', 'M9 10h6', 'M9 13.5h6', 'M9 17h3'],
  'sacola': ['M5.5 8h13l-1 13h-11L5.5 8Z', 'M9 8V6a3 3 0 0 1 6 0v2', 'M8.5 12.5h7'],
  'casca-banana': ['M7.5 5c5 .8 8.3 4 8.6 8.8l.4 6-1-.2c-4.8-.9-8-4-8.6-8.8L7.5 5Z', 'M8 18.5l1.6-2.3'],
  'sobras': ['M5 12a7 7 0 0 0 14 0H5Z', 'M12 5v7'],
  'borra-cafe': ['M6 9h10v6a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V9Z', 'M15 11h1.2a2.8 2.8 0 0 1 0 5.6H15', 'M9 4.5l1 1.5M13 4.5l1 1.5'],
  'casca-ovo': ['M12 3c3.5 3.4 5 6.6 5 9.5A5 5 0 0 1 7 12.5c0-2.9 1.5-6.1 5-9.5Z', 'M12 3v5', 'M10 6l4 2.5'],
  'garrafa-vidro': ['M11 3h2v2l1.5 1.6V15l2 4.5H7.5l2-4.5V6.6L11 5V3Z', 'M8.5 17.5h7', 'M10 10h4'],
  'pote-vidro': ['M7 5h10', 'M9 5V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5V5l1 1.5v8.5l-1 6a2 2 0 0 1-2 1.5h-2a2 2 0 0 1-2-1.5l-1-6V6.5L9 5Z', 'M10 12h4'],
  'copo-vidro': ['M7 4h10l-1 13a3 3 0 0 1-3 2.7h-2A3 3 0 0 1 8 17L7 4Z', 'M8.5 10h7', 'M9.5 15.5h5'],
  'lata': ['M8 4h8l-1 16h-6L8 4Z', 'M8.5 5h7', 'M9.5 10.5h5', 'M9.5 14.5h5'],
  'pregos': ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z', 'M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1'],
  'talher': ['M9 3v5.5a2.5 2.5 0 0 0 2 2.4V21h2V10.9a2.5 2.5 0 0 0 2-2.4V3h-2v5h-2V3H9Z', 'M16 3v18h2V3h-2Z'],
  'tampa': ['M5 10h14l-1 10H6L5 10Z', 'M8 10V7h8v3', 'M9 13.5h6', 'M9 16.5h6'],
};

const ICONE_LIXEIRA = ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1.5 14h9L18 7', 'M10 11v6M14 11v6'];
const ICONE_CORACAO = ['M6.5 4C3.7 4 1.5 6.2 1.5 9c0 5 5.5 9.5 10.5 12 5-2.5 10.5-7 10.5-12 0-2.8-2.2-5-5-5-1.8 0-3 1-4 2-1-1-2.2-2-4-2Z'];
const ICONE_RELOGIO = ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'M12 7v5l3.5 2'];
const ICONE_CHECK = ['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z', 'm8.5 12 2.5 2.5 4.5-5'];
const ICONE_ESTRELA = ['M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.4l6-.9Z'];
const ICONE_TROFEU = ['M8 3h8v5a4 4 0 0 1-8 0V3Z', 'M8 5H5.5v1.5A2.5 2.5 0 0 0 8 9M16 5h2.5v1.5A2.5 2.5 0 0 1 16 9', 'M12 12v3', 'M8 20h8', 'M9 17h6'];
const ICONE_MEDALHA = ['M12 4c-3 0-5.5 2.5-5.5 5.5S9 15 12 15s5.5-2.5 5.5-5.5S15 4 12 4Z', 'M8.5 4.5 6.5 2M15.5 4.5 17.5 2', 'M9.5 14.5 7.5 22l4.5-2.5L16.5 22l-2-7.5'];
const ICONE_SEMENTE = ['M12 21v-6', 'M12 15c-4 0-6-3-6-7 4 0 6 3 6 7Z', 'M12 15c4 0 6-3 6-7-4 0-6 3-6 7Z'];

function Icone({ paths, className }: { paths: string[]; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

// ----------------------------------------------------------------------------

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gerarItens(fase: number): ItemLixo[] {
  const qtd = FASES[fase - 1]?.itens ?? 5;
  return embaralhar(ITENS).slice(0, qtd);
}

function medalha(pontos: number): { nome: string; cor: string; icone: string[] } {
  if (pontos >= 300) return { nome: 'Mestre da Reciclagem', cor: '#ffc928', icone: ICONE_TROFEU };
  if (pontos >= 150) return { nome: 'Reciclador', cor: '#e2e8f0', icone: ICONE_MEDALHA };
  if (pontos >= 60) return { nome: 'Aprendiz', cor: '#cd9a5b', icone: ICONE_MEDALHA };
  return { nome: 'Começando', cor: '#4ade80', icone: ICONE_SEMENTE };
}

interface MiniJogoSeparacaoProps {
  onPontos: (pontos: number) => void;
  jaJogado: boolean;
  compacto?: boolean;
}

export default function MiniJogoSeparacao({ onPontos, jaJogado, compacto = false }: MiniJogoSeparacaoProps) {
  const [expandido, setExpandido] = useState(false);
  const [estado, setEstado] = useState<'menu' | 'jogando' | 'fim'>('menu');
  const [fase, setFase] = useState(1);
  const [restantes, setRestantes] = useState<ItemLixo[]>([]);
  const [tempo, setTempo] = useState(FASES[0].tempo);
  const [vidas, setVidas] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [fluxo, setFluxo] = useState<{ id: number; texto: string; cor: string }[]>([]);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [recordes, setRecordes] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(RECORDE_KEY);
      return raw ? raw.split(',').map(Number) : [];
    } catch {
      return [];
    }
  });
  const finalizouRef = useRef(false);

  useEffect(() => {
    if (estado !== 'jogando' || tempo <= 0) return;
    const t = setTimeout(() => setTempo(x => x - 1), 1000);
    return () => clearTimeout(t);
  }, [estado, tempo]);

  useEffect(() => {
    if (estado === 'jogando' && tempo === 0) finalizar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempo, estado]);

  function iniciar() {
    finalizouRef.current = false;
    setFase(1);
    setRestantes(gerarItens(1));
    setTempo(FASES[0].tempo);
    setVidas(3);
    setCombo(0);
    setMaxCombo(0);
    setPontuacao(0);
    setAcertos(0);
    setErros(0);
    setFeedback(null);
    setFluxo([]);
    setSelecionado(null);
    setEstado('jogando');
  }

  function recolher() {
    setExpandido(false);
    setEstado('menu');
  }

  function salvarRecorde(pontos: number) {
    setRecordes(prev => {
      const novo = [...prev, pontos].sort((a, b) => b - a).slice(0, 5);
      try {
        localStorage.setItem(RECORDE_KEY, novo.join(','));
      } catch {
        /* ignore */
      }
      return novo;
    });
  }

  function finalizar() {
    if (finalizouRef.current) return;
    finalizouRef.current = true;
    setEstado('fim');
    salvarRecorde(pontuacao);
    if (pontuacao > 0) onPontos(pontuacao);
  }

  function passarFase() {
    if (fase >= 3) {
      finalizar();
      return;
    }
    const nova = fase + 1;
    setFase(nova);
    setRestantes(gerarItens(nova));
    setTempo(FASES[nova - 1].tempo);
  }

  function soltar(item: ItemLixo, categoria: Categoria) {
    if (estado !== 'jogando') return;

    if (item.categoria === categoria) {
      const novoCombo = combo + 1;
      const ganho = 10 * novoCombo;
      setPontuacao(p => p + ganho);
      setCombo(novoCombo);
      setMaxCombo(m => Math.max(m, novoCombo));
      setAcertos(a => a + 1);
      setFeedback({ tipo: 'certo', item });
      adicionarFluxo(`+${ganho}`, '#4ade80');
      const rest = restantes.filter(i => i.id !== item.id);
      setRestantes(rest);
      if (rest.length === 0) {
        setTimeout(() => setFeedback(null), 400);
        setTimeout(passarFase, 500);
      } else {
        setTimeout(() => setFeedback(null), 600);
      }
    } else {
      setCombo(0);
      setErros(e => e + 1);
      const novaVidas = vidas - 1;
      setVidas(novaVidas);
      setFeedback({ tipo: 'erro', item });
      if (novaVidas <= 0) setTimeout(finalizar, 700);
      setTimeout(() => setFeedback(null), 1100);
    }
  }

  function adicionarFluxo(texto: string, cor: string) {
    const id = Date.now() + Math.random();
    setFluxo(f => [...f, { id, texto, cor }]);
    setTimeout(() => setFluxo(f => f.filter(x => x.id !== id)), 1200);
  }

  const medalhaInfo = medalha(pontuacao);
  const tempoPct = ((tempo / (FASES[fase - 1]?.tempo ?? 30)) * 100);
  const melhor = recordes[0] ?? 0;

  if (compacto && !expandido) {
    return (
      <div className="glass-strong rounded-2xl p-4 w-full relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(#4ade80, transparent)' }} />
        <div className="relative flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="text-3xl select-none text-green-300 shrink-0">
            <Icone paths={ICONE_LIXEIRA} className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold">Separe o Lixo</p>
            <p className="text-white/40 text-[11px]">3 fases · 3 vidas · arraste para a lixeira certa</p>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            {LIXEIRAS.map(b => (
              <span key={b.categoria} style={{ color: b.cor, filter: `drop-shadow(0 0 6px ${b.cor}55)` }} className="shrink-0">
                <Icone paths={ICONE_LIXEIRA} className="w-5 h-5" />
              </span>
            ))}
          </div>
          <div className="text-right shrink-0">
            <p className="text-white/40 text-[10px] uppercase tracking-widest">Recorde</p>
            <p className="text-sun font-bold font-serif-display text-lg leading-none">{melhor} pts</p>
          </div>
          <button
            onClick={() => { setExpandido(true); iniciar(); }}
            className="rounded-full px-5 py-2 text-sm font-bold transition-all active:scale-95 cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', color: '#0f3c22' }}
          >
            Jogar
          </button>
        </div>
        {jaJogado && (
          <p className="relative text-white/35 text-[11px] text-center mt-2">Você já ganhou Pontos ECOA hoje no mini-jogo. Amanhã volta a valer!</p>
        )}
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-2xl p-5 w-full relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1">
          <p className="text-white font-semibold">Separe o Lixo</p>
          <p className="text-white/40 text-xs">Arraste (ou toque) cada item para a lixeira certa</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-[11px] uppercase tracking-widest">Recorde</p>
          <p className="text-sun font-bold font-serif-display text-lg leading-none">{melhor} pts</p>
        </div>
        {compacto && (
          <button
            onClick={recolher}
            className="ml-auto text-white/35 hover:text-white/70 text-xs underline shrink-0 cursor-pointer"
          >
            Recolher
          </button>
        )}
      </div>

      {estado === 'menu' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LIXEIRAS.map(b => (
              <div key={b.categoria} className="rounded-xl p-3 text-center" style={{ background: `${b.cor}14`, border: `1px solid ${b.cor}38` }}>
                <div className="text-2xl flex justify-center" style={{ color: b.cor }}>
                  <Icone paths={ICONE_LIXEIRA} className="w-7 h-7" />
                </div>
                <p className="text-xs font-semibold mt-1" style={{ color: `${b.cor}dd` }}>{b.nome}</p>
              </div>
            ))}
          </div>
          <ul className="text-white/50 text-xs space-y-1 py-1">
            <li>· 3 fases com dificuldade crescente</li>
            <li>· 3 vidas · acertos em sequência dobram os pontos (combo)</li>
            <li>· Errou? mostramos a lixeira certa — você aprende</li>
            <li>· Pontuação vira Pontos ECOA (uma vez por dia)</li>
          </ul>
          <button
            onClick={iniciar}
            className="w-full rounded-full py-2.5 font-bold transition-all active:scale-95 cursor-pointer"
            style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', color: '#0f3c22' }}
          >
            {jaJogado ? 'Jogar (XP já resgatado hoje)' : 'Começar'}
          </button>
        </div>
      )}

      {estado === 'jogando' && (
        <>
          {/* HUD */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-sm text-white/70">Fase {fase}/3</span>
            <div className="h-1.5 flex-1 min-w-[80px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width: `${tempoPct}%`, background: tempo <= 5 ? '#f87171' : '#4ade80' }} />
            </div>
            <span className={`text-sm font-bold inline-flex items-center gap-1 ${tempo <= 5 ? 'text-red-400' : 'text-white/70'}`}>
              <Icone paths={ICONE_RELOGIO} className="w-4 h-4" />{tempo}s
            </span>
            <span className="text-sm inline-flex items-center gap-0.5">
              <span className="text-red-400 inline-flex">
                {Array.from({ length: Math.max(0, vidas) }).map((_, i) => (
                  <Icone key={i} paths={ICONE_CORACAO} className="w-4 h-4" />
                ))}
              </span>
              {vidas < 3 && (
                <span className="opacity-25 text-white/60 inline-flex">
                  {Array.from({ length: 3 - Math.max(0, vidas) }).map((_, i) => (
                    <Icone key={i} paths={ICONE_CORACAO} className="w-4 h-4" />
                  ))}
                </span>
              )}
            </span>
            <span className={`ml-auto text-sm font-bold ${combo >= 3 ? 'text-sun animate-pulse' : 'text-white/70'}`}>
              combo ×{combo}
            </span>
          </div>

          {/* Itens */}
          <div className="flex flex-wrap gap-2 min-h-[56px] mb-3 items-center justify-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {restantes.length === 0 ? (
              <p className="text-green-300 text-sm font-medium inline-flex items-center gap-1.5">
                <Icone paths={ICONE_CHECK} className="w-4 h-4" />Fase concluída!
              </p>
            ) : (
              restantes.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
                  onClick={() => setSelecionado(s => (s === item.id ? null : item.id))}
                  className={`select-none rounded-xl px-3 py-2 flex items-center gap-2 cursor-grab active:cursor-grabbing shadow-lg transition-all hover:scale-105 ${selecionado === item.id ? 'ring-2 ring-green-300' : ''}`}
                  style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(74,222,128,0.25)' }}
                >
                  <span className="w-7 h-7 rounded-full grid place-items-center shrink-0" style={{ background: `${item.cor}22`, border: `1px solid ${item.cor}55`, color: item.cor }}>
                    <Icone paths={ICONE_ITEM[item.id] ?? ICONE_CATEGORIA[item.categoria]} className="w-4 h-4" />
                  </span>
                  <span className="text-white/85 text-xs font-medium">{item.nome}</span>
                </div>
              ))
            )}
          </div>

          {/* Lixeiras */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LIXEIRAS.map(bin => (
              <div
                key={bin.categoria}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData('text/plain');
                  const item = restantes.find(i => i.id === id);
                  if (item) soltar(item, bin.categoria);
                }}
                onClick={() => {
                  if (!selecionado) return;
                  const item = restantes.find(i => i.id === selecionado);
                  if (item) {
                    soltar(item, bin.categoria);
                    setSelecionado(null);
                  }
                }}
                className={`rounded-xl py-3 text-center transition-all cursor-pointer active:scale-95 ${feedback?.tipo === 'erro' && feedback.item?.categoria === bin.categoria ? 'shake ring-2 ring-inset' : ''}`}
                style={{
                  background: `${bin.cor}18`,
                  border: `1px solid ${bin.cor}40`,
                  boxShadow: feedback?.tipo === 'erro' && feedback.item?.categoria === bin.categoria ? `0 0 0 2px ${bin.cor}` : undefined,
                }}
              >
                <div className="text-3xl flex justify-center" style={{ color: bin.cor }}>
                  <Icone paths={ICONE_LIXEIRA} className="w-8 h-8" />
                </div>
                <p className="text-white/80 text-xs font-semibold mt-1" style={{ color: `${bin.cor}dd` }}>{bin.nome}</p>
              </div>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`mt-3 text-sm font-semibold text-center rounded-xl p-2.5 inline-flex items-center gap-1.5 w-full justify-center ${feedback.tipo === 'certo' ? 'text-green-300' : 'text-red-400'}`}
              style={{ background: feedback.tipo === 'certo' ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)' }}>
              {feedback.tipo === 'certo' ? (
                <>
                  <Icone paths={ICONE_CHECK} className="w-4 h-4" />
                  <span>Certo! <span className="text-green-200">{feedback.item?.nome}</span> vai aí mesmo</span>
                </>
              ) : (
                <>{feedback.item?.nome} <span className="text-white/70">na verdade vai no</span> <b>{LIXEIRAS.find(l => l.categoria === feedback.item?.categoria)?.nome}</b> — agora você aprendeu!</>
              )}
            </div>
          )}

          {/* Pontuacao flutuante */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {fluxo.map(f => (
              <div key={f.id} className="absolute left-1/2 top-1/3 float-up font-serif-display font-bold"
                style={{ color: f.cor, fontSize: 22, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                {f.texto}
              </div>
            ))}
          </div>
        </>
      )}

      {estado === 'fim' && (
        <div className="text-center py-2">
          <div className="mb-2 pop-in flex justify-center" style={{ color: medalhaInfo.cor }}>
            <Icone paths={medalhaInfo.icone} className="w-16 h-16" />
          </div>
          <p className="text-white font-bold font-serif-display text-xl">{medalhaInfo.nome}</p>
          <p className="text-white/50 text-sm mt-0.5">{acertos} acertos · {erros} erros · combo máx ×{maxCombo}</p>
          <p className="text-green-300 font-serif-display text-3xl mt-2">{pontuacao} pts</p>
          {pontuacao === melhor && pontuacao > 0 && (
            <p className="text-sun text-xs font-bold mt-1 inline-flex items-center gap-1">
              <Icone paths={ICONE_ESTRELA} className="w-4 h-4" />NOVO RECORDE!
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {recordes.length > 0 && (
              <div className="rounded-xl px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-white/40 text-[10px] uppercase tracking-widest">Top 5</p>
                <div className="flex gap-1.5 mt-0.5 justify-center">
                  {recordes.map((r, i) => (
                    <span key={i} className={`text-xs font-bold ${i === 0 ? 'text-sun' : 'text-white/60'}`}>{r}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="rounded-xl px-3 py-1.5" style={{ background: 'rgba(74,222,128,0.08)' }}>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Pontos ECOA</p>
              <p className="text-green-300 text-sm font-bold mt-0.5">+{pontuacao}{jaJogado ? ' (amanhã valem)' : ''}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={iniciar}
              className="rounded-full px-6 py-2 text-sm font-bold transition-all active:scale-95 cursor-pointer"
              style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', color: '#0f3c22' }}
            >
              Jogar novamente
            </button>
            {compacto && (
              <button
                onClick={recolher}
                className="rounded-full px-4 py-2 text-sm font-semibold text-white/60 border border-white/15 transition-all hover:bg-white/5 active:scale-95 cursor-pointer"
              >
                Recolher
              </button>
            )}
          </div>
        </div>
      )}

      {estado === 'menu' && jaJogado && (
        <p className="text-white/35 text-[11px] text-center mt-2">Você já ganhou Pontos ECOA hoje no mini-jogo. Amanhã volta a valer!</p>
      )}
    </div>
  );
}