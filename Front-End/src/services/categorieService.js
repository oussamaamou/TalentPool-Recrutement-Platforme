import apiClient from './apiClient';

const categorieService = {
  // Afficher toutes les Categories
  getCategories: async () => {
    return await apiClient.get('/categories');
  },
  
  // Afficher une Categorie
  getCategorieById: async (id) => {
    return await apiClient.get(`/categories/${id}`);
  },
  
  // Creer une Categorie
  createCategorie: async (name) => {
    return await apiClient.post('/categories', { name });
  },
  
  // Modifier une Categorie
  updateCategorie: async (id, name) => {
    return await apiClient.put(`/categories/${id}`, { name });
  },
  
  // Supprimer une Categorie
  deleteCategorie: async (id) => {
    return await apiClient.delete(`/categories/${id}`);
  }
};

export default categorieService;