<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

const section = ref(null);
useScrollReveal(section);

const orientations = [
  {
    icon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
    title: 'Não convide outras pessoas',
    text: 'O convite foi preparado com muito carinho para cada convidado. Pedimos que não leve acompanhantes que não estejam no convite.',
  },
  {
    icon: `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" fill="none"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>`,
    title: 'Seja pontual',
    text: 'A cerimônia começará no horário marcado. Chegue com antecedência para não perder nenhum momento especial.',
  },
  {
    icon: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    title: 'Participe da cerimônia',
    text: 'A cerimônia é o coração do nosso casamento. Sua presença e atenção tornam esse momento ainda mais significativo para nós.',
  },
  {
    icon: `<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    title: 'Atenção ao traje',
    text: 'Traje formal. Pedimos gentilmente que não venha de branco e evite as cores azul e terracota.',
  },
  {
    icon: `<rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke="currentColor" stroke-width="1.5" fill="none"/><line x1="12" y1="18" x2="12.01" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
    title: 'Celular no silencioso',
    text: 'Durante a cerimônia, deixe seu celular no modo silencioso para não interromper o momento.',
  },
  {
    icon: `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
    title: 'Ajude nossos fotógrafos',
    text: 'Teremos profissionais registrando tudo com muito carinho. Pedimos que evitem ficar à frente deles.',
  },
  {
    icon: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    title: 'Antes de ir embora…',
    text: 'Passe para nos dar um abraço e tirar uma foto com a gente. Vai ser uma lembrança muito especial!',
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
          :class="[`reveal-delay-${(i % 6) + 1}`, { 'orient-card--full': i === orientations.length - 1 && orientations.length % 2 !== 0 }]"
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
  border-left: 3px solid rgba(198, 106, 58, 0.45);
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

  .orient-card--full {
    grid-column: 1 / -1;
  }
}

@media (min-width: 1200px) {
  .orient-inner {
    max-width: 1060px;
  }
}
</style>
