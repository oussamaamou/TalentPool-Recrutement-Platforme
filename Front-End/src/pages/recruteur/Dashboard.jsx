import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import annonceService from '../../services/annonceService';
import statistiqueService from '../../services/statistiqueService';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const getTotalCandidatures = (stats) => {
  if (!stats) return 0;
  return Object.values(stats).reduce((acc, val) => acc + val, 0);
};

const calculatePercentage = (value, total) => {
  if (!value || !total) return 0;
  return Math.round((value / total) * 100);
};

const RecruteurDashboard = () => {
  
  const [stats, setStats] = useState({
    annonce_count: 0,
    candidature_stats: {},
    candidatures_by_annonce: {}
  });
  
  const [recentAnnonces, setRecentAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {

        const statsResponse = await statistiqueService.getRecruteurStats();
        setStats(statsResponse);
        
        const annoncesResponse = await annonceService.getMesAnnonces();
        setRecentAnnonces(annoncesResponse.data?.slice(0, 5) || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Impossible de charger les données du tableau de bord');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <Link to="/recruteur/annonces/create">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Créer une annonce
            </span>
          </Button>
        </Link>
      </div>
      
      {error && (
        <Alert 
          message={error} 
          type="error" 
          onClose={() => setError('')} 
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-700 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Annonces publiées</p>
              <p className="text-2xl font-bold text-gray-800">{stats.annonce_count}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-700 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Candidatures acceptées</p>
              <p className="text-2xl font-bold text-gray-800">{stats.candidature_stats?.Accepte || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-700 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">En attente</p>
              <p className="text-2xl font-bold text-gray-800">{stats.candidature_stats?.['En attente'] || 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Statut des candidatures</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-600 h-4 rounded-full" 
                  style={{ 
                    width: `${calculatePercentage(stats.candidature_stats?.Accepte, getTotalCandidatures(stats.candidature_stats))}%` 
                  }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600">
                Acceptées ({stats.candidature_stats?.Accepte || 0})
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-red-600 h-4 rounded-full" 
                  style={{ 
                    width: `${calculatePercentage(stats.candidature_stats?.Refuse, getTotalCandidatures(stats.candidature_stats))}%` 
                  }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600">
                Refusées ({stats.candidature_stats?.Refuse || 0})
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-yellow-500 h-4 rounded-full" 
                  style={{ 
                    width: `${calculatePercentage(stats.candidature_stats?.['En attente'], getTotalCandidatures(stats.candidature_stats))}%` 
                  }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600">
                En attente ({stats.candidature_stats?.['En attente'] || 0})
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Annonces récentes</h2>
            <Link to="/recruteur/annonces" className="text-purple-700 hover:text-purple-900 text-sm font-medium">
              Voir toutes
            </Link>
          </div>
          
          {recentAnnonces.length > 0 ? (
            <div className="divide-y">
              {recentAnnonces.map(annonce => (
                <div key={annonce.id} className="py-3">
                  <Link to={`/recruteur/annonces/${annonce.id}/candidatures`} className="block hover:bg-gray-50 p-2 -mx-2 rounded">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-800">{annonce.title}</h3>
                      <span className="text-gray-500 text-sm">
                        {new Date(annonce.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {annonce.description.length > 100 
                        ? annonce.description.substring(0, 100) + '...' 
                        : annonce.description}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Vous n'avez pas encore créé d'annonces.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruteurDashboard;