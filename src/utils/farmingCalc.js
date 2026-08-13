// ─────────────────────────────────────────────────────────────────────────────
//  Krishi Jal — Farming Calculator Engine
//  Pure JS utility (no React). All formulas, crop data, and conversions live here.
// ─────────────────────────────────────────────────────────────────────────────

// ── Unit Conversions (all → acres) ───────────────────────────────────────────
export const UNIT_TO_ACRE = {
  acre: 1,
  hectare: 2.47105,
  bigha_pucca: 0.625,
  bigha_kacha: 0.208,
  guntha: 0.025,
  cent: 0.01,
  sqft: 1 / 43560,
};

export const UNIT_NAMES = {
  acre: 'Acre (एकड़)',
  hectare: 'Hectare (हेक्टेयर)',
  bigha_pucca: 'Bigha Pucca (पक्का बीघा)',
  bigha_kacha: 'Bigha Kacha (कच्चा बीघा)',
  guntha: 'Guntha (गुंठा)',
  cent: 'Cent (सेंट)',
  sqft: 'Sq. Feet (वर्ग फुट)',
};

export function toAcres(val, unit) {
  const v = Math.max(0, parseFloat(val) || 0);
  return v * (UNIT_TO_ACRE[unit] || 1);
}

export function fmt(n, decimals = 0) {
  return Number(n.toFixed(decimals)).toLocaleString('en-IN');
}

