import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { MISSOES, SELOS, USUARIOS_BASE } from '../data/constants';
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

const NIVEL_ICONE: Record<string, string> = {
  Semente: '/icons/semente.svg',
  Broto: '/icons/broto.svg',
  Arvore: '/icons/arvore.svg',
  Expert: '/icons/trofeu.svg',
};

const NIVEIS_MIN = [0, 100, 300, 1000];

function getGreeting(nivel: string): string {
  switch (nivel) {
    case 'Semente': return 'Continue plantando sementes!';
    case 'Broto': return 'Voce esta crescendo!';
    case 'Arvore': return 'Que impacto incrivel!';
    case 'Expert': return 'Voce e uma lenda!';
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
  if (pontos < 300) return { nome: 'Arvore', falta: 300 - pontos };
  if (pontos < 1000) return { nome: 'Expert', falta: 1000 - pontos };
  return { nome: 'Expert', falta: 0 };
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

export default function Dashboard() {
  const { data, getNivel, getSelosDesbloqueados } = useData();
  const [missaoSelecionada, setMissaoSelecionada] = useState<(typeof MISSOES)[0] | null>(null);

  useEffect(() => {
    document.title = 'RockySoulUp - Dashboard';
  }, []);

  const nivel = getNivel();
  const selosDesbloqueados = getSelosDesbloqueados();
  const progresso = getProgressPercent(data.pontos);
  const nextLevel = getNextLevel(data.pontos);
  const nivelIndex = NIVEIS_MIN.findIndex((min, i) =>
    i === NIVEIS_MIN.length - 1 ? data.pontos >= min : data.pontos >= min && data.pontos < NIVEIS_MIN[i + 1]
  );

  const ranking: RankingUser[] = [
    ...USUARIOS_BASE.map(u => ({ nome: u.nome, pontos: u.pontos })),
    { nome: data.nome || 'Voce', pontos: data.pontos },
  ].sort((a, b) => b.pontos - a.pontos);

  const recentHistory = data.historico.slice(0, 4);

  const totalCO2 = data.historico.reduce((acc, entry) => {
    const missaoId = getMissaoIdByName(entry.nome);
    return acc + (missaoId ? CO2_MAP[missaoId] || 0 : 0);
  }, 0);

  const arvoresEquiv = totalCO2 > 0 ? (totalCO2 / 22).toFixed(1) : '0';
  const diasSeguidos = data.historico.length;

  function handleMissao(missao: (typeof MISSOES)[0]) {
    setMissaoSelecionada(missao);
  }

  return (
    <div className="min-h-screen bg-[#f0faf0]">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">

        {/* Block 1: Greeting */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 p-5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Olá, {data.nome || 'USUARIO'} !
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#22c55e]/10 text-[#16a34a]">
              <img src={NIVEL_ICONE[nivel] || '/icons/semente.svg'} className="w-3.5 h-3.5" alt="" />
              {nivel}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{getGreeting(nivel)}</p>
        </div>

        {/* Block 2: 4 Stat Cards */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 p-5">
          <div className="grid grid-cols-4 divide-x divide-gray-100">
            {[
              { label: 'Pontos Totais', value: data.pontos },
              { label: 'Pontos Hoje', value: data.pontosHoje },
              { label: 'Missoes', value: data.missoesCompletas },
              { label: 'Selos', value: `${selosDesbloqueados.length}/${SELOS.length}` },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center px-3">
                <span className="text-2xl font-bold text-[#22c55e]">{stat.value}</span>
                <span className="text-xs text-gray-400 mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Block 3: Mission Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 p-5">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Registre Sua Acao</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {MISSOES.map(missao => (
              <button
                key={missao.id}
                onClick={() => handleMissao(missao)}
                className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-[#22c55e]/30 hover:bg-[#22c55e]/5 transition-all duration-150 cursor-pointer group"
              >
                <img src={MISSAO_ICONE_MAP[missao.id]} className="w-6 h-6 shrink-0" alt="" />
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-sm font-medium text-gray-700 truncate w-full">{missao.nome}</span>
                  <span className="text-xs font-semibold text-[#22c55e]">+{missao.pontos}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Block 4: Progress + Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Progress */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 p-5">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Progresso</h3>
            <div className="relative">
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min(progresso, 100)}%`,
                    background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                {NIVEIS_MIN.map((min, i) => (
                  <div key={i} className="flex flex-col items-center" style={{ marginLeft: i === 0 ? 0 : undefined }}>
                    <div
                      className={`w-2.5 h-2.5 rounded-full -mt-4 border-2 border-white ${
                        data.pontos >= min ? 'bg-[#22c55e]' : 'bg-gray-300'
                      }`}
                    />
                    <span className="text-[10px] text-gray-400 mt-1">{SELOS[i]?.nome}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {data.pontos} pontos{nextLevel.falta > 0 ? ` · Faltam ${nextLevel.falta} pts para ${nextLevel.nome}` : ' · Nivel maximo!'}
            </p>
            <div className="flex gap-3 mt-4">
              {SELOS.map(selo => {
                const unlocked = data.pontos >= selo.minPontos;
                return (
                  <div key={selo.id} className={`flex flex-col items-center gap-1 ${unlocked ? '' : 'opacity-30 grayscale'}`}>
                    <img src={selo.icone} className="w-8 h-8" alt={selo.nome} />
                    <span className="text-[10px] text-gray-500">{selo.nome}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Impact */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 p-5">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <img src="/icons/folha.svg" className="w-4 h-4" alt="" />
              Impacto Ambiental
            </h3>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-[#22c55e]">{totalCO2.toFixed(1)}</span>
                <span className="text-[10px] text-gray-400 text-center mt-1">kg CO2 evitado</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-[#22c55e]">{arvoresEquiv}</span>
                <span className="text-[10px] text-gray-400 text-center mt-1">arvores equiv.</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-[#22c55e]">{diasSeguidos}</span>
                <span className="text-[10px] text-gray-400 text-center mt-1">dias seguidos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Block 5: Activity + Ranking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 p-5">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Atividade Recente</h3>
            {recentHistory.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhuma acao registrada ainda.</p>
            ) : (
              <div className="space-y-2">
                {recentHistory.map((entry: HistoricoEntrada, i: number) => {
                  const missaoId = getMissaoIdByName(entry.nome);
                  return (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                      {missaoId ? (
                        <img src={MISSAO_ICONE_MAP[missaoId]} className="w-5 h-5 shrink-0" alt="" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-700 truncate block">{entry.nome}</span>
                      </div>
                      <span className="text-sm font-semibold text-[#22c55e] shrink-0">+{entry.pontos}</span>
                      <span className="text-[10px] text-gray-400 shrink-0 w-8 text-right">{timeAgo(entry.data)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mini Ranking */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 p-5">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Ranking</h3>
            <div className="space-y-2">
              {ranking.slice(0, 5).map((user, i) => {
                const isYou = user.nome === (data.nome || 'Voce');
                const posColor = i === 0 ? '#eab308' : i === 1 ? '#9ca3af' : i === 2 ? '#d97706' : '#9ca3af';
                return (
                  <div
                    key={user.nome}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                      isYou ? 'bg-[#22c55e]/8 border border-[#22c55e]/20' : ''
                    }`}
                  >
                    <span className="w-5 text-center text-sm font-bold" style={{ color: posColor }}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm truncate block ${isYou ? 'font-semibold text-[#16a34a]' : 'text-gray-700'}`}>
                        {user.nome}
                      </span>
                    </div>
                    <span className={`text-sm font-semibold shrink-0 ${isYou ? 'text-[#16a34a]' : 'text-gray-500'}`}>
                      {user.pontos}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {missaoSelecionada && (
        <VerificarModal
          aberto={true}
          onFechar={() => setMissaoSelecionada(null)}
          missao={missaoSelecionada}
        />
      )}
    </div>
  );
}
