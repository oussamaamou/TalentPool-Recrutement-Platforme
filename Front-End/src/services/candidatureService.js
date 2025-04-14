import apiClient from './apiClient';

const candidatureService = {
  // Afficher toutes les Candidatures
  getCandidatures: async () => {
    return await apiClient.get('/candidatures');
  },
  
  // Afficher les details d'une Candidature
  getCandidatureById: async (id) => {
    return await apiClient.get(`/candidatures/${id}`);
  },
  
  // Afficher les Candidatures d'une Annonce
  getCandidaturesByAnnonce: async (annonceId) => {
    return await apiClient.get(`/candidatures/annonce/${annonceId}`);
  },
  
  // Creer une Candidature
  createCandidature: async (candidatureData) => {

    const formData = new FormData();
    for (const key in candidatureData) {
      formData.append(key, candidatureData[key]);
    }
    
    return await apiClient.post('/candidatures', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Modifier une Annonce
  updateCandidature: async (id, candidatureData) => {

    const formData = new FormData();
    for (const key in candidatureData) {
      formData.append(key, candidatureData[key]);
    }

    formData.append('_method', 'PUT');
    
    return await apiClient.post(`/candidatures/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Supprimer une Annonce
  deleteCandidature: async (id) => {
    return await apiClient.delete(`/candidatures/${id}`);
  },
  
  // Changer le status d'une Annonce
  updateCandidatureStatus: async (id, statut) => {
    return await apiClient.put(`/candidatures/${id}/statut`, { statut });
  }
};

export default candidatureService;