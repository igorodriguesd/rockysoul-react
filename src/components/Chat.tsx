import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useData } from '../context/DataContext';
import { useColecao } from '../context/CollectionContext';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import { CURIOSIDADES } from '../data/constants';
import type { ChatMessage } from '../types';
const SUGESTOES_RAPIDAS = [{label:'Registrar ação',comando:'registrar'},{label:'Meus créditos',comando:'pontos'},{label:'Minhas cartas',comando:'cartas'},{label:'Meu nível',comando:'nivel'},{label:'Dica',comando:'dica'},{label:'Recompensas',comando:'recompensa'}];
export default function Chat() {
 const {data,getNivel}=useData(); const {getProgressoTotal}=useColecao(); const navigate=useNavigate();
 const {aberto,abrirChat,fecharChat}=useChat();
 const [mensagens,setMensagens]=useState<ChatMessage[]>([{texto:'Olá! Sou o RockySoul. Posso orientar você a enviar ações, consultar seus créditos e conhecer a coleção.',remetente:'bot'}]);
 const [input,setInput]=useState(''); const [mostrarTeaser,setMostrarTeaser]=useState(false); const aguardandoEntrada=false;
 const messagesEndRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{messagesEndRef.current?.scrollIntoView({behavior:'smooth'});},[mensagens]);
 useEffect(()=>{if(aberto)return;const timer=setTimeout(()=>setMostrarTeaser(true),2500);return ()=>clearTimeout(timer);},[aberto]);
 function marcarTeaserVisto(){setMostrarTeaser(false);}
 function abrirComTeaser(){marcarTeaserVisto();abrirChat();}
 function handleAcaoRapida(texto:string){
  const command=texto.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  let resposta='Posso ajudar com suas ações, créditos, coleção e dicas de sustentabilidade.';
  if(/registr|recicl|bicicl|planti|economiz/.test(command)){resposta='Escolha uma ação no Dashboard e envie sua foto. Os pontos dependem da aprovação da verificação.';navigate('/dashboard');}
  else if(/pix|convert|dinheiro|resgat/.test(command))resposta='Resgates e conversão em Pix ainda estão indisponíveis. Nenhum saldo foi alterado.';
  else if(/ponto|credito|saldo/.test(command))resposta=data.nome?`Seu saldo confirmado é de ${data.pontos} créditos.`:'Entre para consultar seu saldo.';
  else if(/carta|colecao/.test(command)){const p=getProgressoTotal();resposta=`Sua coleção tem ${p.obtidas}/${p.total} cartas nesta consulta. Veja os detalhes em Coleção.`;navigate('/colecao');}
  else if(/nivel/.test(command))resposta=`Seu nível é ${getNivel()}.`;
  else if(/dica|curiosidade/.test(command))resposta=CURIOSIDADES[new Date().getDate()%CURIOSIDADES.length];
  else if(/recompensa/.test(command)){resposta='Consulte o catálogo de recompensas. O resgate ainda não está disponível.';navigate('/recompensas');}
  setMensagens(prev=>[...prev,{texto,remetente:'user'},{texto:resposta,remetente:'bot'}]);setInput('');
 }
 function handleSubmit(e:FormEvent){e.preventDefault();if(input.trim())handleAcaoRapida(input.trim());}
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
            <button
              onClick={abrirChat}
              className="relative flex items-center gap-2.5 rounded-full bg-leaf hover:bg-leaf-soft hover:shadow-[0_0_30px_rgba(32,217,104,0.5)] transition-all px-4 py-3.5 text-[#063d25] font-semibold shadow-xl cursor-pointer"
              aria-label="Abrir chat"
            >
              <svg className="shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {aberto && (
        <div className="fixed bottom-6 right-6 z-50 card-secondary rounded-2xl shadow-2xl overflow-hidden flex flex-col w-[min(360px,calc(100vw-2rem))] h-110 max-h-[80vh] border border-[#20d968]/25">
          <div className="text-white p-4 flex items-center gap-3 shrink-0" style={{ background: 'linear-gradient(135deg, #063d25, #0b4a2c)' }}>
            <div className="w-10 h-10 rounded-full bg-leaf/25 flex items-center justify-center shrink-0">
              <img src="/imagens/logo.png" alt="" className="h-6 w-auto opacity-90" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif-display text-lg leading-tight">RockySoul</h3>
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
