<template>
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
    <ScrollArrow @click="scrollToNext" />
  </FullscreenContainer>
</template>

<script setup>
import { defineEmits } from 'vue';
import FullscreenContainer from '../layout/FullscreenContainer.vue';
import LocationCard from '../ui/LocationCard.vue';
import ScrollArrow from '../ui/ScrollArrow.vue';
import weddingInfo from '@/data/wedding-info.json';

// Imagem da recepção da pasta public
const receptionImage = '/local-2.jpg';

const emit = defineEmits(['next']);

const scrollToNext = () => {
  emit('next');
};
</script>

<style scoped>
/* Estilos específicos da tela de recepção, se necessário */
</style>
