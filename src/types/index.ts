// User and Home Types
export interface User {
  id: string;
  name: string;
  email: string;
  homeId: string;
}

export interface Home {
  id: string;
  name: string;
  address: string;
  zipCode: string;
  userId: string;
  currency: string;
  timezone: string;
  createdAt: Date;
}

// Room and Device Types
export interface Room {
  id: string;
  homeId: string;
  name: string;
  description?: string;
  area?: number;
  order: number;
}

export type DeviceCategory = 'heating' | 'cooling' | 'lighting' | 'entertainment' | 'kitchen' | 'water' | 'other';
export type DeviceStatus = 'on' | 'off' | 'standby' | 'error';

export interface Device {
  id: string;
  homeId: string;
  roomId: string;
  name: string;
  category: DeviceCategory;
  powerWatts: number;
  usageHoursPerDay: number;
  usageDaysPerMonth: number;
  status: DeviceStatus;
  lastUpdated: Date;
  estimatedMonthlyKwh?: number;
  estimatedMonthlyCost?: number;
}

// Energy Reading Types
export interface EnergyReading {
  id: string;
  timestamp: Date;
  deviceId?: string;
  roomId?: string;
  homeId: string;
  watts: number;
  kwh: number;
  source: 'simulated' | 'iot' | 'api';
}

// Solar Generation Types
export interface SolarReading {
  id: string;
  timestamp: Date;
  homeId: string;
  generationWatts: number;
  generationKwh: number;
  temperature: number;
  cloudCover: number;
  status: 'normal' | 'attention' | 'critical';
  source: 'simulated' | 'inverter' | 'api';
}

export interface SolarModule {
  id: string;
  homeId: string;
  serialNumber: string;
  name: string;
  status: 'normal' | 'attention' | 'critical';
  voltage?: number;
  current?: number;
  power?: number;
  temperature?: number;
  lastUpdated: Date;
}

// Bill and Tariff Types
export interface EnergyBill {
  id: string;
  homeId: string;
  periodStart: Date;
  periodEnd: Date;
  totalKwh: number;
  totalCost: number;
  tariffPerKwh: number;
  taxes?: number;
  notes?: string;
}

export interface TariffConfig {
  id: string;
  homeId: string;
  pricePerKwh: number;
  currency: string;
  taxes: number;
  minCharge?: number;
  peakHours?: { start: number; end: number };
  peakPrice?: number;
  offPeakPrice?: number;
}

// Alert and Anomaly Types
export type AlertLevel = 'info' | 'warning' | 'critical';
export type AlertType = 'consumption' | 'solar' | 'anomaly' | 'maintenance' | 'recommendation';

export interface Alert {
  id: string;
  homeId: string;
  type: AlertType;
  level: AlertLevel;
  title: string;
  message: string;
  deviceId?: string;
  roomId?: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface Anomaly {
  id: string;
  homeId: string;
  timestamp: Date;
  type: 'high_consumption' | 'unusual_pattern' | 'extended_runtime' | 'standby_waste' | 'solar_drop';
  severity: 'low' | 'medium' | 'high';
  deviceId?: string;
  roomId?: string;
  description: string;
  impact: {
    estimatedExtraCost: number;
    estimatedExtraKwh: number;
  };
  resolved: boolean;
}

// Recommendation Types
export interface Recommendation {
  id: string;
  homeId: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  category: 'consumption' | 'solar' | 'efficiency' | 'behavioral';
  title: string;
  description: string;
  estimatedSavings: {
    kwh: number;
    cost: number;
  };
  deviceId?: string;
  roomId?: string;
  action?: string;
}

// Summary Statistics
export interface ConsumptionSummary {
  period: 'day' | 'week' | 'month' | 'year';
  totalKwh: number;
  totalCost: number;
  averageDailyKwh: number;
  peakConsumptionWatts: number;
  peakConsumptionTime: Date;
  byRoom: Record<string, { kwh: number; cost: number; percentage: number }>;
  byDevice: Record<string, { kwh: number; cost: number; percentage: number }>;
  comparison?: {
    previousPeriodKwh: number;
    percentageChange: number;
  };
}

export interface SolarSummary {
  period: 'day' | 'week' | 'month' | 'year';
  totalGeneratedKwh: number;
  totalConsumedFromSolarKwh: number;
  totalExportedToGridKwh: number;
  peakGenerationWatts: number;
  peakGenerationTime: Date;
  estimatedSavings: number;
  averageEfficiency: number;
}

// Data Provider Interfaces (for abstraction)
export interface IEnergyDataProvider {
  getReadings(homeId: string, startDate: Date, endDate: Date): Promise<EnergyReading[]>;
  getCurrentReading(deviceId: string): Promise<EnergyReading>;
  getRoomConsumption(roomId: string, date: Date): Promise<number>;
}

export interface ISolarDataProvider {
  getReadings(homeId: string, startDate: Date, endDate: Date): Promise<SolarReading[]>;
  getCurrentGeneration(homeId: string): Promise<SolarReading>;
  getModuleStatus(homeId: string): Promise<SolarModule[]>;
}

export interface IAnomalyDetectionProvider {
  detectAnomalies(homeId: string, readings: EnergyReading[]): Promise<Anomaly[]>;
  getHistoricalAverage(deviceId: string, days: number): Promise<number>;
}
