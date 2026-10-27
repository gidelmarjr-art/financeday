import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import AssetChart from "../components/dashboard/AssetChart";
import AssetHero from "../components/bento/AssetHero";
import StatTile from "../components/bento/StatTile";
import CountValue from "../components/common/CountValue";
import PctText from "../components/common/PctText";
import Flag from "../components/common/Flag";
import FlashValue from "../components/common/FlashValue";
import Sparkline from "../components/dashboard/Sparkline";
import { useMarket } from "../context/MarketContext";
import { useFiatTrends } from "../hooks/useFiatTrends";
import { formatNumber } from "../utils/format";
import "./Listing.css";

const signed = (v) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;

export default function Moedas() {
  const { fiat, byKey, asOf, fiatStatus } = useMarket();
  const { query } = useOutletContext();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { trends, loading } = useFiatTrends(fiat);
  const [selected, setSelected] = useState(state?.select ?? "USD");
  const [sort, setSort] = useState("valor");
  const mainRef = useRef(null);

  useEffect(() => { if (state?.select) setSelected(state.select); }, [state]);

  const SORTS = useMemo(() => {
    const t = (c, k) => trends[c.code]?.[k];
    return {
      valor: { label: "Maior valor", fn: (a, b) => b.brl * b.unit - a.brl * a.unit },
      alta: { label: "Maior alta 24h", fn: (a, b) => (b.pct ?? -Infinity) - (a.pct ?? -Infinity) },
      queda: { label: "Maior queda 24h", fn: (a, b) => (a.pct ?? Infinity) - (b.pct ?? Infinity) },
      alta7: { label: "Maior alta 7 dias", fn: (a, b) => (t(b, "pct7d") ?? -Infinity) - (t(a, "pct7d") ?? -Infinity) },
      alta30: { label: "Maior alta 30 dias", fn: (a, b) => (t(b, "pct30d") ?? -Infinity) - (t(a, "pct30d") ?? -Infinity) },
      nome: { label: "Nome (A–Z)", fn: (a, b) => a.name.localeCompare(b.name, "pt-BR") },
    };
  }, [trends]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fiat
      .filter((c) => !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
      .sort(SORTS[sort].fn);
  }, [fiat, query, sort, SORTS]);

  const current = byKey[selected] ?? byKey.USD;
  const t = current ? trends[current.code] : null;

  // Resumo do dia (KWD fica de fora: o % dele é aproximado)
  const withPct = fiat.filter((c) => c.pct != null && c.code !== "KWD");
  const sorted = [...withPct].sort((a, b) => b.pct - a.pct);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const upCount = withPct.filter((c) => c.pct > 0).length;

  const pick = (code) => {
    setSelected(code);
    const el = mainRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const shim = <i className="shimmer shimmer--pill" />;
  const stats = [
    { label: "7 dias", node: loading ? shim : <PctText v={t?.pct7d} /> },
    { label: "30 dias", node: loading ? shim : <PctText v={t?.pct30d} /> },
    { label: "Máx. 30d", node: t ? `R$ ${formatNumber(t.high, 4)}` : loading ? shim : "—" },
    { label: "Mín. 30d", node: t ? `R$ ${formatNumber(t.low, 4)}` : loading ? shim : "—" },
  ];

  return (
    <div className="listing">
      <header className="page-head">
        <div>
          <span className="section-eyebrow">Moedas</span>
          <h1>Todas as moedas</h1>
          <p>{fiat.length} moedas frente ao real. Escolha uma linha para ver o histórico.</p>
        </div>
        <label className="listing__sort">
          Ordenar
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
        </label>
      </header>

      {fiatStatus === "error" && <p className="listing__warn">Câmbio ao vivo indisponível agora — valores ilustrativos.</p>}

      <div className="lst__tiles">
        {best && (
          <StatTile icon={<TrendingUp size={15} />} label="Maior alta · 24h" onClick={() => pick(best.code)}
            value={<CountValue amount={best.pct} format={signed} />} sub={`${best.code} · ${best.name}`} />
        )}
        {worst && (
          <StatTile icon={<TrendingDown size={15} />} label="Maior queda · 24h" onClick={() => pick(worst.code)}
            value={<CountValue amount={worst.pct} format={signed} />} sub={`${worst.code} · ${worst.name}`} />
        )}
        <StatTile icon={<Activity size={15} />} label="Moedas em alta"
          value={<CountValue amount={upCount} format={(v) => `${Math.round(v)} de ${withPct.length}`} />}
          sub="frente ao real" bar={withPct.length ? (upCount / withPct.length) * 100 : 0} />
      </div>

      <div className="lst__main" ref={mainRef}>
        <AssetHero
          asset={current}
          note={current?.unit > 1 ? `Cotação por ${current.unit} unidades` : asOf ? `Referência do BCE de ${asOf.split("-").reverse().join("/")}` : null}
          stats={stats}
          onConvert={() => navigate("/dashboard/cambio", { state: { from: current.key } })}
        />
        {current && <AssetChart key={current.key} asset={current} />}
      </div>

      <section className="bento-card lst__table">
        <header className="lst__tableHead">
          <h3>Cotações</h3>
          <span>{rows.length} de {fiat.length} moedas</span>
        </header>
        <div className="crypto-table__scroll">
          <table className="crypto-table">
            <thead>
              <tr>
                <th>#</th><th>Moeda</th><th className="r">Cotação</th><th className="r">24h</th>
                <th className="r">7d</th><th className="r hide-md">30d</th>
                <th className="r hide-md">Máx. 30d</th><th className="r hide-md">Mín. 30d</th>
                <th className="hide-sm">Últimos 30 dias</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c, i) => {
                const tr = trends[c.code];
                return (
                  <tr key={c.key} className={selected === c.code ? "is-selected" : ""}
                      onClick={() => pick(c.code)} tabIndex={0}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick(c.code)}>
                    <td className="muted">{i + 1}</td>
                    <td>
                      <span className="crypto-table__coin">
                        <Flag code={c.code} fallback={c.flag} size={24} />
                        <strong>{c.unit > 1 ? `${c.name} (${c.unit})` : c.name}</strong>
                        <em>{c.code}</em>
                        {c.live === false && <em className="currency-card__tag">ilustrativo</em>}
                      </span>
                    </td>
                    <td className="r mono"><FlashValue value={c.value}>R$ {formatNumber(c.value, 4)}</FlashValue></td>
                    <td className="r mono"><PctText v={c.pct} /></td>
                    <td className="r mono">{loading ? <i className="shimmer shimmer--pill" /> : <PctText v={tr?.pct7d} />}</td>
                    <td className="r mono hide-md">{loading ? <i className="shimmer shimmer--pill" /> : <PctText v={tr?.pct30d} />}</td>
                    <td className="r mono hide-md">{tr ? `R$ ${formatNumber(tr.high, 4)}` : "—"}</td>
                    <td className="r mono hide-md">{tr ? `R$ ${formatNumber(tr.low, 4)}` : "—"}</td>
                    <td className="hide-sm"><Sparkline data={tr?.spark} up={(tr?.pct30d ?? c.pct ?? 0) >= 0} delay={Math.min(i, 12) * 40} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!rows.length && <p className="listing__empty">Nenhuma moeda encontrada para “{query}”.</p>}
      </section>

      <p className="listing__foot">
        AED, SAR, BHD, OMR, JOD, KYD e GIP seguem a paridade oficial com USD/GBP; KWD e ARS vêm de open.er-api.com.
        Tendências de 7 e 30 dias vêm do histórico real; quando a API falha, aparece “—”.
      </p>
    </div>
  );
}
