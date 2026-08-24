import { useExchangeRates } from "../hooks/useExchangeRates";
import { LIVE_SYMBOLS, withLiveData } from "../utils/liveData";
import { FEATURED, CURRENCIES } from "../data/mock";
import Hero from "../components/landing/Hero";
import TickerMarquee from "../components/landing/TickerMarquee";
import Capabilities from "../components/landing/Capabilities";
import ProductShowcase from "../components/landing/ProductShowcase";
import StatsSection from "../components/landing/StatsSection";
import CtaBanner from "../components/landing/CtaBanner";

export default function Home() {
  // Mesmo hook, mesma fonte de dados do Dashboard — assim a landing page e
  // o painel sempre mostram os mesmos números, sem duas fontes divergentes.
  const { rates, asOf } = useExchangeRates(LIVE_SYMBOLS);
  const featured = withLiveData(FEATURED, rates);
  const currencies = withLiveData(CURRENCIES, rates);

  return (
    <>
      <Hero featured={featured} asOf={asOf} />
      <TickerMarquee currencies={currencies} />
      <Capabilities />
      <ProductShowcase currencies={currencies} />
      <StatsSection />
      <CtaBanner />
    </>
  );
}
