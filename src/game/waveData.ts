import { BalloonType, WaveSpawnItem } from '../types/game';

export function getWaveSpawns(wave: number): WaveSpawnItem[] {
  if (wave <= 5) {
    const redCount = 10 + wave * 5;
    const blueCount = wave >= 3 ? (wave - 2) * 4 : 0;
    const spawns: WaveSpawnItem[] = [{ type: 'red', count: redCount, interval: 0.8 }];
    if (blueCount > 0) {
      spawns.push({ type: 'blue', count: blueCount, interval: 1.0 });
    }
    return spawns;
  }

  if (wave <= 10) {
    const greenCount = (wave - 5) * 6;
    const yellowCount = wave >= 8 ? (wave - 7) * 5 : 0;
    const spawns: WaveSpawnItem[] = [
      { type: 'blue', count: 15, interval: 0.6 },
      { type: 'green', count: greenCount, interval: 0.7 },
    ];
    if (yellowCount > 0) {
      spawns.push({ type: 'yellow', count: yellowCount, interval: 0.6 });
    }
    return spawns;
  }

  if (wave <= 18) {
    const hasLead = wave >= 15;
    const spawns: WaveSpawnItem[] = [
      { type: 'yellow', count: 20 + (wave - 10) * 3, interval: 0.5 },
      { type: 'green', count: 15, interval: 0.6 },
    ];
    if (hasLead) {
      spawns.push({ type: 'lead', count: (wave - 14) * 3, interval: 1.2 });
    }
    return spawns;
  }

  if (wave <= 24) {
    return [
      { type: 'lead', count: 8 + (wave - 18) * 2, interval: 1.0 },
      { type: 'yellow', count: 30, interval: 0.4 },
      { type: 'ceramic', count: (wave - 18) * 2, interval: 1.5 },
    ];
  }

  if (wave <= 29) {
    return [
      { type: 'ceramic', count: 10 + (wave - 24) * 4, interval: 1.0 },
      { type: 'lead', count: 15, interval: 0.8 },
      { type: 'yellow', count: 25, interval: 0.3 },
    ];
  }

  if (wave === 30) {
    return [
      { type: 'lead', count: 10, interval: 0.6 },
      { type: 'ceramic', count: 15, interval: 0.8 },
      { type: 'moab', count: 1, interval: 3.0 },
    ];
  }

  // 무한 모드 (Freeplay 31+)
  const extraWaves = wave - 30;
  const moabCount = 1 + Math.floor(extraWaves / 3);
  const ceramicCount = 15 + extraWaves * 3;
  const leadCount = 10 + extraWaves * 2;

  return [
    { type: 'lead', count: leadCount, interval: 0.6 },
    { type: 'ceramic', count: ceramicCount, interval: 0.7 },
    { type: 'moab', count: moabCount, interval: 2.0 },
  ];
}

export function getFreeplayMultiplier(wave: number): { hpMultiplier: number; speedMultiplier: number } {
  if (wave <= 30) {
    return { hpMultiplier: 1.0, speedMultiplier: 1.0 };
  }
  const extra = wave - 30;
  // 체력 매 라운드 15% 증가, 속도 매 라운드 5% 증가
  const hpMultiplier = Math.pow(1.15, extra);
  const speedMultiplier = Math.pow(1.05, extra);
  return { hpMultiplier, speedMultiplier };
}
