<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

const section = ref(null);
useScrollReveal(section);

const emit = defineEmits(['open-gifts']);
</script>

<template>
  <section class="gifts" id="gifts" ref="section">
    <div class="gifts-inner">
      <span class="gifts-label reveal reveal-fade">sugestão de presentes</span>
      <h2 class="gifts-title reveal reveal-delay-1">Sugestão de presentes</h2>

      <div class="gifts-icon reveal reveal-delay-2">
        <svg width="52" height="52" viewBox="0 0 56 56" fill="none">
          <rect x="8" y="24" width="40" height="26" rx="3" stroke="rgba(242, 230, 214,0.55)" stroke-width="1.5"/>
          <rect x="4" y="18" width="48" height="8" rx="2" stroke="rgba(242, 230, 214,0.55)" stroke-width="1.5"/>
          <path d="M28 18 L28 50" stroke="rgba(242, 230, 214,0.35)" stroke-width="1.5"/>
          <path d="M28 18 C28 18 20 14 20 8 C20 4 24 2 28 6 C32 2 36 4 36 8 C36 14 28 18 28 18Z"
                stroke="rgba(242, 230, 214,0.55)" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
        </svg>
      </div>

      <p class="gifts-main reveal reveal-delay-3">O melhor presente é a sua presença.</p>

      <div class="gifts-divider reveal reveal-delay-4">
        <span></span><span class="gifts-dot">✦</span><span></span>
      </div>

      <p class="gifts-sub reveal reveal-delay-4">
        Se desejar nos presentear, você pode escolher um item diretamente
        pela nossa lista de presentes abaixo.
      </p>

      <button class="gifts-btn reveal reveal-delay-5" @click="emit('open-gifts')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
        Ver lista de presentes
      </button>
    </div>
  </section>
</template>

<style scoped>
.gifts {
  background: var(--navy-dark);
  padding: clamp(3.5rem, 10vw, 6rem) var(--spacing-md);
}

.gifts-inner {
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.gifts-label {
  font-family: var(--font-body);
  font-size: clamp(0.6rem, 1.8vw, 0.75rem);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(242, 230, 214, 0.45);
  font-weight: 300;
}

.gifts-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 6vw, 2.8rem);
  font-weight: 400;
  color: var(--white);
  margin: 0;
}

.gifts-icon {
  margin: var(--spacing-xs) 0;
  opacity: 0.85;
}

.gifts-main {
  font-family: var(--font-script);
  font-size: clamp(1.7rem, 5.5vw, 2.4rem);
  color: var(--ice-blue);
  margin: 0;
  line-height: 1.3;
}

.gifts-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100px;
}

.gifts-divider span:not(.gifts-dot) {
  flex: 1;
  height: 1px;
  background: rgba(242, 230, 214, 0.2);
}

.gifts-dot {
  font-size: 0.6rem;
  color: rgba(242, 230, 214, 0.35);
}

.gifts-sub {
  font-family: var(--font-body);
  font-size: clamp(0.88rem, 2.5vw, 1.05rem);
  color: rgba(242, 230, 214, 0.6);
  line-height: 1.75;
  font-weight: 300;
  margin: 0;
}

/* Botão lista de presentes */
.gifts-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: var(--spacing-xs);
  padding: 1rem 2.2rem;
  border: 1.5px solid rgba(242, 230, 214, 0.45);
  border-radius: var(--radius-full);
  background: rgba(242, 230, 214, 0.06);
  backdrop-filter: blur(4px);
  font-family: var(--font-body);
  font-size: clamp(0.72rem, 2vw, 0.86rem);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(242, 230, 214, 0.88);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.gifts-btn:hover {
  background: rgba(242, 230, 214, 0.14);
  border-color: var(--ice-blue);
  color: var(--ice-blue);
  transform: translateY(-2px);
}

.gifts-btn svg {
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .gifts-inner {
    max-width: 640px;
  }

  .gifts-title {
    font-size: clamp(2.2rem, 3.5vw, 3.2rem);
  }

  .gifts-main {
    font-size: clamp(2rem, 3vw, 2.8rem);
  }

  .gifts-sub {
    font-size: clamp(0.95rem, 1.5vw, 1.1rem);
  }
}
</style>
