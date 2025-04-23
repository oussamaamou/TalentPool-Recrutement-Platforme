import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Send, 
  X, 
  Briefcase, 
  Calendar, 
  Building, 
  ArrowLeft, 
  Upload, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import annonceService from '../../services/annonceService';
import candidatureService from '../../services/candidatureService';
import Button from '../../components/common/Button';

const PostulerAnnonce = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [annonce, setAnnonce] = useState(null);
  const [formData, setFormData] = useState({
    objet: '',
    lettre: '',
  });
  
  const [documentFile, setDocumentFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxCharCount = 2000;
  
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'lettre') {
      setCharCount(value.length);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. La taille maximale est de 5 Mo.');
        return;
      }
      
      setDocumentFile(file);
      setDocumentName(file.name);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {

      const formDataToSend = new FormData();
      
      formDataToSend.append('objet', formData.objet);
      formDataToSend.append('lettre', formData.lettre);
      formDataToSend.append('annonce_id', id);
      
      if (documentFile) {
        formDataToSend.append('document', documentFile);
      }
      
      await candidatureService.createCandidature(formDataToSend);
      
      navigate('/candidat/candidatures', { 
        state: { success: 'Candidature envoyée avec succès' } 
      });
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
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
        <p className="mt-4 text-purple-700 font-medium">Chargement des détails de l'annonce...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-purple-700 hover:text-purple-900 mb-6 transition-colors duration-200"
      >
        <ArrowLeft size={18} className="mr-2" />
        Retour aux annonces
      </button>
      
      {annonce && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Briefcase className="mr-3" size={24} />
              Postuler à une offre d'emploi
            </h2>
            <p className="text-purple-100 mt-1">
              Complétez le formulaire ci-dessous pour soumettre votre candidature
            </p>
          </div>
          
          {/* Annonces Details */}
          <div className="bg-purple-50 p-6 border-b border-purple-100">
            <h3 className="text-xl font-bold text-gray-800">{annonce.title}</h3>
            <p className="text-gray-600 mt-2 mb-4">{annonce.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-gray-700">
                <Building size={16} className="mr-2 text-purple-600" />
                <span className="font-medium mr-2">Entreprise:</span>
                {annonce.recruteur?.name || 'Non spécifié'}
              </div>
              
              <div className="flex items-center text-gray-700">
                <Calendar size={16} className="mr-2 text-purple-600" />
                <span className="font-medium mr-2">Date de publication:</span>
                {formatDate(annonce.created_at)}
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock size={16} className="mr-2 text-purple-600" />
                <span className="font-medium mr-2">Type:</span>
                {annonce.type || 'Non spécifié'}
              </div>
            </div>
          </div>
          
          {/* Formulaire de Candidature */}
          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
                <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-700">Une erreur est survenue</h4>
                  <p className="text-red-600">{error}</p>
                </div>
                <button 
                  onClick={() => setError('')}
                  className="ml-auto text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              <div>
                <label htmlFor="objet" className="block text-gray-700 font-medium mb-2 flex items-center">
                  <FileText size={16} className="mr-2 text-purple-600" />
                  Objet*
                </label>
                <input
                  type="text"
                  id="objet"
                  name="objet"
                  value={formData.objet}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lettre" className="block text-gray-700 font-medium mb-2 flex items-center">
                  <FileText size={16} className="mr-2 text-purple-600" />
                  Lettre de motivation*
                </label>
                <textarea
                  id="lettre"
                  name="lettre"
                  value={formData.lettre}
                  onChange={handleChange}
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  required
                  maxLength={maxCharCount}
                  placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé par cette offre..."
                ></textarea>
                <div className="flex justify-end mt-2 text-sm">
                  <span className={`${charCount > maxCharCount * 0.9 ? 'text-orange-600' : 'text-gray-500'}`}>
                    {charCount}/{maxCharCount} caractères
                  </span>
                </div>
              </div>
              
              <div>
                <label htmlFor="document" className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Upload size={16} className="mr-2 text-purple-600" />
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
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors cursor-pointer" onClick={() => document.getElementById('document').click()}>
                  {documentName ? (
                    <div className="flex items-center justify-center">
                      <CheckCircle size={20} className="text-green-600 mr-2" />
                      <span className="text-gray-700">{documentName}</span>
                      <button
                        type="button"
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocumentName('');
                          setDocumentFile(null);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <span className="text-gray-600">Cliquez pour ajouter votre CV ou glissez-le ici</span>
                      <p className="text-sm text-gray-500 mt-1">
                        Formats acceptés: PDF, DOC, DOCX. Taille max: 5 Mo
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => navigate('/')}
                  className="flex items-center px-6 py-2"
                >
                  <X size={16} className="mr-2" />
                  Annuler
                </Button>
                
                <Button 
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  className="flex items-center px-6 py-2"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Envoyer ma candidature
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostulerAnnonce;