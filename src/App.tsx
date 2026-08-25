import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { ToastContainer } from './components/Toast';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Verificar from './pages/Verificar';
import Sobre from './pages/Sobre';
import Faq from './pages/Faq';
import Integrantes from './pages/Integrantes';
import Contato from './pages/Contato';
import Chat from './components/Chat';

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <div className="min-h-screen flex flex-col bg-[#f8fdf8]">
          <Sidebar />
          <main className="flex-1 md:ml-[240px]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/verificar" element={<Verificar />} />
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
      </DataProvider>
    </BrowserRouter>
  );
}
