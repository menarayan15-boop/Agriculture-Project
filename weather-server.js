/**
 * Production-Ready Weather Backend Proxy
 * Stack: Node.js, Express, dotenv
 * Security: OpenWeatherMap API Key stored strictly in process.env.WEATHER_API_KEY
 * Performance: In-memory cache with 15-minute Time-To-Live (TTL)
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '9903153f7fdf8212e691e7aeda15df82';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// -----------------------------------------------------------------------------
// In-Memory Cache Implementation (15-Minute TTL)
// -----------------------------------------------------------------------------
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
const cache = new Map();

/**
 * Generates a unique cache key based on query parameters
 */
function getCacheKey(city, lat, lon) {
  if (city) return `city:${city.trim().toLowerCase()}`;
  if (lat && lon) return `geo:${parseFloat(lat).toFixed(2)},${parseFloat(lon).toFixed(2)}`;
  return null;
}

// Periodic cleanup of expired cache items
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of cache.entries()) {
    if (now - item.timestamp > CACHE_TTL_MS) {
      cache.delete(key);
    }
  }
}, 5 * 60 * 1000);

// -----------------------------------------------------------------------------
// Helper: Transform 3-Hour OpenWeather Data into Clean Daily Summaries
// -----------------------------------------------------------------------------
function formatWeatherPayload(data) {
  const list = data.list || [];
  if (list.length === 0) return null;

  // First 3-hour segment as current proxy
  const currentItem = list[0];
  const current = {
    temp: currentItem.main.temp,
    feelsLike: currentItem.main.feels_like,
    humidity: currentItem.main.humidity,
    pressure: currentItem.main.pressure,
    windSpeed: currentItem.wind.speed,
    description: currentItem.weather[0]?.description || 'Clear',
    icon: currentItem.weather[0]?.icon || '01d',
    main: currentItem.weather[0]?.main || 'Clear'
  };

  // Group 3-hour forecasts by date YYYY-MM-DD
  const daysMap = {};
  list.forEach(item => {
    const dateStr = item.dt_txt.split(' ')[0];
    if (!daysMap[dateStr]) {
      daysMap[dateStr] = {
        dateStr,
        dt: item.dt,
        temps: [],
        humidities: [],
        winds: [],
        descriptions: [],
        icons: [],
        middayItem: item
      };
    }
    daysMap[dateStr].temps.push(item.main.temp);
    daysMap[dateStr].humidities.push(item.main.humidity);
    daysMap[dateStr].winds.push(item.wind.speed);
    daysMap[dateStr].descriptions.push(item.weather[0]?.description);
    daysMap[dateStr].icons.push(item.weather[0]?.icon);

    // Prefer entries closest to 12:00 PM for daily representative icon & summary
    if (item.dt_txt.includes('12:00:00') || item.dt_txt.includes('15:00:00')) {
      daysMap[dateStr].middayItem = item;
    }
  });

  // Build 5-day forecast array
  const daily = Object.values(daysMap).slice(0, 5).map(day => {
    const minTemp = Math.min(...day.temps);
    const maxTemp = Math.max(...day.temps);
    const avgHumidity = Math.round(day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length);
    const representative = day.middayItem;

    const dateObj = new Date(day.dateStr);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return {
      date: day.dateStr,
      dayName,
      tempMin: Math.round(minTemp * 10) / 10,
      tempMax: Math.round(maxTemp * 10) / 10,
      humidity: avgHumidity,
      description: representative.weather[0]?.description || 'Clear',
      icon: representative.weather[0]?.icon || '01d',
      main: representative.weather[0]?.main || 'Clear'
    };
  });

  return {
    city: {
      name: data.city?.name || 'Unknown',
      country: data.city?.country || '',
      lat: data.city?.coord?.lat,
      lon: data.city?.coord?.lon
    },
    current,
    daily
  };
}

// -----------------------------------------------------------------------------
// REST Endpoint: /api/weather
// Accepts: ?city=London OR ?lat=51.50&lon=-0.12
// -----------------------------------------------------------------------------
app.get('/api/weather', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    // Validate Input Parameters
    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Please provide either a "city" query parameter or both "lat" and "lon" coordinates.'
      });
    }

    // Verify API Key availability
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'your_openweathermap_api_key_here') {
      return res.status(500).json({
        error: 'Configuration Error',
        message: 'OpenWeatherMap API Key is missing on the server. Please configure WEATHER_API_KEY in your .env file.'
      });
    }

    // Check In-Memory Cache
    const cacheKey = getCacheKey(city, lat, lon);
    const cachedItem = cache.get(cacheKey);

    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_TTL_MS)) {
      return res.json({
        ...cachedItem.payload,
        cached: true,
        cacheAgeSeconds: Math.floor((Date.now() - cachedItem.timestamp) / 1000)
      });
    }

    // Construct OpenWeatherMap API Request URL (5-day / 3-hour forecast API)
    let owmUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${WEATHER_API_KEY}`;
    if (city) {
      owmUrl += `&q=${encodeURIComponent(city)}`;
    } else {
      owmUrl += `&lat=${lat}&lon=${lon}`;
    }

    // Fetch data from upstream OpenWeather API
    const response = await fetch(owmUrl);
    const data = await response.json();

    // Handle Upstream Errors (e.g. Invalid City, Rate Limit, Invalid API Key)
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({
          error: 'City Not Found',
          message: `Could not find weather data for "${city || `${lat}, ${lon}`}". Please check the name and try again.`
        });
      }
      if (response.status === 401) {
        return res.status(500).json({
          error: 'Unauthorized API Key',
          message: 'The server OpenWeatherMap API Key is invalid or pending activation.'
        });
      }
      return res.status(response.status).json({
        error: 'Upstream Weather API Error',
        message: data.message || 'Failed to retrieve data from weather provider.'
      });
    }

    // Format Data Payload
    const formattedPayload = formatWeatherPayload(data);
    if (!formattedPayload) {
      return res.status(500).json({
        error: 'Data Processing Error',
        message: 'Invalid forecast payload structure received from weather provider.'
      });
    }

    // Store in Cache
    cache.set(cacheKey, {
      timestamp: Date.now(),
      payload: formattedPayload
    });

    // Return Clean JSON Response
    return res.json({
      ...formattedPayload,
      cached: false
    });

  } catch (error) {
    console.error('Error in /api/weather proxy:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while processing your request.'
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` 🌤️ Weather Proxy Server running on http://localhost:${PORT}`);
  console.log(` 🔑 API Key Status: ${WEATHER_API_KEY ? 'Configured ✓' : 'MISSING ⚠️'}`);
  console.log(`=======================================================`);
});
