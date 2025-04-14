import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  
  const filteredCandidatures = candidatures.filter(candidature => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return candidature.statut === 'En attente';
    if (activeTab === 'accepted') return candidature.statut === 'Accepte';
    if (activeTab === 'rejected') return candidature.statut === 'Refuse';
    return true;
  });
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Accepte':
        return 'bg-green-100 text-green-800';
      case 'Refuse':
        return 'bg-red-100 text-red-800';
      case 'En attente':
      default:
        return 'bg-yellow-100 text-yellow-800';
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
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes Candidatures</h1>
      
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
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">

        <div className="flex border-b">
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'all' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-700' : 'text-gray-600 hover:text-purple-700'}`}
            onClick={() => setActiveTab('all')}
          >
            Toutes ({candidatures.length})
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'pending' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-700' : 'text-gray-600 hover:text-purple-700'}`}
            onClick={() => setActiveTab('pending')}
          >
            En attente ({candidatures.filter(c => c.statut === 'En attente').length})
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'accepted' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-700' : 'text-gray-600 hover:text-purple-700'}`}
            onClick={() => setActiveTab('accepted')}
          >
            Acceptées ({candidatures.filter(c => c.statut === 'Accepte').length})
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium ${activeTab === 'rejected' ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-700' : 'text-gray-600 hover:text-purple-700'}`}
            onClick={() => setActiveTab('rejected')}
          >
            Refusées ({candidatures.filter(c => c.statut === 'Refuse').length})
          </button>
        </div>
        
        {filteredCandidatures.length > 0 ? (
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="w-full h-16 border-b border-gray-200">
                    <th className="text-left pl-4 pr-2 text-gray-600">Objet</th>
                    <th className="text-left px-2 text-gray-600">Annonce</th>
                    <th className="text-left px-2 text-gray-600">Date</th>
                    <th className="text-left px-2 text-gray-600">Statut</th>
                    <th className="text-right pr-4 text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidatures.map(candidature => (
                    <tr 
                      key={candidature.id} 
                      className="h-16 border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="pl-4 pr-2">
                        <p className="text-gray-800 font-medium">{candidature.objet}</p>
                      </td>
                      <td className="px-2">
                        <p className="text-gray-800">{candidature.annonce?.title || 'Annonce'}</p>
                      </td>
                      <td className="px-2">
                        <p className="text-gray-600 text-sm">
                          {new Date(candidature.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-2">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeClass(candidature.statut)}`}>
                          {candidature.statut}
                        </span>
                      </td>
                      <td className="pr-4">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="secondary" 
                            className="text-sm py-1"
                            onClick={() => handleViewDetails(candidature)}
                          >
                            Détails
                          </Button>
                          {candidature.statut === 'En attente' && (
                            <Button 
                              variant="danger" 
                              className="text-sm py-1"
                              onClick={() => handleDeleteClick(candidature.id)}
                            >
                              Supprimer
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune candidature trouvée</p>
            <Link to="/" className="inline-block mt-4">
              <Button variant="primary">
                Découvrir les annonces
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      {selectedCandidature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedCandidature.objet}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded mt-2 inline-block ${getStatusBadgeClass(selectedCandidature.statut)}`}>
                    {selectedCandidature.statut}
                  </span>
                </div>
                <button 
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="text-lg font-medium text-gray-800 mb-2">Informations de l'annonce</h4>
                <p><strong>Titre:</strong> {selectedCandidature.annonce?.title || 'Non disponible'}</p>
                <p><strong>Recruteur:</strong> {selectedCandidature.annonce?.recruteur?.name || 'Non disponible'}</p>
                <p><strong>Date de candidature:</strong> {new Date(selectedCandidature.created_at).toLocaleDateString()}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-800 mb-2">Votre lettre de motivation</h4>
                <div className="bg-white border rounded-lg p-4">
                  <p className="whitespace-pre-line">{selectedCandidature.lettre}</p>
                </div>
              </div>
              
              {selectedCandidature.document && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">Document joint</h4>
                  <a 
                    href={`http://localhost/storage/${selectedCandidature.document}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center text-purple-700 hover:text-purple-900"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                    </svg>
                    Télécharger le document
                  </a>
                </div>
              )}
              
              <div className="flex justify-end gap-4">
                <Button 
                  variant="secondary"
                  onClick={handleCloseDetails}
                >
                  Fermer
                </Button>
                
                {selectedCandidature.statut === 'En attente' && (
                  <Button 
                    variant="danger"
                    onClick={() => handleDeleteClick(selectedCandidature.id)}
                  >
                    Supprimer cette candidature
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible.</p>
            <div className="flex justify-end space-x-4">
              <Button variant="secondary" onClick={handleCancelDelete}>
                Annuler
              </Button>
              <Button variant="danger" onClick={() => handleConfirmDelete(confirmDelete)}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesCandidatures;