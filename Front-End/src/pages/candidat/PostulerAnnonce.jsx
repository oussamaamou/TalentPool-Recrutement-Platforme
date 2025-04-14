import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import annonceService from '../../services/annonceService';
import candidatureService from '../../services/candidatureService';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const PostulerAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [annonce, setAnnonce] = useState(null);
  const [formData, setFormData] = useState({
    objet: '',
    lettre: '',
    document: null,
    annonce_id: id
  });
  
  const [documentName, setDocumentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        const response = await annonceService.getAnnonceById(id);
        setAnnonce(response.data);
        
        setFormData(prev => ({
          ...prev,
          objet: `Candidature pour "${response.data.title}"`
        }));
      } catch (err) {
        console.error('Error fetching annonce:', err);
        setError('Impossible de charger les détails de l\'annonce');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnnonce();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, document: file });
      setDocumentName(file.name);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      await candidatureService.createCandidature(formData);
      navigate('/candidat/candidatures', { state: { success: 'Candidature envoyée avec succès' } });
    } catch (err) {
      console.error('Error submitting candidature:', err);
      
      if (err.response?.data?.errors) {

        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'Échec de l\'envoi de la candidature');
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
      {annonce && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-6 text-purple-800">Postuler à l'annonce</h2>
          
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-gray-800">{annonce.title}</h3>
            <p className="text-gray-600 mt-2">{annonce.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              <p>Publié par: {annonce.recruteur?.name || 'Recruteur'}</p>
              <p>Date de publication: {new Date(annonce.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          {error && (
            <Alert 
              message={error} 
              type="error" 
              onClose={() => setError('')} 
            />
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="objet" className="block text-gray-700 font-medium mb-2">
                Objet*
              </label>
              <input
                type="text"
                id="objet"
                name="objet"
                value={formData.objet}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="lettre" className="block text-gray-700 font-medium mb-2">
                Lettre de motivation*
              </label>
              <textarea
                id="lettre"
                name="lettre"
                value={formData.lettre}
                onChange={handleChange}
                rows="8"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé par cette offre..."
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="document" className="block text-gray-700 font-medium mb-2">
                Document (CV, portfolio...)
              </label>
              <input
                type="file"
                id="document"
                name="document"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
              <div className="flex items-center">
                <label
                  htmlFor="document"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition"
                >
                  Choisir un fichier
                </label>
                <span className="ml-3 text-gray-600">
                  {documentName || 'Aucun fichier choisi'}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Formats acceptés: PDF, DOC, DOCX. Taille max: 5 Mo
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/')}
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
                    Envoi en cours...
                  </span>
                ) : 'Envoyer ma candidature'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostulerAnnonce;