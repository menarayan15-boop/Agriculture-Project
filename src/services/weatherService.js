/**
 * Krishi Jal - Resilient Multi-Tier Weather Service
 * Tiers:
 * 1. Open-Meteo Real-time Weather API
 * 2. wttr.in Open JSON Fallback API
 * 3. Agro-Climatic Seasonal Weather Generator (for offline & rate-limited states)
 */

import { geocodeLocation, STATE_COORDINATES, DISTRICT_COORDINATES } from './locationService';

export function interpretWeatherCode(code) {
  let icon = "fa-solid fa-sun";
  let defaultDesc = "Clear Sky";
  let color = "#f59e0b";
  
  const numCode = parseInt(code, 10);
  
  if (numCode === 0) {
    icon = "fa-solid fa-sun"; defaultDesc = "Clear Sky"; color = "#f59e0b";
  } else if (numCode >= 1 && numCode <= 3) {
    icon = "fa-solid fa-cloud-sun"; defaultDesc = "Partly Cloudy"; color = "#64748b";
  } else if (numCode === 45 || numCode === 48) {
    icon = "fa-solid fa-smog"; defaultDesc = "Foggy"; color = "#94a3b8";
  } else if (numCode >= 51 && numCode <= 55) {
    icon = "fa-solid fa-cloud-rain"; defaultDesc = "Light Drizzle"; color = "#60a5fa";
  } else if (numCode >= 61 && numCode <= 65) {
    icon = "fa-solid fa-cloud-showers-water"; defaultDesc = "Rainy"; color = "#3b82f6";
  } else if (numCode >= 71 && numCode <= 77) {
    icon = "fa-solid fa-snowflake"; defaultDesc = "Snowy"; color = "#93c5fd";
  } else if (numCode >= 80 && numCode <= 82) {
    icon = "fa-solid fa-cloud-showers-heavy"; defaultDesc = "Heavy Showers"; color = "#2563eb";
  } else if (numCode >= 95 && numCode <= 99) {
    icon = "fa-solid fa-cloud-bolt"; defaultDesc = "Thunderstorm"; color = "#7c3aed";
  } else {
    icon = "fa-solid fa-cloud-sun"; defaultDesc = "Partly Cloudy"; color = "#64748b";
  }
  
  return { icon, defaultDesc, color };
}

// Convert wttr.in weather codes / condition text to Open-Meteo standard WMO codes
function mapWttrCodeToWmo(wttrCode, descText) {
  const code = parseInt(wttrCode, 10);
  const text = (descText || '').toLowerCase();

  if (code === 113 || text.includes('sunny') || text.includes('clear')) return 0;
  if (code === 116 || text.includes('partly cloudy')) return 2;
  if (code === 119 || code === 122 || text.includes('overcast') || text.includes('cloudy')) return 3;
  if (code === 143 || code === 248 || code === 260 || text.includes('fog') || text.includes('mist')) return 45;
  if (code === 263 || code === 266 || code === 293 || code === 296 || text.includes('drizzle')) return 51;
  if (code >= 299 && code <= 314 || text.includes('rain')) return 63;
  if (code >= 386 || text.includes('thunder')) return 95;
  if (code >= 323 && code <= 338 || text.includes('snow')) return 71;
  return 1;
}

/**
 * Generates an agro-climatic seasonal realistic weather profile
 * for any location in India based on latitude, month, and day.
 */
