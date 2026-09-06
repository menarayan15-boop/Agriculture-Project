import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UNIT_TO_ACRE, UNIT_NAMES, CROP_DATA as DEFAULT_CROP_DATA, FERTILIZER_DATA as DEFAULT_FERTILIZER_DATA,
  LABOUR_ACTIVITIES, MACHINERY_DATA as DEFAULT_MACHINERY_DATA, STORAGE_TYPES,
  toAcres, fmt,
  calcSeed, calcFertilizer, calcIrrigation, calcSpray,
  calcLabour, calcMachinery, calcLoan, calcStorage, calcROI,
  calcSolarPump, calcCattleFodder, calcDripIrrigation, calcPolyhouse, calcOrganicInputs
} from '../../utils/farmingCalc';

// ── i18n Dictionary for Calculator (Supports 10 Regional Languages) ──────────
const CALC_LANG = {
  en: {
    title: "Integrated Farming Calculator",
    subtitle: "Estimate seed quantity, fertilizer NPK dosages, spraying expenses, machinery rentals, and total ROI.",
    printSheet: "🖨️ Print Cost Sheet",
    save: "💾 Save",
    history: "🕐 History",
    quickLand: "Quick Land Size:",
    selectCrop: "Select Crop:",
    allCalculators: "All Calculators",
    reset: "Reset",
    calculate: "Calculate",
    settings: "Admin Settings",
    dashboard: "Farming Dashboard & Overview",
    smartInsights: "Smart Suggestions & Insights",
    disclaimer: "Disclaimer: All calculations are estimates based on standard references. Actual values may vary with soil conditions, microclimate, and local practices.",
    voiceActive: "Listening...",
    voiceHint: "Click mic and say a number",
    loadCalculated: "Load calculated values",
    formula: "Formula used:",
    successSave: "Calculation saved successfully!",
    landArea: "LAND AREA",
    seedRequired: "SEED REQUIRED",
    fertUrea: "FERTILIZER (UREA)",
    waterReq: "WATER REQUIRED",
    farmCost: "TYPICAL FARM COST",
    expYield: "EXPECTED YIELD",
    expRevenue: "EXPECTED REVENUE",
    expProfit: "EXPECTED PROFIT",
    estRoi: "ESTIMATED ROI",
    group_overview: "📊 Overview",
    group_basics: "🌾 Farm Basics",
    group_resources: "💧 Resources & Inputs",
    group_operations: "⚙️ Operations",
    group_economics: "💰 Financial Economics",
    group_advanced: "📊 Advanced",
    group_settings: "⚙️ Config",
    group_history: "🕐 History",
    nav_dashboard: "Dashboard",
    nav_area: "Land Area & Units",
    nav_seed: "Seed Rate",
    nav_fertilizer: "Fertilizer NPK",
    nav_irrigation: "Water & Pump",
    nav_solar_pump: "Solar Pump (KUSUM)",
    nav_drip_calc: "Drip System",
    nav_spray: "Pesticide/Spray",
    nav_organic_calc: "Organic Inputs",
    nav_labour: "Labour Cost",
    nav_machinery: "Machinery Rental",
    nav_polyhouse: "Polyhouse/Greenhouse",
    nav_cattle_fodder: "Cattle & Dairy",
    nav_farmcost: "Farm Cost Sheet",
    nav_profit: "Crop Net Profit",
    nav_breakeven: "Break-Even Price",
    nav_loan: "Krishi Loan EMI",
    nav_roi: "ROI Analysis",
    nav_crop_compare: "Crop Comparison",
    nav_mandi_profit: "Mandi Net Price",
    nav_storage: "Storage/Warehouse",
    nav_multicrop: "Multi-Crop Farm",
  },
  hi: {
    title: "एकीकृत कृषि कैलकुलेटर",
    subtitle: "बीज मात्रा, उर्वरक NPK खुराक, स्प्रे खर्च, मशीनरी किराया और कुल ROI का अनुमान लगाएं।",
    printSheet: "🖨️ लागत पत्रक प्रिंट करें",
    save: "💾 सहेजें",
    history: "🕐 इतिहास",
    quickLand: "भूमि का आकार:",
    selectCrop: "फसल चुनें:",
    allCalculators: "सभी कैलकुलेटर",
    reset: "रीसेट करें",
    calculate: "गणना करें",
    settings: "व्यवस्थापक सेटिंग्स",
    dashboard: "फार्म डैशबोर्ड और अवलोकन",
    smartInsights: "स्मार्ट सुझाव और अंतर्दृष्टि",
    disclaimer: "अस्वीकरण: सभी गणनाएँ संदर्भों पर आधारित अनुमान हैं। वास्तविक परिणाम मिट्टी और स्थानीय प्रथाओं के अनुसार भिन्न हो सकते हैं।",
    voiceActive: "सुन रहा है...",
    voiceHint: "माइक दबाकर संख्या बोलें",
    loadCalculated: "परिकलित मान लोड करें",
    formula: "प्रयुक्त सूत्र:",
    successSave: "गणना सफलतापूर्वक सहेज ली गई!",
    landArea: "भूमि क्षेत्रफल",
    seedRequired: "आवश्यक बीज",
    fertUrea: "उर्वरक (यूरिया)",
    waterReq: "आवश्यक जल",
    farmCost: "अनुमानित फार्म लागत",
    expYield: "अपेक्षित उपज",
    expRevenue: "अपेक्षित राजस्व",
    expProfit: "अपेक्षित शुद्ध लाभ",
    estRoi: "अनुमानित ROI",
    group_overview: "📊 अवलोकन",
    group_basics: "🌾 फार्म की बुनियादी बातें",
    group_resources: "💧 संसाधन और इनपुट",
    group_operations: "⚙️ कृषि कार्य",
    group_economics: "💰 वित्तीय अर्थशास्त्र",
    group_advanced: "📊 उन्नत मॉडल",
    group_settings: "⚙️ कॉन्फ़िगरेशन",
    group_history: "🕐 इतिहास",
    nav_dashboard: "डैशबोर्ड",
    nav_area: "भूमि क्षेत्रफल और इकाइयां",
    nav_seed: "बीज दर",
    nav_fertilizer: "उर्वरक NPK",
    nav_irrigation: "सिंचाई जल",
    nav_solar_pump: "सोलर पंप (कुसुम)",
    nav_drip_calc: "ड्रिप सिस्टम",
    nav_spray: "कीटनाशक स्प्रे",
    nav_organic_calc: "जैविक इनपुट",
    nav_labour: "मजदूर लागत",
    nav_machinery: "मशीनरी किराया",
    nav_polyhouse: "पॉलीहाउस / ग्रीनहाउस",
    nav_cattle_fodder: "पशु और डेयरी",
    nav_farmcost: "कुल फार्म लागत पत्रक",
    nav_profit: "फसल शुद्ध लाभ",
    nav_breakeven: "ब्रेक-इवन मूल्य",
    nav_loan: "कृषि ऋण ईएमआई",
    nav_roi: "आरओआई विश्लेषण",
    nav_crop_compare: "फसल तुलना",
    nav_mandi_profit: "मंडी शुद्ध मूल्य",
    nav_storage: "भंडारण / गोदाम",
    nav_multicrop: "बहु-फसल खेत",
  },
  kn: {
    title: "ಸಮಗ್ರ ಕೃಷಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
    subtitle: "ಬೀಜದ ಪ್ರಮಾಣ, ರಸಗೊಬ್ಬರ NPK ಡೋಸೇಜ್, ಸಿಂಪಣೆ ವೆಚ್ಚ, ಯಂತ್ರೋಪಕರಣ ಬಾಡಿಗೆ ಮತ್ತು ಒಟ್ಟು ROI ಅಂದಾಜು ಮಾಡಿ.",
    printSheet: "🖨️ ವೆಚ್ಚ ಪಟ್ಟಿಯನ್ನು ಪ್ರಿಂಟ್ ಮಾಡಿ",
    save: "💾 ಉಳಿಸಿ",
    history: "🕐 ಇತಿಹಾಸ",
    quickLand: "ಜಮೀನಿನ ಗಾತ್ರ:",
    selectCrop: "ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿ:",
    allCalculators: "ಎಲ್ಲಾ ಕ್ಯಾಲ್ಕುಲೇಟರ್‌ಗಳು",
    reset: "ಮರುಹೊಂದಿಸಿ",
    calculate: "ಲೆಕ್ಕ ಹಾಕಿ",
    settings: "ನಿರ್ವಾಹಕ ಸೆಟ್ಟಿಂಗ್ಸ್",
    dashboard: "ಫಾರ್ಮ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮತ್ತು ಅವಲೋಕನ",
    smartInsights: "ಸ್ಮಾರ್ಟ್ ಸಲಹೆಗಳು",
    disclaimer: "ಹಕ್ಕುತ್ಯಾಗ: ಎಲ್ಲಾ ಲೆಕ್ಕಾಚಾರಗಳು ಸಾಮಾನ್ಯ ಅಂದಾಜುಗಳಾಗಿವೆ. ಮಣ್ಣು ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಪದ್ಧತಿಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ನೈಜ ಫಲಿತಾಂಶಗಳು ಬದಲಾಗಬಹುದು.",
    voiceActive: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ...",
    voiceHint: "ಮೈಕ್ ಒತ್ತಿ ಸಂಖ್ಯೆ ಹೇಳಿ",
    loadCalculated: "ಲೆಕ್ಕಾಚಾರದ ಮೌಲ್ಯಗಳನ್ನು ಲೋಡ್ ಮಾಡಿ",
    formula: "ಬಳಸಿದ ಸೂತ್ರ:",
    successSave: "ಲೆಕ್ಕಾಚಾರವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!",
    landArea: "ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ",
    seedRequired: "ಅಗತ್ಯವಿರುವ ಬೀಜ",
    fertUrea: "ರಸಗೊಬ್ಬರ (ಯೂರಿಯಾ)",
    waterReq: "ಅಗತ್ಯವಿರುವ ನೀರು",
    farmCost: "ಒಟ್ಟು ಫಾರ್ಮ್ ವೆಚ್ಚ",
    expYield: "ನಿರೀಕ್ಷಿತ ಇಳುವರಿ",
    expRevenue: "ನಿರೀಕ್ಷಿತ ಆದಾಯ",
    expProfit: "ನಿರೀಕ್ಷಿತ ನಿವ್ವಳ ಲಾಭ",
    estRoi: "ಅಂದಾಜು ROI",
    group_overview: "📊 ಅವಲೋಕನ",
    group_basics: "🌾 ಫಾರ್ಮ್ ಬೇಸಿಕ್ಸ್",
    group_resources: "💧 ಸಂಪನ್ಮೂಲಗಳು",
    group_operations: "⚙️ ಕೃಷಿ ಕಾರ್ಯಾಚರಣೆಗಳು",
    group_economics: "💰 ಆರ್ಥಿಕತೆ",
    group_advanced: "📊 ಸುಧಾರಿತ ಮಾಡ್ಯೂಲ್‌ಗಳು",
    group_settings: "⚙️ ಕಾನ್ಫಿಗರೇಶನ್",
    group_history: "🕐 ಇತಿಹಾಸ",
    nav_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    nav_area: "ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ",
    nav_seed: "ಬೀಜದ ಪ್ರಮಾಣ",
    nav_fertilizer: "ರಸಗೊಬ್ಬರ NPK",
    nav_irrigation: "ನೀರಾವರಿ ನೀರು",
    nav_solar_pump: "ಸೋಲಾರ್ ಪಂಪ್ (ಕುಸುಮ್)",
    nav_drip_calc: "ಡ್ರಿಪ್ ವ್ಯವಸ್ಥೆ",
    nav_spray: "ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆ",
    nav_organic_calc: "ಜೈವಿಕ ಪರಿಕರಗಳು",
    nav_labour: "ಕೂಲಿ ವೆಚ್ಚ",
    nav_machinery: "ಯಂತ್ರೋಪಕರಣ ಬಾಡಿಗೆ",
    nav_polyhouse: "ಪಾಲಿಹೌಸ್ / ಗ್ರೀನ್‌ಹೌಸ್",
    nav_cattle_fodder: "ಜಾನುವಾರು ಮತ್ತು ಹಾಲಿನ ಫಾರ್ಮ್",
    nav_farmcost: "ಒಟ್ಟು ಫಾರ್ಮ್ ವೆಚ್ಚ ಪಟ್ಟಿ",
    nav_profit: "ಬೆಳೆಯ ನಿವ್ವಳ ಲಾಭ",
    nav_breakeven: "ಬ್ರೇಕ್-ಈವನ್ ಬೆಲೆ",
    nav_loan: "ಕೃಷಿ ಸಾಲ EMI",
    nav_roi: "ROI ವಿಶ್ಲೇಷಣೆ",
    nav_crop_compare: "ಬೆಳೆಗಳ ಹೋಲಿಕೆ",
    nav_mandi_profit: "ಮಂಡಿ ನಿವ್ವಳ ಬೆಲೆ",
    nav_storage: "ಗೋದಾಮು ಸಂಗ್ರಹಣೆ",
    nav_multicrop: "ಬಹು-ಬೆಳೆ ಫಾರ್ಮ್",
  },
  te: {
    title: "సమగ్ర వ్యవసాయ క్యాలిక్యులేటర్",
    subtitle: "విత్తన పరిమాణం, ఎరువుల NPK మోతాదు, స్ప్రే ఖర్చులు, యంత్రాల అద్దె మరియు మొత్తం ROI అంచనా వేయండి.",
    printSheet: "🖨️ ప్రింట్ కాస్ట్ షీట్",
    save: "💾 సేవ్ చేయండి",
    history: "🕐 చరిత్ర",
    quickLand: "భూమి పరిమాణం:",
    selectCrop: "పంటను ఎంచుకోండి:",
    allCalculators: "అన్ని క్యాలిక్యులేటర్లు",
    reset: "రీసెట్",
    calculate: "లెక్కించు",
    settings: "అడ్మిన్ సెట్టింగ్స్",
    dashboard: "పొలం డాష్‌బోర్డ్ & అవలోకనం",
    smartInsights: "స్మార్ట్ సూచనలు",
    disclaimer: "గమనిక: అన్ని గణనలు ప్రామాణిక అంచనాలు. స్థానిక పరిస్థితులకు అనుగుణంగా మారవచ్చు.",
    voiceActive: "వింటోంది...",
    voiceHint: "మైక్ నొక్కి సంఖ్య చెప్పండి",
    loadCalculated: "లెక్కించిన విలువలను లోడ్ చేయండి",
    formula: "వాడిన సూత్రం:",
    successSave: "విజయవంతంగా సేవ్ చేయబడింది!",
    landArea: "భూమి వైశాల్యం",
    seedRequired: "కావలసిన విత్తనాలు",
    fertUrea: "ఎరువులు (యూరియా)",
    waterReq: "కావలసిన నీరు",
    farmCost: "పొలం ఖర్చు",
    expYield: "ఆశించిన దిగుబడి",
    expRevenue: "ఆశించిన రాబడి",
    expProfit: "ఆశించిన లాభం",
    estRoi: "అంచనా ROI",
    group_overview: "📊 అవలోకనం",
    group_basics: "🌾 పొలం ప్రాథమికాలు",
    group_resources: "💧 వనరులు",
    group_operations: "⚙️ పొలం పనులు",
    group_economics: "💰 ఆర్థిక వ్యయం",
    group_advanced: "📊 అధునాతన",
    group_settings: "⚙️ కాన్ఫిగ్",
    group_history: "🕐 చరిత్ర",
    nav_dashboard: "డాష్‌బోర్డ్",
    nav_area: "భూమి వైశాల్యం",
    nav_seed: "విత్తన మోతాదు",
    nav_fertilizer: "ఎరువుల NPK",
    nav_irrigation: "నీటిపారుదల",
    nav_solar_pump: "సోలార్ పంప్ (కుసుమ్)",
    nav_drip_calc: "డ్రిప్ సిస్టమ్",
    nav_spray: "స్ప్రే ఖర్చులు",
    nav_organic_calc: "సేంద్రీయ ఇన్పుట్లు",
    nav_labour: "కూలీల ఖర్చు",
    nav_machinery: "యంత్రాల అద్దె",
    nav_polyhouse: "పాలిహౌస్",
    nav_cattle_fodder: "పశువులు & డైరీ",
    nav_farmcost: "పొలం ఖర్చుల షీట్",
    nav_profit: "పంట నికర లాభం",
    nav_breakeven: "బ్రేక్-ఈవెన్ ధర",
    nav_loan: "వ్యవసాయ రుణం EMI",
    nav_roi: "ROI విశ్లేషణ",
    nav_crop_compare: "పంటల పోలిక",
    nav_mandi_profit: "మండి నికర ధర",
    nav_storage: "గిడ్డంగి నిల్వ",
    nav_multicrop: "బహుళ పంటలు",
  },
  ta: {
    title: "ஒருங்கிணைந்த விவசாய கால்குலேட்டர்",
    subtitle: "விதை அளவு, உர NPK அளவுகள், தெளிப்பு செலவுகள், இயந்திர வாடகை மற்றும் மொத்த ROI ஐ கணக்கிடுங்கள்.",
    printSheet: "🖨️ செலவுத் தாளை அச்சிடுக",
    save: "💾 சேமி",
    history: "🕐 வரலாறு",
    quickLand: "நிலத்தின் அளவு:",
    selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்:",
    allCalculators: "அனைத்து கால்குலேட்டர்கள்",
    reset: "மீட்டமை",
    calculate: "கணக்கிடு",
    settings: "நிர்வாக அமைப்புகள்",
    dashboard: "பண்ணை டாஷ்போர்டு",
    smartInsights: "ஸ்மார்ட் ஆலோசனைகள்",
    disclaimer: "மறுப்பு: அனைத்து கணக்கீடுகளும் மதிப்பீடுகளாகும்.",
    voiceActive: "கேட்கிறது...",
    voiceHint: "மைக் அழுத்தி எண்ணைக் கூறுங்கள்",
    loadCalculated: "மதிப்புகளை ஏற்றவும்",
    formula: "பயன்படுத்திய சூத்திரம்:",
    successSave: "வெற்றிகரமாக சேமிக்கப்பட்டது!",
    landArea: "நிலப்பரப்பு",
    seedRequired: "தேவைப்படும் விதை",
    fertUrea: "உரம் (யூரியா)",
    waterReq: "தேவைப்படும் நீர்",
    farmCost: "பண்ணைச் செலவு",
    expYield: "எதிர்பார்க்கப்படும் மகசூல்",
    expRevenue: "எதிர்பார்க்கப்படும் வருவாய்",
    expProfit: "எதிர்பார்க்கப்படும் லாபம்",
    estRoi: "மதிப்பிடப்பட்ட ROI",
    group_overview: "📊 மேலோட்டம்",
    group_basics: "🌾 பண்ணை மூலங்கள்",
    group_resources: "💧 வளங்கள்",
    group_operations: "⚙️ செயல்பாடுகள்",
    group_economics: "💰 நிதி பொருளாதாரம்",
    group_advanced: "📊 மேம்பட்ட",
    group_settings: "⚙️ அமைப்புகள்",
    group_history: "🕐 வரலாறு",
    nav_dashboard: "டாஷ்போர்டு",
    nav_area: "நிலப்பரப்பு",
    nav_seed: "விதை அளவு",
    nav_fertilizer: "உர NPK",
    nav_irrigation: "பாசன நீர்",
    nav_solar_pump: "சோலார் பம்ப்",
    nav_drip_calc: "சொட்டுநீர் பாசனம்",
    nav_spray: "பூச்சிக்கொல்லி தெளிப்பு",
    nav_organic_calc: "இயற்கை உரங்கள்",
    nav_labour: "கூலிச் செலவு",
    nav_machinery: "இயந்திர வாடகை",
    nav_polyhouse: "பாலிஹவுஸ்",
    nav_cattle_fodder: "கால்நடை & டைரி",
    nav_farmcost: "செலவுத் தாள்",
    nav_profit: "பயிர் நிகர லாபம்",
    nav_breakeven: "சமநிலை விலை",
    nav_loan: "விவசாயக் கடன் EMI",
    nav_roi: "ROI பகுப்பாய்வு",
    nav_crop_compare: "பயிர் ஒப்பீடு",
    nav_mandi_profit: "மண்டி நிகர விலை",
    nav_storage: "சேமிப்பு கிடங்கு",
    nav_multicrop: "பல பயிர் பண்ணை",
  },
  pa: {
    title: "ਇਕਜੁੱਟ ਖੇਤੀ ਕੈਲਕੁਲੇਟਰ",
    subtitle: "ਬੀਜ ਦੀ ਮਾਤਰਾ, ਖਾਦ NPK ਖੁਰਾਕ, ਸਪਰੇਅ ਖਰਚੇ, ਮਸ਼ੀਨਰੀ ਕਿਰਾਇਆ ਅਤੇ ਕੁੱਲ ROI ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ।",
    printSheet: "🖨️ ਖਰਚਾ ਪੱਤਰ ਪ੍ਰਿੰਟ ਕਰੋ",
    save: "💾 ਸੰਭਾਲੋ",
    history: "🕐 ਇਤਿਹਾਸ",
    quickLand: "ਜ਼ਮੀਨ ਦਾ ਆਕਾਰ:",
    selectCrop: "ਫਸਲ ਚੁਣੋ:",
    allCalculators: "ਸਾਰੇ ਕੈਲਕੁਲੇਟਰ",
    reset: "ਰੀਸੈਟ ਕਰੋ",
    calculate: "ਹਿਸਾਬ ਲਗਾਓ",
    settings: "ਐਡਮਿਨ ਸੈਟਿੰਗਾਂ",
    dashboard: "ਖੇਤ ਡੈਸ਼ਬੋਰਡ",
    smartInsights: "ਸਮਾਰਟ ਸੁਝਾਅ",
    disclaimer: "ਬੇਦਾਅਵਾ: ਸਾਰੀਆਂ ਗਣਨਾਵਾਂ ਅੰਦਾਜ਼ਾ ਹਨ।",
    voiceActive: "ਸੁਣ ਰਿਹਾ ਹੈ...",
    voiceHint: "ਮਾਈਕ ਦਬਾ ਕੇ ਨੰਬਰ ਬੋਲੋ",
    loadCalculated: "ਹਿਸਾਬ ਲੋਡ ਕਰੋ",
    formula: "ਵਰਤਿਆ ਫਾਰਮੂਲਾ:",
    successSave: "ਸਫਲਤਾਪੂਰਵਕ ਸੰਭਾਲਿਆ ਗਿਆ!",
    landArea: "ਜ਼ਮੀਨ ਦਾ ਖੇਤਰਫਲ",
    seedRequired: "ਲੋੜੀਂਦਾ ਬੀਜ",
    fertUrea: "ਖਾਦ (ਯੂਰੀਆ)",
    waterReq: "ਲੋੜੀਂਦਾ ਪਾਣੀ",
    farmCost: "ਖੇਤ ਦਾ ਖਰਚਾ",
    expYield: "ਸੰਭਾਵਿਤ ਝਾੜ",
    expRevenue: "ਸੰਭਾਵਿਤ ਆਮਦਨ",
    expProfit: "ਸੰਭਾਵਿਤ ਲਾਭ",
    estRoi: "ਅੰਦਾਜ਼ਿਤ ROI",
    group_overview: "📊 ਓਵਰਵਿਊ",
    group_basics: "🌾 ਖੇਤ ਦੇ ਬੁਨਿਆਦੀ",
    group_resources: "💧 ਸਾਧਨ",
    group_operations: "⚙️ ਖੇਤੀਬਾੜੀ ਕੰਮ",
    group_economics: "💰 ਆਰਥਿਕ ਹਿਸਾਬ",
    group_advanced: "📊 ਐਡਵਾਂਸਡ",
    group_settings: "⚙️ ਕਨਫਿਗ",
    group_history: "🕐 ਇਤਿਹਾਸ",
    nav_dashboard: "ਡੈਸ਼ਬੋਰਡ",
    nav_area: "ਜ਼ਮੀਨ ਦਾ ਖੇਤਰਫਲ",
    nav_seed: "ਬੀਜ ਦੀ ਦਰ",
    nav_fertilizer: "ਖਾਦ NPK",
    nav_irrigation: "ਸਿੰਚਾਈ ਪਾਣੀ",
    nav_solar_pump: "ਸੋਲਰ ਪੰਪ",
    nav_drip_calc: "ਡ੍ਰਿਪ ਸਿਸਟਮ",
    nav_spray: "ਕੀਟਨਾਸ਼ਕ ਸਪਰੇਅ",
    nav_organic_calc: "ਜੈਵਿਕ ਖਾਦ",
    nav_labour: "ਮਜ਼ਦੂਰੀ ਖਰਚਾ",
    nav_machinery: "ਮਸ਼ੀਨਰੀ ਕਿਰਾਇਆ",
    nav_polyhouse: "ਪਾਲੀਹਾਊਸ",
    nav_cattle_fodder: "ਪਸ਼ੂ ਅਤੇ ਡੇਅਰੀ",
    nav_farmcost: "ਕੁੱਲ ਖਰਚਾ ਪੱਤਰ",
    nav_profit: "ਫਸਲ ਦਾ ਸ਼ੁੱਧ ਲਾਭ",
    nav_breakeven: "ਬ੍ਰੇਕ-ਈਵਨ ਕੀਮਤ",
    nav_loan: "ਖੇਤੀ ਕਰਜ਼ਾ EMI",
    nav_roi: "ROI ਵਿਸ਼ਲੇਸ਼ਣ",
    nav_crop_compare: "ਫਸਲਾਂ ਦੀ ਤੁਲਨਾ",
    nav_mandi_profit: "ਮੰਡੀ ਦਾ ਸ਼ੁੱਧ ਭਾਅ",
    nav_storage: "ਸਟੋਰੇਜ",
    nav_multicrop: "ਬਹੁ-ਫਸਲੀ ਖੇਤ",
  },
  mr: {
    title: "एकात्मिक शेती कॅल्क्युलेटर",
    subtitle: "बियाण्यांचे प्रमाण, खताचे NPK प्रमाण, फवारणी खर्च, यंत्रसामग्री भाडे आणि एकूण ROI चा अंदाज लावा.",
    printSheet: "🖨️ खर्च पत्रक प्रिंट करा",
    save: "💾 जतन करा",
    history: "🕐 इतिहास",
    quickLand: "जमिनीचे क्षेत्रफळ:",
    selectCrop: "पीक निवडा:",
    allCalculators: "सर्व कॅल्क्युलेटर",
    reset: "रीसेट करा",
    calculate: "गणना करा",
    settings: "प्रशासक सेटिंग्ज",
    dashboard: "शेती डैशबोर्ड",
    smartInsights: "स्मार्ट सल्ला",
    disclaimer: "अस्वीकरण: सर्व गणना अंदाजावर आधारित आहेत.",
    voiceActive: "ऐकत आहे...",
    voiceHint: "माईक दाबून संख्या सांगा",
    loadCalculated: "मूल्य लोड करा",
    formula: "वापरलेले सूत्र:",
    successSave: "यशस्वीपणे जतन केले!",
    landArea: "जमिनीचे क्षेत्र",
    seedRequired: "आवश्यक बियाणे",
    fertUrea: "खत (युरिया)",
    waterReq: "आवश्यक पाणी",
    farmCost: "शेती खर्च",
    expYield: "अपेक्षित उत्पादन",
    expRevenue: "अपेक्षित महसूल",
    expProfit: "अपेक्षित निव्वळ नफा",
    estRoi: "अंदाजित ROI",
    group_overview: "📊 विहंगावलोकन",
    group_basics: "🌾 शेतीची माहिती",
    group_resources: "💧 संसाधने",
    group_operations: "⚙️ शेतीची कामे",
    group_economics: "💰 आर्थिक हिशोब",
    group_advanced: "📊 प्रगत",
    group_settings: "⚙️ सेटिंग्ज",
    group_history: "🕐 इतिहास",
    nav_dashboard: "डैशबोर्ड",
    nav_area: "जमिनीचे क्षेत्र",
    nav_seed: "बियाणे प्रमाण",
    nav_fertilizer: "खते NPK",
    nav_irrigation: "सिंचन पाणी",
    nav_solar_pump: "सोलर पंप",
    nav_drip_calc: "ठिबक सिंचन",
    nav_spray: "कीटकनाशक फवारणी",
    nav_organic_calc: "सेंद्रिय इनपुट",
    nav_labour: "मजुरी खर्च",
    nav_machinery: "यंत्रसामग्री भाडे",
    nav_polyhouse: "पॉलीहाउस",
    nav_cattle_fodder: "गुरांचे खाद्य व डेअरी",
    nav_farmcost: "एकूण शेती खर्च",
    nav_profit: "पिकाचा निव्वळ नफा",
    nav_breakeven: "ब्रेक-इव्हन किंमत",
    nav_loan: "शेती कर्ज EMI",
    nav_roi: "ROI विश्लेषण",
    nav_crop_compare: "पिकांची तुलना",
    nav_mandi_profit: "मोंडी निव्वळ दर",
    nav_storage: "साठवणूक गोदाम",
    nav_multicrop: "बहु-पीक शेती",
  },
  bn: {
    title: "সমন্বিত কৃষি ক্যালকুলেটর",
    subtitle: "বীজের পরিমাণ, সারের NPK মাত্রা, স্প্রে করার খরচ, যন্ত্রপাতির ভাড়া এবং মোট ROI অনুমান করুন।",
    printSheet: "🖨️ খরচের হিসাব প্রিন্ট করুন",
    save: "💾 সংরক্ষণ করুন",
    history: "🕐 ইতিহাস",
    quickLand: "জমির পরিমাণ:",
    selectCrop: "ফসল নির্বাচন করুন:",
    allCalculators: "সমস্ত ক্যালকুলেটর",
    reset: "রিসেট করুন",
    calculate: "গণনা করুন",
    settings: "অ্যাডমিন সেটিংস",
    dashboard: "খামার ড্যাশবোর্ড",
    smartInsights: "স্মার্ট পরামর্শ",
    disclaimer: "দাবি ত্যাগ: সমস্ত গণনা আনুমানিক।",
    voiceActive: "শুনছে...",
    voiceHint: "মাইক চেপে সংখ্যা বলুন",
    loadCalculated: "মান লোড করুন",
    formula: "ব্যবহৃত সূত্র:",
    successSave: "সফলভাবে সংরক্ষিত হয়েছে!",
    landArea: "জমির আয়তন",
    seedRequired: "প্রয়োজনীয় বীজ",
    fertUrea: "সার (ইউরিয়া)",
    waterReq: "প্রয়োজনীয় জল",
    farmCost: "খামারের খরচ",
    expYield: "প্রত্যাশিত ফলন",
    expRevenue: "প্রত্যাশিত আয়",
    expProfit: "প্রত্যাশিত নিট লাভ",
    estRoi: "আনুমানিক ROI",
    group_overview: "📊 সংক্ষিপ্তসার",
    group_basics: "🌾 খামারের প্রাথমিক তথ্য",
    group_resources: "💧 উপকরণ",
    group_operations: "⚙️ খামারের কাজকর্ম",
    group_economics: "💰 আর্থিক হিসাব",
    group_advanced: "📊 উন্নত",
    group_settings: "⚙️ সেটিংস",
    group_history: "🕐 ইতিহাস",
    nav_dashboard: "ড্যাশবোর্ড",
    nav_area: "জমির আয়তন",
    nav_seed: "বীজের হার",
    nav_fertilizer: "সার NPK",
    nav_irrigation: "সেচের জল",
    nav_solar_pump: "সোলার পাম্প",
    nav_drip_calc: "ড্রিপ সিস্টেম",
    nav_spray: "কীটনাশক স্প্রে",
    nav_organic_calc: "জৈব উপকরণ",
    nav_labour: "শ্রমিকের খরচ",
    nav_machinery: "যন্ত্রপাতির ভাড়া",
    nav_polyhouse: "পলিহাউস",
    nav_cattle_fodder: "গবাদি পশু ও ডেয়ারি",
    nav_farmcost: "খামারের মোট খরচ",
    nav_profit: "ফসলের নিট লাভ",
    nav_breakeven: "সমতা মূল্য",
    nav_loan: "কৃষি ঋণ ইএমআই",
    nav_roi: "ROI বিশ্লেষণ",
    nav_crop_compare: "ফসলের তুলনা",
    nav_mandi_profit: "মান্ডির নিট দর",
    nav_storage: "গুদামজাতকরণ",
    nav_multicrop: "বহু-ফসলী খামার",
  },
  gu: {
    title: "સંકલિત કૃષિ કેલ્ક્યુલેટર",
    subtitle: "બીજનું પ્રમાણ, ખાતર NPK ડોઝ, સ્પ્રે ખર્ચ, મશીનરી ભાડું અને કુલ ROI નો અંદાજ લગાવો।",
    printSheet: "🖨️ ખર્ચ પત્રક પ્રિન્ટ કરો",
    save: "💾 સાચવો",
    history: "🕐 ઈતિહાસ",
    quickLand: "જમીનનું માપ:",
    selectCrop: "પાક પસંદ કરો:",
    allCalculators: "તમામ કેલ્ક્યુલેટર",
    reset: "રીસેટ કરો",
    calculate: "ગણતરી કરો",
    settings: "એડમિન સેટિંગ્સ",
    dashboard: "ફાર્મ ડેશબોર્ડ",
    smartInsights: "સ્માર્ટ સલાહ",
    disclaimer: "અસ્વીકરણ: તમામ ગણતરીઓ અંદાજિત છે.",
    voiceActive: "સાંભળી રહ્યું છે...",
    voiceHint: "માઈક દબાવીને સંખ્યા બોલો",
    loadCalculated: "કિંમતો લોડ કરો",
    formula: "વપરાયેલ સૂત્ર:",
    successSave: "સફળતાપૂર્વક સચવાયું!",
    landArea: "જમીનનું ક્ષેત્રફળ",
    seedRequired: "જરૂરી બીજ",
    fertUrea: "ખાતર (યુરિયા)",
    waterReq: "જરૂરી પાણી",
    farmCost: "ફાર્મ ખર્ચ",
    expYield: "અપેક્ષિત ઉપજ",
    expRevenue: "અપેક્ષિત આવક",
    expProfit: "અપેક્ષિત ચોખ્ખો નફો",
    estRoi: "અંદાજિત ROI",
    group_overview: "📊 વિહંગાવલોકન",
    group_basics: "🌾 ફાર્મ મૂળભૂત વિગતો",
    group_resources: "💧 સંસાધનો",
    group_operations: "⚙️ ફાર્મ કામગીરી",
    group_economics: "💰 નાણાકીય હિસાબ",
    group_advanced: "📊 એડવાન્સ્ડ",
    group_settings: "⚙️ સેટિંગ્સ",
    group_history: "🕐 ઈતિહાસ",
    nav_dashboard: "ડેશબોર્ડ",
    nav_area: "જમીનનું ક્ષેત્રફળ",
    nav_seed: "બીજનો દર",
    nav_fertilizer: "ખાતર NPK",
    nav_irrigation: "સિંચાઈ પાણી",
    nav_solar_pump: "સોલર પંપ",
    nav_drip_calc: "ડ્રિપ સિસ્ટમ",
    nav_spray: "જંતુનાશક સ્પ્રે",
    nav_organic_calc: "જૈવિક ઇનપુટ",
    nav_labour: "મજૂરી ખર્ચ",
    nav_machinery: "મશીનરી ભાડું",
    nav_polyhouse: "પોલીહાઉસ",
    nav_cattle_fodder: "પશુ અને ડેરી",
    nav_farmcost: "ફાર્મ ખર્ચ પત્રક",
    nav_profit: "પાકનો ચોખ્ખો નફો",
    nav_breakeven: "બ્રેક-ઈવન કિંમત",
    nav_loan: "કૃષિ લોન EMI",
    nav_roi: "ROI વિશ્લેષણ",
    nav_crop_compare: "પાકની સરખામણી",
    nav_mandi_profit: "માર્કેટ યાર્ડ ચોખ્ખો ભાવ",
    nav_storage: "સંગ્રહ ગોડાઉન",
    nav_multicrop: "બહુ-પાક ફાર્મ",
  },
  or: {
    title: "ସମନ୍ୱିତ କୃଷି କ୍ୟାଲକୁଲେଟର",
    subtitle: "ବିହନ ପରିମାଣ, ସାର NPK ମାତ୍ରା, ସ୍ପ୍ରେ ଖର୍ଚ୍ଚ, ଯନ୍ତ୍ରପାତି ଭଡା ଏବଂ ମୋଟ ROI ଆକଳନ କରନ୍ତୁ।",
    printSheet: "🖨️ ଖର୍ଚ୍ଚ ତାଲିକା ପ୍ରିଣ୍ଟ କରନ୍ତୁ",
    save: "💾 ସଂରକ୍ଷଣ କରନ୍ତୁ",
    history: "🕐 ଇତିହାସ",
    quickLand: "ଜମିର ଆକାର:",
    selectCrop: "ଫସଲ ବାଛନ୍ତୁ:",
    allCalculators: "ସମସ୍ତ କ୍ୟାଲକୁଲେଟର",
    reset: "ରିସେଟ୍ କରନ୍ତୁ",
    calculate: "ହିସାବ କରନ୍ତୁ",
    settings: "ଆଡମିନ୍ ସେଟିଙ୍ଗ୍",
    dashboard: "କ୍ଷେତ ଡ୍ୟାସବୋର୍ଡ",
    smartInsights: "ସ୍ମାର୍ଟ ପରାମର୍ଶ",
    disclaimer: "ଅସ୍ବୀକାର: ସମସ୍ତ ହିସାବ ଆକଳନ ଅଟେ।",
    voiceActive: "ଶୁଣୁଛି...",
    voiceHint: "ମାଇକ୍ ଚାପି ସଂଖ୍ୟା କୁହନ୍ତୁ",
    loadCalculated: "ମୂଲ୍ୟ ଲୋଡ୍ କରନ୍ତୁ",
    formula: "ବ୍ୟବହୃତ ସୂତ୍ର:",
    successSave: "ସଫଳତାର ସହ ସଂରକ୍ଷିତ ହେଲା!",
    landArea: "ଜମିର କ୍ଷେତ୍ରଫଳ",
    seedRequired: "ଆବଶ୍ୟକ ବିହନ",
    fertUrea: "ସାର (ୟୁରିଆ)",
    waterReq: "ଆବଶ୍ୟକ ଜଳ",
    farmCost: "କ୍ଷେତ ଖର୍ଚ୍ଚ",
    expYield: "ଆଶାକରାଯାଉଥିବା ଅମଳ",
    expRevenue: "ଆଶାକରାଯାଉଥିବା ଆୟ",
    expProfit: "ଆଶାକରାଯାଉଥିବା ଲାଭ",
    estRoi: "ଆକଳନ କରାଯାଇଥିବା ROI",
    group_overview: "📊 ସଂକ୍ଷିପ୍ତ ବିବରଣୀ",
    group_basics: "🌾 କ୍ଷେତ ମୌଳିକ ତଥ୍ୟ",
    group_resources: "💧 ସମ୍ବଳ",
    group_operations: "⚙️ କ୍ଷେତ କାର୍ଯ୍ୟ",
    group_economics: "💰 ଆର୍ଥିକ ହିସାବ",
    group_advanced: "📊 ଉନ୍ନତ",
    group_settings: "⚙️ ସେଟିଙ୍ଗ୍",
    group_history: "🕐 ଇତିହାସ",
    nav_dashboard: "ଡ୍ୟାସବୋର୍ଡ",
    nav_area: "ଜମିର କ୍ଷେତ୍ରଫଳ",
    nav_seed: "ବିହନ ଦର",
    nav_fertilizer: "ସାର NPK",
    nav_irrigation: "ଜଳସେଚନ ଜଳ",
    nav_solar_pump: "ସୋଲାର ପମ୍ପ",
    nav_drip_calc: "ଡ୍ରିପ ସିଷ୍ଟମ",
    nav_spray: "କୀଟନାଶକ ସ୍ପ୍ରେ",
    nav_organic_calc: "ଜୈବିକ ଇନପୁଟ୍",
    nav_labour: "ମଜୁରୀ ଖର୍ଚ୍ଚ",
    nav_machinery: "ଯନ୍ତ୍ରପାତି ଭଡା",
    nav_polyhouse: "ପଲିହାଉସ",
    nav_cattle_fodder: "ଗୋପାଳନ ଏବଂ ଡେରୀ",
    nav_farmcost: "ମୋଟ ଖର୍ଚ୍ଚ ତାଲିକା",
    nav_profit: "ଫସଲର ନିଟ୍ ଲାଭ",
    nav_breakeven: "ବ୍ରେକ୍-ଇଭେନ୍ ମୂଲ୍ୟ",
    nav_loan: "କୃଷି ଋଣ EMI",
    nav_roi: "ROI ବିଶ୍ଳେଷଣ",
    nav_crop_compare: "ଫସଲ ତୁଳନା",
    nav_mandi_profit: "ମଣ୍ଡି ନିଟ୍ ଦର",
    nav_storage: "ସଂରକ୍ଷଣ ଗୋଦାମ",
    nav_multicrop: "ବହୁ-ଫସଲ କ୍ଷେତ",
  }
};

// Translation helper
function t(key, lang = 'en') {
  if (CALC_LANG[lang] && CALC_LANG[lang][key]) return CALC_LANG[lang][key];
  if (CALC_LANG.en && CALC_LANG.en[key]) return CALC_LANG.en[key];
  return key;
}

const C = {
  green: 'var(--primary-light)', blue: '#60a5fa', amber: '#f59e0b',
  red: '#ef4444', purple: '#a855f7', cyan: '#06b6d4', rose: '#f43f5e'
};

const NAV = [
  { id: 'dashboard',    icon: '📊', label: 'Dashboard',       group: 'overview' },
  { id: 'area',         icon: '📐', label: 'Land Area & Units',group: 'basics'   },
  { id: 'seed',         icon: '🌱', label: 'Seed Rate',       group: 'basics'   },
  { id: 'fertilizer',   icon: '🧪', label: 'Fertilizer NPK',  group: 'basics'   },
  { id: 'irrigation',   icon: '💧', label: 'Water & Pump',    group: 'resources'},
  { id: 'solar_pump',   icon: '⚡', label: 'Solar Pump (KUSUM)',group: 'resources'},
  { id: 'drip_calc',    icon: '🌧️', label: 'Drip System',     group: 'resources'},
  { id: 'spray',        icon: '🔫', label: 'Pesticide/Spray', group: 'resources'},
  { id: 'organic_calc', icon: '🍃', label: 'Organic Inputs',  group: 'resources'},
  { id: 'labour',       icon: '👷', label: 'Labour Cost',     group: 'operations'},
  { id: 'machinery',    icon: '🚜', label: 'Machinery Rental',group: 'operations'},
  { id: 'polyhouse',    icon: '🏛️', label: 'Polyhouse/Greenhouse',group: 'operations'},
  { id: 'cattle_fodder',icon: '🐄', label: 'Cattle & Dairy',  group: 'operations'},
  { id: 'farmcost',     icon: '🧾', label: 'Farm Cost Sheet', group: 'economics'},
  { id: 'profit',       icon: '💰', label: 'Crop Net Profit', group: 'economics'},
  { id: 'breakeven',    icon: '⚖️', label: 'Break-Even Price',group: 'economics'},
  { id: 'loan',         icon: '🏦', label: 'Krishi Loan EMI', group: 'economics'},
  { id: 'roi',          icon: '📈', label: 'ROI Analysis',    group: 'economics'},
  { id: 'crop_compare', icon: '🆚', label: 'Crop Comparison', group: 'advanced' },
  { id: 'mandi_profit', icon: '🏪', label: 'Mandi Net Price', group: 'advanced' },
  { id: 'storage',      icon: '🏗️', label: 'Storage/Warehouse',group: 'advanced' },
  { id: 'multicrop',    icon: '🗺️', label: 'Multi-Crop Farm', group: 'advanced' },
  { id: 'settings',     icon: '⚙️', label: 'Admin Settings',  group: 'settings'  },
  { id: 'history',      icon: '🕐', label: 'Saved Calcs',     group: 'history'  },
];

const GROUP_LABELS = {
  overview: { label: 'Overview', color: C.cyan },
  basics:   { label: '🌾 Farm Basics', color: C.green },
  resources:{ label: '💧 Resources', color: C.blue },
  operations:{ label: '⚙️ Operations', color: C.amber },
  economics:{ label: '💰 Economics', color: C.purple },
  advanced: { label: '📊 Advanced', color: C.rose },
  settings: { label: '⚙️ Config', color: '#94a3b8' },
  history:  { label: '🕐 History', color: '#64748b' },
};

// ── Shared UI Components ──────────────────────────────────────────────────────

function Label({ children, hint, lang = 'en' }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{children}</span>
      {hint && <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginLeft: 6 }}>({hint})</span>}
    </div>
  );
}

// Voice enabled input field
function InputWithVoice({ value, onChange, type = 'number', min = '0', step = '0.1', placeholder, style, label, hint, resetValue, lang = 'en' }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser. Please use Chrome/Edge.");
      return;
    }
    
    setListening(true);
    const rec = new SpeechRecognition();
    rec.lang = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      const num = text.replace(/[^0-9.]/g, '');
      if (num) {
        onChange(parseFloat(num));
      } else {
        console.warn("Could not extract digits from voice input:", text);
      }
      setListening(false);
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    
    recognitionRef.current = rec;
    rec.start();
  };

  const warnClass = value < 0 ? C.red : (value > 5000000 ? C.amber : 'transparent');

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Label hint={hint} lang={lang}>{label}</Label>
        <div style={{ display: 'flex', gap: 6 }}>
          {resetValue !== undefined && (
            <button 
              onClick={() => onChange(resetValue)} 
              title={CALC_LANG[lang].reset} 
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.72rem' }}
            >
              🔄
            </button>
          )}
          <button
            onClick={startVoiceInput}
            title={listening ? CALC_LANG[lang].voiceActive : CALC_LANG[lang].voiceHint}
            style={{
              background: listening ? C.red : 'rgba(255,255,255,0.06)',
              border: listening ? 'none' : '1px solid rgba(255,255,255,0.12)',
              borderRadius: 6, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', fontSize: '0.7rem'
            }}
          >
            🎙️
          </button>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type={type} value={value} onChange={e => {
            const v = type === 'number' ? Math.max(0, parseFloat(e.target.value) || 0) : e.target.value;
            onChange(v);
          }}
          min={min} step={step} placeholder={placeholder}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 10,
            background: 'rgba(255,255,255,0.06)', 
            border: `1px solid ${warnClass !== 'transparent' ? warnClass : 'rgba(255,255,255,0.12)'}`,
            color: '#fff', fontSize: '0.92rem', boxSizing: 'border-box', ...style
          }}
        />
        {listening && (
          <span style={{ position: 'absolute', right: 10, top: 10, fontSize: '0.7rem', color: C.red, animation: 'pulse 1s infinite' }}>
            ● Rec
          </span>
        )}
      </div>
      {value > 1000000 && (
        <span style={{ fontSize: '0.68rem', color: C.amber }}>⚠️ Unusually high value entered. Please double check.</span>
      )}
    </div>
  );
}

function Select({ value, onChange, children, style }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', padding: '10px 12px', borderRadius: 10,
        background: 'rgba(20,28,22,0.98)', border: '1px solid rgba(255,255,255,0.12)',
        color: '#fff', fontSize: '0.92rem', boxSizing: 'border-box', cursor: 'pointer', ...style
      }}>
      {children}
    </select>
  );
}

function CropSelect({ value, onChange, cropData, lang = 'en' }) {
  return (
    <Select value={value} onChange={onChange}>
      {Object.entries(cropData).map(([k, v]) => {
        const cropName = lang === 'hi' && v.nameHi ? `${v.icon} ${v.nameHi}` : `${v.icon} ${v.name}`;
        return <option key={k} value={k}>{cropName}</option>;
      })}
    </Select>
  );
}

function UnitSelect({ value, onChange }) {
  return (
    <Select value={value} onChange={onChange}>
      {Object.entries(UNIT_NAMES).map(([k, v]) => (
        <option key={k} value={k}>{v}</option>
      ))}
    </Select>
  );
}

function getNavItems(lang) {
  return [
    { id: 'dashboard',    icon: '📊', label: t('nav_dashboard', lang),       group: 'overview' },
    { id: 'area',         icon: '📐', label: t('nav_area', lang),            group: 'basics'   },
    { id: 'seed',         icon: '🌱', label: t('nav_seed', lang),            group: 'basics'   },
    { id: 'fertilizer',   icon: '🧪', label: t('nav_fertilizer', lang),      group: 'basics'   },
    { id: 'irrigation',   icon: '💧', label: t('nav_irrigation', lang),      group: 'resources'},
    { id: 'solar_pump',   icon: '⚡', label: t('nav_solar_pump', lang),      group: 'resources'},
    { id: 'drip_calc',    icon: '🌧️', label: t('nav_drip_calc', lang),       group: 'resources'},
    { id: 'spray',        icon: '🔫', label: t('nav_spray', lang),           group: 'resources'},
    { id: 'organic_calc', icon: '🍃', label: t('nav_organic_calc', lang),    group: 'resources'},
    { id: 'labour',       icon: '👷', label: t('nav_labour', lang),          group: 'operations'},
    { id: 'machinery',    icon: '🚜', label: t('nav_machinery', lang),       group: 'operations'},
    { id: 'polyhouse',    icon: '🏛️', label: t('nav_polyhouse', lang),       group: 'operations'},
    { id: 'cattle_fodder',icon: '🐄', label: t('nav_cattle_fodder', lang),   group: 'operations'},
    { id: 'farmcost',     icon: '🧾', label: t('nav_farmcost', lang),        group: 'economics'},
    { id: 'profit',       icon: '💰', label: t('nav_profit', lang),          group: 'economics'},
    { id: 'breakeven',    icon: '⚖️', label: t('nav_breakeven', lang),       group: 'economics'},
    { id: 'loan',         icon: '🏦', label: t('nav_loan', lang),            group: 'economics'},
    { id: 'roi',          icon: '📈', label: t('nav_roi', lang),             group: 'economics'},
    { id: 'crop_compare', icon: '🆚', label: t('nav_crop_compare', lang),    group: 'advanced' },
    { id: 'mandi_profit', icon: '🏪', label: t('nav_mandi_profit', lang),    group: 'advanced' },
    { id: 'storage',      icon: '🏗️', label: t('nav_storage', lang),         group: 'advanced' },
    { id: 'multicrop',    icon: '🗺️', label: t('nav_multicrop', lang),       group: 'advanced' },
    { id: 'settings',     icon: '⚙️', label: t('nav_settings', lang),        group: 'settings'  },
    { id: 'history',      icon: '🕐', label: t('nav_history', lang),         group: 'history'  },
  ];
}

function getGroupLabels(lang) {
  return {
    overview:   { label: t('group_overview', lang), color: C.cyan },
    basics:     { label: t('group_basics', lang), color: C.green },
    resources:  { label: t('group_resources', lang), color: C.blue },
    operations: { label: t('group_operations', lang), color: C.amber },
    economics:  { label: t('group_economics', lang), color: C.purple },
    advanced:   { label: t('group_advanced', lang), color: C.rose },
    settings:   { label: t('group_settings', lang), color: '#94a3b8' },
    history:    { label: t('group_history', lang), color: '#64748b' },
  };
}



function FormRow({ label, hint, children, onReset }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Label hint={hint}>{label}</Label>
        {onReset && (
          <button onClick={onReset} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.72rem' }}>
            🔄
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function ResultCard({ label, value, sub, color = C.green, icon }) {
  return (
    <div style={{
      background: `${color}12`, border: `1px solid ${color}28`,
      borderRadius: 12, padding: '12px 16px', textAlign: 'center',
      transition: 'transform 0.2s', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', right: -6, top: -6, fontSize: '2.5rem', opacity: 0.05 }}>{icon}</div>
      {icon && <div style={{ fontSize: '1.4rem', marginBottom: 2 }}>{icon}</div>}
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: '1.25rem', fontWeight: 800, color }}>{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function BigResult({ label, value, color = C.green, sub }) {
  return (
    <div style={{
      background: `${color}12`, border: `1px solid ${color}30`,
      borderRadius: 14, padding: '16px 20px', marginBottom: 12
    }}>
      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 900, color }}>{value}</div>
      {sub && <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function PanelHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem' }}>
      <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '1.4rem' }}>{icon}</span> {title}
      </h3>
      {subtitle && <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>{subtitle}</p>}
    </div>
  );
}

function Disclaimer({ text, lang = 'en' }) {
  return (
    <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, padding: '8px 12px', marginTop: 12 }}>
      <p style={{ margin: 0, fontSize: '0.72rem', color: '#fbbf24', lineHeight: 1.6 }}>
        ⚠️ {text || t('disclaimer', lang)}
      </p>
    </div>
  );
}

function Grid({ cols = 2, children, style }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10, ...style }}>
      {children}
    </div>
  );
}

// ── CALCULATOR SUB-PANELS ─────────────────────────────────────────────────────

// 1. Dashboard
function DashboardPanel({ gs, cropData, lang = 'en' }) {
  const acres = toAcres(gs.area, gs.unit);
  const crop  = cropData[gs.crop] || cropData.wheat;
  const seed  = calcSeed(gs.crop, acres, 0, 0);
  const fert  = calcFertilizer(gs.crop, acres, 'balanced', 'medium');
  const irrig = calcIrrigation(gs.crop, acres, 'drip', null);
  const expectedRevenue = crop.yieldQtlAcre * acres * (crop.msp || 2000);
  const totalCost = crop.typicalCostAcre * acres;
  const { profit, roi } = calcROI(totalCost, expectedRevenue);

  const cropTitle = lang === 'hi' && crop.nameHi ? crop.nameHi : crop.name;

  const cards = [
    { icon: '📐', label: t('landArea', lang),         value: `${gs.area} ${gs.unit}`, sub: `= ${fmt(acres, 2)} acres`, color: C.cyan },
    { icon: '🌱', label: t('seedRequired', lang),     value: seed.qty < 1 ? `${fmt(seed.qty * 1000)} g` : `${fmt(seed.qty, 1)} kg`, sub: cropTitle, color: C.green },
    { icon: '🧪', label: t('fertUrea', lang),         value: `${fert.ureaBags} bags`, sub: `+ ${fert.dapBags} DAP + ${fert.mopBags} MOP`, color: C.amber },
    { icon: '💧', label: t('waterReq', lang),         value: `${fmt(irrig.totalLit / 1000)} KL`, sub: `${irrig.cycles} irrigations`, color: C.blue },
    { icon: '💰', label: t('farmCost', lang),         value: `₹${fmt(totalCost)}`, sub: `₹${fmt(crop.typicalCostAcre)}/acre`, color: C.purple },
    { icon: '📦', label: t('expYield', lang),         value: `${fmt(crop.yieldQtlAcre * acres, 1)} qtl`, sub: `${crop.yieldQtlAcre} qtl/acre`, color: C.green },
    { icon: '📈', label: t('expRevenue', lang),       value: `₹${fmt(expectedRevenue)}`, sub: crop.msp ? `@MSP ₹${crop.msp}/qtl` : 'At typical price', color: C.cyan },
    { icon: '💵', label: t('expProfit', lang),        value: `₹${fmt(profit)}`, sub: profit >= 0 ? '🟢 Profitable' : '🔴 Loss', color: profit >= 0 ? C.green : C.red },
    { icon: '📊', label: t('estRoi', lang),           value: `${fmt(roi, 1)}%`, sub: roi >= 20 ? '🌟 Good return' : 'Moderate', color: roi >= 20 ? C.green : C.amber },
  ];

  return (
    <div>
      <PanelHeader icon="📊" title={t('dashboard', lang)} subtitle={`Quick estimation summary for ${crop.icon} ${cropTitle} on ${gs.area} ${gs.unit}`} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {cards.map(c => <ResultCard key={c.label} icon={c.icon} label={c.label} value={c.value} sub={c.sub} color={c.color} />)}
      </div>
      <div style={{ marginTop: 16 }}>
        <h4 style={{ color: C.green, marginBottom: 8, fontSize: '0.9rem' }}>💡 {t('smartInsights', lang)}</h4>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 14, fontSize: '0.82rem', lineHeight: 1.7 }}>
          <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Based on your land size, seed rate calculation indicates you will need approximately <strong>{seed.qty.toFixed(1)} kg</strong> of seed.</li>
            <li>Recommended base fertilizer expense sits at around <strong>₹{fert.totalCost.toLocaleString('en-IN')}</strong> using balanced application.</li>
            <li>Expected break-even market price for this yield and cost structure is approximately <strong>₹{(totalCost / (crop.yieldQtlAcre * acres || 1)).toFixed(0)}/Quintal</strong>.</li>
            <li>Machinery rental is estimated to be cheaper than outright purchasing machinery for this land size of {gs.area} {gs.unit}.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// 2. Area Calculator
function AreaPanel({ gs, setGs, lang }) {
  const [len, setLen] = useState(100);
  const [wid, setWid] = useState(100);
  const [dimUnit, setDimUnit] = useState('feet');
  const [useDimensions, setUseDimensions] = useState(true);

  // Conversion rates (sq ft to other units)
  const conversionRates = {
    sqft: 1,
    sqm: 10.7639,
    acre: 43560,
    hectare: 107639,
    guntha: 1089,
    bigha_pucca: 27225,
    bigha_kacha: 9075
  };

  let sqFt = 0;
  if (useDimensions) {
    const rawArea = len * wid;
    if (dimUnit === 'feet') sqFt = rawArea;
    else if (dimUnit === 'meters') sqFt = rawArea * 10.7639;
    else if (dimUnit === 'gaj') sqFt = rawArea * 9;
    else if (dimUnit === 'karam') sqFt = rawArea * 30.25; // 1 karam x 1 karam = 5.5 x 5.5 = 30.25 sq ft
  } else {
    sqFt = gs.area * (conversionRates[gs.unit] || 43560);
  }

  const acres = sqFt / 43560;
  const hectares = sqFt / 107639;
  const sqMeters = sqFt / 10.7639;
  const gunthas = sqFt / 1089;
  const bighaPucca = sqFt / 27225;
  const bighaKacha = sqFt / 9075;

  const handleApply = () => {
    setGs(p => ({ ...p, area: parseFloat(acres.toFixed(2)), unit: 'acre' }));
  };

  return (
    <div>
      <PanelHeader icon="📐" title="Crop Area Calculator" subtitle="Calculate field area and convert between regional units" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button 
              onClick={() => setUseDimensions(true)} 
              style={{
                flex: 1, padding: 8, borderRadius: 8, border: 'none',
                background: useDimensions ? C.green : 'rgba(255,255,255,0.05)',
                color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem'
              }}
            >
              📏 Enter Dimensions
            </button>
            <button 
              onClick={() => setUseDimensions(false)} 
              style={{
                flex: 1, padding: 8, borderRadius: 8, border: 'none',
                background: !useDimensions ? C.green : 'rgba(255,255,255,0.05)',
                color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem'
              }}
            >
              📍 Enter Direct Area
            </button>
          </div>

          {useDimensions ? (
            <>
              <InputWithVoice label="Land Length" value={len} onChange={setLen} resetValue={100} lang={lang} />
              <InputWithVoice label="Land Width" value={wid} onChange={setWid} resetValue={100} lang={lang} />
              <FormRow label="Dimension Unit">
                <Select value={dimUnit} onChange={setDimUnit}>
                  <option value="feet">Feet (फुट)</option>
                  <option value="meters">Meters (मीटर)</option>
                  <option value="gaj">Gaj/Yards (गज)</option>
                  <option value="karam">Karam (करम)</option>
                </Select>
              </FormRow>
            </>
          ) : (
            <>
              <InputWithVoice label="Direct Land Area" value={gs.area} onChange={v => setGs(p => ({ ...p, area: v }))} resetValue={1} lang={lang} />
              <FormRow label="Area Unit">
                <UnitSelect value={gs.unit} onChange={v => setGs(p => ({ ...p, unit: v }))} />
              </FormRow>
            </>
          )}

          {useDimensions && (
            <button 
              onClick={handleApply} 
              style={{
                width: '100%', padding: '10px 14px', background: C.green,
                color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
                fontWeight: 700, fontSize: '0.85rem', marginTop: 10
              }}
            >
              Apply to Global State ({acres.toFixed(2)} Acres)
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ResultCard label="Total Area (Acres)" value={`${acres.toFixed(3)} acres`} color={C.green} />
          <ResultCard label="Hectares" value={`${hectares.toFixed(3)} ha`} color={C.blue} />
          <ResultCard label="Square Meters" value={`${fmt(sqMeters)} sq m`} color={C.cyan} />
          <ResultCard label="Square Feet" value={`${fmt(sqFt)} sq ft`} color={C.amber} />
          <ResultCard label="Guntha" value={`${gunthas.toFixed(2)} gunthas`} color={C.purple} />
          <Grid cols={2}>
            <ResultCard label="Bigha (Pucca)" value={`${bighaPucca.toFixed(2)}`} color={C.rose} />
            <ResultCard label="Bigha (Kacha)" value={`${bighaKacha.toFixed(2)}`} color={C.rose} />
          </Grid>
        </div>
      </div>
    </div>
  );
}

// 3. Seed Requirement Calculator
function SeedPanel({ gs, setGs, cropData, lang }) {
  const [crop, setCrop] = useState(gs.crop);
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [customRate, setCustomRate] = useState('');
  const [priceKg, setPriceKg] = useState(90);

  const acres = toAcres(area, unit);
  const cropInfo = cropData[crop] || cropData.wheat;
  const recommendedRate = customRate ? parseFloat(customRate) : cropInfo.seedRateKgAcre;
  const totalSeed = recommendedRate * acres;
  const totalCost = totalSeed * priceKg;

  // Sync to global context on save
  const handleApply = () => {
    setGs(p => ({ ...p, crop, area: parseFloat(area), unit }));
  };

  return (
    <div>
      <PanelHeader icon="🌱" title="Seed Requirement Calculator" subtitle="Determine optimal seed quantities and costs based on acreage" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
          <FormRow label="Land Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          <InputWithVoice 
            label="Recommended Seed Rate (kg/acre)" 
            hint={`Default: ${cropInfo.seedRateKgAcre} kg`} 
            value={customRate || cropInfo.seedRateKgAcre} 
            onChange={setCustomRate} 
            resetValue={cropInfo.seedRateKgAcre} 
            lang={lang} 
          />
          <InputWithVoice label="Seed Price (₹/kg)" value={priceKg} onChange={setPriceKg} resetValue={90} lang={lang} />
          <button 
            onClick={handleApply} 
            style={{
              width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 10,
              cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', marginTop: 10
            }}
          >
            Apply to Global Farm State
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Total Seed Required" value={`${totalSeed.toFixed(1)} kg`} color={C.green} sub={`Rate per unit: ${recommendedRate} kg/acre`} />
          <BigResult label="Estimated Seed Cost" value={`₹${fmt(totalCost)}`} color={C.amber} />
          <ResultCard label="Formula Used" value="Seed Rate × Acres" sub="Rounded up for safety margin" color={C.blue} />
          <Disclaimer text="Ensure seed has a germination rate of 85%+. Adjust seed rates if using broadcasting vs. line-sowing methods." />
        </div>
      </div>
    </div>
  );
}

// 4. Fertilizer Panel
function FertilizerPanel({ gs, fertilizerData, cropData, lang }) {
  const [crop, setCrop] = useState(gs.crop);
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [soilType, setSoilType] = useState('medium');
  const [growthStage, setGrowthStage] = useState('vegetative');
  const [fertilizerType, setFertilizerType] = useState('urea_dap_mop');

  const acres = toAcres(area, unit);
  const cropInfo = cropData[crop] || cropData.wheat;

  // Modifiers based on stage and soil type
  const soilModifier = { sandy: 1.2, loamy: 1.0, medium: 1.0, clay: 0.85, black: 0.8 }[soilType] || 1.0;
  const stageModifier = { sowing: 0.4, vegetative: 1.0, flowering: 0.6, maturity: 0.1 }[growthStage] || 1.0;

  const nReq = cropInfo.npkAcre.N * acres * soilModifier * stageModifier;
  const pReq = cropInfo.npkAcre.P * acres * soilModifier * stageModifier;
  const kReq = cropInfo.npkAcre.K * acres * soilModifier * stageModifier;

  let qtyMessage = "";
  let estCost = 0;

  if (fertilizerType === 'urea_dap_mop') {
    const ureaBags = Math.ceil(nReq / 23); // 46% of 50kg bag
    const dapBags = Math.ceil(pReq / 23);  // 46% of 50kg bag
    const mopBags = Math.ceil(kReq / 30);  // 60% of 50kg bag
    estCost = (ureaBags * fertilizerData.urea.pricePerBag) + (dapBags * fertilizerData.dap.pricePerBag) + (mopBags * fertilizerData.mop.pricePerBag);
    qtyMessage = `${ureaBags} Bags Urea + ${dapBags} Bags DAP + ${mopBags} Bags MOP`;
  } else if (fertilizerType === 'ssp_urea') {
    const sspBags = Math.ceil(pReq / 8); // 16% of 50kg bag
    const ureaBags = Math.ceil(nReq / 23);
    estCost = (sspBags * fertilizerData.ssp.pricePerBag) + (ureaBags * fertilizerData.urea.pricePerBag);
    qtyMessage = `${sspBags} Bags SSP + ${ureaBags} Bags Urea`;
  } else {
    // NPK Mixture
    const npkBags = Math.ceil(Math.max(nReq, pReq, kReq) / 16);
    estCost = npkBags * fertilizerData.npk_mix.pricePerBag;
    qtyMessage = `${npkBags} Bags NPK 12-32-16 Mixture`;
  }

  return (
    <div>
      <PanelHeader icon="🧪" title="Fertilizer Requirement Calculator" subtitle="Determine standard NPK weights and corresponding fertilizer bags" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
          <FormRow label="Land Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          <FormRow label="Soil Type">
            <Select value={soilType} onChange={setSoilType}>
              <option value="sandy">Sandy (ಮರಳು ಮಣ್ಣು / रेतीली)</option>
              <option value="loamy">Loamy (ಜೀವೋಡ ಮಣ್ಣು / दोमट)</option>
              <option value="medium">Medium (ಮಧ್ಯಮ ಮಣ್ಣು / मध्यम)</option>
              <option value="clay">Clay (ಜೇಡಿಮಣ್ಣು / चिकनी)</option>
              <option value="black">Black Soil (ಕರಿ ಮಣ್ಣು / काली मिट्टी)</option>
            </Select>
          </FormRow>
          <FormRow label="Growth Stage">
            <Select value={growthStage} onChange={setGrowthStage}>
              <option value="sowing">Sowing / Basal (ಬಿತ್ತನೆ ಸಮಯ)</option>
              <option value="vegetative">Vegetative (ಬೆಳವಣಿಗೆಯ ಹಂತ)</option>
              <option value="flowering">Flowering (ಹೂಬಿಡುವ ಹಂತ)</option>
              <option value="maturity">Maturity (ಪಕ್ವ ಹಂತ)</option>
            </Select>
          </FormRow>
          <FormRow label="Available Fertilizer Type">
            <Select value={fertilizerType} onChange={setFertilizerType}>
              <option value="urea_dap_mop">Urea + DAP + MOP Combination</option>
              <option value="ssp_urea">SSP + Urea (Alternative)</option>
              <option value="npk_mix">NPK 12-32-16 Mixture</option>
            </Select>
          </FormRow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Quantity of Fertilizer Required" value={qtyMessage} color={C.green} />
          <BigResult label="Estimated Fertilizer Cost" value={`₹${fmt(estCost)}`} color={C.amber} />
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: 6, textTransform: 'uppercase' }}>NPK Requirement Breakdown</div>
            <Grid cols={3}>
              <ResultCard label="N (Nitrogen)" value={`${nReq.toFixed(1)} kg`} color={C.green} />
              <ResultCard label="P (Phosphorus)" value={`${pReq.toFixed(1)} kg`} color={C.blue} />
              <ResultCard label="K (Potash)" value={`${kReq.toFixed(1)} kg`} color={C.amber} />
            </Grid>
          </div>
          <Disclaimer text="NPK targets are estimates. For optimal health and soil conservation, verify with a government soil health card." />
        </div>
      </div>
    </div>
  );
}

// 5. Irrigation Calculator
function IrrigationPanel({ gs, cropData, lang }) {
  const [crop, setCrop] = useState(gs.crop);
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [method, setMethod] = useState('drip');
  const [cycles, setCycles] = useState(6);
  const [soilType, setSoilType] = useState('medium');

  const acres = toAcres(area, unit);
  const cropInfo = cropData[crop] || cropData.wheat;

  const soilFactor = { sandy: 1.3, loamy: 1.0, medium: 1.0, clay: 0.8 }[soilType] || 1.0;
  const methodFactor = { drip: 0.5, sprinkler: 0.7, flood: 1.0 }[method] || 1.0;

  const totalWater = cropInfo.waterLitAcre * acres * soilFactor * methodFactor;
  const perIrrigation = totalWater / (parseFloat(cycles) || 6);
  const irrigationCost = acres * (parseFloat(cycles) || 6) * { drip: 200, sprinkler: 300, flood: 500 }[method];

  return (
    <div>
      <PanelHeader icon="💧" title="Irrigation & Water Calculator" subtitle="Estimate water volume and electricity/pump expenses for the season" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
          <FormRow label="Land Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          <FormRow label="Irrigation Method">
            <Select value={method} onChange={setMethod}>
              <option value="drip">Drip Irrigation (ಉದಕ ಪದ್ಧತಿ / ड्रिप)</option>
              <option value="sprinkler">Sprinkler (ತುಂತುರು ನೀರಾವರಿ / स्प्रिंकलर)</option>
              <option value="flood">Flood (ಹರಿ ನೀರಾವರಿ / बाढ़)</option>
            </Select>
          </FormRow>
          <FormRow label="Soil Type">
            <Select value={soilType} onChange={setSoilType}>
              <option value="sandy">Sandy (ಮರಳು ಮಣ್ಣು)</option>
              <option value="medium">Loamy/Medium (ಸಾಮಾನ್ಯ ಮಣ್ಣು)</option>
              <option value="clay">Clay (ಜೀವೋಡ ಮಣ್ಣು)</option>
            </Select>
          </FormRow>
          <InputWithVoice label="Number of Irrigation Cycles" value={cycles} onChange={setCycles} resetValue={6} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Total Seasonal Water Requirement" value={`${fmt(totalWater / 1000)} KL`} color={C.blue} sub={`(${fmt(totalWater)} Liters)`} />
          <BigResult label="Water Required Per Irrigation" value={`${fmt(perIrrigation / 1000)} KL`} color={C.cyan} />
          <BigResult label="Approximate Seasonal Cost" value={`₹${fmt(irrigationCost)}`} color={C.purple} />
          <Disclaimer text="Estimates are based on average evaporation rates. Adjust cycles according to real-time local rainfall forecasts." />
        </div>
      </div>
    </div>
  );
}

// 6. Pesticide & Spray Calculator
function SprayPanel({ gs, cropData, lang }) {
  const [crop, setCrop] = useState(gs.crop);
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [pest, setPest] = useState('aphids');
  const [dosage, setDosage] = useState(2.0); // ml or g per liter
  const [waterPerAcre, setWaterPerAcre] = useState(150); // Liters
  const [pesticidePrice, setPesticidePrice] = useState(800); // ₹ per liter/kg
  const [tankSize, setTankSize] = useState(15); // L

  const acres = toAcres(area, unit);
  const totalWater = waterPerAcre * acres;
  const pesticideQty = (totalWater * dosage) / 1000; // in Liters or Kg
  const totalTanks = Math.ceil(totalWater / tankSize);
  const totalCost = pesticideQty * pesticidePrice;
  const costPerSpray = totalCost / (totalTanks || 1);

  return (
    <div>
      <PanelHeader icon="🔫" title="Pesticide & Spray Calculator" subtitle="Determine pesticide concentrates and water requirements" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
          <FormRow label="Land Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          <FormRow label="Pest/Disease Type">
            <Select value={pest} onChange={setPest}>
              <option value="aphids">Sucking Pests (Aphids, Thrips, Whiteflies)</option>
              <option value="caterpillars">Chewing Pests (Caterpillars, Bollworms)</option>
              <option value="fungal">Fungal Diseases (Blight, Mildew, Blasts)</option>
              <option value="weeds">Weeds (Herbicides)</option>
            </Select>
          </FormRow>
          <InputWithVoice label="Recommended Dosage (ml or g per Liter of water)" value={dosage} onChange={setDosage} resetValue={2.0} lang={lang} />
          <InputWithVoice label="Water Requirement (Liters per Acre)" value={waterPerAcre} onChange={setWaterPerAcre} resetValue={150} lang={lang} />
          <InputWithVoice label="Pesticide Price (₹ per Liter/Kg)" value={pesticidePrice} onChange={setPesticidePrice} resetValue={800} lang={lang} />
          <FormRow label="Spray Tank Capacity (Liters)">
            <Select value={tankSize} onChange={setTankSize}>
              <option value="15">15 L Battery Sprayer</option>
              <option value="16">16 L Standard Tank</option>
              <option value="20">20 L Manual Sprayer</option>
              <option value="200">200 L Tractor Boom Sprayer</option>
            </Select>
          </FormRow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Total Pesticide Quantity Required" value={`${pesticideQty.toFixed(2)} Liters/Kg`} color={C.rose} />
          <BigResult label="Total Water Required" value={`${totalWater.toFixed(0)} Liters`} color={C.blue} />
          <Grid cols={2}>
            <ResultCard label="No. of Spray Tanks" value={`${totalTanks} Tanks`} color={C.amber} />
            <ResultCard label="Cost per Spray Tank" value={`₹${costPerSpray.toFixed(0)}`} color={C.purple} />
          </Grid>
          <BigResult label="Total Spraying Cost" value={`₹${totalCost.toFixed(0)}`} color={C.red} />
          <Disclaimer text="Always follow pesticide product labels strictly. Wear safety masks and gloves. Do not spray during strong winds." />
        </div>
      </div>
    </div>
  );
}

// 7. Farming Cost Calculator
function FarmCostPanel({ gs, cropData, lang, onSaveCalculatedCosts }) {
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [expenses, setExpenses] = useState({
    landPrep: 4000,
    seeds: 2500,
    fertilizers: 3500,
    pesticides: 1500,
    labour: 6000,
    machinery: 5000,
    irrigation: 2000,
    fuel: 1500,
    transport: 1800,
    harvesting: 4500,
    storage: 1000,
    other: 1000
  });
  const [yieldExpected, setYieldExpected] = useState(25); // quintals per acre

  const acres = toAcres(area, unit);
  const totalCost = Object.values(expenses).reduce((a, b) => parseFloat(a || 0) + parseFloat(b || 0), 0);
  const costPerAcre = totalCost / (acres || 1);
  const costPerHectare = costPerAcre * 2.47105;
  const totalProductionKg = yieldExpected * acres * 100; // 1 quintal = 100 kg
  const costPerKg = totalProductionKg > 0 ? totalCost / totalProductionKg : 0;

  // Auto load calculated values from other modules
  const handleLoadCalculations = () => {
    const cropInfo = cropData[gs.crop] || cropData.wheat;
    const seedResult = calcSeed(gs.crop, acres, 0, 90);
    const fertResult = calcFertilizer(gs.crop, acres, 'balanced', 'medium');
    const irrigResult = calcIrrigation(gs.crop, acres, 'drip', null);
    
    setExpenses(p => ({
      ...p,
      seeds: Math.round(seedResult.cost),
      fertilizers: Math.round(fertResult.totalCost),
      irrigation: Math.round(irrigResult.totalCost),
      machinery: Math.round(acres * 2500), // estimated standard
      labour: Math.round(acres * 3000),
      landPrep: Math.round(acres * 2000)
    }));
  };

  const handleSaveToProfit = () => {
    if (onSaveCalculatedCosts) {
      onSaveCalculatedCosts(totalCost, yieldExpected);
      alert("Costs successfully loaded into the Crop Profit Calculator!");
    }
  };

  return (
    <div>
      <PanelHeader icon="🧾" title="Farming Cost Calculator" subtitle="Estimate itemized expenses to calculate overall cost parameters" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <button 
            onClick={handleLoadCalculations}
            style={{
              width: '100%', padding: '10px 14px', background: C.cyan,
              color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
              fontWeight: 700, fontSize: '0.85rem', marginBottom: 16
            }}
          >
            🔄 Load Estimated Values From Other Calculators
          </button>
          
          <Grid cols={2}>
            <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
            <FormRow label="Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          </Grid>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <InputWithVoice label="Land Preparation (₹)" value={expenses.landPrep} onChange={v => setExpenses(p => ({ ...p, landPrep: v }))} resetValue={4000} lang={lang} />
            <InputWithVoice label="Seeds (₹)" value={expenses.seeds} onChange={v => setExpenses(p => ({ ...p, seeds: v }))} resetValue={2500} lang={lang} />
            <InputWithVoice label="Fertilizers (₹)" value={expenses.fertilizers} onChange={v => setExpenses(p => ({ ...p, fertilizers: v }))} resetValue={3500} lang={lang} />
            <InputWithVoice label="Pesticides (₹)" value={expenses.pesticides} onChange={v => setExpenses(p => ({ ...p, pesticides: v }))} resetValue={1500} lang={lang} />
            <InputWithVoice label="Labour Costs (₹)" value={expenses.labour} onChange={v => setExpenses(p => ({ ...p, labour: v }))} resetValue={6000} lang={lang} />
            <InputWithVoice label="Machinery Rental (₹)" value={expenses.machinery} onChange={v => setExpenses(p => ({ ...p, machinery: v }))} resetValue={5000} lang={lang} />
            <InputWithVoice label="Irrigation (₹)" value={expenses.irrigation} onChange={v => setExpenses(p => ({ ...p, irrigation: v }))} resetValue={2000} lang={lang} />
            <InputWithVoice label="Electricity/Fuel (₹)" value={expenses.fuel} onChange={v => setExpenses(p => ({ ...p, fuel: v }))} resetValue={1500} lang={lang} />
            <InputWithVoice label="Transportation (₹)" value={expenses.transport} onChange={setExpenses} resetValue={1800} lang={lang} />
            <InputWithVoice label="Harvesting (₹)" value={expenses.harvesting} onChange={v => setExpenses(p => ({ ...p, harvesting: v }))} resetValue={4500} lang={lang} />
            <InputWithVoice label="Storage Fee (₹)" value={expenses.storage} onChange={v => setExpenses(p => ({ ...p, storage: v }))} resetValue={1000} lang={lang} />
            <InputWithVoice label="Other Expenses (₹)" value={expenses.other} onChange={v => setExpenses(p => ({ ...p, other: v }))} resetValue={1000} lang={lang} />
          </div>

          <InputWithVoice label="Expected Yield (Quintals/Acre)" value={yieldExpected} onChange={setYieldExpected} resetValue={25} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Total Farming Cost" value={`₹${fmt(totalCost)}`} color={C.rose} />
          <Grid cols={3}>
            <ResultCard label="Cost per Acre" value={`₹${fmt(costPerAcre)}`} color={C.green} />
            <ResultCard label="Cost per Hectare" value={`₹${fmt(costPerHectare)}`} color={C.blue} />
            <ResultCard label="Cost per Kg" value={`₹${costPerKg.toFixed(2)}/kg`} color={C.purple} />
          </Grid>
          <button 
            onClick={handleSaveToProfit}
            style={{
              width: '100%', padding: '12px', background: C.green,
              color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
              fontWeight: 700, fontSize: '0.85rem', marginTop: 10
            }}
          >
            💰 Push Total Cost to Crop Profit Calculator
          </button>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 12, marginTop: 10 }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: 6 }}>COST SHEET PERCENTAGE SHARE</div>
            {Object.entries(expenses).map(([key, val]) => {
              const share = totalCost > 0 ? (val / totalCost) * 100 : 0;
              return (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{key}</span>
                  <span>{share.toFixed(1)}% (₹{fmt(val)})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. Crop Profit Calculator
function ProfitPanel({ gs, cropData, calculatedCosts, lang }) {
  const [crop, setCrop] = useState(gs.crop);
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [expectedYield, setExpectedYield] = useState(calculatedCosts.yieldExpected || 25);
  const [marketPrice, setMarketPrice] = useState(CROP_DATA[gs.crop]?.msp || 2000);
  const [totalCost, setTotalCost] = useState(calculatedCosts.totalCost || 25000);

  const acres = toAcres(area, unit);
  const expectedProduction = expectedYield * acres; // In Quintals
  const expectedRevenue = expectedProduction * marketPrice;
  const netProfit = expectedRevenue - totalCost;
  const profitPerAcre = netProfit / (acres || 1);
  const margin = expectedRevenue > 0 ? (netProfit / expectedRevenue) * 100 : 0;
  const breakEven = expectedProduction > 0 ? totalCost / expectedProduction : 0;

  // Sync state if calculatedCosts changes
  useEffect(() => {
    if (calculatedCosts.totalCost) {
      setTotalCost(calculatedCosts.totalCost);
      setExpectedYield(calculatedCosts.yieldExpected);
    }
  }, [calculatedCosts]);

  return (
    <div>
      <PanelHeader icon="💰" title="Crop Profit Calculator" subtitle="Determine net profitability margins and revenue calculations" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
          <FormRow label="Land Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          <InputWithVoice label="Expected Yield (Quintals/Acre)" value={expectedYield} onChange={setExpectedYield} resetValue={25} lang={lang} />
          <InputWithVoice label="Expected Market Price (₹/Quintal)" value={marketPrice} onChange={setMarketPrice} resetValue={2000} lang={lang} />
          <InputWithVoice label="Total Farming Expenses (₹)" value={totalCost} onChange={setTotalCost} resetValue={25000} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: 16 }}>
            <h4 style={{ color: C.green, margin: '0 0 12px', fontSize: '0.9rem' }}>Financial Formula Summary</h4>
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>📈 Expected Revenue ({expectedProduction.toFixed(1)} Qtl × ₹{marketPrice})</span>
                <span style={{ color: C.blue, fontWeight: 700 }}>₹{fmt(expectedRevenue)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>
                <span>📉 Total Farming Cost</span>
                <span style={{ color: C.rose, fontWeight: 700 }}>- ₹{fmt(totalCost)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, fontSize: '1.1rem', fontWeight: 800 }}>
                <span style={{ color: netProfit >= 0 ? C.green : C.red }}>💵 Expected Net Profit</span>
                <span style={{ color: netProfit >= 0 ? C.green : C.red }}>₹{fmt(netProfit)}</span>
              </div>
            </div>
          </div>

          <Grid cols={2}>
            <ResultCard label="Profit Margin" value={`${margin.toFixed(1)}%`} color={netProfit >= 0 ? C.green : C.red} />
            <ResultCard label="Profit Per Acre" value={`₹${fmt(profitPerAcre)}`} color={netProfit >= 0 ? C.green : C.red} />
          </Grid>
          <BigResult label="Break-Even selling price" value={`₹${breakEven.toFixed(0)}/Quintal`} color={C.amber} sub={`Equivalent to ₹${(breakEven / 100).toFixed(2)}/kg`} />
        </div>
      </div>
    </div>
  );
}

// 9. Break-Even Calculator
function BreakEvenPanel({ lang }) {
  const [totalCost, setTotalCost] = useState(30000);
  const [expectedQty, setExpectedQty] = useState(25); // In Quintals

  const qtyKg = expectedQty * 100;
  const qtyTon = expectedQty / 10;
  const breakEvenKg = totalCost / (qtyKg || 1);
  const breakEvenQtl = totalCost / (expectedQty || 1);
  const breakEvenTon = totalCost / (qtyTon || 1);

  return (
    <div>
      <PanelHeader icon="⚖️" title="Break-Even Calculator" subtitle="Minimum selling price per unit required to recover farming costs" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <InputWithVoice label="Total Farming Cost (₹)" value={totalCost} onChange={setTotalCost} resetValue={30000} lang={lang} />
          <InputWithVoice label="Expected Production (Quintals)" value={expectedQty} onChange={setExpectedQty} resetValue={25} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Break-Even Price per Kg" value={`₹${breakEvenKg.toFixed(2)}/kg`} color={C.green} />
          <BigResult label="Break-Even Price per Quintal" value={`₹${breakEvenQtl.toFixed(0)}/qtl`} color={C.amber} />
          <BigResult label="Break-Even Price per Ton" value={`₹${breakEvenTon.toFixed(0)}/ton`} color={C.blue} />
          <Disclaimer text="Ensure your market selling price exceeds these values to avoid net agricultural losses." />
        </div>
      </div>
    </div>
  );
}

// 10. Labour Calculator
function LabourPanel({ gs, lang }) {
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [activity, setActivity] = useState('harvesting');
  const [workers, setWorkers] = useState(5);
  const [hours, setHours] = useState(8);
  const [costPerWorker, setCostPerWorker] = useState(400); // Daily rate

  const acres = toAcres(area, unit);
  const baseLabourDays = (LABOUR_ACTIVITIES[activity]?.pdAcre || 5) * acres;
  const totalLabourHours = baseLabourDays * 8; // standard 8 hours day
  const estimatedCompletionTime = totalLabourHours / (workers * hours || 1);
  const totalLabourCost = baseLabourDays * costPerWorker;

  return (
    <div>
      <PanelHeader icon="👷" title="Labour Requirement Calculator" subtitle="Estimate overall labour hours, costs, and timeline required for activities" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
          <FormRow label="Land Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          <FormRow label="Farming Activity">
            <Select value={activity} onChange={setActivity}>
              {Object.entries(LABOUR_ACTIVITIES).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.name}</option>
              ))}
            </Select>
          </FormRow>
          <InputWithVoice label="Number of Active Workers" value={workers} onChange={setWorkers} resetValue={5} lang={lang} />
          <InputWithVoice label="Working Hours per Day" value={hours} onChange={setHours} resetValue={8} lang={lang} />
          <InputWithVoice label="Labour Cost per Worker per Day (₹)" value={costPerWorker} onChange={setCostPerWorker} resetValue={400} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Total Estimated Labour Cost" value={`₹${fmt(totalLabourCost)}`} color={C.green} />
          <BigResult label="Total Labour Hours" value={`${totalLabourHours.toFixed(0)} hours`} color={C.blue} />
          <BigResult label="Estimated Completion Time" value={`${estimatedCompletionTime.toFixed(1)} days`} color={C.amber} />
          <Disclaimer text="Labour estimates vary with field terrain and worker experience. Standard calculations assume standard field conditions." />
        </div>
      </div>
    </div>
  );
}

// 11. Machinery Cost Calculator
function MachineryPanel({ gs, setActiveCalc, lang }) {
  const [machine, setMachine] = useState('tractor');
  const [rentalRate, setRentalRate] = useState(600); // Per hour
  const [workingHours, setWorkingHours] = useState(4);
  const [fuelCost, setFuelCost] = useState(100); // fuel cost per hour
  const [operatorCost, setOperatorCost] = useState(150); // operator hourly cost
  const [area, setArea] = useState(gs.area);

  const totalMachineCost = (rentalRate + fuelCost + operatorCost) * workingHours;
  const costPerAcre = totalMachineCost / (parseFloat(area) || 1);

  const handleMachineChange = (mKey) => {
    setMachine(mKey);
    const m = DEFAULT_MACHINERY_DATA[mKey];
    if (m) {
      setRentalRate(m.rateHr);
      setFuelCost(m.fuelHr * 10); // estimate based on standard fuel rate
    }
  };

  return (
    <div>
      <PanelHeader icon="🚜" title="Machinery Cost Calculator" subtitle="Estimate machinery usage expenses and link directly to local rentals" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Machine Type">
            <Select value={machine} onChange={handleMachineChange}>
              {Object.entries(DEFAULT_MACHINERY_DATA).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.name}</option>
              ))}
            </Select>
          </FormRow>
          <InputWithVoice label="Rental Price (₹ per Hour)" value={rentalRate} onChange={setRentalRate} resetValue={600} lang={lang} />
          <InputWithVoice label="Working Hours Required" value={workingHours} onChange={setWorkingHours} resetValue={4} lang={lang} />
          <InputWithVoice label="Hourly Fuel Cost (₹)" value={fuelCost} onChange={setFuelCost} resetValue={100} lang={lang} />
          <InputWithVoice label="Hourly Operator Cost (₹)" value={operatorCost} onChange={setOperatorCost} resetValue={150} lang={lang} />
          <InputWithVoice label="Land Area Coverage (Acres)" value={area} onChange={setArea} resetValue={1} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Total Machine Cost" value={`₹${fmt(totalMachineCost)}`} color={C.green} />
          <BigResult label="Cost per Acre" value={`₹${fmt(costPerAcre)}`} color={C.blue} />
          <BigResult label="Estimated Duration" value={`${workingHours} Hours`} color={C.amber} />
          
          <button
            onClick={() => setActiveCalc('rentals')}
            style={{
              padding: '12px', background: C.green, color: '#fff',
              border: 'none', borderRadius: 10, cursor: 'pointer',
              fontWeight: 700, fontSize: '0.85rem', marginTop: 10
            }}
          >
            🚜 Find Machinery to Rent Near You
          </button>
        </div>
      </div>
    </div>
  );
}

// 12. Crop Comparison Calculator
function CropComparePanel({ gs, cropData, lang }) {
  const [cropList, setCropList] = useState(['wheat', 'rice', 'cotton']);
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);

  const acres = toAcres(area, unit);

  const comparisons = cropList.map(cropKey => {
    const cropInfo = cropData[cropKey] || cropData.wheat;
    const cost = cropInfo.typicalCostAcre * acres;
    const yieldExpected = cropInfo.yieldQtlAcre * acres;
    const revenue = yieldExpected * (cropInfo.msp || 2000);
    const profit = revenue - cost;
    const breakeven = yieldExpected > 0 ? cost / yieldExpected : 0;
    return {
      cropKey,
      name: cropInfo.name,
      icon: cropInfo.icon,
      cost,
      yieldExpected,
      revenue,
      profit,
      breakeven
    };
  });

  const lowestInvestment = [...comparisons].sort((a, b) => a.cost - b.cost)[0];
  const highestProfit = [...comparisons].sort((a, b) => b.profit - a.profit)[0];
  const highestYield = [...comparisons].sort((a, b) => b.yieldExpected - a.yieldExpected)[0];
  const lowestBreakeven = [...comparisons].sort((a, b) => a.breakeven - b.breakeven)[0];

  return (
    <div>
      <PanelHeader icon="🆚" title="Crop Comparison Calculator" subtitle="Compare expected financial returns of up to 4 crops side-by-side" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 14 }}>
        <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
        <FormRow label="Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        {cropList.map((cKey, idx) => (
          <div key={idx}>
            <Label>Select Crop {idx + 1}</Label>
            <Select value={cKey} onChange={v => setCropList(p => {
              const next = [...p];
              next[idx] = v;
              return next;
            })}>
              {Object.entries(cropData).map(([k, d]) => (
                <option key={k} value={k}>{d.icon} {d.name}</option>
              ))}
            </Select>
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Metric</th>
              {comparisons.map((c, i) => <th key={i} style={{ textAlign: 'right', padding: 8 }}>{c.icon} {c.name}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 8, color: 'rgba(255,255,255,0.6)' }}>Total Investment</td>
              {comparisons.map((c, i) => <td key={i} style={{ textAlign: 'right', padding: 8 }}>₹{fmt(c.cost)}</td>)}
            </tr>
            <tr>
              <td style={{ padding: 8, color: 'rgba(255,255,255,0.6)' }}>Expected Yield (Qtl)</td>
              {comparisons.map((c, i) => <td key={i} style={{ textAlign: 'right', padding: 8 }}>{c.yieldExpected.toFixed(1)} Qtl</td>)}
            </tr>
            <tr>
              <td style={{ padding: 8, color: 'rgba(255,255,255,0.6)' }}>Expected Revenue</td>
              {comparisons.map((c, i) => <td key={i} style={{ textAlign: 'right', padding: 8 }}>₹{fmt(c.revenue)}</td>)}
            </tr>
            <tr style={{ borderTop: '1px solid rgba(255,255,255,0.08)', fontWeight: 700 }}>
              <td style={{ padding: 8, color: C.green }}>Expected Profit</td>
              {comparisons.map((c, i) => <td key={i} style={{ textAlign: 'right', padding: 8, color: c.profit >= 0 ? C.green : C.red }}>₹{fmt(c.profit)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
        <ResultCard label="Lowest Investment Needed" value={`${lowestInvestment?.icon} ${lowestInvestment?.name}`} sub={`₹${fmt(lowestInvestment?.cost)}`} color={C.blue} />
        <ResultCard label="Highest Expected Profit" value={`${highestProfit?.icon} ${highestProfit?.name}`} sub={`₹${fmt(highestProfit?.profit)}`} color={C.green} />
        <ResultCard label="Highest Expected Yield" value={`${highestYield?.icon} ${highestYield?.name}`} sub={`${highestYield?.yieldExpected.toFixed(1)} Qtl`} color={C.cyan} />
        <ResultCard label="Lowest Break-Even selling price" value={`${lowestBreakeven?.icon} ${lowestBreakeven?.name}`} sub={`₹${lowestBreakeven?.breakeven.toFixed(0)}/Qtl`} color={C.amber} />
      </div>
    </div>
  );
}

// 13. Mandi Price & Profit Calculator
function MandiProfitPanel({ gs, cropData, lang }) {
  const [crop, setCrop] = useState(gs.crop);
  const [qty, setQty] = useState(50); // Quintals
  const [mandiPrice, setMandiPrice] = useState(CROP_DATA[gs.crop]?.msp || 2000);
  const [transport, setTransport] = useState(1200);
  const [commission, setCommission] = useState(500);
  const [otherSelling, setOtherSelling] = useState(300);

  const grossVal = qty * mandiPrice;
  const totalSellingExpenses = parseFloat(transport) + parseFloat(commission) + parseFloat(otherSelling);
  const netIncome = grossVal - totalSellingExpenses;
  const expectedProfit = netIncome - (cropData[crop]?.typicalCostAcre * toAcres(gs.area, gs.unit));

  return (
    <div>
      <PanelHeader icon="🏪" title="Mandi Price & Profit Calculator" subtitle="Deduct transportation and commissions from market rates" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Production Quantity (Quintals)" value={qty} onChange={setQty} resetValue={50} lang={lang} />
          <InputWithVoice label="Current Mandi Market Price (₹/Quintal)" value={mandiPrice} onChange={setMandiPrice} resetValue={2000} lang={lang} />
          <InputWithVoice label="Transportation Cost (₹)" value={transport} onChange={setTransport} resetValue={1200} lang={lang} />
          <InputWithVoice label="Commission/Market Charges (₹)" value={commission} onChange={setCommission} resetValue={500} lang={lang} />
          <InputWithVoice label="Other Selling Expenses (₹)" value={otherSelling} onChange={setOtherSelling} resetValue={300} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Gross Selling Value" value={`₹${fmt(grossVal)}`} color={C.blue} />
          <BigResult label="Total Selling Expenses" value={`₹${fmt(totalSellingExpenses)}`} color={C.rose} />
          <BigResult label="Net Mandi Income" value={`₹${fmt(netIncome)}`} color={C.green} />
          <BigResult label="Net Expected Profit" value={`₹${fmt(expectedProfit)}`} color={expectedProfit >= 0 ? C.green : C.red} />
        </div>
      </div>
    </div>
  );
}

// 14. Storage Calculator
function StoragePanel({ cropData, lang }) {
  const [crop, setCrop] = useState('wheat');
  const [qty, setQty] = useState(50); // In Quintals
  const [duration, setDuration] = useState(3); // Months
  const [storageType, setStorageType] = useState('warehouse');

  const stInfo = STORAGE_TYPES[storageType] || STORAGE_TYPES.warehouse;
  const capacityRequired = qty * 1.5; // conversion factor estimate
  const monthlyCost = qty * stInfo.rateQtlMo;
  const totalCost = monthlyCost * duration;

  return (
    <div>
      <PanelHeader icon="🏗️" title="Storage Calculator" subtitle="Estimate monthly and seasonal storage fees for your harvested yields" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Quantity Produced (Quintals)" value={qty} onChange={setQty} resetValue={50} lang={lang} />
          <InputWithVoice label="Storage Duration (Months)" value={duration} onChange={setDuration} resetValue={3} lang={lang} />
          <FormRow label="Storage Facility Type">
            <Select value={storageType} onChange={setStorageType}>
              <option value="warehouse">Village Warehouse/Godown (₹25/qtl/mo)</option>
              <option value="cold_storage">Cold Storage (₹65/qtl/mo)</option>
              <option value="farm_silo">On-Farm Grain Silo (₹8/qtl/mo)</option>
              <option value="wrs">WRS WDRA Regulated Warehouse (₹30/qtl/mo)</option>
            </Select>
          </FormRow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Required Capacity Estimate" value={`${capacityRequired.toFixed(0)} Cubic Feet`} color={C.blue} sub={`Equates to ${qty} Quintals of grain storage`} />
          <BigResult label="Approximate Storage Cost Per Month" value={`₹${fmt(monthlyCost)}`} color={C.amber} />
          <BigResult label="Total Seasonal Storage Expense" value={`₹${fmt(totalCost)}`} color={C.purple} />
        </div>
      </div>
    </div>
  );
}

// 15. Loan Calculator
function LoanPanel({ lang }) {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(7);
  const [duration, setDuration] = useState(12); // Months
  const [frequency, setFrequency] = useState('monthly');

  const annualRateFraction = interestRate / 100;
  let emi = 0;
  let totalRepayment = 0;
  let totalInterest = 0;

  if (frequency === 'monthly') {
    const monthlyRate = annualRateFraction / 12;
    emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, duration) / (Math.pow(1 + monthlyRate, duration) - 1);
    totalRepayment = emi * duration;
    totalInterest = totalRepayment - loanAmount;
  } else {
    // Annual Repayment
    const years = duration / 12;
    totalInterest = loanAmount * annualRateFraction * years;
    totalRepayment = loanAmount + totalInterest;
    emi = totalRepayment / years;
  }

  return (
    <div>
      <PanelHeader icon="🏦" title="Loan / Farming Investment Calculator" subtitle="Estimate repayments and overall interest details for farm financing" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <InputWithVoice label="Loan Amount (₹)" value={loanAmount} onChange={setLoanAmount} resetValue={100000} lang={lang} />
          <InputWithVoice label="Annual Interest Rate (%)" value={interestRate} onChange={setInterestRate} resetValue={7} lang={lang} />
          <InputWithVoice label="Loan Duration (Months)" value={duration} onChange={setDuration} resetValue={12} lang={lang} />
          <FormRow label="Repayment Frequency">
            <Select value={frequency} onChange={setFrequency}>
              <option value="monthly">Monthly Instalments (EMIs)</option>
              <option value="annual">Annual Lump Sum</option>
            </Select>
          </FormRow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label={frequency === 'monthly' ? "Estimated Monthly EMI" : "Estimated Annual Payment"} value={`₹${emi.toFixed(0)}`} color={C.green} />
          <BigResult label="Total Interest Owed" value={`₹${totalInterest.toFixed(0)}`} color={C.rose} />
          <BigResult label="Total Repayment Amount" value={`₹${totalRepayment.toFixed(0)}`} color={C.blue} />
        </div>
      </div>
    </div>
  );
}

// 16. ROI Calculator
function ROIPanel({ lang }) {
  const [investment, setInvestment] = useState(40000);
  const [revenue, setRevenue] = useState(65000);

  const profit = revenue - investment;
  const roi = investment > 0 ? (profit / investment) * 100 : 0;

  return (
    <div>
      <PanelHeader icon="📈" title="ROI Calculator" subtitle="Evaluate overall investment efficiency and return percentage" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <InputWithVoice label="Total Investment (₹)" value={investment} onChange={setInvestment} resetValue={40000} lang={lang} />
          <InputWithVoice label="Total Revenue Generated (₹)" value={revenue} onChange={setRevenue} resetValue={65000} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Net Return On Investment (ROI)" value={`${roi.toFixed(1)}%`} color={roi >= 0 ? C.green : C.red} />
          <BigResult label="Net Profit" value={`₹${fmt(profit)}`} color={profit >= 0 ? C.green : C.red} />
          <Grid cols={2}>
            <ResultCard label="Total Investment" value={`₹${fmt(investment)}`} color={C.rose} />
            <ResultCard label="Total Revenue" value={`₹${fmt(revenue)}`} color={C.blue} />
          </Grid>
        </div>
      </div>
    </div>
  );
}

// 17. Multi-Crop Farm Calculator
function MultiCropPanel({ gs, cropData, lang }) {
  const [totalArea, setTotalArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [allocations, setAllocations] = useState([
    { crop: 'wheat', pct: 40 },
    { crop: 'maize', pct: 30 },
    { crop: 'soybean', pct: 20 },
    { crop: 'vegetables', pct: 10 }
  ]);

  const acres = toAcres(totalArea, unit);
  const totalAllocPct = allocations.reduce((a, b) => a + parseFloat(b.pct || 0), 0);

  const cropSummaries = allocations.map(item => {
    const cropAcres = acres * (item.pct / 100);
    const cropInfo = cropData[item.crop] || cropData.wheat;
    const inv = cropInfo.typicalCostAcre * cropAcres;
    const prod = cropInfo.yieldQtlAcre * cropAcres;
    const rev = prod * (cropInfo.msp || 2000);
    const prof = rev - inv;
    return {
      ...item,
      name: cropInfo.name,
      icon: cropInfo.icon,
      cropAcres,
      inv,
      prod,
      rev,
      prof
    };
  });

  const aggregateInv = cropSummaries.reduce((a, b) => a + b.inv, 0);
  const aggregateRev = cropSummaries.reduce((a, b) => a + b.rev, 0);
  const aggregateProf = aggregateRev - aggregateInv;
  const aggregateRoi = aggregateInv > 0 ? (aggregateProf / aggregateInv) * 100 : 0;

  return (
    <div>
      <PanelHeader icon="🗺️" title="Multi-Crop Farm Calculator" subtitle="Distribute land area among different crops and view cumulative returns" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 14 }}>
        <InputWithVoice label="Total Land Area" value={totalArea} onChange={setTotalArea} resetValue={10.0} lang={lang} />
        <FormRow label="Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
        {allocations.map((item, idx) => (
          <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 10 }}>
            <FormRow label={`Crop ${idx + 1}`}>
              <Select value={item.crop} onChange={v => setAllocations(p => {
                const next = [...p];
                next[idx].crop = v;
                return next;
              })}>
                {Object.entries(cropData).map(([k, d]) => <option key={k} value={k}>{d.icon} {d.name}</option>)}
              </Select>
            </FormRow>
            <InputWithVoice label="Acreage Share %" value={item.pct} onChange={v => setAllocations(p => {
              const next = [...p];
              next[idx].pct = v;
              return next;
            })} resetValue={25} lang={lang} />
          </div>
        ))}
      </div>

      {totalAllocPct !== 100 && (
        <div style={{ padding: 10, background: 'rgba(239, 68, 68, 0.1)', color: C.red, borderRadius: 8, marginBottom: 12, fontSize: '0.8rem' }}>
          ⚠️ Warning: Land allocation percentages sum to {totalAllocPct}%. Adjust them to total exactly 100%.
        </div>
      )}

      <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Allocated Crop</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Area (Acres)</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Investment</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Revenue</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Expected Profit</th>
            </tr>
          </thead>
          <tbody>
            {cropSummaries.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: 8 }}>{c.icon} {c.name}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>{c.cropAcres.toFixed(1)} ac</td>
                <td style={{ textAlign: 'right', padding: 8 }}>₹{fmt(c.inv)}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>₹{fmt(c.rev)}</td>
                <td style={{ textAlign: 'right', padding: 8, color: c.prof >= 0 ? C.green : C.red }}>₹{fmt(c.prof)}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: 700, borderTop: '2px solid rgba(255,255,255,0.15)' }}>
              <td style={{ padding: 8 }}>Total Farm Planner</td>
              <td style={{ textAlign: 'right', padding: 8 }}>{acres.toFixed(1)} ac</td>
              <td style={{ textAlign: 'right', padding: 8 }}>₹{fmt(aggregateInv)}</td>
              <td style={{ textAlign: 'right', padding: 8 }}>₹{fmt(aggregateRev)}</td>
              <td style={{ textAlign: 'right', padding: 8, color: aggregateProf >= 0 ? C.green : C.red }}>₹{fmt(aggregateProf)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
        <BigResult label="Cumulative Net Profit" value={`₹${fmt(aggregateProf)}`} color={aggregateProf >= 0 ? C.green : C.red} />
        <BigResult label="Overall Expected ROI" value={`${aggregateRoi.toFixed(1)}%`} color={aggregateRoi >= 0 ? C.green : C.red} />
      </div>
    </div>
  );
}

// 19. Solar Pump & KUSUM Subsidy Panel
function SolarPumpPanel({ gs, lang }) {
  const [hp, setHp] = useState(5);
  const [depth, setDepth] = useState(150);
  const [dieselPrice, setDieselPrice] = useState(90);
  const [subsidyPct, setSubsidyPct] = useState(60);

  const res = calcSolarPump(hp, depth, dieselPrice, subsidyPct);

  return (
    <div>
      <PanelHeader icon="⚡" title="Solar Water Pump & PM-KUSUM Subsidy Calculator" subtitle="Estimate solar capacity required, diesel savings, and government subsidy benefits" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Motor Horsepower (HP)">
            <Select value={hp} onChange={setHp}>
              <option value="3">3 HP Surface / Submersible Pump</option>
              <option value="5">5 HP Standard Agricultural Pump</option>
              <option value="7.5">7.5 HP High Capacity Submersible</option>
              <option value="10">10 HP Heavy Duty Deep Borewell Pump</option>
            </Select>
          </FormRow>
          <InputWithVoice label="Borewell / Well Depth (Feet)" value={depth} onChange={setDepth} resetValue={150} lang={lang} />
          <InputWithVoice label="Current Diesel Price (₹/Liter)" value={dieselPrice} onChange={setDieselPrice} resetValue={90} lang={lang} />
          <FormRow label="PM-KUSUM Subsidy Scheme Level">
            <Select value={subsidyPct} onChange={setSubsidyPct}>
              <option value="60">60% Standard Subsidy (Central 30% + State 30%)</option>
              <option value="75">75% High Subsidy (SC/ST & Hilly/Tribal Belt)</option>
              <option value="40">40% Partial Capital Subsidy</option>
            </Select>
          </FormRow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Required Solar Panel Power" value={`${res.solarCapacityKw} kW`} color={C.green} sub={`Estimated Benchmark System Cost: ₹${fmt(res.systemBenchmarkCost)}`} />
          <Grid cols={2}>
            <ResultCard label="Govt Subsidy Amount" value={`₹${fmt(res.subsidyAmount)}`} color={C.cyan} sub={`${subsidyPct}% Subsidy Coverage`} />
            <ResultCard label="Farmer Net Share" value={`₹${fmt(res.farmerShare)}`} color={C.purple} sub="Actual Out-of-pocket Cost" />
          </Grid>
          <BigResult label="Monthly Fuel Savings (vs Diesel)" value={`₹${fmt(res.monthlyDieselSavedRs)}/month`} color={C.amber} sub={`Saves approx ₹${fmt(res.annualSavingsRs)} every year`} />
          <Grid cols={2}>
            <ResultCard label="Daily Water Discharge" value={`${fmt(res.dailyWaterDischargeLit)} L/day`} color={C.blue} />
            <ResultCard label="Payback Period" value={`${res.paybackMonths} Months`} color={C.rose} sub="Full ROI on farmer share" />
          </Grid>
          <Disclaimer text="PM-KUSUM Component-B applications are invited online through State Renewable Energy Development Agencies (e.g. MEDA, UPNEDA, HAREDA, REDA)." />
        </div>
      </div>
    </div>
  );
}

// 20. Cattle Feed & Dairy Fodder Panel
function CattleFodderPanel({ lang }) {
  const [cows, setCows] = useState(2);
  const [buffaloes, setBuffaloes] = useState(2);
  const [milkYield, setMilkYield] = useState(10);
  const [milkPrice, setMilkPrice] = useState(50);

  const res = calcCattleFodder(cows, buffaloes, milkYield, milkPrice);

  return (
    <div>
      <PanelHeader icon="🐄" title="Cattle Feed & Dairy Fodder Calculator" subtitle="Estimate daily green fodder, dry fodder, concentrate feed & monthly dairy profit margins" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <InputWithVoice label="Number of Milch Cows" value={cows} onChange={setCows} resetValue={2} lang={lang} />
          <InputWithVoice label="Number of Milch Buffaloes" value={buffaloes} onChange={setBuffaloes} resetValue={2} lang={lang} />
          <InputWithVoice label="Avg Milk Yield per Animal (Liters/day)" value={milkYield} onChange={setMilkYield} resetValue={10} lang={lang} />
          <InputWithVoice label="Milk Sale Price (₹/Liter)" value={milkPrice} onChange={setMilkPrice} resetValue={50} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>DAILY FODDER REQUIREMENT FOR {res.totalHeads} ANIMALS</div>
            <Grid cols={3}>
              <ResultCard label="Green Fodder" value={`${res.dailyGreenFodderKg} kg/day`} color={C.green} sub="Berseem/Napier/Sorghum" />
              <ResultCard label="Dry Fodder (Straw)" value={`${res.dailyDryFodderKg} kg/day`} color={C.amber} sub="Wheat/Paddy Straw" />
              <ResultCard label="Concentrate Feed" value={`${res.dailyConcentrateKg} kg/day`} color={C.purple} sub="Kapas Khali/Khal" />
            </Grid>
          </div>
          <Grid cols={2}>
            <ResultCard label="Monthly Milk Revenue" value={`₹${fmt(res.monthlyRevenue)}`} color={C.blue} sub={`${res.totalDailyMilk} Liters Daily Milk`} />
            <ResultCard label="Monthly Cattle Feed Cost" value={`₹${fmt(res.monthlyFeedCost)}`} color={C.rose} />
          </Grid>
          <BigResult label="Monthly Net Dairy Profit" value={`₹${fmt(res.monthlyNetMargin)}`} color={res.monthlyNetMargin >= 0 ? C.green : C.red} sub={res.monthlyNetMargin >= 0 ? '🟢 Profitable Dairy Farm' : '🔴 High Feed Cost Warning'} />
        </div>
      </div>
    </div>
  );
}

// 21. Drip & Micro-Irrigation Calculator Panel
function DripCalcPanel({ gs, lang }) {
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [rowSpacing, setRowSpacing] = useState(5);
  const [emitterSpacing, setEmitterSpacing] = useState(1.5);
  const [subsidyPct, setSubsidyPct] = useState(60);

  const acres = toAcres(area, unit);
  const res = calcDripIrrigation(acres, rowSpacing, emitterSpacing, subsidyPct);

  return (
    <div>
      <PanelHeader icon="🌧️" title="Drip Irrigation & Pipeline Estimator" subtitle="Calculate lateral line length, emitter counts, and government subsidy under Per Drop More Crop" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1} lang={lang} />
          <FormRow label="Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          <InputWithVoice label="Crop Row Spacing (Feet)" value={rowSpacing} onChange={setRowSpacing} resetValue={5} lang={lang} />
          <InputWithVoice label="Drip Emitter / Dripper Spacing (Feet)" value={emitterSpacing} onChange={setEmitterSpacing} resetValue={1.5} lang={lang} />
          <FormRow label="PMKSY Drip Subsidy Rate">
            <Select value={subsidyPct} onChange={setSubsidyPct}>
              <option value="60">60% Subsidy (Small & Marginal Farmers)</option>
              <option value="45">45% Subsidy (Other Farmers)</option>
              <option value="80">80% State Special Subsidy (Drought/Dark Zones)</option>
            </Select>
          </FormRow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Total Drip Lateral Line Needed" value={`${fmt(res.lateralLenMeters)} Meters`} color={C.blue} sub={`Approx ${(res.lateralLenMeters * 3.28084).toFixed(0)} Feet of 16mm Drip Pipe`} />
          <BigResult label="Total Dripper Emitter Count" value={`${fmt(res.emitterCount)} Emitters`} color={C.green} />
          <Grid cols={2}>
            <ResultCard label="Gross System Cost" value={`₹${fmt(res.grossCost)}`} color={C.amber} />
            <ResultCard label="Govt Subsidy (₹)" value={`₹${fmt(res.subsidyAmount)}`} color={C.cyan} />
          </Grid>
          <BigResult label="Farmer Share to Pay" value={`₹${fmt(res.farmerShare)}`} color={C.purple} sub={`Saves up to ${res.waterSavedPercent}% water compared to flood irrigation`} />
        </div>
      </div>
    </div>
  );
}

// 22. Polyhouse & Protected Cultivation Panel
function PolyhousePanel({ lang }) {
  const [areaSqM, setAreaSqM] = useState(1000);
  const [cropType, setCropType] = useState('capsicum');
  const [subsidyPct, setSubsidyPct] = useState(50);

  const res = calcPolyhouse(areaSqM, cropType, subsidyPct);

  return (
    <div>
      <PanelHeader icon="🏛️" title="Polyhouse & Greenhouse Profitability Calculator" subtitle="Estimate polyhouse construction costs, government subsidies, and high-value crop returns" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <InputWithVoice label="Polyhouse Covered Area (Sq. Meters)" value={areaSqM} onChange={setAreaSqM} resetValue={1000} lang={lang} />
          <FormRow label="Protected Crop Type">
            <Select value={cropType} onChange={setCropType}>
              <option value="capsicum">Color Capsicum / Bell Pepper (शिमला मिर्च)</option>
              <option value="cucumber">Dutch Seedless Cucumber (खीरा)</option>
              <option value="rose">Dutch Cut-Flower Roses (गुलाब)</option>
              <option value="tomato">Polyhouse Indeterminate Tomato (टमाटर)</option>
            </Select>
          </FormRow>
          <FormRow label="NHB / Mission for Integrated Horticulture Subsidy">
            <Select value={subsidyPct} onChange={setSubsidyPct}>
              <option value="50">50% General Capital Subsidy (NHB / SHM)</option>
              <option value="75">75% High Subsidy (NE & Himalayan States)</option>
              <option value="85">85% State Specific Polyhouse Incentive</option>
            </Select>
          </FormRow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Polyhouse Structure Cost" value={`₹${fmt(res.grossStructureCost)}`} color={C.purple} sub={`@ ₹950 per sq. meter benchmark`} />
          <Grid cols={2}>
            <ResultCard label="NHB / Govt Subsidy" value={`₹${fmt(res.subsidyAmount)}`} color={C.green} sub={`${subsidyPct}% Subsidy`} />
            <ResultCard label="Farmer Capital Investment" value={`₹${fmt(res.farmerShare)}`} color={C.blue} />
          </Grid>
          <BigResult label={`Annual Harvest (${res.cropName})`} value={`${fmt(res.annualYieldTotal)} kg/units`} color={C.amber} />
          <BigResult label="Annual Net Operating Profit" value={`₹${fmt(res.annualNetProfit)}`} color={res.annualNetProfit >= 0 ? C.green : C.red} sub={`Gross Income: ₹${fmt(res.annualGrossRevenue)} | OpEx: ₹${fmt(res.annualOperatingCost)}`} />
        </div>
      </div>
    </div>
  );
}

// 23. Organic & Bio-Inputs Panel
function OrganicInputsPanel({ gs, lang }) {
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);

  const acres = toAcres(area, unit);
  const res = calcOrganicInputs(acres);

  return (
    <div>
      <PanelHeader icon="🍃" title="Organic Farming & Bio-Input Requirement Calculator" subtitle="Determine Vermicompost, Neem Cake, Bio-NPK, and Jeevamrut quantities per acre" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1} lang={lang} />
          <FormRow label="Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>ORGANIC PACKAGE REQUIREMENTS</div>
            <Grid cols={2}>
              <ResultCard label="Vermicompost" value={`${res.vermicompostTonnes} Tonnes`} color={C.green} sub="Base organic manure" />
              <ResultCard label="Neem Cake (खली)" value={`${res.neemCakeKg} kg`} color={C.amber} sub="Nematode & Pest repellent" />
              <ResultCard label="Bio-NPK Consortium" value={`${res.bioNpkLiters} Liters`} color={C.blue} sub="Azotobacter + PSB + KSB" />
              <ResultCard label="Trichoderma Viride" value={`${res.trichodermaKg} kg`} color={C.purple} sub="Bio-fungicide root treatment" />
            </Grid>
          </div>
          <BigResult label="Jeevamrut Preparation Water" value={`${res.jeevamrutLiters} Liters`} color={C.cyan} sub="Distributed across 4 irrigation passes" />
          <BigResult label="Estimated Organic Input Cost" value={`₹${fmt(res.totalOrganicCost)}`} color={C.green} />
          <Disclaimer text="Paramparagat Krishi Vikas Yojana (PKVY) provides up to ₹50,000 per hectare financial assistance for 3 years for organic cluster farming." />
        </div>
      </div>
    </div>
  );
}

// Settings Panel
function SettingsPanel({ cropData, setCropData, fertilizerData, setFertilizerData, lang }) {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [seedRate, setSeedRate] = useState(20);
  const [typicalCost, setTypicalCost] = useState(15000);
  const [yieldVal, setYieldVal] = useState(20);

  useEffect(() => {
    const c = cropData[selectedCrop];
    if (c) {
      setSeedRate(c.seedRateKgAcre);
      setTypicalCost(c.typicalCostAcre);
      setYieldVal(c.yieldQtlAcre);
    }
  }, [selectedCrop, cropData]);

  const handleUpdate = () => {
    setCropData(prev => ({
      ...prev,
      [selectedCrop]: {
        ...prev[selectedCrop],
        seedRateKgAcre: parseFloat(seedRate),
        typicalCostAcre: parseFloat(typicalCost),
        yieldQtlAcre: parseFloat(yieldVal)
      }
    }));
    alert("Administrative baseline configuration parameters successfully updated!");
  };

  return (
    <div>
      <PanelHeader icon="⚙️" title="Administrator Config & Baselines" subtitle="Customize default crop rates, yield targets, and baseline expenses" />
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
        <FormRow label="Select Crop Template to Modify">
          <Select value={selectedCrop} onChange={setSelectedCrop}>
            {Object.entries(cropData).map(([k, d]) => <option key={k} value={k}>{d.icon} {d.name}</option>)}
          </Select>
        </FormRow>
        <InputWithVoice label="Baseline Seed Rate (kg/acre)" value={seedRate} onChange={setSeedRate} resetValue={20} lang={lang} />
        <InputWithVoice label="Baseline Production Cost (₹/acre)" value={typicalCost} onChange={setTypicalCost} resetValue={15000} lang={lang} />
        <InputWithVoice label="Baseline Expected Yield (Quintals/acre)" value={yieldVal} onChange={setYieldVal} resetValue={20} lang={lang} />
        
        <button
          onClick={handleUpdate}
          style={{
            width: '100%', padding: '12px', background: C.green, color: '#fff',
            border: 'none', borderRadius: 10, cursor: 'pointer',
            fontWeight: 700, fontSize: '0.85rem', marginTop: 14
          }}
        >
          Save Configurations Globally
        </button>
      </div>
    </div>
  );
}

// History Panel
function HistoryPanel({ saved, onLoad, onDelete }) {
  if (saved.length === 0) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.35)' }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>🕐</div>
      <p>No saved calculations yet.</p>
    </div>
  );
  return (
    <div>
      <PanelHeader icon="🕐" title="Saved Calculations" subtitle="View and edit historical farm calculation projections" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {saved.map(s => (
          <div key={s.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, color: C.green, fontSize: '0.92rem' }}>{s.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.date} · Crop: {s.crop} · Area: {s.area} {s.unit}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onLoad(s)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: C.green, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Restore</button>
              <button onClick={() => onDelete(s.id)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: C.red, cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN HUB COMPONENT ────────────────────────────────────────────────────────
export function CalculatorTab() {
  const { lang, setActiveTab } = useApp();

  // Settings baselines loaded from localstorage or defaulting
  const [cropData, setCropData] = useState(() => {
    const local = localStorage.getItem('krishi_config_crops');
    return local ? JSON.parse(local) : DEFAULT_CROP_DATA;
  });
  const [fertilizerData, setFertilizerData] = useState(() => {
    const local = localStorage.getItem('krishi_config_fertilizers');
    return local ? JSON.parse(local) : DEFAULT_FERTILIZER_DATA;
  });

  // Save to local storage when configured
  useEffect(() => {
    localStorage.setItem('krishi_config_crops', JSON.stringify(cropData));
  }, [cropData]);
  useEffect(() => {
    localStorage.setItem('krishi_config_fertilizers', JSON.stringify(fertilizerData));
  }, [fertilizerData]);

  // Global integrated calculator state
  const [activeCalc, setActiveCalcRaw] = useState('dashboard');
  const [gs, setGs] = useState({ crop: 'wheat', area: 1.0, unit: 'acre' });
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('krishi_saved_calcs') || '[]'));
  const [saveModal, setSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dynamic shared cost channel
  const [calculatedCosts, setCalculatedCosts] = useState({ totalCost: 0, yieldExpected: 25 });

  const handleSaveCalculatedCosts = (totalCost, yieldExpected) => {
    setCalculatedCosts({ totalCost, yieldExpected });
  };

  const setActiveCalc = (id) => {
    if (id === 'rentals_tab_proxy') { setActiveTab('rentals'); return; }
    setActiveCalcRaw(id);
  };

  const saveCalc = () => {
    const newSave = {
      id: Date.now(), name: saveName || `Calc ${saved.length + 1}`,
      date: new Date().toLocaleDateString('en-IN'), ...gs
    };
    const updated = [newSave, ...saved];
    setSaved(updated);
    localStorage.setItem('krishi_saved_calcs', JSON.stringify(updated));
    setSaveModal(false); setSaveName('');
  };

  const deleteCalc = (id) => {
    const updated = saved.filter(s => s.id !== id);
    setSaved(updated);
    localStorage.setItem('krishi_saved_calcs', JSON.stringify(updated));
  };

  const loadCalc = (s) => {
    setGs({ crop: s.crop, area: s.area, unit: s.unit });
    setActiveCalcRaw('dashboard');
  };

  const navItems = getNavItems(lang);
  const groupLabels = getGroupLabels(lang);
  const groups = [...new Set(navItems.map(n => n.group))];

  return (
    <div className="tab-panel active" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* ── Global Header Info Bar ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(96,165,250,0.08))',
        border: '1px solid rgba(34,197,94,0.25)', borderRadius: 16, padding: '16px 20px',
        marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 12
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.8rem' }}>🧮</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{t('title', lang)}</h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
                {t('subtitle', lang)}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.print()} style={{
              padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              {t('printSheet', lang)}
            </button>
            <button onClick={() => setSaveModal(true)} style={{
              padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(96,165,250,0.3)',
              background: 'rgba(96,165,250,0.15)', color: C.blue, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600
            }}>{t('save', lang)}</button>
            <button onClick={() => setActiveCalcRaw('history')} style={{
              padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.82rem'
            }}>{t('history', lang)}</button>
          </div>
        </div>

        {/* Quick Presets Ribbon */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: 12 }}>
          {/* Quick Land Size Presets */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{t('quickLand', lang)}</span>
            {[
              { label: '1 Acre', area: 1, unit: 'acre' },
              { label: '2 Acres', area: 2, unit: 'acre' },
              { label: '5 Acres', area: 5, unit: 'acre' },
              { label: '10 Acres', area: 10, unit: 'acre' },
              { label: '1 Bigha', area: 1, unit: 'bigha_pucca' },
              { label: '1 Hectare', area: 1, unit: 'hectare' }
            ].map(p => (
              <button 
                key={p.label}
                onClick={() => setGs(prev => ({ ...prev, area: p.area, unit: p.unit }))}
                style={{
                  padding: '4px 10px', borderRadius: 20, border: gs.area === p.area && gs.unit === p.unit ? `1px solid ${C.green}` : '1px solid rgba(255,255,255,0.15)',
                  background: gs.area === p.area && gs.unit === p.unit ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                  color: gs.area === p.area && gs.unit === p.unit ? C.green : 'rgba(255,255,255,0.8)',
                  cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ height: 16, width: 1, background: 'rgba(255,255,255,0.15)' }} />

          {/* Quick Crop Selector */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{t('selectCrop', lang)}</span>
            <CropSelect cropData={cropData} value={gs.crop} onChange={v => setGs(p => ({ ...p, crop: v }))} lang={lang} />
          </div>
        </div>

        {/* Top Horizontal Scrollable Quick Calculator Ribbon */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'thin' }}>
          {navItems.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCalc(c.id)}
              style={{
                flexShrink: 0, padding: '8px 14px', borderRadius: 10,
                border: activeCalc === c.id ? `1px solid ${C.green}` : '1px solid rgba(255,255,255,0.1)',
                background: activeCalc === c.id ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.04)',
                color: activeCalc === c.id ? '#fff' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: activeCalc === c.id ? 700 : 500,
                display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
              }}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Layout Workspace ── */}
      <div style={{ display: 'flex', gap: 14, minHeight: '70vh' }}>
        {/* Sidebar Nav */}
        <div style={{
          width: sidebarOpen ? 210 : 52, flexShrink: 0, transition: 'width 0.2s',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: '8px 6px', overflowY: 'auto', overflowX: 'hidden'
        }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{
            width: '100%', padding: '6px 8px', borderRadius: 8, border: 'none',
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer', marginBottom: 10, fontSize: '0.8rem',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            {sidebarOpen ? '◀' : '▶'}
            {sidebarOpen && <span>{t('allCalculators', lang)}</span>}
          </button>

          {groups.map(group => {
            const gl = groupLabels[group];
            const groupItems = navItems.filter(n => n.group === group);
            return (
              <div key={group} style={{ marginBottom: 8 }}>
                {sidebarOpen && (
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', color: gl.color, textTransform: 'uppercase', padding: '4px 8px', marginBottom: 2 }}>
                    {gl.label}
                  </div>
                )}
                {groupItems.map(item => (
                  <button key={item.id} onClick={() => setActiveCalc(item.id)} style={{
                    width: '100%', padding: sidebarOpen ? '8px 10px' : '8px',
                    borderRadius: 8, border: 'none', marginBottom: 2, cursor: 'pointer',
                    background: activeCalc === item.id ? `${gl.color}20` : 'transparent',
                    borderLeft: activeCalc === item.id ? `3px solid ${gl.color}` : '3px solid transparent',
                    display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
                    color: activeCalc === item.id ? gl.color : 'rgba(255,255,255,0.5)',
                    fontSize: '0.82rem', fontWeight: activeCalc === item.id ? 700 : 400,
                    textAlign: 'left', whiteSpace: 'nowrap'
                  }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Workspace Display */}
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.2rem', overflowY: 'auto' }}>
          {activeCalc === 'dashboard'    && <DashboardPanel gs={gs} cropData={cropData} lang={lang} />}
          {activeCalc === 'area'         && <AreaPanel gs={gs} setGs={setGs} lang={lang} />}
          {activeCalc === 'seed'         && <SeedPanel gs={gs} setGs={setGs} cropData={cropData} lang={lang} />}
          {activeCalc === 'fertilizer'   && <FertilizerPanel gs={gs} fertilizerData={fertilizerData} cropData={cropData} lang={lang} />}
          {activeCalc === 'irrigation'   && <IrrigationPanel gs={gs} cropData={cropData} lang={lang} />}
          {activeCalc === 'solar_pump'   && <SolarPumpPanel gs={gs} lang={lang} />}
          {activeCalc === 'drip_calc'    && <DripCalcPanel gs={gs} lang={lang} />}
          {activeCalc === 'spray'        && <SprayPanel gs={gs} cropData={cropData} lang={lang} />}
          {activeCalc === 'organic_calc' && <OrganicInputsPanel gs={gs} lang={lang} />}
          {activeCalc === 'labour'       && <LabourPanel gs={gs} lang={lang} />}
          {activeCalc === 'machinery'    && <MachineryPanel gs={gs} setActiveCalc={setActiveCalc} lang={lang} />}
          {activeCalc === 'polyhouse'    && <PolyhousePanel lang={lang} />}
          {activeCalc === 'cattle_fodder'&& <CattleFodderPanel lang={lang} />}
          {activeCalc === 'farmcost'     && <FarmCostPanel gs={gs} cropData={cropData} lang={lang} onSaveCalculatedCosts={handleSaveCalculatedCosts} />}
          {activeCalc === 'profit'       && <ProfitPanel gs={gs} cropData={cropData} calculatedCosts={calculatedCosts} lang={lang} />}
          {activeCalc === 'breakeven'    && <BreakEvenPanel lang={lang} />}
          {activeCalc === 'loan'         && <LoanPanel lang={lang} />}
          {activeCalc === 'roi'          && <ROIPanel lang={lang} />}
          {activeCalc === 'crop_compare' && <CropComparePanel gs={gs} cropData={cropData} lang={lang} />}
          {activeCalc === 'mandi_profit' && <MandiProfitPanel gs={gs} cropData={cropData} lang={lang} />}
          {activeCalc === 'storage'      && <StoragePanel cropData={cropData} lang={lang} />}
          {activeCalc === 'multicrop'    && <MultiCropPanel gs={gs} cropData={cropData} lang={lang} />}
          {activeCalc === 'settings'     && <SettingsPanel cropData={cropData} setCropData={setCropData} fertilizerData={fertilizerData} setFertilizerData={setFertilizerData} lang={lang} />}
          {activeCalc === 'history'      && <HistoryPanel saved={saved} onLoad={loadCalc} onDelete={deleteCalc} />}
        </div>
      </div>

      {/* Save Modal */}
      {saveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
          onClick={e => e.target === e.currentTarget && setSaveModal(false)}>
          <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: 18, padding: '1.8rem', maxWidth: 400, width: '90%' }}>
            <h3 style={{ margin: '0 0 16px', color: C.blue }}>💾 Save Calculation</h3>
            <Label>Give this calculation a name</Label>
            <input 
              type="text" value={saveName} onChange={e => setSaveName(e.target.value)} 
              placeholder={`e.g. Wheat Kharif 2026`} 
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', fontSize: '0.92rem', boxSizing: 'border-box', marginBottom: 16
              }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setSaveModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveCalc} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${C.blue}, #2563eb)`, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
