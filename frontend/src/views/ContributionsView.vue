<template>
  <main class="contributions-page">
    <section class="hero-section">
      <div class="hero-glow hero-glow-one"></div>
      <div class="hero-glow hero-glow-two"></div>

      <v-container class="content-wrap">
        <div class="hero-content">
          <div class="eyebrow">Arhivă comunitară</div>

          <h1>Contribuții din comunitate</h1>

          <p style="text-align: justify">
            Un loc unde memoria străzii continuă prin poveștile oamenilor, fotografii vechi și
            fragmente de oraș păstrate de comunitate.
          </p>

          <div class="hero-actions">
            <v-btn
              color="orange"
              size="large"
              rounded="xl"
              @click="openFormDialog"
              style="margin-top: 25px"
            >
              Adaugă contribuție
            </v-btn>
          </div>
        </div>
      </v-container>
    </section>

    <section class="contributions-section">
      <v-container class="content-wrap">
        <div class="section-top">
          <div>
            <p class="eyebrow">Poveștile vizitatorilor</p>
          </div>

          <v-select
            v-model="selectedLocationId"
            :items="locationFilterItems"
            item-title="title"
            item-value="id"
            variant="solo-filled"
            density="comfortable"
            hide-details
            rounded="xl"
            bg-color="rgba(255, 152, 0, 0.12)"
            color="orange"
            class="location-filter"
            menu-icon="mdi-chevron-down"
          >
            <template #prepend-inner>
              <v-icon color="orange" size="20">mdi-filter-variant</v-icon>
            </template>
          </v-select>
        </div>

        <v-alert v-if="error" type="error" variant="tonal" class="mb-6">
          {{ error }}
        </v-alert>

        <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-6">
          {{ successMessage }}
        </v-alert>

        <section v-if="loading" class="state-section">
          <v-progress-circular indeterminate color="orange" size="48" />
          <p>Se încarcă toate contribuțiile...</p>
        </section>

        <section v-else-if="filteredContributions.length" class="blog-list">
          <article
            v-for="contribution in filteredContributions"
            :key="getContributionKey(contribution)"
            class="blog-card"
            role="button"
            tabindex="0"
            @click="openContributionDialog(contribution)"
            @keydown.enter="openContributionDialog(contribution)"
            @keydown.space.prevent="openContributionDialog(contribution)"
          >
            <div
              v-if="getImageUrl(contribution)"
              class="blog-image"
              :style="{ backgroundImage: `url(${getImageUrl(contribution)})` }"
            />

            <div class="blog-content">
              <p class="blog-location">
                {{ getLocationTitle(getContributionLocationId(contribution)) }}
              </p>

              <h3>{{ getTypeLabel(contribution.type) }}</h3>

              <p class="blog-message">
                {{ contribution.message || 'Contribuția nu are mesaj.' }}
              </p>

              <v-alert
                v-if="isFlagged(contribution) && getFlagReason(contribution)"
                type="warning"
                variant="tonal"
                density="comfortable"
                class="mt-5"
              >
                {{ getFlagReason(contribution) }}
              </v-alert>

              <div class="blog-footer">
                <div class="author-box">
                  <v-icon color="orange" size="20">mdi-account-circle-outline</v-icon>
                  <span>{{ contribution.name || 'Anonim' }}</span>
                </div>

                <div class="blog-links">
                  <a
                    v-if="getSourceUrl(contribution)"
                    :href="getSourceUrl(contribution)"
                    target="_blank"
                    rel="noopener noreferrer"
                    @click.stop
                  >
                    Vezi sursa
                  </a>

                  <button type="button" @click.stop="openContributionDialog(contribution)">
                    Vezi toată contribuția
                  </button>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section v-else class="empty-section">
          <v-icon color="orange" size="46">mdi-message-text-outline</v-icon>

          <h3>Încă nu există contribuții</h3>

          <p>
            Prima contribuție încă nu a fost adăugată. Poți trimite o amintire, o fotografie sau o
            sursă nouă.
          </p>

          <v-btn color="orange" rounded="xl" @click="openFormDialog"> Adaugă contribuție </v-btn>
        </section>
      </v-container>
    </section>

    <v-dialog
      v-model="contributionDialog"
      max-width="900"
      scrollable
      class="contribution-details-dialog"
      :fullscreen="$vuetify.display.smAndDown"
    >
      <v-card rounded="xl" class="dialog-card details-card">
        <v-card-title>
          <div>
            <p class="eyebrow">{{ getTypeLabel(selectedContribution?.type) }}</p>
          </div>

          <v-btn icon variant="text" @click="closeContributionDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text v-if="selectedContribution">
          <div class="details-grid">
            <div class="details-item details-item-full">
              <span>Obiectiv</span>
              <strong>
                {{ getLocationTitle(getContributionLocationId(selectedContribution)) }}
              </strong>
            </div>

            <div class="details-item">
              <span>Autor</span>
              <strong>{{ selectedContribution.name || 'Anonim' }}</strong>
            </div>

            <div class="details-item">
              <span>Data</span>
              <strong>
                {{ getCreatedDate(selectedContribution) || 'Data nu este disponibilă' }}
              </strong>
            </div>
          </div>

          <div class="details-message">
            <span>Mesaj</span>
            <p>{{ selectedContribution.message || 'Contribuția nu are mesaj.' }}</p>
          </div>

          <section v-if="currentGalleryImages.length" class="details-gallery">
            <div class="details-section-title">
              <span>Galerie foto</span>
            </div>

            <div class="details-gallery-grid">
              <button
                v-for="(image, index) in currentGalleryImages"
                :key="`${image}-${index}`"
                class="details-gallery-item"
                type="button"
                @click="openImage(index)"
              >
                <img :src="image" :alt="`Imagine contribuție ${index + 1}`" />
              </button>
            </div>
          </section>

          <v-alert
            v-if="isFlagged(selectedContribution) && getFlagReason(selectedContribution)"
            type="warning"
            variant="tonal"
            density="comfortable"
            class="mt-5"
          >
            {{ getFlagReason(selectedContribution) }}
          </v-alert>

          <div class="details-actions">
            <v-btn
              v-if="getSourceUrl(selectedContribution)"
              :href="getSourceUrl(selectedContribution)"
              target="_blank"
              rel="noopener noreferrer"
              color="orange"
              rounded="xl"
              variant="flat"
              style="font-weight: 800"
            >
              Vezi sursa
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="imageDialog" :fullscreen="$vuetify.display.smAndDown" max-width="980">
      <v-card class="image-dialog-card" rounded="xl">
        <v-card-title class="image-dialog-title">
          <p class="eyebrow-img">imagini</p>

          <v-btn icon variant="text" @click="closeImage">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="image-dialog-content">
          <div
            class="image-dialog-wrapper"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
          >
            <img
              v-if="currentImage"
              :src="currentImage"
              alt="Imagine galerie mărită"
              class="image-dialog-img"
            />
          </div>

          <div class="image-dialog-navigation">
            <v-btn icon variant="outlined" @click="prevImage">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>

            <span class="image-dialog-counter">
              {{ selectedImageIndex + 1 }} / {{ currentGalleryImages.length }}
            </span>

            <v-btn icon variant="outlined" @click="nextImage">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="formDialog"
      max-width="760"
      scrollable
      class="contribution-dialog"
      :fullscreen="$vuetify.display.smAndDown"
    >
      <v-card rounded="xl" class="dialog-card">
        <v-card-title>
          <div>
            <p class="eyebrow">Adaugă o contribuție</p>
          </div>

          <v-btn icon variant="text" @click="closeFormDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef" v-model="formValid" @submit.prevent="submitContribution">
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="form.name"
                  label="Nume"
                  variant="outlined"
                  :counter="40"
                  :rules="[rules.required, rules.minName]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model.number="form.locationId"
                  :items="locationItems"
                  item-title="title"
                  item-value="id"
                  label="Obiectiv"
                  variant="outlined"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="form.type"
                  :items="contributionTypes"
                  item-title="label"
                  item-value="value"
                  label="Tip contribuție"
                  variant="outlined"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field v-model="form.sourceUrl" label="Link sursă" variant="outlined" />
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="form.imageFiles"
                  label="Adaugă imagini"
                  variant="outlined"
                  accept="image/*"
                  multiple
                  prepend-icon=""
                  prepend-inner-icon="mdi-image-plus"
                  show-size
                  chips
                  counter
                  :rules="[rules.maxImages, rules.imageSize]"
                  @update:model-value="handleImageFilesChange"
                />
              </v-col>

              <v-col v-if="imagePreviews.length" cols="12">
                <div class="form-image-preview-grid">
                  <div
                    v-for="(image, index) in imagePreviews"
                    :key="`${image.name}-${index}`"
                    class="form-image-preview"
                  >
                    <img :src="image.url" :alt="image.name" />

                    <v-btn
                      icon
                      size="small"
                      color="red"
                      variant="flat"
                      class="remove-image-btn"
                      @click="removeSelectedImage(index)"
                    >
                      <v-icon size="18">mdi-close</v-icon>
                    </v-btn>

                    <span>{{ image.name }}</span>
                  </div>
                </div>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.message"
                  label="Mesaj"
                  variant="outlined"
                  rows="6"
                  :counter="400"
                  auto-grow
                  :rules="[rules.required, rules.minMessage]"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" rounded="xl" @click="closeFormDialog"> Renunță </v-btn>

          <v-btn color="orange" rounded="xl" :loading="submitting" @click="submitContribution">
            Trimite contribuția
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useLocationsStore } from '@/stores/locations'
import { useContributionsStore } from '@/stores/contributions'

