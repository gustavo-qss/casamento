<template>
  <div class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <button class="btn-close" @click="handleClose" aria-label="Fechar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div class="modal-header">
        <h2 class="modal-title">Pagamento via PIX</h2>
        <p class="modal-subtitle">Escaneie o QR Code ou copie o código</p>
      </div>

      <div class="qr-code-container">
        <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR Code PIX" width="250" height="250" />
      </div>

      <div class="amount-display">
        <span class="amount-label">Valor Total:</span>
        <span class="amount-value">{{ formatCurrency(amount) }}</span>
      </div>

      <div class="pix-code-section">
        <input
          ref="pixInput"
          type="text"
          :value="pixCode"
          readonly
          class="pix-code-input"
        />
        <button @click="copyToClipboard" class="btn-copy">
          <svg v-if="!copied" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 4H6C4.89543 4 4 4.89543 4 6V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V18M8 4C8 5.10457 8.89543 6 10 6H14C15.1046 6 16 5.10457 16 4M8 4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4M16 4H18C19.1046 4 20 4.89543 20 6V10"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 13L9 17L19 7"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ copied ? 'Copiado!' : 'Copiar Código' }}
        </button>
      </div>

      <p class="modal-instructions">
        Após realizar o pagamento, o presente será considerado como presenteado. Muito obrigado pelo carinho!
      </p>

      <button @click="handleComplete" class="btn-complete">
        Concluir
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import QRCode from 'qrcode';

const props = defineProps({
  pixCode: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['close', 'complete']);

const pixInput = ref(null);
const copied = ref(false);
const qrDataUrl = ref('');

watch(() => props.pixCode, async (code) => {
  if (code) {
    qrDataUrl.value = await QRCode.toDataURL(code, {
      width: 250,
      margin: 2,
      errorCorrectionLevel: 'M',
    });
  }
}, { immediate: true });

const handleClose = () => {
  emit('close');
};

const handleComplete = () => {
  emit('complete');
  emit('close');
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.pixCode);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    // Fallback para navegadores antigos
    pixInput.value.select();
    document.execCommand('copy');
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: var(--spacing-md);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease-out;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all var(--transition-normal);
}

.btn-close:hover {
  background: var(--gray-light);
  transform: rotate(90deg);
}

.modal-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.modal-title {
  font-family: var(--font-display);
  font-size: var(--text-title);
  color: var(--lavender-dark);
  margin: 0 0 var(--spacing-xs) 0;
}

.modal-subtitle {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--blue-dark);
  margin: 0;
}

.qr-code-container {
  display: flex;
  justify-content: center;
  padding: var(--spacing-lg);
  background: var(--gray-light);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
}

.amount-display {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--primary-lavender), var(--primary-blue));
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.amount-label {
  font-family: var(--font-body);
  font-size: var(--text-small);
  color: var(--white);
  font-weight: 500;
}

.amount-value {
  font-family: var(--font-display);
  font-size: var(--text-title);
  font-weight: 700;
  color: var(--white);
}

.pix-code-section {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.pix-code-input {
  flex: 1;
  padding: var(--spacing-sm);
  border: 2px solid var(--primary-lavender);
  border-radius: var(--radius-md);
  font-family: monospace;
  font-size: 0.85rem;
  color: var(--text-dark);
  background: var(--gray-light);
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-copy {
  background: var(--primary-lavender);
  color: var(--white);
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-small);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  white-space: nowrap;
}

.btn-copy:hover {
  background: var(--lavender-dark);
  transform: translateY(-2px);
}

.modal-instructions {
  font-family: var(--font-body);
  font-size: var(--text-small);
  color: var(--blue-dark);
  text-align: center;
  line-height: 1.6;
  margin: 0 0 var(--spacing-lg) 0;
}

.btn-complete {
  width: 100%;
  background: linear-gradient(135deg, var(--gold), #b8860b);
  color: var(--white);
  border: none;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.btn-complete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.5);
}

@media (max-width: 768px) {
  .modal-content {
    padding: var(--spacing-lg);
  }

  .qr-code-container :deep(canvas) {
    max-width: 200px !important;
    height: auto !important;
  }

  .pix-code-section {
    flex-direction: column;
  }

  .btn-copy {
    justify-content: center;
  }
}
</style>
