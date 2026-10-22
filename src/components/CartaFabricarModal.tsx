import { useCallback, useEffect, useState } from 'react';
import { useColecao } from '../context/CollectionContext';
import { useData } from '../context/DataContext';
import {
  CUSTO_FABRICACAO,
  FRAGMENTOS_POR_DUPLICADA,
  LABEL_RARIDADE,
  SETS_CARTAS,
  getValorCarta,
  missoesPorRaridade,
  CARD_TO_MISSION,
} from '../data/cartas';
import { MISSOES, nomeNivelPorPontos, grupoDaCarta } from '../data/constants';
import { showToast } from './Toast';
import IconeMissao from './IconeMissao';
import type { Carta } from '../types';

interface Props {
  carta: Carta | null;
  onFechar: () => void;
}

/**
 * Modal de fabricacao a partir de fragmentos.
 * Aberto ao clicar numa carta que ainda falta no set da colecao:
 * mostra o custo em fragmentos e o botao "Usar fragmentos".
 */
export default function CartaFabricarModal({ carta, onFechar }: Props) {
  const { colecao, fabricarCarta } = useColecao();
  const { data } = useData();
  const [sucesso, setSucesso] = useState(false);

  const fechar = useCallback(() => {
    setSucesso(false);
    onFechar();
  }, [onFechar]);

  useEffect(() => {
    if (!carta) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') fechar();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [carta, fechar]);

  if (!carta) return null;

  const set = SETS_CARTAS.find(s => s.id === carta.setId);
  const pontos = data.pontosAcumulados ?? data.pontos;
  const setLiberado = set ? pontos >= set.pontosMin : false;
  const custo = CUSTO_FABRICACAO[carta.raridade];
  const tem = colecao.fragmentos?.[carta.raridade] ?? 0;
  const faltam = Math.max(0, custo - tem);
  const porRepetida = FRAGMENTOS_POR_DUPLICADA[carta.raridade];
  const valor = getValorCarta(carta);
  const pode = setLiberado && faltam === 0;

  const missaoId = CARD_TO_MISSION[carta.id];
  const missoesRaridade = missoesPorRaridade(carta.raridade)
    .map(id => MISSOES.find(m => m.id === id))
    .filter((m): m is (typeof MISSOES)[number] => !!m);
  const missaoDaCarta = MISSOES.find(m => m.id === missaoId);

  function fabricar() {
    if (!carta || !pode) return;
    const nova = fabricarCarta(carta.id);
    if (!nova) return;
    setSucesso(true);
    showToast(`Carta montada: ${carta.nome} · +${valor} créditos no seu saldo`);
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-start sm:items-center justify-center p-3 sm:p-6 pt-24 sm:pt-6 bg-black/60" onClick={fechar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Montar ${carta.nome} com fragmentos`}
        className="[background:var(--t-glass-strong)] border border-(--t-glass-strong-border) shadow-(--t-glass-strong-shadow) rounded-2xl shadow-2xl w-[90vw] max-w-100 p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={fechar} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors z-10" aria-label="Fechar">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        {sucesso ? (
          <div className="text-center py-4">
            <img src="/icons/sucesso.svg" alt="Sucesso" className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-1">Carta montada!</h2>
            <p className="text-sm text-slate-800 mb-1">
              <strong className="text-gold-deep">{carta.nome}</strong> entrou na sua coleção.
            </p>
            <p className="text-xs text-slate-500 mb-4">
              +<strong className="text-gold-deep">{valor} créditos</strong> no seu saldo
            </p>
            <button onClick={fechar} className="w-full py-3 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all">
              Concluir
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-(--t-mist) flex items-center justify-center shrink-0">
                <IconeMissao src={carta.icone} cor={grupoDaCarta(carta.id)?.cor ?? '#94a3b8'} className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900 leading-tight">{carta.nome}</h2>
                <p className="text-xs text-slate-500">
                  {LABEL_RARIDADE[carta.raridade]} · {set?.nome}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">{carta.descricao}</p>

            <div className="bg-card-secondary border border-card-secondary-border rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Custo em fragmentos</span>
                <span className="font-semibold text-[#38bdf8]">{custo} de {carta.raridade}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Você tem</span>
                <span className="font-semibold text-gold-deep">{tem} fragmentos</span>
              </div>
              <div className="flex justify-between text-sm" style={{ borderTop: '1px solid rgba(226,232,240,1)', paddingTop: '0.5rem' }}>
                <span className="text-slate-500">Faltam</span>
                <span className={`font-semibold ${faltam === 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {faltam === 0 ? 'nada — pode montar agora' : `${faltam} fragmentos`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Valor da carta</span>
                <span className="font-semibold text-gold-deep">+{valor} créditos</span>
              </div>
            </div>

            {!setLiberado && set && (
              <p className="text-sm text-red-500 text-center mb-4">
                O set “{set.nome}” libera no nível {nomeNivelPorPontos(set.pontosMin)} ({set.pontosMin} créditos).
              </p>
            )}

            {faltam > 0 && (
              <p className="text-xs text-slate-500 mb-4 text-center leading-relaxed">
                Cada repetida rende <strong className="text-[#38bdf8]">{porRepetida} fragmentos</strong> de {carta.raridade}.
                {missaoDaCarta && <> Repita <strong className="text-slate-700">{missaoDaCarta.nome}</strong>.</>}
                {faltam > porRepetida && (
                  <> Cerca de <strong className="text-slate-700">{Math.ceil(faltam / porRepetida)} repetidas</strong>.</>
                )}
                {missoesRaridade.length > 0 && (
                  <> Ou qualquer missão de {carta.raridade}: {missoesRaridade.map(m => m.nome).join(' · ')}.</>
                )}
              </p>
            )}

            <button
              onClick={fabricar}
              disabled={!pode}
              className="w-full py-3 bg-brand text-(--t-onaccent) font-bold rounded-xl hover:bg-brand-hover transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {pode ? `Montar com ${custo} fragmentos` : setLiberado ? `Faltam ${faltam} fragmentos` : 'Set bloqueado'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
