import apiClient from './apiClient';

const annonceService = {
  // Afficher toutes les Annonces
  getAnnonces: async () => {
    return await apiClient.get('/annonces');
  },
  
  // Afficher les details d'une Annonce
  getAnnonceById: async (id) => {
    return await apiClient.get(`/annonces/${id}`);
  },
  
  // Afficher mes Annonces
  getMesAnnonces: async () => {
    return await apiClient.get('/mes-annonces');
  },
  
  // Creer une Annonce
  createAnnonce: async (annonceData) => {

    const formData = new FormData();
    for (const key in annonceData) {
      formData.append(key, annonceData[key]);
    }
    
    return await apiClient.post('/annonces', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Modifier une Annonce
  updateAnnonce: async (id, annonceData) => {

    const formData = new FormData();
    for (const key in annonceData) {
      formData.append(key, annonceData[key]);
    }

    formData.append('_method', 'PUT');
    
    return await apiClient.post(`/annonces/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // Supprimer une Annonce
  deleteAnnonce: async (id) => {
    return await apiClient.delete(`/annonces/${id}`);
  }
};

export default annonceService;