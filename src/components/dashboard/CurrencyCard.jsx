import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import "./CurrencyCard.css";

export default function CurrencyCard({ currency, selected, onSelect }) {
  const { code, name, flag, value, pct, up } = currency;

  return (
    <button
      className={`currency-card ${selected ? "currency-card--selected" : ""}`}
      onClick={() => onSelect(code)}
      aria-pressed={selected}
    >
      <div className="currency-card__top">
        <div>
          <div className="currency-card__code">
            {flag} {code}
          </div>
          <div className="currency-card__name">{name}</div>
        </div>
        <div className={`currency-card__badge ${up ? "is-up" : "is-down"}`}>
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(pct).toFixed(2)}%
        </div>
      </div>
      <div className="currency-card__value">R$ {value}</div>
    </button>
  );
}
