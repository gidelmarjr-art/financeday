import HighlightCard from "../../../bento/HighlightCard";
import ChangeBars from "../../../bento/ChangeBars";
import BreadthCard from "../../../bento/BreadthCard";
import { useMarket } from "../../../../context/MarketContext";
import { OVERVIEW_FIAT, OVERVIEW_CRYPTO } from "../../../../data/catalog";

/** Visão geral em miniatura: mesmos componentes e dados do painel. */
export default function OverviewPreview() {
  const { byKey, brl, fiat, crypto } = useMarket();
  const fiatPicks = OVERVIEW_FIAT.map((c) => byKey[c]).filter(Boolean);
  const cryptoPicks = OVERVIEW_CRYPTO.map((id) => byKey[`crypto:${id}`]).filter(Boolean);
  return (
    <div className="pt__overview">
      <HighlightCard asset={cryptoPicks[0]} />
      <ChangeBars items={[...fiatPicks, brl, ...cryptoPicks]} />
      <BreadthCard fiat={fiat} crypto={crypto} />
    </div>
  );
}
