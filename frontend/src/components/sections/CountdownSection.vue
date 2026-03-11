<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
import { getPublicPath } from '@/utils/assets';
import weddingInfo from '@/data/wedding-info.json';

const section = ref(null);
useScrollReveal(section);

const bgImg = getPublicPath('countdown.jpeg');
const TARGET = new Date(weddingInfo.weddingDate);

const days    = ref(0);
const hours   = ref(0);
const minutes = ref(0);
const seconds = ref(0);

let timer;

function update() {
  const diff = TARGET - Date.now();
  if (diff <= 0) {
    days.value = hours.value = minutes.value = seconds.value = 0;
    return;
  }
  days.value    = Math.floor(diff / 864e5);
  hours.value   = Math.floor((diff % 864e5) / 36e5);
  minutes.value = Math.floor((diff % 36e5) / 6e4);
  seconds.value = Math.floor((diff % 6e4) / 1e3);
}

onMounted(() => {
  update();
  timer = setInterval(update, 1000);
});

onUnmounted(() => clearInterval(timer));

const pad = (n) => String(n).padStart(2, '0');
</script>

<template>
  <section class="countdown" id="countdown" ref="section">
    <div class="countdown-bg">
      <img :src="bgImg" alt="" class="countdown-photo" />
      <div class="countdown-overlay"></div>
    </div>

    <div class="countdown-content">
      <span class="countdown-label reveal reveal-fade">faltam apenas</span>

      <div class="countdown-grid reveal reveal-delay-2">
        <div class="count-item">
          <span class="count-number">{{ pad(days) }}</span>
          <span class="count-unit">Dias</span>
        </div>
        <span class="count-sep">:</span>
        <div class="count-item">
          <span class="count-number">{{ pad(hours) }}</span>
          <span class="count-unit">Horas</span>
        </div>
        <span class="count-sep">:</span>
        <div class="count-item">
          <span class="count-number">{{ pad(minutes) }}</span>
          <span class="count-unit">Minutos</span>
        </div>
        <span class="count-sep">:</span>
        <div class="count-item">
          <span class="count-number">{{ pad(seconds) }}</span>
          <span class="count-unit">Segundos</span>
        </div>
      </div>

      <p class="countdown-sub reveal reveal-delay-3">para o nosso grande dia</p>
    </div>
  </section>
</template>

<style scoped>
.countdown {
  position: relative;
  min-height: 440px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.countdown-bg {
  position: absolute;
  inset: 0;
}

.countdown-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: brightness(0.35) saturate(0.5);
}

.countdown-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(6, 14, 28, 0.72) 0%,
    rgba(13, 31, 60, 0.88) 100%
  );
}

.countdown-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: clamp(3rem, 8vw, 5rem) var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1rem, 3vw, 1.8rem);
}

.countdown-label {
  font-family: var(--font-body);
  font-size: clamp(0.62rem, 1.8vw, 0.78rem);
  font-weight: 300;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(197, 223, 245, 0.6);
}

.countdown-grid {
  display: flex;
  align-items: center;
  gap: clamp(0.7rem, 2.5vw, 1.6rem);
}

.count-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.count-number {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 10vw, 5rem);
  font-weight: 400;
  color: var(--white);
  line-height: 1;
  letter-spacing: 0.04em;
  min-width: 2ch;
  text-align: center;
}

.count-unit {
  font-family: var(--font-body);
  font-size: clamp(0.5rem, 1.4vw, 0.65rem);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(197, 223, 245, 0.55);
  font-weight: 300;
}

.count-sep {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 6vw, 3.2rem);
  color: rgba(197, 223, 245, 0.35);
  line-height: 1;
  margin-bottom: 1.2rem;
  font-weight: 300;
}

.countdown-sub {
  font-family: var(--font-script);
  font-size: clamp(1.4rem, 4.5vw, 2rem);
  color: rgba(197, 223, 245, 0.65);
  margin: 0;
  line-height: 1.3;
}

/* ============================================
   DESKTOP (≥ 768px)
   ============================================ */
@media (min-width: 768px) {
  .countdown {
    min-height: clamp(460px, 55vh, 620px);
  }

  /* Imagem menos escura e com melhor enquadramento */
  .countdown-photo {
    filter: brightness(0.45) saturate(0.6);
    object-position: center 30%;
  }

  /* Números maiores e melhor espaçamento */
  .count-number {
    font-size: clamp(4rem, 6vw, 7rem);
  }

  .count-unit {
    font-size: 0.72rem;
    letter-spacing: 0.22em;
  }

  .count-sep {
    font-size: clamp(2.4rem, 4vw, 4rem);
    margin-bottom: 1.5rem;
  }

  .countdown-grid {
    gap: clamp(1.2rem, 3vw, 3rem);
  }

  .countdown-content {
    padding: 4rem 2rem;
    gap: 2rem;
  }

  .countdown-label {
    font-size: 0.82rem;
    letter-spacing: 0.3em;
  }

  .countdown-sub {
    font-size: clamp(1.8rem, 3vw, 2.6rem);
  }
}
</style>