const locationsStore = useLocationsStore()
const contributionsStore = useContributionsStore()

const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const successMessage = ref('')
const formDialog = ref(false)
const contributionDialog = ref(false)
const imageDialog = ref(false)
const selectedContribution = ref(null)
const selectedImageIndex = ref(0)
const touchStartX = ref(0)
const touchEndX = ref(0)
const formRef = ref(null)
const formValid = ref(false)
const selectedLocationId = ref('all')
const allContributions = ref([])
const imagePreviews = ref([])

const form = ref({
  name: '',
  locationId: null,
  type: null,
  message: '',
  sourceUrl: '',
  imageFiles: [],
})

const contributionTypes = [
  { label: 'Amintire personală', value: 'amintire_personala' },
  { label: 'Corecție', value: 'corectie' },
  { label: 'Sursă nouă', value: 'sursa_noua' },
  { label: 'Fotografie veche', value: 'fotografie_veche' },
  { label: 'Mesaj pentru viitor', value: 'mesaj_pentru_viitor' },
]

const rules = {
  required: (value) => !!value || 'Câmp obligatoriu',
  minName: (value) =>
    String(value || '').length >= 3 || 'Numele trebuie să aibă minim 3 caractere',
  minMessage: (value) =>
    String(value || '').length >= 10 || 'Mesajul trebuie să aibă minim 10 caractere',
  maxImages: (value) => {
    const files = Array.from(value || [])
    return files.length <= 3 || 'Poți adăuga maximum 3 imagini'
  },
  imageSize: (value) => {
    const files = Array.from(value || [])
    return (
      files.every((file) => file.size <= 2 * 1024 * 1024) ||
      'Fiecare imagine trebuie să aibă maximum 2MB'
    )
  },
}

