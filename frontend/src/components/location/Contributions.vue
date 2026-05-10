<template>
  <section class="contributions-section">
    <div class="section-top">
      <div class="section-header">
        <p class="eyebrow">Arhivă comunitară</p>
        <h2>Contribuții din comunitate</h2>
        <p class="section-description">
          Amintiri, corecții, surse și fotografii trimise de vizitatori. Aceste materiale sunt
          separate de povestea istorică oficială.
        </p>
      </div>

      <v-btn color="orange" rounded="xl" size="large" @click="openFormDialog">
        Adaugă contribuție
      </v-btn>
    </div>

    <v-alert v-if="contributionsStore.error" type="error" variant="tonal" class="mb-4">
      {{ contributionsStore.error }}
    </v-alert>

    <v-alert v-if="contributionsStore.successMessage" type="success" variant="tonal" class="mb-4">
      {{ contributionsStore.successMessage }}
    </v-alert>

    <div class="contributions-grid">
      <v-progress-circular
        v-if="contributionsStore.loading"
        indeterminate
        color="orange"
        class="my-6"
      />

      <p v-else-if="!contributionsStore.contributions.length" class="empty-message">
        Nu există contribuții încă. Poți adăuga prima amintire pentru acest loc.
      </p>

      <v-card
        v-for="item in contributionsStore.contributions"
        :key="item.id"
        class="contribution-card"
        rounded="xl"
      >
        <div
          v-if="item.image_url"
          class="contribution-image"
          :style="{ backgroundImage: `url(${item.image_url})` }"
        />

        <v-card-text>
          <div class="badges">
            <v-chip size="small" color="orange" variant="flat"> Trimis de comunitate </v-chip>

            <v-chip size="small" variant="outlined"> Neverificat </v-chip>
          </div>

          <p class="type-label">
            {{ formatType(item.type) }}
          </p>

          <h3>{{ item.name }}</h3>

          <p class="message-preview">
            {{ item.message }}
          </p>

          <div class="card-footer">
            <span>{{ formatDate(item.created_at) }}</span>

            <v-btn variant="text" color="orange" class="px-0" @click="openDetailsDialog(item)">
              Vezi contribuția
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <v-dialog v-model="formDialog" max-width="760">
      <v-card class="dialog-card" rounded="xl">
        <v-card-title class="dialog-title">
          <span>Adaugă o contribuție</span>

          <v-btn icon variant="text" @click="closeFormDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-subtitle>
          Trimite o amintire, o corecție sau o sursă nouă despre acest loc.
        </v-card-subtitle>

        <v-card-text>
          <v-form @submit.prevent="submitContribution">
            <v-text-field
              v-model="form.name"
              label="Nume sau pseudonim"
              variant="outlined"
              density="comfortable"
              maxlength="40"
              counter
              class="mb-3"
            />

            <v-select
              v-model="form.type"
              :items="contributionTypes"
              item-title="label"
              item-value="value"
              label="Tip contribuție"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />

            <v-textarea
              v-model="form.message"
              label="Text contribuție"
              variant="outlined"
              density="comfortable"
              maxlength="700"
              counter
              rows="5"
              class="mb-3"
            />

            <v-text-field
              v-model="form.source_url"
              label="Link sursă, opțional"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />

            <v-text-field
              v-model="form.image_url"
              label="Link imagine, opțional"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            />

            <v-alert type="info" variant="tonal" class="mb-4">
              Contribuțiile apar într-o secțiune separată și sunt marcate ca materiale trimise de
              comunitate.
            </v-alert>

            <div class="dialog-actions">
              <v-btn variant="outlined" @click="closeFormDialog"> Anulează </v-btn>

              <v-btn
                type="submit"
                color="orange"
                :loading="contributionsStore.submitting"
                :disabled="!canSubmit"
              >
                Trimite contribuția
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="detailsDialog" max-width="760">
      <v-card v-if="selectedContribution" class="dialog-card" rounded="xl">
        <div
          v-if="selectedContribution.image_url"
          class="details-image"
          :style="{ backgroundImage: `url(${selectedContribution.image_url})` }"
        />

        <v-card-title class="dialog-title">
          <span>Contribuție din comunitate</span>

          <v-btn icon variant="text" @click="closeDetailsDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <div class="badges">
            <v-chip size="small" color="orange" variant="flat"> Trimis de comunitate </v-chip>

            <v-chip size="small" variant="outlined"> Neverificat </v-chip>
          </div>

          <p class="type-label">
            {{ formatType(selectedContribution.type) }}
          </p>

          <h3 class="details-name">
            {{ selectedContribution.name }}
          </h3>

          <p class="details-message">
            {{ selectedContribution.message }}
          </p>

          <a
            v-if="selectedContribution.source_url"
            :href="selectedContribution.source_url"
            target="_blank"
            rel="noopener noreferrer"
            class="source-link"
          >
            Vezi sursa trimisă
          </a>

          <p class="date">
            {{ formatDate(selectedContribution.created_at) }}
          </p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useContributionsStore } from '@/stores/contributions'

