import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import {
  // UI组件
  create,
  NButton,
  NCard,
  NSpace,
  NGrid,
  NGridItem,
  NAvatar,
  NBadge,
  NTag,
  NIcon,
  NTooltip,
  NModal,
  NResult,
  NNotificationProvider,
  NMessageProvider,
  NConfigProvider,
  // 图标
  NIconWrapper,
  // 动画
  NScrollbar,
  // 布局
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  NLayoutSider,
  // 其他
  NProgress,
  NSpin,
  NEmpty,
} from 'naive-ui'

// 创建naive-ui实例
const naive = create({
  components: [
    NButton,
    NCard,
    NSpace,
    NGrid,
    NGridItem,
    NAvatar,
    NBadge,
    NTag,
    NIcon,
    NTooltip,
    NModal,
    NResult,
    NNotificationProvider,
    NMessageProvider,
    NConfigProvider,
    NIconWrapper,
    NScrollbar,
    NLayout,
    NLayoutHeader,
    NLayoutContent,
    NLayoutFooter,
    NLayoutSider,
    NProgress,
    NSpin,
    NEmpty,
  ]
})

// 创建Vue应用
const app = createApp(App)

// 使用Pinia状态管理
const pinia = createPinia()
app.use(pinia)

// 使用naive-ui
app.use(naive)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err)
  console.error('错误信息:', info)
}

// 挂载应用
app.mount('#app')

// 移除加载提示
const loadingElement = document.querySelector('#loading')
if (loadingElement) {
  loadingElement.remove()
}