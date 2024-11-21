<template>
  <div class="chance-card-animation" v-if="show">
    <canvas ref="canvasRef" class="animation-canvas"></canvas>
    <div class="cards-container">
      <div 
        class="card"
        :class="{ 'card-selected': isSelected, 'card-revealed': isRevealed }"
        v-for="i in 3" 
        :key="i"
        :style="getCardStyle(i)"
        @click="selectCard(i)"
      >
        <div class="card-front">
          <div class="card-content">
            <div class="card-icon">🎲</div>
            <div class="card-title">机会</div>
          </div>
        </div>
        <div class="card-back">
          <div class="card-content">
            <div class="card-icon">{{ cardData?.type === 'success' ? '🎉' : '⚠️' }}</div>
            <div class="card-title">{{ cardData?.effect }}</div>
            <div class="card-amount" :class="{ positive: cardData?.amount > 0 }">
              {{ cardData?.amount > 0 ? '+' : '' }}${{ cardData?.amount?.toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { ChanceCard } from '../types';

const props = defineProps<{
  show: boolean;
  cardData: ChanceCard | null;
}>();

const emit = defineEmits<{
  (e: 'finish'): void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationFrame: number | null = null;
let particles: Array<{
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}> = [];

const selectedCard = ref(0);
const isSelected = ref(false);
const isRevealed = ref(false);

// 初始化画布
const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');

  // 创建初始粒子
  createParticles();
};

// 创建粒子
const createParticles = () => {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 4 + 1,
      color: `hsl(${Math.random() * 360}, 50%, 50%)`,
      alpha: Math.random()
    });
  }
};

// 动画循环
const animate = () => {
  if (!ctx) return;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // 更新和绘制粒子
  particles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.alpha = Math.max(0, particle.alpha - 0.005);

    if (particle.x < 0) particle.x = window.innerWidth;
    if (particle.x > window.innerWidth) particle.x = 0;
    if (particle.y < 0) particle.y = window.innerHeight;
    if (particle.y > window.innerHeight) particle.y = 0;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`;
    ctx.fill();
  });

  // 补充消失的粒子
  if (Math.random() < 0.1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 4 + 1,
      color: `hsl(${Math.random() * 360}, 50%, 50%)`,
      alpha: 1
    });
  }

  animationFrame = requestAnimationFrame(animate);
};

const getCardStyle = (index: number) => {
  const baseRotation = -10 + index * 10;
  const baseTranslateX = -100 + index * 100;
  
  return {
    transform: `rotate(${baseRotation}deg) translateX(${baseTranslateX}px)`,
    transitionDelay: `${index * 0.1}s`,
  };
};

const selectCard = async (index: number) => {
  if (isSelected.value) return;
  
  selectedCard.value = index;
  isSelected.value = true;
  
  // 等待选中动画完成
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 翻转卡片
  isRevealed.value = true;
  
  // 等待翻转动画完成
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 等待展示效果
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  emit('finish');
};

// 监听窗口大小变化
const handleResize = () => {
  if (!canvasRef.value) return;
  canvasRef.value.width = window.innerWidth;
  canvasRef.value.height = window.innerHeight;
};

// 生命周期钩子
onMounted(() => {
  initCanvas();
  animate();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  window.removeEventListener('resize', handleResize);
});

// 监听显示状态
watch(() => props.show, (newVal) => {
  if (newVal) {
    initCanvas();
    animate();
  } else if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

.chance-card-animation {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;

  .animation-canvas {
    position: absolute;
    inset: 0;
    z-index: -1;
  }
}

.cards-container {
  position: relative;
  width: 200px;
  height: 300px;
  transform-style: preserve-3d;
  z-index: 1;
}

.card {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  
  &:hover:not(.card-selected) {
    transform: translateY(-20px) scale(1.1) !important;
  }
  
  &.card-selected {
    transform: translateX(0) translateY(0) rotate(0deg) !important;
    z-index: 10;
    
    &:not(.card-revealed) {
      animation: pulse 1s infinite;
    }
  }
  
  &.card-revealed {
    transform: rotateY(180deg) !important;
  }
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: @border-radius-lg;
  background: linear-gradient(135deg, @primary-light, @primary-dark);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid rgba(255, 255, 255, 0.2);
}

.card-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, @secondary-light, @secondary-dark);
}

.card-content {
  text-align: center;
  color: white;
  padding: @spacing-lg;
  
  .card-icon {
    font-size: 48px;
    margin-bottom: @spacing-md;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
  
  .card-title {
    font-size: @font-size-lg;
    font-weight: bold;
    margin-bottom: @spacing-md;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .card-amount {
    font-size: @font-size-xl;
    font-weight: bold;
    color: #FF6B6B;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    &.positive {
      color: #00A870;
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@media (max-width: 768px) {
  .card {
    width: 150px;
    height: 225px;
  }
  
  .card-content {
    .card-icon {
      font-size: 36px;
    }
    
    .card-title {
      font-size: @font-size-md;
    }
    
    .card-amount {
      font-size: @font-size-lg;
    }
  }
}
</style> 