import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import { MarketProvider } from "./context/MarketContext";
import Dashboard from "./pages/Dashboard";
import Cambio from "./pages/Cambio";
import Moedas from "./pages/Moedas";
import Criptomoedas from "./pages/Criptomoedas";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary capturou erro na tela:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", color: "#f87171", background: "#090d16", minHeight: "100vh", fontFamily: "monospace" }}>
          <h2 style={{ color: "#ef4444", marginBottom: "16px" }}>Erro na renderização da Landing Page:</h2>
          <pre style={{ whiteSpace: "pre-wrap", background: "#111a2e", padding: "20px", borderRadius: "10px", border: "1px solid #1e2e4f", color: "#f1f5f9" }}>
            {this.state.error?.stack || String(this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <MarketProvider>
        <ErrorBoundary>
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
        </ErrorBoundary>
      </MarketProvider>
    </BrowserRouter>
  );
}
