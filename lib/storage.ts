"use client";

import type { DayLog, UserProfile, MealEntry, MealSlot } from "@/lib/types";

const PROFILE_KEY = "calorie_app_profile";
const DAYLOG_KEY = "calorie_app_daylog";

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function saveDayLog(log: Partial<DayLog>): void {
  if (typeof window === "undefined") return;
  const existing = loadDayLog();
  const merged = { ...existing, ...log, date: getTodayKey() };
  localStorage.setItem(`${DAYLOG_KEY}_${getTodayKey()}`, JSON.stringify(merged));
}

export function loadDayLog(): DayLog | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${DAYLOG_KEY}_${getTodayKey()}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function addMealEntry(slot: MealSlot, entry: MealEntry): void {
  const log = loadDayLog() || { meals: {}, customMealSlots: [] } as Partial<DayLog>;
  const meals = { ...(log.meals || {}) };
  meals[slot] = [...(meals[slot] || []), entry];
  saveDayLog({ ...log, meals } as Partial<DayLog>);
}

export function removeMealEntry(slot: MealSlot, entryId: string): void {
  const log = loadDayLog();
  if (!log) return;
  const meals = { ...log.meals };
  meals[slot] = (meals[slot] || []).filter((e) => e.id !== entryId);
  saveDayLog({ ...log, meals });
}

export function addCustomMealSlot(name: string): void {
  const log = loadDayLog() || { meals: {}, customMealSlots: [] } as Partial<DayLog>;
  const slots = [...(log.customMealSlots || [])];
  if (!slots.includes(name)) slots.push(name);
  saveDayLog({ ...log, customMealSlots: slots } as Partial<DayLog>);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}
