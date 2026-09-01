import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

// Scientific NOAA Heat Index Calculation in Celsius
function calculateHeatIndexCelsius(tempC, humidity) {
  if (tempC < 20) return tempC;
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
function evaluateFarmerSafety(temp, humd, hr) {
  const heatIndex = calculateHeatIndexCelsius(temp, humd);

  // Severe / Extreme Danger threshold
  if (heatIndex >= 41 || hr >= 140 || (heatIndex >= 34 && hr >= 125)) {
    return {
      level: 'danger',
      status: 'DANGER: SEEK SHADE',
      riskBadge: 'CRITICAL HEAT RISK',
      badgeColor: '#ef4444',
      badgeBg: '#2a1414',
      sphereClass: 'sphere-danger',
      why: 'High thermal strain and cardiovascular load detected. Immediate rest in shade required.'
    };
  }

  // High Heat Risk threshold (matches screenshot: 27°C, 92%, 72 bpm)
  if (heatIndex >= 31 || (temp >= 26 && humd >= 85) || hr >= 115 || (heatIndex >= 28 && hr >= 95)) {
    return {
      level: 'high',
      status: 'DANGER: SEEK SHADE',
      riskBadge: 'HIGH HEAT RISK',
      badgeColor: '#ea580c',
      badgeBg: '#281a14',
      sphereClass: 'sphere-high',
      why: 'Values are stable.'
    };
  }

  // Caution / Moderate threshold
  if (heatIndex >= 26 || (temp >= 24 && humd >= 70) || hr >= 90) {
    return {
      level: 'caution',
      status: 'CAUTION: HYDRATE FREQUENTLY',
      riskBadge: 'MODERATE HEAT STRESS',
      badgeColor: '#eab308',
      badgeBg: '#262214',
      sphereClass: 'sphere-caution',
      why: 'Moderate heat load detected. Regular hydration recommended.'
    };
  }

  // Safe / Optimal threshold
  return {
    level: 'safe',
    status: 'SAFE: NORMAL FIELD CONDITIONS',
    riskBadge: 'LOW RISK',
    badgeColor: '#22c55e',
    badgeBg: '#142618',
    sphereClass: 'sphere-safe',
    why: 'Environment and vitals are within safe working limits.'
  };
}

export function SmartFarmAiSafety({ liveWeatherData = null }) {
  // Input States initialized to match user screenshot: 27°C, 92%, 72 bpm
  const [temp, setTemp] = useState(27);
  const [humd, setHumd] = useState(92);
  const [hr, setHr] = useState(72);
  const [isAssessing, setIsAssessing] = useState(false);

  // Auto-sync initial weather if provided from location
  useEffect(() => {
    if (liveWeatherData && liveWeatherData.temp !== undefined) {
      setTemp(Math.round(liveWeatherData.temp));
      if (liveWeatherData.humidity !== undefined) {
        setHumd(Math.round(liveWeatherData.humidity));
      }
    }
  }, [liveWeatherData]);

  // Compute real-time decision
  const decision = evaluateFarmerSafety(temp, humd, hr);

  const handleRiskAssessment = useCallback(() => {
    setIsAssessing(true);
    setTimeout(() => {
      setIsAssessing(false);
    }, 300);
  }, []);

  return (
    <div className="smartfarm-safety-container">
      {/* Left Column: Your Current Safety */}
      <div className="smartfarm-left-section">
        <div className="safety-header-label">
          <span className="farmer-icon">🧑‍🌾</span>
          <span>YOUR CURRENT SAFETY</span>
        </div>

        <div className="safety-status-display">
          <div className={`safety-sphere ${decision.sphereClass}`}>
            <div className="sphere-glow"></div>
          </div>
          <span className="safety-status-text">
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
            <span>SMARTFARM AI DECISION</span>
          </div>

          <div className="sensor-rows">
            {/* Temp */}
            <div className="sensor-row">
              <div className="sensor-info">
                <span className="sensor-icon">🌡️</span>
                <span className="sensor-label">Temp: {temp}°C</span>
              </div>
              <div className="sensor-actions">
                <button
                  className="adjust-btn minus"
                  onClick={() => {
                    setTemp((t) => Math.max(t - 1, 10));
                    handleRiskAssessment();
                  }}
                  title="Decrease Temp"
                >
                  -
                </button>
                <button
                  className="adjust-btn plus"
                  onClick={() => {
                    setTemp((t) => Math.min(t + 1, 55));
                    handleRiskAssessment();
                  }}
                  title="Increase Temp"
                >
                  +
                </button>
              </div>
            </div>

            {/* Humd */}
            <div className="sensor-row">
              <div className="sensor-info">
                <span className="sensor-icon">💧</span>
                <span className="sensor-label">Humd: {humd}%</span>
              </div>
              <div className="sensor-actions">
                <button
                  className="adjust-btn minus"
                  onClick={() => {
                    setHumd((h) => Math.max(h - 1, 10));
                    handleRiskAssessment();
                  }}
                  title="Decrease Humidity"
                >
                  -
                </button>
                <button
                  className="adjust-btn plus"
                  onClick={() => {
                    setHumd((h) => Math.min(h + 1, 100));
                    handleRiskAssessment();
                  }}
                  title="Increase Humidity"
                >
                  +
                </button>
              </div>
            </div>

            {/* HR */}
            <div className="sensor-row">
              <div className="sensor-info">
                <span className="sensor-icon">💖</span>
                <span className="sensor-label">HR: {hr} bpm</span>
              </div>
              <div className="sensor-actions">
                <button
                  className="adjust-btn minus"
                  onClick={() => {
                    setHr((r) => Math.max(r - 2, 45));
                    handleRiskAssessment();
                  }}
                  title="Decrease HR"
                >
                  -
                </button>
                <button
                  className="adjust-btn plus"
                  onClick={() => {
                    setHr((r) => Math.min(r + 2, 180));
                    handleRiskAssessment();
                  }}
                  title="Increase HR"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* RISK ASSESSMENT Button */}
          <button
            className={`risk-assess-action-btn ${isAssessing ? 'pulsing' : ''}`}
            onClick={handleRiskAssessment}
          >
            {isAssessing ? 'ASSESSING...' : 'RISK ASSESSMENT'}
          </button>

          {/* Down Arrow */}
          <div className="flow-arrow-down">↓</div>

          {/* Risk Badge Output */}
          <div
            className="risk-badge-output"
            style={{
              backgroundColor: decision.badgeBg,
              borderColor: `${decision.badgeColor}44`,
            }}
            onClick={handleRiskAssessment}
          >
            <span
              className="badge-sphere-dot"
              style={{
                background: decision.badgeColor,
                boxShadow: `0 0 8px ${decision.badgeColor}`,
              }}
            ></span>
            <span className="badge-name" style={{ color: decision.badgeColor }}>
              {decision.riskBadge}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmartFarmAiSafety;
