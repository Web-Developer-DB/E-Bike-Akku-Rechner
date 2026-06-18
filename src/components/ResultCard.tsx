import { Bike } from 'lucide-react';
import type { AppTranslations } from '../i18n';
import type { RangeResult } from '../types';

/** Props for the result card. */
interface ResultCardProps {
  result: RangeResult;
  t: AppTranslations;
}

/**
 * Displays the calculated range in a large, easy-to-scan format.
 *
 * This component intentionally receives finished values. It does not perform
 * calculations, which keeps visual rendering separate from business logic.
 */
export function ResultCard({ result, t }: ResultCardProps) {
  return (
    <section
      aria-label={t.resultAriaLabel}
      className="card result-card"
    >
      <div className="result-title">
        <span className="icon-badge" aria-hidden="true">
          <Bike className="ui-icon" strokeWidth={2.35} />
        </span>
        <h2>{t.resultTitle}</h2>
      </div>
      <p className="result-value">{result.range} km</p>
      <p className="result-range">
        {t.realisticLabel}: {result.minRange} - {result.maxRange} km
      </p>
      <p className="result-note">{t.resultNote}</p>
    </section>
  );
}
