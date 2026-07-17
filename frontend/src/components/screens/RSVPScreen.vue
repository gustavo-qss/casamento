<script setup>
import { ref, computed } from "vue";
import QrcodeVue from "qrcode-vue3";
import { generatePixPayload } from "@/utils/pix";
import { useRSVP } from "@/composables/useRSVP";
import weddingInfo from "@/data/wedding-info.json";

const emit = defineEmits(["close", "confirmed"]);

const { submitRSVP, isLoading, loadingMsg, error } = useRSVP();

// ── Steps ──────────────────────────────────────────────────
const step = ref(1);
const direction = ref("forward");
const transitionName = computed(() =>
  direction.value === "forward" ? "rsvp-slide-left" : "rsvp-slide-right",
);

function goNext() {
  direction.value = "forward";
  step.value++;
}
function goBack() {
  direction.value = "back";
  step.value--;
}

// ── Formulário (step 2) ────────────────────────────────────
const name = ref("");
const phone = ref("");
const guestsCount = ref(1);
const childrenUnder4 = ref(0);
const childrenUnder10 = ref(0);
const childrenAge11 = ref(0);
const dietary = ref("");
const nameHint = ref(false);
const phoneHint = ref(false);

const MAX_GUESTS = 6;
const MAX_CHILDREN = 6;

function incrementGuests() {
  if (guestsCount.value < MAX_GUESTS) guestsCount.value++;
}
function decrementGuests() {
  if (guestsCount.value > 1) guestsCount.value--;
}
function incrementChildren4() {
  if (childrenUnder4.value < MAX_CHILDREN) childrenUnder4.value++;
}
function decrementChildren4() {
  if (childrenUnder4.value > 0) childrenUnder4.value--;
}
function incrementChildren10() {
  if (childrenUnder10.value < MAX_CHILDREN) childrenUnder10.value++;
}
function decrementChildren10() {
  if (childrenUnder10.value > 0) childrenUnder10.value--;
}
function incrementChildren11() {
  if (childrenAge11.value < MAX_CHILDREN) childrenAge11.value++;
}
function decrementChildren11() {
  if (childrenAge11.value > 0) childrenAge11.value--;
}

function handlePhoneInput(e) {
  let v = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length > 10) v = v.slice(0, 10) + "-" + v.slice(10);
  phone.value = v;
}

function validateForm() {
  nameHint.value = !name.value.trim();
  phoneHint.value = phone.value.replace(/\D/g, "").length < 10;
  return !nameHint.value && !phoneHint.value;
}

function submitForm() {
  if (validateForm()) goNext();
}

// ── PIX (step 3) ───────────────────────────────────────────
const pricePerPerson = Number(import.meta.env.VITE_PIX_PRICE_PER_PERSON) || 0;
const priceChild0to4  = Number(import.meta.env.VITE_PIX_PRICE_CHILD_0_4)  || 0;
const priceChild5to10 = Number(import.meta.env.VITE_PIX_PRICE_CHILD_5_10) || 0;
const priceChild11    = Number(import.meta.env.VITE_PIX_PRICE_CHILD_11)   || 0;
const pixKey = import.meta.env.VITE_PIX_KEY || "";
const pixName = import.meta.env.VITE_PIX_NAME || "Lucas e Jéssica";

const totalAmount = computed(
  () =>
    pricePerPerson  * guestsCount.value    +
    priceChild0to4  * childrenUnder4.value +
    priceChild5to10 * childrenUnder10.value +
    priceChild11    * childrenAge11.value,
);

const hasAnyPrice = computed(
  () => pricePerPerson > 0 || priceChild0to4 > 0 || priceChild5to10 > 0 || priceChild11 > 0,
);

const pixPayload = computed(() =>
  hasAnyPrice.value && pixKey && totalAmount.value > 0
    ? generatePixPayload(pixKey, totalAmount.value, pixName, "LONDRINA")
    : "",
);

const copiedKey = ref(false);
const copiedValue = ref(false);

function copyKey() {
  navigator.clipboard.writeText(pixKey).then(() => {
    copiedKey.value = true;
    setTimeout(() => (copiedKey.value = false), 2500);
  });
}

function copyValue() {
  const fmt = totalAmount.value.toFixed(2);
  navigator.clipboard.writeText(fmt).then(() => {
    copiedValue.value = true;
    setTimeout(() => (copiedValue.value = false), 2500);
  });
}

