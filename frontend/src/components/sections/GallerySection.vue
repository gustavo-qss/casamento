<script setup>
import { ref, computed } from "vue";
import { useScrollReveal } from "@/composables/useScrollReveal";
import { getPublicPath } from "@/utils/assets";
import VineCorner from "@/components/ui/VineCorner.vue";
import FloralCorner from "@/components/ui/FloralCorner.vue";

const section = ref(null);
useScrollReveal(section);

const photos = [
  {
    src: getPublicPath("frame1-new.png"),
    caption: "2016",
    rotation: "-1.4deg",
    story:
      "Em 2016, nos conhecemos no colégio por causa do Grêmio Estudantil, sem imaginar que aquele seria o início da nossa história. Nasceu uma amizade que logo se transformou em amor. O tempo passou, mas a parceria que começou na escola continua firme até hoje. Nossa melhor conquista foi encontrar um no outro um companheiro para a vida.",
  },
  {
    src: getPublicPath("foto2.png"),
    caption: "2024",
    rotation: "1deg",
    story:
      "Em 2024, começamos a conquistar nossos sonhos juntos, construindo nosso lar e alcançando objetivos que antes pareciam distantes. Cada passo foi fruto da nossa parceria e do nosso esforço.",
  },
  {
    src: getPublicPath("foto3.png"),
    caption: "2025",
    rotation: "-1.1deg",
    story:
      "Em 2025, em meio aos desafios, alegrias e momentos marcantes da vida, tomamos a decisão mais importante da nossa história: unir nossas vidas em sagrado matrimônio. Com amor, fé e a certeza de que queremos caminhar juntos para sempre, iniciamos um novo capítulo da nossa jornada.",
  },
  {
    src: getPublicPath("foto4.png"),
    caption: "Te esperamos lá",
    rotation: "0.8deg",
    story:
      "Estamos ansiosos para te ver no nosso casamento. Esperamos que a próxima foto seja com você — e que você esteja ao nosso lado nesse dia tão especial.",
  },
];

// Sequência linear de páginas: foto -> história -> foto -> história ...
const pages = [];
photos.forEach((p) => {
  pages.push({ type: "photo", ...p });
  pages.push({ type: "story", ...p });
});

const current = ref(0);
const dir = ref("fwd");

const page = computed(() => pages[current.value]);
const memoryIndex = computed(() => Math.floor(current.value / 2));
const canPrev = computed(() => current.value > 0);
const canNext = computed(() => current.value < pages.length - 1);
const transitionName = computed(() => (dir.value === "fwd" ? "page-fwd" : "page-back"));

const hint = computed(() => {
  if (page.value.type === "photo") return "avance para ler a história ✦";
  if (canNext.value) return "avance para a próxima lembrança ✦";
  return "até 21 de novembro ✦";
});

function next() {
  if (!canNext.value) return;
  dir.value = "fwd";
  current.value++;
}
function prev() {
  if (!canPrev.value) return;
  dir.value = "back";
  current.value--;
}

// Deslizar no celular
let touchX = 0;
function onTouchStart(e) {
  touchX = e.changedTouches[0].clientX;
}
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) < 40) return;
  if (dx < 0) next();
  else prev();
}
</script>

