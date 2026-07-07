/** One selectable tire size in unambiguous ETRTO notation. */
export interface TireSizeOption {
  id: string;
  wheelSizeInch: number;
  widthMm: number;
  beadSeatDiameterMm: number;
  inchLabel: string;
}

/** Reference pressure for one tire-width class. */
export interface TirePressureGuide {
  widthMm: number;
  baseRearBar: number;
  baseFrontBar: number;
}

/** Discrete load adjustment, kept table-driven instead of a continuous formula. */
interface LoadPressureAdjustment {
  maxTotalWeightKg: number;
  frontDeltaBar: number;
  rearDeltaBar: number;
}

/**
 * Common e-bike and city-bike tire sizes from 16" to 28".
 *
 * The id follows ETRTO width-BSD notation, e.g. 50-406 means 50 mm width on a
 * 406 mm bead seat diameter. Inch labels are display helpers only.
 */
export const TIRE_SIZE_OPTIONS: TireSizeOption[] = [
  { id: '47-305', wheelSizeInch: 16, widthMm: 47, beadSeatDiameterMm: 305, inchLabel: '16 x 1.75' },
  { id: '50-305', wheelSizeInch: 16, widthMm: 50, beadSeatDiameterMm: 305, inchLabel: '16 x 2.00' },
  { id: '54-305', wheelSizeInch: 16, widthMm: 54, beadSeatDiameterMm: 305, inchLabel: '16 x 2.10' },

  { id: '40-355', wheelSizeInch: 18, widthMm: 40, beadSeatDiameterMm: 355, inchLabel: '18 x 1.50' },
  { id: '47-355', wheelSizeInch: 18, widthMm: 47, beadSeatDiameterMm: 355, inchLabel: '18 x 1.75' },
  { id: '50-355', wheelSizeInch: 18, widthMm: 50, beadSeatDiameterMm: 355, inchLabel: '18 x 2.00' },
  { id: '54-355', wheelSizeInch: 18, widthMm: 54, beadSeatDiameterMm: 355, inchLabel: '18 x 2.10' },

  { id: '40-406', wheelSizeInch: 20, widthMm: 40, beadSeatDiameterMm: 406, inchLabel: '20 x 1.50' },
  { id: '47-406', wheelSizeInch: 20, widthMm: 47, beadSeatDiameterMm: 406, inchLabel: '20 x 1.75' },
  { id: '50-406', wheelSizeInch: 20, widthMm: 50, beadSeatDiameterMm: 406, inchLabel: '20 x 2.00' },
  { id: '54-406', wheelSizeInch: 20, widthMm: 54, beadSeatDiameterMm: 406, inchLabel: '20 x 2.15' },
  { id: '57-406', wheelSizeInch: 20, widthMm: 57, beadSeatDiameterMm: 406, inchLabel: '20 x 2.25' },
  { id: '60-406', wheelSizeInch: 20, widthMm: 60, beadSeatDiameterMm: 406, inchLabel: '20 x 2.35' },
  { id: '62-406', wheelSizeInch: 20, widthMm: 62, beadSeatDiameterMm: 406, inchLabel: '20 x 2.40' },

  { id: '40-507', wheelSizeInch: 24, widthMm: 40, beadSeatDiameterMm: 507, inchLabel: '24 x 1.50' },
  { id: '47-507', wheelSizeInch: 24, widthMm: 47, beadSeatDiameterMm: 507, inchLabel: '24 x 1.75' },
  { id: '50-507', wheelSizeInch: 24, widthMm: 50, beadSeatDiameterMm: 507, inchLabel: '24 x 2.00' },
  { id: '54-507', wheelSizeInch: 24, widthMm: 54, beadSeatDiameterMm: 507, inchLabel: '24 x 2.15' },
  { id: '57-507', wheelSizeInch: 24, widthMm: 57, beadSeatDiameterMm: 507, inchLabel: '24 x 2.25' },
  { id: '60-507', wheelSizeInch: 24, widthMm: 60, beadSeatDiameterMm: 507, inchLabel: '24 x 2.35' },

  { id: '40-559', wheelSizeInch: 26, widthMm: 40, beadSeatDiameterMm: 559, inchLabel: '26 x 1.50' },
  { id: '47-559', wheelSizeInch: 26, widthMm: 47, beadSeatDiameterMm: 559, inchLabel: '26 x 1.75' },
  { id: '50-559', wheelSizeInch: 26, widthMm: 50, beadSeatDiameterMm: 559, inchLabel: '26 x 2.00' },
  { id: '54-559', wheelSizeInch: 26, widthMm: 54, beadSeatDiameterMm: 559, inchLabel: '26 x 2.15' },
  { id: '57-559', wheelSizeInch: 26, widthMm: 57, beadSeatDiameterMm: 559, inchLabel: '26 x 2.25' },
  { id: '60-559', wheelSizeInch: 26, widthMm: 60, beadSeatDiameterMm: 559, inchLabel: '26 x 2.35' },
  { id: '62-559', wheelSizeInch: 26, widthMm: 62, beadSeatDiameterMm: 559, inchLabel: '26 x 2.40' },

  { id: '47-584', wheelSizeInch: 27.5, widthMm: 47, beadSeatDiameterMm: 584, inchLabel: '27.5 x 1.75' },
  { id: '50-584', wheelSizeInch: 27.5, widthMm: 50, beadSeatDiameterMm: 584, inchLabel: '27.5 x 2.00' },
  { id: '54-584', wheelSizeInch: 27.5, widthMm: 54, beadSeatDiameterMm: 584, inchLabel: '27.5 x 2.15' },
  { id: '57-584', wheelSizeInch: 27.5, widthMm: 57, beadSeatDiameterMm: 584, inchLabel: '27.5 x 2.25' },
  { id: '60-584', wheelSizeInch: 27.5, widthMm: 60, beadSeatDiameterMm: 584, inchLabel: '27.5 x 2.35' },
  { id: '62-584', wheelSizeInch: 27.5, widthMm: 62, beadSeatDiameterMm: 584, inchLabel: '27.5 x 2.40' },

  { id: '37-622', wheelSizeInch: 28, widthMm: 37, beadSeatDiameterMm: 622, inchLabel: '28 x 1.40' },
  { id: '40-622', wheelSizeInch: 28, widthMm: 40, beadSeatDiameterMm: 622, inchLabel: '28 x 1.50' },
  { id: '44-622', wheelSizeInch: 28, widthMm: 44, beadSeatDiameterMm: 622, inchLabel: '28 x 1.65' },
  { id: '47-622', wheelSizeInch: 28, widthMm: 47, beadSeatDiameterMm: 622, inchLabel: '28 x 1.75' },
  { id: '50-622', wheelSizeInch: 28, widthMm: 50, beadSeatDiameterMm: 622, inchLabel: '28 x 2.00' },
  { id: '54-622', wheelSizeInch: 28, widthMm: 54, beadSeatDiameterMm: 622, inchLabel: '28 x 2.15' },
  { id: '57-622', wheelSizeInch: 28, widthMm: 57, beadSeatDiameterMm: 622, inchLabel: '28 x 2.25' },
  { id: '60-622', wheelSizeInch: 28, widthMm: 60, beadSeatDiameterMm: 622, inchLabel: '28 x 2.35' }
];

