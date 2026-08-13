import React, { createContext, useContext, useState, useEffect } from 'react';
import { LOCATIONS, SOILS, CROPS } from '../data/constants';
import { fetchServerStatus, fetchFarmerProfile, saveFarmerProfile } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('krishi_lang') || 'en');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [soil, setSoil] = useState(SOILS[0]);
  const [crop, setCrop] = useState(CROPS[0]);
  const [stage, setStage] = useState('veg');
  const [area, setArea] = useState(1.0);
  const [preference, setPreference] = useState('balanced');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('krishi_gemini_key') || '');
  const [serverOnline, setServerOnline] = useState(false);

  const [farmerProfile, setFarmerProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('krishi_farmer_profile');
      return saved ? JSON.parse(saved) : { completed: 0 };
    } catch {
      return { completed: 0 };
    }
  });

  // Apply language change handler
  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('krishi_lang', newLang);
  };

  // Sync profile details into active advisor state
  const applyPersonalization = (profile) => {
    if (profile && profile.completed) {
      const stateMatch = LOCATIONS.find(loc => 
        loc.id === profile.state.toLowerCase() || 
        loc.nameEn.toLowerCase().includes(profile.state.toLowerCase())
      );
      if (stateMatch) {
        setLocation(stateMatch);
      } else {
        // Fallback dynamic location coordinates
        setLocation({
          id: profile.state.toLowerCase(),
          nameEn: `${profile.state} (${profile.district}), India`,
          nameHi: `${profile.state} (${profile.district}), भारत`,
          lat: 21.0, 
          lon: 78.0,
          defaultSoil: "loamy"
        });
      }

      if (profile.primary_crop) {
        const cropMatch = CROPS.find(c => 
          c.id === profile.primary_crop.toLowerCase() || 
          c.nameKey.toLowerCase().includes(profile.primary_crop.toLowerCase())
        );
        if (cropMatch) setCrop(cropMatch);
      }

      if (profile.farm_size) {
        if (profile.farm_size.includes("Less than 1")) setArea(0.5);
        else if (profile.farm_size.includes("1–2") || profile.farm_size.includes("1-2")) setArea(1.5);
        else if (profile.farm_size.includes("2–5") || profile.farm_size.includes("2-5")) setArea(3.5);
        else if (profile.farm_size.includes("5–10") || profile.farm_size.includes("5-10")) setArea(7.5);
        else if (profile.farm_size.includes("More than 10")) setArea(15.0);
      }

      if (profile.farming_type) {
        const type = profile.farming_type.toLowerCase();
        if (type.includes("organic")) setPreference("organic");
        else if (type.includes("commercial")) setPreference("synthetic");
        else setPreference("balanced");
      }
    }
  };

  // Live profile fetch on start
  useEffect(() => {
    fetchServerStatus().then(data => {
      if (data && data.status === 'healthy') {
        setServerOnline(true);
        // Server online -> fetch backend profile
        fetchFarmerProfile().then(res => {
          if (res && res.profile) {
            setFarmerProfile(res.profile);
            localStorage.setItem('krishi_farmer_profile', JSON.stringify(res.profile));
            applyPersonalization(res.profile);
          }
        });
      }
    });
  }, []);

  // Initial load personalization trigger
  useEffect(() => {
    if (farmerProfile && farmerProfile.completed) {
      applyPersonalization(farmerProfile);
    }
  }, [farmerProfile]);

  const updateProfile = async (profileData) => {
    // Save to backend if online
    let profile = { ...profileData, completed: 1 };
    if (serverOnline) {
      const res = await saveFarmerProfile(profile);
      if (res && res.success && res.profile) {
        profile = res.profile;
      }
    }
    // Save to local context and storage
    setFarmerProfile(profile);
    localStorage.setItem('krishi_farmer_profile', JSON.stringify(profile));
    applyPersonalization(profile);
    return { success: true };
  };

  const saveAiKey = (key) => {
    setGeminiKey(key);
    if (key) {
      localStorage.setItem('krishi_gemini_key', key);
    } else {
      localStorage.removeItem('krishi_gemini_key');
    }
  };

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setReport({
        suitabilityScore: 92,
        verdict: "Optimal Soil-Crop Match",
        waterAvg: (crop.baseWater * area * 1.1).toFixed(1),
        tips: [
          "Maintain drip irrigation between 6:00 AM and 8:00 AM to minimize evaporation.",
          "Apply organic neem oil spray to mitigate early pest vectors.",
          "Ensure adequate sub-soil moisture drainage before peak flowering stage."
        ]
      });
    }, 600);
  };

  const value = {
    lang, setLang: changeLanguage,
    activeTab, setActiveTab,
    location, setLocation,
    soil, setSoil,
    crop, setCrop,
    stage, setStage,
    area, setArea,
    preference, setPreference,
    geminiKey, saveAiKey,
    serverOnline,
    farmerProfile,
    updateProfile,
    report, setReport,
    loading, setLoading,
    handleGeneratePlan
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
