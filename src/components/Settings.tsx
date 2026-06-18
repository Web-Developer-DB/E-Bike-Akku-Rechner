import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  BatteryFull,
  Bike,
  Info,
  Save,
  UserRound,
  type LucideIcon
} from 'lucide-react';
import type { AppTranslations } from '../i18n';
import type { CalculatorSettings } from '../types';

/**
 * Props for the settings screen.
 *
 * Settings receives the current values, lets the user edit them, and returns a
 * complete CalculatorSettings object when the form is submitted.
 */
interface SettingsProps {
  settings: CalculatorSettings;
  t: AppTranslations;
  onBack: () => void;
  onSave: (settings: CalculatorSettings) => void;
}

/** Configuration for one numeric input field on the settings screen. */
interface FieldConfig {
  id: keyof Pick<CalculatorSettings, 'batteryCapacity' | 'riderWeight' | 'bikeWeight'>;
  icon: LucideIcon;
  label: string;
  max: number;
  min: number;
  unit: string;
}

/**
 * Builds localized field metadata for the settings form.
 *
 * Adding or changing a numeric field only requires updating this function and
 * the CalculatorSettings type.
 */
function getFields(t: AppTranslations): FieldConfig[] {
  return [
    {
      id: 'batteryCapacity',
      icon: BatteryFull,
      label: t.batteryCapacityLabel,
      min: 200,
      max: 1000,
      unit: 'Wh'
    },
    {
      id: 'riderWeight',
      icon: UserRound,
      label: t.riderWeightLabel,
      min: 40,
      max: 140,
      unit: 'kg'
    },
    {
      id: 'bikeWeight',
      icon: Bike,
      label: t.bikeWeightLabel,
      min: 15,
      max: 40,
      unit: 'kg'
    }
  ];
}

/** Restricts form values to the allowed UI range before saving. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Converts an input string into a number.
 *
 * If the user temporarily enters something invalid, the previous saved value is
 * used as a safe fallback.
 */
function toNumber(value: string, fallback: number): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Settings screen.
 *
 * The component keeps form input as strings because number inputs can be empty
 * while the user edits them. Values are converted and clamped only on submit.
 */
export function Settings({ settings, t, onBack, onSave }: SettingsProps) {
  /** Localized field metadata is built from the active translation object. */
  const fields = getFields(t);

  /** Local form state mirrors the visible input values. */
  const [formValues, setFormValues] = useState(() => ({
    batteryCapacity: String(settings.batteryCapacity),
    riderWeight: String(settings.riderWeight),
    bikeWeight: String(settings.bikeWeight)
  }));

  /** Converts string inputs into validated numbers and passes them to App.tsx. */
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const nextSettings = fields.reduce<CalculatorSettings>(
      (currentSettings, field) => {
        const numberValue = toNumber(formValues[field.id], settings[field.id]);

        return {
          ...currentSettings,
          [field.id]: Math.round(clamp(numberValue, field.min, field.max))
        };
      },
      { ...settings }
    );

    onSave(nextSettings);
  }

  return (
    <main className="screen-stack">
      {/* Header provides a simple back action and screen title. */}
      <header className="settings-header">
        <button className="back-button" onClick={onBack} type="button">
          <ArrowLeft className="button-icon" aria-hidden="true" strokeWidth={2.4} />
          {t.backButton}
        </button>
        <h1>{t.settingsTitle}</h1>
      </header>

      {/* Privacy note: all data stays on the current device. */}
      <section className="card info-card">
        <span className="icon-badge subtle" aria-hidden="true">
          <Info className="ui-icon" strokeWidth={2.35} />
        </span>
        <p>{t.privacyNotice}</p>
      </section>

      <form className="settings-form" onSubmit={handleSubmit}>
        {fields.map((field) => {
          /** Pull the icon component out so JSX can render it with a capital name. */
          const FieldIcon = field.icon;

          return (
            <div className="card settings-field" key={field.id}>
              <label htmlFor={field.id}>
                <span className="icon-badge" aria-hidden="true">
                  <FieldIcon className="ui-icon" strokeWidth={2.35} />
                </span>
                {field.label}
              </label>
              <div className="input-row">
                <input
                  aria-label={field.label}
                  id={field.id}
                  inputMode="numeric"
                  max={field.max}
                  min={field.min}
                  onChange={(event) =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      [field.id]: event.target.value
                    }))
                  }
                  type="number"
                  value={formValues[field.id]}
                />
                <span>{field.unit}</span>
              </div>
            </div>
          );
        })}

        <button className="primary-button save-button" type="submit">
          <Save className="button-icon" aria-hidden="true" strokeWidth={2.4} />
          {t.saveButton}
        </button>
      </form>
    </main>
  );
}
