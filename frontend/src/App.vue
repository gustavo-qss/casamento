<script setup>
import { ref, onMounted, computed } from 'vue';
import HeroScreen from '@/components/screens/HeroScreen.vue';
import StoriesScreen from '@/components/screens/StoriesScreen.vue';
import EtiquetteScreen from '@/components/screens/EtiquetteScreen.vue';
import ChurchScreen from '@/components/screens/ChurchScreen.vue';
import ReceptionScreen from '@/components/screens/ReceptionScreen.vue';
import CountdownScreen from '@/components/screens/CountdownScreen.vue';
import GiftsScreen from '@/components/screens/GiftsScreen.vue';
import PaymentResultModal from '@/components/ui/PaymentResultModal.vue';
import ScreenDotsNav from '@/components/ui/ScreenDotsNav.vue';
import { useCartStore } from '@/stores/cart';

const currentScreen = ref(1);
const isGoingBack = ref(false);
const paymentResult = ref(null); // 'success' | 'failure' | 'pending' | null

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const payment = params.get('payment');

  if (payment === 'success' || payment === 'failure' || payment === 'pending') {
    paymentResult.value = payment;

    if (payment === 'success') {
      useCartStore().clearCart();
    }

    // Remove os query params da URL sem recarregar a página
    window.history.replaceState({}, '', window.location.pathname);

    // Navega direto para a tela de presentes ao voltar do MP
    currentScreen.value = 7;
  }
});

const handleScrollNext = () => {
  if (currentScreen.value < 7) {
    isGoingBack.value = false;
    currentScreen.value++;
  }
};

const handleGoBack = () => {
  if (currentScreen.value > 1) {
    isGoingBack.value = true;
    currentScreen.value--;
  }
};

const handleStoriesComplete = () => {
  isGoingBack.value = false;
  currentScreen.value = 3; // EtiquetteScreen
};

const handleClosePaymentResult = () => {
  paymentResult.value = null;
};

// Dots nav: etiquette e gifts têm fundo claro — usam 'light'
const dotsVariant = computed(() =>
  currentScreen.value === 3 || currentScreen.value === 7 ? 'light' : 'dark'
);

const navigateTo = (screen) => {
  if (screen === currentScreen.value) return;
  isGoingBack.value = screen < currentScreen.value;
  currentScreen.value = screen;
};
</script>

<template>
  <div class="app-container">
    <Transition :name="isGoingBack ? 'slide-down' : 'slide-up'">
      <HeroScreen v-if="currentScreen === 1" @scroll-next="handleScrollNext" />
      <StoriesScreen v-else-if="currentScreen === 2" @complete="handleStoriesComplete" @back="handleGoBack" />
      <EtiquetteScreen v-else-if="currentScreen === 3" @next="handleScrollNext" @back="handleGoBack" />
      <ChurchScreen v-else-if="currentScreen === 4" @next="handleScrollNext" @back="handleGoBack" />
      <ReceptionScreen v-else-if="currentScreen === 5" @next="handleScrollNext" @back="handleGoBack" />
      <CountdownScreen v-else-if="currentScreen === 6" @next="handleScrollNext" @back="handleGoBack" />
      <GiftsScreen v-else-if="currentScreen === 7" key="gifts" @back="handleGoBack" />
    </Transition>

    <!-- Navegação por dots — oculta na tela de stories -->
    <ScreenDotsNav
      v-show="currentScreen !== 2"
      :current="currentScreen"
      :total="7"
      :variant="dotsVariant"
      @navigate="navigateTo"
    />

    <PaymentResultModal
      v-if="paymentResult"
      :status="paymentResult"
      @close="handleClosePaymentResult"
    />

    <!-- Grain overlay global -->
    <div class="grain-overlay" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* ===== TRANSIÇÃO: CROSSFADE + SCALE SUAVE ===== */

/* Garantir posicionamento correto durante transição */
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
}

/* Avançar */
.slide-up-enter-active {
  animation: screenEnterUp var(--transition-screen) forwards;
}
.slide-up-leave-active {
  animation: screenLeaveUp var(--transition-screen-leave) forwards;
}

@keyframes screenEnterUp {
  from {
    opacity: 0;
    transform: translateY(6vh) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes screenLeaveUp {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-4vh) scale(1.01);
  }
}

/* Voltar */
.slide-down-enter-active {
  animation: screenEnterDown var(--transition-screen) forwards;
}
.slide-down-leave-active {
  animation: screenLeaveDown var(--transition-screen-leave) forwards;
}

@keyframes screenEnterDown {
  from {
    opacity: 0;
    transform: translateY(-6vh) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes screenLeaveDown {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(4vh) scale(1.01);
  }
}

/* ===== GRAIN OVERLAY ===== */
.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 300px;
}
</style>
