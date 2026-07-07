import { ClipboardCheck, Info, Road, Trees } from 'lucide-react';
import type { AppTranslations } from '../i18n';
import type { CalculatorSettings, PressureUnit } from '../types';
import type { TirePressureResult } from '../utils/calculateTirePressure';

interface TirePressureScreenProps {
  pressure: TirePressureResult;
  settings: CalculatorSettings;
  t: AppTranslations;
  onMarkChecked: () => void;
}

function formatNumber(value: number, digits: number): string {
  return new Intl.NumberFormat(navigator.language, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);
}

function getPressureValue(
  pressure: TirePressureResult,
  position: 'front' | 'rear' | 'max',
  unit: PressureUnit
): string {
  if (unit === 'psi') {
    const value = position === 'front'
      ? pressure.frontPsi
      : position === 'rear'
        ? pressure.rearPsi
        : pressure.maxPsi;

    return formatNumber(value, 0);
  }

  const value = position === 'front'
    ? pressure.frontBar
    : position === 'rear'
      ? pressure.rearBar
      : pressure.maxBar;

  return formatNumber(value, 1);
}

function getLastCheckText(days: number, t: AppTranslations): string {
  const isGerman = t.backButton === 'Zurück';

  if (days === 0) {
    return isGerman ? 'Heute' : 'Today';
  }

  return isGerman ? `Vor ${days} Tagen` : `${days} days ago`;
}

/** Displays recommended tire pressure and practical riding notes. */
export function TirePressureScreen({
  pressure,
  settings,
  t,
  onMarkChecked
}: TirePressureScreenProps) {
  const unitLabel = settings.pressureUnit === 'bar' ? t.barLabel : t.psiLabel;

  return (
    <main className="tab-screen pressure-screen">
      <header className="mobile-screen-header">
        <h1>{t.pressureTitle}</h1>
        <button
          className="icon-button"
          type="button"
          aria-label={t.infoButtonAriaLabel}
        >
          <Info className="button-icon" aria-hidden="true" strokeWidth={2.4} />
        </button>
      </header>

      <div className="page-dots" aria-hidden="true">
        <span className="is-active" />
        <span />
        <span />
        <span />
      </div>

      <section className="screen-section" aria-labelledby="pressure-recommendation">
        <h2 id="pressure-recommendation">{t.recommendedPressureTitle}</h2>
        <div className="pressure-card-grid">
          <article className="card pressure-card">
            <div>
              <h3>{t.frontLabel}</h3>
              <p className="pressure-value">
                {getPressureValue(pressure, 'front', settings.pressureUnit)}
                <span>{unitLabel}</span>
              </p>
            </div>
            <img src="/icon.svg" alt="" className="bike-card-visual" />
          </article>

          <article className="card pressure-card">
            <div>
              <h3>{t.rearLabel}</h3>
              <p className="pressure-value">
                {getPressureValue(pressure, 'rear', settings.pressureUnit)}
                <span>{unitLabel}</span>
              </p>
            </div>
            <img src="/icon.svg" alt="" className="bike-card-visual" />
          </article>
        </div>
      </section>

      <section className="card compact-metric-card">
        <div>
          <h2>{t.maxPressureTitle}</h2>
          <p className="metric-value">
            {getPressureValue(pressure, 'max', settings.pressureUnit)}
            <span>{unitLabel}</span>
          </p>
          <p>{t.fromTireSidewall}</p>
        </div>
      </section>

      <section className="card check-card">
        <div>
          <h2>{t.lastCheckTitle}</h2>
          <p>{getLastCheckText(settings.lastPressureCheckDays, t)}</p>
        </div>
        <button className="small-primary-button" type="button" onClick={onMarkChecked}>
          <ClipboardCheck className="button-icon" aria-hidden="true" strokeWidth={2.4} />
          {t.checkedButton}
        </button>
      </section>

      <section
        className="screen-section pressure-hints-section"
        aria-labelledby="pressure-hints"
      >
        <h2 id="pressure-hints">{t.pressureHintsTitle}</h2>
        <div className="hint-grid">
          <article className="card hint-card">
            <Road className="hint-icon" aria-hidden="true" strokeWidth={2.2} />
            <div>
              <h3>{t.asphaltTitle}</h3>
              <p>{t.asphaltText}</p>
            </div>
          </article>

          <article className="card hint-card">
            <Trees className="hint-icon" aria-hidden="true" strokeWidth={2.2} />
            <div>
              <h3>{t.gravelTitle}</h3>
              <p>{t.gravelText}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="card notice-card pressure-notice">
        <span className="icon-badge subtle" aria-hidden="true">
          <Info className="ui-icon" strokeWidth={2.35} />
        </span>
        <div>
          <h2>{t.pressureNoticeTitle}</h2>
          <p>{t.pressureNoticeText}</p>
        </div>
      </section>

      <section className="pressure-info-band">
        <div>
          <h2>{t.conversionTitle}</h2>
          <div className="conversion-box">
            <p>1 bar = 14,5 PSI</p>
            <p>1 PSI = 0,0689 bar</p>
          </div>
        </div>
        <div>
          <h2>{t.whyPressureTitle}</h2>
          <ul className="check-list">
            <li>{t.pressureBenefitRange}</li>
            <li>{t.pressureBenefitComfort}</li>
            <li>{t.pressureBenefitPunctures}</li>
            <li>{t.pressureBenefitGrip}</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
