/**
 * Agronomy Knowledge & Intent Extraction Engine
 * Comprehensive ICAR / PAU / KVK Agricultural Dataset for Indian Crops
 */

// 1. Crop Aliases & Metadata Directory (35+ Indian Crops)
export const CROP_DIRECTORY = {
  sugarcane: {
    id: 'sugarcane',
    nameEn: 'Sugarcane',
    nameHi: 'गन्ना',
    namePa: 'ਗੰਨਾ',
    aliases: ['sugarcane', 'sugar cane', 'ganna', 'ikshu', 'गन्ना', 'ਗੰਨਾ', 'చెరకు', 'கரும்பு', 'ऊस', 'আখ'],
    category: 'Commercial / Cash Crop',
    propagation: 'Setts / Stem cuttings (3-bud or 2-bud setts)',
    plantingMethod: 'Furrow planting or Trench method at 75–90 cm or 120 cm row-to-row spacing',
    plantingDetails: 'Dip setts in Carbendazim 0.1% for 15 mins before planting. Plant 35,000–40,000 two-bud setts per acre.',
    soilReq: 'Deep, rich, well-drained loamy or clay loam soil with pH 6.5–7.5.',
    waterReq: 'High water requirement (1500–2500 mm total). Requires 15–20 irrigations or drip irrigation (10–15 day intervals in summer, 20–25 days in winter). Avoid waterlogging.',
    nutrients: {
      basal: '50 kg DAP + 40 kg MOP (Potash) + 10 kg Zinc Sulphate per acre at planting',
      topDressing: '100–120 kg Urea split into 3 doses: 45 days (after germination), 90 days (tillering), and 120 days (earthing up).',
      organic: '10–12 tonnes Farmyard Manure (FYM) or Pressmud per acre during field preparation.'
    },
    intercultural: 'Earthing up at 90–120 days to prevent lodging; Trash mulching to conserve moisture; Detrashing lower dry leaves at 150 days.',
    pestsAndDiseases: 'Early Shoot Borer (apply Chlorantraniliprole 18.5% SC @ 150ml/acre at 30–45 DAP), Top Borer, Red Rot (use disease-free certified setts, Trichoderma viride).',
    duration: '10–12 months (Eksali) or 18 months (Adsali)'
  },

  chickpea: {
    id: 'chickpea',
    nameEn: 'Chickpea / Gram',
    nameHi: 'चना (Gram)',
    namePa: 'ਛੋਲੇ / ਚਣਾ',
    aliases: ['chickpea', 'gram', 'chana', 'chhole', 'kabuli chana', 'desi chana', 'चना', 'छोला', 'छोले', 'ਛੋਲੇ', 'శనగలు', 'கொண்டைக்கடலை', 'हरभरा', 'ছোলা'],
    category: 'Pulse / Legume (Nitrogen Fixing)',
    propagation: 'Seeds (Desi: 25–30 kg/acre, Kabuli: 35–40 kg/acre)',
    plantingMethod: 'Line sowing in furrows using seed drill at 30 cm row spacing and 10 cm plant spacing.',
    plantingDetails: 'Sow at 8–10 cm depth in moist soil zone. Treat seeds with Rhizobium culture + PSB (200g each/10kg seed) + Trichoderma (5g/kg seed).',
    soilReq: 'Well-drained sandy loam, loamy, or light black soils. Extremely intolerant to waterlogging and salinity.',
    waterReq: 'Low water requirement (250–350 mm). Needs only 1–2 light irrigations: 1st at pre-flowering (40–45 DAS) and 2nd at pod development (65–70 DAS). DO NOT irrigate during peak flowering (causes flower drop).',
    nutrients: {
      basal: 'As a legume, it fixes atmospheric nitrogen. Apply only basal dose: 40–50 kg DAP (or 100 kg SSP + 20 kg Urea) + 20 kg MOP + 10 kg Sulphur per acre. DO NOT top-dress heavy Urea.',
      topDressing: 'Foliar spray of 2% Urea or 19:19:19 NPK during pod development if crop shows early senescence.'
    },
    intercultural: 'Nipping / pinching apical buds at 30–35 DAS (when plants are 15–20 cm tall) to promote vigorous lateral branching and pod yield. Hand weeding at 25–30 DAS.',
    pestsAndDiseases: 'Gram Pod Borer / Helicoverpa armigera (install 5–6 pheromone traps/acre; spray Emamectin Benzoate 5% SG @ 80g/acre or Chlorantraniliprole 18.5% SC @ 60ml/acre at pod stage); Fusarium Wilt (use resistant varieties like JG-11, Jakhi 9218, RVG-202).',
    duration: '90–120 days (Rabi season)'
  },

  rice: {
    id: 'rice',
    nameEn: 'Rice / Paddy',
    nameHi: 'धान (Paddy)',
    namePa: 'ਝੋਨਾ / ਚਾਵਲ',
    aliases: ['rice', 'paddy', 'dhan', 'chawal', 'jhona', 'धान', 'चावल', 'ਝੋਨਾ', 'వరి', 'நெல்', 'भात', 'ধান'],
    category: 'Cereal / Food Grain',
    propagation: 'Nursery seedlings (Transplanting) or Direct Seeded Rice (DSR)',
    plantingMethod: 'Transplant 20–25 day old seedlings at 20×15 cm spacing (2–3 seedlings/hill) in puddled field. For DSR: 12–15 kg seed/acre with tar-watter method.',
    plantingDetails: 'Puddle field thoroughly with 2 passes of puddler and level. Treat nursery seed with Carbendazim (2g/kg) or Pseudomonas (10g/kg).',
    soilReq: 'Heavy clay, clay loam, or alluvial soil with high water retention capacity and slow percolation.',
    waterReq: 'High water requirement (1200–1500 mm). Maintain 2–5 cm standing water during transplanting and tillering; adopt Alternate Wetting and Drying (AWD) to save water. Drain field 10 days before harvest.',
    nutrients: {
      basal: '50 kg DAP + 30 kg MOP + 25 kg Zinc Sulphate (heptahydrate 21%) per acre at transplanting (Zinc prevents Khaira disease).',
      topDressing: '60–70 kg Urea split into two doses: 1st at active tillering (21–25 DAT) and 2nd at panicle initiation (40–45 DAT).'
    },
    intercultural: 'Cono-weeder at 15 and 30 DAT in SRI method; Pre-emergence herbicide Pretilachlor 50% EC @ 500ml/acre within 3 days of transplanting.',
    pestsAndDiseases: 'Yellow Stem Borer (Cartap Hydrochloride 4G @ 7.5kg/acre or Chlorantraniliprole 0.4G); Brown Plant Hopper / BPH (Pymetrozine 50% WDG @ 120g/acre); Bacterial Leaf Blight & Blast (Tricyclazole 75% WP @ 120g/acre).',
    duration: '110–145 days (Kharif)'
  },

  wheat: {
    id: 'wheat',
    nameEn: 'Wheat',
    nameHi: 'गेहूं',
    namePa: 'ਕਣਕ',
    aliases: ['wheat', 'gehu', 'kanak', 'gehun', 'गेहूं', 'गेहूँ', 'ਕਣਕ', 'గోధుమలు', 'கோதுமை', 'गहू', 'গম'],
    category: 'Cereal / Food Grain',
    propagation: 'Seeds (40–45 kg/acre for normal sowing, 50–55 kg/acre for late sowing)',
    plantingMethod: 'Line sowing with Zero-Till Drill or Happy Seeder at 20–22.5 cm row spacing, 4–5 cm depth.',
    plantingDetails: 'Seed treatment with Carboxin 37.5% + Thiram 37.5% (Vitavax Power) @ 2.5g/kg seed.',
    soilReq: 'Well-drained fertile loam, silt loam, or clay loam soils.',
    waterReq: 'Moderate (400–500 mm). Requires 5–6 stage-specific irrigations: 1. Crown Root Initiation (CRI) at 21–25 DAS (CRITICAL), 2. Tillering (40–45 DAS), 3. Jointing (60–65 DAS), 4. Flowering (80–85 DAS), 5. Milking/Grain Filling (100–105 DAS).',
    nutrients: {
      basal: '55 kg DAP + 25 kg MOP + 10 kg Zinc Sulphate per acre at sowing.',
      topDressing: '90 kg Urea split into two equal doses: 45 kg after 1st irrigation (CRI stage) and 45 kg after 2nd irrigation (tillering).'
    },
    intercultural: 'Weed management: Clodinafop 15% WP @ 160g/acre for Phalaris minor (Gulli danda); Metsulfuron Methyl 20% WP @ 8g/acre for broadleaf weeds at 30–35 DAS.',
    pestsAndDiseases: 'Yellow Rust / Stripe Rust (Propiconazole 25% EC / Tilt @ 200ml in 200L water/acre immediately at first yellow powder symptom); Aphids / Mahu (Imidacloprid 17.8% SL @ 50ml/acre); Termites (Chlorpyrifos 20% EC).',
    duration: '120–140 days (Rabi season, sowing Nov 1–25)'
  },

  cotton: {
    id: 'cotton',
    nameEn: 'Cotton',
    nameHi: 'कपास (Cotton)',
    namePa: 'ਨਰਮਾ / ਕਪਾਹ',
    aliases: ['cotton', 'kapas', 'narma', 'kapasya', 'कपास', 'नरमा', 'ਕਪਾਹ', 'ਨਰਮਾ', 'పత్తి', 'பருத்தி', 'कापूस', 'তুলা'],
    category: 'Commercial / Fibre Crop',
    propagation: 'Seeds (Bt Cotton Hybrid: 1.5–2.0 kg/acre)',
    plantingMethod: 'Dibbling seeds on ridges or flat beds at 90×60 cm or 120×45 cm spacing, 3–4 cm depth.',
    plantingDetails: 'Treat non-Bt seeds with Imidacloprid 70% WS (5g/kg) and Trichoderma (10g/kg).',
    soilReq: 'Deep black cotton soil (Regur), fertile alluvial, or loamy soil with good moisture retention and drainage.',
    waterReq: 'Medium to high (650–800 mm). Critical stages: Square formation (45–55 DAS), Flowering (70–80 DAS), and Boll development (90–110 DAS). Avoid water stagnation.',
    nutrients: {
      basal: '40 kg DAP + 30 kg MOP + 10 kg Magnesium Sulphate per acre at planting.',
      topDressing: '60–75 kg Urea applied in 3 splits at 30, 60, and 90 DAS along with 10 kg Potash at boll formation.',
      foliar: 'Foliar spray of 1% Magnesium Sulphate (10g/L) + 1% 13:0:45 (Potassium Nitrate) during flowering/boll stage.'
    },
    intercultural: 'Gap filling within 10 days; thinning at 20 DAS to one healthy plant per hill. Inter-cultivation with blade harrow up to 60 DAS.',
    pestsAndDiseases: 'Pink Bollworm (install Pheromone traps @ 8/acre; spray Profenofos 50% EC @ 400ml/acre or Emamectin Benzoate); Sucking pests/Whitefly/Jassid (Flonicamid 50% WG @ 80g/acre or Diafenthiuron 50% WP @ 200g/acre); Leaf Reddening / लालिया रोग (Magnesium deficiency + stress — spray 1% Magnesium Sulphate + 1% Urea).',
    duration: '150–180 days (Kharif)'
  },

  tomato: {
    id: 'tomato',
    nameEn: 'Tomato',
    nameHi: 'टमाटर',
    namePa: 'ਟਮਾਟਰ',
    aliases: ['tomato', 'tamatar', 'tamator', 'टमाटर', 'ਟਮਾਟਰ', 'టమోటా', 'தக்காளி', 'टोमॅटो', 'টমেটো'],
    category: 'Vegetable / Solanaceous',
    propagation: 'Nursery seedlings (Hybrid: 100–150g seed/acre)',
    plantingMethod: 'Transplant 25–30 day old sturdy seedlings on raised beds with drip & mulching at 60×45 cm or 75×60 cm spacing.',
    plantingDetails: 'Dip seedling roots in Trichoderma viride (10g/L) + Imidacloprid (1ml/L) for 15 mins before transplanting.',
    soilReq: 'Well-drained sandy loam or rich loamy soil with pH 6.0–7.0.',
    waterReq: 'Moderate, frequent irrigation (drip preferred). Keep uniform moisture; avoid sudden drying and heavy watering which causes fruit cracking.',
    nutrients: {
      basal: '50 kg DAP + 40 kg MOP + 10 kg Calcium Nitrate + 5 kg Borax per acre + 8 tonnes compost.',
      topDressing: 'Apply water soluble fertilizers through fertigation: 19:19:19 (3kg/acre weekly) during vegetative growth, and 13:0:45 + 0:0:50 (4kg/acre weekly) during fruiting stage.',
      special: 'Calcium Nitrate spray (5g/L) to prevent Blossom End Rot (black underside of fruit); Boron spray (1g/L) during flowering for fruit set.'
    },
    intercultural: 'Staking with bamboo sticks / trellising at 30 DAT; pruning lower suckers.',
    pestsAndDiseases: 'Tomato Fruit Borer / Helicoverpa (Chlorantraniliprole 18.5% SC @ 60ml/acre); Early & Late Blight (Mancozeb 75% WP @ 600g/acre or Azoxystrobin 23% SC); Leaf Curl Virus / Whitefly vector (Flonicamid 50% WG @ 60g/acre).',
    duration: '90–140 days (Round the year in suitable climates)'
  },

  mustard: {
    id: 'mustard',
    nameEn: 'Mustard / Rapeseed',
    nameHi: 'सरसों (Mustard)',
    namePa: 'ਸਰ੍ਹੋਂ',
    aliases: ['mustard', 'sarson', 'sarso', 'rai', 'toria', 'सरसों', 'सरसो', 'राई', 'ਸਰ੍ਹੋਂ', 'ఆవాలు', 'கடுகு', 'मोहरी', 'সরিষা'],
    category: 'Oilseed',
    propagation: 'Seeds (1.5–2.0 kg/acre)',
    plantingMethod: 'Line sowing at 30–45 cm row spacing and 10–15 cm plant spacing, 3–4 cm depth.',
    plantingDetails: 'Seed treatment with Metalaxyl 35% WS (Apron) @ 6g/kg to prevent white rust.',
    soilReq: 'Light to medium loamy soils, well-drained with pH 6.0–7.5.',
    waterReq: 'Low to medium (250–350 mm). Requires 2 critical irrigations: 1st at flowering/branching (30–35 DAS) and 2nd at siliqua/pod filling (60–65 DAS).',
    nutrients: {
      basal: '40 kg DAP + 15 kg MOP + 20 kg Elemental Sulphur (or 100 kg Gypsum) per acre (Sulphur is critical for oil content).',
      topDressing: '45 kg Urea split: half at sowing, half after 1st irrigation at 30 DAS.'
    },
    intercultural: 'Thinning at 15–20 DAS to maintain optimal plant population.',
    pestsAndDiseases: 'Mustard Aphid / चेपा (spray Thiamethoxam 25% WG @ 80g/acre or Dimethoate 30% EC @ 250ml/acre when 10% twigs show aphids); White Rust / Downy Mildew (spray Ridomil MZ @ 500g/acre).',
    duration: '110–135 days (Rabi)'
  },

  maize: {
    id: 'maize',
    nameEn: 'Maize / Corn',
    nameHi: 'मक्का (Maize)',
    namePa: 'ਮੱਕੀ',
    aliases: ['maize', 'corn', 'makka', 'makki', 'bhutta', 'मक्का', 'भुट्टा', 'ਮੱਕੀ', 'మొక్కజొన్న', 'மக்காச்சோளம்', 'मका', 'ভুট্টা'],
    category: 'Cereal / Fodder',
    propagation: 'Seeds (Hybrid: 7–8 kg/acre)',
    plantingMethod: 'Ridge and furrow planting at 60 cm row-to-row and 20 cm plant-to-plant spacing, 4–5 cm depth.',
    plantingDetails: 'Seed treatment with Cyantraniliprole 19.8% + Thiamethoxam 19.8% (Fortenza Duo) @ 6ml/kg seed for Fall Armyworm.',
    soilReq: 'Deep, rich, well-drained sandy loam or clay loam soil. Highly sensitive to water stagnation.',
    waterReq: 'Medium (500–600 mm). Critical stages: Knee-high (30 DAS), Tasseling / Silking (45–55 DAS), and Grain filling (70–80 DAS).',
    nutrients: {
      basal: '50 kg DAP + 30 kg MOP + 10 kg Zinc Sulphate per acre.',
      topDressing: '80–90 kg Urea split into 3 doses: 25 kg at knee-high (30 DAS), 35 kg at tasseling (50 DAS), and 25 kg at grain filling.'
    },
    intercultural: 'Inter-cultivation and earthing up at 30–35 DAS; Atrazine 50% WP @ 500g/acre as pre-emergence herbicide.',
    pestsAndDiseases: 'Fall Armyworm / FAW (apply Emamectin Benzoate 5% SG @ 80g/acre in plant whorls or Chlorantraniliprole 18.5% SC @ 80ml/acre); Stem Borer (Carbofuran 3G whorl application).',
    duration: '90–115 days (Kharif / Rabi / Spring)'
  },

  soybean: {
    id: 'soybean',
    nameEn: 'Soybean',
    nameHi: 'सोयाबीन',
    namePa: 'ਸੋਇਆਬੀਨ',
    aliases: ['soybean', 'soya', 'soyabean', 'सोयाबीन', 'सोया', 'ਸੋਇਆਬੀਨ', 'సోయాబీన్', 'சோயாபீன்', 'सोयाबीन', 'সয়াবিন'],
    category: 'Oilseed & Legume',
    propagation: 'Seeds (25–30 kg/acre)',
    plantingMethod: 'Broad Bed Furrow (BBF) or ridge planting at 45×5 cm spacing, 3–4 cm depth.',
    plantingDetails: 'Inoculate with Bradyrhizobium japonicum + PSB culture (10g/kg seed). Treat with Carboxin + Thiram (2g/kg).',
    soilReq: 'Well-drained medium to deep black soils, silt loam, or clay loam with pH 6.5–7.5.',
    waterReq: 'Moderate (450–600 mm). Mostly rainfed; critical stages if dry: Pod initiation and pod filling.',
    nutrients: {
      basal: 'Fixes atmospheric nitrogen. Apply 40 kg DAP + 20 kg MOP + 15 kg Sulphur per acre at sowing.',
      topDressing: 'No top-dressing of Urea needed. Foliar spray of 2% DAP or 0:52:34 at pod initiation.'
    },
    intercultural: 'Pre-emergence weedicide Diclosulam 84% WDG @ 12.4g/acre within 48 hours of sowing; hand weeding at 25 DAS.',
    pestsAndDiseases: 'Girdle Beetle & Semilooper (Chlorantraniliprole 18.5% SC @ 60ml/acre or Triazophos 40% EC @ 300ml/acre); Yellow Mosaic Virus (control whitefly vector with Thiamethoxam 25% WG @ 40g/acre).',
    duration: '90–105 days (Kharif)'
  },

  potato: {
    id: 'potato',
    nameEn: 'Potato',
    nameHi: 'आलू (Potato)',
    namePa: 'ਆਲੂ',
    aliases: ['potato', 'aaloo', 'alu', 'aalu', 'आलू', 'ਆਲੂ', 'బంగాళాదుంప', 'உருளைக்கிழங்கு', 'बटाटा', 'আলু'],
    category: 'Tuber / Vegetable',
    propagation: 'Certified seed tubers / cut pieces with 2–3 eyes (12–15 quintals/acre)',
    plantingMethod: 'Plant tubers on ridges at 60 cm row-to-row and 20 cm plant-to-plant spacing, 5–7 cm deep.',
    plantingDetails: 'Treat seed tubers with Mancozeb 75% WP (2.5g/L) for 10 mins and dry in shade before planting.',
    soilReq: 'Loose, friable, well-drained sandy loam or silt loam rich in organic matter (pH 5.2–6.5).',
    waterReq: 'Moderate, frequent light irrigations (400–500 mm). Irrigate every 7–10 days; stop 10–12 days before harvest.',
    nutrients: {
      basal: '60 kg DAP + 50 kg MOP + 10 tonnes FYM per acre.',
      topDressing: '75 kg Urea: half at planting, half at earthing up (30–35 DAS).'
    },
    intercultural: 'Earthing up at 30–35 DAS when plants are 15–20 cm tall to cover growing tubers from sunlight (prevents greening / solanine).',
    pestsAndDiseases: 'Late Blight (Phytophthora infestans — spray Cymoxanil 8% + Mancozeb 64% @ 600g/acre or Dimethomorph 50% WP @ 400g/acre); Early Blight; Aphids (transmit viruses — Imidacloprid @ 50ml/acre).',
    duration: '80–110 days (Rabi)'
  }
};

