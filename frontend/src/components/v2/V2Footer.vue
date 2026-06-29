<template>
  <footer class="footer" ref="root">
    <div class="footer-bg" :style="{ backgroundImage: `url(${bgImage})` }"></div>
    <div class="footer-veil"></div>

    <div class="footer-inner">
      <OliveBranch class="footer-olive reveal reveal-fade" />
      <h2 class="footer-title reveal reveal-delay-1">Nos vemos lá!</h2>
      <p class="footer-text reveal reveal-delay-2">
        Estamos contando os dias para celebrar esse momento tão especial ao lado de vocês.
      </p>
      <p class="footer-date reveal reveal-delay-3">{{ formattedDate }}</p>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import OliveBranch from './OliveBranch.vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
import { getPublicPath } from '@/utils/assets';
import weddingInfo from '@/data/wedding-info.json';

dayjs.locale('pt-br');
const root = ref(null);
useScrollReveal(root);

const bgImage = getPublicPath('homepage1.jpeg');
const formattedDate = dayjs(weddingInfo.weddingDate).format('DD [de] MMMM [de] YYYY');
</script>

<style scoped>
.footer {
  position: relative;
  min-height: 90svh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: center;
}

.footer-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.08);
  filter: blur(4px) saturate(1.05);
}

.footer-veil {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(46, 30, 18, 0.35), transparent 70%),
    linear-gradient(180deg, rgba(46, 30, 18, 0.55), rgba(46, 30, 18, 0.7));
}

.footer-inner {
  position: relative;
  z-index: 2;
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--v2-paper);
}

.footer-olive { opacity: 0.9; filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4)); }

.footer-title {
  font-family: var(--v2-script);
  font-size: clamp(3rem, 11vw, 5.5rem);
  margin: 0.3rem 0 0;
  line-height: 1;
  color: var(--v2-paper);
  text-shadow: 0 3px 18px rgba(0, 0, 0, 0.55);
}

.footer-text {
  font-family: var(--v2-serif);
  font-size: clamp(1.05rem, 3vw, 1.35rem);
  line-height: 1.6;
  max-width: 520px;
  margin: 0.4rem 0 0.6rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
}

.footer-date {
  font-family: var(--v2-serif);
  font-size: clamp(0.85rem, 2.2vw, 1rem);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin: 0;
  color: var(--v2-paper);
  opacity: 0.85;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
}
</style>
