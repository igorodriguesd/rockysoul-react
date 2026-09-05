import { useEffect, useState } from 'react';
import { validateName, validateEmail, validateMessage, normalizeName, normalizeEmail, normalizeMessage } from '../utils/validation';

export function Contato() {
  useEffect(() => { document.title = 'Contato - RockySoulUp'; }, []);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erros, setErros] = useState<{ nome?: string; email?: string; mensagem?: string }>({});
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nomeErro = validateName(nome);
    const emailErro = validateEmail(email);
    const mensagemErro = validateMessage(mensagem);

    if (nomeErro || emailErro || mensagemErro) {
      setErros({ nome: nomeErro ?? undefined, email: emailErro ?? undefined, mensagem: mensagemErro ?? undefined });
      return;
    }

    const dadosNormalizados = {
      nome: normalizeName(nome),
      email: normalizeEmail(email),
      mensagem: normalizeMessage(mensagem),
    };

    console.log('Mensagem enviada:', dadosNormalizados);

    setEnviado(true);
    setNome('');
    setEmail('');
    setMensagem('');
    setErros({});
    setTimeout(() => setEnviado(false), 4000);
  };

  return (
    <div className="max-w-150 mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center text-white mb-2 drop-shadow">Contato</h1>
      <p className="text-center text-white/70 mb-10">Entre em contato com a equipe RockySoulUp</p>

      <div className="card-primary rounded-2xl p-8">
        {enviado ? (
          <div className="text-center py-8">
            <img src="/icons/sucesso.svg" alt="Enviado" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-1">Mensagem enviada!</h3>
            <p className="text-white/50">Obrigado pelo contato. Responderemos em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="contato-nome" className="block text-sm font-medium text-white/75 mb-1">
                Nome *
              </label>
              <input
                id="contato-nome"
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors ${erros.nome ? 'border-red-400' : 'border-white/15'
                  }`}
                style={{ background: 'rgba(255,255,255,0.05)' }}
                placeholder="Seu nome completo (mínimo 3 caracteres)"
              />
              {erros.nome && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 2 21h20L12 3Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>
                  {erros.nome}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contato-email" className="block text-sm font-medium text-white/75 mb-1">
                Email *
              </label>
              <input
                id="contato-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors ${erros.email ? 'border-red-400' : 'border-white/15'
                  }`}
                style={{ background: 'rgba(255,255,255,0.05)' }}
                placeholder="seu@email.com"
              />
              {erros.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 2 21h20L12 3Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>
                  {erros.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contato-mensagem" className="block text-sm font-medium text-white/75 mb-1">
                Mensagem * <span className="text-xs text-white/45">(10-1000 caracteres)</span>
              </label>
              <textarea
                id="contato-mensagem"
                value={mensagem}
                onChange={e => setMensagem(e.target.value)}
                rows={5}
                className={`w-full border rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors resize-none ${erros.mensagem ? 'border-red-400' : 'border-white/15'
                  }`}
                style={{ background: 'rgba(255,255,255,0.05)' }}
                placeholder="Escreva sua mensagem aqui..."
              />
              {erros.mensagem && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 2 21h20L12 3Z" /><path d="M12 10v4" /><path d="M12 17h.01" /></svg>
                  {erros.mensagem}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 font-semibold rounded-xl bg-[#22c55e] text-white hover:bg-[#16a34a] cursor-pointer transition-colors"
            >
              Enviar Mensagem
            </button>
          </form>
        )}
      </div>
    </div>
  );
}