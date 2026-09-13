import { Device, Room, EnergyReading, ConsumptionSummary } from '@/types';

/**
 * Calculate monthly kWh for a device
 * Formula: (powerWatts × usageHoursPerDay × usageDaysPerMonth) / 1000
 */
export const calculateDeviceMonthlyKwh = (device: Device): number => {
  return (device.powerWatts * device.usageHoursPerDay * device.usageDaysPerMonth) / 1000;
};

/**
 * Calculate device monthly cost
 */
export const calculateDeviceMonthlyCost = (device: Device, tariffPerKwh: number): number => {
  const kwh = calculateDeviceMonthlyKwh(device);
  return kwh * tariffPerKwh;
};

/**
 * Calculate total consumption from readings
 */
export const calculateTotalConsumption = (readings: EnergyReading[]): number => {
  return readings.reduce((total, reading) => total + reading.kwh, 0);
};

/**
 * Calculate consumption by room
 */
export const calculateConsumptionByRoom = (
  readings: EnergyReading[],
  rooms: Room[]
): Record<string, number> => {
  const consumption: Record<string, number> = {};
  
  rooms.forEach(room => {
    consumption[room.id] = readings
      .filter(r => r.roomId === room.id)
      .reduce((total, reading) => total + reading.kwh, 0);
  });

  return consumption;
};

/**
 * Calculate consumption by device
 */
export const calculateConsumptionByDevice = (
  readings: EnergyReading[],
  devices: Device[]
): Record<string, number> => {
  const consumption: Record<string, number> = {};
  
  devices.forEach(device => {
    consumption[device.id] = readings
      .filter(r => r.deviceId === device.id)
      .reduce((total, reading) => total + reading.kwh, 0);
  });

  return consumption;
};

/**
 * Calculate percentual consumption
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Find top consumers
 */
export const findTopConsumers = (
  consumptionByDevice: Record<string, number>,
  devices: Device[],
  limit: number = 5
): Array<{ device: Device; kwh: number; percentage: number }> => {
  const total = Object.values(consumptionByDevice).reduce((a, b) => a + b, 0);
  
  return devices
    .map(device => ({
      device,
      kwh: consumptionByDevice[device.id] || 0,
      percentage: calculatePercentage(consumptionByDevice[device.id] || 0, total),
    }))
    .sort((a, b) => b.kwh - a.kwh)
    .slice(0, limit);
};

/**
 * Calculate consumption summary
 */
export const calculateConsumptionSummary = (
  readings: EnergyReading[],
  devices: Device[],
  rooms: Room[],
  tariffPerKwh: number,
  previousPeriodReadings?: EnergyReading[]
): ConsumptionSummary => {
  const totalKwh = calculateTotalConsumption(readings);
  const byRoomKwh = calculateConsumptionByRoom(readings, rooms);
  const byDeviceKwh = calculateConsumptionByDevice(readings, devices);
  
  const byRoom: Record<string, { kwh: number; cost: number; percentage: number }> = {};
  rooms.forEach(room => {
    const kwh = byRoomKwh[room.id] || 0;
    byRoom[room.id] = {
      kwh,
      cost: kwh * tariffPerKwh,
      percentage: calculatePercentage(kwh, totalKwh),
    };
  });

  const byDevice: Record<string, { kwh: number; cost: number; percentage: number }> = {};
  devices.forEach(device => {
    const kwh = byDeviceKwh[device.id] || 0;
    byDevice[device.id] = {
      kwh,
      cost: kwh * tariffPerKwh,
      percentage: calculatePercentage(kwh, totalKwh),
    };
  });

  let comparison: { previousPeriodKwh: number; percentageChange: number } | undefined;
  if (previousPeriodReadings) {
    const previousKwh = calculateTotalConsumption(previousPeriodReadings);
    comparison = {
      previousPeriodKwh: previousKwh,
      percentageChange: calculatePercentage(totalKwh - previousKwh, previousKwh),
    };
  }

  const peakReading = readings.reduce((peak, current) => current.watts > peak.watts ? current : peak, readings[0]);

  return {
    period: 'month',
    totalKwh,
    totalCost: totalKwh * tariffPerKwh,
    averageDailyKwh: totalKwh / 30,
    peakConsumptionWatts: peakReading?.watts || 0,
    peakConsumptionTime: peakReading?.timestamp || new Date(),
    byRoom,
    byDevice,
    comparison,
  };
};

/**
 * Calculate solar savings
 */
export const calculateSolarSavings = (
  generationKwh: number,
  consumedFromSolarKwh: number,
  tariffPerKwh: number
): number => {
  return consumedFromSolarKwh * tariffPerKwh;
};
