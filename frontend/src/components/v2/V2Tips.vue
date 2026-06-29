<template>
  <section class="tips" ref="root">
    <div class="tips-head">
      <h2 class="tips-title reveal reveal-fade">Dicas para os convidados</h2>
      <p class="tips-sub reveal reveal-delay-1">
        Pequenos combinados para que esse dia seja perfeito para todos nós.
      </p>
    </div>

    <div class="tips-grid">
      <div
        v-for="(t, i) in tips"
        :key="i"
        class="plaque reveal reveal-scale"
        :class="`reveal-delay-${(i % 4) + 1}`"
      >
        <span class="plaque-emoji">{{ t.emoji }}</span>
        <p class="plaque-text">{{ t.text }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

const root = ref(null);
useScrollReveal(root);

const tips = [
  { emoji: '📷', text: 'Não atrapalhe os fotógrafos durante a cerimônia.' },
  { emoji: '🤍', text: 'Evite roupas brancas.' },
  { emoji: '🧡', text: 'Evite roupas na cor terracota.' },
  { emoji: '💒', text: 'Chegue com antecedência.' },
  { emoji: '🥂', text: 'Aproveite cada momento da festa.' },
  { emoji: '👋', text: 'Não vá embora sem se despedir dos noivos.' },
  { emoji: '📱', text: 'Mantenha o celular no silencioso durante a cerimônia.' },
];
</script>

<style scoped>
.tips {
  background:
    var(--tex-paper) repeat,
    var(--v2-bg);
  background-size: 240px, auto;
  padding: clamp(4rem, 11vw, 7rem) var(--spacing-lg);
}

.tips-head {
  text-align: center;
  max-width: 620px;
  margin: 0 auto clamp(2.5rem, 6vw, 3.5rem);
}
.tips-title {
  font-family: var(--v2-script);
  font-size: clamp(2.4rem, 7.5vw, 3.8rem);
  color: var(--v2-terracotta);
  margin: 0 0 0.5rem;
  line-height: 1;
}
.tips-sub {
  font-family: var(--v2-serif);
  font-size: clamp(1rem, 2.6vw, 1.15rem);
  color: var(--v2-ink);
  margin: 0;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: clamp(1rem, 2.6vw, 1.6rem);
  max-width: 980px;
  margin: 0 auto;
}

/* Placa de madeira */
.plaque {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: clamp(1.1rem, 3vw, 1.5rem) clamp(1.2rem, 3vw, 1.6rem);
  border-radius: var(--radius-md);
  background-color: #3a2412;
  background-image:
    linear-gradient(180deg, rgba(227, 169, 76, 0.1), rgba(0, 0, 0, 0.34)),
    var(--tex-grain) repeat,
    var(--tex-wood) repeat;
  background-size: auto, 150px, 200px;
  box-shadow:
    inset 0 0 0 2px rgba(0, 0, 0, 0.4),
    inset 0 2px 8px rgba(0, 0, 0, 0.4),
    0 10px 24px rgba(36, 20, 8, 0.32);
}
/* furo de corda no topo (placa pendurada) */
.plaque::before {
  content: "";
  position: absolute;
  top: 8px;
  left: 12px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1c0f06;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.8);
}

.plaque-emoji {
  font-size: 1.7rem;
  line-height: 1;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.plaque-text {
  font-family: var(--v2-serif);
  font-size: clamp(0.95rem, 2.3vw, 1.05rem);
  line-height: 1.45;
  color: #f3e8d2;
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}
</style>
