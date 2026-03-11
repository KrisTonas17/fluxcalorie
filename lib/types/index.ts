export type Sex = "male" | "female";
export type StepPace = "casual" | "normal" | "brisk";
export type NonStepNeatLevel = "very_low" | "low" | "moderate" | "high" | "very_high";
export type LiftingIntensity = "light" | "moderate" | "hard" | "very_hard" | "circuit";
export type CardioMode = "walking" | "jogging" | "running" | "elliptical" | "stairmaster" | "rowing";
export type BodyPart =
  | "legs_glutes" | "back" | "chest_back" | "chest_triceps" | "back_biceps"
  | "push" | "pull" | "full_body" | "upper_body" | "lower_body"
  | "chest" | "shoulders" | "arms" | "core";

export interface UserProfile {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  bodyFatPercent?: number;
  trainedLifter: boolean;
  targetCalories?: number;
}

export interface LiftingSession {
  durationMin: number;
  sets: number;
  avgRestSec: number;
  intensity: LiftingIntensity;
  bodyPart: BodyPart; // kept for backward compat
  bodyParts?: BodyPart[]; // multi-select
}

export interface CardioSession {
  mode: CardioMode;
  durationMin: number;
  speedMph?: number;
  inclinePercent?: number;
  intensity?: "moderate" | "vigorous" | "hard" | "intervals";
  watts?: number;
}

export interface DailyMovement {
  nonStepNeatLevel: NonStepNeatLevel;
  steps: number;
  stepPace: StepPace;
}

export interface MacroInput {
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface FoodItem {
  id: string;
  name: string;
  brandName?: string;
  source: string;
  servingAmount?: number;
  servingUnit?: string;
  gramWeight?: number;
  calories: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  fiberG?: number;
  sugarG?: number;
  sodiumMg?: number;
}

export interface MealEntry {
  id: string;
  foodId?: string;
  name: string;
  calories: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  servingAmount?: number;
  servingUnit?: string;
  quantity: number;
  isManual: boolean;
}

export type MealSlot = "breakfast" | "snack1" | "lunch" | "snack2" | "dinner" | "snack3" | string;

export interface DayLog {
  date: string;
  profile: UserProfile;
  movement: DailyMovement;
  lifting?: LiftingSession;
  cardio?: CardioSession;
  meals: Record<MealSlot, MealEntry[]>;
  customMealSlots: string[];
}

export interface BurnBreakdown {
  rmr: number;
  rmrFormula: string;
  nonStepNeat: number;
  liftingCalories: number;
  liftingEPOC: number;
  cardioCalories: number;
  cardioEPOC: number;
  stepCalories: number;
  tef: number;
  totalBurn: number;
}

export interface IntakeBreakdown {
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  byMeal: Record<MealSlot, number>;
}

export type ConfidenceLevel = "high" | "medium" | "low";
