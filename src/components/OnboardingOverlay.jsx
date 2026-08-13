import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { STATE_DISTRICTS } from '../data/constants';

// Onboarding Translation Dictionary
const DICT = {
  en: {
    welcome: "Welcome to Krishi Jal 🌾",
    subtitle: "Let's personalize your farming experience.",
    expl: "Select your location to get farming information, schemes, weather, crop recommendations, market prices and services relevant to your area.",
    btnStart: "Start Profile Setup",
    stateLabel: "Which state do you farm in?",
    distLabel: "Select your District",
    searchPlaceholder: "Type to search...",
    next: "Next ➡️",
    prev: "⬅️ Previous",
    farmTitle: "Tell us about your farm",
    cropLabel: "Primary Crop",
    sizeLabel: "Farm Size",
    typeLabel: "Farming Type",
    skip: "Skip & Complete",
    completeBtn: "Complete Profile",
    successTitle: "Your farming profile is ready! 🌱",
    state: "State:",
    district: "District:",
    mainCrop: "Main Crop:",
    farmSize: "Farm Size:",
    farmingType: "Farming Type:",
    dashboardBtn: "Continue to Dashboard",
    locStep: "📍 Location",
    farmStep: "🌾 Farm",
    doneStep: "✅ Complete",
    required: "Please fill all required fields",
    skipOptional: "Skip Optional Fields"
  },
  hi: {
    welcome: "कृषि जल में आपका स्वागत है 🌾",
    subtitle: "आइए आपके खेती के अनुभव को व्यक्तिगत बनाएं।",
    expl: "अपने क्षेत्र से संबंधित खेती की जानकारी, योजनाएं, मौसम, फसल सुझाव, बाजार दरें और सेवाएं प्राप्त करने के लिए अपना स्थान चुनें।",
    btnStart: "प्रोफ़ाइल सेटअप शुरू करें",
    stateLabel: "आप किस राज्य में खेती करते हैं?",
    distLabel: "अपने जिले का चयन करें",
    searchPlaceholder: "खोजने के लिए टाइप करें...",
    next: "आगे बढ़ें ➡️",
    prev: "⬅️ पीछे जाएं",
    farmTitle: "हमें अपने खेत के बारे में बताएं",
    cropLabel: "मुख्य फसल",
    sizeLabel: "खेत का आकार",
    typeLabel: "खेती का प्रकार",
    skip: "छोड़ें और पूरा करें",
    completeBtn: "प्रोफ़ाइल पूरी करें",
    successTitle: "आपकी खेती की प्रोफ़ाइल तैयार है! 🌱",
    state: "राज्य:",
    district: "जिला:",
    mainCrop: "मुख्य फसल:",
    farmSize: "खेत का आकार:",
    farmingType: "खेती का प्रकार:",
    dashboardBtn: "डैशबोर्ड पर जाएं",
    locStep: "📍 स्थान",
    farmStep: "🌾 खेत",
    doneStep: "✅ पूर्ण",
    required: "कृपया सभी आवश्यक फ़ील्ड भरें",
    skipOptional: "वैकल्पिक छोड़ें"
  },
  kn: {
    welcome: "ಕೃಷಿ ಜಲ್ ಗೆ ಸ್ವಾಗತ 🌾",
    subtitle: "ನಿಮ್ಮ ಕೃಷಿ ಅನುಭವವನ್ನು ವೈಯಕ್ತೀಕರಿಸೋಣ.",
    expl: "ನಿಮ್ಮ ಪ್ರದೇಶಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಕೃಷಿ ಮಾಹಿತಿ, ಯೋಜನೆಗಳು, ಹವಾಮಾನ, ಬೆಳೆ ಶಿಫಾರಸುಗಳು, ಮಾರುಕಟ್ಟೆ ದರಗಳು ಮತ್ತು ಸೇವೆಗಳನ್ನು ಪಡೆಯಲು ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    btnStart: "ಪ್ರೊಫೈಲ್ ಸೆಟಪ್ ಪ್ರಾರಂಭಿಸಿ",
    stateLabel: "ನೀವು ಯಾವ ರಾಜ್ಯದಲ್ಲಿ ಕೃಷಿ ಮಾಡುತ್ತೀರಿ?",
    distLabel: "ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    searchPlaceholder: "ಹುಡುಕಲು ಟೈಪ್ ಮಾಡಿ...",
    next: "ಮುಂದೆ ➡️",
    prev: "⬅️ ಹಿಂದೆ",
    farmTitle: "ನಿಮ್ಮ ಜಮೀನಿನ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ",
    cropLabel: "ಮುಖ್ಯ ಬೆಳೆ",
    sizeLabel: "ಜಮೀನಿನ ಗಾತ್ರ",
    typeLabel: "ಕೃಷಿ ವಿಧಾನ",
    skip: "ಬಿಟ್ಟುಬಿಡಿ ಮತ್ತು ಪೂರ್ಣಗೊಳಿಸಿ",
    completeBtn: "ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ",
    successTitle: "ನಿಮ್ಮ ಕೃಷಿ ಪ್ರೊಫೈಲ್ ಸಿದ್ಧವಾಗಿದೆ! 🌱",
    state: "ರಾಜ್ಯ:",
    district: "ಜಿಲ್ಲೆ:",
    mainCrop: "ಮುಖ್ಯ ಬೆಳೆ:",
    farmSize: "ಜಮೀನಿನ ಗಾತ್ರ:",
    farmingType: "ಕೃಷಿ ವಿಧಾನ:",
    dashboardBtn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ",
    locStep: "📍 ಸ್ಥಳ",
    farmStep: "🌾 ಜಮೀನು",
    doneStep: "✅ ಪೂರ್ಣಗೊಂಡಿದೆ",
    required: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ",
    skipOptional: "ಐಚ್ಛಿಕ ಕ್ಷೇತ್ರಗಳನ್ನು ಬಿಟ್ಟುಬಿಡಿ"
  }
};

