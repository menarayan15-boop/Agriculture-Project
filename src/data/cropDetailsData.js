/**
 * Comprehensive Crop Agronomy Database
 * Detailed specifications for Soil, Climate, Weather, Irrigation, NPK Nutrients, Pests, and Expected Yield
 */

export const CROP_SEASONS_DATA = [
  {
    id: 'kharif',
    name: 'Kharif (Monsoon)',
    hindiName: 'खरीफ (मानसून)',
    icon: 'fa-cloud-showers-heavy',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.4)',
    sowing: 'June – July',
    harvest: 'September – October',
    sowMonths: [5, 6],
    growMonths: [7, 8],
    harvestMonths: [9, 10],
    description: 'Sown with the onset of the Southwest monsoon. Crops require warm, wet conditions during growth and dry weather during ripening.',
    crops: [
      {
        id: 'rice',
        name: 'Rice / Paddy',
        hindiName: 'धान / चावल',
        category: 'Cereal',
        duration: '90–150 days',
        water: 'High',
        soil: 'Clay, Clay-Loam, Alluvial',
        soilDetails: {
          bestType: 'Deep alluvial, clayey or silty clay loam with high water holding capacity and slow percolation.',
          idealPh: '5.5 – 7.0 (Slightly acidic to neutral)',
          drainage: 'High water retention needed; capable of thriving in submerged flooded conditions.',
          soilPrep: 'Deep summer ploughing (25 cm), 2–3 passes of puddling in standing water, apply 8–10 tonnes well-rotted FYM/acre.'
        },
        climate: {
          tempRange: '22°C – 37°C (Optimal: 25–32°C; min 20°C during flowering)',
          rainfall: '100 – 150 cm (Requires high relative humidity >70% during vegetative stage)',
          sunlight: 'Full sun (6–8 hours daily); bright sunshine during grain filling boosts yield significantly.',
          climateType: 'Hot & Humid Tropical / Sub-tropical'
        },
        irrigation: {
          method: 'Controlled Flooding / Alternate Wetting & Drying (AWD)',
          criticalStages: 'Tillering (15-25 DAT), Panicle Initiation (40-50 DAT), Flowering, Grain Milking',
          waterReq: '1,200 – 1,500 mm (approx 5.5 lakh litres/acre total requirement)'
        },
        nutrients: {
          npk: 'N: 120, P: 60, K: 40 kg/acre (Apply 1/3 N + Full P & K as basal; 1/3 N at tillering; 1/3 N at panicle initiation)',
          micronutrients: 'Zinc Sulphate (25 kg/acre basal) to prevent Khaira disease; Gypsum in saline-alkali soils.'
        },
        pestsAndDiseases: {
          pests: 'Yellow Stem Borer, Brown Plant Hopper (BPH), Leaf Folder, Gall Midge',
          diseases: 'Blast (Pyricularia oryzae), Bacterial Leaf Blight, Sheath Blight, Brown Spot',
          management: 'Seed treatment with Trichoderma (10g/kg); Install Pheromone traps (8/acre); Spray Neem Oil 1500ppm at first symptom.'
        },
        agronomy: {
          seedRate: '12–15 kg/acre (Direct Seeded) or 6–8 kg/acre (Transplanted nursery)',
          spacing: '20 cm × 15 cm (Transplanted hill spacing)',
          expectedYield: '20 – 28 Quintals/acre',
          rotation: 'Rice → Wheat (Rabi) → Moong (Zaid)',
          companion: 'Azolla / Blue Green Algae (biofertilizer) or Sesbania (Daincha) green manuring'
        }
      },
      {
        id: 'maize',
        name: 'Maize / Corn',
        hindiName: 'मक्का',
        category: 'Cereal',
        duration: '85–100 days',
        water: 'Medium',
        soil: 'Loamy, Sandy-Loam, Alluvial',
        soilDetails: {
          bestType: 'Deep, fertile, well-aerated sandy loam to silt loam rich in organic matter.',
          idealPh: '6.0 – 7.5 (Neutral to slightly alkaline)',
          drainage: 'Excellent internal drainage essential; extremely sensitive to waterlogging (even for 24 hours).',
          soilPrep: '2–3 deep ploughings followed by levelling and making ridges and furrows for seed placement.'
        },
        climate: {
          tempRange: '20°C – 32°C (Germination at 18–21°C; pollination affected if >35°C with hot winds)',
          rainfall: '50 – 75 cm (Well-distributed rainfall with sunny spells)',
          sunlight: 'High intensity sunlight (>7 hours/day) for high cob fill and starch synthesis.',
          climateType: 'Warm Sub-tropical & Temperate'
        },
        irrigation: {
          method: 'Furrow Irrigation / Drip Irrigation',
          criticalStages: 'Knee-high Stage (30 DAS), Tasseling / Silking (45–55 DAS), Grain Filling',
          waterReq: '500 – 600 mm (4–5 critical irrigations)'
        },
        nutrients: {
          npk: 'N: 100, P: 50, K: 40 kg/acre (Maize is a heavy feeder: split N into 3 doses)',
          micronutrients: 'Zinc Sulphate (10 kg/acre) + Boron spray at silking for full grain set.'
        },
        pestsAndDiseases: {
          pests: 'Fall Armyworm (Spodoptera frugiperda), Stem Borer (Chilo partellus)',
          diseases: 'Turcicum Leaf Blight, Maydis Leaf Blight, Downy Mildew',
          management: 'Seed treatment with Cyantraniliprole; Emamectin Benzoate spray for Fall Armyworm; release Trichogramma egg parasitoids.'
        },
        agronomy: {
          seedRate: '7–8 kg/acre (Hybrid maize)',
          spacing: '60 cm (Row-to-Row) × 20 cm (Plant-to-Plant)',
          expectedYield: '25 – 35 Quintals/acre',
          rotation: 'Maize → Mustard / Potato (Rabi) → Moong (Zaid)',
          companion: 'Cowpea or Soybean intercrop (1:2 ratio) fixes nitrogen and suppresses weeds'
        }
      },
      {
        id: 'cotton',
        name: 'Cotton',
        hindiName: 'कपास (नरमा)',
        category: 'Cash / Fibre',
        duration: '150–180 days',
        water: 'Medium',
        soil: 'Deep Black Cotton Soil (Regur), Clay-Loam',
        soilDetails: {
          bestType: 'Deep black soils (Vertisols) and deep alluvial soils with high moisture retention and depth >90 cm.',
          idealPh: '6.5 – 8.0',
          drainage: 'Good drainage required; tolerates drought well due to deep taproot system.',
          soilPrep: 'Deep sub-soiling every 2–3 years to break plough pan; apply 10 tonnes FYM/acre.'
        },
        climate: {
          tempRange: '21°C – 35°C (Requires minimum 180 frost-free days and warm sunshine during boll maturation)',
          rainfall: '60 – 100 cm (Dry weather during boll bursting and picking is critical to maintain lint quality)',
          sunlight: 'High sunshine (>8 hrs daily); cloudy humid days promote vegetative overgrowth and pests.',
          climateType: 'Semi-arid Tropical & Sub-tropical'
        },
        irrigation: {
          method: 'Drip Irrigation (Saves 45% water) / Alternate Furrow Irrigation',
          criticalStages: 'Square Formation, Peak Flowering (60–75 DAS), Boll Development (90–110 DAS)',
          waterReq: '700 – 900 mm (5–6 irrigations if rainfed deficit occurs)'
        },
        nutrients: {
          npk: 'N: 60, P: 30, K: 30 kg/acre (Bt Cotton: N: 80, P: 40, K: 40 kg/acre in 3 splits)',
          micronutrients: 'Magnesium Sulphate (10 kg/acre) to prevent leaf reddening + Boron (0.1% foliar spray).'
        },
        pestsAndDiseases: {
          pests: 'Pink Bollworm, Whitefly, Aphids, Jassids, Thrips',
          diseases: 'Cotton Leaf Curl Virus (CLCuV), Bacterial Blight, Root Rot',
          management: 'Use yellow sticky traps (15/acre); Pheromone traps for Pink bollworm; Neem formulation (Azadirachtin 10,000 ppm).'
        },
        agronomy: {
          seedRate: '1.5–2 kg/acre (Bt Hybrid seed)',
          spacing: '90 cm × 60 cm or 120 cm × 45 cm (for mechanized picking)',
          expectedYield: '10 – 16 Quintals/acre (Kapas)',
          rotation: 'Cotton → Wheat (Rabi) → Fallow / Green Manure (Zaid)',
          companion: 'Castor border rows (trap crop) + Marigold for nematode suppression'
        }
      },
      {
        id: 'groundnut',
        name: 'Groundnut / Peanut',
        hindiName: 'मूंगफली',
        category: 'Oilseed / Legume',
        duration: '90–120 days',
        water: 'Medium',
        soil: 'Sandy-Loam, Red Sandy Soil, Light Loam',
        soilDetails: {
          bestType: 'Light sandy-loam with loose crumb structure to facilitate easy peg penetration and pod expansion.',
          idealPh: '6.0 – 7.2 (Avoid heavy sticky soils that hinder harvesting)',
          drainage: 'Well-drained with good aeration in top 20 cm.',
          soilPrep: 'Fine tilth required; apply Gypsum (200 kg/acre) at flowering for calcium supply to pod shell.'
        },
        climate: {
          tempRange: '24°C – 32°C (Sensitive to frost and extreme heat >38°C during flowering)',
          rainfall: '50 – 70 cm (Well distributed with dry sunny harvest period)',
          sunlight: 'Full direct sunshine for maximum photosynthetic pod filling.',
          climateType: 'Tropical and Warm Sub-tropical'
        },
        irrigation: {
          method: 'Sprinkler Irrigation / Micro-Sprinkler',
          criticalStages: 'Flowering (25–30 DAS), Pegging (40–50 DAS), Pod Development (65–80 DAS)',
          waterReq: '450 – 600 mm (Avoid moisture stress during peg formation)'
        },
        nutrients: {
          npk: 'N: 15, P: 40, K: 25 kg/acre (Rhizobium inoculated seeds fix own Nitrogen)',
          micronutrients: 'Gypsum (200 kg/acre in 2 splits: basal & pegging) + Ferrous Sulphate for iron chlorosis.'
        },
        pestsAndDiseases: {
          pests: 'White Grub (Holotrichia), Leaf Miner, Aphids',
          diseases: 'Tikka Disease (Cercospora Leaf Spot), Rust, Collar Rot',
          management: 'Seed treatment with Trichoderma & Rhizobium; Carbendazim + Mancozeb spray for Tikka leaf spot.'
        },
        agronomy: {
          seedRate: '35–40 kg/acre (Kernels/Seeds)',
          spacing: '30 cm × 10 cm',
          expectedYield: '10 – 15 Quintals/acre',
          rotation: 'Groundnut → Wheat / Barley (Rabi) → Moong (Zaid)',
          companion: 'Pigeonpea (Arhar) or Pearl Millet (Bajra) intercropping in 6:1 ratio'
        }
      },
      {
        id: 'soybean',
        name: 'Soybean',
        hindiName: 'सोयाबीन',
        category: 'Oilseed / Legume',
        duration: '90–110 days',
        water: 'Medium',
        soil: 'Deep Black Soil, Loamy, Clay-Loam',
        soilDetails: {
          bestType: 'Fertile black clay soils and loams with high organic content and moisture retentive power.',
          idealPh: '6.5 – 7.5',
          drainage: 'Well-drained; cannot tolerate water stagnation for more than 48 hours.',
          soilPrep: 'Plough and harrow to obtain friable seedbed; prepare broad bed & furrow (BBF) in heavy soils.'
        },
        climate: {
          tempRange: '22°C – 32°C (Daylength sensitive short-day crop)',
          rainfall: '60 – 85 cm (Needs steady moisture during pod filling)',
          sunlight: 'Bright sunny days; cloudy weather during flowering causes flower drop.',
          climateType: 'Warm Sub-tropical'
        },
        irrigation: {
          method: 'Broad Bed Furrow (BBF) / Sprinkler Irrigation',
          criticalStages: 'Flowering Initiation (35–40 DAS), Pod Development Stage (60–75 DAS)',
          waterReq: '450 – 550 mm'
        },
        nutrients: {
          npk: 'N: 15, P: 35, K: 20 kg/acre + Sulphur (10 kg/acre)',
          micronutrients: 'Bradyrhizobium japonicum seed inoculation + Zinc Sulphate.'
        },
        pestsAndDiseases: {
          pests: 'Girdle Beetle, Tobacco Caterpillar (Spodoptera litura), Semilooper',
          diseases: 'Yellow Mosaic Virus (Whitefly transmitted), Charcoal Rot, Rust',
          management: 'Seed treatment with Thiamethoxam; install bird perches; Neem spray 1500 ppm.'
        },
        agronomy: {
          seedRate: '25–30 kg/acre',
          spacing: '45 cm × 10 cm',
          expectedYield: '10 – 14 Quintals/acre',
          rotation: 'Soybean → Wheat / Gram (Rabi) → Fallow / Moong',
          companion: 'Pigeon pea (Arhar) 4:2 ratio or Maize 2:1 ratio'
        }
      },
      {
        id: 'sugarcane',
        name: 'Sugarcane',
        hindiName: 'गन्ना',
        category: 'Cash / Commercial',
        duration: '300–365 days',
        water: 'Very High',
        soil: 'Deep Loam, Clay-Loam, Alluvial',
        soilDetails: {
          bestType: 'Deep, rich alluvial and loam soils with depth >100 cm and good water-holding capacity.',
          idealPh: '6.5 – 8.0',
          drainage: 'Needs deep drainage channels to prevent waterlogging around root zone.',
          soilPrep: 'Deep chiseling (45 cm), 3–4 harrowings, 15 tonnes organic manure/acre, furrow formation.'
        },
        climate: {
          tempRange: '20°C – 35°C (Growth stops below 15°C; cool dry ripening period increases sugar recovery)',
          rainfall: '150 – 250 cm (Or equivalent through assured canal/tubewell irrigation)',
          sunlight: 'Intense sunlight (>8 hrs/day) for high cane weight and sucrose accumulation.',
          climateType: 'Tropical & Sub-tropical'
        },
        irrigation: {
          method: 'Drip Fertigation (Saves 50% water) / Ring Pit Furrow Method',
          criticalStages: 'Germination phase, Tillering / Formative (60–120 DAP), Grand Growth (120–240 DAP)',
          waterReq: '1,800 – 2,500 mm (18–25 irrigations throughout year)'
        },
        nutrients: {
          npk: 'N: 120, P: 60, K: 60 kg/acre (Apply N in 3 splits; finish N before grand growth)',
          micronutrients: 'Ferrous Sulphate & Zinc Sulphate foliar sprays in calcareous soils.'
        },
        pestsAndDiseases: {
          pests: 'Early Shoot Borer, Top Borer, Pyrilla, White Grub',
          diseases: 'Red Rot (Colletotrichum falcatum), Smut, Grassy Shoot Disease',
          management: 'Use certified disease-free setts; Sett treatment with Carbendazim (0.1%); Trichogramma egg cards.'
        },
        agronomy: {
          seedRate: '35,000 – 40,000 two-budded setts/acre (~25–30 Quintals/acre)',
          spacing: '120 cm – 150 cm (Wide-row trench method)',
          expectedYield: '350 – 500 Quintals/acre (40–55 tonnes/acre)',
          rotation: 'Sugarcane (Plant + 1 Ratoon) → Wheat / Mustard → Pulse / Green Manure',
          companion: 'Short-duration intercrop: Potato, Onion, Coriander or Moong in early 60 days'
        }
      },
      {
        id: 'bajra',
        name: 'Pearl Millet / Bajra',
        hindiName: 'बाजरा',
        category: 'Millet / Coarse Cereal',
        duration: '65–90 days',
        water: 'Low',
        soil: 'Sandy, Sandy-Loam, Light Red Soil',
        soilDetails: {
          bestType: 'Light sandy, arid soils with good internal aeration and low organic matter tolerance.',
          idealPh: '6.5 – 8.5 (Highly tolerant to salinity and slight alkalinity)',
          drainage: 'Rapid drainage; highly drought-hardy and resilient.',
          soilPrep: 'Minimum tillage; 1–2 ploughings to conserve monsoon soil moisture.'
        },
        climate: {
          tempRange: '25°C – 38°C (Extreme heat tolerant; can withstand temperatures up to 42°C)',
          rainfall: '35 – 60 cm (Thrives in dry, arid and semi-arid tracts of Rajasthan, Gujarat, Haryana)',
          sunlight: 'High intensity bright sunshine throughout growth.',
          climateType: 'Arid & Semi-Arid Tropical'
        },
        irrigation: {
          method: 'Rainfed / Sprinkler (1–2 supplemental irrigations in drought)',
          criticalStages: 'Tillering (20–25 DAS), Booting / Flowering (40–45 DAS), Grain Development',
          waterReq: '250 – 350 mm'
        },
        nutrients: {
          npk: 'N: 40, P: 20, K: 15 kg/acre (Apply half N + full P & K at sowing; balance N at tillering)',
          micronutrients: 'Zinc Sulphate (10 kg/acre) in deficient sandy soils.'
        },
        pestsAndDiseases: {
          pests: 'Shoot Fly, Stem Borer, Grasshoppers',
          diseases: 'Downy Mildew (Green Ear disease), Ergot, Rust',
          management: 'Seed treatment with Metalaxyl (Apron 35 SD); grow Downy mildew-resistant hybrids.'
        },
        agronomy: {
          seedRate: '1.5–2 kg/acre',
          spacing: '45 cm × 12 cm',
          expectedYield: '12 – 18 Quintals/acre',
          rotation: 'Bajra → Mustard / Gram (Rabi) → Fallow (Zaid)',
          companion: 'Moth Bean (Matki), Cluster Bean (Guar) or Cowpea intercrop (2:1 ratio)'
        }
      },
      {
        id: 'jowar',
        name: 'Sorghum / Jowar',
        hindiName: 'ज्वार',
        category: 'Millet / Cereal',
        duration: '90–120 days',
        water: 'Low',
        soil: 'Medium Black, Loamy, Clay-Loam',
        soilDetails: {
          bestType: 'Medium to deep black soils with good moisture retention; also thrives on red loams.',
          idealPh: '6.0 – 8.5',
          drainage: 'Good drainage needed; tolerates drought and temporary moisture stress by going dormant.',
          soilPrep: '1 deep ploughing followed by 2 harrowing passes and ridge formation.'
        },
        climate: {
          tempRange: '25°C – 35°C (Minimum 16°C for growth)',
          rainfall: '45 – 75 cm',
          sunlight: 'Bright sunny days for robust vegetative biomass and grain earhead fill.',
          climateType: 'Semi-arid Tropical'
        },
        irrigation: {
          method: 'Furrow Irrigation / Rainfed',
          criticalStages: 'Knee-high (30 DAS), Flowering (55–65 DAS), Milk Stage (75–85 DAS)',
          waterReq: '350 – 450 mm'
        },
        nutrients: {
          npk: 'N: 40, P: 25, K: 20 kg/acre (Split N into 2 equal doses)',
          micronutrients: 'Azospirillum and Phosphate Solubilizing Bacteria (PSB) seed treatment.'
        },
        pestsAndDiseases: {
          pests: 'Sorghum Shoot Fly (Atherigona soccata), Stem Borer, Midge',
          diseases: 'Grain Mold, Anthracnose, Leaf Blight',
          management: 'Early sowing with monsoon onset; Seed treatment with Imidacloprid (70 WS); avoid delayed harvest.'
        },
        agronomy: {
          seedRate: '3–4 kg/acre (Grain) / 10–12 kg/acre (Fodder)',
          spacing: '45 cm × 15 cm',
          expectedYield: '12 – 18 Quintals/acre (Grain) + 80–100 Quintals fodder',
          rotation: 'Jowar → Chickpea / Safflower (Rabi) → Fallow / Sesame',
          companion: 'Pigeonpea (Arhar) 2:1 or Soybean 3:1 intercrop'
        }
      },
      {
        id: 'moong-kharif',
        name: 'Moong / Green Gram',
        hindiName: 'मूंग दाल',
        category: 'Pulse / Legume',
        duration: '55–70 days',
        water: 'Low',
        soil: 'Sandy-Loam, Loam, Alluvial',
        soilDetails: {
          bestType: 'Well-drained fertile loamy to sandy loam soils rich in organic matter.',
          idealPh: '6.5 – 7.5 (Cannot tolerate saline or waterlogged soils)',
          drainage: 'High drainage required; waterlogging for 24h causes yellowing and root rot.',
          soilPrep: '1–2 shallow ploughings to obtain fine crumb structure.'
        },
        climate: {
          tempRange: '25°C – 35°C (Warm tropical weather)',
          rainfall: '40 – 60 cm (Heavy rains at harvest cause seed sprouting in pods)',
          sunlight: 'Bright sunny days for active nodulation and pod setting.',
          climateType: 'Tropical & Sub-tropical'
        },
        irrigation: {
          method: 'Sprinkler / Light Furrow',
          criticalStages: 'Pre-flowering (25–30 DAS), Pod Development (40–45 DAS)',
          waterReq: '250 – 350 mm (2–3 light irrigations if rain fails)'
        },
        nutrients: {
          npk: 'N: 10, P: 25, K: 15 kg/acre (Rhizobium fixes 30–40 kg N/acre from atmosphere)',
          micronutrients: 'Rhizobium phaseoli culture + PSB seed coating + 2% DAP foliar spray at flowering.'
        },
        pestsAndDiseases: {
          pests: 'Whitefly (Bemisia tabaci), Pod Borer, Thrips, Aphids',
          diseases: 'Yellow Mosaic Virus (MYMV), Powdery Mildew, Cercospora Leaf Spot',
          management: 'Grow MYMV resistant varieties (e.g. IPM-02-3, Virat); Spray Thiamethoxam for Whitefly vector.'
        },
        agronomy: {
          seedRate: '6–8 kg/acre',
          spacing: '30 cm × 10 cm',
          expectedYield: '5 – 8 Quintals/acre',
          rotation: 'Moong → Wheat / Mustard (Rabi) → Maize (Kharif)',
          companion: 'Intercrop in Sugarcane or Cotton during early vegetative stage'
        }
      },
      {
        id: 'urad-kharif',
        name: 'Urad / Black Gram',
        hindiName: 'उड़द दाल',
        category: 'Pulse / Legume',
        duration: '60–75 days',
        water: 'Low-Medium',
        soil: 'Loam, Clay-Loam, Medium Black Soil',
        soilDetails: {
          bestType: 'Loamy to clay-loam soils with good fertility and moisture retention.',
          idealPh: '6.5 – 7.8',
          drainage: 'Requires good drainage with no standing water.',
          soilPrep: 'Fine seedbed prepared with 1 disc ploughing and 2 harrowings.'
        },
        climate: {
          tempRange: '25°C – 35°C (Prefers warm, humid climate)',
          rainfall: '50 – 75 cm',
          sunlight: 'Full sunshine for maximum pod setting.',
          climateType: 'Tropical'
        },
        irrigation: {
          method: 'Sprinkler / Furrow Irrigation',
          criticalStages: 'Flowering (30–35 DAS) and Pod filling (50–55 DAS)',
          waterReq: '300 – 400 mm'
        },
        nutrients: {
          npk: 'N: 10, P: 25, K: 15 kg/acre + Sulphur (8 kg/acre)',
          micronutrients: 'Rhizobium leguminosarum seed inoculation + Zinc Sulphate.'
        },
        pestsAndDiseases: {
          pests: 'Pod Borer, Whitefly, Blue Butterfly caterpillar',
          diseases: 'Yellow Mosaic Virus, Root Rot, Powdery Mildew',
          management: 'Seed treatment with Trichoderma viride; Neem spray for sucking pests; Pheromone traps.'
        },
        agronomy: {
          seedRate: '6–8 kg/acre',
          spacing: '30 cm × 10 cm',
          expectedYield: '5 – 7 Quintals/acre',
          rotation: 'Urad → Wheat (Rabi) → Moong (Zaid)',
          companion: 'Pigeonpea or Maize intercrop (3:1 ratio)'
        }
      },
      {
        id: 'arhar',
        name: 'Pigeon Pea / Arhar (Tur)',
        hindiName: 'अरहर / तूर दाल',
        category: 'Pulse / Legume',
        duration: '150–200 days',
        water: 'Low',
        soil: 'Deep Sandy-Loam, Loam, Red Soil',
        soilDetails: {
          bestType: 'Deep, well-drained loamy soils with deep sub-soil to support its deep taproot (depth >1.5 m).',
          idealPh: '6.0 – 7.5 (Avoid saline-alkali or waterlogged soils)',
          drainage: 'High drainage essential; cannot withstand 24h of standing water.',
          soilPrep: 'Deep ploughing (30 cm) to break hard pan and facilitate root penetration.'
        },
        climate: {
          tempRange: '20°C – 35°C (Warm tropical weather during vegetative growth; dry sunny conditions at maturity)',
          rainfall: '60 – 100 cm',
          sunlight: 'Full sunshine (>7 hrs/day).',
          climateType: 'Tropical & Sub-tropical'
        },
        irrigation: {
          method: 'Drip / Ridge & Furrow (Highly drought tolerant after establishment)',
          criticalStages: 'Flower Initiation (70–80 DAS), Pod Development (110–125 DAS)',
          waterReq: '400 – 550 mm (1–2 life-saving irrigations during dry spells)'
        },
        nutrients: {
          npk: 'N: 10, P: 30, K: 15 kg/acre + Sulphur (10 kg/acre)',
          micronutrients: 'Rhizobium culture + 2% Urea or DAP foliar spray at peak flowering.'
        },
        pestsAndDiseases: {
          pests: 'Gram Pod Borer (Helicoverpa armigera), Pod Fly (Melanagromyza obtusa), Plume Moth',
          diseases: 'Fusarium Wilt, Sterility Mosaic Disease (transmitted by eriophyid mites)',
          management: 'Grow Wilt-resistant varieties (Asha, BSMR-736); Install 5 pheromone traps/acre; Chlorantraniliprole spray at early flowering.'
        },
        agronomy: {
          seedRate: '4–5 kg/acre (Pure crop) / 2 kg/acre (Intercrop)',
          spacing: '90–120 cm (Row) × 30 cm (Plant)',
          expectedYield: '8 – 12 Quintals/acre',
          rotation: 'Arhar → Wheat / Mustard (Rabi) → Fallow (Zaid)',
          companion: 'Ideal companion crop with Soybean (2:1), Maize (2:1), or Cotton (4:1)'
        }
      },
      {
        id: 'sesame-kharif',
        name: 'Sesame / Til',
        hindiName: 'तिल (सफेद / काला)',
        category: 'Oilseed',
        duration: '70–90 days',
        water: 'Low',
        soil: 'Sandy-Loam, Light Loam, Well-Drained',
        soilDetails: {
          bestType: 'Light sandy-loam and red loamy soils with high organic matter and loose structure.',
          idealPh: '5.5 – 7.5',
          drainage: 'Extremely sensitive to water stagnation at all growth stages.',
          soilPrep: 'Very fine tilth needed due to microscopic seed size; shallow seedbed.'
        },
        climate: {
          tempRange: '25°C – 35°C (Requires warm tropical conditions; germination fails <20°C)',
          rainfall: '45 – 65 cm',
          sunlight: 'Bright sunny days for high oil content in seeds.',
          climateType: 'Tropical'
        },
        irrigation: {
          method: 'Sprinkler / Gentle Furrow',
          criticalStages: 'Flowering (30 DAS) and Capsule Formation (50 DAS)',
          waterReq: '250 – 350 mm'
        },
        nutrients: {
          npk: 'N: 15, P: 15, K: 10 kg/acre + Sulphur (10 kg/acre for oil synthesis)',
          micronutrients: 'Zinc Sulphate + Azotobacter biofertilizer.'
        },
        pestsAndDiseases: {
          pests: 'Leaf and Pod Caterpillar (Antigastra catalaunalis), Gall Fly',
          diseases: 'Phyllody (Mycoplasma transmitted by leafhopper), Root Rot, Powdery Mildew',
          management: 'Seed treatment with Thiram; Spray Dimethoate for leafhoppers to control Phyllody vector.'
        },
        agronomy: {
          seedRate: '1.5–2 kg/acre (Mix with sand 1:4 for even broadcasting)',
          spacing: '30 cm × 15 cm',
          expectedYield: '3 – 5 Quintals/acre',
          rotation: 'Sesame → Chickpea (Rabi) → Rice (Kharif)',
          companion: 'Green gram (Moong) or Bajra intercrop'
        }
      },
      {
        id: 'turmeric',
        name: 'Turmeric',
        hindiName: 'हल्दी',
        category: 'Spice / Cash',
        duration: '240–270 days',
        water: 'High',
        soil: 'Deep Loam, Sandy-Clay Loam, Rich Humus',
        soilDetails: {
          bestType: 'Deep, rich friable loam with high organic carbon and excellent drainage.',
          idealPh: '6.0 – 7.5',
          drainage: 'Cannot tolerate water stagnation; requires raised beds with furrow drainage.',
          soilPrep: 'Apply 15 tonnes decomposed FYM/acre; prepare raised beds of 120 cm width and 15 cm height.'
        },
        climate: {
          tempRange: '20°C – 35°C (Warm humid climate with partial shade tolerance)',
          rainfall: '120 – 200 cm (Or assured irrigation)',
          sunlight: 'Partial shade to full sun; ideal for agroforestry and orchard intercropping.',
          climateType: 'Humid Tropical'
        },
        irrigation: {
          method: 'Drip Irrigation / Micro-Sprinkler',
          criticalStages: 'Rhizome Sprouting, Tillering (60–90 DAP), Rhizome Bulking (120–180 DAP)',
          waterReq: '1,000 – 1,400 mm (15–20 irrigations)'
        },
        nutrients: {
          npk: 'N: 60, P: 30, K: 60 kg/acre + Neem cake (200 kg/acre)',
          micronutrients: 'Zinc Sulphate (10 kg/acre) + Boron (5 kg/acre) at second earthing up.'
        },
        pestsAndDiseases: {
          pests: 'Shoot Borer (Conogethes punctiferalis), Rhizome Scale, Nematodes',
          diseases: 'Rhizome Rot (Pythium aphanidermatum), Leaf Spot (Colletotrichum)',
          management: 'Rhizome dip treatment with Mancozeb (0.3%) + Trichoderma; Heavy straw mulching (5 t/acre).'
        },
        agronomy: {
          seedRate: '8–10 Quintals mother/finger rhizomes per acre',
          spacing: '30 cm × 20 cm on raised beds',
          expectedYield: '80 – 120 Quintals/acre fresh rhizomes (~18–25 Q/acre dry)',
          rotation: 'Turmeric (Perennial) → Maize / Pulse → Banana',
          companion: 'Intercrop with Maize, Chilli or Shade trees like Drumstick (Moringa)'
        }
      },
      {
        id: 'ginger',
        name: 'Ginger',
        hindiName: 'अदरक',
        category: 'Spice / Cash',
        duration: '210–240 days',
        water: 'High',
        soil: 'Sandy-Loam, Red Loam, Rich in Humus',
        soilDetails: {
          bestType: 'Deep, loose sandy-loam or clay-loam rich in humus and organic matter with loose subsoil.',
          idealPh: '6.0 – 6.8',
          drainage: 'High drainage required; water stagnation causes fatal soft rot disease.',
          soilPrep: 'Prepare raised beds (15 cm high, 1 m wide); incorporate 12 tonnes FYM + 2 tonnes vermicompost/acre.'
        },
        climate: {
          tempRange: '19°C – 32°C (Warm and humid with good monsoon showers)',
          rainfall: '150 – 300 cm',
          sunlight: 'Prefers partial shade (30–40% shade); performs exceptionally well under shade net or agroforestry.',
          climateType: 'Humid Sub-tropical & Tropical'
        },
        irrigation: {
          method: 'Drip Irrigation with Micro-Sprinklers',
          criticalStages: 'Sprouting (0–30 DAP), Tillering (60–90 DAP), Rhizome Swelling (120–180 DAP)',
          waterReq: '900 – 1,200 mm'
        },
        nutrients: {
          npk: 'N: 40, P: 20, K: 30 kg/acre + Neem cake (250 kg/acre)',
          micronutrients: 'Zinc and Boron micronutrient foliar spray at 60 and 90 DAP.'
        },
        pestsAndDiseases: {
          pests: 'Shoot Borer, Rhizome Fly, Root-knot Nematode',
          diseases: 'Soft Rot / Rhizome Rot (Pythium myriotylum), Bacterial Wilt',
          management: 'Hot water seed treatment (48°C for 20 mins); Solarize beds in summer; Heavy green leaf mulching.'
        },
        agronomy: {
          seedRate: '6–8 Quintals seed rhizomes per acre',
          spacing: '30 cm × 20 cm on raised beds',
          expectedYield: '60 – 90 Quintals/acre fresh ginger',
          rotation: 'Ginger → Cereal / Pulse → Maize → Fallow',
          companion: 'Shade intercropping under Arecanut, Coconut or Papaya orchards'
        }
      },
      {
        id: 'castor',
        name: 'Castor',
        hindiName: 'अरंडी',
        category: 'Industrial Oilseed',
        duration: '140–180 days',
        water: 'Low-Medium',
        soil: 'Sandy-Loam, Red Loam, Well-Drained',
        soilDetails: {
          bestType: 'Deep sandy loam, red sandy and medium black soils with deep rooting space.',
          idealPh: '6.0 – 7.5',
          drainage: 'Well-drained; deep taproot extracts moisture from deep sub-soil layers.',
          soilPrep: 'Deep chiseling and ploughing to allow deep taproot formation.'
        },
        climate: {
          tempRange: '20°C – 35°C (Warm semi-arid climate)',
          rainfall: '50 – 75 cm',
          sunlight: 'Full bright sunshine; cloudy weather during flowering reduces spike setting.',
          climateType: 'Semi-Arid Tropical'
        },
        irrigation: {
          method: 'Drip Irrigation / Alternate Furrow',
          criticalStages: 'Primary Spike Formation (45–55 DAS), Secondary Spike (75–85 DAS)',
          waterReq: '400 – 600 mm (4–5 irrigations if rain fails)'
        },
        nutrients: {
          npk: 'N: 40, P: 20, K: 20 kg/acre (Apply N in 3 splits corresponding to spike emergence)',
          micronutrients: 'Sulphur (10 kg/acre) to increase oil content in castor seeds.'
        },
        pestsAndDiseases: {
          pests: 'Castor Semilooper, Capsule Borer, Whitefly',
          diseases: 'Fusarium Wilt, Root Rot, Seedling Blight',
          management: 'Hand-pick semilooper larvae in early stages; Wilt-resistant hybrids (GCH-7, DCH-519); Trichoderma seed treatment.'
        },
        agronomy: {
          seedRate: '2–2.5 kg/acre (Hybrid)',
          spacing: '120 cm × 60 cm or 150 cm × 90 cm',
          expectedYield: '10 – 16 Quintals/acre',
          rotation: 'Castor → Gram / Wheat (Rabi) → Groundnut',
          companion: 'Groundnut or Moong intercrop (1:3 ratio)'
        }
      },
      {
        id: 'guar',
        name: 'Cluster Bean / Guar',
        hindiName: 'ग्वार',
        category: 'Legume / Industrial Gum',
        duration: '75–90 days',
        water: 'Low',
        soil: 'Sandy, Sandy-Loam, Arid Desert Soil',
        soilDetails: {
          bestType: 'Light sandy to sandy-loam arid soils; thrives in desert soils of Rajasthan and Haryana.',
          idealPh: '7.0 – 8.5 (Highly tolerant to alkaline soils)',
          drainage: 'Rapid drainage; highly intolerant to water stagnation.',
          soilPrep: 'Minimum tillage; 1 ploughing followed by planking.'
        },
        climate: {
          tempRange: '25°C – 40°C (Extreme heat and drought hardy)',
          rainfall: '30 – 50 cm',
          sunlight: 'Intense sunshine and dry atmosphere.',
          climateType: 'Arid & Semi-Arid'
        },
        irrigation: {
          method: 'Rainfed / 1–2 Sprinkler Irrigations',
          criticalStages: 'Flowering (35 DAS) and Pod formation (55 DAS)',
          waterReq: '200 – 300 mm'
        },
        nutrients: {
          npk: 'N: 8, P: 20, K: 10 kg/acre (Fixes substantial nitrogen for subsequent crops)',
          micronutrients: 'Rhizobium seed inoculation + PSB.'
        },
        pestsAndDiseases: {
          pests: 'Aphids, Jassids, Whitefly',
          diseases: 'Bacterial Blight (Xanthomonas cyamopsidis), Alternaria Leaf Spot',
          management: 'Seed treatment with Streptocycline (100 ppm); grow resistant varieties (RGC-936, HG-365).'
        },
        agronomy: {
          seedRate: '6–8 kg/acre',
          spacing: '45 cm × 15 cm',
          expectedYield: '5 – 8 Quintals/acre',
          rotation: 'Guar → Mustard / Barley (Rabi) → Fallow',
          companion: 'Bajra or Sesame intercrop (2:1 ratio)'
        }
      },
      {
        id: 'okra-kharif',
        name: 'Okra / Bhindi',
        hindiName: 'भिंडी',
        category: 'Vegetable',
        duration: '45–65 days',
        water: 'Medium',
        soil: 'Loamy, Sandy-Loam, Rich Clay-Loam',
        soilDetails: {
          bestType: 'Deep, rich fertile loamy soil with abundant organic matter and neutral pH.',
          idealPh: '6.0 – 7.5',
          drainage: 'Good drainage; sensitive to waterlogging around roots.',
          soilPrep: '2–3 ploughings with 10 tonnes FYM/acre; prepare ridges and furrows.'
        },
        climate: {
          tempRange: '24°C – 35°C (Warm humid climate; growth ceases below 17°C)',
          rainfall: '60 – 100 cm',
          sunlight: 'Full sunshine (>7 hrs/day).',
          climateType: 'Warm Tropical'
        },
        irrigation: {
          method: 'Drip Irrigation / Furrow Method',
          criticalStages: 'Flowering & Fruiting (Irrigate every 4–5 days during peak harvests)',
          waterReq: '400 – 550 mm'
        },
        nutrients: {
          npk: 'N: 40, P: 25, K: 25 kg/acre (Apply N in 3 equal splits: basal, 30 DAS, 45 DAS)',
          micronutrients: 'Foliar spray of 19:19:19 + Micronutrients every 15 days during fruiting.'
        },
        pestsAndDiseases: {
          pests: 'Shoot and Fruit Borer (Earias vittella), Whitefly, Jassids, Red Spider Mite',
          diseases: 'Yellow Vein Mosaic Virus (YVMV), Enation Leaf Curl Virus, Powdery Mildew',
          management: 'Grow YVMV resistant hybrids (Kashi Kranti, Arka Anamika); Yellow sticky traps; Spinosad spray for fruit borer.'
        },
        agronomy: {
          seedRate: '3–4 kg/acre (Kharif) / 5 kg/acre (Summer)',
          spacing: '60 cm × 30 cm',
          expectedYield: '40 – 60 Quintals/acre green tender pods',
          rotation: 'Okra → Potato / Peas (Rabi) → Moong (Zaid)',
          companion: 'Marigold border crop to trap fruit borer and reduce nematodes'
        }
      },
      {
        id: 'chilli-kharif',
        name: 'Chilli / Red Pepper',
        hindiName: 'हरी / लाल मिर्च',
        category: 'Spice / Vegetable',
        duration: '120–150 days',
        water: 'Medium',
        soil: 'Sandy-Loam, Clay-Loam, Black Cotton Soil',
        soilDetails: {
          bestType: 'Well-drained sandy loam, rich alluvial or black soil with good fertility and moisture retention.',
          idealPh: '6.5 – 7.5',
          drainage: 'High drainage essential; standing water causes root asphyxiation and damping off.',
          soilPrep: 'Deep summer ploughing, 8–10 tonnes FYM/acre, raised bed preparation.'
        },
        climate: {
          tempRange: '20°C – 32°C (Warm humid climate for vegetative growth; dry sunny climate for fruit maturity)',
          rainfall: '60 – 100 cm',
          sunlight: 'Full bright sunshine; shade causes flower drop.',
          climateType: 'Tropical & Sub-tropical'
        },
        irrigation: {
          method: 'Drip Fertigation (Highly recommended)',
          criticalStages: 'Transplanting, Flowering, Fruit Setting & Fruit Development',
          waterReq: '500 – 700 mm (Avoid moisture stress during flowering to prevent blossom drop)'
        },
        nutrients: {
          npk: 'N: 50, P: 25, K: 30 kg/acre (Apply N & K in 4 splits through drip)',
          micronutrients: 'Calcium Nitrate + Boron foliar spray at flowering prevents blossom end rot and fruit drop.'
        },
        pestsAndDiseases: {
          pests: 'Chilli Thrips (Scirtothrips dorsalis), Yellow Mites, Whitefly, Fruit Borer',
          diseases: 'Chilli Leaf Curl Virus (Murda disease), Anthracnose (Die-back/Fruit rot), Powdery Mildew',
          management: 'Blue & Yellow sticky traps (20/acre); Neem oil 10,000 ppm spray; Copper Oxychloride for Anthracnose.'
        },
        agronomy: {
          seedRate: '150–200 grams/acre (Hybrid nursery transplanting)',
          spacing: '60 cm × 45 cm or 75 cm × 45 cm on raised beds',
          expectedYield: '80 – 120 Quintals green chillies / 15–20 Quintals dry red chillies/acre',
          rotation: 'Chilli → Onion / Garlic (Rabi) → Maize (Zaid)',
          companion: 'Marigold border trap crop + Onion intercrop'
        }
      }
    ]
  },
  {
    id: 'rabi',
    name: 'Rabi (Winter)',
    hindiName: 'रबी (सर्दियां)',
    icon: 'fa-snowflake',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.1)',
    border: 'rgba(56, 189, 248, 0.4)',
    sowing: 'October – November',
    harvest: 'February – April',
    sowMonths: [9, 10],
    growMonths: [11, 0],
    harvestMonths: [1, 2, 3],
    description: 'Sown at the onset of winter and harvested in spring/early summer. Requires cool climate during germination/vegetative growth and warm climate during maturity.',
    crops: [
      {
        id: 'wheat',
        name: 'Wheat',
        hindiName: 'गेहूं',
        category: 'Cereal',
        duration: '100–130 days',
        water: 'Medium',
        soil: 'Loamy, Clay-Loam, Alluvial',
        soilDetails: {
          bestType: 'Well-aerated fertile loams and clay-loams with good water retention and neutral reaction.',
          idealPh: '6.0 – 7.5',
          drainage: 'Good drainage; sensitive to water stagnation during early tillering.',
          soilPrep: '1 disc ploughing followed by 2 cultivator passes and planking to create firm, fine seedbed.'
        },
        climate: {
          tempRange: '12°C – 25°C (Optimum germination: 20–22°C; cool tillering: 15–18°C; warm ripening: 22–25°C)',
          rainfall: '35 – 50 cm (Winter showers/Western disturbances highly beneficial)',
          sunlight: 'Bright sunny winter days for active photosynthesis and tillering.',
          climateType: 'Cool Temperate & Sub-tropical Winter'
        },
        irrigation: {
          method: 'Border Strip / Furrow / Sprinkler Irrigation',
          criticalStages: 'CRI (Crown Root Initiation at 21 DAS - Most Critical!), Tillering (40 DAS), Jointing (60 DAS), Flowering (80 DAS), Milking (95 DAS), Dough (110 DAS)',
          waterReq: '400 – 500 mm (4–6 irrigations)'
        },
        nutrients: {
          npk: 'N: 50, P: 25, K: 15 kg/acre (Apply 1/2 N + full P & K as basal; 1/4 N at 1st irrigation; 1/4 N at 2nd irrigation)',
          micronutrients: 'Zinc Sulphate (10 kg/acre) + Manganese Sulphate in rice-wheat rotation.'
        },
        pestsAndDiseases: {
          pests: 'Wheat Aphids (Mahua), Termites, Armyworm',
          diseases: 'Yellow (Stripe) Rust, Brown (Leaf) Rust, Karnal Bunt, Loose Smut',
          management: 'Grow Rust-resistant varieties (HD-2967, PBW-550, DBW-187); Seed treatment with Tebuconazole; Propiconazole spray for Rust.'
        },
        agronomy: {
          seedRate: '40 kg/acre (Timely sown) / 50 kg/acre (Late sown)',
          spacing: '20–22.5 cm (Row-to-Row) × Continuous seed drill',
          expectedYield: '20 – 26 Quintals/acre',
          rotation: 'Paddy (Kharif) → Wheat → Moong (Zaid)',
          companion: 'Mustard intercrop (9:1 or 8:1 ratio) or Chickpea'
        }
      },
      {
        id: 'mustard',
        name: 'Mustard / Rapeseed',
        hindiName: 'सरसों / राई',
        category: 'Oilseed',
        duration: '90–110 days',
        water: 'Low',
        soil: 'Sandy-Loam, Loam, Alluvial',
        soilDetails: {
          bestType: 'Light sandy-loam to heavy loam soils with good moisture conservation capacity.',
          idealPh: '6.0 – 7.5 (Tolerates moderate salinity)',
          drainage: 'Good drainage; sensitive to waterlogging at seedling and flowering stages.',
          soilPrep: 'Conserve residual moisture after Kharif; 2 ploughings and immediate planking to prevent moisture loss.'
        },
        climate: {
          tempRange: '10°C – 25°C (Cool climate with clear sunny days and cold nights enhances oil content)',
          rainfall: '25 – 40 cm',
          sunlight: 'Abundant sunshine; persistent cloudy fog during flowering increases Aphid infestation.',
          climateType: 'Cool Sub-tropical'
        },
        irrigation: {
          method: 'Sprinkler / Border Strip',
          criticalStages: 'Pre-flowering (30–35 DAS) and Siliquae / Pod Filling (60–65 DAS)',
          waterReq: '250 – 350 mm (2–3 light irrigations)'
        },
        nutrients: {
          npk: 'N: 35, P: 18, K: 12 kg/acre + Sulphur (15 kg/acre - Essential for Mustard oil synthesis!)',
          micronutrients: 'Bentonite Sulphur (10 kg/acre) + Borax (4 kg/acre).'
        },
        pestsAndDiseases: {
          pests: 'Mustard Aphid (Lipaphis erysimi), Painted Bug, Sawfly',
          diseases: 'White Rust (Albugo candida), Alternaria Blight, Sclerotinia Stem Rot',
          management: 'Sow before 20th October to escape peak aphid attack; Yellow sticky traps; Spray Dimethoate or Thiamethoxam if aphid threshold exceeds 20 aphids/plant.'
        },
        agronomy: {
          seedRate: '1.5–2 kg/acre',
          spacing: '30–45 cm × 10–15 cm',
          expectedYield: '8 – 12 Quintals/acre',
          rotation: 'Bajra / Maize (Kharif) → Mustard → Fallow / Moong',
          companion: 'Wheat + Mustard (9:1 ratio) intercropping'
        }
      },
      {
        id: 'gram',
        name: 'Gram / Chickpea',
        hindiName: 'चना (देसी / काबुली)',
        category: 'Pulse / Legume',
        duration: '90–120 days',
        water: 'Low',
        soil: 'Sandy-Loam, Loam, Red & Black Soils',
        soilDetails: {
          bestType: 'Deep, well-aerated sandy loam to clay loam; rough and cloddy seedbed is preferred.',
          idealPh: '6.0 – 8.0',
          drainage: 'Extremely high drainage required; excess moisture causes severe wilt and collar rot.',
          soilPrep: 'Do not prepare fine powder tilth; leave moderate clods to maintain aeration and prevent crusting.'
        },
        climate: {
          tempRange: '15°C – 28°C (Cool weather during vegetative phase and warm sunny weather during maturity)',
          rainfall: '30 – 50 cm (Frost during flowering causes heavy flower drop and pod abortion)',
          sunlight: 'Full direct sunlight.',
          climateType: 'Cool Sub-tropical & Semi-Arid'
        },
        irrigation: {
          method: 'Sprinkler / Light Furrow',
          criticalStages: 'Pre-flowering / Branching (40–45 DAS) and Pod Development (70–75 DAS) — NEVER irrigate during peak flowering!',
          waterReq: '200 – 300 mm (1–2 irrigations)'
        },
        nutrients: {
          npk: 'N: 10, P: 25, K: 10 kg/acre (Fixes own nitrogen through Mesorhizobium ciceri nodules)',
          micronutrients: 'Mesorhizobium + PSB seed inoculation + 2% Urea foliar spray at pod filling.'
        },
        pestsAndDiseases: {
          pests: 'Gram Pod Borer (Helicoverpa armigera), Cutworm',
          diseases: 'Fusarium Wilt (Wilt), Ascochyta Blight, Collar Rot',
          management: 'Deep summer ploughing; Trichoderma seed treatment; Install 5 Pheromone traps/acre + Bird perches (15/acre); Spray Emamectin Benzoate for pod borer.'
        },
        agronomy: {
          seedRate: '30–35 kg/acre (Desi) / 40–45 kg/acre (Kabuli)',
          spacing: '30 cm × 10 cm',
          expectedYield: '8 – 14 Quintals/acre',
          rotation: 'Rice / Jowar (Kharif) → Chickpea → Sesame / Moong (Zaid)',
          companion: 'Barley, Mustard or Linseed intercropping in 4:1 ratio'
        }
      },
      {
        id: 'barley',
        name: 'Barley',
        hindiName: 'जौ',
        category: 'Cereal / Malt',
        duration: '85–100 days',
        water: 'Low',
        soil: 'Sandy-Loam, Loam, Saline-Alkali Tolerant',
        soilDetails: {
          bestType: 'Sandy-loam to loamy soils; best cereal crop for saline, alkaline and marginal low-fertility lands.',
          idealPh: '7.0 – 8.5 (Highly tolerant to soil salinity up to 8.0 dS/m)',
          drainage: 'Good drainage; drought hardy.',
          soilPrep: '2–3 ploughings followed by planking.'
        },
        climate: {
          tempRange: '12°C – 24°C (Cool climate crop; more drought and cold tolerant than wheat)',
          rainfall: '25 – 45 cm',
          sunlight: 'Bright winter sun.',
          climateType: 'Cool Temperate & Semi-Arid'
        },
        irrigation: {
          method: 'Border Strip / Flood',
          criticalStages: 'Tillering (30 DAS), Flag Leaf / Booting (60 DAS), Milk Stage (80 DAS)',
          waterReq: '250 – 350 mm (2–3 irrigations)'
        },
        nutrients: {
          npk: 'N: 25, P: 15, K: 10 kg/acre (For malting barley, keep N low to maintain grain protein <10%)',
          micronutrients: 'Zinc Sulphate (10 kg/acre).'
        },
        pestsAndDiseases: {
          pests: 'Corn Leaf Aphid, Termites',
          diseases: 'Stripe Rust, Covered Smut, Net Blotch',
          management: 'Seed treatment with Vitavax / Carboxin (2g/kg); Spray Propiconazole for Rust.'
        },
        agronomy: {
          seedRate: '35–40 kg/acre',
          spacing: '22.5 cm × continuous row',
          expectedYield: '16 – 22 Quintals/acre',
          rotation: 'Guar / Bajra (Kharif) → Barley → Fallow',
          companion: 'Mustard or Gram intercropping'
        }
      },
      {
        id: 'peas',
        name: 'Peas / Field Peas',
        hindiName: 'मटर',
        category: 'Vegetable / Pulse',
        duration: '70–90 days',
        water: 'Low-Medium',
        soil: 'Loam, Sandy-Loam, Well-Drained',
        soilDetails: {
          bestType: 'Well-drained, loose, friable loamy soil rich in organic matter and calcium.',
          idealPh: '6.0 – 7.5 (Acidic soils below 5.5 require liming)',
          drainage: 'Sensitive to waterlogging and soil compaction.',
          soilPrep: 'Deep ploughing with 8 tonnes FYM/acre; prepare fine level seedbed.'
        },
        climate: {
          tempRange: '10°C – 20°C (Thrives in cool weather; hot weather >25°C accelerates maturity and reduces sweetness)',
          rainfall: '30 – 50 cm',
          sunlight: 'Full sunshine; frost tolerant during vegetative stage but sensitive during flowering.',
          climateType: 'Cool Temperate'
        },
        irrigation: {
          method: 'Sprinkler / Light Furrow',
          criticalStages: 'Flower Initiation (35 DAS) and Pod Filling (55 DAS)',
          waterReq: '250 – 350 mm (2–3 light irrigations)'
        },
        nutrients: {
          npk: 'N: 10, P: 25, K: 15 kg/acre + Sulphur (10 kg/acre)',
          micronutrients: 'Rhizobium leguminosarum seed inoculation + Ammonium Molybdate.'
        },
        pestsAndDiseases: {
          pests: 'Pea Leaf Miner, Pea Aphid, Pod Borer',
          diseases: 'Powdery Mildew (Erysiphe pisi), Rust, Fusarium Root Rot',
          management: 'Sow Powdery mildew resistant varieties (Arka Ajit, AP-3); Spray wettable Sulphur for mildew.'
        },
        agronomy: {
          seedRate: '30–35 kg/acre (Green peas) / 25 kg/acre (Field peas)',
          spacing: '30 cm × 8–10 cm',
          expectedYield: '30 – 45 Quintals/acre green pods (~8–12 Q/acre dry grain)',
          rotation: 'Maize (Kharif) → Peas → Toria / Summer Moong',
          companion: 'Cabbage, Cauliflower or Mustard intercrop'
        }
      },
      {
        id: 'potato',
        name: 'Potato',
        hindiName: 'आलू',
        category: 'Tuber / Vegetable',
        duration: '70–90 days',
        water: 'Medium',
        soil: 'Sandy-Loam, Loam, Loose Friable Soil',
        soilDetails: {
          bestType: 'Loose, friable, well-aerated sandy loam rich in organic matter that permits easy tuber expansion.',
          idealPh: '5.2 – 6.5 (Slightly acidic soil suppresses Potato Scab disease)',
          drainage: 'Excellent drainage required; water stagnation causes blackheart and tuber decay.',
          soilPrep: 'Deep tilling (25 cm), incorporate 12–15 tonnes FYM/acre, form ridges and furrows.'
        },
        climate: {
          tempRange: '15°C – 22°C (Critical: Tuberization occurs best at night temperature 15–18°C; stops above 22°C)',
          rainfall: '40 – 60 cm',
          sunlight: 'High sunshine during daytime + cool nights for starch accumulation.',
          climateType: 'Cool Sub-tropical & Temperate'
        },
        irrigation: {
          method: 'Drip Fertigation / Furrow Method (Keep water level at half ridge height)',
          criticalStages: 'Stolon formation (25–30 DAP), Tuber Initiation (40–45 DAP), Tuber Bulking (60–75 DAP)',
          waterReq: '450 – 600 mm (Irrigate every 7–10 days)'
        },
        nutrients: {
          npk: 'N: 75, P: 40, K: 50 kg/acre (Heavy potassium feeder: MOP/SOP enhances tuber size and skin finish)',
          micronutrients: 'Zinc Sulphate (10 kg/acre) + Boron (0.1% foliar spray at bulking).'
        },
        pestsAndDiseases: {
          pests: 'Potato Tuber Moth, Aphids (Virus vectors), Cutworm, White Grub',
          diseases: 'Late Blight (Phytophthora infestans), Early Blight, Common Scab, Viral Mosaic',
          management: 'Use certified seed tubers; Prophylactic Mancozeb (0.2%) spray before fog/humidity; Earthing up to prevent greening.'
        },
        agronomy: {
          seedRate: '10–12 Quintals whole/cut tubers per acre (35–45g tuber size with 2–3 eyes)',
          spacing: '60 cm (Ridge-to-Ridge) × 20 cm (Tuber-to-Tuber)',
          expectedYield: '100 – 160 Quintals/acre (10–16 tonnes/acre)',
          rotation: 'Paddy (Kharif) → Potato → Sunflower / Moong (Zaid)',
          companion: 'Maize or Radish on border ridges'
        }
      },
      {
        id: 'onion-rabi',
        name: 'Onion (Rabi)',
        hindiName: 'प्याज',
        category: 'Bulb / Vegetable',
        duration: '120–150 days',
        water: 'Medium',
        soil: 'Sandy-Loam, Loam, Alluvial',
        soilDetails: {
          bestType: 'Deep, friable loamy soil rich in organic matter and free from stones or hard pan.',
          idealPh: '6.5 – 7.5',
          drainage: 'High drainage; shallow root system sensitive to both waterlogging and dry cracking.',
          soilPrep: 'Fine tilth; incorporate 10 tonnes FYM/acre; prepare raised flat beds or broad beds.'
        },
        climate: {
          tempRange: '13°C – 28°C (Cool vegetative phase 13–20°C; warm 25–30°C for bulb maturity and drying)',
          rainfall: '35 – 55 cm',
          sunlight: 'Long daylight hours (>10–12 hours) trigger bulbing and dry scale skin formation.',
          climateType: 'Sub-tropical Winter'
        },
        irrigation: {
          method: 'Micro-Sprinkler / Drip Fertigation',
          criticalStages: 'Transplanting, Vegetative growth, Bulb Initiation (60 DAT), Bulb Enlargement (90 DAT) — Stop water 15 days before harvest!',
          waterReq: '400 – 550 mm (10–12 light irrigations)'
        },
        nutrients: {
          npk: 'N: 40, P: 25, K: 35 kg/acre + Sulphur (15 kg/acre for pungency and storage life)',
          micronutrients: 'Zinc Sulphate + Borax (5 kg/acre) increases bulb firmness and shelf life.'
        },
        pestsAndDiseases: {
          pests: 'Onion Thrips (Thrips tabaci), Maggot, Cutworm',
          diseases: 'Purple Blotch (Alternaria porri), Stemphylium Blight, Basal Rot, Downy Mildew',
          management: 'Blue sticky traps for Thrips; Spray Fipronil or Spinosad; Mancozeb + Hexaconazole for Purple blotch.'
        },
        agronomy: {
          seedRate: '3–4 kg/acre for nursery seedling transplanting (45-day-old seedlings)',
          spacing: '15 cm × 10 cm on flat beds or raised beds',
          expectedYield: '100 – 150 Quintals/acre',
          rotation: 'Rice / Soybean (Kharif) → Onion → Watermelon / Moong (Zaid)',
          companion: 'Carrot or Beetroot companion crop'
        }
      },
      {
        id: 'garlic',
        name: 'Garlic',
        hindiName: 'लहसुन',
        category: 'Bulb / Spice',
        duration: '120–150 days',
        water: 'Medium',
        soil: 'Sandy-Loam, Loam, Well-Drained',
        soilDetails: {
          bestType: 'Rich, fertile, well-drained loam and clay-loam rich in humus with loose consistency.',
          idealPh: '6.0 – 7.2',
          drainage: 'High drainage required; waterlogging rots the developing cloves.',
          soilPrep: 'Fine seedbed; 10 tonnes FYM/acre + 200 kg neem cake/acre to control soil-borne fungi.'
        },
        climate: {
          tempRange: '12°C – 25°C (Cool climate during vegetative clove formation; warm dry sunny weather during bulb curing)',
          rainfall: '30 – 50 cm',
          sunlight: 'Bright winter sunshine.',
          climateType: 'Cool Sub-tropical'
        },
        irrigation: {
          method: 'Micro-Sprinkler / Drip',
          criticalStages: 'Clove Sprouting, Vegetative Growth, Bulb Development (60–90 DAP) — Withhold water 2 weeks prior to harvest',
          waterReq: '400 – 500 mm'
        },
        nutrients: {
          npk: 'N: 40, P: 25, K: 30 kg/acre + Sulphur (20 kg/acre for allicin pungent oil content)',
          micronutrients: 'Zinc Sulphate + Boron (increases clove weight and skin brightness).'
        },
        pestsAndDiseases: {
          pests: 'Thrips, Stem and Bulb Nematode, Mites',
          diseases: 'Purple Blotch, Stemphylium Blight, Neck Rot, Rust',
          management: 'Clove treatment with Carbendazim (2g/kg); Blue sticky traps; Tricyclazole spray for Blight.'
        },
        agronomy: {
          seedRate: '200–250 kg healthy bold cloves per acre',
          spacing: '15 cm × 8–10 cm',
          expectedYield: '35 – 50 Quintals/acre dry cured bulbs',
          rotation: 'Soybean / Maize (Kharif) → Garlic → Cucumber / Moong (Zaid)',
          companion: 'Natural pest-repellent border crop around vegetables'
        }
      },
      {
        id: 'coriander',
        name: 'Coriander / Dhania',
        hindiName: 'धनिया',
        category: 'Spice / Herb',
        duration: '60–90 days',
        water: 'Low-Medium',
        soil: 'Sandy-Loam, Loam, Alluvial',
        soilDetails: {
          bestType: 'Well-drained rich loamy and black soils with good organic matter.',
          idealPh: '6.0 – 7.5',
          drainage: 'Good drainage essential; highly sensitive to waterlogging.',
          soilPrep: 'Fine tilth; split the round coriander seed mericarps into two halves before sowing.'
        },
        climate: {
          tempRange: '15°C – 25°C (Cool and dry weather; high temperatures and frost both reduce essential oil and cause flower blast)',
          rainfall: '25 – 45 cm',
          sunlight: 'Full sunshine with cool breeze.',
          climateType: 'Cool Sub-tropical'
        },
        irrigation: {
          method: 'Sprinkler / Gentle Flat Bed Flooding',
          criticalStages: 'Germination (10–15 DAS), Branching (35 DAS), Flowering & Grain Formation (60 DAS)',
          waterReq: '250 – 350 mm'
        },
        nutrients: {
          npk: 'N: 25, P: 15, K: 10 kg/acre',
          micronutrients: 'Azotobacter seed treatment + 1% Urea spray after 1st leaf cutting (if grown for green leaves).'
        },
        pestsAndDiseases: {
          pests: 'Aphids, Cutworm, Seed Midge',
          diseases: 'Powdery Mildew (Erysiphe polygoni), Stem Gall, Wilt',
          management: 'Spray wettable Sulphur (0.2%) for Powdery mildew; Neem oil spray for aphids.'
        },
        agronomy: {
          seedRate: '8–10 kg split seeds per acre',
          spacing: '30 cm × 10 cm',
          expectedYield: '6 – 10 Quintals dry seed/acre (or 35–45 Q green leaves)',
          rotation: 'Sorghum (Kharif) → Coriander → Moong (Zaid)',
          companion: 'Ideal companion in vegetable gardens; attracts beneficial pollinating insects'
        }
      },
      {
        id: 'cauliflower',
        name: 'Cauliflower / Cabbage',
        hindiName: 'फूलगोभी / पत्तागोभी',
        category: 'Cole Crop / Vegetable',
        duration: '60–90 days',
        water: 'Medium',
        soil: 'Loamy, Clay-Loam, Fertile Humus',
        soilDetails: {
          bestType: 'Deep, fertile, moisture-retentive loamy to clay-loam soils with abundant organic matter.',
          idealPh: '6.0 – 7.0 (Acidic soils below 5.5 cause "Whiptail" deficiency)',
          drainage: 'Well-drained; shallow root system requires constant moisture without stagnation.',
          soilPrep: '12 tonnes FYM/acre + 200 kg neem cake; prepare raised beds.'
        },
        climate: {
          tempRange: '12°C – 22°C (Cool climate; curd formation fails if temperatures exceed 25°C in main season varieties)',
          rainfall: '40 – 60 cm',
          sunlight: 'Full sun; blanching required to keep curds snow-white.',
          climateType: 'Cool Temperate & Sub-tropical'
        },
        irrigation: {
          method: 'Drip Irrigation / Furrow',
          criticalStages: 'Transplanting, Vegetative expansion, Curd/Head initiation and Enlargement',
          waterReq: '350 – 450 mm (Irrigate every 5–7 days)'
        },
        nutrients: {
          npk: 'N: 50, P: 30, K: 35 kg/acre',
          micronutrients: 'Borax (5 kg/acre) to prevent "Browning/Hollow stem" + Ammonium Molybdate (1 kg/acre) against "Whiptail".'
        },
        pestsAndDiseases: {
          pests: 'Diamondback Moth (DBM - Plutella xylostella), Tobacco Caterpillar, Aphids',
          diseases: 'Black Rot (Xanthomonas campestris), Clubroot, Alternaria Leaf Spot, Downy Mildew',
          management: 'Mustard trap crop (2 rows every 25 rows); Bacillus thuringiensis (Bt) spray; Pheromone traps for DBM.'
        },
        agronomy: {
          seedRate: '150–200 grams/acre (Nursery seedling transplanting at 25–30 days)',
          spacing: '45 cm × 45 cm or 60 cm × 45 cm',
          expectedYield: '80 – 120 Quintals/acre fresh compact curds/heads',
          rotation: 'Maize (Kharif) → Cauliflower → Moong / Cucumber (Zaid)',
          companion: 'Mint, Rosemary, or Mustard border trap crop'
        }
      }
    ]
  },
  {
    id: 'zaid',
    name: 'Zaid (Summer)',
    hindiName: 'जायद (गर्मी)',
    icon: 'fa-sun',
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.1)',
    border: 'rgba(251, 191, 36, 0.4)',
    sowing: 'March – April',
    harvest: 'May – June',
    sowMonths: [2, 3],
    growMonths: [4],
    harvestMonths: [5, 6],
    description: 'Grown in the warm dry gap between Rabi harvest and Kharif monsoon. Dominated by fast-growing cucurbit gourds, melons, and short-duration pulses.',
    crops: [
      {
        id: 'watermelon',
        name: 'Watermelon',
        hindiName: 'तरबूज',
        category: 'Cucurbit / Fruit',
        duration: '60–90 days',
        water: 'Medium',
        soil: 'Sandy-Loam, Riverbed Alluvial, Light Soil',
        soilDetails: {
          bestType: 'Light sandy-loam and deep riverbed silt soils that warm up quickly in early summer.',
          idealPh: '6.0 – 7.0',
          drainage: 'Rapid drainage; deep taproot system for moisture seeking in sandy riverbeds.',
          soilPrep: 'Dig pits (45×45×45 cm) or furrows; fill with 5 kg well-rotted FYM + 50g SSP per pit.'
        },
        climate: {
          tempRange: '25°C – 38°C (High temperature and dry sunny atmosphere during fruit ripening develop high sweetness/Brix)',
          rainfall: 'Low rainfall / Dry weather essential (Rains during ripening cause fruit bursting and tasteless pulp)',
          sunlight: 'Intense sunlight (>8–10 hours daily).',
          climateType: 'Hot & Dry Summer'
        },
        irrigation: {
          method: 'Drip Fertigation with Silver-Black Plastic Mulch (Highly Recommended)',
          criticalStages: 'Vine elongation, Flowering & Fruit setting, Fruit sizing — Stop watering 5–7 days before picking to concentrate sugars',
          waterReq: '350 – 450 mm'
        },
        nutrients: {
          npk: 'N: 40, P: 25, K: 40 kg/acre (Potassium sulphate increases sugar sweetness and rind strength)',
          micronutrients: 'Boron (0.1%) spray at flowering ensures perfect symmetrical fruit shape and prevents hollow heart.'
        },
        pestsAndDiseases: {
          pests: 'Red Pumpkin Beetle (Aulacophora foveicollis), Fruit Fly (Bactrocera cucurbitae), Aphids',
          diseases: 'Powdery Mildew, Downy Mildew, Fusarium Wilt, Gummy Stem Blight',
          management: 'Install Methyl Eugenol pheromone traps (6/acre) for fruit fly; Neem oil spray; Trichoderma pit treatment for wilt.'
        },
        agronomy: {
          seedRate: '1.5–2 kg/acre (Open pollinated) / 400–500g/acre (F1 Hybrid)',
          spacing: '2.0 m (Channel-to-Channel) × 0.6 m (Plant-to-Plant)',
          expectedYield: '150 – 250 Quintals/acre (15–25 tonnes/acre)',
          rotation: 'Wheat / Potato (Rabi) → Watermelon → Maize / Paddy (Kharif)',
          companion: 'Radish or Marigold on borders to divert pests'
        }
      },
      {
        id: 'cucumber',
        name: 'Cucumber',
        hindiName: 'खीरा',
        category: 'Cucurbit / Vegetable',
        duration: '50–70 days',
        water: 'Medium',
        soil: 'Loam, Sandy-Loam, Rich Organic',
        soilDetails: {
          bestType: 'Rich, fertile sandy-loam to loamy soil rich in decomposed humus with excellent aeration.',
          idealPh: '6.0 – 7.2',
          drainage: 'High drainage; shallow roots prone to root suffocation.',
          soilPrep: 'Apply 10 tonnes FYM/acre; prepare raised beds with trellising or open channel furrows.'
        },
        climate: {
          tempRange: '22°C – 35°C (Warm weather crop; rapid vegetative growth in hot sunny conditions)',
          rainfall: 'Requires dry air with regular root-zone moisture',
          sunlight: 'Full sunshine.',
          climateType: 'Warm Sub-tropical & Tropical'
        },
        irrigation: {
          method: 'Drip Irrigation with Staking / Trellis',
          criticalStages: 'Flowering & Continuous Fruit Picking (Irrigate every 2–3 days during summer)',
          waterReq: '350 – 450 mm (Never allow soil to completely dry out; moisture stress causes bitter cucumbers)'
        },
        nutrients: {
          npk: 'N: 35, P: 25, K: 30 kg/acre',
          micronutrients: 'Foliar spray of 13:0:45 + Micronutrients every 10 days during fruiting.'
        },
        pestsAndDiseases: {
          pests: 'Fruit Fly, Red Pumpkin Beetle, Leaf Miner, Whitefly',
          diseases: 'Downy Mildew, Powdery Mildew, Cucumber Mosaic Virus',
          management: 'Pheromone fruit fly traps; Vertical trellis netting reduces fungal leaf contact with wet soil; Mancozeb spray.'
        },
        agronomy: {
          seedRate: '1–1.5 kg/acre (Open) / 350–400g/acre (Hybrid)',
          spacing: '1.5 m × 0.45 m (Trellis) or 2 m × 0.6 m (Ground trailing)',
          expectedYield: '60 – 100 Quintals/acre crisp tender cucumbers',
          rotation: 'Wheat / Mustard (Rabi) → Cucumber → Tomato (Kharif)',
          companion: 'Bush beans, Sunflowers (as living trellis poles), or Corn'
        }
      },
      {
        id: 'muskmelon',
        name: 'Muskmelon / Kharbooza',
        hindiName: 'खरबूजा',
        category: 'Cucurbit / Fruit',
        duration: '70–90 days',
        water: 'Low-Medium',
        soil: 'Sandy-Loam, Riverbed Silt',
        soilDetails: {
          bestType: 'Light, well-drained sandy to sandy-loam soils that heat up quickly in spring.',
          idealPh: '6.0 – 7.5',
          drainage: 'High drainage; excess soil moisture damages fruit netting and reduces sugar accumulation.',
          soilPrep: 'Channel and pit method; mix 5 kg FYM + 50g Neem cake per pit.'
        },
        climate: {
          tempRange: '25°C – 38°C (Warm dry sunny weather during fruit development is vital for rich aroma and high TSS sweetness)',
          rainfall: 'Extremely low / Dry summer',
          sunlight: 'Abundant high-intensity sunshine (>9 hrs/day).',
          climateType: 'Hot & Arid Summer'
        },
        irrigation: {
          method: 'Drip / Furrow (Keep vines dry on raised bed ridges)',
          criticalStages: 'Early vine growth, Flowering, Fruit Expansion — Stop irrigation 7 days before picking when fruit "half-slip" occurs',
          waterReq: '300 – 400 mm'
        },
        nutrients: {
          npk: 'N: 35, P: 25, K: 35 kg/acre (SOP - Sulphate of Potash maximizes sweet aroma and orange flesh thickness)',
          micronutrients: 'Boron (0.1%) + Calcium foliar spray prevents fruit cracking and blossom drop.'
        },
        pestsAndDiseases: {
          pests: 'Fruit Fly, Red Spider Mites, Aphids',
          diseases: 'Powdery Mildew, Fusarium Wilt, Downy Mildew',
          management: 'Fruit fly lures with cue-lure traps; Sulphur dust for Powdery mildew; Crop rotation with cereals.'
        },
        agronomy: {
          seedRate: '1.5 kg/acre (Open) / 400g (Hybrid)',
          spacing: '1.8 m × 0.5 m',
          expectedYield: '80 – 130 Quintals/acre',
          rotation: 'Wheat (Rabi) → Muskmelon → Paddy / Cotton (Kharif)',
          companion: 'Corn or Sorghum windbreak borders'
        }
      },
      {
        id: 'bottle-gourd',
        name: 'Bottle Gourd / Lauki',
        hindiName: 'लौकी / घिया',
        category: 'Cucurbit / Vegetable',
        duration: '50–70 days',
        water: 'Medium',
        soil: 'Loamy, Sandy-Loam, Fertile Alluvial',
        soilDetails: {
          bestType: 'Rich, fertile loamy soil with high organic matter and good water holding capacity.',
          idealPh: '6.5 – 7.5',
          drainage: 'Good drainage; raised beds or channel borders.',
          soilPrep: '2 deep ploughings; mix 8 tonnes FYM/acre; prepare pits or trenches.'
        },
        climate: {
          tempRange: '24°C – 36°C (Warm summer weather promotes fast vegetative vine growth and female flower ratio)',
          rainfall: 'Dry weather with regular root irrigation',
          sunlight: 'Full bright sunshine.',
          climateType: 'Warm Tropical'
        },
        irrigation: {
          method: 'Drip Irrigation with Bower/Mandap Trellis (Prevents fruit bending and spotting)',
          criticalStages: 'Flowering & Continuous Fruit Setting (Irrigate every 3–4 days in summer)',
          waterReq: '400 – 500 mm'
        },
        nutrients: {
          npk: 'N: 35, P: 25, K: 25 kg/acre (Apply N in 3 splits to support continuous fruiting)',
          micronutrients: 'Foliar spray of Micronutrient mix (Zn, Fe, B) every 15 days.'
        },
        pestsAndDiseases: {
          pests: 'Fruit Fly, Epilachna Beetle, Aphids, Mites',
          diseases: 'Downy Mildew, Anthracnose, Mosaic Virus',
          management: 'Trellis support keeps fruits clean above ground; Pheromone traps; Mancozeb spray for Anthracnose.'
        },
        agronomy: {
          seedRate: '1.5–2 kg/acre (Open) / 600g (Hybrid)',
          spacing: '2.5 m × 0.75 m (Bower/Trellis system)',
          expectedYield: '120 – 180 Quintals/acre fresh straight green gourds',
          rotation: 'Potato (Rabi) → Lauki → Maize / Soybean (Kharif)',
          companion: 'Maize or Arhar border rows'
        }
      },
      {
        id: 'bitter-gourd',
        name: 'Bitter Gourd / Karela',
        hindiName: 'करेला',
        category: 'Cucurbit / Vegetable',
        duration: '55–75 days',
        water: 'Medium',
        soil: 'Loam, Sandy-Loam, Well-Drained',
        soilDetails: {
          bestType: 'Well-drained sandy loam to silt loam rich in organic matter.',
          idealPh: '6.0 – 7.0',
          drainage: 'High drainage; very sensitive to water stagnation around root collar.',
          soilPrep: 'Deep tilling with 10 tonnes FYM/acre; erect GI wire trellis or bower system.'
        },
        climate: {
          tempRange: '24°C – 35°C (Warm sub-tropical and tropical climate; seeds germinate best above 22°C)',
          rainfall: 'Dry sunny summer with drip irrigation',
          sunlight: 'Full sunshine.',
          climateType: 'Tropical'
        },
        irrigation: {
          method: 'Drip Irrigation with Vertical Trellis Netting',
          criticalStages: 'Vine Training, Flowering, Fruit Development (Irrigate every 2–3 days in summer)',
          waterReq: '350 – 450 mm'
        },
        nutrients: {
          npk: 'N: 35, P: 25, K: 30 kg/acre + Neem cake (150 kg/acre)',
          micronutrients: 'Boron (0.1%) + Magnesium Sulphate foliar spray at flowering.'
        },
        pestsAndDiseases: {
          pests: 'Melon Fruit Fly (Bactrocera cucurbitae), Whitefly, Leaf Miner',
          diseases: 'Downy Mildew, Powdery Mildew, Mosaic Virus',
          management: 'Cue-lure fruit fly pheromone traps; Bagging young fruits with paper/cloth; Trichoderma drenching.'
        },
        agronomy: {
          seedRate: '1.5–2 kg/acre (Open) / 500g (Hybrid)',
          spacing: '2.0 m × 0.6 m on trellis nets',
          expectedYield: '50 – 80 Quintals/acre green spiky fruits',
          rotation: 'Wheat (Rabi) → Karela → Cabbage (Rabi)',
          companion: 'Marigold or Basil companion crop'
        }
      },
      {
        id: 'moong-zaid',
        name: 'Moong / Green Gram (Zaid Summer)',
        hindiName: 'जायद मूंग',
        category: 'Pulse / Legume',
        duration: '55–65 days',
        water: 'Low',
        soil: 'Sandy-Loam, Loam, Alluvial',
        soilDetails: {
          bestType: 'Well-drained fertile loamy to sandy loam soil with good moisture holding capacity.',
          idealPh: '6.5 – 7.5',
          drainage: 'Good drainage; no waterlogging.',
          soilPrep: 'Zero-tillage / Happy Seeder direct drilling into wheat stubbles or 1 shallow harrowing.'
        },
        climate: {
          tempRange: '25°C – 38°C (High summer heat accelerates pod maturity; ideal 60-day window before monsoon)',
          rainfall: 'Low summer rain / Assured 3–4 canal/tubewell irrigations',
          sunlight: 'Bright sunny days.',
          climateType: 'Warm Summer Sub-tropical'
        },
        irrigation: {
          method: 'Sprinkler / Border Strip',
          criticalStages: 'Sowing (Palewa), Branching (20–25 DAS), Pod Setting (40–45 DAS)',
          waterReq: '200 – 280 mm (3–4 light irrigations)'
        },
        nutrients: {
          npk: 'N: 8, P: 20, K: 10 kg/acre (Leaves 25–40 kg atmospheric Nitrogen in soil for next Paddy crop!)',
          micronutrients: 'Rhizobium seed culture + 2% DAP spray at flower initiation.'
        },
        pestsAndDiseases: {
          pests: 'Thrips, Whitefly, Yellow Pod Borer',
          diseases: 'Yellow Mosaic Virus (MYMV)',
          management: 'Grow short-duration synchronous maturity varieties (Virat, SML-668, IPM-205-7); Thiamethoxam seed treatment.'
        },
        agronomy: {
          seedRate: '10–12 kg/acre (Higher seed rate for summer)',
          spacing: '22.5 cm × 8 cm',
          expectedYield: '5 – 8 Quintals/acre + Green manuring stubble biomass',
          rotation: 'Wheat (Rabi) → Summer Moong → Rice / Maize (Kharif)',
          companion: 'Soil-enriching catch crop between Rabi harvest and Kharif transplanting'
        }
      },
      {
        id: 'pumpkin',
        name: 'Pumpkin / Kaddu',
        hindiName: 'कद्दू / सीताफल',
        category: 'Cucurbit / Vegetable',
        duration: '60–80 days',
        water: 'Medium',
        soil: 'Loamy, Sandy-Loam, Well-Drained',
        soilDetails: {
          bestType: 'Deep, rich fertile loamy to sandy-loam soils with high organic matter.',
          idealPh: '6.0 – 7.5',
          drainage: 'High drainage; tolerant of hot summer soil surface.',
          soilPrep: 'Apply 8 tonnes FYM/acre; prepare pits (60×60×60 cm) spaced 2.5 m apart.'
        },
        climate: {
          tempRange: '25°C – 36°C (Warm sunny weather for high fruit size and orange beta-carotene flesh development)',
          rainfall: 'Dry summer with assured furrow irrigation',
          sunlight: 'Full direct sunshine (>8 hrs/day).',
          climateType: 'Warm Tropical'
        },
        irrigation: {
          method: 'Drip / Pit Furrow Irrigation',
          criticalStages: 'Vine Spreading, Flowering, Fruit Expansion (Irrigate every 4–5 days in summer)',
          waterReq: '350 – 450 mm'
        },
        nutrients: {
          npk: 'N: 35, P: 25, K: 30 kg/acre',
          micronutrients: 'Micronutrient foliar spray at flower initiation.'
        },
        pestsAndDiseases: {
          pests: 'Red Pumpkin Beetle, Fruit Fly, Aphids',
          diseases: 'Powdery Mildew, Downy Mildew, Mosaic Virus',
          management: 'Wood ash dusting on young seedlings repels pumpkin beetles; Pheromone traps; Mancozeb spray.'
        },
        agronomy: {
          seedRate: '1.5 kg/acre (Open) / 400g (Hybrid)',
          spacing: '2.5 m × 1.0 m',
          expectedYield: '120 – 180 Quintals/acre large solid pumpkins',
          rotation: 'Rabi Crop → Pumpkin → Soybean / Paddy (Kharif)',
          companion: 'Corn and Bean companion planting (Classic Three Sisters method)'
        }
      },
      {
        id: 'cowpea-zaid',
        name: 'Cowpea / Lobia (Summer)',
        hindiName: 'लोबिया / चौलाई',
        category: 'Pulse / Vegetable & Fodder',
        duration: '60–75 days',
        water: 'Low-Medium',
        soil: 'Sandy-Loam, Loam, Red Soil',
        soilDetails: {
          bestType: 'Sandy loam to clay loam; highly adaptable and tolerant of moderate soil acidity and low fertility.',
          idealPh: '5.5 – 7.5',
          drainage: 'Good drainage; deep taproot provides high drought resilience.',
          soilPrep: '1–2 shallow ploughings and planking.'
        },
        climate: {
          tempRange: '25°C – 38°C (Warm tropical weather; heat and drought tolerant)',
          rainfall: '30 – 50 cm',
          sunlight: 'Full bright sunshine.',
          climateType: 'Tropical'
        },
        irrigation: {
          method: 'Sprinkler / Light Furrow',
          criticalStages: 'Flowering (30–35 DAS) and Pod formation (50 DAS)',
          waterReq: '250 – 350 mm (3–4 light summer irrigations)'
        },
        nutrients: {
          npk: 'N: 10, P: 25, K: 10 kg/acre (Fixes 60–80 kg N/ha in soil)',
          micronutrients: 'Rhizobium seed inoculation + PSB.'
        },
        pestsAndDiseases: {
          pests: 'Aphids, Pod Borer, Leafhopper',
          diseases: 'Anthracnose, Cercospora Leaf Spot, Cowpea Mosaic Virus',
          management: 'Neem seed kernel extract (NSKE 5%) spray for aphids; Seed treatment with Thiram.'
        },
        agronomy: {
          seedRate: '8–10 kg/acre (Grain) / 15 kg/acre (Fodder/Green Pods)',
          spacing: '30 cm × 10 cm',
          expectedYield: '6 – 9 Quintals dry grain / 35–45 Quintals green pods/acre',
          rotation: 'Wheat (Rabi) → Cowpea → Rice / Cotton (Kharif)',
          companion: 'Maize or Sorghum intercropping'
        }
      },
      {
        id: 'marigold-zaid',
        name: 'Marigold (Zaid Summer)',
        hindiName: 'गेंदा फूल',
        category: 'Floriculture / Cash Crop',
        duration: '60–90 days',
        water: 'Medium',
        soil: 'Sandy-Loam, Any Fertile Well-Drained',
        soilDetails: {
          bestType: 'Rich, fertile sandy-loam with good organic matter and loose friable structure.',
          idealPh: '6.5 – 7.5',
          drainage: 'Well-drained; roots release natural nematicides (alpha-terthienyl) that sterilize soil nematodes!',
          soilPrep: 'Incorporate 8 tonnes FYM/acre; prepare raised beds with drip lines.'
        },
        climate: {
          tempRange: '22°C – 35°C (Warm sunny summer weather; bright flowers with high lutein/xanthophyll pigments)',
          rainfall: 'Dry summer with assured drip irrigation',
          sunlight: 'Full direct sunlight (>8 hrs/day).',
          climateType: 'Warm Sub-tropical'
        },
        irrigation: {
          method: 'Drip Irrigation / Furrow Method',
          criticalStages: 'Transplanting, Pinching (30 DAT), Budding & Continuous Flower Plucking (Every 3–4 days)',
          waterReq: '350 – 450 mm'
        },
        nutrients: {
          npk: 'N: 40, P: 30, K: 30 kg/acre (Pinch top shoot at 30 DAT to promote 15–20 bushy flowering branches)',
          micronutrients: 'Foliar spray of 19:19:19 + Micronutrients every 12 days.'
        },
        pestsAndDiseases: {
          pests: 'Red Spider Mites, Thrips, Bud Caterpillar',
          diseases: 'Alternaria Leaf Spot, Flower Blight, Damping Off',
          management: 'Neem oil spray for mites; Mancozeb spray for leaf spot; Ideal natural nematode-suppressing break crop.'
        },
        agronomy: {
          seedRate: '250–300g/acre for African Marigold (Nursery transplanting at 25 days)',
          spacing: '45 cm × 45 cm or 60 cm × 45 cm',
          expectedYield: '50 – 80 Quintals/acre fresh bright yellow/orange flower garlands',
          rotation: 'Vegetables → Marigold (Nematode Cleaning Break Crop) → Vegetables',
          companion: 'Universal companion and trap crop around tomatoes, chillies, and cotton'
        }
      },
      {
        id: 'fodder-sorghum',
        name: 'Fodder Sorghum / Napier (Zaid)',
        hindiName: 'हरा चारा (चरी / नेपियर)',
        category: 'Green Fodder / Livestock',
        duration: '45–60 days (Multi-cut)',
        water: 'Medium',
        soil: 'Any Fertile, Loamy, Alluvial',
        soilDetails: {
          bestType: 'Fertile loams and alluvial soils with high organic matter and nitrogen.',
          idealPh: '6.0 – 8.0',
          drainage: 'Good drainage; drought tolerant.',
          soilPrep: '2 ploughings with 10 tonnes FYM/acre to sustain high biomass cuttings.'
        },
        climate: {
          tempRange: '25°C – 40°C (High temperature promotes rapid leafy biomass synthesis for dairy livestock)',
          rainfall: 'Summer irrigated',
          sunlight: 'Full sunshine.',
          climateType: 'Tropical'
        },
        irrigation: {
          method: 'Border Strip / Flood',
          criticalStages: 'Irrigate immediately after each harvest cutting + every 8–10 days in peak summer',
          waterReq: '400 – 550 mm'
        },
        nutrients: {
          npk: 'N: 45, P: 20, K: 15 kg/acre (Apply 20 kg N after every green cutting)',
          micronutrients: 'Zinc Sulphate + Azospirillum biofertilizer.'
        },
        pestsAndDiseases: {
          pests: 'Shoot Fly, Stem Borer, Grasshopper',
          diseases: 'Leaf Blight, Anthracnose',
          management: 'Harvest after 45 days when hydrocyanic acid (HCN) toxicity declines below safe 200 ppm threshold.'
        },
        agronomy: {
          seedRate: '12–15 kg/acre (Multi-cut varieties: SSG-59-3, CSH-24MF)',
          spacing: '25–30 cm × continuous row',
          expectedYield: '250 – 350 Quintals/acre green juicy palatable fodder (across 3–4 summer cuts)',
          rotation: 'Wheat (Rabi) → Fodder → Paddy (Kharif)',
          companion: 'Cowpea intercrop (3:1 ratio) significantly increases protein content of green fodder'
        }
      }
    ]
  }
];

export const SOIL_TYPES_CATALOG = [
  {
    name: 'Alluvial Soil',
    nameHi: 'जलोढ़ मिट्टी',
    color: '#10b981',
    description: 'Found across Indo-Gangetic plains, rich in Potash & Phosphoric acid. Extremely fertile for Wheat, Paddy, Sugarcane, and Pulses.',
    ph: '6.5 – 7.8',
    waterRetention: 'Medium to High',
    bestCrops: ['Wheat', 'Rice / Paddy', 'Sugarcane', 'Maize / Corn', 'Mustard', 'Potato']
  },
  {
    name: 'Black Cotton Soil (Regur)',
    nameHi: 'काली कपास मिट्टी',
    color: '#6366f1',
    description: 'Deep clayey soil rich in Calcium, Magnesium & Carbonates. High moisture holding capacity with deep swelling/shrinking cracking.',
    ph: '7.2 – 8.5',
    waterRetention: 'Very High',
    bestCrops: ['Cotton', 'Soybean', 'Sorghum / Jowar', 'Gram / Chickpea', 'Safflower', 'Turmeric']
  },
  {
    name: 'Red & Yellow Soil',
    nameHi: 'लाल व पीली मिट्टी',
    color: '#ef4444',
    description: 'Formed from crystalline rocks, rich in Iron (red color) but low in Nitrogen & Phosphorous. Needs organic manure & balanced NPK.',
    ph: '5.5 – 6.8',
    waterRetention: 'Low to Medium',
    bestCrops: ['Groundnut / Peanut', 'Pigeon Pea / Arhar', 'Castor', 'Millets / Bajra', 'Chilli']
  },
  {
    name: 'Sandy-Loam & Desert Soil',
    nameHi: 'बलुई दोमट व रेतीली मिट्टी',
    color: '#f59e0b',
    description: 'Light textured with high porosity, rapid drainage and low water holding capacity. Best with drip fertigation and mulching.',
    ph: '7.0 – 8.5',
    waterRetention: 'Low',
    bestCrops: ['Watermelon', 'Muskmelon', 'Cucumber', 'Pearl Millet / Bajra', 'Cluster Bean / Guar', 'Sesame']
  },
  {
    name: 'Clay & Clay-Loam',
    nameHi: 'चिकनी दोमट मिट्टी',
    color: '#8b5cf6',
    description: 'Fine textured, heavy soil with slow infiltration and high nutrient holding power. Perfect for lowland puddle paddy and tubers.',
    ph: '6.0 – 7.5',
    waterRetention: 'High',
    bestCrops: ['Rice / Paddy', 'Wheat', 'Sugarcane', 'Potato', 'Garlic', 'Cauliflower']
  }
];