const locations = computed(() => {
  return locationsStore.locations?.data || locationsStore.locations || []
})

const locationItems = computed(() => {
  return locations.value.map((location) => ({
    id: Number(location.id),
    title: location.title,
  }))
})

const locationFilterItems = computed(() => {
  return [{ id: 'all', title: 'Toate obiectivele' }, ...locationItems.value]
})

const filteredContributions = computed(() => {
  if (selectedLocationId.value === 'all') {
    return allContributions.value
  }

  return allContributions.value.filter((contribution) => {
    return String(getContributionLocationId(contribution)) === String(selectedLocationId.value)
  })
})

const currentGalleryImages = computed(() => {
  return selectedContribution.value ? getGalleryImages(selectedContribution.value) : []
})

const currentImage = computed(() => {
  return currentGalleryImages.value[selectedImageIndex.value]
})

const getContributionKey = (contribution) => {
  return (
    contribution.id ||
    contribution._id ||
    `${getContributionLocationId(contribution)}-${contribution.message}`
  )
}

const getContributionLocationId = (contribution) => {
  return contribution.location_id || contribution.locationId || contribution.locationID
}

const normalizeImages = (value) => {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  if (typeof value === 'string') {
    try {
      const parsedValue = JSON.parse(value)

      if (Array.isArray(parsedValue)) {
        return parsedValue.filter(Boolean)
      }
    } catch (err) {
      return [value].filter(Boolean)
    }

    return [value].filter(Boolean)
  }

  return []
}

