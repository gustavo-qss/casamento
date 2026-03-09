<template>
  <div class="gift-card">
    <div class="gift-image-wrapper">
      <img :src="gift.image" :alt="gift.name" class="gift-image" loading="lazy" />
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
        >−</button>

        <span v-if="quantity > 0" class="quantity-display">{{ quantity }}</span>

        <button
          @click="handleAdd"
          class="btn-quantity btn-add"
          :class="{ 'btn-add--has-qty': quantity > 0 }"
          :aria-label="quantity > 0 ? 'Adicionar mais' : 'Adicionar ao carrinho'"
        >+</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  gift: { type: Object, required: true },
  quantity: { type: Number, default: 0 },
});

const emit = defineEmits(['add', 'remove']);

const handleAdd = () => emit('add', props.gift);
const handleRemove = () => emit('remove', props.gift.id);

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
</script>

<style scoped>
.gift-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(13, 31, 60, 0.06);
}

.gift-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 36px rgba(13, 31, 60, 0.14);
}

/* ===== IMAGEM ===== */
.gift-image-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--pale-blue);
}

.gift-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gift-card:hover .gift-image {
  transform: scale(1.05);
}

/* ===== CONTEÚDO ===== */
.gift-content {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
}

.gift-name {
  font-family: var(--font-body);
  font-size: clamp(0.85rem, 1.8vw, 0.95rem);
  font-weight: 600;
  color: var(--navy-dark);
  margin: 0;
  line-height: 1.4;
}

.gift-price {
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.5vw, 1.35rem);
  font-weight: 400;
  color: var(--navy-accent);
  margin: 0;
  letter-spacing: -0.2px;
}

/* ===== AÇÕES ===== */
.gift-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.btn-quantity {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 1.3rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.btn-add {
  background: var(--navy-dark);
  color: var(--white);
  border: none;
}

.btn-add:hover {
  background: var(--navy-light);
  transform: scale(1.08);
  box-shadow: 0 4px 14px rgba(13, 31, 60, 0.3);
}

.btn-add--has-qty {
  background: var(--navy-mid);
}

.btn-remove {
  background: transparent;
  border: 1.5px solid rgba(220, 53, 69, 0.4);
  color: #dc3545;
}

.btn-remove:hover {
  background: rgba(220, 53, 69, 0.08);
  border-color: #dc3545;
  transform: scale(1.08);
}

.btn-quantity:active {
  transform: scale(0.95);
}

.quantity-display {
  font-family: var(--font-display);
  font-size: var(--text-subtitle);
  font-weight: 400;
  color: var(--navy-dark);
  min-width: 28px;
  text-align: center;
}

@media (max-width: 768px) {
  .gift-image-wrapper {
    height: 175px;
  }

  .gift-content {
    padding: var(--spacing-sm);
  }

  .btn-quantity {
    width: 34px;
    height: 34px;
    font-size: 1.1rem;
  }
}
</style>
