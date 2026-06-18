import {
  DEFAULT_SETTINGS,
  type AssistLevel,
  type CalculatorSettings,
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

/** Key used to show the welcome modal only once. */
const WELCOME_KEY = 'ebike-welcome-seen';

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

/**
 * Runtime guard for saved settings.
 *
 * TypeScript types do not protect data read from localStorage, because it is
 * just a string. This guard prevents broken or outdated stored data from
 * reaching the calculation function.
 */
function isCalculatorSettings(value: unknown): value is CalculatorSettings {
  return (
    isRecord(value) &&
    isNumberInRange(value.batteryCapacity, 200, 1000) &&
    isNumberInRange(value.riderWeight, 40, 140) &&
    isNumberInRange(value.bikeWeight, 15, 40) &&
    isTerrainLevel(value.terrain) &&
    isAssistLevel(value.assist)
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

    if (isCalculatorSettings(parsedSettings)) {
      return { ...parsedSettings };
    }
  } catch {
    clearInvalidSettings(storage);
    return { ...DEFAULT_SETTINGS };
  }

  clearInvalidSettings(storage);
  return { ...DEFAULT_SETTINGS };
}

/** Saves valid calculator settings and marks the app as using custom data. */
export function saveSettings(settings: CalculatorSettings): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  storage.setItem(CUSTOM_SETTINGS_KEY, 'true');
}

/** Returns true when the user has saved their own settings at least once. */
export function hasCustomSettings(): boolean {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  return storage.getItem(CUSTOM_SETTINGS_KEY) === 'true';
}

/** Returns true when the welcome modal has already been accepted. */
export function hasSeenWelcome(): boolean {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  return storage.getItem(WELCOME_KEY) === 'true';
}

/** Persists that the welcome modal should not appear again. */
export function saveWelcomeSeen(): void {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(WELCOME_KEY, 'true');
}
