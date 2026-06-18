import { useEffect, useMemo, useState } from 'react';
import { RangeCalculator } from './components/RangeCalculator';
import { Settings } from './components/Settings';
import { WelcomeModal } from './components/WelcomeModal';
import { getPreferredLocale, TRANSLATIONS } from './i18n';
import { calculateRange } from './utils/calculateRange';
import {
  hasCustomSettings,
  hasSeenWelcome,
  loadSettings,
  saveSettings,
  saveWelcomeSeen
} from './utils/storage';
import type { AssistLevel, CalculatorSettings, TerrainLevel } from './types';

/**
 * The app has only two screens by design: the calculator and settings form.
 */
type Screen = 'calculator' | 'settings';

/**
 * Root component for the entire app.
 *
 * App owns the central state: current screen, user settings, whether custom
 * data exists, and whether the welcome modal should be visible. Child
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

  /** Shows the welcome modal only when localStorage says it has not been seen. */
  const [showWelcome, setShowWelcome] = useState(() => !hasSeenWelcome());

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

  /** Handles the "Verstanden" button in the welcome modal. */
  function closeWelcome(): void {
    saveWelcomeSeen();
    setShowWelcome(false);
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
    saveSettings(nextSettings);
    setSettings(nextSettings);
    setHasCustomData(true);
    setScreen('calculator');
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

      {showWelcome ? <WelcomeModal onClose={closeWelcome} t={t} /> : null}
    </div>
  );
}

export default App;
