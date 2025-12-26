# Plano de Implementação - Site de Casamento Rawane & Gustavo

## 📋 Visão Geral

Site de casamento responsivo em Vue 3 com 6 telas em fullscreen, transições suaves e sistema de lista de presentes com pagamento via PIX.

**Data do Casamento:** 26/04/2026
**Cores Principais:** #b1b9e7 (lavanda claro) e #bfd5ed (azul claro)
**Foco:** Mobile-first, mas totalmente responsivo para desktop

---

## 🎨 Design System

### Paleta de Cores Expandida

```css
/* Cores principais */
--primary-lavender: #b1b9e7;
--primary-blue: #bfd5ed;

/* Complementares para casamento */
--soft-pink: #f4d9e6;        /* Rosa suave para destaques românticos */
--cream: #faf7f2;            /* Creme para fundos claros */
--gold: #d4af37;             /* Dourado para detalhes elegantes */
--sage: #b7c9b3;             /* Verde sálvia suave */
--lavender-dark: #9098c7;    /* Lavanda escuro para contraste */
--blue-dark: #8ca9c4;        /* Azul escuro para textos */
--white: #ffffff;            /* Branco puro */
--gray-light: #f5f5f5;       /* Cinza claro para backgrounds */

/* Gradientes */
--gradient-main: linear-gradient(135deg, #b1b9e7 0%, #bfd5ed 100%);
--gradient-soft: linear-gradient(180deg, #faf7f2 0%, #f4d9e6 100%);
--gradient-overlay: linear-gradient(180deg, rgba(177, 185, 231, 0.7) 0%, rgba(191, 213, 237, 0.7) 100%);
```

### Tipografia

**Fontes Recomendadas (Google Fonts):**
- **Títulos/Nomes:** "Playfair Display" (serif elegante)
- **Corpo/Texto:** "Montserrat" (sans-serif moderna e limpa)
- **Detalhes:** "Great Vibes" (script para toques românticos)

```css
/* Hierarquia de texto */
--font-display: 'Playfair Display', serif;
--font-body: 'Montserrat', sans-serif;
--font-script: 'Great Vibes', cursive;

/* Tamanhos */
--text-hero: clamp(2.5rem, 8vw, 5rem);
--text-title: clamp(2rem, 5vw, 3.5rem);
--text-subtitle: clamp(1.2rem, 3vw, 1.8rem);
--text-body: clamp(1rem, 2vw, 1.2rem);
--text-small: clamp(0.875rem, 1.5vw, 1rem);
```

---

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas

```
src/
├── assets/
│   ├── images/
│   │   ├── casal.jpg
│   │   ├── igreja.jpg
│   │   ├── restaurante.jpg
│   │   ├── countdown-bg.jpg
│   │   ├── presentes/
│   │   │   ├── presente-1.jpg
│   │   │   └── ...
│   │   └── stories/
│   │       ├── story-1.jpg
│   │       └── story-2.jpg
│   └── styles/
│       ├── variables.css      # Cores e variáveis
│       ├── reset.css          # Reset CSS
│       ├── global.css         # Estilos globais
│       └── animations.css     # Animações reutilizáveis
├── components/
│   ├── screens/
│   │   ├── HeroScreen.vue           # Tela 1
│   │   ├── StoriesScreen.vue        # Tela 2
│   │   ├── ChurchScreen.vue         # Tela 3
│   │   ├── ReceptionScreen.vue      # Tela 4
│   │   ├── CountdownScreen.vue      # Tela 5
│   │   └── GiftsScreen.vue          # Tela 6
│   ├── ui/
│   │   ├── StorySlide.vue           # Componente individual de story
│   │   ├── ProgressBar.vue          # Barra de progresso dos stories
│   │   ├── ScrollArrow.vue          # Seta para próxima tela
│   │   ├── GiftCard.vue             # Card de presente
│   │   ├── ShoppingCart.vue         # Carrinho flutuante
│   │   ├── QRCodeModal.vue          # Modal com QR Code PIX
│   │   └── LocationCard.vue         # Card de localização
│   └── layout/
│       └── FullscreenContainer.vue  # Container fullscreen reutilizável
├── composables/
│   ├── useScreenTransition.js       # Lógica de transição entre telas
│   ├── useStories.js                # Lógica dos stories
│   ├── useCountdown.js              # Lógica do countdown
│   └── useCart.js                   # Lógica do carrinho
├── stores/
│   ├── cart.js                      # Store Pinia do carrinho
│   └── navigation.js                # Store de navegação entre telas
├── data/
│   ├── stories.json                 # Dados dos stories
│   ├── gifts.json                   # Lista de presentes
│   └── wedding-info.json            # Informações do casamento
├── utils/
│   ├── pix.js                       # Geração de QR Code PIX
│   └── currency.js                  # Formatação de moeda
├── App.vue
└── main.js
```

