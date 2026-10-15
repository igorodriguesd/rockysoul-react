import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OnboardingTutorial from '../components/OnboardingTutorial';

export function LayoutPrincipal() {
  const { pathname } = useLocation();
  const ehHome = pathname === '/';
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={ehHome ? 'relative z-10 flex-1 min-h-0' : 'flex-1 pt-24 pb-8 relative z-10'}>
        <Outlet />
      </main>
      {!ehHome && <Footer />}
      <OnboardingTutorial />
    </>
  );
}