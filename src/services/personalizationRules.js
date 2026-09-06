/**
 * personalizationRules.js
 * Config-driven rules mapping to tailor the app based on explicit farmer profiles.
 */

// Mapping of states to primary risks (mocked weights for demonstration)
const STATE_RISK_WEIGHTS = {
  'punjab': { 'waterlogging': 1.5, 'pest': 1.2, 'drought': 0.8 },
  'maharashtra': { 'drought': 1.5, 'market': 1.2, 'waterlogging': 0.8 },
  'kerala': { 'waterlogging': 1.5, 'pest': 1.3, 'drought': 0.5 },
  'rajasthan': { 'drought': 1.8, 'waterlogging': 0.2 },
  'default': { 'drought': 1.0, 'waterlogging': 1.0, 'pest': 1.0, 'market': 1.0 }
};

/**
 * Applies the explicit profile rules on top of the base AI insights.
 * @param {Object} explicitProfile { farmScale, state, incomeBracket, experienceLevel, goals }
 * @param {Object} baseInsights The raw output from farmerProfileEngine
 */
export function applyPersonalizationRules(explicitProfile, baseInsights, lang) {
  if (!explicitProfile) return baseInsights; // Fallback to inferred if no explicit profile

  let { priorityTabs, recommendedTabs, risks, tips, healthScore, profile } = baseInsights;
  const newRecommended = new Set(recommendedTabs);
  let newPriorityTabs = [...priorityTabs];

  // 1. By Farm Scale
  if (explicitProfile.farmScale === 'subsistence') {
    // Prioritize Govt Schemes and Advisor (Crop Guide)
    newPriorityTabs = ['schemes', 'advisor', 'dashboard', 'weather', 'voice-ai', 'planner'];
  } else if (explicitProfile.farmScale === 'commercial') {
    // Prioritize Marketplace, Calculator, Rentals
    newPriorityTabs = ['marketplace', 'rentals', 'calculator', 'dashboard', 'soillab', 'advisor'];
  }
  // Smallholder keeps the default balance (which is usually dashboard, voice-ai, advisor...)

  // 2. By Income Bracket & Goals (Govt Schemes)
  const isLowerIncome = ['Below ₹1,00,000', '₹1,00,000 - ₹3,00,000'].includes(explicitProfile.incomeBracket);
  const wantsSubsidies = explicitProfile.goals?.includes("Getting government subsidies");

  if (isLowerIncome || wantsSubsidies) {
    // Force 'schemes' to the very front if not already there
    newPriorityTabs = ['schemes', ...newPriorityTabs.filter(t => t !== 'schemes')];
    newRecommended.add('schemes');
  }

  if (explicitProfile.farmScale === 'commercial') {
    newRecommended.add('marketplace');
    newRecommended.add('rentals');
  }

  // 3. By State/Region (Risk Weighting)
  const stateKey = (explicitProfile.state || '').toLowerCase();
  const weights = STATE_RISK_WEIGHTS[stateKey] || STATE_RISK_WEIGHTS['default'];
  
  let newRisks = [...risks];
  if (weights) {
    // Sort risks by their state-specific weight (assuming risk IDs map loosely to these concepts)
    newRisks.sort((a, b) => {
      // Very basic keyword matching for demonstration
      const getWeight = (riskLabel) => {
        const lbl = riskLabel.toLowerCase();
        if (lbl.includes('water') || lbl.includes('जल')) return weights['waterlogging'] || 1;
        if (lbl.includes('drought') || lbl.includes('सूखा')) return weights['drought'] || 1;
        if (lbl.includes('pest') || lbl.includes('कीट')) return weights['pest'] || 1;
        if (lbl.includes('market') || lbl.includes('बाजार')) return weights['market'] || 1;
        return 1;
      };
      return getWeight(b.label) - getWeight(a.label);
    });
  }

  // 4. By Experience & Goals (Tips)
  let newTips = [...tips];
  
  // Reorder tips based on goals
  if (explicitProfile.goals && explicitProfile.goals.length > 0) {
    newTips.sort((a, b) => {
      const aMatchesGoal = explicitProfile.goals.some(g => 
        a.text.toLowerCase().includes(g.split(' ')[1]?.toLowerCase() || 'xyz')
      );
      const bMatchesGoal = explicitProfile.goals.some(g => 
        b.text.toLowerCase().includes(g.split(' ')[1]?.toLowerCase() || 'xyz')
      );
      return (bMatchesGoal ? 1 : 0) - (aMatchesGoal ? 1 : 0);
    });
  }

  // Inject a subsidy tip if lower income/subsidy goal
  if ((isLowerIncome || wantsSubsidies) && !newTips.some(t => t.id === 'subsidy_nudge')) {
    const subsidyMsg = {
      en: 'Based on your profile, you may be eligible for new government subsidies like PM-Kisan. Check the Schemes tab.',
      hi: 'आपके प्रोफाइल के आधार पर, आप पीएम किसान जैसी नई सरकारी योजनाओं के लिए पात्र हो सकते हैं। योजनाएं टैब देखें।',
      te: 'మీ ప్రొఫైల్ ఆధారంగా, మీరు PM-కిసాన్ వంటి కొత్త ప్రభుత్వ పథకాలకు అర్హులు కావచ్చు. పథకాల ట్యాబ్‌ను చూడండి.',
      ta: 'உங்கள் சுயவிவரத்தின் அடிப்படையில், பிஎம்-கிசான் போன்ற புதிய அரசு திட்டங்களுக்கு நீங்கள் தகுதியடையலாம். திட்டங்கள் தாவலைப்பார்க்கவும்.',
      kn: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಆಧರಿಸಿ, ನೀವು ಪಿಎಂ-ಕಿಸಾನ್ ನಂತಹ ಹೊಸ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹರಾಗಿರಬಹುದು. ಯೋಜನೆಗಳ ಟ್ಯಾಬ್ ನೋಡಿ.',
      pa: 'ਤੁਹਾਡੇ ਪ੍ਰੋਫਾਈਲ ਦੇ ਅਧਾਰ ਤੇ, ਤੁਸੀਂ ਪੀਐਮ-ਕਿਸਾਨ ਵਰਗੀਆਂ ਨਵੀਆਂ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਲਈ ਯੋਗ ਹੋ ਸਕਦੇ ਹੋ। ਸਕੀਮਾਂ ਟੈਬ ਦੇਖੋ।',
      mr: 'तुमच्या प्रोफाईलवर आधारित, तुम्ही पीएम-किसान सारख्या नवीन सरकारी योजनांसाठी पात्र असू शकता. योजना टॅब पहा.',
      bn: 'আপনার প্রোফাইলের ওপর ভিত্তি করে, আপনি পিএম-কিশানের মতো নতুন সরকারি প্রকল্পের জন্য যোগ্য হতে পারেন। স্কিম ট্যাব দেখুন।',
      gu: 'તમારા પ્રોફાઇલના આધારે, તમે પીએમ-કિસાન જેવી નવી સરકારી યોજનાઓ માટે પાત્ર હોઈ શકો છો. યોજનાઓ ટેબ જુઓ.',
      or: 'ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ଆଧାରରେ, ଆପଣ ପିଏମ୍-କିଷାନ୍ ଭଳି ନୂଆ ସରକାରୀ ଯୋଜନା ପାଇଁ ଯୋଗ୍ୟ ହୋଇପାରନ୍ତି। ଯୋଜନା ଟ୍ୟାବ୍ ଦେଖନ୍ତୁ।'
    };
    newTips.unshift({
      id: 'subsidy_nudge',
      icon: '🏛️',
      text: subsidyMsg[lang] || subsidyMsg.en
    });
  }
  
  // Clean out basic tips for veterans
  if (explicitProfile.experienceLevel === 'veteran') {
    newTips = newTips.filter(t => !t.text.toLowerCase().includes('basic') && !t.text.toLowerCase().includes('simple'));
  }

  return {
    ...baseInsights,
    priorityTabs: newPriorityTabs,
    recommendedTabs: newRecommended,
    risks: newRisks,
    tips: newTips,
    // Provide explicit profile down for UI rendering
    isExplicitlyPersonalized: true
  };
}
