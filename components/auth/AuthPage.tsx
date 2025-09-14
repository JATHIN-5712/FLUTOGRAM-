import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
// FIX: Added .ts extension to import path
import { api } from '../../services/api.ts';

interface AuthPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string, phone: string, avatarUrl?: string) => Promise<void>;
}

type BackendStatus = 'checking' | 'online' | 'offline';

const BackendStatusIndicator: React.FC<{ status: BackendStatus }> = ({ status }) => {
  const statusConfig = {
    checking: { text: 'Checking...', color: 'bg-yellow-500' },
    online: { text: 'Online', color: 'bg-green-500' },
    offline: { text: 'Offline', color: 'bg-red-500' },
  };

  const { text, color } = statusConfig[status];

  return (
    <div className="flex items-center justify-center space-x-2 mb-4 text-sm text-gray-400">
      <span>Backend Status:</span>
      <span className="flex items-center space-x-1.5">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`}></span>
        <span>{text}</span>
      </span>
    </div>
  );
};

const BackendOfflineWarning: React.FC = () => (
    <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg mb-6 text-left">
        <h3 className="font-bold text-lg mb-2 text-center">Backend Connection Error</h3>
        <p className="text-sm">
            Could not connect to the deployed backend server.
        </p>
        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
            <li>Please make sure your backend is running correctly on your hosting provider (e.g., Render).</li>
            <li>Check the deployment logs for any errors.</li>
            <li>Ensure the URLs in `services/api.ts` and `services/socketService.ts` match your deployed backend URL exactly.</li>
        </ul>
    </div>
);


export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking');

  useEffect(() => {
    const checkStatus = async () => {
      const isOnline = await api.healthCheck();
      setBackendStatus(isOnline ? 'online' : 'offline');
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Check more frequently
    return () => clearInterval(interval);
  }, []);

  const isBackendOnline = backendStatus === 'online';

  const handleLoginAttempt = async (email: string, password: string) => {
    setError('');
    setIsLoading(true);
    try {
      await onLogin(email, password);
      // On success, App will change state and this component will unmount
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
    }
  };

  const handleRegisterAttempt = async (name: string, email: string, password: string, phone: string, avatarUrl?: string) => {
    setError('');
    setIsLoading(true);
    try {
      await onRegister(name, email, password, phone, avatarUrl);
       // On success, App will change state and this component will unmount
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-400">Flutogram</h1>
        <p className="text-center text-gray-400 mb-6">Your AI-Powered Social Sphere</p>
        
        <BackendStatusIndicator status={backendStatus} />

        {backendStatus === 'offline' && <BackendOfflineWarning />}

        {isLogin 
          ? <LoginForm onLogin={handleLoginAttempt} isLoading={isLoading} apiError={error} isBackendOnline={isBackendOnline} /> 
          : <RegisterForm onRegister={handleRegisterAttempt} isLoading={isLoading} apiError={error} isBackendOnline={isBackendOnline} />
        }
        
        <div className="text-center mt-6 p-4 bg-gray-800 rounded-lg">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-blue-400 hover:underline ml-2 font-semibold"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};