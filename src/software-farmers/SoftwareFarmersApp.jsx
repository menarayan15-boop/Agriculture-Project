import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLang } from './i18n/LanguageContext';
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
import AdminDashboard from './components/AdminDashboard';
import DigitalTwin from './components/DigitalTwin';
import ImpactDashboard from './components/ImpactDashboard';
import './index.css';
import './App.css';
import { 
  LayoutDashboard, 
  Smartphone, 
  MessageSquare, 
  Cpu, 
  Landmark, 
  Users, 
  Microscope, 
  ChevronRight, 
  Zap, 
  ShieldPlus,
  ArrowLeft,
  Sparkles,
  Home,
  Layers,
  ShieldCheck,
  Globe,
  Sprout
} from 'lucide-react';

// ── Tab definitions with comprehensive feature set ───────────────────────────
const TABS = [
  { id: 'web', icon: LayoutDashboard, emoji: '🌾', labelKey: 'nav_farm', label: 'My Farm', sublabelKey: 'nav_farm_sub', sublabel: 'Dashboard' },
  { id: 'iot', icon: Cpu, emoji: '💧', labelKey: 'nav_iot', label: 'Water Control', sublabelKey: 'nav_iot_sub', sublabel: 'Pump & Sprinkler' },
  { id: 'digitaltwin', icon: Layers, emoji: '🌱', labelKey: 'nav_twin', label: 'Digital Twin', sublabelKey: 'nav_twin_sub', sublabel: '2D Field View' },
  { id: 'crophealth', icon: Microscope, emoji: '🔬', labelKey: 'nav_crophealth', label: 'Crop Health', sublabelKey: 'nav_crophealth_sub', sublabel: 'Disease Check' },
  { id: 'health', icon: ShieldPlus, emoji: '❤️', labelKey: 'nav_health', label: 'Farmer Safety', sublabelKey: 'nav_health_sub', sublabel: 'Health Center' },
  { id: 'kiosk', icon: Landmark, emoji: '🏛️', labelKey: 'nav_kiosk', label: 'Village Kiosk', sublabelKey: 'nav_kiosk_sub', sublabel: 'Touchscreen Portal' },
  { id: 'pwa', icon: Smartphone, emoji: '📱', labelKey: 'nav_pwa', label: 'Mobile App', sublabelKey: 'nav_pwa_sub', sublabel: 'Phone View' },
  { id: 'phone', icon: MessageSquare, emoji: '📞', labelKey: 'nav_sms', label: 'SMS & Call', sublabelKey: 'nav_phone_sub', sublabel: 'SMS / IVR / USSD' },
  { id: 'admin', icon: ShieldCheck, emoji: '📊', labelKey: 'nav_admin', label: 'Admin Officer', sublabelKey: 'nav_admin_sub', sublabel: 'Control Centre' },
  { id: 'impact', icon: Globe, emoji: '🌍', labelKey: 'nav_impact', label: 'SIH Impact', sublabelKey: 'nav_impact_sub', sublabel: 'Water Savings' },
  { id: 'command', icon: Zap, emoji: '🎬', labelKey: 'nav_demo', label: 'SIH Demo', sublabelKey: 'nav_demo_sub', sublabel: 'Command Center' },
  { id: 'simple_farmer', icon: Sprout, emoji: '🎮', labelKey: 'nav_simple', label: 'Simple Mode', sublabelKey: 'nav_simple_sub', sublabel: 'Gamified Kiosk' },
  { id: 'registry', icon: Users, emoji: '👨‍🌾', labelKey: 'nav_registry', label: 'Farmers', sublabelKey: 'nav_registry_sub', sublabel: 'Register / Login' },
];

