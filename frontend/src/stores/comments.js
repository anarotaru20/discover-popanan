import { defineStore } from 'pinia'
import { commentsService } from '@/services/comments'

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    comments: [],
    loading: false,
    submitting: false,
    error: null,
    successMessage: null,
  }),

  actions: {
    async fetchComments(locationId) {
      this.loading = true
      this.error = null

      try {
        const response = await commentsService.getCommentsByLocation(locationId)
        this.comments = response.data?.data || []
      } catch (error) {
        this.error = error.response?.data?.message || 'Nu s-au putut încărca comentariile.'
      } finally {
        this.loading = false
      }
    },

    async addComment(payload) {
      this.submitting = true
      this.error = null
      this.successMessage = null

      try {
        const response = await commentsService.createComment(payload)

        if (response.data?.is_flagged) {
          this.error = response.data?.flag_reason || 'Comentariul nu poate fi publicat automat.'
          return
        }

        this.successMessage = 'Comentariul a fost adăugat cu succes.'
        await this.fetchComments(payload.location_id)
      } catch (error) {
        this.error = error.response?.data?.message || 'Comentariul nu a putut fi trimis.'
      } finally {
        this.submitting = false
      }
    },

    clearMessages() {
      this.error = null
      this.successMessage = null
    },
  },
})