### Dependências Necessárias

```json
{
  "dependencies": {
    "vue": "^3.5.25",
    "pinia": "^3.0.4",
    "qrcode.vue3": "^1.6.8",          // QR Code para PIX
    "dayjs": "^1.11.13"                // Manipulação de datas para countdown
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.2",
    "vite": "^7.2.4",
    "sass": "^1.80.0"                  // Preprocessador CSS
  }
}
```

**Nota:** Não vamos usar Vue Router já que é uma SPA com scroll/transições fullscreen controladas manualmente.

---

## 📱 Implementação das Telas

### Tela 1: Hero (Landing)

**Elementos:**
- Imagem de fundo do casal com blur e overlay gradiente
- Animação de bouncing suave (keyframes)
- Texto centralizado com hierarquia clara
- Botão "Ver Mais" com hover effect

**Estrutura:**
```vue
<template>
  <div class="hero-screen">
    <div class="background-image bouncing" :style="{ backgroundImage: `url(${casalImage})` }"></div>
    <div class="overlay"></div>
    <div class="content">
      <h1 class="title">Casamento<br>Rawane & Gustavo</h1>
      <p class="date">26 de Abril de 2026</p>
      <button class="cta-button" @click="scrollToNext">Ver Mais</button>
    </div>
    <ScrollArrow @click="scrollToNext" />
  </div>
</template>
```

**Animação Bouncing:**
```css
@keyframes bouncing {
  0%, 100% { transform: translateY(0) scale(1.05); }
  50% { transform: translateY(-10px) scale(1.08); }
}

.bouncing {
  animation: bouncing 6s ease-in-out infinite;
}
```

**Responsividade:**
- Mobile: Título em 2 linhas, imagem com background-position ajustado
- Desktop: Título em 1 linha, imagem centralizada

---

### Tela 2: Stories

**Elementos:**
- Container fullscreen com imagem de fundo (cada story)
- Barras de progresso no topo (1 por story)
- Texto sobreposto centralizado ou no terço inferior
- Auto-play de 7 segundos
- Pause ao clicar/segurar
- Skip ao soltar

**Estrutura:**
```vue
<template>
  <div class="stories-screen" @touchstart="pauseStory" @touchend="nextStory" @mousedown="pauseStory" @mouseup="nextStory">
    <div class="progress-bars">
      <ProgressBar v-for="(story, index) in stories" :key="index" :active="index === currentStory" :progress="getProgress(index)" />
    </div>
    <div class="story-content" :style="{ backgroundImage: `url(${currentStoryData.image})` }">
      <div class="overlay"></div>
      <div class="text-content">
        <p class="story-text">{{ currentStoryData.text }}</p>
      </div>
    </div>
  </div>
</template>
```

**Lógica (Composable):**
```javascript
// composables/useStories.js
export function useStories(storiesData, duration = 7000) {
  const currentStory = ref(0);
  const progress = ref(0);
  const isPaused = ref(false);
  let interval;

  const startTimer = () => {
    interval = setInterval(() => {
      if (!isPaused.value) {
        progress.value += 100 / (duration / 100);
        if (progress.value >= 100) {
          nextStory();
        }
      }
    }, 100);
  };

  const nextStory = () => {
    if (currentStory.value < storiesData.length - 1) {
      currentStory.value++;
      progress.value = 0;
    } else {
      // Ir para próxima tela
      emit('complete');
    }
  };

  return { currentStory, progress, isPaused, startTimer, nextStory };
}
```

**Arquivo de Dados:**
```json
// data/stories.json
[
  {
    "id": 1,
    "image": "/src/assets/images/stories/story-1.jpg",
    "text": "Nossa história começou em 2020, quando nos conhecemos em uma festa de amigos..."
  },
  {
    "id": 2,
    "image": "/src/assets/images/stories/story-2.jpg",
    "text": "Depois de 6 anos juntos, decidimos dar o próximo passo..."
  }
]
```

