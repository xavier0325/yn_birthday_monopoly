<template>
  <div class="cell" :class="[cell.type, { 'has-players': players.length > 0, 'side-cell': isSideCell(cell.id) }]" :style="getCellStyle(cell)">
    <div class="cell-content">
      <div class="cell-type-indicator"></div>
      <div v-if="cell.type === 'property'" class="property-bg"></div>
      <div class="cell-header">
        <div class="cell-icon">{{ getCellIcon(cell.type) }}</div>
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <div class="cell-name">{{ cell.name }}</div>
          </template>
          {{ cell.name }}
        </n-tooltip>
      </div>
      <div class="cell-info">
        <template v-if="cell.price">
          <div class="cell-price">
            <n-tag size="tiny" type="success" round class="price-tag">
              <template #icon>
                <div class="money-icon">💰</div>
              </template>
              {{ cell.price.toLocaleString() }}
            </n-tag>
          </div>
          <div v-if="cell.owner !== undefined" class="owner-mark">
            <n-tooltip trigger="hover" placement="bottom">
              <template #trigger>
                <div 
                  class="owner-avatar"
                  :style="{
                    backgroundImage: `url(./avatar${cell.owner + 1}.png)`,
                    borderColor: getOwnerColor(cell.owner)
                  }"
                />
              </template>
              {{ `${getOwnerName(cell.owner)}的地产` }}
            </n-tooltip>
          </div>
        </template>
        <div class="cell-effect" v-if="cell.effect">
          <n-tooltip trigger="hover" placement="bottom">
            <template #trigger>
              <div class="effect-text" :class="{ 'start-effect': cell.type === 'start' }">
                <span class="effect-icon">{{ getEffectIcon(cell.type) }}</span>
                {{ cell.effect }}
              </div>
            </template>
            {{ cell.effect }}
          </n-tooltip>
        </div>
      </div>
    </div>
    <div class="players-wrapper">
      <div class="players" v-if="players.length">
        <div 
          v-for="player in players" 
          :key="player.id"
          class="player-token"
          :class="{ 'current-player': store.currentPlayer === player.id }"
          :data-player-id="player.id"
          :style="{ 
            backgroundImage: `url(./avatar${player.id + 1}.png)`,
            borderColor: player.color,
            '--glow-color': player.color,
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Cell, Player } from '../types';
import { NTag, NTooltip } from 'naive-ui';
import { useGameStore } from '../store';

const props = defineProps<{
  cell: Cell;
  players: Player[];
}>();

const store = useGameStore();

const getOwnerColor = (ownerId: number) => {
  return store.players.find(p => p.id === ownerId)?.color || '#ccc';
};

const getOwnerName = (ownerId: number) => {
  return store.players.find(p => p.id === ownerId)?.name || '未知玩家';
};

const getCellIcon = (type: string) => {
  const icons: Record<string, string> = {
    start: '🏁',
    property: '🏠',
    chance: '🎲',
    birthday: '🎂',
    tax: '💸'
  };
  return icons[type] || '🎯';
};

const getEffectIcon = (type: string) => {
  const icons: Record<string, string> = {
    start: '🎯',
    property: '🏘️',
    chance: '✨',
    birthday: '🎉',
    tax: '💰'
  };
  return icons[type] || '✨';
};

// 添加地产颜色数组
const propertyColors = [
  '#FFB5B5', // 粉红
  '#FFD1B5', // 橙粉
  '#FFFFB5', // 淡黄
  '#B5FFB5', // 淡绿
  '#B5FFFF', // 淡青
  '#B5B5FF', // 淡蓝
  '#FFB5FF', // 淡紫
  '#FFE4E1', // 浅玫瑰
  '#E6E6FA', // 淡紫丁香
  '#98FB98', // 淡绿薄荷
  '#87CEFA', // 淡天蓝
  '#DDA0DD', // 淡梅红
  '#F0E68C', // 卡其黄
  '#E0FFFF', // 淡青白
  '#FFDAB9', // 桃色
  '#D8BFD8', // 蓟色
];

const getCellStyle = (cell: Cell) => {
  if (cell.type === 'property') {
    // 根据地产ID选择颜色
    const colorIndex = cell.id % propertyColors.length;
    const baseColor = propertyColors[colorIndex];
    return {
      background: `linear-gradient(135deg, ${baseColor}66 0%, rgba(255, 255, 255, 0.3) 100%)`,
      '--property-color': baseColor,
    };
  }
  return {};
};

