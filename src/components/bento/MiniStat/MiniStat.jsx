import CountValue from "../../common/CountValue";
import Pill from "../../common/Pill";
import { AssetIcon } from "../../common/Flag";
import Sparkline from "../../dashboard/Sparkline";
import { formatBRL, smartDecimals } from "../../../utils/format";
import "./MiniStat.css";

export default function MiniStat({ asset, onOpen, delay = 0 }) {
  if (!asset) return null;
  return (
    <button type="button" className="bento-card mini-stat" onClick={onOpen}>
      <header>
        <AssetIcon asset={asset} size={22} />
        <span>{asset.name}</span>
      </header>
      <div className="mini-stat__value">
        <CountValue
          amount={asset.value}
          format={(v) => formatBRL(v, smartDecimals(asset.value))}
        />
      </div>
      <Pill pct={asset.pct} />
      <div className="mini-stat__spark">
        <Sparkline
          data={asset.spark}
          up={(asset.pct7d ?? asset.pct ?? 0) >= 0}
          width={150}
          height={30}
          fluid
          delay={delay}
        />
      </div>
    </button>
  );
}
