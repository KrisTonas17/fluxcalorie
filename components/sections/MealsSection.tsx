"use client";

import { useState } from "react";
import { useApp, generateId } from "@/components/AppContext";
import { FoodSearch } from "@/components/sections/FoodSearch";
import type { MealSlot } from "@/lib/types";
import { Utensils, Plus, X, ChevronDown, ChevronUp } from "lucide-react";

const DEFAULT_SLOTS: Array<{ key: MealSlot; label: string; emoji: string }> = [
  { key: "breakfast", label: "Breakfast", emoji: "☀️" },
  { key: "snack1", label: "Snack", emoji: "🍎" },
  { key: "lunch", label: "Lunch", emoji: "🥗" },
  { key: "snack2", label: "Snack", emoji: "🥜" },
  { key: "dinner", label: "Dinner", emoji: "🍽" },
  { key: "snack3", label: "Snack", emoji: "🌙" },
];

function fmt(n: number) { return Math.round(n).toLocaleString(); }

interface MealCardProps {
  slotKey: MealSlot;
  label: string;
  emoji: string;
  isCustom?: boolean;
  onRemoveSlot?: () => void;
}

function MealCard({ slotKey, label, emoji, isCustom, onRemoveSlot }: MealCardProps) {
  const { state, dispatch } = useApp();
  const entries = state.dayLog.meals?.[slotKey] ?? [];
  const mealCals = entries.reduce((sum, e) => sum + e.calories * e.quantity, 0);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="meal-section">
      <div className="meal-header" onClick={() => setOpen(!open)}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16 }}>{emoji}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{label}</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
              {entries.length === 0 ? "Nothing logged" : `${entries.length} item${entries.length > 1 ? "s" : ""}`}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {mealCals > 0 && (
            <span className="mono" style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)" }}>
              {fmt(mealCals)}
            </span>
          )}
          {isCustom && onRemoveSlot && (
            <button className="btn btn-danger" style={{ padding: "4px 8px", fontSize: 11 }} onClick={(e) => { e.stopPropagation(); onRemoveSlot(); }}>
              <X size={10} />
            </button>
          )}
          {open ? <ChevronUp size={15} color="var(--text-dim)" /> : <ChevronDown size={15} color="var(--text-dim)" />}
        </div>
      </div>

      {open && (
        <div className="meal-body">
          {/* Entries */}
          {entries.map((entry) => (
            <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{entry.name}</div>
                {(entry.servingAmount || entry.quantity > 1) && (
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                    {entry.quantity > 1 && `×${entry.quantity} · `}
                    {entry.servingAmount && `${entry.servingAmount}${entry.servingUnit ?? ""}`}
                  </div>
                )}
                {(entry.proteinG != null || entry.carbsG != null || entry.fatG != null) && (
                  <div style={{ fontSize: 10, color: "var(--text-dim)", display: "flex", gap: 8, marginTop: 2 }}>
                    {entry.proteinG != null && <span>P {Math.round(entry.proteinG * entry.quantity)}g</span>}
                    {entry.carbsG != null && <span>C {Math.round(entry.carbsG * entry.quantity)}g</span>}
                    {entry.fatG != null && <span>F {Math.round(entry.fatG * entry.quantity)}g</span>}
                  </div>
                )}
              </div>
              <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", flexShrink: 0 }}>
                {fmt(entry.calories * entry.quantity)}
              </span>
              <button
                className="btn btn-danger"
                style={{ padding: "4px 8px", fontSize: 11, flexShrink: 0 }}
                onClick={() => dispatch({ type: "REMOVE_MEAL_ENTRY", slot: slotKey, entryId: entry.id })}
              >
                <X size={10} />
              </button>
            </div>
          ))}

          {/* Add food toggle */}
          {searchOpen ? (
            <div style={{ padding: "12px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border2)" }}>
              <FoodSearch slot={slotKey} onAdded={() => setSearchOpen(false)} />
              <button className="btn btn-ghost" style={{ marginTop: 8, fontSize: 12, padding: "7px 12px" }} onClick={() => setSearchOpen(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn btn-ghost" style={{ width: "100%", borderStyle: "dashed" }} onClick={() => setSearchOpen(true)}>
              <Plus size={13} /> Add food
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function MealsSection() {
  const { state, dispatch } = useApp();
  const customSlots = state.dayLog.customMealSlots ?? [];
  const [newSlotName, setNewSlotName] = useState("");
  const [addingSlot, setAddingSlot] = useState(false);

  const totalCals = state.intake.total;
  const totalP = state.intake.proteinG;
  const totalC = state.intake.carbsG;
  const totalF = state.intake.fatG;

  function addSlot() {
    if (!newSlotName.trim()) return;
    dispatch({ type: "ADD_CUSTOM_SLOT", name: newSlotName.trim() });
    setNewSlotName("");
    setAddingSlot(false);
  }

  function removeCustomSlot(name: string) {
    const slots = customSlots.filter((s) => s !== name);
    const meals = { ...(state.dayLog.meals || {}) };
    delete meals[name];
    dispatch({ type: "ADD_CUSTOM_SLOT", name: "__REMOVE__" });
    // Simple workaround: re-dispatch all except removed
    dispatch({ type: "ADD_CUSTOM_SLOT", name } as { type: "ADD_CUSTOM_SLOT"; name: string });
  }

  return (
    <div className="card animate-fadeup" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Utensils size={15} color="var(--info)" />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Food & Meals</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Search database or enter manually</div>
        </div>
      </div>

      {/* Totals row */}
      {totalCals > 0 && (
        <div style={{ padding: "12px 14px", background: "var(--surface2)", borderRadius: 8, border: "1px solid var(--border2)", marginBottom: 16, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 2 }}>Total</div>
            <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>{fmt(totalCals)}</div>
          </div>
          <div style={{ width: 1, background: "var(--border)", flexShrink: 0 }} />
          {totalP > 0 && <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 2 }}>Protein</div><div className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{Math.round(totalP)}g</div></div>}
          {totalC > 0 && <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 2 }}>Carbs</div><div className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{Math.round(totalC)}g</div></div>}
          {totalF > 0 && <div style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: "var(--text-dim)", marginBottom: 2 }}>Fat</div><div className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{Math.round(totalF)}g</div></div>}
        </div>
      )}

      {/* Meal cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {DEFAULT_SLOTS.map((s) => (
          <MealCard key={s.key} slotKey={s.key} label={s.label} emoji={s.emoji} />
        ))}
        {customSlots.filter((s) => s !== "__REMOVE__").map((s) => (
          <MealCard key={s} slotKey={s} label={s} emoji="🍴" isCustom onRemoveSlot={() => removeCustomSlot(s)} />
        ))}
      </div>

      {/* Add custom slot */}
      <div style={{ marginTop: 12 }}>
        {addingSlot ? (
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              placeholder="Slot name (e.g. Pre-workout, Late night)"
              value={newSlotName}
              onChange={(e) => setNewSlotName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSlot()}
              autoFocus
            />
            <button className="btn btn-primary" onClick={addSlot} style={{ flexShrink: 0 }}>Add</button>
            <button className="btn btn-ghost" onClick={() => setAddingSlot(false)} style={{ flexShrink: 0 }}>Cancel</button>
          </div>
        ) : (
          <button className="btn btn-ghost" style={{ width: "100%", borderStyle: "dashed" }} onClick={() => setAddingSlot(true)}>
            <Plus size={13} /> Add custom meal slot
          </button>
        )}
      </div>
    </div>
  );
}
