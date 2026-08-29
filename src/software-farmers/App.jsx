import React, { useState, useEffect } from 'react';
import { subscribeToBackend } from './utils/apiSimulator';
import { liveEngine } from './services/liveEngine';
import TerminalLogs from './components/TerminalLogs';
import WebDashboard from './components/WebDashboard';
import MobilePWA from './components/MobilePWA';
import SMSSimulator from './components/SMSSimulator';
import VoiceIVR from './components/VoiceIVR';
import VillageKiosk from './components/VillageKiosk';
import IoTController from './components/IoTController';
import FarmerRegistry from './components/FarmerRegistry';
import CropHealthModule from './components/CropHealthModule';
import FarmerApp from './components/SimpleMode/FarmerApp';
import CommandCenter from './components/CommandCenter';
import FarmerHealthModule from './components/FarmerHealthModule';
import DemoSimulationPanel from './components/DemoSimulationPanel';
import USSDSimulator from './components/USSDSimulator';
import LanguageSelector from './components/LanguageSelector';
import { useLang } from './i18n/LanguageContext';
import { LayoutDashboard, Smartphone, MessageSquare, Cpu, Landmark, Database, Users, Microscope, Wifi, ChevronRight, Zap, ShieldPlus } from 'lucide-react';

// ── Tab definitions with farmer-friendly labels ───────────────────────────────
const TABS = [
  { id: 'web', icon: LayoutDashboard, emoji: '🌾', labelKey: 'nav_farm', label: 'My Farm', sublabelKey: 'nav_farm_sub', sublabel: 'Dashboard' },
  { id: 'health', icon: ShieldPlus, emoji: '❤️', labelKey: 'nav_health', label: 'My Health', sublabelKey: 'nav_health_sub', sublabel: 'Safety Center' },
  { id: 'crophealth', icon: Microscope, emoji: '🔬', labelKey: 'nav_crophealth', label: 'Crop Health', sublabelKey: 'nav_crophealth_sub', sublabel: 'Disease Check' },
  { id: 'iot', icon: Cpu, emoji: '💧', labelKey: 'nav_iot', label: 'Water Control', sublabelKey: 'nav_iot_sub', sublabel: 'Pump & Sprinkler' },
  { id: 'kiosk', icon: Landmark, emoji: '🏛️', labelKey: 'nav_kiosk', label: 'Village Kiosk', sublabelKey: 'nav_kiosk_sub', sublabel: 'Easy Access' },
  { id: 'pwa', icon: Smartphone, emoji: '📱', labelKey: 'nav_pwa', label: 'Mobile App', sublabelKey: 'nav_pwa_sub', sublabel: 'Phone View' },
  { id: 'phone', icon: MessageSquare, emoji: '📞', labelKey: 'nav_sms', label: 'SMS & Call', sublabelKey: 'nav_phone_sub', sublabel: 'Basic Phone' },
  { id: 'command', icon: Zap, emoji: '🎬', labelKey: 'nav_demo', label: 'SIH Demo', sublabelKey: 'nav_demo_sub', sublabel: 'Command Center' },
  { id: 'registry', icon: Users, emoji: '👨‍🌾', labelKey: 'nav_registry', label: 'Farmers', sublabelKey: 'nav_registry_sub', sublabel: 'Register / Login' },
];

