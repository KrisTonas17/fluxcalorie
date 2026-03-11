"use client";

import {
  createContext, useContext, useReducer, useEffect, useCallback, type ReactNode,
} from "react";
import type {
  UserProfile, DayLog, MealSlot, MealEntry, LiftingSession, CardioSession, DailyMovement,
} from "@/lib/types";
import {
  saveProfile, loadProfile, saveDayLog, loadDayLog, generateId,
} from "@/lib/storage";
import { calculateRMR } from "@/lib/metabolism/rmr";
import { calculateNonStepNeat } from "@/lib/metabolism/nonStepNeat";
import { calculateLiftingCalories, calculateLiftingEPOC, calculateLiftingCaloriesMulti } from "@/lib/metabolism/lifting";
import { calculateCardioCalories } from "@/lib/metabolism/cardio";
import { calculateStepCalories } from "@/lib/metabolism/steps";
import { calculateTEF, calculateTotalBurn } from "@/lib/metabolism/totals";

interface AppState {
  profile: UserProfile | null;
  dayLog: Partial<DayLog>;
  activeTab: string;
  burn: BurnState;
  intake: IntakeState;
  hasLoaded: boolean;
}

interface BurnState {
  rmr: number;
  rmrFormula: string;
  nonStepNeat: number;
  liftingCalories: number;
  liftingEPOC: number;
  cardioCalories: number;
  cardioEPOC: number;
  stepCalories: number;
  tef: number;
  total: number;
}

interface IntakeState {
  total: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  byMeal: Record<string, number>;
}

const defaultBurn: BurnState = {
  rmr: 0, rmrFormula: "", nonStepNeat: 0, liftingCalories: 0,
  liftingEPOC: 0, cardioCalories: 0, cardioEPOC: 0, stepCalories: 0, tef: 0, total: 0,
};

const defaultIntake: IntakeState = {
  total: 0, proteinG: 0, carbsG: 0, fatG: 0, byMeal: {},
};

type Action =
  | { type: "HYDRATE"; profile: UserProfile | null; dayLog: Partial<DayLog> }
  | { type: "SET_PROFILE"; profile: UserProfile }
  | { type: "SET_MOVEMENT"; movement: DailyMovement }
  | { type: "SET_LIFTING"; lifting: LiftingSession | undefined }
  | { type: "SET_CARDIO"; cardio: CardioSession | undefined }
  | { type: "ADD_MEAL_ENTRY"; slot: MealSlot; entry: MealEntry }
  | { type: "REMOVE_MEAL_ENTRY"; slot: MealSlot; entryId: string }
  | { type: "ADD_CUSTOM_SLOT"; name: string }
  | { type: "SET_TAB"; tab: string }
  | { type: "RECALCULATE" };

function computeBurn(profile: UserProfile, log: Partial<DayLog>): BurnState {
  const rmrResult = calculateRMR({
    weightKg: profile.weightKg,
    heightCm: profile.heightCm,
    age: profile.age,
    sex: profile.sex,
    bodyFatPercent: profile.bodyFatPercent,
    trainedLifter: profile.trainedLifter,
  });
  const rmr = rmrResult.rmr;
  const movement = log.movement;
  const nonStepNeat = movement
    ? calculateNonStepNeat({ rmr, nonStepNeatLevel: movement.nonStepNeatLevel })
    : rmr * 0.06;
  const stepCalories = movement
    ? calculateStepCalories({
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        steps: movement.steps,
        stepPace: movement.stepPace,
      })
    : 0;

  let liftingCalories = 0, liftingEPOC = 0;
  if (log.lifting) {
    const bodyParts = log.lifting.bodyParts ?? [log.lifting.bodyPart];
    liftingCalories = calculateLiftingCaloriesMulti({
      weightKg: profile.weightKg,
      durationMin: log.lifting.durationMin,
      intensity: log.lifting.intensity,
      sets: log.lifting.sets,
      avgRestSec: log.lifting.avgRestSec,
      bodyParts,
    });
    liftingEPOC = calculateLiftingEPOC(liftingCalories, log.lifting.intensity);
  }

  let cardioCalories = 0, cardioEPOC = 0;
  if (log.cardio) {
    const cardioResult = calculateCardioCalories({
      weightKg: profile.weightKg,
      mode: log.cardio.mode,
      durationMin: log.cardio.durationMin,
      speedMph: log.cardio.speedMph,
      inclinePercent: log.cardio.inclinePercent,
      intensity: log.cardio.intensity,
    });
    cardioCalories = cardioResult.calories;
    cardioEPOC = cardioResult.epoc;
  }

  // Compute TEF from meals
  let totalProtein = 0, totalCarbs = 0, totalFat = 0;
  if (log.meals) {
    for (const entries of Object.values(log.meals)) {
      for (const e of entries) {
        totalProtein += (e.proteinG ?? 0) * e.quantity;
        totalCarbs += (e.carbsG ?? 0) * e.quantity;
        totalFat += (e.fatG ?? 0) * e.quantity;
      }
    }
  }
  const tef = calculateTEF({ proteinG: totalProtein, carbsG: totalCarbs, fatG: totalFat });

  const total = calculateTotalBurn({ rmr, nonStepNeat, liftingCalories, liftingEPOC, cardioCalories, cardioEPOC, stepCalories, tef });
  return { rmr, rmrFormula: rmrResult.formula, nonStepNeat, liftingCalories, liftingEPOC, cardioCalories, cardioEPOC, stepCalories, tef, total };
}