function SoftwareFarmersInner({ onNavigate, initialTab = 'web' }) {
  const { lang, setLang, t, formatNum } = useLang();
  const [dbState, setDbState] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab || 'web');
  const [showConsole, setShowConsole] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Sync tab with initialTab prop when navigated from landing shortcuts
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

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

  if (!dbState) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a' }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <div style={{ width: '40px', height: '40px', border: '3px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#94a3b8' }}>Starting Software Farmers (SmartFarm)...</p>
        </div>
      </div>
    );
  }

  const { farm, weather } = dbState;

  return (
    <div className="sf-app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0b130e' }}>
      {/* ── TOP INTEGRATED PORTAL SWITCHER BANNER ─────────────────────────── */}
      <div style={{
        background: 'linear-gradient(90deg, #051a0e 0%, #0d2818 50%, #04120a 100%)',
        borderBottom: '1px solid rgba(34, 197, 94, 0.25)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        zIndex: 999990
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => onNavigate && onNavigate('landing')}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#f8fafc',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              transition: 'all 0.2s'
            }}
          >
            <Home size={13} /> Landing Hub
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#34d399', letterSpacing: '0.02em' }}>
              🌿 SOFTWARE FARMERS DASHBOARD
            </span>
            <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '4px', padding: '1px 6px', fontWeight: 700 }}>
              13 Active Modules
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => onNavigate && onNavigate('krishi-jal')}
            style={{
              background: 'linear-gradient(135deg, #15803d, #22c55e)',
              border: 'none',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontWeight: 700,
              boxShadow: '0 3px 10px rgba(34, 197, 94, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={13} /> Switch to Krishi Jal AI <ArrowLeft size={13} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      </div>

      <div className="app-root" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Floating Simulation Panel */}
        <DemoSimulationPanel dbState={dbState} />

        {/* ── OFFLINE BANNER ───────────────────────────────────────────────── */}
        {!isOnline && (
          <div style={{
            position: 'fixed', top: 40, left: 0, right: 0, zIndex: 999998,
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
            position: 'fixed', top: isOnline ? 40 : '68px', left: 0, right: 0, zIndex: 999997,
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

          {/* ── LEFT: Full Sidebar with all 13 feature modules ─────────────── */}
          <nav className="sidebar-nav">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const tabLabel = (tab.labelKey && t(tab.labelKey) !== tab.labelKey) ? t(tab.labelKey) : tab.label;
              const tabSublabel = (tab.sublabelKey && t(tab.sublabelKey) !== tab.sublabelKey) ? t(tab.sublabelKey) : tab.sublabel;
              return (
                <button
                  key={tab.id}
                  className={`sidebar-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  aria-label={tabLabel}
                >
                  <span className="stb-emoji">{tab.emoji}</span>
                  <div className="stb-labels">
                    <span className="stb-label">{tabLabel}</span>
                    <span className="stb-sub">{tabSublabel}</span>
                  </div>
                  {isActive && <ChevronRight size={16} className="stb-arrow" />}
                </button>
              );
            })}
          </nav>

          {/* ── CENTER: Main Content Panels ──────────────────────────────────── */}
          <main className="content-area">
            <div className="content-inner-wrapper">
              {/* Active tab label breadcrumb */}
              {(() => {
                const curTab = TABS.find(t => t.id === activeTab) || TABS[0];
                const curLabel = (curTab.labelKey && t(curTab.labelKey) !== curTab.labelKey) ? t(curTab.labelKey) : curTab.label;
                const curSublabel = (curTab.sublabelKey && t(curTab.sublabelKey) !== curTab.sublabelKey) ? t(curTab.sublabelKey) : curTab.sublabel;
                return (
                  <div className="content-breadcrumb">
                    <span className="cb-emoji">{curTab.emoji}</span>
                    <div>
                      <div className="cb-title">{curLabel}</div>
                      <div className="cb-sub">{curSublabel}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Tab Panels for all 13 Features */}
              <div className="sf-tab-panel tab-panel active" style={{ display: 'block', minHeight: '520px' }}>
                {activeTab === 'web' && <WebDashboard dbState={dbState} />}
                {activeTab === 'iot' && <IoTController dbState={dbState} />}
                {activeTab === 'digitaltwin' && <DigitalTwin dbState={dbState} />}
                {activeTab === 'crophealth' && <CropHealthModule dbState={dbState} />}
                {activeTab === 'health' && <FarmerHealthModule dbState={dbState} />}
                {activeTab === 'kiosk' && <VillageKiosk dbState={dbState} />}
                {activeTab === 'pwa' && <MobilePWA dbState={dbState} />}
                {activeTab === 'phone' && (
                  <div className="three-col-phone">
                    <SMSSimulator dbState={dbState} />
                    <VoiceIVR dbState={dbState} />
                    <USSDSimulator dbState={dbState} />
                  </div>
                )}
                {activeTab === 'admin' && <AdminDashboard dbState={dbState} />}
                {activeTab === 'impact' && <ImpactDashboard dbState={dbState} />}
                {activeTab === 'command' && (
                  <div className="w-full mx-auto relative pt-4">
                    <CommandCenter dbState={dbState} />
                  </div>
                )}
                {activeTab === 'simple_farmer' && <FarmerApp dbState={dbState} />}
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
          {TABS.slice(0, 6).map(tab => {
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
    </div>
  );
}

export function SoftwareFarmersApp(props) {
  return (
    <LanguageProvider>
      <SoftwareFarmersInner {...props} />
    </LanguageProvider>
  );
}

export default SoftwareFarmersApp;
