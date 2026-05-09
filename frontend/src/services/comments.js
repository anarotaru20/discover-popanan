import api from './api'

export const commentsService = {
  getCommentsByLocation(locationId) {
    return api.get(`/comments/${locationId}`)
  },

  createComment(payload) {
    return api.post('/comments', payload)
  }
}