export type Difficulty = 'easy' | 'normal' | 'hard';

export type MapThemeId = 'grass' | 'desert' | 'volcano';

export type TowerType = 'dart' | 'tack' | 'bomb' | 'ice' | 'boomerang' | 'sniper' | 'wizard';

export type BalloonType = 'red' | 'blue' | 'green' | 'yellow' | 'lead' | 'ceramic' | 'moab' | 'bfb' | 'zomg';

export type GameState = 'map_select' | 'wave_ready' | 'playing' | 'paused' | 'victory' | 'game_over';

export interface Waypoint {
  x: number;
  y: number;
}

export interface MapConfig {
  id: MapThemeId;
  name: string;
  difficulty: Difficulty;
  startGold: number;
  startHp: number;
  enemySpeedMultiplier: number;
  towerCostMultiplier: number;
  waypoints: Waypoint[];
  bgTheme: string;
  trackColor: string;
}

export interface Tower {
  id: string;
  type: TowerType;
  x: number;
  y: number;
  range: number;
  damage: number;
  attackSpeed: number; // 발사 간격 (초)
  level: number;
  totalInvested: number;
  lastAttackTime: number;
  angle?: number; // 압정 타워 등 시각적 회전용
}

export type TowerEntity = Tower;

export interface Balloon {
  id: string;
  type: BalloonType;
  hp: number;
  maxHp: number;
  speed: number;
  pathProgress: number; // 0.0 ~ 1.0 (웨이포인트 따라 이동)
  currentWaypointIndex: number;
  distanceTraveled: number; // 화면 내 경로 누적 거리
  x: number;
  y: number;
  isImmuneToSharp: boolean;
  isFrozen: boolean;
  freezeDuration: number; // 잔여 빙결 시간
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  damage: number;
  isSharp: boolean;
  isExplosive: boolean;
  blastRadius: number;
  isShard?: boolean; // 폭탄 파편 여부
  targetBalloonId?: string;
  dx?: number;
  dy?: number;
  isLaser?: boolean; // 저격수 레이저 이펙트용
  isBoomerang?: boolean; // 부메랑 궤적용
  angle?: number;
  returnPath?: boolean;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface WaveSpawnItem {
  type: BalloonType;
  count: number;
  interval: number; // 스폰 간격 (초)
}

export interface GameSaveRecord {
  highestRoundCleared: number;
  difficultyRecords: {
    easy: { cleared: boolean; highestFreeplayRound: number };
    normal: { cleared: boolean; highestFreeplayRound: number };
    hard: { cleared: boolean; highestFreeplayRound: number };
  };
  soundMuted: boolean;
}
