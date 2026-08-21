/**
 * Localized copy and browser-locale selection.
 *
 * Translation keys are typed so components cannot accidentally request a
 * label that is missing from one language. Add new user-facing text here,
 * then provide the same key in both language objects.
 */
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
  tabRange: string;
  tabPressure: string;
  rangeTitle: string;
  pressureTitle: string;
  infoButtonAriaLabel: string;
  terrainLabel: string;
  assistLabel: string;
  controlsAriaLabel: string;
  cycleButtonHint: string;
  resultAriaLabel: string;
  resultTitle: string;
  realisticLabel: string;
  unlimitedRangeLabel: string;
  unlimitedRangeDetail: string;
  resultNote: string;
  noticeAriaLabel: string;
  customDataNotice: string;
  sampleDataButtonAriaLabel: string;
  sampleDataNoticeLine1: string;
  sampleDataNoticeLine2: string;
  privacyNotice: string;
  rideSettingsTitle: string;
  tireSettingsTitle: string;
  batteryCapacityLabel: string;
  riderWeightLabel: string;
  bikeWeightLabel: string;
  wheelSizeLabel: string;
  tireWidthLabel: string;
  maxPressureLabel: string;
  pressureUnitLabel: string;
  millimeterLabel: string;
  inchLabel: string;
  barLabel: string;
  psiLabel: string;
  typicalWidthMm: string;
  typicalWidthInch: string;
  recommendedPressureTitle: string;
  frontLabel: string;
  rearLabel: string;
  maxPressureTitle: string;
  fromTireSidewall: string;
  lastCheckTitle: string;
  checkedButton: string;
  pressureHintsTitle: string;
  asphaltTitle: string;
  asphaltText: string;
  gravelTitle: string;
  gravelText: string;
  pressureNoticeTitle: string;
  pressureNoticeText: string;
  conversionTitle: string;
  whyPressureTitle: string;
  pressureBenefitRange: string;
  pressureBenefitComfort: string;
  pressureBenefitPunctures: string;
  pressureBenefitGrip: string;
  welcomeTitle: string;
  welcomeEyebrow: string;
  welcomeTextLine1: string;
  welcomeTextLine2: string;
  welcomeTextLine3: string;
  welcomeSetupButton: string;
  welcomeContinueButton: string;
  installPromptTitle: string;
  installPromptText: string;
  installPromptAccept: string;
  installPromptDecline: string;
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
  tabRange: 'Reichweite',
  tabPressure: 'Reifendruck',
  rangeTitle: 'Reichweite',
  pressureTitle: 'Reifendruck',
  infoButtonAriaLabel: 'Hinweise anzeigen',
  terrainLabel: 'Gelände',
  assistLabel: 'Unterstützung',
  controlsAriaLabel: 'Fahrt anpassen',
  cycleButtonHint: 'Antippen zum ändern',
  resultAriaLabel: 'Ergebnis der Reichweitenberechnung',
  resultTitle: 'Geschätzte Reichweite',
  realisticLabel: 'Realistisch',
  unlimitedRangeLabel: 'Unbegrenzte Akku-Reichweite',
  unlimitedRangeDetail: '0% Unterstützung: Der Akku wird nicht verbraucht.',
  resultNote:
    'Die tatsächliche Reichweite kann je nach Wetter, Fahrweise und Reifendruck abweichen.',
  noticeAriaLabel: 'Hinweis',
  customDataNotice: 'Berechnet mit Ihren gespeicherten Daten.',
  sampleDataButtonAriaLabel: 'Eigene Daten eingeben',
  sampleDataNoticeLine1: 'Berechnet mit Musterdaten.',
  sampleDataNoticeLine2:
    'Gehen Sie zu Einstellungen, um Ihre eigenen Daten einzugeben.',
  privacyNotice: 'Ihre Angaben werden nur auf diesem Gerät gespeichert.',
  rideSettingsTitle: 'Fahrdaten',
  tireSettingsTitle: 'Reifen',
  batteryCapacityLabel: 'Akkukapazität',
  riderWeightLabel: 'Fahrergewicht',
  bikeWeightLabel: 'Fahrradgewicht',
  wheelSizeLabel: 'Reifengröße',
  tireWidthLabel: 'Reifenbreite',
  maxPressureLabel: 'Maximaldruck laut Reifen',
  pressureUnitLabel: 'Druckeinheit',
  millimeterLabel: 'Millimeter',
  inchLabel: 'Zoll',
  barLabel: 'bar',
  psiLabel: 'PSI',
  typicalWidthMm: 'Typische Breite: 40 - 65 mm',
  typicalWidthInch: 'Typische Breite: 1.75 - 2.40 Zoll',
  recommendedPressureTitle: 'Empfohlener Druck',
  frontLabel: 'Vorne',
  rearLabel: 'Hinten',
  maxPressureTitle: 'Maximaldruck',
  fromTireSidewall: 'Laut Reifenangabe',
  lastCheckTitle: 'Letzte Prüfung',
  checkedButton: 'Geprüft',
  pressureHintsTitle: 'Hinweise',
  asphaltTitle: 'Asphalt',
  asphaltText:
    'Etwas höherer Druck für geringen Rollwiderstand und mehr Effizienz.',
  gravelTitle: 'Gravel / Waldwege',
  gravelText:
    'Etwas niedrigerer Druck für mehr Komfort, besseren Grip und mehr Kontrolle.',
  pressureNoticeTitle: 'Hinweis',
  pressureNoticeText:
    'Die Werte sind Empfehlungen und können je nach Fahrstil, Untergrund und Beladung abweichen.',
  conversionTitle: 'Umrechnung',
  whyPressureTitle: 'Warum der richtige Druck wichtig ist',
  pressureBenefitRange: 'Mehr Reichweite',
  pressureBenefitComfort: 'Besserer Fahrkomfort',
  pressureBenefitPunctures: 'Weniger Pannen',
  pressureBenefitGrip: 'Mehr Grip & Sicherheit',
  welcomeTitle: 'Beispieldaten',
  welcomeEyebrow: 'DEIN E-BIKE-PROFIL',
  welcomeTextLine1:
    'Die App rechnet aktuell mit Beispieldaten.',
  welcomeTextLine2:
    'Ihre Reichweite wird genauer, wenn Sie eigene Werte speichern.',
  welcomeTextLine3:
    'Gehen Sie zu Einstellungen, um Akkugröße, Fahrergewicht, Fahrradgewicht und Reifendaten zu ändern.',
  welcomeSetupButton: 'Eigene Werte einrichten',
  welcomeContinueButton: 'Mit Beispieldaten starten',
  installPromptTitle: 'App installieren?',
  installPromptText:
    'Möchten Sie den E-Bike Akku-Rechner auf diesem Gerät installieren?',
  installPromptAccept: 'Ja',
  installPromptDecline: 'Nein',
  terrainOptions: [
    { value: 1, label: 'Flach' },
    { value: 2, label: 'Leicht bergig' },
    { value: 3, label: 'Bergig' },
    { value: 4, label: 'Stark bergig' },
    { value: 5, label: 'Extrem bergig' }
  ],
  assistOptions: [
    { value: 1, label: 'Minimal (0%)' },
    { value: 2, label: 'Eco' },
    { value: 3, label: 'Tour' },
    { value: 4, label: 'Sport' },
    { value: 5, label: 'Turbo' }
  ]
};

