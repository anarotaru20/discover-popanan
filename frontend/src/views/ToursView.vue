<template>
  <main class="tours-page">
    <section class="tours-hero">
      <div class="hero-glow hero-glow-one"></div>
      <div class="hero-glow hero-glow-two"></div>

      <v-container class="content-wrap">
        <div class="hero-content">
          <div class="eyebrow">Tururi ghidate</div>

          <h1>Explorează Popa Nan prin trasee cu poveste</h1>

          <p>
            Alege un tur tematic și descoperă strada prin repere istorice, case vechi, industrie,
            memorie urbană și povești ale comunității.
          </p>
        </div>
      </v-container>
    </section>

    <section class="tours-section">
      <v-container class="content-wrap">
        <div class="section-head">
          <div>
            <span class="section-kicker">Trasee disponibile</span>
          </div>
        </div>

        <div v-if="loading" class="state-card">Se încarcă tururile...</div>

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

                <button class="tour-btn" @click.stop="goToTour(tour.slug)">
                  Vezi turul
                  <v-icon size="18">mdi-arrow-right</v-icon>
                </button>
              </div>
            </div>
          </article>
        </div>
      </v-container>
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
  { label: 'Comunism', value: 'comunism' },
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
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(255, 145, 0, 0.18), transparent 34%),
    linear-gradient(135deg, #0d0d0d 0%, #17120d 45%, #080808 100%);
  color: #fff;
}

.content-wrap {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1180px;
}

.tours-hero {
  position: relative;
  padding: 100px 0 44px;
}

.hero-content {
  max-width: 850px;
}

.eyebrow,
.section-kicker {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-bottom: 12px;
  color: #ff9800;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.tours-hero h1 {
  max-width: 860px;
  margin: 0 0 18px;
  color: #f5f5f5;
  font-size: clamp(2.4rem, 6vw, 5rem);
  line-height: 0.96;
  letter-spacing: -0.06em;
}

.tours-hero p {
  max-width: 680px;
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.05rem;
  line-height: 1.7;
}

.hero-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(12px);
  opacity: 0.8;
  pointer-events: none;
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
  padding: 24px 0 90px;
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;
}

.section-head h2 {
  max-width: 760px;
  margin: 0;
  color: #f5f5f5;
  font-size: clamp(1.8rem, 3vw, 2.7rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.filter-btn {
  border: 1px solid rgba(255, 152, 0, 0.22);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.045);
  padding: 10px 15px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.84rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.22s ease;
}

.filter-btn:hover,
.filter-btn.active {
  border-color: rgba(255, 152, 0, 0.72);
  background: rgba(255, 152, 0, 0.16);
  color: #ffb74d;
}

.tours-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.tour-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 152, 0, 0.16);
  border-radius: 32px;
  background: rgba(18, 18, 18, 0.74);
  backdrop-filter: blur(18px);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
  cursor: pointer;
  transition:
    transform 0.28s ease,
    border-color 0.28s ease,
    box-shadow 0.28s ease;
}

.tour-card:hover {
  border-color: rgba(255, 152, 0, 0.58);
  transform: translateY(-7px);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.48);
}

.tour-image-wrap {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.tour-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.88) contrast(1.08);
  transition: 0.4s ease;
}

.tour-card:hover .tour-image {
  transform: scale(1.06);
}

.tour-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(0, 0, 0, 0.78), transparent 55%),
    radial-gradient(circle at top right, rgba(255, 152, 0, 0.18), transparent 38%);
}

.tour-theme {
  position: absolute;
  left: 18px;
  bottom: 18px;
  z-index: 2;
  border: 1px solid;
  border-radius: 999px;
  background: rgba(18, 12, 6, 0.76);
  padding: 8px 12px;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  backdrop-filter: blur(12px);
}

.tour-content {
  padding: 22px;
}

.tour-content h3 {
  margin: 0 0 10px;
  color: #f5f5f5;
  font-size: 1.45rem;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.tour-content p {
  display: -webkit-box;
  min-height: 72px;
  margin: 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.94rem;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.tour-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.tour-meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255, 152, 0, 0.18);
  border-radius: 999px;
  background: rgba(255, 152, 0, 0.08);
  padding: 7px 11px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.78rem;
  font-weight: 700;
}

.tour-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 152, 0, 0.14);
}

.tour-footer span {
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.9rem;
  font-weight: 800;
}

.tour-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff8a00, #ea580c);
  color: #120700;
  padding: 0 16px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.22s ease;
}

.tour-btn:hover {
  transform: translateX(3px);
}

.state-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  border: 1px solid rgba(255, 152, 0, 0.16);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.045);
  color: rgba(255, 255, 255, 0.72);
  font-weight: 700;
}

.state-card.error {
  color: #fecaca;
  border-color: rgba(248, 113, 113, 0.35);
  background: rgba(127, 29, 29, 0.18);
}

@media (max-width: 1180px) {
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

@media (max-width: 768px) {
  .tours-hero {
    padding: 74px 0 28px;
  }

  .content-wrap {
    padding-inline: 20px;
  }

  .eyebrow,
  .section-kicker {
    font-size: 1.3rem;
    letter-spacing: 0.14em;
  }

  .tours-hero h1 {
    max-width: 100%;
    font-size: clamp(2.45rem, 12vw, 3.7rem);
    line-height: 0.98;
  }

  .tours-hero p {
    max-width: 100%;
    font-size: 1rem;
    line-height: 1.65;
  }

  .tours-section {
    padding: 20px 0 64px;
  }

  .section-head {
    gap: 18px;
    margin-bottom: 24px;
  }

  .section-head h2 {
    font-size: clamp(2rem, 9vw, 2.55rem);
  }

  .filters {
    width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 6px;
    scrollbar-width: none;
  }

  .filters::-webkit-scrollbar {
    display: none;
  }

  .filter-btn {
    flex: 0 0 auto;
    white-space: nowrap;
  }

  .tours-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .tour-card {
    border-radius: 26px;
  }

  .tour-card:hover {
    transform: none;
  }

  .tour-image-wrap {
    height: 220px;
  }

  .tour-content {
    padding: 20px;
  }

  .tour-content h3 {
    font-size: 1.32rem;
  }

  .tour-content p {
    min-height: auto;
  }

  .tour-footer {
    align-items: flex-end;
    flex-direction: column;
  }

  .tour-btn {
    width: 100%;
    min-height: 48px;
  }

  .state-card {
    min-height: 260px;
    border-radius: 26px;
    text-align: center;
  }
}

@media (max-width: 420px) {
  .content-wrap {
    padding-inline: 16px;
  }

  .tours-hero {
    padding: 58px 0 24px;
  }

  .tours-section {
    padding: 18px 0 56px;
  }

  .tours-hero h1 {
    font-size: clamp(2.25rem, 13vw, 3rem);
  }

  .tour-image-wrap {
    height: 205px;
  }

  .tour-theme {
    left: 14px;
    bottom: 14px;
    max-width: calc(100% - 28px);
    padding: 7px 10px;
    font-size: 0.7rem;
  }

  .tour-content {
    padding: 18px;
  }

  .tour-meta span {
    width: 100%;
    border-radius: 18px;
    line-height: 1.35;
  }
}
</style>
