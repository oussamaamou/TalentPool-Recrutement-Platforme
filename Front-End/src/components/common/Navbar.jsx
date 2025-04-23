import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <img src="https://cdn-icons-png.flaticon.com/512/1462/1462464.png" alt="Logo du Platforme" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Talent Pool</span>
          </Link>
          
          {/* Mobile Menu */}
          <button 
            className="md:hidden flex items-center focus:outline-none" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6 transition-all duration-300 ease-in-out" 
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
          
          {/* Desktop menu button */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-purple-200 transition-colors duration-200 font-medium">Accueil</Link>
            
            {user ? (
              <>
                {/* Admin Links */}
                {user.role === 'Administrateur' && (
                  <Link to="/admin/dashboard" className="text-white hover:text-purple-200 transition-colors duration-200 font-medium">Dashboard</Link>
                )}
                
                {/* Candidat Links */}
                {user.role === 'Candidat' && (
                  <>
                    <Link to="/candidat/dashboard" className="text-white hover:text-purple-200 transition-colors duration-200 font-medium">Dashboard</Link>
                    <Link to="/candidat/candidatures" className="text-white hover:text-purple-200 transition-colors duration-200 font-medium">Mes Candidatures</Link>
                  </>
                )}
                
                {/* Recruteur Links */}
                {user.role === 'Recruteur' && (
                  <>
                    <Link to="/recruteur/dashboard" className="text-white hover:text-purple-200 transition-colors duration-200 font-medium">Dashboard</Link>
                    <Link to="/recruteur/annonces" className="text-white hover:text-purple-200 transition-colors duration-200 font-medium">Mes Annonces</Link>
                  </>
                )}
                
                {/* Profile dropdown*/}
                <div className="relative" ref={profileMenuRef}>
                  <button 
                    className="flex items-center space-x-1 bg-purple-700/40 hover:bg-purple-700/60 px-3 py-2 rounded-full transition-all duration-200"
                    onClick={toggleProfileMenu}
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-300 text-purple-800 flex items-center justify-center font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{user.name}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10 transform transition-all duration-200 origin-top-right">
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-700 rounded-md mx-1 my-1 transition-colors duration-200">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                          <span>Profile</span>
                        </div>
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-700 rounded-md mx-1 my-1 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                          </svg>
                          <span>Déconnexion</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-purple-200 transition-colors duration-200 font-medium">Connexion</Link>
                <Link to="/register" className="px-4 py-2 rounded-md bg-white text-purple-700 hover:bg-purple-100 transition-colors duration-200 font-medium shadow-md hover:shadow-lg">Inscription</Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-purple-500/50 animate-fadeIn">
            <Link to="/" className="block py-2 px-3 rounded-md hover:bg-purple-700/40 transition-colors duration-200">Accueil</Link>
            
            {user ? (
              <>
                {/* Admin Links */}
                {user.role === 'Administrateur' && (
                  <Link to="/admin/dashboard" className="block py-2 px-3 rounded-md hover:bg-purple-700/40 transition-colors duration-200">Dashboard</Link>
                )}
                
                {/* Candidat Links */}
                {user.role === 'Candidat' && (
                  <>
                    <Link to="/candidat/dashboard" className="block py-2 px-3 rounded-md hover:bg-purple-700/40 transition-colors duration-200">Dashboard</Link>
                    <Link to="/candidat/candidatures" className="block py-2 px-3 rounded-md hover:bg-purple-700/40 transition-colors duration-200">Mes Candidatures</Link>
                  </>
                )}
                
                {/* Recruteur Links */}
                {user.role === 'Recruteur' && (
                  <>
                    <Link to="/recruteur/dashboard" className="block py-2 px-3 rounded-md hover:bg-purple-700/40 transition-colors duration-200">Dashboard</Link>
                    <Link to="/recruteur/annonces" className="block py-2 px-3 rounded-md hover:bg-purple-700/40 transition-colors duration-200">Mes Annonces</Link>
                  </>
                )}
                
                <div className="mt-2 pt-2 border-t border-purple-500/50">
                  <Link to="/profile" className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-purple-700/40 transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Profile</span>
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center space-x-2 w-full text-left py-2 px-3 rounded-md hover:bg-purple-700/40 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span>Déconnexion</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 px-3 rounded-md hover:bg-purple-700/40 transition-colors duration-200">Connexion</Link>
                <Link to="/register" className="block py-2 px-3 rounded-md hover:bg-purple-700/40 transition-colors duration-200">Inscription</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;