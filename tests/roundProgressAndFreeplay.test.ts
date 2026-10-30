import { describe, it, expect } from 'vitest';
import { getWaveSpawns, getFreeplayMultiplier } from '../src/game/waveData';

describe('Round Progress and Freeplay Mode Tests', () => {
  it('should generate boss wave 100 spawns correctly', () => {
    const wave100Spawns = getWaveSpawns(100);
    expect(wave100Spawns).toBeDefined();
    expect(wave100Spawns.some((s) => s.type === 'zomg')).toBe(true);
  });

  it('should calculate freeplay wave 101+ strength multipliers correctly', () => {
    const standard = getFreeplayMultiplier(100);
    expect(standard.hpMultiplier).toBe(1.0);
    expect(standard.speedMultiplier).toBe(1.0);

    const freeplay101 = getFreeplayMultiplier(101);
    expect(freeplay101.hpMultiplier).toBeCloseTo(1.15, 2);
    expect(freeplay101.speedMultiplier).toBeCloseTo(1.05, 2);

    const freeplay105 = getFreeplayMultiplier(105);
    expect(freeplay105.hpMultiplier).toBeGreaterThan(freeplay101.hpMultiplier);
    expect(freeplay105.speedMultiplier).toBeGreaterThan(freeplay101.speedMultiplier);
  });

  it('should generate scaling spawns for freeplay waves', () => {
    const freeplaySpawns = getWaveSpawns(105);
    expect(freeplaySpawns.length).toBeGreaterThan(0);
    const zomgSpawn = freeplaySpawns.find((s) => s.type === 'zomg');
    expect(zomgSpawn).toBeDefined();
    expect(zomgSpawn!.count).toBeGreaterThanOrEqual(1);
  });
});
