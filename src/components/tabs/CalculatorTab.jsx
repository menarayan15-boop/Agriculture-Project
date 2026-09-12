import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { getCropDisplayName } from '../../data/constants';
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
    nav_settings: "Admin Settings",
    nav_history: "Saved Calculations",
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
    nav_settings: "व्यवस्थापक सेटिंग्स",
    nav_history: "सहेजे गए गणनाएं",
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
    nav_settings: "ಆಡಳಿತ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    nav_history: "ಉಳಿಸಿದ ಲೆಕ್ಕಾಚಾರಗಳು",
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
    nav_settings: "అడ్మిన్ సెట్టింగ్‌లు",
    nav_history: "సేవ్ చేసిన లెక్కలు",
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
    nav_settings: "நிர்வாக அமைப்புகள்",
    nav_history: "சேமிக்கப்பட்ட கணக்கீடுகள்",
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
    nav_settings: "ਐਡਮਿਨ ਸੈਟਿੰਗਾਂ",
    nav_history: "ਸੰਭਾਲੀਆਂ ਗਈਆਂ ਗਣਨਾਵਾਂ",
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
    nav_settings: "प्रशासक सेटिंग्ज",
    nav_history: "जतन केलेली गणिते",
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
    nav_settings: "অ্যাডমিন সেটিংস",
    nav_history: "সংরক্ষিত গণনা",
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
    nav_settings: "એડમિન સેટિંગ્સ",
    nav_history: "સાચવેલ ગણતરીઓ",
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
    nav_settings: "ପ୍ରଶାସକ ସେଟିଙ୍ଗ୍",
    nav_history: "ସଂରକ୍ଷିତ ହିସାବ",
  }
};

// Translation helper
function t(key, lang = 'en') {
  if (CALC_LANG[lang] && CALC_LANG[lang][key]) return CALC_LANG[lang][key];
  if (CALC_LANG.en && CALC_LANG.en[key]) return CALC_LANG.en[key];
  return key;
}

const C = {
  green: '#15803D', blue: '#2563EB', amber: '#D97706',
  red: '#DC2626', purple: '#7C3AED', cyan: '#0891B2', rose: '#E11D48'
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
  { id: 'crop_compare', icon: '🆚', label: 'Crop Comparison', group: 'advanced' },
  { id: 'mandi_profit', icon: '🏪', label: 'Mandi Net Price', group: 'advanced' },
  { id: 'storage',      icon: '🏗️', label: 'Storage/Warehouse',group: 'advanced' },
  { id: 'settings',     icon: '⚙️', label: 'Admin Settings',  group: 'settings'  },
  { id: 'history',      icon: '🕐', label: 'Saved Calcs',     group: 'history'  },
];

const GROUP_LABELS = {
  overview: { label: 'Overview', color: C.cyan },
  basics:   { label: '🌾 Farm Basics', color: C.green },
  resources:{ label: '💧 Resources', color: C.blue },
  operations:{ label: '⚙️ Operations', color: C.amber },
  advanced: { label: '📊 Advanced', color: C.rose },
  settings: { label: '⚙️ Config', color: '#64748B' },
  history:  { label: '🕐 History', color: '#64748B' },
};

// ── Shared UI Components ──────────────────────────────────────────────────────

function Label({ children, hint, lang = 'en' }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 600 }}>{children}</span>
      {hint && <span style={{ fontSize: '0.72rem', color: '#6B7280', marginLeft: 6 }}>({hint})</span>}
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
              style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '0.72rem' }}
            >
              🔄
            </button>
          )}
          <button
            onClick={startVoiceInput}
            title={listening ? CALC_LANG[lang].voiceActive : CALC_LANG[lang].voiceHint}
            style={{
              background: listening ? C.red : '#F3F4F6',
              border: listening ? 'none' : '1px solid #E5E7EB',
              borderRadius: 6, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: listening ? '#fff' : '#4B5563', fontSize: '0.7rem'
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
            background: '#FFFFFF', 
            border: `1px solid ${warnClass !== 'transparent' ? warnClass : '#E5E7EB'}`,
            color: '#17211B', fontSize: '0.92rem', boxSizing: 'border-box', boxShadow: '0 1px 2px rgba(0,0,0,0.03)', ...style
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
        background: '#FFFFFF', border: '1px solid #E5E7EB',
        color: '#17211B', fontSize: '0.92rem', boxSizing: 'border-box', cursor: 'pointer',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)', ...style
      }}>
      {children}
    </select>
  );
}

