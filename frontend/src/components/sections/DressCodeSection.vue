<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

const section = ref(null);
useScrollReveal(section);
</script>

<template>
  <section class="dresscode" id="dresscode" ref="section">
    <div class="dresscode-inner">
      <span class="dresscode-label reveal">código de vestimenta</span>

      <div class="dresscode-icons reveal reveal-delay-1">
        <svg class="icon-suit" viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 8 L8 28 L20 32 L20 72 L44 72 L44 32 L56 28 L44 8 L36 20 L32 14 L28 20 Z" fill="none" stroke="var(--navy-dark)" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M28 20 L32 30 L36 20" fill="none" stroke="var(--navy-dark)" stroke-width="1.5" stroke-linejoin="round"/>
          <circle cx="32" cy="38" r="2" fill="var(--navy-dark)" opacity="0.4"/>
          <circle cx="32" cy="46" r="2" fill="var(--navy-dark)" opacity="0.4"/>
          <circle cx="32" cy="54" r="2" fill="var(--navy-dark)" opacity="0.4"/>
        </svg>
        <div class="icon-separator">
          <span>✦</span>
        </div>
        <svg class="icon-dress" viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 8 Q32 4 40 8 L44 20 Q38 18 32 18 Q26 18 20 20 Z" fill="none" stroke="var(--navy-dark)" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M20 20 Q18 32 14 48 L8 72 L56 72 L50 48 Q46 32 44 20" fill="none" stroke="var(--navy-dark)" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M14 48 Q32 55 50 48" fill="none" stroke="var(--navy-dark)" stroke-width="1.2" stroke-dasharray="2 2" opacity="0.4"/>
        </svg>
      </div>

      <h2 class="dresscode-title reveal reveal-delay-2">Traje formal</h2>

      <p class="dresscode-text reveal reveal-delay-3">
        Com carinho, pedimos aos convidados que evitem roupas na cor branca,
        para que essa cor seja reservada à noiva.
      </p>

      <div class="dresscode-note reveal reveal-delay-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span><strong>Evitar roupas nas cor terracota.</strong></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dresscode {
  background: var(--white);
  padding: clamp(3rem, 10vw, 6rem) var(--spacing-md);
}

.dresscode-inner {
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.dresscode-label {
  font-family: var(--font-body);
  font-size: clamp(0.6rem, 1.8vw, 0.75rem);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--lavender-dark);
  font-weight: 400;
}

.dresscode-icons {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin: var(--spacing-xs) 0;
}

.icon-suit,
.icon-dress {
  width: clamp(48px, 12vw, 64px);
  height: auto;
  opacity: 0.8;
}

.icon-separator {
  font-size: 0.6rem;
  color: var(--lavender-dark);
  opacity: 0.45;
}

.dresscode-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 5.5vw, 2.8rem);
  font-weight: 400;
  color: var(--navy-dark);
  margin: 0;
}

.dresscode-text {
  font-family: var(--font-body);
  font-size: clamp(0.9rem, 2.5vw, 1.05rem);
  color: var(--text-muted);
  line-height: 1.75;
  font-weight: 300;
  margin: 0;
}

.dresscode-note {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  border: 1px solid rgba(144, 152, 199, 0.3);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: clamp(0.7rem, 2vw, 0.82rem);
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--lavender-dark);
  background: rgba(177, 185, 231, 0.06);
}

.dresscode-note svg {
  flex-shrink: 0;
  stroke: var(--lavender-dark);
}

@media (min-width: 768px) {
  .dresscode-inner {
    max-width: 640px;
  }

  .dresscode-title {
    font-size: clamp(2.2rem, 3.5vw, 3.2rem);
  }

  .dresscode-text {
    font-size: clamp(1rem, 1.6vw, 1.15rem);
  }

  .icon-suit,
  .icon-dress {
    width: clamp(56px, 6vw, 72px);
  }
}
</style>
