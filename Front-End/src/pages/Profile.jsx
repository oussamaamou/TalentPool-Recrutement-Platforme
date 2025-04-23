import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { User, Mail, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: ''
  });
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.password || formData.password_confirmation) {
      if (formData.password !== formData.password_confirmation) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      
      if (formData.password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        return;
      }
    }
    
    const updatedData = {};
    if (formData.name !== user.name) updatedData.name = formData.name;
    if (formData.email !== user.email) updatedData.email = formData.email;
    if (formData.password) {
      updatedData.password = formData.password;
      updatedData.password_confirmation = formData.password_confirmation;
    }
    
    if (Object.keys(updatedData).length === 0) {
      setSuccess('Aucune modification n\'a été effectuée');
      return;
    }
    
    setLoading(true);
    
    try {
      await updateProfile(updatedData);
      setSuccess('Profil mis à jour avec succès!');
      
      setFormData({
        ...formData,
        password: '',
        password_confirmation: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };
  
  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-3xl font-bold text-purple-800 flex items-center">
            <span className="bg-purple-100 p-2 rounded-full mr-3">
              <User size={24} className="text-purple-600" />
            </span>
            Mon Profil
          </h2>
          
          <div className={`px-4 py-1 rounded-full border ${getRoleColor(user?.role)}`}>
            {user?.role || 'Utilisateur'}
          </div>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2 flex items-center">
                  <User size={16} className="mr-2 text-purple-600" />
                  Nom complet
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2 flex items-center">
                  <Mail size={16} className="mr-2 text-purple-600" />
                  Adresse email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="pb-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                  <Lock size={18} className="mr-2 text-purple-600" />
                  Changer mon mot de passe
                </h3>
                <p className="text-gray-500 text-sm">Laissez ces champs vides si vous ne souhaitez pas modifier votre mot de passe.</p>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all pr-10"
                    minLength="8"
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="password_confirmation" className="block text-gray-700 font-medium mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all pr-10"
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <Button 
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex items-center justify-center px-6 py-3"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mise à jour en cours...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save size={18} className="mr-2" />
                  Mettre à jour mon profil
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;