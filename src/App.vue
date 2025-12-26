<script setup>
import { ref } from 'vue';
import HeroScreen from '@/components/screens/HeroScreen.vue';
import StoriesScreen from '@/components/screens/StoriesScreen.vue';
import ChurchScreen from '@/components/screens/ChurchScreen.vue';
import ReceptionScreen from '@/components/screens/ReceptionScreen.vue';

const currentScreen = ref(1);

const handleScrollNext = () => {
  if (currentScreen.value < 4) {
    currentScreen.value++;
  }
};

const handleStoriesComplete = () => {
  console.log('Stories completos! Navegando para tela da igreja...');
  currentScreen.value = 3;
};
</script>

<template>
  <div class="app-container">
    <Transition name="slide-up">
      <HeroScreen v-if="currentScreen === 1" @scroll-next="handleScrollNext" />
      <StoriesScreen v-else-if="currentScreen === 2" @complete="handleStoriesComplete" />
      <ChurchScreen v-else-if="currentScreen === 3" @next="handleScrollNext" />
      <ReceptionScreen v-else-if="currentScreen === 4" @next="handleScrollNext" />
    </Transition>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Transição Slide Up */
.slide-up-enter-active {
  animation: slideUpIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-up-leave-active {
  animation: slideUpOut 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideUpIn {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideUpOut {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-100%);
  }
}

/* Garantir que as telas fiquem em posição absoluta para transição */
.slide-up-enter-active,
.slide-up-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}
</style>
