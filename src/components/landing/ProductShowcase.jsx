import Reveal from "../common/Reveal";
import CurrencyCard from "../dashboard/CurrencyCard";
import AiInsights from "../dashboard/AiInsights";
import { INSIGHTS } from "../../data/mock";
import "./ProductShowcase.css";

export default function ProductShowcase({ currencies }) {
  const preview = currencies.slice(0, 4);

  return (
    <section className="showcase">
      <div className="container showcase__grid">
        <Reveal as="div" className="showcase__copy">
          <span className="section-eyebrow">O painel</span>
          <h2>Dados e leitura, lado a lado</h2>
          <p>
            Cada moeda com seu valor, variação e contexto — e um painel de IA
            ao lado, sinalizando o que realmente importa olhar hoje.
          </p>
        </Reveal>

        <Reveal as="div" delay={120} className="showcase__frame-wrap">
          <div className="showcase__frame">
            <div className="showcase__chrome">
              <span className="showcase__dot" />
              <span className="showcase__dot" />
              <span className="showcase__dot" />
              <span className="showcase__url">financeday.app/dashboard</span>
            </div>
            <div className="showcase__body">
              <div className="showcase__cards">
                {preview.map((c) => (
                  <CurrencyCard key={c.code} currency={c} selected={c.code === "USD"} onSelect={() => {}} />
                ))}
              </div>
              <AiInsights insights={INSIGHTS} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
