<template>
  <svg class="olive" viewBox="0 0 240 44" fill="none" aria-hidden="true">
    <!-- caule -->
    <path d="M6 22 C 70 18, 120 18, 234 22" stroke="#7e8a52" stroke-width="1.6" stroke-linecap="round" />
    <!-- folhas (alternadas) -->
    <g fill="#6f7e44">
      <ellipse cx="40"  cy="13" rx="13" ry="5" transform="rotate(-22 40 13)" />
      <ellipse cx="66"  cy="31" rx="13" ry="5" transform="rotate(20 66 31)" />
      <ellipse cx="92"  cy="12" rx="14" ry="5" transform="rotate(-20 92 12)" />
      <ellipse cx="120" cy="32" rx="14" ry="5" transform="rotate(18 120 32)" />
      <ellipse cx="148" cy="12" rx="14" ry="5" transform="rotate(-18 148 12)" />
      <ellipse cx="174" cy="31" rx="13" ry="5" transform="rotate(22 174 31)" />
      <ellipse cx="200" cy="13" rx="13" ry="5" transform="rotate(-22 200 13)" />
    </g>
    <g fill="#8a9a5b">
      <ellipse cx="53"  cy="22" rx="11" ry="4.2" transform="rotate(-6 53 22)" />
      <ellipse cx="107" cy="22" rx="12" ry="4.2" transform="rotate(-4 107 22)" />
      <ellipse cx="161" cy="22" rx="12" ry="4.2" transform="rotate(-4 161 22)" />
    </g>
    <!-- azeitonas -->
    <g fill="#566a39">
      <circle cx="120" cy="22" r="3.4" />
      <circle cx="80"  cy="24" r="3" />
      <circle cx="160" cy="20" r="3" />
    </g>
  </svg>
</template>

<script setup></script>

<style scoped>
.olive {
  display: block;
  width: clamp(160px, 34vw, 260px);
  height: auto;
}
</style>
