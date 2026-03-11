<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

const section = ref(null);
useScrollReveal(section);

const orientations = [
  {
    icon: `<path d="M12 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 8a6 6 0 1 1 12 0M2 20h20M12 14v6M8 17l4-3 4 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    title: 'Silenciar celulares',
    text: 'Pedimos gentilmente que durante a cerimônia os celulares permaneçam no modo silencioso.',
  },
  {
    icon: `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
    title: 'Evitar fotos durante a cerimônia',
    text: 'Nosso fotógrafo estará registrando os momentos. Pedimos que evitem levantar celulares.',
  },
  {
    icon: `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>`,
    title: 'Chegar com antecedência',
    text: 'Recomendamos chegar alguns minutos antes do início da cerimônia.',
  },
  {
    icon: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    title: 'Código de vestimenta',
    text: 'Traje formal. Evitar roupas brancas.',
  },
];
</script>

<template>
  <section class="orientations" id="orientations" ref="section">
    <div class="orient-inner">
      <header class="orient-header">
        <span class="orient-label reveal">orientações</span>
        <h2 class="orient-title reveal reveal-delay-1">Orientações para o grande dia</h2>
        <p class="orient-intro reveal reveal-delay-2">
          Queremos que todos aproveitem esse momento tão especial conosco.<br>
          Para que tudo aconteça da melhor forma, separamos algumas orientações.
        </p>
      </header>

      <ul class="orient-list">
        <li
          v-for="(item, i) in orientations"
          :key="i"
          class="orient-card reveal"
          :class="`reveal-delay-${i + 1}`"
        >
          <div class="card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" v-html="item.icon"></svg>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ item.title }}</h3>
            <p class="card-text">{{ item.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.orientations {
  background: var(--pearl);
  padding: clamp(3rem, 10vw, 6rem) var(--spacing-md);
}

.orient-inner {
  max-width: 580px;
  margin: 0 auto;
}

.orient-header {
  text-align: center;
  margin-bottom: clamp(2rem, 6vw, 3.5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.orient-label {
  font-family: var(--font-body);
  font-size: clamp(0.6rem, 1.8vw, 0.75rem);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--lavender-dark);
  font-weight: 400;
}

.orient-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 5vw, 2.4rem);
  font-weight: 400;
  color: var(--navy-dark);
  line-height: 1.25;
}

.orient-intro {
  font-family: var(--font-body);
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  color: var(--text-muted);
  line-height: 1.7;
  font-weight: 300;
  margin: 0;
}

.orient-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  list-style: none;
}

.orient-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  background: var(--white);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  border-left: 3px solid rgba(144, 152, 199, 0.35);
}

.card-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: rgba(177, 185, 231, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--lavender-dark);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.card-title {
  font-family: var(--font-display);
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
  color: var(--navy-dark);
  font-weight: 400;
  font-style: italic;
}

.card-text {
  font-family: var(--font-body);
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  color: var(--text-muted);
  line-height: 1.65;
  font-weight: 300;
  margin: 0;
}

@media (min-width: 768px) {
  .orient-inner {
    max-width: 900px;
  }

  /* 2 colunas nos cards */
  .orient-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }
}

@media (min-width: 1200px) {
  .orient-inner {
    max-width: 1060px;
  }
}
</style>
