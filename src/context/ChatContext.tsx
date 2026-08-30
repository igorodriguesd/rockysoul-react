import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ChatContextType {
  aberto: boolean;
  abrirChat: () => void;
  fecharChat: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false);

  const abrirChat = useCallback(() => setAberto(true), []);
  const fecharChat = useCallback(() => setAberto(false), []);

  return (
    <ChatContext.Provider value={{ aberto, abrirChat, fecharChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat deve ser usado dentro de um ChatProvider');
  return context;
}