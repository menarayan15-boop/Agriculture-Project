import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from '../context/AppContext';

// NOAA Heat Index Calculation in Celsius
function calculateHeatIndexCelsius(tempC, humidity) {
  if (tempC < 20) return Math.round(tempC * 10) / 10;
  const tf = (tempC * 9) / 5 + 32;
  const rh = Math.min(Math.max(humidity, 0), 100);

  let hiF = 0.5 * (tf + 61.0 + (tf - 68.0) * 1.2 + rh * 0.094);

  if ((hiF + tf) / 2 >= 80) {
    hiF =
      -42.379 +
      2.04901523 * tf +
      10.14333127 * rh -
      0.22475541 * tf * rh -
      0.00683783 * tf * tf -
      0.05481717 * rh * rh +
      0.00122874 * tf * tf * rh +
      0.00085282 * tf * rh * rh -
      0.00000199 * tf * tf * rh * rh;

    if (rh < 13 && tf >= 80 && tf <= 112) {
      hiF -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tf - 95)) / 17);
    } else if (rh > 85 && tf >= 80 && tf <= 87) {
      hiF += ((rh - 85) / 10) * ((87 - tf) / 5);
    }
  }

  const hiC = ((hiF - 32) * 5) / 9;
  return Math.round(hiC * 10) / 10;
}

// Physiological & Heat Risk Evaluation Engine
function evaluateFarmerSafety(temp, humd, hr, lang = 'en') {
  const heatIndex = calculateHeatIndexCelsius(temp, humd);
  const isHi = lang === 'hi';

  // 1. Extreme Critical Danger (Severe Heat Stroke / Cardiovascular Collapse risk)
  if (heatIndex >= 41 || hr >= 135 || (heatIndex >= 36 && hr >= 115)) {
    let whyText = '';
    if (isHi) {
      if (hr >= 135 && heatIndex >= 41) {
        whyText = `अत्यधिक ताप सूचकांक (${heatIndex}°C) और बहुत तेज़ हृदय गति (${hr} bpm)। हीट स्ट्रोक का गंभीर खतरा है। तुरंत काम रोकें और ठंडी छाया में जाएं।`;
      } else if (heatIndex >= 41) {
        whyText = `खतरनाक ताप सूचकांक (${heatIndex}°C) शरीर की सहने की सीमा पार कर चुका है। तुरंत छायादार स्थान पर जाएं।`;
      } else {
        whyText = `गर्मी (${temp}°C) के दौरान हृदय गति (${hr} bpm) खतरनाक स्तर पर है। भारी शारीरिक श्रम तुरंत बंद करें।`;
      }
    } else {
      if (hr >= 135 && heatIndex >= 41) {
        whyText = `Critical heat index (${heatIndex}°C) combined with high cardiovascular strain (${hr} bpm). Heat stroke risk imminent. Cease work and rest in shade.`;
      } else if (heatIndex >= 41) {
        whyText = `Dangerous apparent heat index of ${heatIndex}°C exceeds physiological safety limits. Move to cool shelter immediately.`;
      } else {
        whyText = `Extreme cardiovascular load (${hr} bpm) detected under thermal stress (${temp}°C). Stop physical labor and cool down.`;
      }
    }

    return {
      level: 'danger',
      status: isHi ? 'खतरा: तुरंत छाया में जाएं' : 'DANGER: SEEK SHADE',
      riskBadge: isHi ? 'गंभीर गर्मी का खतरा' : 'CRITICAL HEAT RISK',
      badgeColor: '#ef4444',
      badgeBg: '#2a1212',
      sphereClass: 'sphere-danger',
      statusColor: '#ef4444',
      why: whyText,
      timelineLabel: isHi ? 'खतरा' : 'Danger',
      heatIndex
    };
  }

  // 2. High Heat Risk (Heat exhaustion / High thermal strain)
  if (heatIndex >= 33 || hr >= 110 || (heatIndex >= 30 && hr >= 95)) {
    let whyText = '';
    if (isHi) {
      if (heatIndex >= 33 && hr >= 110) {
        whyText = `उच्च ताप सूचकांक (${heatIndex}°C) और बढ़ी हुई हृदय गति (${hr} bpm)। लू और थकावट का उच्च जोखिम है। छाया में अनिवार्य आराम लें।`;
      } else if (heatIndex >= 33) {
        whyText = `उच्च आर्द्रता (${humd}%) के कारण तापमान ${heatIndex}°C महसूस हो रहा है। पसीना सूखने में रुकावट है। छाया में जाएं और पानी पिएं।`;
      } else {
        whyText = `शारीरिक श्रम के कारण हृदय गति (${hr} bpm) सामान्य से अधिक है। 15 मिनट का ब्रेक लें।`;
      }
    } else {
      if (heatIndex >= 33 && hr >= 110) {
        whyText = `Apparent heat index (${heatIndex}°C) and elevated heart rate (${hr} bpm) indicate heat exhaustion risk. Take a mandatory rest in shade.`;
      } else if (heatIndex >= 33) {
        whyText = `High relative humidity (${humd}%) elevates perceived heat to ${heatIndex}°C, impairing evaporative cooling. Seek shaded rest and hydrate.`;
      } else {
        whyText = `Cardiovascular load (${hr} bpm) is elevated under ${temp}°C ambient conditions. Take a 15-minute rest in shade.`;
      }
    }

    return {
      level: 'high',
      status: isHi ? 'खतरा: छाया में आराम करें' : 'DANGER: SEEK SHADE',
      riskBadge: isHi ? 'उच्च गर्मी जोखिम' : 'HIGH HEAT RISK',
      badgeColor: '#f97316',
      badgeBg: '#28170e',
      sphereClass: 'sphere-high',
      statusColor: '#f97316',
      why: whyText,
      timelineLabel: isHi ? 'खतरा' : 'Danger',
      heatIndex
    };
  }

  // 3. Moderate Caution (Warm conditions / High humidity fatigue)
  if (heatIndex >= 28 || hr >= 90 || (temp >= 26 && humd >= 80)) {
    let whyText = '';
    if (isHi) {
      if (humd >= 80) {
        whyText = `उच्च आर्द्रता (${humd}%) के कारण गर्मी का प्रभाव बढ़ रहा है (ताप सूचकांक: ${heatIndex}°C)। हृदय गति (${hr} bpm) स्थिर है। हर 20 मिनट में पानी पिएं।`;
      } else {
        whyText = `मध्यम ताप भार (ताप सूचकांक: ${heatIndex}°C, हृदय गति: ${hr} bpm)। नियमित रूप से पानी पीते रहें।`;
      }
    } else {
      if (humd >= 80) {
        whyText = `High humidity (${humd}%) at ${temp}°C elevates thermal index to ${heatIndex}°C. Heart rate is steady at ${hr} bpm. Maintain regular hydration.`;
      } else {
        whyText = `Moderate thermal stress (Heat Index: ${heatIndex}°C, HR: ${hr} bpm). Regular hydration recommended during farm work.`;
      }
    }

    return {
      level: 'caution',
      status: isHi ? 'सावधानी: पर्याप्त पानी पिएं' : 'CAUTION: HYDRATE FREQUENTLY',
      riskBadge: isHi ? 'मध्यम गर्मी का तनाव' : 'MODERATE HEAT STRESS',
      badgeColor: '#eab308',
      badgeBg: '#262010',
      sphereClass: 'sphere-caution',
      statusColor: '#eab308',
      why: whyText,
      timelineLabel: isHi ? 'सावधानी' : 'Caution',
      heatIndex
    };
  }

  // 4. Safe & Optimal (Comfortable conditions, relaxed vitals)
  return {
    level: 'safe',
    status: isHi ? 'सुरक्षित: सामान्य कार्य स्थिति' : 'SAFE: NORMAL FIELD CONDITIONS',
    riskBadge: isHi ? 'कम जोखिम (सुरक्षित)' : 'LOW RISK',
    badgeColor: '#22c55e',
    badgeBg: '#112517',
    sphereClass: 'sphere-safe',
    statusColor: '#22c55e',
    why: isHi
      ? `सभी मान स्थिर हैं। तापमान (${temp}°C) और हृदय गति (${hr} bpm) पूर्णतः सुरक्षित सीमा में हैं।`
      : `Values are stable. Environmental temperature (${temp}°C) and heart rate (${hr} bpm) are within safe physiological limits.`,
    timelineLabel: isHi ? 'सुरक्षित' : 'Safe',
    heatIndex
  };
}

