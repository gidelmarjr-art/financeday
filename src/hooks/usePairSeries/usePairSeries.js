import { useMemo } from "react";
import { useSeriesMany } from "../useSeries";
import { toDailyGrid } from "../../services/historyService";

/** Histórico do par A/B (quanto vale 1 A em B), alinhado por dia. */
export function usePairSeries(a, b, days) {
  const same = !a || !b || a.key === b.key;
  const pair = useSeriesMany(same ? [] : [a, b], days);
  const out = useMemo(() => {
    if (same || pair.loading) return { points: [], estimated: false };
    const ra = pair.data[a.key];
    const rb = pair.data[b.key];
    if (!ra || !rb) return { points: [], estimated: false };
    const ga = toDailyGrid(ra.points, days);
    const gb = toDailyGrid(rb.points, days);
    return { points: ga.map((p, i) => ({ ts: p.ts, v: p.v / gb[i].v })), estimated: ra.estimated || rb.estimated };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [same, pair.loading, pair.data, a?.key, b?.key, days]);
  return { loading: pair.loading, ...out };
}
