<template>
  <section class="mini-map-section">
    <div class="section-header">
      <p class="eyebrow">Harta locului</p>

      <p class="section-description">
        Vezi poziția aproximativă a acestui punct de pe strada Popa Nan.
      </p>
    </div>

    <v-card class="map-card" rounded="xl">
      <div ref="mapElement" class="map"></div>
    </v-card>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    default: 'Locație',
  },
  address: {
    type: String,
    default: '',
  },
})

const mapElement = ref(null)

let map = null
let marker = null

const createLocationIcon = () => {
  return L.divIcon({
    className: 'custom-orange-marker',
    html: `
      <div class="marker-pin">
        <div class="marker-icon"></div>
      </div>
    `,
    iconSize: [34, 48],
    iconAnchor: [17, 48],
    popupAnchor: [0, -42],
  })
}

const getZoomByScreen = () => {
  return window.innerWidth <= 700 ? 18 : 18
}

const initMap = () => {
  if (!mapElement.value || map) return

  const position = [props.lat, props.lng]

  map = L.map(mapElement.value, {
    zoomControl: true,
    // scrollWheelZoom: window.innerWidth > 700,
    scrollWheelZoom: false,
    attributionControl: false,
    maxZoom: 19,
  }).setView(position, getZoomByScreen())

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map)

  marker = L.marker(position, {
    icon: createLocationIcon(),
  })
    .addTo(map)
    .bindPopup(`<strong>${props.title}</strong>${props.address ? `<br>${props.address}` : ''}`)

  setTimeout(() => {
    map.invalidateSize()
  }, 150)
}

const updateMap = () => {
  if (!map || !marker) return

  const position = [props.lat, props.lng]

  map.setView(position, getZoomByScreen())
  marker.setLatLng(position)
  marker.bindPopup(`<strong>${props.title}</strong>${props.address ? `<br>${props.address}` : ''}`)

  if (window.innerWidth > 700) {
    map.scrollWheelZoom.enable()
  } else {
    map.scrollWheelZoom.disable()
  }

  setTimeout(() => {
    map.invalidateSize()
  }, 150)
}

onMounted(() => {
  initMap()
  window.addEventListener('resize', updateMap)
})

watch(
  () => [props.lat, props.lng, props.title, props.address],
  () => {
    updateMap()
  },
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMap)

  if (map) {
    map.remove()
    map = null
    marker = null
  }
})
</script>

<style scoped>
.mini-map-section {
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

.section-description {
  color: rgba(245, 245, 245, 0.72);
  max-width: 640px;
  line-height: 1.7;
}

.map-card {
  background: rgba(24, 24, 24, 0.92);
  border: 1px solid rgba(255, 138, 0, 0.18);
  overflow: hidden;
}

.map {
  width: 100%;
  height: clamp(280px, 42vw, 420px);
  min-height: 280px;
}

:deep(.custom-orange-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-pin) {
  position: relative;
  width: 34px;
  height: 34px;
  background: #ff8a00;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  border: 3px solid #0f0f0f;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.35);
}

:deep(.marker-pin::after) {
  content: '';
  position: absolute;
  inset: 9px;
  background: #0f0f0f;
  border-radius: 50%;
}

:deep(.custom-orange-marker) {
  background: transparent;
  border: none;
  width: 34px !important;
  height: 48px !important;
}

:deep(.leaflet-popup-content-wrapper),
:deep(.leaflet-popup-tip) {
  background: #181818;
  color: #f5f5f5;
}

:deep(.leaflet-popup-content) {
  color: #f5f5f5;
  line-height: 1.5;
}

:deep(.leaflet-control-attribution) {
  display: none;
}

:deep(.leaflet-control-zoom) {
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
  background: rgba(255, 152, 0, 0.12) !important;
  color: #ffb74d !important;
}

@media (max-width: 700px) {
  .mini-map-section {
    margin-bottom: 48px;
  }

  .section-header {
    margin-bottom: 18px;
  }

  .eyebrow {
    font-size: 1rem;
  }

  .section-description {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .map {
    height: 300px;
  }

  :deep(.leaflet-control-zoom) {
    transform: scale(0.9);
    transform-origin: top left;
  }
}

@media (max-width: 420px) {
  .map {
    height: 260px;
  }
}
</style>
