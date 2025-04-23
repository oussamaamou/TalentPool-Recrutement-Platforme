import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const menuItems = [
    { title: 'Emplois', path: '/jobs' },
    { title: 'Entreprises', path: '/companies' },
    { title: 'À propos', path: '/about' },
    { title: 'Blog', path: '/blog' },
    { title: 'FAQ', path: '/faq' },
  ];

  return (
    <footer className="bg-gradient-to-br from-indigo-800 via-purple-700 to-indigo-900 text-white py-12 shadow-lg relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500"></div>
      <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-purple-500 opacity-20 blur-xl"></div>
      <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-indigo-500 opacity-20 blur-xl"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">

        <div className="mb-8">
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200 inline-block mb-4">
            TalentPool
          </h3>
          <p className="text-purple-100 max-w-lg mx-auto mb-6 leading-relaxed">
            Votre partenaire stratégique pour connecter les meilleurs talents aux entreprises visionnaires.
          </p>
          <div className="flex space-x-6 mt-4 justify-center">
            <a href="https://linkedin.com" className="hover:text-purple-300 transition-colors duration-300" aria-label="LinkedIn">
              <Linkedin size={22} />
            </a>
            <a href="https://twitter.com" className="hover:text-purple-300 transition-colors duration-300" aria-label="Twitter">
              <Twitter size={22} />
            </a>
            <a href="https://instagram.com" className="hover:text-purple-300 transition-colors duration-300" aria-label="Instagram">
              <Instagram size={22} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-2xl mx-auto">

          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 text-indigo-200">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <Mail size={18} className="mr-3 text-purple-300" />
                <a href="mailto:contact@talentpool.com" className="text-purple-100 hover:text-white transition-colors duration-200">
                  contact@talentpool.com
                </a>
              </div>
              <div className="flex items-center justify-center">
                <Phone size={18} className="mr-3 text-purple-300" />
                <a href="tel:+212695958149" className="text-purple-100 hover:text-white transition-colors duration-200">
                  +212 695 958 149
                </a>
              </div>
              <div className="flex items-center justify-center">
                <MapPin size={18} className="mr-3 text-purple-300" />
                <p className="text-purple-100">
                  123 Rue de Najah, 742 Safi, Maroc
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4 text-indigo-200">Navigation</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {menuItems.map((item, index) => (
                <Link 
                  key={index}
                  to={item.path} 
                  className="text-purple-100 hover:text-white transition-colors duration-200 flex items-center"
                >
                  <ExternalLink size={14} className="mr-1 opacity-70" />
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-purple-700/50 mt-10 pt-6 text-center text-purple-200">
          <p>&copy; {currentYear} TalentPool. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;