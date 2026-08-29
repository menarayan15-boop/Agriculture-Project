import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { LOCATIONS, SOILS, CROPS } from '../data/constants';
import { fetchServerStatus, fetchFarmerProfile, saveFarmerProfile } from '../services/api';
import { generateFarmerInsights } from '../services/farmerProfileEngine';
import { applyPersonalizationRules } from '../services/personalizationRules';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('krishi_lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('krishi_theme') || 'dark');
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

  // --- Explicit Farmer Profile (Onboarding) ---
  const [explicitProfile, setExplicitProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('krishi_explicit_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showOnboarding, setShowOnboarding] = useState(() => {
    const skipped = localStorage.getItem('krishi_skip_onboarding');
    return !explicitProfile && !skipped;
  });

  const saveExplicitProfile = (profileData) => {
    setExplicitProfile(profileData);
    localStorage.setItem('krishi_explicit_profile', JSON.stringify(profileData));
    setShowOnboarding(false);
  };

  const skipOnboarding = () => {
    localStorage.setItem('krishi_skip_onboarding', 'true');
    setShowOnboarding(false);
  };

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

      // --- Dynamic Suitability Score Calculation ---

      // 1. Soil-Crop compatibility (40% weight)
      // High-retention soils suit water-heavy crops; well-drained soils suit low-water crops
      const cropWaterNeed = crop.baseWater; // 3.5 (mustard) to 9.5 (sugarcane)
      const soilRetention = soil.retention;  // 30 (sandy) to 95 (black-soil)
      const soilDrainage = soil.drainage;    // 10 (black-soil) to 90 (sandy)

      // Ideal: high-water crops on high-retention soil, low-water crops on well-drained soil
      const waterNeedNorm = cropWaterNeed / 9.5; // 0..1
      const retentionNorm = soilRetention / 100;  // 0..1
      // Measure how well retention matches the crop's water demand
      const soilCropFit = 1 - Math.abs(waterNeedNorm - retentionNorm);
      const soilCropScore = Math.round(soilCropFit * 100); // 0-100

      // 2. Growth stage match (20% weight)
      const stageMatchBonus = (stage === crop.idealStage) ? 95 : 65;

      // 3. Area efficiency factor (15% weight)
      // Moderate areas (1-5 acres) are most manageable
      let areaScore;
      if (area >= 1 && area <= 5) areaScore = 92;
      else if (area > 5 && area <= 10) areaScore = 80;
      else if (area > 10) areaScore = 68;
      else areaScore = 75; // < 1 acre, small plot

      // 4. Drainage factor (10% weight)
      // Moderate drainage (35-55) is ideal for most crops
      const drainageDiff = Math.abs(soilDrainage - 45);
      const drainageScore = Math.round(100 - drainageDiff * 1.2);

      // 5. Random variation (15% weight) — simulates micro-climate & seasonal factors
      const randomFactor = Math.round(70 + Math.random() * 30); // 70-100

      // Weighted composite
      const rawScore = (
        soilCropScore * 0.40 +
        stageMatchBonus * 0.20 +
        areaScore * 0.15 +
        drainageScore * 0.10 +
        randomFactor * 0.15
      );
      const finalScore = Math.round(Math.max(35, Math.min(98, rawScore)));

      // Dynamic verdict
      let verdict, tips;
      if (finalScore >= 85) {
        verdict = "Optimal Soil-Crop Match ✅";
        tips = [
          "Maintain drip irrigation between 6:00 AM and 8:00 AM to minimize evaporation.",
          "Apply organic neem oil spray to mitigate early pest vectors.",
          "Ensure adequate sub-soil moisture drainage before peak flowering stage."
        ];
      } else if (finalScore >= 70) {
        verdict = "Good Match — Minor Adjustments Needed";
        tips = [
          "Consider adding organic compost to improve soil nutrient balance for this crop.",
          `This crop prefers ${cropWaterNeed > 6 ? 'high-retention' : 'well-drained'} soil — adjust irrigation frequency.`,
          stage !== crop.idealStage
            ? `Switch to the ${crop.idealStage} growth stage for better yield potential.`
            : "Growth stage is well-matched. Focus on pest management and nutrient timing."
        ];
      } else if (finalScore >= 50) {
        verdict = "Moderate Match — Improvements Recommended ⚠️";
        tips = [
          `Soil ${soil.id} has ${soil.retention > 70 ? 'high retention — improve drainage' : 'low retention — increase mulching'} for better results.`,
          "Add balanced NPK fertilizer and consider soil amendments before next sowing.",
          "Consult local KVK (Krishi Vigyan Kendra) for region-specific variety recommendations.",
          stage !== crop.idealStage
            ? `Current stage '${stage}' is not ideal for this crop. Best stage: '${crop.idealStage}'.`
            : "Monitor closely for nutrient deficiency signs during this growth phase."
        ];
      } else {
        verdict = "Poor Match — Consider Alternatives ❌";
        tips = [
          `Soil type '${soil.id}' is not well suited for ${crop.id}. Consider a different crop or soil amendment.`,
          `Try crops better suited for ${soil.drainage > 60 ? 'sandy/well-drained' : 'clayey/high-retention'} soils.`,
          "Heavy soil treatment (lime, gypsum, organic matter) may be required before planting.",
          "Seek guidance from your nearest agricultural extension center."
        ];
      }

      setReport({
        suitabilityScore: finalScore,
        verdict,
        waterAvg: (crop.baseWater * area * (0.9 + Math.random() * 0.3)).toFixed(1),
        tips
      });
    }, 600);
  };


  // --- Farmer Profiling Engine ---
  const farmerInsights = useMemo(() => {
    const baseInsights = generateFarmerInsights(
      { location, soil, crop, area, stage, preference },
      lang
    );
    return applyPersonalizationRules(explicitProfile, baseInsights, lang);
  }, [location, soil, crop, area, stage, preference, lang, explicitProfile]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('krishi_theme', next);
      return next;
    });
  };

  const value = {
    lang, setLang: changeLanguage,
    theme, setTheme, toggleTheme,
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
    explicitProfile,
    saveExplicitProfile,
    showOnboarding,
    setShowOnboarding,
    skipOnboarding,
    farmerInsights,
    report, setReport,
    loading, setLoading,
    handleGeneratePlan
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
