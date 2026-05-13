<template>
  <main class="locations-page">
    <section class="locations-hero">
      <div class="hero-content">
        <p class="eyebrow">Obiective turistice</p>
        <h1>Locuri care păstrează memoria străzii Popa Nan</h1>
        <p>
          Explorează obiective istorice, case vechi, spații culturale și repere urbane care spun
          povestea cartierului.
        </p>
      </div>
    </section>

    <section class="locations-section">
      <div class="section-toolbar">
        <div>
          <p class="eyebrow">Explorează</p>
          <h2>Toate obiectivele</h2>
        </div>

        <div class="filters">
          <button
            type="button"
            :class="{ active: selectedCategory === 'all' }"
            @click="selectedCategory = 'all'"
          >
            Toate
          </button>

          <button
            v-for="category in categories"
            :key="category"
            type="button"
            :class="{ active: selectedCategory === category }"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
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
            <span>{{ location.categoryLabel }}</span>
          </div>

          <div class="card-content">
            <p class="period">{{ location.period }}</p>
            <h3>{{ location.title }}</h3>
            <p class="description">{{ location.shortDescription }}</p>

            <div class="card-meta">
              <span>{{ location.address }}</span>
            </div>

            <div class="card-actions">
              <v-btn
                color="orange"
                rounded="xl"
                variant="flat"
                @click.stop="goToLocation(location.slug)"
              >
                Află mai multe
              </v-btn>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="empty-state">
        Nu există obiective pentru categoria selectată.
      </div>
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
  background:
    radial-gradient(circle at top left, rgba(255, 145, 0, 0.18), transparent 34%),
    linear-gradient(135deg, #0d0d0d 0%, #17120d 45%, #080808 100%);
  color: #fff;
}

.locations-hero {
  padding: 100px 7vw 44px;
}

.hero-content {
  max-width: 850px;
}

.eyebrow {
  margin-bottom: 12px;
  color: #ff9800;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.locations-hero h1 {
  max-width: 860px;
  margin-bottom: 18px;
  font-size: clamp(2.4rem, 6vw, 5rem);
  line-height: 0.96;
}

.locations-hero p {
  max-width: 680px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.05rem;
}

.locations-section {
  padding: 24px 7vw 90px;
}

.section-toolbar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;
}

.section-toolbar h2 {
  font-size: clamp(1.8rem, 3vw, 2.7rem);
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

.locations-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.objective-card {
  overflow: hidden;
  border: 1px solid rgba(255, 152, 0, 0.16);
  border-radius: 32px;
  background: rgba(18, 18, 18, 0.74);
  backdrop-filter: blur(18px);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
  cursor: pointer;
  transition: 0.28s ease;
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
  content: "";
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
  margin-bottom: 8px;
  color: #ffb74d;
  font-size: 0.78rem;
  font-weight: 800;
}

.card-content h3 {
  margin-bottom: 10px;
  font-size: 1.45rem;
  line-height: 1.1;
}

.description {
  display: -webkit-box;
  min-height: 48px;
  margin-bottom: 16px;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.94rem;
  line-height: 1.45;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
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
  justify-content: flex-start;
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

@media (max-width: 720px) {
  .locations-hero {
    padding: 74px 20px 28px;
  }

  .locations-section {
    padding: 20px 20px 64px;
  }

  .locations-grid {
    grid-template-columns: 1fr;
  }

  .objective-card {
    border-radius: 26px;
  }

  .card-image {
    height: 210px;
  }

  .card-content {
    padding: 18px;
  }

  .filters {
    width: 100%;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 6px;
  }

  .filters button {
    white-space: nowrap;
  }
}
</style>