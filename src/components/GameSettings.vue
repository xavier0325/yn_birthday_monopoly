<template>
  <div class="settings-container">
    <n-tabs type="line" animated class="settings-tabs">
      <!-- 基础设置 -->
      <n-tab-pane name="basic" tab="基础设置">
        <div class="settings-section">
          <div class="setting-item">
            <span class="setting-label">初始资金：</span>
            <n-input-number
              v-model:value="settings.initialMoney"
              :min="5000"
              :max="50000"
              :step="1000"
              size="large"
            >
              <template #prefix>$</template>
            </n-input-number>
          </div>
          <div class="setting-item">
            <span class="setting-label">经过起点奖励：</span>
            <n-input-number
              v-model:value="settings.startBonus"
              :min="1000"
              :max="10000"
              :step="500"
              size="large"
            >
              <template #prefix>$</template>
            </n-input-number>
          </div>
          <div class="player-names-settings">
            <div class="section-title">默认玩家名字</div>
            <div class="player-names-list">
              <div v-for="(name, index) in settings.playerNames" 
                   :key="index" 
                   class="player-name-item"
              >
                <div class="player-avatar"
                     :style="{ backgroundImage: `url(/avatar${index + 1}.png)` }"
                />
                <n-input
                  v-model:value="settings.playerNames[index]"
                  placeholder="输入玩家名字"
                  size="medium"
                >
                  <template #prefix>玩家{{ index + 1 }}</template>
                </n-input>
              </div>
            </div>
          </div>
        </div>
      </n-tab-pane>

      <!-- 格子设置 -->
      <n-tab-pane name="cells" tab="格子设置">
        <div class="settings-section">
          <div class="cell-types">
            <div v-for="type in cellTypes" :key="type.key" class="cell-type-item">
              <div class="cell-type-header">
                <n-icon size="24">
                  <component :is="type.icon" />
                </n-icon>
                <span class="cell-type-name">{{ type.name }}</span>
              </div>
              <div class="cell-type-settings">
                <n-input-number
                  v-model:value="settings.cellCounts[type.key]"
                  :min="type.min"
                  :max="type.max"
                  size="medium"
                  placeholder="数量"
                >
                  <template #prefix>数量</template>
                </n-input-number>
                <template v-if="type.key === 'property'">
                  <n-input-number
                    v-model:value="settings.propertyMinPrice"
                    :min="1000"
                    :max="settings.propertyMaxPrice"
                    :step="500"
                    size="medium"
                  >
                    <template #prefix>最低价</template>
                  </n-input-number>
                  <n-input-number
                    v-model:value="settings.propertyMaxPrice"
                    :min="settings.propertyMinPrice"
                    :max="50000"
                    :step="500"
                    size="medium"
                  >
                    <template #prefix>最高价</template>
                  </n-input-number>
                </template>
                <template v-if="type.key === 'tax'">
                  <n-input-number
                    v-model:value="settings.taxAmount"
                    :min="100"
                    :max="5000"
                    :step="100"
                    size="medium"
                  >
                    <template #prefix>税金</template>
                  </n-input-number>
                </template>
                <template v-if="type.key === 'birthday'">
                  <n-input-number
                    v-model:value="settings.birthdayBonus"
                    :min="500"
                    :max="5000"
                    :step="100"
                    size="medium"
                  >
                    <template #prefix>奖励</template>
                  </n-input-number>
                </template>
              </div>
            </div>
          </div>
        </div>
      </n-tab-pane>

      <!-- 机会卡设置 -->
      <n-tab-pane name="chance" tab="机会卡设置">
        <div class="settings-section">
          <div class="chance-cards-header">
            <div class="header-left">
              <n-button @click="addChanceCard" type="primary" class="add-card-btn">
                添加机会卡
              </n-button>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon size="20" class="help-icon">
                    <HelpCircleOutline />
                  </n-icon>
                </template>
                权重值决定抽中概率，权重越大概率越高。总权重为所有卡片权重之和，每张卡的概率为：该卡权重/总权重。
              </n-tooltip>
            </div>
            <div class="header-right">
              <n-tag type="info" round>
                共 {{ settings.chanceCards.length }} 张机会卡
              </n-tag>
              <n-tag type="success" round>
                一次性: {{ oneTimeCardsCount }} 张
              </n-tag>
              <n-tag type="warning" round>
                重复: {{ repeatableCardsCount }} 张
              </n-tag>
              <n-tag :type="totalProbability > 100 ? 'error' : 'info'" round>
                总概率: {{ totalProbability }}%
              </n-tag>
              <n-tag type="success" round>
                无事发生: {{ Math.max(0, 100 - totalProbability).toFixed(1) }}%
              </n-tag>
            </div>
          </div>
          <div class="chance-cards-container">
            <div class="chance-cards">
              <n-card
                v-for="(card, index) in settings.chanceCards"
                :key="index"
                size="small"
                class="chance-card"
              >
                <div class="chance-card-content">
                  <n-input
                    v-model:value="card.effect"
                    placeholder="效果描述"
                    size="small"
                  />
                  <n-input-number
                    v-model:value="card.amount"
                    placeholder="金额"
                    size="small"
                  >
                    <template #prefix>$</template>
                  </n-input-number>
                  <n-input-number
                    v-model:value="card.probability"
                    placeholder="概率"
                    :min="0"
                    :max="100"
                    :step="1"
                    size="small"
                    @update:value="(val) => handleProbabilityChange(card, val, card.probability)"
                  >
                    <template #prefix>概率</template>
                    <template #suffix>%</template>
                  </n-input-number>
                  <n-select
                    v-model:value="card.type"
                    :options="cardTypeOptions"
                    size="small"
                  />
                  <n-switch
                    v-model:value="card.oneTime"
                    size="small"
                    :rail-style="railStyle"
                  >
                    <template #checked>一次性</template>
                    <template #unchecked>重复</template>
                  </n-switch>
                  <div class="card-probability">
                    <n-tooltip trigger="hover">
                      <template #trigger>
                        <span>{{ getRealProbability(card) }}%</span>
                      </template>
                      实际概率 = 设置概率 × {{ card.oneTime && card.used ? '0' : '1' }}
                    </n-tooltip>
                  </div>
                  <n-button
                    circle
                    type="error"
                    size="small"
                    @click="removeChanceCard(index)"
                  >
                    ×
                  </n-button>
                </div>
              </n-card>
            </div>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>

    <div class="settings-actions">
      <n-button type="primary" size="large" @click="saveSettings">
        保存设置
      </n-button>
      <n-button size="large" @click="resetSettings">
        重置默认
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import {
  NTabs,
  NTabPane,
  NInputNumber,
  NButton,
  NCard,
  NInput,
  NSelect,
  NIcon,
  NTooltip,
  NSwitch,
} from 'naive-ui';
import { useGameStore } from '../store';
import {
  GameSettings,
  ChanceCard,
  DialogType,
} from '../types';
import {
  CashOutline,
  HomeOutline,
  GiftOutline,
  IceCreamOutline,
  WalletOutline,
  HelpCircleOutline,
} from '@vicons/ionicons5';
import { soundManager } from '../utils/sound';

const store = useGameStore();
const settings = reactive<GameSettings>({
  initialMoney: store.settings.initialMoney,
  startBonus: store.settings.startBonus,
  cellCounts: { ...store.settings.cellCounts },
  propertyMinPrice: store.settings.propertyMinPrice,
  propertyMaxPrice: store.settings.propertyMaxPrice,
  taxAmount: store.settings.taxAmount,
  birthdayBonus: store.settings.birthdayBonus,
  chanceCards: JSON.parse(JSON.stringify(store.settings.chanceCards)),
  playerNames: [...store.settings.playerNames],
});

// 初始化设置
onMounted(() => {
  // 从 store 中获取当前设置
  settings.initialMoney = store.settings.initialMoney;
  settings.startBonus = store.settings.startBonus;
  settings.cellCounts = { ...store.settings.cellCounts };
  settings.propertyMinPrice = store.settings.propertyMinPrice;
  settings.propertyMaxPrice = store.settings.propertyMaxPrice;
  settings.taxAmount = store.settings.taxAmount;
  settings.birthdayBonus = store.settings.birthdayBonus;
  settings.chanceCards = JSON.parse(JSON.stringify(store.settings.chanceCards));
  settings.playerNames = [...store.settings.playerNames];
});

const emit = defineEmits<{
  (e: 'save', settings: GameSettings): void;
  (e: 'cancel'): void;
}>();

const cellTypes = [
  { key: 'start', name: '起点', icon: CashOutline, min: 1, max: 1 },
  { key: 'property', name: '地产', icon: HomeOutline, min: 12, max: 24 },
  { key: 'chance', name: '机会', icon: GiftOutline, min: 4, max: 8 },
  { key: 'birthday', name: '生日', icon: IceCreamOutline, min: 2, max: 4 },
  { key: 'tax', name: '税收', icon: WalletOutline, min: 2, max: 4 },
];

const cardTypeOptions = [
  { label: '奖励', value: 'success' as DialogType },
  { label: '惩罚', value: 'warning' as DialogType },
];

const railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  const style: Record<string, string> = {};
  if (checked) {
    style.background = '#FF8FB1';
    if (focused) {
      style.boxShadow = '0 0 0 2px #FFC2D4';
    }
  } else {
    style.background = '#7C5CFF';
    if (focused) {
      style.boxShadow = '0 0 0 2px #9E85FF';
    }
  }
  return style;
};

const addChanceCard = () => {
  soundManager.play('click');
  const currentTotal = settings.chanceCards.reduce((sum, card) => sum + (card.probability || 0), 0);
  const remainingProbability = Math.max(0, 100 - currentTotal);
  
  // 如果剩余概率为0，则调整所有卡片的概率
  if (remainingProbability === 0) {
    const newProbability = Math.floor(100 / (settings.chanceCards.length + 1));
    settings.chanceCards.forEach(card => {
      card.probability = newProbability;
    });
    settings.chanceCards.push({
      effect: '',
      amount: 0,
      type: 'success',
      probability: newProbability,
      oneTime: false,
    });
  } else {
    // 添加新卡片，使用剩余概率的一半
    const newProbability = Math.floor(remainingProbability / 2);
    settings.chanceCards.push({
      effect: '',
      amount: 0,
      type: 'success',
      probability: newProbability,
      oneTime: false,
    });
  }
};

const removeChanceCard = (index: number) => {
  soundManager.play('click');
  const removedCard = settings.chanceCards[index];
  settings.chanceCards.splice(index, 1);
  
  if (settings.chanceCards.length > 0) {
    // 将被移除卡片的概率平均分配给其他卡片
    const probabilityToDistribute = removedCard.probability;
    const extraProbabilityPerCard = Math.floor(probabilityToDistribute / settings.chanceCards.length);
    const remainder = probabilityToDistribute % settings.chanceCards.length;
    
    settings.chanceCards.forEach((card, i) => {
      card.probability += extraProbabilityPerCard;
      if (i < remainder) {
        card.probability += 1;
      }
    });
  }
};

const handleProbabilityChange = (card: ChanceCard, newValue: number, oldValue: number) => {
  const diff = newValue - oldValue;
  const otherCards = settings.chanceCards.filter(c => c !== card);
  
  if (otherCards.length === 0) {
    card.probability = 100;
    return;
  }
  
  // 计算需要从其他卡片中减少的概率
  const decreasePerCard = Math.floor(Math.abs(diff) / otherCards.length);
  const remainder = Math.abs(diff) % otherCards.length;
  
  otherCards.forEach((otherCard, index) => {
    if (diff > 0) {
      // 增加概率时，从其他卡片中减少
      otherCard.probability = Math.max(0, otherCard.probability - decreasePerCard - (index < remainder ? 1 : 0));
    } else {
      // 减少概率时，分配给其他卡片
      otherCard.probability += decreasePerCard + (index < remainder ? 1 : 0);
    }
  });
};

const saveSettings = () => {
  soundManager.play('click');
  const total = settings.chanceCards.reduce((sum, card) => sum + (card.probability || 0), 0);
  if (total !== 100) {
    // 调整最后一张卡片的概率以确保总和为100%
    const lastCard = settings.chanceCards[settings.chanceCards.length - 1];
    if (lastCard) {
      lastCard.probability += (100 - total);
    }
  }
  emit('save', JSON.parse(JSON.stringify(settings)));
};

const resetSettings = () => {
  soundManager.play('click');
  // 重置为当前 store 中的设置
  Object.assign(settings, JSON.parse(JSON.stringify(store.settings)));
};

// 计算实际概率（考虑一次性卡片的使用状态）
const getRealProbability = (card: ChanceCard) => {
  if (card.oneTime && card.used) {
    return '0.0';
  }
  return card.probability.toFixed(1);
};

// 计算总概率
const totalProbability = computed(() => {
  return settings.chanceCards.reduce((sum, card) => {
    if (card.oneTime && card.used) return sum;
    return sum + (card.probability || 0);
  }, 0);
});

// 计算一次性卡片和可重复卡片的数量
const oneTimeCardsCount = computed(() => 
  settings.chanceCards.filter(card => card.oneTime).length
);

const repeatableCardsCount = computed(() => 
  settings.chanceCards.filter(card => !card.oneTime).length
);
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

.settings-container {
  padding: @spacing-lg;
  display: flex;
  flex-direction: column;
  gap: @spacing-lg;
  max-height: 70vh;
  overflow: hidden;
}