/** Width-based pressure guide for city and trekking style tires. */
export const TIRE_PRESSURE_GUIDES: TirePressureGuide[] = [
  { widthMm: 37, baseFrontBar: 4.2, baseRearBar: 4.5 },
  { widthMm: 40, baseFrontBar: 3.7, baseRearBar: 4.0 },
  { widthMm: 44, baseFrontBar: 3.2, baseRearBar: 3.5 },
  { widthMm: 47, baseFrontBar: 3.2, baseRearBar: 3.5 },
  { widthMm: 50, baseFrontBar: 2.7, baseRearBar: 3.0 },
  { widthMm: 54, baseFrontBar: 2.3, baseRearBar: 2.6 },
  { widthMm: 57, baseFrontBar: 2.1, baseRearBar: 2.4 },
  { widthMm: 60, baseFrontBar: 1.9, baseRearBar: 2.2 },
  { widthMm: 62, baseFrontBar: 1.8, baseRearBar: 2.1 }
];

export const LOAD_PRESSURE_ADJUSTMENTS: LoadPressureAdjustment[] = [
  { maxTotalWeightKg: 80, frontDeltaBar: -0.3, rearDeltaBar: -0.3 },
  { maxTotalWeightKg: 105, frontDeltaBar: 0, rearDeltaBar: 0 },
  { maxTotalWeightKg: 130, frontDeltaBar: 0.2, rearDeltaBar: 0.2 },
  { maxTotalWeightKg: 165, frontDeltaBar: 0.4, rearDeltaBar: 0.5 },
  { maxTotalWeightKg: Number.POSITIVE_INFINITY, frontDeltaBar: 0.6, rearDeltaBar: 0.7 }
];

export function getTireSizeById(id: string): TireSizeOption | undefined {
  return TIRE_SIZE_OPTIONS.find((option) => option.id === id);
}

export function getTireSizesByWheel(wheelSizeInch: number): TireSizeOption[] {
  return TIRE_SIZE_OPTIONS.filter(
    (option) => option.wheelSizeInch === wheelSizeInch
  );
}

export function getWheelSizeOptions(): number[] {
  return Array.from(
    new Set(TIRE_SIZE_OPTIONS.map((option) => option.wheelSizeInch))
  );
}

export function getClosestTireSize(
  wheelSizeInch: number,
  widthMm: number
): TireSizeOption {
  const sameWheelOptions = getTireSizesByWheel(wheelSizeInch);
  const candidates = sameWheelOptions.length > 0 ? sameWheelOptions : TIRE_SIZE_OPTIONS;

  return candidates.reduce((closestOption, option) => {
    const closestDistance = Math.abs(closestOption.widthMm - widthMm);
    const optionDistance = Math.abs(option.widthMm - widthMm);

    return optionDistance < closestDistance ? option : closestOption;
  }, candidates[0]);
}

export function getClosestPressureGuide(widthMm: number): TirePressureGuide {
  return TIRE_PRESSURE_GUIDES.reduce((closestGuide, guide) => {
    const closestDistance = Math.abs(closestGuide.widthMm - widthMm);
    const guideDistance = Math.abs(guide.widthMm - widthMm);

    return guideDistance < closestDistance ? guide : closestGuide;
  }, TIRE_PRESSURE_GUIDES[0]);
}

export function getLoadPressureAdjustment(
  totalWeightKg: number
): LoadPressureAdjustment {
  return LOAD_PRESSURE_ADJUSTMENTS.find(
    (adjustment) => totalWeightKg <= adjustment.maxTotalWeightKg
  ) ?? LOAD_PRESSURE_ADJUSTMENTS[LOAD_PRESSURE_ADJUSTMENTS.length - 1];
}

export function formatTireSizeLabel(option: TireSizeOption): string {
  return `${option.id} · ${option.inchLabel}`;
}
