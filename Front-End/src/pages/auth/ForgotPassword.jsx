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
    <div className="max-w-md mx-auto my-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-6 px-8">
          <h2 className="text-3xl font-bold text-white">
            Mot de passe oublié
          </h2>
          <p className="text-purple-100 mt-2 text-sm">
            Nous vous enverrons un lien pour réinitialiser votre mot de passe
          </p>
        </div>
        
        <div className="p-8">
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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="email" className="block text-gray-700 font-medium">
                  Adresse email
                </label>
                <span className="text-xs text-gray-500">Requis</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="ahmed@gmail.com"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-offset-2 transition-all duration-200 font-medium text-base"
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
          
          <div className="mt-8 flex items-center justify-center">
            <Link to="/login" className="text-purple-600 hover:text-purple-800 font-medium flex items-center transition-colors duration-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;