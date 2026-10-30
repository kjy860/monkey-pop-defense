import { TowerEntity } from '../../types/game';

export function drawTower(ctx: CanvasRenderingContext2D, tower: TowerEntity, isSelected: boolean) {
  ctx.save();
  ctx.translate(tower.x, tower.y);

  if (isSelected) {
    ctx.beginPath();
    ctx.arc(0, 0, tower.range, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 183, 3, 0.15)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 183, 3, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 레벨별 화려한 이펙트 렌더링
  if (tower.level >= 2) {
    ctx.beginPath();
    ctx.arc(0, 0, 28 + (tower.level === 3 ? 6 : 0), 0, Math.PI * 2);
    ctx.strokeStyle = tower.level === 3 ? '#FFB703' : '#48CAE4';
    ctx.lineWidth = tower.level === 3 ? 3 : 2;
    ctx.setLineDash(tower.level === 3 ? [2, 2] : []);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 얼음 타워 눈보라 오라 (Lv.3) 또는 마법사 용오름 오라
  if (tower.type === 'ice' && tower.level === 3) {
    ctx.beginPath();
    ctx.arc(0, 0, tower.range * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(72, 202, 228, 0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(72, 202, 228, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (tower.type === 'wizard' && tower.level === 3) {
    ctx.beginPath();
    ctx.arc(0, 0, tower.range * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(217, 4, 41, 0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(217, 4, 41, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fillStyle = '#1b4332';
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  let emoji = '🐵';
  if (tower.type === 'tack') emoji = '📌';
  else if (tower.type === 'bomb') emoji = '💣';
  else if (tower.type === 'ice') emoji = '❄️';
  else if (tower.type === 'boomerang') emoji = '🪃';
  else if (tower.type === 'sniper') emoji = '🔭';
  else if (tower.type === 'wizard') emoji = '🧙‍♂️';
  else if (tower.type === 'dart') emoji = '🎯';

  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 0, 0);

  if (tower.level > 1) {
    ctx.fillStyle = '#FFB703';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Lv.${tower.level}`, 0, -28);
  }

  ctx.restore();
}
