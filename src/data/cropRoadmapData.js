// Expert Agronomist Crop Care & Irrigation Roadmap Database (Multi-lingual 11 Indian Languages & Fully Dynamic Crop-Soil Engine)

import { CROPS, SOILS } from './constants';

export const ROADMAP_TRANSLATIONS = {
  en: {
    cardTitle: 'Irrigation & Crop Care Roadmap',
    placeholderDesc: 'Select your Crop, Region, and Soil Type in the Farm Settings panel and click "Generate Irrigation Plan" to generate your complete Agronomist Roadmap.',
    daysCycle: 'Days Cycle',
    planSubtitle: (crop, area, loc) => `Practical Agronomist Plan for ${crop} (${area} Acres in ${loc})`,
    sec1Title: '1. Soil & Field Preparation Strategy',
    idealSoilLabel: 'IDEAL SOIL & TARGET PH',
    targetPhLabel: 'Target pH',
    drainageLabel: 'DRAINAGE & AERATION',
    amendmentLabel: '💡 QUICK SOIL AMENDMENT TIPS FOR YOUR FIELD:',
    sec2Title: '2. Phase-by-Phase Growth & Irrigation Roadmap (Planting to Harvest)',
    stageLabel: 'STAGE',
    timeFrameLabel: 'TIME FRAME',
    irrigationScheduleLabel: 'Irrigation Schedule',
    frequencyLabel: 'Frequency:',
    timingLabel: 'Exact Timing:',
    visualCheckLabel: 'Visual Check:',
    actionItemsLabel: 'Critical Action Items',
    sec3Title: '3. Golden Rules for Irrigation Success',
    sec4Title: '4. Warning Flags (Visual Crop Diagnostics)',
    underwateringLabel: '🍂 Signs of Underwatering:',
    overwateringLabel: '💧 Signs of Overwatering:',
    printBtn: 'Print / Download Agronomist Roadmap'
  },
  hi: {
    cardTitle: 'फसल बड़वार व सिंचाई समय सारणी',
    placeholderDesc: 'अपनी फसल, राज्य और मिट्टी का चयन करें और अपनी संपूर्ण चरणबद्ध फसल योजना देखने के लिए "Generate Irrigation Plan" पर क्लिक करें।',
    daysCycle: 'दिन चक्र',
    planSubtitle: (crop, area, loc) => `${loc} में ${area} एकड़ खेत पर ${crop} की वैज्ञानिक फसल प्रबंधन योजना`,
    sec1Title: '1. मिट्टी और खेत की तैयारी की रणनीति',
    idealSoilLabel: 'उत्कृष्ट मिट्टी व पीएच मान',
    targetPhLabel: 'लक्ष्य पीएच',
    drainageLabel: 'जल निकासी और हवा का संचार',
    amendmentLabel: '💡 खेत के लिए मिट्टी सुधार के उपाय:',
    sec2Title: '2. बुआई से कटाई तक संपूर्ण फसल बड़वार व सिंचाई समय सारणी',
    stageLabel: 'चरण',
    timeFrameLabel: 'समय अवधि',
    irrigationScheduleLabel: 'सिंचाई समय सारणी',
    frequencyLabel: 'सिंचाई आवृत्ति:',
    timingLabel: 'उत्कृष्ट समय:',
    visualCheckLabel: 'मिट्टी जाँच:',
    actionItemsLabel: 'मुख्य कृषि कार्य व खाद खुराक',
    sec3Title: '3. सफल सिंचाई के 4 सुनहरे नियम',
    sec4Title: '4. फसल चेतावनी संकेत (विजुअल डायग्नोस्टिक्स)',
    underwateringLabel: '🍂 पानी की कमी (कम सिंचाई) के लक्षण:',
    overwateringLabel: '💧 जरूरत से ज्यादा पानी (जलजमाव) के लक्षण:',
    printBtn: 'डाउनलोड व प्रिंट फसल योजना'
  },
  te: {
    cardTitle: 'సాగు నీటిపారుదల మరియు పంట సంరక్షణ రోడ్‌మ్యాప్',
    placeholderDesc: 'మీ పంట, ప్రాంతం మరియు నేల రకాన్ని ఎంచుకుని "Generate Irrigation Plan" పై క్లిక్ చేయండి.',
    daysCycle: 'రోజుల చక్రం',
    planSubtitle: (crop, area, loc) => `${loc} లో ${area} ఎకరాల పొలంలో ${crop} సాగు ప్రణాళిక`,
    sec1Title: '1. నేల మరియు పొలం తయారీ విధానం',
    idealSoilLabel: 'అనుకూలమైన నేల & పిహెచ్ (pH) పరిమితి',
    targetPhLabel: 'లక్ష్య pH',
    drainageLabel: 'నీటి పారుదల & గాలి ప్రసరణ',
    amendmentLabel: '💡 నేల సవరణ సూచనలు:',
    sec2Title: '2. విత్తనం నుండి కోత వరకు దశలవారీ సాగు రోడ్‌మ్యాప్',
    stageLabel: 'దశ',
    timeFrameLabel: 'సమయ వ్యవధి',
    irrigationScheduleLabel: 'నీటిపారుదల పట్టిక',
    frequencyLabel: 'నీటి పౌనఃపున్యం:',
    timingLabel: 'సరైన సమయం:',
    visualCheckLabel: 'నేల పరీక్ష:',
    actionItemsLabel: 'ముఖ్యమైన వ్యవసాయ పనులు & ఎరువులు',
    sec3Title: '3. నీటిపారుదల విజయవంతం కావడానికి 4 సువర్ణ నియమాలు',
    sec4Title: '4. పంట హెచ్చరిక సంకేతాలు',
    underwateringLabel: '🍂 నీటి కొరత (తక్కువ నీరు) గుర్తులు:',
    overwateringLabel: '💧 ఎక్కువ నీరు (నీటి నిల్వ) గుర్తులు:',
    printBtn: 'రోడ్‌మ్యాప్‌ను ప్రింట్ / డౌన్‌లోడ్ చేయండి'
  },
  ta: {
    cardTitle: 'பாசன மற்றும் பயிர் பராமரிப்பு வழிகாட்டி',
    placeholderDesc: 'உங்கள் பயிர், பகுதி மற்றும் மண் வகையைத் தேர்ந்தெடுத்து "Generate Irrigation Plan" என்பதைக் கிளிக் செய்யவும்.',
    daysCycle: 'நாட்கள் சுழற்சி',
    planSubtitle: (crop, area, loc) => `${loc} இல் ${area} ஏக்கர் நிலத்தில் ${crop} பயிர் திட்டம்`,
    sec1Title: '1. மண் மற்றும் நில தயாரிப்பு உத்தி',
    idealSoilLabel: 'சிறந்த மண் & pH அளவு',
    targetPhLabel: 'இலக்கு pH',
    drainageLabel: 'நீர் வடிகால் & காற்று ஓட்டம்',
    amendmentLabel: '💡 மண் வள முன்னேற்ற குறிப்புகள்:',
    sec2Title: '2. விதைப்பு முதல் அறுவடை வரையிலான படிநிலைகள்',
    stageLabel: 'கட்டம்',
    timeFrameLabel: 'கால அளவு',
    irrigationScheduleLabel: 'பாசன அட்டவணை',
    frequencyLabel: 'பாசன இடைவெளி:',
    timingLabel: 'சரியான நேரம்:',
    visualCheckLabel: 'மண் சோதனை:',
    actionItemsLabel: 'முக்கிய விவசாய பணிகள் & உரங்கள்',
    sec3Title: '3. பாசன வெற்றிக்கு 4 பொன் விதிகள்',
    sec4Title: '4. பயிர் எச்சரிக்கை அறிகுறிகள்',
    underwateringLabel: '🍂 நீர் பற்றாக்குறை அறிகுறிகள்:',
    overwateringLabel: '💧 அதிகப்படியான நீர் அறிகுறிகள்:',
    printBtn: 'வழிகாட்டியை அச்சிடுக / பதிவிறக்கவும்'
  },
  kn: {
    cardTitle: 'ನೀರಾವರಿ ಮತ್ತು ಬೆಳೆ ಆರೈಕೆ ಮಾರ್ಗಸೂಚಿ',
    placeholderDesc: 'ನಿಮ್ಮ ಬೆಳೆ, ಪ್ರದೇಶ ಮತ್ತು ಮಣ್ಣಿನ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ "Generate Irrigation Plan" ಕ್ಲಿಕ್ ಮಾಡಿ.',
    daysCycle: 'ದಿನಗಳ ಚಕ್ರ',
    planSubtitle: (crop, area, loc) => `${loc} ನಲ್ಲಿ ${area} ಎಕರೆ ಜಮೀನಿನಲ್ಲಿ ${crop} ಬೆಳೆ ಯೋಜನೆ`,
    sec1Title: '1. ಮಣ್ಣು ಮತ್ತು ಜಮೀನು ಸಿದ್ಧತೆ ತಂತ್ರ',
    idealSoilLabel: 'ಸೂಕ್ತ ಮಣ್ಣು ಮತ್ತು pH ಮಟ್ಟ',
    targetPhLabel: 'ಗುರಿ pH',
    drainageLabel: 'ನೀರು ಬಸಿಯುವಿಕೆ ಮತ್ತು ಗಾಳಿ ಸರಬರಾಜು',
    amendmentLabel: '💡 ಮಣ್ಣು ಸುಧಾರಣಾ ಸಲಹೆಗಳು:',
    sec2Title: '2. ಬಿತ್ತನೆಯಿಂದ ಕಟಾವಿನವರೆಗೆ ಹಂತ-ಹಂತದ ಮಾರ್ಗಸೂಚಿ',
    stageLabel: 'ಹಂತ',
    timeFrameLabel: 'ಸಮಯಾವಧಿ',
    irrigationScheduleLabel: 'ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ',
    frequencyLabel: 'ನೀರಾವರಿ ಆವರ್ತನ:',
    timingLabel: 'ಸರಿಯಾದ ಸಮಯ:',
    visualCheckLabel: 'ಮಣ್ಣಿನ ಪರಿಶೀಲನೆ:',
    actionItemsLabel: 'ಪ್ರಮುಖ ಕೃಷಿ ಕಾರ್ಯಗಳು ಮತ್ತು ಗೊಬ್ಬರ',
    sec3Title: '3. ಯಶಸ್ವಿ ನೀರಾವರಿಯ 4 ಸುವರ್ಣ ನಿಯಮಗಳು',
    sec4Title: '4. ಬೆಳೆ ಎಚ್ಚರಿಕೆ ಲಕ್ಷಣಗಳು',
    underwateringLabel: '🍂 ನೀರಿನ ಕೊರತೆಯ ಲಕ್ಷಣಗಳು:',
    overwateringLabel: '💧 ಅತಿಯಾದ ನೀರಿನ ಲಕ್ಷಣಗಳು:',
    printBtn: 'ಮಾರ್ಗಸೂಚಿಯನ್ನು ಪ್ರಿಂಟ್ / ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ'
  },
  pa: {
    cardTitle: 'સિંચાઈ અને ફસલ સંਭਾਲ રੋડਮੈਪ',
    placeholderDesc: 'ਆਪਣੀ ਫਸਲ, ਖੇਤਰ ਅਤੇ ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਚੁਣੋ ਅਤੇ "Generate Irrigation Plan" \'ਤੇ ਕਲਿੱਕ ਕਰੋ।',
    daysCycle: 'ਦਿਨਾਂ ਦਾ ਚੱਕਰ',
    planSubtitle: (crop, area, loc) => `${loc} ਵਿੱਚ ${area} ਏਕੜ ਖੇਤ ਲਈ ${crop} ਦੀ ਫਸਲ ਯੋਜਨਾ`,
    sec1Title: '1. ਮਿੱਟੀ ਅਤੇ ਖੇਤ ਦੀ ਤਿਆਰੀ ਦੀ ਰਣਨੀਤੀ',
    idealSoilLabel: 'ਢੁਕਵੀਂ ਮਿੱਟੀ ਅਤੇ pH ਮਾਨ',
    targetPhLabel: 'ਟਾਰਗੇਟ pH',
    drainageLabel: 'ਜਲ ਨਿਕਾਸ ਅਤੇ ਹਵਾ ਦਾ ਸੰਚਾਰ',
    amendmentLabel: '💡 ਮਿੱਟੀ ਸੁਧਾਰ ਦੇ ਉਪਾਅ:',
    sec2Title: '2. ਬੀਜਣ ਤੋਂ ਕਟਾਈ ਤੱਕ ਪੜਾਅਵਾਰ ਫਸਲ ਯੋਜਨਾ',
    stageLabel: 'ਪੜਾਅ',
    timeFrameLabel: 'ਸਮਾਂ ਸੀਮਾ',
    irrigationScheduleLabel: 'ਸਿੰਚਾਈ ਸਮਾਂ ਸਾਰਣੀ',
    frequencyLabel: 'ਸਿੰਚਾਈ ਦੀ ਵਾਰਵਾਰਤਾ:',
    timingLabel: 'ਸਹੀ ਸਮਾਂ:',
    visualCheckLabel: 'ਮਿੱਟੀ ਦੀ ਜਾਂਚ:',
    actionItemsLabel: 'ਮੁੱਖ ਖੇਤੀ ਕੰਮ ਅਤੇ ਖਾਦਾਂ',
    sec3Title: '3. ਸਫਲ ਸਿੰਚਾਈ ਦੇ 4 ਸੁਨਹਿਰੀ ਨਿਯਮ',
    sec4Title: '4. ਫਸਲ ਚੇਤਾਵਨੀ ਸੰਕੇਤ',
    underwateringLabel: '🍂 ਪਾਣੀ ਦੀ ਘਾਟ ਦੇ ਲੱਛਣ:',
    overwateringLabel: '💧 ਵਾਧੂ ਪਾਣੀ ਦੇ ਲੱਛਣ:',
    printBtn: 'ਰੋਡਮੈਪ ਪ੍ਰਿੰਟ / ਡਾਊਨਲੋਡ ਕਰੋ'
  },
  bn: {
    cardTitle: 'সেচ ও ফসল পরিচর্যা রোডম্যাপ',
    placeholderDesc: 'আপনার ফসল, অঞ্চল এবং মাটির ধরণ নির্বাচন করুন এবং "Generate Irrigation Plan" এ ক্লিক করুন।',
    daysCycle: 'দিনের চক্র',
    planSubtitle: (crop, area, loc) => `${loc}-এ ${area} একর জমিতে ${crop} চাষের পরিকল্পনা`,
    sec1Title: '১. মাটি ও জমি প্রস্তুতকরণ কৌশল',
    idealSoilLabel: 'আদর্শ মাটি ও pH মাত্রা',
    targetPhLabel: 'লক্ষ্যমাত্রার pH',
    drainageLabel: 'পানি নিষ্কাশন ও বাতাস চলাচল',
    amendmentLabel: '💡 মাটি সংশোধনের টিপস:',
    sec2Title: '২. রোপণ থেকে ফসল কাটা পর্যন্ত পর্যায়ভিত্তিক রোডম্যাপ',
    stageLabel: 'ধাপ',
    timeFrameLabel: 'সময়সীমা',
    irrigationScheduleLabel: 'সেচ সময়সূচী',
    frequencyLabel: 'সেচের হার:',
    timingLabel: 'সঠিক সময়:',
    visualCheckLabel: 'মাটি পরীক্ষা:',
    actionItemsLabel: 'জরুরি কৃষি কাজ ও সার প্রয়োগ',
    sec3Title: '৩. সফল সেচের ৪টি সুবর্ণ নিয়ম',
    sec4Title: '৪. ফসলের সতর্কর্তামূলক লক্ষণ',
    underwateringLabel: '🍂 পানির ঘাটতির লক্ষণ:',
    overwateringLabel: '💧 অতিরিক্ত পানির লক্ষণ:',
    printBtn: 'রোডম্যাপ প্রিন্ট / ডাউনলোড করুন'
  },
  mr: {
    cardTitle: 'सिंचन आणि पीक संगोपन आराखडा',
    placeholderDesc: 'तुमचे पीक, राज्य आणि मातीचा प्रकार निवडा आणि "Generate Irrigation Plan" वर क्लिक करा.',
    daysCycle: 'दिवसांचे चक्र',
    planSubtitle: (crop, area, loc) => `${loc} मधील ${area} एकर शेतासाठी ${crop} पीक नियोजन`,
    sec1Title: '१. माती आणि शेत तयारीचे नियोजन',
    idealSoilLabel: 'योग्य माती आणि pH प्रमाण',
    targetPhLabel: 'लक्ष्य pH',
    drainageLabel: 'पाण्याचा निचरा आणि हवा खेळती राहणे',
    amendmentLabel: '💡 माती सुधारणा उपाय:',
    sec2Title: '२. पेरणीपासून कापणीपर्यंत टप्प्याटप्प्याने पीक आराखडा',
    stageLabel: 'टप्पा',
    timeFrameLabel: 'कालावधी',
    irrigationScheduleLabel: 'सिंचन वेळापत्रक',
    frequencyLabel: 'सिंचनाची वारंवारता:',
    timingLabel: 'योग्य वेळ:',
    visualCheckLabel: 'मातीची तपासणी:',
    actionItemsLabel: 'महत्त्वाचे कृषी कामे व खत मात्रा',
    sec3Title: '३. यशस्वी सिंचनाचे ४ सुवर्ण नियम',
    sec4Title: '४. पीक धोक्याचे इशारे',
    underwateringLabel: '🍂 पाण्याच्या कमतरतेची लक्षणे:',
    overwateringLabel: '💧 जास्त पाण्याच्या साचलेपणाची लक्षणे:',
    printBtn: 'आराखडा प्रिंट / डाउनलोड करा'
  },
  gu: {
    cardTitle: 'સિંચાઈ અને પાક સંભાળ રોડમેપ',
    placeholderDesc: 'તમારો પાક, રાજ્ય અને જમીનનો પ્રકાર પસંદ કરો અને "Generate Irrigation Plan" પર ક્લિક કરો.',
    daysCycle: 'દિવસોનું ચક્ર',
    planSubtitle: (crop, area, loc) => `${loc} માં ${area} એકર જમીન પર ${crop} ની વૈજ્ઞાનિક યોજના`,
    sec1Title: '૧. જમીન અને ખેતર તૈયારીની વ્યૂહરચના',
    idealSoilLabel: 'આદર્શ જમીન અને pH પ્રમાણ',
    targetPhLabel: 'ટાર્ગેટ pH',
    drainageLabel: 'નિતાર અને હવાની અવરજવર',
    amendmentLabel: '💡 જમીન સુધારણા ટિપ્સ:',
    sec2Title: '૨. વાવણીથી લણણી સુધી તબક્કાવાર રોડમેપ',
    stageLabel: 'તબક્કો',
    timeFrameLabel: 'સમયગાળો',
    irrigationScheduleLabel: 'સિંચાઈ સમયપત્રક',
    frequencyLabel: 'સિંચાઈની આવૃત્તિ:',
    timingLabel: 'યોગ્ય સમય:',
    visualCheckLabel: 'જમીન ચકાસણી:',
    actionItemsLabel: 'મુખ્ય ખેતી કાર્યો અને ખાતર',
    sec3Title: '૩. સફળ સિંચાઈના ૪ સુવર્ણ નિયમો',
    sec4Title: '૪. પાક ચેતવણી સંકેતો',
    underwateringLabel: '🍂 પાણીની અછતના લક્ષણો:',
    overwateringLabel: '💧 વધુ પડતા પાણીના લક્ષણો:',
    printBtn: 'રોડમેપ પ્રિન્ટ / ડાઉનલોડ કરો'
  },
  ml: {
    cardTitle: 'ജലസേചനവും വിള സംരക്ഷണ റോഡ്‌മാപ്പും',
    placeholderDesc: 'നിങ്ങളുടെ വിള, പ്രദേശം, മണ്ണ് എന്നിവ തിരഞ്ഞെടുത്ത് "Generate Irrigation Plan" ക്ലിക്ക് ചെയ്യുക.',
    daysCycle: 'ദിവസങ്ങളുടെ ചക്രം',
    planSubtitle: (crop, area, loc) => `${loc}-ൽ ${area} ഏക്കർ സ്ഥലത്ത് ${crop} കൃഷി പ്ലാൻ`,
    sec1Title: '1. മണ്ണും കൃഷിയിടവും ഒരുക്കൽ രീതി',
    idealSoilLabel: 'അനുയോജ്യമായ മണ്ണും pH അളവും',
    targetPhLabel: 'ടാർഗെറ്റ് pH',
    drainageLabel: 'വെള്ളക്കെട്ട് ഒഴിവാക്കലും വായുസഞ്ചാരവും',
    amendmentLabel: '💡 മണ്ണ് മെച്ചപ്പെടുത്തൽ നിർദ്ദേശങ്ങൾ:',
    sec2Title: '2. വിത്ത് പാകൽ മുതൽ വിളവെടുപ്പ് വരെയുള്ള ഘട്ടങ്ങൾ',
    stageLabel: 'ഘട്ടം',
    timeFrameLabel: 'സമയപരിധി',
    irrigationScheduleLabel: 'ജലസേചന സമയക്രമം',
    frequencyLabel: 'ജലസേചന ഇടവേള:',
    timingLabel: 'ശരിയായ സമയം:',
    visualCheckLabel: 'മണ്ണ് പരിശോധന:',
    actionItemsLabel: 'പ്രധാന കൃഷി ജോലികളും വളപ്രയോഗവും',
    sec3Title: '3. വിജയകരമായ ജലസേചനത്തിനുള്ള 4 പ്രധാന നിയമങ്ങൾ',
    sec4Title: '4. വിള മുന്നറിയിപ്പ് സൂചനകൾ',
    underwateringLabel: '🍂 ജലക്ഷാമത്തിന്റെ ലക്ഷണങ്ങൾ:',
    overwateringLabel: '💧 അമിത ജലസേചനത്തിന്റെ ലക്ഷണങ്ങൾ:',
    printBtn: 'റോഡ്‌മാപ്പ് പ്രിന്റ് / ഡൗൺലോഡ് ചെയ്യുക'
  },
  or: {
    cardTitle: 'ଜଳସେଚନ ଏବଂ ଫସଲ ଯତ୍ନ ରୋଡମ୍ୟାପ୍',
    placeholderDesc: 'ଆପଣଙ୍କ ଫସଲ, ଅଞ୍ଚଳ ଏବଂ ମୃତ୍ତିକା ବାଛି "Generate Irrigation Plan" ରେ କ୍ଲିକ୍ କରନ୍ତୁ।',
    daysCycle: 'ଦିନର ଚକ୍ର',
    planSubtitle: (crop, area, loc) => `${loc} ରେ ${area} ଏକର ଜମିରେ ${crop} ଫସଲ ଯୋଜନା`,
    sec1Title: '୧. ମୃତ୍ତିକା ଏବଂ ଜମି ପ୍ରସ୍ତୁତି କୌଶଳ',
    idealSoilLabel: 'ଉପଯୁକ୍ତ ମୃତ୍ତିକା ଏବଂ pH ସ୍ତର',
    targetPhLabel: 'ଲକ୍ଷ୍ୟ pH',
    drainageLabel: 'ଜଳ ନିଷ୍କାସନ ଏବଂ ବାୟୁ ଚଳାଚଳ',
    amendmentLabel: '💡 ମୃତ୍ତିକା ସୁଧାର ପରାମର୍ଶ:',
    sec2Title: '୨. ବୁଣା ଠାରୁ ଅମଳ ପର୍ଯ୍ୟନ୍ତ ପର୍ଯ୍ୟାୟକ୍ରମିକ ଯୋଜନା',
    stageLabel: 'ପର୍ଯ୍ୟାୟ',
    timeFrameLabel: 'ସମୟସୀମା',
    irrigationScheduleLabel: 'ଜଳସେଚନ ସମୟସୂଚୀ',
    frequencyLabel: 'ଜଳସେଚନ ଆବୃତ୍ତି:',
    timingLabel: 'ସଠିକ୍ ସମୟ:',
    visualCheckLabel: 'ମୃତ୍ତିକା ପରୀକ୍ଷା:',
    actionItemsLabel: 'ମୁଖ୍ୟ କୃଷି କାର୍ଯ୍ୟ ଏବଂ ସାର ମାତ୍ରା',
    sec3Title: '୩. ସଫଳ ଜଳସେଚନର ୪ଟି ସୁବର୍ଣ୍ଣ ନିୟମ',
    sec4Title: '୪. ଫସଲ ସତର୍କତା ସଙ୍କେତ',
    underwateringLabel: '🍂 ଜଳ ଅଭାବର ଲକ୍ଷଣ:',
    overwateringLabel: '💧 ଅତ୍ୟଧିକ ଜଳସେଚନର ଲକ୍ଷଣ:',
    printBtn: 'ରୋଡମ୍ୟାପ୍ ପ୍ରିଣ୍ଟ / ଡାଉନଲୋଡ୍ କରନ୍ତୁ'
  }
};

