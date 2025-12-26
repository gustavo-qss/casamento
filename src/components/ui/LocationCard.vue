<template>
  <div class="location-card">
    <div class="card-icon">
      <svg
        v-if="icon === 'church'"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L12 6M12 6L10 8M12 6L14 8M8 10V22H16V10M4 22H20M10 14H14M10 18H14"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <svg
        v-else-if="icon === 'party'"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 5L19 19M5 19L19 5M12 12L15 9M9 15L12 12M12 3V7M3 12H7M17 12H21M12 17V21"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <h3 class="card-title">{{ title }}</h3>
    <h2 class="location-name">{{ location }}</h2>
    <p class="location-time">{{ time }}</p>
    <p class="location-address">{{ address }}</p>

    <a
      v-if="mapsLink"
      :href="mapsLink"
      target="_blank"
      rel="noopener noreferrer"
      class="btn btn-primary maps-button"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style="margin-right: 8px"
      >
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
          fill="currentColor"
        />
      </svg>
      Como Chegar
    </a>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
    validator: (value) => ['church', 'party'].includes(value),
  },
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  mapsLink: {
    type: String,
    default: null,
  },
});
</script>

<style scoped>
.location-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  animation: fadeIn 1s ease-in-out;
}

.card-icon {
  color: var(--primary-lavender);
  margin-bottom: var(--spacing-sm);
}

.card-title {
  font-size: var(--text-small);
  color: var(--lavender-dark);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
  margin: 0;
}

.location-name {
  font-size: var(--text-title);
  color: var(--text-dark);
  margin: var(--spacing-xs) 0;
  font-family: var(--font-display);
}

.location-time {
  font-size: var(--text-subtitle);
  color: var(--gold);
  font-weight: 600;
  margin: 0;
}

.location-address {
  font-size: var(--text-body);
  color: var(--blue-dark);
  margin: var(--spacing-xs) 0 var(--spacing-md);
  text-align: center;
}

.maps-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: var(--spacing-sm);
}

@media (max-width: 768px) {
  .location-card {
    padding: var(--spacing-lg);
    max-width: 90%;
  }

  .card-icon svg {
    width: 36px;
    height: 36px;
  }

  .location-name {
    font-size: var(--text-subtitle);
  }
}
</style>
