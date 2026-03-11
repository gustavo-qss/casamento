<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
import { getPublicPath } from '@/utils/assets';
import weddingInfo from '@/data/wedding-info.json';

const section = ref(null);
useScrollReveal(section);

const bgImg = getPublicPath('oratorio-nossa-senhora.jpg');
const { church } = weddingInfo;
</script>

<template>
  <section class="ceremony" id="ceremony" ref="section">
    <div class="ceremony-bg">
      <img :src="bgImg" alt="Igreja" class="ceremony-photo" />
      <div class="ceremony-overlay"></div>
    </div>

    <div class="ceremony-content">
      <span class="ceremony-eyebrow reveal reveal-fade">onde diremos sim</span>

      <h2 class="ceremony-title reveal reveal-delay-1">Cerimônia</h2>

      <div class="ceremony-time reveal reveal-delay-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>{{ church.time }} horas</span>
      </div>

      <div class="ceremony-separator reveal reveal-delay-3">
        <span></span><span class="sep-dot">✦</span><span></span>
      </div>

      <div class="ceremony-place reveal reveal-delay-3">
        <p class="ceremony-venue">{{ church.location }}</p>
        <p class="ceremony-address">{{ church.address }}</p>
      </div>

      <a
        :href="church.mapsLink"
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
.ceremony {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.ceremony-bg {
  position: absolute;
  inset: 0;
}

.ceremony-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.ceremony-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(6, 14, 28, 0.05)  0%,
    rgba(6, 14, 28, 0.22) 35%,
    rgba(6, 14, 28, 0.72) 70%,
    rgba(6, 14, 28, 0.92) 100%
  );
}

.ceremony-content {
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

.ceremony-eyebrow {
  font-family: var(--font-body);
  font-size: clamp(0.6rem, 1.8vw, 0.75rem);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(197, 223, 245, 0.65);
  font-weight: 300;
}

.ceremony-title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 7vw, 3.8rem);
  font-weight: 400;
  color: var(--white);
  margin: 0;
  line-height: 1.1;
  letter-spacing: 0.04em;
}

.ceremony-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(197, 223, 245, 0.8);
  font-family: var(--font-body);
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  font-weight: 300;
  letter-spacing: 0.08em;
}

.ceremony-time svg {
  flex-shrink: 0;
  stroke: rgba(197, 223, 245, 0.7);
}

.ceremony-separator {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 80px;
  margin: var(--spacing-xs) 0;
}

.ceremony-separator span:not(.sep-dot) {
  flex: 1;
  height: 1px;
  background: rgba(197, 223, 245, 0.25);
}

.sep-dot {
  font-size: 0.55rem;
  color: rgba(197, 223, 245, 0.4);
}

.ceremony-place {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.ceremony-venue {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  color: var(--white);
  font-style: italic;
  margin: 0;
  font-weight: 400;
}

.ceremony-address {
  font-family: var(--font-body);
  font-size: clamp(0.75rem, 2.2vw, 0.9rem);
  color: rgba(197, 223, 245, 0.58);
  margin: 0;
  font-weight: 300;
  line-height: 1.55;
}

.maps-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: var(--spacing-sm);
  padding: 0.85rem 2rem;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: clamp(0.68rem, 2vw, 0.82rem);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.88);
  text-decoration: none;
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.06);
  transition: all var(--transition-normal);
}

.maps-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: var(--white);
  color: var(--white);
}

.maps-btn svg {
  flex-shrink: 0;
}

/* ============================================
   DESKTOP — layout 2 colunas (≥ 768px)
   foto esquerda | painel de conteúdo direita
   ============================================ */
@media (min-width: 768px) {
  .ceremony {
    display: grid;
    grid-template-columns: 58% 42%;
    min-height: unset;
    height: clamp(580px, 86vh, 920px);
    align-items: stretch;
  }

  /* Foto passa de absolute para um grid-item normal */
  .ceremony-bg {
    position: relative; /* anula o absolute */
    overflow: hidden;
  }

  .ceremony-photo {
    object-position: center;
  }

  /* Overlay só no lado direito da foto — faz a transição para o painel */
  .ceremony-overlay {
    background: linear-gradient(
      to right,
      transparent 55%,
      rgba(6, 14, 28, 0.55) 100%
    );
  }

  /* Painel de conteúdo com fundo próprio */
  .ceremony-content {
    background: rgba(6, 14, 28, 0.97);
    justify-content: center;
    padding: 3.5rem 4rem;
    gap: 1.4rem;
    width: auto;
    border-left: 1px solid rgba(197, 223, 245, 0.08);
  }

  .ceremony-title {
    font-size: clamp(2.6rem, 3.5vw, 3.6rem);
  }

  .ceremony-venue {
    font-size: clamp(1.4rem, 2vw, 1.9rem);
  }
}

@media (min-width: 1200px) {
  .ceremony-content {
    padding: 4rem 5rem;
  }
}
</style>
