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
    <div className="min-h-screen bg-gray-50">
      <div 
        className="relative h-96 md:h-screen md:max-h-[600px] w-full bg-cover bg-center mb-12"
        style={{
          backgroundImage: "url('https://pictures.latribune.fr/cdn-cgi/image/width=3840,format=auto,quality=80/622/950622.jpg?twic=v1/cover=1200x675')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-blue-900/70"></div>
        
        <div className="relative h-full flex items-center z-10">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                Trouvez votre emploi idéal
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-10 font-light">
                Explorez notre plateforme pour découvrir les meilleures opportunités professionnelles
              </p>
              
              {!user && (
                <div className="flex flex-wrap gap-4 mt-2">
                  <Link to="/register">
                    <Button 
                      variant="primary" 
                      className="text-purple-900 bg-white hover:bg-gray-100 hover:text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Créer un compte
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-medium transition-all duration-300"
                    >
                      Se connecter
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-16">
        {error && (
          <Alert 
            message={error} 
            type="error" 
            onClose={() => setError('')} 
            className="mb-8"
          />
        )}
        
        <div className="bg-white p-6 rounded-xl shadow-lg mb-12 transform transition-all hover:shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Rechercher une annonce..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
            
            <div className="md:w-1/3">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Les Annonces publiées</h2>
          <div className="h-1 w-20 bg-purple-600 rounded-full mb-8"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-700"></div>
          </div>
        ) : filteredAnnonces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-xl text-gray-600 mt-4">Aucune annonce trouvée</p>
            <p className="text-gray-500 mt-2">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;