// ── Crop Data (20 crops) ──────────────────────────────────────────────────────
export const CROP_DATA = {
  wheat:      { name: 'Wheat',           nameHi: 'गेहूं',      icon: '🌾', seedRateKgAcre: 40,    seedUnit: 'kg',  npkAcre: { N:60, P:30, K:20 }, waterLitAcre: 550000,  irrigations: 6,  yieldQtlAcre: 20,  msp: 2425, daysToMature: 120, season: 'Rabi',   typicalCostAcre: 15000 },
  rice:       { name: 'Paddy (Rice)',     nameHi: 'धान',         icon: '🍚', seedRateKgAcre: 15,    seedUnit: 'kg',  npkAcre: { N:80, P:40, K:40 }, waterLitAcre: 1200000, irrigations: 20, yieldQtlAcre: 22,  msp: 2300, daysToMature: 130, season: 'Kharif', typicalCostAcre: 18000 },
  maize:      { name: 'Maize (Corn)',     nameHi: 'मक्का',       icon: '🌽', seedRateKgAcre: 8,     seedUnit: 'kg',  npkAcre: { N:80, P:35, K:25 }, waterLitAcre: 400000,  irrigations: 5,  yieldQtlAcre: 25,  msp: 2225, daysToMature: 100, season: 'Kharif', typicalCostAcre: 12000 },
  cotton:     { name: 'Cotton',           nameHi: 'कपास',        icon: '☁️', seedRateKgAcre: 1.5,   seedUnit: 'kg',  npkAcre: { N:100,P:50, K:50 }, waterLitAcre: 700000,  irrigations: 8,  yieldQtlAcre: 8,   msp: 7121, daysToMature: 180, season: 'Kharif', typicalCostAcre: 22000 },
  sugarcane:  { name: 'Sugarcane',        nameHi: 'गन्ना',       icon: '🎋', seedRateKgAcre: 2500,  seedUnit: 'kg',  npkAcre: { N:150,P:60, K:60 }, waterLitAcre: 1800000, irrigations: 20, yieldQtlAcre: 300, msp: 355,  daysToMature: 365, season: 'Annual', typicalCostAcre: 35000 },
  soybean:    { name: 'Soybean',          nameHi: 'सोयाबीन',    icon: '🫘', seedRateKgAcre: 30,    seedUnit: 'kg',  npkAcre: { N:25, P:50, K:25 }, waterLitAcre: 350000,  irrigations: 3,  yieldQtlAcre: 10,  msp: 4892, daysToMature: 100, season: 'Kharif', typicalCostAcre: 10000 },
  mustard:    { name: 'Mustard',          nameHi: 'सरसों',       icon: '🌼', seedRateKgAcre: 2.5,   seedUnit: 'kg',  npkAcre: { N:40, P:20, K:15 }, waterLitAcre: 250000,  irrigations: 2,  yieldQtlAcre: 8,   msp: 5950, daysToMature: 110, season: 'Rabi',   typicalCostAcre: 8000  },
  tomato:     { name: 'Tomato',           nameHi: 'टमाटर',      icon: '🍅', seedRateKgAcre: 0.15,  seedUnit: 'kg',  npkAcre: { N:100,P:60, K:60 }, waterLitAcre: 600000,  irrigations: 15, yieldQtlAcre: 120, msp: null, daysToMature: 75,  season: 'All',    typicalCostAcre: 25000 },
  potato:     { name: 'Potato',           nameHi: 'आलू',         icon: '🥔', seedRateKgAcre: 800,   seedUnit: 'kg',  npkAcre: { N:100,P:50, K:100},waterLitAcre: 500000,  irrigations: 8,  yieldQtlAcre: 100, msp: null, daysToMature: 90,  season: 'Rabi',   typicalCostAcre: 30000 },
  onion:      { name: 'Onion',            nameHi: 'प्याज',       icon: '🧅', seedRateKgAcre: 4,     seedUnit: 'kg',  npkAcre: { N:60, P:30, K:30 }, waterLitAcre: 400000,  irrigations: 10, yieldQtlAcre: 80,  msp: null, daysToMature: 110, season: 'Rabi',   typicalCostAcre: 20000 },
  groundnut:  { name: 'Groundnut',        nameHi: 'मूंगफली',    icon: '🥜', seedRateKgAcre: 50,    seedUnit: 'kg',  npkAcre: { N:20, P:40, K:20 }, waterLitAcre: 400000,  irrigations: 4,  yieldQtlAcre: 12,  msp: 6783, daysToMature: 120, season: 'Kharif', typicalCostAcre: 14000 },
  chana:      { name: 'Gram (Chana)',     nameHi: 'चना',         icon: '🫛', seedRateKgAcre: 35,    seedUnit: 'kg',  npkAcre: { N:20, P:40, K:20 }, waterLitAcre: 200000,  irrigations: 2,  yieldQtlAcre: 8,   msp: 5440, daysToMature: 120, season: 'Rabi',   typicalCostAcre: 8500  },
  tur:        { name: 'Tur Dal (Arhar)',  nameHi: 'तूर दाल',    icon: '🫘', seedRateKgAcre: 8,     seedUnit: 'kg',  npkAcre: { N:20, P:40, K:20 }, waterLitAcre: 300000,  irrigations: 3,  yieldQtlAcre: 6,   msp: 7550, daysToMature: 150, season: 'Kharif', typicalCostAcre: 10000 },
  moong:      { name: 'Moong Dal',        nameHi: 'मूंग',        icon: '🫛', seedRateKgAcre: 8,     seedUnit: 'kg',  npkAcre: { N:20, P:30, K:20 }, waterLitAcre: 200000,  irrigations: 3,  yieldQtlAcre: 4,   msp: 8682, daysToMature: 65,  season: 'Kharif', typicalCostAcre: 7000  },
  sunflower:  { name: 'Sunflower',        nameHi: 'सूरजमुखी',   icon: '🌻', seedRateKgAcre: 3,     seedUnit: 'kg',  npkAcre: { N:60, P:30, K:30 }, waterLitAcre: 350000,  irrigations: 4,  yieldQtlAcre: 8,   msp: 7280, daysToMature: 100, season: 'Kharif', typicalCostAcre: 10000 },
  banana:     { name: 'Banana',           nameHi: 'केला',        icon: '🍌', seedRateKgAcre: 800,   seedUnit: 'suckers', npkAcre: { N:120,P:60, K:200},waterLitAcre: 1000000, irrigations: 20, yieldQtlAcre: 200, msp: null, daysToMature: 300, season: 'All',    typicalCostAcre: 40000 },
  turmeric:   { name: 'Turmeric',         nameHi: 'हल्दी',       icon: '🟡', seedRateKgAcre: 800,   seedUnit: 'kg',  npkAcre: { N:60, P:50, K:120},waterLitAcre: 600000,  irrigations: 15, yieldQtlAcre: 80,  msp: null, daysToMature: 270, season: 'All',    typicalCostAcre: 28000 },
  chilli:     { name: 'Green Chilli',     nameHi: 'हरी मिर्च',  icon: '🌶️', seedRateKgAcre: 0.2,   seedUnit: 'kg',  npkAcre: { N:80, P:50, K:50 }, waterLitAcre: 500000,  irrigations: 12, yieldQtlAcre: 50,  msp: null, daysToMature: 90,  season: 'All',    typicalCostAcre: 22000 },
  garlic:     { name: 'Garlic',           nameHi: 'लहसुन',       icon: '🧄', seedRateKgAcre: 250,   seedUnit: 'kg',  npkAcre: { N:80, P:40, K:40 }, waterLitAcre: 450000,  irrigations: 12, yieldQtlAcre: 40,  msp: null, daysToMature: 150, season: 'Rabi',   typicalCostAcre: 30000 },
  paddy_basmati: { name: 'Basmati Paddy', nameHi: 'बासमती धान', icon: '🌾', seedRateKgAcre: 5,     seedUnit: 'kg',  npkAcre: { N:60, P:25, K:25 }, waterLitAcre: 1000000, irrigations: 18, yieldQtlAcre: 14,  msp: 2320, daysToMature: 140, season: 'Kharif', typicalCostAcre: 18000 },
};

