// Krishi Jal REST API Service Interface (connects to server.py)

const API_BASE = '/api';

export async function fetchServerStatus() {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('API status error');
    return await res.json();
  } catch (err) {
    console.warn('Backend server offline or unreachable:', err);
    return null;
  }
}

export async function fetchCrops() {
  try {
    const res = await fetch(`${API_BASE}/crops`);
    if (!res.ok) throw new Error('Crops API error');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchSchemes() {
  try {
    const res = await fetch(`${API_BASE}/schemes`);
    if (!res.ok) throw new Error('Schemes API error');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchEquipment() {
  try {
    const res = await fetch(`${API_BASE}/equipment`);
    if (!res.ok) throw new Error('Equipment API error');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function fetchProduce() {
  try {
    const res = await fetch(`${API_BASE}/produce`);
    if (!res.ok) throw new Error('Produce API error');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function bookEquipment(bookingData) {
  try {
    const res = await fetch(`${API_BASE}/equipment/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Server offline' };
  }
}

export async function addProduceListing(produceData) {
  try {
    const res = await fetch(`${API_BASE}/produce/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produceData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Server offline' };
  }
}

export async function saveSoilReport(reportData) {
  try {
    const res = await fetch(`${API_BASE}/soillab/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Server offline' };
  }
}

export async function analyzeSoilImage({ imageBase64, mimeType, apiKey }) {
  try {
    const res = await fetch(`${API_BASE}/soillab/analyze-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_base64: imageBase64,
        mime_type: mimeType || 'image/jpeg',
        api_key: apiKey
      })
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: 'Server offline or network error' };
  }
}

export async function fetchFarmerProfile() {
  try {
    const res = await fetch(`${API_BASE}/farmer/profile`);
    if (!res.ok) throw new Error('Profile API error');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function saveFarmerProfile(profileData) {
  try {
    const res = await fetch(`${API_BASE}/farmer/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: 'Server offline' };
  }
}
