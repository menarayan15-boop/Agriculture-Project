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
        background: '#FFFFFF',
        border: '1.5px solid #E5E7EB',
        borderRadius: '16px',
        padding: '32px 24px',
        textAlign: 'center',
        marginTop: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#DCFCE7',
          color: '#15803D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          margin: '0 auto 12px auto'
        }}>
          <i className="fa-solid fa-seedling"></i>
        </div>
        <h3 style={{ color: '#17211B', margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>
          {getRoadmapText('cardTitle', activeLang)}
        </h3>
        <p style={{ color: '#4B5563', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto 16px auto', lineHeight: '1.5' }}>
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
      background: '#FFFFFF',
      border: '1.5px solid #E5E7EB',
      borderRadius: '20px',
      padding: '28px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
      marginTop: '24px',
      color: '#17211B'
    }}>
      {/* ─── HEADER BANNER ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '20px',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: '#15803D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '26px',
            boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)'
          }}>
            <i className="fa-solid fa-wheat-awn"></i>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#17211B', letterSpacing: '-0.02em' }}>
                {getRoadmapText('cardTitle', activeLang)}
              </h2>
              <span style={{
                background: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#166534',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {roadmap.totalDays} {getRoadmapText('daysCycle', activeLang)} • {isHindi ? (roadmap.seasonHi || 'रबी') : (roadmap.seasonEn || 'Rabi')}
              </span>
              {sowingDate && (
                <span style={{
                  background: '#E0F2FE',
                  border: '1px solid #BAE6FD',
                  color: '#0369A1',
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
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#4B5563' }}>
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
        background: '#F0FDF4',
        border: '1.5px solid #BBF7D0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.4rem' }}>🌱</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#15803D', fontWeight: 800 }}>
            {getRoadmapText('sec1Title', activeLang)}
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {/* Ideal Soil & pH */}
          <div style={{ background: '#FFFFFF', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.72rem', color: '#15803D', fontWeight: 700, textTransform: 'uppercase' }}>
              {getRoadmapText('idealSoilLabel', activeLang)}
            </span>
            <h4 style={{ margin: '4px 0 2px 0', fontSize: '0.95rem', color: '#17211B', fontWeight: 700 }}>
              {idealSoil}
            </h4>
            <span style={{ fontSize: '0.82rem', color: '#0284C7', fontWeight: 600 }}>
              {getRoadmapText('targetPhLabel', activeLang)}: {targetPh}
            </span>
          </div>

          {/* Drainage Requirements */}
          <div style={{ background: '#FFFFFF', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.72rem', color: '#0284C7', fontWeight: 700, textTransform: 'uppercase' }}>
              {getRoadmapText('drainageLabel', activeLang)}
            </span>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#374151', lineHeight: '1.4' }}>
              {drainageReq}
            </p>
          </div>
        </div>

        {/* Soil Amendment Tips */}
        {amendmentTips && amendmentTips.length > 0 && (
          <div style={{ background: '#FEF3C7', padding: '14px 16px', borderRadius: '12px', border: '1px solid #FDE68A' }}>
            <span style={{ fontSize: '0.78rem', color: '#B45309', fontWeight: 700, textTransform: 'uppercase' }}>
              {getRoadmapText('amendmentLabel', activeLang)}
            </span>
            <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px', fontSize: '0.85rem', color: '#92400E', lineHeight: '1.45' }}>
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
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#17211B', fontWeight: 800 }}>
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
                  background: isSelected ? '#F0FDF4' : '#F8FAF9',
                  border: isSelected ? '2px solid #15803D' : '1px solid #E5E7EB',
                  color: isSelected ? '#15803D' : '#4B5563',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isSelected ? '#15803D' : '#6B7280', textTransform: 'uppercase' }}>
                    {getRoadmapText('stageLabel', activeLang)} {stg.stageNum || idx + 1}
                  </span>
                  <span style={{ fontSize: '0.7rem', background: isSelected ? '#DCFCE7' : '#E5E7EB', padding: '2px 8px', borderRadius: '8px', color: isSelected ? '#166534' : '#374151', fontWeight: 700 }}>
                    {stg.daysRange}
                  </span>
                </div>
                <strong style={{ fontSize: '0.88rem', lineHeight: '1.3', color: '#17211B' }}>
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
              background: '#F8FAF9',
              border: '1.5px solid #E5E7EB',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '14px' }}>
                <span style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase' }}>
                  {getRoadmapText('timeFrameLabel', activeLang)}: {curr.daysRange}
                </span>
                <h4 style={{ margin: '4px 0 0 0', fontSize: '1.15rem', color: '#17211B', fontWeight: 800 }}>
                  {curr.title}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {/* Irrigation Schedule & Visual Checks */}
                <div style={{ background: '#FFFFFF', border: '1px solid #BAE6FD', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <i className="fa-solid fa-droplet" style={{ color: '#0284C7', fontSize: '18px' }}></i>
                    <h5 style={{ margin: 0, fontSize: '0.95rem', color: '#0284C7', fontWeight: 800 }}>
                      {getRoadmapText('irrigationScheduleLabel', activeLang)}
                    </h5>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#374151', lineHeight: '1.5' }}>
                    <li><strong>{getRoadmapText('frequencyLabel', activeLang)}</strong> {curr.waterFrequency}</li>
                    <li><strong>{getRoadmapText('timingLabel', activeLang)}</strong> {curr.exactTiming}</li>
                    <li><strong>{getRoadmapText('visualCheckLabel', activeLang)}</strong> {curr.visualCheck}</li>
                  </ul>
                </div>

                {/* Critical Action Items */}
                <div style={{ background: '#FFFFFF', border: '1px solid #BBF7D0', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <i className="fa-solid fa-list-check" style={{ color: '#15803D', fontSize: '18px' }}></i>
                    <h5 style={{ margin: 0, fontSize: '0.95rem', color: '#15803D', fontWeight: 800 }}>
                      {getRoadmapText('actionItemsLabel', activeLang)}
                    </h5>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#374151', lineHeight: '1.5' }}>
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
        background: '#EFF6FF',
        border: '1.5px solid #BFDBFE'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <span style={{ fontSize: '1.4rem' }}>🌟</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1D4ED8', fontWeight: 800 }}>
            {getRoadmapText('sec3Title', activeLang)}
          </h3>
        </div>
        <ul style={{ margin: 0, paddingLeft: '22px', fontSize: '0.88rem', color: '#1E3A8A', lineHeight: '1.6' }}>
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
        background: '#FFFBEB',
        border: '1.5px solid #FDE68A'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <span style={{ fontSize: '1.4rem' }}>⚠️</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#B45309', fontWeight: 800 }}>
            {getRoadmapText('sec4Title', activeLang)}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {/* Underwatering Warning */}
          <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #FDE68A' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#B45309', fontWeight: 800 }}>
              {getRoadmapText('underwateringLabel', activeLang)}
            </h4>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#78350F', lineHeight: '1.5' }}>
              {warningFlags.underwatering && warningFlags.underwatering.map((flag, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{flag}</li>
              ))}
            </ul>
          </div>

          {/* Overwatering Warning */}
          <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #FECACA' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#B91C1C', fontWeight: 800 }}>
              {getRoadmapText('overwateringLabel', activeLang)}
            </h4>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', color: '#7F1D1D', lineHeight: '1.5' }}>
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
        borderTop: '1px solid #E5E7EB',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#4B5563' }}>
          <i className="fa-solid fa-circle-check" style={{ color: '#15803D' }}></i>
          <span>ICAR & KVK Package of Practices • Tailored for {cropName}</span>
        </div>

        <button
          onClick={() => window.print()}
          style={{
            background: '#15803D',
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
            boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)'
          }}
        >
          <i className="fa-solid fa-print"></i>
          {getRoadmapText('printBtn', activeLang)}
        </button>
      </div>
    </div>
  );
}
