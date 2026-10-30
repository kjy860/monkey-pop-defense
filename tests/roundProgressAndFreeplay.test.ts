import { describe, it, expect } from 'vitest';
import { getWaveSpawns, getFreeplayMultiplier } from '../src/game/waveData';

describe('Round Progress and Freeplay Mode Tests', () => {
  it('should generate boss wave 30 spawns correctly', () => {
    const wave30Spawns = getWaveSpawns(30);
    expect(wave30Spawns).toBeDefined();
    expect(wave30Spawns.some((s) => s.type === 'moab')).toBe(true);
  });

  it('should calculate freeplay wave 31+ strength multipliers correctly', () => {
    const standard = getFreeplayMultiplier(30);
    expect(standard.hpMultiplier).toBe(1.0);
    expect(standard.speedMultiplier).toBe(1.0);

    const freeplay31 = getFreeplayMultiplier(31);
    expect(freeplay31.hpMultiplier).toBeCloseTo(1.15, 2);
    expect(freeplay31.speedMultiplier).toBeCloseTo(1.05, 2);

    const freeplay35 = getFreeplayMultiplier(35);
    expect(freeplay35.hpMultiplier).toBeGreaterThan(freeplay31.hpMultiplier);
    expect(freeplay35.speedMultiplier).toBeGreaterThan(freeplay31.speedMultiplier);
  });

  it('should generate scaling spawns for freeplay waves', () => {
    const freeplaySpawns = getWaveSpawns(35);
    expect(freeplaySpawns.length).toBeGreaterThan(0);
    const moabSpawn = freeplaySpawns.find((s) => s.type === 'moab');
    expect(moabSpawn).toBeDefined();
    expect(moabSpawn!.count).toBeGreaterThanOrEqual(1);
  });
});
