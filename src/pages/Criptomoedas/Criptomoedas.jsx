import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Landmark, BarChart3, Bitcoin } from "lucide-react";
import AssetChart from "../../components/dashboard/AssetChart";
import AssetHero from "../../components/bento/AssetHero";
import StatTile from "../../components/bento/StatTile";
import CountValue from "../../components/common/CountValue";
import PctText from "../../components/common/PctText";
import { AssetIcon } from "../../components/common/Flag";
import FlashValue from "../../components/common/FlashValue";
import Sparkline from "../../components/dashboard/Sparkline";
import { useMarket } from "../../context/MarketContext";
import { formatBRL, formatCompact } from "../../utils/format";
import "./Listing.css";

const SORTS = {
  rank: { label: "Valor de mercado", fn: (a, b) => a.rank - b.rank },
  alta: { label: "Maior alta 24h", fn: (a, b) => b.pct - a.pct },
  queda: { label: "Maior queda 24h", fn: (a, b) => a.pct - b.pct },
  preco: { label: "Maior preço", fn: (a, b) => b.brl - a.brl },
};

const compact = (v) => `R$ ${formatCompact(v)}`;

export default function Criptomoedas() {
  const { crypto, byKey, cryptoStatus } = useMarket();
  const { query } = useOutletContext();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(state?.select ?? "crypto:bitcoin");
  const [sort, setSort] = useState("rank");
  const mainRef = useRef(null);

  useEffect(() => {
    if (state?.select) setSelected(state.select);
  }, [state]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return crypto
      .filter(
        (c) =>
          !q ||
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q),
      )
      .sort(SORTS[sort].fn);
  }, [crypto, query, sort]);

  const current = byKey[selected] ?? crypto[0];

  // Resumo do mercado (só com dados reais: no fallback não há valor de mercado)
  const totalCap = crypto.reduce((s, c) => s + (c.marketCap ?? 0), 0);
  const totalVol = crypto.reduce((s, c) => s + (c.volume ?? 0), 0);
  const btc = byKey["crypto:bitcoin"];
  const dominance =
    totalCap && btc?.marketCap ? (btc.marketCap / totalCap) * 100 : null;

  const pick = (key) => {
    setSelected(key);
    const el = mainRef.current;
    if (el && el.getBoundingClientRect().top < 0)
      el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const stats = current
    ? [
        { label: "7 dias", node: <PctText v={current.pct7d} /> },
        {
          label: "Posição",
          node: current.rank ? `#${current.rank} do top 20` : "—",
        },
        {
          label: "Valor de mercado",
          node: current.marketCap ? compact(current.marketCap) : "—",
        },
        {
          label: "Volume 24h",
          node: current.volume ? compact(current.volume) : "—",
        },
      ]
    : [];

  return (
    <div className="listing">
      <header className="page-head">
        <div>
          <span className="section-eyebrow">Criptomoedas</span>
          <h1>Top 20 criptomoedas</h1>
          <p>
            Ranking por valor de mercado, em reais. Escolha uma linha para ver o
            histórico.
          </p>
        </div>
        <label className="listing__sort">
          Ordenar
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, s]) => (
              <option key={k} value={k}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      {cryptoStatus === "error" && (
        <p className="listing__warn">
          CoinGecko indisponível agora (possível limite de requisições) —
          valores ilustrativos.
        </p>
      )}

      <div className="lst__tiles">
        <StatTile
          icon={<Landmark size={15} />}
          label="Valor de mercado · top 20"
          value={
            totalCap ? <CountValue amount={totalCap} format={compact} /> : "—"
          }
          sub="soma das 20 maiores"
        />
        <StatTile
          icon={<BarChart3 size={15} />}
          label="Volume em 24h"
          value={
            totalVol ? <CountValue amount={totalVol} format={compact} /> : "—"
          }
          sub="negociado no período"
        />
        <StatTile
          icon={<Bitcoin size={15} />}
          label="Dominância do Bitcoin"
          value={
            dominance != null ? (
              <CountValue
                amount={dominance}
                format={(v) => `${v.toFixed(1)}%`}
              />
            ) : (
              "—"
            )
          }
          sub="do valor de mercado do top 20"
          bar={dominance}
        />
      </div>

      <div className="lst__main" ref={mainRef}>
        <AssetHero
          asset={current}
          note={current?.rank ? `#${current.rank} por valor de mercado` : null}
          stats={stats}
          onConvert={() =>
            navigate("/dashboard/cambio", { state: { from: current.key } })
          }
        />
        {current && <AssetChart key={current.key} asset={current} />}
      </div>

      <section className="bento-card lst__table">
        <header className="lst__tableHead">
          <h3>Mercado cripto</h3>
          <span>
            {rows.length} de {crypto.length} criptomoedas
          </span>
        </header>
        <div className="crypto-table__scroll">
          <table className="crypto-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Moeda</th>
                <th className="r">Preço</th>
                <th className="r">24h</th>
                <th className="r">7d</th>
                <th className="r hide-md">Valor de mercado</th>
                <th className="r hide-md">Volume 24h</th>
                <th className="hide-sm">Últimos 7 dias</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c, i) => (
                <tr
                  key={c.key}
                  className={selected === c.key ? "is-selected" : ""}
                  onClick={() => pick(c.key)}
                  tabIndex={0}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && pick(c.key)
                  }
                >
                  <td className="muted">{c.rank}</td>
                  <td>
                    <span className="crypto-table__coin">
                      <AssetIcon asset={c} size={24} />
                      <strong>{c.name}</strong>
                      <em>{c.code}</em>
                    </span>
                  </td>
                  <td className="r mono">
                    <FlashValue value={c.brl}>{formatBRL(c.brl)}</FlashValue>
                  </td>
                  <td className="r mono">
                    <PctText v={c.pct} />
                  </td>
                  <td className="r mono">
                    <PctText v={c.pct7d} />
                  </td>
                  <td className="r mono hide-md">
                    {c.marketCap ? compact(c.marketCap) : "—"}
                  </td>
                  <td className="r mono hide-md">
                    {c.volume ? compact(c.volume) : "—"}
                  </td>
                  <td className="hide-sm">
                    <Sparkline
                      data={c.spark}
                      up={(c.pct7d ?? c.pct) >= 0}
                      delay={Math.min(i, 12) * 40}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && (
          <p className="listing__empty">
            Nenhuma criptomoeda encontrada para “{query}”.
          </p>
        )}
      </section>
    </div>
  );
}
