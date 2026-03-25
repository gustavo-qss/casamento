<script setup>
import { ref } from "vue";
import { useScrollReveal } from "@/composables/useScrollReveal";

const section = ref(null);
useScrollReveal(section);

const emit = defineEmits(["open-rsvp"]);
</script>

<template>
  <section class="confirmacao" id="confirmacao" ref="section">
    <div class="confirmacao-inner">
      <span class="confirmacao-eyebrow reveal reveal-fade"
        >16 de maio de 2026</span
      >

      <div class="confirmacao-ornament reveal reveal-delay-1">
        <span class="ornament-line"></span>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          class="ornament-heart"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            stroke="rgba(197,223,245,0.5)"
            stroke-width="1.5"
            fill="none"
            stroke-linejoin="round"
          />
        </svg>
        <span class="ornament-line"></span>
      </div>

      <h2 class="confirmacao-title reveal reveal-delay-2">
        Confirme sua<br /><em>presença</em>
      </h2>

      <p class="confirmacao-sub reveal reveal-delay-3">
        Você está convidado para a cerimônia na igreja e
        <strong style="color: var(--navy-dark)">
          adoraríamos que ficasse para o jantar conosco na recepção
          também</strong
        >. O jantar
        <strong style="color: var(--navy-dark)"
          >tem adesão para cobrir o evento</strong
        >, mas se vier só à cerimônia ficamos igualmente felizes em te ver lá.
      </p>

      <div class="confirmacao-divider reveal reveal-delay-4">
        <span></span><span class="sep-dot">✦</span><span></span>
      </div>

      <button
        class="confirmacao-btn reveal reveal-delay-5"
        @click="emit('open-rsvp')"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>
        Confirmar minha presença
      </button>
    </div>
  </section>
</template>

<style scoped>
.confirmacao {
  background: var(--pearl);
  padding: clamp(4rem, 12vw, 7rem) var(--spacing-md);
}

.confirmacao-inner {
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.confirmacao-eyebrow {
  font-family: var(--font-body);
  font-size: clamp(0.6rem, 1.8vw, 0.75rem);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(13, 31, 60, 0.4);
  font-weight: 300;
}

.confirmacao-ornament {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 120px;
  margin: var(--spacing-xs) 0;
}

.ornament-line {
  flex: 1;
  height: 1px;
  background: rgba(13, 31, 60, 0.12);
}

.ornament-heart {
  flex-shrink: 0;
}

.confirmacao-title {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 7vw, 3.6rem);
  font-weight: 400;
  color: var(--navy-dark);
  margin: 0;
  line-height: 1.15;
  letter-spacing: 0.02em;
}

.confirmacao-title em {
  font-style: italic;
  color: var(--navy-light);
}

.confirmacao-sub {
  font-family: var(--font-body);
  font-size: clamp(0.88rem, 2.5vw, 1.05rem);
  color: rgba(13, 31, 60, 0.55);
  line-height: 1.8;
  font-weight: 300;
  margin: 0;
}

.confirmacao-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100px;
}

.confirmacao-divider span:not(.sep-dot) {
  flex: 1;
  height: 1px;
  background: rgba(13, 31, 60, 0.1);
}

.sep-dot {
  font-size: 0.6rem;
  color: rgba(13, 31, 60, 0.25);
}

.confirmacao-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-top: var(--spacing-xs);
  padding: 1rem 2.4rem;
  border: 1.5px solid rgba(13, 31, 60, 0.3);
  border-radius: var(--radius-full);
  background: transparent;
  font-family: var(--font-body);
  font-size: clamp(0.72rem, 2vw, 0.86rem);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--navy-dark);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.confirmacao-btn:hover {
  background: var(--navy-dark);
  border-color: var(--navy-dark);
  color: var(--white);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(13, 31, 60, 0.2);
}

.confirmacao-btn svg {
  flex-shrink: 0;
  transition: stroke var(--transition-normal);
}

@media (min-width: 768px) {
  .confirmacao-inner {
    max-width: 640px;
  }

  .confirmacao-title {
    font-size: clamp(2.6rem, 4vw, 4rem);
  }
}
</style>
