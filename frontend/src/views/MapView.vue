<template>
  <main class="explore-map-page">
    <section class="map-hero">
      <div class="hero-content">
        <p class="eyebrow">Explorează strada</p>
        <h1>Harta interactivă Popa Nan</h1>
        <p>
          Descoperă locurile importante de pe traseu, poveștile lor și legătura dintre Bucureștiul
          de azi și memoria orașului vechi.
        </p>
      </div>
    </section>

    <section class="map-shell">
      <aside class="map-sidebar">
        <div class="sidebar-header">
          <p class="eyebrow">Locații</p>
          <h2>Puncte de interes</h2>
        </div>

        <v-alert v-if="locationsStore.error" type="error" variant="tonal" class="mb-4">
          {{ locationsStore.error }}
        </v-alert>

        <div v-if="locationsStore.loading" class="loading-box">Se încarcă locațiile...</div>

        <div v-else class="locations-list">
          <article
            v-for="location in locations"
            :key="location.id"
            class="location-card"
            :class="{ active: selectedLocation?.id === location.id }"
            @click="selectLocation(location)"
          >
            <img :src="location.coverImage" :alt="location.title" />

            <div class="location-card-content">
              <span>{{ location.categoryLabel }}</span>
              <h3>{{ location.title }}</h3>
              <p>{{ location.shortDescription }}</p>
            </div>
          </article>
        </div>
      </aside>

      <section class="map-area" :class="{ 'past-mode': pastMode }">
        <div ref="mapContainer" class="leaflet-map"></div>

        <div v-if="isHistoricalLoading" class="map-loading-overlay">
          <div class="loader-card">
            <v-progress-circular indeterminate color="orange" size="42" width="4" />
            <div>
              <strong>Se încarcă harta din {{ activeHistoricalMap.year }}...</strong>
              <span>Un pic de răbdare, istoria vine cu bagaj mare.</span>
            </div>
          </div>
        </div>

        <div v-if="historicalError" class="historical-error">
          {{ historicalError }}
        </div>

        <div v-if="selectedLocation" class="floating-card">
          <img :src="selectedLocation.coverImage" :alt="selectedLocation.title" />

          <div class="floating-card-content">
            <span>{{ selectedLocation.period }}</span>
            <h2>{{ selectedLocation.title }}</h2>
            <p>{{ selectedLocation.shortDescription }}</p>

            <div class="location-meta">
              <small>{{ selectedLocation.categoryLabel }}</small>
              <small>{{ selectedLocation.address }}</small>
            </div>

            <div class="floating-actions">
              <v-btn color="orange" rounded="xl" :to="`/location/${selectedLocation.slug}`">
                Află mai multe
              </v-btn>

              <v-btn
                variant="outlined"
                color="orange"
                rounded="xl"
                :loading="isHistoricalLoading && !pastMode"
                @click="togglePastMode"
              >
                {{ pastMode ? 'Revino în prezent' : 'Vezi trecutul' }}
              </v-btn>
            </div>
          </div>
        </div>

        <div v-if="pastMode" class="historical-panel">
          <div class="historical-panel-header">
            <span>Hartă istorică</span>
            <strong>{{ activeHistoricalMap.year }}</strong>
          </div>

          <p>{{ activeHistoricalMap.label }}</p>
          <div class="historical-note">
            Hărțile istorice pot avea abateri de aliniere față de traseul actual al străzilor.
          </div>

          <div class="year-slider">
            <div class="years-row">
              <button
                v-for="(historicalMap, index) in historicalMaps"
                :key="historicalMap.year"
                type="button"
                :class="{ active: activeHistoricalIndex === index }"
                :disabled="isHistoricalLoading"
                @click="setHistoricalMap(index)"
              >
                <span
                  v-if="isHistoricalLoading && activeHistoricalIndex === index"
                  class="mini-loader"
                ></span>
                <span v-else>{{ historicalMap.year }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLocationsStore } from '@/stores/locations'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-kmz'

