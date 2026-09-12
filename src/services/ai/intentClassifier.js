/**
 * Intent Classifier for Krishi AI
 * Classifies farmer queries into granular agricultural intents and matches against the Question Bank.
 */

import { AGRICULTURAL_QUESTION_BANK } from '../../data/agriculturalQuestionBank.js';

export const INTENT_DEFINITIONS = {
  CROP_SELECTION: 'crop_selection',
  CROP_CULTIVATION: 'crop_cultivation',
  SOIL_TESTING: 'soil_testing',
  SOIL_HEALTH: 'soil_health',
  SEED_SELECTION: 'seed_selection',
  SEED_TREATMENT: 'seed_treatment',
  LAND_PREPARATION: 'land_preparation',
  SOWING: 'sowing',
  TRANSPLANTING: 'transplanting',
  IRRIGATION: 'irrigation',
  WATER_MANAGEMENT: 'water_management',
  FERTILIZER_RECOMMENDATION: 'fertilizer_recommendation',
  NUTRIENT_DEFICIENCY: 'nutrient_deficiency',
  CROP_GROWTH_PROBLEM: 'crop_growth_problem',
  DISEASE_IDENTIFICATION: 'disease_identification',
  DISEASE_CONTROL: 'disease_control',
  PEST_IDENTIFICATION: 'pest_identification',
  PEST_CONTROL: 'pest_control',
  PESTICIDE_RECOMMENDATION: 'pesticide_recommendation',
  PESTICIDE_DOSAGE: 'pesticide_dosage',
  PESTICIDE_SAFETY: 'pesticide_safety',
  WEED_IDENTIFICATION: 'weed_identification',
  WEED_CONTROL: 'weed_control',
  WEATHER_ADVISORY: 'weather_advisory',
  DROUGHT_MANAGEMENT: 'drought_management',
  FLOOD_MANAGEMENT: 'flood_management',
  HEAT_STRESS: 'heat_stress',
  FLOWERING_PROBLEM: 'flowering_problem',
  FRUITING_PROBLEM: 'fruiting_problem',
  YIELD_IMPROVEMENT: 'yield_improvement',
  HARVESTING: 'harvesting',
  POST_HARVEST: 'post_harvest',
  STORAGE: 'storage',
  MANDI_INFORMATION: 'mandi_information',
  SELLING_ADVISORY: 'selling_advisory',
  FARM_COST_CALCULATION: 'farm_cost_calculation',
  PROFIT_CALCULATION: 'profit_calculation',
  MACHINERY_RENTAL: 'machinery_rental',
  CROP_PHOTO_ANALYSIS: 'crop_photo_analysis',
  GENERAL_AGRICULTURAL_QUESTION: 'general_agricultural_question',
  NAVIGATION_COMMAND: 'navigation_command'
};

/**
 * Classifies an incoming text query into a primary intent, secondary intents, and matches question bank entries.
 * @param {string} query - Cleaned user query string
 * @returns {Object} { intent, confidence, matchedQuestion, requiredContext, entities }
 */
export function classifyIntent(query = '') {
  if (!query || typeof query !== 'string') {
    return {
      intent: INTENT_DEFINITIONS.GENERAL_AGRICULTURAL_QUESTION,
      confidence: 0.1,
      matchedQuestion: null,
      requiredContext: []
    };
  }

  const q = query.toLowerCase().trim();

  // Check 1A: Greetings & Introduction
  if (q.match(/^(hi|hello|hey|namaste|namaskar|pranam|ram ram|kisan bhai|kaise ho|help|who are you|kya kar sakte ho)\b/i) || q === 'hi' || q === 'hello' || q === 'नमस्ते' || q === 'प्रणाम') {
    return {
      intent: 'greeting',
      confidence: 0.99,
      matchedQuestion: null,
      requiredContext: []
    };
  }

  // Check 1B: Navigation intents
  if (q.match(/open|show|go to|take me to|खोलो|दिखाओ|जाना|ले चलो|चलो|पेज/i) &&
      q.match(/weather|rain|mandi|rent|tractor|calculator|soil|lab|scheme|market|doctor|advisor|planner|dashboard|मंडी|मौसम|किराया|खाद|लैब|योजना/i)) {
    return {
      intent: INTENT_DEFINITIONS.NAVIGATION_COMMAND,
      confidence: 0.95,
      matchedQuestion: null,
      requiredContext: ['target_tab']
    };
  }

  // Check 2: Direct match against Question Bank
  let bestBankMatch = null;
  let highestScore = 0;

  for (const item of AGRICULTURAL_QUESTION_BANK) {
    const qLower = item.question.toLowerCase();
    if (q === qLower) {
      return {
        intent: item.intent,
        confidence: 0.99,
        matchedQuestion: item,
        requiredContext: item.requiredContext || [],
        entities: item.entities || {}
      };
    }

    // Check alternative questions
    for (const alt of (item.alternativeQuestions || [])) {
      const altLower = alt.toLowerCase();
      if (q === altLower) {
        return {
          intent: item.intent,
          confidence: 0.99,
          matchedQuestion: item,
          requiredContext: item.requiredContext || [],
          entities: item.entities || {}
        };
      }
      if (q.length >= 8 && (q.includes(altLower) || (altLower.length >= 8 && altLower.includes(q)))) {
        return {
          intent: item.intent,
          confidence: 0.95,
          matchedQuestion: item,
          requiredContext: item.requiredContext || [],
          entities: item.entities || {}
        };
      }
    }

    // Token overlap calculation
    const qTokens = new Set(q.split(/\s+/).filter(t => t.length > 2));
    const bankTokens = new Set(qLower.split(/\s+/).filter(t => t.length > 2));
    let common = 0;
    for (const token of qTokens) {
      if (bankTokens.has(token)) common++;
    }
    const score = common / Math.max(qTokens.size, bankTokens.size);
    if (score > highestScore && score >= 0.65) {
      highestScore = score;
      bestBankMatch = item;
    }
  }

  if (bestBankMatch && highestScore >= 0.65) {
    return {
      intent: bestBankMatch.intent,
      confidence: Math.min(0.9, 0.5 + highestScore * 0.4),
      matchedQuestion: bestBankMatch,
      requiredContext: bestBankMatch.requiredContext || [],
      entities: bestBankMatch.entities || {}
    };
  }

  // Check 3: Semantic Keyword Rules Matrix
  // 3A. Mandi & Selling
  if (q.match(/mandi|bhav|mandi rate|msp|price|market rate|bhav kya hai|मंडी|भाव|दाम|रेट|एमएसपी|बेचना/i)) {
    return {
      intent: INTENT_DEFINITIONS.MANDI_INFORMATION,
      confidence: 0.9,
      matchedQuestion: null,
      requiredContext: ['crop', 'location']
    };
  }

  // 3B. Machinery & Equipment
  if (q.match(/tractor|rent|rotavator|harvester|seeder|drone|combine|machine|power weeder|थ्रेशर|ट्रैक्टर|किराया|मशीन|ड्रोन|कंबाइन|हल/i)) {
    return {
      intent: INTENT_DEFINITIONS.MACHINERY_RENTAL,
      confidence: 0.9,
      matchedQuestion: null,
      requiredContext: ['machine_type', 'location']
    };
  }

  // 3C. Farm Cost & Calculations
  if (q.match(/cost|profit|budget|how much will it cost|revenue|loss|calculator|खर्चा|लागत|मुनाफा|फायदा|कमाई|हिसाब/i)) {
    if (q.match(/profit|munafa|fayda|earning|income/i)) {
      return {
        intent: INTENT_DEFINITIONS.PROFIT_CALCULATION,
        confidence: 0.88,
        matchedQuestion: null,
        requiredContext: ['crop', 'farm_area', 'expected_yield']
      };
    }
    return {
      intent: INTENT_DEFINITIONS.FARM_COST_CALCULATION,
      confidence: 0.88,
      matchedQuestion: null,
      requiredContext: ['crop', 'farm_area']
    };
  }

  // 3D. Pesticide Safety & Tank Mixing
  if (q.match(/mix|mixing|tank|skin|eye|poison|first aid|safety|gloves|15 litre|20 litre|spray together|मिलाकर|आंख|त्वचा|जहर|सुरक्षा|घोल/i)) {
    if (q.match(/15 litre|20 litre|tank|ghol|dose|kitni dawai|matra/i)) {
      return {
        intent: INTENT_DEFINITIONS.PESTICIDE_DOSAGE,
        confidence: 0.9,
        matchedQuestion: null,
        requiredContext: ['pesticide_name', 'crop', 'tank_size']
      };
    }
    return {
      intent: INTENT_DEFINITIONS.PESTICIDE_SAFETY,
      confidence: 0.9,
      matchedQuestion: null,
      requiredContext: ['pesticide_name']
    };
  }

  // 3E. Weeds & Herbicide
  if (q.match(/weed|herbicide|weedicide|grass|gulli danda|motha|kharpatwar|ghaas|खरपतवार|घास|मोथा|गुल्ली डंडा|खरपतवारनाशी/i)) {
    return {
      intent: INTENT_DEFINITIONS.WEED_CONTROL,
      confidence: 0.9,
      matchedQuestion: null,
      requiredContext: ['crop', 'weed_type']
    };
  }

  // 3F. Pests & Insects
  if (q.match(/pest|insect|aphid|bollworm|caterpillar|borer|whitefly|thrips|mite|sucking pest|keeda|sundi|mahu|chepa|sundi|कीट|कीड़ा|सुंडी|माहू|सफेद मक्खी|इल्ली|छेदक/i)) {
    if (q.match(/which pesticide|which insecticide|spray|dawai|chemical|दवाई|स्प्रे/i)) {
      return {
        intent: INTENT_DEFINITIONS.PESTICIDE_RECOMMENDATION,
        confidence: 0.9,
        matchedQuestion: null,
        requiredContext: ['crop', 'pest_name']
      };
    }
    return {
      intent: INTENT_DEFINITIONS.PEST_CONTROL,
      confidence: 0.88,
      matchedQuestion: null,
      requiredContext: ['crop', 'pest_name']
    };
  }

  // 3G. Crop Growth Problems & Symptoms (Yellowing, Curling, Spots, Wilting, Stunted)
  if (q.match(/yellow|pila|peela|peele|peeli|pile|pili|chlorosis|coloue|colour|color|pale|पीला|पीले|पीली|पिला|curling|curl|मुड़|spots|धब्बे|drying|सूख|wilting|मुरझा|rot|सड़|shedding|गिर|dying|मर|stunted|slow|कमजोर|बढ़वार/i)) {
    // Yellow leaves / Chlorosis
    if (q.match(/yellow|pila|peela|peele|peeli|pile|pili|chlorosis|coloue|colour|color|pale|पीला|पीले|पीली|पिला/i) && (q.match(/leaf|leaves|patte|patti|plant|planta|पौध|पत्ती/i) || q.includes('leaf') || q.includes('plant') || q.includes('patte') || q.includes('patti'))) {
      return {
        intent: INTENT_DEFINITIONS.NUTRIENT_DEFICIENCY,
        confidence: 0.95,
        matchedQuestion: null,
        requiredContext: ['crop', 'symptoms']
      };
    }
    // Leaf reddening
    if (q.match(/red|laal|lal|reddening|लाल|लाल्या/i) && q.match(/leaf|leaves|patte|patti|पत्ती/i)) {
      return {
        intent: INTENT_DEFINITIONS.NUTRIENT_DEFICIENCY,
        confidence: 0.95,
        matchedQuestion: null,
        requiredContext: ['crop', 'soil_type', 'symptoms']
      };
    }
    // Spots / Blight / Rust
    if (q.match(/fungicide|spray|treatment|cure|dawai|fafundinashi|दवाई|उपचार/i)) {
      return {
        intent: INTENT_DEFINITIONS.DISEASE_CONTROL,
        confidence: 0.9,
        matchedQuestion: null,
        requiredContext: ['crop', 'disease_name']
      };
    }
    return {
      intent: INTENT_DEFINITIONS.CROP_GROWTH_PROBLEM,
      confidence: 0.9,
      matchedQuestion: null,
      requiredContext: ['crop', 'symptoms']
    };
  }

  // 3H. Crop Diseases & Fungal Blights
  if (q.match(/disease|fungus|blight|rust|rot|wilt|powdery mildew|mosaic|bimari|rog|fafund|झुलसा|रतुआ|उकठा|फफूंद|रोग|बीमारी|मोजेक/i)) {
    if (q.match(/fungicide|spray|treatment|cure|dawai|fafundinashi|दवाई|उपचार/i)) {
      return {
        intent: INTENT_DEFINITIONS.DISEASE_CONTROL,
        confidence: 0.9,
        matchedQuestion: null,
        requiredContext: ['crop', 'disease_name']
      };
    }
    return {
      intent: INTENT_DEFINITIONS.DISEASE_IDENTIFICATION,
      confidence: 0.88,
      matchedQuestion: null,
      requiredContext: ['crop', 'symptoms']
    };
  }

  // 3H. Flowering & Fruit Setting
  if (q.match(/flower|flowering|fruit setting|fruit drop|flower drop|fruit cracking|phool|fal|jhadna|girna|फूल|फल|झड़ना|गिरना|फटना/i)) {
    if (q.match(/flower|phool|फूल/i)) {
      return {
        intent: INTENT_DEFINITIONS.FLOWERING_PROBLEM,
        confidence: 0.88,
        matchedQuestion: null,
        requiredContext: ['crop']
      };
    }
    return {
      intent: INTENT_DEFINITIONS.FRUITING_PROBLEM,
      confidence: 0.88,
      matchedQuestion: null,
      requiredContext: ['crop']
    };
  }

  // 3I. Irrigation & Water
  if (q.match(/water|irrigation|how much water|drip|sprinkler|pani|sinchai|drip sinchai|पानी|सिंचाई|ड्रिप|फव्वारा/i)) {
    return {
      intent: INTENT_DEFINITIONS.IRRIGATION,
      confidence: 0.9,
      matchedQuestion: null,
      requiredContext: ['crop', 'soil_type', 'season']
    };
  }

  // 3J. Fertilizer & Nutrients
  if (q.match(/fertilizer|urea|dap|mop|npk|zinc|boron|nitrogen|phosphorus|potash|khad|urvarak|खाद|उर्वरक|यूरिया|डीएपी|पोटाश|जिंक/i)) {
    return {
      intent: INTENT_DEFINITIONS.FERTILIZER_RECOMMENDATION,
      confidence: 0.9,
      matchedQuestion: null,
      requiredContext: ['crop', 'soil_type', 'farm_area']
    };
  }

  // 3K. Soil & Soil Health
  if (q.match(/soil|ph|alkaline|acidic|saline|soil test|black soil|red soil|sandy|loamy|mitti|kali mitti|lal mitti|मिट्टी|काली मिट्टी|लाल मिट्टी|दोमट|जांच|पीएच/i)) {
    if (q.match(/test|jaanch|lab|card|जांच|परीक्षण/i)) {
      return {
        intent: INTENT_DEFINITIONS.SOIL_TESTING,
        confidence: 0.9,
        matchedQuestion: null,
        requiredContext: ['location']
      };
    }
    if (q.match(/crop|fasal|which crop|konsi fasal|फसल/i)) {
      return {
        intent: INTENT_DEFINITIONS.CROP_SELECTION,
        confidence: 0.9,
        matchedQuestion: null,
        requiredContext: ['soil_type', 'season']
      };
    }
    return {
      intent: INTENT_DEFINITIONS.SOIL_HEALTH,
      confidence: 0.88,
      matchedQuestion: null,
      requiredContext: ['soil_type']
    };
  }

  // 3L. Seed & Varieties
  if (q.match(/seed|variety|hybrid|germination|certified seed|beej|kism|variety konsi|बीज|किस्म|हाइब्रिड|अंकुरण/i)) {
    if (q.match(/treatment|upchar|trichoderma|rhizobium|उपचार/i)) {
      return {
        intent: INTENT_DEFINITIONS.SEED_TREATMENT,
        confidence: 0.9,
        matchedQuestion: null,
        requiredContext: ['crop']
      };
    }
    return {
      intent: INTENT_DEFINITIONS.SEED_SELECTION,
      confidence: 0.88,
      matchedQuestion: null,
      requiredContext: ['crop', 'location', 'season']
    };
  }

  // 3M. Land Prep, Sowing & Cultivation
  if (q.match(/how to grow|how to cultivate|cultivation|package of practices|kheti kaise karein|kheti|ugayein|खेती कैसे करें|उगाएं|खेती/i)) {
    return {
      intent: INTENT_DEFINITIONS.CROP_CULTIVATION,
      confidence: 0.92,
      matchedQuestion: null,
      requiredContext: ['crop', 'location', 'soil_type']
    };
  }

  if (q.match(/sow|sowing|depth|spacing|plant population|buwai|ropai|बुवाई|रोपाई|दूरी|गहराई/i)) {
    if (q.match(/ropai|transplant|नर्सरी|रोपाई/i)) {
      return {
        intent: INTENT_DEFINITIONS.TRANSPLANTING,
        confidence: 0.88,
        matchedQuestion: null,
        requiredContext: ['crop']
      };
    }
    return {
      intent: INTENT_DEFINITIONS.SOWING,
      confidence: 0.88,
      matchedQuestion: null,
      requiredContext: ['crop']
    };
  }

  if (q.match(/plough|plowing|tillage|land prep|khet taiyari|jutai|जुताई|खेत तैयारी/i)) {
    return {
      intent: INTENT_DEFINITIONS.LAND_PREPARATION,
      confidence: 0.88,
      matchedQuestion: null,
      requiredContext: ['crop', 'soil_type']
    };
  }

  if (q.match(/harvest|harvesting|katai|todai|कटाई|तोड़ाई/i)) {
    return {
      intent: INTENT_DEFINITIONS.HARVESTING,
      confidence: 0.9,
      matchedQuestion: null,
      requiredContext: ['crop']
    };
  }

  if (q.match(/store|storage|storage moisture|grain safety|भंडारण|स्टोरेज/i)) {
    return {
      intent: INTENT_DEFINITIONS.STORAGE,
      confidence: 0.9,
      matchedQuestion: null,
      requiredContext: ['crop']
    };
  }

  if (q.match(/weather|rain|flood|drought|heat|frost|cold|mausam|barish|sookha|baarh|मौसम|बारिश|सूखा|बाढ़|पाला|गर्मी/i)) {
    if (q.match(/rain|flood|baarh|बारिश|बाढ़/i)) {
      return {
        intent: INTENT_DEFINITIONS.FLOOD_MANAGEMENT,
        confidence: 0.86,
        matchedQuestion: null,
        requiredContext: ['crop']
      };
    }
    if (q.match(/drought|sookha|सूखा/i)) {
      return {
        intent: INTENT_DEFINITIONS.DROUGHT_MANAGEMENT,
        confidence: 0.86,
        matchedQuestion: null,
        requiredContext: ['crop']
      };
    }
    return {
      intent: INTENT_DEFINITIONS.WEATHER_ADVISORY,
      confidence: 0.86,
      matchedQuestion: null,
      requiredContext: ['crop', 'location']
    };
  }

  return {
    intent: INTENT_DEFINITIONS.GENERAL_AGRICULTURAL_QUESTION,
    confidence: 0.5,
    matchedQuestion: null,
    requiredContext: ['crop']
  };
}
