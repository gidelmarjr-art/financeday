import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import "./Combobox.css";

const norm = (s = "") => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const REDUCED = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Ícone que "morfa" entre seta ↓, seta ↑ e X (o path anima via CSS `d`).
function MorphIcon({ state }) {
  const d =
    state === "x" ? "M 6 18 L 18 6 M 18 18 L 6 6"
    : state === "up" ? "M 6 15 L 12 9 M 18 15 L 12 9"
    : "M 6 9 L 12 15 M 18 9 L 12 15";
  return (
    <svg viewBox="0 0 24 24" className="cbx__morph" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const Check = () => (
  <svg viewBox="0 0 24 24" className="cbx__check" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Ripple (onda ao clicar) sem dependências: cria um <span> animado e remove ao fim.
function ripple(e) {
  if (REDUCED()) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const size = Math.max(r.width, r.height) * 2;
  const span = document.createElement("span");
  span.className = "cbx__ripple";
  span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
  el.appendChild(span);
  span.addEventListener("animationend", () => span.remove());
}

/**
 * Combobox pesquisável (seleção única), inspirado no modelo Material 3 enviado.
 * items: [{ value, label, description?, tag?, icon?, group? }]
 */
export default function Combobox({
  id, label, items, value, onChange, placeholder = "Selecionar…", emptyMessage = "Nada encontrado.",
}) {
  const uid = useId();
  const baseId = id ?? uid;
  const listId = `${baseId}-list`;
  const optId = (i) => `${baseId}-opt-${i}`;

  const selected = items.find((i) => i.value === value);
  const [query, setQuery] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [active, setActive] = useState(-1);
  const [placement, setPlacement] = useState("bottom");
  const [maxH, setMaxH] = useState(280);
  const input = useRef(null);
  const box = useRef(null);
  const list = useRef(null);
  const closeTimer = useRef(null);
  const keyboard = useRef(false);

  // Mantém o texto do campo em sincronia com a seleção quando fechado.
  useEffect(() => {
    if (!open) setQuery(selected?.label ?? "");
  }, [selected?.label, open]);

  const filtering = open && query.trim() !== "" && query !== selected?.label;

  const options = useMemo(() => {
    if (!filtering) return items;
    const q = norm(query.trim());
    return items.filter((i) => norm(i.label).includes(q) || norm(i.description).includes(q));
  }, [items, query, filtering]);

  // Linhas = cabeçalhos de grupo + opções (índice só conta opções).
  const rows = useMemo(() => {
    const out = [];
    let lastGroup;
    options.forEach((item, index) => {
      if (item.group && item.group !== lastGroup) out.push({ type: "group", label: item.group });
      lastGroup = item.group;
      out.push({ type: "opt", item, index });
    });
    return out;
  }, [options]);

  // Congela as linhas durante a animação de fechar (evita "pulo" visual).
  const frozen = useRef(rows);
  if (open) frozen.current = rows;
  const shownRows = open ? rows : frozen.current;

  const measure = useCallback(() => {
    if (!box.current) return;
    const r = box.current.getBoundingClientRect();
    const below = window.innerHeight - r.bottom;
    const above = r.top;
    const place = below < 300 && above > below ? "top" : "bottom";
    setPlacement(place);
    setMaxH(Math.max(120, Math.min(300, (place === "bottom" ? below : above) - 24)));
  }, []);

  const openList = useCallback(() => {
    clearTimeout(closeTimer.current);
    measure();
    setOpen(true);
    setRendered(true);
    const idx = items.findIndex((i) => i.value === value);
    setActive(idx);
    keyboard.current = true;
  }, [items, value, measure]);

  const closeList = useCallback(() => {
    setOpen(false);
    setActive(-1);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setRendered(false), 300);
  }, []);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => box.current && !box.current.contains(e.target) && closeList();
    document.addEventListener("mousedown", onDown);
    window.addEventListener("resize", measure);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", measure);
    };
  }, [open, closeList, measure]);

  useEffect(() => {
    if (open && active >= 0 && keyboard.current) {
      document.getElementById(optId(active))?.scrollIntoView({ block: "nearest" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open]);

  const choose = (item) => {
    onChange(item.value);
    closeList();
    input.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "Tab") { if (open) closeList(); return; }
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) { e.preventDefault(); openList(); return; }
    if (!open) return;
    const n = options.length;
    if (e.key === "Escape") { e.preventDefault(); closeList(); return; }
    if (!n) return;
    keyboard.current = true;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % n); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + n) % n); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(n - 1); }
    else if (e.key === "Enter") { e.preventDefault(); if (active >= 0) choose(options[active]); }
  };

  const onToggle = (e) => {
    e.preventDefault();
    input.current?.focus();
    if (filtering) { setQuery(""); setActive(0); if (!open) openList(); }
    else if (open) closeList();
    else openList();
  };

  const iconState = filtering ? "x" : open ? "up" : "down";

  return (
    <div className="cbx-field">
      {label && <label className="cbx__label" htmlFor={baseId}>{label}</label>}
      <div className="cbx" ref={box}>
        <div className={`cbx__panel ${open ? "is-open" : ""} ${placement === "top" ? "is-top" : ""}`}>
          <div className="cbx__bar">
            {selected?.icon && !filtering && <span className="cbx__lead">{selected.icon}</span>}
            <input
              ref={input} id={baseId} role="combobox" aria-expanded={open} aria-autocomplete="list"
              aria-controls={listId} aria-activedescendant={active >= 0 ? optId(active) : undefined}
              autoComplete="off" spellCheck="false" value={query} placeholder={placeholder}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!open) openList();
                setActive(e.target.value ? 0 : -1);
                keyboard.current = true;
              }}
              onFocus={(e) => { openList(); e.target.select(); }}
              onClick={() => !open && openList()}
              onKeyDown={onKeyDown}
            />
            <button type="button" tabIndex={-1} className="cbx__toggle" aria-label="Abrir lista"
              onMouseDown={(e) => e.preventDefault()} onPointerDown={ripple} onClick={onToggle}>
              <MorphIcon state={iconState} />
            </button>
          </div>

          <div className={`cbx__drop ${open ? "is-open" : ""}`} onMouseDown={(e) => e.preventDefault()}>
            <div className="cbx__dropInner">
              {rendered && (
                <div className="cbx__scroll" style={{ maxHeight: maxH }}>
                  <ul ref={list} id={listId} role="listbox" className="cbx__list" aria-label={label}>
                    {shownRows.length === 0 && <li className="cbx__empty" role="presentation">{emptyMessage}</li>}
                    {shownRows.map((row, k) =>
                      row.type === "group" ? (
                        <li key={`g-${row.label}-${k}`} role="presentation" className="cbx__group">{row.label}</li>
                      ) : (
                        <li
                          key={row.item.value} id={optId(row.index)} role="option"
                          aria-selected={row.item.value === value}
                          data-active={active === row.index}
                          className="cbx__item" style={{ "--i": Math.min(row.index, 8) }}
                          onPointerDown={ripple}
                          onMouseMove={(e) => {
                            if (e.movementX === 0 && e.movementY === 0) return;
                            keyboard.current = false;
                            if (active !== row.index) setActive(row.index);
                          }}
                          onClick={() => setTimeout(() => choose(row.item), REDUCED() ? 0 : 120)}
                        >
                          {row.item.icon && <span className="cbx__icon">{row.item.icon}</span>}
                          <span className="cbx__text">
                            <span className="cbx__name">{row.item.label}</span>
                            {(row.item.description || row.item.tag) && (
                              <span className="cbx__meta">
                                <span>{row.item.description}</span>
                                <span>{row.item.tag}</span>
                              </span>
                            )}
                          </span>
                          {row.item.value === value && <Check />}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