export const STATE_SOIL_MAP = {
  punjab: { soilId: 'alluvial', soilNameEn: 'Alluvial Soil', soilNameHi: 'जलोढ़ मिट्टी', phRange: '6.5 – 7.8', drainageEn: 'Well-drained loam to clay-loam', drainageHi: 'उत्कृष्ट जल निकासी वाली दोमट मिट्टी', descEn: 'Fertile river silt plain with high nutrient storage.', descHi: 'उच्च पोषक तत्व धारण क्षमता वाली उपजाऊ नदी जलोढ़ मिट्टी।' },
  haryana: { soilId: 'alluvial', soilNameEn: 'Alluvial Soil', soilNameHi: 'जलोढ़ मिट्टी', phRange: '6.5 – 8.0', drainageEn: 'Deep well-drained loam', drainageHi: 'गहरी उत्कृष्ट जल निकासी दोमट', descEn: 'Highly fertile alluvial plain soil.', descHi: 'अत्यधिक उपजाऊ जलोढ़ मैदानी मिट्टी।' },
  up: { soilId: 'alluvial', soilNameEn: 'Alluvial Soil', soilNameHi: 'जलोढ़ मिट्टी', phRange: '6.0 – 7.5', drainageEn: 'Moderate to deep loamy drainage', drainageHi: 'मध्यम से गहरी दोमट जल निकासी', descEn: 'Gangetic alluvial floodplain soil rich in potash.', descHi: 'पोटाश और गाद से भरपूर गंगा का मैदानी भाग।' },
  bihar: { soilId: 'alluvial', soilNameEn: 'Alluvial Soil', soilNameHi: 'जलोढ़ मिट्टी', phRange: '6.5 – 7.5', drainageEn: 'Moisture-retentive loam', drainageHi: 'नमी धारण करने वाली दोमट', descEn: 'Gangetic alluvial soil with high water table.', descHi: 'उच्च जल स्तर वाली गंगा मैदानी जलोढ़ मिट्टी।' },
  bengal: { soilId: 'clay', soilNameEn: 'Clay & Alluvial Soil', soilNameHi: 'चिकनी एवं जलोढ़ मिट्टी', phRange: '5.8 – 6.8', drainageEn: 'High moisture retention', drainageHi: 'उच्च नमी धारण क्षमता', descEn: 'Deltaic clay loam soil ideal for paddy.', descHi: 'धान के लिए आदर्श डेल्टाई चिकनी मिट्टी।' },
  assam: { soilId: 'alluvial', soilNameEn: 'Alluvial & Acidic Soil', soilNameHi: 'जलोढ़ एवं अम्लीय मिट्टी', phRange: '5.2 – 6.5', drainageEn: 'Moderate drainage', drainageHi: 'मध्यम जल निकासी', descEn: 'Brahmaputra valley alluvial soil rich in humus.', descHi: 'जैविक ह्यूमश से भरपूर ब्रह्मपुत्र घाटी।' },
  maharashtra: { soilId: 'black-soil', soilNameEn: 'Black Cotton Soil / Regur', soilNameHi: 'काली मिट्टी (रेगुर)', phRange: '7.2 – 8.5', drainageEn: 'Slow drainage, high clay retention', drainageHi: 'धीमी जल निकासी, उच्च जल धारण', descEn: 'Volcanic black basalt soil with high water retention.', descHi: 'उच्च नमी रोकने वाली काली बेसाल्टिक मिट्टी।' },
  mp: { soilId: 'black-soil', soilNameEn: 'Black Soil', soilNameHi: 'काली मिट्टी', phRange: '7.0 – 8.2', drainageEn: 'Moderate to slow clay drainage', drainageHi: 'मध्यम से धीमी चिकनी मिट्टी जल निकासी', descEn: 'Deep black clay soil rich in calcium and potash.', descHi: 'कैल्शियम व पोटाश से भरपूर गहरी काली मिट्टी।' },
  gujarat: { soilId: 'black-soil', soilNameEn: 'Black & Goradu Soil', soilNameHi: 'काली एवं गोराड़ू मिट्टी', phRange: '7.0 – 8.3', drainageEn: 'Good surface drainage', drainageHi: 'उत्तम सतही जल निकासी', descEn: 'Black clay soil ideal for cotton and groundnut.', descHi: 'कपास व मूंगफली के लिए आदर्श काली मिट्टी।' },
  telangana: { soilId: 'black-soil', soilNameEn: 'Black & Red Soil', soilNameHi: 'काली एवं लाल मिट्टी', phRange: '6.5 – 7.8', drainageEn: 'Moderate drainage', drainageHi: 'मध्यम जल निकासी', descEn: 'Mixed black clay loam soil suitable for cotton.', descHi: 'कपास और मिर्च के लिए उपयुक्त मिश्रित मिट्टी।' },
  karnataka: { soilId: 'red-soil', soilNameEn: 'Red Sandy Loam Soil', soilNameHi: 'लाल बलुई दोमट मिट्टी', phRange: '5.5 – 6.8', drainageEn: 'Fast, porous internal drainage', drainageHi: 'तीव्र, रंध्रयुक्त आंतरिक जल निकासी', descEn: 'Red loam soil rich in iron oxides.', descHi: 'आयरन ऑक्साइड से भरपूर लाल दोमट मिट्टी।' },
  andhra: { soilId: 'red-soil', soilNameEn: 'Red Sandy Loam', soilNameHi: 'लाल बलुई दोमट', phRange: '6.0 – 7.2', drainageEn: 'Well-drained coarse loam', drainageHi: 'उत्कृष्ट जल निकासी वाली लाल मिट्टी', descEn: 'Well-aerated red soil ideal for oilseeds.', descHi: 'तिलहन के लिए उपयुक्त वातित लाल मिट्टी।' },
  tn: { soilId: 'red-soil', soilNameEn: 'Red Loam Soil', soilNameHi: 'लाल दोमट मिट्टी', phRange: '6.2 – 7.2', drainageEn: 'Rapid drainage', drainageHi: 'तेज जल निकासी', descEn: 'Friable red loam soil suited for sugarcane.', descHi: 'गन्ने के लिए उपयुक्त भुरभुरी लाल मिट्टी।' },
  kerala: { soilId: 'red-soil', soilNameEn: 'Laterite & Red Soil', soilNameHi: 'लैटेराइट एवं लाल मिट्टी', phRange: '4.8 – 6.2', drainageEn: 'High permeability', drainageHi: 'उच्च जल पारगम्यता', descEn: 'Acidic leached red soil for spices and plantations.', descHi: 'मसालों के लिए उपयुक्त अम्लीय लैटेराइट मिट्टी।' },
  odisha: { soilId: 'red-soil', soilNameEn: 'Red & Yellow Soil', soilNameHi: 'लाल-पीली मिट्टी', phRange: '5.5 – 6.5', drainageEn: 'Moderate drainage', drainageHi: 'मध्यम जल निकासी', descEn: 'Medium clay red soil suited for paddy.', descHi: 'धान के लिए उपयुक्त मध्यम लाल मिट्टी।' },
  chhattisgarh: { soilId: 'red-soil', soilNameEn: 'Red Clay Soil', soilNameHi: 'लाल चिकनी मिट्टी', phRange: '5.5 – 6.8', drainageEn: 'Moderate retention', drainageHi: 'मध्यम जल धारण', descEn: 'Red clay loam soil ideal for rice.', descHi: 'चावल के लिए उपयुक्त लाल दोमट मिट्टी।' },
  jharkhand: { soilId: 'red-soil', soilNameEn: 'Red Metamorphic Soil', soilNameHi: 'लाल रूपांतरित मिट्टी', phRange: '5.2 – 6.4', drainageEn: 'Rapid internal drainage', drainageHi: 'तेज आंतरिक जल निकासी', descEn: 'Gravelly red loam soil with low organic humus.', descHi: 'कंकरीली लाल दोमट मिट्टी।' },
  rajasthan: { soilId: 'sandy', soilNameEn: 'Sandy Desert Soil', soilNameHi: 'बलुई रेगिस्तानी मिट्टी', phRange: '7.5 – 8.5', drainageEn: 'Ultra-fast percolation rate', drainageHi: 'अत्यधिक तीव्र जल रिसाव', descEn: 'Arid desert sandy soil with low retention.', descHi: 'कम जल धारण क्षमता वाली शुष्क बलुई मिट्टी।' },
  ladakh: { soilId: 'sandy', soilNameEn: 'Sandy Mountain Soil', soilNameHi: 'बलुई पर्वतीय मिट्टी', phRange: '7.2 – 8.0', drainageEn: 'Fast gravelly drainage', drainageHi: 'तेज पथरीली जल निकासी', descEn: 'High-altitude cold desert sandy loam.', descHi: 'उच्च पर्वतीय ठंडी बलुई मिट्टी।' },
  himachal: { soilId: 'loamy', soilNameEn: 'Loamy Forest Soil', soilNameHi: 'दोमट पर्वतीय मिट्टी', phRange: '6.0 – 7.0', drainageEn: 'Ideal balanced drainage', drainageHi: 'संतुलित जल निकासी', descEn: 'Organic humus-rich mountain loamy soil.', descHi: 'जैविक ह्यूमश से भरपूर पर्वतीय दोमट मिट्टी।' },
  uttarakhand: { soilId: 'loamy', soilNameEn: 'Loamy Valley Soil', soilNameHi: 'दोमट घाटी मिट्टी', phRange: '6.0 – 7.2', drainageEn: 'Well-balanced loam', drainageHi: 'संतुलित दोमट', descEn: 'Sub-Himalayan fertile loamy soil.', descHi: 'फल व सब्जियों के लिए उपजाऊ दोमट मिट्टी।' },
  jk: { soilId: 'loamy', soilNameEn: 'Karewa Loamy Soil', soilNameHi: 'करेवा दोमट मिट्टी', phRange: '6.2 – 7.4', drainageEn: 'Excellent valley loamy drainage', drainageHi: 'उत्कृष्ट घाटी जल निकासी', descEn: 'Rich Karewa loamy soil for saffron and apples.', descHi: 'केसर व सेब के लिए प्रसिद्ध करेवा दोमट मिट्टी।' },
  delhi: { soilId: 'alluvial', soilNameEn: 'Alluvial Soil', soilNameHi: 'जलोढ़ मिट्टी', phRange: '6.5 – 7.5', drainageEn: 'Well-drained loam', drainageHi: 'उत्कृष्ट दोमट जल निकासी', descEn: 'Yamuna floodplain alluvial soil.', descHi: 'यमुना मैदानी जलोढ़ मिट्टी।' },
  chandigarh: { soilId: 'alluvial', soilNameEn: 'Alluvial Soil', soilNameHi: 'जलोढ़ मिट्टी', phRange: '6.5 – 7.5', drainageEn: 'Loamy drainage', drainageHi: 'दोमट जल निकासी', descEn: 'Sub-mountainous alluvial loam.', descHi: 'शिवालिक मैदानी जलोढ़ मिट्टी।' },
  puducherry: { soilId: 'alluvial', soilNameEn: 'Coastal Alluvial Soil', soilNameHi: 'तटीय जलोढ़ मिट्टी', phRange: '6.5 – 7.8', drainageEn: 'Fast coastal drainage', drainageHi: 'तेज तटीय जल रिसाव', descEn: 'Coastal sandy alluvial soil.', descHi: 'तटीय बलुई जलोढ़ मिट्टी।' }
};

