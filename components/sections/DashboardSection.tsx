"use client";

import { useState } from "react";
import { useApp } from "@/components/AppContext";
import { Info, BarChart3 } from "lucide-react";

function fmt(n: number) { return Math.round(n).toLocaleString(); }

interface BurnRowProps {
  label: string;
  value: number;
  total: number;
  color?: string;
  sublabel?: string;
  confidence?: "high" | "medium" | "low";
}

function BurnRow({ label, value, total, color = "var(--accent)", sublabel, confidence }: BurnRowProps) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{label}</span>
          {sublabel && <span style={{ fontSize: 11, color: "var(--text-dim)", marginLeft: 6 }}>{sublabel}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {confidence && (
            <span className={`confidence-${confidence}`} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 10 }}>
              {confidence}
            </span>
          )}
          <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: value > 0 ? "var(--text)" : "var(--text-dim)" }}>
            {fmt(value)}
          </span>
        </div>
      </div>
      <div style={{ height: 3, background: "var(--border2)", borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, pct))}%`, background: color, borderRadius: 2, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

export function DashboardSection() {
  const { state } = useApp();
  const { burn, intake, profile } = state;
  const [showDrawer, setShowDrawer] = useState(false);

  const net = intake.total - burn.total;
  const isDeficit = net <= 0;
  const target = profile?.targetCalories ?? burn.total;

  if (!profile) {
    return (
      <div className="card animate-fadeup" style={{ padding: 32, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Set up your profile first</div>
        <div style={{ fontSize: 13, color: "var(--text-dim)" }}>Go to the Profile tab to enter your body metrics and get started.</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Net balance card */}
      <div className="card animate-fadeup" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-glow)", border: "1px solid rgba(110,231,183,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BarChart3 size={15} color="var(--accent)" />
          </div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Today&apos;s Summary</div>
        </div>

        {/* Big numbers */}
        <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ padding: "16px", background: "var(--surface2)", borderRadius: 10, border: "1px solid var(--border2)" }}>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Estimated Burn</div>
            <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>{fmt(burn.total)}</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>kcal via {burn.rmrFormula}</div>
          </div>
          <div style={{ padding: "16px", background: "var(--surface2)", borderRadius: 10, border: "1px solid var(--border2)" }}>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Intake</div>
            <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: intake.total > 0 ? "var(--text)" : "var(--text-dim)", lineHeight: 1 }}>
              {intake.total > 0 ? fmt(intake.total) : "—"}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
              {intake.proteinG > 0 && `P${Math.round(intake.proteinG)}g · C${Math.round(intake.carbsG)}g · F${Math.round(intake.fatG)}g`}
            </div>
          </div>
        </div>

        {/* Net balance */}
        {intake.total > 0 && (
          <div style={{
            padding: "16px",
            background: isDeficit ? "var(--accent-glow)" : "rgba(248,113,113,0.08)",
            borderRadius: 10,
            border: `1px solid ${isDeficit ? "rgba(110,231,183,0.25)" : "rgba(248,113,113,0.2)"}`,
            marginBottom: 16,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {isDeficit ? "Caloric Deficit" : "Caloric Surplus"}
            </div>
            <div className="mono" style={{ fontSize: 36, fontWeight: 700, color: isDeficit ? "var(--accent)" : "var(--danger)", lineHeight: 1 }}>
              {fmt(Math.abs(net))}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>
              {target > 0 && target !== burn.total && (
                <span>{intake.total < target ? `${fmt(target - intake.total)} below target` : `${fmt(intake.total - target)} above target`}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Burn breakdown */}
      <div className="card animate-fadeup" style={{ padding: 20 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Burn Breakdown</div>
        <BurnRow label="Resting Metabolic Rate" value={burn.rmr} total={burn.total} sublabel={`(${burn.rmrFormula})`} confidence="medium" />
        <BurnRow label="Non-Step NEAT" value={burn.nonStepNeat} total={burn.total} color="var(--info)" confidence="medium" />
        <BurnRow label="Steps" value={burn.stepCalories} total={burn.total} color="#a78bfa" confidence="medium" />
        {burn.liftingCalories > 0 && (
          <BurnRow label="Weightlifting" value={burn.liftingCalories + burn.liftingEPOC} total={burn.total} color="var(--warn)" sublabel="+ EPOC" confidence="low" />
        )}
        {burn.cardioCalories > 0 && (
          <BurnRow label="Cardio" value={burn.cardioCalories + burn.cardioEPOC} total={burn.total} color="var(--danger)" sublabel="+ EPOC" confidence={burn.cardioCalories > 0 ? "medium" : "medium"} />
        )}
        <BurnRow label="Thermic Effect of Food" value={burn.tef} total={burn.total} color="#34d399" confidence="high" />

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Total Burn</span>
          <span className="mono" style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>{fmt(burn.total)}</span>
        </div>

        <button className="drawer-trigger" style={{ width: "100%", marginTop: 8 }} onClick={() => setShowDrawer(!showDrawer)}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Info size={12} /> About these estimates</span>
          <span style={{ transform: showDrawer ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
        </button>
        {showDrawer && (
          <div style={{ padding: "12px 14px", background: "var(--surface2)", borderRadius: 8, fontSize: 12, color: "var(--text-dim)", lineHeight: 1.7, marginTop: 4 }}>
            Energy expenditure equations have meaningful individual variation — these are science-grounded estimates, not exact measurements. RMR equations are typically accurate within 10–15% at the population level but can vary more individually. Exercise estimates are noisier. Treat this as a useful guide, not a precise count.<br /><br />
            <strong style={{ color: "var(--text-muted)" }}>Steps are counted separately from NEAT</strong> to avoid double-counting walking already tracked in your step total.
          </div>
        )}
      </div>
    </div>
  );
}
