import { Sparkles } from "lucide-react";
import "./AiInsights.css";

export default function AiInsights({ insights }) {
  return (
    <div className="ai-insights">
      <div className="ai-insights__head">
        <Sparkles size={16} />
        <h3>Insights de IA</h3>
      </div>

      <div className="ai-insights__list">
        {insights.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>

      <div className="ai-insights__status">
        analisando próximo ciclo
        <span className="ai-insights__cursor">▍</span>
      </div>
    </div>
  );
}
