import React, { useState } from 'react';
import { api } from '../../utils/apiSimulator';
import { Volume2, AlertOctagon } from 'lucide-react';
import { useLang } from '../../i18n/LanguageContext';

const STR = {
    title: { en: '💧 Water My Crop', hi: '💧 फसल को पानी दें', pa: '💧 ਫਸਲ ਨੂੰ ਪਾਣੀ ਦਿਓ', mr: '💧 माझ्या पिकाला सिंचन', gu: '💧  मेरे पाक को पानी', te: '💧 నా పంటకు నీళ్ళు', ta: '💧 என் பயிருக்கு தண்ணீர்', kn: '💧 ನನ್ನ ಬೆಳೆಗೆ ನೀರು', bn: '💧 আমার ফসলে জল', or: '💧 ମୋ ଫସଲକୁ ଜଳ', ml: '💧 എന്റെ വിളക്ക് വെള്ളം', ur: '💧 فصل کو پانی', as: '💧 শস্যত পানী', mai: '💧 फसलकेँ पानि', sa: '💧 शस्याय जलम्', es: '💧 Agua mi cultivo', fr: '💧 Arroser ma récolte', ar: '💧 أسقي محصولي', sw: '💧 Mwagilia mazao', pt: '💧 Regar minha colheita' },
    soil_lbl: { en: 'Soil', hi: 'मिट्टी', pa: 'ਮਿੱਟੀ', mr: 'माती', gu: 'ज़मीन', te: 'నేల', ta: 'மண்', kn: 'ಮಣ್ಣು', bn: 'মাটি', or: 'ମାଟି', ml: 'മണ്ണ്', ur: 'مٹی', as: 'মাটি', mai: 'माटि', sa: 'भूमिः', es: 'Suelo', fr: 'Sol', ar: 'التربة', sw: 'Udongo', pt: 'Solo' },
    enough_water: { en: '🟢 Enough Water', hi: '🟢 पर्याप्त नमी', pa: '🟢 ਕਾਫ਼ੀ ਪਾਣੀ', mr: '🟢 पुरेसे पाणी', gu: '🟢 पर्याप्त पानी', te: '🟢 సరిపడా నీళ్ళు', ta: '🟢 போதுமான தண்ணீர்', kn: '🟢 ಸಾಕಷ್ಟು ನೀರು', bn: '🟢 যথেষ্ট জল', or: '🟢 ', ml: '🟢 ', ur: '🟢 کافی پانی', as: '🟢 যথেষ্ট পানী', mai: '🟢 पर्याप्त पानि', sa: '🟢 पर्याप्तजलम्', es: '🟢 Agua suficiente', fr: '🟢 Assez d\'eau', ar: '🟢 ماء كافٍ', sw: '🟢 Maji ya kutosha', pt: '🟢 Água suficiente' },
    dry: { en: '🔴 Dry', hi: '🔴 सूखी मिट्टी', pa: '🔴 ਸੁੱਕੀ', mr: '🔴 कोरडे', gu: '🔴 સूखी', te: '🔴 పొడిగా', ta: '🔴 வறண்டது', kn: '🔴 ', bn: '🔴 শুষ্ক', or: '🔴 ', ml: '🔴 ', ur: '🔴 خشک', as: '🔴 শুকান', mai: '🔴 सुखल', sa: '🔴 शुष्कम्', es: '🔴 Seco', fr: '🔴 Sec', ar: '🔴 جاف', sw: '🔴 Kame', pt: '🔴 Seco' },
    weather_lbl: { en: 'Weather', hi: 'मौसम', pa: 'ਮੌਸਮ', mr: 'हवामान', gu: 'हवामान', te: 'వాతావరణం', ta: 'வானிலை', kn: 'ಹವಾಮಾನ', bn: 'আবহাওয়া', or: '', ml: '', ur: 'موسم', as: 'বতৰ', mai: 'मौसम', sa: 'मौसमः', es: 'Clima', fr: 'Météo', ar: 'الطقس', sw: 'Hewa', pt: 'Clima' },
    rain_possible: { en: '🌧️ Rain possible', hi: '🌧️ बारिश हो सकती है', pa: '🌧️ ਮੀਂਹ ਸੰਭਵ', mr: '🌧️ पाऊस शक्य', gu: '🌧️ वरसाद शक्य', te: '🌧️ వర్షం సాధ్యం', ta: '🌧️ மழை சாத்தியம்', kn: '🌧️ ', bn: '🌧️ বৃষ্টি সম্ভব', or: '🌧️ ', ml: '🌧️ ', ur: '🌧️ بارش ممکن', as: '🌧️ বৰষুণ সম্ভৱ', mai: '🌧️ बर्खा संभव', sa: '🌧️ वृष्टिः संभवेत्', es: '🌧️ Lluvia posible', fr: '🌧️ Pluie possible', ar: '🌧️ مطر محتمل', sw: '🌧️ Mvua inawezekana', pt: '🌧️ Chuva possível' },
    clear: { en: '☀️ Clear', hi: '☀️ साफ़', pa: '☀️ ਸਾਫ਼', mr: '☀️ निरभ्र', gu: '☀️ ', te: '☀️ ', ta: '☀️ ', kn: '☀️ ', bn: '☀️ ', or: '☀️ ', ml: '☀️ ', ur: '☀️ صاف', as: '☀️ পৰিষ্কাৰ', mai: '🌧️ ', sa: '☀️ ', es: '☀️ Claro', fr: '☀️ Clair', ar: '☀️ صافٍ', sw: '☀️ Safi', pt: '☀️ Claro' },
    recommendation: { en: 'Recommendation:', hi: 'सलाह:', pa: 'ਸਲਾਹ:', mr: 'शिफारस:', gu: 'सुझाव:', te: 'సిఫారసు:', ta: 'பரிந்துரை:', kn: 'ಶಿಫಾರಸು:', bn: 'সুপারিশ:', or: ':', ml: ':', ur: 'سفارش:', as: 'পৰামৰ্শ:', mai: 'सलाह:', sa: 'अनुशंसा:', es: 'Recomendación:', fr: 'Recommandation:', ar: 'توصية:', sw: 'Ushauri:', pt: 'Recomendação:' },
    needs_water: { en: 'Your crop needs water.', hi: 'फसल को पानी चाहिए।', pa: 'ਫਸਲ ਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।', mr: 'पिकाला पाणी लागते.', gu: 'पाक ने पानी जोईए छे.', te: 'పంటకు నీళ్ళు కావాలి.', ta: 'பயிருக்கு தண்ணீர் வேண்டும்.', kn: '', bn: 'ফসলে জল লাগবে।', or: '', ml: '', ur: 'فصل کو پانی چاہیے۔', as: 'শস্যত পানীৰ প্ৰয়োজন।', mai: 'फसलकेँ पानि चाही।', sa: 'शस्याय जलं आवश्यकम्।', es: 'Su cultivo necesita agua.', fr: 'Votre culture a besoin d\'eau.', ar: 'محصولك يحتاج إلى ماء.', sw: 'Mazao yako yanahitaji maji.', pt: 'Sua cultura precisa de água.' },
    no_water_now: { en: 'Do not water now.', hi: 'अभी पानी न दें।', pa: 'ਹੁਣ ਪਾਣੀ ਨਾ ਦਿਓ।', mr: 'आत्ता पाणी देऊ नका.', gu: 'अत्यारे पानी ना दो.', te: 'ఇప్పుడు నీళ్ళు వద్దు.', ta: 'இப்போது தண்ணீர் தேவையில்லை.', kn: '', bn: 'এখন জল দেবেন না।', or: '', ml: '', ur: 'ابھی پانی نہ دیں۔', as: 'এতিয়া পানী নিদিব।', mai: 'अखन पानि नहि दिऊ।', sa: 'अधुना जलं मा देहि।', es: 'No riegue ahora.', fr: 'Ne pas arroser maintenant.', ar: 'لا تسقِ الآن.', sw: 'Usimwagilie sasa.', pt: 'Não regue agora.' },
    why_reason: { en: 'Soil moisture is low and no rain is expected.', hi: 'मिट्टी की नमी कम है और बारिश की संभावना नहीं।', pa: 'ਮਿੱਟੀ ਦੀ ਨਮੀ ਘੱਟ ਹੈ ਅਤੇ ਬਾਰਿਸ਼ ਦੀ ਸੰਭਾਵਨਾ ਨਹੀਂ।', mr: 'माती ओलावा कमी आहे आणि पाऊस अपेक्षित नाही.', gu: '', te: '', ta: '', kn: '', bn: '', or: '', ml: '', ur: 'مٹی کی نمی کم اور بارش نہیں۔', as: '', mai: '', sa: '', es: 'Humedad baja y sin lluvia esperada.', fr: 'Humidité faible et pas de pluie prévue.', ar: 'رطوبة منخفضة ولا مطر متوقع.', sw: 'Unyevu mdogo na hakuna mvua.', pt: 'Umidade baixa e sem chuva esperada.' },
    why_ok: { en: 'Rain may arrive soon, or soil has enough water.', hi: 'जल्द बारिश हो सकती है, या मिट्टी में पर्याप्त नमी है।', pa: '', mr: '', gu: '', te: '', ta: '', kn: '', bn: '', or: '', ml: '', ur: 'بارش ممکن ہے یا مٹی میں کافی نمی ہے۔', as: '', mai: '', sa: '', es: 'Lluvia pronta o suelo húmedo.', fr: 'Pluie proche ou sol humide.', ar: 'مطر قريب أو تربة رطبة.', sw: 'Mvua inakuja au udongo una maji ya kutosha.', pt: 'Chuva próxima ou solo com umidade.' },
    why: { en: 'Why?', hi: 'क्यों?', pa: 'ਕਿਉਂ?', mr: 'का?', gu: 'કેम?', te: 'ఎందుకు?', ta: 'ஏன்?', kn: 'ಏಕೆ?', bn: 'কেन?', or: '?', ml: '?', ur: 'کیوں؟', as: 'কিয়?', mai: 'किएक?', sa: 'कुतः?', es: '¿Por qué?', fr: 'Pourquoi?', ar: 'لماذا؟', sw: 'Kwa nini?', pt: 'Por quê?' },
    rec_time: { en: 'Recommended watering time: 12 minutes', hi: 'सुझाया सिंचाई समय: 12 मिनट', pa: 'ਸਿੰਚਾਈ ਸਮਾਂ: 12 ਮਿੰਟ', mr: 'सिंचन वेळ: 12 मिनिटे', gu: 'सिंचाई समय: 12 मिनिट', te: 'నీటిపారుదల సమయం: 12 నిమిషాలు', ta: 'நீர்ப்பாசன நேரம்: 12 நிமிடம்', kn: '12 ', bn: 'সেচ সময়: ১২ মিনিট', or: '12 ', ml: '12 ', ur: 'سیراب وقت: 12 منٹ', as: 'জলসিঞ্চন: 12 মিনিট', mai: 'सिंचाई समय: 12 मिनट', sa: 'सिञ्चनकालः: 12 निमेषाः', es: 'Tiempo riego: 12 min', fr: 'Temps irrigation: 12 min', ar: 'وقت الري: 12 دقيقة', sw: 'Muda wa umwagiliaji: dakika 12', pt: 'Tempo de rega: 12 min' },
    start_irrig: { en: 'Start Irrigation', hi: 'सिंचाई शुरू करें', pa: 'ਸਿੰਚਾਈ ਸ਼ੁਰੂ ਕਰੋ', mr: 'सिंचन सुरू करा', gu: 'सिंचाई शरू करो', te: 'నీటిపారుదల ప్రారంభించు', ta: 'நீர்ப்பாசனம் தொடங்கு', kn: '', bn: 'সেচ শুরু করুন', or: '', ml: '', ur: 'آبپاشی شروع کریں', as: '', mai: 'सिंचाई शुरू', sa: 'सिञ्चनं आरभतु', es: 'Iniciar riego', fr: 'Démarrer irrigation', ar: 'بدء الري', sw: 'Anza umwagiliaji', pt: 'Iniciar irrigação' },
    begin_water: { en: 'Begin watering your crop', hi: 'फसल को पानी देना शुरू करें', pa: 'ਫਸਲ ਸਿੰਚਾਈ ਸ਼ੁਰੂ ਕਰੋ', mr: 'पिकाची सिंचन सुरू करा', gu: '', te: '', ta: '', kn: '', bn: '', or: '', ml: '', ur: 'فصل کو سیراب کرنا شروع کریں', as: '', mai: '', sa: '', es: 'Comenzar a regar', fr: 'Commencer l\'arrosage', ar: 'ابدأ ري المحصول', sw: 'Anza kumwagilia', pt: 'Começar a regar' },
    stop_irrig: { en: 'Stop Irrigation', hi: 'सिंचाई बंद करें', pa: 'ਸਿੰਚਾਈ ਬੰਦ ਕਰੋ', mr: 'सिंचन बंद करा', gu: 'सिंचाई बंद करो', te: 'నీటిపారుదల ఆపు', ta: 'நீர்ப்பாசனம் நிறுத்து', kn: '', bn: 'সেচ বন্ধ করুন', or: '', ml: '', ur: 'آبپاشی بند کریں', as: '', mai: 'सिंचाई बंद', sa: 'सिञ्चनं स्थापयतु', es: 'Detener riego', fr: 'Arrêter irrigation', ar: 'إيقاف الري', sw: 'Simamisha umwagiliaji', pt: 'Parar irrigação' },
    pause_current: { en: 'Pause the current watering plan', hi: 'वर्तमान सिंचाई रोकें', pa: '', mr: '', gu: '', te: '', ta: '', kn: '', bn: '', or: '', ml: '', ur: '', as: '', mai: '', sa: '', es: 'Pausar plan de riego', fr: 'Pause plan arrosage', ar: 'إيقاف خطة الري مؤقتًا', sw: 'Simamisha mpango wa umwagiliaji', pt: 'Pausar plano de rega' },
    emg_stop: { en: 'EMERGENCY STOP', hi: 'आपातकालीन रोकें', pa: 'ਐਮਰਜੈਂਸੀ ਰੋਕੋ', mr: 'आणीबाणी थांबा', gu: 'ઈমرজੈਂਸੀ ਰੋਕੋ', te: 'అత్యవసర ఆపు', ta: 'அவசர நிறுத்தம்', kn: '', bn: 'জরুরি বন্ধ', or: '', ml: '', ur: 'ہنگامی روکیں', as: '', mai: 'आपाती रोकू', sa: 'तत्कालस्थापनम्', es: 'PARADA DE EMERGENCIA', fr: 'ARRÊT D\'URGENCE', ar: 'إيقاف اضطراري', sw: 'SIMAMISHA DHARURA', pt: 'PARADA DE EMERGÊNCIA' },
    confirm_start: { en: 'Start Irrigation?', hi: 'सिंचाई शुरू करें?', pa: 'ਸਿੰਚਾਈ ਸ਼ੁਰੂ ਕਰੀਏ?', mr: 'सिंचन सुरू करायचे?', gu: 'सिंचाई शरू करशो?', te: 'నీటిపారుదల ప్రారంభించాలా?', ta: 'நீர்ப்பாசனம் தொடங்கவா?', kn: '?', bn: 'সেচ শুরু করবেন?', or: '?', ml: '?', ur: 'آبپاشی شروع کریں؟', as: '?', mai: 'सिंचाई शुरू करू?', sa: 'सिञ्चनं आरभामः?', es: '¿Iniciar riego?', fr: 'Démarrer irrigation?', ar: 'بدء الري؟', sw: 'Anza umwagiliaji?', pt: 'Iniciar irrigação?' },
    confirm_stop: { en: 'Stop Irrigation?', hi: 'सिंचाई बंद करें?', pa: 'ਸਿੰਚਾਈ ਬੰਦ ਕਰਨੀ?', mr: 'सिंचन बंद करायचे?', gu: 'सिंचाई बंद करशो?', te: 'నీటిపారుదల ఆపాలా?', ta: 'நீர்ப்பாசனம் நிறுத்தவா?', kn: '?', bn: 'সেচ বন্ধ করবেন?', or: '?', ml: '?', ur: 'آبپاشی بند کریں؟', as: '?', mai: 'सिंचाई बंद करू?', sa: 'सिञ्चनं स्थापयामः?', es: '¿Detener riego?', fr: 'Arrêter irrigation?', ar: 'إيقاف الري؟', sw: 'Simamisha umwagiliaji?', pt: 'Parar irrigação?' },
    field_lbl: { en: 'Field', hi: 'खेत', pa: 'ਖੇਤ', mr: 'शेत', gu: 'ખেत', te: 'పొలం', ta: 'வயல்', kn: '', bn: 'মাঠ', or: '', ml: '', ur: 'کھیت', as: 'পথাৰ', mai: 'खेत', sa: 'क्षेत्रम्', es: 'Campo', fr: 'Champ', ar: 'الحقل', sw: 'Shamba', pt: 'Campo' },
    estimated: { en: 'Estimated', hi: 'अनुमानित', pa: 'ਅਨੁਮਾਨਿਤ', mr: 'अदमास', gu: 'અnderstood', te: 'అంచనా', ta: 'மதிப்பீடு', kn: '', bn: 'আনুমানিক', or: '', ml: '', ur: 'تخمینی', as: 'আনুমানিক', mai: 'अनुमानित', sa: 'अनुमानितः', es: 'Estimado', fr: 'Estimé', ar: 'مقدر', sw: 'Inakadiriwa', pt: 'Estimado' },
    cancel: { en: 'Cancel', hi: 'रद्द करें', pa: 'ਰੱਦ ਕਰੋ', mr: 'रद्द करा', gu: 'ರd्द करो', te: 'రద్దు చేయి', ta: 'ரத்து செய்', kn: '', bn: 'বাতিল', or: '', ml: '', ur: 'منسوخ کریں', as: 'বাতিল', mai: 'रद्द करू', sa: 'रद्दयतु', es: 'Cancelar', fr: 'Annuler', ar: 'إلغاء', sw: 'Ghairi', pt: 'Cancelar' },
    cfm_start: { en: 'Confirm Start', hi: 'शुरू करें', pa: 'ਸ਼ੁਰੂ ਕਰੋ', mr: 'सुरू करा', gu: 'ਸ਼ੁਰੂ ਕਰੋ', te: 'ప్రారంభించు', ta: 'தொடங்கு', kn: '', bn: 'শুরু করুন', or: '', ml: '', ur: 'شروع کریں', as: 'আৰম্ভ', mai: 'शुरू करू', sa: 'आरभतु', es: 'Confirmar inicio', fr: 'Confirmer démarrage', ar: 'تأكيد البدء', sw: 'Thibitisha kuanza', pt: 'Confirmar início' },
    cfm_stop: { en: 'Confirm Stop', hi: 'बंद करें', pa: 'ਬੰਦ ਕਰੋ', mr: 'बंद करा', gu: 'ਬੰਦ ਕਰੋ', te: 'ఆపు', ta: 'நிறுத்து', kn: '', bn: 'বন্ধ করুন', or: '', ml: '', ur: 'بند کریں', as: 'বন্ধ কৰক', mai: 'बंद करू', sa: 'स्थापयतु', es: 'Confirmar parada', fr: 'Confirmer arrêt', ar: 'تأكيد الإيقاف', sw: 'Thibitisha kusimama', pt: 'Confirmar parada' },
};