<template>
  <section class="gallery" id="gallery" ref="section">
    <FloralCorner class="bg-floral bg-floral--tl" />
    <FloralCorner class="bg-floral bg-floral--br" />

    <header class="gallery-header reveal">
      <span class="gallery-eyebrow">nossa história</span>
      <div class="gallery-rule">
        <span class="rule-line"></span>
        <svg class="rule-sprig" viewBox="0 0 40 24" fill="none" aria-hidden="true">
          <path d="M20 22 C20 12 20 6 20 2" stroke="#8a6a3e" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M20 10 c -7 -2 -11 -6 -12 -12 c 7 1 11 5 12 12 z" fill="#8a9a5b"/>
          <path d="M20 10 c 7 -2 11 -6 12 -12 c -7 1 -11 5 -12 12 z" fill="#6f7e44"/>
          <g transform="translate(20,3)">
            <g fill="#c66a3a">
              <ellipse cx="0" cy="-3" rx="1.6" ry="2.6"/>
              <ellipse cx="0" cy="3" rx="1.6" ry="2.6"/>
              <ellipse cx="-3" cy="0" rx="2.6" ry="1.6"/>
              <ellipse cx="3" cy="0" rx="2.6" ry="1.6"/>
            </g>
            <circle cx="0" cy="0" r="1.6" fill="#ffd98a"/>
          </g>
        </svg>
        <span class="rule-line"></span>
      </div>
    </header>

    <!-- Carrossel: um pergaminho por vez -->
    <div
      class="carousel-stage"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <Transition :name="transitionName" mode="out-in">
        <div
          class="page"
          :key="current"
          :style="{ '--tilt': page.rotation }"
        >
          <div
            class="scroll"
            role="button"
            tabindex="0"
            :aria-label="page.type === 'photo' ? 'Ver a história desta lembrança' : 'Próxima lembrança'"
            @click="next"
            @keyup.enter="next"
            @keyup.right="next"
            @keyup.left="prev"
          >
            <!-- Rolo de madeira superior -->
            <div class="roller roller-top" aria-hidden="true">
              <span class="cap cap-l"></span>
              <span class="cap cap-r"></span>
            </div>

            <div class="sheet">
              <!-- FOTO -->
              <div v-if="page.type === 'photo'" class="face face-photo">
                <VineCorner class="v-corner v-tl" />
                <VineCorner class="v-corner v-br" />
                <div class="photo">
                  <img :src="page.src" :alt="page.caption" draggable="false" />
                </div>
                <p class="caption">{{ page.caption }}</p>
              </div>

              <!-- HISTÓRIA -->
              <div v-else class="face face-story">
                <VineCorner class="v-corner v-tr" />
                <VineCorner class="v-corner v-bl" />
                <div class="back-inner">
                  <svg class="sprig" viewBox="0 0 44 22" fill="none" aria-hidden="true">
                    <path d="M4 11 H40" stroke="#8a6a3e" stroke-width="1.2" stroke-linecap="round"/>
                    <path d="M22 11 c -5 -3 -8 -8 -8 -14 c 5 2 8 7 8 14 z" fill="#8a9a5b"/>
                    <path d="M22 11 c 5 -3 8 -8 8 -14 c -5 2 -8 7 -8 14 z" fill="#6f7e44"/>
                    <g transform="translate(22,3)">
                      <g fill="#c66a3a">
                        <ellipse cx="0" cy="-3.2" rx="1.8" ry="2.9"/>
                        <ellipse cx="0" cy="3.2" rx="1.8" ry="2.9"/>
                        <ellipse cx="-3.2" cy="0" rx="2.9" ry="1.8"/>
                        <ellipse cx="3.2" cy="0" rx="2.9" ry="1.8"/>
                      </g>
                      <circle cx="0" cy="0" r="1.8" fill="#ffd98a"/>
                    </g>
                  </svg>
                  <p class="chapter">{{ page.caption }}</p>
                  <div class="rule"></div>
                  <p class="story">{{ page.story }}</p>
                </div>
              </div>
            </div>

            <!-- Rolo de madeira inferior -->
            <div class="roller roller-bottom" aria-hidden="true">
              <span class="cap cap-l"></span>
              <span class="cap cap-r"></span>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Controles -->
    <div class="carousel-controls reveal">
      <button
        class="nav-btn"
        :class="{ 'is-hidden': !canPrev }"
        :disabled="!canPrev"
        @click="prev"
        aria-label="Anterior"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <div class="dots" aria-hidden="true">
        <span
          v-for="(p, i) in photos"
          :key="i"
          class="dot"
          :class="{ active: i === memoryIndex }"
        ></span>
      </div>

      <button
        class="nav-btn"
        :class="{ 'is-hidden': !canNext }"
        :disabled="!canNext"
        @click="next"
        aria-label="Próximo"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>

    <p class="carousel-hint reveal">{{ hint }}</p>
  </section>
</template>

<style scoped>
.gallery {
  position: relative;
  padding: clamp(3.5rem, 9vw, 6rem) var(--spacing-md);
  overflow: hidden;
  background:
    radial-gradient(ellipse 60% 40% at 50% 0%, rgba(184, 95, 53, 0.06), transparent 60%),
    var(--parchment-bg);
}