// ── Upload comprovante (step 3) ────────────────────────────
const fileInput = ref(null);
const comprovanteFile = ref(null);
const comprovantePreview = ref(null);

function openFilePicker() {
  fileInput.value?.click();
}

function handleFileChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > 8 * 1024 * 1024) {
    alert("Arquivo muito grande. Use uma imagem de até 8MB.");
    return;
  }
  comprovanteFile.value = file;
  const reader = new FileReader();
  reader.onload = (ev) => (comprovantePreview.value = ev.target.result);
  reader.readAsDataURL(file);
}

function removeFile() {
  comprovanteFile.value = null;
  comprovantePreview.value = null;
  if (fileInput.value) fileInput.value.value = "";
}

// ── Submissão (step 3 → 4) ─────────────────────────────────
const slowWarning = ref(false);
let slowTimer = null;

async function handleConfirm() {
  direction.value = "forward";
  step.value = 4;

  slowTimer = setTimeout(() => (slowWarning.value = true), 8000);

  try {
    await submitRSVP(
      {
        name: name.value.trim(),
        phone: phone.value,
        guestsCount: guestsCount.value,
        childrenUnder4: childrenUnder4.value,
        childrenUnder10: childrenUnder10.value,
        childrenAge11: childrenAge11.value,
        dietary: dietary.value.trim(),
      },
      comprovanteFile.value,
    );
    clearTimeout(slowTimer);
    slowWarning.value = false;
    step.value = 5;
  } catch {
    clearTimeout(slowTimer);
    slowWarning.value = false;
    step.value = 4; // mantém no loading — erro exibido pelo template
  }
}

async function retry() {
  slowWarning.value = false;
  slowTimer = setTimeout(() => (slowWarning.value = true), 8000);
  try {
    await submitRSVP(
      {
        name: name.value.trim(),
        phone: phone.value,
        guestsCount: guestsCount.value,
        childrenUnder4: childrenUnder4.value,
        childrenUnder10: childrenUnder10.value,
        childrenAge11: childrenAge11.value,
        dietary: dietary.value.trim(),
      },
      comprovanteFile.value,
    );
    clearTimeout(slowTimer);
    step.value = 5;
  } catch {
    clearTimeout(slowTimer);
    slowWarning.value = false;
  }
}

