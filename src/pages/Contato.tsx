import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import GlassCard from '../components/GlassCard';

interface ContatoForm {
  nome: string;
  email: string;
  mensagem: string;
}

export default function Contato() {
  useEffect(() => { document.title = 'Contato - RockySoulUp'; }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContatoForm>();
  const [enviado, setEnviado] = useState(false);

  const onSubmit = () => {
    setEnviado(true);
    reset();
    setTimeout(() => setEnviado(false), 4000);
  };

  return (
    <div className="max-w-[600px] mx-auto px-6 py-12">
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
              <label htmlFor="contato-nome" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                id="contato-nome"
                type="text"
                {...register('nome', { required: 'Nome é obrigatório' })}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 ${errors.nome ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="Seu nome completo"
              />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
            </div>

            <div>
              <label htmlFor="contato-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="contato-email"
                type="email"
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' }
                })}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors bg-white/60 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="seu@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="contato-mensagem" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <textarea
                id="contato-mensagem"
                {...register('mensagem', { required: 'Mensagem é obrigatória' })}
                rows={5}
                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors resize-none bg-white/60 ${errors.mensagem ? 'border-red-400' : 'border-gray-200'}`}
                placeholder="Escreva sua mensagem aqui..."
              />
              {errors.mensagem && <p className="text-red-500 text-xs mt-1">{errors.mensagem.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors"
            >
              Enviar Mensagem
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
}
