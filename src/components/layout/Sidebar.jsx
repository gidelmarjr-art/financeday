import { NavLink } from "react-router-dom";
import { Gauge, Coins, ArrowLeftRight, Bitcoin, ArrowLeft, X } from "lucide-react";
import "./Sidebar.css";

const NAV = [
  { to: "/dashboard", label: "Visão geral", icon: Gauge, end: true },
  { to: "/dashboard/cambio", label: "Câmbio", icon: ArrowLeftRight },
  { to: "/dashboard/moedas", label: "Moedas", icon: Coins },
  { to: "/dashboard/criptomoedas", label: "Criptomoedas", icon: Bitcoin },
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
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar__item ${isActive ? "is-active" : ""}`}
              onClick={onClose}
            >
              <Icon size={16} />
              {label}
            </NavLink>
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
