import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SOILS, getText } from '../../data/constants';
import { SmartFarmAiSafety } from '../SmartFarmAiSafety';

function interpretWeatherCode(code) {
  let icon = "fa-solid fa-sun";
  let defaultDesc = "Clear Sky";
  
  if (code === 0) {
    icon = "fa-solid fa-sun";
    defaultDesc = "Clear Sky";
  } else if (code >= 1 && code <= 3) {
    icon = "fa-solid fa-cloud-sun";
    defaultDesc = "Partly Cloudy";
  } else if (code === 45 || code === 48) {
    icon = "fa-solid fa-smog";
    defaultDesc = "Foggy";
  } else if (code >= 51 && code <= 55) {
    icon = "fa-solid fa-cloud-rain";
    defaultDesc = "Light Drizzle";
  } else if (code >= 61 && code <= 65) {
    icon = "fa-solid fa-cloud-showers-water";
    defaultDesc = "Rainy";
  } else if (code >= 71 && code <= 77) {
    icon = "fa-solid fa-snowflake";
    defaultDesc = "Snowy";
  } else if (code >= 80 && code <= 82) {
    icon = "fa-solid fa-cloud-showers-heavy";
    defaultDesc = "Heavy Showers";
  } else if (code >= 95 && code <= 99) {
    icon = "fa-solid fa-cloud-bolt";
    defaultDesc = "Thunderstorm";
  }
  
  return { icon, defaultDesc };
}

