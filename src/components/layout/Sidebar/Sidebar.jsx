import { NavLink, useLocation } from "react-router-dom";
import { Gauge, Coins, ArrowLeftRight, Bitcoin, ArrowLeft } from "lucide-react";
import "./Sidebar.css";

const NAV = [
  { to: "/dashboard", label: "Visão geral", icon: Gauge, end: true },
  { to: "/dashboard/cambio", label: "Câmbio", icon: ArrowLeftRight },
  { to: "/dashboard/moedas", label: "Moedas", icon: Coins },
  { to: "/dashboard/criptomoedas", label: "Criptomoedas", icon: Bitcoin },
];

/** Menu flutuante em pílula (só ícones; nome em tooltip). No celular vira barra inferior. */
export default function Sidebar() {
  const { pathname } = useLocation();
  const activeIndex = NAV.findIndex((n) =>
    n.end ? pathname === n.to : pathname.startsWith(n.to),
  );

  return (
    <aside className="sidebar" aria-label="Navegação do painel">
      <NavLink
        to="/"
        className="sidebar__logo"
        aria-label="FinanceDay — voltar ao site"
      >
        F<span className="sidebar__tip">Voltar ao site</span>
      </NavLink>

      <nav className="sidebar__nav" style={{ "--i": Math.max(activeIndex, 0) }}>
        <span
          className="sidebar__indicator"
          style={{ opacity: activeIndex < 0 ? 0 : 1 }}
          aria-hidden="true"
        />
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "is-active" : ""}`
            }
          >
            <Icon size={20} />
            <span className="sidebar__tip">{label}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink to="/" className="sidebar__back" aria-label="Voltar ao site">
        <ArrowLeft size={18} />
        <span className="sidebar__tip">Voltar ao site</span>
      </NavLink>
    </aside>
  );
}
