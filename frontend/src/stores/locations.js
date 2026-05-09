import { defineStore } from 'pinia'
import { locationsService } from '@/services/locations'

export const useLocationsStore = defineStore('locations', {
  state: () => ({
    locations: [],
    selectedLocation: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchLocations() {
      this.loading = true
      this.error = null

      try {
        const response = await locationsService.getAllLocations()
        this.locations = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Nu s-au putut încărca locațiile.'
      } finally {
        this.loading = false
      }
    },

    async fetchLocationBySlug(slug) {
      this.loading = true
      this.error = null
      this.selectedLocation = null

      try {
        const response = await locationsService.getLocationBySlug(slug)
        this.selectedLocation = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Nu s-a putut încărca locația.'
      } finally {
        this.loading = false
      }
    }
  }
})