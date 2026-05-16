<template>
  <section class="gallery-section">
    <div class="section-header">
      <p class="eyebrow">Galerie foto</p>
      <!-- <h2>Imagini ale locului</h2> -->
      <p class="section-description">
        Fotografii istorice și imagini actuale care completează povestea locului.
      </p>
    </div>

    <div class="gallery-grid">
      <button
        v-for="(image, index) in images"
        :key="image"
        class="gallery-item"
        type="button"
        @click="openImage(index)"
      >
        <img :src="image" :alt="`Imagine galerie ${index + 1}`" />
      </button>
    </div>

    <v-dialog v-model="dialog" :fullscreen="$vuetify.display.smAndDown" max-width="980">
      <v-card class="dialog-card" rounded="xl">
        <v-card-title class="dialog-title">
          <!-- <span>Imagine galerie</span> -->
          <p class="eyebrow-img">imagini</p>

          <v-btn icon variant="text" @click="closeImage">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="dialog-content">
          <div
            class="dialog-image-wrapper"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
          >
            <img
              v-if="currentImage"
              :src="currentImage"
              alt="Imagine galerie mărită"
              class="dialog-image"
            />
          </div>

          <div class="dialog-navigation">
            <v-btn icon variant="outlined" @click="prevImage">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>

            <span class="dialog-counter"> {{ selectedIndex + 1 }} / {{ images.length }} </span>

            <v-btn icon variant="outlined" @click="nextImage">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
})

const dialog = ref(false)
const selectedIndex = ref(0)
const touchStartX = ref(0)
const touchEndX = ref(0)

const currentImage = computed(() => {
  return props.images[selectedIndex.value]
})

const openImage = (index) => {
  selectedIndex.value = index
  dialog.value = true
}

const closeImage = () => {
  dialog.value = false
  selectedIndex.value = 0
}

const nextImage = () => {
  if (!props.images.length) return

  selectedIndex.value = selectedIndex.value < props.images.length - 1 ? selectedIndex.value + 1 : 0
}

const prevImage = () => {
  if (!props.images.length) return

  selectedIndex.value = selectedIndex.value > 0 ? selectedIndex.value - 1 : props.images.length - 1
}

const handleTouchStart = (event) => {
  touchStartX.value = event.changedTouches[0].screenX
}

const handleTouchEnd = (event) => {
  touchEndX.value = event.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeDistance = touchStartX.value - touchEndX.value
  const minSwipeDistance = 50

  if (Math.abs(swipeDistance) < minSwipeDistance) return

  if (swipeDistance > 0) {
    nextImage()
  } else {
    prevImage()
  }
}
</script>
<style scoped>
.gallery-section {
  margin-bottom: 72px;
}

.section-header {
  margin-bottom: 24px;
}

.eyebrow {
  color: #ff8a00;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 8px;
}
.eyebrow-img {
  color: #ff8a00;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 1.1rem;
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

.gallery-grid {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 4px 14px;
  scroll-snap-type: x mandatory;
}

.gallery-item {
  height: 220px;
  border: 1px solid rgba(255, 138, 0, 0.18);
  border-radius: 24px;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  background: rgba(24, 24, 24, 0.92);
  min-width: 230px;
  flex: 0 0 230px;
  scroll-snap-align: start;
}

.gallery-grid::-webkit-scrollbar {
  height: 8px;
}

.gallery-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
}

.gallery-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 138, 0, 0.65);
  border-radius: 999px;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 0.25s ease,
    filter 0.25s ease;
}

.gallery-item:hover img {
  transform: scale(1.06);
  filter: brightness(1.08);
}

.dialog-navigation {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.dialog-card {
  background: rgba(24, 24, 24, 0.98);
  border: 1px solid rgba(255, 138, 0, 0.18);
  color: #f5f5f5;
  overflow: hidden;
}

.dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
}

.dialog-content {
  padding: 0 22px 22px;
}

.dialog-image-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-image {
  width: 100%;
  max-height: 72vh;
  object-fit: contain;
  border-radius: 18px;
  display: block;
  background: #111;
}

.dialog-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin-top: 20px;
}

.dialog-counter {
  min-width: 56px;
  text-align: center;
  color: rgba(245, 245, 245, 0.72);
  font-weight: 600;
}

@media (max-width: 700px) {
  .dialog-card {
    height: 100dvh;
    border-radius: 0 !important;
  }

  .dialog-title {
    padding: 14px 16px;
    font-size: 1rem;
  }

  .dialog-content {
    height: calc(100dvh - 64px);
    padding: 0 14px 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .dialog-image-wrapper {
    flex: 1;
    min-height: 0;
  }

  .dialog-image {
    max-height: calc(100dvh - 160px);
    border-radius: 14px;
  }

  .dialog-navigation {
    margin-top: 16px;
    padding-bottom: max(6px, env(safe-area-inset-bottom));
  }
}
</style>
