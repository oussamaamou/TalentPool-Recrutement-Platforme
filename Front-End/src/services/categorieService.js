import apiClient from './apiClient';

const categorieService = {
  getCategories: async () => {
    return await apiClient.get('/categories');
  },
  
  getCategorieById: async (id) => {
    return await apiClient.get(`/categories/${id}`);
  },
  
  createCategorie: async (name) => {
    return await apiClient.post('/categories', { name });
  },
  
  updateCategorie: async (id, name) => {
    return await apiClient.put(`/categories/${id}`, { name });
  },
  
  deleteCategorie: async (id) => {
    return await apiClient.delete(`/categories/${id}`);
  }
};

export default categorieService;