import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Tabs } from './components/Tabs';
import { DashboardTab } from './components/tabs/DashboardTab';
import { VoiceAiTab } from './components/tabs/VoiceAiTab';
import { AdvisorTab } from './components/tabs/AdvisorTab';
import { WeatherTab } from './components/tabs/WeatherTab';
import { SchemesTab } from './components/tabs/SchemesTab';
import { SoilLabTab } from './components/tabs/SoilLabTab';
import { RentalsTab } from './components/tabs/RentalsTab';
import { MarketplaceTab } from './components/tabs/MarketplaceTab';
import { MandiTab } from './components/tabs/MandiTab';
import { EducationTab } from './components/tabs/EducationTab';
import { CalculatorTab } from './components/tabs/CalculatorTab';
import { PlannerTab } from './components/tabs/PlannerTab';
import { GeminiKeyModal } from './components/modals/GeminiKeyModal';
import { RentalBookingModal } from './components/modals/RentalBookingModal';
import { OnboardingWizard } from './components/modals/OnboardingWizard';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileDrawer } from './components/MobileDrawer';
import { LandingPage } from './components/LandingPage';
import { GoogleTranslate } from './components/GoogleTranslate';
import { pageReader } from './services/ai/pageNarrationService';
import { ttsEngine } from './services/ai/ttsService';

export function App() {
  const { activeTab, setActiveTab, setShowOnboarding } = useApp();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Stop speech only when shifting to a completely different browser tab, window, or route
  useEffect(() => {
    const stopAudio = () => {
      try {
        pageReader.stop(false);
        ttsEngine.stop();
      } catch (e) {}
    };

    // When switching to a completely different browser tab or minimizing
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAudio();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', stopAudio);
    window.addEventListener('beforeunload', stopAudio);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', stopAudio);
      window.removeEventListener('beforeunload', stopAudio);
    };
  }, []);

  // Routes: 'app' | 'landing'
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('landing')) return 'landing';
    return 'app';
  });

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      pageReader.stop(false);
      ttsEngine.stop();
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('landing')) {
        setCurrentRoute('landing');
      } else {
        setCurrentRoute('app');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (route, tab = null) => {
    if (route === 'landing') {
      window.location.hash = '/landing';
      setCurrentRoute('landing');
    } else {
      window.location.hash = '/';
      setCurrentRoute('app');
      if (tab) setActiveTab(tab);
    }
  };

  return (
    <>
      <GoogleTranslate />
      {currentRoute === 'landing' ? (
        <LandingPage 
          onStartKrishiJal={() => handleNavigate('app')}
          onOpenDirectTab={(_, tab) => handleNavigate('app', tab)}
        />
      ) : (
        <div className="app-container">
          <OnboardingWizard onComplete={() => {}} />
          
          {/* Top Navbar */}
          <Header 
            onOpenAiModal={() => setAiModalOpen(true)} 
            onNavigate={handleNavigate}
            onOpenDrawer={setMobileDrawerOpen}
          />

          {/* Main Page Layout */}
          <div className="main-layout">
            {/* Left Sidebar (Desktop Only) */}
            <Sidebar />

            {/* Right Main Content */}
            <main className="content-main">
              {/* Navigation Tabs */}
              <Tabs />
              
              {/* Tab Panel Content */}
              <div className="tab-content" style={{ marginTop: '1.5rem' }}>
                {activeTab === 'dashboard' && <DashboardTab />}
                {activeTab === 'voice-ai' && <VoiceAiTab />}
                {activeTab === 'advisor' && <AdvisorTab />}
                {activeTab === 'weather' && <WeatherTab />}
                {activeTab === 'soillab' && <SoilLabTab />}
                {activeTab === 'planner' && <PlannerTab />}
                {activeTab === 'rentals' && <RentalsTab onOpenBookingModal={(item) => setBookingItem(item)} />}
                {activeTab === 'mandi' && <MandiTab />}
                {activeTab === 'marketplace' && <MarketplaceTab />}
                {activeTab === 'calculator' && <CalculatorTab />}
                {activeTab === 'schemes' && <SchemesTab />}
                {activeTab === 'education' && <EducationTab />}
              </div>
            </main>
          </div>

          {/* Mobile-First Sticky Bottom Navigation */}
          <MobileBottomNav 
            onOpenDrawer={setMobileDrawerOpen} 
            isDrawerOpen={mobileDrawerOpen}
          />

          {/* Mobile-First Full Feature Drawer & Farm Settings Sheet */}
          <MobileDrawer 
            isOpen={mobileDrawerOpen} 
            onClose={() => setMobileDrawerOpen(false)} 
            onOpenAiModal={() => setAiModalOpen(true)}
          />

          {/* Modals */}
          {aiModalOpen && <GeminiKeyModal onClose={() => setAiModalOpen(false)} />}
          {bookingItem && <RentalBookingModal equipment={bookingItem} onClose={() => setBookingItem(null)} />}
        </div>
      )}
    </>
  );
}

export default App;
