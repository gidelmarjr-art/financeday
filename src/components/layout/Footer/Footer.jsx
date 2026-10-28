import { NavLink } from "react-router-dom";
import { useMarket } from "../../../context/MarketContext";
import "./Footer.css";

export default function Footer() {
  const { fiatStatus, cryptoStatus } = useMarket();
  const chip = (label, status) => (
    <span className={`lp-live ${status === "success" ? "is-live" : ""}`}>
      <i />{label}: {status === "success" ? "ao vivo" : status === "loading" ? "conectando…" : "indisponível"}
    </span>
  );

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo"><span className="footer__mark">F</span>Finance<span>Day</span></div>
            <p>Câmbio e criptomoedas em tempo real, com histórico, conversor e leitura automática — num só painel.</p>
            <div className="footer__status" aria-label="Estado das fontes de dados">
              {chip("Câmbio", fiatStatus)}
              {chip("Cripto", cryptoStatus)}
            </div>
          </div>

          <nav className="footer__col" aria-label="Produto">
            <span className="footer__heading">Produto</span>
            <NavLink to="/dashboard">Visão geral</NavLink>
            <NavLink to="/dashboard/cambio">Câmbio</NavLink>
            <NavLink to="/dashboard/moedas">Moedas</NavLink>
            <NavLink to="/dashboard/criptomoedas">Criptomoedas</NavLink>
          </nav>

          <nav className="footer__col" aria-label="Dados">
            <span className="footer__heading">Dados</span>
            <a href="/#fontes">Fontes</a>
            <a href="/#como-funciona">Como funciona</a>
            <a href="/#faq">Perguntas frequentes</a>
          </nav>

          <nav className="footer__col" aria-label="Projeto">
            <span className="footer__heading">Projeto</span>
            <NavLink to="/sobre">Sobre</NavLink>
            <a href="#" onClick={(e) => e.preventDefault()}>Repositório no GitHub</a>
          </nav>
        </div>

        <div className="footer__bottom">
          <span>© 2026 FinanceDay — projeto de portfólio.</span>
          <span>Cotações de referência; não constituem recomendação de investimento.</span>
        </div>
      </div>
      <div className="footer__mark-big" aria-hidden="true">FINANCEDAY</div>
    </footer>
  );
}