// Location-Aware Nearest Healthcare Facility Database with Detailed Navigation Routing
const HOSPITAL_DATABASE = {
  haryana: {
    name: 'Karnal Govt. PHC',
    nameHi: 'करनाल सरकारी प्राथमिक स्वास्थ्य केंद्र (PHC)',
    address: 'Near Mall Road, Sector 12, Karnal, Haryana 132001',
    addressHi: 'मॉल रोड के पास, सेक्टर 12, करनाल, हरियाणा 132001',
    distKm: '6.2',
    etaMins: '14',
    ambulance: '108',
    emergencyDesk: '+91-184-2267108',
    city: 'Karnal, Haryana',
    lat: 29.6857,
    lon: 76.9907,
    steps: [
      { dist: '1.1 km', text: 'Head east on Farm Link Road toward NH-44 access.', textHi: 'खेत संपर्क मार्ग से पूर्व की ओर NH-44 की दिशा में चलें।' },
      { dist: '3.6 km', text: 'Merge onto NH-44 / GT Road and proceed straight.', textHi: 'NH-44 / जीटी रोड पर आगे बढ़ें।' },
      { dist: '1.5 km', text: 'Take Sector 12 exit toward Civil Hospital Chowk. PHC on right.', textHi: 'सेक्टर 12 निकास लेकर सिविल अस्पताल चौक पहुंचें। PHC दाईं ओर है।' }
    ]
  },
  punjab: {
    name: 'Ludhiana Civil Hospital & PHC',
    nameHi: 'लुधियाना सिविल अस्पताल एवं PHC',
    address: 'Near Old Bus Stand, Ludhiana, Punjab 141001',
    addressHi: 'पुराने बस स्टैंड के पास, लुधियाना, पंजाब 141001',
    distKm: '4.8',
    etaMins: '11',
    ambulance: '108',
    emergencyDesk: '+91-161-2444108',
    city: 'Ludhiana, Punjab',
    lat: 30.9010,
    lon: 75.8573,
    steps: [
      { dist: '0.9 km', text: 'Head north on Link Road toward Ferozepur Road.', textHi: 'फिरोजपुर रोड की ओर लिंक रोड पर उत्तर दिशा में बढ़ें।' },
      { dist: '2.7 km', text: 'Continue straight on Ferozepur Highway.', textHi: 'फिरोजपुर हाईवे पर सीधे चलें।' },
      { dist: '1.2 km', text: 'Turn left at Civil Lines to arrive at Emergency Gate.', textHi: 'सिविल लाइंस पर बाएं मुड़कर इमरजेंसी गेट पर पहुंचें।' }
    ]
  },
  maharashtra: {
    name: 'Nashik Rural CHC & Trauma Centre',
    nameHi: 'नाशिक ग्रामीण CHC एवं ट्रॉमा सेंटर',
    address: 'Trimbak Road, Nashik, Maharashtra 422002',
    addressHi: 'त्र्यंबक रोड, नाशिक, महाराष्ट्र 422002',
    distKm: '5.4',
    etaMins: '12',
    ambulance: '108',
    emergencyDesk: '+91-253-2578108',
    city: 'Nashik, Maharashtra',
    lat: 19.9975,
    lon: 73.7898,
    steps: [
      { dist: '1.2 km', text: 'Head west on Agri Canal Road toward Trimbak Highway.', textHi: 'त्र्यंबक हाईवे की ओर एग्री नहर मार्ग पर बढ़ें।' },
      { dist: '3.1 km', text: 'Follow Trimbak Road through Satpur bypass.', textHi: 'सातपुर बाईपास होते हुए त्र्यंबक रोड पर आगे बढ़ें।' },
      { dist: '1.1 km', text: 'Turn right at Rural Hospital complex gate.', textHi: 'ग्रामीण अस्पताल परिसर गेट पर दाएं मुड़ें।' }
    ]
  },
  andhra: {
    name: 'Guntur Govt. General PHC',
    nameHi: 'गुंटूर सरकारी सामान्य स्वास्थ्य केंद्र',
    address: 'Sambasiva Pet, Guntur, Andhra Pradesh 522001',
    addressHi: 'सांबशिव पेट, गुंटूर, आंध्र प्रदेश 522001',
    distKm: '7.1',
    etaMins: '16',
    ambulance: '108',
    emergencyDesk: '+91-863-2223108',
    city: 'Guntur, Andhra Pradesh',
    lat: 16.3067,
    lon: 80.4365,
    steps: [
      { dist: '1.5 km', text: 'Head north on Mirchi Yard bypass road.', textHi: 'मिर्ची यार्ड बाईपास रोड पर उत्तर दिशा में बढ़ें।' },
      { dist: '4.2 km', text: 'Continue along Old Club Road toward Market Center.', textHi: 'मार्केट सेंटर की दिशा में ओल्ड क्लब रोड पर चलें।' },
      { dist: '1.4 km', text: 'Turn right into General Hospital premises.', textHi: 'जनरल अस्पताल परिसर में दाएं मुड़ें।' }
    ]
  },
  up: {
    name: 'Kanpur Dehat CHC',
    nameHi: 'कानपुर देहात सामुदायिक स्वास्थ्य केंद्र',
    address: 'Akbarpur, Kanpur Dehat, Uttar Pradesh 209101',
    addressHi: 'अकबरपुर, कानपुर देहात, उत्तर प्रदेश 209101',
    distKm: '8.0',
    etaMins: '18',
    ambulance: '108',
    emergencyDesk: '+91-5111-271108',
    city: 'Kanpur, Uttar Pradesh',
    lat: 26.4499,
    lon: 80.3319,
    steps: [
      { dist: '2.0 km', text: 'Head toward GT Road Highway interchange.', textHi: 'जीटी रोड हाईवे इंटरचेंज की ओर बढ़ें।' },
      { dist: '4.5 km', text: 'Proceed on Kanpur-Agra Highway.', textHi: 'कानपुर-आगरा हाईवे पर आगे बढ़ें।' },
      { dist: '1.5 km', text: 'Take Akbarpur CHC approach road on the left.', textHi: 'बाईं ओर अकबरपुर CHC संपर्क मार्ग लें।' }
    ]
  },
  rajasthan: {
    name: 'Sri Ganganagar Govt. PHC',
    nameHi: 'श्री गंगानगर सरकारी PHC',
    address: 'Public Park Road, Sri Ganganagar, Rajasthan 335001',
    addressHi: 'पब्लिक पार्क रोड, श्री गंगानगर, राजस्थान 335001',
    distKm: '5.9',
    etaMins: '13',
    ambulance: '108',
    emergencyDesk: '+91-154-2440108',
    city: 'Sri Ganganagar, Rajasthan',
    lat: 29.9281,
    lon: 73.8783,
    steps: [
      { dist: '1.3 km', text: 'Head east on Canal distributary road.', textHi: 'नहर मार्ग पर पूर्व दिशा में चलें।' },
      { dist: '3.4 km', text: 'Proceed on Suratgarh Road toward City Circle.', textHi: 'सूरतगढ़ रोड पर सिटी सर्कल की ओर बढ़ें।' },
      { dist: '1.2 km', text: 'Arrive at Govt. Hospital Emergency entrance.', textHi: 'सरकारी अस्पताल आपातकालीन प्रवेश द्वार पर पहुंचें।' }
    ]
  },
  bengal: {
    name: 'Bardhaman Block PHC',
    nameHi: 'बर्धमान ब्लॉक प्राथमिक स्वास्थ्य केंद्र',
    address: 'Court Compound, Bardhaman, West Bengal 713101',
    addressHi: 'कोर्ट कंपाउंड, बर्धमान, पश्चिम बंगाल 713101',
    distKm: '6.5',
    etaMins: '15',
    ambulance: '108',
    emergencyDesk: '+91-342-2561108',
    city: 'Bardhaman, West Bengal',
    lat: 23.2324,
    lon: 87.8615,
    steps: [
      { dist: '1.4 km', text: 'Head south along Rice Mill approach route.', textHi: 'राइस मिल संपर्क मार्ग से दक्षिण की ओर बढ़ें।' },
      { dist: '3.8 km', text: 'Continue along Grand Trunk Road (GT Road).', textHi: 'ग्रैंड ट्रंक रोड पर आगे बढ़ें।' },
      { dist: '1.3 km', text: 'Turn left into District Hospital healthcare wing.', textHi: 'जिला अस्पताल स्वास्थ्य विंग में बाएं मुड़ें।' }
    ]
  },
  gujarat: {
    name: 'Anand Community Health Centre',
    nameHi: 'आनंद सामुदायिक स्वास्थ्य केंद्र (CHC)',
    address: 'Amul Dairy Road, Anand, Gujarat 388001',
    addressHi: 'अमूल डेयरी रोड, आनंद, गुजरात 388001',
    distKm: '4.2',
    etaMins: '10',
    ambulance: '108',
    emergencyDesk: '+91-2692-250108',
    city: 'Anand, Gujarat',
    lat: 22.5645,
    lon: 72.9289,
    steps: [
      { dist: '0.8 km', text: 'Head east on Milk Cooperative feeder road.', textHi: 'दूध सहकारी फीडर रोड पर पूर्व दिशा में चलें।' },
      { dist: '2.4 km', text: 'Follow Amul Dairy Road toward town center.', textHi: 'अमूल डेयरी रोड से नगर केंद्र की ओर बढ़ें।' },
      { dist: '1.0 km', text: 'Turn right at Community Hospital junction.', textHi: 'सामुदायिक अस्पताल जंक्शन पर दाएं मुड़ें।' }
    ]
  },
  karnataka: {
    name: 'Bengaluru Rural PHC',
    nameHi: 'बेंगलुरु ग्रामीण प्राथमिक स्वास्थ्य केंद्र',
    address: 'Doddaballapur Road, Bengaluru Rural, Karnataka 561203',
    addressHi: 'दोड्डबल्लापुर रोड, बेंगलुरु ग्रामीण, कर्नाटक 561203',
    distKm: '5.1',
    etaMins: '12',
    ambulance: '108',
    emergencyDesk: '+91-80-27621108',
    city: 'Bengaluru, Karnataka',
    lat: 12.9716,
    lon: 77.5946,
    steps: [
      { dist: '1.0 km', text: 'Head toward State Highway 9 junction.', textHi: 'स्टेट हाईवे 9 जंक्शन की दिशा में आगे बढ़ें।' },
      { dist: '3.0 km', text: 'Proceed straight along Doddaballapur Main Road.', textHi: 'दोड्डबल्लापुर मुख्य मार्ग पर सीधे चलें।' },
      { dist: '1.1 km', text: 'Turn left at Rural PHC building.', textHi: 'ग्रामीण PHC भवन पर बाएं मुड़ें।' }
    ]
  },
  tn: {
    name: 'Coimbatore Govt. PHC',
    nameHi: 'कोयंबटूर सरकारी प्राथमिक स्वास्थ्य केंद्र',
    address: 'Trichy Road, Coimbatore, Tamil Nadu 641018',
    addressHi: 'त्रिची रोड, कोयंबटूर, तमिलनाडु 641018',
    distKm: '6.0',
    etaMins: '14',
    ambulance: '108',
    emergencyDesk: '+91-422-2300108',
    city: 'Coimbatore, Tamil Nadu',
    lat: 11.0168,
    lon: 76.9558,
    steps: [
      { dist: '1.2 km', text: 'Head toward Pollachi-Coimbatore Link Road.', textHi: 'पोलाची-कोयंबटूर लिंक रोड की ओर बढ़ें।' },
      { dist: '3.5 km', text: 'Proceed on Trichy Highway.', textHi: 'त्रिची हाईवे पर आगे बढ़ें।' },
      { dist: '1.3 km', text: 'Turn right to Govt. PHC Medical Center gate.', textHi: 'सरकारी PHC मेडिकल सेंटर गेट पर दाएं मुड़ें।' }
    ]
  },
  telangana: {
    name: 'Warangal Area Hospital & PHC',
    nameHi: 'वरंगल एरिया अस्पताल एवं PHC',
    address: 'MGM Hospital Road, Warangal, Telangana 506007',
    addressHi: 'एमजीएम अस्पताल रोड, वरंगल, तेलंगाना 506007',
    distKm: '7.3',
    etaMins: '17',
    ambulance: '108',
    emergencyDesk: '+91-870-2438108',
    city: 'Warangal, Telangana',
    lat: 17.9784,
    lon: 79.6015,
    steps: [
      { dist: '1.6 km', text: 'Head on Cotton Market Road toward Kakatiya highway.', textHi: 'काकतीय हाईवे की ओर कॉटन मार्केट रोड पर बढ़ें।' },
      { dist: '4.2 km', text: 'Proceed straight through Hanamkonda bypass.', textHi: 'हनमकोंडा बाईपास से सीधे आगे बढ़ें।' },
      { dist: '1.5 km', text: 'Turn left into Area Hospital Emergency Block.', textHi: 'एरिया अस्पताल इमरजेंसी ब्लॉक में बाएं मुड़ें।' }
    ]
  },
  mp: {
    name: 'Indore Rural CHC',
    nameHi: 'इंदौर ग्रामीण सामुदायिक स्वास्थ्य केंद्र',
    address: 'Sanwer Road, Indore, Madhya Pradesh 453551',
    addressHi: 'सांवेर रोड, इंदौर, मध्य प्रदेश 453551',
    distKm: '5.6',
    etaMins: '13',
    ambulance: '108',
    emergencyDesk: '+91-731-2534108',
    city: 'Indore, Madhya Pradesh',
    lat: 22.7196,
    lon: 75.8577,
    steps: [
      { dist: '1.1 km', text: 'Head east on Agri mandi bypass road.', textHi: 'कृषि मंडी बाईपास रोड पर पूर्व दिशा में चलें।' },
      { dist: '3.2 km', text: 'Proceed along Sanwer Highway toward town entrance.', textHi: 'सांवेर हाईवे से नगर प्रवेश की ओर बढ़ें।' },
      { dist: '1.3 km', text: 'Turn right into Rural CHC Hospital grounds.', textHi: 'ग्रामीण CHC अस्पताल परिसर में दाएं मुड़ें।' }
    ]
  },
  bihar: {
    name: 'Patna Sadar PHC',
    nameHi: 'पटना सदर प्राथमिक स्वास्थ्य केंद्र',
    address: 'Ashok Rajpath, Patna, Bihar 800004',
    addressHi: 'अशोक राजपथ, पटना, बिहार 800004',
    distKm: '4.9',
    etaMins: '11',
    ambulance: '108',
    emergencyDesk: '+91-612-2300108',
    city: 'Patna, Bihar',
    lat: 25.5941,
    lon: 85.1376,
    steps: [
      { dist: '1.0 km', text: 'Head toward Bailey Road connector.', textHi: 'बेली रोड कनेक्टर की दिशा में आगे बढ़ें।' },
      { dist: '2.7 km', text: 'Continue straight on Ashok Rajpath.', textHi: 'अशोक राजपथ पर सीधे चलें।' },
      { dist: '1.2 km', text: 'Turn right into Sadar PHC health complex.', textHi: 'सदर PHC स्वास्थ्य परिसर में दाएं मुड़ें।' }
    ]
  }
};