// ── Confirmado (step 5) ────────────────────────────────────
const calendarUrl = computed(() => {
  const dt = weddingInfo.weddingDate
    .replace(/[-:]/g, "")
    .replace("T", "T")
    .slice(0, 15);
  const end = dt.slice(0, 9) + "220000";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Casamento+Lucas+%26+J%C3%A9ssica&dates=${dt}/${end}&location=${encodeURIComponent(weddingInfo.church.address)}`;
});

const fmt = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    v,
  );

// Nada a fazer no mount — scroll preservado intencionalmente
</script>

<template>
  <div class="rsvp-overlay" @click="step < 4 ? emit('close') : null">
    <div class="rsvp-card" :class="`step-mode-${step}`" @click.stop>
      <!-- Fechar (steps 1–3) -->
      <button
        v-if="step < 4"
        class="btn-close"
        @click="emit('close')"
        aria-label="Fechar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <!-- Stepper (steps 2–3) -->
      <div v-if="step === 2 || step === 3" class="stepper">
        <div v-for="n in 2" :key="n" class="stepper-item">
          <div
            class="stepper-node"
            :class="{ active: step - 1 === n, done: step - 1 > n }"
          >
            <svg
              v-if="step - 1 > n"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span v-else>{{ n }}</span>
          </div>
          <div
            v-if="n < 2"
            class="stepper-line"
            :class="{ done: step - 1 > n }"
          ></div>
        </div>
      </div>

      <!-- Transições -->
      <Transition :name="transitionName" mode="out-in">
        <!-- ── STEP 1: Boas-vindas ── -->
        <div v-if="step === 1" key="1" class="step step-welcome">
          <div class="welcome-deco">
            <span class="deco-line"></span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="rgba(242, 230, 214,0.6)"
                stroke-width="1.5"
                fill="rgba(242, 230, 214,0.08)"
              />
            </svg>
            <span class="deco-line"></span>
          </div>

          <p class="welcome-script">Lucas &amp; Jéssica</p>

          <h1 class="welcome-title">Esperamos por<br /><em>você</em></h1>

          <p class="welcome-sub">
            Você está convidado para a cerimônia <em>e</em> para o jantar
            conosco na recepção. Se puder ficar para o jantar, há uma adesão
            para cobrir o evento, mas se vier só à igreja, ficamos igualmente
            felizes em te ver lá.
          </p>

          <button class="btn-welcome" @click="goNext">
            Próximo: Confirmar presença 
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <p class="welcome-date">16 · 05 · 2026</p>
        </div>

        <!-- ── STEP 2: Formulário ── -->
        <div v-else-if="step === 2" key="2" class="step step-form">
          <div class="step-header">
            <p class="eyebrow">Passo 1 de 2</p>
            <h2 class="step-title">Suas informações</h2>
          </div>

          <div class="form-fields">
            <div class="field">
              <label class="field-label" for="rsvp-name">
                Nome completo <span class="req">*</span>
              </label>
              <input
                id="rsvp-name"
                v-model.trim="name"
                class="field-input"
                :class="{ error: nameHint }"
                placeholder="Como você se chama?"
                maxlength="80"
                autocomplete="name"
                @input="nameHint = false"
              />
              <span v-if="nameHint" class="field-hint">Informe seu nome</span>
            </div>

            <div class="field">
              <label class="field-label" for="rsvp-phone">
                WhatsApp <span class="req">*</span>
              </label>
              <input
                id="rsvp-phone"
                :value="phone"
                class="field-input"
                :class="{ error: phoneHint }"
                placeholder="(00) 00000-0000"
                inputmode="numeric"
                autocomplete="tel"
                @input="
                  (e) => {
                    handlePhoneInput(e);
                    phoneHint = false;
                  }
                "
              />
              <span v-if="phoneHint" class="field-hint"
                >Informe um número válido</span
              >
            </div>

            <div class="field">
              <label class="field-label">Adultos <span class="optional">(12+ anos)</span> <span class="price-hint">R$ 107,00</span></label>
              <div class="guests-counter">
                <button
                  class="counter-btn"
                  @click="decrementGuests"
                  :disabled="guestsCount <= 1"
                >
                  −
                </button>
                <span class="counter-value">{{ guestsCount }}</span>
                <button
                  class="counter-btn"
                  @click="incrementGuests"
                  :disabled="guestsCount >= MAX_GUESTS"
                >
                  +
                </button>
                <span class="counter-label">{{
                  guestsCount === 1 ? "pessoa" : "pessoas"
                }}</span>
              </div>
            </div>

            <div class="field children-group">
              <label class="field-label">
                Crianças <span class="optional">(se houver)</span>
              </label>
              <div class="children-rows">
                <div class="children-row">
                  <span class="children-range">0 – 4 anos <span class="price-hint">{{ priceChild0to4 === 0 ? 'gratuito' : fmt(priceChild0to4) }}</span></span>
                  <div class="guests-counter guests-counter--sm">
                    <button
                      class="counter-btn"
                      @click="decrementChildren4"
                      :disabled="childrenUnder4 <= 0"
                    >
                      −
                    </button>
                    <span class="counter-value">{{ childrenUnder4 }}</span>
                    <button
                      class="counter-btn"
                      @click="incrementChildren4"
                      :disabled="childrenUnder4 >= MAX_CHILDREN"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div class="children-row">
                  <span class="children-range">5 – 10 anos <span class="price-hint">{{ priceChild5to10 === 0 ? 'gratuito' : fmt(priceChild5to10) }}</span></span>
                  <div class="guests-counter guests-counter--sm">
                    <button class="counter-btn" @click="decrementChildren10" :disabled="childrenUnder10 <= 0">−</button>
                    <span class="counter-value">{{ childrenUnder10 }}</span>
                    <button class="counter-btn" @click="incrementChildren10" :disabled="childrenUnder10 >= MAX_CHILDREN">+</button>
                  </div>
                </div>
                <div class="children-row">
                  <span class="children-range">11 anos <span class="price-hint">{{ priceChild11 === 0 ? 'gratuito' : fmt(priceChild11) }}</span></span>
                  <div class="guests-counter guests-counter--sm">
                    <button class="counter-btn" @click="decrementChildren11" :disabled="childrenAge11 <= 0">−</button>
                    <span class="counter-value">{{ childrenAge11 }}</span>
                    <button class="counter-btn" @click="incrementChildren11" :disabled="childrenAge11 >= MAX_CHILDREN">+</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="field-label" for="rsvp-dietary">
                Restrições alimentares <span class="optional">(opcional)</span>
              </label>
              <textarea
                id="rsvp-dietary"
                v-model="dietary"
                class="field-textarea"
                placeholder="Vegetariano, sem glúten, alergia..."
                rows="2"
                maxlength="200"
              ></textarea>
            </div>
          </div>

          <button class="btn-primary" @click="submitForm">
            Próximo: Pagamento
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <button class="btn-back" @click="goBack">← Voltar</button>
        </div>

        <!-- ── STEP 3: PIX ── -->
        <div v-else-if="step === 3" key="3" class="step step-pix">
          <div class="step-header">
            <p class="eyebrow">Passo 2 de 2</p>
            <h2 class="step-title">Adesão à recepção</h2>
            <p class="step-sub">
              Realize o PIX para confirmar sua presença no jantar. Caso venha
              apenas à cerimônia, pode fechar esta tela.
            </p>
          </div>

          <!-- Breakdown de valor -->
          <div class="pix-amount-block" v-if="hasAnyPrice && totalAmount > 0">
            <div class="pix-breakdown">
              <div v-if="pricePerPerson > 0" class="breakdown-row">
                <span class="breakdown-label"
                  >{{ guestsCount }}
                  {{ guestsCount === 1 ? "adulto" : "adultos" }}</span
                >
                <span class="breakdown-value">{{
                  fmt(pricePerPerson * guestsCount)
                }}</span>
              </div>
              <div
                v-if="priceChild0to4 > 0 && childrenUnder4 > 0"
                class="breakdown-row"
              >
                <span class="breakdown-label"
                  >{{ childrenUnder4 }}
                  {{ childrenUnder4 === 1 ? "criança" : "crianças" }}
                  (0–4)</span
                >
                <span class="breakdown-value">{{
                  fmt(priceChild0to4 * childrenUnder4)
                }}</span>
              </div>
              <div v-if="priceChild5to10 > 0 && childrenUnder10 > 0" class="breakdown-row">
                <span class="breakdown-label">{{ childrenUnder10 }} {{ childrenUnder10 === 1 ? "criança" : "crianças" }} (5–10)</span>
                <span class="breakdown-value">{{ fmt(priceChild5to10 * childrenUnder10) }}</span>
              </div>
              <div v-if="priceChild11 > 0 && childrenAge11 > 0" class="breakdown-row">
                <span class="breakdown-label">{{ childrenAge11 }} {{ childrenAge11 === 1 ? "criança" : "crianças" }} (11)</span>
                <span class="breakdown-value">{{ fmt(priceChild11 * childrenAge11) }}</span>
              </div>
              <div class="breakdown-total">
                <span class="pix-amount-label">Total</span>
                <span class="pix-amount-value">{{ fmt(totalAmount) }}</span>
              </div>
            </div>
          </div>

          <!-- QR Code -->
          <div class="pix-qr-wrapper" v-if="pixPayload">
            <div class="pix-qr">
              <QrcodeVue
                :value="pixPayload"
                :size="180"
                level="M"
                render-as="svg"
              />
            </div>
          </div>

          <!-- Botões de cópia -->
          <div class="pix-copy-row">
            <button class="btn-copy" @click="copyKey">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path
                  d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                />
              </svg>
              {{ copiedKey ? "Copiado ✓" : "Copiar chave" }}
            </button>
            <button
              class="btn-copy"
              @click="copyValue"
              v-if="hasAnyPrice && totalAmount > 0"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              {{ copiedValue ? "Copiado ✓" : "Copiar valor" }}
            </button>
          </div>

          <!-- Upload comprovante -->
          <div class="upload-divider">
            <span></span><span class="upload-divider-text">comprovante</span
            ><span></span>
          </div>

          <div
            class="upload-area"
            :class="{ 'has-file': comprovanteFile }"
            @click="openFilePicker"
          >
            <template v-if="!comprovanteFile">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p class="upload-text">Toque para enviar o comprovante</p>
              <p class="upload-hint">JPG, PNG ou PDF · até 8MB</p>
            </template>

            <template v-else>
              <div class="file-preview">
                <img
                  v-if="comprovantePreview"
                  :src="comprovantePreview"
                  class="preview-img"
                  alt="Comprovante"
                />
                <div class="file-info">
                  <span class="file-name">{{ comprovanteFile.name }}</span>
                  <span class="file-size"
                    >{{ (comprovanteFile.size / 1024).toFixed(0) }} KB</span
                  >
                </div>
                <button
                  class="btn-remove"
                  @click.stop="removeFile"
                  aria-label="Remover"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </div>
            </template>
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/*,application/pdf"
            class="file-input-hidden"
            @change="handleFileChange"
          />

          <p class="upload-note" v-if="!comprovanteFile">
            Sem comprovante, sua confirmação ficará pendente.
          </p>

          <button class="btn-primary" @click="handleConfirm">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
            {{
              comprovanteFile
                ? "Confirmar presença"
                : "Confirmar sem comprovante"
            }}
          </button>

          <button class="btn-back" @click="goBack">← Voltar</button>
        </div>

        <!-- ── STEP 4: Loading / Erro ── -->
        <div v-else-if="step === 4" key="4" class="step step-loading">
          <template v-if="!error">
            <div class="loader-ring">
              <span class="loader-spinner"></span>
              <span class="loader-heart">♡</span>
            </div>
            <p class="loader-msg">{{ loadingMsg || "Confirmando..." }}</p>
            <p v-if="slowWarning" class="slow-warning">
              Isso pode levar até 30s na primeira vez — nosso servidor está
              acordando.
            </p>
          </template>

          <template v-else>
            <div class="error-icon">✕</div>
            <p class="error-msg">{{ error }}</p>
            <div class="error-actions">
              <button class="btn-retry" @click="retry">Tentar novamente</button>
              <button
                class="btn-cancel"
                @click="
                  step = 3;
                  error = null;
                "
              >
                ← Voltar
              </button>
            </div>
          </template>
        </div>

        <!-- ── STEP 5: Confirmado ── -->
        <div v-else key="5" class="step step-confirmed">
          <div class="confirmed-hearts">
            <span class="ch ch1">♡</span>
            <span class="ch ch2">♡</span>
            <span class="ch ch3">♡</span>
          </div>

          <p class="confirmed-script">Que alegria!</p>
          <h2 class="confirmed-title">Presença<br /><em>confirmada</em></h2>

          <p class="confirmed-msg">
            {{ name }}, mal podemos esperar para te ver.<br />
            Até 21 de novembro de 2026!
          </p>

          <div class="confirmed-divider">
            <span></span><span class="sep-dot">✦</span><span></span>
          </div>

          <div class="confirmed-actions">
            <a
              :href="calendarUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-calendar"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Adicionar à agenda
            </a>
            <button class="btn-site" @click="emit('close')">Ver o site</button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* ── Overlay ── */
.rsvp-overlay {
  position: fixed;
  inset: 0;
  background: rgba(42, 24, 18, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 210;
  padding: var(--spacing-md);
  animation: fadeIn 0.25s ease-out;
  overflow-y: auto;
}

/* ── Card ── */
.rsvp-card {
  background: var(--navy-dark);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-2xl);
  max-width: 440px;
  width: 100%;
  max-height: 94vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 32px 80px rgba(42, 24, 18, 0.6);
  transition: background 0.4s ease;
  scrollbar-width: none;
}

.rsvp-card::-webkit-scrollbar {
  display: none;
}

.rsvp-card.step-mode-2,
.rsvp-card.step-mode-3 {
  background: var(--white);
}
.rsvp-card.step-mode-5 {
  background: var(--navy-dark);
}

/* ── Fechar ── */
.btn-close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--transition-fast);
  z-index: 2;
  color: rgba(242, 230, 214, 0.5);
}

.rsvp-card.step-mode-2 .btn-close,
.rsvp-card.step-mode-3 .btn-close {
  color: rgba(74, 42, 28, 0.4);
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.08);
}
.rsvp-card.step-mode-2 .btn-close:hover,
.rsvp-card.step-mode-3 .btn-close:hover {
  background: var(--gray-light);
}

/* ── Stepper ── */
.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}
.stepper-item {
  display: flex;
  align-items: center;
}

.stepper-node {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid rgba(74, 42, 28, 0.2);
  background: transparent;
  color: rgba(74, 42, 28, 0.4);
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
  background: rgba(74, 42, 28, 0.15);
  flex-shrink: 0;
  transition: background 0.4s ease;
}
.stepper-line.done {
  background: var(--ice-blue);
  opacity: 0.7;
}

/* ── Transições ── */
.rsvp-slide-left-enter-active,
.rsvp-slide-left-leave-active,
.rsvp-slide-right-enter-active,
.rsvp-slide-right-leave-active {
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.rsvp-slide-left-enter-from {
  transform: translateX(28px);
  opacity: 0;
}
.rsvp-slide-left-leave-to {
  transform: translateX(-28px);
  opacity: 0;
}
.rsvp-slide-right-enter-from {
  transform: translateX(-28px);
  opacity: 0;
}
.rsvp-slide-right-leave-to {
  transform: translateX(28px);
  opacity: 0;
}

/* ── Step genérico ── */
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Step 1: Boas-vindas ── */
.step-welcome {
  padding: var(--spacing-xl) 0 var(--spacing-lg);
  text-align: center;
  gap: var(--spacing-md);
}

.welcome-deco {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 110px;
  margin-bottom: var(--spacing-xs);
}
.deco-line {
  flex: 1;
  height: 1px;
  background: rgba(242, 230, 214, 0.15);
}

.welcome-script {
  font-family: var(--font-script);
  font-size: clamp(1.8rem, 6vw, 2.6rem);
  color: var(--ice-blue);
  margin: 0;
  line-height: 1.2;
}

.welcome-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 7vw, 3rem);
  font-weight: 400;
  color: var(--white);
  margin: 0;
  line-height: 1.15;
}
.welcome-title em {
  font-style: italic;
  color: var(--ice-blue);
}

.welcome-sub {
  font-family: var(--font-body);
  font-size: clamp(0.82rem, 2.5vw, 0.95rem);
  color: rgba(242, 230, 214, 0.55);
  line-height: 1.75;
  margin: 0;
}

.btn-welcome {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem 2.2rem;
  border: 1.5px solid rgba(242, 230, 214, 0.4);
  border-radius: var(--radius-full);
  background: rgba(242, 230, 214, 0.07);
  backdrop-filter: blur(4px);
  font-family: var(--font-body);
  font-size: clamp(0.72rem, 2vw, 0.85rem);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(242, 230, 214, 0.88);
  cursor: pointer;
  transition: all var(--transition-normal);
  margin-top: var(--spacing-xs);
}
.btn-welcome:hover {
  background: rgba(242, 230, 214, 0.14);
  border-color: var(--ice-blue);
  color: var(--ice-blue);
  transform: translateY(-2px);
}

.welcome-date {
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  color: rgba(242, 230, 214, 0.25);
  margin: 0;
  text-transform: uppercase;
}

/* ── Steps 2 e 3: formulário / pix ── */
.step-form,
.step-pix {
  width: 100%;
  gap: 0;
}

.step-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  width: 100%;
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
  margin: 0 0 var(--spacing-xs);
}

.step-sub {
  font-family: var(--font-body);
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.65;
  margin: 0;
}

/* ── Campos ── */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  width: 100%;
}

.field {
  position: relative;
  width: 100%;
}

.field-label {
  display: block;
  font-family: var(--font-body);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.req {
  color: #c0853a;
}
.optional {
  text-transform: none;
  letter-spacing: 0;
  font-size: 0.7rem;
}

.field-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid rgba(74, 42, 28, 0.18);
  padding: var(--spacing-xs) 0;
  font-family: var(--font-body);
  font-size: clamp(0.88rem, 2.5vw, 1rem);
  color: var(--navy-dark);
  outline: none;
  transition: border-color var(--transition-fast);
  box-sizing: border-box;
}
.field-input:focus {
  border-bottom-color: var(--navy-dark);
}
.field-input.error {
  border-bottom-color: #c0392b;
}

.field-hint {
  font-family: var(--font-body);
  font-size: 0.68rem;
  color: #c0392b;
  margin-top: 4px;
  display: block;
}

.field-textarea {
  width: 100%;
  background: rgba(74, 42, 28, 0.03);
  border: 1.5px solid rgba(74, 42, 28, 0.12);
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm);
  font-family: var(--font-body);
  font-size: clamp(0.88rem, 2.5vw, 1rem);
  color: var(--navy-dark);
  outline: none;
  resize: none;
  transition: border-color var(--transition-fast);
  box-sizing: border-box;
}
.field-textarea:focus {
  border-color: var(--navy-dark);
}

/* ── Contador de convidados ── */
.guests-counter {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: 4px;
}

.counter-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid rgba(74, 42, 28, 0.2);
  background: transparent;
  color: var(--navy-dark);
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  line-height: 1;
  flex-shrink: 0;
}
.counter-btn:hover:not(:disabled) {
  background: var(--navy-dark);
  color: var(--white);
  border-color: var(--navy-dark);
}
.counter-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.counter-value {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 400;
  color: var(--navy-dark);
  min-width: 28px;
  text-align: center;
  line-height: 1;
}

.counter-label {
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: var(--text-muted);
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
  font-size: clamp(0.82rem, 2vw, 0.9rem);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  transition: all var(--transition-normal);
  min-height: 50px;
  letter-spacing: 0.3px;
  margin-bottom: var(--spacing-sm);
}
.btn-primary:hover {
  background: var(--navy-mid);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 42, 28, 0.25);
}

.btn-back {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 0.8rem;
  cursor: pointer;
  padding: var(--spacing-xs) 0;
  transition: color var(--transition-fast);
  align-self: flex-start;
}
.btn-back:hover {
  color: var(--navy-dark);
}

/* ── Crianças ── */
.children-group {
  margin-top: var(--spacing-xs);
}

.children-rows {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 6px;
}

.children-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.children-range {
  font-family: var(--font-body);
  font-size: clamp(0.82rem, 2.2vw, 0.92rem);
  color: var(--navy-dark);
  font-weight: 400;
}

.price-hint {
  font-size: 0.7em;
  color: var(--text-muted);
  font-weight: 400;
  letter-spacing: 0.02em;
  opacity: 0.7;
}

.guests-counter--sm {
  gap: 0.5rem;
}
.guests-counter--sm .counter-value {
  font-size: 1.2rem;
  min-width: 22px;
}
.guests-counter--sm .counter-btn {
  width: 30px;
  height: 30px;
  font-size: 1rem;
}

/* ── PIX ── */
.pix-amount-block {
  background: var(--navy-dark);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  width: 100%;
  box-sizing: border-box;
}

.pix-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breakdown-label {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
}

.breakdown-value {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: rgba(242, 230, 214, 0.6);
  font-weight: 500;
}

.breakdown-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(242, 230, 214, 0.1);
  margin-top: 0.35rem;
  padding-top: 0.55rem;
}

.pix-amount-label {
  font-family: var(--font-body);
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: rgba(255, 255, 255, 0.45);
}

.pix-amount-value {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 3.5vw, 1.6rem);
  color: var(--ice-blue);
  font-weight: 400;
}

.pix-qr-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-md);
  width: 100%;
}

.pix-qr {
  background: var(--white);
  border-radius: var(--radius-md);
  padding: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(74, 42, 28, 0.1);
}

.pix-copy-row {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  width: 100%;
}

.btn-copy {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px var(--spacing-sm);
  border: 1.5px solid rgba(74, 42, 28, 0.15);
  border-radius: var(--radius-sm);
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--navy-dark);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}
.btn-copy:hover {
  border-color: var(--navy-dark);
  background: var(--navy-dark);
  color: var(--white);
}

/* ── Upload ── */
.upload-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin: var(--spacing-sm) 0;
}
.upload-divider span:not(.upload-divider-text) {
  flex: 1;
  height: 1px;
  background: rgba(74, 42, 28, 0.1);
}
.upload-divider-text {
  font-family: var(--font-body);
  font-size: 0.6rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--text-muted);
  white-space: nowrap;
}

.upload-area {
  width: 100%;
  border: 1.5px dashed rgba(74, 42, 28, 0.2);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg) var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-sizing: border-box;
  margin-bottom: var(--spacing-sm);
  text-align: center;
  color: rgba(74, 42, 28, 0.35);
}
.upload-area:hover {
  border-color: var(--navy-dark);
  background: rgba(74, 42, 28, 0.03);
}
.upload-area.has-file {
  border-color: rgba(74, 42, 28, 0.25);
  cursor: default;
  padding: var(--spacing-md);
}

.upload-text {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--navy-dark);
  margin: 0;
  font-weight: 500;
}
.upload-hint {
  font-family: var(--font-body);
  font-size: 0.7rem;
  color: var(--text-muted);
  margin: 0;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
}

.preview-img {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
  border: 1px solid rgba(74, 42, 28, 0.1);
}

.file-info {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.file-name {
  display: block;
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: var(--navy-dark);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  display: block;
  font-family: var(--font-body);
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.btn-remove {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(74, 42, 28, 0.15);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}
.btn-remove:hover {
  background: #fde8e8;
  border-color: #c0392b;
  color: #c0392b;
}

.file-input-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.upload-note {
  font-family: var(--font-body);
  font-size: 0.68rem;
  color: rgba(74, 42, 28, 0.4);
  margin: 0 0 var(--spacing-sm);
  text-align: center;
}

/* ── Loading ── */
.step-loading {
  min-height: 280px;
  padding: var(--spacing-xl) 0;
  text-align: center;
  gap: var(--spacing-md);
}

.loader-ring {
  position: relative;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader-spinner {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(242, 230, 214, 0.12);
  border-top-color: var(--ice-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
.loader-heart {
  font-size: 1.5rem;
  color: var(--ice-blue);
  animation: heartbeat 1.6s ease-in-out infinite;
}

.loader-msg {
  font-family: var(--font-body);
  font-size: 0.8rem;
  letter-spacing: 1.5px;
  color: rgba(242, 230, 214, 0.55);
  text-transform: uppercase;
  margin: 0;
}
.slow-warning {
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.3);
  max-width: 280px;
  line-height: 1.65;
  margin: 0;
}

.error-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(192, 57, 43, 0.15);
  color: #e74c3c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
}
.error-msg {
  font-family: var(--font-body);
  font-size: 0.88rem;
  color: rgba(242, 230, 214, 0.65);
  margin: 0;
  text-align: center;
  max-width: 300px;
  line-height: 1.6;
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
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 180px;
}
.btn-retry:hover {
  background: var(--white);
  transform: translateY(-1px);
}
.btn-cancel {
  background: transparent;
  border: none;
  color: rgba(242, 230, 214, 0.4);
  font-family: var(--font-body);
  font-size: 0.8rem;
  cursor: pointer;
  transition: color var(--transition-fast);
}
.btn-cancel:hover {
  color: rgba(242, 230, 214, 0.7);
}

/* ── Confirmado ── */
.step-confirmed {
  padding: var(--spacing-xl) 0 var(--spacing-lg);
  text-align: center;
  gap: var(--spacing-md);
}

.confirmed-hearts {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: var(--spacing-xs);
}
.ch {
  font-size: 1.2rem;
  color: var(--ice-blue);
  animation: heartbeat 1.8s ease-in-out infinite;
  opacity: 0.7;
}
.ch2 {
  animation-delay: 0.3s;
  font-size: 1.6rem;
  opacity: 1;
}
.ch3 {
  animation-delay: 0.6s;
}

.confirmed-script {
  font-family: var(--font-script);
  font-size: clamp(1.8rem, 6vw, 2.6rem);
  color: var(--ice-blue);
  margin: 0;
  line-height: 1.2;
}

.confirmed-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 6vw, 2.6rem);
  font-weight: 400;
  color: var(--white);
  margin: 0;
  line-height: 1.15;
}
.confirmed-title em {
  font-style: italic;
  color: var(--ice-blue);
}

.confirmed-msg {
  font-family: var(--font-body);
  font-size: clamp(0.82rem, 2.5vw, 0.95rem);
  color: rgba(242, 230, 214, 0.55);
  line-height: 1.75;
  margin: 0;
}

.confirmed-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100px;
}
.confirmed-divider span:not(.sep-dot) {
  flex: 1;
  height: 1px;
  background: rgba(242, 230, 214, 0.15);
}
.sep-dot {
  font-size: 0.6rem;
  color: rgba(242, 230, 214, 0.3);
}

.confirmed-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
}

.btn-calendar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 13px var(--spacing-lg);
  border: 1.5px solid rgba(242, 230, 214, 0.35);
  border-radius: var(--radius-md);
  background: rgba(242, 230, 214, 0.07);
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: rgba(242, 230, 214, 0.8);
  text-decoration: none;
  transition: all var(--transition-normal);
}
.btn-calendar:hover {
  background: rgba(242, 230, 214, 0.14);
  border-color: var(--ice-blue);
  color: var(--ice-blue);
}

.btn-site {
  background: transparent;
  border: none;
  color: rgba(242, 230, 214, 0.3);
  font-family: var(--font-body);
  font-size: 0.78rem;
  cursor: pointer;
  padding: var(--spacing-xs) 0;
  transition: color var(--transition-fast);
}
.btn-site:hover {
  color: rgba(242, 230, 214, 0.6);
}

/* ── Keyframes ── */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideUp {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.18);
    opacity: 1;
  }
}

/* ── Mobile ── */
@media (max-width: 480px) {
  .rsvp-card {
    padding: var(--spacing-lg) var(--spacing-md) var(--spacing-xl);
    max-height: 96vh;
  }
  .pix-copy-row {
    flex-direction: column;
  }
  .btn-copy {
    flex: none;
  }
}
</style>
