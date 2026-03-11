"use client";

import { useState, useEffect } from "react";
import { useApp } from "../AppContext";
import { CARDIO_MODE_LABELS } from "@/lib/metabolism/cardio";
import type { CardioMode } from "@/lib/types";
import { Heart, Info, X } from "lucide-react";

const MODES: CardioMode[] = ["walking", "jogging", "running", "elliptical", "stairmaster", "rowing"];

const NEEDS_SPEED: CardioMode[] = ["walking", "jogging", "running"];
const NEEDS_INCLINE: CardioMode[] = ["walking", "jogging", "running"];

const INTENSITY_OPTS: Record<CardioMode, Array<{ value: string; label: string }>> = {
  walking: [],
  jogging: [],
  running: [],
  elliptical: [
    { value: "moderate", label: "Moderate" },
    { value: "vigorous", label: "Vigorous" },
  ],
  stairmaster: [
    { value: "moderate", label: "Moderate" },
    { value: "hard", label: "Hard" },
  ],
  rowing: [
    { value: "moderate", label: "Moderate (~100W)" },
    { value: "hard", label: "Hard (~150W)" },
    { value: "very_hard", label: "Very Hard (~200W)" },
    { value: "max", label: "Max (~200W+)" },
  ],
};

export function CardioSection() {
  const { state, dispatch } = useApp();
  const [enabled, setEnabled] = useState(!!state.dayLog.cardio);

  const [form, setForm] = useState({
    mode: state.dayLog.cardio?.mode ?? "running" as CardioMode,
    durationMin: state.dayLog.cardio?.durationMin?.toString() ?? "30",
    speedMph: state.dayLog.cardio?.speedMph?.toString() ?? "6.0",
    inclinePercent: state.dayLog.cardio?.inclinePercent?.toString() ?? "0",
    intensity: state.dayLog.cardio?.intensity ?? "moderate",
  });
  const [showDrawer, setShowDrawer] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    if (!enabled) {
      dispatch({ type: "SET_CARDIO", cardio: undefined });
      return;
    }
    dispatch({
      type: "SET_CARDIO",
      cardio: {
        mode: form.mode,
        durationMin: parseInt(form.durationMin) || 0,
        speedMph: NEEDS_SPEED.includes(form.mode) ? parseFloat(form.speedMph) : undefined,
        inclinePercent: NEEDS_INCLINE.includes(form.mode) ? parseFloat(form.inclinePercent) : undefined,
        intensity: form.intensity as "moderate" | "vigorous" | "hard" | "intervals",
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, form.mode, form.durationMin, form.speedMph, form.inclinePercent, form.intensity]);

  const burn = state.burn;
  const confidence = NEEDS_SPEED.includes(form.mode) && parseFloat(form.speedMph) > 0 ? "high" : "medium";

  return (
    <div className="card animate-fadeup" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Heart size={15} color="var(--danger)" />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Cardio</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Aerobic session</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span className={`confidence-${confidence}`} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20 }}>
            {confidence === "high" ? "High confidence" : "Medium confidence"}
          </span>
          <button
            className={`btn ${enabled ? "btn-danger" : "btn-ghost"}`}
            style={{ padding: "6px 12px", fontSize: 12 }}
            onClick={() => setEnabled(!enabled)}
          >
            {enabled ? <><X size={11} /> Remove</> : "Add session"}
          </button>
        </div>
      </div>

      {enabled && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Mode */}
          <div>
            <label className="label">Mode</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => set("mode", m)}
                  style={{
                    padding: "7px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                    background: form.mode === m ? "rgba(248,113,113,0.12)" : "var(--surface2)",
                    border: `1px solid ${form.mode === m ? "rgba(248,113,113,0.4)" : "var(--border2)"}`,
                    color: form.mode === m ? "var(--danger)" : "var(--text-muted)",
                    fontWeight: form.mode === m ? 600 : 400, transition: "all 0.15s",
                  }}
                >
                  {CARDIO_MODE_LABELS[m]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Duration</label>
            <div style={{ position: "relative" }}>
              <input type="number" placeholder="30" value={form.durationMin} onChange={(e) => set("durationMin", e.target.value)} />
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-dim)" }}>min</span>
            </div>
          </div>

          {NEEDS_SPEED.includes(form.mode) && (
            <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label className="label">Speed</label>
                <div style={{ position: "relative" }}>
                  <input type="number" step="0.1" placeholder="6.0" value={form.speedMph} onChange={(e) => set("speedMph", e.target.value)} />
                  <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-dim)" }}>mph</span>
                </div>
              </div>
              <div>
                <label className="label">Incline</label>
                <div style={{ position: "relative" }}>
                  <input type="number" step="0.5" placeholder="0" value={form.inclinePercent} onChange={(e) => set("inclinePercent", e.target.value)} />
                  <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-dim)" }}>%</span>
                </div>
              </div>
            </div>
          )}

          {INTENSITY_OPTS[form.mode].length > 0 && (
            <div>
              <label className="label">Intensity</label>
              <div className="segment">
                {INTENSITY_OPTS[form.mode].map((opt) => (
                  <button
                    key={opt.value}
                    className={`segment-option ${form.intensity === opt.value ? "active" : ""}`}
                    onClick={() => set("intensity", opt.value as "moderate" | "vigorous" | "hard" | "intervals")}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(burn.cardioCalories > 0 || burn.cardioEPOC > 0) && (
            <div style={{ padding: "12px 14px", background: "rgba(248,113,113,0.07)", borderRadius: 8, border: "1px solid rgba(248,113,113,0.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--text-muted)" }}>Session calories</span>
                <span className="mono" style={{ color: "var(--danger)" }}>{Math.round(burn.cardioCalories)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
                <span style={{ color: "var(--text-dim)" }}>+ EPOC</span>
                <span className="mono" style={{ color: "var(--text-dim)" }}>+{Math.round(burn.cardioEPOC)}</span>
              </div>
            </div>
          )}

          <button className="drawer-trigger" style={{ width: "100%" }} onClick={() => setShowDrawer(!showDrawer)}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Info size={12} /> How this is estimated</span>
            <span style={{ transform: showDrawer ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
          </button>
          {showDrawer && (
            <div style={{ padding: "12px 14px", background: "var(--surface2)", borderRadius: 8, fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7 }}>
              Walking and running use the <strong style={{ color: "var(--text-muted)" }}>ACSM metabolic equations</strong> with your entered speed and incline — these are high-confidence estimates. Other modes use MET values from the 2024 Adult Compendium applied to your body weight and duration.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
