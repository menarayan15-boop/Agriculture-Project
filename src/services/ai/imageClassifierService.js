/**
 * In-Browser Multi-Stage AI Vision & Computer Vision Soil Classifier
 * Layer 1: Optional In-Browser Pretrained MobileNet Classifier (via CDN / WebGL)
 * Layer 2: Mathematical 8x8 Patch-Level Granularity, Texture Energy & Sobel Edge Analyzer
 */

let mobileNetModel = null;
let isLoadingMobileNet = false;

// Attempt to load MobileNet from CDN asynchronously in the background
export async function initMobileNetClassifier() {
  if (mobileNetModel || isLoadingMobileNet || typeof window === 'undefined') return;
  isLoadingMobileNet = true;

  try {
    if (!window.tf) {
      await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js');
    }
    if (!window.mobilenet && window.tf) {
      await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js');
    }
    if (window.mobilenet) {
      mobileNetModel = await window.mobilenet.load({ version: 2, alpha: 0.5 });
      console.log('[AI Classifier]: MobileNet loaded successfully for instant client-side object detection.');
    }
  } catch (err) {
    console.info('[AI Classifier]: Local MobileNet skipped, using Canvas Texture Energy CV engine.');
  } finally {
    isLoadingMobileNet = false;
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

// Automatically trigger background prefetch
if (typeof window !== 'undefined') {
  setTimeout(() => initMobileNetClassifier(), 1000);
}

// Non-soil keywords for MobileNet ImageNet classes
const NON_SOIL_OBJECT_KEYWORDS = [
  'car', 'automobile', 'vehicle', 'convertible', 'coupe', 'sports car', 'racer', 'grille',
  'wheel', 'tire', 'spoke', 'bumper', 'truck', 'trailer', 'jeep', 'minivan', 'motorcycle',
  'moped', 'bicycle', 'bus', 'train', 'aircraft', 'airplane', 'boat', 'ship', 'laptop',
  'desktop', 'monitor', 'screen', 'cellular telephone', 'phone', 'dog', 'cat', 'person',
  'shoe', 'boot', 'sneaker', 'jersey', 'suit', 'sweatshirt', 'cardboard', 'furniture',
  'table', 'desk', 'chair', 'building', 'street sign', 'sunglass', 'sunglasses', 'crash helmet',
  'seat belt', 'windshield', 'odometer', 'radiator', 'steering wheel', 'exhaust', 'spoiler'
];

/**
 * Main Soil Validation Engine
 */
export async function classifySoilImage(imageElement, canvas) {
  // ── LAYER 1: MobileNet Object Identification ──
  if (mobileNetModel && imageElement) {
    try {
      const predictions = await mobileNetModel.classify(imageElement, 3);
      if (predictions && predictions.length > 0) {
        const top = predictions[0];
        const topClassLower = (top.className || '').toLowerCase();
        const topProb = top.probability || 0;

        const isNonSoilObject = NON_SOIL_OBJECT_KEYWORDS.some(kw => topClassLower.includes(kw));
        if (isNonSoilObject && topProb >= 0.12) {
          const formattedName = top.className.split(',')[0];
          return {
            is_soil: false,
            isSoil: false,
            confidence: parseFloat(Math.min(0.99, Math.max(0.90, topProb)).toFixed(2)),
            soil_area_percentage: 0,
            decision: 'REJECT',
            reason: `Non-soil object detected: ${formattedName} (वाहन या वस्तु पाई गई: ${formattedName})`,
            suggestion: 'Please upload a close-up photograph of natural agricultural soil without vehicles or machinery.',
            error: `❌ ${formattedName.toUpperCase()} detected / मिट्टी स्पष्ट रूप से नहीं पाई गई\n\nPlease upload a close-up photo where soil is clearly visible and occupies most of the frame.\n\nAvoid photos where cars, machinery, buildings, clothing or other objects are the main subject.\n(कृपया ऐसी फोटो अपलोड करें जिसमें मिट्टी मुख्य रूप से दिखाई दे। वाहन, कपड़े, इमारत या मशीनरी की फोटो न डालें।)`
          };
        }
      }
    } catch (mnErr) {
      console.warn('[AI Classifier]: MobileNet classification skipped:', mnErr);
    }
  }

  // ── LAYER 2: Pure Canvas Patch-Level Granularity & Texture Energy Engine ──
  const width = 120;
  const height = 120;
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(imageElement, 0, 0, width, height);
  const imgData = ctx.getImageData(0, 0, width, height);
  const pixels = imgData.data;
  const totalPixels = width * height;
  const luminances = new Float32Array(totalPixels);

  let totalR = 0, totalG = 0, totalB = 0;
  for (let i = 0; i < totalPixels; i++) {
    const r = pixels[i * 4];
    const g = pixels[i * 4 + 1];
    const b = pixels[i * 4 + 2];
    totalR += r;
    totalG += g;
    totalB += b;
    luminances[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  const avgLuminance = (0.299 * totalR + 0.587 * totalG + 0.114 * totalB) / totalPixels;

  let sumSqDiff = 0;
  for (let i = 0; i < totalPixels; i++) {
    const diff = luminances[i] - avgLuminance;
    sumSqDiff += diff * diff;
  }
  const globalStdDevLuminance = Math.sqrt(sumSqDiff / totalPixels);

  // Compute 8x8 = 64 Local Patch Statistics
  const patchCols = 8;
  const patchRows = 8;
  const patchW = Math.floor(width / patchCols);
  const patchH = Math.floor(height / patchRows);

  let smoothPatches = 0;
  let highlyGranularSoilPatches = 0;
  let earthyTonedPatches = 0;
  let vehicleOrSyntheticPatches = 0;
  let skyOrLandscapePatches = 0;
  let redSoilPatches = 0;
  let blackSoilPatches = 0;
  let sandySoilPatches = 0;
  let alluvialSoilPatches = 0;
  let totalValidPatches = patchCols * patchRows;

  let centerSmoothPatches = 0;
  let centerSoilPatches = 0;
  let centerTotalPatches = 0;

  for (let pr = 0; pr < patchRows; pr++) {
    for (let pc = 0; pc < patchCols; pc++) {
      const startX = pc * patchW;
      const startY = pr * patchH;
      const isCenter = (pr >= 2 && pr <= 5 && pc >= 2 && pc <= 5);
      if (isCenter) centerTotalPatches++;

      let pSumLum = 0;
      let pR = 0, pG = 0, pB = 0;
      let patchPixelCount = patchW * patchH;

      for (let y = startY; y < startY + patchH; y++) {
        for (let x = startX; x < startX + patchW; x++) {
          const idx = y * width + x;
          pSumLum += luminances[idx];
          pR += pixels[idx * 4];
          pG += pixels[idx * 4 + 1];
          pB += pixels[idx * 4 + 2];
        }
      }

      const pAvgLum = pSumLum / patchPixelCount;
      const pAvgR = pR / patchPixelCount;
      const pAvgG = pG / patchPixelCount;
      const pAvgB = pB / patchPixelCount;

      let pSqDiff = 0;
      let pNeighborDiff = 0;
      let pNeighborCount = 0;

      for (let y = startY; y < startY + patchH; y++) {
        for (let x = startX; x < startX + patchW; x++) {
          const idx = y * width + x;
          const diff = luminances[idx] - pAvgLum;
          pSqDiff += diff * diff;

          if (x < startX + patchW - 1) {
            pNeighborDiff += Math.abs(luminances[idx] - luminances[idx + 1]);
            pNeighborCount++;
          }
        }
      }

      const patchVariance = pSqDiff / patchPixelCount;
      const patchStdDev = Math.sqrt(patchVariance);
      const patchAvgNeighborDiff = pNeighborCount > 0 ? (pNeighborDiff / pNeighborCount) : 0;

      const isBrightSky = (pAvgB > pAvgR * 1.12 && pAvgB > pAvgG && pAvgLum >= 120);
      const isSyntheticColor = (pAvgR > 180 && pAvgG < 70 && pAvgB < 70) || // red sports rim
                               (pAvgR > 190 && pAvgB > 130 && pAvgG < 110) ||
                               (pAvgB > 160 && pAvgR < 80);
      const isDeepBlackTireOrGlass = (pAvgLum < 28 && Math.abs(pAvgR - pAvgG) <= 8 && Math.abs(pAvgR - pAvgB) <= 8);
      const isMetallicGrey = (Math.abs(pAvgR - pAvgG) <= 6 && Math.abs(pAvgR - pAvgB) <= 6 && pAvgLum >= 28 && pAvgLum <= 230);

      const isSmoothSurface = (patchStdDev < 4.2 || patchAvgNeighborDiff < 1.1);

      if (isSmoothSurface) {
        smoothPatches++;
        if (isCenter) centerSmoothPatches++;
      }

      if (isBrightSky) {
        skyOrLandscapePatches++;
      }

      if (isSyntheticColor || isDeepBlackTireOrGlass || (isSmoothSurface && (isMetallicGrey || pAvgLum > 140))) {
        vehicleOrSyntheticPatches++;
      }

      const isRed = (pAvgR >= 65 && pAvgR <= 235 && pAvgG >= 25 && pAvgG <= 170 && pAvgB >= 10 && pAvgB <= 135 && (pAvgR - pAvgG) >= 12 && (pAvgR - pAvgB) >= 20);
      const isBlack = (pAvgLum >= 12 && pAvgLum <= 75 && pAvgR >= 15 && pAvgR <= 85 && pAvgG >= 12 && pAvgG <= 78 && pAvgB >= 8 && pAvgB <= 68 && (pAvgR >= pAvgB) && (pAvgR - pAvgB) >= 2);
      const isSandy = (pAvgR >= 85 && pAvgR <= 230 && pAvgG >= 65 && pAvgG <= 195 && pAvgB >= 30 && pAvgB <= 150 && (pAvgR - pAvgB) >= 20 && (pAvgG - pAvgB) >= 10 && pAvgR >= pAvgG - 4);
      const isAlluvial = (pAvgR >= 45 && pAvgR <= 215 && pAvgG >= 30 && pAvgG <= 170 && pAvgB >= 15 && pAvgB <= 135 && (pAvgR - pAvgB) >= 10 && (pAvgR - pAvgG) >= 4);

      const isEarthyChroma = (isRed || isBlack || isSandy || isAlluvial);

      if (isEarthyChroma) {
        earthyTonedPatches++;
        if (isRed) redSoilPatches++;
        else if (isBlack) blackSoilPatches++;
        else if (isSandy) sandySoilPatches++;
        else if (isAlluvial) alluvialSoilPatches++;
      }

      const isGranularTexture = (patchStdDev >= 4.0 && patchAvgNeighborDiff >= 1.15);

      if (isEarthyChroma && isGranularTexture && !isDeepBlackTireOrGlass && !isSyntheticColor) {
        highlyGranularSoilPatches++;
        if (isCenter) centerSoilPatches++;
      }
    }
  }

  const soilPatchRatio = highlyGranularSoilPatches / totalValidPatches;
  const earthyPatchRatio = earthyTonedPatches / totalValidPatches;
  const smoothPatchRatio = smoothPatches / totalValidPatches;
  const vehiclePatchRatio = vehicleOrSyntheticPatches / totalValidPatches;
  const centerSoilRatio = centerSoilPatches / centerTotalPatches;
  const centerSmoothRatio = centerSmoothPatches / centerTotalPatches;

  const soil_area_percentage = Math.min(100, Math.max(0, Math.round(soilPatchRatio * 100)));

  // Sobel Edge & Directional Coherence
  let horizontalEdgeMagnitude = 0;
  let verticalEdgeMagnitude = 0;
  let totalEdgeMagnitude = 0;
  let strongEdgePixels = 0;

  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      const p00 = luminances[(y - 1) * width + (x - 1)];
      const p01 = luminances[(y - 1) * width + x];
      const p02 = luminances[(y - 1) * width + (x + 1)];
      const p10 = luminances[y * width + (x - 1)];
      const p12 = luminances[y * width + (x + 1)];
      const p20 = luminances[(y + 1) * width + (x - 1)];
      const p21 = luminances[(y + 1) * width + x];
      const p22 = luminances[(y + 1) * width + (x + 1)];

      const gx = (p02 + 2 * p12 + p22) - (p00 + 2 * p10 + p20);
      const gy = (p20 + 2 * p21 + p22) - (p00 + 2 * p01 + p02);
      const mag = Math.sqrt(gx * gx + gy * gy);

      if (mag > 26) {
        strongEdgePixels++;
        totalEdgeMagnitude += mag;
        if (Math.abs(gx) > Math.abs(gy) * 1.7) verticalEdgeMagnitude += Math.abs(gx);
        else if (Math.abs(gy) > Math.abs(gx) * 1.7) horizontalEdgeMagnitude += Math.abs(gy);
      }
    }
  }

  const strongEdgeRatio = strongEdgePixels / (totalPixels / 4);
  const directionalEdgeDominance = totalEdgeMagnitude > 0 
    ? (horizontalEdgeMagnitude + verticalEdgeMagnitude) / totalEdgeMagnitude 
    : 0;

  // Category determination
  let detectedCategory = 'alluvial';
  if (redSoilPatches >= blackSoilPatches && redSoilPatches >= sandySoilPatches && redSoilPatches >= alluvialSoilPatches) {
    detectedCategory = 'red';
  } else if (blackSoilPatches >= redSoilPatches && blackSoilPatches >= sandySoilPatches && blackSoilPatches >= alluvialSoilPatches) {
    detectedCategory = 'black';
  } else if (sandySoilPatches >= redSoilPatches && sandySoilPatches >= blackSoilPatches && sandySoilPatches >= alluvialSoilPatches) {
    detectedCategory = 'sandy';
  } else {
    detectedCategory = 'alluvial';
  }

  // Decision Classifier
  let decision = 'REJECT';
  let confidence = 0.20;
  let reason = '';
  let suggestion = null;

  const isFlatSolidGraphic = (globalStdDevLuminance < 3.0 && smoothPatchRatio >= 0.85);

  const hasVehicleOrMachineStructure = (
    (smoothPatchRatio >= 0.22 && soilPatchRatio < 0.65 && earthyPatchRatio < 0.85) ||
    (centerSmoothRatio >= 0.30 && earthyPatchRatio < 0.85) ||
    (vehiclePatchRatio >= 0.15) ||
    (strongEdgeRatio >= 0.08 && directionalEdgeDominance >= 0.45 && soilPatchRatio < 0.70)
  );

  const isLandscapeScene = (skyOrLandscapePatches >= 6 && soilPatchRatio < 0.60);
  const isExtremelyBlurrySoil = (earthyPatchRatio >= 0.80 && soilPatchRatio < 0.35 && smoothPatchRatio >= 0.50 && globalStdDevLuminance >= 4.0);

  if (isFlatSolidGraphic) {
    decision = 'REJECT';
    confidence = 0.96;
    reason = 'Flat smooth surface, solid color, cardboard, or table detected without natural granular soil texture.';
    suggestion = 'Please upload a photo of real soil with visible grain, clods, or earthy texture.';
  } else if (hasVehicleOrMachineStructure) {
    decision = 'REJECT';
    confidence = 0.98;
    reason = 'Vehicle, car, metallic surface, or man-made object detected as primary subject.';
    suggestion = 'Please upload a close-up photograph of natural agricultural soil without vehicles or machinery.';
  } else if (isLandscapeScene) {
    decision = 'REJECT';
    confidence = 0.95;
    reason = 'Outdoor landscape scene or non-soil object detected instead of a close-up soil sample.';
    suggestion = 'Please take a close-up photograph focusing directly on the soil sample.';
  } else if (isExtremelyBlurrySoil) {
    decision = 'RETRY';
    confidence = 0.50;
    reason = 'Soil may be present, but the image is too blurry for reliable texture analysis.';
    suggestion = 'Please hold the camera steady and take a clearer, focused photo of the soil.';
  } else if (soilPatchRatio >= 0.60 && centerSoilRatio >= 0.55 && smoothPatchRatio < 0.15) {
    decision = 'ACCEPT';
    confidence = Math.min(0.98, Math.max(0.85, 0.78 + (soilPatchRatio * 0.20)));
    reason = 'Natural soil is clearly visible and forms the dominant part of the image.';
    suggestion = null;
  } else if (soilPatchRatio >= 0.35 && soilPatchRatio < 0.60 && smoothPatchRatio < 0.25) {
    decision = 'RETRY';
    confidence = 0.55;
    reason = 'Some soil is visible, but the photo is not close enough or soil is partially obscured.';
    suggestion = 'Take a closer photo with the soil sample filling most of the frame.';
  } else {
    decision = 'REJECT';
    confidence = 0.94;
    reason = 'The image primarily contains non-soil content and does not contain sufficient visible soil.';
    suggestion = 'Please upload a close-up photograph where soil is clearly visible and occupies most of the frame.';
  }

  let error = undefined;
  if (decision === 'REJECT') {
    error = '❌ Soil not clearly detected / मिट्टी स्पष्ट रूप से नहीं पाई गई\n\nPlease upload a close-up photo where soil is clearly visible and occupies most of the frame.\n\nAvoid photos where cars, machinery, buildings, clothing or other objects are the main subject.\n(कृपया ऐसी फोटो अपलोड करें जिसमें मिट्टी मुख्य रूप से दिखाई दे। वाहन, कपड़े, इमारत या मशीनरी की फोटो न डालें।)';
  } else if (decision === 'RETRY') {
    error = '⚠️ Soil is not clear enough / मिट्टी साफ़ दिखाई नहीं दे रही है\n\nPlease move closer to the soil and take another photo in good daylight.\n(कृपया मिट्टी के अधिक पास जाकर अच्छी रोशनी में दोबारा फोटो लें।)';
  }

  return {
    is_soil: decision === 'ACCEPT',
    isSoil: decision === 'ACCEPT',
    confidence: parseFloat(confidence.toFixed(2)),
    soil_area_percentage,
    decision,
    reason,
    suggestion,
    detectedCategory,
    error,
    successMessage: decision === 'ACCEPT'
      ? '✓ Soil detected successfully / मिट्टी की सफल पहचान हुई\n\nYour soil sample is ready for analysis. / आपका मिट्टी का नमूना परीक्षण के लिए तैयार है।'
      : undefined
  };
}
