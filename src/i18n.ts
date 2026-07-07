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
  tabRange: string;
  tabPressure: string;
  tabBattery: string;
  tabMore: string;
  rangeTitle: string;
  pressureTitle: string;
  batteryTitle: string;
  moreTitle: string;
  infoButtonAriaLabel: string;
  terrainLabel: string;
  assistLabel: string;
  controlsAriaLabel: string;
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
  batterySettingsTitle: string;
  batteryCapacityLabel: string;
  batteryChargeLabel: string;
  batteryHealthLabel: string;
  chargeCyclesLabel: string;
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
  rangeDetailsAriaLabel: string;
  batteryStatsAriaLabel: string;
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
  fullyChargedBatteryLabel: string;
  averageConsumptionLabel: string;
  manageBikeDataLabel: string;
  profilesLabel: string;
  maintenanceLabel: string;
  unitsLabel: string;
  appSettingsLabel: string;
  aboutAppLabel: string;
  feedbackLabel: string;
  privacyLabel: string;
  legalNoticeLabel: string;
  moreListAriaLabel: string;
  welcomeTitle: string;
  welcomeTextLine1: string;
  welcomeTextLine2: string;
  welcomeTextLine3: string;
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
  understoodButton: 'Verstanden',
  tabRange: 'Reichweite',
  tabPressure: 'Reifendruck',
  tabBattery: 'Akku',
  tabMore: 'Mehr',
  rangeTitle: 'Reichweite',
  pressureTitle: 'Reifendruck',
  batteryTitle: 'Akku',
  moreTitle: 'Mehr',
  infoButtonAriaLabel: 'Hinweise anzeigen',
  terrainLabel: 'Gelände',
  assistLabel: 'Unterstützung',
  controlsAriaLabel: 'Fahrt anpassen',
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
  batterySettingsTitle: 'Akku',
  batteryCapacityLabel: 'Akkukapazität',
  batteryChargeLabel: 'Akkustand',
  batteryHealthLabel: 'Gesundheit',
  chargeCyclesLabel: 'Ladezyklen',
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
  rangeDetailsAriaLabel: 'Reichweitenfaktoren',
  batteryStatsAriaLabel: 'Akkudaten',
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
  fullyChargedBatteryLabel: 'Akkustand (voll geladen)',
  averageConsumptionLabel: 'Durchschnittsverbrauch',
  manageBikeDataLabel: 'Fahrraddaten verwalten',
  profilesLabel: 'Profile',
  maintenanceLabel: 'Wartung & Pflege',
  unitsLabel: 'Einheiten',
  appSettingsLabel: 'Einstellungen',
  aboutAppLabel: 'Über die App',
  feedbackLabel: 'Feedback',
  privacyLabel: 'Datenschutz',
  legalNoticeLabel: 'Impressum',
  moreListAriaLabel: 'Weitere Optionen',
  welcomeTitle: 'Beispieldaten',
  welcomeTextLine1:
    'Die App rechnet aktuell mit Beispieldaten.',
  welcomeTextLine2:
    'Ihre Reichweite wird genauer, wenn Sie eigene Werte speichern.',
  welcomeTextLine3:
    'Gehen Sie zu Einstellungen, um Akkugröße, Fahrergewicht, Fahrradgewicht und Reifendaten zu ändern.',
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
const en: AppTranslations = {
  appTitle: 'E-Bike Battery Calculator',
  appSubtitle: 'Calculate range easily',
  settingsButton: 'Settings',
  settingsTitle: 'Settings',
  backButton: 'Back',
  saveButton: 'Save',
  understoodButton: 'Got it',
  tabRange: 'Range',
  tabPressure: 'Tire pressure',
  tabBattery: 'Battery',
  tabMore: 'More',
  rangeTitle: 'Range',
  pressureTitle: 'Tire pressure',
  batteryTitle: 'Battery',
  moreTitle: 'More',
  infoButtonAriaLabel: 'Show notes',
  terrainLabel: 'Terrain',
  assistLabel: 'Assistance',
  controlsAriaLabel: 'Adjust ride',
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
  batterySettingsTitle: 'Battery',
  batteryCapacityLabel: 'Battery capacity',
  batteryChargeLabel: 'Battery charge',
  batteryHealthLabel: 'Health',
  chargeCyclesLabel: 'Charge cycles',
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
  rangeDetailsAriaLabel: 'Range factors',
  batteryStatsAriaLabel: 'Battery data',
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
  fullyChargedBatteryLabel: 'Battery charge (fully charged)',
  averageConsumptionLabel: 'Average consumption',
  manageBikeDataLabel: 'Manage bike data',
  profilesLabel: 'Profiles',
  maintenanceLabel: 'Maintenance & care',
  unitsLabel: 'Units',
  appSettingsLabel: 'Settings',
  aboutAppLabel: 'About the app',
  feedbackLabel: 'Feedback',
  privacyLabel: 'Privacy',
  legalNoticeLabel: 'Legal notice',
  moreListAriaLabel: 'More options',
  welcomeTitle: 'Sample data',
  welcomeTextLine1:
    'The app is currently calculating with sample data.',
  welcomeTextLine2:
    'Your range estimate becomes more accurate after you save your own values.',
  welcomeTextLine3:
    'Go to settings to change battery size, rider weight, bike weight, and tire data.',
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
