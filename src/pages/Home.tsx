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
      <section className="min-h-[70vh] flex items-center justify-center -mt-24">
        <div className="text-center px-6 max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
            Transforme <span className="text-[#4ade80]">ações sustentáveis</span> em impacto real
          </h1>
          <p className="text-lg text-white/80 mb-8 drop-shadow">
            Ganhe pontos, suba de nível e ganhe recompensas por cada ação ecológica que você realiza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleComecar}
              className="px-8 py-3.5 bg-[#22c55e] text-white font-bold rounded-xl hover:bg-[#16a34a] transition-colors text-center shadow-lg"
            >
              Começar Agora
            </button>
            <Link to="/sobre" className="px-8 py-3.5 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-center backdrop-blur-sm">
              Saiba Mais
            </Link>
          </div>
        </div>
      </section>

      <LoginModal aberto={loginAberto} onFechar={() => setLoginAberto(false)} />
    </>
  );
}
