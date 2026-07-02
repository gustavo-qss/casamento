<script setup>
import { ref } from "vue";
import { useScrollReveal } from "@/composables/useScrollReveal";
import { getPublicPath } from "@/utils/assets";
import VineCorner from "@/components/ui/VineCorner.vue";
import FloralCorner from "@/components/ui/FloralCorner.vue";

const section = ref(null);
useScrollReveal(section);

const photos = [
  {
    src: getPublicPath("foto1.png"),
    caption: "2016",
    rotation: "-1.6deg",
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
    rotation: "-1.2deg",
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

const seloImg = getPublicPath("selo.png");

const opened = ref(photos.map(() => false));
const flipped = ref(photos.map(() => false));
const hasOpenedAny = ref(false);

const handleActivate = (i) => {
  if (!opened.value[i]) {
    // 1º toque: desenrola o pergaminho revelando a foto
    opened.value = opened.value.map((v, idx) => (idx === i ? true : v));
    hasOpenedAny.value = true;
  } else if (photos[i].story) {
    // já aberto: vira o pergaminho (foto <-> história)
    flipped.value = flipped.value.map((v, idx) => (idx === i ? !v : v));
  }
};

const closeScroll = (i) => {
  opened.value = opened.value.map((v, idx) => (idx === i ? false : v));
  flipped.value = flipped.value.map((v, idx) => (idx === i ? false : v));
};

// Clique nos rolos de madeira: fecha se aberto (traz o selo de volta), abre se fechado
const handleRoller = (i) => {
  if (opened.value[i]) closeScroll(i);
  else handleActivate(i);
};
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

    <div class="gallery-stack">
      <div
        v-for="(photo, i) in photos"
        :key="i"
        class="scroll-wrapper reveal"
        :class="`reveal-delay-${i + 1}`"
      >
        <div
          class="scroll"
          :class="{ 'is-open': opened[i], 'is-flipped': flipped[i] }"
          :style="{ '--tilt': photo.rotation }"
          role="button"
          tabindex="0"
          :aria-label="!opened[i] ? 'Abrir pergaminho' : (photo.story ? (flipped[i] ? 'Ver foto' : 'Ler nossa história') : 'Nossa foto')"
          @click="handleActivate(i)"
          @keyup.enter="handleActivate(i)"
        >
          <!-- Rolo de madeira superior (clique fecha o pergaminho) -->
          <div
            class="roller roller-top"
            :title="opened[i] ? 'Enrolar de volta' : 'Abrir'"
            @click.stop="handleRoller(i)"
          >
            <span class="cap cap-l"></span>
            <span class="cap cap-r"></span>
          </div>

          <!-- Corpo do pergaminho (desenrola) -->
          <div class="sheet">
            <div class="flip3d">
              <!-- FRENTE: foto emoldurada -->
              <div class="face face-front">
                <VineCorner class="v-corner v-tl" />
                <VineCorner class="v-corner v-br" />
                <div class="photo">
                  <img :src="photo.src" :alt="photo.caption" loading="lazy" draggable="false" />
                </div>
                <p class="caption">{{ photo.caption }}</p>
                <span v-if="photo.story" class="flip-hint">toque para ler a história ✦</span>
              </div>

              <!-- VERSO: história escrita no pergaminho -->
              <div v-if="photo.story" class="face face-back">
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
                  <p class="chapter">{{ photo.caption }}</p>
                  <div class="rule"></div>
                  <p class="story">{{ photo.story }}</p>
                  <span class="flip-hint flip-hint--back">toque para voltar ✦</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Rolo de madeira inferior (clique fecha o pergaminho) -->
          <div
            class="roller roller-bottom"
            :title="opened[i] ? 'Enrolar de volta' : 'Abrir'"
            @click.stop="handleRoller(i)"
          >
            <span class="cap cap-l"></span>
            <span class="cap cap-r"></span>
          </div>

          <!-- Selo de cera (visível quando fechado) -->
          <div class="seal" aria-hidden="true">
            <img :src="seloImg" alt="" draggable="false" />
          </div>
        </div>

        <!-- Dica de toque — só na primeira, some após abrir qualquer um -->
        <span v-if="!hasOpenedAny && i === 0" class="open-hint">toque para abrir ✦</span>
      </div>
    </div>
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
  margin-bottom: clamp(2.5rem, 7vw, 3.5rem);
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

/* ===== STACK ===== */
.gallery-stack {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(3rem, 9vw, 4.5rem);
  max-width: 480px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .gallery {
    padding: clamp(4.5rem, 8vw, 7rem) clamp(2rem, 5vw, 5rem);
  }
  .gallery-stack {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    max-width: 760px;
    gap: clamp(2.5rem, 5vw, 3.5rem) clamp(1.5rem, 3vw, 2.5rem);
  }
  .scroll-wrapper { flex: 0 0 auto; width: 320px; }
  .scroll-wrapper:nth-child(even) { margin-top: 2.5rem; }
}

.scroll-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ===== PERGAMINHO ===== */
.scroll {
  --tilt: 0deg;
  --sheet-w: min(88vw, 360px);
  position: relative;
  width: var(--sheet-w);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transform: rotate(var(--tilt));
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
}
@media (min-width: 768px) {
  .scroll { --sheet-w: 320px; }
}
.scroll:hover:not(.is-open) { transform: rotate(0deg) scale(1.02); }

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

/* Folha de pergaminho que desenrola */
.sheet {
  width: var(--sheet-w);
  max-height: 34px;                 /* fechado: só um vinco de pergaminho */
  overflow: hidden;
  perspective: 1500px;
  background:
    var(--tex-parchment) repeat,
    linear-gradient(180deg, #f3e6ca, #e3cda4);
  background-size: 200px, auto;
  box-shadow: inset 0 6px 14px rgba(120, 80, 40, 0.4);
  transition: max-height 0.85s cubic-bezier(0.22, 1, 0.36, 1);
}
.scroll.is-open .sheet {
  max-height: 680px;
  box-shadow:
    inset 0 0 26px rgba(120, 80, 40, 0.22),
    0 6px 22px rgba(0, 0, 0, 0.25);
}

.flip3d {
  position: relative;
  width: 100%;
  transform-style: preserve-3d;
  opacity: 0;
  transition: transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1), opacity 0.4s ease 0.2s;
}
.scroll.is-open .flip3d { opacity: 1; }
.scroll.is-flipped .flip3d { transform: rotateY(180deg); }

/* Faces */
.face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  padding: 16px 16px 14px;
}
.face-front { position: relative; }
.face-back {
  position: absolute;
  inset: 0;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  /* Pergaminho opaco: o texto parece escrito na folha (sem a foto atrás) */
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
.scroll:hover.is-open:not(.is-flipped) .photo img { transform: scale(1.03); }

.caption {
  font-family: var(--font-script);
  font-size: clamp(1.35rem, 4.5vw, 1.7rem);
  color: var(--brown-mid);
  text-align: center;
  margin: 0.5rem 0 0.1rem;
  line-height: 1.1;
}

.flip-hint {
  display: block;
  text-align: center;
  font-family: var(--font-body);
  font-size: clamp(0.58rem, 1.7vw, 0.66rem);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--clay);
  opacity: 0.7;
  margin-top: 2px;
}

/* Verso — história */
.face-back .back-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
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
.flip-hint--back {
  margin-top: 0.4rem;
  opacity: 0.55;
}

/* Selo de cera (imagem selo.png) lacrando o pergaminho fechado */
.seal {
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(90px, 27vw, 120px);
  height: clamp(90px, 27vw, 120px);
  transform: translate(-50%, -50%);
  z-index: 6;
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.seal img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  /* some o fundo branco do PNG sobre o pergaminho, mantendo a cera terracota */
  mix-blend-mode: multiply;
  filter: drop-shadow(0 4px 8px rgba(74, 42, 28, 0.45));
}
.scroll.is-open .seal {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.35) rotate(-8deg);
  pointer-events: none;
}

/* Dica "toque para abrir" */
.open-hint {
  margin-top: 1.8rem;
  font-family: var(--font-body);
  font-size: clamp(0.62rem, 1.9vw, 0.72rem);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--clay);
  opacity: 0.75;
  animation: hintPulse 2.4s ease-in-out infinite;
}
@keyframes hintPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.85; }
}
</style>
