import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroRate from "../../components/bento/HeroRate";
import HighlightCard from "../../components/bento/HighlightCard";
import MiniStat from "../../components/bento/MiniStat";
import ChangeBars from "../../components/bento/ChangeBars";
import BreadthCard from "../../components/bento/BreadthCard";
import CompareChart from "../../components/dashboard/CompareChart";
import RangeTabs, { RANGES } from "../../components/dashboard/RangeTabs";
import MoversList from "../../components/dashboard/MoversList";
import AiInsights from "../../components/dashboard/AiInsights";
import { useMarket } from "../../context/MarketContext";
import { OVERVIEW_FIAT, OVERVIEW_CRYPTO } from "../../data/catalog";
import { intro } from "../../utils/intro";
import { formatAsOfDate } from "../../utils/liveData";
import { buildInsights } from "../../utils/insights";
import "./Dashboard.css";

const OVERVIEW_RANGES = RANGES.filter((r) => r.days <= 90);

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

export default function Dashboard() {
  const { fiat, crypto, brl, byKey, asOf, fiatStatus, cryptoStatus } =
    useMarket();
  const navigate = useNavigate();
  const [group, setGroup] = useState("fiat");
  const [days, setDays] = useState(30);
  const [focus, setFocus] = useState(null);

  // Entrada orquestrada: uma vez por sessão (depois, trocar de aba não repete).
  const [playIntro] = useState(() => !intro.played);
  const introEnd = useRef(Date.now() + 520);
  useEffect(
    () => () => {
      intro.played = true;
    },
    [],
  );

  const fiatPicks = OVERVIEW_FIAT.map((c) => byKey[c]).filter(Boolean);
  const cryptoPicks = OVERVIEW_CRYPTO.map((id) => byKey[`crypto:${id}`]).filter(
    Boolean,
  );
  const chartAssets = group === "fiat" ? fiatPicks : cryptoPicks;

  const main = fiatPicks[0];
  const wallets = [...fiatPicks.slice(1), brl];
  const [highlight, ...minis] = cryptoPicks;
  const barItems = [...fiatPicks, brl, ...cryptoPicks];

  const movers = useMemo(() => {
    const all = [...fiat, ...crypto].filter(
      (a) => a.pct != null && a.key !== "KWD",
    );
    const sorted = [...all].sort((a, b) => b.pct - a.pct);
    return { up: sorted.slice(0, 5), down: sorted.slice(-5).reverse() };
  }, [fiat, crypto]);
  const insights = useMemo(() => buildInsights(fiat, crypto), [fiat, crypto]);

  const open = (a) =>
    navigate(
      a.kind === "crypto" ? "/dashboard/criptomoedas" : "/dashboard/moedas",
      { state: { select: a.key } },
    );

  const cell = (i) => ({ "--i": i });

  return (
    <div className={`dash ${playIntro ? "is-intro" : ""}`}>
      <header className="dash__intro">
        <div>
          <span className="section-eyebrow">Visão geral</span>
          <h1>{greeting()}.</h1>
          <p>Moedas e criptomoedas frente ao real, em tempo real.</p>
        </div>
        <div className="dash__status">
          {fiatStatus === "error" && (
            <p className="dash__warn">
              Câmbio ao vivo indisponível — mostrando dados ilustrativos.
            </p>
          )}
          {cryptoStatus === "error" && (
            <p className="dash__warn">
              Criptos ao vivo indisponíveis (limite da API) — dados
              ilustrativos.
            </p>
          )}
          {fiatStatus === "success" && asOf && (
            <p className="dash__asof">
              Moedas: referência do BCE de {formatAsOfDate(asOf)} · Criptos:
              atualizadas a cada 60s
            </p>
          )}
        </div>
      </header>

      <div className="bento">
        <div className="bento__cell bento__hero" style={cell(0)}>
          <HeroRate
            main={main}
            wallets={wallets}
            note={
              main?.live === false
                ? "Valor ilustrativo (API indisponível)"
                : asOf
                  ? `Referência do BCE de ${formatAsOfDate(asOf)}`
                  : "Carregando cotação…"
            }
            onConvert={() => navigate("/dashboard/cambio")}
            onList={() => navigate("/dashboard/moedas")}
          />
        </div>

        <div className="bento__cell bento__highlight" style={cell(1)}>
          <HighlightCard
            asset={highlight}
            onOpen={() => highlight && open(highlight)}
          />
        </div>
        {minis.slice(0, 2).map((a, i) => (
          <div
            key={a.key}
            className="bento__cell bento__mini"
            style={cell(2 + i)}
          >
            <MiniStat asset={a} onOpen={() => open(a)} delay={400 + i * 120} />
          </div>
        ))}

        <div className="bento__cell bento__bars" style={cell(4)}>
          <ChangeBars items={barItems} />
        </div>

        <div className="bento__cell bento__chart" style={cell(5)}>
          <section className="bento-card panel">
            <div className="panel__head">
              <div>
                <h2>Desempenho comparado</h2>
                <p>
                  Variação acumulada em % desde o início do período, frente ao
                  real.
                </p>
              </div>
              <div className="panel__controls">
                <div className="seg">
                  <button
                    className={group === "fiat" ? "is-active" : ""}
                    onClick={() => setGroup("fiat")}
                  >
                    Moedas
                  </button>
                  <button
                    className={group === "crypto" ? "is-active" : ""}
                    onClick={() => setGroup("crypto")}
                  >
                    Criptomoedas
                  </button>
                </div>
                <RangeTabs
                  value={days}
                  onChange={setDays}
                  ranges={OVERVIEW_RANGES}
                />
              </div>
            </div>
            <CompareChart
              key={group}
              assets={chartAssets}
              days={days}
              focus={focus}
              onFocus={setFocus}
              notBefore={playIntro ? introEnd.current : 0}
            />
          </section>
        </div>

        <div className="bento__cell bento__breadth" style={cell(6)}>
          <BreadthCard fiat={fiat} crypto={crypto} />
        </div>

        <div className="bento__cell bento__third" style={cell(7)}>
          <MoversList
            title="Maiores altas · 24h"
            items={movers.up}
            onSelect={open}
          />
        </div>
        <div className="bento__cell bento__third" style={cell(8)}>
          <MoversList
            title="Maiores quedas · 24h"
            items={movers.down}
            onSelect={open}
          />
        </div>
        <div className="bento__cell bento__third" style={cell(9)}>
          <AiInsights insights={insights} />
        </div>
      </div>

      <footer className="dashboard-page__footer">
        fontes: Frankfurter (BCE) · open.er-api.com · CoinGecko · FinanceDay ©
        2026
      </footer>
    </div>
  );
}
