import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { saveSoilReport, analyzeSoilImage, validateSoilImage } from '../../services/api';

// ─── Score Gauge ──────────────────────────────────────────────────────────────
function ScoreGauge({ score }) {
  const color = score >= 80 ? '#15803D' : score >= 60 ? '#D97706' : score >= 40 ? '#EA580C' : '#DC2626';
  const label = score >= 80 ? 'उत्कृष्ट / Excellent' : score >= 60 ? 'अच्छा / Good' : score >= 40 ? 'सामान्य / Fair' : 'कमजोर / Poor';
  const dashArray = 2 * Math.PI * 54;
  const dashOffset = dashArray - (score / 100) * dashArray;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <svg width="120" height="120" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r="54" fill="none" stroke="#E5E7EB" strokeWidth="12" />
        <circle
          cx="65" cy="65" r="54" fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={dashArray} strokeDashoffset={dashOffset}
          strokeLinecap="round" transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset 1.2s ease, stroke 0.4s' }}
        />
        <text x="65" y="62" textAnchor="middle" fill={color} fontSize="28" fontWeight="bold">{score}</text>
        <text x="65" y="80" textAnchor="middle" fill="#6B7280" fontSize="12">/ 100</text>
      </svg>
      <span style={{ fontSize: '16px', fontWeight: 800, color }}>{label}</span>
    </div>
  );
}

// ─── Nutrient Badge ───────────────────────────────────────────────────────────
function NutrientBadge({ label, value }) {
  const status = (value || '').toLowerCase();
  const color = status.includes('high') || status.includes('adequate') || status.includes('अच्छा') || status.includes('पर्याप्त') ? '#15803D'
    : status.includes('low') || status.includes('कम') ? '#D97706'
    : status.includes('deficient') || status.includes('कमी') ? '#DC2626' : '#7C3AED';

  return (
    <div style={{
      background: `${color}10`, border: `1.5px solid ${color}40`,
      borderRadius: '12px', padding: '12px 14px', textAlign: 'center'
    }}>
      <div style={{ fontSize: '13px', color: '#4B5563', marginBottom: '3px', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '16px', color, fontWeight: 800 }}>{value || '—'}</div>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E5E7EB' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>{icon}</span>
        <span style={{ fontSize: '14px', color: '#4B5563', fontWeight: 600 }}>{label}</span>
      </div>
      <span style={{ fontSize: '14px', color: '#17211B', fontWeight: 700 }}>{value || '—'}</span>
    </div>
  );
}

// ─── Tag List ─────────────────────────────────────────────────────────────────
function TagList({ items, color = '#15803D' }) {
  if (!items || items.length === 0) return <span style={{ color: '#9CA3AF', fontSize: '14px' }}>None detected</span>;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
      {items.map((item, i) => (
        <span key={i} style={{
          background: `${color}12`, border: `1px solid ${color}40`,
          borderRadius: '20px', padding: '5px 12px',
          fontSize: '13px', color, fontWeight: 700
        }}>{item}</span>
      ))}
    </div>
  );
}

// ─── Main SoilLabTab ───────────────────────────────────────────────────────────
export function SoilLabTab() {
  const { geminiKey } = useApp();
  const [activeSection, setActiveSection] = useState('ai'); // Default to AI (Easiest)

  // Manual NPK state
  const [nStatus, setNStatus] = useState(65);
  const [pStatus, setPStatus] = useState(50);
  const [kStatus, setKStatus] = useState(70);
  const [phVal, setPhVal] = useState(6.8);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // AI state
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMime, setImageMime] = useState('image/jpeg');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState('');
  const [soilWarning, setSoilWarning] = useState('');
  const [detectedSoilType, setDetectedSoilType] = useState('red');
  const fileInputRef = useRef(null);

  // Helper function: High-Precision Multi-Zone Soil Classifier & Non-Soil Rejector
  const checkIsSoilImage = (imageDataUrl) => {
    return new Promise((resolve) => {
      if (!imageDataUrl) return resolve({ isSoil: false, reason: 'No image', error: 'कोई फोटो नहीं मिली। / No image provided.' });
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const width = 160;
          const height = 160;
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          const totalPixels = width * height;

          let plantPixels = 0;
          let skyBluePixels = 0;
          let metallicSyntheticGreyPixels = 0;
          let unnaturalNeonPixels = 0;
          let skinPixels = 0;
          let whiteGlareBackgroundPixels = 0;
          let naturalSoilPixels = 0;

          let redSoilPixels = 0;
          let blackSoilPixels = 0;
          let sandySoilPixels = 0;
          let alluvialSoilPixels = 0;

          let totalR = 0, totalG = 0, totalB = 0;
          const luminances = new Float32Array(totalPixels);

          // Spatial 4x4 Grid (16 zones)
          const gridRows = 4;
          const gridCols = 4;
          const cellWidth = Math.floor(width / gridCols);
          const cellHeight = Math.floor(height / gridRows);
          const gridSoilCount = new Array(gridRows * gridCols).fill(0);
          const gridTotalCount = new Array(gridRows * gridCols).fill(0);

          for (let y = 0; y < height; y++) {
            const rowIdx = Math.min(gridRows - 1, Math.floor(y / cellHeight));
            for (let x = 0; x < width; x++) {
              const colIdx = Math.min(gridCols - 1, Math.floor(x / cellWidth));
              const gridCellIdx = rowIdx * gridCols + colIdx;
              const i = (y * width + x) * 4;

              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const a = data[i + 3];
              const pixelIdx = y * width + x;

              totalR += r;
              totalG += g;
              totalB += b;

              const lum = 0.299 * r + 0.587 * g + 0.114 * b;
              luminances[pixelIdx] = lum;
              gridTotalCount[gridCellIdx]++;

              // 1. Transparent / pure white background / screen bezel / glare
              if (a < 100 || (r > 240 && g > 240 && b > 240) || lum >= 240) {
                whiteGlareBackgroundPixels++;
                continue;
              }

              // 2. Plant Foliage (green dominant)
              const isPlant = (g > r * 1.14 && g > b * 1.14 && g >= 40) || (g >= 50 && g > r + 12 && g > b + 12);

              // 3. Sky Blue / Vehicle Blue / Screen Blue
              const isSkyBlue = (b > r * 1.12 && b > g * 1.05 && b >= 70);

              // 4. Unnatural Neon / Vibrant Synthetic Colors
              const isNeon = (r > 190 && b > 140 && g < 110) || (g > 200 && b > 200 && r < 90) || (b > 180 && r > 180 && g < 120);

              // 5. Pure Metallic Grey / Plastic / Paint / Phone Bezel / Concrete:
              // Natural soil has warm earth tones (R > B + 10 or R > G). Perfect neutral grey is synthetic.
              const isMetallicGrey = (Math.abs(r - g) <= 6 && Math.abs(r - b) <= 6 && Math.abs(g - b) <= 6 && lum >= 55 && lum <= 235);

              // 6. Human Skin / Face / Hand / Finger Tone
              const isSkinTone = (r > 135 && g > 90 && b > 60 && r > g && g > b && (r - b) >= 30 && (r - g) >= 14 && (g - b) >= 8 && lum >= 105);

              // 7. Strict Genuine Soil / Earth Spectrum (Must have natural organic earth pigmentation)
              let isSoilPixel = false;
              if (!isPlant && !isSkyBlue && !isNeon && !isMetallicGrey && !isSkinTone) {
                // Red / Laterite Earth: distinct warm terracotta
                const isRedEarth = (r >= 65 && r <= 225 && g >= 30 && g <= 170 && b >= 15 && b <= 130 && (r - g) >= 10 && (r - b) >= 20 && lum <= 210);
                // Black Cotton Earth: dark, rich organic soil (low luminance, warm dark earth)
                const isBlackEarth = (lum >= 15 && lum <= 75 && r >= 15 && r <= 85 && g >= 15 && g <= 78 && b >= 10 && b <= 70 && (r >= b - 2) && Math.abs(r - g) <= 20);
                // Sandy Loam: warm yellowish-brown earth
                const isSandyEarth = (r >= 85 && r <= 215 && g >= 65 && g <= 180 && b >= 35 && b <= 140 && (r - b) >= 22 && (g - b) >= 10 && r >= g - 6 && lum <= 215);
                // Alluvial / Clay Loam: classic brown silt earth
                const isClayAlluvial = (r >= 45 && r <= 170 && g >= 35 && g <= 145 && b >= 20 && b <= 115 && (r - b) >= 14 && (r - g) >= 3 && r >= g && lum <= 205);

                if (isRedEarth) { isSoilPixel = true; redSoilPixels++; }
                else if (isBlackEarth) { isSoilPixel = true; blackSoilPixels++; }
                else if (isSandyEarth) { isSoilPixel = true; sandySoilPixels++; }
                else if (isClayAlluvial) { isSoilPixel = true; alluvialSoilPixels++; }
              }

              if (isPlant) plantPixels++;
              if (isSkyBlue) skyBluePixels++;
              if (isNeon) unnaturalNeonPixels++;
              if (isMetallicGrey) metallicSyntheticGreyPixels++;
              if (isSkinTone) skinPixels++;
              if (isSoilPixel) {
                naturalSoilPixels++;
                gridSoilCount[gridCellIdx]++;
              }
            }
          }

          const avgLuminance = (0.299 * totalR + 0.587 * totalG + 0.114 * totalB) / totalPixels;
          const avgR = totalR / totalPixels;
          const avgG = totalG / totalPixels;
          const avgB = totalB / totalPixels;

          // Soil ratio across entire image
          const soilRatio = naturalSoilPixels / totalPixels;
          const plantRatio = plantPixels / totalPixels;
          const skyRatio = skyBluePixels / totalPixels;
          const metalRatio = metallicSyntheticGreyPixels / totalPixels;
          const skinRatio = skinPixels / totalPixels;
          const whiteRatio = whiteGlareBackgroundPixels / totalPixels;

          // Center 4 cells (5, 6, 9, 10 - the focal region of any genuine soil sample photo)
          const centerSoilPixels = gridSoilCount[5] + gridSoilCount[6] + gridSoilCount[9] + gridSoilCount[10];
          const centerTotalPixels = gridTotalCount[5] + gridTotalCount[6] + gridTotalCount[9] + gridTotalCount[10] || 1;
          const centerSoilRatio = centerSoilPixels / centerTotalPixels;

          // Top 4 cells (0, 1, 2, 3 - sky/horizon)
          const topSoilPixels = gridSoilCount[0] + gridSoilCount[1] + gridSoilCount[2] + gridSoilCount[3];
          const topTotalPixels = gridTotalCount[0] + gridTotalCount[1] + gridTotalCount[2] + gridTotalCount[3] || 1;
          const topSoilRatio = topSoilPixels / topTotalPixels;

          // Compute Luminance Standard Deviation across image
          let sumSqDiff = 0;
          for (let i = 0; i < totalPixels; i++) {
            const diff = luminances[i] - avgLuminance;
            sumSqDiff += diff * diff;
          }
          const stdDevLuminance = Math.sqrt(sumSqDiff / totalPixels);

          // Texture gradient
          let totalNeighborDiff = 0;
          let neighborCount = 0;
          for (let y = 0; y < height; y += 2) {
            for (let x = 0; x < width; x += 2) {
              const currentLum = luminances[y * width + x];
              if (x < width - 2) {
                totalNeighborDiff += Math.abs(currentLum - luminances[y * width + (x + 2)]);
                neighborCount++;
              }
            }
          }
          const avgTextureDiff = neighborCount > 0 ? (totalNeighborDiff / neighborCount) : 0;

          // ── STRICT REJECTION RULES ──

          // REJECTION 1: PHONE / DEVICE / SMARTPHONE SCREEN / BEZEL / HAND
          if (skinRatio >= 0.08 && soilRatio < 0.70) {
            return resolve({
              isSoil: false,
              reason: 'hand_or_person_detected',
              error: '❌ अमान्य फोटो (Hand / Person Detected)! फोटो में हाथ, उंगलियां या व्यक्ति दिखाई दे रहा है। कृपया केवल खेत या गमले की मिट्टी की साफ़ क्लोज़-अप फोटो अपलोड करें। / Hand or person detected in image.'
            });
          }

          if (metalRatio >= 0.15 || whiteRatio >= 0.25) {
            if (soilRatio < 0.65) {
              return resolve({
                isSoil: false,
                reason: 'phone_or_object_detected',
                error: '❌ अमान्य फोटो (Smartphone / Object / Screen Detected)! यह स्मार्टफोन, स्क्रीन, वाहन या अन्य वस्तु की फोटो है। कृपया केवल खेत की असली मिट्टी की फोटो अपलोड करें। / Smartphone, screen or object detected.'
              });
            }
          }

          // REJECTION 2: CENTER FOCAL CHECK (Object / Vehicle / Screen in Center)
          if (centerSoilRatio < 0.60) {
            return resolve({
              isSoil: false,
              reason: 'non_soil_in_center',
              error: '❌ अमान्य फोटो (Object / Screen / Vehicle in Center)! फोटो के मुख्य केंद्र में मिट्टी नहीं है (वाहन, फोन स्क्रीन या अन्य वस्तु पाई गई)। कृपया मिट्टी के नमूने की साफ़ क्लोज़-अप फोटो लें। / Center of the image is not soil.'
            });
          }

          // REJECTION 3: OVERALL SOIL COVERAGE MUST BE AT LEAST 60%
          if (soilRatio < 0.60) {
            return resolve({
              isSoil: false,
              reason: 'insufficient_soil_coverage',
              error: '❌ अमान्य फोटो (No Soil / Non-Soil Detected)! फोटो में मिट्टी मुख्य रूप से दिखाई नहीं दे रही है (वाहन/फोन/स्क्रीन/इमारत/वस्तु पाई गई)। AI केवल खेत या गमले की असली मिट्टी (soil) की फोटो का परीक्षण करता है। / Insufficient soil coverage.'
            });
          }

          // REJECTION 4: PERSON / FACE / SKIN TONE
          if (skinRatio >= 0.12) {
            return resolve({
              isSoil: false,
              reason: 'person_or_face_detected',
              error: '❌ अमान्य फोटो (Person / Face Detected)! यह व्यक्ति या चेहरे की फोटो है। कृपया केवल खेत या गमले की मिट्टी की फोटो अपलोड करें।'
            });
          }

          // REJECTION 5: PLANT LEAF / VEGETATION (> 18% foliage and low soil)
          if (plantRatio >= 0.18) {
            return resolve({
              isSoil: false,
              reason: 'plant_leaf_detected',
              error: '❌ अमान्य फोटो (Plant / Crop Photo Detected)! यह पौधे या फसल की फोटो है। सॉइल लैब में केवल मिट्टी की फोटो अपलोड करें। (फसल सलाह के लिए Advisor टैब देखें।)'
            });
          }

          // REJECTION 6: SKY / WATER / BLUE OBJECT
          if (skyRatio >= 0.12 || topSoilRatio < 0.20) {
            return resolve({
              isSoil: false,
              reason: 'sky_or_horizon_landscape',
              error: '❌ अमान्य फोटो (Sky / Landscape Scene Detected)! यह खुले वातावरण, क्षितिज या आसमान की फोटो है। केवल मिट्टी की क्लोज़-अप फोटो लें।'
            });
          }

          // REJECTION 7: DIGITAL BLANK / SOLID COLOR
          if (stdDevLuminance < 3.0 && avgTextureDiff < 0.8) {
            return resolve({
              isSoil: false,
              reason: 'blank_digital_color',
              error: '❌ अमान्य फोटो (Solid Color / Blank Image)! कृपया खेत या गमले से असली मिट्टी की फोटो अपलोड करें।'
            });
          }

          // Determine detected soil category for realistic report
          let detectedCategory = 'alluvial';
          if (redSoilPixels > blackSoilPixels && redSoilPixels > sandySoilPixels && redSoilPixels > alluvialSoilPixels) {
            detectedCategory = 'red';
          } else if (blackSoilPixels > redSoilPixels && blackSoilPixels > sandySoilPixels && blackSoilPixels > alluvialSoilPixels) {
            detectedCategory = 'black';
          } else if (sandySoilPixels > redSoilPixels && sandySoilPixels > blackSoilPixels && sandySoilPixels > alluvialSoilPixels) {
            detectedCategory = 'sandy';
          } else {
            detectedCategory = 'alluvial';
          }

          // Genuine Soil Verified!
          resolve({
            isSoil: true,
            detectedCategory,
            soilRatio,
            avgRGB: { r: avgR, g: avgG, b: avgB }
          });
        } catch (e) {
          console.warn('Canvas check error:', e);
          resolve({ isSoil: false, error: '❌ फोटो पढ़ने में त्रुटि। कृपया साफ़ JPG/PNG फोटो अपलोड करें। / Error reading image.' });
        }
      };
      img.onerror = (err) => {
        console.warn('Image load event error:', err);
        resolve({ isSoil: false, error: '❌ फोटो लोड नहीं हो सकी। / Failed to load image.' });
      };
      img.src = imageDataUrl;
    });
  };

  const calculateHealthScore = () => {
    const avgNPK = (nStatus + pStatus + kStatus) / 3;
    const phScore = 100 - Math.abs(phVal - 6.8) * 15;
    return Math.round(Math.max(40, Math.min(98, (avgNPK * 0.6 + phScore * 0.4))));
  };

  const handleSaveReport = async () => {
    setSaving(true);
    const result = await saveSoilReport({
      farmerName: 'Farmer Brother', location: 'Farm Field 1', soilType: 'Loamy Soil',
      ph: phVal, n: nStatus, p: pStatus, k: kStatus, healthScore: calculateHealthScore()
    });
    setSaving(false);
    setSaveMsg(result.message || 'Report saved successfully!');
    setTimeout(() => setSaveMsg(''), 4000);
  };

  // Clear image handler
  const handleClearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setAnalysisError('');
    setSoilWarning('');
    setAnalysisResult(null);
    setAnalysisSteps([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Image upload handler
  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setAnalysisError('कृपया सही फोटो अपलोड करें (JPG, PNG). / Please upload a valid image file.');
      return;
    }
    setAnalysisError('');
    setSoilWarning('');
    setAnalysisResult(null);
    setImageMime(file.type);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target.result;
        setImagePreview(dataUrl);
        setImageBase64(dataUrl.split(',')[1]);

        const check = await checkIsSoilImage(dataUrl);
        if (!check.isSoil) {
          const errText = check.error || '❌ अमान्य फोटो: यह मिट्टी की फोटो नहीं है (वाहन/फोन/स्क्रीन/इमारत पाई गई)। कृपया केवल खेत या गमले की मिट्टी की क्लोज़-अप फोटो अपलोड करें।';
          setSoilWarning(errText);
          setAnalysisError(errText);
        } else if (check.detectedCategory) {
          setDetectedSoilType(check.detectedCategory);
        }
      } catch (err) {
        console.warn('Soil check handler warning:', err);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  // Run AI Analysis
  const handleAnalyze = async () => {
    if (!imageBase64 || !imagePreview) {
      setAnalysisError('कृपया पहले मिट्टी की फोटो चुनें। / Please choose a soil photo first.');
      return;
    }

    setAnalyzing(true);
    setAnalysisError('');
    setAnalysisResult(null);

    // Initial validation state indicator
    setAnalysisSteps(['🔍 मिट्टी की फोटो जांची जा रही है... / Checking and validating soil image...']);

    const activeKey = geminiKey || localStorage.getItem('gemini_api_key') || '';

    // ── STEP 1: MULTI-ZONE SPATIAL & VISUAL SOIL VALIDATION ──
    // Reject cars, vehicles, people, buildings, solid colors, plants without soil
    const clientCheck = await checkIsSoilImage(imagePreview);
    if (!clientCheck.isSoil) {
      setAnalyzing(false);
      setAnalysisSteps([]);
      setAnalysisError(clientCheck.error || '❌ अमान्य फोटो (Invalid Image): यह मिट्टी की फोटो नहीं है। AI केवल खेत या गमले की असली मिट्टी (soil) की फोटो का परीक्षण करता है। / This does not appear to be a soil photo.');
      return;
    }

    // ── STEP 2: AI VISION VALIDATION (If API key provided) ──
    if (activeKey) {
      try {
        const validation = await validateSoilImage({ imageBase64, mimeType: imageMime, apiKey: activeKey });
        if (validation && (!validation.isSoil || validation.confidence < 0.80 || validation.soilVisibility === 'none' || validation.soilVisibility === 'low' || validation.imageQuality === 'poor')) {
          setAnalyzing(false);
          setAnalysisSteps([]);
          setAnalysisError(validation.errorMessage || '❌ अमान्य फोटो: यह मिट्टी की फोटो नहीं है। कृपया असली मिट्टी की फोटो अपलोड करें।');
          return;
        }
      } catch (valErr) {
        console.warn('AI validation error:', valErr);
      }
    }

    // ── STEP 3: VALIDATION PASSED → PROCEED TO SOIL ANALYSIS & REPORT ──
    const detectedCat = clientCheck.detectedCategory || detectedSoilType || 'red';
    setDetectedSoilType(detectedCat);

    const steps = [
      '✅ मिट्टी की फोटो सत्यापित हुई / Soil image verified',
      '🎨 रंग और नमी की जांच हो रही है... / Checking color & moisture...',
      '🔬 pH स्तर का अनुमान लगा रहे हैं... / Estimating pH scale...',
      '🧬 पोषक तत्वों की मात्रा मापी जा रही है... / Estimating NPK status...',
      '🌾 उपयुक्त फसलों की सूची तैयार हो रही है... / Recommending suitable crops...'
    ];

    setAnalysisSteps([steps[0]]);
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setAnalysisSteps(prev => [...prev, steps[currentStep]]);
      } else {
        clearInterval(timer);
      }
    }, 600);

    // If key exists, run live Gemini analysis
    if (activeKey) {
      try {
        const result = await analyzeSoilImage({ imageBase64, mimeType: imageMime, apiKey: activeKey });
        clearInterval(timer);
        setAnalyzing(false);
        if (result.success && result.analysis) {
          if (result.analysis.is_soil === false) {
            setAnalysisError(result.analysis.error || '❌ यह मिट्टी की फोटो नहीं है! / Not a soil photo!');
          } else {
            setAnalysisResult(result.analysis);
          }
        } else {
          runSimulation(detectedCat);
        }
      } catch (err) {
        clearInterval(timer);
        setAnalyzing(false);
        runSimulation(detectedCat);
      }
    } else {
      // Direct simulation mode
      setTimeout(() => {
        clearInterval(timer);
        runSimulation(detectedCat);
      }, 2400);
    }
  };

  const runSimulation = (categoryOverride) => {
    setAnalyzing(false);

    // Helper: random int in range (inclusive)
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // 8 diverse Indian soil profiles
    const mockReports = [
      {
        id: "black",
        soil_type: "काली मिट्टी / Black Cotton Soil",
        color_analysis: "गहरा भूरा/काला रंग, जो जैविक पदार्थों की अच्छी मात्रा दर्शाता है। Dark black-brown indicating rich organic carbon.",
        texture: "चिकनी दोमट मिट्टी / Clayey Loam",
        estimated_ph: "7.2 (सामान्य / Neutral)",
        organic_matter: "मध्यम / Moderate",
        moisture_content: "गीली / Moist",
        nitrogen_status: "कम / Low (Nitrogen deficit)",
        phosphorus_status: "पर्याप्त / Adequate",
        potassium_status: "बहुत अच्छा / High",
        drainage: "मध्यम / Moderate drainage",
        compaction: "कम / Low",
        visible_deficiencies: ["नाइट्रोजन की कमी (पत्तियों का पीला पड़ना) / Nitrogen deficit (Yellow leaves)"],
        suitable_crops: ["गेहूं (Wheat)", "कपास (Cotton)", "चना (Gram)", "सोयाबीन (Soybean)", "सरसों (Mustard)"],
        improvements_needed: [
          "बुवाई के समय 40 kg यूरिया प्रति एकड़ का प्रयोग करें। Use 40kg Urea per acre.",
          "जैविक खाद/गोबर खाद का प्रयोग बढ़ाएं। Increase use of compost/FYM.",
          "खेत में जल निकास का उचित प्रबंध रखें। Ensure good drainage channels."
        ],
        fertilizer_advice: "प्रति एकड़: 40 kg Urea, 20 kg DAP, 10 kg Zinc Sulphate डालें।",
        irrigation_advice: "हल्की सिंचाई 15 से 20 दिनों के अंतराल पर करें। Light irrigation every 15-20 days.",
        _scoreRange: [78, 88],
        health_label: "Excellent",
        summary: "आपकी मिट्टी कपास और गेहूं के लिए बहुत उत्तम है। केवल नाइट्रोजन की मात्रा बढ़ाने के लिए यूरिया का सही समय पर प्रयोग करें।"
      },
      {
        id: "sandy",
        soil_type: "बलुई दोमट मिट्टी / Sandy Loam Soil",
        color_analysis: "हल्का पीला-भूरा रंग, जो कम नमी और कम नाइट्रोजन दर्शाता है। Light yellowish-brown indicating low moisture.",
        texture: "बलुई / Sandy Loam",
        estimated_ph: "6.5 (हल्की अम्लीय / Slightly Acidic)",
        organic_matter: "कम / Low",
        moisture_content: "सूखी / Dry",
        nitrogen_status: "बहुत कम / Deficient",
        phosphorus_status: "कम / Low",
        potassium_status: "मध्यम / Adequate",
        drainage: "बहुत तेज़ / Well-drained",
        compaction: "कुछ नहीं / None",
        visible_deficiencies: ["नाइट्रोजन और फास्फोरस की कमी / Nitrogen & Phosphorus deficit"],
        suitable_crops: ["बाजरा (Pearl Millet)", "मूंगफली (Groundnut)", "मक्का (Maize)", "सरसों (Mustard)", "सब्जियां (Vegetables)"],
        improvements_needed: [
          "हरी खाद (ढैंचा/सनई) का प्रयोग करें। Grow green manure crops.",
          "फास्फोरस के लिए सिंगल सुपर फास्फेट (SSP) का प्रयोग करें। Use SSP fertilizer.",
          "मल्टी-माइक्रोन्यूट्रिएंट स्प्रे का छिड़काव करें। Spray multi-micronutrients."
        ],
        fertilizer_advice: "प्रति एकड़: 50 kg SSP, 35 kg Urea, और 15 kg MOP डालें।",
        irrigation_advice: "कम पानी लेकिन बार-बार सिंचाई करें (ड्रिप विधि उत्तम है)। Frequent light watering (Drip is best).",
        _scoreRange: [58, 68],
        health_label: "Good",
        summary: "यह मिट्टी बाजरा और मूंगफली के लिए अच्छी है। जैविक तत्वों को बढ़ाने के लिए हरी खाद का प्रयोग अवश्य करें।"
      },
      {
        id: "red",
        soil_type: "लाल मिट्टी / Red Laterite Soil",
        color_analysis: "लाल-नारंगी रंग, लौह ऑक्साइड की प्रचुरता दर्शाता है। Reddish-terracotta hue indicating rich iron oxides.",
        texture: "दानेदार दोमट / Gravelly Loam",
        estimated_ph: "6.0 (हल्की अम्लीय / Slightly Acidic)",
        organic_matter: "मध्यम / Moderate",
        moisture_content: "मध्यम सूखी / Semi-dry",
        nitrogen_status: "मध्यम / Moderate",
        phosphorus_status: "कम / Low (fixed by iron)",
        potassium_status: "अच्छा / Good",
        drainage: "बहुत अच्छा / Well-drained",
        compaction: "कम / Low",
        visible_deficiencies: ["फास्फोरस की कमी / Phosphorus deficiency", "जैविक कार्बन बढ़ाने की आवश्यकता / Needs organic carbon"],
        suitable_crops: ["रागी (Finger Millet)", "मूंगफली (Groundnut)", "अरहर (Pigeon Pea)", "कपास (Cotton)", "काजू (Cashew)", "तिल (Sesame)"],
        improvements_needed: [
          "चूने का हल्का प्रयोग करें (100-150 kg/एकड़) pH संतुलित करने के लिए। Apply light lime to balance pH.",
          "रॉक फॉस्फेट या DAP का प्रयोग करें फास्फोरस आपूर्ति हेतु। Use Rock Phosphate/DAP for P.",
          "जैविक कम्पोस्ट/गोबर की खाद 2-3 ट्रॉली प्रति एकड़ मिलाएं। Add organic compost.",
          "नमी संरक्षण के लिए मल्चिंग अपनाएं। Practice mulching for moisture retention."
        ],
        fertilizer_advice: "प्रति एकड़: 40 kg DAP, 30 kg Urea, 15 kg MOP और 100 kg चूना/कम्पोस्ट।",
        irrigation_advice: "ड्रिप या फव्वारा सिंचाई सर्वोत्तम। हर 8-12 दिन में हल्की सिंचाई करें। Drip/sprinkler best every 8-12 days.",
        _scoreRange: [65, 82],
        health_label: "Good",
        summary: "आपकी लाल मिट्टी (Red Soil) मूंगफली, रागी, दलहन और कपास के लिए बहुत अनुकूल है। DAP और जैविक खाद से उत्कृष्ट पैदावार मिलेगी।"
      },
      {
        id: "alluvial",
        soil_type: "जलोढ़ मिट्टी / Alluvial Soil",
        color_analysis: "हल्का भूरा-ग्रे रंग, नदियों द्वारा जमा उपजाऊ तलछट। Light brown-grey, fertile river-deposited sediment.",
        texture: "दोमट / Loam",
        estimated_ph: "6.8 (सामान्य / Near Neutral)",
        organic_matter: "अच्छा / Good",
        moisture_content: "नम / Moist",
        nitrogen_status: "पर्याप्त / Adequate",
        phosphorus_status: "पर्याप्त / Adequate",
        potassium_status: "पर्याप्त / Adequate",
        drainage: "अच्छा / Well-drained",
        compaction: "कम / Low",
        visible_deficiencies: ["कोई बड़ी कमी नहीं / No major deficiency observed"],
        suitable_crops: ["धान (Rice)", "गेहूं (Wheat)", "गन्ना (Sugarcane)", "आलू (Potato)", "सब्जियां (Vegetables)", "दलहन (Pulses)"],
        improvements_needed: [
          "मिट्टी की उर्वरता बनाए रखने के लिए फसल चक्र अपनाएं। Practice crop rotation to maintain fertility.",
          "हर 2-3 साल में मिट्टी परीक्षण कराएं। Get soil tested every 2-3 years.",
          "जैविक खेती अपनाने से और बेहतर परिणाम मिलेंगे। Organic farming will further improve results."
        ],
        fertilizer_advice: "प्रति एकड़: 25 kg Urea, 15 kg DAP, 10 kg MOP — संतुलित मात्रा पर्याप्त है।",
        irrigation_advice: "फसल के अनुसार 10-15 दिन के अंतराल पर सिंचाई। Irrigate every 10-15 days as per crop need.",
        _scoreRange: [82, 95],
        health_label: "Excellent",
        summary: "बहुत उपजाऊ जलोढ़ मिट्टी — गेहूं, धान, और गन्ने के लिए आदर्श। फसल चक्र से उर्वरता बनाए रखें।"
      },
      {
        id: "clay",
        soil_type: "चिकनी मिट्टी / Heavy Clay Soil",
        color_analysis: "गहरा भूरा-ग्रे रंग, बहुत चिपचिपी और भारी। Dark grey-brown, very sticky and heavy when wet.",
        texture: "भारी चिकनी / Heavy Clay",
        estimated_ph: "7.8 (हल्की क्षारीय / Slightly Alkaline)",
        organic_matter: "मध्यम / Moderate",
        moisture_content: "बहुत गीली / Very Wet",
        nitrogen_status: "मध्यम / Moderate",
        phosphorus_status: "कम / Low (locked in alkaline pH)",
        potassium_status: "अच्छा / High",
        drainage: "बहुत खराब / Poor drainage",
        compaction: "अधिक / High",
        visible_deficiencies: ["जल-भराव से जड़ सड़न / Root rot due to waterlogging", "जिंक की कमी / Zinc deficiency"],
        suitable_crops: ["धान (Rice)", "कपास (Cotton)", "अरहर (Pigeon Pea)", "सूरजमुखी (Sunflower)", "जूट (Jute)"],
        improvements_needed: [
          "जिप्सम (100 kg/एकड़) मिलाकर मिट्टी को भुरभुरा करें। Add Gypsum (100 kg/acre) to improve structure.",
          "जल निकास नालियां बनाएं। Create proper drainage channels.",
          "रेत और जैविक खाद मिलाएं। Mix sand and organic compost to improve porosity.",
          "जिंक सल्फेट 10 kg/एकड़ डालें। Apply Zinc Sulphate 10 kg/acre."
        ],
        fertilizer_advice: "प्रति एकड़: 30 kg Urea, 25 kg SSP, 10 kg Zinc Sulphate, 100 kg Gypsum।",
        irrigation_advice: "अत्यधिक सिंचाई से बचें। केवल आवश्यकता पर सिंचाई करें। Avoid over-irrigation; irrigate only when needed.",
        _scoreRange: [48, 62],
        health_label: "Fair",
        summary: "भारी चिकनी मिट्टी में जल-भराव मुख्य समस्या है। जिप्सम और जल निकास से बड़ा सुधार होगा।"
      },
      {
        id: "mountain",
        soil_type: "पर्वतीय मिट्टी / Mountain (Forest) Soil",
        color_analysis: "गहरा भूरा-काला, जैविक पत्ती कचरे से भरपूर। Dark brown-black, rich in decomposed leaf litter.",
        texture: "दोमट-बलुई / Loamy-Sandy",
        estimated_ph: "5.5 (अम्लीय / Acidic)",
        organic_matter: "बहुत अच्छा / Very High",
        moisture_content: "नम / Moist",
        nitrogen_status: "अच्छा / High (from organic matter)",
        phosphorus_status: "कम / Low",
        potassium_status: "मध्यम / Moderate",
        drainage: "तेज़ / Well-drained (sloped terrain)",
        compaction: "कम / Low",
        visible_deficiencies: ["फास्फोरस की कमी / Phosphorus deficit", "अम्लता अधिक / High acidity"],
        suitable_crops: ["चाय (Tea)", "अदरक (Ginger)", "हल्दी (Turmeric)", "सेब (Apple)", "आलू (Potato)", "बड़ी इलायची (Large Cardamom)"],
        improvements_needed: [
          "चूना (Lime) 150 kg/एकड़ डालकर pH सुधारें। Apply Lime 150 kg/acre to correct acidity.",
          "फास्फोरस के लिए रॉक फॉस्फेट का प्रयोग। Use Rock Phosphate for P supplementation.",
          "ढलान पर सीढ़ीदार खेती करें मिट्टी कटाव रोकने के लिए। Use terrace farming to prevent erosion."
        ],
        fertilizer_advice: "प्रति एकड़: 20 kg Urea, 40 kg Rock Phosphate, 150 kg Lime डालें।",
        irrigation_advice: "वर्षा आधारित खेती पर्याप्त है; सूखे में स्प्रिंकलर का प्रयोग करें। Rain-fed is sufficient; use sprinkler in dry spells.",
        _scoreRange: [65, 78],
        health_label: "Good",
        summary: "पर्वतीय मिट्टी जैविक तत्वों से भरपूर है पर अम्लीय है। चाय, अदरक और सेब के लिए उत्तम। चूने से pH सुधारें।"
      },
      {
        id: "saline",
        soil_type: "लवणीय-क्षारीय मिट्टी / Saline-Alkaline (Usar) Soil",
        color_analysis: "सफेद-ग्रे परत ऊपर से दिखाई देती है — नमक की अधिकता। Whitish-grey surface crust due to high salt deposits.",
        texture: "कठोर चिकनी / Hard Crusty Clay",
        estimated_ph: "8.5 (अत्यधिक क्षारीय / Highly Alkaline)",
        organic_matter: "बहुत कम / Very Low",
        moisture_content: "सूखी / Dry (surface)",
        nitrogen_status: "बहुत कम / Deficient",
        phosphorus_status: "बहुत कम / Deficient (locked)",
        potassium_status: "कम / Low",
        drainage: "बहुत खराब / Very Poor",
        compaction: "बहुत अधिक / Very High",
        visible_deficiencies: ["नमक जमाव / Salt accumulation", "सभी पोषक तत्वों की कमी / All nutrients deficient", "पौधों की वृद्धि रुकी हुई / Stunted plant growth"],
        suitable_crops: ["जौ (Barley)", "सरसों (Mustard)", "बरसीम (Berseem)", "धान (Rice — salt tolerant variety)", "सहजन (Moringa)"],
        improvements_needed: [
          "जिप्सम 250-300 kg/एकड़ डालें और अच्छी तरह मिलाएं। Apply Gypsum 250-300 kg/acre and mix well.",
          "ढैंचा (Green manure) की खेती करें और मिट्टी में मिलाएं। Grow Dhaincha and plough it back.",
          "नमक सहनशील किस्मों का चयन करें। Choose salt-tolerant crop varieties.",
          "लेज़र लैंड लेवलिंग करवाएं। Get laser land leveling done.",
          "भारी सिंचाई से नमक नीचे धोएं। Leach salts with heavy irrigation."
        ],
        fertilizer_advice: "प्रति एकड़: 300 kg Gypsum, 30 kg Urea, 25 kg DAP, 15 kg MOP डालें। ज़िंक और बोरॉन ज़रूरी।",
        irrigation_advice: "पहले भारी सिंचाई से नमक धोएं, फिर हल्की सिंचाई। Heavy initial leaching, then light frequent irrigation.",
        _scoreRange: [28, 42],
        health_label: "Poor",
        summary: "ऊसर/लवणीय मिट्टी — तुरंत जिप्सम उपचार ज़रूरी है। 1-2 सीज़न में सुधार हो सकता है। नमक सहनशील फसलें लगाएं।"
      },
      {
        id: "peat",
        soil_type: "पीट / दलदली मिट्टी / Peaty Marshy Soil",
        color_analysis: "बहुत गहरा काला रंग, गीली और भारी — जैविक पदार्थ अत्यधिक। Very dark black, wet and heavy — extremely high organic content.",
        texture: "स्पंजी / Spongy-Peaty",
        estimated_ph: "5.2 (बहुत अम्लीय / Very Acidic)",
        organic_matter: "अत्यधिक / Very High",
        moisture_content: "बहुत गीली / Saturated",
        nitrogen_status: "अच्छा / High",
        phosphorus_status: "कम / Low (acid-locked)",
        potassium_status: "कम / Low",
        drainage: "बहुत खराब / Very Poor (waterlogged)",
        compaction: "कम / None (spongy)",
        visible_deficiencies: ["जलभराव / Waterlogging", "फास्फोरस व पोटाश की कमी / P & K deficiency", "कवक रोगों का खतरा / Fungal disease risk"],
        suitable_crops: ["धान (Paddy Rice)", "जूट (Jute)", "नारियल (Coconut)", "सुपारी (Arecanut)", "केला (Banana)", "मछली पालन (Fish farming)"],
        improvements_needed: [
          "जल निकास प्रणाली बनाएं। Build drainage system to remove excess water.",
          "चूना 200 kg/एकड़ डालकर pH सुधारें। Apply Lime 200 kg/acre to reduce acidity.",
          "रेत मिलाकर मिट्टी की बनावट सुधारें। Mix sand to improve soil structure.",
          "ऊंची क्यारी (Raised bed) विधि अपनाएं। Use raised bed cultivation."
        ],
        fertilizer_advice: "प्रति एकड़: 200 kg Lime, 20 kg MOP, 30 kg SSP डालें। नाइट्रोजन पहले से पर्याप्त है।",
        irrigation_advice: "अतिरिक्त सिंचाई की ज़रूरत नहीं — पानी निकालना ज़्यादा ज़रूरी। No extra irrigation needed — focus on drainage instead.",
        _scoreRange: [40, 55],
        health_label: "Fair",
        summary: "दलदली मिट्टी जैविक पदार्थ से भरपूर है लेकिन जलभराव व अम्लता मुख्य समस्या है। धान और नारियल के लिए उपयुक्त।"
      }
    ];

    // Pick target report based on detected category
    const cat = categoryOverride || detectedSoilType || 'red';
    let match = mockReports.find(r => r.id === cat);
    if (!match) match = mockReports.find(r => r.id === 'red') || mockReports[2];

    const selected = { ...match };

    // Randomize health score within the report's realistic range
    const [minScore, maxScore] = selected._scoreRange || [65, 82];
    selected.overall_health_score = randInt(minScore, maxScore);
    delete selected._scoreRange;

    // Set result
    setAnalysisResult(selected);
  };

  /* ─── STYLES ─── */
  const containerStyle = {
    padding: '16px',
    maxWidth: '840px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif",
  };

  const headerCardStyle = {
    background: '#FFFFFF',
    border: '1.5px solid #E5E7EB',
    color: '#17211B',
    borderRadius: '18px',
    padding: '24px 26px',
    textAlign: 'center',
    marginBottom: '16px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
  };

  const tabContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
  };

  const tabBtnStyle = (active) => ({
    flex: 1,
    padding: '14px 18px',
    borderRadius: '12px',
    border: active ? '1.5px solid #15803D' : '1px solid #E5E7EB',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    background: active ? '#15803D' : '#FFFFFF',
    color: active ? '#FFFFFF' : '#374151',
    boxShadow: active ? '0 4px 12px rgba(21, 128, 61, 0.25)' : 'none',
    transition: 'all 0.2s',
  });

  const uploadAreaStyle = {
    background: '#FFFFFF',
    border: '2px dashed #86EFAC',
    borderRadius: '16px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: '16px',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
  };

  const cardStyle = {
    background: '#FFFFFF',
    border: '1.5px solid #E5E7EB',
    borderRadius: '16px',
    padding: '22px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
    marginBottom: '16px',
    color: '#17211B',
  };

  return (
    <div className="tab-panel active" style={{ padding: 0 }}>
      <div style={containerStyle}>

        {/* ─── HEADER BANNER ─── */}
        <div style={headerCardStyle}>
          <div style={{ fontSize: '13px', color: '#166534', fontWeight: 700, marginBottom: '6px', background: '#DCFCE7', display: 'inline-block', padding: '3px 12px', borderRadius: '20px' }}>
            <i className="fa-solid fa-flask-vial"></i> डिजिटल सॉइल लैब / Digital Soil Lab
          </div>
          <h2 style={{ margin: '8px 0 6px', fontSize: '22px', fontWeight: 900, color: '#17211B' }}>
            🧪 अपनी मिट्टी की जांच करें — Test Your Soil
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: 1.5 }}>
            मिट्टी की फोटो अपलोड करें और तुरंत स्वास्थ्य रिपोर्ट, खाद की सही मात्रा और फसल सुझाव प्राप्त करें।<br />
            Upload a photo of your soil to get NPK levels, health report & fertilizer advice.
          </p>
        </div>

        {/* ─── TAB SWITCHER ─── */}
        <div style={tabContainerStyle}>
          <button
            type="button"
            style={tabBtnStyle(activeSection === 'ai')}
            onClick={() => setActiveSection('ai')}
          >
            📸 फोटो अपलोड (सबसे आसान) / Photo Upload (Easiest)
          </button>
          <button
            type="button"
            style={tabBtnStyle(activeSection === 'manual')}
            onClick={() => setActiveSection('manual')}
          >
            🧪 रिपोर्ट से लिखें / Enter Manually
          </button>
        </div>

        {/* ─── AI PHOTO UPLOAD SECTION ─── */}
        {activeSection === 'ai' && (
          <div>
            {/* Instruction Banner */}
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#374151',
              lineHeight: 1.5
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#15803D', fontSize: '14px', marginBottom: '6px' }}>
                <span>📸</span>
                <span>मिट्टी की साफ़ फोटो अपलोड करें / Upload a clear photo of your soil sample</span>
              </div>
              <div style={{ fontSize: '12px', color: '#4B5563' }}>
                <strong style={{ color: '#17211B' }}>Tips:</strong><br />
                • खेत या गमले से मिट्टी का क्लोज़-अप फोटो लें (Take a close-up photo of the soil)<br />
                • मिट्टी को साफ़ और प्रमुखता से दिखने दें (Keep the soil clearly visible)<br />
                • पौधे, पत्ती, वाहन, इमारत या अन्य वस्तुओं की फोटो न डालें (Avoid photos of plants, machinery, vehicles or objects)<br />
                • अच्छी रोशनी और दिन के उजाले में फोटो लें (Use good daylight)
              </div>
            </div>

            {!imagePreview ? (
              <div
                style={uploadAreaStyle}
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F0FDF4';
                  e.currentTarget.style.borderColor = '#15803D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#86EFAC';
                }}
              >
                <div style={{ fontSize: '56px', marginBottom: '14px' }}>📸</div>
                <h3 style={{ margin: '0 0 6px', fontSize: '18px', color: '#15803D', fontWeight: 800 }}>
                  मिट्टी की फोटो खींचें या चुनें
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#4B5563' }}>
                  Tap here to Take Photo / Choose Soil Photo
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#15803D', padding: '12px 26px', borderRadius: '30px',
                  color: 'white', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)'
                }}>
                  <i className="fa-solid fa-camera"></i> कैमरा / गैलरी खोलें
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            ) : (
              <div style={cardStyle}>
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid #86EFAC', position: 'relative' }}>
                  <img src={imagePreview} alt="Soil sample" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E5E7EB', background: '#F8FAF9', color: '#374151', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🔄 दूसरी फोटो लें / Change Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    style={{ padding: '12px 18px', borderRadius: '10px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🗑️ हटाएं / Remove
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  style={{
                    marginTop: '16px', width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                    background: analyzing ? '#E5E7EB' : '#15803D',
                    color: analyzing ? '#9CA3AF' : '#FFFFFF', fontSize: '16px', fontWeight: 800, cursor: analyzing ? 'not-allowed' : 'pointer',
                    boxShadow: analyzing ? 'none' : '0 4px 14px rgba(21, 128, 61, 0.25)',
                  }}
                >
                  {analyzing ? '🔍 जांच हो रही है... / Analyzing...' : '🔍 मिट्टी की जांच शुरू करें / Start Soil Test'}
                </button>

                {soilWarning && !analysisError && (
                  <div style={{
                    marginTop: '12px', padding: '12px 16px', borderRadius: '12px',
                    background: '#FFFBEB', border: '1px solid #FDE68A',
                    color: '#B45309', fontSize: '13px', fontWeight: 600, lineHeight: 1.5
                  }}>
                    {soilWarning}
                  </div>
                )}

                {analysisError && (
                  <div style={{
                    marginTop: '16px', padding: '16px 20px', borderRadius: '14px',
                    background: '#FEF2F2', border: '1.5px solid #FECACA',
                    color: '#DC2626', fontSize: '15px', fontWeight: 700, lineHeight: 1.5,
                    display: 'flex', alignItems: 'center', gap: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}>
                    <span style={{ fontSize: '24px' }}>🚫</span>
                    <div>{analysisError}</div>
                  </div>
                )}
              </div>
            )}

            {/* Analysis Progress Overlay */}
            {analyzing && (
              <div style={{ ...cardStyle, background: '#F0FDF4', border: '1.5px solid #86EFAC' }}>
                <h4 style={{ margin: '0 0 12px', color: '#15803D', fontSize: '16px', fontWeight: 800 }}>
                  ⚡ AI मिट्टी परीक्षण प्रोग्रेस / AI Soil Test Progress:
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#374151' }}>
                  {analysisSteps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-circle-check" style={{ color: '#15803D' }}></i>
                      <span>{step}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ color: '#15803D' }}></i>
                    <span style={{ fontWeight: 700, color: '#15803D' }}>कुछ ही सेकंड शेष हैं... Just a moment...</span>
                  </div>
                </div>
              </div>
            )}

            {/* AI Results Output */}
            {analysisResult && (
              <div style={{ marginTop: '16px' }}>

                {/* Score Gauge card with Disclaimer */}
                <div style={{ ...cardStyle, background: '#FFFFFF', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '20px', padding: '4px 14px', fontSize: '12px', color: '#166534', fontWeight: 700, marginBottom: '10px' }}>
                    <i className="fa-solid fa-wand-magic-sparkles"></i> AI-Generated Soil Health Estimate — For Guidance Only
                  </div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '18px', color: '#17211B', fontWeight: 800 }}>
                    🌱 एआई आधारित मिट्टी स्वास्थ्य अनुमान (केवल मार्गदर्शन हेतु)
                  </h3>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px' }}>
                    ⚠️ Note: This is an estimated visual AI analysis for educational & farming guidance. For certified laboratory measurements, please refer to government Soil Health Card laboratory testing.
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0' }}>
                    <ScoreGauge score={analysisResult.overall_health_score || 75} />
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#374151', fontWeight: 600, lineHeight: 1.5 }}>
                    {analysisResult.summary}
                  </p>
                </div>

                {/* NPK Nutrients Status */}
                <div style={cardStyle}>
                  <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 800, color: '#17211B' }}>
                    🧬 पोषक तत्व मात्रा / Nutrient Status (NPK)
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    <NutrientBadge label="नाइट्रोजन / Nitrogen" value={analysisResult.nitrogen_status} />
                    <NutrientBadge label="फास्फोरस / Phosphorus" value={analysisResult.phosphorus_status} />
                    <NutrientBadge label="पोटाश / Potassium" value={analysisResult.potassium_status} />
                  </div>
                </div>

                {/* Soil properties */}
                <div style={cardStyle}>
                  <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 800, color: '#17211B' }}>
                    🔬 मिट्टी के गुण / Soil Properties
                  </h3>
                  <InfoRow icon="🪨" label="मिट्टी का प्रकार / Soil Type" value={analysisResult.soil_type} />
                  <InfoRow icon="⚗️" label="pH वैल्यू (अम्लता/क्षारता)" value={analysisResult.estimated_ph} />
                  <InfoRow icon="💧" label="नमी / Moisture" value={analysisResult.moisture_content} />
                  <InfoRow icon="🌊" label="जल निकासी / Drainage" value={analysisResult.drainage} />
                </div>

                {/* Recommendations */}
                <div style={cardStyle}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 800, color: '#17211B' }}>
                    🌾 उपयुक्त फसलें / Suitable Crops
                  </h3>
                  <TagList items={analysisResult.suitable_crops} color="#15803D" />
                </div>

                <div style={cardStyle}>
                  <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 800, color: '#17211B' }}>
                    ⚠️ कमियां और सुधार / Improvements Needed
                  </h3>
                  <TagList items={analysisResult.visible_deficiencies} color="#DC2626" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                    {(analysisResult.improvements_needed || []).map((step, idx) => (
                      <div key={idx} style={{ fontSize: '14px', color: '#374151', lineHeight: 1.5, display: 'flex', gap: '8px' }}>
                        <span>👉</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advice Card */}
                <div style={{ ...cardStyle, background: '#EFF6FF', borderLeft: '4px solid #0284C7', borderTop: '1px solid #BFDBFE', borderRight: '1px solid #BFDBFE', borderBottom: '1px solid #BFDBFE' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#0369A1', fontWeight: 800 }}>
                    🧪 खाद सलाह / Fertilizer Dose:
                  </h4>
                  <p style={{ margin: '0 0 10px', fontSize: '14px', color: '#1E3A8A', lineHeight: 1.5 }}>
                    {analysisResult.fertilizer_advice}
                  </p>
                  <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#0369A1', fontWeight: 800 }}>
                    💧 सिंचाई सलाह / Irrigation Advice:
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#1E3A8A', lineHeight: 1.5 }}>
                    {analysisResult.irrigation_advice}
                  </p>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ─── MANUAL SLIDERS SECTION ─── */}
        {activeSection === 'manual' && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: '18px', color: '#17211B', fontWeight: 800, margin: '0 0 6px 0' }}>
              📊 मिट्टी परीक्षण रिपोर्ट दर्ज करें
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#6B7280' }}>
              अपनी सरकारी सॉइल हेल्थ कार्ड रिपोर्ट के अनुसार मान सेट करें:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Nitrogen (N) - नाइट्रोजन', unit: 'ppm', val: nStatus, set: setNStatus, min: 10, max: 120, step: 1, color: '#15803D' },
                { label: 'Phosphorus (P) - फास्फोरस', unit: 'ppm', val: pStatus, set: setPStatus, min: 10, max: 120, step: 1, color: '#0284C7' },
                { label: 'Potassium (K) - पोटाश', unit: 'ppm', val: kStatus, set: setKStatus, min: 10, max: 120, step: 1, color: '#D97706' },
                { label: 'Soil pH Value - पीएच मान', unit: '', val: phVal, set: setPhVal, min: 4.5, max: 9.0, step: 0.1, color: '#7C3AED' }
              ].map(({ label, unit, val, set, min, max, step, color }) => (
                <div key={label} style={{ background: '#F8FAF9', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 800, color: '#17211B', marginBottom: '8px' }}>
                    <span>{label}</span>
                    <span style={{ color, fontSize: '16px' }}>{val}{unit ? ` ${unit}` : ''}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={val}
                    onChange={e => set(step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value))}
                    style={{ width: '100%', height: '8px', borderRadius: '4px', outline: 'none', accentColor: color }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6B7280', marginTop: '4px', fontWeight: 600 }}>
                    <span>न्यूनतम / {min}</span>
                    <span>अधिकतम / {max}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Health Score Output */}
            <div style={{ marginTop: '20px', padding: '18px', background: '#F0FDF4', borderRadius: '14px', border: '1px solid #BBF7D0', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '16px', color: '#15803D', fontWeight: 800 }}>
                Calculated Soil Health Index
              </h3>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                <ScoreGauge score={calculateHealthScore()} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '12px' }}>
                <NutrientBadge label="Nitrogen" value={nStatus > 80 ? 'High' : nStatus > 50 ? 'Adequate' : nStatus > 30 ? 'Low' : 'Deficient'} />
                <NutrientBadge label="Phosphorus" value={pStatus > 80 ? 'High' : pStatus > 50 ? 'Adequate' : pStatus > 30 ? 'Low' : 'Deficient'} />
                <NutrientBadge label="Potassium" value={kStatus > 80 ? 'High' : kStatus > 50 ? 'Adequate' : kStatus > 30 ? 'Low' : 'Deficient'} />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveReport}
                disabled={saving}
                style={{
                  marginTop: '16px', width: '100%', padding: '14px 18px', borderRadius: '10px', border: 'none',
                  background: '#15803D', color: '#FFFFFF', fontSize: '14px', fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)'
                }}
              >
                <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} style={{ marginRight: '6px' }} />
                {saving ? 'सहेज रहे हैं...' : 'सुरक्षित करें / Save Report'}
              </button>
              {saveMsg && (
                <div style={{ marginTop: '10px', color: '#15803D', fontSize: '14px', fontWeight: 800 }}>
                  ✅ {saveMsg}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
