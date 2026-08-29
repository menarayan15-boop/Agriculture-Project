/**
 * Krishi Jal - AI Smart Irrigation & Crop Advisor
 * Core Application Logic (Vanilla Javascript ES6+)
 */

// ==========================================================================
// 1. Static Databases: Locations, Soils, and Crops
// ==========================================================================

const LOCATIONS = [
    { id: "punjab", nameEn: "Punjab (Ludhiana), India", nameHi: "पंजाब (लुधियाना), भारत", nameEs: "Punjab (Ludhiana), India", nameFr: "Pendjab (Ludhiana), Inde", nameTe: "పంజాబ్ (లూథియానా), భారతదేశం", nameTa: "பஞ்சாப் (லூதியானா), இந்தியா", nameMr: "पंजाब (लुधियाना), भारत", nameBn: "পাঞ্জাব (লুধিয়ানা), ভারত", namePa: "ਪੰਜਾਬ (ਲੁਧਿਆਣਾ), ਭਾਰਤ", lat: 30.90, lon: 75.85, defaultSoil: "clay-loam" },
    { id: "maharashtra", nameEn: "Maharashtra (Nashik), India", nameHi: "महाराष्ट्र (नाशिक), भारत", nameEs: "Maharashtra (Nashik), India", nameFr: "Maharashtra (Nashik), Inde", nameTe: "మహారాష్ట్ర (నాసిక్), భారతదేశం", nameTa: "மகாராஷ்டிரா (நாசிக்), இந்தியா", nameMr: "महाराष्ट्र (नाशिक), भारत", nameBn: "মহারাষ্ট্র (নাশিক), ভারত", namePa: "ਮਹਾਰਾਸ਼ਟਰ (ਨਾਸਿਕ), ਭਾਰਤ", lat: 19.99, lon: 73.78, defaultSoil: "black-soil" },
    { id: "andhra", nameEn: "Andhra Pradesh (Guntur), India", nameHi: "आंध्र प्रदेश (गुंटूर), भारत", nameEs: "Andhra Pradesh (Guntur), India", nameFr: "Andhra Pradesh (Guntur), Inde", nameTe: "ఆంధ్రప్రదేశ్ (గుంటూరు), భారతదేశం", nameTa: "ஆந்திரப் பிரதேசம் (குண்டூர்), இந்தியா", nameMr: "आंध्र प्रदेश (गुंटूर), भारत", nameBn: "অন্ধ্রপ্রদেশ (গুন্টুর), ভারত", namePa: "ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼ (ਗੁੰਟੂਰ), ਭਾਰਤ", lat: 16.30, lon: 80.45, defaultSoil: "red-soil" },
    { id: "up", nameEn: "Uttar Pradesh (Kanpur), India", nameHi: "उत्तर प्रदेश (कानपुर), भारत", nameEs: "Uttar Pradesh (Kanpur), India", nameFr: "Uttar Pradesh (Kanpur), Inde", nameTe: "ఉత్తర ప్రదేశ్ (కాన్పూర్), భారతదేశం", nameTa: "உத்தரப் பிரதேசம் (கான்பூர்), இந்தியா", nameMr: "उत्तर प्रदेश (कानपूर), भारत", nameBn: "উত্তরপ্রদেশ (কানপুর), ভারত", namePa: "ਉੱਤਰ ਪ੍ਰਦੇਸ਼ (ਕਾਨਪੁਰ), ਭਾਰਤ", lat: 26.44, lon: 80.33, defaultSoil: "alluvial" },
    { id: "rajasthan", nameEn: "Rajasthan (Sri Ganganagar), India", nameHi: "राजस्थान (श्री गंगानगर), भारत", nameEs: "Rajasthan (Sri Ganganagar), India", nameFr: "Rajasthan (Sri Ganganagar), Inde", nameTe: "రాజస్థాన్ (శ్రీ గంగానగర్), భారతదేశం", nameTa: "ராஜஸ்தான் (ஸ்ரீ கங்காநகர்), இந்தியா", nameMr: "राजस्थान (श्री गंगानगर), भारत", nameBn: "রাজস্থান (শ্রী গঙ্গানগর), ভারত", namePa: "ਰਾਜਸਥਾਨ (ਸ੍ਰੀ ਗੰਗਾਨਗਰ), ਭਾਰਤ", lat: 29.92, lon: 73.87, defaultSoil: "sandy" },
    { id: "bengal", nameEn: "West Bengal (Bardhaman), India", nameHi: "पश्चिम बंगाल (बर्धमान), भारत", nameEs: "Bengala Occidental (Bardhaman), India", nameFr: "Bengale-Occidental (Bardhaman), Inde", nameTe: "పశ్చిమ బెంగాల్ (బర్ధమాన్), భారతదేశం", nameTa: "மேற்கு வங்கம் (பர்தாமன்), இந்தியா", nameMr: "पश्चिम बंगाल (बर्धमान), भारत", nameBn: "পশ্চিমবঙ্গ (বর্ধমান), ভারত", namePa: "ਪੱਛਮੀ ਬੰਗਾਲ (ਬਰਧਮਾਨ), ਭਾਰਤ", lat: 23.23, lon: 87.86, defaultSoil: "clay" },
    { id: "haryana", nameEn: "Haryana (Karnal), India", nameHi: "हरियाणा (करनाल), भारत", nameEs: "Haryana (Karnal), India", nameFr: "Haryana (Karnal), Inde", nameTe: "హర్యానా (కర్నాల్), భారతదేశం", nameTa: "ஹரியானா (கர்னல்), இந்தியா", nameMr: "हरियाणा (कर्नाल), भारत", nameBn: "হরিয়ানা (কার্নাল), ভারত", namePa: "ਹਰਿਆਣਾ (ਕਰਨਾਲ), ਭਾਰਤ", lat: 29.68, lon: 76.99, defaultSoil: "alluvial" },
    { id: "california", nameEn: "California (Fresno), USA", nameHi: "कैलिफोर्निया (फ्रेस्नो), अमेरिका", nameEs: "California (Fresno), EE. UU.", nameFr: "Californie (Fresno), États-Unis", nameTe: "కాలిఫోర్నియా (ఫ్రెస్నో), యుఎస్ఎ", nameTa: "கலிபோர்னியா (ஃப்ரெஸ்னோ), அமெரிக்கா", nameMr: "कॅलिफोर्निया (फ्रेस्नो), अमेरिका", nameBn: "ক্যালিফোর্নিয়া (ফ্রেসনো), ইউএসএ", namePa: "ਕੈਲੀਫੋਰਨੀਆ (ਫਰੈਜ਼ਨੋ), ਯੂਐੱਸਏ", lat: 36.74, lon: -119.78, defaultSoil: "loamy" },
    { id: "iowa", nameEn: "Iowa (Des Moines), USA", nameHi: "आयोवा (डेस मोइनेस), अमेरिका", nameEs: "Iowa (Des Moines), EE. UU.", nameFr: "Iowa (Des Moines), États-Unis", nameTe: "అయోవా (డెస్ మోయిన్స్), యుఎస్ఎ", nameTa: "அயோவா (டெஸ் மொய்ன்ஸ்), அமெரிக்கா", nameMr: "आयोवा (डेस मोइनेस), अमेरिका", nameBn: "আইওয়া (ডেস মইনেস), ইউএসএ", namePa: "ਆਇਓਵਾ (ਡੇਸ ਮੋਇਨਜ਼), ਯੂਐੱਸਏ", lat: 41.58, lon: -93.60, defaultSoil: "silt" },
    { id: "texas", nameEn: "Texas (Lubbock), USA", nameHi: "टेक्सास (लुबॉक), अमेरिका", nameEs: "Texas (Lubbock), EE. UU.", nameFr: "Texas (Lubbock), États-Unis", nameTe: "టెక్సాస్ (లుబ్బాక్), యుఎస్ఎ", nameTa: "டெக்சாஸ் (லபக்), அமெரிக்கா", nameMr: "टेक्सास (लुबॉक), अमेरिका", nameBn: "টেক্সাস (লুবক), ইউএসএ", namePa: "ਟੈਕਸਾਸ (ਲੁਬੌਕ), ਯੂਐੱਸਏ", lat: 33.57, lon: -101.85, defaultSoil: "sandy" },
    { id: "valencia", nameEn: "Valencia, Spain", nameHi: "वलेंसिया, स्पेन", nameEs: "Valencia, España", nameFr: "Valence, Espagne", nameTe: "వాలెన్సియా, స్పెయిన్", nameTa: "வாலென்சியா, ஸ்பெயின்", nameMr: "वलेंसिया, स्पेन", nameBn: "ভ্যালেন্সিয়া, স্পেন", namePa: "ਵੈਲੈਂਸੀਆ, ਸਪੇਨ", lat: 39.46, lon: -0.37, defaultSoil: "loamy" },
    { id: "loire", nameEn: "Loire Valley, France", nameHi: "लॉयर वैली, फ्रांस", nameEs: "Valle del Loira, Francia", nameFr: "Vallée de la Loire, France", nameTe: "లోయిర్ వ్యాలీ, ఫ్రాన్స్", nameTa: "லொயர் பள்ளத்தாக்கு, பிரான்ஸ்", nameMr: "लॉयर व्हॅली, फ्रान्स", nameBn: "লোয়ার ভ্যালি, ফ্রান্স", namePa: "ਲੋਇਰ ਵੈਲੀ, ਫਰਾਂਸ", lat: 47.39, lon: 0.68, defaultSoil: "alluvial" },
    { id: "queensland", nameEn: "Queensland (Toowoomba), Australia", nameHi: "क्वींसलैंड (टूवूम्बा), ऑस्ट्रेलिया", nameEs: "Queensland (Toowoomba), Australia", nameFr: "Queensland (Toowoomba), Australie", nameTe: "క్వీన్స్ ల్యాండ్ (టూవూంబా), ఆస్ట్రేలియా", nameTa: "குயின்ஸ்லாந்து (டூவூம்பா), ஆஸ்திரேலியா", nameMr: "क्वीन्सलंड (टूवूम्बा), ऑस्ट्रेलिया", nameBn: "কুইন্সল্যান্ড (টুওওম্বা), অস্ট্রেলিয়া", namePa: "ਕਵੀਨਜ਼ਲੈਂਡ (ਟੂਵੂਮਬਾ), ਆਸਟ੍ਰੇਲੀਆ", lat: -27.55, lon: 151.95, defaultSoil: "black-soil" },
    { id: "riogrande", nameEn: "Rio Grande do Sul, Brazil", nameHi: "रियो ग्रांडे डो सुल, ब्राजील", nameEs: "Río Grande del Sur, Brasil", nameFr: "Rio Grande do Sul, Brésil", nameTe: "రియో గ్రాండే దో సుల్, బ్రెజిల్", nameTa: "ரியோ கிராண்டே டோ சுல், பிரேசில்", nameMr: "रियो ग्रांडे डो सुल, ब्राझील", nameBn: "রিও গ্র্যান্ডে দো সুল, ব্রাজিল", namePa: "ਰੀਓ ਗ੍ਰਾਂਡੇ ਡੋ ਸੁਲ, ਬ੍ਰਾਜ਼ੀਲ", lat: -28.26, lon: -52.40, defaultSoil: "clay" },
    { id: "egypt", nameEn: "Nile Delta (Tanta), Egypt", nameHi: "नील डेल्टा (तांता), मिस्र", nameEs: "Delta del Nilo (Tanta), Egipto", nameFr: "Delta du Nil (Tanta), Égypte", nameTe: "నైలు డెల్టా (టాంటా), ఈజిప్ట్", nameTa: "நைல் டெல்டா (தந்தா), எகிப்து", nameMr: "नाईल डेल्टा (तांता), इजिप्त", nameBn: "নীল নদ বদ্বীপ (তান্তা), মিশর", namePa: "ਨੀਲ ਡੈਲਟਾ (ਤਾਂਤਾ), ਮਿਸਰ", lat: 30.78, lon: 31.00, defaultSoil: "clay" }
];

const SOILS = [
    {
        id: "clay",
        nameKey: "soil-clay",
        retention: 90,
        drainage: 15,
        color: "#543d2b",
        particles: {
            "schemes-subtitle": "Explore los principales programas gubernamentales, subsidios, seguros de cultivos y facilidades de crédito.",

            "schemes-title": "Programas Agrícolas Gubernamentales y Comprobador de Subsidios IA",

            "tab-schemes": "Programas y Subsidios Gub.",

            "advisor-conservation-tips": "Water Conservation Actions",
            "advisor-critical-tips": "Critical Crop Care Tips",
            "advisor-report-summary": "AI Irrigation Prescription",
            "btn-analyze-soil": "Analyze Soil Sample",
            "btn-generate": "Generate Irrigation Plan",
            "config-desc": "Define your field parameters to get custom AI advice.",
            "config-title": "Farm Settings",
            "console-ready-msg": "> Ready for input parameter generation...",
            "crop-barley": "Barley",
            "crop-barley-cons": "Leverage laser land leveling to ensure water distributes perfectly with zero runoff waste.",
            "crop-barley-desc": "Barley is a drought-resistant cool-season cereal. More salt-tolerant than wheat, performs well in light sandy-loam soils with moderate water needs.",
            "crop-barley-tips": "Do not over-water during vegetative stages. Maintain aerated roots. Avoid nitrogen leaching.",
            "crop-chickpea": "Chickpea / Gram",
            "crop-chickpea-cons": "Rely on furrow irrigation in broad bed systems to conserve water and prevent fungal collar rot.",
            "crop-chickpea-desc": "Chickpea is a winter pulse crop. Highly sensitive to waterlogging. Extremely efficient in using residual soil moisture; requires very low irrigation.",
            "crop-chickpea-tips": "Water stress at flowering is dangerous, but excess water causes vegetative overgrowth and zero pod yield.",
            "crop-cotton": "Cotton",
            "crop-cotton-cons": "Employ drip irrigation beneath black soil mulch to limit evaporation and maximize water efficiency.",
            "crop-cotton-desc": "Cotton is a warm-season cash crop. Thrives in deep black cotton soils. Highly vulnerable to waterlogging during early stages but drought-tolerant later.",
            "crop-cotton-tips": "Ensure soil moisture is optimal during flowering and boll formation. Avoid flood irrigation to prevent root hypoxia.",
            "crop-groundnut": "Groundnut",
            "crop-groundnut-cons": "Avoid sprinkler irrigation during pod formation to prevent soil crusting. Use drip tapes instead.",
            "crop-groundnut-desc": "Groundnut is a legume that matures underground. Requires sandy loams to allow the peg to penetrate the soil and develop pods easily. High drainage is critical.",
            "crop-groundnut-tips": "Provide irrigation during flowering and pegging stages. Avoid clayey soils which restrict peg penetration.",
            "crop-jasmine": "Jasmine Flower (Mogra)",
            "crop-jasmine-cons": "Practice basin method watering and thick organic composting around the shrub to preserve moisture.",
            "crop-jasmine-desc": "Jasmine is an aromatic commercial flowering crop widely used for perfumes and traditional garlands. Thrives in warm, sunny weather and well-drained soils.",
            "crop-jasmine-tips": "Irrigate regularly during the main flowering season (summer/monsoon). Prune after flowering to encourage new wood and blooms.",
            "crop-maize": "Maize / Corn",
            "crop-maize-cons": "Practice ridge-and-furrow planting. Apply water in furrows only to concentrate moisture near roots.",
            "crop-maize-desc": "Maize is a versatile cereal. Highly sensitive to standing water (waterlogging) and requires moderate, evenly spaced watering throughout its vegetative and flowering phases.",
            "crop-maize-tips": "Avoid water stress during the tasseling and silking stages as it can lead to massive yield reduction.",
            "crop-marigold": "Marigold Flower",
            "crop-marigold-cons": "Apply light straw mulching around beds to prevent moisture evaporation and keep roots cool.",
            "crop-marigold-desc": "Marigold is a robust, popular flowering plant grown for pest management, ritual use, and garlands. Extremely adaptive and easy to grow.",
            "crop-marigold-tips": "Avoid overwatering which causes root rot and reduces flower count. Pinch growing tips early to encourage bushy growth and more buds.",
            "crop-mustard": "Mustard",
            "crop-mustard-cons": "A single micro-sprinkler session during flowering is highly water-efficient compared to flooding.",
            "crop-mustard-desc": "Mustard is a hardy winter oilseed crop. Low-to-moderate water requirement, thrives in sandy loams and alluvial soils with minimal watering.",
            "crop-mustard-tips": "Needs just 2 to 3 light irrigations: first at pre-flowering stage, second at pod-development stage.",
            "crop-potato": "Potato",
            "crop-potato-cons": "Use drip tubes laid under plastic mulch to achieve up to 90% water application efficiency.",
            "crop-potato-desc": "Potato is a tuber crop requiring cool temperatures and loose, aerated soils like sandy loams. Heavy clay soil causes root rot and poor tuber size.",
            "crop-potato-tips": "Irrigate frequently but lightly. Keep the soil hilled to protect tubers from sunlight and keep them cool.",
            "crop-rice": "Rice / Paddy",
            "crop-rice-cons": "Implement Alternate Wetting and Drying (AWD) rather than continuous flooding to save up to 30% water.",
            "crop-rice-desc": "Rice is a water-intensive tropical cereal. It thrives in standing water and warm, humid climates, requiring clayey soils that resist water drainage.",
            "crop-rice-tips": "Maintain a standing water level of 5-8 cm during early growth. Avoid letting soil dry out completely until ripening stage.",
            "crop-rose": "Rose Flower",
            "crop-rose-cons": "Utilize automated drip systems with timers to water only in early mornings to minimize evaporation loss.",
            "crop-rose-desc": "Rose is a premium commercial floriculture crop. Demands rich organic soil, consistent moderate moisture, and careful pruning.",
            "crop-rose-tips": "Water the root zone directly, avoid wetting leaves to prevent black spots. Fertilize monthly with nitrogen and potash.",
            "crop-sorghum": "Sorghum (Jowar)",
            "crop-sorghum-cons": "Use soil moisture sensors to avoid irrigation if deep root zone has residual humidity.",
            "crop-sorghum-desc": "Sorghum is a highly climate-resilient dryland crop. Requires minimal water and survives high temperatures, performing well in heavy soils.",
            "crop-sorghum-tips": "Provide irrigation during critical boot and grain-filling stages if rainfall is insufficient.",
            "crop-soybean": "Soybean",
            "crop-soybean-cons": "No-till farming keeps previous crop residue on the field, preserving vital soil water reserves.",
            "crop-soybean-desc": "Soybean is a protein-rich oilseed. Highly sensitive to drought during pod-filling and sensitive to waterlogging. Prefers loamy soils.",
            "crop-soybean-tips": "Ensure adequate moisture during pod-set and pod-filling. Do not let soil crust over after sowing.",
            "crop-sugarcane": "Sugarcane",
            "crop-sugarcane-cons": "Use trash-mulching between crop rows to dramatically reduce evaporation and prevent weed growth.",
            "crop-sugarcane-desc": "Sugarcane is a long-duration, highly water-intensive crop. Requires robust moisture availability, thriving on alluvial and clayey soils with high water holding capacities.",
            "crop-sugarcane-tips": "Critical watering required during the formative phase (first 4 months). Mulch with dry leaves to retain moisture.",
            "crop-sunflower": "Sunflower",
            "crop-sunflower-cons": "Employ drip irrigation lines directly along rows to conserve up to 45% water compared to furrow flooding.",
            "crop-sunflower-desc": "Sunflower is a highly versatile oilseed flower crop. Highly drought-tolerant with deep taproots, requiring good drainage and sunlight.",
            "crop-sunflower-tips": "Water deeply but infrequently to encourage deep rooting. Avoid overhead watering to prevent flower bud rot.",
            "crop-tomato": "Tomato",
            "crop-tomato-cons": "Apply organic mulch (straw/coconut husk) around plant bases to retain 40% more soil moisture.",
            "crop-tomato-desc": "Tomato is a sensitive warm-season nightshade crop. Requires constant, moderate moisture. Overwatering causes fruit splitting and blossom end rot.",
            "crop-tomato-tips": "Water the soil directly, not the leaves, to prevent fungal blights. Maintain consistent moisture to prevent fruit cracking.",
            "crop-wheat": "Wheat",
            "crop-wheat-cons": "Use sprinkler irrigation systems to distribute water evenly and reduce evaporation loss.",
            "crop-wheat-desc": "Wheat is a winter cereal crop. It requires a cool growing season and warm weather at maturity. Prefers well-drained loams and alluvial silt.",
            "crop-wheat-tips": "Provide critical irrigation during the Crown Root Initiation (CRI) stage (21-25 days after sowing) and during the flowering stage.",
            "dash-diagnostic-title": "Growth Suitability Diagnostics",
            "dash-soil-title": "Soil Retention & Properties",
            "dash-suitability-title": "Growth Suitability Score",
            "dash-weather-title": "Current Weather Conditions",
            "diag-init-desc": "Please choose your Region, Soil Type, and Crop in the Farm Settings panel and click Generate Plan.",
            "diag-init-title": "Awaiting Input Data",
            "edu-crop-catalog": "Crop Agricultural Profiles",
            "edu-soil-catalog": "Soil Characteristics Guide",
            "footer-interview-notes": "Built for Agricultural AI Interview Demonstrations. Powered by Open-Meteo & Gemini-Core.",
            "footer-tagline": "Empowering farmers with smart agronomic intelligence.",
            "label-crop": "Crop Type",
            "label-location": "Location / Region",
            "label-soil": "Soil Texture / Type",
            "label-stage": "Growth Stage",
            "logo-tagline": "AI Smart Irrigation Advisor",
            "schedule-title": "7-Day Recommended Irrigation Schedule",
            "sl-color-dark": "Dark Black / Charcoal",
            "sl-color-grey": "Grey / Ashy",
            "sl-color-light": "Light Brown / Tan",
            "sl-color-red": "Reddish Brown",
            "sl-color-yellow": "Yellowish",
            "sl-moist-dry": "Dry",
            "sl-moist-moist": "Moist / Damp",
            "sl-moist-verydry": "Very Dry / Cracked",
            "sl-moist-waterlogged": "Waterlogged / Saturated",
            "sl-org-decayed": "Decayed Leaves",
            "sl-org-fungal": "Fungal Growth",
            "sl-org-roots": "Root Fragments",
            "sl-org-worms": "Earthworms",
            "sl-tex-crumbly": "Crumbly / Loamy",
            "sl-tex-gritty": "Gritty / Sandy",
            "sl-tex-smooth": "Smooth / Silky (Silt)",
            "sl-tex-sticky": "Sticky / Clay-like",
            "soil-alluvial": "Alluvial Silt Loam",
            "soil-alluvial-desc": "Highly fertile soil deposited by river channels. Rich in potash, phosphoric acid, and organic silt. Excellent moisture properties, suitable for wheat, sugarcane, and pulses.",
            "soil-black": "Black Cotton Soil",
            "soil-black-desc": "Deep black vertisol rich in clay. High swelling and cracking traits, high moisture retention. Famous for cotton cultivation.",
            "soil-chalky": "Chalky/Lime Soil",
            "soil-chalky-desc": "Very alkaline, shallow soil containing a high proportion of calcium carbonate (lime) and stones. Drains extremely fast and dries out easily. Requires organic matter and iron amendments.",
            "soil-clay": "Heavy Clay Soil",
            "soil-clay-desc": "Heavy clay soil with exceptionally high water retention, but very low drainage speed. Extremely susceptible to waterlogging. Ideal for flood-crops like Rice, but requires careful drainage for root-crops.",
            "soil-clay-loam": "Clayey Loam",
            "soil-clay-loam-desc": "Balanced mixture of clay, silt, and sand. Rich nutrient levels, high water holding capability, and fair drainage characteristics. Highly versatile for general agriculture.",
            "soil-drainage": "Drainage Speed",
            "soil-helper": "Soil type auto-fills from region but can be modified.",
            "soil-laterite": "Laterite Soil",
            "soil-laterite-desc": "Iron and aluminum-rich soil formed in hot, wet tropical areas. Highly weathered, acidic, and drains quickly. Requires phosphorus fertilization and regular organic manure addition.",
            "soil-loamy": "Medium Loam",
            "soil-loamy-desc": "The ideal agricultural soil. Excellent balance of drainage and moisture retention, allowing air pockets for root respiration. Nutrient-dense and easy to work.",
            "soil-peaty": "Peaty/Marshy Soil",
            "soil-peaty-desc": "Organic-rich soil formed in waterlogged marshy areas. Very high water retention but naturally poorly drained. High acidity, rich in organic matter. Best for specialized moisture-loving plants.",
            "soil-red": "Red Sandy Loam",
            "soil-red-desc": "Formed from crystalline metamorphic rocks. High iron content, porous structure, excellent drainage. Naturally low in water retention, requires organic fertilizers and regulated watering.",
            "soil-saline": "Saline-Alkaline Soil",
            "soil-saline-desc": "Salt-affected soil common in arid and semi-arid regions with poor drainage. Restricts water absorption by crops. Requires gypsum washing and salt-tolerant cropping patterns.",
            "soil-sandy": "Sandy/Desert Soil",
            "soil-sandy-desc": "Coarse sand particles. High water percolation rate with minimal moisture holding capability. Nutrients leach out quickly. Requires frequent, light drip-irrigation and heavy organic mulching.",
            "soil-silt": "Silty Soil",
            "soil-silt-desc": "Fine, smooth particles that retain moisture well but can become compact. Holds nutrients effectively. Good for a wide range of cereals and tuber crops.",
            "soil-water-retention": "Water Retention",
            "soillab-amend-title": "Soil Improvement Recommendations",
            "soillab-area": "Field Area (acres)",
            "soillab-color": "Soil Color",
            "soillab-crop-fert": "Fertilizer Suggestion",
            "soillab-crop-match": "Match",
            "soillab-crop-name": "Crop",
            "soillab-crop-rating": "Rating",
            "soillab-crop-title": "Crop Compatibility Rankings",
            "soillab-fe": "Iron (Fe)",
            "soillab-health-label": "SOIL HEALTH",
            "soillab-hero-subtitle": "Generated from visual & tactile soil observations",
            "soillab-hero-title": "AI Soil Health Report",
            "soillab-high": "High",
            "soillab-k": "Potassium (K)",
            "soillab-low": "Low",
            "soillab-medium": "Med",
            "soillab-moisture": "Moisture Level",
            "soillab-n": "Nitrogen (N)",
            "soillab-nutrient-title": "Estimated Nutrient Profile",
            "soillab-om": "Organic Matter",
            "soillab-organic": "Organic Matter Signs",
            "soillab-p": "Phosphorus (P)",
            "soillab-ph": "pH Strip Reading",
            "soillab-ph-title": "pH Analysis & Acidity Profile",
            "soillab-placeholder-desc": "Fill in your soil sample observations on the left and click Analyze Soil.",
            "soillab-placeholder-title": "Soil Analysis Report",
            "soillab-subtitle": "Describe your soil sample to get an AI-powered lab report.",
            "soillab-texture": "Texture Feel",
            "soillab-title": "AI Soil Analysis Lab",
            "soillab-zn": "Zinc (Zn)",
            "stage-flowering": "Mid-Season / Flowering",
            "stage-germination": "Initial / Germination",
            "stage-ripening": "Ripening / Harvesting",
            "stage-vegetative": "Crop Development / Vegetative",
            "stage-yield": "Late-Season / Yield Formation",
            "suitability-alert-txt": "Submit configuration to analyze",
            "suitability-pending": "Suitability",
            "tab-advisor": "AI Advisor",
            "tab-dashboard": "Dashboard",
            "tab-education": "Agri Guide",
            "tab-soillab": "Soil Lab",
            "tab-weather": "Weather Station",
            "table-action": "Action & Best Time",
            "table-day": "Day / Date",
            "table-rain": "Forecast Rain",
            "table-soil-moisture": "Soil Moisture Deficit",
            "table-temp": "Temp (Min/Max)",
            "table-water-needed": "Irrigation Depth",
            "units-celsius": "°C / mm",
            "units-fahrenheit": "°F / inches",
            "weather-feels-like": "Feels Like",
            "weather-humidity": "Humidity",
            "weather-precipitation": "Rain Probability",
            "weather-pressure": "Pressure",
            "weather-radiation": "UV Index",
            "weather-station-forecast-title": "7-Day Meteorological Forecast",
            "weather-station-live-title": "Dynamic Weather Monitor",
            "weather-wind": "Wind Speed",
            "profit-card-title": "Desglose Estimado de Rendimiento e Ingresos",

            "profit-section-title": "Estimador de Rendimiento y Rentabilidad",

            "btn-clear-key": "Borrar Clave",

            "btn-save-key": "Guardar y Conectar",

            "label-gemini-key": "Ingrese la Clave API de Gemini:",

            "modal-ai-desc": "Conecte Gemini 1.5 Flash AI para asistencia conversacional en tiempo real, diagnóstico de enfermedades y asesoramiento agronómico.",

            "modal-ai-title": "Conectar Gemini AI en Vivo",

            "btn-ai-key": "Clave Gemini AI",

            "planner-timeline-title": "Cronograma Anual de Crecimiento y Siembra",

            "planner-rotation-title": "Secuencia de Rotación para Nitrógeno y Control de Plagas",

            "planner-calendar-title": "Calendario Agrícola y Motor de Rotación de Cultivos",

            "season-zaid": "Zaid (Verano)",

            "season-rabi": "Rabi (Invierno)",

            "season-kharif": "Kharif (Monzón)",

            "season-all": "Todas las Estaciones",

            "tab-planner": "Calendario y Rotación",

            "flower-booster-title": "Floricultura y Estimulación de Floración",

            "seed-treatment-title": "Tratamiento de Semillas y Germinación",

            "seed-flower-title": "Cuidado de Semillas, Viveros y Flores",

            "pref-synthetic": "Comercial de Alto Rendimiento",

            "pref-organic": "100% Orgánico y Bio-Insumos",

            "pref-balanced": "Equilibrado (Químico + Bio)",

            "label-preference": "Preferencia de Práctica Agrícola",

            "pest-safety-period": "Seguridad de Pre-cosecha",

            "pest-water-vol": "Agua de Dilución",

            "fert-zinc": "Sulfato de Zinc",

            "fert-mop": "MOP (60% K₂O)",

            "fert-dap": "DAP (18-46-0)",

            "fert-urea": "Urea (46% N)",

            "pest-card-title": "Control de Plagas y Protección Vegetal",

            "fert-card-title": "Requerimientos de Nutrientes y Fertilizantes",

            "advisor-fert-pest-title": "Protección de Cultivos y Dosis de Fertilizantes",

            "area-helper": "Calcula con precisión las dosis de fertilizantes y pesticidas.",

            "label-area": "Área de la Granja (Acres)",
            sand: 10, clay: 90
        },
        descKey: "soil-clay-desc"
    },
    {
        id: "clay-loam",
        nameKey: "soil-clay-loam",
        retention: 75,
        drainage: 40,
        color: "#6e473b",
        particles: { sand: 30, clay: 70 },
        descKey: "soil-clay-loam-desc"
    },
    {
        id: "loamy",
        nameKey: "soil-loamy",
        retention: 60,
        drainage: 60,
        color: "#78533c",
        particles: { sand: 50, clay: 50 },
        descKey: "soil-loamy-desc"
    },
    {
        id: "sandy",
        nameKey: "soil-sandy",
        retention: 25,
        drainage: 95,
        color: "#c29d66",
        particles: { sand: 90, clay: 10 },
        descKey: "soil-sandy-desc"
    },
    {
        id: "silt",
        nameKey: "soil-silt",
        retention: 65,
        drainage: 50,
        color: "#6e5d4f",
        particles: { sand: 40, clay: 60 },
        descKey: "soil-silt-desc"
    },
    {
        id: "black-soil",
        nameKey: "soil-black",
        retention: 85,
        drainage: 20,
        color: "#242322",
        particles: { sand: 20, clay: 80 },
        descKey: "soil-black-desc"
    },
    {
        id: "red-soil",
        nameKey: "soil-red",
        retention: 45,
        drainage: 70,
        color: "#963a23",
        particles: { sand: 65, clay: 35 },
        descKey: "soil-red-desc"
    },
    {
        id: "alluvial",
        nameKey: "soil-alluvial",
        retention: 70,
        drainage: 55,
        color: "#85735c",
        particles: { sand: 40, clay: 60 },
        descKey: "soil-alluvial-desc"
    },
    {
        id: "laterite",
        nameKey: "soil-laterite",
        retention: 40,
        drainage: 75,
        color: "#c04020",
        particles: { sand: 50, clay: 50 },
        descKey: "soil-laterite-desc"
    },
    {
        id: "peaty",
        nameKey: "soil-peaty",
        retention: 80,
        drainage: 30,
        color: "#2c1c0c",
        particles: { sand: 15, clay: 85 },
        descKey: "soil-peaty-desc"
    },
    {
        id: "saline",
        nameKey: "soil-saline",
        retention: 50,
        drainage: 35,
        color: "#b0b0a0",
        particles: { sand: 40, clay: 60 },
        descKey: "soil-saline-desc"
    },
    {
        id: "chalky",
        nameKey: "soil-chalky",
        retention: 30,
        drainage: 80,
        color: "#d0c0b0",
        particles: { sand: 60, clay: 40 },
        descKey: "soil-chalky-desc"
    }
];

const CROPS = [
    {
        id: "rice",
        nameKey: "crop-rice",
        tempMin: 20,
        tempMax: 35,
        suitableSoils: ["clay", "clay-loam", "black-soil", "alluvial"],
        kc: { germination: 1.05, vegetative: 1.15, flowering: 1.20, yield: 1.10, ripening: 0.90 },
        waterReqMm: 1200,
        descKey: "crop-rice-desc",
        tipsKey: "crop-rice-tips",
        consKey: "crop-rice-cons",
        avgYieldQuintalsPerAcre: 24, mandiPricePerQuintal: 2300,
        season: "kharif", sowingMonths: [5, 6], growthMonths: [7, 8], harvestMonths: [9, 10], rotationSequence: ['Chickpea / Pulse (Rabi)', 'Sunflower (Zaid)', 'Rice (Next Kharif)'],
        seedTreatment: "Soak seeds in 1% salt solution to filter lightweight seeds. Treat selected seed with Carbendazim 50% WP (2 g/kg) or Trichoderma viride (10 g/kg) + Pseudomonas fluorescens to prevent Seedling Blast & Bakanae disease.",
        organic: { 'fertNote': 'Apply Vermicompost @ 2.5 Tons/acre + FYM @ 5 Tons/acre + Azospirillum & Phosphobacteria bio-fertilizers @ 2 kg/acre.', 'pestNote': 'Spray Neem Oil 1500 ppm @ 1 L/acre or Beauveria bassiana @ 1 kg/acre for Stem Borer & Leaf Folder control.' },
        fertilizers: { ureaKgPerAcre: 90, dapKgPerAcre: 45, mopKgPerAcre: 30, zincKgPerAcre: 10, fymTonsPerAcre: 4, splitNote: 'Apply 50% Urea + full DAP & MOP at basal transplanting. Apply remaining 50% Urea in two split doses at tillering and panicle initiation stages.' },
        pesticides: [{ pest: 'Stem Borer & Leaf Folder', chemical: 'Chlorantraniliprole 18.5% SC', dosagePerAcre: '60 ml', waterLiters: 200, safetyDays: 14 }, { pest: 'Rice Blast & Brown Spot', chemical: 'Tebuconazole 50% + Trifloxystrobin 25% WG', dosagePerAcre: '80 g', waterLiters: 200, safetyDays: 21 }]
    },
    {
        id: "wheat",
        nameKey: "crop-wheat",
        tempMin: 10,
        tempMax: 25,
        suitableSoils: ["clay-loam", "loamy", "alluvial", "black-soil", "silt"],
        kc: { germination: 0.70, vegetative: 0.90, flowering: 1.15, yield: 1.15, ripening: 0.40 },
        waterReqMm: 500,
        descKey: "crop-wheat-desc",
        tipsKey: "crop-wheat-tips",
        consKey: "crop-wheat-cons",
        avgYieldQuintalsPerAcre: 20, mandiPricePerQuintal: 2275,
        season: "rabi", sowingMonths: [9, 10], growthMonths: [11, 0, 1], harvestMonths: [2, 3], rotationSequence: ['Green Gram / Moong (Zaid)', 'Cotton or Rice (Kharif)', 'Wheat (Next Rabi)'],
        seedTreatment: "Treat seed with Carboxin 37.5% + Thiram 37.5% DS @ 3 g/kg seed or Trichoderma harzianum @ 10 g/kg. Inoculate with Azotobacter & PSB for nitrogen and phosphorus uptake.",
        organic: { 'fertNote': 'Apply FYM @ 4 Tons/acre + Poultry Manure @ 1.5 Tons/acre + Azotobacter culture at sowing.', 'pestNote': 'Spray Neem Seed Kernel Extract (NSKE 5%) @ 2 L/acre for Aphid control.' },
        fertilizers: { ureaKgPerAcre: 100, dapKgPerAcre: 50, mopKgPerAcre: 25, zincKgPerAcre: 10, fymTonsPerAcre: 3, splitNote: 'Apply full DAP, MOP & 50% Urea at sowing (CRI stage). Apply remaining 50% Urea after 1st irrigation (21-25 days).' },
        pesticides: [{ pest: 'Wheat Aphids & Termites', chemical: 'Imidacloprid 17.8% SL', dosagePerAcre: '50 ml', waterLiters: 150, safetyDays: 15 }, { pest: 'Yellow & Brown Rust', chemical: 'Propiconazole 25% EC', dosagePerAcre: '200 ml', waterLiters: 200, safetyDays: 30 }]
    },
    {
        id: "cotton",
        nameKey: "crop-cotton",
        tempMin: 18,
        tempMax: 38,
        suitableSoils: ["black-soil", "clay-loam", "alluvial", "red-soil"],
        kc: { germination: 0.45, vegetative: 0.75, flowering: 1.15, yield: 1.15, ripening: 0.75 },
        waterReqMm: 900,
        descKey: "crop-cotton-desc",
        tipsKey: "crop-cotton-tips",
        consKey: "crop-cotton-cons",
        avgYieldQuintalsPerAcre: 12, mandiPricePerQuintal: 6800,
        season: "kharif", sowingMonths: [4, 5], growthMonths: [6, 7, 8, 9], harvestMonths: [10, 11], rotationSequence: ['Wheat or Chickpea (Rabi)', 'Fallow / Cover Crop (Zaid)', 'Cotton (Next Kharif)'],
        seedTreatment: "Delint cotton seed with sulfuric acid (if fuzzy). Treat with Imidacloprid 70% WS @ 7 g/kg seed to protect young seedlings from Jassids & Thrips for 45 days.",
        organic: { 'fertNote': 'Apply Neem Cake @ 250 kg/acre + FYM @ 5 Tons/acre + Vermicompost @ 2 Tons/acre.', 'pestNote': 'Install 8 Pheromone traps/acre for Pink Bollworm. Spray Neem Oil 1500ppm @ 1 L/acre.' },
        fertilizers: { ureaKgPerAcre: 110, dapKgPerAcre: 60, mopKgPerAcre: 35, zincKgPerAcre: 12, fymTonsPerAcre: 5, splitNote: 'Apply 25% Urea + full DAP at planting. Top-dress remaining Urea in 3 equal splits at squaring, flowering, and boll formation.' },
        pesticides: [{ pest: 'Pink Bollworm & Whitefly', chemical: 'Emamectin Benzoate 5% SG + Neem Oil 1500ppm', dosagePerAcre: '100 g + 500 ml', waterLiters: 200, safetyDays: 14 }, { pest: 'Cotton Leaf Curl Virus / Jassids', chemical: 'Flonicamid 50% WG', dosagePerAcre: '60 g', waterLiters: 200, safetyDays: 20 }]
    },
    {
        id: "maize",
        nameKey: "crop-maize",
        tempMin: 15,
        tempMax: 32,
        suitableSoils: ["loamy", "clay-loam", "alluvial", "silt", "red-soil"],
        kc: { germination: 0.40, vegetative: 0.80, flowering: 1.15, yield: 1.15, ripening: 0.60 },
        waterReqMm: 650,
        descKey: "crop-maize-desc",
        tipsKey: "crop-maize-tips",
        consKey: "crop-maize-cons",
        avgYieldQuintalsPerAcre: 26, mandiPricePerQuintal: 2090,
        season: "kharif", sowingMonths: [5, 6], growthMonths: [7, 8], harvestMonths: [9, 10], rotationSequence: ['Mustard or Potato (Rabi)', 'Sunflower (Zaid)', 'Pulse (Next Kharif)'],
        seedTreatment: "Treat seed with Thiamethoxam 30% FS @ 6 ml/kg + Metalaxyl 35% WS @ 3 g/kg for Shoot Fly & Downy Mildew protection.",
        organic: { 'fertNote': 'Apply Vermicompost @ 2 Tons/acre + Compost @ 4 Tons/acre + PSB bio-fertilizer.', 'pestNote': 'Release Trichogramma chilonis egg parasitoids @ 50,000/acre for Fall Armyworm control.' },
        fertilizers: { ureaKgPerAcre: 95, dapKgPerAcre: 45, mopKgPerAcre: 30, zincKgPerAcre: 10, fymTonsPerAcre: 4, splitNote: 'Apply 33% Urea + full DAP/MOP at sowing. Apply 33% Urea at knee-high stage and final 34% Urea at tasseling stage.' },
        pesticides: [{ pest: 'Fall Armyworm (FAW)', chemical: 'Spinetoram 11.7% SC', dosagePerAcre: '100 ml', waterLiters: 200, safetyDays: 14 }, { pest: 'Turcicum Leaf Blight', chemical: 'Mancozeb 75% WP', dosagePerAcre: '400 g', waterLiters: 200, safetyDays: 15 }]
    },
    {
        id: "potato",
        nameKey: "crop-potato",
        tempMin: 12,
        tempMax: 22,
        suitableSoils: ["loamy", "sandy", "silt", "alluvial", "red-soil"],
        kc: { germination: 0.50, vegetative: 0.75, flowering: 1.15, yield: 1.15, ripening: 0.75 },
        waterReqMm: 600,
        descKey: "crop-potato-desc",
        tipsKey: "crop-potato-tips",
        consKey: "crop-potato-cons",
        avgYieldQuintalsPerAcre: 120, mandiPricePerQuintal: 1200,
        season: "rabi", sowingMonths: [9, 10], growthMonths: [11, 0], harvestMonths: [1, 2], rotationSequence: ['Cucurbits / Sunflower (Zaid)', 'Maize or Rice (Kharif)', 'Potato (Next Rabi)'],
        seedTreatment: "Dip seed tubers in 0.5% Mancozeb or Em leaflets for 10 mins before planting. Treat tubers with Trichoderma viride to prevent Black Scurf & Wilt.",
        organic: { 'fertNote': 'Apply Well-rotted FYM @ 6 Tons/acre + Mustard Cake @ 200 kg/acre.', 'pestNote': 'Spray Panchagavya 3% + Neem Oil for Early & Late Blight prevention.' },
        fertilizers: { ureaKgPerAcre: 105, dapKgPerAcre: 70, mopKgPerAcre: 50, zincKgPerAcre: 10, fymTonsPerAcre: 6, splitNote: 'Apply 50% Urea + full DAP & MOP during earthing up at planting. Top-dress remaining 50% Urea 30 days after planting.' },
        pesticides: [{ pest: 'Late Blight & Early Blight', chemical: 'Cymoxanil 8% + Mancozeb 64% WP', dosagePerAcre: '600 g', waterLiters: 200, safetyDays: 14 }, { pest: 'Potato Aphids & White Grubs', chemical: 'Thiamethoxam 25% WG', dosagePerAcre: '80 g', waterLiters: 200, safetyDays: 21 }]
    },
    {
        id: "tomato",
        nameKey: "crop-tomato",
        tempMin: 16,
        tempMax: 30,
        suitableSoils: ["loamy", "clay-loam", "silt", "alluvial", "red-soil"],
        kc: { germination: 0.60, vegetative: 0.85, flowering: 1.15, yield: 1.15, ripening: 0.80 },
        waterReqMm: 700,
        descKey: "crop-tomato-desc",
        tipsKey: "crop-tomato-tips",
        consKey: "crop-tomato-cons",
        avgYieldQuintalsPerAcre: 150, mandiPricePerQuintal: 1500,
        season: "zaid", sowingMonths: [1, 2], growthMonths: [3, 4], harvestMonths: [5, 6], rotationSequence: ['Rice or Cotton (Kharif)', 'Mustard or Pulse (Rabi)', 'Tomato (Next Zaid)'],
        seedTreatment: "Treat seeds with Captan 75% WP @ 3 g/kg seed. Inoculate seedling roots with VAM (Vesicular Arbuscular Mycorrhiza) & Pseudomonas at transplanting.",
        organic: { 'fertNote': 'Apply Vermicompost @ 3 Tons/acre + Neem Cake @ 150 kg/acre + Liquid Jeevamrut via drip.', 'pestNote': 'Spray Bacillus thuringiensis (Bt) @ 400 g/acre or NSKE 5% for Tomato Fruit Borer.' },
        fertilizers: { ureaKgPerAcre: 85, dapKgPerAcre: 55, mopKgPerAcre: 45, zincKgPerAcre: 8, fymTonsPerAcre: 5, splitNote: 'Apply basal FYM & DAP. Top dress Urea and MOP in 4 equal weekly splits starting 3 weeks after transplanting.' },
        pesticides: [{ pest: 'Tomato Fruit Borer & Leafminer', chemical: 'Cyantraniliprole 10.26% OD', dosagePerAcre: '180 ml', waterLiters: 200, safetyDays: 7 }, { pest: 'Damping Off & Bacterial Wilt', chemical: 'Copper Oxychloride 50% WP', dosagePerAcre: '500 g', waterLiters: 200, safetyDays: 10 }]
    },
    {
        id: "groundnut",
        nameKey: "crop-groundnut",
        tempMin: 20,
        tempMax: 30,
        suitableSoils: ["sandy", "loamy", "red-soil"],
        kc: { germination: 0.40, vegetative: 0.75, flowering: 1.05, yield: 1.05, ripening: 0.60 },
        waterReqMm: 600,
        descKey: "crop-groundnut-desc",
        tipsKey: "crop-groundnut-tips",
        consKey: "crop-groundnut-cons",
        avgYieldQuintalsPerAcre: 10, mandiPricePerQuintal: 6375,
        season: "kharif", sowingMonths: [5, 6], growthMonths: [7, 8], harvestMonths: [9, 10], rotationSequence: ['Wheat or Sorghum (Rabi)', 'Watermelon (Zaid)', 'Groundnut (Next Kharif)'],
        seedTreatment: "Treat seed kernels with Mancozeb @ 3 g/kg or Trichoderma @ 10 g/kg + Rhizobium strain NC-92 inoculant to ensure nitrogen nodulation.",
        organic: { 'fertNote': 'Apply FYM @ 4 Tons/acre + Gypsum @ 200 kg/acre at pegging stage.', 'pestNote': 'Spray Fermented Butter Milk + Neem Oil for Tikka Leaf Spot control.' },
        fertilizers: { ureaKgPerAcre: 40, dapKgPerAcre: 50, mopKgPerAcre: 25, zincKgPerAcre: 10, fymTonsPerAcre: 3, splitNote: 'Apply full DAP, MOP & 50% Urea at sowing. Gypsum @ 200 kg/acre MUST be applied at pegging stage for pod development.' },
        pesticides: [{ pest: 'Tikka Leaf Spot & Rust', chemical: 'Hexaconazole 5% EC', dosagePerAcre: '250 ml', waterLiters: 200, safetyDays: 20 }, { pest: 'Tobacco Caterpillar / Spodoptera', chemical: 'Indoxacarb 14.5% SC', dosagePerAcre: '150 ml', waterLiters: 200, safetyDays: 14 }]
    },
    {
        id: "sugarcane",
        nameKey: "crop-sugarcane",
        tempMin: 20,
        tempMax: 38,
        suitableSoils: ["clay", "clay-loam", "black-soil", "alluvial", "loamy"],
        kc: { germination: 0.70, vegetative: 1.00, flowering: 1.25, yield: 1.25, ripening: 0.75 },
        waterReqMm: 2000,
        descKey: "crop-sugarcane-desc",
        tipsKey: "crop-sugarcane-tips",
        consKey: "crop-sugarcane-cons",
        avgYieldQuintalsPerAcre: 380, mandiPricePerQuintal: 315,
        season: "kharif", sowingMonths: [1, 2, 9, 10], growthMonths: [3, 4, 5, 6, 7, 8], harvestMonths: [11, 0, 1], rotationSequence: ['Wheat / Pulse (Intercrop)', 'Ratoon Sugarcane', 'Green Manure / Sunnhemp'],
        seedTreatment: "Dip 3-budded setts in Carbendazim 0.1% + Chlorpyrifos solution for 15 mins. Treat setts with Acetobacter diazotrophicus for biological N-fixation.",
        organic: { 'fertNote': 'Apply Pressmud compost @ 5 Tons/acre + Vermicompost @ 3 Tons/acre.', 'pestNote': 'Release Sturmiopsis inferens parasitoids for Shoot Borer management.' },
        fertilizers: { ureaKgPerAcre: 180, dapKgPerAcre: 90, mopKgPerAcre: 60, zincKgPerAcre: 15, fymTonsPerAcre: 8, splitNote: 'Apply DAP & 25% Urea at planting. Top-dress remaining Urea in 3 splits at 45, 90, and 120 days post-planting.' },
        pesticides: [{ pest: 'Early Shoot Borer & Top Borer', chemical: 'Fipronil 0.3% GR', dosagePerAcre: '10 kg (Soil application)', waterLiters: 0, safetyDays: 45 }, { pest: 'Sugarcane Red Rot & Smut', chemical: 'Carbendazim 50% WP', dosagePerAcre: '300 g', waterLiters: 200, safetyDays: 30 }]
    },
    {
        id: "soybean",
        nameKey: "crop-soybean",
        tempMin: 18,
        tempMax: 32,
        suitableSoils: ["loamy", "clay-loam", "alluvial", "black-soil"],
        kc: { germination: 0.40, vegetative: 0.75, flowering: 1.15, yield: 1.15, ripening: 0.50 },
        waterReqMm: 550,
        descKey: "crop-soybean-desc",
        tipsKey: "crop-soybean-tips",
        consKey: "crop-soybean-cons",
        avgYieldQuintalsPerAcre: 11, mandiPricePerQuintal: 4600,
        season: "kharif", sowingMonths: [5, 6], growthMonths: [7, 8], harvestMonths: [9, 10], rotationSequence: ['Wheat or Barley (Rabi)', 'Summer Moong (Zaid)', 'Soybean (Next Kharif)'],
        seedTreatment: "Treat seed with Thiram + Carbendazim (2:1) @ 3 g/kg followed by Bradyrhizobium japonicum + PSB culture @ 20 g/kg seed.",
        organic: { 'fertNote': 'Apply FYM @ 3 Tons/acre + Bio-fertilizer consortium.', 'pestNote': 'Spray Beauveria bassiana @ 1 kg/acre for Spodoptera Caterpillar control.' },
        fertilizers: { ureaKgPerAcre: 35, dapKgPerAcre: 55, mopKgPerAcre: 25, zincKgPerAcre: 10, fymTonsPerAcre: 3, splitNote: 'Apply full DAP, MOP, and 50% Urea basal at sowing. Rhizobium bio-fertilizer seed treatment is highly recommended.' },
        pesticides: [{ pest: 'Girdle Beetle & Stem Fly', chemical: 'Chlorantraniliprole 9.3% + Thiamethoxam 17.5% SC', dosagePerAcre: '80 ml', waterLiters: 200, safetyDays: 21 }, { pest: 'Yellow Mosaic Virus / Whitefly', chemical: 'Acetamiprid 20% SP', dosagePerAcre: '50 g', waterLiters: 150, safetyDays: 15 }]
    },
    {
        id: "mustard",
        nameKey: "crop-mustard",
        tempMin: 8,
        tempMax: 25,
        suitableSoils: ["loamy", "sandy", "alluvial", "clay-loam", "red-soil"],
        kc: { germination: 0.35, vegetative: 0.70, flowering: 1.05, yield: 1.05, ripening: 0.35 },
        waterReqMm: 420,
        descKey: "crop-mustard-desc",
        tipsKey: "crop-mustard-tips",
        consKey: "crop-mustard-cons",
        avgYieldQuintalsPerAcre: 8, mandiPricePerQuintal: 5650,
        season: "rabi", sowingMonths: [9, 10], growthMonths: [11, 0], harvestMonths: [1, 2], rotationSequence: ['Pearl Millet / Bajra (Kharif)', 'Fallow (Zaid)', 'Mustard (Next Rabi)'],
        seedTreatment: "Treat seed with Metalaxyl 35% SD @ 6 g/kg seed to prevent White Rust & Downy Mildew. Treat with Trichoderma for Sclerotinia Rot.",
        organic: { 'fertNote': 'Apply Vermicompost @ 2 Tons/acre + Elemental Sulfur / Bio-sulfur @ 10 kg/acre.', 'pestNote': 'Spray Yellow Sticky Traps @ 20/acre + Neem Oil for Mustard Aphids.' },
        fertilizers: { ureaKgPerAcre: 70, dapKgPerAcre: 40, mopKgPerAcre: 20, zincKgPerAcre: 8, fymTonsPerAcre: 3, splitNote: 'Apply full DAP & 50% Urea at sowing. Top dress remaining 50% Urea after 1st irrigation (30 days).' },
        pesticides: [{ pest: 'Mustard Aphids (Chetpa)', chemical: 'Dimethoate 30% EC', dosagePerAcre: '250 ml', waterLiters: 200, safetyDays: 15 }, { pest: 'White Rust & Alternaria Blight', chemical: 'Mancozeb 75% WP', dosagePerAcre: '500 g', waterLiters: 200, safetyDays: 20 }]
    },
    {
        id: "barley",
        nameKey: "crop-barley",
        tempMin: 8,
        tempMax: 24,
        suitableSoils: ["loamy", "clay-loam", "alluvial", "silt", "sandy"],
        kc: { germination: 0.65, vegetative: 0.85, flowering: 1.15, yield: 1.15, ripening: 0.40 },
        waterReqMm: 480,
        descKey: "crop-barley-desc",
        tipsKey: "crop-barley-tips",
        consKey: "crop-barley-cons",
        avgYieldQuintalsPerAcre: 18, mandiPricePerQuintal: 1850,
        season: "rabi", sowingMonths: [9, 10], growthMonths: [11, 0, 1], harvestMonths: [2, 3], rotationSequence: ['Cluster Bean / Guar (Kharif)', 'Fallow (Zaid)', 'Barley (Next Rabi)'],
        seedTreatment: "Treat seed with Tebuconazole 2% DS @ 1.25 g/kg seed to eliminate Loose & Covered Smut inoculum.",
        organic: { 'fertNote': 'Apply FYM @ 3 Tons/acre + PSB inoculant at sowing.', 'pestNote': 'Spray Garlic-Chilli Extract @ 5% for Aphid control.' },
        fertilizers: { ureaKgPerAcre: 65, dapKgPerAcre: 35, mopKgPerAcre: 20, zincKgPerAcre: 8, fymTonsPerAcre: 2.5, splitNote: 'Apply 50% Urea + full DAP at basal sowing. Top dress remaining Urea after 1st irrigation.' },
        pesticides: [{ pest: 'Barley Aphids & Covered Smut', chemical: 'Tebuconazole 2 DS (Seed treatment)', dosagePerAcre: '100 g', waterLiters: 0, safetyDays: 0 }, { pest: 'Helminthosporium Leaf Stripe', chemical: 'Carbendazim 12% + Mancozeb 63% WP', dosagePerAcre: '400 g', waterLiters: 200, safetyDays: 21 }]
    },
    {
        id: "chickpea",
        nameKey: "crop-chickpea",
        tempMin: 10,
        tempMax: 28,
        suitableSoils: ["loamy", "clay-loam", "alluvial", "black-soil", "red-soil"],
        kc: { germination: 0.40, vegetative: 0.70, flowering: 1.00, yield: 1.00, ripening: 0.35 },
        waterReqMm: 400,
        descKey: "crop-chickpea-desc",
        tipsKey: "crop-chickpea-tips",
        consKey: "crop-chickpea-cons",
        avgYieldQuintalsPerAcre: 9, mandiPricePerQuintal: 5440,
        season: "rabi", sowingMonths: [9, 10], growthMonths: [11, 0], harvestMonths: [1, 2], rotationSequence: ['Rice or Sorghum (Kharif)', 'Sesame (Zaid)', 'Chickpea (Next Rabi)'],
        seedTreatment: "Treat seeds with Carboxin @ 2 g/kg + Trichoderma viride @ 8 g/kg + Mesorhizobium ciceri bio-fertilizer for effective root wilt resistance.",
        organic: { 'fertNote': 'Apply Vermicompost @ 1.5 Tons/acre + Rock Phosphate @ 100 kg/acre.', 'pestNote': 'Install T-shaped bird perches @ 20/acre + HaNPV Virus spray @ 250 LE/acre for Pod Borer.' },
        fertilizers: { ureaKgPerAcre: 25, dapKgPerAcre: 45, mopKgPerAcre: 20, zincKgPerAcre: 8, fymTonsPerAcre: 2, splitNote: 'Apply full DAP, MOP & Urea basal at sowing. Treat seed with Rhizobium + PSB bio-fertilizers.' },
        pesticides: [{ pest: 'Pod Borer (Helicoverpa)', chemical: 'Chlorantraniliprole 18.5% SC or HaNPV Virus', dosagePerAcre: '50 ml', waterLiters: 200, safetyDays: 14 }, { pest: 'Wilt & Root Rot', chemical: 'Trichoderma viride (Bio-agent)', dosagePerAcre: '1 kg (Soil treatment)', waterLiters: 0, safetyDays: 0 }]
    },
    {
        id: "sunflower",
        nameKey: "crop-sunflower",
        tempMin: 18,
        tempMax: 34,
        suitableSoils: ["loamy", "clay-loam", "alluvial", "black-soil", "laterite"],
        kc: { germination: 0.35, vegetative: 0.75, flowering: 1.05, yield: 0.90, ripening: 0.40 },
        waterReqMm: 500,
        descKey: "crop-sunflower-desc",
        tipsKey: "crop-sunflower-tips",
        consKey: "crop-sunflower-cons",
        avgYieldQuintalsPerAcre: 8, mandiPricePerQuintal: 6400,
        season: "zaid", sowingMonths: [0, 1], growthMonths: [2, 3], harvestMonths: [4, 5], rotationSequence: ['Kharif Pulse / Soybean', 'Rabi Wheat / Mustard', 'Sunflower (Next Zaid)'],
        seedTreatment: "Treat seed with Imidacloprid 70% WS @ 5 g/kg + Thiram @ 3 g/kg seed for Downy Mildew & Necrosis Virus protection.",
        organic: { 'fertNote': 'Apply FYM @ 3.5 Tons/acre + Wood Ash @ 100 kg/acre for Potash.', 'pestNote': 'Spray Neem Oil 1500ppm + Handpicking of Hairy Caterpillars.' },
        fertilizers: { ureaKgPerAcre: 75, dapKgPerAcre: 45, mopKgPerAcre: 30, zincKgPerAcre: 10, fymTonsPerAcre: 3, splitNote: 'Apply 50% Urea + full DAP/MOP basal. Top dress remaining 50% Urea 30 days after sowing before flowering.' },
        pesticides: [{ pest: 'Head Borer & Hairy Caterpillar', chemical: 'Profofos 50% EC', dosagePerAcre: '350 ml', waterLiters: 200, safetyDays: 15 }, { pest: 'Alternaria Leaf Spot', chemical: 'Zineb 75% WP', dosagePerAcre: '500 g', waterLiters: 200, safetyDays: 14 }]
    },
    {
        id: "sorghum",
        nameKey: "crop-sorghum",
        tempMin: 20,
        tempMax: 35,
        suitableSoils: ["black-soil", "clay-loam", "loamy", "red-soil", "saline"],
        kc: { germination: 0.30, vegetative: 0.75, flowering: 1.00, yield: 1.00, ripening: 0.55 },
        waterReqMm: 450,
        descKey: "crop-sorghum-desc",
        tipsKey: "crop-sorghum-tips",
        consKey: "crop-sorghum-cons",
        avgYieldQuintalsPerAcre: 12, mandiPricePerQuintal: 3180,
        season: "kharif", sowingMonths: [5, 6], growthMonths: [7, 8], harvestMonths: [9, 10], rotationSequence: ['Gram / Safflower (Rabi)', 'Fallow (Zaid)', 'Sorghum (Next Kharif)'],
        seedTreatment: "Treat seeds with Imidacloprid 70% WS @ 10 g/kg seed to prevent Shoot Fly attack during first 30 days after germination.",
        organic: { 'fertNote': 'Apply FYM @ 3 Tons/acre + Azospirillum culture.', 'pestNote': 'Intercrop with Cowpea to reduce Shoot Fly & Stem Borer incidence.' },
        fertilizers: { ureaKgPerAcre: 70, dapKgPerAcre: 40, mopKgPerAcre: 20, zincKgPerAcre: 8, fymTonsPerAcre: 3, splitNote: 'Apply 50% Urea + full DAP at sowing. Top dress remaining Urea at 30-35 days stage.' },
        pesticides: [{ pest: 'Sorghum Shoot Fly & Stem Borer', chemical: 'Chlorpyrifos 20% EC', dosagePerAcre: '400 ml', waterLiters: 200, safetyDays: 20 }, { pest: 'Grain Mold & Anthracnose', chemical: 'Mancozeb 75% WP', dosagePerAcre: '400 g', waterLiters: 200, safetyDays: 15 }]
    },
    {
        id: "marigold",
        nameKey: "crop-marigold",
        tempMin: 15,
        tempMax: 28,
        suitableSoils: ["loamy", "clay-loam", "sandy", "red-soil"],
        kc: { germination: 0.40, vegetative: 0.70, flowering: 0.95, yield: 0.90, ripening: 0.50 },
        waterReqMm: 350,
        descKey: "crop-marigold-desc",
        tipsKey: "crop-marigold-tips",
        consKey: "crop-marigold-cons",
        avgYieldQuintalsPerAcre: 60, mandiPricePerQuintal: 4000,
        season: "zaid", sowingMonths: [1, 2, 6, 7], growthMonths: [3, 4, 8, 9], harvestMonths: [5, 6, 10, 11], rotationSequence: ['Vegetables / Tomato', 'Legumes (Nitrogen fixation)', 'Marigold (Next Season)'],
        seedTreatment: "Treat nursery seeds with Thiram @ 2 g/kg or Trichoderma. Drench nursery beds with Copper Oxychloride 0.2% to prevent Damping Off.",
        organic: { 'fertNote': 'Apply Vermicompost @ 3 Tons/acre + Neem Cake @ 200 kg/acre + Panchagavya spray.', 'pestNote': 'Spray Verticillium lecanii @ 1 kg/acre for Thrips & Mites.' }, flowerBoosters: "Spray Potassium Nitrate 13-0-45 @ 5 g/L + Boron 20% @ 1 g/L at flower bud initiation to increase bloom diameter and vibrant orange/yellow petal coloration.",
        fertilizers: { ureaKgPerAcre: 60, dapKgPerAcre: 40, mopKgPerAcre: 30, zincKgPerAcre: 6, fymTonsPerAcre: 4, splitNote: 'Apply basal FYM & DAP. Top dress Urea in 2 splits at 30 and 45 days after transplanting.' },
        pesticides: [{ pest: 'Red Spider Mites & Thrips', chemical: 'Abamectin 1.9% EC', dosagePerAcre: '150 ml', waterLiters: 150, safetyDays: 7 }, { pest: 'Damping Off & Flower Blight', chemical: 'Captan 75% WP', dosagePerAcre: '400 g', waterLiters: 200, safetyDays: 10 }]
    },
    {
        id: "rose",
        nameKey: "crop-rose",
        tempMin: 12,
        tempMax: 30,
        suitableSoils: ["loamy", "clay-loam", "peaty", "alluvial"],
        kc: { germination: 0.50, vegetative: 0.80, flowering: 1.00, yield: 0.95, ripening: 0.60 },
        waterReqMm: 800,
        descKey: "crop-rose-desc",
        tipsKey: "crop-rose-tips",
        consKey: "crop-rose-cons",
        avgYieldQuintalsPerAcre: 40, mandiPricePerQuintal: 9000,
        season: "zaid", sowingMonths: [8, 9], growthMonths: [10, 11, 0, 1], harvestMonths: [2, 3, 4, 5], rotationSequence: ['Perennial Floriculture', 'Intercrop with Garlic / Onion', 'Pruning & Soil Amendment'],
        seedTreatment: "Dip root cuttings / saplings in IBA (Indole-3-butyric acid 1000 ppm) rooting hormone. Treat root ball with Trichoderma before field planting.",
        organic: { 'fertNote': 'Apply Well-rotted Cow Dung manure @ 6 Tons/acre + Bone Meal @ 150 kg/acre + Humic Acid spray.', 'pestNote': 'Spray Neem Oil 1500ppm + Garlic Extract for Powdery Mildew & Aphids.' }, flowerBoosters: "Apply Gibberellic Acid (GA3) @ 50 ppm (0.05 g/L) + Rose Special Micronutrient Mix @ 3 g/L post-pruning to induce heavy multi-bud flowering and long stem cut-flowers.",
        fertilizers: { ureaKgPerAcre: 80, dapKgPerAcre: 50, mopKgPerAcre: 40, zincKgPerAcre: 8, fymTonsPerAcre: 6, splitNote: 'Apply well-rotted FYM post pruning. Feed NPK 15:15:15 monthly along with foliar micronutrients.' },
        pesticides: [{ pest: 'Black Spot & Powdery Mildew', chemical: 'Myclobutanil 10% WP', dosagePerAcre: '200 g', waterLiters: 150, safetyDays: 7 }, { pest: 'Rose Aphids & Scale Insects', chemical: 'Malathion 50% EC', dosagePerAcre: '300 ml', waterLiters: 200, safetyDays: 10 }]
    },
    {
        id: "jasmine",
        nameKey: "crop-jasmine",
        tempMin: 20,
        tempMax: 35,
        suitableSoils: ["loamy", "red-soil", "clay-loam", "laterite"],
        kc: { germination: 0.40, vegetative: 0.70, flowering: 0.90, yield: 0.85, ripening: 0.50 },
        waterReqMm: 600,
        descKey: "crop-jasmine-desc",
        tipsKey: "crop-jasmine-tips",
        consKey: "crop-jasmine-cons",
        avgYieldQuintalsPerAcre: 30, mandiPricePerQuintal: 12000,
        season: "zaid", sowingMonths: [5, 6], growthMonths: [7, 8, 9, 10], harvestMonths: [2, 3, 4, 5], rotationSequence: ['Perennial Flower Bush', 'Intercrop with Cowpea', 'Annual Organic Mulching'],
        seedTreatment: "Treat rooted cuttings with Pseudomonas fluorescens @ 10 g/L root dip before field planting to prevent Root Rot.",
        organic: { 'fertNote': 'Apply Vermicompost @ 4 Tons/acre + Groundnut Cake @ 200 kg/acre + Jeevamrut.', 'pestNote': 'Spray Bacillus thuringiensis (Bt) @ 2 g/L for Bud Worm control.' }, flowerBoosters: "Spray Zinc Sulphate 0.5% + Boric Acid 0.2% + Nitrobenzene 20% @ 2 ml/L before flowering peak to double fragrant flower bud yield and stem retention.",
        fertilizers: { ureaKgPerAcre: 70, dapKgPerAcre: 45, mopKgPerAcre: 35, zincKgPerAcre: 8, fymTonsPerAcre: 5, splitNote: 'Apply organic manure & full DAP after annual pruning. Apply Urea in 2 splits prior to summer flowering peak.' },
        pesticides: [{ pest: 'Jasmine Bud Worm & Gallery Borer', chemical: 'Novaluron 10% EC', dosagePerAcre: '200 ml', waterLiters: 200, safetyDays: 10 }, { pest: 'Leaf Blight & Rust', chemical: 'Copper Hydroxide 77% WP', dosagePerAcre: '400 g', waterLiters: 200, safetyDays: 12 }]
    }
];

// ==========================================================================
// 2. Multilingual Dictionary (9 Languages)
// ==========================================================================

const TRANSLATIONS = {
    en: {
        "schemes-subtitle": "Explore top government schemes, subsidies, insurance policies, and credit facilities. Click 'Check My AI Eligibility' to get personalized application guidance for your farm location.",

        "schemes-title": "Government Agricultural Schemes & AI Subsidy Checker",

        "tab-schemes": "Govt Schemes & Subsidies",

        "profit-card-title": "Estimated Yield & Economic Revenue Breakdown",

        "profit-section-title": "AI Yield & Market Profitability Estimator",

        "btn-clear-key": "Clear Key",

        "btn-save-key": "Save & Connect",

        "label-gemini-key": "Enter Google Gemini API Key:",

        "modal-ai-desc": "Connect Google's Gemini 1.5 Flash AI to enable live real-time conversational assistance, instant disease diagnosis, and customized agronomic advice.",

        "modal-ai-title": "Connect Live Gemini AI",

        "planner-timeline-title": "Annual Crop Growth & Sowing Timeline",

        "planner-rotation-title": "Soil Nitrogen & Pest Control Crop Rotation Sequence",

        "planner-calendar-title": "Seasonal Sowing Calendar & Crop Rotation Engine",

        "season-zaid": "Zaid (Summer)",

        "season-rabi": "Rabi (Winter)",

        "season-kharif": "Kharif (Monsoon)",

        "season-all": "All Seasons",

        "tab-planner": "Crop Calendar & Rotation",

        "flower-booster-title": "Floriculture & Blooming Specialization",

        "seed-treatment-title": "Seed Treatment & Germination Care",

        "seed-flower-title": "Seed Care, Nursery & Flower Specialization",

        "pref-synthetic": "High-Yield Commercial",

        "pref-organic": "100% Organic & Bio-Inputs",

        "pref-balanced": "Balanced (Chemical + Bio)",

        "label-preference": "Farming Practice Preference",

        "pest-safety-period": "Pre-Harvest Safety",

        "pest-water-vol": "Dilution Water",

        "fert-zinc": "Zinc Sulphate",

        "fert-mop": "MOP (60% K₂O)",

        "fert-dap": "DAP (18-46-0)",

        "fert-urea": "Urea (46% N)",

        "pest-card-title": "Pest Control & Plant Protection",

        "fert-card-title": "Nutrient & Fertilizer Requirements",

        "advisor-fert-pest-title": "Crop Protection & Fertilizer Dosage",

        "area-helper": "Scales fertilizer and pesticide dosages accurately.",

        "label-area": "Farm Area (Acres)",

        "logo-tagline": "AI Smart Irrigation Advisor",
        "units-celsius": "°C / mm",
        "units-fahrenheit": "°F / inches",
        "config-title": "Farm Settings",
        "config-desc": "Define your field parameters to get custom AI advice.",
        "label-location": "Location / Region",
        "label-soil": "Soil Texture / Type",
        "label-crop": "Crop Type",
        "label-stage": "Growth Stage",
        "soil-helper": "Soil type auto-fills from region but can be modified.",
        "stage-germination": "Initial / Germination",
        "stage-vegetative": "Crop Development / Vegetative",
        "stage-flowering": "Mid-Season / Flowering",
        "stage-yield": "Late-Season / Yield Formation",
        "stage-ripening": "Ripening / Harvesting",
        "btn-generate": "Generate Irrigation Plan",
        "tab-dashboard": "Dashboard",
        "tab-advisor": "AI Advisor",
        "tab-weather": "Weather Station",
        "tab-education": "Agri Guide",
        "dash-suitability-title": "Growth Suitability Score",
        "suitability-pending": "Suitability",
        "suitability-alert-txt": "Submit configuration to analyze",
        "dash-weather-title": "Current Weather Conditions",
        "weather-humidity": "Humidity",
        "weather-precipitation": "Rain Probability",
        "weather-wind": "Wind Speed",
        "weather-radiation": "UV Index",
        "dash-soil-title": "Soil Retention & Properties",
        "soil-water-retention": "Water Retention",
        "soil-drainage": "Drainage Speed",
        "dash-diagnostic-title": "Growth Suitability Diagnostics",
        "diag-init-title": "Awaiting Input Data",
        "diag-init-desc": "Please choose your Region, Soil Type, and Crop in the Farm Settings panel and click \"Generate Irrigation Plan\" to start analysis.",
        "console-title": "Gemini 3.5 Flash Agricultural Advisor",
        "console-ready-msg": "> Ready for input parameter generation...",
        "advisor-report-summary": "AI Irrigation Prescription",
        "schedule-title": "7-Day Recommended Irrigation Schedule",
        "table-day": "Day / Date",
        "table-temp": "Temp (Min/Max)",
        "table-rain": "Forecast Rain",
        "table-soil-moisture": "Soil Moisture Deficit",
        "table-water-needed": "Irrigation Depth",
        "table-action": "Action & Best Time",
        "advisor-critical-tips": "Critical Crop Care Tips",
        "advisor-conservation-tips": "Water Conservation Actions",
        "weather-station-live-title": "Dynamic Weather Monitor",
        "weather-feels-like": "Feels Like",
        "weather-pressure": "Pressure",
        "weather-station-forecast-title": "7-Day Meteorological Forecast",
        "edu-crop-catalog": "Crop Agricultural Profiles",
        "edu-soil-catalog": "Soil Characteristics Guide",
        "footer-tagline": "Empowering farmers with smart agronomic intelligence.",
        "footer-interview-notes": "Built for Agricultural AI Interview Demonstrations. Powered by Open-Meteo & Gemini-Core.",

        // Soil names
        "soil-clay": "Heavy Clay Soil",
        "soil-clay-loam": "Clayey Loam",
        "soil-loamy": "Medium Loam",
        "soil-sandy": "Sandy/Desert Soil",
        "soil-silt": "Silty Soil",
        "soil-black": "Black Cotton Soil",
        "soil-red": "Red Sandy Loam",
        "soil-alluvial": "Alluvial Silt Loam",
        "soil-laterite": "Laterite Soil",
        "soil-peaty": "Peaty/Marshy Soil",
        "soil-saline": "Saline-Alkaline Soil",
        "soil-chalky": "Chalky/Lime Soil",

        // Soil Descriptions
        "soil-clay-desc": "Heavy clay soil with exceptionally high water retention, but very low drainage speed. Extremely susceptible to waterlogging. Ideal for flood-crops like Rice, but requires careful drainage for root-crops.",
        "soil-clay-loam-desc": "Balanced mixture of clay, silt, and sand. Rich nutrient levels, high water holding capability, and fair drainage characteristics. Highly versatile for general agriculture.",
        "soil-loamy-desc": "The ideal agricultural soil. Excellent balance of drainage and moisture retention, allowing air pockets for root respiration. Nutrient-dense and easy to work.",
        "soil-sandy-desc": "Coarse sand particles. High water percolation rate with minimal moisture holding capability. Nutrients leach out quickly. Requires frequent, light drip-irrigation and heavy organic mulching.",
        "soil-silt-desc": "Fine, smooth particles that retain moisture well but can become compact. Holds nutrients effectively. Good for a wide range of cereals and tuber crops.",
        "soil-black-desc": "Deep black vertisol rich in clay. High swelling and cracking traits, high moisture retention. Famous for cotton cultivation (\"Black Cotton Soil\"), holds moisture deep below the surface.",
        "soil-red-desc": "Formed from crystalline metamorphic rocks. High iron content, porous structure, excellent drainage. Naturally low in water retention, requires organic fertilizers and regulated watering.",
        "soil-alluvial-desc": "Highly fertile soil deposited by river channels. Rich in potash, phosphoric acid, and organic silt. Excellent moisture properties, suitable for wheat, sugarcane, and pulses.",
        "soil-laterite-desc": "Iron and aluminum-rich soil formed in hot, wet tropical areas. Highly weathered, acidic, and drains quickly. Requires phosphorus fertilization and regular organic manure addition.",
        "soil-peaty-desc": "Organic-rich soil formed in waterlogged marshy areas. Very high water retention but naturally poorly drained. High acidity, rich in organic matter. Best for specialized moisture-loving plants.",
        "soil-saline-desc": "Salt-affected soil common in arid and semi-arid regions with poor drainage. Restricts water absorption by crops. Requires gypsum washing and salt-tolerant cropping patterns.",
        "soil-chalky-desc": "Very alkaline, shallow soil containing a high proportion of calcium carbonate (lime) and stones. Drains extremely fast and dries out easily. Requires organic matter and iron amendments.",

        // Crop Names
        "crop-rice": "Rice / Paddy",
        "crop-wheat": "Wheat",
        "crop-cotton": "Cotton",
        "crop-maize": "Maize / Corn",
        "crop-potato": "Potato",
        "crop-tomato": "Tomato",
        "crop-groundnut": "Groundnut",
        "crop-sugarcane": "Sugarcane",
        "crop-soybean": "Soybean",
        "crop-mustard": "Mustard",
        "crop-barley": "Barley",
        "crop-chickpea": "Chickpea / Gram",
        "crop-sunflower": "Sunflower",
        "crop-sorghum": "Sorghum (Jowar)",
        "crop-marigold": "Marigold Flower",
        "crop-rose": "Rose Flower",
        "crop-jasmine": "Jasmine Flower (Mogra)",

        // Crop Descriptions
        "crop-rice-desc": "Rice is a water-intensive tropical cereal. It thrives in standing water and warm, humid climates, requiring clayey soils that resist water drainage.",
        "crop-wheat-desc": "Wheat is a winter cereal crop. It requires a cool growing season and warm weather at maturity. Prefers well-drained loams and alluvial silt.",
        "crop-cotton-desc": "Cotton is a warm-season cash crop. Thrives in deep black cotton soils. Highly vulnerable to waterlogging during early stages but drought-tolerant later.",
        "crop-maize-desc": "Maize is a versatile cereal. Highly sensitive to standing water (waterlogging) and requires moderate, evenly spaced watering throughout its vegetative and flowering phases.",
        "crop-potato-desc": "Potato is a tuber crop requiring cool temperatures and loose, aerated soils like sandy loams. Heavy clay soil causes root rot and poor tuber size.",
        "crop-tomato-desc": "Tomato is a sensitive warm-season nightshade crop. Requires constant, moderate moisture. Overwatering causes fruit splitting and blossom end rot.",
        "crop-groundnut-desc": "Groundnut is a legume that matures underground. Requires sandy loams to allow the peg to penetrate the soil and develop pods easily. High drainage is critical.",
        "crop-sugarcane-desc": "Sugarcane is a long-duration, highly water-intensive crop. Requires robust moisture availability, thriving on alluvial and clayey soils with high water holding capacities.",
        "crop-soybean-desc": "Soybean is a protein-rich oilseed. Highly sensitive to drought during pod-filling and sensitive to waterlogging. Prefers loamy soils.",
        "crop-mustard-desc": "Mustard is a hardy winter oilseed crop. Low-to-moderate water requirement, thrives in sandy loams and alluvial soils with minimal watering.",
        "crop-barley-desc": "Barley is a drought-resistant cool-season cereal. More salt-tolerant than wheat, performs well in light sandy-loam soils with moderate water needs.",
        "crop-chickpea-desc": "Chickpea is a winter pulse crop. Highly sensitive to waterlogging. Extremely efficient in using residual soil moisture; requires very low irrigation.",
        "crop-sunflower-desc": "Sunflower is a highly versatile oilseed flower crop. Highly drought-tolerant with deep taproots, requiring good drainage and sunlight.",
        "crop-sorghum-desc": "Sorghum is a highly climate-resilient dryland crop. Requires minimal water and survives high temperatures, performing well in heavy soils.",
        "crop-marigold-desc": "Marigold is a robust, popular flowering plant grown for pest management, ritual use, and garlands. Extremely adaptive and easy to grow.",
        "crop-rose-desc": "Rose is a premium commercial floriculture crop. Demands rich organic soil, consistent moderate moisture, and careful pruning.",
        "crop-jasmine-desc": "Jasmine is an aromatic commercial flowering crop widely used for perfumes and traditional garlands. Thrives in warm, sunny weather and well-drained soils.",

        // Crop Tips
        "crop-rice-tips": "Maintain a standing water level of 5-8 cm during early growth. Avoid letting soil dry out completely until ripening stage.",
        "crop-wheat-tips": "Provide critical irrigation during the Crown Root Initiation (CRI) stage (21-25 days after sowing) and during the flowering stage.",
        "crop-cotton-tips": "Ensure soil moisture is optimal during flowering and boll formation. Avoid flood irrigation to prevent root hypoxia.",
        "crop-maize-tips": "Avoid water stress during the tasseling and silking stages as it can lead to massive yield reduction.",
        "crop-potato-tips": "Irrigate frequently but lightly. Keep the soil hilled to protect tubers from sunlight and keep them cool.",
        "crop-tomato-tips": "Water the soil directly, not the leaves, to prevent fungal blights. Maintain consistent moisture to prevent fruit cracking.",
        "crop-groundnut-tips": "Provide irrigation during flowering and pegging stages. Avoid clayey soils which restrict peg penetration.",
        "crop-sugarcane-tips": "Critical watering required during the formative phase (first 4 months). Mulch with dry leaves to retain moisture.",
        "crop-soybean-tips": "Ensure adequate moisture during pod-set and pod-filling. Do not let soil crust over after sowing.",
        "crop-mustard-tips": "Needs just 2 to 3 light irrigations: first at pre-flowering stage, second at pod-development stage.",
        "crop-barley-tips": "Do not over-water during vegetative stages. Maintain aerated roots. Avoid nitrogen leaching.",
        "crop-chickpea-tips": "Water stress at flowering is dangerous, but excess water causes vegetative overgrowth and zero pod yield.",
        "crop-sunflower-tips": "Water deeply but infrequently to encourage deep rooting. Avoid overhead watering to prevent flower bud rot.",
        "crop-sorghum-tips": "Provide irrigation during critical boot and grain-filling stages if rainfall is insufficient.",
        "crop-marigold-tips": "Avoid overwatering which causes root rot and reduces flower count. Pinch growing tips early to encourage bushy growth and more buds.",
        "crop-rose-tips": "Water the root zone directly, avoid wetting leaves to prevent black spots. Fertilize monthly with nitrogen and potash.",
        "crop-jasmine-tips": "Irrigate regularly during the main flowering season (summer/monsoon). Prune after flowering to encourage new wood and blooms.",

        // Conservation Tips
        "crop-rice-cons": "Implement Alternate Wetting and Drying (AWD) rather than continuous flooding to save up to 30% water.",
        "crop-wheat-cons": "Use sprinkler irrigation systems to distribute water evenly and reduce evaporation loss.",
        "crop-cotton-cons": "Employ drip irrigation beneath black soil mulch to limit evaporation and maximize water efficiency.",
        "crop-maize-cons": "Practice ridge-and-furrow planting. Apply water in furrows only to concentrate moisture near roots.",
        "crop-potato-cons": "Use drip tubes laid under plastic mulch to achieve up to 90% water application efficiency.",
        "crop-tomato-cons": "Apply organic mulch (straw/coconut husk) around plant bases to retain 40% more soil moisture.",
        "crop-groundnut-cons": "Avoid sprinkler irrigation during pod formation to prevent soil crusting. Use drip tapes instead.",
        "crop-sugarcane-cons": "Use trash-mulching between crop rows to dramatically reduce evaporation and prevent weed growth.",
        "crop-soybean-cons": "No-till farming keeps previous crop residue on the field, preserving vital soil water reserves.",
        "crop-mustard-cons": "A single micro-sprinkler session during flowering is highly water-efficient compared to flooding.",
        "crop-barley-cons": "Leverage laser land leveling to ensure water distributes perfectly with zero runoff waste.",
        "crop-chickpea-cons": "Rely on furrow irrigation in broad bed systems to conserve water and prevent fungal collar rot.",
        "crop-sunflower-cons": "Employ drip irrigation lines directly along rows to conserve up to 45% water compared to furrow flooding.",
        "crop-sorghum-cons": "Use soil moisture sensors to avoid irrigation if deep root zone has residual humidity.",
        "crop-marigold-cons": "Apply light straw mulching around beds to prevent moisture evaporation and keep roots cool.",
        "crop-rose-cons": "Utilize automated drip systems with timers to water only in early mornings to minimize evaporation loss.",
        "crop-jasmine-cons": "Practice basin method watering and thick organic composting around the shrub to preserve moisture.",

        // Soil Lab UI
        "tab-soillab": "Soil Lab",
        "soillab-title": "AI Soil Analysis Lab",
        "soillab-subtitle": "Describe your soil sample to get an AI-powered lab report.",
        "soillab-color": "Soil Color",
        "soillab-texture": "Texture Feel",
        "soillab-moisture": "Moisture Level",
        "soillab-organic": "Organic Matter Signs",
        "soillab-ph": "pH Strip Reading",
        "soillab-area": "Field Area (acres)",
        "btn-analyze-soil": "Analyze Soil Sample",
        "soillab-placeholder-title": "Soil Analysis Report",
        "soillab-placeholder-desc": "Fill in your soil sample observations on the left and click \"Analyze Soil Sample\" to generate a detailed AI lab report.",
        "sl-color-dark": "Dark Black / Charcoal",
        "sl-color-red": "Reddish Brown",
        "sl-color-light": "Light Brown / Tan",
        "sl-color-grey": "Grey / Ashy",
        "sl-color-yellow": "Yellowish",
        "sl-tex-sticky": "Sticky / Clay-like",
        "sl-tex-smooth": "Smooth / Silky (Silt)",
        "sl-tex-gritty": "Gritty / Sandy",
        "sl-tex-crumbly": "Crumbly / Loamy",
        "sl-moist-waterlogged": "Waterlogged / Saturated",
        "sl-moist-moist": "Moist / Damp",
        "sl-moist-dry": "Dry",
        "sl-moist-verydry": "Very Dry / Cracked",
        "sl-org-worms": "Earthworms",
        "sl-org-decayed": "Decayed Leaves",
        "sl-org-roots": "Root Fragments",
        "sl-org-fungal": "Fungal Growth",
        "soillab-hero-title": "AI Soil Health Report",
        "soillab-hero-subtitle": "Generated from visual & tactile soil observations",
        "soillab-health-label": "SOIL HEALTH",
        "soillab-nutrient-title": "Estimated Nutrient Profile",
        "soillab-ph-title": "pH Analysis & Acidity Profile",
        "soillab-crop-title": "Crop Compatibility Rankings",
        "soillab-amend-title": "Soil Improvement Recommendations",
        "soillab-n": "Nitrogen (N)",
        "soillab-p": "Phosphorus (P)",
        "soillab-k": "Potassium (K)",
        "soillab-fe": "Iron (Fe)",
        "soillab-zn": "Zinc (Zn)",
        "soillab-om": "Organic Matter",
        "soillab-low": "Low",
        "soillab-medium": "Med",
        "soillab-high": "High",
        "soillab-crop-name": "Crop",
        "soillab-crop-match": "Match",
        "soillab-crop-fert": "Fertilizer Suggestion",
        "soillab-crop-rating": "Rating"
    },
    hi: {
        "schemes-subtitle": "शीर्ष सरकारी योजनाओं, सब्सिडी, फसल बीमा और क्रेडिट सुविधाओं का अन्वेषण करें। अपने खेत के स्थान के लिए व्यक्तिगत आवेदन मार्गदर्शन प्राप्त करने के लिए 'मेरी एआई पात्रता जांचें' पर क्लिक करें।",

        "schemes-title": "सरकारी कृषि योजनाएं और एआई सब्सिडी चेकर",

        "tab-schemes": "सरकारी योजनाएं और सब्सिडी",

        "profit-card-title": "अनुमानित उपज एवं आर्थिक राजस्व विवरण",

        "profit-section-title": "एआई उपज एवं बाजार लाभप्रदता अनुमानक",

        "btn-clear-key": "कुंजी हटाएं",

        "btn-save-key": "सहेजें और कनेक्ट करें",

        "label-gemini-key": "गूगल जेमिनी एपीआई कुंजी दर्ज करें:",

        "modal-ai-desc": "लाइव वास्तविक समय सहायता, त्वरित बीमारी निदान और अनुकूलित कृषि सलाह सक्षम करने के लिए गूगल जेमिनी 1.5 फ्लैश एआई कनेक्ट करें।",

        "modal-ai-title": "लाइव जेमिनी एआई कनेक्ट करें",

        "btn-ai-key": "जेमिनी एआई की",

        "planner-timeline-title": "वार्षिक फसल वृद्धि एवं बुआई समयरेखा",

        "planner-rotation-title": "मृदा नाइट्रोजन एवं कीट नियंत्रण फसल चक्र",

        "planner-calendar-title": "मौसमी बुआई कैलेंडर एवं फसल चक्र इंजन",

        "season-zaid": "जायद (गर्मी)",

        "season-rabi": "रबी (सर्दियां)",

        "season-kharif": "खरीफ (मानसून)",

        "season-all": "सभी मौसम",

        "tab-planner": "फसल कैलेंडर एवं चक्रण",

        "flower-booster-title": "पुष्प उत्पादन एवं फूल खिलने की सलाह",

        "seed-treatment-title": "बीज उपचार एवं अंकुरण देखभाल",

        "seed-flower-title": "बीज देखभाल, नर्सरी एवं पुष्प विशेषज्ञता",

        "pref-synthetic": "उच्च उपज वाणिज्यिक",

        "pref-organic": "100% जैविक एवं जैविक-इनपुट",

        "pref-balanced": "संतुलित (रासायनिक + जैविक)",

        "label-preference": "कृषि पद्धति वरीयता",

        "pest-safety-period": "कटाई सुरक्षा अवधि",

        "pest-water-vol": "स्प्रे पानी की मात्रा",

        "fert-zinc": "जिंक सल्फेट",

        "fert-mop": "एमओपी (60% K₂O)",

        "fert-dap": "डीएपी (18-46-0)",

        "fert-urea": "यूरिया (46% N)",

        "pest-card-title": "कीट नियंत्रण एवं पौध संरक्षण",

        "fert-card-title": "पोषक तत्व एवं उर्वरक आवश्यकताएं",

        "advisor-fert-pest-title": "फसल सुरक्षा और उर्वरक मात्रा सलाह",

        "area-helper": "उर्वरक और कीटनाशक की मात्रा की सटीक गणना करता है।",

        "label-area": "खेत का क्षेत्रफल (एकड़)",

        "logo-tagline": "एआई स्मार्ट सिंचाई सलाहकार",
        "units-celsius": "°C / मिमी",
        "units-fahrenheit": "°F / इंच",
        "config-title": "खेत सेटिंग्स",
        "config-desc": "अनुकूलित एआई सलाह प्राप्त करने के लिए अपने खेत के मापदंडों को परिभाषित करें।",
        "label-location": "स्थान / क्षेत्र",
        "label-soil": "मिट्टी की बनावट / प्रकार",
        "label-crop": "फसल का प्रकार",
        "label-stage": "विकास की अवस्था",
        "soil-helper": "मिट्टी का प्रकार क्षेत्र से स्वतः भर जाता है लेकिन इसे बदला जा सकता है।",
        "stage-germination": "प्रारंभिक / अंकुरण",
        "stage-vegetative": "फसल विकास / वानस्पतिक",
        "stage-flowering": "मध्य-मौसम / फूल आना",
        "stage-yield": "देर से मौसम / उपज गठन",
        "stage-ripening": "पकना / कटाई",
        "btn-generate": "सिंचाई योजना बनाएं",
        "tab-dashboard": "डैशबोर्ड",
        "tab-advisor": "एआई सलाहकार",
        "tab-weather": "मौसम स्टेशन",
        "tab-education": "कृषि गाइड",
        "dash-suitability-title": "विकास उपयुक्तता स्कोर",
        "suitability-pending": "उपयुक्तता",
        "suitability-alert-txt": "विश्लेषण करने के लिए सेटिंग्स जमा करें",
        "dash-weather-title": "वर्तमान मौसम की स्थिति",
        "weather-humidity": "आर्द्रता",
        "weather-precipitation": "बारिश की संभावना",
        "weather-wind": "हवा की गति",
        "weather-radiation": "सौर विकिरण",
        "dash-soil-title": "मिट्टी की विशेषताएं",
        "soil-water-retention": "जल धारण क्षमता",
        "soil-drainage": "जल निकासी की गति",
        "dash-diagnostic-title": "एआई फसल निदान",
        "diag-init-title": "प्रणाली तैयार है",
        "diag-init-desc": "अपनी अनुकूलित उपयुक्तता स्कोर और मौसम अंतर्दृष्टि उत्पन्न करने के लिए ऊपर \"सिंचाई योजना बनाएं\" पर क्लिक करें।",
        "console-title": "कृषि जाल एआई टर्मिनल",
        "console-ready-msg": "कृषि जाल एआई इंजन शुरू हो गया है। कमांड टाइप करें या जनरेट पर क्लिक करें...",
        "advisor-report-summary": "सिंचाई सिफारिश सारांश",
        "schedule-title": "7-दिवसीय सिंचाई कार्यक्रम",
        "table-day": "दिन / दिनांक",
        "table-temp": "तापमान",
        "table-rain": "अनुमानित बारिश",
        "table-soil-moisture": "मिट्टी की नमी",
        "table-water-needed": "आवश्यक जल गहराई",
        "table-action": "अनुशंसित कार्रवाई",
        "advisor-critical-tips": "महत्वपूर्ण कृषि चेतावनियां",
        "advisor-conservation-tips": "जल संरक्षण तकनीकें",
        "weather-station-live-title": "लाइव मौसम स्टेशन",
        "weather-feels-like": "महसूस होता है",
        "weather-pressure": "वायुमंडलीय दबाव",
        "weather-station-forecast-title": "7-दिवसीय मौसम पूर्वानुमान",
        "edu-crop-catalog": "फसल निर्देशिका",
        "edu-soil-catalog": "मिट्टी प्रोफाइल निर्देशिका",
        "footer-tagline": "कृषि जाल — कृषि जल प्रबंधन के लिए स्मार्ट एआई समाधान।",
        "footer-interview-notes": "स्मार्ट कृषि सिंचाई अनुसंधान एवं विकास prototype",
        "soil-clay": "चिकनी मिट्टी (Clay)",
        "soil-clay-loam": "चिकनी दोमट मिट्टी (Clay Loam)",
        "soil-loamy": "दोमट मिट्टी (Loam)",
        "soil-sandy": "रेतीली मिट्टी (Sandy)",
        "soil-silt": "गाद दोमट मिट्टी (Silt Loam)",
        "soil-black": "काली कपास मिट्टी (Black Soil)",
        "soil-red": "लाल मिट्टी (Red Soil)",
        "soil-alluvial": "जलोढ़ मिट्टी (Alluvial)",
        "soil-laterite": "लैटेराइट मिट्टी (Laterite)",
        "soil-peaty": "पीठयुक्त दलदली मिट्टी (Peaty)",
        "soil-saline": "लवणीय / क्षारीय मिट्टी (Saline)",
        "soil-chalky": "चूनेदार मिट्टी (Chalky)",
        "soil-clay-desc": "अत्यधिक उच्च जल धारण क्षमता वाली भारी चिकनी मिट्टी, लेकिन बहुत कम जल निकासी की गति। जलभराव के प्रति अत्यंत संवेदनशील। चावल जैसी बाढ़-फसलों के लिए आदर्श, लेकिन कंद-फसलों के लिए सावधानीपूर्वक जल निकासी की आवश्यकता होती है।",
        "soil-clay-loam-desc": "चिकनी मिट्टी, गाद और रेत का संतुलित मिश्रण। समृद्ध पोषक स्तर, उच्च जल धारण क्षमता और निष्पक्ष जल निकासी विशेषताएं। सामान्य कृषि के लिए अत्यधिक बहुमुखी।",
        "soil-loamy-desc": "आदर्श कृषि मिट्टी। जल निकासी और नमी प्रतिधारण का उत्कृष्ट संतुलन, जो जड़ों के श्वसन के लिए वायु अंतराल की अनुमति देता है। पोषक तत्वों से भरपूर और काम करने में आसान।",
        "soil-sandy-desc": "मोटे रेत के कण। न्यूनतम नमी धारण क्षमता के साथ उच्च जल रिसाव दर। पोषक तत्व जल्दी से बाहर निकल जाते हैं। लगातार, हल्की ड्रिप-सिंचाई और भारी जैविक मल्चिंग की आवश्यकता होती है।",
        "soil-silt-desc": "बारीक, चिकने कण जो नमी को अच्छी तरह बनाए रखते हैं लेकिन संकुचित हो सकते हैं। पोषक तत्वों को प्रभावी ढंग से रखता है। अनाज और कंद फसलों की एक विस्तृत श्रृंखला के लिए अच्छा है।",
        "soil-black-desc": "मिट्टी से भरपूर गहरी काली मिट्टी। उच्च सिकुड़न और दरार के लक्षण, उच्च नमी प्रतिधारण। कपास की खेती के लिए प्रसिद्ध ('काली कपास मिट्टी'), सतह के नीचे गहराई से नमी रखती है।",
        "soil-red-desc": "क्रिस्टलीय कायांतरित चट्टानों से निर्मित। उच्च लौह तत्व, छिद्रपूर्ण संरचना, उत्कृष्ट जल निकासी। प्राकृतिक रूप से कम जल धारण क्षमता, जैविक खाद और विनियमित पानी की आवश्यकता होती है।",
        "soil-alluvial-desc": "नदी नहरों द्वारा जमा की गई अत्यधिक उपजाऊ मिट्टी। पोटाश, फास्फोरिक एसिड और जैविक गाद से भरपूर। उत्कृष्ट नमी गुण, गेहूं, गन्ना और दालों के लिए उपयुक्त।",
        "soil-laterite-desc": "गर्म और आर्द्र उष्णकटिबंधीय क्षेत्रों में बनने वाली लोहा और एल्युमिनियम से भरपूर मिट्टी। अत्यधिक अपक्षयित, अम्लीय और तेजी से जल निकासी वाली। फॉस्फोरस उर्वरक और नियमित जैविक खाद की आवश्यकता होती है।",
        "soil-peaty-desc": "जलभराव वाले दलदली क्षेत्रों में बनने वाली जैविक तत्वों से भरपूर मिट्टी। बहुत उच्च जल धारण क्षमता लेकिन प्राकृतिक रूप से खराब जल निकासी वाली। उच्च अम्लता, जैविक पदार्थों से समृद्ध। नमी पसंद करने वाले विशेष पौधों के लिए सर्वोत्तम।",
        "soil-saline-desc": "खराब जल निकासी वाले शुष्क और अर्ध-शुष्क क्षेत्रों में पाई जाने वाली नमक से प्रभावित मिट्टी। फसलों द्वारा पानी के अवशोषण को बाधित करती है। जिप्सम उपचार और नमक-सहित फसलों की आवश्यकता होती है।",
        "soil-chalky-desc": "उच्च मात्रा में कैल्शियम कार्बोनेट (चूना) और पत्थरों वाली बहुत क्षारीय, उथली मिट्टी। अत्यधिक तेजी से जल निकासी होती है और जल्दी सूख जाती है। जैविक खाद और लौह सुधार की आवश्यकता होती है।",
        "crop-rice": "चावल / धान",
        "crop-wheat": "गेहूं",
        "crop-cotton": "कपास",
        "crop-maize": "मक्का",
        "crop-potato": "आलू",
        "crop-tomato": "टमाटर",
        "crop-groundnut": "मूंगफली",
        "crop-sugarcane": "गन्ना",
        "crop-soybean": "सोयाबीन",
        "crop-mustard": "सरसों",
        "crop-barley": "जौ",
        "crop-chickpea": "चना / छोले",
        "crop-sunflower": "सूरजमुखी",
        "crop-sorghum": "ज्वार (Sorghum)",
        "crop-marigold": "गेंदा फूल (Marigold)",
        "crop-rose": "गुलाब का फूल (Rose)",
        "crop-jasmine": "मोगरा / चमेली (Jasmine)",
        "crop-rice-desc": "धान एक जल-गहन उष्णकटिबंधीय अनाज है। यह ठहरे हुए पानी और गर्म, आर्द्र जलवायु में पनपता है, जिसके लिए चिकनी मिट्टी की आवश्यकता होती है जो पानी के निकास का विरोध करती है।",
        "crop-wheat-desc": "गेहूं एक शीतकालीन अनाज की फसल है। इसके लिए ठंडे बढ़ते मौसम और परिपक्वता पर गर्म मौसम की आवश्यकता होती है। अच्छी जल निकासी वाले दोमट और जलोढ़ गाद को प्राथमिकता देता है।",
        "crop-cotton-desc": "कपास एक गर्म मौसम की नकदी फसल है। गहरी काली कपास मिट्टी में पनपती है। प्रारंभिक चरणों में जलभराव के प्रति अत्यधिक संवेदनशील लेकिन बाद में सूखा-सहनशील।",
        "crop-maize-desc": "मक्का एक बहुमुखी अनाज है। खड़े पानी (जलभराव) के प्रति अत्यधिक संवेदनशील और इसके वानस्पतिक और फूल आने के चरणों में मध्यम, समान रूप से दूरी पर पानी की आवश्यकता होती है।",
        "crop-potato-desc": "आलू एक कंद की फसल है जिसके लिए ठंडे तापमान और रेतीली दोमट जैसी ढीली, हवादार मिट्टी की आवश्यकता होती है। भारी चिकनी मिट्टी के कारण जड़ें सड़ जाती हैं और कंद का आकार खराब हो जाता है।",
        "crop-tomato-desc": "टमाटर एक संवेदनशील गर्म मौसम की फसल है। लगातार, मध्यम नमी की आवश्यकता होती है। अत्यधिक पानी देने से फल फट जाते हैं और सड़न हो जाती है।",
        "crop-groundnut-desc": "मूंगफली एक फलीदार फसल है जो जमीन के नीचे पकती है। मूंगफली के अंकुर को मिट्टी में प्रवेश करने और आसानी से फली विकसित करने के लिए रेतीली दोमट की आवश्यकता होती है। उच्च जल निकासी महत्वपूर्ण है।",
        "crop-sugarcane-desc": "गन्ना एक लंबी अवधि की, अत्यधिक जल-गहन फसल है। उच्च जल धारण क्षमता वाली जलोढ़ और चिकनी मिट्टी पर पनपने के लिए मजबूत नमी की उपलब्धता की आवश्यकता होती है।",
        "crop-soybean-desc": "सोयाबीन एक प्रोटीन युक्त तिलहन है। फली भरने के दौरान सूखे के प्रति अत्यधिक संवेदनशील और जलभराव के प्रति संवेदनशील। दोमट मिट्टी पसंद करता है।",
        "crop-mustard-desc": "सरसों एक कठोर शीतकालीन तिलहन फसल है। कम से मध्यम पानी की आवश्यकता होती है, न्यूनतम पानी के साथ रेतीली दोमट और जलोढ़ मिट्टी में पनपती है।",
        "crop-barley-desc": "जौ एक सूखा-प्रतिरोधी ठंडे मौसम का अनाज है। गेहूं की तुलना में अधिक नमक-सहिष्णु, मध्यम पानी की जरूरतों के साथ हल्की रेतीली-दोमट मिट्टी में अच्छा प्रदर्शन करता है।",
        "crop-chickpea-desc": "चना एक शीतकालीन दलहन की फसल है। जलभराव के प्रति अत्यधिक संवेदनशील। अवशिष्ट मिट्टी की नमी का उपयोग करने में अत्यंत कुशल; बहुत कम सिंचाई की आवश्यकता होती है।",
        "crop-sunflower-desc": "सूरजमुखी एक अत्यधिक बहुमुखी तिलहन फूल की फसल है। गहरी मूसला जड़ों के साथ अत्यधिक सूखा-सहिष्णु, जिसके लिए अच्छी जल निकासी और धूप की आवश्यकता होती है।",
        "crop-sorghum-desc": "ज्वार एक अत्यधिक जलवायु-अनुकूल शुष्क भूमि की फसल है। इसके लिए न्यूनतम पानी की आवश्यकता होती है और यह उच्च तापमान में जीवित रह सकती है, भारी मिट्टी में अच्छा प्रदर्शन करती है।",
        "crop-marigold-desc": "गेंदा एक मजबूत, लोकप्रिय फूल वाला पौधा है जो कीट प्रबंधन, धार्मिक उपयोग और मालाओं के लिए उगाया जाता है। अत्यधिक अनुकूलनीय और उगाने में आसान।",
        "crop-rose-desc": "गुलाब एक प्रीमियम व्यावसायिक पुष्पकृषि फसल है। इसके लिए समृद्ध जैविक मिट्टी, लगातार मध्यम नमी और सावधानीपूर्वक छंटाई की आवश्यकता होती है।",
        "crop-jasmine-desc": "चमेली/मोगरा एक सुगंधित व्यावसायिक फूल वाली फसल है जिसका उपयोग इत्र और पारंपरिक मालाओं के लिए किया जाता है। गर्म, धूप वाले मौसम और अच्छी जल निकासी वाली मिट्टी में पनपती है।",
        "crop-rice-tips": "प्रारंभिक विकास के दौरान 5-8 सेमी पानी का स्तर बनाए रखें। पकने की अवस्था तक मिट्टी को पूरी तरह सूखने न दें।",
        "crop-wheat-tips": "क्राउन रूट इनिशिएशन (CRI) चरण (बुआई के 21-25 दिन बाद) और फूल आने के चरण के दौरान महत्वपूर्ण सिंचाई प्रदान करें।",
        "crop-cotton-tips": "फूल आने और डोड बनने के दौरान मिट्टी की नमी इष्टतम सुनिश्चित करें। जड़ों में ऑक्सीजन की कमी को रोकने के लिए बाढ़ सिंचाई से बचें।",
        "crop-maize-tips": "नरमंजर (Tasseling) और सिल्क निकलने के चरणों के दौरान पानी की कमी से बचें क्योंकि इससे उपज में भारी कमी आ सकती है।",
        "crop-potato-tips": "बार-बार लेकिन हल्की सिंचाई करें। कंदों को धूप से बचाने और उन्हें ठंडा रखने के लिए मिट्टी चढ़ाकर रखें।",
        "crop-tomato-tips": "फंगल रोगों से बचने के लिए पत्तियों के बजाय सीधे मिट्टी में पानी दें। फलों को फटने से बचाने के लिए लगातार नमी बनाए रखें।",
        "crop-groundnut-tips": "फूल आने और सुइयां (Pegging) बनने के चरणों के दौरान सिंचाई प्रदान करें। चिकनी मिट्टी से बचें जो सुइयों के प्रवेश को रोकती हैं।",
        "crop-sugarcane-tips": "गठन चरण (पहले 4 महीने) के दौरान महत्वपूर्ण सिंचाई की आवश्यकता होती है। नमी बनाए रखने के लिए सूखे पत्तों से मल्चिंग करें।",
        "crop-soybean-tips": "फली बनने और फली भरने के दौरान पर्याप्त नमी सुनिश्चित करें। बुआई के बाद मिट्टी की पपड़ी न बनने दें।",
        "crop-mustard-tips": "केवल 2 से 3 हल्की सिंचाइयों की आवश्यकता होती है: पहली फूल आने से पहले, दूसरी फली के विकास के चरण में।",
        "crop-barley-tips": "वानस्पतिक अवस्था में अधिक पानी न दें। जड़ों में हवा का संचार बनाए रखें। नाइट्रोजन के बहने से बचें।",
        "crop-chickpea-tips": "फूल आने पर पानी की कमी खतरनाक है, लेकिन अतिरिक्त पानी से वानस्पतिक वृद्धि अत्यधिक हो जाती है और फली की उपज शून्य होती है।",
        "crop-sunflower-tips": "गहरी जड़ों को प्रोत्साहित करने के लिए गहरा लेकिन कम बार पानी दें। फूलों की कली के सड़ने को रोकने के लिए ऊपर से पानी देने से बचें।",
        "crop-sorghum-tips": "यदि वर्षा अपर्याप्त हो, तो महत्वपूर्ण बूटिंग और अनाज भरने के चरणों के दौरान सिंचाई प्रदान करें।",
        "crop-marigold-tips": "अत्यधिक पानी देने से बचें जिससे जड़ें सड़ जाती हैं और फूलों की संख्या कम हो जाती है। झाड़ीदार विकास और अधिक कलियों को प्रोत्साहित करने के लिए विकास युक्तियों को जल्दी पिंच करें।",
        "crop-rose-tips": "सीधे जड़ों में पानी दें, काले धब्बों को रोकने के लिए पत्तियों को गीला करने से बचें। महीने में एक बार नाइट्रोजन और पोटाश से खाद दें।",
        "crop-jasmine-tips": "मुख्य फूल आने के मौसम (गर्मी/मानसून) के दौरान नियमित रूप से सिंचाई करें। नई लकड़ी और फूलों को प्रोत्साहित करने के लिए फूल आने के बाद छंटाई करें।",
        "crop-rice-cons": "पानी की 30% तक बचत करने के लिए लगातार बाढ़ के बजाय वैकल्पिक गीला और सूखा (AWD) तरीका लागू करें।",
        "crop-wheat-cons": "पानी को समान रूप से वितरित करने और वाष्पीकरण के नुकसान को कम करने के लिए स्प्रिंकलर सिंचाई प्रणालियों का उपयोग करें।",
        "crop-cotton-cons": "वाष्पीकरण को सीमित करने और पानी की दक्षता को अधिकतम करने के लिए काली मिट्टी के मल्च के नीचे ड्रिप सिंचाई का उपयोग करें।",
        "crop-maize-cons": "मेड़-और-नाली (Ridge-and-furrow) रोपण का अभ्यास करें। जड़ों के पास नमी केंद्रित करने के लिए केवल नालियों में पानी दें।",
        "crop-potato-cons": "90% तक जल अनुप्रयोग दक्षता प्राप्त करने के लिए प्लास्टिक मल्च के नीचे बिछाई गई ड्रिप नलियों का उपयोग करें।",
        "crop-tomato-cons": "मिट्टी की नमी को 40% अधिक बनाए रखने के लिए पौधों के आधार के आसपास जैविक मल्च (पुआल/नारियल की भूसी) लगाएं।",
        "crop-groundnut-cons": "मिट्टी को सख्त होने से बचाने के लिए फली बनने के दौरान स्प्रिंकलर सिंचाई से बचें। इसके बजाय ड्रिप टेप का उपयोग करें।",
        "crop-sugarcane-cons": "वाष्पीकरण को नाटकीय रूप से कम करने और खरपतवार के विकास को रोकने के लिए फसल की पंक्तियों के बीच कचरा-मल्चिंग (Trash-mulching) का उपयोग करें।",
        "crop-soybean-cons": "बिना जुताई वाली खेती खेत पर पिछली फसल के अवशेषों को रखती है, जिससे महत्वपूर्ण मिट्टी के पानी के भंडार सुरक्षित रहते हैं।",
        "crop-mustard-cons": "बाढ़ सिंचाई की तुलना में फूल आने के दौरान एक एकल माइक्रो-स्प्रिंकलर सत्र अत्यधिक जल-कुशल है।",
        "crop-barley-cons": "लेजर लैंड लेवलिंग का लाभ उठाएं ताकि पानी बिना किसी बर्बादी के पूरी तरह से वितरित हो सके।",
        "crop-chickpea-cons": "पानी के संरक्षण और कवक जनित जड़ सड़न को रोकने के लिए चौड़ी क्यारी प्रणालियों में नाली सिंचाई पर भरोसा करें।",
        "crop-sunflower-cons": "नालीदार बाढ़ सिंचाई की तुलना में पानी की 45% तक बचत करने के लिए सीधे पंक्तियों के साथ ड्रिप सिंचाई पाइपों का उपयोग करें।",
        "crop-sorghum-cons": "यदि गहरी जड़ वाले क्षेत्र में अवशिष्ट नमी हो, तो सिंचाई से बचने के लिए मिट्टी की नमी सेंसर का उपयोग करें।",
        "crop-marigold-cons": "नमी के वाष्पीकरण को रोकने और जड़ों को ठंडा रखने के लिए क्यारियों के आसपास हल्की सूखी घास (मल्चिंग) लगाएं।",
        "crop-rose-cons": "वाष्पीकरण के नुकसान को कम करने के लिए केवल सुबह जल्दी पानी देने के लिए टाइमर के साथ स्वचालित ड्रिप प्रणालियों का उपयोग करें।",
        "crop-jasmine-cons": "नमी को बनाए रखने के लिए झाड़ी के चारों ओर थाला (Basin) विधि से सिंचाई करें और घनी जैविक खाद का उपयोग करें।",
        "tab-soillab": "मिट्टी प्रयोगशाला",
        "soillab-title": "एआई मिट्टी विश्लेषण प्रयोगशाला",
        "soillab-subtitle": "एआई-संचालित लैब रिपोर्ट प्राप्त करने के लिए अपने मिट्टी के नमूने का वर्णन करें।",
        "soillab-color": "मिट्टी का रंग",
        "soillab-texture": "बनावट का अहसास",
        "soillab-moisture": "नमी का स्तर",
        "soillab-organic": "जैविक पदार्थ के संकेत",
        "soillab-ph": "पीएच स्ट्रिप रीडिंग",
        "soillab-area": "खेत का क्षेत्रफल (एकड़)",
        "btn-analyze-soil": "मिट्टी का नमूना विश्लेषण करें",
        "soillab-placeholder-title": "मिट्टी विश्लेषण रिपोर्ट",
        "soillab-placeholder-desc": "बाईं ओर अपने मिट्टी के नमूने की टिप्पणियां भरें और विस्तृत एआई लैब रिपोर्ट बनाने के लिए \"मिट्टी का नमूना विश्लेषण करें\" पर क्लिक करें।",
        "sl-color-dark": "गहरा काला / चारकोल",
        "sl-color-red": "लालिमा युक्त भूरा",
        "sl-color-light": "हल्का भूरा / तन",
        "sl-color-grey": "धूसर / राखी",
        "sl-color-yellow": "पीलापन लिए",
        "sl-tex-sticky": "चिपचिपी / चिकनी मिट्टी जैसी",
        "sl-tex-smooth": "चिकनी / रेशमी (गाद)",
        "sl-tex-gritty": "दानेदार / रेतीली",
        "sl-tex-crumbly": "भुरभुरी / दोमट",
        "sl-moist-waterlogged": "जलभराव / संतृप्त",
        "sl-moist-moist": "नम / गीली",
        "sl-moist-dry": "सूखी",
        "sl-moist-verydry": "बहुत सूखी / दरारें",
        "sl-org-worms": "केंचुए",
        "sl-org-decayed": "सड़ी पत्तियां",
        "sl-org-roots": "जड़ के टुकड़े",
        "sl-org-fungal": "कवक वृद्धि",
        "soillab-hero-title": "एआई मिट्टी स्वास्थ्य रिपोर्ट",
        "soillab-hero-subtitle": "दृश्य और स्पर्श मिट्टी अवलोकनों से उत्पन्न",
        "soillab-health-label": "मिट्टी का स्वास्थ्य",
        "soillab-nutrient-title": "अनुमानित पोषक तत्व प्रोफ़ाइल",
        "soillab-ph-title": "पीएच विश्लेषण और अम्लता प्रोफ़ाइल",
        "soillab-crop-title": "फसल अनुकूलता रैंकिंग",
        "soillab-amend-title": "मिट्टी सुधार सिफारिशें",
        "soillab-n": "नाइट्रोजन (N)",
        "soillab-p": "फॉस्फोरस (P)",
        "soillab-k": "पोटेशियम (K)",
        "soillab-fe": "लोहा (Fe)",
        "soillab-zn": "जस्ता (Zn)",
        "soillab-om": "जैविक पदार्थ",
        "soillab-low": "कम",
        "soillab-medium": "मध्यम",
        "soillab-high": "उच्च",
        "soillab-crop-name": "Crop",
        "soillab-crop-match": "Match",
        "soillab-crop-fert": "Fertilizer Suggestion",
        "soillab-crop-rating": "Rating"
    },
    es: {
        "logo-tagline": "Asesor de Riego Inteligente IA",
        "units-celsius": "°C / mm",
        "units-fahrenheit": "°F / pulgadas",
        "config-title": "Configuración del Campo",
        "config-desc": "Defina los parámetros de su campo para obtener consejos personalizados de IA.",
        "label-location": "Ubicación / Región",
        "label-soil": "Textura / Tipo de Suelo",
        "label-crop": "Tipo de Cultivo",
        "label-stage": "Etapa de Crecimiento",
        "soil-helper": "El suelo se completa automáticamente según la región, pero se puede modificar.",
        "stage-germination": "Inicial / Germinación",
        "stage-vegetative": "Desarrollo / Vegetativo",
        "stage-flowering": "Media Estación / Floración",
        "stage-yield": "Fin de Estación / Formación de Rendimiento",
        "stage-ripening": "Maduración / Cosecha",
        "btn-generate": "Generar Plan de Riego",
        "tab-dashboard": "Panel de Control",
        "tab-advisor": "Asesor IA",
        "tab-weather": "Estación Meteorológica",
        "tab-education": "Guía Agrícola",
        "dash-suitability-title": "Puntuación de Idoneidad de Crecimiento",
        "suitability-pending": "Idoneidad",
        "suitability-alert-txt": "Envíe la configuración para analizar",
        "dash-weather-title": "Condiciones Meteorológicas Actuales",
        "weather-humidity": "Humedad",
        "weather-precipitation": "Probabilidad de Lluvia",
        "weather-wind": "Velocidad del Viento",
        "weather-radiation": "Índice UV",
        "dash-soil-title": "Retención y Propiedades del Suelo",
        "soil-water-retention": "Retención de Agua",
        "soil-drainage": "Velocidad de Drenaje",
        "dash-diagnostic-title": "Diagnóstico de Idoneidad de Crecimiento",
        "diag-init-title": "Esperando Datos de Entrada",
        "diag-init-desc": "Por favor elija su Región, Tipo de Suelo y Cultivo en el panel de Configuración y haga clic en \"Generar Plan de Riego\" para iniciar el análisis.",
        "console-title": "Asesor Agrícola Gemini 3.5 Flash",
        "console-ready-msg": "> Listo para la generación de parámetros de entrada...",
        "advisor-report-summary": "Receta de Riego IA",
        "schedule-title": "Calendario de Riego Recomendado de 5 Días",
        "table-day": "Día / Fecha",
        "table-temp": "Temp (Mín/Máx)",
        "table-rain": "Lluvia Prevista",
        "table-soil-moisture": "Déficit de Humedad del Suelo",
        "table-water-needed": "Lámina de Riego",
        "table-action": "Acción y Mejor Momento",
        "advisor-critical-tips": "Consejos Críticos para el Cuidado del Cultivo",
        "advisor-conservation-tips": "Acciones de Conservación de Agua",
        "weather-station-live-title": "Monitor Meteorológico Dinámico",
        "weather-feels-like": "Sensación Térmica",
        "weather-pressure": "Presión",
        "weather-station-forecast-title": "Pronóstico Meteorológico de 5 Días",
        "edu-crop-catalog": "Perfiles Agrícolas de Cultivos",
        "edu-soil-catalog": "Guía de Características del Suelo",
        "footer-tagline": "Empoderando a los agricultores con inteligencia agronómica inteligente.",
        "footer-interview-notes": "Creado para demostraciones de IA agrícola en entrevistas. Desarrollado por Open-Meteo y Gemini-Core.",

        "soil-clay": "Suelo Arcilloso Pesado",
        "soil-clay-loam": "Franco Arcilloso",
        "soil-loamy": "Franco Medio",
        "soil-sandy": "Suelo Arenoso/Desértico",
        "soil-silt": "Suelo Limoso",
        "soil-black": "Suelo Negro de Algodón",
        "soil-red": "Franco Arenoso Rojo",
        "soil-alluvial": "Franco Limoso Aluvial",

        "soil-clay-desc": "Suelo arcilloso pesado con retención de agua excepcionalmente alta, pero velocidad de drenaje muy baja. Extremadamente susceptible al encharcamiento. Ideal para cultivos inundados como el Arroz, pero requiere un drenaje cuidadoso para raíces.",
        "soil-clay-loam-desc": "Mezcla equilibrada de arcilla, limo y arena. Niveles ricos en nutrientes, alta capacidad de retención de agua y características de drenaje aceptables. Muy versátil para la agricultura en general.",
        "soil-loamy-desc": "El suelo agrícola ideal. Excelente equilibrio entre drenaje y retención de humedad, permitiendo bolsas de aire para la respiración de las raíces. Rico en nutrientes y fácil de trabajar.",
        "soil-sandy-desc": "Partículas de arena gruesa. Alta tasa de filtración de agua con mínima capacidad de retención de humedad. Los nutrientes se lixivian rápidamente. Requiere riego por goteo frecuente y ligero y un acolchado orgánico denso.",
        "soil-silt-desc": "Partículas finas y suaves que retienen bien la humedad pero pueden compactarse. Retiene los nutrientes de manera efectiva. Bueno para una amplia gama de cereales y tubérculos.",
        "soil-black-desc": "Vertisol negro profundo rico en arcilla. Altas características de expansión y agrietamiento, alta retención de humedad. Famoso para el cultivo de algodón, retiene la humedad a gran profundidad bajo la superficie.",
        "soil-red-desc": "Formado a partir de rocas metamórficas cristalinas. Alto contenido de hierro, estructura porosa, excelente drenaje. Naturalmente bajo en retención de agua, requiere fertilizantes orgánicos y riego regulado.",
        "soil-alluvial-desc": "Suelo altamente fértil depositado por cauces fluviales. Rico en potasa, ácido fosfórico y limo orgánico. Excelentes propiedades de humedad, apto para trigo, caña de azúcar y legumbres.",

        "crop-rice": "Arroz / Paddy",
        "crop-wheat": "Trigo",
        "crop-cotton": "Algodón",
        "crop-maize": "Maíz",
        "crop-potato": "Patata / Papa",
        "crop-tomato": "Tomate",
        "crop-groundnut": "Maní / Cacahuete",
        "crop-sugarcane": "Caña de Azúcar",
        "crop-soybean": "Soja / Soya",
        "crop-mustard": "Mostaza",
        "crop-barley": "Cebada",
        "crop-chickpea": "Garbanzo",

        "crop-rice-desc": "El arroz es un cereal tropical de uso intensivo de agua. Prospera en agua estancada y climas cálidos y húmedos, requiriendo suelos arcillosos que resistan el drenaje de agua.",
        "crop-wheat-desc": "El trigo es un cereal de invierno. Requiere una temporada de crecimiento fresca y clima cálido en la madurez. Prefiere suelos francos bien drenados y limo aluvial.",
        "crop-cotton-desc": "El algodón es un cultivo comercial de estación cálida. Prospera en suelos negros profundos de algodón. Muy vulnerable al encharcamiento al principio, pero tolerante a la sequía más tarde.",
        "crop-maize-desc": "El maíz es un cereal versátil. Altamente sensible al agua estancada (encharcamiento) y requiere un riego moderado y espaciado uniformemente durante sus fases vegetativa y de floración.",
        "crop-potato-desc": "La patata es un cultivo de tubérculo que requiere temperaturas frescas y suelos sueltos y aireados como los francos arenosos. El suelo arcilloso pesado causa pudrición de la raíz.",
        "crop-tomato-desc": "El tomate es un cultivo sensible de la familia de las solanáceas. Requiere humedad constante y moderada. El riego excesivo provoca el agrietamiento de los frutos.",
        "crop-groundnut-desc": "El maní es una leguminosa que madura bajo tierra. Requiere suelos francos arenosos para permitir que la estructura penetre en el suelo y desarrolle vainas fácilmente. El drenaje alto es crítico.",
        "crop-sugarcane-desc": "La caña de azúcar es un cultivo de ciclo largo y muy intensivo en agua. Requiere una alta disponibilidad de humedad, prosperando en suelos aluviales y arcillosos.",
        "crop-soybean-desc": "La soja es una semilla oleaginosa rica en proteínas. Altamente sensible a la sequía durante el llenado de vainas y sensible al encharcamiento. Prefiere suelos francos.",
        "crop-mustard-desc": "La mostaza es un cultivo oleaginoso rústico de invierno. Requisito de agua bajo a moderado, prospera en suelos francos arenosos y aluviales con un riego mínimo.",
        "crop-barley-desc": "La cebada es un cereal de estación fría resistente a la sequía. Más tolerante a la sal que el trigo, funciona bien en suelos francos arenosos ligeros con necesidades hídricas moderadas.",
        "crop-chickpea-desc": "El garbanzo es una legumbre de invierno. Altamente sensible al encharcamiento. Extremadamente eficiente en el uso de la humedad residual del suelo; requiere muy poco riego.",

        "crop-rice-tips": "Mantenga un nivel de agua estancada de 5-8 cm durante el crecimiento temprano. Evite que el suelo se seque por completo hasta la etapa de maduración.",
        "crop-wheat-tips": "Proporcione riego crítico durante la etapa de Iniciación de Raíces Coronarias (CRI) (21-25 días después de la siembra) y durante la floración.",
        "crop-cotton-tips": "Asegure una humedad óptima del suelo durante la floración y formación de cápsulas. Evite el riego por inundación para prevenir hipoxia radicular.",
        "crop-maize-tips": "Evite el estrés hídrico durante las etapas de floración masculina y femenina (tassel y silk), ya que puede provocar una gran reducción del rendimiento.",
        "crop-potato-tips": "Riegue con frecuencia pero a la ligera. Mantenga la tierra aporcada para proteger los tubérculos de la luz solar y mantenerlos frescos.",
        "crop-tomato-tips": "Riegue el suelo directamente, no las hojas, para prevenir tizones fúngicos. Mantenga una humedad constante para evitar el agrietamiento.",
        "crop-groundnut-tips": "Proporcione riego durante las etapas de floración y clavado (pegging). Evite suelos arcillosos que restrinjan la penetración de los clavos.",
        "crop-sugarcane-tips": "Riego crítico requerido durante la fase formativa (primeros 4 meses). Acolche con hojas secas para retener la humedad.",
        "crop-soybean-tips": "Asegure una humedad adecuada durante el establecimiento y llenado de vainas. No permita que el suelo forme costras después de la siembra.",
        "crop-mustard-tips": "Necesita solo de 2 a 3 riegos ligeros: primero en la etapa de prefloración, segundo en la etapa de desarrollo de la vaina.",
        "crop-barley-tips": "No riegue en exceso durante las etapas vegetativas. Mantenga las raíces aireadas. Evite la lixiviación de nitrógeno.",
        "crop-chickpea-tips": "El estrés hídrico en la floración es peligroso, pero el exceso de agua causa un crecimiento vegetativo excesivo y un rendimiento de vainas nulo.",

        "crop-rice-cons": "Implemente el Secado y Mojado Alternado (AWD) en lugar de la inundación continua para ahorrar hasta un 30% de agua.",
        "crop-wheat-cons": "Use sistemas de riego por aspersión para distribuir el agua de manera uniforme y reducir la pérdida por evaporación.",
        "crop-cotton-cons": "Emplee riego por goteo debajo de mantillo de suelo negro para limitar la evaporación y maximizar la eficiencia del agua.",
        "crop-maize-cons": "Practique la siembra en lomos y surcos. Aplique agua solo en los surcos para concentrar la humedad cerca de las raíces.",
        "crop-potato-cons": "Use cintas de goteo colocadas bajo acolchado plástico para lograr hasta un 90% de eficiencia en la aplicación de agua.",
        "crop-tomato-cons": "Aplique mantillo orgánico (paja/fibra de coco) alrededor de las bases de las plantas para retener un 40% más de humedad en el suelo.",
        "crop-groundnut-cons": "Evite el riego por aspersión durante la formación de vainas para prevenir costras en el suelo. Use cintas de goteo en su lugar.",
        "crop-sugarcane-cons": "Utilice el acolchado de residuos entre las hileras de cultivo para reducir drásticamente la evaporación y evitar las malezas.",
        "crop-soybean-cons": "La siembra directa mantiene los residuos del cultivo anterior en el campo, preservando las reservas vitales de agua del suelo.",
        "crop-mustard-cons": "Una sola sesión de microaspersión durante la floración es muy eficiente en el uso del agua en comparación con la inundación.",
        "crop-barley-cons": "Aproveche la nivelación láser de tierras para garantizar que el agua se distribuya perfectamente sin pérdidas por escorrentía.",
        "crop-chickpea-cons": "Confíe en el riego por surcos en sistemas de camas anchas para conservar agua y prevenir la podredumbre del cuello por hongos."
    },
    // Adding Telugu, Tamil, Marathi, Bengali, French, Punjabi translations...
    // Let's implement full fallback to English if keys are missing but let's write high-quality basic objects for all languages
    fr: {
        "schemes-subtitle": "Explorez les principaux programmes gouvernementaux, subventions, assurances récoltes et facilités de crédit.",

        "schemes-title": "Programmes Agricoles Gouvernementaux et Vérificateur de Subventions IA",

        "tab-schemes": "Programmes et Subventions Gouv.",

        "btn-analyze-soil": "Analyze Soil Sample",
        "crop-jasmine": "Jasmine Flower (Mogra)",
        "crop-jasmine-cons": "Practice basin method watering and thick organic composting around the shrub to preserve moisture.",
        "crop-jasmine-desc": "Jasmine is an aromatic commercial flowering crop widely used for perfumes and traditional garlands. Thrives in warm, sunny weather and well-drained soils.",
        "crop-jasmine-tips": "Irrigate regularly during the main flowering season (summer/monsoon). Prune after flowering to encourage new wood and blooms.",
        "crop-marigold": "Marigold Flower",
        "crop-marigold-cons": "Apply light straw mulching around beds to prevent moisture evaporation and keep roots cool.",
        "crop-marigold-desc": "Marigold is a robust, popular flowering plant grown for pest management, ritual use, and garlands. Extremely adaptive and easy to grow.",
        "crop-marigold-tips": "Avoid overwatering which causes root rot and reduces flower count. Pinch growing tips early to encourage bushy growth and more buds.",
        "crop-rose": "Rose Flower",
        "crop-rose-cons": "Utilize automated drip systems with timers to water only in early mornings to minimize evaporation loss.",
        "crop-rose-desc": "Rose is a premium commercial floriculture crop. Demands rich organic soil, consistent moderate moisture, and careful pruning.",
        "crop-rose-tips": "Water the root zone directly, avoid wetting leaves to prevent black spots. Fertilize monthly with nitrogen and potash.",
        "crop-sorghum": "Sorghum (Jowar)",
        "crop-sorghum-cons": "Use soil moisture sensors to avoid irrigation if deep root zone has residual humidity.",
        "crop-sorghum-desc": "Sorghum is a highly climate-resilient dryland crop. Requires minimal water and survives high temperatures, performing well in heavy soils.",
        "crop-sorghum-tips": "Provide irrigation during critical boot and grain-filling stages if rainfall is insufficient.",
        "crop-sunflower": "Sunflower",
        "crop-sunflower-cons": "Employ drip irrigation lines directly along rows to conserve up to 45% water compared to furrow flooding.",
        "crop-sunflower-desc": "Sunflower is a highly versatile oilseed flower crop. Highly drought-tolerant with deep taproots, requiring good drainage and sunlight.",
        "crop-sunflower-tips": "Water deeply but infrequently to encourage deep rooting. Avoid overhead watering to prevent flower bud rot.",
        "sl-color-dark": "Dark Black / Charcoal",
        "sl-color-grey": "Grey / Ashy",
        "sl-color-light": "Light Brown / Tan",
        "sl-color-red": "Reddish Brown",
        "sl-color-yellow": "Yellowish",
        "sl-moist-dry": "Dry",
        "sl-moist-moist": "Moist / Damp",
        "sl-moist-verydry": "Very Dry / Cracked",
        "sl-moist-waterlogged": "Waterlogged / Saturated",
        "sl-org-decayed": "Decayed Leaves",
        "sl-org-fungal": "Fungal Growth",
        "sl-org-roots": "Root Fragments",
        "sl-org-worms": "Earthworms",
        "sl-tex-crumbly": "Crumbly / Loamy",
        "sl-tex-gritty": "Gritty / Sandy",
        "sl-tex-smooth": "Smooth / Silky (Silt)",
        "sl-tex-sticky": "Sticky / Clay-like",
        "soil-chalky": "Chalky/Lime Soil",
        "soil-chalky-desc": "Very alkaline, shallow soil containing a high proportion of calcium carbonate (lime) and stones. Drains extremely fast and dries out easily. Requires organic matter and iron amendments.",
        "soil-laterite": "Laterite Soil",
        "soil-laterite-desc": "Iron and aluminum-rich soil formed in hot, wet tropical areas. Highly weathered, acidic, and drains quickly. Requires phosphorus fertilization and regular organic manure addition.",
        "soil-peaty": "Peaty/Marshy Soil",
        "soil-peaty-desc": "Organic-rich soil formed in waterlogged marshy areas. Very high water retention but naturally poorly drained. High acidity, rich in organic matter. Best for specialized moisture-loving plants.",
        "soil-saline": "Saline-Alkaline Soil",
        "soil-saline-desc": "Salt-affected soil common in arid and semi-arid regions with poor drainage. Restricts water absorption by crops. Requires gypsum washing and salt-tolerant cropping patterns.",
        "soillab-amend-title": "Soil Improvement Recommendations",
        "soillab-area": "Field Area (acres)",
        "soillab-color": "Soil Color",
        "soillab-crop-fert": "Fertilizer Suggestion",
        "soillab-crop-match": "Match",
        "soillab-crop-name": "Crop",
        "soillab-crop-rating": "Rating",
        "soillab-crop-title": "Crop Compatibility Rankings",
        "soillab-fe": "Iron (Fe)",
        "soillab-health-label": "SOIL HEALTH",
        "soillab-hero-subtitle": "Generated from visual & tactile soil observations",
        "soillab-hero-title": "AI Soil Health Report",
        "soillab-high": "High",
        "soillab-k": "Potassium (K)",
        "soillab-low": "Low",
        "soillab-medium": "Med",
        "soillab-moisture": "Moisture Level",
        "soillab-n": "Nitrogen (N)",
        "soillab-nutrient-title": "Estimated Nutrient Profile",
        "soillab-om": "Organic Matter",
        "soillab-organic": "Organic Matter Signs",
        "soillab-p": "Phosphorus (P)",
        "soillab-ph": "pH Strip Reading",
        "soillab-ph-title": "pH Analysis & Acidity Profile",
        "soillab-placeholder-desc": "Fill in your soil sample observations on the left and click Analyze Soil.",
        "soillab-placeholder-title": "Soil Analysis Report",
        "soillab-subtitle": "Describe your soil sample to get an AI-powered lab report.",
        "soillab-texture": "Texture Feel",
        "soillab-title": "AI Soil Analysis Lab",
        "soillab-zn": "Zinc (Zn)",
        "tab-soillab": "Soil Lab",
        "profit-card-title": "Répartition Estimée du Rendement et des Revenus",

        "profit-section-title": "Estimateur de Rendement et Rentabilité IA",

        "btn-clear-key": "Effacer la Clé",

        "btn-save-key": "Enregistrer et Connecter",

        "label-gemini-key": "Entrez la Clé API Gemini:",

        "modal-ai-desc": "Connectez Gemini 1.5 Flash IA pour une assistance conversationnelle en temps réel, un diagnostic rapide et des conseils personnalisés.",

        "modal-ai-title": "Connecter Gemini IA en Direct",

        "btn-ai-key": "Clé Gemini IA",

        "planner-timeline-title": "Chronologie Annuelle de Croissance et de Semis",

        "planner-rotation-title": "Séquence de Rotation pour l'Azote et la Lutte Antiparasitaire",

        "planner-calendar-title": "Calendrier Agricole et Moteur de Rotation des Cultures",

        "season-zaid": "Zaid (Été)",

        "season-rabi": "Rabi (Hiver)",

        "season-kharif": "Kharif (Mousson)",

        "season-all": "Toutes les Saisons",

        "tab-planner": "Calendrier & Rotation",

        "flower-booster-title": "Floriculture et Stimulation de Floraison",

        "seed-treatment-title": "Traitement des Semences et Germination",

        "seed-flower-title": "Soin des Semences, Pépinière et Floriculture",

        "pref-synthetic": "Commercial à Haut Rendement",

        "pref-organic": "100% Biologique et Bio-Intrants",

        "pref-balanced": "Équilibré (Chimique + Bio)",

        "label-preference": "Préférence de Pratique Agricole",

        "pest-safety-period": "Sécurité Avant Récolte",

        "pest-water-vol": "Eau de Dilution",

        "fert-zinc": "Sulfate de Zinc",

        "fert-mop": "MOP (60% K₂O)",

        "fert-dap": "DAP (18-46-0)",

        "fert-urea": "Urée (46% N)",

        "pest-card-title": "Lutte contre les Ravageurs et Protection",

        "fert-card-title": "Besoins en Nutriments et Engrais",

        "advisor-fert-pest-title": "Protection des Cultures et Dosages d'Engrais",

        "area-helper": "Calcule avec précision les doses d'engrais et de pesticides.",

        "label-area": "Superficie de la Ferme (Acres)",

        "logo-tagline": "Conseiller en Irrigation Intelligent IA",
        "units-celsius": "°C / mm",
        "units-fahrenheit": "°F / pouces",
        "config-title": "Paramètres de la Ferme",
        "config-desc": "Définissez les paramètres de votre champ pour obtenir des conseils IA personnalisés.",
        "label-location": "Emplacement / Région",
        "label-soil": "Texture / Type de Sol",
        "label-crop": "Type de Culture",
        "label-stage": "Stade de Croissance",
        "soil-helper": "Le sol se remplit automatiquement selon la région mais peut être modifié.",
        "stage-germination": "Initial / Germination",
        "stage-vegetative": "Développement / Végétatif",
        "stage-flowering": "Mi-saison / Floraison",
        "stage-yield": "Fin de saison / Formation du rendement",
        "stage-ripening": "Maturation / Récolte",
        "btn-generate": "Générer le Plan d'Irrigation",
        "tab-dashboard": "Tableau de Bord",
        "tab-advisor": "Conseiller IA",
        "tab-weather": "Station Météo",
        "tab-education": "Guide Agri",
        "dash-suitability-title": "Score d'Aptitude à la Croissance",
        "suitability-pending": "Aptitude",
        "suitability-alert-txt": "Soumettre la configuration pour analyser",
        "dash-weather-title": "Conditions Météo Actuelles",
        "weather-humidity": "Humidité",
        "weather-precipitation": "Probabilité de Pluie",
        "weather-wind": "Vitesse du Vent",
        "weather-radiation": "Indice UV",
        "dash-soil-title": "Rétention et Propriétés du Sol",
        "soil-water-retention": "Rétention d'Eau",
        "soil-drainage": "Vitesse de Drainage",
        "dash-diagnostic-title": "Diagnostics d'Aptitude de Croissance",
        "diag-init-title": "En attente des données d'entrée",
        "diag-init-desc": "Veuillez choisir votre région, votre type de sol et votre culture dans le panneau Paramètres et cliquez sur \"Générer le Plan d'Irrigation\" pour lancer l'analyse.",
        "console-title": "Conseiller Agricole Gemini 3.5 Flash",
        "console-ready-msg": "> Prêt pour la génération des paramètres d'entrée...",
        "advisor-report-summary": "Ordonnance d'Irrigation IA",
        "schedule-title": "Calendrier d'Irrigation Recommandé sur 7 Jours",
        "table-day": "Jour / Date",
        "table-temp": "Temp (Min/Max)",
        "table-rain": "Pluie Prévue",
        "table-soil-moisture": "Déficit d'Humidité du Sol",
        "table-water-needed": "Hauteur d'Irrigation",
        "table-action": "Action & Meilleur Moment",
        "advisor-critical-tips": "Conseils Critiques sur les Cultures",
        "advisor-conservation-tips": "Actions de Conservation de l'Eau",
        "weather-station-live-title": "Moniteur Météo Dynamique",
        "weather-feels-like": "Température Ressentie",
        "weather-pressure": "Pression",
        "weather-station-forecast-title": "Prévisions Météorologiques à 7 Jours",
        "edu-crop-catalog": "Profils Agricoles des Cultures",
        "edu-soil-catalog": "Guide des Caractéristiques du Sol",
        "footer-tagline": "Autonomiser les agriculteurs grâce à une intelligence agronomique intelligente.",
        "footer-interview-notes": "Conçu pour les démonstrations d'IA agricole en entretien. Alimenté par Open-Meteo & Gemini-Core.",

        "soil-clay": "Sol Argileux Lourd",
        "soil-clay-loam": "Loam Argileux",
        "soil-loamy": "Loam Moyen",
        "soil-sandy": "Sol Sablonneux/Désertique",
        "soil-silt": "Sol Limoneux",
        "soil-black": "Sol Noir de Coton",
        "soil-red": "Loam Sablonneux Rouge",
        "soil-alluvial": "Loam Limoneux Alluvial",
        "soil-clay-desc": "Sol argileux lourd avec une rétention d'eau exceptionnellement élevée, mais une vitesse de drainage très faible. Très sensible à l'asphyxie des racines. Idéal pour le riz, mais nécessite un drainage pour les autres.",
        "soil-clay-loam-desc": "Mélange équilibré d'argile, de limon et de sable. Riche en nutriments, bonne rétention d'eau et drainage correct. Très polyvalent.",
        "soil-loamy-desc": "Le sol agricole idéal. Excellent équilibre entre drainage et rétention d'eau. Riche en nutriments et facile à cultiver.",
        "soil-sandy-desc": "Sable grossier. Taux d'infiltration élevé avec une rétention d'humidité minimale. Nécessite une irrigation goutte-à-goutte fréquente et légère.",
        "soil-silt-desc": "Particules fines qui retiennent bien l'humidité mais peuvent se compacter. Bon pour les céréales et les tubercules.",
        "soil-black-desc": "Vertisol noir riche en argile. Forte rétention d'humidité, idéal pour la culture du coton.",
        "soil-red-desc": "Sol poreux avec un excellent drainage. Faible rétention d'eau naturelle, nécessite des apports organiques réguliers.",
        "soil-alluvial-desc": "Sol très fertile déposé par les rivières. Idéal pour le blé, la canne à sucre et les légumineuses.",

        "crop-rice": "Riz / Paddy",
        "crop-wheat": "Blé",
        "crop-cotton": "Coton",
        "crop-maize": "Maïs",
        "crop-potato": "Pomme de Terre",
        "crop-tomato": "Tomate",
        "crop-groundnut": "Arachide",
        "crop-sugarcane": "Canne à Sucre",
        "crop-soybean": "Soja",
        "crop-mustard": "Moutarde",
        "crop-barley": "Orge",
        "crop-chickpea": "Pois Chiche",

        "crop-rice-desc": "Le riz est une céréale tropicale très consommatrice d'eau. Il prospère dans l'eau stagnante et nécessite des sols argileux.",
        "crop-wheat-desc": "Le blé est une céréale d'hiver nécessitant une saison de croissance fraîche et un sol bien drainé.",
        "crop-cotton-desc": "Le coton est une culture de saison chaude. Sensible à l'engorgement au début, résistant à la sécheresse ensuite.",
        "crop-maize-desc": "Le maïs nécessite un arrosage régulier et modéré, en évitant absolument l'eau stagnante.",
        "crop-potato-desc": "La pomme de terre exige un sol meuble et aéré comme un loam sableux pour éviter la pourriture.",
        "crop-tomato-desc": "La tomate nécessite une humidité constante. Un arrosage irrégulier provoque l'éclatement des fruits.",
        "crop-groundnut-desc": "L'arachide pousse sous terre. Nécessite un sol sablonneux léger pour que les gousses se développent.",
        "crop-sugarcane-desc": "La canne à sucre est une culture à long cycle, très gourmande en eau sur des sols riches.",
        "crop-soybean-desc": "Le soja est sensible à la sécheresse lors du remplissage des gousses. Préfère les sols loameux.",
        "crop-mustard-desc": "La moutarde est une culture d'hiver rustique avec de faibles besoins en eau.",
        "crop-barley-desc": "L'orge est une céréale de saison fraîche résistante à la sécheresse.",
        "crop-chickpea-desc": "Le pois chiche est une légumineuse d'hiver très économe en eau, redoutant l'engorgement.",

        "crop-rice-tips": "Maintenir un niveau d'eau stagnante de 5-8 cm au début de la croissance. Ne pas assécher avant la maturité.",
        "crop-wheat-tips": "Irrigation essentielle lors du stade d'initiation des racines coronaires (21-25 jours après le semis).",
        "crop-cotton-tips": "Humidité optimale pendant la floraison. Éviter l'inondation pour ne pas asphyxier les racines.",
        "crop-maize-tips": "Éviter le stress hydrique pendant la floraison mâle et femelle pour préserver le rendement.",
        "crop-potato-tips": "Arroser fréquemment mais légèrement. Butter la terre pour garder les tubercules au frais.",
        "crop-tomato-tips": "Arroser directement le sol et non les feuilles pour prévenir les maladies fongiques.",
        "crop-groundnut-tips": "Irriguer pendant la floraison. Éviter les sols argileux lourds.",
        "crop-sugarcane-tips": "Arrosage critique pendant les 4 premiers mois. Pailler pour limiter l'évaporation.",
        "crop-soybean-tips": "Garantir une humidité constante lors de la formation des gousses.",
        "crop-mustard-tips": "Nécessite seulement 2 à 3 arrosages légers au cours de son cycle.",
        "crop-barley-tips": "Ne pas sur-irriguer. Favoriser une bonne aération des racines.",
        "crop-chickpea-tips": "Un manque d'eau à la floraison nuit au rendement, mais l'excès d'eau empêche la formation de gousses.",

        "crop-rice-cons": "Pratiquer l'alternance d'assèchement et d'inondation (AWD) pour économiser 30% d'eau.",
        "crop-wheat-cons": "Utiliser l'irrigation par aspersion pour limiter les pertes par évaporation.",
        "crop-cotton-cons": "Installer un goutte-à-goutte sous paillage pour maximiser l'efficacité de l'arrosage.",
        "crop-maize-cons": "Planter en billons et irriguer uniquement les sillons.",
        "crop-potato-cons": "Utiliser des gaines goutte-à-goutte sous bâche plastique (90% d'efficacité).",
        "crop-tomato-cons": "Appliquer un paillage organique pour conserver 40% d'humidité en plus dans le sol.",
        "crop-groundnut-cons": "Utiliser le goutte-à-goutte plutôt que l'aspersion pour éviter de tasser le sol.",
        "crop-sugarcane-cons": "Pailler avec les résidus de canne entre les rangs pour limiter l'évaporation.",
        "crop-soybean-cons": "Le semis direct sans labour conserve les réserves en eau du sol.",
        "crop-mustard-cons": "Une micro-aspersion ciblée est bien plus économe que l'irrigation gravitaire.",
        "crop-barley-cons": "Le nivellement laser du sol garantit une répartition homogène de l'eau.",
        "crop-chickpea-cons": "Privilégier l'irrigation par sillons sur planches larges pour éviter la pourriture du collet."
    },
    te: {
        "schemes-subtitle": "టాప్ ప్రభుత్వ పథకాలు, సబ్సిడీలు మరియు పంట భీమా వివరాలను అన్వేషించండి.",

        "schemes-title": "ప్రభుత్వ వ్యవసాయ పథకాలు మరియు AI సబ్సిడీ చెకర్",

        "tab-schemes": "ప్రభుత్వ పథకాలు & సబ్సిడీలు",

        "btn-analyze-soil": "Analyze Soil Sample",
        "crop-jasmine": "Jasmine Flower (Mogra)",
        "crop-jasmine-cons": "Practice basin method watering and thick organic composting around the shrub to preserve moisture.",
        "crop-jasmine-desc": "Jasmine is an aromatic commercial flowering crop widely used for perfumes and traditional garlands. Thrives in warm, sunny weather and well-drained soils.",
        "crop-jasmine-tips": "Irrigate regularly during the main flowering season (summer/monsoon). Prune after flowering to encourage new wood and blooms.",
        "crop-marigold": "Marigold Flower",
        "crop-marigold-cons": "Apply light straw mulching around beds to prevent moisture evaporation and keep roots cool.",
        "crop-marigold-desc": "Marigold is a robust, popular flowering plant grown for pest management, ritual use, and garlands. Extremely adaptive and easy to grow.",
        "crop-marigold-tips": "Avoid overwatering which causes root rot and reduces flower count. Pinch growing tips early to encourage bushy growth and more buds.",
        "crop-rose": "Rose Flower",
        "crop-rose-cons": "Utilize automated drip systems with timers to water only in early mornings to minimize evaporation loss.",
        "crop-rose-desc": "Rose is a premium commercial floriculture crop. Demands rich organic soil, consistent moderate moisture, and careful pruning.",
        "crop-rose-tips": "Water the root zone directly, avoid wetting leaves to prevent black spots. Fertilize monthly with nitrogen and potash.",
        "crop-sorghum": "Sorghum (Jowar)",
        "crop-sorghum-cons": "Use soil moisture sensors to avoid irrigation if deep root zone has residual humidity.",
        "crop-sorghum-desc": "Sorghum is a highly climate-resilient dryland crop. Requires minimal water and survives high temperatures, performing well in heavy soils.",
        "crop-sorghum-tips": "Provide irrigation during critical boot and grain-filling stages if rainfall is insufficient.",
        "crop-sunflower": "Sunflower",
        "crop-sunflower-cons": "Employ drip irrigation lines directly along rows to conserve up to 45% water compared to furrow flooding.",
        "crop-sunflower-desc": "Sunflower is a highly versatile oilseed flower crop. Highly drought-tolerant with deep taproots, requiring good drainage and sunlight.",
        "crop-sunflower-tips": "Water deeply but infrequently to encourage deep rooting. Avoid overhead watering to prevent flower bud rot.",
        "sl-color-dark": "Dark Black / Charcoal",
        "sl-color-grey": "Grey / Ashy",
        "sl-color-light": "Light Brown / Tan",
        "sl-color-red": "Reddish Brown",
        "sl-color-yellow": "Yellowish",
        "sl-moist-dry": "Dry",
        "sl-moist-moist": "Moist / Damp",
        "sl-moist-verydry": "Very Dry / Cracked",
        "sl-moist-waterlogged": "Waterlogged / Saturated",
        "sl-org-decayed": "Decayed Leaves",
        "sl-org-fungal": "Fungal Growth",
        "sl-org-roots": "Root Fragments",
        "sl-org-worms": "Earthworms",
        "sl-tex-crumbly": "Crumbly / Loamy",
        "sl-tex-gritty": "Gritty / Sandy",
        "sl-tex-smooth": "Smooth / Silky (Silt)",
        "sl-tex-sticky": "Sticky / Clay-like",
        "soil-chalky": "Chalky/Lime Soil",
        "soil-chalky-desc": "Very alkaline, shallow soil containing a high proportion of calcium carbonate (lime) and stones. Drains extremely fast and dries out easily. Requires organic matter and iron amendments.",
        "soil-laterite": "Laterite Soil",
        "soil-laterite-desc": "Iron and aluminum-rich soil formed in hot, wet tropical areas. Highly weathered, acidic, and drains quickly. Requires phosphorus fertilization and regular organic manure addition.",
        "soil-peaty": "Peaty/Marshy Soil",
        "soil-peaty-desc": "Organic-rich soil formed in waterlogged marshy areas. Very high water retention but naturally poorly drained. High acidity, rich in organic matter. Best for specialized moisture-loving plants.",
        "soil-saline": "Saline-Alkaline Soil",
        "soil-saline-desc": "Salt-affected soil common in arid and semi-arid regions with poor drainage. Restricts water absorption by crops. Requires gypsum washing and salt-tolerant cropping patterns.",
        "soillab-amend-title": "Soil Improvement Recommendations",
        "soillab-area": "Field Area (acres)",
        "soillab-color": "Soil Color",
        "soillab-crop-fert": "Fertilizer Suggestion",
        "soillab-crop-match": "Match",
        "soillab-crop-name": "Crop",
        "soillab-crop-rating": "Rating",
        "soillab-crop-title": "Crop Compatibility Rankings",
        "soillab-fe": "Iron (Fe)",
        "soillab-health-label": "SOIL HEALTH",
        "soillab-hero-subtitle": "Generated from visual & tactile soil observations",
        "soillab-hero-title": "AI Soil Health Report",
        "soillab-high": "High",
        "soillab-k": "Potassium (K)",
        "soillab-low": "Low",
        "soillab-medium": "Med",
        "soillab-moisture": "Moisture Level",
        "soillab-n": "Nitrogen (N)",
        "soillab-nutrient-title": "Estimated Nutrient Profile",
        "soillab-om": "Organic Matter",
        "soillab-organic": "Organic Matter Signs",
        "soillab-p": "Phosphorus (P)",
        "soillab-ph": "pH Strip Reading",
        "soillab-ph-title": "pH Analysis & Acidity Profile",
        "soillab-placeholder-desc": "Fill in your soil sample observations on the left and click Analyze Soil.",
        "soillab-placeholder-title": "Soil Analysis Report",
        "soillab-subtitle": "Describe your soil sample to get an AI-powered lab report.",
        "soillab-texture": "Texture Feel",
        "soillab-title": "AI Soil Analysis Lab",
        "soillab-zn": "Zinc (Zn)",
        "tab-soillab": "Soil Lab",
        "profit-card-title": "అంచనా వేసిన దిగుబడి మరియు ఆదాయ విశ్లేషణ",

        "profit-section-title": "AI దిగుబడి మరియు మార్కెట్ లాభదాయకత గణన",

        "btn-clear-key": "కీ తొలగించు",

        "btn-save-key": "సేవ్ చేసి కనెక్ట్ చేయండి",

        "label-gemini-key": "గూగుల్ జెమిని API కీని నమోదు చేయండి:",

        "modal-ai-desc": "ప్రత్యక్ష సంభాషణ సహాయం, తక్షణ వ్యాధి నిర్ధారణ మరియు వ్యవసాయ సలహాల కోసం గూగుల్ జెమిని AI ని కనెక్ట్ చేయండి.",

        "modal-ai-title": "జెమిని AI లైవ్ కనెక్ట్ చేయండి",

        "btn-ai-key": "జెమిని AI కీ",

        "planner-timeline-title": "వార్షిక పంటల పెరుగుదల మరియు విత్తే సమయపట్టిక",

        "planner-rotation-title": "నేల నత్రజని పెంపుదల పంట మార్పిడి క్రమం",

        "planner-calendar-title": "రుతుపవన పంటల క్యాలెండర్ మరియు మార్పిడి ప్రణాళిక",

        "season-zaid": "జాయెద్ (వేసవికాలం)",

        "season-rabi": "రబీ (చలికాలం)",

        "season-kharif": "ఖరీఫ్ (వర్షాకాలం)",

        "season-all": "అన్ని రుతువులు",

        "tab-planner": "పంట క్యాలెండర్ మరియు మార్పిడి",

        "flower-booster-title": "పూల దిగుబడి మరియు రంగు పెంపుదల",

        "seed-treatment-title": "విత్తన శుద్ధి మరియు మొలకల సంరక్షణ",

        "seed-flower-title": "విత్తన సంరక్షణ మరియు పూల తోటల యాజమాన్యం",

        "pref-synthetic": "అధిక దిగుబడి వాణిజ్య రకం",

        "pref-organic": "100% సేంద్రీయ పద్ధతి",

        "pref-balanced": "సమతుల్య (రసాయన + సేంద్రీయ)",

        "label-preference": "వ్యవసాయ పద్ధతి ప్రాధాన్యత",

        "pest-safety-period": "కోతకు ముందు రక్షణ వ్యవధి",

        "pest-water-vol": "స్ప్రే నీటి పరిమాణం",

        "fert-zinc": "జింక్ సల్ఫేట్",

        "fert-mop": "ఎంఓపి (60% K₂O)",

        "fert-dap": "డిఎపి (18-46-0)",

        "fert-urea": "యూరియా (46% N)",

        "pest-card-title": "పురుగుల నివారణ మరియు సస్యరక్షణ",

        "fert-card-title": "పోషకాలు మరియు ఎరువుల అవసరాలు",

        "advisor-fert-pest-title": "పంట సంరక్షణ మరియు ఎరువుల మోతాదు ప్రణాళిక",

        "area-helper": "ఎరువులు మరియు పురుగుమందుల మోతాదును ఖచ్చితంగా లెక్కిస్తుంది.",

        "label-area": "పొలం విస్తీర్ణం (ఎకరాలు)",

        "logo-tagline": "AI స్మార్ట్ నీటిపారుదల సలహాదారు",
        "units-celsius": "°C / మిమీ",
        "units-fahrenheit": "°F / అంగుళాలు",
        "config-title": "వ్యవసాయ సెట్టింగులు",
        "config-desc": "కస్టమ్ AI సలహా పొందడానికి మీ క్షేత్ర పారామితులను ఇక్కడ నమోదు చేయండి.",
        "label-location": "ప్రాంతం / స్థలం",
        "label-soil": "నేల రకం",
        "label-crop": "పంట రకం",
        "label-stage": "పంట దశ",
        "soil-helper": "నేల రకం స్వయంచాలకంగా పూరించబడుతుంది కానీ మార్చుకోవచ్చు.",
        "stage-germination": "మొలక దశ",
        "stage-vegetative": "ఆకు మరియు కొమ్మల పెరుగుదల దశ",
        "stage-flowering": "పూత దశ",
        "stage-yield": "కాయ/గింజ నిండు దశ",
        "stage-ripening": "కోత దశ",
        "btn-generate": "నీటి ప్రణాళికను సిద్ధం చేయి",
        "tab-dashboard": "డ్యాష్‌బోర్డ్",
        "tab-advisor": "AI సలహాదారు",
        "tab-weather": "వాతావరణ కేంద్రం",
        "tab-education": "వ్యవసాయ మార్గదర్శి",
        "dash-suitability-title": "అనుకూలత స్కోరు",
        "suitability-pending": "అనుకూలత",
        "suitability-alert-txt": "విశ్లేషణ కోసం వివరాలను సమర్పించండి",
        "dash-weather-title": "ప్రస్తుత వాతావరణం",
        "weather-humidity": "తేమ శాతం",
        "weather-precipitation": "వర్షపాత సూచన",
        "weather-wind": "గాలి వేగం",
        "weather-radiation": "UV ఇండెక్స్",
        "dash-soil-title": "నేల నీటి నిల్వ సామర్థ్యం",
        "soil-water-retention": "నీటి నిల్వ",
        "soil-drainage": "నీరు ఇంకే వేగం",
        "dash-diagnostic-title": "పెరుగుదల విశ్లేషణ ఫలితాలు",
        "diag-init-title": "వివరాల కోసం నిరీక్షణ",
        "diag-init-desc": "దయచేసి ఎడమ వైపు ప్యానెల్‌లో మీ ప్రాంతం, నేల రకం మరియు పంటను ఎంచుకుని, 'నీటి ప్రణాళికను సిద్ధం చేయి' క్లిక్ చేయండి.",
        "console-title": "జెమిని 3.5 ఫ్లాష్ వ్యవసాయ సలహాదారు",
        "console-ready-msg": "> పారామితులను విశ్లేషించడానికి సిద్ధంగా ఉంది...",
        "advisor-report-summary": "AI నీటిపారుదల ప్రిస్క్రిప్షన్",
        "schedule-title": "7 రోజుల నీటిపారుదల షెడ్యూల్",
        "table-day": "తేదీ / రోజు",
        "table-temp": "ఉష్ణోగ్రత (కనిష్టం/గరిష్టం)",
        "table-rain": "వర్షపాత అంచనా",
        "table-soil-moisture": "నేలలో తేమ కొరత",
        "table-water-needed": "అందించాల్సిన నీటి పరిమాణం",
        "table-action": "చేయవలసిన పని & ఉత్తమ సమయం",
        "advisor-critical-tips": "ముఖ్యమైన పంట జాగ్రత్తలు",
        "advisor-conservation-tips": "నీటి పొదుపు చర్యలు",
        "weather-station-live-title": "లైవ్ వాతావరణ సమాచారం",
        "weather-feels-like": "అనిపించే ఉష్ణోగ్రత",
        "weather-pressure": "పీడనం",
        "weather-station-forecast-title": "7 రోజుల వాతావరణ సూచన",
        "edu-crop-catalog": "పంటల సమగ్ర సమాచారం",
        "edu-soil-catalog": "నేలల లక్షణాల సమాచారం",
        "footer-tagline": "రైతులకు స్మార్ట్ వ్యవసాయ సాంకేతిక పరిజ్ఞానాన్ని అందించడం.",
        "footer-interview-notes": "వ్యవసాయ AI ప్రదర్శనల కోసం రూపొందించబడింది. Open-Meteo & Gemini సహాయంతో పనిచేస్తుంది.",

        "soil-clay": "నల్ల రేగడి నేల (బరువైన జిగురు)",
        "soil-clay-loam": "నల్ల బంకమట్టి నేల",
        "soil-loamy": "దుబ్బ నేల / గరప నేల",
        "soil-sandy": "ఇసుక నేల",
        "soil-silt": "పండ్రు నేల / మెత్తటి నేల",
        "soil-black": "నల్ల రేగడి నేల (కలివిడి)",
        "soil-red": "ఎర్ర నేల",
        "soil-alluvial": "ఒండ్రు నేల",
        "soil-clay-desc": "అత్యధిక నీటిని నిల్వ ఉంచుకునే బరువైన జిగురు నేల. నీరు త్వరగా ఇంకదు. వరికి అత్యంత అనుకూలం. వేరుశనగ, బంగాళాదుంపలకు నీటి పారుదల జాగ్రత్తగా ఉండాలి.",
        "soil-clay-loam-desc": "బంకమట్టి, ఇసుకల సమాన మిశ్రమం. పోషకాలు ఎక్కువ, నీటిని నిల్వ ఉంచుకోగలదు. అన్ని రకాల పంటలకు అనుకూలం.",
        "soil-loamy-desc": "వ్యవసాయానికి అత్యంత అనుకూలమైన నేల. తేమను పట్టి ఉంచుతుంది మరియు వేర్లు శ్వాసించుటకు అనుకూలంగా ఉంటుంది.",
        "soil-sandy-desc": "ఇసుక రేణువులు ఎక్కువ. నీరు నిల్వ ఉండదు, వెంటనే కిందకు ఇంకిపోతుంది. పోషకాలు కడిగివేయబడతాయి. బిందు సేద్యం (డ్రిప్) అవసరం.",
        "soil-silt-desc": "సన్నటి మెత్తటి రేణువులు గల నేల. తేమను బాగా పట్టి ఉంచుతుంది. తృణధాన్యాలకు అనుకూలమైనది.",
        "soil-black-desc": "ప్రత్తి పంటకు అత్యంత ప్రసిద్ధి చెందిన నల్ల రేగడి నేల. తేమను లోపలి పొరలలో ఎక్కువ కాలం నిల్వ ఉంచుతుంది.",
        "soil-red-desc": "ఇనుము శాతం ఎక్కువగా ఉన్న ఎర్ర నేల. నీరు త్వరగా ఇంకిపోతుంది. సేంద్రీయ ఎరువులు ఎక్కువగా వేయాలి.",
        "soil-alluvial-desc": "నదీ తీరాల వెంబడి ఉండే ఒండ్రు నేల. అత్యంత సారవంతమైనది. గోధుమ, చెరకు పంటలకు అనుకూలం.",

        "crop-rice": "వరి / ధాన్యం",
        "crop-wheat": "గోధుమ",
        "crop-cotton": "ప్రత్తి",
        "crop-maize": "మొక్కజొన్న",
        "crop-potato": "బంగాళాదుంప",
        "crop-tomato": "టమాటా",
        "crop-groundnut": "వేరుశనగ",
        "crop-sugarcane": "చెరకు",
        "crop-soybean": "సోయాబీన్",
        "crop-mustard": "ఆవాలు",
        "crop-barley": "బార్లీ",
        "crop-chickpea": "శనగలు",

        "crop-rice-desc": "వరి ఎక్కువ నీరు అవసరమయ్యే పంట. నిల్వ నీరు మరియు వేడి వాతావరణం దీనికి అవసరం.",
        "crop-wheat-desc": "గోధుమ శీతాకాలపు పంట. చల్లని వాతావరణం మరియు కోత సమయంలో ఎండ అవసరం.",
        "crop-cotton-desc": "ప్రత్తి నల్ల రేగడి నేలలలో బాగా పెరుగుతుంది. ప్రారంభంలో ఎక్కువ నీరు ఉండకూడదు, కానీ తర్వాత తట్టుకోగలదు.",
        "crop-maize-desc": "మొక్కజొన్నకు నీరు నిల్వ ఉండకూడదు. పూత దశలో సమానంగా నీటిని అందించాలి.",
        "crop-potato-desc": "బంగాళాదుంపకు పొడి మరియు చల్లని నేలలు అవసరం. బంకమట్టి నేలలో దుంప కుళ్ళిపోతుంది.",
        "crop-tomato-desc": "టమాటాకు క్రమం తప్పకుండా తేమ అవసరం. నీరు ఎక్కువైతే కాయలు పగులుతాయి.",
        "crop-groundnut-desc": "వేరుశనగ వేర్లు భూమిలోపల కాయలు కాస్తాయి కాబట్టి మెత్తటి ఇసుక నేలలు అవసరం.",
        "crop-sugarcane-desc": "చెరకు సంవత్సర కాలపు పంట. దీనికి అత్యధిక నీరు మరియు సారవంతమైన ఒండ్రు నేలలు అవసరం.",
        "crop-soybean-desc": "సోయాబీన్ గింజలు ఊరే సమయంలో నీటి ఎద్దడి ఉండకూడదు. గరప నేలలు అనుకూలం.",
        "crop-mustard-desc": "ఆవాలు తక్కువ నీటితో పండే శీతాకాలపు పంట.",
        "crop-barley-desc": "బార్లీ తక్కువ నీటిని తట్టుకునే తృణధాన్యం.",
        "crop-chickpea-desc": "శనగ పంటకు నీరు నిలిచి ఉంటే తెగుళ్ళు వస్తాయి. తేమ కొద్దిగా ఉంటే సరిపోతుంది.",

        "crop-rice-tips": "మొదటి దశలలో 5-8 సెంటీమీటర్ల నీటిని పొలంలో నిల్వ ఉంచాలి. కోతకు ముందు నీటిని తీసేయాలి.",
        "crop-wheat-tips": "విత్తిన 21-25 రోజులకు (CRI దశ) మరియు పూత దశలో తప్పనిసరిగా నీరు పెట్టాలి.",
        "crop-cotton-tips": "పూత మరియు కాయ దశలలో తేమ లోపించకుండా చూసుకోవాలి. కాలువల ద్వారా నీటిని అందించడం మంచిది.",
        "crop-maize-tips": "కంకి వచ్చే దశలో నీటి కొరత ఉంటే దిగుబడి చాలా తగ్గిపోతుంది.",
        "crop-potato-tips": "తేలికపాటి తడులు తరచుగా ఇవ్వాలి. దుంపలపై ఎండ పడకుండా మట్టిని తోయాలి.",
        "crop-tomato-tips": "ఆకులపై కాకుండా నేరుగా మొదళ్ళలో నీరు పోయాలి. దీనివల్ల తెగుళ్ళు రావు.",
        "crop-groundnut-tips": "పూత దశలో మరియు ఊడలు దిగే దశలో నీరు అందించడం చాలా అవసరం.",
        "crop-sugarcane-tips": "మొదటి నాలుగు నెలలు కీలకమైన పెరుగుదల దశ. ఆకులతో మల్చింగ్ చేయడం వల్ల తేమ ఆవిరి కాకుండా ఉంటుంది.",
        "crop-soybean-tips": "కాయ నిండే దశలో నీటి కొరత రాకుండా చూసుకోవాలి.",
        "crop-mustard-tips": "ఆవాలకు కేవలం 2 లేదా 3 తడులు ఇస్తే సరిపోతుంది.",
        "crop-barley-tips": "పెరుగుదల దశలో ఎక్కువ నీరు పెట్టకూడదు.",
        "crop-chickpea-tips": "పూత సమయంలో తేమ ఉండాలి కానీ నీరు నిలిచి ఉంటే పంట దెబ్బతింటుంది.",

        "crop-rice-cons": "ఎల్లప్పుడూ నీటిని నిల్వ ఉంచకుండా ఆరిన వెంటనే నీటిని పెట్టే పద్ధతి (AWD) ద్వారా 30% నీరు ఆదా చేయవచ్చు.",
        "crop-wheat-cons": "స్ప్రింక్లర్ల ద్వారా నీరు పెట్టడం వల్ల సమంగా అందుతుంది మరియు నీరు ఆదా అవుతుంది.",
        "crop-cotton-cons": "నల్ల నేలలో డ్రిప్ సిస్టమ్ ఉపయోగించి మల్చింగ్ చేయడం వల్ల నీటి ఆవిరి తగ్గుతుంది.",
        "crop-maize-cons": "బోదెలు మరియు కాలువల పద్ధతి ద్వారా కేవలం కాలువలలోనే నీరు పెట్టాలి.",
        "crop-potato-cons": "ప్లాస్టిక్ మల్చింగ్ కింద డ్రిప్ పైపులను అమర్చడం ద్వారా 90% వరకు నీటిని ఆదా చేయవచ్చు.",
        "crop-tomato-cons": "మొక్క మొదలు చుట్టూ ఎండుగడ్డి పరచడం ద్వారా నేలలో 40% తేమ నిలిచి ఉంటుంది.",
        "crop-groundnut-cons": "కాయ దశలో స్ప్రింక్లర్లు వాడకూడదు, డ్రిప్ ఉపయోగించడం మంచిది.",
        "crop-sugarcane-cons": "చెరకు పిప్పి లేదా ఆకులను పొలంలో పరచడం ద్వారా తేమను నిలుపుకోవచ్చు.",
        "crop-soybean-cons": "దున్నకుండా విత్తడం వల్ల మునుపటి పంట వ్యర్థాలు తేమను కాపాడతాయి.",
        "crop-mustard-cons": "పూత సమయంలో మైక్రో స్ప్రింక్లర్ వాడకం చాలా ప్రయోజనకరం.",
        "crop-barley-cons": "లేజర్ సహాయంతో పొలాన్ని చదును చేయడం వల్ల నీరు సమంగా అందుతుంది.",
        "crop-chickpea-cons": "వెడల్పాటి మడుల పద్ధతిలో కాలువల ద్వారా నీటిని అందించడం ద్వారా తెగుళ్ళను అరికట్టవచ్చు."
    },
    ta: {
        "schemes-subtitle": "முக்கிய அரசு திட்டங்கள், மானியங்கள் மற்றும் பயிர் காப்பீட்டு விவரங்களை ஆராயுங்கள்.",

        "schemes-title": "அரசு விவசாய திட்டங்கள் மற்றும் AI மானிய பரிசோதகர்",

        "tab-schemes": "அரசு திட்டங்கள் & மானியங்கள்",

        "btn-analyze-soil": "Analyze Soil Sample",
        "crop-jasmine": "Jasmine Flower (Mogra)",
        "crop-jasmine-cons": "Practice basin method watering and thick organic composting around the shrub to preserve moisture.",
        "crop-jasmine-desc": "Jasmine is an aromatic commercial flowering crop widely used for perfumes and traditional garlands. Thrives in warm, sunny weather and well-drained soils.",
        "crop-jasmine-tips": "Irrigate regularly during the main flowering season (summer/monsoon). Prune after flowering to encourage new wood and blooms.",
        "crop-marigold": "Marigold Flower",
        "crop-marigold-cons": "Apply light straw mulching around beds to prevent moisture evaporation and keep roots cool.",
        "crop-marigold-desc": "Marigold is a robust, popular flowering plant grown for pest management, ritual use, and garlands. Extremely adaptive and easy to grow.",
        "crop-marigold-tips": "Avoid overwatering which causes root rot and reduces flower count. Pinch growing tips early to encourage bushy growth and more buds.",
        "crop-rose": "Rose Flower",
        "crop-rose-cons": "Utilize automated drip systems with timers to water only in early mornings to minimize evaporation loss.",
        "crop-rose-desc": "Rose is a premium commercial floriculture crop. Demands rich organic soil, consistent moderate moisture, and careful pruning.",
        "crop-rose-tips": "Water the root zone directly, avoid wetting leaves to prevent black spots. Fertilize monthly with nitrogen and potash.",
        "crop-sorghum": "Sorghum (Jowar)",
        "crop-sorghum-cons": "Use soil moisture sensors to avoid irrigation if deep root zone has residual humidity.",
        "crop-sorghum-desc": "Sorghum is a highly climate-resilient dryland crop. Requires minimal water and survives high temperatures, performing well in heavy soils.",
        "crop-sorghum-tips": "Provide irrigation during critical boot and grain-filling stages if rainfall is insufficient.",
        "crop-sunflower": "Sunflower",
        "crop-sunflower-cons": "Employ drip irrigation lines directly along rows to conserve up to 45% water compared to furrow flooding.",
        "crop-sunflower-desc": "Sunflower is a highly versatile oilseed flower crop. Highly drought-tolerant with deep taproots, requiring good drainage and sunlight.",
        "crop-sunflower-tips": "Water deeply but infrequently to encourage deep rooting. Avoid overhead watering to prevent flower bud rot.",
        "sl-color-dark": "Dark Black / Charcoal",
        "sl-color-grey": "Grey / Ashy",
        "sl-color-light": "Light Brown / Tan",
        "sl-color-red": "Reddish Brown",
        "sl-color-yellow": "Yellowish",
        "sl-moist-dry": "Dry",
        "sl-moist-moist": "Moist / Damp",
        "sl-moist-verydry": "Very Dry / Cracked",
        "sl-moist-waterlogged": "Waterlogged / Saturated",
        "sl-org-decayed": "Decayed Leaves",
        "sl-org-fungal": "Fungal Growth",
        "sl-org-roots": "Root Fragments",
        "sl-org-worms": "Earthworms",
        "sl-tex-crumbly": "Crumbly / Loamy",
        "sl-tex-gritty": "Gritty / Sandy",
        "sl-tex-smooth": "Smooth / Silky (Silt)",
        "sl-tex-sticky": "Sticky / Clay-like",
        "soil-chalky": "Chalky/Lime Soil",
        "soil-chalky-desc": "Very alkaline, shallow soil containing a high proportion of calcium carbonate (lime) and stones. Drains extremely fast and dries out easily. Requires organic matter and iron amendments.",
        "soil-laterite": "Laterite Soil",
        "soil-laterite-desc": "Iron and aluminum-rich soil formed in hot, wet tropical areas. Highly weathered, acidic, and drains quickly. Requires phosphorus fertilization and regular organic manure addition.",
        "soil-peaty": "Peaty/Marshy Soil",
        "soil-peaty-desc": "Organic-rich soil formed in waterlogged marshy areas. Very high water retention but naturally poorly drained. High acidity, rich in organic matter. Best for specialized moisture-loving plants.",
        "soil-saline": "Saline-Alkaline Soil",
        "soil-saline-desc": "Salt-affected soil common in arid and semi-arid regions with poor drainage. Restricts water absorption by crops. Requires gypsum washing and salt-tolerant cropping patterns.",
        "soillab-amend-title": "Soil Improvement Recommendations",
        "soillab-area": "Field Area (acres)",
        "soillab-color": "Soil Color",
        "soillab-crop-fert": "Fertilizer Suggestion",
        "soillab-crop-match": "Match",
        "soillab-crop-name": "Crop",
        "soillab-crop-rating": "Rating",
        "soillab-crop-title": "Crop Compatibility Rankings",
        "soillab-fe": "Iron (Fe)",
        "soillab-health-label": "SOIL HEALTH",
        "soillab-hero-subtitle": "Generated from visual & tactile soil observations",
        "soillab-hero-title": "AI Soil Health Report",
        "soillab-high": "High",
        "soillab-k": "Potassium (K)",
        "soillab-low": "Low",
        "soillab-medium": "Med",
        "soillab-moisture": "Moisture Level",
        "soillab-n": "Nitrogen (N)",
        "soillab-nutrient-title": "Estimated Nutrient Profile",
        "soillab-om": "Organic Matter",
        "soillab-organic": "Organic Matter Signs",
        "soillab-p": "Phosphorus (P)",
        "soillab-ph": "pH Strip Reading",
        "soillab-ph-title": "pH Analysis & Acidity Profile",
        "soillab-placeholder-desc": "Fill in your soil sample observations on the left and click Analyze Soil.",
        "soillab-placeholder-title": "Soil Analysis Report",
        "soillab-subtitle": "Describe your soil sample to get an AI-powered lab report.",
        "soillab-texture": "Texture Feel",
        "soillab-title": "AI Soil Analysis Lab",
        "soillab-zn": "Zinc (Zn)",
        "tab-soillab": "Soil Lab",
        "profit-card-title": "எதிர்பார்க்கப்படும் மகசூல் மற்றும் வருவாய் விவரம்",

        "profit-section-title": "AI மகசூல் மற்றும் சந்தை லாபக் கணிப்பான்",

        "btn-clear-key": "சாவியை நீக்கு",

        "btn-save-key": "சேமித்து இணைக்கவும்",

        "label-gemini-key": "கூகிள் ஜெமினி API சாவியை உள்ளிடவும்:",

        "modal-ai-desc": "நேரடி உரையாடல் உதவி மற்றும் பயிர் நோய் கண்டறிதலுக்கு கூகிள் ஜெமினி AI ஐ இணைக்கவும்.",

        "modal-ai-title": "ஜெமினி AI நேரடி இணைப்பு",

        "btn-ai-key": "ஜெமினி AI சாவி",

        "planner-timeline-title": "ஆண்டு பயிர் வளர்ச்சி மற்றும் விதைப்பு காலவரிசை",

        "planner-rotation-title": "மண் நைட்ரஜன் மற்றும் பூச்சி கட்டுப்பாட்டு பயிர் சுழற்சி",

        "planner-calendar-title": "பருவகால விதைப்பு காலண்டர் மற்றும் பயிர் சுழற்சி",

        "season-zaid": "சையத் (கோடைக்காலம்)",

        "season-rabi": "ரபி (குளிர்காலம்)",

        "season-kharif": "காரீப் (மழைக்காலம்)",

        "season-all": "அனைத்து பருவங்களும்",

        "tab-planner": "பயிர் காலண்டர் & சுழற்சி",

        "flower-booster-title": "பூக்கள் மகசூல் மற்றும் பூக்கும் ஊக்குவிப்பு",

        "seed-treatment-title": "விதை நேர்த்தி மற்றும் முளைப்பு பராமரிப்பு",

        "seed-flower-title": "விதை பராமரிப்பு மற்றும் பூக்கள் சிறப்பு வழிகாட்டி",

        "pref-synthetic": "அதிக விளைச்சல் வணிக முறை",

        "pref-organic": "100% இயற்கை முறை",

        "pref-balanced": "சீரான (இரசாயனம் + இயற்கை)",

        "label-preference": "வேளாண் முறை விருப்பம்",

        "pest-safety-period": "அறுவடைக்கு முந்தைய பாதுகாப்பு",

        "pest-water-vol": "தெளிப்பு நீர் அளவு",

        "fert-zinc": "ஜிங்க் சல்பேட்",

        "fert-mop": "எம்ஓபி (60% K₂O)",

        "fert-dap": "டிஏபி (18-46-0)",

        "fert-urea": "யுரியா (46% N)",

        "pest-card-title": "பூச்சி கட்டுப்பாடு மற்றும் பயிர் பாதுகாப்பு",

        "fert-card-title": "ஊட்டச்சத்து மற்றும் உரம் தேவைகள்",

        "advisor-fert-pest-title": "பயிர் பாதுகாப்பு மற்றும் உரம் அளவு பரிந்துரை",

        "area-helper": "உரம் மற்றும் பூச்சிக்கொல்லி அளவுகளை துல்லியமாகக் கணக்கிடுகிறது.",

        "label-area": "பண்ணை பரப்பளவு (ஏக்கர்)",

        "logo-tagline": "AI ஸ்மார்ட் பாசன ஆலோசகர்",
        "units-celsius": "°C / மிமீ",
        "units-fahrenheit": "°F / அங்குலம்",
        "config-title": "பண்ணை அமைப்புகள்",
        "config-desc": "தனிப்பயனாக்கப்பட்ட AI ஆலோசனையைப் பெற உங்கள் கள அளவுருக்களை வரையறுக்கவும்.",
        "label-location": "இருப்பிடம் / பகுதி",
        "label-soil": "மண் வகை",
        "label-crop": "பயிர் வகை",
        "label-stage": "வளர்ச்சி நிலை",
        "soil-helper": "மண் வகை தானாகவே நிரப்பப்படும் ஆனால் மாற்றிக்கொள்ளலாம்.",
        "stage-germination": "முளைக்கும் நிலை",
        "stage-vegetative": "வளர்ச்சி நிலை",
        "stage-flowering": "பூக்கும் நிலை",
        "stage-yield": "காய்/தானியம் உருவாகும் நிலை",
        "stage-ripening": "அறுவடை நிலை",
        "btn-generate": "பாசன திட்டத்தை உருவாக்கு",
        "tab-dashboard": "டாஷ்போர்டு",
        "tab-advisor": "AI ஆலோசகர்",
        "tab-weather": "வானிலை நிலையம்",
        "tab-education": "வேளாண் வழிகாட்டி",
        "dash-suitability-title": "வளர்ச்சி பொருந்தும் மதிப்பெண்",
        "suitability-pending": "பொருந்தும் தன்மை",
        "suitability-alert-txt": "பகுப்பாய்வு செய்ய அமைப்புகளைச் சமர்ப்பிக்கவும்",
        "dash-weather-title": "தற்போதைய வானிலை",
        "weather-humidity": "ஈரப்பதம்",
        "weather-precipitation": "மழைக்கான வாய்ப்பு",
        "weather-wind": "காற்றின் வேகம்",
        "weather-radiation": "UV குறியீடு",
        "dash-soil-title": "மண்ணின் நீர் பிடிப்பு திறன்",
        "soil-water-retention": "நீர் பிடிப்பு திறன்",
        "soil-drainage": "நீர் வடியும் வேகம்",
        "dash-diagnostic-title": "வளர்ச்சி கண்டறிதல் முடிவுகள்",
        "diag-init-title": "தரவுகளுக்காக காத்திருக்கிறது",
        "diag-init-desc": "இடது பலகத்தில் உங்கள் பகுதி, மண் வகை மற்றும் பயிரைத் தேர்ந்தெடுத்து 'பாசன திட்டத்தை உருவாக்கு' என்பதை அழுத்தவும்.",
        "console-title": "ஜெமினி 3.5 பிளாஷ் வேளாண் ஆலோசகர்",
        "console-ready-msg": "> அளவுருக்களை பகுப்பாய்வு செய்ய தயாராக உள்ளது...",
        "advisor-report-summary": "AI பாசன பரிந்துரை",
        "schedule-title": "7 நாள் பாசன அட்டவணை",
        "table-day": "தேதி / நாள்",
        "table-temp": "வெப்பநிலை (குறைந்தபட்சம்/அதிகபட்சம்)",
        "table-rain": "மழை முன்னறிவிப்பு",
        "table-soil-moisture": "மண் ஈரப்பதம் பற்றாக்குறை",
        "table-water-needed": "தேவைப்படும் நீரின் அளவு",
        "table-action": "செய்ய வேண்டிய செயல் & சிறந்த நேரம்",
        "advisor-critical-tips": "முக்கிய பயிர் பராமரிப்பு குறிப்புகள்",
        "advisor-conservation-tips": "நீர் சேமிப்பு நடவடிக்கைகள்",
        "weather-station-live-title": "நேரடி வானிலை மானிட்டர்",
        "weather-feels-like": "உணரப்படும் வெப்பநிலை",
        "weather-pressure": "அழுத்தம்",
        "weather-station-forecast-title": "7 நாள் வானிலை முன்னறிவிப்பு",
        "edu-crop-catalog": "பயிர்களின் சுயவிவரங்கள்",
        "edu-soil-catalog": "மண் குணாதிசய வழிகாட்டி",
        "footer-tagline": "விவசாயிகளுக்கு ஸ்மார்ட் விவசாய தொழில்நுட்பத்தை வழங்குதல்.",
        "footer-interview-notes": "விவசாய AI விளக்கக்காட்சிகளுக்காக உருவாக்கப்பட்டது. Open-Meteo & Gemini-Core உதவியுடன் செயல்படுகிறது.",

        "soil-clay": "களிமண் (கனமான களிமண்)",
        "soil-clay-loam": "களிமண் கலந்த வண்டல் மண்",
        "soil-loamy": "வண்டல் மண்",
        "soil-sandy": "மணல் பாங்கான மண்",
        "soil-silt": "பண்டல் மண் / மென்மையான மண்",
        "soil-black": "கரிசல் மண்",
        "soil-red": "செம்மண்",
        "soil-alluvial": "ஆற்று வண்டல் மண்",
        "soil-clay-desc": "அதிக நீர் பிடிப்பு திறன் கொண்ட களிமண், ஆனால் நீர் வடியும் வேகம் மிகக் குறைவு. நெல் பயிரிட உகந்தது. கிழங்கு பயிர்களுக்கு கவனமாக வடிகால் அமைக்க வேண்டும்.",
        "soil-clay-loam-desc": "களிமண், வண்டல், மணல் கலந்த சமமான கலவை. ஊட்டச்சத்துக்கள் அதிகம், பெரும்பாலான பயிர்களுக்கு ஏற்றது.",
        "soil-loamy-desc": "விவசாயத்திற்கு உகந்த மண். வடிகால் மற்றும் ஈரப்பதம் சமமாக இருக்கும், வேர்கள் சுவாசிக்க காற்று இடைவெளிகள் இருக்கும்.",
        "soil-sandy-desc": "மணல் துகள்கள் அதிகம். நீர் நிற்காது, உடனே கீழே இறங்கிவிடும். சொட்டு நீர் பாசனம் மற்றும் மூடாக்கு போடுவது அவசியம்.",
        "soil-silt-desc": "மென்மையான துகள்கள் கொண்ட மண். ஈரப்பதத்தை நன்கு தக்கவைத்துக்கொள்ளும். தானிய வகைகளுக்கு நல்லது.",
        "soil-black-desc": "பருத்தி சாகுபடிக்கு மிகவும் பிரபலமான கரிசல் மண். ஆழமான ஈரப்பதத்தை நீண்ட நாட்கள் தக்கவைக்கும்.",
        "soil-red-desc": "செம்மண் இரும்பு சத்து நிறைந்தது. நீர் எளிதில் வடியும், கரிம உரங்கள் அதிகம் பயன்படுத்த வேண்டும்.",
        "soil-alluvial-desc": "ஆற்றங்கரை வண்டல் மண் மிகவும் வளமானது. கரும்பு, கோதுமை பயிர்களுக்கு உகந்தது.",

        "crop-rice": "நெல் / அரிசி",
        "crop-wheat": "கோதுமை",
        "crop-cotton": "பருத்தி",
        "crop-maize": "சோளம் / மக்காச்சோளம்",
        "crop-potato": "உருளைக்கிழங்கு",
        "crop-tomato": "தக்காளி",
        "crop-groundnut": "நிலக்கடலை / வேர்க்கடலை",
        "crop-sugarcane": "கரும்பு",
        "crop-soybean": "சோயாபீன்ஸ்",
        "crop-mustard": "கடுகு",
        "crop-barley": "பார்லி",
        "crop-chickpea": "கொண்டைக்கடலை / கொண்டைக்கடலை",

        "crop-rice-desc": "நெல் அதிக நீர் தேவைப்படும் பயிர். தேங்கி நிற்கும் நீர் மற்றும் வெப்பமான காலநிலை இதற்கு தேவை.",
        "crop-wheat-desc": "கோதுமை குளிர்கால பயிர். குளிர்ந்த காலநிலை மற்றும் அறுவடை நேரத்தில் வெப்பமான வெயில் தேவை.",
        "crop-cotton-desc": "பருத்தி கரிசல் மண்ணில் நன்றாக வளரும். ஆரம்பத்தில் நீர் தேங்கக்கூடாது, பின்னர் வறட்சியைத் தாங்கும்.",
        "crop-maize-desc": "மக்காச்சோளத்திற்கு நீர் தேங்கக்கூடாது. பூக்கும் பருவத்தில் சீராக நீர் பாய்ச்ச வேண்டும்.",
        "crop-potato-desc": "உருளைக்கிழங்கிற்கு குளிர்ந்த காலநிலை மற்றும் தளர்வான மணல் கலந்த வண்டல் மண் தேவை.",
        "crop-tomato-desc": "தக்காளிக்கு நிலையான ஈரப்பதம் தேவை. நீர் அதிகமாக இருந்தால் காய் வெடிப்பு ஏற்படும்.",
        "crop-groundnut-desc": "நிலக்கடலை மண்ணுக்கு அடியில் காய் காய்ப்பதால் தளர்வான மணல் மண் தேவை.",
        "crop-sugarcane-desc": "கரும்பு நீண்ட கால பயிர். இதற்கு அதிக நீரும் வளமான வண்டல் மண்ணும் தேவை.",
        "crop-soybean-desc": "சோயாபீன்ஸ் காய் பிடிக்கும் பருவத்தில் வறட்சி இருக்கக்கூடாது.",
        "crop-mustard-desc": "கடுகு குறைந்த நீருடன் வளரக்கூடிய குளிர்கால பயிர்.",
        "crop-barley-desc": "பார்லி வறட்சியைத் தாங்கக்கூடிய தானியப் பயிர்.",
        "crop-chickpea-desc": "கொண்டைக்கடலைக்கு நீர் தேங்கினால் வேர் அழுகல் நோய் வரும். குறைந்த நீர் போதுமானது.",

        "crop-rice-tips": "ஆரம்ப வளர்ச்சியில் 5-8 செ.மீ நீர் தேக்கி வைக்கவும். அறுவடைக்கு முன் நீரை வடிக்கவும்.",
        "crop-wheat-tips": "விதைத்த 21-25 நாட்களில் (வேர் பிடிக்கும் பருவம்) மற்றும் பூக்கும் பருவத்தில் நீர் பாய்ச்ச வேண்டும்.",
        "crop-cotton-tips": "பூக்கும் மற்றும் காய் பிடிக்கும் தருணத்தில் ஈரப்பதம் குறையாமல் பார்த்துக்கொள்ளவும்.",
        "crop-maize-tips": "பூக்கும் தருணத்தில் நீர் பற்றாக்குறை ஏற்பட்டால் மகசூல் பெருமளவு குறையும்.",
        "crop-potato-tips": "அடிக்கடி லேசான நீர் பாய்ச்ச வேண்டும். உருளைகள் வெயிலில் படாதவாறு மண் அணைக்க வேண்டும்.",
        "crop-tomato-tips": "இலைகளின் மேல் தெளிக்காமல் நேரடியாக வேர்களில் நீர் ஊற்றவும், இதனால் நோய்கள் வராது.",
        "crop-groundnut-tips": "பூக்கும் மற்றும் விழுது இறங்கும் தருணத்தில் நீர் பாய்ச்சுவது அவசியம்.",
        "crop-sugarcane-tips": "முதல் 4 மாதங்கள் முக்கிய வளர்ச்சி பருவம். சோகை மூடாக்கு போடுவது நல்லது.",
        "crop-soybean-tips": "பருப்பு பிடிக்கும் பருவத்தில் ஈரப்பதம் குறையாமல் பார்த்துக்கொள்ளவும்.",
        "crop-mustard-tips": "கடுகிற்கு 2 அல்லது 3 முறை நீர் பாய்ச்சினால் போதுமானது.",
        "crop-barley-tips": "வளர்ச்சி பருவத்தில் அதிக நீர் பாய்ச்சக் கூடாது.",
        "crop-chickpea-tips": "பூக்கும் தருணத்தில் லேசான ஈரப்பதம் தேவை, நீர் தேங்கக் கூடாது.",

        "crop-rice-cons": "தொடர்ந்து நீர் தேக்காமல் காய்ந்த பின் நீர் பாய்ச்சும் முறை (AWD) மூலம் 30% நீர் சேமிக்கலாம்.",
        "crop-wheat-cons": "தெளிப்பு நீர் பாசனம் (ஸ்பிரிங்ளர்) மூலம் நீர் சமமாக பரவி நீர் சேமிக்கப்படும்.",
        "crop-cotton-cons": "கரிசல் மண்ணில் மூடாக்குடன் சொட்டு நீர் பாசனம் அமைப்பதன் மூலம் ஆவியாதல் குறையும்.",
        "crop-maize-cons": "பார் மற்றும் சால் முறையில் பார்களை தவிர்த்து சால்களில் மட்டும் நீர் பாய்ச்சவும்.",
        "crop-potato-cons": "பிளாஸ்டிக் மூடாக்கின் கீழ் சொட்டு நீர் குழாய்களை அமைப்பதன் மூலம் 90% நீர் சேமிக்கலாம்.",
        "crop-tomato-cons": "செடியின் அடியில் வைக்கோல் மூடாக்கு போடுவதன் மூலம் 40% ஈரப்பதம் காக்கப்படும்.",
        "crop-groundnut-cons": "காய் பிடிக்கும் போது தெளிப்பு நீர் பாசனத்தை தவிர், சொட்டு நீர் பாசனம் சிறந்தது.",
        "crop-sugarcane-cons": "கரும்பு சோகைகளை கொண்டு மூடாக்கு அமைப்பதால் நீர் ஆவியாவது தடுக்கப்படும்.",
        "crop-soybean-cons": "உழவில்லா சாகுபடி மூலம் முந்தைய பயிர் கழிவுகள் ஈரப்பதத்தை காக்கும்.",
        "crop-mustard-cons": "பூக்கும் பருவத்தில் நுண் தெளிப்பான் மூலம் நீர் தெளிப்பது அதிக நீர் சேமிப்பை தரும்.",
        "crop-barley-cons": "லேசர் நில சமன்படுத்தல் மூலம் நீர் வீணாவதை தடுக்கலாம்.",
        "crop-chickpea-cons": "அகல பாத்தி முறையில் நீர் பாய்ச்சுவது வேர் அழுகல் நோயை தடுக்கும்."
    },
    mr: {
        "schemes-subtitle": "प्रमुख सरकारी योजना, अनुदाने, पीक विमा आणि कर्ज सुविधांची माहिती मिळवा.",

        "schemes-title": "सरकारी कृषी योजना आणि AI अनुदान तपासक",

        "tab-schemes": "सरकारी योजना व अनुदाने",

        "btn-analyze-soil": "Analyze Soil Sample",
        "crop-jasmine": "Jasmine Flower (Mogra)",
        "crop-jasmine-cons": "Practice basin method watering and thick organic composting around the shrub to preserve moisture.",
        "crop-jasmine-desc": "Jasmine is an aromatic commercial flowering crop widely used for perfumes and traditional garlands. Thrives in warm, sunny weather and well-drained soils.",
        "crop-jasmine-tips": "Irrigate regularly during the main flowering season (summer/monsoon). Prune after flowering to encourage new wood and blooms.",
        "crop-marigold": "Marigold Flower",
        "crop-marigold-cons": "Apply light straw mulching around beds to prevent moisture evaporation and keep roots cool.",
        "crop-marigold-desc": "Marigold is a robust, popular flowering plant grown for pest management, ritual use, and garlands. Extremely adaptive and easy to grow.",
        "crop-marigold-tips": "Avoid overwatering which causes root rot and reduces flower count. Pinch growing tips early to encourage bushy growth and more buds.",
        "crop-rose": "Rose Flower",
        "crop-rose-cons": "Utilize automated drip systems with timers to water only in early mornings to minimize evaporation loss.",
        "crop-rose-desc": "Rose is a premium commercial floriculture crop. Demands rich organic soil, consistent moderate moisture, and careful pruning.",
        "crop-rose-tips": "Water the root zone directly, avoid wetting leaves to prevent black spots. Fertilize monthly with nitrogen and potash.",
        "crop-sorghum": "Sorghum (Jowar)",
        "crop-sorghum-cons": "Use soil moisture sensors to avoid irrigation if deep root zone has residual humidity.",
        "crop-sorghum-desc": "Sorghum is a highly climate-resilient dryland crop. Requires minimal water and survives high temperatures, performing well in heavy soils.",
        "crop-sorghum-tips": "Provide irrigation during critical boot and grain-filling stages if rainfall is insufficient.",
        "crop-sunflower": "Sunflower",
        "crop-sunflower-cons": "Employ drip irrigation lines directly along rows to conserve up to 45% water compared to furrow flooding.",
        "crop-sunflower-desc": "Sunflower is a highly versatile oilseed flower crop. Highly drought-tolerant with deep taproots, requiring good drainage and sunlight.",
        "crop-sunflower-tips": "Water deeply but infrequently to encourage deep rooting. Avoid overhead watering to prevent flower bud rot.",
        "sl-color-dark": "Dark Black / Charcoal",
        "sl-color-grey": "Grey / Ashy",
        "sl-color-light": "Light Brown / Tan",
        "sl-color-red": "Reddish Brown",
        "sl-color-yellow": "Yellowish",
        "sl-moist-dry": "Dry",
        "sl-moist-moist": "Moist / Damp",
        "sl-moist-verydry": "Very Dry / Cracked",
        "sl-moist-waterlogged": "Waterlogged / Saturated",
        "sl-org-decayed": "Decayed Leaves",
        "sl-org-fungal": "Fungal Growth",
        "sl-org-roots": "Root Fragments",
        "sl-org-worms": "Earthworms",
        "sl-tex-crumbly": "Crumbly / Loamy",
        "sl-tex-gritty": "Gritty / Sandy",
        "sl-tex-smooth": "Smooth / Silky (Silt)",
        "sl-tex-sticky": "Sticky / Clay-like",
        "soil-chalky": "Chalky/Lime Soil",
        "soil-chalky-desc": "Very alkaline, shallow soil containing a high proportion of calcium carbonate (lime) and stones. Drains extremely fast and dries out easily. Requires organic matter and iron amendments.",
        "soil-laterite": "Laterite Soil",
        "soil-laterite-desc": "Iron and aluminum-rich soil formed in hot, wet tropical areas. Highly weathered, acidic, and drains quickly. Requires phosphorus fertilization and regular organic manure addition.",
        "soil-peaty": "Peaty/Marshy Soil",
        "soil-peaty-desc": "Organic-rich soil formed in waterlogged marshy areas. Very high water retention but naturally poorly drained. High acidity, rich in organic matter. Best for specialized moisture-loving plants.",
        "soil-saline": "Saline-Alkaline Soil",
        "soil-saline-desc": "Salt-affected soil common in arid and semi-arid regions with poor drainage. Restricts water absorption by crops. Requires gypsum washing and salt-tolerant cropping patterns.",
        "soillab-amend-title": "Soil Improvement Recommendations",
        "soillab-area": "Field Area (acres)",
        "soillab-color": "Soil Color",
        "soillab-crop-fert": "Fertilizer Suggestion",
        "soillab-crop-match": "Match",
        "soillab-crop-name": "Crop",
        "soillab-crop-rating": "Rating",
        "soillab-crop-title": "Crop Compatibility Rankings",
        "soillab-fe": "Iron (Fe)",
        "soillab-health-label": "SOIL HEALTH",
        "soillab-hero-subtitle": "Generated from visual & tactile soil observations",
        "soillab-hero-title": "AI Soil Health Report",
        "soillab-high": "High",
        "soillab-k": "Potassium (K)",
        "soillab-low": "Low",
        "soillab-medium": "Med",
        "soillab-moisture": "Moisture Level",
        "soillab-n": "Nitrogen (N)",
        "soillab-nutrient-title": "Estimated Nutrient Profile",
        "soillab-om": "Organic Matter",
        "soillab-organic": "Organic Matter Signs",
        "soillab-p": "Phosphorus (P)",
        "soillab-ph": "pH Strip Reading",
        "soillab-ph-title": "pH Analysis & Acidity Profile",
        "soillab-placeholder-desc": "Fill in your soil sample observations on the left and click Analyze Soil.",
        "soillab-placeholder-title": "Soil Analysis Report",
        "soillab-subtitle": "Describe your soil sample to get an AI-powered lab report.",
        "soillab-texture": "Texture Feel",
        "soillab-title": "AI Soil Analysis Lab",
        "soillab-zn": "Zinc (Zn)",
        "tab-soillab": "Soil Lab",
        "profit-card-title": "अंदाजित उत्पादन व आर्थिक उत्पन्न तपशील",

        "profit-section-title": "AI उत्पादन व बाजार नफा अंदाज",

        "btn-clear-key": "की हटवा",

        "btn-save-key": "जतन करा व कनेक्ट करा",

        "label-gemini-key": "गुगल जेमिनी API की प्रविष्ट करा:",

        "modal-ai-desc": "थेट संभाषण मदत, झटपट रोग निदान आणि कृषी सल्ल्यासाठी गुगल जेमिनी 1.5 फ्लॅश AI कनेक्ट करा.",

        "modal-ai-title": "लाइव्ह जेमिनी AI कनेक्ट करा",

        "btn-ai-key": "जेमिनी AI की",

        "planner-timeline-title": "वार्षिक पिक वाढ व पेरणी वेळापत्रक",

        "planner-rotation-title": "मातीची सुपीकता व कीड नियंत्रणासाठी पिक फेरपालट",

        "planner-calendar-title": "हंगामी पेरणी कॅलेंडर व पिक फेरपालट यंत्रणा",

        "season-zaid": "उन्हाळी (उन्हाळा)",

        "season-rabi": "रब्बी (हिवाळा)",

        "season-kharif": "खरीप (पावसाळा)",

        "season-all": "सर्व हंगाम",

        "tab-planner": "पिक कॅलेंडर व फेरपालट",

        "flower-booster-title": "फूलशेती व कळ्या फुलवण्याचे तंत्रज्ञान",

        "seed-treatment-title": "बियाणे प्रक्रिया व उगवण क्षमता",

        "seed-flower-title": "बियाणे काळजी, रोपवाटिका व फूलशेती मार्गदर्शन",

        "pref-synthetic": "उच्च उत्पादन व्यावसायिक",

        "pref-organic": "100% सेंद्रिय पद्धत",

        "pref-balanced": "संतुलित (रासायनिक + सेंद्रिय)",

        "label-preference": "शेती पद्धती पसंती",

        "pest-safety-period": "काढणीपूर्वी सुरक्षा कालावधी",

        "pest-water-vol": "फवारणीसाठी पाणी",

        "fert-zinc": "झिंक सल्फेट",

        "fert-mop": "एमओपी (60% K₂O)",

        "fert-dap": "डीएपी (18-46-0)",

        "fert-urea": "युरिया (46% N)",

        "pest-card-title": "कीड नियंत्रण व पीक संरक्षण",

        "fert-card-title": "पोषक तत्वे व खतांची गरज",

        "advisor-fert-pest-title": "पिक संरक्षण आणि खतांची मात्रा",

        "area-helper": "खते आणि कीटकनाशकांच्या मात्रा अचूक मोजते.",

        "label-area": "शेताचे क्षेत्रफळ (एकड)",

        "logo-tagline": "एआय स्मार्ट जलसिंचन सल्लागार",
        "units-celsius": "°C / मिमी",
        "units-fahrenheit": "°F / इंच",
        "config-title": "शेत सेटिंग्ज",
        "config-desc": "कस्टम एआय सल्ला मिळवण्यासाठी तुमच्या शेताचे निकष भरा.",
        "label-location": "स्थान / प्रदेश",
        "label-soil": "मातीचा प्रकार",
        "label-crop": "पिकाचा प्रकार",
        "label-stage": "वाढीची अवस्था",
        "soil-helper": "मातीचा प्रकार प्रदेशानुसार ऑटो-फिल होतो पण बदलता येतो.",
        "stage-germination": "उगवण अवस्था",
        "stage-vegetative": "पिक वाढीची अवस्था",
        "stage-flowering": "फुलोरा अवस्था",
        "stage-yield": "दाणे/फळे भरणे अवस्था",
        "stage-ripening": "पक्वता / काढणी अवस्था",
        "btn-generate": "सिंचन आराखडा तयार करा",
        "tab-dashboard": "डॅशबोर्ड",
        "tab-advisor": "एआय सल्लागार",
        "tab-weather": "हवामान केंद्र",
        "tab-education": "कृषी मार्गदर्शक",
        "dash-suitability-title": "पीक वाढ अनुकूलता गुण",
        "suitability-pending": "अनुकूलता",
        "suitability-alert-txt": "विश्लेषण करण्यासाठी सेटिंग्ज सबमिट करा",
        "dash-weather-title": "सध्याचे हवामान",
        "weather-humidity": "आद्रता",
        "weather-precipitation": "पावसाची शक्यता",
        "weather-wind": "वाऱ्याचा वेग",
        "weather-radiation": "UV निर्देशांक",
        "dash-soil-title": "मातीची जलधारण क्षमता",
        "soil-water-retention": "जलधारण क्षमता",
        "soil-drainage": "पाण्याचा निचरा होण्याचा वेग",
        "dash-diagnostic-title": "वाढ अनुकूलता निदान",
        "diag-init-title": "माहितीची प्रतीक्षा आहे",
        "diag-init-desc": "कृपया डाव्या पॅनेलमध्ये तुमचा प्रदेश, मातीचा प्रकार आणि पीक निवडा आणि विश्लेषण सुरू करण्यासाठी 'सिंचन आराखडा तयार करा' वर क्लिक करा.",
        "console-title": "जेमिनी ३.५ फ्लॅश कृषी सल्लागार",
        "console-ready-msg": "> इनपुट पॅरामीटर्स विश्लेषणासाठी तयार आहेत...",
        "advisor-report-summary": "एआय सिंचन प्रिस्क्रिप्शन",
        "schedule-title": "7-दिवसीय हवामान व पीक नियोजन",
        "table-day": "दिवस / तारीख",
        "table-temp": "तापमान (किमान/कमाल)",
        "table-rain": "अंदाज पाऊस",
        "table-soil-moisture": "मातीतील ओलाव्याची कमतरता",
        "table-water-needed": "सिंचनाची खोली / पाणी गरज",
        "table-action": "कृती आणि उत्तम वेळ",
        "advisor-critical-tips": "महत्त्वाच्या पीक संगोपन टिप्स",
        "advisor-conservation-tips": "जलसंधारण उपाय",
        "weather-station-live-title": "थेट हवामान मॉनिटर",
        "weather-feels-like": "जाणवणारे तापमान",
        "weather-pressure": "दाब",
        "weather-station-forecast-title": "7-दिवसीय हवामान अंदाज",
        "edu-crop-catalog": "पिकांचे कृषी प्रोफाइल",
        "edu-soil-catalog": "माती वैशिष्ट्ये मार्गदर्शक",
        "footer-tagline": "शेतकऱ्यांना स्मार्ट कृषी तंत्रज्ञानाने सक्षम करणे.",
        "footer-interview-notes": "कृषी एआय मुलाखत प्रात्यक्षिकांसाठी तयार केले गेले. Open-Meteo आणि Gemini-Core च्या मदतीने कार्यरत.",

        "soil-clay": "चिकनमाती (भारी चिकण माती)",
        "soil-clay-loam": "चिकण दुमट माती",
        "soil-loamy": "मध्यम दुमट माती",
        "soil-sandy": "वाळूची / रॅताळ माती",
        "soil-silt": "गाळाची माती",
        "soil-black": "काळी कसदार माती (रेगूर)",
        "soil-red": "तांबडी माती",
        "soil-alluvial": "जलोढ गाळाची माती",
        "soil-clay-desc": "असाधारण जलधारण क्षमता असलेली चिकणमाती, पण पाण्याचा निचरा अत्यंत हळू होतो. भात पिकासाठी उत्तम पण इतर पिकांसाठी निचरा आवश्यक असतो.",
        "soil-clay-loam-desc": "चिकनमाती, वाळू आणि गाळाचे संतुलित मिश्रण. पोषक तत्वांनी समृद्ध आणि पाणी धरून ठेवणारी.",
        "soil-loamy-desc": "शेतीसाठी सर्वात आदर्श माती. पाण्याचा निचरा आणि ओलावा टिकवून ठेवण्याचा उत्तम समतोल साधते.",
        "soil-sandy-desc": "वाळूचे मोठे कण. पाणी लगेच वाहून जाते. वारंवार पण कमी प्रमाणात ठिबक सिंचन आवश्यक ठरते.",
        "soil-silt-desc": "बारीक कण असलेली माती जी ओलावा चांगली धरून ठेवते. धान्यासाठी उत्तम ठरते.",
        "soil-black-desc": "कपाशीसाठी सर्वात प्रसिद्ध काळी माती. ओलावा जमिनीच्या खालच्या थरात जास्त वेळ टिकवून ठेवते.",
        "soil-red-desc": "लोहयुक्त तांबडी माती. पाणी लगेच वाहून जाते, सेंद्रिय खतांचा वापर जास्त करावा लागतो.",
        "soil-alluvial-desc": "नदीकाठची गाळाची सुपीक माती. गहू आणि उसासाठी अत्यंत योग्य मानली जाते.",

        "crop-rice": "भात / धान",
        "crop-wheat": "गहू",
        "crop-cotton": "कापूस",
        "crop-maize": "मका",
        "crop-potato": "बटाटा",
        "crop-tomato": "टोमॅटो",
        "crop-groundnut": "भुईमूग",
        "crop-sugarcane": "ऊस",
        "crop-soybean": "सोयाबीन",
        "crop-mustard": "मोहरी",
        "crop-barley": "जव (Barley)",
        "crop-chickpea": "हरभरा",

        "crop-rice-desc": "भात हे अत्यंत पाणी लागणारे पीक आहे. यासाठी जमिनीत पाणी साठवून ठेवणे आवश्यक असते.",
        "crop-wheat-desc": "गहू हिवाळी पीक आहे. याला थंड हवामान आणि काढणीच्या वेळी कडक ऊन हवे असते.",
        "crop-cotton-desc": "कापूस हा काळ्या मातीत चांगला वाढतो. सुरुवातीला पाणी साचू नये पण नंतर दुष्काळ सहन करू शकतो.",
        "crop-maize-desc": "मकऱ्याला पाणी साचणे चालत नाही. फुलोरा अवस्थेत योग्य पाणी पुरवठा हवा असतो.",
        "crop-potato-desc": "बटाट्याला थंड हवामान आणि भुसभुशीत जमीन हवी असते. जड मातीत बटाटे कुजतात.",
        "crop-tomato-desc": "टोमॅटोला सतत मध्यम ओलावा लागतो. जास्त पाणी दिल्यास फळे तडकतात.",
        "crop-groundnut-desc": "भुईमुगाच्या आऱ्या जमिनीत सहज जाण्यासाठी भुसभुशीत वाळू मिश्रित माती लागते.",
        "crop-sugarcane-desc": "ऊस हे दीर्घकालीन आणि खूप पाणी पिणारे पीक आहे. सुपीक गाळाची जमीन याला मानवते.",
        "crop-soybean-desc": "सोयाबीनला शेंगा भरताना पाण्याची कमतरता भासू नये. मध्यम जमीन चांगली ठरते.",
        "crop-mustard-desc": "मोहरी हे कमी पाण्यात येणारे हिवाळी तेलबिया पीक आहे.",
        "crop-barley-desc": "जव हे दुष्काळ सहन करणारे थंड हंगामातील पीक आहे.",
        "crop-chickpea-desc": "हरभऱ्याला जमिनीत पाणी साठलेले चालत नाही. कोरडा ओलावा पुरेसा ठरतो.",

        "crop-rice-tips": "सुरुवातीच्या वाढीच्या काळात ५-८ सेंमी पाणी शेतात साठवून ठेवावे. पक्वतेच्या वेळी पाणी काढून घ्यावे.",
        "crop-wheat-tips": "पेरणीनंतर २१-२५ दिवसांनी (मुकुटमुळे फुटण्याची CRI अवस्था) आणि फुलोऱ्यात पाणी देणे अत्यंत गरजेचे आहे.",
        "crop-cotton-tips": "फुलोरा आणि बोंड धरण्याच्या काळात ओलावा टिकवून ठेवा. पूर सिंचन पद्धत टाळा.",
        "crop-maize-tips": "मक्याचे तुरे बाहेर पडताना पाणी कमी पडल्यास उत्पादनात मोठी घट होते.",
        "crop-potato-tips": "वारंवार पण हलके पाणी द्यावे. बटाट्यांवर ऊन पडू नये म्हणून झाडांना मातीची भर द्यावी.",
        "crop-tomato-tips": "पानांवर पाणी न टाकता थेट झाडाच्या मुळाशी पाणी द्या, यामुळे बुरशीजन्य रोग टळतील.",
        "crop-groundnut-tips": "फुलोरा आणि आऱ्या जमिनीत जाताना (Pegging Stage) सिंचन देणे आवश्यक आहे.",
        "crop-sugarcane-tips": "सुरुवातीचे ४ महिने पाणी व्यवस्थापन महत्त्वाचे आहे. ओलावा टिकवण्यासाठी पालापाचोळ्याचे आच्छादन करावे.",
        "crop-soybean-tips": "शेंगा भरताना योग्य ओलावा राखा. पेरणीनंतर जमिनीवर कडक पपडी धरू देऊ नका.",
        "crop-mustard-tips": "मोहरीला केवळ २ ते ३ हलकी पाणी देणे पुरेशी असते.",
        "crop-barley-tips": "वाढीच्या अवस्थेत जास्त पाणी देऊ नका. मुळांना हवा खेळती राहू द्या.",
        "crop-chickpea-tips": "फुलोरा अवस्थेत पाण्याची टंचाई हानिकारक आहे, पण जास्त पाण्याने केवळ पाल्याची वाढ होते आणि शेंगा धरत नाहीत.",

        "crop-rice-cons": "नेहमी पाणी साचवून न ठेवता जमीन सुकवून पुन्हा ओले करण्याच्या (AWD) पद्धतीमुळे ३०% पाणी वाचते.",
        "crop-wheat-cons": "तुषार सिंचन (Sprinkler) पद्धतीचा वापर केल्यास पाणी समप्रमाणात मिळते आणि बचत होते.",
        "crop-cotton-cons": "काळ्या मातीत मल्चिंगखाली ठिबक सिंचन वापरल्यास बाष्पीभवन टळते.",
        "crop-maize-cons": "सरी-वरंबा पद्धतीने लागवड करून फक्त सऱ्यांमध्ये पाणी द्यावे.",
        "crop-potato-cons": "प्लॅस्टिक मल्चिंगखाली ठिबक सिंचन नळ्या वापरल्यास ९०% सिंचन कार्यक्षमता मिळते.",
        "crop-tomato-cons": "झाडाच्या मुळाशी पालापाचोळा किंवा नारळाच्या शेंड्या टाकल्यास ४०% ओलावा टिकून राहतो.",
        "crop-groundnut-cons": "माती घट्ट होणे टाळण्यासाठी शेंगा धरताना तुषार सिंचन टाळावे. त्याऐवजी ठिबक सिंचनाचा वापर करावा.",
        "crop-sugarcane-cons": "बाष्पीभवन कमी करण्यासाठी आणि तण नियंत्रण करण्यासाठी ऊसाच्या ओळींमध्ये पाचटाचे आच्छादन (Trash-mulching) करावे.",
        "crop-soybean-cons": "विना-नांगरणी शेतीमुळे पिकाचे अवशेष शेतात राहतात, ज्यामुळे मातीतील ओलावा टिकून राहण्यास मदत होते.",
        "crop-mustard-cons": "पूर सिंचनाऐवजी फुलोऱ्याच्या अवस्थेत केवळ एकदा मायक्रो-स्प्रिंकलरचा वापर करणे अत्यंत पाणी-बचतीचे ठरते.",
        "crop-barley-cons": "पाण्याचा अपव्यय टाळण्यासाठी आणि समान पाण्यासाठी लेझर लँड लेव्हलिंगचा वापर करावा.",
        "crop-chickpea-cons": "पाण्याची बचत करण्यासाठी आणि बुरशीजन्य रोगांपासून बचावासाठी गादी वाफा (Broad Bed) व सरी-वरंबा पद्धतीने पाणी द्यावे."
    },
    bn: {
        "schemes-subtitle": "শীর্ষ সরকারি প্রকল্প, ভর্তুকি, ফসল বিমা এবং ক্রেডিট সুবিধা অন্বেষণ করুন।",

        "schemes-title": "সরকারি কৃষি প্রকল্প এবং AI ভর্তুকি চেকার",

        "tab-schemes": "সরকারি প্রকল্প ও ভর্তুকি",

        "btn-analyze-soil": "Analyze Soil Sample",
        "crop-barley-cons": "Leverage laser land leveling to ensure water distributes perfectly with zero runoff waste.",
        "crop-chickpea-cons": "Rely on furrow irrigation in broad bed systems to conserve water and prevent fungal collar rot.",
        "crop-cotton-cons": "Employ drip irrigation beneath black soil mulch to limit evaporation and maximize water efficiency.",
        "crop-groundnut-cons": "Avoid sprinkler irrigation during pod formation to prevent soil crusting. Use drip tapes instead.",
        "crop-jasmine": "Jasmine Flower (Mogra)",
        "crop-jasmine-cons": "Practice basin method watering and thick organic composting around the shrub to preserve moisture.",
        "crop-jasmine-desc": "Jasmine is an aromatic commercial flowering crop widely used for perfumes and traditional garlands. Thrives in warm, sunny weather and well-drained soils.",
        "crop-jasmine-tips": "Irrigate regularly during the main flowering season (summer/monsoon). Prune after flowering to encourage new wood and blooms.",
        "crop-maize-cons": "Practice ridge-and-furrow planting. Apply water in furrows only to concentrate moisture near roots.",
        "crop-marigold": "Marigold Flower",
        "crop-marigold-cons": "Apply light straw mulching around beds to prevent moisture evaporation and keep roots cool.",
        "crop-marigold-desc": "Marigold is a robust, popular flowering plant grown for pest management, ritual use, and garlands. Extremely adaptive and easy to grow.",
        "crop-marigold-tips": "Avoid overwatering which causes root rot and reduces flower count. Pinch growing tips early to encourage bushy growth and more buds.",
        "crop-mustard-cons": "A single micro-sprinkler session during flowering is highly water-efficient compared to flooding.",
        "crop-potato-cons": "Use drip tubes laid under plastic mulch to achieve up to 90% water application efficiency.",
        "crop-rice-cons": "Implement Alternate Wetting and Drying (AWD) rather than continuous flooding to save up to 30% water.",
        "crop-rose": "Rose Flower",
        "crop-rose-cons": "Utilize automated drip systems with timers to water only in early mornings to minimize evaporation loss.",
        "crop-rose-desc": "Rose is a premium commercial floriculture crop. Demands rich organic soil, consistent moderate moisture, and careful pruning.",
        "crop-rose-tips": "Water the root zone directly, avoid wetting leaves to prevent black spots. Fertilize monthly with nitrogen and potash.",
        "crop-sorghum": "Sorghum (Jowar)",
        "crop-sorghum-cons": "Use soil moisture sensors to avoid irrigation if deep root zone has residual humidity.",
        "crop-sorghum-desc": "Sorghum is a highly climate-resilient dryland crop. Requires minimal water and survives high temperatures, performing well in heavy soils.",
        "crop-sorghum-tips": "Provide irrigation during critical boot and grain-filling stages if rainfall is insufficient.",
        "crop-soybean-cons": "No-till farming keeps previous crop residue on the field, preserving vital soil water reserves.",
        "crop-sugarcane-cons": "Use trash-mulching between crop rows to dramatically reduce evaporation and prevent weed growth.",
        "crop-sunflower": "Sunflower",
        "crop-sunflower-cons": "Employ drip irrigation lines directly along rows to conserve up to 45% water compared to furrow flooding.",
        "crop-sunflower-desc": "Sunflower is a highly versatile oilseed flower crop. Highly drought-tolerant with deep taproots, requiring good drainage and sunlight.",
        "crop-sunflower-tips": "Water deeply but infrequently to encourage deep rooting. Avoid overhead watering to prevent flower bud rot.",
        "crop-tomato-cons": "Apply organic mulch (straw/coconut husk) around plant bases to retain 40% more soil moisture.",
        "crop-wheat-cons": "Use sprinkler irrigation systems to distribute water evenly and reduce evaporation loss.",
        "logo-tagline": "AI Smart Irrigation Advisor",
        "sl-color-dark": "Dark Black / Charcoal",
        "sl-color-grey": "Grey / Ashy",
        "sl-color-light": "Light Brown / Tan",
        "sl-color-red": "Reddish Brown",
        "sl-color-yellow": "Yellowish",
        "sl-moist-dry": "Dry",
        "sl-moist-moist": "Moist / Damp",
        "sl-moist-verydry": "Very Dry / Cracked",
        "sl-moist-waterlogged": "Waterlogged / Saturated",
        "sl-org-decayed": "Decayed Leaves",
        "sl-org-fungal": "Fungal Growth",
        "sl-org-roots": "Root Fragments",
        "sl-org-worms": "Earthworms",
        "sl-tex-crumbly": "Crumbly / Loamy",
        "sl-tex-gritty": "Gritty / Sandy",
        "sl-tex-smooth": "Smooth / Silky (Silt)",
        "sl-tex-sticky": "Sticky / Clay-like",
        "soil-chalky": "Chalky/Lime Soil",
        "soil-chalky-desc": "Very alkaline, shallow soil containing a high proportion of calcium carbonate (lime) and stones. Drains extremely fast and dries out easily. Requires organic matter and iron amendments.",
        "soil-laterite": "Laterite Soil",
        "soil-laterite-desc": "Iron and aluminum-rich soil formed in hot, wet tropical areas. Highly weathered, acidic, and drains quickly. Requires phosphorus fertilization and regular organic manure addition.",
        "soil-peaty": "Peaty/Marshy Soil",
        "soil-peaty-desc": "Organic-rich soil formed in waterlogged marshy areas. Very high water retention but naturally poorly drained. High acidity, rich in organic matter. Best for specialized moisture-loving plants.",
        "soil-saline": "Saline-Alkaline Soil",
        "soil-saline-desc": "Salt-affected soil common in arid and semi-arid regions with poor drainage. Restricts water absorption by crops. Requires gypsum washing and salt-tolerant cropping patterns.",
        "soillab-amend-title": "Soil Improvement Recommendations",
        "soillab-area": "Field Area (acres)",
        "soillab-color": "Soil Color",
        "soillab-crop-fert": "Fertilizer Suggestion",
        "soillab-crop-match": "Match",
        "soillab-crop-name": "Crop",
        "soillab-crop-rating": "Rating",
        "soillab-crop-title": "Crop Compatibility Rankings",
        "soillab-fe": "Iron (Fe)",
        "soillab-health-label": "SOIL HEALTH",
        "soillab-hero-subtitle": "Generated from visual & tactile soil observations",
        "soillab-hero-title": "AI Soil Health Report",
        "soillab-high": "High",
        "soillab-k": "Potassium (K)",
        "soillab-low": "Low",
        "soillab-medium": "Med",
        "soillab-moisture": "Moisture Level",
        "soillab-n": "Nitrogen (N)",
        "soillab-nutrient-title": "Estimated Nutrient Profile",
        "soillab-om": "Organic Matter",
        "soillab-organic": "Organic Matter Signs",
        "soillab-p": "Phosphorus (P)",
        "soillab-ph": "pH Strip Reading",
        "soillab-ph-title": "pH Analysis & Acidity Profile",
        "soillab-placeholder-desc": "Fill in your soil sample observations on the left and click Analyze Soil.",
        "soillab-placeholder-title": "Soil Analysis Report",
        "soillab-subtitle": "Describe your soil sample to get an AI-powered lab report.",
        "soillab-texture": "Texture Feel",
        "soillab-title": "AI Soil Analysis Lab",
        "soillab-zn": "Zinc (Zn)",
        "tab-soillab": "Soil Lab",
        "units-celsius": "°C / mm",
        "units-fahrenheit": "°F / inches",
        "profit-card-title": "আনুমানিক ফলন ও অর্থনৈতিক আয়ের বিবরণ",

        "profit-section-title": "AI ফলন ও বাজার লাভজনকতা হিসাবক",

        "btn-clear-key": "কী মুছুন",

        "btn-save-key": "সংরক্ষণ ও সংযোগ করুন",

        "label-gemini-key": "গুগল জেমিনি API কী লিখুন:",

        "modal-ai-desc": "সরাসরি বার্তা সহায়তা, দ্রুত রোগ নির্ণয় এবং কৃষি পরামর্শের জন্য গুগল জেমিনি 1.5 ফ্ল্যাশ AI যুক্ত করুন।",

        "modal-ai-title": "লাইভ জেমিনি AI সংযোগ করুন",

        "btn-ai-key": "জেমিনি AI কী",

        "planner-timeline-title": "বার্ষিক ফসল বৃদ্ধি ও বপনের সময়রেখা",

        "planner-rotation-title": "মাটির পুষ্টি ও পোকা দমনে ফসল পর্যায়ক্রমিক চাষ",

        "planner-calendar-title": "ঋতুভিত্তিক বপন ক্যালেন্ডার ও ফসল পর্যায়বৃত্ত",

        "season-zaid": "জায়েদ (গ্রীষ্মকাল)",

        "season-rabi": "রবি (শীতকাল)",

        "season-kharif": "খরিফ (বর্ষাকাল)",

        "season-all": "সব ঋতু",

        "tab-planner": "ফসলের ক্যালেন্ডার ও পর্যায়বৃত্ত",

        "flower-booster-title": "ফুল চাষ ও ফুল ফোটানোর বিশেষ গাইড",

        "seed-treatment-title": "বীজ শোধন ও অঙ্কুরোদগম পরিচর্যা",

        "seed-flower-title": "বীজ পরিচর্যা, নার্সারি ও ফুল চাষের বিশেষ পরামর্শ",

        "pref-synthetic": "উচ্চ ফলনশীল বাণিজ্যিক",

        "pref-organic": "১০০% জৈব পদ্ধতি",

        "pref-balanced": "সুষম (রাসায়নিক + জৈব)",

        "label-preference": "কৃষি পদ্ধতির পছন্দ",

        "pest-safety-period": "ফসল তোলার পূর্ব নিরাপত্তা",

        "pest-water-vol": "স্প্রে করার পানির পরিমাণ",

        "fert-zinc": "জিঙ্ক সালফেট",

        "fert-mop": "এমওপি (60% K₂O)",

        "fert-dap": "ডিএপি (18-46-0)",

        "fert-urea": "ইউরিয়া (46% N)",

        "pest-card-title": "পোকা দমন ও উদ্ভিদ সুরক্ষা",

        "fert-card-title": "পুষ্টি ও সারের চাহিদা",

        "advisor-fert-pest-title": "ফসল সুরক্ষা ও সার প্রয়োগের সঠিক মাত্রা",

        "area-helper": "সার এবং কীটনাশকের সঠিক মাত্রা গণনা করে।",

        "label-area": "জমির পরিমাণ (একর)",

        "config-title": "খামারের সেটিংস",
        "config-desc": "কাস্টম এআই পরামর্শ পেতে আপনার মাঠের পরামিতিগুলি নির্ধারণ করুন।",
        "label-location": "অবস্থান / অঞ্চল",
        "label-soil": "মাটির গঠন / ধরণ",
        "label-crop": "ফসলের ধরণ",
        "label-stage": "বৃদ্ধির পর্যায়",
        "soil-helper": "মাটির ধরণ অঞ্চল থেকে স্বয়ংক্রিয়ভাবে পূর্ণ হয় তবে এটি পরিবর্তন করা যেতে পারে।",
        "stage-germination": "অঙ্কুরোদগম",
        "stage-vegetative": "অঙ্গজ বৃদ্ধি / ভেজিটেটিভ",
        "stage-flowering": "ফুল ফোটা পর্যায়",
        "stage-yield": "দানা গঠন / ফলন পর্যায়",
        "stage-ripening": "পাকা / ফসল কাটা",
        "btn-generate": "সেচ পরিকল্পনা তৈরি করুন",
        "tab-dashboard": "ড্যাশবোর্ড",
        "tab-advisor": "এআই উপদেষ্টা",
        "tab-weather": "আবহাওয়া স্টেশন",
        "tab-education": "কৃষি নির্দেশিকা",
        "dash-suitability-title": "অনুকূলতার স্কোর",
        "suitability-pending": "অনুকূলতা",
        "suitability-alert-txt": "বিশ্লেষণ করতে সেটিংস জমা দিন",
        "dash-weather-title": "বর্তমান আবহাওয়া",
        "weather-humidity": "আর্দ্রতা",
        "weather-precipitation": "বৃষ্টির সম্ভাবনা",
        "weather-wind": "বাতাসের গতিবেগ",
        "weather-radiation": "ইউভি সূচক",
        "dash-soil-title": "মাটির জল ধারণ ক্ষমতা",
        "soil-water-retention": "জল ধারণ ক্ষমতা",
        "soil-drainage": "জল নিষ্কাশনের গতি",
        "dash-diagnostic-title": "অনুকূলতা রোগ নির্ণয়",
        "diag-init-title": "তথ্যের জন্য অপেক্ষা করা হচ্ছে",
        "diag-init-desc": "অনুগ্রহ করে আপনার অঞ্চল, মাটির ধরণ এবং ফসল নির্বাচন করুন এবং সেচ পরিকল্পনা তৈরি করুন এ ক্লিক করুন।",
        "console-title": "জেমিনি ৩.৫ ফ্ল্যাশ কৃষি উপদেষ্টা",
        "console-ready-msg": "> পরামিতি বিশ্লেষণের জন্য প্রস্তুত...",
        "advisor-report-summary": "এআই সেচ ব্যবস্থাপত্র",
        "schedule-title": "৭ দিনের সেচ সময়সূচী",
        "table-day": "দিন / তারিখ",
        "table-temp": "তাপমাত্রা (সর্বনিম্ন/সর্বোচ্চ)",
        "table-rain": "বৃষ্টির পূর্বাভাস",
        "table-soil-moisture": "মাটির আর্দ্রতার ঘাটতি",
        "table-water-needed": "প্রয়োজনীয় সেচের গভীরতা",
        "table-action": "করণীয় কাজ ও সঠিক সময়",
        "advisor-critical-tips": "গুরুত্বপূর্ণ ফসল যত্ন টিপস",
        "advisor-conservation-tips": "জল সংরক্ষণ পদক্ষেপ",
        "weather-station-live-title": "সরাসরি আবহাওয়া মনিটর",
        "weather-feels-like": "অনুভূত তাপমাত্রা",
        "weather-pressure": "বায়ুমণ্ডলীয় চাপ",
        "weather-station-forecast-title": "৭ দিনের আবহাওয়া পূর্বাভাস",
        "edu-crop-catalog": "ফসলের কৃষি প্রোফাইল",
        "edu-soil-catalog": "মাটির বৈশিষ্ট্য নির্দেশিকা",
        "footer-tagline": "কৃষকদের স্মার্ট কৃষি প্রযুক্তির মাধ্যমে ক্ষমতায়ন করা।",
        "footer-interview-notes": "কৃষি এআই ডেমো প্রদর্শনের জন্য নির্মিত। Open-Meteo এবং Gemini-Core দ্বারা চালিত।",

        "soil-clay": "ভারী কাদা মাটি (Clay)",
        "soil-clay-loam": "এঁটেল দোআঁশ মাটি",
        "soil-loamy": "দোআঁশ মাটি (Loam)",
        "soil-sandy": "বেলে মাটি (Sandy Soil)",
        "soil-silt": "পলি মাটি (Silt)",
        "soil-black": "কৃষ্ণ মৃত্তিকা / কালো মাটি",
        "soil-red": "লাল মাটি",
        "soil-alluvial": "পলি দোআঁশ / পলিমাটি",
        "soil-clay-desc": "অত্যন্ত উচ্চ জল ধারণ ক্ষমতাসম্পন্ন কাদা মাটি, তবে জল নিষ্কাশনের গতি খুব ধীর। ধান চাষের জন্য সেরা।",
        "soil-clay-loam-desc": "বালি, কাদা ও পলির চমৎকার মিশ্রণ। সুষম পুষ্টি এবং ভাল নিষ্কাশন ক্ষমতা যা সাধারণ চাষের জন্য উপযুক্ত।",
        "soil-loamy-desc": "চাষাবাদের জন্য আদর্শ মাটি। জল নিষ্কাশন এবং আর্দ্রতা ধরে রাখার এক দুর্দান্ত ভারসাম্য রয়েছে এতে।",
        "soil-sandy-desc": "মোটাদানা বালি সমৃদ্ধ। জল ধরে রাখতে পারে না, পুষ্টি উপাদান ধুয়ে যায়। ড্রিপ সেচ প্রয়োজন।",
        "soil-silt-desc": "মসৃণ পলিকণাযুক্ত মাটি যা আর্দ্রতা ভাল ধরে রাখে। শস্য ও মূলজাতীয় ফসলের জন্য উপযোগী।",
        "soil-black-desc": "কাদামাটি সমৃদ্ধ কালো মাটি। তুলা চাষের জন্য বিশেষভাবে উপযুক্ত ও দীর্ঘকাল আর্দ্রতা ধরে রাখে।",
        "soil-red-desc": "লোহা সমৃদ্ধ লালচে মাটি। জল নিষ্কাশন ক্ষমতা বেশি, প্রচুর জৈব সারের প্রয়োজন হয়।",
        "soil-alluvial-desc": "নদীর পলিমাটি যা অত্যন্ত উর্বর। গম, আখ ও ডাল ফসলের জন্য আদর্শ।",

        "crop-rice": "ধান / চাল",
        "crop-wheat": "গম",
        "crop-cotton": "তুলা",
        "crop-maize": "ভুট্টা",
        "crop-potato": "আলু",
        "crop-tomato": "টমেটো",
        "crop-groundnut": "চিনাবাদাম",
        "crop-sugarcane": "আখ / কুশিয়ার",
        "crop-soybean": "সয়াবিন",
        "crop-mustard": "সরিষা",
        "crop-barley": "যব (Barley)",
        "crop-chickpea": "ছোলা / চানা",

        "crop-rice-desc": "ধান একটি অতি-জলগ্রাহী ফসল। কাদা মাটিতে কাদা করে জল জমিয়ে চাষের প্রয়োজন হয়।",
        "crop-wheat-desc": "গম শীতকালীন ফসল। বৃদ্ধির শুরুতে ঠান্ডা এবং পাকার সময় শুষ্ক ও রৌদ্রোজ্জ্বল আবহাওয়া প্রয়োজন।",
        "crop-cotton-desc": "তুলা গরম আবহাওয়ার ফসল। জল নিষ্কাশনযুক্ত কালো মাটিতে ভাল জন্মে।",
        "crop-maize-desc": "ভুট্টায় জল দাঁড়ানো একদমই চলে না। ফুল আসা ও দানা বাঁধার সময় সঠিক সেচ প্রয়োজন।",
        "crop-potato-desc": "আলু চাষের জন্য আলগা ও বাতাস চলাচলকারী বেলে দোআঁশ মাটি প্রয়োজন। ভারী কাদা মাটিতে আলু পচে যায়।",
        "crop-tomato-desc": "টমেটোতে নিয়মিত সমপরিমাণ আর্দ্রতা প্রয়োজন। হঠাৎ বেশি জল দিলে টমেটো ফেটে যায়।",
        "crop-groundnut-desc": "বাদামের শুঁটি মাটির নিচে বৃদ্ধি পায় বলে আলগা মাটি থাকা অত্যন্ত জরুরি।",
        "crop-sugarcane-desc": "আখ দীর্ঘমেয়াদী ও প্রচুর জলের প্রয়োজন হয় এমন ফসল। পলি ও দোআঁশ মাটি উপযুক্ত।",
        "crop-soybean-desc": "সয়াবিনে শুঁটি পুষ্ট হওয়ার সময় জলের অভাব হলে ফলন কমে যায়।",
        "crop-mustard-desc": "সরিষা কম জলের শীতকালীন তৈলবীজ ফসল। হালকা সেচেই ভাল হয়।",
        "crop-barley-desc": "যব খরা সহনশীল শীতকালীন শস্য। গমের চেয়ে কম জল প্রয়োজন হয়।",
        "crop-chickpea-desc": "ছোলা চাষে জল দাঁড়ানো ক্ষতিকর। মাটির সামান্য রসেই ছোলা ভাল হয়।",

        "crop-rice-tips": "চারা রোপণের শুরুতে ৫-৮ সেমি জল জমিয়ে রাখুন। ফসল পাকার আগে জল শুকিয়ে ফেলুন।",
        "crop-wheat-tips": "শিকড় গজানোর ক্রাউন রুট (CRI) পর্যায়ে (২১-২৫ দিনে) এবং শিষ আসার সময় অবশ্যই সেচ দিন।",
        "crop-cotton-tips": "ফুল ও গুটি আসার সময় সঠিক আর্দ্রতা রাখুন। প্লাবন সেচ এড়িয়ে চলুন।",
        "crop-maize-tips": "মোচা বের হওয়ার সময় জলের অভাব ঘটলে ফলন ব্যাপক হ্রাস পায়।",
        "crop-potato-tips": "ঘন ঘন কিন্তু হালকা সেচ দিন। আলু রোদ থেকে বাঁচাতে মাটির গোড়া উঁচু করে রাখুন।",
        "crop-tomato-tips": "পাতায় জল না দিয়ে সরাসরি গোড়ার মাটিতে জল দিন। এতে ছত্রাক রোগ প্রতিরোধ হয়।",
        "crop-groundnut-tips": "ফুল আসা ও সুঁই মাটির নিচে ঢোকার সময় পর্যাপ্ত সেচ দিন।",
        "crop-sugarcane-tips": "প্রথম ৪ মাস কান্ড গঠনের সময় সেচ অপরিহার্য। মাটির আর্দ্রতা ধরে রাখতে শুকনো পাতা বিছিয়ে দিন।",
        "crop-soybean-tips": "বীজ পুষ্ট হওয়ার সময় পর্যাপ্ত আর্দ্রতা নিশ্চিত করুন।",
        "crop-mustard-tips": "মাত্র ২ থেকে ৩টি হালকা সেচ প্রয়োজন: প্রথমটি ফুল ফোটার আগে, দ্বিতীয়টি দানা বাঁধার সময়।",
        "crop-barley-tips": "অঙ্গজ বৃদ্ধির সময় অতিরিক্ত জল দেবেন না। শিকড়ে বায়ু চলাচল বজায় রাখুন।",
        "crop-chickpea-tips": "ফুল ফোটার সময় সেচ দিতে হবে কিন্তু অতিরিক্ত জল দিলে ফলন কমে যায়।"
    },
    pa: {
        "schemes-subtitle": "ਮੁੱਖ ਸਰਕਾਰੀ ਸਕੀਮਾਂ, ਸਬਸਿਡੀਆਂ, ਫਸਲੀ ਬੀਮਾ ਅਤੇ ਕਰਜ਼ਾ ਸਹੂਲਤਾਂ ਦੀ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰੋ।",

        "schemes-title": "ਸਰਕਾਰੀ ਖੇਤੀਬਾੜੀ ਸਕੀਮਾਂ ਅਤੇ AI ਸਬਸਿਡੀ ਚੈਕਰ",

        "tab-schemes": "ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ",

        "btn-analyze-soil": "Analyze Soil Sample",
        "crop-barley-cons": "Leverage laser land leveling to ensure water distributes perfectly with zero runoff waste.",
        "crop-chickpea-cons": "Rely on furrow irrigation in broad bed systems to conserve water and prevent fungal collar rot.",
        "crop-cotton-cons": "Employ drip irrigation beneath black soil mulch to limit evaporation and maximize water efficiency.",
        "crop-groundnut-cons": "Avoid sprinkler irrigation during pod formation to prevent soil crusting. Use drip tapes instead.",
        "crop-jasmine": "Jasmine Flower (Mogra)",
        "crop-jasmine-cons": "Practice basin method watering and thick organic composting around the shrub to preserve moisture.",
        "crop-jasmine-desc": "Jasmine is an aromatic commercial flowering crop widely used for perfumes and traditional garlands. Thrives in warm, sunny weather and well-drained soils.",
        "crop-jasmine-tips": "Irrigate regularly during the main flowering season (summer/monsoon). Prune after flowering to encourage new wood and blooms.",
        "crop-maize-cons": "Practice ridge-and-furrow planting. Apply water in furrows only to concentrate moisture near roots.",
        "crop-marigold": "Marigold Flower",
        "crop-marigold-cons": "Apply light straw mulching around beds to prevent moisture evaporation and keep roots cool.",
        "crop-marigold-desc": "Marigold is a robust, popular flowering plant grown for pest management, ritual use, and garlands. Extremely adaptive and easy to grow.",
        "crop-marigold-tips": "Avoid overwatering which causes root rot and reduces flower count. Pinch growing tips early to encourage bushy growth and more buds.",
        "crop-mustard-cons": "A single micro-sprinkler session during flowering is highly water-efficient compared to flooding.",
        "crop-potato-cons": "Use drip tubes laid under plastic mulch to achieve up to 90% water application efficiency.",
        "crop-rice-cons": "Implement Alternate Wetting and Drying (AWD) rather than continuous flooding to save up to 30% water.",
        "crop-rose": "Rose Flower",
        "crop-rose-cons": "Utilize automated drip systems with timers to water only in early mornings to minimize evaporation loss.",
        "crop-rose-desc": "Rose is a premium commercial floriculture crop. Demands rich organic soil, consistent moderate moisture, and careful pruning.",
        "crop-rose-tips": "Water the root zone directly, avoid wetting leaves to prevent black spots. Fertilize monthly with nitrogen and potash.",
        "crop-sorghum": "Sorghum (Jowar)",
        "crop-sorghum-cons": "Use soil moisture sensors to avoid irrigation if deep root zone has residual humidity.",
        "crop-sorghum-desc": "Sorghum is a highly climate-resilient dryland crop. Requires minimal water and survives high temperatures, performing well in heavy soils.",
        "crop-sorghum-tips": "Provide irrigation during critical boot and grain-filling stages if rainfall is insufficient.",
        "crop-soybean-cons": "No-till farming keeps previous crop residue on the field, preserving vital soil water reserves.",
        "crop-sugarcane-cons": "Use trash-mulching between crop rows to dramatically reduce evaporation and prevent weed growth.",
        "crop-sunflower": "Sunflower",
        "crop-sunflower-cons": "Employ drip irrigation lines directly along rows to conserve up to 45% water compared to furrow flooding.",
        "crop-sunflower-desc": "Sunflower is a highly versatile oilseed flower crop. Highly drought-tolerant with deep taproots, requiring good drainage and sunlight.",
        "crop-sunflower-tips": "Water deeply but infrequently to encourage deep rooting. Avoid overhead watering to prevent flower bud rot.",
        "crop-tomato-cons": "Apply organic mulch (straw/coconut husk) around plant bases to retain 40% more soil moisture.",
        "crop-wheat-cons": "Use sprinkler irrigation systems to distribute water evenly and reduce evaporation loss.",
        "sl-color-dark": "Dark Black / Charcoal",
        "sl-color-grey": "Grey / Ashy",
        "sl-color-light": "Light Brown / Tan",
        "sl-color-red": "Reddish Brown",
        "sl-color-yellow": "Yellowish",
        "sl-moist-dry": "Dry",
        "sl-moist-moist": "Moist / Damp",
        "sl-moist-verydry": "Very Dry / Cracked",
        "sl-moist-waterlogged": "Waterlogged / Saturated",
        "sl-org-decayed": "Decayed Leaves",
        "sl-org-fungal": "Fungal Growth",
        "sl-org-roots": "Root Fragments",
        "sl-org-worms": "Earthworms",
        "sl-tex-crumbly": "Crumbly / Loamy",
        "sl-tex-gritty": "Gritty / Sandy",
        "sl-tex-smooth": "Smooth / Silky (Silt)",
        "sl-tex-sticky": "Sticky / Clay-like",
        "soil-chalky": "Chalky/Lime Soil",
        "soil-chalky-desc": "Very alkaline, shallow soil containing a high proportion of calcium carbonate (lime) and stones. Drains extremely fast and dries out easily. Requires organic matter and iron amendments.",
        "soil-laterite": "Laterite Soil",
        "soil-laterite-desc": "Iron and aluminum-rich soil formed in hot, wet tropical areas. Highly weathered, acidic, and drains quickly. Requires phosphorus fertilization and regular organic manure addition.",
        "soil-peaty": "Peaty/Marshy Soil",
        "soil-peaty-desc": "Organic-rich soil formed in waterlogged marshy areas. Very high water retention but naturally poorly drained. High acidity, rich in organic matter. Best for specialized moisture-loving plants.",
        "soil-saline": "Saline-Alkaline Soil",
        "soil-saline-desc": "Salt-affected soil common in arid and semi-arid regions with poor drainage. Restricts water absorption by crops. Requires gypsum washing and salt-tolerant cropping patterns.",
        "soillab-amend-title": "Soil Improvement Recommendations",
        "soillab-area": "Field Area (acres)",
        "soillab-color": "Soil Color",
        "soillab-crop-fert": "Fertilizer Suggestion",
        "soillab-crop-match": "Match",
        "soillab-crop-name": "Crop",
        "soillab-crop-rating": "Rating",
        "soillab-crop-title": "Crop Compatibility Rankings",
        "soillab-fe": "Iron (Fe)",
        "soillab-health-label": "SOIL HEALTH",
        "soillab-hero-subtitle": "Generated from visual & tactile soil observations",
        "soillab-hero-title": "AI Soil Health Report",
        "soillab-high": "High",
        "soillab-k": "Potassium (K)",
        "soillab-low": "Low",
        "soillab-medium": "Med",
        "soillab-moisture": "Moisture Level",
        "soillab-n": "Nitrogen (N)",
        "soillab-nutrient-title": "Estimated Nutrient Profile",
        "soillab-om": "Organic Matter",
        "soillab-organic": "Organic Matter Signs",
        "soillab-p": "Phosphorus (P)",
        "soillab-ph": "pH Strip Reading",
        "soillab-ph-title": "pH Analysis & Acidity Profile",
        "soillab-placeholder-desc": "Fill in your soil sample observations on the left and click Analyze Soil.",
        "soillab-placeholder-title": "Soil Analysis Report",
        "soillab-subtitle": "Describe your soil sample to get an AI-powered lab report.",
        "soillab-texture": "Texture Feel",
        "soillab-title": "AI Soil Analysis Lab",
        "soillab-zn": "Zinc (Zn)",
        "tab-soillab": "Soil Lab",
        "profit-card-title": "ਅਨੁਮਾਨਿਤ ਝਾੜ ਅਤੇ ਆਮਦਨ ਦਾ ਵੇਰਵਾ",

        "profit-section-title": "AI ਝਾੜ ਅਤੇ ਬਾਜ਼ਾਰ ਮੁਨਾਫ਼ਾ ਅੰਦਾਜ਼ਾ",

        "btn-clear-key": "ਕੁੰਜੀ ਸਾਫ਼ ਕਰੋ",

        "btn-save-key": "ਸੰਭਾਲੋ ਅਤੇ ਕਨੈਕਟ ਕਰੋ",

        "label-gemini-key": "ਗੂਗਲ ਜੈਮਿਨੀ API ਕੁੰਜੀ ਦਰਜ ਕਰੋ:",

        "modal-ai-desc": "ਲਾਈਵ ਗੱਲਬਾਤ ਦੀ ਮਦਦ, ਬਿਮਾਰੀ ਦੇ ਨਿਦਾਨ ਅਤੇ ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਲਈ ਗੂਗਲ ਜੈਮਿਨੀ 1.5 ਫਲੈਸ਼ AI ਨੂੰ ਕਨੈਕਟ ਕਰੋ।",

        "modal-ai-title": "ਲਾਈਵ ਜੈਮਿਨੀ AI ਕਨੈਕਟ ਕਰੋ",

        "btn-ai-key": "ਜੈਮਿਨੀ AI ਕੀਅ",

        "planner-timeline-title": "ਸਾਲਾਨਾ ਫ਼ਸਲ ਦੇ ਵਾਧੇ ਅਤੇ ਬੀਜਣ ਦੀ ਸਮਾਂ-ਸਾਰਣੀ",

        "planner-rotation-title": "ਜ਼ਮੀਨ ਦੀ ਉਪਜਾਊ ਸ਼ਕਤੀ ਅਤੇ ਕੀੜੇ-ਮਕੌੜੇ ਕੰਟਰੋਲ ਲਈ ਫ਼ਸਲੀ ਚੱਕਰ",

        "planner-calendar-title": "ਮੌਸਮੀ ਬੀਜਣ ਕੈਲੰਡਰ ਅਤੇ ਫ਼ਸਲੀ ਚੱਕਰ ਇੰਜਣ",

        "season-zaid": "ਜ਼ਾਇਦ (ਗਰਮੀਆਂ)",

        "season-rabi": "ਰਬੀ (ਸਰਦੀਆਂ)",

        "season-kharif": "ਖਰੀਫ (ਮਾਨਸੂਨ)",

        "season-all": "ਸਾਰੇ ਮੌਸਮ",

        "tab-planner": "ਫ਼ਸਲ ਕੈਲੰਡਰ ਅਤੇ ਫੇਰਬਦਲ",

        "flower-booster-title": "ਫੁੱਲਾਂ ਦੀ ਖੇਤੀ ਅਤੇ ਫੁੱਲ ਖਿੜਨ ਦੇ ਸੁਝਾਅ",

        "seed-treatment-title": "ਬੀਜ ਦਾ ਉਪਚਾਰ ਅਤੇ ਉਗਣ ਦੀ ਦੇਖਭਾਲ",

        "seed-flower-title": "ਬੀਜ ਦੀ ਦੇਖਭਾਲ, ਨਰਸਰੀ ਅਤੇ ਫੁੱਲਾਂ ਦੀ ਦੇਖਭਾਲ",

        "pref-synthetic": "ਉੱਚ ਝਾੜ ਵਪਾਰਕ",

        "pref-organic": "100% ਜੈਵਿਕ ਅਤੇ ਬਾਇਓ-ਇਨਪੁਟਸ",

        "pref-balanced": "ਸੰਤੁਲਿਤ (ਰਸਾਇਣਕ + ਜੈਵਿਕ)",

        "label-preference": "ਖੇਤੀਬਾੜੀ ਅਭਿਆਸ ਦੀ ਪਸੰਦ",

        "pest-safety-period": "ਕਟਾਈ ਤੋਂ ਪਹਿਲਾਂ ਸੁਰੱਖਿਆ ਸਮਾਂ",

        "pest-water-vol": "ਸਪਰੇਅ ਪਾਣੀ ਦੀ ਮਾਤਰਾ",

        "fert-zinc": "ਜ਼ਿੰਕ ਸਲਫੇਟ",

        "fert-mop": "ਐਮਓਪੀ (60% K₂O)",

        "fert-dap": "ਡੀਏਪੀ (18-46-0)",

        "fert-urea": "ਯੂਰੀਆ (46% N)",

        "pest-card-title": "ਕੀੜੇ-ਮਕੌੜੇ ਕੰਟਰੋਲ ਅਤੇ ਫ਼ਸਲ ਸੁਰੱਖਿਆ",

        "fert-card-title": "ਪੌਸ਼ਟਿਕ ਤੱਤ ਅਤੇ ਖਾਦ ਦੀਆਂ ਲੋੜਾਂ",

        "advisor-fert-pest-title": "ਫ਼ਸਲ ਸੁਰੱਖਿਆ ਅਤੇ ਖਾਦ ਦੀ ਮਾਤਰਾ",

        "area-helper": "ਖਾਦਾਂ ਅਤੇ ਕੀਟਨਾਸ਼ਕਾਂ ਦੀ ਖੁਰਾਕ ਦੀ ਸਹੀ ਗਣਨਾ ਕਰਦਾ ਹੈ।",

        "label-area": "ਖੇਤ ਦਾ ਖੇਤਰਫਲ (ਏਕੜ)",

        "logo-tagline": "ਏਆਈ ਸਮਾਰਟ ਸਿੰਚਾਈ ਸਲਾਹਕਾਰ",
        "units-celsius": "°C / ਮਿਲੀਮੀਟਰ",
        "units-fahrenheit": "°F / ਇੰਚ",
        "config-title": "ਖੇਤ ਦੀਆਂ ਸੈਟਿੰਗਾਂ",
        "config-desc": "ਕਸਟਮ ਏਆਈ ਸਲਾਹ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਆਪਣੇ ਖੇਤ ਦੇ ਪੈਰਾਮੀਟਰਾਂ ਨੂੰ ਪਰਿਭਾਸ਼ਿਤ ਕਰੋ।",
        "label-location": "ਸਥਾਨ / ਖੇਤਰ",
        "label-soil": "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
        "label-crop": "ਫ਼ਸਲ ਦੀ ਕਿਸਮ",
        "label-stage": "ਵਾਧੇ ਦਾ ਪੜਾਅ",
        "soil-helper": "ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਖੇਤਰ ਦੇ ਹਿਸਾਬ ਨਾਲ ਆਟੋ-ਫਿਲ ਹੁੰਦੀ ਹੈ ਪਰ ਬਦਲੀ ਜਾ ਸਕਦੀ ਹੈ।",
        "stage-germination": "ਉਗਣ ਦਾ ਪੜਾਅ / ਸ਼ੁਰੂਆਤੀ",
        "stage-vegetative": "ਫ਼ਸਲ ਦਾ ਵਾਧਾ / ਵੈਜੀਟੇਟਿਵ",
        "stage-flowering": "ਫ਼ੁੱਲ ਆਉਣ ਦਾ ਪੜਾਅ",
        "stage-yield": "ਦਾਣੇ ਬਣਨ ਦਾ ਪੜਾਅ",
        "stage-ripening": "ਪੱਕਣ / ਕਟਾਈ ਦਾ ਪੜਾਅ",
        "btn-generate": "ਸਿੰਚਾਈ ਯੋਜਨਾ ਤਿਆਰ ਕਰੋ",
        "tab-dashboard": "ਡੈਸ਼ਬੋਰਡ",
        "tab-advisor": "ਏਆਈ ਸਲਾਹਕਾਰ",
        "tab-weather": "ਮੌਸਮ ਸਟੇਸ਼ਨ",
        "tab-education": "ਖੇਤੀ ਗਾਈਡ",
        "dash-suitability-title": "ਅਨੁਕੂਲਤਾ ਸਕੋਰ",
        "suitability-pending": "ਅਨੁਕੂਲਤਾ",
        "suitability-alert-txt": "ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਨ ਲਈ ਸੈਟਿੰਗਾਂ ਜਮ੍ਹਾਂ ਕਰੋ",
        "dash-weather-title": "ਮੌਜੂਦਾ ਮੌਸਮ",
        "weather-humidity": "ਨਮੀ",
        "weather-precipitation": "ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ",
        "weather-wind": "ਹਵਾ ਦੀ ਗਤੀ",
        "weather-radiation": "ਯੂਵੀ ਇੰਡੈਕਸ",
        "dash-soil-title": "ਮਿੱਟੀ ਦੀ ਜਲ-ਧਾਰਨ ਸਮਰੱਥਾ",
        "soil-water-retention": "ਜਲ-ਧਾਰਨ ਸਮਰੱਥਾ",
        "soil-drainage": "ਪਾਣੀ ਨਿਕਾਸ ਦੀ ਗਤੀ",
        "dash-diagnostic-title": "ਵਾਧਾ ਅਨੁਕੂਲਤਾ ਨਿਦਾਨ",
        "diag-init-title": "ਜਾਣਕਾਰੀ ਦੀ ਉਡੀਕ ਹੈ",
        "diag-init-desc": "ਕਿਰਪਾ ਕਰਕੇ ਖੱਬੇ ਪੈਨਲ ਵਿੱਚ ਆਪਣਾ ਖੇਤਰ, ਮਿੱਟੀ ਅਤੇ ਫ਼ਸਲ ਚੁਣੋ ਅਤੇ ਵਿਸ਼ਲੇਸ਼ਣ ਸ਼ੁਰੂ ਕਰਨ ਲਈ 'ਸਿੰਚਾਈ ਯੋਜਨਾ ਤਿਆਰ ਕਰੋ' ਤੇ ਕਲਿੱਕ ਕਰੋ।",
        "console-title": "ਜੇਮਿਨੀ 3.5 ਫਲੈਸ਼ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ",
        "console-ready-msg": "> ਇਨਪੁਟ ਪੈਰਾਮੀਟਰਾਂ ਦੇ ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਤਿਆਰ...",
        "advisor-report-summary": "ਏਆਈ ਸਿੰਚਾਈ ਨੁਸਖਾ",
        "schedule-title": "7-ਦਿਨਾ ਸਿਫਾਰਸ਼ੀ ਸਿੰਚਾਈ ਸਮਾਂ-ਸਾਰਣੀ",
        "table-day": "ਦਿਨ / ਮਿਤੀ",
        "table-temp": "ਤਾਪਮਾਨ (ਘੱਟੋ-ਘੱਟ/ਵੱਧ ਤੋਂ ਵੱਧ)",
        "table-rain": "ਮੀਂਹ ਦਾ ਅੰਦਾਜ਼ਾ",
        "table-soil-moisture": "ਮਿੱਟੀ ਵਿੱਚ ਨਮੀ ਦੀ ਘਾਟ",
        "table-water-needed": "ਸਿੰਚਾਈ ਦੀ ਡੂੰਘਾਈ (ਪਾਣੀ ਦੀ ਮਾਤਰਾ)",
        "table-action": "ਕਾਰਵਾਈ ਅਤੇ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ",
        "advisor-critical-tips": "ਜ਼ਰੂਰੀ ਫ਼ਸਲ ਸੰਭਾਲ ਨੁਕਤੇ",
        "advisor-conservation-tips": "ਪਾਣੀ ਦੀ ਬਚਤ ਦੇ ਉਪਾਅ",
        "weather-station-live-title": "ਲਾਈਵ ਮੌਸਮ ਮਾਨੀਟਰ",
        "weather-feels-like": "ਮਹਿਸੂਸ ਹੋਣ ਵਾਲਾ ਤਾਪਮਾਨ",
        "weather-pressure": "ਹਵਾ ਦਾ ਦਬਾਅ",
        "weather-station-forecast-title": "7-ਦਿਨਾ ਮੌਸਮ ਦਾ ਅੰਦਾਜ਼ਾ",
        "edu-crop-catalog": "ਫ਼ਸਲ ਖੇਤੀਬਾੜੀ ਪ੍ਰੋਫਾਈਲ",
        "edu-soil-catalog": "ਮਿੱਟੀ ਦੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦੀ ਗਾਈਡ",
        "footer-tagline": "ਕਿਸਾਨਾਂ ਨੂੰ ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ ਤਕਨਾਲੋਜੀ ਨਾਲ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਉਣਾ।",
        "footer-interview-notes": "ਖੇਤੀਬਾੜੀ ਏਆਈ ਇੰਟਰਵਿਊ ਪ੍ਰਦਰਸ਼ਨਾਂ ਲਈ ਬਣਾਇਆ ਗਿਆ। ਓਪਨ-ਮੇਟੀਓ ਅਤੇ ਜੇਮਿਨੀ-ਕੋਰ ਦੁਆਰਾ ਸੰਚਾਲਿਤ।",

        "soil-clay": "ਭਾਰੀ ਚੀਕਣੀ ਮਿੱਟੀ (Clay)",
        "soil-clay-loam": "ਚੀਕਣੀ ਡੋਮਟ ਮਿੱਟੀ (Clay Loam)",
        "soil-loamy": "ਦਰਮਿਆਨੀ ਡੋਮਟ ਮਿੱਟੀ (Loam)",
        "soil-sandy": "ਰੇਤਲੀ / ਮਾਰੂਥਲ ਮਿੱਟੀ",
        "soil-silt": "ਭਲ ਵਾਲੀ ਮਿੱਟੀ (Silt)",
        "soil-black": "ਕਾਲੀ ਕਪਾਹ ਮਿੱਟੀ (Black Soil)",
        "soil-red": "ਲਾਲ ਰੇਤਲੀ ਮਿੱਟੀ (Red Soil)",
        "soil-alluvial": "ਜਲੋਢ ਮਿੱਟੀ (Alluvial)",
        "soil-clay-desc": "ਭਾਰੀ ਚੀਕਣੀ ਮਿੱਟੀ ਜਿਸ ਵਿੱਚ ਪਾਣੀ ਰੋਕਣ ਦੀ ਬਹੁਤ ਸਮਰੱਥਾ ਹੁੰਦੀ ਹੈ, ਪਰ ਨਿਕਾਸ ਦੀ ਗਤੀ ਬਹੁਤ ਘੱਟ ਹੁੰਦੀ ਹੈ। ਝੋਨੇ ਲਈ ਉੱਤਮ ਪਰ ਦੂਜੀਆਂ ਫ਼ਸਲਾਂ ਲਈ ਨਿਕਾਸ ਜ਼ਰੂਰੀ ਹੈ।",
        "soil-clay-loam-desc": "ਚੀਕਣੀ ਮਿੱਟੀ, ਰੇਤ ਅਤੇ ਭਲ ਦਾ ਵਧੀਆ ਮਿਸ਼ਰਣ। ਪੌਸ਼ਟਿਕ ਤੱਤਾਂ ਨਾਲ ਭਰਪੂਰ ਅਤੇ ਸਿੰਚਾਈ ਲਈ ਉੱਤਮ।",
        "soil-loamy-desc": "ਖੇਤੀ ਲਈ ਸਭ ਤੋਂ ਆਦਰਸ਼ ਮਿੱਟੀ। ਪਾਣੀ ਨਿਕਾਸ ਅਤੇ ਨਮੀ ਦਾ ਵਧੀਆ ਸੰਤੁਲਨ ਰੱਖਦੀ ਹੈ।",
        "soil-sandy-desc": "ਰੇਤ ਦੇ ਮੋਟੇ ਕਣ। ਪਾਣੀ ਤੁਰੰਤ ਹੇਠਾਂ ਚਲਾ ਜਾਂਦਾ ਹੈ। ਵਾਰ-ਵਾਰ ਪਰ ਘੱਟ ਡ੍ਰਿਪ ਸਿੰਚਾਈ ਅਤੇ ਮਲਚਿੰਗ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ।",
        "soil-silt-desc": "ਬਰੀਕ ਕਣਾਂ ਵਾਲੀ ਮਿੱਟੀ ਜੋ ਨਮੀ ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਰੋਕਦੀ ਹੈ। ਅਨਾਜ ਦੀਆਂ ਫ਼ਸਲਾਂ ਲਈ ਬਹੁਤ ਵਧੀਆ।",
        "soil-black-desc": "ਕਪਾਹ ਦੀ ਖੇਤੀ ਲਈ ਸਭ ਤੋਂ ਮਸ਼ਹੂਰ ਕਾਲੀ ਮਿੱਟੀ। ਹੇਠਲੇ ਹਿੱਸੇ ਵਿੱਚ ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਨਮੀ ਰੱਖਦੀ ਹੈ।",
        "soil-red-desc": "ਲੋਹੇ ਦੇ ਤੱਤਾਂ ਨਾਲ ਭਰਪੂਰ ਲਾਲ ਮਿੱਟੀ। ਪਾਣੀ ਜਲਦੀ ਨਿਕਲ ਜਾਂਦਾ ਹੈ, ਦੇਸੀ ਰੂੜੀ ਦੀ ਵਰਤੋਂ ਜ਼ਿਆਦਾ ਕਰਨੀ ਪੈਂਦੀ ਹੈ।",
        "soil-alluvial-desc": "ਦਰਿਆਵਾਂ ਦੁਆਰਾ ਲਿਆਂਦੀ ਗਈ ਬਹੁਤ ਉਪਜਾਊ ਮਿੱਟੀ। ਕਣਕ ਅਤੇ ਗੰਨੇ ਲਈ ਬਹੁਤ ਲਾਭਦਾਇਕ।",

        "crop-rice": "ਝੋਨਾ / ਚੌਲ",
        "crop-wheat": "ਕਣਕ",
        "crop-cotton": "ਨਰਮਾ / ਕਪਾਹ",
        "crop-maize": "ਮੱਕੀ",
        "crop-potato": "ਆਲੂ",
        "crop-tomato": "ਟਮਾਟਰ",
        "crop-groundnut": "ਮੂੰਗਫਲੀ",
        "crop-sugarcane": "ਗੰਨਾ",
        "crop-soybean": "ਸੋਇਆਬੀਨ",
        "crop-mustard": "ਸਰ੍ਹੋਂ",
        "crop-barley": "ਜੌਂ (Barley)",
        "crop-chickpea": "ਛੋਲੇ",

        "crop-rice-desc": "ਝੋਨਾ ਪਾਣੀ ਦੀ ਬਹੁਤ ਜ਼ਿਆਦਾ ਖਪਤ ਕਰਨ ਵਾਲੀ ਫ਼ਸਲ ਹੈ। ਇਹ ਖੜ੍ਹੇ ਪਾਣੀ ਅਤੇ ਗਰਮ ਨਮੀ ਵਾਲੇ ਮੌਸਮ ਵਿੱਚ ਵਧੀਆ ਹੁੰਦੀ ਹੈ।",
        "crop-wheat-desc": "ਕਣਕ ਹਾੜੀ (ਸ਼ੀਤਕਾਲੀ) ਦੀ ਮੁੱਖ ਫ਼ਸਲ ਹੈ। ਇਸਨੂੰ ਵਧਣ ਲਈ ਠੰਢਾ ਅਤੇ ਪੱਕਣ ਸਮੇਂ ਗਰਮ ਮੌਸਮ ਚਾਹੀਦਾ ਹੈ।",
        "crop-cotton-desc": "ਨਰਮਾ ਗਰਮੀ ਦੀ ਫ਼ਸਲ ਹੈ। ਕਾਲੀ ਮਿੱਟੀ ਵਿੱਚ ਬਹੁਤ ਵਧੀਆ ਹੁੰਦਾ ਹੈ। ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਨਾ ਨੁਕਸਾਨਦੇਹ ਹੈ।",
        "crop-maize-desc": "ਮੱਕੀ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਨਾ ਬਿਲਕੁਲ ਨਹੀਂ ਹੋਣਾ ਚਾਹੀਦਾ। ਤੁੱਰਾ ਨਿਕਲਣ ਸਮੇਂ ਪਾਣੀ ਦਾ ਸਹੀ ਪ੍ਰਬੰਧ ਜ਼ਰੂਰੀ ਹੈ।",
        "crop-potato-desc": "ਆਲੂ ਨੂੰ ਵਧਣ ਲਈ ਹਲਕੀ ਅਤੇ ਹਵਾਦਾਰ ਮਿੱਟੀ ਚਾਹੀਦੀ ਹੈ। ਭਾਰੀ ਚੀਕਣੀ ਮਿੱਟੀ ਵਿੱਚ ਆਲੂ ਗਲ ਜਾਂਦੇ ਹਨ।",
        "crop-tomato-desc": "ਟਮਾਟਰ ਨੂੰ ਲਗਾਤਾਰ ਮੱਧਮ ਨਮੀ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ। ਜ਼ਿਆਦਾ ਪਾਣੀ ਨਾਲ ਫ਼ਲ ਫੱਟ ਜਾਂਦੇ ਹਨ।",
        "crop-groundnut-desc": "ਮੂੰਗਫਲੀ ਦੀਆਂ ਸੂਈਆਂ ਜ਼ਮੀਨ ਵਿੱਚ ਜਾਣ ਲਈ ਨਰਮ ਅਤੇ ਰੇਤਲੀ ਮਿੱਟੀ ਜ਼ਰੂਰੀ ਹੈ।",
        "crop-sugarcane-desc": "ਗੰਨਾ ਲੰਬੇ ਸਮੇਂ ਦੀ ਅਤੇ ਬਹੁਤ ਪਾਣੀ ਖਿੱਚਣ ਵਾਲੀ ਫ਼ਸਲ ਹੈ। ਸੁਪੀਕ ਮਿੱਟੀ ਚਾਹੀਦੀ ਹੈ।",
        "crop-soybean-desc": "ਸੋਇਆਬੀਨ ਨੂੰ ਫ਼ਲੀਆਂ ਭਰਨ ਸਮੇਂ ਪਾਣੀ ਦੀ ਘਾਟ ਨਹੀਂ ਹੋਣੀ ਚਾਹੀਦੀ।",
        "crop-mustard-desc": "ਸਰ੍ਹੋਂ ਘੱਟ ਪਾਣੀ ਦੀ ਲੋੜ ਵਾਲੀ ਹਾੜੀ ਦੀ ਤੇਲਬੀਜ ਫ਼ਸਲ ਹੈ।",
        "crop-barley-desc": "ਜੌਂ ਸੋਕੇ ਨੂੰ ਸਹਿਣ ਕਰਨ ਵਾਲੀ ਫ਼ਸਲ ਹੈ ਅਤੇ ਕਣਕ ਨਾਲੋਂ ਘੱਟ ਪਾਣੀ ਲੈਂਦੀ ਹੈ।",
        "crop-chickpea-desc": "ਛੋਲਿਆਂ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹਨ ਨਾਲ ਉਖੇੜਾ ਰੋਗ ਲੱਗਦਾ ਹੈ। ਹਲਕੀ ਨਮੀ ਕਾਫ਼ੀ ਹੁੰਦੀ ਹੈ।",

        "crop-rice-tips": "ਸ਼ੁਰੂਆਤੀ ਵਾਧੇ ਸਮੇਂ 5-8 ਸੈਂਟੀਮੀਟਰ ਪਾਣੀ ਖੜ੍ਹਾ ਰੱਖੋ। ਪੱਕਣ ਤੋਂ ਪਹਿਲਾਂ ਪਾਣੀ ਸੁਕਾ ਦਿਓ।",
        "crop-wheat-tips": "ਬਿਜਾਈ ਤੋਂ 21-25 ਦਿਨਾਂ ਬਾਅਦ (CRI ਸਟੇਜ) ਅਤੇ ਫ਼ੁੱਲ ਆਉਣ ਸਮੇਂ ਪਾਣੀ ਦੇਣਾ ਅਤਿ ਜ਼ਰੂਰੀ ਹੈ।",
        "crop-cotton-tips": "ਫ਼ੁੱਲ ਆਉਣ ਅਤੇ ਟੀਂਡੇ ਬਣਨ ਸਮੇਂ ਨਮੀ ਬਣਾਈ ਰੱਖੋ। ਹੜ੍ਹ ਸਿੰਚਾਈ ਤੋਂ ਬਚੋ।",
        "crop-maize-tips": "ਛੱਲੀ ਬਣਨ ਸਮੇਂ ਪਾਣੀ ਦੀ ਘਾਟ ਹੋਣ ਨਾਲ ਝਾੜ ਬਹੁਤ ਘੱਟ ਜਾਂਦਾ ਹੈ।",
        "crop-potato-tips": "ਹਲਕੀ ਪਰ ਵਾਰ-ਵਾਰ ਸਿੰਚਾਈ ਕਰੋ। ਆਲੂਆਂ ਨੂੰ ਧੁੱਪ ਤੋਂ ਬਚਾਉਣ ਲਈ ਮਿੱਟੀ ਚੜ੍ਹਾ ਕੇ ਰੱਖੋ।",
        "crop-tomato-tips": "ਪੱਤਿਆਂ ਦੀ ਬਜਾਏ ਸਿੱਧਾ ਜੜ੍ਹਾਂ ਵਿੱਚ ਪਾਣੀ ਦਿਓ ਤਾਂ ਜੋ ਉੱਲੀ ਦੇ ਰੋਗ ਨਾ ਲੱਗਣ।",
        "crop-groundnut-tips": "ਫ਼ੁੱਲ ਆਉਣ ਅਤੇ ਸੂਈਆਂ (Pegs) ਜ਼ਮੀਨ ਵਿੱਚ ਜਾਣ ਸਮੇਂ ਪਾਣੀ ਦੇਣਾ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ।",
        "crop-sugarcane-tips": "ਪਹਿਲੇ 4 ਮਹੀਨੇ ਵਾਧੇ ਦੇ ਸਮੇਂ ਪਾਣੀ ਦਾ ਪ੍ਰਬੰਧ ਜ਼ਰੂਰੀ ਹੈ। ਨਮੀ ਬਚਾਉਣ ਲਈ ਮਲਚਿੰਗ ਕਰੋ।",
        "crop-soybean-tips": "ਫ਼ਲੀਆਂ ਭਰਨ ਸਮੇਂ ਪਾਣੀ ਦੀ ਕਮੀ ਨਾ ਹੋਣ ਦਿਓ।",
        "crop-mustard-tips": "ਸਰ੍ਹੋਂ ਨੂੰ ਸਿਰਫ਼ 2 ਜਾਂ 3 ਹਲਕੇ ਪਾਣੀਆਂ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ।",
        "crop-barley-tips": "ਵਧਣ ਦੇ ਸਮੇਂ ਜ਼ਿਆਦਾ ਪਾਣੀ ਨਾ ਦਿਓ। ਜੜ੍ਹਾਂ ਨੂੰ ਹਵਾ ਲੱਗਣ ਦਿਓ।",
        "crop-chickpea-tips": "ਫ਼ੁੱਲ ਆਉਣ ਸਮੇਂ ਹਲਕੀ ਨਮੀ ਚਾਹੀਦੀ ਹੈ ਪਰ ਖੜ੍ਹਾ ਪਾਣੀ ਫ਼ਸਲ ਬਰਬਾਦ ਕਰ ਦਿੰਦਾ ਹੈ।"
    }
};

// Add fallback to English if translation is missing (just in case)
function getText(key, lang) {
    if (!key) return "";
    const selectedLang = lang || (typeof state !== "undefined" && state ? state.lang : "en");
    if (TRANSLATIONS[selectedLang] && TRANSLATIONS[selectedLang][key]) {
        return TRANSLATIONS[selectedLang][key];
    }
    if (TRANSLATIONS["en"] && TRANSLATIONS["en"][key]) {
        return TRANSLATIONS["en"][key];
    }
    return key;
}

// ==========================================================================
// 3. Application State
// ==========================================================================

const state = {
    lang: "en",
    unitImperial: false, // true = °F and inches, false = °C and mm
    activeTab: "dashboard",
    location: null, // Selected region details
    soil: null, // Selected soil details
    crop: null, // Selected crop details
    stage: "germination", // Selected growth stage
    area: 1.0, // Farm area in acres
    preference: "balanced", // "balanced", "organic", or "synthetic"
    geminiKey: localStorage.getItem("krishi_gemini_key") || "",
    weather: {
        current: null, // Current weather statistics
        daily: [],     // 7-day daily forecast list
        fetched: false
    },
    suitability: {
        score: null,
        verdict: "",
        diagnostics: []
    },
    recommendation: {
        weeklyAvg: 0,
        schedule: [],
        criticalTips: [],
        conservationTips: []
    },
    soilLab: {
        analyzed: false,
        healthScore: 0,
        nutrients: { n: 0, p: 0, k: 0, fe: 0, zn: 0 },
        organicMatter: 0,
        phValue: 7.0,
        phCategory: "neutral",
        phDescription: "",
        cropRankings: [],
        amendments: []
    }
};

// ==========================================================================
// 4. UI Elements Cache
// ==========================================================================

const dom = {
    selectLang: document.getElementById("select-lang"),
    toggleUnits: document.getElementById("toggle-units"),
    selectLocation: document.getElementById("select-location"),
    selectSoil: document.getElementById("select-soil"),
    selectCrop: document.getElementById("select-crop"),
    selectStage: document.getElementById("select-stage"),
    btnGenerate: document.getElementById("btn-generate"),
    btnSpinner: document.getElementById("btn-spinner"),
    selectArea: document.getElementById("select-area"),
    selectPreference: document.getElementById("select-preference"),
    advisorSeedTreatment: document.getElementById("advisor-seed-treatment"),
    advisorFlowerBooster: document.getElementById("advisor-flower-booster"),
    plannerCalendarGrid: document.getElementById("planner-calendar-grid"),
    plannerRotationBox: document.getElementById("planner-rotation-box"),
    btnAiKey: document.getElementById("btn-ai-key"),
    modalAiKey: document.getElementById("modal-ai-key"),
    btnCloseModal: document.getElementById("btn-close-modal"),
    inputGeminiKey: document.getElementById("input-gemini-key"),
    btnSaveKey: document.getElementById("btn-save-key"),
    btnClearKey: document.getElementById("btn-clear-key"),
    globalSearchInput: document.getElementById("global-search-input"),
    globalSearchResults: document.getElementById("global-search-results"),
    schemesCardsGrid: document.getElementById("schemes-cards-grid"),
    schemeSearchInput: document.getElementById("scheme-search-input"),
    advisorProfitGrid: document.getElementById("advisor-profit-grid"),
    advisorFertGrid: document.getElementById("advisor-fert-grid"),
    advisorFertSplitNote: document.getElementById("advisor-fert-split-note"),
    advisorPestList: document.getElementById("advisor-pest-list"),
    coordsDisplay: document.getElementById("coords-display"),

    // Tab links
    tabLinks: document.querySelectorAll(".tab-link"),
    tabPanels: document.querySelectorAll(".tab-panel"),

    // Dashboard panel elements
    gaugeFill: document.getElementById("gauge-fill"),
    gaugeVal: document.getElementById("growth-score-val"),
    gaugeVerdict: document.getElementById("growth-verdict-lbl"),
    suitabilityBadge: document.getElementById("suitability-badge"),

    weatherCurrentTemp: document.getElementById("weather-current-temp"),
    weatherCurrentDesc: document.getElementById("weather-current-desc"),
    weatherMainIcon: document.getElementById("weather-main-icon-element"),
    weatherHumidity: document.getElementById("weather-humidity-val"),
    weatherPrecip: document.getElementById("weather-precip-val"),
    weatherWind: document.getElementById("weather-wind-val"),
    weatherUV: document.getElementById("weather-uv-val"),

    soilNameTitle: document.getElementById("soil-name-title"),
    soilDescText: document.getElementById("soil-desc-text"),
    soilBarRetention: document.getElementById("soil-bar-retention"),
    soilBarDrainage: document.getElementById("soil-bar-drainage"),
    soilVisualAccent: document.getElementById("soil-visual-accent"),

    diagnosticList: document.getElementById("diagnostic-list-container"),

    // AI Advisor elements
    consoleOutput: document.getElementById("console-output"),
    consoleCmdInput: document.getElementById("console-cmd-input"),
    advisorReport: document.getElementById("advisor-report-container"),
    advisorHeroSubtitle: document.getElementById("advisor-hero-subtitle"),
    advisorAvgWater: document.getElementById("advisor-avg-water"),
    advisorAvgUnit: document.getElementById("advisor-avg-unit"),
    scheduleTbody: document.getElementById("schedule-tbody"),
    criticalTipsList: document.getElementById("advisor-critical-tips-list"),
    conservationTipsList: document.getElementById("advisor-conservation-tips-list"),

    // Weather station elements
    weatherDetailsIcon: document.getElementById("weather-details-icon"),
    weatherDetailsTemp: document.getElementById("weather-details-temp"),
    weatherDetailsLocation: document.getElementById("weather-details-location"),
    weatherDetailsCondition: document.getElementById("weather-details-condition"),
    weatherSensorFeels: document.getElementById("weather-sensor-feels"),
    weatherSensorHumidity: document.getElementById("weather-sensor-humidity"),
    weatherSensorWind: document.getElementById("weather-sensor-wind"),
    weatherSensorPressure: document.getElementById("weather-sensor-pressure"),
    forecastCardsWrapper: document.getElementById("forecast-cards-wrapper"),

    // Education elements
    eduSelectCrop: document.getElementById("edu-select-crop"),
    eduSelectSoil: document.getElementById("edu-select-soil"),
    eduCropCard: document.getElementById("edu-crop-card"),
    eduSoilCard: document.getElementById("edu-soil-card"),

    // Soil Lab elements
    slColor: document.getElementById("sl-color"),
    slTexture: document.getElementById("sl-texture"),
    slMoisture: document.getElementById("sl-moisture"),
    slPh: document.getElementById("sl-ph"),
    slPhDisplay: document.getElementById("sl-ph-display"),
    slArea: document.getElementById("sl-area"),
    slEarthworms: document.getElementById("sl-earthworms"),
    slDecayed: document.getElementById("sl-decayed"),
    slRoots: document.getElementById("sl-roots"),
    slFungal: document.getElementById("sl-fungal"),
    btnAnalyzeSoil: document.getElementById("btn-analyze-soil"),
    slBtnSpinner: document.getElementById("sl-btn-spinner"),
    soillabReportArea: document.getElementById("soillab-report-area"),
    soillabPlaceholder: document.getElementById("soillab-placeholder")
};

// ==========================================================================
// 5. Mathematical Helper Functions (Conversions)
// ==========================================================================

function formatTemp(tempC) {
    if (state.unitImperial) {
        const tempF = (tempC * 9 / 5) + 32;
        return `${tempF.toFixed(1)}°F`;
    }
    return `${tempC.toFixed(1)}°C`;
}

function formatDepth(mm) {
    if (state.unitImperial) {
        const inches = mm / 25.4;
        return `${inches.toFixed(2)} in`;
    }
    return `${mm.toFixed(1)} mm`;
}

function formatWind(kmh) {
    if (state.unitImperial) {
        const mph = kmh * 0.621371;
        return `${mph.toFixed(1)} mph`;
    }
    return `${kmh.toFixed(1)} km/h`;
}

// Convert Open-Meteo Weather Codes to description keys and FontAwesome Icons
function interpretWeatherCode(code) {
    let icon = "fa-solid fa-sun";
    let descKey = "weather-clear";
    let defaultDesc = "Sunny/Clear";

    if (code === 0) {
        icon = "fa-solid fa-sun";
        descKey = "weather-clear";
        defaultDesc = "Clear Sky";
    } else if (code >= 1 && code <= 3) {
        icon = "fa-solid fa-cloud-sun";
        descKey = "weather-cloudy";
        defaultDesc = "Partly Cloudy";
    } else if (code === 45 || code === 48) {
        icon = "fa-solid fa-smog";
        descKey = "weather-fog";
        defaultDesc = "Foggy";
    } else if (code >= 51 && code <= 55) {
        icon = "fa-solid fa-cloud-rain";
        descKey = "weather-drizzle";
        defaultDesc = "Light Drizzle";
    } else if (code >= 61 && code <= 65) {
        icon = "fa-solid fa-cloud-showers-water";
        descKey = "weather-rain";
        defaultDesc = "Rainy";
    } else if (code >= 71 && code <= 77) {
        icon = "fa-solid fa-snowflake";
        descKey = "weather-snow";
        defaultDesc = "Snowy";
    } else if (code >= 80 && code <= 82) {
        icon = "fa-solid fa-cloud-showers-heavy";
        descKey = "weather-showers";
        defaultDesc = "Heavy Showers";
    } else if (code >= 95 && code <= 99) {
        icon = "fa-solid fa-cloud-bolt";
        descKey = "weather-storm";
        defaultDesc = "Thunderstorm";
    }

    return { icon, descKey, defaultDesc };
}

// Translate dynamic weather conditions
function getWeatherDesc(descKey, defaultDesc) {
    // Add specific translations for weather conditions
    const weatherTranslations = {
        en: { "weather-clear": "Clear Sky", "weather-cloudy": "Partly Cloudy", "weather-fog": "Foggy", "weather-drizzle": "Light Drizzle", "weather-rain": "Rainy", "weather-snow": "Snowy", "weather-showers": "Heavy Showers", "weather-storm": "Thunderstorm" },
        hi: {
            "logo-tagline": "एआई स्मार्ट सिंचाई सलाहकार",
            "units-celsius": "°C / मिमी",
            "units-fahrenheit": "°F / इंच",
            "config-title": "खेत सेटिंग्स",
            "config-desc": "अनुकूलित एआई सलाह प्राप्त करने के लिए अपने खेत के मापदंडों को परिभाषित करें।",
            "label-location": "स्थान / क्षेत्र",
            "label-soil": "मिट्टी की बनावट / प्रकार",
            "label-crop": "फसल का प्रकार",
            "label-stage": "विकास की अवस्था",
            "soil-helper": "मिट्टी का प्रकार क्षेत्र से स्वतः भर जाता है लेकिन इसे बदला जा सकता है।",
            "stage-germination": "प्रारंभिक / अंकुरण",
            "stage-vegetative": "फसल विकास / वानस्पतिक",
            "stage-flowering": "मध्य-मौसम / फूल आना",
            "stage-yield": "देर से मौसम / उपज गठन",
            "stage-ripening": "पकना / कटाई",
            "btn-generate": "सिंचाई योजना बनाएं",
            "tab-dashboard": "डैशबोर्ड",
            "tab-advisor": "एआई सलाहकार",
            "tab-weather": "मौसम स्टेशन",
            "tab-education": "कृषि गाइड",
            "dash-suitability-title": "विकास उपयुक्तता स्कोर",
            "suitability-pending": "उपयुक्तता",
            "suitability-alert-txt": "विश्लेषण करने के लिए सेटिंग्स जमा करें",
            "dash-weather-title": "वर्तमान मौसम की स्थिति",
            "weather-humidity": "आर्द्रता",
            "weather-precipitation": "बारिश की संभावना",
            "weather-wind": "हवा की गति",
            "weather-radiation": "सौर विकिरण",
            "dash-soil-title": "मिट्टी की विशेषताएं",
            "soil-water-retention": "जल धारण क्षमता",
            "soil-drainage": "जल निकासी की गति",
            "dash-diagnostic-title": "एआई फसल निदान",
            "diag-init-title": "प्रणाली तैयार है",
            "diag-init-desc": "अपनी अनुकूलित उपयुक्तता स्कोर और मौसम अंतर्दृष्टि उत्पन्न करने के लिए ऊपर \"सिंचाई योजना बनाएं\" पर क्लिक करें।",
            "console-title": "कृषि जाल एआई टर्मिनल",
            "console-ready-msg": "कृषि जाल एआई इंजन शुरू हो गया है। कमांड टाइप करें या जनरेट पर क्लिक करें...",
            "advisor-report-summary": "सिंचाई सिफारिश सारांश",
            "schedule-title": "5-दिवसीय सिंचाई कार्यक्रम",
            "table-day": "दिन / दिनांक",
            "table-temp": "तापमान",
            "table-rain": "अनुमानित बारिश",
            "table-soil-moisture": "मिट्टी की नमी",
            "table-water-needed": "आवश्यक जल गहराई",
            "table-action": "अनुशंसित कार्रवाई",
            "advisor-critical-tips": "महत्वपूर्ण कृषि चेतावनियां",
            "advisor-conservation-tips": "जल संरक्षण तकनीकें",
            "weather-station-live-title": "लाइव मौसम स्टेशन",
            "weather-feels-like": "महसूस होता है",
            "weather-pressure": "वायुमंडलीय दबाव",
            "weather-station-forecast-title": "5-दिवसीय मौसम पूर्वानुमान",
            "edu-crop-catalog": "फसल निर्देशिका",
            "edu-soil-catalog": "मिट्टी प्रोफाइल निर्देशिका",
            "footer-tagline": "कृषि जाल — कृषि जल प्रबंधन के लिए स्मार्ट एआई समाधान।",
            "footer-interview-notes": "स्मार्ट कृषि सिंचाई अनुसंधान एवं विकास prototype",
            "soil-clay": "चिकनी मिट्टी (Clay)",
            "soil-clay-loam": "चिकनी दोमट मिट्टी (Clay Loam)",
            "soil-loamy": "दोमट मिट्टी (Loam)",
            "soil-sandy": "रेतीली मिट्टी (Sandy)",
            "soil-silt": "गाद दोमट मिट्टी (Silt Loam)",
            "soil-black": "काली कपास मिट्टी (Black Soil)",
            "soil-red": "लाल मिट्टी (Red Soil)",
            "soil-alluvial": "जलोढ़ मिट्टी (Alluvial)",
            "soil-laterite": "लैटेराइट मिट्टी (Laterite)",
            "soil-peaty": "पीठयुक्त दलदली मिट्टी (Peaty)",
            "soil-saline": "लवणीय / क्षारीय मिट्टी (Saline)",
            "soil-chalky": "चूनेदार मिट्टी (Chalky)",
            "soil-clay-desc": "अत्यधिक उच्च जल धारण क्षमता वाली भारी चिकनी मिट्टी, लेकिन बहुत कम जल निकासी की गति। जलभराव के प्रति अत्यंत संवेदनशील। चावल जैसी बाढ़-फसलों के लिए आदर्श, लेकिन कंद-फसलों के लिए सावधानीपूर्वक जल निकासी की आवश्यकता होती है।",
            "soil-clay-loam-desc": "चिकनी मिट्टी, गाद और रेत का संतुलित मिश्रण। समृद्ध पोषक स्तर, उच्च जल धारण क्षमता और निष्पक्ष जल निकासी विशेषताएं। सामान्य कृषि के लिए अत्यधिक बहुमुखी।",
            "soil-loamy-desc": "आदर्श कृषि मिट्टी। जल निकासी और नमी प्रतिधारण का उत्कृष्ट संतुलन, जो जड़ों के श्वसन के लिए वायु अंतराल की अनुमति देता है। पोषक तत्वों से भरपूर और काम करने में आसान।",
            "soil-sandy-desc": "मोटे रेत के कण। न्यूनतम नमी धारण क्षमता के साथ उच्च जल रिसाव दर। पोषक तत्व जल्दी से बाहर निकल जाते हैं। लगातार, हल्की ड्रिप-सिंचाई और भारी जैविक मल्चिंग की आवश्यकता होती है।",
            "soil-silt-desc": "बारीक, चिकने कण जो नमी को अच्छी तरह बनाए रखते हैं लेकिन संकुचित हो सकते हैं। पोषक तत्वों को प्रभावी ढंग से रखता है। अनाज और कंद फसलों की एक विस्तृत श्रृंखला के लिए अच्छा है।",
            "soil-black-desc": "मिट्टी से भरपूर गहरी काली मिट्टी। उच्च सिकुड़न और दरार के लक्षण, उच्च नमी प्रतिधारण। कपास की खेती के लिए प्रसिद्ध ('काली कपास मिट्टी'), सतह के नीचे गहराई से नमी रखती है।",
            "soil-red-desc": "क्रिस्टलीय कायांतरित चट्टानों से निर्मित। उच्च लौह तत्व, छिद्रपूर्ण संरचना, उत्कृष्ट जल निकासी। प्राकृतिक रूप से कम जल धारण क्षमता, जैविक खाद और विनियमित पानी की आवश्यकता होती है।",
            "soil-alluvial-desc": "नदी नहरों द्वारा जमा की गई अत्यधिक उपजाऊ मिट्टी। पोटाश, फास्फोरिक एसिड और जैविक गाद से भरपूर। उत्कृष्ट नमी गुण, गेहूं, गन्ना और दालों के लिए उपयुक्त।",
            "soil-laterite-desc": "गर्म और आर्द्र उष्णकटिबंधीय क्षेत्रों में बनने वाली लोहा और एल्युमिनियम से भरपूर मिट्टी। अत्यधिक अपक्षयित, अम्लीय और तेजी से जल निकासी वाली। फॉस्फोरस उर्वरक और नियमित जैविक खाद की आवश्यकता होती है।",
            "soil-peaty-desc": "जलभराव वाले दलदली क्षेत्रों में बनने वाली जैविक तत्वों से भरपूर मिट्टी। बहुत उच्च जल धारण क्षमता लेकिन प्राकृतिक रूप से खराब जल निकासी वाली। उच्च अम्लता, जैविक पदार्थों से समृद्ध। नमी पसंद करने वाले विशेष पौधों के लिए सर्वोत्तम।",
            "soil-saline-desc": "खराब जल निकासी वाले शुष्क और अर्ध-शुष्क क्षेत्रों में पाई जाने वाली नमक से प्रभावित मिट्टी। फसलों द्वारा पानी के अवशोषण को बाधित करती है। जिप्सम उपचार और नमक-सहित फसलों की आवश्यकता होती है।",
            "soil-chalky-desc": "उच्च मात्रा में कैल्शियम कार्बोनेट (चूना) और पत्थरों वाली बहुत क्षारीय, उथली मिट्टी। अत्यधिक तेजी से जल निकासी होती है और जल्दी सूख जाती है। जैविक खाद और लौह सुधार की आवश्यकता होती है।",
            "crop-rice": "चावल / धान",
            "crop-wheat": "गेहूं",
            "crop-cotton": "कपास",
            "crop-maize": "मक्का",
            "crop-potato": "आलू",
            "crop-tomato": "टमाटर",
            "crop-groundnut": "मूंगफली",
            "crop-sugarcane": "गन्ना",
            "crop-soybean": "सोयाबीन",
            "crop-mustard": "सरसों",
            "crop-barley": "जौ",
            "crop-chickpea": "चना / छोले",
            "crop-sunflower": "सूरजमुखी",
            "crop-sorghum": "ज्वार (Sorghum)",
            "crop-marigold": "गेंदा फूल (Marigold)",
            "crop-rose": "गुलाब का फूल (Rose)",
            "crop-jasmine": "मोगरा / चमेली (Jasmine)",
            "crop-rice-desc": "धान एक जल-गहन उष्णकटिबंधीय अनाज है। यह ठहरे हुए पानी और गर्म, आर्द्र जलवायु में पनपता है, जिसके लिए चिकनी मिट्टी की आवश्यकता होती है जो पानी के निकास का विरोध करती है।",
            "crop-wheat-desc": "गेहूं एक शीतकालीन अनाज की फसल है। इसके लिए ठंडे बढ़ते मौसम और परिपक्वता पर गर्म मौसम की आवश्यकता होती है। अच्छी जल निकासी वाले दोमट और जलोढ़ गाद को प्राथमिकता देता है।",
            "crop-cotton-desc": "कपास एक गर्म मौसम की नकदी फसल है। गहरी काली कपास मिट्टी में पनपती है। प्रारंभिक चरणों में जलभराव के प्रति अत्यधिक संवेदनशील लेकिन बाद में सूखा-सहनशील।",
            "crop-maize-desc": "मक्का एक बहुमुखी अनाज है। खड़े पानी (जलभराव) के प्रति अत्यधिक संवेदनशील और इसके वानस्पतिक और फूल आने के चरणों में मध्यम, समान रूप से दूरी पर पानी की आवश्यकता होती है।",
            "crop-potato-desc": "आलू एक कंद की फसल है जिसके लिए ठंडे तापमान और रेतीली दोमट जैसी ढीली, हवादार मिट्टी की आवश्यकता होती है। भारी चिकनी मिट्टी के कारण जड़ें सड़ जाती हैं और कंद का आकार खराब हो जाता है।",
            "crop-tomato-desc": "टमाटर एक संवेदनशील गर्म मौसम की फसल है। लगातार, मध्यम नमी की आवश्यकता होती है। अत्यधिक पानी देने से फल फट जाते हैं और सड़न हो जाती है।",
            "crop-groundnut-desc": "मूंगफली एक फलीदार फसल है जो जमीन के नीचे पकती है। मूंगफली के अंकुर को मिट्टी में प्रवेश करने और आसानी से फली विकसित करने के लिए रेतीली दोमट की आवश्यकता होती है। उच्च जल निकासी महत्वपूर्ण है।",
            "crop-sugarcane-desc": "गन्ना एक लंबी अवधि की, अत्यधिक जल-गहन फसल है। उच्च जल धारण क्षमता वाली जलोढ़ और चिकनी मिट्टी पर पनपने के लिए मजबूत नमी की उपलब्धता की आवश्यकता होती है।",
            "crop-soybean-desc": "सोयाबीन एक प्रोटीन युक्त तिलहन है। फली भरने के दौरान सूखे के प्रति अत्यधिक संवेदनशील और जलभराव के प्रति संवेदनशील। दोमट मिट्टी पसंद करता है।",
            "crop-mustard-desc": "सरसों एक कठोर शीतकालीन तिलहन फसल है। कम से मध्यम पानी की आवश्यकता होती है, न्यूनतम पानी के साथ रेतीली दोमट और जलोढ़ मिट्टी में पनपती है।",
            "crop-barley-desc": "जौ एक सूखा-प्रतिरोधी ठंडे मौसम का अनाज है। गेहूं की तुलना में अधिक नमक-सहिष्णु, मध्यम पानी की जरूरतों के साथ हल्की रेतीली-दोमट मिट्टी में अच्छा प्रदर्शन करता है।",
            "crop-chickpea-desc": "चना एक शीतकालीन दलहन की फसल है। जलभराव के प्रति अत्यधिक संवेदनशील। अवशिष्ट मिट्टी की नमी का उपयोग करने में अत्यंत कुशल; बहुत कम सिंचाई की आवश्यकता होती है।",
            "crop-sunflower-desc": "सूरजमुखी एक अत्यधिक बहुमुखी तिलहन फूल की फसल है। गहरी मूसला जड़ों के साथ अत्यधिक सूखा-सहिष्णु, जिसके लिए अच्छी जल निकासी और धूप की आवश्यकता होती है।",
            "crop-sorghum-desc": "ज्वार एक अत्यधिक जलवायु-अनुकूल शुष्क भूमि की फसल है। इसके लिए न्यूनतम पानी की आवश्यकता होती है और यह उच्च तापमान में जीवित रह सकती है, भारी मिट्टी में अच्छा प्रदर्शन करती है।",
            "crop-marigold-desc": "गेंदा एक मजबूत, लोकप्रिय फूल वाला पौधा है जो कीट प्रबंधन, धार्मिक उपयोग और मालाओं के लिए उगाया जाता है। अत्यधिक अनुकूलनीय और उगाने में आसान।",
            "crop-rose-desc": "गुलाब एक प्रीमियम व्यावसायिक पुष्पकृषि फसल है। इसके लिए समृद्ध जैविक मिट्टी, लगातार मध्यम नमी और सावधानीपूर्वक छंटाई की आवश्यकता होती है।",
            "crop-jasmine-desc": "चमेली/मोगरा एक सुगंधित व्यावसायिक फूल वाली फसल है जिसका उपयोग इत्र और पारंपरिक मालाओं के लिए किया जाता है। गर्म, धूप वाले मौसम और अच्छी जल निकासी वाली मिट्टी में पनपती है।",
            "crop-rice-tips": "प्रारंभिक विकास के दौरान 5-8 सेमी पानी का स्तर बनाए रखें। पकने की अवस्था तक मिट्टी को पूरी तरह सूखने न दें।",
            "crop-wheat-tips": "क्राउन रूट इनिशिएशन (CRI) चरण (बुआई के 21-25 दिन बाद) और फूल आने के चरण के दौरान महत्वपूर्ण सिंचाई प्रदान करें।",
            "crop-cotton-tips": "फूल आने और डोड बनने के दौरान मिट्टी की नमी इष्टतम सुनिश्चित करें। जड़ों में ऑक्सीजन की कमी को रोकने के लिए बाढ़ सिंचाई से बचें।",
            "crop-maize-tips": "नरमंजर (Tasseling) और सिल्क निकलने के चरणों के दौरान पानी की कमी से बचें क्योंकि इससे उपज में भारी कमी आ सकती है।",
            "crop-potato-tips": "बार-बार लेकिन हल्की सिंचाई करें। कंदों को धूप से बचाने और उन्हें ठंडा रखने के लिए मिट्टी चढ़ाकर रखें।",
            "crop-tomato-tips": "फंगल रोगों से बचने के लिए पत्तियों के बजाय सीधे मिट्टी में पानी दें। फलों को फटने से बचाने के लिए लगातार नमी बनाए रखें।",
            "crop-groundnut-tips": "फूल आने और सुइयां (Pegging) बनने के चरणों के दौरान सिंचाई प्रदान करें। चिकनी मिट्टी से बचें जो सुइयों के प्रवेश को रोकती हैं।",
            "crop-sugarcane-tips": "गठन चरण (पहले 4 महीने) के दौरान महत्वपूर्ण सिंचाई की आवश्यकता होती है। नमी बनाए रखने के लिए सूखे पत्तों से मल्चिंग करें।",
            "crop-soybean-tips": "फली बनने और फली भरने के दौरान पर्याप्त नमी सुनिश्चित करें। बुआई के बाद मिट्टी की पपड़ी न बनने दें।",
            "crop-mustard-tips": "केवल 2 से 3 हल्की सिंचाइयों की आवश्यकता होती है: पहली फूल आने से पहले, दूसरी फली के विकास के चरण में।",
            "crop-barley-tips": "वानस्पतिक अवस्था में अधिक पानी न दें। जड़ों में हवा का संचार बनाए रखें। नाइट्रोजन के बहने से बचें।",
            "crop-chickpea-tips": "फूल आने पर पानी की कमी खतरनाक है, लेकिन अतिरिक्त पानी से वानस्पतिक वृद्धि अत्यधिक हो जाती है और फली की उपज शून्य होती है।",
            "crop-sunflower-tips": "गहरी जड़ों को प्रोत्साहित करने के लिए गहरा लेकिन कम बार पानी दें। फूलों की कली के सड़ने को रोकने के लिए ऊपर से पानी देने से बचें।",
            "crop-sorghum-tips": "यदि वर्षा अपर्याप्त हो, तो महत्वपूर्ण बूटिंग और अनाज भरने के चरणों के दौरान सिंचाई प्रदान करें।",
            "crop-marigold-tips": "अत्यधिक पानी देने से बचें जिससे जड़ें सड़ जाती हैं और फूलों की संख्या कम हो जाती है। झाड़ीदार विकास और अधिक कलियों को प्रोत्साहित करने के लिए विकास युक्तियों को जल्दी पिंच करें।",
            "crop-rose-tips": "सीधे जड़ों में पानी दें, काले धब्बों को रोकने के लिए पत्तियों को गीला करने से बचें। महीने में एक बार नाइट्रोजन और पोटाश से खाद दें।",
            "crop-jasmine-tips": "मुख्य फूल आने के मौसम (गर्मी/मानसून) के दौरान नियमित रूप से सिंचाई करें। नई लकड़ी और फूलों को प्रोत्साहित करने के लिए फूल आने के बाद छंटाई करें।",
            "crop-rice-cons": "पानी की 30% तक बचत करने के लिए लगातार बाढ़ के बजाय वैकल्पिक गीला और सूखा (AWD) तरीका लागू करें।",
            "crop-wheat-cons": "पानी को समान रूप से वितरित करने और वाष्पीकरण के नुकसान को कम करने के लिए स्प्रिंकलर सिंचाई प्रणालियों का उपयोग करें।",
            "crop-cotton-cons": "वाष्पीकरण को सीमित करने और पानी की दक्षता को अधिकतम करने के लिए काली मिट्टी के मल्च के नीचे ड्रिप सिंचाई का उपयोग करें।",
            "crop-maize-cons": "मेड़-और-नाली (Ridge-and-furrow) रोपण का अभ्यास करें। जड़ों के पास नमी केंद्रित करने के लिए केवल नालियों में पानी दें।",
            "crop-potato-cons": "90% तक जल अनुप्रयोग दक्षता प्राप्त करने के लिए प्लास्टिक मल्च के नीचे बिछाई गई ड्रिप नलियों का उपयोग करें।",
            "crop-tomato-cons": "मिट्टी की नमी को 40% अधिक बनाए रखने के लिए पौधों के आधार के आसपास जैविक मल्च (पुआल/नारियल की भूसी) लगाएं।",
            "crop-groundnut-cons": "मिट्टी को सख्त होने से बचाने के लिए फली बनने के दौरान स्प्रिंकलर सिंचाई से बचें। इसके बजाय ड्रिप टेप का उपयोग करें।",
            "crop-sugarcane-cons": "वाष्पीकरण को नाटकीय रूप से कम करने और खरपतवार के विकास को रोकने के लिए फसल की पंक्तियों के बीच कचरा-मल्चिंग (Trash-mulching) का उपयोग करें।",
            "crop-soybean-cons": "बिना जुताई वाली खेती खेत पर पिछली फसल के अवशेषों को रखती है, जिससे महत्वपूर्ण मिट्टी के पानी के भंडार सुरक्षित रहते हैं।",
            "crop-mustard-cons": "बाढ़ सिंचाई की तुलना में फूल आने के दौरान एक एकल माइक्रो-स्प्रिंकलर सत्र अत्यधिक जल-कुशल है।",
            "crop-barley-cons": "लेजर लैंड लेवलिंग का लाभ उठाएं ताकि पानी बिना किसी बर्बादी के पूरी तरह से वितरित हो सके।",
            "crop-chickpea-cons": "पानी के संरक्षण और कवक जनित जड़ सड़न को रोकने के लिए चौड़ी क्यारी प्रणालियों में नाली सिंचाई पर भरोसा करें।",
            "crop-sunflower-cons": "नालीदार बाढ़ सिंचाई की तुलना में पानी की 45% तक बचत करने के लिए सीधे पंक्तियों के साथ ड्रिप सिंचाई पाइपों का उपयोग करें।",
            "crop-sorghum-cons": "यदि गहरी जड़ वाले क्षेत्र में अवशिष्ट नमी हो, तो सिंचाई से बचने के लिए मिट्टी की नमी सेंसर का उपयोग करें।",
            "crop-marigold-cons": "नमी के वाष्पीकरण को रोकने और जड़ों को ठंडा रखने के लिए क्यारियों के आसपास हल्की सूखी घास (मल्चिंग) लगाएं।",
            "crop-rose-cons": "वाष्पीकरण के नुकसान को कम करने के लिए केवल सुबह जल्दी पानी देने के लिए टाइमर के साथ स्वचालित ड्रिप प्रणालियों का उपयोग करें।",
            "crop-jasmine-cons": "नमी को बनाए रखने के लिए झाड़ी के चारों ओर थाला (Basin) विधि से सिंचाई करें और घनी जैविक खाद का उपयोग करें।",
            "tab-soillab": "मिट्टी प्रयोगशाला",
            "soillab-title": "एआई मिट्टी विश्लेषण प्रयोगशाला",
            "soillab-subtitle": "एआई-संचालित लैब रिपोर्ट प्राप्त करने के लिए अपने मिट्टी के नमूने का वर्णन करें।",
            "soillab-color": "मिट्टी का रंग",
            "soillab-texture": "बनावट का अहसास",
            "soillab-moisture": "नमी का स्तर",
            "soillab-organic": "जैविक पदार्थ के संकेत",
            "soillab-ph": "पीएच स्ट्रिप रीडिंग",
            "soillab-area": "खेत का क्षेत्रफल (एकड़)",
            "btn-analyze-soil": "मिट्टी का नमूना विश्लेषण करें",
            "soillab-placeholder-title": "मिट्टी विश्लेषण रिपोर्ट",
            "soillab-placeholder-desc": "बाईं ओर अपने मिट्टी के नमूने की टिप्पणियां भरें और विस्तृत एआई लैब रिपोर्ट बनाने के लिए \"मिट्टी का नमूना विश्लेषण करें\" पर क्लिक करें।",
            "sl-color-dark": "गहरा काला / चारकोल",
            "sl-color-red": "लालिमा युक्त भूरा",
            "sl-color-light": "हल्का भूरा / तन",
            "sl-color-grey": "धूसर / राखी",
            "sl-color-yellow": "पीलापन लिए",
            "sl-tex-sticky": "चिपचिपी / चिकनी मिट्टी जैसी",
            "sl-tex-smooth": "चिकनी / रेशमी (गाद)",
            "sl-tex-gritty": "दानेदार / रेतीली",
            "sl-tex-crumbly": "भुरभुरी / दोमट",
            "sl-moist-waterlogged": "जलभराव / संतृप्त",
            "sl-moist-moist": "नम / गीली",
            "sl-moist-dry": "सूखी",
            "sl-moist-verydry": "बहुत सूखी / दरारें",
            "sl-org-worms": "केंचुए",
            "sl-org-decayed": "सड़ी पत्तियां",
            "sl-org-roots": "जड़ के टुकड़े",
            "sl-org-fungal": "कवक वृद्धि",
            "soillab-hero-title": "एआई मिट्टी स्वास्थ्य रिपोर्ट",
            "soillab-hero-subtitle": "दृश्य और स्पर्श मिट्टी अवलोकनों से उत्पन्न",
            "soillab-health-label": "मिट्टी का स्वास्थ्य",
            "soillab-nutrient-title": "अनुमानित पोषक तत्व प्रोफ़ाइल",
            "soillab-ph-title": "पीएच विश्लेषण और अम्लता प्रोफ़ाइल",
            "soillab-crop-title": "फसल अनुकूलता रैंकिंग",
            "soillab-amend-title": "मिट्टी सुधार सिफारिशें",
            "soillab-n": "नाइट्रोजन (N)",
            "soillab-p": "फॉस्फोरस (P)",
            "soillab-k": "पोटेशियम (K)",
            "soillab-fe": "लोहा (Fe)",
            "soillab-zn": "जस्ता (Zn)",
            "soillab-om": "जैविक पदार्थ",
            "soillab-low": "कम",
            "soillab-medium": "मध्यम",
            "soillab-high": "उच्च",
            "soillab-crop-name": "Crop",
            "soillab-crop-match": "Match",
            "soillab-crop-fert": "Fertilizer Suggestion",
            "soillab-crop-rating": "Rating"
        },
        es: { "weather-clear": "Cielo Despejado", "weather-cloudy": "Parcialmente Nublado", "weather-fog": "Neblina", "weather-drizzle": "Llovizna Ligera", "weather-rain": "Lluvioso", "weather-snow": "Nevado", "weather-showers": "Aguaceros Fuertes", "weather-storm": "Tormenta Eléctrica" },
        fr: { "weather-clear": "Ciel Dégagé", "weather-cloudy": "Partiellement Nuageux", "weather-fog": "Brouillard", "weather-drizzle": "Bruine Légère", "weather-rain": "Pluvieux", "weather-snow": "Neigeux", "weather-showers": "Fortes Averses", "weather-storm": "Orageux" },
        te: { "weather-clear": "నిర్మలమైన ఆకాశం", "weather-cloudy": "పాక్షికంగా మబ్బులు", "weather-fog": "పొగమంచు", "weather-drizzle": "చిరుజల్లులు", "weather-rain": "వర్షం", "weather-snow": "మంచు కురుస్తోంది", "weather-showers": "భారీ వర్షం", "weather-storm": "ఉరుములతో కూడిన వర్షం" },
        ta: { "weather-clear": "தெளிவான வானம்", "weather-cloudy": "பகுதி மேகமூட்டம்", "weather-fog": "பனிமூட்டம்", "weather-drizzle": "சாரல் மழை", "weather-rain": "மழை", "weather-snow": "பனிப்பொழிவு", "weather-showers": "கனமழை", "weather-storm": "இடியுடன் கூடிய மழை" },
        mr: { "weather-clear": "निरभ्र आकाश", "weather-cloudy": "अंशतः ढगाळ", "weather-fog": "धुके", "weather-drizzle": "हलकी रिमझिम", "weather-rain": "पाऊस", "weather-snow": "बर्फवृष्टी", "weather-showers": "मुसळधार पाऊस", "weather-storm": "वादळी पाऊस" },
        bn: { "weather-clear": "মেঘমুক্ত আকাশ", "weather-cloudy": "আংশিক মেঘলা", "weather-fog": "কুয়াশাচ্ছন্ন", "weather-drizzle": "হালকা গুঁড়ি গুঁড়ি বৃষ্টি", "weather-rain": "বৃষ্টিপাত", "weather-snow": "তুষারপাত", "weather-showers": "ভারী বর্ষণ", "weather-storm": "বজ্রঝড়" },
        pa: { "weather-clear": "ਸਾਫ਼ ਅਸਮਾਨ", "weather-cloudy": "ਆਸ਼ਿਕ ਬੱਦਲਵਾਈ", "weather-fog": "ਧੁੰਦ", "weather-drizzle": "ਹਲਕੀ ਬੂੰਦਾ-ਬਾਂਦੀ", "weather-rain": "ਮੀਂਹ", "weather-snow": "ਬਰਫ਼ਬਾਰੀ", "weather-showers": "ਭਾਰੀ ਮੀਂਹ", "weather-storm": "ਝੱਖੜ / ਹਨੇਰੀ" }
    };

    if (weatherTranslations[state.lang] && weatherTranslations[state.lang][descKey]) {
        return weatherTranslations[state.lang][descKey];
    }
    return defaultDesc;
}

// ==========================================================================
// 6. Weather API Integration (Open-Meteo Keyless API)
// ==========================================================================

async function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=auto`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather service returned error");

        const data = await response.json();

        // Parse current weather
        state.weather.current = {
            temp: data.current.temperature_2m,
            feelsLike: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            precipProb: data.daily.precipitation_probability_max[0] || 0,
            windSpeed: data.current.wind_speed_10m,
            pressure: data.current.surface_pressure,
            code: data.current.weather_code,
            uv: 6.5 // Open-Meteo current UV is in a separate block; let's simulate UV based on weather code (clear = high, storm = low)
        };

        if (state.weather.current.code >= 61) state.weather.current.uv = 1.2;
        else if (state.weather.current.code >= 1) state.weather.current.uv = 4.0;

        // Parse 5-day forecast
        state.weather.daily = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const forecastDate = new Date(today);
            forecastDate.setDate(today.getDate() + i);

            state.weather.daily.push({
                date: forecastDate,
                code: data.daily.weather_code[i],
                tempMax: data.daily.temperature_2m_max[i],
                tempMin: data.daily.temperature_2m_min[i],
                precipProb: data.daily.precipitation_probability_max[i],
                precipSum: data.daily.precipitation_sum[i]
            });
        }

        state.weather.fetched = true;
        return true;
    } catch (error) {
        console.warn("Weather fetch failed, utilizing mathematical agricultural fallback: ", error);
        generateMockWeather(lat);
        return false;
    }
}

// Generate highly realistic mock weather based on latitude (e.g. tropical vs temperate vs winter seasons)
function generateMockWeather(lat) {
    // Basic seasonal estimation based on latitude
    const isTropical = Math.abs(lat) < 23.5;
    const isSouthernHemisphere = lat < 0;

    // Let's create logical defaults
    const currentMonth = new Date().getMonth(); // 0-11
    let baseTemp = 24.0;

    let humidity = 65;

    if (isTropical) {
        baseTemp = 28.0;
        humidity = 75;
    } else {
        // Temperate climate variation
        if (currentMonth >= 4 && currentMonth <= 8) { // Summer in Northern
            baseTemp = isSouthernHemisphere ? 12.0 : 26.0;
            humidity = isSouthernHemisphere ? 75 : 55;
        } else { // Winter in Northern
            baseTemp = isSouthernHemisphere ? 25.0 : 10.0;
            humidity = isSouthernHemisphere ? 55 : 78;
        }
    }

    state.weather.current = {
        temp: baseTemp,
        feelsLike: baseTemp + (humidity > 70 ? 2.5 : -1.0),
        humidity: humidity,
        precipProb: 20,
        windSpeed: 12.5,
        pressure: 1012,
        code: 1, // Partly cloudy
        uv: baseTemp > 25 ? 8.0 : 3.5
    };

    state.weather.daily = [];
    const today = new Date();

    // Dynamic rain simulation for the 5-day cycle
    const rainyDayIndex = Math.floor(Math.random() * 7); // Pick one day to have potential rain

    for (let i = 0; i < 7; i++) {
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + i);

        let code = 0; // Clear
        let precipSum = 0;
        let precipProb = 10;

        if (i === rainyDayIndex) {
            code = 63; // Moderate Rain
            precipSum = 12.5; // mm
            precipProb = 85;
        } else if (Math.random() > 0.6) {
            code = 2; // Cloudy
            precipProb = 30;
        }

        state.weather.daily.push({
            date: forecastDate,
            code: code,
            tempMax: baseTemp + Math.random() * 4,
            tempMin: baseTemp - 5 - Math.random() * 3,
            precipProb: precipProb,
            precipSum: precipSum
        });
    }

    state.weather.fetched = true;
}

// ==========================================================================
// 7. Core Agronomic Logic (Growth Feasibility & FAO-56 Models)
// ==========================================================================

function analyzeGrowthSuitability() {
    const crop = state.crop;
    const soil = state.soil;
    const weather = state.weather;

    if (!crop || !soil || !weather.current) return;

    let score = 100;
    const diagnostics = [];
    const lang = state.lang;

    // --- 1. Temperature Analysis ---
    // Calculate average forecasted temp
    const temps = weather.daily.map(d => (d.tempMax + d.tempMin) / 2);
    const avgForecastTemp = temps.reduce((a, b) => a + b, 0) / temps.length;

    const tempOptimalMin = crop.tempMin;
    const tempOptimalMax = crop.tempMax;

    if (avgForecastTemp >= tempOptimalMin && avgForecastTemp <= tempOptimalMax) {
        diagnostics.push({
            status: "optimal",
            titleEn: "Optimal Growing Temperature",
            titleHi: "इष्टतम बढ़ते तापमान",
            titleEs: "Temperatura de Crecimiento Óptima",
            titleFr: "Température de Croissance Idéale",
            titleTe: "అనుకూలమైన ఉష్ణోగ్రత",
            titleTa: "உகந்த வளர்ச்சி வெப்பநிலை",
            titleMr: "पीक वाढीसाठी योग्य तापमान",
            titleBn: "অনুকূল ক্রমবর্ধমান তাপমাত্রা",
            titlePa: "ਵਾਧੇ ਲਈ ਅਨੁਕੂਲ ਤਾਪਮਾਨ",
            descEn: `Average forecasted temperature of ${avgForecastTemp.toFixed(1)}°C fits crop's preferred range (${tempOptimalMin}°C - ${tempOptimalMax}°C).`,
            descHi: `औसत अनुमानित तापमान ${avgForecastTemp.toFixed(1)}°C फसल की पसंदीदा सीमा (${tempOptimalMin}°C - ${tempOptimalMax}°C) में है।`,
            descEs: `La temperatura promedio prevista de ${avgForecastTemp.toFixed(1)}°C se ajusta al rango preferido del cultivo (${tempOptimalMin}°C - ${tempOptimalMax}°C).`,
            descFr: `La température moyenne prévue de ${avgForecastTemp.toFixed(1)}°C correspond à la plage préférée de la culture (${tempOptimalMin}°C - ${tempOptimalMax}°C).`,
            descTe: `సగటు ఉష్ణోగ్రత ${avgForecastTemp.toFixed(1)}°C పంటకు కావలసిన పరిమితి (${tempOptimalMin}°C - ${tempOptimalMax}°C) లో ఉంది.`,
            descTa: `சராசரி வெப்பநிலை ${avgForecastTemp.toFixed(1)}°C பயிரின் உகந்த எல்லைக்குள் (${tempOptimalMin}°C - ${tempOptimalMax}°C) உள்ளது.`,
            descMr: `सरासरी हवामान तापमान ${avgForecastTemp.toFixed(1)}°C पिकाच्या योग्य मर्यादेत (${tempOptimalMin}°C - ${tempOptimalMax}°C) आहे.`,
            descBn: `গড় তাপমাত্রা ${avgForecastTemp.toFixed(1)}°C ফসলের পছন্দের সীমার (${tempOptimalMin}°C - ${tempOptimalMax}°C) মধ্যে রয়েছে।`,
            descPa: `ਔਸਤ ਤਾਪਮਾਨ ${avgForecastTemp.toFixed(1)}°C ਫ਼ਸਲ ਦੇ ਅਨੁਕੂਲ ਘੇਰੇ (${tempOptimalMin}°C - ${tempOptimalMax}°C) ਵਿੱਚ ਹੈ।`
        });
    } else {
        // Temperature stress
        let severity = "warning";
        let diff = 0;

        if (avgForecastTemp < tempOptimalMin) {
            diff = tempOptimalMin - avgForecastTemp;
            const penalty = Math.min(diff * 5, 45);
            score -= penalty;
            severity = diff > 8 ? "danger" : "warning";

            diagnostics.push({
                status: severity,
                titleEn: "Cold Temperature Stress",
                titleHi: "कम तापमान का तनाव",
                titleEs: "Estrés por Temperatura Fría",
                titleFr: "Stress du au Froid",
                titleTe: "తక్కువ ఉష్णోగ్రత ప్రభావం",
                titleTa: "குளிர் வெப்பநிலை பாதிப்பு",
                titleMr: "कमी तापमानाचा ताण",
                titleBn: "শৈত্যপ্রবাহের চাপ",
                titlePa: "ਘੱਟ ਤਾਪਮਾਨ ਦਾ ਤਣਾਅ",
                descEn: `Forecasted temperature (${avgForecastTemp.toFixed(1)}°C) is below the crop's vegetative minimum (${tempOptimalMin}°C), slowing growth.`,
                descHi: `पूर्वानुमानित तापमान (${avgForecastTemp.toFixed(1)}°C) फसल के न्यूनतम बढ़ते तापमान (${tempOptimalMin}°C) से कम है, जिससे विकास धीमा हो जाएगा।`,
                descEs: `La temperatura prevista (${avgForecastTemp.toFixed(1)}°C) es inferior al mínimo vegetativo del cultivo (${tempOptimalMin}°C), lo que ralentiza el crecimiento.`,
                descFr: `La température prévue (${avgForecastTemp.toFixed(1)}°C) est inférieure au minimum végétatif de la culture (${tempOptimalMin}°C), ralentissant la croissance.`,
                descTe: `వాతావరణ ఉష్ణోগ্রత (${avgForecastTemp.toFixed(1)}°C) పంటకు కావలసిన కనీస ఉష్ణోగ్రత (${tempOptimalMin}°C) కంటే తక్కువగా ఉంది, ఇది ఎదుగుదలను తగ్గిస్తుంది.`,
                descTa: `முன்னறிவிக்கப்பட்ட வெப்பநிலை (${avgForecastTemp.toFixed(1)}°C) பயிரின் குறைந்தபட்ச உகந்த அளவைவிட (${tempOptimalMin}°C) குறைவாக இருப்பதால் வளர்ச்சி மெதுவாகும்.`,
                descMr: `अंदाजीत तापमान (${avgForecastTemp.toFixed(1)}°C) पिकाच्या किमान मर्यादेपेक्षा (${tempOptimalMin}°C) कमी आहे, यामुळे पिकाची वाढ मंदावेल.`,
                descBn: `পূর্বাভাসকৃত তাপমাত্রা (${avgForecastTemp.toFixed(1)}°C) ফসলের ন্যূনতম ক্রমবর্ধমান তাপমাত্রা (${tempOptimalMin}°C) এর চেয়ে কম, ফলে বৃদ্ধি ধীর হবে।`,
                descPa: `ਅੰਦਾਜ਼ਾ ਤਾਪਮਾਨ (${avgForecastTemp.toFixed(1)}°C) ਫ਼ਸਲ ਦੇ ਘੱਟੋ-ਘੱਟ ਵਧਣ ਵਾਲੇ ਤਾਪਮਾਨ (${tempOptimalMin}°C) ਤੋਂ ਘੱਟ ਹੈ, ਜਿਸ ਨਾਲ ਵਾਧਾ ਮੱਠਾ ਪਵੇਗਾ।`
            });
        } else {
            diff = avgForecastTemp - tempOptimalMax;
            const penalty = Math.min(diff * 5, 45);
            score -= penalty;
            severity = diff > 8 ? "danger" : "warning";

            diagnostics.push({
                status: severity,
                titleEn: "Heat Temperature Stress",
                titleHi: "उच्च तापमान का तनाव",
                titleEs: "Estrés por Alta Temperatura",
                titleFr: "Stress Thermique du au Chaud",
                titleTe: "అధిక వేడి ప్రభావం",
                titleTa: "அதிக வெப்ப தாக்கம்",
                titleMr: "अति उष्णतेचा ताण",
                titleBn: "অতিরিক্ত গরমের চাপ",
                titlePa: "ਗਰਮੀ ਦਾ ਤਣਾਅ",
                descEn: `Forecasted temperature (${avgForecastTemp.toFixed(1)}°C) exceeds the crop's threshold (${tempOptimalMax}°C), raising water loss and evaporation risks.`,
                descHi: `पूर्वानुमानित तापमान (${avgForecastTemp.toFixed(1)}°C) फसल की सीमा (${tempOptimalMax}°C) से अधिक है, जिससे वाष्पीकरण और पानी के नुकसान का खतरा बढ़ जाएगा।`,
                descEs: `La temperatura prevista (${avgForecastTemp.toFixed(1)}°C) supera el límite del cultivo (${tempOptimalMax}°C), aumentando los riesgos de evaporación y pérdida de agua.`,
                descFr: `La température prévue (${avgForecastTemp.toFixed(1)}°C) dépasse le seuil de la culture (${tempOptimalMax}°C), augmentant les risques d'évaporation et de perte d'eau.`,
                descTe: `వాతావరణ ఉష్ణోగ్రత (${avgForecastTemp.toFixed(1)}°C) పంటకు కావలసిన గరిష్ట ఉష్ణోగ్రత (${tempOptimalMax}°C) కంటే ఎక్కువగా ఉంది, ఇది నీటి నష్టాన్ని పెంచుతుంది.`,
                descTa: `முன்னறிவிக்கப்பட்ட வெப்பநிலை (${avgForecastTemp.toFixed(1)}°C) பயிரின் அதிகபட்ச எல்லையைவிட (${tempOptimalMax}°C) ಹೆಚ್ಚாக உள்ளதால், நீர் ஆவியாதல் அதிகரிக்கும்.`,
                descMr: `अंदाजीत तापमान (${avgForecastTemp.toFixed(1)}°C) पिकाच्या कमाल मर्यादेपेक्षा (${tempOptimalMax}°C) जास्त आहे, बाष्पीभवन वेगाने होईल.`,
                descBn: `পূর্বাভাসকৃত তাপমাত্রা (${avgForecastTemp.toFixed(1)}°C) ফসলের সহ্যসীমার (${tempOptimalMax}°C) চেয়ে বেশি, যা বাষ্পীভবন ও জলের ঘাটতি বাড়াবে।`,
                descPa: `ਅੰਦਾਜ਼ਾ ਤਾਪਮਾਨ (${avgForecastTemp.toFixed(1)}°C) ਫ਼ਸਲ ਦੀ ਸਹਿਣ-ਸੀਮਾ (${tempOptimalMax}°C) ਤੋਂ ਵੱਧ ਹੈ, ਜਿਸ ਨਾਲ ਪਾਣੀ ਦੇ ਨੁਕਸਾਨ ਦਾ ਖਤਰਾ ਵਧੇਗਾ।`
            });
        }
    }

    // --- 2. Soil Texture Compatibility Analysis ---
    const isSoilIdeal = crop.suitableSoils.includes(soil.id);

    if (isSoilIdeal) {
        diagnostics.push({
            status: "optimal",
            titleEn: "Optimal Soil Texture Compatibility",
            titleHi: "अनुकूल मिट्टी की बनावट",
            titleEs: "Compatibilidad del Suelo Óptima",
            titleFr: "Texture du Sol Compatible",
            titleTe: "నేల రకం పంటకు చాలా అనుకూలం",
            titleTa: "மண் வகை பயிருக்கு மிகவும் உகந்தது",
            titleMr: "जमिनीची पोत पीक पोषक आहे",
            titleBn: "মাটির গঠন ফসলের জন্য উপযুক্ত",
            titlePa: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਫ਼ਸਲ ਲਈ ਉੱਤਮ",
            descEn: `${getText(soil.nameKey, lang)} is highly suitable for growing ${getText(crop.nameKey, lang)}. It supports ideal drainage and anchorage.`,
            descHi: `${getText(soil.nameKey, lang)}, ${getText(crop.nameKey, lang)} उगाने के लिए अत्यधिक उपयुक्त है। यह इष्टतम जल निकासी और जड़ों को सहारा देता है।`,
            descEs: `El ${getText(soil.nameKey, lang)} es muy adecuado para cultivar ${getText(crop.nameKey, lang)}. Proporciona drenaje y anclaje ideales.`,
            descFr: `Le ${getText(soil.nameKey, lang)} est très approprié pour cultiver le ${getText(crop.nameKey, lang)}. Il offre un drainage et un ancrage optimaux.`,
            descTe: `${getText(crop.nameKey, lang)} పంటకు ${getText(soil.nameKey, lang)} చాలా అనుకూలమైనది. ఇది వేర్లకు గాలి మరియు నీటి పారుదలని అందిస్తుంది.`,
            descTa: `${getText(crop.nameKey, lang)} பயிரிட ${getText(soil.nameKey, lang)} மிகவும் சிறந்தது. இது வேர்களுக்கு சிறந்த காற்றோட்டத்தையும் நீரையும் அளிக்கும்.`,
            descMr: `${getText(soil.nameKey, lang)} ही माती ${getText(crop.nameKey, lang)} लागवडीसाठी अत्यंत फायदेशीर आहे, यामुळे मुळांची वाढ चांगली होईल.`,
            descBn: `${getText(crop.nameKey, lang)} চাষের জন্য ${getText(soil.nameKey, lang)} অত্যন্ত উপযোগী। এটি শিকড়ের বৃদ্ধি ও নিষ্কাশনে সহায়তা করে।`,
            descPa: `${getText(soil.nameKey, lang)}, ${getText(crop.nameKey, lang)} ਉਗਾਉਣ ਲਈ ਬਹੁਤ ਢੁਕਵੀਂ ਹੈ। ਇਹ ਜੜ੍ਹਾਂ ਦੀ ਮਜ਼ਬੂਤੀ ਅਤੇ ਸਹੀ ਨਿਕਾਸ ਪ੍ਰਦਾਨ ਕਰਦੀ ਹੈ।`
        });
    } else {
        // Soil mismatch
        score -= 30;

        // Critical compatibility warnings
        let matchSeverity = "warning";
        let titleEn = "Sub-Optimal Soil Compatibility";
        let titleHi = "असंतुलित मिट्टी की उपयुक्तता";
        let titleEs = "Compatibilidad de Suelo Subóptima";
        let titleFr = "Compatibilité du Sol Sous-optimale";
        let titleTe = "నేల రకం పంటకు అనుకూలించదు";
        let titleTa = "மண் வகை பயிருக்கு ஏற்றதாக இல்லை";
        let titleMr = "जमीन या पिकासाठी मध्यम स्वरूपाची आहे";
        let titleBn = "মাটির গঠন ফসলের অনুকূলে নয়";
        let titlePa = "ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਫ਼ਸਲ ਲਈ ਘੱਟ ਅਨੁਕੂਲ";

        let descEn = `${getText(soil.nameKey, lang)} is not in the primary list of ideal soils for ${getText(crop.nameKey, lang)}. Root aeration or waterlogging issues may occur.`;
        let descHi = `${getText(soil.nameKey, lang)}, ${getText(crop.nameKey, lang)} के लिए आदर्श मिट्टी की सूची में नहीं है। जड़ों में हवा की कमी या जलभराव की समस्या हो सकती है।`;
        let descEs = `El ${getText(soil.nameKey, lang)} no está en la lista de suelos ideales para ${getText(crop.nameKey, lang)}. Pueden ocurrir problemas de aireación de raíces o encharcamiento.`;
        let descFr = `Le ${getText(soil.nameKey, lang)} ne fait pas partie des sols idéaux pour le ${getText(crop.nameKey, lang)}. Des problèmes d'aération des racines ou d'asphyxie peuvent survenir.`;
        let descTe = `${getText(soil.nameKey, lang)} నేల ${getText(crop.nameKey, lang)} పంటకు అంత అనుకూలమైనది కాదు. దీనివల్ల వేర్లకు శ్వాస ఆడే కొరత లేదా బురదగా మారే ప్రమాదం ఉంది.`;
        let descTa = `${getText(soil.nameKey, lang)} மண்ணானது ${getText(crop.nameKey, lang)} பயிருக்கு உகந்த பட்டியிலில் இல்லை. இதனால் வேர்களுக்கு மூச்சுத்திணறல் அல்லது நீர் தேங்கும் பிரச்சனை வரலாம்.`;
        let descMr = `${getText(soil.nameKey, lang)} ही माती ${getText(crop.nameKey, lang)} साठी शिफारशीत नाही. मुळांना हवा न खेळणे किंवा दलदल होणे असे धोके उद्भवू शकतात.`;
        let descBn = `${getText(soil.nameKey, lang)} মাটি ${getText(crop.nameKey, lang)} এর জন্য আদর্শ তালিকার অন্তর্ভুক্ত নয়। শিকড়ে বাতাস চলাচল বা জলবদ্ধতার সমস্যা হতে পারে।`;
        let descPa = `${getText(soil.nameKey, lang)}, ${getText(crop.nameKey, lang)} ਲਈ ਆਦਰਸ਼ ਮਿੱਟੀਆਂ ਦੀ ਸੂਚੀ ਵਿੱਚ ਨਹੀਂ ਹੈ। ਜੜ੍ਹਾਂ ਨੂੰ ਹਵਾ ਨਾ ਮਿਲਣ ਜਾਂ ਪਾਣੀ ਖੜ੍ਹਨ ਦੀ ਸਮੱਸਿਆ ਹੋ ਸਕਦੀ ਹੈ।`;

        // Special high-risk cases
        if ((crop.id === "rice" && soil.id === "sandy") ||
            (crop.id === "groundnut" && (soil.id === "clay" || soil.id === "black-soil")) ||
            (crop.id === "potato" && (soil.id === "clay" || soil.id === "black-soil")) ||
            (crop.id === "chickpea" && (soil.id === "clay" || soil.id === "black-soil"))) {

            score -= 20; // Extra heavy penalty for absolute mismatch
            matchSeverity = "danger";

            titleEn = "Critical Soil-Crop Incompatibility";
            titleHi = "गंभीर मिट्टी-फसल असंगति";
            titleEs = "Incompatibilidad Crítica Suelo-Cultivo";
            titleFr = "Incompatibilité Sol-Culture Critique";
            titleTe = "తీవ్రమైన నేల-పంట అసంగతి";
            titleTa = "கடுமையான மண்-பயிர் பொருந்தாமை";
            titleMr = "माती आणि पीक यांच्यात गंभीर विसंगती";
            titleBn = "মাটি ও ফসলের মারাত্মক অমিল";
            titlePa = "ਮਿੱਟੀ ਅਤੇ ਫ਼ਸਲ ਦੀ ਗੰਭੀਰ ਅਨੁਕੂਲਤਾ";

            if (crop.id === "rice") {
                descEn = `Rice requires flood-like conditions. Sandy soil drains water too rapidly, resulting in extreme water stress and constant nutrient leaching.`;
                descHi = `धान को बाढ़ जैसी जलमग्न परिस्थितियों की आवश्यकता होती है। रेतीली मिट्टी बहुत तेजी से पानी बहा देती है, जिससे फसल पर भारी तनाव और पोषक तत्वों की कमी हो जाती है।`;
                descEs = `El arroz requiere condiciones de inundación. El suelo arenoso drena demasiado rápido, provocando un estrés hídrico extremo y lixiviación constante de nutrientes.`;
                descTe = `వరికి పొలంలో నిల్వ నీరు కావాలి. ఇసుక నేలల్లో నీరు చాలా త్వరగా ఇంకిపోతుంది, దీనివల్ల పంటకు తీవ్రమైన నీటి ఎద్దడి ఏర్పడుతుంది.`;
                descMr = `भाताला साचलेल्या पाण्याची गरज असते. वाळूमिश्रित मातीत पाणी लगेच वाहून जाते, ज्यामुळे पीक वाळून जाण्याची शक्यता असते.`;
                descBn = `ধান চাষের জন্য কাদা ও জলের প্রয়োজন। বেলে মাটিতে জল খুব দ্রুত নিচে চলে যায়, ফলে ফসল জলের চরম সংকটে পড়বে।`;
                descPa = `ਝੋਨੇ ਨੂੰ ਖੜ੍ਹੇ ਪਾਣੀ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ। ਰੇਤਲੀ ਮਿੱਟੀ ਪਾਣੀ ਨੂੰ ਬਹੁਤ ਤੇਜ਼ੀ ਨਾਲ ਨਿਕਾਸ ਕਰ ਦਿੰਦੀ ਹੈ, ਜਿਸ ਨਾਲ ਫ਼ਸਲ ਸੁੱਕ ਸਕਦੀ ਹੈ।`;
            } else {
                descEn = `Root/tuber formation in clayey soil is severely restricted due to compaction. Clay retains excess water, causing root rot and complete harvest failure.`;
                descHi = `चिकनी मिट्टी के सख्त हो जाने के कारण जड़ों/कंदों का विकास बुरी तरह बाधित होता है। मिट्टी अतिरिक्त पानी रोकती है, जिससे जड़ें सड़ जाती हैं।`;
                descEs = `La formación de raíces/tubérculos en suelo arcilloso se ve severamente restringida debido a la compactación. La arcilla retiene exceso de agua, causando pudrición.`;
                descTe = `బంకమట్టి గట్టిగా ఉండటం వల్ల భూమిలోపల పెరిగే దుంపలు/కాయల ఎదుగుదల నిలిచిపోతుంది. నీరు ఎక్కువ కాలం నిలిచి ఉండటం వల్ల కుళ్ళిపోతాయి.`;
                descMr = `चिकनमाती अत्यंत घट्ट असल्यामुळे जमिनीखालील दुंपे/शेंगा यांची वाढ खुंटते. पाणी साचून राहिल्यामुळे मुळे कुजतात.`;
                descBn = `কাদামাটি খুব শক্ত হওয়ায় মাটির নিচের শিকড়/কন্দ বাড়তে পারে না এবং অতিরিক্ত জল জমে গোড়া পচে ফসল নষ্ট হতে পারে।`;
                descPa = `ਚੀਕਣੀ ਮਿੱਟੀ ਦੇ ਸਖ਼ਤ ਹੋਣ ਕਾਰਨ ਜੜ੍ਹਾਂ/ਆਲੂਆਂ ਦਾ ਵਿਕਾਸ ਬੁਰੀ ਤਰ੍ਹਾਂ ਰੁਕ ਜਾਂਦਾ ਹੈ ਅਤੇ ਪਾਣੀ ਖੜ੍ਹਨ ਨਾਲ ਜੜ੍ਹਾਂ ਗਲ ਜਾਂਦੀਆਂ ਹਨ।`;
            }
        }

        diagnostics.push({
            status: matchSeverity,
            titleEn: titleEn,
            titleHi: titleHi,
            titleEs: titleEs,
            titleFr: titleFr,
            titleTe: titleTe,
            titleTa: titleTa,
            titleMr: titleMr,
            titleBn: titleBn,
            titlePa: titlePa,
            descEn: descEn,
            descHi: descHi,
            descEs: descEs,
            descFr: descFr,
            descTe: descTe,
            descTa: descTa,
            descMr: descMr,
            descBn: descBn,
            descPa: descPa
        });
    }

    // --- 3. Rainfall / Excess Water Warning ---
    const totalRainfall = weather.daily.map(d => d.precipSum).reduce((a, b) => a + b, 0);

    if (totalRainfall > 80 && (soil.id === "clay" || soil.id === "black-soil")) {
        score -= 15;
        diagnostics.push({
            status: "danger",
            titleEn: "Waterlogging Risk Detected",
            titleHi: "जलभराव का जोखिम",
            titleEs: "Riesgo de Encharcamiento Detectado",
            titleFr: "Risque d'Engorgement Détecté",
            titleTe: "నీరు నిల్వ ఉండే ప్రమాదం",
            titleTa: "நீர் தேங்குவதற்கான ஆபத்து",
            titleMr: "दलदल होण्याचा धोका",
            titleBn: "জলাবদ্ধতার ঝুঁকি রয়েছে",
            titlePa: "ਪਾਣੀ ਖੜ੍ਹਨ ਦਾ ਖਤਰਾ",
            descEn: `Heavy cumulative rain (${totalRainfall.toFixed(1)} mm) in heavy clay soil will likely saturate the root zone, restricting oxygen access.`,
            descHi: `भारी संचयी वर्षा (${totalRainfall.toFixed(1)} मिमी) और चिकनी मिट्टी के संयोजन से जड़ों में पानी भर जाएगा, जिससे ऑक्सीजन की कमी हो जाएगी।`,
            descEs: `La lluvia acumulada intensa (${totalRainfall.toFixed(1)} mm) en suelo arcilloso probablemente saturará la zona radicular, limitando el oxígeno.`,
            descFr: `Une forte pluie cumulée (${totalRainfall.toFixed(1)} mm) dans un sol argileux saturera la zone racinaire, limitant l'accès à l'oxygène.`,
            descTe: `అధిక వర్షపాతం (${totalRainfall.toFixed(1)} మిమీ) మరియు బంకమట్టి కలయిక వల్ల పొలంలో నీరు నిలిచిపోయి వేర్లకు ఊపిరి ఆడదు.`,
            descTa: `அதிக மழைப்பொழிவு (${totalRainfall.toFixed(1)} மிமீ) மற்றும் களிమண் சேர்க்கையால் வேர்ப்பகுதியில் நீர் தேங்கி ஆக்ஸிஜன் பற்றாக்குறை ஏற்படும்.`,
            descMr: `जास्त पाऊस (${totalRainfall.toFixed(1)} मिमी) आणि चिकनमाती यामुळे शेतात दलदल तयार होऊन मुळांचे नुकसान होऊ शकते.`,
            descBn: `ভারী বৃষ্টিপাত (${totalRainfall.toFixed(1)} মিমি) ও কাদামাটি/কালো মাটির সংমিশ্রণে শিকড় অঞ্চলে জলাবদ্ধতা তৈরি হয়ে বাতাস চলাচল বন্ধ হতে পারে।`,
            descPa: `ਭਾਰੀ ਮੀਂਹ (${totalRainfall.toFixed(1)} ਮਿਲੀਮੀਟਰ) ਅਤੇ ਚੀਕਣੀ ਮਿੱਟੀ ਕਾਰਨ ਜੜ੍ਹਾਂ ਵਾਲੇ ਹਿੱਸੇ ਵਿੱਚ ਪਾਣੀ ਖੜ੍ਹ ਜਾਵੇਗਾ, ਜਿਸ ਨਾਲ ਹਵਾ ਦੀ ਕਮੀ ਹੋਵੇਗੀ।`
        });
    }

    // Ensure score does not drop below 5%
    state.suitability.score = Math.max(score, 5);

    // Verdict
    if (state.suitability.score >= 80) {
        state.suitability.verdict = "Optimal";
    } else if (state.suitability.score >= 50) {
        state.suitability.verdict = "Sub-Optimal";
    } else {
        state.suitability.verdict = "Critical / High Risk";
    }

    state.suitability.diagnostics = diagnostics;
}

// Calculate the schedule based on FAO-56 Penman-Monteith logic
// Ref Evapotranspiration (ET0) is estimated using temp, wind, humidity.
// Crop Water Requirement (ETc) = ET0 * Kc.
// Deficit = ETc - Rainfall.
function calculateIrrigationSchedule() {
    const crop = state.crop;
    const soil = state.soil;
    const stage = state.stage;
    const weather = state.weather;

    if (!crop || !soil || weather.daily.length === 0) return;

    const cropCoefficient = crop.kc[stage] || 0.8;
    const schedule = [];
    let totalWaterNeeded = 0;

    weather.daily.forEach((day, index) => {
        // 1. Estimate reference evapotranspiration (ET0) for the day
        // Formula captures: solar radiation (temp proxy), temperature, wind speed, relative humidity
        // Lower humidity & higher temp & higher wind -> higher evapotranspiration
        const avgTemp = (day.tempMax + day.tempMin) / 2;
        const rhFactor = (100 - (index === 0 ? weather.current.humidity : 60)) / 100; // Proxy for relative humidity
        const windFactor = 1 + ((index === 0 ? weather.current.windSpeed : 12.0) / 20); // Proxy for wind speed

        let et0 = 1.2 + (avgTemp * 0.12) * rhFactor * windFactor;
        et0 = Math.max(et0, 1.0); // Minimum 1mm evapotranspiration per day

        // 2. Crop evapotranspiration (ETc)
        const etc = et0 * cropCoefficient;

        // 3. Subtract rainfall (account for effective rainfall, roughly 75% of actual rainfall)
        const effectiveRain = day.precipSum * 0.75;

        // 4. Calculate soil moisture deficit
        // Clay soil holds moisture longer (deficit accumulates slower), Sandy soil dries instantly
        const soilHoldingCapacityFactor = soil.retention / 100;

        // Deficit = ETc - effectiveRain
        // Adjust deficit based on soil drainage: sandy soil drains, so the water required is higher
        let deficit = etc - effectiveRain;

        if (soil.id === "sandy") {
            deficit *= 1.25; // Soil doesn't hold water, needs more irrigation frequency
        } else if (soil.id === "clay" || soil.id === "black-soil") {
            deficit *= 0.85; // Soil retains water, holds onto previous rain/irrigation
        }

        let waterRequired = 0;
        let actionKey = "";
        let actionText = "";

        if (deficit > 1.5) {
            waterRequired = Math.ceil(deficit);
            actionKey = "action-irrigate";

            // Best time selection based on wind & temp
            if (avgTemp > 28) {
                actionText = "Irrigate: Late Evening (Reduce evapotranspiration)";
            } else {
                actionText = "Irrigate: Early Morning (Optimal)";
            }
        } else {
            waterRequired = 0;
            actionKey = "action-skip";

            if (effectiveRain > 2.0) {
                actionText = `Skip: Forecasted rain of ${day.precipSum.toFixed(1)}mm covers crop needs.`;
            } else {
                actionText = "Skip: Soil moisture is adequate.";
            }
        }

        schedule.push({
            date: day.date,
            tempMax: day.tempMax,
            tempMin: day.tempMin,
            rain: day.precipSum,
            deficit: Math.max(deficit, 0),
            waterRequired: waterRequired,
            actionKey: actionKey,
            actionText: actionText
        });

        totalWaterNeeded += waterRequired;
    });

    state.recommendation.schedule = schedule;
    state.recommendation.weeklyAvg = totalWaterNeeded / 5;

    // Add custom crop tips and conservation tips
    // Translating descriptions/tips statically or using dictionary key lookups
    state.recommendation.criticalTips = [
        getText(crop.tipsKey, state.lang),
        state.lang === "en" ? `Soil texture notes: ${getText(soil.nameKey, state.lang)} has a water retention rating of ${soil.retention}%.` :
            state.lang === "hi" ? `मिट्टी की विशेषताएं: ${getText(soil.nameKey, state.lang)} की जल धारण रेटिंग ${soil.retention}% है।` :
                state.lang === "es" ? `Notas del suelo: El ${getText(soil.nameKey, state.lang)} tiene una retención de agua de ${soil.retention}%.` :
                    state.lang === "fr" ? `Notes de sol: Le ${getText(soil.nameKey, state.lang)} a un taux de rétention d'eau de ${soil.retention}%.` :
                        state.lang === "te" ? `నేల గమనికలు: ${getText(soil.nameKey, state.lang)} నీటిని పట్టి ఉంచే సామర్థ్యం ${soil.retention}% ఉంది.` :
                            state.lang === "ta" ? `மண் குறிப்புகள்: ${getText(soil.nameKey, state.lang)} மண்ணானது ${soil.retention}% நீர் பிடிப்பு கொண்டது.` :
                                state.lang === "mr" ? `माती नोंद: ${getText(soil.nameKey, state.lang)} मातीची जलधारण क्षमता ${soil.retention}% आहे.` :
                                    state.lang === "bn" ? `মাটির তথ্য: ${getText(soil.nameKey, state.lang)} মাটির জল ধারণ ক্ষমতা ${soil.retention}%।` :
                                        `ਮਿੱਟੀ ਦੀ ਜਾਣਕਾਰੀ: ${getText(soil.nameKey, state.lang)} ਦੀ ਜਲ-ਧਾਰਨ ਸਮਰੱਥਾ ${soil.retention}% ਹੈ।`,

        state.lang === "en" ? `Ensure irrigation channels are clear during the ${getText("stage-" + stage, state.lang)} stage.` :
            state.lang === "hi" ? `${getText("stage-" + stage, state.lang)} अवस्था के दौरान सिंचाई नालियाँ साफ होनी चाहिए।` :
                state.lang === "es" ? `Asegúrese de que los canales de riego estén despejados durante la etapa de ${getText("stage-" + stage, state.lang)}.` :
                    state.lang === "fr" ? `Assurez-vous que les canaux d'irrigation sont dégagés pendant la phase de ${getText("stage-" + stage, state.lang)}.` :
                        state.lang === "te" ? `${getText("stage-" + stage, state.lang)} దశలో కాల్వలలో పూడిక తీసి ఉంచుకోవాలి.` :
                            state.lang === "ta" ? `${getText("stage-" + stage, state.lang)} நிலையில் வடிகால் வாய்க்கால்கள் அடைப்பின்றி இருக்க வேண்டும்.` :
                                state.lang === "mr" ? `${getText("stage-" + stage, state.lang)} अवस्थेत पाणी वहनाचे मार्ग स्वच्छ ठेवावेत.` :
                                    state.lang === "bn" ? `${getText("stage-" + stage, state.lang)} পর্যায়ে সেচ নালাগুলি পরিষ্কার ও সচল রাখুন।` :
                                        `${getText("stage-" + stage, state.lang)} ਪੜਾਅ ਦੌਰਾਨ ਸਿੰਚਾਈ ਵਾਲੀਆਂ ਖਾਲਾਂ ਸਾਫ਼ ਹੋਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ।`
    ];

    state.recommendation.conservationTips = [
        getText(crop.consKey, state.lang),
        state.lang === "en" ? `For ${getText(soil.nameKey, state.lang)}, organic additions (compost) can reduce water needs by improving structure.` :
            state.lang === "hi" ? `${getText(soil.nameKey, state.lang)} में जैविक खाद मिलाने से मिट्टी की जलधारण क्षमता सुधरती है और पानी की जरूरत कम होती है।` :
                state.lang === "es" ? `Para el ${getText(soil.nameKey, state.lang)}, las adiciones orgánicas (compost) mejoran la estructura reduciendo necesidades.` :
                    state.lang === "fr" ? `Pour le ${getText(soil.nameKey, state.lang)}, les amendements organiques (compost) réduisent les besoins en eau.` :
                        state.lang === "te" ? `${getText(soil.nameKey, state.lang)} నేలలకు సేంద్రీయ ఎరువులు (కంపోస్ట్) వాడటం ద్వారా తేమ నిల్వ పెరిగి నీటి అవసరం తగ్గుతుంది.` :
                            state.lang === "ta" ? `${getText(soil.nameKey, state.lang)} மண்ணில் மட்கிய உரங்களைச் சேர்ப்பதால் கட்டமைப்பு மேம்பட்டு நீர் தேவை குறையும்.` :
                                state.lang === "mr" ? `${getText(soil.nameKey, state.lang)} मातीमध्ये सेंद्रिय खतांचा वापर केल्याने पाणी धरून ठेवण्याची क्षमता वाढेल.` :
                                    state.lang === "bn" ? `${getText(soil.nameKey, state.lang)} মাটির জন্য জৈব সার প্রয়োগ করলে জল ধারণ ক্ষমতা বৃদ্ধি পায় ও জলের ব্যবহার কমে।` :
                                        `${getText(soil.nameKey, state.lang)} ਵਿੱਚ ਰੂੜੀ ਖਾਦ ਮਿਲਾਉਣ ਨਾਲ ਪਾਣੀ ਦੀ ਬਚਤ ਹੁੰਦੀ ਹੈ।`,

        state.lang === "en" ? "Irrigate during cooler windless times to reduce evaporation loss by 35%." :
            state.lang === "hi" ? "वाष्पीकरण के नुकसान को 35% तक कम करने के लिए हवा के बिना ठंडे समय के दौरान सिंचाई करें।" :
                state.lang === "es" ? "Riegue en horarios más fríos y sin viento para reducir la pérdida por evaporación en un 35%." :
                    state.lang === "fr" ? "Irriguez pendant les périodes plus fraîches et sans vent pour réduire les pertes par évaporation de 35%." :
                        state.lang === "te" ? "ఎండ లేని చల్లని ప్రశాంత సమయాల్లో తడులు ఇవ్వడం ద్వారా 35% తేమ ఆవిరి కాకుండా కాపాడుకోవచ్చు." :
                            state.lang === "ta" ? "காற்றற்ற குளிர்ந்த நேரங்களில் பாசனம் செய்வதால் நீர் ஆவியாதல் 35% வரை குறையும்." :
                                state.lang === "mr" ? "उन्हाचा तडाखा नसलेल्या थंड वेळी पाणी दिल्यास ३५% बाष्पीभवन कमी होईल." :
                                    state.lang === "bn" ? "বাষ্পীভবন জনিত অপচয় ৩৫% কমাতে দিনের শীতল ও শান্ত সময়ে সেচ দিন।" :
                                        "ਵਾਸ਼ਪੀਕਰਨ ਨੂੰ 35% ਤੱਕ ਘਟਾਉਣ ਲਈ ਠੰਢੇ ਅਤੇ ਸ਼ਾਂਤ ਸਮੇਂ ਵਿੱਚ ਸਿੰਚਾਈ ਕਰੋ।"
    ];
}

// ==========================================================================
// 8. Interactive UI Controller & Renderer
// ==========================================================================

// Global application translation scanner
const STAGES = [
    { id: "germination", key: "stage-germination" },
    { id: "vegetative", key: "stage-vegetative" },
    { id: "flowering", key: "stage-flowering" },
    { id: "yield", key: "stage-yield" },
    { id: "ripening", key: "stage-ripening" }
];

function resolveLocation(val) {
    if (!val || typeof val !== 'string') return LOCATIONS[0];
    const clean = val.trim().toLowerCase();
    if (!clean) return LOCATIONS[0];

    let loc = LOCATIONS.find(l => l.id.toLowerCase() === clean);
    if (loc) return loc;

    loc = LOCATIONS.find(l =>
        (l.nameEn && l.nameEn.toLowerCase() === clean) ||
        (l.nameHi && l.nameHi.toLowerCase() === clean) ||
        (l.nameEs && l.nameEs.toLowerCase() === clean) ||
        (l.nameFr && l.nameFr.toLowerCase() === clean) ||
        (l.nameTe && l.nameTe.toLowerCase() === clean) ||
        (l.nameTa && l.nameTa.toLowerCase() === clean) ||
        (l.nameMr && l.nameMr.toLowerCase() === clean) ||
        (l.nameBn && l.nameBn.toLowerCase() === clean) ||
        (l.namePa && l.namePa.toLowerCase() === clean)
    );
    if (loc) return loc;

    loc = LOCATIONS.find(l =>
        (l.nameEn && l.nameEn.toLowerCase().includes(clean)) ||
        (l.nameHi && l.nameHi.toLowerCase().includes(clean)) ||
        (l.nameEs && l.nameEs.toLowerCase().includes(clean)) ||
        (l.nameFr && l.nameFr.toLowerCase().includes(clean)) ||
        (l.nameTe && l.nameTe.toLowerCase().includes(clean)) ||
        (l.nameTa && l.nameTa.toLowerCase().includes(clean)) ||
        (l.nameMr && l.nameMr.toLowerCase().includes(clean)) ||
        (l.nameBn && l.nameBn.toLowerCase().includes(clean)) ||
        (l.namePa && l.namePa.toLowerCase().includes(clean))
    );
    if (loc) return loc;

    // Fallback search in memory cache of custom geocoded locations
    if (window._customLocationsCache) {
        const cached = window._customLocationsCache.find(c => c.nameEn.toLowerCase().includes(clean));
        if (cached) return cached;
    }

    return null; // Return null so async geocoder can fetch it live!
}

async function resolveLocationAsync(val) {
    if (!val) return state.location || LOCATIONS[0];

    // First try fast synchronous resolution
    const syncLoc = resolveLocation(val);
    if (syncLoc) return syncLoc;

    const clean = val.trim();

    // If not found in static list, query Open-Meteo Geocoding API for exact coordinates!
    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(clean)}&count=1&language=en`;
        const res = await fetch(geoUrl);
        const data = await res.json();

        if (data && data.results && data.results.length > 0) {
            const r = data.results[0];
            const fullName = `${r.name}${r.admin1 ? ', ' + r.admin1 : ''}${r.country ? ', ' + r.country : ''}`;
            const customLoc = {
                id: `custom-${r.id}`,
                nameEn: fullName,
                nameHi: fullName,
                nameEs: fullName,
                nameFr: fullName,
                nameTe: fullName,
                nameTa: fullName,
                nameMr: fullName,
                nameBn: fullName,
                namePa: fullName,
                lat: r.latitude,
                lon: r.longitude,
                defaultSoil: "loam"
            };

            // Add to cache & datalist
            if (!window._customLocationsCache) window._customLocationsCache = [];
            window._customLocationsCache.push(customLoc);

            if (!LOCATIONS.some(l => l.id === customLoc.id)) {
                LOCATIONS.push(customLoc);
            }

            return customLoc;
        }
    } catch (err) {
        console.warn("Geocoding API search failed, using fallback location", err);
    }

    return state.location || LOCATIONS[0];
}

function resolveSoil(val) {
    if (!val) return null;
    const clean = val.trim().toLowerCase();
    let soil = SOILS.find(s => s.id.toLowerCase() === clean);
    if (soil) return soil;

    soil = SOILS.find(s =>
        getText(s.nameKey, state.lang).toLowerCase() === clean ||
        getText(s.nameKey, "en").toLowerCase() === clean
    );
    if (soil) return soil;

    soil = SOILS.find(s =>
        getText(s.nameKey, state.lang).toLowerCase().includes(clean) ||
        getText(s.nameKey, "en").toLowerCase().includes(clean)
    );
    return soil || SOILS[0];
}

function resolveCrop(val) {
    if (!val) return null;
    const clean = val.trim().toLowerCase();
    let crop = CROPS.find(c => c.id.toLowerCase() === clean);
    if (crop) return crop;

    crop = CROPS.find(c =>
        getText(c.nameKey, state.lang).toLowerCase() === clean ||
        getText(c.nameKey, "en").toLowerCase() === clean
    );
    if (crop) return crop;

    crop = CROPS.find(c =>
        getText(c.nameKey, state.lang).toLowerCase().includes(clean) ||
        getText(c.nameKey, "en").toLowerCase().includes(clean)
    );
    return crop || CROPS[0];
}

function resolveStage(val) {
    if (!val) return "germination";
    const clean = val.trim().toLowerCase();
    let stage = STAGES.find(s => s.id === clean);
    if (stage) return stage.id;

    stage = STAGES.find(s =>
        getText(s.key, state.lang).toLowerCase() === clean ||
        getText(s.key, "en").toLowerCase() === clean
    );
    if (stage) return stage.id;

    stage = STAGES.find(s =>
        getText(s.key, state.lang).toLowerCase().includes(clean) ||
        getText(s.key, "en").toLowerCase().includes(clean)
    );
    return stage ? stage.id : "germination";
}

// Global application translation scanner
function translateDOM() {
    const lang = state.lang;

    // Scan for all tags with data-i18n
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        el.textContent = getText(key, lang);
    });

    // Update placeholder texts for inputs
    const placeholders = {
        "select-location": lang === "hi" ? "क्षेत्र खोजने या टाइप करने के लिए..." :
            lang === "es" ? "Escriba para buscar región..." :
                lang === "fr" ? "Tapez pour rechercher la région..." :
                    lang === "te" ? "ప్రాంతాన్ని టైప్ చేసి వెతకండి..." :
                        lang === "ta" ? "பகுதியைத் தேட தட்டச்சு செய்யவும்..." :
                            lang === "mr" ? "प्रदेश शोधण्यासाठी टाईप करा..." :
                                lang === "bn" ? "অঞ্চল খুঁজতে টাইপ করুন..." :
                                    lang === "pa" ? "ਖੇਤਰ ਲੱਭਣ ਲਈ ਟਾਈਪ ਕਰੋ..." :
                                        "Type to search region...",
        "select-soil": lang === "hi" ? "मिट्टी खोजने या टाइप करने के लिए..." :
            lang === "es" ? "Escriba para buscar suelo..." :
                lang === "fr" ? "Tapez pour rechercher le sol..." :
                    lang === "te" ? "నేల రకాన్ని టైప్ చేసి వెతకండి..." :
                        lang === "ta" ? "மண் வகையைத் தேட தட்டச்சு செய்யவும்..." :
                            lang === "mr" ? "मातीचा प्रकार शोधण्यासाठी टाईप करा..." :
                                lang === "bn" ? "মাটির ধরণ খুঁজতে টাইপ করুন..." :
                                    lang === "pa" ? "ਮਿੱਟੀ ਲੱਭਣ ਲਈ ਟਾਈਪ ਕਰੋ..." :
                                        "Type to search soil...",
        "select-crop": lang === "hi" ? "फसल खोजने या टाइप करने के लिए..." :
            lang === "es" ? "Escriba para buscar cultivo..." :
                lang === "fr" ? "Tapez pour rechercher la culture..." :
                    lang === "te" ? "పంటను టైప్ చేసి వెతకండి..." :
                        lang === "ta" ? "பயிரைத் தேட தட்டச்சு செய்யவும்..." :
                            lang === "mr" ? "पीक शोधण्यासाठी टाईप करा..." :
                                lang === "bn" ? "ফসল খুঁজতে টাইপ করুন..." :
                                    lang === "pa" ? "ਫ਼ਸਲ ਲੱਭਣ ਲਈ ਟਾਈਪ ਕਰੋ..." :
                                        "Type to search crop...",
        "select-stage": lang === "hi" ? "अवस्था खोजने या टाइप करने के लिए..." :
            lang === "es" ? "Escriba para buscar etapa..." :
                lang === "fr" ? "Tapez pour rechercher l'étape..." :
                    lang === "te" ? "పంట దశను టైప్ చేసి వెతకండి..." :
                        lang === "ta" ? "நிலையைத் தேட தட்டச்சு செய்யவும்..." :
                            lang === "mr" ? "अवस्था शोधण्यासाठी टाईप करा..." :
                                lang === "bn" ? "ধাপ খুঁজতে টাইপ করুন..." :
                                    lang === "pa" ? "ਪੜਾਅ ਲੱਭਣ ਲਈ ਟਾਈਪ ਕਰੋ..." :
                                        "Type to search stage..."
    };

    Object.keys(placeholders).forEach(id => {
        const input = document.getElementById(id);
        if (input) input.placeholder = placeholders[id];
    });

    // Update datalists
    updateDropdownOptions();

    // Sync current values in translated names
    if (state.location && dom.selectLocation) {
        const name = lang === "hi" ? state.location.nameHi :
            lang === "es" ? state.location.nameEs :
                lang === "fr" ? state.location.nameFr :
                    lang === "te" ? state.location.nameTe :
                        lang === "ta" ? state.location.nameTa :
                            lang === "mr" ? state.location.nameMr :
                                lang === "bn" ? state.location.nameBn :
                                    lang === "pa" ? state.location.namePa :
                                        state.location.nameEn;
        dom.selectLocation.value = name;
    }
    if (state.soil && dom.selectSoil) {
        dom.selectSoil.value = getText(state.soil.nameKey, lang);
    }
    if (state.crop && dom.selectCrop) {
        dom.selectCrop.value = getText(state.crop.nameKey, lang);
    }
    if (state.stage && dom.selectStage) {
        dom.selectStage.value = getText("stage-" + state.stage, lang);
    }

    // Update active tab contents if loaded
    renderActiveTab();
}

function updateDropdownOptions() {
    const lang = state.lang;

    // 1. Location Datalist
    const locDatalist = document.getElementById("location-options");
    if (locDatalist) {
        locDatalist.innerHTML = "";
        LOCATIONS.forEach(loc => {
            let name = loc.nameEn;
            if (lang === "hi") name = loc.nameHi;
            else if (lang === "es") name = loc.nameEs;
            else if (lang === "fr") name = loc.nameFr;
            else if (lang === "te") name = loc.nameTe;
            else if (lang === "ta") name = loc.nameTa;
            else if (lang === "mr") name = loc.nameMr;
            else if (lang === "bn") name = loc.nameBn;
            else if (lang === "pa") name = loc.namePa;

            const option = document.createElement("option");
            option.value = name;
            locDatalist.appendChild(option);
        });
    }

    // 2. Soil Datalist
    const soilDatalist = document.getElementById("soil-options");
    if (soilDatalist) {
        soilDatalist.innerHTML = "";
        SOILS.forEach(soil => {
            const option = document.createElement("option");
            option.value = getText(soil.nameKey, lang);
            soilDatalist.appendChild(option);
        });
    }

    // 3. Crop Datalist
    const cropDatalist = document.getElementById("crop-options");
    if (cropDatalist) {
        cropDatalist.innerHTML = "";
        CROPS.forEach(crop => {
            const option = document.createElement("option");
            option.value = getText(crop.nameKey, lang);
            cropDatalist.appendChild(option);
        });
    }

    // 4. Stage Datalist
    const stageDatalist = document.getElementById("stage-options");
    if (stageDatalist) {
        stageDatalist.innerHTML = "";
        STAGES.forEach(s => {
            const option = document.createElement("option");
            option.value = getText(s.key, lang);
            stageDatalist.appendChild(option);
        });
    }

    // Education Selectors
    const selectedEduCrop = dom.eduSelectCrop.value;
    dom.eduSelectCrop.innerHTML = "";
    CROPS.forEach(crop => {
        const option = document.createElement("option");
        option.value = crop.id;
        option.textContent = getText(crop.nameKey, lang);
        dom.eduSelectCrop.appendChild(option);
    });
    if (selectedEduCrop) dom.eduSelectCrop.value = selectedEduCrop;

    const selectedEduSoil = dom.eduSelectSoil.value;
    dom.eduSelectSoil.innerHTML = "";
    SOILS.forEach(soil => {
        const option = document.createElement("option");
        option.value = soil.id;
        option.textContent = getText(soil.nameKey, lang);
        dom.eduSelectSoil.appendChild(option);
    });
    if (selectedEduSoil) dom.eduSelectSoil.value = selectedEduSoil;
}

// Renders content depending on the active tab
function renderActiveTab() {
    const tab = state.activeTab;
    const lang = state.lang;

    if (tab === "dashboard") {
        renderFertilizerPesticideSection();
        renderProfitabilitySection();
        renderDashboard();
    } else if (tab === "weather") {
        renderWeatherStation();
    } else if (tab === "schemes") {
        renderGovernmentSchemes();
    } else if (tab === "education") {
        renderEducationCenter();
        renderEducationCenter();
    } else if (tab === "soillab" && state.soilLab.analyzed) {
        renderSoilLabReport();
    }
}

// Tab Switching bind
dom.tabLinks.forEach(link => {
    link.addEventListener("click", () => {
        dom.tabLinks.forEach(item => item.classList.remove("active"));
        dom.tabPanels.forEach(panel => panel.classList.remove("active"));

        link.classList.add("active");
        const panelId = link.getAttribute("data-tab");
        document.getElementById(panelId).classList.add("active");

        state.activeTab = panelId;
        renderActiveTab();
    });
});

// Dashboard Renderer
function renderDashboard() {
    const lang = state.lang;

    // Location and Coordinates displays
    if (state.location) {
        dom.coordsDisplay.textContent = `Lat: ${state.location.lat.toFixed(2)} | Lon: ${state.location.lon.toFixed(2)}`;
    }

    // Soil Profile rendering
    if (state.soil) {
        dom.soilNameTitle.textContent = getText(state.soil.nameKey, lang);
        dom.soilDescText.textContent = getText(state.soil.descKey, lang);
        dom.soilBarRetention.style.width = `${state.soil.retention}%`;
        dom.soilBarDrainage.style.width = `${state.soil.drainage}%`;
        dom.soilVisualAccent.style.backgroundColor = state.soil.color;

        // Render sand/clay particles dynamically
        const graphic = dom.soilVisualAccent;
        // Clear existing particles
        const particles = graphic.querySelectorAll(".soil-particle");
        particles.forEach(p => p.remove());

        // Add particles based on texture values
        const sandCount = Math.floor(state.soil.particles.sand / 8);
        const clayCount = Math.floor(state.soil.particles.clay / 8);

        for (let i = 0; i < sandCount; i++) {
            const p = document.createElement("div");
            p.className = "soil-particle sand";
            p.style.left = `${Math.random() * 85}%`;
            p.style.top = `${Math.random() * 85}%`;
            graphic.appendChild(p);
        }
        for (let i = 0; i < clayCount; i++) {
            const p = document.createElement("div");
            p.className = "soil-particle clay";
            p.style.left = `${Math.random() * 85}%`;
            p.style.top = `${Math.random() * 85}%`;
            graphic.appendChild(p);
        }
    }

    // Weather overview rendering
    if (state.weather.current) {
        const cur = state.weather.current;
        dom.weatherCurrentTemp.textContent = formatTemp(cur.temp);

        const interpreted = interpretWeatherCode(cur.code);
        dom.weatherCurrentDesc.textContent = getWeatherDesc(interpreted.descKey, interpreted.defaultDesc);
        dom.weatherMainIcon.className = interpreted.icon;

        dom.weatherHumidity.textContent = `${cur.humidity}%`;
        dom.weatherPrecip.textContent = `${cur.precipProb}%`;
        dom.weatherWind.textContent = formatWind(cur.windSpeed);
        dom.weatherUV.textContent = cur.uv.toFixed(1);
    }

    // Suitability Gauge & diagnostics rendering
    if (state.suitability.score !== null) {
        const score = state.suitability.score;
        dom.gaugeVal.textContent = `${score}%`;

        // Convert score to offset (circumference of stroke-dasharray = 251.2)
        const offset = 251.2 - (251.2 * score) / 100;
        dom.gaugeFill.style.strokeDashoffset = offset;

        // Verdict colors
        dom.gaugeFill.className.baseVal = "gauge-fill";
        dom.gaugeVerdict.textContent = state.suitability.verdict;

        dom.suitabilityBadge.className = "suitability-alert";
        if (score >= 80) {
            dom.gaugeFill.classList.add("optimal");
            dom.suitabilityBadge.classList.add("optimal");
            dom.suitabilityBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Optimal Suitability Verdict</span>`;
        } else if (score >= 50) {
            dom.gaugeFill.classList.add("warning");
            dom.suitabilityBadge.classList.add("warning");
            dom.suitabilityBadge.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>Sub-Optimal Suitability: Modification Required</span>`;
        } else {
            dom.gaugeFill.classList.add("danger");
            dom.suitabilityBadge.classList.add("danger");
            dom.suitabilityBadge.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <span>High Risk of Crop Failure Detected</span>`;
        }

        // Load diagnostics cards list
        dom.diagnosticList.innerHTML = "";
        state.suitability.diagnostics.forEach(diag => {
            const li = document.createElement("li");
            li.className = `diagnostic-item ${diag.status}`;

            let icon = "fa-solid fa-circle-info";
            if (diag.status === "optimal") icon = "fa-solid fa-circle-check";
            else if (diag.status === "warning") icon = "fa-solid fa-triangle-exclamation";
            else if (diag.status === "danger") icon = "fa-solid fa-radiation";

            let title = diag.titleEn;
            let desc = diag.descEn;
            if (lang === "hi") { title = diag.titleHi; desc = diag.descHi; }
            else if (lang === "es") { title = diag.titleEs; desc = diag.descEs; }
            else if (lang === "fr") { title = diag.titleFr; desc = diag.descFr; }
            else if (lang === "te") { title = diag.titleTe; desc = diag.descTe; }
            else if (lang === "ta") { title = diag.titleTa; desc = diag.descTa; }
            else if (lang === "mr") { title = diag.titleMr; desc = diag.descMr; }
            else if (lang === "bn") { title = diag.titleBn; desc = diag.descBn; }
            else if (lang === "pa") { title = diag.titlePa; desc = diag.descPa; }

            li.innerHTML = `
                <span class="diag-icon"><i class="${icon}"></i></span>
                <div class="diag-body">
                    <h4 class="diag-title">${title}</h4>
                    <p class="diag-desc">${desc}</p>
                </div>
            `;
            dom.diagnosticList.appendChild(li);
        });
    }
}

// Weather Station Tab Renderer
function renderWeatherStation() {
    if (!state.weather.current || state.weather.daily.length === 0) return;

    const cur = state.weather.current;
    const lang = state.lang;

    // Details left card
    dom.weatherDetailsLocation.textContent = state.location ? (
        lang === "hi" ? state.location.nameHi :
            lang === "es" ? state.location.nameEs :
                lang === "fr" ? state.location.nameFr :
                    lang === "te" ? state.location.nameTe :
                        lang === "ta" ? state.location.nameTa :
                            lang === "mr" ? state.location.nameMr :
                                lang === "bn" ? state.location.nameBn :
                                    lang === "pa" ? state.location.namePa :
                                        state.location.nameEn
    ) : "Select region";

    dom.weatherDetailsTemp.textContent = formatTemp(cur.temp);

    const interpreted = interpretWeatherCode(cur.code);
    dom.weatherDetailsCondition.textContent = getWeatherDesc(interpreted.descKey, interpreted.defaultDesc);
    dom.weatherDetailsIcon.className = `weather-pulse-icon ${interpreted.icon}`;

    dom.weatherSensorFeels.textContent = formatTemp(cur.feelsLike);
    dom.weatherSensorHumidity.textContent = `${cur.humidity}%`;
    dom.weatherSensorWind.textContent = formatWind(cur.windSpeed);
    dom.weatherSensorPressure.textContent = `${cur.pressure} hPa`;

    // 7-Day forecast right grid list
    dom.forecastCardsWrapper.innerHTML = "";
    state.weather.daily.forEach((day, index) => {
        const dateStr = day.date.toLocaleDateString(lang, { weekday: 'short', month: 'short', day: 'numeric' });
        const dayInterpreted = interpretWeatherCode(day.code);
        const dayCondition = getWeatherDesc(dayInterpreted.descKey, dayInterpreted.defaultDesc);

        const card = document.createElement("div");
        card.className = "forecast-row-card";

        card.innerHTML = `
            <span class="forecast-day">${dateStr}</span>
            <i class="forecast-icon ${dayInterpreted.icon}"></i>
            <span class="forecast-temp">${formatTemp(day.tempMin)} / ${formatTemp(day.tempMax)}</span>
            <span class="forecast-precip"><i class="fa-solid fa-droplet"></i> ${day.precipProb}%</span>
            <span class="forecast-desc">${dayCondition} (${day.precipSum.toFixed(1)} mm)</span>
        `;
        dom.forecastCardsWrapper.appendChild(card);
    });
}

// Education Tab Renderer
function renderEducationCenter() {
    if (!dom.eduSelectCrop || !dom.eduSelectSoil) return;

    const lang = state.lang;

    // Populate Crop selector options if empty
    if (dom.eduSelectCrop.options.length === 0) {
        dom.eduSelectCrop.innerHTML = CROPS.map(c =>
            `<option value="${c.id}">${getText(c.nameKey, lang)}</option>`
        ).join("");
    }

    // Populate Soil selector options if empty
    if (dom.eduSelectSoil.options.length === 0) {
        dom.eduSelectSoil.innerHTML = SOILS.map(s =>
            `<option value="${s.id}">${getText(s.nameKey, lang)}</option>`
        ).join("");
    }

    const cropId = dom.eduSelectCrop.value || CROPS[0].id;
    const soilId = dom.eduSelectSoil.value || SOILS[0].id;

    const selectedCrop = CROPS.find(c => c.id === cropId) || CROPS[0];
    const selectedSoil = SOILS.find(s => s.id === soilId) || SOILS[0];

    // Render selected crop educational card
    if (selectedCrop && dom.eduCropCard) {
        const soilsTranslated = selectedCrop.suitableSoils.map(sid => {
            const sobj = SOILS.find(s => s.id === sid);
            return sobj ? getText(sobj.nameKey, lang) : sid;
        }).join(", ");

        dom.eduCropCard.innerHTML = `
            <h4 class="edu-details-title" style="font-size: 1.15rem; color: var(--accent-green); margin-bottom: 8px;">
                <i class="fa-solid fa-wheat-awn"></i> ${getText(selectedCrop.nameKey, lang)}
            </h4>
            <p class="edu-text-desc" style="font-size: 0.88rem; line-height: 1.5; color: var(--text-secondary);">${getText(selectedCrop.descKey, lang)}</p>
            <div class="edu-specs-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 12px 0;">
                <div class="edu-spec-item" style="background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                    <span class="edu-spec-label" style="font-size: 0.75rem; color: var(--text-muted); display: block;">Ideal Soil Types</span>
                    <span class="edu-spec-value" style="font-weight: 600; color: var(--text-primary);">${soilsTranslated}</span>
                </div>
                <div class="edu-spec-item" style="background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                    <span class="edu-spec-label" style="font-size: 0.75rem; color: var(--text-muted); display: block;">Temperature Range</span>
                    <span class="edu-spec-value" style="font-weight: 600; color: #facc15;">${selectedCrop.tempMin}°C - ${selectedCrop.tempMax}°C</span>
                </div>
                <div class="edu-spec-item" style="background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                    <span class="edu-spec-label" style="font-size: 0.75rem; color: var(--text-muted); display: block;">Season Water Needs</span>
                    <span class="edu-spec-value" style="font-weight: 600; color: #38bdf8;">~ ${selectedCrop.waterReqMm} mm</span>
                </div>
                <div class="edu-spec-item" style="background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                    <span class="edu-spec-label" style="font-size: 0.75rem; color: var(--text-muted); display: block;">Est. Mandi Rate</span>
                    <span class="edu-spec-value" style="font-weight: 600; color: #4ade80;">₹${selectedCrop.mandiPricePerQuintal || 2200} / Qtl</span>
                </div>
            </div>
            <div style="background: rgba(45, 212, 191, 0.08); padding: 12px; border-radius: 8px; border: 1px solid rgba(45, 212, 191, 0.2); margin-top: 10px;">
                <h5 style="margin: 0 0 4px 0; font-weight: 700; color: var(--accent-green); font-size: 0.85rem;"><i class="fa-solid fa-lightbulb"></i> Conservation & Agronomic Guidance:</h5>
                <p class="edu-text-desc" style="font-style: italic; margin: 0; font-size: 0.82rem; color: var(--text-primary);">${getText(selectedCrop.tipsKey, lang)}</p>
            </div>
        `;
    }

    // Render selected soil educational card
    if (selectedSoil && dom.eduSoilCard) {
        dom.eduSoilCard.innerHTML = `
            <h4 class="edu-details-title" style="font-size: 1.15rem; color: #38bdf8; margin-bottom: 8px;">
                <i class="fa-solid fa-mountain"></i> ${getText(selectedSoil.nameKey, lang)}
            </h4>
            <p class="edu-text-desc" style="font-size: 0.88rem; line-height: 1.5; color: var(--text-secondary);">${getText(selectedSoil.descKey, lang)}</p>
            <div class="edu-specs-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 12px 0;">
                <div class="edu-spec-item" style="background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                    <span class="edu-spec-label" style="font-size: 0.75rem; color: var(--text-muted); display: block;">Water Retention Capacity</span>
                    <span class="edu-spec-value" style="font-weight: 600; color: #38bdf8;">${selectedSoil.retention}%</span>
                </div>
                <div class="edu-spec-item" style="background: rgba(255,255,255,0.04); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                    <span class="edu-spec-label" style="font-size: 0.75rem; color: var(--text-muted); display: block;">Drainage Speed</span>
                    <span class="edu-spec-value" style="font-weight: 600; color: #4ade80;">${selectedSoil.drainage}%</span>
                </div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                <span class="edu-spec-label" style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 6px;">Texture Composition Matrix:</span>
                <div style="display:flex; justify-content:space-between; font-size:0.82rem; color: var(--text-primary);">
                    <span><i class="fa-solid fa-cubes"></i> Sand: <strong>${selectedSoil.particles.sand}%</strong></span>
                    <span><i class="fa-solid fa-layer-group"></i> Silt: <strong>${100 - selectedSoil.particles.sand - selectedSoil.particles.clay}%</strong></span>
                    <span><i class="fa-solid fa-shield-halved"></i> Clay: <strong>${selectedSoil.particles.clay}%</strong></span>
                </div>
            </div>
        `;
    }
}

// ==========================================================================
// 9. AI Advisor Simulator Console Execution
// ==========================================================================

function addConsoleLine(text, type = "") {
    const consoleOut = document.getElementById("console-output");
    if (!consoleOut) return;
    const line = document.createElement("div");
    line.className = `console-line ${type}`;
    line.textContent = text;
    consoleOut.appendChild(line);
    consoleOut.scrollTop = consoleOut.scrollHeight;
}

function handleConsoleCommand(inputVal) {
    const cleanVal = inputVal.trim();
    if (!cleanVal) return;

    // Echo command
    addConsoleLine(`> ${cleanVal}`, "text-white");

    const lowerInput = cleanVal.toLowerCase();

    if (lowerInput === "/help") {
        addConsoleLine("Available Commands:", "text-success");
        addConsoleLine("  /generate            - Run irrigation suitability calculations", "text-success");
        addConsoleLine("  /crops               - List all crops supported by Krishi Jal", "text-success");
        addConsoleLine("  /locations           - List all global agricultural locations", "text-success");
        addConsoleLine("  /clear               - Clear terminal screen", "text-success");
        addConsoleLine("  /set crop [name]     - Change selected crop (e.g. /set crop cotton)", "text-success");
        addConsoleLine("  /set location [name] - Change selected region (e.g. /set location rajasthan)", "text-success");
        addConsoleLine("  Or ask directly: \"Will wheat grow in rajasthan?\"", "text-warning");
        return;
    }

    if (lowerInput === "/clear") {
        const consoleOut = document.getElementById("console-output");
        if (consoleOut) consoleOut.innerHTML = "";
        return;
    }

    if (lowerInput === "/crops") {
        addConsoleLine("Supported Crops catalog:", "text-success");
        CROPS.forEach(c => {
            addConsoleLine(`  * ${getText(c.nameKey, state.lang)} (id: ${c.id})`, "text-success");
        });
        return;
    }

    if (lowerInput === "/locations") {
        addConsoleLine("Supported Agricultural Locations:", "text-success");
        LOCATIONS.forEach(l => {
            const name = state.lang === "hi" ? l.nameHi : l.nameEn;
            addConsoleLine(`  * ${name} (id: ${l.id})`, "text-success");
        });
        return;
    }

    if (lowerInput === "/generate") {
        runAIAdvisorSimulation();
        return;
    }

    if (lowerInput.startsWith("/set crop ")) {
        const query = lowerInput.replace("/set crop ", "").trim();
        const cropObj = CROPS.find(c => c.id === query || getText(c.nameKey, "en").toLowerCase() === query || getText(c.nameKey, state.lang).toLowerCase() === query);
        if (cropObj) {
            state.crop = cropObj;
            dom.selectCrop.value = cropObj.id;
            addConsoleLine(`[SYSTEM] Crop successfully updated to: ${getText(cropObj.nameKey, state.lang)}`, "text-success");
            renderEducationCenter();
        } else {
            addConsoleLine(`[ERROR] Crop "${query}" not found in database. Type /crops to see options.`, "text-warning");
        }
        return;
    }

    if (lowerInput.startsWith("/set location ")) {
        const query = lowerInput.replace("/set location ", "").trim();
        const locObj = LOCATIONS.find(l => l.id === query || l.nameEn.toLowerCase().includes(query) || l.nameHi.toLowerCase().includes(query));
        if (locObj) {
            state.location = locObj;
            dom.selectLocation.value = locObj.id;
            dom.coordsDisplay.textContent = `Lat: ${locObj.lat.toFixed(2)} | Lon: ${locObj.lon.toFixed(2)}`;

            // Auto fill default soil
            dom.selectSoil.value = locObj.defaultSoil;
            state.soil = SOILS.find(s => s.id === locObj.defaultSoil);

            addConsoleLine(`[SYSTEM] Location successfully updated to: ${state.lang === "hi" ? locObj.nameHi : locObj.nameEn}`, "text-success");

            fetchWeather(locObj.lat, locObj.lon).then(() => {
                addConsoleLine(`[WEATHER] Loaded live weather forecast for new location.`, "text-success");
                renderActiveTab();
            });
        } else {
            addConsoleLine(`[ERROR] Region "${query}" not found in database. Type /locations to see options.`, "text-warning");
        }
        return;
    }

    // Natural Language suitability checker (Intent matching)
    let foundCrop = null;
    let foundLocation = null;
    let foundSoil = null;

    // Match crop keywords
    CROPS.forEach(c => {
        const names = [c.id, getText(c.nameKey, "en"), getText(c.nameKey, state.lang)];
        names.forEach(n => {
            if (lowerInput.includes(n.toLowerCase())) {
                foundCrop = c;
            }
        });
    });

    // Match location keywords
    LOCATIONS.forEach(l => {
        const names = [l.id, l.nameEn, l.nameHi];
        names.forEach(n => {
            if (lowerInput.includes(n.toLowerCase())) {
                foundLocation = l;
            }
        });
    });

    // Match soil keywords
    SOILS.forEach(s => {
        const names = [s.id, getText(s.nameKey, "en"), getText(s.nameKey, state.lang)];
        names.forEach(n => {
            if (lowerInput.includes(n.toLowerCase())) {
                foundSoil = s;
            }
        });
    });

    if (foundCrop && (foundLocation || foundSoil)) {
        if (foundLocation) {
            state.location = foundLocation;
            dom.selectLocation.value = foundLocation.id;
            dom.coordsDisplay.textContent = `Lat: ${foundLocation.lat.toFixed(2)} | Lon: ${foundLocation.lon.toFixed(2)}`;

            // Auto fill default soil
            dom.selectSoil.value = foundLocation.defaultSoil;
            state.soil = SOILS.find(s => s.id === foundLocation.defaultSoil);
        }

        if (foundSoil) {
            state.soil = foundSoil;
            dom.selectSoil.value = foundSoil.id;
        }

        state.crop = foundCrop;
        dom.selectCrop.value = foundCrop.id;

        addConsoleLine(`[AI ENGINE] Processing rapid suitability analysis:`, "text-warning");
        addConsoleLine(`  - Target Crop: ${getText(state.crop.nameKey, state.lang)}`, "text-white");
        addConsoleLine(`  - Region: ${state.lang === "hi" ? state.location.nameHi : state.location.nameEn}`, "text-white");
        addConsoleLine(`  - Soil Profile: ${getText(state.soil.nameKey, state.lang)}`, "text-white");

        fetchWeather(state.location.lat, state.location.lon).then(() => {
            analyzeGrowthSuitability();

            addConsoleLine(`[AI ENGINE] Analysis Result:`, "text-warning");
            addConsoleLine(`  - Growing Score: ${state.suitability.score}%`, state.suitability.score >= 80 ? "text-success" : state.suitability.score >= 50 ? "text-warning" : "text-danger");
            addConsoleLine(`  - Verdict: ${state.suitability.verdict}`, state.suitability.score >= 80 ? "text-success" : state.suitability.score >= 50 ? "text-warning" : "text-danger");

            state.suitability.diagnostics.forEach(d => {
                const desc = state.lang === "hi" ? d.descHi : d.descEn;
                addConsoleLine(`  * ${desc}`, "text-muted");
            });

            addConsoleLine(`[SYSTEM] Syncing sidebar sliders to match query.`, "text-muted");
            addConsoleLine(`[SYSTEM] Type /generate to formulate a complete 7-day water schedule.`, "text-success");

            renderFertilizerPesticideSection();
            renderProfitabilitySection();
            renderDashboard();
            renderActiveTab();
        });

    } else {
        addConsoleLine("[Gemini AI] I can help you analyze crop growth. Please specify a crop and location.", "text-warning");
        addConsoleLine('Example: "Will wheat grow in rajasthan?" or "Can cotton grow in black soil?"', "text-warning");
        addConsoleLine('Type /help to see all terminal commands.', "text-success");
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAIAdvisorSimulation() {
    dom.btnSpinner.style.display = "inline-block";
    dom.btnGenerate.disabled = true;

    // Auto-navigate to advisor tab so the user sees the console running!
    const advTab = document.querySelector('.tab-link[data-tab="advisor"]'); if (advTab) advTab.click();

    const consoleOut = dom.consoleOutput;
    consoleOut.innerHTML = "";
    dom.advisorReport.style.display = "none";

    const addLine = addConsoleLine;

    const lang = state.lang;
    const locName = lang === "hi" ? state.location.nameHi :
        lang === "es" ? state.location.nameEs :
            lang === "fr" ? state.location.nameFr :
                lang === "te" ? state.location.nameTe :
                    lang === "ta" ? state.location.nameTa :
                        lang === "mr" ? state.location.nameMr :
                            lang === "bn" ? state.location.nameBn :
                                lang === "pa" ? state.location.namePa :
                                    state.location.nameEn;

    const cropName = getText(state.crop.nameKey, lang);
    const soilName = getText(state.soil.nameKey, lang);
    const stageName = getText("stage-" + state.stage, lang);

    // Core AI terminal dialogue simulations
    await sleep(200);
    addLine(`[SYSTEM] Initializing Gemini 3.5 Flash Agricultural Advisor...`, "text-muted");
    await sleep(350);
    addLine(`[SYSTEM] Connected to regional agronomic node (L0-AGRI-1025).`, "text-muted");
    await sleep(250);
    addLine(`[INPUT] Input Region Parameters: ${locName} (Coordinates: Lat ${state.location.lat}, Lon ${state.location.lon})`, "text-white");
    await sleep(250);
    addLine(`[INPUT] Selected Soil Core: ${soilName} (Texture saturation rating: ${state.soil.retention}%)`, "text-white");
    await sleep(200);
    addLine(`[INPUT] Targeted Cultivar: ${cropName} | Current stage: ${stageName}`, "text-white");
    await sleep(400);
    addLine(`[API] Fetching real-time weather prognostics from meteorological node (Open-Meteo)...`, "text-warning");

    // Start API loading
    const apiSuccess = await fetchWeather(state.location.lat, state.location.lon);

    if (apiSuccess) {
        addLine(`[API] SUCCESS: Weather data successfully fetched for coordinates.`, "text-success");
    } else {
        addLine(`[API] OFFLINE: Using localized historical meteorological data fallback matrix.`, "text-warning");
    }

    await sleep(350);
    const temps = state.weather.daily.map(d => (d.tempMax + d.tempMin) / 2);
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const totalRain = state.weather.daily.map(d => d.precipSum).reduce((a, b) => a + b, 0);

    addLine(`[WEATHER] Processed 7-Day Forecast: Avg Temp = ${avgTemp.toFixed(1)}°C | Cumulative expected precipitation = ${totalRain.toFixed(1)} mm.`, "text-success");
    await sleep(300);

    // Growth analysis engine call
    analyzeGrowthSuitability();
    addLine(`[ENGINE] Growth Suitability Assessment completed. Suitability Score: ${state.suitability.score}% (${state.suitability.verdict}).`, "text-success");
    await sleep(400);

    // Calculate Penman-Monteith Evapotranspiration
    const kc = (state.crop && state.crop.kc && state.crop.kc[state.stage]) !== undefined ? state.crop.kc[state.stage] : 0.8;
    addLine(`[AI-CORE] Matching Crop Water Factor. Coefficient (Kc) for "${cropName}" at "${stageName}": ${kc}`, "text-muted");
    await sleep(300);
    addLine(`[AI-CORE] Estimating daily Reference Evapotranspiration (ET0) using radiation, humidity, and wind vectors...`, "text-muted");

    calculateIrrigationSchedule();
    await sleep(450);

    const calculatedEt = (state.recommendation.weeklyAvg * 1.1).toFixed(1);
    addLine(`[AI-CORE] Estimated average daily Crop Evapotranspiration demand (ETc): ~ ${calculatedEt} mm/day.`, "text-muted");
    await sleep(300);
    addLine(`[AI-CORE] Balancing soil moisture dynamics. Water deficit model is calculated (Deficit = ETc - effective_rainfall).`, "text-muted");
    await sleep(400);
    addLine(`[SYSTEM] Compiling daily irrigation instructions and expert conservation advice...`, "text-muted");
    await sleep(500);

    addLine(`[SYSTEM] 7-Day prescription generated successfully. Dispensing schedule below.`, "text-success");
    await sleep(150);

    // UI updates
    renderSimulationReport();

    dom.btnSpinner.style.display = "none";
    dom.btnGenerate.disabled = false;

    // Render dashboard and weather since state changed
    renderFertilizerPesticideSection();
    renderProfitabilitySection();
    renderDashboard();
}



// ==========================================================================
// 14. Government Agricultural Schemes & AI Subsidy Database
// ==========================================================================

const SCHEMES = [
    {
        id: "pm-kisan",
        title: "PM-KISAN Samman Nidhi Scheme",
        subsidy: "₹6,000 / Year",
        category: "Direct Income Support",
        eligibility: "All small & marginal landholding farmer families",
        docs: "Aadhaar Card, Land Holding Papers, Bank Account Passbook",
        link: "https://pmkisan.gov.in/",
        desc: "Direct financial benefit of ₹6,000 per year transferred in three equal installments of ₹2,000 directly into the bank accounts of farmer families across India."
    },
    {
        id: "pmfby",
        title: "PM Fasal Bima Yojana (Crop Insurance)",
        subsidy: "Up to 90% Premium Subsidy",
        category: "Crop Insurance",
        eligibility: "Farmers growing notified crops in notified areas",
        docs: "Land Sowing Certificate, Aadhaar, Bank Details, Land Possession Document",
        link: "https://pmfby.gov.in/",
        desc: "Comprehensive crop insurance scheme protecting farmers against yield losses due to non-preventable natural risks like drought, flood, pests, and cyclones."
    },
    {
        id: "pmksy",
        title: "PM Krishi Sinchayee Yojana (Drip & Sprinkler)",
        subsidy: "45% to 55% Micro-Irrigation Subsidy",
        category: "Water Conservation & Drip Irrigation",
        eligibility: "Farmers with arable land & guaranteed water source",
        docs: "Soil/Water Test Report, Electricity Connection Proof, Land Registry, Aadhaar",
        link: "https://pmksy.gov.in/",
        desc: "Promotes 'Per Drop More Crop' by providing financial subsidies for installing modern Drip and Sprinkler irrigation systems to maximize water use efficiency."
    },
    {
        id: "pm-kusum",
        title: "PM-KUSUM Solar Pump Scheme",
        subsidy: "Up to 60% Solar Pump Subsidy",
        category: "Renewable Energy & Solar Pumps",
        eligibility: "Individual farmers, panchayats, water user associations",
        docs: "Aadhaar, Land Records, Bank Account Details, Electricity Discom NOC",
        link: "https://pmkusum.mnre.gov.in/",
        desc: "Provides up to 60% financial subsidy for installing off-grid solar agriculture pumps (3 HP to 10 HP) and solarizing existing grid-connected pumps."
    },
    {
        id: "kcc",
        title: "Kisan Credit Card (KCC) Scheme",
        subsidy: "Subsidized Loan @ 4% Interest",
        category: "Credit & Capital Facilities",
        eligibility: "Owner farmers, tenant farmers, sharecroppers & SHGs",
        docs: "Identity Proof, Address Proof, Land Ownership Documents, Passport Photos",
        link: "https://www.myscheme.gov.in/schemes/kcc",
        desc: "Provides timely institutional credit up to ₹3 Lakhs at a highly subsidized interest rate of 4% per annum (with prompt repayment incentive) for farm operations."
    },
    {
        id: "smam",
        title: "Sub-Mission on Agricultural Mechanization (SMAM)",
        subsidy: "40% to 50% Machinery Subsidy",
        category: "Farm Mechanization & Tractors",
        eligibility: "Small, marginal, female, SC/ST farmers",
        docs: "Aadhaar, Voter ID, Land Ownership Certificate, Quotation of Machinery",
        link: "https://agrimachinery.nic.in/",
        desc: "Offers subsidies ranging from 40% to 50% on tractors, power tillers, rotavators, seed drills, and combine harvesters to boost farm productivity."
    },
    {
        id: "shc",
        title: "Soil Health Card (SHC) Scheme",
        subsidy: "100% Free Soil Lab Testing",
        category: "Soil Testing & Fertility",
        eligibility: "All agricultural land holders",
        docs: "Land Khasra/Khatauni Number, Aadhaar Card",
        link: "https://soilhealth.dac.gov.in/",
        desc: "Provides free soil testing cards detailing status of 12 nutrients (N, P, K, S, Fe, Zn, Cu, Mn, B, pH, EC, OC) along with customized fertilizer dosage recommendations."
    },
    {
        id: "nabard-cold",
        title: "NABARD Agricultural Infrastructure Fund (AIF)",
        subsidy: "3% Interest Subvention + Credit Guarantee",
        category: "Post-Harvest Infrastructure",
        eligibility: "Agri-entrepreneurs, FPOs, PACS, Startups",
        docs: "DPR (Detailed Project Report), Land Ownership/Lease, Financial Records",
        link: "https://agriinfra.dac.gov.in/",
        desc: "Offers 3% interest subvention for loans up to ₹2 Crores for building cold storages, pack houses, warehouses, and post-harvest management infrastructure."
    }
];

function renderGovernmentSchemes() {
    if (!dom.schemesCardsGrid) return;

    const filterQuery = dom.schemeSearchInput ? dom.schemeSearchInput.value.trim().toLowerCase() : "";

    const filteredSchemes = SCHEMES.filter(s =>
        s.title.toLowerCase().includes(filterQuery) ||
        s.category.toLowerCase().includes(filterQuery) ||
        s.subsidy.toLowerCase().includes(filterQuery) ||
        s.desc.toLowerCase().includes(filterQuery)
    );

    dom.schemesCardsGrid.innerHTML = filteredSchemes.map(s => `
        <div class="scheme-card">
            <div>
                <div class="scheme-card-header">
                    <h3 class="scheme-card-title"><i class="fa-solid fa-building-columns" style="color: #60a5fa; margin-right: 6px;"></i>${s.title}</h3>
                    <span class="scheme-badge-subsidy">${s.subsidy}</span>
                </div>
                <p class="scheme-desc">${s.desc}</p>
                <div class="scheme-meta-box">
                    <div class="scheme-meta-row">
                        <span class="scheme-meta-lbl">Category:</span>
                        <span class="scheme-meta-val">${s.category}</span>
                    </div>
                    <div class="scheme-meta-row">
                        <span class="scheme-meta-lbl">Eligibility:</span>
                        <span class="scheme-meta-val">${s.eligibility}</span>
                    </div>
                    <div class="scheme-meta-row">
                        <span class="scheme-meta-lbl">Key Documents:</span>
                        <span class="scheme-meta-val">${s.docs}</span>
                    </div>
                </div>
            </div>
            <div class="scheme-actions">
                <button type="button" class="scheme-ai-btn" onclick="askAISchemeEligibility('${s.id}')">
                    <i class="fa-solid fa-brain"></i> Check My AI Eligibility
                </button>
                <a href="${s.link}" target="_blank" class="scheme-link-btn" title="Official Government Portal">
                    <i class="fa-solid fa-up-right-from-square"></i>
                </a>
            </div>
        </div>
    `).join("");
}

function askAISchemeEligibility(schemeId) {
    const schemeObj = SCHEMES.find(s => s.id === schemeId);
    if (!schemeObj) return;

    const locName = state.location ? (state.lang === "hi" ? state.location.nameHi : state.location.nameEn) : "my region";
    const cropName = state.crop ? getText(state.crop.nameKey, state.lang) : "my crop";
    const area = state.area || 1.0;

    const prompt = `Am I eligible for ${schemeObj.title} (${schemeObj.subsidy}) in ${locName} for growing ${cropName} on ${area} acres? Explain exact eligibility criteria, government portal application process, state subsidy percentage, and required documents.`;

    const advTab = document.querySelector('.tab-link[data-tab="advisor"]');
    if (advTab) advTab.click();

    handleConsoleCommand(prompt);
}


// ==========================================================================
// 13. AI Crop Yield & Market Profitability Calculator
// ==========================================================================

function calculateCropFinancials(cropObj, areaAcres) {
    if (!cropObj) return { totalYield: 0, pricePerQuintal: 0, grossRevenue: 0, estimatedCosts: 0, netProfit: 0 };

    const area = areaAcres > 0 ? areaAcres : 1.0;
    const yieldPerAcre = cropObj.avgYieldQuintalsPerAcre || 20;
    const price = cropObj.mandiPricePerQuintal || 2200;

    const totalYield = (yieldPerAcre * area).toFixed(0);
    const grossRevenue = (totalYield * price);
    const estimatedCosts = (grossRevenue * 0.35); // Approx 35% input & labor cost
    const netProfit = (grossRevenue - estimatedCosts);

    return {
        totalYield,
        pricePerQuintal: price.toLocaleString(),
        grossRevenue: grossRevenue.toLocaleString('en-IN'),
        estimatedCosts: estimatedCosts.toLocaleString('en-IN'),
        netProfit: netProfit.toLocaleString('en-IN')
    };
}

function renderProfitabilitySection() {
    if (!dom.advisorProfitGrid) return;

    const crop = state.crop || CROPS[0];
    const area = state.area || 1.0;
    const lang = state.lang;

    const fin = calculateCropFinancials(crop, area);

    dom.advisorProfitGrid.innerHTML = `
        <div class="profit-card yield">
            <div class="profit-card-icon"><i class="fa-solid fa-wheat-awn"></i></div>
            <div class="profit-card-val">${fin.totalYield} Qtl</div>
            <div class="profit-card-lbl">Est. Harvest Yield (${area} Acre)</div>
        </div>
        <div class="profit-card price">
            <div class="profit-card-icon"><i class="fa-solid fa-indian-rupee-sign"></i></div>
            <div class="profit-card-val">₹${fin.pricePerQuintal}</div>
            <div class="profit-card-lbl">Mandi Rate / Quintal</div>
        </div>
        <div class="profit-card revenue">
            <div class="profit-card-icon"><i class="fa-solid fa-vault"></i></div>
            <div class="profit-card-val">₹${fin.grossRevenue}</div>
            <div class="profit-card-lbl">Est. Gross Revenue</div>
        </div>
        <div class="profit-card net">
            <div class="profit-card-icon"><i class="fa-solid fa-sack-dollar"></i></div>
            <div class="profit-card-val">₹${fin.netProfit}</div>
            <div class="profit-card-lbl">Est. Net Profit</div>
        </div>
    `;
}

function renderSimulationReport() {
    const lang = state.lang;

    // Show report element
    dom.advisorReport.style.display = "block";

    // Subtitle text updates
    dom.advisorHeroSubtitle.textContent = state.lang === "en" ? `Smart irrigation plan for ${getText(state.crop.nameKey, lang)} at ${getText("stage-" + state.stage, lang)} stage.` :
        state.lang === "hi" ? `${getText("stage-" + state.stage, lang)} चरण में ${getText(state.crop.nameKey, lang)} के लिए स्मार्ट सिंचाई योजना।` :
            state.lang === "es" ? `Plan de riego inteligente para ${getText(state.crop.nameKey, lang)} en la etapa de ${getText("stage-" + state.stage, lang)}.` :
                state.lang === "fr" ? `Plan d'irrigation intelligent pour le ${getText(state.crop.nameKey, lang)} au stade ${getText("stage-" + state.stage, lang)}.` :
                    state.lang === "te" ? `${getText("stage-" + state.stage, lang)} దశలో ${getText(state.crop.nameKey, lang)} పంటకు సరిపోయే నీటి పారుదల ప్రణాళిక.` :
                        state.lang === "ta" ? `${getText("stage-" + state.stage, lang)} நிலையில் உள்ள ${getText(state.crop.nameKey, lang)} பயிருக்கான பாசன திட்டம்.` :
                            state.lang === "mr" ? `${getText("stage-" + state.stage, lang)} अवस्थेतील ${getText(state.crop.nameKey, lang)} पिकाचे अचूक नियोजन.` :
                                state.lang === "bn" ? `${getText("stage-" + state.stage, lang)} ধাপে ${getText(state.crop.nameKey, lang)} এর জন্য স্মার্ট সেচ পরিকল্পনা।` :
                                    `${getText("stage-" + state.stage, lang)} ਪੜਾਅ ਵਿੱਚ ${getText(state.crop.nameKey, lang)} ਲਈ ਸਮਾਰਟ ਸਿੰਚਾਈ ਯੋਜਨਾ।`;

    // Avg water depth formatting
    if (state.unitImperial) {
        const avgInches = state.recommendation.weeklyAvg / 25.4;
        dom.advisorAvgWater.textContent = avgInches.toFixed(2);
        dom.advisorAvgUnit.textContent = "in / day";
    } else {
        dom.advisorAvgWater.textContent = state.recommendation.weeklyAvg.toFixed(1);
        dom.advisorAvgUnit.textContent = "mm / day";
    }

    // Daily schedule rows rendering
    dom.scheduleTbody.innerHTML = "";
    state.recommendation.schedule.forEach(row => {
        const dateStr = row.date.toLocaleDateString(lang, { weekday: 'short', month: 'short', day: 'numeric' });
        const tr = document.createElement("tr");

        let actionBadge = `<span class="badge-irrigate"><i class="fa-solid fa-faucet-drip"></i> Irrigate</span>`;
        if (row.waterRequired === 0) {
            actionBadge = `<span class="badge-skip"><i class="fa-solid fa-droplet-slash"></i> Skip</span>`;
        }

        // Custom translate action text on the fly
        let actionExplanation = row.actionText;
        if (row.waterRequired === 0) {
            if (row.rain > 2.0) {
                actionExplanation = lang === "en" ? `Skip: Expected rain of ${row.rain.toFixed(1)}mm covers crop needs.` :
                    lang === "hi" ? `छोड़ें: ${row.rain.toFixed(1)} मिमी की वर्षा फसल की जरूरत पूरी करेगी।` :
                        lang === "es" ? `Evitar: Lluvia prevista de ${row.rain.toFixed(1)}mm cubre necesidades.` :
                            lang === "fr" ? `Éviter: Pluie prévue de ${row.rain.toFixed(1)}mm couvre les besoins.` :
                                lang === "te" ? `ఆపండి: ${row.rain.toFixed(1)}మిమీ వర్ష సూచన పంటకు సరిపోతుంది.` :
                                    lang === "ta" ? `தவிர்: முன்னறிவிக்கப்பட்ட ${row.rain.toFixed(1)}மிமீ மழையே போதுமானது.` :
                                        lang === "mr" ? `टाळा: अंदाजीत ${row.rain.toFixed(1)} मिमी पाऊस पीक गरज पूर्ण करेल.` :
                                            lang === "bn" ? `বাদ দিন: প্রত্যাশিত বৃষ্টিপাত (${row.rain.toFixed(1)}মিমি) ফসলের জল পূরণ করবে।` :
                                                `ਛੱਡੋ: ਅੰਦਾਜ਼ਾ ਮੀਂਹ (${row.rain.toFixed(1)} ਮਿਲੀਮੀਟਰ) ਫ਼ਸਲ ਲਈ ਕਾਫ਼ੀ ਹੈ।`;
            } else {
                actionExplanation = lang === "en" ? "Skip: Soil moisture is adequate." :
                    lang === "hi" ? "छोड़ें: मिट्टी में नमी पर्याप्त है।" :
                        lang === "es" ? "Evitar: Humedad del suelo adecuada." :
                            lang === "fr" ? "Éviter: Humidité du sol adéquate." :
                                lang === "te" ? "ఆపండి: నేలలో తగినంత తేమ ఉంది." :
                                    lang === "ta" ? "தவிர்: மண்ணில் ஈரப்பதம் போதுமானதாக உள்ளது." :
                                        lang === "mr" ? "टाळा: मातीतील ओलावा पुरेसा आहे." :
                                            lang === "bn" ? "বাদ দিন: মাটির আর্দ্রতা পর্যাপ্ত রয়েছে।" :
                                                "ਛੱਡੋ: ਮਿੱਟੀ ਵਿੱਚ ਨਮੀ ਕਾਫ਼ੀ ਹੈ।";
            }
        } else {
            // Irrigate details
            const avgTemp = (row.tempMin + row.tempMax) / 2;
            if (avgTemp > 28) {
                actionExplanation = lang === "en" ? "Irrigate: Late Evening (Reduce evapotranspiration)" :
                    lang === "hi" ? "सिंचाई: देर शाम (वाष्पीकरण नुकसान कम करने के लिए)" :
                        lang === "es" ? "Riego: Tarde en la noche (Reduce evaporación)" :
                            lang === "fr" ? "Irriguer: En fin de soirée (Réduit l'évaporation)" :
                                lang === "te" ? "తడి ఇవ్వండి: సాయంత్రం వేళ (ఆవిరి కాకుండా కాపాడుకోవచ్చు)" :
                                    lang === "ta" ? "பாசனம்: மாலை வேளை (ஆவியாவதை தடுக்கும்)" :
                                        lang === "mr" ? "सिंचन: संध्याकाळी (बाष्पीभवन टाळण्यासाठी)" :
                                            lang === "bn" ? "সেচ দিন: শেষ বিকেলে (বাষ্পীভবন হ্রাস করতে)" :
                                                "ਸਿੰਚਾਈ: ਦੇਰ ਸ਼ਾਮ (ਵਾਸ਼ਪੀਕਰਨ ਘੱਟ ਕਰਨ ਲਈ)";
            } else {
                actionExplanation = lang === "en" ? "Irrigate: Early Morning (Optimal)" :
                    lang === "hi" ? "सिंचाई: सुबह सवेरे (इष्टतम समय)" :
                        lang === "es" ? "Riego: Temprano en la mañana (Óptimo)" :
                            lang === "fr" ? "Irriguer: Tôt le matin (Optimal)" :
                                lang === "te" ? "తడి ఇవ్వండి: ఉదయం పూట (చాలా అనుకూలం)" :
                                    lang === "ta" ? "பாசனம்: அதிகாலை வேளை (சிறந்தது)" :
                                        lang === "mr" ? "सिंचन: पहाटेच्या वेळी (योग्य वेळ)" :
                                            lang === "bn" ? "সেচ দিন: কাকভোরে (অনুকূল সময়)" :
                                                "ਸਿੰਚਾਈ: ਸਵੇਰੇ ਜਲਦੀ (ਸਭ ਤੋਂ ਵਧੀਆ)";
            }
        }

        tr.innerHTML = `
            <td><strong>${dateStr}</strong></td>
            <td>${formatTemp(row.tempMin)} / ${formatTemp(row.tempMax)}</td>
            <td>${row.rain.toFixed(1)} mm</td>
            <td>${formatDepth(row.deficit)}</td>
            <td><strong>${formatDepth(row.waterRequired)}</strong></td>
            <td>
                <div style="display:flex; flex-direction:column; gap:4px;">
                    <div>${actionBadge}</div>
                    <span style="font-size:0.75rem; color:var(--text-secondary);">${actionExplanation}</span>
                </div>
            </td>
        `;
        dom.scheduleTbody.appendChild(tr);
    });

    // Critical care list tips
    dom.criticalTipsList.innerHTML = "";
    state.recommendation.criticalTips.forEach(tip => {
        const li = document.createElement("li");
        li.textContent = tip;
        dom.criticalTipsList.appendChild(li);
    });

    // Water conservation actions list
    dom.conservationTipsList.innerHTML = "";
    state.recommendation.conservationTips.forEach(tip => {
        const li = document.createElement("li");
        li.textContent = tip;
        dom.conservationTipsList.appendChild(li);
    });
}

// ==========================================================================
// 10. AI Soil Lab Analysis Engine & Renderer
// ==========================================================================

function analyzeSoilSample() {
    const color = dom.slColor.value;
    const texture = dom.slTexture.value;
    const moisture = dom.slMoisture.value;
    const ph = parseFloat(dom.slPh.value);
    const area = parseFloat(dom.slArea.value) || 2.5;

    const organicSigns = {
        earthworms: dom.slEarthworms.checked,
        decayed: dom.slDecayed.checked,
        roots: dom.slRoots.checked,
        fungal: dom.slFungal.checked
    };
    const organicCount = Object.values(organicSigns).filter(Boolean).length;

    // ---- Color → Organic Carbon & Iron Estimation ----
    const colorProfiles = {
        "dark-black": { organicBase: 3.8, ironBase: 25, nBoost: 1.3, desc: "High humus content" },
        "reddish-brown": { organicBase: 1.8, ironBase: 65, nBoost: 0.9, desc: "Iron-rich laterite indicators" },
        "light-brown": { organicBase: 1.2, ironBase: 20, nBoost: 0.8, desc: "Moderate mineral content" },
        "grey": { organicBase: 0.6, ironBase: 10, nBoost: 0.5, desc: "Low organic matter, possible leaching" },
        "yellowish": { organicBase: 0.9, ironBase: 45, nBoost: 0.6, desc: "Hydrated iron oxides present" }
    };

    // ---- Texture → Drainage/Retention/Nutrient Profiles ----
    const textureProfiles = {
        "sticky": { nMod: 1.2, pMod: 0.9, kMod: 1.3, retention: 85, drainage: 15, soilMatch: "clay" },
        "smooth": { nMod: 1.0, pMod: 1.1, kMod: 1.0, retention: 65, drainage: 50, soilMatch: "silt" },
        "gritty": { nMod: 0.6, pMod: 0.7, kMod: 0.7, retention: 25, drainage: 90, soilMatch: "sandy" },
        "crumbly": { nMod: 1.0, pMod: 1.0, kMod: 1.0, retention: 60, drainage: 60, soilMatch: "loamy" }
    };

    // ---- Moisture → Adjustment Factors ----
    const moistureFactors = {
        "waterlogged": { nMod: 0.7, available: 0.8, risk: "denitrification" },
        "moist": { nMod: 1.0, available: 1.0, risk: "none" },
        "dry": { nMod: 0.85, available: 0.9, risk: "low-availability" },
        "very-dry": { nMod: 0.6, available: 0.7, risk: "nutrient-lockout" }
    };

    const cp = colorProfiles[color] || colorProfiles["light-brown"];
    const tp = textureProfiles[texture] || textureProfiles["crumbly"];
    const mp = moistureFactors[moisture] || moistureFactors["moist"];

    // ---- Calculate Nutrient Levels (kg/ha equivalent, normalized to 0-100 scale) ----
    let baseN = 45 + (cp.organicBase * 20);  // Nitrogen from organic matter
    baseN *= tp.nMod * mp.nMod * cp.nBoost;
    baseN += organicCount * 8;  // Organic signs boost nitrogen
    baseN = Math.min(Math.max(baseN, 5), 95);

    let baseP = 22 + (cp.organicBase * 8);
    baseP *= tp.pMod * mp.available;
    // pH affects phosphorus availability — optimal at 6.0-7.5
    if (ph < 5.5) baseP *= 0.5;
    else if (ph > 8.0) baseP *= 0.6;
    else if (ph >= 6.0 && ph <= 7.5) baseP *= 1.2;
    baseP = Math.min(Math.max(baseP, 5), 90);

    let baseK = 35 + (cp.organicBase * 6);
    baseK *= tp.kMod * mp.available;
    if (texture === "sticky") baseK *= 1.15; // Clay retains potassium
    baseK = Math.min(Math.max(baseK, 5), 90);

    let baseFe = cp.ironBase * mp.available;
    if (ph > 7.5) baseFe *= 0.4; // Iron locks at alkaline pH
    else if (ph < 6.0) baseFe *= 1.3;
    baseFe = Math.min(Math.max(baseFe, 5), 95);

    let baseZn = 15 + (cp.organicBase * 5);
    baseZn *= mp.available;
    if (ph > 7.5) baseZn *= 0.5;
    else if (ph < 6.5) baseZn *= 1.2;
    baseZn = Math.min(Math.max(baseZn, 5), 85);

    // ---- Organic Matter Percentage ----
    let organicMatter = cp.organicBase;
    organicMatter += organicCount * 0.6;
    if (moisture === "moist") organicMatter *= 1.1;
    if (moisture === "waterlogged") organicMatter *= 0.9; // Anaerobic decomposition
    organicMatter = Math.min(Math.max(organicMatter, 0.3), 8.0);

    // ---- pH Analysis ----
    let phCategory, phDescription, phCropImpact;
    if (ph < 4.5) {
        phCategory = "acidic";
        phDescription = "Strongly Acidic — Most nutrients become unavailable. Aluminum toxicity risk.";
        phCropImpact = "Very few crops tolerate this. Tea, blueberry might work.";
    } else if (ph < 5.5) {
        phCategory = "acidic";
        phDescription = "Moderately Acidic — Phosphorus and calcium become limited. Iron and manganese may be excessive.";
        phCropImpact = "Potato, rice, and groundnut can tolerate slightly acidic soils.";
    } else if (ph < 6.5) {
        phCategory = "acidic";
        phDescription = "Slightly Acidic — Good for most crops. Nutrients are reasonably available.";
        phCropImpact = "Most crops grow well. Ideal for maize, wheat, soybean.";
    } else if (ph <= 7.5) {
        phCategory = "neutral";
        phDescription = "Neutral to Slightly Alkaline — Optimal range. Maximum nutrient availability for most crops.";
        phCropImpact = "All major crops thrive in this range.";
    } else if (ph <= 8.5) {
        phCategory = "alkaline";
        phDescription = "Moderately Alkaline — Iron, zinc, and manganese availability decreases sharply.";
        phCropImpact = "Barley, cotton, and sugarcane tolerate alkaline soils better.";
    } else {
        phCategory = "alkaline";
        phDescription = "Strongly Alkaline — Severe nutrient lockout. Sodium buildup likely.";
        phCropImpact = "Very few crops survive. Requires gypsum treatment.";
    }

    // ---- Soil Health Score ----
    let healthScore = 50;

    // Nutrient balance contribution (max +25)
    const avgNutrient = (baseN + baseP + baseK) / 3;
    healthScore += Math.min(avgNutrient * 0.25, 25);

    // pH contribution (max +15) — neutral is best
    const phDeviation = Math.abs(ph - 6.8);
    healthScore += Math.max(15 - phDeviation * 5, 0);

    // Organic matter (max +15)
    healthScore += Math.min(organicMatter * 3, 15);

    // Biological signs (max +10)
    healthScore += organicCount * 2.5;

    // Moisture penalty
    if (moisture === "very-dry") healthScore -= 10;
    if (moisture === "waterlogged") healthScore -= 8;

    healthScore = Math.min(Math.max(Math.round(healthScore), 5), 98);

    // ---- Crop Compatibility Rankings ----
    const matchedSoilId = tp.soilMatch;
    const cropRankings = CROPS.map(crop => {
        let score = 50;

        // Soil compatibility
        if (crop.suitableSoils.includes(matchedSoilId)) {
            score += 30;
        } else if (crop.suitableSoils.includes("loamy") || crop.suitableSoils.includes("alluvial")) {
            score += 10;
        }

        // pH suitability
        if (ph >= 6.0 && ph <= 7.5) score += 15;
        else if (ph >= 5.5 && ph <= 8.0) score += 5;
        else score -= 10;

        // Nutrient boost — nitrogen-hungry crops
        if (["rice", "maize", "sugarcane", "wheat"].includes(crop.id) && baseN > 50) score += 10;
        if (["groundnut", "chickpea", "soybean"].includes(crop.id) && baseP > 40) score += 10;

        score = Math.min(Math.max(score, 10), 98);

        // Fertilizer suggestion
        let fertSuggestion = "";
        if (baseN < 40) fertSuggestion += "Urea/Ammonium Sulfate";
        if (baseP < 35) fertSuggestion += (fertSuggestion ? " + " : "") + "DAP/SSP";
        if (baseK < 35) fertSuggestion += (fertSuggestion ? " + " : "") + "MOP";
        if (!fertSuggestion) fertSuggestion = "Balanced NPK (10:26:26)";

        return {
            cropId: crop.id,
            cropName: getText(crop.nameKey, state.lang),
            score: score,
            fertSuggestion: fertSuggestion
        };
    }).sort((a, b) => b.score - a.score).slice(0, 8);

    // ---- Soil Amendments ----
    const amendments = [];

    if (ph < 5.5) {
        amendments.push("Apply agricultural lime (CaCO₃) at 2-4 tonnes/ha to raise pH and reduce aluminum toxicity.");
    }
    if (ph > 8.0) {
        amendments.push("Apply gypsum (CaSO₄) at 3-5 tonnes/ha to reduce alkalinity and improve soil structure.");
    }
    if (organicMatter < 1.5) {
        amendments.push("Add 5-10 tonnes/ha of well-decomposed farmyard manure (FYM) or vermicompost to boost organic carbon levels.");
    }
    if (baseN < 35) {
        amendments.push("Apply green manure crops (Dhaincha/Sesbania) in rotation to naturally fix atmospheric nitrogen.");
    }
    if (baseP < 30) {
        amendments.push("Incorporate rock phosphate or bone meal as a slow-release phosphorus source for sustained availability.");
    }
    if (baseFe < 25 && ph > 7.5) {
        amendments.push("Apply chelated iron (FeSO₄) as foliar spray to correct iron deficiency caused by high pH.");
    }
    if (baseZn < 20) {
        amendments.push("Apply Zinc Sulphate (ZnSO₄) at 25 kg/ha to address zinc deficiency — critical for rice and wheat.");
    }
    if (texture === "sticky") {
        amendments.push("Mix coarse sand and organic matter to improve drainage in heavy clay soils and reduce waterlogging risk.");
    }
    if (texture === "gritty") {
        amendments.push("Add clay minerals (bentonite) and compost to improve water retention in sandy soils.");
    }
    if (moisture === "very-dry") {
        amendments.push("Apply surface mulch (straw/plastic) to conserve soil moisture and reduce evaporation by up to 50%.");
    }
    if (organicCount === 0) {
        amendments.push("Encourage biological activity: avoid excessive tillage, add organic residues, and reduce chemical pesticide use.");
    }

    if (amendments.length === 0) {
        amendments.push("Your soil appears healthy! Continue regular crop rotation and organic matter addition to maintain fertility.");
    }

    // ---- Store in State ----
    state.soilLab = {
        analyzed: true,
        healthScore: healthScore,
        nutrients: { n: Math.round(baseN), p: Math.round(baseP), k: Math.round(baseK), fe: Math.round(baseFe), zn: Math.round(baseZn) },
        organicMatter: parseFloat(organicMatter.toFixed(1)),
        phValue: ph,
        phCategory: phCategory,
        phDescription: phDescription,
        phCropImpact: phCropImpact,
        cropRankings: cropRankings,
        amendments: amendments
    };
}

function renderSoilLabReport() {
    if (!state.soilLab.analyzed) return;

    const lab = state.soilLab;
    const lang = state.lang;

    function nutrientStatus(val) {
        if (val < 35) return { cls: "low", label: getText("soillab-low", lang) };
        if (val < 65) return { cls: "medium", label: getText("soillab-medium", lang) };
        return { cls: "high", label: getText("soillab-high", lang) };
    }

    const nSt = nutrientStatus(lab.nutrients.n);
    const pSt = nutrientStatus(lab.nutrients.p);
    const kSt = nutrientStatus(lab.nutrients.k);
    const feSt = nutrientStatus(lab.nutrients.fe);
    const znSt = nutrientStatus(lab.nutrients.zn);
    const omSt = nutrientStatus(lab.organicMatter * 12);

    // pH marker position (0-100%)
    const phPercent = ((lab.phValue - 3.0) / 7.0) * 100;

    const phColorClass = lab.phCategory === "acidic" ? "acidic" : lab.phCategory === "neutral" ? "neutral" : "alkaline";

    // Build crop compatibility table rows
    let cropRows = "";
    lab.cropRankings.forEach(cr => {
        const ratingLabel = cr.score >= 75 ? "Excellent" : cr.score >= 50 ? "Good" : "Poor";
        const barClass = cr.score >= 75 ? "excellent" : cr.score >= 50 ? "good" : "poor";
        cropRows += `
            <tr>
                <td style="font-weight: 500;"><i class="fa-solid fa-seedling" style="color:var(--accent-green); margin-right:6px;"></i>${cr.cropName}</td>
                <td>
                    <div class="crop-match-bar"><div class="crop-match-fill ${barClass}" style="width: ${cr.score}%"></div></div>
                </td>
                <td style="font-size:0.8rem; color:var(--text-secondary);">${cr.fertSuggestion}</td>
                <td><span class="nutrient-status ${cr.score >= 75 ? 'high' : cr.score >= 50 ? 'medium' : 'low'}">${ratingLabel}</span></td>
            </tr>`;
    });

    // Build amendment items
    let amendItems = "";
    lab.amendments.forEach(a => {
        amendItems += `<li class="amendment-item"><i class="fa-solid fa-circle-check"></i><span>${a}</span></li>`;
    });

    // Full report HTML
    const reportHTML = `
        <div class="soillab-report">
            <!-- Hero Card -->
            <div class="soillab-hero-card">
                <div class="soillab-hero-left">
                    <div class="soillab-avatar"><i class="fa-solid fa-flask-vial"></i></div>
                    <div class="soillab-hero-text">
                        <h3>${getText("soillab-hero-title", lang)}</h3>
                        <p>${getText("soillab-hero-subtitle", lang)}</p>
                    </div>
                </div>
                <div class="soillab-health-badge">
                    <span class="health-val">${lab.healthScore}%</span>
                    <span class="health-label">${getText("soillab-health-label", lang)}</span>
                </div>
            </div>
            
            <div class="soillab-detail-grid">
                <!-- Nutrient Profile Card -->
                <div class="soillab-detail-card">
                    <div class="detail-card-title"><i class="fa-solid fa-chart-bar"></i> ${getText("soillab-nutrient-title", lang)}</div>
                    <div class="nutrient-row">
                        <span class="nutrient-label">${getText("soillab-n", lang)}</span>
                        <div class="nutrient-bar-track"><div class="nutrient-bar-fill nitrogen" style="width: ${lab.nutrients.n}%"></div></div>
                        <span class="nutrient-value">${lab.nutrients.n}%</span>
                        <span class="nutrient-status ${nSt.cls}">${nSt.label}</span>
                    </div>
                    <div class="nutrient-row">
                        <span class="nutrient-label">${getText("soillab-p", lang)}</span>
                        <div class="nutrient-bar-track"><div class="nutrient-bar-fill phosphorus" style="width: ${lab.nutrients.p}%"></div></div>
                        <span class="nutrient-value">${lab.nutrients.p}%</span>
                        <span class="nutrient-status ${pSt.cls}">${pSt.label}</span>
                    </div>
                    <div class="nutrient-row">
                        <span class="nutrient-label">${getText("soillab-k", lang)}</span>
                        <div class="nutrient-bar-track"><div class="nutrient-bar-fill potassium" style="width: ${lab.nutrients.k}%"></div></div>
                        <span class="nutrient-value">${lab.nutrients.k}%</span>
                        <span class="nutrient-status ${kSt.cls}">${kSt.label}</span>
                    </div>
                    <div class="nutrient-row">
                        <span class="nutrient-label">${getText("soillab-fe", lang)}</span>
                        <div class="nutrient-bar-track"><div class="nutrient-bar-fill iron" style="width: ${lab.nutrients.fe}%"></div></div>
                        <span class="nutrient-value">${lab.nutrients.fe}%</span>
                        <span class="nutrient-status ${feSt.cls}">${feSt.label}</span>
                    </div>
                    <div class="nutrient-row">
                        <span class="nutrient-label">${getText("soillab-zn", lang)}</span>
                        <div class="nutrient-bar-track"><div class="nutrient-bar-fill zinc" style="width: ${lab.nutrients.zn}%"></div></div>
                        <span class="nutrient-value">${lab.nutrients.zn}%</span>
                        <span class="nutrient-status ${znSt.cls}">${znSt.label}</span>
                    </div>
                    <div class="nutrient-row">
                        <span class="nutrient-label">${getText("soillab-om", lang)}</span>
                        <div class="nutrient-bar-track"><div class="nutrient-bar-fill organic" style="width: ${Math.min(lab.organicMatter * 12, 100)}%"></div></div>
                        <span class="nutrient-value">${lab.organicMatter}%</span>
                        <span class="nutrient-status ${omSt.cls}">${omSt.label}</span>
                    </div>
                </div>
                
                <!-- pH Analysis Card -->
                <div class="soillab-detail-card">
                    <div class="detail-card-title"><i class="fa-solid fa-vial"></i> ${getText("soillab-ph-title", lang)}</div>
                    <div class="ph-scale-viz">
                        <div class="ph-scale-bar">
                            <div class="ph-marker" style="left: calc(${phPercent}% - 2px);"></div>
                        </div>
                        <div class="ph-scale-labels">
                            <span>3.0 Acidic</span>
                            <span>5.5</span>
                            <span>7.0 Neutral</span>
                            <span>8.5</span>
                            <span>10.0 Alkaline</span>
                        </div>
                    </div>
                    <div class="ph-reading-card">
                        <span class="ph-reading-val ${phColorClass}">${lab.phValue.toFixed(1)}</span>
                        <div class="ph-reading-info">
                            <h5>${lab.phCategory.charAt(0).toUpperCase() + lab.phCategory.slice(1)} Soil</h5>
                            <p>${lab.phDescription}</p>
                        </div>
                    </div>
                    <div style="margin-top: 1rem; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 0.8rem; color: var(--text-secondary);">
                        <i class="fa-solid fa-seedling" style="color: var(--accent-green); margin-right: 6px;"></i>
                        <strong>Crop Impact:</strong> ${lab.phCropImpact}
                    </div>
                </div>
                
                <!-- Crop Recommendation Table -->
                <div class="soillab-detail-card span-full">
                    <div class="detail-card-title"><i class="fa-solid fa-ranking-star"></i> ${getText("soillab-crop-title", lang)}</div>
                    <div style="overflow-x: auto;">
                        <table class="crop-rec-table">
                            <thead>
                                <tr>
                                    <th>${getText("soillab-crop-name", lang)}</th>
                                    <th>${getText("soillab-crop-match", lang)}</th>
                                    <th>${getText("soillab-crop-fert", lang)}</th>
                                    <th>${getText("soillab-crop-rating", lang)}</th>
                                </tr>
                            </thead>
                            <tbody>${cropRows}</tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Amendment Recommendations -->
                <div class="soillab-detail-card span-full">
                    <div class="detail-card-title"><i class="fa-solid fa-wand-magic-sparkles"></i> ${getText("soillab-amend-title", lang)}</div>
                    <ul class="amendment-list">${amendItems}</ul>
                </div>
            </div>
        </div>
    `;

    dom.soillabReportArea.innerHTML = reportHTML;
}

// ==========================================================================
// 11. Initialization & Event Bindings
// ==========================================================================


// ==========================================================================
// 10. Fertilizer & Pesticide Dosage Calculation Engine
// ==========================================================================

function calculateFertilizerAndPesticides(cropObj, stageId, areaAcres) {
    if (!cropObj || !cropObj.fertilizers) {
        return {
            urea: 0, dap: 0, mop: 0, zinc: 0, fym: 0, splitNote: "", pesticides: []
        };
    }

    const area = areaAcres > 0 ? areaAcres : 1.0;
    const f = cropObj.fertilizers;

    return {
        urea: (f.ureaKgPerAcre * area).toFixed(1),
        dap: (f.dapKgPerAcre * area).toFixed(1),
        mop: (f.mopKgPerAcre * area).toFixed(1),
        zinc: (f.zincKgPerAcre * area).toFixed(1),
        fym: (f.fymTonsPerAcre * area).toFixed(1),
        splitNote: f.splitNote || "",
        pesticides: (cropObj.pesticides || []).map(p => {
            // If dosage has numbers, scale them by area
            let scaledDosage = p.dosagePerAcre;
            const numMatch = p.dosagePerAcre.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
            if (numMatch) {
                const scaledVal = (parseFloat(numMatch[1]) * area).toFixed(numMatch[1].includes('.') ? 1 : 0);
                scaledDosage = `${scaledVal} ${numMatch[2]}`;
            }
            const scaledWater = p.waterLiters > 0 ? Math.round(p.waterLiters * area) : 0;
            return {
                pest: p.pest,
                chemical: p.chemical,
                dosage: scaledDosage,
                waterLiters: scaledWater,
                safetyDays: p.safetyDays
            };
        })
    };
}

function renderFertilizerPesticideSection() {
    if (!dom.advisorFertGrid || !dom.advisorPestList) return;

    const crop = state.crop || CROPS[0];
    const stage = state.stage || "germination";
    const area = state.area || 1.0;
    const pref = state.preference || "balanced";
    const lang = state.lang;

    const fp = calculateFertilizerAndPesticides(crop, stage, area);

    if (pref === "organic" && crop.organic) {
        dom.advisorFertGrid.innerHTML = `
            <div class="fert-card urea" style="grid-column: span 2;">
                <div class="fert-card-icon"><i class="fa-solid fa-leaf"></i></div>
                <div class="fert-card-val">${(crop.fertilizers.fymTonsPerAcre * area).toFixed(1)} Tons</div>
                <div class="fert-card-lbl">Organic FYM / Compost</div>
            </div>
            <div class="fert-card mop" style="grid-column: span 2;">
                <div class="fert-card-icon"><i class="fa-solid fa-seedling"></i></div>
                <div class="fert-card-val">${(150 * area).toFixed(0)} kg</div>
                <div class="fert-card-lbl">Neem Cake / Bio-Inputs</div>
            </div>
        `;
        if (dom.advisorFertSplitNote) {
            dom.advisorFertSplitNote.innerHTML = `<strong><i class="fa-solid fa-leaf"></i> 100% Organic Advice (${area} Acre${area > 1 ? 's' : ''}):</strong> ${crop.organic.fertNote}`;
        }
        dom.advisorPestList.innerHTML = `
            <div class="pest-alert-card">
                <div class="pest-alert-header">
                    <span class="pest-name"><i class="fa-solid fa-shield-halved"></i> Organic Bio-Pest Control</span>
                    <span class="pest-badge">100% Eco-Friendly</span>
                </div>
                <div class="pest-solution">
                    <strong>Organic Protocol:</strong> ${crop.organic.pestNote}
                </div>
            </div>
        `;
    } else {
        dom.advisorFertGrid.innerHTML = `
            <div class="fert-card urea">
                <div class="fert-card-icon"><i class="fa-solid fa-droplet"></i></div>
                <div class="fert-card-val">${fp.urea} kg</div>
                <div class="fert-card-lbl">${getText("fert-urea", lang)}</div>
            </div>
            <div class="fert-card dap">
                <div class="fert-card-icon"><i class="fa-solid fa-seedling"></i></div>
                <div class="fert-card-val">${fp.dap} kg</div>
                <div class="fert-card-lbl">${getText("fert-dap", lang)}</div>
            </div>
            <div class="fert-card mop">
                <div class="fert-card-icon"><i class="fa-solid fa-leaf"></i></div>
                <div class="fert-card-val">${fp.mop} kg</div>
                <div class="fert-card-lbl">${getText("fert-mop", lang)}</div>
            </div>
            <div class="fert-card zinc">
                <div class="fert-card-icon"><i class="fa-solid fa-flask"></i></div>
                <div class="fert-card-val">${fp.zinc} kg</div>
                <div class="fert-card-lbl">${getText("fert-zinc", lang)}</div>
            </div>
        `;

        if (dom.advisorFertSplitNote) {
            dom.advisorFertSplitNote.innerHTML = `<strong><i class="fa-solid fa-circle-info"></i> Application Schedule (${area} Acre${area > 1 ? 's' : ''}):</strong> ${fp.splitNote}`;
        }

        if (fp.pesticides.length === 0) {
            dom.advisorPestList.innerHTML = `<div class="pest-alert-card"><div class="pest-solution">No critical pesticide required at this stage.</div></div>`;
        } else {
            dom.advisorPestList.innerHTML = fp.pesticides.map(p => `
                <div class="pest-alert-card">
                    <div class="pest-alert-header">
                        <span class="pest-name"><i class="fa-solid fa-bug"></i> ${p.pest}</span>
                        <span class="pest-badge">${getText("pest-safety-period", lang)}: ${p.safetyDays} ${p.safetyDays === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div class="pest-solution">
                        <strong>Recommended Control:</strong> ${p.chemical}
                    </div>
                    <div class="pest-meta">
                        <span><i class="fa-solid fa-vial"></i> <strong>Total Dosage:</strong> ${p.dosage}</span>
                        ${p.waterLiters > 0 ? `<span><i class="fa-solid fa-droplet"></i> <strong>Spray Dilution:</strong> ${p.waterLiters} L water</span>` : ''}
                    </div>
                </div>
            `).join("");
        }
    }

    // Render Seed Treatment Guidance Box
    if (dom.advisorSeedTreatment) {
        dom.advisorSeedTreatment.innerHTML = `
            <div class="seed-step-item">
                <strong><i class="fa-solid fa-seedling"></i> Seed Treatment Protocol (${getText(crop.nameKey, lang)}):</strong> ${crop.seedTreatment || "Treat seeds with Trichoderma (10g/kg) or Captan (3g/kg) prior to sowing."}
            </div>
        `;
    }

    // Render Flower Booster Guidance Box
    if (dom.advisorFlowerBooster) {
        if (crop.flowerBoosters) {
            dom.advisorFlowerBooster.innerHTML = `
                <div class="flower-booster-item">
                    <strong><i class="fa-solid fa-wand-magic-sparkles"></i> Floriculture Bloom & Petal Booster:</strong> ${crop.flowerBoosters}
                </div>
            `;
        } else {
            dom.advisorFlowerBooster.innerHTML = `
                <div class="flower-booster-item" style="border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.02);">
                    <strong><i class="fa-solid fa-info-circle"></i> Crop Spec:</strong> Standard agronomic field crop. Focus on balanced NPK vegetative & grain filling nutrition.
                </div>
            `;
        }
    }
}


// ==========================================================================
// 11. Seasonal Crop Calendar & Crop Rotation Engine
// ==========================================================================

let currentSeasonFilter = "all";

function renderCropPlanner(filterSeason = "all") {
    currentSeasonFilter = filterSeason;
    if (!dom.plannerCalendarGrid || !dom.plannerRotationBox) return;

    const lang = state.lang;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Filter crops based on selected season pill
    const filteredCrops = CROPS.filter(c => {
        if (filterSeason === "all") return true;
        return c.season === filterSeason;
    });

    // Render Rotation Sequence for current active crop
    const mainCrop = state.crop || CROPS[0];
    const seq = mainCrop.rotationSequence || ["Pulse Crop", "Oilseed Crop", "Cereal Crop"];

    dom.plannerRotationBox.innerHTML = `
        <div class="rotation-step-card">
            <span class="rotation-year-badge"><i class="fa-solid fa-leaf"></i> Year 1 (Current)</span>
            <div class="rotation-crop-name">${getText(mainCrop.nameKey, lang)}</div>
            <div class="rotation-benefit">Primary Crop: Maximizes main economic yield & seasonal utilization.</div>
        </div>
        <div class="rotation-step-card">
            <span class="rotation-year-badge"><i class="fa-solid fa-arrows-rotate"></i> Year 2 (Recommended)</span>
            <div class="rotation-crop-name">${seq[0]}</div>
            <div class="rotation-benefit">Soil Nitrogen Fixation: Replenishes organic soil nitrates and reduces fertilizer cost.</div>
        </div>
        <div class="rotation-step-card">
            <span class="rotation-year-badge"><i class="fa-solid fa-shield-cat"></i> Year 3 (Break Crop)</span>
            <div class="rotation-crop-name">${seq[1]}</div>
            <div class="rotation-benefit">Pest & Pathogen Break: Disrupts soil-borne fungal spores and weed cycles.</div>
        </div>
    `;

    // Render Month-by-Month Timeline Grid
    dom.plannerCalendarGrid.innerHTML = filteredCrops.map(c => {
        const cropName = getText(c.nameKey, lang);
        const sowing = c.sowingMonths || [5, 6];
        const growth = c.growthMonths || [7, 8];
        const harvest = c.harvestMonths || [9, 10];

        const monthCellsHTML = months.map((m, idx) => {
            let cls = "";
            let label = m[0];
            if (sowing.includes(idx)) cls = "sowing";
            else if (growth.includes(idx)) cls = "growth";
            else if (harvest.includes(idx)) cls = "harvest";

            return `<div class="month-cell ${cls}" title="${m}">${label}</div>`;
        }).join("");

        return `
            <div class="planner-calendar-card">
                <div class="planner-card-header">
                    <span class="planner-crop-title">${cropName}</span>
                    <span class="season-tag ${c.season}">${c.season}</span>
                </div>
                <div class="month-timeline-bar">
                    ${monthCellsHTML}
                </div>
                <div class="pest-meta" style="margin-top: 8px;">
                    <span><i class="fa-solid fa-circle" style="color: #059669;"></i> Sowing</span>
                    <span><i class="fa-solid fa-circle" style="color: #d97706;"></i> Growth</span>
                    <span><i class="fa-solid fa-circle" style="color: #dc2626;"></i> Harvest</span>
                </div>
            </div>
        `;
    }).join("");
}


// ==========================================================================
// 12. Generative AI (Gemini API) Integration Engine
// ==========================================================================

async function callGeminiAPI(userPrompt) {
    if (!state.geminiKey) return null;

    const cropName = state.crop ? getText(state.crop.nameKey, state.lang) : "General Crop";
    const locName = state.location ? state.location.nameEn : "General Region";
    const soilName = state.soil ? getText(state.soil.nameKey, state.lang) : "General Soil";
    const stageName = state.stage || "germination";
    const area = state.area || 1.0;

    const systemInstruction = `You are Krishi Jal AI, an expert agricultural scientist and agronomist. Provide practical, accurate, farmer-friendly advice on crops, irrigation, soil health, fertilizers, and pest control. Current farm context: Location: ${locName}, Soil: ${soilName}, Crop: ${cropName}, Growth Stage: ${stageName}, Farm Area: ${area} Acres, Practice Preference: ${state.preference}. Format response concisely with bullet points.`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(state.geminiKey)}`;
        const body = {
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `${systemInstruction}

Farmer Question: ${userPrompt}`
                        }
                    ]
                }
            ]
        };

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts.map(p => p.text).join("\n");
        }
    } catch (err) {
        console.error("Gemini API Call Error:", err);
    }

    return null;
}

function init() {
    // Initial dropdown/datalist options will be populated dynamically via translateDOM() at the end of init()

    // Bind input listeners to support both typing searches and datalist auto-selects
    let locationDebounceTimer = null;
    const handleLocationChange = async () => {
        const val = dom.selectLocation.value;
        if (!val || val.trim().length < 2) return;

        const locObj = await resolveLocationAsync(val);

        if (locObj) {
            state.location = locObj;
            dom.coordsDisplay.textContent = `Lat: ${locObj.lat.toFixed(2)} | Lon: ${locObj.lon.toFixed(2)}`;

            // Auto fill default soil if available
            if (locObj.defaultSoil) {
                const defaultSoilObj = SOILS.find(s => s.id === locObj.defaultSoil);
                if (defaultSoilObj) {
                    state.soil = defaultSoilObj;
                    dom.selectSoil.value = getText(defaultSoilObj.nameKey, state.lang);
                }
            }

            await fetchWeather(locObj.lat, locObj.lon);
            renderActiveTab();
        }
    };

    dom.selectLocation.addEventListener("input", () => {
        clearTimeout(locationDebounceTimer);
        locationDebounceTimer = setTimeout(handleLocationChange, 400);
    });

    dom.selectLocation.addEventListener("change", handleLocationChange);

    dom.selectSoil.addEventListener("input", () => {
        const val = dom.selectSoil.value;
        const soilObj = resolveSoil(val);
        if (soilObj) {
            state.soil = soilObj;
            renderActiveTab();
        }
    });

    dom.selectCrop.addEventListener("input", () => {
        const val = dom.selectCrop.value;
        const cropObj = resolveCrop(val);
        if (cropObj) {
            state.crop = cropObj;
        }
    });

    if (dom.selectPreference) {
        dom.selectPreference.addEventListener("change", () => {
            state.preference = dom.selectPreference.value;
            renderFertilizerPesticideSection();
            renderProfitabilitySection();
        });
    }

    if (dom.selectArea) {
        dom.selectArea.addEventListener("input", () => {
            const val = parseFloat(dom.selectArea.value);
            if (!isNaN(val) && val > 0) {
                state.area = val;
            }
        });
    }

    dom.selectStage.addEventListener("input", () => {
        const val = dom.selectStage.value;
        state.stage = resolveStage(val);
    });

    // Select all text in inputs on click for immediate typing
    const inputsToSelect = [dom.selectLocation, dom.selectSoil, dom.selectCrop, dom.selectStage];
    inputsToSelect.forEach(inp => {
        if (inp) {
            inp.addEventListener("click", () => inp.select());
        }
    });

    // Global language change selector trigger
    dom.selectLang.addEventListener("change", () => {
        state.lang = dom.selectLang.value;
        translateDOM();
    });

    // Imperial units metric toggle
    dom.toggleUnits.addEventListener("change", () => {
        state.unitImperial = dom.toggleUnits.checked;

        // Rerender active tab elements to reflect conversion instantly
        renderActiveTab();
        if (dom.advisorReport.style.display === "block") {
            renderSimulationReport();
        }
    });

    // Terminal console input cmd processing bind
    dom.consoleCmdInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const inputVal = dom.consoleCmdInput.value;
            if (inputVal.trim()) {
                handleConsoleCommand(inputVal);
                dom.consoleCmdInput.value = "";
            }
        }
    });

    // Clicking anywhere on the console container focuses the input
    const consoleContainer = document.getElementById("ai-console-container");
    if (consoleContainer) {
        consoleContainer.addEventListener("click", () => {
            dom.consoleCmdInput.focus();
        });
    }

    // Form submission generation action bind
    dom.btnGenerate.addEventListener("click", async () => {
        // Show spinner for active feedback
        if (dom.btnSpinner) dom.btnSpinner.style.display = "inline-block";
        dom.btnGenerate.disabled = true;

        try {
            // Resolve exact location asynchronously (supports any global city/region via Geocoding API)
            state.location = await resolveLocationAsync(dom.selectLocation.value);
            if (state.location && dom.coordsDisplay) {
                dom.coordsDisplay.textContent = `Lat: ${state.location.lat.toFixed(2)} | Lon: ${state.location.lon.toFixed(2)}`;
            }

            state.soil = resolveSoil(dom.selectSoil.value);
            state.crop = resolveCrop(dom.selectCrop.value);
            state.stage = resolveStage(dom.selectStage.value);
            if (dom.selectArea && parseFloat(dom.selectArea.value) > 0) {
                state.area = parseFloat(dom.selectArea.value);
            }

            // Always fetch real-time 7-day weather for the resolved location before generating plan!
            if (state.location) {
                await fetchWeather(state.location.lat, state.location.lon);
            }

            runAIAdvisorSimulation();
        } catch (err) {
            console.error("Error generating simulation:", err);
        } finally {
            if (dom.btnSpinner) dom.btnSpinner.style.display = "none";
            dom.btnGenerate.disabled = false;
        }
    });

    // Soil Lab: pH slider live display update
    if (dom.slPh) {
        dom.slPh.addEventListener("input", () => {
            dom.slPhDisplay.textContent = parseFloat(dom.slPh.value).toFixed(1);
        });
    }

    // Soil Lab: Analyze button
    if (dom.btnAnalyzeSoil) {
        dom.btnAnalyzeSoil.addEventListener("click", () => {
            // Show spinner
            dom.slBtnSpinner.style.display = "inline-block";
            dom.btnAnalyzeSoil.disabled = true;

            // Simulate AI processing delay for premium feel
            setTimeout(() => {
                analyzeSoilSample();
                renderSoilLabReport();

                // Hide spinner
                dom.slBtnSpinner.style.display = "none";
                dom.btnAnalyzeSoil.disabled = false;
            }, 1200);
        });
    }

    // Global AI Smart Live Search Bar Handlers
    if (dom.globalSearchInput && dom.globalSearchResults) {
        const renderSearchResults = (query) => {
            const clean = query.trim().toLowerCase();
            if (!clean) {
                dom.globalSearchResults.style.display = "none";
                dom.globalSearchResults.innerHTML = "";
                return;
            }

            const matchedCrops = CROPS.filter(c =>
                c.id.includes(clean) ||
                getText(c.nameKey, state.lang).toLowerCase().includes(clean)
            );

            const matchedSoils = SOILS.filter(s =>
                s.id.includes(clean) ||
                getText(s.nameKey, state.lang).toLowerCase().includes(clean)
            );

            const matchedLocations = LOCATIONS.filter(l =>
                l.id.includes(clean) ||
                l.nameEn.toLowerCase().includes(clean) ||
                (l.nameHi && l.nameHi.toLowerCase().includes(clean))
            );

            let html = "";

            // Crops
            matchedCrops.forEach(c => {
                const cName = getText(c.nameKey, state.lang);
                html += `
                    <div class="search-result-item" data-type="crop" data-id="${c.id}">
                        <div class="search-result-icon"><i class="fa-solid fa-wheat-awn"></i></div>
                        <div class="search-result-info">
                            <span class="search-result-title">${cName}</span>
                            <span class="search-result-sub">Crop Profile & Market Rate: ₹${c.mandiPricePerQuintal || 2200}/Qtl</span>
                        </div>
                    </div>
                `;
            });

            // Soils
            matchedSoils.forEach(s => {
                const sName = getText(s.nameKey, state.lang);
                html += `
                    <div class="search-result-item" data-type="soil" data-id="${s.id}">
                        <div class="search-result-icon"><i class="fa-solid fa-mountain"></i></div>
                        <div class="search-result-info">
                            <span class="search-result-title">${sName}</span>
                            <span class="search-result-sub">Soil Texture & Water Retention: ${s.retention}%</span>
                        </div>
                    </div>
                `;
            });

            // Locations
            matchedLocations.forEach(l => {
                const lName = state.lang === "hi" ? l.nameHi : l.nameEn;
                html += `
                    <div class="search-result-item" data-type="location" data-id="${l.id}">
                        <div class="search-result-icon"><i class="fa-solid fa-location-dot"></i></div>
                        <div class="search-result-info">
                            <span class="search-result-title">${lName}</span>
                            <span class="search-result-sub">Agricultural Region & Climate Coordinates</span>
                        </div>
                    </div>
                `;
            });

            // Always add Ask Gemini AI option at bottom
            html += `
                <div class="search-result-item search-result-ask-ai" data-type="ai" data-query="${query}">
                    <div class="search-result-icon"><i class="fa-solid fa-brain"></i></div>
                    <div class="search-result-info">
                        <span class="search-result-title">Ask Gemini AI about "${query}"</span>
                        <span class="search-result-sub">Stream instant real-time agronomic AI answers</span>
                    </div>
                </div>
            `;

            dom.globalSearchResults.innerHTML = html;
            dom.globalSearchResults.style.display = "block";

            // Bind click handlers to items
            dom.globalSearchResults.querySelectorAll(".search-result-item").forEach(item => {
                item.addEventListener("click", () => {
                    const type = item.getAttribute("data-type");
                    if (type === "crop") {
                        const cId = item.getAttribute("data-id");
                        const cropObj = CROPS.find(c => c.id === cId);
                        if (cropObj) {
                            state.crop = cropObj;
                            if (dom.selectCrop) dom.selectCrop.value = getText(cropObj.nameKey, state.lang);
                            const dashTab = document.querySelector('.tab-link[data-tab="dashboard"]'); if (dashTab) dashTab.click();
                            renderSimulationReport();
                        }
                    } else if (type === "soil") {
                        const sId = item.getAttribute("data-id");
                        const soilObj = SOILS.find(s => s.id === sId);
                        if (soilObj) {
                            state.soil = soilObj;
                            if (dom.selectSoil) dom.selectSoil.value = getText(soilObj.nameKey, state.lang);
                            const dashTab = document.querySelector('.tab-link[data-tab="dashboard"]'); if (dashTab) dashTab.click();
                            renderSimulationReport();
                        }
                    } else if (type === "location") {
                        const lId = item.getAttribute("data-id");
                        const locObj = LOCATIONS.find(l => l.id === lId);
                        if (locObj) {
                            state.location = locObj;
                            if (dom.selectLocation) dom.selectLocation.value = state.lang === "hi" ? locObj.nameHi : locObj.nameEn;
                            fetchWeather(locObj.lat, locObj.lon).then(() => renderActiveTab());
                        }
                    } else if (type === "ai") {
                        const aiQuery = item.getAttribute("data-query");
                        const advTab = document.querySelector('.tab-link[data-tab="advisor"]'); if (advTab) advTab.click();
                        handleConsoleCommand(aiQuery);
                    }
                    dom.globalSearchResults.style.display = "none";
                });
            });
        };

        dom.globalSearchInput.addEventListener("input", (e) => {
            renderSearchResults(e.target.value);
        });

        dom.globalSearchInput.addEventListener("focus", (e) => {
            renderSearchResults(e.target.value);
        });

        dom.globalSearchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const query = dom.globalSearchInput.value.trim();
                if (query) {
                    dom.globalSearchResults.style.display = "none";
                    const advTab = document.querySelector('.tab-link[data-tab="advisor"]'); if (advTab) advTab.click();
                    handleConsoleCommand(query);
                }
            }
        });

        document.addEventListener("click", (e) => {
            if (!dom.globalSearchInput.contains(e.target) && !dom.globalSearchResults.contains(e.target)) {
                dom.globalSearchResults.style.display = "none";
            }
        });
    }

    // AI Quick Prompt Chips Click Listeners
    const promptChips = document.querySelectorAll(".prompt-chip");
    promptChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const promptText = chip.getAttribute("data-prompt");
            if (promptText) {
                const advTab = document.querySelector('.tab-link[data-tab="advisor"]'); if (advTab) advTab.click();
                handleConsoleCommand(promptText);
            }
        });
    });

    if (dom.eduSelectCrop) dom.eduSelectCrop.addEventListener("change", renderEducationCenter);
    if (dom.eduSelectSoil) dom.eduSelectSoil.addEventListener("change", renderEducationCenter);

    if (dom.schemeSearchInput) {
        dom.schemeSearchInput.addEventListener("input", renderGovernmentSchemes);
    }

    // Trigger initial settings loading
    state.location = LOCATIONS[0];
    state.soil = SOILS.find(s => s.id === state.location.defaultSoil) || SOILS[0];
    state.crop = CROPS[0];
    state.stage = "germination";

    // Bind season filter pill buttons in Crop Planner tab
    const seasonPills = document.querySelectorAll(".season-pill");
    seasonPills.forEach(pill => {
        pill.addEventListener("click", () => {
            seasonPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            const season = pill.getAttribute("data-season");
            renderCropPlanner(season);
        });
    });

    if (!localStorage.getItem("krishi_gemini_key")) {
        localStorage.setItem("krishi_gemini_key", "");
        state.geminiKey = "";
    }

}

// Start application when DOM is ready
window.addEventListener("DOMContentLoaded", init);
