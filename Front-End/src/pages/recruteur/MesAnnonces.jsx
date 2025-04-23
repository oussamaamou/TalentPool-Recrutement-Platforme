import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import annonceService from '../../services/annonceService';
import categorieService from '../../services/categorieService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { 
  Plus, Edit, Users, Trash2, AlertCircle, CheckCircle, 
  FileText, Calendar, Search, Tag, Filter, ChevronDown
} from 'lucide-react';

const MesAnnonces = () => {
  const [annonces, setAnnonces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
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

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setSortBy('newest');
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredAnnonces = annonces
    .filter(annonce => {
      const searchMatch = searchTerm === '' || 
        annonce.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        annonce.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoryMatch = filterCategory === '' || annonce.categorie_id.toString() === filterCategory;
      
      return searchMatch && categoryMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Annonces</h1>
          <p className="text-gray-500">Gérez vos offres d'emploi et suivez les candidatures</p>
        </div>
        <Link to="/recruteur/annonces/create" className="mt-4 md:mt-0">
          <Button variant="primary" className="shadow-md hover:shadow-lg transition-shadow">
            <span className="flex items-center">
              <Plus size={18} className="mr-2" />
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="relative w-full md:w-auto mb-4 md:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une annonce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm font-medium text-gray-700 hover:text-purple-700"
          >
            <Filter size={16} className="mr-2" />
            Filtres et tri
            <ChevronDown size={16} className={`ml-1 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Tag size={14} className="mr-1" />
                Catégorie
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar size={14} className="mr-1" />
                Trier par
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Plus récentes</option>
                <option value="oldest">Plus anciennes</option>
                <option value="alphabetical">Ordre alphabétique</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="text-sm text-purple-700 hover:text-purple-900 font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </div>
      
      {annonces.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-gray-500">
            {filteredAnnonces.length} annonce(s) trouvée(s)
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnnonces.map(annonce => {
              const category = categories.find(cat => cat.id === annonce.categorie_id);
              
              const actions = (
                <div className="flex justify-between w-full mt-4 pt-4 border-t border-gray-100">
                  <Link to={`/recruteur/annonces/edit/${annonce.id}`} className="flex-1">
                    <Button variant="outline" fullWidth className="flex items-center justify-center">
                      <Edit size={16} className="mr-2" />
                      Modifier
                    </Button>
                  </Link>
                  <Link to={`/recruteur/annonces/${annonce.id}/candidatures`} className="flex-1 mx-2">
                    <Button variant="secondary" fullWidth className="flex items-center justify-center">
                      <Users size={16} className="mr-2" />
                      Candidatures
                    </Button>
                  </Link>
                  <div className="flex-1">
                    <Button 
                      variant="danger" 
                      fullWidth
                      onClick={() => handleDeleteClick(annonce.id)}
                      className="flex items-center justify-center"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              );
              
              const metadata = (
                <div className="flex flex-col space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Tag size={14} className="text-purple-600 mr-2" />
                    <span className="text-gray-600">{category ? category.name : 'Sans catégorie'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className="text-purple-600 mr-2" />
                    <span className="text-gray-600">Publiée le {formatDate(annonce.created_at)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FileText size={14} className="text-purple-600 mr-2" />
                    <span className="text-gray-600">ID: {annonce.id}</span>
                  </div>
                </div>
              );
              
              return (
                <div key={annonce.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-5">
                    {annonce.thumbnail && (
                      <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 h-40 flex items-center justify-center">
                        <img 
                          src={annonce.thumbnail} 
                          alt={annonce.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{annonce.title}</h3>
                    
                    {metadata}
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {annonce.description}
                    </p>
                    
                    {actions}
                  </div>
                  
                  {confirmDelete === annonce.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
                        <div className="flex items-center mb-4 text-red-500">
                          <AlertCircle size={24} className="mr-3" />
                          <h3 className="text-xl font-bold">Confirmer la suppression</h3>
                        </div>
                        <p className="mb-6 text-gray-600">
                          Êtes-vous sûr de vouloir supprimer l'annonce <span className="font-medium">"{annonce.title}"</span> ? Cette action est irréversible.
                        </p>
                        <div className="flex justify-end space-x-4">
                          <Button 
                            variant="secondary" 
                            onClick={handleCancelDelete}
                            className="flex items-center"
                          >
                            Annuler
                          </Button>
                          <Button 
                            variant="danger" 
                            onClick={() => handleConfirmDelete(annonce.id)}
                            className="flex items-center"
                          >
                            <Trash2 size={16} className="mr-2" />
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
        </>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="bg-purple-50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <FileText size={32} className="text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Aucune annonce trouvée</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Vous n'avez pas encore créé d'annonces. Commencez dès maintenant pour attirer les meilleurs talents !
          </p>
          <Link to="/recruteur/annonces/create">
            <Button variant="primary" className="px-6 py-3 shadow-md hover:shadow-lg transition-shadow">
              <span className="flex items-center">
                <Plus size={18} className="mr-2" />
                Créer votre première annonce
              </span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MesAnnonces;