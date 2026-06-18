import { Download, X } from 'lucide-react';
import type { AppTranslations } from '../i18n';

/** Props for the PWA installation question. */
interface InstallPromptModalProps {
  t: AppTranslations;
  onAccept: () => void | Promise<void>;
  onDecline: () => void;
}

/**
 * Dialog shown before opening the browser-controlled PWA install prompt.
 *
 * Browsers decide whether a site is installable. This component only asks the
 * user's intent before App.tsx calls the saved beforeinstallprompt event.
 */
export function InstallPromptModal({
  t,
  onAccept,
  onDecline
}: InstallPromptModalProps) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section
        aria-labelledby="install-title"
        aria-modal="true"
        className="welcome-modal"
        role="dialog"
      >
        <h2 id="install-title">{t.installPromptTitle}</h2>
        <p>{t.installPromptText}</p>
        <div className="modal-actions">
          <button className="primary-button" onClick={onAccept} type="button">
            <Download className="button-icon" aria-hidden="true" strokeWidth={2.4} />
            {t.installPromptAccept}
          </button>
          <button className="secondary-button" onClick={onDecline} type="button">
            <X className="button-icon" aria-hidden="true" strokeWidth={2.4} />
            {t.installPromptDecline}
          </button>
        </div>
      </section>
    </div>
  );
}
