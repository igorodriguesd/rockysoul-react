import { useState } from 'react';
import { useData } from '../context/DataContext';
import { showToast } from './Toast';
import type { Recompensa } from '../types';

interface Props {
  aberto: boolean;
  onFechar: () => void;
  recompensa: Recompensa;
}

export default function ResgatarModal({ aberto, onFechar, recompensa }: Props) {
  const { data, subtrairPontos, addResgate } = useData();
  const [sucesso, setSucesso] = useState(false);
  const [pontosRestantes, setPontosRestantes] = useState(0);

  if (!aberto) return null;

  const podeResgatar = data.pontos >= recompensa.pontos;

  function confirmarResgate() {
    if (!podeResgatar) return;
    subtrairPontos(recompensa.pontos);
    const novoSaldo = data.pontos - recompensa.pontos;
    setPontosRestantes(novoSaldo);
    addResgate({
      nome: recompensa.nome,
      pontos: recompensa.pontos,
      data: new Date().toLocaleString('pt-BR'),
    });
    setSucesso(true);
    showToast(`Resgate: ${recompensa.nome}`);
  }

  function fechar() {
    setSucesso(false);
    onFechar();
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={fechar}>
      <div
        className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-[90vw] max-w-[400px] p-6 relative border border-white/40"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={fechar} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        {sucesso ? (
          <div className="text-center py-4">
            <img src="/icons/sucesso.svg" alt="Sucesso" className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-1">Resgate Confirmado</h2>
            <p className="text-sm text-gray-500 mb-1">
              <strong>{recompensa.nome}</strong> resgatada com sucesso.
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Saldo restante: <strong className="text-[#22c55e]">{pontosRestantes} pontos</strong>
            </p>
            <button onClick={fechar} className="w-full py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors">
              Concluir
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <img src={recompensa.icone} alt="" className="w-10 h-10" />
              <div>
                <h2 className="text-lg font-bold text-gray-800">{recompensa.nome}</h2>
                <p className="text-xs text-gray-500">{recompensa.descricao}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Custo</span>
                <span className="font-semibold text-gray-800">{recompensa.pontos} pontos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Seu saldo</span>
                <span className="font-semibold text-gray-800">{data.pontos} pontos</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
                <span className="text-gray-500">Saldo após resgate</span>
                <span className={`font-semibold ${podeResgatar ? 'text-[#22c55e]' : 'text-red-500'}`}>
                  {data.pontos - recompensa.pontos} pontos
                </span>
              </div>
            </div>

            {!podeResgatar && (
              <p className="text-sm text-red-500 text-center mb-4">
                Você precisa de mais {recompensa.pontos - data.pontos} pontos para resgatar esta recompensa.
              </p>
            )}

            <button
              onClick={confirmarResgate}
              disabled={!podeResgatar}
              className="w-full py-3 bg-[#22c55e] text-white font-bold rounded-xl hover:bg-[#16a34a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {podeResgatar ? 'Confirmar Resgate' : 'Pontos Insuficientes'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
