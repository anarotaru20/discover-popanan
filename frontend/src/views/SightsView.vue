<template>
  <main class="locations-page">
    <section class="locations-hero">
      <v-container class="content-wrap">
        <div class="hero-content">
          <p class="eyebrow">Obiective turistice</p>

          <h1>Locuri care păstrează memoria străzii Popa Nan</h1>

          <p >
            Explorează obiective istorice, case vechi, spații culturale și repere urbane care spun
            povestea cartierului.
          </p>
        </div>
      </v-container>
    </section>

    <section class="locations-section">
      <v-container class="content-wrap">
        <div class="section-toolbar">
          <div>
            <p class="eyebrow">Explorează</p>
          </div>
        </div>

        <v-alert v-if="locationsStore.error" type="error" variant="tonal" class="mb-6">
          {{ locationsStore.error }}
        </v-alert>

        <div v-if="locationsStore.loading" class="loading-state">
          <v-progress-circular indeterminate color="orange" size="46" width="4" />
          <p>Se încarcă obiectivele...</p>
        </div>

        <div v-else-if="filteredLocations.length" class="locations-grid">
          <article
            v-for="location in filteredLocations"
            :key="location.id"
            class="objective-card"
            @click="goToLocation(location.slug)"
          >
            <div class="card-image">
              <img :src="location.coverImage" :alt="location.title" />
              <span v-if="location.categoryLabel">{{ location.categoryLabel }}</span>
            </div>

            <div class="card-content">
              <p v-if="location.period" class="period">{{ location.period }}</p>

              <h3>{{ location.title }}</h3>
              <p class="description-address">{{ location.address }}</p>

              <p class="description">{{ location.shortDescription }}</p>

              <div class="card-actions">
                <v-btn
                  color="orange"
                  rounded="xl"
                  variant="flat"
                  class="details-btn"
                  @click.stop="goToLocation(location.slug)"
                  style="font-weight: 700"
                >
                  Află mai multe
                </v-btn>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">Nu există obiective pentru categoria selectată.</div>
      </v-container>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLocationsStore } from '@/stores/locations'

const router = useRouter()
const locationsStore = useLocationsStore()

const selectedCategory = ref('all')

const locations = computed(() => locationsStore.locations || [])

const categories = computed(() => {
  return [...new Set(locations.value.map((location) => location.categoryLabel).filter(Boolean))]
})

const filteredLocations = computed(() => {
  if (selectedCategory.value === 'all') {
    return locations.value
  }

  return locations.value.filter((location) => location.categoryLabel === selectedCategory.value)
})

const goToLocation = (slug) => {
  router.push(`/location/${slug}`)
}

onMounted(async () => {
  await locationsStore.fetchLocations()
})
</script>

<style scoped>
.locations-page {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(255, 145, 0, 0.18), transparent 34%),
    linear-gradient(135deg, #0d0d0d 0%, #17120d 45%, #080808 100%);
  color: #fff;
}

.content-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1180px;
}

.locations-hero {
  padding: 100px 0 44px;
}

.hero-content {
  max-width: 850px;
  
}

.hero-content .eyebrow {
  color: #ff9800;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 1.3rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.eyebrow {
  margin-bottom: 12px;
  color: #ff9800;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}


.locations-hero h1 {
  max-width: 860px;
  margin: 0 0 18px;
  color: #f5f5f5;
  font-size: clamp(2.4rem, 6vw, 5rem);
  line-height: 0.96;
  letter-spacing: -0.06em;
}

.locations-hero p {
  max-width: 680px;
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.05rem;
  line-height: 1.7;
}

.locations-section {
  padding: 24px 0 90px;
}

.section-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;
}

