<template>
  <section class="comments-section">
    <div class="section-header">
      <p class="eyebrow">Comunitate</p>
      <h2>Comentarii</h2>
      <p class="section-description">
        Lasă o reacție scurtă despre acest loc sau despre povestea lui.
      </p>
    </div>

    <v-alert
      v-if="commentsStore.error"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ commentsStore.error }}
    </v-alert>

    <v-alert
      v-if="commentsStore.successMessage"
      type="success"
      variant="tonal"
      class="mb-4"
    >
      {{ commentsStore.successMessage }}
    </v-alert>

    <v-card class="comment-form-card" rounded="xl">
      <v-card-title>Adaugă un comentariu</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="submitComment">
          <v-text-field
            v-model="form.name"
            label="Nume sau pseudonim"
            variant="outlined"
            density="comfortable"
            maxlength="40"
            counter
            class="mb-3"
          />

          <v-textarea
            v-model="form.message"
            label="Comentariu"
            variant="outlined"
            density="comfortable"
            maxlength="400"
            counter
            rows="3"
            class="mb-3"
          />

          <v-btn
            type="submit"
            color="orange"
            :loading="commentsStore.submitting"
            :disabled="!canSubmit"
          >
            Trimite comentariul
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <div class="comments-list">
      <v-progress-circular
        v-if="commentsStore.loading"
        indeterminate
        color="orange"
        class="my-6"
      />

      <p
        v-else-if="!commentsStore.comments.length"
        class="empty-message"
      >
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
import { computed, onMounted, reactive, watch } from 'vue'
import { useCommentsStore } from '@/stores/comments'

const props = defineProps({
  locationId: {
    type: [String, Number],
    required: true
  }
})

const commentsStore = useCommentsStore()

const form = reactive({
  name: '',
  message: ''
})

const canSubmit = computed(() => {
  return form.name.trim().length >= 2 && form.message.trim().length >= 10
})

const loadComments = () => {
  if (props.locationId) {
    commentsStore.fetchComments(props.locationId)
  }
}

const submitComment = async () => {
  if (!canSubmit.value) return

  await commentsStore.addComment({
    location_id: props.locationId,
    name: form.name.trim(),
    message: form.message.trim()
  })

  if (!commentsStore.error) {
    form.name = ''
    form.message = ''
  }
}

const formatDate = (date) => {
  if (!date) return ''

  return new Intl.DateTimeFormat('ro-RO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
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
  }
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
}

.comment-form-card,
.comment-card {
  background: rgba(24, 24, 24, 0.92);
  border: 1px solid rgba(255, 138, 0, 0.18);
}

.comment-form-card {
  margin-bottom: 28px;
}

.comments-list {
  display: grid;
  gap: 16px;
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

@media (max-width: 600px) {
  .comment-top {
    flex-direction: column;
    gap: 4px;
  }
}
</style>