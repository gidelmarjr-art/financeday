import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Flag from "../common/Flag";
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
            <Flag code={code} fallback={flag} size={18} /> {code}
          </div>
          <div className="currency-card__name">
            {name}
            {currency.live === false && <em className="currency-card__tag">ilustrativo</em>}
          </div>
        </div>
        <div className={`currency-card__badge ${up ? "is-up" : "is-down"}`}>
          {pct == null ? "—" : (
            <>
              {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(pct).toFixed(2)}%
            </>
          )}
        </div>
      </div>
      <div className="currency-card__value">R$ {value}</div>
    </button>
  );
}
