import { useState, useEffect } from 'react';
import statistiqueService from '../../services/statistiqueService';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users_by_role: {},
    annonce_count: 0,
    candidature_count: 0,
    candidatures_by_statut: {},
    top_recruteurs: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statistiqueService.getGlobalStats();
        setStats(response);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Impossible de charger les statistiques');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const totalUsers = Object.values(stats.users_by_role).reduce((acc, val) => acc + val, 0);
  
  const calculatePercentage = (value, total) => {
    if (!value || !total) return 0;
    return Math.round((value / total) * 100);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord administrateur</h1>
      
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-700 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Annonces</p>
              <p className="text-2xl font-bold text-gray-800">{stats.annonce_count}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-700 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Candidatures</p>
              <p className="text-2xl font-bold text-gray-800">{stats.candidature_count}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-700 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Taux d'acceptation</p>
              <p className="text-2xl font-bold text-gray-800">
                {calculatePercentage(
                  stats.candidatures_by_statut?.Accepte || 0,
                  stats.candidature_count
                )}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Répartition des utilisateurs</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600">Candidats</span>
              <div className="w-2/3">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full" 
                    style={{ width: `${calculatePercentage(stats.users_by_role?.Candidat || 0, totalUsers)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-600">
                    {stats.users_by_role?.Candidat || 0}
                  </span>
                  <span className="text-sm text-gray-600">
                    {calculatePercentage(stats.users_by_role?.Candidat || 0, totalUsers)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600">Recruteurs</span>
              <div className="w-2/3">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-purple-600 h-4 rounded-full" 
                    style={{ width: `${calculatePercentage(stats.users_by_role?.Recruteur || 0, totalUsers)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-600">
                    {stats.users_by_role?.Recruteur || 0}
                  </span>
                  <span className="text-sm text-gray-600">
                    {calculatePercentage(stats.users_by_role?.Recruteur || 0, totalUsers)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="w-1/3 text-gray-600">Administrateurs</span>
              <div className="w-2/3">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-yellow-600 h-4 rounded-full" 
                    style={{ width: `${calculatePercentage(stats.users_by_role?.Administrateur || 0, totalUsers)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-600">
                    {stats.users_by_role?.Administrateur || 0}
                  </span>
                  <span className="text-sm text-gray-600">
                    {calculatePercentage(stats.users_by_role?.Administrateur || 0, totalUsers)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top 5 Recruteurs</h2>
          
          {stats.top_recruteurs && stats.top_recruteurs.length > 0 ? (
            <div className="space-y-4">
              {stats.top_recruteurs.map((recruteur, index) => (
                <div key={recruteur.id} className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-700 rounded-full mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">{recruteur.name}</p>
                      <p className="text-gray-600">{recruteur.annonces_count} annonces</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ 
                          width: `${calculatePercentage(
                            recruteur.annonces_count,
                            stats.top_recruteurs[0]?.annonces_count || 1
                          )}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Aucun recruteur actif pour le moment.
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Statut des candidatures</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-block p-4 rounded-full bg-yellow-100 text-yellow-800 mb-2">
              <span className="text-2xl font-bold">
                {stats.candidatures_by_statut?.['En attente'] || 0}
              </span>
            </div>
            <p className="text-gray-600">En attente</p>
          </div>
          
          <div className="text-center">
            <div className="inline-block p-4 rounded-full bg-green-100 text-green-800 mb-2">
              <span className="text-2xl font-bold">
                {stats.candidatures_by_statut?.Accepte || 0}
              </span>
            </div>
            <p className="text-gray-600">Acceptées</p>
          </div>
          
          <div className="text-center">
            <div className="inline-block p-4 rounded-full bg-red-100 text-red-800 mb-2">
              <span className="text-2xl font-bold">
                {stats.candidatures_by_statut?.Refuse || 0}
              </span>
            </div>
            <p className="text-gray-600">Refusées</p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div
                className="bg-yellow-500 h-full"
                style={{ 
                  width: `${calculatePercentage(
                    stats.candidatures_by_statut?.['En attente'] || 0,
                    stats.candidature_count
                  )}%` 
                }}
              ></div>
              <div
                className="bg-green-500 h-full"
                style={{ 
                  width: `${calculatePercentage(
                    stats.candidatures_by_statut?.Accepte || 0,
                    stats.candidature_count
                  )}%` 
                }}
              ></div>
              <div
                className="bg-red-500 h-full"
                style={{ 
                  width: `${calculatePercentage(
                    stats.candidatures_by_statut?.Refuse || 0,
                    stats.candidature_count
                  )}%` 
                }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>En attente: {calculatePercentage(stats.candidatures_by_statut?.['En attente'] || 0, stats.candidature_count)}%</span>
            <span>Acceptées: {calculatePercentage(stats.candidatures_by_statut?.Accepte || 0, stats.candidature_count)}%</span>
            <span>Refusées: {calculatePercentage(stats.candidatures_by_statut?.Refuse || 0, stats.candidature_count)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;