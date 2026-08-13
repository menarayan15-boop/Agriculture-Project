import React, { useState } from 'react';
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

export function App() {
  const { activeTab, setActiveTab, setShowOnboarding } = useApp();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState(null);
  const [appStarted, setAppStarted] = useState(false);

  return (
    <>
      <OnboardingWizard onComplete={() => setAppStarted(true)} />
      
      {!appStarted ? (
        <LandingPage onStart={() => setShowOnboarding(true)} />
      ) : (
        <div className="app-container">
          {/* Top Navbar */}
          <Header onOpenAiModal={() => setAiModalOpen(true)} />

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
