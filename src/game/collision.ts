export interface Point {
  x: number;
  y: number;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// 점과 선분 사이의 최단 거리 계산 (타워가 경로 위에 배치되는지 판정할 때 사용)
export function distanceToSegment(p: Point, a: Point, b: Point): number {
  const l2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  if (l2 === 0) return distance(p.x, p.y, a.x, a.y);
  
  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  
  const projectionX = a.x + t * (b.x - a.x);
  const projectionY = a.y + t * (b.y - a.y);
  
  return distance(p.x, p.y, projectionX, projectionY);
}

// 타워 배치가 경로(트랙)와 너무 가까운지 검증
export function isTooCloseToTrack(towerX: number, towerY: number, waypoints: Point[], minDistance: number = 30): boolean {
  for (let i = 0; i < waypoints.length - 1; i++) {
    const dist = distanceToSegment({ x: towerX, y: towerY }, waypoints[i], waypoints[i + 1]);
    if (dist < minDistance) {
      return true;
    }
  }
  return false;
}

// 기존 다른 타워와 겹치는지 검증
export function isCollidingWithOtherTowers(towerX: number, towerY: number, existingTowers: Array<{ x: number; y: number }>, minDistance: number = 35): boolean {
  for (const t of existingTowers) {
    if (distance(towerX, towerY, t.x, t.y) < minDistance) {
      return true;
    }
  }
  return false;
}

// 투사체와 풍선 간의 충돌 판정 (원-원 충돌)
export function checkCircleCollision(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number
): boolean {
  const distSq = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  const radiiSum = r1 + r2;
  return distSq <= radiiSum * radiiSum;
}
