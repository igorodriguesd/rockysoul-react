import { useState } from 'react';
import {
  VALOR_POR_RARIDADE,
  CHANCE_DROP_POR_RARIDADE,
  FRAGMENTOS_POR_DUPLICADA,
  CUSTO_FABRICACAO,
  LABEL_RARIDADE,
  SETS_CARTAS,
  getValorSet,
  getValorSetCompleto,
  BONUS_QUIMICA_N2,
  BONUS_QUIMICA_N3,
  BONUS_QUIMICA_SET,
  MULTIPLICADOR_FOIL,
} from '../data/cartas';
import type { RaridadeCarta } from '../types';

const ORDEM_RARIDADES: RaridadeCarta[] = ['comum', 'incomum', 'rara', 'epica', 'lendaria'];

const COR_RARIDADE: Record<RaridadeCarta, string> = {
  comum: '#9ca3af',
  incomum: '#38bdf8',
  rara: '#a855f7',
  epica: '#ff4d9e',
  lendaria: '#fbbf24',
};

interface Props {
  valorTotal: number;
  obtidas: number;
  total: number;
  foils: number;
}

export default function PainelValorColecao({ valorTotal, obtidas, total, foils }: Props) {
  const [aberto, setAberto] = useState(false);

  return (
    <section
      className="rounded-2xl p-4 sm:p-5 mb-5"
      style={{ background: 'var(--t-collection-bg)', border: '1px solid var(--t-collection-border)' }}
    >
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl px-3 py-2.5 bg-(--t-surface-2) border border-(--t-card-primary-border)">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Valor da coleção</p>
          <p className="text-xl font-extrabold text-gold leading-tight mt-0.5">{valorTotal} créd.</p>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Já creditados no seu saldo</p>
        </div>
        <div className="rounded-xl px-3 py-2.5 bg-(--t-surface-2) border border-(--t-card-primary-border)">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Cartas</p>
          <p className="text-xl font-extrabold text-slate-900 leading-tight mt-0.5">{obtidas}/{total}</p>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
            {foils > 0 ? `${foils} brilhante${foils > 1 ? 's' : ''} (valor ×${MULTIPLICADOR_FOIL})` : 'nenhuma brilhante ainda'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAberto(v => !v)}
        className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-gold border border-gold/40 bg-gold/10 hover:bg-gold/20 active:scale-[0.99] transition-all cursor-pointer"
      >
        {aberto ? 'Fechar o guia de valores' : 'Quanto vale cada carta e cada set?'}
        <span className="text-sm leading-none">{aberto ? '▲' : '▼'}</span>
      </button>

      {aberto && (
        <div className="mt-3 space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">Quanto vale cada raridade</p>
            <div className="rounded-xl overflow-hidden border border-(--t-card-primary-border)">
              <div className="grid grid-cols-[1.4fr_0.9fr_0.9fr_1fr_1fr] gap-1 px-3 py-2 bg-(--t-surface-2) text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <span>Raridade</span>
                <span>Valor</span>
                <span>Chance</span>
                <span>Repetida</span>
                <span>Fabricar</span>
              </div>
              {ORDEM_RARIDADES.map(r => (
                <div
                  key={r}
                  className="grid grid-cols-[1.4fr_0.9fr_0.9fr_1fr_1fr] gap-1 px-3 py-2 text-[11px] border-t border-(--t-card-primary-border) items-center"
                >
                  <span className="font-bold flex items-center gap-1.5" style={{ color: COR_RARIDADE[r] }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: COR_RARIDADE[r] }} />
                    {LABEL_RARIDADE[r]}
                  </span>
                  <span className="text-gold font-bold">+{VALOR_POR_RARIDADE[r]}</span>
                  <span className="text-slate-400">{CHANCE_DROP_POR_RARIDADE[r]}%</span>
                  <span className="text-slate-400">+{FRAGMENTOS_POR_DUPLICADA[r]} frag.</span>
                  <span className="text-slate-400">{CUSTO_FABRICACAO[r]} frag.</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-snug">
              <strong className="text-gold">Carta brilhante (foil) vale ×{MULTIPLICADOR_FOIL}</strong> — a mesma carta sobe
              de rara (30) para rara brilhante (90), com 8% de chance ao ganhar uma carta. Repetida normalmente não dá créditos:
              vira fragmentos para fabricar as que faltam (a não ser que evolua para brilhante). E fabricar também credita o valor da carta.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">Quanto vale completar um set</p>
            <div className="rounded-xl overflow-hidden border border-(--t-card-primary-border)">
              <div className="grid grid-cols-[1.6fr_0.9fr_1fr_0.9fr] gap-1 px-3 py-2 bg-(--t-surface-2) text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                <span>Set</span>
                <span>Cartas</span>
                <span>Química</span>
                <span>Total</span>
              </div>
              {SETS_CARTAS.map(set => (
                <div
                  key={set.id}
                  className="grid grid-cols-[1.6fr_0.9fr_1fr_0.9fr] gap-1 px-3 py-2 text-[11px] border-t border-(--t-card-primary-border) items-center"
                >
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: set.cor }} />
                    {set.nome}
                  </span>
                  <span className="text-slate-400">+{getValorSet(set.id)}</span>
                  <span className="text-slate-400">+{BONUS_QUIMICA_SET}</span>
                  <span className="text-gold font-bold">{getValorSetCompleto(set.id)}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-snug">
              A química do set paga em marcos: <strong className="text-brand-2">+{BONUS_QUIMICA_N2} créditos</strong> ao
              completar 3 de 4 cartas e <strong className="text-brand-2">+{BONUS_QUIMICA_N3} créditos</strong> ao fechar as
              4 (set completo, nível 3). O valor de cada carta já entra no saldo na hora em que você a conquista.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
