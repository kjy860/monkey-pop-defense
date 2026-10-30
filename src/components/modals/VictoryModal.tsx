import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { useRecordStore } from '../../store/useRecordStore';
import { Trophy, Play, Home } from 'lucide-react';

export default function VictoryModal() {
  const { wave, difficulty, resetToMapSelect } = useGameStore();
  const { updateRecord } = useRecordStore();

  React.useEffect(() => {
    updateRecord(difficulty, wave, true);
  }, [difficulty, wave, updateRecord]);

  const handleContinueFreeplay = () => {
    useGameStore.setState({ gameState: 'playing', wave: 101 });
  };

  const handleGoMain = () => {
    resetToMapSelect();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-fadeIn">
      <div className="bg-emerald-950 border-2 border-amber-400 rounded-2xl max-w-md w-full p-8 shadow-2xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-amber-500/20 border-2 border-amber-400 rounded-full flex items-center justify-center animate-bounce">
            <Trophy className="w-10 h-10 text-amber-400 fill-amber-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold text-amber-300 tracking-wide">
            축하합니다! 100스테이지를 방어했습니다.
          </h2>
          <p className="text-emerald-200 text-sm leading-relaxed">
            모든 웨이브를 성공적으로 방어하고 최종 보스 ZOMG를 격파했습니다.
          </p>
        </div>

        <div className="bg-emerald-900/60 border border-emerald-700 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">달성 난이도</span>
            <span className="font-bold text-amber-400 uppercase">{difficulty}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">최종 라운드</span>
            <span className="font-bold text-white">Round 100 클리어</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleContinueFreeplay}
            className="w-full flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all transform hover:scale-[1.02]"
          >
            <Play className="w-5 h-5 fill-gray-950" />
            <span>무한 모드로 계속하기</span>
          </button>

          <button
            onClick={handleGoMain}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 text-emerald-200 font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>메인 메뉴로 가기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
