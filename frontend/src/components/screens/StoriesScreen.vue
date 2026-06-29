<template>
  <div
    class="stories-screen"
    @mousedown="handlePress"
    @mouseup="handleRelease"
    @mouseleave="handleRelease"
    @touchstart="handlePress"
    @touchend="handleRelease"
    @click="handleClick"
  >
    <!-- Progress Bars -->
    <div class="progress-bars">
      <ProgressBar
        v-for="(story, index) in stories"
        :key="story.id"
        :active="index === currentStoryIndex"
        :completed="index < currentStoryIndex"
        :progress="index === currentStoryIndex ? progress : 0"
      />
    </div>

    <!-- Story Content — com crossfade entre slides -->
    <Transition name="story-fade">
      <div
        :key="currentStoryIndex"
        class="story-background"
        :style="{ backgroundImage: `url(${currentStory.image})` }"
      >
        <div class="overlay overlay-dark"></div>
      </div>
    </Transition>

    <!-- Moldura de madeira (textura real) com vinhas nos cantos -->
    <div class="story-frame" aria-hidden="true">
      <VineCorner class="vine vine--tl" />
      <VineCorner class="vine vine--tr" />
      <VineCorner class="vine vine--bl" />
      <VineCorner class="vine vine--br" />
    </div>

    <div class="story-content">
      <div class="story-scroll fade-in">
        <span class="story-flame" aria-hidden="true">
          <svg viewBox="0 0 24 32" width="22" height="28">
            <path
              d="M12 1C12 1 4 9 4 17a8 8 0 0 0 16 0c0-3-2-5.5-3.5-8C15 12 14 13 13 12c1.5-4-1-9-1-11z"
              fill="url(#flameGrad)"
            />
            <path
              d="M12 12c0 0-3 3-3 6a3 3 0 0 0 6 0c0-2-1.5-3.5-3-6z"
              fill="#fff6df"
            />
            <defs>
              <linearGradient id="flameGrad" x1="12" y1="1" x2="12" y2="25" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#f6c453" />
                <stop offset="0.55" stop-color="#e3a94c" />
                <stop offset="1" stop-color="#b85f35" />
              </linearGradient>
            </defs>
          </svg>
        </span>
        <p class="story-text">{{ currentStory.text }}</p>
      </div>
    </div>

    <!-- Navigation Areas (invisíveis, para clique) -->
    <div class="tap-areas">
      <div class="tap-left" @click.stop="previousStory"></div>
      <div class="tap-right" @click.stop="handleTapRight"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ProgressBar from '@/components/ui/ProgressBar.vue';
import VineCorner from '@/components/ui/VineCorner.vue';
import BackButton from '@/components/ui/BackButton.vue';
import { useStories } from '@/composables/useStories.js';
import { getPublicPath } from '@/utils/assets';
import storiesData from '@/data/stories.json';

const emit = defineEmits(['complete', 'back']);

// Processar imagens com BASE_URL correto
const stories = ref(storiesData.map(story => ({
  ...story,
  image: getPublicPath(story.image)
})));
const STORY_DURATION = 7000; // 7 segundos

const {
  currentStoryIndex,
  currentStory,
  progress,
  isPaused,
  isLastStory,
  pauseStory,
  resumeStory,
  nextStory,
  previousStory: prevStory,
} = useStories(stories.value, STORY_DURATION);

let pressTimer = null;

const handlePress = () => {
  pauseStory();
  pressTimer = setTimeout(() => {
    // Segurar por mais de 300ms = pausar
  }, 300);
};

const handleRelease = () => {
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
  resumeStory();
};

const handleClick = (e) => {
  // Evitar que o clique padrão cause problemas
  e.preventDefault();
};

const handleTapRight = () => {
  const result = nextStory();
  if (result === 'complete') {
    emit('complete');
  }
};

const previousStory = () => {
  prevStory();
};

const handleBack = () => {
  emit('back');
};
</script>

<style scoped>
/* ===== STORY FADE TRANSITION ===== */
.story-fade-enter-active,
.story-fade-leave-active {
  transition: opacity 0.45s ease;
  position: absolute;
  inset: 0;
}

.story-fade-enter-from,
.story-fade-leave-to {
  opacity: 0;
}

