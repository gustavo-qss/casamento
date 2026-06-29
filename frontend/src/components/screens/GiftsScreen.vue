<template>
  <div class="gifts-screen">
    <BackButton @click="handleBack" />

    <!-- Header navy -->
    <header class="gifts-header">
      <div class="gifts-header-inner fade-in-up">
        <p class="gifts-eyebrow">Para nos presentear</p>
        <h2 class="gifts-title">Lista de<br /><em>Presentes</em></h2>
        <p class="gifts-subtitle">Escolha com carinho o que nos levar para casa</p>
      </div>
    </header>

    <!-- Grid de presentes -->
    <div class="gifts-body">
      <div class="gifts-grid">
        <GiftCard
          v-for="gift in gifts"
          :key="gift.id"
          :gift="gift"
          :quantity="getQuantity(gift.id)"
          @add="handleAddGift"
          @remove="handleRemoveGift"
        />
      </div>

      <div v-if="showNext" class="gifts-next">
        <ScrollArrow @click="handleNext" />
      </div>
    </div>

    <ShoppingCart
      v-if="itemCount > 0 && !showCheckout"
      :item-count="itemCount"
      :total="total"
      @checkout="handleCheckout"
    />

    <CheckoutModal
      v-if="showCheckout"
      :items="items"
      :total="total"
      @close="handleCloseModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import GiftCard from '../ui/GiftCard.vue';
import ShoppingCart from '../ui/ShoppingCart.vue';
import CheckoutModal from '../ui/CheckoutModal.vue';
import BackButton from '../ui/BackButton.vue';
import ScrollArrow from '../ui/ScrollArrow.vue';
import { useCart } from '@/composables/useCart';
import giftsData from '@/data/gifts.json';

defineProps({
  // Quando true, exibe seta para avançar (usado no fluxo stories do /instagram).
  // No site polaroid a tela é um overlay e não deve avançar.
  showNext: { type: Boolean, default: false },
});

const emit = defineEmits(['back', 'next']);

const gifts = ref(giftsData);
const showCheckout = ref(false);

const { items, itemCount, total, addItem, removeItem, getQuantity } = useCart();

const handleAddGift = (gift) => addItem(gift);
const handleRemoveGift = (giftId) => removeItem(giftId);
const handleCheckout = () => { showCheckout.value = true; };
const handleCloseModal = () => { showCheckout.value = false; };
const handleBack = () => emit('back');
const handleNext = () => emit('next');
</script>

<style scoped>
.gifts-screen {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--parchment-bg);
}

/* ===== HEADER NAVY ===== */
.gifts-header {
  background-color: #3a2412;
  background-image:
    linear-gradient(180deg, rgba(227, 169, 76, 0.14), rgba(0, 0, 0, 0.45)),
    var(--tex-grain) repeat,
    var(--tex-wood) repeat;
  background-size: auto, 180px, 240px;
  padding: clamp(80px, 14vh, 140px) var(--spacing-md) clamp(50px, 8vh, 90px);
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow:
    inset 0 -3px 0 var(--wood-deep),
    inset 0 6px 14px rgba(0, 0, 0, 0.35);
}

/* Detalhe: linha de luz no topo do header */
.gifts-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--ice-blue), transparent);
  opacity: 0.5;
}

.gifts-header-inner {
  max-width: 600px;
  margin: 0 auto;
}

.gifts-eyebrow {
  font-family: var(--font-body);
  font-size: clamp(0.65rem, 1.5vw, 0.75rem);
  letter-spacing: 6px;
  text-transform: uppercase;
  color: var(--ice-blue);
  opacity: 0.65;
  margin: 0 0 var(--spacing-sm) 0;
}

.gifts-title {
  font-family: var(--font-fantasy);
  font-size: clamp(1.9rem, 5.2vw, 3.4rem);
  font-weight: 400;
  color: var(--white);
  line-height: 1.05;
  margin: 0 0 var(--spacing-md) 0;
  letter-spacing: -0.3px;
}

.gifts-title em {
  font-style: italic;
  color: var(--ice-blue);
}

.gifts-subtitle {
  font-family: var(--font-body);
  font-size: clamp(0.85rem, 2vw, 1rem);
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
  line-height: 1.6;
}

/* ===== BODY ===== */
.gifts-body {
  padding: var(--spacing-2xl) var(--spacing-md);
  padding-bottom: 140px;
  background: transparent;
}

/* ===== SETA AVANÇAR (fluxo stories) ===== */
.gifts-next {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-2xl);
}

.gifts-next :deep(.scroll-arrow) {
  position: static;
  transform: none;
  color: var(--navy-dark) !important;
}

.gifts-next :deep(.scroll-arrow:hover) {
  color: var(--navy-accent) !important;
  transform: scale(1.2);
}

/* ===== GRID ===== */
.gifts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

/* Tablet: 2 colunas */
@media (max-width: 992px) and (min-width: 577px) {
  .gifts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3-4 colunas */
@media (min-width: 1200px) {
  .gifts-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 993px) and (max-width: 1199px) {
  .gifts-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Mobile: 1 coluna */
@media (max-width: 576px) {
  .gifts-body {
    padding: var(--spacing-xl) var(--spacing-sm);
    padding-bottom: 120px;
  }

  .gifts-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}
</style>