const locationsStore = useLocationsStore()

const mapContainer = ref(null)
const map = ref(null)
const selectedLocation = ref(null)
const pastMode = ref(false)
const markers = ref([])
const historicalLayer = ref(null)
const historicalLayersCache = ref({})
const activeHistoricalIndex = ref(0)
const isHistoricalLoading = ref(false)
const historicalError = ref('')
const historicalLoadToken = ref(0)

const historicalMaps = [
  {
    year: '1864',
    label: 'București în timpul modernizării lui Cuza',
    file: '/maps/bucuresti-1864.kmz',
  },
  {
    year: '1871',
    label: 'București în perioada începutului de industrializare',
    file: '/maps/bucuresti-1871.kmz',
  },
  {
    year: '1939',
    label: 'București înainte de Al Doilea Război Mondial',
    file: '/maps/bucuresti-1939.kmz',
  },
]
const locations = computed(() => locationsStore.locations || [])
const activeHistoricalMap = computed(() => historicalMaps[activeHistoricalIndex.value])

const customIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `
    <div class="pin">
      <div class="pin-inner"></div>
    </div>
  `,
  iconSize: [42, 52],
  iconAnchor: [21, 52],
  popupAnchor: [0, -48],
})

const initMap = () => {
  if (!mapContainer.value || map.value) return

  map.value = L.map(mapContainer.value, {
    zoomControl: false,
    scrollWheelZoom: true,
    maxZoom: 20,
    zoomAnimation: false,
    markerZoomAnimation: false,
    fadeAnimation: true,
  }).setView([44.43644189808239, 26.12519392594765], 16)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 20,
  }).addTo(map.value)

  L.control
    .zoom({
      position: 'bottomright',
    })
    .addTo(map.value)

  renderMarkers()
}

const renderMarkers = () => {
  if (!map.value || !locations.value.length) return

  markers.value.forEach((marker) => {
    marker.remove()
  })

  markers.value = []

  const bounds = []

  locations.value.forEach((location) => {
    if (!location.lat || !location.lng) return

    const marker = L.marker([location.lat, location.lng], {
      icon: customIcon,
    }).addTo(map.value)

    marker.bindPopup(`
      <div class="map-popup">
        <strong>${location.title}</strong>
        <span>${location.address}</span>
      </div>
    `)

    marker.on('click', () => {
      selectLocation(location)
    })

    markers.value.push(marker)
    bounds.push([location.lat, location.lng])
  })

  if (bounds.length) {
    map.value.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 16,
    })
  }

  if (!selectedLocation.value && locations.value.length) {
    selectedLocation.value = locations.value[0]
  }
}

const selectLocation = (location) => {
  selectedLocation.value = location

  if (map.value) {
    map.value.stop()
    map.value.setView([location.lat, location.lng], pastMode.value ? 16 : 19, {
      animate: false,
    })
  }
}

const togglePastMode = async () => {
  if (!map.value || isHistoricalLoading.value) return

  pastMode.value = !pastMode.value
  historicalError.value = ''

  if (pastMode.value) {
    await loadHistoricalKmz()

    if (selectedLocation.value) {
      map.value.stop()
      map.value.setView([selectedLocation.value.lat, selectedLocation.value.lng], 16, {
        animate: false,
      })
    }
  } else {
    removeHistoricalLayer()

    markers.value.forEach((marker) => {
      marker.setZIndexOffset(0)
    })

    if (selectedLocation.value) {
      map.value.stop()
      map.value.setView([selectedLocation.value.lat, selectedLocation.value.lng], 19, {
        animate: false,
      })
    }
  }
}

const cleanInvalidKmzLayers = (layerGroup) => {
  if (!layerGroup?.eachLayer) return

  layerGroup.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      const latLng = layer.getLatLng?.()

      if (!latLng || latLng.lat == null || latLng.lng == null) {
        layerGroup.removeLayer(layer)
      }
    }

    if (layer?.eachLayer) {
      cleanInvalidKmzLayers(layer)
    }
  })
}

