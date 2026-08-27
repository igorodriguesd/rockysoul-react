import { useEffect } from 'react';

const features = [
  { icone: '/icons/folha.svg', titulo: 'Sustentabilidade', descricao: 'Pratique ações ecológicas no dia a dia e veja seu impacto crescer.' },
  { icone: '/icons/trofeu.svg', titulo: 'Gamificação', descricao: 'Ganhe pontos, suba de nível e desbloqueie selos e recompensas.' },
  { icone: '/icons/robo.svg', titulo: 'Avatar Inteligente', descricao: 'Um assistente virtual que te ajuda a manter o ritmo sustentável.' },
  { icone: '/icons/comunidade.svg', titulo: 'Comunidade', descricao: 'Compete no ranking e inspire outros usuários a agir pelo planeta.' },
];

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
      <div className="max-w-[1100px] mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 p-8 text-center mb-12"> 
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Sobre o RockySoulUp</h1>
          <p className="text-gray-600 leading-relaxed mb-3 max-w-2xl mx-auto">
            O RockySoulUp combina gamificação e inteligência artificial para transformar ações sustentáveis em uma experiência envolvente e recompensadora. A plataforma incentiva os usuários a adotarem hábitos ecológicos diários, registrando suas ações e convertendo-as em pontos, níveis e recompensas reais.
          </p>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Um avatar inteligente acompanha cada usuário, oferecendo dicas personalizadas, motivação e suporte. Através do chatbot integrado, os usuários podem registrar ações, consultar seu progresso e resgatar recompensas diretamente pela conversa.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-8 drop-shadow">Funcionalidades</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map(f => (
            <div key={f.titulo} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center border border-white/40">
              <div className="w-14 h-14 mx-auto mb-4 bg-[#22c55e]/10 rounded-xl flex items-center justify-center">
                <img src={f.icone} alt={f.titulo} className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{f.titulo}</h3>
              <p className="text-sm text-gray-500">{f.descricao}</p>
            </div>
          ))}
        </div>

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
