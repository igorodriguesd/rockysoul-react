import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MISSOES, CURIOSIDADES, RECOMPENSAS, PARCEIROS, BONUS_ECOPONTO, AMIGOS_SIMULADOS } from '../data/constants';
import VerificarModal from '../components/VerificarModal';
import MiniJogoSeparacao from '../components/MiniJogoSeparacao';
import { TermoAjuda } from '../components/TermoAjuda';
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

const MISSAO_COR_MAP: Record<string, string> = {
  reciclagem: 'var(--color-brand-2)',
  transporte: '#7dd3fc',
  energia: 'var(--color-brand-3)',
  agua: '#7dd3fc',
  bicicleta: 'var(--color-brand-2)',
  plantio: 'var(--color-brand)',
  banho: '#7dd3fc',
  compostagem: 'var(--color-brand-3)',
  consumo: '#c4b5fd',
  garrafa: '#7dd3fc',
  educar: '#c4b5fd',
  sacola: 'var(--color-brand)',
  captacao: '#7dd3fc',
  mobilidade: '#eab308',
  ciclovia: '#7dd3fc',
  solar: '#eab308',
  eolica: '#eab308',
  led: '#f5c451',
  horta: 'var(--color-brand-3)',
  agrofloresta: 'var(--color-brand)',
};

const NIVEL_ICONE: Record<string, string> = {
  Semente: '/icons/semente.svg',
  Broto: '/icons/folha.svg',
  'Árvore': '/icons/arvore.svg',
  Floresta: '/icons/floresta.svg',
};

function getGreeting(nivel: string): string {
  switch (nivel) {
    case 'Semente': return 'Continue plantando sementes!';
    case 'Broto': return 'Você está crescendo!';
    case 'Árvore': return 'Que impacto incrível!';
    case 'Floresta': return 'Você é uma verdadeira guardiã do planeta!';
    default: return 'Bem-vindo!';
  }
}

