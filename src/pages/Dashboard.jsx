import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Banknote, Euro, PoundSterling, DollarSign, Bitcoin, Coins, CircleDollarSign } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import CompareChart from "../components/dashboard/CompareChart";
import RangeTabs, { RANGES } from "../components/dashboard/RangeTabs";
import MoversList from "../components/dashboard/MoversList";
import AiInsights from "../components/dashboard/AiInsights";
import { useMarket } from "../context/MarketContext";
import { OVERVIEW_FIAT, OVERVIEW_CRYPTO } from "../data/catalog";
import { formatNumber, formatBRL } from "../utils/format";
import { formatAsOfDate } from "../utils/liveData";
import { buildInsights } from "../utils/insights";
import "./Dashboard.css";

const ICONS = { USD: DollarSign, EUR: Euro, GBP: PoundSterling, CAD: CircleDollarSign, BRL: Banknote };
const OVERVIEW_RANGES = RANGES.filter((r) => r.days <= 90);

export default function Dashboard() {
  const { fiat, crypto, brl, byKey, asOf, fiatStatus, cryptoStatus } = useMarket();
  const navigate = useNavigate();
  const [group, setGroup] = useState("fiat");
  const [days, setDays] = useState(30);
  const [focus, setFocus] = useState(null);

  const fiatPicks = OVERVIEW_FIAT.map((c) => byKey[c]).filter(Boolean);
  const cryptoPicks = OVERVIEW_CRYPTO.map((id) => byKey[`crypto:${id}`]).filter(Boolean);
  const chartAssets = group === "fiat" ? fiatPicks : cryptoPicks;

  const movers = useMemo(() => {
    const all = [...fiat, ...crypto].filter((a) => a.pct != null && a.key !== "KWD");
    const sorted = [...all].sort((a, b) => b.pct - a.pct);
    return { up: sorted.slice(0, 5), down: sorted.slice(-5).reverse() };
  }, [fiat, crypto]);

  const insights = useMemo(() => buildInsights(fiat, crypto), [fiat, crypto]);
  const open = (a) => navigate(a.kind === "crypto" ? "/dashboard/criptomoedas" : "/dashboard/moedas", { state: { select: a.key } });

  // Ordem pedida: USD, EUR, GBP, BRL, CAD + BTC e outras 2 criptos.
  const cards = [
    byKey.USD && { a: byKey.USD, label: "Dólar Americano", icon: ICONS.USD },
    byKey.EUR && { a: byKey.EUR, label: "Euro", icon: ICONS.EUR },
    byKey.GBP && { a: byKey.GBP, label: "Libra Esterlina", icon: ICONS.GBP },
    { a: brl, label: "Real Brasileiro", icon: ICONS.BRL, isBrl: true },
    byKey.CAD && { a: byKey.CAD, label: "Dólar Canadense", icon: ICONS.CAD },
    ...cryptoPicks.map((a) => ({ a, label: a.name, icon: a.code === "BTC" ? Bitcoin : Coins })),
  ].filter(Boolean);

  return (
    <div className="dash">
      <header className="dash__intro">
        <div>
          <span className="section-eyebrow">Visão geral</span>
          <h1>Mercado agora</h1>
        </div>
        <div className="dash__status">
          {fiatStatus === "error" && <p className="dash__warn">Câmbio ao vivo indisponível — mostrando dados ilustrativos.</p>}
          {cryptoStatus === "error" && <p className="dash__warn">Criptos ao vivo indisponíveis (limite da API) — dados ilustrativos.</p>}
          {fiatStatus === "success" && asOf && (
            <p className="dash__asof">Moedas: referência do BCE de {formatAsOfDate(asOf)} · Criptos: atualizadas a cada 60s</p>
          )}
        </div>
      </header>

      <section className="dash__kpis" aria-label="Cotações em destaque">
        {cards.map(({ a, label, icon: Icon, isBrl }) => (
          <StatCard
            key={a.key}
            icon={<Icon size={16} />}
            label={`${a.code} · ${label}`}
            value={isBrl ? `US$ ${formatNumber(a.usdValue, 4)}` : formatBRL(a.value)}
            pct={a.pct}
            tag={a.live === false ? "ilustrativo" : null}
            caption={isBrl ? `1 dólar = ${formatBRL(byKey.USD?.value, 4)}` : a.kind === "crypto" ? "Variação em 24h" : "Variação vs. referência anterior"}
            active={focus === a.key}
            onClick={() => (isBrl ? navigate("/dashboard/cambio") : setFocus((f) => (f === a.key ? null : a.key)))}
          />
        ))}
      </section>

      <section className="panel">
        <div className="panel__head">
          <div>
            <h2>Desempenho comparado</h2>
            <p>Variação acumulada em % desde o início do período, frente ao real.</p>
          </div>
          <div className="panel__controls">
            <div className="seg">
              <button className={group === "fiat" ? "is-active" : ""} onClick={() => setGroup("fiat")}>Moedas</button>
              <button className={group === "crypto" ? "is-active" : ""} onClick={() => setGroup("crypto")}>Criptomoedas</button>
            </div>
            <RangeTabs value={days} onChange={setDays} ranges={OVERVIEW_RANGES} />
            <button className="btn btn--ghost dash__cta" onClick={() => navigate("/dashboard/cambio")}>Converter valores</button>
          </div>
        </div>
        <CompareChart key={group} assets={chartAssets} days={days} focus={focus} onFocus={setFocus} />
      </section>

      <section className="dash__grid">
        <MoversList title="Maiores altas · 24h" items={movers.up} onSelect={open} />
        <MoversList title="Maiores quedas · 24h" items={movers.down} onSelect={open} />
        <AiInsights insights={insights} />
      </section>

      <footer className="dashboard-page__footer">
        fontes: Frankfurter (BCE) · open.er-api.com · CoinGecko · FinanceDay © 2026
      </footer>
    </div>
  );
}
