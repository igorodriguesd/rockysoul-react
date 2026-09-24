import type { TrilhaEtapa } from '../types';
import { TRILHA_EVOLUCAO, nomeNivelPorPontos } from '../data/constants';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  pontos: number;
}

function StatusChip({ status, nome }: { status: 'atual' | 'alcançado' | 'próximo' | 'bloqueado'; nome: string }) {
  if (status === 'atual') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-(--t-onaccent) whitespace-nowrap shrink-0" style={{ background: 'var(--t-grad-brand)' }}>
        ● você
      </span>
    );
  }
  if (status === 'alcançado') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-brand whitespace-nowrap shrink-0" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
        ✓ {nome}
      </span>
    );
  }
  if (status === 'próximo') {
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-gold whitespace-nowrap shrink-0" style={{ background: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.35)' }}>
        ○ próximo
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-slate-400 whitespace-nowrap shrink-0" style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.25)' }}>
      🔒
    </span>
  );
}

function Etapa({ etapa, status, ultima }: { etapa: TrilhaEtapa; status: 'atual' | 'alcançado' | 'próximo' | 'bloqueado'; ultima: boolean }) {
  const ligado = status === 'atual' || status === 'alcançado';
  const bloqueado = status === 'bloqueado';

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 ${status === 'atual' ? '' : 'border border-transparent'}`}
        style={status === 'atual' ? { background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' } : undefined}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: status === 'atual' ? 'var(--t-grad-brand)' : 'var(--t-mist-gray)',
            border: status === 'atual' ? 'none' : '1px solid rgba(148,163,184,0.25)',
          }}
        >
          <img src={etapa.icone} alt="" className="w-4 h-4" style={{ filter: bloqueado ? 'grayscale(0.7)' : 'none', opacity: bloqueado ? 0.55 : 1 }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <p className={`text-[13px] font-bold leading-tight ${bloqueado ? 'text-slate-400' : 'text-slate-900'}`}>{etapa.nome}</p>
            <p className="text-[10px] text-slate-500 tabular-nums shrink-0">{etapa.minXP > 0 ? `${etapa.minXP.toLocaleString('pt-BR')} XP` : 'início'}</p>
          </div>
          <p className={`text-[11px] leading-snug mt-0.5 truncate ${bloqueado ? 'text-slate-400' : 'text-slate-500'}`}>{etapa.explicacao}</p>
        </div>
        <StatusChip status={status} nome={etapa.nome} />
      </div>

      {!bloqueado && (
        <p className="text-[10.5px] text-slate-500 leading-snug px-2.5 pt-1 pb-0.5">
          Recompensa <span className="text-gold-deep font-semibold">{etapa.recompensa.toLowerCase()}</span> · desbloqueia:{' '}
          <span className="text-slate-600">{etapa.desbloqueio.toLowerCase()}</span>
        </p>
      )}

      {!ultima && (
        <div className="flex justify-center py-0.5">
          <span className={`w-px h-3 ${ligado ? 'bg-brand/60' : 'bg-slate-500/30'}`} />
        </div>
      )}
    </div>
  );
}

export default function TrilhaEvolucaoModal({ aberto, onFechar, pontos }: Props) {
  if (!aberto) return null;

  const nivelAtual = nomeNivelPorPontos(pontos);
  const idxAtual = Math.max(0, TRILHA_EVOLUCAO.findIndex(e => e.nome === nivelAtual));
  const ordem = [...TRILHA_EVOLUCAO].reverse();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]" onClick={onFechar}>
      <div
        className="w-full max-w-sm bg-card-primary border border-card-primary-border shadow-card-primary rounded-2xl max-h-[82vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 z-10" style={{ background: 'var(--t-surface)', borderBottom: '1px solid var(--t-border-subtle)' }}>
          <h2 className="text-slate-900 font-bold text-sm flex items-center gap-2">
            <img src="/icons/trofeu.svg" className="w-4 h-4" alt="" />
            Minha evolução
          </h2>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            style={{ background: 'var(--t-mist)' }}
          >
            ✕
          </button>
        </div>

        <div className="px-3 py-4">
          {ordem.map((etapa, i) => {
            const idx = TRILHA_EVOLUCAO.findIndex(e => e.nome === etapa.nome);
            const status: 'atual' | 'alcançado' | 'próximo' | 'bloqueado' =
              idx === idxAtual ? 'atual' : idx < idxAtual ? 'alcançado' : idx === idxAtual + 1 ? 'próximo' : 'bloqueado';
            return <Etapa key={etapa.nome} etapa={etapa} status={status} ultima={i === ordem.length - 1} />;
          })}
        </div>
      </div>
    </div>
  );
}