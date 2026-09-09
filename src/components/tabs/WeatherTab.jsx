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
  const { location, setLocation } = useApp();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Sync search input with location name
  useEffect(() => {
    if (location && location.nameEn) {
      setSearchInput(location.nameEn);
    }
  }, [location]);

  // Fetch Open-Meteo Weather API for current location coordinates
  useEffect(() => {
    if (!location || !location.lat) {
      setError('कृपया पहले स्थान चुनें / Please select a location.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    // Open-Meteo forecast endpoint with full variables
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,rain,snowfall,surface_pressure,pressure_msl,weather_code&hourly=temperature_2m,relative_humidity_2m,rain,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_min,temperature_2m_max,sunshine_duration,sunset,sunrise,rain_sum,snowfall_sum,precipitation_probability_max&timezone=auto`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.current) {
          setCurrentWeather({
            temp: data.current.temperature_2m,
            feelsLike: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            pressure: data.current.surface_pressure || data.current.pressure_msl,
            rain: data.current.rain || 0,
            snowfall: data.current.snowfall || 0,
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
              precipSum: data.daily.rain_sum ? data.daily.rain_sum[index] : 0,
              snowSum: data.daily.snowfall_sum ? data.daily.snowfall_sum[index] : 0
            };
          });
          setDailyForecast(days);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Open-Meteo fetch failed:', err);
        setError('मौसम डेटा नहीं मिला / Failed to fetch Open-Meteo weather data.');
        setLoading(false);
      });
  }, [location]);

  // Search location via Open-Meteo Geocoding API
  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchLoading(true);
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchInput.trim())}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();
      if (geoData && geoData.results && geoData.results.length > 0) {
        const res = geoData.results[0];
        const formattedName = `${res.admin1 || res.name}${res.name !== res.admin1 ? ' (' + res.name + ')' : ''}, ${res.country || 'India'}`;
        setLocation({
          id: res.name.toLowerCase().replace(/\s+/g, '-'),
          nameEn: formattedName,
          nameHi: formattedName,
          lat: res.latitude,
          lon: res.longitude,
          defaultSoil: 'loamy'
        });
      } else {
        alert('Location not found. Please try entering a different city or region name.');
      }
    } catch (err) {
      console.warn('Geocoding search failed:', err);
      alert('Could not search location. Please check your internet connection.');
    } finally {
      setSearchLoading(false);
    }
  };

  const currentInterpreted = currentWeather 
    ? interpretWeatherCode(currentWeather.code) 
    : { icon: "fa-solid fa-cloud-sun", defaultDesc: "Clear Sky", color: "#f59e0b" };

  /* ─── STYLES ─── */
  const containerStyle = {
    padding: '16px',
    maxWidth: '960px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif",
  };

  const currentCardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '16px',
    padding: '24px',
    color: '#17211B',
    marginBottom: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
  };

  const sensorGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '12px',
    marginTop: '20px',
  };

  const sensorCardStyle = {
    background: '#F8FAF9',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '14px',
    textAlign: 'center',
  };

  const forecastCardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
  };

  const dayRowStyle = (idx) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: idx % 2 === 0 ? '#F8FAF9' : 'transparent',
    borderRadius: '10px',
    marginBottom: '6px',
    border: '1px solid #E5E7EB',
    flexWrap: 'wrap',
    gap: '8px',
    color: '#17211B',
  });

  return (
    <div className="tab-panel active" style={{ padding: 0 }}>
      <div style={containerStyle}>

        {/* ─── LOCATION SEARCH BAR ─── */}
        <form onSubmit={handleSearchLocation} style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '16px',
          background: '#FFFFFF',
          padding: '8px 12px',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', color: '#15803D', paddingLeft: '8px' }}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search location (e.g. Bilaspur, Shimla, Nashik, Ludhiana)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#17211B',
              fontSize: '0.95rem',
              outline: 'none',
              padding: '6px 0'
            }}
          />
          <button
            type="submit"
            disabled={searchLoading}
            style={{
              background: '#15803D',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              padding: '8px 16px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {searchLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-location-dot"></i>}
            <span>Search</span>
          </button>
        </form>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '40px', color: '#15803D' }}></i>
            <p style={{ marginTop: '16px', fontSize: '16px', color: '#6B7280' }}>
              Open-Meteo मौसम डेटा लोड हो रहा है... / Fetching Open-Meteo weather data...
            </p>
          </div>
        ) : error ? (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            background: '#FEF2F2', borderRadius: '16px', border: '1px solid #FCA5A5',
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '36px', color: '#DC2626' }}></i>
            <p style={{ marginTop: '12px', fontSize: '16px', color: '#DC2626', fontWeight: 600 }}>{error}</p>
          </div>
        ) : (
          <>
            {/* ─── CURRENT WEATHER HERO ─── */}
            <div style={currentCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '56px', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className={currentInterpreted.icon} style={{ color: currentInterpreted.color }}></i>
                </div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <div style={{ fontSize: '48px', fontWeight: 800, lineHeight: 1, color: '#17211B' }}>
                    {currentWeather?.temp ?? '--'}°C
                  </div>
                  <div style={{ fontSize: '16px', color: '#4B5563', marginTop: '4px', fontWeight: 600 }}>
                    {currentInterpreted.defaultDesc}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>
                    <i className="fa-solid fa-location-dot" style={{ marginRight: '6px', color: '#15803D' }}></i>
                    {location?.nameEn || 'Selected Location'}
                  </div>
                </div>
              </div>

              {/* Sensor Metrics */}
              <div style={sensorGridStyle}>
                <div style={sensorCardStyle}>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}><i className="fa-solid fa-temperature-half" style={{ color: '#15803D', marginRight: '4px' }}></i> महसूस / Feels Like</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '6px', color: '#17211B' }}>{currentWeather?.feelsLike ?? '--'}°C</div>
                </div>
                <div style={sensorCardStyle}>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}><i className="fa-solid fa-droplet" style={{ color: '#2563EB', marginRight: '4px' }}></i> नमी / Humidity</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '6px', color: '#17211B' }}>{currentWeather?.humidity ?? '--'}%</div>
                </div>
                <div style={sensorCardStyle}>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}><i className="fa-solid fa-wind" style={{ color: '#059669', marginRight: '4px' }}></i> हवा / Wind</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '6px', color: '#17211B' }}>{currentWeather?.windSpeed ?? '--'} km/h</div>
                </div>
                <div style={sensorCardStyle}>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}><i className="fa-solid fa-gauge-simple-high" style={{ color: '#7C3AED', marginRight: '4px' }}></i> दबाव / Pressure</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '6px', color: '#17211B' }}>{currentWeather?.pressure ?? '--'} hPa</div>
                </div>
              </div>
            </div>

            {/* ─── 7-DAY FORECAST ─── */}
            <div style={forecastCardStyle}>
              <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', fontWeight: 700, color: '#17211B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-calendar-week" style={{ color: '#15803D' }}></i>
                <span>7 दिन का मौसम / 7-Day Forecast</span>
              </h3>

              {dailyForecast.length > 0 ? (
                dailyForecast.map((day, idx) => {
                  const dayInterpreted = interpretWeatherCode(day.code);
                  return (
                    <div key={idx} style={dayRowStyle(idx)}>
                      <span style={{ fontWeight: 600, minWidth: '120px', color: '#17211B', fontSize: '14px' }}>{day.dateStr}</span>
                      <div style={{ width: '30px', textAlign: 'center' }}>
                        <i className={dayInterpreted.icon} style={{ fontSize: '20px', color: dayInterpreted.color }}></i>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#15803D', minWidth: '100px' }}>
                        {day.tempMin}°C / {day.tempMax}°C
                      </span>
                      <span style={{ fontSize: '13px', color: '#4B5563', flex: 1, textAlign: 'right' }}>
                        {dayInterpreted.defaultDesc} ({day.precipSum > 0 ? `${day.precipSum.toFixed(1)} mm` : day.snowSum > 0 ? `${day.snowSum.toFixed(1)} cm` : '0 mm'})
                      </span>
                    </div>
                  );
                })
              ) : (
                <p style={{ textAlign: 'center', color: '#6B7280', padding: '20px' }}>
                  कोई पूर्वानुमान डेटा उपलब्ध नहीं / No forecast data available.
                </p>
              )}
            </div>

            {/* ─── FARMING TIP ─── */}
            {currentWeather && (
              <div style={{
                marginTop: '16px', padding: '16px 20px',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '14px',
              }}>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px', color: '#15803D', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fa-solid fa-seedling"></i>
                  <span>🌾 खेती सुझाव / Farming Tip</span>
                </div>
                <div style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>
                  {currentWeather.temp > 35
                    ? '⚠️ तापमान बहुत अधिक है! सिंचाई सुबह 6-8 बजे करें, लू से फसल बचाएं। High temperature alert — irrigate early morning, protect crops from heat stress.'
                    : currentWeather.humidity > 80
                      ? '💧 नमी ज़्यादा है — फफूंद रोग का खतरा, कीटनाशक छिड़काव करें। High humidity — risk of fungal diseases, consider preventive spray.'
                      : '✅ मौसम खेती के लिए अनुकूल है। Weather is favorable for farming operations.'}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
