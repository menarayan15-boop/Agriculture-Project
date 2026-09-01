/**
 * Frontend Weather Client Application
 * Communicates safely with backend REST proxy /api/weather
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global Application State
  let currentUnit = 'C'; // 'C' or 'F'
  let rawWeatherData = null;

  // DOM Elements
  const searchForm = document.getElementById('search-form');
  const cityInput = document.getElementById('city-input');
  const geoBtn = document.getElementById('geo-btn');
  
  const statusBanner = document.getElementById('status-banner');
  const statusMessage = document.getElementById('status-message');
  const loader = document.getElementById('loader');
  const weatherContent = document.getElementById('weather-content');

  const cityNameEl = document.getElementById('city-name');
  const cacheTagEl = document.getElementById('cache-tag');
  const weatherIconEl = document.getElementById('weather-icon');
  const currentTempEl = document.getElementById('current-temp');
  const weatherDescEl = document.getElementById('weather-desc');
  const feelsLikeTempEl = document.getElementById('feels-like-temp');
  
  const humidityValEl = document.getElementById('humidity-val');
  const windValEl = document.getElementById('wind-val');
  const pressureValEl = document.getElementById('pressure-val');
  
  const forecastListEl = document.getElementById('forecast-list');

  const unitBtnC = document.getElementById('unit-c');
  const unitBtnF = document.getElementById('unit-f');

  // ---------------------------------------------------------------------------
  // Temperature Unit Conversion Helpers
  // ---------------------------------------------------------------------------
  function celsiusToFahrenheit(c) {
    return Math.round((c * 9/5 + 32) * 10) / 10;
  }

  function formatTemp(celsiusValue) {
    if (celsiusValue === undefined || celsiusValue === null) return '--';
    if (currentUnit === 'F') {
      return celsiusToFahrenheit(celsiusValue);
    }
    return Math.round(celsiusValue * 10) / 10;
  }

  // ---------------------------------------------------------------------------
  // UI State Control (Loading, Error, Display)
  // ---------------------------------------------------------------------------
  function showLoading() {
    loader.classList.remove('hidden');
    weatherContent.classList.add('hidden');
    statusBanner.classList.add('hidden');
  }

  function hideLoading() {
    loader.classList.add('hidden');
  }

  function showError(msg) {
    statusMessage.textContent = msg || 'Failed to load weather data. Please try again.';
    statusBanner.classList.remove('hidden');
    hideLoading();
  }

  function hideError() {
    statusBanner.classList.add('hidden');
  }

  // ---------------------------------------------------------------------------
  // Fetch Weather Data from Backend Proxy Endpoint /api/weather
  // ---------------------------------------------------------------------------
  async function fetchWeatherData(queryParams) {
    showLoading();
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const response = await fetch(`/api/weather?${queryString}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Server Error (${response.status})`);
      }

      rawWeatherData = data;
      renderWeatherUI();
      hideError();
      weatherContent.classList.remove('hidden');
    } catch (err) {
      console.error('Fetch weather error:', err);
      showError(err.message);
    } finally {
      hideLoading();
    }
  }

  // ---------------------------------------------------------------------------
  // Render Weather Dashboard UI & Forecast Cards
  // ---------------------------------------------------------------------------
  function renderWeatherUI() {
    if (!rawWeatherData) return;

    const { city, current, daily, cached } = rawWeatherData;

    // 1. Update Header & Cache Status
    cityNameEl.textContent = `${city.name}${city.country ? `, ${city.country}` : ''}`;
    if (cached) {
      cacheTagEl.classList.remove('hidden');
    } else {
      cacheTagEl.classList.add('hidden');
    }

    // 2. Update Current Weather Card
    weatherIconEl.src = `https://openweathermap.org/img/wn/${current.icon}@4x.png`;
    weatherIconEl.alt = current.description;
    currentTempEl.textContent = formatTemp(current.temp);
    weatherDescEl.textContent = current.description;
    feelsLikeTempEl.textContent = formatTemp(current.feelsLike);

    // Update Unit Symbols
    document.querySelectorAll('.temp-unit, .unit-symbol').forEach(el => {
      el.textContent = `°${currentUnit}`;
    });

    // 3. Update Metrics Grid
    humidityValEl.textContent = `${current.humidity}%`;
    windValEl.textContent = `${current.windSpeed} m/s`;
    pressureValEl.textContent = `${current.pressure} hPa`;

    // 4. Render 5-Day Forecast Preview Card List
    forecastListEl.innerHTML = '';
    daily.forEach(day => {
      const forecastItem = document.createElement('div');
      forecastItem.className = 'forecast-item';
      
      const minFormatted = formatTemp(day.tempMin);
      const maxFormatted = formatTemp(day.tempMax);
      const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;

      forecastItem.innerHTML = `
        <span class="fc-date">${day.dayName}</span>
        <img class="fc-icon" src="${iconUrl}" alt="${day.description}" />
        <span class="fc-temp">${minFormatted}° / ${maxFormatted}°${currentUnit}</span>
        <span class="fc-humidity"><i class="fa-solid fa-droplet"></i> ${day.humidity}%</span>
        <span class="fc-desc">${day.description}</span>
      `;

      forecastListEl.appendChild(forecastItem);
    });
  }

  // ---------------------------------------------------------------------------
  // Temperature Unit Toggle Handlers (°C / °F)
  // ---------------------------------------------------------------------------
  unitBtnC.addEventListener('click', () => {
    if (currentUnit === 'C') return;
    currentUnit = 'C';
    unitBtnC.classList.add('active');
    unitBtnF.classList.remove('active');
    renderWeatherUI();
  });

  unitBtnF.addEventListener('click', () => {
    if (currentUnit === 'F') return;
    currentUnit = 'F';
    unitBtnF.classList.add('active');
    unitBtnC.classList.remove('active');
    renderWeatherUI();
  });

  // ---------------------------------------------------------------------------
  // Search Form Handler
  // ---------------------------------------------------------------------------
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = cityInput.value.trim();
    if (!query) return;
    fetchWeatherData({ city: query });
  });

  // ---------------------------------------------------------------------------
  // Browser Geolocation Detection with Fallback to Default City ("London")
  // ---------------------------------------------------------------------------
  function initLocationDetection() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success: Use exact latitude and longitude
          const lat = position.coords.latitude.toFixed(4);
          const lon = position.coords.longitude.toFixed(4);
          fetchWeatherData({ lat, lon });
        },
        (error) => {
          console.warn('Geolocation denied or unavailable, falling back to default city (London):', error.message);
          fetchWeatherData({ city: 'London' });
        },
        { timeout: 8000 }
      );
    } else {
      console.warn('Geolocation not supported by browser, falling back to default city (London).');
      fetchWeatherData({ city: 'London' });
    }
  }

  // Handle Manual GPS Button Click
  geoBtn.addEventListener('click', () => {
    initLocationDetection();
  });

  // Initial Load: Trigger Automatic Geolocation Detection
  initLocationDetection();
});
