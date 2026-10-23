import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
<<<<<<< HEAD
import { MISSOES as MISSOES_VISUAIS, CURIOSIDADES, RECOMPENSAS } from '../data/constants';
import VerificarModal from '../components/VerificarModal';
import { useApi } from '../context/ApiContext';
import { useApiPage } from '../hooks/useApiPage';
import type { Acao, HistoricoApi } from '../api/types';
import type { Missao } from '../types';
import { ApiGate, ListState, PageControls } from '../components/ApiUi';
import { Verificacoes } from '../components/Verificacoes';
import LoginModal from '../components/LoginModal';
=======
import { MISSOES, CURIOSIDADES, RECOMPENSAS, PARCEIROS, CO2_POR_MISSAO, AMIGOS_SIMULADOS, NIVEIS, TRILHA_EVOLUCAO, GRUPOS_MISSAO, grupoDaMissao } from '../data/constants';
import VerificarModal from '../components/VerificarModal';
import TrilhaEvolucaoModal from '../components/TrilhaEvolucaoModal';
>>>>>>> origin/main
import MiniJogoSeparacao from '../components/MiniJogoSeparacao';
import IconeMissao from '../components/IconeMissao';
import { useColecao } from '../context/CollectionContext';
import { useLoginGate } from '../hooks/useLoginGate';
import { showToast } from '../components/Toast';

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
  compostagem: '/icons/compostagem.svg',
  consumo: '/icons/carrinho.svg',
  garrafa: '/icons/garrafa.svg',
  educar: '/icons/comunidade.svg',
  sacola: '/icons/sacola.svg',
  captacao: '/icons/agua.svg',
  mobilidade: '/icons/bateria.svg',
  ciclovia: '/icons/bicicleta.svg',
  solar: '/icons/solar.svg',
  eolica: '/icons/vento.svg',
  led: '/icons/lampada.svg',
  horta: '/icons/vaso.svg',
  agrofloresta: '/icons/arvore.svg',
};

const FILTROS_MISSOES = [
  ...GRUPOS_MISSAO.map(g => ({ id: g.id, label: g.label, matcher: (id: string) => g.ids.includes(id) })),
  { id: 'todas', label: 'Todas', matcher: () => true },
];

const INICIAIS_VISIVEIS = 9;
const META_ACOES_MES = 50;

const PERIODOS_GRAFICO = [
  { id: '7', label: '7 dias', dias: 7 },
  { id: '30', label: '30 dias', dias: 30 },
  { id: 'tudo', label: 'Tudo', dias: 0 },
];

function getGreeting(nivel: string): string {
    switch (nivel) {
    case 'Broto': return 'Você está crescendo.';
    case 'Árvore': return 'Seu impacto está florescendo.';
    case 'Floresta': return 'Você é uma verdadeira guardiã do planeta.';
    default: return 'Vamos transformar o mundo juntos.';
  }
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
  const found = MISSOES_VISUAIS.find(m => m.nome === name);
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

const NOMES_DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function chaveDia(data: Date): string {
  const mm = String(data.getMonth() + 1).padStart(2, '0');
  const dd = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mm}-${dd}`;
}

function inicioDoDia(data: Date): Date {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

export function Dashboard() {
<<<<<<< HEAD
  const { data, getNivel, desafioDoDia, desafioBonusDisponivel, resgatarBonusDesafio } = useData();
  const { user } = useApi();
  const [page, setPage] = useState(0); const [historyPage, setHistoryPage] = useState(0);
  const actions = useApiPage<Acao>('acao', page); const history = useApiPage<HistoricoApi>('historico', historyPage);
  const MISSOES: Missao[] = actions.rows.map(row => ({ id: String(row.id), nome: row.nome, pontos: row.pontos, comprovacao: 'foto', icone: MISSOES_VISUAIS.find(item => item.nome === row.nome)?.icone ?? '/icons/folha.svg' }));
  const [loginAberto, setLoginAberto] = useState(false);
  const [missaoSelecionada, setMissaoSelecionada] = useState<Missao | null>(null);
=======
  const { data, getNivel, desafioDoDia, desafioBonusDisponivel, resgatarBonusDesafio, addAmigo, codigoAmigo, amigos } = useData();
  const { getProgressoTotal } = useColecao();
  const exigirLogin = useLoginGate();
  const [missaoSelecionada, setMissaoSelecionada] = useState<(typeof MISSOES)[0] | null>(null);
  const [codigoInput, setCodigoInput] = useState('');
  const [filtroMissoes, setFiltroMissoes] = useState('todas');
  const [verTodas, setVerTodas] = useState(false);
  const [periodoGrafico, setPeriodoGrafico] = useState('7');
  const [mostrarEvolucao, setMostrarEvolucao] = useState(false);
  const missoesRef = useRef<HTMLDivElement>(null);
>>>>>>> origin/main

  useEffect(() => {
    document.title = 'RockySoulUp - Dashboard';
  }, []);

  const nivel = getNivel();

<<<<<<< HEAD
  const ranking: RankingUser[] = user ? [{ nome: user.nome, pontos: user.pontos }] : [];

=======
>>>>>>> origin/main
  const recentHistory = useMemo<AtividadeItem[]>(() => {
    const itens: AtividadeItem[] = data.historico.map((h, i) => {
      const missaoId = getMissaoIdByName(h.nome);
      return {
        id: `h${i}`,
        nome: h.nome,
        pontos: h.pontos,
        tipo: 'acao',
        icone: missaoId ? MISSAO_ICONE_MAP[missaoId] : '/icons/check.svg',
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

  const patrocinadorDesafio =
    PARCEIROS.find(p => p.tipos.includes('patrocinador') && p.temas?.includes(desafioDoDia.id))
    ?? PARCEIROS.find(p => p.tipos.includes('patrocinador'));

  const amigosAdicionados = AMIGOS_SIMULADOS
    .filter(a => amigos.includes(a.codigo))
    .sort((a, b) => b.pontos - a.pontos);
  const poolAmigos = AMIGOS_SIMULADOS.filter(a => !amigos.includes(a.codigo));

  function handleAddAmigo() {
    const ok = addAmigo(codigoInput);
    if (ok) {
      showToast('Amigo adicionado à sua comunidade');
      setCodigoInput('');
    } else {
      showToast('Código de amigo não encontrado');
    }
  }

  function copiarCodigoAmigo() {
    try {
      navigator.clipboard?.writeText(codigoAmigo);
      showToast('Código de amigo copiado');
    } catch {
      showToast(`Seu código: ${codigoAmigo}`);
    }
  }

  const feitasHoje = new Set(
    data.historico.filter(h => h.data?.slice(0, 10) === hojeStr()).map(h => h.nome)
  );
  const desafioFeito = feitasHoje.has(desafioDoDia.nome);

  const { obtidas: cartasObtidas, total: totalCartas } = getProgressoTotal();

  const missoesFiltradas = useMemo(() => {
    const matcher = FILTROS_MISSOES.find(f => f.id === filtroMissoes) ?? FILTROS_MISSOES.find(f => f.id === 'todas')!;
    return MISSOES.filter(m => matcher.matcher(m.id)).sort((a, b) => a.pontos - b.pontos);
  }, [filtroMissoes]);

  const missoesVisiveis = verTodas ? missoesFiltradas : missoesFiltradas.slice(0, INICIAIS_VISIVEIS);
  const totalFiltro = missoesFiltradas.length;

  const nomeExibido = data.nome.trim() || 'USUÁRIO';
  const inicial = data.nome.trim() ? data.nome[0].toUpperCase() : 'I';

  const pontos = data.pontosAcumulados ?? data.pontos ?? 0;
  const idxNivel = Math.max(0, NIVEIS.findIndex(n => pontos >= n.min && pontos <= n.max));
  const nivelAtual = idxNivel === -1 ? NIVEIS[NIVEIS.length - 1] : NIVEIS[idxNivel];
  const nivelProx = (idxNivel >= 0 && idxNivel < NIVEIS.length - 1) ? NIVEIS[idxNivel + 1] : null;
  const xpNoNivel = Math.max(0, pontos - nivelAtual.min);
  const xpTotalNivel = nivelProx ? nivelProx.min - nivelAtual.min : null;
  const pctNivel = xpTotalNivel ? Math.min(100, Math.max(0, Math.round((xpNoNivel / xpTotalNivel) * 100))) : 100;
  const xpFaltando = xpTotalNivel ? Math.max(0, xpTotalNivel - xpNoNivel) : 0;

  const impactoMes = useMemo(() => {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1).getTime();
    const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0).getTime();

    let acoes = 0;
    let co2 = 0;
    data.historico.forEach(h => {
      const t = parseData(h.data).getTime();
      if (t < inicioMes || t > fimMes) return;
      acoes++;
      const id = getMissaoIdByName(h.nome);
      if (!id) return;
      co2 += CO2_POR_MISSAO[id] ?? 0;
    });
    return { acoes, co2 };
  }, [data.historico]);

  const co2MesFormatado = impactoMes.co2.toFixed(1).replace('.', ',');
  const arvoresEquivalentes = Math.floor(impactoMes.co2 / 22);
  const pctMetaMes = Math.min(100, Math.round((impactoMes.acoes / META_ACOES_MES) * 100));

  const graficoImpacto = useMemo(() => {
    const cfg = PERIODOS_GRAFICO.find(p => p.id === periodoGrafico) ?? PERIODOS_GRAFICO[0];
    const hoje = inicioDoDia(new Date());

    const porDia = new Map<string, number>();
    data.historico.forEach(h => {
      const d = parseData(h.data);
      if (isNaN(d.getTime())) return;
      const dia = inicioDoDia(d).getTime();
      if (cfg.dias > 0 && dia < hoje.getTime() - (cfg.dias - 1) * 86400000) return;
      if (dia > hoje.getTime()) return;
      const id = getMissaoIdByName(h.nome);
      if (!id) return;
      const co2 = CO2_POR_MISSAO[id] ?? 0;
      if (co2 <= 0) return;
      const k = chaveDia(d);
      porDia.set(k, (porDia.get(k) ?? 0) + co2);
    });

    const dias: { rotulo: string; valor: number }[] = [];
    const primeiroDia = cfg.dias > 0
      ? new Date(hoje.getTime() - (cfg.dias - 1) * 86400000)
      : (() => {
          const chaves = [...porDia.keys()].sort();
          if (chaves.length === 0) return hoje;
          const [y, m, d] = chaves[0].split('-').map(Number);
          return new Date(y, m - 1, d);
        })();

    const cursor = new Date(primeiroDia);
    while (cursor.getTime() <= hoje.getTime()) {
      const valor = porDia.get(chaveDia(cursor)) ?? 0;
      dias.push({
        rotulo: cfg.dias === 7 ? NOMES_DIAS[cursor.getDay()] : String(cursor.getDate()),
        valor: Math.round(valor * 10) / 10,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    const max = Math.max(0.1, ...dias.map(d => d.valor));
    return { dias, max };
  }, [data.historico, periodoGrafico]);

  const totalPeriodo = graficoImpacto.dias.reduce((s, d) => s + d.valor, 0);

  function handleMissao(missao: (typeof MISSOES)[0]) {
<<<<<<< HEAD
    if (!user) { setLoginAberto(true); return; }
=======
    if (!exigirLogin()) return;
>>>>>>> origin/main
    setMissaoSelecionada(missao);
  }

  function handleAcaoDesafio() {
    if (!user) { setLoginAberto(true); return; }
    if (desafioFeito || !desafioDoDia.id) return;
    handleMissao(desafioDoDia);
  }

  function handleVerificado(missaoId: string) {
    if (missaoId === desafioDoDia.id && desafioBonusDisponivel) {
      resgatarBonusDesafio();
    }
  }

  const chips = [
    { rotulo: 'Saldo disponível', valor: data.pontos.toLocaleString('pt-BR'), icone: '/icons/trofeu.svg' },
    { rotulo: 'Sequência', valor: `${data.streak}d`, icone: '/icons/folha.svg' },
    { rotulo: 'Cartas', valor: `${cartasObtidas}/${totalCartas}`, icone: '/icons/coringa.svg' },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 lg:py-6 flex flex-col gap-5">

        <Link
          to="/recompensas"
          className="lg:hidden bg-card-tertiary border border-card-secondary-border rounded-2xl p-4 flex items-center justify-between gap-3 hover:bg-brand-soft transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img src="/icons/trofeu.svg" className="w-6 h-6 shrink-0 opacity-80" alt="" />
            <p className="text-slate-600 text-sm leading-snug">
              Seus créditos valem <strong className="text-brand">recompensas</strong> e{" "}
              <strong className="text-gold-deep">Pix</strong>
            </p>
          </div>
          <span className="text-brand text-xs font-bold flex items-center gap-1 shrink-0">
            Ver
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </Link>

<<<<<<< HEAD
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
                {desafioBonusDisponivel ? 'Bônus extra disponível' : 'Pontos após aprovação'}
=======
        {/* ===================== PROGRESSO (protagonista) ===================== */}
        <div className="relative overflow-hidden rounded-3xl p-5 sm:p-7 [background:var(--t-grad-strong)] shadow-[0_14px_40px_rgba(0,230,118,0.28)]">
          <div
            className="pointer-events-none absolute -top-16 -right-10 w-64 h-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #fff, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-10 w-56 h-56 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, var(--color-brand-3), transparent 70%)' }}
          />

          <div className="relative flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
              <p className="text-white/60 text-sm">Bom dia,</p>
              <h1 className="text-white font-serif-display" style={{ fontSize: 26 }}>{nomeExibido}</h1>
              <span className="inline-flex items-center gap-1.5 text-white/80 text-sm font-medium mt-0.5">
                {getGreeting(nivel)}
                {TRILHA_EVOLUCAO[idxNivel] && <img src={TRILHA_EVOLUCAO[idxNivel].icone} className="w-4 h-4" alt="" />}
>>>>>>> origin/main
              </span>
            </div>

<<<<<<< HEAD
          <div className="card-tertiary rounded-2xl p-4 flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2">
              <img src="/icons/folha.svg" className="w-4 h-4 opacity-60" alt="" />
              <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest">Dica do Dia</span>
            </div>
            <p className="text-white/60 text-sm leading-snug flex-1 font-serif-display italic">
              "{dicaDoDia}"
            </p>
            <span className="text-green-400/50 text-[11px] font-medium">Dica de sustentabilidade</span>
          </div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col gap-5">

          <div>
            <p className="text-white/35 text-sm">Bom dia,</p>
            <h1 className="text-white mt-0.5 font-serif-display" style={{ fontSize: 30 }}>
              {nomeExibido} <span style={{ color: '#4ade80' }}>—</span> {getGreeting(nivel)}
            </h1>
          </div>

          <div className="card-secondary rounded-2xl p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">Registrar Ação</h2>
              <span className="text-white/50 text-[13px]">{feitasHoje.size}/{MISSOES.length} hoje</span>
            </div>
            <ListState {...actions} count={actions.rows.length} />
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 auto-rows-min flex-1 content-start">
              {MISSOES.map(missao => {
                const cor = MISSAO_COR_MAP[MISSOES_VISUAIS.find(item => item.nome === missao.nome)?.id ?? ''] || '#4ade80';
                const checked = feitasHoje.has(missao.nome);
                return (
=======
            <div className="flex flex-col lg:flex-row lg:items-center gap-5">
              <div className="min-w-0">
                <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest">{nivelAtual.nome}</p>
                <p className="text-white font-serif-display leading-none mt-1 tabular-nums" style={{ fontSize: 'clamp(36px, 4.5vw, 52px)' }}>
                  {pontos.toLocaleString('pt-BR')}
                  <span className="text-white/65 text-lg font-bold ml-1.5">créditos</span>
                </p>
                <p className="text-white/75 text-sm font-medium mt-1.5">
                  {xpFaltando > 0
                    ? `Faltam ${xpFaltando.toLocaleString('pt-BR')} créditos para ${nivelProx?.nome ?? 'o topo'}`
                    : 'Você atingiu o nível máximo!'}
                </p>
                <p className="text-white/50 text-[11px] mt-0.5">
                  Total acumulado de créditos — seu saldo disponível está no card abaixo.
                </p>
              </div>

              <div className="flex-1 w-full min-w-0">
                <div className="flex items-center justify-between text-[11px] font-bold text-white/80 mb-1.5 uppercase tracking-wider">
                  <span>{nivelAtual.nome}</span>
                  <span>{nivelProx ? nivelProx.nome : 'Máximo'}</span>
                </div>
                <div className="relative h-3.5 rounded-full overflow-hidden bg-white/20">
                  <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${pctNivel}%` }} />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-white/75 text-[11px] font-semibold tabular-nums">{pctNivel}% concluído</span>
>>>>>>> origin/main
                  <button
                    onClick={() => setMostrarEvolucao(true)}
                    className="text-white/85 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
<<<<<<< HEAD
                    {checked && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.2)' }}>
                        <img src="/icons/check.svg" className="w-2.5 h-2.5" alt="feito" />
                      </div>
                    )}
                    <img
                      src={missao.icone}
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

          <PageControls page={page} setPage={setPage} count={actions.rows.length} loading={actions.loading} />
          {!user && <ApiGate><span /></ApiGate>}
          {user && <Verificacoes />}
          {user && <section className="card-secondary rounded-2xl p-4"><h2 className="font-semibold mb-3">Histórico de registros</h2><ListState {...history} count={history.rows.length} /><ul className="divide-y divide-white/5">{history.rows.map(row => <li key={row.id} className="py-3 flex justify-between gap-3"><div><p className="text-white/80 text-sm">{row.descricao}</p><p className="text-white/40 text-xs">{row.dataAcao.replace('T', ' ')}</p></div><span className="text-green-400 text-sm">{row.pontos} pts</span></li>)}</ul><PageControls page={historyPage} setPage={setHistoryPage} count={history.rows.length} loading={history.loading} /></section>}
          <MiniJogoSeparacao />
        </div>

        <aside className="hidden lg:flex flex-col lg:w-75 shrink-0 gap-4">

          <div className="card-tertiary rounded-2xl p-4">
            <p className="text-white/55 text-[11px] uppercase tracking-widest mb-3">Seu progresso</p>
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
=======
                    Ver trilha completa
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
>>>>>>> origin/main
                </div>

                <div className="flex items-center gap-2 mt-4">
                  {TRILHA_EVOLUCAO.map((etapa, i) => {
                    const ehAlvo = !!nivelProx && i === idxNivel + 1;
                    const chegado = i <= idxNivel;
                    const visivel = i <= idxNivel || ehAlvo;
                    return (
                      <Fragment key={etapa.nome}>
                        {i > 0 && <div className="flex-1 h-px bg-white/25" style={{ minWidth: 8 }} />}
                        <div className="flex flex-col items-center gap-1 shrink-0" title={etapa.nome}>
                          <img
                            src={etapa.icone}
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            alt=""
                            style={{ opacity: visivel ? 1 : 0.45, filter: visivel ? 'none' : 'grayscale(0.6)' }}
                          />
                          <span className="hidden sm:block text-[9px] font-bold text-white/70 uppercase tracking-wider">{etapa.nome}</span>
                          <span className="text-[11px] leading-none h-3.5">
                            {chegado
                              ? <span className="text-white font-bold">✓</span>
                              : ehAlvo
                                ? <span className="text-[#ffc928] font-serif-display" style={{ fontSize: 15 }}>●</span>
                                : <span className="text-white/40">○</span>}
                          </span>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {chips.map(s => (
                <div key={s.rotulo} className="rounded-xl px-2.5 sm:px-3 py-3 flex items-center justify-center sm:justify-start gap-2.5 bg-white/12 border border-white/20 backdrop-blur">
                  <img src={s.icone} className="hidden sm:block w-4.5 h-4.5 shrink-0 opacity-90" alt="" />
                  <div className="min-w-0">
                    <p className="text-white font-extrabold text-sm leading-tight tabular-nums truncate">{s.valor}</p>
                    <p className="text-white/70 text-[10px]">{s.rotulo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== REGISTRAR AÇÃO (CTA) ===================== */}
        <div className="bg-card-primary border border-card-primary-border shadow-card-primary rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
              <img src="/icons/folha.svg" className="w-5 h-5 sm:w-6 sm:h-6" alt="" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-900 font-semibold text-sm sm:text-base">O que você fez hoje?</p>
              <p className="text-slate-500 text-xs sm:text-sm">Registre uma ação sustentável e ganhe créditos</p>
            </div>
          </div>
          <button
            onClick={() => missoesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="shrink-0 rounded-full font-semibold text-[13px] py-2.5 sm:py-3 px-5 sm:px-7 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer animate-pulse-glow"
            style={{ background: 'var(--t-grad-strong)', color: '#FFFFFF', boxShadow: '0 8px 24px rgba(0,230,118,0.3)' }}
          >
            <span className="flex items-center gap-1.5">
              + Registrar ação
            </span>
          </button>
        </div>

        {/* ===================== MISSÕES + IMPACTO ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

          <div ref={missoesRef} className="lg:col-span-2 bg-card-secondary border border-card-secondary-border rounded-2xl p-4 flex flex-col scroll-mt-28">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-slate-900 font-semibold text-base">
                Missões de hoje
                <span className="ml-2 text-slate-500 text-xs font-normal tabular-nums">{feitasHoje.size}/{MISSOES.length} feitas</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {FILTROS_MISSOES.map(f => (
                <button
                  key={f.id}
                  onClick={() => { setFiltroMissoes(f.id); setVerTodas(false); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${filtroMissoes === f.id
                    ? 'text-(--t-onaccent)'
                    : 'text-slate-600 bg-surface-2 hover:bg-surface-hover'
                  }`}
                  style={filtroMissoes === f.id ? { background: 'var(--t-grad-brand)' } : undefined}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div id="lista-missoes" className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 auto-rows-min content-start">
                    {missoesVisiveis.map(missao => {
                      const grupo = grupoDaMissao(missao.id);
                      const cor = grupo.cor;
                      const checked = feitasHoje.has(missao.nome);
                      return (
                        <button
                          key={missao.id}
                          onClick={() => handleMissao(missao)}
                          title={`${missao.nome} · ${grupo.label} · +${missao.pontos} créditos — ${missao.descricao}`}
                          aria-label={`${checked ? 'Feita hoje · ' : ''}${missao.nome}, ${grupo.label}, +${missao.pontos} créditos. Toque para registrar.`}
                          className="rounded-xl p-3 h-full flex flex-col gap-1.5 text-left transition-all group active:scale-95 relative overflow-hidden cursor-pointer"
                          style={{
                            background: checked ? `color-mix(in srgb, ${cor} 12%, transparent)` : 'var(--t-surface-2)',
                            border: checked ? `1px solid color-mix(in srgb, ${cor} 45%, transparent)` : '1px solid var(--t-border-subtle)',
                          }}
                        >
                          {checked && (
                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--t-mist)' }}>
                              <img src="/icons/check.svg" className="w-2.5 h-2.5" alt="feito" />
                            </div>
                          )}
                          <IconeMissao
                            src={MISSAO_ICONE_MAP[missao.id]}
                            cor={cor}
                            className="w-8 h-8 group-hover:scale-110 transition-transform"
                          />
                          <p className="text-[11px] leading-snug text-slate-500 line-clamp-2">{missao.descricao}</p>
                          <div className="mt-auto">
                            <p className="text-slate-800 text-sm font-medium leading-snug">{missao.nome}</p>
                            <div className="flex items-center justify-between gap-1 mt-1.5">
                              <p className="font-semibold text-sm tabular-nums" style={{ color: grupo.texto }}>+{missao.pontos} créditos</p>
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={checked
                                  ? { background: `color-mix(in srgb, ${cor} 20%, transparent)`, color: grupo.texto, border: `1px solid color-mix(in srgb, ${cor} 45%, transparent)` }
                                  : { background: cor, color: '#0f172a' }}
                              >
                                {checked ? 'Feita' : 'Registrar'}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
            </div>

            {totalFiltro > INICIAIS_VISIVEIS && (
              <button
                onClick={() => setVerTodas(v => !v)}
                className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer text-brand hover:bg-brand/10"
                style={{ border: '1px dashed var(--t-brand-border)' }}
              >
                {verTodas ? 'Mostrar menos' : `Ver todas (${totalFiltro}) →`}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {/* ===== DESAFIO DO DIA (topo da coluna) ===== */}
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '10px', minWidth: 0, overflow: 'hidden' }} className="bg-card-primary border border-card-primary-border shadow-card-primary rounded-xl p-3">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 auto', minWidth: '160px' }} className="min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
                  <BoltIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Desafio do Dia</p>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <img src={desafioDoDia.icone} className="w-4 h-4 shrink-0" alt="" />
                    <p className="text-slate-900 font-semibold text-[13px] truncate">{desafioDoDia.nome}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }} className="shrink-0">
                <span className={`text-[11px] font-bold ${desafioBonusDisponivel ? 'text-[#ffc928]' : 'text-slate-400'}`}>
                  +{desafioDoDia.pontos} créditos
                </span>

                {patrocinadorDesafio && (
                  <div className="flex items-center gap-1.5 rounded-lg px-2 py-1" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: patrocinadorDesafio.cor }} />
                    <span className="text-[10px] uppercase tracking-wider text-slate-600">
                      <strong className="text-slate-800">{patrocinadorDesafio.nome}</strong>
                    </span>
                  </div>
                )}

                <button
                  onClick={handleAcaoDesafio}
                  disabled={desafioFeito}
                  className={`shrink-0 rounded-full font-semibold text-[13px] py-2 px-4 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${desafioFeito ? '' : 'animate-pulse-glow'}`}
                  style={{
                    background: desafioFeito ? 'var(--t-mist)' : 'var(--t-grad-strong)',
                    color: desafioFeito ? 'var(--color-brand)' : '#FFFFFF',
                    border: desafioFeito ? '1px solid var(--t-brand-border)' : 'none',
                    boxShadow: desafioFeito ? 'none' : '0 8px 24px rgba(0,230,118,0.3)',
                  }}
                >
                  {desafioFeito && <img src="/icons/check.svg" className="w-3.5 h-3.5" alt="" />}
                  {desafioFeito ? 'Concluído' : 'Cumprir desafio'}
                </button>
              </div>
            </div>

            {/* ===== SEU IMPACTO (número principal) ===== */}
            <div className="bg-card-tertiary border border-card-secondary-border rounded-2xl p-4 flex flex-col overflow-hidden relative">
              <div
                className="pointer-events-none absolute -top-16 -right-10 w-48 h-48 rounded-full opacity-10"
                style={{ background: 'radial-gradient(circle, var(--color-brand-3), transparent 70%)' }}
              />
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--t-impact-bg)', border: '1px solid rgba(56,189,248,0.35)' }}>
                  <img src="/icons/arvore.svg" className="w-3.5 h-3.5" alt="" />
                </span>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Seu impacto</p>
              </div>

              <div className="relative flex flex-col items-center py-1">
                <p className="font-serif-display leading-none text-impact tabular-nums" style={{ fontSize: 'clamp(46px, 6vw, 62px)' }}>
                  {co2MesFormatado}
                  <span className="text-lg font-bold ml-1">kg</span>
                </p>
                <p className="text-slate-500 text-sm font-semibold mt-1">CO₂ evitado</p>

                <div className="flex items-center gap-1.5 mt-3 rounded-full px-3 py-1.5" style={{ background: 'var(--t-impact-bg)', border: '1px solid rgba(56,189,248,0.35)' }}>
                  <span className="text-slate-500 text-[11px]">equivalente a</span>
                  <img src="/icons/folha.svg" className="w-3.5 h-3.5" alt="" />
                  <span className="text-[12px] font-bold text-impact">{arvoresEquivalentes} árvores</span>
                </div>
              </div>

              <div className="h-px my-4" style={{ background: 'var(--t-slate-200)' }} />

              <div className="flex items-center justify-between mb-1.5">
                <p className="text-slate-700 text-sm font-semibold tabular-nums">{impactoMes.acoes} ações realizadas</p>
                <p className="text-slate-400 text-[11px] font-bold tabular-nums">{pctMetaMes}%</p>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--t-surface-2)', border: '1px solid var(--t-slate-200)' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pctMetaMes}%`, background: 'var(--t-grad-brand)' }} />
              </div>
              <p className="text-slate-400 text-[10px] mt-2">Meta de {META_ACOES_MES} ações · Seu impacto neste mês</p>
            </div>

            {/* ===== GRÁFICO DE IMPACTO ===== */}
            <div className="bg-card-tertiary border border-card-secondary-border rounded-2xl p-4 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  Impacto nos {periodoGrafico === 'tudo' ? 'dias de atividade' : `últimos ${periodoGrafico === '7' ? '7' : '30'} dias`}
                </p>
                <span className="text-impact/80 text-[10px] font-semibold tabular-nums">{totalPeriodo.toFixed(1).replace('.', ',')} kg CO₂ no período</span>
              </div>

              <div className="flex gap-1.5 mb-4">
                {PERIODOS_GRAFICO.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPeriodoGrafico(p.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${periodoGrafico === p.id ? 'text-(--t-onaccent)' : 'text-slate-600 bg-surface-2 hover:bg-surface-hover'}`}
                    style={periodoGrafico === p.id ? { background: 'var(--t-grad-brand)' } : undefined}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="flex items-end gap-1.5 h-28">
                {graficoImpacto.dias.map((d, i) => {
                  const h = Math.max(4, Math.round((d.valor / graficoImpacto.max) * 108));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1 min-w-0">
                      <div
                        className="w-full rounded-t-md transition-all duration-500"
                        title={`${d.rotulo}: ${d.valor.toFixed(1).replace('.', ',')} kg CO₂`}
                        style={{
                          height: `${h}%`,
                          background: d.valor > 0 ? 'linear-gradient(180deg, #7dd3fc, var(--t-impact))' : 'var(--t-slate-200)',
                          opacity: d.valor > 0 ? 1 : 0.6,
                        }}
                      />
                      <span className="text-[9px] text-slate-400 font-medium truncate w-full text-center">{d.rotulo}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-slate-400 text-[10px] mt-3 leading-snug">Cada ação sua devolve vida ao mundo — é isso que faz a ilha evoluir.</p>
            </div>
          </div>
        </div>

        {/* ===================== ATIVIDADE + AMIGOS ===================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

          <div className="lg:col-span-2 self-start bg-card-tertiary border border-card-secondary-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Atividade recente</p>
              <span className="text-slate-400 text-[11px] font-semibold">Ver histórico →</span>
            </div>
            {recentHistory.length === 0 ? (
              <div className="text-center py-5">
                <img src="/icons/check.svg" alt="" className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-slate-500 text-xs mb-3">Nenhuma ação registrada ainda.</p>
                <button
                  onClick={handleAcaoDesafio}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                  style={{ background: 'var(--t-grad-brand)', color: 'var(--t-onaccent)' }}
                >
                  Primeira ação
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-0">
                {recentHistory.map((entry: AtividadeItem) => {
                  const ganhou = entry.tipo === 'acao';
                  const ehConversao = entry.tipo === 'conversao';
                  return (
                    <div key={entry.id} className="flex items-start gap-2.5 py-2.5 border-b border-slate-200 last:border-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: ehConversao ? 'var(--t-mist)' : 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}
                      >
                        {ehConversao ? (
                          <span className="text-brand text-[11px] font-bold">R$</span>
                        ) : (
                          <img src={entry.icone} className="w-4 h-4" alt="" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 text-sm font-medium leading-snug truncate">{entry.nome}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">{timeAgo(entry.data)}</p>
                      </div>
                      <span className={`text-xs font-bold shrink-0 mt-1 ${ganhou ? 'text-brand' : 'text-red-400'}`}>
                        {ganhou ? '+' : '-'}{entry.pontos}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-card-tertiary border border-card-secondary-border rounded-2xl p-4 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Amigos</p>
                <button
                  onClick={copiarCodigoAmigo}
                  title="Copiar meu código de amigo"
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-brand transition-colors hover:bg-surface-hover cursor-pointer"
                  style={{ border: '1px solid var(--t-brand-border)' }}
                >
                  <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="12" height="12" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Meu código: {codigoAmigo}
                </button>
              </div>

              <div className="flex gap-1.5 mb-3">
                <input
                  value={codigoInput}
                  onChange={e => setCodigoInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddAmigo(); } }}
                  placeholder="Código do amigo"
                  className="flex-1 min-w-0 rounded-lg px-2.5 py-2 text-[12px] outline-none text-slate-900 placeholder-slate-400 focus:border-brand focus:ring-1 focus:ring-brand"
                  style={{ background: 'var(--t-surface)', border: '1px solid var(--t-slate-300)' }}
                />
                <button
                  onClick={handleAddAmigo}
                  className="px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer shrink-0"
                  style={{ background: 'var(--t-grad-brand)', color: 'var(--t-onaccent)' }}
                >
                  + Adicionar
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-(--t-onaccent) shrink-0" style={{ background: 'var(--t-grad-brand)' }}>
                    {inicial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-brand text-sm font-medium truncate">
                      {nomeExibido} <span className="text-sky-400 text-[10px]">você</span>
                    </p>
                  </div>
                  <span className="text-slate-700 text-xs font-bold tabular-nums shrink-0">{data.pontos.toLocaleString('pt-BR')} créditos</span>
                </div>

                {amigosAdicionados.map(u => (
                  <div key={u.codigo} className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-all hover:bg-surface-hover">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-(--t-onaccent) shrink-0"
                      style={{ background: 'var(--t-grad-brand)', opacity: 0.8 }}
                    >
                      {u.nome[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 text-sm font-medium truncate">{u.nome}</p>
                    </div>
                    <span className="text-slate-700 text-xs font-bold tabular-nums shrink-0">{u.pontos.toLocaleString('pt-BR')} créditos</span>
                  </div>
                ))}

                {amigosAdicionados.length === 0 && (
                  <p className="text-slate-400 text-[11px]">Nenhum amigo ainda — cole um código acima.</p>
                )}
              </div>

              {poolAmigos.length > 0 && (
                <div className="mt-3">
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1.5">Sugestões</p>
                  <div className="flex flex-col gap-1">
                    {poolAmigos.slice(0, 3).map(a => (
                      <button
                        key={a.codigo}
                        onClick={() => addAmigo(a.codigo)}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-surface-hover cursor-pointer"
                        title={`Código: ${a.codigo}`}
                      >
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-(--t-onaccent) shrink-0" style={{ background: 'var(--t-grad-brand)', opacity: 0.85 }}>
                          {a.nome[0].toUpperCase()}
                        </span>
                        <span className="text-slate-600 text-[11px] font-medium truncate flex-1">{a.nome}</span>
                        <span className="text-brand text-[10px] font-semibold">+ Adicionar</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card-tertiary border border-card-secondary-border rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <img src="/icons/lampada.svg" className="w-4 h-4 opacity-60" alt="" />
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Dica do Dia</span>
              </div>
              <p className="text-slate-600 text-sm leading-snug font-serif-display italic">"{dicaDoDia}"</p>
              <span className="text-brand/60 text-[11px] font-medium">Verificado pela IA</span>
            </div>
          </div>
        </div>

        <MiniJogoSeparacao compacto />
      </div>

<<<<<<< HEAD
      <LoginModal aberto={loginAberto} onFechar={() => setLoginAberto(false)} />
=======
      <TrilhaEvolucaoModal aberto={mostrarEvolucao} onFechar={() => setMostrarEvolucao(false)} pontos={pontos} />

>>>>>>> origin/main
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
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="#ffc928">
      <path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />
    </svg>
  );
}