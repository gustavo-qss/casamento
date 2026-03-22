<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" :class="`mode-${step}`" @click.stop>

      <!-- Fechar (steps 1 e 2 apenas) -->
      <button v-if="step < 3" class="btn-close" @click="handleClose" aria-label="Fechar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Stepper -->
      <div v-if="step < 3" class="stepper">
        <div v-for="n in 3" :key="n" class="stepper-item">
          <div class="stepper-node" :class="{ active: step === n, done: step > n }">
            <svg v-if="step > n" width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span v-else>{{ n }}</span>
          </div>
          <div v-if="n < 3" class="stepper-line" :class="{ done: step > n }"></div>
        </div>
      </div>

      <!-- Conteúdo animado entre steps -->
      <Transition :name="transitionName" mode="out-in">

        <!-- ── STEP 1: Revisão do pedido ── -->
        <div v-if="step === 1" key="1" class="step">
          <div class="step-header">
            <p class="eyebrow">Revise seu pedido</p>
            <h2 class="step-title">Seu Presente</h2>
          </div>

          <ul class="items-list">
            <li v-for="item in items" :key="item.giftId" class="item-row">
              <span class="item-name">{{ item.name }}</span>
              <div class="item-right">
                <span class="item-qty">×{{ item.quantity }}</span>
                <span class="item-price">{{ fmt(item.price * item.quantity) }}</span>
              </div>
            </li>
          </ul>

          <div class="total-block">
            <span class="total-label">Total</span>
            <span class="total-amount">{{ fmt(total) }}</span>
          </div>

          <button class="btn-primary" @click="nextStep">
            Próximo: Deixar mensagem
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- ── STEP 2: Carta ── -->
        <div v-else-if="step === 2" key="2" class="step step-letter">
          <div class="step-header letter-header">
            <span class="ornament">✦</span>
            <h2 class="letter-title">Uma mensagem<br/><em>para nós</em></h2>
            <p class="letter-sub">Guardaremos suas palavras para sempre</p>
          </div>

          <div class="form-fields">
            <div class="field">
              <label class="field-label" for="guest-name">
                Seu nome <span class="req">*</span>
              </label>
              <input
                id="guest-name"
                v-model.trim="guestName"
                class="field-input"
                placeholder="Como você se chama?"
                maxlength="60"
                autocomplete="given-name"
              />
            </div>

            <div class="field">
              <label class="field-label" for="guest-msg">
                Mensagem <span class="optional">(opcional)</span>
              </label>
              <textarea
                id="guest-msg"
                v-model="guestMessage"
                class="field-textarea"
                placeholder="Do fundo do meu coração..."
                maxlength="500"
                rows="3"
              ></textarea>
              <span class="char-count">{{ guestMessage.length }}/500</span>
            </div>
          </div>

          <!-- Preview da carta -->
          <Transition name="preview-in">
            <div v-if="guestName" class="card-preview">
              <div class="card-ribbon">Para Rawane &amp; Gustavo</div>
              <div class="card-body">
                <p class="card-message">{{ guestMessage || '...' }}</p>
                <p class="card-from">
                  Com carinho,
                  <em>{{ guestName }}</em>
                </p>
              </div>
            </div>
          </Transition>

          <div class="letter-actions">
            <button class="btn-back" @click="prevStep">← Voltar</button>
            <div class="letter-ctas">
              <button class="btn-skip" @click="handleFinalize(true)">Pular</button>
              <button
                class="btn-primary"
                :disabled="!guestName"
                @click="handleFinalize(false)"
              >
                Finalizar e Pagar
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          <p v-if="nameHint" class="name-hint">Preencha seu nome para continuar</p>
        </div>

        <!-- ── STEP 3: Carregando / Erro ── -->
        <div v-else key="3" class="step step-loading">
          <template v-if="!error">
            <div class="loader-ring">
              <span class="loader-spinner"></span>
              <span class="loader-heart">♡</span>
            </div>
            <p class="loader-msg">{{ loadingMsg }}</p>
            <p v-if="slowWarning" class="slow-warning">
              Isso pode levar até 30s na primeira vez — nosso servidor está acordando.
            </p>
          </template>

          <template v-else>
            <div class="error-icon">✕</div>
            <p class="error-msg">{{ error }}</p>
            <div class="error-actions">
              <button class="btn-retry" @click="retry">Tentar novamente</button>
              <button class="btn-cancel" @click="handleClose">Cancelar</button>
            </div>
          </template>
        </div>

      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePayment } from '@/composables/usePayment';

const props = defineProps({
  items: { type: Array, required: true },
  total: { type: Number, required: true },
});
const emit = defineEmits(['close']);

const { startCheckout, error, loadingMsg } = usePayment();

const step = ref(1);
const direction = ref('forward');
const guestName = ref('');
const guestMessage = ref('');
const nameHint = ref(false);
const slowWarning = ref(false);
let slowTimer = null;

const transitionName = computed(() =>
  direction.value === 'forward' ? 'slide-left' : 'slide-right'
);

function nextStep() {
  direction.value = 'forward';
  step.value++;
}

function prevStep() {
  direction.value = 'back';
  step.value--;
}

function handleOverlayClick() {
  if (step.value < 3) emit('close');
}

function handleClose() {
  emit('close');
}

async function handleFinalize(skip) {
  if (!skip && !guestName.value) {
    nameHint.value = true;
    return;
  }

  direction.value = 'forward';
  step.value = 3;

  const letterData = (!skip && guestName.value)
    ? { guestName: guestName.value, message: guestMessage.value.trim() }
    : null;

  slowTimer = setTimeout(() => { slowWarning.value = true; }, 8000);
  await startCheckout(props.items, letterData);
  clearTimeout(slowTimer);
  slowWarning.value = false;
}

async function retry() {
  slowWarning.value = false;
  const letterData = guestName.value
    ? { guestName: guestName.value, message: guestMessage.value.trim() }
    : null;
  slowTimer = setTimeout(() => { slowWarning.value = true; }, 8000);
  await startCheckout(props.items, letterData);
  clearTimeout(slowTimer);
  slowWarning.value = false;
}

const fmt = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
</script>

<style scoped>
/* ── Overlay ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 14, 28, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-md);
  animation: fadeIn 0.2s ease-out;
}

/* ── Card ── */
.modal-content {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-2xl);
  max-width: 460px;
  width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 24px 64px rgba(6, 14, 28, 0.4);
  transition: background 0.45s ease;
}

.modal-content.mode-2 { background: var(--cream); }
.modal-content.mode-3 { background: var(--navy-dark); }

/* ── Fechar ── */
.btn-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast), color var(--transition-fast);
  z-index: 2;
}
.btn-close:hover { background: var(--gray-light); color: var(--navy-dark); }

/* ── Stepper ── */
.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}
.stepper-item { display: flex; align-items: center; }

.stepper-node {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid var(--gray-medium);
  background: transparent;
  color: var(--gray-medium);
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s ease;
  flex-shrink: 0;
}
.stepper-node.active {
  border-color: var(--navy-dark);
  background: var(--navy-dark);
  color: var(--white);
}
.stepper-node.done {
  border-color: var(--ice-blue);
  background: var(--ice-blue);
  color: var(--navy-dark);
}

.stepper-line {
  width: 52px;
  height: 1px;
  background: var(--gray-medium);
  opacity: 0.4;
  transition: background 0.4s ease, opacity 0.4s ease;
  flex-shrink: 0;
}
.stepper-line.done { background: var(--ice-blue); opacity: 0.7; }

/* ── Transições entre steps ── */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-left-enter-from  { transform: translateX(28px); opacity: 0; }
.slide-left-leave-to    { transform: translateX(-28px); opacity: 0; }
.slide-right-enter-from { transform: translateX(-28px); opacity: 0; }
.slide-right-leave-to   { transform: translateX(28px); opacity: 0; }

