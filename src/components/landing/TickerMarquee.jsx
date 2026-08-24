import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import "./TickerMarquee.css";

function TickerItem({ code, value, pct, up }) {
  return (
    <span className="ticker__item">
      <strong>{code}/BRL</strong>
      {value}
      <span className={up ? "is-up" : "is-down"}>
        {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {Math.abs(pct).toFixed(2)}%
      </span>
    </span>
  );
}

export default function TickerMarquee({ currencies }) {
  return (
    <div className="ticker">
      <div className="ticker__track">
        {[...currencies, ...currencies].map((c, i) => (
          <TickerItem key={`${c.code}-${i}`} {...c} />
        ))}
      </div>
    </div>
  );
}
