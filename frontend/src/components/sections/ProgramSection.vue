<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

const section = ref(null);
useScrollReveal(section);

const items = [
  { time: '16:30', label: 'Cerimônia',               icon: '💍' },
  { time: '18:30', label: 'Recepção',                  icon: '🌹' },
  { time: '19:00', label: 'Brinde',                  icon: '🥂' },
  { time: '19:30', label: 'Jantar',                   icon: '🍴' },
  { time: '21:00', label: 'Sobremesa',             icon: '🧁' },
  { time: '22:00', label: 'Encerramento',             icon: '🌙' }
];
</script>

<template>
  <section class="program" id="program" ref="section">
    <div class="program-inner">
      <header class="program-header">
        <span class="program-label reveal">programação</span>
        <h2 class="program-title reveal reveal-delay-1">Programação do grande dia</h2>
        <div class="program-ornament reveal reveal-delay-2">
          <span></span><span class="dot">✦</span><span></span>
        </div>
      </header>

      <ol class="timeline">
        <li
          v-for="(item, i) in items"
          :key="i"
          class="timeline-item reveal"
          :class="`reveal-delay-${Math.min(i + 1, 6)}`"
        >
          <div class="timeline-left">
            <span class="timeline-time">{{ item.time }}</span>
          </div>
          <div class="timeline-dot-col">
            <div class="timeline-dot"></div>
            <div v-if="i < items.length - 1" class="timeline-line"></div>
          </div>
          <div class="timeline-right">
            <span class="timeline-icon">{{ item.icon }}</span>
            <span class="timeline-label">{{ item.label }}</span>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.program {
  background: var(--cream);
  padding: clamp(3rem, 10vw, 6rem) var(--spacing-md);
}

.program-inner {
  max-width: 540px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .program {
    padding: clamp(4rem, 10vw, 7rem) clamp(2rem, 6vw, 5rem);
  }

  .program-inner {
    max-width: 700px;
  }

  .program-title {
    font-size: clamp(2rem, 3vw, 2.8rem);
  }

  .timeline-item {
    grid-template-columns: 90px 32px 1fr;
    min-height: 80px;
  }

  .timeline-label {
    font-size: clamp(1.1rem, 1.8vw, 1.35rem);
  }
}

.program-header {
  text-align: center;
  margin-bottom: clamp(2.5rem, 7vw, 4rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.program-label {
  font-family: var(--font-body);
  font-size: clamp(0.6rem, 1.8vw, 0.75rem);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--lavender-dark);
  font-weight: 400;
}

.program-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 5vw, 2.4rem);
  font-weight: 400;
  color: var(--navy-dark);
  line-height: 1.25;
}

.program-ornament {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 120px;
}

.program-ornament span:not(.dot) {
  flex: 1;
  height: 1px;
  background: var(--lavender-dark);
  opacity: 0.3;
}

.program-ornament .dot {
  font-size: 0.6rem;
  color: var(--lavender-dark);
  opacity: 0.55;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  list-style: none;
}

.timeline-item {
  display: grid;
  grid-template-columns: 72px 28px 1fr;
  align-items: flex-start;
  gap: 0 0.75rem;
  min-height: 72px;
}

.timeline-left {
  text-align: right;
  padding-top: 0.15rem;
}

.timeline-time {
  font-family: var(--font-body);
  font-size: clamp(0.75rem, 2vw, 0.85rem);
  font-weight: 500;
  color: var(--lavender-dark);
  letter-spacing: 0.05em;
}

.timeline-dot-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--navy-dark);
  border: 2px solid var(--cream);
  box-shadow: 0 0 0 1.5px var(--lavender-dark);
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.timeline-line {
  flex: 1;
  width: 1px;
  background: linear-gradient(to bottom, var(--lavender-dark), transparent);
  opacity: 0.3;
  min-height: 48px;
}

.timeline-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-top: 0.05rem;
  padding-bottom: 1rem;
}

.timeline-icon {
  font-size: 1rem;
  line-height: 1;
  flex-shrink: 0;
}

.timeline-label {
  font-family: var(--font-display);
  font-size: clamp(1rem, 3vw, 1.2rem);
  color: var(--navy-dark);
  font-weight: 400;
  font-style: italic;
}
</style>
