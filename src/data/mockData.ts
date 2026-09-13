import { Device, Room, EnergyReading, SolarReading, SolarModule, Anomaly, Recommendation, Alert } from '@/types';

const mockHomeId = 'home-001';
const mockUserId = 'user-001';

// Mock Rooms
export const mockRooms: Room[] = [
  { id: 'room-001', homeId: mockHomeId, name: 'Quarto/Setup', description: 'Quarto com computador e home office', area: 25, order: 1 },
  { id: 'room-002', homeId: mockHomeId, name: 'Sala', description: 'Sala de estar e home theater', area: 35, order: 2 },
  { id: 'room-003', homeId: mockHomeId, name: 'Cozinha', description: 'Cozinha e área de refeições', area: 20, order: 3 },
  { id: 'room-004', homeId: mockHomeId, name: 'Banheiro', description: 'Banheiro principal', area: 8, order: 4 },
  { id: 'room-005', homeId: mockHomeId, name: 'Escritório', description: 'Escritório comercial', area: 18, order: 5 },
  { id: 'room-006', homeId: mockHomeId, name: 'Área Externa', description: 'Varanda e área externa', area: 15, order: 6 },
];

// Mock Devices
export const mockDevices: Device[] = [
  // Quarto/Setup devices
  { id: 'dev-001', homeId: mockHomeId, roomId: 'room-001', name: 'PC Gaming', category: 'entertainment', powerWatts: 500, usageHoursPerDay: 6, usageDaysPerMonth: 30, status: 'on', lastUpdated: new Date() },
  { id: 'dev-002', homeId: mockHomeId, roomId: 'room-001', name: 'Monitor', category: 'entertainment', powerWatts: 75, usageHoursPerDay: 6, usageDaysPerMonth: 30, status: 'on', lastUpdated: new Date() },
  { id: 'dev-003', homeId: mockHomeId, roomId: 'room-001', name: 'Videogame', category: 'entertainment', powerWatts: 150, usageHoursPerDay: 5, usageDaysPerMonth: 25, status: 'standby', lastUpdated: new Date() },
  { id: 'dev-004', homeId: mockHomeId, roomId: 'room-001', name: 'Iluminação', category: 'lighting', powerWatts: 100, usageHoursPerDay: 8, usageDaysPerMonth: 30, status: 'on', lastUpdated: new Date() },

  // Sala devices
  { id: 'dev-005', homeId: mockHomeId, roomId: 'room-002', name: 'TV', category: 'entertainment', powerWatts: 120, usageHoursPerDay: 6, usageDaysPerMonth: 30, status: 'on', lastUpdated: new Date() },
  { id: 'dev-006', homeId: mockHomeId, roomId: 'room-002', name: 'Ar-condicionado', category: 'cooling', powerWatts: 1200, usageHoursPerDay: 8, usageDaysPerMonth: 30, status: 'on', lastUpdated: new Date() },
  { id: 'dev-007', homeId: mockHomeId, roomId: 'room-002', name: 'Iluminação', category: 'lighting', powerWatts: 150, usageHoursPerDay: 6, usageDaysPerMonth: 30, status: 'on', lastUpdated: new Date() },

  // Cozinha devices
  { id: 'dev-008', homeId: mockHomeId, roomId: 'room-003', name: 'Geladeira', category: 'kitchen', powerWatts: 300, usageHoursPerDay: 24, usageDaysPerMonth: 30, status: 'on', lastUpdated: new Date() },
  { id: 'dev-009', homeId: mockHomeId, roomId: 'room-003', name: 'Micro-ondas', category: 'kitchen', powerWatts: 1000, usageHoursPerDay: 0.5, usageDaysPerMonth: 30, status: 'off', lastUpdated: new Date() },
  { id: 'dev-010', homeId: mockHomeId, roomId: 'room-003', name: 'Iluminação', category: 'lighting', powerWatts: 120, usageHoursPerDay: 6, usageDaysPerMonth: 30, status: 'on', lastUpdated: new Date() },

  // Banheiro devices
  { id: 'dev-011', homeId: mockHomeId, roomId: 'room-004', name: 'Iluminação', category: 'lighting', powerWatts: 60, usageHoursPerDay: 2, usageDaysPerMonth: 30, status: 'off', lastUpdated: new Date() },
  { id: 'dev-012', homeId: mockHomeId, roomId: 'room-004', name: 'Chuveiro Elétrico', category: 'water', powerWatts: 4500, usageHoursPerDay: 0.3, usageDaysPerMonth: 30, status: 'off', lastUpdated: new Date() },

  // Escritório devices
  { id: 'dev-013', homeId: mockHomeId, roomId: 'room-005', name: 'Computador', category: 'entertainment', powerWatts: 350, usageHoursPerDay: 8, usageDaysPerMonth: 20, status: 'on', lastUpdated: new Date() },
  { id: 'dev-014', homeId: mockHomeId, roomId: 'room-005', name: 'Monitor', category: 'entertainment', powerWatts: 60, usageHoursPerDay: 8, usageDaysPerMonth: 20, status: 'on', lastUpdated: new Date() },
  { id: 'dev-015', homeId: mockHomeId, roomId: 'room-005', name: 'Iluminação', category: 'lighting', powerWatts: 100, usageHoursPerDay: 8, usageDaysPerMonth: 20, status: 'on', lastUpdated: new Date() },

  // Área Externa devices
  { id: 'dev-016', homeId: mockHomeId, roomId: 'room-006', name: 'Iluminação', category: 'lighting', powerWatts: 200, usageHoursPerDay: 4, usageDaysPerMonth: 30, status: 'off', lastUpdated: new Date() },
];

