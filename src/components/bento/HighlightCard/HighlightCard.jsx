import { Bitcoin } from "lucide-react";
import CountValue from "../../common/CountValue";
import Pill from "../../common/Pill";
import Sparkline from "../../dashboard/Sparkline";
import { formatBRL, smartDecimals } from "../../../utils/format";
import "./HighlightCard.css";

/** Card em destaque (gradiente dourado): o ativo principal, com tendência de 7 dias. */
export default function HighlightCard({ asset, onOpen }) {
  if (!asset) return null;
  return (
    <button type="button" className="bento-card highlight" onClick={onOpen}>
      <span className="highlight__glow" aria-hidden="true" />
      <header className="highlight__head">
        <span className="highlight__icon">
          <Bitcoin size={17} />
        </span>
        <span>
          {asset.name} · {asset.code}
        </span>
      </header>
      <div className="highlight__value">
        <CountValue
          amount={asset.value}
          format={(v) => formatBRL(v, smartDecimals(asset.value))}
        />
      </div>
      <div className="highlight__row">
        <Pill pct={asset.pct} className="pill--onGold" />
        <span className="highlight__cap">em 24h</span>
      </div>
      <div className="highlight__spark">
        <Sparkline
          data={asset.spark}
          up
          width={260}
          height={52}
          color="#1a1304"
          fluid
          delay={300}
        />
        <span>últimos 7 dias</span>
      </div>
    </button>
  );
}
