// Centralized API and Backend Database Simulator for Universal Smart Farming Platform (USFP)

import { liveEngine } from '../services/liveEngine';

// LocalStorage Persistence Key
const STORAGE_KEY = 'usfp_global_state_v2';

// Database State
let dbState = null;

try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        dbState = JSON.parse(saved);

        // MIGRATION: Fix corrupted legacy language strings in local storage
        const legacyMap = { 'Hindi': 'hi', 'Telugu': 'te', 'Marathi': 'mr', 'Tamil': 'ta', 'Gujarati': 'gu', 'English': 'en' };
        if (dbState.farmer && legacyMap[dbState.farmer.language]) {
            dbState.farmer.language = legacyMap[dbState.farmer.language];
        }
        if (dbState.registeredFarmers) {
            dbState.registeredFarmers.forEach(f => {
                if (legacyMap[f.language]) {
                    f.language = legacyMap[f.language];
                }
            });
        }
    }
} catch (e) {
    console.warn("Failed to load state from localStorage", e);
}

if (!dbState) {
    dbState = {
        // Current active session bindings (for UI compatibility)
        activeFarmerId: "F-98214",
        activeFieldId: "Field 01",

        farmer: {
            name: "Rajesh Kumar",
            id: "F-98214",
            phone: "+91 94420 12345",
            location: "Karnal, Haryana",
            language: "hi",
            authPin: "1234"
        },

        farm: {
            cropName: "Basmati Rice",
            cropStage: "Vegetative Growth (45 Days)",
            cropHealth: "GOOD", // GOOD, EXCELLENT, NEEDS NITROGEN
            soilMoisture: 35, // percentage
            soilTemp: 28.4, // Celsius
            soilNPK: { N: 42, P: 38, K: 55 }, // mg/kg
            valveState: "OFF", // ON or OFF
            irrigationMode: "AUTO", // AUTO or MANUAL
            waterReservoirLevel: 82, // percentage
            batteryLevel: 94, // IoT controller battery percentage
            signalStrength: 4 // 1 to 5 bars
        },

        // Multi-Farmer Registry Table
        registeredFarmers: [
            {
                id: "F-98214",
                name: "Rajesh Kumar",
                phone: "+91 94420 12345",
                language: "hi",
                village: "Karnal",
                district: "Karnal",
                state: "Haryana",
                farmLocation: "Zone-B Primary Field",
                farmSize: "3.7 acres",
                soilType: "Clay Loam",
                waterSource: "Canal Utility + Borewell",
                cropsCultivated: "Basmati Rice, Wheat",
                fields: [
                    {
                        id: "Field 01",
                        name: "Field 01 (Rice)",
                        size: "2.5 acres",
                        crop: "Basmati Rice",
                        soilMoisture: 35,
                        soilTemp: 28.4,
                        valveState: "OFF",
                        irrigationMode: "AUTO",
                        cropStage: "Vegetative Growth (45 Days)",
                        cropHealth: "GOOD"
                    },
                    {
                        id: "Field 02",
                        name: "Field 02 (Wheat)",
                        size: "1.2 acres",
                        crop: "Wheat",
                        soilMoisture: 24,
                        soilTemp: 26.1,
                        valveState: "OFF",
                        irrigationMode: "MANUAL",
                        cropStage: "Initial Sowing Phase",
                        cropHealth: "EXCELLENT"
                    }
                ]
            },
            {
                id: "F-16001",
                name: "Jitesh Konapalli",
                phone: "+91 98888 77777",
                language: "Telugu",
                village: "Madanapalle",
                district: "Chittoor",
                state: "Andhra Pradesh",
                farmLocation: "Plot-D Southern Ridge",
                farmSize: "3.5 acres",
                soilType: "Red Sandy Soil",
                waterSource: "Borewell Pump",
                cropsCultivated: "Tomato, Groundnut",
                weather: {
                    temp: 26, humidity: 85, rainProbability: 10, condition: "Light Rain",
                    windSpeed: 8, forecastToday: "Cool and rainy"
                },
                airQuality: {
                    aqi: 45, pm25: 12, status: "🟢 GOOD", recommendation: "Air is clean and safe."
                },
                farmerHealth: {
                    heartRate: 68, bodyTemp: 36.5, spo2: 99, hydration: 85,
                    status: "🟢 SAFE", heatRisk: "Low", workRecommendation: "🟢 CONDITIONS OK"
                },
                fields: [
                    {
                        id: "Field 01",
                        name: "Field 01 (Tomato)",
                        size: "2.0 acres",
                        crop: "Tomato",
                        soilMoisture: 42,
                        soilTemp: 29.2,
                        valveState: "OFF",
                        irrigationMode: "AUTO",
                        cropStage: "Flowering Phase (30 Days)",
                        cropHealth: "GOOD"
                    },
                    {
                        id: "Field 02",
                        name: "Field 02 (Groundnut)",
                        size: "1.5 acres",
                        crop: "Groundnut",
                        soilMoisture: 28,
                        soilTemp: 27.5,
                        valveState: "OFF",
                        irrigationMode: "MANUAL",
                        cropStage: "Seed Pod Development",
                        cropHealth: "GOOD"
                    }
                ]
            }
        ],
        weather: {
            temp: 29,
            humidity: 68,
            rainProbability: 20, // percentage
            condition: "Partly Cloudy",
            windSpeed: 12, // km/h
            forecastToday: "Patchy rain likely late afternoon",
            forecastTomorrow: "Thunderstorms expected, 15-20mm rain"
        },

        airQuality: {
            aqi: 120,
            pm25: 45,
            status: "🟡 MODERATE",
            recommendation: "Acceptable, but sensitive individuals should monitor exertion."
        },

        farmerHealth: {
            heartRate: 72,
            bodyTemp: 36.8,
            spo2: 98,
            hydration: 80, // %
            status: "🟢 SAFE",
            heatRisk: "Low",
            workRecommendation: "🟢 CONDITIONS OK",
            explanation: "Temperature and humidity are within comfortable ranges."
        },

        disasterAlerts: [],

        privacyTokens: {
            healthSync: true,
            location: true,
            sos: true
        },

        hardwareSensors: {
            soil: '🟢 Online',
            temp: '🟢 Online',
            healthWatch: '🟢 Connected'
        },

        networkStatus: '🟢 ONLINE',

        aiRecommendations: [
            {
                id: "rec_1",
                timestamp: "Today, 08:30 AM",
                category: "irrigation",
                title: "Conserve Water - Precipitation Imminent",
                message: "Weather forecasting predicts 80% chance of heavy rainfall tomorrow. Automatically postponing scheduled irrigation to prevent waterlogging and root rot.",
                actionNeeded: true,
                actionStatus: "POSTPONED"
            },
            {
                id: "rec_2",
                timestamp: "Today, 06:15 AM",
                category: "nutrient",
                title: "Nitrogen Deficit Identified",
                message: "Sensor telemetry detects N level at 42 mg/kg which is slightly below the Basmati Rice vegetative phase target of 50 mg/kg. Recommend organic urea application in the next weeding cycle.",
                actionNeeded: false
            }
        ],
        systemLogs: [
            { id: 1, time: "11:45:02", type: "SYSTEM", message: "USFP Central Server initiated successfully." },
            { id: 2, time: "11:45:05", type: "IOT", message: "IoT node field-controller-01 registered with token JWT_xxxx_88" },
            { id: 3, time: "11:45:10", type: "WEATHER", message: "Weather data synched successfully from IMD API server." }
        ],
        smsLog: [
            { sender: "System", text: "Welcome to Smart Farm SMS. Text 'STATUS' for data or 'PUMP ON' / 'PUMP OFF' to control pump.", time: "11:45:00" }
        ],
        ivrCallHistory: [],

        // Sprayer/IoT actuator states
        sprayerState: "OFF",
        sprinklerState: "OFF",
        emergencyStop: false,

        // Disease & Pest Audit Log (immutable treatment records)
        diseaseAuditLog: [
            {
                auditId: "AUDIT-A1B2C3",
                timestamp: "Today, 07:15 AM",
                farmerId: "F-98214",
                farmerName: "Rajesh Kumar",
                fieldId: "Field 01",
                cropName: "Basmati Rice",
                disease: "Brown Planthopper Infestation",
                confidence: 85,
                decision: "advisory",
                treatmentCategory: "insecticide",
                inputMethod: "Smartphone Upload",
                notes: "Verified with Krishi Vigyan Kendra — awaiting site inspection."
            },
            {
                auditId: "AUDIT-D4E5F6",
                timestamp: "Yesterday, 04:45 PM",
                farmerId: "F-16001",
                farmerName: "Jitesh Konapalli",
                fieldId: "Field 01",
                cropName: "Tomato",
                disease: "Early Blight (Alternaria solani)",
                confidence: 91,
                decision: "approved",
                treatmentCategory: "fungicide",
                inputMethod: "Village Kiosk — Camera Capture",
                notes: "Applied Mancozeb 75% WP at 2g/L on 18-Aug-2026. Field logged."
            }
        ],

        // ─── Irrigation Events Log ───────────────────────────────────────────
        irrigationEvents: [
            { id: "IRR-001", fieldId: "Field 01", farmerId: "F-98214", startTime: "10:32 AM", duration: 12, waterUsed: 85, status: "Completed", date: "2026-08-20", source: "AUTO" },
            { id: "IRR-002", fieldId: "Field 02", farmerId: "F-98214", startTime: "06:15 AM", duration: 8, waterUsed: 52, status: "Completed", date: "2026-08-19", source: "MANUAL" },
            { id: "IRR-003", fieldId: "Field 01", farmerId: "F-16001", startTime: "07:00 AM", duration: 15, waterUsed: 110, status: "Completed", date: "2026-08-20", source: "AUTO" }
        ],

        // ─── Notification Center ─────────────────────────────────────────────
        notifications: [
            { id: "N-001", type: "warning", title: "LOW SOIL MOISTURE", message: "Field 01 soil moisture dropped to 18%. Irrigation recommended.", time: "08:12 AM", read: false, channel: "dashboard" },
            { id: "N-002", type: "info", title: "RAIN EXPECTED", message: "Rain expected within 12 hours. Automatic irrigation postponed.", time: "07:45 AM", read: true, channel: "sms" },
            { id: "N-003", type: "success", title: "IRRIGATION COMPLETED", message: "Field 01 irrigation completed. Duration: 12 min, Water: 85L.", time: "10:44 AM", read: true, channel: "dashboard" },
            { id: "N-004", type: "danger", title: "SENSOR OFFLINE", message: "Soil moisture sensor on Field 02 has not reported for 35 minutes.", time: "09:30 AM", read: false, channel: "dashboard" }
        ],

        // ─── Sensor Health Monitoring ────────────────────────────────────────
        sensorDevices: [
            { id: "SENS-01", type: "Soil Moisture", fieldId: "Field 01", farmerId: "F-98214", status: "ONLINE", lastReading: "35%", lastSeen: Date.now(), battery: 94, signalStrength: 4 },
            { id: "SENS-02", type: "Soil Temperature", fieldId: "Field 01", farmerId: "F-98214", status: "ONLINE", lastReading: "28.4°C", lastSeen: Date.now(), battery: 88, signalStrength: 3 },
            { id: "SENS-03", type: "Rain Sensor", fieldId: "Field 01", farmerId: "F-98214", status: "ONLINE", lastReading: "No Rain", lastSeen: Date.now(), battery: 72, signalStrength: 5 },
            { id: "SENS-04", type: "Soil Moisture", fieldId: "Field 02", farmerId: "F-98214", status: "WARNING", lastReading: "24%", lastSeen: Date.now() - 2100000, battery: 15, signalStrength: 1 },
            { id: "SENS-05", type: "Water Tank Level", fieldId: "Field 01", farmerId: "F-98214", status: "ONLINE", lastReading: "82%", lastSeen: Date.now(), battery: 96, signalStrength: 4 },
            { id: "SENS-06", type: "Soil Moisture", fieldId: "Field 01", farmerId: "F-16001", status: "ONLINE", lastReading: "42%", lastSeen: Date.now(), battery: 91, signalStrength: 4 }
        ],

        // ─── Farmer Feedback Records ─────────────────────────────────────────
        feedbackRecords: [
            { id: "FB-001", farmerId: "F-98214", type: "crop_recommendation", rating: "YES", crop: "Basmati Rice", comment: "Good yield this season", timestamp: "2026-08-18" },
            { id: "FB-002", farmerId: "F-16001", type: "irrigation", rating: "YES", comment: "Pump timing was accurate", timestamp: "2026-08-19" }
        ],

        // ─── Impact Metrics (Cumulative) ─────────────────────────────────────
        impactMetrics: {
            totalWaterConsumedL: 4820,
            totalIrrigationEvents: 47,
            estimatedWaterSavedL: 1230,
            avgIrrigationDurationMin: 11.4,
            cropRecommendationsGiven: 18,
            cropRecommendationAccuracy: 84,
            diseaseDetections: 7,
            diseaseDetectionAccuracy: 89,
            systemUptimePercent: 99.2,
            sensorUptimePercent: 96.8,
            farmerFeedbackPositive: 14,
            farmerFeedbackTotal: 16,
            estimatedInputSavingsINR: 8500
        },

        // ─── Demo Mode State ─────────────────────────────────────────────────
        demoMode: false,
        demoStep: 0,

        // ─── Online/Offline State ────────────────────────────────────────────
        isOnline: true,
        pendingSyncCount: 0
    };
} // This closes the if (!dbState) block

window.__USFP_STATE__ = dbState;

// Sync active field state change to main farmer registry array
const syncActiveFieldToDb = () => {
    const farmerIndex = dbState.registeredFarmers.findIndex(f => f.id === dbState.activeFarmerId);
    if (farmerIndex !== -1) {
        const fieldIndex = dbState.registeredFarmers[farmerIndex].fields.findIndex(fd => fd.id === dbState.activeFieldId);
        if (fieldIndex !== -1) {
            dbState.registeredFarmers[farmerIndex].fields[fieldIndex].soilMoisture = dbState.farm.soilMoisture;
            dbState.registeredFarmers[farmerIndex].fields[fieldIndex].soilTemp = dbState.farm.soilTemp;
            dbState.registeredFarmers[farmerIndex].fields[fieldIndex].valveState = dbState.farm.valveState;
            dbState.registeredFarmers[farmerIndex].fields[fieldIndex].irrigationMode = dbState.farm.irrigationMode;
            dbState.registeredFarmers[farmerIndex].fields[fieldIndex].crop = dbState.farm.cropName;
            dbState.registeredFarmers[farmerIndex].fields[fieldIndex].cropStage = dbState.farm.cropStage;
            dbState.registeredFarmers[farmerIndex].fields[fieldIndex].cropHealth = dbState.farm.cropHealth;
        }
    }
};

// Listeners to trigger React re-renders on backend state modifications
let stateListeners = [];

// Wire LiveEngine
liveEngine.start();
liveEngine.subscribe((liveState) => {
    if (!dbState) return;

    // Merge live weather
    dbState.weather = { ...dbState.weather, ...liveState.weather };

    // Merge live API airQuality
    dbState.airQuality = { ...dbState.airQuality, ...liveState.airQuality };

    // Merge live simulation farm values
    if (dbState.farm) {
        dbState.farm.soilMoisture = Math.round(liveState.farm.soilMoisture);
        dbState.farm.soilTemp = parseFloat(liveState.farm.rootZoneTemp.toFixed(1));
        dbState.farm.valveState = liveState.farm.valveState; // optional sync
    }

    // Merge live farmerHealth
    dbState.farmerHealth = {
        ...dbState.farmerHealth,
        ...liveState.health
    };

    // Merge sensors
    let onlineCount = 0;
    liveState.sensors.forEach(ls => {
        const diffMin = (Date.now() - ls.lastSeen) / 60000;
        let pStatus = diffMin < 10 ? '🟢 Online' : '🔴 Offline';
        if (ls.type === "Wearable") dbState.hardwareSensors.healthWatch = pStatus;
        if (ls.type === "Soil Node") dbState.hardwareSensors.soil = pStatus;
        if (ls.type === "Weather Node") dbState.hardwareSensors.temp = pStatus;
        if (diffMin < 10) onlineCount++;
    });
    dbState.sensorsOnline = onlineCount;
    dbState.sensorsTotal = liveState.sensors.length;

    notifyListeners();
});

const notifyListeners = () => {
    // SMARTFARM AI: Health & Disaster Engine Evaluator is now handled via liveEngine overrides
    if (dbState.weather && dbState.farmerHealth && dbState.airQuality) {
        // liveEngine already calculated heatRisk, workRecommendation, etc. 
        // Just keeping them in sync.
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbState));
    } catch (e) {
        console.warn("Failed to persist state.", e);
    }

    stateListeners.forEach(listener => listener({ ...dbState }));
};

