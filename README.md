# E-Bike Akku-Rechner

Eine kleine, offline-fähige Progressive Web App (PWA), die E-Bike-Fahrern schnell beantwortet:

> Wie weit komme ich ungefähr mit meinem Akku?

Die App ist bewusst einfach gehalten. Sie verzichtet auf Login, Cloud, Tracking, Karten, GPS, Wetterdaten und externe APIs. Alle persönlichen Werte werden nur lokal im Browser gespeichert.

---

## Deutsch

### Ziel der App

Der **E-Bike Akku-Rechner** richtet sich an E-Bike-Fahrer in Deutschland, besonders an Freizeitfahrer, Senioren und Menschen ohne technisches Vorwissen. Die App soll in wenigen Sekunden bedienbar sein und nur die nötigsten Werte abfragen:

- Akkukapazität in Wattstunden (Wh)
- Fahrergewicht in Kilogramm
- Fahrradgewicht in Kilogramm
- Gelände
- Unterstützungsstufe

Aus diesen Angaben berechnet die App eine geschätzte Reichweite und einen realistischen Bereich.

### Funktionen

- Zwei Screens: Reichweitenrechner und Einstellungen
- Beispieldaten-Hinweis bei jedem Start, bis eigene Daten gespeichert wurden
- Standardwerte für sofortige Beispielberechnung
- Speichern eigener Werte im `localStorage`
- Live-Aktualisierung der Reichweite beim Ändern der Slider
- Offline-Nutzung über Service Worker
- Installierbarkeit als PWA
- Installationsabfrage auf mobilen Browsern, wenn der Browser die PWA-Installation anbietet
- Mobile-first Layout für kleine Smartphone-Bildschirme
- Einheitliche Line-Icons mit `lucide-react`
- Automatische Sprache: Deutsch für `de-*` Browser-Lokalisierungen, Englisch für alle anderen
- Testabdeckung für Berechnung, Storage und zentrale UI-Flows

### Technischer Stack

- React
- TypeScript
- Vite
- Vitest
- React Testing Library
- CSS ohne schwere UI-Bibliothek
- Service Worker und Web App Manifest für PWA-Funktionen

### Installation

Voraussetzungen:

- Node.js
- npm

Abhängigkeiten installieren:

```bash
npm install
```

Entwicklungsserver starten:

```bash
npm run dev
```

Die App ist danach normalerweise unter dieser Adresse erreichbar:

```text
http://127.0.0.1:5173/
```

### Tests ausführen

```bash
npm run test:run
```

Die Tests prüfen:

- ob die Standardwerte korrekt berechnet werden
- ob mehr Unterstützung, mehr Gewicht und bergigeres Gelände die Reichweite verringern
- ob Werte korrekt gerundet werden
- ob Einstellungen im `localStorage` gespeichert und geladen werden
- ob fehlerhafte gespeicherte Daten abgefangen werden
- ob der Beispieldaten-Hinweis funktioniert
- ob die mobile Installationsabfrage angezeigt werden kann
- ob Einstellungen geöffnet und gespeichert werden können
- ob die Reichweite live aktualisiert wird

### Produktions-Build

```bash
npm run build
```

Der Build führt zuerst TypeScript aus und erstellt danach mit Vite die Produktionsdateien im Ordner `dist/`.

### Wichtige npm-Skripte

| Skript | Zweck |
| --- | --- |
| `npm run dev` | Startet den Vite-Entwicklungsserver |
| `npm run build` | Prüft TypeScript und baut die App für Produktion |
| `npm run preview` | Zeigt den Produktions-Build lokal an |
| `npm run test` | Startet Vitest im Watch-Modus |
| `npm run test:run` | Führt alle Tests einmalig aus |

### Berechnungslogik

Die Reichweite wird in [src/utils/calculateRange.ts](src/utils/calculateRange.ts) berechnet.

Grundformel:

```text
Reichweite = Akkukapazität / Endverbrauch
```

Endverbrauch:

```text
Endverbrauch = (Flachverbrauch bei voller Unterstützung + Kletterverbrauch bei voller Unterstützung) × Motoranteil
```

Flachverbrauch bei voller Unterstützung:

