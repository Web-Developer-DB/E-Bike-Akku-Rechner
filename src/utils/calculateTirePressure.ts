import type { CalculatorSettings } from '../types';
import {
  getClosestPressureGuide,
  getClosestTireSize,
  getLoadPressureAdjustment,
  getTireSizeById
} from '../data/tireSizes';

/** Conversion factor used by tire sidewalls and pumps. */
export const PSI_PER_BAR = 14.5038;

/** Calculated front/rear tire-pressure recommendation. */
export interface TirePressureResult {
  frontBar: number;
  rearBar: number;
  maxBar: number;
  frontPsi: number;
  rearPsi: number;
  maxPsi: number;
}

/** Keeps the recommendation inside realistic and tire-safe bounds. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Rounds pressure values to one decimal place for pump-friendly display. */
function roundPressure(value: number): number {
  return Math.round(value * 10) / 10;
}

/** Converts bar to PSI with whole-number precision for pump displays. */
export function barToPsi(value: number): number {
  return Math.round(value * PSI_PER_BAR);
}

/** Converts PSI to bar with one decimal place for compact display. */
export function psiToBar(value: number): number {
  return roundPressure(value / PSI_PER_BAR);
}

/**
 * Calculates an everyday e-bike tire-pressure recommendation from lookup tables.
 *
 * Tire size picks the reference width, width picks a pressure guide, and total
 * system weight picks a discrete load class. Manufacturer limits still win.
 */
export function calculateTirePressure(
  settings: CalculatorSettings
): TirePressureResult {
  const totalWeight = settings.riderWeight + settings.bikeWeight;
  const tireSize =
    getTireSizeById(settings.tireSizeId) ??
    getClosestTireSize(settings.wheelSizeInch, settings.tireWidthMm);
  const pressureGuide = getClosestPressureGuide(tireSize.widthMm);
  const loadAdjustment = getLoadPressureAdjustment(totalWeight);
  const frontTarget = pressureGuide.baseFrontBar + loadAdjustment.frontDeltaBar;
  const rearTarget = pressureGuide.baseRearBar + loadAdjustment.rearDeltaBar;
  const maxFrontPressure = Math.max(1.2, settings.maxTirePressureBar - 0.2);
  const frontBar = roundPressure(clamp(frontTarget, 1.2, maxFrontPressure));
  const rearBar = roundPressure(clamp(rearTarget, frontBar, settings.maxTirePressureBar));

  return {
    frontBar,
    rearBar,
    maxBar: roundPressure(settings.maxTirePressureBar),
    frontPsi: barToPsi(frontBar),
    rearPsi: barToPsi(rearBar),
    maxPsi: barToPsi(settings.maxTirePressureBar)
  };
}
