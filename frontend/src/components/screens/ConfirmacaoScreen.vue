<template>
  <div class="confirmacao-screen">
    <BackButton @click="handleBack" />

    <div class="screen-inner">
      <span class="confirmacao-eyebrow fade-in-up">16 de maio de 2026</span>

      <div class="confirmacao-ornament fade-in-up" style="animation-delay: 0.08s">
        <span class="ornament-line"></span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" class="ornament-heart">
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            stroke="rgba(74, 42, 28, 0.45)"
            stroke-width="1.5"
            fill="none"
            stroke-linejoin="round"
          />
        </svg>
        <span class="ornament-line"></span>
      </div>

      <h2 class="confirmacao-title fade-in-up" style="animation-delay: 0.16s">
        Confirme sua<br /><em>presença</em>
      </h2>

      <p class="confirmacao-sub fade-in-up" style="animation-delay: 0.24s">
        Você está convidado para a cerimônia na igreja e
        <strong>adoraríamos que ficasse para o jantar conosco na recepção
        também</strong>. O jantar <strong>tem adesão para cobrir o evento</strong>,
        mas se vier só à cerimônia ficamos igualmente felizes em te ver lá.
      </p>

      <div class="confirmacao-deadline fade-in-up" style="animation-delay: 0.32s">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>Confirme até <strong>08 de maio</strong></span>
      </div>

      <div class="confirmacao-divider fade-in-up" style="animation-delay: 0.4s">
        <span></span><span class="sep-dot">✦</span><span></span>
      </div>

      <button
        class="confirmacao-btn fade-in-up"
        style="animation-delay: 0.48s"
        @click="emit('open-rsvp')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        Confirmar minha presença
      </button>
    </div>

    <div class="scroll-arrow-wrapper">
      <ScrollArrow @click="scrollToNext" />
    </div>
  </div>
</template>

<script setup>
import BackButton from '../ui/BackButton.vue';
import ScrollArrow from '../ui/ScrollArrow.vue';

const emit = defineEmits(['next', 'back', 'open-rsvp']);

const scrollToNext = () => emit('next');
const handleBack = () => emit('back');
</script>

<style scoped>
.confirmacao-screen {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--parchment-bg);
  overflow-x: hidden;
}

.screen-inner {
  min-height: 100vh;
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--spacing-md);
  padding: clamp(80px, 12vh, 120px) var(--spacing-md);
}

.confirmacao-eyebrow {
  font-family: var(--font-body);
  font-size: clamp(0.6rem, 1.8vw, 0.75rem);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(74, 42, 28, 0.4);
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
  background: rgba(74, 42, 28, 0.12);
}

.ornament-heart { flex-shrink: 0; }

.confirmacao-title {
  font-family: var(--font-fantasy);
  font-size: clamp(1.9rem, 5.5vw, 3rem);
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
  color: rgba(74, 42, 28, 0.55);
  line-height: 1.8;
  font-weight: 300;
  margin: 0;
}

.confirmacao-sub strong { color: var(--navy-dark); font-weight: 500; }

.confirmacao-deadline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.2rem;
  border-radius: var(--radius-full);
  background: rgba(180, 60, 60, 0.08);
  border: 1px solid rgba(180, 60, 60, 0.25);
  font-family: var(--font-body);
  font-size: clamp(0.75rem, 2vw, 0.85rem);
  color: #9b2c2c;
  letter-spacing: 0.04em;
}

.confirmacao-deadline svg { flex-shrink: 0; stroke: #9b2c2c; opacity: 0.8; }
.confirmacao-deadline strong { font-weight: 700; }

.confirmacao-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100px;
}

.confirmacao-divider span:not(.sep-dot) {
  flex: 1;
  height: 1px;
  background: rgba(74, 42, 28, 0.1);
}

.sep-dot { font-size: 0.6rem; color: rgba(74, 42, 28, 0.25); }

.confirmacao-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-top: var(--spacing-xs);
  padding: 1rem 2.4rem;
  border: 1.5px solid rgba(74, 42, 28, 0.3);
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
  box-shadow: 0 8px 24px rgba(74, 42, 28, 0.2);
}

.confirmacao-btn svg { flex-shrink: 0; transition: stroke var(--transition-normal); }

/* ===== SCROLL ARROW (sobre fundo claro) ===== */
.scroll-arrow-wrapper {
  position: fixed;
  bottom: clamp(20px, 4vh, 48px);
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 30;
  pointer-events: none;
}

.scroll-arrow-wrapper :deep(.scroll-arrow) {
  position: static;
  transform: none;
  pointer-events: auto;
  color: var(--navy-dark) !important;
}

.scroll-arrow-wrapper :deep(.scroll-arrow:hover) {
  color: var(--navy-accent) !important;
  transform: scale(1.2);
}
</style>