function CropSelect({ value, onChange, cropData, lang = 'en' }) {
  return (
    <Select value={value} onChange={onChange}>
      {Object.entries(cropData).map(([k, v]) => {
        const localizedName = getCropDisplayName(k, lang);
        const cropName = localizedName ? `${v.icon} ${localizedName}` : (lang === 'hi' && v.nameHi ? `${v.icon} ${v.nameHi}` : `${v.icon} ${v.name}`);
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
    { id: 'crop_compare', icon: '🆚', label: t('nav_crop_compare', lang),    group: 'advanced' },
    { id: 'mandi_profit', icon: '🏪', label: t('nav_mandi_profit', lang),    group: 'advanced' },
    { id: 'storage',      icon: '🏗️', label: t('nav_storage', lang),         group: 'advanced' },
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
    advanced:   { label: t('group_advanced', lang), color: C.rose },
    settings:   { label: t('group_settings', lang), color: '#64748B' },
    history:    { label: t('group_history', lang), color: '#64748B' },
  };
}

function FormRow({ label, hint, children, onReset }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Label hint={hint}>{label}</Label>
        {onReset && (
          <button onClick={onReset} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '0.72rem' }}>
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
      background: '#FFFFFF', border: '1px solid #E5E7EB',
      borderRadius: 12, padding: '14px 16px', textAlign: 'center',
      transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      <div style={{ position: 'absolute', right: -6, top: -6, fontSize: '2.5rem', opacity: 0.05 }}>{icon}</div>
      {icon && <div style={{ fontSize: '1.4rem', marginBottom: 2 }}>{icon}</div>}
      <div style={{ fontSize: '0.72rem', color: '#6B7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '1.25rem', fontWeight: 800, color }}>{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: '#6B7280', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function BigResult({ label, value, color = C.green, sub }) {
  return (
    <div style={{
      background: '#FFFFFF', border: `1px solid #E5E7EB`, borderLeft: `4px solid ${color}`,
      borderRadius: 14, padding: '16px 20px', marginBottom: 12,
      boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
    }}>
      <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 900, color }}>{value}</div>
      {sub && <div style={{ fontSize: '0.8rem', color: '#4B5563', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function PanelHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: '1.2rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.8rem' }}>
      <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8, color: '#17211B' }}>
        <span style={{ fontSize: '1.4rem' }}>{icon}</span> {title}
      </h3>
      {subtitle && <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#6B7280' }}>{subtitle}</p>}
    </div>
  );
}

function Disclaimer({ text, lang = 'en' }) {
  return (
    <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 10, padding: '8px 12px', marginTop: 12 }}>
      <p style={{ margin: 0, fontSize: '0.75rem', color: '#92400E', lineHeight: 1.6, fontWeight: 500 }}>
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

  const cropTitle = getCropDisplayName(gs.crop || crop, lang) || (lang === 'hi' && crop.nameHi ? crop.nameHi : crop.name);

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
        <div style={{ background: '#F8FAF9', border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, fontSize: '0.82rem', lineHeight: 1.7, color: '#374151' }}>
          <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Based on your land size, seed rate calculation indicates you will need approximately <strong style={{ color: '#17211B' }}>{seed.qty.toFixed(1)} kg</strong> of seed.</li>
            <li>Recommended base fertilizer expense sits at around <strong style={{ color: '#17211B' }}>₹{fert.totalCost.toLocaleString('en-IN')}</strong> using balanced application.</li>
            <li>Expected break-even market price for this yield and cost structure is approximately <strong style={{ color: '#17211B' }}>₹{(totalCost / (crop.yieldQtlAcre * acres || 1)).toFixed(0)}/Quintal</strong>.</li>
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button 
              onClick={() => setUseDimensions(true)} 
              style={{
                flex: 1, padding: 8, borderRadius: 8, border: useDimensions ? '1px solid #15803D' : '1px solid #E5E7EB',
                background: useDimensions ? '#15803D' : '#F9FAFB',
                color: useDimensions ? '#fff' : '#4B5563', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem'
              }}
            >
              📏 Enter Dimensions
            </button>
            <button 
              onClick={() => setUseDimensions(false)} 
              style={{
                flex: 1, padding: 8, borderRadius: 8, border: !useDimensions ? '1px solid #15803D' : '1px solid #E5E7EB',
                background: !useDimensions ? '#15803D' : '#F9FAFB',
                color: !useDimensions ? '#fff' : '#4B5563', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem'
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
              width: '100%', padding: '10px 14px', background: '#F0FDF4',
              color: '#15803D', border: '1px solid #86EFAC', borderRadius: 10,
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
          <div style={{ background: '#F8FAF9', border: '1px solid #E5E7EB', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: '0.72rem', color: '#6B7280', marginBottom: 6, textTransform: 'uppercase', fontWeight: 700 }}>NPK Requirement Breakdown</div>
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
  const [cropList, setCropList] = useState(['wheat', 'mustard', 'chana', 'potato']);
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);

  const acres = toAcres(area, unit);

  // Quick Preset Handlers
  const loadPreset = (crops) => {
    setCropList(crops);
  };

  const addCrop = () => {
    if (cropList.length >= 4) return;
    const allKeys = Object.keys(cropData);
    const nextKey = allKeys.find(k => !cropList.includes(k)) || 'rice';
    setCropList(prev => [...prev, nextKey]);
  };

  const removeCrop = (idx) => {
    if (cropList.length <= 2) return;
    setCropList(prev => prev.filter((_, i) => i !== idx));
  };

  const comparisons = cropList.map(cropKey => {
    const cropInfo = cropData[cropKey] || DEFAULT_CROP_DATA[cropKey] || DEFAULT_CROP_DATA.wheat;
    const cost = (cropInfo.typicalCostAcre || 15000) * acres;
    const yieldExpected = (cropInfo.yieldQtlAcre || 20) * acres;
    const price = cropInfo.marketPrice || cropInfo.msp || 2000;
    const revenue = yieldExpected * price;
    const profit = revenue - cost;
    const profitPerAcre = acres > 0 ? profit / acres : 0;
    const roi = cost > 0 ? (profit / cost) * 100 : 0;
    const breakeven = yieldExpected > 0 ? cost / yieldExpected : 0;
    const waterLit = (cropInfo.waterLitAcre || 500000) * acres;
    const irrigations = cropInfo.irrigations || 5;
    const seedKg = (cropInfo.seedRateKgAcre || 20) * acres;
    const days = cropInfo.daysToMature || 120;
    const season = cropInfo.season || 'All';
    const isMsp = !!cropInfo.msp;

    return {
      cropKey,
      name: cropInfo.name,
      nameHi: cropInfo.nameHi,
      icon: cropInfo.icon,
      cost,
      yieldExpected,
      price,
      revenue,
      profit,
      profitPerAcre,
      roi,
      breakeven,
      waterLit,
      irrigations,
      seedKg,
      seedUnit: cropInfo.seedUnit || 'kg',
      days,
      season,
      isMsp
    };
  });

  const lowestInvestment = [...comparisons].sort((a, b) => a.cost - b.cost)[0];
  const highestProfit = [...comparisons].sort((a, b) => b.profit - a.profit)[0];
  const highestYield = [...comparisons].sort((a, b) => b.yieldExpected - a.yieldExpected)[0];
  const lowestBreakeven = [...comparisons].sort((a, b) => a.breakeven - b.breakeven)[0];
  const shortestDuration = [...comparisons].sort((a, b) => a.days - b.days)[0];
  const mostWaterEfficient = [...comparisons].sort((a, b) => a.waterLit - b.waterLit)[0];

  return (
    <div>
      <PanelHeader icon="🆚" title={t('nav_crop_compare', lang) || "Crop Comparison Calculator"} subtitle="Compare expected financial returns, input requirements, and profit margins of up to 4 crops side-by-side" />
      
      {/* Land Area and Unit Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: 14 }}>
        <InputWithVoice label={t('landArea', lang) || "Land Area"} value={area} onChange={setArea} resetValue={1.0} lang={lang} />
        <FormRow label="Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
      </div>

      {/* Preset Comparison Buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14, padding: '10px 14px', background: '#F8FAF9', borderRadius: 12, border: '1px solid #E5E7EB' }}>
        <span style={{ fontSize: '0.78rem', color: '#4B5563', fontWeight: 700 }}>Quick Presets:</span>
        <button onClick={() => loadPreset(['wheat', 'mustard', 'chana', 'potato'])} style={{ padding: '6px 12px', borderRadius: 20, background: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}>
          🌾 Rabi Season (Wheat / Mustard / Gram / Potato)
        </button>
        <button onClick={() => loadPreset(['rice', 'cotton', 'maize', 'soybean'])} style={{ padding: '6px 12px', borderRadius: 20, background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}>
          🍚 Kharif Season (Paddy / Cotton / Maize / Soybean)
        </button>
        <button onClick={() => loadPreset(['tomato', 'onion', 'chilli', 'garlic'])} style={{ padding: '6px 12px', borderRadius: 20, background: '#FEF3C7', border: '1px solid #FDE68A', color: '#B45309', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}>
          🍅 High-Value Cash Crops (Tomato / Onion / Chilli / Garlic)
        </button>
      </div>

      {/* Crop Selector Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cropList.length}, 1fr)`, gap: 10, marginBottom: 14 }}>
        {cropList.map((cKey, idx) => (
          <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <Label>Crop {idx + 1}</Label>
              {cropList.length > 2 && (
                <button onClick={() => removeCrop(idx)} style={{ background: 'transparent', border: 'none', color: C.red, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }} title="Remove this crop">
                  ✕ Remove
                </button>
              )}
            </div>
            <Select value={cKey} onChange={v => setCropList(p => {
              const next = [...p];
              next[idx] = v;
              return next;
            })}>
              {Object.entries(cropData).map(([k, d]) => (
                <option key={k} value={k}>{d.icon} {getCropDisplayName(k, lang) || d.name}</option>
              ))}
            </Select>
          </div>
        ))}
      </div>

      {cropList.length < 4 && (
        <button onClick={addCrop} style={{ marginBottom: 14, padding: '8px 16px', borderRadius: 10, background: '#F0FDF4', border: '1px dashed #86EFAC', color: '#15803D', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
          ➕ Add 4th Crop to Compare
        </button>
      )}

      {/* Full Comparison Table */}
      <div style={{ overflowX: 'auto', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: 14, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
              <th style={{ textAlign: 'left', padding: '12px 10px', color: '#17211B', fontWeight: 800 }}>Parameter / Metric</th>
              {comparisons.map((c, i) => (
                <th key={i} style={{ textAlign: 'right', padding: '12px 10px', color: '#15803D', fontSize: '0.95rem', fontWeight: 800 }}>
                  {c.icon} {getCropDisplayName(c.cropKey, lang) || c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '10px 8px', color: '#374151', fontWeight: 600 }}>Benchmark Price (₹/Qtl)</td>
              {comparisons.map((c, i) => (
                <td key={i} style={{ textAlign: 'right', padding: '10px 8px', color: C.blue, fontWeight: 700 }}>
                  ₹{fmt(c.price)} {c.isMsp ? <span style={{ fontSize: '0.72rem', color: C.green }}>(MSP)</span> : <span style={{ fontSize: '0.72rem', color: C.amber }}>(Mkt)</span>}
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '10px 8px', color: '#374151', fontWeight: 600 }}>Season & Duration</td>
              {comparisons.map((c, i) => (
                <td key={i} style={{ textAlign: 'right', padding: '10px 8px', color: '#4B5563', fontWeight: 600 }}>
                  {c.season} · {c.days} days
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '10px 8px', color: '#374151', fontWeight: 600 }}>Seed Quantity Needed</td>
              {comparisons.map((c, i) => (
                <td key={i} style={{ textAlign: 'right', padding: '10px 8px', color: '#17211B', fontWeight: 600 }}>
                  {c.seedKg.toFixed(1)} {c.seedUnit}
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '10px 8px', color: '#374151', fontWeight: 600 }}>Total Irrigation Water</td>
              {comparisons.map((c, i) => (
                <td key={i} style={{ textAlign: 'right', padding: '10px 8px', color: C.cyan, fontWeight: 700 }}>
                  {fmt(c.waterLit)} L ({c.irrigations} rounds)
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '10px 8px', color: '#374151', fontWeight: 600 }}>Total Cultivation Cost</td>
              {comparisons.map((c, i) => (
                <td key={i} style={{ textAlign: 'right', padding: '10px 8px', color: C.rose, fontWeight: 700 }}>
                  ₹{fmt(c.cost)}
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '10px 8px', color: '#374151', fontWeight: 600 }}>Expected Yield ({acres.toFixed(1)} ac)</td>
              {comparisons.map((c, i) => (
                <td key={i} style={{ textAlign: 'right', padding: '10px 8px', color: '#17211B', fontWeight: 700 }}>
                  {c.yieldExpected.toFixed(1)} Qtl
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '10px 8px', color: '#374151', fontWeight: 600 }}>Gross Sales Revenue</td>
              {comparisons.map((c, i) => (
                <td key={i} style={{ textAlign: 'right', padding: '10px 8px', color: C.blue, fontWeight: 700 }}>
                  ₹{fmt(c.revenue)}
                </td>
              ))}
            </tr>
            <tr style={{ borderTop: '2px solid #BBF7D0', background: '#F0FDF4', fontWeight: 700, fontSize: '0.95rem' }}>
              <td style={{ padding: '12px 10px', color: '#15803D', fontWeight: 800 }}>Expected Net Profit</td>
              {comparisons.map((c, i) => (
                <td key={i} style={{ textAlign: 'right', padding: '12px 10px', color: c.profit >= 0 ? '#15803D' : C.red, fontWeight: 800 }}>
                  ₹{fmt(c.profit)}
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '10px 8px', color: '#374151', fontWeight: 600 }}>Profit Per Acre</td>
              {comparisons.map((c, i) => (
                <td key={i} style={{ textAlign: 'right', padding: '10px 8px', color: c.profitPerAcre >= 0 ? '#15803D' : C.red, fontWeight: 700 }}>
                  ₹{fmt(c.profitPerAcre)}/ac
                </td>
              ))}
            </tr>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '10px 8px', color: '#374151', fontWeight: 600 }}>Return on Investment (ROI)</td>
              {comparisons.map((c, i) => (
                <td key={i} style={{ textAlign: 'right', padding: '10px 8px', fontWeight: 800, color: c.roi >= 0 ? '#15803D' : C.red }}>
                  {c.roi.toFixed(1)}%
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: '10px 8px', color: '#374151', fontWeight: 600 }}>Break-Even Selling Price</td>
              {comparisons.map((c, i) => (
                <td key={i} style={{ textAlign: 'right', padding: '10px 8px', color: C.amber, fontWeight: 700 }}>
                  ₹{c.breakeven.toFixed(0)}/Qtl
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Strategic Decision Highlight Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <ResultCard 
          label="🏆 Highest Net Profit" 
          value={`${highestProfit?.icon} ${getCropDisplayName(highestProfit?.cropKey, lang) || highestProfit?.name}`} 
          sub={`₹${fmt(highestProfit?.profit)} (${highestProfit?.roi.toFixed(0)}% ROI)`} 
          color={C.green} 
        />
        <ResultCard 
          label="🛡️ Lowest Capital Needed" 
          value={`${lowestInvestment?.icon} ${getCropDisplayName(lowestInvestment?.cropKey, lang) || lowestInvestment?.name}`} 
          sub={`₹${fmt(lowestInvestment?.cost)} Total Cost`} 
          color={C.blue} 
        />
        <ResultCard 
          label="💧 Most Water-Efficient" 
          value={`${mostWaterEfficient?.icon} ${getCropDisplayName(mostWaterEfficient?.cropKey, lang) || mostWaterEfficient?.name}`} 
          sub={`${fmt(mostWaterEfficient?.waterLit)} Liters (${mostWaterEfficient?.irrigations} irrigations)`} 
          color={C.cyan} 
        />
        <ResultCard 
          label="⚡ Fastest Harvest" 
          value={`${shortestDuration?.icon} ${getCropDisplayName(shortestDuration?.cropKey, lang) || shortestDuration?.name}`} 
          sub={`${shortestDuration?.days} Days (${shortestDuration?.season})`} 
          color={C.amber} 
        />
      </div>
    </div>
  );
}

// 13. Mandi Price & Net Profit Calculator
function MandiProfitPanel({ gs, cropData, lang }) {
  const [crop, setCrop] = useState(gs.crop);
  const [qty, setQty] = useState(50); // Quintals
  const [mandiPrice, setMandiPrice] = useState(() => {
    const c = cropData[gs.crop] || DEFAULT_CROP_DATA[gs.crop];
    return c?.marketPrice || c?.msp || 2200;
  });

  // Dynamic logistics & deduction factors
  const [distanceKm, setDistanceKm] = useState(25);
  const [transportRateQtl, setTransportRateQtl] = useState(30); // ₹30/qtl freight
  const [hamaliPerQtl, setHamaliPerQtl] = useState(12); // ₹12/qtl loading & unloading
  const [mandiCessPct, setMandiCessPct] = useState(1.5); // 1.5% Mandi Cess
  const [commissionPct, setCommissionPct] = useState(1.5); // 1.5% Arhat/commission
  const [weighingFee, setWeighingFee] = useState(60); // Flat Dharamkanta fee
  const [packagingPerQtl, setPackagingPerQtl] = useState(40); // Gunny bags / bardana ₹40/qtl

  // Update mandiPrice automatically when selected crop changes
  useEffect(() => {
    const c = cropData[crop] || DEFAULT_CROP_DATA[crop];
    if (c) {
      setMandiPrice(c.marketPrice || c.msp || 2200);
    }
  }, [crop, cropData]);

  const numQty = Math.max(0, parseFloat(qty) || 0);
  const numPrice = Math.max(0, parseFloat(mandiPrice) || 0);
  const grossVal = numQty * numPrice;

  // Logistics & Mandi Fees Breakdown
  const transportTotal = numQty * (parseFloat(transportRateQtl) || 0);
  const hamaliTotal = numQty * (parseFloat(hamaliPerQtl) || 0);
  const mandiCessTotal = (grossVal * (parseFloat(mandiCessPct) || 0)) / 100;
  const commissionTotal = (grossVal * (parseFloat(commissionPct) || 0)) / 100;
  const packagingTotal = numQty * (parseFloat(packagingPerQtl) || 0);
  const weighingTotal = parseFloat(weighingFee) || 0;

  const totalSellingExpenses = transportTotal + hamaliTotal + mandiCessTotal + commissionTotal + packagingTotal + weighingTotal;
  const netIncome = Math.max(0, grossVal - totalSellingExpenses);
  const netRatePerQtl = numQty > 0 ? netIncome / numQty : 0;

  const cropInfo = cropData[crop] || DEFAULT_CROP_DATA[crop] || DEFAULT_CROP_DATA.wheat;
  const productionCost = (cropInfo?.typicalCostAcre || 15000) * toAcres(gs.area, gs.unit);
  const expectedProfit = netIncome - productionCost;

  // Comparison with Village Trader (Farmgate) & MSP
  const villageTraderRate = numPrice * 0.90; // Typically 10% lower at farmgate, but zero transport
  const villageTraderNetIncome = numQty * villageTraderRate;
  const mandiAdvantage = netIncome - villageTraderNetIncome;

  const mspPrice = cropInfo?.msp || numPrice;
  const mspNetIncome = Math.max(0, (numQty * mspPrice) - transportTotal); // FCI/NAFED pays packaging & cess

  return (
    <div>
      <PanelHeader icon="🏪" title="Mandi Net Price & Selling Profit Calculator" subtitle="Deduct transportation freight, hamali, mandi cess, and packaging to calculate true in-hand cash realization" />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.2rem', marginBottom: 16 }}>
        {/* Left Input Configuration Card */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <FormRow label="Crop Selection">
            <CropSelect cropData={cropData} value={crop} onChange={setCrop} />
          </FormRow>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <InputWithVoice label="Production Quantity (Quintals)" value={qty} onChange={setQty} resetValue={50} lang={lang} />
            <InputWithVoice label="Mandi Rate (₹/Quintal)" value={mandiPrice} onChange={setMandiPrice} resetValue={2200} lang={lang} />
          </div>

          <div style={{ borderTop: '1px solid #E5E7EB', margin: '12px 0 10px', paddingTop: 8 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mandi Logistics & Deductions</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <InputWithVoice label="Mandi Distance (KM)" value={distanceKm} onChange={setDistanceKm} resetValue={25} lang={lang} />
            <InputWithVoice label="Transport Freight (₹/Qtl)" value={transportRateQtl} onChange={setTransportRateQtl} resetValue={30} lang={lang} />
            <InputWithVoice label="Hamali / Loading (₹/Qtl)" value={hamaliPerQtl} onChange={setHamaliPerQtl} resetValue={12} lang={lang} />
            <InputWithVoice label="Gunny Bags/Bardana (₹/Qtl)" value={packagingPerQtl} onChange={setPackagingPerQtl} resetValue={40} lang={lang} />
            <InputWithVoice label="Mandi Tax / Cess (%)" value={mandiCessPct} onChange={setMandiCessPct} resetValue={1.5} lang={lang} />
            <InputWithVoice label="Arhat / Commission (%)" value={commissionPct} onChange={setCommissionPct} resetValue={1.5} lang={lang} />
          </div>
        </div>

        {/* Right Metric Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Gross Mandi Selling Value" value={`₹${fmt(grossVal)}`} color={C.blue} sub={`@ ₹${fmt(numPrice)}/Qtl for ${numQty} Quintals`} />
          <BigResult label="Total Logistics & Market Deductions" value={`- ₹${fmt(totalSellingExpenses)}`} color={C.rose} sub={`Freight: ₹${fmt(transportTotal)} | Hamali & Bags: ₹${fmt(hamaliTotal + packagingTotal)} | Tax & Comm: ₹${fmt(mandiCessTotal + commissionTotal)}`} />
          <BigResult label="Actual Net In-Hand Income" value={`₹${fmt(netIncome)}`} color={C.green} sub={`Effective Realized Price: ₹${fmt(netRatePerQtl)}/Quintal in hand`} />
          <BigResult label="Net Expected Profit (after Crop Cultivation)" value={`₹${fmt(expectedProfit)}`} color={expectedProfit >= 0 ? C.green : C.red} sub={`Crop Cultivation Cost: ₹${fmt(productionCost)}`} />
        </div>
      </div>

      {/* 3-Way Selling Channels Comparison Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: 14, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#17211B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Selling Channels Comparison: Where should you sell?
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
              <th style={{ textAlign: 'left', padding: '10px 8px', color: '#17211B', fontWeight: 700 }}>Channel</th>
              <th style={{ textAlign: 'right', padding: '10px 8px', color: '#17211B', fontWeight: 700 }}>Quoted Price</th>
              <th style={{ textAlign: 'right', padding: '10px 8px', color: '#17211B', fontWeight: 700 }}>Total Deductions</th>
              <th style={{ textAlign: 'right', padding: '10px 8px', color: '#17211B', fontWeight: 700 }}>Effective Price/Qtl</th>
              <th style={{ textAlign: 'right', padding: '10px 8px', color: '#17211B', fontWeight: 700 }}>Total Net Realization</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '10px 8px', fontWeight: 600, color: C.blue }}>🏛️ APMC Mandi Auction</td>
              <td style={{ textAlign: 'right', padding: '10px 8px', color: '#17211B', fontWeight: 600 }}>₹{fmt(numPrice)}/Qtl</td>
              <td style={{ textAlign: 'right', padding: '10px 8px', color: C.rose, fontWeight: 600 }}>-₹{fmt(totalSellingExpenses)}</td>
              <td style={{ textAlign: 'right', padding: '10px 8px', color: C.cyan, fontWeight: 700 }}>₹{fmt(netRatePerQtl)}/Qtl</td>
              <td style={{ textAlign: 'right', padding: '10px 8px', fontWeight: 800, color: C.green }}>₹{fmt(netIncome)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '10px 8px', fontWeight: 600, color: C.amber }}>🚜 Local Village Trader (Farmgate)</td>
              <td style={{ textAlign: 'right', padding: '10px 8px', color: '#17211B', fontWeight: 600 }}>₹{fmt(villageTraderRate)}/Qtl</td>
              <td style={{ textAlign: 'right', padding: '10px 8px', color: C.green, fontWeight: 600 }}>₹0 (Picked at farm)</td>
              <td style={{ textAlign: 'right', padding: '10px 8px', color: C.amber, fontWeight: 700 }}>₹{fmt(villageTraderRate)}/Qtl</td>
              <td style={{ textAlign: 'right', padding: '10px 8px', fontWeight: 800, color: '#374151' }}>₹{fmt(villageTraderNetIncome)}</td>
            </tr>
            {cropInfo?.msp && (
              <tr>
                <td style={{ padding: '10px 8px', fontWeight: 600, color: C.purple }}>🏛️ Govt MSP Centre (FCI/NAFED)</td>
                <td style={{ textAlign: 'right', padding: '10px 8px', color: '#17211B', fontWeight: 600 }}>₹{fmt(mspPrice)}/Qtl</td>
                <td style={{ textAlign: 'right', padding: '10px 8px', color: C.rose, fontWeight: 600 }}>-₹{fmt(transportTotal)} (Transport only)</td>
                <td style={{ textAlign: 'right', padding: '10px 8px', color: C.purple, fontWeight: 700 }}>₹{fmt((numQty > 0 ? mspNetIncome / numQty : 0))}/Qtl</td>
                <td style={{ textAlign: 'right', padding: '10px 8px', fontWeight: 800, color: C.green }}>₹{fmt(mspNetIncome)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Advisory Banner */}
      <div style={{
        padding: '12px 16px', borderRadius: 12,
        background: mandiAdvantage >= 0 ? '#F0FDF4' : '#FFFBEB',
        border: mandiAdvantage >= 0 ? '1px solid #BBF7D0' : '1px solid #FDE68A',
        display: 'flex', alignItems: 'center', gap: 12
      }}>
        <span style={{ fontSize: '1.5rem' }}>{mandiAdvantage >= 0 ? '💡' : '⚠️'}</span>
        <div style={{ fontSize: '0.85rem', color: mandiAdvantage >= 0 ? '#14532D' : '#78350F' }}>
          {mandiAdvantage >= 0 ? (
            <span>
              <strong>Smart Recommendation: Selling at APMC Mandi is more profitable!</strong> Even after ₹{fmt(totalSellingExpenses)} transport, labor, and market deductions, you earn <strong style={{ color: C.green }}>₹{fmt(mandiAdvantage)} MORE</strong> than selling to a village trader at your farmgate.
            </span>
          ) : (
            <span>
              <strong>Smart Recommendation: Sell at Farmgate to avoid loss!</strong> Due to high transportation freight and mandi fees for small batches, selling directly at farmgate yields <strong style={{ color: C.amber }}>₹{fmt(Math.abs(mandiAdvantage))} MORE</strong> net in-hand cash.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// 14. Storage & Warehouse Decision Calculator
function StoragePanel({ cropData, lang }) {
  const [crop, setCrop] = useState('wheat');
  const [qty, setQty] = useState(50); // In Quintals
  const [duration, setDuration] = useState(4); // Months
  const [storageType, setStorageType] = useState('warehouse');

  // Benchmark harvest price and expected off-season market appreciation
  const currentCrop = cropData[crop] || DEFAULT_CROP_DATA[crop] || DEFAULT_CROP_DATA.wheat;
  const basePrice = currentCrop.marketPrice || currentCrop.msp || 2200;

  const [harvestPrice, setHarvestPrice] = useState(basePrice);
  const [offSeasonPrice, setOffSeasonPrice] = useState(() => Math.round(basePrice * 1.22)); // 22% typical appreciation
  const [shrinkagePct, setShrinkagePct] = useState(2.5); // 2.5% natural moisture loss/shrinkage

  // Automatically adjust prices when crop changes
  useEffect(() => {
    const c = cropData[crop] || DEFAULT_CROP_DATA[crop] || DEFAULT_CROP_DATA.wheat;
    const p = c.marketPrice || c.msp || 2200;
    setHarvestPrice(p);
    setOffSeasonPrice(Math.round(p * 1.22));
  }, [crop, cropData]);

  const stInfo = STORAGE_TYPES[storageType] || STORAGE_TYPES.warehouse;
  const numQty = Math.max(0, parseFloat(qty) || 0);
  const numMonths = Math.max(1, parseFloat(duration) || 1);
  const numHarvestPrice = Math.max(0, parseFloat(harvestPrice) || 0);
  const numOffSeasonPrice = Math.max(0, parseFloat(offSeasonPrice) || 0);
  const numShrinkage = Math.max(0, parseFloat(shrinkagePct) || 0);

  const capacityRequired = numQty * 1.5; // Cubic feet estimate

  // Storage Cost Factors
  const rentalCost = numQty * stInfo.rateQtlMo * numMonths;
  const handlingAndInsurance = numQty * 8 + (numQty * (numHarvestPrice * 0.002) * (numMonths / 3)); // handling + insurance
  const totalStorageExpenses = rentalCost + handlingAndInsurance;

  // Immediate Harvest Selling vs Off-Season Selling
  const immediateRevenue = numQty * numHarvestPrice;
  const shrinkageWeightQtl = numQty * (numShrinkage / 100);
  const effectiveQty = Math.max(0, numQty - shrinkageWeightQtl);
  const grossOffSeasonRevenue = effectiveQty * numOffSeasonPrice;
  const netOffSeasonRevenue = grossOffSeasonRevenue - totalStorageExpenses;

  // Net Gain from Storing
  const netAdvantage = netOffSeasonRevenue - immediateRevenue;
  const storageRoi = totalStorageExpenses > 0 ? (netAdvantage / totalStorageExpenses) * 100 : 0;

  // WDRA e-NWR Pledge Loan (75% of stock value at 7% subsidized interest)
  const pledgeLoanEligible = immediateRevenue * 0.75;
  const pledgeMonthlyInterest = (pledgeLoanEligible * 0.07) / 12;

  return (
    <div>
      <PanelHeader icon="🏗️" title="Storage / Warehouse Profitability & WDRA Pledge Loan Calculator" subtitle="Analyze off-season price appreciation, moisture dryage, and storage expenses to decide whether to hold or sell immediately" />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: 16 }}>
        {/* Left Input Configuration Card */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <FormRow label="Crop Selection">
            <CropSelect cropData={cropData} value={crop} onChange={setCrop} />
          </FormRow>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <InputWithVoice label="Quantity Produced (Quintals)" value={qty} onChange={setQty} resetValue={50} lang={lang} />
            <InputWithVoice label="Holding Duration (Months)" value={duration} onChange={setDuration} resetValue={4} lang={lang} />
            <InputWithVoice label="Harvest Season Price (₹/Qtl)" value={harvestPrice} onChange={setHarvestPrice} resetValue={basePrice} lang={lang} />
            <InputWithVoice label="Expected Off-Season Price (₹/Qtl)" value={offSeasonPrice} onChange={setOffSeasonPrice} resetValue={Math.round(basePrice * 1.22)} lang={lang} />
          </div>

          <FormRow label="Storage Facility Type">
            <Select value={storageType} onChange={setStorageType}>
              <option value="warehouse">Village Warehouse / Godown (₹25/qtl/mo)</option>
              <option value="wrs">WDRA Accredited Warehouse (₹30/qtl/mo - e-NWR Loan Eligible)</option>
              <option value="cold_storage">Cold Storage (₹65/qtl/mo - Fruits/Vegetables/Potatoes)</option>
              <option value="farm_silo">On-Farm Grain Silo / Hermetic Bag (₹8/qtl/mo)</option>
            </Select>
          </FormRow>

          <InputWithVoice label="Moisture Dryage / Shrinkage Loss (%)" value={shrinkagePct} onChange={setShrinkagePct} resetValue={2.5} lang={lang} />
        </div>

        {/* Right Output Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult 
            label="Decision: Sell at Harvest vs Store Off-Season" 
            value={netAdvantage >= 0 ? `+ ₹${fmt(netAdvantage)} Net Advantage` : `- ₹${fmt(Math.abs(netAdvantage))} Loss from Storing`} 
            color={netAdvantage >= 0 ? C.green : C.red} 
            sub={netAdvantage >= 0 ? `🟢 PROFITABLE TO STORE: Yields extra cash after all warehouse fees and shrinkage` : `🔴 SELL AT HARVEST: Price hike will not cover storage rental and moisture loss`}
          />
          <Grid cols={2}>
            <ResultCard label="If Sold at Harvest Today" value={`₹${fmt(immediateRevenue)}`} color={C.blue} sub={`@ ₹${fmt(numHarvestPrice)}/Qtl`} />
            <ResultCard label="Net Off-Season Cash" value={`₹${fmt(netOffSeasonRevenue)}`} color={C.green} sub={`@ ₹${fmt(numOffSeasonPrice)}/Qtl net fees`} />
          </Grid>
          <Grid cols={2}>
            <ResultCard label="Total Storage Fees" value={`₹${fmt(totalStorageExpenses)}`} color={C.rose} sub={`Rent: ₹${fmt(rentalCost)} | Ins: ₹${fmt(handlingAndInsurance)}`} />
            <ResultCard label="Moisture Weight Loss" value={`${shrinkageWeightQtl.toFixed(1)} Qtl`} color={C.amber} sub={`${numShrinkage}% dryage (${effectiveQty.toFixed(1)} Qtl salable)`} />
          </Grid>
          <ResultCard label="Warehouse Space Required" value={`${capacityRequired.toFixed(0)} Cubic Feet`} color={C.cyan} sub={`Equates to approx ${Math.ceil(numQty * 2)} standard 50kg gunny bags`} />
        </div>
      </div>

      {/* WDRA e-NWR Warehouse Receipt Pledge Loan Box */}
      <div style={{
        background: '#F5F3FF',
        border: '1px solid #DDD6FE', borderRadius: 14, padding: '16px 20px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.8rem' }}>🏛️</span>
            <div>
              <h4 style={{ margin: 0, color: C.purple, fontSize: '0.98rem', fontWeight: 800 }}>WDRA Electronic Warehouse Receipt (e-NWR) Pledge Loan Scheme</h4>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#4B5563' }}>
                Deposit your produce in a WDRA registered warehouse to get an instant pledge loan from public sector banks at 7% subsidized interest rate without distress selling!
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700 }}>Eligible Immediate Bank Loan (75%)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: C.green }}>₹{fmt(pledgeLoanEligible)}</div>
            <div style={{ fontSize: '0.72rem', color: C.purple, fontWeight: 600 }}>Approx EMI / Interest: ₹{fmt(pledgeMonthlyInterest)}/month</div>
          </div>
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
    { crop: 'mustard', pct: 30 },
    { crop: 'chana', pct: 20 },
    { crop: 'potato', pct: 10 }
  ]);

  const acres = toAcres(totalArea, unit);
  const totalAllocPct = allocations.reduce((a, b) => a + (parseFloat(b.pct) || 0), 0);

  // Quick Preset Handlers
  const loadPreset = (template) => {
    setAllocations(template);
  };

  const addPlot = () => {
    if (allocations.length >= 6) return;
    const allKeys = Object.keys(cropData);
    const unused = allKeys.find(k => !allocations.some(a => a.crop === k)) || 'maize';
    setAllocations(prev => [...prev, { crop: unused, pct: 10 }]);
  };

  const removePlot = (idx) => {
    if (allocations.length <= 2) return;
    setAllocations(prev => prev.filter((_, i) => i !== idx));
  };

  const autoBalance = () => {
    if (allocations.length === 0) return;
    const currentSum = allocations.reduce((acc, item) => acc + (parseFloat(item.pct) || 0), 0);
    if (currentSum === 0) {
      const even = Math.floor(100 / allocations.length);
      setAllocations(prev => prev.map((item, i) => ({ ...item, pct: i === 0 ? 100 - even * (prev.length - 1) : even })));
      return;
    }
    const factor = 100 / currentSum;
    let running = 0;
    const balanced = allocations.map((item, i) => {
      if (i === allocations.length - 1) {
        return { ...item, pct: Math.max(0, 100 - running) };
      }
      const val = Math.round((parseFloat(item.pct) || 0) * factor);
      running += val;
      return { ...item, pct: val };
    });
    setAllocations(balanced);
  };

  const cropSummaries = allocations.map(item => {
    const cropAcres = acres * ((parseFloat(item.pct) || 0) / 100);
    const cropInfo = cropData[item.crop] || DEFAULT_CROP_DATA[item.crop] || DEFAULT_CROP_DATA.wheat;
    const inv = (cropInfo.typicalCostAcre || 15000) * cropAcres;
    const prod = (cropInfo.yieldQtlAcre || 20) * cropAcres;
    const price = cropInfo.marketPrice || cropInfo.msp || 2200;
    const rev = prod * price;
    const prof = rev - inv;
    const waterLit = (cropInfo.waterLitAcre || 500000) * cropAcres;
    const seedKg = (cropInfo.seedRateKgAcre || 20) * cropAcres;
    
    // Quick fertilizer estimate (N-P-K bags)
    const fd = FERTILIZER_DATA;
    const nKg = (cropInfo.npkAcre?.N || 60) * cropAcres;
    const pKg = (cropInfo.npkAcre?.P || 30) * cropAcres;
    const kKg = (cropInfo.npkAcre?.K || 20) * cropAcres;
    const ureaBags = Math.ceil(nKg / (0.46 * 50));
    const dapBags = Math.ceil(pKg / (0.46 * 50));
    const mopBags = Math.ceil(kKg / (0.60 * 50));

    return {
      ...item,
      name: cropInfo.name,
      icon: cropInfo.icon,
      cropAcres,
      inv,
      prod,
      price,
      rev,
      prof,
      waterLit,
      seedKg,
      seedUnit: cropInfo.seedUnit || 'kg',
      ureaBags,
      dapBags,
      mopBags,
      season: cropInfo.season || 'All'
    };
  });

  const aggregateInv = cropSummaries.reduce((a, b) => a + b.inv, 0);
  const aggregateRev = cropSummaries.reduce((a, b) => a + b.rev, 0);
  const aggregateProf = aggregateRev - aggregateInv;
  const aggregateRoi = aggregateInv > 0 ? (aggregateProf / aggregateInv) * 100 : 0;
  const aggregateWaterLit = cropSummaries.reduce((a, b) => a + b.waterLit, 0);
  const aggregateUrea = cropSummaries.reduce((a, b) => a + b.ureaBags, 0);
  const aggregateDap = cropSummaries.reduce((a, b) => a + b.dapBags, 0);
  const aggregateMop = cropSummaries.reduce((a, b) => a + b.mopBags, 0);

  // Ecological Diversification Rating
  const distinctSeasons = new Set(cropSummaries.map(c => c.season)).size;
  const hasPulse = allocations.some(a => ['chana', 'tur', 'moong', 'soybean'].includes(a.crop));
  const hasOilseed = allocations.some(a => ['mustard', 'groundnut', 'sunflower'].includes(a.crop));
  const hasStaple = allocations.some(a => ['wheat', 'rice', 'maize'].includes(a.crop));
  const diversityStars = 2 + (hasPulse ? 1 : 0) + (hasOilseed ? 1 : 0) + (hasStaple ? 1 : 0);

  // Palette for allocation bar
  const plotColors = ['#22c55e', '#60a5fa', '#f59e0b', '#a855f7', '#06b6d4', '#f43f5e'];

  return (
    <div>
      <PanelHeader icon="🗺️" title="Multi-Crop Farm Allocation & Cumulative Planner" subtitle="Distribute farm acreage across multiple crops to model whole-farm input requirements, revenue, and ecological diversification" />
      
      {/* Land Area and Unit Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: 14 }}>
        <InputWithVoice label="Total Farm Land Area" value={totalArea} onChange={setTotalArea} resetValue={10.0} lang={lang} />
        <FormRow label="Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
      </div>

      {/* Quick Seasonal Diversification Templates */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14, padding: '8px 12px', background: '#F8FAF9', borderRadius: 10, border: '1px solid #E5E7EB' }}>
        <span style={{ fontSize: '0.75rem', color: '#4B5563', fontWeight: 600 }}>Presets:</span>
        <button onClick={() => loadPreset([
          { crop: 'wheat', pct: 50 },
          { crop: 'mustard', pct: 25 },
          { crop: 'chana', pct: 25 }
        ])} style={{ padding: '4px 10px', borderRadius: 8, background: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
          🌾 Rabi Balanced (50% Wheat + 25% Mustard + 25% Gram)
        </button>
        <button onClick={() => loadPreset([
          { crop: 'rice', pct: 40 },
          { crop: 'maize', pct: 30 },
          { crop: 'soybean', pct: 30 }
        ])} style={{ padding: '4px 10px', borderRadius: 8, background: '#DBEAFE', border: '1px solid #93C5FD', color: '#2563EB', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
          🍚 Kharif Water-Smart (40% Paddy + 30% Maize + 30% Soybean)
        </button>
        <button onClick={() => loadPreset([
          { crop: 'wheat', pct: 40 },
          { crop: 'potato', pct: 30 },
          { crop: 'tomato', pct: 20 },
          { crop: 'garlic', pct: 10 }
        ])} style={{ padding: '4px 10px', borderRadius: 8, background: '#FEF3C7', border: '1px solid #FCD34D', color: '#D97706', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
          💰 High-Value Horticulture (40% Wheat + 30% Potato + 20% Tomato + 10% Garlic)
        </button>
      </div>

      {/* Visual Stacked Allocation Bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 600 }}>Land Distribution Visualizer:</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: totalAllocPct === 100 ? C.green : C.red }}>
            Total Allocated: {totalAllocPct}% {totalAllocPct === 100 ? '✓ Balanced' : '(Adjust to 100%)'}
          </span>
        </div>
        <div style={{ display: 'flex', height: 28, borderRadius: 8, overflow: 'hidden', background: '#F3F4F6', border: '1px solid #E5E7EB' }}>
          {cropSummaries.map((c, i) => {
            const widthPct = Math.max(0, parseFloat(c.pct) || 0);
            if (widthPct <= 0) return null;
            return (
              <div 
                key={i} 
                style={{
                  width: `${widthPct}%`,
                  background: plotColors[i % plotColors.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: '#000',
                  overflow: 'hidden', whiteSpace: 'nowrap', padding: '0 4px',
                  transition: 'width 0.2s'
                }}
                title={`${c.name}: ${c.pct}% (${c.cropAcres.toFixed(1)} Acres)`}
              >
                {widthPct >= 12 ? `${c.icon} ${c.pct}%` : `${c.icon}`}
              </div>
            );
          })}
        </div>
      </div>

      {/* Allocation Plot Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(allocations.length, 4)}, 1fr)`, gap: 10, marginBottom: 14 }}>
        {allocations.map((item, idx) => (
          <div key={idx} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <Label>Plot {idx + 1}</Label>
              {allocations.length > 2 && (
                <button onClick={() => removePlot(idx)} style={{ background: 'transparent', border: 'none', color: C.red, cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700 }}>
                  ✕ Remove
                </button>
              )}
            </div>
            <Select value={item.crop} onChange={v => setAllocations(p => {
              const next = [...p];
              next[idx] = { ...next[idx], crop: v };
              return next;
            })}>
              {Object.entries(cropData).map(([k, d]) => <option key={k} value={k}>{d.icon} {d.name}</option>)}
            </Select>
            <div style={{ marginTop: 8 }}>
              <InputWithVoice label="Land Share (%)" value={item.pct} onChange={v => setAllocations(p => {
                const next = [...p];
                next[idx] = { ...next[idx], pct: v };
                return next;
              })} resetValue={25} lang={lang} />
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons: Add Plot & Auto-Balance */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
        {allocations.length < 6 && (
          <button onClick={addPlot} style={{ padding: '6px 14px', borderRadius: 8, background: '#F9FAFB', border: '1px dashed #D1D5DB', color: '#374151', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
            ➕ Add Another Crop Plot
          </button>
        )}
        {totalAllocPct !== 100 && (
          <button onClick={autoBalance} style={{ padding: '6px 14px', borderRadius: 8, background: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
            ⚖️ Auto-Balance to Exactly 100%
          </button>
        )}
      </div>

      {/* Plot Breakdown Table */}
      <div style={{ overflowX: 'auto', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 12, marginBottom: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
              <th style={{ textAlign: 'left', padding: 8, color: '#17211B', fontWeight: 700 }}>Allocated Plot</th>
              <th style={{ textAlign: 'right', padding: 8, color: '#17211B', fontWeight: 700 }}>Acreage</th>
              <th style={{ textAlign: 'right', padding: 8, color: '#17211B', fontWeight: 700 }}>Seed Required</th>
              <th style={{ textAlign: 'right', padding: 8, color: '#17211B', fontWeight: 700 }}>Est. Yield</th>
              <th style={{ textAlign: 'right', padding: 8, color: '#17211B', fontWeight: 700 }}>Cultivation Cost</th>
              <th style={{ textAlign: 'right', padding: 8, color: '#17211B', fontWeight: 700 }}>Gross Revenue</th>
              <th style={{ textAlign: 'right', padding: 8, color: '#17211B', fontWeight: 700 }}>Expected Profit</th>
            </tr>
          </thead>
          <tbody>
            {cropSummaries.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: 8, fontWeight: 600, color: '#17211B' }}>{c.icon} {c.name} <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>({c.pct}%)</span></td>
                <td style={{ textAlign: 'right', padding: 8, color: '#374151' }}>{c.cropAcres.toFixed(1)} ac</td>
                <td style={{ textAlign: 'right', padding: 8, color: '#374151' }}>{c.seedKg.toFixed(1)} {c.seedUnit}</td>
                <td style={{ textAlign: 'right', padding: 8, color: '#374151' }}>{c.prod.toFixed(1)} Qtl</td>
                <td style={{ textAlign: 'right', padding: 8, color: C.rose, fontWeight: 600 }}>₹{fmt(c.inv)}</td>
                <td style={{ textAlign: 'right', padding: 8, color: C.blue, fontWeight: 600 }}>₹{fmt(c.rev)}</td>
                <td style={{ textAlign: 'right', padding: 8, fontWeight: 700, color: c.prof >= 0 ? C.green : C.red }}>₹{fmt(c.prof)}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: 700, borderTop: '2px solid #BBF7D0', background: '#F0FDF4', fontSize: '0.9rem' }}>
              <td style={{ padding: 10, color: '#15803D', fontWeight: 800 }}>Whole Farm Totals</td>
              <td style={{ textAlign: 'right', padding: 10, color: '#17211B' }}>{acres.toFixed(1)} ac</td>
              <td style={{ textAlign: 'right', padding: 10, color: '#4B5563' }}>Combined</td>
              <td style={{ textAlign: 'right', padding: 10, color: '#4B5563' }}>Diversified</td>
              <td style={{ textAlign: 'right', padding: 10, color: C.rose }}>₹{fmt(aggregateInv)}</td>
              <td style={{ textAlign: 'right', padding: 10, color: C.blue }}>₹{fmt(aggregateRev)}</td>
              <td style={{ textAlign: 'right', padding: 10, color: aggregateProf >= 0 ? C.green : C.red }}>₹{fmt(aggregateProf)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Aggregated Whole-Farm Resource Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
        <BigResult label="Cumulative Net Profit" value={`₹${fmt(aggregateProf)}`} color={aggregateProf >= 0 ? C.green : C.red} sub={`Across all ${allocations.length} crop plots`} />
        <BigResult label="Expected Farm ROI" value={`${aggregateRoi.toFixed(1)}%`} color={aggregateRoi >= 0 ? C.green : C.red} sub={`Total Investment: ₹${fmt(aggregateInv)}`} />
        <ResultCard label="Total Irrigation Water" value={`${fmt(aggregateWaterLit)} Liters`} color={C.cyan} sub="Whole-farm seasonal water needs" />
        <ResultCard label="Total Fertilizer Bags" value={`${aggregateUrea} Urea · ${aggregateDap} DAP · ${aggregateMop} MOP`} color={C.purple} sub="Aggregated nutrient dose" />
      </div>

      {/* Ecological & Market Diversification Advisory Box */}
      <div style={{
        background: '#F0FDF4', border: '1px solid #BBF7D0',
        borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14
      }}>
        <div style={{ fontSize: '2rem' }}>🌿</div>
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#15803D' }}>
            Ecological & Market Diversification Score: {'★'.repeat(Math.min(5, diversityStars))}{'☆'.repeat(Math.max(0, 5 - diversityStars))}
          </div>
          <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#374151' }}>
            {hasPulse && hasOilseed && hasStaple
              ? 'Outstanding Farm Diversification! Combining a cereal staple, a nitrogen-fixing legume/pulse, and an oilseed/cash crop dramatically reduces market price volatility risk while enriching soil microbiology.'
              : 'Good farm distribution. Tip: Incorporating at least one pulse/legume (like Gram, Tur, or Moong) fixes atmospheric nitrogen, reducing future chemical fertilizer expenses by up to 25%.'}
          </p>
        </div>
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <InputWithVoice label="Number of Milch Cows" value={cows} onChange={setCows} resetValue={2} lang={lang} />
          <InputWithVoice label="Number of Milch Buffaloes" value={buffaloes} onChange={setBuffaloes} resetValue={2} lang={lang} />
          <InputWithVoice label="Avg Milk Yield per Animal (Liters/day)" value={milkYield} onChange={setMilkYield} resetValue={10} lang={lang} />
          <InputWithVoice label="Milk Sale Price (₹/Liter)" value={milkPrice} onChange={setMilkPrice} resetValue={50} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: '#F8FAF9', border: '1px solid #E5E7EB', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase' }}>DAILY FODDER REQUIREMENT FOR {res.totalHeads} ANIMALS</div>
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1} lang={lang} />
          <FormRow label="Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: '#F8FAF9', border: '1px solid #E5E7EB', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase' }}>ORGANIC PACKAGE REQUIREMENTS</div>
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

// ── Pre-loaded seasonal sample farm models for History ──
const SAMPLE_PROJECTIONS = [
  {
    id: 'sample_wheat_rabi',
    isSample: true,
    name: '🌾 2-Acre Wheat High-Yield Rabi Plan',
    date: 'ICAR Standard Rabi Model',
    crop: 'wheat',
    area: 2,
    unit: 'acre',
    inv: 30000,
    yieldExpected: 40,
    rev: 97000,
    profit: 67000,
    roi: 123.3,
    description: 'Timely sown HD-2967/HD-3086 wheat with 6 irrigations, balanced NPK, and MSP rate ₹2,425/Qtl.'
  },
  {
    id: 'sample_rice_kharif',
    isSample: true,
    name: '🍚 5-Acre Paddy (Rice) Kharif Plan',
    date: 'ICAR Standard Kharif Model',
    crop: 'rice',
    area: 5,
    unit: 'acre',
    inv: 90000,
    yieldExpected: 110,
    rev: 253000,
    profit: 163000,
    roi: 81.1,
    description: 'Medium duration hybrid paddy with transplanting, zinc application, and Grade-A MSP rate ₹2,300/Qtl.'
  },
  {
    id: 'sample_mustard_cash',
    isSample: true,
    name: '🌼 3-Bigha Mustard Cash Crop Plan',
    date: 'ICAR Standard Rabi Cash Model',
    crop: 'mustard',
    area: 3,
    unit: 'bigha_pucca',
    inv: 15000,
    yieldExpected: 15,
    rev: 89250,
    profit: 74250,
    roi: 395.0,
    description: 'Low water requirement mustard (Giriraj/Pusa Jai Kisan) with high oil content and ₹5,950/Qtl MSP.'
  }
];

// Settings Panel
function SettingsPanel({ cropData, setCropData, fertilizerData, setFertilizerData, lang }) {
  const [activeTab, setActiveTab] = useState('crops');
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [seedRate, setSeedRate] = useState(20);
  const [typicalCost, setTypicalCost] = useState(15000);
  const [yieldVal, setYieldVal] = useState(20);
  const [marketPriceVal, setMarketPriceVal] = useState(2425);
  const [statusMsg, setStatusMsg] = useState('');

  // Editable fertilizer state
  const [localFert, setLocalFert] = useState(() => fertilizerData || DEFAULT_FERTILIZER_DATA);

  // Editable machinery rates
  const [localMachinery, setLocalMachinery] = useState(() => {
    const saved = localStorage.getItem('krishi_config_machinery');
    return saved ? JSON.parse(saved) : DEFAULT_MACHINERY_DATA;
  });

  // Editable labour wage rate
  const [labourWage, setLabourWage] = useState(() => {
    return parseFloat(localStorage.getItem('krishi_config_labour_wage')) || 400;
  });

  useEffect(() => {
    const c = cropData[selectedCrop] || DEFAULT_CROP_DATA[selectedCrop] || DEFAULT_CROP_DATA.wheat;
    if (c) {
      setSeedRate(c.seedRateKgAcre || 20);
      setTypicalCost(c.typicalCostAcre || 15000);
      setYieldVal(c.yieldQtlAcre || 20);
      setMarketPriceVal(c.marketPrice || c.msp || 2200);
    }
  }, [selectedCrop, cropData]);

  const showStatus = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleUpdateCrop = () => {
    setCropData(prev => ({
      ...prev,
      [selectedCrop]: {
        ...prev[selectedCrop],
        seedRateKgAcre: parseFloat(seedRate) || 20,
        typicalCostAcre: parseFloat(typicalCost) || 15000,
        yieldQtlAcre: parseFloat(yieldVal) || 20,
        marketPrice: parseFloat(marketPriceVal) || 2200
      }
    }));
    showStatus(`✓ Baseline configurations for ${cropData[selectedCrop]?.name || selectedCrop} updated!`);
  };

  const handleFertilizerChange = (fertKey, field, val) => {
    const parsed = parseFloat(val) || 0;
    setLocalFert(prev => ({
      ...prev,
      [fertKey]: {
        ...prev[fertKey],
        [field]: parsed
      }
    }));
  };

  const handleMachineryChange = (machKey, val) => {
    const parsed = parseFloat(val) || 0;
    setLocalMachinery(prev => ({
      ...prev,
      [machKey]: {
        ...prev[machKey],
        rateHr: parsed
      }
    }));
  };

  const handleSaveAll = () => {
    setFertilizerData(localFert);
    localStorage.setItem('krishi_config_crops', JSON.stringify(cropData));
    localStorage.setItem('krishi_config_fertilizers', JSON.stringify(localFert));
    localStorage.setItem('krishi_config_machinery', JSON.stringify(localMachinery));
    localStorage.setItem('krishi_config_labour_wage', labourWage.toString());
    showStatus("✓ All configurations saved globally into persistent storage!");
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all crop baselines, subsidized fertilizer prices, and machinery rental rates back to official ICAR / Government benchmarks?")) {
      setCropData(DEFAULT_CROP_DATA);
      setFertilizerData(DEFAULT_FERTILIZER_DATA);
      setLocalFert(DEFAULT_FERTILIZER_DATA);
      setLocalMachinery(DEFAULT_MACHINERY_DATA);
      setLabourWage(400);
      localStorage.removeItem('krishi_config_crops');
      localStorage.removeItem('krishi_config_fertilizers');
      localStorage.removeItem('krishi_config_machinery');
      localStorage.removeItem('krishi_config_labour_wage');
      showStatus("✓ Restored official ICAR / Government benchmark rates!");
    }
  };

  return (
    <div>
      <PanelHeader icon="⚙️" title="Administrator Config & Baselines" subtitle="Customize default crop rates, subsidized fertilizer bag prices, machinery rentals, and labour wage benchmarks" />
      
      {statusMsg && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', marginBottom: 14, fontSize: '0.85rem', fontWeight: 600 }}>
          {statusMsg}
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, borderBottom: '1px solid #E5E7EB', paddingBottom: 10, flexWrap: 'wrap' }}>
        {[
          { id: 'crops', icon: '🌾', label: 'Crop Baselines' },
          { id: 'fertilizers', icon: '🧪', label: 'Fertilizer Subsidies' },
          { id: 'machinery', icon: '🚜', label: 'Machinery Rentals' },
          { id: 'labour', icon: '👷', label: 'Labour Wages' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '6px 14px', borderRadius: 8, border: activeTab === tab.id ? `1px solid #15803D` : '1px solid #E5E7EB',
              background: activeTab === tab.id ? '#DCFCE7' : '#F9FAFB',
              color: activeTab === tab.id ? '#15803D' : '#4B5563', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: activeTab === tab.id ? 700 : 500, display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Crops */}
      {activeTab === 'crops' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <FormRow label="Select Crop Template to View/Modify">
            <Select value={selectedCrop} onChange={setSelectedCrop}>
              {Object.entries(cropData).map(([k, d]) => <option key={k} value={k}>{d.icon} {d.name}</option>)}
            </Select>
          </FormRow>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            <InputWithVoice label="Baseline Seed Rate (kg/acre)" value={seedRate} onChange={setSeedRate} resetValue={20} lang={lang} />
            <InputWithVoice label="Cultivation Cost (₹/acre)" value={typicalCost} onChange={setTypicalCost} resetValue={15000} lang={lang} />
            <InputWithVoice label="Expected Yield Target (Qtl/acre)" value={yieldVal} onChange={setYieldVal} resetValue={20} lang={lang} />
            <InputWithVoice label="Benchmark Market / MSP Price (₹/Qtl)" value={marketPriceVal} onChange={setMarketPriceVal} resetValue={2425} lang={lang} />
          </div>

          <button
            onClick={handleUpdateCrop}
            style={{
              padding: '10px 16px', background: '#F0FDF4', border: `1px solid #86EFAC`,
              color: '#15803D', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', marginTop: 12
            }}
          >
            Update {cropData[selectedCrop]?.name || selectedCrop} Parameters
          </button>
        </div>
      )}

      {/* TAB 2: Fertilizers */}
      {activeTab === 'fertilizers' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.82rem', color: '#4B5563', marginBottom: 12 }}>
            Configure Government Subsidized Fertilizer Maximum Retail Prices (MRP per 50kg bag) or private retailer rates:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {Object.entries(localFert).map(([k, d]) => (
              <div key={k} style={{ background: '#F8FAF9', border: '1px solid #E5E7EB', borderRadius: 10, padding: 10 }}>
                <div style={{ fontWeight: 700, color: C.blue, fontSize: '0.85rem', marginBottom: 6 }}>{d.name}</div>
                <InputWithVoice 
                  label="Bag Price (₹/50kg)" 
                  value={d.pricePerBag} 
                  onChange={v => handleFertilizerChange(k, 'pricePerBag', v)} 
                  resetValue={DEFAULT_FERTILIZER_DATA[k]?.pricePerBag || 500} 
                  lang={lang} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Machinery */}
      {activeTab === 'machinery' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.82rem', color: '#4B5563', marginBottom: 12 }}>
            Adjust custom hourly machinery rental rates to match prevailing local custom hiring center (CHC) rates in your village:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {Object.entries(localMachinery).slice(0, 9).map(([k, d]) => (
              <div key={k} style={{ background: '#F8FAF9', border: '1px solid #E5E7EB', borderRadius: 10, padding: 10 }}>
                <div style={{ fontWeight: 700, color: C.amber, fontSize: '0.85rem', marginBottom: 6 }}>{d.icon} {d.name}</div>
                <InputWithVoice 
                  label="Rental Rate (₹/Hour)" 
                  value={d.rateHr} 
                  onChange={v => handleMachineryChange(k, v)} 
                  resetValue={DEFAULT_MACHINERY_DATA[k]?.rateHr || 500} 
                  lang={lang} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Labour */}
      {activeTab === 'labour' && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.2rem', marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.82rem', color: '#4B5563', marginBottom: 12 }}>
            Set standard daily agricultural wage rates applicable for field preparation, transplanting, weeding, and harvesting operations:
          </div>
          <div style={{ maxWidth: 350 }}>
            <InputWithVoice label="Daily Farm Labour Wage (₹/Person-day)" value={labourWage} onChange={setLabourWage} resetValue={400} lang={lang} />
          </div>
        </div>
      )}

      {/* Global Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={handleSaveAll}
          style={{
            padding: '12px 22px', background: C.green, color: '#fff',
            border: 'none', borderRadius: 10, cursor: 'pointer',
            fontWeight: 700, fontSize: '0.88rem'
          }}
        >
          💾 Save All Configurations Globally
        </button>

        <button
          onClick={handleResetDefaults}
          style={{
            padding: '12px 18px', background: '#F9FAFB', color: '#374151',
            border: '1px solid #D1D5DB', borderRadius: 10, cursor: 'pointer',
            fontSize: '0.82rem', fontWeight: 600
          }}
        >
          🔄 Restore ICAR Standard Benchmarks
        </button>
      </div>
    </div>
  );
}

// History Panel
function HistoryPanel({ saved = [], onLoad, onDelete, onClearAll }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSaved = saved.filter(s => 
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.crop || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <PanelHeader icon="🕐" title="Saved Farm Projections & History" subtitle="Restore, inspect, and analyze previously saved seasonal farm budgets or choose from official preloaded scenario models" />
      
      {/* Search & Actions Bar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap' }}>
        <input 
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="🔍 Search saved calculations by name or crop..."
          style={{
            padding: '8px 14px', borderRadius: 10, background: '#FFFFFF',
            border: '1px solid #D1D5DB', color: '#17211B', fontSize: '0.85rem',
            width: '280px', maxWidth: '100%', boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
          }}
        />

        {saved.length > 0 && onClearAll && (
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to clear all saved calculations?")) {
                onClearAll();
              }
            }}
            style={{
              padding: '6px 12px', borderRadius: 8, background: '#FEE2E2',
              border: '1px solid #FCA5A5', color: C.red, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600
            }}
          >
            🗑️ Clear All History
          </button>
        )}
      </div>

      {/* User Saved Calculations */}
      {filteredSaved.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {filteredSaved.map(s => (
            <div key={s.id} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div>
                <div style={{ fontWeight: 700, color: C.green, fontSize: '0.96rem' }}>{s.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: 3 }}>
                  Saved: {s.date} · Crop: <strong style={{ color: '#17211B' }}>{s.crop}</strong> · Land Area: <strong style={{ color: '#17211B' }}>{s.area} {s.unit}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => onLoad(s)} style={{ padding: '8px 14px', borderRadius: 8, background: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                  📥 Restore to Workspace
                </button>
                <button onClick={() => onDelete(s.id)} style={{ padding: '8px 12px', borderRadius: 8, background: '#FEE2E2', border: '1px solid #FCA5A5', color: C.red, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                  ✕ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : saved.length === 0 ? (
        <div style={{ background: '#F9FAFB', border: '1px dashed #D1D5DB', borderRadius: 14, padding: '1.5rem', textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>💾</div>
          <h4 style={{ margin: '0 0 6px', color: '#17211B', fontWeight: 800 }}>No Custom Saved Calculations Yet</h4>
          <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: '#6B7280', maxWidth: 460, marginInline: 'auto' }}>
            To save your current farm plan, click the <strong>💾 Save</strong> button in the top toolbar. In the meantime, you can explore and instantly restore any of the preloaded reference models below:
          </p>
        </div>
      ) : (
        <div style={{ padding: 14, color: '#6B7280', fontSize: '0.85rem', marginBottom: 20 }}>
          No saved calculations match "{searchTerm}".
        </div>
      )}

      {/* Pre-loaded Benchmark Sample Models */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#17211B', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>📚</span>
          <span>Pre-Loaded Seasonal Farm Projection Models (Click to Load):</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {SAMPLE_PROJECTIONS.map(sample => (
            <div key={sample.id} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div>
                <div style={{ fontWeight: 700, color: C.blue, fontSize: '0.92rem', marginBottom: 4 }}>{sample.name}</div>
                <div style={{ fontSize: '0.74rem', color: '#6B7280', marginBottom: 8 }}>{sample.date}</div>
                <p style={{ fontSize: '0.76rem', color: '#4B5563', margin: '0 0 10px', lineHeight: 1.4 }}>
                  {sample.description}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: '0.72rem', background: '#F8FAF9', border: '1px solid #E5E7EB', padding: '6px 8px', borderRadius: 8, marginBottom: 10, color: '#374151' }}>
                  <div>Investment: <strong style={{ color: C.rose }}>₹{fmt(sample.inv)}</strong></div>
                  <div>Yield: <strong>{sample.yieldExpected} Qtl</strong></div>
                  <div>Revenue: <strong style={{ color: C.blue }}>₹{fmt(sample.rev)}</strong></div>
                  <div>Profit: <strong style={{ color: C.green }}>₹{fmt(sample.profit)}</strong></div>
                </div>
              </div>
              <button
                onClick={() => onLoad({ crop: sample.crop, area: sample.area, unit: sample.unit })}
                style={{
                  width: '100%', padding: '8px', borderRadius: 8, background: '#EFF6FF',
                  border: '1px solid #BFDBFE', color: C.blue, cursor: 'pointer',
                  fontSize: '0.8rem', fontWeight: 700
                }}
              >
                📥 Load This Model into Workspace
              </button>
            </div>
          ))}
        </div>
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
        background: '#FFFFFF',
        border: '1px solid #E5E7EB', borderRadius: 16, padding: '16px 20px',
        marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.8rem' }}>🧮</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#17211B', fontWeight: 800 }}>{t('title', lang)}</h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#6B7280' }}>
                {t('subtitle', lang)}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => window.print()} style={{
              padding: '8px 14px', borderRadius: 10, border: '1px solid #E5E7EB',
              background: '#F9FAFB', color: '#374151', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              {t('printSheet', lang)}
            </button>
            <button onClick={() => setSaveModal(true)} style={{
              padding: '8px 14px', borderRadius: 10, border: '1px solid #BFDBFE',
              background: '#EFF6FF', color: '#2563EB', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600
            }}>{t('save', lang)}</button>
            <button onClick={() => setActiveCalcRaw('history')} style={{
              padding: '8px 14px', borderRadius: 10, border: '1px solid #E5E7EB',
              background: '#F9FAFB', color: '#4B5563', cursor: 'pointer', fontSize: '0.82rem'
            }}>{t('history', lang)}</button>
          </div>
        </div>

        {/* Quick Presets Ribbon */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', background: '#F8FAF9', border: '1px solid #E5E7EB', padding: '10px 14px', borderRadius: 12 }}>
          {/* Quick Land Size Presets */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#4B5563', fontWeight: 600 }}>{t('quickLand', lang)}</span>
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
                  padding: '5px 12px', borderRadius: 20, 
                  border: gs.area === p.area && gs.unit === p.unit ? '1px solid #15803D' : '1px solid #E5E7EB',
                  background: gs.area === p.area && gs.unit === p.unit ? '#DCFCE7' : '#FFFFFF',
                  color: gs.area === p.area && gs.unit === p.unit ? '#15803D' : '#4B5563',
                  cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ height: 16, width: 1, background: '#E5E7EB' }} />

          {/* Quick Crop Selector */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#4B5563', fontWeight: 600 }}>{t('selectCrop', lang)}</span>
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
                border: activeCalc === c.id ? '1px solid #15803D' : '1px solid #E5E7EB',
                background: activeCalc === c.id ? '#15803D' : '#FFFFFF',
                color: activeCalc === c.id ? '#FFFFFF' : '#4B5563',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: activeCalc === c.id ? 700 : 500,
                display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                boxShadow: activeCalc === c.id ? '0 2px 6px rgba(21,128,61,0.25)' : 'none'
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
          background: '#FFFFFF', border: '1px solid #E5E7EB',
          borderRadius: 14, padding: '8px 6px', overflowY: 'auto', overflowX: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{
            width: '100%', padding: '6px 8px', borderRadius: 8, border: '1px solid #E5E7EB',
            background: '#F9FAFB', color: '#4B5563',
            cursor: 'pointer', marginBottom: 10, fontSize: '0.8rem',
            display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600
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
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color: gl.color, textTransform: 'uppercase', padding: '4px 8px', marginBottom: 2 }}>
                    {gl.label}
                  </div>
                )}
                {groupItems.map(item => (
                  <button key={item.id} onClick={() => setActiveCalc(item.id)} style={{
                    width: '100%', padding: sidebarOpen ? '8px 10px' : '8px',
                    borderRadius: 8, border: 'none', marginBottom: 2, cursor: 'pointer',
                    background: activeCalc === item.id ? '#F0FDF4' : 'transparent',
                    borderLeft: activeCalc === item.id ? `3px solid #15803D` : '3px solid transparent',
                    display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
                    color: activeCalc === item.id ? '#15803D' : '#4B5563',
                    fontSize: '0.82rem', fontWeight: activeCalc === item.id ? 700 : 500,
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
        <div style={{ flex: 1, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 14, padding: '1.4rem', overflowY: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
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
          {activeCalc === 'crop_compare' && <CropComparePanel gs={gs} cropData={cropData} lang={lang} />}
          {activeCalc === 'mandi_profit' && <MandiProfitPanel gs={gs} cropData={cropData} lang={lang} />}
          {activeCalc === 'storage'      && <StoragePanel cropData={cropData} lang={lang} />}
          {activeCalc === 'settings'     && <SettingsPanel cropData={cropData} setCropData={setCropData} fertilizerData={fertilizerData} setFertilizerData={setFertilizerData} lang={lang} />}
          {activeCalc === 'history'      && <HistoryPanel saved={saved} onLoad={loadCalc} onDelete={deleteCalc} onClearAll={() => { setSaved([]); localStorage.removeItem('krishi_saved_calcs'); }} />}
        </div>
      </div>

      {/* Save Modal */}
      {saveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
          onClick={e => e.target === e.currentTarget && setSaveModal(false)}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 18, padding: '1.8rem', maxWidth: 400, width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px', color: '#17211B', fontWeight: 800 }}>💾 Save Calculation</h3>
            <Label>Give this calculation a name</Label>
            <input 
              type="text" value={saveName} onChange={e => setSaveName(e.target.value)} 
              placeholder={`e.g. Wheat Kharif 2026`} 
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 10,
                background: '#FFFFFF', border: '1px solid #E5E7EB',
                color: '#17211B', fontSize: '0.92rem', boxSizing: 'border-box', marginBottom: 16
              }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setSaveModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#F3F4F6', color: '#4B5563', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
              <button onClick={saveCalc} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: '#15803D', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
