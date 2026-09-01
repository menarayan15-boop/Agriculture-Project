import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SEASONS = [
  {
    id: 'kharif',
    name: 'Kharif (Monsoon)',
    icon: 'fa-cloud-showers-heavy',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.4)',
    sowing: 'June – July',
    harvest: 'September – October',
    sowMonths: [5, 6],
    growMonths: [7, 8],
    harvestMonths: [9, 10],
    crops: [
      {
        name: 'Rice / Paddy (धान)',
        duration: '120–145 days',
        water: '1200 mm (High)',
        soil: 'Clay, Clay-Loam, Alluvial',
        seedRate: '15–20 kg/acre (Transplanting)',
        spacing: '20 cm × 15 cm',
        yieldBenchmark: '24–28 Qtl / Acre',
        nutrientReq: 'Urea: 50 kg | DAP: 30 kg | MOP: 20 kg | Zinc: 10 kg',
        irrigationPhases: 'Nursery, Active Tillering, Panicle Initiation, Flowering',
        rotation: 'Paddy (Kharif) → Wheat (Rabi) → Moong (Zaid)',
        rotationBenefit: 'Puddling improves clay water holding; follow with Wheat and legume Moong for nitrogen recharge.',
        pestAlert: 'Yellow Stem Borer, Leaf Folder — Soak seed in Carbendazim + Streptocycline.',
        harvestIndicator: '80-85% panicles turn golden straw yellow.'
      },
      {
        name: 'Maize / Corn (मक्का)',
        duration: '90–110 days',
        water: '550 mm (Medium)',
        soil: 'Loamy, Sandy-Loam, Alluvial',
        seedRate: '8–10 kg/acre',
        spacing: '60 cm × 20 cm',
        yieldBenchmark: '20–25 Qtl / Acre',
        nutrientReq: 'Urea: 45 kg | DAP: 35 kg | MOP: 15 kg',
        irrigationPhases: 'Knee-High Stage (25d), Tasseling / Silking (50d), Grain Filling (75d)',
        rotation: 'Maize (Kharif) → Mustard (Rabi) → Potato / Vegetables',
        rotationBenefit: 'Deep rooting loosens soil; excellent fit before winter oilseed Mustard.',
        pestAlert: 'Fall Armyworm (FAW) — Coat seed with Cyantraniliprole 600 FS.',
        harvestIndicator: 'Husk leaves dry and black layer forms at grain base.'
      },
      {
        name: 'Cotton (कपास)',
        duration: '150–180 days',
        water: '750 mm (Medium-High)',
        soil: 'Deep Black Cotton, Clay Loam',
        seedRate: '1.5–2 kg/acre (Bt Cotton)',
        spacing: '90 cm × 60 cm',
        yieldBenchmark: '10–14 Qtl / Acre',
        nutrientReq: 'Urea: 40 kg | DAP: 30 kg | MOP: 25 kg',
        irrigationPhases: 'Square Formation (45d), Flowering (70d), Boll Development (100d)',
        rotation: 'Cotton (Kharif) → Wheat / Sunflower (Rabi) → Legume Fallow',
        rotationBenefit: 'Long taproot accesses subsoil nutrients; rotating with legumes controls soil-borne nematodes.',
        pestAlert: 'Pink Bollworm, Whitefly — Use pheromone traps & Carboxin seed treatment.',
        harvestIndicator: 'Bolls open cleanly with white fluffy lint.'
      },
      {
        name: 'Groundnut / Peanut (मूंगफली)',
        duration: '105–120 days',
        water: '450 mm (Medium)',
        soil: 'Light Sandy Loam, Red Soil',
        seedRate: '45–50 kg/acre (Kernel)',
        spacing: '30 cm × 10 cm',
        yieldBenchmark: '11–14 Qtl / Acre',
        nutrientReq: 'Urea: 15 kg | DAP: 30 kg | MOP: 20 kg | Gypsum: 100 kg',
        irrigationPhases: 'Flowering (30d), Pegging (45d), Pod Filling (70d)',
        rotation: 'Groundnut (Kharif) → Wheat (Rabi) → Fallow / Sesame',
        rotationBenefit: 'Fixes 40-60 kg N/ha; leaf litter adds organic matter to light soils.',
        pestAlert: 'Tikka Leaf Spot, White Grub — Treat pods with Mancozeb 3g/kg.',
        harvestIndicator: 'Pod inner wall turns dark brown upon shelling.'
      },
      {
        name: 'Soybean (सोयाबीन)',
        duration: '95–110 days',
        water: '500 mm (Medium)',
        soil: 'Black Cotton, Clay Loam',
        seedRate: '25–30 kg/acre',
        spacing: '45 cm × 5 cm',
        yieldBenchmark: '9–12 Qtl / Acre',
        nutrientReq: 'Urea: 15 kg | DAP: 40 kg | MOP: 20 kg | Sulphur: 10 kg',
        irrigationPhases: 'Flowering (35d), Pod Formation (55d), Seed Filling (75d)',
        rotation: 'Soybean (Kharif) → Wheat (Rabi) → Moong / Maize',
        rotationBenefit: 'Adds 80-120 kg N/ha into soil; leaves enrich topsoil for subsequent Wheat crop.',
        pestAlert: 'Girdle Beetle, Yellow Mosaic Virus — Inoculate with Rhizobium japonicum.',
        harvestIndicator: '95% leaves shed and pods rattle when shaken.'
      },
      {
        name: 'Sugarcane (गन्ना)',
        duration: '300–360 days',
        water: '1500 mm (Very High)',
        soil: 'Deep Alluvial, Heavy Clay, Black Soil',
        seedRate: '35,000–40,000 Setts/acre',
        spacing: '90 cm × 30 cm',
        yieldBenchmark: '320–380 Qtl / Acre',
        nutrientReq: 'Urea: 120 kg | DAP: 60 kg | MOP: 40 kg',
        irrigationPhases: 'Germination (30d), Formative Stage (60-120d), Grand Growth (120-250d)',
        rotation: 'Sugarcane (Autumn) → Ratoon Crop → Legume / Pulse Crop',
        rotationBenefit: 'Massive bio-mass generation; ratoon cropping saves land prep cost.',
        pestAlert: 'Early Shoot Borer, Red Rot — Dip setts in Carbendazim or hot water (52°C).',
        harvestIndicator: 'Hand refractometer Brix juice reading exceeds 18%.'
      },
      {
        name: 'Pearl Millet / Bajra (बाजरा)',
        duration: '80–95 days',
        water: '350 mm (Low)',
        soil: 'Sandy Loam, Light Arid Soil',
        seedRate: '1.5–2 kg/acre',
        spacing: '45 cm × 12 cm',
        yieldBenchmark: '12–16 Qtl / Acre',
        nutrientReq: 'Urea: 30 kg | DAP: 20 kg | MOP: 10 kg',
        irrigationPhases: 'Tillering (20d), Flowering (45d), Grain Formation',
        rotation: 'Bajra (Kharif) → Mustard (Rabi) → Fallow / Moong',
        rotationBenefit: 'Extremely drought hardy; ideal break crop for dryland soils.',
        pestAlert: 'Downy Mildew, Ergot — Treat seed with Metalaxyl 35 SD 6g/kg.',
        harvestIndicator: 'Earheads turn greyish-brown and grain hardens.'
      },
      {
        name: 'Sorghum / Jowar (ज्वार)',
        duration: '100–115 days',
        water: '400 mm (Low)',
        soil: 'Medium Black, Loamy Soil',
        seedRate: '3–4 kg/acre',
        spacing: '45 cm × 15 cm',
        yieldBenchmark: '13–17 Qtl / Acre',
        nutrientReq: 'Urea: 35 kg | DAP: 25 kg | MOP: 10 kg',
        irrigationPhases: 'Flag Leaf Stage (35d), Booting & Grain Filling',
        rotation: 'Jowar (Kharif) → Gram / Chickpea (Rabi) → Fallow',
        rotationBenefit: 'Provides rich cattle green fodder and grain while conserving subsoil water.',
        pestAlert: 'Shoot Fly, Stem Borer — Seed treatment with Imidacloprid 70 WS.',
        harvestIndicator: 'Grains turn hard and panicle stalk dries completely.'
      },
      {
        name: 'Moong / Green Gram (मूंग)',
        duration: '60–70 days',
        water: '300 mm (Low)',
        soil: 'Sandy Loam, Alluvial Soil',
        seedRate: '8–10 kg/acre',
        spacing: '30 cm × 10 cm',
        yieldBenchmark: '5–7 Qtl / Acre',
        nutrientReq: 'Urea: 10 kg | DAP: 30 kg | MOP: 10 kg',
        irrigationPhases: 'Flowering (30d), Pod Formation (45d)',
        rotation: 'Moong (Kharif) → Wheat (Rabi) → Paddy (Kharif)',
        rotationBenefit: 'Fast 60-day crop; adds 30-40 kg N/ha and improves soil structure.',
        pestAlert: 'Whitefly, Yellow Mosaic Virus — Spray Neem oil 10,000 ppm.',
        harvestIndicator: 'Pods turn dark brown/black.'
      },
      {
        name: 'Urad / Black Gram (उड़द)',
        duration: '70–85 days',
        water: '320 mm (Low-Medium)',
        soil: 'Loam, Clay Loam',
        seedRate: '8–10 kg/acre',
        spacing: '30 cm × 10 cm',
        yieldBenchmark: '5–7 Qtl / Acre',
        nutrientReq: 'Urea: 10 kg | DAP: 30 kg | MOP: 10 kg',
        irrigationPhases: 'Flowering, Pod Development',
        rotation: 'Urad (Kharif) → Wheat (Rabi) → Urad / Vegetables',
        rotationBenefit: 'Enriches soil organic nitrogen and suppresses weed growth.',
        pestAlert: 'Hairy Caterpillar, YMV — Treat seeds with Captan 2.5g/kg.',
        harvestIndicator: 'Pods dry and turn dark black.'
      },
      {
        name: 'Pigeon Pea / Tur (अरहर)',
        duration: '150–180 days',
        water: '400 mm (Low)',
        soil: 'Deep Well-Drained Loam',
        seedRate: '5–6 kg/acre',
        spacing: '60 cm × 20 cm',
        yieldBenchmark: '7–10 Qtl / Acre',
        nutrientReq: 'Urea: 10 kg | DAP: 40 kg | MOP: 15 kg',
        irrigationPhases: 'Flower Bud Initiation, Pod Formation',
        rotation: 'Tur + Sorghum (Intercrop) → Wheat / Fallow (Rabi)',
        rotationBenefit: 'Deep taproot breaks hard soil pans and fixes 100 kg N/ha.',
        pestAlert: 'Pod Borer (Helicoverpa), Fusarium Wilt — Inoculate Trichoderma viride.',
        harvestIndicator: '80% pods dry and turn yellow-brown.'
      },
      {
        name: 'Okra / Bhindi (भिंडी)',
        duration: '70–90 days',
        water: '400 mm (Medium)',
        soil: 'Loamy, Sandy Loam',
        seedRate: '3.5–4 kg/acre',
        spacing: '45 cm × 30 cm',
        yieldBenchmark: '50–65 Qtl / Acre',
        nutrientReq: 'Urea: 40 kg | DAP: 30 kg | MOP: 20 kg',
        irrigationPhases: 'Germination, Flowering, Continuous Picking',
        rotation: 'Okra (Kharif) → Potato / Peas (Rabi) → Watermelon (Zaid)',
        rotationBenefit: 'High value commercial vegetable providing quick cash flow.',
        pestAlert: 'Yellow Vein Mosaic Virus, Jassids — Soak seed in Imidacloprid.',
        harvestIndicator: 'Harvest tender 3-4 inch pods every alternate day.'
      },
      {
        name: 'Chilli / Red Pepper (मिर्च)',
        duration: '140–170 days',
        water: '500 mm (Medium)',
        soil: 'Sandy Loam, Black Cotton',
        seedRate: '200–250 g/acre (Nursery)',
        spacing: '60 cm × 45 cm',
        yieldBenchmark: '35–45 Qtl / Acre',
        nutrientReq: 'Urea: 45 kg | DAP: 35 kg | MOP: 30 kg',
        irrigationPhases: 'Transplanting, Flowering, Fruit Setting',
        rotation: 'Chilli (Kharif) → Onion (Rabi) → Wheat (Rabi)',
        rotationBenefit: 'High cash returns per acre; breaks monoculture grain pest cycles.',
        pestAlert: 'Chilli Thrips, Mites, Anthracnose — Dip roots in Pseudomonas.',
        harvestIndicator: 'Pick green chillies weekly or mature red pods for drying.'
      }
    ]
  },
  {
    id: 'rabi',
    name: 'Rabi (Winter)',
    icon: 'fa-snowflake',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.1)',
    border: 'rgba(56, 189, 248, 0.4)',
    sowing: 'October – November',
    harvest: 'February – April',
    sowMonths: [9, 10],
    growMonths: [11, 0],
    harvestMonths: [1, 2, 3],
    crops: [
      {
        name: 'Wheat (गेहूं)',
        duration: '110–125 days',
        water: '450 mm (Medium)',
        soil: 'Well-Drained Alluvial, Clay Loam',
        seedRate: '40–45 kg/acre',
        spacing: '22.5 cm Row Spacing',
        yieldBenchmark: '20–25 Qtl / Acre',
        nutrientReq: 'Urea: 55 kg | DAP: 40 kg | MOP: 20 kg',
        irrigationPhases: 'CRI Stage (21d), Tillering (42d), Flowering (70d), Milk Stage (90d)',
        rotation: 'Paddy (Kharif) → Wheat (Rabi) → Moong (Zaid)',
        rotationBenefit: 'Staple winter cereal responding heavily to first CRI irrigation.',
        pestAlert: 'Loose Smut, Rust, Aphids — Treat seed with Tebuconazole 1.5g/kg.',
        harvestIndicator: 'Crop turns golden yellow and grain moisture drops below 14%.'
      },
      {
        name: 'Mustard / Sarson (सरसों)',
        duration: '105–120 days',
        water: '300 mm (Low)',
        soil: 'Loamy, Sandy Loam',
        seedRate: '1.5–2 kg/acre',
        spacing: '30 cm × 10 cm',
        yieldBenchmark: '8–11 Qtl / Acre',
        nutrientReq: 'Urea: 35 kg | DAP: 25 kg | MOP: 15 kg | Sulphur: 10 kg',
        irrigationPhases: 'Rosette Stage (25d), Flowering (45d), Pod Filling (70d)',
        rotation: 'Bajra (Kharif) → Mustard (Rabi) → Fallow / Moong',
        rotationBenefit: 'Low water consumption; Sulphur application boosts seed oil by 3-5%.',
        pestAlert: 'Mustard Aphids, White Rust — Spray Dimethoate or Metalaxyl.',
        harvestIndicator: '75% pods turn yellow to avoid seed shattering.'
      },
      {
        name: 'Gram / Chickpea (चना)',
        duration: '110–120 days',
        water: '250 mm (Low)',
        soil: 'Clay Loam, Black Cotton',
        seedRate: '25–30 kg/acre',
        spacing: '30 cm × 10 cm',
        yieldBenchmark: '9–12 Qtl / Acre',
        nutrientReq: 'Urea: 10 kg | DAP: 35 kg | MOP: 15 kg',
        irrigationPhases: 'Pre-Flowering (45d), Pod Development (75d)',
        rotation: 'Paddy (Kharif) → Chickpea (Rabi) → Sesame (Zaid)',
        rotationBenefit: 'Thrives on residual moisture; fixes 40 kg N/ha.',
        pestAlert: 'Pod Borer (Helicoverpa), Fusarium Wilt — Nipping tips at 35d increases pods.',
        harvestIndicator: 'Leaves turn yellow and dry pods rattle.'
      },
      {
        name: 'Barley / Jau (जौ)',
        duration: '100–115 days',
        water: '300 mm (Low)',
        soil: 'Sandy Loam, Saline/Alkaline Soil',
        seedRate: '35–40 kg/acre',
        spacing: '22.5 cm Row Spacing',
        yieldBenchmark: '16–20 Qtl / Acre',
        nutrientReq: 'Urea: 35 kg | DAP: 25 kg | MOP: 15 kg',
        irrigationPhases: 'Tillering (30d), Flowering (60d)',
        rotation: 'Cluster Bean (Kharif) → Barley (Rabi) → Fallow',
        rotationBenefit: 'Highly salt and drought tolerant; ideal for problem soils.',
        pestAlert: 'Covered Smut, Rust — Treat seed with Carboxin 2g/kg.',
        harvestIndicator: 'Straw turns light golden yellow.'
      },
      {
        name: 'Potato (आलू)',
        duration: '100–115 days',
        water: '500 mm (Medium)',
        soil: 'Loose Sandy Loam, Alluvial',
        seedRate: '800–1000 kg/acre (Tubers)',
        spacing: '60 cm × 20 cm',
        yieldBenchmark: '110–130 Qtl / Acre',
        nutrientReq: 'Urea: 60 kg | DAP: 50 kg | MOP: 40 kg',
        irrigationPhases: 'Sprouting (15d), Tuber Initiation (30d), Tuber Bulking (60d)',
        rotation: 'Paddy (Kharif) → Potato (Rabi) → Sunflower / Cucurbits (Zaid)',
        rotationBenefit: 'High value tuber crop; heavy organic residue left in soil.',
        pestAlert: 'Late Blight, Early Blight — Dip seed tubers in Mancozeb (3g/L).',
        harvestIndicator: 'Dehaulm (cut top foliage) 10-12 days before digging.'
      },
      {
        name: 'Onion (Rabi) (प्याज)',
        duration: '120–140 days',
        water: '550 mm (Medium)',
        soil: 'Friable Sandy Loam, Alluvial',
        seedRate: '3–4 kg/acre (Nursery)',
        spacing: '15 cm × 10 cm',
        yieldBenchmark: '90–110 Qtl / Acre',
        nutrientReq: 'Urea: 45 kg | DAP: 35 kg | MOP: 30 kg',
        irrigationPhases: 'Transplanting, Bulb Initiation (45d), Bulb Expansion (75d)',
        rotation: 'Rice (Kharif) → Onion (Rabi) → Watermelon (Zaid)',
        rotationBenefit: 'Sulphur application improves pungency and shelf life.',
        pestAlert: 'Onion Thrips, Purple Blotch — Dip root seedlings in Carbendazim.',
        harvestIndicator: '50% tops fall naturally (neck fall stage).'
      },
      {
        name: 'Garlic (लहसुन)',
        duration: '130–150 days',
        water: '400 mm (Medium)',
        soil: 'Rich Sandy Loam with Humus',
        seedRate: '200–250 kg Cloves/acre',
        spacing: '15 cm × 7.5 cm',
        yieldBenchmark: '40–50 Qtl / Acre',
        nutrientReq: 'Urea: 40 kg | DAP: 30 kg | MOP: 25 kg',
        irrigationPhases: 'Germination, Bulbing, Clove Expansion',
        rotation: 'Soybean (Kharif) → Garlic (Rabi) → Cucumber (Zaid)',
        rotationBenefit: 'Medicinal spice crop with high market returns.',
        pestAlert: 'Thrips, Basal Rot — Treat seed cloves with Thiram 3g/kg.',
        harvestIndicator: 'Leaves dry and turn yellowish-brown.'
      },
      {
        name: 'Lentil / Masoor Dal (मसूर)',
        duration: '110–125 days',
        water: '220 mm (Low)',
        soil: 'Loamy, Alluvial Soil',
        seedRate: '12–15 kg/acre',
        spacing: '30 cm × 5 cm',
        yieldBenchmark: '6–8 Qtl / Acre',
        nutrientReq: 'Urea: 10 kg | DAP: 30 kg | MOP: 10 kg',
        irrigationPhases: 'Flowering Stage, Pod Development',
        rotation: 'Sorghum (Kharif) → Lentil (Rabi) → Sesame (Zaid)',
        rotationBenefit: 'Low water requirement pulse that fixes soil nitrogen.',
        pestAlert: 'Lentil Rust, Stemphylium Blight — Inoculate with Rhizobium.',
        harvestIndicator: 'Plants turn brown and lower pods dry.'
      }
    ]
  },
  {
    id: 'zaid',
    name: 'Zaid (Summer)',
    icon: 'fa-sun',
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.1)',
    border: 'rgba(251, 191, 36, 0.4)',
    sowing: 'March – April',
    harvest: 'May – June',
    sowMonths: [2, 3],
    growMonths: [4],
    harvestMonths: [5, 6],
    crops: [
      {
        name: 'Watermelon (तरबूज)',
        duration: '80–95 days',
        water: '400 mm (Medium)',
        soil: 'Sandy Riverbed, Light Loam',
        seedRate: '1–1.5 kg/acre',
        spacing: '2 m × 0.5 m',
        yieldBenchmark: '140–160 Qtl / Acre',
        nutrientReq: 'Urea: 40 kg | DAP: 30 kg | MOP: 30 kg',
        irrigationPhases: 'Vining (25d), Flowering (45d), Fruit Expansion (65d)',
        rotation: 'Wheat (Rabi) → Watermelon (Zaid) → Maize (Kharif)',
        rotationBenefit: 'Utilizes summer sunshine; silver mulch + drip yields Brix > 11.',
        pestAlert: 'Fruit Fly, Powdery Mildew — Soak seed in Carbendazim 2g/L.',
        harvestIndicator: 'Tendril near stalk turns dry and fruit bottom turns dull yellow.'
      },
      {
        name: 'Muskmelon / Kharbuja (खरबूजा)',
        duration: '75–90 days',
        water: '350 mm (Medium)',
        soil: 'Sandy Loam, Alluvial',
        seedRate: '800 g–1 kg/acre',
        spacing: '1.5 m × 0.5 m',
        yieldBenchmark: '85–100 Qtl / Acre',
        nutrientReq: 'Urea: 35 kg | DAP: 25 kg | MOP: 25 kg',
        irrigationPhases: 'Vining, Flowering, Fruit Netting',
        rotation: 'Wheat (Rabi) → Muskmelon (Zaid) → Paddy (Kharif)',
        rotationBenefit: 'Aromatic summer melon with high market value.',
        pestAlert: 'Fruit Fly, Fusarium Wilt — Treat seed with Thiram 3g/kg.',
        harvestIndicator: 'Full slip stage (fruit detaches easily from vine).'
      },
      {
        name: 'Cucumber (खीरा)',
        duration: '50–65 days',
        water: '350 mm (Medium)',
        soil: 'Rich Loamy, Silt Soil',
        seedRate: '1 kg/acre',
        spacing: '1.5 m × 0.4 m',
        yieldBenchmark: '75–90 Qtl / Acre',
        nutrientReq: 'Urea: 30 kg | DAP: 25 kg | MOP: 20 kg',
        irrigationPhases: 'Vining, Flowering, Continuous Picking',
        rotation: 'Wheat (Rabi) → Cucumber (Zaid) → Tomato (Kharif)',
        rotationBenefit: 'Fast 45-day salad crop providing quick cash returns.',
        pestAlert: 'Red Pumpkin Beetle, Downy Mildew — Treat seed with Trichoderma.',
        harvestIndicator: 'Harvest tender green fruits every 2 days.'
      },
      {
        name: 'Moong / Green Gram (Zaid) (मूंग)',
        duration: '55–70 days',
        water: '280 mm (Low)',
        soil: 'Sandy Loam, Loam',
        seedRate: '10–12 kg/acre',
        spacing: '25 cm × 10 cm',
        yieldBenchmark: '5–7 Qtl / Acre',
        nutrientReq: 'Urea: 10 kg | DAP: 30 kg | MOP: 10 kg',
        irrigationPhases: 'Flowering, Pod Formation',
        rotation: 'Wheat (Rabi) → Moong (Zaid) → Paddy / Maize (Kharif)',
        rotationBenefit: 'Captures summer window to fix 35 kg N/ha before monsoon Paddy.',
        pestAlert: 'Whitefly, Yellow Mosaic Virus — Spray Neem oil 10,000 ppm.',
        harvestIndicator: 'Pods turn dark brown/black.'
      }
    ]
  }
];

function MonthBar({ season }) {
  return (
    <div style={{ display: 'flex', gap: '3px', marginTop: '12px', flexWrap: 'nowrap', overflowX: 'auto' }}>
      {MONTHS.map((m, idx) => {
        const isSow = season.sowMonths.includes(idx);
        const isGrow = season.growMonths.includes(idx);
        const isHarvest = season.harvestMonths.includes(idx);
        let bg = 'rgba(255,255,255,0.05)';
        let label = '';
        let textColor = 'var(--text-secondary)';
        if (isSow) { bg = season.color; textColor = '#000'; label = 'Sow'; }
        else if (isHarvest) { bg = '#f97316'; textColor = '#000'; label = 'Harv'; }
        else if (isGrow) { bg = 'rgba(74, 222, 128, 0.3)'; textColor = 'var(--primary-light)'; label = 'Grow'; }

        return (
          <div key={m} style={{
            flex: '1', minWidth: '28px', textAlign: 'center', padding: '6px 2px',
            borderRadius: '6px', background: bg, color: textColor,
            fontSize: '0.62rem', fontWeight: 'bold', flexShrink: 0
          }}>
            <div>{m}</div>
            {label && <div style={{ fontSize: '0.55rem', opacity: 0.9 }}>{label}</div>}
          </div>
        );
      })}
    </div>
  );
}

export function PlannerTab() {
  const { lang } = useApp();
  const [selectedSeason, setSelectedSeason] = useState('kharif');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [activePlanView, setActivePlanView] = useState('calendar'); // 'calendar' | 'rotation'

  const season = SEASONS.find(s => s.id === selectedSeason);

  return (
    <div className="tab-panel active">

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(10, 24, 17, 0.95) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px',
        padding: '22px 24px', marginBottom: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 6px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-calendar-days" style={{ color: '#38bdf8' }}></i>
            Crop Sowing Calendar &amp; Rotation Engine
          </h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Plan multi-crop rotations with detailed agronomic schedules, seed rates, fertilizer dosages, and pest defense protocols.
          </p>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={() => setActivePlanView('calendar')} style={{
            padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 'bold',
            border: '1.5px solid', cursor: 'pointer',
            background: activePlanView === 'calendar' ? '#38bdf8' : 'transparent',
            color: activePlanView === 'calendar' ? '#000' : '#38bdf8',
            borderColor: '#38bdf8'
          }}>
            <i className="fa-solid fa-calendar" style={{ marginRight: '6px' }}></i>Calendar
          </button>
          <button type="button" onClick={() => setActivePlanView('rotation')} style={{
            padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 'bold',
            border: '1.5px solid', cursor: 'pointer',
            background: activePlanView === 'rotation' ? '#10b981' : 'transparent',
            color: activePlanView === 'rotation' ? '#000' : '#10b981',
            borderColor: '#10b981'
          }}>
            <i className="fa-solid fa-arrows-rotate" style={{ marginRight: '6px' }}></i>Rotation Plan
          </button>
        </div>
      </div>

      {activePlanView === 'calendar' && (
        <>
          {/* Season Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {SEASONS.map(s => (
              <button key={s.id} type="button" onClick={() => { setSelectedSeason(s.id); setSelectedCrop(null); }}
                style={{
                  padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  background: selectedSeason === s.id ? s.color : 'rgba(255,255,255,0.05)',
                  color: selectedSeason === s.id ? '#000' : s.color,
                  border: `2px solid ${s.color}`,
                  boxShadow: selectedSeason === s.id ? `0 4px 16px ${s.color}55` : 'none',
                  transition: 'all 0.2s ease'
                }}>
                <i className={`fa-solid ${s.icon}`}></i> {s.name} ({s.crops.length} Crops)
              </button>
            ))}
          </div>

          {/* Month Timeline Bar */}
          <div style={{
            background: 'rgba(10, 24, 17, 0.9)', border: `1px solid ${season.border}`,
            borderRadius: '14px', padding: '18px 20px', marginBottom: '1.5rem'
          }}>
            <h4 style={{ margin: '0 0 4px 0', color: season.color, fontWeight: 'bold' }}>
              <i className={`fa-solid ${season.icon}`} style={{ marginRight: '8px' }}></i>
              {season.name} — Sowing: {season.sowing} | Harvest: {season.harvest}
            </h4>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span style={{ background: season.color, color: '#000', padding: '2px 8px', borderRadius: '6px', marginRight: '6px', fontSize: '0.7rem', fontWeight: 'bold' }}>Sowing</span>
              <span style={{ background: 'rgba(74,222,128,0.3)', color: 'var(--primary-light)', padding: '2px 8px', borderRadius: '6px', marginRight: '6px', fontSize: '0.7rem', fontWeight: 'bold' }}>Growing</span>
              <span style={{ background: '#f97316', color: '#000', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' }}>Harvest</span>
            </p>
            <MonthBar season={season} />
          </div>

          {/* Crop Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {season.crops.map((crop, idx) => {
              const isSelected = selectedCrop === idx;
              return (
                <div key={idx}
                  onClick={() => setSelectedCrop(isSelected ? null : idx)}
                  style={{
                    background: isSelected ? season.bg : 'rgba(10, 24, 17, 0.85)',
                    border: `1.5px solid ${isSelected ? season.color : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '14px', padding: '18px',
                    cursor: 'pointer', transition: 'all 0.25s ease',
                    boxShadow: isSelected ? `0 6px 20px ${season.color}44` : 'none'
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: 'white' }}>
                      <i className="fa-solid fa-seedling" style={{ color: season.color, marginRight: '8px' }}></i>
                      {crop.name}
                    </h3>
                    <i className={`fa-solid fa-chevron-${isSelected ? 'up' : 'down'}`} style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}></i>
                  </div>

                  {/* Summary Badges */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#94a3b8' }}>
                      <i className="fa-solid fa-clock" style={{ marginRight: '4px' }}></i>{crop.duration}
                    </span>
                    <span style={{ background: 'rgba(56,189,248,0.15)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#38bdf8' }}>
                      <i className="fa-solid fa-droplet" style={{ marginRight: '4px' }}></i>Water: {crop.water}
                    </span>
                    {crop.yieldBenchmark && (
                      <span style={{ background: 'rgba(168,85,247,0.15)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#c084fc' }}>
                        <i className="fa-solid fa-wheat-awn" style={{ marginRight: '4px' }}></i>Yield: {crop.yieldBenchmark}
                      </span>
                    )}
                  </div>

                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    <i className="fa-solid fa-mountain" style={{ marginRight: '6px', color: '#a78bfa' }}></i>
                    <strong>Soil:</strong> {crop.soil}
                  </p>

                  {/* Expanded 360 Agronomic Details */}
                  {isSelected && (
                    <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${season.color}44`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      
                      {/* Seed & Spacing Info */}
                      {(crop.seedRate || crop.spacing) && (
                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                          {crop.seedRate && (
                            <div style={{ marginBottom: '4px', color: '#e2e8f0' }}>
                              <strong style={{ color: '#facc15' }}>🌱 Seed Rate:</strong> {crop.seedRate}
                            </div>
                          )}
                          {crop.spacing && (
                            <div style={{ color: '#e2e8f0' }}>
                              <strong style={{ color: '#38bdf8' }}>📏 Spacing:</strong> {crop.spacing}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Nutrient Dosage */}
                      {crop.nutrientReq && (
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                          <strong style={{ color: '#34d399', display: 'block', marginBottom: '2px' }}>🧪 NPK Fertilizer Dosage:</strong>
                          <span style={{ color: '#fff' }}>{crop.nutrientReq}</span>
                        </div>
                      )}

                      {/* Critical Irrigation Stages */}
                      {crop.irrigationPhases && (
                        <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                          <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '2px' }}>💧 Critical Water Stages:</strong>
                          <span style={{ color: '#cbd5e1' }}>{crop.irrigationPhases}</span>
                        </div>
                      )}

                      {/* Rotation Benefit */}
                      {crop.rotationBenefit && (
                        <div style={{ background: 'rgba(250, 204, 21, 0.08)', border: '1px solid rgba(250, 204, 21, 0.25)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                          <strong style={{ color: '#facc15', display: 'block', marginBottom: '2px' }}>🔄 Rotation Agronomic Benefit:</strong>
                          <span style={{ color: '#fef08a' }}>{crop.rotationBenefit}</span>
                        </div>
                      )}

                      {/* Pest Alert & Prevention */}
                      {crop.pestAlert && (
                        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                          <strong style={{ color: '#fb7185', display: 'block', marginBottom: '2px' }}>⚠️ Major Pests &amp; Defense:</strong>
                          <span style={{ color: '#ffe4e6' }}>{crop.pestAlert}</span>
                        </div>
                      )}

                      {/* Harvest Indicator */}
                      {crop.harvestIndicator && (
                        <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                          <strong style={{ color: '#c084fc', display: 'block', marginBottom: '2px' }}>🌾 Harvest Readiness Sign:</strong>
                          <span style={{ color: '#e9d5ff' }}>{crop.harvestIndicator}</span>
                        </div>
                      )}

                      {/* Rotation Sequence */}
                      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 12px' }}>
                        <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: season.color, fontSize: '0.82rem' }}>
                          <i className="fa-solid fa-arrows-rotate" style={{ marginRight: '6px' }}></i>Recommended Rotation Sequence:
                        </p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                          {crop.rotation}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ flex: 1, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '8px', textAlign: 'center', fontSize: '0.78rem' }}>
                          <div style={{ color: 'var(--primary-light)', fontWeight: 'bold', marginBottom: '2px' }}>{season.sowing}</div>
                          <div style={{ color: 'var(--text-secondary)' }}>Sowing Window</div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '8px', padding: '8px', textAlign: 'center', fontSize: '0.78rem' }}>
                          <div style={{ color: '#fb923c', fontWeight: 'bold', marginBottom: '2px' }}>{season.harvest}</div>
                          <div style={{ color: 'var(--text-secondary)' }}>Harvest Window</div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {activePlanView === 'rotation' && (
        <div>
          {/* Rotation Plan View */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {/* Common Rotation Patterns */}
            {[
              {
                title: 'North India — Wheat-Paddy Belt',
                icon: 'fa-wheat-awn', color: '#fbbf24',
                steps: [
                  { season: 'Kharif', crop: 'Paddy (Rice)', months: 'Jun – Oct', detail: 'Transplanting in puddled soil; requires 1200mm water & Zinc Sulphate application.', icon: 'fa-seedling', color: '#10b981' },
                  { season: 'Rabi', crop: 'Wheat', months: 'Nov – Apr', detail: 'Sown at 22.5cm row spacing; critical 1st irrigation at Crown Root Initiation (21d).', icon: 'fa-seedling', color: '#38bdf8' },
                  { season: 'Zaid', crop: 'Moong / Green Gram', months: 'Apr – Jun', detail: 'Short 60-day summer pulse fixing 35-45 kg N/ha into soil before next monsoon.', icon: 'fa-seedling', color: '#fbbf24' }
                ],
                benefit: 'Classic Indo-Gangetic rotation. Maintains soil organic matter. Incorporating Moong in Zaid reduces subsequent Wheat nitrogen fertilizer requirement by 25%.'
              },
              {
                title: 'Central India — Cotton-Wheat & Soybean Belt',
                icon: 'fa-circle-nodes', color: '#a78bfa',
                steps: [
                  { season: 'Kharif', crop: 'Cotton / Soybean', months: 'Jun – Nov', detail: 'Black cotton soil moisture retention; Soybean inoculates Rhizobium japonicum.', icon: 'fa-seedling', color: '#10b981' },
                  { season: 'Rabi', crop: 'Wheat / Chickpea', months: 'Nov – Mar', detail: 'Wheat following leguminous Soybean gets organic N boost from foliage decay.', icon: 'fa-seedling', color: '#38bdf8' },
                  { season: 'Zaid', crop: 'Sunflower / Fallow', months: 'Mar – Jun', detail: 'Deep taproot breaks hard soil pans and disrupts soil-borne nematode cycles.', icon: 'fa-seedling', color: '#fbbf24' }
                ],
                benefit: 'Reduces Pink Bollworm pressure. Soybean fixes 80–120 kg N/ha. Sunflower breaks weed and disease cycles effectively.'
              },
              {
                title: 'South India — Rice-Rice-Pulse System',
                icon: 'fa-layer-group', color: '#34d399',
                steps: [
                  { season: 'Kharif I', crop: 'Paddy (Samba)', months: 'Jun – Oct', detail: 'Main monsoon rice crop in river deltas.', icon: 'fa-seedling', color: '#10b981' },
                  { season: 'Rabi', crop: 'Paddy (Thaladi / Rabi)', months: 'Nov – Feb', detail: 'Winter irrigated rice crop.', icon: 'fa-seedling', color: '#38bdf8' },
                  { season: 'Zaid', crop: 'Black Gram / Cowpea', months: 'Feb – May', detail: 'Residual moisture pulse crop fixing nitrogen.', icon: 'fa-seedling', color: '#fbbf24' }
                ],
                benefit: 'Cauvery & Krishna delta rotation. Pulses grown on rice stubble fix natural nitrogen, saving ₹2,500/acre in fertilizer expenses.'
              },
              {
                title: 'Vegetable Farmer — Intensive Year-Round',
                icon: 'fa-carrot', color: '#f87171',
                steps: [
                  { season: 'Kharif', crop: 'Tomato / Chilli / Okra', months: 'Jun – Sep', detail: 'Staked Solanaceous crops with high market return per acre.', icon: 'fa-seedling', color: '#10b981' },
                  { season: 'Rabi', crop: 'Potato / Cauliflower / Peas', months: 'Oct – Feb', detail: 'Cool season root and brassica crops with heavy organic residue.', icon: 'fa-seedling', color: '#38bdf8' },
                  { season: 'Zaid', crop: 'Watermelon / Cucumber', months: 'Mar – Jun', detail: 'Silver mulch cucurbits yielding high Brix sugar melons in summer.', icon: 'fa-seedling', color: '#fbbf24' }
                ],
                benefit: 'High-yield commercial rotation for peri-urban farmers. Multi-family crop switching prevents host-specific pest outbreaks.'
              }
            ].map((plan, idx) => (
              <div key={idx} style={{
                background: 'rgba(10, 24, 17, 0.9)',
                border: `1.5px solid rgba(255,255,255,0.12)`,
                borderRadius: '16px', padding: '20px'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className={`fa-solid ${plan.icon}`} style={{ color: plan.color }}></i>
                  {plan.title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {plan.steps.map((step, si) => (
                    <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 14px', borderLeft: `3px solid ${step.color}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.92rem', color: 'white' }}>{step.crop}</div>
                        <span style={{ fontSize: '0.74rem', background: 'rgba(255,255,255,0.08)', color: step.color, padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                          {step.season} ({step.months})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.35 }}>
                        {step.detail}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', borderLeft: `3px solid ${plan.color}` }}>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    <i className="fa-solid fa-circle-info" style={{ color: plan.color, marginRight: '6px' }}></i>
                    <strong>Agronomic Rotation Benefit:</strong> {plan.benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
