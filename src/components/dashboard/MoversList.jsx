import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatPct, formatBRL } from "../../utils/format";
import "./MoversList.css";

export default function MoversList({ title, items, onSelect }) {
  return (
    <div className="movers">
      <h3>{title}</h3>
      <ul>
        {items.map((a) => (
          <li key={a.key}>
            <button onClick={() => onSelect?.(a)}>
              <span className="movers__name">
                {a.kind === "crypto" && a.image ? <img src={a.image} alt="" width="18" height="18" /> : <b>{a.flag}</b>}
                <strong>{a.code}</strong>
                <em>{formatBRL(a.value)}</em>
              </span>
              <span className={`movers__pct ${a.pct >= 0 ? "is-up" : "is-down"}`}>
                {a.pct >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {formatPct(Math.abs(a.pct), false)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
