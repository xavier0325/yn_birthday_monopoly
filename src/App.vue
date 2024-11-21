<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-notification-provider>
      <n-message-provider>
        <div class="app">
          <Background />
          <div class="game-container">
            <div class="game-header">
              <h1 class="title">
                <span class="emoji">🎉</span>
                <span class="title-text">芋泥生日快乐大富翁</span>
                <span class="emoji">🎂</span>
              </h1>
            </div>
            
            <div v-if="!store.isGameStarted" class="start-screen">
              <n-card class="welcome-card">
                <template #header>
                  <div class="welcome-header">
                    <div class="welcome-title">欢迎来玩芋泥的生日快乐大富翁！</div>
                    <div class="welcome-subtitle">一起来玩吧~</div>
                  </div>
                </template>
                <div class="welcome-content">
                  <div class="player-select">
                    <n-button
                      v-for="count in [2, 3, 4]"
                      :key="count"
                      type="primary"
                      size="large"
                      round
                      class="select-btn"
                      :style="{
                        background: 'linear-gradient(45deg, #FF69B4, #FFB6C1)',
                        border: 'none',
                        outline: 'none',
                        '--n-border-hover': 'none',
                        '--n-border-pressed': 'none',
                        '--n-border-focus': 'none',
                        '--n-border': 'none'
                      }"
                      @click="startGame(count)"
                    >
                      <div class="btn-content">
                        <div class="btn-icon">{{ ['👥', '👥👤', '👥👥'][count-2] }}</div>
                        <span class="btn-text">{{ count }}人</span>
                      </div>
                    </n-button>
                  </div>
                  <div class="settings-wrapper">
                    <n-button
                      class="settings-btn"
                      type="default"
                      size="large"
                      round
                      @click="showSettings = true"
                    >
                      <template #icon>
                        <div class="btn-icon">⚙️</div>
                      </template>
                      游戏设置
                    </n-button>
                  </div>
                </div>
              </n-card>
            </div>
            
            <template v-else>
              <div class="game-content">
                <div class="player-info">
                  <div class="player-grid" :style="{ gridTemplateColumns: `repeat(${store.players.length}, 1fr)` }">
                    <n-card
                      v-for="player in store.players"
                      :key="player.id"
                      :class="['player-card', { active: store.currentPlayer === player.id }]"
                      :bordered="false"
                      size="small"
                    >
                      <template #header>
                        <n-space align="center">
                          <div class="player-avatar-wrapper">
                            <div
                              class="player-avatar"
                              :style="{
                                backgroundImage: `url(/avatar${player.id + 1}.png)`,
                                borderColor: player.color,
                                boxShadow: `0 2px 8px ${player.color}80`
                              }"
                            />
                            <div class="avatar-decoration" v-if="store.currentPlayer === player.id">
                              <span class="crown">👑</span>
                            </div>
                          </div>
                          <div class="player-info-content">
                            <span class="player-name">{{ player.name }}</span>
                            <n-tag type="success" size="small" class="player-money">
                              <template #icon>
                                <span class="money-icon">💰</span>
                              </template>
                              {{ player.money.toLocaleString() }}
                            </n-tag>
                          </div>
                        </n-space>
                      </template>
                    </n-card>
                  </div>
                </div>
                
                <div class="game-board-container">
                  <GameBoard />
                </div>
              </div>
            </template>
          </div>
        </div>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
  
  <Dialog
    v-if="store.showDialog"
    :show="store.showDialog"
    :title="store.dialogContent?.title || ''"
    :message="store.dialogContent?.message || ''"
    :type="store.dialogContent?.type || 'info'"
    :action="store.dialogContent?.action"
    @close="store.closeDialog"
    @action="handleDialogAction"
  />
  
  <n-modal
    v-model:show="showSettings"
    preset="card"
    style="width: 90vw; max-width: 1000px;"
    title="游戏设置"
    :bordered="false"
    :segmented="true"
  >
    <GameSettings
      @save="handleSettingsSave"
      @cancel="showSettings = false"
    />
  </n-modal>
  
  <div class="sound-controls">
    <n-button
      circle
      size="large"
      @click="toggleBGM"
      :type="bgmEnabled ? 'primary' : 'default'"
      class="sound-btn"
    >
      {{ bgmEnabled ? '🎵' : '🔇' }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from './store';
import GameBoard from './components/GameBoard.vue';
import Background from './components/Background.vue';
import Dialog from './components/Dialog.vue';
import GameSettings from './components/GameSettings.vue';
import type { GameSettings as GameSettingsType } from './types';
import { soundManager } from './utils/sound';

const store = useGameStore();
const showSettings = ref(false);
const bgmEnabled = ref(true);

const themeOverrides = {
  common: {
    primaryColor: '#6366f1',
    primaryColorHover: '#818cf8',
    primaryColorPressed: '#4f46e5',
  }
};

const startGame = (playerCount: number) => {
  soundManager.play('click');
  store.initGame(playerCount, store.settings.initialMoney);
};

const handleDialogAction = () => {
  soundManager.play('click');
  store.dialogContent?.action?.();
  store.closeDialog();
};

const handleSettingsSave = (settings: GameSettingsType) => {
  soundManager.play('click');
  store.updateSettings(settings);
  showSettings.value = false;
};

const toggleBGM = () => {
  soundManager.play('click');
  bgmEnabled.value = soundManager.toggleBGM();
};
</script>

<style lang="less" scoped>
@import './styles/variables.less';

.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;

  .game-container {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: @spacing-md;
    min-height: 0;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(1px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: @border-radius-lg;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    margin: @spacing-md;
  }
}

.game-header {
  flex-shrink: 0;
  padding: @spacing-md 0;
  text-align: center;
}

.title {
  color: @text-primary;
  font-size: @font-size-2xl;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: @spacing-sm;

  .title-text {
    background: linear-gradient(45deg, #FF69B4, #FFB6C1);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: titleGlow 2s ease-in-out infinite;
    font-weight: bold;
  }

  .emoji {
    animation: bounce 2s infinite;
    display: inline-block;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    
    &:last-child {
      animation-delay: 0.5s;
    }
  }
}

@keyframes titleGlow {
  0%, 100% {
    filter: drop-shadow(0 0 8px rgba(255, 105, 180, 0.6));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(255, 182, 193, 0.8));
    transform: scale(1.02);
  }
}

.welcome-card {
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.3) !important;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .welcome-header {
    text-align: center;
    padding: @spacing-lg 0;

    .welcome-title {
      font-size: @font-size-xl;
      font-weight: bold;
      background: linear-gradient(45deg, #FF69B4, #FFB6C1);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: @spacing-sm;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      animation: titleGlow 2s ease-in-out infinite;
    }

    .welcome-subtitle {
      font-size: @font-size-md;
      background: linear-gradient(45deg, #FFB6C1, #FFC0CB);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      animation: subtitleGlow 2s ease-in-out infinite;
      animation-delay: 0.5s;
    }
  }

  .welcome-content {
    padding: @spacing-xl 0;
    display: flex;
    flex-direction: column;
    gap: @spacing-xl;

    .player-select {
      display: flex;
      justify-content: center;
      gap: @spacing-lg;

      .select-btn {
        min-width: 180px;
        height: 48px;
        font-size: @font-size-lg;
        transition: @transition-bounce;
        padding: 0 @spacing-lg;
        box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
        
        :deep(.n-button__border) {
          border: none !important;
          display: none !important;
        }

        :deep(.n-button__state-border) {
          border: none !important;
          display: none !important;
        }

        &:focus {
          outline: none !important;
          box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3) !important;
          border: none !important;
        }

        &:hover {
          border: none !important;
          outline: none !important;
        }

        &:active {
          border: none !important;
          outline: none !important;
        }

        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: @spacing-lg;
          width: 100%;
        }

        .btn-icon {
          font-size: @font-size-xl;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .btn-text {
          flex-shrink: 0;
          color: white;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
          background: linear-gradient(45deg, #FF1493, #FF69B4) !important;
        }

        &:active {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
          background: linear-gradient(45deg, #FF69B4, #FFB6C1) !important;
        }
      }
    }

    .settings-wrapper {
      display: flex;
      justify-content: center;
      margin-top: @spacing-md;

      .settings-btn {
        min-width: 160px;
        height: 48px;
        font-size: @font-size-lg;
        transition: @transition-bounce;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.3);
        
        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.3);
        }

        .btn-icon {
          font-size: @font-size-lg;
          margin-right: @spacing-xs;
          animation: rotate 3s linear infinite;
        }
      }
    }
  }
}

