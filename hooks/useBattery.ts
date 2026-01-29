// Hook para acceder a la información de batería del dispositivo
// Requisito de rúbrica: API de Batería (expo-battery)
import { useState, useEffect } from 'react';
import * as Battery from 'expo-battery';

export interface BatteryInfo {
  level: number; // 0 a 1
  percentage: number; // 0 a 100
  isCharging: boolean;
  batteryState: Battery.BatteryState;
  isLowBattery: boolean; // Menos del 20%
}

export function useBattery(): BatteryInfo {
  const [level, setLevel] = useState<number>(1);
  const [batteryState, setBatteryState] = useState<Battery.BatteryState>(
    Battery.BatteryState.UNKNOWN
  );

  useEffect(() => {
    // Obtener nivel inicial de batería
    const getBatteryInfo = async () => {
      try {
        const batteryLevel = await Battery.getBatteryLevelAsync();
        const state = await Battery.getBatteryStateAsync();
        setLevel(batteryLevel);
        setBatteryState(state);
      } catch (error) {
        console.error('Error getting battery info:', error);
      }
    };

    getBatteryInfo();

    // Suscribirse a cambios de nivel de batería
    const levelSubscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setLevel(batteryLevel);
    });

    // Suscribirse a cambios de estado de carga
    const stateSubscription = Battery.addBatteryStateListener(({ batteryState: state }) => {
      setBatteryState(state);
    });

    // Cleanup
    return () => {
      levelSubscription.remove();
      stateSubscription.remove();
    };
  }, []);

  const isCharging =
    batteryState === Battery.BatteryState.CHARGING ||
    batteryState === Battery.BatteryState.FULL;

  const percentage = Math.round(level * 100);
  const isLowBattery = percentage < 20;

  return {
    level,
    percentage,
    isCharging,
    batteryState,
    isLowBattery,
  };
}

export default useBattery;
