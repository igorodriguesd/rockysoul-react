import { useEffect } from 'react';

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
        <div className="card-primary rounded-2xl p-8 text-center mb-12">
          <h1 className="text-2xl font-bold text-white mb-3">Sobre o RockySoulUp</h1>
          <p className="text-white/60 leading-relaxed mb-3 max-w-2xl mx-auto">
            O RockySoulUp é um projeto desenvolvido por estudantes da FIAP para o Challenge da turma 1TDSPK, com o propósito de unir tecnologia e sustentabilidade em uma única plataforma.
          </p>
          <p className="text-white/60 leading-relaxed max-w-2xl mx-auto">
            A aplicação é web, moderna, responsiva e fácil de usar — pronta para rodar em qualquer dispositivo e incentivar práticas sustentáveis no dia a dia. Para saber como funciona, veja a página Solução do Projeto.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-8 drop-shadow">Tecnologias Utilizadas</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {techs.map(t => (
            <div key={t.nome} className="card-tertiary flex items-center gap-2 px-4 py-3 rounded-xl">
              <img src={t.logo} alt={t.nome} className="w-6 h-6 object-contain" />
              <span className="text-sm font-medium text-white/75">{t.nome}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}