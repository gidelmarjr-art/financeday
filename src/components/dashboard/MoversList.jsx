import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatPct, formatBRL } from "../../utils/format";
import { AssetIcon } from "../common/Flag";
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
                <AssetIcon asset={a} size={18} />
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
