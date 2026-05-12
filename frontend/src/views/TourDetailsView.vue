<template>
  <main class="tour-details-page">
    <section v-if="loading" class="state-section">Se încarcă turul...</section>

    <section v-else-if="error" class="state-section error">
      {{ error }}
    </section>

    <template v-else-if="selectedTour">
      <section class="tour-hero">
        <img :src="selectedTour.coverImage" :alt="selectedTour.title" class="hero-image" />

        <div class="hero-overlay"></div>

        <div class="hero-content">
          <button class="back-btn" @click="goBack">
            <v-icon size="20">mdi-arrow-left</v-icon>
            Înapoi la tururi
          </button>

          <div class="hero-row">
            <div
              class="tour-chip"
              :style="{ borderColor: selectedTour.color, color: selectedTour.color }"
            >
              {{ selectedTour.theme }}
            </div>

            <div v-if="isTourCompleted" class="completed-badge">
              <v-icon size="18">mdi-check-decagram</v-icon>
              Tur finalizat
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
      </section>

      <section class="tour-body">
        <div class="main-column">
          <article class="glass-card story-card">
            <span class="section-kicker">Povestea turului</span>
            <h2>O plimbare prin straturi de memorie urbană</h2>
            <p>{{ selectedTour.description }}</p>

            <div v-if="tourIntroAudio" class="intro-audio">
              <div class="audio-card compact">
                <div class="audio-content">
                  <button class="play-button" type="button" @click="toggleIntroAudio">
                    <v-icon size="34">
                      {{ isIntroPlaying ? 'mdi-pause' : 'mdi-play' }}
                    </v-icon>
                  </button>

                  <div class="audio-info">
                    <p class="audio-label">Intro audio tur</p>
                    <h3>{{ selectedTour.title }}</h3>

                    <div class="progress-row">
                      <span>{{ formatTime(introCurrentTime) }}</span>

                      <input
                        v-model="introCurrentTime"
                        type="range"
                        min="0"
                        :max="introDuration || 0"
                        step="0.1"
                        class="progress-input"
                        @input="seekIntroAudio"
                      />

                      <span>{{ formatTime(introDuration) }}</span>
                    </div>
                  </div>
                </div>

                <audio
                  ref="introAudioRef"
                  :src="tourIntroAudio"
                  preload="metadata"
                  @loadedmetadata="setIntroDuration"
                  @timeupdate="updateIntroTime"
                  @ended="onIntroEnded"
                />
              </div>
            </div>
          </article>

          <article class="glass-card stops-card">
            <div class="section-header">
              <div>
                <span class="section-kicker">Opriri</span>
                <h2>Traseul tău</h2>
              </div>

              <div class="progress-pill">
                {{ completedStops }}/{{ selectedTour.stops.length }} parcurse
              </div>
            </div>

            <div class="progress-track">
              <div class="progress-fill" :style="{ width: progressWidth }"></div>
            </div>

            <div v-if="isTourCompleted" class="finished-card">
              <v-icon size="22">mdi-check-circle</v-icon>
              <span>Ai finalizat acest tur.</span>
            </div>

            <div v-if="!isWalkModeActive" class="stops-list">
              <button
                v-for="(stop, index) in selectedTour.stops"
                :key="getStopSlug(stop)"
                class="stop-item"
                :class="{ active: currentStopIndex === index, completed: index < completedStops }"
                @click="currentStopIndex = index"
              >
                <div class="stop-number">
                  {{ index + 1 }}
                </div>

                <div>
                  <h3>{{ getStopTitle(stop) }}</h3>
                  <p>Oprire {{ index + 1 }} din {{ selectedTour.stops.length }}</p>
                </div>

                <v-icon size="22">mdi-chevron-right</v-icon>
              </button>
            </div>

            <div v-else class="walk-mode-card">
              <div class="walk-map-wrap">
                <div ref="walkMapRef" class="walk-map"></div>

                <div class="walk-map-panel">
                  <div class="panel-top">
                    <div>
                      <span>Oprirea curentă</span>
                      <strong>{{ currentStopTitle }}</strong>
                    </div>

                    <div v-if="isNearCurrentStop" class="near-badge">
                      <v-icon size="16">mdi-crosshairs-gps</v-icon>
                      Ești aproape
                    </div>
                  </div>

                  <p v-if="currentStopStory">
                    {{ currentStopStory }}
                  </p>

                  <div class="panel-actions">
                    <button class="mini-primary-btn" @click="goToCurrentStop">
                      Află mai multe
                      <v-icon size="18">mdi-arrow-right</v-icon>
                    </button>

                    <button class="mini-secondary-btn" @click="locateUser">
                      Locația mea
                      <v-icon size="18">mdi-crosshairs-gps</v-icon>
                    </button>
                  </div>

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
                  <v-icon size="20">mdi-chevron-left</v-icon>
                  Înapoi
                </button>

                <button class="primary-btn" @click="goToNextStop">
                  {{ isLastStop ? 'Finalizează turul' : 'Următoarea oprire' }}
                  <v-icon size="20">
                    {{ isLastStop ? 'mdi-check' : 'mdi-chevron-right' }}
                  </v-icon>
                </button>

                <button class="ghost-btn" @click="isWalkModeActive = false">
                  Vezi lista opririlor
                  <v-icon size="20">mdi-format-list-bulleted</v-icon>
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

            <h2>Pornește turul</h2>

            <p>
              Urmează opririle în ordine și descoperă fiecare loc ca într-un mic documentar urban.
            </p>

            <button class="primary-btn" @click="startTour">
              {{ isWalkModeActive ? 'Tur pornit' : 'Începe turul' }}
              <v-icon size="20">
                {{ isWalkModeActive ? 'mdi-check' : 'mdi-play' }}
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

            <div v-if="isTourCompleted" class="completion-box">
              <v-icon size="20">mdi-check-decagram</v-icon>
              Tur finalizat și salvat.
            </div>

            <button v-if="isTourCompleted" class="ghost-btn reset-btn" @click="resetTourCompletion">
              Resetează turul
              <v-icon size="20">mdi-refresh</v-icon>
            </button>

            <div v-if="locationStatus" class="location-status">
              {{ locationStatus }}
            </div>
          </article>
        </aside>
      </section>

      <v-dialog v-model="showCompletionDialog" max-width="520">
        <div class="completion-dialog">
          <div class="confetti-wrap">
            <span v-for="piece in 18" :key="piece" class="confetti-piece"></span>
          </div>

          <div class="completion-icon">
            <v-icon size="44">mdi-check-decagram</v-icon>
          </div>

          <p class="completion-kicker">Tur finalizat</p>

          <h2>Ai parcurs traseul complet!</h2>

          <p class="completion-text">
            Felicitări! Ai descoperit toate opririle acestui tur și progresul a fost salvat.
          </p>

          <div class="completion-dialog-badge">
            <v-icon size="18">mdi-trophy-award</v-icon>
            Badge câștigat: Explorator Popa Nan
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

