import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MISSOES, RECOMPENSAS, SELOS, CO2_POR_MISSAO, CREDITOS_POR_REAL, MIN_CREDITOS_CONVERSAO, getParceiro } from '../data/constants';
import ResgatarModal from '../components/ResgatarModal';
import { showToast } from '../components/Toast';
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

  const { data, getNivel, subtrairPontos, addResgate } = useData();
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
  const podeConverter = !conversaoFeita && creditosNum >= MIN_CREDITOS_CONVERSAO && creditosNum <= data.pontos && chaveValida;

  function solicitarConversao() {
    if (!podeConverter) return;
    subtrairPontos(creditosNum);
    addResgate({
      nome: `Conversão de créditos em dinheiro (R$${formatarReais(valorReais)})`,
      pontos: creditosNum,
      data: new Date().toISOString(),
    });
    setConversaoFeita({ creditos: creditosNum, valor: valorReais });
    showToast(`Conversão de ${creditosNum} créditos = R$${formatarReais(valorReais)}`);
  }

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
          <p className="text-white/70">Acumule créditos, resgate recompensas ecológicas ou converta em dinheiro</p>
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full border border-gold/50" style={{ background: 'rgba(250,204,21,0.14)' }}>
            <img src="/icons/trofeu.svg" alt="" className="w-4 h-4" />
            <span className="text-sm font-semibold text-gold">{data.pontos} créditos disponíveis</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {RECOMPENSAS.map(r => {
            const podeResgatar = data.pontos >= r.pontos;
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
                    onClick={() => setRecompensaSelecionada(r)}
                    disabled={!podeResgatar}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${podeResgatar
                        ? 'bg-brand text-(--t-onaccent) hover:bg-brand-hover cursor-pointer'
                        : 'bg-brand-soft text-slate-400 cursor-not-allowed'
                      }`}
                  >
                    {jaResgatou ? 'Resgatado' : podeResgatar ? 'Resgatar' : 'Créditos insuficientes'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12">
          <div className="bg-card-secondary border border-card-secondary-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-500 text-[11px] uppercase tracking-widest">Trilha de Evolução</p>
              <span className="text-brand text-sm font-bold">{nivel}</span>
            </div>
            <div className="flex flex-col gap-3">
              {SELOS.map((l, i, arr) => {
                const unlocked = (data.pontosAcumulados ?? data.pontos) >= l.minPontos;
                const active = nivel === l.nome;
                return (
                  <div key={l.id} className="flex items-center gap-3.5 relative">
                    {i < arr.length - 1 && (
                      <div className="absolute left-4.5 top-9 w-px h-5" style={{ background: unlocked ? 'var(--t-brand-border)' : 'rgba(148,163,184,0.3)' }} />
                    )}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all"
                      style={{
                        background: active ? 'var(--t-grad-brand)' : unlocked ? 'var(--t-mist)' : 'var(--t-mist-gray)',
                        border: active ? 'none' : unlocked ? '1px solid var(--t-brand-border)' : '1px solid rgba(148,163,184,0.3)',
                        filter: unlocked ? 'none' : 'grayscale(1)',
                        opacity: unlocked ? 1 : 0.35,
                      }}
                    >
                      <img src={l.icone} className="w-5 h-5" alt="" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${active ? 'text-brand' : unlocked ? 'text-slate-800' : 'text-slate-400'}`}>{l.nome}</p>
                      <p className="text-slate-500 text-[11px]">{l.descricao} · {l.minPontos > 0 ? `${l.minPontos} pts` : 'desde o início'}</p>
                    </div>
                    {active && <span className="text-[11px] text-brand font-semibold">atual</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card-secondary border border-card-secondary-border rounded-2xl p-5">
            <p className="text-slate-500 text-[11px] uppercase tracking-widest mb-4">Impacto Ambiental</p>
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {[
                { icon: '/icons/check.svg', label: 'kg CO₂ evitado', value: totalCO2.toFixed(1) },
                { icon: '/icons/arvore.svg', label: 'Árvores equiv.', value: arvoresEquiv },
                { icon: '/icons/trofeu.svg', label: 'Dias seguidos', value: `${data.streak}d` },
              ].map(m => (
                <div key={m.label} className="text-center rounded-2xl py-4 px-2" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
                  <img src={m.icon} className="w-6 h-6 mx-auto" alt="" />
                  <p className="text-brand font-bold mt-1.5 font-serif-display" style={{ fontSize: 20 }}>{m.value}</p>
                  <p className="text-slate-500 text-[10px] mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-4" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
              <p className="text-sm text-slate-700 font-medium">Ações registradas</p>
              <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                Cada ação registrada conta como CO₂ evitado e aproxima você dos selos da trilha.
              </p>
              <p className="text-brand font-bold mt-2 font-serif-display" style={{ fontSize: 22 }}>
                {data.historico.length} <span className="text-[11px] font-medium opacity-60">ações</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card-secondary border border-card-secondary-border rounded-2xl p-5 sm:p-6 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 items-start">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-(--t-onaccent) font-bold font-serif-display"
                  style={{ background: 'var(--t-grad-brand)' }}
                >
                  R$
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Conversor de Créditos</h2>
                  <p className="text-xs text-slate-500">Converta seus créditos da plataforma em dinheiro</p>
                </div>
              </div>
              <div className="rounded-2xl p-4 mb-3" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Taxa de conversão</p>
                <p className="text-gold-deep font-bold font-serif-display" style={{ fontSize: 20 }}>
                  {CREDITOS_POR_REAL} créditos = R$1,00
                </p>
              </div>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  Mínimo de <strong className="text-slate-800">{MIN_CREDITOS_CONVERSAO} créditos</strong> por conversão.
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
            </div>

            {conversaoFeita ? (
              <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
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
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Seu saldo</span>
                  <span className="font-semibold text-gold-deep">{data.pontos} créditos</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantos créditos converter</label>
                  <input
                    type="number"
                    min={MIN_CREDITOS_CONVERSAO}
                    value={creditosConverter}
                    onChange={e => setCreditosConverter(e.target.value)}
                    placeholder={`Ex: ${MIN_CREDITOS_CONVERSAO}`}
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-slate-800 placeholder-slate-400"
                    style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(148,163,184,0.45)' }}
                  />
                  {abaixoMinimo && (
                    <p className="text-xs text-red-400 mt-1.5">Mínimo de {MIN_CREDITOS_CONVERSAO} créditos para converter.</p>
                  )}
                  {acimaSaldo && (
                    <p className="text-xs text-red-400 mt-1.5">Você só tem {data.pontos} créditos disponíveis.</p>
                  )}
                </div>
                <div className="rounded-xl px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.35)' }}>
                  <span className="text-sm text-slate-500">Você receberá</span>
                  <span className="font-bold text-gold font-serif-display" style={{ fontSize: 20 }}>
                    R${formatarReais(creditosNum > 0 ? valorReais : 0)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Chave Pix para receber</label>
                  <input
                    type="text"
                    value={chavePix}
                    onChange={e => setChavePix(e.target.value)}
                    placeholder="E-mail, CPF, telefone ou chave aleatória"
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none text-slate-800 placeholder-slate-400"
                    style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(148,163,184,0.45)' }}
                  />
                  {creditosConverter !== '' && !chaveValida && (
                    <p className="text-xs text-red-400 mt-1.5">Informe uma chave Pix válida.</p>
                  )}
                </div>
                <button
                  onClick={solicitarConversao}
                  disabled={!podeConverter}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-(--t-onaccent) transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'var(--t-grad-brand)' }}
                >
                  Solicitar Conversão
                </button>
                <p className="text-[11px] text-slate-500 text-center">
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