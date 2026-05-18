<template>
  <main class="tour-details-page">
    <section v-if="loading" class="state-section">Se încarcă turul...</section>

    <section v-else-if="error" class="state-section error">
      {{ error }}
    </section>

    <template v-else-if="selectedTour">
      <section class="tour-hero">
        <div class="hero-glow hero-glow-one"></div>
        <div class="hero-glow hero-glow-two"></div>

        <img :src="selectedTour.coverImage" :alt="selectedTour.title" class="hero-image" />
        <div class="hero-overlay"></div>

        <v-container class="content-wrap">
          <div class="hero-content">
            <div class="hero-row">
              <p class="eyebrow">{{ selectedTour.theme }}</p>

              <div v-if="isTourCompleted" class="completed-badge">
                <v-icon size="18">mdi-check-decagram</v-icon>
                Traseu finalizat
              </div>
            </div>

            <h1>{{ selectedTour.title }}</h1>

            <p>{{ selectedTour.shortDescription }}</p>

            <div class="hero-meta">
              <span>
                <v-icon size="20">mdi-clock-outline</v-icon>
                {{ selectedTour.duration }}
              </span>

              <span>
                <v-icon size="20">mdi-map-marker-distance</v-icon>
                {{ selectedTour.distance }}
              </span>

              <span>
                <v-icon size="20">mdi-walk</v-icon>
                {{ selectedTour.difficulty }}
              </span>

              <span>
                <v-icon size="20">mdi-map-marker-path</v-icon>
                {{ selectedTour.stops.length }} opriri
              </span>
            </div>
          </div>
        </v-container>
      </section>

      <section class="tour-body-section">
        <v-container class="content-wrap">
          <div class="tour-body" :class="{ 'walk-active': isWalkModeActive }">
            <div class="main-column">
              <article class="glass-card story-card">
                <p class="eyebrow">Povestea traseului</p>

                <p style="text-align: justify">{{ selectedTour.description }}</p>
              </article>

              <article id="tour-stops" class="glass-card stops-card">
                <div class="section-header">
                  <div>
                    <p class="eyebrow">Opriri</p>
                  </div>

                  <div class="progress-pill">
                    {{ completedStops }}/{{ selectedTour.stops.length }} parcurse
                  </div>
                </div>

                <div v-if="isTourCompleted" class="finished-card">
                  <v-icon size="22">mdi-check-circle</v-icon>
                  <span>Ai finalizat acest traseu.</span>
                </div>

                <div v-if="!isWalkModeActive" class="stops-route">
                  <div class="route-line"></div>

                  <article
                    v-for="(stop, index) in selectedTour.stops"
                    :key="getStopSlug(stop)"
                    class="route-stop"
                    :class="{ visited: index < completedStops }"
                  >
                    <div class="stop-number">
                      {{ index + 1 }}
                    </div>

                    <div class="stop-content">
                      <h3>{{ getStopTitle(stop) }}</h3>
                      <!-- <p>Oprire {{ index + 1 }} din {{ selectedTour.stops.length }}</p> -->
                    </div>
                  </article>
                </div>

                <div v-else class="walk-mode-card">
                  <div class="walk-map-wrap">
                    <div ref="walkMapRef" class="walk-map"></div>

                    <div class="walk-map-panel">
                      <div v-if="currentStopAudio" class="walk-audio">
                        <div class="mini-audio-player">
                          <button class="mini-play-btn" type="button" @click="toggleAudio">
                            <v-icon size="20">
                              {{ isPlaying ? 'mdi-pause' : 'mdi-play' }}
                            </v-icon>
                          </button>

                          <div class="mini-audio-main">
                            <div class="mini-audio-top">
                              <span>Poveste audio</span>

                              <strong>
                                {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                              </strong>
                            </div>

                            <input
                              v-model="currentTime"
                              type="range"
                              min="0"
                              :max="duration || 0"
                              step="0.1"
                              class="mini-audio-range"
                              @input="seekAudio"
                            />
                          </div>

                          <audio
                            ref="audioRef"
                            :src="currentStopAudio"
                            preload="metadata"
                            @loadedmetadata="setDuration"
                            @timeupdate="updateTime"
                            @ended="onEnded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="walk-actions">
                    <button class="secondary-btn" @click="goToPreviousStop">
                      <v-icon size="18">mdi-chevron-left</v-icon>
                      Înapoi
                    </button>

                    <button class="primary-btn" @click="goToNextStop">
                      {{ isLastStop ? 'Finalizează' : 'Următoarea' }}
                      <v-icon size="18">
                        {{ isLastStop ? 'mdi-check-decagram' : 'mdi-chevron-right' }}
                      </v-icon>
                    </button>
                  </div>
                </div>
              </article>
            </div>

            <aside class="side-column">
              <article class="glass-card start-card">
                <div class="start-icon">
                  <v-icon size="30">mdi-compass-outline</v-icon>
                </div>

                <h2>Pornește la pas</h2>

                <p style="text-align: justify">
                  Fiecare oprire dezvăluie o nouă poveste din memoria străzii Popa Nan.
                </p>

                <button class="ghost-btn route-btn" @click="interruptTourAndShowStops">
                  Vezi opririle
                  <v-icon size="20">mdi-map-marker-path</v-icon>
                </button>

                <button class="primary-btn" @click="handleTourButton">
                  {{ tourButtonLabel }}
                  <v-icon size="20">
                    {{ tourButtonIcon }}
                  </v-icon>
                </button>

                <button class="secondary-btn" @click="goToCurrentStop">
                  Vezi oprirea curentă
                  <v-icon size="20">mdi-map-marker</v-icon>
                </button>

                <button class="secondary-btn" @click="locateUser">
                  Activează locația mea
                  <v-icon size="20">mdi-crosshairs-gps</v-icon>
                </button>

                <button
                  v-if="isTourCompleted"
                  class="ghost-btn reset-btn"
                  @click="resetTourCompletion"
                >
                  Resetează traseul
                  <v-icon size="20">mdi-refresh</v-icon>
                </button>

                <div v-if="locationStatus" class="location-status">
                  {{ locationStatus }}
                </div>
              </article>
            </aside>
          </div>
        </v-container>
      </section>

      <v-dialog v-model="showCompletionDialog" max-width="520">
        <div class="completion-dialog">
          <div class="confetti-wrap">
            <span v-for="piece in 18" :key="piece" class="confetti-piece"></span>
          </div>

          <div class="completion-icon">
            <v-icon size="44">mdi-check-decagram</v-icon>
          </div>

          <p class="completion-kicker">Traseu finalizat</p>

          <h2>Ai parcurs traseul complet!</h2>

          <p class="completion-text">
            Felicitări! Ai descoperit toate opririle acestui tur și progresul a fost salvat.
          </p>

          <div class="completion-dialog-badge">
            <v-icon size="18">mdi-trophy-award</v-icon>
            Explorator Popa Nan
          </div>

          <button class="primary-btn dialog-btn" @click="showCompletionDialog = false">
            Super!
            <v-icon size="20">mdi-party-popper</v-icon>
          </button>
        </div>
      </v-dialog>
    </template>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useToursStore } from '@/stores/tours'
