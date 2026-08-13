import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

function interpretWeatherCode(code) {
  let icon = "fa-solid fa-sun";
  let defaultDesc = "Clear Sky";
  let color = "#f59e0b";
  
  if (code === 0) {
    icon = "fa-solid fa-sun"; defaultDesc = "Clear Sky"; color = "#f59e0b";
  } else if (code >= 1 && code <= 3) {
    icon = "fa-solid fa-cloud-sun"; defaultDesc = "Partly Cloudy"; color = "#64748b";
  } else if (code === 45 || code === 48) {
    icon = "fa-solid fa-smog"; defaultDesc = "Foggy"; color = "#94a3b8";
  } else if (code >= 51 && code <= 55) {
    icon = "fa-solid fa-cloud-rain"; defaultDesc = "Light Drizzle"; color = "#60a5fa";
  } else if (code >= 61 && code <= 65) {
    icon = "fa-solid fa-cloud-showers-water"; defaultDesc = "Rainy"; color = "#3b82f6";
  } else if (code >= 71 && code <= 77) {
    icon = "fa-solid fa-snowflake"; defaultDesc = "Snowy"; color = "#93c5fd";
  } else if (code >= 80 && code <= 82) {
    icon = "fa-solid fa-cloud-showers-heavy"; defaultDesc = "Heavy Showers"; color = "#2563eb";
  } else if (code >= 95 && code <= 99) {
    icon = "fa-solid fa-cloud-bolt"; defaultDesc = "Thunderstorm"; color = "#7c3aed";
  }
  
  return { icon, defaultDesc, color };
}

