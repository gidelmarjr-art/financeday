import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import "./CurrencyChart.css";

// SVG aceita var(--...) em atributos de apresentação, então o gráfico
// herda as cores direto dos tokens definidos em styles/tokens.css.
const gold = "var(--color-gold)";
const line = "var(--color-line)";
const dim = "var(--color-text-dim)";
const panelAlt = "var(--color-panel-alt)";

/**
 * `getHistory(code)` deve devolver um array de números (série de 7 dias)
 * para QUALQUER código — inclusive moedas fora de `quickPicks`. É assim
 * que clicar em qualquer CurrencyCard atualiza o gráfico, não só os
 * atalhos fixos.
 */
export default function CurrencyChart({ getHistory, selected, quickPicks, onSelect }) {
  const series = getHistory(selected);
  const data = series.map((v, i) => ({
    day: `D-${series.length - 1 - i}`,
    valor: v,
  }));

  return (
    <div className="currency-chart">
      <div className="currency-chart__head">
        <h3>Histórico · {selected}/BRL</h3>
        <div className="currency-chart__tabs">
          {quickPicks.map((code) => (
            <button
              key={code}
              className={`currency-chart__tab ${code === selected ? "is-active" : ""}`}
              onClick={() => onSelect(code)}
            >
              {code}
            </button>
          ))}
        </div>
      </div>
      <p className="currency-chart__hint">
        Dica: clique em qualquer moeda na lista acima para ver o histórico dela aqui.
      </p>

      <div className="currency-chart__canvas">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gold} stopOpacity={0.35} />
                <stop offset="100%" stopColor={gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={line} strokeDasharray="3 5" vertical={false} />
            <XAxis
              dataKey="day"
              stroke={dim}
              tick={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, fill: dim }}
              axisLine={{ stroke: line }}
              tickLine={false}
            />
            <YAxis
              stroke={dim}
              tick={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, fill: dim }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
              width={56}
            />
            <Tooltip
              contentStyle={{
                background: panelAlt,
                border: `1px solid ${line}`,
                borderRadius: 8,
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 12,
              }}
              labelStyle={{ color: dim }}
              itemStyle={{ color: gold }}
            />
            <Area type="monotone" dataKey="valor" stroke={gold} strokeWidth={2} fill="url(#fillGold)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