// Mock Energy Readings - 30 days of data
export const generateMockEnergyReadings = (): EnergyReading[] => {
  const readings: EnergyReading[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  mockDevices.forEach(device => {
    const dailyKwh = (device.powerWatts * device.usageHoursPerDay * device.usageDaysPerMonth) / 1000 / 30;
    
    for (let i = 0; i < 30; i++) {
      const readingDate = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const variationFactor = 0.8 + Math.random() * 0.4; // ±20% variation
      
      readings.push({
        id: `reading-${device.id}-${i}`,
        timestamp: readingDate,
        deviceId: device.id,
        roomId: device.roomId,
        homeId: mockHomeId,
        watts: device.powerWatts * (Math.random() * 0.3 + 0.7),
        kwh: dailyKwh * variationFactor,
        source: 'simulated',
      });
    }
  });

  return readings;
};

// Mock Solar Readings
export const generateMockSolarReadings = (): SolarReading[] => {
  const readings: SolarReading[] = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < 30; i++) {
    const readingDate = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const hour = readingDate.getHours();
    
    // Solar generation peaks at midday (6-18h)
    let generationFactor = 0;
    if (hour >= 6 && hour <= 18) {
      const peakHour = hour > 12 ? 18 - hour : hour - 6;
      generationFactor = Math.sin((peakHour / 12) * Math.PI);
    }
    
    const cloudCover = Math.random() * 40; // 0-40% cloud cover
    const adjustedGeneration = generationFactor * (1 - cloudCover / 100);
    
    readings.push({
      id: `solar-reading-${i}`,
      timestamp: readingDate,
      homeId: mockHomeId,
      generationWatts: 6000 * adjustedGeneration,
      generationKwh: (6000 * adjustedGeneration * 1) / 1000, // Per hour equivalent
      temperature: 25 + Math.random() * 15,
      cloudCover: cloudCover,
      status: adjustedGeneration > 0.7 ? 'normal' : adjustedGeneration > 0.3 ? 'attention' : 'critical',
      source: 'simulated',
    });
  }

  return readings;
};

