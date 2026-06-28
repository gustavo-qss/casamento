<script setup>
import { ref, onMounted } from 'vue';

import HeroSection         from '@/components/sections/HeroSection.vue';
import VerseSection        from '@/components/sections/VerseSection.vue';
import GallerySection      from '@/components/sections/GallerySection.vue';
import CountdownSection    from '@/components/sections/CountdownSection.vue';
import CeremonySection     from '@/components/sections/CeremonySection.vue';
import EventSection        from '@/components/sections/EventSection.vue';
import ConfirmacaoSection  from '@/components/sections/ConfirmacaoSection.vue';
import ProgramSection      from '@/components/sections/ProgramSection.vue';
import DressCodeSection    from '@/components/sections/DressCodeSection.vue';
import MessageSection      from '@/components/sections/MessageSection.vue';
import GiftsSection        from '@/components/sections/GiftsSection.vue';
import OrientationsSection from '@/components/sections/OrientationsSection.vue';
import ClosingSection      from '@/components/sections/ClosingSection.vue';

import GiftsScreen         from '@/components/screens/GiftsScreen.vue';
import RSVPScreen          from '@/components/screens/RSVPScreen.vue';

const showGifts = ref(false);
const showRSVP  = ref(false);

function openGifts() {
  showGifts.value = true;
  window.scrollTo(0, 0);
}
function closeGifts() { showGifts.value = false; }

function openRSVP() {
  showRSVP.value = true;
}
function closeRSVP() {
  showRSVP.value = false;
  window.history.replaceState({}, '', window.location.pathname);
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search);

  // Retorno do Mercado Pago
  const payment = params.get('payment');
  if (payment === 'success' || payment === 'failure' || payment === 'pending') {
    window.history.replaceState({}, '', window.location.pathname);
  }

  // QR code de confirmação de presença
  if (params.get('rsvp') === 'true') {
    showRSVP.value = true;
    window.history.replaceState({}, '', window.location.pathname);
  }

  // QR code de lista de presentes
  if (params.get('gifts') === 'true') {
    showGifts.value = true;
    window.history.replaceState({}, '', window.location.pathname);
  }
});
</script>

<template>
  <!-- RSVP como overlay (z-index 210, acima de tudo) -->
  <Transition name="rsvp-appear">
    <RSVPScreen v-if="showRSVP" @close="closeRSVP" />
  </Transition>

  <!-- Lista de presentes como overlay fullscreen -->
  <Transition name="gifts-slide">
    <div v-if="showGifts" class="gifts-overlay">
      <GiftsScreen @back="closeGifts" />
    </div>
  </Transition>

  <!-- Site principal com scroll -->
  <main v-show="!showGifts" class="site">
    <HeroSection />
    <VerseSection />
    <GallerySection />
    <CeremonySection />
    <EventSection />
    <ConfirmacaoSection @open-rsvp="openRSVP" />
    <CountdownSection />
    <ProgramSection />
    <DressCodeSection />
    <MessageSection />
    <GiftsSection @open-gifts="openGifts" />
    <OrientationsSection />
    <ClosingSection />
  </main>
</template>

<style scoped>
.site {
  width: 100%;
  min-height: 100vh;
}

/* Overlay da lista de presentes */
.gifts-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  overflow-y: auto;
  background: var(--parchment-bg);
}

/* Transição presentes */
.gifts-slide-enter-active,
.gifts-slide-leave-active {
  transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.3s ease;
}
.gifts-slide-enter-from,
.gifts-slide-leave-to  { transform: translateY(100%); opacity: 0; }
.gifts-slide-enter-to,
.gifts-slide-leave-from { transform: translateY(0); opacity: 1; }

/* Transição RSVP */
.rsvp-appear-enter-active,
.rsvp-appear-leave-active {
  transition: opacity 0.3s ease;
}
.rsvp-appear-enter-from,
.rsvp-appear-leave-to { opacity: 0; }
</style>
