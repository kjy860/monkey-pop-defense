import React, { useEffect, useCallback, useRef } from 'react';
import { useGameStore } from './store/useGameStore';
import { useRecordStore } from './store/useRecordStore';
import HeaderHUD from './components/HeaderHUD';
import GameCanvas from './components/GameCanvas';
import TowerShop from './components/TowerShop';
import MapSelectModal from './components/modals/MapSelectModal';
import VictoryModal from './components/modals/VictoryModal';
import GameOverModal from './components/modals/GameOverModal';
import { soundSynth } from './audio/soundSynth';

export default function App() {
  const {
    gameState,
    difficulty,
    wave,
    hp,
    gold,
    score,
    selectedTowerType,
    selectedTowerId,
    gameSpeed,
    autoStart,
    activeBalloonsCount,
    setGameSpeed,
    togglePause,
    startWave,
    setSelectedTowerType,
    setSelectedTowerId,
    initGame,
    checkVictory,
  } = useGameStore();

  const { soundMuted, toggleSound } = useRecordStore();

  // Web Audio API 첫 인터랙션 시 자동 활성화 보장
  const handleFirstInteraction = useCallback(() => {
    soundSynth.init();
  }, []);

  // 키보드 단축키 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Input 창 등에서 타이핑 중일 때는 무시
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      handleFirstInteraction();

      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing' || gameState === 'paused') {
          togglePause();
        } else if (gameState === 'wave_ready') {
          startWave();
        }
      } else if (e.key === '1') {
        setSelectedTowerType('dart');
      } else if (e.key === '2') {
        setSelectedTowerType('tack');
      } else if (e.key === '3') {
        setSelectedTowerType('bomb');
      } else if (e.key === '4') {
        setSelectedTowerType('ice');
      } else if (e.key === 'Escape') {
        setSelectedTowerId(null);
        setSelectedTowerType(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, togglePause, startWave, setSelectedTowerType, setSelectedTowerId, handleFirstInteraction]);

  return (
    <div 
      className="flex flex-col h-screen w-screen bg-gray-900 overflow-hidden select-none"
      onClick={handleFirstInteraction}
    >
      {/* 상단 헤더 HUD */}
      <HeaderHUD />

      {/* 메인 게임 영역 (캔버스 + 우측 사이드바) */}
      <div className="flex flex-1 overflow-hidden relative">
        <GameCanvas />
        <TowerShop />
      </div>

      {/* 모달 팝업들 */}
      {gameState === 'map_select' && <MapSelectModal />}
      {gameState === 'victory' && <VictoryModal />}
      {gameState === 'game_over' && <GameOverModal />}
    </div>
  );
}
