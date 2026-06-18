import { describe, expect, it } from 'vitest';
import { calculateRange } from './calculateRange';
import { DEFAULT_SETTINGS, type RangeResult } from '../types';

type EstimatedRangeResult = Extract<RangeResult, { isUnlimited: false }>;

/** Narrows a result to the finite range case for mathematical assertions. */
function expectFiniteRange(result: RangeResult): asserts result is EstimatedRangeResult {
  expect(result.isUnlimited).toBe(false);

  if (result.isUnlimited) {
    throw new Error('Expected a finite range result.');
  }
}

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
      maxRange: 69,
      isUnlimited: false
    });
  });

  /** Higher assistance consumes more energy, so it must reduce range. */
  it('reduziert die Reichweite bei mehr Unterstuetzung', () => {
    const low = calculateRange({ ...DEFAULT_SETTINGS, assist: 2 });
    const maximum = calculateRange({ ...DEFAULT_SETTINGS, assist: 5 });

    expectFiniteRange(low);
    expectFiniteRange(maximum);

    expect(maximum.range).toBeLessThan(low.range);
  });

  /** 0% assistance does not use the battery, so no finite battery range exists. */
  it('zeigt bei 0 Prozent Unterstuetzung unbegrenzte Akku-Reichweite', () => {
    expect(calculateRange({ ...DEFAULT_SETTINGS, assist: 1 })).toEqual({
      range: null,
      minRange: null,
      maxRange: null,
      isUnlimited: true
    });
  });

  /** Hillier terrain increases elevation gain and lowers the range. */
  it('reduziert die Reichweite bei bergigerem Gelaende', () => {
    const flat = calculateRange({ ...DEFAULT_SETTINGS, terrain: 1 });
    const hilly = calculateRange({ ...DEFAULT_SETTINGS, terrain: 4 });

    expectFiniteRange(flat);
    expectFiniteRange(hilly);

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

    expectFiniteRange(light);
    expectFiniteRange(heavy);

    expect(heavy.range).toBeLessThan(light.range);
  });

  /** Uphill riding should make the same extra weight more important. */
  it('gewichtet Mehrgewicht bei extrem bergigem Gelaende staerker als flach', () => {
    const flatReference = calculateRange({ ...DEFAULT_SETTINGS, terrain: 1 });
    const flatHeavy = calculateRange({
      ...DEFAULT_SETTINGS,
      terrain: 1,
      riderWeight: DEFAULT_SETTINGS.riderWeight + 20
    });
    const hillyReference = calculateRange({ ...DEFAULT_SETTINGS, terrain: 5 });
    const hillyHeavy = calculateRange({
      ...DEFAULT_SETTINGS,
      terrain: 5,
      riderWeight: DEFAULT_SETTINGS.riderWeight + 20
    });

    expectFiniteRange(flatReference);
    expectFiniteRange(flatHeavy);
    expectFiniteRange(hillyReference);
    expectFiniteRange(hillyHeavy);

    const flatLossRatio =
      (flatReference.range - flatHeavy.range) / flatReference.range;
    const hillyLossRatio =
      (hillyReference.range - hillyHeavy.range) / hillyReference.range;

    expect(hillyLossRatio).toBeGreaterThan(flatLossRatio);
  });

  /** Consumers need all three numbers for the result card. */
  it('enthaelt Reichweite, untere Grenze und obere Grenze', () => {
    expect(calculateRange(DEFAULT_SETTINGS)).toEqual(
      expect.objectContaining({
        range: expect.any(Number),
        minRange: expect.any(Number),
        maxRange: expect.any(Number),
        isUnlimited: false
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

    expectFiniteRange(result);

    expect(Number.isInteger(result.range)).toBe(true);
    expect(Number.isInteger(result.minRange)).toBe(true);
    expect(Number.isInteger(result.maxRange)).toBe(true);
  });
});
