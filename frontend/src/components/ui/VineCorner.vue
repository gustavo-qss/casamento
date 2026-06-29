<template>
  <svg class="vine-corner" viewBox="0 0 90 90" fill="none" aria-hidden="true">
    <!-- ramos -->
    <path d="M4 4 C 26 8 36 18 40 38 C 42 50 50 58 72 60"
          stroke="#7c8a4a" stroke-width="2.4" stroke-linecap="round" />
    <path d="M4 4 C 8 26 18 36 38 40"
          stroke="#7c8a4a" stroke-width="2.4" stroke-linecap="round" />
    <!-- folhas -->
    <path d="M40 38 c -10 -4 -17 2 -19 11 c 11 2 17 -3 19 -11 z" fill="#8a9a5b" />
    <path d="M38 40 c -4 -10 2 -17 11 -19 c 2 11 -3 17 -11 19 z" fill="#8a9a5b" />
    <path d="M44 44 c 9 -1 15 4 17 12 c -9 1 -15 -4 -17 -12 z" fill="#6f7e44" />
    <!-- pequena flor -->
    <g transform="translate(13,13)">
      <g fill="#c66a3a">
        <ellipse cx="0" cy="-6.5" rx="2.7" ry="4.2" />
        <ellipse cx="0" cy="6.5" rx="2.7" ry="4.2" />
        <ellipse cx="-6.5" cy="0" rx="4.2" ry="2.7" />
        <ellipse cx="6.5" cy="0" rx="4.2" ry="2.7" />
      </g>
      <circle cx="0" cy="0" r="3" fill="#ffd98a" />
    </g>
  </svg>
</template>

<script setup>
</script>

<style scoped>
.vine-corner {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}
</style>
