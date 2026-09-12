// Krishi Jal REST API Service Interface (connects to server.py)

const API_BASE = '/api';

export async function fetchServerStatus() {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('API status error');
    return await res.json();
  } catch (err) {
    console.warn('Backend server offline or unreachable:', err);
    return null;
  }
}

export async function fetchCrops() {
  try {
    const res = await fetch(`${API_BASE}/crops`);
    if (!res.ok) throw new Error('Crops API error');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchSchemes() {
  try {
    const res = await fetch(`${API_BASE}/schemes`);
    if (!res.ok) throw new Error('Schemes API error');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchEquipment() {
  try {
    const res = await fetch(`${API_BASE}/equipment`);
    if (!res.ok) throw new Error('Equipment API error');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchProduce() {
  try {
    const res = await fetch(`${API_BASE}/produce`);
    if (!res.ok) throw new Error('Produce API error');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function bookEquipment(bookingData) {
  try {
    const res = await fetch(`${API_BASE}/equipment/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Server offline' };
  }
}

export async function addProduceListing(produceData) {
  try {
    const res = await fetch(`${API_BASE}/produce/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produceData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Server offline' };
  }
}

export async function saveSoilReport(reportData) {
  try {
    const res = await fetch(`${API_BASE}/soillab/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Server offline' };
  }
}

/**
 * Step 1: Two-Stage Robust AI Vision Soil Image Validation
 * Returns standardized structured classification:
 * { success, is_soil, isSoil, confidence, soil_area_percentage, image_quality, decision, reason, suggestion, errorMessage }
 */
export async function validateSoilImage({ imageBase64, mimeType, apiKey }) {
  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
      const prompt = `You are a visual classifier for an agricultural soil-testing application.

Determine whether the uploaded photograph contains a meaningful and sufficiently visible amount of NATURAL SOIL suitable for agricultural soil analysis.

Accept natural soil in any realistic appearance:
- Dry, wet, dark, brown, red, black, sandy, clay, loamy, granular, or clumped soil.
- Soil profile, embankment, horizontal/vertical cross-section, or agricultural field soil.
- Soil sample placed in a container, tray, bucket, or held in a person's hand.
- Soil containing small stones, rocks, roots, organic matter, or small vegetation/grass patches.
- Crops or seedlings where soil around the roots is clearly visible and meaningful.

Do not classify based solely on color. Brown color alone is not evidence of soil (e.g. brown clothes, leather, cardboard, wooden tables, or brown cars must be REJECTED). Conversely, red, black, yellow, grey, sandy, or dark soils with granular/earthy texture MUST BE ACCEPTED.

Small amounts of rocks, roots, grass, hands, containers, or agricultural surroundings do not invalidate a soil photograph if soil remains clearly visible and meaningful.

Reject photographs where the primary visual content is a car, motorcycle, clothing, footwear, machinery, tractor, building, person/face, animal, plant without visible soil, road, furniture, electronics, mobile phone, laptop, tools, food, documents, screenshots, sky, water, or another unrelated object.

Return ONLY structured JSON in this exact format:
{
  "is_soil": true or false,
  "confidence": number between 0.0 and 1.0 (e.g. 0.91),
  "soil_area_percentage": integer percentage (0 to 100),
  "image_quality": "good" or "poor",
  "decision": "ACCEPT" or "REJECT" or "RETRY",
  "reason": "Clear, concise reason explaining the classification",
  "suggestion": null or "Actionable guidance for the farmer if RETRY or REJECT"
}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType || 'image/jpeg', data: imageBase64 } }
            ]
          }],
          generationConfig: {
            response_mime_type: "application/json",
            temperature: 0.1
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textOutput) {
          const parsed = JSON.parse(textOutput);

          const rawDecision = (parsed.decision || '').toUpperCase();
          const is_soil_flag = Boolean(parsed.is_soil);
          let decision = rawDecision;
          if (!['ACCEPT', 'REJECT', 'RETRY'].includes(decision)) {
            decision = is_soil_flag ? 'ACCEPT' : 'REJECT';
          }

          const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : (decision === 'ACCEPT' ? 0.92 : 0.25);
          const soil_area_percentage = typeof parsed.soil_area_percentage === 'number' ? parsed.soil_area_percentage : (decision === 'ACCEPT' ? 75 : 10);
          const image_quality = parsed.image_quality || 'good';
          const reason = parsed.reason || (decision === 'ACCEPT' ? 'Natural soil is clearly visible and suitable for analysis.' : 'Soil not clearly detected.');
          const suggestion = parsed.suggestion || null;

          // Debug logging in development mode
          if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
            console.log('[Soil Validation Debug - Gemini]:', {
              soil_confidence: confidence,
              soil_area_percentage,
              image_quality,
              decision,
              model_response: parsed
            });
          }

          if (decision === 'REJECT') {
            return {
              success: false,
              is_soil: false,
              isSoil: false,
              confidence,
              soil_area_percentage,
              image_quality,
              decision: 'REJECT',
              reason,
              suggestion: suggestion || 'Please upload a close-up photograph of the soil.',
              errorCode: 'REJECTED_NON_SOIL',
              errorMessage: '❌ Soil not clearly detected / मिट्टी स्पष्ट रूप से नहीं पाई गई\n\nPlease upload a close-up photo where soil is clearly visible and occupies most of the frame.\n\nAvoid photos where cars, machinery, buildings, clothing or other objects are the main subject.'
            };
          }

          if (decision === 'RETRY') {
            return {
              success: false,
              is_soil: false,
              isSoil: false,
              confidence,
              soil_area_percentage,
              image_quality,
              decision: 'RETRY',
              reason,
              suggestion: suggestion || 'Please move closer to the soil and take another photo in good daylight.',
              errorCode: 'RETRY_UNCLEAR_SOIL',
              errorMessage: '⚠️ Soil is not clear enough / मिट्टी साफ़ दिखाई नहीं दे रही है\n\nPlease move closer to the soil and take another photo in good daylight.'
            };
          }

          // ACCEPT decision
          return {
            success: true,
            is_soil: true,
            isSoil: true,
            confidence,
            soil_area_percentage,
            image_quality,
            decision: 'ACCEPT',
            reason,
            suggestion: null,
            successMessage: '✓ Soil detected successfully\n\nYour soil sample is ready for analysis.'
          };
        }
      }
    } catch (err) {
      console.warn('AI vision validation API call skipped or error:', err);
    }
  }

  return null; // Signals frontend to use client-side multi-zone spatial validation
}

/**
 * Step 2: Soil Analysis (ONLY called if validation passed!)
 */
export async function analyzeSoilImage({ imageBase64, mimeType, apiKey }) {
  try {
    if (apiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
      const prompt = `You are a Soil Agronomist. First, verify whether this image is a genuine soil sample.
If the image is a car, vehicle, clothing, machinery, person, electronics, animal, or non-soil object, return:
{
  "is_soil": false,
  "error": "❌ Non-soil object detected. Please upload a close-up photo of natural soil."
}

Otherwise, analyze the soil's visible color, texture, moisture, and estimate its agronomic properties.
Return ONLY structured JSON:
{
  "is_soil": true,
  "soil_type": "लाल मिट्टी / Red Laterite Soil",
  "color_analysis": "गहरा लाल-नारंगी रंग, लौह ऑक्साइड की प्रचुरता...",
  "texture": "दानेदार दोमट / Gravelly Loam",
  "estimated_ph": "6.2",
  "organic_matter": "मध्यम / Moderate",
  "moisture_content": "मध्यम सूखी / Semi-dry",
  "nitrogen_status": "मध्यम / Moderate",
  "phosphorus_status": "कम / Low",
  "potassium_status": "अच्छा / Good",
  "drainage": "अच्छा / Well-drained",
  "compaction": "कम / Low",
  "visible_deficiencies": ["फास्फोरस कमी"],
  "suitable_crops": ["मूंगफली (Groundnut)", "रागी (Finger Millet)", "अरहर (Pigeon Pea)", "कपास (Cotton)"],
  "improvements_needed": ["जैविक खाद व DAP डालें", "हल्का चूना मिलाएं"],
  "fertilizer_advice": "40 kg DAP, 30 kg Urea प्रति एकड़",
  "irrigation_advice": "8-12 दिन में हल्की सिंचाई करें",
  "overall_health_score": 76,
  "summary": "यह लाल मिट्टी मूंगफली और दलहन के लिए अनुकूल है।"
}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType || 'image/jpeg', data: imageBase64 } }
            ]
          }],
          generationConfig: {
            response_mime_type: "application/json",
            temperature: 0.2
          }
        })
      });

      if (!res.ok) throw new Error(`Gemini API HTTP error ${res.status}`);
      const data = await res.json();
      const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textOutput) {
        const parsed = JSON.parse(textOutput);
        return { success: true, analysis: parsed };
      }
    }
  } catch (err) {
    console.warn('Gemini vision analysis error:', err);
  }
  return { success: false, error: 'Gemini API call skipped or failed' };
}

export async function fetchFarmerProfile() {
  try {
    const res = await fetch(`${API_BASE}/farmer/profile`);
    if (!res.ok) throw new Error('Profile API error');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function saveFarmerProfile(profileData) {
  try {
    const res = await fetch(`${API_BASE}/farmer/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Server offline' };
  }
}
