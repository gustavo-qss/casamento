<template>
  <div class="shopping-cart">
    <div class="cart-header">
      <div class="cart-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9 2L7 6M17 2L19 6M3 6H21L19 20H5L3 6ZM10 10V14M14 10V14"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="cart-badge">{{ itemCount }}</span>
      </div>
      <div class="cart-info">
        <span class="cart-label">Carrinho</span>
        <span class="cart-total">{{ formatCurrency(total) }}</span>
      </div>
    </div>

    <button @click="handleCheckout" class="btn-checkout">
      Finalizar Compra
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  itemCount: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['checkout']);

const handleCheckout = () => {
  emit('checkout');
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
</script>

<style scoped>
.shopping-cart {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy-light) 100%);
  padding: var(--spacing-md);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  animation: slideUpCart 0.3s ease-out;
}

@keyframes slideUpCart {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.cart-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.cart-icon {
  position: relative;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--gold);
  color: var(--white);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.cart-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cart-label {
  font-family: var(--font-body);
  font-size: var(--text-small);
  color: var(--white);
  font-weight: 500;
}

.cart-total {
  font-family: var(--font-display);
  font-size: var(--text-subtitle);
  font-weight: 700;
  color: var(--white);
}

.btn-checkout {
  background: var(--white);
  color: var(--navy-dark);
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.btn-checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-checkout:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .shopping-cart {
    padding: var(--spacing-sm);
  }

  .cart-total {
    font-size: 1rem;
  }

  .btn-checkout {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: 0.9rem;
  }
}
</style>
