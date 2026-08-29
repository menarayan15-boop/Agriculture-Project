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
import { LandingPage } from './components/LandingPage';
import FloatingAssistant from './components/FloatingAssistant';
import { SoftwareFarmersApp } from './software-farmers/SoftwareFarmersApp';

export function App() {
  const { activeTab, setActiveTab, setShowOnboarding } = useApp();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState(null);

  // Routes: 'landing' | 'krishi-jal' | 'software-farmers'
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('software-farmers') || hash.includes('smartfarm')) return 'software-farmers';
    if (hash.includes('krishi-jal') || hash.includes('krishi')) return 'krishi-jal';
    return 'landing';
  });

  const [sfInitialTab, setSfInitialTab] = useState('web');

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('software-farmers') || hash.includes('smartfarm')) {
        setCurrentRoute('software-farmers');
      } else if (hash.includes('krishi-jal') || hash.includes('krishi')) {
        setCurrentRoute('krishi-jal');
      } else {
        setCurrentRoute('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (route, tab = null) => {
    if (route === 'krishi-jal') {
      window.location.hash = '/krishi-jal';
      setCurrentRoute('krishi-jal');
      if (tab) setActiveTab(tab);
    } else if (route === 'software-farmers') {
      window.location.hash = '/software-farmers';
      if (tab) setSfInitialTab(tab);
      setCurrentRoute('software-farmers');
    } else {
      window.location.hash = '/';
      setCurrentRoute('landing');
    }
  };

  return (
    <>
      {currentRoute === 'landing' && (
        <LandingPage 
          onStartKrishiJal={() => handleNavigate('krishi-jal')}
          onStartSoftwareFarmers={() => handleNavigate('software-farmers')}
          onOpenDirectTab={(route, tab) => handleNavigate(route, tab)}
        />
      )}

      {currentRoute === 'software-farmers' && (
        <SoftwareFarmersApp 
          onNavigate={handleNavigate}
          initialTab={sfInitialTab}
        />
      )}

      {currentRoute === 'krishi-jal' && (
        <div className="app-container">
          <OnboardingWizard onComplete={() => {}} />
          
          {/* Top Navbar with Dual Software Portal Switcher */}
          <Header 
            onOpenAiModal={() => setAiModalOpen(true)} 
            onNavigate={handleNavigate}
          />

          {/* Main Page Layout */}
          <div className="main-layout">
            {/* Left Sidebar */}
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

          {/* Floating Assistant FAB */}
          <FloatingAssistant onTabChange={(tab) => {
            const map = { voice: 'voice-ai', weather: 'weather', mandi: 'mandi', soil: 'soillab' };
            if (map[tab]) setActiveTab(map[tab]);
          }} />

          {/* Modals */}
          {aiModalOpen && <GeminiKeyModal onClose={() => setAiModalOpen(false)} />}
          {bookingItem && <RentalBookingModal equipment={bookingItem} onClose={() => setBookingItem(null)} />}
        </div>
      )}
    </>
  );
}

export default App;
