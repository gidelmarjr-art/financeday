import {
  Activity, LineChart, Sparkles, Coins, BellRing, Plug,
} from "lucide-react";
import Reveal from "../common/Reveal";
import { CAPABILITIES } from "../../data/mock";
import "./Capabilities.css";

const ICONS = { Activity, LineChart, Sparkles, Coins, BellRing, Plug };

export default function Capabilities() {
  return (
    <section id="capacidades" className="capabilities">
      <div className="container">
        <Reveal as="div" className="capabilities__head">
          <span className="section-eyebrow">Capacidades</span>
          <h2>O que o painel monitora</h2>
        </Reveal>

        <div className="capabilities__list">
          {CAPABILITIES.map((item, i) => {
            const Icon = ICONS[item.icon];
            return (
              <Reveal as="div" key={item.title} delay={i * 60} className="capabilities__row">
                <div className="capabilities__icon">
                  <Icon size={18} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
