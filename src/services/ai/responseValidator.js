/**
 * Response Validator for Krishi AI
 * Validates generated AI responses against botanical, agronomic, and chemical safety rules.
 */

/**
 * Validates an AI answer against detected crop and intent.
 * @param {string} response - Raw AI generated text
 * @param {Object} detectedCrop - Target crop object
 * @param {string} intent - Detected intent
 * @returns {Object} { isValid: boolean, reason?: string }
 */
export function validateCropResponse(response, detectedCrop, intent) {
  if (!response || !response.trim()) {
    return { isValid: false, reason: 'Empty response' };
  }

  const res = response.toLowerCase();
  const cropId = detectedCrop?.id || '';

  // 1. Sugarcane Propagation Check
  if (cropId === 'sugarcane') {
    if (res.includes('sow seeds at 4-5 cm') || res.includes('sow high-yield treated seeds at 4-5 cm') ||
        res.includes('sowing seeds at 4-5 cm') || res.includes('seed rate of 40-45 kg')) {
      return {
        isValid: false,
        reason: 'Sugarcane is vegetatively propagated using stem setts/cuttings in furrows, not sown from seeds at 4-5cm depth.'
      };
    }
  }

  // 2. Potato Propagation Check
  if (cropId === 'potato') {
    if (res.includes('sow seeds at 4-5 cm') || res.includes('sow seeds at 8-10 cm')) {
      return {
        isValid: false,
        reason: 'Potato is planted using seed tubers on ridges, not sown from grain seeds.'
      };
    }
  }

  // 3. Chickpea Irrigation & Nitrogen Check
  if (cropId === 'chickpea') {
    if (res.includes('5-6 timely irrigations') || res.includes('5-6 irrigations') || res.includes('ensure 5-6 timely irrigations')) {
      return {
        isValid: false,
        reason: 'Chickpea requires only 1-2 light irrigations; 5-6 irrigations causes root rot, wilt, and flower drop.'
      };
    }
  }

  // 4. Rice Water Stagnation & Zinc Check
  if (cropId === 'rice') {
    if (res.includes('dry soil sowing at 8-10 cm depth') || (intent === 'fertilizer_recommendation' && res.includes('do not apply zinc'))) {
      return {
        isValid: false,
        reason: 'Rice requires puddling or DSR tar-watter and essential zinc sulphate to prevent Khaira disease.'
      };
    }
  }

  // 5. Cotton Leaf Reddening Check
  if (cropId === 'cotton' && res.includes('red leaves')) {
    if (!res.includes('magnesium') && !res.includes('lalya') && !res.includes('deficiency') && !res.includes('mgso4') && !res.includes('पोषक') && !res.includes('लाल')) {
      return {
        isValid: false,
        reason: 'Cotton leaf reddening is primarily caused by Magnesium deficiency and physiological stress.'
      };
    }
  }

  // 6. Generic Template Detection
  // Detect if the response repeats the exact generic 4-line boilerplate template
  if (res.includes('sow high-yield treated seeds at 4-5 cm depth') &&
      res.includes('50 kg dap + 25 kg mop') &&
      res.includes('top-dressing urea after first irrigation at 21 days')) {
    return {
      isValid: false,
      reason: 'Response contains the generic boilerplate template.'
    };
  }

  return { isValid: true };
}
