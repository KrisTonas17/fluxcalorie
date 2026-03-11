import type { NonStepNeatLevel } from "../types";

const NEAT_MAP: Record<NonStepNeatLevel, number> = {
  very_low: 0.03,
  low: 0.06,
  moderate: 0.10,
  high: 0.15,
  very_high: 0.22,
};

export const NEAT_LABELS: Record<NonStepNeatLevel, { label: string; description: string }> = {
  very_low: {
    label: "Very Low",
    description: "Mostly seated, minimal fidgeting or household movement beyond your steps",
  },
  low: {
    label: "Low",
    description: "Some standing, light chores, modest incidental movement not captured by steps",
  },
  moderate: {
    label: "Moderate",
    description: "Frequent standing, chores, carrying — not dedicated walking/cardio",
  },
  high: {
    label: "High",
    description: "Highly kinetic day with lots of non-step movement, lifting/carrying, task switching",
  },
  very_high: {
    label: "Very High",
    description: "Unusually movement-heavy day outside formal exercise and logged steps",
  },
};

export function calculateNonStepNeat({
  rmr,
  nonStepNeatLevel,
}: {
  rmr: number;
  nonStepNeatLevel: NonStepNeatLevel;
}): number {
  return rmr * NEAT_MAP[nonStepNeatLevel];
}
