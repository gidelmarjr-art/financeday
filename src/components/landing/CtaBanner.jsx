import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Reveal from "../common/Reveal";
import DashboardPreview from "./DashboardPreview";
import "./CtaBanner.css";

export default function CtaBanner() {
  return (
    <section className="cta">
      <div className="container">
        <Reveal as="div" className="cta__head">
          <span className="section-eyebrow">Dashboard</span>
          <h2>Pronto para acompanhar o mercado agora?</h2>
          <p>Sem cadastro. O painel abre direto com dados atualizados.</p>
        </Reveal>

        <Reveal as="div" className="cta__stage" delay={120}>
          <div className="cta__preview">
            <DashboardPreview />
          </div>
          <div className="cta__fade" aria-hidden="true" />
          <Link to="/dashboard" className="btn btn--primary cta__btn">
            Abrir dashboard
            <ArrowUpRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
