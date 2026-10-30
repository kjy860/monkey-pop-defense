import { MapConfig } from '../types/game';

export const MAP_CONFIGS: Record<'easy' | 'normal' | 'hard', MapConfig> = {
  easy: {
    id: 'grass',
    name: '초원 구불길',
    difficulty: 'easy',
    startGold: 1200,
    startHp: 150,
    enemySpeedMultiplier: 0.9,
    towerCostMultiplier: 1.0,
    bgTheme: '#2D6A4F',
    trackColor: '#DDB892',
    waypoints: [
      { x: 0, y: 150 },
      { x: 200, y: 150 },
      { x: 200, y: 450 },
      { x: 400, y: 450 },
      { x: 400, y: 150 },
      { x: 600, y: 150 },
      { x: 600, y: 450 },
      { x: 800, y: 450 }
    ],
  },
  normal: {
    id: 'desert',
    name: '사막 오아시스',
    difficulty: 'normal',
    startGold: 1000,
    startHp: 100,
    enemySpeedMultiplier: 1.0,
    towerCostMultiplier: 1.0,
    bgTheme: '#E9C46A',
    trackColor: '#C69C6D',
    waypoints: [
      { x: 400, y: 0 },
      { x: 400, y: 200 },
      { x: 200, y: 200 },
      { x: 200, y: 400 },
      { x: 600, y: 400 },
      { x: 600, y: 200 },
      { x: 400, y: 200 },
      { x: 400, y: 600 }
    ],
  },
  hard: {
    id: 'volcano',
    name: '화산 능선',
    difficulty: 'hard',
    startGold: 800,
    startHp: 50,
    enemySpeedMultiplier: 1.1,
    towerCostMultiplier: 1.15,
    bgTheme: '#2B2D42',
    trackColor: '#4A4E69',
    waypoints: [
      { x: 0, y: 100 },
      { x: 700, y: 150 },
      { x: 100, y: 300 },
      { x: 700, y: 450 },
      { x: 100, y: 500 },
      { x: 800, y: 600 }
    ],
  },
};
