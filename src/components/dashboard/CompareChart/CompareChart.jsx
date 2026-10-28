import { useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useSeriesMany } from "../../../hooks/useSeries";
import { toDailyGrid } from "../../../services/historyService";
import { formatShortDate, formatPct } from "../../../utils/format";
import "./CompareChart.css";

export const SERIES_COLORS = [
  "#d4a94f",
  "#5b8def",
  "#3fb68b",
  "#b27df0",
  "#e2604f",
  "#4fc3d9",
  "#f0a35b",
];
const line = "var(--color-line)";
const dim = "var(--color-text-dim)";
const tick = {
  fontFamily: "IBM Plex Mono, monospace",
  fontSize: 11,
  fill: dim,
};

/** Variação % acumulada de vários ativos desde o início do período (base 0%). */
const reduced = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function CompareChart({
  assets,
  days,
  focus,
  onFocus,
  notBefore = 0,
}) {
  const [hidden, setHidden] = useState(() => new Set());
  const { loading, data } = useSeriesMany(assets, days);
  // As cotações atualizam a cada 60s e geram novos objetos; só recalculamos (e
  // reanimamos) quando as séries ou o período de fato mudam.
  const assetsRef = useRef(assets);
  assetsRef.current = assets;
  const sig = assets.map((a) => a.key).join("|");

  const { rows, estimatedAny } = useMemo(() => {
    const assets = assetsRef.current;
    if (loading || !assets.length) return { rows: [], estimatedAny: false };
    const grids = {};
    let est = false;
    assets.forEach((a) => {
      const r = data[a.key];
      if (!r) return;
      est = est || r.estimated;
      grids[a.key] = toDailyGrid(r.points, days);
    });
    const keys = Object.keys(grids);
    if (!keys.length) return { rows: [], estimatedAny: est };
    const rows = grids[keys[0]].map((p, i) => {
      const row = { ts: p.ts };
      keys.forEach((k) => {
        const base = grids[k][0].v;
        row[k] = base ? (grids[k][i].v / base - 1) * 100 : 0;
      });
      return row;
    });
    return { rows, estimatedAny: est };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, data, sig, days]);

  const toggle = (key) =>
    setHidden((h) => {
      const n = new Set(h);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });

  return (
    <div className="compare-chart">
      <div className="compare-chart__legend">
        {assets.map((a, i) => (
          <button
            key={a.key}
            className={`compare-chart__chip ${hidden.has(a.key) ? "is-off" : ""} ${focus === a.key ? "is-focus" : ""}`}
            onClick={() => toggle(a.key)}
            onMouseEnter={() => onFocus?.(a.key)}
            onMouseLeave={() => onFocus?.(null)}
          >
            <i
              style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }}
            />
            {a.code}
          </button>
        ))}
        {estimatedAny && !loading && (
          <span className="compare-chart__warn">
            algumas séries são ilustrativas (sem resposta da API)
          </span>
        )}
      </div>

      <div className="compare-chart__canvas">
        {loading && (
          <div
            className="shimmer compare-chart__skeleton"
            role="status"
            aria-label="Carregando histórico"
          />
        )}
        {!loading && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={rows}
              margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                stroke={line}
                strokeDasharray="3 5"
                vertical={false}
              />
              <XAxis
                dataKey="ts"
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                tickFormatter={formatShortDate}
                tick={tick}
                axisLine={{ stroke: line }}
                tickLine={false}
                minTickGap={36}
              />
              <YAxis
                tick={tick}
                axisLine={false}
                tickLine={false}
                width={56}
                tickFormatter={(n) => `${n.toFixed(0)}%`}
              />
              <ReferenceLine y={0} stroke={dim} strokeDasharray="2 4" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-panel-alt)",
                  border: `1px solid ${line}`,
                  borderRadius: 8,
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 12,
                }}
                labelStyle={{ color: dim }}
                labelFormatter={(ts) =>
                  new Date(ts).toLocaleDateString("pt-BR")
                }
                formatter={(v, name) => [formatPct(v), name]}
              />
              {assets.map((a, i) =>
                hidden.has(a.key) ? null : (
                  <Line
                    key={a.key}
                    type="monotone"
                    dataKey={a.key}
                    name={a.code}
                    dot={false}
                    stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                    strokeWidth={focus && focus !== a.key ? 1.2 : 2}
                    strokeOpacity={focus && focus !== a.key ? 0.35 : 1}
                    isAnimationActive={!reduced()}
                    animationDuration={1300}
                    animationEasing="ease-out"
                    animationBegin={Math.max(0, notBefore - Date.now())}
                  />
                ),
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