// Mock Solar Modules
export const mockSolarModules: SolarModule[] = [
  { id: 'module-001', homeId: mockHomeId, serialNumber: 'SN-2024-001', name: 'Telha 01', status: 'normal', voltage: 380, current: 15.2, power: 5700, temperature: 35, lastUpdated: new Date() },
  { id: 'module-002', homeId: mockHomeId, serialNumber: 'SN-2024-002', name: 'Telha 02', status: 'normal', voltage: 380, current: 14.8, power: 5640, temperature: 34, lastUpdated: new Date() },
  { id: 'module-003', homeId: mockHomeId, serialNumber: 'SN-2024-003', name: 'Telha 03', status: 'attention', voltage: 375, current: 12.1, power: 4537, temperature: 38, lastUpdated: new Date() },
  { id: 'module-004', homeId: mockHomeId, serialNumber: 'SN-2024-004', name: 'Telha 04', status: 'normal', voltage: 380, current: 15.0, power: 5700, temperature: 35, lastUpdated: new Date() },
];

// Mock Anomalies
export const mockAnomalies: Anomaly[] = [
  {
    id: 'anomaly-001',
    homeId: mockHomeId,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    type: 'high_consumption',
    severity: 'high',
    deviceId: 'dev-001',
    description: 'PC Gaming consumindo 32% mais energia que a média dos últimos 7 dias.',
    impact: { estimatedExtraCost: 15.40, estimatedExtraKwh: 18 },
    resolved: false,
  },
  {
    id: 'anomaly-002',
    homeId: mockHomeId,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: 'standby_waste',
    severity: 'medium',
    deviceId: 'dev-003',
    description: 'Videogame permaneceu em modo de espera durante aproximadamente 14 horas.',
    impact: { estimatedExtraCost: 3.50, estimatedExtraKwh: 4.1 },
    resolved: false,
  },
  {
    id: 'anomaly-003',
    homeId: mockHomeId,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    type: 'solar_drop',
    severity: 'medium',
    description: 'Queda inesperada na geração solar - Telha 03 com eficiência reduzida.',
    impact: { estimatedExtraCost: 8.20, estimatedExtraKwh: 9.6 },
    resolved: false,
  },
];

// Mock Recommendations
export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-001',
    homeId: mockHomeId,
    timestamp: new Date(),
    priority: 'high',
    category: 'consumption',
    title: 'Reduzir tempo de PC Gaming',
    description: 'Seu quarto/Setup representa 43,5% do consumo residencial. O PC Gaming é o equipamento que mais consome energia. Se reduzir o funcionamento em aproximadamente 2 horas por dia, o consumo estimado poderá diminuir.',
    estimatedSavings: { kwh: 300, cost: 255 },
    deviceId: 'dev-001',
    roomId: 'room-001',
  },
  {
    id: 'rec-002',
    homeId: mockHomeId,
    timestamp: new Date(),
    priority: 'medium',
    category: 'efficiency',
    title: 'Desativar modo standby',
    description: 'Muitos dispositivos consomem energia mesmo em modo standby. Desativar completamente o videogame pode economizar até 5% do consumo mensal.',
    estimatedSavings: { kwh: 45, cost: 38.25 },
    deviceId: 'dev-003',
    roomId: 'room-001',
  },
  {
    id: 'rec-003',
    homeId: mockHomeId,
    timestamp: new Date(),
    priority: 'medium',
    category: 'solar',
    title: 'Manutenção preventiva do painel solar',
    description: 'A Telha 03 está com eficiência reduzida. Uma limpeza pode restaurar a eficiência e aumentar a geração em até 8%.',
    estimatedSavings: { kwh: 120, cost: 102 },
  },
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    homeId: mockHomeId,
    type: 'anomaly',
    level: 'critical',
    title: 'Consumo acima do padrão',
    message: 'O PC Gaming consumiu 32% mais energia que a média dos últimos 7 dias.',
    deviceId: 'dev-001',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'alert-002',
    homeId: mockHomeId,
    type: 'recommendation',
    level: 'warning',
    title: 'Possível desperdício detectado',
    message: 'O videogame permaneceu em modo de espera durante aproximadamente 14 horas.',
    deviceId: 'dev-003',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    read: false,
  },
];
