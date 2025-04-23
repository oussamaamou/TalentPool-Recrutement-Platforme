import { Link } from 'react-router-dom';

const Card = ({
  title,
  description,
  thumbnail,
  link,
  category,
  date,
  actions
}) => {

  const formattedDate = date ? new Date(date).toLocaleDateString() : null;

  const shortDescription = description?.length > 150
    ? description.substring(0, 150) + '...'
    : description;

  const getImageUrl = (thumbnail) => {
    if (!thumbnail) return null;
    
    if (thumbnail.startsWith('http')) {
      return thumbnail;
    }
    
    const cleanPath = thumbnail.replace(/^\/+/, '');
    
    if (!cleanPath) return null;
    
    return `http://localhost/storage/${cleanPath}`;
  };
    
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
      {thumbnail && (
        <div className="relative h-56 overflow-hidden">
          <img 
            src={getImageUrl(thumbnail)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              console.error(`Failed to load image: ${getImageUrl(thumbnail)}`);
              e.target.onerror = null;
              e.target.src = 'https://cdn.prod.website-files.com/639cae3e6821d93b7765617b/64fad934b08a46c89acf2660_Article-consultant-en-recrutement.webp';
            }}
          />
          {category && (
            <span className="absolute top-4 right-4 bg-white text-purple-800 font-medium text-xs px-3 py-1.5 rounded-full shadow-md">
              {category}
            </span>
          )}
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors duration-200">
          {title}
        </h2>
        
        {shortDescription && (
          <p className="text-gray-600 mb-4 flex-grow">{shortDescription}</p>
        )}
        
        <div className="mt-auto">
          {formattedDate && (
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Publié le {formattedDate}
            </div>
          )}
          
          {link && (
            <Link 
              to={link}
              className="inline-flex items-center px-4 py-2.5 bg-purple-700 text-white font-medium rounded-lg hover:bg-purple-800 transition-colors duration-200 group-hover:shadow-md"
            >
              Postuler
              <svg className="ml-2 w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
              </svg>
            </Link>
          )}
          
          {actions && (
            <div className="flex mt-4 space-x-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  

};


export default Card;