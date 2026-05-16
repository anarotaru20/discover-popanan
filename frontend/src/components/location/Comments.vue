<template>
  <section class="comments-section">
    <div class="section-header">
      <p class="eyebrow">Comunitate</p>

      <div class="section-description-row">
        <p class="section-description">
          Lasă un comentariu sau o contribuție în
          <RouterLink to="/contributions" class="community-link"> arhiva comunitară. </RouterLink>
        </p>

        <v-btn class="section-btn" color="orange" size="large" rounded="xl" @click="openFormDialog">
          Adaugă comentariu
        </v-btn>
      </div>
    </div>

    <v-alert v-if="commentsStore.error" type="error" variant="tonal" class="mb-4">
      {{ commentsStore.error }}
    </v-alert>

    <v-alert v-if="commentsStore.successMessage" type="success" variant="tonal" class="mb-4">
      {{ commentsStore.successMessage }}
    </v-alert>

    <v-dialog v-model="formDialog" max-width="760" scrollable>
      <v-card class="comment-form-card" rounded="xl">
        <div class="dialog-header">
          <div>
            <p class="eyebrow dialog-eyebrow">Adaugă un comentariu</p>
          </div>

          <v-btn icon variant="text" @click="closeFormDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="dialog-content">
          <v-form @submit.prevent="submitComment">
            <v-text-field
              v-model="form.name"
              label="Nume"
              variant="outlined"
              density="comfortable"
              maxlength="40"
              counter
              :rules="nameRules"
              class="mb-3"
            />

            <v-textarea
              v-model="form.message"
              label="Mesaj"
              variant="outlined"
              density="comfortable"
              maxlength="400"
              counter
              rows="4"
              auto-grow
              :rules="messageRules"
              class="mb-3"
            />

            <div class="dialog-actions">
              <v-btn variant="text" rounded="xl" size="large" @click="closeFormDialog">
                Renunță
              </v-btn>

              <v-btn
                type="submit"
                color="orange"
                rounded="xl"
                size="large"
                :loading="commentsStore.submitting"
                :disabled="!canSubmit"
              >
                Trimite comentariul
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <div class="comments-list">
      <v-progress-circular v-if="commentsStore.loading" indeterminate color="orange" class="my-6" />

      <p v-else-if="!commentsStore.comments.length" class="empty-message">
        Nu există comentarii încă. Fii prima persoană care lasă o reacție.
      </p>

      <v-card
        v-for="comment in commentsStore.comments"
        :key="comment.id"
        class="comment-card"
        rounded="xl"
      >
        <v-card-text>
          <div class="comment-top">
            <strong>{{ comment.name }}</strong>
            <span>{{ formatDate(comment.created_at) }}</span>
          </div>

          <p class="comment-message">
            {{ comment.message }}
          </p>
        </v-card-text>
      </v-card>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useCommentsStore } from '@/stores/comments'

const props = defineProps({
  locationId: {
    type: [String, Number],
    required: true,
  },
})

const commentsStore = useCommentsStore()

const formDialog = ref(false)

const form = reactive({
  name: '',
  message: '',
})

const formError = ref('')

const nameRules = [
  (value) => !!value?.trim() || 'Toate câmpurile trebuie completate.',
  (value) => value.trim().length >= 2 || 'Numele trebuie să conțină cel puțin 2 caractere.',
]

const messageRules = [
  (value) => !!value?.trim() || 'Toate câmpurile trebuie completate.',
  (value) => value.trim().length >= 10 || 'Mesajul trebuie să conțină cel puțin 10 caractere.',
]

const canSubmit = computed(() => {
  return form.name.trim().length >= 2 && form.message.trim().length >= 10
})

const loadComments = () => {
  if (props.locationId) {
    commentsStore.fetchComments(props.locationId)
  }
}

const resetForm = () => {
  form.name = ''
  form.message = ''
}

const openFormDialog = () => {
  commentsStore.clearMessages()
  formDialog.value = true
}

