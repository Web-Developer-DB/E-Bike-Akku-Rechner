/**
 * Settings form for the values that influence range and tire pressure.
 *
 * The form keeps raw text locally while the user edits. Only on submit are
 * values parsed, clamped, normalized, and sent back to App.tsx for storage.
 */
import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  BatteryFull,
  Bike,
  Gauge,
  Mountain,
  Ruler,
  Save,
  UserRound
} from 'lucide-react';
import type { AppTranslations } from '../i18n';
import type {
  AssistLevel,
  CalculatorSettings,
  PressureUnit,
  TerrainLevel
} from '../types';
import { barToPsi, psiToBar } from '../utils/calculateTirePressure';
import {
  formatTireSizeLabel,
  getClosestTireSize,
  getTireSizeById,
  getTireSizesByWheel,
  getWheelSizeOptions
} from '../data/tireSizes';

/** Settings data and callbacks provided by the parent component. */
interface SettingsProps {
  settings: CalculatorSettings;
  t: AppTranslations;
  onBack: () => void;
  onSave: (settings: CalculatorSettings) => void;
}

/** Restricts a parsed numeric setting to the range accepted by the app. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Parses both German comma decimals and standard dot decimals. */
function toNumber(value: string, fallback: number): number {
  const parsed = Number(value.replace(',', '.'));

  return Number.isFinite(parsed) ? parsed : fallback;
}

/** Converts a select value into one of the five valid terrain levels. */
function toTerrainLevel(value: string, fallback: TerrainLevel): TerrainLevel {
  const parsed = Number(value);

  return [1, 2, 3, 4, 5].includes(parsed)
    ? (parsed as TerrainLevel)
    : fallback;
}

/** Converts a select value into one of the five valid assistance levels. */
function toAssistLevel(value: string, fallback: AssistLevel): AssistLevel {
  const parsed = Number(value);

  return [1, 2, 3, 4, 5].includes(parsed)
    ? (parsed as AssistLevel)
    : fallback;
}

/** Accepts only supported pressure units and defaults unknown values to bar. */
function toPressureUnit(value: string): PressureUnit {
  return value === 'psi' ? 'psi' : 'bar';
}

/** Rounds persisted measurements to a predictable number of decimal places. */
function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits;

  return Math.round(value * factor) / factor;
}

