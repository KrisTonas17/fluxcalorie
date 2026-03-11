import type { FoodItem } from "../types";

// Curated static dataset: top 20 health-conscious chains
// Nutrition data sourced from official brand nutrition pages / MenuStat
// Serving = 1 standard item unless noted

const RESTAURANT_ITEMS: Omit<FoodItem, "id">[] = [
  // ── STARBUCKS ──────────────────────────────────────────────────────
  { name: "Turkey Bacon Cheddar Breakfast Sandwich", brandName: "Starbucks", source: "restaurant", servingAmount: 1, servingUnit: "sandwich", calories: 430, proteinG: 25, carbsG: 45, fatG: 16, sodiumMg: 890 },
  { name: "Spinach Feta Wrap", brandName: "Starbucks", source: "restaurant", servingAmount: 1, servingUnit: "wrap", calories: 290, proteinG: 20, carbsG: 34, fatG: 10, sodiumMg: 830 },
  { name: "Egg Bites Bacon Gruyere (2 bites)", brandName: "Starbucks", source: "restaurant", servingAmount: 2, servingUnit: "bites", calories: 310, proteinG: 19, carbsG: 13, fatG: 20, sodiumMg: 680 },
  { name: "Egg Bites Egg White Roasted Red Pepper (2 bites)", brandName: "Starbucks", source: "restaurant", servingAmount: 2, servingUnit: "bites", calories: 170, proteinG: 13, carbsG: 13, fatG: 6, sodiumMg: 470 },
  { name: "Impossible Breakfast Sandwich", brandName: "Starbucks", source: "restaurant", servingAmount: 1, servingUnit: "sandwich", calories: 430, proteinG: 26, carbsG: 47, fatG: 15, sodiumMg: 870 },
  { name: "Protein Box Eggs & Cheddar", brandName: "Starbucks", source: "restaurant", servingAmount: 1, servingUnit: "box", calories: 470, proteinG: 25, carbsG: 45, fatG: 22, sodiumMg: 720 },
  { name: "Protein Box PB&J", brandName: "Starbucks", source: "restaurant", servingAmount: 1, servingUnit: "box", calories: 500, proteinG: 19, carbsG: 62, fatG: 20, sodiumMg: 440 },
  { name: "Latte (Grande, 2% milk)", brandName: "Starbucks", source: "restaurant", servingAmount: 16, servingUnit: "fl oz", calories: 190, proteinG: 13, carbsG: 19, fatG: 7, sodiumMg: 170 },
  { name: "Cold Brew (Grande, black)", brandName: "Starbucks", source: "restaurant", servingAmount: 16, servingUnit: "fl oz", calories: 5, proteinG: 0, carbsG: 0, fatG: 0, sodiumMg: 15 },
  { name: "Oatmeal Classic Whole Grain", brandName: "Starbucks", source: "restaurant", servingAmount: 1, servingUnit: "cup", calories: 160, proteinG: 5, carbsG: 28, fatG: 2.5, sodiumMg: 125 },

  // ── CHIPOTLE ───────────────────────────────────────────────────────
  { name: "Burrito Bowl Chicken (rice, black beans, fajita veg, salsa)", brandName: "Chipotle", source: "restaurant", servingAmount: 1, servingUnit: "bowl", calories: 570, proteinG: 50, carbsG: 60, fatG: 12, sodiumMg: 1520 },
  { name: "Burrito Bowl Steak", brandName: "Chipotle", source: "restaurant", servingAmount: 1, servingUnit: "bowl", calories: 560, proteinG: 45, carbsG: 57, fatG: 14, sodiumMg: 1490 },
  { name: "Salad Bowl Chicken (romaine, fajita veg, salsa, guac)", brandName: "Chipotle", source: "restaurant", servingAmount: 1, servingUnit: "bowl", calories: 510, proteinG: 46, carbsG: 28, fatG: 24, sodiumMg: 1380 },
  { name: "Chicken (protein only, 4 oz)", brandName: "Chipotle", source: "restaurant", servingAmount: 113, servingUnit: "g", calories: 180, proteinG: 32, carbsG: 0, fatG: 7, sodiumMg: 510 },
  { name: "Sofritas (protein only)", brandName: "Chipotle", source: "restaurant", servingAmount: 113, servingUnit: "g", calories: 150, proteinG: 8, carbsG: 9, fatG: 10, sodiumMg: 530 },
  { name: "Guacamole (side)", brandName: "Chipotle", source: "restaurant", servingAmount: 1, servingUnit: "side", calories: 230, proteinG: 3, carbsG: 13, fatG: 22, sodiumMg: 300 },
  { name: "Brown Rice", brandName: "Chipotle", source: "restaurant", servingAmount: 1, servingUnit: "scoop", calories: 210, proteinG: 4, carbsG: 40, fatG: 5, sodiumMg: 390 },
  { name: "Black Beans", brandName: "Chipotle", source: "restaurant", servingAmount: 1, servingUnit: "scoop", calories: 130, proteinG: 8, carbsG: 22, fatG: 1, sodiumMg: 250 },

  // ── CHICK-FIL-A ────────────────────────────────────────────────────
  { name: "Grilled Chicken Sandwich", brandName: "Chick-fil-A", source: "restaurant", servingAmount: 1, servingUnit: "sandwich", calories: 390, proteinG: 43, carbsG: 37, fatG: 9, sodiumMg: 1120 },
  { name: "Grilled Nuggets (8-count)", brandName: "Chick-fil-A", source: "restaurant", servingAmount: 8, servingUnit: "pieces", calories: 140, proteinG: 25, carbsG: 3, fatG: 3.5, sodiumMg: 440 },
  { name: "Grilled Market Salad", brandName: "Chick-fil-A", source: "restaurant", servingAmount: 1, servingUnit: "salad", calories: 330, proteinG: 26, carbsG: 34, fatG: 14, sodiumMg: 740 },
  { name: "Spicy Grilled Deluxe Sandwich", brandName: "Chick-fil-A", source: "restaurant", servingAmount: 1, servingUnit: "sandwich", calories: 430, proteinG: 44, carbsG: 38, fatG: 12, sodiumMg: 1240 },
  { name: "Greek Yogurt Parfait", brandName: "Chick-fil-A", source: "restaurant", servingAmount: 1, servingUnit: "cup", calories: 230, proteinG: 13, carbsG: 31, fatG: 6, sodiumMg: 90 },
  { name: "Superfood Side (kale/broccolini)", brandName: "Chick-fil-A", source: "restaurant", servingAmount: 1, servingUnit: "side", calories: 170, proteinG: 4, carbsG: 18, fatG: 9, sodiumMg: 330 },

  // ── SWEETGREEN ─────────────────────────────────────────────────────
  { name: "Harvest Bowl", brandName: "Sweetgreen", source: "restaurant", servingAmount: 1, servingUnit: "bowl", calories: 710, proteinG: 35, carbsG: 64, fatG: 36, sodiumMg: 990 },
  { name: "Chicken + Brussels Salad", brandName: "Sweetgreen", source: "restaurant", servingAmount: 1, servingUnit: "bowl", calories: 590, proteinG: 42, carbsG: 35, fatG: 31, sodiumMg: 770 },
  { name: "Kale Caesar (no protein)", brandName: "Sweetgreen", source: "restaurant", servingAmount: 1, servingUnit: "bowl", calories: 430, proteinG: 15, carbsG: 26, fatG: 32, sodiumMg: 620 },
  { name: "Roasted Chicken (add-on)", brandName: "Sweetgreen", source: "restaurant", servingAmount: 1, servingUnit: "portion", calories: 165, proteinG: 30, carbsG: 0, fatG: 4, sodiumMg: 320 },

  // ── PANERA ─────────────────────────────────────────────────────────
  { name: "Fuji Apple Chicken Salad (whole)", brandName: "Panera Bread", source: "restaurant", servingAmount: 1, servingUnit: "salad", calories: 580, proteinG: 35, carbsG: 53, fatG: 26, sodiumMg: 1140 },
  { name: "Green Goddess Cobb Salad with Chicken", brandName: "Panera Bread", source: "restaurant", servingAmount: 1, servingUnit: "salad", calories: 550, proteinG: 42, carbsG: 18, fatG: 35, sodiumMg: 1010 },
  { name: "Turkey Sandwich on Whole Grain", brandName: "Panera Bread", source: "restaurant", servingAmount: 1, servingUnit: "sandwich", calories: 450, proteinG: 35, carbsG: 48, fatG: 13, sodiumMg: 1210 },
  { name: "Broth Bowl Lentil Quinoa", brandName: "Panera Bread", source: "restaurant", servingAmount: 1, servingUnit: "bowl", calories: 340, proteinG: 15, carbsG: 56, fatG: 7, sodiumMg: 1100 },
  { name: "Steel Cut Oatmeal with Almonds", brandName: "Panera Bread", source: "restaurant", servingAmount: 1, servingUnit: "bowl", calories: 330, proteinG: 10, carbsG: 49, fatG: 10, sodiumMg: 125 },

  // ── PANDA EXPRESS ──────────────────────────────────────────────────
  { name: "Grilled Teriyaki Chicken", brandName: "Panda Express", source: "restaurant", servingAmount: 1, servingUnit: "entree", calories: 300, proteinG: 36, carbsG: 8, fatG: 13, sodiumMg: 530 },
  { name: "String Bean Chicken Breast", brandName: "Panda Express", source: "restaurant", servingAmount: 1, servingUnit: "entree", calories: 190, proteinG: 14, carbsG: 15, fatG: 9, sodiumMg: 730 },
  { name: "Broccoli Beef", brandName: "Panda Express", source: "restaurant", servingAmount: 1, servingUnit: "entree", calories: 150, proteinG: 9, carbsG: 13, fatG: 7, sodiumMg: 530 },
  { name: "Super Greens (side)", brandName: "Panda Express", source: "restaurant", servingAmount: 1, servingUnit: "side", calories: 90, proteinG: 6, carbsG: 10, fatG: 3.5, sodiumMg: 340 },
  { name: "Mixed Vegetables (side)", brandName: "Panda Express", source: "restaurant", servingAmount: 1, servingUnit: "side", calories: 70, proteinG: 3, carbsG: 12, fatG: 1, sodiumMg: 360 },
  { name: "Brown Steamed Rice (side)", brandName: "Panda Express", source: "restaurant", servingAmount: 1, servingUnit: "side", calories: 420, proteinG: 9, carbsG: 86, fatG: 4, sodiumMg: 15 },

  // ── SUBWAY ─────────────────────────────────────────────────────────
  { name: "Rotisserie Chicken 6\" (9-grain wheat, no sauce)", brandName: "Subway", source: "restaurant", servingAmount: 1, servingUnit: "6-inch", calories: 350, proteinG: 26, carbsG: 47, fatG: 6, sodiumMg: 720 },
  { name: "Turkey Breast 6\" (9-grain wheat)", brandName: "Subway", source: "restaurant", servingAmount: 1, servingUnit: "6-inch", calories: 280, proteinG: 18, carbsG: 46, fatG: 4, sodiumMg: 760 },
  { name: "Veggie Delite 6\"", brandName: "Subway", source: "restaurant", servingAmount: 1, servingUnit: "6-inch", calories: 200, proteinG: 8, carbsG: 39, fatG: 2, sodiumMg: 410 },
  { name: "Rotisserie Chicken Salad (no dressing)", brandName: "Subway", source: "restaurant", servingAmount: 1, servingUnit: "salad", calories: 170, proteinG: 22, carbsG: 11, fatG: 4.5, sodiumMg: 560 },

  // ── MCDONALD'S ─────────────────────────────────────────────────────
  { name: "McDouble", brandName: "McDonald's", source: "restaurant", servingAmount: 1, servingUnit: "burger", calories: 400, proteinG: 22, carbsG: 35, fatG: 20, sodiumMg: 920 },
  { name: "Egg McMuffin", brandName: "McDonald's", source: "restaurant", servingAmount: 1, servingUnit: "sandwich", calories: 310, proteinG: 17, carbsG: 30, fatG: 13, sodiumMg: 820 },
  { name: "Grilled Chicken Sandwich", brandName: "McDonald's", source: "restaurant", servingAmount: 1, servingUnit: "sandwich", calories: 380, proteinG: 37, carbsG: 44, fatG: 7, sodiumMg: 960 },
  { name: "Side Salad (no dressing)", brandName: "McDonald's", source: "restaurant", servingAmount: 1, servingUnit: "salad", calories: 15, proteinG: 1, carbsG: 3, fatG: 0, sodiumMg: 10 },

  // ── SHAKE SHACK ────────────────────────────────────────────────────
  { name: "SmokeShack Burger", brandName: "Shake Shack", source: "restaurant", servingAmount: 1, servingUnit: "burger", calories: 580, proteinG: 29, carbsG: 36, fatG: 37, sodiumMg: 1010 },
  { name: "ShackBurger (single)", brandName: "Shake Shack", source: "restaurant", servingAmount: 1, servingUnit: "burger", calories: 490, proteinG: 26, carbsG: 35, fatG: 27, sodiumMg: 830 },
  { name: "Chick'n Shack Sandwich", brandName: "Shake Shack", source: "restaurant", servingAmount: 1, servingUnit: "sandwich", calories: 630, proteinG: 31, carbsG: 55, fatG: 33, sodiumMg: 1430 },

  // ── CAVA ───────────────────────────────────────────────────────────
  { name: "Greens + Grains Bowl Chicken", brandName: "CAVA", source: "restaurant", servingAmount: 1, servingUnit: "bowl", calories: 640, proteinG: 44, carbsG: 58, fatG: 23, sodiumMg: 1050 },
  { name: "Pita with Grilled Chicken + Tzatziki", brandName: "CAVA", source: "restaurant", servingAmount: 1, servingUnit: "pita", calories: 530, proteinG: 36, carbsG: 55, fatG: 17, sodiumMg: 890 },
  { name: "Roasted Chicken (protein)", brandName: "CAVA", source: "restaurant", servingAmount: 1, servingUnit: "portion", calories: 130, proteinG: 25, carbsG: 1, fatG: 3, sodiumMg: 280 },
  { name: "Falafel (3 pieces)", brandName: "CAVA", source: "restaurant", servingAmount: 3, servingUnit: "pieces", calories: 150, proteinG: 6, carbsG: 17, fatG: 7, sodiumMg: 290 },
  { name: "Tzatziki", brandName: "CAVA", source: "restaurant", servingAmount: 1, servingUnit: "scoop", calories: 35, proteinG: 2, carbsG: 2, fatG: 2, sodiumMg: 75 },

  // ── RAISING CANE'S ─────────────────────────────────────────────────
  { name: "3 Chicken Fingers", brandName: "Raising Cane's", source: "restaurant", servingAmount: 3, servingUnit: "pieces", calories: 330, proteinG: 23, carbsG: 21, fatG: 16, sodiumMg: 710 },
  { name: "The Box Combo (3 fingers, crinkle fries, toast, slaw)", brandName: "Raising Cane's", source: "restaurant", servingAmount: 1, servingUnit: "combo", calories: 1000, proteinG: 34, carbsG: 109, fatG: 50, sodiumMg: 1970 },

  // ── JERSEY MIKE'S ──────────────────────────────────────────────────
  { name: "Turkey & Provolone Regular Sub", brandName: "Jersey Mike's", source: "restaurant", servingAmount: 1, servingUnit: "regular", calories: 560, proteinG: 32, carbsG: 59, fatG: 21, sodiumMg: 1500 },
  { name: "Club Sub Regular", brandName: "Jersey Mike's", source: "restaurant", servingAmount: 1, servingUnit: "regular", calories: 610, proteinG: 35, carbsG: 58, fatG: 25, sodiumMg: 1640 },

  // ── WINGSTOP ───────────────────────────────────────────────────────
  { name: "Classic Wings Original Hot (6 wings)", brandName: "Wingstop", source: "restaurant", servingAmount: 6, servingUnit: "wings", calories: 500, proteinG: 38, carbsG: 0, fatG: 38, sodiumMg: 1260 },
  { name: "Boneless Wings Garlic Parmesan (6)", brandName: "Wingstop", source: "restaurant", servingAmount: 6, servingUnit: "wings", calories: 600, proteinG: 28, carbsG: 42, fatG: 34, sodiumMg: 1080 },
  { name: "Veggie Sticks with Ranch", brandName: "Wingstop", source: "restaurant", servingAmount: 1, servingUnit: "side", calories: 220, proteinG: 1, carbsG: 6, fatG: 22, sodiumMg: 370 },

  // ── IN-N-OUT ───────────────────────────────────────────────────────
  { name: "Hamburger with Onion (no spread)", brandName: "In-N-Out Burger", source: "restaurant", servingAmount: 1, servingUnit: "burger", calories: 310, proteinG: 16, carbsG: 41, fatG: 10, sodiumMg: 650 },
  { name: "Double-Double Burger", brandName: "In-N-Out Burger", source: "restaurant", servingAmount: 1, servingUnit: "burger", calories: 670, proteinG: 37, carbsG: 41, fatG: 41, sodiumMg: 1440 },
  { name: "Protein Style Cheeseburger (lettuce wrap)", brandName: "In-N-Out Burger", source: "restaurant", servingAmount: 1, servingUnit: "burger", calories: 330, proteinG: 18, carbsG: 11, fatG: 25, sodiumMg: 720 },

  // ── DUNKIN' ────────────────────────────────────────────────────────
  { name: "Wake-Up Wrap Egg & Cheese", brandName: "Dunkin'", source: "restaurant", servingAmount: 1, servingUnit: "wrap", calories: 180, proteinG: 8, carbsG: 17, fatG: 9, sodiumMg: 410 },
  { name: "Veggie Egg White Omelet Sandwich", brandName: "Dunkin'", source: "restaurant", servingAmount: 1, servingUnit: "sandwich", calories: 290, proteinG: 16, carbsG: 38, fatG: 8, sodiumMg: 690 },
  { name: "Medium Hot Coffee (black)", brandName: "Dunkin'", source: "restaurant", servingAmount: 14, servingUnit: "fl oz", calories: 5, proteinG: 0, carbsG: 1, fatG: 0, sodiumMg: 10 },

  // ── WHOLE FOODS HOT BAR ────────────────────────────────────────────
  { name: "Rotisserie Chicken (breast, skinless)", brandName: "Whole Foods", source: "restaurant", servingAmount: 113, servingUnit: "g", calories: 170, proteinG: 34, carbsG: 0, fatG: 3.5, sodiumMg: 480 },
  { name: "Chicken Tikka Masala (hot bar)", brandName: "Whole Foods", source: "restaurant", servingAmount: 227, servingUnit: "g", calories: 310, proteinG: 22, carbsG: 18, fatG: 16, sodiumMg: 640 },
  { name: "Quinoa Salad (grain bar)", brandName: "Whole Foods", source: "restaurant", servingAmount: 170, servingUnit: "g", calories: 280, proteinG: 9, carbsG: 42, fatG: 9, sodiumMg: 380 },
];

// Add stable IDs
export const RESTAURANT_DB: FoodItem[] = RESTAURANT_ITEMS.map((item, i) => ({
  ...item,
  id: `restaurant_${i}_${item.brandName?.replace(/\s/g, "").toLowerCase()}_${item.name.slice(0, 10).replace(/\s/g, "").toLowerCase()}`,
}));

export function searchRestaurants(query: string): FoodItem[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/);

  return RESTAURANT_DB
    .map((item) => {
      const haystack = `${item.name} ${item.brandName ?? ""}`.toLowerCase();
      const exactMatch = haystack.includes(q);
      const tokenMatches = tokens.filter((t) => haystack.includes(t)).length;
      const score = exactMatch ? 100 : tokenMatches * 20;
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
    .slice(0, 8);
}
