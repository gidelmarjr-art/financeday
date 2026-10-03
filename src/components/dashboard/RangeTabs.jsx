export const RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1A", days: 365 },
];

export default function RangeTabs({ value, onChange, ranges = RANGES }) {
  return (
    <div className="range-tabs" role="tablist">
      {ranges.map((r) => (
        <button
          key={r.days}
          role="tab"
          aria-selected={value === r.days}
          className={`range-tabs__tab ${value === r.days ? "is-active" : ""}`}
          onClick={() => onChange(r.days)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
