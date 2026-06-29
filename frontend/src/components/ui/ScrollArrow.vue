<template>
  <div class="scroll-arrow" @click="$emit('click')">
    <span class="arrow-medallion float">
      <Leaf class="arrow-leaf arrow-leaf--l" :size="15" :stroke-width="1.5" />
      <ChevronsDown class="arrow-chevron" :size="26" :stroke-width="2" />
      <Leaf class="arrow-leaf arrow-leaf--r" :size="15" :stroke-width="1.5" />
    </span>
  </div>
</template>

<script setup>
import { Leaf, ChevronsDown } from 'lucide-vue-next';

defineEmits(['click']);
</script>

<style scoped>
.scroll-arrow {
  position: absolute;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-navigation);
  cursor: pointer;
  color: var(--candle);
  transition: transform var(--transition-normal);
}

.scroll-arrow:hover {
  transform: translateX(-50%) scale(1.12);
}

/* Medalhão de madeira com aro de âmbar */
.arrow-medallion {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 8px 10px;
  border-radius: var(--radius-full);
  background:
    radial-gradient(circle at 50% 35%, rgba(227, 169, 76, 0.22), transparent 70%),
    var(--tex-wood) repeat,
    #3a2412;
  background-size: auto, 120px, auto;
  border: 1.5px solid rgba(227, 169, 76, 0.55);
  box-shadow:
    inset 0 1px 0 rgba(227, 169, 76, 0.3),
    inset 0 0 10px rgba(0, 0, 0, 0.5),
    0 0 14px rgba(227, 169, 76, 0.35),
    0 4px 12px rgba(0, 0, 0, 0.45);
}

.arrow-chevron {
  color: var(--candle);
  filter: drop-shadow(0 0 6px rgba(227, 169, 76, 0.7));
}

.arrow-leaf {
  color: #8a9a5b;
  opacity: 0.9;
}
.arrow-leaf--l { transform: rotate(-25deg) scaleX(-1); }
.arrow-leaf--r { transform: rotate(-25deg); }

.float {
  animation: float 2.4s ease-in-out infinite;
}

@media (max-width: 768px) {
  .scroll-arrow {
    bottom: var(--spacing-md);
  }
}
</style>
