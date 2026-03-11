<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

const section = ref(null);
useScrollReveal(section);
</script>

<template>
  <section class="verse-section" id="verse" ref="section">
    <div class="verse-inner">

      <!-- Ornamento topo — dentro do flex, sem position absolute -->
      <div class="ornament-wrap reveal reveal-fade">
        <svg viewBox="0 0 280 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="ornament-svg">
          <path d="M140 24 C122 8  90 4  62 16 C44 24  36 40  52 44 C68 48  88 32 108 28 C124 25 134 27 140 24Z" fill="#9098c7" opacity="0.2"/>
          <path d="M140 24 C158 8 190 4 218 16 C236 24 244 40 228 44 C212 48 192 32 172 28 C156 25 146 27 140 24Z" fill="#9098c7" opacity="0.2"/>
          <circle cx="140" cy="24" r="3.5" fill="#9098c7" opacity="0.4"/>
          <circle cx="112" cy="22" r="2"   fill="#9098c7" opacity="0.25"/>
          <circle cx="168" cy="22" r="2"   fill="#9098c7" opacity="0.25"/>
          <line x1="62"  y1="24" x2="28"  y2="24" stroke="#9098c7" stroke-width="0.8" opacity="0.3"/>
          <line x1="218" y1="24" x2="252" y2="24" stroke="#9098c7" stroke-width="0.8" opacity="0.3"/>
          <circle cx="28"  cy="24" r="1.5" fill="#9098c7" opacity="0.25"/>
          <circle cx="252" cy="24" r="1.5" fill="#9098c7" opacity="0.25"/>
        </svg>
      </div>

      <p class="verse-quote reveal reveal-fade">&ldquo;</p>

      <blockquote class="verse-text reveal reveal-delay-1">
        Assim, eles já não são dois,<br>mas sim uma só carne.
      </blockquote>

      <p class="verse-ref reveal reveal-delay-2">Mateus 19:6</p>

      <div class="initials-row reveal reveal-delay-3">
        <span class="initials-line"></span>
        <span class="initials">R &nbsp;|&nbsp; G</span>
        <span class="initials-line"></span>
      </div>

      <p class="wedding-announcement reveal reveal-delay-4">Nós vamos nos casar!</p>

      <!-- Ornamento base — espelhado verticalmente via CSS -->
      <div class="ornament-wrap ornament-flip reveal reveal-fade">
        <svg viewBox="0 0 280 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="ornament-svg">
          <path d="M140 24 C122 8  90 4  62 16 C44 24  36 40  52 44 C68 48  88 32 108 28 C124 25 134 27 140 24Z" fill="#9098c7" opacity="0.2"/>
          <path d="M140 24 C158 8 190 4 218 16 C236 24 244 40 228 44 C212 48 192 32 172 28 C156 25 146 27 140 24Z" fill="#9098c7" opacity="0.2"/>
          <circle cx="140" cy="24" r="3.5" fill="#9098c7" opacity="0.4"/>
          <circle cx="112" cy="22" r="2"   fill="#9098c7" opacity="0.25"/>
          <circle cx="168" cy="22" r="2"   fill="#9098c7" opacity="0.25"/>
          <line x1="62"  y1="24" x2="28"  y2="24" stroke="#9098c7" stroke-width="0.8" opacity="0.3"/>
          <line x1="218" y1="24" x2="252" y2="24" stroke="#9098c7" stroke-width="0.8" opacity="0.3"/>
          <circle cx="28"  cy="24" r="1.5" fill="#9098c7" opacity="0.25"/>
          <circle cx="252" cy="24" r="1.5" fill="#9098c7" opacity="0.25"/>
        </svg>
      </div>

    </div>
  </section>
</template>

<style scoped>
.verse-section {
  background-color: var(--cream);
  padding: clamp(3.5rem, 10vw, 6rem) var(--spacing-md);
  text-align: center;
}

.verse-inner {
  max-width: 520px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

@media (min-width: 768px) {
  .verse-section {
    padding: clamp(5rem, 12vw, 9rem) var(--spacing-md);
  }

  .verse-inner {
    max-width: 700px;
  }

  .verse-text {
    font-size: clamp(1.25rem, 2vw, 1.6rem);
  }

  .wedding-announcement {
    font-size: clamp(2.2rem, 4vw, 3.2rem);
  }
}

/* Ornamento: sem absolute — fica no fluxo do flex */
.ornament-wrap {
  width: clamp(200px, 55vw, 280px);
  line-height: 0;
}

.ornament-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Espelha verticalmente sem afetar o centering */
.ornament-flip .ornament-svg {
  transform: scaleY(-1);
}

.verse-quote {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 8vw, 4rem);
  color: var(--lavender-dark);
  line-height: 0.4;
  opacity: 0.35;
  margin: 0;
}

.verse-text {
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 3.5vw, 1.35rem);
  font-style: italic;
  color: var(--navy-dark);
  line-height: 1.75;
  font-weight: 400;
  margin: 0;
}

.verse-ref {
  font-family: var(--font-body);
  font-size: clamp(0.65rem, 2vw, 0.8rem);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--lavender-dark);
  margin: 0;
  font-weight: 400;
}

.initials-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: clamp(180px, 50vw, 260px);
  margin: var(--spacing-xs) 0;
}

.initials-line {
  flex: 1;
  height: 1px;
  background: var(--lavender-dark);
  opacity: 0.3;
}

.initials {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 4vw, 1.7rem);
  color: var(--navy-dark);
  letter-spacing: 0.12em;
  white-space: nowrap;
}

.wedding-announcement {
  font-family: var(--font-script);
  font-size: clamp(1.8rem, 6vw, 2.6rem);
  color: var(--navy-mid);
  margin: 0;
  line-height: 1.3;
}
</style>
