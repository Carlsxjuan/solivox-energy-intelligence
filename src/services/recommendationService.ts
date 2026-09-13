import { Device, Room, ConsumptionSummary, Recommendation } from '@/types';

/**
 * Generate recommendations based on consumption patterns
 */
export const generateRecommendations = (
  summary: ConsumptionSummary,
  devices: Device[],
  rooms: Room[],
  homeId: string
): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const tariffPerKwh = 0.85; // R$ 0.85 per kWh (Brazilian average)

  // Find highest consuming room
  const highestRoom = Object.entries(summary.byRoom).reduce((acc, [roomId, data]) =>
    data.kwh > (summary.byRoom[acc]?.kwh || 0) ? roomId : acc
  );

  if (highestRoom) {
    const room = rooms.find(r => r.id === highestRoom);
    const roomData = summary.byRoom[highestRoom];
    
    if (room && roomData.percentage > 40) {
      const topDeviceInRoom = devices
        .filter(d => d.roomId === highestRoom)
        .sort((a, b) => (summary.byDevice[b.id]?.kwh || 0) - (summary.byDevice[a.id]?.kwh || 0))[0];

      if (topDeviceInRoom) {
        const savings = (topDeviceInRoom.powerWatts * 2 * 30) / 1000;
        recommendations.push({
          id: `rec-high-room-${highestRoom}`,
          homeId,
          timestamp: new Date(),
          priority: 'high',
          category: 'consumption',
          title: `Reduzir tempo de ${topDeviceInRoom.name}`,
          description: `Seu ${room.name} representa ${roomData.percentage.toFixed(1)}% do consumo residencial. O ${topDeviceInRoom.name} é o equipamento que mais consome energia. Se reduzir o funcionamento em aproximadamente 2 horas por dia, o consumo estimado poderá diminuir.`,
          estimatedSavings: { kwh: savings, cost: savings * tariffPerKwh },
          deviceId: topDeviceInRoom.id,
          roomId: highestRoom,
        });
      }
    }
  }

  // Find devices with high standby consumption
  devices.forEach(device => {
    if (device.status === 'standby' || device.status === 'off') {
      const standbyKwh = (device.powerWatts * 0.05 * 24 * 30) / 1000; // Assume 5% standby power
      if (standbyKwh > 5) {
        recommendations.push({
          id: `rec-standby-${device.id}`,
          homeId,
          timestamp: new Date(),
          priority: 'medium',
          category: 'efficiency',
          title: `Desativar modo standby`,
          description: `Muitos dispositivos consomem energia mesmo em modo standby. Desativar completamente o ${device.name} pode economizar até 5% do consumo mensal.`,
          estimatedSavings: { kwh: standbyKwh, cost: standbyKwh * tariffPerKwh },
          deviceId: device.id,
          roomId: device.roomId,
        });
      }
    }
  });

  // AC/Cooling recommendations
  const acDevices = devices.filter(d => d.category === 'cooling');
  if (acDevices.length > 0) {
    const acConsumption = acDevices.reduce((sum, d) => sum + (summary.byDevice[d.id]?.kwh || 0), 0);
    if (acConsumption > 100) {
      recommendations.push({
        id: `rec-ac-efficiency`,
        homeId,
        timestamp: new Date(),
        priority: 'high',
        category: 'efficiency',
        title: 'Otimizar uso do ar-condicionado',
        description: 'O ar-condicionado representa uma grande parte do seu consumo. Ajustar a temperatura em 2°C ou usar modo "eco" pode reduzir o consumo em até 15%.',
        estimatedSavings: { kwh: acConsumption * 0.15, cost: acConsumption * 0.15 * tariffPerKwh },
      });
    }
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
};
