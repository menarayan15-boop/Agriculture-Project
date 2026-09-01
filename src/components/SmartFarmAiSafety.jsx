import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';

// NOAA Heat Index Calculation in Celsius
function calculateHeatIndexCelsius(tempC, humidity) {
  if (tempC < 20) return Math.round(tempC * 10) / 10;
  const tf = (tempC * 9) / 5 + 32;
  const rh = Math.min(Math.max(humidity, 0), 100);

  let hiF = 0.5 * (tf + 61.0 + (tf - 68.0) * 1.2 + rh * 0.094);

  if ((hiF + tf) / 2 >= 80) {
    hiF =
      -42.379 +
      2.04901523 * tf +
      10.14333127 * rh -
      0.22475541 * tf * rh -
      0.00683783 * tf * tf -
      0.05481717 * rh * rh +
      0.00122874 * tf * tf * rh +
      0.00085282 * tf * rh * rh -
      0.00000199 * tf * tf * rh * rh;

    if (rh < 13 && tf >= 80 && tf <= 112) {
      hiF -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tf - 95)) / 17);
    } else if (rh > 85 && tf >= 80 && tf <= 87) {
      hiF += ((rh - 85) / 10) * ((87 - tf) / 5);
    }
  }

  const hiC = ((hiF - 32) * 5) / 9;
  return Math.round(hiC * 10) / 10;
}

// Physiological & Heat Risk Evaluation Engine
function evaluateFarmerSafety(temp, humd, hr, lang = 'en') {
  const heatIndex = calculateHeatIndexCelsius(temp, humd);
  const isHi = lang === 'hi';

  // 1. Extreme Critical Danger (Severe Heat Stroke / Cardiovascular Collapse risk)
  if (heatIndex >= 41 || hr >= 135 || (heatIndex >= 36 && hr >= 115)) {
    let whyText = '';
    if (isHi) {
      if (hr >= 135 && heatIndex >= 41) {
        whyText = `अत्यधिक ताप सूचकांक (${heatIndex}°C) और बहुत तेज़ हृदय गति (${hr} bpm)। हीट स्ट्रोक का गंभीर खतरा है। तुरंत काम रोकें और ठंडी छाया में जाएं।`;
      } else if (heatIndex >= 41) {
        whyText = `खतरनाक ताप सूचकांक (${heatIndex}°C) शरीर की सहने की सीमा पार कर चुका है। तुरंत छायादार स्थान पर जाएं।`;
      } else {
        whyText = `गर्मी (${temp}°C) के दौरान हृदय गति (${hr} bpm) खतरनाक स्तर पर है। भारी शारीरिक श्रम तुरंत बंद करें।`;
      }
    } else {
      if (hr >= 135 && heatIndex >= 41) {
        whyText = `Critical heat index (${heatIndex}°C) combined with high cardiovascular strain (${hr} bpm). Heat stroke risk imminent. Cease work and rest in shade.`;
      } else if (heatIndex >= 41) {
        whyText = `Dangerous apparent heat index of ${heatIndex}°C exceeds physiological safety limits. Move to cool shelter immediately.`;
      } else {
        whyText = `Extreme cardiovascular load (${hr} bpm) detected under thermal stress (${temp}°C). Stop physical labor and cool down.`;
      }
    }

    return {
      level: 'danger',
      status: isHi ? 'खतरा: तुरंत छाया में जाएं' : 'DANGER: SEEK SHADE',
      riskBadge: isHi ? 'गंभीर गर्मी का खतरा' : 'CRITICAL HEAT RISK',
      badgeColor: '#ef4444',
      badgeBg: '#2a1212',
      sphereClass: 'sphere-danger',
      statusColor: '#ef4444',
      why: whyText,
      timelineLabel: isHi ? 'खतरा' : 'Danger',
      heatIndex
    };
  }

  // 2. High Heat Risk (Heat exhaustion / High thermal strain)
  if (heatIndex >= 33 || hr >= 110 || (heatIndex >= 30 && hr >= 95)) {
    let whyText = '';
    if (isHi) {
      if (heatIndex >= 33 && hr >= 110) {
        whyText = `उच्च ताप सूचकांक (${heatIndex}°C) और बढ़ी हुई हृदय गति (${hr} bpm)। लू और थकावट का उच्च जोखिम है। छाया में अनिवार्य आराम लें।`;
      } else if (heatIndex >= 33) {
        whyText = `उच्च आर्द्रता (${humd}%) के कारण तापमान ${heatIndex}°C महसूस हो रहा है। पसीना सूखने में रुकावट है। छाया में जाएं और पानी पिएं।`;
      } else {
        whyText = `शारीरिक श्रम के कारण हृदय गति (${hr} bpm) सामान्य से अधिक है। 15 मिनट का ब्रेक लें।`;
      }
    } else {
      if (heatIndex >= 33 && hr >= 110) {
        whyText = `Apparent heat index (${heatIndex}°C) and elevated heart rate (${hr} bpm) indicate heat exhaustion risk. Take a mandatory rest in shade.`;
      } else if (heatIndex >= 33) {
        whyText = `High relative humidity (${humd}%) elevates perceived heat to ${heatIndex}°C, impairing evaporative cooling. Seek shaded rest and hydrate.`;
      } else {
        whyText = `Cardiovascular load (${hr} bpm) is elevated under ${temp}°C ambient conditions. Take a 15-minute rest in shade.`;
      }
    }

    return {
      level: 'high',
      status: isHi ? 'खतरा: छाया में आराम करें' : 'DANGER: SEEK SHADE',
      riskBadge: isHi ? 'उच्च गर्मी जोखिम' : 'HIGH HEAT RISK',
      badgeColor: '#f97316',
      badgeBg: '#28170e',
      sphereClass: 'sphere-high',
      statusColor: '#f97316',
      why: whyText,
      timelineLabel: isHi ? 'खतरा' : 'Danger',
      heatIndex
    };
  }

  // 3. Moderate Caution (Warm conditions / High humidity fatigue)
  if (heatIndex >= 28 || hr >= 90 || (temp >= 26 && humd >= 80)) {
    let whyText = '';
    if (isHi) {
      if (humd >= 80) {
        whyText = `उच्च आर्द्रता (${humd}%) के कारण गर्मी का प्रभाव बढ़ रहा है (ताप सूचकांक: ${heatIndex}°C)। हृदय गति (${hr} bpm) स्थिर है। हर 20 मिनट में पानी पिएं।`;
      } else {
        whyText = `मध्यम ताप भार (ताप सूचकांक: ${heatIndex}°C, हृदय गति: ${hr} bpm)। नियमित रूप से पानी पीते रहें।`;
      }
    } else {
      if (humd >= 80) {
        whyText = `High humidity (${humd}%) at ${temp}°C elevates thermal index to ${heatIndex}°C. Heart rate is steady at ${hr} bpm. Maintain regular hydration.`;
      } else {
        whyText = `Moderate thermal stress (Heat Index: ${heatIndex}°C, HR: ${hr} bpm). Regular hydration recommended during farm work.`;
      }
    }

    return {
      level: 'caution',
      status: isHi ? 'सावधानी: पर्याप्त पानी पिएं' : 'CAUTION: HYDRATE FREQUENTLY',
      riskBadge: isHi ? 'मध्यम गर्मी का तनाव' : 'MODERATE HEAT STRESS',
      badgeColor: '#eab308',
      badgeBg: '#262010',
      sphereClass: 'sphere-caution',
      statusColor: '#eab308',
      why: whyText,
      timelineLabel: isHi ? 'सावधानी' : 'Caution',
      heatIndex
    };
  }

  // 4. Safe & Optimal (Comfortable conditions, relaxed vitals)
  return {
    level: 'safe',
    status: isHi ? 'सुरक्षित: सामान्य कार्य स्थिति' : 'SAFE: NORMAL FIELD CONDITIONS',
    riskBadge: isHi ? 'कम जोखिम (सुरक्षित)' : 'LOW RISK',
    badgeColor: '#22c55e',
    badgeBg: '#112517',
    sphereClass: 'sphere-safe',
    statusColor: '#22c55e',
    why: isHi
      ? `सभी मान स्थिर हैं। तापमान (${temp}°C) और हृदय गति (${hr} bpm) पूर्णतः सुरक्षित सीमा में हैं।`
      : `Values are stable. Environmental temperature (${temp}°C) and heart rate (${hr} bpm) are within safe physiological limits.`,
    timelineLabel: isHi ? 'सुरक्षित' : 'Safe',
    heatIndex
  };
}

