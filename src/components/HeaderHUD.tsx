import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { useRecordStore } from '../store/useRecordStore';
import { Heart, Coins, Play, Pause, FastForward, Volume2, VolumeX } from 'lucide-react';

export default function HeaderHUD() {
  const {
    hp,
    maxHp,
    gold,
    wave,
    gameState,
    gameSpeed,
    setGameSpeed,
    togglePause,
    startWave,
  } = useGameStore();

  const { soundMuted, toggleSound } = useRecordStore();

  return (
    <header className="h-16 bg-panel border-b border-emerald-800 flex items-center justify-between px-6 select-none z-20 shadow-md">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700/50">
          <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" />
          <span className="font-bold text-lg tracking-wide">
            {hp} <span className="text-xs text-gray-400">/ {maxHp}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-700/50">
          <Coins className="w-5 h-5 text-gold fill-gold" />
          <span className="font-bold text-lg text-gold tracking-wide">{gold} G</span>
        </div>
      </div>

      <div className="flex items-center space-x-3 bg-emerald-950/80 px-5 py-1.5 rounded-full border border-emerald-600/60 shadow-inner">
        <span className="text-emerald-300 font-semibold text-sm uppercase tracking-wider">
          {wave > 100 ? `Freeplay Round ${wave}` : `Round ${wave} / 100`}
        </span>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 text-white transition-colors focus:outline-none"
          title={soundMuted ? '음소거 해제' : '음소거'}
        >
          {soundMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-300" />}
        </button>

        <button
          onClick={() => setGameSpeed(gameSpeed === 1 ? 2 : 1)}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-bold text-sm border transition-colors ${
            gameSpeed === 2
              ? 'bg-amber-600 border-amber-500 text-white'
              : 'bg-emerald-900 border-emerald-700 text-emerald-200 hover:bg-emerald-800'
          }`}
          title="게임 속도 전환 (1x / 2x)"
        >
          <FastForward className="w-4 h-4" />
          <span>{gameSpeed}x</span>
        </button>

        {gameState === 'playing' || gameState === 'paused' ? (
          <button
            onClick={togglePause}
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-bold text-sm border transition-colors ${
              gameState === 'paused'
                ? 'bg-btnGreen border-emerald-600 text-white animate-bounce'
                : 'bg-btnRed border-red-600 text-white'
            }`}
          >
            {gameState === 'paused' ? (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>계속</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>일시정지</span>
              </>
            )}
          </button>
        ) : gameState === 'wave_ready' ? (
          <button
            onClick={startWave}
            className="flex items-center space-x-1 px-4 py-2 rounded-lg font-bold text-sm bg-btnGreen hover:bg-emerald-600 border border-emerald-500 text-white shadow-lg transition-all animate-pulse"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>웨이브 시작</span>
          </button>
        ) : null}
      </div>
    </header>
  );
}
