import { useEffect, useMemo, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import AssetChart from "../components/dashboard/AssetChart";
import Flag from "../components/common/Flag";
import Sparkline from "../components/dashboard/Sparkline";
import { useMarket } from "../context/MarketContext";
import { useFiatTrends } from "../hooks/useFiatTrends";
import { formatNumber, formatPct } from "../utils/format";
import "./Listing.css";

const Pct = ({ v }) => (
  <span className={v == null ? "muted" : v >= 0 ? "t-up" : "t-down"}>{formatPct(v)}</span>
);

export default function Moedas() {
  const { fiat, byKey, asOf, fiatStatus } = useMarket();
  const { query } = useOutletContext();
  const { state } = useLocation();
  const { trends, loading } = useFiatTrends(fiat);
  const [selected, setSelected] = useState(state?.select ?? "USD");
  const [sort, setSort] = useState("valor");

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

  return (
    <div className="listing">
      <header className="listing__head">
        <div>
          <span className="section-eyebrow">Moedas</span>
          <h1>Todas as moedas</h1>
          <p>{fiat.length} moedas frente ao real. Clique em uma linha para ver o histórico.</p>
        </div>
        <label className="listing__sort">
          Ordenar
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
        </label>
      </header>

      {fiatStatus === "error" && (
        <p className="listing__warn">Câmbio ao vivo indisponível agora — valores ilustrativos.</p>
      )}

      {current && <AssetChart key={current.key} asset={current} />}

      <div className="crypto-table__wrap">
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
              const t = trends[c.code];
              return (
                <tr key={c.key} className={selected === c.code ? "is-selected" : ""}
                    onClick={() => setSelected(c.code)} tabIndex={0}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(c.code)}>
                  <td className="muted">{i + 1}</td>
                  <td>
                    <span className="crypto-table__coin">
                      <Flag code={c.code} fallback={c.flag} size={24} />
                      <strong>{c.unit > 1 ? `${c.name} (${c.unit})` : c.name}</strong>
                      <em>{c.code}</em>
                      {c.live === false && <em className="currency-card__tag">ilustrativo</em>}
                    </span>
                  </td>
                  <td className="r mono">R$ {formatNumber(c.value, 4)}</td>
                  <td className="r mono"><Pct v={c.pct} /></td>
                  <td className="r mono">{loading ? <span className="muted">…</span> : <Pct v={t?.pct7d} />}</td>
                  <td className="r mono hide-md">{loading ? <span className="muted">…</span> : <Pct v={t?.pct30d} />}</td>
                  <td className="r mono hide-md">{t ? `R$ ${formatNumber(t.high, 4)}` : "—"}</td>
                  <td className="r mono hide-md">{t ? `R$ ${formatNumber(t.low, 4)}` : "—"}</td>
                  <td className="hide-sm"><Sparkline data={t?.spark} up={(t?.pct30d ?? c.pct ?? 0) >= 0} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!rows.length && <p className="listing__empty">Nenhuma moeda encontrada para “{query}”.</p>}
      </div>

      <p className="listing__foot">
        {asOf ? `Referência do BCE de ${asOf.split("-").reverse().join("/")}. ` : ""}
        AED, SAR, BHD, OMR, JOD, KYD e GIP seguem a paridade oficial com USD/GBP; KWD e ARS vêm de open.er-api.com.
        Tendências de 7 e 30 dias vêm do histórico real; quando a API falha, aparece “—”.
      </p>
    </div>
  );
}
