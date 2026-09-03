import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import GlassCard from '../components/GlassCard';
import { VALIDATION_RULES, normalizeName, normalizeEmail, normalizeMessage } from '../utils/validation';

interface ContatoForm {
  nome: string;
  email: string;
  mensagem: string;
}

export default function Contato() {
  useEffect(() => { document.title = 'Contato - RockySoulUp'; }, []);

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<ContatoForm>({
    mode: 'onChange',
    defaultValues: { nome: '', email: '', mensagem: '' }
  });
  const [enviado, setEnviado] = useState(false);

  const onSubmit = (data: ContatoForm) => {
    // Normalizar dados antes de processar
    const dadosNormalizados = {
      nome: normalizeName(data.nome),
      email: normalizeEmail(data.email),
      mensagem: normalizeMessage(data.mensagem),
    };

    // Aqui você poderia enviar os dados para um servidor
    console.log('Mensagem enviada:', dadosNormalizados);

    setEnviado(true);
    reset();
    setTimeout(() => setEnviado(false), 4000);
  };

  return (
    <div className="max-w-150 mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center text-white mb-2 drop-shadow">Contato</h1>
      <p className="text-center text-white/70 mb-10">Entre em contato com a equipe RockySoulUp</p>

      <GlassCard className="p-8">
        {enviado ? (
          <div className="text-center py-8">
            <img src="/icons/sucesso.svg" alt="Enviado" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-1">Mensagem enviada!</h3>
            <p className="text-gray-500">Obrigado pelo contato. Responderemos em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label htmlFor="contato-nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                id="contato-nome"
                type="text"
                {...register('nome', VALIDATION_RULES.nome)}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 ${errors.nome ? 'border-red-400' : 'border-gray-200'
                  }`}
                placeholder="Seu nome completo (mínimo 3 caracteres)"
              />
              {errors.nome && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contato-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="contato-email"
                type="email"
                {...register('email', VALIDATION_RULES.email)}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 ${errors.email ? 'border-red-400' : 'border-gray-200'
                  }`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contato-mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem * <span className="text-xs text-gray-500">(10-1000 caracteres)</span>
              </label>
              <textarea
                id="contato-mensagem"
                {...register('mensagem', VALIDATION_RULES.mensagem)}
                rows={5}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors resize-none bg-white/60 ${errors.mensagem ? 'border-red-400' : 'border-gray-200'
                  }`}
                placeholder="Escreva sua mensagem aqui..."
              />
              {errors.mensagem && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.mensagem.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full py-3 font-semibold rounded-xl transition-colors ${isValid
                  ? 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Enviar Mensagem
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
}
