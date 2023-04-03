# Mini-State-Machine Changelog

## v2.0.0
_2023-04-03_

 * Typescript
 * ESM
 * _No web build_

## v1.0.0
_2020-02-05_

 * Remove parallel processing of state events, for simplicity

## v0.4.2
_2018-11-28_

 * **Bugfix**: `once` would not clear callback after first call

## v0.4.1
_2018-11-26_

 * **Bugfix**: Transitioning when in pending state error message showed wrong _to-state_

## v0.4.0
_2018-11-23_

 * Listen to all events by using "*" for the `stateOrTransition` value
 * Added `getHistory()` for fetching historical transitions
 * Improved error messages

## v0.3.2
_2018-11-15_

 * **Bugfix**: `on`/`once`/`off` event handlers throwing errors and not working

## v0.3.1
_2018-11-13_

 * Execute enter-state and after-transition callbacks in parallel

## v0.3.0
_2018-11-12_

 * Add `can`, `cannot` and `is` methods

## v0.2.0
_2018-11-10_

 * Reduced bundle size

## v0.1.0
_2018-11-10_

 * Initial release
