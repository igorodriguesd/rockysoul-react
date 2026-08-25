import { useEffect } from 'react';

const features = [
  { icone: '/icons/folha.svg', titulo: 'Sustentabilidade', descricao: 'Pratique acoes ecologicas no dia a dia e veja seu impacto crescer.' },
  { icone: '/icons/trofeu.svg', titulo: 'Gamificacao', descricao: 'Ganhe pontos, suba de nivel e desbloqueie selos e recompensas.' },
  { icone: '/icons/robo.svg', titulo: 'Avatar Inteligente', descricao: 'Um assistente virtual que te ajuda a manter o ritmo sustentavel.' },
  { icone: '/icons/comunidade.svg', titulo: 'Comunidade', descricao: 'Compete no ranking e inspire outros usuarios a agir pelo planeta.' },
];

const techs = [
  { nome: 'React', logo: '/icons/logo-js.png' },
  { nome: 'TypeScript', logo: '/icons/logo-js.png' },
  { nome: 'Vite', logo: '/icons/logo-js.png' },
  { nome: 'Tailwind CSS', logo: '/icons/logo-css3.svg' },
  { nome: 'HTML5', logo: '/icons/logo-html.png' },
  { nome: 'IBM Watson', logo: '/icons/logo-ibm.png' },
  { nome: 'Node-RED', logo: '/icons/logo-node_red.png' },
  { nome: 'Telegram Bot', logo: '/icons/logo-telegram.png' },
];

export default function Sobre() {
  useEffect(() => { document.title = 'Sobre - RockySoulUp'; }, []);

  return (
    <>
      <div className="max-w-[1100px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <img src="/imagens/logo-grande.png" alt="RockySoulUp" className="w-40 h-40 object-contain" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Sobre o RockySoulUp</h1>
            <p className="text-gray-600 leading-relaxed mb-3">
              O RockySoulUp combina gamificacao e inteligencia artificial para transformar acoes sustentaveis em uma experiencia envolvente e recompensadora. A plataforma incentiva os usuarios a adotarem habitos ecologicos diarios, registrando suas acoes e convertendo-as em pontos, niveis e recompensas reais.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Um avatar inteligente acompanha cada usuario, oferecendo dicas personalizadas, motivacao e suporte. Atraves do chatbot integrado, os usuarios podem registrar acoes, consultar seu progresso e resgatar recompensas diretamente pelo conversa.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Funcionalidades</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map(f => (
            <div key={f.titulo} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-[#f0faf0] rounded-xl flex items-center justify-center">
                <img src={f.icone} alt={f.titulo} className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{f.titulo}</h3>
              <p className="text-sm text-gray-500">{f.descricao}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Tecnologias Utilizadas</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {techs.map(t => (
            <div key={t.nome} className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100">
              <img src={t.logo} alt={t.nome} className="w-6 h-6 object-contain" />
              <span className="text-sm font-medium text-gray-700">{t.nome}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