export function WeatherTab() {
  const { location } = useApp();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location || !location.lat) {
      setError('कृपया पहले स्थान चुनें / Please select a location in Farm Settings first.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&timezone=auto`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.current) {
          setCurrentWeather({
            temp: data.current.temperature_2m,
            feelsLike: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            pressure: data.current.surface_pressure,
            code: data.current.weather_code
          });
        }
        if (data && data.daily) {
          const days = data.daily.time.map((timeStr, index) => {
            const dateObj = new Date(timeStr);
            return {
              dateStr: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
              code: data.daily.weather_code[index],
              tempMin: data.daily.temperature_2m_min[index],
              tempMax: data.daily.temperature_2m_max[index],
              precipProb: data.daily.precipitation_probability_max[index],
              precipSum: data.daily.precipitation_sum[index]
            };
          });
          setDailyForecast(days);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Weather tab fetch failed:', err);
        setError('मौसम डेटा नहीं मिला / Failed to fetch weather data. Please check your internet connection.');
        setLoading(false);
      });
  }, [location]);

  const currentInterpreted = currentWeather 
    ? interpretWeatherCode(currentWeather.code) 
    : { icon: "fa-solid fa-cloud-sun", defaultDesc: "Clear Sky", color: "#f59e0b" };

  /* ─── STYLES ─── */
  const containerStyle = {
    padding: '16px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
  };

  const currentCardStyle = {
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(10, 25, 16, 0.95) 100%)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '18px',
    padding: '24px',
    color: '#fff',
    marginBottom: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
  };

  const sensorGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '12px',
    marginTop: '20px',
  };

  const sensorCardStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '14px',
    textAlign: 'center',
    backdropFilter: 'blur(4px)',
  };

  const forecastCardStyle = {
    background: 'rgba(10, 25, 16, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
  };

  const dayRowStyle = (idx) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
    borderRadius: '10px',
    marginBottom: '6px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    flexWrap: 'wrap',
    gap: '8px',
    color: '#fff',
  });

  if (loading) {
    return (
      <div className="tab-panel active" style={{ padding: 0 }}>
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '40px', color: '#10b981' }}></i>
            <p style={{ marginTop: '16px', fontSize: '16px', color: '#cbd5e1' }}>
              मौसम डेटा लोड हो रहा है... / Loading weather data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-panel active" style={{ padding: 0 }}>
        <div style={containerStyle}>
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.3)',
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '36px', color: '#f87171' }}></i>
            <p style={{ marginTop: '12px', fontSize: '16px', color: '#f87171', fontWeight: 600 }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-panel active" style={{ padding: 0 }}>
      <div style={containerStyle}>

        {/* ─── CURRENT WEATHER HERO ─── */}
        <div style={currentCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '56px', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className={currentInterpreted.icon} style={{ color: currentInterpreted.color }}></i>
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1 }}>
                {currentWeather?.temp ?? '--'}°C
              </div>
              <div style={{ fontSize: '16px', color: '#cbd5e1', marginTop: '4px', fontWeight: 600 }}>
                {currentInterpreted.defaultDesc}
              </div>
              <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '4px' }}>
                <i className="fa-solid fa-location-dot" style={{ marginRight: '6px', color: '#10b981' }}></i>
                {location?.nameEn || 'Selected Region'}
              </div>
            </div>
          </div>

          {/* Sensor Metrics */}
          <div style={sensorGridStyle}>
            <div style={sensorCardStyle}>
              <div style={{ fontSize: '13px', color: '#cbd5e1' }}><i className="fa-solid fa-temperature-half" style={{ color: '#10b981', marginRight: '4px' }}></i> महसूस / Feels Like</div>
              <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '6px', color: '#fff' }}>{currentWeather?.feelsLike ?? '--'}°C</div>
            </div>
            <div style={sensorCardStyle}>
              <div style={{ fontSize: '13px', color: '#cbd5e1' }}><i className="fa-solid fa-droplet" style={{ color: '#38bdf8', marginRight: '4px' }}></i> नमी / Humidity</div>
              <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '6px', color: '#fff' }}>{currentWeather?.humidity ?? '--'}%</div>
            </div>
            <div style={sensorCardStyle}>
              <div style={{ fontSize: '13px', color: '#cbd5e1' }}><i className="fa-solid fa-wind" style={{ color: '#34d399', marginRight: '4px' }}></i> हवा / Wind</div>
              <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '6px', color: '#fff' }}>{currentWeather?.windSpeed ?? '--'} km/h</div>
            </div>
            <div style={sensorCardStyle}>
              <div style={{ fontSize: '13px', color: '#cbd5e1' }}><i className="fa-solid fa-gauge-simple-high" style={{ color: '#a78bfa', marginRight: '4px' }}></i> दबाव / Pressure</div>
              <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '6px', color: '#fff' }}>{currentWeather?.pressure ?? '--'} hPa</div>
            </div>
          </div>
        </div>

        {/* ─── 7-DAY FORECAST ─── */}
        <div style={forecastCardStyle}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-calendar-week" style={{ color: '#10b981' }}></i>
            <span>7 दिन का मौसम / 7-Day Forecast</span>
          </h3>

          {dailyForecast.length > 0 ? (
            dailyForecast.map((day, idx) => {
              const dayInterpreted = interpretWeatherCode(day.code);
              return (
                <div key={idx} style={dayRowStyle(idx)}>
                  <span style={{ fontWeight: 600, minWidth: '120px', color: '#fff', fontSize: '14px' }}>{day.dateStr}</span>
                  <div style={{ width: '30px', textAlign: 'center' }}>
                    <i className={dayInterpreted.icon} style={{ fontSize: '20px', color: dayInterpreted.color }}></i>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#e2e8f0', minWidth: '100px' }}>
                    {day.tempMin}°C / {day.tempMax}°C
                  </span>
                  <span style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 700, minWidth: '70px' }}>
                    <i className="fa-solid fa-droplet" style={{ marginRight: '4px' }}></i>{day.precipProb}%
                  </span>
                  <span style={{ fontSize: '13px', color: '#cbd5e1', flex: 1, textAlign: 'right' }}>
                    {dayInterpreted.defaultDesc} ({day.precipSum.toFixed(1)} mm)
                  </span>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
              कोई पूर्वानुमान डेटा उपलब्ध नहीं / No forecast data available.
            </p>
          )}
        </div>

        {/* ─── FARMING TIP ─── */}
        {currentWeather && (
          <div style={{
            marginTop: '16px', padding: '16px 20px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
          }}>
            <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fa-solid fa-seedling"></i>
              <span>🌾 खेती सुझाव / Farming Tip</span>
            </div>
            <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6 }}>
              {currentWeather.temp > 35
                ? '⚠️ तापमान बहुत अधिक है! सिंचाई सुबह 6-8 बजे करें, लू से फसल बचाएं। High temperature alert — irrigate early morning, protect crops from heat stress.'
                : currentWeather.humidity > 80
                  ? '💧 नमी ज़्यादा है — फफूंद रोग का खतरा, कीटनाशक छिड़काव करें। High humidity — risk of fungal diseases, consider preventive spray.'
                  : '✅ मौसम खेती के लिए अनुकूल है। Weather is favorable for farming operations.'}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