.settings-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.n-tab-pane) {
    flex: 1;
    overflow-y: auto;
    padding-right: @spacing-sm;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      margin: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(
        to bottom,
        fade(@primary-light, 60%),
        fade(@secondary-light, 60%)
      );
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: padding-box;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(
          to bottom,
          @primary-light,
          @secondary-light
        );
        border-width: 1px;
      }
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: @spacing-md;
  padding: @spacing-md;
  background: rgba(255, 255, 255, 0.1);
  border-radius: @border-radius-lg;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: @spacing-md;

  .setting-label {
    min-width: 120px;
    font-weight: bold;
    color: @text-primary;
  }
}

.cell-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: @spacing-md;

  .cell-type-item {
    padding: @spacing-md;
    background: rgba(255, 255, 255, 0.2);
    border-radius: @border-radius-md;
    display: flex;
    flex-direction: column;
    gap: @spacing-sm;

    .cell-type-header {
      display: flex;
      align-items: center;
      gap: @spacing-sm;
      color: @text-primary;
      font-weight: bold;
    }

    .cell-type-settings {
      display: flex;
      flex-direction: column;
      gap: @spacing-sm;
    }
  }
}

.chance-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  gap: @spacing-md;

  .chance-card {
    background: rgba(255, 255, 255, 0.2) !important;

    .chance-card-content {
      display: grid;
      grid-template-columns: 3fr 1fr 1fr 1fr 80px 60px 40px;
      gap: @spacing-sm;
      align-items: center;

      .n-input {
        width: 100%;
        min-width: 200px;
      }

      .n-input-number {
        width: 100%;
      }

      .n-select {
        width: 100%;
      }

      .card-probability {
        min-width: 60px;
        text-align: center;
        font-size: @font-size-sm;
        color: @text-secondary;
        padding: 4px 8px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: @border-radius-sm;
        white-space: nowrap;
        cursor: help;

        &:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      }

      :deep(.n-switch) {
        justify-self: center;
        min-width: 70px;
      }
    }
  }
}

.add-card-btn {
  align-self: flex-start;
}

.settings-actions {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  gap: @spacing-lg;
  padding: @spacing-md;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  margin: 0 -@spacing-lg;
  padding: @spacing-md @spacing-lg;
}

.chance-cards-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: @spacing-md;
  margin-bottom: @spacing-md;

  .header-left {
    display: flex;
    align-items: center;
    gap: @spacing-md;

    .help-icon {
      color: @text-secondary;
      cursor: help;
      transition: @transition-base;

      &:hover {
        color: @primary-color;
      }
    }
  }

  .header-right {
    display: flex;
    gap: @spacing-sm;
  }
}

.chance-cards-container {
  height: 400px; // 固定高度，显示约5张卡片
  overflow: hidden;
  position: relative;
  border-radius: @border-radius-lg;
  background: rgba(255, 255, 255, 0.05);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.1), transparent);
    pointer-events: none;
  }

  .chance-cards {
    height: 100%;
    overflow-y: auto;
    padding: @spacing-sm;
    padding-bottom: @spacing-xl;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      margin: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(
        to bottom,
        fade(@primary-light, 60%),
        fade(@secondary-light, 60%)
      );
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: padding-box;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(
          to bottom,
          @primary-light,
          @secondary-light
        );
        border-width: 1px;
      }
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }

    .chance-card {
      margin-bottom: @spacing-sm;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.player-names-settings {
  margin-top: @spacing-lg;
  padding-top: @spacing-lg;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  .section-title {
    font-size: @font-size-md;
    font-weight: bold;
    color: @text-primary;
    margin-bottom: @spacing-md;
  }

  .player-names-list {
    display: flex;
    flex-direction: column;
    gap: @spacing-md;

    .player-name-item {
      display: flex;
      align-items: center;
      gap: @spacing-md;

      .player-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: @shadow-md;
        flex-shrink: 0;
      }

      .n-input {
        flex: 1;
      }
    }
  }
}

@media (max-width: 768px) {
  .settings-container {
    padding: @spacing-md;
  }

  .cell-types {
    grid-template-columns: 1fr;
  }

  .chance-cards {
    grid-template-columns: 1fr;

    .chance-card-content {
      grid-template-columns: 1fr !important;
      gap: @spacing-sm;

      > * {
        width: 100% !important;
      }

      .n-input {
        min-width: 100%;
      }

      .card-probability {
        justify-self: center;
      }

      .n-button {
        justify-self: center;
      }
    }
  }

  .chance-cards-header {
    flex-direction: column;
    align-items: flex-start;
    
    .header-right {
      width: 100%;
      justify-content: space-between;
    }
  }

  .chance-cards-container {
    height: 350px; // 移动端稍微降低高度
  }
}
</style> 