/**
 * Shared domain types and default option lists for the whole app.
 *
 * Keeping these values in one file helps junior developers see which data shape
 * the calculator expects and prevents components from inventing their own labels
 * or magic numbers.
 */

/** Terrain and assistance sliders both use five fixed levels. */
export type TerrainLevel = 1 | 2 | 3 | 4 | 5;

/** Main bottom-navigation destinations. */
export type AppTab = 'range' | 'pressure' | 'battery' | 'more';

/** The assistance level maps to a percentage share supplied by the motor. */
export type AssistLevel = 1 | 2 | 3 | 4 | 5;

/** Tire width can be entered in the unit printed on the tire sidewall. */
export type TireWidthUnit = 'mm' | 'inch';

/** Pressure input and display support the two common tire-pressure units. */
export type PressureUnit = 'bar' | 'psi';

/** All user-controlled values that influence the range calculation. */
export interface CalculatorSettings {
  batteryCapacity: number;
  batteryCharge: number;
  batteryHealth: number;
  chargeCycles: number;
  riderWeight: number;
  bikeWeight: number;
  terrain: TerrainLevel;
  assist: AssistLevel;
  wheelSizeInch: number;
  tireSizeId: string;
  tireWidthMm: number;
  tireWidthInch: number;
  tireWidthUnit: TireWidthUnit;
  maxTirePressureBar: number;
  pressureUnit: PressureUnit;
  lastPressureCheckDays: number;
}

/** Rounded finite result values shown in the result card. */
interface EstimatedRangeResult {
  range: number;
  minRange: number;
  maxRange: number;
  isUnlimited: false;
}

/** Result for 0% assistance, where the battery is not consumed. */
interface UnlimitedRangeResult {
  range: null;
  minRange: null;
  maxRange: null;
  isUnlimited: true;
}

/** Rounded result values shown in the result card. */
export type RangeResult = EstimatedRangeResult | UnlimitedRangeResult;

/** Generic shape for localized slider options. */
export interface Option<TValue extends number> {
  value: TValue;
  label: string;
}

/** Example values used on first app start before the user saves personal data. */
export const DEFAULT_SETTINGS: CalculatorSettings = {
  batteryCapacity: 625,
  batteryCharge: 100,
  batteryHealth: 95,
  chargeCycles: 32,
  riderWeight: 80,
  bikeWeight: 25,
  terrain: 2,
  assist: 3,
  wheelSizeInch: 20,
  tireSizeId: '50-406',
  tireWidthMm: 50,
  tireWidthInch: 1.97,
  tireWidthUnit: 'mm',
  maxTirePressureBar: 4.5,
  pressureUnit: 'bar',
  lastPressureCheckDays: 5
};
