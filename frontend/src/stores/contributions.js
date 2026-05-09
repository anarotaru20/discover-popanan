import { defineStore } from 'pinia'
import { contributionsService } from '@/services/contributions'

export const useContributionsStore = defineStore('contributions', {
  state: () => ({
    contributions: [],
    loading: false,
    submitting: false,
    error: null,
    successMessage: null
  }),

  actions: {
    async fetchContributions(locationId) {
      this.loading = true
      this.error = null

      try {
        const response = await contributionsService.getContributionsByLocation(locationId)
        this.contributions = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Nu s-au putut încărca contribuțiile.'
      } finally {
        this.loading = false
      }
    },

    async addContribution(payload) {
      this.submitting = true
      this.error = null
      this.successMessage = null

      try {
        const response = await contributionsService.createContribution(payload)

        if (response.data?.is_flagged) {
          this.error = response.data?.flag_reason || 'Contribuția nu poate fi publicată automat.'
          return
        }

        this.successMessage = 'Contribuția a fost adăugată în arhiva comunității.'
        await this.fetchContributions(payload.location_id)
      } catch (error) {
        this.error = error.response?.data?.message || 'Contribuția nu a putut fi trimisă.'
      } finally {
        this.submitting = false
      }
    },

    clearMessages() {
      this.error = null
      this.successMessage = null
    }
  }
})