**Responsividade:**
- Mobile: Texto menor, padding ajustado
- Desktop: Texto maior, limitado a 60% da largura

---

### Tela 3: Igreja

**Elementos:**
- Imagem de fundo da igreja
- Card semi-transparente com informações
- Ícone de localização
- Botão "Como Chegar" (link Google Maps)
- ScrollArrow para próxima tela

**Estrutura:**
```vue
<template>
  <FullscreenContainer :background-image="churchImage">
    <LocationCard icon="church" title="Cerimônia" :location="churchData.location" :time="churchData.time" :address="churchData.address" :maps-link="churchData.mapsLink" />
    <ScrollArrow @click="scrollToNext" />
  </FullscreenContainer>
</template>
```

**Dados:**
```json
// data/wedding-info.json
{
  "church": {
    "location": "Igreja Nossa Senhora de Fátima",
    "time": "16h00",
    "address": "Rua das Flores, 123 - Centro",
    "mapsLink": "https://maps.google.com/?q=-23.550520,-46.633308"
  },
  "reception": {
    "location": "Espaço Jardim Encantado",
    "time": "18h00",
    "address": "Av. Principal, 456 - Jardim Europa",
    "mapsLink": "https://maps.google.com/?q=-23.560520,-46.643308"
  }
}
```

---

### Tela 4: Recepção

**Elementos:**
- Idêntico à Tela 3, mas com dados da recepção
- Imagem de fundo do restaurante/espaço de festa

**Implementação:**
- Reutilizar componente `LocationCard`
- Apenas trocar props e imagem de fundo

---

### Tela 5: Countdown

**Elementos:**
- Imagem de fundo romântica
- Contador regressivo em tempo real
- Formato: "X dias, Y horas, Z minutos, W segundos"
- Animação suave nos números

**Estrutura:**
```vue
<template>
  <FullscreenContainer :background-image="countdownImage">
    <div class="countdown-container">
      <h2 class="countdown-title">Faltam</h2>
      <div class="countdown-grid">
        <div class="countdown-item">
          <span class="countdown-number">{{ days }}</span>
          <span class="countdown-label">Dias</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">{{ hours }}</span>
          <span class="countdown-label">Horas</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">{{ minutes }}</span>
          <span class="countdown-label">Minutos</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">{{ seconds }}</span>
          <span class="countdown-label">Segundos</span>
        </div>
      </div>
    </div>
    <ScrollArrow @click="scrollToNext" />
  </FullscreenContainer>
</template>
```

**Lógica:**
```javascript
// composables/useCountdown.js
import dayjs from 'dayjs';

export function useCountdown(targetDate) {
  const days = ref(0);
  const hours = ref(0);
  const minutes = ref(0);
  const seconds = ref(0);

  const updateCountdown = () => {
    const now = dayjs();
    const target = dayjs(targetDate);
    const diff = target.diff(now);

    if (diff > 0) {
      days.value = Math.floor(diff / (1000 * 60 * 60 * 24));
      hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      seconds.value = Math.floor((diff % (1000 * 60)) / 1000);
    }
  };

  onMounted(() => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  });

  return { days, hours, minutes, seconds };
}
```

---

### Tela 6: Lista de Presentes

**Elementos:**
- Grid responsivo de presentes
- Cada presente: imagem, nome, preço, botão +/-
- Carrinho flutuante (fixo no bottom)
- Modal com QR Code PIX ao finalizar

**Estrutura:**
```vue
<template>
  <div class="gifts-screen">
    <div class="gifts-header">
      <h2>Lista de Presentes</h2>
      <p>Escolha um presente para nos dar de casamento</p>
    </div>

    <div class="gifts-grid">
      <GiftCard v-for="gift in gifts" :key="gift.id" :gift="gift" @add="addToCart" @remove="removeFromCart" :quantity="getQuantityInCart(gift.id)" />
    </div>

    <ShoppingCart v-if="cartItemCount > 0" :items="cartItems" :total="cartTotal" @checkout="openCheckout" />

    <QRCodeModal v-if="showQRCode" :pix-code="pixCode" :amount="cartTotal" @close="closeCheckout" />
  </div>
</template>
```

