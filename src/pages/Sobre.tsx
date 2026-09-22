import { useEffect } from 'react';
import { PARCEIROS } from '../data/constants';

const techs = [
  { nome: 'React', logo: '/icons/react.svg' },
  { nome: 'TypeScript', logo: '/icons/typescript.svg' },
  { nome: 'Vite', logo: '/icons/vite.svg' },
  { nome: 'Tailwind CSS', logo: '/icons/tailwindcss.svg' },
  { nome: 'HTML5', logo: '/icons/html5.svg' },
  { nome: 'IBM Watson', logo: '/icons/ibm-watson.svg' },
  { nome: 'Node-RED', logo: '/icons/node-red.svg' },
  { nome: 'Telegram Bot', logo: '/icons/telegram.svg' },
];

export function Sobre() {
  useEffect(() => { document.title = 'Sobre - RockySoulUp'; }, []);

  return (
    <>
      <div className="max-w-275 mx-auto px-6 py-12">
        <div className="bg-card-primary border border-card-primary-border shadow-card-primary rounded-2xl p-8 text-center mb-12">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Sobre o RockySoulUp</h1>
          <p className="text-slate-600 leading-relaxed mb-3 max-w-2xl mx-auto">
            O RockySoulUp é um projeto desenvolvido por estudantes da FIAP para o Challenge da turma 1TDSPK, com o propósito de unir tecnologia e sustentabilidade em uma única plataforma.
          </p>
          <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A aplicação é web, moderna, responsiva e fácil de usar — pronta para rodar em qualquer dispositivo e incentivar práticas sustentáveis no dia a dia. Para saber como funciona, veja a página Solução do Projeto.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 mb-6 drop-shadow">Impacto e Transparência</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
          {[
            { icon: '/icons/reciclagem.svg', valor: '1,2t', label: 'resíduos longe do aterro' },
            { icon: '/icons/check.svg', valor: '12k+', label: 'ações verificadas' },
            { icon: '/icons/localizacao.svg', valor: `${PARCEIROS.length}`, label: 'parceiros credenciados' },
          ].map(m => (
            <div key={m.label} className="bg-card-tertiary border border-card-secondary-border rounded-2xl p-5 text-center">
              <img src={m.icon} alt="" className="w-7 h-7 mx-auto mb-2" />
              <p className="text-brand font-bold font-serif-display" style={{ fontSize: 26 }}>{m.valor}</p>
              <p className="text-slate-500 text-xs mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card-tertiary border border-card-secondary-border rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto mb-12">
          <h3 className="text-slate-900 text-lg font-bold mb-2">Como nos financiamos</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            A economia de créditos da plataforma é financiada por ecopontos credenciados, patrocinadores do
            Desafio do Dia, cortesias de parceiros na loja de recompensas e, no futuro, editais e projetos com
            ONGs e prefeituras. As conversões em Pix são liquidadas por essa verba de parcerias — quanto maior
            o impacto dos usuários, mais atrativa a plataforma se torna para novos parceiros.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 mb-8 drop-shadow">Tecnologias Utilizadas</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {techs.map(t => (
            <div key={t.nome} className="bg-card-tertiary border border-card-secondary-border flex items-center gap-2 px-4 py-3 rounded-xl">
              <img src={t.logo} alt={t.nome} className="w-6 h-6 object-contain" />
              <span className="text-sm font-medium text-slate-700">{t.nome}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}