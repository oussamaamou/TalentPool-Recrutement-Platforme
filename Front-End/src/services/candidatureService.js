import apiClient from './apiClient';

const candidatureService = {
  
  getCandidatures: async () => {
    return await apiClient.get('/candidatures');
  },
  
  getCandidatureById: async (id) => {
    return await apiClient.get(`/candidatures/${id}`);
  },
  
  getCandidaturesByAnnonce: async (annonceId) => {
    return await apiClient.get(`/candidatures/annonce/${annonceId}`);
  },
  
  createCandidature: async (candidatureData) => {
    console.log('[candidatureService] createCandidature called');
    
    const isFormData = candidatureData instanceof FormData;
    console.log('[candidatureService] Data is FormData:', isFormData);
    
    let formData;
    
    if (isFormData) {
      formData = candidatureData;
      console.log('[candidatureService] Using provided FormData');
      
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`[candidatureService] FormData contains ${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`[candidatureService] FormData contains ${key}: ${typeof value === 'string' ? (value.length > 30 ? value.substring(0, 30) + '...' : value) : typeof value}`);
        }
      }
    } else {
      console.log('[candidatureService] Converting object to FormData');
      formData = new FormData();
      
      for (const key in candidatureData) {
        if (candidatureData[key] instanceof File || candidatureData[key] instanceof Blob) {
          console.log(`[candidatureService] Adding file to FormData: ${key}`);
          formData.append(key, candidatureData[key], candidatureData[key].name);
        } else {
          console.log(`[candidatureService] Adding field to FormData: ${key}`);
          formData.append(key, candidatureData[key]);
        }
      }
    }
    
    const hasDocument = formData.has('document');
    console.log('[candidatureService] FormData has document field:', hasDocument);
    
    if (hasDocument) {
      const docValue = formData.get('document');
      const isFile = docValue instanceof File;
      console.log('[candidatureService] document is a File object:', isFile);
      
      if (isFile) {
        console.log('[candidatureService] document file details:', {
          name: docValue.name,
          type: docValue.type,
          size: docValue.size
        });
      }
    }
    
    console.log('[candidatureService] Making POST request to /candidatures');
    try {
      const response = await apiClient.post('/candidatures', formData);
      console.log('[candidatureService] Response received:', response);
      return response;
    } catch (error) {
      console.error('[candidatureService] Error in POST request:', error);
      console.error('[candidatureService] Error response data:', error.response?.data);
      throw error;
    }
  },
  
  updateCandidature: async (id, candidatureData) => {
    console.log('[candidatureService] updateCandidature called');
    
    let formData;
    if (candidatureData instanceof FormData) {
      formData = candidatureData;
      formData.append('_method', 'PUT');
    } else {
      formData = new FormData();
      for (const key in candidatureData) {
        if (candidatureData[key] instanceof File) {
          formData.append(key, candidatureData[key], candidatureData[key].name);
        } else {
          formData.append(key, candidatureData[key]);
        }
      }
      formData.append('_method', 'PUT');
    }
    
    return await apiClient.post(`/candidatures/${id}`, formData);
  },
  
  deleteCandidature: async (id) => {
    return await apiClient.delete(`/candidatures/${id}`);
  },
  
  updateCandidatureStatus: async (id, statut) => {
    return await apiClient.put(`/candidatures/${id}/statut`, { statut });
  }
};

export default candidatureService;