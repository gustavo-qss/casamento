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

/* ===== DOT BASE (rebite de bronze) ===== */
.dot {
  position: relative;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 1px solid rgba(227, 169, 76, 0.4);
  background: radial-gradient(circle at 35% 30%, #7a5a32, #2c1c0f 80%);
  cursor: pointer;
  padding: 0;
  transition: all 0.35s ease;
  outline: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Área de click maior */
.dot::before {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
}

/* ===== DOT ATIVO (gema de âmbar acesa) ===== */
.dot--active {
  background: radial-gradient(circle at 38% 32%, #ffe6a8, #e3a94c 55%, #b85f35 100%);
  border-color: rgba(255, 230, 168, 0.9);
  box-shadow:
    0 0 0 3px rgba(227, 169, 76, 0.18),
    0 0 10px rgba(227, 169, 76, 0.85);
  transform: scale(1.25);
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

/* ===== HOVER (ambas variantes) ===== */
.dot:hover:not(.dot--active) {
  border-color: rgba(227, 169, 76, 0.8);
  box-shadow: 0 0 8px rgba(227, 169, 76, 0.5);
}

/* Tooltip em pergaminho */
.dot-tooltip {
  background:
    var(--tex-parchment) repeat,
    #ede0c6;
  background-size: 180px;
  color: #3a2113;
  font-family: var(--font-rune);
  border: 1px solid rgba(74, 42, 28, 0.35);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
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
