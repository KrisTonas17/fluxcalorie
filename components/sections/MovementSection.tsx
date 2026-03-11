"use client";

import { useState, useEffect } from "react";
import { useApp } from "../AppContext";
import { NEAT_LABELS } from "@/lib/metabolism/nonStepNeat";
import { PACE_LABELS } from "@/lib/metabolism/steps";
import type { NonStepNeatLevel, StepPace } from "@/lib/types";
import { Activity, Footprints, Info } from "lucide-react";

const NEAT_LEVELS: NonStepNeatLevel[] = ["very_low", "low", "moderate", "high", "very_high"];
const PACE_LEVELS: StepPace[] = ["casual", "normal", "brisk"];

export function MovementSection() {
  const { state, dispatch } = useApp();
  const log = state.dayLog;

  const [steps, setSteps] = useState(log.movement?.steps?.toString() ?? "8000");
  const [stepPace, setStepPace] = useState<StepPace>(log.movement?.stepPace ?? "normal");
  const [neatLevel, setNeatLevel] = useState<NonStepNeatLevel>(log.movement?.nonStepNeatLevel ?? "moderate");
  const [showDrawer, setShowDrawer] = useState(false);

  // Auto-save on any change
  useEffect(() => {
    dispatch({
      type: "SET_MOVEMENT",
      movement: {
        steps: parseInt(steps) || 0,
        stepPace,
        nonStepNeatLevel: neatLevel,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, stepPace, neatLevel]);

  const burn = state.burn;

  return (
    <div className="card animate-fadeup" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Activity size={15} color="var(--info)" />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Movement</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Steps + non-exercise daily activity</div>
        </div>
        <span className="confidence-medium" style={{ marginLeft: "auto", fontSize: 10, padding: "3px 8px", borderRadius: 20 }}>Medium confidence</span>
      </div>

      {/* Steps */}
      <div style={{ marginBottom: 20 }}>
        <label className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Footprints size={11} /> Steps today
        </label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="number"
              placeholder="8000"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
            />
          </div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", whiteSpace: "nowrap", minWidth: 70, textAlign: "right" }}>
            {burn.stepCalories > 0 && <><span className="mono" style={{ color: "var(--accent)" }}>{Math.round(burn.stepCalories)}</span> kcal</>}
          </div>
        </div>

        <label className="label" style={{ marginTop: 12 }}>Pace</label>
        <div className="segment">
          {PACE_LEVELS.map((p) => (
            <button
              key={p}
              className={`segment-option ${stepPace === p ? "active" : ""}`}
              onClick={() => setStepPace(p)}
            >
              {PACE_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* NEAT */}
      <div>
        <label className="label">Non-Step Daily Movement</label>
        <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 10, lineHeight: 1.5 }}>
          Activity <em>not</em> already counted in your steps or workouts — standing, chores, carrying, fidgeting.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {NEAT_LEVELS.map((level) => {
            const info = NEAT_LABELS[level];
            const isSelected = neatLevel === level;
            return (
              <button
                key={level}
                onClick={() => setNeatLevel(level)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: isSelected ? "var(--accent-glow)" : "var(--surface2)",
                  border: `1px solid ${isSelected ? "rgba(110,231,183,0.3)" : "var(--border2)"}`,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: 14, height: 14, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                  background: isSelected ? "var(--accent)" : "var(--border2)",
                  border: isSelected ? "none" : "2px solid var(--border2)",
                  transition: "all 0.15s",
                }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: isSelected ? 600 : 400, color: isSelected ? "var(--accent)" : "var(--text)" }}>
                    {info.label}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                    {info.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="mono" style={{ marginLeft: "auto", fontSize: 12, color: "var(--accent)", flexShrink: 0 }}>
                    +{Math.round(burn.nonStepNeat)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* How estimated drawer */}
      <div style={{ marginTop: 16 }}>
        <button className="drawer-trigger" style={{ width: "100%" }} onClick={() => setShowDrawer(!showDrawer)}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Info size={12} /> How this is estimated
          </span>
          <span style={{ transform: showDrawer ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
        </button>
        {showDrawer && (
          <div style={{ padding: "12px 14px", background: "var(--surface2)", borderRadius: 8, fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--text-muted)" }}>Steps:</strong> Step length is estimated as height × 0.42. Distance is converted from steps, then pace MET is applied using the ACSM/Compendium framework.<br /><br />
            <strong style={{ color: "var(--text-muted)" }}>Non-step NEAT:</strong> A conservative % of your RMR is added (3–22%) based on your selected movement level. This deliberately excludes any ambulation already counted in your steps.
          </div>
        )}
      </div>
    </div>
  );
}
