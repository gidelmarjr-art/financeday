import { useEffect, useState } from "react";
import "./StatTile.css";

/** Card pequeno de resumo: rótulo, valor grande, legenda e (opcional) barra que se preenche. */
export default function StatTile({ icon, label, value, sub, bar, onClick }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const Tag = onClick ? "button" : "div";
  return (
    <Tag className="bento-card stat-tile" onClick={onClick} type={onClick ? "button" : undefined}>
      <span className="stat-tile__label">{icon}{label}</span>
      <span className="stat-tile__value">{value}</span>
      {sub && <span className="stat-tile__sub">{sub}</span>}
      {bar != null && (
        <span className="stat-tile__track" aria-hidden="true">
          <i style={{ transform: `scaleX(${ready ? Math.max(0, Math.min(bar, 100)) / 100 : 0})` }} />
        </span>
      )}
    </Tag>
  );
}
