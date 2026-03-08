<template>
  <div class="gifts-screen">
    <BackButton @click="handleBack" />
    <div class="gifts-header">
      <h2 class="gifts-title">Lista de Presentes</h2>
      <p class="gifts-subtitle">Escolha um presente para nos dar de casamento</p>
    </div>

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

    <ShoppingCart
      v-if="itemCount > 0"
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
import { ref, defineEmits } from 'vue';
import GiftCard from '../ui/GiftCard.vue';
import ShoppingCart from '../ui/ShoppingCart.vue';
import CheckoutModal from '../ui/CheckoutModal.vue';
import BackButton from '../ui/BackButton.vue';
import { useCart } from '@/composables/useCart';
import giftsData from '@/data/gifts.json';

const emit = defineEmits(['back']);

const gifts = ref(giftsData);
const showCheckout = ref(false);

const { items, itemCount, total, addItem, removeItem, getQuantity } = useCart();

const handleAddGift = (gift) => {
  addItem(gift);
};

const handleRemoveGift = (giftId) => {
  removeItem(giftId);
};

const handleCheckout = () => {
  showCheckout.value = true;
};

const handleCloseModal = () => {
  showCheckout.value = false;
};

const handleBack = () => {
  emit('back');
};
</script>

<style scoped>
.gifts-screen {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, var(--cream) 0%, var(--gray-light) 100%);
  padding: var(--spacing-xl) var(--spacing-md);
  padding-bottom: 120px; /* Espaço para o carrinho flutuante */
}

.gifts-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  animation: fadeIn 0.8s ease-out;
}

.gifts-title {
  font-family: var(--font-display);
  font-size: var(--text-title);
  color: var(--lavender-dark);
  margin: 0 0 var(--spacing-sm) 0;
}

.gifts-subtitle {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--blue-dark);
  margin: 0;
}

.gifts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 1s ease-out 0.2s backwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tablet: 2 colunas */
@media (max-width: 992px) and (min-width: 577px) {
  .gifts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile: 1 coluna */
@media (max-width: 576px) {
  .gifts-screen {
    padding: var(--spacing-lg) var(--spacing-sm);
    padding-bottom: 100px;
  }

  .gifts-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .gifts-header {
    margin-bottom: var(--spacing-lg);
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
</style>