export const subscribeToBackend = (listener) => {
    stateListeners.push(listener);
    return () => {
        stateListeners = stateListeners.filter(l => l !== listener);
    };
};

// Helper: Add log to terminal
const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newLog = {
        id: Date.now() + Math.random(),
        time: timestamp,
        type,
        message
    };
    dbState.systemLogs = [newLog, ...dbState.systemLogs].slice(0, 80); // Keep last 80 logs
    notifyListeners();
};

// API ENDPOINTS (Simulated HTTP request-response cycle)
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 5));

export const api = {
    _notifySubscribers: notifyListeners,

    selectActiveFarmer: async (farmerId) => {
        await simulateNetworkDelay();
        const farmer = dbState.registeredFarmers.find(f => f.id === farmerId);
        if (farmer) {
            dbState.activeFarmerId = farmerId;
            dbState.farmer = { ...farmer };

            // Switch main farm context to this farmer's primary field
            const primaryField = farmer.fields && farmer.fields.length > 0 ? farmer.fields[0] : null;
            if (primaryField) {
                dbState.activeFieldId = primaryField.id;
                dbState.farm = {
                    cropName: primaryField.crop || "Unknown",
                    cropStage: primaryField.cropStage || "Growth Phase",
                    cropHealth: primaryField.cropHealth || "GOOD",
                    soilMoisture: primaryField.soilMoisture || 40,
                    soilTemp: primaryField.soilTemp || 25,
                    soilNPK: primaryField.soilNPK || { N: 40, P: 40, K: 40 },
                    valveState: primaryField.valveState || "OFF",
                    irrigationMode: primaryField.irrigationMode || "AUTO",
                    waterReservoirLevel: 80,
                    batteryLevel: 95,
                    signalStrength: 4
                };
            }
            addLog("AUTH", `Active tenant session switched to Farmer ID: ${farmerId}`);
            notifyListeners();
        }
        return { status: 200, dbState };
    },

    getFarmData: async (token) => {
        await simulateNetworkDelay();
        addLog("API", `GET /api/farm-status - Authorization: ${token ? 'Bearer ' + token : 'None'} - Response: 200 OK`);
        return { status: 200, data: dbState };
    },

    // Farmer Registration Endpoints
    registerFarmer: async (farmerData) => {
        await simulateNetworkDelay();
        const newId = farmerData.id || "F-" + Math.floor(10000 + Math.random() * 90000);

        // Calculate fields total size
        const totalAcres = farmerData.fields ? farmerData.fields.reduce((acc, f) => {
            const num = parseFloat(f.size);
            return acc + (isNaN(num) ? 0 : num);
        }, 0) : 0;

        // Calculate crops cultivated
        const cropsList = farmerData.fields ? farmerData.fields.map(f => f.crop).filter((v, i, self) => self.indexOf(v) === i).join(", ") : "";

        const newFarmer = {
            id: newId,
            name: farmerData.name,
            phone: farmerData.phone,
            language: farmerData.language || "English",
            village: farmerData.village,
            district: farmerData.district,
            state: farmerData.state,
            location: farmerData.farmLocation || `${farmerData.village}, ${farmerData.district}`,
            farmLocation: farmerData.farmLocation || `${farmerData.village}, ${farmerData.district}`,
            farmSize: farmerData.farmSize || `${totalAcres} acres`,
            soilType: farmerData.soilType || "Clay Loam",
            waterSource: farmerData.waterSource || "Borewell Pump",
            cropsCultivated: farmerData.cropsCultivated || cropsList || "None",
            fields: farmerData.fields || []
        };

        dbState.registeredFarmers = [...dbState.registeredFarmers, newFarmer];
        addLog("API", `POST /api/farmer/register - Farmer ID: ${newId}, Name: ${newFarmer.name} - Response: 201 Created`);
        notifyListeners();
        return { status: 201, farmer: newFarmer };
    },

    getCropRecommendations: (farmerId) => {
        const farmer = dbState.registeredFarmers.find(f => f.id === farmerId) || dbState.registeredFarmers[0];
        if (!farmer) return [];

        const soilType = farmer.soilType || "Clay Loam";
        const waterSource = farmer.waterSource || "Borewell Pump";
        const farmSize = parseFloat(farmer.farmSize) || 2.0;

        // Take previous crop from cultivated records
        const previousCrop = farmer.cropsCultivated ? farmer.cropsCultivated.split(',')[0].trim() : "None";

        const reservoir = dbState.farm.waterReservoirLevel || 80;
        const moisture = dbState.farm.soilMoisture || 40;
        const temp = dbState.weather.temp || 29;
        const forecast = dbState.weather.forecastToday || "";
        const rainProb = dbState.weather.rainProbability || 20;

        // Month is August (Local date is 2026-08-20), representing India's Kharif (Monsoon) sowing season
        const currentSeason = "Kharif";

        const CANDIDATE_CROPS = [
            {
                name: "Groundnut",
                preferredSoilTypes: ["Red Sandy Soil", "Sandy loam", "Loam (Alluvial)"],
                preferredSeason: "Kharif",
                waterRequirement: "Low",
                minWaterReservoir: 20,
                tempOptimal: [22, 32],
                isLegume: true,
                description: "Groundnuts flourish in sandier formations and require minimal irrigation. Selecting this leguminous cover crop fixes nitrogen in soil depleted by heavy grains."
            },
            {
                name: "Tomato",
                preferredSoilTypes: ["Red Sandy Soil", "Loam (Alluvial)", "Clay Loam"],
                preferredSeason: "Any",
                waterRequirement: "Medium",
                minWaterReservoir: 40,
                tempOptimal: [18, 30],
                isLegume: false,
                description: "Tomatoes are a highly profitable cash crop suitable for medium soils with steady drip-reservoir irrigation capacity."
            },
            {
                name: "Maize",
                preferredSoilTypes: ["Loam (Alluvial)", "Black Clay Cotton Soil", "Red Sandy Soil"],
                preferredSeason: "Kharif",
                waterRequirement: "Medium",
                minWaterReservoir: 35,
                tempOptimal: [18, 32],
                isLegume: false,
                description: "Maize grows rapidly during natural monsoon rainfall, providing high yield for alluvial fields."
            },
            {
                name: "Basmati Rice",
                preferredSoilTypes: ["Clay Loam", "Black Clay Cotton Soil", "Loam (Alluvial)"],
                preferredSeason: "Kharif",
                waterRequirement: "High",
                minWaterReservoir: 70,
                tempOptimal: [25, 38],
                isLegume: false,
                description: "Rice grows in waterlogged fields. Only feasible with heavy soils like clay and rich irrigation storage."
            },
            {
                name: "Wheat",
                preferredSoilTypes: ["Clay Loam", "Loam (Alluvial)", "Black Clay Cotton Soil"],
                preferredSeason: "Rabi",
                waterRequirement: "Medium-High",
                minWaterReservoir: 55,
                tempOptimal: [15, 25],
                isLegume: false,
                description: "Wheat is a winter-sowing Rabi cereal. Not recommended for August monsoon humidity."
            },
            {
                name: "Chickpea",
                preferredSoilTypes: ["Black Clay Cotton Soil", "Clay Loam", "Loam (Alluvial)"],
                preferredSeason: "Rabi",
                waterRequirement: "Low",
                minWaterReservoir: 25,
                tempOptimal: [15, 28],
                isLegume: true,
                description: "Optimal legume rotations for heavy winter clay soils once monsoonal field moisture drops."
            }
        ];

        const scoredCrops = CANDIDATE_CROPS.map(crop => {
            let score = crop.isLegume ? 70 : 60; // Leguminous starting crop rotation advantage
            let explanations = {
                soil: "Neutral",
                weather: "Neutral",
                water: "Medium",
                season: "Neutral",
                rotation: "Neutral"
            };

            // 1. Soil Match
            const hasSoilMatch = crop.preferredSoilTypes.some(t => soilType.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(soilType.toLowerCase()));
            if (hasSoilMatch) {
                score += 15;
                explanations.soil = "High";
            } else {
                score -= 10;
                explanations.soil = "Low";
            }

            // 2. Season Match
            if (crop.preferredSeason === "Any") {
                score += 10;
                explanations.season = "Suitable";
            } else if (crop.preferredSeason === currentSeason) {
                score += 20;
                explanations.season = "Suitable";
            } else {
                score -= 15;
                explanations.season = "Unsuitable (Outside Sowing Window)";
            }

            // 3. Temp Match
            if (temp >= crop.tempOptimal[0] && temp <= crop.tempOptimal[1]) {
                score += 10;
                explanations.weather = "High";
            } else {
                const diff = temp < crop.tempOptimal[0] ? crop.tempOptimal[0] - temp : temp - crop.tempOptimal[1];
                score -= Math.min(20, Math.floor(diff * 2.5));
                explanations.weather = "Medium-Low";
            }

            // 4. Reservoir Water Match
            explanations.water = crop.waterRequirement;
            if (reservoir < crop.minWaterReservoir) {
                score -= 25;
            } else {
                score += 10;
            }

            // 5. Rotation Match
            if (previousCrop && previousCrop !== "None") {
                if (previousCrop.toLowerCase() === crop.name.toLowerCase()) {
                    score -= 25;
                    explanations.rotation = "Avoid (Monoculture pest build-up risk)";
                } else if (crop.isLegume && (previousCrop.toLowerCase().includes("rice") || previousCrop.toLowerCase().includes("wheat") || previousCrop.toLowerCase().includes("maize"))) {
                    score += 20;
                    explanations.rotation = "Excellent (Leguminous nitrogen fixation bonus)";
                } else {
                    explanations.rotation = "Neutral (Safe rotation)";
                }
            }

            // 6. Farm Size Match
            if (farmSize > 2.0 && crop.name === "Basmati Rice") {
                score += 5;
            }
            if (farmSize < 2.0 && crop.name === "Tomato") {
                score += 5;
            }

            score = Math.max(10, Math.min(99, score));

            return {
                name: crop.name,
                score: score,
                soilSuitability: explanations.soil,
                weatherSuitability: explanations.weather,
                waterRequirement: crop.waterRequirement,
                currentSeason: explanations.season,
                rotationMatch: explanations.rotation,
                description: crop.description
            };
        });

        return scoredCrops.sort((a, b) => b.score - a.score).slice(0, 3);
    },

    selectActiveFarmer: async (farmerId) => {
        await simulateNetworkDelay();
        const farmer = dbState.registeredFarmers.find(f => f.id === farmerId);
        if (farmer) {
            dbState.activeFarmerId = farmerId;
            dbState.farmer = {
                name: farmer.name,
                id: farmer.id,
                phone: farmer.phone,
                location: farmer.farmLocation || farmer.location,
                farmLocation: farmer.farmLocation || farmer.location,
                farmSize: farmer.farmSize,
                cropsCultivated: farmer.cropsCultivated,
                language: farmer.language,
                authPin: "1234"
            };

            // Select first field of this farmer
            if (farmer.fields && farmer.fields.length > 0) {
                dbState.activeFieldId = farmer.fields[0].id;
                dbState.farm = {
                    ...dbState.farm,
                    cropName: farmer.fields[0].crop,
                    cropStage: farmer.fields[0].cropStage || "Vegetative Growth Phase",
                    cropHealth: farmer.fields[0].cropHealth || "GOOD",
                    soilMoisture: farmer.fields[0].soilMoisture,
                    soilTemp: farmer.fields[0].soilTemp,
                    valveState: farmer.fields[0].valveState,
                    irrigationMode: farmer.fields[0].irrigationMode
                };
            }

            addLog("API", `POST /api/farmer/select - Active Profile loaded: ${farmer.name} (${farmerId}) - Response: 200 OK`);

            // Seed fresh AI recommendation for Jitesh/Rajesh
            if (farmer.name.includes("Jitesh")) {
                dbState.aiRecommendations = [
                    {
                        id: "rec_t1",
                        timestamp: "Just Now",
                        category: "irrigation",
                        title: "Tomato Root Aeration Active",
                        message: "Tomato crops require moist but well-drained loamy to sandy soils. Maintain current drip cycles.",
                        actionNeeded: false
                    }
                ];
            }

            notifyListeners();
            return { status: 200, farmer, farm: dbState.farm };
        }
        return { status: 404, message: "Farmer not found" };
    },

    selectActiveField: async (fieldId) => {
        await simulateNetworkDelay();
        const farmer = dbState.registeredFarmers.find(f => f.id === dbState.activeFarmerId);
        if (farmer) {
            const field = farmer.fields.find(fd => fd.id === fieldId);
            if (field) {
                dbState.activeFieldId = fieldId;
                dbState.farm = {
                    ...dbState.farm,
                    cropName: field.crop,
                    cropStage: field.cropStage || "Monitoring Phase",
                    cropHealth: field.cropHealth || "GOOD",
                    soilMoisture: field.soilMoisture,
                    soilTemp: field.soilTemp,
                    valveState: field.valveState,
                    irrigationMode: field.irrigationMode
                };
                addLog("API", `POST /api/field/select - Activated field controller socket: ${fieldId} (${field.crop}) - Response: 200 OK`);
                notifyListeners();
                return { status: 200, farm: dbState.farm };
            }
        }
        return { status: 404, message: "Field not found" };
    },

    updateIrrigationMode: async (mode, source = "WEB") => {
        await simulateNetworkDelay();
        dbState.farm.irrigationMode = mode;
        addLog("API", `POST /api/irrigation/mode - Source: ${source} - Mode: ${mode} - Response: 200 OK`);

        // Auto-irrigation threshold logic
        if (mode === "AUTO") {
            if (dbState.farm.soilMoisture < 30) {
                dbState.farm.valveState = "ON";
                addLog("AI_ENGINE", `Auto-Irrigation triggered: Soil Moisture (${dbState.farm.soilMoisture}%) below threshold (30%). Opening valve.`);
            } else {
                dbState.farm.valveState = "OFF";
                addLog("AI_ENGINE", `Auto-Irrigation: Soil Moisture (${dbState.farm.soilMoisture}%) is adequate. Closing valve.`);
            }
        }

        syncActiveFieldToDb();
        notifyListeners();
        return { status: 200, message: `Irrigation mode changed to ${mode}` };
    },

    togglePump: async (state, source = "WEB") => {
        await simulateNetworkDelay();
        dbState.farm.valveState = state;
        liveEngine.updateValveState(state); // Sync with physical sim engine
        addLog("API", `POST /api/irrigation/pump - Source: ${source} - State: ${state} - Response: 200 OK`);
        addLog("IOT", `Downlink data packet sent: { valveState: "${state}" } triggered by source ${source}`);

        syncActiveFieldToDb();
        notifyListeners();
        return { status: 200, valveState: state };
    },

    updateCropConfiguration: async (cropName, source = "WEB") => {
        await simulateNetworkDelay();
        dbState.farm.cropName = cropName;
        if (cropName === "Wheat") {
            dbState.farm.cropStage = "Initial Sowing Phase";
            dbState.farm.cropHealth = "EXCELLENT";
            dbState.aiRecommendations = [
                {
                    id: "rec_3",
                    timestamp: "Just Now",
                    category: "irrigation",
                    title: "Wheat Sowing Irrigation Mode Active",
                    message: "Wheat requires shallow irrigation during crown root initiation (CRI) stage (~21 days). Auto watering thresholds tuned down to 22% moisture.",
                    actionNeeded: false
                }
            ];
        } else if (cropName === "Basmati Rice") {
            dbState.farm.cropStage = "Vegetative Growth (45 Days)";
            dbState.farm.cropHealth = "GOOD";
            dbState.aiRecommendations = [
                {
                    id: "rec_1",
                    timestamp: "Today, 08:30 AM",
                    category: "irrigation",
                    title: "Conserve Water - Precipitation Imminent",
                    message: "Basmati rice requires high moisture, currently tuned to 30% threshold. Precipitation predicted tomorrow.",
                    actionNeeded: true
                }
            ];
        } else {
            dbState.farm.cropStage = "Monitoring Phase";
            dbState.farm.cropHealth = "GOOD";
        }

        addLog("API", `POST /api/crop - Crop updated to ${cropName} by ${source} - Response: 200 OK`);
        syncActiveFieldToDb();
        notifyListeners();
        return { status: 200, message: "Crop changed successfully" };
    },

    // IoT Field Controller API Endpoint
    sendTelemetry: async (telemetry) => {
        await simulateNetworkDelay();

        dbState.farm.soilMoisture = Number(telemetry.soilMoisture);
        if (telemetry.soilTemp !== undefined) dbState.farm.soilTemp = Number(telemetry.soilTemp);
        if (telemetry.batteryLevel !== undefined) dbState.farm.batteryLevel = Number(telemetry.batteryLevel);

        // Dynamic rain possibility or crop state change based on parameters
        if (dbState.farm.soilMoisture > 75) {
            dbState.farm.cropHealth = "GOOD";
        } else if (dbState.farm.soilMoisture < 20) {
            dbState.farm.cropHealth = "NEEDS ATTENTION (Dry Stress)";
        } else {
            dbState.farm.cropHealth = "GOOD";
        }

        const token = "X-IoT-Device-Token-98v2";
        addLog("API", `POST /api/iot/telemetry - Headers: { 'X-Device-Token': '${token}' } - Payload: Moisture=${telemetry.soilMoisture}%, Temp=${telemetry.soilTemp}°C - Response: 200 OK`);

        // Automatic Irrigation Business Logic Run on Central API Server
        if (dbState.farm.irrigationMode === "AUTO") {
            if (dbState.farm.soilMoisture < 30) {
                if (dbState.farm.valveState === "OFF") {
                    dbState.farm.valveState = "ON";
                    addLog("AI_ENGINE", `Auto-Irrigation Trigger: Moisture (${dbState.farm.soilMoisture}%) fell below threshold (30%). Activating Pump Valve.`);
                    addLog("IOT", `Downlink payload queued: { cmd: "VALVE_ON" }`);
                }
            } else {
                if (dbState.farm.valveState === "ON") {
                    dbState.farm.valveState = "OFF";
                    addLog("AI_ENGINE", `Auto-Irrigation Trigger: Moisture (${dbState.farm.soilMoisture}%) is above threshold (30%). Deactivating Pump Valve.`);
                    addLog("IOT", `Downlink payload queued: { cmd: "VALVE_OFF" }`);
                }
            }
        }

        syncActiveFieldToDb();
        notifyListeners();
        return {
            status: 200,
            data: {
                valveState: dbState.farm.valveState,
                irrigationMode: dbState.farm.irrigationMode
            }
        };
    },

    // SMS Gateway Webhook
    receiveSMS: async (sender = "+91 94420 12345", messageText = "") => {
        await simulateNetworkDelay();
        if (!sender) sender = "+91 94420 12345";
        const cleanMsg = messageText.trim().toUpperCase();
        addLog("SMS_GATEWAY", `Incoming SMS from ${sender}: "${messageText}"`);

        let reply = "";
        const farmer = dbState.registeredFarmers.find(f => f.phone && f.phone.replace(/[^0-9+]/g, '') === sender.replace(/[^0-9+]/g, '')) || dbState.registeredFarmers[0];
        const field = (farmer?.id === dbState.activeFarmerId ? dbState.farm : farmer?.fields?.[0]) || dbState.farm;

        if (cleanMsg === "STATUS") {
            const soilCond = (field.soilMoisture || 40) > 30 ? "Good" : "Dry";
            const irrg = (field.soilMoisture || 40) > 30 ? "Not Required" : "Required";
            const currentTemp = farmer.weather?.temp || dbState.weather.temp;
            reply = `SMARTFARM\n${field.name || field.id || 'Field 01'}\nCrop: ${field.crop || dbState.farm.cropName}\nSoil Type: ${farmer.soilType || 'Loam'}\nCondition: ${soilCond}\nIrrigation: ${irrg}\nWeather: ${currentTemp}°C`;
        } else if (cleanMsg === "WEATHER") {
            const w = farmer.weather || dbState.weather;
            reply = `SMARTFARM\nTemp: ${w.temp}°C\nRain Chance: ${w.rainProbability}%\n${w.forecastToday}`;
        } else if (cleanMsg === "CROP") {
            const recs = api.getCropRecommendations(farmer.id);
            const top = recs.length > 0 ? recs[0].crop : "Unknown";
            reply = `SMARTFARM\nCurrent: ${field.crop || dbState.farm.cropName}\nRecommended for ${farmer.soilType || 'your soil'}: ${top}\nHealth: ${field.cropHealth || dbState.farm.cropHealth}`;
        } else if (cleanMsg === "WATER") {
            reply = `SMARTFARM\nSoil Moisture: ${field.soilMoisture || dbState.farm.soilMoisture}%\nPump: ${field.valveState || dbState.farm.valveState}\nMode: ${field.irrigationMode || dbState.farm.irrigationMode}`;
        } else if (cleanMsg === "HEALTH") {
            const h = farmer.farmerHealth || dbState.farmerHealth || {};
            reply = `SMARTFARM HEALTH\n❤️ HR: ${h.heartRate || 72} bpm\n🌡️ Body: ${h.bodyTemp || 36.8}°C\n🫁 SpO2: ${h.spo2 || 98}%\n💧 Hydration: ${h.hydration || 80}%\nStatus: ${h.status || '🟢 SAFE'}\n${h.workRecommendation || '🟢 OK'}`;
        } else if (cleanMsg === "AQI") {
            const aq = farmer.airQuality || dbState.airQuality || {};
            let advice = "Safe conditions.";
            if ((aq.aqi || 0) >= 200) advice = "⚠️ HAZARDOUS! Wear mask. Avoid field work.";
            else if ((aq.aqi || 0) >= 150) advice = "⚠️ Unhealthy. Wear mask outdoors.";
            else if ((aq.aqi || 0) >= 100) advice = "Moderate. Sensitive groups be careful.";
            reply = `SMARTFARM AIR\nAQI: ${aq.aqi || 0}\nPM2.5: ${aq.pm25 || 0}\nStatus: ${aq.status || '🟢 GOOD'}\n${advice}`;
        } else if (cleanMsg === "SOS") {
            reply = `🆘 SOS ACTIVATED\nEmergency contacts notified.\nLocation shared with nearest PHC.\n\nHelpline: 112\nSmartFarm: 1800-419-5888\nAmbulance: 108`;
            addLog("SOS", `🆘 SOS triggered via SMS by ${sender}. Emergency contacts alerted.`);
        } else if (cleanMsg === "HEAT") {
            const temp = farmer.weather?.temp || dbState.weather?.temp || 29;
            let risk = "LOW";
            let advice = "Safe to work.";
            if (temp > 40) { risk = "EXTREME"; advice = "STOP outdoor work. Seek shade immediately!"; }
            else if (temp >= 36) { risk = "HIGH"; advice = "Take breaks every 30min. Hydrate constantly."; }
            else if (temp >= 32) { risk = "MODERATE"; advice = "Drink water regularly. Wear hat."; }
            reply = `SMARTFARM HEAT\nTemp: ${temp}°C\nHeat Risk: ${risk}\n${advice}`;
        } else if (cleanMsg === "HELP") {
            reply = "SMARTFARM\nCommands:\nSTATUS - Farm overview\nWEATHER - Forecast\nCROP - Recommendations\nWATER - Irrigation status\nHEALTH - Your vitals\nAQI - Air quality\nHEAT - Heat safety\nSOS - Emergency alert\nHELP - This menu";
        } else {
            reply = `SMARTFARM\nSorry, command not recognized.\nSend HELP for all commands.`;
        }

        dbState.smsLog = [...dbState.smsLog, { sender, text: messageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];

        setTimeout(() => {
            dbState.smsLog = [...dbState.smsLog, { sender: "System", recipient: sender, text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
            addLog("SMS_GATEWAY", `Outgoing SMS to ${sender}: "${reply.replace(/\n/g, ' ')}"`);
            syncActiveFieldToDb();
            notifyListeners();
        }, 800);

        syncActiveFieldToDb();
        notifyListeners();
        return { status: 200, sent: true };
    },

    // IVR Automated Dial System (Toll-free voice recognition gateway)
    processIVRAction: async (phoneNumber = "+91 94420 12345", keyTap) => {
        await simulateNetworkDelay();
        if (!phoneNumber) phoneNumber = "+91 94420 12345";
        addLog("IVR_GATEWAY", `Call ongoing with ${phoneNumber}. DTMF key pressed: '${keyTap}'`);

        if (!window._ivrSessions) window._ivrSessions = {};

        let dialogueMessage = "";
        let speechMessage = "";

        const farmer = dbState.registeredFarmers.find(f => f.phone && f.phone.replace(/[^0-9+]/g, '') === phoneNumber.replace(/[^0-9+]/g, '')) || dbState.registeredFarmers[0];
        const field = (farmer?.id === dbState.activeFarmerId ? dbState.farm : farmer?.fields?.[0]) || dbState.farm;

        const MAIN_MENU = "Welcome to SmartFarm.\nYour farm assistant is ready.\nPress 1 for today's farm advice.\nPress 2 for soil and water status.\nPress 3 for crop advice.\nPress 4 for weather information.\nPress 5 for irrigation status.\nPress 6 for crop health help.\nPress 7 to hear your farm summary.\nPress 8 to change language.\nPress 9 for help.\nPress 0 to repeat this menu.";

        if (keyTap === "init") {
            if (!farmer) {
                dialogueMessage = speechMessage = "This number is not registered with SmartFarm. Please contact your nearest SmartFarm support centre.";
            } else {
                if (!farmer.language) {
                    window._ivrSessions[phoneNumber] = { state: 'choose_lang' };
                    dialogueMessage = speechMessage = "For English, press 1.\nಕನ್ನಡಕ್ಕಾಗಿ 2 ಒತ್ತಿರಿ.\nहिन्दी के लिए 3 दबाएँ.\nతెలుగు కోసం 4 నొక్కండి.";
                } else {
                    window._ivrSessions[phoneNumber] = { state: 'main_menu', lang: farmer.language };
                    dialogueMessage = speechMessage = MAIN_MENU;
                }
            }
        } else {
            let session = window._ivrSessions[phoneNumber];
            if (!session) { session = { state: 'main_menu' }; window._ivrSessions[phoneNumber] = session; }

            if (session.state === 'choose_lang') {
                session.state = 'main_menu';
                dialogueMessage = speechMessage = "Language saved. " + MAIN_MENU;
            } else if (session.state === 'main_menu') {
                if (keyTap === '1') {
                    const aiRec = dbState.aiRecommendations.length > 0 ? dbState.aiRecommendations[0] : null;
                    if (aiRec) {
                        dialogueMessage = speechMessage = `Today's advice.\n${aiRec.title}.\n${aiRec.message}`;
                    } else {
                        dialogueMessage = speechMessage = "Today's advice.\nYour farm is operating optimally. No immediate action required.";
                    }
                    setTimeout(() => { session.state = 'main_menu'; }, 100);
                } else if (keyTap === '2') {
                    const moisture = field.soilMoisture || dbState.farm.soilMoisture;
                    const tank = dbState.farm.waterReservoirLevel || 60;
                    if (moisture !== undefined) {
                        dialogueMessage = speechMessage = `Your soil moisture is ${moisture} percent.\nThe current soil status is ${moisture > 30 ? 'good' : 'dry'}.\nYour water tank has approximately ${tank} percent water remaining.\nPress 0 to return to main menu.`;
                    } else {
                        dialogueMessage = speechMessage = "We are currently unable to receive information from your farm sensor.\nPress 0 to return to main menu.";
                    }
                } else if (keyTap === '3') {
                    const recs = api.getCropRecommendations(farmer.id);
                    const top = recs.length > 0 ? recs[0].crop : "Groundnut";
                    dialogueMessage = speechMessage = `Based on your ${farmer.soilType || 'soil'} and weather...\n${top} is highly recommended to yield maximum profits.\nPress 1 to hear why ${top} is recommended.\nPress 2 to return to the main menu.`;
                    session.state = 'crop_advice';
                } else if (keyTap === '4') {
                    dialogueMessage = speechMessage = `Today's temperature is ${dbState.weather.temp} degrees Celsius.\nThere is a ${dbState.weather.rainProbability} percent chance of rain today.\nBecause of expected conditions, SmartFarm recommends waiting before irrigation.\nPress 0 to return.`;
                } else if (keyTap === '5') {
                    const needsWater = (field.soilMoisture || dbState.farm.soilMoisture) < 30;
                    if (!needsWater) {
                        dialogueMessage = speechMessage = "Your crop does not currently need irrigation.\nPress 0 to return to main menu.";
                    } else {
                        dialogueMessage = speechMessage = "Your crop may need water.\nSmartFarm recommends approximately 12 minutes of irrigation.\nPress 1 to start irrigation.\nPress 2 to cancel.\nPress 3 to return to the main menu.";
                        session.state = 'irrigation_menu';
                    }
                } else if (keyTap === '6') {
                    dialogueMessage = speechMessage = "Health and Safety Center.\nPress 1 for heat stress risk.\nPress 2 for air quality check.\nPress 3 for hydration reminder.\nPress 4 for pesticide re-entry safety.\nPress 5 for nearest hospital.\nPress 6 for S.O.S. emergency.\nPress 0 to return to the main menu.";
                    session.state = 'health_safety';
                } else if (keyTap === '7') {
                    dialogueMessage = speechMessage = `Your farm summary for ${field.name || 'Field 01'}.\nCurrent crop: ${field.crop || dbState.farm.cropName} on ${farmer.soilType || 'your soil'}.\nSoil moisture: ${field.soilMoisture || dbState.farm.soilMoisture} percent.\nWeather: ${dbState.weather.temp} degrees.\nIrrigation: ${field.valveState === 'ON' ? 'Running' : 'Not required'}.\nCrop health: ${field.cropHealth || dbState.farm.cropHealth}.\nThank you.`;
                } else if (keyTap === '8') {
                    session.state = 'choose_lang';
                    dialogueMessage = speechMessage = "For English, press 1.\nಕನ್ನಡಕ್ಕಾಗಿ 2 ಒತ್ತಿರಿ.\nहिन्दी के लिए 3 दबाएँ.\nతెలుగు కోసం 4 నొక్కండి.";
                } else if (keyTap === '9') {
                    dialogueMessage = speechMessage = "Help menu. Please press 0 to hear the main options again. If you need immediate assistance, please visit the nearest village kiosk.";
                } else if (keyTap === '0') {
                    dialogueMessage = speechMessage = MAIN_MENU;
                } else {
                    dialogueMessage = speechMessage = "Invalid option.\n" + MAIN_MENU;
                }
            } else if (session.state === 'irrigation_menu') {
                if (keyTap === '1') {
                    dialogueMessage = speechMessage = "You are requesting irrigation for Field 1.\nRecommended duration is 12 minutes.\nPress 1 to confirm.\nPress 2 to cancel.";
                    session.state = 'irrigation_confirm';
                } else if (keyTap === '2' || keyTap === '3') {
                    session.state = 'main_menu';
                    dialogueMessage = speechMessage = "Cancelled.\n" + MAIN_MENU;
                } else {
                    dialogueMessage = speechMessage = "Invalid option. Press 1 to start, 2 to cancel.";
                }
            } else if (session.state === 'irrigation_confirm') {
                if (keyTap === '1') {
                    dbState.farm.valveState = "ON";
                    dbState.farm.irrigationMode = "MANUAL";
                    addLog("SERVER", "Pump manually activated via secure Voice IVR PIN/Confirmation.");
                    dialogueMessage = speechMessage = "Command executed. Irrigation pump is now ON. Emergency stop is always available.\nPress 0 for main menu.";
                    session.state = 'main_menu';
                } else {
                    session.state = 'main_menu';
                    dialogueMessage = speechMessage = "Irrigation cancelled.\n" + MAIN_MENU;
                }
            } else if (session.state === 'crop_advice') {
                if (keyTap === '1') {
                    dialogueMessage = speechMessage = "Groundnuts flourish in sandier formations and require minimal irrigation. This leguminous crop fixes nitrogen in soil depleted by heavy grains.\nPress 0 for main menu.";
                } else {
                    session.state = 'main_menu';
                    dialogueMessage = speechMessage = MAIN_MENU;
                }
            } else if (session.state === 'crop_health') {
                if (keyTap === '1') {
                    dialogueMessage = speechMessage = "Common warning signs include: Yellowing leaves from the bottom, circular brown patches on leaves, or wilting in the afternoon despite moist soil.\nPress 0 for main menu.";
                } else if (keyTap === '2') {
                    dialogueMessage = speechMessage = "Transferring your call to agricultural support... please wait.";
                } else {
                    session.state = 'main_menu';
                    dialogueMessage = speechMessage = MAIN_MENU;
                }
            } else if (session.state === 'health_safety') {
                if (keyTap === '1') {
                    // Heat Risk
                    const currentTemp = farmer?.weather?.temp || dbState.weather?.temp || 29;
                    let risk = 'low';
                    let advice = 'Safe to work outdoors.';
                    if (currentTemp > 40) { risk = 'extreme'; advice = 'Stop all outdoor work immediately. Seek shade and drink water right now.'; }
                    else if (currentTemp >= 36) { risk = 'high'; advice = 'Take a break every 30 minutes. Drink at least 2 glasses of water per hour.'; }
                    else if (currentTemp >= 32) { risk = 'moderate'; advice = 'Drink water regularly and wear a wide-brimmed hat to protect from the sun.'; }
                    dialogueMessage = speechMessage = `Heat stress risk assessment.\nCurrent temperature is ${currentTemp} degrees Celsius.\nYour heat risk level is ${risk}.\n${advice}\nPress 0 to return to health menu.`;
                    session.state = 'health_back';
                } else if (keyTap === '2') {
                    // AQI
                    const aq = farmer?.airQuality || dbState.airQuality || {};
                    const aqi = aq.aqi || 120;
                    let status = 'good';
                    let advice = 'Air is safe. You can work outdoors.';
                    if (aqi >= 200) { status = 'hazardous'; advice = 'Do not go outside. Wear a mask if you must. This air is dangerous.'; }
                    else if (aqi >= 150) { status = 'unhealthy'; advice = 'Wear a mask when working outdoors. Take frequent breaks.'; }
                    else if (aqi >= 100) { status = 'moderate'; advice = 'Air quality is acceptable. Sensitive individuals should take care.'; }
                    dialogueMessage = speechMessage = `Air quality check.\nThe current A.Q.I. is ${aqi}.\nStatus: ${status}.\nP.M. 2.5 level is ${aq.pm25 || 45} micrograms per cubic meter.\n${advice}\nPress 0 to return to health menu.`;
                    session.state = 'health_back';
                } else if (keyTap === '3') {
                    // Hydration
                    const hydration = farmer?.farmerHealth?.hydration || dbState.farmerHealth?.hydration || 80;
                    let advice = 'Your hydration level is normal. Keep drinking water regularly.';
                    if (hydration < 50) advice = 'WARNING. You are dehydrated. Please drink water immediately. Carry a water bottle to the field.';
                    else if (hydration < 70) advice = 'You should drink more water. Have at least one glass in the next 15 minutes.';
                    dialogueMessage = speechMessage = `Hydration check.\nYour estimated hydration level is ${hydration} percent.\n${advice}\nPress 0 to return to health menu.`;
                    session.state = 'health_back';
                } else if (keyTap === '4') {
                    // Pesticide Safety
                    dialogueMessage = speechMessage = "Pesticide Re-entry Safety.\nIf you recently sprayed chemicals on your field, you must wait for the re-entry interval before going back.\nFor Mancozeb, wait 24 hours.\nFor Chlorpyrifos, wait 48 hours.\nAlways wear gloves, mask, and full clothing when spraying.\nPress 0 to return to health menu.";
                    session.state = 'health_back';
                } else if (keyTap === '5') {
                    // Nearest Hospital
                    dialogueMessage = speechMessage = "Nearest health facility.\nKarnal Government Primary Health Center is approximately 6 kilometers away, about 14 minutes by road.\nFor emergencies, dial 1-1-2.\nFor ambulance, dial 1-0-8.\nPress 0 to return to health menu.";
                    session.state = 'health_back';
                } else if (keyTap === '6') {
                    // SOS
                    addLog("SOS", "🆘 SOS triggered via IVR voice call. Emergency contacts alerted.");
                    dialogueMessage = speechMessage = "S.O.S. Emergency activated.\nYour location has been shared with the nearest Primary Health Center.\nEmergency contacts have been notified by SMS.\nPlease stay calm. Help is on the way.\nDial 1-1-2 for police and fire.\nDial 1-0-8 for ambulance.\nPress 0 to return to health menu.";
                    session.state = 'health_back';
                } else if (keyTap === '0') {
                    session.state = 'main_menu';
                    dialogueMessage = speechMessage = MAIN_MENU;
                } else {
                    dialogueMessage = speechMessage = "Invalid option. Press 1 through 6 or press 0 to go back.";
                }
            } else if (session.state === 'health_back') {
                if (keyTap === '0') {
                    session.state = 'health_safety';
                    dialogueMessage = speechMessage = "Health and Safety Center.\nPress 1 for heat stress risk.\nPress 2 for air quality check.\nPress 3 for hydration reminder.\nPress 4 for pesticide re-entry safety.\nPress 5 for nearest hospital.\nPress 6 for S.O.S. emergency.\nPress 0 to return to the main menu.";
                } else {
                    session.state = 'main_menu';
                    dialogueMessage = speechMessage = MAIN_MENU;
                }
            } else {
                if (keyTap === '0') {
                    session.state = 'main_menu';
                    dialogueMessage = speechMessage = MAIN_MENU;
                } else {
                    dialogueMessage = speechMessage = "Invalid entry.\n" + MAIN_MENU;
                }
            }
        }

        syncActiveFieldToDb();
        notifyListeners();
        return {
            status: 200,
            dialogueText: dialogueMessage,
            ttsPrompt: speechMessage
        };
    },


    // ─── Disease / Pest Analysis API ─────────────────────────────────────────
    analyzeCropDisease: async (cropName, inputMethod, farmerId) => {
        await simulateNetworkDelay();
        const methodLabel = inputMethod === 'upload' ? 'Smartphone Upload' : inputMethod === 'kiosk' ? 'Kiosk Camera Capture' : inputMethod === 'assisted' ? 'Assisted Village Centre' : 'Demo Simulation';
        addLog("AI_ENGINE", `POST /api/crop-health/analyze - Farmer: ${farmerId}, Crop: ${cropName}, Channel: ${methodLabel} - CNN model inference initiated`);
        addLog("AI_ENGINE", `Crop health scan: Running ResNet-50 feature extraction on ${cropName} sample image...`);
        return { status: 200, message: "Analysis initiated", cropName, inputMethod: methodLabel };
    },

    // ─── Treatment Action Audit Logger (Immutable Record) ─────────────────────
    recordTreatmentAction: async (actionData) => {
        await simulateNetworkDelay();
        const auditId = `AUDIT-${Date.now().toString(36).toUpperCase().slice(-8)}`;
        const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

        const auditEntry = {
            auditId,
            timestamp,
            farmerId: actionData.farmerId,
            farmerName: actionData.farmerName,
            fieldId: actionData.fieldId,
            cropName: actionData.cropName,
            disease: actionData.disease,
            confidence: actionData.confidence,
            decision: actionData.treatmentDecision,
            treatmentCategory: actionData.treatmentCategory,
            inputMethod: actionData.inputMethod === 'upload' ? 'Smartphone Upload' :
                actionData.inputMethod === 'kiosk' ? 'Village Kiosk — Camera Capture' :
                    actionData.inputMethod === 'assisted' ? 'Assisted Village Centre' : 'Demo Simulation',
            notes: actionData.operatorNotes || "",
            analysisId: actionData.analysisId
        };

        dbState.diseaseAuditLog = [auditEntry, ...dbState.diseaseAuditLog];

        // Log Treatment decision
        const decisionLabel = actionData.treatmentDecision === 'approved' ? 'TREATMENT APPROVED & LOGGED' :
            actionData.treatmentDecision === 'advisory' ? 'REFERRED TO AGRICULTURAL ADVISOR' : 'NO ACTION TAKEN';
        addLog("DISEASE_MODULE", `Treatment decision recorded: [${decisionLabel}] for ${actionData.disease} on ${actionData.cropName} (${actionData.confidence}% confidence). Audit ID: ${auditId}`);

        // If approved, send SMS notification
        if (actionData.treatmentDecision === 'approved') {
            const smsAlert = `SMARTFARM: Possible crop disease detected on ${actionData.cropName} - ${actionData.disease}. Treatment plan logged. Audit: ${auditId}.`;
            dbState.smsLog = [...dbState.smsLog, { sender: "Disease Alert", text: smsAlert, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
            addLog("SMS_GATEWAY", `Outgoing SMS alert: Disease treatment action recorded for ${actionData.farmerName}.`);
        }

        notifyListeners();
        return auditEntry;
    },

    // ─── Feedback API ────────────────────────────────────────────────────
    submitFeedback: async (feedbackData) => {
        await simulateNetworkDelay();
        const entry = {
            id: "FB-" + Date.now().toString(36).toUpperCase().slice(-6),
            farmerId: feedbackData.farmerId || dbState.activeFarmerId,
            type: feedbackData.type,
            rating: feedbackData.rating,
            crop: feedbackData.crop || "",
            comment: feedbackData.comment || "",
            timestamp: new Date().toISOString().split('T')[0]
        };
        dbState.feedbackRecords = [entry, ...dbState.feedbackRecords];
        if (feedbackData.rating === "YES") dbState.impactMetrics.farmerFeedbackPositive++;
        dbState.impactMetrics.farmerFeedbackTotal++;
        addLog("API", `POST /api/feedback - Type: ${entry.type}, Rating: ${entry.rating} - 201 Created`);
        notifyListeners();
        return { status: 201, feedback: entry };
    },

    // ─── Notification API ────────────────────────────────────────────────
    getNotifications: async () => {
        await simulateNetworkDelay();
        return { status: 200, data: dbState.notifications };
    },

    markNotificationRead: async (notifId) => {
        await simulateNetworkDelay();
        const n = dbState.notifications.find(x => x.id === notifId);
        if (n) n.read = true;
        notifyListeners();
        return { status: 200 };
    },

    addNotification: (type, title, message, channel = "dashboard") => {
        const notif = {
            id: "N-" + Date.now().toString(36).slice(-6),
            type, title, message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false, channel
        };
        dbState.notifications = [notif, ...dbState.notifications].slice(0, 50);
        notifyListeners();
        return notif;
    },

    // ─── Sensor Health API ───────────────────────────────────────────────
    getSensorHealth: async () => {
        await simulateNetworkDelay();
        // Check for stale sensors
        const now = Date.now();
        dbState.sensorDevices.forEach(s => {
            const minutesSince = (now - s.lastSeen) / 60000;
            if (minutesSince > 30) s.status = "OFFLINE";
            else if (s.battery < 20 || s.signalStrength < 2) s.status = "WARNING";
            else s.status = "ONLINE";
        });
        notifyListeners();
        return { status: 200, sensors: dbState.sensorDevices };
    },

    // ─── Irrigation Event Logger ─────────────────────────────────────────
    logIrrigationEvent: async (eventData) => {
        await simulateNetworkDelay();
        const event = {
            id: "IRR-" + Date.now().toString(36).toUpperCase().slice(-6),
            fieldId: eventData.fieldId || dbState.activeFieldId,
            farmerId: eventData.farmerId || dbState.activeFarmerId,
            startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            duration: eventData.duration || 0,
            waterUsed: eventData.waterUsed || 0,
            status: eventData.status || "In Progress",
            date: new Date().toISOString().split('T')[0],
            source: eventData.source || "MANUAL"
        };
        dbState.irrigationEvents = [event, ...dbState.irrigationEvents];
        dbState.impactMetrics.totalIrrigationEvents++;
        dbState.impactMetrics.totalWaterConsumedL += event.waterUsed;
        addLog("API", `POST /api/irrigation/event - ${event.id} logged - ${event.waterUsed}L - ${event.source}`);
        notifyListeners();
        return { status: 201, event };
    },

    // ─── Admin Stats API ─────────────────────────────────────────────────
    getAdminStats: async () => {
        await simulateNetworkDelay();
        const online = dbState.sensorDevices.filter(s => s.status === "ONLINE").length;
        const warning = dbState.sensorDevices.filter(s => s.status === "WARNING").length;
        return {
            status: 200,
            stats: {
                totalFarmers: dbState.registeredFarmers.length,
                totalFarms: dbState.registeredFarmers.reduce((a, f) => a + (f.fields?.length || 0), 0),
                totalSensors: dbState.sensorDevices.length,
                sensorsOnline: online,
                sensorsWarning: warning,
                sensorsOffline: dbState.sensorDevices.length - online - warning,
                irrigationEvents: dbState.irrigationEvents.length,
                diseaseAlerts: dbState.diseaseAuditLog.length,
                notifications: dbState.notifications.length,
                waterConsumed: dbState.impactMetrics.totalWaterConsumedL,
                waterSaved: dbState.impactMetrics.estimatedWaterSavedL
            }
        };
    },

    // ─── Impact Metrics API ──────────────────────────────────────────────
    getImpactMetrics: async () => {
        await simulateNetworkDelay();
        return { status: 200, metrics: dbState.impactMetrics };
    },

    // ─── Demo Mode API ──────────────────────────────────────────────────
    toggleDemoMode: async (enabled) => {
        dbState.demoMode = enabled;
        dbState.demoStep = 0;
        addLog("SYSTEM", `Demo mode ${enabled ? 'ACTIVATED' : 'DEACTIVATED'}`);
        notifyListeners();
        return { status: 200 };
    },

    advanceDemoStep: async () => {
        dbState.demoStep++;
        const step = dbState.demoStep;
        if (step === 1) { addLog("DEMO", "Step 1: Farmer registered successfully."); }
        else if (step === 2) { addLog("DEMO", "Step 2: Farm & fields created."); }
        else if (step === 3) { addLog("DEMO", "Step 3: Simulated soil sensor connected."); }
        else if (step === 4) { dbState.farm.soilMoisture = 35; addLog("DEMO", "Step 4: Soil data streaming — Moisture: 35%"); }
        else if (step === 5) { addLog("DEMO", "Step 5: Weather data loaded — 29°C, Rain: 20%"); }
        else if (step === 6) { addLog("DEMO", "Step 6: AI crop recommendation generated."); }
        else if (step === 7) { addLog("DEMO", "Step 7: Recommendation explained — Groundnut 89%"); }
        else if (step === 8) { dbState.farm.soilMoisture = 18; syncActiveFieldToDb(); addLog("DEMO", "Step 8: Simulating LOW soil moisture (18%)!"); }
        else if (step === 9) { dbState.farm.valveState = "ON"; syncActiveFieldToDb(); addLog("DEMO", "Step 9: AI decides irrigation needed → Pump ON"); }
        else if (step === 10) { addLog("DEMO", "Step 10: Dashboard updated with live data."); }
        else if (step === 11) { dbState.weather.rainProbability = 85; addLog("DEMO", "Step 11: Simulating rain forecast (85%)!"); }
        else if (step === 12) { dbState.farm.valveState = "OFF"; syncActiveFieldToDb(); addLog("DEMO", "Step 12: System postponed irrigation — rain expected."); }
        else if (step === 13) { addLog("DEMO", "Step 13: IVR flow demonstrated."); }
        else if (step === 14) { addLog("DEMO", "Step 14: SMS notification sent."); }
        else if (step === 15) { addLog("DEMO", "Step 15: Kiosk mode demonstrated."); }
        else if (step === 16) { addLog("DEMO", "Step 16: Impact dashboard shown."); }
        else if (step === 17) { addLog("DEMO", "✅ Demo complete! All 17 steps demonstrated."); }
        notifyListeners();
        return { status: 200, step: dbState.demoStep, total: 17 };
    },

    // ─── Toggle Sprinkler / Sprayer ──────────────────────────────────────
    toggleSprinkler: async (state, source = "WEB") => {
        await simulateNetworkDelay();
        dbState.sprinklerState = state;
        addLog("IOT", `Sprinkler ${state} — Source: ${source}`);
        notifyListeners();
        return { status: 200, sprinklerState: state };
    },

    toggleSprayer: async (state, source = "WEB") => {
        await simulateNetworkDelay();
        dbState.sprayerState = state;
        addLog("IOT", `Sprayer ${state} — Source: ${source}`);
        notifyListeners();
        return { status: 200, sprayerState: state };
    },

    emergencyStopAll: async () => {
        await simulateNetworkDelay();
        dbState.emergencyStop = true;
        dbState.farm.valveState = "OFF";
        dbState.sprinklerState = "OFF";
        dbState.sprayerState = "OFF";
        syncActiveFieldToDb();
        addLog("EMERGENCY", "🚨 EMERGENCY STOP — All actuators deactivated immediately!");
        notifyListeners();
        return { status: 200 };
    },

    resetEmergencyStop: async () => {
        dbState.emergencyStop = false;
        addLog("SYSTEM", "Emergency stop cleared. Manual control restored.");
        notifyListeners();
        return { status: 200 };
    },

    // ─── Online/Offline Toggle ───────────────────────────────────────────
    toggleOnlineStatus: async (online) => {
        dbState.isOnline = online;
        if (!online) dbState.pendingSyncCount = Math.floor(Math.random() * 5) + 2;
        else dbState.pendingSyncCount = 0;
        addLog("SYSTEM", online ? "Connection restored. Syncing pending data..." : "Connection lost. Operating in OFFLINE mode.");
        notifyListeners();
        return { status: 200 };
    }
};
