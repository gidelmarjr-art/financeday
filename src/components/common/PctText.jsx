import { formatPct } from "../../utils/format";

/** Variação em texto colorido (verde/vermelho); "—" quando não há dado. */
export default function PctText({ v }) {
  return (
    <span
      className={
        v == null || !Number.isFinite(v) ? "muted" : v >= 0 ? "t-up" : "t-down"
      }
    >
      {formatPct(v)}
    </span>
  );
}
