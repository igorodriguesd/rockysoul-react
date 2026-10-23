import { useData } from '../context/DataContext';

const ESTAGIOS: Record<string, { cor: string; brilho: string; filtro: string }> = {
  Semente: { cor: '#64748b', brilho: 'rgba(148,163,184,0.35)', filtro: 'grayscale(0.85) saturate(0.4) brightness(0.78) contrast(0.95)' },
  Broto: { cor: '#22c55e', brilho: 'rgba(34,197,94,0.45)', filtro: 'grayscale(0.45) saturate(0.7) brightness(0.92)' },
  Árvore: { cor: '#38bdf8', brilho: 'rgba(56,189,248,0.5)', filtro: 'grayscale(0.1) saturate(1.15) brightness(1.02)' },
  Floresta: { cor: '#facc15', brilho: 'rgba(250,204,21,0.6)', filtro: 'saturate(1.4) brightness(1.08)' },
};

function nomeNivel(pontos: number): string {
  if (pontos >= 2000) return 'Floresta';
  if (pontos >= 1200) return 'Árvore';
  if (pontos >= 500) return 'Semente';
  return 'Broto';
}

export default function IlhaRockySoul() {
  const { data } = useData();
  const pontos = data.pontosAcumulados ?? data.pontos ?? 0;
  const atual = nomeNivel(pontos);
  const estagio = ESTAGIOS[atual] ?? ESTAGIOS.Broto;

  return (
    <div className="relative h-full flex flex-col items-center justify-center py-2">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 w-[340px] h-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
        style={{ background: estagio.brilho, transition: 'background 1.2s ease' }}
      />

      <div className="relative w-full flex-1 min-h-0 flex items-center justify-center">
        <div
          className="relative animate-float drop-shadow-[0_30px_30px_var(--t-island-shadow)] w-full h-full max-h-[640px]"
        >
          <img
            src="/imagens/Ilha.png"
            alt="Ilha RockySoul"
            className="absolute inset-0 w-full h-full object-contain scale-[2]"
            style={{ transition: 'opacity 1.2s ease' }}
          />
        </div>
      </div>
    </div>
  );
}