import { useLocationsStore } from '@/stores/locations'

const route = useRoute()
const router = useRouter()

const toursStore = useToursStore()
const locationsStore = useLocationsStore()

const { selectedTour, loading, error } = storeToRefs(toursStore)
const { locations } = storeToRefs(locationsStore)

const currentStopIndex = ref(0)
const completedStops = ref(0)
const isWalkModeActive = ref(false)
const isTourCompleted = ref(false)
const showCompletionDialog = ref(false)

const audioRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const walkMapRef = ref(null)
const walkMap = ref(null)
const walkMarkers = ref([])
const walkPolyline = ref(null)
const userMarker = ref(null)
const userPosition = ref(null)
const locationStatus = ref('')

const tourSlug = computed(() => selectedTour.value?.slug || route.params.slug)

const tourStorageKey = computed(() => {
  return tourSlug.value ? `discover-popanan-tour-${tourSlug.value}` : null
})

const tourButtonLabel = computed(() => {
  if (isWalkModeActive.value) return 'Tur pornit'
  if (completedStops.value > 0 && !isTourCompleted.value) return 'Mergi mai departe'
  if (isTourCompleted.value) return 'Finalizat'
  return 'Începe turul'
})

const tourButtonIcon = computed(() => {
  if (isWalkModeActive.value) return 'mdi-check-circle'
  if (completedStops.value > 0 && !isTourCompleted.value) return 'mdi-play-circle'
  if (isTourCompleted.value) return 'mdi-check-decagram'
  return 'mdi-play-circle'
})

const tourStops = computed(() => {
  if (!selectedTour.value?.stops?.length || !locations.value.length) return []

  return selectedTour.value.stops
    .map((stop) => {
      const slug = getStopSlug(stop)
      const location = locations.value.find((item) => item.slug === slug)

      if (!location) return null

      return {
        ...location,
        stopAudio: getStopAudio(stop) || location.audio || null,
      }
    })
    .filter(Boolean)
})

const currentStopAudio = computed(() => currentStopLocation.value?.stopAudio || null)

const currentStopLocation = computed(() => tourStops.value[currentStopIndex.value] || null)

const currentStopTitle = computed(() => {
  const stop = selectedTour.value?.stops?.[currentStopIndex.value]
  return getStopTitle(stop)
})

const currentStopStory = computed(() => {
  const location = currentStopLocation.value

  return (
    location?.history ||
    location?.story ||
    location?.description ||
    location?.shortDescription ||
    ''
  )
})

const isLastStop = computed(() => {
  const total = selectedTour.value?.stops?.length || 0
  return currentStopIndex.value === total - 1
})

const isNearCurrentStop = computed(() => {
  if (!userPosition.value || !currentStopLocation.value) return false

  const coords = getLocationCoords(currentStopLocation.value)
  if (!coords) return false

  const distance = getDistanceInMeters(
    userPosition.value.lat,
    userPosition.value.lng,
    coords[0],
    coords[1],
  )

  return distance <= 60
})

const getStopSlug = (stop) => {
  return typeof stop === 'string' ? stop : stop.slug
}

const getStopAudio = (stop) => {
  return typeof stop === 'string' ? null : stop.audio
}

