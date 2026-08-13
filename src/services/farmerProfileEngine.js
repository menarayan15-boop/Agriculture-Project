// Krishi Jal — Farmer Profiling & Personalization Engine
// A client-side ML-style scoring engine that classifies farmers into archetypes
// and generates personalized recommendations for the entire application.

// ============================================================================
// 1. FEATURE EXTRACTION
// ============================================================================

/**
 * Extracts a normalized feature vector from raw farmer inputs.
 * Each feature is normalized to a 0–1 scale for scoring.
 */
export function extractFeatures({ location, soil, crop, area, stage, preference }) {
  const features = {};

  // --- Area features ---
  const areaVal = parseFloat(area) || 1.0;
  features.areaAcres = areaVal;
  features.isSmall = areaVal < 2 ? 1 : 0;
  features.isMedium = (areaVal >= 2 && areaVal <= 10) ? 1 : 0;
  features.isLarge = areaVal > 10 ? 1 : 0;
  features.areaNorm = Math.min(areaVal / 20, 1); // normalize to 0-1 (cap at 20 acres)

  // --- Soil features ---
  const soilRetention = soil?.retention ?? 70;
  const soilDrainage = soil?.drainage ?? 50;
  features.soilRetention = soilRetention / 100;
  features.soilDrainage = soilDrainage / 100;
  features.isHighRetention = soilRetention > 75 ? 1 : 0;
  features.isLowRetention = soilRetention < 40 ? 1 : 0;
  features.isDryland = soilDrainage > 70 ? 1 : 0;

  // --- Crop features ---
  const baseWater = crop?.baseWater ?? 5.0;
  features.waterDemand = baseWater / 10; // normalize (max ~10 for sugarcane)
  features.isWaterIntensive = baseWater >= 7 ? 1 : 0;
  features.isDroughtTolerant = baseWater <= 4 ? 1 : 0;
  features.cropId = crop?.id || 'wheat';

  // --- Growth stage features ---
  const stageMap = { initial: 0.1, veg: 0.35, flower: 0.65, harvest: 0.9 };
  features.stageProgress = stageMap[stage] || 0.35;
  features.isEarlyStage = (stage === 'initial' || stage === 'veg') ? 1 : 0;
  features.isLateStage = (stage === 'flower' || stage === 'harvest') ? 1 : 0;

  // --- Preference features ---
  features.isOrganic = preference === 'organic' ? 1 : 0;
  features.isCommercial = preference === 'synthetic' ? 1 : 0;
  features.isBalanced = preference === 'balanced' ? 1 : 0;

  // --- Location features ---
  const lat = location?.lat ?? 25;
  features.isNorthIndia = lat > 25 ? 1 : 0;
  features.isSouthIndia = lat <= 25 ? 1 : 0;
  features.isArid = (location?.id === 'rajasthan' || soilDrainage > 80) ? 1 : 0;
  features.locationId = location?.id || 'punjab';

  return features;
}

// ============================================================================
// 2. PROFILE CLASSIFICATION (Decision-Tree + Weighted Scoring)
// ============================================================================

const ARCHETYPES = {
  'smallholder-subsistence': {
    label: 'Smallholder Subsistence Farmer',
    labelHi: 'लघु निर्वाह किसान',
    icon: '🌱',
    color: '#22c55e',
    description: 'Small-scale farming focused on self-sufficiency and organic practices.',
    descHi: 'आत्मनिर्भरता और जैविक खेती पर केंद्रित छोटे पैमाने की खेती।'
  },
  'smallholder-commercial': {
    label: 'Small Commercial Farmer',
    labelHi: 'लघु वाणिज्यिक किसान',
    icon: '🏪',
    color: '#3b82f6',
    description: 'Small farm with commercial orientation, seeking market access and better prices.',
    descHi: 'बाजार पहुंच और बेहतर मूल्य चाहने वाला छोटा वाणिज्यिक खेत।'
  },
  'medium-diversified': {
    label: 'Medium Diversified Farmer',
    labelHi: 'मध्यम विविध किसान',
    icon: '🌾',
    color: '#f59e0b',
    description: 'Balanced approach with mixed crops, moderate investment, and steady growth.',
    descHi: 'मिश्रित फसलों, मध्यम निवेश और स्थिर विकास के साथ संतुलित दृष्टिकोण।'
  },
  'large-commercial': {
    label: 'Large Commercial Farmer',
    labelHi: 'बड़ा वाणिज्यिक किसान',
    icon: '🏭',
    color: '#ef4444',
    description: 'High-yield, technology-driven farming with heavy machinery and market focus.',
    descHi: 'भारी मशीनरी और बाजार फोकस के साथ उच्च उपज, प्रौद्योगिकी संचालित खेती।'
  },
  'irrigated-intensive': {
    label: 'Irrigated Intensive Farmer',
    labelHi: 'सिंचित गहन किसान',
    icon: '💧',
    color: '#06b6d4',
    description: 'Water-intensive crop cultivation requiring advanced irrigation management.',
    descHi: 'उन्नत सिंचाई प्रबंधन की आवश्यकता वाली जल-गहन फसल खेती।'
  },
  'dryland-adaptive': {
    label: 'Dryland Adaptive Farmer',
    labelHi: 'शुष्क भूमि अनुकूल किसान',
    icon: '🏜️',
    color: '#d97706',
    description: 'Farming in arid/semi-arid regions with water-conservation focus.',
    descHi: 'जल-संरक्षण पर ध्यान केंद्रित करते हुए शुष्क/अर्ध-शुष्क क्षेत्रों में खेती।'
  }
};

/**
 * Classifies the farmer into an archetype using weighted scoring.
 * Each archetype has a scoring function; the highest score wins.
 */
export function classifyFarmer(features) {
  const scores = {};

  // Smallholder Subsistence
  scores['smallholder-subsistence'] =
    features.isSmall * 3.0 +
    features.isOrganic * 2.5 +
    features.isDroughtTolerant * 1.5 +
    (1 - features.areaNorm) * 2.0 +
    features.isEarlyStage * 0.5;

  // Smallholder Commercial
  scores['smallholder-commercial'] =
    features.isSmall * 2.5 +
    features.isCommercial * 2.0 +
    features.isBalanced * 1.5 +
    features.waterDemand * 1.0 +
    features.isLateStage * 0.5;

  // Medium Diversified
  scores['medium-diversified'] =
    features.isMedium * 3.5 +
    features.isBalanced * 2.0 +
    features.soilRetention * 1.0 +
    (1 - features.isWaterIntensive) * 0.5 +
    features.stageProgress * 0.5;

  // Large Commercial
  scores['large-commercial'] =
    features.isLarge * 4.0 +
    features.isCommercial * 2.5 +
    features.areaNorm * 2.0 +
    features.isWaterIntensive * 1.0 +
    features.isLateStage * 0.5;

  // Irrigated Intensive
  scores['irrigated-intensive'] =
    features.isWaterIntensive * 3.5 +
    features.isHighRetention * 2.0 +
    features.waterDemand * 2.5 +
    features.isMedium * 1.0 +
    features.isBalanced * 0.5;

  // Dryland Adaptive
  scores['dryland-adaptive'] =
    features.isDryland * 3.5 +
    features.isArid * 3.0 +
    features.isLowRetention * 2.0 +
    features.isDroughtTolerant * 2.0 +
    (1 - features.waterDemand) * 1.5;

  // Find the highest scoring archetype
  let bestType = 'medium-diversified';
  let bestScore = -Infinity;
  for (const [type, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestType = type;
    }
  }

  // Normalize confidence (0–100%)
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0 ? Math.round((bestScore / totalScore) * 100) : 50;

  return {
    archetype: bestType,
    ...ARCHETYPES[bestType],
    confidence: Math.min(confidence, 98),
    scores,
    allArchetypes: ARCHETYPES
  };
}

// ============================================================================
// 3. RISK ASSESSMENT
// ============================================================================

export function assessRisks(features) {
  const risks = [];

  // Drought risk
  const droughtScore =
    features.isArid * 30 +
    features.isDryland * 20 +
    features.isLowRetention * 15 +
    features.isWaterIntensive * 10 +
    (1 - features.soilRetention) * 25;
  if (droughtScore > 30) {
    risks.push({
      type: 'drought',
      severity: droughtScore > 60 ? 'high' : 'medium',
      score: Math.min(Math.round(droughtScore), 100),
      icon: '☀️',
      label: 'Drought Risk',
      labelHi: 'सूखे का खतरा',
      tip: 'Consider mulching and drip irrigation to conserve moisture.',
      tipHi: 'नमी बचाने के लिए मल्चिंग और ड्रिप सिंचाई पर विचार करें।'
    });
  }

  // Waterlogging risk
  const waterlogScore =
    features.isHighRetention * 25 +
    features.waterDemand * 20 +
    features.soilRetention * 20 +
    (1 - features.soilDrainage) * 35;
  if (waterlogScore > 40) {
    risks.push({
      type: 'waterlogging',
      severity: waterlogScore > 70 ? 'high' : 'medium',
      score: Math.min(Math.round(waterlogScore), 100),
      icon: '🌊',
      label: 'Waterlogging Risk',
      labelHi: 'जलभराव का खतरा',
      tip: 'Ensure proper field drainage and raised-bed planting.',
      tipHi: 'उचित खेत जल निकासी और उठी हुई क्यारी में रोपण सुनिश्चित करें।'
    });
  }

  // Pest/disease risk (higher in warm + humid + flowering stage)
  const pestScore =
    features.isSouthIndia * 15 +
    features.isLateStage * 25 +
    features.soilRetention * 15 +
    features.waterDemand * 15 +
    features.isWaterIntensive * 10;
  if (pestScore > 25) {
    risks.push({
      type: 'pest',
      severity: pestScore > 50 ? 'high' : 'medium',
      score: Math.min(Math.round(pestScore), 100),
      icon: '🐛',
      label: 'Pest & Disease Risk',
      labelHi: 'कीट और रोग का खतरा',
      tip: 'Apply preventive neem-based bio-pesticide spray.',
      tipHi: 'निवारक नीम आधारित जैव-कीटनाशक छिड़काव करें।'
    });
  }

  // Market price risk (large commercial farms)
  if (features.isLarge || features.isCommercial) {
    risks.push({
      type: 'market',
      severity: 'medium',
      score: 45,
      icon: '📉',
      label: 'Market Price Volatility',
      labelHi: 'बाजार मूल्य अस्थिरता',
      tip: 'Diversify crops and consider futures contracts or FPO membership.',
      tipHi: 'फसलों में विविधता लाएं और वायदा अनुबंध या FPO सदस्यता पर विचार करें।'
    });
  }

  return risks;
}

// ============================================================================
// 4. TAB PRIORITY RECOMMENDATION
// ============================================================================

/**
 * Returns an ordered list of tab IDs, with the most relevant tabs first.
 * Also marks the top 3 as "recommended".
 */
export function getTabPriority(archetype, features) {
  // Base priority weights for each tab per archetype
  const priorityMap = {
    'smallholder-subsistence': [
      'dashboard', 'education', 'schemes', 'soillab', 'planner',
      'voice-ai', 'weather', 'calculator', 'advisor', 'marketplace', 'rentals'
    ],
    'smallholder-commercial': [
      'dashboard', 'marketplace', 'mandi', 'schemes', 'calculator',
      'advisor', 'weather', 'soillab', 'planner', 'voice-ai', 'rentals', 'education'
    ],
    'medium-diversified': [
      'dashboard', 'advisor', 'planner', 'soillab', 'weather',
      'marketplace', 'schemes', 'calculator', 'voice-ai', 'rentals', 'education', 'mandi'
    ],
    'large-commercial': [
      'dashboard', 'rentals', 'marketplace', 'mandi', 'calculator',
      'advisor', 'weather', 'planner', 'soillab', 'voice-ai', 'schemes', 'education'
    ],
    'irrigated-intensive': [
      'dashboard', 'advisor', 'weather', 'soillab', 'planner',
      'calculator', 'voice-ai', 'schemes', 'marketplace', 'rentals', 'education', 'mandi'
    ],
    'dryland-adaptive': [
      'dashboard', 'weather', 'soillab', 'education', 'schemes',
      'advisor', 'planner', 'voice-ai', 'calculator', 'marketplace', 'rentals', 'mandi'
    ]
  };

  const order = priorityMap[archetype] || priorityMap['medium-diversified'];

  // Mark top 3 (excluding dashboard which is always first) as recommended
  const recommended = new Set(order.slice(1, 4));

  return { order, recommended };
}

// ============================================================================
// 5. PERSONALIZED TIPS
// ============================================================================

export function getPersonalizedTips(archetype, features, lang = 'en') {
  const tips = [];

  // Stage-specific tips
  if (features.isEarlyStage) {
    tips.push({
      icon: '🌱',
      text: lang === 'hi'
        ? 'आपकी फसल शुरुआती चरण में है — बीज उपचार और हल्की सिंचाई पर ध्यान दें।'
        : 'Your crop is in early stage — focus on seed treatment and light irrigation.',
      priority: 'info'
    });
  }
  if (features.stageProgress > 0.5) {
    tips.push({
      icon: '🌸',
      text: lang === 'hi'
        ? 'फसल फूल/उपज चरण में है — पोषक तत्व प्रबंधन और कीट निगरानी बढ़ाएं।'
        : 'Crop is in flowering/yield stage — increase nutrient management and pest monitoring.',
      priority: 'warning'
    });
  }

  // Archetype-specific tips
  const archetypeTips = {
    'smallholder-subsistence': {
      en: 'Check Govt Schemes tab for PM-KISAN and small-farmer subsidies you may be eligible for.',
      hi: 'पीएम-किसान और लघु किसान सब्सिडी के लिए सरकारी योजनाएं टैब देखें।'
    },
    'smallholder-commercial': {
      en: 'Use the Direct Marketplace to sell produce at better prices without middlemen.',
      hi: 'बिचौलियों के बिना बेहतर कीमत पर उपज बेचने के लिए डायरेक्ट मार्केटप्लेस का उपयोग करें।'
    },
    'medium-diversified': {
      en: 'Try the Crop Calendar for optimal rotation planning across your diverse fields.',
      hi: 'अपने विविध खेतों में इष्टतम चक्रण योजना के लिए फसल कैलेंडर आज़माएं।'
    },
    'large-commercial': {
      en: 'Explore Tool & Machinery Rental for harvesters and planters to maximize efficiency.',
      hi: 'दक्षता बढ़ाने के लिए हार्वेस्टर और प्लांटर के लिए मशीनरी रेंटल देखें।'
    },
    'irrigated-intensive': {
      en: 'Your water-intensive crop needs careful scheduling — use the AI Advisor for optimal timing.',
      hi: 'आपकी जल-गहन फसल को सावधान समय-निर्धारण चाहिए — AI सलाहकार का उपयोग करें।'
    },
    'dryland-adaptive': {
      en: 'Check Weather tab closely — every rain event is critical for your dryland farming.',
      hi: 'मौसम टैब को ध्यान से देखें — हर बारिश आपकी शुष्क भूमि खेती के लिए महत्वपूर्ण है।'
    }
  };

  const at = archetypeTips[archetype];
  if (at) {
    tips.push({
      icon: '💡',
      text: lang === 'hi' ? at.hi : at.en,
      priority: 'tip'
    });
  }

  // Water-specific tip
  if (features.isWaterIntensive) {
    tips.push({
      icon: '💧',
      text: lang === 'hi'
        ? 'आपकी फसल को अधिक पानी चाहिए — ड्रिप/स्प्रिंकलर सिंचाई पर विचार करें।'
        : 'Your crop has high water needs — consider drip/sprinkler irrigation for efficiency.',
      priority: 'warning'
    });
  }

  // Organic-specific tip
  if (features.isOrganic) {
    tips.push({
      icon: '🌿',
      text: lang === 'hi'
        ? 'जैविक खेती: वर्मीकम्पोस्ट और जीवामृत से मिट्टी की उर्वरता बढ़ाएं।'
        : 'Organic farming: Boost soil fertility with vermicompost and Jeevamrut.',
      priority: 'info'
    });
  }

  return tips.slice(0, 5); // Max 5 tips
}

// ============================================================================
// 6. MAIN PROFILING FUNCTION (Public API)
// ============================================================================

/**
 * Main entry point. Takes farmer settings, returns complete profiling insights.
 */
export function generateFarmerInsights({ location, soil, crop, area, stage, preference }, lang = 'en') {
  // Step 1: Extract features
  const features = extractFeatures({ location, soil, crop, area, stage, preference });

  // Step 2: Classify farmer
  const profile = classifyFarmer(features);

  // Step 3: Assess risks
  const risks = assessRisks(features);

  // Step 4: Get tab priorities
  const { order: priorityTabs, recommended: recommendedTabs } = getTabPriority(profile.archetype, features);

  // Step 5: Get personalized tips
  const tips = getPersonalizedTips(profile.archetype, features, lang);

  // Step 6: Compute overall farm health score (0-100)
  const avgRiskScore = risks.length > 0
    ? risks.reduce((sum, r) => sum + r.score, 0) / risks.length
    : 0;
  const healthScore = Math.max(10, Math.min(100, Math.round(100 - avgRiskScore * 0.6)));

  return {
    features,
    profile,
    risks,
    priorityTabs,
    recommendedTabs,
    tips,
    healthScore,
    timestamp: Date.now()
  };
}
