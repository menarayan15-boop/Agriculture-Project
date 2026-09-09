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
 * Step 1: Strict AI Vision Soil Image Validation
 * Returns structured classification: { isSoil, confidence, reason, imageQuality, soilVisibility, errorCode, errorMessage }
 */
export async function validateSoilImage({ imageBase64, mimeType, apiKey }) {
  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
      const prompt = `You are a strict Image Classifier for an agricultural soil testing system.

Task: Determine whether the provided image primarily contains genuine visible SOIL / earth suitable for agricultural soil testing.

MANDATORY REJECTION CRITERIA (Set isSoil = false):
Reject if the image contains:
- Cars, bikes, vehicles, tractors, machinery, wheels, roads, asphalt
- People, faces, human body parts without soil
- Buildings, houses, walls, furniture, interior rooms
- Plants, crops, leaves, fruits, flowers with NO predominant soil
- Animals, insects, food items
- Screenshots, graphics, text, documents, logos, solid colors
- Sky, mountains, clouds, water bodies
- Extremely blurry, dark, or unidentifiable images.

ACCEPT CRITERIA (Set isSoil = true):
Accept ONLY if genuine natural agricultural soil, farmland dirt, soil in a tray/pot, or soil sample occupies the majority (> 70%) of the frame. Colors include red laterite, black cotton, sandy loam, alluvial, clay, brown loam, wet mud, or dry earth.

Return ONLY structured JSON:
{
  "isSoil": true or false,
  "confidence": number between 0.0 and 1.0 (e.g. 0.95),
  "reason": "Specific description of what is detected in the image",
  "imageQuality": "good" or "poor",
  "soilVisibility": "high" or "medium" or "low" or "none"
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
          const isSoil = Boolean(parsed.isSoil);
          const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : (isSoil ? 0.92 : 0.95);
          const soilVisibility = parsed.soilVisibility || (isSoil ? 'high' : 'none');
          const imageQuality = parsed.imageQuality || 'good';
          const reason = parsed.reason || (isSoil ? 'Soil detected' : 'Non-soil image detected');

          // Strict Confidence Thresholds
          if (!isSoil || confidence < 0.80 || soilVisibility === 'none' || soilVisibility === 'low' || imageQuality === 'poor') {
            let errorCode = 'INVALID_IMAGE';
            let errorMessage = '❌ अमान्य फोटो (Invalid Image): यह मिट्टी की फोटो नहीं है (वाहन/इमारत/वस्तु पाई गई)। AI केवल खेत या गमले की असली मिट्टी (soil) की फोटो का परीक्षण करता है। / This does not appear to be a soil photo.';
            
            if (imageQuality === 'poor') {
              errorCode = 'POOR_QUALITY';
              errorMessage = '📸 फोटो बहुत धुंधली या अँधेरे में है (Poor Image Quality)। कृपया अच्छी रोशनी में साफ़ क्लोज़-अप फोटो अपलोड करें। / The image is too blurry or dark for analysis.';
            } else if (soilVisibility === 'low' || soilVisibility === 'none') {
              errorCode = 'NO_SOIL_VISIBLE';
              errorMessage = '🌱 मिट्टी साफ़ दिखाई नहीं दे रही है (Soil Not Clearly Visible)। कृपया केवल पौधों की नहीं बल्कि मिट्टी की क्लोज़-अप फोटो लें। / Soil is not clearly visible in the image.';
            } else if (confidence < 0.80) {
              errorCode = 'LOW_CONFIDENCE';
              errorMessage = '⚠️ मिट्टी की स्पष्ट पहचान नहीं हो सकी (Low Confidence)। कृपया खेत से साफ़ मिट्टी का नमूना अपलोड करें। / Soil could not be confidently identified.';
            }

            return {
              success: false,
              isSoil: false,
              confidence,
              reason,
              imageQuality,
              soilVisibility,
              errorCode,
              errorMessage
            };
          }

          return {
            success: true,
            isSoil: true,
            confidence,
            reason,
            imageQuality,
            soilVisibility
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
      const prompt = `You are a Soil Agronomist. This image has been verified as a genuine soil sample.
Analyze the soil's visible color, texture, moisture, and estimate its agronomic properties.

Return ONLY structured JSON:
{
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