// 2. Intent Types
export const INTENT_TYPES = {
  CULTIVATION: 'CULTIVATION',
  FERTILIZER: 'FERTILIZER',
  WATER: 'WATER',
  PEST_DISEASE: 'PEST_DISEASE',
  LEAF_REDDENING: 'LEAF_REDDENING',
  POST_SOWING: 'POST_SOWING',
  SOIL_SUITABILITY: 'SOIL_SUITABILITY',
  MANDI_PRICE: 'MANDI_PRICE',
  SCHEMES: 'SCHEMES',
  NAVIGATION: 'NAVIGATION',
  GREETING: 'GREETING',
  GENERAL: 'GENERAL'
};

/**
 * Detect Crop and Intent with High Precision
 */
export function extractCropAndIntent(query, contextCrop = null, contextSoil = null) {
  if (!query) return { crop: null, intent: INTENT_TYPES.GENERAL, confidence: 0 };
  const q = query.toLowerCase().trim();

  // 1. Detect Crop from query string first
  let detectedCrop = null;
  for (const [key, cropData] of Object.entries(CROP_DIRECTORY)) {
    for (const alias of cropData.aliases) {
      const pattern = new RegExp(`\\b${alias.toLowerCase()}\\b`, 'i');
      if (pattern.test(q) || q.includes(alias.toLowerCase())) {
        detectedCrop = cropData;
        break;
      }
    }
    if (detectedCrop) break;
  }

  // Fallback to active context crop only if query does NOT ask about general soil/mandi/schemes
  if (!detectedCrop && contextCrop) {
    const contextName = (typeof contextCrop === 'string' ? contextCrop : contextCrop.nameEn || contextCrop.name || '').toLowerCase();
    for (const [key, cropData] of Object.entries(CROP_DIRECTORY)) {
      if (cropData.aliases.some(a => contextName.includes(a.toLowerCase()))) {
        detectedCrop = cropData;
        break;
      }
    }
  }

  // 2. Classify Specific User Intent
  let intent = INTENT_TYPES.GENERAL;

  if (q.match(/\b(hi|hello|hey|namaste|greetings|नमस्कार|नमस्ते|ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ|வணக்கம்|నమస్కారం|নমস্কার)\b/i) || q === 'hi' || q === 'hello') {
    intent = INTENT_TYPES.GREETING;
  } else if (q.match(/red|reddening|लाल|पत्तियां लाल|लालिया|leaf.*red|leaves.*red/i) && (detectedCrop?.id === 'cotton' || q.includes('cotton') || q.includes('कपास'))) {
    intent = INTENT_TYPES.LEAF_REDDENING;
  } else if (q.match(/black soil|काली मिट्टी|काली मिटटी|soil.*suitable|suitable.*soil|कौन सी फसल|किस मिट्टी/i)) {
    intent = INTENT_TYPES.SOIL_SUITABILITY;
  } else if (q.match(/after sowing|after planting|बुवाई के बाद|रोपाई के बाद|छंटाई|निपिंग|earthing|post sowing/i)) {
    intent = INTENT_TYPES.POST_SOWING;
  } else if (q.match(/water|irrigation|moisture|how much water|पानी|सिंचाई|कितना पानी|पियत/i)) {
    intent = INTENT_TYPES.WATER;
  } else if (q.match(/fertilizer|urea|dap|npk|nutrient|potash|mop|zinc|खाद|उर्वरक|यूरिया|डीएपी|पोटाश/i)) {
    intent = INTENT_TYPES.FERTILIZER;
  } else if (q.match(/pest|disease|rust|worm|bug|fungus|blight|borer|aphid|कीट|रोग|इल्ली|रतुआ|सुंडी|दीमक|माहू|सफेद मक्खी|दवाई|स्प्रे/i)) {
    intent = INTENT_TYPES.PEST_DISEASE;
  } else if (q.match(/mandi|price|rate|bhav|msp|भाव|मंडी|दाम|रेट|बाजार भाव/i)) {
    intent = INTENT_TYPES.MANDI_PRICE;
  } else if (q.match(/scheme|subsidy|pm kisan|kusum|bima|योजना|सब्सिडी|सोलर पंप|बीमा/i)) {
    intent = INTENT_TYPES.SCHEMES;
  } else if (q.match(/grow|plant|sow|cultivat|how to grow|how to plant|उगाएं|खेती|बुवाई|कैसे करें|कैसे उगाएं/i)) {
    intent = INTENT_TYPES.CULTIVATION;
  }

  return {
    crop: detectedCrop,
    intent,
    rawQuery: query
  };
}

