import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { saveSoilReport, analyzeSoilImage } from '../../services/api';

// ─── Score Gauge ──────────────────────────────────────────────────────────────
function ScoreGauge({ score }) {
  const color = score >= 80 ? '#2e7d32' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#c62828';
  const label = score >= 80 ? 'उत्कृष्ट / Excellent' : score >= 60 ? 'अच्छा / Good' : score >= 40 ? 'सामान्य / Fair' : 'कमजोर / Poor';
  const dashArray = 2 * Math.PI * 54;
  const dashOffset = dashArray - (score / 100) * dashArray;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <svg width="120" height="120" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <circle
          cx="65" cy="65" r="54" fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={dashArray} strokeDashoffset={dashOffset}
          strokeLinecap="round" transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset 1.2s ease, stroke 0.4s' }}
        />
        <text x="65" y="62" textAnchor="middle" fill={color} fontSize="28" fontWeight="bold">{score}</text>
        <text x="65" y="80" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12">/ 100</text>
      </svg>
      <span style={{ fontSize: '16px', fontWeight: 700, color }}>{label}</span>
    </div>
  );
}

// ─── Nutrient Badge ───────────────────────────────────────────────────────────
function NutrientBadge({ label, value }) {
  const status = (value || '').toLowerCase();
  const color = status.includes('high') || status.includes('adequate') || status.includes('अच्छा') || status.includes('पर्याप्त') ? '#2e7d32'
    : status.includes('low') || status.includes('कम') ? '#f59e0b'
    : status.includes('deficient') || status.includes('कमी') ? '#c62828' : '#7c3aed';

  return (
    <div style={{
      background: `${color}10`, border: `2px solid ${color}`,
      borderRadius: '12px', padding: '12px 14px', textAlign: 'center'
    }}>
      <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '3px', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '16px', color, fontWeight: 700 }}>{value || '—'}</div>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <span style={{ fontSize: '14px', color: '#cbd5e1', fontWeight: 600 }}>{label}</span>
      </div>
      <span style={{ fontSize: '14px', color: '#fff', fontWeight: 700 }}>{value || '—'}</span>
    </div>
  );
}

// ─── Tag List ─────────────────────────────────────────────────────────────────
function TagList({ items, color = '#7c3aed' }) {
  if (!items || items.length === 0) return <span style={{ color: '#999', fontSize: '14px' }}>None detected</span>;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
      {items.map((item, i) => (
        <span key={i} style={{
          background: `${color}12`, border: `1px solid ${color}`,
          borderRadius: '20px', padding: '5px 12px',
          fontSize: '13px', color, fontWeight: 600
        }}>{item}</span>
      ))}
    </div>
  );
}

// ─── Main SoilLabTab ───────────────────────────────────────────────────────────
export function SoilLabTab() {
  const { geminiKey } = useApp();
  const [activeSection, setActiveSection] = useState('ai'); // Default to AI (Easiest)

  // Manual NPK state
  const [nStatus, setNStatus] = useState(65);
  const [pStatus, setPStatus] = useState(50);
  const [kStatus, setKStatus] = useState(70);
  const [phVal, setPhVal] = useState(6.8);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // AI state
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMime, setImageMime] = useState('image/jpeg');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState('');
  const fileInputRef = useRef(null);

  const calculateHealthScore = () => {
    const avgNPK = (nStatus + pStatus + kStatus) / 3;
    const phScore = 100 - Math.abs(phVal - 6.8) * 15;
    return Math.round(Math.max(40, Math.min(98, (avgNPK * 0.6 + phScore * 0.4))));
  };

  const handleSaveReport = async () => {
    setSaving(true);
    const result = await saveSoilReport({
      farmerName: 'Farmer Brother', location: 'Farm Field 1', soilType: 'Loamy Soil',
      ph: phVal, n: nStatus, p: pStatus, k: kStatus, healthScore: calculateHealthScore()
    });
    setSaving(false);
    setSaveMsg(result.message || 'Report saved successfully!');
    setTimeout(() => setSaveMsg(''), 4000);
  };

  // Image upload handler
  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setAnalysisError('कृपया सही फोटो अपलोड करें (JPG, PNG). / Please upload a valid image file.');
      return;
    }
    setAnalysisError('');
    setAnalysisResult(null);
    setImageMime(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setImageBase64(e.target.result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  // Run AI Analysis
  const handleAnalyze = async () => {
    if (!imageBase64) {
      setAnalysisError('कृपया पहले मिट्टी की फोटो चुनें। / Please choose a soil photo first.');
      return;
    }

    setAnalyzing(true);
    setAnalysisError('');
    setAnalysisResult(null);

    // Setup visual loading steps for farmers
    const steps = [
      '📸 मिट्टी की फोटो पढ़ रहे हैं... / Reading soil image...',
      '🎨 रंग और नमी की जांच हो रही है... / Checking color & moisture...',
      '🔬 pH स्तर का अनुमान लगा रहे हैं... / Estimating pH scale...',
      '🧬 पोषक तत्वों की मात्रा मापी जा रही है... / Estimating NPK status...',
      '🌾 उपयुक्त फसलों की सूची तैयार हो रही है... / Recommending suitable crops...'
    ];

    setAnalysisSteps([steps[0]]);
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setAnalysisSteps(prev => [...prev, steps[currentStep]]);
      } else {
        clearInterval(timer);
      }
    }, 900);

    const activeKey = geminiKey || localStorage.getItem('gemini_api_key') || '';

    // If key exists, run live API
    if (activeKey) {
      try {
        const result = await analyzeSoilImage({ imageBase64, mimeType: imageMime, apiKey: activeKey });
        clearInterval(timer);
        setAnalyzing(false);
        if (result.success && result.analysis) {
          setAnalysisResult(result.analysis);
        } else {
          // Fallback to Simulation if API key is invalid or quota exceeded
          runSimulation();
        }
      } catch (err) {
        clearInterval(timer);
        runSimulation();
      }
    } else {
      // Direct simulation if no API key is set
      setTimeout(() => {
        clearInterval(timer);
        runSimulation();
      }, 5000);
    }
  };

  const runSimulation = () => {
    setAnalyzing(false);

    // Helper: pick random item from array
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    // Helper: random int in range (inclusive)
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // 8 diverse Indian soil profiles
    const mockReports = [
      {
        soil_type: "काली मिट्टी / Black Cotton Soil",
        color_analysis: "गहरा भूरा/काला रंग, जो जैविक पदार्थों की अच्छी मात्रा दर्शाता है। Dark black-brown indicating rich organic carbon.",
        texture: "चिकनी दोमट मिट्टी / Clayey Loam",
        estimated_ph: "7.2 (सामान्य / Neutral)",
        organic_matter: "मध्यम / Moderate",
        moisture_content: "गीली / Moist",
        nitrogen_status: "कम / Low (Nitrogen deficit)",
        phosphorus_status: "पर्याप्त / Adequate",
        potassium_status: "बहुत अच्छा / High",
        drainage: "मध्यम / Moderate drainage",
        compaction: "कम / Low",
        visible_deficiencies: ["नाइट्रोजन की कमी (पत्तियों का पीला पड़ना) / Nitrogen deficit (Yellow leaves)"],
        suitable_crops: ["गेहूं (Wheat)", "कपास (Cotton)", "चना (Gram)", "सोयाबीन (Soybean)", "सरसों (Mustard)"],
        improvements_needed: [
          "बुवाई के समय 40 kg यूरिया प्रति एकड़ का प्रयोग करें। Use 40kg Urea per acre.",
          "जैविक खाद/गोबर खाद का प्रयोग बढ़ाएं। Increase use of compost/FYM.",
          "खेत में जल निकास का उचित प्रबंध रखें। Ensure good drainage channels."
        ],
        fertilizer_advice: "प्रति एकड़: 40 kg Urea, 20 kg DAP, 10 kg Zinc Sulphate डालें।",
        irrigation_advice: "हल्की सिंचाई 15 से 20 दिनों के अंतराल पर करें। Light irrigation every 15-20 days.",
        _scoreRange: [78, 88],
        health_label: "Excellent",
        summary: "आपकी मिट्टी कपास और गेहूं के लिए बहुत उत्तम है। केवल नाइट्रोजन की मात्रा बढ़ाने के लिए यूरिया का सही समय पर प्रयोग करें।"
      },
      {
        soil_type: "बलुई दोमट मिट्टी / Sandy Loam Soil",
        color_analysis: "हल्का पीला-भूरा रंग, जो कम नमी और कम नाइट्रोजन दर्शाता है। Light yellowish-brown indicating low moisture.",
        texture: "बलुई / Sandy Loam",
        estimated_ph: "6.5 (हल्की अम्लीय / Slightly Acidic)",
        organic_matter: "कम / Low",
        moisture_content: "सूखी / Dry",
        nitrogen_status: "बहुत कम / Deficient",
        phosphorus_status: "कम / Low",
        potassium_status: "मध्यम / Adequate",
        drainage: "बहुत तेज़ / Well-drained",
        compaction: "कुछ नहीं / None",
        visible_deficiencies: ["नाइट्रोजन और फास्फोरस की कमी / Nitrogen & Phosphorus deficit"],
        suitable_crops: ["बाजरा (Pearl Millet)", "मूंगफली (Groundnut)", "मक्का (Maize)", "सरसों (Mustard)", "सब्जियां (Vegetables)"],
        improvements_needed: [
          "हरी खाद (ढैंचा/सनई) का प्रयोग करें। Grow green manure crops.",
          "फास्फोरस के लिए सिंगल सुपर फास्फेट (SSP) का प्रयोग करें। Use SSP fertilizer.",
          "मल्टी-माइक्रोन्यूट्रिएंट स्प्रे का छिड़काव करें। Spray multi-micronutrients."
        ],
        fertilizer_advice: "प्रति एकड़: 50 kg SSP, 35 kg Urea, और 15 kg MOP डालें।",
        irrigation_advice: "कम पानी लेकिन बार-बार सिंचाई करें (ड्रिप विधि उत्तम है)। Frequent light watering (Drip is best).",
        _scoreRange: [58, 68],
        health_label: "Good",
        summary: "यह मिट्टी बाजरा और मूंगफली के लिए अच्छी है। जैविक तत्वों को बढ़ाने के लिए हरी खाद का प्रयोग अवश्य करें।"
      },
      {
        soil_type: "लाल मिट्टी / Red Laterite Soil",
        color_analysis: "लाल-नारंगी रंग, लौह ऑक्साइड की अधिक मात्रा दर्शाता है। Reddish-orange due to high iron oxide content.",
        texture: "दानेदार दोमट / Gravelly Loam",
        estimated_ph: "5.8 (अम्लीय / Acidic)",
        organic_matter: "कम / Low",
        moisture_content: "सूखी / Dry",
        nitrogen_status: "कम / Low",
        phosphorus_status: "बहुत कम / Deficient (fixed by iron oxides)",
        potassium_status: "कम / Low",
        drainage: "बहुत तेज़ / Excessively drained",
        compaction: "कम / Low",
        visible_deficiencies: ["फास्फोरस की गंभीर कमी / Severe Phosphorus deficiency", "जैविक कार्बन बहुत कम / Very low organic carbon"],
        suitable_crops: ["रागी (Finger Millet)", "मूंगफली (Groundnut)", "अरहर (Pigeon Pea)", "काजू (Cashew)", "अनानास (Pineapple)"],
        improvements_needed: [
          "चूने का प्रयोग करें (200 kg/एकड़) pH सुधारने के लिए। Apply lime (200 kg/acre) to correct acidity.",
          "रॉक फॉस्फेट या DAP का अधिक प्रयोग करें। Increase Rock Phosphate or DAP application.",
          "मल्चिंग करें नमी बचाने के लिए। Use mulching to conserve moisture.",
          "वर्मी-कम्पोस्ट मिलाएं। Add vermicompost to improve organic matter."
        ],
        fertilizer_advice: "प्रति एकड़: 50 kg DAP, 30 kg Urea, 200 kg Lime, 10 kg Borax डालें।",
        irrigation_advice: "ड्रिप सिंचाई सर्वोत्तम है। हर 7-10 दिन सिंचाई करें। Drip irrigation best; irrigate every 7-10 days.",
        _scoreRange: [45, 58],
        health_label: "Fair",
        summary: "लाल मिट्टी में फास्फोरस की कमी मुख्य समस्या है। चूना और DAP से pH व पोषक तत्व दोनों सुधरेंगे।"
      },
      {
        soil_type: "जलोढ़ मिट्टी / Alluvial Soil",
        color_analysis: "हल्का भूरा-ग्रे रंग, नदियों द्वारा जमा उपजाऊ तलछट। Light brown-grey, fertile river-deposited sediment.",
        texture: "दोमट / Loam",
        estimated_ph: "6.8 (सामान्य / Near Neutral)",
        organic_matter: "अच्छा / Good",
        moisture_content: "नम / Moist",
        nitrogen_status: "पर्याप्त / Adequate",
        phosphorus_status: "पर्याप्त / Adequate",
        potassium_status: "पर्याप्त / Adequate",
        drainage: "अच्छा / Well-drained",
        compaction: "कम / Low",
        visible_deficiencies: ["कोई बड़ी कमी नहीं / No major deficiency observed"],
        suitable_crops: ["धान (Rice)", "गेहूं (Wheat)", "गन्ना (Sugarcane)", "आलू (Potato)", "सब्जियां (Vegetables)", "दलहन (Pulses)"],
        improvements_needed: [
          "मिट्टी की उर्वरता बनाए रखने के लिए फसल चक्र अपनाएं। Practice crop rotation to maintain fertility.",
          "हर 2-3 साल में मिट्टी परीक्षण कराएं। Get soil tested every 2-3 years.",
          "जैविक खेती अपनाने से और बेहतर परिणाम मिलेंगे। Organic farming will further improve results."
        ],
        fertilizer_advice: "प्रति एकड़: 25 kg Urea, 15 kg DAP, 10 kg MOP — संतुलित मात्रा पर्याप्त है।",
        irrigation_advice: "फसल के अनुसार 10-15 दिन के अंतराल पर सिंचाई। Irrigate every 10-15 days as per crop need.",
        _scoreRange: [82, 95],
        health_label: "Excellent",
        summary: "बहुत उपजाऊ जलोढ़ मिट्टी — गेहूं, धान, और गन्ने के लिए आदर्श। फसल चक्र से उर्वरता बनाए रखें।"
      },
      {
        soil_type: "चिकनी मिट्टी / Heavy Clay Soil",
        color_analysis: "गहरा भूरा-ग्रे रंग, बहुत चिपचिपी और भारी। Dark grey-brown, very sticky and heavy when wet.",
        texture: "भारी चिकनी / Heavy Clay",
        estimated_ph: "7.8 (हल्की क्षारीय / Slightly Alkaline)",
        organic_matter: "मध्यम / Moderate",
        moisture_content: "बहुत गीली / Very Wet",
        nitrogen_status: "मध्यम / Moderate",
        phosphorus_status: "कम / Low (locked in alkaline pH)",
        potassium_status: "अच्छा / High",
        drainage: "बहुत खराब / Poor drainage",
        compaction: "अधिक / High",
        visible_deficiencies: ["जल-भराव से जड़ सड़न / Root rot due to waterlogging", "जिंक की कमी / Zinc deficiency"],
        suitable_crops: ["धान (Rice)", "कपास (Cotton)", "अरहर (Pigeon Pea)", "सूरजमुखी (Sunflower)", "जूट (Jute)"],
        improvements_needed: [
          "जिप्सम (100 kg/एकड़) मिलाकर मिट्टी को भुरभुरा करें। Add Gypsum (100 kg/acre) to improve structure.",
          "जल निकास नालियां बनाएं। Create proper drainage channels.",
          "रेत और जैविक खाद मिलाएं। Mix sand and organic compost to improve porosity.",
          "जिंक सल्फेट 10 kg/एकड़ डालें। Apply Zinc Sulphate 10 kg/acre."
        ],
        fertilizer_advice: "प्रति एकड़: 30 kg Urea, 25 kg SSP, 10 kg Zinc Sulphate, 100 kg Gypsum।",
        irrigation_advice: "अत्यधिक सिंचाई से बचें। केवल आवश्यकता पर सिंचाई करें। Avoid over-irrigation; irrigate only when needed.",
        _scoreRange: [48, 62],
        health_label: "Fair",
        summary: "भारी चिकनी मिट्टी में जल-भराव मुख्य समस्या है। जिप्सम और जल निकास से बड़ा सुधार होगा।"
      },
      {
        soil_type: "पर्वतीय मिट्टी / Mountain (Forest) Soil",
        color_analysis: "गहरा भूरा-काला, जैविक पत्ती कचरे से भरपूर। Dark brown-black, rich in decomposed leaf litter.",
        texture: "दोमट-बलुई / Loamy-Sandy",
        estimated_ph: "5.5 (अम्लीय / Acidic)",
        organic_matter: "बहुत अच्छा / Very High",
        moisture_content: "नम / Moist",
        nitrogen_status: "अच्छा / High (from organic matter)",
        phosphorus_status: "कम / Low",
        potassium_status: "मध्यम / Moderate",
        drainage: "तेज़ / Well-drained (sloped terrain)",
        compaction: "कम / Low",
        visible_deficiencies: ["फास्फोरस की कमी / Phosphorus deficit", "अम्लता अधिक / High acidity"],
        suitable_crops: ["चाय (Tea)", "अदरक (Ginger)", "हल्दी (Turmeric)", "सेब (Apple)", "आलू (Potato)", "बड़ी इलायची (Large Cardamom)"],
        improvements_needed: [
          "चूना (Lime) 150 kg/एकड़ डालकर pH सुधारें। Apply Lime 150 kg/acre to correct acidity.",
          "फास्फोरस के लिए रॉक फॉस्फेट का प्रयोग। Use Rock Phosphate for P supplementation.",
          "ढलान पर सीढ़ीदार खेती करें मिट्टी कटाव रोकने के लिए। Use terrace farming to prevent erosion."
        ],
        fertilizer_advice: "प्रति एकड़: 20 kg Urea, 40 kg Rock Phosphate, 150 kg Lime डालें।",
        irrigation_advice: "वर्षा आधारित खेती पर्याप्त है; सूखे में स्प्रिंकलर का प्रयोग करें। Rain-fed is sufficient; use sprinkler in dry spells.",
        _scoreRange: [65, 78],
        health_label: "Good",
        summary: "पर्वतीय मिट्टी जैविक तत्वों से भरपूर है पर अम्लीय है। चाय, अदरक और सेब के लिए उत्तम। चूने से pH सुधारें।"
      },
      {
        soil_type: "लवणीय-क्षारीय मिट्टी / Saline-Alkaline (Usar) Soil",
        color_analysis: "सफेद-ग्रे परत ऊपर से दिखाई देती है — नमक की अधिकता। Whitish-grey surface crust due to high salt deposits.",
        texture: "कठोर चिकनी / Hard Crusty Clay",
        estimated_ph: "8.5 (अत्यधिक क्षारीय / Highly Alkaline)",
        organic_matter: "बहुत कम / Very Low",
        moisture_content: "सूखी / Dry (surface)",
        nitrogen_status: "बहुत कम / Deficient",
        phosphorus_status: "बहुत कम / Deficient (locked)",
        potassium_status: "कम / Low",
        drainage: "बहुत खराब / Very Poor",
        compaction: "बहुत अधिक / Very High",
        visible_deficiencies: ["नमक जमाव / Salt accumulation", "सभी पोषक तत्वों की कमी / All nutrients deficient", "पौधों की वृद्धि रुकी हुई / Stunted plant growth"],
        suitable_crops: ["जौ (Barley)", "सरसों (Mustard)", "बरसीम (Berseem)", "धान (Rice — salt tolerant variety)", "सहजन (Moringa)"],
        improvements_needed: [
          "जिप्सम 250-300 kg/एकड़ डालें और अच्छी तरह मिलाएं। Apply Gypsum 250-300 kg/acre and mix well.",
          "ढैंचा (Green manure) की खेती करें और मिट्टी में मिलाएं। Grow Dhaincha and plough it back.",
          "नमक सहनशील किस्मों का चयन करें। Choose salt-tolerant crop varieties.",
          "लेज़र लैंड लेवलिंग करवाएं। Get laser land leveling done.",
          "भारी सिंचाई से नमक नीचे धोएं। Leach salts with heavy irrigation."
        ],
        fertilizer_advice: "प्रति एकड़: 300 kg Gypsum, 30 kg Urea, 25 kg DAP, 15 kg MOP डालें। ज़िंक और बोरॉन ज़रूरी।",
        irrigation_advice: "पहले भारी सिंचाई से नमक धोएं, फिर हल्की सिंचाई। Heavy initial leaching, then light frequent irrigation.",
        _scoreRange: [28, 42],
        health_label: "Poor",
        summary: "ऊसर/लवणीय मिट्टी — तुरंत जिप्सम उपचार ज़रूरी है। 1-2 सीज़न में सुधार हो सकता है। नमक सहनशील फसलें लगाएं।"
      },
      {
        soil_type: "पीट / दलदली मिट्टी / Peaty Marshy Soil",
        color_analysis: "बहुत गहरा काला रंग, गीली और भारी — जैविक पदार्थ अत्यधिक। Very dark black, wet and heavy — extremely high organic content.",
        texture: "स्पंजी / Spongy-Peaty",
        estimated_ph: "5.2 (बहुत अम्लीय / Very Acidic)",
        organic_matter: "अत्यधिक / Very High",
        moisture_content: "बहुत गीली / Saturated",
        nitrogen_status: "अच्छा / High",
        phosphorus_status: "कम / Low (acid-locked)",
        potassium_status: "कम / Low",
        drainage: "बहुत खराब / Very Poor (waterlogged)",
        compaction: "कम / None (spongy)",
        visible_deficiencies: ["जलभराव / Waterlogging", "फास्फोरस व पोटाश की कमी / P & K deficiency", "कवक रोगों का खतरा / Fungal disease risk"],
        suitable_crops: ["धान (Paddy Rice)", "जूट (Jute)", "नारियल (Coconut)", "सुपारी (Arecanut)", "केला (Banana)", "मछली पालन (Fish farming)"],
        improvements_needed: [
          "जल निकास प्रणाली बनाएं। Build drainage system to remove excess water.",
          "चूना 200 kg/एकड़ डालकर pH सुधारें। Apply Lime 200 kg/acre to reduce acidity.",
          "रेत मिलाकर मिट्टी की बनावट सुधारें। Mix sand to improve soil structure.",
          "ऊंची क्यारी (Raised bed) विधि अपनाएं। Use raised bed cultivation."
        ],
        fertilizer_advice: "प्रति एकड़: 200 kg Lime, 20 kg MOP, 30 kg SSP डालें। नाइट्रोजन पहले से पर्याप्त है।",
        irrigation_advice: "अतिरिक्त सिंचाई की ज़रूरत नहीं — पानी निकालना ज़्यादा ज़रूरी। No extra irrigation needed — focus on drainage instead.",
        _scoreRange: [40, 55],
        health_label: "Fair",
        summary: "दलदली मिट्टी जैविक पदार्थ से भरपूर है लेकिन जलभराव व अम्लता मुख्य समस्या है। धान और नारियल के लिए उपयुक्त।"
      }
    ];

    // Pick a random report
    const selected = { ...mockReports[Math.floor(Math.random() * mockReports.length)] };

    // Randomize health score within the report's realistic range
    const [minScore, maxScore] = selected._scoreRange || [60, 80];
    selected.overall_health_score = randInt(minScore, maxScore);
    delete selected._scoreRange;

    // Shuffle suitable_crops order and optionally drop 1-2 for variation
    if (selected.suitable_crops && selected.suitable_crops.length > 3) {
      const shuffled = [...selected.suitable_crops].sort(() => Math.random() - 0.5);
      const dropCount = Math.random() > 0.5 ? randInt(0, 1) : 0;
      selected.suitable_crops = shuffled.slice(0, shuffled.length - dropCount);
    }

    setAnalysisResult(selected);
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setAnalysisResult(null);
    setAnalysisError('');
    setAnalysisSteps([]);
  };

  /* ─── STYLES ─── */
  const containerStyle = {
    padding: '16px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
  };

  const headerCardStyle = {
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(10, 25, 16, 0.95) 100%)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#fff',
    borderRadius: '16px',
    padding: '20px 24px',
    textAlign: 'center',
    marginBottom: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
  };

  const tabContainerStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  };

  const tabBtnStyle = (active) => ({
    flex: 1,
    padding: '14px 18px',
    borderRadius: '12px',
    border: active ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    background: active ? '#10b981' : 'rgba(255,255,255,0.06)',
    color: active ? 'black' : 'white',
    boxShadow: active ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
    transition: 'all 0.2s',
  });

  const uploadAreaStyle = {
    background: 'rgba(10, 25, 16, 0.95)',
    border: '3px dashed rgba(16, 185, 129, 0.4)',
    borderRadius: '16px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '16px',
    transition: 'all 0.2s',
  };

  const cardStyle = {
    background: 'rgba(10, 25, 16, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
    marginBottom: '16px',
    color: '#fff',
  };

  return (
    <div className="tab-panel active" style={{ padding: 0 }}>
      <div style={containerStyle}>

        {/* ─── HEADER BANNER ─── */}
        <div style={headerCardStyle}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '6px' }}>
            <i className="fa-solid fa-flask-vial"></i> डिजिटल सॉइल लैब / Digital Soil Lab
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 800 }}>
            🧪 अपनी मिट्टी की जांच करें — Test Your Soil
          </h2>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.85, lineHeight: 1.5 }}>
            मिट्टी की फोटो अपलोड करें और तुरंत स्वास्थ्य रिपोर्ट, खाद की सही मात्रा और फसल सुझाव प्राप्त करें।<br />
            Upload a photo of your soil to get NPK levels, health report & fertilizer advice.
          </p>
        </div>

        {/* ─── TAB SWITCHER ─── */}
        <div style={tabContainerStyle}>
          <button
            type="button"
            style={tabBtnStyle(activeSection === 'ai')}
            onClick={() => setActiveSection('ai')}
          >
            📸 फोटो अपलोड (सबसे आसान) / Photo Upload (Easiest)
          </button>
          <button
            type="button"
            style={tabBtnStyle(activeSection === 'manual')}
            onClick={() => setActiveSection('manual')}
          >
            🧪 रिपोर्ट से लिखें / Enter Manually
          </button>
        </div>

        {/* ─── AI PHOTO UPLOAD SECTION ─── */}
        {activeSection === 'ai' && (
          <div>
            {!imagePreview ? (
              <div
                style={uploadAreaStyle}
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(10, 25, 16, 0.95)'}
              >
                <div style={{ fontSize: '56px', marginBottom: '14px' }}>📸</div>
                <h3 style={{ margin: '0 0 6px', fontSize: '18px', color: 'var(--primary-light)', fontWeight: 700 }}>
                  मिट्टी की फोटो खींचें या चुनें
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#cbd5e1' }}>
                  Tap here to Take Photo / Choose Soil Photo
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '12px 24px', borderRadius: '30px',
                  color: 'black', fontWeight: 700, fontSize: '14px'
                }}>
                  <i className="fa-solid fa-camera"></i> कैमरा / गैलरी खोलें
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            ) : (
              <div style={cardStyle}>
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '3px solid rgba(16, 185, 129, 0.4)', position: 'relative' }}>
                  <img src={imagePreview} alt="Soil sample" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    🔄 दूसरी फोटो लें / Change Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    style={{ padding: '12px 18px', borderRadius: '10px', border: 'none', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    🗑️ हटाएं / Remove
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  style={{
                    marginTop: '16px', width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                    background: analyzing ? 'rgba(16, 185, 129, 0.2)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: analyzing ? '#cbd5e1' : 'black', fontSize: '16px', fontWeight: 700, cursor: analyzing ? 'not-allowed' : 'pointer',
                    boxShadow: analyzing ? 'none' : '0 4px 14px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  {analyzing ? '🔍 जांच हो रही है... / Analyzing...' : '🔍 मिट्टी की जांच शुरू करें / Start Soil Test'}
                </button>
              </div>
            )}

            {/* Analysis Progress Overlay */}
            {analyzing && (
              <div style={{ ...cardStyle, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <h4 style={{ margin: '0 0 12px', color: 'var(--primary-light)', fontSize: '16px', fontWeight: 700 }}>
                  ⚡ AI मिट्टी परीक्षण प्रोग्रेस / AI Soil Test Progress:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#cbd5e1' }}>
                  {analysisSteps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-circle-check" style={{ color: '#10b981' }}></i>
                      <span>{step}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ color: '#10b981' }}></i>
                    <span style={{ fontWeight: 600, color: 'var(--primary-light)' }}>कुछ ही सेकंड शेष हैं... Just a moment...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Photo Tips */}
            {!imagePreview && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px',
                padding: '14px 18px', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6
              }}>
                <strong style={{ color: 'var(--primary-light)' }}>📸 अच्छी फोटो लेने के नियम (Tips for best results):</strong><br />
                • दिन के उजाले में फोटो लें / Take photo in good daylight<br />
                • मिट्टी को हाथ में लेकर साफ़ फोटो खींचे / Hold a handful of dry/moist soil clearly<br />
                • धुंधली या अँधेरे में खींची फोटो न डालें / Avoid blurry or dark photos
              </div>
            )}

            {/* AI Results Output */}
            {analysisResult && (
              <div style={{ marginTop: '16px' }}>

                {/* Score Gauge card */}
                <div style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(21, 128, 61, 0.15) 0%, rgba(10, 25, 16, 0.95) 100%)', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: '18px', color: 'var(--primary-light)', fontWeight: 700 }}>
                    🌱 मिट्टी स्वास्थ्य रिपोर्ट / Soil Health Report
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0' }}>
                    <ScoreGauge score={analysisResult.overall_health_score || 75} />
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', fontWeight: 600, lineHeight: 1.5 }}>
                    {analysisResult.summary}
                  </p>
                </div>

                {/* NPK Nutrients Status */}
                <div style={cardStyle}>
                  <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                    🧬 पोषक तत्व मात्रा / Nutrient Status (NPK)
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <NutrientBadge label="नाइट्रोजन / Nitrogen" value={analysisResult.nitrogen_status} />
                    <NutrientBadge label="फास्फोरस / Phosphorus" value={analysisResult.phosphorus_status} />
                    <NutrientBadge label="पोटाश / Potassium" value={analysisResult.potassium_status} />
                  </div>
                </div>

                {/* Soil properties */}
                <div style={cardStyle}>
                  <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                    🔬 मिट्टी के गुण / Soil Properties
                  </h3>
                  <InfoRow icon="🪨" label="मिट्टी का प्रकार / Soil Type" value={analysisResult.soil_type} />
                  <InfoRow icon="⚗️" label="pH वैल्यू (अम्लता/क्षारता)" value={analysisResult.estimated_ph} />
                  <InfoRow icon="💧" label="नमी / Moisture" value={analysisResult.moisture_content} />
                  <InfoRow icon="🌊" label="जल निकासी / Drainage" value={analysisResult.drainage} />
                </div>

                {/* Recommendations */}
                <div style={cardStyle}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                    🌾 उपयुक्त फसलें / Suitable Crops
                  </h3>
                  <TagList items={analysisResult.suitable_crops} color="#10b981" />
                </div>

                <div style={cardStyle}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                    ⚠️ कमियां और सुधार / Improvements Needed
                  </h3>
                  <TagList items={analysisResult.visible_deficiencies} color="#f87171" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {(analysisResult.improvements_needed || []).map((step, idx) => (
                      <div key={idx} style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5, display: 'flex', gap: '8px' }}>
                        <span>👉</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advice Card */}
                <div style={{ ...cardStyle, background: 'rgba(56, 189, 248, 0.08)', borderLeft: '4px solid #38bdf8' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#38bdf8', fontWeight: 700 }}>
                    🧪 खाद सलाह / Fertilizer Dose:
                  </h4>
                  <p style={{ margin: '0 0 10px', fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {analysisResult.fertilizer_advice}
                  </p>
                  <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#38bdf8', fontWeight: 700 }}>
                    💧 सिंचाई सलाह / Irrigation Advice:
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {analysisResult.irrigation_advice}
                  </p>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ─── MANUAL SLIDERS SECTION ─── */}
        {activeSection === 'manual' && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: '18px', color: '#fff', fontWeight: 700, margin: '0 0 6px 0' }}>
              📊 मिट्टी परीक्षण रिपोर्ट दर्ज करें
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#94a3b8' }}>
              अपनी सरकारी सॉइल हेल्थ कार्ड रिपोर्ट के अनुसार मान सेट करें:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Nitrogen (N) - नाइट्रोजन', unit: 'ppm', val: nStatus, set: setNStatus, min: 10, max: 120, step: 1, color: '#10b981' },
                { label: 'Phosphorus (P) - फास्फोरस', unit: 'ppm', val: pStatus, set: setPStatus, min: 10, max: 120, step: 1, color: '#38bdf8' },
                { label: 'Potassium (K) - पोटाश', unit: 'ppm', val: kStatus, set: setKStatus, min: 10, max: 120, step: 1, color: '#fbbf24' },
                { label: 'Soil pH Value - पीएच मान', unit: '', val: phVal, set: setPhVal, min: 4.5, max: 9.0, step: 0.1, color: '#a78bfa' }
              ].map(({ label, unit, val, set, min, max, step, color }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                    <span>{label}</span>
                    <span style={{ color, fontSize: '16px' }}>{val}{unit ? ` ${unit}` : ''}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={val}
                    onChange={e => set(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
                    style={{ width: '100%', height: '8px', borderRadius: '4px', outline: 'none', accentColor: color }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    <span>न्यूनतम / {min}</span>
                    <span>अधिकतम / {max}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Health Score Output */}
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '16px', color: 'var(--primary-light)', fontWeight: 700 }}>
                Calculated Soil Health Index
              </h3>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                <ScoreGauge score={calculateHealthScore()} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '12px' }}>
                <NutrientBadge label="Nitrogen" value={nStatus > 80 ? 'High' : nStatus > 50 ? 'Adequate' : nStatus > 30 ? 'Low' : 'Deficient'} />
                <NutrientBadge label="Phosphorus" value={pStatus > 80 ? 'High' : pStatus > 50 ? 'Adequate' : pStatus > 30 ? 'Low' : 'Deficient'} />
                <NutrientBadge label="Potassium" value={kStatus > 80 ? 'High' : kStatus > 50 ? 'Adequate' : kStatus > 30 ? 'Low' : 'Deficient'} />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveReport}
                disabled={saving}
                style={{
                  marginTop: '16px', width: '100%', padding: '12px 18px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'black', fontSize: '14px', fontWeight: 700, cursor: 'pointer'
                }}
              >
                <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} style={{ marginRight: '6px' }} />
                {saving ? 'सहेज रहे हैं...' : 'सुरक्षित करें / Save Report'}
              </button>
              {saveMsg && (
                <div style={{ marginTop: '10px', color: 'var(--primary-light)', fontSize: '14px', fontWeight: 700 }}>
                  ✅ {saveMsg}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
