import api from './api'

export const locationsService = {
  getAllLocations() {
    return api.get('/locations')
  },

  getLocationBySlug(slug) {
    return api.get(`/locations/${slug}`)
  }
}