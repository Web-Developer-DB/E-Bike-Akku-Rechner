# E-Bike Battery Calculator

A mobile-first Progressive Web App for estimating e-bike range, recommended tire pressure, and basic battery status. The app is designed for everyday riders who want quick, understandable guidance without accounts, tracking, maps, GPS, weather APIs, or cloud storage.

All personal values are stored locally in the browser.

## Part 1: App Overview

### What The App Does

The E-Bike Battery Calculator helps riders answer a practical question:

> How far can I probably ride with my current e-bike setup?

The app combines bike, rider, battery, terrain, assistance, and tire data into a compact mobile interface with four main tabs:

| Tab | Purpose |
| --- | --- |
| Range | Shows the estimated range and the main factors behind it |
| Tire Pressure | Shows recommended front and rear tire pressure |
| Battery | Shows battery charge, capacity, health, cycles, and estimated consumption |
| More | Provides access to bike data, units, settings, and app-related entries |

### Main Features

- Estimated e-bike range in kilometers
- Realistic low/high range estimate
- Live adjustment of terrain and assistance level
- Battery charge and battery health included in the range calculation
- Tire pressure recommendation for front and rear tires
- Standardized tire-size selection using ETRTO-style entries such as `50-406`
- Bar and PSI display support
- Local settings saved in `localStorage`
- Sample-data notice until the user saves personal data
- Offline-capable PWA setup with manifest and service worker
- Optional mobile install prompt when supported by the browser
- German UI for German browser locales, English fallback for all other locales

### Intended Users

The app is intended for normal e-bike riders, especially people who want a fast estimate rather than a professional engineering tool. It is useful for:

- city and trekking e-bike riders
- leisure riders
- riders planning short and medium-distance trips
- people who want to understand how battery, weight, terrain, support level, and tire pressure interact

It is not intended to replace manufacturer specifications, workshop advice, or safety-critical tire/rim pressure limits.

### How To Use It

1. Open the app.
2. Review the sample range estimate.
3. Open Settings and enter your own bike data:
   - battery capacity
   - battery charge
   - battery health
   - rider weight
   - bike weight
   - terrain and assistance defaults
   - tire size
   - maximum tire pressure from the tire sidewall
   - preferred pressure unit
4. Save the settings.
5. Use the bottom navigation to switch between Range, Tire Pressure, Battery, and More.

The Range tab can still be adjusted quickly with terrain and assistance sliders. Changes there update the range immediately.

### Tire Pressure Notes

The tire-pressure feature uses a table-driven approach instead of accepting arbitrary tire sizes. Users choose from common standardized e-bike and city-bike tire sizes from 16" to 28".

The pressure recommendation is based on:

- selected ETRTO tire size
- tire width
- total rider + bike weight
- maximum pressure entered from the tire sidewall

The app never recommends a pressure above the configured maximum tire pressure. Users should always follow the lower maximum if the rim and tire have different pressure limits.

### Technology Used

The app is built with:

- React
- TypeScript
- Vite
- Vitest
- React Testing Library
- lucide-react icons
- plain CSS
- Web App Manifest and Service Worker for PWA behavior

No heavy UI framework is used.

## Part 2: Developer Documentation

### Project Structure

```text
src/
  App.tsx
  components/
    BatteryScreen.tsx
    BottomNavigation.tsx
    InstallPromptModal.tsx
    MoreScreen.tsx
    RangeCalculator.tsx
    ResultCard.tsx
    Settings.tsx
    SliderCard.tsx
    TirePressureScreen.tsx
    WelcomeModal.tsx
  data/
    tireSizes.ts
  styles/
    global.css
  types/
    index.ts
  utils/
    calculateRange.ts
    calculateTirePressure.ts
    storage.ts
```

### Important Files

