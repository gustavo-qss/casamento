<template>
  <nav class="dots-nav" :class="`dots-nav--${variant}`" aria-label="Navegação entre telas">
    <button
      v-for="n in total"
      :key="n"
      class="dot"
      :class="{ 'dot--active': n === current }"
      :aria-label="screenNames[n - 1]"
      @click="$emit('navigate', n)"
    >
      <span class="dot-tooltip">{{ screenNames[n - 1] }}</span>
    </button>
  </nav>
</template>

<script setup>
defineProps({
  current: { type: Number, required: true },
  total:   { type: Number, default: 7 },
  variant: { type: String, default: 'dark' }, // 'dark' | 'light'
});

defineEmits(['navigate']);

const screenNames = [
  'Início',
  'Nossa História',
  'Combinados',
  'Cerimônia',
  'Recepção',
  'Contagem',
  'Presentes',
];
</script>

<style scoped>
.dots-nav {
  position: fixed;
  right: clamp(14px, 2.5vw, 26px);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 11px;
  z-index: var(--z-navigation);
}

/* ===== DOT BASE ===== */
.dot {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.35s ease;
  outline: none;
}

/* Área de click maior */
.dot::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
}

/* ===== DOT ATIVO ===== */
.dot--active {
  background: var(--ice-blue);
  border-color: var(--ice-blue);
  box-shadow: 0 0 0 3px rgba(242, 230, 214, 0.2);
}

/* ===== TOOLTIP ===== */
.dot-tooltip {
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  white-space: nowrap;
  font-family: var(--font-body);
  font-size: 0.68rem;
  letter-spacing: 0.5px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform: translateY(-50%) translateX(4px);
}

.dot:hover .dot-tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

/* ===== VARIANT DARK (fundos escuros / foto) ===== */
.dots-nav--dark .dot {
  border-color: rgba(255, 255, 255, 0.35);
}

.dots-nav--dark .dot--active {
  background: var(--ice-blue);
  border-color: var(--ice-blue);
}

.dots-nav--dark .dot:hover:not(.dot--active) {
  border-color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.15);
}

.dots-nav--dark .dot-tooltip {
  background: rgba(42, 24, 18, 0.75);
  color: var(--white);
  backdrop-filter: blur(6px);
}

/* ===== VARIANT LIGHT (Gifts — header navy, body pearl) ===== */
.dots-nav--light .dot {
  border-color: rgba(74, 42, 28, 0.25);
}

.dots-nav--light .dot--active {
  background: var(--navy-dark);
  border-color: var(--navy-dark);
  box-shadow: 0 0 0 3px rgba(74, 42, 28, 0.12);
}

.dots-nav--light .dot:hover:not(.dot--active) {
  border-color: var(--navy-mid);
  background: rgba(74, 42, 28, 0.1);
}

.dots-nav--light .dot-tooltip {
  background: var(--white);
  color: var(--navy-dark);
  box-shadow: var(--shadow-sm);
}

/* ===== MOBILE ===== */
@media (max-width: 480px) {
  .dots-nav {
    right: 8px;
    gap: 9px;
  }

  .dot {
    width: 5px;
    height: 5px;
  }

  .dot-tooltip {
    display: none;
  }
}
</style>
