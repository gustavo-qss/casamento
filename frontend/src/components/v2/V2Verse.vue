<template>
  <section class="verse" ref="root">
    <OliveBranch class="verse-olive reveal reveal-fade" />
    <blockquote class="verse-text reveal reveal-delay-1">
      “Assim, eles já não são dois, mas sim uma só carne.
      Portanto, o que Deus uniu, ninguém separe.”
    </blockquote>
    <cite class="verse-ref reveal reveal-delay-2">Mateus 19:6</cite>
    <OliveBranch class="verse-olive verse-olive--flip reveal reveal-delay-2" />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import OliveBranch from './OliveBranch.vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

const root = ref(null);
useScrollReveal(root);
</script>

<style scoped>
.verse {
  background:
    radial-gradient(ellipse 40% 30% at 12% 8%, rgba(111, 126, 68, 0.08), transparent 60%),
    radial-gradient(ellipse 40% 30% at 88% 92%, rgba(176, 106, 68, 0.08), transparent 60%),
    var(--tex-paper) repeat,
    var(--v2-cream);
  background-size: auto, auto, 240px, auto;
  padding: clamp(4.5rem, 14vw, 8rem) var(--spacing-lg);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.verse-olive { opacity: 0.85; }
.verse-olive--flip { transform: scaleX(-1); }

.verse-text {
  font-family: var(--v2-serif);
  font-style: italic;
  font-size: clamp(1.3rem, 4.2vw, 2.2rem);
  line-height: 1.6;
  color: var(--v2-ink);
  max-width: 720px;
  margin: 0;
  font-weight: 500;
}

.verse-ref {
  font-family: var(--v2-script);
  font-style: normal;
  font-size: clamp(1.6rem, 5vw, 2.4rem);
  color: var(--v2-terracotta);
}
</style>
