// src/i18n/translations.js
// Comprehensive multilingual support for SmartFarm
// Covers 22 scheduled Indian languages + major international languages

export const LANGUAGES = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', dir: 'ltr' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳', dir: 'ltr' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳', dir: 'ltr' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', dir: 'ltr' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', dir: 'ltr' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', dir: 'ltr' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳', dir: 'ltr' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳', dir: 'ltr' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', dir: 'ltr' },
    { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇮🇳', dir: 'rtl' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳', dir: 'ltr' },
    { code: 'mai', name: 'Maithili', native: 'मैथिली', flag: '🇮🇳', dir: 'ltr' },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', flag: '🇮🇳', dir: 'ltr' },
    { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', dir: 'ltr' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', dir: 'ltr' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', dir: 'rtl' },
    { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪', dir: 'ltr' },
    { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇧🇷', dir: 'ltr' },
];

// Translation dictionary — each key maps to an object of lang-code -> string
export const T = {
    nav_farm: { en: 'Farm', hi: 'खेत', pa: 'ਫਾਰਮ', mr: 'शेत', gu: 'ખેતર', te: 'పొలం', ta: 'பண்ணை', kn: 'ಜಮೀನು', bn: 'খামার', or: 'ଫାର୍ମ', ml: 'ഫാം', ur: 'کھیت', as: 'খেত', mai: 'खेत', sa: 'क्षेत्रम्', es: 'Granja', fr: 'Ferme', ar: 'مزرعة', sw: 'Shamba', pt: 'Fazenda' },
    nav_farm_sub: { en: 'Dashboard', hi: 'डैशबोर्ड', pa: 'ਡੈਸ਼ਬੋਰਡ', mr: 'डॅशबोर्ड', gu: 'ડેશબોર્ડ', te: 'డాష్‌బోర్డ్', ta: 'டாஷ்போர்டு', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', bn: 'ড্যাশবোর্ড', or: 'ଡ୍ୟାସବୋର୍ଡ', ml: 'ഡാഷ്ബോർഡ്', ur: 'ڈیش بورڈ', as: 'ডেশবৰ্ড' },
    nav_health: { en: 'Health', hi: 'स्वास्थ्य', pa: 'ਸਿਹਤ', mr: 'आरोग्य', gu: 'આરોગ્ય', te: 'ఆరోగ్యం', ta: 'மருத்துவம்', kn: 'ಆರೋಗ್ಯ', bn: 'স্বাস্থ্য', or: 'ସ୍ୱାସ୍ଥ୍ୟ', ml: 'ആരോഗ്യം', ur: 'صحت', as: 'স্বাস্থ্য', mai: 'स्वास्थ्य', sa: 'स्वास्थ्यम्', es: 'Salud', fr: 'Santé', ar: 'الصحة', sw: 'Afya', pt: 'Saúde' },
    nav_health_sub: { en: 'Safety Center', hi: 'सुरक्षा केंद्र', pa: 'ਸੁਰੱਖਿਆ ਕੇਂਦਰ', mr: 'सुरक्षा केंद्र', gu: 'સુરક્ષા કેન્દ્ર', te: 'భద్రతా కేంద్రం', ta: 'பாதுகாப்பு மையம்', kn: 'ಸುರಕ್ಷತಾ ಕೇಂದ್ರ', bn: 'নিরাপত্তা কেন্দ্র', or: 'ସୁରକ୍ଷା କେନ୍ଦ୍ର', ml: 'സുരക്ഷാ കേന്ദ്രം', ur: 'حفاظتی مرکز' },
    nav_crophealth: { en: 'Crop Health', hi: 'फसल स्वास्थ्य', pa: 'ਫਸਲ ਸਿਹਤ', mr: 'पीक आरोग्य', gu: 'પાક આરોગ્ય', te: 'పంట ఆరోగ్యం', ta: 'பயிர் ஆரோக்கியம்', kn: 'ಬೆಳೆ ಆರೋಗ್ಯ', bn: 'ফসলের স্বাস্থ্য', or: 'ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ', ml: 'വിളയുടെ ആരോഗ്യം', ur: 'فصل کی صحت' },
    nav_crophealth_sub: { en: 'Disease Check', hi: 'रोग जांच', pa: 'ਬਿਮਾਰੀ ਜਾਂਚ', mr: 'रोग तपासणी', gu: 'રોગ તપાસ', te: 'వ్యాధి తనిఖీ', ta: 'நோய் சோதனை', kn: 'ರೋಗ ತಪಾಸಣೆ', bn: 'রোগ পরীক্ষা', or: 'ରୋଗ ଯାଞ୍ଚ', ml: 'രോഗ പരിശോധന', ur: 'بیماری کی جانچ' },
    nav_iot: { en: 'Water Control', hi: 'जल नियंत्रण', pa: 'ਪਾਣੀ ਨਿਯੰਤਰਣ', mr: 'पाणी नियंत्रण', gu: 'જળ નિયંત્રણ', te: 'నీటి నియంత్రణ', ta: 'நீர் கட்டுப்பாடு', kn: 'ನೀರಿನ ನಿಯಂತ್ರಣ', bn: 'জল নিয়ন্ত্রণ', or: 'ଜଳ ନିୟନ୍ତ୍ରଣ', ml: 'ജല നിയന്ത്രണം', ur: 'پانی کا کنٹرول' },
    nav_iot_sub: { en: 'Pump & Sprinkler', hi: 'पंप और स्प्रिंकलर', pa: 'ਪੰਪ ਅਤੇ ਸਪ੍ਰਿੰਕਲਰ', mr: 'पंप आणि स्प्रिंकलर', gu: 'પંપ અને સ્પ્રિંકલર', te: 'పంప్ & స్ప్రింక్లర్', ta: 'பம்ப் & ஸ்பிரிங்க்லர்', kn: 'ಪಂಪ್ ಮತ್ತು ಸ್ಪ್ರಿಂಕ್ಲರ್', bn: 'পাম্প ও স্প্রিংকলার', or: 'ପମ୍ପ୍ ଏବଂ ସ୍ପ୍ରିଙ୍କଲର', ml: 'പമ്പും സ്പ്രിംഗ്ളറും' },
    nav_kiosk: { en: 'Village Kiosk', hi: 'ग्राम कियोस्क', pa: 'ਪਿੰਡ ਦਾ ਕਿਓਸਕ', mr: 'ग्राम कियोस्क', gu: 'ગ્રામ કિયોસ્ક', te: 'గ్రామ కియోస్క్', ta: 'கிராம கியோஸ்க்', kn: 'ಗ್ರಾಮ ಕಿಯೋಸ್ಕ್', bn: 'গ্রাম কিয়স্ক', or: 'ଗ୍ରାମ କିଓସ୍କ', ml: 'ഗ്രാമ കിയോസ്ക്', ur: 'گاؤں کا کیوسک' },
    nav_kiosk_sub: { en: 'Easy Access', hi: 'आसान पहुंच', pa: 'ਆਸਾਨ ਪਹੁੰਚ', mr: 'सोपा प्रवेश', gu: 'સરળ પહોંચ', te: 'సులభమైన యాక్సెస్', ta: 'எளிதான அணுகல்', kn: 'ಸುಲಭ ಪ್ರವೇಶ', bn: 'সহজ অ্যাক্সেস', or: 'ସହଜ ଆକ୍ସେସ୍' },
    nav_pwa: { en: 'Mobile App', hi: 'मोबाइल ऐप', pa: 'ਮੋਬਾਈਲ ਐਪ', mr: 'मोबाईल ॲप', gu: 'મોબાઇલ એપ્લિકેશન', te: 'మొబైల్ యాప్', ta: 'மொபைல் ஆப்', kn: 'ಮೊಬೈಲ್ ಆಪ್', bn: 'মোবাইল অ্যাপ', or: 'ମୋବାଇଲ୍ ଆପ୍' },
    nav_pwa_sub: { en: 'Phone View', hi: 'फोन व्यू', pa: 'ਫੋਨ ਦ੍ਰਿਸ਼', mr: 'फोन दृश्य', gu: 'ફોન દૃશ્ય', te: 'ఫోన్ వీక్షణ', ta: 'போன் பார்வை', kn: 'ಫೋನ್ ನೋಟ', bn: 'ফোন ভিউ', or: 'ଫୋନ୍ ଭ୍ୟୁ' },
    nav_sms: { en: 'SMS', hi: 'SMS', pa: 'SMS', mr: 'SMS', gu: 'SMS', te: 'SMS', ta: 'SMS', kn: 'SMS', bn: 'SMS', or: 'SMS', ml: 'SMS', ur: 'SMS', as: 'SMS', mai: 'SMS', sa: 'SMS', es: 'SMS', fr: 'SMS', ar: 'رسالة', sw: 'SMS', pt: 'SMS' },
    nav_phone_sub: { en: 'Basic Phone', hi: 'बेसिक फोन', pa: 'ਮੁੱਢਲਾ ਫੋਨ', mr: 'बेसिक फोन', gu: 'બેઝિક ફોન', te: 'సాధారణ ఫోన్', ta: 'அடிப்படை போன்', kn: 'ಮೂಲ ಫೋನ್', bn: 'সাধারণ ফোন' },
    nav_demo: { en: 'SIH Demo', hi: 'SIH डेमो', pa: 'SIH ਡੈਮੋ', mr: 'SIH डेमो', gu: 'SIH ડેમો', te: 'SIH డెమో', ta: 'SIH டெமோ', kn: 'SIH ಡೆಮೊ', bn: 'SIH ডেমো' },
    nav_demo_sub: { en: 'Command Center', hi: 'कमांड सेंटर', pa: 'ਕਮਾਂਡ ਕੇਂਦਰ', mr: 'कमांड सेंटर', gu: 'કમાન્ડ સેન્ટર', te: 'కమాండ్ సెంటర్', ta: 'கட்டளை மையம்', kn: 'ಕಮಾಂಡ್ ಸೆಂಟರ್', bn: 'কমান্ড সেন্টার' },
    nav_registry: { en: 'Farmers', hi: 'किसान', pa: 'ਕਿਸਾਨ', mr: 'शेतकरी', gu: 'ખેડૂતો', te: 'రైతులు', ta: 'விவசாயிகள்', kn: 'ರೈತರು', bn: 'কৃষক', or: 'କୃଷକମାନେ' },
    nav_registry_sub: { en: 'Register / Login', hi: 'पंजीकरण / लॉग इन', pa: 'ਰਜਿਸਟਰ / ਲਾਗਇਨ', mr: 'नोंदणी / लॉगिन', gu: 'નોંધણી / લોગિન', te: 'నమోదు / లాగిన్', ta: 'பதிவு / உள்நுழைய', kn: 'ನೋಂದಣಿ / ಲಾಗಿನ್', bn: 'নিবন্ধন / লগইন' },
    nav_help: { en: 'Help', hi: 'सहायता', pa: 'ਮਦਦ', mr: 'मदत', gu: 'સહાય', te: 'సహాయం', ta: 'உதவி', kn: 'ಸಹಾಯ', bn: 'সাহায্য', or: 'ସାହାଯ୍ୟ', ml: 'സഹായം', ur: 'مدد', as: 'সহায়', mai: 'मदद', sa: 'सहायम्', es: 'Ayuda', fr: 'Aide', ar: 'مساعدة', sw: 'Msaada', pt: 'Ajuda' },
    nav_twin: { en: 'Digital Twin', hi: 'डिजिटल ट्विन', te: 'డిజిటల్ ట్విన్', mr: 'डिजिटल ट्विन', bn: 'ডিজিটাল টুইন' },
    nav_twin_sub: { en: '2D Field View', hi: '2D खेत दृश्य', te: '2D ఫీల్డ్ వీక్షణ', mr: '2D शेत दृश्य', bn: '2D ক্ষেত দৃশ্য' },
    nav_admin: { en: 'Admin Officer', hi: 'प्रशासन अधिकारी', te: 'అడ్మిన్ అధికారి', mr: 'प्रशासन अधिकारी', bn: 'প্রশাসন কর্মকর্তা' },
    nav_admin_sub: { en: 'Control Centre', hi: 'नियंत्रण केंद्र', te: 'కంట్రోల్ సెంటర్', mr: 'नियंत्रण केंद्र', bn: 'নিয়ন্ত্রণ কেন্দ্র' },
    nav_impact: { en: 'SIH Impact', hi: 'SIH प्रभाव', te: 'SIH ఇంపాక్ట్', mr: 'SIH प्रभाव', bn: 'SIH প্রভাব' },
    nav_impact_sub: { en: 'Water Savings', hi: 'जल बचत डेटा', te: 'నీటి పొదుపు డేటా', mr: 'पाणी बचत डेटा', bn: 'পানি সঞ্চয় ডেটা' },
    nav_simple: { en: 'Simple Mode', hi: 'सरल मोड', te: 'సాధారణ మోడ్', mr: 'सोपा मोड', bn: 'সহজ মোড' },
    nav_simple_sub: { en: 'Gamified Kiosk', hi: 'गेमिफाइड कियोस्क', te: 'గేమిఫైడ్ కియోస్క్', mr: 'गेमिफाइड किओस्क', bn: 'গেমিফাইড কিয়স্ক' },

    loc_ctx: { en: 'Connected Farm Location Context', hi: 'जुड़ा हुआ खेत स्थान संदर्भ', te: 'కనెక్ట్ చేయబడిన వ్యవసాయ స్థానం సందర్భం', mr: 'संलग्न शेत स्थान संदर्भ', pa: 'ਜੁੜੇ ਖੇਤ ਸਥਾਨ ਸੰਦਰਭ', ta: 'இணைக்கப்பட்ட பண்ணை இருப்பிட சூழல்', bn: 'সংযুক্ত খামার অবস্থানের প্রেক্ষাপট' },
    vis_ind: { en: '📈 Visual Telemetry indicators', hi: '📈 दृश्य टेलीमेट्री संकेतक', te: '📈 విజువల్ టెలిమెట్రీ సూచికలు', mr: '📈 दृश्य टेलीमेट्री निर्देशक', pa: '📈 ਵਿਜ਼ੂਅਲ ਟੈਲੀਮੈਟਰੀ ਸੂਚਕ', gu: '📈 વિઝ્યુઅલ ટેલિમેટ્રી સૂચકો' },
    str_selected_crop: { en: 'Selected Crop Field', hi: 'चयनित फसल क्षेत्र', te: 'ఎంచుకున్న పంట ఫీల్డ్', mr: 'निवडलेले पीक क्षेत्र', pa: 'ਚੁਣਿਆ ਫਸਲ ਖੇਤਰ', ta: 'தேர்ந்தெடுக்கப்பட்ட பயிர் புலம்', gu: 'પસંદ કરેલ પાક ક્ષેત્ર', bn: 'নির্বাচিত ফসলের মাঠ', kn: 'ಆಯ್ಕೆಮಾಡಿದ ಬೆಳೆ ಕ್ಷೇತ್ರ', or: 'ବଚ୍ଛିତ ଫସଲ କ୍ଷେତ୍ର' },
    str_farmer_context: { en: 'Farmer can configure multiple IDs', hi: 'किसान कई आईडी कॉन्फ़िगर कर सकता है', te: 'రైతు బహుళ ID లను కాన్ఫిగర్ చేయగలడు', mr: 'शेतकरी एकाधिक आयडी कॉन्फिगर करू शकतो' },
    str_irrigation_logic: { en: 'Irrigation Logic Loop', hi: 'सिंचाई तर्क लूप', te: 'నీటిపారుదల లాజిక్ లూప్', mr: 'सिंचन तर्क लूप', pa: 'ਸਿੰਚਾਈ ਤਰਕ ਲੂਪ', gu: 'સિંચાઈ તર્ક લૂપ', bn: 'সেচ যুক্তির লুপ' },
    str_ai_auto: { en: 'AI Auto Loop', hi: 'एआई ऑटो लूप', te: 'AI ఆటో లూప్', mr: 'एआय ऑटो लूप', gu: 'AI ઓટો લૂપ', pa: 'ਏਆਈ ਆਟੋ ਲੂਪ' },
    str_man_over: { en: 'Manual Override', hi: 'मैनुअल ओवरराइड', te: 'మాన్యువల్ ఓవర్‌రైడ్', mr: 'मॅन्युअल ओव्हरराइड', gu: 'મેન્યુઅલ ઓવરરાઇડ', pa: 'ਮੈਨੁਅਲ ਓਵਰਰਾਈਡ' },
    str_man_sol: { en: 'Manual Solenoid Switch', hi: 'मैनुअल सोलनॉइड स्विच', te: 'మాన్యువల్ సోలేనాయిడ్ స్విచ్', mr: 'मॅन्युअल सोलेनोइड स्विच', pa: 'ਮੈਨੁਅਲ ਸੋਲਨੋਇਡ ਸਵਿੱਚ', gu: 'મેન્યુઅલ સોલેનોઇડ સ્વિચ' },
    str_open_valve: { en: 'Open Valve', hi: 'वाल्व खोलें', te: 'వాల్వ్ తెరవండి', mr: 'झडप उघडा', gu: 'વાલ્વ ખોલો', pa: 'ਵਾਲਵ ਖੋਲ੍ਹੋ', ta: 'வால்வு திற', kn: 'ವಾಲ್ವ್ ತೆರೆಯಿರಿ', bn: 'ভালভ খুলুন', ml: 'വാൽവ് തുറക്കുക' },
    str_close_valve: { en: 'Close Valve', hi: 'वाल्व बंद करें', te: 'వాల్వ్ మూసివేయండి', mr: 'झडप बंद करा', gu: 'વાલ્વ બંધ કરો', pa: 'ਵਾਲਵ ਬੰਦ ਕਰੋ', ta: 'வால்வு மூடு', kn: 'ವಾಲ್ವ್ ಮುಚ್ಚಿ', bn: 'ভালভ বন্ধ করুন', ml: 'വാൽവ് അടക്കുക' },
    str_crop_profile: { en: 'Crop Profile Override', hi: 'फसल प्रोफ़ाइल ओवरराइड', te: 'పంట ప్రొఫైల్ ఓవర్‌రైడ్', mr: 'पीक प्रोफाइल ओव्हरराइड', pa: 'ਫਸਲ ਪ੍ਰੋਫਾਈਲ ਓਵਰਰਾਈਡ' },
    str_reservoir: { en: 'Reservoir', hi: 'भंडार', te: 'రిజర్వాయర్', mr: 'जलाशय', gu: 'જળાશય', pa: 'ਭੰਡਾਰ', ta: 'நீர்த்தேக்கம்', bn: 'জলাধার', ml: 'സംഭരണി' },
    str_battery: { en: 'Battery', hi: 'बैटरी', te: 'బ్యాటరీ', mr: 'बॅटरी', gu: 'બેટરી', pa: 'ਬੈਟਰੀ', ta: 'பேட்டரி', bn: 'ব্যাটারি', kn: 'ಬ್ಯಾಟರಿ' },
    str_signal: { en: 'Signal', hi: 'सिग्नल', te: 'సిగ్నల్', mr: 'सिग्नल', gu: 'સિગ્નલ', pa: 'ਸਿਗਨਲ', ta: 'சிக்னல்', bn: 'সংকেত', kn: 'ಸಿಗ್ನಲ್' },
    cur_crop: { en: 'Current Crop', hi: 'वर्तमान फसल', te: 'ప్రస్తుత పంట', mr: 'सध्याचे पीक', pa: 'ਮੌਜੂਦਾ ਫਸल', gu: 'વર્તમાન પાક', ta: 'தற்போதைய பயிர்', bn: 'বর্তমান ফসল' },
    soil_t: { en: 'Soil Temp', hi: 'मिट्टी का ताप', te: 'నేల ఉష్ణోగ్రత', mr: 'मातीचे तापमान', pa: 'ਮਿੱਟੀ ਦਾ ਤਾਪਮਾਨ', gu: 'માટીનું તાપમાન', ta: 'மண் வெப்பம்', bn: 'মাটির তাপমাত্রা' },
    forecast: { en: 'Forecast', hi: 'पूर्वानुमान', te: 'సూచన', mr: 'अंदाज', pa: 'ਭਵਿੱਖਬਾਣੀ', gu: 'આગાહી', ta: 'முன்னறிவிப்பு', bn: 'পূর্বাভাস' },
    water_av: { en: 'Water Availability', hi: 'जल उपलब्धता', te: 'నీటి లభ్యత', mr: 'पाण्याची उपलब्धता', pa: 'ਪਾਣੀ ਦੀ ਉਪਲਬਧਤਾ', gu: 'પાણીની ઉપલબ્ધતા', ta: 'நீர் இருப்பு', bn: 'জলের প্রাপ্যতা' },
    sol_ctrl: { en: '🕹️ Solenoid Valve Control', hi: '🕹️ सोलनॉइड वाल्व नियंत्रण', te: '🕹️ సోలేనోయిడ్ వాల్వ్ కంట్రోల్', mr: '🕹️ सोलेनोइड वाल्व नियंत्रण' },
    ai_rec: { en: '🧠 Agronomist Recommendation Engine', hi: '🧠 कृषिविज्ञानी अनुशंसा', te: '🧠 వ్యవసాయ శాస్త్రవేత్త సిఫార్సు' },
    ai_pre: { en: '🔮 AI Pre-Sowing Crop Advisor', hi: '🔮 एआई बुवाई-पूर्व फसल सलाहकार', te: '🔮 AI విత్తే ముందు పంట సలహాదారు' },
    chart_t: { en: '📈 Soil Moisture telemetry Trend (12h)', hi: '📈 मिट्टी की नमी का रुझान', te: '📈 నేల తేమ ట్రెండ్' },
    map_t: { en: '🗺️ Active Sprinkler valve Locations', hi: '🗺️ सक्रिय स्प्रिंकलर स्थान', te: '🗺️ సక్రియ స్ప్రింక్లర్ స్థానాలు' },

    temperature: { en: 'Temperature', hi: 'तापमान', pa: 'ਤਾਪਮਾਨ', mr: 'तापमान', gu: 'તાપમાન', te: 'ఉష్ణోగ్రత', ta: 'வெப்பநிலை', kn: 'ತಾಪಮಾನ', bn: 'তাপমাত্রা', or: 'ତାପମାତ୍ରା', ml: 'താപനില', ur: 'درجہ حرارت', as: 'তাপমাত্ৰা', mai: 'तापमान', sa: 'तापमानम्', es: 'Temperatura', fr: 'Température', ar: 'درجة الحرارة', sw: 'Joto', pt: 'Temperatura' },
    humidity: { en: 'Humidity', hi: 'आर्द्रता', pa: 'ਨਮੀ', mr: 'आर्द्रता', gu: 'ભેજ', te: 'తేమ', ta: 'ஈரப்பதம்', kn: 'ಆರ್ದ್ರತೆ', bn: 'আর্দ্রতা', or: 'ଆର୍ଦ୍ରତା', ml: 'ഈർപ്പം', ur: 'نمی', as: 'আৰ্দ্ৰতা', mai: 'नमी', sa: 'आर्द्रता', es: 'Humedad', fr: 'Humidité', ar: 'الرطوبة', sw: 'Unyevu', pt: 'Umidade' },
    feels_like: { en: 'Feels Like', hi: 'महसूस होता है', pa: 'ਮਹਿਸੂਸ ਹੁੰਦਾ', mr: 'असे वाटते', gu: 'લાગે છે', te: 'అనిపిస్తుంది', ta: 'உணர்கிறது', kn: 'ಅನ್ನಿಸುತ್ತದೆ', bn: 'অনুভব হচ্ছে', or: 'ଅନୁଭୂତ ହୁଏ', ml: 'തോന്നുന്നത്', ur: 'محسوس ہوتا', as: 'অনুভৱ', mai: 'लागैत अछि', sa: 'अनुभवति', es: 'Sensación', fr: 'Ressenti', ar: 'يبدو', sw: 'Inahisi', pt: 'Sensação' },
    rain_chance: { en: 'Rain Chance', hi: 'बारिश की संभावना', pa: 'ਮੀਂਹ ਸੰਭਾਵਨਾ', mr: 'पावसाची शक्यता', gu: 'વરસાદ સંભાવના', te: 'వర్షం అవకాశం', ta: 'மழை வாய்ப்பு', kn: 'ಮಳೆ ಸಾಧ್ಯತೆ', bn: 'বৃষ্টির সম্ভাবনা', or: 'ବର୍ଷା ସମ୍ଭାବନା', ml: 'മഴ സാധ്യത', ur: 'بارش کا امکان', as: 'বৰষুণ সম্ভাৱনা', mai: 'वर्षाक संभावना', sa: 'वृष्टिसंभावना', es: 'Lluvia', fr: 'Pluie', ar: 'احتمال المطر', sw: 'Mvua', pt: 'Chuva' },
    air_quality: { en: 'Air Quality', hi: 'वायु गुणवत्ता', pa: 'ਹਵਾ ਗੁਣਵੱਤਾ', mr: 'वायू गुणवत्ता', gu: 'હવા ગુણવત્તા', te: 'వాయు నాణ్యత', ta: 'காற்று தரம்', kn: 'ವಾಯು ಗುಣಮಟ್ಟ', bn: 'বায়ু মান', or: 'ବାୟୁ ଗୁଣ', ml: 'വായു ഗുണനിലവാരം', ur: 'ہوا کا معیار', as: 'বায়ু মান', mai: 'वायु गुणवत्ता', sa: 'वायुगुणः', es: 'Calidad Aire', fr: 'Qualité Air', ar: 'جودة الهواء', sw: 'Ubora wa Hewa', pt: 'Qualidade do Ar' },

    soil_moisture: { en: 'Soil Moisture', hi: 'मिट्टी की नमी', pa: 'ਮਿੱਟੀ ਨਮੀ', mr: 'माती ओलावा', gu: 'જમીન ભેજ', te: 'నేల తేమ', ta: 'மண் ஈரப்பதம்', kn: 'ಮಣ್ಣಿನ ತೇವ', bn: 'মাটির আর্দ্রতা', or: 'ମାଟି ଆର୍ଦ୍ରତା', ml: 'മണ്ണ് ഈർപ്പം', ur: 'مٹی کی نمی', as: 'মাটিৰ আৰ্দ্ৰতা', mai: 'माटिक नमी', sa: 'भूमिनमी', es: 'Humedad Suelo', fr: 'Humidité Sol', ar: 'رطوبة التربة', sw: 'Unyevu Udongo', pt: 'Umidade Solo' },
    root_zone_temp: { en: 'Root Zone Temp', hi: 'जड़ क्षेत्र तापमान', pa: 'ਜੜ੍ਹ ਖੇਤਰ ਤਾਪ', mr: 'मूळ क्षेत्र तापमान', gu: 'મૂળ ক્ষেत্ρ তাপ', te: 'మూల జోన్ ఉష్ణత', ta: 'வேர் வெப்பநிலை', kn: 'ಬೇರು ವಲಯ ತಾಪ', bn: 'মূল অঞ্চল তাপ', or: 'ମୂଳ ଜୋନ ଉଷ୍ଣ', ml: 'വേർ സോൺ ടെമ്പ്', ur: 'جڑ زون درجہ', as: 'শিপা অঞ্চল তাপ', mai: 'जड़ क्षेत्र ताप', sa: 'मूलक्षेत्रताप', es: 'Temp. Raíz', fr: 'Temp. Racine', ar: 'حرارة الجذور', sw: 'Joto la Mizizi', pt: 'Temp. Raiz' },
    pump_status: { en: 'Pump', hi: 'पंप', pa: 'ਪੰਪ', mr: 'पंप', gu: 'પંપ', te: 'పంప్', ta: 'பம்ப்', kn: 'ಪಂಪ್', bn: 'পাম্প', or: 'ପମ୍ପ', ml: 'പമ്പ്', ur: 'پمپ', as: 'পাম্প', mai: 'पम्प', sa: 'पम्पः', es: 'Bomba', fr: 'Pompe', ar: 'مضخة', sw: 'Pampu', pt: 'Bomba' },
    start_pump: { en: 'START PUMP', hi: 'पंप चालू करें', pa: 'ਪੰਪ ਚਾਲੂ ਕਰੋ', mr: 'पंप सुरू करा', gu: 'પંપ શરૂ કરો', te: 'పంప్ ప్రారంభించు', ta: 'பம்ப் தொடங்கு', kn: 'ಪಂಪ್ ಆರಂಭಿಸಿ', bn: 'পাম্প শুরু করুন', or: 'ପମ୍ପ ଆରମ୍ଭ', ml: 'പമ്പ് ആരംഭിക്കുക', ur: 'پمپ شروع کریں', as: 'পাম্প আৰম্ভ', mai: 'पम्प चालू', sa: 'पम्पं चालयतु', es: 'INICIAR BOMBA', fr: 'DÉMARRER POMPE', ar: 'تشغيل المضخة', sw: 'ANZA PAMPU', pt: 'INICIAR BOMBA' },
    stop_pump: { en: 'STOP PUMP', hi: 'पंप बंद करें', pa: 'ਪੰਪ ਬੰਦ ਕਰੋ', mr: 'पंप बंद करा', gu: 'પંપ બંધ કરો', te: 'పంప్ ఆపు', ta: 'பம்ப் நிறுத்து', kn: 'ಪಂಪ್ ನಿಲ್ಲಿಸಿ', bn: 'পাম্প বন্ধ করুন', or: 'ପମ୍ପ ବନ୍ଦ', ml: 'പമ്പ് നിർത്തുക', ur: 'پمپ بند کریں', as: 'পাম্প বন্ধ', mai: 'पम्प बंद', sa: 'पम्पं स्थापयतु', es: 'PARAR BOMBA', fr: 'ARRÊTER POMPE', ar: 'إيقاف المضخة', sw: 'SIMAMISHA PAMPU', pt: 'PARAR BOMBA' },
    refresh_data: { en: 'Refresh Data', hi: 'डेटा अपडेट करें', pa: 'ਡੇਟਾ ਅਪਡੇਟ', mr: 'डेटा अपडेट करा', gu: 'ડેટા અपडेট', te: 'డేటా రిఫ్రెష్', ta: 'தரவு புதுப்பி', kn: 'ಡೇಟಾ ರಿಫ್ರೆಶ್', bn: 'তথ্য আপডেট করুন', or: 'ଡାଟା ରିଫ୍ରେସ', ml: 'ഡേറ്റ പുതുക്കുക', ur: 'ڈیٹا اپڈیٹ', as: 'ডেটা আপডেট', mai: 'डेटा रिफ्रेश', sa: 'दत्तांशं नवीकरोतु', es: 'Actualizar', fr: 'Actualiser', ar: 'تحديث البيانات', sw: 'Sasisha Data', pt: 'Atualizar Dados' },

    heart_rate: { en: 'Heart Rate', hi: 'हृदय गति', pa: 'ਦਿਲ ਧੜਕਣ', mr: 'हृदय गती', gu: 'હૃदय ગतિ', te: 'హృదయ స్పందన', ta: 'இதய துடிப்பு', kn: 'ಹೃದಯ ಬಡಿತ', bn: 'হৃদস্পন্দন', or: 'ହୃଦୟ ଗତି', ml: 'ഹൃദയ താളം', ur: 'دل کی دھڑکن', as: 'হৃদস্পন্দন', mai: 'हृदय गति', sa: 'हृदयगतिः', es: 'Ritmo Cardíaco', fr: 'Rythme Cardiaque', ar: 'معدل القلب', sw: 'Mapigo ya Moyo', pt: 'Freq. Cardíaca' },
    body_temp: { en: 'Body Temp', hi: 'शरीर तापमान', pa: 'ਸਰੀਰ ਤਾਪ', mr: 'शरीर तापमान', gu: 'શरीर ताप', te: 'శరీర ఉష్ణత', ta: 'உடல் வெப்பம்', kn: 'ದೇಹ ತಾಪ', bn: 'শরীরের তাপ', or: 'ଶରୀର ତାପ', ml: 'ശരീര ഊഷ്മാവ്', ur: 'جسمانی درجہ', as: 'শৰীৰৰ তাপ', mai: 'शरीर ताप', sa: 'देहतापमान', es: 'Temp. Corporal', fr: 'Temp. Corporelle', ar: 'حرارة الجسم', sw: 'Joto la Mwili', pt: 'Temp. Corporal' },
    spo2: { en: 'SpO2', hi: 'ऑक्सीजन', pa: 'ਆਕਸੀਜਨ', mr: 'ऑक्सिजन', gu: 'ઓक्सिजन', te: 'ఆక్సిజన్', ta: 'ஆக்சிஜன்', kn: 'ಆಮ್ಲಜನಕ', bn: 'অক্সিজেন', or: 'ଅମ୍ଳଜାନ', ml: 'ഓക്സിജൻ', ur: 'آکسیجن', as: 'অক্সিজেন', mai: 'ऑक्सीजन', sa: 'प्राणवायुः', es: 'SpO2', fr: 'SpO2', ar: 'الأكسجين', sw: 'Oksijeni', pt: 'SpO2' },
    hydration: { en: 'Hydration', hi: 'जलयोजन', pa: 'ਹਾਈਡ੍ਰੇਸ਼ਨ', mr: 'जलयोजन', gu: 'હाइड्रेशन', te: 'జల నిర్వహణ', ta: 'நீரேற்றம்', kn: 'ಜಲಸಂಚಯ', bn: 'জলীভবন', or: 'ଜଳୟୋଜନ', ml: 'ജലാംശം', ur: 'پانی کی مقدار', as: 'হাইড্ৰেচন', mai: 'जलीयकरण', sa: 'जलीयता', es: 'Hidratación', fr: 'Hydratation', ar: 'الترطيب', sw: 'Maji Mwilini', pt: 'Hidratação' },
    calories: { en: 'Calories Burned', hi: 'कैलोरी जलाई', pa: 'ਕੈਲੋਰੀ ਸੜੀਆਂ', mr: 'कॅलरी जळाल्या', gu: 'કેलरी बळ्या', te: 'బర్న్ కేలరీలు', ta: 'கலோரி எரி', kn: 'ಕ್ಯಾಲ ಸುಟ್ಟ', bn: 'ক্যালরি পোড়া', or: 'କ୍ୟାଲ ଜଳା', ml: 'കലോറി കത്തി', ur: 'کیلوریز جلی', as: 'কেলৰি জ্বলা', mai: 'कैलोरी जलाव', sa: 'दीप्तकैलरी', es: 'Calorías', fr: 'Calories Brûlées', ar: 'السعرات المحروقة', sw: 'Kalori Zilizochomwa', pt: 'Calorias' },
    sun_exposure: { en: 'Sun Exposure', hi: 'धूप में रहना', pa: 'ਧੁੱਪ ਵਿੱਚ', mr: 'उन्हाचा अनुभव', gu: 'તડکો', te: 'సూర్యరశ్మి', ta: 'சூரிய வெளிப்பாடு', kn: 'ಸೂರ್ಯ ಒಡ್ಡಿಕೆ', bn: 'রোদে থাকা', or: 'ସୂର୍ୟ ଏକ୍ସପୋଜର', ml: 'സൂര്യ സമ്പർക്കം', ur: 'دھوپ میں رہنا', as: 'ৰদত থকা', mai: 'धूप में रहब', sa: 'आतपसेवनम्', es: 'Exposición Solar', fr: 'Exposition Soleil', ar: 'التعرض للشمس', sw: 'Mwanga wa Jua', pt: 'Exposição Solar' },

    risk_safe: { en: 'Safe', hi: 'सुरक्षित', pa: 'ਸੁਰੱਖਿਅਤ', mr: 'सुरक्षित', gu: 'સલামत', te: 'సురక్షితం', ta: 'பாதுகாப்பு', kn: 'ಸುರಕ್ಷಿತ', bn: 'নিরাপদ', or: 'ସୁରକ୍ଷିତ', ml: 'സുരക്ഷിതം', ur: 'محفوظ', as: 'সুৰক্ষিত', mai: 'सुरक्षित', sa: 'सुरक्षितम्', es: 'Seguro', fr: 'Sûr', ar: 'آمن', sw: 'Salama', pt: 'Seguro' },
    risk_caution: { en: 'Caution', hi: 'सावधान', pa: 'ਸਾਵਧਾਨ', mr: 'सावधान', gu: 'સাਵਧਾਨ', te: 'జాగ్రత్త', ta: 'எச்சரிக்கை', kn: 'ಎಚ್ಚರಿಕೆ', bn: 'সতর্ক', or: 'ସାବଧାନ', ml: 'ശ്രദ്ധ', ur: 'احتیاط', as: 'সাৱধান', mai: 'सावधान', sa: 'सावधानम्', es: 'Precaución', fr: 'Attention', ar: 'تنبيه', sw: 'Tahadhari', pt: 'Cautela' },
    risk_danger: { en: 'Danger', hi: 'खतरा', pa: 'ਖਤਰਾ', mr: 'धोका', gu: 'ਖਤਰੋ', te: 'ప్రమాదం', ta: 'ஆபத்து', kn: 'ಅಪಾಯ', bn: 'বিপদ', or: 'ବିପଦ', ml: 'അപകടം', ur: 'خطرہ', as: 'বিপদ', mai: 'खतरा', sa: 'संकटम्', es: 'Peligro', fr: 'Danger', ar: 'خطر', sw: 'Hatari', pt: 'Perigo' },
    seek_shade: { en: 'SEEK SHADE IMMEDIATELY', hi: 'तुरंत छांव में जाएं', pa: 'ਤੁਰੰਤ ਛਾਂ ਵਿੱਚ ਜਾਓ', mr: 'ताबडतोब सावलीत जा', gu: 'તरत छायडामां जाओ', te: 'వెంటనే నీడలో వెళ్ళు', ta: 'உடனடியாக நிழலில் செல்', kn: 'ತಕ್ಷಣ ನೆರಳಿಗೆ ಹೋಗಿ', bn: 'অবিলম্বে ছায়ায় যান', or: 'ଏବେ ଛାୟାକୁ ଯାଅ', ml: 'ഉടൻ തണലിൽ പോകുക', ur: 'فوری سائے میں جائیں', as: 'তৎক্ষণাৎ ছাঁয়ালৈ যাওক', mai: 'तुरन्त छाहीमें जाऊ', sa: 'तत्काल छायायां गच्छतु', es: 'BUSCA SOMBRA YA', fr: 'CHERCHER OMBRE', ar: 'اذهب للظل فورا', sw: 'TAFUTA KIVULI', pt: 'VA PARA A SOMBRA' },
    take_breaks: { en: 'TAKE BREAKS + DRINK WATER', hi: 'आराम करें + पानी पिएं', pa: 'ਆਰਾਮ ਕਰੋ + ਪਾਣੀ ਪੀਓ', mr: 'विश्रांती घ्या + पाणी प्या', gu: 'आराम + पानी पीओ', te: 'విరామ తీసుకో + నీళ్ళు తాగు', ta: 'ஓய்வு எடு + தண்ணீர் குடி', kn: 'ವಿಶ್ರಾಂತಿ ತೆಗೆ + ನೀರು ಕುಡಿ', bn: 'বিশ্রাম নিন + জল পান করুন', or: 'ବିଶ୍ରାମ + ଜଳ ପନ', ml: 'വിശ്രമിക്കുക + വെള്ളം കുടിക്കുക', ur: 'آرام + پانی پئیں', as: 'জিৰণি + পানী পিয়ক', mai: 'विश्राम + पानी पिऊ', sa: 'विश्रम + जलं पिबतु', es: 'DESCANSAR + BEBER AGUA', fr: 'PAUSES + EAU', ar: 'اخذ فترات راحة + شرب الماء', sw: 'PUMZIKA + KUNYWA MAJI', pt: 'PAUSAS + BEBA AGUA' },
    conditions_ok: { en: 'CONDITIONS SAFE TO WORK', hi: 'काम के लिए उचित स्थिति', pa: 'ਕੰਮ ਕਰਨਾ ਸੁਰੱਖਿਅਤ', mr: 'काम करणे सुरक्षित', gu: 'काम माटे स्थिति ठीक', te: 'పని చేయడానికి సురక్షితం', ta: 'வேலை பாதுகாப்பு', kn: 'ಕೆಲಸ ಸುರಕ್ಷಿತ', bn: 'কাজ করা নিরাপদ', or: 'କାର୍ଯ୍ୟ ସୁରକ୍ଷିତ', ml: 'ജോലി ചെയ്യാൻ സുരക്ഷിതം', ur: 'کام کے لیے مناسب', as: 'কাম কৰিব পাৰি', mai: 'काज करब सुरक्षित', sa: 'कार्यं सुरक्षितम्', es: 'CONDICIONES BUENAS', fr: 'CONDITIONS OK', ar: 'الظروف مناسبة للعمل', sw: 'HALI NZURI KWA KAZI', pt: 'CONDICOES OK' },

    status_online: { en: 'Online', hi: 'ऑनलाइन', pa: 'ਔਨਲਾਈਨ', mr: 'ऑनलाइन', gu: 'ऑनलाइन', te: 'ఆన్లైన్', ta: 'இணையத்தில்', kn: 'ಆನ್ಲೈನ್', bn: 'অনলাইন', or: 'ଅନ୍ଲାଇନ', ml: 'ഓൺലൈൻ', ur: 'آن لائن', as: 'অনলাইন', mai: 'ऑनलाइन', sa: 'सञ्जालसु', es: 'En línea', fr: 'En ligne', ar: 'متصل', sw: 'Mtandaoni', pt: 'Online' },
    status_offline: { en: 'Offline', hi: 'ऑफलाइन', pa: 'ਔਫਲਾਈਨ', mr: 'ऑफलाइन', gu: 'ऑफलाइन', te: 'ఆఫ్లైన్', ta: 'ஆஃப்லைன்', kn: 'ಆಫ್ಲೈನ್', bn: 'অফলাইন', or: 'ଅଫ୍ ଲାଇନ', ml: 'ഓഫ്ലൈൻ', ur: 'آف لائن', as: 'অফলাইন', mai: 'ऑफलाइन', sa: 'असञ्जाल', es: 'Sin conexión', fr: 'Hors ligne', ar: 'غير متصل', sw: 'Nje ya Mtandao', pt: 'Offline' },
    loading: { en: 'Loading...', hi: 'लोड हो रहा है...', pa: 'ਲੋਡ ਹੋ ਰਿਹਾ...', mr: 'लोड होत आहे...', gu: 'लोड थइ रह्युं...', te: 'లోడ్ అవుతోంది...', ta: 'ஏற்றுகிறது...', kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...', bn: 'লোড হচ্ছে...', or: 'ଲୋଡ ହୁଉଛି...', ml: 'ലോഡ് ചെയ്യുന്നു...', ur: 'لوڈ ہو رہا ہے...', as: 'লোড হৈছে...', mai: 'लोड भरहल...', sa: 'आचार्यति...', es: 'Cargando...', fr: 'Chargement...', ar: 'جار التحميل...', sw: 'Inapakia...', pt: 'Carregando...' },

    about_title: { en: 'About SmartFarm', hi: 'SmartFarm के बारे में', pa: 'SmartFarm ਬਾਰੇ', mr: 'SmartFarm बद्दल', gu: 'SmartFarm विशे', te: 'SmartFarm గురించి', ta: 'SmartFarm பற்றி', kn: 'SmartFarm ಬಗ್ಗೆ', bn: 'SmartFarm সম্পর্কে', or: 'SmartFarm ବିଷୟ', ml: 'SmartFarm കുറിച്ച്', ur: 'SmartFarm کے بارے میں', as: 'SmartFarm বিষয়ে', mai: 'SmartFarm बारेमे', sa: 'SmartFarm परिचयः', es: 'Sobre SmartFarm', fr: 'À propos', ar: 'عن SmartFarm', sw: 'Kuhusu SmartFarm', pt: 'Sobre SmartFarm' },
    sos_btn: { en: 'SEND SOS ALERT', hi: 'SOS भेजें', pa: 'SOS ਭੇਜੋ', mr: 'SOS पाठवा', gu: 'SOS मोकलो', te: 'SOS పంపు', ta: 'SOS அனுப்பு', kn: 'SOS ಕಳುಹಿಸಿ', bn: 'SOS পাঠান', or: 'SOS ପଠାନ୍ତୁ', ml: 'SOS അयക്കുക', ur: 'SOS بھیجیں', as: 'SOS পঠাওক', mai: 'SOS भेजू', sa: 'SOS प्रेषयतु', es: 'ENVIAR SOS', fr: 'ENVOYER SOS', ar: 'ارسال SOS', sw: 'TUMA SOS', pt: 'ENVIAR SOS' },
    select_lang: { en: 'Language', hi: 'भाषा', pa: 'ਭਾਸ਼ਾ', mr: 'भाषा', gu: 'ভाষا', te: 'భాష', ta: 'மொழி', kn: 'ಭಾಷೆ', bn: 'ভাষা', or: 'ଭାଷା', ml: 'ഭাഷ', ur: 'زبان', as: 'ভাষা', mai: 'भाषा', sa: 'भाषा', es: 'Idioma', fr: 'Langue', ar: 'اللغة', sw: 'Lugha', pt: 'Idioma' },
};

// Helper: get translation for a key in a given language code
export function t(key, lang) {
    const entry = T[key];
    if (!entry) return key;
    return entry[lang] || entry['en'] || key;
}

// Detect best language from browser
export function detectLanguage() {
    const stored = localStorage.getItem('sf_lang');
    if (stored && LANGUAGES.find(l => l.code === stored)) return stored;
    const nav = (navigator.language || 'en').split('-')[0].toLowerCase();
    const match = LANGUAGES.find(l => l.code === nav);
    return match ? match.code : 'en';
}
