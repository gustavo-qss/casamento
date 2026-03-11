import { onMounted, onUnmounted } from 'vue';

export function useScrollReveal(containerRef) {
  let observer;

  onMounted(() => {
    const root = containerRef?.value ?? document;
    const targets = root.querySelectorAll
      ? root.querySelectorAll('[class*="reveal"]')
      : [];

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  });

  onUnmounted(() => {
    if (observer) observer.disconnect();
  });
}
