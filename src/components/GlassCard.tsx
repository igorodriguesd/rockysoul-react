import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40 ${className}`}>
      {children}
    </div>
  );
}