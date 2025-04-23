import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  X, 
  Filter, 
  Search,
  Building,
  ArrowUpRight
} from 'lucide-react';
import candidatureService from '../../services/candidatureService';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const MesCandidatures = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const response = await candidatureService.getCandidatures();
        setCandidatures(response.data || []);
      } catch (err) {
        console.error('Error fetching candidatures:', err);
        setError('Impossible de charger vos candidatures');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidatures();
  }, []);
  
  const handleViewDetails = (candidature) => {
    setSelectedCandidature(candidature);
  };
  
  const handleCloseDetails = () => {
    setSelectedCandidature(null);
  };
  
  const handleDeleteClick = (candidatureId) => {
    setConfirmDelete(candidatureId);
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };
  
  const handleConfirmDelete = async (candidatureId) => {
    try {
      await candidatureService.deleteCandidature(candidatureId);
      setCandidatures(candidatures.filter(c => c.id !== candidatureId));
      setSuccess('Candidature supprimée avec succès');
      setConfirmDelete(null);
      
      if (selectedCandidature && selectedCandidature.id === candidatureId) {
        setSelectedCandidature(null);
      }
    } catch (err) {
      console.error('Error deleting candidature:', err);
      setError('Échec de la suppression de la candidature');
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepte':
        return <CheckCircle size={16} className="mr-1" />;
      case 'Refuse':
        return <XCircle size={16} className="mr-1" />;
      case 'En attente':
      default:
        return <Clock size={16} className="mr-1" />;
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Accepte':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Refuse':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'En attente':
      default:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };
  
  const filteredCandidatures = candidatures
    .filter(candidature => {

      if (activeTab === 'all') return true;
      if (activeTab === 'pending') return candidature.statut === 'En attente';
      if (activeTab === 'accepted') return candidature.statut === 'Accepte';
      if (activeTab === 'rejected') return candidature.statut === 'Refuse';
      return true;
    })
    .filter(candidature => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (candidature.objet && candidature.objet.toLowerCase().includes(searchLower)) ||
        (candidature.annonce?.title && candidature.annonce.title.toLowerCase().includes(searchLower)) ||
        (candidature.annonce?.recruteur?.name && candidature.annonce.recruteur.name.toLowerCase().includes(searchLower))
      );
    });
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
        <p className="mt-4 text-purple-700 font-medium">Chargement de vos candidatures...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Briefcase className="mr-3" size={28} /> 
              Mes Candidatures
            </h1>
            <p className="text-gray-600 mt-1">Suivez l'état de vos candidatures et gérez vos demandes</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/" className="inline-flex items-center text-purple-700 hover:text-purple-900 transition-colors">
              <ArrowUpRight size={18} className="mr-1" /> 
              Voir les nouvelles annonces
            </Link>
          </div>
        </div>
        
        {error && (
          <Alert 
            message={error} 
            type="error" 
            onClose={() => setError('')} 
          />
        )}
        
        {success && (
          <Alert 
            message={success} 
            type="success" 
            onClose={() => setSuccess('')} 
          />
        )}
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-full flex items-center ${activeTab === 'all' ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('all')}
                >
                  <Filter size={14} className="mr-1" />
                  Toutes ({candidatures.length})
                </button>
                <button
                  className={`px-4 py-2 ml-2 text-sm font-medium rounded-full flex items-center ${activeTab === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('pending')}
                >
                  <Clock size={14} className="mr-1" />
                  En attente ({candidatures.filter(c => c.statut === 'En attente').length})
                </button>
                <button
                  className={`px-4 py-2 ml-2 text-sm font-medium rounded-full flex items-center ${activeTab === 'accepted' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('accepted')}
                >
                  <CheckCircle size={14} className="mr-1" />
                  Acceptées ({candidatures.filter(c => c.statut === 'Accepte').length})
                </button>
                <button
                  className={`px-4 py-2 ml-2 text-sm font-medium rounded-full flex items-center ${activeTab === 'rejected' ? 'bg-red-100 text-red-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('rejected')}
                >
                  <XCircle size={14} className="mr-1" />
                  Refusées ({candidatures.filter(c => c.statut === 'Refuse').length})
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher une candidature..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {filteredCandidatures.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entreprise
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCandidatures.map(candidature => (
                    <tr 
                      key={candidature.id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-700">
                            <FileText size={18} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {candidature.objet}
                            </div>
                            <div className="text-sm text-gray-500">
                              {candidature.annonce?.title || 'Annonce non disponible'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building size={14} className="mr-2 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {candidature.annonce?.recruteur?.name || 'Non spécifié'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          {formatDate(candidature.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(candidature.statut)}`}>
                          {getStatusIcon(candidature.statut)}
                          {candidature.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleViewDetails(candidature)}
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-md transition-colors"
                          >
                            <Eye size={16} className="mr-1" />
                            Détails
                          </button>
                          
                          {candidature.statut === 'En attente' && (
                            <button
                              onClick={() => handleDeleteClick(candidature.id)}
                              className="inline-flex items-center text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-md transition-colors"
                            >
                              <Trash2 size={16} className="mr-1" />
                              Supprimer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-purple-100 mb-4">
                <Briefcase size={32} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature trouvée</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchTerm 
                  ? "Aucune candidature ne correspond à votre recherche. Essayez avec d'autres termes." 
                  : "Vous n'avez pas encore postulé à des offres d'emploi. Découvrez les annonces disponibles."}
              </p>
              <Link to="/">
                <Button variant="primary" className="inline-flex items-center px-4 py-2">
                  <ArrowUpRight size={18} className="mr-2" />
                  Découvrir les annonces
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {selectedCandidature && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">

            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-4 px-6 rounded-t-xl flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                Détails de la candidature
              </h3>
              <button 
                onClick={handleCloseDetails}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedCandidature.objet}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${getStatusBadgeClass(selectedCandidature.statut)}`}>
                    {getStatusIcon(selectedCandidature.statut)}
                    {selectedCandidature.statut}
                  </span>
                </div>
                <div className="mt-2 md:mt-0 text-sm text-gray-500">
                  Envoyée le {formatDate(selectedCandidature.created_at)}
                </div>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <Briefcase size={18} className="mr-2 text-purple-700" />
                  Informations de l'annonce
                </h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Titre de l'annonce</p>
                      <p className="font-medium">{selectedCandidature.annonce?.title || 'Non disponible'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Entreprise</p>
                      <p className="font-medium">{selectedCandidature.annonce?.recruteur?.name || 'Non disponible'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type de contrat</p>
                      <p className="font-medium">{selectedCandidature.annonce?.type || 'Non spécifié'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <FileText size={18} className="mr-2 text-purple-700" />
                  Votre lettre de motivation
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="whitespace-pre-line text-gray-700">{selectedCandidature.lettre}</p>
                </div>
              </div>
              
              {selectedCandidature.document && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                    <FileText size={18} className="mr-2 text-purple-700" />
                    Document joint
                  </h4>
                  <a 
                    href={`http://localhost/storage/${selectedCandidature.document}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-purple-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Download size={18} className="mr-2" />
                    Télécharger le document
                  </a>
                </div>
              )}
              
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <Button 
                  variant="secondary"
                  onClick={handleCloseDetails}
                  className="inline-flex items-center"
                >
                  <X size={16} className="mr-2" />
                  Fermer
                </Button>
                
                {selectedCandidature.statut === 'En attente' && (
                  <Button 
                    variant="danger"
                    onClick={() => handleDeleteClick(selectedCandidature.id)}
                    className="inline-flex items-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Supprimer cette candidature
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center mb-4 text-red-600">
              <AlertCircle size={24} className="mr-2" />
              <h3 className="text-xl font-bold">Confirmer la suppression</h3>
            </div>
            <p className="mb-6 text-gray-600">Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-4">
              <Button 
                variant="secondary" 
                onClick={handleCancelDelete}
                className="inline-flex items-center"
              >
                <X size={16} className="mr-2" />
                Annuler
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleConfirmDelete(confirmDelete)}
                className="inline-flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MesCandidatures;