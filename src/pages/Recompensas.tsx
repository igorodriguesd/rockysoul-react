import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
<<<<<<< HEAD
import { MISSOES, RECOMPENSAS as RECOMPENSAS_VISUAIS, SELOS as SELOS_VISUAIS, CO2_POR_MISSAO, CREDITOS_POR_REAL, MIN_CREDITOS_CONVERSAO } from '../data/constants';
=======
import { useLoginGate } from '../hooks/useLoginGate';
import { RECOMPENSAS, CREDITOS_POR_REAL, MIN_CREDITOS_CONVERSAO, getParceiro } from '../data/constants';
>>>>>>> origin/main
import ResgatarModal from '../components/ResgatarModal';
import { showToast } from '../components/Toast';
import { useApi } from '../context/ApiContext';
import { useApiPage } from '../hooks/useApiPage';
import { ApiGate, ListState, PageControls } from '../components/ApiUi';
import type { RecompensaApi, SeloApi } from '../api/types';
import type { Recompensa } from '../types';

function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const FILTROS_LOJA: { id: string; label: string; matcher: (categoria: string) => boolean }[] = [
  { id: 'todas', label: 'Todos', matcher: () => true },
  { id: 'descontos', label: 'Descontos', matcher: c => ['Energia', 'Transporte', 'Cupons'].includes(c) },
  { id: 'experiencias', label: 'Experiências', matcher: c => c === 'Natureza' },
  { id: 'parceiros', label: 'Parceiros', matcher: c => c === 'Parceiros' },
];