// Location-Aware Nearest Healthcare Facility Database
const HOSPITAL_DATABASE = {
  haryana: {
    name: 'Karnal Govt. PHC',
    nameHi: 'करनाल सरकारी प्राथमिक स्वास्थ्य केंद्र (PHC)',
    distKm: '6.2',
    etaMins: '14',
    ambulance: '108',
    city: 'Karnal, Haryana',
    lat: 29.685,
    lon: 76.99
  },
  punjab: {
    name: 'Ludhiana Civil Hospital & PHC',
    nameHi: 'लुधियाना सिविल अस्पताल एवं PHC',
    distKm: '4.8',
    etaMins: '11',
    ambulance: '108',
    city: 'Ludhiana, Punjab',
    lat: 30.901,
    lon: 75.857
  },
  maharashtra: {
    name: 'Nashik Rural CHC & Trauma Centre',
    nameHi: 'नाशिक ग्रामीण CHC एवं ट्रॉमा सेंटर',
    distKm: '5.4',
    etaMins: '12',
    ambulance: '108',
    city: 'Nashik, Maharashtra',
    lat: 19.997,
    lon: 73.79
  },
  andhra: {
    name: 'Guntur Govt. General PHC',
    nameHi: 'गुंटूर सरकारी सामान्य स्वास्थ्य केंद्र',
    distKm: '7.1',
    etaMins: '16',
    ambulance: '108',
    city: 'Guntur, Andhra Pradesh',
    lat: 16.306,
    lon: 80.436
  },
  up: {
    name: 'Kanpur Dehat CHC',
    nameHi: 'कानपुर देहात सामुदायिक स्वास्थ्य केंद्र',
    distKm: '8.0',
    etaMins: '18',
    ambulance: '108',
    city: 'Kanpur, Uttar Pradesh',
    lat: 26.449,
    lon: 80.331
  },
  rajasthan: {
    name: 'Sri Ganganagar Govt. PHC',
    nameHi: 'श्री गंगानगर सरकारी PHC',
    distKm: '5.9',
    etaMins: '13',
    ambulance: '108',
    city: 'Sri Ganganagar, Rajasthan',
    lat: 29.928,
    lon: 73.878
  },
  bengal: {
    name: 'Bardhaman Block PHC',
    nameHi: 'बर्धमान ब्लॉक प्राथमिक स्वास्थ्य केंद्र',
    distKm: '6.5',
    etaMins: '15',
    ambulance: '108',
    city: 'Bardhaman, West Bengal',
    lat: 23.232,
    lon: 87.861
  },
  gujarat: {
    name: 'Anand Community Health Centre',
    nameHi: 'आनंद सामुदायिक स्वास्थ्य केंद्र (CHC)',
    distKm: '4.2',
    etaMins: '10',
    ambulance: '108',
    city: 'Anand, Gujarat',
    lat: 22.564,
    lon: 72.928
  },
  karnataka: {
    name: 'Bengaluru Rural PHC',
    nameHi: 'बेंगलुरु ग्रामीण प्राथमिक स्वास्थ्य केंद्र',
    distKm: '5.1',
    etaMins: '12',
    ambulance: '108',
    city: 'Bengaluru, Karnataka',
    lat: 12.971,
    lon: 77.594
  },
  tn: {
    name: 'Coimbatore Govt. PHC',
    nameHi: 'कोयंबटूर सरकारी प्राथमिक स्वास्थ्य केंद्र',
    distKm: '6.0',
    etaMins: '14',
    ambulance: '108',
    city: 'Coimbatore, Tamil Nadu',
    lat: 11.016,
    lon: 76.955
  },
  telangana: {
    name: 'Warangal Area Hospital & PHC',
    nameHi: 'वरंगल एरिया अस्पताल एवं PHC',
    distKm: '7.3',
    etaMins: '17',
    ambulance: '108',
    city: 'Warangal, Telangana',
    lat: 17.978,
    lon: 79.601
  },
  mp: {
    name: 'Indore Rural CHC',
    nameHi: 'इंदौर ग्रामीण सामुदायिक स्वास्थ्य केंद्र',
    distKm: '5.6',
    etaMins: '13',
    ambulance: '108',
    city: 'Indore, Madhya Pradesh',
    lat: 22.719,
    lon: 75.857
  },
  bihar: {
    name: 'Patna Sadar PHC',
    nameHi: 'पटना सदर प्राथमिक स्वास्थ्य केंद्र',
    distKm: '4.9',
    etaMins: '11',
    ambulance: '108',
    city: 'Patna, Bihar',
    lat: 25.594,
    lon: 85.137
  }
};

