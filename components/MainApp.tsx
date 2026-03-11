"use client";

import { AppProvider, useApp } from "./AppContext";
import { SummaryBar } from "./SummaryBar";
import { ProfileSection } from "./sections/ProfileSection";
import { MovementSection } from "./sections/MovementSection";
import { LiftingSection } from "./sections/LiftingSection";
import { CardioSection } from "./sections/CardioSection";
import { MealsSection } from "./sections/MealsSection";
import { DashboardSection } from "./sections/DashboardSection";

const TABS = [
  { id: "dashboard", label: "Summary" },
  { id: "profile", label: "Profile" },
  { id: "movement", label: "Movement" },
  { id: "training", label: "Training" },
  { id: "food", label: "Food" },
];

function AppInner() {
  const { state, dispatch } = useApp();
  const tab = state.activeTab;

  return (
    <div style={{ minHeight: "100dvh", position: "relative", zIndex: 1 }}>
      <SummaryBar />

      {/* Tab nav */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "12px 16px 0" }}>
        <div style={{ overflowX: "auto", paddingBottom: 4 }}>
          <div className="pill-tabs" style={{ width: "max-content", minWidth: "100%" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`pill-tab ${tab === t.id ? "active" : ""}`}
                onClick={() => dispatch({ type: "SET_TAB", tab: t.id })}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "16px 16px 80px" }}>
        {tab === "dashboard" && <DashboardSection />}
        {tab === "profile" && <ProfileSection />}
        {tab === "movement" && <MovementSection />}
        {tab === "training" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <LiftingSection />
            <CardioSection />
          </div>
        )}
        {tab === "food" && <MealsSection />}
      </main>

      {/* Footer */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "10px 16px", background: "rgba(10,10,15,0.9)", backdropFilter: "blur(10px)", borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <span style={{ fontSize: 10, color: "var(--text-dim)" }}>
          FLUX · estimates only · no account · no data stored externally · built on USDA FoodData Central + Open Food Facts
        </span>
      </div>
    </div>
  );
}

export function MainApp() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
