<template>
  <section class="venues" ref="root">
    <div class="venues-head">
      <OliveBranch class="venues-olive reveal reveal-fade" />
      <h2 class="venues-title reveal reveal-delay-1">Onde celebrar</h2>
    </div>

    <div class="venues-grid">
      <article
        v-for="(v, i) in cards"
        :key="v.kind"
        class="vcard reveal reveal-scale"
        :class="`reveal-delay-${i + 1}`"
      >
        <span class="vcard-eyebrow">{{ v.eyebrow }}</span>
        <h3 class="vcard-name">{{ v.location }}</h3>

        <ul class="vcard-info">
          <li>
            <svg viewBox="0 0 24 24" class="vc-ico"><path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
            <span>{{ v.address }}</span>
          </li>
          <li>
            <svg viewBox="0 0 24 24" class="vc-ico"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            <span>{{ v.time }}</span>
          </li>
        </ul>

        <a class="vcard-map" :href="v.mapsLink" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" class="vc-ico vc-ico--btn"><path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
          Ver no mapa
        </a>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import OliveBranch from './OliveBranch.vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
import weddingInfo from '@/data/wedding-info.json';

const root = ref(null);
useScrollReveal(root);

const cards = [
  { kind: 'church',    eyebrow: 'Cerimônia', ...weddingInfo.church },
  { kind: 'reception', eyebrow: 'Recepção',  ...weddingInfo.reception },
];
</script>

<style scoped>
.venues {
  background:
    var(--tex-paper) repeat,
    var(--v2-cream);
  background-size: 240px, auto;
  padding: clamp(4rem, 11vw, 7rem) var(--spacing-lg);
}

.venues-head {
  text-align: center;
  margin-bottom: clamp(2.5rem, 6vw, 4rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}
.venues-olive { opacity: 0.85; }
.venues-title {
  font-family: var(--v2-script);
  font-size: clamp(2.6rem, 8vw, 4rem);
  color: var(--v2-terracotta);
  margin: 0;
  line-height: 1;
}

.venues-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(1.2rem, 3vw, 2rem);
  max-width: 880px;
  margin: 0 auto;
}

.vcard {
  background: var(--v2-paper);
  border: 1px solid rgba(176, 106, 68, 0.28);
  border-radius: var(--radius-lg);
  padding: clamp(1.6rem, 4vw, 2.4rem);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  box-shadow: 0 10px 30px rgba(90, 58, 32, 0.12);
}

.vcard-eyebrow {
  font-family: var(--v2-serif);
  font-size: 0.78rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--v2-olive);
}

.vcard-name {
  font-family: var(--v2-script);
  font-size: clamp(1.8rem, 5vw, 2.4rem);
  color: var(--v2-ink);
  margin: 0;
  line-height: 1.1;
}

.vcard-info {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  width: 100%;
}
.vcard-info li {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.55rem;
  font-family: var(--v2-serif);
  font-size: clamp(0.95rem, 2.4vw, 1.08rem);
  color: var(--v2-ink);
  line-height: 1.45;
}

.vc-ico {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 3px;
  fill: none;
  stroke: var(--v2-terracotta);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.vcard-map {
  margin-top: 0.4rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--v2-serif);
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  color: var(--v2-paper);
  background: var(--v2-terracotta);
  border-radius: var(--radius-full);
  padding: 0.65rem 1.5rem;
  transition: all 0.3s ease;
}
.vcard-map:hover {
  background: #97552f;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(151, 85, 47, 0.35);
}
.vc-ico--btn { stroke: var(--v2-paper); width: 16px; height: 16px; margin-top: 0; }

@media (max-width: 680px) {
  .venues-grid { grid-template-columns: 1fr; }
}
</style>