const getImageUrl = (contribution) => {
  return getGalleryImages(contribution)[0]
}

const getGalleryImages = (contribution) => {
  const images = [
    ...normalizeImages(contribution?.image_url),
    ...normalizeImages(contribution?.imageUrl),
    ...normalizeImages(contribution?.image),
    ...normalizeImages(contribution?.gallery),
    ...normalizeImages(contribution?.images),
    ...normalizeImages(contribution?.image_urls),
    ...normalizeImages(contribution?.imageUrls),
  ]

  return [...new Set(images.filter(Boolean))]
}

const getSourceUrl = (contribution) => {
  return contribution?.source_url || contribution?.sourceUrl || contribution?.source
}

const getFlagReason = (contribution) => {
  return contribution?.flag_reason || contribution?.reason || contribution?.flagReason
}

const isFlagged = (contribution) => {
  return contribution?.is_flagged || contribution?.flagged
}

const isVerified = (contribution) => {
  return contribution?.is_verified || contribution?.verified
}

const getLocationTitle = (locationId) => {
  const location = locations.value.find((item) => String(item.id) === String(locationId))
  return location?.title || 'Obiectiv necunoscut'
}

const getTypeLabel = (type) => {
  const item = contributionTypes.find((contributionType) => contributionType.value === type)
  return item?.label || 'Contribuție'
}

const getCreatedDate = (contribution) => {
  const value = contribution?.created_at || contribution?.createdAt

  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

const clearImagePreviews = () => {
  imagePreviews.value.forEach((image) => {
    if (image.url?.startsWith('blob:')) {
      URL.revokeObjectURL(image.url)
    }
  })

  imagePreviews.value = []
}

const handleImageFilesChange = (files) => {
  clearImagePreviews()

  const selectedFiles = Array.from(files || []).slice(0, 3)
  form.value.imageFiles = selectedFiles

  imagePreviews.value = selectedFiles.map((file) => ({
    name: file.name,
    url: URL.createObjectURL(file),
  }))
}

const removeSelectedImage = (index) => {
  const files = [...form.value.imageFiles]
  files.splice(index, 1)
  form.value.imageFiles = files
  handleImageFilesChange(files)
}

const openContributionDialog = (contribution) => {
  selectedContribution.value = contribution
  selectedImageIndex.value = 0
  contributionDialog.value = true
}

const closeContributionDialog = () => {
  contributionDialog.value = false
  imageDialog.value = false
  selectedContribution.value = null
  selectedImageIndex.value = 0
}

const openImage = (index) => {
  selectedImageIndex.value = index
  imageDialog.value = true
}

const closeImage = () => {
  imageDialog.value = false
  selectedImageIndex.value = 0
}

const nextImage = () => {
  if (!currentGalleryImages.value.length) return

  selectedImageIndex.value =
    selectedImageIndex.value < currentGalleryImages.value.length - 1
      ? selectedImageIndex.value + 1
      : 0
}

const prevImage = () => {
  if (!currentGalleryImages.value.length) return

  selectedImageIndex.value =
    selectedImageIndex.value > 0
      ? selectedImageIndex.value - 1
      : currentGalleryImages.value.length - 1
}

const handleTouchStart = (event) => {
  touchStartX.value = event.changedTouches[0].screenX
}

const handleTouchEnd = (event) => {
  touchEndX.value = event.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeDistance = touchStartX.value - touchEndX.value
  const minSwipeDistance = 50

  if (Math.abs(swipeDistance) < minSwipeDistance) return

  if (swipeDistance > 0) {
    nextImage()
  } else {
    prevImage()
  }
}

const loadContributions = async () => {
  loading.value = true
  error.value = ''

  try {
    await locationsStore.fetchLocations()

    const loadedContributions = []

    for (const location of locations.value) {
      await contributionsStore.fetchContributions(Number(location.id))

      const items = Array.isArray(contributionsStore.contributions)
        ? contributionsStore.contributions
        : []

      loadedContributions.push(
        ...items.map((item) => ({
          ...item,
          location_id: getContributionLocationId(item) || Number(location.id),
        })),
      )
    }

    allContributions.value = loadedContributions.sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || 0)
      const dateB = new Date(b.created_at || b.createdAt || 0)

      return dateB - dateA
    })
  } catch (err) {
    error.value = 'Nu am putut încărca toate contribuțiile.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  clearImagePreviews()

  form.value = {
    name: '',
    locationId: null,
    type: null,
    message: '',
    sourceUrl: '',
    imageFiles: [],
  }

  formRef.value?.resetValidation()
}

