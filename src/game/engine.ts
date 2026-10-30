import { Balloon, Projectile, Particle, Tower, BalloonType } from '../types/game';
import { BalloonEntity, createBalloon, updateBalloonPosition } from './entities/BalloonEntity';
import { updateProjectiles } from './entities/ProjectileEntity';
import { createParticles, updateParticles } from './entities/ParticleEntity';
import { getWaveSpawns, getFreeplayMultiplier } from './waveData';
import { BALLOON_SPECS, TOWER_SPECS } from './constants';
import { distance } from './collision';
import { soundSynth } from '../audio/soundSynth';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;

  public balloons: BalloonEntity[] = [];
  public projectiles: Projectile[] = [];
  public particles: Particle[] = [];

  private spawnQueue: Array<{ type: BalloonType; time: number }> = [];
  private waveStartTime: number = 0;
  private isSpawning: boolean = false;

  private onTakeDamage: (amount: number) => void;
  private onAddGold: (amount: number) => void;
  private onEndWave: () => void;
  private getStoreState: () => any;

  constructor(
    canvas: HTMLCanvasElement,
    getStoreState: () => any,
    onTakeDamage: (amount: number) => void,
    onAddGold: (amount: number) => void,
    onEndWave: () => void
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context not available');
    this.ctx = context;
    this.getStoreState = getStoreState;
    this.onTakeDamage = onTakeDamage;
    this.onAddGold = onAddGold;
    this.onEndWave = onEndWave;
  }

  public start() {
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public prepareWave(wave: number) {
    this.balloons = [];
    this.projectiles = [];
    this.particles = [];
    this.spawnQueue = [];

    const spawns = getWaveSpawns(wave);
    let currentTime = 0;

    for (const group of spawns) {
      for (let i = 0; i < group.count; i++) {
        currentTime += group.interval;
        this.spawnQueue.push({ type: group.type, time: currentTime });
      }
    }

    this.waveStartTime = performance.now();
    this.isSpawning = true;
  }

  private loop = (currentTime: number) => {
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    const state = this.getStoreState();
    const { gameState, gameSpeed, mapConfig, wave, towers } = state;

    if (gameState === 'playing') {
      this.update(deltaTime, gameSpeed, mapConfig, wave, towers);
    }

    this.render(mapConfig, towers);

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(
    deltaTime: number,
    gameSpeed: number,
    mapConfig: any,
    wave: number,
    towers: Tower[]
  ) {
    // 1. 웨이브 스폰 처리
    if (this.isSpawning && this.spawnQueue.length > 0) {
      const elapsed = (performance.now() - this.waveStartTime) / 1000;
      while (this.spawnQueue.length > 0 && this.spawnQueue[0].time <= elapsed) {
        const item = this.spawnQueue.shift()!;
        const { hpMultiplier, speedMultiplier } = getFreeplayMultiplier(wave);
        const effectiveSpeedMult = speedMultiplier * mapConfig.enemySpeedMultiplier;
        const bId = `balloon_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        const newB = createBalloon(bId, item.type, hpMultiplier, effectiveSpeedMult);
        this.balloons.push(newB);
      }
    } else if (this.isSpawning && this.spawnQueue.length === 0) {
      this.isSpawning = false;
    }

    // 2. 풍선 이동 업데이트
    const remainingBalloons: BalloonEntity[] = [];
    for (const b of this.balloons) {
      const reachedEnd = updateBalloonPosition(b, mapConfig.waypoints, deltaTime, gameSpeed);
      if (reachedEnd) {
        let dmg = 1;
        if (b.type === 'blue') dmg = 1;
        else if (b.type === 'green') dmg = 1;
        else if (b.type === 'yellow') dmg = 1;
        else if (b.type === 'lead') dmg = 2;
        else if (b.type === 'ceramic') dmg = 5;
        else if (b.type === 'moab') dmg = 25;
        else if (b.type === 'bfb') dmg = 50;
        else if (b.type === 'zomg') dmg = 100;
        this.onTakeDamage(dmg);
      } else {
        remainingBalloons.push(b);
      }
    }
    this.balloons = remainingBalloons;

    // 3. 타워 공격 처리
    const now = performance.now() / 1000;
    for (const tower of towers) {
      if (now - tower.lastAttackTime >= tower.attackSpeed / gameSpeed) {
        if (tower.type === 'tack') {
          let attacked = false;
          const directions = tower.level >= 2 
            ? [0, Math.PI/6, Math.PI/3, Math.PI/2, (2*Math.PI)/3, (5*Math.PI)/6, Math.PI, (7*Math.PI)/6, (4*Math.PI)/3, (3*Math.PI)/2, (5*Math.PI)/3, (11*Math.PI)/6]
            : [0, Math.PI/4, Math.PI/2, (3*Math.PI)/4, Math.PI, (5*Math.PI)/4, (3*Math.PI)/2, (7*Math.PI)/4];

          for (const angle of directions) {
            const projId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            this.projectiles.push({
              id: projId,
              x: tower.x,
              y: tower.y,
              targetX: tower.x + Math.cos(angle) * tower.range,
              targetY: tower.y + Math.sin(angle) * tower.range,
              speed: 400,
              damage: tower.damage,
              isSharp: true,
              isExplosive: false,
              blastRadius: 0,
              dx: Math.cos(angle),
              dy: Math.sin(angle),
            });
            attacked = true;
          }
          if (attacked) {
            tower.lastAttackTime = now;
            soundSynth.playPop(1.2);
            for (let i = 0; i < 4; i++) {
              this.particles.push(...createParticles(tower.x, tower.y, '#FFB703', 1));
            }
          }
        } else if (tower.type === 'ice') {
          let frozenAny = false;
          for (const b of this.balloons) {
            if (distance(tower.x, tower.y, b.x, b.y) <= tower.range) {
              b.isFrozen = true;
              b.freezeDuration = tower.level >= 2 ? 2.0 : 1.5;
              frozenAny = true;
            }
          }
          if (frozenAny) {
            tower.lastAttackTime = now;
            soundSynth.playFreeze();
            for (let i = 0; i < 10; i++) {
              this.particles.push(...createParticles(tower.x, tower.y, '#48CAE4', 1));
            }
          }
        } else if (tower.type === 'sniper') {
          // 저격수: 맵 어디든 적 1마리 즉시 명중 (Lv3 최대 3마리 관통)
          let target: BalloonEntity | null = null;
          for (const b of this.balloons) {
            target = b;
            break; // 첫 번째 타겟
          }
          if (target) {
            tower.lastAttackTime = now;
            soundSynth.playPop(0.5);
            this.projectiles.push({
              id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              x: tower.x,
              y: tower.y,
              targetX: target.x,
              targetY: target.y,
              speed: 9999,
              damage: tower.damage,
              isSharp: true,
              isExplosive: false,
              blastRadius: 0,
              targetBalloonId: target.id,
              isLaser: true,
            });
            this.particles.push(...createParticles(target.x, target.y, '#FFB703', 6));
          }
        } else if (tower.type === 'boomerang') {
          let target: BalloonEntity | null = null;
          for (const b of this.balloons) {
            if (distance(tower.x, tower.y, b.x, b.y) <= tower.range) {
              target = b;
              break;
            }
          }
          if (target) {
            tower.lastAttackTime = now;
            soundSynth.playPop(1.4);
            const count = tower.level >= 2 ? 2 : 1;
            for (let i = 0; i < count; i++) {
              const ang = Math.atan2(target.y - tower.y, target.x - tower.x) + (i * 0.3);
              this.projectiles.push({
                id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                x: tower.x,
                y: tower.y,
                targetX: tower.x + Math.cos(ang) * tower.range,
                targetY: tower.y + Math.sin(ang) * tower.range,
                speed: 450,
                damage: tower.damage,
                isSharp: true,
                isExplosive: false,
                blastRadius: 0,
                isBoomerang: true,
                dx: Math.cos(ang),
                dy: Math.sin(ang),
              });
            }
          }
        } else if (tower.type === 'wizard') {
          let target: BalloonEntity | null = null;
          for (const b of this.balloons) {
            if (distance(tower.x, tower.y, b.x, b.y) <= tower.range) {
              target = b;
              break;
            }
          }
          if (target) {
            tower.lastAttackTime = now;
            soundSynth.playPop(1.8);
            const projId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            this.projectiles.push({
              id: projId,
              x: tower.x,
              y: tower.y,
              targetX: target.x,
              targetY: target.y,
              speed: 400,
              damage: tower.damage,
              isSharp: false,
              isExplosive: tower.level >= 2,
              blastRadius: tower.level >= 2 ? 60 : 25,
              targetBalloonId: target.id,
            });
            this.particles.push(...createParticles(target.x, target.y, '#D90429', 5));
          }
        } else {
          // 다트 및 폭탄 타워
          let target: BalloonEntity | null = null;
          let maxDist = -1;
          for (const b of this.balloons) {
            const dist = distance(tower.x, tower.y, b.x, b.y);
            if (dist <= tower.range) {
              if (b.distanceTraveled > maxDist) {
                maxDist = b.distanceTraveled;
                target = b;
              }
            }
          }

          if (target) {
            tower.lastAttackTime = now;
            const isBomb = tower.type === 'bomb';
            const blastRad = tower.level >= 2 ? 95 : 60;
            const dmg = isBomb ? tower.damage : 1;

            if (tower.type === 'dart' && tower.level === 3) {
              // Lv3 다트 산탄 3발
              const baseAngle = Math.atan2(target.y - tower.y, target.x - tower.x);
              const angles = [baseAngle - 0.2, baseAngle, baseAngle + 0.2];
              for (const ang of angles) {
                this.projectiles.push({
                  id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                  x: tower.x,
                  y: tower.y,
                  targetX: tower.x + Math.cos(ang) * tower.range,
                  targetY: tower.y + Math.sin(ang) * tower.range,
                  speed: 550,
                  damage: dmg,
                  isSharp: true,
                  isExplosive: false,
                  blastRadius: 0,
                  dx: Math.cos(ang),
                  dy: Math.sin(ang),
                });
              }
              for (let i = 0; i < 3; i++) {
                this.particles.push(...createParticles(tower.x, tower.y, '#FFFFFF', 1));
              }
            } else {
              const projId = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
              this.projectiles.push({
                id: projId,
                x: tower.x,
                y: tower.y,
                targetX: target.x,
                targetY: target.y,
                speed: isBomb ? 300 : 500,
                damage: dmg,
                isSharp: !isBomb,
                isExplosive: isBomb,
                blastRadius: blastRad,
                targetBalloonId: target.id,
              });
            }
          }
        }
      }
    }

    // 4. 투사체 업데이트 및 충돌 판정
    this.projectiles = updateProjectiles(
      this.projectiles,
      this.balloons,
      deltaTime,
      gameSpeed,
      (balloonId, dmg, isSharp) => {
        this.handleBalloonDamage(balloonId, dmg, isSharp, wave);
      },
      (x, y, radius) => {
        for (let i = 0; i < 15; i++) {
          this.particles.push(...createParticles(x, y, '#D90429', 1));
        }
      },
      (x, y, dx, dy, dmg) => {
        this.projectiles.push({
          id: `shard_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          x,
          y,
          targetX: x + dx * 100,
          targetY: y + dy * 100,
          speed: 350,
          damage: dmg,
          isSharp: true,
          isExplosive: false,
          blastRadius: 0,
          isShard: true,
          dx,
          dy,
        });
      }
    );

    // 5. 파티클 업데이트
    this.particles = updateParticles(this.particles, deltaTime, gameSpeed);

    // 6. 웨이브 클리어 체크 (엄격한 정산 분리 로직)
    if (!this.isSpawning && this.balloons.length === 0 && this.spawnQueue.length === 0) {
      this.onEndWave();
    }
  }

  private handleBalloonDamage(
    balloonId: string,
    damage: number,
    isSharp: boolean,
    wave: number
  ) {
    const idx = this.balloons.findIndex((b) => b.id === balloonId);
    if (idx === -1) return;

    const balloon = this.balloons[idx];

    if (balloon.type === 'lead' && isSharp) {
      return; // 납 풍선 면역
    }

    balloon.hp -= damage;
    this.particles.push(...createParticles(balloon.x, balloon.y, BALLOON_SPECS[balloon.type].color, 5));

    if (balloon.hp <= 0) {
      soundSynth.playPop(1.0);
      const spec = BALLOON_SPECS[balloon.type];
      this.onAddGold(spec.gold);

      const newBalloons: BalloonEntity[] = [];
      if (spec.children) {
        const childType = spec.children as BalloonType;
        const count = spec.childrenCount;
        const { hpMultiplier, speedMultiplier } = getFreeplayMultiplier(wave);

        for (let i = 0; i < count; i++) {
          const childId = `child_${Date.now()}_${Math.random().toString(36).substr(2, 5)}_${i}`;
          const childB = createBalloon(childId, childType, hpMultiplier, speedMultiplier);
          childB.currentWaypointIndex = balloon.currentWaypointIndex;
          childB.pathProgress = Math.max(0, balloon.pathProgress - i * 0.05);
          childB.distanceTraveled = balloon.distanceTraveled;
          childB.x = balloon.x;
          childB.y = balloon.y;
          newBalloons.push(childB);
        }
      }

      this.balloons.splice(idx, 1);
      this.balloons.push(...newBalloons);
    }
  }

  private render(mapConfig: any, towers: Tower[]) {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    this.ctx.fillStyle = mapConfig.bgTheme;
    this.ctx.fillRect(0, 0, width, height);

    const waypoints = mapConfig.waypoints;
    if (waypoints.length >= 2) {
      this.ctx.beginPath();
      this.ctx.moveTo(waypoints[0].x, waypoints[0].y);
      for (let i = 1; i < waypoints.length; i++) {
        this.ctx.lineTo(waypoints[i].x, waypoints[i].y);
      }
      this.ctx.strokeStyle = mapConfig.trackColor;
      this.ctx.lineWidth = 44;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.stroke();

      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    const state = this.getStoreState();
    const selectedId = state.selectedTowerId;

    for (const tower of towers) {
      const isSel = tower.id === selectedId;
      this.ctx.save();
      this.ctx.translate(tower.x, tower.y);

      if (isSel) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, tower.range, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 183, 3, 0.15)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(255, 183, 3, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([4, 4]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }

      if (tower.level >= 2) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 28 + (tower.level === 3 ? 6 : 0), 0, Math.PI * 2);
        this.ctx.strokeStyle = tower.level === 3 ? '#FFB703' : '#48CAE4';
        this.ctx.lineWidth = tower.level === 3 ? 3 : 2;
        this.ctx.setLineDash(tower.level === 3 ? [2, 2] : []);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }

      if (tower.type === 'ice' && tower.level === 3) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, tower.range * 0.8, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(72, 202, 228, 0.1)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(72, 202, 228, 0.4)';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
      } else if (tower.type === 'wizard' && tower.level === 3) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, tower.range * 0.85, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(217, 4, 41, 0.1)';
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(217, 4, 41, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }

      this.ctx.beginPath();
      this.ctx.arc(0, 0, 22, 0, Math.PI * 2);
      this.ctx.fillStyle = '#1b4332';
      this.ctx.fill();
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      let emoji = '🐵';
      if (tower.type === 'tack') emoji = '📌';
      else if (tower.type === 'bomb') emoji = '💣';
      else if (tower.type === 'ice') emoji = '❄️';
      else if (tower.type === 'boomerang') emoji = '🪃';
      else if (tower.type === 'sniper') emoji = '🔭';
      else if (tower.type === 'wizard') emoji = '🧙‍♂️';
      else if (tower.type === 'dart') emoji = '🎯';

      this.ctx.font = '20px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(emoji, 0, 0);

      if (tower.level > 1) {
        this.ctx.fillStyle = '#FFB703';
        this.ctx.font = 'bold 12px sans-serif';
        this.ctx.fillText(`Lv.${tower.level}`, 0, -28);
      }

      this.ctx.restore();
    }

    for (const b of this.balloons) {
      this.ctx.save();
      this.ctx.translate(b.x, b.y);

      const spec = BALLOON_SPECS[b.type];
      let radius = 14;
      if (b.type === 'ceramic') radius = 18;
      if (b.type === 'moab') radius = 30;
      if (b.type === 'bfb') radius = 38;
      if (b.type === 'zomg') radius = 46;

      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = spec.color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      if (b.isFrozen) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius + 2, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#48CAE4';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }

      if (
        b.maxHp > 1 ||
        b.type === 'ceramic' ||
        b.type === 'moab' ||
        b.type === 'bfb' ||
        b.type === 'zomg'
      ) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 10px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`${b.hp}`, 0, 0);
      }

      this.ctx.restore();
    }

    for (const proj of this.projectiles) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(proj.x, proj.y, proj.isExplosive ? 6 : proj.isShard ? 5 : proj.isBoomerang ? 7 : 5, 0, Math.PI * 2);
      this.ctx.fillStyle = proj.isExplosive ? '#D90429' : proj.isShard ? '#FFB703' : proj.isBoomerang ? '#E76F51' : '#FFFFFF';
      this.ctx.fill();
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      this.ctx.restore();
    }

    for (const p of this.particles) {
      this.ctx.save();
      const alpha = Math.max(0, p.life / p.maxLife);
      this.ctx.globalAlpha = alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();
      this.ctx.restore();
    }
  }
}
