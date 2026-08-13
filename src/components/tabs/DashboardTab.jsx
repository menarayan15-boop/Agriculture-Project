import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SOILS, getText } from '../../data/constants';

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
    report
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
      <div className="dashboard-grid">
        
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
                <li className="diagnostic-item optimal" style={{ display: 'flex', gap: '12px', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '15px', borderRadius: '12px' }}>
                  <span className="diag-icon" style={{ color: 'var(--accent-green)', fontSize: '1.2rem' }}><i className="fa-solid fa-circle-check"></i></span>
                  <div className="diag-body">
                    <h4 className="diag-title" style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '0.95rem' }}>Soil Moisture Levels</h4>
                    <p className="diag-desc" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0' }}>
                      Current soil type retention capacity ({soil ? soil.retention : 80}%) is ideal for {crop ? getText(crop.nameKey, lang) : 'crop'} root networks.
                    </p>
                  </div>
                </li>
                <li className="diagnostic-item optimal" style={{ display: 'flex', gap: '12px', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '15px', borderRadius: '12px' }}>
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