// Helper function to resolve translated string or fallback to multi-language dictionary
export function getRoadmapText(key, lang = 'en', params = {}) {
  const langDict = ROADMAP_TRANSLATIONS[lang] || ROADMAP_TRANSLATIONS.en;
  let val = langDict[key] || ROADMAP_TRANSLATIONS.en[key] || key;
  if (typeof val === 'function') {
    return val(params.crop, params.area, params.loc);
  }
  return val;
}

export function getCropRoadmap(cropId, cropName, stateId, areaAcres = 1) {
  const stateData = STATE_SOIL_MAP[stateId] || STATE_SOIL_MAP.punjab;
  const acres = Math.max(0.5, parseFloat(areaAcres) || 1);

  // Match crop metadata from CROPS array
  const cropMeta = (CROPS && CROPS.find(c => 
    c.id === cropId || 
    (c.name && c.name.toLowerCase().includes((cropName || '').toLowerCase()))
  )) || {
    id: cropId || 'general',
    name: cropName || 'Selected Crop',
    season: 'rabi',
    category: 'cereals',
    waterReqMm: 500,
    seedTreatment: 'Treat seeds with Trichoderma viride (4g/kg) before sowing.',
    fertilizers: { ureaKgPerAcre: 45, dapKgPerAcre: 35, mopKgPerAcre: 20 }
  };

  const rawName = cropMeta.name || cropName || 'Crop';
  const cropTitleEn = rawName.includes('(') ? rawName.split(' (')[0].trim() : rawName;
  const cropTitleHi = rawName.includes('(') ? rawName.split('(')[1].replace(')', '').trim() : rawName;

  // Tailored Soil Strategy based on crop category and soil type
  let idealSoilEn = 'Deep Fertile Alluvial Soil & Well-Drained Loam';
  let idealSoilHi = 'गहरी उपजाऊ जलोढ़ मिट्टी एवं उत्कृष्ट दोमट मिट्टी';
  let targetPhEn = '6.0 – 7.5 (Neutral)';
  let targetPhHi = '6.0 – 7.5 (उदासीन)';
  let drainageReqEn = 'Requires good internal root aeration and permeability.';
  let drainageReqHi = 'जड़ों के पास हवा का अच्छा संचार आवश्यक है।';

  if (cropMeta.id === 'rice') {
    idealSoilEn = 'Clay Loam & Heavy Alluvial Deltaic Soil';
    idealSoilHi = 'चिकनी दोमट एवं गहरी जलोढ़ मिट्टी';
    targetPhEn = '5.5 – 6.8 (Slightly Acidic)';
    targetPhHi = '5.5 – 6.8 (हल्की अम्लीय)';
    drainageReqEn = 'Tolerates 2-5 cm standing water during tillering & flowering stage.';
    drainageReqHi = 'कल्ले व फूल आते समय 2-5 सेमी जलजमाव सहन कर सकती है।';
  } else if (cropMeta.id === 'cotton') {
    idealSoilEn = 'Deep Black Cotton Soil (Regur) & Clay Loam';
    idealSoilHi = 'गहरी काली मिट्टी (रेगुर) एवं दोमट मिट्टी';
    targetPhEn = '7.0 – 8.5 (Slightly Alkaline)';
    targetPhHi = '7.0 – 8.5 (हल्की क्षारीय)';
    drainageReqEn = 'Requires deep subsoil moisture retention with surface drainage.';
    drainageReqHi = 'गहरी नमी धारण क्षमता व सतही जल निकासी आवश्यक है।';
  } else if (cropMeta.id === 'sugarcane') {
    idealSoilEn = 'Deep Alluvial Silt Loam & Rich Heavy Clay';
    idealSoilHi = 'गहरी जलोढ़ गाद दोमट एवं भारी मिट्टी';
    targetPhEn = '6.5 – 7.5 (Neutral)';
    targetPhHi = '6.5 – 7.5 (उदासीन)';
    drainageReqEn = 'Requires heavy irrigation with broad furrow drainage.';
    drainageReqHi = 'नालियों द्वारा गहरी सिंचाई व जल निकासी आवश्यक है।';
  } else if (cropMeta.id === 'potato') {
    idealSoilEn = 'Well-Aerated Friable Sandy Loam';
    idealSoilHi = 'भुरभुरी बलुई दोमट मिट्टी';
    targetPhEn = '5.2 – 6.4 (Slightly Acidic to prevent Scab)';
    targetPhHi = '5.2 – 6.4 (स्कैब बीमारी से बचाव हेतु हल्की अम्लीय)';
    drainageReqEn = 'Strict zero-waterlogging policy around seed tubers.';
    drainageReqHi = 'आलू के कंदों के पास जलजमाव बिलकुल न होने दें।';
  } else if (cropMeta.id === 'mustard') {
    idealSoilEn = 'Light Sandy Loam to Alluvial Soil';
    idealSoilHi = 'हल्की बलुई दोमट एवं जलोढ़ मिट्टी';
    targetPhEn = '6.5 – 7.8 (Neutral to Alkaline)';
    targetPhHi = '6.5 – 7.8 (उदासीन से हल्की क्षारीय)';
    drainageReqEn = 'Porous, fast-draining root zone.';
    drainageReqHi = 'रंध्रयुक्त तेज जल निकासी वाली मिट्टी।';
  }

  // Dynamic Soil Amendment Tips based on state's actual soil type
  const amendmentTipsEn = [];
  const amendmentTipsHi = [];

  if (stateData.soilId === 'sandy') {
    amendmentTipsEn.push(`For sandy soil: Mix 6–8 Tons/acre FYM compost to improve water holding capacity for ${cropTitleEn}.`);
    amendmentTipsEn.push(`Apply Mulch around ${cropTitleEn} rows to reduce rapid moisture evaporation.`);
    amendmentTipsHi.push(`बलुई मिट्टी के लिए: ${cropTitleHi} की जल धारण क्षमता बढ़ाने हेतु 6-8 टन/एकड़ गोबर की खाद मिलाएं।`);
    amendmentTipsHi.push(`वाष्पीकरण रोकने के लिए पंक्तियों के बीच पराली/मल्च बिछाएं।`);
  } else if (stateData.soilId === 'black-soil') {
    amendmentTipsEn.push(`For heavy black clay: Prepare raised ridges & apply 100 kg/acre Gypsum to prevent root rot in ${cropTitleEn}.`);
    amendmentTipsEn.push(`Avoid excessive field flooding; water alternate furrows.`);
    amendmentTipsHi.push(`काली मिट्टी के लिए: ${cropTitleHi} में जड़ सड़न रोकने हेतु 100 किग्रा/एकड़ जिप्सम मिलाएं व मेढ़ बनाएं।`);
    amendmentTipsHi.push(`एक साथ पूरा खेत न भरें; एक छोड़कर एक नाली में पानी दें।`);
  } else if (stateData.soilId === 'red-soil') {
    amendmentTipsEn.push(`For red soil: Apply 200 kg/acre Agricultural Lime to correct soil acidity for ${cropTitleEn}.`);
    amendmentTipsEn.push(`Top-dress Zinc Sulphate 10 kg/acre + Bio-fertilizers.`);
    amendmentTipsHi.push(`लाल मिट्टी के लिए: ${cropTitleHi} हेतु मिट्टी की अम्लीयता सुधारने के लिए 200 किग्रा/एकड़ चूना डालें।`);
    amendmentTipsHi.push(`10 किग्रा/एकड़ जिंक सल्फेट व जैव उर्वरक मिलाएं।`);
  } else {
    amendmentTipsEn.push(`For alluvial loam: Apply 5 Tons/acre FYM compost during land preparation for ${cropTitleEn}.`);
    amendmentTipsEn.push(`Ensure level field grading to maintain uniform water spreading.`);
    amendmentTipsHi.push(`जलोढ़ दोमट के लिए: ${cropTitleHi} की बुआई पूर्व 5 टन/एकड़ गोबर खाद मिलाकर समतल करें।`);
    amendmentTipsHi.push(`समान जल फैलाव हेतु खेत का समतलीकरण सुनिश्चित करें।`);
  }

  // Fertilizer dosage specific to this crop
  const fert = cropMeta.fertilizers || { ureaKgPerAcre: 50, dapKgPerAcre: 35, mopKgPerAcre: 20 };
  const urea = fert.ureaKgPerAcre;
  const dap = fert.dapKgPerAcre;
  const mop = fert.mopKgPerAcre;

  const totalDays = Math.round((cropMeta.waterReqMm || 500) / 4) + 60; // 90 to 180 days

  const stagesEn = [
    {
      stageNum: 1,
      title: `Stage 1: Sowing & Germination / Nursery`,
      daysRange: `Day 1 – 15 (Week 1–2)`,
      waterFrequency: `Pre-sowing soil moistening. Irrigate every 4–6 days as per soil condition.`,
      exactTiming: `Early Morning (6:00 AM – 8:30 AM)`,
      visualCheck: `Keep top 2 inches of soil uniformly moist so seed coats break easily.`,
      actionItems: [
        `Basal Fertilizer: Apply DAP ${dap} kg/acre + MOP ${mop} kg/acre + FYM 5 Tons/acre into topsoil.`,
        `Seed Care: ${cropMeta.seedTreatment || 'Treat seeds with Trichoderma viride (4g/kg).'}`
      ],
      waterReqLitersPerAcrePerDay: 2800,
      totalLitersForFarmPerDay: Math.round(2800 * acres)
    },
    {
      stageNum: 2,
      title: `Stage 2: Active Vegetative Growth & Branching`,
      daysRange: `Day 16 – 40 (Week 3–6)`,
      waterFrequency: `Irrigate every 7–10 days based on weather and soil dryness.`,
      exactTiming: `Early Morning or Evening`,
      visualCheck: `Irrigate when top 1.5 inches of soil feel dry. Prevent root zone cracking.`,
      actionItems: [
        `1st Top Dressing: Apply Urea ${Math.round(urea * 0.6)} kg/acre + Zinc Sulphate (21%) 10 kg/acre.`,
        `Weed & Pest Control: Hand hoeing at Day 25 + Spray Neem Oil 1500 ppm @ 3ml/L.`
      ],
      waterReqLitersPerAcrePerDay: 4200,
      totalLitersForFarmPerDay: Math.round(4200 * acres)
    },
    {
      stageNum: 3,
      title: `Stage 3: Flowering & Fruit/Grain Setting (Critical Phase)`,
      daysRange: `Day 41 – 75 (Week 7–11)`,
      waterFrequency: `Irrigate every 6–8 days. CRITICAL WATER STAGE: Do not allow soil to dry out!`,
      exactTiming: `Early Morning (Avoid windy hours)`,
      visualCheck: `Maintain steady soil moisture; moisture stress causes flower & bud drop.`,
      actionItems: [
        `2nd Top Dressing: Apply Urea ${Math.round(urea * 0.4)} kg/acre + Boron 20% @ 200g/acre foliar spray.`,
        `Disease Shield: Inspect weekly for leaf spot, wilt, or borer pests. Apply organic fungicides if detected.`
      ],
      waterReqLitersPerAcrePerDay: 5400,
      totalLitersForFarmPerDay: Math.round(5400 * acres)
    },
    {
      stageNum: 4,
      title: `Stage 4: Maturation, Grain Filling & Harvest`,
      daysRange: `Day 76 – ${totalDays} (Week 12–${Math.round(totalDays/7)})`,
      waterFrequency: `Reduce watering gradually; STOP ALL IRRIGATION 10–14 days before harvest.`,
      exactTiming: `Early Morning`,
      visualCheck: `Stop watering when leaves start yellowing and crop reaches harvest maturity.`,
      actionItems: [
        `Quality Spray: Apply 1% SOP (0-0-50) @ 1 kg/acre for color, luster, and grain weight.`,
        `Harvest & Storage: Harvest at 12-14% grain/seed moisture and dry under sun before storage.`
      ],
      waterReqLitersPerAcrePerDay: 3500,
      totalLitersForFarmPerDay: Math.round(3500 * acres)
    }
  ];

  const stagesHi = [
    {
      stageNum: 1,
      title: `चरण 1: बुआई और अंकुरण (Sowing & Germination)`,
      daysRange: `दिन 1 – 15 (सप्ताह 1–2)`,
      waterFrequency: `बुआई पूर्व खेत नमी तैयार करें। मिट्टी की स्थिति अनुसार 4-6 दिन पर सिंचाई करें।`,
      exactTiming: `प्रातः काल (सुबह 6:00 से 8:30 बजे)`,
      visualCheck: `उपरी 2 इंच मिट्टी को नम रखें ताकि अंकुरण समान व शीघ्र हो सके।`,
      actionItems: [
        `बुआई पूर्व खाद: ${dap} किग्रा DAP + ${mop} किग्रा MOP + 5 टन गोबर खाद प्रति एकड़ मिलाएं।`,
        `बीज शोधन: ${cropMeta.seedTreatment || 'त्राइकोर्मा विरिडी (4 ग्राम/किग्रा) से बीज उपचार करें।'}`
      ],
      waterReqLitersPerAcrePerDay: 2800,
      totalLitersForFarmPerDay: Math.round(2800 * acres)
    },
    {
      stageNum: 2,
      title: `चरण 2: पौधों की बड़वार व शाखाएं निकलना`,
      daysRange: `दिन 16 – 40 (सप्ताह 3–6)`,
      waterFrequency: `मौसम व मिट्टी के सूखापन के आधार पर 7-10 दिन पर सिंचाई करें।`,
      exactTiming: `प्रातः काल अथवा शाम`,
      visualCheck: `उपरी 1.5 इंच मिट्टी सूखने पर ही पानी दें। जड़ों में दरारें न पड़ने दें।`,
      actionItems: [
        `पहला उर्वरक: ${Math.round(urea * 0.6)} किग्रा यूरिया + 10 किग्रा जिंक सल्फेट प्रति एकड़ डालें।`,
        `निराई व कीट नियंत्रण: 25वें दिन निराई करें व नीम तेल (3 मिली/लीटर) का छिड़काव करें।`
      ],
      waterReqLitersPerAcrePerDay: 4200,
      totalLitersForFarmPerDay: Math.round(4200 * acres)
    },
    {
      stageNum: 3,
      title: `चरण 3: फूल आना व फल/दाना बनना (अति संवेदनशील अवस्था)`,
      daysRange: `दिन 41 – 75 (सप्ताह 7–11)`,
      waterFrequency: `6-8 दिन पर नियमित सिंचाई करें। फूल आते समय पानी की कमी बिलकुल न होने दें!`,
      exactTiming: `प्रातः काल (शांत हवा के समय)`,
      visualCheck: 'मिट्टी में सतत नमी बनाए रखें; पानी की कमी से फूल व कलियां गिर जाती हैं।',
      actionItems: [
        `दूसरा उर्वरक: ${Math.round(urea * 0.4)} किग्रा यूरिया + 200 ग्राम बोरॉन प्रति एकड़ का स्प्रे करें।`,
        `रोग व कीट निगरानी: फफूंद व सुंडी कीट की निगरानी करें और आवश्यकतानुसार जैव-कीटनाशक छिड़कें।`
      ],
      waterReqLitersPerAcrePerDay: 5400,
      totalLitersForFarmPerDay: Math.round(5400 * acres)
    },
    {
      stageNum: 4,
      title: `चरण 4: फसल पकना, दाना भरना व कटाई`,
      daysRange: `दिन 76 – ${totalDays} (सप्ताह 12–${Math.round(totalDays/7)})`,
      waterFrequency: `सिंचाई धीरे-धीरे कम करें; कटाई से 10-14 दिन पहले पानी पूरी तरह बंद कर दें।`,
      exactTiming: `प्रातः काल`,
      visualCheck: `पत्तियां व बालियां पीली/सुनहरी पड़ते ही सिंचाई बंद कर दें।`,
      actionItems: [
        `गुणवत्ता स्प्रे: चमक व दाना मोटा करने हेतु 1% SOP (0-0-50 @ 1 किग्रा/एकड़) का स्प्रे करें।`,
        `कटाई व भंडारण: दाने/फल में नमी 12-14% रहने पर कटाई कर सुखाकर भंडारण करें।`
      ],
      waterReqLitersPerAcrePerDay: 3500,
      totalLitersForFarmPerDay: Math.round(3500 * acres)
    }
  ];

  return {
    cropId: cropMeta.id,
    cropNameEn: cropTitleEn,
    cropNameHi: cropTitleHi,
    totalDays,
    seasonEn: (cropMeta.season || 'rabi').toUpperCase(),
    seasonHi: cropMeta.season === 'kharif' ? 'खरीफ' : (cropMeta.season === 'zaid' ? 'जायद' : 'रबी'),
    stateSoilEn: stateData.soilNameEn,
    stateSoilHi: stateData.soilNameHi,
    statePh: stateData.phRange,
    stateDescEn: stateData.descEn,
    stateDescHi: stateData.descHi,

    idealSoilEn,
    idealSoilHi,
    targetPhEn,
    targetPhHi,
    drainageReqEn,
    drainageReqHi,
    amendmentTipsEn,
    amendmentTipsHi,

    stagesEn,
    stagesHi,
    scaledStagesEn: stagesEn,
    scaledStagesHi: stagesHi,

    goldenRulesEn: [
      `Water ${cropTitleEn} in Early Morning: Irrigate between 6:00 AM and 9:00 AM to reduce evaporation loss and prevent fungal leaf spot.`,
      `Check Soil Moisture Manually: Water when top 1.5 to 2 inches of soil feel dry—avoid watering on rigid calendar if soil is moist.`,
      `Ensure Proper Field Drainage: Never allow standing water around ${cropTitleEn} roots to prevent wilt rot.`,
      `Stop Irrigation Prior to Harvest: Withhold watering 10–14 days before harvest for uniform crop drying.`
    ],
    goldenRulesHi: [
      `${cropTitleHi} में प्रातः काल सिंचाई करें: सुबह 6 से 9 बजे के बीच पानी देने से वाष्पीकरण कम होता है व फफूंद रोग से बचाव होता है।`,
      `मिट्टी की नमी हाथ से जाँचें: उपरी 1.5 से 2 इंच मिट्टी सूखने पर ही सिंचाई करें।`,
      `खेत में सुगम जल निकासी रखें: ${cropTitleHi} की जड़ों के पास जलजमाव न होने दें ताकि सड़न रोग न फैले।`,
      `कटाई पूर्व सिंचाई बंद करें: फसल पकने पर कटाई से 10-14 दिन पहले सिंचाई बंद कर दें।`
    ],

    warningFlagsEn: {
      underwatering: [
        `${cropTitleEn} leaves curling or rolling inward, dull grayish-green foliage color.`,
        `Premature lower leaf drop and stunted branch/tiller development.`
      ],
      overwatering: [
        `Lower leaves turning yellow while stems feel soft or droopy in ${cropTitleEn}.`,
        `Soggy, sour-smelling soil surface with stunted root uptake.`
      ]
    },
    warningFlagsHi: {
      underwatering: [
        `${cropTitleHi} की पत्तियों का अंदर मुड़ना व रंग फेंट होना।`,
        `निचली पत्तियों का समय पूर्व गिरना व पौधों की बड़वार रुकना।`
      ],
      overwatering: [
        `${cropTitleHi} में खेत में जलजमाव से निचली पत्तियों का पीला पड़ना व तना नरम होना।`,
        `मिट्टी में दुर्गंध व जड़ों की बड़वार रुकना।`
      ]
    }
  };
}
