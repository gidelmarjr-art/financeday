import { NavLink } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="navbar__logo footer__logo">
            Finance<span>Day</span>
          </div>
          <p>Câmbio global em tempo real, com leitura analítica por IA.</p>
        </div>

        <div className="footer__col">
          <span className="footer__heading">Produto</span>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/#capacidades">Capacidades</NavLink>
        </div>

        <div className="footer__col">
          <span className="footer__heading">Projeto</span>
          <NavLink to="/sobre">Sobre</NavLink>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Repositório no GitHub
          </a>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© 2026 FinanceDay — projeto de portfólio, dados ilustrativos.</span>
      </div>
    </footer>
  );
}
