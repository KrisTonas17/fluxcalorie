"use client";

import { useApp } from "./AppContext";
import { Flame, Utensils, TrendingDown, TrendingUp } from "lucide-react";

function fmt(n: number) {
  return Math.round(n).toLocaleString();
}

export function SummaryBar() {
  const { state } = useApp();
  const { burn, intake, profile } = state;
  const net = intake.total - burn.total;
  const target = profile?.targetCalories ?? burn.total;
  const remaining = target - intake.total;
  const isDeficit = net <= 0;

  return (
    <div className="summary-bar">
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.1em" }}>FLUX</span>
          <span style={{ fontSize: 11, color: "var(--text-dim)" }}>daily energy</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-dim)" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {/* Burn */}
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 2 }}>
              <Flame size={12} color="var(--text-dim)" />
              <span style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Burn</span>
            </div>
            <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>
              {burn.total > 0 ? fmt(burn.total) : "—"}
            </div>
          </div>

          {/* Net */}
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 2 }}>
              {isDeficit
                ? <TrendingDown size={12} color="var(--accent)" />
                : <TrendingUp size={12} color="var(--danger)" />}
              <span style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {isDeficit ? "Deficit" : "Surplus"}
              </span>
            </div>
            <div className="mono" style={{
              fontSize: 20, fontWeight: 700, lineHeight: 1,
              color: burn.total === 0 ? "var(--text-dim)" : isDeficit ? "var(--accent)" : "var(--danger)",
            }}>
              {burn.total > 0 ? fmt(Math.abs(net)) : "—"}
            </div>
          </div>

          {/* Intake */}
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 2 }}>
              <Utensils size={12} color="var(--text-dim)" />
              <span style={{ fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Intake</span>
            </div>
            <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>
              {intake.total > 0 ? fmt(intake.total) : "—"}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {burn.total > 0 && (
          <div style={{ marginTop: 10 }}>
            <div style={{ height: 3, background: "var(--border2)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${Math.min(100, (intake.total / (target || 1)) * 100)}%`,
                background: isDeficit ? "var(--accent)" : "var(--danger)",
                borderRadius: 2,
                transition: "width 0.4s ease",
              }} />
            </div>
            {remaining !== 0 && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "var(--text-dim)" }}>
                  {remaining > 0 ? `${fmt(remaining)} remaining` : `${fmt(Math.abs(remaining))} over target`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
