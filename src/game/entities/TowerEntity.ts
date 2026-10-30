export interface TowerEntity {
  id: string;
  type: 'dart' | 'tack' | 'bomb' | 'ice';
  x: number;
  y: number;
  range: number;
  damage: number;
  attackSpeed: number;
  level: number;
  totalInvested: number;
  lastAttackTime: number;
  angle?: number;
}

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
  else if (tower.type === 'dart') emoji = '🎯';

  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 0, 0);

  if (tower.level > 1) {
    ctx.fillStyle = '#FFB703';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Lv.${tower.level}`, 0, -26);
  }

  ctx.restore();
}
