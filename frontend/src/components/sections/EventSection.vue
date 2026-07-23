<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
import { getPublicPath } from '@/utils/assets';
import weddingInfo from '@/data/wedding-info.json';

const section = ref(null);
useScrollReveal(section);

const bgImg = getPublicPath('recepcao_new.png');
const { reception } = weddingInfo;
</script>

<template>
  <section class="event" id="event" ref="section">
    <!-- Foto de fundo full-bleed -->
    <div class="event-bg">
      <img :src="bgImg" alt="Local da recepção" class="event-photo" />
      <div class="event-overlay"></div>
    </div>

    <!-- Conteúdo sobreposto -->
    <div class="event-content">
      <span class="event-eyebrow reveal reveal-fade">onde nos encontramos</span>

      <h2 class="event-title reveal reveal-delay-1">Recepção</h2>

      <div class="event-time reveal reveal-delay-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>{{ reception.time }} horas</span>
      </div>

      <div class="event-separator reveal reveal-delay-3">
        <span></span><span class="sep-dot">✦</span><span></span>
      </div>

      <div class="event-place reveal reveal-delay-3">
        <p class="event-venue">{{ reception.location }}</p>
        <p class="event-address">{{ reception.address }}</p>
      </div>

      <a
        :href="reception.mapsLink"
        target="_blank"
        rel="noopener noreferrer"
        class="maps-btn reveal reveal-delay-4"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        Ver localização
      </a>
    </div>
  </section>
</template>

<style scoped>
.event {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.event-bg {
  position: absolute;
  inset: 0;
}

.event-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.event-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(42, 24, 18, 0.05)  0%,
    rgba(42, 24, 18, 0.25) 35%,
    rgba(42, 24, 18, 0.75) 70%,
    rgba(42, 24, 18, 0.92) 100%
  );
}

.event-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: clamp(2rem, 6vw, 4rem) var(--spacing-md) clamp(3rem, 8vw, 5rem);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.event-eyebrow {
  font-family: var(--font-body);
  font-size: clamp(0.6rem, 1.8vw, 0.75rem);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(242, 230, 214, 0.65);
  font-weight: 300;
}

.event-title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 7vw, 3.8rem);
  font-weight: 400;
  color: var(--white);
  margin: 0;
  line-height: 1.1;
  letter-spacing: 0.04em;
}

.event-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(242, 230, 214, 0.8);
  font-family: var(--font-body);
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  font-weight: 300;
  letter-spacing: 0.08em;
}

.event-time svg {
  flex-shrink: 0;
  stroke: rgba(242, 230, 214, 0.7);
}

.event-separator {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 80px;
  margin: var(--spacing-xs) 0;
}

.event-separator span:not(.sep-dot) {
  flex: 1;
  height: 1px;
  background: rgba(242, 230, 214, 0.25);
}

.sep-dot {
  font-size: 0.55rem;
  color: rgba(242, 230, 214, 0.4);
}

.event-place {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: center;
}

.event-venue {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  color: var(--white);
  font-style: italic;
  margin: 0;
  font-weight: 400;
}

.event-address {
  font-family: var(--font-body);
  font-size: clamp(0.78rem, 2.2vw, 0.92rem);
  color: rgba(242, 230, 214, 0.6);
  margin: 0;
  font-weight: 300;
  line-height: 1.5;
}

.maps-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: var(--spacing-sm);
  padding: 0.85rem 2rem;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: clamp(0.68rem, 2vw, 0.82rem);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.07);
  transition: all var(--transition-normal);
}

.maps-btn:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: var(--white);
  color: var(--white);
}

.maps-btn svg {
  flex-shrink: 0;
}

/* ============================================
   DESKTOP — layout 2 colunas (≥ 768px)
   painel de conteúdo esquerda | foto direita
   ============================================ */
@media (min-width: 768px) {
  .event {
    display: grid;
    grid-template-columns: 42% 58%;
    min-height: unset;
    height: clamp(580px, 86vh, 920px);
    align-items: stretch;
  }

  /* Conteúdo vem primeiro no DOM, logo vai para coluna 1 */
  .event-bg {
    position: relative;
    order: 2; /* foto fica à direita */
    overflow: hidden;
  }

  .event-photo {
    object-position: center;
  }

  /* Overlay faz a transição foto → painel (da direita para esquerda) */
  .event-overlay {
    background: linear-gradient(
      to left,
      transparent 55%,
      rgba(42, 24, 18, 0.55) 100%
    );
  }

  .event-content {
    order: 1; /* painel à esquerda */
    background: rgba(42, 24, 18, 0.97);
    justify-content: center;
    padding: 3.5rem 4rem;
    gap: 1.4rem;
    width: auto;
    border-right: 1px solid rgba(242, 230, 214, 0.08);
  }

  .event-title {
    font-size: clamp(2.6rem, 3.5vw, 3.6rem);
  }

  .event-venue {
    font-size: clamp(1.4rem, 2vw, 1.9rem);
  }
}

@media (min-width: 1200px) {
  .event-content {
    padding: 4rem 5rem;
  }
}
</style>
