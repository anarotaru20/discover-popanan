import api from './api'

export const locationsService = {
  getAllLocations() {
    return api.get('/api/locations')
  },

  getLocationBySlug(slug) {
    return api.get(`/api/locations/${slug}`)
  }
}