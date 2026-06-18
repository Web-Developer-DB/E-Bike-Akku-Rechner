import { useEffect, useMemo, useState } from 'react';
import { RangeCalculator } from './components/RangeCalculator';
import { InstallPromptModal } from './components/InstallPromptModal';
import { Settings } from './components/Settings';
import { WelcomeModal } from './components/WelcomeModal';
import { getPreferredLocale, TRANSLATIONS } from './i18n';
import { calculateRange } from './utils/calculateRange';
import {
  hasCustomSettings,
  loadSettings,
  saveSettings
} from './utils/storage';
import type { AssistLevel, CalculatorSettings, TerrainLevel } from './types';

/**
 * The app has only two screens by design: the calculator and settings form.
 */
type Screen = 'calculator' | 'settings';

/** Browser event fired when a PWA install prompt can be shown. */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt: () => Promise<void>;
}

/** Detects mobile-like browsers without relying only on user-agent strings. */
function isMobileLikeBrowser(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

/** Installed PWAs should not ask to install themselves again. */
function isStandaloneApp(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.matchMedia?.('(display-mode: standalone)').matches === true ||
    ('standalone' in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

/**
 * Root component for the entire app.
 *
 * App owns the central state: current screen, user settings, whether custom
 * data exists, and whether the sample-data modal should be visible. Child
 * components receive data and callbacks through props.
 */
function App() {
  /** Locale is detected once from the browser because no in-app language switch exists. */
  const [locale] = useState(() => getPreferredLocale());

  /** Translation object used by all child components. */
  const t = TRANSLATIONS[locale];

  /** Controls which of the two screens is currently displayed. */
  const [screen, setScreen] = useState<Screen>('calculator');

  /** Loads saved settings once on startup, then keeps changes in React state. */
  const [settings, setSettings] = useState<CalculatorSettings>(() => loadSettings());

  /** Tells the calculator whether to show the sample-data or saved-data notice. */
  const [hasCustomData, setHasCustomData] = useState(() => hasCustomSettings());

  /** Shows the sample-data modal on every app start until custom data is saved. */
  const [showSampleDataModal, setShowSampleDataModal] = useState(() => !hasCustomData);

  /** Stores the browser-provided PWA install prompt until the user chooses. */
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  /** Controls the custom install question shown before calling the browser prompt. */
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  /** Recalculates only when settings change, avoiding unnecessary work. */
  const result = useMemo(() => calculateRange(settings), [settings]);

  /**
   * Keeps browser metadata in sync with the selected UI language.
   *
   * This improves accessibility because screen readers can detect whether the
   * current document is German or English.
   */
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.appTitle;

    const manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');

    if (manifestLink) {
      manifestLink.href = locale === 'de' ? '/manifest.de.webmanifest' : '/manifest.webmanifest';
    }
  }, [locale, t.appTitle]);

  /** Captures the browser PWA install prompt on mobile-like browsers. */
  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event): void {
      if (!isMobileLikeBrowser() || isStandaloneApp()) {
        return;
      }

      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    }

    function handleAppInstalled(): void {
      setInstallPrompt(null);
      setShowInstallPrompt(false);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  /** Handles the "Verstanden" button in the sample-data modal. */
  function closeSampleDataModal(): void {
    setShowSampleDataModal(false);
  }

  /** Updates terrain immediately so the result can change live. */
  function handleTerrainChange(terrain: TerrainLevel): void {
    setSettings((currentSettings) => ({ ...currentSettings, terrain }));
  }

  /** Updates assistance immediately so the result can change live. */
  function handleAssistChange(assist: AssistLevel): void {
    setSettings((currentSettings) => ({ ...currentSettings, assist }));
  }

  /** Saves settings from the settings screen and returns to the calculator. */
  function handleSave(nextSettings: CalculatorSettings): void {
    const hasSavedCustomData = saveSettings(nextSettings);

    setSettings(nextSettings);
    setHasCustomData(hasSavedCustomData);
    setShowSampleDataModal(false);
    setScreen('calculator');
  }

  /** Starts the browser-controlled PWA installation prompt. */
  async function acceptInstallPrompt(): Promise<void> {
    if (!installPrompt) {
      setShowInstallPrompt(false);
      return;
    }

    setShowInstallPrompt(false);
    await installPrompt.prompt();
    await installPrompt.userChoice.catch(() => undefined);
    setInstallPrompt(null);
  }

  /** Closes the install question for the current page session only. */
  function declineInstallPrompt(): void {
    setShowInstallPrompt(false);
  }

  return (
    <div className="app-shell">
      {screen === 'calculator' ? (
        <RangeCalculator
          assist={settings.assist}
          hasCustomData={hasCustomData}
          onAssistChange={handleAssistChange}
          onOpenSettings={() => setScreen('settings')}
          onTerrainChange={handleTerrainChange}
          result={result}
          t={t}
          terrain={settings.terrain}
        />
      ) : (
        <Settings
          onBack={() => setScreen('calculator')}
          onSave={handleSave}
          settings={settings}
          t={t}
        />
      )}

      {showSampleDataModal ? (
        <WelcomeModal onClose={closeSampleDataModal} t={t} />
      ) : null}
      {showInstallPrompt && !showSampleDataModal ? (
        <InstallPromptModal
          onAccept={acceptInstallPrompt}
          onDecline={declineInstallPrompt}
          t={t}
        />
      ) : null}
    </div>
  );
}

export default App;
