import type { CardioMode } from "../types";

function mphToMpm(mph: number): number {
  return mph * 26.8;
}

export function calculateWalkingCalories({
  weightKg, speedMph, inclinePercent, durationMin,
}: { weightKg: number; speedMph: number; inclinePercent: number; durationMin: number }): number {
  const speedMpm = mphToMpm(speedMph);
  const grade = inclinePercent / 100;
  const vo2 = 0.1 * speedMpm + 1.8 * speedMpm * grade + 3.5;
  return (vo2 * weightKg / 1000) * 5 * durationMin;
}

export function calculateRunningCalories({
  weightKg, speedMph, inclinePercent, durationMin,
}: { weightKg: number; speedMph: number; inclinePercent: number; durationMin: number }): number {
  const speedMpm = mphToMpm(speedMph);
  const grade = inclinePercent / 100;
  const vo2 = 0.2 * speedMpm + 0.9 * speedMpm * grade + 3.5;
  return (vo2 * weightKg / 1000) * 5 * durationMin;
}

export function calculateMETCalories({
  met, weightKg, durationMin,
}: { met: number; weightKg: number; durationMin: number }): number {
  return ((met * 3.5 * weightKg) / 200) * durationMin;
}

export function getCardioMET(mode: CardioMode, intensity: string): number {
  const map: Record<string, number> = {
    elliptical_moderate: 5.0,
    elliptical_vigorous: 9.0,
    stairmaster_moderate: 6.8,
    stairmaster_hard: 9.3,
    rowing_moderate: 5.0,
    rowing_hard: 7.5,
    rowing_very_hard: 11.0,
    rowing_max: 14.0,
  };
  return map[`${mode}_${intensity}`] ?? 5.0;
}

export const CARDIO_EPOC_MAP: Record<string, number> = {
  walking: 0.005,
  jogging: 0.02,
  running: 0.04,
  elliptical: 0.03,
  stairmaster: 0.04,
  rowing: 0.03,
};

export function calculateCardioCalories({
  weightKg,
  mode,
  durationMin,
  speedMph,
  inclinePercent = 0,
  intensity = "moderate",
}: {
  weightKg: number;
  mode: CardioMode;
  durationMin: number;
  speedMph?: number;
  inclinePercent?: number;
  intensity?: string;
}): { calories: number; epoc: number; confidence: "high" | "medium" } {
  let calories = 0;
  let confidence: "high" | "medium" = "medium";

  if ((mode === "walking" || mode === "jogging") && speedMph) {
    calories = calculateWalkingCalories({ weightKg, speedMph, inclinePercent: inclinePercent ?? 0, durationMin });
    confidence = "high";
  } else if (mode === "running" && speedMph) {
    calories = calculateRunningCalories({ weightKg, speedMph, inclinePercent: inclinePercent ?? 0, durationMin });
    confidence = "high";
  } else {
    const met = getCardioMET(mode, intensity);
    calories = calculateMETCalories({ met, weightKg, durationMin });
  }

  const epoc = calories * (CARDIO_EPOC_MAP[mode] ?? 0.02);
  return { calories, epoc, confidence };
}

export const CARDIO_MODE_LABELS: Record<CardioMode, string> = {
  walking: "Walking",
  jogging: "Jogging",
  running: "Running",
  elliptical: "Elliptical",
  stairmaster: "StairMaster",
  rowing: "Rowing",
};
