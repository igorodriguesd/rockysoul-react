import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
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
import Chat from './components/Chat';

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <div className="bg-app min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 pt-24 pb-8 px-4 relative z-10">
            <div className="max-w-[1100px] mx-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/recompensas" element={<Recompensas />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/integrantes" element={<Integrantes />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
          </main>
          <Footer />
          <Chat />
          <ToastContainer />
        </div>
      </DataProvider>
    </BrowserRouter>
  );
}
