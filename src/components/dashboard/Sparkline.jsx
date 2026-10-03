/** Mini-gráfico em SVG puro (sem recharts) para tabelas. */
export default function Sparkline({ data, up, width = 110, height = 32 }) {
  if (!data || data.length < 2) return <span className="muted">—</span>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data
    .map((v, i) => `${(i * step).toFixed(1)},${(height - 2 - ((v - min) / span) * (height - 4)).toFixed(1)}`)
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline
        points={pts} fill="none" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"
        stroke={up ? "var(--color-up)" : "var(--color-down)"}
      />
    </svg>
  );
}
