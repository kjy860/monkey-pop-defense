import { BalloonType, WaveSpawnItem } from '../types/game';

export function getWaveSpawns(wave: number): WaveSpawnItem[] {
  if (wave <= 20) {
    const redCount = 8 + wave * 3;
    const blueCount = wave >= 3 ? (wave - 2) * 3 : 0;
    const leadCount = wave >= 10 ? (wave - 9) * 2 : 0;
    const spawns: WaveSpawnItem[] = [{ type: 'red', count: redCount, interval: 0.7 }];
    if (blueCount > 0) spawns.push({ type: 'blue', count: blueCount, interval: 0.8 });
    if (leadCount > 0) spawns.push({ type: 'lead', count: leadCount, interval: 1.0 });
    return spawns;
  }

  if (wave <= 50) {
    const ceramicCount = (wave - 20) * 2;
    const bfbCount = wave >= 50 ? 1 : wave >= 40 ? 1 : 0;
    const spawns: WaveSpawnItem[] = [
      { type: 'yellow', count: 20 + wave, interval: 0.4 },
      { type: 'lead', count: 10, interval: 0.8 },
      { type: 'ceramic', count: ceramicCount, interval: 1.0 },
    ];
    if (bfbCount > 0) {
      spawns.push({ type: 'bfb', count: bfbCount, interval: 3.0 });
    }
    return spawns;
  }

  if (wave <= 99) {
    const moabCount = 2 + Math.floor((wave - 50) / 10);
    const bfbCount = 1 + Math.floor((wave - 50) / 15);
    return [
      { type: 'ceramic', count: 30, interval: 0.6 },
      { type: 'moab', count: moabCount, interval: 2.0 },
      { type: 'bfb', count: bfbCount, interval: 3.5 },
    ];
  }

  if (wave === 100) {
    return [
      { type: 'ceramic', count: 40, interval: 0.5 },
      { type: 'moab', count: 5, interval: 1.5 },
      { type: 'bfb', count: 3, interval: 2.5 },
      { type: 'zomg', count: 1, interval: 4.0 },
    ];
  }

  // 무한 모드 (Freeplay 101+)
  const extraWaves = wave - 100;
  const zomgCount = 1 + Math.floor(extraWaves / 5);
  const bfbCount = 2 + Math.floor(extraWaves / 3);
  const moabCount = 5 + extraWaves;

  return [
    { type: 'moab', count: moabCount, interval: 1.0 },
    { type: 'bfb', count: bfbCount, interval: 2.0 },
    { type: 'zomg', count: zomgCount, interval: 3.0 },
  ];
}

export function getFreeplayMultiplier(wave: number): { hpMultiplier: number; speedMultiplier: number } {
  if (wave <= 100) {
    return { hpMultiplier: 1.0, speedMultiplier: 1.0 };
  }
  const extra = wave - 100;
  // 체력 매 라운드 15% 증가, 속도 매 라운드 5% 증가
  const hpMultiplier = Math.pow(1.15, extra);
  const speedMultiplier = Math.pow(1.05, extra);
  return { hpMultiplier, speedMultiplier };
}
