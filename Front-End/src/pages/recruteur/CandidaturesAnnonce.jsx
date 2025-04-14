import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import annonceService from '../../services/annonceService';
import candidatureService from '../../services/candidatureService';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const CandidaturesAnnonce = () => {
  const { id } = useParams();
  
  const [annonce, setAnnonce] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const annonceResponse = await annonceService.getAnnonceById(id);
        setAnnonce(annonceResponse.data);
        
        const candidaturesResponse = await candidatureService.getCandidaturesByAnnonce(id);
        setCandidatures(candidaturesResponse);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleUpdateStatus = async (candidatureId, newStatus) => {
    try {
      await candidatureService.updateCandidatureStatus(candidatureId, newStatus);
      
      setCandidatures(prevCandidatures => 
        prevCandidatures.map(candidature => 
          candidature.id === candidatureId 
            ? { ...candidature, statut: newStatus } 
            : candidature
        )
      );
      
      setSuccess(`Statut mis à jour avec succès: ${newStatus}`);
      
      setSelectedCandidature(null);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Échec de la mise à jour du statut');
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
      {annonce && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Candidatures pour l'annonce</h1>
          <div className="bg-purple-50 p-4 rounded-lg mt-4">
            <h2 className="text-xl font-bold text-purple-800">{annonce.title}</h2>
            <p className="text-gray-600 mt-2">
              {annonce.description.length > 200 
                ? annonce.description.substring(0, 200) + '...' 
                : annonce.description}
            </p>
            <div className="mt-2">
              <Link to={`/recruteur/annonces/edit/${annonce.id}`} className="text-purple-700 hover:text-purple-900 text-sm font-medium">
                Modifier l'annonce
              </Link>
            </div>
          </div>
        </div>
      )}
      
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredCandidatures.map(candidature => (
              <div 
                key={candidature.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition"
                onClick={() => setSelectedCandidature(candidature)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">{candidature.objet}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeClass(candidature.statut)}`}>
                    {candidature.statut}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Par: {candidature.candidat?.name || 'Candidat'}
                </p>
                <p className="text-sm text-gray-600">
                  Soumise le: {new Date(candidature.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune candidature trouvée</p>
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
                  onClick={() => setSelectedCandidature(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="text-lg font-medium text-gray-800 mb-2">Informations du candidat</h4>
                <p><strong>Nom:</strong> {selectedCandidature.candidat?.name || 'Non disponible'}</p>
                <p><strong>Email:</strong> {selectedCandidature.candidat?.email || 'Non disponible'}</p>
                <p><strong>Date de candidature:</strong> {new Date(selectedCandidature.created_at).toLocaleDateString()}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-800 mb-2">Lettre de motivation</h4>
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
              
              <div className="border-t pt-4">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Mettre à jour le statut</h4>
                <div className="flex flex-wrap gap-4">
                  {selectedCandidature.statut !== 'En attente' && (
                    <Button 
                      variant="secondary"
                      onClick={() => handleUpdateStatus(selectedCandidature.id, 'En attente')}
                    >
                      Marquer comme en attente
                    </Button>
                  )}
                  
                  {selectedCandidature.statut !== 'Accepte' && (
                    <Button 
                      variant="success"
                      onClick={() => handleUpdateStatus(selectedCandidature.id, 'Accepte')}
                    >
                      Accepter la candidature
                    </Button>
                  )}
                  
                  {selectedCandidature.statut !== 'Refuse' && (
                    <Button 
                      variant="danger"
                      onClick={() => handleUpdateStatus(selectedCandidature.id, 'Refuse')}
                    >
                      Refuser la candidature
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidaturesAnnonce;