<template>
  <FullscreenContainer
    :background-image="churchImage"
    :show-overlay="true"
    overlay-class="overlay-gradient"
  >
    <LocationCard
      icon="church"
      title="Cerimônia"
      :location="weddingInfo.church.location"
      :time="weddingInfo.church.time"
      :address="weddingInfo.church.address"
      :maps-link="weddingInfo.church.mapsLink"
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

// Imagem da igreja da pasta public
const churchImage = '/local-1.jpg';

const emit = defineEmits(['next']);

const scrollToNext = () => {
  emit('next');
};
</script>

<style scoped>
/* Estilos específicos da tela de igreja, se necessário */
</style>
