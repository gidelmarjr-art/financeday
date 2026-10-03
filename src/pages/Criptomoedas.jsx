import { useEffect, useMemo, useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import AssetChart from "../components/dashboard/AssetChart";
import Sparkline from "../components/dashboard/Sparkline";
import { useMarket } from "../context/MarketContext";
import { formatBRL, formatCompact, formatPct } from "../utils/format";
import "./Listing.css";

const SORTS = {
  rank: { label: "Valor de mercado", fn: (a, b) => a.rank - b.rank },
  alta: { label: "Maior alta 24h", fn: (a, b) => b.pct - a.pct },
  queda: { label: "Maior queda 24h", fn: (a, b) => a.pct - b.pct },
  preco: { label: "Maior preço", fn: (a, b) => b.brl - a.brl },
};

const Pct = ({ v }) => (
  <span className={v == null ? "muted" : v >= 0 ? "t-up" : "t-down"}>{formatPct(v)}</span>
);

export default function Criptomoedas() {
  const { crypto, byKey, cryptoStatus } = useMarket();
  const { query } = useOutletContext();
  const { state } = useLocation();
  const [selected, setSelected] = useState(state?.select ?? "crypto:bitcoin");
  const [sort, setSort] = useState("rank");

  useEffect(() => { if (state?.select) setSelected(state.select); }, [state]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return crypto
      .filter((c) => !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
      .sort(SORTS[sort].fn);
  }, [crypto, query, sort]);

  const current = byKey[selected] ?? crypto[0];

  return (
    <div className="listing">
      <header className="listing__head">
        <div>
          <span className="section-eyebrow">Criptomoedas</span>
          <h1>Top 20 criptomoedas</h1>
          <p>Ranking por valor de mercado, em reais. Clique em uma linha para ver o histórico.</p>
        </div>
        <label className="listing__sort">
          Ordenar
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
        </label>
      </header>

      {cryptoStatus === "error" && (
        <p className="listing__warn">CoinGecko indisponível agora (possível limite de requisições) — valores ilustrativos.</p>
      )}

      {current && <AssetChart key={current.key} asset={current} />}

      <div className="crypto-table__wrap">
        <table className="crypto-table">
          <thead>
            <tr>
              <th>#</th><th>Moeda</th><th className="r">Preço</th><th className="r">24h</th>
              <th className="r">7d</th><th className="r hide-md">Valor de mercado</th>
              <th className="r hide-md">Volume 24h</th><th className="hide-sm">Últimos 7 dias</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.key} className={selected === c.key ? "is-selected" : ""}
                  onClick={() => setSelected(c.key)} tabIndex={0}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(c.key)}>
                <td className="muted">{c.rank}</td>
                <td>
                  <span className="crypto-table__coin">
                    {c.image ? <img src={c.image} alt="" width="22" height="22" /> : <i>{c.code[0]}</i>}
                    <strong>{c.name}</strong><em>{c.code}</em>
                  </span>
                </td>
                <td className="r mono">{formatBRL(c.brl)}</td>
                <td className="r mono"><Pct v={c.pct} /></td>
                <td className="r mono"><Pct v={c.pct7d} /></td>
                <td className="r mono hide-md">{c.marketCap ? `R$ ${formatCompact(c.marketCap)}` : "—"}</td>
                <td className="r mono hide-md">{c.volume ? `R$ ${formatCompact(c.volume)}` : "—"}</td>
                <td className="hide-sm"><Sparkline data={c.spark} up={(c.pct7d ?? c.pct) >= 0} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="listing__empty">Nenhuma criptomoeda encontrada para “{query}”.</p>}
      </div>
    </div>
  );
}
