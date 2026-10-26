import { useEffect, useState } from "react";
import { getSeries } from "../services/historyService";

/** Séries (BRL) de vários ativos para `days` dias. Ignora respostas obsoletas. */
export function useSeriesMany(assets, days) {
  const [state, setState] = useState({ loading: true, data: {} });
  const sig = assets.map((a) => `${a.key}:${a.live}`).join("|") + `@${days}`;

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));
    Promise.all(assets.map((a) => getSeries(a, days).then((r) => [a.key, r]))).then((pairs) => {
      if (!cancelled) setState({ loading: false, data: Object.fromEntries(pairs) });
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  return state;
}

export function useSeries(asset, days) {
  const { loading, data } = useSeriesMany(asset ? [asset] : [], days);
  const r = asset ? data[asset.key] : null;
  return { loading, points: r?.points ?? [], estimated: r?.estimated ?? false };
}
