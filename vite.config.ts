import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    // 生成打包分析报告
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    // Gzip 压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // 兼容旧版浏览器
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 启用源码映射
    sourcemap: false,
    // 设置块大小警告限制
    chunkSizeWarningLimit: 1000,
    // 配置 rollup 选项
    rollupOptions: {
      output: {
        // 分包策略
        manualChunks: {
          'naive-ui': ['naive-ui'],
          'vue-vendor': ['vue', 'pinia'],
          'game-core': [
            '/src/store/index.ts',
            '/src/utils/animation.ts',
            '/src/utils/sound.ts',
          ],
        },
        // 自定义块文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境时移除 console
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['naive-ui', 'vue', 'pinia'],
  },
  // 服务器配置
  server: {
    host: true,
    port: 3000,
    // 启用 HMR
    hmr: true,
  },
  // 预览配置
  preview: {
    port: 5000,
    host: true,
    strictPort: true,
  },
})