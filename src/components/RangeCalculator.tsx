import {
  BatteryCharging,
  Gauge,
  Info,
  Mountain,
  Route,
  Settings as SettingsIcon
} from 'lucide-react';
import type { AppTranslations } from '../i18n';
import type { AssistLevel, CalculatorSettings, RangeResult, TerrainLevel } from '../types';
import type { TirePressureResult } from '../utils/calculateTirePressure';
import { CycleControlButton } from './CycleControlButton';

/**
 * Props for the main calculator screen.
 *
 * The component stays presentational: it receives the already calculated result
 * and reports user actions upward through callbacks.
 */
interface RangeCalculatorProps {
  result: RangeResult;
  pressure: TirePressureResult;
  settings: CalculatorSettings;
  terrain: TerrainLevel;
  assist: AssistLevel;
  hasCustomData: boolean;
  t: AppTranslations;
  onTerrainChange: (terrain: TerrainLevel) => void;
  onAssistChange: (assist: AssistLevel) => void;
  onOpenSettings: () => void;
}

/**
 * Formats tire-pressure values for the compact range board.
 *
 * The dedicated tire-pressure screen contains the detailed explanation. The
 * range board only shows the front and rear values riders need immediately.
 */
function getPressureDisplay(
  pressure: TirePressureResult,
  position: 'front' | 'rear',
  unit: CalculatorSettings['pressureUnit']
): string {
  if (unit === 'psi') {
    return String(position === 'front' ? pressure.frontPsi : pressure.rearPsi);
  }

  return (position === 'front' ? pressure.frontBar : pressure.rearBar).toFixed(1);
}

/**
 * Main range screen.
 *
 * The screen is designed as a single board: range first, then large tappable
 * controls for terrain and assistance, followed by the necessary tire-pressure
 * recommendation. Large click buttons make the state obvious and easy to change
 * on phones.
 */
export function RangeCalculator({
  result,
  pressure,
  settings,
  terrain,
  assist,
  hasCustomData,
  t,
  onTerrainChange,
  onAssistChange,
  onOpenSettings
}: RangeCalculatorProps) {
  const pressureUnit = settings.pressureUnit === 'bar' ? t.barLabel : t.psiLabel;
  const frontPressure = getPressureDisplay(pressure, 'front', settings.pressureUnit);
  const rearPressure = getPressureDisplay(pressure, 'rear', settings.pressureUnit);

  return (
    <main className="tab-screen range-screen">
      <header className="mobile-screen-header">
        <h1>{t.rangeTitle}</h1>
        <button
          className="icon-button"
          onClick={onOpenSettings}
          type="button"
          aria-label={t.settingsButton}
        >
          <SettingsIcon className="button-icon" aria-hidden="true" strokeWidth={2.4} />
        </button>
      </header>

      <section className="range-board" aria-label={t.resultAriaLabel}>
        <div className="range-board-hero">
          <span className="range-board-kicker">
            <Route aria-hidden="true" strokeWidth={2.4} />
            {t.resultTitle}
          </span>
          {result.isUnlimited ? (
            <>
              <p
                aria-label={t.unlimitedRangeLabel}
                className="result-value"
                key="unlimited"
              >
                &infin; km
              </p>
              <p className="result-range">{t.unlimitedRangeDetail}</p>
            </>
          ) : (
            <>
              <p className="result-value" key={result.range}>{result.range} km</p>
              <p className="result-range">
                {t.realisticLabel}: {result.minRange} - {result.maxRange} km
              </p>
            </>
          )}
        </div>

        <div className="cycle-control-grid" aria-label={t.controlsAriaLabel}>
          <CycleControlButton
            hint={t.cycleButtonHint}
            icon={Mountain}
            onChange={onTerrainChange}
            options={t.terrainOptions}
            title={t.terrainLabel}
            value={terrain}
          />
          <CycleControlButton
            hint={t.cycleButtonHint}
            icon={BatteryCharging}
            onChange={onAssistChange}
            options={t.assistOptions}
            title={t.assistLabel}
            value={assist}
          />
        </div>

        <section className="pressure-mini-panel" aria-labelledby="range-pressure-title">
          <div className="pressure-mini-title">
            <Gauge className="row-icon" aria-hidden="true" strokeWidth={2.25} />
            <h2 id="range-pressure-title">{t.recommendedPressureTitle}</h2>
          </div>
          <div className="pressure-mini-values">
            <div>
              <span>{t.frontLabel}</span>
              <strong key={`front-${frontPressure}`}>
                {frontPressure} {pressureUnit}
              </strong>
            </div>
            <div>
              <span>{t.rearLabel}</span>
              <strong key={`rear-${rearPressure}`}>
                {rearPressure} {pressureUnit}
              </strong>
            </div>
          </div>
        </section>

        {hasCustomData ? (
          <section className="notice-inline" aria-label={t.noticeAriaLabel}>
            <Info className="row-icon" aria-hidden="true" strokeWidth={2.35} />
            <p>{t.customDataNotice}</p>
          </section>
        ) : (
          <button
            aria-label={t.sampleDataButtonAriaLabel}
            className="notice-inline notice-inline-button"
            onClick={onOpenSettings}
            type="button"
          >
            <Info className="row-icon" aria-hidden="true" strokeWidth={2.35} />
            <span>
              {t.sampleDataNoticeLine1}
              <br />
              {t.sampleDataNoticeLine2}
            </span>
          </button>
        )}
      </section>
    </main>
  );
}