| File | Responsibility |
| --- | --- |
| `src/App.tsx` | Owns app state, selected tab, settings screen, range result, and tire-pressure result |
| `src/types/index.ts` | Shared domain types and default settings |
| `src/i18n.ts` | German and English UI text |
| `src/utils/calculateRange.ts` | Pure range calculation |
| `src/utils/calculateTirePressure.ts` | Pure tire-pressure calculation |
| `src/data/tireSizes.ts` | Tire-size table, pressure guide table, load adjustment table |
| `src/utils/storage.ts` | localStorage persistence, validation, and migration |
| `src/styles/global.css` | Complete app styling |
| `public/manifest.webmanifest` | English PWA manifest |
| `public/manifest.de.webmanifest` | German PWA manifest |
| `public/sw.js` | Service worker |

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

The app is normally available at:

```text
http://127.0.0.1:5173/
```

### Available Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Runs TypeScript build checks and creates a production build |
| `npm run preview` | Serves the production build locally |
| `npm run test` | Starts Vitest in watch mode |
| `npm run test:run` | Runs all tests once |

### Testing

Run all tests:

```bash
npm run test:run
```

Current test coverage includes:

- range calculation
- tire-pressure calculation
- localStorage loading, saving, validation, and migration
- locale detection
- main app flows
- tab navigation
- settings editing
- PWA install prompt behavior

Before opening a pull request or publishing a build, run:

```bash
npm run test:run
npm run build
```

### Range Calculation

Range calculation is implemented in:

```text
src/utils/calculateRange.ts
```

The function is pure and independent of React, CSS, and browser APIs.

Core idea:

```text
range = usable battery capacity / energy consumption per km
```

Usable battery capacity:

```text
batteryCapacity * (batteryCharge / 100) * (batteryHealth / 100)
```

Energy consumption per km:

```text
(flat full-support consumption + climbing full-support consumption) * motor share
```

Important constants:

| Constant | Meaning |
| --- | --- |
| `FULL_SUPPORT_FLAT_CONSUMPTION_WH_PER_KM` | Flat-road consumption at full motor support |
| `ELEVATION_GAIN_M_PER_KM` | Estimated climbing meters per terrain level |
| `ASSISTANCE_MOTOR_SHARE` | Motor share by assistance level |
| `REFERENCE_WEIGHT_KG` | Neutral reference weight for flat-road consumption |
| `FLAT_WEIGHT_INFLUENCE` | Weight influence on flat-road consumption |
| `MOTOR_EFFICIENCY` | Efficiency used for climbing energy |

Terrain levels:

| Level | Meaning | Elevation gain |
| --- | --- | ---: |
| 1 | Flat | 0 m/km |
| 2 | Slightly hilly | 8 m/km |
| 3 | Hilly | 20 m/km |
| 4 | Very hilly | 40 m/km |
| 5 | Extremely hilly | 65 m/km |

Assistance levels:

| Level | Motor share |
| --- | ---: |
| 1 | 0% |
| 2 | 25% |
| 3 | 50% |
| 4 | 75% |
| 5 | 100% |

At 0% assistance, the app returns an unlimited battery range result because the motor does not consume battery energy.

The realistic range shown in the UI is:

```text
minimum = range * 0.85
maximum = range * 1.15
```

All range values are rounded to full kilometers.

### Tire Pressure Calculation

Tire pressure is implemented in:

```text
src/utils/calculateTirePressure.ts
src/data/tireSizes.ts
```

The calculation is intentionally table-driven:

1. Find the selected tire size by `tireSizeId`.
2. Use the tire width to find the closest pressure guide entry.
3. Use total rider + bike weight to find a load adjustment class.
4. Apply the adjustment to front and rear base pressures.
5. Clamp the result to safe minimums and the configured maximum tire pressure.

The app stores tire sizes in ETRTO-style IDs:

```text
50-406
54-622
60-559
```

In `50-406`, `50` means tire width in millimeters and `406` means bead seat diameter in millimeters.

The default tire setup is:

| Setting | Value |
| --- | --- |
| Wheel size | 20" |
| Tire size ID | `50-406` |
| Tire width | 50 mm |
| Inch display width | 1.97" |
| Max pressure | 4.5 bar |

