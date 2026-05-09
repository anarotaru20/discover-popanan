<template>
  <main class="location-page">
    <section v-if="locationsStore.loading" class="state-section">
      <v-progress-circular indeterminate color="orange" size="48" />
      <p>Se încarcă povestea locului...</p>
    </section>

    <section v-else-if="locationsStore.error" class="state-section">
      <v-alert type="error" variant="tonal" max-width="720">
        {{ locationsStore.error }}
      </v-alert>

      <v-btn color="orange" class="mt-4" to="/">
        Înapoi la pagina principală
      </v-btn>
    </section>

    <template v-else-if="location">
      <section
        class="hero-section"
        :style="{ backgroundImage: `linear-gradient(rgba(15, 15, 15, 0.35), rgba(15, 15, 15, 0.95)), url(${location.hero_image || location.image_url || fallbackImage})` }"
      >
        <div class="hero-content">
          <v-chip class="period-chip" color="orange" variant="flat">
            {{ location.period || 'Istorie urbană' }}
          </v-chip>

          <h1>{{ location.title }}</h1>

          <p>
            {{ location.short_description || 'Descoperă povestea acestui loc de pe strada Popa Nan.' }}
          </p>

          <div class="hero-actions">
            <v-btn color="orange" size="large" rounded="xl" to="/tours">
              Începe turul
            </v-btn>

            <v-btn variant="outlined" color="white" size="large" rounded="xl" to="/map">
              Vezi pe hartă
            </v-btn>
          </div>
        </div>
      </section>

      <v-container class="content-container">
        <section class="story-section">
          <p class="eyebrow">Povestea locului</p>
          <h2>Istoria din spatele locului</h2>

          <p class="story-text">
            {{ location.full_description || location.description || 'Povestea completă va fi adăugată în curând.' }}
          </p>
        </section>

        <section v-if="timelineItems.length" class="timeline-section">
          <p class="eyebrow">Timeline</p>
          <h2>Momente importante</h2>

          <div class="timeline-list">
            <div
              v-for="item in timelineItems"
              :key="item.id || item.year || item.title"
              class="timeline-item"
            >
              <div class="timeline-year">
                {{ item.year || item.date }}
              </div>

              <div class="timeline-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <Gallery
          v-if="galleryImages.length"
          :images="galleryImages"
        />

        <Audio
          v-if="location.audio_url"
          :audio-url="location.audio_url"
          :title="location.title"
        />

        <section v-if="facts.length" class="facts-section">
          <p class="eyebrow">Știai că?</p>
          <h2>Detalii interesante</h2>

          <div class="facts-grid">
            <v-card
              v-for="fact in facts"
              :key="fact.id || fact.title || fact"
              class="fact-card"
              rounded="xl"
            >
              <v-card-text>
                <v-icon color="orange" size="28" class="mb-3">
                  mdi-lightbulb-on-outline
                </v-icon>

                <p>
                  {{ typeof fact === 'string' ? fact : fact.text || fact.description }}
                </p>
              </v-card-text>
            </v-card>
          </div>
        </section>

        <section v-if="sources.length" class="sources-section">
          <p class="eyebrow">Surse</p>
          <h2>Documentare și referințe</h2>

          <div class="sources-list">
            <v-card
              v-for="source in sources"
              :key="source.id || source.title || source.url"
              class="source-card"
              rounded="xl"
            >
              <v-card-text>
                <strong>{{ source.title || source.name || 'Sursă istorică' }}</strong>

                <p v-if="source.description">
                  {{ source.description }}
                </p>

                <a
                  v-if="source.url"
                  :href="source.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vezi sursa
                </a>
              </v-card-text>
            </v-card>
          </div>
        </section>

        <Comments
          v-if="location.id"
          :location-id="location.id"
        />
      </v-container>
    </template>

    <section v-else class="state-section">
      <v-alert type="warning" variant="tonal" max-width="720">
        Locația nu a fost găsită.
      </v-alert>

      <v-btn color="orange" class="mt-4" to="/">
        Înapoi la pagina principală
      </v-btn>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLocationsStore } from '@/stores/locations'
