import {
  DEFAULT_SETTINGS,
  type AssistLevel,
  type CalculatorSettings,
  type PressureUnit,
  type TireWidthUnit,
  type TerrainLevel
} from '../types';

/**
 * Local persistence module.
 *
 * Components should use these functions instead of talking to localStorage
 * directly. That keeps validation, defaults, and error handling in one place.
 */

/** Key for the full calculator settings object. */
const SETTINGS_KEY = 'ebike-settings';

/** Separate flag that tells the UI whether data came from the user or defaults. */
const CUSTOM_SETTINGS_KEY = 'ebike-has-custom-settings';

/**
 * Safely returns browser localStorage.
 *
 * During tests or server-like environments, window may not exist. Returning
 * null lets the rest of the module fall back to safe defaults.
 */
function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

/** Checks whether an unknown value is a non-null object. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Validates numeric fields against the same ranges used in the settings UI. */
function isNumberInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

/** Validates that persisted terrain data still matches a supported slider level. */
function isTerrainLevel(value: unknown): value is TerrainLevel {
  return [1, 2, 3, 4, 5].includes(value as TerrainLevel);
}

/** Validates that persisted assistance data still matches a supported slider level. */
function isAssistLevel(value: unknown): value is AssistLevel {
  return [1, 2, 3, 4, 5].includes(value as AssistLevel);
}

/** Validates the persisted tire-width unit. */
function isTireWidthUnit(value: unknown): value is TireWidthUnit {
  return value === 'mm' || value === 'inch';
}

/** Validates the persisted pressure unit. */
function isPressureUnit(value: unknown): value is PressureUnit {
  return value === 'bar' || value === 'psi';
}

/**
 * Runtime guard for a complete settings object.
 *
 * TypeScript types do not protect data read from localStorage, because it is
 * just a string. This guard prevents broken or outdated stored data from
 * reaching the calculation function.
 */
function isCalculatorSettings(value: unknown): value is CalculatorSettings {
  return (
    isRecord(value) &&
    isNumberInRange(value.batteryCapacity, 200, 1000) &&
    isNumberInRange(value.batteryCharge, 0, 100) &&
    isNumberInRange(value.batteryHealth, 50, 100) &&
    isNumberInRange(value.chargeCycles, 0, 2000) &&
    isNumberInRange(value.riderWeight, 40, 140) &&
    isNumberInRange(value.bikeWeight, 15, 40) &&
    isTerrainLevel(value.terrain) &&
    isAssistLevel(value.assist) &&
    isNumberInRange(value.wheelSizeInch, 12, 29) &&
    isNumberInRange(value.tireWidthMm, 25, 120) &&
    isNumberInRange(value.tireWidthInch, 1, 5) &&
    isTireWidthUnit(value.tireWidthUnit) &&
    isNumberInRange(value.maxTirePressureBar, 1.5, 8) &&
    isPressureUnit(value.pressureUnit) &&
    isNumberInRange(value.lastPressureCheckDays, 0, 365)
  );
}

/**
 * Merges older saved settings with the current defaults.
 *
 * Earlier app versions stored only battery, weight, terrain, and assistance.
 * Those values are still useful, so missing newer tire and battery-health
 * fields are filled from DEFAULT_SETTINGS.
 */
function normalizeCalculatorSettings(value: unknown): CalculatorSettings | null {
  if (!isRecord(value)) {
    return null;
  }

  const mergedSettings = {
    ...DEFAULT_SETTINGS,
    ...value
  };

  return isCalculatorSettings(mergedSettings) ? mergedSettings : null;
}

/** Returns true when saved settings differ from the built-in example values. */
function hasCustomValues(settings: CalculatorSettings): boolean {
  return (Object.keys(DEFAULT_SETTINGS) as Array<keyof CalculatorSettings>).some(
    (key) => settings[key] !== DEFAULT_SETTINGS[key]
  );
}

/** Removes invalid data so future app starts can return to the default state. */
function clearInvalidSettings(storage: Storage): void {
  storage.removeItem(SETTINGS_KEY);
  storage.removeItem(CUSTOM_SETTINGS_KEY);
}

/**
 * Loads calculator settings from localStorage or returns default settings.
 *
 * Invalid JSON or invalid values are treated as unsafe and replaced with the
 * default example values.
 */
export function loadSettings(): CalculatorSettings {
  const storage = getStorage();

  if (!storage) {
    return { ...DEFAULT_SETTINGS };
  }

  const rawSettings = storage.getItem(SETTINGS_KEY);

  if (!rawSettings) {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const parsedSettings: unknown = JSON.parse(rawSettings);
    const normalizedSettings = normalizeCalculatorSettings(parsedSettings);

    if (normalizedSettings) {
      return { ...normalizedSettings };
    }
  } catch {
    clearInvalidSettings(storage);
    return { ...DEFAULT_SETTINGS };
  }

  clearInvalidSettings(storage);
  return { ...DEFAULT_SETTINGS };
}

/** Saves valid calculator settings and returns whether they are custom data. */
export function saveSettings(settings: CalculatorSettings): boolean {
  const storage = getStorage();
  const hasCustomData = hasCustomValues(settings);

  if (!storage) {
    return hasCustomData;
  }

  storage.setItem(SETTINGS_KEY, JSON.stringify(settings));

  if (hasCustomData) {
    storage.setItem(CUSTOM_SETTINGS_KEY, 'true');
  } else {
    storage.removeItem(CUSTOM_SETTINGS_KEY);
  }

  return hasCustomData;
}

/** Returns true when the user has saved their own settings at least once. */
export function hasCustomSettings(): boolean {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  return storage.getItem(CUSTOM_SETTINGS_KEY) === 'true';
}
