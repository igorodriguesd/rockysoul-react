import { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useColecao } from '../context/CollectionContext';
import { useChat } from '../context/ChatContext';
import { MISSOES, RECOMPENSAS_CHAT, CURIOSIDADES, CREDITOS_POR_REAL, MIN_CREDITOS_CONVERSAO } from '../data/constants';
import { SETS_CARTAS, CHANCE_DROP_POR_RARIDADE, LABEL_RARIDADE } from '../data/cartas';
import type { ChatMessage } from '../types';

type BotState = 'normal' | 'aguardandoNome' | 'aguardandoAcao' | 'aguardandoResgate' | 'aguardandoValorConversao' | 'aguardandoChavePix';

function formatarReais(valor: number): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const INTENTS: Record<string, string[]> = {
  saudacoes: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'e ai', 'fala', 'salve'],
  ajuda: ['ajuda', 'help', 'como', 'procedimento', 'tutorial', 'guia', 'orientacao'],
  pontos: ['pontos', 'pontuacao', 'score', 'quantos pontos', 'saldo', 'creditos', 'credito', 'saldo em creditos'],
  nivel: ['nivel', 'level', 'rank', 'ranking', 'evoluir', 'subir nivel'],
  sugestao: ['sugestao', 'dica', 'ideia', 'o que faco', 'recomendar'],
  curiosidade: ['curiosidade', 'curioso', 'fato', 'dado', 'sabia que', 'informacao'],
  motivacao: ['motivacao', 'motivar', 'incentivar', 'continue', 'parabens'],
  sobre: ['sobre', 'projeto', 'rockysoul', 'about'],
  registrar: ['registrar', 'registrar acao', 'salvar', 'gravar', 'anotar'],
  recompensa: ['recompensa', 'premio', 'resgatar', 'reward', 'trocar'],
  converter: ['converter', 'conversao', 'pix', 'dinheiro', 'real', 'reais', 'sacar', 'trocar por dinheiro', 'saldo em reais'],
  cartas: ['cartas', 'carta', 'cartinhas', 'colecao', 'drop', 'quimica', 'raridade', 'roleta'],
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

const SUGESTOES_RAPIDAS: { label: string; comando: string }[] = [
  { label: 'Registrar ação', comando: 'registrar' },
  { label: 'Meus créditos', comando: 'pontos' },
  { label: 'Converter créditos', comando: 'converter' },
  { label: 'Minhas cartas', comando: 'cartas' },
  { label: 'Meu nível', comando: 'nivel' },
  { label: 'Dica', comando: 'dica' },
  { label: 'Recompensas', comando: 'recompensa' },
];

