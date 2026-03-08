<template>
  <div class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <button class="btn-close" @click="handleClose" aria-label="Fechar" :disabled="isLoading">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>

      <div class="modal-header">
        <h2 class="modal-title">Confirmar Presente</h2>
        <p class="modal-subtitle">Revise os itens antes de pagar</p>
      </div>

      <ul class="items-list">
        <li v-for="item in items" :key="item.giftId" class="item-row">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-qty">x{{ item.quantity }}</span>
          <span class="item-price">{{ formatCurrency(item.price * item.quantity) }}</span>
        </li>
      </ul>

      <div class="total-row">
        <span class="total-label">Total</span>
        <span class="total-value">{{ formatCurrency(total) }}</span>
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <button class="btn-mp" @click="handlePay" :disabled="isLoading">
        <span v-if="isLoading" class="loading-text">
          <span class="spinner"></span>
          Redirecionando...
        </span>
        <span v-else class="pay-text">
          Pagar com Mercado Pago
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { usePayment } from '@/composables/usePayment';
import { useCart } from '@/composables/useCart';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['close']);

const { startCheckout, isLoading, error } = usePayment();
const { clearCart } = useCart();

const handleClose = () => {
  if (!isLoading.value) emit('close');
};

const handlePay = async () => {
  clearCart();
  await startCheckout(props.items);
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-md);
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  max-width: 480px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease-out;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

@keyframes slideUp {
  from { transform: translateY(40px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.btn-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: transparent;
  border: none;
  color: var(--blue-dark);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast);
}

.btn-close:hover:not(:disabled) {
  background: var(--gray-light);
}

.btn-close:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.modal-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.modal-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: var(--lavender-dark);
  margin: 0 0 var(--spacing-xs) 0;
}

.modal-subtitle {
  font-family: var(--font-body);
  font-size: var(--text-small);
  color: var(--blue-dark);
  margin: 0;
}

.items-list {
  list-style: none;
  margin: 0 0 var(--spacing-md) 0;
  padding: 0;
  border: 1px solid var(--gray-light);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.item-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--gray-light);
  font-family: var(--font-body);
  font-size: var(--text-small);
}

.item-row:last-child {
  border-bottom: none;
}

.item-name {
  flex: 1;
  color: var(--text-dark);
}

.item-qty {
  color: var(--blue-dark);
  font-weight: 500;
  white-space: nowrap;
}

.item-price {
  color: var(--lavender-dark);
  font-weight: 600;
  white-space: nowrap;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--gradient-main);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
}

.total-label {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--white);
  font-weight: 500;
}

.total-value {
  font-family: var(--font-display);
  font-size: var(--text-subtitle);
  font-weight: 700;
  color: var(--white);
}

.error-msg {
  font-family: var(--font-body);
  font-size: var(--text-small);
  color: #c0392b;
  text-align: center;
  margin: 0 0 var(--spacing-md) 0;
  padding: var(--spacing-sm);
  background: #fdecea;
  border-radius: var(--radius-sm);
}

.btn-mp {
  width: 100%;
  background: #009ee3;
  color: var(--white);
  border: none;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  min-height: 52px;
}

.btn-mp:hover:not(:disabled) {
  background: #0081c8;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 158, 227, 0.4);
}

.btn-mp:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: var(--white);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .modal-content {
    padding: var(--spacing-lg);
  }
}
</style>
