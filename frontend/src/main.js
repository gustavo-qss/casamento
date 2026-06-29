import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { getPublicPath } from '@/utils/assets'

// Estilos globais
import '@/assets/styles/reset.css'
import '@/assets/styles/variables.css'
import '@/assets/styles/global.css'
import '@/assets/styles/animations.css'

// Texturas (public/textures) expostas como CSS vars com o BASE_URL correto,
// para uso em border-image / background nos componentes.
const root = document.documentElement;
root.style.setProperty('--tex-wood',     `url('${getPublicPath('textures/wood-dark.png')}')`);
root.style.setProperty('--tex-grain',    `url('${getPublicPath('textures/wood-grain.png')}')`);
root.style.setProperty('--tex-parchment',`url('${getPublicPath('textures/parchment.png')}')`);
root.style.setProperty('--tex-paper',    `url('${getPublicPath('textures/paper-fibers.png')}')`);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
