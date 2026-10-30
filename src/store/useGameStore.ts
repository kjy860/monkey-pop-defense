import { create } from 'zustand';
import { Difficulty, GameState, MapConfig, Tower, TowerType } from '../types/game';
import { MAP_CONFIGS } from '../game/mapPaths';
import { TOWER_SPECS } from '../game/constants';
import { soundSynth } from '../audio/soundSynth';

interface GameStore {
  gameState: GameState;
  difficulty: Difficulty;
  mapConfig: MapConfig;
  hp: number;
  maxHp: number;
  gold: number;
  wave: number;
  score: number;
  gameSpeed: number;
  autoStart: boolean;
  selectedTowerType: TowerType | null;
  selectedTowerId: string | null;
  towers: Tower[];
  activeBalloonsCount: number;

  // Actions
  setDifficulty: (diff: Difficulty) => void;
  setGameSpeed: (speed: number) => void;
  setWave: (wave: number) => void;
  togglePause: () => void;
  setAutoStart: (auto: boolean) => void;
  setSelectedTowerType: (type: TowerType | null) => void;
  setSelectedTowerId: (id: string | null) => void;
  initGame: (diff: Difficulty) => void;
  startWave: () => void;
  endWave: () => void;
  takeDamage: (amount: number) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  placeTower: (type: TowerType, x: number, y: number) => boolean;
  upgradeTower: (towerId: string) => boolean;
  sellTower: (towerId: string) => void;
  setActiveBalloonsCount: (count: number) => void;
  checkVictory: () => void;
  resetToMapSelect: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'map_select',
  difficulty: 'normal',
  mapConfig: MAP_CONFIGS.normal,
  hp: 100,
  maxHp: 100,
  gold: 500,
  wave: 0,
  score: 0,
  gameSpeed: 1,
  autoStart: false,
  selectedTowerType: null,
  selectedTowerId: null,
  towers: [],
  activeBalloonsCount: 0,

  setDifficulty: (diff) => {
    const config = MAP_CONFIGS[diff];
    set({
      difficulty: diff,
      mapConfig: config,
      hp: config.startHp,
      maxHp: config.startHp,
      gold: config.startGold,
    });
  },

  setGameSpeed: (speed) => set({ gameSpeed: speed }),

  setWave: (wave) => set({ wave }),

  togglePause: () => {
    const { gameState } = get();
    if (gameState === 'playing') {
      set({ gameState: 'paused' });
    } else if (gameState === 'paused') {
      set({ gameState: 'playing' });
    }
  },

  setAutoStart: (auto) => set({ autoStart: auto }),

  setSelectedTowerType: (type) => set({ selectedTowerType: type, selectedTowerId: null }),

  setSelectedTowerId: (id) => set({ selectedTowerId: id, selectedTowerType: null }),

  initGame: (diff) => {
    const config = MAP_CONFIGS[diff];
    set({
      difficulty: diff,
      mapConfig: config,
      hp: config.startHp,
      maxHp: config.startHp,
      gold: config.startGold,
      wave: 0,
      score: 0,
      gameState: 'wave_ready',
      towers: [],
      selectedTowerType: null,
      selectedTowerId: null,
      activeBalloonsCount: 0,
    });
  },

  startWave: () => {
    const { gameState, wave } = get();
    if (gameState === 'wave_ready' || gameState === 'paused') {
      set({ gameState: 'playing', wave: wave + 1 });
    }
  },

  endWave: () => {
    const { wave, autoStart } = get();
    // 30라운드 완료 시 승리 모달 표시 (단, 무한 모드 31+ 에서는 계속 진행)
    if (wave === 30) {
      set({ gameState: 'victory' });
      return;
    }

    if (autoStart) {
      set({ gameState: 'playing', wave: wave + 1 });
    } else {
      set({ gameState: 'wave_ready' });
    }
  },

  takeDamage: (amount) => {
    const { hp } = get();
    const nextHp = Math.max(0, hp - amount);
    set({ hp: nextHp });
    if (nextHp <= 0) {
      set({ gameState: 'game_over' });
    }
  },

  addGold: (amount) => {
    set((state) => ({ gold: state.gold + amount, score: state.score + amount }));
  },

  spendGold: (amount) => {
    const { gold } = get();
    if (gold >= amount) {
      set({ gold: gold - amount });
      return true;
    }
    return false;
  },

  placeTower: (type, x, y) => {
    const { mapConfig, spendGold, towers } = get();
    const spec = TOWER_SPECS[type];
    const cost = Math.round(spec.baseCost * mapConfig.towerCostMultiplier);

    if (spendGold(cost)) {
      const newTower: Tower = {
        id: `tower_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        type,
        x,
        y,
        range: spec.range,
        damage: spec.damage,
        attackSpeed: spec.attackSpeed,
        level: 1,
        totalInvested: cost,
        lastAttackTime: 0,
        angle: 0,
      };
      set({ towers: [...towers, newTower], selectedTowerId: newTower.id });
      soundSynth.playPlace();
      return true;
    }
    return false;
  },

  upgradeTower: (towerId) => {
    const { towers, spendGold } = get();
    const tower = towers.find((t) => t.id === towerId);
    if (!tower) return false;

    const spec = TOWER_SPECS[tower.type];
    let upgradeCost = 0;
    let nextRange = tower.range;
    let nextDamage = tower.damage;
    let nextAttackSpeed = tower.attackSpeed;

    if (tower.level === 1) {
      upgradeCost = spec.lv2Cost;
      if (tower.type === 'dart') {
        nextRange = 150;
      } else if (tower.type === 'ice') {
        nextRange = 110;
      }
    } else if (tower.level === 2) {
      upgradeCost = spec.lv3Cost;
      if (tower.type === 'dart') {
        nextAttackSpeed = 0.4;
      } else if (tower.type === 'tack') {
        nextAttackSpeed = 0.6;
      } else if (tower.type === 'bomb') {
        nextDamage = 4;
      }
    } else {
      return false; // Max level reached
    }

    if (spendGold(upgradeCost)) {
      const updatedTowers = towers.map((t) => {
        if (t.id === towerId) {
          return {
            ...t,
            level: t.level + 1,
            range: nextRange,
            damage: nextDamage,
            attackSpeed: nextAttackSpeed,
            totalInvested: t.totalInvested + upgradeCost,
          };
        }
        return t;
      });
      set({ towers: updatedTowers });
      soundSynth.playUpgrade();
      return true;
    }
    return false;
  },

  sellTower: (towerId) => {
    const { towers, selectedTowerId } = get();
    const tower = towers.find((t) => t.id === towerId);
    if (!tower) return;

    const refund = Math.round(tower.totalInvested * 0.7);
    set((state) => ({
      gold: state.gold + refund,
      towers: state.towers.filter((t) => t.id !== towerId),
      selectedTowerId: selectedTowerId === towerId ? null : state.selectedTowerId,
    }));
    soundSynth.playSell();
  },

  setActiveBalloonsCount: (count) => set({ activeBalloonsCount: count }),

  checkVictory: () => {
    const { wave } = get();
    if (wave === 30) {
      set({ gameState: 'victory' });
    }
  },

  resetToMapSelect: () => {
    set({ gameState: 'map_select', selectedTowerId: null, selectedTowerType: null, towers: [] });
  },
}));
