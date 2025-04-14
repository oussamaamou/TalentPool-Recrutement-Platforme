import apiClient from './apiClient';

const statistiqueService = {
  // Afficher les Statistiques d'un Recruteur
  getRecruteurStats: async () => {
    return await apiClient.get('/stats/recruteur');
  },
  
  // Afficher les Statistiques Globales
  getGlobalStats: async () => {
    return await apiClient.get('/stats/global');
  }
};

export default statistiqueService;