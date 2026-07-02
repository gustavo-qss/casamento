<template>
  <div class="hero-screen">
    <!-- Dual background com Ken Burns crossfade -->
    <div
      class="hero-bg hero-bg--1"
      :class="{ active: activeIndex === 0 }"
      :style="{ backgroundImage: `url(${heroImage1})` }"
    ></div>
    <div
      class="hero-bg hero-bg--2"
      :class="{ active: activeIndex === 1 }"
      :style="{ backgroundImage: `url(${heroImage2})` }"
    ></div>

    <!-- Overlay escuro -->
    <div class="hero-overlay"></div>

    <!-- Conteúdo -->
    <div class="hero-content fade-in-up">
      <div class="hero-top">
        <img :src="logoImage" alt="Gustavo e Rawane" class="hero-logo" />
        <p class="wedding-date">{{ formattedDate }}</p>
      </div>
      <button class="cta-button" @click="scrollToNext">Ver Mais</button>

      <!-- Mini countdown -->
      <div class="hero-countdown">
        <div class="hero-countdown-item">
          <span class="hc-number">{{ String(days).padStart(2, '0') }}</span>
          <span class="hc-label">dias</span>
        </div>
        <span class="hc-sep">:</span>
        <div class="hero-countdown-item">
          <span class="hc-number">{{ String(hours).padStart(2, '0') }}</span>
          <span class="hc-label">horas</span>
        </div>
        <span class="hc-sep">:</span>
        <div class="hero-countdown-item">
          <span class="hc-number">{{ String(minutes).padStart(2, '0') }}</span>
          <span class="hc-label">min</span>
        </div>
        <span class="hc-sep">:</span>
        <div class="hero-countdown-item">
          <span class="hc-number">{{ String(seconds).padStart(2, '0') }}</span>
          <span class="hc-label">seg</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { getPublicPath } from '@/utils/assets';
import weddingInfo from '@/data/wedding-info.json';
import { useCountdown } from '@/composables/useCountdown';

dayjs.locale('pt-br');

const emit = defineEmits(['scrollNext']);

const heroImage1 = getPublicPath('homepage.jpeg');
const heroImage2 = getPublicPath('homepage1.jpeg');
const logoImage = getPublicPath('logo_luquinha.png');

const formattedDate = dayjs(weddingInfo.weddingDate).format('DD [de] MMMM [de] YYYY');
const { days, hours, minutes, seconds } = useCountdown(weddingInfo.weddingDate);

const activeIndex = ref(0);
let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    activeIndex.value = activeIndex.value === 0 ? 1 : 0;
  }, 5000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const scrollToNext = () => {
  emit('scrollNext');
};
</script>

<style scoped>
.hero-screen {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Dual backgrounds com Ken Burns */
.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0;
  transition: opacity 2s ease;
  animation: kenBurns 14s ease-in-out infinite alternate;
}

.hero-bg.active {
  opacity: 1;
}

.hero-bg--2 {
  animation-delay: -7s;
}

/* Overlay cinematográfico */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.25) 0%,
    rgba(0, 0, 0, 0.35) 50%,
    rgba(0, 0, 0, 0.55) 100%
  );
  z-index: 1;
}

/* Conteúdo */
.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

/* Wrapper logo + data — transform não afeta o layout dos irmãos */
.hero-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateY(clamp(20px, 4vh, 55px));
}

.hero-logo {
  width: clamp(260px, 50vw, 480px);
  height: auto;
  filter: brightness(0) invert(1) drop-shadow(0 4px 16px rgba(0, 0, 0, 0.4));
}

.wedding-date {
  color: var(--white);
  font-family: var(--font-body);
  font-size: var(--text-subtitle);
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin: var(--spacing-sm) 0 var(--spacing-lg);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}

/* Botão CTA com glassmorphism */
.cta-button {
  font-family: var(--font-body);
  font-size: var(--text-small);
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--white);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-xl);
  cursor: pointer;
  transition: all 0.35s ease;
  margin-top: var(--spacing-sm);
}

.cta-button:hover {
  background: rgba(242, 230, 214, 0.15);
  border-color: var(--ice-blue);
  color: var(--ice-blue);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(242, 230, 214, 0.2);
}

/* ===== MINI COUNTDOWN ===== */
.hero-countdown {
  display: flex;
  align-items: center;
  gap: clamp(6px, 1.5vw, 14px);
  margin-top: var(--spacing-lg);
  padding: clamp(10px, 2vh, 16px) clamp(20px, 4vw, 36px);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: var(--radius-full);
}

.hero-countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.hc-number {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  font-weight: 300;
  color: var(--white);
  line-height: 1;
  letter-spacing: 1px;
}

.hc-label {
  font-family: var(--font-body);
  font-size: clamp(0.5rem, 1vw, 0.6rem);
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--ice-blue);
  opacity: 0.75;
}

.hc-sep {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 3vw, 1.6rem);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.3);
  line-height: 1;
  margin-bottom: 12px;
}

/* Responsividade */
@media (max-width: 768px) {
  .hero-top {
    transform: translateY(clamp(12px, 3vh, 36px));
  }

  .hero-logo {
    width: clamp(190px, 65vw, 340px);
  }

  .wedding-date {
    font-size: var(--text-body);
    letter-spacing: 2px;
    margin-bottom: var(--spacing-xl);
  }

  .cta-button {
    padding: 0.7rem 1.8rem;
    font-size: 0.8rem;
    margin-top: var(--spacing-lg);
  }

  .hero-countdown {
    padding: 10px 20px;
    gap: 8px;
  }

  .hc-sep {
    margin-bottom: 10px;
  }
}

@media (max-width: 480px) {
  .hero-content {
    gap: var(--spacing-sm);
  }

  .wedding-date {
    margin: var(--spacing-xs) 0 var(--spacing-2xl);
  }

  .cta-button {
    padding: 0.6rem 1.5rem;
    font-size: 0.75rem;
    margin-top: var(--spacing-xl);
  }
}
</style>
