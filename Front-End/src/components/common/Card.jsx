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

  const getImageUrl = (imagePath) => {

    if (imagePath?.startsWith('http')) {
      return imagePath;
    }
    
    const cleanPath = imagePath?.replace(/^\/+/, '');
    
    if (!cleanPath) return null;
    
    return `http://localhost/storage/${cleanPath}`;
  };
    
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      {thumbnail && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img 
            src={getImageUrl(thumbnail)}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(`Failed to load image: ${getImageUrl(thumbnail)}`);
              e.target.onerror = null;
              e.target.src = 'https://cdn.prod.website-files.com/639cae3e6821d93b7765617b/64fad934b08a46c89acf2660_Article-consultant-en-recrutement.webp';
            }}
          />
        </div>
      )}
      
      <div className="p-5">
        {category && (
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mb-2">
            {category}
          </span>
        )}
        
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
        
        {shortDescription && (
          <p className="text-gray-600 mb-4">{shortDescription}</p>
        )}
        
        {formattedDate && (
          <div className="text-sm text-gray-500 mb-4">
            Publié le {formattedDate}
          </div>
        )}
        
        {link && (
          <Link 
            to={link}
            className="inline-block bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded transition duration-200"
          >
            Voir détails
          </Link>
        )}
        
        {actions && (
          <div className="flex mt-4 space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );

};

export default Card;