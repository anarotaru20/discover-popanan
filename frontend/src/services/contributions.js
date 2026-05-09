import api from './api'

export const contributionsService = {
  getContributionsByLocation(locationId) {
    return api.get(`/contributions/${locationId}`)
  },

  createContribution(payload) {
    return api.post('/contributions', payload)
  }
}