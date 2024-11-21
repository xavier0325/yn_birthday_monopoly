<template>
  <div class="dice-container">
    <div 
      class="dice" 
      @click="() => rollDice()" 
      :class="{ disabled, rolling }"
    >
      <div class="dice-inner">
        <div class="dice-dots" :class="`dots-${currentValue}`">
          <div v-for="i in 9" :key="i" class="dot-position">
            <div v-if="shouldShowDot(currentValue, i)" class="dot"></div>
          </div>
        </div>
      </div>
      <div class="dice-shadow"></div>
    </div>
    <div class="dice-label">
      <n-tag :type="disabled ? 'warning' : 'success'" round size="small">
        {{ disabled ? '等待其他玩家' : '点击骰子' }}
      </n-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { NTag } from 'naive-ui';
import { soundManager } from '../utils/sound';

const props = defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'roll', value: number): void;
}>();

const currentValue = ref(1);
const rolling = ref(false);

// 根据骰子点数和位置判断是否显示点
const shouldShowDot = (value: number, position: number) => {
  const patterns = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9]
  };
  return patterns[value as keyof typeof patterns]?.includes(position);
};

const rollDice = async (forcedValue?: number) => {
  if (props.disabled || rolling.value) return;
  
  rolling.value = true;
  
  try {
    // 播放一次骰子滚动音效
    soundManager.play('roll');
    
    // 骰子滚动动画
    for (let i = 0; i < 8; i++) {
      currentValue.value = Math.floor(Math.random() * 6) + 1;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // 生成最终点数并立即停止音效
    const value = forcedValue !== undefined ? forcedValue : Math.floor(Math.random() * 6) + 1;
    currentValue.value = value;
    soundManager.stop('roll');
    
    // 等待最后的动画完成
    await new Promise(resolve => setTimeout(resolve, 300));
    
    rolling.value = false;
    emit('roll', value);
  } catch (error) {
    soundManager.stop('roll');
    rolling.value = false;
  }
};

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  if (event.altKey && event.key >= '1' && event.key <= '6') {
    const value = parseInt(event.key);
    rollDice(value);
  }
};

// 添加和移除键盘事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

.dice-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: @spacing-md;
  padding: @spacing-lg;
  .glass-effect();
  border-radius: @border-radius-xl;
  transition: @transition-bounce;
  animation: float 3s infinite;

  &:hover {
    transform: translateY(-4px);
    box-shadow: @shadow-xl;
  }

  .dice {
    width: 120px;
    height: 120px;
    cursor: pointer;
    position: relative;
    transform-style: preserve-3d;
    transition: @transition-bounce;

    .dice-inner {
      width: 100%;
      height: 100%;
      background: @bg-white;
      border-radius: @border-radius-lg;
      border: 4px solid @primary-light;
      box-shadow: 
        inset 0 0 15px rgba(0, 0, 0, 0.1),
        0 8px 16px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: @transition-bounce;
      transform: rotate(-5deg);

      &:hover {
        transform: rotate(5deg);
        border-color: @primary-color;
      }
    }

    .dice-dots {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 8px;
      padding: 16px;
      width: 80%;
      height: 80%;

      .dot-position {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .dot {
        width: 16px;
        height: 16px;
        background: @primary-color;
        border-radius: 50%;
        box-shadow: 
          inset -2px -2px 4px rgba(0, 0, 0, 0.2),
          0 2px 4px rgba(0, 0, 0, 0.1);
        animation: pulse 2s infinite;
      }
    }

    .dice-shadow {
      position: absolute;
      bottom: -12px;
      left: 10%;
      width: 80%;
      height: 20px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      filter: blur(8px);
      transform: rotate(-5deg);
      transition: @transition-bounce;
    }

    &.rolling {
      animation: roll 0.5s ease-in-out;
      
      .dice-inner {
        animation: wiggle 0.5s ease-in-out;
      }
    }

    &.disabled {
      opacity: 0.7;
      cursor: not-allowed;
      filter: grayscale(0.5);

      .dice-inner {
        border-color: @text-secondary;
      }
    }
  }

  .dice-label {
    :deep(.n-tag) {
      font-size: @font-size-sm;
      padding: @spacing-xs @spacing-md;
      box-shadow: @shadow-sm;
      animation: bounce 2s infinite;
    }
  }
}

@keyframes roll {
  0% { transform: rotate(0) scale(1); }
  25% { transform: rotate(90deg) scale(0.9); }
  50% { transform: rotate(180deg) scale(0.8); }
  75% { transform: rotate(270deg) scale(0.9); }
  100% { transform: rotate(360deg) scale(1); }
}

@media (max-width: 768px) {
  .dice-container {
    padding: @spacing-md;

    .dice {
      width: 100px;
      height: 100px;

      .dice-dots {
        padding: 12px;
        gap: 6px;

        .dot {
          width: 12px;
          height: 12px;
        }
      }
    }
  }
}
</style>