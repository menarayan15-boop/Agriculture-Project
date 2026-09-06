import { CROPS, SOILS } from './constants';
import { CROP_SEASONS_DATA } from './cropDetailsData';

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
    drainageLabel: 'ଜଳ ନିଷ୍କାସନ ଏବଂ ବାୟୁ ସଞ୍ଚାଳନ',
    amendmentLabel: '💡 ମୃତ୍ତିକା ସୁଧାର ଟିପ୍ସ:',
    sec2Title: '୨. ବୁଣିବା ଠାରୁ ଅମଳ ପର୍ଯ୍ୟନ୍ତ ପର୍ଯ୍ୟାୟଭିତ୍ତିକ ରୋଡମ୍ୟାପ୍',
    stageLabel: 'ପର୍ଯ୍ୟାୟ',
    timeFrameLabel: 'ସମୟସୀମା',
    irrigationScheduleLabel: 'ଜଳସେଚନ ସମୟସୂଚୀ',
    frequencyLabel: 'ଜଳସେଚନ ଆବୃତ୍ତି:',
    timingLabel: 'ସଠିକ୍ ସମୟ:',
    visualCheckLabel: 'ମୃତ୍ତିକା ଯାଞ୍ଚ:',
    actionItemsLabel: 'ମୁଖ୍ୟ କୃଷି କାର୍ଯ୍ୟ ଏବଂ ଖତ',
    sec3Title: '୩. ସଫଳ ଜଳସେଚନର ୪ ସୁବର୍ଣ୍ଣ ନିୟମ',
    sec4Title: '୪. ଫସଲ ସତର୍କତା ସଙ୍କେତ',
    underwateringLabel: '🍂 ଜଳ ଅଭାବର ଲକ୍ଷଣ:',
    overwateringLabel: '💧 ଅତ୍ୟଧିକ ଜଳସେଚନର ଲକ୍ଷଣ:',
    printBtn: 'ରୋଡମ୍ୟାପ୍ ପ୍ରିଣ୍ଟ / ଡାଉନଲୋଡ୍ କରନ୍ତୁ'
  }
};

export function getRoadmapText(key, lang = 'en', ...args) {
  const lMap = ROADMAP_TRANSLATIONS[lang] || ROADMAP_TRANSLATIONS['en'];
  const val = lMap[key] || ROADMAP_TRANSLATIONS['en'][key] || '';
  if (typeof val === 'function') {
    return val(...args);
  }
  return val;
}

export function findCropAgronomy(cropId, cropName) {
  const q = (cropId || cropName || '').toLowerCase().trim();
  if (!q) return null;
  for (const s of CROP_SEASONS_DATA) {
    if (s.crops) {
      const found = s.crops.find(c => 
        c.id === q || 
        q.includes(c.id) || 
        c.id.includes(q) ||
        c.name.toLowerCase().includes(q) ||
        (c.hindiName && c.hindiName.toLowerCase().includes(q))
      );
      if (found) return found;
    }
  }
  return null;
}

function buildCropStages(cropKey, cropTitleEn, cropTitleHi, urea, dap, mop, agro, acres) {
  const cKey = (cropKey || '').toLowerCase();
  const isRice = cKey.includes('rice') || cKey.includes('paddy') || cKey.includes('धान');
  const isMaize = cKey.includes('maize') || cKey.includes('corn') || cKey.includes('मक्का');
  const isWheat = cKey.includes('wheat') || cKey.includes('गेहूं');
  const isCotton = cKey.includes('cotton') || cKey.includes('कपास');
  const isSugarcane = cKey.includes('sugarcane') || cKey.includes('गन्ना');
  const isPotato = cKey.includes('potato') || cKey.includes('आलू');
  const isMustard = cKey.includes('mustard') || cKey.includes('सरसों') || cKey.includes('राई');
  const isGroundnut = cKey.includes('groundnut') || cKey.includes('मूंगफली');
  const isSoybean = cKey.includes('soybean') || cKey.includes('सोयाबीन');
  const isPulse = cKey.includes('gram') || cKey.includes('chana') || cKey.includes('moong') || cKey.includes('urad') || cKey.includes('arhar') || cKey.includes('pulse') || cKey.includes('चना') || cKey.includes('मूंग') || cKey.includes('अरहर');
  const isVegetable = cKey.includes('tomato') || cKey.includes('chilli') || cKey.includes('okra') || cKey.includes('onion') || cKey.includes('garlic') || cKey.includes('brinjal') || cKey.includes('टमाटर') || cKey.includes('मिर्च') || cKey.includes('प्याज');

  // Seed Treatment & Basal Fertilizer
  let seedCareEn = agro?.pestsAndDiseases?.management || 'Treat seeds with Trichoderma viride (4g/kg) before sowing.';
  let seedCareHi = 'त्राइकोर्मा विरिडी (4 ग्राम/किग्रा) से बीज उपचार करें।';

  if (isRice) {
    seedCareEn = 'Seed Treatment: Treat seeds with Trichoderma viride (10g/kg) or Carbendazim (2g/kg) + Azolla biofertilizer.';
    seedCareHi = 'बीज शोधन: ट्राइकोडरमा (10 ग्राम/किग्रा) अथवा कार्बेंडाजिम (2 ग्राम/किग्रा) से बीजोपचार करें।';
  } else if (isMaize) {
    seedCareEn = 'Seed Care: Coat seeds with Cyantraniliprole 600 FS (4ml/kg seed) for early Fall Armyworm protection & Trichoderma.';
    seedCareHi = 'बीज शोधन: सुंडी (Fall Armyworm) से बचाव हेतु सायंनोट्रानिलिप्रोल 600 FS (4ml/kg) से बीजोपचार करें।';
  } else if (isWheat) {
    seedCareEn = 'Seed Treatment: Treat seeds with Carboxin 75% WP (2g/kg) or Thiram (2.5g/kg) against loose smut & termites.';
    seedCareHi = 'बीज शोधन: कण्डुआ रोग व दीमक से बचाव हेतु कार्बोक्सिन (2 ग्राम/किग्रा) अथवा थीरम से उपचार करें।';
  } else if (isCotton) {
    seedCareEn = 'Seed Treatment: Treat seeds with Imidacloprid 70 WS (7g/kg) against sucking pests & Pink Bollworm.';
    seedCareHi = 'बीज शोधन: रसचूसक कीटों से बचाव हेतु इमिडाक्लोप्रिड 70 WS (7 ग्राम/किग्रा) से उपचार करें।';
  } else if (isSugarcane) {
    seedCareEn = 'Sett Care: Dip setts in Carbendazim 0.1% solution + Trichoderma before planting in furrows.';
    seedCareHi = 'बीज शोधन: गन्ने के टुकड़ों को कार्बेंडाजिम 0.1% घोल में डुबोकर नाली में बोएं।';
  } else if (isPotato) {
    seedCareEn = 'Tuber Care: Treat seed tubers with Empart/Boric Acid (3%) solution to prevent black scurf & scab.';
    seedCareHi = 'कंद शोधन: स्कैब रोग से बचाव हेतु आलू कंदों को बोरिक एसिड (3%) से उपचारित करें।';
  } else if (isMustard) {
    seedCareEn = 'Seed Treatment: Treat seeds with Metalaxyl 35% WS (6g/kg) against White Rust & Downy Mildew.';
    seedCareHi = 'बीज शोधन: सफेद रतुआ से बचाव हेतु मैटालेक्सिल 35% WS (6 ग्राम/किग्रा) से बीजोपचार करें।';
  } else if (isPulse || isGroundnut || isSoybean) {
    seedCareEn = 'Seed Treatment: Inoculate seeds with Rhizobium + PSB bio-culture (20g/kg) for nitrogen fixation.';
    seedCareHi = 'बीज शोधन: नाइट्रोजन स्थिरीकरण हेतु राइजोबियम + पीएसबी कल्चर (20 ग्राम/किग्रा) मिलाएं।';
  } else if (isVegetable) {
    seedCareEn = 'Nursery Care: Spray Copper Oxychloride (2.5g/L) to prevent Damping-Off in seedlings.';
    seedCareHi = 'पौध सुरक्षा: डैम्पिंग ऑफ रोग से बचाव हेतु कॉपर ऑक्सीक्लोराइड का छिड़काव करें।';
  }

  // Stage 1 Water & Visual Check
  let stage1WaterEn = 'Pre-sowing soil moistening. Irrigate every 4–6 days as per soil condition.';
  let stage1WaterHi = 'बुआई पूर्व खेत नमी तैयार करें। मिट्टी अनुसार 4-6 दिन पर सिंचाई करें।';
  let stage1VisualEn = 'Keep top 2 inches of soil uniformly moist so seed coats break easily.';
  let stage1VisualHi = 'उपरी 2 इंच मिट्टी नम रखें ताकि अंकुरण शीघ्र हो सके।';

  if (isRice) {
    stage1WaterEn = 'Nursery & Puddling: Maintain 2–3 cm standing water in nursery or puddle field prior to transplanting.';
    stage1WaterHi = 'नर्सरी व रोपाई हेतु 2-3 सेमी जलजमाव अथवा संतृप्त नमी बनाए रखें।';
    stage1VisualEn = 'Keep topsoil saturated; check nursery beds for seedling vigor & stem borer egg masses.';
    stage1VisualHi = 'पौधशाला में पर्याप्त नमी रखें व तना छेदक के अंडों की जाँच करें।';
  } else if (isMaize) {
    stage1WaterEn = 'Pre-sowing soil moistening. Irrigate every 4–6 days as per soil condition. Strictly avoid waterlogging.';
    stage1WaterHi = 'बुआई पूर्व खेत नम करें। मिट्टी अनुसार 4-6 दिन पर सिंचाई करें। जलजमाव न होने दें।';
    stage1VisualEn = 'Keep top 2 inches of soil uniformly moist so seed coats break easily without crust formation.';
    stage1VisualHi = 'उपरी 2 इंच मिट्टी नम रखें ताकि मक्के का अंकुरण बिना पपड़ी बने सुचारू हो।';
  } else if (isWheat) {
    stage1WaterEn = 'Pre-sowing irrigation (Rauni). Ensure uniform seedbed moisture for quick germination.';
    stage1WaterHi = 'रौणी (बुआई पूर्व) सिंचाई करें। समान अंकुरण हेतु मिट्टी में पर्याप्त नमी रखें।';
    stage1VisualEn = 'Keep topsoil moist; avoid soil crusting before coleoptile emergence.';
    stage1VisualHi = 'उपरी मिट्टी नम रखें ताकि अंकुर आसानी से बाहर आ सके।';
  } else if (isCotton) {
    stage1WaterEn = 'Deep pre-sowing irrigation. Light watering at 12–15 DAS along ridges.';
    stage1WaterHi = 'बुआई पूर्व गहरी सिंचाई। 12-15 दिन पर मेढ़ों पर हल्की सिंचाई करें।';
    stage1VisualEn = 'Ensure uniform germination along ridges; replace missing hills early.';
    stage1VisualHi = 'मेढ़ों पर समान अंकुरण की जाँच करें।';
  } else if (isSugarcane) {
    stage1WaterEn = 'Irrigate setts immediately after planting in furrows; repeat every 7–10 days.';
    stage1WaterHi = 'नालियों में गन्ने के टुकड़ों की बुआई के तुरंत बाद सिंचाई करें।';
    stage1VisualEn = 'Check sett eye-buds for uniform shoot emergence.';
    stage1VisualHi = 'गन्ने की आंख से अंकुरण की जाँच करें।';
  } else if (isPotato) {
    stage1WaterEn = 'Light pre-sowing or post-planting ridge irrigation.';
    stage1WaterHi = 'आलू के कंदों की बुआई के तुरंत बाद मेढ़ों पर हल्की सिंचाई करें।';
    stage1VisualEn = 'Keep ridges moist without drowning tuber buds.';
    stage1VisualHi = 'कंदों के अंकुरण हेतु मेढ़ों पर नमी बनाए रखें।';
  }

  // Stage 2 Vegetative Growth
  let stage2WaterEn = 'Irrigate every 7–10 days based on weather and soil dryness.';
  let stage2WaterHi = 'मौसम व मिट्टी के सूखापन के आधार पर 7-10 दिन पर सिंचाई करें।';
  let stage2VisualEn = 'Irrigate when top 1.5 inches of soil feel dry. Prevent root zone cracking.';
  let stage2VisualHi = 'उपरी 1.5 इंच मिट्टी सूखने पर ही पानी दें। जड़ों में दरारें न पड़ने दें।';
  let stage2PestEn = 'Weed & Pest Control: Hand hoeing at Day 25 + Spray Neem Oil 1500 ppm @ 3ml/L.';
  let stage2PestHi = 'निराई व कीट नियंत्रण: 25वें दिन निराई करें व नीम तेल (3 मिली/लीटर) का छिड़काव करें।';

  if (isRice) {
    stage2WaterEn = 'Tillering phase: Maintain 3–5 cm standing water or follow Alternate Wetting & Drying (AWD).';
    stage2WaterHi = 'कल्ले निकलने की अवस्था: 3-5 सेमी पानी रखें अथवा AWD पद्धति अपनाएं।';
    stage2VisualEn = 'Check tillering density (target 10-15 tillers/hill); monitor for leaf folder & BPH.';
    stage2VisualHi = 'कल्लों की संख्या व पत्ती लपेटक/तेले की जाँच करें।';
    stage2PestEn = 'Weed & Pest Control: Spray Bispyribac Sodium 10% SC (100ml/acre) for weeds; Chlorantraniliprole for stem borer.';
    stage2PestHi = 'खरपतवार व कीट नियंत्रण: बिसपायरीबैक सोडियम (100ml/एकड़) का छिड़काव करें व तना छेदक की निगरानी करें।';
  } else if (isMaize) {
    stage2WaterEn = 'Knee-high phase (30 DAS): Irrigate every 7–10 days. Maintain furrow aeration.';
    stage2WaterHi = 'घुटने की ऊंचाई (30 दिन): 7-10 दिन पर सिंचाई करें; नालियों में जल न रुकने दें।';
    stage2VisualEn = 'Check leaf color & cob whorls; inspect for Fall Armyworm damage in central whorl.';
    stage2VisualHi = 'पत्तियों का हरा रंग व पोंगली (Whorl) में सुंडी की जाँच करें।';
    stage2PestEn = 'Pest Control: Spray Emamectin Benzoate 5% SG (80g/acre) into central whorl for Fall Armyworm control.';
    stage2PestHi = 'कीट नियंत्रण: मक्का सुंडी (FAW) नियंत्रण हेतु एमामेक्टिन बेंजोएट 5% SG (80g/एकड़) का पोंगली में छिड़काव करें।';
  } else if (isWheat) {
    stage2WaterEn = 'Crown Root Initiation (21 DAS) & Tillering (40 DAS): Most critical irrigations!';
    stage2WaterHi = 'ताज जड़ अवस्था (CRI - 21 दिन) व कल्ले फूटते समय (40 दिन): अति आवश्यक सिंचाई!';
    stage2VisualEn = 'Check root anchoring & tiller count; inspect lower leaves for yellow rust spots.';
    stage2VisualHi = 'जड़ों के फैलाव व निचले पत्तों पर रतुआ धब्बों की जाँच करें।';
    stage2PestEn = 'Weed Control: Spray Clodinafop 15% WP (160g/acre) or Sulfosulfuron for Gulli Danda (Phalaris minor) at 30-35 DAS.';
    stage2PestHi = 'खरपतवार नियंत्रण: गुल्ली डंडा नियंत्रण हेतु क्लोडिनाफॉप 15% WP (160g/एकड़) का 30-35 दिन पर छिड़काव करें।';
  } else if (isCotton) {
    stage2WaterEn = 'Square formation stage: Irrigate every 10–12 days based on soil moisture.';
    stage2WaterHi = 'शाखाएं व डोडी बनते समय 10-12 दिन पर सिंचाई करें।';
    stage2VisualEn = 'Inspect squares (buds) for jassid & thrips damage; check plant height.';
    stage2VisualHi = 'कली व डोडियों पर हरे तेले व थ्रिप्स की जाँच करें।';
    stage2PestEn = 'Pest Control: Spray Flonicamid 50% WG (60g/acre) for aphids/whiteflies; install Pink Bollworm pheromone traps.';
    stage2PestHi = 'कीट नियंत्रण: सफेद मक्खी व तेले हेतु फ्लोनिकामिड 50% WG (60g/एकड़) व गुलाबी सुंडी ट्रैप लगाएं।';
  } else if (isSugarcane) {
    stage2WaterEn = 'Formative stage: Irrigate every 8–10 days; perform earthing up.';
    stage2WaterHi = 'बड़वार अवस्था: 8-10 दिन पर सिंचाई करें व जड़ों पर मिट्टी चढ़ाएं।';
    stage2VisualEn = 'Check cane tiller count & shoot borer incidence.';
    stage2VisualHi = 'कंसों की बड़वार व तना छेदक की जाँच करें।';
    stage2PestEn = 'Weed Control: Apply Atrazine 50% WP (1kg/acre) + Earthing up at 45 DAS.';
    stage2PestHi = 'खरपतवार नियंत्रण: ऐट्राजीन (1kg/एकड़) का छिड़काव करें व मिट्टी चढ़ाएं।';
  } else if (isPotato) {
    stage2WaterEn = 'Tuber initiation stage: Irrigate every 6–8 days; prevent furrow drying.';
    stage2WaterHi = 'कंद बनने की अवस्था: 6-8 दिन पर हल्की सिंचाई करें।';
    stage2VisualEn = 'Check ridge coverage & tuber node formation.';
    stage2VisualHi = 'मेढ़ों की स्थिति व कन्द ग्रंथियों की जाँच करें।';
    stage2PestEn = 'Earthing Up & Blight Shield: Earth up ridges at 30 DAS + spray Mancozeb 75% WP (600g/acre) against Early Blight.';
    stage2PestHi = 'मिट्टी चढ़ाना व झुलसा सुरक्षा: 30 दिन पर मेढ़ों पर मिट्टी चढ़ाएं व मैंकोजेब (600g/एकड़) छिड़कें।';
  } else if (isMustard) {
    stage2WaterEn = 'Pre-flowering stage (30–35 DAS): Apply 1st light irrigation.';
    stage2WaterHi = 'फूल आने से पूर्व (30-35 दिन): पहली हल्की सिंचाई करें।';
    stage2VisualEn = 'Inspect stem thickness & lower leaves for aphid clusters.';
    stage2VisualHi = 'तने की मोटाई व चेपा (माहू) की जाँच करें।';
    stage2PestEn = 'Aphid Shield: Spray Thiamethoxam 25% WG (40g/acre) if aphids exceed 20/plant.';
    stage2PestHi = 'चेपा (माहू) सुरक्षा: 20 चेपा/पौधा दिखने पर थायामेथॉक्सम 25% WG (40g/एकड़) का छिड़काव करें।';
  }

  // Stage 3 Flowering & Pod/Grain Setting
  let stage3WaterEn = 'Irrigate every 6–8 days. CRITICAL WATER STAGE: Do not allow soil to dry out!';
  let stage3WaterHi = '6-8 दिन पर नियमित सिंचाई करें। फूल व दाना बनते समय नमी की कमी न होने दें!';
  let stage3VisualEn = 'Maintain steady soil moisture; moisture stress causes flower & bud drop.';
  let stage3VisualHi = 'मिट्टी में सतत नमी बनाए रखें; पानी की कमी से फूल व कलियां गिर जाती हैं।';
  let stage3PestEn = 'Disease Shield: Inspect weekly for leaf spot, wilt, or borer pests. Apply fungicides if detected.';
  let stage3PestHi = 'रोग व कीट सुरक्षा: फफूंद व सुंडी कीट की निगरानी करें और आवश्यकतानुसार कीटनाशक छिड़कें।';

  if (isRice) {
    stage3WaterEn = 'Panicle Initiation & Flowering stage: Keep 5 cm standing water. ZERO WATER STRESS ALLOWED!';
    stage3WaterHi = 'बाली निकलते समय व फूल आने पर: 5 सेमी पानी बनाए रखें। पानी की कमी बिलकुल न होने दें!';
    stage3VisualEn = 'Check panicle emergence & grain milking stage; maintain continuous moisture.';
    stage3VisualHi = 'बालियां निकलने व दूधिया दाने की अवस्था की जाँच करें।';
    stage3PestEn = 'Disease Shield: Spray Tricyclazole 75% WP (120g/acre) for Rice Blast & Hexaconazole for Sheath Blight.';
    stage3PestHi = 'रोग सुरक्षा: धान झोंका (Blast) हेतु ट्राइसाइक्लाजोल (120g/एकड़) व शीथ ब्लाइट हेतु हेक्साकोनाज़ोल छिड़कें।';
  } else if (isMaize) {
    stage3WaterEn = 'Tasseling & Silking stage (45–55 DAS): Critical water window! Moisture stress reduces cob yield by 40%.';
    stage3WaterHi = 'मंजर (Tassel) व सिल्क आते समय (45-55 दिन): अति संवेदनशील समय! पानी की कमी से 40% उपज घट सकती है।';
    stage3VisualEn = 'Check silk browning & cob filling; ensure no armyworm damage on cob tip.';
    stage3VisualHi = 'सिल्क भूरा होने व भुट्टे में दाने भरने की जाँच करें।';
    stage3PestEn = 'Cob Care: Spray Chlorantraniliprole 18.5% SC (60ml/acre) if Armyworm attacks cobs; NPK 13-0-45 foliar spray.';
    stage3PestHi = 'भुट्टा सुरक्षा: भुट्टे में सुंडी दिखने पर क्लोरेंट्रानिलिप्रोल (60ml/एकड़) व NPK 13-0-45 का स्प्रे करें।';
  } else if (isWheat) {
    stage3WaterEn = 'Booting & Flowering stage (80 DAS): Maintain optimum soil moisture; avoid water stress during flowering.';
    stage3WaterHi = 'गभोट व फूल आने की अवस्था (80 दिन): मिट्टी में पर्याप्त नमी रखें।';
    stage3VisualEn = 'Check earhead emergence & yellow rust spots on upper flag leaf.';
    stage3VisualHi = 'बालियां निकलने व झंडा पत्ती पर रतुआ रोग की जाँच करें।';
    stage3PestEn = 'Rust Shield: Spray Propiconazole 25% EC (Tilt) @ 200ml/acre at first sign of Yellow/Brown Rust.';
    stage3PestHi = 'रतुआ सुरक्षा: पीला/भूरा रतुआ दिखने पर प्रोपिकोनाज़ोल 25% EC (टिल्ट @ 200ml/एकड़) का स्प्रे करें।';
  } else if (isCotton) {
    stage3WaterEn = 'Peak Flowering & Boll Development: Irrigate every 8–10 days; avoid waterlogging.';
    stage3WaterHi = 'फूल व डोडियां बनते समय: 8-10 दिन पर नियमित सिंचाई करें।';
    stage3VisualEn = 'Check boll formation & bollworm entry holes.';
    stage3VisualHi = 'डोडियों के बढाव व गुलाबी सुंडी के छिद्रों की जाँच करें।';
    stage3PestEn = 'Boll Guard: Spray Profenofos 50% EC (400ml/acre) or Spinetoram for Pink Bollworm & American Bollworm.';
    stage3PestHi = 'डोडी सुरक्षा: गुलाबी सुंडी हेतु प्रोफेनोफॉस (400ml/एकड़) अथवा स्पिनेटोराम का छिड़काव करें।';
  } else if (isSugarcane) {
    stage3WaterEn = 'Grand Growth stage: High water requirement; irrigate every 7–8 days.';
    stage3WaterHi = 'तीव्र बड़वार अवस्था: 7-8 दिन पर नियमित सिंचाई करें।';
    stage3VisualEn = 'Check cane internode elongation & top borer damage.';
    stage3VisualHi = 'गन्ने की पोरियों की लंबाई व चोटी छेदक की जाँच करें।';
    stage3PestEn = 'Borer Shield: Apply Chlorantraniliprole 0.4% GR granules (7.5kg/acre) against Top Borer.';
    stage3PestHi = 'चोटी छेदक: टॉप बोरर नियंत्रण हेतु क्लोरेंट्रानिलिप्रोल दानेदार (7.5kg/एकड़) जमीन में दें।';
  } else if (isPotato) {
    stage3WaterEn = 'Tuber bulking stage: Maintain consistent ridge moisture for rapid tuber expansion.';
    stage3WaterHi = 'कंद फूलने की अवस्था: कंदों के बढाव हेतु मेढ़ों में नमी बनाए रखें।';
    stage3VisualEn = 'Inspect foliage for late blight water-soaked spots.';
    stage3VisualHi = 'पत्तियों पर पिछैता झुलसा (Late Blight) धब्बों की जाँच करें।';
    stage3PestEn = 'Late Blight Shield: Spray Cymoxanil + Mancozeb (Moximate @ 600g/acre) to control Late Blight.';
    stage3PestHi = 'पिछैता झुलसा सुरक्षा: लेट ब्लाइट (Late Blight) से बचाव हेतु सायमोक्सानिल + मैंकोजेब छिड़कें।';
  } else if (isMustard) {
    stage3WaterEn = 'Pod formation stage (60–65 DAS): Apply 2nd critical irrigation.';
    stage3WaterHi = 'फलियां बनते समय (60-65 दिन): दूसरी अति आवश्यक सिंचाई करें।';
    stage3VisualEn = 'Check siliqua (pod) filling & aphid population.';
    stage3VisualHi = 'फलियों में दाने भरने व चेपा कीट की जाँच करें।';
    stage3PestEn = 'Alternaria & White Rust Shield: Spray Mancozeb 75% WP (600g/acre) or Azoxystrobin.';
    stage3PestHi = 'सफेद रतुआ सुरक्षा: अल्टरनेरिया व सफेद रतुआ हेतु मैंकोजेब (600g/एकड़) का छिड़काव करें।';
  } else if (isPulse) {
    stage3PestEn = 'Pod Borer Shield: Spray Indoxacarb 14.5% SC (200ml/acre) or Emamectin Benzoate for Helicoverpa pod borer.';
    stage3PestHi = 'फली छेदक सुरक्षा: फलियों में सुंडी से बचाव हेतु इंडोक्साकार्ब (200ml/एकड़) का स्प्रे करें।';
  }

  // Stage 4 Harvest & Maturation
  let stage4WaterEn = 'Reduce watering gradually; STOP ALL IRRIGATION 10–14 days before harvest.';
  let stage4WaterHi = 'सिंचाई धीरे-धीरे कम करें; कटाई से 10-14 दिन पहले पानी बंद कर दें।';
  let stage4ActionEn = 'Harvest & Storage: Harvest at 12-14% grain/seed moisture and dry under sun before storage.';
  let stage4ActionHi = 'कटाई व भंडारण: दाने/फल में नमी 12-14% रहने पर कटाई कर सुखाकर भंडारण करें।';

  if (isRice) {
    stage4WaterEn = 'Drain out standing water 10–14 days prior to harvest to facilitate mechanical combining.';
    stage4WaterHi = 'कम्बाइन हार्वेस्टर आसानी से चलने हेतु कटाई से 10-14 दिन पहले खेत का पानी निकाल दें।';
    stage4ActionEn = 'Harvest & Storage: Harvest when 85% panicles turn golden yellow; dry grain to <12% moisture.';
    stage4ActionHi = 'कटाई व भंडारण: 85% बालियां सुनहरी पीली होने पर कटाई करें व दाना नमी 12% से कम रखें।';
  } else if (isMaize) {
    stage4WaterEn = 'Stop irrigation 10–12 days before harvest when cob husk turns dry brown.';
    stage4WaterHi = 'भुट्टे का छिलका भूरा व सूखा होते ही कटाई से 10-12 दिन पूर्व सिंचाई बंद कर दें।';
    stage4ActionEn = 'Harvest & Storage: Harvest cobs when husk turns straw yellow; shell and sun-dry grain to 12% moisture.';
    stage4ActionHi = 'कटाई व भंडारण: भुट्टे का छिलका भूरा होने पर कटाई करें व दाना सुखाकर नमी 12% लाएं।';
  } else if (isWheat) {
    stage4WaterEn = 'Stop irrigation 12–15 days before harvest when grain reaches hard dough stage.';
    stage4WaterHi = 'दाना सख्त होते ही कटाई से 12-15 दिन पूर्व सिंचाई बंद कर दें।';
    stage4ActionEn = 'Harvest & Storage: Combine harvest at 12-14% grain moisture; dry under sun before bagging.';
    stage4ActionHi = 'कटाई व भंडारण: दाना नमी 12-14% रहने पर कटाई कर सुखाकर भंडारण करें।';
  } else if (isCotton) {
    stage4WaterEn = 'Withhold water 15–20 days before final picking to prevent boll rot.';
    stage4WaterHi = 'सड़न रोकने हेतु अंतिम चुनाई से 15-20 दिन पहले सिंचाई रोक दें।';
    stage4ActionEn = 'Picking & Storage: Pick clean, dry bolls in morning after dew dries; store in dry ventilated room.';
    stage4ActionHi = 'चुनाई व भंडारण: ओस सूखने के बाद सूखी साफ रुई की चुनाई करें व हवादार कमरे में रखें।';
  } else if (isSugarcane) {
    stage4WaterEn = 'Stop watering 25–30 days before harvest to increase sucrose sugar content.';
    stage4WaterHi = 'शर्करा (मिठास) बढ़ाने हेतु कटाई से 25-30 दिन पहले सिंचाई बंद कर दें।';
    stage4ActionEn = 'Harvesting: Cut canes close to ground level using sharp sickle; supply to sugar mill within 24 hours.';
    stage4ActionHi = 'कटाई: गन्ने को जमीन की सतह से काटें व 24 घंटे के भीतर मील में भेजें।';
  } else if (isPotato) {
    stage4WaterEn = 'Haulm cutting / dehaulming 10–12 days before harvesting; stop watering completely.';
    stage4WaterHi = 'कंदों की छाल पक्की करने हेतु कटाई से 10-12 दिन पहले बेल काट दें व पानी बंद करें।';
    stage4ActionEn = 'Digging & Curing: Dig tubers carefully without skin cuts; cure under shade for 7-10 days before cold storage.';
    stage4ActionHi = 'खुदाई व भंडारण: छिलका कटे बिना सावधानी से कंद निकालें व 7-10 दिन छाया में सुखाकर कोल्ड स्टोर भेजें।';
  } else if (isMustard) {
    stage4WaterEn = 'Stop watering when pods turn golden brown (10–12 days before harvest).';
    stage4WaterHi = 'फलियां सुनहरी भूरी होते ही कटाई से 10-12 दिन पूर्व पानी बंद करें।';
    stage4ActionEn = 'Harvesting: Harvest early morning to prevent pod shattering; thresh and dry seed to <8% moisture.';
    stage4ActionHi = 'कटाई: फलियां चटकने से बचाने हेतु सुबह के समय कटाई करें व नमी 8% से कम रखें।';
  }

  const stagesEn = [
    {
      stageNum: 1,
      title: `Stage 1: Sowing & Germination / Nursery`,
      daysRange: isSugarcane ? `Day 1 – 25` : `Day 1 – 15 (Week 1–2)`,
      waterFrequency: stage1WaterEn,
      exactTiming: `Early Morning (6:00 AM – 8:30 AM)`,
      visualCheck: stage1VisualEn,
      actionItems: [
        `Basal Fertilizer: Apply DAP ${dap} kg/acre + MOP ${mop} kg/acre + FYM 5 Tons/acre into topsoil.`,
        seedCareEn
      ],
      waterReqLitersPerAcrePerDay: isRice ? 5000 : (isSugarcane ? 4500 : 2800),
      totalLitersForFarmPerDay: Math.round((isRice ? 5000 : 2800) * acres)
    },
    {
      stageNum: 2,
      title: `Stage 2: Active Vegetative Growth & Branching`,
      daysRange: isSugarcane ? `Day 26 – 90` : `Day 16 – 40 (Week 3–6)`,
      waterFrequency: stage2WaterEn,
      exactTiming: `Early Morning or Evening`,
      visualCheck: stage2VisualEn,
      actionItems: [
        `1st Top Dressing: Apply Urea ${Math.round(urea * 0.6)} kg/acre + Zinc Sulphate (21%) 10 kg/acre.`,
        stage2PestEn
      ],
      waterReqLitersPerAcrePerDay: isRice ? 6500 : (isCotton ? 4800 : 4200),
      totalLitersForFarmPerDay: Math.round((isRice ? 6500 : 4200) * acres)
    },
    {
      stageNum: 3,
      title: `Stage 3: Flowering & Pod/Grain Setting (Critical Phase)`,
      daysRange: isSugarcane ? `Day 91 – 210` : `Day 41 – 75 (Week 7–11)`,
      waterFrequency: stage3WaterEn,
      exactTiming: `Early Morning (Avoid windy hours)`,
      visualCheck: stage3VisualEn,
      actionItems: [
        `2nd Top Dressing: Apply Urea ${Math.round(urea * 0.4)} kg/acre + Boron 20% @ 200g/acre foliar spray.`,
        stage3PestEn
      ],
      waterReqLitersPerAcrePerDay: isRice ? 8000 : (isSugarcane ? 7000 : 5400),
      totalLitersForFarmPerDay: Math.round((isRice ? 8000 : 5400) * acres)
    },
    {
      stageNum: 4,
      title: `Stage 4: Maturation, Grain Filling & Harvest`,
      daysRange: `Day 76 – Harvest`,
      waterFrequency: stage4WaterEn,
      exactTiming: `Early Morning`,
      visualCheck: `Stop watering when leaves/husks turn yellow/brown and crop reaches harvest maturity.`,
      actionItems: [
        `Quality Spray: Apply 1% SOP (0-0-50) @ 1 kg/acre for color, luster, and grain/fruit weight.`,
        stage4ActionEn
      ],
      waterReqLitersPerAcrePerDay: 3500,
      totalLitersForFarmPerDay: Math.round(3500 * acres)
    }
  ];

  const stagesHi = [
    {
      stageNum: 1,
      title: `चरण 1: बुआई और अंकुरण (Sowing & Germination)`,
      daysRange: isSugarcane ? `दिन 1 – 25` : `दिन 1 – 15 (सप्ताह 1–2)`,
      waterFrequency: stage1WaterHi,
      exactTiming: `प्रातः काल (सुबह 6:00 से 8:30 बजे)`,
      visualCheck: stage1VisualHi,
      actionItems: [
        `बुआई पूर्व खाद: ${dap} किग्रा DAP + ${mop} किग्रा MOP + 5 टन गोबर खाद प्रति एकड़ मिलाएं।`,
        seedCareHi
      ],
      waterReqLitersPerAcrePerDay: isRice ? 5000 : 2800,
      totalLitersForFarmPerDay: Math.round((isRice ? 5000 : 2800) * acres)
    },
    {
      stageNum: 2,
      title: `चरण 2: पौधों की बड़वार व शाखाएं निकलना`,
      daysRange: isSugarcane ? `दिन 26 – 90` : `दिन 16 – 40 (सप्ताह 3–6)`,
      waterFrequency: stage2WaterHi,
      exactTiming: `प्रातः काल अथवा शाम`,
      visualCheck: stage2VisualHi,
      actionItems: [
        `पहला उर्वरक: ${Math.round(urea * 0.6)} किग्रा यूरिया + 10 किग्रा जिंक सल्फेट प्रति एकड़ डालें।`,
        stage2PestHi
      ],
      waterReqLitersPerAcrePerDay: isRice ? 6500 : 4200,
      totalLitersForFarmPerDay: Math.round((isRice ? 6500 : 4200) * acres)
    },
    {
      stageNum: 3,
      title: `चरण 3: फूल आना व फल/दाना बनना (अति संवेदनशील अवस्था)`,
      daysRange: isSugarcane ? `दिन 91 – 210` : `दिन 41 – 75 (सप्ताह 7–11)`,
      waterFrequency: stage3WaterHi,
      exactTiming: `प्रातः काल (शांत हवा के समय)`,
      visualCheck: stage3VisualHi,
      actionItems: [
        `दूसरा उर्वरक: ${Math.round(urea * 0.4)} किग्रा यूरिया + 200 ग्राम बोरॉन प्रति एकड़ का स्प्रे करें।`,
        stage3PestHi
      ],
      waterReqLitersPerAcrePerDay: isRice ? 8000 : 5400,
      totalLitersForFarmPerDay: Math.round((isRice ? 8000 : 5400) * acres)
    },
    {
      stageNum: 4,
      title: `चरण 4: फसल पकना, दाना/फल भरना व कटाई`,
      daysRange: `दिन 76 – कटाई`,
      waterFrequency: stage4WaterHi,
      exactTiming: `प्रातः काल`,
      visualCheck: `पत्तियां व छिलका पीला/भूरा पड़ते ही सिंचाई बंद कर दें।`,
      actionItems: [
        `गुणवत्ता स्प्रे: चमक व दाना मोटा करने हेतु 1% SOP (0-0-50 @ 1 किग्रा/एकड़) का स्प्रे करें।`,
        stage4ActionHi
      ],
      waterReqLitersPerAcrePerDay: 3500,
      totalLitersForFarmPerDay: Math.round(3500 * acres)
    }
  ];

  // Golden Rules per Crop
  let goldenRulesEn = [
    `Water ${cropTitleEn} in Early Morning: Irrigate between 6:00 AM and 9:00 AM to reduce evaporation loss and prevent leaf spot.`,
    `Check Soil Moisture Manually: Water when top 1.5 to 2 inches of soil feel dry—avoid rigid calendar watering if soil is moist.`,
    `Ensure Proper Field Drainage: Never allow standing water around ${cropTitleEn} roots to prevent wilt rot & root browning.`,
    `Stop Irrigation Prior to Harvest: Withhold watering 10–14 days before harvest for uniform ${cropTitleEn} maturity.`
  ];

  let goldenRulesHi = [
    `${cropTitleHi} में प्रातः काल सिंचाई करें: सुबह 6 से 9 बजे के बीच पानी देने से वाष्पीकरण कम होता है व फफूंद रोग से बचाव होता है।`,
    `मिट्टी की नमी हाथ से जाँचें: उपरी 1.5 से 2 इंच मिट्टी सूखने पर ही सिंचाई करें।`,
    `खेत में सुगम जल निकासी रखें: ${cropTitleHi} की जड़ों के पास जलजमाव न होने दें ताकि सड़न रोग न फैले।`,
    `कटाई पूर्व सिंचाई बंद करें: फसल पकने पर कटाई से 10-14 दिन पहले सिंचाई बंद कर दें।`
  ];

  if (isRice) {
    goldenRulesEn = [
      `Water Rice / Paddy in Early Morning: Maintain 3–5 cm controlled water level; avoid deep flooding >10 cm.`,
      `Practice Alternate Wetting & Drying (AWD): Allow soil surface to dry slightly before re-flooding to save 25% water.`,
      `Prevent Water Stress during Flowering: Panicle initiation & flowering require constant moisture; never let field dry.`,
      `Drain Field Before Harvest: Stop irrigation 10–14 days prior to harvest for uniform grain drying.`
    ];
    goldenRulesHi = [
      `धान में प्रातः काल सिंचाई करें: 3-5 सेमी नियंत्रित जल स्तर बनाए रखें; 10 सेमी से अधिक गहरा पानी न भरें।`,
      `AWD पद्धति अपनाएं: 25% पानी की बचत हेतु मिट्टी में हल्की दरारें आने पर ही पुनः सिंचाई करें।`,
      `फूल व बाली आते समय नमी बनाए रखें: बाली निकलते समय पानी की कमी बिलकुल न होने दें।`,
      `कटाई पूर्व पानी निकालें: मशीन से कटाई हेतु 10-14 दिन पहले खेत सुखाएं।`
    ];
  } else if (isMaize) {
    goldenRulesEn = [
      `Water Maize / Corn in Early Morning: Irrigate between 6:00 AM and 9:00 AM to reduce evaporation loss and prevent leaf spot.`,
      `Check Soil Moisture Manually: Water when top 1.5 to 2 inches of soil feel dry—avoid rigid calendar watering if soil is moist.`,
      `Ensure Strict Field Drainage: Never allow standing water around Maize roots to prevent wilt rot & stem rot.`,
      `Stop Irrigation Prior to Harvest: Withhold watering 10–14 days before harvest for uniform cob drying.`
    ];
    goldenRulesHi = [
      `मक्के में प्रातः काल सिंचाई करें: सुबह 6 से 9 बजे पानी देने से वाष्पीकरण कम होता है व पत्ती धब्बा रोग से बचाव होता है।`,
      `मिट्टी की नमी हाथ से जाँचें: उपरी 1.5 से 2 इंच मिट्टी सूखने पर ही पानी दें।`,
      `सुगम जल निकासी रखें: मक्के की जड़ों के पास पानी न रुकने दें ताकि तना सड़न रोग न फैले।`,
      `कटाई पूर्व सिंचाई बंद करें: भुट्टा सूखने पर कटाई से 10-12 दिन पहले सिंचाई रोक दें।`
    ];
  } else if (isWheat) {
    goldenRulesEn = [
      `Irrigate Wheat at Crown Root Initiation (CRI at 21 DAS): Most critical irrigation! Missing CRI reduces yield by 30%.`,
      `Provide Light Irrigations during Flowering: Avoid heavy watering on windy days to prevent crop lodging (falling over).`,
      `Maintain Soil Moisture during Grain Filling (Booting & Milking): Essential for plump, heavy grain weight.`,
      `Stop Watering 12–15 Days Before Harvest: Allows uniform golden ripening and clean machine combining.`
    ];
    goldenRulesHi = [
      `गेहूं में ताज जड़ (CRI - 21 दिन) पर अवश्य सिंचाई करें: सबसे अति संवेदनशील समय! इस समय पानी न मिलने से 30% उपज घट सकती है।`,
      `फूल आते समय हल्की सिंचाई करें: तेज हवा के समय भारी सिंचाई न करें ताकि फसल गिरे नहीं।`,
      `दाना भरते समय नमी बनाए रखें: मोटे व भारी दानों हेतु दुग्ध अवस्था में सिंचाई आवश्यक है।`,
      `कटाई से 12-15 दिन पूर्व पानी बंद करें: कम्बाइन से साफ कटाई हेतु खेत को सुखाएं।`
    ];
  } else if (isCotton) {
    goldenRulesEn = [
      `Water Cotton in Alternate Furrows: Saves 30% water and improves root zone soil aeration.`,
      `Protect Squares & Flowers: Avoid water stress during square formation and peak boll development.`,
      `Prevent Waterlogging: Cotton is highly sensitive to standing water; ensure deep furrow drainage.`,
      `Withhold Water 15–20 Days Before Final Picking: Prevents boll rotting and keeps cotton lint clean.`
    ];
    goldenRulesHi = [
      `कपास में एक छोड़कर एक नाली में सिंचाई करें: 30% पानी की बचत होती है व जड़ों को हवा मिलती है।`,
      `डोडियों की सुरक्षा करें: कली व डोडी बनते समय पानी की कमी न होने दें।`,
      `जलजमाव से बचाएं: कपास में नालियों द्वारा पानी की सुगम निकासी रखें।`,
      `अंतिम चुनाई से 15-20 दिन पूर्व पानी बंद करें: रुई की गुणवत्ता व सफेदी बनी रहती है।`
    ];
  } else if (isSugarcane) {
    goldenRulesEn = [
      `Deep Furrow Irrigation: Water in broad furrows to ensure deep root penetration during summer tillering.`,
      `Trash Mulching: Spread dried cane leaves between rows to conserve soil moisture and suppress weeds.`,
      `Irrigate Every 8–10 Days in Formative Phase: Essential for high cane height and thick girth.`,
      `Stop Irrigation 25–30 Days Before Harvest: Increases sucrose concentration and sugar recovery.`
    ];
    goldenRulesHi = [
      `गहरी नाली सिंचाई: गर्मी में गन्ने की जड़ों के विकास हेतु गहरी नालियों में पानी दें।`,
      `पराली/पत्ती मल्चिंग: नमी बनाए रखने हेतु पंक्तियों के बीच गन्ने की सूखी पत्तियां बिछाएं।`,
      `बड़वार अवस्था में 8-10 दिन पर पानी दें: गन्ने की लंबाई व मोटाई बढ़ाने हेतु आवश्यक।`,
      `कटाई से 25-30 दिन पूर्व सिंचाई बंद करें: गन्ने में मिठास (Sucrose) बढ़ाने हेतु।`
    ];
  } else if (isPotato) {
    goldenRulesEn = [
      `Keep Ridges Consistently Moist: Light frequent irrigation produces smooth, uniform tubers.`,
      `Strict Zero-Waterlogging Policy: Standing water causes tuber rotting and bacterial wilt.`,
      `Irrigate During Tuber Expansion: Water stress during bulking leads to misshapen or cracked tubers.`,
      `Stop Irrigation & Cut Vines 10–12 Days Before Harvest: Hardens tuber skin for long shelf life.`
    ];
    goldenRulesHi = [
      `मेढ़ों पर समान नमी रखें: हल्की नियमित सिंचाई से सुडौल व साफ आलू बनते हैं।`,
      `जलजमाव बिलकुल न होने दें: पानी रुकने से कंद सड़न व जीवाणु झुलसा रोग फैलता है।`,
      `कंद बढाव के समय सिंचाई दें: कंद फूलते समय पानी कम होने से आलू फट जाते हैं।`,
      `कटाई से 10-12 दिन पहले बेल काटें व पानी बंद करें: आलू का छिलका पक्का करने हेतु।`
    ];
  } else if (isMustard) {
    goldenRulesEn = [
      `Pre-Flowering Irrigation (30–35 DAS): Critical 1st watering for strong branching & aphid tolerance.`,
      `Pod Formation Irrigation (60–65 DAS): Apply 2nd light irrigation to maximize seed oil percentage.`,
      `Avoid Heavy Waterlogging: Mustard roots rot quickly in standing water; ensure furrow drainage.`,
      `Stop Watering When Pods Turn Golden: Withhold irrigation 10–12 days before harvest to prevent pod shattering.`
    ];
    goldenRulesHi = [
      `फूल आने पूर्व (30-35 दिन) सिंचाई: शाखाएं मजबूत करने व चेपा कीट प्रतिरोध हेतु पहली अति आवश्यक सिंचाई।`,
      `फली बनते समय (60-65 दिन) सिंचाई: तेल का प्रतिशत व दाना वजन बढ़ाने हेतु दूसरी हल्की सिंचाई करें।`,
      `जलजमाव से बचाएं: सरसों की जड़ें जलभराव से सड़ जाती हैं; नालियों से जल निकासी रखें।`,
      `फलियां सुनहरी होने पर पानी रोकें: फलियां चटकने से बचाने हेतु कटाई से 10-12 दिन पहले सिंचाई बंद करें।`
    ];
  } else if (isPulse) {
    goldenRulesEn = [
      `Protect Rhizobium Root Nodules in ${cropTitleEn}: Avoid heavy nitrogen fertilizer & over-watering so roots fix natural atmospheric nitrogen.`,
      `Light Irrigations at Flowering & Pod Initiation: Apply light watering at Day 30 & Day 55; avoid heavy flooding.`,
      `Strict Zero-Waterlogging Policy: ${cropTitleEn} is extremely sensitive to standing water; waterlogging causes rapid Phytophthora wilt rot within 24 hours.`,
      `Stop Irrigation at Pod Maturity: Withhold watering 10–12 days prior to harvest to prevent pod blackening & seed mold.`
    ];
    goldenRulesHi = [
      `${cropTitleHi} में राइजोबियम जड़ ग्रंथि सुरक्षा: अत्यधिक यूरिया व भारी सिंचाई से बचें ताकि जड़ ग्रंथियां हवा से प्राकृतिक नाइट्रोजन सोख सकें।`,
      `फूल व फली बनते समय हल्की सिंचाई करें: भारी जलभराव न करें; केवल 30 दिन व 55 दिन पर आवश्यकतानुसार हल्की सिंचाई दें।`,
      `जलजमाव से पूर्ण सुरक्षा: ${cropTitleHi} पानी रुकने से 24 घंटे में उकठा/सड़न रोग से नष्ट हो जाती है।`,
      `फली पकने पर पानी रोकें: फलियां काली होने से बचाने हेतु कटाई से 10-12 दिन पहले सिंचाई बंद कर दें।`
    ];
  } else if (isGroundnut) {
    goldenRulesEn = [
      `Pegging Stage Moisture (40–50 DAS): Keep topsoil moist & loose so groundnut pegs can easily penetrate the ground.`,
      `Apply Gypsum at Flowering: Top-dress 200 kg/acre Gypsum during peg formation for solid pod filling & shell strength.`,
      `Light Sprinkler or Furrow Irrigation: Avoid soil compaction; light irrigations ensure uniform pod development.`,
      `Stop Watering 7–10 Days Before Digging: Facilitates easy soil loosening and clean pod harvest.`
    ];
    goldenRulesHi = [
      `सुइयां (Pegs) बनते समय (40-50 दिन) पर्याप्त नमी रखें: मिट्टी नम व भुरभुरी रहे ताकि सुइयां आसानी से जमीन में प्रवेश कर सकें।`,
      `जिप्सम का प्रयोग करें: फलियां मजबूत व भरी बनने हेतु फूल आने पर 200 किग्रा/एकड़ जिप्सम डालें।`,
      `हल्की सिंचाई करें: मिट्टी सख्त होने से बचाएं; हल्की सिंचाई से मूंगफली का अच्छा विकास होता है।`,
      `खुदाई से 7-10 दिन पूर्व पानी बंद करें: जिससे मिट्टी आसानी से ढीली हो सके व फलियां साफ बाहर आएं।`
    ];
  } else if (isSoybean) {
    goldenRulesEn = [
      `Critical Moisture Window (R3-R5 Stage): Ensure adequate soil moisture during flowering & pod filling; drought stress cuts yield by 50%.`,
      `Broadbed Furrow System: Plant soybean on raised beds so excess monsoon rain drains away from roots.`,
      `Inoculate Seeds with Bradyrhizobium: Boost natural nitrogen fixation without synthetic urea overload.`,
      `Stop Watering at 75% Pod Browning: Withhold irrigation 10 days before harvest for uniform bean drying.`
    ];
    goldenRulesHi = [
      `फली बनने व दाना भरने की अवस्था: इस दौरान पानी की कमी से सोयाबीन उपज 50% तक घट सकती है।`,
      `रिज-फर्रो (मेढ़-नाली) विधि: मानसून के अतिरिक्त पानी की निकासी हेतु सर्वोत्तम।`,
      `जैविक खाद से बीजोपचार: ब्रैडीराइजोबियम कल्चर से बीजोपचार कर बोएं।`,
      `75% फलियां पीली होने पर पानी बंद करें: कटाई से 10 दिन पूर्व सिंचाई रोक दें।`
    ];
  } else if (isVegetable) {
    goldenRulesEn = [
      `Drip Fertigation for ${cropTitleEn}: Irrigate every 2–4 days in light doses directly to root zones with soluble NPK.`,
      `Prevent Fruit Cracking & Blossom End Rot: Maintain uniform soil moisture; avoid extreme wet-dry soil fluctuations.`,
      `Staking & Plastic Mulching: Use plastic mulch to conserve water, suppress weeds, and keep ${cropTitleEn} off damp soil.`,
      `Stop Watering 3–5 Days Before Picking: Enhances fruit firmness, natural sweetness, and market transport shelf-life.`
    ];
    goldenRulesHi = [
      `${cropTitleHi} में ड्रिप सिंचाई अपनाएं: 2-4 दिन पर घुलनशील खाद के साथ जड़ों में हल्की सिंचाई दें।`,
      `फल चटकने से बचाएं: मिट्टी की नमी में अचानक बदलाव न आने दें ताकि फल फटे नहीं व सड़े नहीं।`,
      `मल्चिंग व सहारा देना: प्लास्टिक मल्च का उपयोग कर नमी बचाएं व पौधों को लकड़ी का सहारा दें।`,
      `तुड़ाई से 3-5 दिन पहले पानी रोकें: फलों में मिठास, चमक व शेल्फ लाइफ बढ़ाने हेतु।`
    ];
  }

  // Warning Flags per Crop
  let warningFlagsEn = {
    underwatering: [
      `${cropTitleEn} leaves curling or rolling inward, dull grayish-green foliage color.`,
      `Premature lower leaf drop and stunted branch/tiller development.`
    ],
    overwatering: [
      `Lower leaves turning yellow while stems feel soft or droopy in ${cropTitleEn}.`,
      `Soggy, sour-smelling soil surface with stunted root uptake.`
    ]
  };

  let warningFlagsHi = {
    underwatering: [
      `${cropTitleHi} की पत्तियों का अंदर मुड़ना व रंग फीका होना।`,
      `निचली पत्तियों का समय पूर्व गिरना व पौधों की बड़वार रुकना।`
    ],
    overwatering: [
      `${cropTitleHi} में खेत में जलजमाव से निचली पत्तियों का पीला पड़ना व तना नरम होना।`,
      `मिट्टी में दुर्गंध व जड़ों की बड़वार रुकना।`
    ]
  };

  if (isRice) {
    warningFlagsEn = {
      underwatering: [
        `Rice leaf blades rolling inward into needle shape, leaf tip drying.`,
        `Delayed flowering & poor panicle emergence due to soil moisture drying.`
      ],
      overwatering: [
        `Lower leaves turning yellow, sulfurous foul smell from anaerobic stagnant mud.`,
        `Weak, soft tillers prone to stem rot & lodging.`
      ]
    };
    warningFlagsHi = {
      underwatering: [
        `धान की पत्तियों का सुई की तरह मुड़ना व सिरों का सूखना।`,
        `बाली निकलने में देरी व दाना न भरना।`
      ],
      overwatering: [
        `निचली पत्तियों का पीला पड़ना व मिट्टी से दुर्गंध आना।`,
        `कमजोर पौधे जो हवा में आसानी से गिर जाते हैं।`
      ]
    };
  } else if (isMaize) {
    warningFlagsEn = {
      underwatering: [
        `Maize leaves curling tightly inward, dull grayish-green foliage.`,
        `Stunted plant growth, poorly filled cob tips (grain gap).`
      ],
      overwatering: [
        `Lower leaves turning bright yellow, purple leaf tips, soft stalk rot.`,
        `Waterlogged root death and yellowing of central whorl.`
      ]
    };
    warningFlagsHi = {
      underwatering: [
        `मक्के की पत्तियों का अंदर मुड़ना व रंग फीका पड़ना।`,
        `पौधों की बड़वार रुकना व भुट्टे के ऊपरी हिस्से में दाने न भरना।`
      ],
      overwatering: [
        `निचली पत्तियों का पीला/बैंगनी पड़ना व तना सड़ना।`,
        `जड़ों का दम घुटना व पोंगली का पीला पड़ना।`
      ]
    };
  } else if (isWheat) {
    warningFlagsEn = {
      underwatering: [
        `Wheat leaves wilting early morning, dull pale green color.`,
        `Short earheads with light, shrivelled grain weight.`
      ],
      overwatering: [
        `Foliage yellowing from base, soft weak stems prone to lodging.`,
        `Yellow rust infection spreading in waterlogged patches.`
      ]
    };
    warningFlagsHi = {
      underwatering: [
        `गेहूं के पत्तों का मुरझाना व पीलापन।`,
        `छोटी बालियां व दाना पिचका रहना।`
      ],
      overwatering: [
        `पौधों का पीला पड़ना व तेज हवा में फसल गिर जाना।`,
        `जलजमाव वाले स्थानों में पीला रतुआ का फैलाव।`
      ]
    };
  } else if (isPulse) {
    warningFlagsEn = {
      underwatering: [
        `${cropTitleEn} leaves wilting & turning dull yellow during midday; flower & pod drop.`,
        `Stunted pod length with poorly filled seeds inside.`
      ],
      overwatering: [
        `Rapid whole-plant wilting, yellowing canopy & brown/black xylem root rot (Phytophthora/Fusarium).`,
        `Nodule decay in roots and severe leaf browning within 24 hours of standing water.`
      ]
    };
    warningFlagsHi = {
      underwatering: [
        `${cropTitleHi} की पत्तियों का दोपहर में मुरझाना व पीला पड़ना; फूल व फलियां गिरना।`,
        `फलियों की लंबाई कम रहना व दाना न भरना।`
      ],
      overwatering: [
        `पौधों का अचानक मुरझाना, पूरा पौधा पीला पड़ना व जड़ों का काला होकर सड़ना (Phytophthora/उकठा)।`,
        `जलजमाव से 24 घंटे में जड़ ग्रंथियां सड़ना व फसल नष्ट होना।`
      ]
    };
  } else if (isGroundnut) {
    warningFlagsEn = {
      underwatering: [
        `Groundnut pegs failing to penetrate dry hard soil; empty shells (pops).`,
        `Foliage wilting and premature leaf shedding.`
      ],
      overwatering: [
        `Yellowing of upper leaves, collar rot & stem rot development at soil surface.`,
        `Tikka leaf spot spreading rapidly in humid waterlogged fields.`
      ]
    };
    warningFlagsHi = {
      underwatering: [
        `मूंगफली की सुइयों का सख्त मिट्टी में न घुस पाना व दाना न भरना (खाली पॉप्स)।`,
        `पत्तियों का मुरझाना व समय से पहले गिरना।`
      ],
      overwatering: [
        `उपरी पत्तियों का पीला पड़ना व तना सड़न रोग।`,
        `टिक्का पत्ती धब्बा रोग का तेजी से फैलना।`
      ]
    };
  } else if (isSoybean) {
    warningFlagsEn = {
      underwatering: [
        `Soybean leaf flaccidity during sunny hours; premature flower & pod abortion.`,
        `Shrivelled, undersized seeds with low oil yield.`
      ],
      overwatering: [
        `Bright yellow leaf browning from bottom up; root death & collar rot.`,
        `Stagnant water drowning root nodule bacteria.`
      ]
    };
    warningFlagsHi = {
      underwatering: [
        `सोयाबीन की पत्तियों का मुरझाना, फूल व फलियों का गिरना।`,
        `दाने का छोटा व पिचका रहना।`
      ],
      overwatering: [
        `निचली पत्तियों का पीला पड़ना व जड़ों का सड़ना।`,
        `जलजमाव से नाइट्रोजन ग्रंथियों का नष्ट होना।`
      ]
    };
  } else if (isVegetable) {
    warningFlagsEn = {
      underwatering: [
        `Curling, drooping leaves; fruit cracking/splitting & blossom-end rot in ${cropTitleEn}.`,
        `Stunted fruit expansion and heavy flower drop.`
      ],
      overwatering: [
        `Seedling damping-off, yellowing foliage, soft stem/fruit rot.`,
        `Oxygen-starved roots causing wilting despite wet soil.`
      ]
    };
    warningFlagsHi = {
      underwatering: [
        `${cropTitleHi} की पत्तियों का मुड़ना, फलों का फटना व फूल गिरना।`,
        `फलों का आकार छोटा रहना।`
      ],
      overwatering: [
        `पौध गलन, पत्तियों का पीला पड़ना व फलों का सड़ना।`,
        `गीली मिट्टी में भी पौधों का ऑक्सीजन न मिलने से मुरझाना।`
      ]
    };
  }

  return {
    stagesEn,
    stagesHi,
    goldenRulesEn,
    goldenRulesHi,
    warningFlagsEn,
    warningFlagsHi
  };
}

