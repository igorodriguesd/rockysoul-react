import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useCounter } from '../hooks/useAnimations';
import LoginModal from '../components/LoginModal';

function ContadorPontos({ pontos }: { pontos: number }) {
  const { ref, valor } = useCounter(pontos);
  return <span ref={ref} className="font-bold text-[#22c55e]">+{valor} pts</span>;
}

export default function Home() {
  useEffect(() => { document.title = 'RockySoulUp - Home'; }, []);

  const { data } = useData();
  const navigate = useNavigate();
  const [loginAberto, setLoginAberto] = useState(false);

  function handleComecar() {
    if (data.nome) {
      navigate('/dashboard');
    } else {
      setLoginAberto(true);
    }
  }

  return (
    <><img 
          src="/imagens/passaroEsquerda.png" 
          alt="Pássaro decorativo esquerdo" 
          className="absolute left-20 top-30  w-28  h-auto object-contain pointer-events-none drop-shadow-xl z-20"
        />

        <img 
          src="/imagens/passaroDireita.png" 
          alt="Pássaro decorativo direito" 
          className="absolute right-30 w-28 top-180 h-auto object-contain pointer-events-none drop-shadow-xl z-20"
        />
      <section className="min-h-[80vh] flex flex-col items-center justify-center pt-12 pb-20 px-4 relative">
      
        <div className="bg-black/25 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 lg:py-26 lg:px-20 flex flex-col md:flex-row items-center justify-between w-full max-w-[1100px] shadow-2xl gap-10 relative z-10">

          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
              Transforme <br className="hidden lg:block"/>
              <span className="text-[#4ade80]">ações sustentáveis</span> <br className="hidden lg:block"/>
              em impacto real
            </h1>
            
            <p className="text-base md:text-lg text-white/80 mb-10 drop-shadow max-w-md">
              Ganhe pontos, suba de nível e ganhe recompensas por cada ação ecológica que você realiza.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={handleComecar}
                className="px-8 py-3 bg-[#22c55e] text-white font-bold rounded-xl hover:bg-[#16a34a] transition-all text-center shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] w-full sm:w-auto"
              >
                Começar Agora
              </button>
              <Link 
                to="/sobre" 
                className="px-8 py-3 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white transition-colors text-center w-full sm:w-auto"
              >
                Saiba Mais
              </Link>
            </div>

          </div>
          <div className="flex-1 flex justify-center items-center w-full mt-8 md:mt-0">
            <style>
              {`
                @keyframes float {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(-20px); }
                  100% { transform: translateY(0px); }
                }
                .floating-island {
                  animation: float 6s ease-in-out infinite;
                  filter: drop-shadow(0 30px 30px rgba(0,0,0,0.4));
                }
              `}
            </style>
           <img 
              src="/imagens/Ilha.png" 
              alt="Ilha Flutuante com Cachoeira" 
              className="floating-island w-full h-auto object-contain scale-160"
            />
          </div>

        </div>
      </section>

      <LoginModal aberto={loginAberto} onFechar={() => setLoginAberto(false)} />
    </>
  );
}