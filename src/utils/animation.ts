import { Player } from '../types';

export class AnimationManager {
  private static instance: AnimationManager;
  private animations: Map<string, Animation> = new Map();

  static getInstance() {
    if (!AnimationManager.instance) {
      AnimationManager.instance = new AnimationManager();
    }
    return AnimationManager.instance;
  }

  async movePlayer(player: Player, from: number, to: number, duration: number = 500) {
    const key = `player-${player.id}`;
    const element = document.querySelector(`[data-player-id="${player.id}"]`);
    if (!element) return;

    // 取消之前的动画
    this.animations.get(key)?.cancel();

    // 添加移动中的类名
    element.classList.add('player-token-moving');

    // 创建移动动画
    const animation = element.animate([
      { transform: 'scale(1) translateY(0)' },
      { transform: 'scale(1.2) translateY(-30px)' },
      { transform: 'scale(1) translateY(0)' }
    ], {
      duration,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    });

    this.animations.set(key, animation);

    return new Promise(resolve => {
      animation.onfinish = () => {
        element.classList.remove('player-token-moving');
        this.animations.delete(key);
        resolve(true);
      };
    });
  }

  async showMoneyEffect(amount: number, x: number, y: number) {
    const element = document.createElement('div');
    element.className = 'money-effect';
    element.textContent = amount > 0 ? `+$${amount}` : `-$${Math.abs(amount)}`;
    element.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: 24px;
      font-weight: bold;
      color: ${amount > 0 ? '#00A870' : '#FF6B6B'};
      pointer-events: none;
      z-index: 1000;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    `;
    document.body.appendChild(element);

    const animation = element.animate([
      { 
        transform: 'translateY(0) scale(1)',
        opacity: 1 
      },
      { 
        transform: 'translateY(-50px) scale(1.2)',
        opacity: 0.8 
      },
      { 
        transform: 'translateY(-100px) scale(1)',
        opacity: 0 
      }
    ], {
      duration: 1000,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    });

    await animation.finished;
    element.remove();
  }

  async showParticles(x: number, y: number, type: 'money' | 'birthday' | 'chance') {
    const colors = {
      money: ['#00A870', '#00D68F'],
      birthday: ['#FF8FB1', '#FFC2D4'],
      chance: ['#7C5CFF', '#9E85FF']
    };

    const particles = Array.from({ length: 20 }, () => {
      const element = document.createElement('div');
      element.className = `particle ${type}`;
      const size = 4 + Math.random() * 4;
      element.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[type][Math.floor(Math.random() * 2)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
      `;
      document.body.appendChild(element);
      return element;
    });

    const animations = particles.map((particle, i) => {
      const angle = (i / particles.length) * Math.PI * 2;
      const distance = 100 + Math.random() * 50;
      const duration = 1000 + Math.random() * 500;

      return particle.animate([
        { 
          transform: 'translate(0, 0) scale(1) rotate(0deg)',
          opacity: 1 
        },
        { 
          transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0) rotate(${360 + Math.random() * 360}deg)`,
          opacity: 0 
        }
      ], {
        duration,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      });
    });

    await Promise.all(animations.map(a => a.finished));
    particles.forEach(p => p.remove());
  }

  async showGlowEffect(element: HTMLElement, color: string) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: radial-gradient(circle at center, ${color}40 0%, transparent 70%);
      pointer-events: none;
      opacity: 0;
    `;
    element.appendChild(glow);

    const animation = glow.animate([
      { opacity: 0, transform: 'scale(0.8)' },
      { opacity: 1, transform: 'scale(1.2)' },
      { opacity: 0, transform: 'scale(1.5)' }
    ], {
      duration: 800,
      easing: 'ease-out',
    });

    await animation.finished;
    glow.remove();
  }
}

export const animationManager = AnimationManager.getInstance(); 