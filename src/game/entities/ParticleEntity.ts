export interface ParticleEntity {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export function createParticles(x: number, y: number, color: string, count: number = 8): ParticleEntity[] {
  const particles: ParticleEntity[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    const maxLife = 0.3 + Math.random() * 0.3;
    particles.push({
      id: `particle_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      size: 3 + Math.random() * 3,
      life: maxLife,
      maxLife,
    });
  }
  return particles;
}

export function updateParticles(particles: ParticleEntity[], deltaTime: number, globalSpeed: number): ParticleEntity[] {
  const remaining: ParticleEntity[] = [];
  for (const p of particles) {
    p.x += p.vx * 60 * deltaTime * globalSpeed;
    p.y += p.vy * 60 * deltaTime * globalSpeed;
    p.life -= deltaTime * globalSpeed;
    if (p.life > 0) {
      remaining.push(p);
    }
  }
  return remaining;
}

export function drawParticles(ctx: CanvasRenderingContext2D, particles: ParticleEntity[]) {
  ctx.save();
  for (const p of particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  ctx.restore();
}
