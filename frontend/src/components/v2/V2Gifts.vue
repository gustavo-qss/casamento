<template>
  <section class="gifts" ref="root">
    <OliveBranch class="gifts-olive reveal reveal-fade" />
    <p class="gifts-lead reveal reveal-delay-1">
      A sua presença é o nosso maior presente. Mas, se desejar nos presentear,
      preparamos uma lista com muito carinho.
    </p>
    <button class="gifts-btn reveal reveal-delay-2" @click="open = true">
      Ver Lista de Presentes
    </button>

    <!-- Modal -->
    <Transition name="v2-modal">
      <div v-if="open" class="modal-backdrop" @click.self="open = false">
        <div class="modal" role="dialog" aria-label="Lista de presentes">
          <button class="modal-close" @click="open = false" aria-label="Fechar">×</button>

          <header class="modal-head">
            <h3 class="modal-title">Lista de Presentes</h3>
            <p class="modal-hint">Toque em um presente para marcá-lo como escolhido 🤍</p>
          </header>

          <div class="modal-body">
            <div v-for="group in grouped" :key="group.name" class="gift-group">
              <h4 class="group-title">{{ group.name }}</h4>
              <ul class="gift-list">
                <li
                  v-for="g in group.items"
                  :key="g.id"
                  class="gift-item"
                  :class="{ 'gift-item--chosen': chosen[g.id] }"
                  @click="toggle(g.id)"
                >
                  <span class="gift-check" aria-hidden="true"></span>
                  <span class="gift-name">{{ g.name }}</span>
                  <span class="gift-tag">{{ chosen[g.id] ? 'Escolhido' : '' }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import OliveBranch from './OliveBranch.vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
import giftsData from '@/data/gifts-v2.json';

const root = ref(null);
useScrollReveal(root);

const open = ref(false);

const STORAGE_KEY = 'v2-gifts-chosen';
const chosen = reactive({});
try {
  Object.assign(chosen, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
} catch { /* ignora storage indisponível */ }

watch(chosen, (val) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)); } catch { /* noop */ }
}, { deep: true });

function toggle(id) {
  chosen[id] = !chosen[id];
}

const grouped = computed(() => {
  const order = ['Cozinha', 'Mesa posta', 'Quarto & Banho', 'Casa'];
  const map = {};
  for (const g of giftsData) (map[g.category] ||= []).push(g);
  return order
    .filter((name) => map[name])
    .map((name) => ({ name, items: map[name] }));
});
</script>

<style scoped>
.gifts {
  background:
    radial-gradient(ellipse 50% 40% at 50% 0%, rgba(176, 106, 68, 0.08), transparent 60%),
    var(--tex-paper) repeat,
    var(--v2-cream);
  background-size: auto, 240px, auto;
  padding: clamp(4.5rem, 12vw, 7.5rem) var(--spacing-lg);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.gifts-olive { opacity: 0.85; }

.gifts-lead {
  font-family: var(--v2-serif);
  font-style: italic;
  font-size: clamp(1.2rem, 3.4vw, 1.7rem);
  line-height: 1.6;
  color: var(--v2-ink);
  max-width: 640px;
  margin: 0;
}

.gifts-btn {
  font-family: var(--v2-serif);
  font-size: clamp(0.95rem, 2.3vw, 1.1rem);
  letter-spacing: 0.06em;
  color: var(--v2-paper);
  background: var(--v2-terracotta);
  border: none;
  border-radius: var(--radius-full);
  padding: 0.95rem 2.4rem;
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(151, 85, 47, 0.3);
  transition: all 0.3s ease;
}
.gifts-btn:hover {
  background: #97552f;
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(151, 85, 47, 0.4);
}

/* ===== MODAL ===== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(46, 30, 18, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.modal {
  position: relative;
  width: min(680px, 100%);
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  background:
    var(--tex-paper) repeat,
    linear-gradient(180deg, #f6ecd6, #ecdcbb);
  background-size: 240px, auto;
  border: 1px solid rgba(120, 80, 40, 0.35);
  border-radius: var(--radius-lg);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 1.8rem;
  line-height: 1;
  color: var(--v2-ink);
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}
.modal-close:hover { opacity: 1; }

.modal-head {
  text-align: center;
  padding: clamp(1.6rem, 4vw, 2.2rem) var(--spacing-lg) var(--spacing-md);
  border-bottom: 1px solid rgba(120, 80, 40, 0.2);
}
.modal-title {
  font-family: var(--v2-script);
  font-size: clamp(2rem, 6vw, 2.8rem);
  color: var(--v2-terracotta);
  margin: 0 0 0.2rem;
  line-height: 1;
}
.modal-hint {
  font-family: var(--v2-serif);
  font-size: 0.92rem;
  color: var(--v2-ink);
  opacity: 0.75;
  margin: 0;
}

.modal-body {
  overflow-y: auto;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.group-title {
  font-family: var(--v2-serif);
  font-size: 0.8rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--v2-olive);
  margin: 0 0 0.7rem;
  border-bottom: 1px solid rgba(111, 126, 68, 0.25);
  padding-bottom: 0.35rem;
}

.gift-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.gift-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius-md);
  background: rgba(255, 252, 244, 0.6);
  border: 1px solid rgba(120, 80, 40, 0.18);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--v2-serif);
}
.gift-item:hover { border-color: var(--v2-terracotta); }

.gift-check {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1.5px solid var(--v2-olive);
  position: relative;
  transition: all 0.2s ease;
}

.gift-name {
  flex: 1;
  font-size: 0.98rem;
  color: var(--v2-ink);
  text-align: left;
  line-height: 1.25;
}

.gift-tag {
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--v2-olive);
}

/* Estado: escolhido */
.gift-item--chosen {
  background: rgba(111, 126, 68, 0.12);
  border-color: var(--v2-olive);
}
.gift-item--chosen .gift-check {
  background: var(--v2-olive);
}
.gift-item--chosen .gift-check::after {
  content: "✓";
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.8rem;
}
.gift-item--chosen .gift-name {
  text-decoration: line-through;
  opacity: 0.6;
}

/* transição */
.v2-modal-enter-active,
.v2-modal-leave-active { transition: opacity 0.3s ease; }
.v2-modal-enter-from,
.v2-modal-leave-to { opacity: 0; }

@media (max-width: 520px) {
  .gift-list { grid-template-columns: 1fr; }
}
</style>
