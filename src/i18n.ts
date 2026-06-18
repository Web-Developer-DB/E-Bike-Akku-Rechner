import type { AssistLevel, Option, TerrainLevel } from './types';

/**
 * Small internal internationalization module.
 *
 * The app does not use external APIs, GPS, or cloud services. Therefore it
 * chooses the language from the browser locale. German browser locales such as
 * de-DE and de-AT get German text; every other locale gets English text.
 */

/** Supported UI languages. */
export type AppLocale = 'de' | 'en';

/** All translated labels and UI texts used by React components. */
export interface AppTranslations {
  appTitle: string;
  appSubtitle: string;
  settingsButton: string;
  settingsTitle: string;
  backButton: string;
  saveButton: string;
  understoodButton: string;
  terrainLabel: string;
  assistLabel: string;
  controlsAriaLabel: string;
  resultAriaLabel: string;
  resultTitle: string;
  realisticLabel: string;
  resultNote: string;
  noticeAriaLabel: string;
  customDataNotice: string;
  sampleDataButtonAriaLabel: string;
  sampleDataNoticeLine1: string;
  sampleDataNoticeLine2: string;
  privacyNotice: string;
  batteryCapacityLabel: string;
  riderWeightLabel: string;
  bikeWeightLabel: string;
  welcomeTitle: string;
  welcomeTextLine1: string;
  welcomeTextLine2: string;
  welcomeTextLine3: string;
  terrainOptions: Option<TerrainLevel>[];
  assistOptions: Option<AssistLevel>[];
}

/** German text for Germany, Austria, and other German browser locales. */
const de: AppTranslations = {
  appTitle: 'E-Bike Akku-Rechner',
  appSubtitle: 'Reichweite einfach berechnen',
  settingsButton: 'Einstellungen',
  settingsTitle: 'Einstellungen',
  backButton: 'Zurück',
  saveButton: 'Speichern',
  understoodButton: 'Verstanden',
  terrainLabel: 'Gelände',
  assistLabel: 'Unterstützung',
  controlsAriaLabel: 'Fahrt anpassen',
  resultAriaLabel: 'Ergebnis der Reichweitenberechnung',
  resultTitle: 'Geschätzte Reichweite',
  realisticLabel: 'Realistisch',
  resultNote:
    'Die tatsächliche Reichweite kann je nach Wetter, Fahrweise und Reifendruck abweichen.',
  noticeAriaLabel: 'Hinweis',
  customDataNotice: 'Berechnet mit Ihren gespeicherten Daten.',
  sampleDataButtonAriaLabel: 'Eigene Daten eingeben',
  sampleDataNoticeLine1: 'Berechnet mit Musterdaten.',
  sampleDataNoticeLine2:
    'Gehen Sie zu Einstellungen, um Ihre eigenen Daten einzugeben.',
  privacyNotice: 'Ihre Angaben werden nur auf diesem Gerät gespeichert.',
  batteryCapacityLabel: 'Akkukapazität',
  riderWeightLabel: 'Fahrergewicht',
  bikeWeightLabel: 'Fahrradgewicht',
  welcomeTitle: 'Willkommen',
  welcomeTextLine1:
    'Diese App zeigt Ihnen sofort, wie weit Ihr E-Bike ungefähr kommt.',
  welcomeTextLine2: 'Aktuell wird mit Beispieldaten gerechnet.',
  welcomeTextLine3:
    'Tippen Sie auf das Zahnrad, um Ihre eigenen Werte einzugeben.',
  terrainOptions: [
    { value: 1, label: 'Flach' },
    { value: 2, label: 'Leicht bergig' },
    { value: 3, label: 'Bergig' },
    { value: 4, label: 'Stark bergig' },
    { value: 5, label: 'Extrem bergig' }
  ],
  assistOptions: [
    { value: 1, label: 'Eco' },
    { value: 2, label: 'Tour' },
    { value: 3, label: 'Sport' },
    { value: 4, label: 'Turbo' },
    { value: 5, label: 'Max' }
  ]
};

/** English fallback text for all non-German browser locales. */
const en: AppTranslations = {
  appTitle: 'E-Bike Battery Calculator',
  appSubtitle: 'Calculate range easily',
  settingsButton: 'Settings',
  settingsTitle: 'Settings',
  backButton: 'Back',
  saveButton: 'Save',
  understoodButton: 'Got it',
  terrainLabel: 'Terrain',
  assistLabel: 'Assistance',
  controlsAriaLabel: 'Adjust ride',
  resultAriaLabel: 'Range calculation result',
  resultTitle: 'Estimated Range',
  realisticLabel: 'Realistic',
  resultNote:
    'Actual range may vary depending on weather, riding style, and tire pressure.',
  noticeAriaLabel: 'Notice',
  customDataNotice: 'Calculated with your saved data.',
  sampleDataButtonAriaLabel: 'Enter your own data',
  sampleDataNoticeLine1: 'Calculated with sample data.',
  sampleDataNoticeLine2: 'Go to settings to enter your own data.',
  privacyNotice: 'Your information is stored only on this device.',
  batteryCapacityLabel: 'Battery capacity',
  riderWeightLabel: 'Rider weight',
  bikeWeightLabel: 'Bike weight',
  welcomeTitle: 'Welcome',
  welcomeTextLine1:
    'This app instantly shows approximately how far your e-bike can go.',
  welcomeTextLine2: 'It currently calculates with sample data.',
  welcomeTextLine3: 'Tap the gear icon to enter your own values.',
  terrainOptions: [
    { value: 1, label: 'Flat' },
    { value: 2, label: 'Slightly hilly' },
    { value: 3, label: 'Hilly' },
    { value: 4, label: 'Very hilly' },
    { value: 5, label: 'Extremely hilly' }
  ],
  assistOptions: [
    { value: 1, label: 'Eco' },
    { value: 2, label: 'Tour' },
    { value: 3, label: 'Sport' },
    { value: 4, label: 'Turbo' },
    { value: 5, label: 'Max' }
  ]
};

/** Translation lookup keyed by supported locale. */
export const TRANSLATIONS: Record<AppLocale, AppTranslations> = {
  de,
  en
};

/**
 * Converts a browser locale string into the app's supported locale.
 *
 * Any locale starting with "de" is treated as German. This covers Germany
 * (de-DE), Austria (de-AT), Switzerland (de-CH), and plain German (de).
 */
export function getLocaleFromLanguage(language: string | undefined): AppLocale {
  const normalizedLanguage = language?.trim().toLowerCase();

  if (!normalizedLanguage) {
    return 'en';
  }

  return normalizedLanguage === 'de' || normalizedLanguage.startsWith('de-')
    ? 'de'
    : 'en';
}

/**
 * Reads the preferred app locale from the browser.
 *
 * navigator.languages is checked first because it preserves the user's ordered
 * language preferences. navigator.language is used as a fallback.
 */
export function getPreferredLocale(): AppLocale {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const preferredLanguage = navigator.languages?.[0] ?? navigator.language;

  return getLocaleFromLanguage(preferredLanguage);
}
