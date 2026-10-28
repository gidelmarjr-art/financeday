import { Link } from "react-router-dom";
import { ArrowRight, Github } from "lucide-react";
import "./About.css";

const STACK = [
  "React + Vite",
  "React Router",
  "CSS por componente",
  "Recharts",
  "Frankfurter API",
  "lucide-react",
];

export default function About() {
  return (
    <section className="about">
      <div className="container about__inner">
        <span className="section-eyebrow">Sobre o projeto</span>
        <h1>Um painel de câmbio para portfólio técnico</h1>
        <p>
          O FinanceDay nasceu como exercício de portfólio: uma aplicação que
          consome uma API pública de câmbio de forma assíncrona, organiza o
          estado em componentes reutilizáveis e usa IA para transformar
          números em leitura de mercado.
        </p>
        <p>
          O projeto foi construído em camadas — serviços, hooks, componentes
          de interface e páginas — pensando em manutenção e em ficar fácil de
          trocar peças no futuro, como outra fonte de dados de câmbio ou um
          provedor de IA real para os insights.
        </p>

        <h2>Stack</h2>
        <ul className="about__stack">
          {STACK.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="about__actions">
          <Link to="/dashboard" className="btn btn--primary">
            Ver o dashboard
            <ArrowRight size={16} />
          </Link>
          <a href="#" onClick={(e) => e.preventDefault()} className="btn btn--ghost">
            <Github size={16} />
            Repositório
          </a>
        </div>
      </div>
    </section>
  );
}