/* ── Header dos steps ── */
.step-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}
.eyebrow {
  font-family: var(--font-body);
  font-size: 0.6rem;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 var(--spacing-xs);
}
.step-title {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 4vw, 1.9rem);
  font-weight: 400;
  color: var(--navy-dark);
  margin: 0;
}

/* ── Lista de itens (step 1) ── */
.items-list {
  list-style: none;
  margin: 0 0 var(--spacing-md);
  padding: 0;
}
.item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  font-family: var(--font-body);
  font-size: var(--text-small);
  gap: var(--spacing-sm);
}
.item-row:last-child { border-bottom: none; }
.item-name { flex: 1; color: var(--text-dark); }
.item-right { display: flex; align-items: center; gap: var(--spacing-sm); flex-shrink: 0; }
.item-qty { color: var(--text-muted); font-size: 0.8rem; font-weight: 500; }
.item-price { color: var(--navy-dark); font-weight: 600; min-width: 76px; text-align: right; }

.total-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--navy-dark);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}
.total-label {
  font-family: var(--font-body);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.5);
}
.total-amount {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: var(--ice-blue);
  font-weight: 400;
}

/* ── Botão primário ── */
.btn-primary {
  width: 100%;
  background: var(--navy-dark);
  color: var(--white);
  border: none;
  padding: 14px var(--spacing-lg);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-small);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  transition: all var(--transition-normal);
  min-height: 50px;
  letter-spacing: 0.3px;
}
.btn-primary:hover:not(:disabled) {
  background: var(--navy-mid);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 31, 60, 0.35);
}
.btn-primary:disabled { opacity: 0.38; cursor: not-allowed; }

/* ── Step 2: Carta ── */
.step-letter { }

.letter-header { margin-bottom: var(--spacing-md); }
.ornament {
  display: block;
  color: var(--gold);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-xs);
  opacity: 0.85;
}
.letter-title {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 4vw, 1.9rem);
  font-weight: 400;
  color: var(--navy-dark);
  line-height: 1.2;
  margin: 0 0 var(--spacing-xs);
}
.letter-title em { font-style: italic; color: var(--navy-light); }
.letter-sub {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

/* ── Campos do formulário ── */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}
.field { position: relative; }
.field-label {
  display: block;
  font-family: var(--font-body);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.req { color: var(--gold); }
.optional { text-transform: none; letter-spacing: 0; font-size: 0.7rem; }

.field-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid rgba(13, 31, 60, 0.2);
  padding: var(--spacing-xs) 0;
  font-family: var(--font-body);
  font-size: var(--text-small);
  color: var(--navy-dark);
  outline: none;
  transition: border-color var(--transition-fast);
  box-sizing: border-box;
}
.field-input:focus { border-bottom-color: var(--navy-dark); }

.field-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.65);
  border: 1.5px solid rgba(13, 31, 60, 0.15);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm);
  font-family: var(--font-body);
  font-size: var(--text-small);
  color: var(--navy-dark);
  outline: none;
  resize: none;
  min-height: 84px;
  transition: border-color var(--transition-fast);
  box-sizing: border-box;
}
.field-textarea:focus { border-color: var(--navy-dark); }

.char-count {
  position: absolute;
  bottom: 6px;
  right: var(--spacing-xs);
  font-family: var(--font-body);
  font-size: 0.6rem;
  color: var(--text-muted);
  opacity: 0.6;
  pointer-events: none;
}

/* ── Preview da carta ── */
.card-preview {
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
  box-shadow: 0 4px 24px rgba(13, 31, 60, 0.12);
}

.preview-in-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.preview-in-leave-active  { transition: all 0.2s ease; }
.preview-in-enter-from { opacity: 0; transform: translateY(10px) scale(0.97); }
.preview-in-leave-to   { opacity: 0; transform: scale(0.97); }