// ── Fertilizer Products ───────────────────────────────────────────────────────
export const FERTILIZER_DATA = {
  urea:     { name: 'Urea (46% N)',        N: 46, P: 0,  K: 0,  bagKg: 50, pricePerBag: 267  },
  dap:      { name: 'DAP (18-46-0)',       N: 18, P: 46, K: 0,  bagKg: 50, pricePerBag: 1350 },
  mop:      { name: 'MOP/Potash (0-0-60)',  N: 0,  P: 0,  K: 60, bagKg: 50, pricePerBag: 950  },
  npk_mix:  { name: 'NPK 12-32-16',        N: 12, P: 32, K: 16, bagKg: 50, pricePerBag: 1400 },
  ssp:      { name: 'SSP (0-16-0)',         N: 0,  P: 16, K: 0,  bagKg: 50, pricePerBag: 400  },
};

// ── Labour Activities ─────────────────────────────────────────────────────────
export const LABOUR_ACTIVITIES = {
  ploughing:     { name: 'Ploughing (जुताई)',        icon: '🚜', pdAcre: 2   },
  sowing:        { name: 'Sowing (बुवाई)',            icon: '🌱', pdAcre: 2   },
  transplanting: { name: 'Transplanting (रोपाई)',    icon: '🌿', pdAcre: 10  },
  weeding:       { name: 'Weeding (निराई-गुड़ाई)',   icon: '🌿', pdAcre: 5   },
  fertilizing:   { name: 'Fertilizer Apply (खाद)', icon: '🧪', pdAcre: 1   },
  spraying:      { name: 'Spraying (छिड़काव)',        icon: '💦', pdAcre: 1.5 },
  harvesting:    { name: 'Harvesting (कटाई)',         icon: '🌾', pdAcre: 8   },
  threshing:     { name: 'Threshing (मड़ाई)',         icon: '⚙️', pdAcre: 3   },
  bagging:       { name: 'Bagging & Loading',         icon: '📦', pdAcre: 1.5 },
};

