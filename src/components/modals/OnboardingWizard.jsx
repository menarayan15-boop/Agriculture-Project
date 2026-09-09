import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { STATE_DISTRICTS } from '../../data/constants';

export function OnboardingWizard({ onComplete }) {
  const { showOnboarding, setShowOnboarding, skipOnboarding, saveExplicitProfile, lang, explicitProfile } = useApp();
  
  const [step, setStep] = useState(explicitProfile ? 2 : 1);
  
  const [farmScale, setFarmScale] = useState(explicitProfile?.farmScale || '');
  const [state, setState] = useState(explicitProfile?.state || '');
  const [incomeBracket, setIncomeBracket] = useState(explicitProfile?.incomeBracket || '');
  const [experienceLevel, setExperienceLevel] = useState(explicitProfile?.experienceLevel || '');
  const [goals, setGoals] = useState(explicitProfile?.goals || []);

  if (!showOnboarding) return null;

  const states = Object.keys(STATE_DISTRICTS);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);
  
  const toggleGoal = (goal) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal));
    } else {
      if (goals.length < 2) {
        setGoals([...goals, goal]);
      }
    }
  };

  const handleFinish = () => {
    saveExplicitProfile({
      farmScale,
      state,
      incomeBracket,
      experienceLevel,
      goals
    });
    
    setShowOnboarding(false);
    if (onComplete) onComplete();
    
    const toast = document.createElement('div');
    toast.textContent = "Your dashboard is now personalized ✓";
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'var(--primary)';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = 'var(--border-radius-sm)';
    toast.style.fontWeight = 'bold';
    toast.style.zIndex = '10000';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.5s';
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  };

  const handleSkip = () => {
    skipOnboarding();
    setShowOnboarding(false);
    if (onComplete) onComplete();
  }

  const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(17, 24, 39, 0.5)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
  };

  const modalStyle = {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '600px',
    padding: '32px',
    color: '#17211B',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
    animation: 'fadeSlideUp 0.25s ease-out'
  };

  const stepDots = (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} 
             onClick={() => i < step && setStep(i)}
             style={{ 
               width: '12px', height: '12px', borderRadius: '50%',
               background: i === step ? '#15803D' : i < step ? '#166534' : '#E5E7EB',
               cursor: i < step ? 'pointer' : 'default',
               transition: 'background 0.3s'
             }} 
        />
      ))}
    </div>
  );

  const SkipLink = () => (
    <button onClick={handleSkip} style={{
      position: 'absolute', top: '24px', right: '24px',
      background: 'none', border: 'none', color: '#6B7280',
      cursor: 'pointer', textDecoration: 'underline', fontSize: '0.88rem'
    }}>
      Skip for now
    </button>
  );

  const renderWelcome = () => (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2rem' }}>
        🌱
      </div>
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px', color: '#17211B' }}>Let's personalize Krishi Jal for you</h2>
      <p style={{ color: '#4B5563', fontSize: '1rem', marginBottom: '32px', lineHeight: '1.5' }}>
        This takes less than a minute and helps us tailor precision watering, MSP market insights, and agronomic advice to your farm.
      </p>
      <button onClick={handleNext} style={{
        background: '#15803D', color: '#fff', border: 'none',
        padding: '12px 32px', borderRadius: '10px', fontSize: '1rem',
        fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(21,128,61,0.25)'
      }}>
        Get Started
      </button>
    </div>
  );

  const renderFarmScale = () => {
    const scales = [
      { id: 'subsistence', icon: 'fa-seedling', label: 'Subsistence Farmer', desc: 'Small plot, mainly for household needs' },
      { id: 'smallholder', icon: 'fa-tractor', label: 'Smallholder Farmer', desc: 'Small-to-medium scale, some market selling' },
      { id: 'commercial', icon: 'fa-truck-fast', label: 'Commercial Farmer', desc: 'Large-scale, market/export focused' }
    ];

    return (
      <div>
        <h2 style={{ marginBottom: '24px', textAlign: 'center', fontSize: '1.35rem', fontWeight: 800, color: '#17211B' }}>How would you describe your farming operation?</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {scales.map(s => (
            <div key={s.id} onClick={() => setFarmScale(s.id)}
                 style={{
                   padding: '16px 20px', borderRadius: '14px', cursor: 'pointer',
                   border: farmScale === s.id ? '2px solid #15803D' : '1px solid #E5E7EB',
                   background: farmScale === s.id ? '#F0FDF4' : '#FFFFFF',
                   display: 'flex', alignItems: 'center', gap: '16px',
                   transition: 'all 0.2s',
                   boxShadow: farmScale === s.id ? '0 2px 6px rgba(21,128,61,0.1)' : '0 1px 3px rgba(0,0,0,0.02)'
                 }}>
              <i className={`fa-solid ${s.icon}`} style={{ fontSize: '1.8rem', color: farmScale === s.id ? '#15803D' : '#9CA3AF', width: '36px', textAlign: 'center' }}></i>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: farmScale === s.id ? '#15803D' : '#17211B' }}>{s.label}</div>
                <div style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '2px' }}>{s.desc}</div>
              </div>
              {farmScale === s.id && <i className="fa-solid fa-circle-check" style={{ color: '#15803D', fontSize: '1.35rem' }}></i>}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
          <button onClick={handleBack} style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#4B5563', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Back</button>
          <button onClick={handleNext} disabled={!farmScale} style={{ background: farmScale ? '#15803D' : '#E5E7EB', color: farmScale ? '#FFFFFF' : '#9CA3AF', border: 'none', padding: '10px 24px', borderRadius: '10px', cursor: farmScale ? 'pointer' : 'not-allowed', fontWeight: 700 }}>Next</button>
        </div>
      </div>
    );
  };

  const renderLocationIncome = () => {
    const brackets = [
      "Below ₹1,00,000",
      "₹1,00,000 - ₹3,00,000",
      "₹3,00,000 - ₹6,00,000",
      "Above ₹6,00,000",
      "Prefer not to say"
    ];

    return (
      <div>
        <h2 style={{ marginBottom: '20px', fontSize: '1.35rem', fontWeight: 800, color: '#17211B' }}>Location & Income</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.88rem', color: '#374151' }}>State/Region</label>
          <select value={state} onChange={(e) => setState(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#17211B', fontSize: '0.92rem' }}>
            <option value="">Select a state...</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '0.88rem', color: '#374151' }}>Annual household income bracket</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {brackets.map(b => (
              <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px 14px', borderRadius: '10px', background: incomeBracket === b ? '#F0FDF4' : '#FFFFFF', border: incomeBracket === b ? '1px solid #15803D' : '1px solid #E5E7EB' }}>
                <input type="radio" name="income" value={b} checked={incomeBracket === b} onChange={() => setIncomeBracket(b)}
                       style={{ width: '16px', height: '16px', accentColor: '#15803D' }} />
                <span style={{ color: incomeBracket === b ? '#15803D' : '#17211B', fontSize: '0.9rem', fontWeight: incomeBracket === b ? 600 : 400 }}>{b}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
          <button onClick={handleBack} style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#4B5563', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Back</button>
          <button onClick={handleNext} disabled={!state || !incomeBracket} style={{ background: (state && incomeBracket) ? '#15803D' : '#E5E7EB', color: (state && incomeBracket) ? '#FFFFFF' : '#9CA3AF', border: 'none', padding: '10px 24px', borderRadius: '10px', cursor: (state && incomeBracket) ? 'pointer' : 'not-allowed', fontWeight: 700 }}>Next</button>
        </div>
      </div>
    );
  };

  const renderExperienceGoals = () => {
    const expLevels = [
      { id: 'new', label: 'New', desc: '0-2 yrs' },
      { id: 'growing', label: 'Growing', desc: '2-5 yrs' },
      { id: 'experienced', label: 'Experienced', desc: '5-15 yrs' },
      { id: 'veteran', label: 'Veteran', desc: '15+ yrs' }
    ];

    const allGoals = [
      "Increasing yield", "Reducing costs", "Learning modern techniques",
      "Getting government subsidies", "Managing water/irrigation", "Selling produce better"
    ];

    return (
      <div>
        <h2 style={{ marginBottom: '20px', fontSize: '1.35rem', fontWeight: 800, color: '#17211B' }}>Experience & Goals</h2>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '0.88rem', color: '#374151' }}>How many years have you been farming?</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {expLevels.map(lvl => (
              <button key={lvl.id} onClick={() => setExperienceLevel(lvl.id)}
                      style={{
                        flex: '1 1 100px', padding: '12px 8px', borderRadius: '10px', cursor: 'pointer',
                        background: experienceLevel === lvl.id ? '#DCFCE7' : '#FFFFFF',
                        border: experienceLevel === lvl.id ? '1px solid #15803D' : '1px solid #E5E7EB',
                        color: experienceLevel === lvl.id ? '#15803D' : '#4B5563',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
                      }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{lvl.label}</span>
                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{lvl.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '0.88rem', color: '#374151' }}>
            What are your top 2 goals right now? <span style={{fontWeight: 'normal', color: '#6B7280'}}>(Select up to 2)</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {allGoals.map(g => {
              const isSelected = goals.includes(g);
              const isDisabled = !isSelected && goals.length >= 2;
              return (
                <button key={g} onClick={() => toggleGoal(g)} disabled={isDisabled}
                        style={{
                          padding: '7px 14px', borderRadius: '20px', cursor: isDisabled ? 'not-allowed' : 'pointer',
                          background: isSelected ? '#15803D' : '#FFFFFF',
                          border: isSelected ? '1px solid #15803D' : '1px solid #E5E7EB',
                          color: isSelected ? '#FFFFFF' : isDisabled ? '#9CA3AF' : '#374151',
                          opacity: isDisabled ? 0.6 : 1,
                          fontSize: '0.85rem', fontWeight: isSelected ? 600 : 400
                        }}>
                  {isSelected && <i className="fa-solid fa-check" style={{marginRight: '6px'}}></i>}
                  {g}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
          <button onClick={handleBack} style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#4B5563', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>Back</button>
          <button onClick={handleNext} disabled={!experienceLevel || goals.length === 0} style={{ background: (experienceLevel && goals.length > 0) ? '#15803D' : '#E5E7EB', color: (experienceLevel && goals.length > 0) ? '#FFFFFF' : '#9CA3AF', border: 'none', padding: '10px 24px', borderRadius: '10px', cursor: (experienceLevel && goals.length > 0) ? 'pointer' : 'not-allowed', fontWeight: 700 }}>Next</button>
        </div>
      </div>
    );
  };

  const renderReview = () => {
    return (
      <div>
        <h2 style={{ marginBottom: '6px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 800, color: '#17211B' }}>All Set!</h2>
        <p style={{ color: '#6B7280', textAlign: 'center', marginBottom: '20px', fontSize: '0.9rem' }}>Review your profile before we personalize your dashboard.</p>
        
        <div style={{ background: '#F8FAF9', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Operation Scale</span>
            <span style={{ fontWeight: 'bold', textTransform: 'capitalize', color: '#17211B' }}>{farmScale}</span>
            <i className="fa-solid fa-pen" onClick={() => setStep(2)} style={{ color: '#15803D', cursor: 'pointer', fontSize: '0.85rem' }}></i>
          </div>
          <div style={{ height: '1px', background: '#E5E7EB' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Location</span>
            <span style={{ fontWeight: 'bold', color: '#17211B' }}>{state}</span>
            <i className="fa-solid fa-pen" onClick={() => setStep(3)} style={{ color: '#15803D', cursor: 'pointer', fontSize: '0.85rem' }}></i>
          </div>
          <div style={{ height: '1px', background: '#E5E7EB' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Experience</span>
            <span style={{ fontWeight: 'bold', textTransform: 'capitalize', color: '#17211B' }}>{experienceLevel}</span>
            <i className="fa-solid fa-pen" onClick={() => setStep(4)} style={{ color: '#15803D', cursor: 'pointer', fontSize: '0.85rem' }}></i>
          </div>
        </div>

        <button onClick={handleFinish} style={{
          width: '100%', marginTop: '24px', background: '#15803D', color: '#fff', border: 'none',
          padding: '14px', borderRadius: '12px', fontSize: '1.05rem',
          fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(21,128,61,0.25)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
        }}>
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          Generate Dashboard
        </button>
      </div>
    );
  };

  return (
    <div style={overlayStyle}>
      <style>
        {`
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <div style={modalStyle}>
        {step === 1 && <SkipLink />}
        {step > 1 && stepDots}
        
        {step === 1 && renderWelcome()}
        {step === 2 && renderFarmScale()}
        {step === 3 && renderLocationIncome()}
        {step === 4 && renderExperienceGoals()}
        {step === 5 && renderReview()}
      </div>
    </div>
  );
}