```text
18 Wh/km bei 105 kg Gesamtgewicht
```

Geschätzte positive Höhenmeter pro Kilometer:

| Gelände | Höhenmeter/km |
| --- | ---: |
| Flach | 0 m |
| Leicht bergig | 8 m |
| Bergig | 20 m |
| Stark bergig | 40 m |
| Extrem bergig | 65 m |

Gewicht und Flachverbrauch:

```text
Gesamtgewicht = Fahrergewicht + Fahrradgewicht
Flach-Gewichtsfaktor = 1 + (Gesamtgewicht / 105 - 1) × 0.3
```

Der Flach-Gewichtsfaktor wird begrenzt:

```text
Minimum: 0.85
Maximum: 1.2
```

Kletterverbrauch:

```text
Mechanische Höhenenergie = Gesamtgewicht × 9.81 × Höhenmeter pro km / 3600
Kletterverbrauch bei voller Unterstützung = Mechanische Höhenenergie / 0.85
```

Motoranteil nach Unterstützungsstufe:

| Stufe | Motoranteil |
| --- | ---: |
| Minimal | 0% |
| Stufe 2 | 25% |
| Stufe 3 | 50% |
| Stufe 4 | 75% |
| Maximal | 100% |

Bei 0% Unterstützung wird der Akku rechnerisch nicht verbraucht. Die App zeigt dann eine unbegrenzte Akku-Reichweite an.

Realistischer Bereich:

```text
Untere Grenze = Ergebnis × 0.85
Obere Grenze = Ergebnis × 1.15
```

Alle Ergebnisse werden auf ganze Kilometer gerundet.

### Formel ändern

Die Berechnungsformel liegt ausschließlich in:

```text
src/utils/calculateRange.ts
```

Diese Datei ist bewusst unabhängig von React, CSS, Storage und UI-Komponenten. Dadurch kann die Formel geändert und getestet werden, ohne die Benutzeroberfläche anzufassen.

Wichtige Stellen in `calculateRange.ts`:

| Code-Stelle | Bedeutung |
| --- | --- |
| `FULL_SUPPORT_FLAT_CONSUMPTION_WH_PER_KM` | Flachverbrauch bei voller Motorunterstützung in Wh/km |
| `ELEVATION_GAIN_M_PER_KM` | Geschätzte positive Höhenmeter pro Gelände-Stufe |
| `ASSISTANCE_MOTOR_SHARE` | Motoranteil pro Unterstützungsstufe |
| `GRAVITY_M_PER_SECOND_SQUARED` | Erdbeschleunigung für die Höhenenergie |
| `MOTOR_EFFICIENCY` | Wirkungsgrad für Umrechnung von mechanischer in Akku-Energie |
| `REFERENCE_WEIGHT_KG` | Referenzgewicht für den neutralen Flach-Gewichtsfaktor |
| `FLAT_WEIGHT_INFLUENCE` | Gewichtseinfluss auf den Flachverbrauch |
| `calculateRange(settings)` | Hauptfunktion, die Reichweite, Minimum und Maximum berechnet |

Wenn die Formel geändert werden soll:

1. Öffne [src/utils/calculateRange.ts](src/utils/calculateRange.ts).
2. Ändere nur die fachlichen Konstanten oder die Funktion `calculateRange`.
3. Passe die Tests in [src/utils/calculateRange.test.ts](src/utils/calculateRange.test.ts) an.
4. Prüfe, ob sich sichtbare Beispielwerte in [src/App.test.tsx](src/App.test.tsx) ändern müssen.
5. Führe `npm run test:run` aus.
6. Führe `npm run build` aus.
7. Aktualisiere diesen README-Abschnitt, wenn sich Formel, Faktoren oder Rundung ändern.

Beispiel: Wenn volle Motorunterstützung auf flacher Strecke sparsamer werden soll, wird nur dieser Wert geändert:

```ts
const FULL_SUPPORT_FLAT_CONSUMPTION_WH_PER_KM = 17;
```

Danach müssen die erwarteten Reichweiten in den Tests neu berechnet werden.

Nicht empfohlen:

