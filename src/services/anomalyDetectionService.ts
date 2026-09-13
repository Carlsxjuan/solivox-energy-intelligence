import { EnergyReading, Device, Anomaly } from '@/types';

interface ReadingsByDevice {
  [deviceId: string]: EnergyReading[];
}

/**
 * Calculate average consumption for a device over a period
 */
const calculateAverageConsumption = (readings: EnergyReading[]): number => {
  if (readings.length === 0) return 0;
  const total = readings.reduce((sum, r) => sum + r.kwh, 0);
  return total / readings.length;
};

/**
 * Calculate standard deviation
 */
const calculateStdDeviation = (readings: EnergyReading[], average: number): number => {
  if (readings.length === 0) return 0;
  const squaredDiffs = readings.map(r => Math.pow(r.kwh - average, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / readings.length;
  return Math.sqrt(variance);
};

/**
 * Detect high consumption anomalies (>2 std deviations from average)
 */
const detectHighConsumption = (
  device: Device,
  readings: EnergyReading[],
  homeId: string
): Anomaly | null => {
  if (readings.length < 7) return null; // Need at least 7 readings

  const average = calculateAverageConsumption(readings);
  const stdDev = calculateStdDeviation(readings, average);
  const threshold = average + stdDev * 2;

  // Check last reading
  if (readings[readings.length - 1].kwh > threshold) {
    const percentageIncrease = ((readings[readings.length - 1].kwh - average) / average) * 100;
    
    return {
      id: `anomaly-high-${device.id}`,
      homeId,
      timestamp: new Date(),
      type: 'high_consumption',
      severity: percentageIncrease > 50 ? 'high' : 'medium',
      deviceId: device.id,
      description: `${device.name} consumindo ${percentageIncrease.toFixed(1)}% mais energia que a média dos últimos 7 dias.`,
      impact: {
        estimatedExtraKwh: readings[readings.length - 1].kwh - average,
        estimatedExtraCost: (readings[readings.length - 1].kwh - average) * 0.85, // Assuming R$ 0.85/kWh
      },
      resolved: false,
    };
  }

  return null;
};

/**
 * Detect standby waste (device on for too long with very low consumption)
 */
const detectStandbyWaste = (
  device: Device,
  readings: EnergyReading[],
  homeId: string
): Anomaly | null => {
  if (readings.length < 7) return null;

  // Check if device has been in low-power mode for extended period
  const lastWeek = readings.slice(-7);
  const averageConsumption = calculateAverageConsumption(lastWeek);
  const maxExpectedStandby = device.powerWatts * 0.05; // 5% of rated power

  if (averageConsumption > 0 && averageConsumption < maxExpectedStandby && averageConsumption > 0) {
    return {
      id: `anomaly-standby-${device.id}`,
      homeId,
      timestamp: new Date(),
      type: 'standby_waste',
      severity: 'low',
      deviceId: device.id,
      description: `${device.name} permaneceu em modo de espera durante aproximadamente 14 horas.`,
      impact: {
        estimatedExtraKwh: averageConsumption * 7,
        estimatedExtraCost: averageConsumption * 7 * 0.85,
      },
      resolved: false,
    };
  }

  return null;
};

/**
 * Detect unusual patterns (sudden changes)
 */
const detectUnusualPattern = (
  device: Device,
  readings: EnergyReading[],
  homeId: string
): Anomaly | null => {
  if (readings.length < 14) return null;

  const previousWeek = readings.slice(-14, -7);
  const currentWeek = readings.slice(-7);

  const previousAverage = calculateAverageConsumption(previousWeek);
  const currentAverage = calculateAverageConsumption(currentWeek);

  if (previousAverage > 0) {
    const changePercentage = ((currentAverage - previousAverage) / previousAverage) * 100;

    if (Math.abs(changePercentage) > 40) {
      return {
        id: `anomaly-pattern-${device.id}`,
        homeId,
        timestamp: new Date(),
        type: 'unusual_pattern',
        severity: 'medium',
        deviceId: device.id,
        description: `${device.name} teve alteração de ${Math.abs(changePercentage).toFixed(1)}% no consumo em relação à semana anterior.`,
        impact: {
          estimatedExtraKwh: Math.abs(currentAverage - previousAverage) * 7,
          estimatedExtraCost: Math.abs(currentAverage - previousAverage) * 7 * 0.85,
        },
        resolved: false,
      };
    }
  }

  return null;
};

/**
 * Main anomaly detection function
 */
export const detectAnomalies = (
  readings: EnergyReading[],
  devices: Device[],
  homeId: string
): Anomaly[] => {
  const anomalies: Anomaly[] = [];

  // Group readings by device
  const readingsByDevice: ReadingsByDevice = {};
  readings.forEach(reading => {
    if (reading.deviceId) {
      if (!readingsByDevice[reading.deviceId]) {
        readingsByDevice[reading.deviceId] = [];
      }
      readingsByDevice[reading.deviceId].push(reading);
    }
  });

  // Analyze each device
  devices.forEach(device => {
    const deviceReadings = readingsByDevice[device.id] || [];
    if (deviceReadings.length === 0) return;

    // Check for high consumption
    const highConsumption = detectHighConsumption(device, deviceReadings, homeId);
    if (highConsumption) anomalies.push(highConsumption);

    // Check for standby waste
    const standbyWaste = detectStandbyWaste(device, deviceReadings, homeId);
    if (standbyWaste) anomalies.push(standbyWaste);

    // Check for unusual patterns
    const unusualPattern = detectUnusualPattern(device, deviceReadings, homeId);
    if (unusualPattern) anomalies.push(unusualPattern);
  });

  return anomalies;
};
