import { Projectile, Balloon } from '../../types/game';
import { checkCircleCollision, distance } from '../collision';
import { soundSynth } from '../../audio/soundSynth';

export function updateProjectiles(
  projectiles: Projectile[],
  balloons: Balloon[],
  deltaTime: number,
  globalSpeed: number,
  onBalloonDamage: (balloonId: string, damage: number, isSharp: boolean) => void,
  onExplosion: (x: number, y: number, radius: number) => void,
  spawnShard: (x: number, y: number, dx: number, dy: number, damage: number) => void
): Projectile[] {
  const remainingProjectiles: Projectile[] = [];

  for (const proj of projectiles) {
    let targetX = proj.targetX;
    let targetY = proj.targetY;

    if (proj.targetBalloonId && !proj.isExplosive && !proj.isShard && !proj.isLaser) {
      const targetB = balloons.find((b) => b.id === proj.targetBalloonId);
      if (targetB) {
        targetX = targetB.x;
        targetY = targetB.y;
      }
    }

    if (proj.isLaser) {
      // 저격수 레이저는 즉시 명중 처리 후 소멸
      for (const b of balloons) {
        if (distance(proj.x, proj.y, b.x, b.y) <= 30 || proj.targetBalloonId === b.id) {
          onBalloonDamage(b.id, proj.damage, proj.isSharp);
          break;
        }
      }
      continue; // 즉시 제거
    }

    const dx = targetX - proj.x;
    const dy = targetY - proj.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const moveDist = proj.speed * 60 * deltaTime * globalSpeed;

    if (dist <= moveDist || (proj.dx !== undefined && proj.dy !== undefined)) {
      if (proj.dx !== undefined && proj.dy !== undefined) {
        proj.x += proj.dx * moveDist;
        proj.y += proj.dy * moveDist;
      } else {
        proj.x = targetX;
        proj.y = targetY;
      }

      if (proj.isExplosive) {
        soundSynth.playExplosion();
        onExplosion(proj.x, proj.y, proj.blastRadius);

        for (const b of balloons) {
          if (distance(proj.x, proj.y, b.x, b.y) <= proj.blastRadius + 15) {
            onBalloonDamage(b.id, proj.damage, false);
          }
        }

        if (proj.damage >= 4) {
          const angles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];
          for (const angle of angles) {
            spawnShard(proj.x, proj.y, Math.cos(angle), Math.sin(angle), 1);
          }
        }
      } else {
        let hit = false;
        for (const b of balloons) {
          if (checkCircleCollision(proj.x, proj.y, 8, b.x, b.y, 18)) {
            onBalloonDamage(b.id, proj.damage, proj.isSharp);
            hit = true;
            if (!proj.isBoomerang) break; // 부메랑은 관통 가능
          }
        }
      }
    } else {
      if (proj.dx !== undefined && proj.dy !== undefined) {
        proj.x += proj.dx * moveDist;
        proj.y += proj.dy * moveDist;
      } else if (dist > 0) {
        proj.x += (dx / dist) * moveDist;
        proj.y += (dy / dist) * moveDist;
      }

      let hit = false;
      if (!proj.isExplosive) {
        for (const b of balloons) {
          if (checkCircleCollision(proj.x, proj.y, 8, b.x, b.y, 18)) {
            onBalloonDamage(b.id, proj.damage, proj.isSharp);
            hit = true;
            if (!proj.isBoomerang) break;
          }
        }
      }

      if (!hit) {
        remainingProjectiles.push(proj);
      }
    }
  }

  return remainingProjectiles;
}

export function drawProjectiles(ctx: CanvasRenderingContext2D, projectiles: Projectile[]) {
  ctx.save();
  for (const proj of projectiles) {
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, proj.isExplosive ? 6 : proj.isShard ? 5 : proj.isBoomerang ? 7 : 5, 0, Math.PI * 2);
    ctx.fillStyle = proj.isExplosive ? '#D90429' : proj.isShard ? '#FFB703' : proj.isBoomerang ? '#E76F51' : '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}
