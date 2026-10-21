import { useEffect } from 'react';
import { RECOMPENSAS, SELOS, nomeNivelPorPontos } from '../data/constants';
import { CARTAS, SETS_CARTAS, CHANCE_DROP_POR_RARIDADE, LABEL_RARIDADE } from '../data/cartas';
import CardItem from '../components/CardItem';
import type { RaridadeCarta } from '../types';

const PASSOS = [
  { icon: '/icons/reciclagem.svg', titulo: 'Registre sua ação', texto: 'Escolha uma das ações sustentáveis no Dashboard e informe o que você realizou hoje.' },
  { icon: '/icons/camera.svg', titulo: 'Verificação por foto', texto: 'Envie uma foto do comprovante: item, nota fiscal ou recibo (mercado, casa de materiais, floricultura, ferro-velho, ecoponto). Em missões com GPS a localização é obrigatória; nas demais ela é opcional e reforça a validação.' },
  { icon: '/icons/trofeu.svg', titulo: 'Ganhe créditos e níveis', texto: 'Cada ação vale créditos. Acumule para evoluir de Broto até Floresta e desbloquear sets de cartas e selos.' },
  { icon: '/icons/carrinho.svg', titulo: 'Resgate recompensas', texto: `Troque seus créditos por recompensas reais em um catálogo com ${RECOMPENSAS.length} opções.` },
  { icon: '/icons/arvore.svg', titulo: 'Acompanhe o impacto', texto: 'Visualize o CO₂ evitado, as árvores equivalentes e sua posição no ranking da comunidade.' },
];

const DIFERENCIAIS = [
  'Verificação por foto com feedback imediato',
  'Assistente virtual integrado ao chat',
  'Persistência dos dados no navegador (localStorage)',
  'Níveis, selos e ranking gamificados',
  'Interface totalmente responsiva',
];

const ORDEM_RARIDADES: RaridadeCarta[] = ['comum', 'incomum', 'rara', 'epica', 'lendaria'];

const EXEMPLO_POR_RARIDADE: Record<RaridadeCarta, string> = {
  comum: 'card-agua',
  incomum: 'card-reutilizacao',
  rara: 'card-solar',
  epica: 'card-captacao',
  lendaria: 'card-agrofloresta',
};

export function Solucao() {
  useEffect(() => {
    document.title = 'Solução do Projeto - RockySoulUp';
  }, []);

  return (
    <div className="max-w-275 mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow">Solução do Projeto</h1>
        <p className="text-white/70">Como a RockySoulUp transforma hábitos sustentáveis em impacto real</p>
      </div>

      <div className="bg-card-primary border border-card-primary-border shadow-card-primary rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <img src="/icons/alvo.svg" alt="" className="w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900">O problema</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Muitas pessoas querem adotar hábitos mais sustentáveis, mas não enxergam o impacto concreto de suas
          pequenas ações. Falta estímulo, acompanhamento e reconhecimento. A RockySoulUp resolve isso ao
          transformar práticas sustentáveis do dia a dia em uma jornada gamificada: cada ação vira pontos,
          cada ponto vira nível, selo, recompensa e — principalmente — impacto mensurável no planeta.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-4 drop-shadow">Como funciona</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {PASSOS.map((passo, i) => (
          <div key={passo.titulo} className="bg-card-secondary border border-card-secondary-border rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <img src={passo.icon} alt="" className="w-8 h-8" />
              <span className="w-7 h-7 rounded-full bg-brand/15 text-brand flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">{passo.titulo}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{passo.texto}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-4 drop-shadow">Coleção de Cartinhas</h2>
      <p className="text-sm text-slate-600 leading-relaxed max-w-3xl mb-6">
        Realizar ações também pode premiar você com <strong className="text-slate-800">cartinhas colecionáveis</strong>.
        São <strong className="text-slate-800">20 cartinhas</strong> em <strong className="text-slate-800">5 sets temáticos</strong>,
        com 5 níveis de raridade — cada um com a própria chance de ser encontrado na premiação.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {ORDEM_RARIDADES.map(raridade => {
          const carta = CARTAS.find(c => c.id === EXEMPLO_POR_RARIDADE[raridade]);
          if (!carta) return null;
          return (
            <div key={raridade} className="flex flex-col items-center">
              <div className="w-28 sm:w-32">
                <CardItem carta={carta} bloqueada={false} ativa={true} foil={raridade === 'lendaria'} semHover />
              </div>
              <p className="mt-2 text-sm font-bold text-slate-900">{LABEL_RARIDADE[raridade]}</p>
              <p className="text-[11px] text-slate-500">{CHANCE_DROP_POR_RARIDADE[raridade]}% de chance</p>
            </div>
          );
        })}
      </div>

      <div className="bg-card-secondary border border-card-secondary-border rounded-2xl p-5 mb-10">
        <h3 className="font-bold text-slate-900 text-sm mb-3">Sets e Química</h3>
        <div className="flex flex-col gap-2 mb-3">
          {SETS_CARTAS.map(set => (
            <div key={set.id} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: 'var(--t-collection-bg)', border: '1px solid rgba(109,79,194,0.35)' }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: set.cor }} />
              <img src={set.icone} alt="" className="w-4 h-4" />
              <span className="text-sm text-slate-700 font-medium">{set.nome}</span>
              {set.pontosMin > 0 && (
                <span className="text-[10px] font-semibold text-gold shrink-0">desde {nomeNivelPorPontos(set.pontosMin)}</span>
              )}
              <span className="text-[10px] text-slate-500 ml-auto">{set.tema}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Junte as <strong className="text-slate-800">4 cartinhas de um set</strong> para ativar a <strong className="text-slate-800">Química Nível 3</strong> e ganhar{' '}
          <strong className="text-brand">+150 créditos</strong> de bônus.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-card-secondary border border-card-secondary-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Níveis e selos</h2>
          <div className="flex items-center justify-between">
            {SELOS.map((selo, i) => (
              <div key={selo.id} className="flex flex-col items-center gap-1.5 flex-1">
                <img src={selo.icone} alt="" className="w-9 h-9" />
                <span className="text-[10px] text-slate-500 text-center leading-tight">{selo.nome}</span>
                <span className="text-[9px] text-brand font-semibold">{selo.minPontos > 0 ? `${selo.minPontos} créditos` : 'desde o início'}</span>
                {i < SELOS.length - 1 && <div className="hidden" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card-secondary border border-card-secondary-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Diferenciais</h2>
          <ul className="space-y-2.5">
            {DIFERENCIAIS.map(item => (
              <li key={item} className="flex items-start gap-2.5">
                <img src="/icons/check.svg" alt="" className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}