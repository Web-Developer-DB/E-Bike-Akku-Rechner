import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

/**
 * Overrides browser language information for locale-dependent UI tests.
 *
 * jsdom exposes navigator.language as read-only by default, so tests redefine it
 * with configurable properties before rendering App.
 */
function setNavigatorLanguage(language: string): void {
  Object.defineProperty(window.navigator, 'language', {
    configurable: true,
    value: language
  });
  Object.defineProperty(window.navigator, 'languages', {
    configurable: true,
    value: [language]
  });
}

/**
 * Integration-style tests for the full App component.
 *
 * These tests interact with the UI the way a user would: clicking buttons,
 * editing inputs, and reading visible text. They protect the main workflows.
 */
describe('App', () => {
  beforeEach(() => {
    /** Each test starts with empty storage to avoid hidden state leaks. */
    localStorage.clear();
    setNavigatorLanguage('de-DE');
  });

  /** Verifies the first-run modal and the persisted "seen" flag. */
  it('zeigt das Willkommen-Popup und blendet es aus', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole('dialog', { name: 'Willkommen' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Verstanden' }));

    expect(
      screen.queryByRole('dialog', { name: 'Willkommen' })
    ).not.toBeInTheDocument();
    expect(localStorage.getItem('ebike-welcome-seen')).toBe('true');
  });

  /** Verifies the default calculator screen and default range output. */
  it('zeigt Titel und Reichweite', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'E-Bike Akku-Rechner' })
    ).toBeInTheDocument();
    expect(screen.getByText('60 km')).toBeInTheDocument();
    expect(screen.getByText('Realistisch: 51 - 69 km')).toBeInTheDocument();
  });

  /** Non-German browser locales should receive English UI text. */
  it('shows English text outside German browser locales', async () => {
    const user = userEvent.setup();
    setNavigatorLanguage('en-US');

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'E-Bike Battery Calculator' })
    ).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Welcome' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Got it' }));

    expect(screen.getByRole('slider', { name: 'Terrain' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Assistance' })).toBeInTheDocument();
    expect(screen.getByText('Realistic: 51 - 69 km')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en');
  });

  /** Protects the mobile-friendly order: controls before the result card. */
  it('zeigt Einstellungen und Schieberegler vor dem Ergebnis', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Verstanden' }));

    const settingsButton = screen.getByRole('button', { name: /Einstellungen/i });
    const terrainSlider = screen.getByRole('slider', { name: 'Gelände' });
    const supportSlider = screen.getByRole('slider', { name: 'Unterstützung' });
    const resultCard = screen.getByLabelText('Ergebnis der Reichweitenberechnung');

    expect(
      settingsButton.compareDocumentPosition(terrainSlider) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      terrainSlider.compareDocumentPosition(supportSlider) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      supportSlider.compareDocumentPosition(resultCard) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  /** Covers entering custom battery data and returning to the calculator. */
  it('oeffnet die Einstellungen und speichert eigene Werte', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Verstanden' }));
    await user.click(screen.getByRole('button', { name: /Einstellungen/i }));

    expect(
      screen.getByRole('heading', { name: 'Einstellungen' })
    ).toBeInTheDocument();

    const batteryInput = screen.getByLabelText('Akkukapazität');
    await user.clear(batteryInput);
    await user.type(batteryInput, '750');
    await user.click(screen.getByRole('button', { name: /Speichern/i }));

    expect(
      screen.getByRole('heading', { name: 'E-Bike Akku-Rechner' })
    ).toBeInTheDocument();
    expect(screen.getByText('72 km')).toBeInTheDocument();
    expect(screen.getByText('Berechnet mit Ihren gespeicherten Daten.')).toBeInTheDocument();
  });

  /** Ensures slider changes immediately update the calculated result. */
  it('aktualisiert die Reichweite live', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Verstanden' }));
    const supportSlider = screen.getByRole('slider', { name: 'Unterstützung' });
    fireEvent.change(supportSlider, { target: { value: '4' } });

    const resultCard = screen.getByLabelText('Ergebnis der Reichweitenberechnung');
    expect(within(resultCard).getByText('34 km')).toBeInTheDocument();
  });
});
