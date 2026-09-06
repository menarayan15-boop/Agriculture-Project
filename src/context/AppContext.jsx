import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { LOCATIONS, SOILS, CROPS } from '../data/constants';
import { fetchServerStatus, fetchFarmerProfile, saveFarmerProfile } from '../services/api';
import { generateFarmerInsights } from '../services/farmerProfileEngine';
import { applyPersonalizationRules } from '../services/personalizationRules';
import { getCropRoadmap } from '../data/cropRoadmapData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('krishi_lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('krishi_theme') || 'dark');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [location, setLocation] = useState(null);
  const [soil, setSoil] = useState(null);
  const [crop, setCrop] = useState(null);
  const [stage, setStage] = useState('');
  const [area, setArea] = useState('');
  const [preference, setPreference] = useState('balanced');
  const [sowingDate, setSowingDate] = useState('');
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

    // Update Google Translate cookies for persistence across pages
    try {
      const hostname = window.location.hostname;
      document.cookie = `googtrans=/en/${newLang}; path=/;`;
      if (hostname) {
        document.cookie = `googtrans=/en/${newLang}; domain=${hostname}; path=/;`;
      }
    } catch (e) {}

    // Trigger Google Translate widget if loaded in DOM
    try {
      const gtCombo = document.querySelector('.goog-te-combo');
      if (gtCombo) {
        gtCombo.value = newLang;
        gtCombo.dispatchEvent(new Event('change'));
      }
    } catch (err) {
      console.log('GT Sync error:', err);
    }
  };

  // Sync saved language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('krishi_lang');
    if (savedLang && savedLang !== 'en') {
      setTimeout(() => {
        try {
          const gtCombo = document.querySelector('.goog-te-combo');
          if (gtCombo) {
            gtCombo.value = savedLang;
            gtCombo.dispatchEvent(new Event('change'));
          }
        } catch (e) {}
      }, 1200);
    }
  }, []);

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

  const handleGeneratePlan = (customCrop, customSoil, customLocation, customArea) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      const activeCrop = customCrop || crop || CROPS[0];
      const activeSoil = customSoil || soil || SOILS[0];
      const activeLocation = customLocation || location || LOCATIONS[0];
      const activeArea = Math.max(0.5, parseFloat(customArea || area) || 1);

      // --- Dynamic Suitability Score Calculation ---
      const cropWaterNeed = activeCrop?.baseWater ?? 6.0;
      const soilRetention = activeSoil?.retention ?? 70;
      const soilDrainage = activeSoil?.drainage ?? 40;

      const waterNeedNorm = cropWaterNeed / 9.5; // 0..1
      const retentionNorm = soilRetention / 100;  // 0..1
      const soilCropFit = 1 - Math.abs(waterNeedNorm - retentionNorm);
      const soilCropScore = Math.round(soilCropFit * 100);

      const stageMatchBonus = (stage && activeCrop?.idealStage && stage === activeCrop.idealStage) ? 95 : 65;

      let areaScore;
      if (activeArea >= 1 && activeArea <= 5) areaScore = 92;
      else if (activeArea > 5 && activeArea <= 10) areaScore = 80;
      else if (activeArea > 10) areaScore = 68;
      else areaScore = 75;

      const drainageDiff = Math.abs(soilDrainage - 45);
      const drainageScore = Math.round(100 - drainageDiff * 1.2);

      const randomFactor = Math.round(70 + Math.random() * 30);

      const rawScore = (
        soilCropScore * 0.40 +
        stageMatchBonus * 0.20 +
        areaScore * 0.15 +
        drainageScore * 0.10 +
        randomFactor * 0.15
      );
      const finalScore = Math.round(Math.max(35, Math.min(98, rawScore)));

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
          (stage && activeCrop?.idealStage && stage !== activeCrop.idealStage)
            ? `Switch to the ${activeCrop.idealStage} growth stage for better yield potential.`
            : "Growth stage is well-matched. Focus on pest management and nutrient timing."
        ];
      } else if (finalScore >= 50) {
        verdict = "Moderate Match — Improvements Recommended ⚠️";
        tips = [
          `Soil ${activeSoil?.id || 'type'} has ${soilRetention > 70 ? 'high retention — improve drainage' : 'low retention — increase mulching'} for better results.`,
          "Add balanced NPK fertilizer and consider soil amendments before next sowing.",
          "Consult local KVK (Krishi Vigyan Kendra) for region-specific variety recommendations.",
          (stage && activeCrop?.idealStage && stage !== activeCrop.idealStage)
            ? `Current stage '${stage}' is not ideal for this crop. Best stage: '${activeCrop.idealStage}'.`
            : "Monitor closely for nutrient deficiency signs during this growth phase."
        ];
      } else {
        verdict = "Poor Match — Consider Alternatives ❌";
        tips = [
          `Soil type '${activeSoil?.id || 'selected'}' is not well suited for ${activeCrop?.id || 'this crop'}. Consider a different crop or soil amendment.`,
          `Try crops better suited for ${soilDrainage > 60 ? 'sandy/well-drained' : 'clayey/high-retention'} soils.`,
          "Heavy soil treatment (lime, gypsum, organic matter) may be required before planting.",
          "Seek guidance from your nearest agricultural extension center."
        ];
      }

      const cropRoadmap = getCropRoadmap(
        activeCrop?.id || 'wheat',
        activeCrop?.nameEn || activeCrop?.name || 'Wheat',
        activeLocation?.id || 'punjab',
        activeArea,
        sowingDate,
        activeSoil
      );

      setReport({
        suitabilityScore: finalScore,
        verdict,
        waterAvg: (cropWaterNeed * activeArea * (0.9 + Math.random() * 0.3)).toFixed(1),
        tips,
        cropRoadmap
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
    sowingDate, setSowingDate,
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