/* Flores de canto (fundo da seção) */
.bg-floral {
  position: absolute;
  width: clamp(120px, 26vw, 230px);
  height: clamp(120px, 26vw, 230px);
  opacity: 0.85;
  z-index: 0;
  pointer-events: none;
}
.bg-floral--tl { top: -14px; left: -14px; }
.bg-floral--br { bottom: -14px; right: -14px; transform: scale(-1, -1); }

/* ===== HEADER ===== */
.gallery-header {
  position: relative;
  z-index: 1;
  text-align: center;
  margin-bottom: clamp(2rem, 6vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
}

.gallery-eyebrow {
  font-family: var(--font-script);
  font-size: clamp(1.9rem, 6vw, 2.8rem);
  color: var(--brown-mid);
  line-height: 1;
}

.gallery-rule {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: clamp(150px, 44vw, 220px);
}
.rule-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--leaf-brown));
  opacity: 0.5;
}
.gallery-rule .rule-line:last-child {
  background: linear-gradient(90deg, var(--leaf-brown), transparent);
}
.rule-sprig { width: 40px; height: 24px; flex: none; }

/* ===== PALCO DO CARROSSEL ===== */
.carousel-stage {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: clamp(540px, 132vw, 620px);
  touch-action: pan-y;
}

.page {
  --tilt: 0deg;
  transform: rotate(var(--tilt));
  will-change: transform, opacity;
}

/* ===== ANIMAÇÃO: pergaminho "assenta" deslizando ===== */
/* Avançar: novo entra pela direita, antigo sai pela esquerda */
.page-fwd-enter-from {
  opacity: 0;
  transform: translateX(42px) rotate(2deg) scale(0.92);
}
.page-fwd-leave-to {
  opacity: 0;
  transform: translateX(-38px) rotate(-1.6deg) scale(0.93);
}
/* Voltar: novo entra pela esquerda, antigo sai pela direita */
.page-back-enter-from {
  opacity: 0;
  transform: translateX(-42px) rotate(-2deg) scale(0.92);
}
.page-back-leave-to {
  opacity: 0;
  transform: translateX(38px) rotate(1.6deg) scale(0.93);
}
.page-fwd-enter-active,
.page-back-enter-active {
  transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.2, 1.1, 0.35, 1);
}
.page-fwd-leave-active,
.page-back-leave-active {
  transition: opacity 0.28s ease, transform 0.34s cubic-bezier(0.55, 0, 0.7, 0.2);
}

@media (prefers-reduced-motion: reduce) {
  .page-fwd-enter-from,
  .page-fwd-leave-to,
  .page-back-enter-from,
  .page-back-leave-to {
    transform: rotate(var(--tilt));
  }
}

/* ===== PERGAMINHO ===== */
.scroll {
  --sheet-w: min(86vw, 360px);
  position: relative;
  width: var(--sheet-w);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
}
@media (min-width: 768px) {
  .scroll { --sheet-w: 340px; }
}

