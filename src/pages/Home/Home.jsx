import { useExchangeRates } from "../../hooks/useExchangeRates";
import { LIVE_SYMBOLS, withLiveData } from "../../utils/liveData";
import { FEATURED } from "../../data/mock";
import Hero from "../../components/landing/Hero";
import TickerMarquee from "../../components/landing/TickerMarquee";
import ProductTabs from "../../components/landing/ProductTabs";
import Journey from "../../components/landing/Journey";
import LiveConverter from "../../components/landing/LiveConverter";
import Numbers from "../../components/landing/Numbers";
import BeforeAfter from "../../components/landing/BeforeAfter";
import DataSources from "../../components/landing/DataSources";
import Faq from "../../components/landing/Faq";
import CtaBanner from "../../components/landing/CtaBanner";
import "../../styles/landing.css";

export default function Home() {
  // Mesmo hook e mesma fonte do painel: a landing e o dashboard mostram os mesmos números.
  const { rates, asOf } = useExchangeRates(LIVE_SYMBOLS);
  const featured = withLiveData(FEATURED, rates);

  return (
    <>
      <Hero featured={featured} asOf={asOf} />
      <TickerMarquee />
      <ProductTabs />
      <Journey />
      <LiveConverter />
      <Numbers />
      <BeforeAfter />
      <DataSources />
      <Faq />
      <CtaBanner />
    </>
  );
}
