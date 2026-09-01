import React, { useState, useEffect, useCallback } from 'react';
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
    heatIndex
  };
}

export function SmartFarmAiSafety({ liveWeatherData = null }) {
  const { lang } = useApp ? useApp() : { lang: 'en' };

  // Sensor state initialized to match standard field demo values
  const [temp, setTemp] = useState(27);
  const [humd, setHumd] = useState(92);
  const [hr, setHr] = useState(72);
  const [isAssessing, setIsAssessing] = useState(false);
  const [lastAssessedTime, setLastAssessedTime] = useState(null);

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

  const handleRiskAssessment = useCallback(() => {
    setIsAssessing(true);
    setTimeout(() => {
      setIsAssessing(false);
      const now = new Date();
      setLastAssessedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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

  const isHindi = lang === 'hi';

  return (
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
          <span
            className="safety-status-text"
            style={{ color: decision.statusColor }}
          >
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
              borderColor: `${decision.badgeColor}55`,
            }}
            onClick={handleRiskAssessment}
            role="status"
            aria-live="polite"
          >
            <span
              className="badge-sphere-dot"
              style={{
                background: decision.badgeColor,
                boxShadow: `0 0 10px ${decision.badgeColor}`,
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
  );
}

export default SmartFarmAiSafety;
