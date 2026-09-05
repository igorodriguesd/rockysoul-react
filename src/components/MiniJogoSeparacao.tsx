import { useEffect, useRef, useState } from 'react';

type Categoria = 'reciclavel' | 'organico' | 'vidro' | 'metal';

interface ItemLixo {
  id: string;
  nome: string;
  categoria: Categoria;
  emoji: string;
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
  { id: 'pet', nome: 'Garrafa PET', categoria: 'reciclavel', emoji: '🧴' },
  { id: 'copo-plastico', nome: 'Copo plástico', categoria: 'reciclavel', emoji: '🥤' },
  { id: 'papelao', nome: 'Caixa de papelão', categoria: 'reciclavel', emoji: '📦' },
  { id: 'jornal', nome: 'Jornal', categoria: 'reciclavel', emoji: '📰' },
  { id: 'sacola', nome: 'Sacola plástica', categoria: 'reciclavel', emoji: '🛍️' },
  { id: 'casca-banana', nome: 'Casca de banana', categoria: 'organico', emoji: '🍌' },
  { id: 'sobras', nome: 'Sobras de comida', categoria: 'organico', emoji: '🍽️' },
  { id: 'borra-cafe', nome: 'Borra de café', categoria: 'organico', emoji: '☕' },
  { id: 'casca-ovo', nome: 'Casca de ovo', categoria: 'organico', emoji: '🥚' },
  { id: 'garrafa-vidro', nome: 'Garrafa de vidro', categoria: 'vidro', emoji: '🍾' },
  { id: 'pote-vidro', nome: 'Pote de vidro', categoria: 'vidro', emoji: '🫙' },
  { id: 'copo-vidro', nome: 'Copo de vidro', categoria: 'vidro', emoji: '🥛' },
  { id: 'lata', nome: 'Lata de alumínio', categoria: 'metal', emoji: '🥫' },
  { id: 'pregos', nome: 'Pregos e parafusos', categoria: 'metal', emoji: '🔩' },
  { id: 'talher', nome: 'Talheres de metal', categoria: 'metal', emoji: '🍴' },
  { id: 'tampa', nome: 'Tampa metálica', categoria: 'metal', emoji: '🥧' },
];

const FASES = [
  { itens: 5, tempo: 30 },
  { itens: 7, tempo: 25 },
  { itens: 9, tempo: 20 },
];

const RECORDE_KEY = 'rocky_minijogo_recorde';

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

function medalha(pontos: number): { emoji: string; nome: string } {
  if (pontos >= 300) return { emoji: '🏆', nome: 'Mestre da Reciclagem' };
  if (pontos >= 150) return { emoji: '🥈', nome: 'Reciclador' };
  if (pontos >= 60) return { emoji: '🥉', nome: 'Aprendiz' };
  return { emoji: '🌱', nome: 'Começando' };
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

  const tempoPct = ((tempo / (FASES[fase - 1]?.tempo ?? 30)) * 100);
  const melhor = recordes[0] ?? 0;

  if (compacto && !expandido) {
    return (
      <div className="glass-strong rounded-2xl p-4 w-full relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(#4ade80, transparent)' }} />
        <div className="relative flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="text-3xl select-none">🗑️</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold">Separe o Lixo</p>
            <p className="text-white/40 text-[11px]">3 fases · 3 vidas · arraste para a lixeira certa</p>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            {LIXEIRAS.map(b => (
              <span key={b.categoria} className="text-xl select-none" style={{ filter: `drop-shadow(0 0 6px ${b.cor}55)` }}>🗑️</span>
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
                <div className="text-2xl">🗑️</div>
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
            <span className={`text-sm font-bold ${tempo <= 5 ? 'text-red-400' : 'text-white/70'}`}>⏱ {tempo}s</span>
            <span className="text-sm">{'❤️'.repeat(Math.max(0, vidas))}<span className="opacity-20">{'❤️'.repeat(Math.max(0, 3 - vidas))}</span></span>
            <span className={`ml-auto text-sm font-bold ${combo >= 3 ? 'text-sun animate-pulse' : 'text-white/70'}`}>
              combo ×{combo}
            </span>
          </div>

          {/* Itens */}
          <div className="flex flex-wrap gap-2 min-h-[56px] mb-3 items-center justify-center p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {restantes.length === 0 ? (
              <p className="text-green-300 text-sm font-medium">Fase concluída! 🎉</p>
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
                  <span className="text-xl">{item.emoji}</span>
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
                <div className="text-3xl">🗑️</div>
                <p className="text-white/80 text-xs font-semibold mt-1" style={{ color: `${bin.cor}dd` }}>{bin.nome}</p>
              </div>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`mt-3 text-sm font-semibold text-center rounded-xl p-2.5 ${feedback.tipo === 'certo' ? 'text-green-300' : 'text-red-400'}`}
              style={{ background: feedback.tipo === 'certo' ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)' }}>
              {feedback.tipo === 'certo' ? (
                <>Certo! <span className="text-green-200">{feedback.item?.nome}</span> vai aí mesmo 🌱</>
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
          <div className="text-5xl mb-2 pop-in">{medalha(pontuacao).emoji}</div>
          <p className="text-white font-bold font-serif-display text-xl">{medalha(pontuacao).nome}</p>
          <p className="text-white/50 text-sm mt-0.5">{acertos} acertos · {erros} erros · combo máx ×{maxCombo}</p>
          <p className="text-green-300 font-serif-display text-3xl mt-2">{pontuacao} pts</p>
          {pontuacao === melhor && pontuacao > 0 && <p className="text-sun text-xs font-bold mt-1">🏅 NOVO RECORDE!</p>}
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