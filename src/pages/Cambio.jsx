import { useMemo, useState } from "react";
import { ArrowLeftRight, Repeat, TrendingUp, TrendingDown } from "lucide-react";
import AssetCombobox from "../components/dashboard/AssetCombobox";
import StatCard from "../components/dashboard/StatCard";
import PriceChart from "../components/dashboard/PriceChart";
import { useMarket } from "../context/MarketContext";
import { useSeriesMany } from "../hooks/useSeries";
import { toDailyGrid } from "../services/historyService";
import { formatNumber, smartDecimals } from "../utils/format";
import "./Cambio.css";

const QUICK = [
  ["BRL", "USD"], ["USD", "BRL"], ["EUR", "BRL"], ["GBP", "BRL"], ["BRL", "crypto:bitcoin"], ["crypto:bitcoin", "BRL"],
];

// "1.234,56" / "1234.56" / "5" -> número
function parseAmount(str) {
  const s = String(str).trim();
  if (!s) return NaN;
  const normalized = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  return Number(normalized);
}

export default function Cambio() {
  const { fiat, crypto, brl, byKey } = useMarket();
  const [from, setFrom] = useState("BRL");
  const [to, setTo] = useState("USD");
  const [amountText, setAmountText] = useState("5");
  const [days, setDays] = useState(30);

  const fiatOptions = useMemo(() => [brl, ...fiat], [brl, fiat]);
  const a = byKey[from];
  const b = byKey[to];
  const amount = parseAmount(amountText);

  // cotação "por 1 unidade" de cada ativo (JPY entra por 1 iene, não ¥100)
  const rate = a && b ? a.brl / b.brl : null;
  const result = rate != null && Number.isFinite(amount) ? amount * rate : null;

  const swap = () => { setFrom(to); setTo(from); };

  const pair = useSeriesMany(a && b && a.key !== b.key ? [a, b] : [], days);
  const pairData = useMemo(() => {
    if (pair.loading || !a || !b || a.key === b.key) return { points: [], estimated: false };
    const ra = pair.data[a.key];
    const rb = pair.data[b.key];
    if (!ra || !rb) return { points: [], estimated: false };
    const ga = toDailyGrid(ra.points, days);
    const gb = toDailyGrid(rb.points, days);
    return { points: ga.map((p, i) => ({ ts: p.ts, v: p.v / gb[i].v })), estimated: ra.estimated || rb.estimated };
  }, [pair, a, b, days]);

  const dec = rate != null ? smartDecimals(rate) : 4;

  const stats = useMemo(() => {
    const vs = pairData.points.map((p) => p.v);
    if (!vs.length) return null;
    const first = vs[0];
    const last = vs[vs.length - 1];
    return { high: Math.max(...vs), low: Math.min(...vs), change: first ? (last / first - 1) * 100 : null };
  }, [pairData]);
  const samePair = a && b && a.key === b.key;

  return (
    <div className="cambio">
      <header className="cambio__head">
        <span className="section-eyebrow">Câmbio</span>
        <h1>Conversor de moedas</h1>
        <p>Escolha duas moedas (ou criptomoedas) e veja quanto vale o valor informado, com o histórico do par.</p>
      </header>

      <div className="cambio__layout">
      <section className="cambio__card">
        <label className="cambio__amount">
          <span>Valor</span>
          <input
            inputMode="decimal" value={amountText} onChange={(e) => setAmountText(e.target.value)}
            placeholder="0,00" aria-invalid={!Number.isFinite(amount)}
          />
        </label>

        <div className="cambio__pair">
          <AssetCombobox id="from" label="De" value={from} onChange={setFrom} fiat={fiatOptions} crypto={crypto} />
          <button className="cambio__swap" onClick={swap} aria-label="Inverter moedas" title="Inverter">
            <ArrowLeftRight size={18} />
          </button>
          <AssetCombobox id="to" label="Para" value={to} onChange={setTo} fiat={fiatOptions} crypto={crypto} />
        </div>

        <div className="cambio__result" aria-live="polite">
          {result == null ? (
            <span className="cambio__hint">Digite um valor válido para converter.</span>
          ) : (
            <>
              <span className="cambio__from">{formatNumber(amount)} {a.code} =</span>
              <strong>{formatNumber(result)} <em>{b.code}</em></strong>
              <span className="cambio__rate">
                1 {a.code} = {formatNumber(rate, dec)} {b.code} · 1 {b.code} = {formatNumber(1 / rate, smartDecimals(1 / rate))} {a.code}
              </span>
              {(a.live === false || b.live === false) && (
                <span className="cambio__rate">Uma das cotações é ilustrativa (API indisponível).</span>
              )}
            </>
          )}
        </div>

        <div className="cambio__quick">
          {QUICK.map(([f, t]) => (
            <button key={`${f}-${t}`} onClick={() => { setFrom(f); setTo(t); }}
              className={from === f && to === t ? "is-active" : ""}>
              {byKey[f]?.code} → {byKey[t]?.code}
            </button>
          ))}
        </div>
      </section>

      <div className="cambio__side">
        {samePair && <p className="cambio__note">Escolha duas moedas diferentes para ver o histórico do par.</p>}
        {a && b && !samePair && (
          <>
            <div className="cambio__stats">
              <StatCard icon={<ArrowLeftRight size={16} />} label={`1 ${a.code} em ${b.code}`}
                value={formatNumber(rate, dec)} pct={stats?.change} caption={`Variação em ${days} dias`} />
              <StatCard icon={<Repeat size={16} />} label={`1 ${b.code} em ${a.code}`}
                value={formatNumber(1 / rate, smartDecimals(1 / rate))} caption="Cotação inversa" />
              <StatCard icon={<TrendingUp size={16} />} label="Máxima do período"
                value={stats ? formatNumber(stats.high, dec) : "—"} caption={`${a.code}/${b.code}`} />
              <StatCard icon={<TrendingDown size={16} />} label="Mínima do período"
                value={stats ? formatNumber(stats.low, dec) : "—"} caption={`${a.code}/${b.code}`} />
            </div>
            <PriceChart
              title={`Histórico · ${a.code}/${b.code}`}
              subtitle={`Quanto vale 1 ${a.code} em ${b.code} ao longo do tempo`}
              data={pairData.points} loading={pair.loading} estimated={pairData.estimated}
              days={days} onDays={setDays} decimals={dec}
            />
          </>
        )}
      </div>
      </div>
    </div>
  );
}
