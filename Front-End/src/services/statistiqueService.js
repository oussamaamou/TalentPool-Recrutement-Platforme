import apiClient from './apiClient';

const statistiqueService = {
  getRecruteurStats: async () => {
    return await apiClient.get('/stats/recruteur');
  },
  
  getGlobalStats: async () => {
    return await apiClient.get('/stats/global');
  }
};

export default statistiqueService;