/** English fallback text for all non-German browser locales. */
/** English fallback text used for every non-German browser locale. */
const en: AppTranslations = {
  appTitle: 'E-Bike Battery Calculator',
  appSubtitle: 'Calculate range easily',
  settingsButton: 'Settings',
  settingsTitle: 'Settings',
  backButton: 'Back',
  saveButton: 'Save',
  tabRange: 'Range',
  tabPressure: 'Tire pressure',
  rangeTitle: 'Range',
  pressureTitle: 'Tire pressure',
  infoButtonAriaLabel: 'Show notes',
  terrainLabel: 'Terrain',
  assistLabel: 'Assistance',
  controlsAriaLabel: 'Adjust ride',
  cycleButtonHint: 'Tap to change',
  resultAriaLabel: 'Range calculation result',
  resultTitle: 'Estimated Range',
  realisticLabel: 'Realistic',
  unlimitedRangeLabel: 'Unlimited battery range',
  unlimitedRangeDetail: '0% assistance: the battery is not used.',
  resultNote:
    'Actual range may vary depending on weather, riding style, and tire pressure.',
  noticeAriaLabel: 'Notice',
  customDataNotice: 'Calculated with your saved data.',
  sampleDataButtonAriaLabel: 'Enter your own data',
  sampleDataNoticeLine1: 'Calculated with sample data.',
  sampleDataNoticeLine2: 'Go to settings to enter your own data.',
  privacyNotice: 'Your information is stored only on this device.',
  rideSettingsTitle: 'Ride data',
  tireSettingsTitle: 'Tires',
  batteryCapacityLabel: 'Battery capacity',
  riderWeightLabel: 'Rider weight',
  bikeWeightLabel: 'Bike weight',
  wheelSizeLabel: 'Wheel size',
  tireWidthLabel: 'Tire width',
  maxPressureLabel: 'Maximum tire pressure',
  pressureUnitLabel: 'Pressure unit',
  millimeterLabel: 'Millimeters',
  inchLabel: 'Inch',
  barLabel: 'bar',
  psiLabel: 'PSI',
  typicalWidthMm: 'Typical width: 40 - 65 mm',
  typicalWidthInch: 'Typical width: 1.75 - 2.40 inch',
  recommendedPressureTitle: 'Recommended pressure',
  frontLabel: 'Front',
  rearLabel: 'Rear',
  maxPressureTitle: 'Maximum pressure',
  fromTireSidewall: 'According to tire marking',
  lastCheckTitle: 'Last check',
  checkedButton: 'Checked',
  pressureHintsTitle: 'Notes',
  asphaltTitle: 'Asphalt',
  asphaltText:
    'Slightly higher pressure for lower rolling resistance and better efficiency.',
  gravelTitle: 'Gravel / forest roads',
  gravelText:
    'Slightly lower pressure for more comfort, better grip, and more control.',
  pressureNoticeTitle: 'Notice',
  pressureNoticeText:
    'These values are recommendations and may vary by riding style, surface, and load.',
  conversionTitle: 'Conversion',
  whyPressureTitle: 'Why the right pressure matters',
  pressureBenefitRange: 'More range',
  pressureBenefitComfort: 'Better comfort',
  pressureBenefitPunctures: 'Fewer punctures',
  pressureBenefitGrip: 'More grip & safety',
  welcomeTitle: 'Sample data',
  welcomeEyebrow: 'YOUR E-BIKE PROFILE',
  welcomeTextLine1:
    'The app is currently calculating with sample data.',
  welcomeTextLine2:
    'Your range estimate becomes more accurate after you save your own values.',
  welcomeTextLine3:
    'Go to settings to change battery size, rider weight, bike weight, and tire data.',
  welcomeSetupButton: 'Set up my values',
  welcomeContinueButton: 'Start with sample data',
  installPromptTitle: 'Install app?',
  installPromptText:
    'Do you want to install the E-Bike Battery Calculator on this device?',
  installPromptAccept: 'Yes',
  installPromptDecline: 'No',
  terrainOptions: [
    { value: 1, label: 'Flat' },
    { value: 2, label: 'Slightly hilly' },
    { value: 3, label: 'Hilly' },
    { value: 4, label: 'Very hilly' },
    { value: 5, label: 'Extremely hilly' }
  ],
  assistOptions: [
    { value: 1, label: 'Minimal (0%)' },
    { value: 2, label: 'Eco' },
    { value: 3, label: 'Tour' },
    { value: 4, label: 'Sport' },
    { value: 5, label: 'Turbo' }
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
function getSupportedLocaleFromLanguage(
  language: string | undefined
): AppLocale | null {
  const normalizedLanguage = language?.trim().toLowerCase();

  if (!normalizedLanguage) {
    return null;
  }

  if (normalizedLanguage === 'de' || normalizedLanguage.startsWith('de-')) {
    return 'de';
  }

  if (normalizedLanguage === 'en' || normalizedLanguage.startsWith('en-')) {
    return 'en';
  }

  return null;
}

/** Converts one browser locale string into the app locale, with English fallback. */
export function getLocaleFromLanguage(language: string | undefined): AppLocale {
  return getSupportedLocaleFromLanguage(language) ?? 'en';
}

/**
 * Chooses the first supported locale from the ordered browser language list.
 *
 * Unsupported languages are skipped so a browser list such as
 * ["fr-FR", "de-DE", "en-US"] still selects German.
 */
export function getLocaleFromLanguages(
  languages: readonly string[] | undefined,
  fallbackLanguage?: string
): AppLocale {
  const supportedLocale = languages
    ?.map((language) => getSupportedLocaleFromLanguage(language))
    .find((locale): locale is AppLocale => locale !== null);

  return supportedLocale ?? getLocaleFromLanguage(fallbackLanguage);
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

  return getLocaleFromLanguages(navigator.languages, navigator.language);
}
