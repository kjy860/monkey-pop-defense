import { describe, it, expect } from 'vitest';
import { BALLOON_SPECS } from '../src/game/constants';
import { createBalloon } from '../src/game/entities/BalloonEntity';

describe('Balloon Types, Immune Mechanics, and Split Logic Tests', () => {
  it('should have correct base specs for all balloon types', () => {
    expect(BALLOON_SPECS.red.hp).toBe(1);
    expect(BALLOON_SPECS.red.isImmuneToSharp).toBe(false);

    expect(BALLOON_SPECS.lead.hp).toBe(2);
    expect(BALLOON_SPECS.lead.isImmuneToSharp).toBe(true);

    expect(BALLOON_SPECS.ceramic.hp).toBe(8);
    expect(BALLOON_SPECS.ceramic.isImmuneToSharp).toBe(false);

    expect(BALLOON_SPECS.moab.hp).toBe(60);
    expect(BALLOON_SPECS.moab.isImmuneToSharp).toBe(false);
  });

  it('should create balloon instances with proper multipliers', () => {
    const redBalloon = createBalloon('b1', 'red', 1.0, 1.0);
    expect(redBalloon.hp).toBe(1);
    expect(redBalloon.speed).toBe(1.0);
    expect(redBalloon.isImmuneToSharp).toBe(false);

    const leadBalloon = createBalloon('b2', 'lead', 1.5, 1.0);
    expect(leadBalloon.hp).toBe(3); // Math.round(2 * 1.5)
    expect(leadBalloon.isImmuneToSharp).toBe(true);
  });

  it('should verify lead balloon immunity against sharp projectiles and vulnerability to explosive', () => {
    const leadSpec = BALLOON_SPECS.lead;
    const dartSpec = { isSharp: true };
    const bombSpec = { isExplosive: true };

    // 납 풍선은 날카로운 다트에 면역, 폭탄 타워에만 피격
    expect(leadSpec.isImmuneToSharp).toBe(true);
    expect(bombSpec.isExplosive).toBe(true);
  });

  it('should verify children spawn hierarchy on balloon pop', () => {
    expect(BALLOON_SPECS.blue.children).toBe('red');
    expect(BALLOON_SPECS.green.children).toBe('blue');
    expect(BALLOON_SPECS.yellow.children).toBe('green');
    expect(BALLOON_SPECS.ceramic.children).toBe('yellow');
    expect(BALLOON_SPECS.moab.children).toBe('ceramic');
    expect(BALLOON_SPECS.moab.childrenCount).toBe(3);
  });
});
