import { useId } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import RangeTabs from "./RangeTabs";
import { formatNumber, formatShortDate, formatPct } from "../../utils/format";
import "./PriceChart.css";

const line = "var(--color-line)";
const dim = "var(--color-text-dim)";
const tick = { fontFamily: "IBM Plex Mono, monospace", fontSize: 11, fill: dim };

/**
 * Gráfico de área genérico. `data` = [{ ts, v }].
 * A cor segue a tendência do período (verde se terminou acima do início).
 */
export default function PriceChart({
  title, subtitle, data, loading, estimated, days, onDays, prefix = "", suffix = "", decimals, height = 260,
}) {
  const gid = useId().replace(/:/g, "");
  const first = data[0]?.v;
  const last = data[data.length - 1]?.v;
  const change = first ? ((last - first) / first) * 100 : null;
  const color = change != null && change < 0 ? "var(--color-down)" : "var(--color-up)";
  const fmt = (n) => `${prefix}${formatNumber(n, decimals)}${suffix}`;

  return (
    <div className="price-chart">
      <div className="price-chart__head">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="price-chart__side">
          {change != null && (
            <span className={`price-chart__change ${change >= 0 ? "is-up" : "is-down"}`}>
              {formatPct(change)} no período
            </span>
          )}
          <RangeTabs value={days} onChange={onDays} />
        </div>
      </div>

      {estimated && !loading && (
        <p className="price-chart__warn">
          Não foi possível buscar o histórico real agora — série ilustrativa.
        </p>
      )}

      <div className="price-chart__canvas" style={{ height }}>
        {loading && <div className="price-chart__loading">carregando histórico…</div>}
        {!loading && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={line} strokeDasharray="3 5" vertical={false} />
              <XAxis
                dataKey="ts" type="number" scale="time" domain={["dataMin", "dataMax"]}
                tickFormatter={formatShortDate} tick={tick} axisLine={{ stroke: line }}
                tickLine={false} minTickGap={36}
              />
              <YAxis
                tick={tick} axisLine={false} tickLine={false} domain={["auto", "auto"]}
                width={72} tickFormatter={(n) => formatNumber(n, decimals)}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-panel-alt)", border: `1px solid ${line}`,
                  borderRadius: 8, fontFamily: "IBM Plex Mono, monospace", fontSize: 12,
                }}
                labelStyle={{ color: dim }}
                labelFormatter={(ts) => new Date(ts).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: days <= 30 ? "short" : undefined })}
                formatter={(v) => [fmt(v), "Cotação"]}
              />
              <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${gid})`} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
