import api from './api'

export const toursService = {
  getAllTours() {
    return api.get('/api/tours')
  },

  getTourBySlug(slug) {
    return api.get(`/api/tours/${slug}`)
  }
}