# liveFarmData Engine

A centralized engine to manage live simulation and fetched data for the SmartFarm application.

## Setup & Keys
- **Weather / AQI Data**: Fetched natively via open-meteo without requiring API keys for demonstration purposes. Limit is 10,000 requests per day for non-commercial use.
- **Location**: Resolves using `navigator.geolocation` or falls back to standard demo coordinates.

## How it works

The engine exposes a `liveEngine` object with standard APIs:
- `liveEngine.start()`: Sets up periodic updates parsing APIs every 5 minutes and firing a highly responsive simulation update every 5 seconds.
- `liveEngine.setMode('LIVE' | 'SIMULATION')`: Easily switch between hardware sensor data usage versus AI extrapolation models.
- `liveEngine.subscribe(callback)`: Standard React-based hooking point.

## Incorporating into existing framework

You can seamlessly sync this with `dbState` by subscribing inside `apiSimulator.js` or directly hooking it into `App.jsx`.

Example:
```js
import { liveEngine } from './services/liveEngine';
// Start the engine
liveEngine.start();
liveEngine.subscribe(liveState => {
   // Copy dynamic variables into local state tree
});
```
