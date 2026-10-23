export default function Footer() {
  return (
    <footer className="relative z-10 py-6 mt-auto">
      <div className="max-w-275 mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img src="/imagens/logo.png" alt="Logo" className="h-5 w-auto opacity-90" />
          <span className="font-bold text-base text-slate-800">RockySoulUp</span>
        </div>
        <p className="text-sm text-slate-600">Transformando ações em impacto</p>
        <p className="text-xs text-slate-500">&copy; 2026 RockySoulUp</p>
      </div>
    </footer>
  );
}