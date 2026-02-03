# Moon-Location-Tracker-Angular

## Hybrid Lunar Position Calculator (Angular Edition)

Angular Moon Location Tracker is a standalone Angular application for computing the Moon’s geocentric longitude, latitude, and distance from Earth in real time. It is a direct Angular adaptation of the original browser-based tracker, preserving the same Tier-2 hybrid astronomical model while integrating cleanly into Angular’s component lifecycle and change detection system.

The application combines a classical Meeus analytical base model with a reduced ELP correction set, achieving a balance between numerical accuracy and performance suitable for live, per-second updates. All calculations are performed entirely on the client, with no external ephemeris libraries or backend services.



##  Main Features

### Real-Time Lunar Position (Angular-Driven)

* The Moon’s position is recalculated once per second using the current UTC time.
* Outputs include:

  * Geocentric longitude (degrees)
  * Geocentric latitude (degrees)
  * Earth–Moon distance (kilometers)



### Hybrid Accuracy Model

* A Meeus base solution provides the core lunar motion.
* A reduced ELP-style correction set refines longitude, latitude, and distance.
* This hybrid approach improves fidelity over Meeus alone while remaining lightweight enough for continuous UI updates.



### Astronomically Grounded Calculations

All values are derived from classical celestial mechanics, explicitly implemented in TypeScript:

* Julian Day computation
* Time expressed in Julian centuries
* Fundamental lunar arguments
* Trigonometric series expansions
* Deterministic analytical evaluation (no numerical integration)



### Deterministic and Reproducible

* Given the same UTC timestamp, the output is bit-for-bit identical.
* Suitable for:

  * Astronomical visualizations
  * Simulations
  * Educational and demonstrative use



### Angular-Native Live Update Loop

* Uses `NgZone.runOutsideAngular()` to schedule the 1-second update loop.
* Re-enters Angular’s zone only when state changes are required.
* Minimizes unnecessary change detection while maintaining live UI updates.



##  Technical Highlights

### Julian Day Calculation

Converts a JavaScript `Date` object into Julian Day while accounting for:

* UTC-based time
* Gregorian calendar correction
* Fractional days derived from hours, minutes, and seconds



### Fundamental Lunar Arguments

Computes the canonical angular parameters:

* Mean lunar longitude (L₀)
* Mean elongation (D)
* Solar anomaly (M)
* Lunar anomaly (M′)
* Argument of latitude (F)

High-order polynomial expressions are used, with all angles internally converted to radians for trigonometric evaluation.



### Meeus Base Model

Implements a reduced Meeus series to calculate:

* Base lunar longitude
* Base lunar latitude
* Mean Earth–Moon distance

This serves as the backbone of the lunar position solution.



### Reduced ELP Corrections

Applies a trimmed set of dominant ELP-style terms:

* Longitude corrections via sine series
* Latitude corrections via sine series
* Distance corrections via cosine series

The correction tables are intentionally compact, capturing the largest perturbations while preserving runtime performance.



### Tier-2 Hybrid Output

Final lunar coordinates are produced by combining:

* Meeus base results
* ELP correction deltas

This yields a higher-fidelity result than Meeus alone, without the computational overhead of full numerical ephemerides.



### Angular State Update

* The computed Moon position replaces the `moonData` object atomically.
* This ensures predictable change detection and clean template rendering.



##  File Structure (within app)

| File       | Description                                                       |
| ---------- | ----------------------------------------------------------------- |
| `app.ts`   | Core logic: Julian Day, Meeus model, ELP corrections, update loop |
| `app.html` | Angular template for displaying lunar data                        |
| `app.css`  | Minimal styling                                                   |
| `main.ts`  | Angular bootstrap (standalone component setup)                    |



##  Intended Use

This project is well suited for:

* Educational demonstrations of lunar mechanics
* Angular-based astronomical dashboards
* Experiments with analytical ephemeris modeling

It is not intended to replace high-precision observatory-grade ephemerides. Instead, it offers a transparent, mathematically honest middle ground between simplicity and accuracy—now fully integrated into the Angular ecosystem.

## Personal note
This project is a conversion of my original Moon Location Tracker, which was built entirely with vanilla HTML, CSS, and JavaScript. I wanted to recreate it using Angular, since it is a modern framework and the Moon Location Tracker should be able to function regardless of the framework used. Because the original implementation did not use TypeScript—and Angular requires a different development approach—some of the JavaScript logic had to be adapted during the conversion. However, since most of the underlying calculations remained unchanged, I am quite pleased with how closely the Angular version matches the original. One noticeable difference is that the original tracker updates automatically, whereas in the Angular version the Moon’s location is displayed on page load and requires a manual refresh to show the current position.


