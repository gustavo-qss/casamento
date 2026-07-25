import { fileURLToPath, URL } from 'node:url'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// Gera um 404.html idêntico ao index.html no build.
// O GitHub Pages serve 404.html mantendo a URL original na barra de endereço,
// então o vue-router (history mode) consegue rotear /polaroids e /instagram
// mesmo em acesso direto / refresh.
function spaFallback404() {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      const index = resolve(dist, 'index.html')
      if (existsSync(index)) {
        copyFileSync(index, resolve(dist, '404.html'))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Servido no domínio próprio (apex) https://jessicaelucas.app.br na raiz.
  // Com domínio customizado o Pages serve na raiz, então base = '/'.
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
    spaFallback404(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
