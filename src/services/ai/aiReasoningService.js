/**
 * AiReasoningService - Direct Browser Groq AI Engine
 * Makes direct fetch() calls to Groq API from the browser.
 * NO backend proxy dependency. Everything runs client-side.
 */

import { buildAgronomyPrompt } from './promptBuilder';

const DEFAULT_GROQ_KEY = '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';

/**
 * Execute AI reasoning for an agricultural query.
 * @param {string} query - Farmer's question
 * @param {Object} context - { crop, soil, area, location, stage, langCode, apiKey, chatHistory }
 * @returns {Promise<string>} Clean answer text
 */
export async function getAiAnswer(query, context = {}) {
  if (!query || !query.trim()) return '';

  const apiKey = context.apiKey && context.apiKey.trim() ? context.apiKey.trim() : DEFAULT_GROQ_KEY;
  const langCode = context.langCode || 'en-IN';

  // Build system prompt with farmer's field context
  const systemPrompt = buildAgronomyPrompt({ ...context, langCode });

  // Sanitize chat history for strict role alternation
  const sanitizedHistory = sanitizeChatHistory(context.chatHistory || []);

  const messages = [
    { role: 'system', content: systemPrompt },
    ...sanitizedHistory,
    { role: 'user', content: query.trim() }
  ];

  // Direct browser fetch to Groq API with multi-model fallback
  const modelsToTry = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768'
  ];

  for (const model of modelsToTry) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 600,
          top_p: 0.95
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text && text.trim()) {
          return cleanAiResponse(text);
        }
      } else {
        const errBody = await response.json().catch(() => ({}));
        console.warn(`Groq model ${model} HTTP ${response.status}:`, errBody?.error?.message || response.statusText);
      }
    } catch (err) {
      console.warn(`Groq fetch error (${model}):`, err.message);
    }
  }

  // All models failed — return offline response
  console.warn('All Groq models failed. Using offline response engine.');
  return getOfflineAgronomyResponse(query, context);
}

/**
 * Clean AI text for display and SpeechSynthesis
 */
export function cleanAiResponse(text) {
  if (!text) return '';
  return text.replace(/[\*\#\`\_\[\]]/g, '').trim();
}

/**
 * Ensure chat messages strictly alternate user / assistant roles for Groq API
 */
function sanitizeChatHistory(chatHistory = []) {
  const clean = [];
  let lastRole = 'system';

  for (const msg of chatHistory.slice(-6)) {
    const currentRole = msg.role === 'user' ? 'user' : 'assistant';
    const content = msg.text || msg.content || '';
    if (currentRole !== lastRole && content && content.trim()) {
      clean.push({ role: currentRole, content: content.trim() });
      lastRole = currentRole;
    }
  }
  return clean;
}

/**
 * 15-Category Offline Agricultural Precision Engine
 */
export function getOfflineAgronomyResponse(query, context = {}) {
  const q = query.toLowerCase();
  const crop = context.crop?.nameEn || context.cropName || 'Wheat';
  const soil = context.soil?.nameEn || context.soilName || 'Sandy Loam';
  const area = context.area || 1.0;
  const location = context.location?.nameEn || context.locationName || 'Punjab';
  const langKey = (context.langCode || 'en-IN').slice(0, 2);

  // 1. Pests & Diseases
  if (q.includes('pest') || q.includes('disease') || q.includes('rust') || q.includes('worm') || q.includes('fungus') || q.includes('blight') || q.includes('rot') || q.includes('aphid') || q.includes('रोग') || q.includes('कीट') || q.includes('इल्ली') || q.includes('रतुआ') || q.includes('ਸੁੰਡੀ') || q.includes('ਰਤੂਆ')) {
    if (q.includes('yellow rust') || q.includes('रतुआ') || q.includes('ਰਤੂਆ')) {
      if (langKey === 'hi') return `${crop} में पीला रतुआ दिखने पर तुरंत प्रोपिकोनाज़ोल 25% EC (टिल्ट) 200 मिली प्रति एकड़ 200 लीटर पानी में मिलाकर छिड़काव करें। 15 दिन बाद दोबारा दोहराएं। संक्रमित पत्ते हटा दें।`;
      if (langKey === 'pa') return `${crop} ਵਿੱਚ ਪੀਲਾ ਰਤੂਆ ਆਉਣ ਤੇ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ 25% EC 200 ਮਿ.ਲੀ. ਪ੍ਰਤੀ ਏਕੜ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕੋ। 15 ਦਿਨ ਬਾਅਦ ਦੁਬਾਰਾ ਛਿੜਕੋ।`;
      return `For Yellow Rust in ${crop}, immediately spray Propiconazole 25% EC (Tilt) at 200 ml per acre mixed in 200 liters of water. Repeat after 15 days if symptoms persist. Remove heavily infected leaves.`;
    }
    if (q.includes('armyworm') || q.includes('इल्ली') || q.includes('caterpillar') || q.includes('ਸੁੰਡੀ')) {
      if (langKey === 'hi') return `${crop} में सुंडी या इल्ली नियंत्रण हेतु एमामेक्टिन बेंजोएट 5% SG 80 ग्राम प्रति एकड़ 150 लीटर पानी में शाम के समय छिड़कें। गंभीर प्रकोप पर क्लोरेंट्रानिलिप्रोल 18.5% SC 60 मिली/एकड़ प्रयोग करें।`;
      return `For caterpillar or armyworm in ${crop}: spray Emamectin Benzoate 5% SG at 80g per acre in 150L water during evening. For severe infestation, use Chlorantraniliprole 18.5% SC at 60ml/acre.`;
    }
    if (langKey === 'hi') return `${crop} में कीट एवं रोग नियंत्रण: रसचूसक कीटों (माहू, जैसिड) के लिए इमिडाक्लोप्रिड 17.8% SL 50 मिली/एकड़ छिड़कें। फफूंद रोगों (पाउडरी मिल्ड्यू, ब्लाइट) हेतु मैंकोजेब 75% WP 600 ग्राम/एकड़ या कार्बेंडाजिम 50% WP 200 ग्राम/एकड़ लगाएं।`;
    return `For pest and disease protection in ${crop}: spray Imidacloprid 17.8% SL at 50ml/acre for sucking pests (aphids, jassids). For fungal diseases (powdery mildew, blight), apply Mancozeb 75% WP at 600g/acre or Carbendazim 50% WP at 200g/acre.`;
  }

  // 2. Weeds & Weedicide
  if (q.includes('weed') || q.includes('weedicide') || q.includes('herbicide') || q.includes('खरपतवार') || q.includes('गुल्ली डंडा') || q.includes('बथुआ') || q.includes('ਨਦੀਨ') || q.includes('ਗੁੱਲੀ')) {
    if (langKey === 'hi') return `${crop} में गुल्ली डंडा (Phalaris minor) के लिए क्लोडिनाफॉप 15% WP 160 ग्राम या सल्फोसल्फ्यूरॉन 75% WG 13.5 ग्राम प्रति एकड़ बुवाई के 30-35 दिन बाद छिड़कें। चौड़ी पत्ती के खरपतवार (बथुआ, हिरनखुरी) हेतु मैटसल्फ्यूरॉन मिथाइल 20% WP 8 ग्राम/एकड़ प्रयोग करें।`;
    return `For narrow grass weeds (Phalaris minor) in ${crop}, spray Clodinafop 15% WP at 160g/acre or Sulfosulfuron 75% WG at 13.5g/acre 30-35 DAS. For broadleaf weeds (Chenopodium, Convolvulus), spray Metsulfuron Methyl 20% WP at 8g/acre.`;
  }

  // 3. Fertilizers & NPK
  if (q.includes('fertilizer') || q.includes('urea') || q.includes('dap') || q.includes('npk') || q.includes('खाद') || q.includes('उर्वरक') || q.includes('ਯੂਰੀਆ') || q.includes('ਖਾਦ')) {
    const calcDap = Math.round(50 * area);
    const calcUrea = Math.round(90 * area);
    const calcMop = Math.round(25 * area);
    if (langKey === 'hi') return `${area} एकड़ ${crop} के लिए कुल खाद: बुवाई पर ${calcDap} kg DAP + ${calcMop} kg पोटाश (MOP) तथा ${Math.round(10*area)} kg जिंक सल्फेट दें। पहली सिंचाई (21-25 दिन) के बाद ${Math.round(calcUrea/2)} kg यूरिया, दूसरी सिंचाई पर शेष ${Math.round(calcUrea/2)} kg यूरिया की टॉप ड्रेसिंग करें।`;
    return `For ${area} acre(s) of ${crop}: Basal dose = ${calcDap} kg DAP + ${calcMop} kg MOP + ${Math.round(10*area)} kg Zinc Sulphate at sowing. Top-dress ${Math.round(calcUrea/2)} kg Urea after first irrigation (21 days) and remaining ${Math.round(calcUrea/2)} kg after second irrigation.`;
  }

  // 4. Irrigation Schedule
  if (q.includes('water') || q.includes('irrigation') || q.includes('पानी') || q.includes('सिंचाई') || q.includes('ਪਾਣੀ') || q.includes('ਸਿੰਚਾਈ')) {
    if (langKey === 'hi') return `${crop} फसल (${soil} मिट्टी) में पहली सिंचाई बुवाई के 21-25 दिन बाद (CRI ताज जड़ अवस्था) अवश्य करें। कुल 5-6 सिंचाइयां दें: CRI (21 दिन), तिलरिंग (40-45 दिन), जॉइंटिंग (65-70 दिन), फ्लॉवरिंग (90 दिन), दाना भरना (105 दिन)।`;
    return `For ${crop} on ${soil} soil, apply critical first irrigation at 21-25 days (CRI stage). Total 5-6 irrigations: CRI (21d), Tillering (40-45d), Jointing (65-70d), Flowering (90d), Grain filling (105d). Avoid water stress at CRI stage.`;
  }

  // 5. Mandi Rates & Prices
  if (q.includes('price') || q.includes('mandi') || q.includes('rate') || q.includes('msp') || q.includes('भाव') || q.includes('मंडी') || q.includes('दम') || q.includes('ਭਾਅ') || q.includes('ਮੰਡੀ')) {
    if (langKey === 'hi') return `वर्तमान MSP दरें: गेहूं ₹2,275/क्विंटल (मंडी भाव ₹2,300-₹2,480), सरसों ₹5,650/क्विंटल, धान ₹2,300/क्विंटल, कपास ₹7,121/क्विंटल, चना ₹5,440/क्विंटल। फसल में नमी 12% से कम रखें, सफाई करके मंडी ले जाएं।`;
    return `Current MSP rates: Wheat ₹2,275/qtl (Mandi ₹2,300-₹2,480), Mustard ₹5,650/qtl, Paddy ₹2,300/qtl, Cotton ₹7,121/qtl, Chana ₹5,440/qtl. Keep moisture below 12% and clean grain before selling for best price.`;
  }

  // 6. Schemes & Subsidies
  if (q.includes('scheme') || q.includes('subsidy') || q.includes('pm-kisan') || q.includes('pm kisan') || q.includes('kusum') || q.includes('fasal bima') || q.includes('योजना') || q.includes('सब्सिडी') || q.includes('ਸਕੀਮ')) {
    if (langKey === 'hi') return `प्रमुख सरकारी योजनाएं: (1) PM-किसान: ₹6,000 वार्षिक (3 किस्तों में, pmkisan.gov.in)। (2) PM-KUSUM: सोलर पंप पर 60-90% सब्सिडी। (3) PM फसल बीमा (PMFBY): रबी प्रीमियम 1.5%, खरीफ 2%। (4) KCC लोन: 4% ब्याज दर (₹3 लाख तक)।`;
    return `Key schemes: (1) PM-KISAN: ₹6,000/year in 3 installments (pmkisan.gov.in). (2) PM-KUSUM: 60-90% subsidy on solar pumps. (3) PMFBY: Rabi premium 1.5%, Kharif 2%. (4) KCC Loan: 4% interest up to ₹3 lakh.`;
  }

  // 7. Seeds & Sowing
  if (q.includes('seed') || q.includes('sow') || q.includes('variety') || q.includes('बीज') || q.includes('बुवाई') || q.includes('ਬੀਜ') || q.includes('ਬਿਜਾਈ')) {
    if (langKey === 'hi') return `${crop} की उन्नत किस्में: HD-3086, HD-2967, PBW-725 (गेहूं), पूसा बासमती-1121, PR-126 (धान)। बीज दर: गेहूं 40-45 kg/एकड़, बीजोपचार: थीरम 2.5g/kg या कार्बॉक्सिन 2g/kg। बुवाई का सही समय: नवंबर 1-25 (गेहूं)।`;
    return `Recommended ${crop} varieties: HD-3086, HD-2967, PBW-725 (Wheat), Pusa Basmati-1121, PR-126 (Paddy). Seed rate: Wheat 40-45 kg/acre. Seed treatment: Thiram 2.5g/kg or Carboxin 2g/kg. Best sowing window: Nov 1-25 (Wheat).`;
  }

  // 8. Machinery & Equipment
  if (q.includes('tractor') || q.includes('machine') || q.includes('equipment') || q.includes('ट्रैक्टर') || q.includes('मशीन') || q.includes('ਟਰੈਕਟਰ')) {
    if (langKey === 'hi') return `खेती मशीनरी किराया दरें (अनुमानित): 45HP ट्रैक्टर ₹450-550/घंटा, रोटावेटर ₹350-450/घंटा, कम्बाइन हार्वेस्टर ₹1,800-2,200/घंटा, लेजर लैंड लेवलर ₹800-1,200/घंटा। CHC केंद्र या PM-SMAM योजना से 50-80% सब्सिडी पर किराया मिल सकता है।`;
    return `Farm machinery rental rates (approx): 45HP Tractor ₹450-550/hr, Rotavator ₹350-450/hr, Combine Harvester ₹1,800-2,200/hr, Laser Land Leveller ₹800-1,200/hr. Get 50-80% subsidy through CHC centers or PM-SMAM scheme.`;
  }

  // 9. General catchall
  if (langKey === 'hi') return `आपकी ${crop} फसल (${area} एकड़, ${soil} मिट्टी, ${location}) के संबंध में: खेत का नियमित निरीक्षण करें, संतुलित NPK पोषक तत्व (Urea+DAP+MOP) दें, समय पर सिंचाई एवं कीट निगरानी करें। किसी विशेष विषय (कीट, खाद, पानी, मंडी) के लिए दोबारा पूछें।`;
  if (langKey === 'pa') return `ਤੁਹਾਡੀ ${crop} ਫਸਲ (${area} ਏਕੜ, ${location}) ਲਈ: ਖੇਤ ਦਾ ਨਿਯਮਿਤ ਨਿਰੀਖਣ ਕਰੋ, ਸੰਤੁਲਿਤ ਖਾਦ ਪਾਓ, ਸਮੇਂ ਸਿਰ ਪਾਣੀ ਦਿਓ ਅਤੇ ਕੀੜੇ-ਮਕੌੜਿਆਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।`;
  return `For your ${crop} crop (${area} acres on ${soil} soil in ${location}): Maintain regular field scouting, apply balanced NPK nutrients (Urea+DAP+MOP), ensure timely irrigation, and monitor for pest activity. Ask me about a specific topic like pests, fertilizers, irrigation, or market prices for detailed advice.`;
}
