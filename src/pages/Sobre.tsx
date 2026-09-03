import { useEffect } from 'react';
import GlassCard from '../components/GlassCard';

const techs = [
  { nome: 'React', logo: '/icons/react.png' },
  { nome: 'TypeScript', logo: '/icons/typeScript.png' },
  { nome: 'Vite', logo: '/icons/vite.png' },
  { nome: 'Tailwind CSS', logo: '/icons/tailwindCSS.png' },
  { nome: 'HTML5', logo: '/icons/html.png' },
  { nome: 'IBM Watson', logo: '/icons/logo-ibm.png' },
  { nome: 'Node-RED', logo: '/icons/logo-node_red.png' },
  { nome: 'Telegram Bot', logo: '/icons/logo-telegram.png' },
];

export default function Sobre() {
  useEffect(() => { document.title = 'Sobre - RockySoulUp'; }, []);

  return (
    <>
      <div className="max-w-275 mx-auto px-6 py-12">
        <GlassCard className="p-8 text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Sobre o RockySoulUp</h1>
          <p className="text-gray-600 leading-relaxed mb-3 max-w-2xl mx-auto">
            O RockySoulUp é um projeto desenvolvido por estudantes da FIAP para o Challenge da turma 1TDSPK, com o propósito de unir tecnologia e sustentabilidade em uma única plataforma.
          </p>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            A aplicação é web, moderna, responsiva e fácil de usar — pronta para rodar em qualquer dispositivo e incentivar práticas sustentáveis no dia a dia. Para saber como funciona, veja a página Solução do Projeto.
          </p>
        </GlassCard>

        <h2 className="text-2xl font-bold text-center text-white mb-8 drop-shadow">Tecnologias Utilizadas</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {techs.map(t => (
            <div key={t.nome} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-sm border border-white/40">
              <img src={t.logo} alt={t.nome} className="w-6 h-6 object-contain" />
              <span className="text-sm font-medium text-gray-700">{t.nome}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}