// ── Machinery Data ────────────────────────────────────────────────────────────
export const MACHINERY_DATA = {
  tractor:       { name: 'Tractor (35–55 HP)',      icon: '🚜', rateHr: 600,  acresHr: 1.5, fuelHr: 5   },
  rotavator:     { name: 'Rotavator',               icon: '⚙️', rateHr: 750,  acresHr: 1.2, fuelHr: 6   },
  cultivator:    { name: 'Cultivator',              icon: '🔧', rateHr: 550,  acresHr: 2.0, fuelHr: 4.5 },
  seed_drill:    { name: 'Seed Drill / Planter',    icon: '🌱', rateHr: 500,  acresHr: 2.0, fuelHr: 4   },
  harvester:     { name: 'Combine Harvester',       icon: '🌾', rateHr: 1800, acresHr: 2.5, fuelHr: 15  },
  sprayer_boom:  { name: 'Tractor Boom Sprayer',    icon: '💧', rateHr: 400,  acresHr: 3.0, fuelHr: 3.5 },
  thresher:      { name: 'Thresher',                icon: '⚙️', rateHr: 650,  acresHr: 1.0, fuelHr: 5   },
  power_tiller:  { name: 'Power Tiller',            icon: '🔧', rateHr: 350,  acresHr: 0.8, fuelHr: 2.5 },
  water_pump:    { name: 'Water Pump (5 HP)',        icon: '💧', rateHr: 150,  acresHr: null, fuelHr: 2  },
  plough:        { name: 'Disc / MB Plough',        icon: '🔧', rateHr: 500,  acresHr: 1.0, fuelHr: 5   },
  laser_leveller:{ name: 'Laser Land Leveller',     icon: '📐', rateHr: 900,  acresHr: 1.5, fuelHr: 8   },
  drone:         { name: 'Agricultural Drone',      icon: '🚁', rateHr: 1500, acresHr: 20,  fuelHr: 0   },
};

// ── Storage Types ─────────────────────────────────────────────────────────────
export const STORAGE_TYPES = {
  warehouse:    { name: 'Warehouse / Godown',        rateQtlMo: 25 },
  cold_storage: { name: 'Cold Storage',              rateQtlMo: 65 },
  farm_silo:    { name: 'On-Farm Silo / Bin',        rateQtlMo: 8  },
  wrs:          { name: 'WRS / WDRA Warehouse',       rateQtlMo: 30 },
};

// ── Calculation Functions ─────────────────────────────────────────────────────

/** Seed requirement */
export function calcSeed(cropKey, acres, customRate, seedPriceKg) {
  const crop = CROP_DATA[cropKey] || CROP_DATA.wheat;
  const rate = (parseFloat(customRate) > 0) ? parseFloat(customRate) : crop.seedRateKgAcre;
  const qty  = rate * acres;
  const cost = qty * (parseFloat(seedPriceKg) || 0);
  return { qty, cost, rate };
}

/** Fertilizer bags required */
export function calcFertilizer(cropKey, acres, practice, soilType) {
  const crop = CROP_DATA[cropKey] || CROP_DATA.wheat;
  const pm = { low: 0.75, balanced: 1.0, high_yield: 1.3, organic: 0.15 }[practice] || 1.0;
  const sm = { sandy: 1.15, loamy: 1.0, medium: 1.0, clay: 0.9, black: 0.85 }[soilType] || 1.0;
  const m  = pm * sm;

  const Nkg = crop.npkAcre.N * acres * m;
  const Pkg = crop.npkAcre.P * acres * m;
  const Kkg = crop.npkAcre.K * acres * m;

  const fd = FERTILIZER_DATA;
  const ureaBags = Math.ceil(Nkg / (fd.urea.N / 100 * fd.urea.bagKg));
  const dapBags  = Math.ceil(Pkg / (fd.dap.P  / 100 * fd.dap.bagKg));
  const mopBags  = Math.ceil(Kkg / (fd.mop.K  / 100 * fd.mop.bagKg));

  return {
    Nkg: Math.round(Nkg), Pkg: Math.round(Pkg), Kkg: Math.round(Kkg),
    ureaBags, dapBags, mopBags,
    ureaCost: ureaBags * fd.urea.pricePerBag,
    dapCost:  dapBags  * fd.dap.pricePerBag,
    mopCost:  mopBags  * fd.mop.pricePerBag,
    get totalCost() { return this.ureaCost + this.dapCost + this.mopCost; }
  };
}