.card-ribbon {
  background: var(--navy-dark);
  color: rgba(197, 223, 245, 0.6);
  font-family: var(--font-body);
  font-size: 0.58rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-align: center;
  padding: 8px var(--spacing-md);
}
.card-body {
  background: var(--cream);
  padding: var(--spacing-md) var(--spacing-lg);
}
.card-message {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-style: italic;
  color: var(--text-dark);
  line-height: 1.65;
  margin: 0 0 var(--spacing-sm);
  opacity: 0.85;
  min-height: 1.65em;
  word-break: break-word;
}
.card-from {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
  text-align: right;
  line-height: 1.6;
}
.card-from em {
  font-family: var(--font-script);
  font-size: 1.35rem;
  font-style: normal;
  color: var(--navy-dark);
  display: block;
  margin-top: 2px;
}

/* ── Ações da carta ── */
.letter-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
.btn-back {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 0.8rem;
  cursor: pointer;
  padding: var(--spacing-xs) 0;
  flex-shrink: 0;
  transition: color var(--transition-fast);
}
.btn-back:hover { color: var(--navy-dark); }

.letter-ctas {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  justify-content: flex-end;
}
.btn-skip {
  background: transparent;
  border: 1px solid rgba(13, 31, 60, 0.2);
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 0.78rem;
  padding: 8px var(--spacing-sm);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  flex-shrink: 0;
}
.btn-skip:hover { border-color: var(--navy-dark); color: var(--navy-dark); }

.letter-ctas .btn-primary { width: auto; flex: 1; }

.name-hint {
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: var(--gold);
  text-align: right;
  margin: var(--spacing-xs) 0 0;
  animation: fadeIn 0.2s ease-out;
}

/* ── Step 3: Loading ── */
.step-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 260px;
  padding: var(--spacing-xl) 0;
  text-align: center;
}

.loader-ring {
  position: relative;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}
.loader-spinner {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(197, 223, 245, 0.15);
  border-top-color: var(--ice-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
.loader-heart {
  font-size: 1.5rem;
  color: var(--ice-blue);
  animation: heartbeat 1.6s ease-in-out infinite;
  line-height: 1;
}

.loader-msg {
  font-family: var(--font-body);
  font-size: 0.8rem;
  letter-spacing: 1.5px;
  color: rgba(197, 223, 245, 0.55);
  text-transform: uppercase;
  margin: 0;
  animation: fadeIn 0.3s ease-out;
}

.slow-warning {
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.35);
  max-width: 280px;
  line-height: 1.65;
  margin-top: var(--spacing-md);
  animation: fadeIn 0.4s ease-out;
}

/* ── Erro ── */
.error-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(231, 76, 60, 0.15);
  color: #e74c3c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}
.error-msg {
  font-family: var(--font-body);
  font-size: var(--text-small);
  color: rgba(197, 223, 245, 0.7);
  margin: 0 0 var(--spacing-lg);
}
.error-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: center;
}
.btn-retry {
  background: var(--ice-blue);
  color: var(--navy-dark);
  border: none;
  padding: 10px var(--spacing-lg);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-small);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 180px;
}
.btn-retry:hover { background: var(--white); transform: translateY(-1px); }
.btn-cancel {
  background: transparent;
  border: none;
  color: rgba(197, 223, 245, 0.4);
  font-family: var(--font-body);
  font-size: 0.78rem;
  cursor: pointer;
  transition: color var(--transition-fast);
}
.btn-cancel:hover { color: rgba(197, 223, 245, 0.7); }

/* ── Keyframes ── */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slideUp {
  from { transform: translateY(40px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes heartbeat {
  0%, 100% { transform: scale(1);    opacity: 0.7; }
  50%       { transform: scale(1.18); opacity: 1;   }
}

/* ── Mobile ── */
@media (max-width: 480px) {
  .modal-content {
    padding: var(--spacing-lg) var(--spacing-md) var(--spacing-xl);
    max-height: 96vh;
  }
  .stepper-line { width: 36px; }
  .letter-actions { flex-wrap: wrap; }
  .letter-ctas { width: 100%; }
  .letter-ctas .btn-primary { flex: 1; }
  .btn-skip { flex: 1; text-align: center; }
}
</style>