function s(key, lang) {
    const e = STR[key]; if (!e) return key;
    return e[lang] || e['en'] || key;
}

export default function FarmerIrrigation({ dbState }) {
    const { farm, weather } = dbState;
    const { lang } = useLang();
    const [confirmAction, setConfirmAction] = useState(null);

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

    const isRunning = farm.valveState === 'ON';
    const needsWater = farm.soilMoisture < 30;
    const expectsRain = weather.rainProbability > 50;

    const handleAction = async (action) => {
        if (action === 'START') await api.togglePump('ON', 'FARMER_APP');
        if (action === 'STOP') await api.togglePump('OFF', 'FARMER_APP');
        setConfirmAction(null);
    };

    return (
        <div className="flex flex-col gap-4 animate-in fade-in pb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">{s('title', lang)}</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <span className="text-sm font-bold text-slate-500 uppercase">{s('soil_lbl', lang)}</span>
                        <div className={`mt-1 font-bold text-lg flex items-center gap-2 ${farm.soilMoisture > 30 ? 'text-green-600' : 'text-red-500'}`}>
                            {farm.soilMoisture > 30 ? s('enough_water', lang) : s('dry', lang)}
                        </div>
                    </div>
                    <div>
                        <span className="text-sm font-bold text-slate-500 uppercase">{s('weather_lbl', lang)}</span>
                        <div className="mt-1 font-bold text-lg flex items-center gap-2 text-slate-700">
                            {expectsRain ? s('rain_possible', lang) : s('clear', lang)}
                        </div>
                    </div>
                </div>

                <div className={`p-4 rounded-xl mb-6 ${needsWater && !expectsRain ? 'bg-red-50' : 'bg-green-50'}`}>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{s('recommendation', lang)}</h3>
                    <p className="text-2xl font-bold text-slate-900 mb-2">
                        {needsWater && !expectsRain ? s('needs_water', lang) : s('no_water_now', lang)}
                    </p>
                    <p className="font-bold text-slate-700">{s('why', lang)}</p>
                    <p className="text-slate-600">
                        {needsWater && !expectsRain ? s('why_reason', lang) : s('why_ok', lang)}
                    </p>
                </div>

                {needsWater && !expectsRain && (
                    <p className="font-bold text-blue-800 text-lg bg-blue-50 p-4 rounded-xl text-center mb-6">
                        {s('rec_time', lang)}
                    </p>
                )}

                {!confirmAction ? (
                    <div className="flex flex-col gap-8 md:gap-10 mt-4 h-full">
                        {!isRunning ? (
                            <button onClick={() => setConfirmAction('START')} className="w-full btn-smart btn-theme-irrigation text-white p-[22px] rounded-[24px] flex items-center justify-center gap-4 group">
                                <span className="text-3xl icon-anim-irrigation">🚿</span>
                                <div className="flex flex-col text-left">
                                    <span className="font-bold text-xl font-display tracking-wide">{s('start_irrig', lang)}</span>
                                    <span className="text-sm font-normal text-teal-100 opacity-90">{s('begin_water', lang)}</span>
                                </div>
                            </button>
                        ) : (
                            <button onClick={() => setConfirmAction('STOP')} className="w-full btn-smart btn-glass-irrigation p-[22px] rounded-[24px] flex items-center justify-center gap-4 group border-teal-400/50 bg-teal-50">
                                <span className="text-3xl animate-[pulse_2s_infinite]">🚿</span>
                                <div className="flex flex-col text-left">
                                    <span className="font-bold text-xl font-display tracking-wide">{s('stop_irrig', lang)}</span>
                                    <span className="text-sm font-normal text-teal-700 opacity-90">{s('pause_current', lang)}</span>
                                </div>
                            </button>
                        )}
                        <button onClick={() => handleAction('STOP')} className="w-full btn-smart btn-theme-danger text-white p-[22px] rounded-[24px] text-lg font-bold flex items-center justify-center gap-3 group tracking-widest uppercase font-display">
                            <AlertOctagon size={28} className="group-hover:scale-110 transition-transform" />
                            {s('emg_stop', lang)}
                        </button>
                    </div>
                ) : (
                    <div className="bg-white border-2 border-amber-300 p-6 rounded-[24px] mt-4 shadow-xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3 font-display">
                            <span className="text-amber-500 bg-amber-50 p-2 rounded-full"><AlertOctagon size={32} /></span>
                            {confirmAction === 'START' ? s('confirm_start', lang) : s('confirm_stop', lang)}
                        </h2>
                        <ul className="text-slate-600 mb-8 space-y-3 text-lg bg-slate-50 p-4 rounded-2xl">
                            <li className="flex justify-between items-center"><span>{s('field_lbl', lang)}</span> <span className="font-bold text-slate-800">Primary Field</span></li>
                            {confirmAction === 'START' && <li className="flex justify-between items-center pt-2 border-t border-slate-200"><span>{s('estimated', lang)}</span> <span className="font-bold text-emerald-600">12 min</span></li>}
                        </ul>
                        <div className="flex gap-4">
                            <button onClick={() => setConfirmAction(null)} className="flex-1 btn-smart bg-white border-2 border-slate-200 text-slate-600 p-5 rounded-[20px] font-bold text-lg font-display">
                                {s('cancel', lang)}
                            </button>
                            <button onClick={() => handleAction(confirmAction)} className={`flex-1 btn-smart text-white p-5 rounded-[20px] font-bold text-lg font-display ${confirmAction === 'START' ? 'btn-theme-irrigation' : 'btn-theme-danger'}`}>
                                {confirmAction === 'START' ? s('cfm_start', lang) : s('cfm_stop', lang)}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

