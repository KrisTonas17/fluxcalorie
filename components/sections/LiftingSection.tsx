"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/components/AppContext";
import { INTENSITY_LABELS, BODY_PART_LABELS, BODY_PART_MODIFIERS, getMultiBodyPartModifier } from "@/lib/metabolism/lifting";
import type { LiftingIntensity, BodyPart } from "@/lib/types";
import { Dumbbell, Info, X } from "lucide-react";

const INTENSITIES: LiftingIntensity[] = ["light", "moderate", "hard", "very_hard", "circuit"];
const BODY_PARTS: BodyPart[] = [
  "full_body", "legs_glutes", "lower_body", "upper_body",
  "back", "chest_back", "push", "pull",
  "chest_triceps", "back_biceps", "chest", "shoulders", "arms", "core",
];

function RestSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const labels = ["< 30s", "45s", "75s", "2min", "3min", "4min+"];
  const values = [20, 45, 75, 120, 180, 270];
  const idx = values.findIndex((v) => v >= value) ?? 3;
  return (
    <div>
      <input
        type="range" min={0} max={5} step={1}
        value={idx === -1 ? 5 : idx}
        onChange={(e) => onChange(values[parseInt(e.target.value)])}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {labels.map((l, i) => (
          <span key={i} style={{ fontSize: 10, color: i === idx ? "var(--accent)" : "var(--text-dim)" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

export function LiftingSection() {
  const { state, dispatch } = useApp();
  const log = state.dayLog;
  const [enabled, setEnabled] = useState(!!log.lifting);
  const [form, setForm] = useState({
    durationMin: log.lifting?.durationMin?.toString() ?? "60",
    sets: log.lifting?.sets?.toString() ?? "16",
    avgRestSec: log.lifting?.avgRestSec ?? 90,
    intensity: log.lifting?.intensity ?? "moderate" as LiftingIntensity,
    bodyParts: (log.lifting?.bodyParts ?? [log.lifting?.bodyPart ?? "full_body"]) as BodyPart[],
  });
  const [showDrawer, setShowDrawer] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  function toggleBodyPart(bp: BodyPart) {
    setForm((prev) => {
      const current = prev.bodyParts;
      // full_body is exclusive
      if (bp === "full_body") return { ...prev, bodyParts: ["full_body"] };
      // If full_body is currently selected, replace it
      const withoutFull = current.filter((p) => p !== "full_body");
      const isSelected = withoutFull.includes(bp);
      const next = isSelected
        ? withoutFull.filter((p) => p !== bp)
        : [...withoutFull, bp];
      return { ...prev, bodyParts: next.length === 0 ? ["full_body"] : next };
    });
  }

  useEffect(() => {
    if (!enabled) { dispatch({ type: "SET_LIFTING", lifting: undefined }); return; }
    dispatch({
      type: "SET_LIFTING",
      lifting: {
        durationMin: parseInt(form.durationMin) || 0,
        sets: parseInt(form.sets) || 0,
        avgRestSec: form.avgRestSec,
        intensity: form.intensity,
        bodyPart: form.bodyParts[0] ?? "full_body",
        bodyParts: form.bodyParts,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, form.durationMin, form.sets, form.avgRestSec, form.intensity, form.bodyParts]);

  const burn = state.burn;
  const combinedMod = getMultiBodyPartModifier(form.bodyParts);

  return (
    <div className="card animate-fadeup" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Dumbbell size={15} color="var(--warn)" />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Weightlifting</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Resistance training session</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span className="confidence-low" style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20 }}>Lower confidence</span>
          <button className={`btn ${enabled ? "btn-danger" : "btn-ghost"}`} style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setEnabled(!enabled)}>
            {enabled ? <><X size={11} /> Remove</> : "Add session"}
          </button>
        </div>
      </div>

      {enabled && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="label">Duration</label>
              <div style={{ position: "relative" }}>
                <input type="number" placeholder="60" value={form.durationMin} onChange={(e) => set("durationMin", e.target.value)} />
                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-dim)" }}>min</span>
              </div>
            </div>
            <div>
              <label className="label">Total Sets</label>
              <input type="number" placeholder="16" value={form.sets} onChange={(e) => set("sets", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">Intensity</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {INTENSITIES.map((i) => (
                <button key={i} onClick={() => set("intensity", i)} style={{
                  padding: "9px 12px", borderRadius: 8, textAlign: "left", cursor: "pointer",
                  background: form.intensity === i ? "rgba(251,191,36,0.1)" : "var(--surface2)",
                  border: `1px solid ${form.intensity === i ? "rgba(251,191,36,0.3)" : "var(--border2)"}`,
                  color: form.intensity === i ? "var(--warn)" : "var(--text-muted)",
                  fontSize: 13, fontWeight: form.intensity === i ? 600 : 400, transition: "all 0.15s",
                }}>
                  {INTENSITY_LABELS[i]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Avg Rest Between Sets</label>
            <RestSlider value={form.avgRestSec} onChange={(v) => set("avgRestSec", v)} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <label className="label" style={{ marginBottom: 0 }}>Muscle Groups <span style={{ textTransform: "none", fontWeight: 400, fontSize: 10 }}>(select all that apply)</span></label>
              {form.bodyParts.length > 1 && (
                <span style={{ fontSize: 10, color: "var(--text-dim)" }}>
                  combined modifier: <span style={{ color: "var(--warn)", fontWeight: 600 }}>{combinedMod.toFixed(2)}×</span>
                  {combinedMod >= 1.15 && <span style={{ color: "var(--text-dim)" }}> (capped)</span>}
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {BODY_PARTS.map((bp) => {
                const isSelected = form.bodyParts.includes(bp);
                return (
                  <button key={bp} onClick={() => toggleBodyPart(bp)} style={{
                    padding: "7px 11px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                    background: isSelected ? "rgba(251,191,36,0.15)" : "var(--surface2)",
                    border: `1px solid ${isSelected ? "rgba(251,191,36,0.4)" : "var(--border2)"}`,
                    color: isSelected ? "var(--warn)" : "var(--text-muted)",
                    fontWeight: isSelected ? 600 : 400, transition: "all 0.15s",
                    minHeight: 36,
                  }}>
                    {BODY_PART_LABELS[bp]}
                    {isSelected && bp !== "full_body" && (
                      <span style={{ fontSize: 9, opacity: 0.7, marginLeft: 4 }}>
                        ×{BODY_PART_MODIFIERS[bp]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {form.bodyParts.length > 1 && (
              <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-dim)" }}>
                Modifiers averaged across selected groups, capped at Full Body (1.15×).
              </div>
            )}
          </div>

          {(burn.liftingCalories > 0 || burn.liftingEPOC > 0) && (
            <div style={{ padding: "12px 14px", background: "rgba(251,191,36,0.07)", borderRadius: 8, border: "1px solid rgba(251,191,36,0.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--text-muted)" }}>Session calories</span>
                <span className="mono" style={{ color: "var(--warn)" }}>{Math.round(burn.liftingCalories)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
                <span style={{ color: "var(--text-dim)" }}>+ EPOC (post-burn)</span>
                <span className="mono" style={{ color: "var(--text-dim)" }}>+{Math.round(burn.liftingEPOC)}</span>
              </div>
            </div>
          )}

          <button className="drawer-trigger" style={{ width: "100%" }} onClick={() => setShowDrawer(!showDrawer)}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Info size={12} /> How this is estimated</span>
            <span style={{ transform: showDrawer ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
          </button>
          {showDrawer && (
            <div style={{ padding: "12px 14px", background: "var(--surface2)", borderRadius: 8, fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7 }}>
              MET values from the 2024 Adult Compendium anchor by intensity. Modifiers for set count, rest density, and muscle group involvement are applied. When multiple muscle groups are selected, modifiers are <strong style={{ color: "var(--text-muted)" }}>averaged</strong> and capped at Full Body level (1.15×) to avoid overcounting. <strong style={{ color: "var(--warn)" }}>Resistance training estimates have meaningful individual variation</strong> — treat as a rough range.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
