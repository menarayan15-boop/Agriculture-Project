// src/services/liveEngine.js

const DEFAULT_COORDS = { lat: 29.6857, lon: 76.9905 }; // Karnal, Haryana fallback

class LiveFarmEngine {
    constructor() {
        this.mode = 'SIMULATION'; // or 'LIVE'

        this.state = {
            weather: {
                temp: 29,
                humidity: 60,
                apparentTemp: 31,
                windSpeed: 10,
                rainProbability: 0,
                condition: "Clear",
                lastUpdated: 0
            },
            airQuality: {
                aqi: 80,
                pm25: 25,
                status: "🟢 GOOD",
                recommendation: "Air quality is satisfactory.",
                lastUpdated: 0
            },
            farm: {
                soilMoisture: 35, // %
                rootZoneTemp: 28.4, // °C
                valveState: "OFF",
                lastUpdated: Date.now()
            },
            health: {
                heartRate: 72,
                bodyTemp: 36.6,
                spo2: 98,
                hydration: 80,
                caloriesBurned: 1420,
                sunExposureHours: 4.5,
                riskTimeline: [],
                heatRisk: "Low",
                workRecommendation: "🟢 CONDITIONS OK",
                explanation: "Values are stable."
            },
            sensors: [
                { id: "S1", type: "Soil Node", lastSeen: Date.now() },
                { id: "S2", type: "Weather Node", lastSeen: Date.now() },
                { id: "S3", type: "Wearable", lastSeen: Date.now() },
                { id: "S4", type: "Pump Relay", lastSeen: Date.now() },
                { id: "S5", type: "Air Quality Node", lastSeen: Date.now() }
            ]
        };

        this.subscribers = [];
        this.tickInterval = null;
        this.apiInterval = null;
        this.coords = { ...DEFAULT_COORDS };

        // Initial timeline setup
        this._pushTimelineEvent(Date.now() - 4 * 3600000); // -4 hrs
        this._pushTimelineEvent(Date.now() - 2 * 3600000); // -2 hrs
        this._pushTimelineEvent(Date.now()); // now
    }

    start() {
        this._initLocation().then(() => {
            this.fetchRealData();
            this.apiInterval = setInterval(() => this.fetchRealData(), 5 * 60 * 1000);
        });

        this.tickInterval = setInterval(() => this._simulationTick(), 5000);
    }

    stop() {
        if (this.tickInterval) clearInterval(this.tickInterval);
        if (this.apiInterval) clearInterval(this.apiInterval);
    }

    setMode(mode) {
        this.mode = mode; // 'SIMULATION' or 'LIVE'
    }

