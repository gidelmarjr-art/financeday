import { useEffect, useMemo, useState } from "react";
import { useSeriesMany } from "./useSeries";
import { prefetchEcb, toDailyGrid } from "../services/historyService";

const DAYS = 30;

/**
 * Tendência de cada moeda nos últimos 30 dias, a partir do histórico real:
 * { [code]: { spark, pct7d, pct30d, high, low } }.
 * Séries ilustrativas (API fora do ar) ficam de fora — melhor "—" do que número inventado.
 */
export function useFiatTrends(fiat) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    prefetchEcb(DAYS).catch(() => {}).finally(() => !cancelled && setReady(true));
    return () => { cancelled = true; };
  }, []);

  const { loading, data } = useSeriesMany(ready ? fiat : [], DAYS);

  const trends = useMemo(() => {
    const out = {};
    fiat.forEach((c) => {
      const r = data[c.key];
      if (!r || r.estimated || !r.points.length) return;
      const g = toDailyGrid(r.points, DAYS).map((p) => p.v * c.unit);
      const last = g[g.length - 1];
      const pct = (from) => (from ? (last / from - 1) * 100 : null);
      out[c.code] = {
        spark: g,
        pct7d: pct(g[g.length - 8]),
        pct30d: pct(g[0]),
        high: Math.max(...g),
        low: Math.min(...g),
      };
    });
    return out;
  }, [data, fiat]);

  return { trends, loading: !ready || loading };
}