.stories-screen {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Desktop: Container estilo Instagram (celular centralizado) */
@media (min-width: 769px) {
  .stories-screen {
    background: radial-gradient(ellipse at center, #2a1d16 0%, #140d09 100%);
  }

  .stories-screen::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 420px;
    height: 90vh;
    max-height: 800px;
    background-color: var(--navy-deep);
    border-radius: 28px;
    border: 1px solid rgba(242, 230, 214, 0.12);
    box-shadow:
      0 12px 48px rgba(0, 0, 0, 0.7),
      0 0 0 1px rgba(242, 230, 214, 0.05) inset;
    z-index: 0;
  }

  .story-background {
    position: absolute;
    width: 420px;
    height: 90vh;
    max-height: 800px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 24px;
    overflow: hidden;
  }

  /* Moldura acompanha o "celular" de 420px no desktop */
  .story-frame {
    width: 420px;
    height: 90vh;
    max-height: 800px;
    inset: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 24px;
    border-width: 16px;
  }

  .progress-bars {
    position: absolute;
    width: 380px;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: calc(-45vh + 20px);
    padding: 0;
  }

  .story-content {
    position: absolute;
    width: 420px;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 25vh;
    bottom: auto;
  }

  .tap-areas {
    position: absolute;
    width: 420px;
    height: 90vh;
    max-height: 800px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 24px;
  }
}

/* Progress Bars */
.progress-bars {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  right: var(--spacing-sm);
  z-index: var(--z-navigation);
  display: flex;
  gap: 4px;
  padding: 0 var(--spacing-xs);
}

/* Background */
.story-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

/* ===== MOLDURA DE MADEIRA (textura real) ===== */
.story-frame {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  border-style: solid;
  border-width: clamp(16px, 5vw, 26px);
  border-color: #3a2412;
  border-image: var(--tex-wood) 80 round;
  box-shadow:
    inset 0 0 0 3px rgba(0, 0, 0, 0.5),
    inset 0 0 42px rgba(0, 0, 0, 0.6),
    inset 0 0 115px rgba(227, 169, 76, 0.2),   /* luz de vela */
    0 0 0 2px #1c0f06,
    0 16px 44px rgba(0, 0, 0, 0.55);
}

/* Vinhas com folhas e flor nos cantos */
.vine {
  position: absolute;
  width: clamp(46px, 13vw, 76px);
  height: clamp(46px, 13vw, 76px);
  z-index: 6;
}
.vine--tl { top: -7px;    left: -7px; }
.vine--tr { top: -7px;    right: -7px;   transform: scaleX(-1); }
.vine--bl { bottom: -7px; left: -7px;    transform: scaleY(-1); }
.vine--br { bottom: -7px; right: -7px;   transform: scale(-1, -1); }

/* Content */
.story-content {
  position: absolute;
  bottom: 11%;
  left: 0;
  right: 0;
  z-index: var(--z-overlay);
  padding: var(--spacing-lg);
  display: flex;
  justify-content: center;
}

/* ===== PERGAMINHO (scroll do texto) ===== */
.story-scroll {
  position: relative;
  max-width: 520px;
  width: min(86%, 520px);
  margin: 0 auto;
  padding: clamp(1.4rem, 4vw, 2.1rem) clamp(1.5rem, 5vw, 2.4rem);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #3a2113;
  background:
    var(--tex-parchment) repeat,
    linear-gradient(180deg, #f3e6ca 0%, #e3cda4 100%);
  background-size: 220px, auto;
  border-radius: 5px;
  border: 1px solid rgba(74, 42, 28, 0.4);
  box-shadow:
    inset 0 0 34px rgba(120, 80, 40, 0.28),
    0 10px 30px rgba(0, 0, 0, 0.55);
}

/* rolos de madeira nas pontas (estilo pergaminho pendurado) */
.story-scroll::before,
.story-scroll::after {
  content: "";
  position: absolute;
  left: -12px;
  right: -12px;
  height: 16px;
  background:
    var(--tex-wood) repeat,
    linear-gradient(180deg, #6b4326, #3a2412);
  background-size: 120px, auto;
  border-radius: 9px;
  box-shadow:
    inset 0 1px 0 rgba(227, 169, 76, 0.3),
    0 2px 6px rgba(0, 0, 0, 0.55);
}
.story-scroll::before { top: -9px; }
.story-scroll::after  { bottom: -9px; }

/* ===== CHAMA DE VELA (ornamento do texto) ===== */
.story-flame {
  display: block;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 9px rgba(227, 169, 76, 0.8))
          drop-shadow(0 0 20px rgba(184, 95, 53, 0.55));
  transform-origin: 50% 90%;
  animation: candleFlicker 2.4s ease-in-out infinite;
}

.story-text {
  font-family: var(--font-rune);
  font-size: clamp(1.05rem, 3vw, 1.4rem);
  font-weight: 400;
  text-align: center;
  line-height: 1.6;
  max-width: 46ch;
  margin: 0;
  color: #3a2113;
  text-shadow: 0 1px 0 rgba(255, 250, 235, 0.45);
}

/* Tap Areas para navegação */
.tap-areas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: var(--z-overlay);
  display: flex;
}

.tap-left {
  flex: 1;
  cursor: pointer;
}

.tap-right {
  flex: 1;
  cursor: pointer;
}

/* Desktop: ajustes no container tipo celular */
@media (min-width: 769px) {
  .story-text {
    font-size: var(--text-body);
    padding: var(--spacing-md);
    max-width: 90%;
  }

  .story-content {
    bottom: 20%;
  }
}

/* Mobile e Tablet */
@media (max-width: 768px) {
  .progress-bars {
    top: var(--spacing-xs);
    left: var(--spacing-xs);
    right: var(--spacing-xs);
    gap: 3px;
  }

  .story-content {
    bottom: 20%;
    padding: var(--spacing-md);
  }

  .story-text {
    font-size: var(--text-body);
    padding: var(--spacing-md);
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .story-content {
    bottom: 15%;
    padding: var(--spacing-sm);
  }

  .story-text {
    font-size: var(--text-small);
    padding: var(--spacing-sm) var(--spacing-md);
  }
}
</style>