    updateValveState(state) {
        this.state.farm.valveState = state;
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    _notify() {
        this.subscribers.forEach(cb => cb(this.state));
    }

    async _initLocation() {
        if ("geolocation" in navigator) {
            try {
                const pos = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
                });
                this.coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            } catch (e) {
                console.warn("Geolocation blocked/failed, using fallback coords.", e);
            }
        }
    }

    async fetchRealData() {
        try {
            const { lat, lon } = this.coords;
            // Open-Meteo Weather
            const wxRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m`);
            const wxData = await wxRes.json();

            if (wxData.current) {
                const c = wxData.current;
                this.state.weather.temp = c.temperature_2m;
                this.state.weather.humidity = c.relative_humidity_2m;
                this.state.weather.apparentTemp = c.apparent_temperature;
                this.state.weather.windSpeed = c.wind_speed_10m;
                this.state.weather.rainProbability = c.precipitation > 0 ? 100 : 0; // rough proxy
                this.state.weather.condition = c.precipitation > 0 ? "Raining" : "Clear";
                this.state.weather.lastUpdated = Date.now();

                // Keep connected sensor online
                this.state.sensors.find(s => s.type === "Weather Node").lastSeen = Date.now();
            }

            // Open-Meteo Air Quality
            const aqRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,pm2_5`);
            const aqData = await aqRes.json();

            if (aqData.current) {
                const c = aqData.current;
                let aqi = c.european_aqi || Math.max(10, (c.pm2_5 || 10) * 4); // fallback approximation
                this.state.airQuality.aqi = aqi;
                this.state.airQuality.pm25 = c.pm2_5;
                this.state.airQuality.lastUpdated = Date.now();

                if (aqi > 150) {
                    this.state.airQuality.status = "🔴 DANGER";
                    this.state.airQuality.recommendation = "Hazardous. Avoid outdoor work.";
                } else if (aqi > 100) {
                    this.state.airQuality.status = "🟡 MODERATE";
                    this.state.airQuality.recommendation = "Acceptable, monitor exertion.";
                } else {
                    this.state.airQuality.status = "🟢 GOOD";
                    this.state.airQuality.recommendation = "Air quality is fine.";
                }

                // Keep connected sensor online
                this.state.sensors.find(s => s.type === "Air Quality Node").lastSeen = Date.now();
            }

        } catch (e) {
            console.error("Failed to fetch live data", e);
        }
        this._notify();
    }

    _simulationTick() {
        // Run physics/biological simulation
        const wx = this.state.weather;
        const fm = this.state.farm;
        const hl = this.state.health;

        // --- 1. Farm Simulation (Soil & Root Temp) ---
        if (this.mode === 'SIMULATION' || fm.valveState === 'ON') {
            // Soil Moisture
            if (fm.valveState === 'ON') {
                fm.soilMoisture += 2.5; // irrigation increases moisture rapidly
            } else {
                // Evapotranspiration
                const et = Math.max(0, wx.temp - 20) * (1 - wx.humidity / 100);
                // Convert to moisture drop per tick (reduced scale)
                fm.soilMoisture -= (et * 0.01 + 0.1);
            }
            fm.soilMoisture = Math.max(5, Math.min(100, fm.soilMoisture));

            // Root zone temp lags air temp
            const targetRoot = wx.temp - 2;
            fm.rootZoneTemp += (targetRoot - fm.rootZoneTemp) * 0.05; // 5% towards target per tick

            this.state.sensors.find(s => s.type === "Soil Node").lastSeen = Date.now();
            this.state.sensors.find(s => s.type === "Pump Relay").lastSeen = Date.now();
            fm.lastUpdated = Date.now();
        }

        // --- 2. Human Simulation (Wearable) ---
        if (this.mode === 'SIMULATION') {
            const at = wx.apparentTemp;

            // Heart Rate: Base 70 + Heat Stress + physical strain
            const heatStress = Math.max(0, at - 30) * 1.5;
            const targetHR = 70 + heatStress;
            // Move current HR toward target + jitter
            hl.heartRate = Math.round(hl.heartRate * 0.8 + targetHR * 0.2 + (Math.random() * 2 - 1));

            // Body Temp:
            const targetTemp = 36.6 + Math.max(0, at - 32) * 0.05 + (hl.sunExposureHours * 0.05);
            hl.bodyTemp = parseFloat((hl.bodyTemp * 0.9 + targetTemp * 0.1).toFixed(1));

            // Hydration depletes
            const dehyd = (Math.max(0, at - 25) * 0.005) + 0.01;
            hl.hydration = Math.max(10, hl.hydration - dehyd);

            // SpO2
            const aqStress = this.state.airQuality.aqi > 150 ? 2 : 0;
            hl.spo2 = 98 - aqStress - (heatStress > 10 ? 1 : 0) + Math.round(Math.random());
            hl.spo2 = Math.max(90, Math.min(100, hl.spo2));

            // Calories and Sun Exposure
            hl.caloriesBurned += 5 + (heatStress * 0.2); // ~60kcal per min if 5s tick
            hl.sunExposureHours += (5 / 3600); // 5 seconds in hours

            this.state.sensors.find(s => s.type === "Wearable").lastSeen = Date.now();
        }

        // --- 3. Evaluate Status & Timeline ---
        this._evalRisk();

        // Update current timeline node or add new if shifted hour
        const now = new Date();
        const lastTimeline = hl.riskTimeline[hl.riskTimeline.length - 1];
        const lastTimeDate = new Date();
        const [h, m] = lastTimeline.time.split(':');
        lastTimeDate.setHours(h, m, 0, 0);

        if (now.getTime() - lastTimeDate.getTime() >= 3600000) {
            // 1 hour passed -> push new node, keep max 3
            this._pushTimelineEvent(now.getTime());
        } else {
            // Update last node
            lastTimeline.status = hl.heatRisk === "High" ? "Danger" : hl.heatRisk === "Caution" ? "Caution" : "Safe";
        }

        // Jitter formatting
        hl.caloriesBurnedStr = Math.round(hl.caloriesBurned).toLocaleString();
        hl.sunExposureHoursStr = hl.sunExposureHours.toFixed(1);

        this._notify();
    }

    _evalRisk() {
        const temp = this.state.weather.apparentTemp;
        const aqi = this.state.airQuality.aqi;
        const hl = this.state.health;

        // Risk Logic
        if (temp >= 40 || aqi > 150) {
            hl.heatRisk = "High";
            hl.workRecommendation = "🔴 DANGER: SEEK SHADE";
        } else if (temp >= 32 || aqi > 100) {
            hl.heatRisk = "Caution";
            hl.workRecommendation = "🟡 CAUTION: TAKE BREAKS";
        } else {
            hl.heatRisk = "Low";
            hl.workRecommendation = "🟢 SAFE: CONDITIONS OK";
        }
    }

    _pushTimelineEvent(timestamp) {
        const d = new Date(timestamp);
        const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        this._evalRisk();
        const status = this.state.health.heatRisk === "High" ? "Danger" : this.state.health.heatRisk === "Caution" ? "Caution" : "Safe";

        this.state.health.riskTimeline.push({
            time: timeStr,
            status
        });

        if (this.state.health.riskTimeline.length > 3) {
            this.state.health.riskTimeline.shift();
        }

        // Tag the last one with (Now) is done in UI usually, but we'll do it there
    }
}

export const liveEngine = new LiveFarmEngine();
