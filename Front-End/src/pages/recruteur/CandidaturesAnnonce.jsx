import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import annonceService from '../../services/annonceService';
import candidatureService from '../../services/candidatureService';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { 
  Briefcase, Users, Clock, CheckCircle, XCircle, AlertCircle, 
  Download, X, Edit, User, Mail, Calendar, FileText, Eye
} from 'lucide-react';

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
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Refuse':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'En attente':
      default:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepte':
        return <CheckCircle size={14} className="mr-1" />;
      case 'Refuse':
        return <XCircle size={14} className="mr-1" />;
      case 'En attente':
      default:
        return <Clock size={14} className="mr-1" />;
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      {annonce && (
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
                <Briefcase size={24} className="text-purple-600 mr-3" />
                Candidatures
              </h1>
              <div className="text-sm text-gray-500">
                Gérez les candidatures pour cette annonce
              </div>
            </div>
            <Link 
              to={`/recruteur/annonces/edit/${annonce.id}`} 
              className="inline-flex items-center text-sm font-medium text-purple-700 hover:text-purple-900 bg-purple-50 px-3 py-2 rounded-lg transition-colors"
            >
              <Edit size={16} className="mr-2" />
              Modifier l'annonce
            </Link>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-bold text-purple-800">{annonce.title}</h2>
            <p className="text-gray-600 mt-2">
              {annonce.description.length > 200 
                ? annonce.description.substring(0, 200) + '...' 
                : annonce.description}
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <Alert 
          message={error} 
          type="error" 
          onClose={() => setError('')}
          icon={<AlertCircle size={18} />}
        />
      )}
      
      {success && (
        <Alert 
          message={success} 
          type="success" 
          onClose={() => setSuccess('')}
          icon={<CheckCircle size={18} />}
        />
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b px-4">
          <button
            className={`flex items-center px-4 py-4 text-sm font-medium ${activeTab === 'all' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-600 hover:text-purple-700'}`}
            onClick={() => setActiveTab('all')}
          >
            <Users size={16} className="mr-2" />
            Toutes ({candidatures.length})
          </button>
          <button
            className={`flex items-center px-4 py-4 text-sm font-medium ${activeTab === 'pending' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-600 hover:text-purple-700'}`}
            onClick={() => setActiveTab('pending')}
          >
            <Clock size={16} className="mr-2" />
            En attente ({candidatures.filter(c => c.statut === 'En attente').length})
          </button>
          <button
            className={`flex items-center px-4 py-4 text-sm font-medium ${activeTab === 'accepted' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-600 hover:text-purple-700'}`}
            onClick={() => setActiveTab('accepted')}
          >
            <CheckCircle size={16} className="mr-2" />
            Acceptées ({candidatures.filter(c => c.statut === 'Accepte').length})
          </button>
          <button
            className={`flex items-center px-4 py-4 text-sm font-medium ${activeTab === 'rejected' ? 'text-purple-700 border-b-2 border-purple-700' : 'text-gray-600 hover:text-purple-700'}`}
            onClick={() => setActiveTab('rejected')}
          >
            <XCircle size={16} className="mr-2" />
            Refusées ({candidatures.filter(c => c.statut === 'Refuse').length})
          </button>
        </div>
        
        {filteredCandidatures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredCandidatures.map(candidature => (
              <div 
                key={candidature.id} 
                className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 hover:border-purple-200 hover:shadow-md cursor-pointer transition duration-200"
                onClick={() => setSelectedCandidature(candidature)}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-800">{candidature.objet}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusBadgeClass(candidature.statut)}`}>
                    {getStatusIcon(candidature.statut)}
                    {candidature.statut}
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <User size={16} className="text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    {candidature.candidat?.name || 'Candidat'}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full p-2 mr-3">
                    <Calendar size={16} className="text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(candidature.created_at)}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-right">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="inline-flex items-center text-sm"
                  >
                    <Eye size={14} className="mr-1" />
                    Voir détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-gray-500" />
            </div>
            <p className="text-gray-500 font-medium">Aucune candidature trouvée</p>
            <p className="text-gray-400 text-sm mt-1">
              Les candidatures pour cette annonce apparaîtront ici
            </p>
          </div>
        )}
      </div>
      
      {selectedCandidature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  Détails de la candidature
                </h3>
                <button 
                  onClick={() => setSelectedCandidature(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {selectedCandidature.objet}
                    </h3>
                    <span className={`text-xs px-3 py-1 rounded-full mt-2 inline-flex items-center ${getStatusBadgeClass(selectedCandidature.statut)}`}>
                      {getStatusIcon(selectedCandidature.statut)}
                      {selectedCandidature.statut}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-xl mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <User size={18} className="text-purple-600 mr-2" />
                    Informations du candidat
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="w-6 text-gray-500 flex justify-center">
                        <User size={16} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-gray-500">Nom</div>
                        <div className="font-medium">{selectedCandidature.candidat?.name || 'Non disponible'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-6 text-gray-500 flex justify-center">
                        <Mail size={16} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium">{selectedCandidature.candidat?.email || 'Non disponible'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center md:col-span-2">
                      <div className="w-6 text-gray-500 flex justify-center">
                        <Calendar size={16} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-gray-500">Date de candidature</div>
                        <div className="font-medium">{formatDate(selectedCandidature.created_at)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                    <FileText size={18} className="text-purple-600 mr-2" />
                    Lettre de motivation
                  </h4>
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="whitespace-pre-line">{selectedCandidature.lettre}</p>
                  </div>
                </div>
                
                {selectedCandidature.document && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                      <Download size={18} className="text-purple-600 mr-2" />
                      Document joint
                    </h4>
                    <a 
                      href={`http://localhost/storage/${selectedCandidature.document}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <Download size={16} className="mr-2" />
                      Télécharger le document
                    </a>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Mettre à jour le statut</h4>
                  <div className="flex flex-wrap gap-4">
                    {selectedCandidature.statut !== 'En attente' && (
                      <Button 
                        variant="secondary"
                        onClick={() => handleUpdateStatus(selectedCandidature.id, 'En attente')}
                        className="inline-flex items-center"
                      >
                        <Clock size={16} className="mr-2" />
                        Marquer comme en attente
                      </Button>
                    )}
                    
                    {selectedCandidature.statut !== 'Accepte' && (
                      <Button 
                        variant="success"
                        onClick={() => handleUpdateStatus(selectedCandidature.id, 'Accepte')}
                        className="inline-flex items-center"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Accepter la candidature
                      </Button>
                    )}
                    
                    {selectedCandidature.statut !== 'Refuse' && (
                      <Button 
                        variant="danger"
                        onClick={() => handleUpdateStatus(selectedCandidature.id, 'Refuse')}
                        className="inline-flex items-center"
                      >
                        <XCircle size={16} className="mr-2" />
                        Refuser la candidature
                      </Button>
                    )}
                  </div>
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