export const STATE_SOIL_MAP = {
  punjab: {
    soilId: 'alluvial',
    soilNameEn: 'Alluvial Deep Loam Soil (Punjab Indo-Gangetic Basin)',
    soilNameHi: 'जलोढ़ गहरी दोमट मिट्टी (पंजाब सिंधु-गंगा बेसिन)',
    phRange: '6.5 – 7.8 (Optimal Neutral)',
    descEn: 'Highly fertile river basin soil, well-suited for high nitrogen & water responsive wheat/rice crops.',
    descHi: 'अत्यंत उपजाऊ नदी बेसिन मिट्टी, गेहूं व धान की फसल के लिए सर्वोत्तम।'
  },
  maharashtra: {
    soilId: 'black-soil',
    soilNameEn: 'Deccan Traps Black Cotton Soil (Regur Clay)',
    soilNameHi: 'दक्कन ट्रैप काली सूती मिट्टी (रेगुर क्ले)',
    phRange: '7.2 – 8.5 (Slightly Alkaline)',
    descEn: 'Montmorillonite clay with high water holding capacity and rich calcium/magnesium content.',
    descHi: 'उच्च जल धारण क्षमता और कैल्शियम/मैग्नीशियम से समृद्ध काली मिट्टी।'
  },
  andhra: {
    soilId: 'red-soil',
    soilNameEn: 'Red Sandy Loam & Laterite Soil (Andhra Region)',
    soilNameHi: 'लाल रेतीली दोमट और लेटराइट मिट्टी (आंध्र क्षेत्र)',
    phRange: '5.5 – 6.8 (Slightly Acidic)',
    descEn: 'Well-drained iron-rich soil requiring organic carbon enrichment & zinc top-dressing.',
    descHi: 'आयरन से भरपूर लाल मिट्टी जिसमें जैविक कार्बन व जिंक की आवश्यकता होती है।'
  },
  up: {
    soilId: 'alluvial',
    soilNameEn: 'Upper Gangetic Alluvial Soil (UP Plains)',
    soilNameHi: 'ऊपरी गंगा जलोढ़ मिट्टी (यूपी के मैदान)',
    phRange: '6.5 – 7.5 (Neutral)',
    descEn: 'Deep alluvial silt-loam with excellent nutrient retention and friable texture.',
    descHi: 'गहरी जलोढ़ दोमट मिट्टी जो उत्कृष्ट पोषक तत्व धारण करती है।'
  },
  rajasthan: {
    soilId: 'sandy',
    soilNameEn: 'Arid Desert Sandy Loam Soil (Rajasthan Basin)',
    soilNameHi: 'शुष्क मरुस्थलीय बलुई दोमट मिट्टी (राजस्थान बेसिन)',
    phRange: '7.5 – 8.4 (Alkaline)',
    descEn: 'Coarse porous soil with fast drainage requiring mulching and frequent light irrigation.',
    descHi: 'तेज रिसाव वाली रेतीली मिट्टी, जिसमें मल्चिंग व हल्की बार-बार सिंचाई जरूरी है।'
  },
  bengal: {
    soilId: 'alluvial',
    soilNameEn: 'Deltaic Alluvial Clay Loam (West Bengal)',
    soilNameHi: 'डेल्टाई जलोढ़ चिकनी मिट्टी (पश्चिम बंगाल)',
    phRange: '6.0 – 7.2 (Neutral)',
    descEn: 'Moisture-retentive heavy river silt ideal for paddy puddling and jute cultivation.',
    descHi: 'धान व जूट हेतु नमी रोकने में सक्षम भारी जलोढ़ मिट्टी।'
  },
  haryana: {
    soilId: 'alluvial',
    soilNameEn: 'Indo-Gangetic Fertile Alluvial Loam (Haryana)',
    soilNameHi: 'सिंधु-गंगा उपजाऊ जलोढ़ दोमट (हरियाणा)',
    phRange: '6.8 – 7.8 (Neutral)',
    descEn: 'High productivity loam soil responsive to balanced NPK & micro-nutrients.',
    descHi: 'संतुलित एनपीके उर्वरक के लिए अत्यधिक प्रतिक्रियाशील उपजाऊ दोमट मिट्टी।'
  },
  gujarat: {
    soilId: 'black-soil',
    soilNameEn: 'Saurashtra Black & Coastal Alluvial Soil (Gujarat)',
    soilNameHi: 'सौराष्ट्र काली व तटीय जलोढ़ मिट्टी (गुजरात)',
    phRange: '7.2 – 8.3 (Alkaline)',
    descEn: 'Clayey self-plowing black soil excellent for cotton, groundnut, and cash crops.',
    descHi: 'कपास, मूंगफली व नकदी फसलों हेतु उपयुक्त गहरी काली मिट्टी।'
  },
  karnataka: {
    soilId: 'red-soil',
    soilNameEn: 'Deccan Red & Lateritic Loam (Karnataka Plateau)',
    soilNameHi: 'दक्कन लाल व लेटराइट दोमट (कर्नाटक पठार)',
    phRange: '5.8 – 6.8 (Slightly Acidic)',
    descEn: 'Permeable red soil ideal for millets, pulses, sugarcane, and horticultural crops.',
    descHi: 'मोटे अनाज, दलहन व बागवानी के लिए आदर्श लाल मिट्टी।'
  },
  tn: {
    soilId: 'red-soil',
    soilNameEn: 'Tamil Nadu Red Coastal Alluvial & Black Soil',
    soilNameHi: 'तमिलनाडु लाल तटीय जलोढ़ व काली मिट्टी',
    phRange: '6.0 – 7.5 (Neutral)',
    descEn: 'Well-drained soil benefiting from organic compost and drip fertigation.',
    descHi: 'जैविक खाद व ड्रिप सिंचाई से अत्यधिक लाभान्वित होने वाली मिट्टी।'
  },
  telangana: {
    soilId: 'black-soil',
    soilNameEn: 'Telangana Deccan Black Clay & Red Sandy Soil',
    soilNameHi: 'तेलंगाना दक्कन काली क्ले व लाल रेतीली मिट्टी',
    phRange: '6.8 – 8.0 (Neutral to Alkaline)',
    descEn: 'Rich in lime and iron, suited for cotton, maize, and paddy rotation.',
    descHi: 'कपास, मक्का व धान की फसल चक्र के लिए उपयुक्त मिट्टी।'
  },
  mp: {
    soilId: 'black-soil',
    soilNameEn: 'Malwa Plateau Deep Black Soil (Madhya Pradesh)',
    soilNameHi: 'मालवा पठार गहरी काली मिट्टी (मध्य प्रदेश)',
    phRange: '7.2 – 8.4 (Alkaline)',
    descEn: 'Deep moisture-retentive black soil ideal for soybean, wheat, and chickpea.',
    descHi: 'सोयाबीन, गेहूं व चने की उत्कृष्ट पैदावार देने वाली गहरी काली मिट्टी।'
  },
  bihar: {
    soilId: 'alluvial',
    soilNameEn: 'North Gangetic Alluvial Silt Loam (Bihar)',
    soilNameHi: 'उत्तरी गंगा जलोढ़ सिल्ट दोमट (बिहार)',
    phRange: '6.5 – 7.6 (Neutral)',
    descEn: 'Rich in organic humus and potash, highly suitable for maize, paddy, and pulses.',
    descHi: 'मक्का, धान व दलहन के लिए उपयुक्त जैविक तत्वों से भरपूर मिट्टी।'
  }
};

