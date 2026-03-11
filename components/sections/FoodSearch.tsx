"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { FoodItem, MealSlot, MealEntry } from "@/lib/types";
import type { SourceFilter } from "@/lib/food/search";
import { useApp, generateId } from "@/components/AppContext";
import { Search, Plus, Loader, AlertCircle } from "lucide-react";

interface FoodSearchProps {
  slot: MealSlot;
  onAdded?: () => void;
}

const SOURCE_TABS: { id: SourceFilter; label: string; hint: string }[] = [
  { id: "generic", label: "Whole Foods", hint: "Eggs, chicken breast, rice…" },
  { id: "branded", label: "Brands & Restaurants", hint: "Chipotle bowl, Quest bar, Starbucks…" },
];

export function FoodSearch({ slot, onAdded }: FoodSearchProps) {
  const { dispatch } = useApp();
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("generic");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [qty, setQty] = useState("1");
  const [manualMode, setManualMode] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualCals, setManualCals] = useState("");
  const [manualP, setManualP] = useState("");
  const [manualC, setManualC] = useState("");
  const [manualF, setManualF] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string, filter: SourceFilter) => {
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/food-search?q=${encodeURIComponent(q)}&filter=${filter}`);
      const data = await res.json();
      setResults(data.results || []);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-search when filter tab switches (if query already entered)
  useEffect(() => {
    if (query.length >= 2) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => search(query, sourceFilter), 150);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceFilter]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query, sourceFilter), 500); // 500ms debounce
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function selectFood(item: FoodItem) {
    setSelected(item);
    setOpen(false);
    setQuery(item.name);
    setQty("1");
  }

  function addFood() {
    if (!selected) return;
    const q = parseFloat(qty) || 1;
    const entry: MealEntry = {
      id: generateId(),
      foodId: selected.id,
      name: selected.name + (selected.brandName ? ` (${selected.brandName})` : ""),
      calories: selected.calories,
      proteinG: selected.proteinG,
      carbsG: selected.carbsG,
      fatG: selected.fatG,
      servingAmount: selected.servingAmount,
      servingUnit: selected.servingUnit,
      quantity: q,
      isManual: false,
    };
    dispatch({ type: "ADD_MEAL_ENTRY", slot, entry });
    setSelected(null);
    setQuery("");
    setQty("1");
    onAdded?.();
  }

  function addManual() {
    if (!manualName || !manualCals) return;
    const entry: MealEntry = {
      id: generateId(),
      name: manualName,
      calories: parseFloat(manualCals) || 0,
      proteinG: manualP ? parseFloat(manualP) : undefined,
      carbsG: manualC ? parseFloat(manualC) : undefined,
      fatG: manualF ? parseFloat(manualF) : undefined,
      quantity: 1,
      isManual: true,
    };
    dispatch({ type: "ADD_MEAL_ENTRY", slot, entry });
    setManualName(""); setManualCals(""); setManualP(""); setManualC(""); setManualF("");
    setManualMode(false);
    onAdded?.();
  }

  const activehint = SOURCE_TABS.find((t) => t.id === sourceFilter)?.hint ?? "";

  return (
    <div>
      {/* Top mode toggle */}
      <div className="segment" style={{ marginBottom: 10 }}>
        <button className={`segment-option ${!manualMode ? "active" : ""}`} onClick={() => setManualMode(false)}>
          Search database
        </button>
        <button className={`segment-option ${manualMode ? "active" : ""}`} onClick={() => setManualMode(true)}>
          Enter manually
        </button>
      </div>

      {!manualMode ? (
        <div ref={wrapRef} style={{ position: "relative" }}>
          {/* Source filter tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
            {SOURCE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setSourceFilter(tab.id); setSelected(null); }}
                style={{
                  flex: 1,
                  padding: "7px 10px",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: sourceFilter === tab.id ? 600 : 400,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  background: sourceFilter === tab.id ? "var(--surface2)" : "transparent",
                  border: `1px solid ${sourceFilter === tab.id ? "var(--accent)" : "var(--border2)"}`,
                  color: sourceFilter === tab.id ? "var(--accent)" : "var(--text-dim)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div style={{ position: "relative" }}>
            <Search size={14} color="var(--text-dim)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="text"
              placeholder={activehint}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
              style={{ paddingLeft: 34 }}
              onFocus={() => results.length > 0 && setOpen(true)}
            />
            {loading && (
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
                <Loader size={14} color="var(--text-dim)" style={{ animation: "spin 0.8s linear infinite" }} />
              </span>
            )}
          </div>

          {/* Dropdown */}
          {open && results.length > 0 && (
            <div className="search-dropdown">
              {results.map((item) => (
                <div key={item.id} className="search-result-item" onClick={() => selectFood(item)}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 1 }}>
                      {item.brandName && <span>{item.brandName} · </span>}
                      {item.servingAmount && <span>{item.servingAmount}{item.servingUnit ?? "g"}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                    <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>
                      {Math.round(item.calories)}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-dim)" }}>kcal</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {open && results.length === 0 && !loading && query.length >= 2 && (
            <div className="search-dropdown" style={{ padding: "14px", display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={13} color="var(--text-dim)" />
              <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
                No results — try the other tab or enter manually.
              </span>
            </div>
          )}

          {/* Selected item confirm */}
          {selected && (
            <div style={{ marginTop: 10, padding: "12px 14px", background: "var(--surface2)", borderRadius: 8, border: "1px solid var(--border2)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{selected.name}</div>
              {selected.brandName && <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 8 }}>{selected.brandName}</div>}
              <div style={{ display: "flex", gap: 14, fontSize: 11, color: "var(--text-dim)", marginBottom: 10, flexWrap: "wrap" }}>
                {selected.proteinG != null && <span>P <strong style={{ color: "var(--text)" }}>{Math.round(selected.proteinG)}g</strong></span>}
                {selected.carbsG != null && <span>C <strong style={{ color: "var(--text)" }}>{Math.round(selected.carbsG)}g</strong></span>}
                {selected.fatG != null && <span>F <strong style={{ color: "var(--text)" }}>{Math.round(selected.fatG)}g</strong></span>}
                <span style={{ marginLeft: "auto" }}>per {selected.servingAmount ?? 1}{selected.servingUnit ?? "g"}</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <label className="label">Servings / quantity</label>
                  <input type="number" step="0.25" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="1" />
                </div>
                <div style={{ paddingBottom: 2 }}>
                  <span className="mono" style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>
                    {Math.round(selected.calories * (parseFloat(qty) || 1))}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-dim)" }}> kcal</span>
                </div>
                <div style={{ paddingBottom: 2 }}>
                  <button className="btn btn-primary" onClick={addFood}>
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input type="text" placeholder="Item name" value={manualName} onChange={(e) => setManualName(e.target.value)} />
          <div className="grid-4col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            <div><label className="label">Calories</label><input type="number" placeholder="350" value={manualCals} onChange={(e) => setManualCals(e.target.value)} /></div>
            <div><label className="label">Protein (g)</label><input type="number" placeholder="30" value={manualP} onChange={(e) => setManualP(e.target.value)} /></div>
            <div><label className="label">Carbs (g)</label><input type="number" placeholder="0" value={manualC} onChange={(e) => setManualC(e.target.value)} /></div>
            <div><label className="label">Fat (g)</label><input type="number" placeholder="10" value={manualF} onChange={(e) => setManualF(e.target.value)} /></div>
          </div>
          <button className="btn btn-primary" onClick={addManual} style={{ alignSelf: "flex-start" }}>
            <Plus size={14} /> Add to meal
          </button>
        </div>
      )}
    </div>
  );
}
