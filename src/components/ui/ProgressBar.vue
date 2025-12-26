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
.progress-bar-container {
  position: relative;
  height: 3px;
  flex: 1;
  overflow: hidden;
  border-radius: var(--radius-full);
}

.progress-bar-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
}

.progress-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--white);
  border-radius: var(--radius-full);
  transition: width 0.05s linear;
}

.progress-bar-fill.completed {
  width: 100%;
  transition: none;
}

@media (max-width: 768px) {
  .progress-bar-container {
    height: 2px;
  }
}
</style>
