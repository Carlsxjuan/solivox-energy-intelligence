import React, { useState } from 'react';
import { mockRooms, mockDevices, generateMockEnergyReadings, generateMockSolarReadings, mockSolarModules, mockAnomalies, mockRecommendations, mockAlerts } from '@/data/mockData';
import { calculateConsumptionSummary } from '@/services/calculationService';
import Dashboard from '@/pages/Dashboard';
import RoomDetail from '@/pages/RoomDetail';
import RankingPage from '@/pages/RankingPage';
import SolarPage from '@/pages/SolarPage';
import AnomaliesPage from '@/pages/AnomaliesPage';
import SettingsPage from '@/pages/SettingsPage';
import Navigation from '@/components/Navigation';
import Header from '@/components/Header';

type PageType = 'dashboard' | 'room' | 'ranking' | 'solar' | 'anomalies' | 'settings';

interface PageState {
  type: PageType;
  roomId?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageState>({ type: 'dashboard' });
  const [tariffPerKwh] = useState(0.85); // R$ 0.85 per kWh
  const [currency] = useState('BRL');

  // Generate mock data
  const energyReadings = generateMockEnergyReadings();
  const solarReadings = generateMockSolarReadings();

  // Calculate consumption summary
  const consumptionSummary = calculateConsumptionSummary(
    energyReadings,
    mockDevices,
    mockRooms,
    tariffPerKwh
  );

  const handleNavigate = (page: PageType, roomId?: string) => {
    setCurrentPage({ type: page, roomId });
  };

  const renderPage = () => {
    switch (currentPage.type) {
      case 'dashboard':
        return (
          <Dashboard
            consumptionSummary={consumptionSummary}
            solarReadings={solarReadings}
            alerts={mockAlerts}
            onNavigateToRoom={(roomId) => handleNavigate('room', roomId)}
            tariffPerKwh={tariffPerKwh}
            currency={currency}
          />
        );
      case 'room':
        return (
          <RoomDetail
            roomId={currentPage.roomId || ''}
            rooms={mockRooms}
            devices={mockDevices}
            consumptionByDevice={consumptionSummary.byDevice}
            tariffPerKwh={tariffPerKwh}
            currency={currency}
            onBack={() => handleNavigate('dashboard')}
          />
        );
      case 'ranking':
        return (
          <RankingPage
            devices={mockDevices}
            consumptionByDevice={consumptionSummary.byDevice}
            tariffPerKwh={tariffPerKwh}
            currency={currency}
          />
        );
      case 'solar':
        return (
          <SolarPage
            solarReadings={solarReadings}
            solarModules={mockSolarModules}
            solarConsumption={0} // Mock value
            tariffPerKwh={tariffPerKwh}
            currency={currency}
          />
        );
      case 'anomalies':
        return (
          <AnomaliesPage
            anomalies={mockAnomalies}
            recommendations={mockRecommendations}
            devices={mockDevices}
            tariffPerKwh={tariffPerKwh}
            currency={currency}
          />
        );
      case 'settings':
        return <SettingsPage tariffPerKwh={tariffPerKwh} currency={currency} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-solivox-darker text-solivox-light">
      <Header />
      <div className="flex">
        <Navigation currentPage={currentPage.type} onNavigate={handleNavigate} />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
