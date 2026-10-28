import { ArrowLeftRight } from "lucide-react";
import AssetChart from "../../../dashboard/AssetChart";
import CountValue from "../../../common/CountValue";
import Flag from "../../../common/Flag";
import { useMarket } from "../../../../context/MarketContext";
import { formatNumber } from "../../../../utils/format";

/** Exemplo do conversor: R$ 5,00 em dólar, com o histórico do par. */
export default function ConverterPreview() {
  const { byKey } = useMarket();
  const usd = byKey.USD;
  if (!usd) return null;
  const result = 5 / usd.brl;
  return (
    <div className="pt__converter">
      <div className="pt__convCard">
        <span className="pt__label">Valor</span>
        <div className="pt__amount">5</div>
        <div className="pt__pair">
          <span><Flag code="BRL" size={18} /> BRL</span>
          <ArrowLeftRight size={15} />
          <span><Flag code="USD" size={18} /> USD</span>
        </div>
        <div className="pt__result">
          <span>R$ 5,00 =</span>
          <strong><CountValue amount={result} from={0} format={(v) => `US$ ${formatNumber(v, 4)}`} /></strong>
          <em>1 USD = R$ {formatNumber(usd.brl, 4)}</em>
        </div>
      </div>
      <AssetChart asset={usd} />
    </div>
  );
}