export function DashboardTab() {
  const {
    location,
    soil,
    crop,
    lang,
    report,
    farmerInsights
  } = useApp();

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Fetch real-time weather from Open-Meteo based on selected location coordinates
  useEffect(() => {
    if (!location || !location.lat) return;
    
    setWeatherLoading(true);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,precipitation_probability_max&timezone=auto`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.current) {
          setWeather({
            temp: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m,
            precipProb: data.daily.precipitation_probability_max[0],
            windSpeed: data.current.wind_speed_10m,
            code: data.current.weather_code,
            uv: data.current.weather_code >= 61 ? 1.2 : (data.current.weather_code >= 1 ? 4.0 : 6.5)
          });
        }
        setWeatherLoading(false);
      })
      .catch(err => {
        console.warn('Weather fetch failed:', err);
        setWeatherLoading(false);
      });
  }, [location]);

  // Circumference of stroke-dasharray = 251.2
  const score = report ? report.suitabilityScore : 0;
  const strokeDashoffset = report ? 251.2 - (251.2 * score) / 100 : 251.2;

  const weatherInterpreted = weather ? interpretWeatherCode(weather.code) : { icon: "fa-solid fa-sun", defaultDesc: "Clear Sky" };

  return (
    <div className="tab-panel active">
      {/* SmartFarm AI Decision & Farmer Safety Working Model */}
      <SmartFarmAiSafety liveWeatherData={weather} />

      <div className="dashboard-grid">
        
        {/* AI Farmer Profile Card */}
        {farmerInsights && farmerInsights.profile && (
          <div className="dash-card span-all" style={{
            background: 'var(--bg-gradient)',
            borderTop: '4px solid var(--secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
              {/* Left: Profile Info */}
              <div style={{ flex: '1', minWidth: '250px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{farmerInsights.profile.icon}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                      {lang === 'hi' ? farmerInsights.profile.labelHi : farmerInsights.profile.label}
                    </h3>
                    <span style={{
                      display: 'inline-block',
                      marginTop: '4px',
                      padding: '2px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: `${farmerInsights.profile.color}22`,
                      color: farmerInsights.profile.color,
                      border: `1px solid ${farmerInsights.profile.color}44`
                    }}>
                      {farmerInsights.profile.confidence}% {lang === 'hi' ? 'सटीकता' : 'Confidence'}
                    </span>
                  </div>
                </div>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.5' }}>
                  {lang === 'hi' ? farmerInsights.profile.descHi : farmerInsights.profile.description}
                </p>

                {/* Health Score */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: `conic-gradient(${farmerInsights.healthScore > 70 ? 'var(--primary-light)' : farmerInsights.healthScore > 40 ? 'var(--highlight)' : 'var(--error)'} ${farmerInsights.healthScore * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: 'var(--card-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: 700, color: '#fff'
                    }}>
                      {farmerInsights.healthScore}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>
                      {lang === 'hi' ? 'खेत स्वास्थ्य स्कोर' : 'Farm Health Score'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {lang === 'hi' ? 'जोखिम विश्लेषण पर आधारित' : 'Based on risk analysis'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle: Risks */}
              <div style={{ flex: '1', minWidth: '220px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8' }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px', color: '#f59e0b' }}></i>
                  {lang === 'hi' ? 'जोखिम मूल्यांकन' : 'Risk Assessment'}
                </h4>
                {farmerInsights.risks.length === 0 ? (
                  <div style={{ padding: '12px', borderRadius: 'var(--border-radius-sm)', background: 'rgba(21, 128, 61, 0.15)', border: '1px solid var(--primary)', color: 'var(--primary-light)', fontSize: '0.85rem' }}>
                    <i className="fa-solid fa-shield-check" style={{ marginRight: '6px' }}></i>
                    {lang === 'hi' ? 'कोई बड़ा खतरा नहीं' : 'No significant risks detected'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {farmerInsights.risks.map((risk, i) => (
                      <div key={i} style={{
                        padding: '10px 14px', borderRadius: '10px',
                        background: risk.severity === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        border: `1px solid ${risk.severity === 'high' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                        fontSize: '0.82rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span>{risk.icon}</span>
                          <span style={{ fontWeight: 600, color: '#e2e8f0' }}>
                            {lang === 'hi' ? risk.labelHi : risk.label}
                          </span>
                          <span style={{
                            marginLeft: 'auto',
                            padding: '1px 8px', borderRadius: '10px',
                            fontSize: '0.7rem', fontWeight: 700,
                            background: risk.severity === 'high' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                            color: risk.severity === 'high' ? '#fca5a5' : '#fcd34d'
                          }}>
                            {risk.score}%
                          </span>
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                          {lang === 'hi' ? risk.tipHi : risk.tip}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Tips */}
              <div style={{ flex: '1', minWidth: '220px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-lightbulb" style={{ color: 'var(--primary-light)' }}></i>
                  {lang === 'hi' ? 'व्यक्तिगत सुझाव' : 'Personalized Tips'}
                  {farmerInsights.isExplicitlyPersonalized && (
                    <span style={{
                      background: 'var(--primary)', color: '#fff', 
                      fontSize: '0.65rem', padding: '2px 8px', borderRadius: '12px', marginLeft: 'auto',
                      fontWeight: 600
                    }}>
                      <i className="fa-solid fa-wand-magic-sparkles" style={{marginRight: '4px'}}></i>
                      {lang === 'hi' ? 'आपके लिए' : 'For You'}
                    </span>
                  )}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {farmerInsights.tips.map((tip, i) => (
                    <div key={i} style={{
                      padding: '10px 14px', borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      fontSize: '0.82rem', color: '#cbd5e1',
                      display: 'flex', alignItems: 'flex-start', gap: '8px'
                    }}>
                      <span style={{ flexShrink: 0 }}>{tip.icon}</span>
                      <span>{tip.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Growth Suitability Score Card */}
        <div className="dash-card card-highlight">
          <h3 className="card-title">Growth Suitability Score</h3>
          <div className="gauge-container">
            <svg viewBox="0 0 100 100" className="gauge">
              <path className="gauge-bg" d="M 50 10 A 40 40 0 1 1 49.99 10" fill="none" strokeWidth="8"></path>
              <path 
                className="gauge-fill" 
                d="M 50 10 A 40 40 0 1 1 49.99 10" 
                fill="none" 
                strokeWidth="8" 
                strokeDasharray="251.2" 
                style={{ strokeDashoffset }}
              ></path>
            </svg>
            <div className="gauge-text">
              <span className="gauge-value">{report ? `${score}%` : '--%'}</span>
              <span className="gauge-label">Suitability</span>
            </div>
          </div>
          <div className={`suitability-alert ${report ? 'optimal' : ''}`}>
            <i className={`fa-solid ${report ? 'fa-circle-check' : 'fa-circle-question'}`}></i>
            <span>{report ? report.verdict : 'Submit configuration to analyze'}</span>
          </div>
        </div>

        {/* Current Weather Conditions Card */}
        <div className="dash-card">
          <h3 className="card-title">Current Weather Conditions</h3>
          {weatherLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <i className="fa-solid fa-circle-notch fa-spin fa-2x" style={{ color: 'var(--accent-green)' }}></i>
            </div>
          ) : weather ? (
            <>
              <div className="weather-brief">
                <div className="weather-main-icon">
                  <i className={weatherInterpreted.icon} style={{ fontSize: '2.5rem', color: 'var(--accent-orange)' }}></i>
                </div>
                <div className="weather-main-details">
                  <span className="weather-temp">{weather.temp}°C</span>
                  <span className="weather-desc">{weatherInterpreted.defaultDesc}</span>
                </div>
              </div>
              <div className="weather-details-grid">
                <div className="weather-metric">
                  <span className="metric-icon"><i class="fa-solid fa-droplet"></i></span>
                  <div className="metric-meta">
                    <span className="metric-name">Humidity</span>
                    <span className="metric-val">{weather.humidity}%</span>
                  </div>
                </div>
                <div className="weather-metric">
                  <span className="metric-icon"><i class="fa-solid fa-cloud-showers-water"></i></span>
                  <div className="metric-meta">
                    <span className="metric-name">Rain Probability</span>
                    <span className="metric-val">{weather.precipProb}%</span>
                  </div>
                </div>
                <div className="weather-metric">
                  <span className="metric-icon"><i class="fa-solid fa-wind"></i></span>
                  <div className="metric-meta">
                    <span className="metric-name">Wind Speed</span>
                    <span className="metric-val">{weather.windSpeed} km/h</span>
                  </div>
                </div>
                <div className="weather-metric">
                  <span className="metric-icon"><i class="fa-solid fa-sun"></i></span>
                  <div className="metric-meta">
                    <span className="metric-name">UV Index</span>
                    <span className="metric-val">{weather.uv.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="placeholder-box" style={{ padding: '20px', textAlign: 'center' }}>
              <i className="fa-solid fa-cloud" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}></i>
              <p>Select location to check weather conditions</p>
            </div>
          )}
        </div>

        {/* Soil Retention & Properties Card */}
        <div className="dash-card">
          <h3 className="card-title">Soil Retention & Properties</h3>
          <div className="soil-profile-box">
            <div className="soil-graphic" style={{ background: soil ? soil.color : '#594331', borderRadius: '8px', minWidth: '40px', minHeight: '40px', position: 'relative' }}>
              <div className="soil-particle sand" style={{ position: 'absolute', width: '4px', height: '4px', background: 'rgba(244, 208, 63, 0.4)' }}></div>
              <div className="soil-particle clay" style={{ position: 'absolute', width: '4px', height: '4px', background: 'rgba(255,255,255,0.2)' }}></div>
            </div>
            <div className="soil-profile-details">
              <h4 className="soil-name-heading" style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0' }}>
                {soil ? getText(soil.nameKey, lang) : '--'}
              </h4>
              <p className="soil-desc" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                {soil ? getText(soil.descKey, lang) : 'Select location to check soil retention capacity.'}
              </p>
            </div>
          </div>
          <div className="soil-bars" style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="bar-group">
              <span className="bar-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Water Retention</span>
              <div className="progress-track" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '8px', marginTop: '4px', overflow: 'hidden' }}>
                <div 
                  className="progress-bar" 
                  style={{ width: soil ? `${soil.retention}%` : '0%', background: 'var(--accent-green)', height: '100%' }}
                ></div>
              </div>
            </div>
            <div className="bar-group">
              <span className="bar-label" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Drainage Speed</span>
              <div className="progress-track" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '8px', marginTop: '4px', overflow: 'hidden' }}>
                <div 
                  className="progress-bar progress-orange" 
                  style={{ width: soil ? `${soil.drainage}%` : '0%', background: 'var(--accent-orange)', height: '100%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Suitability Diagnostics Card */}
        <div className="dash-card span-all">
          <h3 className="card-title">Growth Suitability Diagnostics</h3>
          <ul className="diagnostic-list" style={{ listStyle: 'none', padding: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!report ? (
              <li className="diagnostic-item info" style={{ display: 'flex', gap: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '15px', borderRadius: '12px' }}>
                <span className="diag-icon" style={{ color: 'var(--accent-blue)', fontSize: '1.2rem' }}><i className="fa-solid fa-circle-info"></i></span>
                <div className="diag-body">
                  <h4 className="diag-title" style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '0.95rem' }}>Awaiting Input Data</h4>
                  <p className="diag-desc" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0' }}>
                    Please choose your Region, Soil Type, and Crop in the Farm Settings panel and click "Generate Irrigation Plan" to start analysis.
                  </p>
                </div>
              </li>
            ) : (
              <>
                <li className="diagnostic-item optimal" style={{ display: 'flex', gap: '12px', background: 'rgba(21, 128, 61, 0.05)', border: '1px solid rgba(21, 128, 61, 0.2)', padding: '15px', borderRadius: '12px' }}>
                  <span className="diag-icon" style={{ color: 'var(--accent-green)', fontSize: '1.2rem' }}><i className="fa-solid fa-circle-check"></i></span>
                  <div className="diag-body">
                    <h4 className="diag-title" style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '0.95rem' }}>Soil Moisture Levels</h4>
                    <p className="diag-desc" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0' }}>
                      Current soil type retention capacity ({soil ? soil.retention : 80}%) is ideal for {crop ? getText(crop.nameKey, lang) : 'crop'} root networks.
                    </p>
                  </div>
                </li>
                <li className="diagnostic-item optimal" style={{ display: 'flex', gap: '12px', background: 'rgba(21, 128, 61, 0.05)', border: '1px solid rgba(21, 128, 61, 0.2)', padding: '15px', borderRadius: '12px' }}>
                  <span className="diag-icon" style={{ color: 'var(--accent-green)', fontSize: '1.2rem' }}><i className="fa-solid fa-circle-check"></i></span>
                  <div className="diag-body">
                    <h4 className="diag-title" style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '0.95rem' }}>Thermal Suitability</h4>
                    <p className="diag-desc" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0' }}>
                      Average ambient temperature ({weather ? `${weather.temp}°C` : '22°C'}) matches {crop ? getText(crop.nameKey, lang) : 'crop'} growth requirements.
                    </p>
                  </div>
                </li>
                <li className="diagnostic-item warning" style={{ display: 'flex', gap: '12px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '15px', borderRadius: '12px' }}>
                  <span className="diag-icon" style={{ color: 'var(--accent-orange)', fontSize: '1.2rem' }}><i className="fa-solid fa-triangle-exclamation"></i></span>
                  <div className="diag-body">
                    <h4 className="diag-title" style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '0.95rem' }}>Upcoming Precipitation</h4>
                    <p className="diag-desc" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0' }}>
                      Rain probability is {weather ? weather.precipProb : 59}%. Reduce irrigation dosage to avoid root saturation.
                    </p>
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
}
