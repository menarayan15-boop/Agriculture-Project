import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CENTRAL_SCHEMES, STATE_SCHEMES } from '../../data/constants';

// Standard documents & eligibility helper for farmer clarity
function getSchemeHelperDetails(scheme) {
  let eligibility = "All Indian farmers, small & marginal landholders, and agricultural workers.";
  let docs = "Aadhaar Card, Land Record (Khasra/Khatoni), Bank Passbook, Passport Photo.";
  let helpline = "1800-180-1551 (Kisan Call Center / Free)";

  const titleLower = scheme.title.toLowerCase();
  const categoryLower = (scheme.category || '').toLowerCase();

  if (titleLower.includes('pm-kisan') || titleLower.includes('kisan samman')) {
    eligibility = "Landholding farmer families with cultivable land in their name.";
    docs = "Aadhaar Card (linked to Mobile), Bank Account (Aadhaar Seeded), Land Registry Document.";
    helpline = "155261 / 1800115526 (PM-KISAN Toll Free)";
  } else if (titleLower.includes('fasal bima') || titleLower.includes('insurance') || titleLower.includes('pmfby')) {
    eligibility = "All farmers growing notified crops in notified areas (Loanee & Non-loanee).";
    docs = "Aadhaar Card, Land Sowing Certificate, Bank Passbook, Khasra Number.";
    helpline = "1800-200-5142 (PMFBY Toll Free)";
  } else if (titleLower.includes('kusum') || titleLower.includes('solar')) {
    eligibility = "Individual farmers, FPOs, Cooperatives having agriculture land for pump installation.";
    docs = "Aadhaar Card, Land Ownership Proof, Bank Passbook, Electricity Bill (if grid connected).";
    helpline = "1800-180-3333 (MNRE Solar Helpline)";
  } else if (titleLower.includes('credit card') || titleLower.includes('kcc') || titleLower.includes('loan')) {
    eligibility = "Individual farmers, joint borrowers, tenant farmers, oral lessees & SHGs.";
    docs = "Aadhaar Card, PAN Card, Land Revenue Records, Bank Account Details.";
    helpline = "1800-180-1551 / Contact Nearest Bank Branch";
  } else if (titleLower.includes('rythu bandhu') || titleLower.includes('kalia') || titleLower.includes('krushak') || titleLower.includes('magel tyala')) {
    eligibility = "State registered resident farmers with verified land records.";
    docs = "Aadhaar Card, State Residence Proof, Land Record (Pattadar Passbook / 7/12 extract), Bank Passbook.";
  }

  return { eligibility, docs, helpline };
}

export function SchemesTab() {
  const { farmerProfile } = useApp();
  const [subTab, setSubTab] = useState('central'); // 'central' | 'state'
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [expandedSchemeId, setExpandedSchemeId] = useState(null);

  // Sync state selector with user location if available
  useEffect(() => {
    if (farmerProfile?.state) {
      setSelectedState(farmerProfile.state);
    }
  }, [farmerProfile]);

  // Extract unique state names
  const availableStates = Array.from(new Set(STATE_SCHEMES.map(s => s.stateName))).sort();

  // Filter schemes cleanly
  const currentSchemes = subTab === 'central' ? CENTRAL_SCHEMES : STATE_SCHEMES;

  const filteredSchemes = currentSchemes.filter(scheme => {
    // Filter by State if in State schemes tab
    if (subTab === 'state' && selectedState !== 'All') {
      if (scheme.stateName && scheme.stateName.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = scheme.title.toLowerCase().includes(q);
      const matchSubsidy = (scheme.subsidy || '').toLowerCase().includes(q);
      const matchDetails = (scheme.details || '').toLowerCase().includes(q);
      const matchState = scheme.stateName ? scheme.stateName.toLowerCase().includes(q) : false;
      return matchTitle || matchSubsidy || matchDetails || matchState;
    }

    return true;
  });

  return (
    <div className="tab-panel active" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(10, 25, 16, 0.95) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.35)', borderRadius: '18px',
        padding: '24px 26px',
        marginBottom: '0.8rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ 
              background: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa', 
              padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', 
              fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' 
            }}>
              <i className="fa-solid fa-[#60a5fa] fa-building-columns"></i> Official Government Support Portals
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 'bold', margin: '0 0 6px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-hand-holding-hand" style={{ color: '#60a5fa' }}></i> Farmer Government Schemes &amp; Subsidies
            </h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0', fontSize: '0.94rem', lineHeight: '1.5' }}>
              Simple guide to Central &amp; State Government agricultural schemes — direct cash transfers, solar pump subsidies, crop insurance, and low-interest loans.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs: Central Schemes vs State Schemes */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', margin: '0.4rem 0 0.8rem 0' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: '1', minWidth: '280px' }}>
          {/* Central Schemes Button */}
          <button 
            type="button" 
            onClick={() => { setSubTab('central'); setSearch(''); setExpandedSchemeId(null); }} 
            style={{
              flex: '1', minWidth: '220px', padding: '12px 18px', borderRadius: '14px', cursor: 'pointer',
              border: subTab === 'central' ? '2px solid #60a5fa' : '1.5px solid rgba(59, 130, 246, 0.35)',
              fontWeight: 'bold', transition: 'all 0.25s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              background: subTab === 'central' 
                ? 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)' 
                : 'rgba(15, 23, 42, 0.75)',
              color: 'white',
              boxShadow: subTab === 'central' ? '0 6px 22px rgba(37, 99, 235, 0.45)' : 'none',
              transform: subTab === 'central' ? 'translateY(-2px)' : 'none'
            }}>
            <span style={{ 
              fontSize: '1.3rem', width: '36px', height: '36px', borderRadius: '10px', 
              background: subTab === 'central' ? 'rgba(255,255,255,0.2)' : 'rgba(59, 130, 246, 0.15)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>🏛️</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Central Schemes
                <span style={{ 
                  background: subTab === 'central' ? 'rgba(0,0,0,0.3)' : 'rgba(59, 130, 246, 0.25)', 
                  color: subTab === 'central' ? '#bfdbfe' : '#60a5fa', 
                  padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' 
                }}>
                  {CENTRAL_SCHEMES.length}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: subTab === 'central' ? '#dbeafe' : '#93c5fd', fontWeight: 'normal', marginTop: '1px' }}>
                केंद्र सरकार की योजनाएं
              </div>
            </div>
          </button>

          {/* State Schemes Button */}
          <button 
            type="button" 
            onClick={() => { setSubTab('state'); setSearch(''); setExpandedSchemeId(null); }} 
            style={{
              flex: '1', minWidth: '220px', padding: '12px 18px', borderRadius: '14px', cursor: 'pointer',
              border: subTab === 'state' ? '2px solid #c084fc' : '1.5px solid rgba(168, 85, 247, 0.35)',
              fontWeight: 'bold', transition: 'all 0.25s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              background: subTab === 'state' 
                ? 'linear-gradient(135deg, #7e22ce 0%, #a855f7 100%)' 
                : 'rgba(15, 23, 42, 0.75)',
              color: 'white',
              boxShadow: subTab === 'state' ? '0 6px 22px rgba(126, 34, 206, 0.45)' : 'none',
              transform: subTab === 'state' ? 'translateY(-2px)' : 'none'
            }}>
            <span style={{ 
              fontSize: '1.3rem', width: '36px', height: '36px', borderRadius: '10px', 
              background: subTab === 'state' ? 'rgba(255,255,255,0.2)' : 'rgba(168, 85, 247, 0.15)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
            }}>📍</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                State Schemes
                <span style={{ 
                  background: subTab === 'state' ? 'rgba(0,0,0,0.3)' : 'rgba(168, 85, 247, 0.25)', 
                  color: subTab === 'state' ? '#e9d5ff' : '#c084fc', 
                  padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' 
                }}>
                  {STATE_SCHEMES.length}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: subTab === 'state' ? '#f3e8ff' : '#e9d5ff', fontWeight: 'normal', marginTop: '1px' }}>
                राज्य सरकार की योजनाएं
              </div>
            </div>
          </button>
        </div>

        {/* State Filter Dropdown (visible when State Schemes is selected) */}
        {subTab === 'state' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(10, 24, 17, 0.9)', padding: '6px 14px', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
            <i className="fa-solid fa-location-dot" style={{ color: '#c084fc' }}></i>
            <span style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 'bold' }}>Filter State:</span>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              style={{
                background: '#0a1910',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                outline: 'none',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              <option value="All">All States (सभी राज्य)</option>
              {availableStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Simple Search Bar */}
      <div style={{ position: 'relative', width: '100%' }}>
        <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '1.1rem' }}></i>
        <input
          type="text"
          placeholder="🔍 Search scheme by name, amount or benefit (e.g. 6000, solar pump, loan, insurance)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '14px 45px 14px 46px', borderRadius: '14px',
            background: 'rgba(10, 24, 17, 0.95)', border: '1px solid rgba(255, 255, 255, 0.18)',
            color: 'white', fontSize: '0.95rem', outline: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        />
        {search && (
          <button 
            type="button" 
            onClick={() => setSearch('')}
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>
            &times;
          </button>
        )}
      </div>

      {/* Results Header Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
        <span>
          Showing <strong style={{ color: 'white' }}>{filteredSchemes.length}</strong> scheme(s) under <strong style={{ color: subTab === 'central' ? '#60a5fa' : '#c084fc' }}>{subTab === 'central' ? 'Central Government' : (selectedState === 'All' ? 'All State Governments' : selectedState)}</strong>
        </span>
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>💡 Click any scheme to expand full eligibility &amp; documents</span>
      </div>

      {/* Simple, Large Scheme Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => {
            const isExpanded = expandedSchemeId === scheme.id;
            const helper = getSchemeHelperDetails(scheme);
            const cardAccentColor = subTab === 'central' ? '#3b82f6' : '#a855f7';

            return (
              <div 
                key={scheme.id}
                onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                style={{
                  background: isExpanded ? 'rgba(15, 30, 22, 0.96)' : 'rgba(10, 24, 17, 0.88)',
                  border: `1.5px solid ${isExpanded ? cardAccentColor : 'rgba(255, 255, 255, 0.12)'}`,
                  borderRadius: '16px', padding: '22px',
                  cursor: 'pointer', transition: 'all 0.25s ease',
                  boxShadow: isExpanded ? `0 8px 30px ${cardAccentColor}33` : '0 4px 15px rgba(0,0,0,0.2)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Top Row: Icon + Title + Subsidy Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                        background: `${cardAccentColor}20`, border: `1px solid ${cardAccentColor}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.4rem'
                      }}>
                        {scheme.icon || '📋'}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: 'white', lineHeight: '1.35' }}>
                          {scheme.title}
                        </h3>
                        {scheme.stateName && (
                          <div style={{ fontSize: '0.8rem', color: '#c084fc', marginTop: '2px', fontWeight: 'bold' }}>
                            📍 {scheme.stateName} Government
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Benefit Badge */}
                  <div style={{ marginBottom: '14px' }}>
                    <span style={{
                      background: 'rgba(251, 191, 36, 0.18)', border: '1.5px solid rgba(251, 191, 36, 0.4)',
                      color: '#fbbf24', padding: '6px 14px', borderRadius: '20px',
                      fontSize: '0.88rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px'
                    }}>
                      <i className="fa-solid fa-gift"></i> Benefit: {scheme.subsidy}
                    </span>
                  </div>

                  {/* Main Details Summary */}
                  <p style={{ margin: '0 0 14px 0', fontSize: '0.9rem', color: '#e2e8f0', lineHeight: '1.6' }}>
                    {scheme.details}
                  </p>
                </div>

                {/* EXPANDED DETAILS SECTION */}
                {isExpanded ? (
                  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${cardAccentColor}44`, animation: 'fadeIn 0.2s ease' }}
                    onClick={e => e.stopPropagation()}>
                    
                    {/* Eligibility Box */}
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', padding: '12px', marginBottom: '10px' }}>
                      <div style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '0.84rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-solid fa-user-check"></i> Eligibility Criteria (पात्रता):
                      </div>
                      <div style={{ color: '#e2e8f0', fontSize: '0.84rem', lineHeight: '1.4' }}>
                        {helper.eligibility}
                      </div>
                    </div>

                    {/* Required Documents Box */}
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
                      <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: '0.84rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-solid fa-file-invoice"></i> Required Documents (आवश्यक दस्तावेज):
                      </div>
                      <div style={{ color: '#e2e8f0', fontSize: '0.84rem', lineHeight: '1.4' }}>
                        {helper.docs}
                      </div>
                    </div>

                    {scheme.ministry && (
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '12px' }}>
                        🏛️ <strong>Managing Ministry / Department:</strong> {scheme.ministry}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <a
                        href={scheme.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          background: `linear-gradient(135deg, ${cardAccentColor} 0%, ${subTab === 'central' ? '#2563eb' : '#9333ea'} 100%)`,
                          color: 'white', padding: '11px 16px', borderRadius: '10px',
                          textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem',
                          textAlign: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                        }}
                      >
                        <span>Apply on Official Scheme Portal</span>
                        <i className="fa-solid fa-up-right-from-square" style={{ fontSize: '0.8rem' }}></i>
                      </a>

                      <a
                        href={`tel:${helper.helpline.split(' ')[0]}`}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          background: 'rgba(255,255,255,0.06)', color: '#4ade80',
                          border: '1px solid rgba(74, 222, 128, 0.3)', padding: '9px 16px', borderRadius: '10px',
                          textDecoration: 'none', fontWeight: 'bold', fontSize: '0.84rem',
                          textAlign: 'center'
                        }}
                      >
                        <i className="fa-solid fa-phone"></i>
                        <span>Helpline: {helper.helpline}</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.82rem', color: cardAccentColor, fontWeight: 'bold' }}>
                      Tap to view eligibility &amp; apply →
                    </span>
                    <i className="fa-solid fa-chevron-down" style={{ color: '#64748b', fontSize: '0.8rem' }}></i>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'rgba(10, 24, 17, 0.8)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <i className="fa-solid fa-building-columns" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: '12px' }}></i>
            <h3>No schemes found matching your search</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search term or select another state.</p>
          </div>
        )}
      </div>
    </div>
  );
}
