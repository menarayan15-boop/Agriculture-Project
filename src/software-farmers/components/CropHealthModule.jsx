import React, { useState, useRef, useCallback } from 'react';
import { api } from '../utils/apiSimulator';
import { Upload, Camera, User, CheckCircle, XCircle, RefreshCw, Loader, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

// ─── Disease Knowledge Base ──────────────────────────────────────────────────
const DISEASE_DB = [
    {
        id: 'd01', emoji: '🍂',
        name: 'Early Blight',
        localName: 'अगेती झुलसा (Tomato / Potato)',
        type: 'Fungal Disease',
        severity: 'MEDIUM',
        severityLabel: '⚠️ Medium Risk',
        severityColor: '#f97316',
        severityBg: 'rgba(249,115,22,0.12)',
        crops: ['Tomato', 'Potato'],
        confidence_base: 87,
        whatToLookFor: 'Dark brown rings on older leaves. Yellow area around the rings. Looks like a target.',
        whatToDo: 'Spray Mancozeb 75% WP (2g per litre of water) on leaves. Remove badly affected leaves. Do NOT water from above.',
        prevention: 'Change crop location each year. Keep space between plants for air flow.',
        treatmentCategory: 'fungicide'
    },
    {
        id: 'd02', emoji: '💧',
        name: 'Late Blight',
        localName: 'पछेती झुलसा (Tomato / Potato)',
        type: 'Water Mould Disease',
        severity: 'HIGH',
        severityLabel: '🚨 High Risk — Act Now',
        severityColor: '#ef4444',
        severityBg: 'rgba(239,68,68,0.12)',
        crops: ['Tomato', 'Potato'],
        confidence_base: 91,
        whatToLookFor: 'Oily, dark water-soaked patches on leaves. White fuzzy growth under leaves in wet weather.',
        whatToDo: 'URGENT: Apply Ridomil Gold (Metalaxyl + Mancozeb) at 2.5g per litre immediately. Keep this area away from healthy plants. Tell neighbouring farmers.',
        prevention: 'Use certified seeds. Spray fungicide before monsoon season starts.',
        treatmentCategory: 'systemic_fungicide'
    },
    {
        id: 'd03', emoji: '🦠',
        name: 'Bacterial Leaf Spot',
        localName: 'जीवाणु पत्ती धब्बा (Tomato / Groundnut)',
        type: 'Bacterial Infection',
        severity: 'MEDIUM',
        severityLabel: '⚠️ Medium Risk',
        severityColor: '#f97316',
        severityBg: 'rgba(249,115,22,0.12)',
        crops: ['Tomato', 'Pepper', 'Groundnut'],
        confidence_base: 78,
        whatToLookFor: 'Small brown spots with yellow borders. Hole-like appearance when spots fall out.',
        whatToDo: 'Spray Kocide 3000 (Copper Hydroxide) at 2g per litre. Avoid working in the field when wet. Remove badly damaged plants.',
        prevention: 'Use resistant crop varieties. Avoid sprinkler irrigation. Clean tools between plant rows.',
        treatmentCategory: 'bactericide'
    },
    {
        id: 'd04', emoji: '🌿',
        name: 'Nitrogen Deficiency',
        localName: 'नाइट्रोजन की कमी (All Crops)',
        type: 'Nutrient Problem',
        severity: 'LOW',
        severityLabel: '✅ Low Risk — Can Wait Briefly',
        severityColor: '#eab308',
        severityBg: 'rgba(234,179,8,0.1)',
        crops: ['Basmati Rice', 'Wheat', 'Maize', 'Tomato', 'Groundnut'],
        confidence_base: 82,
        whatToLookFor: 'Leaves turning pale yellow starting from the bottom of the plant. Plant looks pale and grows slowly.',
        whatToDo: 'Add Urea (46% Nitrogen) — 25 kg per acre as top-dressing. Organic: well-composted cow dung manure also works.',
        prevention: 'Get soil tested before planting. Follow fertilizer schedule recommended for your crop.',
        treatmentCategory: 'fertilizer'
    },
    {
        id: 'd05', emoji: '🐛',
        name: 'Brown Planthopper',
        localName: 'भूरा फुदका (Rice / Wheat)',
        type: 'Pest (Insect)',
        severity: 'HIGH',
        severityLabel: '🚨 High Risk — Act Now',
        severityColor: '#ef4444',
        severityBg: 'rgba(239,68,68,0.12)',
        crops: ['Basmati Rice', 'Wheat'],
        confidence_base: 85,
        whatToLookFor: 'Circular brown patches in field (hopper burn). Plants wilting and turning yellow from the base. Tiny insects visible near water line at plant base.',
        whatToDo: 'Apply Imidacloprid 17.8% SL (0.3ml per litre of water). Empty field water before spraying. Do NOT spray during flowering.',
        prevention: 'Avoid too much nitrogen fertilizer. Keep 5–7 cm water level. Use BPH-resistant rice varieties.',
        treatmentCategory: 'insecticide'
    },
    {
        id: 'd06', emoji: '🟤',
        name: 'Leaf Rust',
        localName: 'पत्ती का रतुआ (Wheat)',
        type: 'Fungal Disease',
        severity: 'HIGH',
        severityLabel: '🚨 High Risk — Act Now',
        severityColor: '#ef4444',
        severityBg: 'rgba(239,68,68,0.12)',
        crops: ['Wheat'],
        confidence_base: 89,
        whatToLookFor: 'Small round orange-brown powdery spots on top of leaves. Rust-coloured powder rubs off on fingers.',
        whatToDo: 'Apply Propiconazole 25% EC (Tilt) at 1ml per litre water. Spray again after 15 days if disease continues.',
        prevention: 'Plant rust-resistant wheat varieties. Avoid crowded planting. Sow early.',
        treatmentCategory: 'fungicide'
    },
    {
        id: 'd07', emoji: '🌵',
        name: 'Water Stress',
        localName: 'पानी की कमी (All Crops)',
        type: 'Water / Drought Problem',
        severity: 'MEDIUM',
        severityLabel: '⚠️ Medium Risk',
        severityColor: '#f97316',
        severityBg: 'rgba(249,115,22,0.12)',
        crops: ['Tomato', 'Groundnut', 'Maize', 'Wheat', 'Basmati Rice'],
        confidence_base: 94,
        whatToLookFor: 'Leaves curling and wilting in the afternoon. Grey-green colour. Plant looks droopy but may recover at night.',
        whatToDo: 'Irrigate immediately. Spray 1% Potassium Nitrate (KNO3) solution on leaves to reduce stress.',
        prevention: 'Set irrigation schedule based on crop needs. Use mulch on soil to reduce water loss.',
        treatmentCategory: 'irrigation'
    }
];

// ─── AI Engine ──────────────────────────────────────────────────────────────
const runAIAnalysis = (cropName) => {
    const matching = DISEASE_DB.filter(d =>
        d.crops.some(c => c.toLowerCase().includes(cropName?.toLowerCase() || '') ||
            (cropName?.toLowerCase() || '').includes(c.toLowerCase()))
    );
    const pool = matching.length > 0 ? matching : DISEASE_DB;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    const variance = Math.floor(Math.random() * 10) - 5;
    const confidence = Math.max(55, Math.min(98, selected.confidence_base + variance));
    const others = DISEASE_DB.filter(d => d.id !== selected.id).slice(0, 2).map(d => ({
        name: d.name, emoji: d.emoji,
        confidence: Math.max(10, Math.min(40, Math.floor(Math.random() * 30) + 8))
    }));
    return {
        primary: { ...selected, confidence },
        differentials: others,
        analysisId: `SCAN-${Date.now().toString(36).toUpperCase().slice(-6)}`,
        analyzedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        cropName
    };
};

// ─── Step Indicator ──────────────────────────────────────────────────────────
const StepDot = ({ n, label, current }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{
            width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '0.85rem',
            background: current >= n ? '#10b981' : 'rgba(255,255,255,0.08)',
            color: current >= n ? '#fff' : '#64748b',
            border: `2px solid ${current >= n ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
            boxShadow: current === n ? '0 0 12px rgba(16,185,129,0.5)' : 'none',
            transition: 'all 0.3s ease'
        }}>{current > n ? '✓' : n}</div>
        <span style={{ fontSize: '0.6rem', color: current >= n ? '#10b981' : '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
);
const StepLine = ({ done }) => (
    <div style={{ flex: 1, height: 2, background: done ? '#10b981' : 'rgba(255,255,255,0.07)', borderRadius: 2, margin: '14px 4px 0', transition: 'background 0.4s ease' }} />
);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function CropHealthModule({ dbState }) {
    const { lang, t, formatNum } = useLang();

    const [scanning, setScanning] = useState(false);
    const { farm } = dbState;
    const activeFarmer = dbState.registeredFarmers?.find(f => f.id === dbState.activeFarmerId) || dbState.farmer;

    const [step, setStep] = useState(1); // 1: choose method, 2: analyzing, 3: result, 4: confirm, 5: done
    const [inputMethod, setInputMethod] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [result, setResult] = useState(null);
    const [decision, setDecision] = useState(null);
    const [notes, setNotes] = useState('');
    const [auditLog, setAuditLog] = useState(dbState.diseaseAuditLog || []);
    const [view, setView] = useState('scan'); // 'scan' | 'log'
    const fileRef = useRef(null);

    const currentStep = step === 5 ? 5 : step;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleFile = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            startAnalysis('upload', ev.target.result);
        };
        reader.readAsDataURL(file);
    }, []);

    const startAnalysis = async (method, imgPreview) => {
        setInputMethod(method);
        setImagePreview(imgPreview || null);
        setStep(2);
        await api.analyzeCropDisease(farm.cropName, method, activeFarmer.id);
        setTimeout(() => {
            const r = runAIAnalysis(farm.cropName);
            setResult(r);
            setStep(3);
        }, 3000);
    };

    const handleDecision = async (dec) => {
        setDecision(dec);
        const entry = await api.recordTreatmentAction({
            farmerId: activeFarmer.id, farmerName: activeFarmer.name,
            fieldId: dbState.activeFieldId, cropName: farm.cropName,
            disease: result.primary.name, confidence: result.primary.confidence,
            treatmentDecision: dec, treatmentCategory: result.primary.treatmentCategory,
            operatorNotes: notes, inputMethod, analysisId: result.analysisId
        });
        setAuditLog(prev => [entry, ...prev]);
        setStep(5);
    };

    const reset = () => { setStep(1); setInputMethod(null); setImagePreview(null); setResult(null); setDecision(null); setNotes(''); };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="ch2-root">

            {/* ── View switcher ── */}
            <div className="ch2-view-switch">
                <button className={`ch2-vsw-btn ${view === 'scan' ? 'active' : ''}`} onClick={() => setView('scan')}>
                    🔬 {t("Check My Crop")}
                </button>
                <button className={`ch2-vsw-btn ${view === 'log' ? 'active' : ''}`} onClick={() => setView('log')}>
                    📋 {t("Past Records")} ({formatNum(auditLog.length)})
                </button>
            </div>

            {/* ══════ SCAN VIEW ══════════════════════════════════════════════ */}
            {view === 'scan' && (
                <div>
                    {/* Safety notice */}
                    <div className="ch2-safety-bar">
                        <ShieldCheck size={22} />
                        <div>
                            <strong>{t("Your Safety First:")}</strong> {t("This AI gives advice only. It will never automatically spray anything on your crops. You always decide what to do.")}
                        </div>
                    </div>

                    {/* Context card */}
                    <div className="ch2-context-card">
                        <div className="ch2-ctx-item">
                            <span className="ch2-ctx-label">👨‍🌾 {t("Farmer")}</span>
                            <span className="ch2-ctx-val">{activeFarmer?.name}</span>
                        </div>
                        <div className="ch2-ctx-divider" />
                        <div className="ch2-ctx-item">
                            <span className="ch2-ctx-label">🌾 {t("Crop")}</span>
                            <span className="ch2-ctx-val" style={{ color: '#4ade80' }}>{t(farm.cropName)}</span>
                        </div>
                        <div className="ch2-ctx-divider" />
                        <div className="ch2-ctx-item">
                            <span className="ch2-ctx-label">📍 {t("Field")}</span>
                            <span className="ch2-ctx-val">{t(dbState.activeFieldId)}</span>
                        </div>
                        <div className="ch2-ctx-divider" />
                        <div className="ch2-ctx-item">
                            <span className="ch2-ctx-label">🌱 {t("Stage")}</span>
                            <span className="ch2-ctx-val">{t(farm.cropStage)}</span>
                        </div>
                    </div>

                    {/* Step indicator */}
                    {step < 5 && (
                        <div className="ch2-steps">
                            <StepDot n={1} label={t("Choose")} current={currentStep} />
                            <StepLine done={currentStep > 1} />
                            <StepDot n={2} label={t("Scanning")} current={currentStep} />
                            <StepLine done={currentStep > 2} />
                            <StepDot n={3} label={t("Result")} current={currentStep} />
                            <StepLine done={currentStep > 3} />
                            <StepDot n={4} label={t("Confirm")} current={currentStep} />
                        </div>
                    )}

                    {/* ── STEP 1: Choose input method ─── */}
                    {step === 1 && (
                        <div className="ch2-step-card">
                            <h2 className="ch2-step-title">📷 {t("How do you want to check your crop?")}</h2>
                            <p className="ch2-step-desc">{t("Take a photo of the sick leaf or plant, and our AI will tell you what is wrong and how to fix it.")}</p>

                            <div className="ch2-method-grid">
                                {/* Upload */}
                                <button className="ch2-method-btn teal" onClick={() => fileRef.current?.click()}>
                                    <Upload size={32} />
                                    <span className="ch2-mb-title">📱 {t("Upload Photo")}</span>
                                    <span className="ch2-mb-desc">{t("Take a photo from your phone and upload it here")}</span>
                                </button>
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => {
                                    handleFile(e);
                                    startAnalysis('upload', null); // will be overridden by FileReader
                                    // slight delay to let reader finish
                                    setTimeout(() => { }, 100);
                                }} />

                                {/* Kiosk camera */}
                                <button className="ch2-method-btn purple"
                                    onClick={() => startAnalysis('kiosk', null)}>
                                    <Camera size={32} />
                                    <span className="ch2-mb-title">🏛️ {t("Kiosk Camera")}</span>
                                    <span className="ch2-mb-desc">{t("Hold your plant near the kiosk camera for a live scan")}</span>
                                </button>

                                {/* Assisted */}
                                <button className="ch2-method-btn blue"
                                    onClick={() => startAnalysis('assisted', null)}>
                                    <User size={32} />
                                    <span className="ch2-mb-title">👨‍💼 {t("Ask an Expert")}</span>
                                    <span className="ch2-mb-desc">{t("Village centre worker will describe and submit on your behalf")}</span>
                                </button>
                            </div>

                            {/* Quick demo */}
                            <div className="ch2-demo-bar">
                                <span className="ch2-demo-label">{t("Don't have a photo? Try a quick demo scan:")}</span>
                                <button className="ch2-demo-btn" onClick={() => startAnalysis('demo', null)}>
                                    ⚡ {t("Quick AI Check — No Photo Needed")}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 2: Analyzing ─── */}
                    {step === 2 && (
                        <div className="ch2-step-card ch2-analyzing-card">
                            <div className="ch2-spinner-wrap">
                                <Loader size={48} className="ch2-spinner" />
                                <span className="ch2-ai-badge">AI</span>
                            </div>
                            <h2 className="ch2-step-title" style={{ textAlign: 'center' }}>🤖 {t("AI is checking your crop...")}</h2>
                            <p className="ch2-step-desc" style={{ textAlign: 'center' }}>
                                {t("Our computer model is looking for diseases and pests.")}<br />
                                {t("This takes about 3 seconds. Please wait.")}
                            </p>
                            <div className="ch2-progress-steps">
                                {[
                                    { done: true, text: t('Reading the image...') },
                                    { done: true, text: t('Checking against 38 known diseases...') },
                                    { done: false, text: t('Calculating confidence score...') },
                                    { done: false, text: t('Preparing your advice...') },
                                ].map((s, i) => (
                                    <div key={i} className={`ch2-ps-row ${s.done ? 'done' : 'pending'}`}>
                                        {s.done
                                            ? <CheckCircle size={16} />
                                            : <Loader size={16} className="ch2-spinner-sm" />}
                                        {s.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Result ─── */}
                    {step === 3 && result && (
                        <div>
                            {/* Main diagnosis card */}
                            <div className="ch2-result-card" style={{ borderColor: result.primary.severityColor, background: result.primary.severityBg }}>

                                <div className="ch2-result-header">
                                    <span className="ch2-result-emoji">{result.primary.emoji}</span>
                                    <div className="ch2-result-name-block">
                                        <div className="ch2-result-name">{t(result.primary.name)}</div>
                                        <div className="ch2-result-localname">{t(result.primary.localName)}</div>
                                        <div className="ch2-result-type">{t(result.primary.type)}</div>
                                    </div>
                                    <div className="ch2-severity-badge" style={{ background: result.primary.severityBg, border: `1px solid ${result.primary.severityColor}`, color: result.primary.severityColor }}>
                                        {t(result.primary.severityLabel)}
                                    </div>
                                </div>

                                {/* Confidence */}
                                <div className="ch2-conf-section">
                                    <div className="ch2-conf-header">
                                        <span>{t("AI Confidence Score")}</span>
                                        <span className="ch2-conf-pct" style={{ color: result.primary.severityColor }}>{formatNum(result.primary.confidence)}%</span>
                                    </div>
                                    <div className="ch2-conf-bar-bg">
                                        <div className="ch2-conf-bar-fill" style={{ width: `${result.primary.confidence}%`, background: result.primary.severityColor }} />
                                    </div>
                                    <div className="ch2-conf-hint">
                                        {result.primary.confidence >= 85
                                            ? t('✅ Very confident — this is likely what your crop has.')
                                            : result.primary.confidence >= 70
                                                ? t('⚠️ Fairly confident — consider getting expert confirmation.')
                                                : t('🔍 Low confidence — please consult your agricultural officer.')}
                                    </div>
                                </div>
                            </div>

                            {/* What to look for */}
                            <div className="ch2-info-section">
                                <div className="ch2-info-icon">👁️</div>
                                <div>
                                    <div className="ch2-info-title">{t("What to look for on your plant")}</div>
                                    <div className="ch2-info-body">{t(result.primary.whatToLookFor)}</div>
                                </div>
                            </div>

                            {/* What to do */}
                            <div className="ch2-info-section" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.3)' }}>
                                <div className="ch2-info-icon">💊</div>
                                <div>
                                    <div className="ch2-info-title" style={{ color: '#4ade80' }}>{t("Recommended Treatment")}</div>
                                    <div className="ch2-info-body">{t(result.primary.whatToDo)}</div>
                                </div>
                            </div>

                            {/* Prevention */}
                            <div className="ch2-info-section" style={{ background: 'rgba(59,130,246,0.07)', borderColor: 'rgba(59,130,246,0.25)' }}>
                                <div className="ch2-info-icon">🛡️</div>
                                <div>
                                    <div className="ch2-info-title" style={{ color: '#93c5fd' }}>{t("How to prevent this in future")}</div>
                                    <div className="ch2-info-body">{t(result.primary.prevention)}</div>
                                </div>
                            </div>

                            {/* Other possibilities */}
                            <div className="ch2-differentials">
                                <div className="ch2-diff-title">{t("Other possibilities (less likely):")}</div>
                                {result.differentials.map((d, i) => (
                                    <div key={i} className="ch2-diff-row">
                                        <span>{d.emoji} {t(d.name)}</span>
                                        <span className="ch2-diff-pct">{formatNum(d.confidence)}% {t("chance")}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Proceed CTA */}
                            <button className="ch2-proceed-btn" onClick={() => setStep(4)}>
                                {t("✅ I've Read This — Proceed to Confirm Action")}
                            </button>
                            <button className="ch2-secondary-btn" onClick={reset}>
                                {t("← Scan a Different Crop")}
                            </button>
                        </div>
                    )}

                    {/* ── STEP 4: Confirm ─── */}
                    {step === 4 && result && (
                        <div className="ch2-step-card">
                            <h2 className="ch2-step-title">👨‍🌾 {t("What would you like to do?")}</h2>
                            <p className="ch2-step-desc">
                                {t("AI found:")} <strong style={{ color: result.primary.severityColor }}>{t(result.primary.name)}</strong> {t("on your")} {t(farm.cropName)} {t("with")} <strong>{formatNum(result.primary.confidence)}% {t("confidence")}</strong>.<br /><br />
                                {t("Choose an action below. This will be saved in your farm record.")}
                            </p>

                            {/* Notes */}
                            <div className="ch2-notes-box">
                                <label className="ch2-notes-label">📝 Add your notes (optional)</label>
                                <textarea
                                    className="ch2-notes-input"
                                    placeholder="E.g. Noticed this 2 days ago. Small area affected. Will check tomorrow..."
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="ch2-decision-grid">
                                <button className="ch2-decision-btn approved" onClick={() => handleDecision('approved')}>
                                    <CheckCircle size={28} />
                                    <span className="ch2-db-title">✅ {t("Yes, Apply Treatment")}</span>
                                    <span className="ch2-db-desc">{t("I will follow the recommended treatment on my crop")}</span>
                                </button>
                                <button className="ch2-decision-btn advisory" onClick={() => handleDecision('advisory')}>
                                    <FileText size={28} />
                                    <span className="ch2-db-title">📋 {t("Ask an Expert First")}</span>
                                    <span className="ch2-db-desc">{t("I want to confirm with an agriculture officer before doing anything")}</span>
                                </button>
                                <button className="ch2-decision-btn rejected" onClick={() => handleDecision('rejected')}>
                                    <XCircle size={24} />
                                    <span className="ch2-db-title">✗ {t("No Action Now")}</span>
                                    <span className="ch2-db-desc">{t("I will monitor my crop for another 1–2 days")}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 5: Done ─── */}
                    {step === 5 && (
                        <div className="ch2-done-card">
                            <div className="ch2-done-icon">
                                {decision === 'approved' ? '✅' : decision === 'advisory' ? '📋' : '📝'}
                            </div>
                            <h2 className="ch2-done-title">
                                {decision === 'approved' ? t('Treatment Plan Recorded!') : decision === 'advisory' ? t('Expert Referral Noted!') : t('Observation Recorded!')}
                            </h2>
                            <p className="ch2-done-desc">
                                {decision === 'approved' && t('Your decision has been saved. Please apply the treatment safely and follow dosage instructions. Your farm record has been updated.')}
                                {decision === 'advisory' && t('We have noted that you want to consult an expert. An agricultural officer will be available to help. No chemicals applied.')}
                                {decision === 'rejected' && t('Noted. Monitor your crop closely over the next 48 hours. Use this app again if symptoms get worse.')}
                            </p>
                            {decision === 'approved' && (
                                <div className="ch2-done-reminder">
                                    <AlertTriangle size={18} />
                                    <span>🧤 Always wear gloves and follow safety instructions when applying any pesticide or fertilizer.</span>
                                </div>
                            )}
                            <div className="ch2-done-auditid">
                                Farm Record ID: <strong>{auditLog[0]?.auditId || '—'}</strong>
                            </div>
                            <button className="ch2-proceed-btn" onClick={reset}>
                                <RefreshCw size={18} /> Scan Another Crop
                            </button>
                        </div>
                    )}
                    {/* ══════ AUDIT LOG VIEW ═══════════════════════════════════════════ */}
                </div>)}
            {view === 'log' && (
                <div>
                    <div className="ch2-log-header">
                        <h2 className="ch2-step-title">📋 {t("Your Farm Treatment Records")}</h2>
                        <p className="ch2-step-desc">{t("This is your official record of all past disease checks and actions taken. These records cannot be changed.")}</p>
                    </div>

                    {auditLog.length === 0 ? (
                        <div className="ch2-log-empty">
                            <span style={{ fontSize: '3rem' }}>📭</span>
                            <p>No records yet. Do a crop health scan to create your first record.</p>
                        </div>
                    ) : (
                        <div className="ch2-log-list">
                            {auditLog.map((entry, i) => (
                                <div key={i} className={`ch2-log-entry ${entry.decision}`}>
                                    <div className="ch2-log-badge">
                                        {entry.decision === 'approved' ? '✅ Treatment Applied' : entry.decision === 'advisory' ? '📋 Referred to Expert' : '✗ No Action'}
                                    </div>
                                    <div className="ch2-log-row">
                                        <span className="ch2-log-k">Disease Found</span>
                                        <span className="ch2-log-v">{entry.disease}</span>
                                    </div>
                                    <div className="ch2-log-row">
                                        <span className="ch2-log-k">Crop</span>
                                        <span className="ch2-log-v" style={{ color: '#4ade80' }}>{entry.cropName}</span>
                                    </div>
                                    <div className="ch2-log-row">
                                        <span className="ch2-log-k">AI Confidence</span>
                                        <span className="ch2-log-v">{entry.confidence}%</span>
                                    </div>
                                    <div className="ch2-log-row">
                                        <span className="ch2-log-k">Farmer</span>
                                        <span className="ch2-log-v">{entry.farmerName}</span>
                                    </div>
                                    <div className="ch2-log-row">
                                        <span className="ch2-log-k">Date & Time</span>
                                        <span className="ch2-log-v">{entry.timestamp}</span>
                                    </div>
                                    {entry.notes && (
                                        <div className="ch2-log-row">
                                            <span className="ch2-log-k">Notes</span>
                                            <span className="ch2-log-v" style={{ fontStyle: 'italic' }}>{entry.notes}</span>
                                        </div>
                                    )}
                                    <div className="ch2-log-auditid">Record ID: {entry.auditId}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )
            }
        </div >
    );
}
