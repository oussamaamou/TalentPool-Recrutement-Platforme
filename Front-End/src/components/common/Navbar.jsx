import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="bg-purple-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">JobConnect</Link>
          
          {/* Mobile Menu */}
          <button 
            className="md:hidden flex items-center" 
            onClick={toggleMenu}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              ></path>
            </svg>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-purple-200">Accueil</Link>
            
            {user ? (
              <>
                {/* Admin Links */}
                {user.role === 'Administrateur' && (
                  <Link to="/admin/dashboard" className="hover:text-purple-200">Dashboard</Link>
                )}
                
                {/* Candidat Links */}
                {user.role === 'Candidat' && (
                  <>
                    <Link to="/candidat/dashboard" className="hover:text-purple-200">Dashboard</Link>
                    <Link to="/candidat/candidatures" className="hover:text-purple-200">Mes Candidatures</Link>
                  </>
                )}
                
                {/* Recruteur Links */}
                {user.role === 'Recruteur' && (
                  <>
                    <Link to="/recruteur/dashboard" className="hover:text-purple-200">Dashboard</Link>
                    <Link to="/recruteur/annonces" className="hover:text-purple-200">Mes Annonces</Link>
                  </>
                )}
                
                <div className="relative group">
                  <button className="flex items-center hover:text-purple-200">
                    {user.name}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-purple-100">Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-800 hover:bg-purple-100">Déconnexion</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-purple-200">Connexion</Link>
                <Link to="/register" className="px-4 py-2 rounded bg-white text-purple-700 hover:bg-purple-100">Inscription</Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-600">
            <Link to="/" className="block py-2 hover:text-purple-200">Accueil</Link>
            
            {user ? (
              <>
                {/* Admin Links */}
                {user.role === 'Administrateur' && (
                  <Link to="/admin/dashboard" className="block py-2 hover:text-purple-200">Dashboard</Link>
                )}
                
                {/* Candidat Links */}
                {user.role === 'Candidat' && (
                  <>
                    <Link to="/candidat/dashboard" className="block py-2 hover:text-purple-200">Dashboard</Link>
                    <Link to="/candidat/candidatures" className="block py-2 hover:text-purple-200">Mes Candidatures</Link>
                  </>
                )}
                
                {/* Recruteur Links */}
                {user.role === 'Recruteur' && (
                  <>
                    <Link to="/recruteur/dashboard" className="block py-2 hover:text-purple-200">Dashboard</Link>
                    <Link to="/recruteur/annonces" className="block py-2 hover:text-purple-200">Mes Annonces</Link>
                  </>
                )}
                
                <Link to="/profile" className="block py-2 hover:text-purple-200">Profile</Link>
                <button onClick={handleLogout} className="block w-full text-left py-2 hover:text-purple-200">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-purple-200">Connexion</Link>
                <Link to="/register" className="block py-2 hover:text-purple-200">Inscription</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;