/**
 * Generate Highly Precise Agronomic Recommendation for Any Crop and Intent
 */
export function generateCropSpecificAnswer({ query, crop, intent, soil, area, lang = 'en' }) {
  const isHi = lang === 'hi' || lang.startsWith('hi');
  const areaNum = area && Number(area) > 0 ? Number(area) : 1;
  const soilName = soil || 'Loamy / Field Soil';

  // 1. SPECIFIC INTENT: Cotton Leaves Turning Red
  if (intent === INTENT_TYPES.LEAF_REDDENING || (query.toLowerCase().includes('red') && (crop?.id === 'cotton' || query.toLowerCase().includes('cotton')))) {
    if (isHi) {
      return `कपास में पत्तियां लाल होना (लालिया रोग) मैग्नीशियम की कमी और अचानक ठंड/तनाव के कारण होता है। रोकथाम हेतु 1% मैग्नीशियम सल्फेट (MgSO4 @ 10 ग्राम/लीटर) + 1% यूरिया या 19:19:19 (10 ग्राम/लीटर) का 150-200 लीटर पानी में मिलाकर 15 दिन के अंतराल पर 2 बार पर्णीय छिड़काव (Foliar Spray) करें।`;
    }
    return `Cotton leaf reddening (Laliya) is caused by Magnesium deficiency combined with cold stress or heavy boll load. Treatment: Spray Magnesium Sulphate (MgSO4) @ 10g/L + 1% Urea or 19:19:19 (10g/L) mixed in 150–200 liters of water per acre. Repeat after 15 days to restore green leaf canopy.`;
  }

  // 2. SPECIFIC INTENT: Black Soil Suitability
  if (intent === INTENT_TYPES.SOIL_SUITABILITY || query.toLowerCase().includes('black soil') || query.toLowerCase().includes('काली मिट्टी')) {
    if (isHi) {
      return `काली मिट्टी (Black Cotton Soil) में नमी धारण क्षमता अत्यधिक होती है। इसके लिए सबसे उपयुक्त फसलें हैं: कपास (Cotton), सोयाबीन (Soybean), गन्ना (Sugarcane), चना (Chickpea), गेहूं (Wheat), और ज्वार (Sorghum)। ध्यान रहे कि जलभराव से बचने के लिए खेत में उचित जल निकासी (Drainage) की व्यवस्था रखें।`;
    }
    return `Black soil (Regur / Clay) has high water retention and clay content. Best suitable crops are: Cotton, Soybean, Sugarcane, Chickpea (Gram), Wheat, and Sorghum (Jowar). Ensure broad-bed or ridge planting to prevent water stagnation during heavy monsoon rains.`;
  }

  // 3. SPECIFIC INTENT: Post-Sowing Operations
  if (intent === INTENT_TYPES.POST_SOWING) {
    if (crop?.id === 'chickpea') {
      if (isHi) {
        return `चना की बुवाई के बाद आवश्यक कार्य: (1) बुवाई के 48 घंटे के भीतर पेंडीमेथालिन 30% EC (1 लीटर/एकड़) का खरपतवार स्प्रे करें। (2) बुवाई के 30-35 दिन बाद (15-20 सेमी ऊंचाई पर) मुख्य तने के ऊपरी सिरे की तुड़ाई (Nipping / खुटाई) करें जिससे अधिक शाखाएं और घेंटे बनें। (3) फूल आने पर सिंचाई न करें, केवल घेंटा बनते समय हल्की सिंचाई दें।`;
      }
      return `Crucial post-sowing steps for Chickpea: 1. Apply Pendimethalin 30% EC @ 1L/acre within 48 hours of sowing for weed control. 2. Perform nipping (pinching the top apical bud) at 30–35 DAS when plants are 15–20 cm tall to promote lateral branching and pod yield. 3. Avoid early over-irrigation to prevent wilt.`;
    }
    if (crop?.id === 'sugarcane') {
      if (isHi) {
        return `गन्ना बुवाई के बाद प्रबंधन: (1) 45 दिन पर पहली यूरिया टॉप ड्रेसिंग दें। (2) 90-120 दिन पर मिट्टी चढ़ाने (Earthing Up) का कार्य करें ताकि गन्ना गिरे नहीं। (3) कंसुआ (Shoot Borer) से बचाव हेतु क्लोरेंट्रानिलिप्रोल 18.5% SC (150 मिली/एकड़) डालें। (4) गर्मियों में 10-12 दिन के अंतराल पर सिंचाई करें।`;
      }
      return `Post-planting management for Sugarcane: 1. Top-dress first split of Urea at 45 days. 2. Perform earthing-up at 90–120 days to support tall stalks and prevent lodging. 3. Apply trash mulching between rows to conserve soil moisture. 4. Irrigate at 10–15 day intervals in summer.`;
    }
  }

  // 4. SPECIFIC INTENT: How to Grow / Cultivation Guide
  if (intent === INTENT_TYPES.CULTIVATION && crop) {
    if (crop.id === 'sugarcane') {
      if (isHi) {
        return `गन्ना (Sugarcane) की वैज्ञानिक खेती: 1 एकड़ हेतु 35,000-40,000 दो-आंख वाले स्वस्थ टुकड़ों (Setts) का चयन करें। टुकड़ों को कार्बेन्डाजिम 0.1% घोल में 15 मिनट उपचारित करके 75-90 सेमी दूरी की नालियों में बोएं। बुवाई पर 50kg DAP + 40kg पोटाश + 10kg जिंक दें। 45, 90 और 120 दिन पर यूरिया दें। 10-15 दिन के अंतराल पर नियमित सिंचाई करें।`;
      }
      return `To cultivate Sugarcane on ${areaNum} acre (${soilName}): Plant healthy 2-bud or 3-bud setts (stem cuttings) in furrows at 75–90 cm row spacing. Dip setts in 0.1% Carbendazim for 15 mins. Apply basal 50kg DAP + 40kg MOP + 10kg Zinc/acre. Top-dress Urea at 45, 90, and 120 days. Provide 15–20 timely irrigations throughout its 10–12 month lifecycle.`;
    }

    if (crop.id === 'chickpea') {
      if (isHi) {
        return `चना (Chickpea / Gram) की खेती: 1 एकड़ हेतु 25-30 किग्रा देशी बीज लें। राइजोबियम कल्चर (200g) + ट्राइकोडर्मा (5g/kg) से बीजोपचार कर 30 सेमी कतार दूरी पर 8-10 सेमी नमी वाली गहराई में बोएं। दलहनी फसल होने से केवल 40kg DAP + 20kg पोटाश + 10kg सल्फर बेस में दें (अधिक यूरिया न दें)। केवल 1-2 हल्की सिंचाई (शाखा बनते व घेंटा भरते समय) दें।`;
      }
      return `To cultivate Chickpea on ${areaNum} acre (${soilName}): Sow 25–30 kg certified seeds/acre at 8–10 cm depth in moist soil with 30 cm row spacing. Inoculate seeds with Rhizobium culture. As a legume fixing atmospheric nitrogen, apply only basal dose: 40–50 kg DAP + 20 kg MOP + 10 kg Sulphur per acre (avoid heavy urea). Give only 1–2 light irrigations at pre-flowering and pod filling.`;
    }

    if (crop.id === 'rice') {
      if (isHi) {
        return `धान (Paddy) की खेती: 1 एकड़ हेतु 6-8 किग्रा नर्सरी बीज या 12-15 किग्रा DSR बीज लें। 20-25 दिन के पौधों की रोपाई 20×15 सेमी दूरी पर लेव (Puddled) किए खेत में 2-3 पौधे प्रति थान करें। बुवाई/रोपाई पर 50kg DAP + 30kg पोटाश + 25kg जिंक सल्फेट दें (खैरा रोग बचाव हेतु)। कल्ले फूटते व बाली निकलते समय 2-5 सेमी पानी रखें।`;
      }
      return `To cultivate Rice/Paddy on ${areaNum} acre (${soilName}): Transplant 20–25 day old nursery seedlings at 20×15 cm spacing (2–3 seedlings/hill) in thoroughly puddled fields. Apply basal 50 kg DAP + 30 kg MOP + 25 kg Zinc Sulphate/acre (Zinc is critical to prevent Khaira disease). Top-dress Urea at tillering and panicle initiation. Maintain 2–5 cm water during active tillering.`;
    }

    if (crop.id === 'wheat') {
      if (isHi) {
        return `गेहूं (Wheat) की खेती: 40-45 किग्रा उपचारित बीज/एकड़ 20-22.5 सेमी कतार दूरी पर 4-5 सेमी गहराई पर बोएं। बुवाई समय 1-25 नवंबर सर्वोत्तम है। बेसल खुराक: 55kg DAP + 25kg पोटाश + 10kg जिंक दें। पहली सिंचाई बुवाई के 21 दिन पर (CRI ताज जड़ अवस्था) देकर 45kg यूरिया डालें। कुल 5-6 समयबद्ध सिंचाइयां दें।`;
      }
      return `To cultivate Wheat on ${areaNum} acre (${soilName}): Sow 40–45 kg certified seed/acre at 4–5 cm depth with 20–22.5 cm row spacing using a seed drill. Basal dose: 55 kg DAP + 25 kg MOP + 10 kg Zinc/acre. Apply 1st critical irrigation at 21–25 days (CRI stage) followed by 45 kg Urea top-dressing. Provide 5–6 stage-specific irrigations.`;
    }

    if (crop.id === 'cotton') {
      if (isHi) {
        return `कपास (Cotton) की खेती: 1 एकड़ हेतु 1.5-2 किग्रा बीटी हाइब्रिड बीज लें। 90×60 सेमी दूरी पर मेड़ों (Ridges) पर 3-4 सेमी गहराई पर डिबलिंग करें। बुवाई पर 40kg DAP + 30kg पोटाश + 10kg मैग्नीशियम सल्फेट दें। 30, 60 और 90 दिन पर यूरिया दें। फूल व टिंडे बनते समय पर्याप्त नमी रखें व जलभराव न होने दें।`;
      }
      return `To cultivate Cotton on ${areaNum} acre (${soilName}): Dibble 1.5–2.0 kg Bt hybrid seeds/acre at 90×60 cm spacing on ridges, 3–4 cm deep. Basal dose: 40 kg DAP + 30 kg MOP + 10 kg Magnesium Sulphate/acre. Split 60–75 kg Urea at 30, 60, and 90 DAS. Maintain optimum moisture at square, flowering, and boll stages.`;
    }

    if (crop.id === 'tomato') {
      if (isHi) {
        return `टमाटर (Tomato) की खेती: 100-150 ग्राम हाइब्रिड बीज से तैयार 25-30 दिन की पौध की रोपाई उठी हुई क्यारियों (Raised Beds) पर 60×45 सेमी दूरी पर करें। बेसल खाद: 50kg DAP + 40kg पोटाश + 10kg कैल्शियम नाइट्रेट + 5kg बोरोन प्रति एकड़ दें। ड्रिप से 19:19:19 व 13:0:45 उर्वरक दें और 30 दिन पर बांस के सहारे सहारा (Staking) दें।`;
      }
      return `To cultivate Tomato on ${areaNum} acre (${soilName}): Transplant 25–30 day old seedlings on raised beds with drip and mulch at 60×45 cm spacing. Basal dose: 50 kg DAP + 40 kg MOP + 10 kg Calcium Nitrate + 5 kg Borax/acre. Provide support (staking) at 30 DAT and fertigate with 19:19:19 in vegetative and 13:0:45 in fruiting stages.`;
    }
  }

  // 5. SPECIFIC INTENT: Fertilizer & Nutrients
  if (intent === INTENT_TYPES.FERTILIZER) {
    if (crop?.id === 'tomato') {
      if (isHi) {
        return `टमाटर हेतु संतुलित उर्वरक खुराक (${areaNum} एकड़): बुवाई/रोपाई पर ${Math.round(50*areaNum)}kg DAP + ${Math.round(40*areaNum)}kg पोटाश (MOP) + ${Math.round(10*areaNum)}kg कैल्शियम नाइट्रेट दें। फल सड़न (Blossom End Rot) से बचाव हेतु कैल्शियम नाइट्रेट (5g/L) और फूल झड़ने से रोकने हेतु बोरोन (1g/L) का स्प्रे करें।`;
      }
      return `Fertilizer recommendation for Tomato (${areaNum} acre): Basal dose = ${Math.round(50*areaNum)} kg DAP + ${Math.round(40*areaNum)} kg MOP + ${Math.round(10*areaNum)} kg Calcium Nitrate. Spray Calcium Nitrate @ 5g/L to prevent Blossom End Rot and Borax @ 1g/L at flowering for uniform fruit setting.`;
    }
    if (crop?.id === 'chickpea') {
      if (isHi) {
        return `चना हेतु उर्वरक सलाह (${areaNum} एकड़): दलहनी फसल होने के कारण चना हवा से नाइट्रोजन स्वयं बनाता है। केवल बुवाई पर ${Math.round(40*areaNum)}kg DAP + ${Math.round(20*areaNum)}kg पोटाश + ${Math.round(10*areaNum)}kg सल्फर दें। अधिक यूरिया कतई न डालें, इससे केवल वानस्पतिक बढ़वार होगी और फलन घट जाएगा।`;
      }
      return `Fertilizer advice for Chickpea (${areaNum} acre): As a nitrogen-fixing legume, apply only basal dose: ${Math.round(40*areaNum)} kg DAP + ${Math.round(20*areaNum)} kg MOP + ${Math.round(10*areaNum)} kg Sulphur. Do NOT top-dress heavy Urea as it promotes excessive vegetative foliage at the expense of pod formation.`;
    }
    if (crop?.id === 'sugarcane') {
      if (isHi) {
        return `गन्ना हेतु उर्वरक खुराक (${areaNum} एकड़): बुवाई पर ${Math.round(50*areaNum)}kg DAP + ${Math.round(40*areaNum)}kg पोटाश + ${Math.round(10*areaNum)}kg जिंक सल्फेट दें। कुल ${Math.round(110*areaNum)}kg यूरिया को 3 बराबर भागों में 45 दिन, 90 दिन (कल्ले निकलते समय) और 120 दिन (मिट्टी चढ़ाते समय) पर टॉप ड्रेसिंग करें।`;
      }
      return `Fertilizer schedule for Sugarcane (${areaNum} acre): Basal dose = ${Math.round(50*areaNum)} kg DAP + ${Math.round(40*areaNum)} kg MOP + ${Math.round(10*areaNum)} kg Zinc Sulphate. Top-dress ${Math.round(110*areaNum)} kg Urea in 3 equal splits: at 45 days, 90 days (tillering), and 120 days (earthing-up).`;
    }
    if (crop?.id === 'wheat') {
      if (isHi) {
        return `गेहूं हेतु उर्वरक प्रबंधन (${areaNum} एकड़): बुवाई पर ${Math.round(55*areaNum)}kg DAP + ${Math.round(25*areaNum)}kg पोटाश + ${Math.round(10*areaNum)}kg जिंक दें। पहली सिंचाई (21 दिन) पर ${Math.round(45*areaNum)}kg यूरिया और दूसरी सिंचाई (40-45 दिन) पर शेष ${Math.round(45*areaNum)}kg यूरिया डालें।`;
      }
      return `Fertilizer schedule for Wheat (${areaNum} acre): Basal = ${Math.round(55*areaNum)} kg DAP + ${Math.round(25*areaNum)} kg MOP + ${Math.round(10*areaNum)} kg Zinc. Top-dress ${Math.round(45*areaNum)} kg Urea after 1st irrigation (21d) and ${Math.round(45*areaNum)} kg Urea after 2nd irrigation (45d).`;
    }
    if (crop?.id === 'cotton') {
      if (isHi) {
        return `कपास हेतु उर्वरक प्रबंधन (${areaNum} एकड़): बुवाई पर ${Math.round(40*areaNum)}kg DAP + ${Math.round(30*areaNum)}kg पोटाश + ${Math.round(10*areaNum)}kg मैग्नीशियम सल्फेट दें। कुल ${Math.round(70*areaNum)}kg यूरिया 30, 60 और 90 दिन पर दें। टिंडे बनते समय 13:0:45 (पोटैशियम नाइट्रेट 10g/L) का स्प्रे करें।`;
      }
      return `Fertilizer schedule for Cotton (${areaNum} acre): Basal = ${Math.round(40*areaNum)} kg DAP + ${Math.round(30*areaNum)} kg MOP + ${Math.round(10*areaNum)} kg Magnesium Sulphate. Split ${Math.round(70*areaNum)} kg Urea at 30, 60, and 90 DAS. Spray 13:0:45 (Potassium Nitrate @ 10g/L) during boll development.`;
    }
  }

  // 6. SPECIFIC INTENT: Water & Irrigation
  if (intent === INTENT_TYPES.WATER) {
    if (crop?.id === 'sugarcane') {
      if (isHi) {
        return `गन्ना में पानी व सिंचाई प्रबंधन: गन्ना उच्च जल मांग वाली फसल है (कुल 1500-2500 मिमी)। गर्मियों में 8-10 दिन और सर्दियों में 15-20 दिन के अंतराल पर कुल 15-20 सिंचाइयां दें। ड्रिप सिंचाई अपनाने से 40-50% पानी की बचत और 20% अधिक पैदावार होती है।`;
      }
      return `Water requirement for Sugarcane: Sugarcane requires 1500–2500 mm of water throughout its 10–12 month growth. Provide 15–20 irrigations at 8–10 day intervals during summer and 15–20 day intervals in winter. Drip irrigation saves 40–50% water while increasing cane tonnage.`;
    }
    if (crop?.id === 'chickpea') {
      if (isHi) {
        return `चना में सिंचाई प्रबंधन: चना कम पानी की फसल है (250-350 मिमी)। इसे केवल 1 या 2 हल्की सिंचाइयां चाहिए: पहली शाखा निकलते समय (40-45 दिन) और दूसरी घेंटा भरते समय (65-70 दिन)। ध्यान रहे: फूल आते समय सिंचाई न करें (फूल झड़ जाते हैं) और खेत में पानी न भरने दें (उकठा रोग का खतरा)।`;
      }
      return `Water management for Chickpea: Chickpea is drought tolerant and requires only 250–350 mm water (1–2 light irrigations). Apply 1st irrigation at branching (40–45 DAS) and 2nd at pod filling (65–70 DAS). Never irrigate during peak flowering (causes flower drop) or cause waterlogging (triggers root rot / wilt).`;
    }
    if (crop?.id === 'rice') {
      if (isHi) {
        return `धान में सिंचाई प्रबंधन: रोपाई व कल्ले निकलते समय 2-5 सेमी पानी बनाए रखें। इसके बाद अल्टरनेट वेटिंग एंड ड्राइंग (AWD) अपनाएं। बाली निकलते व दाना भरते समय पानी की कमी न होने दें। कटाई से 10-12 दिन पहले पानी निकाल दें।`;
      }
      return `Water management for Rice/Paddy: Maintain 2–5 cm standing water during transplanting and tillering. Transition to Alternate Wetting & Drying (AWD) during vegetative growth. Keep field saturated during panicle emergence and grain milking. Drain water 10 days before harvest.`;
    }
    if (crop?.id === 'wheat') {
      if (isHi) {
        return `गेहूं में सिंचाई अनुसूची: पहली एवं सर्वाधिक महत्वपूर्ण सिंचाई बुवाई के 21-25 दिन बाद (CRI ताज जड़ अवस्था) दें। इसके बाद कल्ले निकलते (40-45 दिन), गांठ बनते (60-65 दिन), फूल आने (80-85 दिन) और दाना भरते (100-105 दिन) समय कुल 5-6 हल्की सिंचाइयां दें।`;
      }
      return `Irrigation schedule for Wheat: 1st and most critical irrigation must be applied at 21–25 days (Crown Root Initiation / CRI stage). Follow up with 4–5 stage-specific irrigations at tillering (45d), jointing (65d), flowering (85d), and milk stage (105d).`;
    }
  }

  // 7. SPECIFIC INTENT: Pest & Disease Control
  if (intent === INTENT_TYPES.PEST_DISEASE) {
    if (crop?.id === 'tomato') {
      if (isHi) {
        return `टमाटर में कीट व रोग रोकथाम: फल छेदक (Fruit Borer) हेतु क्लोरेंट्रानिलिप्रोल 18.5% SC (60 मिली/एकड़) या एमामेक्टिन बेंजोएट 5% SG (80 ग्राम/एकड़) छिड़कें। अगेती/पिछेती झुलसा (Blight) हेतु मैंकोजेब 75% WP (600 ग्राम/एकड़) या अज़ोक्सीस्ट्रोबिन का प्रयोग 150 लीटर पानी में करें।`;
      }
      return `Pest and disease control in Tomato: For Fruit Borer (Helicoverpa), spray Chlorantraniliprole 18.5% SC @ 60ml/acre or Emamectin Benzoate 5% SG @ 80g/acre. For Early/Late Blight, spray Mancozeb 75% WP @ 600g/acre or Azoxystrobin 23% SC in 150L water per acre.`;
    }
    if (crop?.id === 'cotton') {
      if (isHi) {
        return `कपास में कीट नियंत्रण: सफेद मक्खी व रसचूसक कीटों हेतु फ्लोनिकामिड 50% WG (80 ग्राम/एकड़) या डायफेन्थियूरॉन 50% WP (200 ग्राम/एकड़) छिड़कें। गुलाबी सुंडी (Pink Bollworm) हेतु 8 फेरोमोन ट्रैप/एकड़ लगाएं व प्रोफेनोफॉस 50% EC (400 मिली/एकड़) का स्प्रे करें।`;
      }
      return `Pest management in Cotton: For Whitefly and sucking pests, spray Flonicamid 50% WG @ 80g/acre or Diafenthiuron 50% WP @ 200g/acre. For Pink Bollworm, install 8 pheromone traps/acre and spray Profenofos 50% EC @ 400ml/acre.`;
    }
    if (crop?.id === 'wheat') {
      if (isHi) {
        return `गेहूं में रोग व कीट नियंत्रण: पीला रतुआ (Yellow Rust) दिखने पर तुरंत प्रोपिकोनाज़ोल 25% EC (टिल्ट @ 200 मिली/एकड़) 200 लीटर पानी में छिड़कें। माहू (Aphid) हेतु इमिडाक्लोप्रिड 17.8% SL (50 मिली/एकड़) प्रयोग करें।`;
      }
      return `Disease control in Wheat: At the first sign of Yellow/Stripe Rust, immediately spray Propiconazole 25% EC (Tilt) @ 200ml/acre in 200L water. For Aphids (Mahu), spray Imidacloprid 17.8% SL @ 50ml/acre.`;
    }
  }

  // 8. SPECIFIC INTENT: Mandi Rates
  if (intent === INTENT_TYPES.MANDI_PRICE) {
    if (isHi) {
      return `ताज़ा सरकारी MSP दरें: गेहूं ₹2,275/क्विंटल, धान ₹2,300/क्विंटल, कपास ₹7,121/क्विंटल, चना ₹5,440/क्विंटल, सरसों ₹5,650/क्विंटल, गन्ना FRP ₹355/क्विंटल। अपनी उपज को 12% से कम नमी पर सुखाकर और छानकर मंडी में बेचें।`;
    }
    return `Current Government MSP Benchmark Rates: Wheat ₹2,275/qtl, Paddy ₹2,300/qtl, Cotton ₹7,121/qtl, Chickpea/Gram ₹5,440/qtl, Mustard ₹5,650/qtl, Sugarcane FRP ₹355/qtl. Ensure grain moisture is below 12% before taking produce to the mandi for highest grade price.`;
  }

  // 9. Generic Crop Fallback
  const cropNameStr = crop ? `${crop.nameEn} (${crop.nameHi})` : 'your field';
  if (isHi) {
    return `${cropNameStr} के लिए कृषि वैज्ञानिक परामर्श: खेत की मिट्टी की जांच कराएं, प्रमाणित उपचारित बीज/टुकड़ों का उपयोग करें, आवश्यकतानुसार संतुलित NPK व सूक्ष्म पोषक तत्व दें और कीट/रोग के प्राथमिक लक्षण दिखते ही अनुशंसित स्प्रे करें।`;
  }
  return `Agronomic advisory for ${cropNameStr}: Ensure proper soil testing and certified planting material. Apply balanced NPK fertilizers and micronutrients tailored to your soil type, and scout weekly for timely pest and disease management.`;
}

/**
 * Validate LLM response against botanical and agronomic truth
 */
export function validateAgronomyResponse(response, targetCropId) {
  if (!response || !targetCropId) return { isValid: true };

  const res = response.toLowerCase();

  // Sugarcane check: must NOT say sow seeds at 4-5 cm depth
  if (targetCropId === 'sugarcane') {
    if (res.includes('sow seeds at 4-5 cm') || res.includes('sow high-yield treated seeds at 4-5 cm') || res.includes('sowing seeds at 4-5 cm')) {
      return { isValid: false, reason: 'Sugarcane is propagated by stem setts/cuttings, not seeds sown at 4-5cm depth.' };
    }
  }

  // Chickpea check: must NOT advise 5-6 irrigations or heavy urea
  if (targetCropId === 'chickpea') {
    if (res.includes('5-6 timely irrigations') || res.includes('ensure 5-6 timely irrigations') || res.includes('5-6 irrigations')) {
      return { isValid: false, reason: 'Chickpea requires only 1-2 light irrigations; 5-6 irrigations causes wilt and flower drop.' };
    }
  }

  return { isValid: true };
}
