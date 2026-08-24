import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "../common/Reveal";
import "./CtaBanner.css";

export default function CtaBanner() {
  return (
    <section className="cta">
      <div className="container">
        <Reveal as="div" className="cta__panel">
          <div>
            <h2>Pronto para acompanhar o mercado agora?</h2>
            <p>Sem cadastro. O painel abre direto com dados atualizados.</p>
          </div>
          <Link to="/dashboard" className="btn btn--primary">
            Abrir dashboard
            <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
