import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      
      
      util: 'rollup-plugin-polyfill-node/polyfills/util',
    }
  },
  server: {
    host: true, // Añade esta línea para permitir acceso desde la red local
    port: 5173  // Opcional: puedes especificar un puerto específico
  }
})