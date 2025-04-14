import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

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
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-purple-800">Mon Profil</h2>
        
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
        
        <div className="bg-purple-50 p-4 rounded-lg mb-6">
          <p className="text-gray-700">
            <span className="font-medium">Rôle:</span> {user?.role}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Changer mon mot de passe</h3>
          <p className="text-gray-600 mb-4">Laissez ces champs vides si vous ne souhaitez pas modifier votre mot de passe.</p>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              minLength="8"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password_confirmation" className="block text-gray-700 font-medium mb-2">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <Button 
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mise à jour en cours...
              </span>
            ) : 'Mettre à jour mon profil'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;