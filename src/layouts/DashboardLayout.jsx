import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Search, Clock3, Circle } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
            <span className="dashboard-topbar__title">Dashboard</span>
          </div>

          <div className="dashboard-topbar__right">
            <div className="dashboard-topbar__search">
              <Search size={14} />
              <input placeholder="Buscar moeda…" />
            </div>
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
          <Outlet />
        </div>
      </div>
    </div>
  );
}