const closeFormDialog = () => {
  formDialog.value = false
}

const submitComment = async () => {
  formError.value = ''

  if (!form.name.trim() || !form.message.trim()) {
    formError.value = 'Toate câmpurile trebuie completate.'
    return
  }

  if (form.name.trim().length < 2) {
    formError.value = 'Numele trebuie să conțină cel puțin 2 caractere.'
    return
  }

  if (form.message.trim().length < 10) {
    formError.value = 'Mesajul trebuie să conțină cel puțin 10 caractere.'
    return
  }

  await commentsStore.addComment({
    location_id: props.locationId,
    name: form.name.trim(),
    message: form.message.trim(),
  })

  if (!commentsStore.error) {
    resetForm()
    closeFormDialog()
  }
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
  commentsStore.clearMessages()
  loadComments()
})

watch(
  () => props.locationId,
  () => {
    commentsStore.clearMessages()
    loadComments()
  },
)
</script>

<style scoped>
.comments-section {
  margin-top: 72px;
}

.section-header {
  margin-bottom: 24px;
}

.eyebrow {
  color: #ff8a00;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.section-description-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.section-description {
  color: rgba(245, 245, 245, 0.72);
  max-width: 680px;
  line-height: 1.7;
  margin: 0;
}

.section-btn {
  flex-shrink: 0;
}

.comment-form-card,
.comment-card {
  background: rgba(24, 24, 24, 0.96);
  border: 1px solid rgba(255, 138, 0, 0.18);
}

.comment-form-card {
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 24px 8px;
}

.dialog-eyebrow {
  font-size: 0.98rem;
  margin-bottom: 4px;
}

.dialog-title {
  padding: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f5f5f5;
}

.dialog-content {
  padding: 16px 24px 24px;
}

.dialog-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 420px;
  overflow-y: auto;
  padding: 4px 10px 4px 0;
  margin-top: 8px;
}

.comment-card {
  width: 100%;
  flex-shrink: 0;
  padding: 8px;
}

.comments-list::-webkit-scrollbar {
  width: 8px;
}

.comments-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
}

.comments-list::-webkit-scrollbar-thumb {
  background: rgba(255, 138, 0, 0.65);
  border-radius: 999px;
}

.empty-message {
  color: rgba(245, 245, 245, 0.64);
  margin-top: 12px;
}

.comment-top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: #f5f5f5;
  margin-bottom: 12px;
}

.comment-top span {
  color: rgba(245, 245, 245, 0.52);
  font-size: 0.9rem;
}

.comment-message {
  color: rgba(245, 245, 245, 0.78);
  line-height: 1.7;
  margin: 0;
}

.community-link {
  color: rgba(255, 138, 0, 0.9);
  text-decoration: none;
  font-weight: 700;
}

.community-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .comments-section {
    margin-top: 48px;
  }

  .section-description-row {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .section-btn {
    width: 100%;
  }

  .comments-list {
    height: auto;
    max-height: 480px;
    padding-right: 6px;
  }
}

@media (max-width: 600px) {
  :deep(.v-overlay__content) {
    width: calc(100vw - 32px) !important;
    max-width: calc(100vw - 32px) !important;
    margin: 16px !important;
  }

  .comment-form-card {
    width: 100%;
    max-height: 86vh;
    border-radius: 24px !important;
  }

  .dialog-header {
    padding: 20px 18px 8px;
  }

  .dialog-content {
    padding: 12px 18px 24px;
  }

  .dialog-title {
    font-size: 1.25rem;
  }

  .dialog-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .dialog-actions .v-btn {
    width: 100%;
  }

  .comment-top {
    flex-direction: column;
    gap: 4px;
  }

  .comment-card {
    padding: 4px;
  }
  .dialog-actions .v-btn[type='submit'] {
    order: 1;
  }

  .dialog-actions .v-btn:not([type='submit']) {
    order: 2;
  }
}
</style>
