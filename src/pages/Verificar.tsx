import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../context/DataContext';
import { showToast } from '../components/Toast';

interface VerifyForm {
  location?: string;
}

interface AcaoSelecionada {
  id: string;
  nome: string;
  pontos: number;
  icone: string;
}

const acoesVerificacao = [
  { id: 'reciclagem', nome: 'Reciclagem', pontos: 30, icone: '/icons/reciclagem.svg', dica: 'Nota fiscal de ferro velho, foto de materiais reciclados' },
  { id: 'transporte', nome: 'Transporte Sustentavel', pontos: 50, icone: '/icons/transporte.svg', dica: 'Bilhete de transporte publico ou foto dentro do onibus/metro' },
  { id: 'energia', nome: 'Economia de Energia', pontos: 20, icone: '/icons/energia.svg', dica: 'Foto de aparelhos desligados da tomada' },
  { id: 'agua', nome: 'Economia de Agua', pontos: 20, icone: '/icons/agua.svg', dica: 'Foto de torneira fechada ou medidor de agua' },
  { id: 'bicicleta', nome: 'Bicicleta', pontos: 40, icone: '/icons/bicicleta.svg', dica: 'Foto da bicicleta ou trajeto percorrido' },
  { id: 'plantio', nome: 'Plantio', pontos: 100, icone: '/icons/arvore.svg', dica: 'Foto da muda plantada ou area verde' },
];

export default function Verificar() {
  useEffect(() => { document.title = 'Verificar - RockySoulUp'; }, []);

  const { adicionarPontos } = useData();
  const { register, handleSubmit, reset } = useForm<VerifyForm>();

  const [acao, setAcao] = useState<AcaoSelecionada | null>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const [localizacao, setLocalizacao] = useState<string>('');
  const [sucesso, setSucesso] = useState(false);
  const [pontosGanhos, setPontosGanhos] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const obterGPS = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalizacao(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
      },
      () => setLocalizacao('Permissao negada')
    );
  };

  const onSubmit = () => {
    if (!acao) return;
    adicionarPontos(acao.pontos, acao.nome);
    setPontosGanhos(acao.pontos);
    setSucesso(true);
    showToast(`+${acao.pontos} pontos - ${acao.nome}`);
  };

  const resetar = () => {
    setAcao(null);
    setFoto(null);
    setLocalizacao('');
    setSucesso(false);
    setPontosGanhos(0);
    reset();
  };

  if (sucesso) {
    return (
      <div className="max-w-[700px] mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-md p-10">
          <img src="/icons/sucesso.svg" alt="Sucesso" className="w-20 h-20 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acao Verificada!</h2>
          <p className="text-gray-500 mb-4">
            Sua acao de <strong>{acao?.nome}</strong> foi registrada com sucesso.
          </p>
          <p className="text-3xl font-bold text-[#1a9e1a] mb-6">+{pontosGanhos} pontos</p>
          <button onClick={resetar} className="px-6 py-3 bg-gradient-to-r from-[#1a9e1a] to-[#0f6e2e] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity">
            Verificar Outra Acao
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-[#0a3d0a] via-[#1a5c1a] to-[#0f4f0f] py-12">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-sm font-medium rounded-full mb-4">
            Verificacao por IA
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Verificar Atividade</h1>
          <p className="text-white/70 max-w-lg mx-auto">
            Envie uma foto como comprovante da sua acao sustentavel e ganhe pontos
          </p>
        </div>
      </section>

      <div className="max-w-[700px] mx-auto px-6 py-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-bold text-gray-800 mb-1">1. Selecione a Acao</h2>
            <p className="text-sm text-gray-500 mb-4">Escolha qual acao sustentavel voce realizou</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {acoesVerificacao.map(a => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAcao(a)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                    acao?.id === a.id
                      ? 'border-[#1a9e1a] bg-[#f0faf0]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={a.icone} alt={a.nome} className="w-8 h-8" />
                  <span className="text-sm font-medium text-gray-700">{a.nome}</span>
                  <span className="text-xs text-[#1a9e1a] font-semibold">+{a.pontos} pts</span>
                </button>
              ))}
            </div>
            {acao && (
              <p className="mt-3 text-xs text-gray-400 italic">Dica: {acoesVerificacao.find(a => a.id === acao.id)?.dica}</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-bold text-gray-800 mb-1">2. Envie uma Foto</h2>
            <p className="text-sm text-gray-500 mb-4">Tire ou envie uma foto como comprovante</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} className="hidden" />
            {foto ? (
              <div className="relative">
                <img src={foto} alt="Preview" className="w-full max-h-[300px] object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => { setFoto(null); fileRef.current!.value = ''; }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl py-12 text-gray-400 hover:border-[#1a9e1a] hover:text-[#1a9e1a] transition-colors flex flex-col items-center gap-2"
              >
                <img src="/icons/camera.svg" alt="Camera" className="w-10 h-10 opacity-50" />
                <span className="text-sm">Clique para enviar uma foto</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-bold text-gray-800 mb-1">3. Localizacao (Opcional)</h2>
            <p className="text-sm text-gray-500 mb-4">Capture sua localizacao para validar a acao</p>
            <div className="flex gap-3">
              <input
                {...register('location')}
                type="text"
                value={localizacao}
                onChange={e => setLocalizacao(e.target.value)}
                placeholder="Latitude, Longitude"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1a9e1a] focus:ring-1 focus:ring-[#1a9e1a]"
              />
              <button
                type="button"
                onClick={obterGPS}
                className="flex items-center gap-2 px-4 py-3 bg-[#f0faf0] text-[#1a9e1a] font-medium rounded-xl hover:bg-[#cce6cc] transition-colors text-sm whitespace-nowrap"
              >
                <img src="/icons/localizacao.svg" alt="GPS" className="w-5 h-5" />
                GPS
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!acao || !foto}
            className="w-full py-4 bg-gradient-to-r from-[#1a9e1a] to-[#0f6e2e] text-white font-bold rounded-xl text-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Verificar Atividade
          </button>
        </form>
      </div>
    </>
  );
}
