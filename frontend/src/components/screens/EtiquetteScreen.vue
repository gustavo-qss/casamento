<template>
  <div class="etiquette-screen">
    <BackButton @click="handleBack" />

    <div class="screen-inner">
      <!-- Cabeçalho -->
      <header class="etiquette-header fade-in-up">
        <p class="eyebrow">Para o nosso dia</p>
        <h2 class="etiquette-title">
          Alguns<br />
          <em>Combinados</em>
        </h2>
        <p class="etiquette-subtitle">
          Queremos que esse momento seja especial para todos.
        </p>
      </header>

      <!-- Grid de regras -->
      <div class="rules-grid">
        <div
          v-for="rule in rules"
          :key="rule.id"
          class="rule-card"
          :class="{ 'rule-card--full': rule.id === 7 }"
        >
          <div class="rule-icon" v-html="rule.icon"></div>
          <div class="rule-text">
            <h3 class="rule-title">{{ rule.title }}</h3>
            <p class="rule-desc" v-html="rule.desc"></p>
          </div>
        </div>
      </div>
    </div>

    <div class="scroll-arrow-wrapper">
      <ScrollArrow @click="scrollToNext" />
    </div>
  </div>
</template>

<script setup>
import BackButton from '../ui/BackButton.vue';
import ScrollArrow from '../ui/ScrollArrow.vue';

const emit = defineEmits(['next', 'back']);

const scrollToNext = () => emit('next');
const handleBack = () => emit('back');

const rules = [
  {
    id: 1,
    title: 'Não convide outras pessoas',
    desc: 'O convite foi preparado com muito carinho para cada convidado. Pedimos que não leve acompanhantes que não estejam no convite.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`,
  },
  {
    id: 2,
    title: 'Seja pontual',
    desc: 'A cerimônia começará no horário marcado. Chegue com antecedência para não perder nenhum momento especial.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
  {
    id: 3,
    title: 'Participe da cerimônia',
    desc: 'A cerimônia é o coração do nosso casamento. Sua presença e atenção tornam esse momento ainda mais significativo para nós.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  },
  {
    id: 4,
    title: 'Atenção ao traje',
    desc: 'Pedimos gentilmente que <strong>não venha de branco</strong> e evite azul marinho, pois essa cor será usada pelas madrinhas.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>`,
  },
  {
    id: 5,
    title: 'Celular no silencioso',
    desc: 'Durante a cerimônia, deixe seu celular no modo silencioso para não interromper o momento.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  },
  {
    id: 6,
    title: 'Ajude nossos fotógrafos',
    desc: 'Teremos profissionais registrando tudo com muito carinho, evite ficar à frente deles.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  },
  {
    id: 7,
    title: 'Antes de ir embora…',
    desc: 'Passe para nos dar um abraço e tirar uma foto com a gente. <strong>Vai ser uma lembrança muito especial!</strong>',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  },
];
</script>

<style scoped>
.etiquette-screen {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--pearl);
  overflow-x: hidden;
}

.screen-inner {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(80px, 12vh, 120px) var(--spacing-md) clamp(80px, 12vh, 120px);
}

/* ===== CABEÇALHO ===== */
.etiquette-header {
  text-align: center;
  margin-bottom: clamp(var(--spacing-xl), 6vh, var(--spacing-2xl));
  max-width: 600px;
}

.eyebrow {
  font-family: var(--font-body);
  font-size: clamp(0.65rem, 1.5vw, 0.75rem);
  letter-spacing: 6px;
  text-transform: uppercase;
  color: var(--navy-accent);
  opacity: 0.6;
  margin: 0 0 var(--spacing-sm) 0;
}

.etiquette-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 400;
  color: var(--navy-dark);
  line-height: 1.05;
  margin: 0 0 var(--spacing-md) 0;
  letter-spacing: -0.5px;
}

.etiquette-title em {
  font-style: italic;
  color: var(--navy-accent);
}

.etiquette-subtitle {
  font-family: var(--font-body);
  font-size: clamp(0.85rem, 2vw, 1rem);
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
}

/* ===== GRID DE REGRAS ===== */
.rules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  width: 100%;
  max-width: 860px;
  background: rgba(13, 31, 60, 0.08);
  border: 1px solid rgba(13, 31, 60, 0.08);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.rule-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  background: var(--white);
  padding: var(--spacing-lg);
  transition: background var(--transition-normal);
}

.rule-card:hover {
  background: var(--pale-blue);
}

.rule-card--full {
  grid-column: 1 / -1;
}

.rule-icon {
  flex-shrink: 0;
  width: 2.2rem;
  height: 2.2rem;
  color: var(--navy-accent);
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.rule-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.rule-text {
  flex: 1;
}

.rule-title {
  font-family: var(--font-body);
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
  font-weight: 600;
  color: var(--navy-dark);
  margin: 0 0 var(--spacing-xs) 0;
  letter-spacing: 0.3px;
}

.rule-desc {
  font-family: var(--font-body);
  font-size: clamp(0.75rem, 1.5vw, 0.82rem);
  color: var(--text-muted);
  line-height: 1.65;
  margin: 0;
}

.rule-desc :deep(strong) {
  color: var(--navy-dark);
  font-weight: 600;
}

/* ===== SCROLL ARROW (navy sobre fundo claro) ===== */
.scroll-arrow-wrapper :deep(.scroll-arrow) {
  color: var(--navy-dark) !important;
}

.scroll-arrow-wrapper :deep(.scroll-arrow:hover) {
  color: var(--navy-accent) !important;
}

.scroll-arrow-wrapper {
  position: fixed;
  bottom: clamp(20px, 4vh, 48px);
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 30;
  pointer-events: none;
}

.scroll-arrow-wrapper :deep(.scroll-arrow) {
  position: static;
  transform: none;
  pointer-events: auto;
}

.scroll-arrow-wrapper :deep(.scroll-arrow:hover) {
  transform: scale(1.2);
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 768px) {
  .rules-grid {
    grid-template-columns: 1fr;
    gap: 1px;
  }

  .rule-card {
    padding: var(--spacing-md);
  }

  .screen-inner {
    padding-bottom: clamp(80px, 14vh, 120px);
  }
}

@media (max-width: 480px) {
  .etiquette-title {
    font-size: clamp(2rem, 10vw, 3rem);
  }
}
</style>