**Store do Carrinho:**
```javascript
// stores/cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [], // { giftId, name, price, quantity }
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    total: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
  },

  actions: {
    addItem(gift) {
      const existingItem = this.items.find(item => item.giftId === gift.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({
          giftId: gift.id,
          name: gift.name,
          price: gift.price,
          quantity: 1,
        });
      }
    },

    removeItem(giftId) {
      const existingItem = this.items.find(item => item.giftId === giftId);
      if (existingItem) {
        existingItem.quantity--;
        if (existingItem.quantity === 0) {
          this.items = this.items.filter(item => item.giftId !== giftId);
        }
      }
    },

    clearCart() {
      this.items = [];
    },
  },
});
```

**Lista de Presentes:**
```json
// data/gifts.json
[
  {
    "id": 1,
    "name": "Jogo de Panelas",
    "price": 350.00,
    "image": "/src/assets/images/presentes/panelas.jpg"
  },
  {
    "id": 2,
    "name": "Liquidificador",
    "price": 180.00,
    "image": "/src/assets/images/presentes/liquidificador.jpg"
  },
  {
    "id": 3,
    "name": "Jogo de Toalhas",
    "price": 120.00,
    "image": "/src/assets/images/presentes/toalhas.jpg"
  }
]
```

**QR Code PIX:**
```javascript
// utils/pix.js
export function generatePixPayload(pixKey, amount, recipientName = 'Rawane e Gustavo') {
  // Implementação do PIX Copia e Cola (EMV)
  // Formato: chave PIX + valor + nome

  const name = recipientName.substring(0, 25).toUpperCase();
  const amountStr = amount.toFixed(2);

  // Estrutura simplificada do payload PIX
  // ID 00: Payload Format Indicator
  // ID 01: Point of Initiation Method
  // ID 26: Merchant Account Information
  // ID 52: Merchant Category Code
  // ID 53: Transaction Currency (986 = BRL)
  // ID 54: Transaction Amount
  // ID 59: Merchant Name
  // ID 60: Merchant City
  // ID 62: Additional Data Field Template

  let payload = '';
  payload += '00020126'; // Payload Format + Point of Initiation

  // Merchant Account (chave PIX)
  const pixKeyField = `0014BR.GOV.BCB.PIX01${pixKey.length.toString().padStart(2, '0')}${pixKey}`;
  payload += `26${pixKeyField.length.toString().padStart(2, '0')}${pixKeyField}`;

  payload += '52040000'; // Merchant Category Code
  payload += '5303986'; // Currency (BRL)
  payload += `54${amountStr.length.toString().padStart(2, '0')}${amountStr}`; // Amount
  payload += `59${name.length.toString().padStart(2, '0')}${name}`; // Name
  payload += '6009SAO PAULO'; // City

  // CRC16 calculation (simplified - use a library in production)
  const crc16 = calculateCRC16(payload + '6304');
  payload += '6304' + crc16;

  return payload;
}

function calculateCRC16(str) {
  // Implementação simplificada - usar biblioteca crc em produção
  // Para MVP, pode retornar um valor fixo ou usar biblioteca
  return '0000'; // Placeholder
}
```

**Nota:** Para produção, recomendo usar a biblioteca `pix-utils` ou similar para gerar o payload PIX corretamente.

---

## 🎭 Sistema de Navegação entre Telas

### Abordagem: Scroll Snap + Transições CSS

**Implementação:**
```vue
<!-- App.vue -->
<template>
  <div class="app-container" ref="containerRef">
    <HeroScreen ref="screen1" />
    <StoriesScreen ref="screen2" @complete="scrollToScreen(3)" />
    <ChurchScreen ref="screen3" />
    <ReceptionScreen ref="screen4" />
    <CountdownScreen ref="screen5" />
    <GiftsScreen ref="screen6" />
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.app-container > * {
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
</style>
```

**Composable de Navegação:**
```javascript
// composables/useScreenTransition.js
export function useScreenTransition() {
  const scrollToScreen = (screenNumber) => {
    const screenHeight = window.innerHeight;
    const targetScroll = (screenNumber - 1) * screenHeight;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  const scrollToNext = () => {
    const currentScroll = window.scrollY;
    const screenHeight = window.innerHeight;
    const currentScreen = Math.round(currentScroll / screenHeight);
    scrollToScreen(currentScreen + 2); // +2 porque é 1-indexed e queremos próxima
  };

  return { scrollToScreen, scrollToNext };
}
```

