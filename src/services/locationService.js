// Krishi Jal - Comprehensive Geocoding & Location Service
// Provides real-time Open-Meteo geocoding lookup & offline fallback coordinates for all Indian States/UTs & Districts.

export const STATE_COORDINATES = {
  "andaman & nicobar islands (ut)": { lat: 11.6234, lon: 92.7265 },
  "andhra pradesh": { lat: 15.9129, lon: 79.7400 },
  "arunachal pradesh": { lat: 28.2180, lon: 94.7278 },
  "assam": { lat: 26.2006, lon: 92.9376 },
  "bihar": { lat: 25.0961, lon: 85.3131 },
  "chandigarh (ut)": { lat: 30.7333, lon: 76.7794 },
  "chhattisgarh": { lat: 21.2787, lon: 81.8661 },
  "dadra & nagar haveli and daman & diu (ut)": { lat: 20.4283, lon: 72.8397 },
  "delhi (nct ut)": { lat: 28.6139, lon: 77.2090 },
  "goa": { lat: 15.2993, lon: 74.1240 },
  "gujarat": { lat: 22.2587, lon: 71.1924 },
  "haryana": { lat: 29.0588, lon: 76.0856 },
  "himachal pradesh": { lat: 31.1048, lon: 77.1734 },
  "jammu & kashmir (ut)": { lat: 33.7782, lon: 76.5762 },
  "jharkhand": { lat: 23.6102, lon: 85.2799 },
  "karnataka": { lat: 15.3173, lon: 75.7139 },
  "kerala": { lat: 10.8505, lon: 76.2711 },
  "ladakh (ut)": { lat: 34.1526, lon: 77.5771 },
  "lakshadweep (ut)": { lat: 10.5667, lon: 72.6417 },
  "madhya pradesh": { lat: 22.9734, lon: 78.6569 },
  "maharashtra": { lat: 19.7515, lon: 75.7139 },
  "manipur": { lat: 24.6637, lon: 93.9063 },
  "meghalaya": { lat: 25.4670, lon: 91.3662 },
  "mizoram": { lat: 23.1645, lon: 92.9376 },
  "nagaland": { lat: 26.1584, lon: 94.5624 },
  "odisha": { lat: 20.9517, lon: 85.0985 },
  "puducherry (ut)": { lat: 11.9416, lon: 79.8083 },
  "punjab": { lat: 31.1471, lon: 75.3412 },
  "rajasthan": { lat: 27.0238, lon: 74.2179 },
  "sikkim": { lat: 27.5330, lon: 88.5122 },
  "tamil nadu": { lat: 11.1271, lon: 78.6569 },
  "telangana": { lat: 18.1124, lon: 79.0193 },
  "tripura": { lat: 23.9408, lon: 91.9882 },
  "uttar pradesh": { lat: 26.8467, lon: 80.9462 },
  "uttarakhand": { lat: 30.0668, lon: 79.0193 },
  "west bengal": { lat: 22.9868, lon: 87.8550 }
};

// District override fallbacks for high precision even offline
export const DISTRICT_COORDINATES = {
  // Himachal Pradesh
  "bilaspur, himachal pradesh": { lat: 31.3303, lon: 76.7566 },
  "chamba, himachal pradesh": { lat: 32.5534, lon: 76.1258 },
  "hamirpur, himachal pradesh": { lat: 31.6862, lon: 76.5213 },
  "kangra, himachal pradesh": { lat: 32.0998, lon: 76.2691 },
  "kinnaur, himachal pradesh": { lat: 31.6510, lon: 78.4752 },
  "kullu, himachal pradesh": { lat: 31.9579, lon: 77.1095 },
  "lahaul and spiti, himachal pradesh": { lat: 32.5710, lon: 77.1700 },
  "mandi, himachal pradesh": { lat: 31.7087, lon: 76.9320 },
  "shimla, himachal pradesh": { lat: 31.1048, lon: 77.1734 },
  "sirmaur, himachal pradesh": { lat: 30.6022, lon: 77.2955 },
  "solan, himachal pradesh": { lat: 30.9045, lon: 77.0967 },
  "una, himachal pradesh": { lat: 31.4685, lon: 76.2708 },

  // Punjab
  "ludhiana, punjab": { lat: 30.9010, lon: 75.8573 },
  "amritsar, punjab": { lat: 31.6340, lon: 74.8723 },
  "jalandhar, punjab": { lat: 31.3260, lon: 75.5762 },
  "patiala, punjab": { lat: 30.3398, lon: 76.3869 },
  "bathinda, punjab": { lat: 30.2110, lon: 74.9455 },

  // Haryana
  "karnal, haryana": { lat: 29.6857, lon: 76.9905 },
  "hisar, haryana": { lat: 29.1492, lon: 75.7217 },
  "ambala, haryana": { lat: 30.3782, lon: 76.7767 },
  "gurugram, haryana": { lat: 28.4595, lon: 77.0266 },
  "sirsa, haryana": { lat: 29.5349, lon: 75.0296 },

  // Maharashtra
  "nashik, maharashtra": { lat: 19.9975, lon: 73.7898 },
  "pune, maharashtra": { lat: 18.5204, lon: 73.8567 },
  "nagpur, maharashtra": { lat: 21.1458, lon: 79.0882 },
  "latur, maharashtra": { lat: 18.4088, lon: 76.5604 },
  "chhatrapati sambhajinagar, maharashtra": { lat: 19.8762, lon: 75.3433 },

  // UP
  "kanpur, uttar pradesh": { lat: 26.4499, lon: 80.3319 },
  "lucknow, uttar pradesh": { lat: 26.8467, lon: 80.9462 },
  "varanasi, uttar pradesh": { lat: 25.3176, lon: 82.9739 },
  "agra, uttar pradesh": { lat: 27.1767, lon: 78.0081 },
  "meerut, uttar pradesh": { lat: 28.9845, lon: 77.7064 },

  // Rajasthan
  "sri ganganagar, rajasthan": { lat: 29.9254, lon: 73.8789 },
  "jaipur, rajasthan": { lat: 26.9124, lon: 75.7873 },
  "jodhpur, rajasthan": { lat: 26.2389, lon: 73.0243 },
  "kota, rajasthan": { lat: 25.2138, lon: 75.8648 },

  // MP
  "indore, madhya pradesh": { lat: 22.7196, lon: 75.8577 },
  "bhopal, madhya pradesh": { lat: 23.2599, lon: 77.4126 },
  "gwalior, madhya pradesh": { lat: 26.2183, lon: 78.1828 },
  "jabalpur, madhya pradesh": { lat: 23.1815, lon: 79.9864 }
};

