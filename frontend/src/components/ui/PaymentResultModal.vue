<template>
  <div class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <div v-if="status === 'success'" class="result-icon success-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#27ae60" />
          <path d="M7 12.5L10.5 16L17 9" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div v-else-if="status === 'failure'" class="result-icon failure-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#e74c3c" />
          <path d="M8 8L16 16M16 8L8 16" stroke="white" stroke-width="2.2" stroke-linecap="round" />
        </svg>
      </div>
      <div v-else class="result-icon pending-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#f39c12" />
          <path d="M12 7V12L15 15" stroke="white" stroke-width="2.2" stroke-linecap="round" />
        </svg>
      </div>

      <h2 class="result-title">{{ title }}</h2>
      <p class="result-message">{{ message }}</p>

      <button class="btn-close-result" @click="handleClose">Fechar</button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true, // 'success' | 'failure' | 'pending'
  },
});

const emit = defineEmits(['close']);

const title = computed(() => {
  if (props.status === 'success') return 'Presente confirmado!';
  if (props.status === 'failure') return 'Pagamento não concluído';
  return 'Pagamento em análise';
});

const message = computed(() => {
  if (props.status === 'success')
    return 'Obrigado pelo carinho! Seu presente foi registrado e significa muito para nós. ❤️';
  if (props.status === 'failure')
    return 'O pagamento não foi processado. Você pode tentar novamente na lista de presentes.';
  return 'Seu pagamento está sendo processado. Você receberá a confirmação em breve.';
});

const handleClose = () => emit('close');
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
  to   { opacity: 1; }
}

.modal-content {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: slideUp 0.3s ease-out;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

@keyframes slideUp {
  from { transform: translateY(40px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.result-icon {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-md);
  animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes popIn {
  from { transform: scale(0); }
  to   { transform: scale(1); }
}

.result-title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: var(--lavender-dark);
  margin: 0 0 var(--spacing-sm) 0;
}

.result-message {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--blue-dark);
  line-height: 1.6;
  margin: 0 0 var(--spacing-xl) 0;
}

.btn-close-result {
  background: var(--gradient-main);
  color: var(--white);
  border: none;
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-close-result:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-soft);
}
</style>
