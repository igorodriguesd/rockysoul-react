import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

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
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Contato</h1>
      <p className="text-center text-gray-500 mb-10">Entre em contato com a equipe RockySoulUp</p>

      <div className="bg-white rounded-2xl shadow-md p-8">
        {enviado ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#f0faf0] rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a9e1a" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
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
                {...register('nome', { required: 'Nome e obrigatorio' })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a9e1a] focus:ring-1 focus:ring-[#1a9e1a] transition-colors"
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
                  required: 'Email e obrigatorio',
                  pattern: { value: /^\S+@\S+$/i, message: 'Email invalido' }
                })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a9e1a] focus:ring-1 focus:ring-[#1a9e1a] transition-colors"
                placeholder="seu@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="contato-mensagem" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <textarea
                id="contato-mensagem"
                {...register('mensagem', { required: 'Mensagem e obrigatoria' })}
                rows={5}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a9e1a] focus:ring-1 focus:ring-[#1a9e1a] transition-colors resize-none"
                placeholder="Escreva sua mensagem aqui..."
              />
              {errors.mensagem && <p className="text-red-500 text-xs mt-1">{errors.mensagem.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#1a9e1a] to-[#0f6e2e] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Enviar Mensagem
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
