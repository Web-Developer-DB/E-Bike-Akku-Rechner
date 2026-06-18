import type { AssistLevel, CalculatorSettings, RangeResult, TerrainLevel } from '../types';

/**
 * Pure range-calculation module.
 *
 * This file deliberately has no React code and no browser APIs. That makes the
 * business rule easy to test, reuse, and audit without rendering the UI.
 */

/** Base battery consumption in watt-hours per kilometer for each support mode. */
const BASE_CONSUMPTION: Record<AssistLevel, number> = {
  1: 7,
  2: 9,
  3: 12,
  4: 16,
  5: 20
};

/** Terrain multiplier. Higher terrain levels increase energy consumption. */
const TERRAIN_FACTOR: Record<TerrainLevel, number> = {
  1: 1,
  2: 1.15,
  3: 1.35,
  4: 1.65,
  5: 2
};

/** The formula treats 105 kg total rider+bike weight as the neutral baseline. */
const REFERENCE_WEIGHT_KG = 105;

/** Clamp limits keep very light or very heavy inputs within a realistic band. */
const MIN_WEIGHT_FACTOR = 0.85;
const MAX_WEIGHT_FACTOR = 1.35;

/**
 * Restricts a numeric value to a safe minimum and maximum.
 *
 * Example: clamp(1.5, 0.85, 1.35) returns 1.35.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates the estimated e-bike range and its realistic low/high range.
 *
 * The function is intentionally deterministic: the same settings always return
 * the same result, which is ideal for unit tests and user trust.
 */
export function calculateRange(settings: CalculatorSettings): RangeResult {
  const totalWeight = settings.riderWeight + settings.bikeWeight;

  /** Weight influences consumption, but the clamp prevents extreme jumps. */
  const weightFactor = clamp(
    totalWeight / REFERENCE_WEIGHT_KG,
    MIN_WEIGHT_FACTOR,
    MAX_WEIGHT_FACTOR
  );

  /** Final consumption combines riding mode, terrain, and total weight. */
  const endConsumption =
    BASE_CONSUMPTION[settings.assist] *
    TERRAIN_FACTOR[settings.terrain] *
    weightFactor;

  const range = settings.batteryCapacity / endConsumption;

  /** All values are rounded because users need a simple kilometer estimate. */
  return {
    range: Math.round(range),
    minRange: Math.round(range * 0.85),
    maxRange: Math.round(range * 1.15)
  };
}
