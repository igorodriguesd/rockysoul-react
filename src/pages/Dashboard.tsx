import { useEffect, useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { MISSOES, USUARIOS_BASE, CURIOSIDADES, RECOMPENSAS } from '../data/constants';
import VerificarModal from '../components/VerificarModal';
import MiniJogoSeparacao from '../components/MiniJogoSeparacao';

interface RankingUser {
  nome: string;
  pontos: number;
}

interface AtividadeItem {
  id: string;
  nome: string;
  pontos: number;
  tipo: 'acao' | 'resgate' | 'conversao';
  icone: string;
  data: string;
  timestamp: number;
}

const MISSAO_ICONE_MAP: Record<string, string> = {
  reciclagem: '/icons/reciclagem.svg',
  transporte: '/icons/transporte.svg',
  energia: '/icons/energia.svg',
  agua: '/icons/agua.svg',
  bicicleta: '/icons/bicicleta.svg',
  plantio: '/icons/arvore.svg',
  banho: '/icons/banho.svg',
  compostagem: '/icons/muda.svg',
  consumo: '/icons/carrinho.svg',
  garrafa: '/icons/agua.svg',
  educar: '/icons/comunidade.svg',
  sacola: '/icons/folha.svg',
  captacao: '/icons/agua.svg',
  mobilidade: '/icons/bateria.svg',
  ciclovia: '/icons/transporte.svg',
  solar: '/icons/energia.svg',
  eolica: '/icons/energia.svg',
  led: '/icons/bateria.svg',
  horta: '/icons/muda.svg',
  agrofloresta: '/icons/arvore.svg',
};

const MISSAO_COR_MAP: Record<string, string> = {
  reciclagem: '#4ade80',
  transporte: '#7dd3fc',
  energia: '#a3e635',
  agua: '#7dd3fc',
  bicicleta: '#4ade80',
  plantio: '#86efac',
  banho: '#7dd3fc',
  compostagem: '#a3e635',
  consumo: '#c4b5fd',
  garrafa: '#7dd3fc',
  educar: '#c4b5fd',
  sacola: '#86efac',
  captacao: '#7dd3fc',
  mobilidade: '#eab308',
  ciclovia: '#7dd3fc',
  solar: '#eab308',
  eolica: '#eab308',
  led: '#f5c451',
  horta: '#a3e635',
  agrofloresta: '#86efac',
};

const NIVEL_ICONE: Record<string, string> = {
  Semente: '/icons/semente.svg',
  Broto: '/icons/broto.svg',
  'Árvore': '/icons/arvore.svg',
  Expert: '/icons/trofeu.svg',
};

function getGreeting(nivel: string): string {
  switch (nivel) {
    case 'Semente': return 'Continue plantando sementes!';
    case 'Broto': return 'Você está crescendo!';
    case 'Árvore': return 'Que impacto incrível!';
    case 'Expert': return 'Você é uma lenda!';
    default: return 'Bem-vindo!';
  }
}

function nivelPorPontos(pontos: number): string {
  if (pontos >= 1000) return 'Expert';
  if (pontos >= 300) return 'Árvore';
  if (pontos >= 100) return 'Broto';
  return 'Semente';
}

function parseData(raw: string): Date {
  if (!raw) return new Date(0);
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d;
  const m = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})[, ]+(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4]), Number(m[5]), Number(m[6] || 0));
  return new Date(0);
}