.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: @spacing-md;
  min-height: 0;

  .player-info {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 0 @spacing-md;

    .player-grid {
      display: grid;
      gap: @spacing-md;
      width: fit-content;
      max-width: 1200px;
    }
  }

  .game-board-container {
    flex: 1;
    min-height: 0;
  }
}

.player-card {
  transition: @transition-bounce !important;
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &.active {
    background: rgba(255, 255, 255, 0.3) !important;
    transform: translateY(-4px);
    box-shadow: @shadow-xl !important;
    border-color: @primary-color !important;
  }

  .player-avatar-wrapper {
    position: relative;

    .player-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      border: 3px solid;
      transition: @transition-bounce;
      transform: rotate(-5deg);
      box-shadow: @shadow-lg;
      
      &:hover {
        transform: rotate(5deg) scale(1.1);
      }
    }

    .avatar-decoration {
      position: absolute;
      top: -10px;
      right: -10px;
      
      .crown {
        font-size: @font-size-lg;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        animation: float 2s infinite;
      }
    }
  }

  .player-info-content {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .player-name {
      font-weight: bold;
      color: @text-primary;
    }

    .player-money {
      font-family: 'Monaco', monospace;
      
      .money-icon {
        animation: wiggle 2s infinite;
        display: inline-block;
      }
    }
  }
}

