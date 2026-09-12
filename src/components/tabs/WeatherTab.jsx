import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getWeatherData, interpretWeatherCode } from '../../services/weatherService';
import { geocodeLocation } from '../../services/locationService';

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

  // Fetch resilient multi-tier Weather data
  useEffect(() => {
    const targetLat = location?.lat || 23.6102;
    const targetLon = location?.lon || 85.2799;
    const targetName = location?.nameEn || 'Jharkhand (Hazaribagh), India';

    setLoading(true);
    setError(null);

    getWeatherData(targetLat, targetLon, targetName)
      .then(data => {
        if (data && data.current) {
          setCurrentWeather(data.current);
          setDailyForecast(data.daily || []);
        } else {
          setError('मौसम डेटा उपलब्ध नहीं है / Weather data unavailable.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Weather fetch error:', err);
        setError('मौसम डेटा नहीं मिला / Failed to fetch weather data.');
        setLoading(false);
      });
  }, [location]);

  // Search location via Open-Meteo Geocoding API with robust Indian internal fallback
  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchLoading(true);
    try {
      let matched = false;

      // Tier 1: Try Open-Meteo Geocoding
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchInput.trim())}&count=1&language=en&format=json`);
        if (geoRes.ok) {
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
            matched = true;
          }
        }
      } catch (geoErr) {
        console.warn('Open-Meteo geocoding search failed, trying fallback:', geoErr);
      }

      // Tier 2: Geocode fallback from internal Indian coordinates lookup
      if (!matched) {
        const fallbackGeo = geocodeLocation(searchInput.trim(), searchInput.trim());
        if (fallbackGeo && fallbackGeo.lat) {
          setLocation({
            id: searchInput.trim().toLowerCase().replace(/\s+/g, '-'),
            nameEn: fallbackGeo.nameEn,
            nameHi: fallbackGeo.nameHi,
            lat: fallbackGeo.lat,
            lon: fallbackGeo.lon,
            defaultSoil: 'loamy'
          });
          matched = true;
        }
      }

      if (!matched) {
        alert('Location not found. Please try entering a different city or region name.');
      }
    } catch (err) {
      console.warn('Location search error:', err);
      alert('Could not search location. Please check your query.');
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
