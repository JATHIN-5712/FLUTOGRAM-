import React, { useState } from 'react';
// FIX: Added .tsx extension to import path
import { SpinnerIcon } from '../common/Icons.tsx';

interface RegisterFormProps {
    onRegister: (name: string, email: string, password: string, phone: string, avatarUrl?: string) => Promise<void>;
    isLoading: boolean;
    apiError: string;
    isBackendOnline: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, isLoading, apiError, isBackendOnline }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!name || !email || !password || !phone) {
        setFormError('Please fill in all required fields.');
        return;
    }
    
    const handleRegistration = (avatarUrl?: string) => {
      onRegister(name, email, password, phone, avatarUrl);
    }

    if (profilePictureFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
            handleRegistration(reader.result as string);
        };
        reader.readAsDataURL(profilePictureFile);
    } else {
        handleRegistration();
    }
  };

  return (
    <div className={`bg-gray-800 p-8 rounded-lg shadow-lg transition-opacity ${!isBackendOnline ? 'opacity-50' : ''}`}>
      <fieldset disabled={!isBackendOnline} className={`${!isBackendOnline ? 'cursor-not-allowed' : ''}`}>
        <h2 className="text-2xl font-bold mb-6 text-center">Create your Account</h2>
        <form onSubmit={handleSubmit} noValidate>
           <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input 
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600" 
              id="name" 
              type="text" 
              placeholder="Alex Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
             />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input 
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600" 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
           <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="phone">
              Mobile Number
            </label>
            <input 
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600" 
              id="phone" 
              type="tel" 
              placeholder="123-456-7890" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
             />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input 
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-600" 
              id="password" 
              type="password" 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
              <label className="block text-sm font-bold mb-2" htmlFor="profile-picture">
                  Profile Picture (Optional)
              </label>
              <div className="flex items-center space-x-4">
                  {previewUrl ? (
                      <img src={previewUrl} alt="Profile preview" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                      </div>
                  )}
                  <input 
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                      id="profile-picture" 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                  />
              </div>
          </div>
          {formError && <p className="text-red-500 text-sm text-center mb-4">{formError}</p>}
          {apiError && <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>}
          <button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={isLoading || !isBackendOnline}
          >
            {isLoading ? <SpinnerIcon className="animate-spin h-6 w-6" /> : 'Sign Up'}
          </button>
        </form>
      </fieldset>
    </div>
  );
};