export function SmartFarmAiSafety({ liveWeatherData = null }) {
  const { lang, location } = useApp ? useApp() : { lang: 'en', location: null };
  const isHindi = lang === 'hi';

  // Sensor state initialized to match standard field demo values
  const [temp, setTemp] = useState(27);
  const [humd, setHumd] = useState(92);
  const [hr, setHr] = useState(72);
  const [isAssessing, setIsAssessing] = useState(false);
  const [lastAssessedTime, setLastAssessedTime] = useState(null);

  // Strain & Chemical State (customizable)
  const [caloriesBurned, setCaloriesBurned] = useState(1695);
  const [sunExposureHrs, setSunExposureHrs] = useState(4.6);
  const [sprayChemical, setSprayChemical] = useState('Mancozeb 75%');
  const [sprayHoursAgo, setSprayHoursAgo] = useState(24);
  const [sprayLoggedTime, setSprayLoggedTime] = useState('yesterday at 4:30 PM');
  const [showChemicalModal, setShowChemicalModal] = useState(false);

  // Auto-sync initial weather from live weather data if available
  useEffect(() => {
    if (liveWeatherData && liveWeatherData.temp !== undefined) {
      setTemp(Math.round(liveWeatherData.temp));
      if (liveWeatherData.humidity !== undefined) {
        setHumd(Math.round(liveWeatherData.humidity));
      }
    }
  }, [liveWeatherData]);

  // Compute real-time AI decision
  const decision = evaluateFarmerSafety(temp, humd, hr, lang);

  // Format Timestamps for Risk Timeline
  const now = new Date();
  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  const timeNow = formatTime(now);
  const timeMinus2h = formatTime(new Date(now.getTime() - 2 * 60 * 60 * 1000));
  const timeMinus4h = formatTime(new Date(now.getTime() - 4 * 60 * 60 * 1000));

  // Resolved Nearest Hospital
  const hospital = useMemo(() => {
    const locKey = location && location.id ? location.id.toLowerCase() : 'haryana';
    return (
      HOSPITAL_DATABASE[locKey] || {
        name: `${(location && location.nameEn) || 'Karnal'} Govt. PHC`,
        nameHi: `${(location && location.nameHi) || 'करनाल'} सरकारी प्राथमिक स्वास्थ्य केंद्र`,
        distKm: '6.2',
        etaMins: '14',
        ambulance: '108',
        city: (location && location.nameEn) || 'Karnal, Haryana',
        lat: (location && location.lat) || 29.68,
        lon: (location && location.lon) || 76.99
      }
    );
  }, [location]);

  const handleRiskAssessment = useCallback(() => {
    setIsAssessing(true);
    setTimeout(() => {
      setIsAssessing(false);
      const currentTime = new Date();
      setLastAssessedTime(
        currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 350);
  }, []);

  const handleResetToLive = () => {
    if (liveWeatherData && liveWeatherData.temp !== undefined) {
      setTemp(Math.round(liveWeatherData.temp));
      if (liveWeatherData.humidity !== undefined) {
        setHumd(Math.round(liveWeatherData.humidity));
      }
    } else {
      setTemp(27);
      setHumd(92);
    }
    setHr(72);
    handleRiskAssessment();
  };

  const handleCall108 = () => {
    window.open('tel:108', '_self');
  };

  const handleOpenDirections = () => {
    const query = encodeURIComponent(`${hospital.name}, ${hospital.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const isReiSafe = sprayHoursAgo >= 24;

  return (
    <div className="farmer-safety-suite-wrapper">
      {/* 1. Main Top Safety & AI Decision Card */}
      <div className="smartfarm-safety-container">
        {/* Left Column: Your Current Safety */}
        <div className="smartfarm-left-section">
          <div className="safety-header-label">
            <span className="farmer-icon">🧑‍🌾</span>
            <span>{isHindi ? 'आपकी वर्तमान सुरक्षा' : 'YOUR CURRENT SAFETY'}</span>
          </div>

          <div className="safety-status-display">
            <div className={`safety-sphere ${decision.sphereClass}`} title={`Risk Level: ${decision.level}`}>
              <div className="sphere-glow"></div>
            </div>
            <span className="safety-status-text" style={{ color: decision.statusColor }}>
              {decision.status}
            </span>
          </div>

          <div className="safety-why-container">
            <div className="why-label">W H Y ?</div>
            <div className="why-text">{decision.why}</div>
          </div>
        </div>

        {/* Right Column: SmartFarm AI Decision */}
        <div className="smartfarm-right-section">
          <div className="ai-decision-box">
            <div className="ai-decision-title">
              <span className="brain-emoji">🧠</span>
              <span>{isHindi ? 'स्मार्टफार्म एआई निर्णय' : 'SMARTFARM AI DECISION'}</span>
            </div>

            <div className="sensor-rows">
              {/* Temp Control */}
              <div className="sensor-row">
                <div className="sensor-info">
                  <span className="sensor-icon">🌡️</span>
                  <span className="sensor-label">
                    {isHindi ? 'तापमान' : 'Temp'}: {temp}°C
                  </span>
                </div>
                <div className="sensor-actions">
                  <button
                    type="button"
                    className="adjust-btn minus"
                    onClick={() => {
                      setTemp((t) => Math.max(t - 1, 10));
                      handleRiskAssessment();
                    }}
                    title={isHindi ? 'तापमान घटाएं' : 'Decrease Temp'}
                    aria-label="Decrease Temperature"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="adjust-btn plus"
                    onClick={() => {
                      setTemp((t) => Math.min(t + 1, 55));
                      handleRiskAssessment();
                    }}
                    title={isHindi ? 'तापमान बढ़ाएं' : 'Increase Temp'}
                    aria-label="Increase Temperature"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Humidity Control */}
              <div className="sensor-row">
                <div className="sensor-info">
                  <span className="sensor-icon">💧</span>
                  <span className="sensor-label">
                    {isHindi ? 'आर्द्रता' : 'Humd'}: {humd}%
                  </span>
                </div>
                <div className="sensor-actions">
                  <button
                    type="button"
                    className="adjust-btn minus"
                    onClick={() => {
                      setHumd((h) => Math.max(h - 2, 10));
                      handleRiskAssessment();
                    }}
                    title={isHindi ? 'आर्द्रता घटाएं' : 'Decrease Humidity'}
                    aria-label="Decrease Humidity"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="adjust-btn plus"
                    onClick={() => {
                      setHumd((h) => Math.min(h + 2, 100));
                      handleRiskAssessment();
                    }}
                    title={isHindi ? 'आर्द्रता बढ़ाएं' : 'Increase Humidity'}
                    aria-label="Increase Humidity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Heart Rate Control */}
              <div className="sensor-row">
                <div className="sensor-info">
                  <span className="sensor-icon">💖</span>
                  <span className="sensor-label">
                    {isHindi ? 'हृदय गति' : 'HR'}: {hr} bpm
                  </span>
                </div>
                <div className="sensor-actions">
                  <button
                    type="button"
                    className="adjust-btn minus"
                    onClick={() => {
                      setHr((r) => Math.max(r - 3, 45));
                      handleRiskAssessment();
                    }}
                    title={isHindi ? 'हृदय गति घटाएं' : 'Decrease HR'}
                    aria-label="Decrease Heart Rate"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="adjust-btn plus"
                    onClick={() => {
                      setHr((r) => Math.min(r + 3, 190));
                      handleRiskAssessment();
                    }}
                    title={isHindi ? 'हृदय गति बढ़ाएं' : 'Increase HR'}
                    aria-label="Increase Heart Rate"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* RISK ASSESSMENT Action Button */}
            <button
              type="button"
              className={`risk-assess-action-btn ${isAssessing ? 'pulsing' : ''}`}
              onClick={handleRiskAssessment}
              title={isHindi ? 'जोखिम विश्लेषण चलाएं' : 'Run AI Risk Assessment'}
            >
              {isAssessing
                ? isHindi
                  ? 'मूल्यांकन जारी है...'
                  : 'ASSESSING...'
                : isHindi
                ? 'जोखिम मूल्यांकन'
                : 'RISK ASSESSMENT'}
            </button>

            {/* Flow Direction Indicator */}
            <div className="flow-arrow-down" aria-hidden="true">
              ↓
            </div>

            {/* Risk Badge Output */}
            <div
              className="risk-badge-output"
              style={{
                backgroundColor: decision.badgeBg,
                borderColor: `${decision.badgeColor}55`
              }}
              onClick={handleRiskAssessment}
              role="status"
              aria-live="polite"
            >
              <span
                className="badge-sphere-dot"
                style={{
                  background: decision.badgeColor,
                  boxShadow: `0 0 10px ${decision.badgeColor}`
                }}
              ></span>
              <span className="badge-name" style={{ color: decision.badgeColor }}>
                {decision.riskBadge}
              </span>
            </div>

            {/* Quick Reset / Live Sync Footer */}
            <div className="ai-decision-footer">
              <button
                type="button"
                className="live-sync-btn"
                onClick={handleResetToLive}
                title={isHindi ? 'डिफ़ॉल्ट मानों पर रीसेट करें' : 'Reset to default test values'}
              >
                <i className="fa-solid fa-arrows-rotate"></i>
                <span>{isHindi ? 'मान रीसेट करें' : 'Reset / Live Sync'}</span>
              </button>
              {lastAssessedTime && (
                <span className="last-assessed-label">
                  {isHindi ? `जांचा: ${lastAssessedTime}` : `Checked: ${lastAssessedTime}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Secondary Health & Safety Modules (Risk Timeline, Strain, Hospital, Chemical Safety) */}
      <div className="safety-submodules-grid">
        {/* Left Sub-Card: Risk Timeline & Physical Strain Dashboard */}
        <div className="submodule-card navy-panel left-panel">
          {/* Section A: Risk Timeline */}
          <div className="risk-timeline-section">
            <div className="submodule-header-row">
              <span className="submodule-title">
                {isHindi ? 'जोखिम समयरेखा' : 'RISK TIMELINE'}
              </span>
              <span className="pulse-graph-icon" title="Physiological ECG Monitor">
                <svg width="22" height="16" viewBox="0 0 24 16" fill="none" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 8h4l3-6 4 12 4-8 3 4h4" />
                </svg>
              </span>
            </div>

            <div className="timeline-items-grid">
              {/* Point 1: 4 Hours ago (e.g. 20:39) */}
              <div className="timeline-item">
                <div className="timeline-timestamp">{timeMinus4h || '20:39'}</div>
                <div className="timeline-bar-caution"></div>
                <div className="timeline-status-label caution-label">
                  {isHindi ? 'सावधानी' : 'Caution'}
                </div>
              </div>

              {/* Point 2: 2 Hours ago (e.g. 22:39) */}
              <div className="timeline-item">
                <div className="timeline-timestamp">{timeMinus2h || '22:39'}</div>
                <div className="timeline-bar-caution"></div>
                <div className="timeline-status-label caution-label">
                  {isHindi ? 'सावधानी' : 'Caution'}
                </div>
              </div>

              {/* Point 3: Now (00:39 Now) - Dynamic */}
              <div className="timeline-item">
                <div className="timeline-timestamp current-time">
                  {timeNow || '00:39'} {isHindi ? '(वर्तमान)' : '(Now)'}
                </div>
                <div
                  className={`timeline-pill-now ${
                    decision.level === 'safe'
                      ? 'pill-safe'
                      : decision.level === 'caution'
                      ? 'pill-caution'
                      : 'pill-danger'
                  }`}
                ></div>
                <div
                  className="timeline-status-label"
                  style={{ color: decision.statusColor, fontWeight: 700 }}
                >
                  {decision.timelineLabel}
                </div>
              </div>
            </div>
          </div>

          <div className="submodule-divider"></div>

          {/* Section B: Physical Strain Dashboard */}
          <div className="physical-strain-section">
            <div className="submodule-header-row">
              <span className="submodule-title">
                {isHindi ? 'शारीरिक तनाव डैशबोर्ड' : 'PHYSICAL STRAIN DASHBOARD'}
              </span>
            </div>

            <div className="strain-metrics-grid">
              {/* Calories Burned Card */}
              <div className="strain-metric-card">
                <div className="strain-card-label">
                  {isHindi ? 'कैलोरी जली' : 'Calories Burned'}
                </div>
                <div className="strain-card-value-row">
                  <span className="strain-val-num">{caloriesBurned.toLocaleString()}</span>
                  <span className="strain-val-unit">kcal</span>
                </div>
              </div>

              {/* Sun Exposure Card */}
              <div className="strain-metric-card">
                <div className="strain-card-label">
                  {isHindi ? 'धूप का समय' : 'Sun Exposure'}
                </div>
                <div className="strain-card-value-row">
                  <span className="strain-val-num sun-amber">{sunExposureHrs.toFixed(1)}</span>
                  <span className="strain-val-unit">hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sub-Column: Nearest Hospital & Chemical Exposure Safety */}
        <div className="submodule-right-column">
          {/* Top Card: Nearest Hospital Auto-Routed */}
          <div className="submodule-card navy-panel hospital-card">
            <div className="hospital-header-row">
              <span className="submodule-title">
                {isHindi ? 'निकटतम अस्पताल' : 'NEAREST HOSPITAL'}
              </span>
              <span className="auto-routed-badge">
                {isHindi ? 'ऑटो-रूटेड' : 'AUTO-ROUTED'}
              </span>
            </div>

            <div className="hospital-content-row">
              <div className="hospital-info-box">
                <h3 className="hospital-name-heading">
                  {isHindi ? hospital.nameHi || hospital.name : hospital.name}
                </h3>
                <div className="hospital-meta-details">
                  <span>{hospital.distKm} km {isHindi ? 'दूर' : 'away'}</span>
                  <span className="meta-dot">•</span>
                  <span>{isHindi ? `लगभग ${hospital.etaMins} मिनट` : `Approx ${hospital.etaMins} mins`}</span>
                  <span className="meta-dot">•</span>
                  <span>{isHindi ? 'एंबुलेंस: 108' : `Ambulance: ${hospital.ambulance}`}</span>
                </div>
              </div>

              {/* Map Pin Button */}
              <button
                type="button"
                className="hospital-pin-btn"
                onClick={handleOpenDirections}
                title={isHindi ? 'मानचित्र पर स्थान देखें' : 'View Location on Map'}
                aria-label="View Hospital on Map"
              >
                <i className="fa-solid fa-location-dot"></i>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="hospital-actions-row">
              <button
                type="button"
                className="hospital-btn call-108-btn"
                onClick={handleCall108}
                title="Call 108 Emergency Ambulance"
              >
                <i className="fa-solid fa-phone"></i>
                <span>{isHindi ? '108 पर कॉल करें' : 'Call 108'}</span>
              </button>

              <button
                type="button"
                className="hospital-btn directions-btn"
                onClick={handleOpenDirections}
                title="Get Turn-by-Turn GPS Directions"
              >
                <i className="fa-solid fa-compass"></i>
                <span>{isHindi ? 'दिशा-निर्देश' : 'Directions'}</span>
              </button>
            </div>
          </div>

          {/* Bottom Card: Chemical Exposure Safety */}
          <div className="submodule-card amber-panel chemical-card">
            <div className="chemical-header-row">
              <div className="chemical-title-wrap">
                <span className="flask-icon">🧪</span>
                <span className="chemical-title-text">
                  {isHindi ? 'रासायनिक जोखिम सुरक्षा' : 'CHEMICAL EXPOSURE SAFETY'}
                </span>
              </div>
              <span className="wind-vapor-icon" title="Aerosol & Vapor Dispersion">
                <svg width="26" height="18" viewBox="0 0 24 16" fill="none" stroke="#5d4930" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M2 4h12a3 3 0 1 1-3 3" />
                  <path d="M2 9h16a3 3 0 1 0-3-3" />
                  <path d="M2 14h8a2.5 2.5 0 1 1-2.5 2.5" />
                </svg>
              </span>
            </div>

            <p className="chemical-log-desc">
              {isHindi
                ? `आपने कल शाम 4:30 बजे कीटनाशक छिड़काव सत्र लॉग किया था (${sprayChemical})।`
                : `You logged a pesticide spraying session ${sprayLoggedTime} (${sprayChemical}).`}
            </p>

            <div className="rei-status-box">
              <div className="rei-label">
                {isHindi ? 'पुनः प्रवेश अंतराल (REI)' : 'Re-entry Interval (REI)'}
              </div>
              <div className={`rei-status-value ${isReiSafe ? 'rei-safe' : 'rei-restricted'}`}>
                {isReiSafe ? (
                  <>
                    <span className="rei-check">✓</span>
                    <span>
                      {isHindi
                        ? `पुनः प्रवेश सुरक्षित (${sprayHoursAgo}h पूर्ण)`
                        : `Safe to Re-enter (${sprayHoursAgo}h passed)`}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="rei-warning">⚠️</span>
                    <span>
                      {isHindi
                        ? `प्रवेश प्रतिबंधित (${24 - sprayHoursAgo}h शेष)`
                        : `Restricted Entry (${24 - sprayHoursAgo}h remaining)`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmartFarmAiSafety;
