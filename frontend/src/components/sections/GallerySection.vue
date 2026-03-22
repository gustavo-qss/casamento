<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
import { getPublicPath } from '@/utils/assets';

const section = ref(null);
useScrollReveal(section);

const photos = [
  {
    src: getPublicPath('storie1.jpeg'),
    caption: 'Nosso começo',
    rotation: '-2.2deg',
    story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  },
  {
    src: getPublicPath('transplante.jpeg'),
    caption: 'Para sempre',
    rotation: '-1deg',
    story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    src: getPublicPath('storie2.jpeg'),
    caption: 'Momentos juntos',
    rotation: '1.5deg',
    story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  {
    src: getPublicPath('stories3.jpeg'),
    caption: 'Para sempre',
    rotation: '-1deg',
    story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  }
];

const flipped = ref([false, false, false]);
const toggle = (i) => { flipped.value[i] = !flipped.value[i]; };
</script>

<template>
  <section class="gallery" id="gallery" ref="section">
    <header class="gallery-header reveal">
      <span class="gallery-eyebrow">nossa história</span>
      <div class="gallery-rule">
        <span></span><span class="rule-dot">✦</span><span></span>
      </div>
    </header>

    <div class="gallery-stack">
      <div
        v-for="(photo, i) in photos"
        :key="i"
        class="polaroid-wrapper reveal"
        :class="`reveal-delay-${i + 1}`"
      >
        <!-- flip-scene: segura rotação + perspective; separado do reveal -->
        <div
          class="flip-scene"
          :class="{ 'is-flipped': flipped[i] }"
          :style="{ '--rot': photo.rotation }"
          @click="toggle(i)"
          :aria-label="flipped[i] ? 'Ver foto' : 'Ler história'"
          role="button"
          tabindex="0"
          @keyup.enter="toggle(i)"
        >
          <div class="flip-card">

            <!-- Frente: foto -->
            <div class="flip-face flip-front">
              <div class="polaroid-pin"></div>
              <span class="flip-hint">toque para ver nossa história ✦</span>
              <div class="polaroid-photo">
                <img :src="photo.src" :alt="photo.caption" loading="lazy" />
              </div>
              <p class="polaroid-caption">{{ photo.caption }}</p>
            </div>

            <!-- Verso: texto da história -->
            <div class="flip-face flip-back">
              <div class="polaroid-pin"></div>
              <div class="back-content">
                <p class="back-chapter">{{ photo.caption }}</p>
                <div class="back-rule"></div>
                <p class="back-text">{{ photo.story }}</p>
              </div>
              <span class="flip-hint">toque para voltar ✦</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery {
  background: #f9f6f0;
  padding: clamp(3rem, 8vw, 5rem) var(--spacing-md);
  overflow: hidden;
}

/* Header */
.gallery-header {
  text-align: center;
  margin-bottom: clamp(2rem, 6vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.gallery-eyebrow {
  font-family: var(--font-body);
  font-size: clamp(0.62rem, 2vw, 0.78rem);
  font-weight: 400;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--lavender-dark);
}

.gallery-rule {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 90px;
}

.gallery-rule span:not(.rule-dot) {
  flex: 1;
  height: 1px;
  background: var(--lavender-dark);
  opacity: 0.3;
}

.rule-dot {
  font-size: 0.55rem;
  color: var(--lavender-dark);
  opacity: 0.5;
}

/* Stack — mobile: coluna */
.gallery-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(2rem, 6vw, 3.5rem);
  max-width: 500px;
  margin: 0 auto;
}

/* Wrapper de reveal — sem transform própria */
.polaroid-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* ============================================
   DESKTOP — 3 colunas lado a lado (≥ 768px)
   ============================================ */
@media (min-width: 768px) {
  .gallery {
    padding: clamp(4rem, 8vw, 7rem) clamp(2.5rem, 5vw, 6rem);
  }

  .gallery-stack {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    max-width: 1180px;
    gap: 2.5rem;
  }

  .polaroid-wrapper {
    flex: 1;
    max-width: 340px;
  }

  .flip-scene {
    width: 100%;
  }

  /* Deslocamento vertical — efeito "espalhado na mesa" */
  .polaroid-wrapper:nth-child(2) { margin-top: 3rem; }
  .polaroid-wrapper:nth-child(3) { margin-top: 1.2rem; }
}

/* ===== FLIP SCENE ===== */
/* Segura a rotação de polaroid + perspective para o 3D */
.flip-scene {
  --rot: 0deg;
  width: clamp(240px, 72vw, 380px);
  perspective: 1400px;
  cursor: pointer;
  transform: rotate(var(--rot));
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.flip-scene:hover:not(.is-flipped) {
  transform: rotate(0deg) scale(1.025);
}

/* ===== FLIP CARD ===== */
.flip-card {
  position: relative;
  width: 100%;
  transform-style: preserve-3d;
  transition: transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.is-flipped .flip-card {
  transform: rotateY(180deg);
}

/* ===== FACES ===== */
.flip-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  background: #ffffff;
  border-radius: 2px;
  box-shadow:
    0 2px 8px  rgba(0, 0, 0, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.13),
    0 1px 2px  rgba(0, 0, 0, 0.05);
  padding: 14px 14px 52px;
  position: relative;
  overflow: hidden;
}

.flip-front {
  /* face frontal: fluxo normal — define a altura total */
}

.flip-back {
  /* face traseira: absoluta sobre a frente, rotacionada 180° */
  position: absolute;
  inset: 0;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 20px 52px;
  /* Textura sutil de papel */
  background:
    radial-gradient(ellipse at 80% 20%, rgba(177, 185, 231, 0.08) 0%, transparent 55%),
    #ffffff;
}

/* Pino decorativo no topo */
.polaroid-pin {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: rgba(144, 152, 199, 0.35);
  border-radius: 999px;
}

/* ===== FRENTE ===== */
.polaroid-photo {
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #e8e4dc;
}

.polaroid-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.6s ease;
}

.flip-scene:hover:not(.is-flipped) .polaroid-photo img {
  transform: scale(1.04);
}

.polaroid-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-script);
  font-size: clamp(1rem, 3.5vw, 1.25rem);
  color: var(--navy-dark);
  opacity: 0.75;
  margin: 0;
}

/* ===== VERSO ===== */
.back-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.back-chapter {
  font-family: var(--font-script);
  font-size: clamp(1.4rem, 4.5vw, 1.8rem);
  color: var(--navy-dark);
  opacity: 0.85;
  text-align: center;
  margin: 0;
  line-height: 1.2;
}

.back-rule {
  width: 48px;
  height: 1px;
  background: var(--lavender-dark);
  opacity: 0.3;
  margin: 0 auto;
}

.back-text {
  font-family: var(--font-body);
  font-size: clamp(0.8rem, 2.2vw, 0.92rem);
  color: #555;
  line-height: 1.75;
  font-weight: 300;
  text-align: center;
  margin: 0;
}

/* ===== HINT ===== */
.flip-hint {
  display: block;
  text-align: center;
  font-family: var(--font-body);
  font-size: clamp(0.6rem, 1.8vw, 0.68rem);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--lavender-dark);
  opacity: 0.7;
  padding: 6px 0 8px;
  line-height: 1;
}

/* Hint do verso: dentro do back, posição absoluta na base */
.flip-back .flip-hint {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  padding: 0;
  opacity: 0.45;
}


</style>
