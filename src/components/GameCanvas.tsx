import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';
import { GameEngine } from '../game/engine';
import { drawTower } from '../game/entities/TowerEntity';
import { drawBalloon } from '../game/entities/BalloonEntity';
import { drawProjectiles } from '../game/entities/ProjectileEntity';
import { drawParticles } from '../game/entities/ParticleEntity';
import { isTooCloseToTrack, isCollidingWithOtherTowers } from '../game/collision';
import { TOWER_SPECS } from '../game/constants';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const {
    mapConfig,
    towers,
    selectedTowerType,
    selectedTowerId,
    placeTower,
    setSelectedTowerId,
    setSelectedTowerType,
    takeDamage,
    addGold,
    endWave,
  } = useGameStore();

  const getStoreState = useGameStore.getState;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(
      canvas,
      getStoreState,
      takeDamage,
      addGold,
      endWave
    );
    engineRef.current = engine;
    engine.start();

    return () => {
      engine.stop();
    };
  }, [takeDamage, addGold, endWave, getStoreState]);

  // 웨이브 준비 시 엔진 초기화
  const gameState = useGameStore((state) => state.gameState);
  const wave = useGameStore((state) => state.wave);

  useEffect(() => {
    if (engineRef.current && gameState === 'wave_ready' && wave > 0) {
      engineRef.current.prepareWave(wave);
    }
  }, [gameState, wave]);

  // 캔버스 내 렌더링 루프 및 이벤트 핸들러
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. 배경 렌더링
      ctx.fillStyle = mapConfig.bgTheme;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. 트랙(경로) 렌더링
      const waypoints = mapConfig.waypoints;
      if (waypoints.length > 1) {
        ctx.beginPath();
        ctx.moveTo(waypoints[0].x, waypoints[0].y);
        for (let i = 1; i < waypoints.length; i++) {
          ctx.lineTo(waypoints[i].x, waypoints[i].y);
        }
        ctx.strokeStyle = mapConfig.trackColor;
        ctx.lineWidth = 42;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        ctx.strokeStyle = '#00000033';
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      // 3. 타워 렌더링
      for (const t of towers) {
        drawTower(ctx, t, t.id === selectedTowerId);
      }

      // 4. 풍선 및 투사체, 파티클 렌더링 (엔진 보유 객체)
      if (engineRef.current) {
        for (const b of engineRef.current.balloons) {
          drawBalloon(ctx, b);
        }
        drawProjectiles(ctx, engineRef.current.projectiles);
        drawParticles(ctx, engineRef.current.particles);
      }

      // 5. 타워 설치 모드 시 마우스 가이드 렌더링
      if (selectedTowerType && mousePos) {
        const spec = TOWER_SPECS[selectedTowerType];
        const tooClose = isTooCloseToTrack(mousePos.x, mousePos.y, mapConfig.waypoints, 30) ||
                         isCollidingWithOtherTowers(mousePos.x, mousePos.y, towers, 35);

        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, spec.range, 0, Math.PI * 2);
        ctx.fillStyle = tooClose ? 'rgba(231, 111, 81, 0.15)' : 'rgba(42, 157, 143, 0.15)';
        ctx.fill();
        ctx.strokeStyle = tooClose ? 'rgba(231, 111, 81, 0.6)' : 'rgba(42, 157, 143, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = tooClose ? 'rgba(231, 111, 81, 0.8)' : 'rgba(42, 157, 143, 0.8)';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [mapConfig, towers, selectedTowerId, selectedTowerType, mousePos]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    setMousePos({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (selectedTowerType) {
      const tooClose = isTooCloseToTrack(x, y, mapConfig.waypoints, 30) ||
                       isCollidingWithOtherTowers(x, y, towers, 35);
      if (!tooClose) {
        placeTower(selectedTowerType, x, y);
      }
      return;
    }

    // 기존 타워 클릭 선택
    let clickedTowerId: string | null = null;
    for (const t of towers) {
      const dx = t.x - x;
      const dy = t.y - y;
      if (dx * dx + dy * dy <= 22 * 22) {
        clickedTowerId = t.id;
        break;
      }
    }

    if (clickedTowerId) {
      setSelectedTowerId(clickedTowerId);
    } else {
      setSelectedTowerId(null);
    }
  }, [selectedTowerType, mapConfig, towers, placeTower, setSelectedTowerId]);

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden">
      <div className="relative shadow-2xl rounded-xl overflow-hidden border-4 border-emerald-900 aspect-[4/3] max-h-[calc(100vh-5rem)]">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-full block cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}