export function getCropRoadmap(cropId, cropName, stateId, areaAcres = 1) {
  const stateData = STATE_SOIL_MAP[stateId] || STATE_SOIL_MAP.punjab;
  const acres = Math.max(0.5, parseFloat(areaAcres) || 1);

  // Match crop metadata from CROP_SEASONS_DATA or CROPS array
  const agro = findCropAgronomy(cropId, cropName);

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

  const rawName = agro ? agro.name : (cropMeta.name || cropName || 'Crop');
  const cropTitleEn = rawName.includes('(') ? rawName.split(' (')[0].trim() : rawName;
  const cropTitleHi = agro ? (agro.hindiName || rawName) : (rawName.includes('(') ? rawName.split('(')[1].replace(')', '').trim() : rawName);

  // Tailored Soil Strategy based on crop category and soil type
  let idealSoilEn = agro?.soilDetails?.bestType || 'Deep Fertile Alluvial Soil & Well-Drained Loam';
  let idealSoilHi = 'गहरी उपजाऊ जलोढ़ मिट्टी एवं उत्कृष्ट दोमट मिट्टी';
  let targetPhEn = agro?.soilDetails?.idealPh || '6.0 – 7.5 (Neutral)';
  let targetPhHi = agro?.soilDetails?.idealPh ? agro.soilDetails.idealPh : '6.0 – 7.5 (उदासीन)';
  let drainageReqEn = agro?.soilDetails?.drainage || 'Requires good internal root aeration and permeability.';
  let drainageReqHi = 'जड़ों के पास हवा का अच्छा संचार आवश्यक है।';

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

  const cropKey = agro ? agro.id : (cropMeta.id || cropId || cropName || 'crop');

  const { stagesEn, stagesHi, goldenRulesEn, goldenRulesHi, warningFlagsEn, warningFlagsHi } = 
    buildCropStages(cropKey, cropTitleEn, cropTitleHi, urea, dap, mop, agro, acres);

  const totalDays = agro?.duration ? (parseInt(agro.duration) || 120) : (Math.round((cropMeta.waterReqMm || 500) / 4) + 60);

  return {
    cropId: cropKey,
    cropNameEn: cropTitleEn,
    cropNameHi: cropTitleHi,
    totalDays,
    seasonEn: (agro?.season || cropMeta.season || 'rabi').toUpperCase(),
    seasonHi: (agro?.season || cropMeta.season) === 'kharif' ? 'खरीफ' : ((agro?.season || cropMeta.season) === 'zaid' ? 'जायद' : 'रबी'),
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

    goldenRulesEn,
    goldenRulesHi,
    warningFlagsEn,
    warningFlagsHi
  };
}