- Die Formel direkt in React-Komponenten einbauen.
- Berechnungslogik in `RangeCalculator.tsx`, `ResultCard.tsx` oder `Settings.tsx` duplizieren.
- UI-Labels mit Formelfaktoren vermischen.
- Tests nur deshalb löschen, weil sich Zahlen geändert haben.

### Standardwerte

Beim ersten Start nutzt die App diese Werte:

| Wert | Standard |
| --- | ---: |
| Akkukapazität | 625 Wh |
| Fahrergewicht | 80 kg |
| Fahrradgewicht | 25 kg |
| Gelände | Leicht bergig |
| Unterstützung | 50% |

Diese Werte ergeben:

```text
Flachverbrauch bei voller Unterstützung = 18 Wh/km
Kletterverbrauch bei voller Unterstützung = (105 × 9.81 × 8 / 3600) / 0.85 = 2.69 Wh/km
Endverbrauch = (18 + 2.69) × 0.5 = 10.35 Wh/km
625 / 10.35 = 60.41 km
Gerundet: 60 km
Realistisch: 51 - 69 km
```

### Datenspeicherung

Die App nutzt ausschließlich `localStorage`.

Gespeichert werden:

- persönliche Einstellungen
- ob eigene Einstellungen gespeichert wurden

Es gibt:

- keine Datenbank
- kein Backend
- keine Cloud-Synchronisation
- keine externen API-Aufrufe
- kein Tracking
- keine Analytics

### Mehrsprachigkeit

Die App wählt die Sprache automatisch anhand der Browser-Sprache:

- `de`, `de-DE`, `de-AT`, `de-CH` und andere `de-*` Locales zeigen Deutsch.
- Alle anderen Locales zeigen Englisch.

Wichtig: Die App nutzt dafür keine Standortdaten, kein GPS und keine externe API. Ein Nutzer in Deutschland mit englischer Browser-Sprache sieht daher Englisch. Ein Nutzer außerhalb Deutschlands mit deutscher Browser-Sprache sieht Deutsch.

Die Übersetzungen liegen in [src/i18n.ts](src/i18n.ts). Dort sind auch die lokalisierten Slider-Labels für Gelände und Unterstützung definiert.

### PWA und Offline-Nutzung

Die PWA-Funktionen bestehen aus:

- [public/manifest.webmanifest](public/manifest.webmanifest)
- [public/sw.js](public/sw.js)
- App-Icons in `public/`
- Service-Worker-Registrierung in [src/main.tsx](src/main.tsx)
- Installationsabfrage in [src/components/InstallPromptModal.tsx](src/components/InstallPromptModal.tsx)

Der Service Worker speichert die App-Shell und wichtige Assets im Cache. Dadurch bleibt die App nach dem ersten Laden grundsätzlich offline nutzbar.

Hinweis: Browser erlauben Webseiten nicht, beim tatsächlichen Schließen einer mobilen Seite ein eigenes Installations-Popup zu erzwingen. Die App nutzt deshalb das offizielle `beforeinstallprompt`-Ereignis und zeigt die Ja/Nein-Abfrage, sobald der Browser die Installation anbietet.

### Projektstruktur

```text
src/
  App.tsx
  main.tsx
  components/
    RangeCalculator.tsx
    Settings.tsx
    SliderCard.tsx
    ResultCard.tsx
    WelcomeModal.tsx
    InstallPromptModal.tsx
  i18n.ts
  styles/
    global.css
  test/
    setup.ts
  types/
    index.ts
  utils/
    calculateRange.ts
    storage.ts
```

Wichtige Dateien:

