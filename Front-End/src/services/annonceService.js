import apiClient from './apiClient';

const annonceService = {
  getAnnonces: async () => {
    return await apiClient.get('/annonces');
  },
  
  getAnnonceById: async (id) => {
    return await apiClient.get(`/annonces/${id}`);
  },
  
  getMesAnnonces: async () => {
    return await apiClient.get('/mes-annonces');
  },
  
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
  
  deleteAnnonce: async (id) => {
    return await apiClient.delete(`/annonces/${id}`);
  }
};

export default annonceService;