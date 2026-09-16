import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages 项目站点：https://jabo2017.github.io/translate-project/
export default defineConfig({
  base: '/translate-project/',
  plugins: [vue()],
})
