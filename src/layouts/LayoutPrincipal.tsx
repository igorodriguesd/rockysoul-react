import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export function LayoutPrincipal() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 pb-8 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}