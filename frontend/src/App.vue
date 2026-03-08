<script setup>
import { ref, onMounted } from 'vue';
import HeroScreen from '@/components/screens/HeroScreen.vue';
import StoriesScreen from '@/components/screens/StoriesScreen.vue';
import ChurchScreen from '@/components/screens/ChurchScreen.vue';
import ReceptionScreen from '@/components/screens/ReceptionScreen.vue';
import CountdownScreen from '@/components/screens/CountdownScreen.vue';
import GiftsScreen from '@/components/screens/GiftsScreen.vue';
import PaymentResultModal from '@/components/ui/PaymentResultModal.vue';
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
    currentScreen.value = 6;
  }
});

const handleScrollNext = () => {
  if (currentScreen.value < 6) {
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
  currentScreen.value = 3;
};

const handleClosePaymentResult = () => {
  paymentResult.value = null;
};
</script>

<template>
  <div class="app-container">
    <Transition :name="isGoingBack ? 'slide-down' : 'slide-up'">
      <HeroScreen v-if="currentScreen === 1" @scroll-next="handleScrollNext" />
      <StoriesScreen v-else-if="currentScreen === 2" @complete="handleStoriesComplete" @back="handleGoBack" />
      <ChurchScreen v-else-if="currentScreen === 3" @next="handleScrollNext" @back="handleGoBack" />
      <ReceptionScreen v-else-if="currentScreen === 4" @next="handleScrollNext" @back="handleGoBack" />
      <CountdownScreen v-else-if="currentScreen === 5" @next="handleScrollNext" @back="handleGoBack" />
      <GiftsScreen v-else-if="currentScreen === 6" key="gifts" @back="handleGoBack" />
    </Transition>

    <PaymentResultModal
      v-if="paymentResult"
      :status="paymentResult"
      @close="handleClosePaymentResult"
    />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Transição Slide Up (para frente) */
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

/* Transição Slide Down (para trás) */
.slide-down-enter-active {
  animation: slideDownIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-down-leave-active {
  animation: slideDownOut 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideDownIn {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideDownOut {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

/* Garantir que as telas fiquem em posição absoluta para transição */
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
</style>