const loadHistoricalKmz = () => {
  if (!map.value) return Promise.resolve()

  historicalLoadToken.value += 1

  const currentToken = historicalLoadToken.value
  const activeMap = activeHistoricalMap.value

  map.value.stop()
  map.value.scrollWheelZoom.disable()

  removeHistoricalLayer()
  historicalError.value = ''
  isHistoricalLoading.value = true

  return new Promise((resolve) => {
    const kmzLayer = L.kmzLayer()

    const finishLoading = () => {
      if (currentToken !== historicalLoadToken.value) {
        resolve()
        return
      }

      cleanInvalidKmzLayers(kmzLayer)

      historicalLayer.value = kmzLayer

      kmzLayer.addTo(map.value)
      kmzLayer.bringToFront()

      markers.value.forEach((marker) => {
        marker.setZIndexOffset(1000)
      })

      isHistoricalLoading.value = false
      resolve()
    }

    const failLoading = () => {
      if (currentToken !== historicalLoadToken.value) {
        resolve()
        return
      }

      isHistoricalLoading.value = false
      historicalError.value = `Nu s-a putut încărca harta din ${activeMap.year}. Verifică dacă fișierul există în public/maps.`
      resolve()
    }

    kmzLayer.on('load', finishLoading)
    kmzLayer.on('error', failLoading)

    try {
      kmzLayer.load(activeMap.file)
    } catch {
      failLoading()
    }

    window.setTimeout(() => {
      if (isHistoricalLoading.value && currentToken === historicalLoadToken.value) {
        failLoading()
      }
    }, 20000)
  })
}

const removeHistoricalLayer = () => {
  if (map.value) {
    map.value.stop()
  }

  if (historicalLayer.value && map.value && map.value.hasLayer(historicalLayer.value)) {
    map.value.removeLayer(historicalLayer.value)
  }

  historicalLayer.value = null
}

const changeHistoricalMap = async () => {
  if (pastMode.value && !isHistoricalLoading.value) {
    await loadHistoricalKmz()
  }
}

const setHistoricalMap = async (index) => {
  if (isHistoricalLoading.value || activeHistoricalIndex.value === index) return

  activeHistoricalIndex.value = index
  await changeHistoricalMap()
}

onMounted(async () => {
  await locationsStore.fetchLocations()
  await nextTick()
  initMap()
})

watch(
  locations,
  async () => {
    await nextTick()
    renderMarkers()
  },
  { deep: true },
)

onBeforeUnmount(() => {
  historicalLoadToken.value += 1
  removeHistoricalLayer()

  Object.values(historicalLayersCache.value).forEach((layer) => {
    if (map.value && map.value.hasLayer(layer)) {
      map.value.removeLayer(layer)
    }
  })

  if (map.value) {
    map.value.remove()
    map.value = null
  }
})
</script>

<style scoped>
.explore-map-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255, 145, 0, 0.18), transparent 34%),
    linear-gradient(135deg, #0d0d0d 0%, #17120d 45%, #080808 100%);
  color: #fff;
}

.map-hero {
  padding: 96px 7vw 40px;
}

.hero-content {
  max-width: 780px;
}

.eyebrow {
  margin-bottom: 12px;
  color: #ff9800;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.map-hero h1 {
  margin-bottom: 18px;
  font-size: clamp(2.4rem, 6vw, 5rem);
  line-height: 0.95;
}

.map-hero p {
  max-width: 640px;
  color: rgba(255, 255, 255, 0.74);
  font-size: 1.05rem;
}

.map-shell {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  gap: 24px;
  padding: 24px 7vw 80px;
}

.map-sidebar {
  border: 1px solid rgba(255, 152, 0, 0.18);
  border-radius: 32px;
  background: rgba(18, 18, 18, 0.72);
  backdrop-filter: blur(18px);
  padding: 24px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.32);
}

