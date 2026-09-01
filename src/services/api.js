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

export async function analyzeSoilImage({ imageBase64, mimeType, apiKey }) {
  try {
    if (apiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
      const prompt = `You are a Soil Science Computer Vision AI.
STRICT MANDATORY REJECTION RULES:
Analyze the provided image carefully.
1. REJECT if the image shows ANY OF THE FOLLOWING:
   - Plant leaves, green foliage, crops, tree leaves, indoor plants, Caladium leaves, flowers, garden plants, grass
   - Sheets of paper (brown paper, cardboard, craft paper, documents, envelopes, printed text, paper sheets)
   - Digital wallpapers, solid color images, smooth color gradients, background swatches, screen graphics
   - Wood surfaces, furniture, leather, tiles, carpet, walls, cloth, fabric
   - Cars, vehicles, buildings, houses, streets, electronics, appliances
   - Human faces, hands without soil, animals, food items, indoor rooms
   - Any synthetic, artificial, or smooth surface even if it is brown or earth-colored.

IF ANY REJECTION RULE APPLIES (e.g. plant leaf, crop, paper, cardboard, smooth wallpaper, non-soil object):
Return ONLY JSON:
{
  "is_soil": false,
  "reason": "Not real soil (Plant leaf/Foliage/Paper/Cardboard/Wall/Non-soil object)",
  "error": "❌ यह मिट्टी की फोटो नहीं है! यह पौधे या पत्ती (Plant / Leaf) की फोटो है। सॉइल लैब केवल खेत या गमले की मिट्टी की फोटो का परीक्षण करता है। फसल सलाह के लिए Crop Advisor टैब का उपयोग करें। / Not a soil photo! Plant/Leaf photo detected. Soil Lab tests soil ground pictures only."
}

2. ONLY IF THE IMAGE SHOWS REAL NATURAL PHYSICAL SOIL, FARMLAND DIRT, GROUND EARTH, OR PHYSICAL SOIL SAMPLE (WITH NATURAL DIRT GRAIN & TEXTURE):
Return ONLY JSON:
{
  "is_soil": true,
  "soil_type": "काली मिट्टी / Black Cotton Soil",
  "color_analysis": "गहरा भूरा/काला रंग...",
  "texture": "चिकनी दोमट मिट्टी / Clayey Loam",
  "estimated_ph": "7.2",
  "organic_matter": "उच्च / High",
  "moisture_content": "नम / Moist",
  "nitrogen_status": "पर्याप्त / Adequate",
  "phosphorus_status": "कम / Low",
  "potassium_status": "बहुत अच्छा / High",
  "drainage": "अच्छा / Good",
  "compaction": "कम / Low",
  "visible_deficiencies": ["नाइट्रोजन कमी"],
  "suitable_crops": ["गेहूं (Wheat)", "कपास (Cotton)"],
  "improvements_needed": ["जैविक खाद डालें"],
  "fertilizer_advice": "40 kg Urea प्रति एकड़",
  "irrigation_advice": "15-20 दिन में सिंचाई करें",
  "overall_health_score": 82,
  "summary": "आपकी मिट्टी गेहूं और कपास के लिए बहुत उत्तम है।"
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
        if (parsed.is_soil === false || parsed.error) {
          return { success: false, error: parsed.error || '❌ यह मिट्टी की फोटो नहीं है! / Not a soil photo!' };
        }
        return { success: true, analysis: parsed };
      }
    }
  } catch (err) {
    console.warn('Gemini vision endpoint warning:', err);
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