| Datei | Aufgabe |
| --- | --- |
| `src/App.tsx` | Zentraler App-State und Screen-Wechsel |
| `src/main.tsx` | React-Einstiegspunkt und Service-Worker-Registrierung |
| `src/components/RangeCalculator.tsx` | Hauptscreen mit Slidern, Ergebnis und Hinweis |
| `src/components/Settings.tsx` | Formular zum Speichern eigener Werte |
| `src/components/SliderCard.tsx` | Wiederverwendbare Slider-Karte |
| `src/components/ResultCard.tsx` | Darstellung der berechneten Reichweite |
| `src/components/WelcomeModal.tsx` | Beispieldaten-Hinweis, bis eigene Daten gespeichert sind |
| `src/components/InstallPromptModal.tsx` | Ja/Nein-Dialog für die PWA-Installation |
| `src/i18n.ts` | Übersetzungen und Browser-Locale-Erkennung |
| `src/utils/calculateRange.ts` | Reine Berechnungslogik und zentrale Formel für die Reichweite |
| `src/utils/calculateRange.test.ts` | Tests für Formel, Faktoren, Rundung und Plausibilität |
| `src/utils/storage.ts` | Gekapselte `localStorage`-Logik |
| `src/utils/storage.test.ts` | Tests für Speichern, Laden und Validieren lokaler Daten |
| `src/App.test.tsx` | UI-Tests für Dialog, Sprache, Einstellungen und Live-Aktualisierung |
| `src/types/index.ts` | Gemeinsame Typen, Optionen und Standardwerte |
| `src/styles/global.css` | Globales Layout und responsive Gestaltung |
| `public/sw.js` | Service Worker für Offline-Nutzung |

### Architekturprinzipien

- Die Berechnungslogik ist rein und unabhängig von React.
- Die Storage-Logik ist getrennt von den Komponenten.
- Komponenten erhalten Daten über Props und melden Änderungen über Callback-Funktionen zurück.
- Die App hat bewusst nur zwei Screens.
- Die UI ist mobile-first und auf große Touchflächen ausgelegt.
- Tests beschreiben die wichtigsten Nutzer- und Geschäftsregeln.

### Hinweise für Junior-Entwickler

Wenn du die App verstehen möchtest, lies die Dateien am besten in dieser Reihenfolge:

1. [src/types/index.ts](src/types/index.ts)
2. [src/i18n.ts](src/i18n.ts)
3. [src/utils/calculateRange.ts](src/utils/calculateRange.ts)
4. [src/utils/storage.ts](src/utils/storage.ts)
5. [src/App.tsx](src/App.tsx)
6. [src/components/RangeCalculator.tsx](src/components/RangeCalculator.tsx)
7. [src/components/Settings.tsx](src/components/Settings.tsx)
8. [src/styles/global.css](src/styles/global.css)
9. Die Testdateien

So erkennst du zuerst die Datenstruktur, danach die Geschäftslogik und zuletzt die Benutzeroberfläche.

---

## English

### App Goal

The **E-Bike Battery Range Calculator** is a small Progressive Web App for e-bike riders. It answers one simple question:

> How far can I approximately ride with my battery?

The target audience includes leisure riders, senior users, and people who do not want to deal with technical details. The app only asks for the most important values and avoids advanced settings.

### Features

- Two screens: range calculator and settings
- Sample-data notice on every start until user settings are saved
- Default example values for immediate use
- User settings stored in `localStorage`
- Live range updates when sliders change
- Offline support through a service worker
- Installable as a PWA
- Installation question on mobile browsers when the browser offers PWA installation
- Mobile-first layout for small smartphone screens
- Consistent line icons via `lucide-react`
- Automatic language selection: German for `de-*` browser locales, English for all others
- Tests for calculation logic, storage behavior, and key UI flows

### Tech Stack

- React
- TypeScript
- Vite
- Vitest
- React Testing Library
- Plain CSS without a heavy UI framework
- Web App Manifest and Service Worker for PWA behavior

### Installation

Requirements:

- Node.js
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app is usually available at:

```text
http://127.0.0.1:5173/
```

### Running Tests

```bash
npm run test:run
```

The tests verify that:

- default values produce the expected range
- more assistance, more weight, and hillier terrain reduce the range
- values are rounded correctly
- settings are saved to and loaded from `localStorage`
- invalid stored data is handled safely
- the sample-data notice works
- the mobile installation question can be shown
- settings can be opened and saved
- the range updates live

### Production Build

```bash
npm run build
```

The build first runs TypeScript and then creates the production output in `dist/`.

### Important npm Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Runs TypeScript and creates a production build |
| `npm run preview` | Serves the production build locally |
| `npm run test` | Starts Vitest in watch mode |
| `npm run test:run` | Runs all tests once |

