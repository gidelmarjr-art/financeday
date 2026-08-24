import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FlapBoard from "../dashboard/FlapBoard";
import Reveal from "../common/Reveal";
import { formatAsOfDate } from "../../utils/liveData";
import "./Hero.css";

export default function Hero({ featured, asOf }) {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <Reveal as="div" className="hero__copy">
          <span className="hero__eyebrow">Câmbio + Inteligência Artificial</span>
          <h1>
            O câmbio muda a cada instante.
            <br />
            Seu painel também deveria.
          </h1>
          <p>
            O FinanceDay acompanha as principais moedas frente ao real e
            resume, em linguagem simples, o que mudou e por quê — como um
            analista que nunca sai da tela.
          </p>
          <div className="hero__actions">
            <Link to="/dashboard" className="btn btn--primary">
              Abrir dashboard
              <ArrowRight size={16} />
            </Link>
            <a href="#capacidades" className="btn btn--ghost">
              Ver capacidades
            </a>
          </div>
        </Reveal>

        <Reveal as="div" delay={150} className="hero__visual">
          <div className="hero__panel">
            <div className="hero__panel-status">
              <span className="hero__dot" />
              {asOf ? `referência do BCE de ${formatAsOfDate(asOf)}` : "carregando cotações…"}
            </div>
            <FlapBoard items={featured} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
