import type { StepPace } from "../types";

const PACE_MAP: Record<StepPace, { speedKmh: number; met: number }> = {
  casual: { speedKmh: 4.0, met: 3.0 },
  normal: { speedKmh: 4.8, met: 3.8 },
  brisk: { speedKmh: 6.0, met: 4.8 },
};

export const PACE_LABELS: Record<StepPace, string> = {
  casual: "Casual",
  normal: "Normal",
  brisk: "Brisk",
};

export function calculateStepCalories({
  heightCm,
  weightKg,
  steps,
  stepPace,
}: {
  heightCm: number;
  weightKg: number;
  steps: number;
  stepPace: StepPace;
}): number {
  const { speedKmh, met } = PACE_MAP[stepPace];
  const heightM = heightCm / 100;
  const stepLengthM = heightM * 0.42;
  const distanceKm = (steps * stepLengthM) / 1000;
  const minutes = (distanceKm / speedKmh) * 60;
  return ((met * 3.5 * weightKg) / 200) * minutes;
}
