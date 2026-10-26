import { DollarSign, Euro, Bitcoin, PoundSterling, Gauge, ArrowLeftRight, Coins } from "lucide-react";
import StatCard from "../dashboard/StatCard";
import CompareChart from "../dashboard/CompareChart";
import Sparkline from "../dashboard/Sparkline";
import { useMarket } from "../../context/MarketContext";
import { useInView } from "../../hooks/useInView";
import { formatBRL, formatPct } from "../../utils/format";
import "./DashboardPreview.css";

const NAV = [
  { label: "Visão geral", icon: Gauge, active: true },
  { label: "Câmbio", icon: ArrowLeftRight },
  { label: "Moedas", icon: Coins },
  { label: "Criptomoedas", icon: Bitcoin },
];

/**
 * Miniatura "viva" do dashboard (mesmos componentes e dados reais), só para
 * visualização: não é clicável e some com um degradê na base — o botão de
 * entrada da CtaBanner fica por cima desse degradê.
 */
export default function DashboardPreview() {
  const { byKey, crypto } = useMarket();
  const [ref, visible] = useInView();

  const kpis = [
    { a: byKey.USD, icon: DollarSign, label: "USD · Dólar Americano" },
    { a: byKey.EUR, icon: Euro, label: "EUR · Euro" },
    { a: byKey.GBP, icon: PoundSterling, label: "GBP · Libra Esterlina" },
    { a: byKey["crypto:bitcoin"], icon: Bitcoin, label: "BTC · Bitcoin" },
  ].filter((k) => k.a);

  const chartAssets = ["USD", "EUR", "GBP", "CAD"].map((c) => byKey[c]).filter(Boolean);
  const rows = crypto.slice(0, 3);

  return (
    <div className="dpreview" ref={ref} aria-hidden="true">
      <div className="dpreview__frame">
        <div className="dpreview__chrome">
          <i /><i /><i />
          <span>financeday · dashboard</span>
        </div>

        <div className="dpreview__body">
          <aside className="dpreview__side">
            <b>Finance<span>Day</span></b>
            {NAV.map(({ label, icon: Icon, active }) => (
              <span key={label} className={active ? "is-active" : ""}><Icon size={14} />{label}</span>
            ))}
          </aside>

          <div className="dpreview__main">
            <div className="dpreview__kpis">
              {kpis.map(({ a, icon: Icon, label }) => (
                <StatCard key={a.key} icon={<Icon size={15} />} label={label}
                  value={formatBRL(a.value)} pct={a.pct}
                  caption={a.kind === "crypto" ? "Variação em 24h" : "Variação vs. referência anterior"} />
              ))}
            </div>

            <div className="dpreview__panel">
              <div className="dpreview__panelHead">
                <strong>Desempenho comparado</strong>
                <span>30 dias · frente ao real</span>
              </div>
              {visible && <CompareChart assets={chartAssets} days={30} />}
            </div>

            <div className="dpreview__rows">
              {rows.map((c) => (
                <div key={c.key} className="dpreview__row">
                  <span>{c.image && <img src={c.image} alt="" width="20" height="20" />}<b>{c.name}</b><em>{c.code}</em></span>
                  <span>{formatBRL(c.brl)}</span>
                  <span className={c.pct >= 0 ? "t-up" : "t-down"}>{formatPct(c.pct)}</span>
                  <Sparkline data={c.spark} up={(c.pct7d ?? c.pct) >= 0} width={90} height={26} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
