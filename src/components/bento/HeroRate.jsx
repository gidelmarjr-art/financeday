import { ArrowLeftRight } from "lucide-react";
import CountValue from "../common/CountValue";
import Pill from "../common/Pill";
import { AssetIcon } from "../common/Flag";
import { formatBRL, formatNumber, smartDecimals } from "../../utils/format";
import "./HeroRate.css";

/** Card principal: cotação do dólar em destaque + "carteiras" com as demais moedas. */
export default function HeroRate({ main, wallets, note, onConvert, onList }) {
  if (!main) return null;
  return (
    <article className="bento-card hero-rate">
      <header className="hero-rate__head">
        <span className="hero-rate__label">
          <AssetIcon asset={main} size={22} /> {main.name} · {main.code}/BRL
        </span>
        {main.live === false && (
          <span className="hero-rate__tag">ilustrativo</span>
        )}
      </header>

      <div className="hero-rate__value">
        <CountValue
          amount={main.value}
          format={(v) => formatBRL(v, smartDecimals(main.value))}
        />
        <Pill pct={main.pct} />
      </div>
      <p className="hero-rate__note">{note}</p>

      <div className="hero-rate__actions">
        <button className="btn btn--primary" onClick={onConvert}>
          <ArrowLeftRight size={15} /> Converter
        </button>
        <button className="btn btn--ghost" onClick={onList}>
          Ver moedas
        </button>
      </div>

      <div className="hero-rate__wallets">
        {wallets.map((w) => {
          const isBrl = w.code === "BRL";
          return (
            <div key={w.key} className="hero-rate__wallet">
              <span className="hero-rate__wcode">
                <AssetIcon asset={w} size={18} />
                {w.code}
              </span>
              <strong>
                <CountValue
                  amount={isBrl ? w.usdValue : w.value}
                  format={
                    isBrl
                      ? (v) => `US$ ${formatNumber(v, 4)}`
                      : (v) => formatBRL(v, smartDecimals(w.value))
                  }
                />
              </strong>
              <Pill pct={w.pct} />
            </div>
          );
        })}
      </div>
    </article>
  );
}