/** Irrigation water requirement */
export function calcIrrigation(cropKey, acres, method, customCycles) {
  const crop     = CROP_DATA[cropKey] || CROP_DATA.wheat;
  const cycles   = parseFloat(customCycles) || crop.irrigations;
  const eff      = { drip: 0.5, sprinkler: 0.7, flood: 1.0 }[method] || 1.0;
  const totalLit = crop.waterLitAcre * eff * acres;
  const perCycle = totalLit / cycles;
  const rateAcre = { drip: 2800, sprinkler: 1800, flood: 700 }[method] || 1000;

  return {
    totalLit:     Math.round(totalLit),
    perCycleLit:  Math.round(perCycle),
    cycles,
    totalCost:    Math.round(rateAcre * acres),
    method
  };
}

/** Spray / pesticide */
export function calcSpray(acres, tankLit, dosePerLit, chemPriceLit, spraysCount) {
  const waterAcre   = 150; // standard liters per acre per spray
  const totalWater  = waterAcre * acres * spraysCount;
  const totalTanks  = Math.ceil(totalWater / tankLit);
  const totalChemLit= (totalWater * dosePerLit) / 1000;
  const totalCost   = totalChemLit * chemPriceLit;
  return { totalWater: Math.round(totalWater), totalTanks, totalChemLit: +totalChemLit.toFixed(2), totalCost: Math.round(totalCost) };
}

/** Labour requirement */
export function calcLabour(activityKey, acres, wageDay) {
  const act  = LABOUR_ACTIVITIES[activityKey] || LABOUR_ACTIVITIES.sowing;
  const days = act.pdAcre * acres;
  return { personDays: +days.toFixed(1), totalCost: Math.round(days * wageDay) };
}

/** Machinery cost */
export function calcMachinery(machineKey, acres, fuelPrice, operatorDayRate) {
  const m    = MACHINERY_DATA[machineKey] || MACHINERY_DATA.tractor;
  const hrs  = m.acresHr ? acres / m.acresHr : 0;
  const machCost  = hrs * m.rateHr;
  const fuelCost  = hrs * m.fuelHr * (parseFloat(fuelPrice) || 100);
  const opCost    = hrs * ((parseFloat(operatorDayRate) || 600) / 8);
  const total     = machCost + fuelCost + opCost;
  return { hrs: +hrs.toFixed(1), machCost: Math.round(machCost), fuelCost: Math.round(fuelCost), opCost: Math.round(opCost), total: Math.round(total), perAcre: acres > 0 ? Math.round(total / acres) : 0 };
}

/** EMI / loan */
export function calcLoan(principal, annualPct, months) {
  const r = annualPct / 100 / 12;
  if (r === 0 || months === 0) return { emi: principal / (months || 1), totalPayable: principal, totalInterest: 0 };
  const emi = principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
  return { emi, totalPayable: emi * months, totalInterest: emi * months - principal };
}

/** Storage cost */
export function calcStorage(qtl, months, typeKey) {
  const st = STORAGE_TYPES[typeKey] || STORAGE_TYPES.warehouse;
  return { monthly: qtl * st.rateQtlMo, total: qtl * st.rateQtlMo * months };
}

/** ROI */
export function calcROI(investment, revenue) {
  const profit = revenue - investment;
  const roi    = investment > 0 ? (profit / investment) * 100 : 0;
  return { profit, roi: +roi.toFixed(1) };
}
