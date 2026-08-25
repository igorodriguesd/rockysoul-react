import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { MISSOES, SELOS, RECOMPENSAS, USUARIOS_BASE, PASSADO } from '../data/constants';
import HistoryChart from '../components/HistoryChart';
import { showToast } from '../components/Toast';

interface RankingUser {
  nome: string;
  pontos: number;
}

const CATEGORIAS = ['Todos', 'Energia', 'Transporte', 'Natureza', 'Cupons'] as const;

const MISAO_ICONES: Record<string, string> = {
  reciclagem: '♻️',
  transporte: '🚌',
  energia: '⚡',
  agua: '💧',
  bicicleta: '🚲',
  plantio: '🌳',
  banho: '🚿',
};

const SELO_ICONES: Record<string, string> = {
  semente: '🌱',
  broto: '🌿',
  arvore: '🌳',
  expert: '🏆',
};

function getNivelIndex(pontos: number): number {
  if (pontos >= 1000) return 3;
  if (pontos >= 300) return 2;
  if ( pontos >= 100) return 1;
  return 0;
}

function getProgressoPercent(pontos: number): number {
  if (pontos >= 1000) return 100;
  if (pontos >= 300) return 30 + ((pontos - 300) / 700) * 70;
  if (pontos >= 100) return 10 + ((pontos - 100) / 200) * 20;
  return (pontos / 100) * 10;
}

function getGreeting(nivel: string): string {
  switch (nivel) {
    case 'Semente': return 'Continue plantando sementes!';
    case 'Broto': return 'Voce esta crescendo!';
    case 'Arvore': return 'Que impacto incrivel!';
    case 'Expert': return 'Voce e uma lenda!';
    default: return 'Bem-vindo!';
  }
}

function formatDate(dateStr: string): string {
  return dateStr;
}

