import { ApiGate } from '../components/ApiUi';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLoginGate } from '../hooks/useLoginGate';
import { useApi } from '../context/ApiContext';
import type { RecompensaApi } from '../api/types';
import type { Recompensa } from '../types';
import { rewardView } from '../api/viewModels';
import { errorMessage } from '../api/client';
import ResgatarModal from '../components/ResgatarModal';

export function RecompensaDetalhe() { return <ApiGate acesso="aos detalhes desta recompensa"><RecompensaDetalheContent /></ApiGate>; }
function RecompensaDetalheContent() {
  const { id } = useParams<{ id: string }>();
  const { data } = useData();
  const exigirLogin = useLoginGate();
  const [resgatarAberto, setResgatarAberto] = useState(false);

  const { api, revision, user } = useApi();
  const [record, setRecord] = useState<RecompensaApi | null>(null); const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController(); setRecord(null); setError('');
    if (!user?.id) return;
    if (!id || !/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) { setError('Recompensa inválida.'); return; }
    api.request<RecompensaApi>(`/recompensa/${id}`, { signal: controller.signal }).then(setRecord).catch(failure => { if (!controller.signal.aborted) setError(errorMessage(failure)); });
    return () => controller.abort();
  }, [api, revision, id, user?.id]);
  const recompensa: Recompensa | null = record ? rewardView(record) : null;
  const podeResgatar = false;

  const titulo = record?.titulo;
  useEffect(() => {
    document.title = titulo ? `${titulo} - RockySoulUp` : 'Recompensas - RockySoulUp';
  }, [titulo]);

  if (!recompensa) {
    return (
      <div className="max-w-150 mx-auto px-6 py-20 text-center">
        <div className="bg-card-secondary border border-card-secondary-border rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{error ? 'Não foi possível carregar' : user ? 'Carregando recompensa…' : 'Entre para consultar recompensas'}</h1>
          <p className="text-sm text-slate-500 mb-6">{error || (user ? 'Aguarde a consulta ao catálogo.' : 'Use Entrar no cabeçalho.')}</p>
          <Link
            to="/recompensas"
            className="inline-block px-5 py-2.5 bg-brand text-(--t-onaccent) text-sm font-semibold rounded-xl hover:bg-brand-hover transition-colors"
          >
            Voltar para Recompensas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-175 mx-auto px-6 py-12">
      <Link
        to="/recompensas"
        className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors"
      >
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Voltar para Recompensas
      </Link>

      <div className="bg-card-primary border border-card-primary-border shadow-card-primary rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:items-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-brand/15 flex items-center justify-center shrink-0">
            <img src={recompensa.icone} alt="" className="w-9 h-9" />
          </div>
          <div className="min-w-0">
            {recompensa.badge && (
              <span className="inline-block px-2 py-0.5 bg-gold/20 text-gold-deep text-[10px] font-semibold rounded-full mb-1.5">
                {recompensa.badge}
              </span>
            )}
            <h1 className="text-2xl font-bold text-slate-900 leading-tight">{recompensa.nome}</h1>
            <span className="text-xs text-slate-500 bg-brand-soft px-2 py-0.5 rounded-full mt-1.5 inline-block">
              {recompensa.categoria}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">{recompensa.descricao}</p>

        <div className="flex items-center justify-between rounded-xl bg-brand/10 border border-brand/20 px-4 py-3 mb-6">
          <div>
            <p className="text-[10px] text-slate-500">Seu saldo</p>
            <p className="text-base font-bold text-slate-900">{data.pontos} créditos</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500">Custo</p>
            <p className="text-base font-bold text-gold-deep">{recompensa.pontos} créditos</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (!exigirLogin()) return;
            setResgatarAberto(true);
          }}
          disabled={!podeResgatar}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${podeResgatar
              ? 'bg-brand text-(--t-onaccent) hover:bg-brand-hover cursor-pointer'
              : 'bg-brand-soft text-slate-400 cursor-not-allowed'
            }`}
        >
          {podeResgatar ? 'Resgatar recompensa' : 'Resgate indisponível na API'}
        </button>
      </div>

      {resgatarAberto && (
        <ResgatarModal
          aberto={true}
          onFechar={() => setResgatarAberto(false)}
          recompensa={recompensa}
        />
      )}
    </div>
  );
}
