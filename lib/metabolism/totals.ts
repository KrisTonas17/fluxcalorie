export function calculateTEF({
  proteinG, carbsG, fatG,
}: { proteinG: number; carbsG: number; fatG: number }): number {
  return proteinG * 4 * 0.25 + carbsG * 4 * 0.075 + fatG * 9 * 0.02;
}

export function calculateTotalBurn({
  rmr, nonStepNeat, liftingCalories, liftingEPOC,
  cardioCalories, cardioEPOC, stepCalories, tef,
}: {
  rmr: number; nonStepNeat: number; liftingCalories: number; liftingEPOC: number;
  cardioCalories: number; cardioEPOC: number; stepCalories: number; tef: number;
}): number {
  return rmr + nonStepNeat + liftingCalories + liftingEPOC + cardioCalories + cardioEPOC + stepCalories + tef;
}

export function calculateNetBalance({
  totalBurn, totalIntake, targetCalories,
}: { totalBurn: number; totalIntake: number; targetCalories: number }) {
  const net = totalIntake - totalBurn;
  const remaining = targetCalories - totalIntake;
  return { net, remaining, status: net > 0 ? "surplus" : "deficit" as "surplus" | "deficit" };
}