**Transições Personalizadas:**
```css
/* animations.css */
@keyframes slideUpIn {
  from {
    transform: translateY(100vh);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.screen-enter-active {
  animation: slideUpIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

---

## 📱 Estratégia de Responsividade

### Breakpoints

```css
/* Mobile first */
/* xs: 0-575px (padrão) */
/* sm: 576px-767px */
@media (min-width: 576px) { }

/* md: 768px-991px */
@media (min-width: 768px) { }

/* lg: 992px-1199px */
@media (min-width: 992px) { }

/* xl: 1200px+ */
@media (min-width: 1200px) { }
```

### Ajustes por Tela

**Tela 1 (Hero):**
- Mobile: Texto centralizado, padding 20px, botão full-width
- Desktop: Texto maior, botão fixo width, mais espaçamento

**Tela 2 (Stories):**
- Mobile: Barras de progresso mais finas, texto menor
- Desktop: Limitar largura do texto a 60%, aumentar font-size

**Telas 3-4 (Localizações):**
- Mobile: Card full-width com padding reduzido
- Desktop: Card centralizado com max-width 600px

**Tela 5 (Countdown):**
- Mobile: Grid 2x2 (2 dias/horas, 2 minutos/segundos)
- Desktop: Grid 1x4 (horizontal)

**Tela 6 (Presentes):**
- Mobile: Grid 1 coluna
- Tablet: Grid 2 colunas
- Desktop: Grid 3-4 colunas

### Utilitários Responsivos

```css
.container-mobile {
  padding: 1rem;
}

