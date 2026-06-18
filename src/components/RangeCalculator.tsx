import { BatteryCharging, Info, Mountain, Settings as SettingsIcon } from 'lucide-react';
import type { AppTranslations } from '../i18n';
import type { AssistLevel, RangeResult, TerrainLevel } from '../types';
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
  terrain,
  assist,
  hasCustomData,
  t,
  onTerrainChange,
  onAssistChange,
  onOpenSettings
}: RangeCalculatorProps) {
  return (
    <main className="screen-stack">
      {/* Header contains navigation to the settings screen and the app title. */}
      <header className="app-header">
        <button className="settings-button" onClick={onOpenSettings} type="button">
          <SettingsIcon className="button-icon" aria-hidden="true" strokeWidth={2.4} />
          {t.settingsButton}
        </button>
        <div className="app-title">
          <h1>{t.appTitle}</h1>
          <p>{t.appSubtitle}</p>
        </div>
      </header>

      {/* Both sliders update App state immediately, which recalculates the result. */}
      <div className="control-grid" aria-label={t.controlsAriaLabel}>
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

      {/* ResultCard only displays values; it does not know the formula. */}
      <ResultCard result={result} t={t} />

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
