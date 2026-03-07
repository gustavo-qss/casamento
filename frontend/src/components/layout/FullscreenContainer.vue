<template>
  <div class="fullscreen-container" :class="containerClass">
    <div
      v-if="backgroundImage"
      class="background-image"
      :class="{ bouncing: enableBouncing }"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    ></div>
    <div v-if="showOverlay" class="overlay" :class="overlayClass"></div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  backgroundImage: {
    type: String,
    default: null,
  },
  showOverlay: {
    type: Boolean,
    default: true,
  },
  overlayClass: {
    type: String,
    default: 'overlay-dark',
  },
  enableBouncing: {
    type: Boolean,
    default: false,
  },
  containerClass: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.fullscreen-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(3px);
  transform: scale(1.05);
}

.background-image.bouncing {
  animation: bouncing 6s ease-in-out infinite;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: var(--z-base);
  pointer-events: none;
}

.overlay-gradient {
  background: var(--gradient-overlay);
}

.overlay-dark {
  background: var(--gradient-overlay-dark);
}

.content {
  position: relative;
  z-index: var(--z-overlay);
  width: 100%;
  max-width: 1200px;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

@media (max-width: 768px) {
  .content {
    padding: var(--spacing-sm);
  }
}
</style>
