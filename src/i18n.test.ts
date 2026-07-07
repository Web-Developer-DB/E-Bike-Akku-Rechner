import { describe, expect, it } from 'vitest';
import {
  getLocaleFromLanguage,
  getLocaleFromLanguages,
  TRANSLATIONS
} from './i18n';

/**
 * Unit tests for the tiny internationalization layer.
 *
 * These tests protect the rule requested by the product owner: German browser
 * locales show German text, while all other locales fall back to English.
 */
describe('i18n', () => {
  /** Germany should use the German UI. */
  it('uses German for Germany', () => {
    expect(getLocaleFromLanguage('de-DE')).toBe('de');
  });

  /** Austria should use the German UI. */
  it('uses German for Austria', () => {
    expect(getLocaleFromLanguage('de-AT')).toBe('de');
  });

  /** Plain German should also use the German UI. */
  it('uses German for generic German', () => {
    expect(getLocaleFromLanguage('de')).toBe('de');
  });

  /** Any non-German locale should use the English fallback. */
  it('uses English for non-German locales', () => {
    expect(getLocaleFromLanguage('en-US')).toBe('en');
    expect(getLocaleFromLanguage('fr-FR')).toBe('en');
  });

  /** The full browser language list should be searched for supported locales. */
  it('uses the first supported locale from the browser language list', () => {
    expect(getLocaleFromLanguages(['fr-FR', 'de-DE', 'en-US'])).toBe('de');
    expect(getLocaleFromLanguages(['fr-FR', 'es-ES'], 'en-US')).toBe('en');
  });

  /** Empty or missing language data should be safe and default to English. */
  it('uses English when no language is available', () => {
    expect(getLocaleFromLanguage(undefined)).toBe('en');
    expect(getLocaleFromLanguage('')).toBe('en');
  });

  /** Translation objects should expose matching key user-facing labels. */
  it('contains German and English labels', () => {
    expect(TRANSLATIONS.de.settingsButton).toBe('Einstellungen');
    expect(TRANSLATIONS.en.settingsButton).toBe('Settings');
  });
});