export function SmartFarmAiSafety({ liveWeatherData = null }) {
  const { lang, location } = useApp ? useApp() : { lang: 'en', location: null };
  const isHindi = lang === 'hi';

  // Sensor state initialized to match standard field demo values
  const [temp, setTemp] = useState(27);
  const [humd, setHumd] = useState(92);
  const [hr, setHr] = useState(72);
  const [isAssessing, setIsAssessing] = useState(false);
  const [lastAssessedTime, setLastAssessedTime] = useState(null);

  // Strain & Chemical State (customizable)
  const [caloriesBurned, setCaloriesBurned] = useState(1695);
  const [sunExposureHrs, setSunExposureHrs] = useState(4.6);
  const [sprayChemical, setSprayChemical] = useState('Mancozeb 75%');
  const [sprayHoursAgo, setSprayHoursAgo] = useState(24);
  const [sprayLoggedTime, setSprayLoggedTime] = useState('yesterday at 4:30 PM');

  // Auto-sync initial weather from live weather data if available
  useEffect(() => {
    if (liveWeatherData && liveWeatherData.temp !== undefined) {
      setTemp(Math.round(liveWeatherData.temp));
      if (liveWeatherData.humidity !== undefined) {
        setHumd(Math.round(liveWeatherData.humidity));
      }
    }
  }, [liveWeatherData]);

  // Compute real-time AI decision
  const decision = evaluateFarmerSafety(temp, humd, hr, lang);

  // Format Timestamps for Risk Timeline
  const now = new Date();
  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  const timeNow = formatTime(now);
  const timeMinus2h = formatTime(new Date(now.getTime() - 2 * 60 * 60 * 1000));
  const timeMinus4h = formatTime(new Date(now.getTime() - 4 * 60 * 60 * 1000));

  // Resolved Nearest Hospital
  const hospital = useMemo(() => {
    const locKey = location && location.id ? location.id.toLowerCase() : 'haryana';
    return (
      HOSPITAL_DATABASE[locKey] || {
        name: `${(location && location.nameEn) || 'Karnal'} Govt. PHC`,
        nameHi: `${(location && location.nameHi) || 'करनाल'} सरकारी प्राथमिक स्वास्थ्य केंद्र`,
        address: `${(location && location.nameEn) || 'Karnal, Haryana'}, India`,
        addressHi: `${(location && location.nameHi) || 'करनाल, हरियाणा'}, भारत`,
        distKm: '6.2',
        etaMins: '14',
        ambulance: '108',
        emergencyDesk: '+91-184-2267108',
        city: (location && location.nameEn) || 'Karnal, Haryana',
        lat: (location && location.lat) || 29.6857,
        lon: (location && location.lon) || 76.9907,
        steps: [
          { dist: '1.1 km', text: 'Head east on Farm Link Road.', textHi: 'खेत संपर्क मार्ग से पूर्व की ओर चलें।' },
          { dist: '3.6 km', text: 'Proceed straight along main arterial road.', textHi: 'मुख्य सड़क पर सीधे बढ़ें।' },
          { dist: '1.5 km', text: 'Turn left to hospital emergency entrance.', textHi: 'अस्पताल आपातकालीन प्रवेश द्वार पर बाएं मुड़ें।' }
        ]
      }
    );
  }, [location]);

  // Navigation & Directions State
  const [showEmbeddedDirections, setShowEmbeddedDirections] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Origin & Destination for 100% Reliable Google Maps Navigation
  const originCoord = useMemo(() => {
    return location && location.lat ? `${location.lat},${location.lon}` : 'Current+Location';
  }, [location]);

  // Direct Google Maps Driving Directions URL (with explicit origin + destination)
  const googleMapsDirectionsUrl = useMemo(() => {
    return `https://www.google.com/maps/dir/?api=1&origin=${originCoord}&destination=${hospital.lat},${hospital.lon}&travelmode=driving`;
  }, [originCoord, hospital]);

  const handleToggleOrOpenDirections = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Toggle embedded route panel on screen
      setShowEmbeddedDirections((prev) => !prev);

      // Also trigger direct Google Maps navigation in new tab
      const url = `https://www.google.com/maps/dir/?api=1&origin=${originCoord}&destination=${hospital.lat},${hospital.lon}&travelmode=driving`;
      const newTab = window.open(url, '_blank', 'noopener,noreferrer');
      if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
        // Pop-up blocker fallback
        window.open(url, '_blank');
      }
    },
    [originCoord, hospital]
  );

  const handleCopyCoords = (e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(`${hospital.lat}, ${hospital.lon}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  const handleRiskAssessment = useCallback(() => {
    setIsAssessing(true);
    setTimeout(() => {
      setIsAssessing(false);
      const currentTime = new Date();
      setLastAssessedTime(
        currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 350);
  }, []);

  const handleResetToLive = () => {
    if (liveWeatherData && liveWeatherData.temp !== undefined) {
      setTemp(Math.round(liveWeatherData.temp));
      if (liveWeatherData.humidity !== undefined) {
        setHumd(Math.round(liveWeatherData.humidity));
      }
    } else {
      setTemp(27);
      setHumd(92);
    }
    setHr(72);
    handleRiskAssessment();
  };

  const handleCall108 = (e) => {
    if (e) e.stopPropagation();
    window.location.href = 'tel:108';
  };

  const isReiSafe = sprayHoursAgo >= 24;

  return (
    <div className="farmer-safety-suite-wrapper">
      {/* 1. Main Top Safety & AI Decision Card */}
      <div className="smartfarm-safety-container">
        {/* Left Column: Your Current Safety */}
        <div className="smartfarm-left-section">
          <div className="safety-header-label">
            <span className="farmer-icon">🧑‍🌾</span>
            <span>{isHindi ? 'आपकी वर्तमान सुरक्षा' : 'YOUR CURRENT SAFETY'}</span>
          </div>

          <div className="safety-status-display">
            <div className={`safety-sphere ${decision.sphereClass}`} title={`Risk Level: ${decision.level}`}>
              <div className="sphere-glow"></div>
            </div>
            <span className="safety-status-text" style={{ color: decision.statusColor }}>
              {decision.status}
            </span>
          </div>

          <div className="safety-why-container">
            <div className="why-label">W H Y ?</div>
            <div className="why-text">{decision.why}</div>
          </div>
        </div>

        {/* Right Column: SmartFarm AI Decision */}
        <div className="smartfarm-right-section">
          <div className="ai-decision-box">
            <div className="ai-decision-title">
              <span className="brain-emoji">🧠</span>
              <span>{isHindi ? 'स्मार्टफार्म एआई निर्णय' : 'SMARTFARM AI DECISION'}</span>
            </div>

            <div className="sensor-rows">
              {/* Temp Control */}
              <div className="sensor-row">
                <div className="sensor-info">
                  <span className="sensor-icon">🌡️</span>
                  <span className="sensor-label">
                    {isHindi ? 'तापमान' : 'Temp'}: {temp}°C
                  </span>
                </div>
                <div className="sensor-actions">
                  <button
                    type="button"
                    className="adjust-btn minus"
                    onClick={() => {
                      setTemp((t) => Math.max(t - 1, 10));
                      handleRiskAssessment();
                    }}
                    title={isHindi ? 'तापमान घटाएं' : 'Decrease Temp'}
                    aria-label="Decrease Temperature"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="adjust-btn plus"
                    onClick={() => {
                      setTemp((t) => Math.min(t + 1, 55));
                      handleRiskAssessment();
                    }}
                    title={isHindi ? 'तापमान बढ़ाएं' : 'Increase Temp'}
                    aria-label="Increase Temperature"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Humidity Control */}
              <div className="sensor-row">
                <div className="sensor-info">
                  <span className="sensor-icon">💧</span>
                  <span className="sensor-label">
                    {isHindi ? 'आर्द्रता' : 'Humd'}: {humd}%
                  </span>
                </div>
                <div className="sensor-actions">
                  <button
                    type="button"
                    className="adjust-btn minus"
                    onClick={() => {
                      setHumd((h) => Math.max(h - 2, 10));
                      handleRiskAssessment();
                    }}
                    title={isHindi ? 'आर्द्रता घटाएं' : 'Decrease Humidity'}
                    aria-label="Decrease Humidity"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="adjust-btn plus"
                    onClick={() => {
                      setHumd((h) => Math.min(h + 2, 100));
                      handleRiskAssessment();
                    }}
                    title={isHindi ? 'आर्द्रता बढ़ाएं' : 'Increase Humidity'}
                    aria-label="Increase Humidity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Heart Rate Control */}
              <div className="sensor-row">
                <div className="sensor-info">
                  <span className="sensor-icon">💖</span>
                  <span className="sensor-label">
                    {isHindi ? 'हृदय गति' : 'HR'}: {hr} bpm
                  </span>
                </div>
                <div className="sensor-actions">
                  <button
                    type="button"
                    className="adjust-btn minus"
                    onClick={() => {
                      setHr((r) => Math.max(r - 3, 45));
                      handleRiskAssessment();
                    }}
                    title={isHindi ? 'हृदय गति घटाएं' : 'Decrease HR'}
                    aria-label="Decrease Heart Rate"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="adjust-btn plus"
                    onClick={() => {
                      setHr((r) => Math.min(r + 3, 190));
                      handleRiskAssessment();
                    }}
                    title={isHindi ? 'हृदय गति बढ़ाएं' : 'Increase HR'}
                    aria-label="Increase Heart Rate"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* RISK ASSESSMENT Action Button */}
            <button
              type="button"
              className={`risk-assess-action-btn ${isAssessing ? 'pulsing' : ''}`}
              onClick={handleRiskAssessment}
              title={isHindi ? 'जोखिम विश्लेषण चलाएं' : 'Run AI Risk Assessment'}
            >
              {isAssessing
                ? isHindi
                  ? 'मूल्यांकन जारी है...'
                  : 'ASSESSING...'
                : isHindi
                ? 'जोखिम मूल्यांकन'
                : 'RISK ASSESSMENT'}
            </button>

            {/* Flow Direction Indicator */}
            <div className="flow-arrow-down" aria-hidden="true">
              ↓
            </div>

            {/* Risk Badge Output */}
            <div
              className="risk-badge-output"
              style={{
                backgroundColor: decision.badgeBg,
                borderColor: `${decision.badgeColor}55`
              }}
              onClick={handleRiskAssessment}
              role="status"
              aria-live="polite"
            >
              <span
                className="badge-sphere-dot"
                style={{
                  background: decision.badgeColor,
                  boxShadow: `0 0 10px ${decision.badgeColor}`
                }}
              ></span>
              <span className="badge-name" style={{ color: decision.badgeColor }}>
                {decision.riskBadge}
              </span>
            </div>

            {/* Quick Reset / Live Sync Footer */}
            <div className="ai-decision-footer">
              <button
                type="button"
                className="live-sync-btn"
                onClick={handleResetToLive}
                title={isHindi ? 'डिफ़ॉल्ट मानों पर रीसेट करें' : 'Reset to default test values'}
              >
                <i className="fa-solid fa-arrows-rotate"></i>
                <span>{isHindi ? 'मान रीसेट करें' : 'Reset / Live Sync'}</span>
              </button>
              {lastAssessedTime && (
                <span className="last-assessed-label">
                  {isHindi ? `जांचा: ${lastAssessedTime}` : `Checked: ${lastAssessedTime}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Secondary Health & Safety Modules (Risk Timeline, Strain, Hospital, Chemical Safety) */}
      <div className="safety-submodules-grid">
        {/* Left Sub-Card: Risk Timeline & Physical Strain Dashboard */}
        <div className="submodule-card navy-panel left-panel">
          {/* Section A: Risk Timeline */}
          <div className="risk-timeline-section">
            <div className="submodule-header-row">
              <span className="submodule-title">
                {isHindi ? 'जोखिम समयरेखा' : 'RISK TIMELINE'}
              </span>
              <span className="pulse-graph-icon" title="Physiological ECG Monitor">
                <svg width="22" height="16" viewBox="0 0 24 16" fill="none" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 8h4l3-6 4 12 4-8 3 4h4" />
                </svg>
              </span>
            </div>

            <div className="timeline-items-grid">
              {/* Point 1: 4 Hours ago (e.g. 20:39) */}
              <div className="timeline-item">
                <div className="timeline-timestamp">{timeMinus4h || '20:39'}</div>
                <div className="timeline-bar-caution"></div>
                <div className="timeline-status-label caution-label">
                  {isHindi ? 'सावधानी' : 'Caution'}
                </div>
              </div>

              {/* Point 2: 2 Hours ago (e.g. 22:39) */}
              <div className="timeline-item">
                <div className="timeline-timestamp">{timeMinus2h || '22:39'}</div>
                <div className="timeline-bar-caution"></div>
                <div className="timeline-status-label caution-label">
                  {isHindi ? 'सावधानी' : 'Caution'}
                </div>
              </div>

              {/* Point 3: Now (00:39 Now) - Dynamic */}
              <div className="timeline-item">
                <div className="timeline-timestamp current-time">
                  {timeNow || '00:39'} {isHindi ? '(वर्तमान)' : '(Now)'}
                </div>
                <div
                  className={`timeline-pill-now ${
                    decision.level === 'safe'
                      ? 'pill-safe'
                      : decision.level === 'caution'
                      ? 'pill-caution'
                      : 'pill-danger'
                  }`}
                ></div>
                <div
                  className="timeline-status-label"
                  style={{ color: decision.statusColor, fontWeight: 700 }}
                >
                  {decision.timelineLabel}
                </div>
              </div>
            </div>
          </div>

          <div className="submodule-divider"></div>

          {/* Section B: Physical Strain Dashboard */}
          <div className="physical-strain-section">
            <div className="submodule-header-row">
              <span className="submodule-title">
                {isHindi ? 'शारीरिक तनाव डैशबोर्ड' : 'PHYSICAL STRAIN DASHBOARD'}
              </span>
            </div>

            <div className="strain-metrics-grid">
              {/* Calories Burned Card */}
              <div className="strain-metric-card">
                <div className="strain-card-label">
                  {isHindi ? 'कैलोरी जली' : 'Calories Burned'}
                </div>
                <div className="strain-card-value-row">
                  <span className="strain-val-num">{caloriesBurned.toLocaleString()}</span>
                  <span className="strain-val-unit">kcal</span>
                </div>
              </div>

              {/* Sun Exposure Card */}
              <div className="strain-metric-card">
                <div className="strain-card-label">
                  {isHindi ? 'धूप का समय' : 'Sun Exposure'}
                </div>
                <div className="strain-card-value-row">
                  <span className="strain-val-num sun-amber">{sunExposureHrs.toFixed(1)}</span>
                  <span className="strain-val-unit">hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sub-Column: Nearest Hospital & Chemical Exposure Safety */}
        <div className="submodule-right-column">
          {/* Top Card: Nearest Hospital Auto-Routed */}
          <div className="submodule-card navy-panel hospital-card">
            <div className="hospital-header-row">
              <span className="submodule-title">
                {isHindi ? 'निकटतम अस्पताल' : 'NEAREST HOSPITAL'}
              </span>
              <span className="auto-routed-badge">
                {isHindi ? 'ऑटो-रूटेड' : 'AUTO-ROUTED'}
              </span>
            </div>

            <div className="hospital-content-row">
              <div
                className="hospital-info-box"
                onClick={handleToggleOrOpenDirections}
                style={{ cursor: 'pointer' }}
                title={isHindi ? 'गूगल मैप्स में अस्पताल का मार्ग खोलें' : 'Open Hospital Route in Google Maps'}
              >
                <h3 className="hospital-name-heading">
                  {isHindi ? hospital.nameHi || hospital.name : hospital.name}
                </h3>
                <div className="hospital-meta-details">
                  <span>{hospital.distKm} km {isHindi ? 'दूर' : 'away'}</span>
                  <span className="meta-dot">•</span>
                  <span>{isHindi ? `लगभग ${hospital.etaMins} मिनट` : `Approx ${hospital.etaMins} mins`}</span>
                  <span className="meta-dot">•</span>
                  <span>{isHindi ? 'एंबुलेंस: 108' : `Ambulance: ${hospital.ambulance}`}</span>
                </div>
              </div>

              {/* Map Pin Button (Directly opens Google Maps & toggles live map) */}
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleToggleOrOpenDirections}
                className="hospital-pin-btn"
                title={isHindi ? 'गूगल मैप्स में अस्पताल का मार्ग खोलें' : 'Open Hospital Navigation in Google Maps'}
                aria-label="Open Hospital Navigation in Google Maps"
              >
                <i className="fa-solid fa-location-dot"></i>
              </a>
            </div>

            {/* Action Buttons */}
            <div className="hospital-actions-row">
              <a
                href="tel:108"
                onClick={handleCall108}
                className="hospital-btn call-108-btn"
                title="Call 108 Emergency Ambulance"
              >
                <i className="fa-solid fa-phone"></i>
                <span>{isHindi ? '108 पर कॉल करें' : 'Call 108'}</span>
              </a>

              {/* Directions Button: Directly launches Google Maps turn-by-turn routing */}
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleToggleOrOpenDirections}
                className="hospital-btn directions-btn"
                title={isHindi ? 'गूगल मैप्स में दिशा-निर्देश खोलें' : 'Open Turn-by-Turn GPS Directions in Google Maps'}
              >
                <i className="fa-solid fa-compass"></i>
                <span>{isHindi ? 'दिशा-निर्देश' : 'Directions'}</span>
              </a>
            </div>

            {/* Live Interactive Embedded Route & Navigation Panel */}
            {showEmbeddedDirections && (
              <div className="hospital-embedded-route-panel">
                <div className="embedded-route-header">
                  <div className="route-header-left">
                    <i className="fa-solid fa-route" style={{ color: '#38bdf8' }}></i>
                    <span className="route-header-title">
                      {isHindi ? 'लाइव जीपीएस नेविगेशन मार्ग' : 'Live GPS Route Guidance'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="embedded-close-btn"
                    onClick={() => setShowEmbeddedDirections(false)}
                    title="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Embedded Live Map Viewport */}
                <div className="embedded-map-container">
                  <iframe
                    title="Hospital Navigation Map"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${hospital.lon - 0.04}%2C${hospital.lat - 0.025}%2C${hospital.lon + 0.04}%2C${hospital.lat + 0.025}&layer=mapnik&marker=${hospital.lat}%2C${hospital.lon}`}
                    className="embedded-map-iframe"
                    loading="lazy"
                  ></iframe>
                  <div className="map-overlay-badge">
                    <span>🏥 {hospital.name} ({hospital.distKm} km • ~{hospital.etaMins} mins)</span>
                  </div>
                </div>

                {/* Turn-by-Turn GPS Navigation Steps */}
                <div className="embedded-steps-list">
                  {hospital.steps &&
                    hospital.steps.map((step, idx) => (
                      <div className="embedded-step-row" key={idx}>
                        <span className="step-idx">{idx + 1}</span>
                        <div className="step-desc">
                          <span className="step-dist-tag">{step.dist}</span>
                          <span className="step-text-val">{isHindi ? step.textHi : step.text}</span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Bottom Launch & Copy Actions */}
                <div className="embedded-actions-bar">
                  <a
                    href={googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="launch-gmaps-btn"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    <span>{isHindi ? 'गूगल मैप्स ऐप में खोलें' : 'Open in Google Maps App'}</span>
                  </a>

                  <button
                    type="button"
                    className="copy-coords-btn"
                    onClick={handleCopyCoords}
                    title="Copy Hospital Coordinates"
                  >
                    <i className={`fa-solid ${copiedCoords ? 'fa-check' : 'fa-copy'}`}></i>
                    <span>{copiedCoords ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : `${hospital.lat.toFixed(4)}, ${hospital.lon.toFixed(4)}`}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Card: Chemical Exposure Safety */}
          <div className="submodule-card amber-panel chemical-card">
            <div className="chemical-header-row">
              <div className="chemical-title-wrap">
                <span className="flask-icon">🧪</span>
                <span className="chemical-title-text">
                  {isHindi ? 'रासायनिक जोखिम सुरक्षा' : 'CHEMICAL EXPOSURE SAFETY'}
                </span>
              </div>
              <span className="wind-vapor-icon" title="Aerosol & Vapor Dispersion">
                <svg width="26" height="18" viewBox="0 0 24 16" fill="none" stroke="#5d4930" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M2 4h12a3 3 0 1 1-3 3" />
                  <path d="M2 9h16a3 3 0 1 0-3-3" />
                  <path d="M2 14h8a2.5 2.5 0 1 1-2.5 2.5" />
                </svg>
              </span>
            </div>

            <p className="chemical-log-desc">
              {isHindi
                ? `आपने कल शाम 4:30 बजे कीटनाशक छिड़काव सत्र लॉग किया था (${sprayChemical})।`
                : `You logged a pesticide spraying session ${sprayLoggedTime} (${sprayChemical}).`}
            </p>

            <div className="rei-status-box">
              <div className="rei-label">
                {isHindi ? 'पुनः प्रवेश अंतराल (REI)' : 'Re-entry Interval (REI)'}
              </div>
              <div className={`rei-status-value ${isReiSafe ? 'rei-safe' : 'rei-restricted'}`}>
                {isReiSafe ? (
                  <>
                    <span className="rei-check">✓</span>
                    <span>
                      {isHindi
                        ? `पुनः प्रवेश सुरक्षित (${sprayHoursAgo}h पूर्ण)`
                        : `Safe to Re-enter (${sprayHoursAgo}h passed)`}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="rei-warning">⚠️</span>
                    <span>
                      {isHindi
                        ? `प्रवेश प्रतिबंधित (${24 - sprayHoursAgo}h शेष)`
                        : `Restricted Entry (${24 - sprayHoursAgo}h remaining)`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Hospital Emergency Directions & GPS Routing Modal */}
      {showDirectionsModal && (
        <div className="hospital-modal-backdrop" onClick={() => setShowDirectionsModal(false)}>
          <div className="hospital-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="hospital-modal-header">
              <div className="modal-header-left">
                <span className="modal-header-icon">🏥</span>
                <div>
                  <h3 className="modal-title">
                    {isHindi ? 'अस्पताल नेविगेशन एवं आपातकालीन मार्ग' : 'Hospital Emergency Navigation & GPS Route'}
                  </h3>
                  <span className="modal-subtitle">
                    {isHindi ? 'खेत से निकटतम स्वास्थ्य केंद्र तक का सीधा मार्ग' : 'Auto-routed from active field coordinates to nearest medical facility'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowDirectionsModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="hospital-modal-body">
              {/* Top Hospital Info Card */}
              <div className="modal-hospital-summary-card">
                <div className="summary-main-info">
                  <h4 className="summary-hospital-title">
                    {isHindi ? hospital.nameHi || hospital.name : hospital.name}
                  </h4>
                  <p className="summary-address">
                    <i className="fa-solid fa-location-dot" style={{ color: '#38bdf8', marginRight: '6px' }}></i>
                    {isHindi ? hospital.addressHi || hospital.address : hospital.address}
                  </p>
                </div>
                <div className="summary-badges-row">
                  <div className="summary-stat-badge">
                    <span className="stat-label">{isHindi ? 'दूरी' : 'Distance'}</span>
                    <span className="stat-val">{hospital.distKm} km</span>
                  </div>
                  <div className="summary-stat-badge">
                    <span className="stat-label">{isHindi ? 'अनुमानित समय' : 'Est. ETA'}</span>
                    <span className="stat-val">~{hospital.etaMins} mins</span>
                  </div>
                  <div className="summary-stat-badge green">
                    <span className="stat-label">{isHindi ? 'मार्ग स्थिति' : 'Traffic'}</span>
                    <span className="stat-val">{isHindi ? '🟢 सामान्य' : '🟢 Clear Route'}</span>
                  </div>
                </div>
              </div>

              {/* Turn-by-Turn GPS Step Navigation */}
              <div className="modal-steps-container">
                <h5 className="steps-heading">
                  <i className="fa-solid fa-route" style={{ color: '#818cf8', marginRight: '8px' }}></i>
                  {isHindi ? 'चरण-दर-चरण नेविगेशन मार्ग' : 'Turn-by-Turn Navigation Steps'}
                </h5>
                <div className="steps-list">
                  {hospital.steps && hospital.steps.map((step, idx) => (
                    <div className="step-item" key={idx}>
                      <div className="step-num-bubble">{idx + 1}</div>
                      <div className="step-content">
                        <div className="step-dist">{step.dist}</div>
                        <div className="step-text">{isHindi ? step.textHi : step.text}</div>
                      </div>
                    </div>
                  ))}
                  <div className="step-item arrival">
                    <div className="step-num-bubble arrival-bubble">🏥</div>
                    <div className="step-content">
                      <div className="step-dist">{isHindi ? 'गंतव्य' : 'Destination'}</div>
                      <div className="step-text arrival-text">
                        {isHindi ? `${hospital.nameHi || hospital.name} आपातकालीन वार्ड` : `${hospital.name} Emergency & Trauma Care Unit`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Coordination Desk & Dispatch */}
              <div className="modal-emergency-contacts-row">
                <div className="contact-box">
                  <span className="contact-title">{isHindi ? 'राष्ट्रीय एम्बुलेंस सेवा' : 'National Ambulance Service'}</span>
                  <a href="tel:108" className="contact-action-link ambulance-call">
                    <i className="fa-solid fa-phone-volume"></i>
                    <span>108 (24x7 Free)</span>
                  </a>
                </div>

                <div className="contact-box">
                  <span className="contact-title">{isHindi ? 'अस्पताल हेल्पडेस्क' : 'Hospital Helpdesk'}</span>
                  <a href={`tel:${hospital.emergencyDesk}`} className="contact-action-link desk-call">
                    <i className="fa-solid fa-headset"></i>
                    <span>{hospital.emergencyDesk}</span>
                  </a>
                </div>

                <div className="contact-box">
                  <span className="contact-title">{isHindi ? 'जीपीएस निर्देशांक' : 'GPS Coordinates'}</span>
                  <button type="button" className="contact-action-link copy-gps" onClick={handleCopyCoords}>
                    <i className={`fa-solid ${copiedCoords ? 'fa-check' : 'fa-copy'}`}></i>
                    <span>{copiedCoords ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : `${hospital.lat.toFixed(4)}, ${hospital.lon.toFixed(4)}`}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="hospital-modal-footer">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-action-btn maps-btn"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                <span>{isHindi ? 'गूगल मैप्स में नेविगेट करें' : 'Launch in Google Maps'}</span>
              </a>

              <a
                href="tel:108"
                className="modal-action-btn ambulance-btn"
              >
                <i className="fa-solid fa-truck-medical"></i>
                <span>{isHindi ? '108 एम्बुलेंस बुलाएं' : 'Dispatch 108 Ambulance'}</span>
              </a>

              <button
                type="button"
                className="modal-action-btn close-action-btn"
                onClick={() => setShowDirectionsModal(false)}
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartFarmAiSafety;
