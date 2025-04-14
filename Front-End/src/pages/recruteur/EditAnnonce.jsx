import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import annonceService from '../../services/annonceService';
import categorieService from '../../services/categorieService';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const EditAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categorie_id: '',
    thumbnail: null
  });
  
  const [originalAnnonce, setOriginalAnnonce] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Annonce Details
        const annonceResponse = await annonceService.getAnnonceById(id);
        const annonceData = annonceResponse.data;
        setOriginalAnnonce(annonceData);
        
        setFormData({
          title: annonceData.title,
          description: annonceData.description,
          categorie_id: annonceData.categorie_id,
        });
        
        if (annonceData.thumbnail) {
          setThumbnailPreview(`http://localhost/storage/${annonceData.thumbnail}`);
        }
        
        // Fetch Categories
        const categoriesResponse = await categorieService.getCategories();
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        console.error('Error fetching annonce data:', err);
        setError('Impossible de charger les données de l\'annonce');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, thumbnail: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      await annonceService.updateAnnonce(id, formData);
      navigate('/recruteur/annonces', { state: { success: 'Annonce mise à jour avec succès' } });
    } catch (err) {
      console.error('Error updating annonce:', err);
      
      if (err.response?.data?.errors) {

        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'Échec de la mise à jour de l\'annonce');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-purple-800">Modifier l'annonce</h2>
        
        {error && (
          <Alert 
            message={error} 
            type="error" 
            onClose={() => setError('')} 
          />
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Titre de l'annonce*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="categorie_id" className="block text-gray-700 font-medium mb-2">
              Catégorie*
            </label>
            <select
              id="categorie_id"
              name="categorie_id"
              value={formData.categorie_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" disabled>Sélectionner une catégorie</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label htmlFor="thumbnail" className="block text-gray-700 font-medium mb-2">
              Image
            </label>
            
            {thumbnailPreview && (
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">Image actuelle:</p>
                <img 
                  src={thumbnailPreview} 
                  alt="Aperçu" 
                  className="h-40 object-cover rounded-lg border"
                />
              </div>
            )}
            
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="text-sm text-gray-500 mt-1">
              Laissez vide pour conserver l'image actuelle. Format recommandé: JPG, PNG. Taille max: 2 Mo
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="secondary"
              onClick={() => navigate('/recruteur/annonces')}
            >
              Annuler
            </Button>
            
            <Button 
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mise à jour en cours...
                </span>
              ) : 'Enregistrer les modifications'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAnnonce;