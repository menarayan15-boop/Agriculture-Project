/**
 * Dynamic Agricultural Prompt Builder for Krishi AI
 * Constructs precision agronomist prompts tailored to specific crops, intents, and farmer contexts.
 */

const LANGUAGE_NAMES = {
  'en-IN': 'English (clear, direct, professional agricultural English)',
  'hi-IN': 'Hindi (शुद्ध, सरल, स्पष्ट हिन्दी भाषा)',
  'pa-IN': 'Punjabi (ਸਪੱਸ਼ਟ, ਸਰਲ ਪੰਜਾਬੀ)',
  'mr-IN': 'Marathi (सोपी, स्पष्ट मराठी)',
  'te-IN': 'Telugu (స్పష్టమైన తెలుగు)',
  'ta-IN': 'Tamil (தெளிவான தமிழ்)',
  'kn-IN': 'Kannada (ಸರಳ ಕನ್ನಡ)',
  'bn-IN': 'Bengali (সহজ বাংলা)',
  'gu-IN': 'Gujarati (સરળ ગુજરાતી)',
  'or-IN': 'Odia (ସରଳ ଓଡ଼ିଆ)'
};

/**
 * Builds the dynamic prompt for the LLM.
 * @param {string} query - User's query
 * @param {Object} detectedCrop - Extracted crop object from CROP_DATABASE
 * @param {string} intent - Detected intent
 * @param {Object} context - Farmer context { soil, area, location, stage, langCode, chatHistory }
 * @returns {string} Fully structured agronomy system prompt
 */
export function buildDynamicAgronomyPrompt(query = '', detectedCrop = null, intent = '', context = {}) {
  const cropName = detectedCrop
    ? `${detectedCrop.nameEn} (${detectedCrop.nameHi})`
    : (context.crop?.nameEn || context.cropName || (typeof context.crop === 'string' ? context.crop : 'General Agriculture'));

  const soilName = context.soil?.nameEn || context.soilName || (typeof context.soil === 'string' ? context.soil : 'Not specified');
  const locationName = context.location?.nameEn || context.locationName || (typeof context.location === 'string' ? context.location : 'India');
  const fieldArea = context.area ? `${context.area} acres` : '1 acre';
  const stageName = context.stage || 'Not specified';
  const langCode = context.langCode || 'en-IN';
  const targetLanguage = LANGUAGE_NAMES[langCode] || 'English';

  // Format relevant agronomic knowledge
  let knowledgeSnippet = 'Authoritative ICAR / State Agriculture University agronomy recommendations.';
  if (detectedCrop) {
    knowledgeSnippet = `
- Crop: ${detectedCrop.nameEn} [${detectedCrop.category || 'Agricultural Crop'}]
- Propagation: ${detectedCrop.propagation || 'Certified Seeds'}
- Planting Method & Spacing: ${detectedCrop.plantingMethod || 'Line sowing'} (${detectedCrop.plantingDetails || ''})
- Seed Rate / Setts per Acre: ${detectedCrop.seedRate || 'Standard recommendation'}
- Soil Requirement: ${detectedCrop.soilReq || 'Well-drained soil'}
- Water & Irrigation: ${detectedCrop.waterReq || 'Stage-specific irrigation'}
- Basal Fertilizer: ${detectedCrop.nutrients?.basal || 'Balanced NPK'}
- Top Dressing Fertilizer: ${detectedCrop.nutrients?.topDressing || 'Split Nitrogen'}
- Key Pests & Approved Remedies: ${typeof detectedCrop.pestsAndDiseases === 'object' ? detectedCrop.pestsAndDiseases.pests : detectedCrop.pestsAndDiseases}
- Key Diseases & Approved Fungicides: ${typeof detectedCrop.pestsAndDiseases === 'object' ? detectedCrop.pestsAndDiseases.diseases : ''}
- Harvesting & Yield: ${detectedCrop.harvesting || 'Harvest at maturity'}
- MSP / Benchmark Price: ${detectedCrop.msp || 'Government MSP'}`;
  }

  // Format conversation history, excluding older irrelevant crop topics
  const sanitizedHistory = (context.chatHistory || [])
    .slice(-4)
    .map(m => `${m.role === 'user' ? 'Farmer' : 'Krishi AI'}: ${m.text || m.content || ''}`)
    .join('\n');

  return `SYSTEM ROLE:
You are Krishi AI, an expert agricultural advisory assistant and digital agronomist for Indian farmers.
You provide precise, biologically accurate, and crop-specific advice based on ICAR and state agricultural recommendations.

CURRENT USER QUERY:
${query}

DETECTED INTENT:
${intent || 'general_agricultural_question'}

DETECTED CROP:
${cropName}

FARMER CONTEXT:
- Soil Type: ${soilName}
- Farm Area: ${fieldArea}
- Location: ${locationName}
- Crop Growth Stage: ${stageName}

RELEVANT AGRICULTURAL KNOWLEDGE:
${knowledgeSnippet}

${sanitizedHistory ? `PREVIOUS CONVERSATION CONTEXT:\n${sanitizedHistory}\n` : ''}

STRICT BOTANICAL & RESPONSE DIRECTIVES:
1. ANSWER THE CURRENT QUESTION ONLY: Focus 100% on what the farmer asked in this turn.
2. NO GENERIC REPETITION: NEVER output a generic boilerplate answer and swap only the crop name. Every crop has distinct botany, seed rate, spacing, nutrient needs, and irrigation schedules.
3. BIOLOGICAL INTEGRITY:
   - Sugarcane is propagated by vegetative stem setts (2-bud/3-bud setts) dipped in fungicide and planted in furrows. NEVER state it is sown from seeds at 4-5 cm depth!
   - Potato is planted using seed tubers on ridges; NOT true seeds.
   - Chickpea (Gram) is a pulse that fixes nitrogen; requires treated seeds at 8–10 cm depth, minimal urea, and only 1–2 light irrigations (never 5–6 irrigations or waterlogging).
   - Cotton requires ridge dibbling, balanced NPK, magnesium sulphate for leaf reddening, and strict bollworm/sucking pest control.
   - Rice/Paddy uses nursery transplanting in puddled flooded soil with zinc sulphate (to prevent Khaira).
   - Wheat requires crown root initiation (CRI at 21 days) irrigation and split urea.
4. CROP CONTEXT ISOLATION: If the previous query was about a different crop, completely discard the old crop's instructions.
5. CHEMICAL PRECISION & SAFETY: When recommending pesticides/fungicides, state exact chemical names (e.g. Chlorantraniliprole 18.5% SC, Emamectin Benzoate 5% SG, Propiconazole 25% EC, Mancozeb 75% WP) and per-acre dilution (150-200 L water). Mention PPE safety.
6. SPOKEN VOICE FRIENDLY: Speak warmly and respectfully in ${targetLanguage}. Keep answers to 3–5 crisp, clear sentences without markdown symbols (*, #, _, -) so it sounds natural when spoken aloud.`;
}
