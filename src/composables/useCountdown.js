import { ref, onMounted, onUnmounted } from 'vue';
import dayjs from 'dayjs';

export function useCountdown(targetDate) {
  const days = ref(0);
  const hours = ref(0);
  const minutes = ref(0);
  const seconds = ref(0);
  let interval = null;

  const updateCountdown = () => {
    const now = dayjs();
    const target = dayjs(targetDate);
    const diff = target.diff(now);

    if (diff > 0) {
      days.value = Math.floor(diff / (1000 * 60 * 60 * 24));
      hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      seconds.value = Math.floor((diff % (1000 * 60)) / 1000);
    } else {
      // Casamento já aconteceu
      days.value = 0;
      hours.value = 0;
      minutes.value = 0;
      seconds.value = 0;
    }
  };

  onMounted(() => {
    updateCountdown();
    interval = setInterval(updateCountdown, 1000);
  });

  onUnmounted(() => {
    if (interval) {
      clearInterval(interval);
    }
  });

  return { days, hours, minutes, seconds };
}
