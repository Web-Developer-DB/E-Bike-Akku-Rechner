/**
 * First-run modal explaining the difference between example and personal data.
 *
 * It intentionally offers two clear paths: configure personal values now or
 * continue immediately with the built-in examples.
 */
import { ArrowRight, Bike, SlidersHorizontal, Sparkles } from 'lucide-react';
import type { AppTranslations } from '../i18n';

/** Props for the sample-data notice dialog. */
/** Actions and localized copy supplied by App.tsx. */
interface WelcomeModalProps {
  onClose: () => void;
  onOpenSettings: () => void;
  t: AppTranslations;
}

/**
 * Sample-data notice modal.
 *
 * The modal explains that default sample data is used until the user saves
 * personal values in settings. App.tsx decides whether it should be visible.
 */
export function WelcomeModal({ onClose, onOpenSettings, t }: WelcomeModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section
        aria-labelledby="welcome-title"
        aria-modal="true"
        className="welcome-modal welcome-modal--sample"
        role="dialog"
      >
        <div className="welcome-modal-content">
          <div className="welcome-modal-heading">
            <span className="welcome-modal-icon" aria-hidden="true">
              <Bike className="welcome-bike-icon" strokeWidth={2.35} />
            </span>
            <div>
              <span className="welcome-eyebrow">
                <Sparkles aria-hidden="true" strokeWidth={2.4} />
                {t.welcomeEyebrow}
              </span>
              <h2 id="welcome-title">{t.welcomeTitle}</h2>
            </div>
          </div>

          <p className="welcome-lead">{t.welcomeTextLine1}</p>
          <p className="welcome-body">{t.welcomeTextLine2}</p>

          <div className="welcome-guidance">
            <SlidersHorizontal aria-hidden="true" strokeWidth={2.35} />
            <p>{t.welcomeTextLine3}</p>
          </div>

          <div className="welcome-actions">
            <button className="primary-button" onClick={onOpenSettings} type="button">
              <SlidersHorizontal className="button-icon" aria-hidden="true" strokeWidth={2.4} />
              {t.welcomeSetupButton}
            </button>
            <button className="welcome-secondary-action" onClick={onClose} type="button">
              {t.welcomeContinueButton}
              <ArrowRight className="button-icon" aria-hidden="true" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