export function generateRealisticIndianWeather(lat = 23.5, lon = 85.0, locationName = 'India') {
  const date = new Date();
  const month = date.getMonth(); // 0 = Jan, 8 = Sep, etc.
  
  // Estimate base temperature based on latitude and month
  // Northern India (lat > 26): Hot summer (May-Jun 38-42C), Cold winter (Dec-Jan 8-20C)
  // Central/Eastern (lat 20-26): Summer (35-40C), Monsoon (26-32C), Winter (14-26C)
  // Southern/Coastal (lat < 20): Tropical year-round (26-34C)
  
  let baseMax = 30;
  let baseMin = 20;
  let defaultHumidity = 65;
  let defaultRainProb = 15;
  let defaultWeatherCode = 1; // Partly cloudy

  if (month >= 2 && month <= 4) {
    // Summer (Mar - May)
    baseMax = lat > 24 ? 38 : 35;
    baseMin = lat > 24 ? 24 : 25;
    defaultHumidity = 45;
    defaultRainProb = 10;
    defaultWeatherCode = 0; // Clear sunny
  } else if (month >= 5 && month <= 8) {
    // Monsoon (Jun - Sep)
    baseMax = 31;
    baseMin = 24;
    defaultHumidity = 82;
    defaultRainProb = 65;
    defaultWeatherCode = 61; // Rain / showers
  } else if (month >= 9 && month <= 10) {
    // Post-Monsoon / Autumn (Oct - Nov)
    baseMax = 29;
    baseMin = 18;
    defaultHumidity = 60;
    defaultRainProb = 15;
    defaultWeatherCode = 1;
  } else {
    // Winter (Dec - Feb)
    baseMax = lat > 26 ? 22 : (lat > 20 ? 26 : 30);
    baseMin = lat > 26 ? 9 : (lat > 20 ? 14 : 21);
    defaultHumidity = 55;
    defaultRainProb = 5;
    defaultWeatherCode = 0;
  }

  const currentTemp = Math.round((baseMin + (baseMax - baseMin) * 0.75));
  const feelsLike = currentTemp + (defaultHumidity > 70 ? 2 : -1);
  const windSpeed = Math.round(8 + (Math.sin(lat) * 4) + 2);
  const pressure = Math.round(1008 + (Math.cos(lon) * 5));

  // Generate 7-day forecast
  const daily = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < 7; i++) {
    const forecastDate = new Date();
    forecastDate.setDate(date.getDate() + i);
    
    // Slight pseudo-random natural day-to-day fluctuations
    const dayVariance = Math.round((Math.sin(i * 1.5 + lat) * 2));
    const dayMax = baseMax + dayVariance;
    const dayMin = baseMin + Math.round(dayVariance * 0.7);
    const rainChance = Math.max(0, Math.min(95, defaultRainProb + Math.round(Math.cos(i + lon) * 20)));
    const dayCode = rainChance > 50 ? 61 : (rainChance > 30 ? 2 : defaultWeatherCode);
    const rainAmount = dayCode >= 61 ? parseFloat((Math.max(1.2, rainChance * 0.15)).toFixed(1)) : 0;

    daily.push({
      dateStr: `${dayNames[forecastDate.getDay()]}, ${monthNames[forecastDate.getMonth()]} ${forecastDate.getDate()}`,
      code: dayCode,
      tempMin: dayMin,
      tempMax: dayMax,
      precipProb: rainChance,
      precipSum: rainAmount,
      snowSum: 0
    });
  }

  return {
    current: {
      temp: currentTemp,
      feelsLike: feelsLike,
      humidity: defaultHumidity,
      windSpeed: windSpeed,
      pressure: pressure,
      rain: defaultWeatherCode >= 61 ? 1.5 : 0,
      snowfall: 0,
      code: defaultWeatherCode
    },
    daily
  };
}

/**
 * Main multi-tier weather fetcher
 */
export async function getWeatherData(lat, lon, locationName = '') {
  const latitude = parseFloat(lat) || 23.6102;
  const longitude = parseFloat(lon) || 85.2799;

  // ── Tier 1: Try Open-Meteo Forecast API ──
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,rain,snowfall,surface_pressure,pressure_msl,weather_code&daily=weather_code,temperature_2m_min,temperature_2m_max,precipitation_probability_max,rain_sum,snowfall_sum&timezone=auto`;
    const res = await fetch(omUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && !data.error && data.current && data.daily && data.daily.time) {
        const days = data.daily.time.map((timeStr, index) => {
          const dateObj = new Date(timeStr);
          return {
            dateStr: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            code: data.daily.weather_code[index] ?? 1,
            tempMin: Math.round(data.daily.temperature_2m_min[index] ?? 20),
            tempMax: Math.round(data.daily.temperature_2m_max[index] ?? 30),
            precipProb: data.daily.precipitation_probability_max ? (data.daily.precipitation_probability_max[index] ?? 0) : 0,
            precipSum: data.daily.rain_sum ? (data.daily.rain_sum[index] ?? 0) : 0,
            snowSum: data.daily.snowfall_sum ? (data.daily.snowfall_sum[index] ?? 0) : 0
          };
        });

        return {
          source: 'open-meteo',
          current: {
            temp: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature ?? data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m ?? 60,
            windSpeed: Math.round(data.current.wind_speed_10m ?? 10),
            pressure: Math.round(data.current.surface_pressure || data.current.pressure_msl || 1012),
            rain: data.current.rain || 0,
            snowfall: data.current.snowfall || 0,
            code: data.current.weather_code ?? 0
          },
          daily: days
        };
      }
    }
  } catch (err) {
    console.warn('Open-Meteo primary API failed or timed out, trying Tier 2 fallback:', err.message);
  }

  // ── Tier 2: Try wttr.in Open JSON Fallback ──
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const wttrUrl = `https://wttr.in/${latitude},${longitude}?format=j1`;
    const res = await fetch(wttrUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.current_condition && data.current_condition[0]) {
        const cur = data.current_condition[0];
        const curCode = mapWttrCodeToWmo(cur.weatherCode, cur.weatherDesc?.[0]?.value);

        const days = (data.weather || []).map((w) => {
          const dateObj = new Date(w.date);
          const wCode = mapWttrCodeToWmo(w.hourly?.[4]?.weatherCode || w.hourly?.[0]?.weatherCode, w.hourly?.[4]?.weatherDesc?.[0]?.value);
          const maxPrecip = Math.max(...(w.hourly || []).map(h => parseFloat(h.chanceofrain) || 0));
          const totalPrecipMm = parseFloat(w.totalSnow_cm) > 0 ? 0 : (parseFloat(w.hourly?.[0]?.precipMM) || 0) * 2;

          return {
            dateStr: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            code: wCode,
            tempMin: parseInt(w.mintempC, 10) || 20,
            tempMax: parseInt(w.maxtempC, 10) || 30,
            precipProb: Math.round(maxPrecip),
            precipSum: totalPrecipMm,
            snowSum: parseFloat(w.totalSnow_cm) || 0
          };
        });

        // If wttr provides 3 days, extrapolate up to 7 days seamlessly
        while (days.length < 7) {
          const lastDay = days[days.length - 1];
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + days.length);
          days.push({
            dateStr: nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            code: lastDay ? lastDay.code : 1,
            tempMin: lastDay ? lastDay.tempMin : 21,
            tempMax: lastDay ? lastDay.tempMax : 31,
            precipProb: lastDay ? lastDay.precipProb : 15,
            precipSum: lastDay ? lastDay.precipSum : 0,
            snowSum: 0
          });
        }

        return {
          source: 'wttr',
          current: {
            temp: parseInt(cur.temp_C, 10) || 26,
            feelsLike: parseInt(cur.FeelsLikeC, 10) || parseInt(cur.temp_C, 10) || 26,
            humidity: parseInt(cur.humidity, 10) || 65,
            windSpeed: parseInt(cur.windspeedKmph, 10) || 12,
            pressure: parseInt(cur.pressure, 10) || 1012,
            rain: parseFloat(cur.precipMM) || 0,
            snowfall: 0,
            code: curCode
          },
          daily: days
        };
      }
    }
  } catch (err) {
    console.warn('wttr.in fallback failed or timed out, activating Tier 3 Agro-Climatic engine:', err.message);
  }

  // ── Tier 3: Agro-Climatic Seasonal Engine (Guaranteed 100% Reliable Offline & Active) ──
  const fallbackData = generateRealisticIndianWeather(latitude, longitude, locationName);
  return {
    source: 'agro-climate-engine',
    current: fallbackData.current,
    daily: fallbackData.daily
  };
}
