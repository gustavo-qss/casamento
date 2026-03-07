<template>
  <div class="scroll-arrow" @click="$emit('click')">
    <svg
      class="arrow-icon float"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5V19M12 19L5 12M12 19L19 12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<script setup>
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
  color: var(--white);
  transition: all var(--transition-normal);
}

.scroll-arrow:hover {
  color: var(--primary-lavender);
  transform: translateX(-50%) scale(1.2);
}

.arrow-icon {
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

.float {
  animation: float 2s ease-in-out infinite;
}

@media (max-width: 768px) {
  .scroll-arrow {
    bottom: var(--spacing-md);
  }

  .arrow-icon {
    width: 32px;
    height: 32px;
  }
}
</style>
