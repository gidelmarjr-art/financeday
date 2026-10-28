import Reveal from "../Reveal";
import "./SectionHead.css";

/** Cabeçalho de seção: índice numerado + rótulo, título grande e apoio. */
export default function SectionHead({ index, eyebrow, title, children, align = "left" }) {
  return (
    <Reveal as="header" className={`sh sh--${align}`}>
      <span className="sh__eyebrow"><b>{index}</b>{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </Reveal>
  );
}
