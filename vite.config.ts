import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Claude-Code-Weather-API/', 
  build: {
    outDir: 'docs', // 將打包結果輸出到 docs 資料夾
  },
})
