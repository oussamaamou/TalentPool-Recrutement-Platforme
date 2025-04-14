import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-purple-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">JobConnect</h3>
            <p className="text-purple-200">
              Votre plateforme de mise en relation entre candidats et recruteurs.
              Trouvez votre prochain emploi ou votre prochain talent.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-purple-200 hover:text-white">Accueil</Link></li>
              <li><Link to="/login" className="text-purple-200 hover:text-white">Connexion</Link></li>
              <li><Link to="/register" className="text-purple-200 hover:text-white">Inscription</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-purple-200">
              Email: contact@jobconnect.com<br />
              Téléphone: +33 1 23 45 67 89<br />
              Adresse: 123 Rue de l'Emploi, 75000 Paris
            </p>
          </div>
        </div>
        
        <div className="border-t border-purple-700 mt-8 pt-6 text-center text-purple-300">
          <p>&copy; {currentYear} JobConnect. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;