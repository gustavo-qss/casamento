<template>
  <div class="progress-bar-container">
    <div class="progress-bar-bg"></div>
    <div
      class="progress-bar-fill"
      :class="{ active: active, completed: completed }"
      :style="{ width: progressWidth }"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 0,
  },
});

const progressWidth = computed(() => {
  if (props.completed) return '100%';
  if (props.active) return `${props.progress}%`;
  return '0%';
});
</script>

<style scoped>
/* Trilho de madeira/ferro envelhecido com preenchimento de brasa dourada */
.progress-bar-container {
  position: relative;
  height: 6px;
  flex: 1;
  overflow: hidden;
  border-radius: var(--radius-full);
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.6),
    0 1px 0 rgba(227, 169, 76, 0.15);
}

.progress-bar-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.15)),
    #3a2412;
  border: 1px solid rgba(0, 0, 0, 0.45);
  border-radius: var(--radius-full);
}

.progress-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: var(--radius-full);
  background:
    linear-gradient(180deg, #ffd98a 0%, #e3a94c 45%, #b85f35 100%);
  box-shadow:
    0 0 8px rgba(227, 169, 76, 0.8),
    0 0 2px rgba(255, 217, 138, 0.9) inset;
  transition: width 0.05s linear;
}

.progress-bar-fill.completed {
  width: 100%;
  transition: none;
}

@media (max-width: 768px) {
  .progress-bar-container {
    height: 5px;
  }
}
</style>
