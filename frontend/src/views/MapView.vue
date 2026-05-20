<template>
  <main class="explore-map-page">
    <section class="map-hero">
      <div class="hero-glow hero-glow-one"></div>
      <div class="hero-glow hero-glow-two"></div>

      <v-container class="content-wrap">
        <div class="hero-content">
          <p class="eyebrow">Explorează strada</p>

          <h1>Harta interactivă Popa Nan</h1>

          <p style="text-align: justify">
            Fiecare punct de pe hartă deschide o poveste despre oameni, clădiri și urmele unui
            București care încă respiră prin străzile sale vechi.
          </p>
        </div>
      </v-container>
    </section>

    <section class="map-section">
      <v-container class="content-wrap">
        <div class="map-shell">
          <aside class="map-sidebar">
            <div class="sidebar-header">
              <p class="eyebrow">Locații</p>
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

          <div v-if="pastMode" class="historical-panel mobile-history-panel">
            <div class="historical-panel-header">
              <span>Hartă istorică</span>
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
                <p class="floating-address">{{ selectedLocation.address }}</p>
                <p class="floating-description">{{ selectedLocation.shortDescription }}</p>

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

            <div v-if="pastMode" class="historical-panel desktop-history-panel">
              <div class="historical-panel-header">
                <span>Hartă istorică</span>
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
        </div>
      </v-container>
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
    <div class="map-pin">
      <div class="map-pin-dot"></div>
    </div>
  `,
  iconSize: [34, 44],
  iconAnchor: [17, 44],
  popupAnchor: [0, -40],
})

const initMap = () => {
  if (!mapContainer.value || map.value) return

  map.value = L.map(mapContainer.value, {
    zoomControl: false,
    scrollWheelZoom: false,
    maxZoom: 20,
    zoomAnimation: false,
    markerZoomAnimation: false,
    fadeAnimation: true,
    attributionControl: false,
  }).setView([44.43644189808239, 26.12519392594765], 16)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
    maxZoom: 20,
  }).addTo(map.value)

  L.control
    .zoom({
      position: 'topright',
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
      padding: [70, 70],
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
    map.value.setView([location.lat, location.lng], pastMode.value ? 16 : 18, {
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
      map.value.setView([selectedLocation.value.lat, selectedLocation.value.lng], 18, {
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
      historicalError.value = `Nu s-a putut încărca harta din ${activeMap.year}.`
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
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(255, 145, 0, 0.13), transparent 34%),
    linear-gradient(135deg, #0d0d0d 0%, #17120d 45%, #080808 100%);
  color: #fff;
}

.content-wrap {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1180px;
}

.map-hero {
  position: relative;
  overflow: hidden;
  padding: 100px 0 0px;
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

.hero-content {
  max-width: 1050px;
}

.eyebrow,
.hero-content .eyebrow {
  margin-bottom: 12px;
  color: #ff9800;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.map-hero h1 {
  max-width: 860px;
  margin: 0 0 18px;
  color: #f5f5f5;
  font-size: clamp(2.4rem, 6vw, 5rem);
  line-height: 0.96;
  letter-spacing: -0.06em;
}

.map-hero p {
  max-width: 680px;
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.05rem;
  line-height: 1.7;
}

.map-section {
  padding: 24px 0 90px;
}

.map-shell {
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr);
  gap: 24px;
  align-items: stretch;
}

.map-sidebar {
  max-height: 720px;
  overflow: hidden;
  border: 1px solid rgba(255, 152, 0, 0.18);
  border-radius: 32px;
  background: rgba(18, 18, 18, 0.74);
  padding: 24px 18px 24px 24px;
  backdrop-filter: blur(18px);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
}

.sidebar-header {
  padding-right: 14px;
}

.sidebar-header h2 {
  margin: 0 0 22px;
  color: #f5f5f5;
  font-size: clamp(1.8rem, 3vw, 2.3rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.loading-box {
  margin-right: 14px;
  border: 1px solid rgba(255, 152, 0, 0.18);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.045);
  padding: 18px;
  color: rgba(255, 255, 255, 0.72);
}

.locations-list {
  display: grid;
  max-height: 605px;
  overflow-y: auto;
  gap: 16px;
  padding: 4px 14px 4px 0;
  scrollbar-gutter: stable;
}

.locations-list::-webkit-scrollbar {
  width: 7px;
}

.locations-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
}

.locations-list::-webkit-scrollbar-thumb {
  background: rgba(255, 138, 0, 0.6);
  border-radius: 999px;
}

.location-card {
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  gap: 13px;
  min-width: 0;
  padding: 12px;
  border: 1px solid rgba(255, 152, 0, 0.14);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.045);
  cursor: pointer;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;
}

.location-card:hover,
.location-card.active {
  border-color: rgba(255, 152, 0, 0.55);
  background: rgba(255, 152, 0, 0.1);
  transform: translateY(-3px);
}

.location-card img {
  width: 86px;
  height: 86px;
  border-radius: 18px;
  object-fit: cover;
  filter: saturate(0.85) contrast(1.05);
}

.location-card-content {
  min-width: 0;
  overflow: hidden;
}

.location-card-content span,
.floating-card-content span {
  color: #ffb74d;
  font-size: 0.74rem;
  font-weight: 800;
}

.location-card-content h3 {
  margin: 6px 0;
  color: #f5f5f5;
  font-size: 0.98rem;
  line-height: 1.15;
}

.location-card-content p {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.84rem;
  line-height: 1.42;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.map-area {
  position: relative;
  min-height: 720px;
  overflow: hidden;
  border: 1px solid rgba(255, 152, 0, 0.2);
  border-radius: 32px;
  background: #111;
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.42);
}

.leaflet-map {
  width: 100%;
  height: 100%;
  min-height: 720px;
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
  background: rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(1.5px);
}

.loader-card {
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 360px;
  border: 1px solid rgba(255, 183, 77, 0.3);
  border-radius: 22px;
  background: rgba(18, 12, 6, 0.86);
  padding: 15px 17px;
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.42);
}

.loader-card div {
  display: grid;
  gap: 4px;
}

.loader-card strong {
  color: #fff;
  font-size: 0.9rem;
}

.loader-card span {
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.8rem;
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
  left: 22px;
  bottom: 22px;
  z-index: 500;
  display: grid;
  grid-template-columns: 118px minmax(0, 1fr);
  width: min(475px, calc(100% - 44px));
  overflow: hidden;
  border: 1px solid rgba(255, 152, 0, 0.24);
  border-radius: 24px;
  background: rgba(13, 13, 13, 0.84);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.52);
  animation: cardIn 0.35s ease;
}

.floating-card img {
  width: 100%;
  height: 100%;
  min-height: 172px;
  object-fit: cover;
  transition: 0.35s ease;
}

.floating-card-content {
  min-width: 0;
  padding: 16px;
}

.floating-card-content h2 {
  margin: 5px 0 8px;
  color: #f5f5f5;
  font-size: 1.16rem;
  line-height: 1.1;
}

.floating-card-content p {
  display: -webkit-box;
  margin: 0 0 9px;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.84rem;
  line-height: 1.42;
  -webkit-box-orient: vertical;
}

.floating-address {
  color: #ffb74d !important;
  font-weight: 700;
  -webkit-line-clamp: 1;
}

.floating-description {
  -webkit-line-clamp: 2;
}

.floating-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.floating-actions :deep(.v-btn) {
  min-height: 36px;
  padding-inline: 13px;
  font-size: 0.78rem;
  font-weight: 800;
}

.historical-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 700;
  width: min(310px, calc(100% - 40px));
  border: 1px solid rgba(255, 183, 77, 0.32);
  border-radius: 22px;
  background: rgba(18, 12, 6, 0.84);
  padding: 16px;
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

.historical-panel-header span {
  color: #ffb74d;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.historical-panel-header strong {
  color: #fff;
  font-size: 1.4rem;
}

.historical-panel p {
  margin: 8px 0 14px;
  color: rgba(255, 255, 255, 0.74);
  font-size: 0.84rem;
  line-height: 1.4;
}

.historical-note {
  margin: -4px 0 14px;
  border: 1px solid rgba(255, 183, 77, 0.22);
  border-radius: 15px;
  background: rgba(255, 152, 0, 0.08);
  padding: 9px 11px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.74rem;
  line-height: 1.35;
}

.year-slider {
  display: grid;
  gap: 12px;
}

.years-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.years-row button {
  min-width: 56px;
  border: 1px solid rgba(255, 152, 0, 0.22);
  border-radius: 999px;
  background: rgba(255, 152, 0, 0.08);
  padding: 7px 10px;
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.76rem;
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

:deep(.leaflet-control-attribution) {
  display: none !important;
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

:deep(.custom-map-marker) {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent !important;
  border: none !important;
}

:deep(.map-pin) {
  position: relative;
  width: 30px;
  height: 30px;
  background: #ff8a00;
  border: 3px solid #111;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-shadow: 0 5px 11px rgba(0, 0, 0, 0.42);
}

:deep(.map-pin-dot) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #111;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

:deep(.leaflet-top.leaflet-right) {
  top: auto;
  right: 16px;
  bottom: 16px;
}

:deep(.leaflet-control-zoom) {
  display: block;
  overflow: hidden;
  border: 1px solid rgba(255, 152, 0, 0.32) !important;
  border-radius: 16px !important;
  background: rgba(18, 18, 18, 0.88) !important;
  backdrop-filter: blur(14px);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.38);
}

:deep(.leaflet-control-zoom a) {
  width: 42px !important;
  height: 42px !important;
  border: 0 !important;
  background: transparent !important;
  color: #ffb74d !important;
  font-size: 1.35rem !important;
  line-height: 42px !important;
  font-weight: 900 !important;
}

:deep(.leaflet-control-zoom a:hover) {
  color: #ffb74d !important;
}

.mobile-history-panel {
  display: none;
}

.desktop-history-panel {
  display: block;
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

@media (max-width: 1180px) {
  .map-shell {
    grid-template-columns: 1fr;
  }

  .map-sidebar {
    order: 2;
    max-height: none;
  }

  .locations-list {
    max-height: none;
    padding-right: 0;
  }

  .map-area,
  .leaflet-map {
    min-height: 640px;
  }
}

@media (max-width: 768px) {
  .map-hero {
    padding: 74px 0 0px;
  }

  .content-wrap {
    padding-inline: 20px;
  }

  .eyebrow {
    font-size: 1.1rem;
    letter-spacing: 0.14em;
  }

  .map-hero h1 {
    max-width: 100%;
    font-size: clamp(2.45rem, 12vw, 3.7rem);
    line-height: 0.98;
  }

  .map-hero p {
    max-width: 100%;
    font-size: 1rem;
    line-height: 1.65;
  }

  .map-section {
    padding: 20px 0 64px;
  }

  .map-shell {
    gap: 18px;
  }

  .map-sidebar {
    border-radius: 26px;
    padding: 18px;
  }

  .sidebar-header,
  .loading-box {
    padding-right: 0;
    margin-right: 0;
  }

  .map-area,
  .leaflet-map {
    min-height: 560px;
    border-radius: 26px;
  }

  .locations-list {
    gap: 14px;
    padding: 2px;
  }

  .location-card {
    grid-template-columns: 82px minmax(0, 1fr);
    gap: 12px;
    padding: 11px;
  }

  .location-card:hover,
  .location-card.active {
    transform: none;
  }

  .location-card img {
    width: 82px;
    height: 82px;
  }

  .map-loading-overlay {
    align-items: start;
    padding-top: 92px;
  }

  .loader-card {
    max-width: calc(100% - 28px);
    margin: 0 14px;
  }

  .historical-error {
    top: 14px;
    left: 14px;
    right: 14px;
    max-width: none;
  }

  .floating-card {
    left: 12px;
    bottom: 12px;
    grid-template-columns: 92px minmax(0, 1fr);
    width: calc(100% - 24px);
    border-radius: 22px;
  }

  .floating-card img {
    min-height: 142px;
  }

  .floating-card-content {
    padding: 13px;
  }

  .floating-card-content h2 {
    font-size: 1.05rem;
  }

  .floating-card-content p {
    margin-bottom: 7px;
    font-size: 0.78rem;
  }

  .floating-description {
    -webkit-line-clamp: 1;
  }

  .floating-actions {
    gap: 7px;
  }

  .floating-actions :deep(.v-btn) {
    flex: 1 1 auto;
    min-height: 34px;
    padding-inline: 10px;
    font-size: 0.72rem;
  }

  .desktop-history-panel {
    display: none;
  }

  .mobile-history-panel {
    position: relative;
    top: auto;
    right: auto;
    left: auto;
    z-index: 1;
    display: block;
    width: 100%;
    margin-bottom: 14px;
  }

  :deep(.leaflet-top.leaflet-right) {
    top: 16px;
    right: 16px;
    bottom: auto;
  }
}

@media (max-width: 420px) {
  .content-wrap {
    padding-inline: 16px;
  }

  .map-hero {
    padding: 58px 0 24px;
  }

  .map-section {
    padding: 18px 0 56px;
  }

  .map-hero h1 {
    font-size: clamp(2.25rem, 13vw, 3rem);
  }

  .hero-glow-one {
    width: 210px;
    height: 210px;
    right: -70px;
  }

  .hero-glow-two {
    width: 140px;
    height: 140px;
    left: -50px;
  }

  .map-area,
  .leaflet-map {
    min-height: 520px;
  }

  .map-sidebar {
    padding: 16px;
  }

  .location-card {
    grid-template-columns: 74px minmax(0, 1fr);
    gap: 11px;
    border-radius: 20px;
  }

  .location-card img {
    width: 74px;
    height: 74px;
    border-radius: 16px;
  }

  .location-card-content p {
    -webkit-line-clamp: 1;
  }

  .floating-card {
    grid-template-columns: 1fr;
    width: calc(100% - 24px);
  }

  .floating-card img {
    height: 92px;
    min-height: 92px;
  }

  .floating-description {
    display: none !important;
  }

  .floating-actions {
    flex-direction: column;
  }

  .floating-actions :deep(.v-btn) {
    width: 100%;
    min-height: 36px;
  }

  .historical-panel {
    width: 100%;
  }
}
@media (max-width: 430px) {
  .map-popup {
    display: flex !important;
    flex-direction: row !important;
    align-items: stretch;

    left: 10px;
    right: 10px;
    bottom: 10px;
  }

  .map-popup img,
  .map-popup-image {
    width: 95px !important;
    min-width: 95px !important;
    object-fit: cover;
  }

  .map-popup-content {
    padding: 10px !important;
    min-width: 0;
  }

  .map-popup-title {
    font-size: 16px !important;
    line-height: 1.1;
  }

  .map-popup-description {
    font-size: 11px !important;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    overflow: hidden;
  }

  .map-popup-actions {
    display: flex !important;
    flex-direction: row !important;
    gap: 6px;
  }

  .map-popup-actions button,
  .map-popup-actions a {
    flex: 1;
    height: 36px;
    font-size: 11px;
    padding: 0 8px;
  }
}
</style>
