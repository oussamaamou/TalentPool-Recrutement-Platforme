const Button = ({ 
    children, 
    type = 'button', 
    variant = 'primary', 
    className = '', 
    fullWidth = false,
    disabled = false,
    onClick
  }) => {
    const baseClasses = 'py-2 px-4 rounded focus:outline-none transition duration-200';
    
    const variantClasses = {
      primary: 'bg-purple-700 hover:bg-purple-800 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      outline: 'bg-transparent border border-purple-700 hover:bg-purple-50 text-purple-700',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white'
    };
    
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
      <button
        type={type}
        className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${widthClass} ${className}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };
  
  export default Button;