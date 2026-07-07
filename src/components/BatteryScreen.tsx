import { BatteryFull, Bike, Gauge, HeartPulse, RotateCcw } from 'lucide-react';
import type { AppTranslations } from '../i18n';
import type { CalculatorSettings, RangeResult } from '../types';

interface BatteryScreenProps {
  result: RangeResult;
  settings: CalculatorSettings;
  t: AppTranslations;
}

function formatNumber(value: number, digits: number): string {
  return new Intl.NumberFormat(navigator.language, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);
}

function calculateAverageConsumption(
  settings: CalculatorSettings,
  result: RangeResult
): number | null {
  if (result.isUnlimited || result.range === null || result.range <= 0) {
    return null;
  }

  const usableBatteryCapacity =
    settings.batteryCapacity *
    (settings.batteryCharge / 100) *
    (settings.batteryHealth / 100);

  return usableBatteryCapacity / result.range;
}

/** Displays battery state and values that influence range. */
export function BatteryScreen({ result, settings, t }: BatteryScreenProps) {
  const averageConsumption = calculateAverageConsumption(settings, result);

  return (
    <main className="tab-screen">
      <header className="mobile-screen-header centered">
        <h1>{t.batteryTitle}</h1>
      </header>

      <section className="card battery-hero-card">
        <div>
          <h2>{t.fullyChargedBatteryLabel}</h2>
          <p className="battery-charge-value">
            {settings.batteryCharge}
            <span>%</span>
          </p>
        </div>
        <BatteryFull className="battery-hero-icon" aria-hidden="true" strokeWidth={1.9} />
      </section>

      <section className="card data-list" aria-label={t.batteryStatsAriaLabel}>
        <div className="data-row">
          <span className="data-row-label">
            <BatteryFull className="row-icon" aria-hidden="true" strokeWidth={2.25} />
            {t.batteryCapacityLabel}
          </span>
          <strong>{settings.batteryCapacity} Wh</strong>
        </div>
        <div className="data-row">
          <span className="data-row-label">
            <HeartPulse className="row-icon" aria-hidden="true" strokeWidth={2.25} />
            {t.batteryHealthLabel}
          </span>
          <strong>{settings.batteryHealth} %</strong>
        </div>
        <div className="data-row">
          <span className="data-row-label">
            <RotateCcw className="row-icon" aria-hidden="true" strokeWidth={2.25} />
            {t.chargeCyclesLabel}
          </span>
          <strong>{settings.chargeCycles}</strong>
        </div>
        <div className="data-row">
          <span className="data-row-label">
            <Gauge className="row-icon" aria-hidden="true" strokeWidth={2.25} />
            {t.averageConsumptionLabel}
          </span>
          <strong>
            {averageConsumption === null
              ? '0 Wh/km'
              : `${formatNumber(averageConsumption, 1)} Wh/km`}
          </strong>
        </div>
        <div className="data-row">
          <span className="data-row-label">
            <Bike className="row-icon" aria-hidden="true" strokeWidth={2.25} />
            {t.bikeWeightLabel}
          </span>
          <strong>{settings.bikeWeight} kg</strong>
        </div>
      </section>
    </main>
  );
}
