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
    background: 'rgba(17, 24, 39, 0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
  };

  const modalStyle = {
    background: 'var(--bg-gradient)',
    borderTop: '4px solid var(--secondary)',
    borderLeft: '1px solid var(--card-border)',
    borderRight: '1px solid var(--card-border)',
    borderBottom: '1px solid var(--card-border)',
    borderRadius: 'var(--border-radius-lg)',
    width: '100%',
    maxWidth: '600px',
    padding: '32px',
    color: 'var(--text-primary)',
    position: 'relative',
    boxShadow: 'var(--shadow-lg)',
    animation: 'fadeSlideUp 0.25s ease-out'
  };

  const stepDots = (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} 
             onClick={() => i < step && setStep(i)}
             style={{ 
               width: '12px', height: '12px', borderRadius: '50%',
               background: i === step ? 'var(--primary-light)' : i < step ? 'var(--primary-dark)' : 'var(--border-color)',
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
      background: 'none', border: 'none', color: 'var(--text-secondary)',
      cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem'
    }}>
      Skip for now
    </button>
  );

  const renderWelcome = () => (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <i className="fa-solid fa-seedling" style={{ fontSize: '3rem', color: 'var(--primary-light)', marginBottom: '16px' }}></i>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '12px', fontFamily: "'Fraunces', serif" }}>Let's personalize Krishi Jal for you</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.5' }}>
        This takes less than a minute and helps us tailor tools, schemes, and advice to your farm.
      </p>
      <button onClick={handleNext} style={{
        background: 'var(--primary)', color: '#fff', border: 'none',
        padding: '14px 32px', borderRadius: 'var(--border-radius-sm)', fontSize: '1.1rem',
        fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--shadow-md)'
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
        <h2 style={{ marginBottom: '24px', textAlign: 'center', fontFamily: "'Fraunces', serif" }}>How would you describe your farming operation?</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {scales.map(s => (
            <div key={s.id} onClick={() => setFarmScale(s.id)}
                 style={{
                   padding: '20px', borderRadius: 'var(--border-radius-md)', cursor: 'pointer',
                   border: farmScale === s.id ? '2px solid var(--primary-light)' : '1px solid var(--border-color)',
                   background: farmScale === s.id ? 'rgba(21, 128, 61, 0.15)' : 'var(--card-bg)',
                   display: 'flex', alignItems: 'center', gap: '20px',
                   transition: 'all 0.2s'
                 }}>
              <i className={`fa-solid ${s.icon}`} style={{ fontSize: '2rem', color: farmScale === s.id ? 'var(--primary-light)' : 'var(--text-secondary)', width: '40px', textAlign: 'center' }}></i>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: farmScale === s.id ? '#fff' : 'var(--text-primary)' }}>{s.label}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{s.desc}</div>
              </div>
              {farmScale === s.id && <i className="fa-solid fa-circle-check" style={{ color: 'var(--primary-light)', fontSize: '1.5rem' }}></i>}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
          <button onClick={handleBack} style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-secondary)', padding: '10px 24px', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer' }}>Back</button>
          <button onClick={handleNext} disabled={!farmScale} style={{ background: farmScale ? 'var(--primary)' : 'var(--border-color)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 'var(--border-radius-sm)', cursor: farmScale ? 'pointer' : 'not-allowed' }}>Next</button>
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
        <h2 style={{ marginBottom: '24px', fontFamily: "'Fraunces', serif" }}>Location & Income</h2>
        
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--text-primary)' }}>State/Region</label>
          <select value={state} onChange={(e) => setState(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '1rem' }}>
            <option value="">Select a state...</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Annual household income bracket</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {brackets.map(b => (
              <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', borderRadius: 'var(--border-radius-sm)', background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                <input type="radio" name="income" value={b} checked={incomeBracket === b} onChange={() => setIncomeBracket(b)}
                       style={{ width: '18px', height: '18px', accentColor: 'var(--primary-light)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{b}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
          <button onClick={handleBack} style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-secondary)', padding: '10px 24px', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer' }}>Back</button>
          <button onClick={handleNext} disabled={!state || !incomeBracket} style={{ background: (state && incomeBracket) ? 'var(--primary)' : 'var(--border-color)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 'var(--border-radius-sm)', cursor: (state && incomeBracket) ? 'pointer' : 'not-allowed' }}>Next</button>
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
        <h2 style={{ marginBottom: '24px', fontFamily: "'Fraunces', serif" }}>Experience & Goals</h2>
        
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>How many years have you been farming?</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {expLevels.map(lvl => (
              <button key={lvl.id} onClick={() => setExperienceLevel(lvl.id)}
                      style={{
                        flex: '1 1 100px', padding: '12px 8px', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer',
                        background: experienceLevel === lvl.id ? 'rgba(21, 128, 61, 0.15)' : 'var(--card-bg)',
                        border: experienceLevel === lvl.id ? '1px solid var(--primary-light)' : '1px solid var(--border-color)',
                        color: experienceLevel === lvl.id ? 'var(--primary-light)' : 'var(--text-secondary)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                      }}>
                <span style={{ fontWeight: 'bold' }}>{lvl.label}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lvl.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            What are your top 2 goals right now? <span style={{fontWeight: 'normal', color: 'var(--text-secondary)'}}>(Select up to 2)</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {allGoals.map(g => {
              const isSelected = goals.includes(g);
              const isDisabled = !isSelected && goals.length >= 2;
              return (
                <button key={g} onClick={() => toggleGoal(g)} disabled={isDisabled}
                        style={{
                          padding: '8px 16px', borderRadius: '20px', cursor: isDisabled ? 'not-allowed' : 'pointer',
                          background: isSelected ? 'var(--primary)' : 'var(--card-bg)',
                          border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                          color: isSelected ? '#fff' : isDisabled ? 'var(--text-muted)' : 'var(--text-primary)',
                          opacity: isDisabled ? 0.5 : 1,
                          fontSize: '0.9rem'
                        }}>
                  {isSelected && <i className="fa-solid fa-check" style={{marginRight: '6px'}}></i>}
                  {g}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
          <button onClick={handleBack} style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-secondary)', padding: '10px 24px', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer' }}>Back</button>
          <button onClick={handleNext} disabled={!experienceLevel || goals.length === 0} style={{ background: (experienceLevel && goals.length > 0) ? 'var(--primary)' : 'var(--border-color)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 'var(--border-radius-sm)', cursor: (experienceLevel && goals.length > 0) ? 'pointer' : 'not-allowed' }}>Next</button>
        </div>
      </div>
    );
  };

  const renderReview = () => {
    return (
      <div>
        <h2 style={{ marginBottom: '8px', textAlign: 'center', fontFamily: "'Fraunces', serif" }}>All Set!</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>Review your profile before we build your dashboard.</p>
        
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Operation Scale</span>
            <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{farmScale}</span>
            <i className="fa-solid fa-pen" onClick={() => setStep(2)} style={{ color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}></i>
          </div>
          <div style={{ height: '1px', background: 'var(--border-color)' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Location</span>
            <span style={{ fontWeight: 'bold' }}>{state}</span>
            <i className="fa-solid fa-pen" onClick={() => setStep(3)} style={{ color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}></i>
          </div>
          <div style={{ height: '1px', background: 'var(--border-color)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Experience</span>
            <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{experienceLevel}</span>
            <i className="fa-solid fa-pen" onClick={() => setStep(4)} style={{ color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}></i>
          </div>
        </div>

        <button onClick={handleFinish} style={{
          width: '100%', marginTop: '32px', background: 'var(--primary)', color: '#fff', border: 'none',
          padding: '16px', borderRadius: 'var(--border-radius-md)', fontSize: '1.2rem',
          fontWeight: 'bold', cursor: 'pointer', boxShadow: 'var(--shadow-md)',
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
