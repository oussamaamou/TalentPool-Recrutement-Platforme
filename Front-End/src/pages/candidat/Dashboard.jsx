import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import annonceService from '../../services/annonceService';
import candidatureService from '../../services/candidatureService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const CandidatDashboard = () => {
  const [recentAnnonces, setRecentAnnonces] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord</h1>
      
      {error && (
        <Alert 
          message={error} 
          type="error" 
          onClose={() => setError('')} 
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-700 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total candidatures</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
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
              <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
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
              <p className="text-gray-500 text-sm">Acceptées</p>
              <p className="text-2xl font-bold text-gray-800">{stats.accepted}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-700 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Refusées</p>
              <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Dernières candidatures</h2>
            <Link to="/candidat/candidatures" className="text-purple-700 hover:text-purple-900 text-sm font-medium">
              Voir toutes
            </Link>
          </div>
          
          {candidatures.length > 0 ? (
            <div className="divide-y">
              {candidatures.slice(0, 5).map(candidature => {
                const statusColor = candidature.statut === 'Accepte' ? 'bg-green-100 text-green-800' :
                                    candidature.statut === 'Refuse' ? 'bg-red-100 text-red-800' : 
                                    'bg-yellow-100 text-yellow-800';
                
                return (
                  <div key={candidature.id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">{candidature.objet}</h3>
                        <p className="text-sm text-gray-600">
                          Pour: {candidature.annonce?.title || 'Annonce'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>
                          {candidature.statut}
                        </span>
                        <span className="text-gray-500 text-sm mt-1">
                          {new Date(candidature.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Vous n'avez pas encore de candidatures.
            </p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Annonces récentes</h2>
            <Link to="/" className="text-purple-700 hover:text-purple-900 text-sm font-medium">
              Voir toutes
            </Link>
          </div>
          
          {recentAnnonces.length > 0 ? (
            <div className="space-y-4">
              {recentAnnonces.map(annonce => (
                <div key={annonce.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <h3 className="font-medium text-gray-800">{annonce.title}</h3>
                  <p className="text-sm text-gray-600 my-2">
                    {annonce.description.length > 100 
                      ? annonce.description.substring(0, 100) + '...' 
                      : annonce.description}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(annonce.created_at).toLocaleDateString()}
                    </span>
                    <Link to={`/candidat/postuler/${annonce.id}`}>
                      <Button variant="outline" className="text-sm py-1">
                        Postuler
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Aucune annonce récente.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidatDashboard;