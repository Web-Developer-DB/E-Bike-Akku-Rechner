import { CheckCircle2 } from 'lucide-react';
import type { AppTranslations } from '../i18n';

/** Props for the sample-data notice dialog. */
interface WelcomeModalProps {
  onClose: () => void;
  t: AppTranslations;
}

/**
 * Sample-data notice modal.
 *
 * The modal explains that default sample data is used until the user saves
 * personal values in settings. App.tsx decides whether it should be visible.
 */
export function WelcomeModal({ onClose, t }: WelcomeModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section
        aria-labelledby="welcome-title"
        aria-modal="true"
        className="welcome-modal"
        role="dialog"
      >
        <h2 id="welcome-title">{t.welcomeTitle}</h2>
        <p>{t.welcomeTextLine1}</p>
        <p>{t.welcomeTextLine2}</p>
        <p>{t.welcomeTextLine3}</p>
        <button className="primary-button" onClick={onClose} type="button">
          <CheckCircle2 className="button-icon" aria-hidden="true" strokeWidth={2.4} />
          {t.understoodButton}
        </button>
      </section>
    </div>
  );
}