const introAudioRef = ref(null)
const isIntroPlaying = ref(false)
const introCurrentTime = ref(0)
const introDuration = ref(0)

const walkMapRef = ref(null)
const walkMap = ref(null)
const walkMarkers = ref([])
const walkPolyline = ref(null)
const userMarker = ref(null)
const userPosition = ref(null)
const locationStatus = ref('')

const tourSlug = computed(() => {
  return selectedTour.value?.slug || route.params.slug
})

const tourStorageKey = computed(() => {
  return tourSlug.value ? `discover-popanan-tour-${tourSlug.value}` : null
})

const progressWidth = computed(() => {
  const total = selectedTour.value?.stops?.length || 0
  if (!total) return '0%'
  return `${Math.round((completedStops.value / total) * 100)}%`
})

const tourIntroAudio = computed(() => {
  return (
    selectedTour.value?.introAudio ||
    selectedTour.value?.audioIntro ||
    selectedTour.value?.audio ||
    null
  )
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

const currentStopAudio = computed(() => {
  return currentStopLocation.value?.stopAudio || null
})

const currentStopLocation = computed(() => {
  return tourStops.value[currentStopIndex.value] || null
})

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

const getLocationCoords = (location) => {
  if (!location) return null

  if (location.lat !== undefined && location.lng !== undefined) {
    return [Number(location.lat), Number(location.lng)]
  }

  if (location.latitude !== undefined && location.longitude !== undefined) {
    return [Number(location.latitude), Number(location.longitude)]
  }

  if (location.coordinates?.lat !== undefined && location.coordinates?.lng !== undefined) {
    return [Number(location.coordinates.lat), Number(location.coordinates.lng)]
  }

  if (Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
    return [Number(location.coordinates[0]), Number(location.coordinates[1])]
  }

  if (location.position?.lat !== undefined && location.position?.lng !== undefined) {
    return [Number(location.position.lat), Number(location.position.lng)]
  }

  return null
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

const clearWalkMapLayers = () => {
  walkMarkers.value.forEach((marker) => marker.remove())
  walkMarkers.value = []

  if (walkPolyline.value) {
    walkPolyline.value.remove()
    walkPolyline.value = null
  }
}

const renderWalkMap = async () => {
  if (!isWalkModeActive.value) return

  await nextTick()

  if (!walkMapRef.value) return

  const points = tourStops.value.map((location) => getLocationCoords(location)).filter(Boolean)

  if (!points.length) return

  if (!walkMap.value) {
    walkMap.value = L.map(walkMapRef.value, {
      zoomControl: true,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 20,
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

  tourStops.value.forEach((location, index) => {
    const coords = getLocationCoords(location)
    if (!coords) return

    const marker = L.marker(coords, {
      icon: createMarkerIcon(index, index === currentStopIndex.value),
    }).addTo(walkMap.value).bindPopup(`
        <strong>${location.title}</strong>
        ${location.shortDescription ? `<p>${location.shortDescription}</p>` : ''}
      `)

    marker.on('click', () => {
      currentStopIndex.value = index
    })

    walkMarkers.value.push(marker)
  })

  if (points.length === 1) {
    walkMap.value.setView(points[0], 17)
  } else {
    const bounds = L.latLngBounds(points)

    // walkMap.value.fitBounds(bounds, {
    //   padding: [42, 42],
    //   maxZoom: 17
    // })
    walkMap.value.fitBounds(bounds, {
      paddingTopLeft: [42, 42],
      paddingBottomRight: [42, window.innerWidth <= 640 ? 300 : 160],
      maxZoom: 17,
    })
  }

  renderUserMarker()

  focusCurrentStopOnMap()

  setTimeout(() => {
    walkMap.value?.invalidateSize()
  }, 250)
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

// const focusCurrentStopOnMap = () => {
//   if (!walkMap.value || !isWalkModeActive.value) return

//   const location = tourStops.value[currentStopIndex.value]
//   const coords = getLocationCoords(location)

//   if (!coords) return

//   walkMap.value.flyTo(coords, 17, {
//     duration: 0.8
//   })
// }

const focusCurrentStopOnMap = () => {
  if (!walkMap.value || !isWalkModeActive.value) return

  const location = tourStops.value[currentStopIndex.value]
  const coords = getLocationCoords(location)

  if (!coords) return

  const isMobile = window.innerWidth <= 640
  const zoom = 17

  walkMap.value.flyTo(coords, zoom, {
    duration: 0.75
  })

  setTimeout(() => {
    if (!walkMap.value) return

    const panelOffset = isMobile ? 210 : 120

    walkMap.value.panBy([0, panelOffset], {
      animate: true,
      duration: 0.35
    })
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

  if (isIntroPlaying.value && introAudioRef.value) {
    introAudioRef.value.pause()
    isIntroPlaying.value = false
  }

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

const toggleIntroAudio = async () => {
  if (!introAudioRef.value) return

  if (isPlaying.value && audioRef.value) {
    audioRef.value.pause()
    isPlaying.value = false
  }

  if (isIntroPlaying.value) {
    introAudioRef.value.pause()
    isIntroPlaying.value = false
    return
  }

  await introAudioRef.value.play()
  isIntroPlaying.value = true
}

const setIntroDuration = () => {
  introDuration.value = introAudioRef.value?.duration || 0
}

const updateIntroTime = () => {
  introCurrentTime.value = introAudioRef.value?.currentTime || 0
}

const seekIntroAudio = () => {
  if (!introAudioRef.value) return
  introAudioRef.value.currentTime = introCurrentTime.value
}

const onIntroEnded = () => {
  isIntroPlaying.value = false
  introCurrentTime.value = 0
}

const formatTime = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return '0:00'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const startTour = async () => {
  isWalkModeActive.value = true
  currentStopIndex.value = 0
  completedStops.value = Math.max(completedStops.value, 1)

  await nextTick()
  renderWalkMap()
}

const completeTour = () => {
  const total = selectedTour.value?.stops?.length || 0

  completedStops.value = total
  isTourCompleted.value = true
  showCompletionDialog.value = true

  if (tourStorageKey.value) {
    localStorage.setItem(
      tourStorageKey.value,
      JSON.stringify({
        completed: true,
        completedAt: new Date().toISOString(),
        badge: 'Explorator Popa Nan',
      }),
    )
  }
}

const resetTourCompletion = () => {
  isTourCompleted.value = false
  completedStops.value = 0
  currentStopIndex.value = 0
  showCompletionDialog.value = false

  if (tourStorageKey.value) {
    localStorage.removeItem(tourStorageKey.value)
  }
}

const loadTourCompletion = () => {
  if (!tourStorageKey.value) return

  const storedValue = localStorage.getItem(tourStorageKey.value)

  if (!storedValue) {
    isTourCompleted.value = false
    return
  }

  try {
    const parsedValue = JSON.parse(storedValue)
    isTourCompleted.value = Boolean(parsedValue.completed)

    if (isTourCompleted.value) {
      completedStops.value = selectedTour.value?.stops?.length || 0
    }
  } catch {
    isTourCompleted.value = false
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
  }
}

const goToNextStop = () => {
  const total = selectedTour.value?.stops?.length || 0

  if (currentStopIndex.value < total - 1) {
    currentStopIndex.value += 1
    return
  }

  completeTour()
}

const goBack = () => {
  router.push('/tours')
}

watch(currentStopIndex, (value) => {
  completedStops.value = Math.max(completedStops.value, value + 1)
  isPlaying.value = false
  currentTime.value = 0

  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }

  renderWalkMap()
  focusCurrentStopOnMap()
})

watch(isWalkModeActive, async (active) => {
  if (active) {
    await nextTick()
    renderWalkMap()
  }
})

watch(tourStops, () => {
  renderWalkMap()
})

watch(selectedTour, () => {
  loadTourCompletion()
})

onMounted(async () => {
  await toursStore.fetchTourBySlug(route.params.slug)

  if (!locations.value.length) {
    await locationsStore.fetchLocations()
  }

  loadTourCompletion()
})

onBeforeUnmount(() => {
  clearWalkMapLayers()

  if (userMarker.value) {
    userMarker.value.remove()
    userMarker.value = null
  }

  if (walkMap.value) {
    walkMap.value.remove()
    walkMap.value = null
  }
})
</script>

<style scoped>
.tour-details-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255, 138, 0, 0.16), transparent 34rem),
    radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.12), transparent 30rem), #080808;
  color: #fff;
}

.tour-hero {
  position: relative;
  min-height: 680px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  padding: 8rem 7vw 5rem;
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
    linear-gradient(to bottom, rgba(8, 8, 8, 0.1), rgba(8, 8, 8, 0.96)),
    radial-gradient(circle at top right, rgba(255, 138, 0, 0.24), transparent 42rem);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 940px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  color: rgba(255, 255, 255, 0.82);
  padding: 0.75rem 1rem;
  font-weight: 800;
  backdrop-filter: blur(14px);
  cursor: pointer;
}

.hero-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.tour-chip,
.section-kicker {
  display: inline-flex;
  width: fit-content;
  margin-bottom: 1rem;
  padding: 0.45rem 0.85rem;
  border: 1px solid rgba(255, 138, 0, 0.35);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.5);
  color: #ffad4d;
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.completed-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 1rem;
  padding: 0.45rem 0.85rem;
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
  font-size: clamp(3rem, 8vw, 7rem);
  line-height: 0.88;
  letter-spacing: -0.075em;
}

.hero-content p {
  max-width: 720px;
  margin: 1.4rem 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: clamp(1rem, 2vw, 1.25rem);
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
  padding: 0.7rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  color: rgba(255, 255, 255, 0.84);
  font-weight: 800;
  backdrop-filter: blur(14px);
}

.tour-body {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.6fr);
  gap: 1.5rem;
  padding: 0 7vw 6rem;
  margin-top: -2rem;
  position: relative;
  z-index: 3;
}

.main-column,
.side-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.glass-card {
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(22px);
  padding: 1.5rem;
}

.story-card h2,
.stops-card h2,
.start-card h2 {
  margin: 0;
  font-size: clamp(1.6rem, 3vw, 2.7rem);
  line-height: 1;
  letter-spacing: -0.045em;
}

.story-card p,
.start-card p {
  margin: 1rem 0 0;
  color: rgba(255, 255, 255, 0.68);
  font-size: 1rem;
  line-height: 1.85;
}

.section-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.progress-pill {
  white-space: nowrap;
  border-radius: 999px;
  background: rgba(255, 138, 0, 0.14);
  color: #ffad4d;
  padding: 0.65rem 0.85rem;
  font-weight: 900;
}

.progress-track {
  height: 10px;
  overflow: hidden;
  margin: 1.4rem 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff8a00, #ea580c);
  transition: width 0.3s ease;
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

.stops-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.stop-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.045);
  color: #fff;
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  transition: 0.25s ease;
}

.stop-item:hover,
.stop-item.active {
  border-color: rgba(255, 138, 0, 0.45);
  background: rgba(255, 138, 0, 0.1);
}

.stop-item.completed .stop-number {
  background: linear-gradient(135deg, #ff8a00, #ea580c);
  color: #160800;
}

.stop-number {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.09);
  font-weight: 950;
}

.stop-item h3 {
  margin: 0;
  font-size: 1rem;
}

.stop-item p {
  margin: 0.25rem 0 0;
  color: rgba(255, 255, 255, 0.56);
  font-size: 0.9rem;
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

.intro-audio {
  margin-top: 1.2rem;
}

.audio-card {
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.audio-card.compact .audio-content {
  padding: 1rem;
}

.audio-content {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 1.2rem;
  border: 1px solid rgba(255, 138, 0, 0.2);
  border-radius: 24px;
  background:
    radial-gradient(circle at top left, rgba(255, 138, 0, 0.06), transparent 48%),
    linear-gradient(135deg, rgba(255, 138, 0, 0.025), rgba(255, 255, 255, 0.01)),
    rgba(18, 18, 18, 0.96);
}

.play-button {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border: 0;
  border-radius: 50%;
  background: #ff9800;
  color: #090909;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 14px 32px rgba(255, 138, 0, 0.25);
}

.play-button.small {
  width: 52px;
  height: 52px;
}

.audio-info {
  flex: 1;
  min-width: 0;
}

.audio-info .audio-label {
  margin-bottom: 6px;
  color: #ff9800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.72rem;
  font-weight: 800;
}

.audio-info h3 {
  margin-bottom: 18px;
  color: #f5f5f5;
  font-size: 1.1rem;
  font-weight: 850;
  line-height: 1.2;
}

.progress-row {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: 12px;
  color: rgba(245, 245, 245, 0.64);
  font-size: 0.9rem;
}

.progress-input {
  width: 100%;
  accent-color: #ff8a00;
  cursor: pointer;
}

.walk-audio {
  margin-top: 0.9rem;
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

.walk-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.walk-actions .primary-btn,
.walk-actions .secondary-btn {
  margin-top: 0;
}

.location-status {
  margin-top: 0.9rem;
  color: rgba(255, 255, 255, 0.64);
  font-size: 0.9rem;
  line-height: 1.5;
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

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 18px;
  background: rgba(18, 18, 18, 0.96);
  color: #fff;
  border: 1px solid rgba(255, 138, 0, 0.22);
}

:deep(.leaflet-popup-tip) {
  background: rgba(18, 18, 18, 0.96);
}

:deep(.leaflet-popup-content p) {
  margin: 0.35rem 0 0;
  color: rgba(255, 255, 255, 0.68);
}

:deep(.leaflet-control-zoom a) {
  background: rgba(18, 18, 18, 0.92);
  color: #ffad4d;
  border-color: rgba(255, 138, 0, 0.2);
}

@media (max-width: 980px) {
  .tour-body {
    grid-template-columns: 1fr;
  }

  .start-card {
    position: static;
  }
}

@media (max-width: 700px) {
  .audio-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .audio-info {
    width: 100%;
  }

  .play-button {
    align-self: center;
  }

  .walk-actions {
    grid-template-columns: 1fr;
  }

  .panel-top {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .walk-map-wrap {
    min-height: 620px;
  }

  .walk-map {
    height: 620px;
  }

  .walk-map-panel {
    left: 0.65rem;
    right: 0.65rem;
    bottom: 0.65rem;
    padding: 0.85rem;
    border-radius: 22px;
  }

  .walk-map-panel p {
    display: -webkit-box;
    overflow: hidden;
    margin-top: 0.45rem;
    font-size: 0.84rem;
    line-height: 1.45;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .panel-actions {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.55rem;
    margin-top: 0.75rem;
  }

  .mini-primary-btn,
  .mini-secondary-btn {
    width: 100%;
    padding: 0.7rem 0.85rem;
  }

  .walk-audio {
    margin-top: 0.65rem;
  }

  .mini-audio-player {
    padding: 0.65rem;
    border-radius: 16px;
  }

  .mini-play-btn {
    width: 36px;
    height: 36px;
  }

  .mini-audio-top {
    flex-direction: row;
    align-items: center;
    gap: 0.4rem;
  }

  .mini-audio-top span {
    font-size: 0.62rem;
  }

  .mini-audio-top strong {
    font-size: 0.72rem;
  }

  .mini-audio-range {
    height: 3px;
  }
}

@media (max-width: 640px) {
  .walk-actions {
    position: sticky;
    bottom: 0.75rem;
    z-index: 900;
    display: grid;
    grid-template-columns: 0.9fr 1.2fr;
    gap: 0.65rem;
    padding: 0.65rem;
    border: 1px solid rgba(255, 138, 0, 0.18);
    border-radius: 26px;
    background: rgba(8, 8, 8, 0.86);
    backdrop-filter: blur(18px);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
  }

  .walk-actions .ghost-btn {
    grid-column: 1 / -1;
    order: 3;
    padding: 0.72rem 1rem;
  }

  .walk-actions .secondary-btn {
    order: 1;
    margin-top: 0;
    padding: 0.8rem 1rem;
    
  }

  .walk-actions .primary-btn {
    order: 2;
    margin-top: 0;
    padding: 0.8rem 1rem;
  }
}
</style>
