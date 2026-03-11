import { NextRequest, NextResponse } from "next/server";
import { searchFoods, classifyQuery, type SourceFilter } from "@/lib/food/search";
import { searchRestaurants } from "@/lib/food/restaurants";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const filterParam = searchParams.get("filter") as SourceFilter | null;

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [], filter: "generic" });
  }

  const q = query.trim();
  const autoFilter = classifyQuery(q);
  const filter: SourceFilter = filterParam ?? autoFilter;

  try {
    const [apiResults, restaurantResults] = await Promise.all([
      searchFoods(q, filter),
      Promise.resolve(filter !== "generic" ? searchRestaurants(q) : []),
    ]);

    // Restaurants prepended only for branded/all queries
    const combined = filter === "generic"
      ? apiResults
      : [...restaurantResults, ...apiResults];

    // Deduplicate
    const seen = new Set<string>();
    const deduped = combined.filter((item) => {
      const key = `${item.name.toLowerCase().slice(0, 30)}|${(item.brandName ?? "").toLowerCase().slice(0, 20)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({ results: deduped.slice(0, 20), filter: autoFilter });
  } catch (err) {
    console.error("Food search error:", err);
    return NextResponse.json({ results: searchRestaurants(q), filter: autoFilter });
  }
}
