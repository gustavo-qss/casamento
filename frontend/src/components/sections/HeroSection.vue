<script setup>
import { onMounted } from 'vue';
import { getPublicPath } from '@/utils/assets';

const heroImg = getPublicPath('homepage.jpeg');
const logoImg = getPublicPath('logo.png');

const scrollDown = () => {
  const next = document.getElementById('verse');
  if (next) next.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
  const texts = document.querySelectorAll('.hero-enter');
  texts.forEach((el, i) => {
    setTimeout(() => el.classList.add('hero-entered'), 400 + i * 250);
  });
});
</script>

<template>
  <section class="hero" id="hero">
    <div class="hero-bg">
      <img :src="heroImg" alt="Rawane e Gustavo" class="hero-img" />
      <div class="hero-overlay"></div>
    </div>

    <div class="hero-content">
      <span class="hero-enter pre-text">com amor, convidamos você para</span>
      <img :src="logoImg" alt="Rawane e Gustavo" class="hero-enter hero-logo" />
      <div class="hero-enter divider">
        <span class="divider-line"></span>
        <span class="divider-ornament">✦</span>
        <span class="divider-line"></span>
      </div>
      <p class="hero-enter date-text">16 &bull; Maio &bull; 2026</p>
    </div>

    <button class="scroll-hint" @click="scrollDown" aria-label="Rolar para baixo">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  animation: kenBurnsHero 14s ease-in-out alternate infinite;
}

@keyframes kenBurnsHero {
  from { transform: scale(1.0); }
  to   { transform: scale(1.07); }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(6, 14, 28, 0.25) 0%,
    rgba(6, 14, 28, 0.55) 60%,
    rgba(6, 14, 28, 0.75) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

/* Entrada suave */
.hero-enter {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
              transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-entered {
  opacity: 1;
  transform: translateY(0);
}

.pre-text {
  font-family: var(--font-body);
  font-size: clamp(0.7rem, 2vw, 0.85rem);
  font-weight: 300;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}

.hero-logo {
  width: clamp(180px, 52vw, 320px);
  height: auto;
  /* Converte qualquer cor → branco puro */
  filter: brightness(0) invert(1) drop-shadow(0 2px 20px rgba(6, 14, 28, 0.5));
  display: block;
}

.divider {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: clamp(160px, 40vw, 240px);
}

.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.45);
}

.divider-ornament {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.65rem;
  letter-spacing: 0;
}

.date-text {
  font-family: var(--font-body);
  font-size: clamp(0.8rem, 2.5vw, 1rem);
  font-weight: 300;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

/* Seta scroll */
.scroll-hint {
  position: absolute;
  bottom: clamp(1.5rem, 5vh, 3rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  color: rgba(255, 255, 255, 0.65);
  background: none;
  border: none;
  cursor: pointer;
  animation: floatArrow 2.4s ease-in-out infinite;
  transition: color var(--transition-normal);
}

.scroll-hint:hover {
  color: var(--white);
}

@keyframes floatArrow {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(8px); }
}
</style>
