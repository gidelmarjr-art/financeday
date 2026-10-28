import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import "./FlapBoard.css";

function FlapChar({ char, delay = 0 }) {
  const [display, setDisplay] = useState(char);
  const [active, setActive] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (!/[0-9]/.test(char)) {
      setDisplay(char);
      return;
    }

    const steps = 5 + Math.floor(Math.random() * 4);
    const seq = Array.from({ length: steps }, () => String(Math.floor(Math.random() * 10)));
    seq.push(char);

    const startId = setTimeout(function run(i = 0) {
      setActive(true);
      setDisplay(seq[i]);
      if (i < seq.length - 1) {
        timers.current.push(setTimeout(() => run(i + 1), 65 + i * 10));
      } else {
        timers.current.push(setTimeout(() => setActive(false), 90));
      }
    }, delay);
    timers.current.push(startId);

    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [char, delay]);

  return <span className={`flap-char ${active ? "flap-char--active" : ""}`}>{display}</span>;
}

function FlapTile({ code, label, value, pct, up, size = "md" }) {
  return (
    <div className={`flap-tile flap-tile--${size}`}>
      <div className="flap-tile__seam" aria-hidden="true" />
      <div className="flap-tile__label">
        {code} <span>· {label}</span>
      </div>
      <div className="flap-tile__value">
        {value.split("").map((c, i) => (
          <FlapChar key={i} char={c} delay={i * 55 + Math.random() * 120} />
        ))}
      </div>
      <div className={`flap-tile__pct ${up ? "is-up" : "is-down"}`}>
        {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {Math.abs(pct).toFixed(2)}%
      </div>
    </div>
  );
}

export default function FlapBoard({ items, size = "md" }) {
  return (
    <div className="flap-board">
      {items.map((item) => (
        <FlapTile key={item.code} {...item} size={size} />
      ))}
    </div>
  );
}
