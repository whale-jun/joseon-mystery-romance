import { BgEffect } from '../types/game';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

export class ParticleRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animId: number | null = null;
  private currentEffect: BgEffect = 'none';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    this.resize();
  };

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  public setEffect(effect: BgEffect) {
    if (this.currentEffect === effect) return;
    this.currentEffect = effect;
    this.initParticles();
    if (!this.animId && effect !== 'none') {
      this.loop();
    }
  }

  private initParticles() {
    this.particles = [];
    const count = this.getParticleCount();

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(true));
    }
  }

  private getParticleCount(): number {
    switch (this.currentEffect) {
      case 'petals': return 40;
      case 'moonlight': return 50;
      case 'rain': return 90;
      case 'fog': return 25;
      case 'embers': return 45;
      default: return 0;
    }
  }

  private createParticle(initial: boolean = false): Particle {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const y = initial ? Math.random() * h : -10;

    switch (this.currentEffect) {
      case 'petals':
        return {
          x: Math.random() * w,
          y,
          size: Math.random() * 8 + 6,
          speedX: Math.random() * 1.5 - 0.2,
          speedY: Math.random() * 1.2 + 0.8,
          opacity: Math.random() * 0.6 + 0.3,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 2 - 1,
          color: Math.random() > 0.4 ? 'rgba(255, 183, 197, ' : 'rgba(255, 218, 224, ',
        };

      case 'moonlight':
        return {
          x: Math.random() * w,
          y: initial ? Math.random() * h : h + 10,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 0.4 - 0.2,
          speedY: -(Math.random() * 0.5 + 0.2),
          opacity: Math.random() * 0.7 + 0.2,
          rotation: 0,
          rotationSpeed: 0,
          color: 'rgba(235, 220, 160, ',
        };

      case 'rain':
        return {
          x: Math.random() * w,
          y,
          size: Math.random() * 15 + 10, // length
          speedX: -1.5,
          speedY: Math.random() * 6 + 12,
          opacity: Math.random() * 0.4 + 0.2,
          rotation: 0,
          rotationSpeed: 0,
          color: 'rgba(160, 190, 230, ',
        };

      case 'embers':
        return {
          x: Math.random() * w,
          y: initial ? Math.random() * h : h + 10,
          size: Math.random() * 4 + 2,
          speedX: Math.random() * 1.2 - 0.6,
          speedY: -(Math.random() * 1.8 + 0.8),
          opacity: Math.random() * 0.8 + 0.2,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 3,
          color: Math.random() > 0.5 ? 'rgba(255, 110, 40, ' : 'rgba(255, 190, 50, ',
        };

      case 'fog':
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 120 + 80,
          speedX: Math.random() * 0.4 + 0.1,
          speedY: Math.random() * 0.1 - 0.05,
          opacity: Math.random() * 0.15 + 0.05,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 0.2 - 0.1,
          color: 'rgba(180, 190, 210, ',
        };

      default:
        return {
          x: 0,
          y: 0,
          size: 0,
          speedX: 0,
          speedY: 0,
          opacity: 0,
          rotation: 0,
          rotationSpeed: 0,
          color: 'transparent',
        };
    }
  }

  private loop = () => {
    if (this.currentEffect === 'none') {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animId = null;
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const w = this.canvas.width;
    const h = this.canvas.height;

    this.particles.forEach((p, idx) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      // Draw particle
      this.ctx.save();
      if (this.currentEffect === 'petals') {
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = `${p.color}${p.opacity})`;
        this.ctx.fill();
      } else if (this.currentEffect === 'moonlight') {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `${p.color}${p.opacity})`;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = 'rgba(240, 220, 150, 0.6)';
        this.ctx.fill();
      } else if (this.currentEffect === 'rain') {
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.speedX * 2, p.y + p.size);
        this.ctx.strokeStyle = `${p.color}${p.opacity})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
      } else if (this.currentEffect === 'embers') {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `${p.color}${p.opacity})`;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = 'rgba(255, 90, 20, 0.8)';
        this.ctx.fill();
      } else if (this.currentEffect === 'fog') {
        const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `${p.color}${p.opacity})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();

      // Reset when off screen
      if (p.y > h + 20 || p.y < -30 || p.x > w + 40 || p.x < -40) {
        this.particles[idx] = this.createParticle(false);
      }
    });

    this.animId = requestAnimationFrame(this.loop);
  };

  public destroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