/**
 * Dynamically resolves a location query (e.g. "Bilaspur, Himachal Pradesh")
 * using Open-Meteo Geocoding API, with immediate fallback to local database.
 */
export async function geocodeLocation(district, state) {
  const cleanState = (state || '').trim();
  const cleanDistrict = (district || '').trim();
  const searchTarget = [cleanDistrict, cleanState].filter(Boolean).join(', ') || cleanState || cleanDistrict || 'India';
  const lookupKey = `${cleanDistrict.toLowerCase()}, ${cleanState.toLowerCase()}`;

  // 1. Try Open-Meteo Dynamic Geocoding API first for exact location & coordinates
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTarget)}&count=5&language=en&format=json`);
    const data = await res.json();
    if (data && data.results && data.results.length > 0) {
      const match = data.results.find(r => r.country_code === 'IN') || data.results[0];
      const nameStr = `${match.name}${match.admin1 ? ', ' + match.admin1 : ''}, ${match.country || 'India'}`;
      return {
        lat: parseFloat(match.latitude.toFixed(4)),
        lon: parseFloat(match.longitude.toFixed(4)),
        nameEn: nameStr,
        nameHi: nameStr,
        resolvedName: match.name,
        country: match.country || 'India',
        admin1: match.admin1 || cleanState
      };
    }
  } catch (err) {
    console.warn('Geocoding API network issue, using fallback lookup:', err);
  }

  // 2. Try Exact District Offline Lookup
  if (lookupKey && DISTRICT_COORDINATES[lookupKey]) {
    const coords = DISTRICT_COORDINATES[lookupKey];
    return {
      lat: coords.lat,
      lon: coords.lon,
      nameEn: `${cleanState} (${cleanDistrict}), India`,
      nameHi: `${cleanState} (${cleanDistrict}), भारत`
    };
  }

  // 3. Try State Offline Lookup
  const stateKey = cleanState.toLowerCase();
  if (stateKey && STATE_COORDINATES[stateKey]) {
    const coords = STATE_COORDINATES[stateKey];
    return {
      lat: coords.lat,
      lon: coords.lon,
      nameEn: cleanDistrict ? `${cleanState} (${cleanDistrict}), India` : `${cleanState}, India`,
      nameHi: cleanDistrict ? `${cleanState} (${cleanDistrict}), भारत` : `${cleanState}, भारत`
    };
  }

  // 4. Default India center fallback
  return {
    lat: 28.6139,
    lon: 77.2090,
    nameEn: searchTarget || 'Delhi (NCT), India',
    nameHi: searchTarget || 'दिल्ली, भारत'
  };
}

/**
 * Gets actual live device GPS location using HTML5 Geolocation API
 */
export function getCurrentDeviceLocation() {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: parseFloat(position.coords.latitude.toFixed(4)),
          lon: parseFloat(position.coords.longitude.toFixed(4)),
          nameEn: `My Live GPS Location (${position.coords.latitude.toFixed(2)}°, ${position.coords.longitude.toFixed(2)}°)`,
          nameHi: `लाइव GPS स्थान (${position.coords.latitude.toFixed(2)}°, ${position.coords.longitude.toFixed(2)}°)`
        });
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}
