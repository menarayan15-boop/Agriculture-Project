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

// ── 10-Language Dictionary for AI Profiling Engine ────────────────────────
const PROFILE_LANG = {
  en: {
    'smallholder-subsistence-label': 'Smallholder Subsistence Farmer',
    'smallholder-subsistence-desc': 'Small-scale farming focused on self-sufficiency and organic practices.',
    'smallholder-commercial-label': 'Small Commercial Farmer',
    'smallholder-commercial-desc': 'Small farm with commercial orientation, seeking market access and better prices.',
    'medium-diversified-label': 'Medium Diversified Farmer',
    'medium-diversified-desc': 'Balanced approach with mixed crops, moderate investment, and steady growth.',
    'large-commercial-label': 'Large Commercial Farmer',
    'large-commercial-desc': 'High-yield, technology-driven farming with heavy machinery and market focus.',
    'irrigated-intensive-label': 'Irrigated Intensive Farmer',
    'irrigated-intensive-desc': 'Water-intensive crop cultivation requiring advanced irrigation management.',
    'dryland-adaptive-label': 'Dryland Adaptive Farmer',
    'dryland-adaptive-desc': 'Farming in arid/semi-arid regions with water-conservation focus.',
    'risk-drought-label': 'Drought Risk',
    'risk-drought-tip': 'Consider mulching and drip irrigation to conserve moisture.',
    'risk-waterlogging-label': 'Waterlogging Risk',
    'risk-waterlogging-tip': 'Ensure proper field drainage and raised-bed planting.',
    'risk-pest-label': 'Pest & Disease Risk',
    'risk-pest-tip': 'Apply preventive neem-based bio-pesticide spray.',
    'risk-market-label': 'Price Volatility Risk',
    'risk-market-tip': 'Monitor local Mandi rates before harvesting to time your sale.',
    'tip-early': 'Your crop is in early stage — focus on seed treatment and light irrigation.',
    'tip-veg': 'Vegetative stage: Maintain balanced NPK fertilizer application and weed control.',
    'tip-flower': 'Flowering stage: Increase phosphorus/potassium and protect against pest attacks.',
    'tip-harvest': 'Crop near maturity — plan harvest timing, storage, and market logistics.',
    'tip-water': 'Your crop has high water needs — consider drip/sprinkler irrigation for efficiency.',
    'tip-organic': 'Organic farming: Boost soil fertility with vermicompost and Jeevamrut.'
  },
  hi: {
    'smallholder-subsistence-label': 'लघु निर्वाह किसान',
    'smallholder-subsistence-desc': 'आत्मनिर्भरता और जैविक खेती पर केंद्रित छोटे पैमाने की खेती।',
    'smallholder-commercial-label': 'लघु वाणिज्यिक किसान',
    'smallholder-commercial-desc': 'बाजार पहुंच और बेहतर मूल्य चाहने वाला छोटा वाणिज्यिक खेत।',
    'medium-diversified-label': 'मध्यम विविध किसान',
    'medium-diversified-desc': 'मिश्रित फसलों, मध्यम निवेश और स्थिर विकास के साथ संतुलित दृष्टिकोण।',
    'large-commercial-label': 'बड़ा वाणिज्यिक किसान',
    'large-commercial-desc': 'भारी मशीनरी और बाजार फोकस के साथ उच्च उपज, प्रौद्योगिकी संचालित खेती।',
    'irrigated-intensive-label': 'सिंचित गहन किसान',
    'irrigated-intensive-desc': 'उन्नत सिंचाई प्रबंधन की आवश्यकता वाली जल-गहन फसल खेती।',
    'dryland-adaptive-label': 'शुष्क भूमि अनुकूल किसान',
    'dryland-adaptive-desc': 'जल-संरक्षण पर ध्यान केंद्रित करते हुए शुष्क/अर्ध-शुष्क क्षेत्रों में खेती।',
    'risk-drought-label': 'सूखे का खतरा',
    'risk-drought-tip': 'नमी बचाने के लिए मल्चिंग और ड्रिप सिंचाई पर विचार करें।',
    'risk-waterlogging-label': 'जलभराव का खतरा',
    'risk-waterlogging-tip': 'उचित खेत जल निकासी और उठी हुई क्यारी में रोपण सुनिश्चित करें।',
    'risk-pest-label': 'कीट और बीमारी का खतरा',
    'risk-pest-tip': 'निवारक नीम आधारित जैव कीटनाशक स्प्रे लागू करें।',
    'risk-market-label': 'मूल्य अस्थिरता का खतरा',
    'risk-market-tip': 'अपनी बिक्री के समय के लिए कटाई से पहले स्थानीय मंडी दरों की निगरानी करें।',
    'tip-early': 'आपकी फसल शुरुआती चरण में है — बीज उपचार और हल्की सिंचाई पर ध्यान दें।',
    'tip-veg': 'वानस्पतिक चरण: संतुलित NPK उर्वरक और खरपतवार नियंत्रण बनाए रखें।',
    'tip-flower': 'फूल आने का चरण: फास्फोरस/पोटेशियम बढ़ाएं और कीट हमलों से बचाएं।',
    'tip-harvest': 'फसल परिपक्वता के निकट — कटाई का समय, भंडारण और बाजार रसद की योजना बनाएं।',
    'tip-water': 'आपकी फसल को अधिक पानी चाहिए — ड्रिप/स्प्रिंकलर सिंचाई पर विचार करें।',
    'tip-organic': 'जैविक खेती: वर्मीकम्पोस्ट और जीवामृत से मिट्टी की उर्वरता बढ़ाएं।'
  },
  te: {
    'smallholder-subsistence-label': 'చిన్న కమతాల జీవనోపాధి రైతు',
    'smallholder-subsistence-desc': 'స్వయం సమృద్ధి మరియు సేంద్రీయ పద్ధతులపై దృష్టి సారించిన చిన్న తరహా సాగు.',
    'smallholder-commercial-label': 'చిన్న వాణిజ్య రైతు',
    'smallholder-commercial-desc': 'మార్కెట్ సదుపాయం మరియు మంచి ధర కోరుకునే చిన్న వాణిజ్య పొలం.',
    'medium-diversified-label': 'మధ్యస్థ వైవిధ్యభరిత రైతు',
    'medium-diversified-desc': 'మిశ్రమ పంటలు, మితమైన పెట్టుబడి మరియు స్థిరమైన ఎదుగుదలతో సమతుల్య విధానం.',
    'large-commercial-label': 'పెద్ద వాణిజ్య రైతు',
    'large-commercial-desc': 'భారీ యంత్రాలు మరియు మార్కెట్ లక్ష్యంగా సాంకేతికతతో కూడిన అధిక దిగుబడి సాగు.',
    'irrigated-intensive-label': 'సాగునీటి ఆధారిత సంద్ర రైతు',
    'irrigated-intensive-desc': 'అధునాతన నీటిపారుదల నిర్వహణ అవసరమయ్యే నీటితో కూడిన పంట సాగు.',
    'dryland-adaptive-label': 'మెట్ట భూమి అనుకూల రైతు',
    'dryland-adaptive-desc': 'నీటి సంరక్షణపై దృష్టి సారించి పొడి/పాక్షిక పొడి ప్రాంతాలలో సాగు.',
    'risk-drought-label': 'కరువు ప్రమాదం',
    'risk-drought-tip': 'తేమను కాపాడుకోవడానికి మల్చింగ్ మరియు డ్రిప్ నీటిపారుదలని పరిశీలించండి.',
    'risk-waterlogging-label': 'నీరు నిల్వ ఉండే ప్రమాదం',
    'risk-waterlogging-tip': 'సరైన డ్రైనేజీ మరియు మెరక పద్ధతిలో విత్తడం నిర్ధారించుకోండి.',
    'risk-pest-label': 'పురుగులు & తెగుళ్ల ప్రమాదం',
    'risk-pest-tip': 'నివారణ చర్యగా వేప ఆధారిత సేంద్రీయ పిచికారీ చేయండి.',
    'risk-market-label': 'ధరల హెచ్చుతగ్గుల ప్రమాదం',
    'risk-market-tip': 'అమ్ముకోవడానికి సరైన సమయం కోసం కోతకు ముందు స్థానిక మండి ధరలను పరిశీలించండి.',
    'tip-early': 'మీ పంట ప్రారంభ దశలో ఉంది — విత్తన శుద్ధి మరియు తేలికపాటి తడులపై దృష్టి పెట్టండి.',
    'tip-veg': 'పెరుగుదల దశ: సమతుల్య NPK ఎరువుల వాడకం మరియు కలుపు నివారణ చేయండి.',
    'tip-flower': 'పూత దశ: భాస్వరం/పొటాషియం పెంచి పురుగుల నుండి రక్షించండి.',
    'tip-harvest': 'పంట కోతకు సిద్ధంగా ఉంది — కోత సమయం, నిల్వ మరియు రవాణాను ప్లాన్ చేయండి.',
    'tip-water': 'మీ పంటకు ఎక్కువ నీరు అవసరం — డ్రిప్/స్ప్రింక్లర్ పద్ధతిని పరిశీలించండి.',
    'tip-organic': 'సేంద్రీయ సాగు: వర్మీకంపోస్ట్ మరియు జీవామృతంతో నేల సారాన్ని పెంచండి.'
  },
  ta: {
    'smallholder-subsistence-label': 'சிறுகுறு வாழ்வாதார விவசாயி',
    'smallholder-subsistence-desc': 'சுயதேவை மற்றும் இயற்கை விவசாயத்தில் கவனம் செலுத்தும் சிறு விவசாயம்.',
    'smallholder-commercial-label': 'சிறு வணிக விவசாயி',
    'smallholder-commercial-desc': 'சந்தை அணுகல் மற்றும் நல்ல விலையை எதிர்பார்க்கும் சிறு வணிக பண்ணை.',
    'medium-diversified-label': 'நடுத்தர பன்முக விவசாயி',
    'medium-diversified-desc': 'கலப்பு பயிர்கள் மற்றும் சீரான வளர்ச்சியுடன் கூடிய சமநிலையான அணுகுமுறை.',
    'large-commercial-label': 'பெரிய வணிக விவசாயி',
    'large-commercial-desc': 'நவீன இயந்திரங்களுடன் அதிக மகசூல் தரும் தொழில்நுட்ப விவசாயம்.',
    'irrigated-intensive-label': 'பாசன தீவிர விவசாயி',
    'irrigated-intensive-desc': 'நவீன பாசன மேலாண்மை தேவைப்படும் அதிக நீர் நுகர்வு பயிர் சாகுபடி.',
    'dryland-adaptive-label': 'மானாவாரி தகவமைப்பு விவசாயி',
    'dryland-adaptive-desc': 'நீர் சேமிப்பை மையமாகக் கொண்டு வறண்ட பகுதிகளில் விவசாயம்.',
    'risk-drought-label': 'வறட்சி அபாயம்',
    'risk-drought-tip': 'ஈரப்பதத்தைப் பாதுகாக்க மூடாக்கு மற்றும் சொட்டுநீர் பாசனத்தைப் பயன்படுத்துங்கள்.',
    'risk-waterlogging-label': 'நீர்த்தேக்க அபாயம்',
    'risk-waterlogging-tip': 'சரியான வடிகால் வசதி மற்றும் மேட்டுப்பாத்தி அமைப்பை உறுதி செய்யுங்கள்.',
    'risk-pest-label': 'பூச்சி & நோய் அபாயம்',
    'risk-pest-tip': 'வேம்பு சார்ந்த இயற்கை பூச்சிக்கொல்லி தெளிக்கவும்.',
    'risk-market-label': 'விலை ஏற்ற இறக்க அபாயம்',
    'risk-market-tip': 'விற்பனை நேரத்தை திட்டமிட அறுவடைக்கு முன் சந்தை விலையை கவனியுங்கள்.',
    'tip-early': 'பயிர் ஆரம்ப கட்டத்தில் உள்ளது — விதை நேர்த்தி மற்றும் மிதமான பாசனத்தில் கவனம் செலுத்துங்கள்.',
    'tip-veg': 'வளர்ச்சி நிலை: சீரான NPK உரம் மற்றும் களை கட்டுப்பாட்டை பராமரிக்கவும்.',
    'tip-flower': 'பூக்கும் நிலை: பாஸ்பரஸ்/பொட்டாசியம் அளவை அதிகரித்து பூச்சிகளிலிருந்து பாதுகாக்கவும்.',
    'tip-harvest': 'அறுவடைக்கு தயார் நிலை — அறுவடை மற்றும் சந்தை வாய்ப்புகளை திட்டமிடுங்கள்.',
    'tip-water': 'பயிருக்கு அதிக நீர் தேவை — சொட்டுநீர்/தெளிப்பு பாசன முறையை பரிசீலிக்கவும்.',
    'tip-organic': 'இயற்கை விவசாயம்: மண்புழு உரம் மற்றும் ஜீவாமிர்தம் மூலம் மண் வளத்தை உயர்த்தவும்.'
  },
  kn: {
    'smallholder-subsistence-label': 'ಸಣ್ಣ ಜೀವನಾಧಾರ ರೈತ',
    'smallholder-subsistence-desc': 'ಸ್ವಾವಲಂಬನೆ ಮತ್ತು ಸಾವಯವ ಕೃಷಿಯತ್ತ ಗಮನ ಹರಿಸಿದ ಸಣ್ಣ ಕೃಷಿ.',
    'smallholder-commercial-label': 'ಸಣ್ಣ ವಾಣಿಜ್ಯ ರೈತ',
    'smallholder-commercial-desc': 'ಮಾರುಕಟ್ಟೆ ಪ್ರವೇಶ ಮತ್ತು ಉತ್ತಮ ಬೆಲೆ ಬಯಸುವ ಸಣ್ಣ ವಾಣಿಜ್ಯ ಫಾರ್ಮ್.',
    'medium-diversified-label': 'ಮಧ್ಯಮ ವೈವಿಧ್ಯಮಯ ರೈತ',
    'medium-diversified-desc': 'ಮಿಶ್ರ ಬೆಳೆಗಳು ಮತ್ತು ಸ್ಥಿರ ಬೆಳವಣಿಗೆಯೊಂದಿಗೆ ಸಮತೋಲಿತ ವಿಧಾನ.',
    'large-commercial-label': 'ದೊಡ್ಡ ವಾಣಿಜ್ಯ ರೈತ',
    'large-commercial-desc': 'ಆಧುನಿಕ ಯಂತ್ರೋಪಕರಣಗಳೊಂದಿಗೆ ಹೆಚ್ಚಿನ ಇಳುವರಿ ನೀಡುವ ವಾಣಿಜ್ಯ ಕೃಷಿ.',
    'irrigated-intensive-label': 'ನೀರಾವರಿ ಸಾಂದ್ರ ರೈತ',
    'irrigated-intensive-desc': 'ಆಧುನಿಕ ನೀರಾವರಿ ನಿರ್ವಹಣೆ ಅಗತ್ಯವಿರುವ ಹೆಚ್ಚು ನೀರು ಬೇಡುವ ಬೆಳೆ ಕೃಷಿ.',
    'dryland-adaptive-label': 'ಶುಷ್ಕ ಭೂಮಿ ಅನುಕೂಲಿತ ರೈತ',
    'dryland-adaptive-desc': 'ನೀರು ಸಂರಕ್ಷಣೆಯತ್ತ ಗಮನ ಹರಿಸಿ ಒಣ ಪ್ರದೇಶಗಳಲ್ಲಿ ಕೃಷಿ.',
    'risk-drought-label': 'ಬರಗಾಲದ ಅಪಾಯ',
    'risk-drought-tip': 'ತೇವಾಂಶ ಉಳಿಸಲು ಹೊದಿಕೆ (ಮಲ್ಚಿಂಗ್) ಮತ್ತು ಡ್ರಿಪ್ ನೀರಾವರಿ ಬಳಸಿ.',
    'risk-waterlogging-label': 'ನೀರು ನಿಲ್ಲುವ ಅಪಾಯ',
    'risk-waterlogging-tip': 'ಸೂಕ್ತ ನೀರು ಹರಿಯುವ ವ್ಯವಸ್ಥೆ ಮತ್ತು ಎತ್ತರದ ಮಡಿಗಳನ್ನು ಮಾಡಿ.',
    'risk-pest-label': 'ಕೀಟ ಮತ್ತು ರೋಗದ ಅಪಾಯ',
    'risk-pest-tip': 'ಮುನ್ನೆಚ್ಚರಿಕೆಯಾಗಿ ಬೇವಿನ ಆಧಾರಿತ ಜೈವಿಕ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಿ.',
    'risk-market-label': 'ಬೆಲೆ ಏರಿಳಿತದ ಅಪಾಯ',
    'risk-market-tip': 'ಮಾರಾಟದ ಸಮಯ ನಿರ್ಧರಿಸಲು ಕಟಾವಿಗೂ ಮುನ್ನ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಗಮನಿಸಿ.',
    'tip-early': 'ಬೆಳೆ ಆರಂಭಿಕ ಹಂತದಲ್ಲಿದೆ — ಬೀಜೋಪಚಾರ ಮತ್ತು ಹಗುರ ನೀರಾವರಿಗೆ ಗಮನ ಕೊಡಿ.',
    'tip-veg': 'ಬೆಳವಣಿಗೆಯ ಹಂತ: ಸಮತೋಲಿತ NPK ಗೊಬ್ಬರ ಮತ್ತು ಕಳೆ ನಿಯಂತ್ರಣ ಮಾಡಿ.',
    'tip-flower': 'ಹೂವಿನ ಹಂತ: ರಂಜಕ/ಪೊಟ್ಯಾಶ್ ಹೆಚ್ಚಿಸಿ ಮತ್ತು ಕೀಟಗಳಿಂದ ರಕ್ಷಿಸಿ.',
    'tip-harvest': 'ಬೆಳೆ ಕಟಾವಿಗೆ ಸಿದ್ಧವಾಗಿದೆ — ಕಟಾವು ಮತ್ತು ಮಾರಾಟ ಯೋಜನೆ ಮಾಡಿ.',
    'tip-water': 'ಬೆಳೆಗೆ ಹೆಚ್ಚಿನ ನೀರಿನ ಅಗತ್ಯವಿದೆ — ಡ್ರಿಪ್/ಸ್ಪ್ರಿಂಕ್ಲರ್ ವ್ಯವಸ್ಥೆ ಪರಿಶೀಲಿಸಿ.',
    'tip-organic': 'ಸಾವಯವ ಕೃಷಿ: ಎರೆಹುಳು ಗೊಬ್ಬರ ಮತ್ತು ಜೀವಾಮೃತದಿಂದ ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸಿ.'
  },
  pa: {
    'smallholder-subsistence-label': 'ਛੋਟਾ ਗੁਜ਼ਾਰਾ ਕਰਨ ਵਾਲਾ ਕਿਸਾਨ',
    'smallholder-subsistence-desc': 'ਆਤਮਨਿਰਭਰਤਾ ਅਤੇ ਜੈਵਿਕ ਖੇਤੀ ਤੇ ਕੇਂਦ੍ਰਿਤ ਛੋਟੇ ਪੱਧਰ ਦੀ ਖੇਤੀ।',
    'smallholder-commercial-label': 'ਛੋਟਾ ਵਪਾਰਕ ਕਿਸਾਨ',
    'smallholder-commercial-desc': 'ਮੰਡੀ ਪਹੁੰਚ ਅਤੇ ਚੰਗੇ ਭਾਅ ਦੀ ਭਾਲ ਵਾਲਾ ਵਪਾਰਕ ਖੇਤ।',
    'medium-diversified-label': 'ਮੱਧਮ ਵਿਵਿਧ ਕਿਸਾਨ',
    'medium-diversified-desc': 'ਰਲਵੀਆਂ ਫਸਲਾਂ ਅਤੇ ਸਥਿਰ ਵਿਕਾਸ ਨਾਲ ਸੰਤੁਲਿਤ ਪਹੁੰਚ।',
    'large-commercial-label': 'ਵੱਡਾ ਵਪਾਰਕ ਕਿਸਾਨ',
    'large-commercial-desc': 'ਭਾਰੀ ਮਸ਼ੀਨਰੀ ਅਤੇ ਮੰਡੀ ਕੇਂਦਰਿਤ ਉੱਚ ਝਾੜ ਵਾਲੀ ਤਕਨੀਕੀ ਖੇਤੀ।',
    'irrigated-intensive-label': 'ਸਿੰਚਿਤ ਸੰਘਣੀ ਖੇਤੀ ਕਿਸਾਨ',
    'irrigated-intensive-desc': 'ਉੱਨਤ ਸਿੰਚਾਈ ਪ੍ਰਬੰਧਨ ਦੀ ਲੋੜ ਵਾਲੀ ਵੱਧ ਪਾਣੀ ਦੀ ਖਪਤ ਵਾਲੀ ਫਸਲ।',
    'dryland-adaptive-label': 'ਖੁਸ਼ਕ ਭੂਮੀ ਅਨੁਕੂਲ ਕਿਸਾਨ',
    'dryland-adaptive-desc': 'ਪਾਣੀ ਦੀ ਬਚਤ ਤੇ ਧਿਆਨ ਦਿੰਦੇ ਹੋਏ ਖੁਸ਼ਕ ਖੇਤਰਾਂ ਵਿੱਚ ਖੇਤੀ।',
    'risk-drought-label': 'ਸੂਕੇ ਦਾ ਖਤਰਾ',
    'risk-drought-tip': 'ਨਮੀ ਬਚਾਉਣ ਲਈ ਮਲਚਿੰਗ ਅਤੇ ਡ੍ਰਿਪ ਸਿੰਚਾਈ ਦੀ ਵਰਤੋਂ ਕਰੋ।',
    'risk-waterlogging-label': 'ਸੇਮ/ਪਾਣੀ ਖੜ੍ਹਨ ਦਾ ਖਤਰਾ',
    'risk-waterlogging-tip': 'ਖੇਤ ਵਿੱਚ ਪਾਣੀ ਦਾ ਨਿਕਾਸ ਅਤੇ ਉੱਚੀਆਂ ਵੱਟਾਂ ਬਣਾਓ।',
    'risk-pest-label': 'ਕੀੜੇ ਅਤੇ ਬਿਮਾਰੀ ਦਾ ਖਤਰਾ',
    'risk-pest-tip': 'ਬਚਾਅ ਲਈ ਨਿੰਮ ਆਧਾਰਿਤ ਜੈਵਿਕ ਸਪਰੇਅ ਕਰੋ।',
    'risk-market-label': 'ਕੀਮਤਾਂ ਵਿੱਚ ਉਤਾਰ-ਚੜ੍ਹਾਅ ਦਾ ਖਤਰਾ',
    'risk-market-tip': 'ਵਪਾਰ ਲਈ ਕਟਾਈ ਤੋਂ ਪਹਿਲਾਂ ਮੰਡੀ ਦੇ ਭਾਅ ਚੈੱਕ ਕਰੋ।',
    'tip-early': 'ਫਸਲ ਸ਼ੁਰੂਆਤੀ ਸਟੇਜ ਤੇ ਹੈ — ਬੀਜ ਦੀ ਸੋਧ ਅਤੇ ਹਲਕੀ ਸਿੰਚਾਈ ਕਰੋ।',
    'tip-veg': 'ਵਾਧੇ ਦੀ ਸਟੇਜ: ਸੰਤੁਲਿਤ ਖਾਦਾਂ ਅਤੇ ਨਦੀਨਾਂ ਦੀ ਰੋਕਥਾਮ ਕਰੋ।',
    'tip-flower': 'ਫੁੱਲ ਆਉਣ ਦੀ ਸਟੇਜ: ਫਾਸਫੋਰਸ/ਪੋਟਾਸ਼ ਵਧਾਓ ਅਤੇ ਕੀੜਿਆਂ ਤੋਂ ਬਚਾਓ।',
    'tip-harvest': 'ਫਸਲ ਪੱਕਣ ਦੇ ਨੇੜੇ ਹੈ — ਕਟਾਈ ਅਤੇ ਮੰਡੀਕਰਨ ਦੀ ਯੋਜਨਾ ਬਣਾਓ।',
    'tip-water': 'ਫਸਲ ਨੂੰ ਵੱਧ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ — ਡ੍ਰਿਪ/ਫੁਹਾਰਾ ਸਿੰਚਾਈ ਅਪਣਾਓ।',
    'tip-organic': 'ਜੈਵਿਕ ਖੇਤੀ: ਵਰਮੀਕੰਪੋਸਟ ਅਤੇ ਜੀਵਾਮ੍ਰਿਤ ਨਾਲ ਜ਼ਮੀਨ ਦੀ ਤਾਕਤ ਵਧਾਓ।'
  },
  mr: {
    'smallholder-subsistence-label': 'लहान निर्वाह शेतकरी',
    'smallholder-subsistence-desc': 'आत्मनिर्भरता आणि सेंद्रिय शेतीवर भर देणारी लहान शेती.',
    'smallholder-commercial-label': 'लहान व्यावसायिक शेतकरी',
    'smallholder-commercial-desc': 'बाजारपेठ आणि चांगला भाव शोधणारा लहान व्यावसायिक शेतकरी.',
    'medium-diversified-label': 'मध्यम विविध शेतकरी',
    'medium-diversified-desc': 'मिश्र पिके आणि स्थिर विकासासह संतुलित दृष्टिकोन.',
    'large-commercial-label': 'मोठा व्यावसायिक शेतकरी',
    'large-commercial-desc': 'आधुनिक यंत्रसामग्रीसह जास्त उत्पादन देणारी तंत्रज्ञान आधारित शेती.',
    'irrigated-intensive-label': 'सिंचित गहन शेतकरी',
    'irrigated-intensive-desc': 'प्रगत सिंचन व्यवस्थापनाची गरज असणारी पाणी-गहन पिकांची शेती.',
    'dryland-adaptive-label': 'कोरडवाहू अनुकूल शेतकरी',
    'dryland-adaptive-desc': 'पाणी बचतीवर भर देऊन कोरडवाहू भागात शेती.',
    'risk-drought-label': 'दुष्काळाचा धोका',
    'risk-drought-tip': 'ओलावा टिकवण्यासाठी आच्छादन (मल्चिंग) आणि ठिबक सिंचन वापरा.',
    'risk-waterlogging-label': 'पाणी साचण्याचा धोका',
    'risk-waterlogging-tip': 'योग्य निचरा आणि गादीवाफ्यावर लागवड सुनिश्चित करा.',
    'risk-pest-label': 'कीड व रोगाचा धोका',
    'risk-pest-tip': 'प्रतिबंधात्मक कडुनिंब आधारित सेंद्रिय फवारणी करा.',
    'risk-market-label': 'दर चढ-उताराचा धोका',
    'risk-market-tip': 'विक्रीची योग्य वेळ ठरवण्यासाठी काढणीपूर्वी बाजार भाव तपासा.',
    'tip-early': 'पीक सुरुवातीच्या टप्प्यात आहे — बी प्रक्रिया आणि हलक्या सिंचनावर लक्ष द्या.',
    'tip-veg': 'शाकीय वाढीचा टप्पा: संतुलित खते आणि तण नियंत्रण ठेवा.',
    'tip-flower': 'फुलोरा टप्पा: स्फुरद/पोटॅश वाढवा आणि किडींपासून संरक्षण करा.',
    'tip-harvest': 'पीक काढणीस तयार — काढणी आणि बाजार नियोजनाची तयारी करा.',
    'tip-water': 'पिकाला जास्त पाण्याची गरज आहे — ठिबक/तुषार सिंचनाचा वापर करा.',
    'tip-organic': 'सेंद्रिय शेती: गांडूळ खत आणि जिवामृताने जमिनीची सुपीकता वाढवा.'
  },
  bn: {
    'smallholder-subsistence-label': 'ক্ষুদ্র জীবিকানির্বাহী কৃষক',
    'smallholder-subsistence-desc': 'স্বাবলম্বিতা এবং জৈব পদ্ধতির ওপর জোর দেওয়া ক্ষুদ্র চাষাবাদ।',
    'smallholder-commercial-label': 'ক্ষুদ্র বাণিজ্যিক কৃষক',
    'smallholder-commercial-desc': 'ভালো বাজারদর এবং বিক্রির সুযোগসন্ধানী ক্ষুদ্র বাণিজ্যিক খামার।',
    'medium-diversified-label': 'মাঝারি বহুমুখী কৃষক',
    'medium-diversified-desc': 'মিশ্র ফসল এবং ধারাবাহিক বৃদ্ধির সমন্বয়ে ভারসাম্যপূর্ণ পদ্ধতি।',
    'large-commercial-label': 'বৃহৎ বাণিজ্যিক কৃষক',
    'large-commercial-desc': 'আধুনিক যন্ত্রপাতি ও প্রযুক্তি নির্ভর উচ্চ ফলনশীল বাণিজ্যিক কৃষি।',
    'irrigated-intensive-label': 'সেচ নির্ভর নিবিড় কৃষক',
    'irrigated-intensive-desc': 'উন্নত সেচ ব্যবস্থাপনা প্রয়োজন এমন জল-নিবিড় ফসলের চাষ।',
    'dryland-adaptive-label': 'শুষ্ক জমি অনুযোগী কৃষক',
    'dryland-adaptive-desc': 'জল সংরক্ষণের ওপর জোর দিয়ে শুষ্ক অঞ্চলে চাষাবাদ।',
    'risk-drought-label': 'খরা বা জলকষ্টের ঝুঁকি',
    'risk-drought-tip': 'রস ধরে রাখতে মালচিং এবং ড্রিপ সেচ ব্যবহার করুন।',
    'risk-waterlogging-label': 'জল জমে থাকার ঝুঁকি',
    'risk-waterlogging-tip': 'জমিতে জল নিকাশি এবং উঁচু বেডে চারা রোপণ নিশ্চিত করুন।',
    'risk-pest-label': 'পোকা ও রোগের ঝুঁকি',
    'risk-pest-tip': 'প্রতিষেধক হিসেবে নিম জৈব কীটনাশক স্প্রে করুন।',
    'risk-market-label': 'বাজারদরের ওঠানামার ঝুঁকি',
    'risk-market-tip': 'ফসল কাটার আগে সঠিক দামে বিক্রির জন্য স্থানীয় মান্ডির দর দেখুন।',
    'tip-early': 'ফসল প্রাথমিক পর্যায়ে আছে — বীজ শোধন ও হালকা সেচে নজর দিন।',
    'tip-veg': 'বৃদ্ধি পর্ব: সুষম NPK সার প্রয়োগ এবং আগাছা দমন করুন।',
    'tip-flower': 'ফুল আসার পর্ব: ফসফরাস/পটাশ বাড়ান এবং পোকার আক্রমণ থেকে রক্ষা করুন।',
    'tip-harvest': 'ফসল কাটার সময় হয়েছে — ফসল কাটা ও বিক্রির পরিকল্পনা করুন।',
    'tip-water': 'ফসলে জলের চাহিদা বেশি — ড্রিপ বা স্প্রিঙ্কলার সেচ ব্যবহার করুন।',
    'tip-organic': 'জৈব চাষ: কেঁচো সার ও জীবাণুমৃত দিয়ে মাটির উর্বরতা বাড়ান।'
  },
  gu: {
    'smallholder-subsistence-label': 'નાના જીવનનિર્વાહ ખેડૂત',
    'smallholder-subsistence-desc': 'આત્મનિર્ભરતા અને જૈવિક પદ્ધતિઓ પર ધ્યાન કેન્દ્રિત કરતી નાની ખેતી.',
    'smallholder-commercial-label': 'નાના વ્યાપારી ખેડૂત',
    'smallholder-commercial-desc': 'સારી બજાર પહોંચ અને ભાવ મેળવવા માંગતો નાનો વ્યાપારી ખેડૂત.',
    'medium-diversified-label': 'મધ્યમ વિવિધ ખેડૂત',
    'medium-diversified-desc': 'મિશ્ર પાકો અને સતત વિકાસ સાથે સંતુલિત અભિગમ.',
    'large-commercial-label': 'મોટા વ્યાપારી ખેડૂત',
    'large-commercial-desc': 'આધુનિક મશીનરી સાથે વધુ ઉત્પાદન આપતી ટેકનોલોજી આધારિત ખેતી.',
    'irrigated-intensive-label': 'સિંચાઈ સઘન ખેડૂત',
    'irrigated-intensive-desc': 'આધુનિક સિંચાઈ વ્યવસ્થાપનની જરૂરિયાતવાળા વધુ પાણીવાળા પાકો.',
    'dryland-adaptive-label': 'બિનપિયત અનુકૂળ ખેડૂત',
    'dryland-adaptive-desc': 'પાણીની બચત પર ધ્યાન આપીને સૂકા વિસ્તારોમાં ખેતી.',
    'risk-drought-label': 'દુષ્કાળનું જોખમ',
    'risk-drought-tip': 'ભેજ જાળવી રાખવા માટે મલ્ચિંગ અને ડ્રિપ સિંચાઈનો ઉપયોગ કરો.',
    'risk-waterlogging-label': 'પાણી ભરાઈ જવાનું જોખમ',
    'risk-waterlogging-tip': 'ખેતરમાં પાણીના નિકાલ અને ઉંચા બેડ બનાવી વાવેતર કરો.',
    'risk-pest-label': 'જીવાત અને રોગનું જોખમ',
    'risk-pest-tip': 'રક્ષણ માટે લીમડા આધારિત જૈવિક જંતુનાશક છાંટો.',
    'risk-market-label': 'ભાવના ઉતાર-ચડાવનું જોખમ',
    'risk-market-tip': 'વેચાણના સમય માટે લણણી પહેલાં માર્કેટ યાર્ડના ભાવ ચકાસો.',
    'tip-early': 'પાક શરૂઆતના તબક્કામાં છે — બીજ માવજત અને હળવા પિયત પર ધ્યાન આપો.',
    'tip-veg': 'વૃદ્ધિનો તબક્કો: સંતુલિત NPK ખાતર અને નીંદણ નિયંત્રણ કરો.',
    'tip-flower': 'ફૂલ આવવાનો તબક્કો: ફોસ્ફરસ/પોટાશ વધારો અને જીવાતથી બચાવો.',
    'tip-harvest': 'પાક લણણી માટે તૈયાર છે — લણણી અને વેચાણનું આયોજન કરો.',
    'tip-water': 'પાકને વધુ પાણીની જરૂર છે — ટપક/ફુવારા પિયત પદ્ધતિ અપનાવો.',
    'tip-organic': 'જૈવિક ખેતી: વર્મીકમ્પોસ્ટ અને જીવામૃતથી જમીનની ફળદ્રુપતા વધારો.'
  },
  or: {
    'smallholder-subsistence-label': 'କ୍ଷୁଦ୍ର ନିର୍ବାହୀ କୃଷକ',
    'smallholder-subsistence-desc': 'ଆତ୍ମନିର୍ଭରଶୀଳତା ଏବଂ ଜୈବିକ ପଦ୍ଧତି ଉପରେ ଆଧାରିତ କ୍ଷୁଦ୍ର ଚାଷ।',
    'smallholder-commercial-label': 'କ୍ଷୁଦ୍ର ବ୍ୟବସାୟୀ କୃଷକ',
    'smallholder-commercial-desc': 'ଭଲ ବଜାର ଦର ଏବଂ ବିକ୍ରି ସୁଯୋଗ ଖୋଜୁଥିବା କ୍ଷୁଦ୍ର ବ୍ୟବସାୟୀ।',
    'medium-diversified-label': 'ମଧ୍ୟମ ବିବିଧ କୃଷକ',
    'medium-diversified-desc': 'ମିଶ୍ରିତ ଫସଲ ଏବଂ ସ୍ଥାୟୀ ବୃଦ୍ଧି ସହ ସନ୍ତୁଳିତ ପଦ୍ଧତି।',
    'large-commercial-label': 'ବଡ଼ ବ୍ୟବସାୟୀ କୃଷକ',
    'large-commercial-desc': 'ଆଧୁନିକ ଯନ୍ତ୍ରପାତି ସହ ଅଧିକ ଅମଳ ଦେଉଥିବା ବ୍ୟବସାୟିକ ଚାଷ।',
    'irrigated-intensive-label': 'ଜଳସେଚିତ ସଘନ କୃଷକ',
    'irrigated-intensive-desc': 'ଉନ୍ନତ ଜଳସେଚନ ପରିଚାଳନା ଆବଶ୍ୟକ କରୁଥିବା ଜଳ-ଗହନ ଫସଲ।',
    'dryland-adaptive-label': 'ଶୁଷ୍କ ଜମି ଅନୁକୂଳୀ କୃଷକ',
    'dryland-adaptive-desc': 'ଜଳ ସଂରକ୍ଷଣ ଉପରେ ଧ୍ୟାନ ଦେଇ ଶୁଷ୍କ ଅଞ୍ଚଳରେ ଚାଷ।',
    'risk-drought-label': 'ମରୁଡ଼ି ଝୁଙ୍କି',
    'risk-drought-tip': 'ଅଦ୍ରତା ରଖିବା ପାଇଁ ମଲଚିଂ ଏବଂ ଡ୍ରିପ୍ ଜଳସେଚନ ବ୍ୟବହାର କରନ୍ତୁ।',
    'risk-waterlogging-label': 'ଜଳବନ୍ଦୀ ଝୁଙ୍କି',
    'risk-waterlogging-tip': 'ଜମିରୁ ଜଳ ନିଷ୍କାସନ ଏବଂ ଉଚ୍ଚା ବେଡ୍ ଚାଷ ନିଶ୍ଚିତ କରନ୍ତୁ।',
    'risk-pest-label': 'କୀଟ ଏବଂ ରୋଗ ଝୁଙ୍କି',
    'risk-pest-tip': 'ନିମ୍ବ ଆଧାରିତ ଜୈବିକ କୀଟନାଶକ ସ୍ପ୍ରେ କରନ୍ତୁ।',
    'risk-market-label': 'ଦର ଅସ୍ଥିରତା ଝୁଙ୍କି',
    'risk-market-tip': 'ବିକ୍ରି ସମୟ ସ୍ଥିର କରିବାକୁ ଅମଳ ପୂର୍ବରୁ ମଣ୍ଡି ଦର ଯାଞ୍ଚ କରନ୍ତୁ।',
    'tip-early': 'ଫସଲ ପ୍ରାରମ୍ଭିକ ପର୍ଯ୍ୟାୟରେ ଅଛି — ବିହନ ବିଶୋଧନ ଏବଂ ହାଲୁକା ଜଳସେଚନ କରନ୍ତୁ।',
    'tip-veg': 'ବୃଦ୍ଧି ପର୍ଯ୍ୟାୟ: ସନ୍ତୁଳିତ NPK ସାର ଏବଂ ଘାସ ନିୟନ୍ତ୍ରଣ କରନ୍ତୁ।',
    'tip-flower': 'ଫୁଲ ଆସିବା ପର୍ଯ୍ୟାୟ: ଫସଫରସ/ପୋଟାସ ବଢ଼ାନ୍ତୁ ଏବଂ କୀଟରୁ ରକ୍ଷା କରନ୍ତୁ।',
    'tip-harvest': 'ଫସଲ ଅମଳ ପାଇଁ ପ୍ରସ୍ତୁତ — ଅମଳ ଏବଂ ବିକ୍ରି ଯୋଜନା କରନ୍ତୁ।',
    'tip-water': 'ଫସଲକୁ ଅଧିକ ଜଳ ଆବଶ୍ୟକ — ଡ୍ରିପ/ସ୍କ୍ରିଙ୍କଲର ଜଳସେଚନ ଆପଣାନ୍ତୁ।',
    'tip-organic': 'ଜୈବିକ ଚାଷ: କମ୍ପୋଷ୍ଟ ଏବଂ ଜୀବାମୃତ ଦ୍ୱାରା ଜମିର ଉର୍ବରତା ବଢ଼ାନ୍ତୁ।'
  }
};

function pt(key, lang = 'en') {
  if (PROFILE_LANG[lang] && PROFILE_LANG[lang][key]) return PROFILE_LANG[lang][key];
  if (PROFILE_LANG.en && PROFILE_LANG.en[key]) return PROFILE_LANG.en[key];
  return key;
}

const ARCHETYPES = {
  'smallholder-subsistence': {
    icon: '🌱', color: '#22c55e'
  },
  'smallholder-commercial': {
    icon: '🏪', color: '#3b82f6'
  },
  'medium-diversified': {
    icon: '🌾', color: '#f59e0b'
  },
  'large-commercial': {
    icon: '🏭', color: '#ef4444'
  },
  'irrigated-intensive': {
    icon: '💧', color: '#06b6d4'
  },
  'dryland-adaptive': {
    icon: '🏜️', color: '#d97706'
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