.section-toolbar h2 {
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

.filters button {
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

.filters button:hover,
.filters button.active {
  border-color: rgba(255, 152, 0, 0.72);
  background: rgba(255, 152, 0, 0.16);
  color: #ffb74d;
}

.loading-state,
.empty-state {
  display: grid;
  place-items: center;
  min-height: 320px;
  border: 1px solid rgba(255, 152, 0, 0.16);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.045);
  color: rgba(255, 255, 255, 0.72);
}

.loading-state {
  gap: 14px;
}

.loading-state p {
  margin: 0;
}

.locations-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.objective-card {
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

.objective-card:hover {
  border-color: rgba(255, 152, 0, 0.58);
  transform: translateY(-7px);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.48);
}

.card-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.card-image::after {
  position: absolute;
  inset: 0;
  content: '';
  background:
    linear-gradient(to top, rgba(0, 0, 0, 0.78), transparent 55%),
    radial-gradient(circle at top right, rgba(255, 152, 0, 0.18), transparent 38%);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.88) contrast(1.08);
  transition: 0.4s ease;
}

.objective-card:hover .card-image img {
  transform: scale(1.06);
}

.card-image span {
  position: absolute;
  left: 18px;
  bottom: 18px;
  z-index: 2;
  border: 1px solid rgba(255, 183, 77, 0.36);
  border-radius: 999px;
  background: rgba(18, 12, 6, 0.76);
  padding: 8px 12px;
  color: #ffb74d;
  font-size: 0.75rem;
  font-weight: 900;
  backdrop-filter: blur(12px);
}

.card-content {
  padding: 22px;
}

.period {
  margin: 0 0 8px;
  color: #ffb74d;
  font-size: 0.78rem;
  font-weight: 800;
}

.card-content h3 {
  margin: 0 0 10px;
  color: #f5f5f5;
  font-size: 1.45rem;
  line-height: 1.1;
}

.description {
  display: -webkit-box;
  min-height: 48px;
  margin: 0 0 16px;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.94rem;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.description-address {
  color: #ffb74d;
  font-size: 0.85rem;
  font-weight: 700;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.card-meta span {
  border: 1px solid rgba(255, 152, 0, 0.18);
  border-radius: 999px;
  background: rgba(255, 152, 0, 0.08);
  padding: 7px 11px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.78rem;
  font-weight: 700;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
}

.details-btn {
  min-height: 44px;
}

@media (max-width: 1180px) {
  .locations-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .section-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .filters {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .locations-hero {
    padding: 74px 0 28px;
  }

  .content-wrap {
    padding-inline: 20px;
  }

  .eyebrow {
    font-size: 1.3rem;
    letter-spacing: 0.14em;
  }

  .locations-hero h1 {
    max-width: 100%;
    font-size: clamp(2.45rem, 12vw, 3.7rem);
    line-height: 0.98;
  }

  .locations-hero p {
    max-width: 100%;
    font-size: 1rem;
    line-height: 1.65;
  }

  .locations-section {
    padding: 20px 0 64px;
  }

  .section-toolbar {
    gap: 18px;
    margin-bottom: 24px;
  }

  .section-toolbar h2 {
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

  .filters button {
    flex: 0 0 auto;
    white-space: nowrap;
  }

  .locations-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .objective-card {
    border-radius: 26px;
  }

  .objective-card:hover {
    transform: none;
  }

  .card-image {
    height: 220px;
  }

  .card-content {
    padding: 20px;
  }

  .card-content h3 {
    font-size: 1.32rem;
  }

  .description {
    min-height: auto;
    -webkit-line-clamp: 3;
  }

  .details-btn {
    width: 100%;
    min-height: 48px;
  }

  .loading-state,
  .empty-state {
    min-height: 260px;
    border-radius: 26px;
    text-align: center;
  }
}

@media (max-width: 420px) {
  .content-wrap {
    padding-inline: 16px;
  }

  .locations-hero {
    padding: 58px 0 24px;
  }

  .locations-section {
    padding: 18px 0 56px;
  }

  .locations-hero h1 {
    font-size: clamp(2.25rem, 13vw, 3rem);
  }

  .card-image {
    height: 205px;
  }

  .card-image span {
    left: 14px;
    bottom: 14px;
    max-width: calc(100% - 28px);
    padding: 7px 10px;
    font-size: 0.7rem;
  }

  .card-content {
    padding: 18px;
  }

  .card-meta span {
    width: 100%;
    border-radius: 18px;
    line-height: 1.35;
  }
}
</style>
