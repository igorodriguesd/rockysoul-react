import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { ChatProvider } from './context/ChatContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from './components/Toast';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Sobre from './pages/Sobre';
import Faq from './pages/Faq';
import Integrantes from './pages/Integrantes';
import Contato from './pages/Contato';
import Recompensas from './pages/Recompensas';
import RecompensaDetalhe from './pages/RecompensaDetalhe';
import Solucao from './pages/Solucao';
import Chat from './components/Chat';

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <ChatProvider>
          <div className="bg-app min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-8 relative z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/solucao" element={<Solucao />} />
                <Route path="/recompensas" element={<Recompensas />} />
                <Route path="/recompensas/:id" element={<RecompensaDetalhe />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/integrantes" element={<Integrantes />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
            <Chat />
            <ToastContainer />
          </div>
        </ChatProvider>
      </DataProvider>
    </BrowserRouter>
  );
}