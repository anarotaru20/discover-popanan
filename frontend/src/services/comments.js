import api from './api'

export const commentsService = {
  getCommentsByLocation(locationId) {
    return api.get(`/api/comments/${locationId}`)
  },

  createComment(payload) {
    return api.post('/api/comments', payload)
  }
}