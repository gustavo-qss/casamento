<template>
  <FullscreenContainer
    :background-image="heroImage"
    :enable-bouncing="true"
    overlay-class="overlay-dark"
  >
    <div class="hero-content fade-in">
      <h1 class="hero-title">
        Casamento<br />
        <span class="couple-names script-text">Gustavo e Rawane</span>
      </h1>
      <p class="wedding-date">26 de Abril de 2026</p>
      <button class="btn btn-primary cta-button hover-lift" @click="scrollToNext">
        Ver Mais
      </button>
    </div>
  </FullscreenContainer>
</template>

<script setup>
import FullscreenContainer from '@/components/layout/FullscreenContainer.vue';
import { getPublicPath } from '@/utils/assets';

const emit = defineEmits(['scrollNext']);

const heroImage = getPublicPath('homepage.jpeg');

const scrollToNext = () => {
  emit('scrollNext');
};
</script>

<style scoped>
.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.hero-title {
  color: var(--white);
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  margin: 0;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.couple-names {
  display: block;
  font-size: clamp(3rem, 10vw, 6rem);
  color: var(--primary-lavender);
  font-weight: 400;
  margin-top: var(--spacing-sm);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.wedding-date {
  color: var(--white);
  font-family: var(--font-body);
  font-size: var(--text-subtitle);
  font-weight: 300;
  letter-spacing: 3px;
  margin: var(--spacing-sm) 0 var(--spacing-lg);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.cta-button {
  font-size: var(--text-body);
  padding: var(--spacing-md) var(--spacing-xl);
  margin-top: var(--spacing-md);
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 600;
}

/* Responsividade */
@media (max-width: 768px) {
  .hero-title {
    font-size: clamp(2rem, 8vw, 3rem);
  }

  .couple-names {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }

  .wedding-date {
    font-size: var(--text-body);
    letter-spacing: 2px;
    margin-bottom: var(--spacing-xl);
  }

  .cta-button {
    width: auto;
    max-width: 200px;
    padding: 0.7rem 1.8rem;
    font-size: var(--text-small);
    font-weight: 500;
    margin-top: var(--spacing-lg);
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
    max-width: 180px;
    padding: 0.6rem 1.5rem;
    font-size: 0.85rem;
    margin-top: var(--spacing-xl);
  }
}
</style>
