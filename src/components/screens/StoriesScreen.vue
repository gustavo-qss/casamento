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

    <!-- Story Content -->
    <div
      class="story-background"
      :style="{ backgroundImage: `url(${currentStory.image})` }"
    >
      <div class="overlay overlay-dark"></div>
    </div>

    <div class="story-content">
      <p class="story-text fade-in">{{ currentStory.text }}</p>
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
import { useStories } from '@/composables/useStories.js';
import storiesData from '@/data/stories.json';

const emit = defineEmits(['complete']);

const stories = ref(storiesData);
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
</script>

<style scoped>
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
    background-color: #1a1a1a;
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
    background-color: #000;
    border-radius: 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
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

/* Content */
.story-content {
  position: absolute;
  bottom: 25%;
  left: 0;
  right: 0;
  z-index: var(--z-overlay);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.story-text {
  color: var(--white);
  font-family: var(--font-body);
  font-size: var(--text-subtitle);
  font-weight: 400;
  text-align: center;
  line-height: 1.6;
  max-width: 800px;
  margin: 0;
  padding: var(--spacing-lg);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-md);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
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
