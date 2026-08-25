import { useEffect, useRef } from 'react';

interface Props {
  labels: string[];
  series: { nome: string; dados: number[]; cor: string }[];
}

export default function HistoryChart({ labels, series }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const allValues = series.flatMap(s => s.dados);
    const maxVal = Math.max(...allValues, 1);
    const minVal = 0;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = '#9ca3af';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'right';
      const val = Math.round(maxVal - (maxVal - minVal) * (i / 4));
      ctx.fillText(String(val), padding.left - 8, y + 4);
    }

    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
      const x = padding.left + (chartW / (labels.length - 1)) * i;
      ctx.fillText(label, x, h - 8);
    });

    series.forEach(s => {
      ctx.strokeStyle = s.cor;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();

      s.dados.forEach((val, i) => {
        const x = padding.left + (chartW / (s.dados.length - 1)) * i;
        const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      s.dados.forEach((val, i) => {
        const x = padding.left + (chartW / (s.dados.length - 1)) * i;
        const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
        ctx.fillStyle = s.cor;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    const legendY = 10;
    let legendX = padding.left;
    ctx.font = '11px system-ui';
    series.forEach(s => {
      ctx.fillStyle = s.cor;
      ctx.fillRect(legendX, legendY, 12, 12);
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'left';
      ctx.fillText(s.nome, legendX + 16, legendY + 10);
      legendX += ctx.measureText(s.nome).width + 32;
    });
  }, [labels, series]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[220px]"
      style={{ display: 'block' }}
    />
  );
}
