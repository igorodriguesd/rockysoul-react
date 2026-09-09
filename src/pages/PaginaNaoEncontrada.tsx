import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function PaginaNaoEncontrada() {
  useEffect(() => { document.title = 'Página não encontrada - RockySoulUp'; }, []);

  return (
    <div className="max-w-175 mx-auto px-6 py-20 text-center">
      <p className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 font-black text-7xl sm:text-8xl leading-none drop-shadow">
        404
      </p>
      <h1 className="text-3xl font-bold text-white mt-4 drop-shadow">Essa página saiu da trilha.</h1>
      <p className="text-white/70 mt-3 max-w-lg mx-auto">
        O caminho acessado não corresponde a nenhuma página do RockySoulUp. Que tal voltar pra trilha da sustentabilidade?
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-3 font-bold text-slate-950 hover:brightness-110 transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Voltar ao início
      </Link>
    </div>
  );
}