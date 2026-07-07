import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '../types';
import {
  barToPsi,
  calculateTirePressure,
  psiToBar
} from './calculateTirePressure';

describe('calculateTirePressure', () => {
  it('liefert fuer Standarddaten die erwartete Empfehlung', () => {
    expect(calculateTirePressure(DEFAULT_SETTINGS)).toEqual({
      frontBar: 2.7,
      rearBar: 3,
      maxBar: 4.5,
      frontPsi: 39,
      rearPsi: 44,
      maxPsi: 65
    });
  });

  it('erhoeht den empfohlenen Druck bei mehr Gewicht', () => {
    const defaultPressure = calculateTirePressure(DEFAULT_SETTINGS);
    const heavyPressure = calculateTirePressure({
      ...DEFAULT_SETTINGS,
      riderWeight: 120,
      bikeWeight: 35
    });

    expect(heavyPressure.frontBar).toBeGreaterThan(defaultPressure.frontBar);
    expect(heavyPressure.rearBar).toBeGreaterThan(defaultPressure.rearBar);
  });

  it('senkt den empfohlenen Druck bei breiteren Reifen', () => {
    const narrowPressure = calculateTirePressure({
      ...DEFAULT_SETTINGS,
      tireSizeId: '40-406',
      tireWidthMm: 40
    });
    const widePressure = calculateTirePressure({
      ...DEFAULT_SETTINGS,
      tireSizeId: '60-406',
      tireWidthMm: 60
    });

    expect(widePressure.frontBar).toBeLessThan(narrowPressure.frontBar);
    expect(widePressure.rearBar).toBeLessThan(narrowPressure.rearBar);
  });

  it('begrenzt die Empfehlung auf den maximalen Reifendruck', () => {
    const pressure = calculateTirePressure({
      ...DEFAULT_SETTINGS,
      tireSizeId: '50-406',
      riderWeight: 140,
      bikeWeight: 40,
      maxTirePressureBar: 3.2
    });

    expect(pressure.rearBar).toBeLessThanOrEqual(3.2);
    expect(pressure.frontBar).toBeLessThanOrEqual(3);
  });

  it('rechnet zwischen bar und PSI um', () => {
    expect(barToPsi(4.5)).toBe(65);
    expect(psiToBar(65)).toBe(4.5);
  });
});