function nivelPorPontos(pontos: number): string {
  if (pontos >= 1000) return 'Floresta';
  if (pontos >= 450) return 'Árvore';
  if (pontos >= 150) return 'Broto';
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



export function Dashboard() {
  const { data, getNivel, desafioDoDia, desafioBonusDisponivel, resgatarBonusDesafio, addAmigo, codigoAmigo, amigos } = useData();
  const [missaoSelecionada, setMissaoSelecionada] = useState<(typeof MISSOES)[0] | null>(null);
  const [codigoInput, setCodigoInput] = useState('');

  useEffect(() => {
    document.title = 'RockySoulUp - Dashboard';
  }, []);

  const nivel = getNivel();

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
  const ecopontos = PARCEIROS.filter(p => p.tipos.includes('ecoponto'));

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

          <div className="bg-card-primary border border-card-primary-border shadow-card-primary rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(var(--color-brand), transparent)' }} />
            <div className="flex items-center gap-2 mb-3">
              <BoltIcon />
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Desafio do Dia</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <img src={desafioDoDia.icone} className="w-10 h-10 shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 font-semibold text-base truncate">{desafioDoDia.nome}</p>
                <p className="text-slate-500 text-sm">
                  +{desafioDoDia.pontos} pts · verificação por foto
                </p>
              </div>
            </div>
            <div className="mb-3">
              <span className="text-[#ffc928]/80 text-xs">
                {desafioBonusDisponivel ? 'Bônus extra disponível' : 'bônus já resgatado'}
              </span>
            </div>
            {patrocinadorDesafio && (
              <div className="flex items-center gap-1.5 mb-3 rounded-lg px-2.5 py-1.5 w-fit" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: patrocinadorDesafio.cor }} />
                <span className="text-[10px] uppercase tracking-wider text-slate-600">
                  Desafio do dia patrocinado por <strong className="text-slate-800">{patrocinadorDesafio.nome}</strong>
                </span>
              </div>
            )}
            <button
              onClick={handleAcaoDesafio}
              disabled={desafioFeito}
              className={`w-full rounded-full font-semibold text-sm py-2.5 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${desafioFeito ? '' : 'animate-pulse-glow'}`}
              style={{
                background: desafioFeito ? 'var(--t-mist)' : 'var(--t-grad-strong)',
                color: desafioFeito ? 'var(--color-brand)' : '#FFFFFF',
                border: desafioFeito ? '1px solid var(--t-brand-border)' : 'none',
                boxShadow: desafioFeito ? 'none' : '0 8px 24px rgba(79,70,229,0.35)',
              }}
            >
              {desafioFeito && <img src="/icons/check.svg" className="w-3.5 h-3.5" alt="" />}
              {desafioFeito ? 'Concluído' : 'Cumprir desafio'}
            </button>
          </div>

          <div className="bg-card-tertiary border border-card-secondary-border rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src="/icons/localizacao.svg" className="w-4 h-4 opacity-60" alt="" />
              <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Ecopontos parceiros</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {ecopontos.map(p => (
                <div key={p.id} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: p.cor }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-slate-800 text-xs font-semibold leading-tight truncate">{p.nome}</p>
                    <p className="text-slate-500 text-[10px] leading-snug line-clamp-1">{p.descricao}</p>
                  </div>
                  <span className="text-slate-400 text-[10px] shrink-0">{p.localizacao}</span>
                </div>
              ))}
            </div>
            <p className="text-brand/80 text-[10px] font-medium">
              +{BONUS_ECOPONTO} créditos ao entregar seus resíduos em um parceiro (Reciclagem e Compostagem)
            </p>
          </div>

          <div className="bg-card-tertiary border border-card-secondary-border rounded-2xl p-4 flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2">
              <img src="/icons/lampada.svg" className="w-4 h-4 opacity-60" alt="" />
              <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Dica do Dia</span>
            </div>
            <p className="text-slate-600 text-sm leading-snug flex-1 font-serif-display italic">
              "{dicaDoDia}"
            </p>
            <span className="text-brand/60 text-[11px] font-medium">Verificado pela IA</span>
          </div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col gap-5">

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

          <div>
            <p className="text-white/35 text-sm">Bom dia,</p>
            <h1 className="text-white mt-0.5 font-serif-display" style={{ fontSize: 30 }}>
              {nomeExibido} <span style={{ color: 'var(--color-brand-3)' }}>—</span> {getGreeting(nivel)}
            </h1>
          </div>

          <div className="lg:hidden bg-card-primary border border-card-primary-border shadow-card-primary rounded-2xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <BoltIcon />
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Desafio do Dia</span>
              </div>
              <span className={`text-[10px] font-semibold ${desafioBonusDisponivel ? 'text-[#ffc928]/80' : 'text-slate-400'}`}>
                {desafioBonusDisponivel ? 'Bônus extra disponível' : 'bônus já resgatado'}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <img src={desafioDoDia.icone} className="w-9 h-9 shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 font-semibold text-sm truncate">{desafioDoDia.nome}</p>
                <p className="text-slate-500 text-xs">+{desafioDoDia.pontos} pts · verificação por foto</p>
              </div>
            </div>
            {patrocinadorDesafio && (
              <div className="flex items-center gap-1.5 mb-3 rounded-lg px-2.5 py-1.5 w-fit" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: patrocinadorDesafio.cor }} />
                <span className="text-[10px] uppercase tracking-wider text-slate-600">
                  Patrocinado por <strong className="text-slate-800">{patrocinadorDesafio.nome}</strong>
                </span>
              </div>
            )}
            <button
              onClick={handleAcaoDesafio}
              disabled={desafioFeito}
              className={`w-full rounded-full font-semibold text-sm py-2.5 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${desafioFeito ? '' : 'animate-pulse-glow'}`}
              style={{
                background: desafioFeito ? 'var(--t-mist)' : 'var(--t-grad-strong)',
                color: desafioFeito ? 'var(--color-brand)' : '#FFFFFF',
                border: desafioFeito ? '1px solid var(--t-brand-border)' : 'none',
                boxShadow: desafioFeito ? 'none' : '0 8px 24px rgba(79,70,229,0.35)',
              }}
            >
              {desafioFeito && <img src="/icons/check.svg" className="w-3.5 h-3.5" alt="" />}
              {desafioFeito ? 'Concluído' : 'Cumprir desafio'}
            </button>
          </div>

          <div className="bg-card-secondary border border-card-secondary-border rounded-2xl p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-slate-900 font-semibold">
                Registrar Ação
                <TermoAjuda
                  termo="Créditos"
                  dica="Toda ação sustentável que você registra (com foto) paga créditos — os pontos da plataforma. Eles sobem seu nível, alimentam o ranking e podem ser trocados por recompensas ou Pix."
                />
              </h2>
              <span className="text-slate-500 text-[13px]">{feitasHoje.size}/{MISSOES.length} hoje</span>
            </div>
            <p className="text-slate-500 text-xs mb-3">
              Toque em uma ação para registrar com foto e ganhar créditos.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5 auto-rows-min flex-1 content-start">
              {MISSOES.map(missao => {
                const cor = MISSAO_COR_MAP[missao.id] || 'var(--color-brand-2)';
                const checked = feitasHoje.has(missao.nome);
                return (
                  <button
                    key={missao.id}
                    onClick={() => handleMissao(missao)}
                    title={`${missao.nome} · +${missao.pontos} pontos`}
                    aria-label={`${checked ? 'Feita hoje · ' : ''}${missao.nome}, +${missao.pontos} pontos. Toque para registrar.`}
                    className="rounded-xl p-3 h-full flex flex-col gap-1.5 text-left transition-all group active:scale-95 relative overflow-hidden cursor-pointer"
                    style={{
                      background: checked ? `color-mix(in srgb, ${cor} 12%, transparent)` : 'var(--t-surface-2)',
                      border: checked ? `1px solid color-mix(in srgb, ${cor} 45%, transparent)` : '1px solid var(--t-slate-200)',
                    }}
                  >
                    {checked && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--t-mist)' }}>
                        <img src="/icons/check.svg" className="w-2.5 h-2.5" alt="feito" />
                      </div>
                    )}
                    <img
                      src={MISSAO_ICONE_MAP[missao.id]}
                      className="w-8 h-8 group-hover:scale-110 transition-transform"
                      alt=""
                    />
                    <div className="mt-auto">
                      <p className="text-slate-800 text-sm font-medium leading-snug">{missao.nome}</p>
                      <div className="flex items-center justify-between gap-1 mt-1.5">
                        <p className="font-semibold text-sm" style={{ color: cor }}>+{missao.pontos} pts</p>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${checked ? 'text-brand bg-brand-soft' : 'text-white'}`}
                          style={checked ? {} : { background: cor }}
                        >
                          {checked ? 'Feita' : 'Registrar'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <MiniJogoSeparacao compacto />
        </div>

        <aside className="hidden lg:flex flex-col lg:w-75 shrink-0 gap-4">

          <div className="bg-card-tertiary border border-card-secondary-border rounded-2xl p-4">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-slate-500 text-[11px] uppercase tracking-widest">Comunidade de Amigos</p>
              <button
                onClick={copiarCodigoAmigo}
                title="Copiar meu código de amigo"
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-brand transition-colors hover:bg-brand-soft cursor-pointer"
                style={{ border: '1px solid var(--t-brand-border)' }}
              >
                <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="12" height="12" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                {codigoAmigo}
              </button>
            </div>
            <p className="text-slate-500 text-[11px] mb-2">Adicione amigos e compare pontos, níveis e sequência.</p>

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
                className="px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
                style={{ background: 'var(--t-grad-brand)', color: 'var(--t-onaccent)' }}
              >
                Adicionar
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
                  <p className="text-slate-500 text-[11px]">{data.pontos} pts · 🔥 {data.streak}d</p>
                </div>
                <img src={NIVEL_ICONE[nivel] || '/icons/semente.svg'} className="w-4 h-4" alt="" />
              </div>

              {amigosAdicionados.map((u, i) => {
                const nivelUser = NIVEL_ICONE[nivelPorPontos(u.pontos)] || '/icons/semente.svg';
                return (
                  <div key={u.codigo} className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-all hover:bg-brand-soft">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                      style={{
                        background: i === 0 ? 'linear-gradient(135deg,#ffc928,#f59e0b)' : i === 1 ? 'linear-gradient(135deg,#cbd5e1,#94a3b8)' : i === 2 ? 'linear-gradient(135deg,#d97706,#b45309)' : 'var(--t-mist)',
                        color: i < 3 ? 'white' : 'var(--color-brand)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-(--t-onaccent) shrink-0"
                      style={{ background: 'var(--t-grad-brand)', opacity: i === 0 ? 1 : 0.7 }}
                    >
                      {u.nome[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 text-sm font-medium truncate">{u.nome}</p>
                      <p className="text-slate-500 text-[11px]">{u.pontos} pts · 🔥 {u.streak}d</p>
                    </div>
                    <img src={nivelUser} className="w-4 h-4" alt="" />
                  </div>
                );
              })}
            </div>

            {amigosAdicionados.length === 0 && (
              <p className="text-slate-400 text-[11px] mt-2">Nenhum amigo ainda — use o código acima para adicionar.</p>
            )}

            {poolAmigos.length > 0 && (
              <div className="mt-3">
                <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1.5">Possíveis amigos</p>
                <div className="flex flex-col gap-1">
                  {poolAmigos.map(a => (
                    <button
                      key={a.codigo}
                      onClick={() => addAmigo(a.codigo)}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-brand-soft cursor-pointer"
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

          <div className="bg-card-tertiary border border-card-secondary-border rounded-2xl p-4 flex flex-col min-h-0">
            <p className="text-slate-500 text-[11px] uppercase tracking-widest mb-3">Atividade Recente</p>
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
              <div className="flex flex-col gap-0 flex-1 justify-start">
                {recentHistory.map((entry: AtividadeItem) => {
                  const ganhou = entry.tipo === 'acao';
                  const ehConversao = entry.tipo === 'conversao';
                  return (
                    <div key={entry.id} className="flex items-start gap-2.5 py-3 border-b border-slate-200 last:border-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: ganhou ? 'var(--t-mist)' : ehConversao ? 'var(--t-mist)' : 'rgba(251,191,36,0.1)', border: '1px solid var(--t-brand-border)' }}
                      >
                        {ehConversao ? (
                          <span className="text-brand text-[11px] font-bold">R$</span>
                        ) : (
                          <img src={entry.icone} className="w-4 h-4" alt="" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 text-sm font-medium leading-snug truncate">{entry.nome}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-slate-500 text-[11px]">{timeAgo(entry.data)}</span>
                          {!ganhou && (
                            <span
                              className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-semibold"
                              style={{ background: ehConversao ? 'var(--t-mist)' : 'rgba(251,191,36,0.14)', color: ehConversao ? 'var(--color-brand)' : '#fbbf24' }}
                            >
                              {ehConversao ? 'conversão' : 'resgate'}
                            </span>
                          )}
                        </div>
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
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="#ffc928">
      <path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />
    </svg>
  );
}