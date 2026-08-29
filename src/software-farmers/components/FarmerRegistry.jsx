import React, { useState } from 'react';
import { api } from '../utils/apiSimulator';
import { Users, UserPlus, Check, Plus, Trash2, Sprout, MapPin, Phone, Globe, Droplet } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

const STR = {
    reg_title: { en: 'Farmer Registration & Profile Database', hi: 'किसान पंजीकरण और प्रोफ़ाइल डेटाबेस', ta: 'விவசாயி பதிவு மற்றும் சுயவிவர தரவுத்தளம்', te: 'రైతు నమోదు మరియు ప్రొఫైల్ డేటాబేస్', mr: 'शेतकरी नोंदणी आणि प्रोफाइल डेटाबेस' },
    reg_subtitle: { en: 'Register new farmers, view their fields, and test multi-tenant system controls.', hi: 'नए किसानों को पंजीकृत करें, उनके खेत देखें, और मल्टी-टेनेंट सिस्टम का परीक्षण करें।', te: 'కొత్త రైతులను నమోదు చేయండి, వారి పొలాలను వీక్షించండి.' },
    btn_show: { en: 'Show Farmer List', hi: 'किसान सूची देखें', te: 'రైతు జాబితా చూపించు', mr: 'शेतकरी यादी पहा' },
    btn_new: { en: 'Register New Farmer', hi: 'नया किसान पंजीकृत करें', te: 'కొత్త రైతును నమోదు చేయండి', mr: 'नवीन शेतकरी नोंदणी करा' },
    form_title: { en: 'New Farmer Enrollment Profile', hi: 'नया किसान नामांकन प्रोफ़ाइल', te: 'కొత్త రైతు నమోదు ప్రొఫైల్' },
    submit_btn: { en: 'Create Farmer Profile & Sync to Main Server Database', hi: 'किसान प्रोफ़ाइल बनाएँ और सर्वर सिंक करें', te: 'రైతు ప్రొఫైల్ సృష్టించండి మరియు సమకాలీకరించండి' },
    load_btn: { en: 'Load Farmer Session & Bind Interfaces', hi: 'किसान सत्र लोड करें और इंटरफ़ेस बाइंड करें', te: 'రైతు సెషన్ లోడ్ చేయండి మరియు బైండ్ చేయండి' }
};
const s = (k, l) => (STR[k] && (STR[k][l] || STR[k]['en'])) || k;

