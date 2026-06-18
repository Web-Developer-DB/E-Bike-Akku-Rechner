import type { AssistLevel, CalculatorSettings, RangeResult, TerrainLevel } from '../types';

/**
 * Pure range-calculation module.
 *
 * This file deliberately has no React code and no browser APIs. That makes the
 * business rule easy to test, reuse, and audit without rendering the UI.
 */

/** Full motor support on flat ground at reference weight, in watt-hours per km. */
const FULL_SUPPORT_FLAT_CONSUMPTION_WH_PER_KM = 18;

/** Estimated positive elevation gain per kilometer for each terrain level. */
const ELEVATION_GAIN_M_PER_KM: Record<TerrainLevel, number> = {
  1: 0,
  2: 8,
  3: 20,
  4: 40,
  5: 65
};

/** Percentage of riding energy supplied by the motor for each assistance level. */
const ASSISTANCE_MOTOR_SHARE: Record<AssistLevel, number> = {
  1: 0,
  2: 0.25,
  3: 0.5,
  4: 0.75,
  5: 1
};

/** Physics constants used for the climbing-energy calculation. */
const GRAVITY_M_PER_SECOND_SQUARED = 9.81;
const WATT_SECONDS_PER_WATT_HOUR = 3600;
const MOTOR_EFFICIENCY = 0.85;

/** The flat-road formula treats 105 kg total rider+bike weight as neutral. */
const REFERENCE_WEIGHT_KG = 105;

/** Weight only mildly changes flat consumption; climbing handles mass directly. */
const FLAT_WEIGHT_INFLUENCE = 0.3;
const MIN_FLAT_WEIGHT_FACTOR = 0.85;
const MAX_FLAT_WEIGHT_FACTOR = 1.2;

/**
 * Restricts a numeric value to a safe minimum and maximum.
 *
 * Example: clamp(1.5, 0.85, 1.2) returns 1.2.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Estimates flat-road consumption when the motor supplies all riding energy.
 *
 * Weight matters through rolling resistance, but not as strongly as it does when
 * lifting rider and bike uphill.
 */
function calculateFullSupportFlatConsumption(totalWeight: number): number {
  const weightRatio = totalWeight / REFERENCE_WEIGHT_KG;
  const weightFactor = clamp(
    1 + (weightRatio - 1) * FLAT_WEIGHT_INFLUENCE,
    MIN_FLAT_WEIGHT_FACTOR,
    MAX_FLAT_WEIGHT_FACTOR
  );

  return FULL_SUPPORT_FLAT_CONSUMPTION_WH_PER_KM * weightFactor;
}

/**
 * Calculates the battery energy needed to lift rider and bike uphill at full
 * motor assistance.
 *
 * The terrain slider stands in for unknown GPS data by estimating positive
 * elevation gain per kilometer. Descending is not subtracted because normal
 * e-bikes usually do not recover meaningful energy.
 */
function calculateFullSupportClimbingConsumption(
  terrain: TerrainLevel,
  totalWeight: number
): number {
  const mechanicalWhPerKm =
    (totalWeight *
      GRAVITY_M_PER_SECOND_SQUARED *
      ELEVATION_GAIN_M_PER_KM[terrain]) /
    WATT_SECONDS_PER_WATT_HOUR;

  return mechanicalWhPerKm / MOTOR_EFFICIENCY;
}

/**
 * Calculates the estimated e-bike range and its realistic low/high range.
 *
 * The function is intentionally deterministic: the same settings always return
 * the same result, which is ideal for unit tests and user trust.
 */
export function calculateRange(settings: CalculatorSettings): RangeResult {
  const totalWeight = settings.riderWeight + settings.bikeWeight;
  const motorShare = ASSISTANCE_MOTOR_SHARE[settings.assist];

  if (motorShare === 0) {
    return {
      range: null,
      minRange: null,
      maxRange: null,
      isUnlimited: true
    };
  }

  /** The support slider decides which share of total riding energy the motor pays. */
  const endConsumption =
    (calculateFullSupportFlatConsumption(totalWeight) +
      calculateFullSupportClimbingConsumption(settings.terrain, totalWeight)) *
    motorShare;

  const range = settings.batteryCapacity / endConsumption;

  /** All values are rounded because users need a simple kilometer estimate. */
  return {
    range: Math.round(range),
    minRange: Math.round(range * 0.85),
    maxRange: Math.round(range * 1.15),
    isUnlimited: false
  };
}