@media (min-width: 768px) {
  .container-mobile {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## 🚀 Fases de Implementação

### Fase 1: Setup e Fundação (Prioridade Máxima)
**Estimativa:** Base do projeto

1. **Instalar dependências**
   - `npm install qrcode.vue3 dayjs sass`

2. **Configurar estilos globais**
   - Criar `assets/styles/variables.css` com paleta de cores
   - Criar `assets/styles/reset.css` com reset CSS
   - Criar `assets/styles/global.css` com estilos base
   - Criar `assets/styles/animations.css` com animações
   - Importar fontes do Google Fonts no `index.html`

3. **Estruturar pastas**
   - Criar estrutura de pastas conforme arquitetura
   - Criar arquivos JSON de dados (stories, gifts, wedding-info)

4. **Componentes base**
   - `FullscreenContainer.vue` (container reutilizável)
   - `ScrollArrow.vue` (seta animada para scroll)

---

### Fase 2: Telas Principais (Prioridade Alta)
**Ordem de implementação:**

1. **Tela 1: Hero**
   - Criar `HeroScreen.vue`
   - Implementar background com animação bouncing
   - Adicionar overlay gradiente
   - Estilizar texto e botão
   - Testar responsividade

2. **Tela 3 e 4: Localizações**
   - Criar `LocationCard.vue` (componente reutilizável)
   - Criar `ChurchScreen.vue` e `ReceptionScreen.vue`
   - Implementar integração com Google Maps
   - Testar em mobile e desktop

3. **Tela 5: Countdown**
   - Criar composable `useCountdown.js`
   - Criar `CountdownScreen.vue`
   - Implementar lógica de countdown com dayjs
   - Adicionar animações nos números
   - Testar precisão do contador

---

### Fase 3: Stories (Prioridade Alta)
**Complexidade média:**

1. **Componentes**
   - Criar `ProgressBar.vue`
   - Criar `StorySlide.vue`
   - Criar `StoriesScreen.vue`

2. **Lógica**
   - Criar composable `useStories.js`
   - Implementar timer de 7 segundos
   - Implementar pause/play ao tocar
   - Implementar navegação entre stories
   - Integrar com arquivo `stories.json`

3. **Testes**
   - Testar no mobile (touch events)
   - Testar no desktop (mouse events)
   - Testar transição para próxima tela

---

### Fase 4: Lista de Presentes e Carrinho (Prioridade Alta)
**Complexidade alta:**

1. **Store e lógica**
   - Criar store Pinia `cart.js`
   - Criar composable `useCart.js`

2. **Componentes**
   - Criar `GiftCard.vue`
   - Criar `ShoppingCart.vue` (carrinho flutuante)
   - Criar `GiftsScreen.vue`

3. **Layout**
   - Implementar grid responsivo
   - Adicionar botões +/- com feedback visual
   - Implementar carrinho flutuante com contador

4. **Testes**
   - Testar adicionar/remover itens
   - Testar cálculo do total
   - Testar persistência no store

---

### Fase 5: Sistema PIX (Prioridade Alta)
**Complexidade média:**

1. **Utilitário PIX**
   - Criar `utils/pix.js` com função de geração de payload
   - Implementar corretamente o formato EMV do PIX
   - Adicionar chave PIX: 12401090916

2. **Componente QR Code**
   - Criar `QRCodeModal.vue`
   - Integrar com `qrcode.vue3`
   - Exibir valor total e instruções
   - Adicionar botão de copiar código PIX

3. **Integração**
   - Conectar carrinho com modal
   - Adicionar botão "Finalizar" no carrinho
   - Testar geração de QR Code com valores reais
   - Adicionar botão de "Limpar carrinho" após checkout

---

### Fase 6: Navegação e Transições (Prioridade Média)
**Polimento:**

1. **Sistema de navegação**
   - Implementar scroll snap no `App.vue`
   - Criar composable `useScreenTransition.js`
   - Conectar ScrollArrow com navegação

2. **Transições**
   - Adicionar transições suaves entre telas
   - Implementar animação "debaixo pra cima"
   - Testar em diferentes dispositivos

3. **UX**
   - Adicionar loading states
   - Adicionar feedback visual em botões
   - Testar scroll behavior

---

### Fase 7: Polimento e Otimização (Prioridade Baixa)
**Refinamento:**

1. **Performance**
   - Otimizar imagens (WebP, lazy loading)
   - Implementar code splitting se necessário
   - Testar performance no Lighthouse

2. **Acessibilidade**
   - Adicionar alt text nas imagens
   - Garantir contraste adequado
   - Testar navegação por teclado

3. **Testes finais**
   - Testar em diferentes navegadores
   - Testar em diferentes tamanhos de tela
   - Corrigir bugs encontrados

4. **Deploy**
   - Configurar para produção
   - Deploy em plataforma (Vercel, Netlify, etc.)

---

## 🎯 Detalhes de UX Importantes

### 1. **Loading e Estados**
- Adicionar skeleton loaders para imagens
- Mostrar feedback visual ao adicionar item no carrinho (animação)
- Desabilitar botões durante processamento

### 2. **Feedback Visual**
- Hover states em todos botões
- Active states em elementos clicáveis
- Smooth transitions (0.3s ease)
- Ripple effect em botões principais

### 3. **Micro-interações**
- Coração pulsando ao adicionar presente
- Confetti ao finalizar compra (opcional, biblioteca `canvas-confetti`)
- Bounce nas setas de navegação
- Fade in gradual dos elementos ao scrollar

### 4. **Mensagens e Textos**
- Mensagens de erro amigáveis
- Confirmação ao limpar carrinho
- Instrução clara de como pagar com PIX
- Textos curtos e diretos

### 5. **Mobile UX**
- Touch target mínimo de 44px
- Evitar hover-only interactions
- Gestos nativos (swipe, tap, hold)
- Bottom navigation para carrinho (thumb zone)

---

## 🔧 Configurações Importantes

### Vite Config

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.css";`
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'pinia'],
          'utils': ['dayjs', 'qrcode.vue3']
        }
      }
    }
  }
});
```

### Main.js

```javascript
// main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// Estilos globais
import '@/assets/styles/reset.css';
import '@/assets/styles/variables.css';
import '@/assets/styles/global.css';
import '@/assets/styles/animations.css';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
```

### Index.html (Fontes)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Casamento Rawane & Gustavo | 26/04/2026</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500;600&family=Great+Vibes&display=swap" rel="stylesheet">

  <!-- Meta tags -->
  <meta name="description" content="Venha celebrar conosco o casamento de Rawane e Gustavo em 26 de abril de 2026!">
  <meta name="theme-color" content="#b1b9e7">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

---

## 📋 Checklist de Implementação

### Setup
- [ ] Instalar dependências (`qrcode.vue3`, `dayjs`, `sass`)
- [ ] Configurar estilos globais (variables, reset, global, animations)
- [ ] Adicionar fontes Google Fonts
- [ ] Criar estrutura de pastas
- [ ] Criar arquivos JSON de dados

### Componentes Base
- [ ] FullscreenContainer.vue
- [ ] ScrollArrow.vue
- [ ] LocationCard.vue

### Telas
- [ ] HeroScreen.vue (Tela 1)
- [ ] StoriesScreen.vue (Tela 2)
  - [ ] ProgressBar.vue
  - [ ] StorySlide.vue
  - [ ] useStories.js composable
- [ ] ChurchScreen.vue (Tela 3)
- [ ] ReceptionScreen.vue (Tela 4)
- [ ] CountdownScreen.vue (Tela 5)
  - [ ] useCountdown.js composable
- [ ] GiftsScreen.vue (Tela 6)
  - [ ] GiftCard.vue
  - [ ] ShoppingCart.vue
  - [ ] QRCodeModal.vue
  - [ ] cart.js store
  - [ ] useCart.js composable

### Utilitários
- [ ] pix.js (geração de payload PIX)
- [ ] currency.js (formatação de moeda)

### Navegação
- [ ] Implementar scroll snap no App.vue
- [ ] useScreenTransition.js composable
- [ ] Conectar ScrollArrows com navegação

### Polimento
- [ ] Otimizar imagens
- [ ] Testar responsividade em todos breakpoints
- [ ] Adicionar loading states
- [ ] Testar acessibilidade
- [ ] Testes em diferentes navegadores
- [ ] Build de produção

---

## 🤔 Questões Pendentes / Decisões

1. **Imagens:**
   - Você já tem as imagens do casal, igreja e restaurante?
   - Qual formato preferir? (JPG, PNG, WebP)
   - Precisa de ajuda com otimização?

2. **Stories:**
   - Quantos stories você quer inicialmente? (o plano está preparado para ser dinâmico)
   - Você vai escrever os textos ou quer sugestões?

3. **Lista de Presentes:**
   - Quantos presentes aproximadamente?
   - Você tem as imagens dos presentes ou quer usar placeholders?
   - Os preços são estimados ou você já definiu?

4. **PIX:**
   - A chave 12401090916 é CPF/CNPJ, telefone ou chave aleatória?
   - Quer que o nome apareça no QR Code como "Rawane e Gustavo" ou outro nome?

5. **Deploy:**
   - Você tem preferência de plataforma? (Vercel, Netlify, GitHub Pages)
   - Precisa de domínio customizado?

6. **Extras:**
   - Quer adicionar efeito confetti ao finalizar compra?
   - Quer música de fundo (opcional, com botão mute)?
   - Quer formulário de confirmação de presença?

---

## 🎨 Melhorias Sugeridas (Opcionais)

1. **Animação de Entrada:**
   - Fade in gradual dos elementos conforme scroll
   - Parallax suave nos backgrounds

2. **Easter Eggs:**
   - Ao clicar 10x no título, mostrar mensagem especial
   - Animação especial quando countdown chegar a 0

3. **Social Sharing:**
   - Botões para compartilhar no WhatsApp/Instagram
   - Meta tags Open Graph para preview bonito

4. **Analytics:**
   - Google Analytics para ver quantas pessoas acessaram
   - Tracking de quais presentes são mais populares

5. **Confirmação de Presença:**
   - Formulário simples na última tela
   - Envio para Google Sheets ou email

6. **PWA:**
   - Transformar em Progressive Web App
   - Permitir instalação no celular
   - Funcionar offline (exceto PIX)

---

## 📚 Recursos e Referências

- **Vue 3 Docs:** https://vuejs.org/
- **Pinia Docs:** https://pinia.vuejs.org/
- **Vite Docs:** https://vitejs.dev/
- **QR Code Library:** https://github.com/scholtz/qrcode.vue3
- **Day.js Docs:** https://day.js.org/
- **PIX Specification:** https://www.bcb.gov.br/estabilidadefinanceira/pix
- **Google Fonts:** https://fonts.google.com/

---

## 🎯 Próximos Passos

1. **Revisar este plano** e aprovar ou sugerir mudanças
2. **Responder questões pendentes** para eu poder personalizar melhor
3. **Fornecer assets** (imagens, textos dos stories, lista de presentes)
4. **Começar implementação** seguindo as fases propostas

---

**Observações Finais:**

Este plano foi desenhado para ser modular e escalável. Cada componente é independente e pode ser desenvolvido/testado separadamente. A abordagem mobile-first garante que a experiência seja perfeita em smartphones (o principal dispositivo dos convidados).

O sistema de carrinho + PIX é robusto e pronto para produção. A geração do QR Code PIX segue o padrão oficial do Banco Central.

As animações e transições foram pensadas para serem suaves e elegantes, sem exageros, mantendo o tema romântico e sofisticado do casamento.

Estou pronto para começar a implementação assim que você aprovar! 🚀
