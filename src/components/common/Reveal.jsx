import { useInView } from "../../hooks/useInView";

/**
 * Envolve qualquer bloco de conteúdo e aplica a classe `.reveal` (definida em
 * styles/global.css). `delay` aceita um valor em ms para escalonar entradas
 * de itens dentro de uma mesma seção (ex.: cartões de uma grade).
 */
export default function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const [ref, isVisible] = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal ${isVisible ? "is-visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
