import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MISSOES, RECOMPENSAS as RECOMPENSAS_VISUAIS, SELOS as SELOS_VISUAIS, CO2_POR_MISSAO, CREDITOS_POR_REAL, MIN_CREDITOS_CONVERSAO } from '../data/constants';
import ResgatarModal from '../components/ResgatarModal';
import { showToast } from '../components/Toast';
import { useApi } from '../context/ApiContext';
import { useApiPage } from '../hooks/useApiPage';
import { ApiGate, ListState, PageControls } from '../components/ApiUi';
import type { RecompensaApi, SeloApi } from '../api/types';
import type { Recompensa } from '../types';

function getMissaoIdByName(name: string): string | null {
  const found = MISSOES.find(m => m.nome === name);
  return found ? found.id : null;
}

function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function Recompensas() {
  useEffect(() => { document.title = 'Recompensas - RockySoulUp'; }, []);

  const { data, getNivel } = useData();
  const { user } = useApi(); const [page, setPage] = useState(0); const [badgePage, setBadgePage] = useState(0);
  const rewards = useApiPage<RecompensaApi>('recompensa', page); const badges = useApiPage<SeloApi>('selo', badgePage);
  const RECOMPENSAS: Recompensa[] = rewards.rows.map(row => ({ id: String(row.id), nome: row.titulo, descricao: row.descricao ?? '', pontos: row.custo, categoria: (row.categoria ?? 'Natureza') as Recompensa['categoria'], icone: RECOMPENSAS_VISUAIS.find(item => item.nome === row.titulo)?.icone ?? '/icons/trofeu.svg', badge: row.destaque === 'NOVO' ? 'Novo' : row.destaque === 'TOP 1' ? 'Top 1' : undefined }));
  const SELOS = badges.rows.map(row => ({ id: String(row.id), nome: row.nome, descricao: row.descricao ?? '', minPontos: row.pontosMin, icone: SELOS_VISUAIS.find(item => item.nome === row.nome)?.icone ?? '/icons/semente.svg' }));
  const [recompensaSelecionada, setRecompensaSelecionada] = useState<Recompensa | null>(null);
  const [creditosConverter, setCreditosConverter] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [conversaoFeita, setConversaoFeita] = useState<{ creditos: number; valor: number } | null>(null);

  const nivel = getNivel();

  const totalCO2 = data.historico.reduce((acc, entry) => {
    const missaoId = getMissaoIdByName(entry.nome);
    return acc + (missaoId ? CO2_POR_MISSAO[missaoId] || 0 : 0);
  }, 0);
  const arvoresEquiv = totalCO2 > 0 ? (totalCO2 / 22).toFixed(1) : '0';

  const creditosNum = parseInt(creditosConverter, 10) || 0;
  const valorReais = creditosNum / CREDITOS_POR_REAL;
  const chaveValida = chavePix.trim().length >= 3;
  const abaixoMinimo = creditosNum > 0 && creditosNum < MIN_CREDITOS_CONVERSAO;
  const acimaSaldo = creditosNum > data.pontos;
  const podeConverter = false;

  function solicitarConversao() { showToast('Conversão em Pix ainda indisponível. Nenhum saldo foi alterado.'); }

  function novaConversao() {
    setConversaoFeita(null);
    setCreditosConverter('');
    setChavePix('');
  }

  return (
    <>
      <div className="max-w-275 mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow">Recompensas</h1>
          <p className="text-white/70">Acompanhe seus créditos e conheça as recompensas ecológicas</p>
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full border border-[#4ade80]/25" style={{ background: 'rgba(74,222,128,0.08)' }}>
            <img src="/icons/trofeu.svg" alt="" className="w-4 h-4" />
            <span className="text-sm font-semibold text-white/85">{data.pontos} créditos disponíveis</span>
          </div>
        </div>

        {!user && <ApiGate><span /></ApiGate>}
        <ListState {...rewards} count={rewards.rows.length} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {RECOMPENSAS.map(r => {
            const podeResgatar = false;
            const jaResgatou = data.resgates.some(rg => rg.nome === r.nome);
            return (
              <div
                key={r.id}
                className="card-secondary rounded-2xl p-5 flex flex-col hover:scale-[1.01] transition-all"
              >
                <div className="h-6 mb-3 flex items-start">
                  {r.badge && (
                    <span className="self-start px-2 py-0.5 bg-[#22c55e]/15 text-[#4ade80] text-[10px] font-semibold rounded-full">
                      {r.badge}
                    </span>
                  )}
                </div>
                <Link to={`/recompensas/${r.id}`} className="flex items-start gap-3 mb-3 group">
                  <img src={r.icone} alt="" className="w-9 h-9 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-sm group-hover:text-[#4ade80] transition-colors">{r.nome}</h3>
                    <p className="text-xs text-white/45 mt-0.5">{r.descricao}</p>
                  </div>
                </Link>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[#4ade80]">{r.pontos} créditos</span>
                    <span className="text-[10px] text-white/45 bg-white/10 px-2 py-0.5 rounded-full">{r.categoria}</span>
                  </div>
                  <button
                    onClick={() => setRecompensaSelecionada(r)}
                    disabled={!podeResgatar}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${podeResgatar
                        ? 'bg-[#22c55e] text-white hover:bg-[#16a34a] cursor-pointer'
                        : 'bg-white/8 text-white/35 cursor-not-allowed'
                      }`}
                  >
                    {jaResgatou ? 'Resgatado' : podeResgatar ? 'Resgatar' : 'Resgate em breve'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

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
            </div>

            {conversaoFeita ? (
              <div className="rounded-2xl p-6 text-center" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)' }}>
                <img src="/icons/sucesso.svg" alt="Sucesso" className="w-12 h-12 mx-auto mb-3" />
                <h3 className="text-white font-bold">Conversão solicitada!</h3>
                <p className="text-sm text-white/60 mt-1">
                  <strong className="text-[#4ade80]">{conversaoFeita.creditos} créditos</strong> convertidos em{' '}
                  <strong className="text-[#4ade80]">R${formatarReais(conversaoFeita.valor)}</strong>.
                </p>
                <p className="text-xs text-white/40 mt-2">O valor será enviado para a sua chave Pix em até 2 dias úteis.</p>
                <button
                  onClick={novaConversao}
                  className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#070d19] transition-all hover:brightness-110"
                  style={{ background: 'linear-gradient(90deg,#4ade80,#22c55e)' }}
                >
                  Fazer nova conversão
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/55">Seu saldo</span>
                  <span className="font-semibold text-[#4ade80]">{data.pontos} créditos</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Quantos créditos converter</label>
                  <input
                    type="number" disabled
                    min={MIN_CREDITOS_CONVERSAO}
                    value={creditosConverter}
                    onChange={e => setCreditosConverter(e.target.value)}
                    placeholder={`Ex: ${MIN_CREDITOS_CONVERSAO}`}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-white placeholder-white/40"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                  />
                  {abaixoMinimo && (
                    <p className="text-xs text-red-400 mt-1.5">Mínimo de {MIN_CREDITOS_CONVERSAO} créditos para converter.</p>
                  )}
                  {acimaSaldo && (
                    <p className="text-xs text-red-400 mt-1.5">Você só tem {data.pontos} créditos disponíveis.</p>
                  )}
                </div>
                <div className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.18)' }}>
                  <span className="text-sm text-white/55">Você receberá</span>
                  <span className="font-bold text-[#4ade80] font-serif-display" style={{ fontSize: 20 }}>
                    R${formatarReais(creditosNum > 0 ? valorReais : 0)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1.5">Chave Pix para receber</label>
                  <input
                    type="text" disabled
                    value={chavePix}
                    onChange={e => setChavePix(e.target.value)}
                    placeholder="E-mail, CPF, telefone ou chave aleatória"
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-white placeholder-white/40"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                  />
                  {creditosConverter !== '' && !chaveValida && (
                    <p className="text-xs text-red-400 mt-1.5">Informe uma chave Pix válida.</p>
                  )}
                </div>
                <button
                  onClick={solicitarConversao}
                  disabled={!podeConverter}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-[#070d19] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(90deg,#4ade80,#22c55e)' }}
                >
                  Solicitar Conversão
                </button>
                <p className="text-[11px] text-white/35 text-center">
                  100 créditos = R$1,00 · mínimo {MIN_CREDITOS_CONVERSAO} créditos
                </p>
              </div>
            )}
          </div>
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