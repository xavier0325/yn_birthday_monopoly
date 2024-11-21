<template>
  <div class="game-container">
    <div class="game-board">
      <div class="board-grid">
        <div class="board-row top">
          <Cell 
            v-for="i in 9" 
            :key="`top-${i-1}`"
            :cell="store.cells[i-1]"
            :players="getPlayersOnCell(i-1)"
          />
        </div>
        <div class="board-sides">
          <div class="board-column left">
            <Cell 
              v-for="i in 7" 
              :key="`left-${31-i+1}`"
              :cell="store.cells[31-i+1]"
              :players="getPlayersOnCell(31-i+1)"
            />
          </div>
          <div class="board-center">
            <div class="center-content">
              <div class="game-logo">
                <span class="logo-text">芋泥生日快乐❤</span>
                <span class="logo-emoji">🎂</span>
              </div>
              <Dice 
                @roll="handleDiceRoll" 
                :disabled="!store.isCurrentPlayersTurn || store.isMoving" 
              />
            </div>
          </div>
          <div class="board-column right">
            <Cell 
              v-for="i in 7" 
              :key="`right-${i+8}`"
              :cell="store.cells[i+8]"
              :players="getPlayersOnCell(i+8)"
            />
          </div>
        </div>
        <div class="board-row bottom">
          <Cell 
            v-for="i in 9" 
            :key="`bottom-${24-i+1}`"
            :cell="store.cells[24-i+1]"
            :players="getPlayersOnCell(24-i+1)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../store';
import Cell from './Cell.vue';
import Dice from './Dice.vue';
import type { Player } from '../types';

const store = useGameStore();

const getPlayersOnCell = (cellId: number): Player[] => {
  return store.players.filter((player: Player) => player.position === cellId);
};

const handleDiceRoll = (value: number) => {
  store.movePlayer(value);
};
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

.game-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: @spacing-md;
  background: @container-bg;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: @border-radius-lg;
  box-shadow: @shadow-lg;
  overflow: hidden;

  .game-board {
    position: relative;
    z-index: 1;
    width: min(100%, 1200px);
    aspect-ratio: 1.2;
    padding: @spacing-md;
    overflow: hidden;
  }
}

.board-grid {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: @spacing-xs;
  overflow: hidden;

  .board-row {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: @spacing-xs;
    height: calc((100% - 2 * @spacing-xs) / 5);
    min-height: 0;
  }

  .board-sides {
    flex: 1;
    display: flex;
    gap: @spacing-xs;
    min-height: 0;

    .board-column {
      width: calc((100% - 2 * @spacing-xs) / (var(--column-divider, 9)));
      display: grid;
      grid-template-rows: repeat(7, 1fr);
      gap: @spacing-xs;
    }

    .board-center {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: @border-radius-xl;
      margin: @spacing-lg;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: conic-gradient(
          from 0deg,
          transparent 0deg,
          rgba(255, 192, 203, 0.1) 90deg,
          transparent 180deg
        );
        animation: rotate 10s linear infinite;
      }

      .center-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: @spacing-lg;
        padding: @spacing-xl;

        .game-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: @spacing-sm;

          .logo-text {
            font-size: @font-size-2xl;
            font-weight: bold;
            background: linear-gradient(45deg, #FF69B4, #FFB6C1);
            -webkit-background-clip: text;
            color: transparent;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            animation: float 3s infinite;
          }

          .logo-emoji {
            font-size: @font-size-2xl;
            animation: bounce 2s infinite;
          }
        }
      }
    }
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 1200px) {
  .game-board {
    width: min(100%, 1000px);
  }

  .board-grid .board-sides .board-center {
    margin: @spacing-md;
  }
}

@media (max-width: 992px) {
  .game-board {
    width: min(100%, 800px);
  }

  .board-grid .board-sides .board-center {
    margin: @spacing-sm;
  }
}

@media (max-width: 768px) {
  .game-container {
    padding: @spacing-sm;
  }

  .game-board {
    width: 100%;
    aspect-ratio: auto;
  }

  .board-grid {
    gap: @spacing-xs;
  }

  .board-sides .board-center {
    margin: @spacing-xs;

    .center-content {
      padding: @spacing-sm;
      gap: @spacing-sm;

      .game-logo {
        .logo-text {
          font-size: @font-size-lg;
          text-align: center;
          word-break: break-word;
          line-height: 1.2;
          padding: 0 @spacing-sm;
        }

        .logo-emoji {
          font-size: @font-size-lg;
        }
      }
    }
  }
}

@media (max-width: 768px) and (orientation: landscape) {
  .board-sides .board-center {
    margin: @spacing-xs;

    .center-content {
      padding: @spacing-xs;
      gap: @spacing-xs;
      transform: scale(0.8);
      width: 100%;
      
      .game-logo {
        gap: @spacing-xs;
        
        .logo-text {
          font-size: @font-size-md;
          white-space: nowrap;
          transform: scale(0.9);
        }
        
        .logo-emoji {
          font-size: @font-size-md;
        }
      }

      :deep(.dice-container) {
        transform: scale(0.8);
        margin: -@spacing-sm 0;
      }
    }
  }
}

@media (max-height: 450px) and (orientation: landscape) {
  .board-sides .board-center {
    .center-content {
      transform: scale(0.7);
      
      .game-logo {
        .logo-text {
          font-size: @font-size-sm;
          transform: scale(0.8);
        }
        
        .logo-emoji {
          font-size: @font-size-sm;
        }
      }

      :deep(.dice-container) {
        transform: scale(0.7);
        margin: -@spacing-md 0;
      }
    }
  }
}

@media (max-height: 1130px) {
  .board-grid .board-sides .board-column {
    --column-divider: 6;
  }
}

@media (min-height: 1131px) {
  .board-grid .board-sides .board-column {
    --column-divider: 9;
  }
}
</style>