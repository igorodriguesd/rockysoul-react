import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MISSOES } from '../data/constants';
import { useCounter } from '../hooks/useAnimations';
import { useScrollReveal } from '../hooks/useAnimations';

function ContadorPontos({ pontos }: { pontos: number }) {
  const { ref, valor } = useCounter(pontos);
  return <span ref={ref} className="font-bold text-[#1a9e1a]">+{valor} pts</span>;
}

function CardComoFunciona({ icone, titulo, descricao }: { icone: string; titulo: string; descricao: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className="scroll-reveal bg-white rounded-2xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-center">
      <div className="w-14 h-14 mx-auto mb-4 bg-[#f0faf0] rounded-xl flex items-center justify-center">
        <img src={icone} alt={titulo} className="w-8 h-8" />
      </div>
      <h3 className="font-bold text-gray-800 mb-2">{titulo}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{descricao}</p>
    </div>
  );
}

export default function Home() {
  useEffect(() => { document.title = 'RockySoulUp - Home'; }, []);

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a3d0a] via-[#1a5c1a] to-[#0f4f0f]">
          <img src="/imagens/floresta.jpg" alt="" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        <div className="flex flex-col relative z-10 text-center px-6 max-w-2xl items-center justify-center">
          <video autoPlay muted loop className=" mb-7 w-[300px] h-[300px] object-cover">
          <source src="/videos/eco-animacao.webm" type="video/webm" />
        </video>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            Transforme <span className="text-[#6ee76e]">ações sustentaveis</span> em impacto real
          </h1>
          <p className="text-lg text-white/80 mb-8">
            Ganhe pontos, suba de nivel e ganhe recompensas por cada acao ecologica que voce realiza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="px-8 py-3.5 bg-gradient-to-r from-[#1a9e1a] to-[#0f6e2e] text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-center">
              Comecar Agora
            </Link>
            <Link to="/sobre" className="px-8 py-3.5 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-center">
              Saiba Mais
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">Como Funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardComoFunciona icone="/icons/reciclagem.svg" titulo="Pratique" descricao="Realize acoes sustentaveis no seu dia a dia: recicle, use transporte publico, economize agua e energia." />
          <CardComoFunciona icone="/icons/trofeu.svg" titulo="Ganhe Pontos" descricao="Registre suas acoes na plataforma e ganhe pontos que valem recompensas reais." />
          <CardComoFunciona icone="/icons/alvo.svg" titulo="Alcance Metas" descricao="Suba de nivel, desbloqueie selos e compete no ranking com outros usuarios sustentaveis." />
        </div>
      </section>

      <section className="bg-[#f0faf0] py-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">Acoes Sustentaveis</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {MISSOES.map(m => (
              <div key={m.id} className="scroll-reveal bg-white rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-center">
                <img src={m.icone} alt={m.nome} className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-semibold text-sm text-gray-800 mb-1">{m.nome}</h3>
                <ContadorPontos pontos={m.pontos} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Pronto para comecar?</h2>
          <p className="text-gray-500 mb-8">Junte-se a centenas de usuarios que ja estao transformando o mundo, uma acao de cada vez.</p>
          <Link to="/dashboard" className="inline-block px-10 py-4 bg-gradient-to-r from-[#1a9e1a] to-[#0f6e2e] text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-lg">
            Acessar Dashboard
          </Link>
        </div>
      </section>
    </>
  );
}