.sidebar-header h2 {
  margin-bottom: 22px;
  font-size: 1.8rem;
}

.loading-box {
  border: 1px solid rgba(255, 152, 0, 0.18);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.045);
  padding: 18px;
  color: rgba(255, 255, 255, 0.7);
}

.locations-list {
  display: grid;
  gap: 16px;
}

.location-card {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 14px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.045);
  cursor: pointer;
  transition: 0.25s ease;
}

.location-card:hover,
.location-card.active {
  border-color: rgba(255, 152, 0, 0.55);
  background: rgba(255, 152, 0, 0.1);
  transform: translateY(-3px);
}

.location-card img {
  width: 96px;
  height: 96px;
  border-radius: 18px;
  object-fit: cover;
  filter: saturate(0.85) contrast(1.05);
}

.location-card-content span,
.floating-card-content span {
  color: #ffb74d;
  font-size: 0.76rem;
  font-weight: 700;
}

.location-card-content h3 {
  margin: 6px 0;
  font-size: 1rem;
}

.location-card-content p {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.86rem;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.map-area {
  position: relative;
  min-height: 680px;
  overflow: hidden;
  border: 1px solid rgba(255, 152, 0, 0.2);
  border-radius: 36px;
  background: #111;
  box-shadow: 0 24px 90px rgba(0, 0, 0, 0.42);
}

.leaflet-map {
  width: 100%;
  height: 100%;
  min-height: 680px;
  z-index: 1;
  transition: 0.5s ease;
}

.map-area.past-mode .leaflet-map {
  filter: sepia(0.18) contrast(1.04) brightness(0.94);
}

.map-loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 850;
  display: grid;
  place-items: center;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(2px);
}

.loader-card {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 420px;
  border: 1px solid rgba(255, 183, 77, 0.34);
  border-radius: 24px;
  background: rgba(18, 12, 6, 0.88);
  padding: 18px 20px;
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.45);
}

.loader-card div {
  display: grid;
  gap: 4px;
}

.loader-card strong {
  color: #fff;
  font-size: 0.95rem;
}

.loader-card span {
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.84rem;
}

.historical-error {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 900;
  max-width: 360px;
  border: 1px solid rgba(255, 82, 82, 0.4);
  border-radius: 18px;
  background: rgba(70, 15, 15, 0.9);
  padding: 14px 16px;
  color: #ffd6d6;
  font-size: 0.88rem;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.34);
}

.floating-card {
  position: absolute;
  left: 28px;
  bottom: 28px;
  z-index: 500;
  display: grid;
  grid-template-columns: 180px 1fr;
  width: min(660px, calc(100% - 56px));
  overflow: hidden;
  border: 1px solid rgba(255, 152, 0, 0.24);
  border-radius: 28px;
  background: rgba(13, 13, 13, 0.82);
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.55);
  animation: cardIn 0.35s ease;
}

.floating-card img {
  width: 100%;
  height: 100%;
  min-height: 250px;
  object-fit: cover;
  transition: 0.35s ease;
}

.floating-card-content {
  padding: 22px;
}

.floating-card-content h2 {
  margin: 6px 0 10px;
  font-size: 1.5rem;
}

.floating-card-content p {
  margin-bottom: 14px;
  color: rgba(255, 255, 255, 0.72);
}

.location-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
}

.location-meta small {
  border: 1px solid rgba(255, 152, 0, 0.22);
  border-radius: 999px;
  background: rgba(255, 152, 0, 0.08);
  padding: 6px 10px;
  color: rgba(255, 255, 255, 0.76);
}

.floating-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.historical-panel {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 700;
  width: min(360px, calc(100% - 48px));
  border: 1px solid rgba(255, 183, 77, 0.32);
  border-radius: 24px;
  background: rgba(18, 12, 6, 0.84);
  padding: 18px;
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.42);
  animation: cardIn 0.3s ease;
}

