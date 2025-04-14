import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import annonceService from '../services/annonceService';
import categorieService from '../services/categorieService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [annonces, setAnnonces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Annonces
        const annonceResponse = await annonceService.getAnnonces();
        setAnnonces(annonceResponse.data || []);
        
        // Fetch Categories
        const categorieResponse = await categorieService.getCategories();
        setCategories(categorieResponse.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Impossible de charger les annonces. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const filteredAnnonces = annonces.filter(annonce => {
    const matchesCategory = !selectedCategory || annonce.categorie_id.toString() === selectedCategory;
    const matchesSearch = !searchTerm || 
      annonce.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      annonce.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesCategory && matchesSearch;
  });
  
  return (
    <div>
      <div className="bg-purple-700 text-white py-12 px-4 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Trouvez votre emploi idéal</h1>
          <p className="text-xl mb-8">
            Explorez notre plateforme pour découvrir les meilleures opportunités professionnelles
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button variant="outline" className="bg-white hover:bg-gray-100 border-white text-purple-700 hover:text-purple-800">
                  Créer un compte
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-700">
                  Se connecter
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <Alert 
          message={error} 
          type="error" 
          onClose={() => setError('')} 
        />
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher une annonce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="md:w-1/3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
        </div>
      ) : filteredAnnonces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnonces.map(annonce => {

            const category = categories.find(cat => cat.id === annonce.categorie_id);
            return (
              <Card
                key={annonce.id}
                title={annonce.title}
                description={annonce.description}
                thumbnail={annonce.thumbnail}
                category={category ? category.name : ''}
                date={annonce.created_at}
                link={
                  user && user.role === 'Candidat' 
                    ? `/candidat/postuler/${annonce.id}` 
                    : `/annonces/${annonce.id}`
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Aucune annonce trouvée</p>
        </div>
      )}
    </div>
  );
};

export default Home;