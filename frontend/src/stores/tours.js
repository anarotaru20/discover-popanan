import { defineStore } from 'pinia'
import { toursService } from '@/services/tours'

export const useToursStore = defineStore('tours', {
  state: () => ({
    tours: [],
    selectedTour: null,
    loading: false,
    error: null
  }),

  getters: {
    featuredTours: (state) => state.tours.slice(0, 3),

    toursByTheme: (state) => {
      return state.tours.reduce((acc, tour) => {
        if (!acc[tour.theme]) acc[tour.theme] = []
        acc[tour.theme].push(tour)
        return acc
      }, {})
    }
  },

  actions: {
    async fetchTours() {
      this.loading = true
      this.error = null

      try {
        const response = await toursService.getAllTours()
        this.tours = response.data?.data || []
      } catch (error) {
        this.error = error.response?.data?.message || 'Nu s-au putut încărca tururile.'
      } finally {
        this.loading = false
      }
    },

    async fetchTourBySlug(slug) {
      this.loading = true
      this.error = null
      this.selectedTour = null

      try {
        const response = await toursService.getTourBySlug(slug)
        this.selectedTour = response.data?.data || null
      } catch (error) {
        this.error = error.response?.data?.message || 'Nu s-a putut încărca turul.'
      } finally {
        this.loading = false
      }
    },

    clearSelectedTour() {
      this.selectedTour = null
    }
  }
})