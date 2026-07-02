<template>
  <section class="hero">
    <div class="hero-bg" :style="{ backgroundImage: `url(${bgImage})` }"></div>
    <div class="hero-veil"></div>

    <div class="hero-inner fade-in-up">
      <OliveBranch class="hero-olive" />
      <img :src="logo" alt="" class="hero-logo" />
      <h1 class="hero-names">{{ bride }} <span>&amp;</span> {{ groom }}</h1>
      <p class="hero-date">{{ formattedDate }}</p>
      <button class="hero-cta" @click="$emit('next')">
        Role para descobrir nossa história
        <span class="hero-arrow">⌄</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import OliveBranch from './OliveBranch.vue';
import { getPublicPath } from '@/utils/assets';
import weddingInfo from '@/data/wedding-info.json';

dayjs.locale('pt-br');
defineEmits(['next']);

const bgImage = getPublicPath('homepage.jpeg');
const logo = getPublicPath('logo_luquinha.png');
const bride = weddingInfo.couple.bride;
const groom = weddingInfo.couple.groom;
const formattedDate = dayjs(weddingInfo.weddingDate).format('DD [de] MMMM [de] YYYY');
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;   /* parallax discreto */
  transform: scale(1.05);
}

.hero-veil {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 40%, rgba(60, 38, 22, 0.25), transparent 70%),
    linear-gradient(180deg, rgba(46, 30, 18, 0.45) 0%, rgba(46, 30, 18, 0.55) 100%);
}

.hero-inner {
  position: relative;
  z-index: 2;
  text-align: center;
  color: var(--v2-paper);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.hero-olive {
  opacity: 0.9;
  margin-bottom: 0.4rem;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
}

.hero-logo {
  width: clamp(150px, 34vw, 240px);
  height: auto;
  filter: brightness(0) invert(1) drop-shadow(0 4px 18px rgba(0, 0, 0, 0.5));
  opacity: 0.95;
}

.hero-names {
  font-family: var(--v2-script);
  font-size: clamp(3rem, 11vw, 6rem);
  font-weight: 400;
  line-height: 1;
  margin: 0.3rem 0 0;
  color: var(--v2-paper);
  text-shadow: 0 3px 18px rgba(0, 0, 0, 0.55);
}
.hero-names span { font-size: 0.7em; opacity: 0.85; }

.hero-date {
  font-family: var(--v2-serif);
  font-size: clamp(0.85rem, 2.4vw, 1.1rem);
  letter-spacing: 0.32em;
  text-transform: uppercase;
  margin: 0.2rem 0 1.4rem;
  color: var(--v2-paper);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
}

.hero-cta {
  font-family: var(--v2-serif);
  font-size: clamp(0.82rem, 2vw, 0.98rem);
  letter-spacing: 0.08em;
  color: var(--v2-paper);
  background: rgba(176, 106, 68, 0.18);
  border: 1px solid rgba(243, 232, 210, 0.6);
  border-radius: var(--radius-full);
  padding: 0.7rem 1.6rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  backdrop-filter: blur(4px);
  transition: all 0.35s ease;
}
.hero-cta:hover {
  background: rgba(176, 106, 68, 0.4);
  transform: translateY(-2px);
}
.hero-arrow {
  font-size: 1.3em;
  line-height: 1;
  animation: float 2s ease-in-out infinite;
}

@media (max-width: 768px) {
  .hero-bg { background-attachment: scroll; }  /* fixed trava no iOS */
}
</style>
