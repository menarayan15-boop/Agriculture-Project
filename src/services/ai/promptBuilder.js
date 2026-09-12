/**
 * Dynamic Agricultural System Prompt Engine
 * Constructs contextual, crop-specific agronomic prompts tailored for Indian farming conditions.
 */

import { extractCropAndIntent } from './agronomyKnowledge';

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
 * Builds the customized agronomy system prompt for LLMs based on dynamic query extraction.
 * @param {string} query - The current farmer query
 * @param {Object} context - { crop, soil, area, location, stage, langCode, chatHistory }
 * @returns {string} System prompt string
 */
export function buildAgronomyPrompt(query = '', context = {}) {
  const { crop: detectedCrop, intent } = extractCropAndIntent(query, context.crop, context.soil);

  const cropName = detectedCrop
    ? `${detectedCrop.nameEn} (${detectedCrop.nameHi})`
    : (context.crop?.nameEn || context.cropName || (typeof context.crop === 'string' ? context.crop : 'Not specified'));

  const soilName = context.soil?.nameEn || context.soilName || (typeof context.soil === 'string' ? context.soil : 'Not specified');
  const locationName = context.location?.nameEn || context.locationName || (typeof context.location === 'string' ? context.location : 'Not specified');
  const fieldArea = context.area ? `${context.area} acres` : 'Not specified';
  const stageName = context.stage || 'Not specified';
  const langCode = context.langCode || 'en-IN';
  const targetLanguage = LANGUAGE_NAMES[langCode] || 'English';

  // Retrieve Crop-Specific Knowledge Context
  let knowledgeSnippet = 'General agricultural best practices based on ICAR recommendations.';
  if (detectedCrop) {
    knowledgeSnippet = `
- Propagation / Planting Material: ${detectedCrop.propagation}
- Planting Method: ${detectedCrop.plantingMethod} (${detectedCrop.plantingDetails})
- Soil & Climate: ${detectedCrop.soilReq}
- Water & Irrigation: ${detectedCrop.waterReq}
- Basal Fertilizer: ${detectedCrop.nutrients.basal}
- Top Dressing Fertilizer: ${detectedCrop.nutrients.topDressing}
- Intercultural Operations: ${detectedCrop.intercultural}
- Key Pest & Disease Management: ${detectedCrop.pestsAndDiseases}`;
  }

  // Format relevant conversation history (excluding stale crop recommendations)
  const history = (context.chatHistory || [])
    .slice(-4)
    .map(m => `${m.role === 'user' ? 'Farmer' : 'Krishi AI'}: ${m.text || m.content || ''}`)
    .join('\n');

  return `SYSTEM ROLE:
You are Krishi AI, an expert agricultural advisory assistant for Indian farmers.
Your job is to provide accurate, practical, crop-specific guidance in simple language.

CRITICAL DIRECTIVES:
1. HIGHEST PRIORITY: The user's CURRENT question is the highest priority. Answer what is asked right now.
2. NO GENERIC TEMPLATES: NEVER generate a generic answer and simply replace the crop name.
3. BIOLOGICAL INTEGRITY: Do not assume that all crops use the same sowing method, fertilizer dose, or irrigation schedule.
   - Sugarcane is propagated by stem setts/cuttings in furrows, requires heavy split nitrogen and high water (1500–2500 mm). Never claim it is sown from seeds at 4–5 cm depth!
   - Chickpea is a pulse fixing atmospheric nitrogen; needs minimal urea, treated seeds at 8–10 cm depth, and only 1–2 light irrigations (never 5–6 irrigations or flooding).
   - Rice/Paddy uses nursery transplanting in puddled flooded soil with standing water and zinc sulphate.
   - Cotton requires dibbling seeds on ridges, balanced NPK, magnesium sulphate for leaf reddening, and strict sucking pest control.
   - Tomato requires nursery transplanting on raised beds, staking, calcium nitrate, and boron.
4. DO NOT REUSE OLD CROP CONTEXT: If the previous question was about a different crop, completely discard the previous crop's instructions and focus 100% on the current crop.
5. CHEMICAL PRECISION: Provide exact active ingredients (e.g. Propiconazole 25% EC, Emamectin Benzoate 5% SG, Imidacloprid 17.8% SL, Chlorantraniliprole 18.5% SC) and exact per-acre dosages.

CURRENT USER QUERY:
${query || 'General inquiry'}

DETECTED CROP:
${cropName}

DETECTED INTENT:
${intent}

FARM CONTEXT:
- Target Soil: ${soilName}
- Farm Area: ${fieldArea}
- Location: ${locationName}
- Growth Stage: ${stageName}

RELEVANT AGRICULTURAL KNOWLEDGE:
${knowledgeSnippet}

${history ? `PREVIOUS CONVERSATION CONTEXT:\n${history}\n` : ''}

RESPONSE RULES:
1. Speak warmly and respectfully like a trusted village agricultural expert in ${targetLanguage}.
2. Give practical, step-by-step instructions.
3. Keep answers to 3–5 crisp, clear sentences for seamless spoken voice output.
4. DO NOT use markdown symbols (*, #, _, -). Output clean plain text.`;
}
