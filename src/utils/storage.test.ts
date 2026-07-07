import { beforeEach, describe, expect, it } from 'vitest';
import {
  hasCustomSettings,
  loadSettings,
  saveSettings
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

    expect(saveSettings(settings)).toBe(true);

    expect(hasCustomSettings()).toBe(true);
    expect(JSON.parse(localStorage.getItem('ebike-settings') ?? '{}')).toEqual(
      settings
    );
  });

  /** Saving unchanged example values should not count as custom user data. */
  it('markiert unveraenderte Beispieldaten nicht als eigene Daten', () => {
    expect(saveSettings(DEFAULT_SETTINGS)).toBe(false);

    expect(hasCustomSettings()).toBe(false);
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
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

  /** Older app versions saved fewer fields; those values should be migrated. */
  it('migriert alte gespeicherte Einstellungen', () => {
    localStorage.setItem(
      'ebike-settings',
      JSON.stringify({
        batteryCapacity: 750,
        riderWeight: 92,
        bikeWeight: 28,
        terrain: 4,
        assist: 2
      })
    );

    expect(loadSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      batteryCapacity: 750,
      riderWeight: 92,
      bikeWeight: 28,
      terrain: 4,
      assist: 2
    });
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
});
