import type { Sex } from "../types";

export function calculateRMR({
  weightKg,
  heightCm,
  age,
  sex,
  bodyFatPercent,
  trainedLifter,
}: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
  bodyFatPercent?: number;
  trainedLifter?: boolean;
}): { formula: string; rmr: number; ffmKg?: number } {
  if (
    typeof bodyFatPercent === "number" &&
    trainedLifter &&
    bodyFatPercent > 0 &&
    bodyFatPercent < 70
  ) {
    const ffmKg = weightKg * (1 - bodyFatPercent / 100);
    return { formula: "Cunningham", rmr: 500 + 22 * ffmKg, ffmKg };
  }
  const rmr =
    10 * weightKg +
    6.25 * heightCm -
    5 * age +
    (sex === "male" ? 5 : -161);
  return { formula: "Mifflin-St Jeor", rmr };
}