const getStopTitle = (stop) => {
  const slug = getStopSlug(stop)
  const location = locations.value.find((item) => item.slug === slug)

  if (location?.title) return location.title
  if (!slug) return 'Oprire'

  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const destroyWalkMap = () => {
  clearWalkMapLayers()

  if (userMarker.value) {
    userMarker.value.remove()
    userMarker.value = null
  }

  if (walkMap.value) {
    walkMap.value.off('popupopen', attachPopupActions)
    walkMap.value.remove()
    walkMap.value = null
  }
}

const getLocationCoords = (location) => {
  if (!location) return null

  let lat = null
  let lng = null

  if (location.lat !== undefined && location.lng !== undefined) {
    lat = Number(location.lat)
    lng = Number(location.lng)
  } else if (location.latitude !== undefined && location.longitude !== undefined) {
    lat = Number(location.latitude)
    lng = Number(location.longitude)
  } else if (location.coordinates?.lat !== undefined && location.coordinates?.lng !== undefined) {
    lat = Number(location.coordinates.lat)
    lng = Number(location.coordinates.lng)
  } else if (Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
    lat = Number(location.coordinates[0])
    lng = Number(location.coordinates[1])
  } else if (location.position?.lat !== undefined && location.position?.lng !== undefined) {
    lat = Number(location.position.lat)
    lng = Number(location.position.lng)
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null
  }

  return [lat, lng]
}

const getDistanceInMeters = (lat1, lng1, lat2, lng2) => {
  const earthRadius = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadius * c
}

const createMarkerIcon = (index, active) => {
  return L.divIcon({
    className: '',
    html: `
      <div class="${active ? 'tour-marker active' : 'tour-marker'}">
        ${index + 1}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -18],
  })
}

const createUserIcon = () => {
  return L.divIcon({
    className: '',
    html: '<div class="user-location-marker"><span></span></div>',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

const escapeHtml = (value) => {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

const getStopPopupHtml = (location, index) => {
  const story =
    location?.history ||
    location?.story ||
    location?.description ||
    location?.shortDescription ||
    ''

  const nearBadge =
    index === currentStopIndex.value && isNearCurrentStop.value
      ? `<div class="leaflet-near-badge">Ești aproape</div>`
      : ''

  return `
    <div class="tour-stop-popup">
      <div class="popup-head">
        <div>
          <span>Oprirea curentă</span>
          <strong>${escapeHtml(location.title)}</strong>
        </div>
        ${nearBadge}
      </div>

      ${story ? `<p>${escapeHtml(story)}</p>` : ''}

      <div class="popup-actions">
        <button type="button" data-popup-action="details" data-popup-index="${index}">
          Află mai multe
        </button>

        <button type="button" data-popup-action="location">
          Locația mea
        </button>
      </div>
    </div>
  `
}

const attachPopupActions = (event) => {
  const popupElement = event.popup.getElement()
  if (!popupElement) return

  popupElement.onclick = (clickEvent) => {
    const button = clickEvent.target.closest('button[data-popup-action]')
    if (!button) return

    const action = button.dataset.popupAction

    if (action === 'details') {
      const index = Number(button.dataset.popupIndex)
      const stop = selectedTour.value?.stops?.[index]
      const stopSlug = stop ? getStopSlug(stop) : null

      if (stopSlug) {
        router.push(`/location/${stopSlug}`)
      }
    }

    if (action === 'location') {
      locateUser()
    }
  }
}

const openCurrentStopPopup = () => {
  if (!walkMap.value || !walkMarkers.value[currentStopIndex.value]) return

  walkMarkers.value[currentStopIndex.value].openPopup()
}

const clearWalkMapLayers = () => {
  walkMarkers.value.forEach((marker) => marker.remove())
  walkMarkers.value = []

  if (walkPolyline.value) {
    walkPolyline.value.remove()
    walkPolyline.value = null
  }
}

const saveTourProgress = () => {
  if (!tourStorageKey.value) return

  const payload = {
    completed: isTourCompleted.value,
    completedStops: completedStops.value,
    currentStopIndex: currentStopIndex.value,
    interrupted: completedStops.value > 0 && !isWalkModeActive.value && !isTourCompleted.value,
    updatedAt: new Date().toISOString(),
  }

  localStorage.setItem(tourStorageKey.value, JSON.stringify(payload))
}

const loadTourProgress = () => {
  if (!tourStorageKey.value) return

  const storedValue = localStorage.getItem(tourStorageKey.value)

  if (!storedValue) {
    isTourCompleted.value = false
    completedStops.value = 0
    currentStopIndex.value = 0
    return
  }

  try {
    const parsedValue = JSON.parse(storedValue)
    const total = selectedTour.value?.stops?.length || 0

    isTourCompleted.value = Boolean(parsedValue.completed)

    completedStops.value = Math.min(Number(parsedValue.completedStops || 0), total)

    currentStopIndex.value = Math.min(
      Number(parsedValue.currentStopIndex || 0),
      Math.max(total - 1, 0),
    )

    if (isTourCompleted.value) {
      completedStops.value = total
    }
  } catch {
    isTourCompleted.value = false
    completedStops.value = 0
    currentStopIndex.value = 0
  }
}

const renderWalkMap = async () => {
  if (!isWalkModeActive.value) return

  await nextTick()

  if (!walkMapRef.value) return

  const validStops = tourStops.value
    .map((location, index) => ({
      location,
      index,
      coords: getLocationCoords(location),
    }))
    .filter((item) => item.coords)

  const points = validStops.map((item) => item.coords)

  if (!points.length) return

  if (!walkMap.value) {
    walkMap.value = L.map(walkMapRef.value, {
      zoomControl: true,
      scrollWheelZoom: false,
    })

    walkMap.value.on('popupopen', attachPopupActions)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(walkMap.value)
  }

  walkMap.value.invalidateSize()

  clearWalkMapLayers()

  walkPolyline.value = L.polyline(points, {
    color: '#ff8a00',
    weight: 5,
    opacity: 0.88,
    lineCap: 'round',
    lineJoin: 'round',
  }).addTo(walkMap.value)

  validStops.forEach(({ location, index, coords }) => {
    if (!coords) return

    const marker = L.marker(coords, {
      icon: createMarkerIcon(index, index === currentStopIndex.value),
    })
      .addTo(walkMap.value)
      .bindPopup(getStopPopupHtml(location, index), {
        maxWidth: window.innerWidth <= 640 ? 280 : 520,
        minWidth: window.innerWidth <= 640 ? 250 : 420,
        autoPan: true,
        autoPanPadding: window.innerWidth <= 640 ? [28, 130] : [60, 60],
        closeButton: true,
      })

    marker.on('click', () => {
      currentStopIndex.value = index
      completedStops.value = Math.max(completedStops.value, index + 1)
      saveTourProgress()
    })

    walkMarkers.value.push(marker)
  })

  if (points.length === 1) {
    walkMap.value.setView(points[0], 17)
  } else {
    const bounds = L.latLngBounds(points)

    walkMap.value.fitBounds(bounds, {
      paddingTopLeft: [42, 42],
      paddingBottomRight: [42, window.innerWidth <= 640 ? 260 : 160],
      maxZoom: 17,
    })
  }

  renderUserMarker()
  focusCurrentStopOnMap()

  setTimeout(() => {
    walkMap.value?.invalidateSize()
    openCurrentStopPopup()
  }, 300)
}

const renderUserMarker = () => {
  if (!walkMap.value || !userPosition.value) return

  const coords = [userPosition.value.lat, userPosition.value.lng]

  if (!userMarker.value) {
    userMarker.value = L.marker(coords, {
      icon: createUserIcon(),
    })
      .addTo(walkMap.value)
      .bindPopup('<strong>Locația ta</strong>')

    return
  }

  userMarker.value.setLatLng(coords)
}

const focusCurrentStopOnMap = () => {
  if (!walkMap.value || !isWalkModeActive.value) return

  const location = tourStops.value[currentStopIndex.value]
  const coords = getLocationCoords(location)

  if (!coords) {
    return
  }

  const isMobile = window.innerWidth <= 640
  const zoom = 17

  walkMap.value.flyTo(coords, zoom, {
    duration: 0.75,
  })

  setTimeout(() => {
    if (!walkMap.value) return

    const panelOffset = isMobile ? 120 : 120

    walkMap.value.panBy([0, panelOffset], {
      animate: true,
      duration: 0.35,
    })

    openCurrentStopPopup()
  }, 780)
}

const locateUser = () => {
  if (!navigator.geolocation) {
    locationStatus.value = 'Browserul nu permite localizarea.'
    return
  }

  locationStatus.value = 'Se caută locația ta...'

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userPosition.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      locationStatus.value = isNearCurrentStop.value
        ? 'Ești aproape de oprirea curentă.'
        : 'Locația ta a fost activată.'

      renderUserMarker()

      if (walkMap.value) {
        walkMap.value.flyTo([userPosition.value.lat, userPosition.value.lng], 17, {
          duration: 0.8,
        })
      }
    },
    () => {
      locationStatus.value = 'Nu am putut accesa locația. Verifică permisiunile browserului.'
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
  )
}

const toggleAudio = async () => {
  if (!audioRef.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
    return
  }

  await audioRef.value.play()
  isPlaying.value = true
}

const setDuration = () => {
  duration.value = audioRef.value?.duration || 0
}

const updateTime = () => {
  currentTime.value = audioRef.value?.currentTime || 0
}

const seekAudio = () => {
  if (!audioRef.value) return
  audioRef.value.currentTime = currentTime.value
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
}

const formatTime = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return '0:00'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const startTour = async () => {
  if (isTourCompleted.value) {
    resetTourCompletion()
  }

  isWalkModeActive.value = true

  if (completedStops.value === 0) {
    currentStopIndex.value = 0
    completedStops.value = 1
  }

  saveTourProgress()

  await nextTick()
  renderWalkMap()

  document.getElementById('tour-stops')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

const handleTourButton = async () => {
  if (isWalkModeActive.value) return

  await startTour()
}

const interruptTourAndShowStops = async () => {
  isWalkModeActive.value = false
  saveTourProgress()
  destroyWalkMap()

  await nextTick()

  document.getElementById('tour-stops')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

const completeTour = () => {
  const total = selectedTour.value?.stops?.length || 0

  completedStops.value = total
  isTourCompleted.value = true
  isWalkModeActive.value = false
  showCompletionDialog.value = true
  saveTourProgress()
}

const resetTourCompletion = () => {
  destroyWalkMap()

  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }

  isPlaying.value = false
  currentTime.value = 0
  duration.value = 0

  isTourCompleted.value = false
  isWalkModeActive.value = false
  showCompletionDialog.value = false
  locationStatus.value = ''
  userPosition.value = null

  completedStops.value = 0
  currentStopIndex.value = 0

  if (tourStorageKey.value) {
    localStorage.removeItem(tourStorageKey.value)
  }
}

const goToCurrentStop = () => {
  const stop = selectedTour.value?.stops?.[currentStopIndex.value]
  const stopSlug = stop ? getStopSlug(stop) : null

  if (stopSlug) {
    router.push({
      name: 'location-details',
      params: {
        slug: stopSlug,
      },
    })
  }
}

const goToPreviousStop = () => {
  if (currentStopIndex.value > 0) {
    currentStopIndex.value -= 1
    saveTourProgress()
  }
}

const goToNextStop = () => {
  const total = selectedTour.value?.stops?.length || 0

  if (currentStopIndex.value < total - 1) {
    currentStopIndex.value += 1
    completedStops.value = Math.max(completedStops.value, currentStopIndex.value + 1)
    saveTourProgress()
    return
  }

  completeTour()
}

const scrollToStops = interruptTourAndShowStops

watch(currentStopIndex, (value) => {
  if (isTourCompleted.value || completedStops.value > 0 || isWalkModeActive.value) {
    completedStops.value = Math.max(completedStops.value, value + 1)
  }

  isPlaying.value = false
  currentTime.value = 0

  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }

  if (completedStops.value > 0 || isTourCompleted.value) {
    saveTourProgress()
  }

  renderWalkMap()
  focusCurrentStopOnMap()
})

watch(isWalkModeActive, async (active) => {
  saveTourProgress()

  if (active) {
    await nextTick()
    renderWalkMap()
  }
})

watch(tourStops, () => {
  renderWalkMap()
})

watch(selectedTour, () => {
  loadTourProgress()
})

onMounted(async () => {
  await toursStore.fetchTourBySlug(route.params.slug)

  if (!locations.value.length) {
    await locationsStore.fetchLocations()
  }

  loadTourProgress()
})

onBeforeUnmount(() => {
  saveTourProgress()
  destroyWalkMap()
})
</script>

<style scoped>
.tour-details-page {
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

.tour-hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 680px;
  overflow: hidden;
  padding: 100px 0 70px;
}

.hero-glow {
  position: absolute;
  z-index: 1;
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
  background: rgba(255, 138, 0, 0.18);
}

.hero-glow-two {
  width: 160px;
  height: 160px;
  bottom: 60px;
  left: 8%;
  background: rgba(234, 88, 12, 0.16);
}

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(8, 8, 8, 0.18), rgba(8, 8, 8, 0.96)),
    radial-gradient(circle at top right, rgba(255, 138, 0, 0.24), transparent 42rem);
}

.hero-content {
  max-width: 940px;
}

.hero-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
}

.eyebrow {
  margin: 0 0 12px;
  color: #ff9800;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.completed-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 12px;
  padding: 0.58rem 0.9rem;
  border: 1px solid rgba(34, 197, 94, 0.4);
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  color: #86efac;
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-content h1 {
  max-width: 900px;
  margin: 0;
  color: #f5f5f5;
  font-size: clamp(2.4rem, 7vw, 6.5rem);
  line-height: 0.9;
  letter-spacing: -0.075em;
}

.hero-content p:not(.eyebrow) {
  max-width: 720px;
  margin: 1.4rem 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.8;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.8rem;
}

.hero-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.72rem 0.95rem;
  border: 1px solid rgba(255, 152, 0, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  color: rgba(255, 255, 255, 0.84);
  font-weight: 800;
  backdrop-filter: blur(14px);
}

.tour-body-section {
  position: relative;
  z-index: 3;
  padding: 0 0 90px;
}

.tour-body {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.6fr);
  gap: 24px;
}

.main-column,
.side-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.glass-card {
  border: 1px solid rgba(255, 152, 0, 0.16);
  border-radius: 32px;
  background: rgba(18, 18, 18, 0.74);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(18px);
  padding: 24px;
}

.story-card h2,
.stops-card h2,
.start-card h2 {
  margin: 0;
  color: #f5f5f5;
  font-size: clamp(1.8rem, 3vw, 2.7rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.story-card p:not(.eyebrow),
.start-card p {
  margin: 1rem 0 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 1rem;
  line-height: 1.85;
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 20px;
}

.progress-pill {
  flex: 0 0 auto;
  border-radius: 999px;
  background: rgba(255, 138, 0, 0.14);
  color: #ffad4d;
  padding: 0.7rem 0.95rem;
  font-weight: 900;
  white-space: nowrap;
}

.finished-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(34, 197, 94, 0.28);
  border-radius: 18px;
  background: rgba(34, 197, 94, 0.1);
  color: #86efac;
  font-weight: 900;
}

.stops-route {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.route-line {
  position: absolute;
  top: 30px;
  bottom: 30px;
  left: 28px;
  width: 3px;
  border-radius: 999px;
  /* background: linear-gradient(to bottom, #ff8a00, rgba(234, 88, 12, 0.26)); */
}

.route-stop {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  align-items: center;
  width: 100%;
  border: 1px solid rgba(255, 138, 0, 0.34);
  border-radius: 24px;
  /* background:
    linear-gradient(135deg, rgba(255, 138, 0, 0.15), rgba(234, 88, 12, 0.07)),
    rgba(255, 255, 255, 0.045); */
  color: #fff;
  padding: 16px;
  text-align: left;
  pointer-events: none;
}

.stop-number {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff8a00, #ea580c);
  color: #160800;
  font-size: 1rem;
  font-weight: 950;
  box-shadow: 0 0 0 8px rgba(255, 138, 0, 0.12);
}

.stop-content h3 {
  margin: 0;
  color: #f5f5f5;
  font-size: 1.05rem;
  line-height: 1.25;
}

.stop-content p {
  margin: 0.3rem 0 0;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.92rem;
  font-weight: 700;
}

.side-column {
  align-self: start;
}

.start-card {
  position: sticky;
  top: 6rem;
}

.start-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  margin-bottom: 1rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #ff8a00, #ea580c);
  color: #160800;
}

.primary-btn,
.secondary-btn,
.ghost-btn,
.mini-primary-btn,
.mini-secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border-radius: 999px;
  padding: 0.9rem 1rem;
  font-weight: 950;
  cursor: pointer;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease;
}

.primary-btn:hover,
.secondary-btn:hover,
.ghost-btn:hover,
.mini-primary-btn:hover,
.mini-secondary-btn:hover {
  transform: translateY(-2px);
}

.primary-btn,
.secondary-btn {
  width: 100%;
}

.primary-btn {
  margin-top: 1.4rem;
  border: 0;
  background: linear-gradient(135deg, #ff8a00, #ea580c);
  color: #160800;
}

.secondary-btn {
  margin-top: 0.75rem;
  border: 1px solid rgba(255, 138, 0, 0.35);
  background: rgba(255, 138, 0, 0.08);
  color: #ffad4d;
}

.ghost-btn {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.055);
  color: rgba(255, 255, 255, 0.78);
}

.reset-btn {
  width: 100%;
  margin-top: 0.75rem;
}

.mini-primary-btn,
.mini-secondary-btn {
  width: fit-content;
  padding: 0.65rem 0.85rem;
  font-size: 0.86rem;
}

.mini-primary-btn {
  border: 0;
  background: linear-gradient(135deg, #ff8a00, #ea580c);
  color: #160800;
}

.mini-secondary-btn {
  border: 1px solid rgba(255, 138, 0, 0.3);
  background: rgba(255, 138, 0, 0.08);
  color: #ffad4d;
}

.completion-box {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 1rem;
  padding: 0.8rem;
  border: 1px solid rgba(34, 197, 94, 0.28);
  border-radius: 18px;
  background: rgba(34, 197, 94, 0.1);
  color: #86efac;
  font-weight: 850;
}

.location-status {
  margin-top: 0.9rem;
  color: rgba(255, 255, 255, 0.64);
  font-size: 0.9rem;
  line-height: 1.5;
}

.walk-mode-card {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.walk-map-wrap {
  position: relative;
  overflow: hidden;
  min-height: 620px;
  border: 1px solid rgba(255, 138, 0, 0.25);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.045);
}

.walk-map {
  width: 100%;
  height: 620px;
  z-index: 1;
}

.walk-map-panel {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  z-index: 500;
  padding: 1rem;
  border: 1px solid rgba(255, 138, 0, 0.22);
  border-radius: 24px;
  background: rgba(10, 10, 10, 0.88);
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.34);
}

.panel-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.walk-map-panel span {
  display: block;
  margin-bottom: 0.35rem;
  color: #ffad4d;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.walk-map-panel strong {
  color: #fff;
  font-size: 1.05rem;
}

.walk-map-panel p {
  margin: 0.55rem 0 0;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.6;
  font-size: 0.92rem;
}

.panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 0.9rem;
}

.near-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
  border: 1px solid rgba(34, 197, 94, 0.35);
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  color: #86efac;
  padding: 0.45rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 900;
}

.walk-audio {
  margin-top: 0rem;
}

.mini-audio-player {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem;
  border: 1px solid rgba(255, 138, 0, 0.18);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.055);
}

.mini-play-btn {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff8a00, #ea580c);
  color: #160800;
  cursor: pointer;
}

.mini-audio-main {
  flex: 1;
  min-width: 0;
}

.mini-audio-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
}

.mini-audio-top span {
  margin: 0;
  color: #ffad4d;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.mini-audio-top strong {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.78rem;
  font-weight: 800;
  white-space: nowrap;
}

.mini-audio-range {
  width: 100%;
  height: 4px;
  accent-color: #ff8a00;
  cursor: pointer;
}

.walk-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.walk-actions .primary-btn,
.walk-actions .secondary-btn {
  margin-top: 0;
}

.state-section {
  display: grid;
  place-items: center;
  min-height: 70vh;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.72);
  font-weight: 800;
}

.state-section.error {
  color: #fecaca;
}

.completion-dialog {
  position: relative;
  overflow: hidden;
  padding: 2rem;
  border: 1px solid rgba(255, 138, 0, 0.28);
  border-radius: 30px;
  background:
    radial-gradient(circle at top, rgba(255, 138, 0, 0.22), transparent 18rem),
    rgba(10, 10, 10, 0.96);
  color: #fff;
  text-align: center;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.55);
}

.completion-icon {
  display: grid;
  place-items: center;
  width: 82px;
  height: 82px;
  margin: 0 auto 1rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff8a00, #ea580c);
  color: #160800;
  box-shadow: 0 0 40px rgba(255, 138, 0, 0.34);
}

.completion-kicker {
  margin: 0 0 0.5rem;
  color: #ffad4d;
  font-size: 0.75rem;
  font-weight: 950;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.completion-dialog h2 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.7rem);
  line-height: 1;
  letter-spacing: -0.045em;
}

.completion-text {
  max-width: 390px;
  margin: 1rem auto 0;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.7;
}

.completion-dialog-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 1.2rem;
  padding: 0.7rem 0.95rem;
  border: 1px solid rgba(34, 197, 94, 0.32);
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  color: #86efac;
  font-weight: 900;
}

.dialog-btn {
  margin-top: 1.4rem;
}

.confetti-wrap {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  top: -20px;
  width: 8px;
  height: 14px;
  border-radius: 3px;
  background: #ff8a00;
  animation: confetti-fall 1.8s ease-in-out infinite;
}

.confetti-piece:nth-child(2n) {
  background: #22c55e;
}

.confetti-piece:nth-child(3n) {
  background: #facc15;
}

.confetti-piece:nth-child(4n) {
  background: #38bdf8;
}

.confetti-piece:nth-child(1) {
  left: 8%;
  animation-delay: 0s;
}

.confetti-piece:nth-child(2) {
  left: 14%;
  animation-delay: 0.15s;
}

.confetti-piece:nth-child(3) {
  left: 21%;
  animation-delay: 0.3s;
}

.confetti-piece:nth-child(4) {
  left: 28%;
  animation-delay: 0.05s;
}

.confetti-piece:nth-child(5) {
  left: 35%;
  animation-delay: 0.25s;
}

.confetti-piece:nth-child(6) {
  left: 42%;
  animation-delay: 0.4s;
}

.confetti-piece:nth-child(7) {
  left: 49%;
  animation-delay: 0.1s;
}

.confetti-piece:nth-child(8) {
  left: 56%;
  animation-delay: 0.28s;
}

.confetti-piece:nth-child(9) {
  left: 63%;
  animation-delay: 0.12s;
}

.confetti-piece:nth-child(10) {
  left: 70%;
  animation-delay: 0.33s;
}

.confetti-piece:nth-child(11) {
  left: 77%;
  animation-delay: 0.18s;
}

.confetti-piece:nth-child(12) {
  left: 84%;
  animation-delay: 0.38s;
}

.confetti-piece:nth-child(13) {
  left: 91%;
  animation-delay: 0.08s;
}

.confetti-piece:nth-child(14) {
  left: 18%;
  animation-delay: 0.5s;
}

.confetti-piece:nth-child(15) {
  left: 32%;
  animation-delay: 0.45s;
}

.confetti-piece:nth-child(16) {
  left: 66%;
  animation-delay: 0.52s;
}

.confetti-piece:nth-child(17) {
  left: 74%;
  animation-delay: 0.48s;
}

.confetti-piece:nth-child(18) {
  left: 88%;
  animation-delay: 0.58s;
}

.route-btn {
  width: 100%;
  margin-top: 1rem;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }

  15% {
    opacity: 1;
  }

  100% {
    transform: translateY(430px) rotate(260deg);
    opacity: 0;
  }
}

:deep(.tour-marker) {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 2px solid rgba(255, 138, 0, 0.85);
  border-radius: 999px;
  background: rgba(18, 18, 18, 0.95);
  color: #ffad4d;
  font-size: 0.9rem;
  font-weight: 950;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

:deep(.tour-marker.active) {
  background: linear-gradient(135deg, #ff8a00, #ea580c);
  color: #160800;
  transform: scale(1.18);
  box-shadow:
    0 0 0 8px rgba(255, 138, 0, 0.16),
    0 16px 38px rgba(255, 138, 0, 0.35);
}

:deep(.user-location-marker) {
  position: relative;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.22);
  box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.12);
}

:deep(.user-location-marker span) {
  width: 14px;
  height: 14px;
  border: 3px solid #fff;
  border-radius: 999px;
  background: #3b82f6;
}

:deep(.leaflet-popup) {
  width: 520px !important;
  max-width: 520px !important;
}

:deep(.leaflet-popup-content-wrapper) {
  width: 100% !important;
  max-width: 100% !important;
  border: 1px solid rgba(255, 138, 0, 0.25);
  border-radius: 22px;
  background: rgba(12, 12, 12, 0.94);
  color: #fff;
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.48);
}

:deep(.leaflet-popup-content) {
  width: 100% !important;
  min-width: 0;
  margin: 0;
}

:deep(.leaflet-popup-tip) {
  background: rgba(12, 12, 12, 0.94);
}

:deep(.leaflet-popup-close-button) {
  top: 8px;
  right: 8px;
  color: #ffad4d !important;
  font-size: 22px;
}

:deep(.tour-stop-popup) {
  width: 100%;
  padding: 18px;
}

:deep(.popup-head) {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-right: 18px;
}

:deep(.popup-head span) {
  display: block;
  margin-bottom: 6px;
  color: #ffad4d;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

:deep(.popup-head strong) {
  display: block;
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.2;
}

:deep(.leaflet-near-badge) {
  flex: 0 0 auto;
  border: 1px solid rgba(34, 197, 94, 0.34);
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  padding: 6px 9px;
  color: #86efac;
  font-size: 0.72rem;
  font-weight: 900;
  white-space: nowrap;
}

:deep(.tour-stop-popup p) {
  display: -webkit-box;
  margin: 10px 0 0;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.9rem;
  line-height: 1.5;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

:deep(.popup-actions) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 14px;
}

:deep(.popup-actions button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 44px;
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 0.82rem;
  font-weight: 950;
  white-space: nowrap;
  cursor: pointer;
}

:deep(.popup-actions button:first-child) {
  border: 0;
  background: linear-gradient(135deg, #ff8a00, #ea580c);
  color: #160800;
}

:deep(.popup-actions button:last-child) {
  border: 1px solid rgba(255, 138, 0, 0.35);
  background: rgba(255, 138, 0, 0.1);
  color: #ffad4d;
}

:deep(.leaflet-control-zoom a) {
  background: rgba(18, 18, 18, 0.92);
  color: #ffad4d;
  border-color: rgba(255, 138, 0, 0.2);
}

:deep(.leaflet-control-attribution) {
  display: none;
}

:deep(.leaflet-top.leaflet-left) {
  left: auto;
  right: 16px;
}

:deep(.leaflet-control-zoom) {
  margin-top: 16px;
  margin-right: 0;
}

@media (max-width: 1180px) {
  .tour-body {
    grid-template-columns: 1fr;
  }

  .start-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .tour-hero {
    min-height: 620px;
    padding: 74px 0 15px;
  }

  .content-wrap {
    padding-inline: 20px;
  }

  .eyebrow {
    font-size: 1.3rem;
    letter-spacing: 0.14em;
  }

  .hero-content h1 {
    max-width: 100%;
    font-size: clamp(2.45rem, 12vw, 3.7rem);
    line-height: 0.98;
  }

  .hero-content p:not(.eyebrow) {
    max-width: 100%;
    font-size: 1rem;
    line-height: 1.65;
  }

  .hero-meta {
    gap: 10px;
  }

  .hero-meta span {
    width: 100%;
    border-radius: 18px;
  }

  .tour-body-section {
    padding: 0 0 64px;
  }

  .tour-body.walk-active {
    display: flex;
    flex-direction: column;
  }

  .tour-body.walk-active .side-column {
    order: -1;
  }

  .tour-body.walk-active .story-card {
    display: none;
  }

  .glass-card {
    border-radius: 26px;
    padding: 20px;
  }

  .start-card {
    padding: 18px;
  }

  .start-card h2 {
    font-size: 1.75rem;
  }

  .start-card p {
    font-size: 0.95rem;
    line-height: 1.65;
  }

  .start-icon {
    width: 52px;
    height: 52px;
    border-radius: 18px;
  }

  .section-header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .progress-pill {
    margin-left: auto;
    width: fit-content;
  }

  .route-stop {
    grid-template-columns: auto 1fr;
    gap: 14px;
    border-radius: 22px;
    padding: 14px;
  }

  .stop-number {
    width: 48px;
    height: 48px;
  }

  .route-line {
    left: 24px;
  }

  .start-card .primary-btn,
  .start-card .secondary-btn,
  .reset-btn {
    min-height: 46px;
  }

  .panel-top {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .stops-card {
    padding: 12px;
  }

  .walk-mode-card {
    gap: 0.75rem;
  }

  .walk-map-wrap {
    min-height: 610px;
    border-radius: 24px;
  }

  .walk-map {
    height: 610px;
  }

  .walk-map-panel {
    left: 0.65rem;
    right: 0.65rem;
    bottom: 0.65rem;
    padding: 0.7rem;
    border-radius: 20px;
  }

  .desktop-panel-info {
    display: none;
  }

  .walk-audio {
    margin-top: 0;
  }

  .mini-audio-player {
    padding: 0.58rem;
    border-radius: 16px;
  }

  .mini-play-btn {
    width: 34px;
    height: 34px;
  }

  .mini-audio-top {
    flex-direction: row;
    align-items: center;
    gap: 0.4rem;
  }

  .mini-audio-top span {
    font-size: 0.58rem;
  }

  .mini-audio-top strong {
    font-size: 0.68rem;
  }

  .mini-audio-range {
    height: 3px;
  }

  .walk-actions {
    position: sticky;
    bottom: 0.7rem;
    z-index: 900;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.55rem;
    padding: 0.55rem;
    border: 1px solid rgba(255, 138, 0, 0.18);
    border-radius: 22px;
    background: rgba(8, 8, 8, 0.88);
    backdrop-filter: blur(18px);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
  }

  .walk-actions .secondary-btn,
  .walk-actions .primary-btn {
    min-height: 40px;
    margin-top: 0;
    padding: 0.58rem 0.65rem;
    font-size: 0.82rem;
    line-height: 1;
  }

  :deep(.leaflet-popup) {
    width: 280px !important;
    max-width: calc(100vw - 48px) !important;
  }

  :deep(.leaflet-popup-content-wrapper) {
    width: 100% !important;
    max-width: 100% !important;
  }

  :deep(.leaflet-popup-content) {
    width: 100% !important;
  }

  :deep(.tour-stop-popup) {
    width: 100%;
    padding: 14px;
  }

  :deep(.popup-head strong) {
    font-size: 0.98rem;
  }

  :deep(.tour-stop-popup p) {
    font-size: 0.82rem;
    line-height: 1.4;
    -webkit-line-clamp: 3;
  }

  :deep(.popup-actions) {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  :deep(.popup-actions button) {
    width: 100%;
    min-height: 42px;
    padding: 9px 12px;
    font-size: 0.86rem;
    white-space: nowrap;
  }

  :deep(.leaflet-top.leaflet-left) {
    right: 12px;
  }

  :deep(.leaflet-control-zoom) {
    margin-top: 12px;
  }
}

@media (max-width: 420px) {
  .content-wrap {
    padding-inline: 16px;
  }

  .tour-hero {
    min-height: 560px;
    padding: 58px 0 42px;
  }

  .hero-content h1 {
    font-size: clamp(2.25rem, 13vw, 3rem);
  }

  .tour-body-section {
    padding-bottom: 56px;
  }

  .glass-card {
    padding: 18px;
  }

  .tour-body.walk-active .stops-card {
    padding: 10px;
  }

  .start-card {
    padding: 18px;
  }

  .start-card h2 {
    font-size: 1.55rem;
  }

  .start-card p {
    font-size: 0.9rem;
  }

  .start-icon {
    width: 50px;
    height: 50px;
  }

  .route-stop {
    gap: 12px;
    padding: 13px;
  }

  .stop-number {
    width: 44px;
    height: 44px;
    font-size: 0.94rem;
  }

  .route-line {
    left: 22px;
  }

  .stop-content h3 {
    font-size: 0.98rem;
  }

  .stop-content p {
    font-size: 0.84rem;
  }

  .walk-map-wrap {
    min-height: 590px;
  }

  .walk-map {
    height: 590px;
  }

  .walk-actions {
    bottom: 0.55rem;
    padding: 0.5rem;
  }

  .walk-actions .secondary-btn,
  .walk-actions .primary-btn {
    min-height: 38px;
    padding: 0.52rem 0.55rem;
    font-size: 0.78rem;
  }
}

.route-btn {
  width: 100%;
  margin-top: 1rem;
}

.route-stop.visited {
  border-color: rgba(255, 138, 0, 0.52);
  background:
    linear-gradient(135deg, rgba(255, 138, 0, 0.22), rgba(234, 88, 12, 0.12)),
    rgba(255, 255, 255, 0.06);
}

.route-stop.visited .stop-number {
  box-shadow:
    0 0 0 8px rgba(255, 138, 0, 0.16),
    0 12px 30px rgba(255, 138, 0, 0.24);
}
</style>