### Range Formula

The calculation lives in [src/utils/calculateRange.ts](src/utils/calculateRange.ts).

Base formula:

```text
Range = battery capacity / final consumption
```

Final consumption:

```text
Final consumption = (full-support flat consumption + full-support climbing consumption) × motor share
```

Flat consumption at full assistance:

```text
18 Wh/km at 105 kg total weight
```

Estimated positive elevation gain per kilometer:

| Terrain | Elevation gain/km |
| --- | ---: |
| Flat | 0 m |
| Slightly hilly | 8 m |
| Hilly | 20 m |
| Very hilly | 40 m |
| Extremely hilly | 65 m |

Weight and flat consumption:

```text
Total weight = rider weight + bike weight
Flat weight factor = 1 + (total weight / 105 - 1) × 0.3
```

The flat weight factor is clamped:

```text
Minimum: 0.85
Maximum: 1.2
```

Climbing consumption:

```text
Mechanical elevation energy = total weight × 9.81 × elevation gain per km / 3600
Full-support climbing consumption = Mechanical elevation energy / 0.85
```

Motor share by assistance level:

| Level | Motor share |
| --- | ---: |
| Minimal | 0% |
| Level 2 | 25% |
| Level 3 | 50% |
| Level 4 | 75% |
| Maximum | 100% |

At 0% assistance, the battery is mathematically not consumed. The app then shows unlimited battery range.

Realistic range:

```text
Lower bound = result × 0.85
Upper bound = result × 1.15
```

All values are rounded to full kilometers.

### Changing the Formula

The range formula lives only in:

```text
src/utils/calculateRange.ts
```

This file is intentionally independent from React, CSS, storage, and UI components. That makes it possible to change and test the formula without touching the visual interface.

Important parts in `calculateRange.ts`:

| Code location | Meaning |
| --- | --- |
| `FULL_SUPPORT_FLAT_CONSUMPTION_WH_PER_KM` | Flat consumption at full motor assistance in Wh/km |
| `ELEVATION_GAIN_M_PER_KM` | Estimated positive elevation gain for each terrain level |
| `ASSISTANCE_MOTOR_SHARE` | Motor share for each assistance level |
| `GRAVITY_M_PER_SECOND_SQUARED` | Gravity constant for elevation energy |
| `MOTOR_EFFICIENCY` | Efficiency for converting mechanical energy to battery energy |
| `REFERENCE_WEIGHT_KG` | Reference weight for the neutral flat weight factor |
| `FLAT_WEIGHT_INFLUENCE` | Weight influence on flat consumption |
| `calculateRange(settings)` | Main function that calculates range, minimum, and maximum |

If the formula needs to change:

1. Open [src/utils/calculateRange.ts](src/utils/calculateRange.ts).
2. Change only the domain constants or the `calculateRange` function.
3. Update the tests in [src/utils/calculateRange.test.ts](src/utils/calculateRange.test.ts).
4. Check whether visible example values in [src/App.test.tsx](src/App.test.tsx) must change.
5. Run `npm run test:run`.
6. Run `npm run build`.
7. Update this README section if the formula, factors, or rounding behavior changes.

Example: If full motor assistance should consume less on flat ground, only this value changes:

```ts
const FULL_SUPPORT_FLAT_CONSUMPTION_WH_PER_KM = 17;
```

After that, the expected ranges in the tests must be recalculated.

Not recommended:

- Moving the formula into React components.
- Duplicating calculation logic in `RangeCalculator.tsx`, `ResultCard.tsx`, or `Settings.tsx`.
- Mixing UI labels with formula factors.
- Deleting tests only because numbers changed.

### Default Values

The app starts with these values:

| Value | Default |
| --- | ---: |
| Battery capacity | 625 Wh |
| Rider weight | 80 kg |
| Bike weight | 25 kg |
| Terrain | Slightly hilly |
| Assistance | 50% |

These values produce:

```text
Full-support flat consumption = 18 Wh/km
Full-support climbing consumption = (105 × 9.81 × 8 / 3600) / 0.85 = 2.69 Wh/km
Final consumption = (18 + 2.69) × 0.5 = 10.35 Wh/km
625 / 10.35 = 60.41 km
Rounded: 60 km
Realistic: 51 - 69 km
```

### Data Storage

The app only uses `localStorage`.

It stores:

- personal settings
- whether custom settings have been saved

There is:

- no database
- no backend
- no cloud sync
- no external API call
- no tracking
- no analytics

### Internationalization

The app automatically chooses the UI language from the browser language:

- `de`, `de-DE`, `de-AT`, `de-CH`, and other `de-*` locales show German.
- All other locales show English.

Important: The app does not use location data, GPS, or external APIs for this. A user in Germany with an English browser language will see English. A user outside Germany with a German browser language will see German.

Translations live in [src/i18n.ts](src/i18n.ts). This file also contains the localized slider labels for terrain and assistance.

### PWA and Offline Support

The PWA behavior is implemented with:

- [public/manifest.webmanifest](public/manifest.webmanifest)
- [public/sw.js](public/sw.js)
- app icons in `public/`
- service-worker registration in [src/main.tsx](src/main.tsx)
- installation question in [src/components/InstallPromptModal.tsx](src/components/InstallPromptModal.tsx)

The service worker caches the app shell and important static assets. After the first load, the app can be opened offline in normal use.

Note: Browsers do not allow websites to force a custom installation popup while a mobile page is actually closing. The app therefore uses the official `beforeinstallprompt` event and shows the yes/no question when the browser offers installation.

### Project Structure

```text
src/
  App.tsx
  main.tsx
  components/
    RangeCalculator.tsx
    Settings.tsx
    SliderCard.tsx
    ResultCard.tsx
    WelcomeModal.tsx
    InstallPromptModal.tsx
  i18n.ts
  styles/
    global.css
  test/
    setup.ts
  types/
    index.ts
  utils/
    calculateRange.ts
    storage.ts
```

Important files:

| File | Responsibility |
| --- | --- |
| `src/App.tsx` | Holds central app state and switches screens |
| `src/main.tsx` | React entry point and service-worker registration |
| `src/components/RangeCalculator.tsx` | Main calculator screen with sliders, result, and notice |
| `src/components/Settings.tsx` | Form for saving user values |
| `src/components/SliderCard.tsx` | Reusable slider card component |
| `src/components/ResultCard.tsx` | Displays the calculated range |
| `src/components/WelcomeModal.tsx` | Sample-data notice until user settings are saved |
| `src/components/InstallPromptModal.tsx` | Yes/no dialog for PWA installation |
| `src/i18n.ts` | Translations and browser-locale detection |
| `src/utils/calculateRange.ts` | Pure calculation logic and central range formula |
| `src/utils/calculateRange.test.ts` | Tests for formula, factors, rounding, and plausibility |
| `src/utils/storage.ts` | Encapsulated `localStorage` access |
| `src/utils/storage.test.ts` | Tests for saving, loading, and validating local data |
| `src/App.test.tsx` | UI tests for dialog, language, settings, and live updates |
| `src/types/index.ts` | Shared types, options, and defaults |
| `src/styles/global.css` | Global layout and responsive styling |
| `public/sw.js` | Service worker for offline support |

### Architecture Principles

- Calculation logic is pure and independent from React.
- Storage logic is isolated from UI components.
- Components receive data through props and report changes through callbacks.
- The app intentionally has only two screens.
- The UI is mobile-first and designed for large touch targets.
- Tests document the most important user flows and business rules.

### Notes for Junior Developers

To understand the app, read the files in this order:

1. [src/types/index.ts](src/types/index.ts)
2. [src/i18n.ts](src/i18n.ts)
3. [src/utils/calculateRange.ts](src/utils/calculateRange.ts)
4. [src/utils/storage.ts](src/utils/storage.ts)
5. [src/App.tsx](src/App.tsx)
6. [src/components/RangeCalculator.tsx](src/components/RangeCalculator.tsx)
7. [src/components/Settings.tsx](src/components/Settings.tsx)
8. [src/styles/global.css](src/styles/global.css)
9. The test files

This order shows the data model first, then the business logic, and finally the user interface.
