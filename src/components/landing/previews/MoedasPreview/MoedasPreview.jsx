import Flag from "../../../common/Flag";
import PctText from "../../../common/PctText";
import Sparkline from "../../../dashboard/Sparkline";
import { useMarket } from "../../../../context/MarketContext";
import { useFiatTrends } from "../../../../hooks/useFiatTrends";
import { formatNumber } from "../../../../utils/format";

const PICKS = ["USD", "EUR", "GBP", "CAD", "CHF", "JPY", "AUD"];

export default function MoedasPreview() {
  const { fiat, byKey } = useMarket();
  const { trends, loading } = useFiatTrends(fiat);
  const rows = PICKS.map((c) => byKey[c]).filter(Boolean);
  return (
    <div className="pt__tableWrap">
      <table className="crypto-table">
        <thead><tr><th>Moeda</th><th className="r">Cotação</th><th className="r">24h</th><th className="r">7d</th><th className="hide-sm">30 dias</th></tr></thead>
        <tbody>
          {rows.map((c, i) => {
            const t = trends[c.code];
            return (
              <tr key={c.key}>
                <td><span className="crypto-table__coin"><Flag code={c.code} fallback={c.flag} size={22} /><strong>{c.unit > 1 ? `${c.name} (${c.unit})` : c.name}</strong><em>{c.code}</em></span></td>
                <td className="r mono">R$ {formatNumber(c.value, 4)}</td>
                <td className="r mono"><PctText v={c.pct} /></td>
                <td className="r mono">{loading ? <i className="shimmer shimmer--pill" /> : <PctText v={t?.pct7d} />}</td>
                <td className="hide-sm"><Sparkline data={t?.spark} up={(t?.pct30d ?? c.pct ?? 0) >= 0} delay={i * 50} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
