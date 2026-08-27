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
    <>
      <section className="min-h-[70vh] flex flex-col items-center justify-center -mt-16 pt-10 pb-20">
        <div className="text-center px-6 max-w-2xl flex flex-col items-center">
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
            Transforme <span className="text-[#4ade80]">ações sustentáveis</span> em impacto real
          </h1>
          
          <p className="text-base md:text-lg text-white/80 mb-8 drop-shadow">
            Ganhe pontos, suba de nível e ganhe recompensas por cada ação ecológica que você realiza.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12 w-full max-w-md">
            <button
              onClick={handleComecar}
              className="px-6 py-2.5 bg-[#22c55e] text-white font-bold rounded-xl hover:bg-[#16a34a] transition-colors text-center shadow-lg w-full sm:w-auto"
            >
              Começar Agora
            </button>
            <Link 
              to="/sobre" 
              className="px-6 py-2.5 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-center backdrop-blur-sm w-full sm:w-auto"
            >
              Saiba Mais
            </Link>
          </div>

          <div className="w-full max-w-lg mt-4 flex justify-center">
            <style>
              {`
                @keyframes float {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(-15px); }
                  100% { transform: translateY(0px); }
                }
                .floating-island {
                  animation: float 6s ease-in-out infinite;
                  filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.3));
                }
              `}
            </style>
            <img 
              src="public\imagens\Ilha.png" 
              alt="Ilha Flutuante com Cachoeira" 
              className="floating-island max-w-full h-auto object-contain"
            />
          </div>

        </div>
      </section>

      <LoginModal aberto={loginAberto} onFechar={() => setLoginAberto(false)} />
    </>
  );
}