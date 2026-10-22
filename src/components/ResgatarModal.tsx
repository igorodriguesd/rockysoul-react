import type { Recompensa } from '../types';
export default function ResgatarModal({ aberto, onFechar }: { aberto: boolean; onFechar: () => void; recompensa: Recompensa }) {
  if (!aberto) return null;
  return <div className="fixed inset-0 z-[9998] flex items-start sm:items-center justify-center p-3 sm:p-6 pt-24 sm:pt-6 bg-black/60"><section role="dialog" aria-modal="true" aria-label="Resgate indisponível" className="glass-strong rounded-2xl shadow-2xl w-[90vw] max-w-md p-6 relative max-h-[90vh] overflow-y-auto space-y-4"><h2 className="text-xl font-bold">Resgate ainda indisponível</h2><p>A API não possui uma operação de resgate. Nenhum saldo foi alterado.</p><button className="w-full py-3 bg-[#20d968] text-[#070d19] font-bold rounded-xl hover:brightness-110 transition-all cursor-pointer" onClick={onFechar}>Entendi</button></section></div>;
}
