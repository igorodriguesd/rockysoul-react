import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { MISSOES, SELOS, USUARIOS_BASE, CURIOSIDADES } from '../data/constants';
import VerificarModal from '../components/VerificarModal';
import type { HistoricoEntrada } from '../types';

interface RankingUser {
  nome: string;
  pontos: number;
}

const CO2_MAP: Record<string, number> = {
  reciclagem: 2.5,
  transporte: 3.0,
  energia: 1.5,
  agua: 0.8,
  bicicleta: 4.0,
  plantio: 8.0,
  banho: 0.5,
};

const MISSAO_ICONE_MAP: Record<string, string> = {
  reciclagem: '/icons/reciclagem.svg',
  transporte: '/icons/transporte.svg',
  energia: '/icons/energia.svg',
  agua: '/icons/agua.svg',
  bicicleta: '/icons/bicicleta.svg',
  plantio: '/icons/arvore.svg',
  banho: '/icons/banho.svg',
};

const MISSAO_COR_MAP: Record<string, string> = {
  reciclagem: '#86efac',
  transporte: '#4ade80',
  energia: '#fde68a',
  agua: '#93c5fd',
  bicicleta: '#4ade80',
  plantio: '#bbf7d0',
  banho: '#93c5fd',
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

function getProgressPercent(pontos: number): number {
  if (pontos >= 1000) return 100;
  if (pontos >= 300) return 30 + ((pontos - 300) / 700) * 70;
  if (pontos >= 100) return 10 + ((pontos - 100) / 200) * 20;
  return (pontos / 100) * 10;
}

function getNextLevel(pontos: number): { nome: string; falta: number } {
  if (pontos < 100) return { nome: 'Broto', falta: 100 - pontos };
  if (pontos < 300) return { nome: 'Árvore', falta: 300 - pontos };
  if (pontos < 600) return { nome: 'Expert', falta: 600 - pontos };
  if (pontos < 1000) return { nome: 'Máximo', falta: 1000 - pontos };
  return { nome: 'Expert', falta: 0 };
}

function nivelPorPontos(pontos: number): string {
  if (pontos >= 1000) return 'Expert';
  if (pontos >= 600) return 'Árvore';
  if (pontos >= 300) return 'Broto';
  return 'Semente';
}

function timeAgo(data: string): string {
  try {
    const date = new Date(data);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'agora';
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  } catch {
    return '';
  }
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

export default function Dashboard() {
  const { data, getNivel, getSelosDesbloqueados, desafioDoDia, desafioBonusDisponivel, resgatarBonusDesafio } = useData();
  const [missaoSelecionada, setMissaoSelecionada] = useState<(typeof MISSOES)[0] | null>(null);

  useEffect(() => {
    document.title = 'RockySoulUp - Dashboard';
  }, []);

  const nivel = getNivel();
  const selosDesbloqueados = getSelosDesbloqueados();
  const progresso = getProgressPercent(data.pontos);
  const nextLevel = getNextLevel(data.pontos);
  const arcR = 52;
  const arcCirc = 2 * Math.PI * arcR;
  const arcOffset = arcCirc - (progresso / 100) * arcCirc;

  const ranking: RankingUser[] = [
    ...USUARIOS_BASE.map(u => ({ nome: u.nome, pontos: u.pontos })),
    { nome: data.nome || 'Você', pontos: data.pontos },
  ].sort((a, b) => b.pontos - a.pontos);

  const recentHistory = data.historico.slice(0, 8);

  const totalCO2 = data.historico.reduce((acc, entry) => {
    const missaoId = getMissaoIdByName(entry.nome);
    return acc + (missaoId ? CO2_MAP[missaoId] || 0 : 0);
  }, 0);

  const arvoresEquiv = totalCO2 > 0 ? (totalCO2 / 22).toFixed(1) : '0';
  const diasSeguidos = data.streak;
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

  const impacto = [
    { icon: '/icons/folha.svg', label: 'kg CO₂ evitado', value: totalCO2.toFixed(1) },
    { icon: '/icons/arvore.svg', label: 'Árvores equiv.', value: arvoresEquiv },
    { icon: '/icons/semente.svg', label: 'Dias seguidos', value: `${diasSeguidos}d` },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-4 lg:py-6 flex flex-col lg:flex-row gap-4">

        {/* ── LEFT: Profile + Progress ── */}
        <aside className="hidden lg:flex flex-col lg:w-[300px] flex-shrink-0 gap-4">

          {/* Profile card */}
          <div
            className="rounded-2xl p-5 flex flex-col items-center text-center gap-3 relative overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(7,31,18,0.70), rgba(15,60,34,0.60))',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(74,222,128,0.25)',
            }}
          >
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.08]"
              style={{ background: 'radial-gradient(circle, #4ade80, transparent)', transform: 'translate(30%,-30%)' }}
            />

            <div className="relative w-[120px] h-[120px]">
              <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90 absolute inset-0">
                <circle cx="60" cy="60" r={arcR} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle
                  cx="60" cy="60" r={arcR} fill="none" stroke="url(#profileArc)" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={arcCirc} strokeDashoffset={arcOffset}
                  style={{ transition: 'stroke-dashoffset 0.7s ease' }}
                />
                <defs>
                  <linearGradient id="profileArc" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-[#0f3c22]"
                  style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)' }}>
                  {inicial}
                </div>
              </div>
            </div>

            <div>
              <p className="text-white font-bold text-lg font-serif-display">{nomeExibido}</p>
              <span className="inline-flex items-center gap-1.5 mt-1">
                <img src={NIVEL_ICONE[nivel] || '/icons/semente.svg'} className="w-4 h-4" alt="" />
                <span className="text-green-300/90 text-sm font-medium">{nivel}</span>
              </span>
            </div>

            <div className="w-full grid grid-cols-2 gap-2 mt-1">
              {[
                { label: 'Total', value: data.pontos, suffix: 'pts' },
                { label: 'Hoje', value: data.pontosHoje, suffix: 'pts' },
                { label: 'Missões', value: data.missoesCompletas, suffix: '' },
                { label: 'Streak', value: diasSeguidos, suffix: 'd' },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <p className="text-white font-bold text-lg font-serif-display">
                    {s.value}<span className="text-[11px] opacity-60 ml-0.5">{s.suffix}</span>
                  </p>
                  <p className="text-white/50 text-[11px]">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="w-full">
              <div className="flex justify-between text-[11px] text-white/50 mb-1.5">
                <span>Próximo: {nextLevel.nome}</span>
                <span>{nextLevel.falta} pts restantes</span>
              </div>
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progresso}%`, background: 'linear-gradient(90deg,#4ade80,#22c55e)' }}
                />
              </div>
            </div>
          </div>

          {/* Trilha de Evolução */}
          <div className="glass-strong rounded-2xl p-4">
            <p className="text-white/55 text-[11px] uppercase tracking-widest mb-3">Trilha de Evolução</p>
            <div className="flex flex-col gap-2">
              {SELOS.map((l, i, arr) => {
                const unlocked = data.pontos >= l.minPontos;
                const active = nivel === l.nome;
                return (
                  <div key={l.id} className="flex items-center gap-3 relative">
                    {i < arr.length - 1 && (
                      <div className="absolute left-[14px] top-7 w-px h-4" style={{ background: unlocked ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.06)' }} />
                    )}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: active ? 'linear-gradient(135deg,#4ade80,#22c55e)' : unlocked ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
                        border: active ? 'none' : unlocked ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(255,255,255,0.06)',
                        filter: unlocked ? 'none' : 'grayscale(1)',
                        opacity: unlocked ? 1 : 0.35,
                      }}
                    >
                      <img src={l.icone} className="w-5 h-5" alt="" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${active ? 'text-green-300' : unlocked ? 'text-white/75' : 'text-white/35'}`}>{l.nome}</p>
                      <p className="text-white/35 text-[11px]">{l.minPontos} pts</p>
                    </div>
                    {active && <span className="ml-auto text-[11px] text-green-400 font-semibold">atual</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Impacto ambiental */}
          <div className="glass-strong rounded-2xl p-4 hidden lg:block">
            <p className="text-white/55 text-[11px] uppercase tracking-widest mb-3">Impacto Ambiental</p>
            <div className="flex flex-col gap-2.5">
              {impacto.map(m => (
                <div key={m.label} className="flex items-center gap-2.5">
                  <img src={m.icon} className="w-4 h-4" alt="" />
                  <div className="flex-1">
                    <p className="text-white/50 text-[11px]">{m.label}</p>
                  </div>
                  <p className="text-green-300 font-bold text-base font-serif-display">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── CENTER: Main content ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Greeting */}
          <div>
            <p className="text-white/35 text-sm">Bom dia,</p>
            <h1 className="text-white mt-0.5 font-serif-display" style={{ fontSize: 30 }}>
              {nomeExibido} <span style={{ color: '#4ade80' }}>—</span> {capitalize(getGreeting(nivel))}
            </h1>
          </div>

          {/* Desafio + Dica */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            <div
              className="md:col-span-3 rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: 'linear-gradient(125deg, rgba(15,60,34,0.9), rgba(34,197,94,0.18))',
                border: '1px solid rgba(74,222,128,0.2)',
              }}
            >
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(#4ade80, transparent)' }} />
              <div className="flex items-center gap-2 mb-3">
                <BoltIcon />
                <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Desafio do Dia</span>
                <span className="ml-auto text-green-400/60 text-xs">
                  {desafioBonusDisponivel ? `+${desafioDoDia.pontos} pts · bônus extra` : 'bônus já resgatado'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <img src={desafioDoDia.icone} className="w-11 h-11" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-base truncate">{desafioDoDia.nome}</p>
                  <p className="text-white/40 text-sm">
                    +{desafioDoDia.pontos} pts base · verificação por foto
                  </p>
                </div>
                <button
                  onClick={handleAcaoDesafio}
                  disabled={desafioFeito}
                  className="rounded-full font-semibold text-sm px-5 py-2 transition-all active:scale-95 flex-shrink-0 flex items-center gap-1.5 cursor-pointer"
                  style={{
                    background: desafioFeito ? 'rgba(74,222,128,0.15)' : 'linear-gradient(135deg,#4ade80,#22c55e)',
                    color: desafioFeito ? '#4ade80' : '#0f3c22',
                    border: desafioFeito ? '1px solid rgba(74,222,128,0.3)' : 'none',
                  }}
                >
                  {desafioFeito && <img src="/icons/check.svg" className="w-3.5 h-3.5" alt="" />}
                  {desafioFeito ? 'Concluído' : 'Cumprir'}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 glass-strong rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <img src="/icons/folha.svg" className="w-4 h-4" alt="" />
                <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Dica do Dia</span>
              </div>
              <p className="text-white/75 text-[15px] leading-relaxed flex-1 font-serif-display italic">
                "{dicaDoDia}"
              </p>
              <span className="text-green-400/60 text-[11px] font-medium">Verificado pela IA</span>
            </div>
          </div>

          {/* Registrar ação */}
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Registrar Ação</h2>
              <span className="text-white/50 text-[13px]">{feitasHoje.size}/{MISSOES.length} hoje</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5">
              {MISSOES.map(missao => {
                const cor = MISSAO_COR_MAP[missao.id] || '#4ade80';
                const checked = feitasHoje.has(missao.nome);
                return (
                  <button
                    key={missao.id}
                    onClick={() => handleMissao(missao)}
                    className="rounded-xl p-3.5 flex flex-col gap-2 text-left transition-all group active:scale-95 relative overflow-hidden cursor-pointer"
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
                      className="w-9 h-9 group-hover:scale-110 transition-transform"
                      alt=""
                    />
                    <div>
                      <p className="text-white/90 text-sm font-medium leading-snug">{missao.nome}</p>
                      <p className="font-semibold text-sm mt-0.5" style={{ color: cor }}>+{missao.pontos} pts</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Impacto mobile */}
          <div className="lg:hidden glass-strong rounded-2xl p-4 grid grid-cols-3 gap-3">
            {impacto.map(m => (
              <div key={m.label} className="text-center rounded-xl p-3" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.08)' }}>
                <img src={m.icon} className="w-5 h-5 mx-auto" alt="" />
                <p className="text-green-300 font-bold mt-1 font-serif-display" style={{ fontSize: 20 }}>{m.value}</p>
                <p className="text-white/45 text-[11px]">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Ranking + Feed + Selos ── */}
        <aside className="hidden xl:flex flex-col xl:w-[300px] flex-shrink-0 gap-4">

          {/* Ranking */}
          <div className="glass-strong rounded-2xl p-4">
            <p className="text-white/55 text-[11px] uppercase tracking-widest mb-3">Ranking Global</p>
            <div className="flex flex-col gap-0.5">
              {ranking.slice(0, 4).map((u, i) => {
                const nivelUser = NIVEL_ICONE[nivelPorPontos(u.pontos)] || '/icons/semente.svg';
                return (
                  <div
                    key={u.nome + i}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all hover:bg-white/5"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{
                        background: i === 0 ? 'linear-gradient(135deg,#fbbf24,#f59e0b)' : i === 1 ? 'rgba(203,213,225,0.2)' : i === 2 ? 'rgba(180,120,60,0.25)' : 'rgba(255,255,255,0.05)',
                        color: i < 3 ? 'white' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[#0f3c22] flex-shrink-0"
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

              <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 mt-1" style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.12)' }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white/30 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {ranking.findIndex(u => u.nome === nomeExibido) >= 0 ? ranking.findIndex(u => u.nome === nomeExibido) + 1 : ranking.length}
                </span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-[#0f3c22] flex-shrink-0" style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)' }}>
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

          {/* Atividade recente */}
          <div className="glass-strong rounded-2xl p-4 flex-1">
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
              <div className="flex flex-col gap-0">
                {recentHistory.map((entry: HistoricoEntrada, i: number) => {
                  const missaoId = getMissaoIdByName(entry.nome);
                  return (
                    <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-white/5 last:border-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.1)' }}>
                        {missaoId ? (
                          <img src={MISSAO_ICONE_MAP[missaoId]} className="w-4 h-4" alt="" />
                        ) : (
                          <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/80 text-sm font-medium leading-snug truncate">{entry.nome}</p>
                        <p className="text-white/40 text-[11px] mt-0.5">{timeAgo(entry.data)}</p>
                      </div>
                      {entry.pontos > 0 && <span className="text-green-400 text-xs font-bold flex-shrink-0 mt-1">+{entry.pontos}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selos */}
          <div className="glass-strong rounded-2xl p-4">
<div className="flex items-center justify-between mb-3">
              <p className="text-white/55 text-[11px] uppercase tracking-widest">Selos</p>
              <span className="text-white/45 text-[11px]">{selosDesbloqueados.length}/{SELOS.length}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SELOS.map(selo => {
                const unlocked = data.pontos >= selo.minPontos;
                const ativo = selosDesbloqueados.includes(selo.id);
                return (
                  <div
                    key={selo.id}
                    className="aspect-square rounded-xl flex items-center justify-center"
                    style={{
                      background: ativo ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.03)',
                      border: ativo ? '1px solid rgba(74,222,128,0.25)' : '1px dashed rgba(255,255,255,0.08)',
                      filter: unlocked ? 'none' : 'grayscale(1)',
                      opacity: unlocked ? 1 : 0.3,
                    }}
                  >
                    <img src={selo.icone} className="w-6 h-6" alt="" />
                  </div>
                );
              })}
            </div>
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24">
      <path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />
    </svg>
  );
}