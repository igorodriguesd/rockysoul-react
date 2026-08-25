export default function Footer() {
  return (
    <footer className="bg-[#f0faf0] border-t border-[#cce6cc] py-6 mt-auto">
      <div className="max-w-[1100px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img src="/imagens/logo.png" alt="Logo" className="w-6 h-6" />
          <span className="font-bold text-[#1a9e1a]">Rocky SoulUp</span>
        </div>
        <p className="text-sm text-[#5a7a5a]">Transformando acoes em impacto</p>
        <p className="text-xs text-gray-400">&copy; 2026 RockySoulUp</p>
      </div>
    </footer>
  );
}
