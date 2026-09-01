import React, { useState, useEffect } from 'react';
import { getRoadmapText } from '../data/cropRoadmapData';

const ROADMAP_LANGS = ['en', 'hi', 'te', 'ta', 'kn', 'pa', 'bn', 'mr', 'gu', 'ml', 'or'];

export function CropRoadmapCard({ report, crop, location, area, soil, lang = 'en', sowingDate }) {
  const [activeStage, setActiveStage] = useState(0);

  const activeLang = ROADMAP_LANGS.includes(lang) ? lang : (lang === 'hi' ? 'hi' : 'en');
  const isHindi = activeLang === 'hi';

  // Trigger Google Translate engine translation for regional languages (te, ta, kn, pa, bn, mr, gu, ml, or)
  useEffect(() => {
    if (lang && lang !== 'en') {
      const googCombo = document.querySelector('.goog-te-combo');
      if (googCombo) {
        if (googCombo.value !== lang) {
          googCombo.value = lang;
          googCombo.dispatchEvent(new Event('change'));
        }
      }
    }
  }, [lang, activeStage, report]);

  if (!report || !report.cropRoadmap) {
    return (
      <div id="crop-roadmap-section" className="dash-card span-all" style={{
        background: 'rgba(14, 31, 23, 0.95)',
        border: '1.5px solid rgba(40, 199, 111, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(40, 199, 111, 0.15)',
          color: '#28c76f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          margin: '0 auto 12px auto'
        }}>
          <i className="fa-solid fa-seedling"></i>
        </div>
        <h3 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 700 }}>
          {getRoadmapText('cardTitle', activeLang)}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto 16px auto', lineHeight: '1.5' }}>
          {getRoadmapText('placeholderDesc', activeLang)}
        </p>
      </div>
    );
  }

  const roadmap = report.cropRoadmap;
  const cropName = isHindi ? (roadmap.cropNameHi || crop?.nameHi || crop?.name) : (roadmap.cropNameEn || crop?.nameEn || crop?.name);
  const locationName = location?.nameEn || 'Selected Region';
  const farmArea = area || 1;

  // Pure language properties
  const idealSoil = isHindi ? (roadmap.idealSoilHi || roadmap.idealSoil) : (roadmap.idealSoilEn || roadmap.idealSoil);
  const targetPh = isHindi ? (roadmap.targetPhHi || roadmap.targetPh) : (roadmap.targetPhEn || roadmap.targetPh);
  const drainageReq = isHindi ? (roadmap.drainageReqHi || roadmap.drainageReq) : (roadmap.drainageReqEn || roadmap.drainageReq);
  const amendmentTips = isHindi 
    ? (roadmap.amendmentTipsHi || roadmap.amendmentTips || []) 
    : (roadmap.amendmentTipsEn || roadmap.amendmentTips || []);

  const stages = isHindi 
    ? (roadmap.scaledStagesHi || roadmap.stagesHi || roadmap.scaledStages || roadmap.stages || [])
    : (roadmap.scaledStagesEn || roadmap.stagesEn || roadmap.scaledStages || roadmap.stages || []);

  const goldenRules = isHindi 
    ? (roadmap.goldenRulesHi || roadmap.goldenRules || [])
    : (roadmap.goldenRulesEn || roadmap.goldenRules || []);

  const warningFlags = isHindi
    ? (roadmap.warningFlagsHi || roadmap.warningFlags || { underwatering: [], overwatering: [] })
    : (roadmap.warningFlagsEn || roadmap.warningFlags || { underwatering: [], overwatering: [] });

  return (
    <div id="crop-roadmap-section" className="dash-card span-all" style={{
      background: 'linear-gradient(145deg, rgba(10, 24, 17, 0.98) 0%, rgba(16, 38, 27, 0.95) 100%)',
      border: '2px solid rgba(40, 199, 111, 0.45)',
      borderRadius: '20px',
      padding: '28px',
      boxShadow: '0 12px 35px -8px rgba(0, 0, 0, 0.5), 0 0 25px 0 rgba(40, 199, 111, 0.15)',
      marginTop: '24px',
      color: '#e6f3ec'
    }}>
      {/* ─── HEADER BANNER ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #28c76f 0%, #108543 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '26px',
            boxShadow: '0 8px 20px rgba(40, 199, 111, 0.35)'
          }}>
            <i className="fa-solid fa-wheat-awn"></i>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                {getRoadmapText('cardTitle', activeLang)}
              </h2>
              <span style={{
                background: 'rgba(40, 199, 111, 0.2)',
                border: '1px solid #28c76f',
                color: '#28c76f',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {roadmap.totalDays} {getRoadmapText('daysCycle', activeLang)} • {isHindi ? (roadmap.seasonHi || 'रबी') : (roadmap.seasonEn || 'Rabi')}
              </span>
              {sowingDate && (
                <span style={{
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid #38bdf8',
                  color: '#38bdf8',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  <i className="fa-solid fa-calendar-check" style={{ marginRight: '6px' }}></i>
                  {isHindi ? 'बुआई तारीख:' : 'Sown:'} {sowingDate}
                </span>
              )}
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.75)' }}>
              {getRoadmapText('planSubtitle', activeLang, { crop: cropName, area: farmArea, loc: locationName })}
            </p>
          </div>
        </div>
      </div>

      {/* ─── SECTION 1: SOIL & FIELD PREPARATION STRATEGY ─── */}
      <div style={{
        margin: '22px 0',
        padding: '22px',
        borderRadius: '16px',
        background: 'rgba(8, 20, 14, 0.85)',
        border: '1.5px solid rgba(40, 199, 111, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.4rem' }}>🌱</span>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#28c76f', fontWeight: 800 }}>
            {getRoadmapText('sec1Title', activeLang)}
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {/* Ideal Soil & pH */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.72rem', color: '#28c76f', fontWeight: 700, textTransform: 'uppercase' }}>
              {getRoadmapText('idealSoilLabel', activeLang)}
            </span>
            <h4 style={{ margin: '4px 0 2px 0', fontSize: '0.95rem', color: '#ffffff', fontWeight: 700 }}>
              {idealSoil}
            </h4>
            <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600 }}>
              {getRoadmapText('targetPhLabel', activeLang)}: {targetPh}
            </span>
          </div>

          {/* Drainage Requirements */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
              {getRoadmapText('drainageLabel', activeLang)}
            </span>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4' }}>
              {drainageReq}
            </p>
          </div>
        </div>

        {/* Soil Amendment Tips */}
        {amendmentTips && amendmentTips.length > 0 && (
          <div style={{ background: 'rgba(251, 191, 36, 0.08)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.25)' }}>
            <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>
              {getRoadmapText('amendmentLabel', activeLang)}
            </span>
            <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px', fontSize: '0.85rem', color: '#e6f3ec', lineHeight: '1.45' }}>
              {amendmentTips.map((tip, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ─── SECTION 2: SIMPLE PHASE-BY-PHASE ROADMAP (4 STAGES) ─── */}
      <div style={{ margin: '24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '1.4rem' }}>🗺️</span>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
            {getRoadmapText('sec2Title', activeLang)}
          </h3>
        </div>

        {/* Stage Stepper Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '10px',
          marginBottom: '20px',
          scrollbarWidth: 'thin'
        }}>
          {stages.map((stg, idx) => {
            const isSelected = activeStage === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStage(idx)}
                style={{
                  flex: '1',
                  minWidth: '180px',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(40, 199, 111, 0.35) 0%, rgba(16, 133, 67, 0.25) 100%)' 
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '2px solid #28c76f' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? '#28c76f' : 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                    {getRoadmapText('stageLabel', activeLang)} {stg.stageNum || idx + 1}
                  </span>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '8px', color: '#38bdf8', fontWeight: 600 }}>
                    {stg.daysRange}
                  </span>
                </div>
                <strong style={{ fontSize: '0.88rem', lineHeight: '1.3' }}>
                  {stg.title}
                </strong>
              </button>
            );
          })}
        </div>

        {/* Active Stage Details Card */}
        {stages[activeStage] && (() => {
          const curr = stages[activeStage];
          return (
            <div style={{
              background: 'rgba(8, 20, 14, 0.95)',
              border: '1.5px solid rgba(40, 199, 111, 0.35)',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '14px' }}>
                <span style={{ fontSize: '0.78rem', color: '#28c76f', fontWeight: 800, textTransform: 'uppercase' }}>
                  {getRoadmapText('timeFrameLabel', activeLang)}: {curr.daysRange}
                </span>
                <h4 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>
                  {curr.title}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {/* Irrigation Schedule & Visual Checks */}
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <i className="fa-solid fa-droplet" style={{ color: '#38bdf8', fontSize: '18px' }}></i>
                    <h5 style={{ margin: 0, fontSize: '0.95rem', color: '#38bdf8', fontWeight: 800 }}>
                      {getRoadmapText('irrigationScheduleLabel', activeLang)}
                    </h5>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#e6f3ec', lineHeight: '1.5' }}>
                    <li><strong>{getRoadmapText('frequencyLabel', activeLang)}</strong> {curr.waterFrequency}</li>
                    <li><strong>{getRoadmapText('timingLabel', activeLang)}</strong> {curr.exactTiming}</li>
                    <li><strong>{getRoadmapText('visualCheckLabel', activeLang)}</strong> {curr.visualCheck}</li>
                  </ul>
                </div>

                {/* Critical Action Items */}
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(40, 199, 111, 0.3)', borderRadius: '14px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <i className="fa-solid fa-list-check" style={{ color: '#28c76f', fontSize: '18px' }}></i>
                    <h5 style={{ margin: 0, fontSize: '0.95rem', color: '#28c76f', fontWeight: 800 }}>
                      {getRoadmapText('actionItemsLabel', activeLang)}
                    </h5>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#e6f3ec', lineHeight: '1.5' }}>
                    {curr.actionItems && curr.actionItems.map((act, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ─── SECTION 3: GOLDEN RULES FOR IRRIGATION SUCCESS ─── */}
      <div style={{
        margin: '24px 0',
        padding: '22px',
        borderRadius: '16px',
        background: 'rgba(10, 30, 20, 0.8)',
        border: '1.5px solid rgba(56, 189, 248, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <span style={{ fontSize: '1.4rem' }}>🌟</span>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#38bdf8', fontWeight: 800 }}>
            {getRoadmapText('sec3Title', activeLang)}
          </h3>
        </div>
        <ul style={{ margin: 0, paddingLeft: '22px', fontSize: '0.88rem', color: '#e6f3ec', lineHeight: '1.6' }}>
          {goldenRules.map((rule, idx) => (
            <li key={idx} style={{ marginBottom: '8px' }}>{rule}</li>
          ))}
        </ul>
      </div>

      {/* ─── SECTION 4: WARNING FLAGS (UNDERWATERING VS. OVERWATERING) ─── */}
      <div style={{
        margin: '24px 0 0 0',
        padding: '22px',
        borderRadius: '16px',
        background: 'rgba(20, 15, 10, 0.85)',
        border: '1.5px solid rgba(251, 191, 36, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <span style={{ fontSize: '1.4rem' }}>⚠️</span>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fbbf24', fontWeight: 800 }}>
            {getRoadmapText('sec4Title', activeLang)}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {/* Underwatering Warning */}
          <div style={{ background: 'rgba(251, 191, 36, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(251, 191, 36, 0.25)' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#fbbf24', fontWeight: 800 }}>
              {getRoadmapText('underwateringLabel', activeLang)}
            </h4>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#e6f3ec', lineHeight: '1.5' }}>
              {warningFlags.underwatering && warningFlags.underwatering.map((flag, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{flag}</li>
              ))}
            </ul>
          </div>

          {/* Overwatering Warning */}
          <div style={{ background: 'rgba(248, 113, 113, 0.08)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(248, 113, 113, 0.25)' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#f87171', fontWeight: 800 }}>
              {getRoadmapText('overwateringLabel', activeLang)}
            </h4>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#e6f3ec', lineHeight: '1.5' }}>
              {warningFlags.overwatering && warningFlags.overwatering.map((flag, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{flag}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
          <i className="fa-solid fa-circle-check" style={{ color: '#28c76f' }}></i>
          <span>ICAR & KVK Package of Practices • Tailored for {cropName}</span>
        </div>

        <button
          onClick={() => window.print()}
          style={{
            background: 'linear-gradient(135deg, #28c76f 0%, #16964f 100%)',
            border: 'none',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(40, 199, 111, 0.3)'
          }}
        >
          <i className="fa-solid fa-print"></i>
          {getRoadmapText('printBtn', activeLang)}
        </button>
      </div>
    </div>
  );
}
