<template>
  <section class="before-after-section">
    <div class="section-header">
      <p class="eyebrow">Atunci vs. acum</p>
      <!-- <h2>{{ 'Atunci vs. Acum' }}</h2> -->
      <p class="section-description">
        Trage de slider pentru a vedea diferența dintre imaginea veche și cea actuală.
      </p>
    </div>

    <div class="compare-card">
      <div class="compare-wrapper">
        <img :src="afterImage" alt="Imagine actuală" class="compare-image" />

        <div class="before-layer" :style="{ width: `${sliderValue}%` }">
          <img :src="beforeImage" alt="Imagine veche" class="compare-image" />
        </div>

        <div class="divider" :style="{ left: `${sliderValue}%` }">
          <div class="divider-handle">
            <v-icon size="22">mdi-arrow-left-right</v-icon>
          </div>
        </div>

        <input
          v-model="sliderValue"
          type="range"
          min="0"
          max="100"
          class="range-input"
          aria-label="Slider comparație înainte și acum"
        />

        <div class="label before-label">Atunci</div>
        <div class="label after-label">Acum</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  beforeImage: {
    type: String,
    required: true,
  },
  afterImage: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
})

const sliderValue = ref(50)
</script>

<style scoped>
.before-after-section {
  margin-bottom: 72px;
}

.section-header {
  margin-bottom: 24px;
}

.eyebrow {
  color: #ff8a00;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 1.30rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.section-header h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 8px;
}

.section-description {
  color: rgba(245, 245, 245, 0.72);
  max-width: 640px;
  line-height: 1.7;
}

.compare-card {
  background: rgba(24, 24, 24, 0.92);
  border: 1px solid rgba(255, 138, 0, 0.18);
  border-radius: 28px;
  overflow: hidden;
  padding: 20px;
  max-width: 650px;
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

.compare-wrapper {
  position: relative;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;

  aspect-ratio: 1200 / 1400;

  border-radius: 22px;
  overflow: hidden;
  background: #111;
}

.compare-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.before-layer {
  position: absolute;
  inset: 0 auto 0 0;
  overflow: hidden;
  z-index: 2;
}

.before-layer .compare-image {
  width: 650px;
  height: 100%;
  max-width: none;
  object-fit: cover;
  object-position: center;
}

.divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #ff8a00;
  z-index: 3;
  transform: translateX(-50%);
}

.divider-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 48px;
  height: 48px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: #ff8a00;
  color: #0f0f0f;
  display: grid;
  place-items: center;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.range-input {
  position: absolute;
  inset: 0;
  z-index: 4;
  opacity: 0;
  /* cursor: ew-resize; */
}

.label {
  position: absolute;
  top: 18px;
  z-index: 5;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(15, 15, 15, 0.72);
  color: #f5f5f5;
  font-size: 0.85rem;
  font-weight: 700;
  backdrop-filter: blur(8px);
}

.before-label {
  left: 18px;
}

.after-label {
  right: 18px;
}

@media (max-width: 700px) {
  .compare-card {
    padding: 8px;
    border-radius: 22px;
  }

  .compare-wrapper {
    max-width: 100%;
  }

  .divider-handle {
    width: 42px;
    height: 42px;
  }
}
</style>
