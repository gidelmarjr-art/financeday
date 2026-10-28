import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useMarket } from "../../../context/MarketContext";
import { AssetIcon } from "../../common/Flag";
import { formatBRL, smartDecimals } from "../../../utils/format";
import "./TickerMarquee.css";

function Item({ a, hidden }) {
  const up = (a.pct ?? 0) >= 0;
  return (
    <span className="ticker__item" aria-hidden={hidden || undefined}>
      <AssetIcon asset={a} size={18} />
      <strong>{a.code}</strong>
      <span className="ticker__value">{formatBRL(a.value, smartDecimals(a.value))}</span>
      {a.pct != null && (
        <span className={up ? "is-up" : "is-down"}>
          {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(a.pct).toFixed(2)}%
        </span>
      )}
    </span>
  );
}

/** Faixa contínua de cotações reais (pausa ao passar o mouse). */
export default function TickerMarquee() {
  const { fiat, crypto } = useMarket();
  const items = [...fiat.slice(0, 12), ...crypto.slice(0, 8)];
  return (
    <section className="ticker" aria-label="Cotações em reais">
      <div className="ticker__track">
        {[0, 1].map((n) => (
          <div className="ticker__group" key={n}>
            {items.map((a) => <Item key={`${n}-${a.key}`} a={a} hidden={n === 1} />)}
          </div>
        ))}
      </div>
    </section>
  );
}
