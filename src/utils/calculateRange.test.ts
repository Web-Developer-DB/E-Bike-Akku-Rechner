import { describe, expect, it } from 'vitest';
import { calculateRange } from './calculateRange';
import { DEFAULT_SETTINGS } from '../types';

/**
 * Unit tests for the pure range calculation.
 *
 * Because calculateRange has no browser or React dependencies, these tests can
 * focus only on business rules and expected mathematical behavior.
 */
describe('calculateRange', () => {
  /** Documents the default example result shown on first app start. */
  it('liefert mit Standardwerten eine plausible Reichweite', () => {
    expect(calculateRange(DEFAULT_SETTINGS)).toEqual({
      range: 60,
      minRange: 51,
      maxRange: 69
    });
  });

  /** Higher assistance consumes more energy, so it must reduce range. */
  it('reduziert die Reichweite bei mehr Unterstuetzung', () => {
    const eco = calculateRange({ ...DEFAULT_SETTINGS, assist: 1 });
    const turbo = calculateRange({ ...DEFAULT_SETTINGS, assist: 4 });

    expect(turbo.range).toBeLessThan(eco.range);
  });

  /** Hillier terrain increases the terrain factor and lowers the range. */
  it('reduziert die Reichweite bei bergigerem Gelaende', () => {
    const flat = calculateRange({ ...DEFAULT_SETTINGS, terrain: 1 });
    const hilly = calculateRange({ ...DEFAULT_SETTINGS, terrain: 4 });

    expect(hilly.range).toBeLessThan(flat.range);
  });

  /** More total rider+bike weight should increase consumption. */
  it('reduziert die Reichweite bei mehr Gewicht', () => {
    const light = calculateRange({
      ...DEFAULT_SETTINGS,
      riderWeight: 60,
      bikeWeight: 20
    });
    const heavy = calculateRange({
      ...DEFAULT_SETTINGS,
      riderWeight: 120,
      bikeWeight: 35
    });

    expect(heavy.range).toBeLessThan(light.range);
  });

  /** Consumers need all three numbers for the result card. */
  it('enthaelt Reichweite, untere Grenze und obere Grenze', () => {
    expect(calculateRange(DEFAULT_SETTINGS)).toEqual(
      expect.objectContaining({
        range: expect.any(Number),
        minRange: expect.any(Number),
        maxRange: expect.any(Number)
      })
    );
  });

  /** The UI shows full kilometers, not decimal numbers. */
  it('rundet alle Werte auf ganze Kilometer', () => {
    const result = calculateRange({
      batteryCapacity: 500,
      riderWeight: 83,
      bikeWeight: 24,
      terrain: 3,
      assist: 3
    });

    expect(Number.isInteger(result.range)).toBe(true);
    expect(Number.isInteger(result.minRange)).toBe(true);
    expect(Number.isInteger(result.maxRange)).toBe(true);
  });
});
