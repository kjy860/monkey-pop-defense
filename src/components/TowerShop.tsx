import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { TOWER_SPECS } from '../game/constants';
import { TowerType } from '../types/game';
import { soundSynth } from '../audio/soundSynth';
import { Shield, Zap, TrendingUp, DollarSign, Trash2, Crosshair } from 'lucide-react';

export default function TowerShop() {
  const {
    gold,
    mapConfig,
    towers,
    selectedTowerType,
    selectedTowerId,
    autoStart,
    setSelectedTowerType,
    setSelectedTowerId,
    setAutoStart,
    upgradeTower,
    sellTower,
    startWave,
    gameState,
  } = useGameStore();

  const selectedTower = towers.find((t) => t.id === selectedTowerId);
  const towerTypes: TowerType[] = ['dart', 'tack', 'bomb', 'ice'];

  const getTowerCost = (type: TowerType) => {
    return Math.round(TOWER_SPECS[type].baseCost * mapConfig.towerCostMultiplier);
  };

  const handleUpgrade = (towerId: string) => {
    const success = upgradeTower(towerId);
    if (success) {
      soundSynth.playUpgrade();
    }
  };

  const handleSell = (towerId: string) => {
    sellTower(towerId);
    soundSynth.playSell();
    setSelectedTowerId(null);
  };

  return (
    <aside className="w-80 bg-panel border-l border-emerald-800 flex flex-col justify-between p-4 select-none z-10 shadow-2xl overflow-y-auto">
      {/* 상단 패널: 선택된 타워 상세 정보 또는 상점 안내 */}
      <div className="flex flex-col space-y-4">
        <h2 className="text-emerald-300 font-bold text-base tracking-wider uppercase border-b border-emerald-800/60 pb-2">
          {selectedTower ? '타워 상세 관리' : '원숭이 타워 상점'}
        </h2>

        {selectedTower ? (
          <div className="bg-emerald-950/70 p-4 rounded-xl border border-emerald-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-white">
                {TOWER_SPECS[selectedTower.type].name}
              </span>
              <span className="bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-500/40">
                Lv. {selectedTower.level}
              </span>
            </div>

            <div className="text-xs text-emerald-200/80 space-y-1">
              <p>공격력: <span className="text-white font-semibold">{selectedTower.damage}</span></p>
              <p>사거리: <span className="text-white font-semibold">{selectedTower.range}px</span></p>
              <p>발사 간격: <span className="text-white font-semibold">{selectedTower.attackSpeed}초</span></p>
              <p>총 투자 골드: <span className="text-gold font-semibold">{selectedTower.totalInvested}G</span></p>
            </div>

            {/* 업그레이드 버튼 */}
            {selectedTower.level < 3 ? (
              <button
                onClick={() => handleUpgrade(selectedTower.id)}
                className="w-full mt-2 py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-lg shadow transition-colors flex items-center justify-center space-x-1"
              >
                <TrendingUp className="w-4 h-4" />
                <span>
                  업그레이드 ({selectedTower.level === 1 ? TOWER_SPECS[selectedTower.type].lv2Cost : TOWER_SPECS[selectedTower.type].lv3Cost}G)
                </span>
              </button>
            ) : (
              <div className="text-center py-2 bg-emerald-900/50 text-emerald-400 font-bold text-xs rounded-lg border border-emerald-700/30">
                최대 레벨 도달 완료
              </div>
            )}

            {/* 판매 버튼 */}
            <button
              onClick={() => handleSell(selectedTower.id)}
              className="w-full py-2 px-3 bg-red-900/80 hover:bg-red-800 text-red-200 font-bold text-sm rounded-lg shadow transition-colors flex items-center justify-center space-x-1 border border-red-700/50"
            >
              <Trash2 className="w-4 h-4" />
              <span>판매 ({Math.round(selectedTower.totalInvested * 0.7)}G 환급)</span>
            </button>
          </div>
        ) : (
          <div className="text-xs text-emerald-200/70 bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/50">
            타워를 클릭하여 상세 정보를 확인하고 업그레이드하거나 판매할 수 있습니다.
          </div>
        )}

        {/* 중단 패널: 타워 4종 상점 카드 */}
        <div className="space-y-2.5">
          <h3 className="text-emerald-300 font-bold text-sm tracking-wider uppercase">
            타워 구매 (단축키 1~4)
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {towerTypes.map((type, idx) => {
              const spec = TOWER_SPECS[type];
              const cost = getTowerCost(type);
              const isAffordable = gold >= cost;
              const isSelected = selectedTowerType === type;

              return (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedTowerType(isSelected ? null : type);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                    isSelected
                      ? 'bg-emerald-700 border-amber-400 ring-2 ring-amber-400 shadow-lg'
                      : isAffordable
                      ? 'bg-emerald-900/80 hover:bg-emerald-800 border-emerald-700'
                      : 'bg-gray-900/60 border-gray-800 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl p-1 bg-emerald-950 rounded-lg border border-emerald-700/50">
                      {type === 'dart' ? '🎯' : type === 'tack' ? '📌' : type === 'bomb' ? '💣' : '❄️'}
                    </span>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-sm text-white">{spec.name}</span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                          [{idx + 1}]
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-200/70 line-clamp-1">{spec.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold text-sm ${isAffordable ? 'text-gold' : 'text-red-400'}`}>
                      {cost}G
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 하단 패널: 자동 시작 체크박스 및 웨이브 제어 */}
      <div className="pt-4 border-t border-emerald-800/60 space-y-3">
        <label className="flex items-center space-x-2 cursor-pointer bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-700/50 hover:bg-emerald-900/60 transition-colors">
          <input
            type="checkbox"
            checked={autoStart}
            onChange={(e) => setAutoStart(e.target.checked)}
            className="w-4 h-4 text-emerald-600 bg-emerald-900 border-emerald-700 rounded focus:ring-emerald-500 accent-emerald-500"
          />
          <span className="text-xs font-semibold text-emerald-200">자동 웨이브 시작 (Auto Start)</span>
        </label>

        {gameState === 'wave_ready' && (
          <button
            onClick={startWave}
            className="w-full py-3 bg-btnGreen hover:bg-emerald-600 text-white font-bold text-base rounded-xl shadow-lg border border-emerald-500 transition-all animate-pulse flex items-center justify-center space-x-2"
          >
            <span>웨이브 시작</span>
          </button>
        )}
      </div>
    </aside>
  );
}