const openFormDialog = () => {
  error.value = ''
  successMessage.value = ''
  formDialog.value = true
}

const closeFormDialog = () => {
  formDialog.value = false
  resetForm()
}

const submitContribution = async () => {
  const validation = await formRef.value?.validate()

  if (!validation?.valid) {
    return
  }

  submitting.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const payload = new FormData()

    payload.append('location_id', Number(form.value.locationId))
    payload.append('name', form.value.name)
    payload.append('type', form.value.type)
    payload.append('message', form.value.message)
    payload.append('source_url', form.value.sourceUrl || '')
    payload.append('is_flagged', 'false')

    form.value.imageFiles.forEach((file) => {
      payload.append('images', file)
    })

    await contributionsStore.addContribution(payload)

    if (contributionsStore.error) {
      error.value = contributionsStore.error
      return
    }

    successMessage.value = contributionsStore.successMessage || 'Contribuția a fost trimisă.'
    closeFormDialog()
    await loadContributions()
  } catch (err) {
    error.value = 'Nu am putut trimite contribuția.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadContributions()
})
</script>

<style scoped>
.contributions-page {
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

.hero-section {
  position: relative;
  overflow: hidden;
  padding: 100px 0 44px;
}

.hero-content {
  max-width: 850px;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  margin-bottom: 12px;
  color: #ff9800;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.eyebrow-img {
  color: #ff8a00;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.hero-content h1 {
  max-width: 860px;
  margin: 0 0 18px;
  color: #f5f5f5;
  font-size: clamp(2.4rem, 6vw, 5rem);
  line-height: 0.96;
  letter-spacing: -0.06em;
}

.hero-content p {
  max-width: 680px;
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.05rem;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 28px;
}

.hero-actions :deep(.v-btn) {
  font-weight: 800;
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

.contributions-section {
  position: relative;
  z-index: 2;
  padding: 24px 0 90px;
}

.section-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;
}

.location-filter {
  max-width: 360px;
  min-width: 290px;
}

.location-filter :deep(.v-field) {
  border: 1px solid rgba(255, 152, 0, 0.28);
  background:
    linear-gradient(135deg, rgba(255, 152, 0, 0.16), rgba(255, 255, 255, 0.055)),
    rgba(18, 18, 18, 0.78) !important;
  box-shadow:
    0 16px 45px rgba(0, 0, 0, 0.26),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
}

.location-filter :deep(.v-field:hover) {
  border-color: rgba(255, 152, 0, 0.48);
}

.location-filter :deep(.v-field--focused) {
  border-color: rgba(255, 152, 0, 0.78);
  box-shadow:
    0 18px 55px rgba(255, 152, 0, 0.13),
    0 0 0 3px rgba(255, 152, 0, 0.12);
}

.location-filter :deep(.v-label),
.location-filter :deep(.v-field__input),
.location-filter :deep(.v-select__selection-text),
.location-filter :deep(.v-icon) {
  color: rgba(245, 245, 245, 0.92);
}

.state-section,
.empty-section {
  display: grid;
  place-items: center;
  min-height: 320px;
  border: 1px solid rgba(255, 152, 0, 0.16);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.045);
  color: rgba(255, 255, 255, 0.72);
  text-align: center;
}

.state-section {
  gap: 14px;
}

.state-section p {
  margin: 0;
}

.empty-section {
  padding: 40px 20px;
  gap: 16px;
}

.empty-section h3 {
  margin: 0;
  color: #f5f5f5;
  font-size: 1.5rem;
}

.empty-section p {
  max-width: 560px;
  margin: 0;
  color: rgba(245, 245, 245, 0.72);
  line-height: 1.7;
}

.blog-list {
  display: grid;
  gap: 24px;
}

.blog-card {
  display: grid;
  grid-template-columns: minmax(260px, 360px) 1fr;
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

.blog-card:hover {
  border-color: rgba(255, 152, 0, 0.58);
  transform: translateY(-5px);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.48);
}

.blog-card:focus-visible {
  outline: 3px solid rgba(255, 152, 0, 0.62);
  outline-offset: 4px;
}

.blog-card:not(:has(.blog-image)) {
  grid-template-columns: 1fr;
}

