import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import { MarketProvider } from "./context/MarketContext";
import Dashboard from "./pages/Dashboard/Dashboard";
import Cambio from "./pages/Cambio/Cambio";
import Moedas from "./pages/Moedas/Moedas";
import Criptomoedas from "./pages/Criptomoedas";

export default function App() {
  return (
    <BrowserRouter>
      <MarketProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
          </Route>

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/cambio" element={<Cambio />} />
            <Route path="/dashboard/moedas" element={<Moedas />} />
            <Route path="/dashboard/criptomoedas" element={<Criptomoedas />} />
          </Route>
        </Routes>
      </MarketProvider>
    </BrowserRouter>
  );
}
