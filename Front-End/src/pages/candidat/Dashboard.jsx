import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Building, 
  Calendar, 
  ChevronRight, 
  Bell, 
  TrendingUp,
  MapPin,
  ArrowRight,
  Search,
  User,
  ArrowUpRight
} from 'lucide-react';
import annonceService from '../../services/annonceService';
import candidatureService from '../../services/candidatureService';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { AuthContext } from '../../context/AuthContext';

const CandidatDashboard = () => {
  const [recentAnnonces, setRecentAnnonces] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const annoncesResponse = await annonceService.getAnnonces();
        setRecentAnnonces(annoncesResponse.data?.slice(0, 3) || []);
        
        const candidaturesResponse = await candidatureService.getCandidatures();
        setCandidatures(candidaturesResponse.data || []);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Impossible de charger les données du tableau de bord');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getCandidatureStats = () => {
    const stats = {
      total: candidatures.length,
      pending: candidatures.filter(c => c.statut === 'En attente').length,
      accepted: candidatures.filter(c => c.statut === 'Accepte').length,
      rejected: candidatures.filter(c => c.statut === 'Refuse').length
    };
    return stats;
  };
  
  const stats = getCandidatureStats();
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
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
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
        <p className="mt-4 text-purple-700 font-medium">Chargement du tableau de bord...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-12">
        {error && (
          <Alert 
            message={error} 
            type="error" 
            onClose={() => setError('')} 
          />
        )}
        
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-xl p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Bonjour, {user.name} 👋</h1>
                <p className="text-purple-100">
                  Voici un aperçu de vos candidatures et des opportunités qui pourraient vous intéresser.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link to="/">
                  <Button variant="secondary" className="bg-white text-purple-800 hover:bg-purple-50 inline-flex items-center px-4 py-2">
                    <Search size={16} className="mr-2" />
                    Chercher un emploi
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-700 mr-4">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total candidatures</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-700 mr-4">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">En attente</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-700 mr-4">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Acceptées</p>
                <p className="text-2xl font-bold text-gray-800">{stats.accepted}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-700 mr-4">
                <XCircle size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Refusées</p>
                <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <Briefcase className="mr-2" size={20} />
                  Dernières candidatures
                </h2>
                <Link to="/candidat/candidatures" className="text-purple-700 hover:text-purple-900 inline-flex items-center text-sm font-medium">
                  Voir toutes
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
              
              {candidatures.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {candidatures.slice(0, 5).map(candidature => (
                    <div key={candidature.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between">
                        <div className="flex-1 pr-4">
                          <h3 className="font-medium text-gray-800 mb-1 truncate">{candidature.objet}</h3>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Building size={14} className="mr-1 text-gray-400" />
                              {candidature.annonce?.recruteur?.name || 'Entreprise'}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Calendar size={14} className="mr-1 text-gray-400" />
                              {formatDate(candidature.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(candidature.statut)}`}>
                            {getStatusIcon(candidature.statut)}
                            {candidature.statut}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <Briefcase size={28} className="text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Pas encore de candidatures</h3>
                  <p className="mt-2 text-gray-500 max-w-md mx-auto mb-6">
                    Explorez les offres d'emploi disponibles et commencez à postuler pour suivre vos candidatures ici.
                  </p>
                  <Link to="/">
                    <Button variant="primary" className="inline-flex items-center px-4 py-2">
                      <Search size={16} className="mr-2" />
                      Découvrir les annonces
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <Bell className="mr-2" size={20} />
                  Annonces récentes
                </h2>
                <Link to="/" className="text-purple-700 hover:text-purple-900 inline-flex items-center text-sm font-medium">
                  Voir toutes
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
              
              {recentAnnonces.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentAnnonces.map(annonce => (
                    <div key={annonce.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <h3 className="font-medium text-gray-800 mb-1 flex items-start">
                        <span className="flex-1">{annonce.title}</span>
                        {annonce.is_urgent && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 ml-2">
                            Urgent
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Building size={14} className="mr-1 text-gray-400" />
                        {annonce.recruteur?.name || 'Entreprise'}
                        {annonce.location && (
                          <>
                            <span className="mx-2">•</span>
                            <MapPin size={14} className="mr-1 text-gray-400" />
                            {annonce.location}
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {annonce.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(annonce.created_at)}
                        </span>
                        <Link to={`/candidat/postuler/${annonce.id}`}>
                          <Button variant="outline" className="text-sm py-1 px-3 inline-flex items-center">
                            <ArrowUpRight size={14} className="mr-1" />
                            Postuler
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4">
                  <p className="text-gray-500">
                    Aucune annonce récente disponible.
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl shadow-sm p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-500 rounded-full p-2 text-white">
                  <TrendingUp size={18} />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-indigo-900 mb-1">Conseils pour réussir</h3>
                  <p className="text-sm text-indigo-800">
                    Personnalisez votre CV pour chaque candidature et incluez des mots-clés pertinents pour augmenter vos chances.
                  </p>
                  <a href="#" className="inline-flex items-center mt-3 text-sm font-medium text-indigo-700 hover:text-indigo-900">
                    Plus de conseils
                    <ChevronRight size={14} className="ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatDashboard;