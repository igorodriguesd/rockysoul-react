import { useEffect } from 'react';

/** Keeps mobile overlays inside the visible area when the keyboard opens. */
export function useMobileViewport() {
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const viewport = window.visualViewport;
    const style = document.documentElement.style;
    const clear = () => {
      style.removeProperty('--mobile-viewport-height');
      style.removeProperty('--mobile-viewport-top');
    };
    const update = () => {
      if (!media.matches) { clear(); return; }
      style.setProperty('--mobile-viewport-height', `${viewport?.height ?? window.innerHeight}px`);
      style.setProperty('--mobile-viewport-top', `${viewport?.offsetTop ?? 0}px`);
    };
    update();
    media.addEventListener('change', update);
    window.addEventListener('resize', update);
    viewport?.addEventListener('resize', update);
    viewport?.addEventListener('scroll', update);
    return () => {
      media.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      viewport?.removeEventListener('resize', update);
      viewport?.removeEventListener('scroll', update);
      clear();
    };
  }, []);
}