/** Settings screen for the ride values and tire data the calculator still needs. */
export function Settings({ settings, t, onBack, onSave }: SettingsProps) {
  /**
   * Raw form state mirrors input strings so incomplete edits remain possible.
   * Calculated settings are produced only after the user presses Save.
   */
  const [formValues, setFormValues] = useState(() => ({
    batteryCapacity: String(settings.batteryCapacity),
    riderWeight: String(settings.riderWeight),
    bikeWeight: String(settings.bikeWeight),
    terrain: String(settings.terrain),
    assist: String(settings.assist),
    wheelSizeInch: String(settings.wheelSizeInch),
    tireSizeId: settings.tireSizeId,
    maxTirePressure:
      settings.pressureUnit === 'psi'
        ? String(barToPsi(settings.maxTirePressureBar))
        : String(settings.maxTirePressureBar),
    pressureUnit: settings.pressureUnit
  }));

  const activePressureUnit = toPressureUnit(formValues.pressureUnit);
  const wheelSizeOptions = getWheelSizeOptions();
  const selectedWheelSize = toNumber(formValues.wheelSizeInch, settings.wheelSizeInch);
  const tireSizeOptions = getTireSizesByWheel(selectedWheelSize);
  const selectedTireSize =
    getTireSizeById(formValues.tireSizeId) ??
    tireSizeOptions[0] ??
    getClosestTireSize(settings.wheelSizeInch, settings.tireWidthMm);

  /** Updates one raw form field without parsing unrelated fields. */
  function updateValue(key: keyof typeof formValues, value: string): void {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value
    }));
  }

  /** Converts the visible maximum pressure when the user switches units. */
  function updatePressureUnit(nextUnit: PressureUnit): void {
    setFormValues((currentValues) => {
      const currentUnit = toPressureUnit(currentValues.pressureUnit);

      if (currentUnit === nextUnit) {
        return currentValues;
      }

      const currentValue = toNumber(
        currentValues.maxTirePressure,
        currentUnit === 'psi' ? barToPsi(settings.maxTirePressureBar) : settings.maxTirePressureBar
      );
      const convertedValue =
        nextUnit === 'psi' ? barToPsi(currentValue) : psiToBar(currentValue);

      return {
        ...currentValues,
        pressureUnit: nextUnit,
        maxTirePressure: String(convertedValue)
      };
    });
  }

  /** Keeps tire-width selection compatible with the newly selected wheel size. */
  function updateWheelSize(nextWheelSize: string): void {
    const wheelSizeInch = toNumber(nextWheelSize, settings.wheelSizeInch);
    const nextTireSize = getClosestTireSize(
      wheelSizeInch,
      selectedTireSize.widthMm
    );

    setFormValues((currentValues) => ({
      ...currentValues,
      wheelSizeInch: nextWheelSize,
      tireSizeId: nextTireSize.id
    }));
  }

  /** Validates, clamps, normalizes, and submits all settings at once. */
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const pressureUnit = toPressureUnit(formValues.pressureUnit);
    const tireSize =
      getTireSizeById(formValues.tireSizeId) ??
      getClosestTireSize(settings.wheelSizeInch, settings.tireWidthMm);
    const rawMaxPressure = toNumber(
      formValues.maxTirePressure,
      pressureUnit === 'psi' ? barToPsi(settings.maxTirePressureBar) : settings.maxTirePressureBar
    );
    const maxTirePressureBar =
      pressureUnit === 'psi'
        ? clamp(psiToBar(rawMaxPressure), 1.5, 8)
        : clamp(rawMaxPressure, 1.5, 8);

    onSave({
      ...settings,
      batteryCapacity: Math.round(
        clamp(toNumber(formValues.batteryCapacity, settings.batteryCapacity), 200, 1000)
      ),
      riderWeight: Math.round(
        clamp(toNumber(formValues.riderWeight, settings.riderWeight), 40, 140)
      ),
      bikeWeight: Math.round(
        clamp(toNumber(formValues.bikeWeight, settings.bikeWeight), 15, 40)
      ),
      terrain: toTerrainLevel(formValues.terrain, settings.terrain),
      assist: toAssistLevel(formValues.assist, settings.assist),
      wheelSizeInch: tireSize.wheelSizeInch,
      tireSizeId: tireSize.id,
      tireWidthMm: tireSize.widthMm,
      tireWidthInch: roundTo(tireSize.widthMm / 25.4, 2),
      tireWidthUnit: 'mm',
      maxTirePressureBar: roundTo(maxTirePressureBar, 1),
      pressureUnit
    });
  }

  return (
    <main className="tab-screen">
      <header className="settings-header compact">
        <button className="back-button ghost" onClick={onBack} type="button">
          <ArrowLeft className="button-icon" aria-hidden="true" strokeWidth={2.4} />
          {t.backButton}
        </button>
        <h1>{t.settingsTitle}</h1>
      </header>

      <form className="settings-form" onSubmit={handleSubmit}>
        <section className="settings-section" aria-labelledby="tire-settings-title">
          <h2 id="tire-settings-title">{t.tireSettingsTitle}</h2>

          <div className="card settings-field">
            <label htmlFor="wheelSizeInch">
              <span className="icon-badge" aria-hidden="true">
                <Gauge className="ui-icon" strokeWidth={2.35} />
              </span>
              {t.wheelSizeLabel}
            </label>
            <div className="input-row">
              <select
                id="wheelSizeInch"
                onChange={(event) => updateWheelSize(event.target.value)}
                value={formValues.wheelSizeInch}
              >
                {wheelSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} {t.inchLabel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card settings-field">
            <label htmlFor="tireSizeId">
              <span className="icon-badge" aria-hidden="true">
                <Ruler className="ui-icon" strokeWidth={2.35} />
              </span>
              {t.tireWidthLabel}
            </label>
            <div className="input-row">
              <select
                aria-label={t.tireWidthLabel}
                id="tireSizeId"
                onChange={(event) => updateValue('tireSizeId', event.target.value)}
                value={selectedTireSize.id}
              >
                {tireSizeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {formatTireSizeLabel(option)}
                  </option>
                ))}
              </select>
            </div>
            <p className="field-help">
              ETRTO {selectedTireSize.id} · {selectedTireSize.widthMm} mm
            </p>
          </div>

          <div className="card settings-field">
            <label htmlFor="maxTirePressure">
              <span className="icon-badge" aria-hidden="true">
                <Bike className="ui-icon" strokeWidth={2.35} />
              </span>
              {t.maxPressureLabel}
            </label>
            <div className="segmented-control" aria-label={t.pressureUnitLabel}>
              <button
                className={activePressureUnit === 'bar' ? 'is-active' : undefined}
                onClick={() => updatePressureUnit('bar')}
                type="button"
              >
                {t.barLabel}
              </button>
              <button
                className={activePressureUnit === 'psi' ? 'is-active' : undefined}
                onClick={() => updatePressureUnit('psi')}
                type="button"
              >
                {t.psiLabel}
              </button>
            </div>
            <div className="input-row">
              <input
                aria-label={t.maxPressureLabel}
                id="maxTirePressure"
                inputMode="decimal"
                onChange={(event) => updateValue('maxTirePressure', event.target.value)}
                pattern="[0-9]+([,.][0-9]+)?"
                type="text"
                value={formValues.maxTirePressure}
              />
              <span>{activePressureUnit === 'bar' ? t.barLabel : t.psiLabel}</span>
            </div>
            <p className="field-help">
              {activePressureUnit === 'bar'
                ? '1 bar = 14,5 PSI'
                : '1 PSI = 0,0689 bar'}
            </p>
          </div>
        </section>

        <section className="settings-section" aria-labelledby="ride-settings-title">
          <h2 id="ride-settings-title">{t.rideSettingsTitle}</h2>

          <div className="settings-two-column">
            <div className="card settings-field">
              <label htmlFor="batteryCapacity">
                <span className="icon-badge" aria-hidden="true">
                  <BatteryFull className="ui-icon" strokeWidth={2.35} />
                </span>
                {t.batteryCapacityLabel}
              </label>
              <div className="input-row">
                <input
                  aria-label={t.batteryCapacityLabel}
                  id="batteryCapacity"
                  inputMode="numeric"
                  max={1000}
                  min={200}
                  onChange={(event) => updateValue('batteryCapacity', event.target.value)}
                  type="number"
                  value={formValues.batteryCapacity}
                />
                <span>Wh</span>
              </div>
            </div>

            <div className="card settings-field">
              <label htmlFor="riderWeight">
                <span className="icon-badge" aria-hidden="true">
                  <UserRound className="ui-icon" strokeWidth={2.35} />
                </span>
                {t.riderWeightLabel}
              </label>
              <div className="input-row">
                <input
                  aria-label={t.riderWeightLabel}
                  id="riderWeight"
                  inputMode="numeric"
                  max={140}
                  min={40}
                  onChange={(event) => updateValue('riderWeight', event.target.value)}
                  type="number"
                  value={formValues.riderWeight}
                />
                <span>kg</span>
              </div>
            </div>

            <div className="card settings-field">
              <label htmlFor="bikeWeight">
                <span className="icon-badge" aria-hidden="true">
                  <Bike className="ui-icon" strokeWidth={2.35} />
                </span>
                {t.bikeWeightLabel}
              </label>
              <div className="input-row">
                <input
                  aria-label={t.bikeWeightLabel}
                  id="bikeWeight"
                  inputMode="numeric"
                  max={40}
                  min={15}
                  onChange={(event) => updateValue('bikeWeight', event.target.value)}
                  type="number"
                  value={formValues.bikeWeight}
                />
                <span>kg</span>
              </div>
            </div>

            <div className="card settings-field">
              <label htmlFor="terrain">
                <span className="icon-badge" aria-hidden="true">
                  <Mountain className="ui-icon" strokeWidth={2.35} />
                </span>
                {t.terrainLabel}
              </label>
              <div className="input-row">
                <select
                  id="terrain"
                  onChange={(event) => updateValue('terrain', event.target.value)}
                  value={formValues.terrain}
                >
                  {t.terrainOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="card settings-field">
              <label htmlFor="assist">
                <span className="icon-badge" aria-hidden="true">
                  <Gauge className="ui-icon" strokeWidth={2.35} />
                </span>
                {t.assistLabel}
              </label>
              <div className="input-row">
                <select
                  id="assist"
                  onChange={(event) => updateValue('assist', event.target.value)}
                  value={formValues.assist}
                >
                  {t.assistOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <button className="primary-button save-button" type="submit">
          <Save className="button-icon" aria-hidden="true" strokeWidth={2.4} />
          {t.saveButton}
        </button>
      </form>
    </main>
  );
}