The default tire-pressure result is:

| Position | Pressure |
| --- | ---: |
| Front | 2.7 bar |
| Rear | 3.0 bar |
| Maximum | 4.5 bar |

The app also provides PSI conversion:

```text
1 bar = 14.5038 PSI
```

### Updating Tire Tables

To add or change supported tire sizes, edit:

```text
src/data/tireSizes.ts
```

Use this shape:

```ts
{
  id: '54-406',
  wheelSizeInch: 20,
  widthMm: 54,
  beadSeatDiameterMm: 406,
  inchLabel: '20 x 2.15'
}
```

When updating tire data:

1. Keep `id` in ETRTO width-BSD format.
2. Keep `widthMm` consistent with the first number in `id`.
3. Keep `beadSeatDiameterMm` consistent with the second number in `id`.
4. Add or adjust pressure guide rows in `TIRE_PRESSURE_GUIDES` if a new width class is added.
5. Update tests in `src/utils/calculateTirePressure.test.ts` and `src/App.test.tsx`.
6. Run `npm run test:run` and `npm run build`.

### Settings And Storage

Settings are stored in `localStorage` through:

```text
src/utils/storage.ts
```

Storage keys:

| Key | Purpose |
| --- | --- |
| `ebike-settings` | Full serialized calculator settings |
| `ebike-has-custom-settings` | Flag used to decide whether the app still shows sample-data notices |

The storage module:

- validates unknown localStorage data at runtime
- rejects invalid or unsafe values
- migrates older saved settings to the current shape
- maps old free tire-width values to the closest supported standardized tire size

React components should not access `localStorage` directly.

### Internationalization

Translations live in:

```text
src/i18n.ts
```

Rules:

- Browser locales starting with `de` use German text.
- All other browser locales use English text.
- The app updates `document.documentElement.lang`.
- The app switches between German and English PWA manifests.

When adding UI text, add it to the `AppTranslations` interface and both translation objects.

### PWA Behavior

PWA files live in `public/`:

| File | Purpose |
| --- | --- |
| `manifest.webmanifest` | English app metadata |
| `manifest.de.webmanifest` | German app metadata |
| `sw.js` | Service worker |
| `icon.svg`, `icon-192.png`, `icon-512.png` | App icons |

`App.tsx` listens for `beforeinstallprompt` on mobile-like browsers and shows a custom install question before calling the browser install prompt.

### Design Notes

- The app is mobile-first.
- The primary layout is a fixed-width mobile shell with bottom navigation.
- Cards are used for repeated items and focused data panels.
- Icons come from `lucide-react`.
- Styling is plain CSS in `src/styles/global.css`.
- No external design system or component framework is used.

### Default Settings

Initial settings are defined in `src/types/index.ts`.

| Setting | Default |
| --- | ---: |
| Battery capacity | 625 Wh |
| Battery charge | 100% |
| Battery health | 95% |
| Charge cycles | 32 |
| Rider weight | 80 kg |
| Bike weight | 25 kg |
| Terrain | Slightly hilly |
| Assistance | 50% |
| Tire size | `50-406` |
| Max tire pressure | 4.5 bar |

With the current range formula, the default result is:

```text
57 km
Realistic: 49 - 66 km
```

### Development Guidelines

- Keep calculation code pure and testable.
- Do not move business logic into React components.
- Keep browser persistence inside `src/utils/storage.ts`.
- Keep tire-size and pressure tables in `src/data/tireSizes.ts`.
- Update tests whenever visible example numbers change.
- Run tests and build before publishing changes.

### Known Limitations

- The range result is an estimate, not a GPS or weather-aware prediction.
- Tire pressure recommendations are general city/e-bike guidance and do not replace tire or rim manufacturer limits.
- The tire-size table contains common sizes, not every possible bicycle tire.
- Weather, wind, rider cadence, drivetrain condition, tire model, surface roughness, and cargo are not fully modeled.

### License

See [LICENSE](LICENSE).
