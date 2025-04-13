import React, { useState } from 'react';

function LoginForm() {

    const [formData, setFormData] = useState({
    nom:'',
    prenom:'',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
    });
    };

    const validateForm = () => {
    const newErrors = {};

    if (!formData.nom){
        newErrors.nom = 'Last Name is required'
    }
    
    if (!formData.prenom){
        newErrors.prenom = 'First Name is required'
    }

    if (!formData.email) {
        newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
        newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    return newErrors;
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
    }
    
    setErrors({});
    
    console.log('Form submitted successfully:', formData);
    };

    return(
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
            <label htmlFor="prenom" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Votre Prenom</label>
            <input 
                type="text" 
                name="prenom" 
                id="prenom" 
                value={formData.prenom}
                onChange={handleChange}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${
                errors.prenom ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:focus:ring-purple-500 dark:focus:border-purple-500'
                }`}
                placeholder="Ali"
            />
            {errors.prenom && <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>}
            </div>
            <div>
            <label htmlFor="nom" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Votre Nom</label>
            <input 
                type="text" 
                name="nom" 
                id="nom" 
                value={formData.nom}
                onChange={handleChange}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${
                errors.nom ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:focus:ring-purple-500 dark:focus:border-purple-500'
                }`}
                placeholder="Rachad"
            />
            {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
            </div>
            <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input 
                type="email" 
                name="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${
                errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:focus:ring-purple-500 dark:focus:border-purple-500'
                }`}
                placeholder="name@company.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input 
                type="password" 
                name="password" 
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${
                errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:focus:ring-purple-500 dark:focus:border-purple-500'
                }`}
                placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>
            
            <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
            <input 
                type="password" 
                name="confirmPassword" 
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${
                errors.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500' : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500 dark:border-gray-600 dark:focus:ring-purple-500 dark:focus:border-purple-500'
                }`}
                placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
            
            <div className="flex items-start">
            <div className="flex items-center h-5">
                <input 
                id="acceptTerms" 
                name="acceptTerms"
                type="checkbox" 
                checked={formData.acceptTerms}
                onChange={handleChange}
                className={`w-4 h-4 border rounded bg-gray-50 focus:ring-3 ${
                    errors.acceptTerms ? 'border-red-500 focus:ring-red-500 dark:border-red-500' : 'border-gray-300 focus:ring-purple-300 dark:border-gray-600 dark:focus:ring-purple-600 dark:ring-offset-gray-800'
                }`}
                />
            </div>
            <div className="ml-3 text-sm">
                <label htmlFor="acceptTerms" className={`font-light ${errors.acceptTerms ? 'text-red-500 dark:text-red-500' : 'text-gray-500 dark:text-gray-300'}`}>
                I accept the <a className="font-medium text-purple-600 hover:underline dark:text-purple-500" href="#">Terms and Conditions</a>
                </label>
                {errors.acceptTerms && <p className="mt-1 text-sm text-red-500">{errors.acceptTerms}</p>}
            </div>
            </div>
            
            <button 
            type="submit" 
            className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            >
            Create an account
            </button>
            
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account? <a href="#" className="font-medium text-purple-600 hover:underline dark:text-purple-500">Login here</a>
            </p>
        </form>
    );


    
}

export default LoginForm;