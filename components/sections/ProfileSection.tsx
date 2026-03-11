"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/components/AppContext";
import type { UserProfile } from "@/lib/types";
import { User, ChevronDown, Info } from "lucide-react";

function lbsToKg(lbs: number) { return lbs * 0.453592; }
function kgToLbs(kg: number) { return Math.round(kg / 0.453592); }
function cmToInches(cm: number) { return Math.round(cm / 2.54); }
function inchesToCm(inches: number) { return inches * 2.54; }
function feetInchesToInches(feet: number, inches: number) { return feet * 12 + inches; }

export function ProfileSection() {
  const { state, dispatch } = useApp();
  const profile = state.profile;

  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [form, setForm] = useState({
    age: profile?.age?.toString() ?? "",
    sex: profile?.sex ?? "male",
    weightLbs: profile ? kgToLbs(profile.weightKg).toString() : "",
    weightKg: profile?.weightKg?.toString() ?? "",
    feet: profile ? Math.floor(cmToInches(profile.heightCm) / 12).toString() : "",
    inches: profile ? (cmToInches(profile.heightCm) % 12).toString() : "",
    heightCm: profile?.heightCm?.toString() ?? "",
    bodyFat: profile?.bodyFatPercent?.toString() ?? "",
    trainedLifter: profile?.trainedLifter ?? false,
    targetCalories: profile?.targetCalories?.toString() ?? "",
  });
  const [saved, setSaved] = useState(false);

  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  function handleSave() {
    const age = parseInt(form.age);
    const weightKg = unit === "imperial" ? lbsToKg(parseFloat(form.weightLbs)) : parseFloat(form.weightKg);
    const heightCm = unit === "imperial" ? inchesToCm(feetInchesToInches(parseInt(form.feet), parseInt(form.inches))) : parseFloat(form.heightCm);

    if (!age || !weightKg || !heightCm) return;

    const p: UserProfile = {
      age,
      sex: form.sex as "male" | "female",
      weightKg,
      heightCm,
      bodyFatPercent: form.bodyFat ? parseFloat(form.bodyFat) : undefined,
      trainedLifter: form.trainedLifter,
      targetCalories: form.targetCalories ? parseInt(form.targetCalories) : undefined,
    };
    dispatch({ type: "SET_PROFILE", profile: p });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="card animate-fadeup" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent-glow)", border: "1px solid rgba(110,231,183,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <User size={15} color="var(--accent)" />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Profile</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Stored locally only. Never shared.</div>
        </div>
        <div className="segment" style={{ marginLeft: "auto", minWidth: 140 }}>
          <button className={`segment-option ${unit === "imperial" ? "active" : ""}`} onClick={() => setUnit("imperial")}>Imperial</button>
          <button className={`segment-option ${unit === "metric" ? "active" : ""}`} onClick={() => setUnit("metric")}>Metric</button>
        </div>
      </div>

      <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Age */}
        <div>
          <label className="label">Age</label>
          <input type="number" placeholder="32" value={form.age} onChange={(e) => set("age", e.target.value)} />
        </div>

        {/* Sex */}
        <div>
          <label className="label">Sex</label>
          <div className="segment">
            <button className={`segment-option ${form.sex === "male" ? "active" : ""}`} onClick={() => set("sex", "male")}>Male</button>
            <button className={`segment-option ${form.sex === "female" ? "active" : ""}`} onClick={() => set("sex", "female")}>Female</button>
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="label">Weight</label>
          {unit === "imperial" ? (
            <div style={{ position: "relative" }}>
              <input type="number" placeholder="185" value={form.weightLbs} onChange={(e) => set("weightLbs", e.target.value)} />
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-dim)" }}>lbs</span>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <input type="number" placeholder="84" value={form.weightKg} onChange={(e) => set("weightKg", e.target.value)} />
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-dim)" }}>kg</span>
            </div>
          )}
        </div>

        {/* Height */}
        <div>
          <label className="label">Height</label>
          {unit === "imperial" ? (
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input type="number" placeholder="5" value={form.feet} onChange={(e) => set("feet", e.target.value)} />
                <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-dim)" }}>ft</span>
              </div>
              <div style={{ position: "relative", flex: 1 }}>
                <input type="number" placeholder="11" value={form.inches} onChange={(e) => set("inches", e.target.value)} />
                <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-dim)" }}>in</span>
              </div>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <input type="number" placeholder="180" value={form.heightCm} onChange={(e) => set("heightCm", e.target.value)} />
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-dim)" }}>cm</span>
            </div>
          )}
        </div>

        {/* Body Fat */}
        <div>
          <label className="label">Body Fat % <span style={{ textTransform: "none", fontWeight: 400 }}>(optional)</span></label>
          <div style={{ position: "relative" }}>
            <input type="number" placeholder="15" value={form.bodyFat} onChange={(e) => set("bodyFat", e.target.value)} />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-dim)" }}>%</span>
          </div>
        </div>

        {/* Trained lifter */}
        <div>
          <label className="label">Trained Lifter?</label>
          <div className="segment">
            <button className={`segment-option ${form.trainedLifter ? "active" : ""}`} onClick={() => set("trainedLifter", true)}>Yes</button>
            <button className={`segment-option ${!form.trainedLifter ? "active" : ""}`} onClick={() => set("trainedLifter", false)}>No</button>
          </div>
        </div>
      </div>

      {/* Target calories */}
      <div style={{ marginTop: 14 }}>
        <label className="label">Daily Calorie Target <span style={{ textTransform: "none", fontWeight: 400 }}>(optional — defaults to your estimated burn)</span></label>
        <div style={{ position: "relative" }}>
          <input type="number" placeholder="e.g. 2200" value={form.targetCalories} onChange={(e) => set("targetCalories", e.target.value)} />
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "var(--text-dim)" }}>kcal</span>
        </div>
      </div>

      {/* Formula note */}
      {form.bodyFat && form.trainedLifter ? (
        <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--accent-glow)", borderRadius: 8, fontSize: 12, color: "var(--accent)", display: "flex", gap: 8 }}>
          <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
          Will use <strong>Cunningham</strong> equation (fat-free mass based) — more accurate for trained athletes.
        </div>
      ) : (
        <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--surface2)", borderRadius: 8, fontSize: 12, color: "var(--text-dim)", display: "flex", gap: 8 }}>
          <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
          Will use <strong>Mifflin-St Jeor</strong> equation. Add body fat % if you&apos;re a trained lifter for a more accurate estimate.
        </div>
      )}

      <button className="btn btn-primary" style={{ marginTop: 16, width: "100%", padding: "12px 16px", fontSize: 14 }} onClick={handleSave}>
        {saved ? "✓ Saved" : "Save Profile"}
      </button>
    </div>
  );
}
