<template>
  <div class="reception-screen">
    <BackButton @click="handleBack" />
    <FullscreenContainer
      :background-image="receptionImage"
      :show-overlay="true"
      overlay-class="overlay-gradient"
    >
      <LocationCard
        icon="party"
        title="Recepção"
        :location="weddingInfo.reception.location"
        :time="weddingInfo.reception.time"
        :address="weddingInfo.reception.address"
        :maps-link="weddingInfo.reception.mapsLink"
      />
    </FullscreenContainer>
    <div class="scroll-arrow-wrapper">
      <ScrollArrow @click="scrollToNext" />
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';
import FullscreenContainer from '../layout/FullscreenContainer.vue';
import LocationCard from '../ui/LocationCard.vue';
import ScrollArrow from '../ui/ScrollArrow.vue';
import BackButton from '../ui/BackButton.vue';
import weddingInfo from '@/data/wedding-info.json';

// Imagem da recepção da pasta public
const receptionImage = '/local-2.jpg';

const emit = defineEmits(['next', 'back']);

const scrollToNext = () => {
  emit('next');
};

const handleBack = () => {
  emit('back');
};
</script>

<style scoped>
.reception-screen {
  position: relative;
  width: 100%;
  height: 100vh;
}

.scroll-arrow-wrapper {
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 1000;
  pointer-events: none;
}

.scroll-arrow-wrapper :deep(.scroll-arrow) {
  position: static;
  transform: none;
  pointer-events: auto;
}

.scroll-arrow-wrapper :deep(.scroll-arrow:hover) {
  transform: scale(1.2);
}
</style>