/* Rolos de madeira */
.roller {
  position: relative;
  width: calc(var(--sheet-w) + 12px);
  height: 20px;
  border-radius: 11px;
  background:
    linear-gradient(180deg, rgba(227, 169, 76, 0.35), transparent 40%, rgba(0, 0, 0, 0.45)),
    var(--tex-wood) repeat,
    linear-gradient(180deg, #7a4c29, #3a2412);
  background-size: auto, 120px, auto;
  box-shadow:
    inset 0 1px 0 rgba(227, 169, 76, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5),
    0 3px 7px rgba(0, 0, 0, 0.4);
  z-index: 4;
}
.roller-top { margin-bottom: -3px; }
.roller-bottom { margin-top: -3px; }

/* Tampas de ferro nas pontas dos rolos */
.cap {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 26px;
  transform: translateY(-50%);
  border-radius: 4px;
  background: radial-gradient(circle at 40% 35%, #7b7166, #2c2620 75%);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}
.cap-l { left: -8px; }
.cap-r { right: -8px; }

/* Folha de pergaminho */
.sheet {
  width: var(--sheet-w);
  min-height: calc(var(--sheet-w) * 1.42);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background:
    var(--tex-parchment) repeat,
    linear-gradient(180deg, #f3e6ca, #e3cda4);
  background-size: 200px, auto;
  box-shadow:
    inset 0 0 26px rgba(120, 80, 40, 0.22),
    0 6px 22px rgba(0, 0, 0, 0.25);
}

/* Faces */
.face {
  position: relative;
  flex: 1;
  padding: 16px 16px 14px;
  display: flex;
  flex-direction: column;
}
.face-photo { justify-content: flex-start; }
.face-story {
  justify-content: center;
  background:
    var(--tex-parchment) repeat,
    radial-gradient(ellipse 70% 55% at 50% 45%, #f6ead0, #e6d1a9 100%);
  background-size: 200px, auto;
  box-shadow: inset 0 0 40px rgba(120, 80, 40, 0.28);
}

/* Vinhas nos cantos das faces */
.v-corner {
  position: absolute;
  width: clamp(38px, 12vw, 56px);
  height: clamp(38px, 12vw, 56px);
  z-index: 3;
  pointer-events: none;
}
.v-tl { top: 2px;    left: 2px; }
.v-br { bottom: 2px; right: 2px;  transform: scale(-1, -1); }
.v-tr { top: 2px;    right: 2px;  transform: scaleX(-1); }
.v-bl { bottom: 2px; left: 2px;   transform: scaleY(-1); }

/* Foto */
.photo {
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: 2px;
  background: #e8e0cf;
  box-shadow:
    inset 0 0 0 1px rgba(74, 42, 28, 0.25),
    0 3px 10px rgba(74, 42, 28, 0.25);
}
.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.6s ease;
}
.scroll:hover .photo img { transform: scale(1.03); }

.caption {
  font-family: var(--font-script);
  font-size: clamp(1.35rem, 4.5vw, 1.7rem);
  color: var(--brown-mid);
  text-align: center;
  margin: 0.5rem 0 0.1rem;
  line-height: 1.1;
}

/* Verso — história */
.back-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: clamp(0.8rem, 3vw, 1.4rem) clamp(0.3rem, 1.4vw, 0.6rem);
}
.sprig { width: 44px; height: 22px; opacity: 0.9; }
.chapter {
  font-family: var(--font-script);
  font-size: clamp(1.5rem, 5vw, 1.9rem);
  color: var(--brown-mid);
  text-align: center;
  margin: 0;
  line-height: 1.1;
}
.rule {
  width: 46px;
  height: 1px;
  background: var(--leaf-brown);
  opacity: 0.4;
}
.story {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(0.82rem, 2.4vw, 0.95rem);
  color: var(--brown-deep);
  line-height: 1.62;
  text-align: center;
  margin: 0;
}

/* ===== CONTROLES ===== */
.carousel-controls {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(1.4rem, 7vw, 2.6rem);
  margin-top: clamp(1.4rem, 5vw, 2rem);
}

.nav-btn {
  width: clamp(46px, 12vw, 54px);
  height: clamp(46px, 12vw, 54px);
  border-radius: 50%;
  border: 1.5px solid rgba(138, 106, 62, 0.4);
  background:
    var(--tex-parchment) repeat,
    linear-gradient(180deg, #f3e6ca, #e6d1a9);
  background-size: 120px, auto;
  color: var(--brown-mid);
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow:
    0 3px 10px rgba(74, 42, 28, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.3s ease;
}
.nav-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 5px 14px rgba(74, 42, 28, 0.28);
}
.nav-btn:active { transform: scale(0.96); }
.nav-btn.is-hidden {
  opacity: 0;
  pointer-events: none;
}
.nav-btn svg { width: 42%; height: 42%; }

.dots {
  display: flex;
  gap: 0.5rem;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--leaf-brown);
  opacity: 0.3;
  transition: transform 0.3s ease, opacity 0.3s ease, background 0.3s ease;
}
.dot.active {
  opacity: 0.9;
  transform: scale(1.35);
  background: var(--clay);
}

.carousel-hint {
  text-align: center;
  font-family: var(--font-body);
  font-size: clamp(0.58rem, 1.7vw, 0.68rem);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--clay);
  opacity: 0.7;
  margin: clamp(0.9rem, 3vw, 1.2rem) 0 0;
}
</style>
