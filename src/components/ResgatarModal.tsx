import { useState, useEffect, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { getParceiro } from '../data/constants';
import { showToast } from './Toast';
import type { Recompensa } from '../types';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  recompensa: Recompensa;
}

export default function ResgatarModal({ aberto, onFechar, recompensa }: Props) {
  const { data, subtrairPontos, addResgate, registrarImpactoParceiro } = useData();
  const [sucesso, setSucesso] = useState(false);
  const [saldoRestante, setSaldoRestante] = useState(0);

  const fechar = useCallback(() => {
    setSucesso(false);
    onFechar();
  }, [onFechar]);

  useEffect(() => {
    if (!aberto) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') fechar();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [aberto, fechar]);

  if (!aberto) return null;

  const podeResgatar = data.pontos >= recompensa.pontos;
  const parceiro = recompensa.parceiroId ? getParceiro(recompensa.parceiroId) : null;

  function confirmarResgate() {
    if (!podeResgatar) return;
    subtrairPontos(recompensa.pontos);
    const novoSaldo = data.pontos - recompensa.pontos;
    setSaldoRestante(novoSaldo);
    addResgate({
      nome: recompensa.nome,
      pontos: recompensa.pontos,
      data: new Date().toISOString(),
    });
    if (parceiro) registrarImpactoParceiro(parceiro.id, 'resgate', recompensa.pontos);
    setSucesso(true);
    showToast(`Resgate: ${recompensa.nome}`);
  }

  return (
    <div className="fixed inset-0 z-9998 flex items-start sm:items-center justify-center p-3 sm:p-6 pt-24 sm:pt-6 bg-black/60" onClick={fechar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={sucesso ? 'Resgate confirmado' : `Resgatar ${recompensa.nome}`}
        className="glass-strong rounded-2xl shadow-2xl w-[90vw] max-w-100 p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={fechar} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors z-10" aria-label="Fechar">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        {sucesso ? (
          <div className="text-center py-4">
            <img src="/icons/sucesso.svg" alt="Sucesso" className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-1">Resgate Confirmado</h2>
            <p className="text-sm text-slate-800 mb-1">
              <strong className="text-gold-deep">{recompensa.nome}</strong> resgatada com sucesso.
            </p>
            {parceiro && (
              <p className="text-xs text-slate-500 mb-1">
                Cortesia oferecida por <strong className="text-brand-2">{parceiro.nome}</strong> — obrigado por transformar o mundo!
              </p>
            )}
            <p className="text-xs text-slate-500 mb-4">
              Saldo restante: <strong className="text-gold-deep">{saldoRestante} créditos</strong>
            </p>
            <button
              onClick={fechar}
              className="w-full py-3 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all"
            >
              Concluir
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <img src={recompensa.icone} alt="" className="w-10 h-10" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">{recompensa.nome}</h2>
                <p className="text-xs text-slate-500">{recompensa.descricao}</p>
              </div>
            </div>

            <div className="card-secondary rounded-xl p-4 mb-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Custo</span>
                <span className="font-semibold text-gold-deep">{recompensa.pontos} créditos</span>
              </div>
              {parceiro && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Cortesia de</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-brand-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: parceiro.cor }} />
                    {parceiro.nome}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Seu saldo</span>
                <span className="font-semibold text-gold-deep">{data.pontos} créditos</span>
              </div>
              <div className="pt-2 flex justify-between text-sm" style={{ borderTop: '1px solid rgba(226,232,240,1)' }}>
                <span className="text-slate-500">Saldo após resgate</span>
                <span className={`font-semibold ${podeResgatar ? 'text-gold-deep' : 'text-red-500'}`}>
                  {data.pontos - recompensa.pontos} créditos
                </span>
              </div>
            </div>

            {!podeResgatar && (
              <p className="text-sm text-red-500 text-center mb-4">
                Você precisa de mais {recompensa.pontos - data.pontos} créditos para resgatar esta recompensa.
              </p>
            )}

            <button
              onClick={confirmarResgate}
              disabled={!podeResgatar}
              className="w-full py-3 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {podeResgatar ? 'Confirmar Resgate' : 'Créditos Insuficientes'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}