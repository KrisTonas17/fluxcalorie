import type { FoodItem } from "../types";

const USDA_BASE = "https://api.nal.usda.gov/fdc/v1";
const USDA_API_KEY = process.env.USDA_API_KEY || "DEMO_KEY";

// Known brand/restaurant signal words — triggers branded-first ordering
const BRAND_TOKENS = new Set([
  "starbucks","chipotle","chick-fil-a","chickfila","panera","sweetgreen","cava",
  "panda","subway","mcdonald","mcdonalds","shake shack","shakeshack","in-n-out",
  "innout","dunkin","wingstop","jersey mike","raising cane","quest","clif","rxbar",
  "kind bar","larabar","built bar","nature valley","special k","cheerios","oikos",
  "chobani","fage","siggi","kodiak","pop-tart","fiber one","lean cuisine","amy's",
  "muscle milk","premier protein","fairlife","core power","protein one",
]);

export type SourceFilter = "all" | "generic" | "branded";

export function classifyQuery(query: string): SourceFilter {
  const lower = query.toLowerCase();
  const tokens = lower.split(/\s+/);
  // If any token matches a known brand → branded
  if (tokens.some((t) => BRAND_TOKENS.has(t))) return "branded";
  // Short query (≤2 words, no digits) → lean generic
  if (tokens.length <= 2 && !/\d/.test(query)) return "generic";
  return "all";
}

// USDA dataType priority: Foundation/SR Legacy = whole foods, Branded = packaged
async function searchUSDA(
  query: string,
  dataTypes: string,
  pageSize: number
): Promise<FoodItem[]> {
  try {
    const url =
      `${USDA_BASE}/foods/search` +
      `?query=${encodeURIComponent(query)}` +
      `&pageSize=${pageSize}` +
      `&api_key=${USDA_API_KEY}` +
      `&dataType=${dataTypes}` +
      `&sortBy=score&sortOrder=desc`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.foods || []).map((f: USDAFood) => normalizeUSDA(f));
  } catch {
    return [];
  }
}

// Score a result for relevance — exact/prefix name match scores highest
function scoreResult(item: FoodItem, query: string, filter: SourceFilter): number {
  const name = item.name.toLowerCase();
  const q = query.toLowerCase();
  const isGeneric = item.source === "usda" && !item.brandName;
  const isBranded = !!item.brandName || item.source === "restaurant";

  let score = 0;

  // Exact name match
  if (name === q) score += 100;
  // Starts with query
  else if (name.startsWith(q)) score += 60;
  // Contains query as whole word
  else if (new RegExp(`\\b${q}\\b`).test(name)) score += 40;
  // Contains query anywhere
  else if (name.includes(q)) score += 20;
  // All tokens present
  else {
    const tokens = q.split(/\s+/);
    const matched = tokens.filter((t) => name.includes(t)).length;
    score += (matched / tokens.length) * 15;
  }

  // Filter bias
  if (filter === "generic" && isGeneric) score += 30;
  if (filter === "generic" && isBranded) score -= 20;
  if (filter === "branded" && isBranded) score += 30;
  if (filter === "branded" && isGeneric) score -= 10;

  // Prefer shorter names (less complex = more likely to be the base food)
  score -= Math.min(item.name.length * 0.2, 15);

  return score;
}

export async function searchFoods(
  query: string,
  forceFilter?: SourceFilter
): Promise<FoodItem[]> {
  const filter = forceFilter ?? classifyQuery(query);

  // Choose USDA dataTypes based on filter
  let dataTypes: string;
  if (filter === "generic") {
    dataTypes = "Foundation,SR%20Legacy";
  } else if (filter === "branded") {
    dataTypes = "Branded,Foundation";
  } else {
    dataTypes = "Foundation,SR%20Legacy,Branded";
  }

  const results = await searchUSDA(query, dataTypes, 20);

  return results
    .map((item) => ({ item, score: scoreResult(item, query, filter) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

// --- Normalization ---

interface USDAFood {
  fdcId: number;
  description: string;
  brandOwner?: string;
  brandName?: string;
  dataType: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients: Array<{ nutrientId: number; value: number }>;
}

function getNutrient(nutrients: USDAFood["foodNutrients"], id: number): number | undefined {
  return nutrients.find((n) => n.nutrientId === id)?.value;
}

function normalizeUSDA(f: USDAFood): FoodItem {
  return {
    id: `usda_${f.fdcId}`,
    name: f.description,
    brandName: f.brandName || f.brandOwner,
    source: "usda",
    servingAmount: f.servingSize,
    servingUnit: f.servingSizeUnit,
    calories: getNutrient(f.foodNutrients, 1008) ?? 0,
    proteinG: getNutrient(f.foodNutrients, 1003),
    carbsG: getNutrient(f.foodNutrients, 1005),
    fatG: getNutrient(f.foodNutrients, 1004),
    fiberG: getNutrient(f.foodNutrients, 1079),
    sugarG: getNutrient(f.foodNutrients, 2000),
    sodiumMg: getNutrient(f.foodNutrients, 1093),
  };
}
