import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { RotateCcw, Skull } from 'lucide-react';

export default function GameOverModal() {
  const { wave, score, difficulty, initGame } = useGameStore();

  const handleRetry = () => {
    initGame(difficulty);
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 animate-fade-in select-none">
      <div className="bg-emerald-950 border-2 border-red-600 rounded-2xl max-w-md w-full p-8 shadow-2xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-950 rounded-full flex items-center justify-center border-2 border-red-500 shadow-inner animate-pulse">
            <Skull className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-red-500 tracking-wide">GAME OVER</h2>
          <p className="text-emerald-200 text-sm">
            기지가 풍선들의 공격을 버티지 못하고 파괴되었습니다.
          </p>
        </div>

        <div className="bg-emerald-900/60 border border-emerald-700/50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">최종 도달 라운드</span>
            <span className="font-bold text-amber-400">Round {wave}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">획득 점수 (골드)</span>
            <span className="font-bold text-gold">{score} 점</span>
          </div>
        </div>

        <button
          onClick={handleRetry}
          className="w-full py-3.5 bg-btnGreen hover:bg-emerald-600 text-white font-bold rounded-xl border border-emerald-500 shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span>다시 도전하기</span>
        </button>
      </div>
    </div>
  );
}
