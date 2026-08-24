import { NavLink } from "react-router-dom";
import { Gauge, Coins, LineChart, Sparkles, ArrowLeft, X } from "lucide-react";
import "./Sidebar.css";

const NAV = [
  { href: "#painel-principal", label: "Visão geral", icon: Gauge },
  { href: "#todas-as-moedas", label: "Moedas", icon: Coins },
  { href: "#historico", label: "Histórico", icon: LineChart },
  { href: "#insights-ia", label: "Insights de IA", icon: Sparkles },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
        <div className="sidebar__top">
          <NavLink to="/" className="sidebar__logo">
            Finance<span>Day</span>
          </NavLink>
          <button className="sidebar__close" aria-label="Fechar menu" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV.map(({ href, label, icon: Icon }) => (
            <a key={href} href={href} className="sidebar__item" onClick={onClose}>
              <Icon size={16} />
              {label}
            </a>
          ))}
        </nav>

        <NavLink to="/" className="sidebar__back">
          <ArrowLeft size={15} />
          Voltar ao site
        </NavLink>
      </aside>

      {open && <div className="sidebar__scrim" onClick={onClose} />}
    </>
  );
}
