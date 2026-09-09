import { Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { CollectionProvider } from './context/CollectionContext';
import { ChatProvider } from './context/ChatContext';
import { LayoutPrincipal } from './layouts/LayoutPrincipal';
import { ToastContainer } from './components/Toast';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Solucao } from './pages/Solucao';
import { Recompensas } from './pages/Recompensas';
import { RecompensaDetalhe } from './pages/RecompensaDetalhe';
import { Sobre } from './pages/Sobre';
import { Faq } from './pages/Faq';
import { Integrantes } from './pages/Integrantes';
import { Contato } from './pages/Contato';
import { Colecao } from './pages/Colecao';
import { PaginaNaoEncontrada } from './pages/PaginaNaoEncontrada';
import Chat from './components/Chat';

export default function App() {
  const ehModoPrint = new URLSearchParams(window.location.search).has('print');

  return (
    <DataProvider>
      <CollectionProvider>
        <ChatProvider>
          <div className="bg-app min-h-screen flex flex-col">
            <Routes>
              <Route element={<LayoutPrincipal />}>
                <Route index element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="colecao" element={<Colecao />} />
                <Route path="solucao" element={<Solucao />} />
                <Route path="recompensas" element={<Recompensas />} />
                <Route path="recompensas/:id" element={<RecompensaDetalhe />} />
                <Route path="sobre" element={<Sobre />} />
                <Route path="faq" element={<Faq />} />
                <Route path="integrantes" element={<Integrantes />} />
                <Route path="contato" element={<Contato />} />
                <Route path="*" element={<PaginaNaoEncontrada />} />
              </Route>
            </Routes>
            {!ehModoPrint && <Chat />}
            <ToastContainer />
          </div>
        </ChatProvider>
      </CollectionProvider>
    </DataProvider>
  );
}