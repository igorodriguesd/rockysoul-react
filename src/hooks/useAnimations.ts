import { useEffect, useRef, useState } from 'react';

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('scroll-reveal-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export function useCounter(alvo: number, duracao = 1200) {
  const [valor, setValor] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const inicio = performance.now();
          const animate = (agora: number) => {
            const progresso = Math.min((agora - inicio) / duracao, 1);
            const eased = 1 - Math.pow(1 - progresso, 3);
            setValor(Math.round(eased * alvo));
            if (progresso < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [alvo, duracao]);

  return { ref, valor };
}
