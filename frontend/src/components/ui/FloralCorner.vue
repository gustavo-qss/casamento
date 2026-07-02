<template>
  <!-- Cluster de flores secas / outonais para os cantos, no estilo da
       identidade visual (dálias creme, folhas ferrugem, trigo, terracota). -->
  <svg
    class="floral-corner"
    viewBox="0 0 220 220"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <!-- ===== ramos / folhagem seca de fundo ===== -->
    <g stroke-linecap="round">
      <path d="M8 8 C 40 26 58 44 70 78" stroke="#8a6a3e" stroke-width="2.2" opacity="0.7" />
      <path d="M8 8 C 30 40 40 66 44 98" stroke="#8a6a3e" stroke-width="2" opacity="0.6" />
      <path d="M8 8 C 52 18 84 22 116 30" stroke="#8a6a3e" stroke-width="2" opacity="0.6" />
    </g>

    <!-- folhas pontudas (ferrugem / marrom) -->
    <g>
      <path d="M70 78 c -18 -10 -30 -4 -40 10 c 18 12 34 6 40 -10 z" fill="#9a4a28" opacity="0.85" />
      <path d="M62 60 c -6 -20 4 -34 22 -40 c 6 20 -4 34 -22 40 z" fill="#b06a44" opacity="0.85" />
      <path d="M96 34 c 18 -10 34 -4 44 12 c -18 10 -36 4 -44 -12 z" fill="#7c4326" opacity="0.8" />
      <path d="M118 64 c 16 2 26 14 28 32 c -18 -2 -28 -14 -28 -32 z" fill="#a8502c" opacity="0.75" />
    </g>

    <!-- trigo / pampas -->
    <g stroke="#cdb08a" stroke-width="1.4" opacity="0.85">
      <path d="M150 26 l 22 -18" />
      <path d="M154 30 l 8 -10 M158 34 l 8 -10 M162 38 l 8 -10 M166 42 l 8 -10 M170 46 l 8 -10" stroke-width="1.1" />
    </g>

    <!-- ===== dália principal (creme) ===== -->
    <g transform="translate(58,58)">
      <g fill="#efe0c9">
        <ellipse cx="0" cy="-20" rx="7" ry="15" />
        <ellipse cx="0" cy="20" rx="7" ry="15" />
        <ellipse cx="-20" cy="0" rx="15" ry="7" />
        <ellipse cx="20" cy="0" rx="15" ry="7" />
      </g>
      <g fill="#e6d0ad" transform="rotate(45)">
        <ellipse cx="0" cy="-18" rx="6" ry="13" />
        <ellipse cx="0" cy="18" rx="6" ry="13" />
        <ellipse cx="-18" cy="0" rx="13" ry="6" />
        <ellipse cx="18" cy="0" rx="13" ry="6" />
      </g>
      <g fill="#e0c19b" transform="rotate(22)">
        <ellipse cx="0" cy="-10" rx="4.5" ry="9" />
        <ellipse cx="0" cy="10" rx="4.5" ry="9" />
        <ellipse cx="-10" cy="0" rx="9" ry="4.5" />
        <ellipse cx="10" cy="0" rx="9" ry="4.5" />
      </g>
      <circle cx="0" cy="0" r="6" fill="#c99a5f" />
      <circle cx="0" cy="0" r="2.4" fill="#8a6033" />
    </g>

    <!-- ===== dália terracota (menor) ===== -->
    <g transform="translate(118,104)">
      <g fill="#c66a3a">
        <ellipse cx="0" cy="-13" rx="5" ry="10" />
        <ellipse cx="0" cy="13" rx="5" ry="10" />
        <ellipse cx="-13" cy="0" rx="10" ry="5" />
        <ellipse cx="13" cy="0" rx="10" ry="5" />
      </g>
      <g fill="#a8502c" transform="rotate(45)">
        <ellipse cx="0" cy="-11" rx="4" ry="8" />
        <ellipse cx="0" cy="11" rx="4" ry="8" />
        <ellipse cx="-11" cy="0" rx="8" ry="4" />
        <ellipse cx="11" cy="0" rx="8" ry="4" />
      </g>
      <circle cx="0" cy="0" r="4.5" fill="#f0d29a" />
    </g>

    <!-- pequenas margaridas / botões secos -->
    <g transform="translate(30,118)">
      <g fill="#f4ead6">
        <ellipse cx="0" cy="-8" rx="2.6" ry="5" />
        <ellipse cx="0" cy="8" rx="2.6" ry="5" />
        <ellipse cx="-8" cy="0" rx="5" ry="2.6" />
        <ellipse cx="8" cy="0" rx="5" ry="2.6" />
        <ellipse cx="-5.6" cy="-5.6" rx="4" ry="2.4" transform="rotate(45 -5.6 -5.6)" />
        <ellipse cx="5.6" cy="5.6" rx="4" ry="2.4" transform="rotate(45 5.6 5.6)" />
        <ellipse cx="5.6" cy="-5.6" rx="4" ry="2.4" transform="rotate(-45 5.6 -5.6)" />
        <ellipse cx="-5.6" cy="5.6" rx="4" ry="2.4" transform="rotate(-45 -5.6 5.6)" />
      </g>
      <circle cx="0" cy="0" r="3" fill="#c2974a" />
    </g>

    <!-- baguinhas / berries -->
    <g fill="#9a4a28">
      <circle cx="150" cy="70" r="4" />
      <circle cx="160" cy="80" r="3.4" />
      <circle cx="148" cy="84" r="3" />
    </g>
  </svg>
</template>

<script setup></script>

<style scoped>
.floral-corner {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 5px rgba(74, 42, 28, 0.28));
  pointer-events: none;
}
</style>
