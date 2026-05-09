import api from './api'

export const contributionsService = {
  getContributionsByLocation(locationId) {
    return api.get(`/api/contributions/${locationId}`)
  },

  createContribution(payload) {
    return api.post('/api/contributions', payload)
  }
}