import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Difficulty } from '../../types/game';

export default function MapSelectModal() {
  const { initGame } = useGameStore();

  const handleSelect = (diff: Difficulty) => {
    initGame(diff);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-emerald-950 border-2 border-emerald-600 rounded-2xl max-w-4xl w-full p-8 shadow-2xl flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-emerald-300 mb-2 tracking-wider drop-shadow">
          몽키 팝 디펜스 (Monkey Pop Defense)
        </h2>
        <p className="text-emerald-200/80 mb-8 text-center text-sm md:text-base">
          난이도 및 전용 맵을 선택하여 원숭이 타워로 풍선을 방어하세요!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
          {/* 쉬움 카드 */}
          <div 
            onClick={() => handleSelect('easy')}
            className="bg-emerald-900/80 hover:bg-emerald-800 border-2 border-emerald-500/60 hover:border-emerald-400 rounded-xl p-6 cursor-pointer transition-all transform hover:-translate-y-1 shadow-lg flex flex-col items-center text-center group"
          >
            <div className="text-4xl mb-3">🌿</div>
            <h3 className="text-xl font-bold text-emerald-200 group-hover:text-white mb-1">초원 구불길</h3>
            <span className="text-xs uppercase px-2 py-0.5 bg-emerald-700 text-emerald-200 rounded-full mb-4">쉬움 (Easy)</span>
            <ul className="text-xs text-emerald-300 space-y-1 text-left w-full bg-emerald-950/60 p-3 rounded-lg border border-emerald-800">
              <li>• 긴 단일 S자 곡선 경로</li>
              <li>• 시작 골드: 650G</li>
              <li>• 초기 체력: 150 HP</li>
              <li>• 적 이동속도: 90%</li>
            </ul>
          </div>

          {/* 보통 카드 */}
          <div 
            onClick={() => handleSelect('normal')}
            className="bg-emerald-900/80 hover:bg-emerald-800 border-2 border-amber-500/60 hover:border-amber-400 rounded-xl p-6 cursor-pointer transition-all transform hover:-translate-y-1 shadow-lg flex flex-col items-center text-center group"
          >
            <div className="text-4xl mb-3">🏜️</div>
            <h3 className="text-xl font-bold text-amber-200 group-hover:text-white mb-1">사막 오아시스</h3>
            <span className="text-xs uppercase px-2 py-0.5 bg-amber-700 text-amber-200 rounded-full mb-4">보통 (Normal)</span>
            <ul className="text-xs text-amber-300 space-y-1 text-left w-full bg-emerald-950/60 p-3 rounded-lg border border-emerald-800">
              <li>• 2중 루프 교차 사격 맵</li>
              <li>• 시작 골드: 500G</li>
              <li>• 초기 체력: 100 HP</li>
              <li>• 적 이동속도: 100%</li>
            </ul>
          </div>

          {/* 어려움 카드 */}
          <div 
            onClick={() => handleSelect('hard')}
            className="bg-emerald-900/80 hover:bg-emerald-800 border-2 border-red-500/60 hover:border-red-400 rounded-xl p-6 cursor-pointer transition-all transform hover:-translate-y-1 shadow-lg flex flex-col items-center text-center group"
          >
            <div className="text-4xl mb-3">🌋</div>
            <h3 className="text-xl font-bold text-red-300 group-hover:text-white mb-1">화산 능선</h3>
            <span className="text-xs uppercase px-2 py-0.5 bg-red-800 text-red-200 rounded-full mb-4">어려움 (Hard)</span>
            <ul className="text-xs text-red-300 space-y-1 text-left w-full bg-emerald-950/60 p-3 rounded-lg border border-emerald-800">
              <li>• 짧고 빠른 지그재그 경로</li>
              <li>• 시작 골드: 400G</li>
              <li>• 초기 체력: 50 HP</li>
              <li>• 타워 비용: 115% / 속도 110%</li>
            </ul>
          </div>
        </div>

        <div className="text-xs text-emerald-400/70 text-center">
          원하는 난이도와 맵 카드를 클릭하여 게임을 즉시 시작하세요.
        </div>
      </div>
    </div>
  );
}