export default function Chat() {
  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [indiceCuriosidade, setIndiceCuriosidade] = useState(0);
  const [mostrarTeaser, setMostrarTeaser] = useState(false);
  const [aguardandoEntrada, setAguardandoEntrada] = useState(false);
  const estadoRef = useRef<BotState>('normal');
  const conversaoRef = useRef(0);
  const initRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, adicionarPontos, subtrairPontos, addResgate, getNivel, setNome } = useData();
  const { adquirirPorMissao, colecao, getProgressoTotal, getQuimica, getProximoObjetivo } = useColecao();
  const { aberto, abrirChat, fecharChat } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  useEffect(() => {
    if (aberto && !initRef.current) {
      initRef.current = true;
      setMostrarTeaser(false);
      setTimeout(() => {
        setMensagens([{ texto: 'Olá! Eu sou o RockySoul, seu assistente de sustentabilidade.\n\nVocê pode **registrar ações**, ver seus **créditos e nível**, **converter créditos em dinheiro**, pedir **dicas** e **resgatar recompensas**.\n\nUse os atalhos abaixo ou digite o que quiser!', remetente: 'bot' }]);
      }, 350);
    }
  }, [aberto]);

  useEffect(() => {
    if (aberto) return;

    let jaViu = false;
    try {
      jaViu = sessionStorage.getItem('rocky_chat_teaser') === '1';
    } catch {
      jaViu = false;
    }
    if (jaViu) return;

    const t = setTimeout(() => setMostrarTeaser(true), 2500);
    return () => clearTimeout(t);
  }, [aberto]);

  function marcarTeaserVisto() {
    setMostrarTeaser(false);
    try {
      sessionStorage.setItem('rocky_chat_teaser', '1');
    } catch {
      setMostrarTeaser(false);
    }
  }

  function abrirComTeaser() {
    marcarTeaserVisto();
    abrirChat();
  }

  function adicionarMensagem(texto: string, remetente: 'user' | 'bot') {
    setMensagens(prev => [...prev, { texto, remetente }]);
  }

  function responder(texto: string) {
    setTimeout(() => adicionarMensagem(texto, 'bot'), 350);
  }

  function registrarAcao(missaoId: string, nome: string, pontos: number): string {
    adicionarPontos(pontos, nome);
    const drop = adquirirPorMissao(missaoId);
    let texto = `**Ação registrada: ${nome}!**\n\n+${pontos} créditos`;
    if (drop) {
      if (drop.caiu) texto += `\n\nNova carta obtida: **${drop.novaCarta.carta.nome}**`;
      else texto += `\n\nA carta **${drop.carta.nome}** escapou desta vez! Chance de drop: ${drop.chance}%. Tente novamente.`;
    }
    return texto;
  }

  function ProcessarMensagem(userText: string) {
    const texto = userText.trim();
    if (!texto) return;

    adicionarMensagem(texto, 'user');
    const estado = estadoRef.current;

    if (estado === 'aguardandoNome') {
      const nome = texto.split(' ')[0].replace(/[^a-zA-ZÀ-ÿ]/g, '');
      if (nome.length < 2) {
        responder('Por favor, digite um nome válido com pelo menos 2 letras.');
        return;
      }
      setNome(nome);
      estadoRef.current = 'normal';
      setAguardandoEntrada(false);
      responder(`Prazer em conhecer você, ${nome}! Bem-vindo ao RockySoulUp! Seu nível atual é **${getNivel()}** e você tem **${data.pontos} créditos**. Como posso te ajudar?`);
      return;
    }

    if (estado === 'aguardandoAcao') {
      const num = parseInt(texto, 10);
      if (!isNaN(num) && num >= 1 && num <= MISSOES.length) {
        const missao = MISSOES[num - 1];
        const drop = adquirirPorMissao(missao.id);
        adicionarPontos(missao.pontos, missao.nome);
        estadoRef.current = 'normal';
        setAguardandoEntrada(false);
        responder(`Ação registrada com sucesso!\n\n**${missao.nome}**\n+${missao.pontos} créditos${drop && drop.caiu ? `\n\nNova carta obtida: **${drop.novaCarta.carta.nome}**` : ''}${drop && !drop.caiu ? `\n\nA carta **${drop.carta.nome}** escapou desta vez! Chance de drop: ${drop.chance}%. Tente novamente.` : ''}`);
      } else {
        responder(`Número inválido. Por favor, digite um número de 1 a ${MISSOES.length}.`);
      }
      return;
    }

    if (estado === 'aguardandoResgate') {
      const num = parseInt(texto, 10);
      if (!isNaN(num) && num >= 1 && num <= RECOMPENSAS_CHAT.length) {
        const recompensa = RECOMPENSAS_CHAT[num - 1];
        if (data.pontos >= recompensa.pontos) {
          subtrairPontos(recompensa.pontos);
          addResgate({ nome: recompensa.nome, pontos: recompensa.pontos, data: new Date().toISOString() });
          estadoRef.current = 'normal';
          setAguardandoEntrada(false);
          responder(`Recompensa resgatada com sucesso!\n\n**${recompensa.nome}**\n-${recompensa.pontos} créditos`);
        } else {
          estadoRef.current = 'normal';
          setAguardandoEntrada(false);
          responder(`Você não tem créditos suficientes para esta recompensa.\n\nPrecisa de **${recompensa.pontos} créditos**, mas tem apenas **${data.pontos} créditos**.`);
        }
      } else {
        responder(`Número inválido. Por favor, digite um número de 1 a ${RECOMPENSAS_CHAT.length}.`);
      }
      return;
    }

    if (estado === 'aguardandoValorConversao') {
      const num = parseInt(texto.replace(/\D+/g, ''), 10);
      if (isNaN(num) || num <= 0) {
        responder(`Digite a quantidade de créditos que deseja converter (apenas números).\n\nMínimo: **${MIN_CREDITOS_CONVERSAO} créditos** · Seu saldo: **${data.pontos} créditos**`);
        return;
      }
      if (num < MIN_CREDITOS_CONVERSAO) {
        responder(`O valor mínimo para conversão é **${MIN_CREDITOS_CONVERSAO} créditos** (R$${formatarReais(MIN_CREDITOS_CONVERSAO / CREDITOS_POR_REAL)}). Escolha um valor maior.`);
        return;
      }
      if (num > data.pontos) {
        responder(`Você não tem créditos suficientes. Seu saldo é **${data.pontos} créditos**. Digite um valor menor.`);
        return;
      }
      conversaoRef.current = num;
      estadoRef.current = 'aguardandoChavePix';
      responder(`Você vai converter **${num} créditos** = **R$${formatarReais(num / CREDITOS_POR_REAL)}**.\n\nAgora digite sua **chave Pix** (CPF, e-mail, telefone ou chave aleatória):`);
      return;
    }

    if (estado === 'aguardandoChavePix') {
      const chave = texto.trim();
      if (chave.length < 3) {
        responder('Chave Pix inválida. Digite uma chave válida (CPF, e-mail, telefone ou chave aleatória).');
        return;
      }
      const creditos = conversaoRef.current;
      const valor = creditos / CREDITOS_POR_REAL;
      subtrairPontos(creditos);
      addResgate({
        nome: `Conversão de créditos em dinheiro (R$${formatarReais(valor)})`,
        pontos: creditos,
        data: new Date().toISOString(),
      });
      conversaoRef.current = 0;
      estadoRef.current = 'normal';
      setAguardandoEntrada(false);
      responder(
        `**Conversão solicitada com sucesso!**\n\n**-${creditos} créditos** · **R$${formatarReais(valor)}**\n\nO valor será enviado para a chave Pix. A conversão aparece na sua **Atividade Recente**.`
      );
      return;
    }

    const intent = detectIntent(texto);

    switch (intent) {
      case 'saudacoes': {
        const nome = data.nome;
        if (nome) {
          responder(`Olá, ${nome}! Bem-vindo de volta ao RockySoulUp! Você tem **${data.pontos} créditos** e está no nível **${getNivel()}**. Como posso te ajudar hoje?`);
        } else {
          estadoRef.current = 'aguardandoNome';
          setAguardandoEntrada(true);
          responder('Olá! Eu sou o RockySoul, seu assistente de sustentabilidade! Qual é o seu nome?');
        }
        break;
      }

      case 'ajuda': {
        responder(
          '**Como posso te ajudar:**\n\n' +
          '- **Registrar ação** - Para registrar uma ação sustentável e ganhar créditos\n' +
          '- **Meus créditos** - Para ver seu saldo atual\n' +
          '- **Converter créditos** - Para converter créditos em dinheiro via Pix\n' +
          '- **Meu nível** - Para ver seu nível de evolução\n' +
          '- **Recompensas** - Para ver e resgatar recompensas\n' +
          '- **Minhas cartas** - Para ver sua coleção de cartas, sets e chances de drop\n' +
          '- **Sugestão** - Para receber dicas de ações sustentáveis\n' +
          '- **Curiosidade** - Para aprender fatos interessantes\n\n' +
          'Também posso entender comandos como "reciclei", "usei bicicleta", "economizei água" e muito mais!'
        );
        break;
      }

      case 'pontos': {
        responder('**Seu saldo de créditos:**\n\n**' + data.pontos + ' créditos**\nTotal de missões completas: ' + data.missoesCompletas + '\nCréditos hoje: ' + data.pontosHoje);
        break;
      }

      case 'nivel': {
        const nivel = getNivel();
        const proximoNivel =
          nivel === 'Semente' ? 'Broto (100 créditos)' :
            nivel === 'Broto' ? 'Árvore (300 créditos)' :
              nivel === 'Árvore' ? 'Expert (1000 créditos)' :
                'Nível máximo atingido!';
        responder(
          '**Seu nível atual:** ' + nivel + '\n\n' +
          '**' + data.pontos + ' créditos acumulados**\n\n' +
          'Próximo nível: **' + proximoNivel + '**\n\n' +
          'Continue realizando ações sustentáveis para evoluir!'
        );
        break;
      }

      case 'sugestao': {
        const missoesNaoFeitas = MISSOES.filter(
          m => !data.historico.some(h => h.nome === m.nome)
        );
        if (missoesNaoFeitas.length > 0) {
          const lista = missoesNaoFeitas.map((m, i) => `${i + 1}. ${m.nome} (+${m.pontos} créditos)`).join('\n');
          responder('**Sugestões de ações sustentáveis que você ainda não realizou:**\n\n' + lista + '\n\nDigite "registrar" para começar!');
        } else {
          const missao = randomItem(MISSOES);
          responder('Parabéns! Você já experimentou todas as ações! Que tal repetir uma?\n\nSugestão: **' + missao.nome + '** (+' + missao.pontos + ' créditos)');
        }
        break;
      }

      case 'curiosidade': {
        const curiosidade = CURIOSIDADES[indiceCuriosidade % CURIOSIDADES.length];
        setIndiceCuriosidade(prev => prev + 1);
        responder('**Curiosidade Sustentável:**\n\n' + curiosidade + '\n\nQuer saber mais? Digite "curiosidade" novamente!');
        break;
      }

      case 'motivacao': {
        const nivel = getNivel();
        const frases = [
          'Você está no nível **' + nivel + '** com **' + data.pontos + ' créditos**! Continue assim!',
          'Cada ação sustentável faz diferença! Você já completou **' + data.missoesCompletas + ' missões**!',
          'O planeta agradece cada gesto seu! Continue evoluindo!',
          'Nível **' + nivel + '**! Você é um exemplo de sustentabilidade!',
          'Com **' + data.pontos + ' créditos**, você está fazendo a diferença! Não pare!',
        ];
        responder(randomItem(frases));
        break;
      }

      case 'sobre': {
        responder(
          '**RockySoulUp**\n\n' +
          'O RockySoulUp é uma plataforma de gamificação sustentável que transforma ações ecológicas em créditos, níveis e recompensas!\n\n' +
          '**Nosso objetivo:**\n' +
          '- Incentivar práticas sustentáveis no dia a dia\n' +
          '- Recompensar quem cuida do planeta\n' +
          '- Criar uma comunidade de pessoas comprometidas com o meio ambiente\n\n' +
          '**Como funciona:**\n' +
          '- Registre ações sustentáveis e ganhe créditos\n' +
          '- Conquiste cartas por raridade com chance de drop (roleta)\n' +
          '- Complete sets de cartas e ganhe bônus de química\n' +
          '- Converta créditos em dinheiro via Pix\n' +
          '- Evolua de Semente a Expert\n' +
          '- Desbloqueie selos e resgate recompensas\n\n' +
          'Junte-se a nós e faça a diferença!'
        );
        break;
      }

      case 'registrar': {
        estadoRef.current = 'aguardandoAcao';
        setAguardandoEntrada(true);
        const lista = MISSOES.map((m, i) => `${i + 1}. ${m.nome} (+${m.pontos} créditos)`).join('\n');
        responder('**Escolha uma ação sustentável para registrar:**\n\n' + lista + '\n\nDigite o número da ação que você realizou:');
        break;
      }

      case 'converter': {
        estadoRef.current = 'aguardandoValorConversao';
        setAguardandoEntrada(true);
        responder(
          `**Conversor de créditos em dinheiro (Pix)**\n\n` +
          `${CREDITOS_POR_REAL} créditos = **R$1,00**\nMínimo: **${MIN_CREDITOS_CONVERSAO} créditos**\nSeu saldo: **${data.pontos} créditos**\n\n` +
          `Digite a quantidade de créditos que deseja converter:`
        );
        break;
      }

      case 'cartas': {
        const { obtidas, total } = getProgressoTotal();
        const linhasSets = SETS_CARTAS.map(set => {
          const quimica = getQuimica(set.id);
          const cartasSet = colecao.sets[set.id]?.cartas.length ?? 0;
          const nivel = quimica.level === 3 ? 'Química Nível 3 · Set completo' : quimica.level > 0 ? `Química Nível ${quimica.level}` : 'Sem química';
          return `- **${set.nome}** (${cartasSet}/4) · ${nivel}`;
        }).join('\n');
        const proximo = getProximoObjetivo();
        const chances = (Object.entries(CHANCE_DROP_POR_RARIDADE) as [keyof typeof CHANCE_DROP_POR_RARIDADE, number][])
          .map(([r, c]) => `${LABEL_RARIDADE[r]} ${c}%`)
          .join(' · ');
        responder(
          '**Sua coleção de cartas**\n\n' +
          `**${obtidas}/${total}** cartas conquistadas\n\n` +
          '**Sets e química:**\n' + linhasSets + '\n\n' +
          (proximo ? `Próximo objetivo: complete o set **${proximo.set.nome}** (faltam ${proximo.faltam} carta(s)) para ativar a química.\n\n` : 'Set completo em todos! Você domina a coleção 😄\n\n') +
          '**Chance de drop por raridade:**\n' + chances + '\n\n' +
          'Complete um set (4/4) para ganhar **+150 créditos** de bônus!'
        );
        break;
      }

      case 'recompensa': {
        estadoRef.current = 'aguardandoResgate';
        setAguardandoEntrada(true);
        const lista = RECOMPENSAS_CHAT.map((r, i) => `${i + 1}. ${r.nome} - ${r.pontos} créditos`).join('\n');
        responder('**Recompensas disponíveis:**\n\n' + lista + '\n\nSeu saldo: **' + data.pontos + ' créditos**\n\nDigite o número da recompensa que deseja resgatar:');
        break;
      }

      case 'reciclagem': {
        responder(registrarAcao('reciclagem', 'Reciclagem', 30));
        break;
      }

      case 'transporte': {
        responder(registrarAcao('transporte', 'Transporte Sustentável', 50));
        break;
      }

      case 'energia': {
        responder(registrarAcao('energia', 'Economia de Energia', 20));
        break;
      }

      case 'agua': {
        responder(registrarAcao('agua', 'Economia de Água', 20));
        break;
      }

      case 'bicicleta': {
        responder(registrarAcao('bicicleta', 'Bicicleta', 40));
        break;
      }

      case 'arvore': {
        responder(registrarAcao('plantio', 'Plantio', 100));
        break;
      }

      case 'banho': {
        responder(registrarAcao('banho', 'Banho Rápido', 20));
        break;
      }

      case 'despedida': {
        const nome = data.nome;
        responder('Tchau' + (nome ? ', ' + nome : '') + '! Foi ótimo conversar com você! Continue cuidando do planeta!');
        break;
      }

      default: {
        const nome = data.nome;
        responder(
          'Hmm, não tenho certeza se entendi!\n\n' +
          (nome ? 'Olá, ' + nome + '! ' : '') + 'Aqui estão algumas coisas que posso fazer:\n\n' +
          '- Digite **"registrar"** para registrar uma ação sustentável\n' +
          '- Digite **"creditos"** para ver seu saldo\n' +
          '- Digite **"nivel"** para ver seu nível\n' +
          '- Digite **"recompensa"** para resgatar recompensas\n' +
          '- Digite **"converter"** para converter créditos em dinheiro via Pix\n' +
          '- Digite **"cartas"** para ver sua coleção e chances de drop\n' +
          '- Digite **"ajuda"** para ver todas as opções\n' +
          '- Ou digite algo como **"reciclei"**, **"usei bicicleta"**, **"economizei água"**!'
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

  function handleAcaoRapida(comando: string) {
    setInput('');
    ProcessarMensagem(comando);
  }

  return (
    <>
      {!aberto && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {mostrarTeaser && (
            <div
              role="button"
              tabIndex={0}
              onClick={abrirComTeaser}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirComTeaser(); } }}
              className="relative max-w-65 card-secondary rounded-2xl rounded-br-sm shadow-2xl border border-[#20d968]/25 p-4 text-left cursor-pointer"
            >
              <button
                onClick={(e) => { e.stopPropagation(); marcarTeaserVisto(); }}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                aria-label="Dispensar dica"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
              <div className="flex items-start gap-3">
                <img src="/imagens/logo.png" alt="" className="h-9 w-auto opacity-90 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-leaf">RockySoul</p>
                  <p className="text-sm text-white/85 mt-0.5 leading-snug">
                    Oi! Sou seu assistente de sustentabilidade. Digite "dica" ou "registrar" pra começar.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-leaf animate-ping opacity-20" aria-hidden="true" />
            <button
              onClick={abrirChat}
              className="relative flex items-center gap-2.5 rounded-full bg-leaf hover:bg-leaf-soft hover:shadow-[0_0_30px_rgba(32,217,104,0.5)] transition-all px-4 py-3.5 text-[#063d25] font-semibold shadow-xl cursor-pointer"
              aria-label="Abrir chat"
            >
              <svg className="shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="text-sm font-semibold whitespace-nowrap">Fale com o RockySoul</span>
            </button>
          </div>
        </div>
      )}

      {aberto && (
        <div className="fixed bottom-6 right-6 z-50 card-secondary backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col w-[min(360px,calc(100vw-2rem))] h-110 max-h-[80vh] border border-[#20d968]/25">
          <div className="text-white p-4 flex items-center gap-3 shrink-0" style={{ background: 'linear-gradient(135deg, #063d25, #0b4a2c)' }}>
            <div className="w-10 h-10 rounded-full bg-leaf/25 flex items-center justify-center shrink-0">
              <img src="/imagens/logo.png" alt="" className="h-6 w-auto opacity-90" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif-display text-lg leading-tight">RockySoulUp</h3>
              <p className="text-white/70 text-xs">Assistente de Sustentabilidade</p>
            </div>
            <button
              onClick={fecharChat}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              aria-label="Fechar chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-4 bg-[#063d25]/35">
            {mensagens.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.remetente === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 max-w-[80%] text-sm leading-relaxed whitespace-pre-line ${msg.remetente === 'user'
                      ? 'bg-leaf text-[#063d25] rounded-2xl rounded-tr-sm font-medium'
                      : 'card-primary text-white/90 rounded-2xl rounded-tl-sm'
                    }`}
                >
                  {msg.texto.split('**').map((part, idx) =>
                    idx % 2 === 1 ? <strong key={idx} className="text-leaf">{part}</strong> : part
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {!aguardandoEntrada && (
            <div className="flex flex-wrap gap-1.5 px-3 pt-2 bg-[#063d25]/35 shrink-0">
              {SUGESTOES_RAPIDAS.map(s => (
                <button
                  key={s.comando}
                  onClick={() => handleAcaoRapida(s.comando)}
                  className="text-xs font-medium text-leaf bg-leaf/10 hover:bg-leaf/20 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex border-t border-[#0b4a2c] bg-[#0b4a2c]/60 shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 outline-none px-4 py-3 text-sm text-white placeholder-white/35 bg-transparent"
            />
            <button
              type="submit"
              className="px-4 py-3 text-leaf hover:text-leaf-soft transition-colors cursor-pointer"
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