const props = defineProps({
  locationId: {
    type: [String, Number],
    required: true,
  },
})

const contributionsStore = useContributionsStore()

const formDialog = ref(false)
const detailsDialog = ref(false)
const selectedContribution = ref(null)

const contributionTypes = [
  { label: 'Amintire personală', value: 'amintire_personala' },
  { label: 'Corecție', value: 'corectie' },
  { label: 'Sursă nouă', value: 'sursa_noua' },
  { label: 'Fotografie veche', value: 'fotografie_veche' },
  { label: 'Mesaj pentru viitor', value: 'mesaj_pentru_viitor' },
]

const form = reactive({
  name: '',
  type: 'amintire_personala',
  message: '',
  source_url: '',
  image_url: '',
})

const canSubmit = computed(() => {
  return form.name.trim().length >= 2 && form.type && form.message.trim().length >= 20
})

const loadContributions = () => {
  if (props.locationId) {
    contributionsStore.fetchContributions(props.locationId)
  }
}

const resetForm = () => {
  form.name = ''
  form.type = 'amintire_personala'
  form.message = ''
  form.source_url = ''
  form.image_url = ''
}

const openFormDialog = () => {
  contributionsStore.clearMessages()
  formDialog.value = true
}

const closeFormDialog = () => {
  formDialog.value = false
}

const openDetailsDialog = (item) => {
  selectedContribution.value = item
  detailsDialog.value = true
}

const closeDetailsDialog = () => {
  detailsDialog.value = false
  selectedContribution.value = null
}

const submitContribution = async () => {
  if (!canSubmit.value) return

  await contributionsStore.addContribution({
    location_id: props.locationId,
    name: form.name.trim(),
    type: form.type,
    message: form.message.trim(),
    source_url: form.source_url.trim() || null,
    image_url: form.image_url.trim() || null,
  })

  if (!contributionsStore.error) {
    resetForm()
    formDialog.value = false
  }
}

const formatType = (type) => {
  const found = contributionTypes.find((item) => item.value === type)
  return found?.label || 'Contribuție'
}

const formatDate = (date) => {
  if (!date) return ''

  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

onMounted(() => {
  contributionsStore.clearMessages()
  loadContributions()
})

watch(
  () => props.locationId,
  () => {
    contributionsStore.clearMessages()
    loadContributions()
  },
)
</script>

<style scoped>
.contributions-section {
  margin-top: 72px;
}

.section-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
}

.section-header {
  max-width: 760px;
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
  line-height: 1.7;
}

.contributions-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;

  max-height: 760px;
  overflow-y: auto;

  padding: 4px 10px 4px 0;
  margin-bottom: 32px;
}

.contributions-grid::-webkit-scrollbar {
  width: 8px;
}

.contributions-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
}

.contributions-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 138, 0, 0.65);
  border-radius: 999px;
}

.empty-message {
  color: rgba(245, 245, 245, 0.64);
}

.contribution-card,
.dialog-card {
  background: rgba(24, 24, 24, 0.96);
  border: 1px solid rgba(255, 138, 0, 0.18);
  color: #f5f5f5;
}

.contribution-image {
  height: 170px;
  background-size: cover;
  background-position: center;
  border-radius: 24px 24px 0 0;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.type-label {
  color: #ff8a00;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  font-weight: 800;
  margin-bottom: 8px;
}

.contribution-card {
  width: 100%;
  min-height: 272px;
}

.contribution-card h3 {
  color: #f5f5f5;
  margin-bottom: 12px;
}

.message-preview {
  color: rgba(245, 245, 245, 0.78);
  line-height: 1.7;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 82px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  color: rgba(245, 245, 245, 0.48);
  font-size: 0.9rem;
}

.dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.details-image {
  height: 280px;
  background-size: cover;
  background-position: center;
  border-radius: 24px 24px 0 0;
}

.details-name {
  color: #f5f5f5;
  font-size: 1.4rem;
  margin-bottom: 16px;
}

.details-message {
  color: rgba(245, 245, 245, 0.82);
  line-height: 1.8;
  white-space: pre-line;
  margin-bottom: 18px;
}

.source-link {
  color: #ff8a00;
  text-decoration: none;
  font-weight: 700;
}

.source-link:hover {
  text-decoration: underline;
}

.date {
  color: rgba(245, 245, 245, 0.48);
  font-size: 0.9rem;
  margin-top: 14px;
  margin-bottom: 0;
}

@media (max-width: 700px) {
  .section-top {
    flex-direction: column;
  }

  .section-top .v-btn {
    width: 100%;
  }

  .dialog-actions {
    flex-direction: column-reverse;
  }

  .dialog-actions .v-btn {
    width: 100%;
  }

  .contributions-grid {
    max-height: 520px;
  }
}
</style>
