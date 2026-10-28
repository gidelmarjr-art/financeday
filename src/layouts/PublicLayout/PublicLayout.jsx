import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

/** Rola até a âncora (#secao) ao entrar numa página vinda de outra rota. */
function useScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) return window.scrollTo(0, 0);
    const el = document.getElementById(hash.slice(1));
    if (el) requestAnimationFrame(() => el.scrollIntoView());
  }, [pathname, hash]);
}

export default function PublicLayout() {
  useScrollToHash();
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
