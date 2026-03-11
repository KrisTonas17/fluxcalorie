import { NextRequest, NextResponse } from "next/server";
import { searchAllSources } from "@/lib/food/search";
import { searchRestaurants } from "@/lib/food/restaurants";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const q = query.trim();

  try {
    // Restaurant hits are instant (static JSON) — always run in parallel
    const [apiResults, restaurantResults] = await Promise.all([
      searchAllSources(q),
      Promise.resolve(searchRestaurants(q)),
    ]);

    // Restaurants first (more reliable for chain items), then API results
    const combined = [...restaurantResults, ...apiResults];

    // Deduplicate by normalized name+brand key
    const seen = new Set<string>();
    const deduped = combined.filter((item) => {
      const key = `${item.name.toLowerCase().slice(0, 30)}|${(item.brandName ?? "").toLowerCase().slice(0, 20)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({ results: deduped.slice(0, 25) });
  } catch (err) {
    console.error("Food search error:", err);
    // Fall back to just restaurant DB if APIs fail
    return NextResponse.json({ results: searchRestaurants(q) });
  }
}