.start-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  padding: @spacing-xl;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes subtitleGlow {
  0%, 100% {
    filter: drop-shadow(0 0 6px rgba(255, 182, 193, 0.5));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(255, 192, 203, 0.7));
    transform: scale(1.02);
  }
}

@media (max-width: 768px) {
  .app .game-container {
    padding: @spacing-sm;
    margin: @spacing-sm;
  }

  .title {
    font-size: @font-size-xl;
  }

  .game-content {
    gap: @spacing-sm;
  }

  .welcome-card {
    width: 90%;
    
    .player-select {
      flex-direction: column;
      align-items: center;
    }
  }
}

.sound-controls {
  position: fixed;
  bottom: @spacing-lg;
  right: @spacing-lg;
  z-index: 1000;

  .sound-btn {
    width: 48px;
    height: 48px;
    font-size: @font-size-xl;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(8px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    transition: @transition-bounce;
    
    &:hover {
      transform: scale(1.1) rotate(10deg);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
  }
}

@media (max-width: 768px) and (orientation: landscape) {
  .app {
    .game-container {
      padding: @spacing-xs;
      margin: @spacing-xs;
      
      .game-header {
        padding: @spacing-xs 0;
        
        .title {
          font-size: @font-size-xl;
          
          .emoji {
            font-size: @font-size-lg;
          }
        }
      }
    }
  }

  .game-content {
    flex-direction: row;
    gap: @spacing-xs;

    .player-info {
      width: 200px;
      padding: 0;
      
      .player-grid {
        display: flex;
        flex-direction: column;
        gap: @spacing-xs;
        width: 100%;
      }

      .player-card {
        margin: 0;
        
        .player-avatar {
          width: 32px;
          height: 32px;
        }
      }
    }

    .game-board-container {
      flex: 1;
      min-width: 0;
      height: 100%;
    }
  }

  .welcome-card {
    max-width: 90%;
    margin: @spacing-xs;
    
    .welcome-header {
      padding: @spacing-sm 0;
      
      .welcome-title {
        font-size: @font-size-lg;
      }
      
      .welcome-subtitle {
        font-size: @font-size-md;
      }
    }

    .welcome-content {
      padding: @spacing-sm 0;
      gap: @spacing-sm;

      .player-select {
        flex-direction: row;
        flex-wrap: wrap;
        gap: @spacing-sm;
        
        .select-btn {
          min-width: 140px;
          height: 40px;
          font-size: @font-size-md;
          
          .btn-icon {
            font-size: @font-size-lg;
          }
        }
      }
    }
  }

  .sound-controls {
    bottom: @spacing-sm;
    right: @spacing-sm;
    
    .sound-btn {
      width: 40px;
      height: 40px;
      font-size: @font-size-lg;
    }
  }
}

// 针对超小屏幕的额外优化
@media (max-height: 450px) and (orientation: landscape) {
  .app .game-container {
    .game-header {
      .title {
        font-size: @font-size-lg;
        
        .emoji {
          font-size: @font-size-md;
        }
      }
    }
  }

  .game-content {
    .player-info {
      width: 180px;
      
      .player-card {
        padding: @spacing-xs;
        
        .player-avatar {
          width: 24px;
          height: 24px;
        }
        
        .player-name {
          font-size: @font-size-sm;
        }
        
        .player-money {
          font-size: @font-size-xs;
        }
      }
    }
  }

  .welcome-card {
    .welcome-content {
      .player-select {
        .select-btn {
          min-width: 120px;
          height: 36px;
          font-size: @font-size-sm;
        }
      }
    }
  }
}
</style>