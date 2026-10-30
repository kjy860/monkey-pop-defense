import { describe, it, expect } from 'vitest';
import { MAP_CONFIGS } from '../src/game/mapPaths';

describe('난이도 및 전용 맵 설정 검증', () => {
  it('쉬움(Easy) 난이도는 초원 구불길 맵과 올바른 파라미터를 가져야 한다', () => {
    const config = MAP_CONFIGS.easy;
    expect(config.id).toBe('grass');
    expect(config.name).toBe('초원 구불길');
    expect(config.startGold).toBe(1000);
    expect(config.startHp).toBe(150);
    expect(config.enemySpeedMultiplier).toBe(0.9);
    expect(config.towerCostMultiplier).toBe(1.0);
    expect(config.waypoints.length).toBeGreaterThan(1);
  });

  it('보통(Normal) 난이도는 사막 오아시스 맵과 올바른 파라미터를 가져야 한다', () => {
    const config = MAP_CONFIGS.normal;
    expect(config.id).toBe('desert');
    expect(config.name).toBe('사막 오아시스');
    expect(config.startGold).toBe(850);
    expect(config.startHp).toBe(100);
    expect(config.enemySpeedMultiplier).toBe(1.0);
    expect(config.towerCostMultiplier).toBe(1.0);
    expect(config.waypoints.length).toBeGreaterThan(1);
  });

  it('어려움(Hard) 난이도는 화산 능선 맵과 올바른 파라미터를 가져야 한다', () => {
    const config = MAP_CONFIGS.hard;
    expect(config.id).toBe('volcano');
    expect(config.name).toBe('화산 능선');
    expect(config.startGold).toBe(700);
    expect(config.startHp).toBe(50);
    expect(config.enemySpeedMultiplier).toBe(1.1);
    expect(config.towerCostMultiplier).toBe(1.15);
    expect(config.waypoints.length).toBeGreaterThan(1);
  });
});
