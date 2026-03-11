<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

const section = ref(null);
useScrollReveal(section);
</script>

<template>
  <section class="message" id="message" ref="section">
    <div class="message-inner">
      <div class="message-ornament reveal">
        <svg viewBox="0 0 100 32" fill="none" class="ornament-svg">
          <path d="M50 16 C40 6 20 2 5 12 C0 16 0 20 5 22 C15 26 30 18 40 16 C45 15 48 16 50 16Z" fill="var(--lavender-dark)" opacity="0.2"/>
          <path d="M50 16 C60 6 80 2 95 12 C100 16 100 20 95 22 C85 26 70 18 60 16 C55 15 52 16 50 16Z" fill="var(--lavender-dark)" opacity="0.2"/>
          <circle cx="50" cy="16" r="3" fill="var(--lavender-dark)" opacity="0.3"/>
        </svg>
      </div>

      <p class="message-quote reveal reveal-delay-1">
        Com o amor que nos une, a bênção de Deus e o carinho de nossas famílias,
        decidimos unir nossas vidas em matrimônio.
      </p>

      <div class="message-divider reveal reveal-delay-2">
        <span></span><span class="ornament-char">✦</span><span></span>
      </div>

      <p class="message-quote reveal reveal-delay-3">
        Será uma alegria celebrar esse momento tão especial com você.
      </p>

      <p class="message-signature reveal reveal-delay-4">Rawane &amp; Gustavo</p>
    </div>
  </section>
</template>

<style scoped>
.message {
  background: var(--cream);
  padding: clamp(3.5rem, 10vw, 6rem) var(--spacing-md);
}

.message-inner {
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.message-ornament {
  width: clamp(80px, 25vw, 120px);
}

.ornament-svg {
  width: 100%;
  height: auto;
}

.message-quote {
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 3.2vw, 1.3rem);
  font-style: italic;
  color: var(--navy-dark);
  line-height: 1.8;
  font-weight: 400;
  margin: 0;
}

.message-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100px;
}

.message-divider span:not(.ornament-char) {
  flex: 1;
  height: 1px;
  background: var(--lavender-dark);
  opacity: 0.3;
}

.ornament-char {
  font-size: 0.6rem;
  color: var(--lavender-dark);
  opacity: 0.55;
}

.message-signature {
  font-family: var(--font-script);
  font-size: clamp(1.8rem, 5.5vw, 2.5rem);
  color: var(--navy-mid);
  margin: 0;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .message-inner {
    max-width: 680px;
  }

  .message-quote {
    font-size: clamp(1.15rem, 1.8vw, 1.45rem);
  }

  .message-signature {
    font-size: clamp(2.2rem, 3.5vw, 3rem);
  }
}
</style>
