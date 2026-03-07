import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Estilos globais
import '@/assets/styles/reset.css'
import '@/assets/styles/variables.css'
import '@/assets/styles/global.css'
import '@/assets/styles/animations.css'

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
