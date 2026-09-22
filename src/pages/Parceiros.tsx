import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { PARCEIROS, ENTREGA_ESTIMADA_KG } from '../data/constants';
import type { Parceiro } from '../types';

interface LinhaRanking {
  parceiro: Parceiro;
  kg: number;
  vouchers: number;
  pessoaEntregas: number;
  pessoaResgates: number;
  tipo: string;
}

function rotuloTipo(p: Parceiro): string {
  return p.tipos.map(t => t === 'ecoponto' ? 'ecoponto' : t === 'voucher' ? 'cortesia' : 'patrocinador').join(' + ');
}

function medalha(i: number) {
  if (i === 0) return { background: 'linear-gradient(135deg,#ffc928,#f59e0b)', color: 'white', label: '1º' };
  if (i === 1) return { background: 'linear-gradient(135deg,#cbd5e1,#94a3b8)', color: 'white', label: '2º' };
  if (i === 2) return { background: 'linear-gradient(135deg,#d97706,#b45309)', color: 'white', label: '3º' };
  return { background: 'var(--t-mist)', color: 'var(--color-brand)', label: `${i + 1}º` };
}

export function Parceiros() {
  const { data } = useData();

  const linhas = useMemo<LinhaRanking[]>(() => {
    const impacto = data.impactoParceiros ?? {};
    return PARCEIROS
      .filter(p => p.impactoBase)
      .map(p => {
        const meu = impacto[p.id] ?? { entregas: 0, resgates: 0, creditos: 0 };
        return {
          parceiro: p,
          kg: p.impactoBase!.kg + meu.entregas * ENTREGA_ESTIMADA_KG,
          vouchers: p.impactoBase!.vouchers + meu.resgates,
          pessoaEntregas: meu.entregas,
          pessoaResgates: meu.resgates,
          tipo: rotuloTipo(p),
        };
      })
      .sort((a, b) => b.kg - a.kg || b.vouchers - a.vouchers);
  }, [data.impactoParceiros]);

  const maxKg = Math.max(...linhas.map(l => l.kg), 1);
  const totalKg = linhas.reduce((s, l) => s + l.kg, 0);
  const totalVouchers = linhas.reduce((s, l) => s + l.vouchers, 0);
  const contribuicoesPessoais = linhas.filter(l => l.pessoaEntregas > 0 || l.pessoaResgates > 0).length;

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-4 lg:py-6 flex flex-col gap-4">
      <div className="card-primary rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(var(--color-brand), transparent)' }} />
        <div className="flex items-center gap-2 mb-2">
          <img src="/icons/trofeu.svg" alt="" className="w-5 h-5" />
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Ranking de Empresas</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif-display">Parceiras que sustentam o impacto</h1>
        <p className="text-sm text-slate-600 mt-1 max-w-[560px]">
          Cada entrega no ecoponto soma <strong className="text-slate-800">{ENTREGA_ESTIMADA_KG}kg</strong> ao volume da empresa e cada cortesia
          resgatada vira um resgate registrado. Suas ações fazem essas empresas subirem no ranking.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
          <div className="rounded-xl p-3" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest">Volume recuperado</p>
            <p className="text-brand font-bold" style={{ fontSize: 20 }}>{totalKg.toLocaleString('pt-BR')} kg</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'var(--t-mist)', border: '1px solid var(--t-brand-border)' }}>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest">Cortesias concedidas</p>
            <p className="text-brand font-bold" style={{ fontSize: 20 }}>{totalVouchers.toLocaleString('pt-BR')}</p>
          </div>
          {contribuicoesPessoais > 0 && (
            <div className="rounded-xl p-3" style={{ background: 'color-mix(in srgb, #FACC15 10%, var(--t-mist))', border: '1px solid rgba(250,204,21,0.5)' }}>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Seu impacto</p>
              <p className="text-gold-deep font-bold" style={{ fontSize: 20 }}>
                {linhas.reduce((s, l) => s + l.pessoaEntregas + l.pessoaResgates, 0)} ações
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="card-tertiary rounded-2xl p-4 sm:p-5 flex flex-col gap-1">
        {linhas.map((l, i) => {
          const med = medalha(i);
          return (
            <div key={l.parceiro.id} className="flex items-start gap-3 py-3 border-b border-slate-200 last:border-0">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                style={{ background: med.background, color: med.color }}
              >
                {med.label}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.parceiro.cor }} />
                  <strong className="text-slate-900 text-sm truncate">{l.parceiro.nome}</strong>
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-semibold" style={{ background: 'var(--t-mist)', color: 'var(--color-brand)' }}>
                    {l.tipo}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-snug mt-0.5">
                  {l.parceiro.descricao} · {l.parceiro.localizacao}
                </p>
                {l.pessoaEntregas > 0 || l.pessoaResgates > 0 ? (
                  <p className="text-brand text-[10px] font-semibold mt-1">
                    Você contribuiu: {l.pessoaEntregas} entrega{l.pessoaEntregas === 1 ? '' : 's'} · {l.pessoaResgates} cortesia{l.pessoaResgates === 1 ? '' : 's'}
                  </p>
                ) : null}
                <div className="h-2 rounded-full overflow-hidden mt-2" style={{ background: 'var(--t-slate-200)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(l.kg / maxKg) * 100}%`, background: `linear-gradient(90deg, ${l.parceiro.cor}, var(--color-brand-2))` }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-slate-900 font-bold text-sm">{l.kg.toLocaleString('pt-BR')} kg</p>
                <p className="text-slate-500 text-[10px]">{l.vouchers.toLocaleString('pt-BR')} cortesias</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-tertiary rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Sua empresa pode entrar nesse ranking</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Ecopontos, patrocinadores e cortesias financiam a plataforma — e ganham visibilidade com seu impacto real.
            Números de demonstração sobre uma base simulada; entregas e resgates seus são reais.
          </p>
        </div>
        <Link
          to="/contato"
          className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shrink-0 text-center"
          style={{ background: 'var(--t-grad-brand)', color: 'var(--t-onaccent)' }}
        >
          Ser um parceiro
        </Link>
      </div>
    </div>
  );
}