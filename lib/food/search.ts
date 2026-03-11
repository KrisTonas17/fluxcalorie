import type { FoodItem } from "../types";

// USDA FoodData Central - free, no API key required for basic search
const USDA_BASE = "https://api.nal.usda.gov/fdc/v1";
const USDA_API_KEY = process.env.USDA_API_KEY || "DEMO_KEY";

// Open Food Facts - completely open, no key needed
const OFF_BASE = "https://world.openfoodfacts.org";

export async function searchUSDA(query: string, pageSize = 10): Promise<FoodItem[]> {
  try {
    const url = `${USDA_BASE}/foods/search?query=${encodeURIComponent(query)}&pageSize=${pageSize}&api_key=${USDA_API_KEY}&dataType=Branded,Foundation,SR%20Legacy`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.foods || []).map((f: USDAFood) => normalizeUSDA(f));
  } catch {
    return [];
  }
}

export async function searchOpenFoodFacts(query: string, pageSize = 10): Promise<FoodItem[]> {
  try {
    const url = `${OFF_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=${pageSize}&fields=id,product_name,brands,nutriments,serving_size,serving_quantity`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products || [])
      .filter((p: OFFProduct) => p.product_name && p.nutriments?.["energy-kcal_100g"])
      .map((p: OFFProduct) => normalizeOFF(p));
  } catch {
    return [];
  }
}

// Merge and deduplicate results from multiple sources
export async function searchAllSources(query: string): Promise<FoodItem[]> {
  const [usda, off] = await Promise.allSettled([
    searchUSDA(query, 8),
    searchOpenFoodFacts(query, 8),
  ]);

  const results: FoodItem[] = [];
  if (usda.status === "fulfilled") results.push(...usda.value);
  if (off.status === "fulfilled") results.push(...off.value);

  // Deduplicate by name+brand similarity
  const seen = new Set<string>();
  return results.filter((item) => {
    const key = `${item.name.toLowerCase().slice(0, 30)}|${(item.brandName || "").toLowerCase().slice(0, 20)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// --- Normalization helpers ---

interface USDAFood {
  fdcId: number;
  description: string;
  brandOwner?: string;
  brandName?: string;
  dataType: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients: Array<{ nutrientId: number; nutrientName: string; value: number; unitName: string }>;
}

interface OFFProduct {
  id: string;
  product_name: string;
  brands?: string;
  serving_size?: string;
  serving_quantity?: number;
  nutriments: Record<string, number>;
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

function normalizeOFF(p: OFFProduct): FoodItem {
  const n = p.nutriments;
  const per100 = n["energy-kcal_100g"] ?? 0;
  const servingG = p.serving_quantity ?? 100;
  const scale = servingG / 100;

  return {
    id: `off_${p.id}`,
    name: p.product_name,
    brandName: p.brands,
    source: "open_food_facts",
    servingAmount: servingG,
    servingUnit: "g",
    gramWeight: servingG,
    calories: Math.round(per100 * scale),
    proteinG: n["proteins_100g"] ? n["proteins_100g"] * scale : undefined,
    carbsG: n["carbohydrates_100g"] ? n["carbohydrates_100g"] * scale : undefined,
    fatG: n["fat_100g"] ? n["fat_100g"] * scale : undefined,
    fiberG: n["fiber_100g"] ? n["fiber_100g"] * scale : undefined,
    sugarG: n["sugars_100g"] ? n["sugars_100g"] * scale : undefined,
    sodiumMg: n["sodium_100g"] ? n["sodium_100g"] * scale * 1000 : undefined,
  };
}
