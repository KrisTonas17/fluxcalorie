import type { LiftingIntensity, BodyPart } from "../types";

export const INTENSITY_MET: Record<LiftingIntensity, number> = {
  light: 3.5,
  moderate: 4.2,
  hard: 5.0,
  very_hard: 6.0,
  circuit: 7.0,
};

export const INTENSITY_LABELS: Record<LiftingIntensity, string> = {
  light: "Light / Pump / Long Rest",
  moderate: "Moderate Hypertrophy",
  hard: "Hard Hypertrophy",
  very_hard: "Very Hard / Bodybuilding",
  circuit: "Circuit / Near-Continuous",
};

export const BODY_PART_MODIFIERS: Record<BodyPart, number> = {
  legs_glutes: 1.12,
  back: 1.08,
  chest_back: 1.10,
  chest_triceps: 1.06,
  back_biceps: 1.06,
  push: 1.06,
  pull: 1.06,
  full_body: 1.15,
  upper_body: 1.04,
  lower_body: 1.10,
  chest: 1.03,
  shoulders: 1.02,
  arms: 0.92,
  core: 0.90,
};

export const BODY_PART_LABELS: Record<BodyPart, string> = {
  legs_glutes: "Legs / Glutes",
  back: "Back",
  chest_back: "Chest + Back",
  chest_triceps: "Chest + Triceps",
  back_biceps: "Back + Biceps",
  push: "Push",
  pull: "Pull",
  full_body: "Full Body",
  upper_body: "Upper Body",
  lower_body: "Lower Body",
  chest: "Chest",
  shoulders: "Shoulders",
  arms: "Arms",
  core: "Core",
};

export function getSetModifier(sets: number): number {
  if (sets < 8) return 0.92;
  if (sets <= 16) return 1.00;
  if (sets <= 24) return 1.06;
  if (sets <= 35) return 1.10;
  return 1.12;
}

export function getRestModifier(avgRestSec: number): number {
  if (avgRestSec < 30) return 1.12;
  if (avgRestSec <= 60) return 1.08;
  if (avgRestSec <= 90) return 1.04;
  if (avgRestSec <= 150) return 1.00;
  if (avgRestSec <= 240) return 0.95;
  return 0.90;
}

export function calculateLiftingCalories({
  weightKg,
  durationMin,
  intensity,
  sets,
  avgRestSec,
  bodyPart,
}: {
  weightKg: number;
  durationMin: number;
  intensity: LiftingIntensity;
  sets: number;
  avgRestSec: number;
  bodyPart: BodyPart;
}): number {
  const baseMET = INTENSITY_MET[intensity];
  const setMod = getSetModifier(sets);
  const restMod = getRestModifier(avgRestSec);
  const bpMod = BODY_PART_MODIFIERS[bodyPart];
  return ((baseMET * 3.5 * weightKg) / 200) * durationMin * setMod * restMod * bpMod;
}

export const EPOC_MAP: Record<LiftingIntensity, number> = {
  light: 0.00,
  moderate: 0.03,
  hard: 0.05,
  very_hard: 0.07,
  circuit: 0.08,
};

export function calculateLiftingEPOC(liftingCalories: number, intensity: LiftingIntensity): number {
  return liftingCalories * EPOC_MAP[intensity];
}

// Multi-select: average the modifiers, cap at full_body level (1.15)
export function getMultiBodyPartModifier(bodyParts: BodyPart[]): number {
  if (bodyParts.length === 0) return 1.0;
  if (bodyParts.length === 1) return BODY_PART_MODIFIERS[bodyParts[0]];
  const avg = bodyParts.reduce((sum, bp) => sum + BODY_PART_MODIFIERS[bp], 0) / bodyParts.length;
  return Math.min(avg, BODY_PART_MODIFIERS.full_body); // cap at 1.15
}

export function calculateLiftingCaloriesMulti({
  weightKg, durationMin, intensity, sets, avgRestSec, bodyParts,
}: {
  weightKg: number; durationMin: number; intensity: LiftingIntensity;
  sets: number; avgRestSec: number; bodyParts: BodyPart[];
}): number {
  const baseMET = INTENSITY_MET[intensity];
  const setMod = getSetModifier(sets);
  const restMod = getRestModifier(avgRestSec);
  const bpMod = getMultiBodyPartModifier(bodyParts);
  return ((baseMET * 3.5 * weightKg) / 200) * durationMin * setMod * restMod * bpMod;
}
