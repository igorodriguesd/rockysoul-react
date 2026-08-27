export default function Footer() {
  return (
    <footer className="relative z-10 py-6 mt-auto">
      <div className="max-w-[1100px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img src="/imagens/logo.png" alt="Logo" className="w-5 h-5" />
          <span className="font-bold text-white/90 text-sm">Rocky SoulUp</span>
        </div>
        <p className="text-sm text-white/60">Transformando ações em impacto</p>
        <p className="text-xs text-white/40">&copy; 2026 RockySoulUp</p>
      </div>
    </footer>
  );
}
