import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useStories(storiesData, duration = 7000) {
  const currentStoryIndex = ref(0);
  const progress = ref(0);
  const isPaused = ref(false);
  let interval = null;
  let startTime = null;
  let remainingTime = duration;

  const currentStory = computed(() => storiesData[currentStoryIndex.value]);
  const isLastStory = computed(() => currentStoryIndex.value === storiesData.length - 1);

  const startTimer = () => {
    if (interval) return;

    startTime = Date.now();

    interval = setInterval(() => {
      if (!isPaused.value) {
        const elapsed = Date.now() - startTime;
        progress.value = (elapsed / duration) * 100;

        if (progress.value >= 100) {
          nextStory();
        }
      }
    }, 50); // Update mais frequente para suavidade
  };

  const pauseStory = () => {
    if (!isPaused.value) {
      isPaused.value = true;
      const elapsed = Date.now() - startTime;
      remainingTime = duration - elapsed;
    }
  };

  const resumeStory = () => {
    if (isPaused.value) {
      isPaused.value = false;
      startTime = Date.now() - (duration - remainingTime);
    }
  };

  const nextStory = () => {
    if (currentStoryIndex.value < storiesData.length - 1) {
      currentStoryIndex.value++;
      resetProgress();
    } else {
      // Último story, emitir evento de conclusão
      stopTimer();
      return 'complete';
    }
  };

  const previousStory = () => {
    if (currentStoryIndex.value > 0) {
      currentStoryIndex.value--;
      resetProgress();
    }
  };

  const resetProgress = () => {
    progress.value = 0;
    remainingTime = duration;
    startTime = Date.now();
  };

  const stopTimer = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  const goToStory = (index) => {
    if (index >= 0 && index < storiesData.length) {
      currentStoryIndex.value = index;
      resetProgress();
    }
  };

  onMounted(() => {
    startTimer();
  });

  onUnmounted(() => {
    stopTimer();
  });

  return {
    currentStoryIndex,
    currentStory,
    progress,
    isPaused,
    isLastStory,
    pauseStory,
    resumeStory,
    nextStory,
    previousStory,
    goToStory,
    startTimer,
    stopTimer,
  };
}
