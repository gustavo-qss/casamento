<script setup>
import { ref } from "vue";
import { useScrollReveal } from "@/composables/useScrollReveal";
import { getPublicPath } from "@/utils/assets";

const section = ref(null);
useScrollReveal(section);

const photos = [
  {
    src: getPublicPath("storie1.jpeg"),
    caption: "Nosso começo",
    rotation: "-2.2deg",
    story:
      "Foi em uma partida de truco com amigos em comum que tudo começou, horas trocadas nos intervalos do colégio e alguns finais de semana que foram transformando aquela amizade em amor. Vieram desafios, mas nunca desistimos um do outro.",
  },
  {
    src: getPublicPath("transplante.jpeg"),
    caption: "De corpo e alma",
    rotation: "-1deg",
    story:
      "Com o tempo, a Rawane perdeu a função dos rins e precisou de um transplante. O Gustavo foi o único compatível, e doou um rim grande, gordo e muito saudável pra ela. Desde então a vida dos dois voltou ao normal, e finalmente puderam selar essa união como sempre sonharam.",
  },
  {
    src: getPublicPath("stories3.jpeg"),
    caption: "Momentos juntos",
    rotation: "1.5deg",
    story:
      "Com a vida de volta aos trilhos, a Rawane encerrando a faculdade de veterinária e o Gustavo o mestrado, chegou a hora de unir não só o corpo, dividindo o rim, mas a alma perante a Deus. É com enorme alegria que te convidamos a fazer parte dessa história.",
  },
  {
    src: getPublicPath("storie2.jpeg"),
    caption: "Te esperamos lá",
    rotation: "-1deg",
    story:
      "Estamos ansiosos para te ver no nosso casamento. Esperamos que a próxima foto seja com você — e que você esteja ao nosso lado nesse dia tão especial.",
  },
];

const flipped = ref([false, false, false, false]);
const hasFlippedFirst = ref(false);

const toggle = (i) => {
  flipped.value = flipped.value.map((v, idx) => (idx === i ? !v : v));
  if (i === 0) hasFlippedFirst.value = true;
};
</script>

<template>
  <section class="gallery" id="gallery" ref="section">
    <header class="gallery-header reveal">
      <span class="gallery-eyebrow">nossa história</span>
      <div class="gallery-rule">
        <span></span><span class="rule-dot">✦</span><span></span>
      </div>
    </header>

    <div class="gallery-stack">
      <div
        v-for="(photo, i) in photos"
        :key="i"
        class="polaroid-wrapper reveal"
        :class="`reveal-delay-${i + 1}`"
      >
        <!-- flip-scene: segura rotação + perspective; separado do reveal -->
        <div
          class="flip-scene"
          :class="{ 'is-flipped': flipped[i] }"
          :style="{ '--rot': photo.rotation }"
          @click="toggle(i)"
          :aria-label="flipped[i] ? 'Ver foto' : 'Ler história'"
          role="button"
          tabindex="0"
          @keyup.enter="toggle(i)"
        >
          <div class="flip-card">
            <!-- Frente: foto -->
            <div class="flip-face flip-front">
              <div class="polaroid-pin"></div>
              <span class="flip-hint">toque para ver nossa história ✦</span>
              <div class="polaroid-photo">
                <img
                  :src="photo.src"
                  :alt="photo.caption"
                  loading="lazy"
                  draggable="false"
                />
              </div>
              <!-- Cursor de clique — só na primeira foto, some após o primeiro flip -->
              <div
                v-if="!hasFlippedFirst"
                class="cursor-hint"
                aria-hidden="true"
              >
                <div class="cursor-ripple"></div>
                <svg
                  class="cursor-svg"
                  viewBox="0 0 13 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.5 1.5 L1.5 13 L4.5 10.5 L6.5 15.5 L9 14.5 L7 9.5 L10.5 9.5 Z"
                    fill="white"
                    stroke="#222"
                    stroke-width="1"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <p class="polaroid-caption">{{ photo.caption }}</p>
            </div>

            <!-- Verso: texto da história -->
            <div class="flip-face flip-back">
              <div class="polaroid-pin"></div>
              <div class="back-content">
                <p class="back-chapter">{{ photo.caption }}</p>
                <div class="back-rule"></div>
                <p class="back-text">{{ photo.story }}</p>
              </div>
              <span class="flip-hint">toque para voltar ✦</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery {
  background: #f9f6f0;
  padding: clamp(3rem, 8vw, 5rem) var(--spacing-md);
  overflow: hidden;
}

/* Header */
.gallery-header {
  text-align: center;
  margin-bottom: clamp(2rem, 6vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.gallery-eyebrow {
  font-family: var(--font-body);
  font-size: clamp(0.62rem, 2vw, 0.78rem);
  font-weight: 400;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--lavender-dark);
}

.gallery-rule {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 90px;
}

.gallery-rule span:not(.rule-dot) {
  flex: 1;
  height: 1px;
  background: var(--lavender-dark);
  opacity: 0.3;
}

.rule-dot {
  font-size: 0.55rem;
  color: var(--lavender-dark);
  opacity: 0.5;
}

/* Stack — mobile: coluna */
.gallery-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(2rem, 6vw, 3.5rem);
  max-width: 500px;
  margin: 0 auto;
}

/* Wrapper de reveal — sem transform própria */
.polaroid-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* ============================================
   DESKTOP — 3 colunas lado a lado (≥ 768px)
   ============================================ */
@media (min-width: 768px) {
  .gallery {
    padding: clamp(4rem, 8vw, 7rem) clamp(2.5rem, 5vw, 6rem);
  }

  .gallery-stack {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    max-width: 1180px;
    gap: 2.5rem;
  }

  .polaroid-wrapper {
    flex: 1;
    max-width: 340px;
  }

  .flip-scene {
    width: 100%;
  }

  /* Deslocamento vertical — efeito "espalhado na mesa" */
  .polaroid-wrapper:nth-child(2) {
    margin-top: 3rem;
  }
  .polaroid-wrapper:nth-child(3) {
    margin-top: 1.2rem;
  }
}

/* ===== FLIP SCENE ===== */
/* Segura a rotação de polaroid + perspective para o 3D */
.flip-scene {
  --rot: 0deg;
  width: clamp(240px, 72vw, 380px);
  perspective: 1400px;
  cursor: pointer;
  transform: rotate(var(--rot));
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
}

.flip-scene:hover:not(.is-flipped) {
  transform: rotate(0deg) scale(1.025);
}

/* ===== FLIP CARD ===== */
.flip-card {
  position: relative;
  width: 100%;
  transform-style: preserve-3d;
  transition: transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.is-flipped .flip-card {
  transform: rotateY(180deg);
}

/* ===== FACES ===== */
.flip-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  background: #ffffff;
  border-radius: 2px;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.13),
    0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 14px 14px 52px;
  position: relative;
  overflow: hidden;
}

.flip-front {
  /* face frontal: fluxo normal — define a altura total */
}

.flip-back {
  /* face traseira: absoluta sobre a frente, rotacionada 180° */
  position: absolute;
  inset: 0;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 24px 20px 52px;
  /* Textura sutil de papel */
  background:
    radial-gradient(
      ellipse at 80% 20%,
      rgba(177, 185, 231, 0.08) 0%,
      transparent 55%
    ),
    #ffffff;
}

/* Pino decorativo no topo */
.polaroid-pin {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: rgba(144, 152, 199, 0.35);
  border-radius: 999px;
}

/* ===== FRENTE ===== */
.polaroid-photo {
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #e8e4dc;
}

.polaroid-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.6s ease;
}

.flip-scene:hover:not(.is-flipped) .polaroid-photo img {
  transform: scale(1.04);
}

.polaroid-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-script);
  font-size: clamp(1rem, 3.5vw, 1.25rem);
  color: var(--navy-dark);
  opacity: 0.75;
  margin: 0;
}

/* ===== VERSO ===== */
.back-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.back-chapter {
  font-family: var(--font-script);
  font-size: clamp(1.4rem, 4.5vw, 1.8rem);
  color: var(--navy-dark);
  opacity: 0.85;
  text-align: center;
  margin: 0;
  line-height: 1.2;
}

.back-rule {
  width: 48px;
  height: 1px;
  background: var(--lavender-dark);
  opacity: 0.3;
  margin: 0 auto;
}

.back-text {
  font-family: var(--font-body);
  font-size: clamp(0.8rem, 2.2vw, 0.92rem);
  color: #555;
  line-height: 1.75;
  font-weight: 300;
  text-align: center;
  margin: 0;
}

/* ===== HINT ===== */
.flip-hint {
  display: block;
  text-align: center;
  font-family: var(--font-body);
  font-size: clamp(0.6rem, 1.8vw, 0.68rem);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--lavender-dark);
  opacity: 0.7;
  padding: 6px 0 8px;
  line-height: 1;
}

/* Hint do verso: dentro do back, posição absoluta na base */
.flip-back .flip-hint {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  padding: 0;
  opacity: 0.45;
}

/* ===== CURSOR HINT ===== */
.cursor-hint {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 28px;
  height: 28px;
  pointer-events: none;
  z-index: 3;
}

.cursor-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 22px;
  height: 26px;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.45));
  animation: cursorPress 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  z-index: 2;
}

.cursor-ripple {
  position: absolute;
  top: -4px;
  left: -4px;
  width: 20px;
  height: 20px;
  border: 1.5px solid rgba(255, 255, 255, 0.75);
  border-radius: 50%;
  animation: cursorRipple 2.6s ease-out infinite;
}

@keyframes cursorPress {
  0%,
  30% {
    transform: scale(1) translate(0, 0);
  }
  48% {
    transform: scale(0.8) translate(1px, 2px);
  }
  62% {
    transform: scale(1) translate(0, 0);
  }
  100% {
    transform: scale(1) translate(0, 0);
  }
}

@keyframes cursorRipple {
  0%,
  35% {
    transform: scale(0);
    opacity: 0;
  }
  42% {
    transform: scale(0.4);
    opacity: 0.7;
  }
  80% {
    transform: scale(2.4);
    opacity: 0;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}
</style>