function computeIntake(log: Partial<DayLog>): IntakeState {
  let total = 0, proteinG = 0, carbsG = 0, fatG = 0;
  const byMeal: Record<string, number> = {};
  if (log.meals) {
    for (const [slot, entries] of Object.entries(log.meals)) {
      let slotCals = 0;
      for (const e of entries) {
        const cals = e.calories * e.quantity;
        total += cals;
        slotCals += cals;
        proteinG += (e.proteinG ?? 0) * e.quantity;
        carbsG += (e.carbsG ?? 0) * e.quantity;
        fatG += (e.fatG ?? 0) * e.quantity;
      }
      byMeal[slot] = slotCals;
    }
  }
  return { total, proteinG, carbsG, fatG, byMeal };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        profile: action.profile,
        dayLog: action.dayLog,
        burn: action.profile ? computeBurn(action.profile, action.dayLog) : defaultBurn,
        intake: computeIntake(action.dayLog),
        hasLoaded: true,
      };
    case "SET_PROFILE": {
      const newLog = { ...state.dayLog, profile: action.profile };
      return { ...state, profile: action.profile, dayLog: newLog, burn: computeBurn(action.profile, newLog) };
    }
    case "SET_MOVEMENT": {
      const newLog = { ...state.dayLog, movement: action.movement };
      return { ...state, dayLog: newLog, burn: state.profile ? computeBurn(state.profile, newLog) : state.burn };
    }
    case "SET_LIFTING": {
      const newLog = { ...state.dayLog, lifting: action.lifting };
      return { ...state, dayLog: newLog, burn: state.profile ? computeBurn(state.profile, newLog) : state.burn };
    }
    case "SET_CARDIO": {
      const newLog = { ...state.dayLog, cardio: action.cardio };
      return { ...state, dayLog: newLog, burn: state.profile ? computeBurn(state.profile, newLog) : state.burn };
    }
    case "ADD_MEAL_ENTRY": {
      const meals = { ...state.dayLog.meals };
      meals[action.slot] = [...(meals[action.slot] || []), action.entry];
      const newLog = { ...state.dayLog, meals };
      const newIntake = computeIntake(newLog);
      const newBurn = state.profile
        ? computeBurn(state.profile, newLog)
        : state.burn;
      return { ...state, dayLog: newLog, intake: newIntake, burn: newBurn };
    }
    case "REMOVE_MEAL_ENTRY": {
      const meals = { ...state.dayLog.meals };
      meals[action.slot] = (meals[action.slot] || []).filter((e) => e.id !== action.entryId);
      const newLog = { ...state.dayLog, meals };
      const newIntake = computeIntake(newLog);
      const newBurn = state.profile
        ? computeBurn(state.profile, newLog)
        : state.burn;
      return { ...state, dayLog: newLog, intake: newIntake, burn: newBurn };
    }
    case "ADD_CUSTOM_SLOT": {
      const slots = [...(state.dayLog.customMealSlots || [])];
      if (!slots.includes(action.name)) slots.push(action.name);
      return { ...state, dayLog: { ...state.dayLog, customMealSlots: slots } };
    }
    case "SET_TAB":
      return { ...state, activeTab: action.tab };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    profile: null,
    dayLog: {},
    activeTab: "dashboard",
    burn: defaultBurn,
    intake: defaultIntake,
    hasLoaded: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const profile = loadProfile();
    const dayLog = loadDayLog() || {};
    dispatch({ type: "HYDRATE", profile, dayLog });
  }, []);

  // Persist on changes
  useEffect(() => {
    if (!state.hasLoaded) return;
    if (state.profile) saveProfile(state.profile);
    saveDayLog(state.dayLog);
  }, [state.profile, state.dayLog, state.hasLoaded]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}

export { generateId };
export type { BurnState, IntakeState };
