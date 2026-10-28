import { AssetIcon } from "../../../common/Flag";
import PctText from "../../../common/PctText";
import Sparkline from "../../../dashboard/Sparkline";
import { useMarket } from "../../../../context/MarketContext";
import { formatBRL } from "../../../../utils/format";

export default function CriptoPreview() {
  const { crypto } = useMarket();
  return (
    <div className="pt__tableWrap">
      <table className="crypto-table">
        <thead><tr><th>#</th><th>Moeda</th><th className="r">Preço</th><th className="r">24h</th><th className="r">7d</th><th className="hide-sm">7 dias</th></tr></thead>
        <tbody>
          {crypto.slice(0, 7).map((c, i) => (
            <tr key={c.key}>
              <td className="muted">{c.rank}</td>
              <td><span className="crypto-table__coin"><AssetIcon asset={c} size={22} /><strong>{c.name}</strong><em>{c.code}</em></span></td>
              <td className="r mono">{formatBRL(c.brl)}</td>
              <td className="r mono"><PctText v={c.pct} /></td>
              <td className="r mono"><PctText v={c.pct7d} /></td>
              <td className="hide-sm"><Sparkline data={c.spark} up={(c.pct7d ?? c.pct) >= 0} delay={i * 50} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