export default function Dashboard() {
  const { data, adicionarPontos, subtrairPontos, addResgate, getNivel, getSelosDesbloqueados } = useData();
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('Todos');

  useEffect(() => {
    document.title = 'RockySoulUp - Dashboard';
  }, []);

  const nivel = getNivel();
  const selosDesbloqueados = getSelosDesbloqueados();
  const nivelIndex = getNivelIndex(data.pontos);
  const progresso = getProgressoPercent(data.pontos);
  const maxRanking = Math.max(...USUARIOS_BASE.map(u => u.pontos), data.pontos, 1);

  const ranking: RankingUser[] = [
    ...USUARIOS_BASE.map(u => ({ nome: u.nome, pontos: u.pontos })),
    { nome: data.nome || 'Voce', pontos: data.pontos },
  ].sort((a, b) => b.pontos - a.pontos);

  const historicoUltimo8 = data.historico.slice(0, 8);

  const labels7dias = PASSADO.map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (PASSADO.length - i));
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  });
  labels7dias.push(new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));

  const dadosDiarios = [...PASSADO, data.pontosHoje || 0];
  const dadosAcumulados = dadosDiarios.reduce<number[]>((acc, val) => {
    const last = acc.length > 0 ? acc[acc.length - 1] : 0;
    acc.push(last + val);
    return acc;
  }, []);

  const recompensasFiltradas = categoriaFiltro === 'Todos'
    ? RECOMPENSAS
    : RECOMPENSAS.filter(r => r.categoria === categoriaFiltro);

  function handleMissao(missao: typeof MISSOES[0]) {
    adicionarPontos(missao.pontos, missao.nome);
    showToast(`+${missao.pontos} pontos - ${missao.nome}`);
  }

  function handleResgatar(recompensa: typeof RECOMPENSAS[0]) {
    if (data.pontos < recompensa.pontos) {
      showToast(`Pontos insuficientes! Precisa de ${recompensa.pontos} pontos`);
      return;
    }
    subtrairPontos(recompensa.pontos);
    addResgate({
      nome: recompensa.nome,
      pontos: recompensa.pontos,
      data: new Date().toLocaleString('pt-BR'),
    });
    showToast(`${recompensa.nome} resgatado por ${recompensa.pontos} pontos!`);
  }

  return (
    <div className="min-h-screen bg-[#f0faf0]">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#e6f5e6] rounded-xl flex items-center justify-center text-2xl">
              ⭐
            </div>
            <div>
              <p className="text-sm text-gray-500">Pontos Totais</p>
              <p className="text-2xl font-bold text-[#1a9e1a]">{data.pontos}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#e6f5e6] rounded-xl flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <p className="text-sm text-gray-500">Pontos Hoje</p>
              <p className="text-2xl font-bold text-[#1a9e1a]">{data.pontosHoje}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#e6f5e6] rounded-xl flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <p className="text-sm text-gray-500">Missoes Completas</p>
              <p className="text-2xl font-bold text-[#1a9e1a]">{data.missoesCompletas}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#e6f5e6] rounded-xl flex items-center justify-center text-2xl">
              🏅
            </div>
            <div>
              <p className="text-sm text-gray-500">Selos</p>
              <p className="text-2xl font-bold text-[#1a9e1a]">{selosDesbloqueados.length} / {SELOS.length}</p>
            </div>
          </div>
        </div>

        {/* Avatar Message */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1a9e1a] to-[#4cc94c] rounded-full flex items-center justify-center text-3xl text-white font-bold shadow-lg">
            {(data.nome || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {data.nome ? `Ola, ${data.nome}!` : 'Bem-vindo ao RockySoulUp!'}
            </h2>
            <p className="text-[#1a9e1a] font-medium">{getGreeting(nivel)}</p>
            <p className="text-sm text-gray-500 mt-1">Nivel: <span className="font-semibold text-[#1a9e1a]">{nivel}</span></p>
          </div>
        </div>

        {/* Mission Registration Grid */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Registrar Missao</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {MISSOES.map(missao => (
              <button
                key={missao.id}
                onClick={() => handleMissao(missao)}
                className="flex flex-col items-center gap-2 p-4 bg-[#f0faf0] border border-[#cce6cc] rounded-xl hover:bg-[#e0f5e0] hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {MISAO_ICONES[missao.id] || '🌱'}
                </span>
                <span className="text-sm font-medium text-gray-700 text-center">{missao.nome}</span>
                <span className="text-xs text-[#1a9e1a] font-semibold bg-[#cce6cc] px-2 py-0.5 rounded-full">
                  +{missao.pontos} pts
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Nivel</h3>
          <div className="flex items-center gap-2 mb-2">
            {SELOS.map((selo, i) => (
              <span key={selo.id} className={`text-sm font-medium ${i <= nivelIndex ? 'text-[#1a9e1a]' : 'text-gray-400'}`}>
                {SELO_ICONES[selo.id]} {selo.nome}
              </span>
            ))}
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.min(progresso, 100)}%`,
                background: 'linear-gradient(90deg, #4cc94c, #1a9e1a, #0d7a0d)',
              }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{data.pontos} pontos</p>
        </div>

        {/* Badges Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Selos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SELOS.map(selo => {
              const desbloqueado = data.pontos >= selo.minPontos;
              return (
                <div
                  key={selo.id}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    desbloqueado
                      ? 'bg-[#f0faf0] border-[#cce6cc] shadow-sm'
                      : 'bg-gray-50 border-gray-200 opacity-40'
                  }`}
                >
                  <span className="text-4xl">{SELO_ICONES[selo.id]}</span>
                  <span className={`text-sm font-bold ${desbloqueado ? 'text-[#1a9e1a]' : 'text-gray-400'}`}>
                    {selo.nome}
                  </span>
                  <span className="text-xs text-gray-500 text-center">{selo.descricao}</span>
                  {desbloqueado ? (
                    <span className="text-xs text-[#1a9e1a] font-semibold bg-[#cce6cc] px-2 py-0.5 rounded-full">
                      Desbloqueado
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Faltam {selo.minPontos - data.pontos} pts</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Historico</h3>
          {historicoUltimo8.length === 0 ? (
            <p className="text-gray-400 text-sm">Nenhuma acao registrada ainda.</p>
          ) : (
            <div className="space-y-2">
              {historicoUltimo8.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-[#f0faf0] border border-[#cce6cc] rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#cce6cc] rounded-full flex items-center justify-center text-sm font-bold text-[#1a9e1a]">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{entry.nome}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#1a9e1a]">+{entry.pontos} pts</span>
                    <span className="text-xs text-gray-400">{formatDate(entry.data)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Evolucao Diaria</h3>
            <HistoryChart
              labels={labels7dias}
              series={[{ nome: 'Pontos', dados: dadosDiarios, cor: '#1a9e1a' }]}
            />
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Acumulado</h3>
            <HistoryChart
              labels={labels7dias}
              series={[{ nome: 'Acumulado', dados: dadosAcumulados, cor: '#0d7a0d' }]}
            />
          </div>
        </div>

        {/* Ranking */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Ranking</h3>
          <div className="space-y-3">
            {ranking.map((user, i) => {
              const isYou = user.nome === (data.nome || 'Voce');
              const barWidth = maxRanking > 0 ? (user.pontos / maxRanking) * 100 : 0;
              return (
                <div key={user.nome} className="flex items-center gap-3">
                  <span className={`w-6 text-center font-bold text-sm ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-400'}`}>
                    {i + 1}°
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${isYou ? 'text-[#1a9e1a] font-bold' : 'text-gray-700'}`}>
                        {isYou ? `🌟 ${user.nome}` : user.nome}
                      </span>
                      <span className="text-sm font-semibold text-gray-500">{user.pontos} pts</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${barWidth}%`,
                          background: isYou
                            ? 'linear-gradient(90deg, #4cc94c, #1a9e1a)'
                            : '#cce6cc',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rewards Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recompensas</h3>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {CATEGORIAS.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaFiltro(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  categoriaFiltro === cat
                    ? 'bg-[#1a9e1a] text-white shadow-md'
                    : 'bg-[#f0faf0] text-gray-600 border border-[#cce6cc] hover:bg-[#e0f5e0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recompensasFiltradas.map(recompensa => {
              const podeResgatar = data.pontos >= recompensa.pontos;
              return (
                <div
                  key={recompensa.id}
                  className="relative bg-[#f0faf0] border border-[#cce6cc] rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-all"
                >
                  {recompensa.badge && (
                    <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                      recompensa.badge === 'Novo' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {recompensa.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {RECOMPENSAS.find(r => r.id === recompensa.id) === RECOMPENSAS[0] ? '🔋' :
                       recompensa.categoria === 'Transporte' ? '🚌' :
                       recompensa.categoria === 'Natureza' ? '🌿' :
                       recompensa.categoria === 'Cupons' ? '🛒' : '⚡'}
                    </span>
                    <span className="text-sm font-bold text-gray-800">{recompensa.nome}</span>
                  </div>
                  <p className="text-xs text-gray-500">{recompensa.descricao}</p>
                  <span className="text-sm font-bold text-[#1a9e1a]">{recompensa.pontos} pontos</span>
                  <button
                    onClick={() => handleResgatar(recompensa)}
                    disabled={!podeResgatar}
                    className={`w-full py-2 rounded-xl text-sm font-semibold transition-all ${
                      podeResgatar
                        ? 'bg-[#1a9e1a] text-white hover:bg-[#158515] cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Resgatar
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Redemption History */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Resgates</h3>
          {data.resgates.length === 0 ? (
            <p className="text-gray-400 text-sm">Nenhum resgate realizado ainda.</p>
          ) : (
            <div className="space-y-2">
              {data.resgates.map((resgate, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-[#f0faf0] border border-[#cce6cc] rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#cce6cc] rounded-full flex items-center justify-center text-sm font-bold text-[#1a9e1a]">
                      🎁
                    </div>
                    <span className="text-sm font-medium text-gray-700">{resgate.nome}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-red-500">-{resgate.pontos} pts</span>
                    <span className="text-xs text-gray-400">{resgate.data}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
