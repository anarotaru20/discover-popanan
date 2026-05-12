<template>
  <main class="tours-page">
    <section class="tours-hero">
      <div class="hero-glow hero-glow-one"></div>
      <div class="hero-glow hero-glow-two"></div>

      <div class="hero-content">
        <div class="eyebrow">Tururi ghidate</div>

        <h1>Explorează Popa Nan prin trasee cu poveste</h1>

        <p>
          Alege un tur tematic și descoperă strada prin repere istorice,
          case vechi, industrie, memorie urbană și povești ale comunității.
        </p>
      </div>
    </section>

    <section class="tours-section">
      <div class="section-head">
        <div>
          <span class="section-kicker">Trasee disponibile</span>
          <h2>Tururi pentru fiecare fel de explorator urban</h2>
        </div>

        <div class="filters">
          <button
            v-for="theme in themes"
            :key="theme.value"
            class="filter-btn"
            :class="{ active: selectedTheme === theme.value }"
            @click="selectedTheme = theme.value"
          >
            {{ theme.label }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="state-card">
        Se încarcă tururile...
      </div>

      <div v-else-if="error" class="state-card error">
        {{ error }}
      </div>

      <div v-else class="tours-grid">
        <article
          v-for="tour in filteredTours"
          :key="tour.id"
          class="tour-card"
          @click="goToTour(tour.slug)"
        >
          <div class="tour-image-wrap">
            <img :src="tour.coverImage" :alt="tour.title" class="tour-image" />

            <div class="tour-overlay"></div>

            <div class="tour-theme" :style="{ borderColor: tour.color, color: tour.color }">
              {{ getThemeLabel(tour.theme) }}
            </div>
          </div>

          <div class="tour-content">
            <h3>{{ tour.title }}</h3>

            <p>{{ tour.shortDescription }}</p>

            <div class="tour-meta">
              <span>
                <v-icon size="18">mdi-clock-outline</v-icon>
                {{ tour.duration }}
              </span>

              <span>
                <v-icon size="18">mdi-map-marker-distance</v-icon>
                {{ tour.distance }}
              </span>

              <span>
                <v-icon size="18">mdi-walk</v-icon>
                {{ tour.difficulty }}
              </span>
            </div>

            <div class="tour-footer">
              <span>{{ tour.stops.length }} opriri</span>

              <button class="tour-btn">
                Vezi turul
                <v-icon size="18">mdi-arrow-right</v-icon>
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToursStore } from '@/stores/tours'

const router = useRouter()
const toursStore = useToursStore()

const { tours, loading, error } = storeToRefs(toursStore)

const selectedTheme = ref('all')

const themes = [
  { label: 'Toate', value: 'all' },
  { label: 'General', value: 'general' },
  { label: 'Interbelic', value: 'interbelic' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Comunism', value: 'comunism' }
]

const filteredTours = computed(() => {
  if (selectedTheme.value === 'all') return tours.value
  return tours.value.filter((tour) => tour.theme === selectedTheme.value)
})

const getThemeLabel = (theme) => {
  return themes.find((item) => item.value === theme)?.label || theme
}

const goToTour = (slug) => {
  router.push(`/tours/${slug}`)
}

onMounted(() => {
  if (!tours.value.length) {
    toursStore.fetchTours()
  }
})
</script>

<style scoped>
.tours-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255, 138, 0, 0.18), transparent 34rem),
    radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.12), transparent 30rem),
    #080808;
  color: #fff;
  overflow: hidden;
}

.tours-hero {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: center;
  padding: 7rem 7vw 4rem;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 860px;
}

.eyebrow,
.section-kicker {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-bottom: 1rem;
  padding: 0.45rem 0.9rem;
  border: 1px solid rgba(255, 138, 0, 0.35);
  border-radius: 999px;
  background: rgba(255, 138, 0, 0.08);
  color: #ffad4d;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.tours-hero h1 {
  max-width: 780px;
  margin: 0;
  font-size: clamp(2.8rem, 7vw, 6.4rem);
  line-height: 0.9;
  letter-spacing: -0.07em;
}

.tours-hero p {
  max-width: 680px;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.8;
}

.hero-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(12px);
  opacity: 0.8;
}

.hero-glow-one {
  width: 260px;
  height: 260px;
  top: 80px;
  right: 12%;
  background: rgba(255, 138, 0, 0.16);
}

.hero-glow-two {
  width: 160px;
  height: 160px;
  bottom: 20px;
  left: 8%;
  background: rgba(234, 88, 12, 0.12);
}

.tours-section {
  position: relative;
  z-index: 2;
  padding: 2rem 7vw 6rem;
}

.section-head {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.section-head h2 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1;
  letter-spacing: -0.04em;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.65rem;
}

.filter-btn {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.055);
  color: rgba(255, 255, 255, 0.72);
  border-radius: 999px;
  padding: 0.75rem 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.25s ease;
}

.filter-btn:hover,
.filter-btn.active {
  border-color: rgba(255, 138, 0, 0.65);
  background: rgba(255, 138, 0, 0.16);
  color: #ffad4d;
}

.tours-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.35rem;
}

.tour-card {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.055);
  backdrop-filter: blur(20px);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: 0.3s ease;
}

.tour-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 138, 0, 0.42);
  box-shadow: 0 34px 110px rgba(255, 138, 0, 0.13);
}

.tour-image-wrap {
  position: relative;
  height: 245px;
  overflow: hidden;
}

.tour-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.45s ease;
}

.tour-card:hover .tour-image {
  transform: scale(1.08);
}

.tour-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(8, 8, 8, 0.86)),
    radial-gradient(circle at top right, rgba(255, 138, 0, 0.16), transparent 55%);
}

.tour-theme {
  position: absolute;
  top: 1rem;
  left: 1rem;
  border: 1px solid;
  border-radius: 999px;
  padding: 0.45rem 0.75rem;
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(12px);
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.tour-content {
  padding: 1.35rem;
}

.tour-content h3 {
  margin: 0 0 0.75rem;
  font-size: 1.35rem;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.tour-content p {
  min-height: 96px;
  margin: 0;
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.95rem;
  line-height: 1.65;
}

.tour-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1.25rem;
}

.tour-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.82rem;
  font-weight: 700;
}

.tour-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1.4rem;
  padding-top: 1.1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.09);
}

.tour-footer span {
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.9rem;
  font-weight: 700;
}

.tour-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff8a00, #ea580c);
  color: #120700;
  padding: 0.7rem 0.9rem;
  font-weight: 900;
  cursor: pointer;
}

.state-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.055);
  color: rgba(255, 255, 255, 0.72);
  font-weight: 700;
}

.state-card.error {
  color: #fecaca;
  border-color: rgba(248, 113, 113, 0.35);
  background: rgba(127, 29, 29, 0.18);
}

@media (max-width: 1280px) {
  .tours-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .section-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .filters {
    justify-content: flex-start;
  }
}

@media (max-width: 720px) {
  .tours-hero {
    min-height: auto;
    padding: 6rem 1.2rem 3rem;
  }

  .tours-section {
    padding: 1rem 1.2rem 4rem;
  }

  .tours-grid {
    grid-template-columns: 1fr;
  }

  .tour-image-wrap {
    height: 220px;
  }

  .tour-content p {
    min-height: auto;
  }

  .tour-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .tour-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>