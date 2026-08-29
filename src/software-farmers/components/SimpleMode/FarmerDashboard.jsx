import React, { useState } from 'react';
import { Volume2, CheckSquare } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';

// All UI strings in all 20 supported languages
const STR = {
    my_farm: { en: '🌱 My Farm', hi: '🌱 मेरा खेत', pa: '🌱 ਮੇਰਾ ਖੇਤ', mr: '🌱 माझे शेत', gu: '🌱 મારું ખેત', te: '🌱 నా పొలం', ta: '🌱 என் பண்ணை', kn: '🌱 ನನ್ನ ಜಮೀನು', bn: '🌱 আমার খামার', or: '🌱 ମୋ ଫାର୍ମ', ml: '🌱 എന്റെ ഫാം', ur: '🌱 میرا کھیت', as: '🌱 মোৰ খেত', mai: '🌱 हमर खेत', sa: '🌱 मम क्षेत्रम्', es: '🌱 Mi Granja', fr: '🌱 Ma Ferme', ar: '🌱 مزرعتي', sw: '🌱 Shamba Langu', pt: '🌱 Minha Fazenda' },
    weather: { en: 'Weather', hi: 'मौसम', pa: 'ਮੌਸਮ', mr: 'हवामान', gu: 'હવામાન', te: 'వాతావరణం', ta: 'வானிலை', kn: 'ಹವಾಮಾನ', bn: 'আবহাওয়া', or: 'ପାଣିପାଗ', ml: 'കാലാവസ്ഥ', ur: 'موسم', as: 'বতৰ', mai: 'मौसम', sa: 'मौसमः', es: 'Clima', fr: 'Météo', ar: 'الطقس', sw: 'Hewa', pt: 'Clima' },
    check_weather: { en: "Check today's weather", hi: 'आज का मौसम देखें', pa: 'ਅੱਜ ਦਾ ਮੌਸਮ ਦੇਖੋ', mr: 'आजचे हवामान पाहा', gu: 'આજનું હવામાન', te: 'నేటి వాతావరణం చూడండి', ta: 'இன்றைய வானிலை', kn: 'ಇಂದಿನ ಹವಾಮಾನ', bn: 'আজকের আবহাওয়া', or: 'ଆଜିର ପାଣିପାଗ', ml: 'ഇന്നത്തെ കാലാവസ്ഥ', ur: 'آج کا موسم دیکھیں', as: 'আজিৰ বতৰ', mai: 'आजुक मौसम', sa: 'अद्य मौसमः', es: 'Ver clima hoy', fr: 'Voir météo', ar: 'طقس اليوم', sw: 'Hewa ya leo', pt: 'Ver clima hoje' },
    my_crop: { en: 'My Crop', hi: 'मेरी फसल', pa: 'ਮੇਰੀ ਫ਼ਸਲ', mr: 'माझे पीक', gu: 'મારો પાક', te: 'నా పంట', ta: 'என் பயிர்', kn: 'ನನ್ನ ಬೆಳೆ', bn: 'আমার ফসল', or: 'ମୋ ଫସଲ', ml: 'എന്റെ വിള', ur: 'میری فصل', as: 'মোৰ শস্য', mai: 'हमर फसल', sa: 'मम शस्यम्', es: 'Mi Cultivo', fr: 'Ma Récolte', ar: 'محصولي', sw: 'Mazao Yangu', pt: 'Minha Colheita' },
    check_crop: { en: 'Check crop advice', hi: 'फसल की सलाह', pa: 'ਫਸਲ ਸਲਾਹ', mr: 'पीक सल्ला', gu: 'પાક સલાહ', te: 'పంట సలహా', ta: 'பயிர் ஆலோசனை', kn: 'ಬೆಳೆ ಸಲಹೆ', bn: 'ফসলের পরামর্শ', or: 'ଫସଲ ପରାମର୍ଶ', ml: 'വിള ഉപദേശം', ur: 'فصل مشورہ', as: 'শস্য পৰামৰ্শ', mai: 'फसल सलाह', sa: 'शस्यपरामर्शः', es: 'Ver consejos', fr: 'Voir conseils', ar: 'نصائح المحصول', sw: 'Ushauri wa mazao', pt: 'Dicas de colheita' },
    water: { en: 'Water', hi: 'पानी', pa: 'ਪਾਣੀ', mr: 'पाणी', gu: 'પાણી', te: 'నీళ్ళు', ta: 'தண்ணீர்', kn: 'ನೀರು', bn: 'পানি', or: 'ଜଳ', ml: 'വെള്ളം', ur: 'پانی', as: 'পানী', mai: 'पानि', sa: 'जलम्', es: 'Agua', fr: 'Eau', ar: 'ماء', sw: 'Maji', pt: 'Água' },
    check_water: { en: 'Check irrigation', hi: 'सिंचाई देखें', pa: 'ਸਿੰਚਾਈ ਦੇਖੋ', mr: 'सिंचन पाहा', gu: 'સિંચાઈ જુઓ', te: 'నీటిపారుదల', ta: 'நீர்ப்பாசனம்', kn: 'ನೀರಾವರಿ', bn: 'সেচ দেখুন', or: 'ଜଳସେଚନ', ml: 'ജലസേചനം', ur: 'آبپاشی دیکھیں', as: 'জলসিঞ্চন', mai: 'सिंचाई देखू', sa: 'सिञ्चनम्', es: 'Ver riego', fr: 'Voir irrigation', ar: 'الري', sw: 'Umwagiliaji', pt: 'Ver irrigação' },
    soil: { en: 'Soil', hi: 'मिट्टी', pa: 'ਮਿੱਟੀ', mr: 'माती', gu: 'જમીન', te: 'నేల', ta: 'மண்', kn: 'ಮಣ್ಣು', bn: 'মাটি', or: 'ମାଟି', ml: 'മണ്ണ്', ur: 'مٹی', as: 'মাটি', mai: 'माटि', sa: 'भूमिः', es: 'Suelo', fr: 'Sol', ar: 'التربة', sw: 'Udongo', pt: 'Solo' },
    check_soil: { en: 'Check soil condition', hi: 'मिट्टी की स्थिति', pa: 'ਮਿੱਟੀ ਦੀ ਹਾਲਤ', mr: 'मातीची स्थिती', gu: 'જમીનની સ્થિતિ', te: 'నేల స్థితి', ta: 'மண் நிலை', kn: 'ಮಣ್ಣಿನ ಸ್ಥಿತಿ', bn: 'মাটির অবস্থা', or: 'ମାଟି ଅବସ୍ଥା', ml: 'മണ്ണ് അവസ്ഥ', ur: 'مٹی کی حالت', as: 'মাটিৰ অৱস্থা', mai: 'माटिक स्थिति', sa: 'भूमिस्थितिः', es: 'Ver suelo', fr: 'État du sol', ar: 'حالة التربة', sw: 'Hali ya udongo', pt: 'Estado do solo' },
    sensors: { en: 'Sensors', hi: 'सेंसर', pa: 'ਸੈਂਸਰ', mr: 'सेन्सर्स', gu: 'સેન્સર', te: 'సెన్సర్లు', ta: 'சென்சர்கள்', kn: 'ಸೆನ್ಸರ್', bn: 'সেন্সর', or: 'ସେଂସର', ml: 'സെൻസർ', ur: 'سینسر', as: 'চেন্সৰ', mai: 'सेंसर', sa: 'संवेदकाः', es: 'Sensores', fr: 'Capteurs', ar: 'أجهزة الاستشعار', sw: 'Vihisi', pt: 'Sensores' },
    check_sensors: { en: 'Check farm sensors', hi: 'खेत के सेंसर', pa: 'ਫਾਰਮ ਸੈਂਸਰ', mr: 'शेत सेन्सर', gu: 'ખેત સેન્સર', te: 'పొలం సెన్సర్లు', ta: 'பண்ணை சென்சர்', kn: 'ಜಮೀನು ಸೆನ್ಸರ್', bn: 'খামার সেন্সর', or: 'ଫାର୍ମ ସେଂସର', ml: 'ഫാം സെൻസർ', ur: 'کھیت سینسر', as: 'খেত চেন্সৰ', mai: 'खेत सेंसर', sa: 'क्षेत्रसंवेदकाः', es: 'Sensores del campo', fr: 'Capteurs ferme', ar: 'مستشعرات المزرعة', sw: 'Vihisi vya shamba', pt: 'Sensores da fazenda' },
    irrigation: { en: 'Irrigation', hi: 'सिंचाई', pa: 'ਸਿੰਚਾਈ', mr: 'सिंचन', gu: 'સિંચાઈ', te: 'నీటిపారుదల', ta: 'நீர்ப்பாசனம்', kn: 'ನೀರಾವರಿ', bn: 'সেচ', or: 'ଜଳସେଚନ', ml: 'ജലസേചനം', ur: 'آبپاشی', as: 'জলসিঞ্চন', mai: 'सिंचाई', sa: 'सिञ्चनम्', es: 'Riego', fr: 'Irrigation', ar: 'الري', sw: 'Umwagiliaji', pt: 'Irrigação' },
    manage_water: { en: 'Manage watering', hi: 'पानी प्रबंधन', pa: 'ਪਾਣੀ ਪ੍ਰਬੰਧਨ', mr: 'पाणी व्यवस्थापन', gu: 'પાણી વ્યવસ્થાપન', te: 'నీటి నిర్వహణ', ta: 'நீர் மேலாண்மை', kn: 'ನೀರು ನಿರ್ವಹಣೆ', bn: 'জল ব্যবস্থাপনা', or: 'ଜଳ ପ୍ରବନ୍ଧ', ml: 'ജലം കൈകാര്യം', ur: 'پانی انتظام', as: 'পানী ব্যৱস্থাপনা', mai: 'पानि प्रबंधन', sa: 'जलप्रबन्धनम्', es: 'Gestionar riego', fr: 'Gérer arrosage', ar: 'إدارة الري', sw: 'Simamia kumwagilia', pt: 'Gerenciar rega' },
    todays_advice: { en: "🧑‍🌾 Today's Advice", hi: '🧑‍🌾 आज की सलाह', pa: '🧑‍🌾 ਅੱਜ ਦੀ ਸਲਾਹ', mr: '🧑‍🌾 आजचा सल्ला', gu: '🧑‍🌾 આજની સલાહ', te: '🧑‍🌾 ఈరోజు సలహా', ta: '🧑‍🌾 இன்றைய ஆலோசனை', kn: '🧑‍🌾 ಇಂದಿನ ಸಲಹೆ', bn: '🧑‍🌾 আজকের পরামর্শ', or: '🧑‍🌾 ଆଜିର ପରାମର୍ଶ', ml: '🧑‍🌾 ഇന്നത്തെ ഉപദേശം', ur: '🧑‍🌾 آج کی سلاہ', as: '🧑‍🌾 আজিৰ পৰামৰ্শ', mai: '🧑‍🌾 आजुक सलाह', sa: '🧑‍🌾 अद्य परामर्शः', es: '🧑‍🌾 Consejo de hoy', fr: '🧑‍🌾 Conseil du jour', ar: '🧑‍🌾 نصيحة اليوم', sw: '🧑‍🌾 Ushauri wa leo', pt: '🧑‍🌾 Conselho de hoje' },
    why: { en: 'Why?', hi: 'क्यों?', pa: 'ਕਿਉਂ?', mr: 'का?', gu: 'કેમ?', te: 'ఎందుకు?', ta: 'ஏன்?', kn: 'ಏಕೆ?', bn: 'কেন?', or: 'କାହିଁକି?', ml: 'എന്തുകൊണ്ട്?', ur: 'کیوں؟', as: 'কিয়?', mai: 'किएक?', sa: 'कुतः?', es: '¿Por qué?', fr: 'Pourquoi?', ar: 'لماذا؟', sw: 'Kwa nini?', pt: 'Por quê?' },
    close: { en: 'Close', hi: 'बंद करें', pa: 'ਬੰਦ ਕਰੋ', mr: 'बंद करा', gu: 'બંધ કરો', te: 'మూसु', ta: 'மூடு', kn: 'ಮುಚ್ಚು', bn: 'বন্ধ করুন', or: 'ବନ୍ଦ', ml: 'അടക്കുക', ur: 'بند کریں', as: 'বন্ধ কৰক', mai: 'बंद करू', sa: 'बन्दयतु', es: 'Cerrar', fr: 'Fermer', ar: 'إغلاق', sw: 'Funga', pt: 'Fechar' },
    todo_btn: { en: 'What should I do today?', hi: 'आज क्या करना है?', pa: 'ਅੱਜ ਕੀ ਕਰਨਾ ਹੈ?', mr: 'आज काय करायचे?', gu: 'આज શું કરવું?', te: 'ఈరోజు ఏం చేయాలి?', ta: 'இன்று என்ன செய்யணும்?', kn: 'ಇಂದು ಏನು ಮಾಡಬೇಕು?', bn: 'আজ কী করতে হবে?', or: "ଆଜି କ'ଣ କରିବି?", ml: 'ഇന്ന് എന്ത് ചെയ്യണം?', ur: 'آج کیا کرنا ہے؟', as: 'আজি কি কৰিব?', mai: 'आजुक की काज करू?', sa: 'अद्य किं कर्तव्यम्?', es: '¿Qué hago hoy?', fr: "Que faire aujourd'hui?", ar: 'ماذا أفعل اليوم؟', sw: 'Nifanye nini leo?', pt: 'O que fazer hoje?' },
    tasks_title: { en: "Today's Farm & Health Tasks", hi: 'आज के काम', pa: 'ਅੱਜ ਦੇ ਕੰਮ', mr: 'आजचे काम', gu: 'આજના કામ', te: 'ఈరోజు పనులు', ta: 'இன்றைய பணிகள்', kn: 'ಇಂದಿನ ಕೆಲಸ', bn: 'আজকের কাজ', or: 'ଆଜିର କାମ', ml: 'ഇന്നത്തെ ജോലി', ur: 'آج کے کام', as: 'আজিৰ কাম', mai: 'आजुक काज', sa: 'अद्य कार्याणि', es: 'Tareas de hoy', fr: 'Tâches du jour', ar: 'مهام اليوم', sw: 'Kazi za leo', pt: 'Tarefas de hoje' },
    task_soil: { en: 'Check soil moisture', hi: 'मिट्टी की नमी जांचें', pa: 'ਮਿੱਟੀ ਨਮੀ ਜਾਂਚੋ', mr: 'माती ओलावा तपासा', gu: 'જમીન ભેજ તપासो', te: 'నేల తేమ తనిఖీ', ta: 'மண் ஈரப்பதம் சோதி', kn: 'ಮಣ್ಣಿನ ತೇವ ಪರೀಕ್ಷೆ', bn: 'মাটির আর্দ্রতা পরীক্ষা', or: 'ମାଟି ଆର୍ଦ୍ରତା ଯାଞ୍ଚ', ml: 'മണ്ണ് ഈർപ്പം പരിശോധിക്കുക', ur: 'مٹی نمی چیک', as: 'মাটিৰ আৰ্দ্ৰতা পৰীক্ষা', mai: 'माटिक नमी जांचू', sa: 'भूमिनमिं परीक्षयतु', es: 'Verificar humedad suelo', fr: 'Vérifier humidité sol', ar: 'فحص رطوبة التربة', sw: 'Angalia unyevu udongo', pt: 'Verificar umidade solo' },
    task_heat: { en: '🏆 Heat Smart — Check heat safety before going outside', hi: '🏆 गर्मी सुरक्षा — बाहर जाने से पहले जांचें', pa: '🏆 ਗਰਮੀ ਜਾਂਚ — ਬਾਹਰ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ', mr: '🏆 उकाडा तपासा', gu: '🏆 ગરમી ચparsing — બહার ज़ाਤੋਂ ਪਹਿਲਾਂ', te: '🏆 వేడి భద్రత తనిఖీ', ta: '🏆 வெயில் பாதுகாப்பு சோதி', kn: '🏆 ಶಾಖ ಸುರಕ್ಷತೆ', bn: '🏆 তাপ নিরাপত্তা', or: '🏆 ତାପ ସୁରକ୍ଷା', ml: '🏆 ചൂട് സുരക്ഷ', ur: '🏆 گرمی جانچ', as: '🏆 তাপ পৰীক্ষা', mai: '🏆 गरमी जांच', sa: '🏆 ताप परीक्षणम्', es: '🏆 Control de calor', fr: '🏆 Sécurité chaleur', ar: '🏆 التحقق من سلامة الحرارة', sw: '🏆 Usalama wa joto', pt: '🏆 Segurança no calor' },
    task_water: { en: '💧 Hydration Hero — Log water intake and carry bottle', hi: '💧 पानी पियें — बोतल साथ रखें', pa: '💧 ਪਾਣੀ ਪੀਓ — ਬੋਤਲ ਰੱਖੋ', mr: '💧 पाणी प्या — बाटली घ्या', gu: '💧 ਪਾਣੀ — बोतल रखो', te: '💧 నీళ్ళు తాగు — బాటిల్ తీసుకో', ta: '💧 தண்ணீர் குடி — குடுவை எடு', kn: '💧 ನೀರು ಕುಡಿ — ಬಾಟಲ್ ತೆಗೆ', bn: '💧 জল পান করুন — বোতল নিন', or: '💧 ଜଳ ପୀ — ବୋତଲ', ml: '💧 വെള്ളം കുടിക്കുക — ബോട്ടിൽ', ur: '💧 پانی پئیں — بوتل لیں', as: '💧 পানী পিয়ক', mai: '💧 पानि पिऊ', sa: '💧 जलं पिबतु', es: '💧 Tomar agua — llevar botella', fr: '💧 Boire eau — emporter bouteille', ar: '💧 اشرب الماء', sw: '💧 Kunywa maji', pt: '💧 Beba água — leve garrafa' },
    task_air: { en: '🌫️ Air Aware — Check the Air Quality Index (AQI)', hi: '🌫️ वाय गुणवत्ता — AQI देखें', pa: '🌫️ ਹਵਾ ਗੁਣਵੱਤਾ', mr: '🌫️ हवा गुणवत्ता', gu: '🌫️ હવા ગुणवत्ता', te: '🌫️ వాయు నాణ్యత', ta: '🌫️ காற்று தரம்', kn: '🌫️ ವಾಯು ಗುಣಮಟ್ಟ', bn: '🌫️ বায়ু মান', or: '🌫️ ବାୟୁ ଗୁଣ', ml: '🌫️ വായു ഗുണനിലവാരം', ur: '🌫️ ہوا معیار', as: '🌫️ বায়ু মান', mai: '🌫️ वायु गुणवत्ता', sa: '🌫️ वायुगुणः', es: '🌫️ Calidad del Aire', fr: '🌫️ Qualité de l\'air', ar: '🌫️ جودة الهواء', sw: '🌫️ Ubora wa hewa', pt: '🌫️ Qualidade do Ar' },
    // Advice strings
    adv_need_water: { en: 'Your crop needs water today.', hi: 'आपकी फसल को आज पानी चाहिए।', pa: 'ਤੁਹਾਡੀ ਫਸਲ ਨੂੰ ਪਾਣੀ ਦੀ ਜ਼ਰੂਰਤ ਹੈ।', mr: 'तुमच्या पिकाला आज पाणी लागते.', gu: 'તમારા પાકને આज पानी जोઈएछे.', te: 'మీ పంటకు ఈరోజు నీళ్ళు కావాలి.', ta: 'உங்கள் பயிருக்கு இன்று தண்ணீர் தேவை.', kn: 'ನಿಮ್ಮ ಬೆಳೆಗೆ ಇಂದು ನೀರು ಬೇಕು.', bn: 'আপনার ফসলের আজ পানি দরকার।', or: 'ଆଜି ଆପଣଙ୍କ ଫସଲକୁ ଜଳ ଦରକାର।', ml: 'നിങ്ങളുടെ വിളക്ക് ഇന്ന് വെള്ളം വേണം.', ur: 'آپ کی فصل کو آج پانی چاہیے۔', as: 'আপোনাৰ শস্যত আজি পানীৰ প্ৰয়োজন।', mai: 'अहाँक फसलकेँ आज पानि चाही।', sa: 'अद्य भवतः शस्यं जलं अपेक्षते।', es: 'Su cultivo necesita agua hoy.', fr: 'Votre culture a besoin d\'eau aujourd\'hui.', ar: 'يحتاج محصولك إلى ماء اليوم.', sw: 'Mazao yako yanahitaji maji leo.', pt: 'Sua cultura precisa de água hoje.' },
    adv_wait_rain: {
        en: 'Rain expected. Wait before watering.', hi: 'बारिश होने वाली है। सिंचाई रुकें।', pa: 'ਮੀਂਹ ਆਵੇਗਾ। ਰੁਕੋ।', mr: 'पाऊस येणार. थांबा.', gu: 'વરसाद आਵਸे. रुko.', te: 'వర్షం వస్తుంది. వేచి ఉండండి.', ta: 'மழை வருகிறது. காத்திருங்கள்.', kn: 'ಮಳೆ ಬರುತ್ತದೆ. ಕಾಯಿರಿ.', bn: 'বৃষ্টি আসছে। অপেক্ষা করুন।', or: 'ବର୍ଷା ହେବ। ରୁହ।', ml: 'മഴ വരും. കാക്കുക.', ur: 'بارش آئے گی۔ رکیں۔', as: `বৰষুণ হ'ব। ৰওক।`, mai: 'बारिश होयत। रुकू।', sa: 'वृष्टिः भविष्यति। प्रतीक्षतु।', es: 'Lluvia esperada.Espere.', fr: 'Pluie attendue.Attendez.', ar: 'مطر متوقع.انتظر.', sw: 'Mvua inakuja.Subiri.', pt: 'Chuva esperada.Aguarde.'
    },
    adv_moisture_ok: { en: 'You do not need to water your crop today.', hi: 'आज सिंचाई की जरूरत नहीं।', pa: 'ਅੱਜ ਪਾਣੀ ਦੀ ਲੋੜ ਨਹੀਂ।', mr: 'आज पाणी देण्याची गरज नाही.', gu: 'આજ પાણીની જરૂર નથી.', te: 'ఈరోజు నీళ్ళు అవసరం లేదు.', ta: 'இன்று நீர் தேவையில்லை.', kn: 'ಇಂದು ನೀರು ಹಾಕ ಬೇಕಿಲ್ಲ.', bn: 'আজ পানি দেওয়ার দরকার নেই।', or: 'ଆଜି ଜଳ ଦରକାର ନାହିଁ।', ml: 'ഇന്ന് നനക്കേണ്ടതില്ല.', ur: 'آج پانی دینے کی ضرورت نہیں۔', as: 'আজি পানী দিয়াৰ প্ৰয়োজন নাই।', mai: 'आजु पानी देखे जरूरत नहि।', sa: 'अद्य सिञ्च कार्यं नास्ति।', es: 'No necesita regar hoy.', fr: "Pas besoin d'arroser aujourd'hui.", ar: 'لا تحتاج إلى سقي اليوم.', sw: 'Huhitaji kumwagilia leo.', pt: 'Não precisa regar hoje.' },
    r_moist_low: { en: 'Soil moisture is low', hi: 'मिट्टी की नमी कम है', pa: 'ਮਿੱਟੀ ਦੀ ਨਮੀ ਘੱਟ ਹੈ', mr: 'मातीचा ओलावा कमी', gu: 'જમીનનો ભેજ ઓછો છે', te: 'నేల తేమ తక్కువ', ta: 'மண் ஈரப்பதம் குறைவு', kn: 'ಮಣ್ಣಿನ ತೇವ ಕಡಿಮೆ', bn: 'মাটির আর্দ্রতা কম', or: 'ମାଟିର ଆର୍ଦ୍ରତା କମ୍', ml: 'മണ്ണ് ഈർപ്പം കുറവ്', ur: 'مٹی نمی کم', as: 'মাটিৰ আৰ্দ্ৰতা কম', mai: 'माटिक नमी कम', sa: 'भूमिनमी अल्पः', es: 'Humedad del suelo baja', fr: 'Humidité du sol faible', ar: 'رطوبة التربة منخفضة', sw: 'Unyevu udongo ni mdogo', pt: 'Umidade do solo baixa' },
    r_no_rain: { en: 'No rain is expected today', hi: 'आज बारिश की उम्मीद नहीं', pa: 'ਅੱਜ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਨਹੀਂ', mr: 'आज पाऊस अपेक्षित नाही', gu: 'આજે વરસાદની કોઈ અપેક્ષા નથી', te: 'ఈరోజు వర్షం ఆశించలేదు', ta: 'இன்று மழை இல்லை', kn: 'ಇಂದು ಮಳೆ ನಿರೀಕ್ಷಿಸಿಲ್ಲ', bn: 'আজ বৃষ্টির আশা নেই', or: 'ଆଜି ବର୍ଷା ହେବାର ନାହିଁ', ml: 'ഇന്ന് മഴ പ്രതീക്ഷിക്കുന്നില്ല', ur: 'آج بارش کی توقع نہیں', as: 'আজি বৰষুণৰ সম্ভাৱনা নাই', mai: 'आजु बरखाक संभावना नहि', sa: 'अद्य वृष्टिः न अपेक्षते', es: 'No se espera lluvia hoy', fr: "Pas de pluie prévue aujourd'hui", ar: 'لا يُتوقع مطر اليوم', sw: 'Hakuna mvua inayotarajiwa', pt: 'Sem chuva esperada hoje' },
    r_rain_soon: { en: 'Heavy rain is expected soon', hi: 'जल्द भारी बारिश होगी', pa: 'ਜਲਦੀ ਭਾਰੀ ਮੀਂਹ ਪਵੇਗਾ', mr: 'लवकरच जोरदार पाऊस', gu: 'ટૂંક સમયમાં ભારે વરસાદ', te: 'త్వరలో భారీ వర్షం', ta: 'விரைவில் கனமழை', kn: 'ಶೀಘ್ರದಲ್ಲಿ ಭಾರಿ ಮಳೆ', bn: 'শীঘ্রই ভারী বৃষ্টি', or: 'ଶୀଘ୍ର ଭାରି ବର୍ଷା', ml: 'ഉടൻ കനത്ത മഴ', ur: 'جلد بھاری بارش', as: 'সোনকালে ভাৰী বৰষুণ', mai: 'जल्दी भारी बारिश', sa: 'शीघ्रं भारी वृष्टिः', es: 'Lluvia intensa pronto', fr: 'Pluie abondante bientôt', ar: 'أمطار غزيرة قريبًا', sw: 'Mvua kubwa inakuja hivi karibuni', pt: 'Chuva forte em breve' },
    r_save_water: { en: 'Waiting avoids wasting water', hi: 'रुकने से पानी की बचत', pa: 'ਇੰਤਜ਼ਾਰ ਨਾਲ ਪਾਣੀ ਬਚੇਗਾ', mr: 'थांबल्याने पाणी वाचते', gu: 'રાહ જોવાથી પાણી બચે છે', te: 'వేచి ఉంటే నీళ్ళు ఆదా', ta: 'காத்திருந்தால் தண்ணீர் சேமிப்பு', kn: 'ಕಾಯಿದರೆ ನೀರು ಉಳಿಯುತ್ತದೆ', bn: 'অপেক্ষায় জল বাঁচে', or: 'ଅପେକ୍ଷା କଲେ ଜଳ ବଞ୍ଚିବ', ml: 'കാക്കുന്നത് വെള്ളം ലാഭിക്കും', ur: 'انتظار سے پانی بچے گا', as: 'অপেক্ষাত পানী সাহ কৰা', mai: 'रुकलासँ पानि बचत', sa: 'प्रतीक्षणेन जलक्षयो न', es: 'Esperar evita desperdiciar agua', fr: 'Attendre évite le gaspillage', ar: 'الانتظار يوفر الماء', sw: 'Kusubiri kunaosha maji', pt: 'Aguardar evita desperdício de água' },
    r_enough_moist: { en: 'Soil already has enough moisture', hi: 'मिट्टी में पर्याप्त नमी है', pa: 'ਮਿੱਟੀ ਵਿੱਚ ਕਾਫ਼ੀ ਨਮੀ', mr: 'मातीत पुरेसा ओलावा', gu: 'જમીનમાં પૂરતો ભેજ છે', te: 'నేల తేమ సరిపోయింది', ta: 'மண்ணில் போதுமான ஈரம்', kn: 'ಮಣ್ಣಿನಲ್ಲಿ ತೇವ ಸಾಕು', bn: 'মাটিতে পর্যাপ্ত আর্দ্রতা', or: 'ମାଟିରେ ପ୍ରଚୁର ଆର୍ଦ୍ରତା', ml: 'മണ്ണിൽ ആവശ്യത്തിന് ഈർപ്പം', ur: 'مٹی میں کافی نمی', as: 'মাটিত যথেষ্ট আৰ্দ্ৰতা', mai: 'माटिमें पर्याप्त नमी', sa: 'भूमौ पर्याप्तनमी अस्ति', es: 'El suelo tiene suficiente humedad', fr: "Le sol a assez d'humidité", ar: 'التربة لديها رطوبة كافية', sw: 'Udongo una unyevu wa kutosha', pt: 'Solo tem umidade suficiente' },
    r_no_extra: { en: 'Crop does not need additional water', hi: 'फसल को अतिरिक्त पानी नहीं चाहिए', pa: 'ਫਸਲ ਨੂੰ ਵਧੇਰੇ ਪਾਣੀ ਦੀ ਲੋੜ ਨਹੀਂ', mr: 'पिकाला जास्त पाणी नको', gu: 'પાકને વધુ પાણીની જરૂર નથી', te: 'పంటకు అదనపు నీళ్ళు వద్దు', ta: 'பயிருக்கு கூடுதல் நீர் வேண்டாம்', kn: 'ಬೆಳೆಗೆ ಹೆಚ್ಚಿನ ನೀರು ಬೇಡ', bn: 'ফসলের অতিরিক্ত জল নেই', or: 'ଫସଲକୁ ଅଧିକ ଜଳ ଦରକାର ନାହିଁ', ml: 'വിളയ്ക്ക് അധിക വെള്ളം വേണ്ട', ur: 'فصل کو اضافی پانی نہیں چاہیے', as: 'শস্যত অতিৰিক্ত পানীৰ প্ৰয়োজন নাই', mai: 'फसलकेँ अतिरिक्त पानि नहि', sa: 'शस्यस्य अतिरिक्तजलं न अपेक्षते', es: 'Cultivo no necesita agua extra', fr: "La culture ne nécessite pas plus d'eau", ar: 'لا يحتاج المحصول ماءً إضافيًا', sw: 'Mazao hayahitaji maji ya ziada', pt: 'Cultura não precisa de água extra' },
};

function s(key, lang) {
    const entry = STR[key];
    if (!entry) return key;
    return entry[lang] || entry['en'] || key;
}

export default function FarmerDashboard({ dbState, setActiveTab }) {
    const { farm, weather } = dbState;
    const { lang } = useLang();
    const [showTasks, setShowTasks] = useState(false);

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            if (!/[\u0900-\u097F]/.test(text)) {
                const jarvisVoice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('George') || v.name.includes('Daniel') || v.name.includes('UK English Male'));
                if (jarvisVoice) {
                    utterance.voice = jarvisVoice;
                    utterance.lang = 'en-GB';
                    utterance.pitch = 0.8;
                    utterance.rate = 1.0;
                }
            } else {
                const hiVoice = voices.find(v => v.lang.includes('IN') || v.lang.startsWith('hi'));
                if (hiVoice) utterance.voice = hiVoice;
                utterance.lang = 'hi-IN';
            }
            window.speechSynthesis.speak(utterance);
        }
    };

    const needsWater = farm.soilMoisture < 30;
    const expectsRain = weather.rainProbability > 50;

    let primaryAdvice, adviceReason;
    if (needsWater && !expectsRain) {
        primaryAdvice = { text: s('adv_need_water', lang), emoji: '💧', color: 'red', audio: s('adv_need_water', lang) };
        adviceReason = [s('r_moist_low', lang), s('r_no_rain', lang)];
    } else if (needsWater && expectsRain) {
        primaryAdvice = { text: s('adv_wait_rain', lang), emoji: '🌧️', color: 'yellow', audio: s('adv_wait_rain', lang) };
        adviceReason = [s('r_rain_soon', lang), s('r_save_water', lang)];
    } else {
        primaryAdvice = { text: s('adv_moisture_ok', lang), emoji: '🌱', color: 'green', audio: s('adv_moisture_ok', lang) };
        adviceReason = [s('r_enough_moist', lang), s('r_no_extra', lang)];
    }

    return (
        <div className="flex flex-col gap-4 animate-in fade-in pb-8">
            <h1 className="text-3xl font-bold text-slate-800">{s('my_farm', lang)}</h1>

            {/* SmartFarm Feature Button Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full max-w-5xl mx-auto py-4">
                <button onClick={() => window.alert('Weather details.')} className="btn-smart btn-glass-weather p-5 md:p-6 rounded-[24px] flex flex-col items-center gap-3 group text-center h-full">
                    <span className="text-[40px] md:text-[56px] icon-anim-weather">🌦️</span>
                    <div className="flex flex-col flex-1">
                        <span className="font-bold text-lg md:text-xl font-display">{s('weather', lang)}</span>
                        <span className="text-sm opacity-80 mt-1">{s('check_weather', lang)}</span>
                    </div>
                </button>

                <button onClick={() => setActiveTab && setActiveTab('crop')} className="btn-smart btn-glass-crop p-5 md:p-6 rounded-[24px] flex flex-col items-center gap-3 group text-center h-full">
                    <span className="text-[40px] md:text-[56px] icon-anim-crop">🌱</span>
                    <div className="flex flex-col flex-1">
                        <span className="font-bold text-lg md:text-xl font-display">{s('my_crop', lang)}</span>
                        <span className="text-sm opacity-80 mt-1">{s('check_crop', lang)}</span>
                    </div>
                </button>

                <button onClick={() => setActiveTab && setActiveTab('water')} className="btn-smart btn-glass-water p-5 md:p-6 rounded-[24px] flex flex-col items-center gap-3 group text-center h-full">
                    <span className="text-[40px] md:text-[56px] icon-anim-water">💧</span>
                    <div className="flex flex-col flex-1">
                        <span className="font-bold text-lg md:text-xl font-display">{s('water', lang)}</span>
                        <span className="text-sm opacity-80 mt-1">{s('check_water', lang)}</span>
                    </div>
                </button>

                <button onClick={() => window.alert('Soil Analysis.')} className="btn-smart btn-glass-soil p-5 md:p-6 rounded-[24px] flex flex-col items-center gap-3 group text-center h-full">
                    <span className="text-[40px] md:text-[56px] icon-anim-soil">🌍</span>
                    <div className="flex flex-col flex-1">
                        <span className="font-bold text-lg md:text-xl font-display">{s('soil', lang)}</span>
                        <span className="text-sm opacity-80 mt-1">{s('check_soil', lang)}</span>
                    </div>
                </button>

                <button className="btn-smart btn-glass-sensor p-5 md:p-6 rounded-[24px] flex flex-col items-center gap-3 group text-center h-full">
                    <span className="text-[40px] md:text-[56px] icon-anim-sensor">📡</span>
                    <div className="flex flex-col flex-1">
                        <span className="font-bold text-lg md:text-xl font-display">{s('sensors', lang)}</span>
                        <span className="text-sm opacity-80 mt-1">{s('check_sensors', lang)}</span>
                    </div>
                </button>

                <button className="btn-smart btn-glass-irrigation p-5 md:p-6 rounded-[24px] flex flex-col items-center gap-3 group text-center h-full">
                    <span className="text-[40px] md:text-[56px] icon-anim-irrigation">🚿</span>
                    <div className="flex flex-col flex-1">
                        <span className="font-bold text-lg md:text-xl font-display">{s('irrigation', lang)}</span>
                        <span className="text-sm opacity-80 mt-1">{s('manage_water', lang)}</span>
                    </div>
                </button>
            </div>

            {/* Today's Advice Section */}
            <div className={`mt-8 rounded-[32px] p-6 shadow-sm border-2 ${primaryAdvice.color === 'red' ? 'bg-red-50 border-red-200' : primaryAdvice.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2 font-display">
                        {s('todays_advice', lang)}
                    </h2>
                    <button onClick={() => speak(primaryAdvice.audio)} className="bg-white p-3 text-emerald-700 hover:bg-emerald-50 rounded-full shadow-sm hover:-translate-y-1 active:scale-[0.98] transition-all duration-300">
                        <Volume2 size={24} />
                    </button>
                </div>

                <div className="text-2xl font-bold text-slate-800 flex items-center gap-4 mb-4 leading-tight font-display">
                    <span className="text-[48px]">{primaryAdvice.emoji}</span>
                    <span>{primaryAdvice.text}</span>
                </div>

                <div className="bg-white/70 rounded-[20px] p-5 mt-4">
                    <h3 className="font-bold text-slate-800 mb-3 font-display text-lg">{s('why', lang)}</h3>
                    <ul className="space-y-3">
                        {adviceReason.map((reason, i) => (
                            <li key={i} className="flex gap-3 text-slate-700 text-lg items-center">
                                <span className="bg-green-200 text-green-800 rounded-full p-1 text-xs">✓</span> {reason}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Tasks Button */}
            {!showTasks ? (
                <button
                    onClick={() => setShowTasks(true)}
                    className="mt-6 w-full btn-smart btn-theme-crop text-white p-[22px] rounded-[24px] flex items-center justify-center gap-4 text-xl font-bold font-display"
                >
                    <CheckSquare size={32} />
                    {s('todo_btn', lang)}
                </button>
            ) : (
                <div className="mt-6 bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="bg-slate-50 border-b border-slate-100 p-5 font-bold tracking-wide text-slate-700 flex justify-between items-center font-display text-lg">
                        <span>{s('tasks_title', lang)}</span>
                        <button onClick={() => setShowTasks(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold bg-slate-200/50 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors">{s('close', lang)}</button>
                    </div>
                    <div className="p-6 flex flex-col gap-5">
                        {[
                            { label: s('task_soil', lang), color: 'emerald', xp: '+10 XP' },
                            { label: s('task_heat', lang), color: 'orange', xp: '+10 XP' },
                            { label: s('task_water', lang), color: 'blue', xp: '+15 XP' },
                            { label: s('task_air', lang), color: 'slate', xp: '+5 XP' },
                        ].map(({ label, color, xp }) => (
                            <label key={label} className="flex flex-col gap-2 text-xl text-slate-700 cursor-pointer p-4 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors">
                                <div className="flex items-center gap-4">
                                    <input type="checkbox" className={`w-8 h-8 rounded-lg border-2 border-slate-300 text-${color}-600 focus:ring-${color}-600`} />
                                    <span className="font-bold flex-1">{label}</span>
                                    <span className={`text-sm font-bold text-${color}-500 bg-${color}-100 px-2 py-1 rounded-full`}>{xp}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}


