<template>
  <section class="gallery" ref="root">
    <header class="gallery-head">
      <h2 class="gallery-title reveal reveal-fade">Nossa história</h2>
      <p class="gallery-text reveal reveal-delay-1">
        Cada momento vivido nos trouxe até aqui. Estamos muito felizes em
        compartilhar esse dia tão especial com vocês.
      </p>
    </header>

    <div class="gallery-grid">
      <figure
        v-for="(img, i) in photos"
        :key="i"
        class="frame reveal reveal-scale"
        :class="[`frame--${i % 3}`, `reveal-delay-${(i % 4) + 1}`]"
      >
        <img :src="img" alt="Foto do casal" loading="lazy" />
      </figure>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
import { getPublicPath } from '@/utils/assets';

const root = ref(null);
useScrollReveal(root);

const photos = [
  'homepage1.jpeg',
  'storie1.jpeg',
  'stories3.jpeg',
  'storie2.jpeg',
  'stories4.jpeg',
  'stories5.jpeg',
].map(getPublicPath);
</script>

<style scoped>
.gallery {
  background:
    var(--tex-paper) repeat,
    var(--v2-bg);
  background-size: 240px, auto;
  padding: clamp(4rem, 11vw, 7rem) clamp(1rem, 5vw, 3rem);
}

.gallery-head {
  text-align: center;
  max-width: 640px;
  margin: 0 auto clamp(2.5rem, 6vw, 4rem);
}
.gallery-title {
  font-family: var(--v2-script);
  font-size: clamp(2.6rem, 8vw, 4.2rem);
  color: var(--v2-terracotta);
  margin: 0 0 0.6rem;
  line-height: 1;
}
.gallery-text {
  font-family: var(--v2-serif);
  font-size: clamp(1rem, 2.6vw, 1.2rem);
  line-height: 1.7;
  color: var(--v2-ink);
  margin: 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(0.8rem, 2.2vw, 1.6rem);
  max-width: 1100px;
  margin: 0 auto;
}

/* Moldura de madeira real */
.frame {
  margin: 0;
  padding: clamp(8px, 1.4vw, 13px);
  background-color: #3a2412;
  background-image:
    linear-gradient(180deg, rgba(227, 169, 76, 0.1), rgba(0, 0, 0, 0.32)),
    var(--tex-grain) repeat,
    var(--tex-wood) repeat;
  background-size: auto, 150px, 200px;
  border-radius: var(--radius-sm);
  box-shadow:
    inset 0 0 0 2px rgba(0, 0, 0, 0.4),
    inset 0 2px 8px rgba(0, 0, 0, 0.4),
    0 12px 28px rgba(36, 20, 8, 0.32);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.frame:hover {
  transform: translateY(-6px) rotate(-0.4deg);
  box-shadow: 0 20px 40px rgba(36, 20, 8, 0.45);
}
.frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 3px;
  display: block;
}

/* alturas variadas para um arranjo harmônico */
.frame--0 { grid-row: span 2; }
.frame--0 img { aspect-ratio: 3 / 4; }
.frame--1 img { aspect-ratio: 4 / 3; }
.frame--2 img { aspect-ratio: 1 / 1; }

@media (max-width: 760px) {
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .frame--0 { grid-row: span 1; }
  .frame--0 img,
  .frame--1 img,
  .frame--2 img { aspect-ratio: 1 / 1; }
}

@media (max-width: 420px) {
  .gallery-grid { grid-template-columns: 1fr; }
}
</style>
