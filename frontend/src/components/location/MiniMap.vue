<template>
  <section class="mini-map-section">
    <div class="section-header">
      <p class="eyebrow">Pe hartă</p>
      <h2>Unde se află locul</h2>
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

const createOrangeIcon = () => {
  return L.divIcon({
    className: 'custom-location-marker',
    html: '<div class="marker-dot"></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

const initMap = () => {
  if (!mapElement.value || map) return

  map = L.map(mapElement.value, {
    zoomControl: true,
    scrollWheelZoom: false,
  }).setView([props.lat, props.lng], 18)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  marker = L.marker([props.lat, props.lng], {
    icon: createOrangeIcon(),
  })
    .addTo(map)
    .bindPopup(`<strong>${props.title}</strong><br>${props.address || ''}`)

  setTimeout(() => {
    map.invalidateSize()
  }, 100)
}

const updateMap = () => {
  if (!map || !marker) return

  const position = [props.lat, props.lng]
  map.setView(position, 16)
  marker.setLatLng(position)
  marker.bindPopup(`<strong>${props.title}</strong><br>${props.address || ''}`)
}

onMounted(() => {
  initMap()
})

watch(
  () => [props.lat, props.lng],
  () => {
    updateMap()
  },
)

onBeforeUnmount(() => {
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
  font-size: 0.78rem;
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

.map-card {
  background: rgba(24, 24, 24, 0.92);
  border: 1px solid rgba(255, 138, 0, 0.18);
  overflow: hidden;
}

.map {
  width: 100%;
  height: 360px;
}

:deep(.custom-location-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-dot) {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #ff8a00;
  border: 4px solid #0f0f0f;
  box-shadow:
    0 0 0 6px rgba(255, 138, 0, 0.22),
    0 10px 24px rgba(0, 0, 0, 0.35);
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

@media (max-width: 700px) {
  .map {
    height: 300px;
  }
}
</style>