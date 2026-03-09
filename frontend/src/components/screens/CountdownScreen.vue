<template>
  <div class="countdown-screen">
    <BackButton @click="handleBack" />
    <FullscreenContainer
      :background-image="countdownImage"
      :show-overlay="true"
      overlay-class="overlay-dark"
      :enable-blur="false"
    >
      <div class="countdown-container fade-in-up">
        <p class="countdown-eyebrow">faltam para o grande dia</p>
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
    </FullscreenContainer>
    <div class="scroll-arrow-wrapper">
      <ScrollArrow @click="scrollToNext" />
    </div>
  </div>
</template>

<script setup>
import FullscreenContainer from '../layout/FullscreenContainer.vue';
import ScrollArrow from '../ui/ScrollArrow.vue';
import BackButton from '../ui/BackButton.vue';
import { useCountdown } from '@/composables/useCountdown';
import { getPublicPath } from '@/utils/assets';
import weddingInfo from '@/data/wedding-info.json';

const countdownImage = getPublicPath('countdown.jpeg');
const { days, hours, minutes, seconds } = useCountdown(weddingInfo.weddingDate);

const emit = defineEmits(['next', 'back']);

const scrollToNext = () => emit('next');
const handleBack = () => emit('back');
</script>

<style scoped>
.countdown-screen {
  position: relative;
  width: 100%;
  height: 100vh;
}

/* Container sem fundo — números direto sobre a foto */
.countdown-container {
  background: none;
  backdrop-filter: none;
  box-shadow: none;
  text-align: center;
  padding: 0;
  width: 100%;
  max-width: 900px;
}

.countdown-eyebrow {
  font-family: var(--font-script);
  font-size: clamp(1.2rem, 3vw, 1.9rem);
  color: rgba(255, 255, 255, 0.82);
  margin: 0 0 var(--spacing-xl) 0;
  letter-spacing: 2px;
}

/* Grid horizontal com divisores dourados */
.countdown-grid {
  display: flex;
  align-items: stretch;
}

.countdown-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg) var(--spacing-md);
  position: relative;
}

/* Divisor entre items */
.countdown-item + .countdown-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  height: 60%;
  width: 1px;
  background: rgba(197, 223, 245, 0.3);
}

.countdown-number {
  font-family: var(--font-display);
  font-size: clamp(3rem, 9vw, 6.5rem);
  font-weight: 300;
  color: var(--white);
  line-height: 1;
  text-shadow: 0 4px 28px rgba(0, 0, 0, 0.45);
  display: block;
}

.countdown-label {
  font-family: var(--font-body);
  font-size: clamp(0.6rem, 1.5vw, 0.75rem);
  color: var(--ice-blue);
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-top: var(--spacing-xs);
  display: block;
}

.scroll-arrow-wrapper {
  position: absolute;
  bottom: clamp(24px, 4vh, 48px);
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 20;
  pointer-events: none;
}

.scroll-arrow-wrapper :deep(.scroll-arrow) {
  position: static;
  transform: none;
  pointer-events: auto;
}

.scroll-arrow-wrapper :deep(.scroll-arrow:hover) {
  transform: scale(1.2);
}

/* Mobile: Grid 2x2 */
@media (max-width: 600px) {
  .countdown-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
  }

  .countdown-item + .countdown-item::before {
    display: none;
  }

  /* Linhas divisórias no grid 2x2 */
  .countdown-item:nth-child(1),
  .countdown-item:nth-child(2) {
    border-bottom: 1px solid rgba(197, 223, 245, 0.25);
  }

  .countdown-item:nth-child(odd) {
    border-right: 1px solid rgba(197, 223, 245, 0.25);
  }

  .countdown-number {
    font-size: clamp(2.5rem, 12vw, 4rem);
  }

  .countdown-eyebrow {
    margin-bottom: var(--spacing-lg);
  }
}
</style>
