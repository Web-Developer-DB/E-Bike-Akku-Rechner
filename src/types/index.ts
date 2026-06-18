/**
 * Shared domain types and default option lists for the whole app.
 *
 * Keeping these values in one file helps junior developers see which data shape
 * the calculator expects and prevents components from inventing their own labels
 * or magic numbers.
 */

/** Terrain and assistance sliders both use five fixed levels. */
export type TerrainLevel = 1 | 2 | 3 | 4 | 5;

/** The assistance level maps directly to one base consumption value. */
export type AssistLevel = 1 | 2 | 3 | 4 | 5;

/** All user-controlled values that influence the range calculation. */
export interface CalculatorSettings {
  batteryCapacity: number;
  riderWeight: number;
  bikeWeight: number;
  terrain: TerrainLevel;
  assist: AssistLevel;
}

/** Rounded result values shown in the result card. */
export interface RangeResult {
  range: number;
  minRange: number;
  maxRange: number;
}

/** Generic shape for localized slider options. */
export interface Option<TValue extends number> {
  value: TValue;
  label: string;
}

/** Example values used on first app start before the user saves personal data. */
export const DEFAULT_SETTINGS: CalculatorSettings = {
  batteryCapacity: 625,
  riderWeight: 80,
  bikeWeight: 25,
  terrain: 2,
  assist: 2
};