// 判断是否是左右两侧的格子
const isSideCell = (id: number) => {
  return (id >= 9 && id <= 15) || (id >= 25 && id <= 31);
};
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

.cell {
  position: relative;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: @border-radius-lg;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: @transition-bounce;
  overflow: hidden;
  font-size: 0.85em;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      inset 0 2px 4px rgba(255, 255, 255, 0.3),
      0 8px 16px rgba(0, 0, 0, 0.15);
    z-index: 1;
    background: rgba(255, 255, 255, 0.4);

    .cell-icon {
      animation: bounce 0.5s ease-in-out;
    }
  }

  .cell-type-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: transparent;
    transition: @transition-base;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .cell-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 6px 4px;
    position: relative;
    z-index: 1;
    min-height: 0;

    .cell-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;

      .cell-icon {
        font-size: @font-size-lg;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        transition: @transition-bounce;
        transform-origin: center;
      }

      .cell-name {
        font-size: @font-size-xs;
        font-weight: bold;
        color: @text-primary;
        text-align: center;
        line-height: 1.2;
        padding: 2px 4px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: @border-radius-sm;
        .text-truncate();
        max-width: 100%;
        cursor: help;
        transition: @transition-base;
        transform: translateZ(0);

        &:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateZ(0) translateY(-1px);
        }
      }
    }

    .cell-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 0 4px;

      .cell-price {
        .price-tag {
          padding: 2px 6px;
          font-size: @font-size-xs;
          font-weight: bold;
          transition: @transition-bounce;
          
          &:hover {
            transform: scale(1.1);
          }

          .money-icon {
            margin-right: 2px;
            animation: wiggle 2s infinite;
          }
        }
      }

      .cell-effect {
        .effect-text {
          font-size: @font-size-xs;
          color: @text-secondary;
          text-align: center;
          line-height: 1.2;
          padding: 2px 6px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: @border-radius-sm;
          cursor: help;
          max-width: 100%;
          transition: @transition-base;
          display: flex;
          align-items: center;
          gap: 4px;
          transform: translateZ(0);

          &.start-effect {
            white-space: normal; // 允许换行
            min-height: 32px; // 设置最小高度以容纳两行文字
            display: flex;
            flex-direction: column; // 图标和文字垂直排列
            justify-content: center;
            padding: 4px 6px;
            
            .effect-icon {
              margin-bottom: 2px; // 图标和文字之间的间距
            }
          }

          &:not(.start-effect) {
            .text-truncate(); // 其他格子保持单行显示
          }

          .effect-icon {
            font-size: 1.1em;
          }

          &:hover {
            background: rgba(0, 0, 0, 0.1);
            transform: translateZ(0) translateY(-1px);
          }
        }
      }

      .owner-mark {
        position: absolute;
        top: 4px;
        right: 4px;
        
        .owner-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
          border: 2px solid;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: @transition-bounce;
          animation: pulse 2s infinite;

          &:hover {
            transform: scale(1.2) rotate(10deg);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }

  .players-wrapper {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none; // 允许点击穿透到格子
    z-index: 2;

    .players {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 2px;
      padding: 4px;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.2),
        rgba(255, 255, 255, 0.6)
      );
      border-radius: @border-radius-lg;
      backdrop-filter: blur(4px);
      pointer-events: auto; // 恢复棋子的点击事件

      .player-token {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        border: 2px solid;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        animation: float 3s infinite;
        will-change: transform;
        position: relative;
        z-index: 1;

        &:hover {
          transform: scale(1.2) rotate(10deg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 10;
        }

        &:nth-child(2n) {
          animation-delay: -1.5s;
        }

        // 当前玩家的高亮效果
        &.current-player {
          transform: scale(1.2);
          z-index: 5;
          animation: currentPlayerFloat 2s infinite;
          box-shadow: 
            0 0 10px var(--glow-color),
            0 0 20px var(--glow-color),
            0 4px 12px rgba(0, 0, 0, 0.3);
          border-width: 3px;

          &::after {
            content: '';
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            background: radial-gradient(
              circle at center,
              var(--glow-color) 0%,
              transparent 70%
            );
            opacity: 0.3;
            animation: glowPulse 2s infinite;
          }

          &:hover {
            transform: scale(1.3) rotate(10deg);
          }
        }
      }
    }
  }

  // 格子类型样式
  &.start {
    .cell-type-indicator { background: @cell-start-gradient; }
    background: linear-gradient(135deg, fade(@cell-start-bg, 20%) 0%, rgba(255, 255, 255, 0.3) 100%);
  }
  &.property {
    .cell-type-indicator { background: var(--property-color); }
    
    &:hover {
      background: linear-gradient(135deg, var(--property-color)99 0%, rgba(255, 255, 255, 0.4) 100%);
    }
  }
  &.chance {
    .cell-type-indicator { background: @cell-chance-gradient; }
    background: linear-gradient(135deg, fade(@cell-chance-bg, 20%) 0%, rgba(255, 255, 255, 0.3) 100%);
  }
  &.birthday {
    .cell-type-indicator { background: @cell-birthday-gradient; }
    background: linear-gradient(135deg, fade(@cell-birthday-bg, 20%) 0%, rgba(255, 255, 255, 0.3) 100%);
  }
  &.tax {
    .cell-type-indicator { background: @cell-tax-gradient; }
    background: linear-gradient(135deg, fade(@cell-tax-bg, 20%) 0%, rgba(255, 255, 255, 0.3) 100%);
  }

  &.has-players {
    box-shadow: 
      inset 0 2px 4px rgba(255, 255, 255, 0.5),
      0 8px 16px rgba(0, 0, 0, 0.15);
    
    .cell-type-indicator {
      height: 6px;
    }
  }

  // 添加地产背景图片样式
  .property-bg {
    position: absolute;
    inset: 0;
    background-image: url('/property-bg.png');
    background-size: cover;
    background-position: center;
    opacity: 0.15; // 调整透明度使其不影响文字显示
    z-index: 0;
    transition: @transition-base;
  }

  &:hover .property-bg {
    opacity: 0.25; // 悬停时增加透明度
    transform: scale(1.1); // 添加缩放效果
  }

  .cell-content {
    position: relative;
    z-index: 1; // 确保内容在背景图片上方
    // ... 其他样式保持不变 ...
  }

  &.side-cell {
    @media (max-height: 1130px) {
      .cell-content {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 4px;
        gap: 4px;

        .cell-header {
          flex-direction: row;
          gap: 4px;
          flex-shrink: 0;
          width: auto;

          .cell-icon {
            font-size: @font-size-md;
            margin: 0;
          }

          .cell-name {
            font-size: @font-size-xs;
            max-width: 60px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .cell-info {
          flex-direction: row;
          gap: 4px;
          flex-shrink: 0;

          .cell-price {
            .price-tag {
              padding: 1px 4px;
              font-size: @font-size-xs;
            }
          }

          .cell-effect {
            .effect-text {
              padding: 1px 4px;
              font-size: @font-size-xs;
              white-space: nowrap;
            }
          }

          .owner-mark {
            position: static;
            
            .owner-avatar {
              width: 16px;
              height: 16px;
              border-width: 1px;
            }
          }
        }
      }

      .players-wrapper {
        .players {
          .player-token {
            width: 16px;
            height: 16px;
            border-width: 1px;
          }
        }
      }
    }

    @media (max-height: 600px) {
      .cell-content {
        .cell-header {
          .cell-icon {
            font-size: @font-size-sm;
          }

          .cell-name {
            max-width: 50px;
          }
        }

        .cell-info {
          .cell-price, .cell-effect {
            transform: scale(0.9);
            transform-origin: right center;
          }
        }
      }
    }
  }
}

@media (max-width: 1200px) {
  .cell {
    font-size: 0.8em;

    .players .player-token {
      width: 20px;
      height: 20px;
    }
  }
}

// 修改移动动画
@keyframes moveToken {
  0% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) translateY(-20px);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.player-token-moving {
  animation: moveToken 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

// 添加进入和离开动画
.player-token-enter-active,
.player-token-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.player-token-enter-from,
.player-token-leave-to {
  opacity: 0;
  transform: scale(0.5) translateY(-20px);
}

.player-token-enter-to,
.player-token-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

// 当前玩家的浮动动画
@keyframes currentPlayerFloat {
  0%, 100% {
    transform: scale(1.2) translateY(0) rotate(0deg);
  }
  50% {
    transform: scale(1.2) translateY(-8px) rotate(5deg);
  }
}

// 光晕脉冲动画
@keyframes glowPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}
</style>