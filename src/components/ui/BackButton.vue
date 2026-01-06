<template>
  <button @click="handleClick" class="back-button" aria-label="Voltar">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 12H5M5 12L12 19M5 12L12 5"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>

<style scoped>
.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1500;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid var(--primary-lavender);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--lavender-dark);
  transition: all var(--transition-normal);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-out;
}

.back-button:hover {
  background: var(--primary-lavender);
  color: var(--white);
  transform: translateX(-5px) scale(1.1);
  box-shadow: 0 6px 16px rgba(177, 185, 231, 0.4);
}

.back-button:active {
  transform: translateX(-3px) scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .back-button {
    top: 15px;
    left: 15px;
    width: 40px;
    height: 40px;
  }

  .back-button svg {
    width: 20px;
    height: 20px;
  }
}
</style>