function timeAgo(data: string): string {
  const date = parseData(data);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'agora';
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function getMissaoIdByName(name: string): string | null {
  const found = MISSOES.find(m => m.nome === name);
  return found ? found.id : null;
}

function getDicaDoDia(): string {
  const hoje = new Date();
  const inicioAno = new Date(hoje.getFullYear(), 0, 0);
  const diaDoAno = Math.floor((hoje.getTime() - inicioAno.getTime()) / 86400000);
  return CURIOSIDADES[diaDoAno % CURIOSIDADES.length];
}

function hojeStr(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function capitalize(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

export function Dashboard() {
  const { data, getNivel, desafioDoDia, desafioBonusDisponivel, resgatarBonusDesafio } = useData();
  const [missaoSelecionada, setMissaoSelecionada] = useState<(typeof MISSOES)[0] | null>(null);

  useEffect(() => {
    document.title = 'RockySoulUp - Dashboard';
  }, []);

  const nivel = getNivel();

  const ranking: RankingUser[] = [
    ...USUARIOS_BASE.map(u => ({ nome: u.nome, pontos: u.pontos })),
    { nome: data.nome || 'Você', pontos: data.pontos },
  ].sort((a, b) => b.pontos - a.pontos);

  const recentHistory = useMemo<AtividadeItem[]>(() => {
    const itens: AtividadeItem[] = data.historico.map((h, i) => {
      const missaoId = getMissaoIdByName(h.nome);
      return {
        id: `h${i}`,
        nome: h.nome,
        pontos: h.pontos,
        tipo: 'acao',
        icone: missaoId ? MISSAO_ICONE_MAP[missaoId] : '/icons/folha.svg',
        data: h.data,
        timestamp: parseData(h.data).getTime(),
      };
    });

    data.resgates.forEach((r, i) => {
      const ehConversao = r.nome.startsWith('Conversão');
      itens.push({
        id: `r${i}`,
        nome: r.nome,
        pontos: r.pontos,
        tipo: ehConversao ? 'conversao' : 'resgate',
        icone: ehConversao
          ? ''
          : RECOMPENSAS.find(x => x.nome === r.nome)?.icone || '/icons/trofeu.svg',
        data: r.data,
        timestamp: parseData(r.data).getTime(),
      });
    });

    return itens.sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
  }, [data.historico, data.resgates]);

  const dicaDoDia = getDicaDoDia();

  const feitasHoje = new Set(
    data.historico.filter(h => h.data?.slice(0, 10) === hojeStr()).map(h => h.nome)
  );
  const desafioFeito = feitasHoje.has(desafioDoDia.nome);

  const nomeExibido = data.nome.trim() || 'USUÁRIO';
  const inicial = data.nome.trim() ? data.nome[0].toUpperCase() : 'I';

  function handleMissao(missao: (typeof MISSOES)[0]) {
    setMissaoSelecionada(missao);
  }

  function handleAcaoDesafio() {
    if (desafioFeito) return;
    handleMissao(desafioDoDia);
  }

  function handleVerificado(missaoId: string) {
    if (missaoId === desafioDoDia.id && desafioBonusDisponivel) {
      resgatarBonusDesafio();
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-4 lg:py-6 flex flex-col lg:flex-row gap-4">

        <aside className="hidden lg:flex flex-col lg:w-75 shrink-0 gap-4">

          <div className="card-primary rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(#4ade80, transparent)' }} />
            <div className="flex items-center gap-2 mb-3">
              <BoltIcon />
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Desafio do Dia</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <img src={desafioDoDia.icone} className="w-10 h-10 shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-base truncate">{desafioDoDia.nome}</p>
                <p className="text-white/40 text-sm">
                  +{desafioDoDia.pontos} pts · verificação por foto
                </p>
              </div>
            </div>
            <div className="mb-3">
              <span className="text-[#ffc928]/80 text-xs">
                {desafioBonusDisponivel ? 'Bônus extra disponível' : 'bônus já resgatado'}
              </span>
            </div>
            <button
              onClick={handleAcaoDesafio}
              disabled={desafioFeito}
              className={`w-full rounded-full font-semibold text-sm py-2.5 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${desafioFeito ? '' : 'animate-pulse-glow'}`}
              style={{
                background: desafioFeito ? 'rgba(74,222,128,0.15)' : 'linear-gradient(135deg,#4ade80,#22c55e)',
                color: desafioFeito ? '#4ade80' : '#0f3c22',
                border: desafioFeito ? '1px solid rgba(74,222,128,0.3)' : 'none',
                boxShadow: desafioFeito ? 'none' : '0 8px 24px rgba(34,197,94,0.35)',
              }}
            >
              {desafioFeito && <img src="/icons/check.svg" className="w-3.5 h-3.5" alt="" />}
              {desafioFeito ? 'Concluído' : 'Cumprir desafio'}
            </button>
          </div>

          <div className="card-tertiary rounded-2xl p-4 flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2">
              <img src="/icons/folha.svg" className="w-4 h-4 opacity-60" alt="" />
              <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest">Dica do Dia</span>
            </div>
            <p className="text-white/60 text-sm leading-snug flex-1 font-serif-display italic">
              "{dicaDoDia}"
            </p>
            <span className="text-green-400/50 text-[11px] font-medium">Verificado pela IA</span>
          </div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col gap-5">

          <div>
            <p className="text-white/35 text-sm">Bom dia,</p>
            <h1 className="text-white mt-0.5 font-serif-display" style={{ fontSize: 30 }}>
              {nomeExibido} <span style={{ color: '#4ade80' }}>—</span> {capitalize(getGreeting(nivel))}
            </h1>
          </div>

          <div className="card-secondary rounded-2xl p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">Registrar Ação</h2>
              <span className="text-white/50 text-[13px]">{feitasHoje.size}/{MISSOES.length} hoje</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 auto-rows-min flex-1 content-start">
              {MISSOES.map(missao => {
                const cor = MISSAO_COR_MAP[missao.id] || '#4ade80';
                const checked = feitasHoje.has(missao.nome);
                return (
                  <button
                    key={missao.id}
                    onClick={() => handleMissao(missao)}
                    className="rounded-xl p-3 h-full flex flex-col gap-1.5 text-left transition-all group active:scale-95 relative overflow-hidden cursor-pointer"
                    style={{
                      background: checked ? `rgba(${hexToRgb(cor)},0.08)` : 'rgba(255,255,255,0.06)',
                      border: checked ? `1px solid rgba(${hexToRgb(cor)},0.25)` : '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    {checked && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.2)' }}>
                        <img src="/icons/check.svg" className="w-2.5 h-2.5" alt="feito" />
                      </div>
                    )}
                    <img
                      src={MISSAO_ICONE_MAP[missao.id]}
                      className="w-8 h-8 group-hover:scale-110 transition-transform"
                      alt=""
                    />
                    <div className="mt-auto">
                      <p className="text-white/90 text-sm font-medium leading-snug">{missao.nome}</p>
                      <p className="font-semibold text-sm mt-0.5" style={{ color: cor }}>+{missao.pontos} pts</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <MiniJogoSeparacao />
        </div>

        <aside className="hidden lg:flex flex-col lg:w-75 shrink-0 gap-4">

          <div className="card-tertiary rounded-2xl p-4">
            <p className="text-white/55 text-[11px] uppercase tracking-widest mb-3">Ranking Global</p>
            <div className="flex flex-col gap-1">
              {ranking.slice(0, 4).map((u, i) => {
                const nivelUser = NIVEL_ICONE[nivelPorPontos(u.pontos)] || '/icons/semente.svg';
                return (
                  <div
                    key={u.nome + i}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-all hover:bg-white/5"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                      style={{
                        background: i === 0 ? 'linear-gradient(135deg,#ffc928,#f59e0b)' : i === 1 ? 'rgba(203,213,225,0.2)' : i === 2 ? 'rgba(180,120,60,0.25)' : 'rgba(255,255,255,0.05)',
                        color: i < 3 ? 'white' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[#0f3c22] shrink-0"
                      style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', opacity: i === 0 ? 1 : 0.7 }}
                    >
                      {u.nome[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm font-medium truncate">{u.nome}</p>
                      <p className="text-white/45 text-[11px]">{u.pontos} pts</p>
                    </div>
                    <img src={nivelUser} className="w-4 h-4" alt="" />
                  </div>
                );
              })}

              <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 mt-1" style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.12)' }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white/30 shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {ranking.findIndex(u => u.nome === nomeExibido) >= 0 ? ranking.findIndex(u => u.nome === nomeExibido) + 1 : ranking.length}
                </span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[#0f3c22] shrink-0" style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)' }}>
                  {inicial}
                </div>
                <div className="flex-1">
                  <p className="text-green-300 text-sm font-medium">
                    {nomeExibido} <span className="text-green-400/50 text-[10px]">você</span>
                  </p>
                  <p className="text-white/45 text-[11px]">{data.pontos} pts</p>
                </div>
                <img src={NIVEL_ICONE[nivel] || '/icons/semente.svg'} className="w-4 h-4" alt="" />
              </div>
            </div>
          </div>

          <div className="card-tertiary rounded-2xl p-4 flex flex-col min-h-0">
            <p className="text-white/55 text-[11px] uppercase tracking-widest mb-3">Atividade Recente</p>
            {recentHistory.length === 0 ? (
              <div className="text-center py-5">
                <img src="/icons/folha.svg" alt="" className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-white/35 text-xs mb-3">Nenhuma ação registrada ainda.</p>
                <button
                  onClick={handleAcaoDesafio}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', color: '#0f3c22' }}
                >
                  Primeira ação
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-0 flex-1 justify-start">
                {recentHistory.map((entry: AtividadeItem) => {
                  const ganhou = entry.tipo === 'acao';
                  const ehConversao = entry.tipo === 'conversao';
                  return (
                    <div key={entry.id} className="flex items-start gap-2.5 py-3 border-b border-white/5 last:border-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: ganhou ? 'rgba(74,222,128,0.08)' : ehConversao ? 'rgba(74,222,128,0.14)' : 'rgba(251,191,36,0.1)', border: '1px solid rgba(74,222,128,0.12)' }}
                      >
                        {ehConversao ? (
                          <span className="text-green-400 text-[11px] font-bold">R$</span>
                        ) : (
                          <img src={entry.icone} className="w-4 h-4" alt="" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 text-sm font-medium leading-snug truncate">{entry.nome}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-white/40 text-[11px]">{timeAgo(entry.data)}</span>
                          {!ganhou && (
                            <span
                              className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-semibold"
                              style={{ background: ehConversao ? 'rgba(74,222,128,0.14)' : 'rgba(251,191,36,0.14)', color: ehConversao ? '#4ade80' : '#fbbf24' }}
                            >
                              {ehConversao ? 'conversão' : 'resgate'}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-bold shrink-0 mt-1 ${ganhou ? 'text-green-400' : 'text-red-400'}`}>
                        {ganhou ? '+' : '-'}{entry.pontos}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>

      {missaoSelecionada && (
        <VerificarModal
          aberto={true}
          onFechar={() => setMissaoSelecionada(null)}
          missao={missaoSelecionada}
          onVerificado={handleVerificado}
        />
      )}
    </div>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffc928">
      <path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />
    </svg>
  );
}