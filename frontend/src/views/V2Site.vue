<script setup>
import { ref } from 'vue';
import V2Hero from '@/components/v2/V2Hero.vue';
import V2Verse from '@/components/v2/V2Verse.vue';
import V2Gallery from '@/components/v2/V2Gallery.vue';
import V2Venues from '@/components/v2/V2Venues.vue';
import V2Tips from '@/components/v2/V2Tips.vue';
import V2Gifts from '@/components/v2/V2Gifts.vue';
import V2Footer from '@/components/v2/V2Footer.vue';

const verse = ref(null);

function scrollToStory() {
  verse.value?.$el?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
  <div class="v2-site">
    <V2Hero @next="scrollToStory" />
    <V2Verse ref="verse" />
    <V2Gallery />
    <V2Venues />
    <V2Tips />
    <V2Gifts />
    <V2Footer />
  </div>
</template>

<style scoped>
.v2-site {
  /* Tokens da v2 — herdados por todos os componentes filhos via CSS vars */
  --v2-script: 'Great Vibes', cursive;
  --v2-serif: 'Cormorant Garamond', Georgia, serif;
  --v2-terracotta: #b06a44;
  --v2-olive: #6f7e44;
  --v2-cream: #f3e8d2;
  --v2-bg: #efe3cc;
  --v2-paper: #fbf4e6;
  --v2-ink: #4a2f22;

  font-family: var(--v2-serif);
  color: var(--v2-ink);
  background: var(--v2-bg);
  overflow-x: hidden;
}
</style>