function App() {
  const { lang, setLang, t, formatNum } = useLang();
  const [dbState, setDbState] = useState(null);
  const [activeTab, setActiveTab] = useState('web');
  const [showConsole, setShowConsole] = useState(false);
  const [appMode, setAppMode] = useState(window.innerWidth < 768 ? 'FARMER' : 'SIH_DEMO');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Global click listener for Ripple UI
    const handleRippleClick = (e) => {
      const btn = e.target.closest('.btn-smart, [class*="btn-glass-"]');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const circle = document.createElement('span');
      circle.classList.add('ripple-elem');
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
      btn.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 600);
    };

    document.addEventListener('mousedown', handleRippleClick);

    // Connectivity monitoring
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    // PWA Install Prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Existing Backend listener
    const unsubscribe = subscribeToBackend((state) => setDbState(state));
    setDbState(window.__USFP_STATE__ || null);
    import('./utils/apiSimulator').then(({ api }) => {
      api.getFarmData().then(res => setDbState(res.data));
    });

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleRippleClick);
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const activeFarmer = dbState?.registeredFarmers?.find(f => f.id === dbState?.activeFarmerId) || dbState?.farmer;

  // (Removed automatic db-to-UI language sync to prevent race conditions with the explicit LanguageSelector component)

  if (!dbState) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <div style={{ width: '40px', height: '40px', border: '3px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#94a3b8' }}>Starting SmartFarm...</p>
        </div>
      </div>
    );
  }

  // Quick app mode toggle inlined to prevent React re-mount thrashing issue

  if (appMode === 'FARMER') {
    return (
      <>
        <FarmerApp dbState={dbState} />
        <div className="fixed bottom-4 right-4 z-[999999] bg-slate-900 border border-slate-700 p-1 rounded-full flex gap-1 shadow-2xl backdrop-blur-md scale-75 origin-bottom-right opacity-80 hover:opacity-100 transition-opacity">
          <button onClick={() => { setAppMode('FARMER'); setActiveTab('web'); liveEngine.setMode('LIVE'); }} className={`px-3 py-1.5 flex items-center gap-2 rounded-full font-bold text-xs tracking-wide transition-all duration-300 font-display ${appMode === 'FARMER' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_4px_10px_rgba(16,185,129,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <span className="text-sm">🌾</span> {t("Farmer")}
          </button>
          <button onClick={() => { setAppMode('SIH_DEMO'); setActiveTab('command'); liveEngine.setMode('SIMULATION'); }} className={`px-3 py-1.5 flex items-center gap-2 rounded-full font-bold text-xs tracking-wide transition-all duration-300 font-display ${appMode === 'SIH_DEMO' ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-[0_4px_10px_rgba(79,70,229,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <span className="text-sm">🛠️</span> {t("Simulation Mode")}
          </button>
        </div>
      </>
    );
  }

  const { farm, weather } = dbState;

  return (
    <div className="app-root">
      <div className="fixed bottom-4 right-4 z-[999999] bg-slate-900 border border-slate-700 p-1 rounded-full flex gap-1 shadow-2xl backdrop-blur-md scale-75 origin-bottom-right opacity-80 hover:opacity-100 transition-opacity">
        <button onClick={() => { setAppMode('FARMER'); setActiveTab('web'); liveEngine.setMode('LIVE'); }} className={`px-3 py-1.5 flex items-center gap-2 rounded-full font-bold text-xs tracking-wide transition-all duration-300 font-display ${appMode === 'FARMER' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_4px_10px_rgba(16,185,129,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <span className="text-sm">🌾</span> {t("Farmer")}
        </button>
        <button onClick={() => { setAppMode('SIH_DEMO'); setActiveTab('command'); liveEngine.setMode('SIMULATION'); }} className={`px-3 py-1.5 flex items-center gap-2 rounded-full font-bold text-xs tracking-wide transition-all duration-300 font-display ${appMode === 'SIH_DEMO' ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-[0_4px_10px_rgba(79,70,229,0.4)]' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <span className="text-sm">🛠️</span> {t("Simulation Mode")}
        </button>
      </div>
      {appMode === 'SIH_DEMO' && <DemoSimulationPanel dbState={dbState} />}

      {/* ── OFFLINE BANNER ───────────────────────────────────────────────── */}
      {!isOnline && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999998,
          background: 'linear-gradient(90deg, #b91c1c, #dc2626)',
          color: 'white', textAlign: 'center', padding: '6px 16px',
          fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          📡 {t('status_offline')} — {t("SmartFarm is running from cached data.")}
        </div>
      )}

      {/* ── PWA INSTALL BANNER ───────────────────────────────────────────── */}
      {showInstallBanner && deferredPrompt && (
        <div style={{
          position: 'fixed', top: isOnline ? 0 : '28px', left: 0, right: 0, zIndex: 999997,
          background: 'linear-gradient(90deg, #059669, #10b981)',
          color: 'white', textAlign: 'center', padding: '8px 16px',
          fontSize: '12px', fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
        }}>
          📲 Install SmartFarm on your phone for offline access
          <button onClick={async () => {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            setDeferredPrompt(null);
            setShowInstallBanner(false);
          }} style={{
            background: 'white', color: '#059669', border: 'none', borderRadius: '6px',
            padding: '4px 12px', fontWeight: 700, fontSize: '11px', cursor: 'pointer'
          }}>Install</button>
          <button onClick={() => setShowInstallBanner(false)} style={{
            background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: '6px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer'
          }}>✕</button>
        </div>
      )}
      {/* ── TOP HEADER ─────────────────────────────────────────────────────── */}
      <header className="app-header-v2">
        <div className="header-brand">
          <span className="header-logo">🌾</span>
          <div>
            <div className="header-title">{t("SmartFarm")}</div>
            <div className="header-sub">{t("Agricultural Intelligence Platform")}</div>
          </div>
        </div>

        {/* Quick status strip */}
        <div className="header-status-strip">
          <div className={`hss-chip ${isOnline ? 'online' : ''}`} style={!isOnline ? { background: 'rgba(220,38,38,0.2)', borderColor: 'rgba(220,38,38,0.4)' } : {}}>
            <span className="hss-dot" style={!isOnline ? { background: '#dc2626' } : {}} />
            {isOnline ? t('status_online') : t('status_offline')}
          </div>
          <div className="hss-chip">
            💧 {t('soil_moisture')}: <strong>{formatNum(farm.soilMoisture)}%</strong>
          </div>
          <div className="hss-chip">
            🌡️ {formatNum(weather.temp)}°C
          </div>
          <div className="hss-chip">
            🌧️ {t("Rain")}: {formatNum(weather.rainProbability)}%
          </div>
          <button
            className={`hss-chip console-toggle ${showConsole ? 'active' : ''}`}
            onClick={() => setShowConsole(v => !v)}
          >
            📋 {t("System Log")}
          </button>
          <LanguageSelector />
        </div>

        {/* Farmer identity */}
        <div className="header-farmer-id">
          <div className="farmer-avatar">👨‍🌾</div>
          <div>
            <div className="farmer-name">{t(activeFarmer?.name || 'Guest')}</div>
            <div className="farmer-id-tag">ID: {formatNum(activeFarmer?.id || '—')}</div>
          </div>
        </div>
      </header>

      {/* ── MAIN LAYOUT ────────────────────────────────────────────────────── */}
      <div className="app-body-v2">

        {/* ── LEFT: Icon tab sidebar (desktop) / bottom bar (mobile) ───────── */}
        <nav className="sidebar-nav">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`sidebar-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-label={t(tab.labelKey || tab.label)}
              >
                <span className="stb-emoji">{tab.emoji}</span>
                <div className="stb-labels">
                  <span className="stb-label">{t(tab.labelKey || tab.label)}</span>
                  <span className="stb-sub">{t(tab.sublabelKey || tab.sublabel)}</span>
                </div>
                {isActive && <ChevronRight size={16} className="stb-arrow" />}
              </button>
            );
          })}
        </nav>

        {/* ── CENTER: Main content ──────────────────────────────────────────── */}
        <main className="content-area">
          <div className="content-inner-wrapper">
            {/* Active tab label breadcrumb */}
            <div className="content-breadcrumb">
              <span className="cb-emoji">{TABS.find(t => t.id === activeTab)?.emoji}</span>
              <div>
                <div className="cb-title">{t(TABS.find(tx => tx.id === activeTab)?.labelKey || TABS.find(tx => tx.id === activeTab)?.label)}</div>
                <div className="cb-sub">{t(TABS.find(tx => tx.id === activeTab)?.sublabelKey || TABS.find(tx => tx.id === activeTab)?.sublabel)}</div>
              </div>
            </div>

            {/* Tab panels */}
            <div className="tab-panel">
              {activeTab === 'web' && <WebDashboard dbState={dbState} />}
              {activeTab === 'health' && <FarmerHealthModule dbState={dbState} />}
              {activeTab === 'crophealth' && <CropHealthModule dbState={dbState} />}
              {activeTab === 'iot' && <IoTController dbState={dbState} />}
              {activeTab === 'kiosk' && <VillageKiosk dbState={dbState} />}
              {activeTab === 'pwa' && <MobilePWA dbState={dbState} />}
              {activeTab === 'phone' && (
                <div className="three-col-phone">
                  <SMSSimulator dbState={dbState} />
                  <VoiceIVR dbState={dbState} />
                  <USSDSimulator dbState={dbState} />
                </div>
              )}
              {activeTab === 'command' && (
                <div className="w-full mx-auto relative pt-4">
                  <CommandCenter dbState={dbState} />
                </div>
              )}
              {activeTab === 'registry' && <FarmerRegistry dbState={dbState} />}
            </div>
          </div>
        </main>

        {/* ── RIGHT: System log (collapsible) ─────────────────────────────── */}
        {showConsole && (
          <aside className="console-sidebar">
            <TerminalLogs logs={dbState.systemLogs} dbState={dbState} />
          </aside>
        )}
      </div>

      {/* ── BOTTOM NAV (mobile only) ────────────────────────────────────────── */}
      <nav className="bottom-nav">
        {TABS.slice(0, 5).map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`bnav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="bnav-emoji">{tab.emoji}</span>
              <span className="bnav-label">{t(tab.labelKey || tab.label)}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}

export default App;
