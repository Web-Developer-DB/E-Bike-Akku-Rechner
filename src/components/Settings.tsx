import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  BatteryFull,
  Bike,
  Gauge,
  HeartPulse,
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
  TerrainLevel,
  TireWidthUnit
} from '../types';
import { barToPsi, psiToBar } from '../utils/calculateTirePressure';

interface SettingsProps {
  settings: CalculatorSettings;
  t: AppTranslations;
  onBack: () => void;
  onSave: (settings: CalculatorSettings) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function toNumber(value: string, fallback: number): number {
  const parsed = Number(value.replace(',', '.'));

  return Number.isFinite(parsed) ? parsed : fallback;
}

function toTerrainLevel(value: string, fallback: TerrainLevel): TerrainLevel {
  const parsed = Number(value);

  return [1, 2, 3, 4, 5].includes(parsed)
    ? (parsed as TerrainLevel)
    : fallback;
}

function toAssistLevel(value: string, fallback: AssistLevel): AssistLevel {
  const parsed = Number(value);

  return [1, 2, 3, 4, 5].includes(parsed)
    ? (parsed as AssistLevel)
    : fallback;
}

function toTireWidthUnit(value: string): TireWidthUnit {
  return value === 'inch' ? 'inch' : 'mm';
}

function toPressureUnit(value: string): PressureUnit {
  return value === 'psi' ? 'psi' : 'bar';
}

function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits;

  return Math.round(value * factor) / factor;
}