import Comments from '@/components/location/Comments.vue'
import Gallery from '@/components/location/Gallery.vue'
import Audio from '@/components/location/Audio.vue'

const route = useRoute()
const locationsStore = useLocationsStore()

const fallbackImage = '/images/popanani-hero.jpg'

const location = computed(() => locationsStore.selectedLocation)

const timelineItems = computed(() => {
  return location.value?.timeline || []
})

const galleryImages = computed(() => {
  if (location.value?.gallery?.length) return location.value.gallery
  if (location.value?.images?.length) return location.value.images
  return []
})

const facts = computed(() => {
  return location.value?.facts || location.value?.fun_facts || []
})

const sources = computed(() => {
  return location.value?.sources || []
})

const loadLocation = () => {
  const slug = route.params.slug

  if (slug) {
    locationsStore.fetchLocationBySlug(slug)
  }
}

onMounted(() => {
  loadLocation()
})

watch(
  () => route.params.slug,
  () => {
    loadLocation()
  }
)
</script>

<style scoped>
.location-page {
  min-height: 100vh;
  background: #0f0f0f;
  color: #f5f5f5;
}

.state-section {
  min-height: 70vh;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 40px 20px;
  gap: 16px;
}

.hero-section {
  min-height: 78vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 120px 24px 80px;
}

.hero-content {
  width: min(1120px, 100%);
  margin: 0 auto;
}

.period-chip {
  margin-bottom: 20px;
  font-weight: 700;
}

.hero-content h1 {
  font-size: clamp(3rem, 8vw, 6.5rem);
  line-height: 0.95;
  max-width: 980px;
  margin-bottom: 24px;
}

.hero-content p {
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  color: rgba(245, 245, 245, 0.78);
  max-width: 720px;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 32px;
}

.content-container {
  max-width: 1120px;
  padding-top: 80px;
  padding-bottom: 100px;
}

.story-section,
.timeline-section,
.facts-section,
.sources-section {
  margin-bottom: 72px;
}

.eyebrow {
  color: #ff8a00;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 8px;
}

h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 20px;
}

.story-text {
  color: rgba(245, 245, 245, 0.76);
  font-size: 1.08rem;
  line-height: 1.9;
  max-width: 880px;
  white-space: pre-line;
}

.timeline-list {
  display: grid;
  gap: 18px;
}

.timeline-item {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 24px;
  padding: 24px;
  border-radius: 24px;
  background: rgba(24, 24, 24, 0.92);
  border: 1px solid rgba(255, 138, 0, 0.18);
}

.timeline-year {
  color: #ff8a00;
  font-size: 1.4rem;
  font-weight: 800;
}

.timeline-content h3 {
  margin-bottom: 8px;
  color: #f5f5f5;
}

.timeline-content p {
  color: rgba(245, 245, 245, 0.72);
  line-height: 1.7;
  margin: 0;
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}

.fact-card,
.source-card {
  background: rgba(24, 24, 24, 0.92);
  border: 1px solid rgba(255, 138, 0, 0.18);
}

.fact-card p,
.source-card p {
  color: rgba(245, 245, 245, 0.74);
  line-height: 1.7;
  margin: 0;
}

.sources-list {
  display: grid;
  gap: 14px;
}

.source-card strong {
  display: block;
  margin-bottom: 8px;
  color: #f5f5f5;
}

.source-card a {
  display: inline-block;
  margin-top: 10px;
  color: #ff8a00;
  text-decoration: none;
  font-weight: 700;
}

.source-card a:hover {
  text-decoration: underline;
}

@media (max-width: 700px) {
  .hero-section {
    min-height: 72vh;
    padding: 100px 18px 56px;
  }

  .content-container {
    padding-top: 56px;
    padding-bottom: 72px;
  }

  .timeline-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>