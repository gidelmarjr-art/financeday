import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, Search, Clock3, Circle } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import { MarketProvider } from "../context/MarketContext";
import "./DashboardLayout.css";

const TITLES = {
  "/dashboard": "Visão geral",
  "/dashboard/cambio": "Câmbio",
  "/dashboard/moedas": "Moedas",
  "/dashboard/criptomoedas": "Criptomoedas",
};
const SEARCHABLE = ["/dashboard/moedas", "/dashboard/criptomoedas"];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { pathname } = useLocation();

  useEffect(() => setQuery(""), [pathname]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <MarketProvider>
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-layout__main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar__left">
            <button
              className="dashboard-topbar__menu"
              aria-label="Abrir menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <span className="dashboard-topbar__title">{TITLES[pathname] ?? "Dashboard"}</span>
          </div>

          <div className="dashboard-topbar__right">
            {SEARCHABLE.includes(pathname) && (
              <div className="dashboard-topbar__search">
                <Search size={14} />
                <input
                  placeholder="Buscar…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Buscar moeda"
                />
              </div>
            )}
            <div className="dashboard-topbar__time">
              <Clock3 size={13} />
              {time}
            </div>
            <div className="dashboard-topbar__status">
              <Circle size={8} fill="currentColor" stroke="none" />
              mercado aberto
            </div>
          </div>
        </header>

        <div className="dashboard-layout__content">
          <Outlet context={{ query }} />
        </div>
      </div>
    </div>
    </MarketProvider>
  );
}
