import { useState } from "react";
import FlapBoard from "../components/dashboard/FlapBoard";
import CurrencyCard from "../components/dashboard/CurrencyCard";
import CurrencyChart from "../components/dashboard/CurrencyChart";
import AiInsights from "../components/dashboard/AiInsights";
import { useExchangeRates } from "../hooks/useExchangeRates";
import { LIVE_SYMBOLS, withLiveData, formatAsOfDate } from "../utils/liveData";
import { FEATURED, CURRENCIES, INSIGHTS, getHistoryForCode } from "../data/mock";
import "./Dashboard.css";

// Atalhos rápidos do gráfico — as demais 20 moedas continuam acessíveis
// clicando em qualquer CurrencyCard da grade abaixo.
const QUICK_PICKS = FEATURED.map((f) => f.code);

export default function Dashboard() {
  const [selected, setSelected] = useState("USD");
  const { rates, status, asOf } = useExchangeRates(LIVE_SYMBOLS);

  const currencies = withLiveData(CURRENCIES, rates);
  const featured = withLiveData(FEATURED, rates);

  return (
    <div className="dashboard-page">
      <section id="painel-principal" className="dashboard-page__section">
        <span className="section-eyebrow">Painel principal</span>

        {status === "error" && (
          <p className="dashboard-page__notice">
            Não foi possível buscar cotações ao vivo agora — mostrando os últimos dados disponíveis.
          </p>
        )}
        {status === "success" && asOf && (
          <p className="dashboard-page__asof">
            Câmbio · referência do BCE de {formatAsOfDate(asOf)} — o BCE publica uma cotação por dia
            útil, então o valor não muda a cada poll de 60s, só quando sai um novo dia.
          </p>
        )}

        <FlapBoard items={featured} />
      </section>

      <section className="dashboard-page__grid">
        <div id="todas-as-moedas">
          <span className="section-eyebrow">Todas as moedas</span>
          <div className="dashboard-page__cards">
            {currencies.map((c) => (
              <CurrencyCard
                key={c.code}
                currency={c}
                selected={selected === c.code}
                onSelect={setSelected}
              />
            ))}
          </div>
        </div>

        <div id="insights-ia">
          <AiInsights insights={INSIGHTS} />
        </div>
      </section>

      <section id="historico" className="dashboard-page__section">
        <CurrencyChart
          getHistory={getHistoryForCode}
          selected={selected}
          quickPicks={QUICK_PICKS}
          onSelect={setSelected}
        />
      </section>

      <footer className="dashboard-page__footer">
        fonte: Frankfurter API (14 moedas ao vivo) · Golfo, Gibraltar, Cayman, ARS e BTC ilustrativos · FinanceDay © 2026
      </footer>
    </div>
  );
}
