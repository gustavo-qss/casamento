<template>
  <div class="closing-screen">
    <BackButton @click="handleBack" />

    <div class="closing-photo">
      <img :src="closingImg" alt="Rawane e Gustavo" />
      <div class="closing-overlay"></div>
    </div>

    <div class="closing-content">
      <p class="closing-text fade-in-up" style="animation-delay: 0.1s">
        Estamos muito felizes em compartilhar esse momento
        com pessoas tão especiais em nossas vidas.
      </p>

      <div class="closing-divider fade-in-up" style="animation-delay: 0.2s">
        <span></span><span class="closing-dot">✦</span><span></span>
      </div>

      <p class="closing-text fade-in-up" style="animation-delay: 0.3s">
        Esperamos você para celebrar esse dia inesquecível conosco.
      </p>

      <p class="closing-love fade-in-up" style="animation-delay: 0.4s">Com amor,</p>
      <img :src="logoImg" alt="Rawane e Gustavo" class="closing-logo fade-in-up" style="animation-delay: 0.5s" />
      <p class="closing-date fade-in-up" style="animation-delay: 0.6s">16 &bull; 05 &bull; 2026</p>
    </div>
  </div>
</template>

<script setup>
import BackButton from '../ui/BackButton.vue';
import { getPublicPath } from '@/utils/assets';

const emit = defineEmits(['back']);
const handleBack = () => emit('back');

const closingImg = getPublicPath('homepage1.jpeg');
const logoImg    = getPublicPath('logo_luquinha.png');
</script>

<style scoped>
.closing-screen {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.closing-photo { position: absolute; inset: 0; }

.closing-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.closing-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(42, 24, 18, 0.2) 0%,
    rgba(42, 24, 18, 0.55) 48%,
    rgba(42, 24, 18, 0.9) 100%
  );
}

.closing-content {
  position: relative;
  z-index: 2;
  margin-top: auto;
  text-align: center;
  padding: clamp(2rem, 8vw, 4rem) var(--spacing-md) clamp(3rem, 10vw, 6rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.closing-text {
  font-family: var(--font-display);
  font-size: clamp(1rem, 3.2vw, 1.25rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.75;
  max-width: 380px;
  margin: 0;
  font-weight: 400;
}

.closing-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100px;
}

.closing-divider span:not(.closing-dot) {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.28);
}

.closing-dot { font-size: 0.6rem; color: rgba(255, 255, 255, 0.45); }

.closing-love {
  font-family: var(--font-body);
  font-size: clamp(0.72rem, 2vw, 0.88rem);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-weight: 300;
}

.closing-logo {
  width: clamp(160px, 48vw, 280px);
  height: auto;
  filter: brightness(0) invert(1) drop-shadow(0 2px 16px rgba(42, 24, 18, 0.5));
  display: block;
}

.closing-date {
  font-family: var(--font-body);
  font-size: clamp(0.62rem, 1.8vw, 0.78rem);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

@media (min-width: 768px) {
  .closing-text {
    font-size: clamp(1.1rem, 1.8vw, 1.4rem);
    max-width: 520px;
  }
  .closing-logo { width: clamp(200px, 22vw, 320px); }
}
</style>
