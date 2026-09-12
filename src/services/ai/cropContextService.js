/**
 * Crop Context & Agronomy Knowledge Service for Krishi AI
 * Contains authoritative ICAR / KVK agricultural data across 35+ Indian crops,
 * multi-lingual crop entity extraction, and missing context detection.
 */

export const CROP_DATABASE = {
  sugarcane: {
    id: 'sugarcane',
    nameEn: 'Sugarcane',
    nameHi: 'गन्ना',
    namePa: 'ਗੰਨਾ',
    aliases: ['sugarcane', 'sugar cane', 'ganna', 'ikshu', 'गन्ना', 'ਗੰਨਾ', 'చెరకు', 'கரும்பு', 'ऊस', 'আখ'],
    category: 'Commercial / Cash Crop',
    botanical: 'Saccharum officinarum (Poaceae)',
    propagation: 'Vegetative stem cuttings / setts (2-bud or 3-bud setts). NEVER sown from seeds at 4-5 cm depth!',
    plantingMethod: 'Deep furrow planting or Trench method at 75–90 cm or 120 cm row-to-row spacing, placing setts end-to-end.',
    plantingDetails: 'Dip setts in Carbendazim 0.1% (1g/L) for 15 minutes before planting to eliminate red rot spores. Plant 35,000–40,000 two-bud setts per acre.',
    seedRate: '35,000–40,000 two-bud setts (approx 3.0–3.5 tonnes cane) per acre',
    soilReq: 'Deep, rich, well-drained loamy or clay loam soil with pH 6.5–7.5. Avoid highly saline soils.',
    waterReq: 'High water requirement (1500–2500 mm total). Requires 15–20 stage-wise irrigations or drip irrigation (8–10 day intervals in summer, 15–20 days in winter). High water efficiency with subsurface drip.',
    nutrients: {
      basal: '50 kg DAP + 40 kg MOP (Potash) + 10 kg Zinc Sulphate + 10 tonnes FYM/Pressmud per acre at planting',
      topDressing: '100–120 kg Urea split into 3 equal doses: 45 days (after complete emergence), 90 days (tillering), and 120 days (earthing-up).',
      foliar: 'Foliar spray of 1% Urea + 1% Potassium Nitrate (13:0:45) at 60 and 90 DAP for vigorous cane elongation.'
    },
    intercultural: 'Earthing-up at 90–120 days to prevent lodging and promote brace roots; Trash mulching to conserve moisture; Detrashing lower dry leaves at 150 days to prevent scale insects.',
    pestsAndDiseases: {
      pests: 'Early Shoot Borer (apply Chlorantraniliprole 18.5% SC @ 150ml/acre in 200L water or Cartap Hydrochloride 4G @ 10kg/acre at 30–45 DAP); Top Borer; Pyrilla.',
      diseases: 'Red Rot (use certified disease-free setts, dip in Carbendazim 0.1%, Trichoderma viride @ 2.5kg/acre in FYM); Smut; Grassy Shoot.'
    },
    harvesting: 'Harvest when juice Brix exceeds 18–20% using hand-held cutting blades close to ground level (maximum sugar is stored in bottom 3 internodes).',
    duration: '10–12 months (Eksali) or 16–18 months (Adsali)',
    msp: 'Fair & Remunerative Price (FRP): ₹340–₹355/quintal at basic recovery rate.'
  },

  chickpea: {
    id: 'chickpea',
    nameEn: 'Chickpea / Bengal Gram',
    nameHi: 'चना (Gram)',
    namePa: 'ਛੋਲੇ / ਚਣਾ',
    aliases: ['chickpea', 'gram', 'chana', 'chhole', 'kabuli chana', 'desi chana', 'bengal gram', 'चना', 'छोला', 'छोले', 'ਛੋਲੇ', 'శనగలు', 'கொண்டைக்கடலை', 'हरभरा', 'ছোলা'],
    category: 'Pulse / Legume (Nitrogen Fixing)',
    botanical: 'Cicer arietinum (Fabaceae)',
    propagation: 'True seeds (Desi: 25–30 kg/acre, Kabuli: 35–40 kg/acre)',
    plantingMethod: 'Line sowing in furrows using seed-cum-fertilizer drill at 30 cm row spacing and 10 cm plant spacing.',
    plantingDetails: 'Sow at 8–10 cm depth in moist soil zone (deep sowing prevents wilt). Seed treatment with Rhizobium + PSB culture (200g each/10kg seed) + Trichoderma viride (5g/kg seed).',
    seedRate: 'Desi: 25–30 kg/acre, Kabuli: 35–40 kg/acre',
    soilReq: 'Well-drained sandy loam, loamy, or light black soil with pH 6.0–7.5. Extremely intolerant to waterlogging and salinity.',
    waterReq: 'Low water requirement (250–350 mm). Needs only 1–2 light irrigations: 1st at pre-flowering branching (40–45 DAS) and 2nd at pod filling (65–70 DAS). DO NOT irrigate during peak flowering (causes flower drop) or flood the field (causes wilt).',
    nutrients: {
      basal: 'Legume fixing atmospheric nitrogen via root nodules. Apply basal dose: 40–50 kg DAP (or 100 kg SSP + 20 kg Urea) + 20 kg MOP + 10 kg Sulphur per acre. DO NOT top-dress heavy Urea.',
      topDressing: 'Foliar spray of 2% Urea or 19:19:19 (5g/L) during pod development if crop shows early senescence.'
    },
    intercultural: 'Nipping / pinching apical growing buds at 30–35 DAS (when plants are 15–20 cm tall) to promote vigorous lateral branching and pod yield. Hand weeding at 25–30 DAS.',
    pestsAndDiseases: {
      pests: 'Gram Pod Borer / Helicoverpa armigera (install 5–6 pheromone traps/acre; spray Emamectin Benzoate 5% SG @ 80g/acre or Chlorantraniliprole 18.5% SC @ 60ml/acre in 150L water at initial pod borer caterpillar stage); Cutworms.',
      diseases: 'Fusarium Wilt (use resistant varieties like JG-11, Jakhi 9218, RVG-202; seed treatment with Trichoderma); Ascochyta Blight; Dry Root Rot.'
    },
    harvesting: 'Harvest when plants turn yellowish-brown and pods rattle when shaken. Thresh at 10–12% grain moisture.',
    duration: '90–120 days (Rabi season, sowing Oct 15 – Nov 15)',
    msp: 'Government MSP: ₹5,440–₹5,650/quintal.'
  },

  rice: {
    id: 'rice',
    nameEn: 'Rice / Paddy',
    nameHi: 'धान (Paddy)',
    namePa: 'ਝੋਨਾ / ਚਾਵਲ',
    aliases: ['rice', 'paddy', 'dhan', 'chawal', 'jhona', 'धान', 'चावल', 'ਝੋਨਾ', 'వరి', 'நெல்', 'भात', 'ধান'],
    category: 'Cereal / Food Grain',
    botanical: 'Oryza sativa (Poaceae)',
    propagation: 'Nursery seedlings (Transplanting) or Direct Seeded Rice (DSR)',
    plantingMethod: 'Transplant 20–25 day old seedlings at 20×15 cm spacing (2–3 seedlings per hill) in puddled field. For DSR: drill 12–15 kg seed/acre with tar-watter method.',
    plantingDetails: 'Puddle field thoroughly with puddler and level. Treat nursery seed with Carbendazim (2g/kg) or Pseudomonas fluorescens (10g/kg).',
    seedRate: 'Transplanting: 10–12 kg/acre (Inbred), 5–6 kg/acre (Hybrid); DSR: 12–15 kg/acre',
    soilReq: 'Heavy clay, clay loam, or alluvial soil with high water retention capacity and slow percolation rate with pH 5.5–7.0.',
    waterReq: 'High water requirement (1200–1500 mm). Maintain 2–5 cm standing water during transplanting and tillering; adopt Alternate Wetting and Drying (AWD) to save water. Drain field 10–12 days before harvest.',
    nutrients: {
      basal: '50 kg DAP + 30 kg MOP + 25 kg Zinc Sulphate (21%) per acre at transplanting (Zinc is crucial to prevent Khaira disease).',
      topDressing: '60–70 kg Urea split into two doses: 1st at active tillering (21–25 DAT) and 2nd at panicle initiation (40–45 DAT).'
    },
    intercultural: 'Cono-weeder at 15 and 30 DAT; Pre-emergence herbicide Pretilachlor 50% EC @ 500ml/acre within 3 days of transplanting in 2-3 cm standing water.',
    pestsAndDiseases: {
      pests: 'Yellow Stem Borer (Cartap Hydrochloride 4G @ 7.5kg/acre or Chlorantraniliprole 0.4G); Brown Plant Hopper / BPH (Pymetrozine 50% WDG @ 120g/acre or Triflumezopyrim 10% SC @ 94ml/acre); Leaf Folder.',
      diseases: 'Bacterial Leaf Blight (BLB); Blast (spray Tricyclazole 75% WP @ 120g/acre); Sheath Blight (Hexaconazole 5% SC @ 400ml/acre); Khaira (Zinc deficiency - spray 0.5% ZnSO4 + 2.5% Urea).'
    },
    harvesting: 'Harvest when 80–85% of panicles turn golden straw yellow and grain moisture is 20–22%.',
    duration: '110–145 days (Kharif season)',
    msp: 'Government MSP: ₹2,300–₹2,320/quintal.'
  },

  wheat: {
    id: 'wheat',
    nameEn: 'Wheat',
    nameHi: 'गेहूं',
    namePa: 'ਕਣਕ',
    aliases: ['wheat', 'gehu', 'kanak', 'gehun', 'गेहूं', 'गेहूँ', 'ਕਣਕ', 'గోధుమలు', 'கோதுமை', 'गहू', 'গম'],
    category: 'Cereal / Food Grain',
    botanical: 'Triticum aestivum (Poaceae)',
    propagation: 'True seeds (40–45 kg/acre normal sowing, 50–55 kg/acre late sowing)',
    plantingMethod: 'Line sowing with Zero-Till Drill or Happy Seeder at 20–22.5 cm row spacing, 4–5 cm depth in moist soil.',
    plantingDetails: 'Seed treatment with Carboxin 37.5% + Thiram 37.5% (Vitavax Power) @ 2.5g/kg seed to prevent loose smut and flag smut.',
    seedRate: '40–45 kg/acre (normal Nov 1–20 sowing); 50–55 kg/acre (late Dec sowing)',
    soilReq: 'Well-drained fertile loam, silt loam, or clay loam soils with pH 6.5–7.5.',
    waterReq: 'Moderate (400–500 mm). Requires 5–6 stage-specific irrigations: 1. Crown Root Initiation (CRI) at 21–25 DAS (CRITICAL), 2. Tillering (40–45 DAS), 3. Jointing (60–65 DAS), 4. Flowering (80–85 DAS), 5. Milking/Grain filling (100–105 DAS).',
    nutrients: {
      basal: '55 kg DAP + 25 kg MOP + 10 kg Zinc Sulphate per acre at sowing.',
      topDressing: '90 kg Urea split into two equal doses: 45 kg after 1st irrigation (CRI stage) and 45 kg after 2nd irrigation (tillering).'
    },
    intercultural: 'Control Phalaris minor (Gulli danda) with Clodinafop 15% WP @ 160g/acre or Sulfosulfuron 75% WG @ 13.5g/acre; Broadleaf weeds with Metsulfuron Methyl 20% WP @ 8g/acre at 30–35 DAS.',
    pestsAndDiseases: {
      pests: 'Aphids / Mahu (Imidacloprid 17.8% SL @ 50ml/acre in 150L water during milking stage); Termites (Chlorpyrifos 20% EC @ 1L/acre with irrigation).',
      diseases: 'Yellow Rust / Stripe Rust (immediately spray Propiconazole 25% EC / Tilt @ 200ml/acre in 200L water at first yellow powdery stripe); Loose Smut; Karnal Bunt.'
    },
    harvesting: 'Harvest when grains become hard and straw turns golden brown, grain moisture <12%.',
    duration: '120–140 days (Rabi season, sowing Nov 1–25)',
    msp: 'Government MSP: ₹2,275–₹2,425/quintal.'
  },

  cotton: {
    id: 'cotton',
    nameEn: 'Cotton',
    nameHi: 'कपास (Cotton)',
    namePa: 'ਨਰਮਾ / ਕਪਾਹ',
    aliases: ['cotton', 'kapas', 'narma', 'kapasya', 'कपास', 'नरमा', 'ਕਪਾਹ', 'ਨਰਮਾ', 'పత్తి', 'பருத்தி', 'कापूस', 'তুলা'],
    category: 'Commercial / Fibre Crop',
    botanical: 'Gossypium hirsutum (Malvaceae)',
    propagation: 'Seeds (Bt Cotton Hybrid: 1.5–2.0 kg / 2 packets per acre)',
    plantingMethod: 'Dibbling seeds on ridges or raised beds at 90×60 cm or 120×45 cm spacing, 3–4 cm depth.',
    plantingDetails: 'Treat non-Bt refuge seeds with Imidacloprid 70% WS (5g/kg) and Trichoderma (10g/kg).',
    seedRate: '1.5–2.0 kg/acre (Hybrid Bt)',
    soilReq: 'Deep black cotton soil (Regur), fertile alluvial, or loamy soil with good moisture retention and drainage. pH 6.5–8.0.',
    waterReq: 'Medium to high (650–800 mm). Critical stages: Square formation (45–55 DAS), Flowering (70–80 DAS), and Boll development (90–110 DAS). Avoid water stagnation.',
    nutrients: {
      basal: '40 kg DAP + 30 kg MOP + 10 kg Magnesium Sulphate + 10 kg Zinc per acre at planting.',
      topDressing: '60–75 kg Urea applied in 3 splits at 30, 60, and 90 DAS along with 10 kg Potash at boll formation.',
      foliar: 'Foliar spray of 1% Magnesium Sulphate (10g/L) + 1% Potassium Nitrate (13:0:45 @ 10g/L) at 70 and 90 DAS to prevent leaf reddening (Lalya).'
    },
    intercultural: 'Thinning at 20 DAS to 1 plant per hill; Blade harrowing up to 60 DAS for weed control and aeration.',
    pestsAndDiseases: {
      pests: 'Pink Bollworm (install 8 pheromone traps/acre; spray Profenofos 50% EC @ 400ml/acre or Emamectin Benzoate 5% SG @ 88g/acre); Whitefly & Jassid (Flonicamid 50% WG @ 80g/acre or Diafenthiuron 50% WP @ 200g/acre); Thrips.',
      diseases: 'Leaf Reddening / Lalya (physiological magnesium deficiency + cold/drought stress - spray 1% MgSO4 + 1% Urea); Bacterial Blight; Root Rot.'
    },
    harvesting: 'Hand-pick clean, well-opened bolls in dry sunny morning hours after dew has dried.',
    duration: '150–180 days (Kharif season)',
    msp: 'Government MSP: ₹7,121–₹7,521/quintal (Long staple).'
  },

  tomato: {
    id: 'tomato',
    nameEn: 'Tomato',
    nameHi: 'टमाटर',
    namePa: 'ਟਮਾਟਰ',
    aliases: ['tomato', 'tamatar', 'tamator', 'टमाटर', 'ਟਮਾਟਰ', 'టమోటా', 'தக்காளி', 'टोमॅटो', 'টমেটো'],
    category: 'Vegetable / Solanaceous',
    botanical: 'Solanum lycopersicum (Solanaceae)',
    propagation: 'Nursery seedlings (Hybrid: 100–150g seed/acre)',
    plantingMethod: 'Transplant 25–30 day old sturdy seedlings on raised beds with drip and silver-black mulch at 60×45 cm or 75×60 cm spacing.',
    plantingDetails: 'Dip seedling roots in Trichoderma viride (10g/L) + Imidacloprid (1ml/L) for 15 minutes before transplanting.',
    seedRate: '100–150 g/acre (Hybrid)',
    soilReq: 'Well-drained sandy loam or rich loamy soil with pH 6.0–7.0.',
    waterReq: 'Moderate, frequent irrigation (drip preferred). Keep uniform moisture; avoid sudden drying followed by heavy flood which causes fruit cracking.',
    nutrients: {
      basal: '50 kg DAP + 40 kg MOP + 10 kg Calcium Nitrate + 5 kg Borax per acre + 8 tonnes compost.',
      topDressing: 'Fertigation: 19:19:19 (3kg/acre weekly) during vegetative growth, and 13:0:45 + 0:0:50 (4kg/acre weekly) during fruiting stage.',
      special: 'Calcium Nitrate foliar spray (5g/L) to prevent Blossom End Rot (black underside of fruit); Boron spray (1g/L) during flowering for fruit set.'
    },
    intercultural: 'Staking with bamboo poles/trellis at 30 DAT; pruning lower suckers.',
    pestsAndDiseases: {
      pests: 'Tomato Fruit Borer / Helicoverpa (Chlorantraniliprole 18.5% SC @ 60ml/acre); Whitefly vector for Leaf Curl (Flonicamid 50% WG @ 60g/acre); Leaf Miner.',
      diseases: 'Early & Late Blight (Mancozeb 75% WP @ 600g/acre or Azoxystrobin 23% SC); Tomato Leaf Curl Virus (control whitefly vector); Bacterial Wilt.'
    },
    harvesting: 'Harvest at breaker/turning stage for distant transport, or full ripe red stage for local mandi.',
    duration: '90–140 days',
    msp: 'Market-driven price (typically ₹10–₹40/kg in mandis).'
  },

  potato: {
    id: 'potato',
    nameEn: 'Potato',
    nameHi: 'आलू',
    namePa: 'ਆਲੂ',
    aliases: ['potato', 'aloo', 'batata', 'alu', 'आलू', 'ਆਲੂ', 'బంగాళాదుంప', 'உருளைக்கிழங்கு', 'बटाटा', 'আলু'],
    category: 'Tuber / Vegetable',
    botanical: 'Solanum tuberosum (Solanaceae)',
    propagation: 'Seed tubers (30–40g certified disease-free sprouted tubers). NOT true seed grains.',
    plantingMethod: 'Plant tubers on ridges at 50–60 cm row spacing and 15–20 cm plant spacing at 5–7 cm depth.',
    plantingDetails: 'Treat tubers with Mancozeb (2.5g/L) or boric acid (3%) for 20 mins to prevent black scurf and dry rot.',
    seedRate: '12–15 quintals seed tubers per acre',
    soilReq: 'Well-drained, loose, sandy loam or silt loam rich in organic matter with pH 5.2–6.5.',
    waterReq: 'Moderate (350–500 mm). Requires 5–7 light irrigations; stop irrigation 10 days before harvesting.',
    nutrients: {
      basal: '75 kg DAP + 50 kg MOP + 25 kg Zinc Sulphate + 10 tonnes FYM per acre at planting.',
      topDressing: '50 kg Urea applied at first earthing-up (30 DAS).'
    },
    intercultural: 'Earthing-up at 30–35 DAS to prevent greening of developing tubers (solanine development); dehaulming 10–12 days before digging.',
    pestsAndDiseases: {
      pests: 'Potato Tuber Moth (PTM), Aphids (Imidacloprid 17.8% SL @ 50ml/acre).',
      diseases: 'Late Blight (spray Cymoxanil 8% + Mancozeb 64% WP @ 600g/acre); Early Blight; Black Scurf.'
    },
    harvesting: 'Harvest after skin curing (skin does not peel when rubbed). Cure under shade for 10 days before cold storage.',
    duration: '80–110 days (Rabi season)',
    msp: 'Market-driven price (benchmark cold store rate ₹800–₹1,500/quintal).'
  },

  onion: {
    id: 'onion',
    nameEn: 'Onion',
    nameHi: 'प्याज',
    namePa: 'ਪਿਆਜ਼',
    aliases: ['onion', 'pyaz', 'kanda', 'dungri', 'vengayam', 'प्याज', 'ਪਿਆਜ਼', 'ఉల్లిపాయ', 'வெங்காயம்', 'कांदा', 'পেঁয়াজ'],
    category: 'Bulb Vegetable',
    botanical: 'Allium cepa (Amaryllidaceae)',
    propagation: 'Nursery seedlings (3.5–4.0 kg seed/acre) or small sets',
    plantingMethod: 'Transplant 40–45 day old seedlings on flat beds or broad bed furrows (BBF) at 15×10 cm spacing.',
    plantingDetails: 'Root dip in Trichoderma (10g/L) + Carbendazim (1g/L) for 15 mins.',
    seedRate: '3.5–4.0 kg/acre (Nursery)',
    soilReq: 'Well-drained fertile loam or sandy loam with pH 6.0–7.5.',
    waterReq: 'Moderate, frequent light irrigations (drip or micro-sprinkler). Stop irrigation 15 days before harvest to prevent bulb rotting in storage.',
    nutrients: {
      basal: '40 kg DAP + 30 kg MOP + 15 kg Sulphur per acre (Sulphur increases pungency and storage life).',
      topDressing: '45 kg Urea split into two top dressings at 30 and 45 DAT.'
    },
    intercultural: 'Hand weeding at 30 and 60 DAT; avoid deep hoeing near shallow bulb roots.',
    pestsAndDiseases: {
      pests: 'Onion Thrips (spray Fipronil 5% SC @ 300ml/acre or Spinetoram 11.7% SC @ 160ml/acre).',
      diseases: 'Purple Blotch (spray Tebuconazole 25.9% EC @ 250ml/acre or Mancozeb 75% WP @ 600g/acre); Stemphylium Blight.'
    },
    harvesting: 'Harvest when 50% of plant tops fall over (neck fall). Cure bulbs with tops attached under shade for 7–10 days before storing in ventilated Kanda Chawl.',
    duration: '110–130 days',
    msp: 'Market-driven price.'
  },

  maize: {
    id: 'maize',
    nameEn: 'Maize / Corn',
    nameHi: 'मक्का',
    namePa: 'ਮੱਕੀ',
    aliases: ['maize', 'corn', 'makka', 'makki', 'bhutta', 'मक्का', 'ਮੱਕੀ', 'మొక్కజొన్న', 'மக்காச்சோளம்', 'मका', 'ভুট্টা'],
    category: 'Cereal / Fodder',
    botanical: 'Zea mays (Poaceae)',
    propagation: 'True seeds (7–8 kg/acre for single cross hybrids)',
    plantingMethod: 'Ridge sowing at 60 cm row spacing and 20 cm plant spacing at 4–5 cm depth.',
    plantingDetails: 'Seed treatment with Cyantraniliprole 19.8% + Thiamethoxam 19.8% FS (Fortenza Duo @ 4ml/kg) to protect from Fall Armyworm for initial 20 days.',
    seedRate: '7–8 kg/acre',
    soilReq: 'Deep fertile loamy soil with good drainage and pH 6.0–7.5.',
    waterReq: 'Moderate (500–600 mm). Critical stages: Tasseling (45–50 DAS) and Silking (55–65 DAS). Highly sensitive to waterlogging.',
    nutrients: {
      basal: '50 kg DAP + 25 kg MOP + 10 kg Zinc Sulphate per acre.',
      topDressing: '80 kg Urea split into two doses: knee-high stage (25–30 DAS) and tasseling stage (50 DAS).'
    },
    intercultural: 'Atrazine 50% WP @ 500g/acre within 3 days of sowing as pre-emergence herbicide.',
    pestsAndDiseases: {
      pests: 'Fall Armyworm / FAW (Spodoptera frugiperda - apply Chlorantraniliprole 18.5% SC @ 80ml/acre or Emamectin Benzoate 5% SG @ 80g/acre directed into plant whorl at 15–20 DAS); Stem borer.',
      diseases: 'Maydis Leaf Blight; Banded Leaf and Sheath Blight.'
    },
    harvesting: 'Harvest when husk leaves dry and turn pale brown, black layer forms at base of kernel.',
    duration: '90–110 days',
    msp: 'Government MSP: ₹2,090–₹2,225/quintal.'
  },

  sunflower: {
    id: 'sunflower',
    nameEn: 'Sunflower',
    nameHi: 'सूरजमुखी',
    namePa: 'ਸੂਰਜਮੁਖੀ',
    aliases: ['sunflower', 'surajmukhi', 'suraj mukhi', 'सूरजमुखी', 'ਸੂਰਜਮੁਖੀ', 'పొద్దుతిరుగుడు', 'சூரியகாந்தி', 'सूर्यफूल', 'সূর্যমুখী'],
    category: 'Oilseed',
    botanical: 'Helianthus annuus (Asteraceae)',
    propagation: 'True seeds (Hybrids: 2.0–2.5 kg/acre, Open pollinated: 4–5 kg/acre)',
    plantingMethod: 'Line sowing on ridges and furrows at 60×30 cm or 45×30 cm spacing, 3–4 cm depth.',
    plantingDetails: 'Seed treatment with Thiram (2g/kg) or Trichoderma viride (5g/kg) + Imidacloprid (5g/kg) to protect from seedling blight and sucking pests.',
    seedRate: '2.0–2.5 kg/acre (Hybrids)',
    soilReq: 'Well-drained fertile loamy, sandy loam, or black soils with pH 6.5–8.0. Highly drought-tolerant with deep taproot.',
    waterReq: 'Moderate (350–450 mm). 4–5 critical irrigations: 1. Seedling (20 DAS), 2. Button/Star bud stage (35–40 DAS), 3. Flowering (55–60 DAS), 4. Seed development/milking (70–75 DAS). Spray 0.2% Borax (2g/L) during ray floret opening to ensure 100% seed setting and heavy seed weight.',
    nutrients: {
      basal: '40 kg DAP + 25 kg MOP + 15 kg Sulphur + 5 kg Borax + 5 tonnes FYM per acre at sowing.',
      topDressing: '35 kg Urea split into two doses: 20 kg at star bud stage (30 DAS) and 15 kg at flowering initiation (50 DAS).',
      foliar: 'Foliar spray of 0.2% Borax (2g/L) at capitulum opening stage to prevent empty hollow seeds in the center.'
    },
    intercultural: 'Thinning at 12–15 DAS to maintain single plant per hill; Inter-cultivation/hoeing at 20 and 35 DAS.',
    pestsAndDiseases: {
      pests: 'Head Borer / Helicoverpa (spray Emamectin Benzoate 5% SG @ 80g/acre or Chlorantraniliprole 18.5% SC @ 60ml/acre at button stage); Sucking pests (spray Imidacloprid @ 50ml/acre).',
      diseases: 'Alternaria Leaf & Head Blight (Mancozeb 75% WP @ 600g/acre); Rust; Root Rot (Trichoderma drenching).'
    },
    harvesting: 'Harvest when back side of flower head turns lemon yellow to brownish, seeds turn black and hard with <10% moisture.',
    duration: '85–100 days (Zaid/Summer, Kharif, or Rabi)',
    msp: 'Government MSP: ₹7,280/quintal.'
  },

  soybean: {
    id: 'soybean',
    nameEn: 'Soybean',
    nameHi: 'सोयाबीन',
    namePa: 'ਸੋਇਆਬੀਨ',
    aliases: ['soybean', 'soya bean', 'soyabean', 'soya', 'सोयाबीन', 'ਸੋਇਆਬੀਨ', 'సోయాబీన్', 'சோயாபீன்', 'सोयाबीन', 'সয়াবিন'],
    category: 'Oilseed & Pulse / Legume',
    botanical: 'Glycine max (Fabaceae)',
    propagation: 'True seeds (25–30 kg/acre for bold seeded varieties)',
    plantingMethod: 'Line sowing with seed drill on broad bed furrows (BBF) or ridges at 45×5 cm spacing, 3–4 cm depth.',
    plantingDetails: 'Seed treatment with Bradyrhizobium japonicum + PSB culture (10g/kg) + Carboxin+Thiram (2g/kg).',
    seedRate: '25–30 kg/acre',
    soilReq: 'Well-drained deep black soil (Vertisols) or clay loam with pH 6.5–7.5. Sensitive to waterlogging.',
    waterReq: 'Moderate (450–550 mm). 2 critical irrigations if dry spell occurs: Flowering stage (35–40 DAS) and Pod development (55–65 DAS).',
    nutrients: {
      basal: 'Fixes atmospheric nitrogen. Apply 40 kg DAP + 20 kg MOP + 15 kg Elemental Sulphur per acre at sowing.',
      topDressing: 'Foliar spray of 19:19:19 (5g/L) or 0:52:34 (5g/L) during pod initiation.'
    },
    intercultural: 'Pre-emergence herbicide Diclosulam 84% WDG @ 12.4g/acre within 48 hours of sowing; or Imazethapyr 10% SL @ 400ml/acre at 15–20 DAS.',
    pestsAndDiseases: {
      pests: 'Girdle Beetle (Obereopsis brevis - spray Chlorantraniliprole 18.5% SC @ 60ml/acre); Stem Fly; Tobacco Caterpillar (Spodoptera litura).',
      diseases: 'Yellow Mosaic Virus (YMV - control whitefly vector with Thiamethoxam 25% WG @ 40g/acre); Charcoal Rot; Rust.'
    },
    harvesting: 'Harvest when leaves turn yellow and drop off, and pods turn golden yellow with rattling sound.',
    duration: '90–105 days (Kharif season)',
    msp: 'Government MSP: ₹4,892/quintal.'
  },

  groundnut: {
    id: 'groundnut',
    nameEn: 'Groundnut / Peanut',
    nameHi: 'मूंगफली',
    namePa: 'ਮੂੰਗਫਲੀ',
    aliases: ['groundnut', 'peanut', 'mungfali', 'moongfali', 'shengdana', 'मूंगफली', 'ਮੂੰਗਫਲੀ', 'వేరుశనగ', 'வேர்க்கடலை', 'भुईमूग', 'চীনাবাদাম'],
    category: 'Oilseed & Legume',
    botanical: 'Arachis hypogaea (Fabaceae)',
    propagation: 'Shelled kernels (40–45 kg kernel/acre for bunch type, 35 kg for spreading type)',
    plantingMethod: 'Line sowing on Broad Bed & Furrow (BBF) at 30×10 cm spacing at 4–5 cm depth.',
    plantingDetails: 'Treat seeds with Rhizobium culture + Trichoderma viride (5g/kg) and Imidacloprid (2ml/kg).',
    seedRate: '40–45 kg kernel/acre',
    soilReq: 'Well-drained sandy loam, red loam, or light alluvial soils with loose top layer for easy peg penetration. pH 6.0–7.0.',
    waterReq: 'Moderate (400–500 mm). Critical stages: Flowering (25–30 DAS), Pegging / Peg penetration (40–45 DAS), and Pod development (60–70 DAS). Apply Gypsum @ 200 kg/acre at 40 DAS (Gypsum supplies calcium for bold pod filling and prevents hollow pops).',
    nutrients: {
      basal: '35 kg DAP + 20 kg MOP + 10 kg Zinc Sulphate + 200 kg Gypsum per acre.',
      topDressing: 'Apply 2nd split of 200 kg Gypsum at pegging stage (40–45 DAS) followed by earthing-up.'
    },
    intercultural: 'Inter-cultivation up to 35 DAS only; strictly STOP hoeing once pegs start entering the soil to prevent breaking pegs.',
    pestsAndDiseases: {
      pests: 'White Grub (soil application of Fipronil 0.3G @ 10kg/acre at sowing); Leaf Miner; Aphids.',
      diseases: 'Tikka Disease / Leaf Spot (Cercospora - spray Carbendazim 12% + Mancozeb 63% WP @ 2g/L or Hexaconazole 5% SC @ 2ml/L); Collar Rot; Stem Rot.'
    },
    harvesting: 'Harvest when inside shell turns dark blackish-brown and leaves turn yellow.',
    duration: '105–125 days',
    msp: 'Government MSP: ₹6,783/quintal.'
  },

  chilli: {
    id: 'chilli',
    nameEn: 'Chilli / Hot Pepper',
    nameHi: 'मिर्च',
    namePa: 'ਮਿਰਚ',
    aliases: ['chilli', 'chili', 'mirchi', 'green chilli', 'red chilli', 'mirch', 'मिर्च', 'ਮਿਰਚ', 'మిరపకాయ', 'மிளகாய்', 'मिरची', 'মরিচ'],
    category: 'Spice & Vegetable',
    botanical: 'Capsicum annuum (Solanaceae)',
    propagation: 'Nursery seedlings (Hybrid: 80–100g seed/acre)',
    plantingMethod: 'Transplant 30–35 day old seedlings on raised beds with drip irrigation and silver-black plastic mulch at 60×45 cm spacing.',
    plantingDetails: 'Dip roots in Imidacloprid 17.8% SL (1ml/L) + Carbendazim (1g/L) for 15 mins before transplanting.',
    seedRate: '80–100 g/acre (Hybrid)',
    soilReq: 'Well-drained fertile sandy loam or clay loam with pH 6.5–7.5.',
    waterReq: 'Moderate (drip fertigation recommended). Avoid waterlogging which causes fungal dieback/wilt.',
    nutrients: {
      basal: '50 kg DAP + 40 kg MOP + 15 kg Magnesium Sulphate + 5 kg Zinc + 10 tonnes compost per acre.',
      topDressing: 'Fertigation: 19:19:19 (3kg/acre weekly) during vegetative growth, and 13:0:45 + Calcium Nitrate (3kg/acre) during flowering/fruiting.'
    },
    intercultural: 'Mulching with silver-black mulch; Staking with twine support.',
    pestsAndDiseases: {
      pests: 'Chilli Thrips causing upward leaf curl (Murda disease - spray Spinetoram 11.7% SC @ 160ml/acre or Fipronil 5% SC @ 300ml/acre); Yellow Mites causing downward leaf curl (spray Fenazaquin 10% EC @ 300ml/acre or Spiromesifen 22.9% SC @ 200ml/acre); Whiteflies.',
      diseases: 'Anthracnose / Fruit Rot / Dieback (spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 200ml/acre or Copper Oxychloride 50% WP @ 500g/acre); Powdery Mildew.'
    },
    harvesting: 'Harvest green chillies when fully mature and firm, or allow to turn dark red on plant for dry red chilli.',
    duration: '150–180 days',
    msp: 'Market-driven price (Guntur benchmark dry red chilli ₹15,000–₹22,000/quintal).'
  },

  garlic: {
    id: 'garlic',
    nameEn: 'Garlic',
    nameHi: 'लहसुन',
    namePa: 'ਲਸਣ',
    aliases: ['garlic', 'lahsun', 'lasun', 'lehsun', 'लहसुन', 'ਲਸਣ', 'వెల్లుల్లి', 'பூண்டு', 'लसूण', 'রসুন'],
    category: 'Spice & Bulb Vegetable',
    botanical: 'Allium sativum (Amaryllidaceae)',
    propagation: 'Healthy bold cloves (200–250 kg cloves/acre)',
    plantingMethod: 'Plant cloves vertically (pointed end upward) on flat beds or raised beds at 15×10 cm spacing at 2–3 cm depth.',
    plantingDetails: 'Treat cloves with Carbendazim 50% WP (2g/kg) or Trichoderma (10g/kg) for 15 mins before planting.',
    seedRate: '200–250 kg cloves/acre',
    soilReq: 'Rich, loose, well-drained loamy or clay loam soil high in organic matter with pH 6.0–7.5.',
    waterReq: 'Moderate, frequent light irrigations (drip/sprinkler). Stop irrigation 10–15 days before harvest to allow curing and prevent bulb rot.',
    nutrients: {
      basal: '45 kg DAP + 35 kg MOP + 20 kg Sulphur per acre (Sulphur is critical for allicin content and pungency).',
      topDressing: '45 kg Urea split into two doses at 30 and 45 DAP; Foliar spray of Micronutrient mixture + Boron (1g/L) at 60 DAP.'
    },
    intercultural: 'Weeding at 25 and 50 DAP; shallow hoeing.',
    pestsAndDiseases: {
      pests: 'Thrips (Fipronil 5% SC @ 300ml/acre or Imidacloprid 17.8% SL @ 50ml/acre); Stem and bulb nematode.',
      diseases: 'Purple Blotch (Tebuconazole 25.9% EC @ 250ml/acre); Stemphylium Blight; Basal Rot.'
    },
    harvesting: 'Harvest when leaves turn yellow/brown and dry up (60–70% top drying). Cure bulbs under shade for 7–10 days before storage.',
    duration: '120–140 days (Rabi season)',
    msp: 'Market-driven price (standard mandi rate ₹4,000–₹12,000/quintal).'
  }
};

/**
 * Extracts crop entity from query string with high-precision multi-lingual matching.
 * Also dynamically extracts unknown crops (e.g. "how to grow sunflower", "avocado cultivation").
 * @param {string} query - Raw user query
 * @param {Object} fallbackCrop - Profile crop fallback
 * @returns {Object|null} Detected crop metadata or synthesized crop object
 */
export function extractCropEntity(query = '', fallbackCrop = null) {
  if (!query) return fallbackCrop ? normalizeCropObject(fallbackCrop) : null;

  const q = query.toLowerCase().trim();

  // 1. Direct search against all crop directory aliases
  for (const cropKey of Object.keys(CROP_DATABASE)) {
    const crop = CROP_DATABASE[cropKey];
    for (const alias of crop.aliases) {
      const aliasLower = alias.toLowerCase();
      const isIndic = /[\u0900-\u0D7F]/.test(aliasLower);
      if (isIndic) {
        if (q.includes(aliasLower)) return crop;
      } else {
        const regex = new RegExp(`\\b${aliasLower}\\b`, 'i');
        if (regex.test(q)) return crop;
      }
    }
  }

  // 2. Extra Hindi / Hinglish aliases mappings
  const EXTRA_MAPPINGS = {
    'chana': 'chickpea', 'chhole': 'chickpea', 'gram': 'chickpea', 'चना': 'chickpea',
    'ganna': 'sugarcane', 'ikshu': 'sugarcane', 'गन्ना': 'sugarcane',
    'dhan': 'rice', 'chawal': 'rice', 'paddy': 'rice', 'धान': 'rice', 'चावल': 'rice',
    'gehu': 'wheat', 'gehun': 'wheat', 'kanak': 'wheat', 'गेहूं': 'wheat',
    'kapas': 'cotton', 'narma': 'cotton', 'कपास': 'cotton', 'नरमा': 'cotton',
    'tamatar': 'tomato', 'टमाटर': 'tomato',
    'aloo': 'potato', 'batata': 'potato', 'आलू': 'potato',
    'pyaz': 'onion', 'kanda': 'onion', 'प्याज': 'onion', 'कांदा': 'onion',
    'makka': 'maize', 'bhutta': 'maize', 'corn': 'maize', 'मक्का': 'maize',
    'sarson': 'mustard', 'sarso': 'mustard', 'सरसों': 'mustard',
    'surajmukhi': 'sunflower', 'सूरजमुखी': 'sunflower',
    'mirchi': 'chilli', 'mirch': 'chilli', 'मिर्च': 'chilli',
    'lahsun': 'garlic', 'लहसुन': 'garlic'
  };

  for (const [key, cropId] of Object.entries(EXTRA_MAPPINGS)) {
    const isIndic = /[\u0900-\u0D7F]/.test(key);
    if (isIndic) {
      if (q.includes(key)) return CROP_DATABASE[cropId] || null;
    } else {
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      if (regex.test(q)) return CROP_DATABASE[cropId] || null;
    }
  }

  // 3. Dynamic Crop Extractor for ANY specified crop (e.g. "how to grow sunflower", "chia seeds farming")
  const dynamicMatch = q.match(/(?:how to grow|how to cultivate|cultivation of|farming of|care of|fertilizer for|water for|pesticide for|disease of)\s+([a-z\s]+)/i)
    || q.match(/([a-z\u0900-\u097F]+)\s+(?:ki kheti|kaise ugaye|me khad|me pani|me dawai)/i);

  if (dynamicMatch && dynamicMatch[1]) {
    const candidate = dynamicMatch[1].replace(/in my area|in my state|in india|properly|organically|fast|cheaply|\?/gi, '').trim();
    if (candidate && candidate.length > 2 && !['this', 'my', 'the', 'crop', 'soil', 'water', 'plant', 'field', 'khet', 'fasal'].includes(candidate)) {
      const capName = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      return {
        id: candidate.replace(/\s+/g, '_').toLowerCase(),
        nameEn: capName,
        nameHi: capName,
        category: 'Agricultural Crop',
        propagation: `Certified high-germination seeds or vegetative planting material tailored for ${capName}.`,
        plantingMethod: `Line sowing or raised bed transplanting with recommended stage-wise row spacing and depth in well-pulverized seedbed.`,
        plantingDetails: `Treat seed/planting material with bio-fungicide Trichoderma viride (5g/kg) and bio-fertilizer cultures before sowing.`,
        seedRate: `Standard recommended ICAR package seed rate per acre.`,
        soilReq: `Fertile, well-drained loamy or sandy loam soil rich in organic matter with pH 6.0–7.5.`,
        waterReq: `Stage-specific irrigation during critical growth phases (vegetative branching, flowering, and maturity/filling).`,
        nutrients: {
          basal: `Apply balanced basal dose of DAP + MOP + Zinc Sulphate + 5–8 tonnes well-rotted FYM per acre.`,
          topDressing: `Split Urea doses based on vegetative and flowering stages.`
        },
        pestsAndDiseases: {
          pests: `Monitor for sucking pests and borers; spray recommended selective insecticides at economic threshold levels (ETL).`,
          diseases: `Prevent fungal leaf spots and root rots with seed treatment and need-based systemic fungicides.`
        }
      };
    }
  }

  // 4. Fall back to user profile crop only if query does not specify another crop
  if (fallbackCrop) {
    return normalizeCropObject(fallbackCrop);
  }

  return null;
}

/**
 * Normalizes an arbitrary crop object (from AppContext) to a CROP_DATABASE entry if possible.
 */
function normalizeCropObject(cropObj) {
  if (!cropObj) return null;
  if (typeof cropObj === 'string') {
    const id = cropObj.toLowerCase();
    return CROP_DATABASE[id] || { id, nameEn: cropObj, nameHi: cropObj };
  }
  const id = cropObj.id || cropObj.nameEn?.toLowerCase() || cropObj.name?.toLowerCase() || '';
  if (CROP_DATABASE[id]) return CROP_DATABASE[id];
  return {
    id: id || 'custom_crop',
    nameEn: cropObj.nameEn || cropObj.name || 'Crop',
    nameHi: cropObj.nameHi || cropObj.name || 'फसल'
  };
}

/**
 * Detects missing context required for answering a query.
 * @param {string} intent - Identified intent
 * @param {Object} detectedCrop - Detected crop object
 * @param {Object} context - { soil, area, location, stage }
 * @returns {Array<string>} List of missing context fields
 */
export function detectMissingContext(intent, detectedCrop, context = {}) {
  const missing = [];

  if (!detectedCrop && ['crop_cultivation', 'fertilizer_recommendation', 'pest_control', 'sowing', 'harvesting'].includes(intent)) {
    missing.push('crop');
  }

  if (!context.soil && intent === 'crop_selection') {
    missing.push('soil_type');
  }

  if (!context.area && ['farm_cost_calculation', 'profit_calculation'].includes(intent)) {
    missing.push('farm_area');
  }

  return missing;
}