/** Settings screen for ride, tire, and battery data. */
export function Settings({ settings, t, onBack, onSave }: SettingsProps) {
  const [formValues, setFormValues] = useState(() => ({
    batteryCapacity: String(settings.batteryCapacity),
    batteryCharge: String(settings.batteryCharge),
    batteryHealth: String(settings.batteryHealth),
    chargeCycles: String(settings.chargeCycles),
    riderWeight: String(settings.riderWeight),
    bikeWeight: String(settings.bikeWeight),
    terrain: String(settings.terrain),
    assist: String(settings.assist),
    wheelSizeInch: String(settings.wheelSizeInch),
    tireWidthMm: String(settings.tireWidthMm),
    tireWidthInch: String(settings.tireWidthInch),
    tireWidthUnit: settings.tireWidthUnit,
    maxTirePressure:
      settings.pressureUnit === 'psi'
        ? String(barToPsi(settings.maxTirePressureBar))
        : String(settings.maxTirePressureBar),
    pressureUnit: settings.pressureUnit
  }));

  const activeTireWidthUnit = toTireWidthUnit(formValues.tireWidthUnit);
  const activePressureUnit = toPressureUnit(formValues.pressureUnit);

  function updateValue(key: keyof typeof formValues, value: string): void {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value
    }));
  }

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

  function updateTireWidthUnit(nextUnit: TireWidthUnit): void {
    updateValue('tireWidthUnit', nextUnit);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const tireWidthUnit = toTireWidthUnit(formValues.tireWidthUnit);
    const pressureUnit = toPressureUnit(formValues.pressureUnit);
    const activeWidthValue =
      tireWidthUnit === 'mm'
        ? toNumber(formValues.tireWidthMm, settings.tireWidthMm)
        : toNumber(formValues.tireWidthInch, settings.tireWidthInch);
    const tireWidthMm =
      tireWidthUnit === 'mm'
        ? Math.round(clamp(activeWidthValue, 25, 120))
        : Math.round(clamp(activeWidthValue, 1, 5) * 25.4);
    const tireWidthInch =
      tireWidthUnit === 'inch'
        ? roundTo(clamp(activeWidthValue, 1, 5), 2)
        : roundTo(clamp(activeWidthValue, 25, 120) / 25.4, 2);
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
      batteryCharge: Math.round(
        clamp(toNumber(formValues.batteryCharge, settings.batteryCharge), 0, 100)
      ),
      batteryHealth: Math.round(
        clamp(toNumber(formValues.batteryHealth, settings.batteryHealth), 50, 100)
      ),
      chargeCycles: Math.round(
        clamp(toNumber(formValues.chargeCycles, settings.chargeCycles), 0, 2000)
      ),
      riderWeight: Math.round(
        clamp(toNumber(formValues.riderWeight, settings.riderWeight), 40, 140)
      ),
      bikeWeight: Math.round(
        clamp(toNumber(formValues.bikeWeight, settings.bikeWeight), 15, 40)
      ),
      terrain: toTerrainLevel(formValues.terrain, settings.terrain),
      assist: toAssistLevel(formValues.assist, settings.assist),
      wheelSizeInch: clamp(
        toNumber(formValues.wheelSizeInch, settings.wheelSizeInch),
        12,
        29
      ),
      tireWidthMm,
      tireWidthInch,
      tireWidthUnit,
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
                onChange={(event) => updateValue('wheelSizeInch', event.target.value)}
                value={formValues.wheelSizeInch}
              >
                {[16, 18, 20, 24, 26, 27.5, 28, 29].map((size) => (
                  <option key={size} value={size}>
                    {size} {t.inchLabel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card settings-field">
            <label htmlFor="tireWidthMm">
              <span className="icon-badge" aria-hidden="true">
                <Ruler className="ui-icon" strokeWidth={2.35} />
              </span>
              {t.tireWidthLabel}
            </label>
            <div className="segmented-control" aria-label={t.tireWidthLabel}>
              <button
                className={activeTireWidthUnit === 'mm' ? 'is-active' : undefined}
                onClick={() => updateTireWidthUnit('mm')}
                type="button"
              >
                {t.millimeterLabel}
              </button>
              <button
                className={activeTireWidthUnit === 'inch' ? 'is-active' : undefined}
                onClick={() => updateTireWidthUnit('inch')}
                type="button"
              >
                {t.inchLabel}
              </button>
            </div>
            <div className="input-row">
              <input
                aria-label={t.tireWidthLabel}
                id="tireWidthMm"
                inputMode="decimal"
                max={activeTireWidthUnit === 'mm' ? 120 : 5}
                min={activeTireWidthUnit === 'mm' ? 25 : 1}
                onChange={(event) =>
                  updateValue(
                    activeTireWidthUnit === 'mm' ? 'tireWidthMm' : 'tireWidthInch',
                    event.target.value
                  )
                }
                type="number"
                value={
                  activeTireWidthUnit === 'mm'
                    ? formValues.tireWidthMm
                    : formValues.tireWidthInch
                }
              />
              <span>{activeTireWidthUnit === 'mm' ? 'mm' : t.inchLabel}</span>
            </div>
            <p className="field-help">
              {activeTireWidthUnit === 'mm' ? t.typicalWidthMm : t.typicalWidthInch}
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
                type="number"
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

        <section className="settings-section" aria-labelledby="battery-settings-title">
          <h2 id="battery-settings-title">{t.batterySettingsTitle}</h2>

          <div className="settings-two-column">
            <div className="card settings-field">
              <label htmlFor="batteryCharge">
                <span className="icon-badge" aria-hidden="true">
                  <BatteryFull className="ui-icon" strokeWidth={2.35} />
                </span>
                {t.batteryChargeLabel}
              </label>
              <div className="input-row">
                <input
                  aria-label={t.batteryChargeLabel}
                  id="batteryCharge"
                  inputMode="numeric"
                  max={100}
                  min={0}
                  onChange={(event) => updateValue('batteryCharge', event.target.value)}
                  type="number"
                  value={formValues.batteryCharge}
                />
                <span>%</span>
              </div>
            </div>

            <div className="card settings-field">
              <label htmlFor="batteryHealth">
                <span className="icon-badge" aria-hidden="true">
                  <HeartPulse className="ui-icon" strokeWidth={2.35} />
                </span>
                {t.batteryHealthLabel}
              </label>
              <div className="input-row">
                <input
                  aria-label={t.batteryHealthLabel}
                  id="batteryHealth"
                  inputMode="numeric"
                  max={100}
                  min={50}
                  onChange={(event) => updateValue('batteryHealth', event.target.value)}
                  type="number"
                  value={formValues.batteryHealth}
                />
                <span>%</span>
              </div>
            </div>

            <div className="card settings-field">
              <label htmlFor="chargeCycles">
                <span className="icon-badge" aria-hidden="true">
                  <Gauge className="ui-icon" strokeWidth={2.35} />
                </span>
                {t.chargeCyclesLabel}
              </label>
              <div className="input-row">
                <input
                  aria-label={t.chargeCyclesLabel}
                  id="chargeCycles"
                  inputMode="numeric"
                  max={2000}
                  min={0}
                  onChange={(event) => updateValue('chargeCycles', event.target.value)}
                  type="number"
                  value={formValues.chargeCycles}
                />
                <span>#</span>
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
