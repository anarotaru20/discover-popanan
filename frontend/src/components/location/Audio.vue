<template>
  <section class="audio-section">
    <div class="section-header">
      <p class="eyebrow">Audio tour</p>
      <h2>Ascultă povestea locului</h2>
      <p class="section-description">
        Redă manual narațiunea audio pentru acest punct de pe traseu.
      </p>
    </div>

    <v-card class="audio-card" rounded="xl">
      <v-card-text>
        <div class="audio-content">
          <v-btn
            icon
            size="x-large"
            color="orange"
            class="play-button"
            @click="toggleAudio"
          >
            <v-icon size="34">
              {{ isPlaying ? 'mdi-pause' : 'mdi-play' }}
            </v-icon>
          </v-btn>

          <div class="audio-info">
            <p class="audio-label">Poveste audio</p>
            <h3>{{ title }}</h3>

            <div class="progress-row">
              <span>{{ formatTime(currentTime) }}</span>

              <input
                v-model="currentTime"
                type="range"
                min="0"
                :max="duration || 0"
                step="0.1"
                class="progress-input"
                @input="seekAudio"
              />

              <span>{{ formatTime(duration) }}</span>
            </div>
          </div>
        </div>

        <audio
          ref="audioRef"
          :src="audioUrl"
          preload="metadata"
          @loadedmetadata="setDuration"
          @timeupdate="updateTime"
          @ended="onEnded"
        />
      </v-card-text>
    </v-card>
  </section>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  audioUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Poveste audio',
  },
})

const audioRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)

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
</script>

<style scoped>
.audio-section {
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

.audio-card {
  background:
    radial-gradient(circle at top left, rgba(255, 138, 0, 0.16), transparent 36%),
    rgba(24, 24, 24, 0.94);
  border: 1px solid rgba(255, 138, 0, 0.2);
}

.audio-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.play-button {
  flex: 0 0 auto;
}

.audio-info {
  flex: 1;
  min-width: 0;
}

.audio-label {
  color: #ff8a00;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.72rem;
  font-weight: 800;
  margin-bottom: 6px;
}

.audio-info h3 {
  color: #f5f5f5;
  margin-bottom: 18px;
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

@media (max-width: 700px) {
  .audio-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .play-button {
    align-self: center;
  }

  .audio-info {
    width: 100%;
  }
}
</style>