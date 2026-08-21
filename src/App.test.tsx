import { beforeEach, describe, expect, it, vi } from 'vitest';
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

/** Makes the current test environment look like a mobile browser. */
function mockMobileBrowser(): void {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: query.includes('hover: none') || query.includes('pointer: coarse'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
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

  /** Verifies the sample-data modal can be dismissed for the current session. */
  it('zeigt das Beispieldaten-Popup und blendet es aus', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole('dialog', { name: 'Beispieldaten' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Mit Beispieldaten starten' }));

    expect(
      screen.queryByRole('dialog', { name: 'Beispieldaten' })
    ).not.toBeInTheDocument();
    expect(localStorage.length).toBe(0);
  });

  /** The sample-data modal should reappear on a new app start until settings are saved. */
  it('zeigt das Beispieldaten-Popup bei jedem Start ohne eigene Daten', async () => {
    const user = userEvent.setup();
    const firstRender = render(<App />);

    await user.click(screen.getByRole('button', { name: 'Mit Beispieldaten starten' }));
    firstRender.unmount();

    render(<App />);

    expect(screen.getByRole('dialog', { name: 'Beispieldaten' })).toBeInTheDocument();
  });

  /** The welcome dialog should offer a useful direct path to personal settings. */
  it('oeffnet aus dem Begruessungsdialog direkt die Einstellungen', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Eigene Werte einrichten' }));

    expect(screen.queryByRole('dialog', { name: 'Beispieldaten' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Einstellungen' })).toBeInTheDocument();
  });

  /** Verifies the default calculator screen and default range output. */
  it('zeigt Titel und Reichweite', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Reichweite' })
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
      screen.getByRole('heading', { name: 'Range' })
    ).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Sample data' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Start with sample data' }));

    expect(
      screen.getByRole('button', { name: /Terrain: Slightly hilly/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Assistance: Tour/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Realistic: 51 - 69 km')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en');
  });

  /** Browser language changes should update the UI while the app is running. */
  it('updates the UI when the device language changes', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Reichweite' })).toBeInTheDocument();

    setNavigatorLanguage('en-US');
    fireEvent(window, new Event('languagechange'));

    expect(await screen.findByRole('heading', { name: 'Range' })).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Sample data' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en');
  });

  /** Protects the mobile app order: result, cycle buttons, pressure, then notice. */
  it('zeigt Ergebnis, Klickregler und Reifendruck auf dem Board', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Mit Beispieldaten starten' }));

    const settingsButton = screen.getByRole('button', { name: /Einstellungen/i });
    const rangeBoard = screen.getByLabelText('Ergebnis der Reichweitenberechnung');
    const resultValue = within(rangeBoard).getByText('60 km');
    const terrainButton = within(rangeBoard).getByRole('button', {
      name: /Gelände: Leicht bergig/i
    });
    const assistButton = within(rangeBoard).getByRole('button', {
      name: /Unterstützung: Tour/i
    });
    const pressureHeading = within(rangeBoard).getByRole('heading', {
      name: 'Empfohlener Druck'
    });

    expect(
      settingsButton.compareDocumentPosition(rangeBoard) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      resultValue.compareDocumentPosition(terrainButton) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      terrainButton.compareDocumentPosition(assistButton) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      assistButton.compareDocumentPosition(pressureHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  /** Covers entering custom battery data and returning to the calculator. */
  it('oeffnet die Einstellungen und speichert eigene Werte', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Mit Beispieldaten starten' }));
    await user.click(screen.getByRole('button', { name: /Einstellungen/i }));

    expect(
      screen.getByRole('heading', { name: 'Einstellungen' })
    ).toBeInTheDocument();

    const batteryInput = screen.getByLabelText('Akkukapazität');
    await user.clear(batteryInput);
    await user.type(batteryInput, '750');
    await user.click(screen.getByRole('button', { name: /Speichern/i }));

    expect(
      screen.getByRole('heading', { name: 'Reichweite' })
    ).toBeInTheDocument();
    expect(screen.getByText('72 km')).toBeInTheDocument();
    expect(screen.getByText('Berechnet mit Ihren gespeicherten Daten.')).toBeInTheDocument();
  });

  /** Tire size is selected from standardized ETRTO options instead of free text. */
  it('speichert eine Standard-Reifengroesse aus dem Menue', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Mit Beispieldaten starten' }));
    await user.click(screen.getByRole('button', { name: /Einstellungen/i }));

    const tireSizeSelect = screen.getByLabelText('Reifenbreite');
    await user.selectOptions(tireSizeSelect, '54-406');
    await user.click(screen.getByRole('button', { name: /Speichern/i }));

    expect(JSON.parse(localStorage.getItem('ebike-settings') ?? '{}')).toEqual(
      expect.objectContaining({
        tireSizeId: '54-406',
        tireWidthInch: 2.13,
        tireWidthMm: 54
      })
    );
  });

  /** Ensures button changes immediately update the calculated result. */
  it('aktualisiert die Reichweite live', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Mit Beispieldaten starten' }));
    await user.click(screen.getByRole('button', { name: /Unterstützung: Tour/i }));

    const rangeBoard = screen.getByLabelText('Ergebnis der Reichweitenberechnung');
    expect(within(rangeBoard).getByText('40 km')).toBeInTheDocument();
    expect(
      within(rangeBoard).getByRole('button', { name: /Unterstützung: Sport/i })
    ).toBeInTheDocument();
  });

  /** Terrain is also changed through a tappable state button. */
  it('wechselt das Gelaende per Klickbutton', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Mit Beispieldaten starten' }));
    await user.click(screen.getByRole('button', { name: /Gelände: Leicht bergig/i }));

    expect(
      screen.getByRole('button', { name: /Gelände: Bergig/i })
    ).toBeInTheDocument();
  });

  /** New bottom navigation exposes the tire-pressure screen. */
  it('zeigt den Reifendruck-Tab', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Mit Beispieldaten starten' }));
    await user.click(screen.getByRole('button', { name: 'Reifendruck' }));

    expect(screen.getByRole('heading', { name: 'Reifendruck' })).toBeInTheDocument();
    expect(screen.getByText('Empfohlener Druck')).toBeInTheDocument();
    expect(screen.getByText('Vorne')).toBeInTheDocument();
    expect(screen.getByText('Hinten')).toBeInTheDocument();
    expect(screen.getByText('Maximaldruck')).toBeInTheDocument();
  });

  /** The simplified bottom navigation no longer exposes battery data. */
  it('zeigt keinen Akku-Tab', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Mit Beispieldaten starten' }));

    expect(screen.queryByRole('button', { name: 'Akku' })).not.toBeInTheDocument();
  });

  /** The focused navigation exposes only the two planned app functions. */
  it('zeigt nur Reichweite und Reifendruck in der Navigation', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Mit Beispieldaten starten' }));

    const navigation = screen.getByRole('navigation', { name: 'App' });
    expect(within(navigation).getAllByRole('button')).toHaveLength(2);
    expect(within(navigation).getByRole('button', { name: 'Reichweite' })).toBeInTheDocument();
    expect(within(navigation).getByRole('button', { name: 'Reifendruck' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Mehr' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Mehr' })).not.toBeInTheDocument();
  });

  /** 0% support should show that the battery is not consumed. */
  it('zeigt bei minimaler Unterstuetzung unbegrenzte Akku-Reichweite', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Mit Beispieldaten starten' }));
    const supportButton = screen.getByRole('button', { name: /Unterstützung: Tour/i });
    await user.click(supportButton);
    await user.click(supportButton);
    await user.click(supportButton);

    const resultCard = screen.getByLabelText('Ergebnis der Reichweitenberechnung');
    expect(
      within(resultCard).getByLabelText('Unbegrenzte Akku-Reichweite')
    ).toBeInTheDocument();
    expect(
      within(resultCard).getByText('0% Unterstützung: Der Akku wird nicht verbraucht.')
    ).toBeInTheDocument();
  });

  /** Mobile browsers that expose PWA installation should get a yes/no prompt. */
  it('zeigt auf Mobilgeraeten eine Installationsabfrage', async () => {
    const user = userEvent.setup();
    mockMobileBrowser();

    render(<App />);

    const installEvent = Object.assign(new Event('beforeinstallprompt'), {
      platforms: ['web'],
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'dismissed', platform: 'web' })
    });

    fireEvent(window, installEvent);
    await user.click(screen.getByRole('button', { name: 'Mit Beispieldaten starten' }));

    expect(screen.getByRole('dialog', { name: 'App installieren?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ja' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nein' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Nein' }));

    expect(
      screen.queryByRole('dialog', { name: 'App installieren?' })
    ).not.toBeInTheDocument();
  });
});