.blog-image {
  min-height: 100%;
  background-size: cover;
  background-position: center;
}

.blog-content {
  min-width: 0;
  padding: 28px;
}

.blog-location {
  margin: 0 0 8px;
  color: #ffb74d;
  font-size: 0.85rem;
  font-weight: 800;
}

.blog-content h3 {
  margin: 0 0 18px;
  color: #f5f5f5;
  font-size: clamp(1.6rem, 3vw, 2.35rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.blog-message {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: rgba(245, 245, 245, 0.76);
  font-size: 1.02rem;
  line-height: 1.8;
  white-space: pre-line;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.blog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-width: 0;
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 152, 0, 0.14);
  color: rgba(245, 245, 245, 0.62);
}

.author-box {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-weight: 700;
}

.author-box span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.blog-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 14px;
  min-width: 0;
  max-width: 100%;
}

.blog-links a,
.blog-links button {
  max-width: 100%;
  border: 0;
  background: transparent;
  color: #ffb74d;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  overflow-wrap: anywhere;
  padding: 0;
  text-align: right;
  text-decoration: none;
  white-space: normal;
}

.blog-links a:hover,
.blog-links button:hover {
  text-decoration: underline;
}

.dialog-card,
.image-dialog-card {
  background: #181818;
  color: #f5f5f5;
}

.dialog-card :deep(.v-card-title) {
  display: flex;
  flex: 0 0 auto;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 28px 28px 10px;
}

.dialog-card h2 {
  margin: 0;
  color: #f5f5f5;
  font-size: clamp(1.7rem, 4vw, 2.4rem);
  line-height: 1.1;
}

.dialog-card :deep(.v-card-text) {
  padding: 18px 28px 28px;
}

.dialog-card :deep(.v-card-actions) {
  flex: 0 0 auto;
  padding: 0 28px 28px;
}

.dialog-card :deep(.v-field),
.dialog-card :deep(.v-input__control) {
  min-width: 0;
}

.form-image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
  gap: 14px;
}

.form-image-preview {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 152, 0, 0.18);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.045);
}

.form-image-preview img {
  display: block;
  width: 100%;
  aspect-ratio: 1 / 0.78;
  object-fit: cover;
}

.form-image-preview span {
  display: block;
  padding: 8px 10px 10px;
  color: rgba(245, 245, 245, 0.72);
  font-size: 0.78rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}

.details-card {
  max-height: min(86vh, 860px);
  overflow: hidden;
}

.details-card :deep(.v-card-text) {
  overflow-y: auto;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 22px;
}

.details-item-full {
  grid-column: 1 / -1;
}

.details-item,
.details-message,
.details-gallery {
  border: 1px solid rgba(255, 152, 0, 0.14);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.045);
  padding: 16px;
}

.details-item span,
.details-message span,
.details-section-title span {
  display: block;
  margin-bottom: 7px;
  color: #ffb74d;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.details-item strong {
  color: rgba(245, 245, 245, 0.9);
  font-size: 1rem;
}

.details-message p {
  margin: 0;
  color: rgba(245, 245, 245, 0.78);
  font-size: 1rem;
  line-height: 1.8;
  white-space: pre-line;
}

.details-gallery {
  margin-top: 18px;
}

.details-section-title {
  margin-bottom: 14px;
}

.details-section-title p {
  margin: 0;
  color: rgba(245, 245, 245, 0.65);
  font-size: 0.96rem;
  line-height: 1.5;
}

.details-gallery-grid {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 4px 14px;
  scroll-snap-type: x mandatory;
}

.details-gallery-grid::-webkit-scrollbar {
  height: 8px;
}

.details-gallery-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
}

.details-gallery-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 138, 0, 0.65);
  border-radius: 999px;
}

.details-gallery-item {
  height: 220px;
  min-width: 230px;
  flex: 0 0 230px;
  overflow: hidden;
  border: 1px solid rgba(255, 138, 0, 0.18);
  border-radius: 24px;
  background: rgba(24, 24, 24, 0.92);
  cursor: pointer;
  padding: 0;
  scroll-snap-align: start;
}

.details-gallery-item img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition:
    transform 0.25s ease,
    filter 0.25s ease;
}

.details-gallery-item:hover img {
  transform: scale(1.06);
  filter: brightness(1.08);
}

.details-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;
}

