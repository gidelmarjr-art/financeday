import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import "./Navbar.css";

const SECTIONS = [
  { id: "produto", label: "Produto" },
  { id: "como-funciona", label: "Como funciona" },
  { id: "demo", label: "Demo" },
  { id: "fontes", label: "Fontes" },
  { id: "faq", label: "FAQ" },
];

/** Cabeçalho em pílula flutuante; na home destaca a seção que está na tela. */
export default function Navbar() {
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return setActive("");
    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [onHome]);

  const href = (id) => (onHome ? `#${id}` : `/#${id}`);
  const close = () => setOpen(false);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__pill">
        <Link to="/" className="navbar__logo" onClick={close} aria-label="FinanceDay — início">
          <span className="navbar__mark">F</span>
          Finance<span>Day</span>
        </Link>

        <nav className="navbar__links" aria-label="Seções">
          {SECTIONS.map((s) => (
            <a key={s.id} href={href(s.id)} className={`navbar__link ${active === s.id ? "is-active" : ""}`}>
              {s.label}
            </a>
          ))}
          <NavLink to="/sobre" className={({ isActive }) => `navbar__link ${isActive ? "is-active" : ""}`}>Sobre</NavLink>
        </nav>

        <Link to="/dashboard" className="navbar__cta">
          Abrir dashboard <ArrowRight size={15} />
        </Link>

        <button className="navbar__toggle" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={`navbar__menu ${open ? "is-open" : ""}`}>
        <div>
          {SECTIONS.map((s) => (
            <a key={s.id} href={href(s.id)} onClick={close}>{s.label}</a>
          ))}
          <NavLink to="/sobre" onClick={close}>Sobre</NavLink>
          <Link to="/dashboard" className="navbar__menuCta" onClick={close}>Abrir dashboard <ArrowRight size={15} /></Link>
        </div>
      </div>
    </header>
  );
}
