import { BalloonType, Waypoint } from '../../types/game';
import { BALLOON_SPECS } from '../constants';

export interface BalloonEntity {
  id: string;
  type: BalloonType;
  hp: number;
  maxHp: number;
  speed: number;
  pathProgress: number;
  currentWaypointIndex: number;
  distanceTraveled: number;
  x: number;
  y: number;
  isImmuneToSharp: boolean;
  isFrozen: boolean;
  freezeDuration: number;
}

export function createBalloon(
  id: string,
  type: BalloonType,
  hpMultiplier: number = 1.0,
  speedMultiplier: number = 1.0
): BalloonEntity {
  const spec = BALLOON_SPECS[type];
  const hp = Math.round(spec.hp * hpMultiplier);
  return {
    id,
    type,
    hp,
    maxHp: hp,
    speed: spec.speed * speedMultiplier,
    pathProgress: 0,
    currentWaypointIndex: 0,
    distanceTraveled: 0,
    x: 0,
    y: 0,
    isImmuneToSharp: spec.isImmuneToSharp,
    isFrozen: false,
    freezeDuration: 0,
  };
}

export function updateBalloonPosition(
  balloon: BalloonEntity,
  waypoints: Waypoint[],
  deltaTime: number,
  globalSpeed: number
): boolean {
  if (balloon.isFrozen) {
    balloon.freezeDuration -= deltaTime * globalSpeed;
    if (balloon.freezeDuration <= 0) {
      balloon.isFrozen = false;
      balloon.freezeDuration = 0;
    }
    return false; // Reached end: false
  }

  if (waypoints.length < 2) return false;

  const currentIdx = balloon.currentWaypointIndex;
  if (currentIdx >= waypoints.length - 1) {
    return true; // Reached end
  }

  const p1 = waypoints[currentIdx];
  const p2 = waypoints[currentIdx + 1];

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const segmentLen = Math.sqrt(dx * dx + dy * dy);

  if (segmentLen === 0) {
    balloon.currentWaypointIndex++;
    return false;
  }

  const moveDist = balloon.speed * 60 * deltaTime * globalSpeed;
  balloon.pathProgress += moveDist / segmentLen;
  balloon.distanceTraveled += moveDist;

  if (balloon.pathProgress >= 1.0) {
    balloon.pathProgress = 0;
    balloon.currentWaypointIndex++;
    if (balloon.currentWaypointIndex >= waypoints.length - 1) {
      return true; // Reached end
    }
    balloon.x = p2.x;
    balloon.y = p2.y;
  } else {
    const curP1 = waypoints[balloon.currentWaypointIndex];
    const curP2 = waypoints[balloon.currentWaypointIndex + 1];
    balloon.x = curP1.x + (curP2.x - curP1.x) * balloon.pathProgress;
    balloon.y = curP1.y + (curP2.y - curP1.y) * balloon.pathProgress;
  }

  return false;
}

export function drawBalloon(ctx: CanvasRenderingContext2D, balloon: BalloonEntity) {
  ctx.save();
  ctx.translate(balloon.x, balloon.y);

  const spec = BALLOON_SPECS[balloon.type];
  let radius = 14;
  if (balloon.type === 'ceramic') radius = 18;
  if (balloon.type === 'moab') radius = 32;

  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = spec.color;
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if (balloon.isFrozen) {
    ctx.beginPath();
    ctx.arc(0, 0, radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#48CAE4';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (balloon.maxHp > 1 || balloon.type === 'ceramic' || balloon.type === 'moab') {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${balloon.hp}`, 0, 0);
  }

  ctx.restore();
}
