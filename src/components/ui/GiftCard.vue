<template>
  <div class="gift-card">
    <div class="gift-image-wrapper">
      <img :src="gift.image" :alt="gift.name" class="gift-image" />
    </div>
    <div class="gift-content">
      <h3 class="gift-name">{{ gift.name }}</h3>
      <p class="gift-price">{{ formatCurrency(gift.price) }}</p>

      <div class="gift-actions">
        <button
          v-if="quantity > 0"
          @click="handleRemove"
          class="btn-quantity btn-remove"
          aria-label="Remover"
        >
          -
        </button>

        <span v-if="quantity > 0" class="quantity-display">{{ quantity }}</span>

        <button
          @click="handleAdd"
          class="btn-quantity btn-add"
          :aria-label="quantity > 0 ? 'Adicionar mais' : 'Adicionar ao carrinho'"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  gift: {
    type: Object,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['add', 'remove']);

const handleAdd = () => {
  emit('add', props.gift);
};

const handleRemove = () => {
  emit('remove', props.gift.id);
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
</script>

<style scoped>
.gift-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.gift-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.gift-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--gray-light);
}

.gift-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.gift-card:hover .gift-image {
  transform: scale(1.05);
}

.gift-content {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
}

.gift-name {
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
  line-height: 1.4;
}

.gift-price {
  font-family: var(--font-display);
  font-size: var(--text-subtitle);
  font-weight: 700;
  color: var(--gold);
  margin: 0;
}

.gift-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.btn-quantity {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
}

.btn-add {
  background: linear-gradient(135deg, var(--primary-lavender), var(--primary-blue));
}

.btn-add:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(177, 185, 231, 0.5);
}

.btn-remove {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.btn-remove:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.5);
}

.btn-quantity:active {
  transform: scale(0.95);
}

.quantity-display {
  font-family: var(--font-display);
  font-size: var(--text-subtitle);
  font-weight: 700;
  color: var(--lavender-dark);
  min-width: 30px;
  text-align: center;
}

@media (max-width: 768px) {
  .gift-image-wrapper {
    height: 180px;
  }

  .gift-content {
    padding: var(--spacing-sm);
  }

  .btn-quantity {
    width: 36px;
    height: 36px;
    font-size: 1.25rem;
  }
}
</style>
