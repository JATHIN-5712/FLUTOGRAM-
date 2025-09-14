import React, { useState } from 'react';
// FIX: Added .tsx extension to import path
import { SpinnerIcon } from '../common/Icons.tsx';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  apiError: string;
  isBackendOnline: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, apiError, isBackendOnline }) => {
  // FIX: Pre-filled with mock user credentials for easier testing
  const [email, setEmail] = useState('alex@test.com');
  const [password, setPassword] = useState('password');
  const [formError, setFormError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!email || !password) {
      setFormError('Please fill in all fields.');
      return;
    }
    onLogin(email, password);
  };

  return (
    <div className={`bg-gray-800 p-8 rounded-lg shadow-lg transition-opacity ${!isBackendOnline ? 'opacity-50' : ''}`}>
      <fieldset disabled={!isBackendOnline} className={`${!isBackendOnline ? 'cursor-not-allowed' : ''}`}>
        <h2 className="text-2xl font-bold mb-6 text-center">Login to your account</h2>
        <form onSubmit={handleSubmit}>
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
            />
          </div>
          {formError && <p className="text-red-500 text-sm text-center mb-4">{formError}</p>}
          {apiError && <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>}
          <button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={isLoading || !isBackendOnline}
          >
            {isLoading ? <SpinnerIcon className="animate-spin h-6 w-6" /> : 'Sign In'}
          </button>
        </form>
      </fieldset>
    </div>
  );
};