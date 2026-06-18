import { beforeEach, describe, expect, it } from 'vitest';
import {
  hasCustomSettings,
  hasSeenWelcome,
  loadSettings,
  saveSettings,
  saveWelcomeSeen
} from './storage';
import { DEFAULT_SETTINGS } from '../types';

/**
 * Unit tests for localStorage access.
 *
 * The storage module validates external data, so these tests cover both normal
 * saved values and broken values that could exist in a user's browser.
 */
describe('storage', () => {
  beforeEach(() => {
    /** Reset jsdom localStorage so each test is independent. */
    localStorage.clear();
  });

  /** Empty storage should behave like a first app start. */
  it('laedt Standardwerte korrekt', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    expect(hasCustomSettings()).toBe(false);
  });

  /** Saving settings should persist the full object and set the custom flag. */
  it('speichert Einstellungen', () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      batteryCapacity: 750,
      riderWeight: 92,
      bikeWeight: 28
    };

    saveSettings(settings);

    expect(hasCustomSettings()).toBe(true);
    expect(JSON.parse(localStorage.getItem('ebike-settings') ?? '{}')).toEqual(
      settings
    );
  });

  /** Saved settings should be returned unchanged when they are valid. */
  it('liest gespeicherte Einstellungen', () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      batteryCapacity: 500,
      terrain: 4 as const,
      assist: 1 as const
    };

    saveSettings(settings);

    expect(loadSettings()).toEqual(settings);
  });

  /** The UI allows small batteries down to 200 Wh, including 280 Wh. */
  it('akzeptiert Akkukapazitaeten ab 200 Wh', () => {
    const settings = {
      ...DEFAULT_SETTINGS,
      batteryCapacity: 280
    };

    saveSettings(settings);

    expect(loadSettings()).toEqual(settings);
  });

  /** Broken localStorage data should not crash the app or reach calculation. */
  it('faengt fehlerhafte Daten ab', () => {
    localStorage.setItem('ebike-settings', '{"batteryCapacity":"viel"}');

    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    expect(hasCustomSettings()).toBe(false);
  });

  /** The welcome flag is stored separately from calculator settings. */
  it('speichert den Willkommen-Status', () => {
    expect(hasSeenWelcome()).toBe(false);

    saveWelcomeSeen();

    expect(hasSeenWelcome()).toBe(true);
  });
});
