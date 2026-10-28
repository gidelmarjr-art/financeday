import "./Sparkline.css";

/** Mini-gráfico em SVG puro; a linha se desenha (stroke-dashoffset) ao montar. */
export default function Sparkline({ data, up, width = 110, height = 32, delay = 0, color, fluid = false }) {
  if (!data || data.length < 2) return <span className="muted">—</span>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data
    .map((v, i) => `${(i * step).toFixed(1)},${(height - 2 - ((v - min) / span) * (height - 4)).toFixed(1)}`)
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true"
      style={fluid ? { width: "100%", height: "auto", maxWidth: width, display: "block" } : undefined}>
      <polyline
        className="spark__line" pathLength="1" points={pts} fill="none" strokeWidth="1.6"
        strokeLinejoin="round" strokeLinecap="round" style={{ animationDelay: `${delay}ms` }}
        stroke={color ?? (up ? "var(--color-up)" : "var(--color-down)")}
      />
    </svg>
  );
}
