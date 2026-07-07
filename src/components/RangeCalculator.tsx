import {
  BatteryCharging,
  BatteryFull,
  Bike,
  Info,
  Mountain,
  Settings as SettingsIcon,
  UserRound
} from 'lucide-react';
import type { AppTranslations } from '../i18n';
import type { AssistLevel, CalculatorSettings, RangeResult, TerrainLevel } from '../types';
import { ResultCard } from './ResultCard';
import { SliderCard } from './SliderCard';

/**
 * Props for the main calculator screen.
 *
 * The component stays presentational: it receives the already calculated result
 * and reports user actions upward through callbacks.
 */
interface RangeCalculatorProps {
  result: RangeResult;
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
 * Main calculator screen.
 *
 * This screen places the settings button first, then the two live sliders, then
 * the calculated result. That order makes the controls easy to reach on a
 * smartphone before users inspect the final range.
 */
export function RangeCalculator({
  result,
  settings,
  terrain,
  assist,
  hasCustomData,
  t,
  onTerrainChange,
  onAssistChange,
  onOpenSettings
}: RangeCalculatorProps) {
  const selectedTerrain = t.terrainOptions.find((option) => option.value === terrain);
  const selectedAssist = t.assistOptions.find((option) => option.value === assist);

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

      {/* ResultCard only displays values; it does not know the formula. */}
      <ResultCard result={result} t={t} />

      <section className="card data-list" aria-label={t.rangeDetailsAriaLabel}>
        <div className="data-row">
          <span className="data-row-label">
            <BatteryFull className="row-icon" aria-hidden="true" strokeWidth={2.25} />
            {t.batteryCapacityLabel}
          </span>
          <strong>{settings.batteryCapacity} Wh</strong>
        </div>
        <div className="data-row">
          <span className="data-row-label">
            <BatteryCharging className="row-icon" aria-hidden="true" strokeWidth={2.25} />
            {t.assistLabel}
          </span>
          <strong>{selectedAssist?.label ?? assist}</strong>
        </div>
        <div className="data-row">
          <span className="data-row-label">
            <Mountain className="row-icon" aria-hidden="true" strokeWidth={2.25} />
            {t.terrainLabel}
          </span>
          <strong>{selectedTerrain?.label ?? terrain}</strong>
        </div>
        <div className="data-row">
          <span className="data-row-label">
            <UserRound className="row-icon" aria-hidden="true" strokeWidth={2.25} />
            {t.riderWeightLabel}
          </span>
          <strong>{settings.riderWeight} kg</strong>
        </div>
        <div className="data-row">
          <span className="data-row-label">
            <Bike className="row-icon" aria-hidden="true" strokeWidth={2.25} />
            {t.bikeWeightLabel}
          </span>
          <strong>{settings.bikeWeight} kg</strong>
        </div>
      </section>

      {/* Both sliders update App state immediately, which recalculates the result. */}
      <div className="control-grid quick-controls" aria-label={t.controlsAriaLabel}>
        <SliderCard
          icon={Mountain}
          onChange={onTerrainChange}
          options={t.terrainOptions}
          title={t.terrainLabel}
          value={terrain}
        />
        <SliderCard
          icon={BatteryCharging}
          onChange={onAssistChange}
          options={t.assistOptions}
          title={t.assistLabel}
          value={assist}
        />
      </div>

      {/* The notice changes depending on whether the user saved personal data. */}
      {hasCustomData ? (
        <section className="card notice-card" aria-label={t.noticeAriaLabel}>
          <span className="icon-badge subtle" aria-hidden="true">
            <Info className="ui-icon" strokeWidth={2.35} />
          </span>
          <p>{t.customDataNotice}</p>
        </section>
      ) : (
        <button
          aria-label={t.sampleDataButtonAriaLabel}
          className="card notice-card notice-button"
          onClick={onOpenSettings}
          type="button"
        >
          <span className="icon-badge subtle" aria-hidden="true">
            <Info className="ui-icon" strokeWidth={2.35} />
          </span>
          <p>
            {t.sampleDataNoticeLine1}
            <br />
            {t.sampleDataNoticeLine2}
          </p>
        </button>
      )}
    </main>
  );
}
