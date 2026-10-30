import { BalloonType, WaveSpawnItem } from '../types/game';

export function getWaveSpawns(wave: number): WaveSpawnItem[] {
  // 10배 물량 스폰 시퀀스 시스템 (업그레이드 필수형 하드코어 경제 밸런스)
  if (wave <= 20) {
    const redCount = (8 + wave * 3) * 10;
    const blueCount = wave >= 3 ? (wave - 2) * 30 : 0;
    const leadCount = wave >= 10 ? (wave - 9) * 20 : 0;
    const spawns: WaveSpawnItem[] = [{ type: 'red', count: redCount, interval: 0.25 }];
    if (blueCount > 0) spawns.push({ type: 'blue', count: blueCount, interval: 0.3 });
    if (leadCount > 0) spawns.push({ type: 'lead', count: leadCount, interval: 0.4 });
    return spawns;
  }

  if (wave <= 50) {
    const ceramicCount = (wave - 20) * 15;
    const bfbCount = wave >= 50 ? 5 : wave >= 40 ? 3 : 1;
    const spawns: WaveSpawnItem[] = [
      { type: 'yellow', count: (20 + wave) * 5, interval: 0.2 },
      { type: 'lead', count: 100, interval: 0.3 },
      { type: 'ceramic', count: ceramicCount, interval: 0.4 },
    ];
    if (bfbCount > 0) {
      spawns.push({ type: 'bfb', count: bfbCount, interval: 1.5 });
    }
    return spawns;
  }

  if (wave <= 99) {
    const moabCount = (2 + Math.floor((wave - 50) / 10)) * 5;
    const bfbCount = (1 + Math.floor((wave - 50) / 15)) * 4;
    return [
      { type: 'ceramic', count: 150, interval: 0.3 },
      { type: 'moab', count: moabCount, interval: 0.8 },
      { type: 'bfb', count: bfbCount, interval: 1.2 },
    ];
  }

  if (wave === 100) {
    return [
      { type: 'ceramic', count: 300, interval: 0.2 },
      { type: 'moab', count: 30, interval: 0.5 },
      { type: 'bfb', count: 20, interval: 0.8 },
      { type: 'zomg', count: 8, interval: 1.5 },
    ];
  }

  // 무한 모드 (Freeplay 101+)
  const extraWaves = wave - 100;
  const zomgCount = 5 + Math.floor(extraWaves / 3);
  const bfbCount = 15 + extraWaves * 2;
  const moabCount = 30 + extraWaves * 3;

  return [
    { type: 'moab', count: moabCount, interval: 0.4 },
    { type: 'bfb', count: bfbCount, interval: 0.7 },
    { type: 'zomg', count: zomgCount, interval: 1.0 },
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
