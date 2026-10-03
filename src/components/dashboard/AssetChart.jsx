import { useState } from "react";
import PriceChart from "./PriceChart";
import { useSeries } from "../../hooks/useSeries";
import { smartDecimals } from "../../utils/format";

/** Gráfico de 1 ativo em BRL, conectado ao histórico real. */
export default function AssetChart({ asset }) {
  const [days, setDays] = useState(30);
  const { loading, points, estimated } = useSeries(asset, days);
  const unit = asset.unit ?? 1;
  const data = points.map((p) => ({ ts: p.ts, v: p.v * unit }));
  const label = unit > 1 ? ` (${unit} un.)` : "";
  return (
    <PriceChart
      title={`Histórico · ${asset.code}/BRL${label}`}
      subtitle={asset.name}
      data={data} loading={loading} estimated={estimated}
      days={days} onDays={setDays} prefix="R$ "
      decimals={smartDecimals(asset.value)}
    />
  );
}
