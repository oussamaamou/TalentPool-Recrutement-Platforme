import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import annonceService from '../../services/annonceService';
import categorieService from '../../services/categorieService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const MesAnnonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {

        const annoncesResponse = await annonceService.getMesAnnonces();
        setAnnonces(annoncesResponse.data || []);
        
        const categoriesResponse = await categorieService.getCategories();
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        console.error('Error fetching annonces:', err);
        setError('Impossible de charger vos annonces');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleDeleteClick = (annonceId) => {
    setConfirmDelete(annonceId);
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };
  
  const handleConfirmDelete = async (annonceId) => {
    try {
      await annonceService.deleteAnnonce(annonceId);
      setAnnonces(annonces.filter(annonce => annonce.id !== annonceId));
      setSuccess('Annonce supprimée avec succès');
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting annonce:', err);
      setError('Échec de la suppression de l\'annonce');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mes Annonces</h1>
        <Link to="/recruteur/annonces/create">
          <Button variant="primary">
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
      
      {success && (
        <Alert 
          message={success} 
          type="success" 
          onClose={() => setSuccess('')} 
        />
      )}
      
      {annonces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {annonces.map(annonce => {

            const category = categories.find(cat => cat.id === annonce.categorie_id);
            
            const actions = (
              <>
                <Link to={`/recruteur/annonces/edit/${annonce.id}`} className="flex-1">
                  <Button variant="outline" fullWidth>Modifier</Button>
                </Link>
                <Link to={`/recruteur/annonces/${annonce.id}/candidatures`} className="flex-1 mx-2">
                  <Button variant="secondary" fullWidth>Candidatures</Button>
                </Link>
                <Button 
                  variant="danger" 
                  className="flex-1"
                  onClick={() => handleDeleteClick(annonce.id)}
                >
                  Supprimer
                </Button>
              </>
            );
            
            return (
              <div key={annonce.id}>
                <Card
                  title={annonce.title}
                  description={annonce.description}
                  thumbnail={annonce.thumbnail}
                  category={category ? category.name : ''}
                  date={annonce.created_at}
                  actions={actions}
                />
                
                {confirmDelete === annonce.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                      <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
                      <p className="mb-6">Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.</p>
                      <div className="flex justify-end space-x-4">
                        <Button variant="secondary" onClick={handleCancelDelete}>
                          Annuler
                        </Button>
                        <Button variant="danger" onClick={() => handleConfirmDelete(annonce.id)}>
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Aucune annonce trouvée</h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore créé d'annonces. Commencez par en créer une nouvelle !
          </p>
          <Link to="/recruteur/annonces/create">
            <Button variant="primary">
              Créer votre première annonce
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MesAnnonces;