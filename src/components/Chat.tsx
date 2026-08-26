import { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { MISSOES, RECOMPENSAS_CHAT, CURIOSIDADES } from '../data/constants';
import type { ChatMessage } from '../types';

type BotState = 'normal' | 'aguardandoNome' | 'aguardandoAcao' | 'aguardandoResgate';

const INTENTS: Record<string, string[]> = {
  saudacoes: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'e ai', 'fala', 'salve'],
  ajuda: ['ajuda', 'help', 'como', 'procedimento', 'tutorial', 'guia', 'orientacao'],
  pontos: ['pontos', 'pontuacao', 'score', 'quantos pontos', 'saldo'],
  nivel: ['nivel', 'level', 'rank', 'ranking', 'evoluir', 'subir nivel'],
  sugestao: ['sugestao', 'dica', 'ideia', 'o que faco', 'recomendar'],
  curiosidade: ['curiosidade', 'curioso', 'fato', 'dado', 'sabia que', 'informacao'],
  motivacao: ['motivacao', 'motivar', 'incentivar', 'continue', 'parabens'],
  sobre: ['sobre', 'projeto', 'rockysoul', 'about'],
  registrar: ['registrar', 'registrar acao', 'salvar', 'gravar', 'anotar'],
  recompensa: ['recompensa', 'premio', 'resgatar', 'reward', 'trocar'],
  reciclagem: ['reciclar', 'reciclagem', 'reciclei', 'lixo', 'material'],
  transporte: ['transporte', 'onibus', 'metro', 'trem', 'publico'],
  energia: ['energia', 'eletrica', 'luz', 'apagar', 'desligar'],
  agua: ['agua', 'banho', 'torneira', 'hidrometro'],
  bicicleta: ['bicicleta', 'bike', 'pedal', 'ciclismo'],
  arvore: ['arvore', 'plantar', 'plantio', 'muda', 'floresta'],
  banho: ['banho rapido', 'ducha', '5 minutos'],
  despedida: ['tchau', 'adeus', 'bye', 'ate logo', 'flw'],
};

function detectIntent(text: string): string | null {
  const lower = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  for (const [intent, keywords] of Object.entries(INTENTS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return intent;
    }
  }
  return null;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Chat() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [indiceCuriosidade, setIndiceCuriosidade] = useState(0);
  const estadoRef = useRef<BotState>('normal');
  const initRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, adicionarPontos, subtrairPontos, addResgate, getNivel, setNome } = useData();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  useEffect(() => {
    if (aberto && !initRef.current) {
      initRef.current = true;
      setTimeout(() => {
        setMensagens([{ texto: 'Ola! Eu sou o RockySoul, seu assistente de sustentabilidade. Como posso te ajudar?', remetente: 'bot' }]);
      }, 350);
    }
  }, [aberto]);

  function adicionarMensagem(texto: string, remetente: 'user' | 'bot') {
    setMensagens(prev => [...prev, { texto, remetente }]);
  }

  function responder(texto: string) {
    setTimeout(() => adicionarMensagem(texto, 'bot'), 350);
  }

  function ProcessarMensagem(userText: string) {
    const texto = userText.trim();
    if (!texto) return;

    adicionarMensagem(texto, 'user');
    const estado = estadoRef.current;

    if (estado === 'aguardandoNome') {
      const nome = texto.split(' ')[0].replace(/[^a-zA-ZÀ-ÿ]/g, '');
      if (nome.length < 2) {
        responder('Por favor, digite um nome valido com pelo menos 2 letras.');
        return;
      }
      setNome(nome);
      estadoRef.current = 'normal';
      responder(`Prazer em conhecer voce, ${nome}! Bem-vindo ao RockySoulUp! Seu nivel atual e **${getNivel()}** e voce tem **${data.pontos} pontos**. Como posso te ajudar?`);
      return;
    }

    if (estado === 'aguardandoAcao') {
      const num = parseInt(texto, 10);
      if (!isNaN(num) && num >= 1 && num <= MISSOES.length) {
        const missao = MISSOES[num - 1];
        adicionarPontos(missao.pontos, missao.nome);
        estadoRef.current = 'normal';
        responder(`Acao registrada com sucesso!\n\n**${missao.nome}**\n+${missao.pontos} pontos\n\nSeu novo saldo: **${data.pontos + missao.pontos} pontos** | Nivel: **${getNivel()}**`);
      } else {
        responder(`Numero invalido. Por favor, digite um numero de 1 a ${MISSOES.length}.`);
      }
      return;
    }

    if (estado === 'aguardandoResgate') {
      const num = parseInt(texto, 10);
      if (!isNaN(num) && num >= 1 && num <= RECOMPENSAS_CHAT.length) {
        const recompensa = RECOMPENSAS_CHAT[num - 1];
        if (data.pontos >= recompensa.pontos) {
          subtrairPontos(recompensa.pontos);
          addResgate({ nome: recompensa.nome, pontos: recompensa.pontos, data: new Date().toLocaleString('pt-BR') });
          estadoRef.current = 'normal';
          responder(`Recompensa resgatada com sucesso!\n\n**${recompensa.nome}**\n-${recompensa.pontos} pontos\n\nSeu novo saldo: **${data.pontos - recompensa.pontos} pontos**`);
        } else {
          estadoRef.current = 'normal';
          responder(`Voce nao tem pontos suficientes para esta recompensa.\n\nPrecisa de **${recompensa.pontos} pontos**, mas tem apenas **${data.pontos} pontos**.`);
        }
      } else {
        responder(`Numero invalido. Por favor, digite um numero de 1 a ${RECOMPENSAS_CHAT.length}.`);
      }
      return;
    }

    const intent = detectIntent(texto);

    switch (intent) {
      case 'saudacoes': {
        const nome = data.nome;
        if (nome) {
          responder(`Ola, ${nome}! Bem-vindo de volta ao RockySoulUp! Voce tem **${data.pontos} pontos** e esta no nivel **${getNivel()}**. Como posso te ajudar hoje?`);
        } else {
          estadoRef.current = 'aguardandoNome';
          responder('Ola! Eu sou o RockySoul, seu assistente de sustentabilidade! Qual e o seu nome?');
        }
        break;
      }

      case 'ajuda': {
        responder(
          '**Como posso te ajudar:**\n\n' +
          '- **Registrar acao** - Para registrar uma acao sustentavel e ganhar pontos\n' +
          '- **Meus pontos** - Para ver seu saldo atual\n' +
          '- **Meu nivel** - Para ver seu nivel de evolucao\n' +
          '- **Recompensas** - Para ver e resgatar recompensas\n' +
          '- **Sugestao** - Para receber dicas de acoes sustentaveis\n' +
          '- **Curiosidade** - Para aprender fatos interessantes\n\n' +
          'Tambem posso entender comandos como "reciclei", "usei bicicleta", "economizei agua" e muito mais!'
        );
        break;
      }

      case 'pontos': {
        responder('**Seu saldo de pontos:**\n\n**' + data.pontos + ' pontos**\nTotal de missoes completas: ' + data.missoesCompletas + '\nPontos hoje: ' + data.pontosHoje);
        break;
      }

      case 'nivel': {
        const nivel = getNivel();
        const proximoNivel =
          nivel === 'Semente' ? 'Broto (100 pontos)' :
          nivel === 'Broto' ? 'Arvore (300 pontos)' :
          nivel === 'Arvore' ? 'Expert (1000 pontos)' :
          'Nivel maximo atingido!';
        responder(
          '**Seu nivel atual:** ' + nivel + '\n\n' +
          '**' + data.pontos + ' pontos acumulados**\n\n' +
          'Proximo nivel: **' + proximoNivel + '**\n\n' +
          'Continue realizando acoes sustentaveis para evoluir!'
        );
        break;
      }

      case 'sugestao': {
        const missoesNaoFeitas = MISSOES.filter(
          m => !data.historico.some(h => h.nome === m.nome)
        );
        if (missoesNaoFeitas.length > 0) {
          const lista = missoesNaoFeitas.map((m, i) => `${i + 1}. ${m.nome} (+${m.pontos} pontos)`).join('\n');
          responder('**Sugestoes de acoes sustentaveis que voce ainda nao realizou:**\n\n' + lista + '\n\nDigite "registrar" para comecar!');
        } else {
          const missao = randomItem(MISSOES);
          responder('Parabens! Voce ja experimentou todas as acoes! Que tal repetir uma?\n\nSugestao: **' + missao.nome + '** (+' + missao.pontos + ' pontos)');
        }
        break;
      }

      case 'curiosidade': {
        const curiosidade = CURIOSIDADES[indiceCuriosidade % CURIOSIDADES.length];
        setIndiceCuriosidade(prev => prev + 1);
        responder('**Curiosidade Sustentavel:**\n\n' + curiosidade + '\n\nQuer saber mais? Digite "curiosidade" novamente!');
        break;
      }

      case 'motivacao': {
        const nivel = getNivel();
        const frases = [
          'Voce esta no nivel **' + nivel + '** com **' + data.pontos + ' pontos**! Continue assim!',
          'Cada acao sustentavel faz diferenca! Voce ja completou **' + data.missoesCompletas + ' missoes**!',
          'O planeta agradece cada gesto seu! Continue evoluindo!',
          'Nivel **' + nivel + '**! Voce e um exemplo de sustentabilidade!',
          'Com **' + data.pontos + ' pontos**, voce esta fazendo a diferenca! Nao pare!',
        ];
        responder(randomItem(frases));
        break;
      }

      case 'sobre': {
        responder(
          '**RockySoulUp**\n\n' +
          'O RockySoulUp e uma plataforma de gamificacao sustentavel que transforma acoes ecologicas em pontos, niveis e recompensas!\n\n' +
          '**Nosso objetivo:**\n' +
          '- Incentivar praticas sustentaveis no dia a dia\n' +
          '- Recompensar quem cuida do planeta\n' +
          '- Criar uma comunidade de pessoas comprometidas com o meio ambiente\n\n' +
          '**Como funciona:**\n' +
          '- Registre acoes sustentaveis e ganhe pontos\n' +
          '- Evolua de Semente a Expert\n' +
          '- Desbloqueie selos e resgate recompensas\n\n' +
          'Junte-se a nos e faca a diferenca!'
        );
        break;
      }

      case 'registrar': {
        estadoRef.current = 'aguardandoAcao';
        const lista = MISSOES.map((m, i) => `${i + 1}. ${m.nome} (+${m.pontos} pontos)`).join('\n');
        responder('**Escolha uma acao sustentavel para registrar:**\n\n' + lista + '\n\nDigite o numero da acao que voce realizou:');
        break;
      }

      case 'recompensa': {
        estadoRef.current = 'aguardandoResgate';
        const lista = RECOMPENSAS_CHAT.map((r, i) => `${i + 1}. ${r.nome} - ${r.pontos} pontos`).join('\n');
        responder('**Recompensas disponiveis:**\n\n' + lista + '\n\nSeu saldo: **' + data.pontos + ' pontos**\n\nDigite o numero da recompensa que deseja resgatar:');
        break;
      }

      case 'reciclagem': {
        adicionarPontos(30, 'Reciclagem');
        responder('**Acao registrada: Reciclagem!**\n\n+30 pontos\nSeu novo saldo: **' + (data.pontos + 30) + ' pontos** | Nivel: **' + getNivel() + '**');
        break;
      }

      case 'transporte': {
        adicionarPontos(50, 'Transporte Sustentavel');
        responder('**Acao registrada: Transporte Sustentavel!**\n\n+50 pontos\nSeu novo saldo: **' + (data.pontos + 50) + ' pontos** | Nivel: **' + getNivel() + '**');
        break;
      }

      case 'energia': {
        adicionarPontos(20, 'Economia de Energia');
        responder('**Acao registrada: Economia de Energia!**\n\n+20 pontos\nSeu novo saldo: **' + (data.pontos + 20) + ' pontos** | Nivel: **' + getNivel() + '**');
        break;
      }

      case 'agua': {
        adicionarPontos(20, 'Economia de Agua');
        responder('**Acao registrada: Economia de Agua!**\n\n+20 pontos\nSeu novo saldo: **' + (data.pontos + 20) + ' pontos** | Nivel: **' + getNivel() + '**');
        break;
      }

      case 'bicicleta': {
        adicionarPontos(40, 'Bicicleta');
        responder('**Acao registrada: Bicicleta!**\n\n+40 pontos\nSeu novo saldo: **' + (data.pontos + 40) + ' pontos** | Nivel: **' + getNivel() + '**');
        break;
      }

      case 'arvore': {
        adicionarPontos(100, 'Plantio');
        responder('**Acao registrada: Plantio!**\n\n+100 pontos\nSeu novo saldo: **' + (data.pontos + 100) + ' pontos** | Nivel: **' + getNivel() + '**');
        break;
      }

      case 'banho': {
        adicionarPontos(20, 'Banho Rapido');
        responder('**Acao registrada: Banho Rapido!**\n\n+20 pontos\nSeu novo saldo: **' + (data.pontos + 20) + ' pontos** | Nivel: **' + getNivel() + '**');
        break;
      }

      case 'despedida': {
        const nome = data.nome;
        responder('Tchau' + (nome ? ', ' + nome : '') + '! Foi otimo conversar com voce! Continue cuidando do planeta!');
        break;
      }

      default: {
        const nome = data.nome;
        responder(
          'Hmm, nao tenho certeza se entendi!\n\n' +
          (nome ? 'Ola, ' + nome + '! ' : '') + 'Aqui estao algumas coisas que posso fazer:\n\n' +
          '- Digite **"registrar"** para registrar uma acao sustentavel\n' +
          '- Digite **"pontos"** para ver seu saldo\n' +
          '- Digite **"nivel"** para ver seu nivel\n' +
          '- Digite **"recompensa"** para resgatar recompensas\n' +
          '- Digite **"ajuda"** para ver todas as opcoes\n' +
          '- Ou digite algo como **"reciclei"**, **"usei bicicleta"**, **"economizei agua"**!'
        );
        break;
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const texto = input.trim();
    if (!texto) return;
    setInput('');
    ProcessarMensagem(texto);
  }

  return (
    <>
      {!aberto && (
        <button
          onClick={() => setAberto(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#22c55e] shadow-lg hover:shadow-xl hover:bg-[#16a34a] transition-all flex items-center justify-center text-white cursor-pointer"
          aria-label="Abrir chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {aberto && (
        <div className="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col w-[min(360px,calc(100vw-2rem))] h-[440px] max-h-[80vh] border border-white/40">
          <div className="bg-[#22c55e] text-white p-4 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <img src="/imagens/logo.png" alt="" className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg leading-tight">RockySoulUp</h3>
              <p className="text-white/80 text-xs">Assistente de Sustentabilidade</p>
            </div>
            <button
              onClick={() => setAberto(false)}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              aria-label="Fechar chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-4 bg-gray-50">
            {mensagens.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.remetente === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 max-w-[80%] text-sm leading-relaxed whitespace-pre-line ${
                    msg.remetente === 'user'
                      ? 'bg-[#22c55e] text-white rounded-2xl rounded-tr-sm'
                      : 'bg-[#f0faf0] text-gray-800 rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.texto.split('**').map((part, idx) =>
                    idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex border-t border-gray-200 bg-white shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 outline-none px-4 py-3 text-sm text-gray-700 placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-4 py-3 text-[#22c55e] hover:text-[#16a34a] transition-colors cursor-pointer"
              aria-label="Enviar mensagem"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