export default function FarmerRegistry({ dbState }) {
    const { lang } = useLang();
    const { registeredFarmers, activeFarmerId } = dbState;
    const [showRegForm, setShowRegForm] = useState(false);

    // Registration Form Local State
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [language, setLanguage] = useState('en');
    const [village, setVillage] = useState('');
    const [district, setDistrict] = useState('');
    const [state, setState] = useState('');
    const [farmLocation, setFarmLocation] = useState('');
    const [waterSource, setWaterSource] = useState('Borewell Pump');
    const [soilType, setSoilType] = useState('Red Sandy Soil');

    // Fields local list for registering new farm fields
    const [fields, setFields] = useState([
        { id: "Field 01", name: "Field 01", size: "2.0 acres", crop: "Tomato", soilMoisture: 45, soilTemp: 27.5, valveState: "OFF", irrigationMode: "AUTO" }
    ]);
    const [fieldName, setFieldName] = useState('');
    const [fieldSize, setFieldSize] = useState('');
    const [fieldCrop, setFieldCrop] = useState('');

    const handleAddField = () => {
        if (!fieldName || !fieldSize || !fieldCrop) return;
        const newFieldId = `Field 0${fields.length + 1}`;
        setFields([
            ...fields,
            {
                id: newFieldId,
                name: fieldName,
                size: `${fieldSize} acres`,
                crop: fieldCrop,
                soilMoisture: 35, // default seed
                soilTemp: 28.0,
                valveState: "OFF",
                irrigationMode: "AUTO"
            }
        ]);
        setFieldName('');
        setFieldSize('');
        setFieldCrop('');
    };

    const handleRemoveField = (idx) => {
        setFields(fields.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !phone || !village || !district || !state) {
            alert("Please fill in all required fields.");
            return;
        }

        const payload = {
            name,
            phone,
            language,
            village,
            district,
            state,
            farmLocation: farmLocation || `${village}, ${district}`,
            waterSource,
            soilType,
            fields
        };

        await api.registerFarmer(payload);

        // Reset Form
        setName('');
        setPhone('');
        setVillage('');
        setDistrict('');
        setState('');
        setFarmLocation('');
        setFields([{ id: "Field 01", name: "Field 01", size: "2.0 acres", crop: "Tomato", soilMoisture: 45, soilTemp: 27.5, valveState: "OFF", irrigationMode: "AUTO" }]);
        setShowRegForm(false);
    };

    const selectFarmer = async (id) => {
        await api.selectActiveFarmer(id);
    };

    return (
        <div className="farmer-registry-page">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Users className="text-emerald-400" />
                        {s('reg_title', lang)}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{s('reg_subtitle', lang)}</p>
                </div>
                <button
                    className="kiosk-tts-toggle active"
                    onClick={() => setShowRegForm(!showRegForm)}
                >
                    <UserPlus size={16} />
                    <span>{showRegForm ? s('btn_show', lang) : s('btn_new', lang)}</span>
                </button>
            </div>

            {showRegForm ? (
                <form onSubmit={handleSubmit} className="farmer-reg-form card-glass p-6 flex flex-col gap-4">
                    <h4 className="text-md font-bold text-emerald-400 border-b border-gray-700 pb-2 flex items-center gap-2">
                        <UserPlus size={18} /> {s('form_title', lang)}
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group flex flex-col gap-1">
                            <label className="text-xs opacity-75">Farmer Name *</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Jitesh Konapalli" className="classic-text-input h-8 px-2" required />
                        </div>

                        <div className="form-group flex flex-col gap-1">
                            <label className="text-xs opacity-75">Mobile Number *</label>
                            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. +91 98888 77777" className="classic-text-input h-8 px-2" required />
                        </div>

                        <div className="form-group flex flex-col gap-1">
                            <label className="text-xs opacity-75">Preferred language</label>
                            <select value={language} onChange={e => setLanguage(e.target.value)} className="crop-selector-dropdown h-8 px-2">
                                <option value="hi">Hindi (हिंदी)</option>
                                <option value="bn">Bengali (বাংলা)</option>
                                <option value="te">Telugu (తెలుగు)</option>
                                <option value="mr">Marathi (मराठी)</option>
                                <option value="ta">Tamil (தமிழ்)</option>
                                <option value="ur">Urdu (اردو)</option>
                                <option value="gu">Gujarati (ગુજરાતી)</option>
                                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                                <option value="or">Odia (ଓଡ଼ିଆ)</option>
                                <option value="ml">Malayalam (മലയാളം)</option>
                                <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
                                <option value="as">Assamese (অসমীয়া)</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                        <div className="form-group flex flex-col gap-1">
                            <label className="text-xs opacity-75">Farm Location / Plot GPS *</label>
                            <input type="text" value={farmLocation} onChange={e => setFarmLocation(e.target.value)} placeholder="e.g. Plot-D Southern Ridge" className="classic-text-input h-8 px-2" required />
                        </div>

                        <div className="form-group flex flex-col gap-1">
                            <label className="text-xs opacity-75">Village *</label>
                            <input type="text" value={village} onChange={e => setVillage(e.target.value)} placeholder="Madanapalle" className="classic-text-input h-8 px-2" required />
                        </div>

                        <div className="form-group flex flex-col gap-1">
                            <label className="text-xs opacity-75">District *</label>
                            <input type="text" value={district} onChange={e => setDistrict(e.target.value)} placeholder="Chittoor" className="classic-text-input h-8 px-2" required />
                        </div>

                        <div className="form-group flex flex-col gap-1">
                            <label className="text-xs opacity-75">State *</label>
                            <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="Andhra Pradesh" className="classic-text-input h-8 px-2" required />
                        </div>

                        <div className="form-group flex flex-col gap-1">
                            <label className="text-xs opacity-75">Available Water Source</label>
                            <select value={waterSource} onChange={e => setWaterSource(e.target.value)} className="crop-selector-dropdown h-8 px-2">
                                <option value="Borewell Pump">Borewell Pump</option>
                                <option value="Canal Irrigation">Canal Irrigation</option>
                                <option value="Rainfed (No Tank)">Rain-fed (No reservoir Tank)</option>
                                <option value="Drip Tank Storage">Drip Tank Reservoir System</option>
                            </select>
                        </div>

                        <div className="form-group flex flex-col gap-1">
                            <label className="text-xs opacity-75">Soil Type</label>
                            <select value={soilType} onChange={e => setSoilType(e.target.value)} className="crop-selector-dropdown h-8 px-2">
                                <option value="Red Sandy Soil">Red Sandy Soil</option>
                                <option value="Black Clay Cotton Soil">Black Clay Cotton Soil</option>
                                <option value="Loam (Alluvial)">Loam (Alluvial Soil)</option>
                                <option value="Desert Silt">Desert Silt</option>
                            </select>
                        </div>
                    </div>

                    {/* Fields List Builder */}
                    <div className="fields-builder card-glass bg-black-20 p-4 rounded-lg mt-2">
                        <div className="flex justify-between items-center mb-2">
                            <h5 className="text-xs font-bold uppercase text-slate-300">Configure Fields / Farm IDs</h5>
                            <span className="text-[10px] bg-emerald-900/50 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30">
                                AI Suggested 🌱: {soilType.includes('Red') ? 'Groundnut, Mango' : soilType.includes('Black') ? 'Cotton, Maize' : soilType.includes('Loam') ? 'Tomato, Rice' : 'Millet, Wheat'}
                            </span>
                        </div>

                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                placeholder="Field label (e.g. Field 01)"
                                value={fieldName}
                                onChange={e => setFieldName(e.target.value)}
                                className="classic-text-input h-8 px-2 text-xs flex-grow"
                            />
                            <input
                                type="number"
                                step="0.1"
                                placeholder="Acres (e.g. 2)"
                                value={fieldSize}
                                onChange={e => setFieldSize(e.target.value)}
                                className="classic-text-input h-8 px-2 text-xs w-20"
                            />
                            <input
                                type="text"
                                placeholder="Crop (Tomato)"
                                value={fieldCrop}
                                onChange={e => setFieldCrop(e.target.value)}
                                className="classic-text-input h-8 px-2 text-xs flex-grow"
                            />
                            <button
                                type="button"
                                onClick={handleAddField}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 w-8 rounded flex items-center justify-center border-none transition-all my-auto"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        {fields.length === 0 ? (
                            <p className="text-xs text-red-400 italic">At least one field requires declaration.</p>
                        ) : (
                            <div className="added-fields-table flex flex-col gap-1">
                                {fields.map((f, index) => (
                                    <div key={index} className="field-row-item flex justify-between items-center text-xs py-1.5 px-2 bg-slate-800 rounded border border-gray-700">
                                        <span className="font-bold font-mono text-emerald-400">{f.name}</span>
                                        <span>{f.size}</span>
                                        <span className="italic">{f.crop}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveField(index)}
                                            className="text-red-400 hover:text-red-500 bg-transparent border-none cursor-pointer"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-sm transition-all border-none mt-2 cursor-pointer"
                    >
                        {s('submit_btn', lang)}
                    </button>
                </form>
            ) : (
                <div className="registered-farmers-grid grid grid-cols-2 gap-4">
                    {registeredFarmers.map((farmer) => {
                        const isActive = farmer.id === activeFarmerId;
                        return (
                            <div key={farmer.id} className={`farmer-profile-card card-glass flex flex-col justify-between ${isActive ? 'border border-emerald-500 bg-emerald-950/15' : ''}`}>
                                <div>
                                    <div className="flex justify-between items-start">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${isActive ? 'bg-emerald-500 text-emerald-950' : 'bg-slate-700 text-slate-300'}`}>
                                            {farmer.id}
                                        </span>
                                        {isActive && (
                                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                                                <Check size={12} /> ACTIVE SESSION
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="text-lg font-bold mt-2 text-white">{farmer.name}</h4>

                                    <div className="farmer-meta-details flex flex-col gap-1 mt-3 text-xs text-gray-300 font-mono">
                                        <div className="flex items-center gap-1.5">
                                            <Phone size={12} className="text-slate-400" />
                                            <span>Mobile: {farmer.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Globe size={12} className="text-slate-400" />
                                            <span>Preferred Language: {farmer.language}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={12} className="text-slate-400" />
                                            <span>Location: {farmer.village}, {farmer.district}, {farmer.state}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-emerald-400">
                                            <MapPin size={12} className="text-emerald-500" />
                                            <span>Farm Location: {farmer.farmLocation || farmer.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-teal-400">
                                            <span className="text-[14px]">📐</span>
                                            <span>Farm Size: {farmer.farmSize || (farmer.fields ? farmer.fields.reduce((acc, f) => acc + parseFloat(f.size || 0), 0) + " acres" : "0 acres")}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Droplet size={12} className="text-slate-400" />
                                            <span>Water Source: {farmer.waterSource}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Sprout size={12} className="text-slate-400" />
                                            <span>Soil Type: {farmer.soilType}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-yellow-400">
                                            <Sprout size={12} className="text-yellow-500" />
                                            <span>Crops Cultivated: {farmer.cropsCultivated}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="farmer-profile-fields-list mt-4">
                                    <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Registered Fields</h5>
                                    <div className="flex flex-col gap-1.5">
                                        {farmer.fields.map((field) => (
                                            <div key={field.id} className="field-badge flex justify-between bg-slate-800/60 p-2 rounded text-xs">
                                                <span className="font-bold">{field.id}</span>
                                                <span className="text-teal-400">{field.size}</span>
                                                <span className="text-yellow-400">{field.crop}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {!isActive && (
                                    <button
                                        onClick={() => selectFarmer(farmer.id)}
                                        className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded text-xs transition border border-gray-700 cursor-pointer"
                                    >
                                        {s('load_btn', lang)}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}