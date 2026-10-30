import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../src/store/useGameStore';
import { TOWER_SPECS } from '../src/game/constants';
import { isTooCloseToTrack, isCollidingWithOtherTowers } from '../src/game/collision';

describe('타워 구매, 배치, 업그레이드 및 판매 검증', () => {
  beforeEach(() => {
    useGameStore.getState().initGame('normal');
  });

  it('보통 난이도 초기 골드 850G에서 다트 원숭이(200G) 구매 시 골드가 650G로 감소하고 타워가 배치된다.', () => {
    const store = useGameStore.getState();
    expect(store.gold).toBe(850);
    expect(store.towers.length).toBe(0);

    const success = store.placeTower('dart', 400, 100);
    expect(success).toBe(true);

    const updatedStore = useGameStore.getState();
    expect(updatedStore.gold).toBe(650);
    expect(updatedStore.towers.length).toBe(1);
    expect(updatedStore.towers[0].type).toBe('dart');
    expect(updatedStore.towers[0].level).toBe(1);
    expect(updatedStore.towers[0].totalInvested).toBe(200);
  });

  it('경로 근처나 기존 타워 위치에는 타워를 배치할 수 없다 (충돌 판정 검증)', () => {
    const waypoints = useGameStore.getState().mapConfig.waypoints;

    const isTrackCollision = isTooCloseToTrack(400, 0, waypoints, 30);
    expect(isTrackCollision).toBe(true);

    const existingTowers = [{ x: 300, y: 300 }];
    const isTowerCollision = isCollidingWithOtherTowers(310, 310, existingTowers, 35);
    expect(isTowerCollision).toBe(true);

    const isNoCollision = isCollidingWithOtherTowers(400, 400, existingTowers, 35);
    expect(isNoCollision).toBe(false);
  });

  it('타워 업그레이드 시 레벨이 상승하고 비용이 차감된다', () => {
    const store = useGameStore.getState();
    store.placeTower('dart', 400, 100);
    const towerId = useGameStore.getState().towers[0].id;
    const goldBeforeUpgrade = useGameStore.getState().gold; // 650G

    const upgradeSuccess = store.upgradeTower(towerId);
    expect(upgradeSuccess).toBe(true);

    const updatedStore = useGameStore.getState();
    const upgradedTower = updatedStore.towers[0];
    expect(upgradedTower.level).toBe(2);
    expect(upgradedTower.totalInvested).toBe(200 + TOWER_SPECS.dart.lv2Cost);
    expect(updatedStore.gold).toBe(goldBeforeUpgrade - TOWER_SPECS.dart.lv2Cost);
  });

  it('타워 판매 시 투자된 총 누적 골드의 70%가 즉시 환급된다', () => {
    const store = useGameStore.getState();
    store.placeTower('dart', 400, 100);
    const towerId = useGameStore.getState().towers[0].id;

    store.upgradeTower(towerId);

    const goldBeforeSell = useGameStore.getState().gold;
    const invested = useGameStore.getState().towers[0].totalInvested;
    const expectedRefund = Math.round(invested * 0.7);

    store.sellTower(towerId);

    const finalStore = useGameStore.getState();
    expect(finalStore.towers.length).toBe(0);
    expect(finalStore.gold).toBe(goldBeforeSell + expectedRefund);
  });
});
