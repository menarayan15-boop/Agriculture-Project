import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SOILS, getText, getCropDisplayName } from '../../data/constants';
import { CropRoadmapCard } from '../CropRoadmapCard';
import { getWeatherData, interpretWeatherCode } from '../../services/weatherService';

export function DashboardTab() {
  const {
    location,
    soil,
    crop,
    area,
    sowingDate,
    lang,
    report,
    farmerInsights
  } = useApp();

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Fetch resilient weather based on selected location coordinates
  useEffect(() => {
    const targetLat = location?.lat || 23.6102;
    const targetLon = location?.lon || 85.2799;
    const targetName = location?.nameEn || 'Jharkhand (Hazaribagh), India';
    
    setWeatherLoading(true);
    getWeatherData(targetLat, targetLon, targetName)
      .then(data => {
        if (data && data.current) {
          const cur = data.current;
          const firstDaily = data.daily && data.daily.length > 0 ? data.daily[0] : null;
          setWeather({
            temp: cur.temp,
            humidity: cur.humidity,
            precipProb: firstDaily ? firstDaily.precipProb : (cur.rain > 0 ? 80 : 15),
            windSpeed: cur.windSpeed,
            code: cur.code,
            uv: cur.code >= 61 ? 1.2 : (cur.code >= 1 ? 4.0 : 6.5)
          });
        }
        setWeatherLoading(false);
      })
      .catch(err => {
        console.warn('Dashboard weather fetch failed:', err);
        setWeatherLoading(false);
      });
  }, [location]);

  // Circumference of stroke-dasharray = 251.2
  const score = report ? report.suitabilityScore : 0;
  const strokeDashoffset = report ? 251.2 - (251.2 * score) / 100 : 251.2;

  const weatherInterpreted = weather ? interpretWeatherCode(weather.code) : { icon: "fa-solid fa-sun", defaultDesc: "Clear Sky" };
  const cropDisplayName = crop ? getCropDisplayName(crop, lang) : '';
  const soilDisplayName = soil ? (getText(soil.nameKey, lang) || soil.name) : '--';
  const soilDescName = soil ? (getText(soil.descKey, lang) || soil.desc) : (getText('dash-select-location', lang) || 'Select location to check soil retention capacity.');

  return (
    <div className="tab-panel active">
      <div className="dashboard-grid">
        
        {/* AI Farmer Profile Card */}
        {farmerInsights && farmerInsights.profile && (
          <div className="dash-card span-all" style={{
            background: '#FFFFFF',
            borderTop: '4px solid #15803D',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
              {/* Left: Profile Info */}
              <div style={{ flex: '1', minWidth: '250px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{farmerInsights.profile.icon}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#17211B' }}>
                      {farmerInsights.profile.label}
                    </h3>
                    <span style={{
                      display: 'inline-block',
                      marginTop: '4px',
                      padding: '2px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: '#DCFCE7',
                      color: '#15803D',
                      border: '1px solid #86EFAC'
                    }}>
                      {farmerInsights.profile.confidence}% {getText('confidence', lang) || 'Confidence'}
                    </span>
                  </div>
                </div>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.5' }}>
                  {farmerInsights.profile.description}
                </p>

                {/* Health Score */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: '12px',
                  background: '#F8FAF9',
                  border: '1px solid #E5E7EB'
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: `conic-gradient(${farmerInsights.healthScore > 70 ? '#15803D' : farmerInsights.healthScore > 40 ? '#F59E0B' : '#EF4444'} ${farmerInsights.healthScore * 3.6}deg, #E5E7EB 0deg)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: '#FFFFFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: 800, color: '#17211B'
                    }}>
                      {farmerInsights.healthScore}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#17211B' }}>
                      {getText('farm-health-score', lang) || 'Farm Health Score'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      {getText('based-on-risk', lang) || 'Based on risk analysis'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle: Risks */}
              <div style={{ flex: '1', minWidth: '220px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 700, color: '#17211B' }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px', color: '#D97706' }}></i>
                  {getText('risk-assessment', lang) || 'Risk Assessment'}
                </h4>
                {farmerInsights.risks.length === 0 ? (
                  <div style={{ padding: '12px', borderRadius: '12px', background: '#F0FDF4', border: '1px solid #86EFAC', color: '#15803D', fontSize: '0.85rem', fontWeight: 600 }}>
                    <i className="fa-solid fa-shield-check" style={{ marginRight: '6px' }}></i>
                    {getText('no-risks', lang) || 'No significant risks detected'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {farmerInsights.risks.map((risk, i) => (
                      <div key={i} style={{
                        padding: '10px 14px', borderRadius: '10px',
                        background: risk.severity === 'high' ? '#FEF2F2' : '#FFFBEB',
                        border: `1px solid ${risk.severity === 'high' ? '#FECACA' : '#FDE68A'}`,
                        fontSize: '0.82rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span>{risk.icon}</span>
                          <span style={{ fontWeight: 700, color: '#17211B' }}>
                            {risk.label}
                          </span>
                          <span style={{
                            marginLeft: 'auto',
                            padding: '1px 8px', borderRadius: '10px',
                            fontSize: '0.7rem', fontWeight: 800,
                            background: risk.severity === 'high' ? '#FEE2E2' : '#FEF3C7',
                            color: risk.severity === 'high' ? '#DC2626' : '#B45309'
                          }}>
                            {risk.score}%
                          </span>
                        </div>
                        <div style={{ color: '#4B5563', fontSize: '0.78rem' }}>
                          {risk.tip}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Tips */}
              <div style={{ flex: '1', minWidth: '220px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 700, color: '#17211B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-lightbulb" style={{ color: '#15803D' }}></i>
                  {getText('personalized-tips', lang) || 'Personalized Tips'}
                  {farmerInsights.isExplicitlyPersonalized && (
                    <span style={{
                      background: '#15803D', color: '#fff', 
                      fontSize: '0.65rem', padding: '2px 8px', borderRadius: '12px', marginLeft: 'auto',
                      fontWeight: 700
                    }}>
                      <i className="fa-solid fa-wand-magic-sparkles" style={{marginRight: '4px'}}></i>
                      {getText('for-you', lang) || 'For You'}
                    </span>
                  )}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {farmerInsights.tips.map((tip, i) => (
                    <div key={i} style={{
                      padding: '10px 14px', borderRadius: '10px',
                      background: '#F8FAF9',
                      border: '1px solid #E5E7EB',
                      fontSize: '0.82rem', color: '#374151',
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
          <h3 className="card-title">{getText('dash-suitability-title', lang) || getText('tab-dashboard', lang) || 'Growth Suitability Score'}</h3>
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
              <span className="gauge-label">{getText('confidence', lang) || 'Suitability'}</span>
            </div>
          </div>
          <div className={`suitability-alert ${report ? 'optimal' : ''}`}>
            <i className={`fa-solid ${report ? 'fa-circle-check' : 'fa-circle-question'}`}></i>
            <span>{report ? report.verdict : (getText('sidebar-subtitle', lang) || 'Submit configuration to analyze')}</span>
          </div>
        </div>

        {/* Soil Retention & Properties Card */}
        <div className="dash-card">
          <h3 className="card-title">{getText('edu-soil-catalog-title', lang) || getText('planner-soil', lang) || 'Soil Retention & Properties'}</h3>
          <div className="soil-profile-box">
            <div className="soil-graphic" style={{ background: soil ? soil.color : '#594331', borderRadius: '8px', minWidth: '40px', minHeight: '40px', position: 'relative' }}>
              <div className="soil-particle sand" style={{ position: 'absolute', width: '4px', height: '4px', background: 'rgba(244, 208, 63, 0.4)' }}></div>
              <div className="soil-particle clay" style={{ position: 'absolute', width: '4px', height: '4px', background: 'rgba(255,255,255,0.2)' }}></div>
            </div>
            <div className="soil-profile-details">
              <h4 className="soil-name-heading" style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0', color: '#17211B' }}>
                {soilDisplayName}
              </h4>
              <p className="soil-desc" style={{ fontSize: '0.8rem', color: '#4B5563', margin: '4px 0 0 0' }}>
                {soilDescName}
              </p>
            </div>
          </div>
          <div className="soil-bars" style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="bar-group">
              <span className="bar-label" style={{ fontSize: '0.75rem', color: '#4B5563', fontWeight: 600 }}>{getText('edu-water-retention', lang) || 'Water Retention'}</span>
              <div className="progress-track" style={{ background: '#E5E7EB', borderRadius: '10px', height: '8px', marginTop: '4px', overflow: 'hidden' }}>
                <div 
                  className="progress-bar" 
                  style={{ width: soil ? `${soil.retention}%` : '0%', background: '#15803D', height: '100%' }}
                ></div>
              </div>
            </div>
            <div className="bar-group">
              <span className="bar-label" style={{ fontSize: '0.75rem', color: '#4B5563', fontWeight: 600 }}>{getText('edu-drainage-rate', lang) || 'Drainage Speed'}</span>
              <div className="progress-track" style={{ background: '#E5E7EB', borderRadius: '10px', height: '8px', marginTop: '4px', overflow: 'hidden' }}>
                <div 
                  className="progress-bar progress-orange" 
                  style={{ width: soil ? `${soil.drainage}%` : '0%', background: '#F59E0B', height: '100%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Suitability Diagnostics Card */}
        <div className="dash-card span-all">
          <h3 className="card-title">{getText('risk-assessment', lang) || 'Growth Suitability Diagnostics'}</h3>
          <ul className="diagnostic-list" style={{ listStyle: 'none', padding: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!report ? (
              <li className="diagnostic-item info" style={{ display: 'flex', gap: '12px', background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '16px', borderRadius: '12px' }}>
                <span className="diag-icon" style={{ color: '#0284C7', fontSize: '1.2rem' }}><i className="fa-solid fa-circle-info"></i></span>
                <div className="diag-body">
                  <h4 className="diag-title" style={{ fontWeight: 800, margin: '0 0 4px 0', fontSize: '0.95rem', color: '#0369A1' }}>{getText('sidebar-title', lang) || 'Farm Settings'}</h4>
                  <p className="diag-desc" style={{ fontSize: '0.85rem', color: '#0C4A6E', margin: '0' }}>
                    {getText('sidebar-subtitle', lang) || 'Please configure your farm parameters in the sidebar to generate recommendations.'}
                  </p>
                </div>
              </li>
            ) : (
              <>
                <li className="diagnostic-item optimal" style={{ display: 'flex', gap: '12px', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '16px', borderRadius: '12px' }}>
                  <span className="diag-icon" style={{ color: '#15803D', fontSize: '1.2rem' }}><i className="fa-solid fa-circle-check"></i></span>
                  <div className="diag-body">
                    <h4 className="diag-title" style={{ fontWeight: 800, margin: '0 0 4px 0', fontSize: '0.95rem', color: '#166534' }}>{getText('edu-water-retention', lang) || 'Soil Moisture Levels'}</h4>
                    <p className="diag-desc" style={{ fontSize: '0.85rem', color: '#14532D', margin: '0' }}>
                      {soilDisplayName} ({soil ? soil.retention : 80}%) — {cropDisplayName || 'Crop'}
                    </p>
                  </div>
                </li>
                <li className="diagnostic-item optimal" style={{ display: 'flex', gap: '12px', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '16px', borderRadius: '12px' }}>
                  <span className="diag-icon" style={{ color: '#15803D', fontSize: '1.2rem' }}><i className="fa-solid fa-circle-check"></i></span>
                  <div className="diag-body">
                    <h4 className="diag-title" style={{ fontWeight: 800, margin: '0 0 4px 0', fontSize: '0.95rem', color: '#166534' }}>{getText('edu-param-temp', lang) || 'Thermal Suitability'}</h4>
                    <p className="diag-desc" style={{ fontSize: '0.85rem', color: '#14532D', margin: '0' }}>
                      {weather ? `${weather.temp}°C` : '22°C'} — {cropDisplayName || 'Crop'}
                    </p>
                  </div>
                </li>
                <li className="diagnostic-item warning" style={{ display: 'flex', gap: '12px', background: '#FFFBEB', border: '1px solid #FDE68A', padding: '16px', borderRadius: '12px' }}>
                  <span className="diag-icon" style={{ color: '#D97706', fontSize: '1.2rem' }}><i className="fa-solid fa-triangle-exclamation"></i></span>
                  <div className="diag-body">
                    <h4 className="diag-title" style={{ fontWeight: 800, margin: '0 0 4px 0', fontSize: '0.95rem', color: '#B45309' }}>{getText('tab-weather', lang) || 'Upcoming Precipitation'}</h4>
                    <p className="diag-desc" style={{ fontSize: '0.85rem', color: '#78350F', margin: '0' }}>
                      {weather ? `${weather.precipProb}%` : '59%'} {getText('edu-water-req', lang) || 'Rain probability'}
                    </p>
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* ─── Step-by-Step Irrigation & Crop Care Roadmap ─── */}
        <CropRoadmapCard 
          report={report} 
          crop={crop} 
          location={location} 
          area={area} 
          soil={soil} 
          lang={lang} 
          sowingDate={sowingDate}
        />

      </div>
    </div>
  );
}

export default DashboardTab;