export function Recompensas() {
  useEffect(() => { document.title = 'Recompensas - RockySoulUp'; }, []);

<<<<<<< HEAD
  const { data, getNivel } = useData();
  const { user } = useApi(); const [page, setPage] = useState(0); const [badgePage, setBadgePage] = useState(0);
  const rewards = useApiPage<RecompensaApi>('recompensa', page); const badges = useApiPage<SeloApi>('selo', badgePage);
  const RECOMPENSAS: Recompensa[] = rewards.rows.map(row => ({ id: String(row.id), nome: row.titulo, descricao: row.descricao ?? '', pontos: row.custo, categoria: (row.categoria ?? 'Natureza') as Recompensa['categoria'], icone: RECOMPENSAS_VISUAIS.find(item => item.nome === row.titulo)?.icone ?? '/icons/trofeu.svg', badge: row.destaque === 'NOVO' ? 'Novo' : row.destaque === 'TOP 1' ? 'Top 1' : undefined }));
  const SELOS = badges.rows.map(row => ({ id: String(row.id), nome: row.nome, descricao: row.descricao ?? '', minPontos: row.pontosMin, icone: SELOS_VISUAIS.find(item => item.nome === row.nome)?.icone ?? '/icons/semente.svg' }));
=======
  const { data, subtrairPontos, addResgate } = useData();
  const exigirLogin = useLoginGate();
>>>>>>> origin/main
  const [recompensaSelecionada, setRecompensaSelecionada] = useState<Recompensa | null>(null);
  const [filtroLoja, setFiltroLoja] = useState('todas');
  const [creditosConverter, setCreditosConverter] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [conversaoFeita, setConversaoFeita] = useState<{ creditos: number; valor: number } | null>(null);
  const [verDetalhes, setVerDetalhes] = useState(false);

  const creditosNum = parseInt(creditosConverter, 10) || 0;
  const valorReais = creditosNum / CREDITOS_POR_REAL;
  const chaveValida = chavePix.trim().length >= 3;
  const abaixoMinimo = creditosNum > 0 && creditosNum < MIN_CREDITOS_CONVERSAO;
  const acimaSaldo = creditosNum > data.pontos;
  const podeConverter = false;

<<<<<<< HEAD
  function solicitarConversao() { showToast('Conversão em Pix ainda indisponível. Nenhum saldo foi alterado.'); }
=======
  const matcher = FILTROS_LOJA.find(f => f.id === filtroLoja) ?? FILTROS_LOJA[0];
  const recompensasFiltradas = RECOMPENSAS.filter(r => matcher.matcher(r.categoria));

  function solicitarConversao() {
    if (!podeConverter) return;
    if (!exigirLogin()) return;
    subtrairPontos(creditosNum);
    addResgate({
      nome: `Conversão de créditos em dinheiro (R$${formatarReais(valorReais)})`,
      pontos: creditosNum,
      data: new Date().toISOString(),
    });
    setConversaoFeita({ creditos: creditosNum, valor: valorReais });
    showToast(`Conversão de ${creditosNum} créditos = R$${formatarReais(valorReais)}`);
  }
>>>>>>> origin/main

  function novaConversao() {
    setConversaoFeita(null);
    setCreditosConverter('');
    setChavePix('');
  }

  return (
    <>
<<<<<<< HEAD
      <div className="max-w-275 mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow">Recompensas</h1>
          <p className="text-white/70">Acompanhe seus créditos e conheça as recompensas ecológicas</p>
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full border border-[#4ade80]/25" style={{ background: 'rgba(74,222,128,0.08)' }}>
            <img src="/icons/trofeu.svg" alt="" className="w-4 h-4" />
            <span className="text-sm font-semibold text-white/85">{data.pontos} créditos disponíveis</span>
=======
      <div className="max-w-275 mx-auto px-6 py-10">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 drop-shadow">Recompensas</h1>
            <p className="text-white/70">Sua ação vale créditos — troque por descontos, experiências ou Pix.</p>
          </div>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-gold/50" style={{ background: 'rgba(250,204,21,0.14)' }}>
            <img src="/icons/trofeu.svg" alt="" className="w-5 h-5" />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-widest text-gold/80">Saldo</p>
              <p className="text-lg font-extrabold text-gold tabular-nums">{data.pontos} <span className="text-xs font-semibold">créditos</span></p>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <h2 className="text-slate-900 font-bold">Todas as recompensas</h2>
          <div className="flex flex-wrap gap-1.5">
            {FILTROS_LOJA.map(f => (
              <button
                key={f.id}
                onClick={() => setFiltroLoja(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${filtroLoja === f.id
                    ? 'text-(--t-onaccent)'
                    : 'text-slate-600 bg-surface-2 hover:bg-surface-hover'
                  }`}
                style={filtroLoja === f.id ? { background: 'var(--t-grad-brand)' } : undefined}
              >
                {f.label}
              </button>
            ))}
>>>>>>> origin/main
          </div>
        </div>

        {!user && <ApiGate><span /></ApiGate>}
        <ListState {...rewards} count={rewards.rows.length} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
<<<<<<< HEAD
          {RECOMPENSAS.map(r => {
            const podeResgatar = false;
=======
          {recompensasFiltradas.map(r => {
            const podeResgatar = data.pontos >= r.pontos;
>>>>>>> origin/main
            const jaResgatou = data.resgates.some(rg => rg.nome === r.nome);
            return (
              <div
                key={r.id}
                className="bg-card-secondary border border-card-secondary-border rounded-2xl p-5 flex flex-col hover:scale-[1.01] transition-all"
              >
                <div className="h-6 mb-3 flex items-start">
                  {r.badge && (
                    <span className="self-start px-2 py-0.5 bg-gold/20 text-gold-deep text-[10px] font-semibold rounded-full">
                      {r.badge}
                    </span>
                  )}
                </div>
                <Link to={`/recompensas/${r.id}`} className="flex items-start gap-3 mb-3 group">
                  <img src={r.icone} alt="" className="w-9 h-9 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand transition-colors">{r.nome}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{r.descricao}</p>
                  </div>
                </Link>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gold-deep">{r.pontos} créditos</span>
                    <span className="text-[10px] text-slate-500 bg-brand-soft px-2 py-0.5 rounded-full">{r.categoria}</span>
                  </div>
                  {r.parceiroId && getParceiro(r.parceiroId) && (
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-brand-2 bg-brand-soft rounded-full px-2 py-1 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: getParceiro(r.parceiroId)!.cor }} />
                      Cortesia de {getParceiro(r.parceiroId)!.nome}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (!exigirLogin()) return;
                      setRecompensaSelecionada(r);
                    }}
                    disabled={!podeResgatar}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${podeResgatar
                        ? 'bg-brand text-(--t-onaccent) hover:bg-brand-hover cursor-pointer'
                        : 'bg-brand-soft text-slate-400 cursor-not-allowed'
                      }`}
                  >
                    {jaResgatou ? 'Resgatado' : podeResgatar ? 'Resgatar' : 'Resgate em breve'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

<<<<<<< HEAD
        <PageControls page={page} setPage={setPage} count={rewards.rows.length} loading={rewards.loading} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12 mt-8">
          <div className="card-secondary rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/55 text-[11px] uppercase tracking-widest">Trilha de Evolução</p>
              <span className="text-[#4ade80] text-sm font-bold">{nivel}</span>
            </div>
            <div className="flex flex-col gap-3">
              <ListState {...badges} count={badges.rows.length} />
              {SELOS.map((l, i, arr) => {
                const unlocked = data.pontos >= l.minPontos;
                const active = nivel === l.nome;
                return (
                  <div key={l.id} className="flex items-center gap-3.5 relative">
                    {i < arr.length - 1 && (
                      <div className="absolute left-4.5 top-9 w-px h-5" style={{ background: unlocked ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.06)' }} />
                    )}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all"
                      style={{
                        background: active ? 'linear-gradient(135deg,#4ade80,#22c55e)' : unlocked ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.04)',
                        border: active ? 'none' : unlocked ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(255,255,255,0.06)',
                        filter: unlocked ? 'none' : 'grayscale(1)',
                        opacity: unlocked ? 1 : 0.35,
                      }}
                    >
                      <img src={l.icone} className="w-5 h-5" alt="" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${active ? 'text-green-300' : unlocked ? 'text-white/75' : 'text-white/35'}`}>{l.nome}</p>
                      <p className="text-white/35 text-[11px]">{l.descricao} · {l.minPontos} pts</p>
                    </div>
                    {active && <span className="text-[11px] text-green-400 font-semibold">atual</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-secondary rounded-2xl p-5">
            <PageControls page={badgePage} setPage={setBadgePage} count={badges.rows.length} loading={badges.loading} />
            <p className="text-white/55 text-[11px] uppercase tracking-widest mb-4">Impacto Ambiental</p>
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {[
                { icon: '/icons/folha.svg', label: 'kg CO₂ evitado', value: totalCO2.toFixed(1) },
                { icon: '/icons/arvore.svg', label: 'Árvores equiv.', value: arvoresEquiv },
                { icon: '/icons/semente.svg', label: 'Dias seguidos', value: `${data.streak}d` },
              ].map(m => (
                <div key={m.label} className="text-center rounded-2xl py-4 px-2" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.1)' }}>
                  <img src={m.icon} className="w-6 h-6 mx-auto" alt="" />
                  <p className="text-green-300 font-bold mt-1.5 font-serif-display" style={{ fontSize: 20 }}>{m.value}</p>
                  <p className="text-white/45 text-[10px] mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-sm text-white/70 font-medium">Ações registradas</p>
              <p className="text-white/40 text-xs mt-0.5 leading-relaxed">
                Estimativas educativas; consulte as ações registradas na sua conta.
              </p>
              <p className="text-[#4ade80] font-bold mt-2 font-serif-display" style={{ fontSize: 22 }}>
                {data.historico.length} <span className="text-[11px] font-medium opacity-60">ações</span>
              </p>
            </div>
          </div>
        </div>

        <div className="card-secondary rounded-2xl p-5 sm:p-6 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 items-start">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-[#070d19] font-bold font-serif-display"
                  style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)' }}
                >
                  R$
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Conversor de Créditos</h2>
                  <p className="text-xs text-white/45">Conversão em Pix ainda indisponível</p>
                </div>
              </div>
              <div className="rounded-2xl p-4 mb-3" style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}>
                <p className="text-xs text-white/55 uppercase tracking-widest mb-1">Taxa de conversão</p>
                <p className="text-[#4ade80] font-bold font-serif-display" style={{ fontSize: 20 }}>
                  {CREDITOS_POR_REAL} créditos = R$1,00
                </p>
              </div>
              <ul className="space-y-2 text-sm text-white/55">
                <li className="flex items-start gap-2">
                  <span className="text-[#4ade80] mt-0.5">•</span>
                  Mínimo de <strong className="text-white/80">{MIN_CREDITOS_CONVERSAO} créditos</strong> por conversão.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4ade80] mt-0.5">•</span>
                  O envio por Pix estará disponível após integração do resgate.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4ade80] mt-0.5">•</span>
                  Nenhum crédito é descontado enquanto esta função estiver indisponível.
                </li>
              </ul>
=======
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-(--t-onaccent) font-bold font-serif-display"
              style={{ background: 'var(--t-grad-brand)' }}
            >
              R$
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Conversão para Pix</h2>
              <p className="text-xs text-slate-500">Transforme seus créditos em dinheiro</p>
>>>>>>> origin/main
            </div>
          </div>

          {conversaoFeita ? (
            <div className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
              <img src="/icons/sucesso.svg" alt="Sucesso" className="w-12 h-12 mx-auto mb-3" />
              <h3 className="text-slate-900 font-bold">Conversão solicitada!</h3>
              <p className="text-sm text-slate-600 mt-1">
                <strong className="text-gold-deep">{conversaoFeita.creditos} créditos</strong> convertidos em{' '}
                <strong className="text-gold-deep">R${formatarReais(conversaoFeita.valor)}</strong>.
              </p>
              <p className="text-xs text-slate-500 mt-2">O valor será enviado para a sua chave Pix em até 2 dias úteis.</p>
              <button
                onClick={novaConversao}
                className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-(--t-onaccent) transition-all hover:brightness-110"
                style={{ background: 'var(--t-grad-brand)' }}
              >
                Fazer nova conversão
              </button>
            </div>
          ) : (
            <>
              <div className="rounded-2xl p-6 sm:p-7" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
                <div className="mt-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Converter</label>
                  <input
                    type="number" disabled
                    min={MIN_CREDITOS_CONVERSAO}
                    value={creditosConverter}
                    onChange={e => setCreditosConverter(e.target.value)}
                    placeholder={`Ex: ${MIN_CREDITOS_CONVERSAO}`}
                    className="w-full rounded-xl px-4 py-3 text-center text-xl font-bold outline-none placeholder:text-base placeholder:font-medium text-slate-800 placeholder-slate-400 tabular-nums"
                    style={{ background: 'var(--t-surface)', border: '1px solid var(--t-slate-300)' }}
                  />
                  {abaixoMinimo && (
                    <p className="text-xs text-red-400 mt-1.5">Mínimo de {MIN_CREDITOS_CONVERSAO} créditos para converter.</p>
                  )}
                  {acimaSaldo && (
                    <p className="text-xs text-red-400 mt-1.5">Você só tem {data.pontos} créditos disponíveis.</p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-500">
                  Você recebe
                  <span className="font-bold text-gold font-serif-display" style={{ fontSize: 22 }}>
                    R${formatarReais(creditosNum > 0 ? valorReais : 0)}
                  </span>
                </div>

                <div className="h-px my-5" style={{ background: 'var(--t-slate-200)' }} />

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Chave Pix</label>
                  <input
                    type="text" disabled
                    value={chavePix}
                    onChange={e => setChavePix(e.target.value)}
                    placeholder="E-mail, CPF, telefone ou chave aleatória"
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-slate-800 placeholder-slate-400"
                    style={{ background: 'var(--t-surface)', border: '1px solid var(--t-slate-300)' }}
                  />
                  {creditosConverter !== '' && !chaveValida && (
                    <p className="text-xs text-red-400 mt-1.5">Informe uma chave Pix válida.</p>
                  )}
                </div>

                <button
                  onClick={solicitarConversao}
                  disabled={!podeConverter}
                  className="w-full mt-5 py-3 rounded-xl text-sm font-bold text-(--t-onaccent) transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'var(--t-grad-brand)' }}
                >
                  Converter créditos
                </button>
              </div>

              <button
                onClick={() => setVerDetalhes(v => !v)}
                className="mt-3 mx-auto flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-2 transition-colors cursor-pointer"
              >
                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${verDetalhes ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
                Como funciona a conversão?
              </button>

              {verDetalhes && (
                <ul className="mt-3 space-y-2 text-sm text-slate-500 rounded-2xl p-4" style={{ background: 'var(--t-surface)', border: '1px solid var(--t-slate-200)' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-brand mt-0.5">•</span>
                    {CREDITOS_POR_REAL} créditos = R$1,00 e mínimo de <strong className="text-slate-800">{MIN_CREDITOS_CONVERSAO} créditos</strong> por conversão.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand mt-0.5">•</span>
                    O valor é enviado para a sua chave Pix informada.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand mt-0.5">•</span>
                    Créditos convertidos são descontados do seu saldo na hora.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand mt-0.5">•</span>
                    Conversões são liquidadas pela <strong className="text-slate-800">verba de parceiros e patrocinadores</strong>.
                  </li>
                </ul>
              )}
            </>
          )}
        </div>

        {recompensaSelecionada && (
          <ResgatarModal
            aberto={true}
            onFechar={() => setRecompensaSelecionada(null)}
            recompensa={recompensaSelecionada}
          />
        )}
      </div>
    </>
  );
}