import "./ChangeBars.css";

const W = 340;
const H = 232;
const TOP = 30;
const BOTTOM = 44;

/** Barras de variação em 24h (escala única). Altas em verde, quedas em vermelho: cor só onde há sentido. */
export default function ChangeBars({ items }) {
  const data = items.filter((i) => i.pct != null && Number.isFinite(i.pct));
  if (!data.length) return null;

  const max = Math.max(0, ...data.map((d) => d.pct));
  const min = Math.min(0, ...data.map((d) => d.pct));
  const range = max - min || 1;
  const plotH = H - TOP - BOTTOM;
  const base = TOP + (max / range) * plotH; // y do zero
  const slot = W / data.length;
  const bw = Math.min(26, slot - 10);

  return (
    <article className="bento-card change-bars">
      <header>
        <div>
          <h3>Variação em 24h</h3>
          <p>Moedas e criptos em destaque, mesma escala</p>
        </div>
        <span className="change-bars__legend">
          <i className="is-up" />
          alta
          <i className="is-down" />
          queda
        </span>
      </header>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Variação percentual em 24 horas por ativo"
      >
        <line x1="0" x2={W} y1={base} y2={base} className="change-bars__axis" />
        {data.map((d, i) => {
          const h = Math.max(3, (Math.abs(d.pct) / range) * plotH);
          const up = d.pct >= 0;
          const x = i * slot + (slot - bw) / 2;
          const y = up ? base - h : base;
          return (
            <g key={d.key} style={{ "--i": i }}>
              <rect
                className={`change-bars__bar ${up ? "is-up" : "is-down"}`}
                x={x}
                y={y}
                width={bw}
                height={h}
                rx="7"
              >
                <title>{`${d.code}: ${d.pct >= 0 ? "+" : ""}${d.pct.toFixed(2)}%`}</title>
              </rect>
              <text
                className="change-bars__val"
                x={x + bw / 2}
                y={up ? y - 6 : y + h + 13}
                textAnchor="middle"
              >
                {`${d.pct >= 0 ? "+" : ""}${d.pct.toFixed(1)}`}
              </text>
              <text
                className="change-bars__code"
                x={x + bw / 2}
                y={H - 14}
                textAnchor="middle"
              >
                {d.code}
              </text>
            </g>
          );
        })}
      </svg>
    </article>
  );
}