.image-dialog-card {
  background: rgba(24, 24, 24, 0.98);
  border: 1px solid rgba(255, 138, 0, 0.18);
  overflow: hidden;
}

.image-dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
}

.image-dialog-content {
  padding: 0 22px 22px;
}

.image-dialog-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-dialog-img {
  width: 100%;
  max-height: 72vh;
  object-fit: contain;
  border-radius: 18px;
  display: block;
  background: #111;
}

.image-dialog-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin-top: 20px;
}

.image-dialog-counter {
  min-width: 56px;
  text-align: center;
  color: rgba(245, 245, 245, 0.72);
  font-weight: 600;
}

@media (max-width: 1180px) {
  .section-top {
    align-items: flex-start;
    flex-direction: column;
  }

  .location-filter {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }
}

@media (max-width: 860px) {
  .blog-card {
    grid-template-columns: 1fr;
  }

  .blog-image {
    min-height: 240px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 74px 0 28px;
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

  .hero-content p {
    max-width: 100%;
    font-size: 1rem;
    line-height: 1.65;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
    margin-top: 24px;
  }

  .hero-actions :deep(.v-btn) {
    width: 100%;
    min-height: 48px;
  }

  .contributions-section {
    padding: 20px 0 64px;
  }

  .section-top {
    gap: 18px;
    margin-bottom: 24px;
  }

  .location-filter {
    width: 100%;
  }

  .blog-list {
    gap: 18px;
  }

  .blog-card {
    border-radius: 26px;
  }

  .blog-card:hover,
  .details-gallery-item:hover img {
    transform: none;
  }

  .blog-image {
    min-height: 220px;
  }

  .blog-content {
    padding: 22px;
  }

  .blog-content h3 {
    font-size: 1.45rem;
  }

  .blog-message {
    font-size: 0.98rem;
    line-height: 1.7;
  }

  .blog-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .blog-links {
    width: 100%;
    justify-content: flex-end;
  }

  .blog-links button {
    margin-left: auto;
  }

  .state-section,
  .empty-section {
    min-height: 260px;
    border-radius: 26px;
  }

  .dialog-card {
    min-height: 100vh;
    border-radius: 0 !important;
  }

  .details-card {
    max-height: 100vh;
  }

  .dialog-card :deep(.v-card-title) {
    align-items: flex-start;
    padding: 22px 18px 8px;
  }

  .dialog-card :deep(.v-card-text) {
    padding: 14px 18px 24px;
  }

  .dialog-card :deep(.v-card-actions) {
    align-items: stretch;
    flex-direction: column-reverse;
    padding: 0 18px 22px;
  }

  .dialog-card :deep(.v-card-actions .v-btn) {
    width: 100%;
    min-height: 48px;
  }

  .form-image-preview-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .details-actions {
    flex-direction: column;
  }

  .details-actions :deep(.v-btn) {
    width: 100%;
    min-height: 48px;
  }

  .image-dialog-card {
    height: 100dvh;
    border-radius: 0 !important;
  }

  .image-dialog-title {
    padding: 14px 16px;
    font-size: 1rem;
  }

  .image-dialog-content {
    height: calc(100dvh - 64px);
    padding: 0 14px 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .image-dialog-wrapper {
    flex: 1;
    min-height: 0;
  }

  .image-dialog-img {
    max-height: calc(100dvh - 160px);
    border-radius: 14px;
  }

  .image-dialog-navigation {
    margin-top: 16px;
    padding-bottom: max(6px, env(safe-area-inset-bottom));
  }
}

@media (max-width: 420px) {
  .content-wrap {
    padding-inline: 16px;
  }

  .hero-section {
    padding: 58px 0 24px;
  }

  .contributions-section {
    padding: 18px 0 56px;
  }

  .hero-content h1 {
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

  .blog-image {
    min-height: 205px;
  }

  .blog-content {
    padding: 18px;
  }

  .blog-content h3 {
    font-size: 1.34rem;
  }

  .blog-links {
    gap: 8px;
  }

  .form-image-preview-grid {
    grid-template-columns: 1fr;
  }

  .details-item,
  .details-message,
  .details-gallery {
    padding: 14px;
    border-radius: 18px;
  }

  .details-gallery-item {
    height: 200px;
    min-width: 210px;
    flex-basis: 210px;
    border-radius: 20px;
  }
}
</style>
