import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);
  
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const response = await forgotPassword(email);
      setSuccess('Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception.');
      
      console.log('Reset token (for demo purposes):', response.token);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible d\'envoyer l\'email de réinitialisation');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-purple-800">
          Mot de passe oublié
        </h2>
        
        <p className="text-gray-600 mb-6 text-center">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
        
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
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Adresse email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <Button 
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </span>
            ) : 'Envoyer le lien de réinitialisation'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/login" className="text-purple-700 hover:text-purple-900">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;