<template>
  <ChanceCardAnimation
    v-if="component === 'ChanceCardAnimation' && props?.cardData"
    :show="show"
    :cardData="props.cardData"
    @finish="handleAction"
  />
  
  <n-modal
    v-else
    :show="show"
    :mask-closable="true"
    :title="title"
    :type="type"
    :show-icon="true"
    @update:show="handleUpdateShow"
    class="cute-dialog"
    preset="card"
    style="width: 400px; max-width: 90vw;"
  >
    <template #header>
      <div class="dialog-header">
        <div class="dialog-icon">{{ getIcon(type) }}</div>
        <div class="dialog-title">{{ title }}</div>
      </div>
    </template>
    
    <div class="dialog-content">
      {{ message }}
    </div>
    
    <template #action v-if="action">
      <div class="dialog-actions">
        <n-button
          type="primary"
          round
          size="medium"
          class="action-btn"
          @click="handleAction"
        >
          确定
        </n-button>
        <n-button
          round
          size="medium"
          class="cancel-btn"
          @click="handleClose"
        >
          取消
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { NModal, NButton } from 'naive-ui';
import ChanceCardAnimation from './ChanceCardAnimation.vue';
import type { ChanceCard } from '../types';

interface Props {
  show: boolean;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  action?: () => void;
  component?: string;
  props?: {
    cardData: ChanceCard;
    [key: string]: any;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'action'): void;
  (e: 'update:show', value: boolean): void;
}>();

const getIcon = (type: string) => {
  const icons: Record<string, string> = {
    info: '💡',
    success: '🎉',
    warning: '⚠️',
    error: '❌'
  };
  return icons[type] || '💭';
};

const handleClose = () => {
  emit('close');
  emit('update:show', false);
};

const handleAction = () => {
  emit('action');
  emit('update:show', false);
};

const handleUpdateShow = (value: boolean) => {
  if (!value) {
    emit('close');
  }
  emit('update:show', value);
};
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

:deep(.n-modal) {
  .glass-effect();
  border-radius: @border-radius-lg !important;
  overflow: hidden;
  animation: pop-in 0.3s @transition-bounce;
  
  .n-card-header {
    padding: @spacing-md !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .n-card__content {
    padding: @spacing-md !important;
  }
  
  .n-card__footer {
    padding: @spacing-md !important;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: @spacing-sm;

  .dialog-icon {
    font-size: @font-size-lg;
    animation: bounce 2s infinite;
  }

  .dialog-title {
    font-size: @font-size-md;
    font-weight: bold;
    color: @text-primary;
  }
}

.dialog-content {
  font-size: @font-size-sm;
  color: @text-secondary;
  line-height: 1.6;
  padding: @spacing-sm 0;
  text-align: center;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: @spacing-md;

  .action-btn, .cancel-btn {
    min-width: 80px;
    transition: @transition-bounce;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: @shadow-md;
    }
  }

  .action-btn {
    background: @primary-color;
    
    &:hover {
      background: @primary-dark;
    }
  }

  .cancel-btn {
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
}

@keyframes pop-in {
  0% {
    transform: scale(0.9) translateY(10px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  :deep(.n-modal) {
    width: 320px !important;
    
    .n-card-header,
    .n-card__content,
    .n-card__footer {
      padding: @spacing-sm !important;
    }
  }

  .dialog-header {
    .dialog-icon {
      font-size: @font-size-md;
    }

    .dialog-title {
      font-size: @font-size-sm;
    }
  }

  .dialog-content {
    font-size: @font-size-xs;
  }

  .dialog-actions {
    gap: @spacing-sm;
    
    .action-btn, .cancel-btn {
      min-width: 60px;
      font-size: @font-size-xs;
    }
  }
}
</style> 