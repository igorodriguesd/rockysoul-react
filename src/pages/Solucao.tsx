import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MISSOES, RECOMPENSAS, SELOS } from '../data/constants';

const PASSOS = [
  { icon: '/icons/reciclagem.svg', titulo: 'Registre sua ação', texto: 'Escolha uma das ações sustentáveis no Dashboard e informe o que você realizou hoje.' },
  { icon: '/icons/camera.svg', titulo: 'Verificação por foto', texto: 'Envie uma foto como comprovante da ação. A localização GPS é opcional e reforça a validação.' },
  { icon: '/icons/trofeu.svg', titulo: 'Ganhe pontos e níveis', texto: 'Cada ação vale pontos. Acumule para evoluir de Semente até Expert e desbloquear selos.' },
  { icon: '/icons/carrinho.svg', titulo: 'Resgate recompensas', texto: `Troque seus pontos por recompensas reais em um catálogo com ${RECOMPENSAS.length} opções.` },
  { icon: '/icons/arvore.svg', titulo: 'Acompanhe o impacto', texto: 'Visualize o CO₂ evitado, as árvores equivalentes e sua posição no ranking da comunidade.' },
];

const DIFERENCIAIS = [
  'Verificação por foto com feedback imediato',
  'Assistente virtual integrado ao chat',
  'Persistência dos dados no navegador (localStorage)',
  'Níveis, selos e ranking gamificados',
  'Interface totalmente responsiva',
];

export default function Solucao() {
  useEffect(() => {
    document.title = 'Solução do Projeto - RockySoulUp';
  }, []);

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow">Solução do Projeto</h1>
        <p className="text-white/70">Como a RockySoulUp transforma hábitos sustentáveis em impacto real</p>
      </div>

      {/* O problema */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <img src="/icons/alvo.svg" alt="" className="w-5 h-5" />
          <h2 className="text-lg font-bold text-gray-800">O problema</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Muitas pessoas querem adotar hábitos mais sustentáveis, mas não enxergam o impacto concreto de suas
          pequenas ações. Falta estímulo, acompanhamento e reconhecimento. A RockySoulUp resolve isso ao
          transformar práticas sustentáveis do dia a dia em uma jornada gamificada: cada ação vira pontos,
          cada ponto vira nível, selo, recompensa e — principalmente — impacto mensurável no planeta.
        </p>
      </div>

      {/* Como funciona */}
      <h2 className="text-2xl font-bold text-white mb-4 drop-shadow">Como funciona</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {PASSOS.map((passo, i) => (
          <div key={passo.titulo} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <img src={passo.icon} alt="" className="w-8 h-8" />
              <span className="w-7 h-7 rounded-full bg-[#22c55e]/10 text-[#16a34a] flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
            </div>
            <h3 className="font-bold text-gray-800 text-sm">{passo.titulo}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{passo.texto}</p>
          </div>
        ))}
      </div>

      {/* Ações sustentáveis */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Ações sustentáveis</h2>
          <span className="text-xs text-gray-400">{MISSOES.length} ações disponíveis</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {MISSOES.map(missao => (
            <div key={missao.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white/60">
              <img src={missao.icone} alt="" className="w-6 h-6 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{missao.nome}</p>
                <p className="text-xs font-semibold text-[#22c55e]">+{missao.pontos} pts</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Níveis + Diferenciais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Níveis e selos</h2>
          <div className="flex items-center justify-between">
            {SELOS.map((selo, i) => (
              <div key={selo.id} className="flex flex-col items-center gap-1.5 flex-1">
                <img src={selo.icone} alt="" className="w-9 h-9" />
                <span className="text-[10px] text-gray-500 text-center leading-tight">{selo.nome}</span>
                <span className="text-[9px] text-[#22c55e] font-semibold">{selo.minPontos} pts</span>
                {i < SELOS.length - 1 && <div className="hidden" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Diferenciais</h2>
          <ul className="space-y-2.5">
            {DIFERENCIAIS.map(item => (
              <li key={item} className="flex items-start gap-2.5">
                <img src="/icons/check.svg" alt="" className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/dashboard"
          className="w-full sm:w-auto px-6 py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors text-center"
        >
          Começar no Dashboard
        </Link>
        <Link
          to="/recompensas"
          className="w-full sm:w-auto px-6 py-3 bg-white/80 text-gray-700 font-semibold rounded-xl hover:bg-white border border-white/40 transition-colors text-center"
        >
          Ver recompensas
        </Link>
      </div>
    </div>
  );
}