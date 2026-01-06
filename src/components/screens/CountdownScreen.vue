<template>
  <div class="countdown-screen">
    <BackButton @click="handleBack" />
    <FullscreenContainer
      :background-image="countdownImage"
      :show-overlay="true"
      overlay-class="overlay-gradient"
    >
      <div class="countdown-container">
        <h2 class="countdown-title">Faltam</h2>
        <div class="countdown-grid">
          <div class="countdown-item">
            <span class="countdown-number">{{ days }}</span>
            <span class="countdown-label">Dias </span>
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
import { defineEmits } from 'vue';
import FullscreenContainer from '../layout/FullscreenContainer.vue';
import ScrollArrow from '../ui/ScrollArrow.vue';
import BackButton from '../ui/BackButton.vue';
import { useCountdown } from '@/composables/useCountdown';
import weddingInfo from '@/data/wedding-info.json';

// Imagem de background do countdown
const countdownImage = '/countdown.jpeg';

// Usar o countdown com a data do casamento
const { days, hours, minutes, seconds } = useCountdown(weddingInfo.weddingDate);

const emit = defineEmits(['next', 'back']);

const scrollToNext = () => {
  emit('next');
};

const handleBack = () => {
  emit('back');
};
</script>

<style scoped>
.countdown-screen {
  position: relative;
  width: 100%;
  height: 100vh;
}

.countdown-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  max-width: 800px;
  width: 100%;
  animation: fadeIn 1s ease-in-out;
}

.countdown-title {
  font-family: var(--font-display);
  font-size: var(--text-title);
  color: var(--lavender-dark);
  text-align: center;
  margin: 0 0 var(--spacing-lg) 0;
}

.countdown-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--primary-lavender), var(--primary-blue));
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal);
}

.countdown-item:hover {
  transform: translateY(-5px);
}

.countdown-number {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--white);
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: pulse 2s ease-in-out infinite;
}

.countdown-label {
  font-family: var(--font-body);
  font-size: var(--text-small);
  font-weight: 600;
  color: var(--white);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.scroll-arrow-wrapper {
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 1000;
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

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Mobile: Grid 2x2 */
@media (max-width: 768px) {
  .countdown-container {
    padding: var(--spacing-lg);
    max-width: 90%;
  }

  .countdown-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }

  .countdown-item {
    padding: var(--spacing-sm);
  }

  .countdown-number {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }

  .countdown-label {
    font-size: 0.75rem;
  }
}

/* Desktop: Grid 1x4 horizontal */
@media (min-width: 769px) {
  .countdown-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