const cropsList = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Tomato", "Onion", "Pulses", "Fruits", "Vegetables", "Other"];
const sizesList = ["Less than 1 acre", "1–2 acres", "2–5 acres", "5–10 acres", "More than 10 acres"];
const typesList = ["Traditional farming", "Organic farming", "Mixed farming", "Commercial farming"];

export function OnboardingOverlay() {
  const { lang, setLang, updateProfile, farmerProfile } = useApp();
  const [step, setStep] = useState(0); // 0: Welcome, 1: Location, 2: Farm Details, 3: Completed
  
  const [stateSearch, setStateSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');

  const [primaryCrop, setPrimaryCrop] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [farmingType, setFarmingType] = useState('');

  // Prefill when editing profile
  useEffect(() => {
    if (farmerProfile) {
      if (farmerProfile.state) setSelectedState(farmerProfile.state);
      if (farmerProfile.district) setSelectedDistrict(farmerProfile.district);
      if (farmerProfile.primary_crop) setPrimaryCrop(farmerProfile.primary_crop);
      if (farmerProfile.farm_size) setFarmSize(farmerProfile.farm_size);
      if (farmerProfile.farming_type) setFarmingType(farmerProfile.farming_type);
    }
  }, [farmerProfile]);

  const [completedProfile, setCompletedProfile] = useState(null);

  // Fallback to English if translation is missing
  const t = DICT[lang] || DICT.en;

  const states = Object.keys(STATE_DISTRICTS).sort();
  const filteredStates = states.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()));

  const districts = selectedState ? STATE_DISTRICTS[selectedState] : [];
  const filteredDistricts = districts.filter(d => d.toLowerCase().includes(districtSearch.toLowerCase()));

  const handleStart = () => setStep(1);

  const handleLocationSubmit = () => {
    if (!selectedState || !selectedDistrict) {
      alert(t.required);
      return;
    }
    setStep(2);
  };

  const handleFarmSubmit = (isSkipped = false) => {
    const profileData = {
      name: farmerProfile?.name || 'Farmer',
      state: selectedState,
      district: selectedDistrict,
      primary_crop: isSkipped ? '' : primaryCrop,
      farm_size: isSkipped ? '' : farmSize,
      farming_type: isSkipped ? '' : farmingType
    };
    setCompletedProfile(profileData);
    setStep(3);
  };

  const handleDashboardContinue = async () => {
    if (completedProfile) {
      await updateProfile(completedProfile);
    }
  };

  if (farmerProfile?.completed) return null;

  return (
    <div className="onboarding-overlay">
      <style>{`
        .onboarding-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(16, 36, 26, 0.98) 0%, rgba(6, 12, 9, 0.99) 100%);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          color: #f8fafc;
          font-family: 'Inter', sans-serif;
          overflow-y: auto;
        }
        .onboarding-card {
          background: rgba(22, 48, 35, 0.85);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(40, 199, 111, 0.15);
          border-radius: 24px;
          width: 100%;
          max-width: 580px;
          padding: 2.5rem;
          position: relative;
        }
        .onboarding-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .onboarding-title {
          font-size: 2rem;
          font-family: 'Outfit', sans-serif;
          background: linear-gradient(135deg, #ffffff 0%, #a3e635 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
          font-weight: 800;
        }
        .onboarding-subtitle {
          color: #cbd5e1;
          font-size: 1rem;
        }
        .onboarding-progress {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          position: relative;
        }
        .progress-line {
          position: absolute;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          top: 50%;
          left: 10%;
          right: 10%;
          z-index: 1;
        }
        .progress-line-active {
          position: absolute;
          height: 2px;
          background: #4ade80;
          top: 50%;
          left: 10%;
          z-index: 1;
          transition: width 0.3s ease;
        }
        .progress-step {
          background: #1e293b;
          border: 2px solid rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          z-index: 2;
          font-weight: 600;
          color: #94a3b8;
          transition: all 0.3s ease;
        }
        .progress-step.active {
          background: #16a34a;
          border-color: #4ade80;
          color: #ffffff;
          box-shadow: 0 0 10px rgba(74, 222, 128, 0.3);
        }
        .progress-step.done {
          background: #15803d;
          border-color: #22c55e;
          color: #ffffff;
        }
        .lang-selector-card {
          margin-bottom: 1.5rem;
          text-align: right;
        }
        .lang-select-onboarding {
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          outline: none;
          cursor: pointer;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-label-ob {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: #f1f5f9;
        }
        .searchable-select {
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          overflow: hidden;
        }
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          outline: none;
        }
        .options-list {
          max-height: 180px;
          overflow-y: auto;
          padding: 0.5rem 0;
        }
        .option-item {
          padding: 0.6rem 1.2rem;
          cursor: pointer;
          font-size: 0.95rem;
          transition: background 0.2s ease;
        }
        .option-item:hover {
          background: rgba(40, 199, 111, 0.15);
        }
        .option-item.selected {
          background: rgba(40, 199, 111, 0.3);
          color: #4ade80;
          font-weight: 600;
        }
        .form-control-ob {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
        }
        .btn-action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        .btn-ob {
          padding: 0.85rem 1.75rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-ob-primary {
          background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(22, 163, 74, 0.3);
          flex: 1;
        }
        .btn-ob-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(22, 163, 74, 0.4);
        }
        .btn-ob-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #cbd5e1;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .btn-ob-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .summary-box {
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 1rem;
        }
        .summary-item:last-child {
          margin-bottom: 0;
        }
        .summary-label {
          color: #94a3b8;
        }
        .summary-value {
          font-weight: 600;
          color: #ffffff;
        }
        /* Mobile Adaptations */
        @media (max-width: 600px) {
          .onboarding-card {
            padding: 1.5rem;
          }
          .onboarding-title {
            font-size: 1.6rem;
          }
          .progress-step {
            padding: 0.4rem 0.8rem;
            font-size: 0.75rem;
          }
          .btn-ob {
            padding: 0.75rem 1.25rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="onboarding-card">
        {/* Language Selector in Header */}
        {step < 3 && (
          <div className="lang-selector-card">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="lang-select-onboarding"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>
        )}

        {/* Welcome Screen (Step 0) */}
        {step === 0 && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h1 className="onboarding-title">{t.welcome}</h1>
            <p className="onboarding-subtitle" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{t.subtitle}</p>
            <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              {t.expl}
            </p>
            <button className="btn-ob btn-ob-primary" onClick={handleStart} style={{ width: '100%', padding: '1.1rem' }}>
              {t.btnStart}
            </button>
          </div>
        )}

        {/* Location Flow Wizard */}
        {step > 0 && (
          <div>
            <div className="onboarding-progress">
              <div className="progress-line"></div>
              <div className="progress-line-active" style={{ width: `${((step - 1) / 2) * 80 + 10}%` }}></div>
              <div className={`progress-step ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}>{t.locStep}</div>
              <div className={`progress-step ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}>{t.farmStep}</div>
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>{t.doneStep}</div>
            </div>

            {/* Step 1: Location Setup */}
            {step === 1 && (
              <div>
                <div className="onboarding-header">
                  <h2 className="onboarding-title">{t.stateLabel}</h2>
                </div>

                <div className="form-group">
                  <div className="searchable-select">
                    <input
                      type="text"
                      className="search-input"
                      placeholder={t.searchPlaceholder}
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                    />
                    <div className="options-list">
                      {filteredStates.map((s) => (
                        <div
                          key={s}
                          className={`option-item ${selectedState === s ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedState(s);
                            setSelectedDistrict('');
                            setDistrictSearch('');
                          }}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedState && (
                  <div className="form-group">
                    <label className="form-label-ob">{t.distLabel}</label>
                    <div className="searchable-select">
                      <input
                        type="text"
                        className="search-input"
                        placeholder={t.searchPlaceholder}
                        value={districtSearch}
                        onChange={(e) => setDistrictSearch(e.target.value)}
                      />
                      <div className="options-list">
                        {filteredDistricts.map((d) => (
                          <div
                            key={d}
                            className={`option-item ${selectedDistrict === d ? 'selected' : ''}`}
                            onClick={() => setSelectedDistrict(d)}
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="btn-action-row">
                  <button className="btn-ob btn-ob-secondary" onClick={() => setStep(0)}>{t.prev}</button>
                  <button
                    className="btn-ob btn-ob-primary"
                    disabled={!selectedState || !selectedDistrict}
                    onClick={handleLocationSubmit}
                    style={{ opacity: (!selectedState || !selectedDistrict) ? 0.6 : 1 }}
                  >
                    {t.next}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Farm Details Setup */}
            {step === 2 && (
              <div>
                <div className="onboarding-header">
                  <h2 className="onboarding-title">{t.farmTitle}</h2>
                </div>

                <div className="form-group">
                  <label className="form-label-ob">{t.cropLabel}</label>
                  <select
                    className="form-control-ob"
                    value={primaryCrop}
                    onChange={(e) => setPrimaryCrop(e.target.value)}
                  >
                    <option value="">-- Select Crop --</option>
                    {cropsList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label-ob">{t.sizeLabel}</label>
                  <select
                    className="form-control-ob"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                  >
                    <option value="">-- Select Size --</option>
                    {sizesList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label-ob">{t.typeLabel}</label>
                  <select
                    className="form-control-ob"
                    value={farmingType}
                    onChange={(e) => setFarmingType(e.target.value)}
                  >
                    <option value="">-- Select Type --</option>
                    {typesList.map(tOption => <option key={tOption} value={tOption}>{tOption}</option>)}
                  </select>
                </div>

                <div className="btn-action-row">
                  <button className="btn-ob btn-ob-secondary" onClick={() => setStep(1)}>{t.prev}</button>
                  <button className="btn-ob btn-ob-secondary" onClick={() => handleFarmSubmit(true)}>{t.skip}</button>
                  <button className="btn-ob btn-ob-primary" onClick={() => handleFarmSubmit(false)}>{t.completeBtn}</button>
                </div>
              </div>
            )}

            {/* Step 3: Success Screen */}
            {step === 3 && (
              <div style={{ textAlign: 'center' }}>
                <h2 className="onboarding-title" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>{t.successTitle}</h2>
                
                <div className="summary-box">
                  <div className="summary-item">
                    <span className="summary-label">{t.state}</span>
                    <span className="summary-value">{selectedState}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">{t.district}</span>
                    <span className="summary-value">{selectedDistrict}</span>
                  </div>
                  {primaryCrop && (
                    <div className="summary-item">
                      <span className="summary-label">{t.mainCrop}</span>
                      <span className="summary-value">{primaryCrop}</span>
                    </div>
                  )}
                  {farmSize && (
                    <div className="summary-item">
                      <span className="summary-label">{t.farmSize}</span>
                      <span className="summary-value">{farmSize}</span>
                    </div>
                  )}
                  {farmingType && (
                    <div className="summary-item">
                      <span className="summary-label">{t.farmingType}</span>
                      <span className="summary-value">{farmingType}</span>
                    </div>
                  )}
                </div>

                <button className="btn-ob btn-ob-primary" style={{ width: '100%' }} onClick={handleDashboardContinue}>
                  {t.dashboardBtn}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