.historical-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.historical-note {
  margin: -6px 0 16px;
  border: 1px solid rgba(255, 183, 77, 0.22);
  border-radius: 16px;
  background: rgba(255, 152, 0, 0.08);
  padding: 10px 12px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.78rem;
  line-height: 1.35;
}

.historical-panel-header span {
  color: #ffb74d;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.historical-panel-header strong {
  color: #fff;
  font-size: 1.55rem;
}

.historical-panel p {
  margin: 8px 0 18px;
  color: rgba(255, 255, 255, 0.74);
  font-size: 0.9rem;
}

.year-slider {
  display: grid;
  gap: 12px;
  margin-bottom: 18px;
}

.year-slider input {
  width: 100%;
  accent-color: #ff9800;
}

.year-slider input:disabled {
  opacity: 0.5;
  cursor: wait;
}

.years-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.years-row button {
  min-width: 58px;
  border: 1px solid rgba(255, 152, 0, 0.22);
  border-radius: 999px;
  background: rgba(255, 152, 0, 0.08);
  padding: 7px 11px;
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.22s ease;
}

.years-row button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.years-row button:hover,
.years-row button.active {
  border-color: rgba(255, 152, 0, 0.75);
  background: rgba(255, 152, 0, 0.22);
  color: #ffb74d;
}

.mini-loader {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 183, 77, 0.35);
  border-top-color: #ffb74d;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

:deep(.custom-map-marker) {
  display: grid;
  place-items: center;
}

:deep(.custom-map-marker .pin) {
  position: relative;
  width: 34px;
  height: 34px;
  border: 3px solid #fff3e0;
  border-radius: 50% 50% 50% 0;
  background: linear-gradient(135deg, #ffb74d, #ff6d00);
  box-shadow:
    0 0 0 8px rgba(255, 152, 0, 0.18),
    0 10px 28px rgba(255, 109, 0, 0.55);
  transform: rotate(-45deg);
}

:deep(.custom-map-marker .pin-inner) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #111;
  transform: translate(-50%, -50%);
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 18px;
  background: rgba(16, 16, 16, 0.94);
  color: #fff;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
}

:deep(.leaflet-popup-tip) {
  background: rgba(16, 16, 16, 0.94);
}

:deep(.map-popup) {
  display: grid;
  gap: 4px;
  min-width: 160px;
}

:deep(.map-popup strong) {
  color: #ffb74d;
  font-size: 0.95rem;
}

:deep(.map-popup span) {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.82rem;
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1100px) {
  .map-shell {
    grid-template-columns: 1fr;
  }

  .map-sidebar {
    order: 2;
  }

  .map-area,
  .leaflet-map {
    min-height: 620px;
  }
}

@media (max-width: 700px) {
  .map-hero {
    padding: 72px 20px 24px;
  }

  .map-shell {
    padding: 20px 20px 56px;
  }

  .map-sidebar {
    border-radius: 26px;
    padding: 18px;
  }

  .map-area,
  .leaflet-map {
    min-height: 560px;
    border-radius: 28px;
  }

  .map-loading-overlay {
    align-items: start;
    padding-top: 92px;
  }

  .loader-card {
    margin: 0 14px;
  }

  .historical-error {
    top: 14px;
    left: 14px;
    right: 14px;
    max-width: none;
  }

  .floating-card {
    left: 14px;
    bottom: 14px;
    grid-template-columns: 1fr;
    width: calc(100% - 28px);
  }

  .floating-card img {
    height: 145px;
    min-height: 145px;
  }

  .floating-card-content {
    padding: 18px;
  }

  .floating-card-content h2 {
    font-size: 1.25rem;
  }

  .historical-panel {
    top: 14px;
    right: 14px;
    left: 14px;
    width: auto;
  }

  .location-card {
    grid-template-columns: 84px 1fr;
  }

  .location-card img {
    width: 84px;
    height: 84px;
  }
}
</style>
